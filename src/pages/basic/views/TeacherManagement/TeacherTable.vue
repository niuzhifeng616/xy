<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <row>
        <i-col span="6" class="left-body">
          <div class="left-box">
            <div class="box-header">
              <h3 style="font-weight: bold;">
                教师组织
                <span style="font-weight:normal;font-size:14px;" v-if="selectOrgName!==''">({{selectOrgName}})</span>
              </h3>
              <Icon type="md-add" color="#4196FF" size="18" @click="addOrgModal('')" />
            </div>
            <div class="box-body">
              <tree class="tree-dom" :empty-text="emptyTxt" :data="teacherTree"></tree>
            </div>
          </div>
        </i-col>
        <i-col span="18">
          <div class="clearfix" style="margin-bottom:10px;">
            <div class="fl">
              <Button  class="xy-primary" @click="teacherCreat">新增教师</Button>
              <Button  class="xy-info" @click="batchImport">批量导入</Button>
              <dropdown @on-click="more" trigger="click">
                <Button  class="xy-info">
                  更多操作
                  <icon type="ios-arrow-down"></icon>
                </Button>
                <dropdown-menu slot="list">
                  <dropdown-item name="1">批量删除</dropdown-item>
                  <dropdown-item name="2">批量更新教师</dropdown-item>
                  <dropdown-item name="3">批量更新用户名</dropdown-item>
                  <dropdown-item name="4">批量更新头像</dropdown-item>
                  <dropdown-item name="5">批量锁定</dropdown-item>
                  <dropdown-item name="6">批量解锁</dropdown-item>
                  <dropdown-item name="7">全部导出</dropdown-item>
                </dropdown-menu>
              </dropdown>
              <Button  class="xy-info" @click="screening">筛选</Button>
            </div>
            <div class="fr pr">
              <i-input
                search
                clearable
                v-model.trim="searchText"
                @on-search="FromSubmit"
                placeholder="请输入用户名/工号/姓名"
                class="xy-content-title-search"
                style="width: auto;"
                >
                <icon type="ios-search cursor-p" slot="suffix" />
              </i-input>
            </div>
          </div>
          <XyAntTable
            :rowSelection="tableRowSelection"
            :columns="columns"
            :dataSource="tbData"
            :nullData="nullData"
            :tableLoading="tableLoading"
            :pagination="pagination"
            @change="handleTableChange"
            :scrollx="800"
            >
            <div slot="IconRender" slot-scope="text, record">
              <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
                <span class="head-font">
                  {{ xy.showName(record.FullName)}}
                </span>
              </div>
              <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
            </div>
            <div slot="UserNameRender" slot-scope="text, record">
              <div style="min-width:200px">
                {{record.UserName.replace(/\s/g, '&nbsp;')}}
              </div>
            </div>
            <div slot="FullNameRender" style="min-width:180px" slot-scope="text, record" @click="editOpera(record)">
              <span class="table-el-hover">
              {{record.FullName.replace(/\s/g, '&nbsp;')}}
              </span>
            </div>
            <div slot="switchRender" slot-scope="text, record">
              <a-switch checked-children="锁定" un-checked-children="未锁" :checked="record.Locked" @change="switchFun(record)" />
            </div>
            <span slot="oprateRender" slot-scope="text, record">
              <a @click="editOpera(record)">编辑</a>
              <a-divider type="vertical" />
              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  更多
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item @click="del(record)">删除</a-menu-item>
                  <a-menu-item :disabled="!record.IsWechat" @click="wechatClick(record)">解绑微信</a-menu-item>
                  <a-menu-item @click="lookRole(record)">查看权限</a-menu-item>
                  <a-menu-item @click="resetPassword(record)">重置密码</a-menu-item>
                  <a-menu-item @click="adjustOrg(record)">调整组织</a-menu-item>
                  <a-menu-item @click="loginLog(record)">登录日志</a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </XyAntTable>
          <!-- 添加组织 -->
          <modal v-model="modalAddOrg" :mask-closable="false" :transfer="false">
            <div>
              <p>{{addOrgTitle}}</p>
              <div style="margin-top:25px;">
                <Input
                  v-model="addOrgName"
                  placeholder="请输入组织名称"
                  required
                  clearable />
              </div>
            </div>
            <div slot="footer">
              <Button  class="xy-modal-close" @click="modalAddOrg=false">取消</Button>
              <Button  class="xy-modal-primary" shape="circle" @click="addOrgSubmit">确定</Button>
            </div>
          </modal>
          <!-- 添加子组织 -->
          <Modal v-model="modalAddOrgs" :mask-closable="false" :transfer="false">
              <p slot="header">添加子组织</p>
              <div style="font-size:14px;max-height:300px;overflow-y:scroll;">
                  <h1 style="padding-bottom:10px;" class="col0-25">请输完组织名称后按回车键完成添加, 再继续输入组织名称，依此类推。
                  </h1>
                  <span @click="setDefaultOrgs" class="add-btn"><Icon type="md-add" />快速添加组织</span>
                  <div class="pr mt-10">
                    <!-- <span @click="setDefaultOrgs" class="add-btn pa"><Icon type="md-add" />快速添加组织</span> -->
                    <vue-tags-input
                      v-model="tag"
                      :tags="tags"
                      placeholder="请输入组织名称，按回车键确认"
                      :avoid-adding-duplicates="false"
                      @before-adding-tag="beforeAddingTag"
                      @before-deleting-tag="boforeDeletingTag"
                      class="add-orgs" />
                      <!-- :validation="validation" -->
                      <!-- @tags-changed="newTags"  此方法可以取消设置：:avoid-adding-duplicates="false" 是否禁止添加重复的标签。此处不禁止,重复时候要做自定义提示。-->
                  </div>
              </div>
              <div slot="footer">
                  <Button class="xy-modal-close" @click="addOrgsCancel">取消</Button>
                  <Button class="xy-modal-primary" shape="circle" @click="addOrgsSubmit">确定</Button>
              </div>
          </Modal>
          <!-- 重命名组织 -->
          <modal
            v-model="modalRenameOrg"
            :transfer="false"
            title="重命名组织"
            :mask-closable="false"
            >
            <div>
              <i-input
                v-model="renameOrg.organizationName"
                placeholder="请输入组织名称"
                clearable />
            </div>
            <div slot="footer">
              <Button class="xy-btn-close" @click="cancelEditrenameOrgModal">取消</Button>
              <Button class="xy-btn-primary" shape="circle" @click="renameOrgSubmit">保存</Button>
            </div>
          </modal>
          <!-- 筛选 -->
          <modal
            v-model="modalScreening"
            :transfer="false"
            title="筛选教师"
            :mask-closable="false"
            >
            <div style="padding:10px 50px;font-size:14px;">
              <div style="margin-bottom:15px;">
                <label>职务：</label>
                <i-select v-model="dutyID" style="width:200px;">
                  <i-option value="0">所有职务</i-option>
                  <i-option v-for="item in dutyData" :value="item.DutyID" :key="item.DutyID">{{ item.DutyName }}</i-option>
                </i-select>
              </div>
              <div style="margin-bottom:15px;">
                <label>头像：</label>
                <radio-group v-model="headPhoto">
                  <radio label="0">
                    <span>全部</span>
                  </radio>
                  <radio label="1">
                    <span>有</span>
                  </radio>
                  <radio label="2">
                    <span>没有</span>
                  </radio>
                </radio-group>
              </div>
              <div style="margin-bottom:15px;">
                <label>性别：</label>
                <radio-group v-model="sex">
                  <radio label="0">
                    <span>全部</span>
                  </radio>
                  <radio label="1">
                    <span>男</span>
                  </radio>
                  <radio label="2">
                    <span>女</span>
                  </radio>
                </radio-group>
              </div>
              <div style="margin-bottom:15px;">
                <label>状态：</label>
                <radio-group v-model="lock">
                  <radio label="0">
                    <span>全部</span>
                  </radio>
                  <radio label="1">
                    <span>锁定</span>
                  </radio>
                  <radio label="2">
                    <span>未锁</span>
                  </radio>
                </radio-group>
              </div>
              <div style="margin-bottom:15px;">
                <label>微信：</label>
                <radio-group v-model="weChat">
                  <radio label="0">
                    <span>全部</span>
                  </radio>
                  <radio label="1">
                    <span>已绑定</span>
                  </radio>
                  <radio label="2">
                    <span>未绑定</span>
                  </radio>
                </radio-group>
              </div>
            </div>
            <div slot="footer">
              <Button  class="xy-modal-close" @click="modalScreening = false">取消</Button>
              <Button  class="xy-modal-primary" shape="circle" @click="screeningSubmit">保存</Button>
            </div>
          </modal>
          <!-- 重置密码 -->
          <modal
            v-model="modalChangeUsersPassword"
            :transfer="false"
            @on-visible-change="visibleChange"
            title="重置密码"
            :mask-closable="false"
            >
            <div class="dialog-model-content">
              <i-form
                ref="formValidateChangeUsersPassword"
                @submit.native.prevent
                :model="formValidateChangeUsersPassword"
                :rules="ruleValidateChangeUsersPassword"
                label-position="top"
                >
                <form-item label="新密码" prop="formPassword" labelFor="formPassword">
                  <i-input
                    elementId="formPassword"
                    type="password"
                    v-model="formValidateChangeUsersPassword.formPassword"
                    clearable />
                </form-item>
              </i-form>
            </div>
            <div slot="footer">
              <Button  class="xy-modal-close" @click="ChangeUsersPasswordCancel">取消</Button>
              <Button  class="xy-modal-primary" shape="circle" @click="ChangeUsersPasswordSubmit">保存</Button>
            </div>
          </modal>
          <!-- 调整组织 -->
          <modal
            v-model="modalAdjustOrg"
            :transfer="false"
            title="调整组织"
            width="800"
            :mask-closable="false"
            >
            <div style="height:500px;">
              <row>
                <i-col span="12" style="padding-right:20px;">
                  <div style="border-bottom:1px solid #eee;padding:10px">待选</div>
                  <div style="height:460px;overflow:auto">
                    <tree :data="adjustTeacherTree" multiple @on-select-change="treeSelect"></tree>
                  </div>
                </i-col>
                <i-col span="12" style="border-left:1px solid #eee;padding-left:20px;">
                  <div style="border-bottom:1px solid #eee;padding:10px">已选</div>
                  <div class="adjust-tag" style="height:460px;overflow:auto;margin-top: 6px;">
                    <tag
                      type="border"
                      closable
                      color="primary"
                      class="nowrap"
                      @on-close="tagClose(item)"
                      v-for="item in checkData"
                      :key="item.fullName"
                      >
                      {{item.fullName}}
                    </tag>
                  </div>
                </i-col>
              </row>
            </div>
            <div slot="footer">
              <Button  class="xy-modal-close" @click="modalAdjustOrg=false">取消</Button>
              <Button  class="xy-modal-primary" shape="circle" @click="adjustOrgSubmit">保存</Button>
            </div>
          </modal>
        </i-col>
      </row>
    </div>
    <XyUpfile
      ref="upfile"
      :modalTitle="upload.title"
      :describeData="upload.tipData"
      :fileFormt="upload.formtData"
      :fileSize="upload.size"
      :importPath="upload.upUrl"
      :paramsData="upload.upParams"
      :templateUrl="upload.templateUrl"
      :errorUrl="upload.errorUrl"
      @successLoad="refresh"
      >
    </XyUpfile>
  </div>
</template>

<script>
  // 添加子组织
  import VueTagsInput from '@johmun/vue-tags-input'
  // 引入上传模版
  import XyUpfile from '@/components/upFile/XyUpfile'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  const pic = require('@/assets/common/yrykb.png')
  export default {
    name: 'TeacherTable',
    components: {
      VueTagsInput,
      XyAntTable,
      XyUpfile
    },
    data () {
      return {
        emptyTxt: '正在加载中...',
        upload: {
          apiPath: this.$store.state.apiPath,
          poto: pic,
          title: '上传demo',
          tipData: [],
          formtData: ['txt'],
          size: 1024,
          upUrl: '//jsonplaceholder.typicode.com/posts/',
          upParams: {},
          templateUrl: '',
          errorUrl: ''
        },
        selectionAll: [],
        showBtnId: -1,
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            scopedSlots: { customRender: 'IconRender' },
            className: 'table-pic'
          }, {
            title: '姓名',
            dataIndex: 'FullName',
            scopedSlots: { customRender: 'FullNameRender' }
          }, {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserNameRender' }
          },
          {
            title: '性别',
            dataIndex: 'SexName',
            width: 80
          },
          {
            title: '锁定状态',
            width: 100,
            scopedSlots: { customRender: 'switchRender' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 140,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        tbData: [],
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        teacherTree: [],
        // 搜索条件
        searchText: '',
        selectOrganizationID: 0,
        selectSchoolionID: 0,
        selectOrgName: '',
        schoolId: 0,
        // 添加组织
        modalAddOrg: false,
        addOrgTitle: '',
        addParent: '',
        addOrgName: '',

        // 添加子组织
        modalAddOrgs: false,
        selectFunc: '',
        tag: '',
        tags: [],
        isVali: true, // 添加时候 验证通过
        // validation: [{
        //   classes: 'min-length',
        //   rule: tag => tag.text.length > 20
        // }],
        defaultOrgs: [],

        // 重命名组织
        modalRenameOrg: false,
        editNameOld: '', // 编辑班级的名称
        renameOrg: '',
        // 筛选
        modalScreening: false,
        dutyID: 0,
        dutyData: [],
        headPhoto: '0',
        sex: '0',
        lock: '0',
        weChat: '0',
        // 重置密码
        modalChangeUsersPassword: false,
        editId: '',
        formValidateChangeUsersPassword: {
          formPassword: ''
        },
        ruleValidateChangeUsersPassword: {
          formPassword: [
            {
              required: true,
              message: '密码不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 20,
              min: 8,
              message: '密码需要8-20字符',
              trigger: 'blur'
            },
            {
              // eslint-disable-next-line no-control-regex
              pattern: /^[\x00-\xff]{8,20}$/,
              message: '请在英文状态下输入密码',
              trigger: 'blur'
            },
            {
              pattern: /((?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))[A-Za-z\d#@!~%^&*]{8,20}/,
              message: '请使用数字、字母、特殊字符中的两种组合，字母区分大小写',
              trigger: 'blur'
            }
          ]
        },
        // 调整组织
        modalAdjustOrg: false,
        adjustUser: {},
        checkData: [],
        adjustTeacherTree: []
      }
    },
    created () {
      if (Object.keys(this.$store.state.base.teacherKeyWords).length > 0) {
        let res = this.$store.state.base.teacherKeyWords
        this.pagination.current = res.PageIndex
        this.pagination.pageSize = res.PageSize
        this.selectOrganizationID = res.organizationId
        this.schoolId = res.schoolId
        this.dutyID = res.dutyId
        this.headPhoto = res.isIcon
        this.sex = res.isSex
        this.lock = res.isLock
        this.weChat = res.isWechat
        this.searchText = res.searchText
      }
      this.$store.commit('base/changeValue', {})
      this.getTeacherOrganizationAll()
    },
    mounted () {
      this.loadTable()
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange
        }
      }
    },
    watch: {
      tag (val) {
        if (val === '') {
          this.isVali = true
        }
      }
    },
    methods: {
      editOpera (record) {
        record.pageData = this.getParams()
        this.GoEditClick(record)
      },
      wechatClick (record) {
        if (record.IsWechat) {
          this.wechat(record)
        }
      },
      lookRole (record) {
        record.pageData = this.getParams()
        this.settingPro(record)
      },
      loginLog (record) {
        record.pageData = this.getParams()
        this.GoUserLoginClick(record)
      },
      handleTableChange () {
        this.loadTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 导入后刷新
      refresh () {
        this.loadTable()
        this.getTeacherOrganizationAll()
      },
      // 右侧表格多选操作（批量删除）
      changeSelect (data) {
        this.selectionAll = data
      },
      getParams () {
        return {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          organizationId: this.selectOrganizationID || 0,
          schoolId: this.schoolId || 0,
          dutyId: this.dutyID || 0,
          isIcon: this.headPhoto || '0',
          isSex: this.sex || '0',
          isLock: this.lock || '0',
          isWechat: this.weChat || '0',
          searchText: this.searchText
        }
      },
      // 左侧树
      async getTeacherOrganizationAll () {
        this.emptyTxt = '正在加载中...'
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Teacher/GetTeacherOrganizationAll`, null, true)
        if (res.success) {
          let resData = res.data
          if (res.data.length === 0) {
            this.emptyTxt = '暂无教师组织，请联系管理员。'
          }
          this.teacherTree = []
          //    OrganizationType:O 自定义组织，可以增删改，
          //    OrganizationType:M 只能增加子组，
          // tree 最多只有有10级

          for (let i = 0; i < resData.length; i++) {
            let render = (h, func) => {
              let treeType = func.data.organizationType === 'O' && this.showBtnId !== func.data.id
              return h('span', {
                class: ['tree-li']
              }, [
                h('span', {
                  class: ['ivu-tree-title', 'ivu-tree-width'],
                  domProps: {
                    title: func.data.title
                  },
                  style: {
                    fontSize: '14px'
                  }
                }, [
                  h('span', {
                    on: {
                      click: () => {
                        this.selectOrgName = func.data.organizationName
                        this.selectOrganizationID = func.data.id
                        this.schoolId = func.data.schoolId
                        this.pagination.current = 1
                        this.resetScreening()
                        this.loadTable()
                      }
                    }
                  }, (func.data.title.length >= 15 ? `${func.data.title.substr(0, 14)}...` : func.data.title) + func.data.number)
                ]),
                h('span', {
                  // style: {
                  //   display: 'inline-block',
                  //   float: 'right'
                  // }
                }, [
                  h('span', {
                    // style: {
                    //   display: 'inline-block',
                    //   float: 'right'
                    // }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'md-more',
                        custom: 'xy-table-btn xy-table-hover xy-rotate'
                      },
                      attrs: {
                        title: '更多'
                      },
                      style: {
                        display: treeType ? 'inline-block' : 'none',
                        // float: 'right',
                        'margin-right': '10px'
                      },
                      on: {
                        click: () => {
                          this.showBtnId = func.data.id
                        }
                      }
                    }),
                    h('Icon', {
                      props: {
                        type: 'md-create',
                        custom: 'xy-tree-btn xy-tree-hover'
                      },
                      style: {
                        display: func.data.organizationType === 'O' && this.showBtnId === func.data.id ? 'inline-block' : 'none'
                        // float: 'left'
                      },
                      attrs: {
                        title: '编辑'
                      },
                      on: {
                        click: () => {
                          this.renameOrgModal(func.data)
                        }
                      }
                    }),
                    h('Icon', {
                      props: {
                        type: 'md-add',
                        custom: 'xy-tree-btn xy-tree-hover'
                      },
                      style: {
                        display: func.data.Level < 10 && ((func.data.organizationType === 'M') || (func.data.organizationType === 'O' && this.showBtnId === func.data.id)) ? 'inline-block' : 'none'
                        // float: 'right'
                      },
                      attrs: {
                        title: '创建子组'
                      },
                      on: {
                        click: () => {
                          this.addOrgModal(func.data)
                        }
                      }
                    }),
                    h('Icon', {
                      props: {
                        type: 'md-close',
                        custom: 'xy-tree-btn xy-tree-hover'
                      },
                      style: {
                        display: func.data.organizationType === 'O' && this.showBtnId === func.data.id ? 'inline-block' : 'none'
                        // float: 'right'
                      },
                      attrs: {
                        title: '删除'
                      },
                      on: {
                        click: () => {
                          this.delOrg(func.data)
                        }
                      }
                    })
                  ])
                ])
              ])
            }
            this.teacherTree.push({
              id: resData[i].OrganizationID,
              schoolId: resData[i].SchoolDistrictID,
              organizationType: resData[i].OrganizationType,
              title: resData[i].OrganizationName,
              number: '\xa0(' + resData[i].OrganizationPeopleCount + '人)',
              fullOrgName: resData[i].OrganizationName,
              organizationName: resData[i].OrganizationName,
              children: this.getTeacherChildren(resData[i].OrganizationListItem, resData[i].OrganizationName),
              expand: true,
              Level: resData[i].Level,
              // render: resData[i].OrganizationID > -1 ? render:'',
              render: render

            })
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      getTeacherChildren (orglist, orgName) { // 递归修改状态
        let result = []
        for (let i = 0; i < orglist.length; i++) {
          let render = (h, func) => {
            return h('span', {
              class: ['tree-li']
            }, [
              h('span', {
                class: ['ivu-tree-title', 'ivu-tree-width'],
                domProps: {
                  title: func.data.title
                },
                style: {
                  fontSize: '14px'
                }
              }, [
                h('span', {
                  on: {
                    click: () => {
                      this.selectOrgName = func.data.organizationName
                      this.selectOrganizationID = func.data.id
                      this.schoolId = func.data.schoolId
                      this.pagination.current = 1
                      this.resetScreening()
                      this.loadTable()
                    }
                  }
                }, (func.data.title.length >= 10 ? `${func.data.title.substr(0, 9)}...` : func.data.title) + func.data.number)
              ]),
              h('span', {
                // style: {
                //   display: 'inline-block',
                //   float: 'right'
                // }
              }, [
                h('span', {
                  // style: {
                  //   display: 'inline-block',
                  //   float: 'right'
                  // }
                }, [
                  h('Icon', {
                    props: {
                      type: 'md-more',
                      custom: 'xy-table-btn xy-table-hover xy-rotate'
                    },
                    attrs: {
                      title: '更多'
                    },
                    style: {
                      display: this.showBtnId !== func.data.id ? 'inline-block' : 'none',
                      // float: 'right',
                      'margin-right': '10px'
                    },
                    on: {
                      click: () => {
                        this.showBtnId = func.data.id
                      }
                    }
                  }),
                  h('Icon', {
                    props: {
                      type: 'md-create',
                      custom: 'xy-tree-btn xy-tree-hover'
                    },
                    attrs: {
                      title: '编辑'
                    },
                    style: {
                      display: this.showBtnId === func.data.id ? 'inline-block' : 'none'
                      // float: 'left'
                    },
                    on: {
                      click: () => {
                        this.renameOrgModal(func.data)
                      }
                    }
                  }),
                  h('Icon', {
                    props: {
                      type: 'md-add',
                      custom: 'xy-tree-btn xy-tree-hover'
                    },
                    style: {
                      display: func.data.Level < 10 && this.showBtnId === func.data.id ? 'inline-block' : 'none'
                      // float: 'right'
                    },
                    attrs: {
                      title: '创建子组'
                    },
                    on: {
                      click: () => {
                        this.addOrgModal(func.data)
                      }
                    }
                  }),
                  h('Icon', {
                    props: {
                      type: 'md-close',
                      custom: 'xy-tree-btn xy-tree-hover'
                    },
                    attrs: {
                      title: '删除'
                    },
                    style: {
                      display: this.showBtnId === func.data.id ? 'inline-block' : 'none'
                      // float: 'right'
                    },
                    on: {
                      click: () => {
                        this.delOrg(func.data)
                      }
                    }
                  })
                ])
              ])
            ])
          }
          if (orglist[i].OrganizationListItem.length > 0) {
            result.push({
              id: orglist[i].OrganizationID,
              schoolId: orglist[i].SchoolDistrictID,
              organizationType: orglist[i].OrganizationType,
              title: orglist[i].OrganizationName,
              number: '\xa0(' + orglist[i].OrganizationPeopleCount + '人)',
              fullOrgName: orgName + ' / ' + orglist[i].OrganizationName,
              organizationName: orglist[i].OrganizationName,
              children: this.getTeacherChildren(orglist[i].OrganizationListItem, orgName + ' / ' + orglist[i].OrganizationName),
              Level: orglist[i].Level,
              // render: orglist[i].IsEdit ? render : '',
              render: render
            })
          } else {
            result.push({
              id: orglist[i].OrganizationID,
              schoolId: orglist[i].SchoolDistrictID,
              organizationType: orglist[i].OrganizationType,
              title: orglist[i].OrganizationName,
              number: '\xa0(' + orglist[i].OrganizationPeopleCount + '人)',
              fullOrgName: orgName + ' / ' + orglist[i].OrganizationName,
              organizationName: orglist[i].OrganizationName,
              children: [],
              Level: orglist[i].Level,
              // render: orglist[i].IsEdit ? render : ''
              render: render
            })
          }
        }
        return result
      },
      // 添加组织
      addOrgModal (res) {
        this.addParent = res
        this.addOrgName = ''
        if (res === '') {
          this.addOrgTitle = '添加一级组织'
          this.modalAddOrg = true
        } else {
          this.tags = []
          this.tag = ''
          this.addOrgTitle = '添加子组织'
          this.modalAddOrgs = true
          this.getDefaultOrgs() // 获取默认组织数据
        }
      },
      // 获取默认教师组织
      async getDefaultOrgs () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/TeacherOrg/GetDefaultTeacherOrganization`, {
          parentID: this.addParent !== '' ? this.addParent.id : 0,
          schoolDistinctID: this.addParent !== '' ? this.addParent.schoolId : 0,
          organizationType: this.addParent !== '' ? this.addParent.organizationType : 'O'
        }, true)
        if (res.success) {
          this.defaultOrgs = []
          res.data.map((item) => {
            this.defaultOrgs.push({
              text: item,
              tiClasses: ['ti-valid']
            })
          })
        } else {}
      },
      // 添加默认教师组织
      setDefaultOrgs () {
        if (this.defaultOrgs.length === 0) {
          this.xy.msgError('推荐组织已添加。')
        } else {
          if (this.tags.length === 0) {
            for (let i = 0; i < this.defaultOrgs.length; i++) {
              this.tags.push(this.defaultOrgs[i])
            }
          } else {
            let addedArr = this.tags.map((item) => { return item.text })
            for (let i = 0; i < this.defaultOrgs.length; i++) {
              if (addedArr.indexOf(this.defaultOrgs[i].text) === -1) {
                this.tags.push(this.defaultOrgs[i])
              }
            }
          }
        }
      },
      // 添加标签
      beforeAddingTag (obj) {
        // 验证是否重复
        let addedArr = this.tags.map((item) => { return item.text }) // 当前即将创建的
        let added = this.addParent.children.map((item) => { return item.organizationName }) // tree中已经创建完的

        if (addedArr.indexOf(obj.tag.text) !== -1) {
          this.xy.msgError(`“${obj.tag.text}”已存在，请修改名称。`)
          this.isVali = false
          return false
        } else if (added.indexOf(obj.tag.text) !== -1) {
          this.xy.msgError(`“${obj.tag.text}”已存在，请修改名称。`)
          this.isVali = false
        } else {
          // 不重复时，验证标签字符长度
          this.isVali = true
          if (obj.tag.text.length > 20) {
            this.xy.msgError('组织名称限制20个字符。')
          } else {
            this.tags.push(obj.tag)
            this.tag = ''
          }
        }
      },
      // 删除标签
      boforeDeletingTag (obj) {
        for (let i = 0; i < this.tags.length; i++) {
          if (this.tags[i].text === obj.tag.text) {
            this.tags.splice(i, 1)
            this.isVali = true
          }
        }
      },
      // newTags (newTags) {
      // this.tags = newTags
      // this.tags.map((item) => {
      //   if (item.tiClasses.length > 1) {
      //     return this.xy.msgError('班级名称限制20个字符。')
      //   }
      // })
      // },
      // 确认添加子组织
      async addOrgsSubmit () {
        if (!this.isVali) {
          // this.xy.msgError(`“${this.tag}”已存在，请修改名称。..`)
          return false
        } else if (this.tag.length > 20) {
          // this.xy.msgError('组织名称限制20个字符。')
          return false
        } else if (this.tag.length === 0 && this.tags.length === 0) {
          this.xy.msgError('请输入组织名称。')
          return false
        } else if (this.tag.length <= 20 && this.tag.length > 0) {
          // ----输入框有未按回车的组织时候，点击确定时（已经有了添加过的样式）并未真正加入到this.tags中，需要手动添加
          let added = this.addParent.children.map((item) => { return item.organizationName }) // tree中已经创建完的
          // 验证是否与已添加的组织重复
          if (added.indexOf(this.tag) !== -1) {
            // this.xy.msgError(`“${this.tag}”已存在，请修改名称。`)
          } else {
            // 验证是否与待添加的组织重复
            let addTags = this.tags.map((item) => { return item.text })
            if (addTags.indexOf(this.tag) !== -1) {
              // this.xy.msgError(`“${this.tag}”已存在，请修改名称。`)
            } else {
              // 验证后添加到this.tags
              this.tags.push({
                text: this.tag,
                tiClasses: ['ti-valid']
              })
              this.tag = ''
            }
          }
          return false
        }
        let tName = []
        for (let i = 0; i < this.tags.length; i++) {
          tName.push(this.tags[i].text)
        }
        this.xy.loading()
        let params = {
          OrganizationName: this.addOrgName,
          OrganizationNames: tName,
          ParentID: this.addParent !== '' ? this.addParent.id : 0,
          SchoolDistrictID: this.addParent !== '' ? this.addParent.schoolId : 0,
          OrganizationType: this.addParent !== '' ? this.addParent.organizationType : 'O'
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/TeacherOrg/Create`, params)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('添加成功。')
          this.getTeacherOrganizationAll()
          this.modalAddOrgs = false
        }
        this.modalAddOrgs = false
      },
      // 取消添加子组织
      addOrgsCancel () {
        this.tags = []
        this.modalAddOrgs = false
      },

      // 确认添加一级组织
      async addOrgSubmit () {
        if (this.addOrgName === '') {
          this.xy.msgError('组织名称不能为空。')
          return false
        }
        if (this.addOrgName.indexOf('-') > -1) {
          this.xy.msgError('组织名称不能包含-。')
          return false
        }
        if (this.addOrgName.length > 20) {
          this.xy.msgError('组织名称限20个字符。')
          return false
        }
        this.xy.loading()
        let params = {
          OrganizationNames: [this.addOrgName],
          ParentID: this.addParent !== '' ? this.addParent.id : 0,
          SchoolDistrictID: this.addParent !== '' ? this.addParent.schoolId : 0,
          OrganizationType: this.addParent !== '' ? this.addParent.organizationType : 'O'
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Teacher/CreateTeacherOrganization`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('添加成功。')
          this.getTeacherOrganizationAll()
          this.modalAddOrg = false
        } else {
          this.xy.msgError(res.msg)
        };
      },
      // 重命名组织
      renameOrgModal (res) {
        this.renameOrg = res
        this.editNameOld = res.organizationName
        this.modalRenameOrg = true
      },
      cancelEditrenameOrgModal (res) {
        // 取消编辑名称
        this.modalRenameOrg = false
        this.renameOrg.organizationName = this.editNameOld
      },
      async renameOrgSubmit () {
        if (this.renameOrg.organizationName === '') {
          this.xy.msgError('组织名称不能为空。')
          return false
        }
        if (this.addOrgName.indexOf('-') > -1) {
          this.xy.msgError('组织名称不能包含-。')
          return false
        }
        if (this.renameOrg.organizationName.length > 20) {
          this.xy.msgError('组织名称限20个字符。')
          return false
        }
        this.xy.loading()
        let params = {
          OrganizationName: this.renameOrg.organizationName,
          OrganizationID: this.renameOrg.id,
          OrganizationType: this.renameOrg !== '' ? this.renameOrg.organizationType : 'O'
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Teacher/EditTeacherOrganization`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('修改成功。')
          this.getTeacherOrganizationAll()
          this.modalRenameOrg = false
        } else {
          this.xy.msgError(res.msg)
        };
      },
      // 删除组织
      delOrg (node) {
        let that = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + node.organizationName + '"组织吗？</p>',
          async onOk () {
            that.xy.loading()
            let params = {
              OrganizationName: node.organizationName,
              OrganizationID: node.id,
              OrganizationType: node ? node.organizationType : 'O'
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/Teacher/DelTeacherOrganization`, params, true)
            that.xy.unloading()
            if (res.success) {
              that.xy.msgSuc('删除成功。')
              that.getTeacherOrganizationAll()
              that.modalRenameOrg = false
            } else {
              that.xy.msgError(res.msg)
            };
          }
        })
      },
      // 右侧表格数据
      async loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Teacher/GetPage`, this.getParams(), true)
        if (res.success) {
          this.tbData = res.data.data
          this.pagination.total = res.data.totalRecords
        } else {
          this.xy.msgError(res.msg)
        }
        this.tableLoading = false
      },
      // 关键字回车事件
      FromSubmit () {
        this.pagination.current = 1
        this.loadTable()
      },
      more (res) {
        let that = this
        switch (res) {
          case '1': // 批量删除
            let idsStr = []
            if (this.selectionAll.length < 1) {
              this.xy.msgError('请勾选要删除的教师。')
            } else {
              this.$Modal.confirm({
                title: '批量删除',
                content: '<p>您确定要批量删除所有选中的教师？</p>',
                async onOk () {
                  for (let item in that.selectionAll) {
                    idsStr.push(that.selectionAll[item].UserID)
                  }
                  that.xy.loading()
                  let res = await that.xy.post(`${that.$store.state.apiPath}/api/Teacher/DeleteByIds?ids=${idsStr.join(',')}`, null, true)
                  that.xy.unloading()
                  if (!res.success) {
                    that.xy.msgError(res.msg)
                    return false
                  } else {
                    that.xy.msgSuc('删除成功。')
                    // 删除最后一页最后一条时，自动返回上一页
                    that.getTeacherOrganizationAll()
                    if (that.selectionAll.length === that.tbData.length && that.tbData.length > 1) {
                      that.pagination.current = that.pagination.current - 1
                    }
                    that.selectionAll = []
                    that.loadTable()
                  }
                }
              })
            }
            break
          case '2': // 批量更新教师
            this.batchTeacherImport()
            break
          case '3': // 批量更新用户名
            this.batchNameImport()
            break
          case '4': // 批量更新头像
            this.batchPhotoImport()
            break
          case '5': // 批量锁定
            let idsStrs = []
            if (this.selectionAll.length < 1) {
              this.xy.msgError('请勾选要锁定的教师。')
            } else {
              this.$Modal.confirm({
                title: '批量锁定',
                content: '<p>您确定要批量锁定所有选中的教师？</p>',
                async onOk () {
                  that.xy.loading()
                  for (let item in that.selectionAll) {
                    idsStrs.push(that.selectionAll[item].UserID)
                  }
                  let params = {
                    UserIDs: idsStrs,
                    Locked: true
                  }
                  let res = await that.xy.post(`${that.$store.state.apiPath}/api/Teacher/BatchEditUsersLocked`, params, true)
                  that.xy.unloading()
                  if (res.success) {
                    that.xy.msgSuc('操作成功。')
                    that.selectionAll = []
                    that.loadTable()
                  } else {
                    that.xy.msgError(res.msg)
                  }
                }
              })
            };
            break
          case '6': // 批量解锁
            let idsStr6 = []
            if (this.selectionAll.length < 1) {
              this.xy.msgError('请勾选要解锁的教师。')
            } else {
              this.$Modal.confirm({
                title: '批量解锁',
                content: '<p>您确定要批量解锁所有选中的教师？</p>',
                async onOk () {
                  for (let item in that.selectionAll) {
                    idsStr6.push(that.selectionAll[item].UserID)
                  }
                  let params = {
                    UserIDs: idsStr6,
                    Locked: false
                  }
                  that.xy.loading()
                  let res = await that.xy.post(`${that.$store.state.apiPath}/api/Teacher/BatchEditUsersLocked`, params, true)
                  that.xy.unloading()
                  if (res.success) {
                    that.xy.msgSuc('操作成功。')
                    that.selectionAll = []
                    that.loadTable()
                  } else {
                    that.xy.msgError(res.msg)
                  }
                }
              })
            }
            break
          case '7': // 全部导出
            if (this.pagination.total === 0) {
              this.xy.msgError('暂无要导出得教师。')
              return false
            }
            this.$Modal.confirm({
              title: '全部导出',
              content: '<p>您本次共导出' + this.pagination.total + '名教师</p>',
              onOk () {
                that.xy.downFile(`${that.$store.state.apiPath}/api/Teacher/ExportUsers`, that.getParams())
              }
            })
            break
        }
      },
      // 批量更新教师
      batchTeacherImport () {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '批量更新用户', // 标题
          ipData: [], // 提示语句
          formtData: ['xlsx', 'xls'], // 支持的文件类型
          size: 1024, // 文件大小限制，单位 kb
          upUrl: `${this.$store.state.apiPath}/api/Teacher/ImportEdirTeac`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/Teacher/DownloadTemplateImportEditTeac`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/Teacher/DownloadExceptionImportEdirTeac` // 下载错误文件url
        }
      },
      // 批量更新用户名
      batchNameImport () {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '批量更新用户名', // 标题
          ipData: [], // 提示语句
          formtData: ['xlsx', 'xls'], // 支持的文件类型
          size: 1024, // 文件大小限制，单位 kb
          upUrl: `${this.$store.state.apiPath}/api/Teacher/ImportEdirTeacSC`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/Teacher/DownloadTemplateImportEditTeacSC`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/Teacher/DownloadExceptionImportEdirTeacSC` // 下载错误文件url
        }
      },
      // 批量更新头像
      batchPhotoImport () {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '批量更新头像', // 标题
          ipData: ['请上传您要更新的zip压缩文件。您也可以点击“下载模板”按钮，下载示例文件。'], // 提示语句
          formtData: ['zip'], // 支持的文件类型
          size: 200000, // 文件大小限制，单位 kb
          upUrl: `${this.$store.state.apiPath}/api/Teacher/EditNewUsersIcon`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/Teacher/DownloadTemplateEditNewUsersIcon`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/Teacher/DownloadExceptionEditNewUsersIcon` // 下载错误文件url
        }
      },
      // 批量导入
      batchImport () {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '批量导入', // 标题
          ipData: [], // 提示语句
          formtData: ['xlsx', 'xls'], // 支持的文件类型
          size: 1024, // 文件大小限制，单位 kb
          upUrl: `${this.$store.state.apiPath}/api/Teacher/Import`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/Teacher/DownloadTemplateImport`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/Teacher/DownloadExceptionImport` // 下载错误文件url
        }
      },
      // 筛选
      async screening () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Duty/GetAll`, null, true)
        this.xy.unloading()
        if (res.success) {
          this.dutyData = res.data
          this.modalScreening = true
        } else {
          this.xy.msgError(res.msg)
        }
      },
      screeningSubmit () {
        this.$store.commit('base/changeValue', this.getParams())
        this.pagination.current = 1
        if (this.pagination.current === 1) {
          this.loadTable()
          this.modalScreening = false
        }
      },
      // 重置筛选条件
      resetScreening () {
        this.dutyID = '0'
        this.headPhoto = '0'
        this.sex = '0'
        this.lock = '0'
        this.weChat = '0'
        this.searchText = ''
      },
      // 编辑
      GoEditClick (row) {
        this.$store.commit('common/getThreeMenuName', '编辑教师信息')
        this.$store.commit('common/getParam', { userID: row.UserID })
        this.$store.commit('base/changeValue', this.getParams())
        this.$router.push({ name: 'teacherEdit', query: this.$store.state.common.menuInfo
        })
      },
      // 删除
      del (row) {
        let that = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + row.FullName + '"吗？</p>',
          async onOk () {
            that.xy.loading()
            let params = {
              UserId: row.UserID
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/Teacher/DelTeacher`, params, true)
            that.xy.unloading()
            if (res.success) {
              that.getTeacherOrganizationAll()
              that.xy.msgSuc('删除成功。')
              if (that.tbData.length > 1) {
                that.tbData.length = that.tbData.length - 1
              } else {
                if (that.pagination.current > 1) {
                  that.pagination.current = that.pagination.current - 1
                }
              }
              that.loadTable()
            } else {
              that.xy.msgError(res.msg)
            }
          }
        })
      },
      // 解绑微信
      wechat (row) {
        let that = this
        this.$Modal.confirm({
          title: '解绑微信',
          content: '<p>您确定要解绑"' + row.FullName + '"当前所绑定的微信吗？</p>',
          async onOk () {
            that.xy.loading()
            let params = {
              UserId: row.UserID
            }
            let res = await that.xy.post(`${that.xyApi}/msg/api/WeChat/RemoveWeChatOpenID`, params, true)
            that.xy.unloading()
            if (res.success) {
              that.loadTable()
              that.xy.msgSuc('解绑成功。')
            } else {
              that.xy.msgError(res.msg)
            }
          }
        })
      },
      // 设置权限
      settingPro (row) {
        this.$store.commit('common/getThreeMenuName', '查看教师权限')
        this.$store.commit('common/getParam', { row: JSON.stringify(row) })
        this.$store.commit('base/changeValue', this.getParams())
        this.$router.push({ name: 'teacherUserPermissionView', query: this.$store.state.common.menuInfo })
      },
      // 重置密码
      resetPassword (row) {
        this.editId = row.UserID
        this.modalChangeUsersPassword = true
      },
      ChangeUsersPasswordCancel () {
        this.modalChangeUsersPassword = false
        this.$refs.formValidateChangeUsersPassword.resetFields()
      },
      visibleChange (val) {
        if (!val) {
          this.modalChangeUsersPassword = false
          this.$refs.formValidateChangeUsersPassword.resetFields()
        }
      },
      ChangeUsersPasswordSubmit () {
        this.$refs.formValidateChangeUsersPassword.validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.notifyPassword()
            this.$refs.formValidateChangeUsersPassword.resetFields()
          }
        })
      },
      async notifyPassword () {
        this.xy.loading()
        let params = {
          UserId: this.editId,
          Password: this.formValidateChangeUsersPassword.formPassword
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Teacher/ResetUsersPassword`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('密码已重置。')
          this.modalChangeUsersPassword = false
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 跳转用户登录日志页面
      GoUserLoginClick (row) {
        this.$store.commit('common/getThreeMenuName', '教师登录日志')
        this.$store.commit('common/getParam', { row: JSON.stringify(row) })
        this.$store.commit('base/changeValue', this.getParams())
        this.$router.push({ name: 'teacherLog', query: this.$store.state.common.menuInfo })
      },
      // 调整组织
      async adjustOrg (row) {
        this.adjustUser = row
        this.xy.loading()
        let params = {
          userId: row.UserID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Teacher/GetTeacherOrganization`, params, true)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          this.adjustTeacherTree = []
          this.checkData = []
          for (let i = 0; i < resData.length; i++) {
            this.adjustTeacherTree.push({
              id: resData[i].SchoolDistrictID,
              title: resData[i].OrganizationName,
              fullName: resData[i].OrganizationTreeName || resData[i].OrganizationName,
              OrganizationID: resData[i].OrganizationID,
              ParentID: resData[i].ParentID,
              SchoolDistrictID: resData[i].SchoolDistrictID,
              selected: resData[i].IsSelection,
              children: this.adjustTeacherRepeat(resData[i].OrganizationListItem)
            })
            if (resData[i].IsSelection) {
              this.checkData.push({
                id: resData[i].SchoolDistrictID,
                title: resData[i].OrganizationName,
                fullName: resData[i].OrganizationTreeName,
                OrganizationID: resData[i].OrganizationID,
                ParentID: resData[i].ParentID,
                SchoolDistrictID: resData[i].SchoolDistrictID,
                selected: resData[i].IsSelection
              })
            }
          }
          this.modalAdjustOrg = true
        } else {
          this.xy.msgError(res.msg)
        }
      },
      adjustTeacherRepeat (ogrList) {
        let result = []
        for (let i = 0; i < ogrList.length; i++) {
          if (ogrList[i].IsSelection) {
            this.checkData.push({
              id: ogrList[i].SchoolDistrictID,
              title: ogrList[i].OrganizationName,
              fullName: ogrList[i].OrganizationTreeName,
              OrganizationID: ogrList[i].OrganizationID,
              ParentID: ogrList[i].ParentID,
              SchoolDistrictID: ogrList[i].SchoolDistrictID,
              selected: ogrList[i].IsSelection
            })
          }
          if (ogrList[i].OrganizationListItem.length > 0) {
            result.push({
              id: ogrList[i].SchoolDistrictID,
              title: ogrList[i].OrganizationName,
              fullName: ogrList[i].OrganizationTreeName,
              OrganizationID: ogrList[i].OrganizationID,
              ParentID: ogrList[i].ParentID,
              SchoolDistrictID: ogrList[i].SchoolDistrictID,
              selected: ogrList[i].IsSelection,
              children: this.adjustTeacherRepeat(ogrList[i].OrganizationListItem)
            })
          } else {
            result.push({
              id: ogrList[i].SchoolDistrictID,
              title: ogrList[i].OrganizationName,
              fullName: ogrList[i].OrganizationTreeName,
              OrganizationID: ogrList[i].OrganizationID,
              ParentID: ogrList[i].ParentID,
              SchoolDistrictID: ogrList[i].SchoolDistrictID,
              selected: ogrList[i].IsSelection,
              children: []
            })
          }
        }
        return result
      },
      treeSelect (res, resa) {
        if (resa.OrganizationID !== 0) {
          let index = this.checkData.map(item => {
            return item.OrganizationID
          }).indexOf(resa.OrganizationID)
          if (index !== -1) {
            this.checkData.splice(index, 1)
          } else {
            this.checkData.push(resa)
          }
        } else {
          resa.selected = false
        }
      },
      tagClose (res) {
        let index = this.checkData.map(function (item) {
          return item.title
        }).indexOf(res.title)
        this.checkData.splice(index, 1)
        this.cancleSelect(this.adjustTeacherTree, res)
      },
      cancleSelect (arr, closeObj) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].title === closeObj.title) {
            arr[i].selected = false
            return false
          }
          if (arr[i].children !== undefined) {
            if (arr[i].children.length > 0) {
              this.cancleSelect(arr[i].children, closeObj)
            }
          }
        }
      },
      async adjustOrgSubmit () {
        let postData = []
        this.checkData.forEach((item) => {
          postData.push({
            OrgID: item.OrganizationID,
            MemberID: this.adjustUser.UserID
          })
        })
        if (postData.length === 0) {
          this.xy.msgError('至少选择一个组织。')
          return false
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Teacher/EditTeacherSelfOrganization`, postData, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          this.modalAdjustOrg = false
          this.getTeacherOrganizationAll()
          this.loadTable()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 锁定，解锁
      async switchFun (row) {
        this.xy.loading()
        let params = {
          UserId: row.UserID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Teacher/LockTeacher`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('操作成功。')
          this.loadTable()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 新增教师
      teacherCreat () {
        this.$router.push({ path: '/xyHome/teacherCreate' })
      }
    }
  }
</script>
<style lang="less" scoped>
  .nowarp {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .left-box {
    margin-right: 20px;
    border: 1px solid #e3e3e3;
  }
  .box-header {
    height: 58px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #4196ff;
    padding: 0 10px;
    font-size: 16px;
  }
  .box-header i {
    border: 1px solid #4196ff;
    border-radius: 5px;
    cursor: pointer;
  }
  .box-body {
    height: 820px;
    overflow: auto;
  }
  .tree-dom {
    padding: 10px 14px;
  }
  .tree-dom .ivu-tree-width {
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 60%;
  }
  .tree-dom .tree-li {
    display: inline-block;
    width: 100%;
    min-width: 200px;
  }
  .student .ivu-modal {
    top: 50px !important;
  }
  .adjust-tag .ivu-tag-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
    display: inline-block;
    vertical-align: middle;
  }
  .fl {
    float: left;
    button {
      margin-right: .5em;
    }
  }
  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
  .add-btn{
    left: 7px;
    top: 7px;
    z-index: 9;
    width: 122px;
    background: #fff;
    line-height: 24px;
    padding: 0 10px 0 8px;
    border: 1px dashed #1677ff;
    border-radius: 4px;
    font-size: 14px;
    color: #1677ff;
    cursor: pointer;

    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
    i{
      margin-right: 3px;
    }
  }
  // .add-orgs .ti-tag:first-child{
  //   margin-left: 115px;
  // }

</style>
