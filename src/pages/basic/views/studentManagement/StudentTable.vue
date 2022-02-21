<template>
<div class="xy-content-module">
    <div class="xy-content-body">
        <row>
            <i-col span="6" class="left-body">
                <div class="left-box">
                    <div class="box-header">
                        <h3 style="font-weight: bold;">
                            学生组织
                            <span style="font-weight:normal;font-size:14px;" v-cloak v-if="selectOrgName!=''">({{selectOrgName}})</span>
                        </h3>
                        <Tooltip placement="top" v-if='!isGraduate'>
                            <span style="background: #ccc;padding: 5px;color: #fff;">毕业学生</span>
                            <div slot="content" >
                                <p>无毕业学生</p>
                            </div>
                        </Tooltip>
                        <span style="color:#4196FF;cursor:pointer" @click="graduate" v-else>毕业学生</span>
                    </div>
                    <div class="box-body">
                        <tree class="tree-dom" :empty-text="emptyTxt" @on-select-change="treeSelect" :data="studentTree"></tree>
                    </div>
                </div>
            </i-col>
            <i-col span="18">
                <div class="clearfix" style="margin-bottom:10px;">
                    <div class="fl">
                        <Button  class="xy-primary" @click="teacherCreat">新增学生</Button>
                        <Button  class="xy-info" @click="batchImport">批量导入</Button>
                        <!-- <cropper-demo></cropper-demo> -->
                        <dropdown @on-click="more" trigger="click">
                            <Button  class="xy-info">
                                更多操作
                                <icon type="ios-arrow-down"></icon>
                            </Button>
                            <dropdown-menu slot="list">
                                <dropdown-item name="1">批量删除</dropdown-item>
                                <dropdown-item name="2">批量更新学生</dropdown-item>
                                <dropdown-item name="3">批量更新用户名</dropdown-item>
                                <dropdown-item name="4">批量更新头像</dropdown-item>
                                <dropdown-item name="5">批量锁定</dropdown-item>
                                <dropdown-item name="6">批量解锁</dropdown-item>
                                <dropdown-item name="7">全部导出</dropdown-item>
                                <dropdown-item name="8">批量更新班级</dropdown-item>
                            </dropdown-menu>
                        </dropdown>
                        <Button class="xy-info" @click="modalScreening=true">筛选</Button>
                    </div>
                    <div class="fr pr">
                        <i-input
                          search
                          clearable
                          v-model.trim="searchText"
                          @on-search="FromSubmit"
                          placeholder="请输入用户名/学籍号/姓名"
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
                :scrollx="970"
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
                    <div style="min-width:100px">
                      {{record.UserName.replace(/\s/g, '&nbsp;')}}
                    </div>
                  </div>
                  <div slot="FullNameRender" style="min-width:150px"  slot-scope="text, record">
                    <span class="table-el-hover" @click="editOpera(record)">
                      {{record.FullName.replace(/\s/g, '&nbsp;')}}
                    </span>
                    <span v-show="record.UserStateName && record.UserStateName!=='正常'" class="student-tag">
                      {{record.UserStateName}}
                    </span>
                  </div>
                  <div style="min-width:160px" slot="GradeRender" slot-scope="text, record">
                    {{record.StudentGradeNameForStudentYearName}}
                  </div>
                  <div slot="switchRender" slot-scope="text, record">
                    <a-switch checked-children="锁定" un-checked-children="未锁" :checked="record.Locked" @change="switchFun(record)" />
                  </div>
                  <span slot="oprateRender" slot-scope="text, record">
                    <a @click="editOpera(record)">编辑</a>
                    <a-divider type="vertical" />
                    <a-dropdown :trigger="['click']">
                      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                        更多 <a-icon type="down" />
                      </a>
                      <a-menu slot="overlay">
                        <a-menu-item @click="del(record)">删除</a-menu-item>
                        <a-menu-item :disabled="!record.OpenID" @click="wechatClick(record)">解绑微信</a-menu-item>
                        <a-menu-item @click="lookRole(record)">查看权限</a-menu-item>
                        <a-menu-item @click="resetPassword(record)">重置密码</a-menu-item>
                        <a-menu-item @click="adjustOrg(record)">调整班级</a-menu-item>
                        <a-menu-item @click="studentMove(record)">学生异动</a-menu-item>
                        <a-menu-item @click="loginLog(record)">登录日志</a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </span>
                </XyAntTable>

                <!-- 添加班级 -->
                <modal v-model="modalAddClass" :mask-closable="false" :transfer="false">
                    <p slot="header">添加班级</p>
                    <div style="font-size:14px;max-height:300px;overflow-y:scroll;">
                        <h1 style="padding-bottom:10px;">请输完一个班级名称后按回车键, 再输入另一个班级名称，依此类推。</h1>
                        <vue-tags-input
                          v-model="tag"
                          :tags="tags"
                          :validation="validation"
                          placeholder="请输入班级名称，按回车键确认"
                          @tags-changed="newTags" />
                    </div>
                    <div slot="footer">
                        <Button class="xy-modal-close" @click="addClassCancel">取消</Button>
                        <Button class="xy-modal-primary" shape="circle" @click="addClassSubmit">保存</Button>
                    </div>
                </modal>
                <!-- 添加班级 当前无班级，数字创建 -->
                <Modal v-model="creatClassNum"
                      title="添加班级"
                      :mask-closable="false"
                      :closable="true"
                      :transfer="false">
                    <div class="dialog-model-content">
                        <Form ref="formOrgCount" :model="formOrgCount" :rules="orgCountValidate" label-position="top" @submit.native.prevent>
                            <FormItem label="请填写要创建的班级数量，保存后将会批量创建相关班级" prop="orgCount" label-for="orgCount">
                                <InputNumber
                                  placeholder="请输入班级数量"
                                  v-model="formOrgCount.orgCount"
                                  elementId="orgCount"
                                  :min="1"
                                  :max="50"
                                  style="width: 100%" />
                                  <!-- :precision="0" -->
                            </FormItem>
                        </Form>
                    </div>
                    <div slot="footer">
                        <Button class="xy-modal-close" @click="classNumCancel">取消</Button>
                        <Button class="xy-modal-primary" shape="circle" @click="classNumSubmit">保存</Button>
                    </div>
                </Modal>
                <!-- 重命名班级 -->
                <modal v-model="modalRenameOrg" :mask-closable="false" :transfer="false" title="重命名班级">
                    <div>
                        <Input v-model="renameOrg.fullOrgName" placeholder="请输入班级名" clearable />
                    </div>
                    <div slot="footer">
                        <Button class="xy-modal-close" @click="cancelEditTreeName">取消</Button>
                        <Button class="xy-modal-primary" shape="circle" @click="renameOrgSubmit">保存</Button>
                    </div>
                </modal>
                <!-- 筛选 -->
                <modal v-model="modalScreening" :mask-closable="false" :transfer="false" title="筛选学生" v-cloak>
                    <div style="padding:10px 50px;font-size:14px;">
                        <div style="margin-bottom:15px;">
                            <label>家长：</label>
                            <radio-group v-model="parent">
                                <radio :label="0">
                                    <span>全部</span>
                                </radio>
                                <radio :label="1">
                                    <span>已关联</span>
                                </radio>
                                <radio :label="2">
                                    <span>未关联</span>
                                </radio>
                            </radio-group>
                        </div>
                        <div style="margin-bottom:15px;">
                            <label>头像：</label>
                            <radio-group v-model="headPhoto">
                                <radio :label="0">
                                    <span>全部</span>
                                </radio>
                                <radio :label="1">
                                    <span>有</span>
                                </radio>
                                <radio :label="2">
                                    <span>没有</span>
                                </radio>
                            </radio-group>
                        </div>
                        <div style="margin-bottom:15px;">
                            <label>性别：</label>
                            <radio-group v-model="sex">
                                <radio :label="0">
                                    <span>全部</span>
                                </radio>
                                <radio :label="1">
                                    <span>男</span>
                                </radio>
                                <radio :label="2">
                                    <span>女</span>
                                </radio>
                            </radio-group>
                        </div>
                        <div style="margin-bottom:15px;">
                            <label>状态：</label>
                            <radio-group v-model="status">
                                <radio :label="0">
                                    <span>全部</span>
                                </radio>
                                <radio :label="1">
                                    <span>锁定</span>
                                </radio>
                                <radio :label="2">
                                    <span>未锁</span>
                                </radio>
                            </radio-group>
                        </div>
                        <div style="margin-bottom:15px;">
                            <label>微信：</label>
                            <radio-group v-model="weChat">
                                <radio :label="0">
                                    <span>全部</span>
                                </radio>
                                <radio :label="1">
                                    <span>已绑定</span>
                                </radio>
                                <radio :label="2">
                                    <span>未绑定</span>
                                </radio>
                            </radio-group>
                        </div>
                    </div>
                    <div slot="footer">
                        <Button class="xy-modal-close" @click="modalScreening = false">取消</Button>
                        <Button class="xy-modal-primary" shape="circle" @click="screeningSubmit">保存</Button>
                    </div>
                </modal>
                <!-- 重置密码 -->
                <modal v-model="modalChangeUsersPassword" :mask-closable="false" @on-visible-change="visibleChange" :transfer="false" title="重置密码" v-cloak>
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
                                  type="password"
                                  v-model="formValidateChangeUsersPassword.formPassword"
                                  elementId="formPassword"
                                  clearable
                                  >
                                </i-input>
                            </form-item>
                        </i-form>
                    </div>
                    <div slot="footer">
                        <Button class="xy-modal-close" @click="ChangeUsersPasswordCancel">取消</Button>
                        <Button class="xy-modal-primary" shape="circle" @click="ChangeUsersPasswordSubmit">保存</Button>
                    </div>
                </modal>
                <!-- 调整班级 -->
                <modal v-model="modalAdjustOrg" :mask-closable="false" :transfer="false" title="调整班级" v-cloak>
                    <div>
                        <div style="margin-bottom:10px;">班级：</div>
                        <i-select v-model="selectClassID">
                            <i-option
                              v-for="item in selectClassData"
                              :value="item.StudentOrganizationID"
                              :key="item.StudentOrganizationID"
                              >
                              {{ item.StudentOrganizationName }}
                            </i-option>
                        </i-select>
                    </div>
                    <div slot="footer">
                        <Button class="xy-modal-close" @click="modalAdjustOrg=false">取消</Button>
                        <Button class="xy-modal-primary" shape="circle" @click="adjustOrgSubmit">保存</Button>
                    </div>
                </modal>
                <!-- 学生异动 -->
                <modal v-model="modalStudentMove" :mask-closable="false" :transfer="false" title="学生异动" v-cloak>
                    <div style="height:150px;">
                        <radio-group v-model="moveType" type="button" @on-change="radioMove">
                            <radio :label="item.UserStateID" v-for="item in moveTypeData" :key="item.UserStateID" v-cloak v-show='item.UserStateID!=1'>
                              {{item.UserStateName}}
                            </radio>
                        </radio-group>
                        <!--跳级-->
                        <div v-if="moveType==2" style="margin:20px 0;">
                            <label style="margin-bottom:10px;font-size:14px;">年级-班级：</label>
                            <cascader
                              :data="moveYearClassData"
                              v-model="moveSelect"
                              :class="moveYearClassData.length==0?'stu_cascader':''"
                              >
                            </cascader>
                        </div>
                        <!--留级-->
                        <div v-if="moveType==3" style="margin:20px 0;">
                            <label style="margin-bottom:10px;font-size:14px;">年级-班级：</label>
                            <cascader
                              :data="moveYearClassData"
                              v-model="moveSelect"
                              :class="moveYearClassData.length==0?'stu_cascader':''"
                              >
                            </cascader>
                        </div>
                        <!--休学-->
                        <div v-if="moveType==4||moveType==1" style="margin:50px 0;">
                            <!-- <p style="font-size:16px;font-weight:bold;text-align:center;margin:20px;">您确定要休学吗？</p> -->
                            <radio-group v-model="outOftype" type="button" @on-change="radioMove">
                                <radio :label="item.UserStateID" v-for="item in moveTypeData" :key="item.UserStateID" v-cloak v-show='item.UserStateID==1||item.UserStateID==4'>
                                  {{item.UserStateName}}
                                </radio>
                            </radio-group>

                        </div>
                    </div>
                    <div slot="footer">
                        <Button class="xy-modal-close" @click="modalStudentMove=false">取消</Button>
                        <Button class="xy-modal-primary" shape="circle" @click="moveSubmit">保存</Button>
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
  // import CropperDemo from '@/components/pictureCropping/CropperDemo.vue'
  import VueTagsInput from '@johmun/vue-tags-input'
  // 引入上传模版
  import XyUpfile from '@/components/upFile/XyUpfile'
  // 引入表格
  import XyAntTable from '@/components/table/XyAntTable.vue'
  // const poto = require('@/assets/common/yrykb.png')
  export default {
    name: 'StudentTable',
    components: {
      XyAntTable,
      XyUpfile,
      VueTagsInput
    },
    data () {
      return {
        emptyTxt: '正在加载中...',
        upload: {
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
        // antTable
        selectedRowKeys: [],
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
            title: '年级',
            dataIndex: 'StudentGradeNameForStudentYearName',
            scopedSlots: { customRender: 'GradeRender' }
          },
          {
            title: '班级',
            dataIndex: 'StudentOrganizationName',
            width: 100
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
        outOftype: 1, // 1：正常 4： 休学
        editNameOld: '', // 编辑班级的名称
        isGraduate: false, // 是否有毕业学生
        autocompleteItems: [{
          text: '113213'
        }, {
          text: 'toShort'
        }, {
          text: 'I am valid'
        }, {
          text: 'Cannot be added'
        }, {
          text: 'Invalid cause of "{"'
        }],
        validation: [{
          classes: 'min-length',
          rule: tag => tag.text.length > 10
        }],
        noDataText: '该搜索条件下没有结果。',
        // 左侧树
        checkData: [],
        studentTree: [],
        selectOrgName: '',
        // 搜索条件
        searchText: '',
        selectSchoolDistrictID: '0',
        selectStudentGradeID: '0',
        selectStudentOrganizationID: '0',
        isNoGrade: false,
        selectStudentGradeForStudentYearID: '0',

        // 添加班级
        modalAddClass: false,
        selectFunc: '',
        tag: '',
        tags: [],

        // 添加班级-当前无班级
        creatClassNum: false,
        formOrgCount: {
          orgCount: null
        },
        orgCountValidate: {
          orgCount: [
            { required: true, type: 'number', message: '请输入班级数量', trigger: 'blur' },
            { pattern: /^([1-9][0-9]{0,1}|50)$/, message: '请输入1-50的正整数', trigger: 'blur' }
          ]
        },

        // 重命名
        modalRenameOrg: false,
        renameOrg: '',
        // 筛选
        modalScreening: false,
        parent: 0,
        headPhoto: 0,
        sex: 0,
        status: 0,
        weChat: 0,
        Family: '0',
        Icon: '0',
        // 重置密码
        modalChangeUsersPassword: false,
        formValidateChangeUsersPassword: {
          formPassword: ''
        },
        ruleValidateChangeUsersPassword: {
          formPassword: [{
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
        // 调整班级
        modalAdjustOrg: false,
        selectClassData: [],
        selectClassID: '',
        selectStudent: '',
        // 学生异动
        modalStudentMove: false,
        moveType: '',
        moveTypeData: [],
        moveYearClassData: [],
        moveSelect: [],
        moveStudent: ''
      }
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
    created () {
      if (Object.keys(this.$store.state.base.studentKeyWords).length > 0) {
        let res = this.$store.state.base.studentKeyWords
        this.pagination.current = res.PageIndex
        this.pagination.pageSize = res.PageSize

        this.selectSchoolDistrictID = res.SchoolDistrictID
        this.selectStudentGradeID = res.StudentGradeID
        this.selectStudentOrganizationID = res.StudentOrganizationID
        this.isNoGrade = res.IsNoGrade
        this.selectStudentGradeForStudentYearID = res.StudentGradeForStudentYearID
        this.Family = res.parent
        this.Icon = res.headPhoto
        this.sex = res.Sex
        this.status = res.Lock
        this.weChat = res.WeChart
        this.searchText = res.seach
      }
      this.$store.commit('base/changeStudentKeyValue', {})
      this.getGraduate()
      this.getSchoolTree()
    },
    mounted () {
      this.loadTable()
    },
    methods: {
      editOpera (record) {
        this.GoEditClick(record)
      },
      wechatClick (record) {
        if (record.OpenID) {
          this.wechat(record)
        }
      },
      lookRole (record) {
        this.settingPro(record)
      },
      loginLog (row) {
        this.$store.commit('common/getThreeMenuName', '登录日志')
        this.$store.commit('common/getParam', { pro: '', userID: row.UserID })
        this.$store.commit('base/changeStudentKeyValue', this.getParams())
        this.$router.push({ name: 'studentLog', query: this.$store.state.common.menuInfo })
      },
      handleTableChange () {
        this.loadTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      onSelectFunc (selectedKeys, info) {
        this.selectedKeys = selectedKeys
      },
      // 导入后刷新
      refresh () {
        this.loadTable()
        this.getSchoolTree()
      },
      // 右侧表格多选操作（批量删除）
      changeSelect (data) {
        this.selectionAll = data
      },
      getParams () {
        return {
          SchoolDistrictID: this.selectSchoolDistrictID || 0,
          StudentGradeID: this.selectStudentGradeID || 0,
          StudentOrganizationID: this.selectStudentOrganizationID || 0,
          IsNoGrade: this.isNoGrade,
          StudentGradeForStudentYearID: this.selectStudentGradeForStudentYearID || 0,

          Family: this.parent || 0,
          Icon: this.headPhoto || 0,
          Sex: this.sex || 0,
          Lock: this.status || 0,
          WeChart: this.weChat || 0,
          // selectOrgName: this.selectOrgName || '0',
          seach: this.searchText,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,

          ISGraduation: false
        }
      },
      // 左侧树
      async getSchoolTree () {
        this.emptyTxt = '正在加载中...'
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Student/GetSchoolTree`, {
          schoolid: 0,
          isGraduation: false
        }, true)
        if (res.success) {
          let resData = res.data
          if (res.data.length === 0) {
            this.emptyTxt = '暂无学生组织，请联系管理员。'
          }
          this.studentTree = []
          for (let i = 0; i < resData.length; i++) {
            this.studentTree.push({
              id: resData[i].SchoolDistrictID,
              title: resData[i].SchoolDistrictName + '\xa0(' + resData[i].StuCount + '人)',
              fullOrgName: resData[i].SchoolDistrictName,
              schoolDistrictID: resData[i].SchoolDistrictID,
              studentGradeID: 0,
              studentGradeForStudentYearID: 0,
              studentYearID: 0,
              studentOrganizationID: 0,
              expand: true,
              children: [],
              IsNoGrade: resData[i].IsNoGrade
            })
            for (let m = 0; m < resData[i].GradeList.length; m++) {
              this.studentTree[i].children.push({
                id: resData[i].GradeList[m].StudentGradeID,
                title: resData[i].GradeList[m].StudentGradeName + '\xa0(' + resData[i].GradeList[m].StuCount + '人)',
                fullOrgName: resData[i].GradeList[m].StudentGradeName,
                schoolDistrictID: resData[i].SchoolDistrictID,
                studentGradeID: resData[i].GradeList[m].StudentGradeID,
                studentGradeForStudentYearID: resData[i].GradeList[m].StudentGradeForStudentYearID,
                studentYearID: 0,
                studentOrganizationID: 0,
                children: [],
                expand: this.selectFunc && this.selectFunc.schoolDistrictID === resData[i].SchoolDistrictID,
                IsNoGrade: resData[i].GradeList[m].IsNoGrade
              })
              for (let n = 0; n < resData[i].GradeList[m].YearList.length; n++) {
                this.studentTree[i].children[m].children.push({
                  id: resData[i].GradeList[m].YearList[n].StudentYearID,
                  title: resData[i].GradeList[m].YearList[n].StudentYearFullName + '\xa0(' + resData[i].GradeList[m].YearList[n].StuCount + '人)',
                  fullOrgName: resData[i].GradeList[m].YearList[n].StudentYearFullName,
                  children: [],
                  schoolDistrictID: resData[i].SchoolDistrictID,
                  studentGradeID: resData[i].GradeList[m].StudentGradeID,
                  studentGradeForStudentYearID: resData[i].GradeList[m].YearList[n].StudentGradeForStudentYearID,
                  studentYearID: resData[i].GradeList[m].YearList[n].StudentYearID,
                  studentOrganizationID: 0,
                  expand: this.selectFunc && this.selectFunc.studentGradeForStudentYearID === resData[i].GradeList[m].YearList[n].StudentGradeForStudentYearID,
                  IsNoGrade: resData[i].GradeList[m].YearList[n].IsNoGrade,
                  render: (h, func) => {
                    return h('span', {
                      class: ['tree-li']
                    }, [
                      h('span', {
                        class: ['ivu-tree-title'],
                        style: {
                          fontSize: '14px'
                        }
                      }, [
                        h('span', {
                          // on: {
                          //   click: () => {
                          //     this.treeSelect(func.data)
                          //   }
                          // }
                        }, func.data.title)
                      ]),
                      h('span', {
                          style: {
                            display: func.data.fullOrgName === '未在年级学生' ? 'none' : 'inline-block'
                          }
                        },
                        [
                          h('span', [
                            h('Icon', {
                              props: {
                                type: 'md-add',
                                custom: 'xy-tree-btn xy-tree-hover'
                              },
                              attrs: {
                                title: '创建子组'
                              },
                              on: {
                                click: () => {
                                  this.addClassModel(func.data)
                                }
                              }
                            })
                          ])
                        ])
                    ])
                  }
                })
                for (let k = 0; k < resData[i].GradeList[m].YearList[n].OrgList.length; k++) {
                  let render = (h, func) => {
                    return h('span', {
                      class: ['tree-li']
                    }, [
                      h('span', {
                        class: ['ivu-tree-title'],
                        style: {
                          fontSize: '14px'
                        }
                      }, [
                        h('span', {
                          // on: {
                          //   click: () => {
                          //     this.treeSelect(func.data)
                          //   }
                          // }
                        }, func.data.title)
                      ]),
                      h('span', {
                      }, [
                        h('span', {
                        }, [
                          h('Icon', {
                            props: {
                              type: 'md-create',
                              custom: func.data.fullOrgName === '未在班级学生' ? 'xy-tree-btn xy-tree-hover xy-tree-disabled' : 'xy-tree-btn xy-tree-hover'
                            },
                            attrs: {
                              title: '编辑'
                            },
                            on: {
                              click: () => {
                                if (func.data.fullOrgName !== '未在班级学生') {
                                  this.editTreeName(func.data)
                                }
                              }
                            }
                          }),
                          h('Icon', {
                            props: {
                              type: 'md-close',
                              custom: func.data.fullOrgName === '未在班级学生' ? 'xy-tree-btn xy-tree-hover xy-tree-disabled' : 'xy-tree-btn xy-tree-hover'
                            },
                            attrs: {
                              title: '删除'
                            },
                            on: {
                              click: () => {
                                if (func.data.fullOrgName !== '未在班级学生') {
                                  this.delClass(func.data)
                                }
                              }
                            }
                          })
                        ])
                      ])
                    ])
                  }
                  this.studentTree[i].children[m].children[n].children.push({
                    id: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationID,
                    title: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationName + '\xa0(' + resData[i].GradeList[m].YearList[n].OrgList[k].StuCount + '人)',
                    fullOrgName: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationName,
                    schoolDistrictID: resData[i].SchoolDistrictID,
                    studentGradeID: resData[i].GradeList[m].StudentGradeID,
                    studentGradeForStudentYearID: resData[i].GradeList[m].YearList[n].OrgList[k].StudentGradeForStudentYearID,
                    studentYearID: resData[i].GradeList[m].YearList[n].StudentYearID,
                    studentOrganizationID: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationID,
                    children: [],
                    IsNoGrade: resData[i].GradeList[m].YearList[n].OrgList[k].IsNoGrade,
                    render: render
                  })
                }
              }
            }
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      treeSelect (res) {
        if (res.length > 0) {
          this.selectOrgName = res[0].fullOrgName
          this.selectSchoolDistrictID = res[0].schoolDistrictID
          this.selectStudentGradeID = res[0].studentGradeID
          this.selectStudentOrganizationID = res[0].studentOrganizationID
          this.isNoGrade = res[0].IsNoGrade === undefined ? false : res[0].IsNoGrade
          this.selectStudentGradeForStudentYearID = res[0].studentGradeForStudentYearID
          this.pagination.current = 1
          this.resetScreening()
          this.loadTable()
        }
      },
      // 重置筛选条件
      resetScreening () {
        this.parent = 0
        this.headPhoto = 0
        this.status = 0
        this.sex = 0
        this.weChat = 0
        this.searchText = ''
        this.Family = this.parent
        this.Icon = this.headPhoto
        this.Sex = this.sex
        this.Lock = this.status
        this.WeChart = this.weChat
        this.seach = this.searchText
      },
      delClass (val) { // 删除班级
        let that = this
        that.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + val.fullOrgName + '"班级吗？</p>',
          async onOk () {
            that.xy.loading()
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/Student/NewDeleteStudentOrgByID?model=${[val.id]}`, null, true)
            that.xy.unloading()
            if (res.success) {
              that.xy.msgSuc('删除成功。')
              that.getSchoolTree()
            } else {
              that.xy.msgError(res.msg)
            }
          }
        })
      },
      editTreeName (res) { // 编辑名称
        this.renameOrg = res
        this.editNameOld = res.fullOrgName
        this.modalRenameOrg = true
      },
      cancelEditTreeName (res) { // 取消编辑名称
        this.modalRenameOrg = false
        this.renameOrg.fullOrgName = this.editNameOld
      },
      async renameOrgSubmit () {
        if (!this.renameOrg.fullOrgName) {
          this.xy.msgError('请输入班级名称。')
          return
        }
        this.xy.loading()
        let params = {
          StudentGradeForStudentYearID: this.renameOrg.studentGradeForStudentYearID,
          StudentOrganizationID: this.renameOrg.id,
          StudentOrganizationName: this.renameOrg.fullOrgName
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/NewEditOrgName`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('重命名成功。')
          this.modalRenameOrg = false
          this.getSchoolTree()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 添加班级
      addClassModel (res) {
        this.selectFunc = res
        this.tags = []
        if (res.children.length === 1) { // 未添加过班级时（不包含"未来在班级学生"）
          this.$refs.formOrgCount.resetFields()
          this.creatClassNum = true
        } else if (res.children.length > 1) {
          this.modalAddClass = true
        }
      },
      // 确认添加班级-根据数字添加
      classNumSubmit () {
        this.$refs.formOrgCount.validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.creatClassSubmit()
          }
        })
      },
      async creatClassSubmit () {
        this.xy.loading()
        let params = {
          SchoolDistrictID: this.selectFunc.schoolDistrictID,
          StudentYearID: this.selectFunc.studentYearID,
          StudentGradeID: this.selectFunc.studentGradeID,
          StudentGradeForStudentYearID: this.selectFunc.studentGradeForStudentYearID,
          StudentGradeNameForStudentYearName: this.selectFunc.fullOrgName,
          OrgNum: this.formOrgCount.orgCount
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/BatchNewCreateStudentOrg`, params)
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.creatClassNum = false
          this.$refs.formOrgCount.resetFields()
          this.getSchoolTree()
        }
        this.xy.unloading()
      },
      // 取消添加班级-根据数字添加
      classNumCancel () {
        this.$refs.formOrgCount.resetFields()
        this.creatClassNum = false
      },
      newTags (newTags) {
        this.tags = newTags
        newTags.map((item) => {
          if (item.tiClasses.length > 1) {
            return this.xy.msgError('班级名称限制10个字符。')
          }
        })
      },
      async addClassSubmit () {
        let status = true
        let tName = []
        if (this.tags.length === 0) {
          this.xy.msgError('请输入班级名称。')
          return
        }

        this.tags.map((item) => {
          if (item.tiClasses.length > 1) {
            this.xy.msgError('班级名称限制10个字符。')
            status = false
          }
        })
        if (!status) return
        for (let i = 0; i < this.tags.length; i++) {
          tName.push({
            StudentOrganizationName: this.tags[i].text
          })
        }

        this.xy.loading()
        let params = {
          SchoolDistrictID: this.selectFunc.schoolDistrictID,
          StudentYearID: this.selectFunc.studentYearID,
          StudentGradeID: this.selectFunc.studentGradeID,
          StudentGradeForStudentYearID: this.selectFunc.studentGradeForStudentYearID,
          StudentGradeNameForStudentYearName: this.selectFunc.fullOrgName,
          OrgList: tName
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/NewCreateStudentOrg`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('添加成功。')
          this.getSchoolTree()
          this.modalAddClass = false
        } else {
          this.xy.msgError(res.msg)
        }
        this.modalAddClass = false
      },
      addClassCancel () {
        this.tags = []
        this.modalAddClass = false
      },
      // 列表
      loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        // this.tbData = []
        // this.$store.commit('base/changeStudentKeyValue', this.getParams())
        this.xy.post(`${this.$store.state.apiPath}/api/Student/GetAllStudentPage`, this.getParams()).then(res => {
          if (res.success) {
            this.tbData = res.data.data
            this.pagination.total = res.data.totalRecords
          } else {
            this.xy.msgError(res.msg)
          }
          this.tableLoading = false
        })
      },
      FromSubmit () {
        this.seach = this.searchText
        this.pagination.current = 1
        this.loadTable()
      },
      more (res) {
        let that = this
        switch (res) {
          case '1': // 批量删除
            let idsStr = []
            if (that.selectionAll.length < 1) {
              that.xy.msgError('请勾选要删除的学生。')
            } else {
              that.$Modal.confirm({
                title: '批量删除',
                content: '<p>您确定要批量删除所有选中的学生？</p>',
                async onOk () {
                  for (let item in that.selectionAll) {
                    idsStr.push(that.selectionAll[item].UserID)
                  }
                  let res = await that.xy.post(`${that.$store.state.apiPath}/api/Student/DeleteByIds?ids=${idsStr.join(',')}`, null, true)
                  if (!res.success) {
                    that.xy.msgError(res.msg)
                    return false
                  } else {
                    that.xy.msgSuc('删除成功。')
                    if (that.selectionAll.length === that.tbData.length && that.tbData.length > 1) {
                      that.pagination.current = that.pagination.current - 1
                    }
                    that.selectionAll = []
                    that.getSchoolTree()
                    that.loadTable()
                  }
                }
              })
            }
            break
          case '2': // 批量更新学生
            that.batchTeacherImport()
            break
          case '3': // 批量更新用户名
            that.batchNameImport()
            break
          case '4': // 批量更新头像
            that.batchPhotoImport()
            break
          case '5': // 批量锁定
            let idsStr5 = []
            if (that.selectionAll.length < 1) {
              that.xy.msgError('请勾选要锁定的学生。')
            } else {
              that.$Modal.confirm({
                title: '批量锁定',
                content: '<p>您确定要批量锁定所有选中的学生？</p>',
                async onOk () {
                  for (let item in that.selectionAll) {
                    idsStr5.push(that.selectionAll[item].UserID)
                  }
                  let params = {
                    UserIDs: idsStr5,
                    Locked: true
                  }
                  let res = await that.xy.post(`${that.$store.state.apiPath}/api/Student/BatchEditUsersLocked`, params, true)
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
          case '6': // 批量解锁
            let idsStr6 = []
            if (that.selectionAll.length < 1) {
              that.xy.msgError('请勾选要解锁的学生。')
            } else {
              that.$Modal.confirm({
                title: '批量解锁',
                content: '<p>您确定要批量解锁所有选中的学生？</p>',
                async onOk () {
                  for (let item in that.selectionAll) {
                    idsStr6.push(that.selectionAll[item].UserID)
                  }
                  let params = {
                    UserIDs: idsStr6,
                    Locked: false
                  }
                  let res = await that.xy.post(`${that.$store.state.apiPath}/api/Student/BatchEditUsersLocked`, params, true)
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
            if (that.pagination.total === 0) {
              that.xy.msgError('暂无要导出得学生。')
              return false
            }
            that.$Modal.confirm({
              title: '全部导出',
              content: '<p>您本次共导出' + that.pagination.total + '名学生</p>',
              async onOk () {
                that.xy.downFile(`${that.$store.state.apiPath}/api/Student/ExportStudentOverall`, that.getParams())
              }
            })
            break
          case '8': that.batchClassImport()
                    break
        }
      },
      batchClassImport () {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '批量更新班级', // 标题
          ipData: [], // 提示语句
          formtData: ['xlsx', 'xls'], // 支持的文件类型
          size: 1024, // 文件大小限制，单位 kb
          upUrl: `${this.$store.state.apiPath}/api/Student/ImportEdirStuOrganization`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/Student/DownloadTemplateImportEditStuOrganization`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/Student/DownloadExceptionImportEditStuOrganization` // 下载错误文件url
        }
      },
      // 批量更新学生
      batchTeacherImport () {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '批量更新用户', // 标题
          ipData: [], // 提示语句
          formtData: ['xlsx', 'xls'], // 支持的文件类型
          size: 1024, // 文件大小限制，单位 kb
          upUrl: `${this.$store.state.apiPath}/api/Student/ImportEdirStu`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/Student/DownloadTemplateImportEditStu`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/Student/DownloadExceptionImportEdirStu` // 下载错误文件url
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
          upUrl: `${this.$store.state.apiPath}/api/Student/ImportEdirStuSC`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/Student/DownloadTemplateImportEditStuSC`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/Student/DownloadExceptionImportEdirStuSC` // 下载错误文件url
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
          upUrl: `${this.$store.state.apiPath}/api/Student/EditNewUsersIcon`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/Student/DownloadTemplateEditNewUsersIcon`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/Student/DownloadExceptionEditNewUsersIcon` // 下载错误文件url
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
          upUrl: `${this.$store.state.apiPath}/api/Student/ImportStu`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/Student/DownloadTemplateImportStu`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/Student/DownloadExceptionImportStu` // 下载错误文件url
        }
      },
      batchSubmit () {
        this.loadTable()
        this.getSchoolTree()
      },
      // 筛选
      screeningSubmit () {
        this.pagination.current = 1
        if (this.pagination.current === 1) {
          this.loadTable()
          this.modalScreening = false
        }
      },
      // 编辑
      GoEditClick (row) {
        this.$store.commit('common/getThreeMenuName', '编辑学生信息')
        this.$store.commit('common/getParam', { userID: row.UserID })
        this.$store.commit('base/changeStudentKeyValue', this.getParams())
        this.$router.push({ name: 'studentEdit', query: this.$store.state.common.menuInfo })
      },
      // 删除
      del (row) {
        // this.xy.confirm('删除', '<p>您确定要删除"' + row.FullName + '"吗？</p>', this.sureDel(row))
        let that = this
        that.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + row.FullName + '"吗？</p>',
          async onOk () {
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/Student/DeleteByIds?ids=${row.UserID}`, null, true)
            if (res.success) {
              that.getSchoolTree()
              if (that.tbData.length > 1) {
                that.tbData.length = that.tbData.length - 1
              } else {
                if (that.pagination.current > 1) {
                  that.pagination.current = that.pagination.current - 1
                }
              }
              that.loadTable()
              that.xy.msgSuc('删除成功。')
            } else {
              that.xy.msgError(res.msg)
              return this.changeLoading()
            }
          }
        })
      },
      // 解绑微信
      wechat (row) {
        let that = this
        that.$Modal.confirm({
          title: '解绑微信',
          content: '<p>您确定要解绑"' + row.FullName + '"当前所绑定的微信吗？</p>',
          async onOk () {
            let res = await that.xy.post(`${that.xyApi}/msg/api/WeChat/RemoveWeChatOpenID`, {
              UserId: row.UserID
            }, true)
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
        this.$store.commit('common/getThreeMenuName', '设置权限')
        this.$store.commit('common/getParam', { row: JSON.stringify(row) })
        this.$store.commit('base/changeStudentKeyValue', this.getParams())
        this.$router.push({ name: 'studentUserPermissionView', query: this.$store.state.common.menuInfo })
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
      async notifyPassword () {
        this.xy.loading()
        let params = {
          UserId: this.editId,
          Password: this.formValidateChangeUsersPassword.formPassword
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/ResetUsersPassword`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('密码已重置。')
          this.modalChangeUsersPassword = false
        } else {
          this.xy.msgError(res.msg)
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
      // 调整班级
      async adjustOrg (row) {
        this.selectStudent = row
        this.xy.loading()
        let params = {
          schoolid: row.SchoolDistrictID,
          studentYear: row.EnrollmentYear,
          studentGradeID: row.StudentGradeID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Student/GetStudentOrganizations`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.selectClassData = res.data
          this.selectClassID = ''
          this.modalAdjustOrg = true
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async adjustOrgSubmit () {
        if (!this.selectClassID) {
          this.xy.msgError('请选择班级。')
          return
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/InsertMember?orgID=${this.selectClassID}&studentID=${this.selectStudent.UserID}`, null, true)
        if (res.success) {
          this.xy.msgSuc('调整班级成功。')
          this.modalAdjustOrg = false
          this.loadTable()
          this.getSchoolTree()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 锁定，解锁
      async switchFun (row) {
        let params = {
          UserIDs: [row.UserID],
          Locked: !(row.Locked)
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/BatchEditUsersLocked`, params, true)
        if (res.success) {
          this.xy.msgSuc('操作成功。')
          this.loadTable()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 学生异动
      async studentMove (row) {
        this.moveSelect = []
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Student/GetUserStateInfo`, null, true)
        this.xy.unloading()
        if (res.success) {
          this.moveStudent = row
          this.moveTypeData = res.data
          // this.moveTypeData.splice(0, 1)
          if (row.UserStateID === 1 || row.UserStateID === 4) {
            this.moveType = 4
            this.outOftype = row.UserStateID
          }
          this.getStudentTransactionOrganization(true, row.StudentGradeForStudentYearID)
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async getStudentTransactionOrganization (isShowModal, studentGradeForStudentYearID) {
        this.xy.loading()
        let params = {
          studentGradeForStudentYearID: studentGradeForStudentYearID,
          userStateID: this.moveType
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Student/GetStudentTransactionOrganization`, params, true)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          this.moveYearClassData = []
          for (let i = 0; i < resData.length; i++) {
            this.moveYearClassData.push({
              value: resData[i].StudentYearID,
              label: resData[i].StudentYearName,
              children: []
            })
            for (let m = 0; m < resData[i].OrgList.length; m++) {
              this.moveYearClassData[i].children.push({
                value: resData[i].OrgList[m].StudentOrganizationID,
                label: resData[i].OrgList[m].StudentOrganizationName
              })
            }
          }
          if (isShowModal) {
            this.modalStudentMove = true
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      radioMove () {
        if (this.moveType === 2 || this.moveType === 3) { this.getStudentTransactionOrganization(false, this.moveStudent.StudentGradeForStudentYearID) }
      },
      async moveSubmit () {
        let userStateID = this.moveType
        let OrgID = 0
        if (this.moveType === 2 || this.moveType === 3) {
          if (this.moveSelect.length < 2) {
            this.xy.msgError('年级、班级不能为空。')
            return false
          } else {
            OrgID = this.moveSelect[1]
          }
        } else if (this.moveType === 4) { // 4  休学
          userStateID = this.outOftype
        }
        let userStateName = ''
        this.moveTypeData.map((item) => {
          if (userStateID === item.UserStateID) {
            userStateName = item.UserStateName
          }
        })
        let params = {
          userID: this.moveStudent.UserID,
          userStateID: userStateID,
          UserStateName: userStateName,
          OrgID: OrgID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/EditUserState`, params, true)
        if (res.success) {
          this.xy.msgSuc('修改成功。')
          this.modalStudentMove = false
          this.loadTable()
          this.getSchoolTree()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 新增学生
      teacherCreat () {
        this.$router.push({ path: 'studentCreate' })
      },
      // 毕业学生
      graduate () {
        this.$router.push({ path: 'graduatedStudent', query: this.$store.state.common.menuInfo })
      },
      async getGraduate () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/GetIsUserGraduation?isGraduation=true`, null, true)
        if (res.success) {
          this.isGraduate = res.data
        } else {
          this.xy.msgError(res.msg)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .left-box {
      margin-right: 20px;
      border: 1px solid #e3e3e3;
  }

  .box-header {
      height: 58px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px dashed #4196FF;
      padding: 0 10px;
      font-size: 16px;
  }

  .box-header i {
      border: 1px solid #4196FF;
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

  .tree-dom .ivu-tree-title {
      font-size: 14px;
  }

  .tree-dom .tree-li {
      display: inline-block;
      width: 100%;
      min-width: 200px;
  }

  .ti-invalid {
      background-color: #fff !important;
      color: red !important;
      border: 1px solid red !important;
  }

  .stu_cascader .ivu-select-dropdown {
      right: 16px;
  }
  .cascader-nodata ul{
    width: 260px;
  }
 .fl {
    float: left;
    button {
      margin-right: 10px;
    }
  }
  .fr {
    float: right;
  }
  .pr {
    position: relative;
  }
  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
  .student-tag{
    font-size: 12px;
    color: #4196ff;
    border: 1px solid #4196FF;
    padding: 1px 2px 0px;
    border-radius: 4px;
  }
</style>
