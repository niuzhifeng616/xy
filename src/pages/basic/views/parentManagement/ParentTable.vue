<template>
<div class="xy-content-module">
    <div class="xy-content-body">
        <row>
            <i-col span="6" class="left-body">
                <div class="left-box">
                    <div class="box-header">
                        <h3 style="font-weight: bold;">
                            家长组织
                            <span style="font-weight:normal;font-size:14px;" v-if="selectOrgName!=''">({{selectOrgName}})</span>
                        </h3>
                    </div>
                    <div class="box-body">
                        <tree class="tree-dom" :empty-text="emptyTxt" @on-select-change="treeSelect" :data="parentTree"></tree>
                    </div>
                </div>
            </i-col>
            <i-col span="18">
                <div class="clearfix" style="margin-bottom:10px;">
                    <div class="fl">
                        <Button  class="xy-primary" @click="parentCreate">新增家长</Button>
                        <Button  class="xy-info" @click="parentAccount">生成家长账户</Button>
                        <dropdown @on-click="more" trigger="click">
                            <Button  class="xy-info">
                                更多操作
                                <icon type="ios-arrow-down"></icon>
                            </Button>
                            <dropdown-menu slot="list">
                                <dropdown-item name="1">批量删除</dropdown-item>
                                <dropdown-item name="2">批量更新家长</dropdown-item>
                                <dropdown-item name="4">批量更新头像</dropdown-item>
                                <dropdown-item name="5">批量锁定</dropdown-item>
                                <dropdown-item name="6">批量解锁</dropdown-item>
                                <dropdown-item name="7">全部导出</dropdown-item>
                            </dropdown-menu>
                        </dropdown>
                        <Button class="xy-info" @click="modalScreening=true">筛选</Button>
                    </div>
                    <div class="fr pr">
                        <i-input
                          search
                          v-model.trim="searchText"
                          @on-search="FromSubmit"
                          placeholder="请输入用户名/姓名"
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
                    <div style="min-width:120px">
                      {{record.UserName.replace(/\s/g, '&nbsp;')}}
                    </div>
                  </div>
                  <div slot="FullNameRender" style="min-width:100px" slot-scope="text, record">
                    <span class="table-el-hover" @click="editOpera(record)">
                      {{record.FullName.replace(/\s/g, '&nbsp;')}}
                    </span>
                  </div>
                  <div style="min-width:100px" slot="StuRender" slot-scope="text, record">
                    {{record.StuFullName}}
                  </div>
                  <div style="min-width:100px" slot="StuUseRender" slot-scope="text, record">
                    {{record.StuUserName}}
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
                        <a-menu-item href="javascript:;" @click="del(record)">删除</a-menu-item>
                        <a-menu-item :disabled="!record.OpenID" @click="wechatClick(record)">解绑微信</a-menu-item>
                        <a-menu-item @click="lookRole(record)">查看权限</a-menu-item>
                        <a-menu-item @click="resetPassword(record)">重置密码</a-menu-item>
                        <a-menu-item :disabled="!record.StudentID > 0"  @click="dissociated(record)">解除关联</a-menu-item>
                        <a-menu-item @click="addOrg(record)">关联学生</a-menu-item>
                        <a-menu-item @click="loginLog(record)">登录日志</a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </span>
                </XyAntTable>
                <!-- 筛选 -->
                <modal
                  v-model="modalScreening"
                  :transfer="false"
                  :mask-closable="false"
                  title="筛选家长"
                  >
                    <div style="padding:10px 50px;font-size:14px;">
                        <div style="margin-bottom:15px;">
                            <label>学生：</label>
                            <radio-group v-model="student">
                                <radio label="0">
                                    <span>全部</span>
                                </radio>
                                <radio label="1">
                                    <span>已关联</span>
                                </radio>
                                <radio label="2">
                                    <span>未关联</span>
                                </radio>
                            </radio-group>
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
                            <radio-group v-model="status">
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
                        <Button class="xy-modal-close" @click="modalScreening = false">取消</Button>
                        <Button class="xy-modal-primary" shape="circle" @click="screeningSubmit">保存</Button>
                    </div>
                </modal>
                <!-- 重置密码 -->
                <modal
                  v-model="modalChangeUsersPassword"
                  :transfer="false"
                  :mask-closable="false"
                  @on-visible-change="visibleChange"
                  title="重置密码"
                  >
                    <div class="dialog-model-content">
                        <i-form ref="formValidateChangeUsersPassword" label-position="top" @submit.native.prevent :model="formValidateChangeUsersPassword" :rules="ruleValidateChangeUsersPassword">
                            <form-item label="新密码" prop="formPassword" labelFor="formPassword">
                                <i-input type="password" elementId="formPassword" v-model="formValidateChangeUsersPassword.formPassword" clearable></i-input>
                            </form-item>
                        </i-form>
                    </div>
                    <div slot="footer">
                        <Button class="xy-modal-close" @click="ChangeUsersPasswordCancel">取消</Button>
                        <Button class="xy-modal-primary" shape="circle" @click="ChangeUsersPasswordSubmit">保存</Button>
                    </div>
                </modal>
                <!-- 关联学生 -->
                <modal
                  v-model="modalAddOrg"
                  :transfer="false"
                  :title="modalAddOrgTitle"
                  width="80%"
                  :mask-closable="false"
                  class="student"
                  >
                    <div class="123">
                        <row class="cascader-content">
                            <i-col span="6" class="cascader-content-left">
                                <tree :data="studentTree" ></tree>
                            </i-col>
                            <i-col span="11" class="cascader-content-center">
                                <div class="title-describe title-model">温馨提示：点击左侧栏中的学生组织，从中间栏勾选学生，右侧栏显示已选中的学生。</div>
                                <alert v-if="transferData.length===0" type="warning" show-icon style="margin:0px 0px 20px">
                                    未查询到相关数据。
                                    <template slot="desc">
                                        当前分组下暂无数据，请切换分组后重新查找。
                                    </template>
                                </alert>
                                <div v-if="transferData.length>0">
                                    <div class="cascader-content-center-list">
                                        <checkbox
                                          size="large"
                                          v-for="child in transferData"
                                          :key="child.UserID"
                                          v-model="child.Checked"
                                          @on-change="checkAllChange(child)"
                                          :title="child.FullName"
                                          class="check-name"
                                          >
                                          {{child.FullName}}
                                        </checkbox>
                                    </div>
                                </div>
                            </i-col>
                            <i-col span="7" class="cascader-content-right">
                                <div>已选<b>{{checkData.length}}</b>人</div>
                                <div class="cascader-content-right-list">
                                    <tag
                                      v-for="item in checkData"
                                      :name="item.FullName"
                                      closable
                                      :key="item.FullName"
                                      @on-close="handleClose(item)"
                                      :title="item.FullName"
                                      >
                                      {{item.FullName}}
                                    </tag>
                                </div>
                            </i-col>
                        </row>
                    </div>
                    <div slot="footer">
                        <Button class="xy-modal-close" @click=" cancel">取消</Button>
                        <Button class="xy-modal-primary" shape="circle" @click="submit">保存</Button>
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
      // 引入上传模版
  import XyUpfile from '@/components/upFile/XyUpfile'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'ParentTable',
    components: {
      XyUpfile,
      XyAntTable
    },
    data () {
      return {
        emptyTxt: '正在加载中...',
        showUpLoad: false, // 上传组件显示状态值
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
            title: '学生姓名',
            dataIndex: 'StuFullName',
            scopedSlots: { customRender: 'StuRender' }
          },
          {
            title: '学生用户名',
            dataIndex: 'StuUserName',
            scopedSlots: { customRender: 'StuUseRender' }
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
        // 搜索条件
        searchText: '',
        selectSchoolDistrictID: 0,
        selectStudentGradeID: 0,
        selectStudentOrganizationID: 0,
        isNoGrade: false,
        selectStudentGradeForStudentYearID: 0,
        // 左侧树
        parentTree: [],
        selectOrgName: '',
        // 筛选
        modalScreening: false,
        headPhoto: '0',
        sex: '0',
        status: '0',
        weChat: '0',
        student: '0',
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
        // 关联学生
        modalAddOrg: false,
        modalAddOrgTitle: '',
        transferParent: '',
        orgData: [],
        studentTree: [],
        checkData: [], // 选中的学生
        transferData: [] // 待选的学生
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
      if (Object.keys(this.$store.state.base.parentKeyWords).length > 0) {
        let res = this.$store.state.base.parentKeyWords
        this.pagination.current = res.PageIndex
        this.pagination.pageSize = res.PageSize
        this.selectStudentGradeID = res.StudentGradeID
        this.selectSchoolDistrictID = res.SchoolDistrictID
        this.selectStudentOrganizationID = res.StudentOrganizationID
        this.selectStudentGradeForStudentYearID = res.StudentGradeForStudentYearID
        this.isNoGrade = res.IsNoGrade
        this.headPhoto = res.Icon
        this.sex = res.Sex
        this.status = res.Lock
        this.weChat = res.WeChart
        this.searchText = res.seach
        this.student = res.Family
      }
      this.$store.commit('base/changeParentKeyValue', {})
      this.getFamilySchoolTree()
    },
    mounted () {
      this.loadTable()
    },
    methods: {
      editOpera (record) {
        record.pageData = this.getParams()
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
      loginLog (record) {
        this.GoUserLoginClick(record)
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
        this.getFamilySchoolTree()
      },
      // 右侧表格多选操作（批量删除）
      changeSelect (data) {
        this.selectionAll = data
      },
      getParams () {
        return {
          Family: this.student,
          Icon: this.headPhoto,
          Sex: this.sex,
          Lock: this.status,
          WeChart: this.weChat,
          seach: this.searchText,
          SchoolDistrictID: this.selectSchoolDistrictID,
          StudentGradeID: this.selectStudentGradeID,
          StudentOrganizationID: this.selectStudentOrganizationID,
          IsNoGrade: this.isNoGrade,
          StudentGradeForStudentYearID: this.selectStudentGradeForStudentYearID,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }
      },
      // 左侧树
      async getFamilySchoolTree () {
        this.emptyTxt = '正在加载中...'
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Family/GetFamilySchoolTree`, null, true)
        if (res.success) {
          let resData = res.data
          if (res.data.length === 0) {
            this.emptyTxt = '暂无家长组织，请联系管理员。'
          }
          this.parentTree = []
          console.log(1)
          for (let i = 0; i < resData.length; i++) {
            this.parentTree.push({
              id: resData[i].SchoolDistrictID,
              title: resData[i].SchoolDistrictName + '(' + resData[i].StuCount + '人)',
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
            if (resData[i] && resData[i].GradeList && resData[i].GradeList.length > 0) {
              for (let m = 0; m < resData[i].GradeList.length; m++) {
                this.parentTree[i].children.push({
                  id: resData[i].GradeList[m].StudentGradeID,
                  title: resData[i].GradeList[m].StudentGradeName + '(' + resData[i].GradeList[m].StuCount + '人)',
                  fullOrgName: resData[i].GradeList[m].StudentGradeName,
                  schoolDistrictID: resData[i].SchoolDistrictID,
                  studentGradeID: resData[i].GradeList[m].StudentGradeID,
                  studentGradeForStudentYearID: resData[i].GradeList[m].StudentGradeForStudentYearID,
                  studentYearID: 0,
                  studentOrganizationID: 0,
                  children: [],
                  IsNoGrade: resData[i].GradeList[m].IsNoGrade
                })
                if (resData[i].GradeList[m].YearList.length > 0) {
                  for (let n = 0; n < resData[i].GradeList[m].YearList.length; n++) {
                    this.parentTree[i].children[m].children.push({
                      id: resData[i].GradeList[m].YearList[n].StudentYearID,
                      title: resData[i].GradeList[m].YearList[n].StudentYearFullName + '(' + resData[i].GradeList[m].YearList[n].StuCount + '人)',
                      fullOrgName: resData[i].GradeList[m].YearList[n].StudentYearFullName,
                      children: [],
                      schoolDistrictID: resData[i].SchoolDistrictID,
                      studentGradeID: resData[i].GradeList[m].StudentGradeID,
                      studentGradeForStudentYearID: resData[i].GradeList[m].YearList[n].StudentGradeForStudentYearID,
                      studentYearID: resData[i].GradeList[m].YearList[n].StudentYearID,
                      studentOrganizationID: resData[i].GradeList[m].YearList[n].StudentOrganizationID,
                      IsNoGrade: resData[i].GradeList[m].YearList[n].IsNoGrade
                    })
                    for (let k = 0; k < resData[i].GradeList[m].YearList[n].OrgList.length; k++) {
                      this.parentTree[i].children[m].children[n].children.push({
                        id: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationID,
                        title: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationName + '\xa0(' + resData[i].GradeList[m].YearList[n].OrgList[k].StuCount + '人)',
                        fullOrgName: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationName,
                        schoolDistrictID: resData[i].SchoolDistrictID,
                        studentGradeID: resData[i].GradeList[m].StudentGradeID,
                        studentGradeForStudentYearID: resData[i].GradeList[m].YearList[n].OrgList[k].StudentGradeForStudentYearID,
                        studentYearID: resData[i].GradeList[m].YearList[n].StudentYearID,
                        studentOrganizationID: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationID,
                        children: [],
                        IsNoGrade: resData[i].GradeList[m].YearList[n].OrgList[k].IsNoGrade
                      })
                    }
                  }
                }
              }
            }
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      treeSelect (res) {
        this.selectOrgName = res[0].fullOrgName
        this.selectSchoolDistrictID = res[0].schoolDistrictID
        this.selectStudentGradeID = res[0].studentGradeID
        this.selectStudentOrganizationID = res[0].studentOrganizationID
        this.isNoGrade = res[0].IsNoGrade === undefined ? false : res[0].IsNoGrade
        this.selectStudentGradeForStudentYearID = res[0].studentGradeForStudentYearID
        this.pagination.current = 1
        this.resetScreening()
        this.loadTable()
      },
      // 右侧表格数据
      loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        // this.$store.commit('base/changeParentKeyValue', this.getParams())
        this.xy.post(`${this.$store.state.apiPath}/api/Family/GetAllStudentFamilyPage`, this.getParams()).then(res => {
          if (res.success) {
            this.pagination.total = res.data.totalRecords
            this.tbData = res.data.data
            this.tableLoading = false
          } else {
            this.xy.msgError(res.msg)
          }
        })
      },
      // 重置筛选条件
      resetScreening () {
        this.student = this.selectSchoolDistrictID === 0 ? '2' : '0'
        this.headPhoto = '0'
        this.status = '0'
        this.sex = '0'
        this.weChat = '0'
        this.searchText = ''
        this.Family = this.student
        this.Icon = this.headPhoto
        this.Sex = this.sex
        this.Lock = this.status
        this.WeChart = this.weChat
        this.seach = this.searchText
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
            if (this.selectionAll.length < 1) {
              this.xy.msgError('请勾选要删除的家长。')
            } else {
              this.$Modal.confirm({
                title: '批量删除',
                content: '<p>您确定要批量删除所有选中的家长？</p>',
                async onOk () {
                  for (let item in that.selectionAll) {
                    idsStr.push(that.selectionAll[item].UserID)
                  }
                  that.xy.loading()
                  let res = await that.xy.post(`${that.$store.state.apiPath}/api/Family/DeleteByIds?ids=${idsStr.join(',')}`, null, true)
                  that.xy.unloading()
                  if (!res.success) {
                    that.xy.msgError(res.msg)
                    return false
                  } else {
                    that.getFamilySchoolTree()
                    that.xy.msgSuc('删除成功。')
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
          case '2': // 批量更新家长
            this.batchTeacherImport()
            break
          case '4': // 批量更新头像
            this.batchPhotoImport()
            break
          case '5': // 批量锁定
            let idsStr5 = []
            if (this.selectionAll.length < 1) {
              this.xy.msgError('请勾选要锁定的家长。')
            } else {
              this.$Modal.confirm({
                title: '批量锁定',
                content: '<p>您确定要批量锁定所有选中的家长？</p>',
                async onOk () {
                  that.xy.loading()
                  for (let item in that.selectionAll) {
                    idsStr5.push(that.selectionAll[item].UserID)
                  }
                  let params = {
                    UserIDs: idsStr5,
                    Locked: true
                  }
                  let res = await that.xy.post(`${that.$store.state.apiPath}/api/Family/BatchEditUsersLocked`, params, true)
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
              this.xy.msgError('请勾选要解锁的家长。')
            } else {
              this.$Modal.confirm({
                title: '批量解锁',
                content: '<p>您确定要批量解锁所有选中的家长？</p>',
                async onOk () {
                  for (let item in that.selectionAll) {
                    idsStr6.push(that.selectionAll[item].UserID)
                  }
                  let params = {
                    UserIDs: idsStr6,
                    Locked: false
                  }
                  that.xy.loading()
                  let res = await that.xy.post(`${that.$store.state.apiPath}/api/Family/BatchEditUsersLocked`, params, true)
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
              this.xy.msgError('暂无要导出得家长')
              return false
            }
            this.$Modal.confirm({
              title: '全部导出',
              content: '<p>您本次共导出' + this.pagination.total + '名家长</p>',
              onOk () {
                that.xy.downFile(`${that.$store.state.apiPath}/api/Family/ExportFamilyOverall`, that.getParams())
              }
            })
            break
        }
      },
      // 批量更新家长
      batchTeacherImport () {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '批量更新用户', // 标题
          ipData: [], // 提示语句
          formtData: ['xlsx', 'xls'], // 支持的文件类型
          size: 1024, // 文件大小限制，单位 kb
          upUrl: `${this.$store.state.apiPath}/api/Family/ImportEdirFamily`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/Family/DownloadTemplateImportEditFamily`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/Family/DownloadExceptionImportEdirFamily` // 下载错误文件url
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
          upUrl: `${this.$store.state.apiPath}/api/Family/EditNewUsersIcon`, // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: `${this.$store.state.apiPath}/api/Family/DownloadTemplateEditNewUsersIcon`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/Family/DownloadExceptionEditNewUsersIcon` // 下载错误文件url
        }
      },
      // 生成家长账户
      parentAccount () {
        let that = this
        that.$Modal.confirm({
          title: '生成家长账户',
          content: '<p>点击确定后，将根据学生账号一对一生成家长账号，您确定要生成吗？</p>',
          async onOk () {
            that.xy.loading()
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/Family/GenerateFamilyUser`, null, true)
            that.xy.unloading()
            if (res.success) {
              that.xy.msgSuc('生成家长账户成功。')
              that.pagination.current = 1
              that.loadTable()
              that.getFamilySchoolTree()
            } else {
              that.xy.msgError(res.msg)
            }
          }
        })
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
        this.$store.commit('common/getThreeMenuName', '编辑家长')
        this.$store.commit('common/getParam', { UserID: row.UserID, StudentID: row.StudentID })
        this.$store.commit('base/changeParentKeyValue', this.getParams())
        this.$router.push({ path: '/xyHome/parentEdit', query: this.$store.state.common.menuInfo })
      },
      // 删除
      del (row) {
        let that = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + row.FullName + '"吗？</p>',
          async onOk () {
            that.xy.loading()
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/Family/DeleteByIds?ids=${row.UserID}`, null, true)
            that.xy.unloading()
            if (res.success) {
              that.getFamilySchoolTree()
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
            let res = await that.xy.post(`${that.xyApi}/msg/api/WeChat/RemoveWeChatOpenID`, {
              UserId: row.UserID
            }, true)
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
        this.$store.commit('common/getThreeMenuName', '设置权限')
        this.$store.commit('common/getParam', { row: JSON.stringify(row) })
        this.$store.commit('base/changeParentKeyValue', this.getParams())
        this.$router.push({ name: 'parentUserPermissionView', query: this.$store.state.common.menuInfo })
      },
      // 解除关联
      dissociated (row) {
        let that = this
        that.$Modal.confirm({
          title: '解除关联',
          content: '<p>您确定要解除关联？</p>',
          async onOk () {
            that.xy.loading()
            let params = {
              UserID: row.UserID,
              StudentID: row.StudentID
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/Family/DeleteUserFamily`, params, true)
            that.xy.unloading()
            if (res.success) {
              that.loadTable()
              that.getFamilySchoolTree()
              that.xy.msgSuc('解除成功。')
            } else {
              that.xy.msgError(res.msg)
            }
          }
        })
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
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Family/ResetUsersPassword`, params, true)
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
        this.$store.commit('common/getThreeMenuName', '登录日志')
        this.$store.commit('common/getParam', { userID: row.UserID })
        this.$store.commit('base/changeParentKeyValue', this.getParams())
        this.$router.push({ name: 'parentLog', query: this.$store.state.common.menuInfo })
      },
      // 锁定，解锁
      switchFun (row) {
        this.xy.loading()
        let params = {
          UserIDs: [row.UserID],
          Locked: !(row.Locked)
        }
        this.xy.post(`${this.$store.state.apiPath}/api/Family/BatchEditUsersLocked`, params).then(res => {
          if (res.success) {
            this.xy.msgSuc('操作成功。')
            this.loadTable()
          } else {
            this.xy.msgError(res.msg)
          }
          this.xy.unloading()
        })
      },
      // 关联学生
      /*     addOrg2 (row) {
                let this = this;
                this.transferParent = row;
                this.modalAddOrgTitle = '正在为' + row.FullName + '关联学生'
                xy.loading();
                xy.http.get(xy.string.format('{0}/api/Comm/GetSchoolGardTree', xy.subMenuServiceUrl), {
                    isaddClass: true,
                }, function (res) {
                    if (res.data.success) {
                        let resData = res.data.data;
                        this.orgData = [];
                        for (let i = 0; i < resData.length; i++) {
                            this.orgData.push({
                                id: resData[i].SchoolDistrictID,
                                title: resData[i].Name,
                                StudentGradeForStudentYearID: resData[i].StudentGradeForStudentYearID,
                                StudentOrganizationID: resData[i].StudentOrganizationID,
                                children: [],
                            });
                            for (let m = 0; m < resData[i].Children.length; m++) {
                                this.orgData[i].children.push({
                                    id: resData[i].Children[m].StudentGradeForStudentYearID,
                                    title: resData[i].Children[m].Name,
                                    StudentGradeForStudentYearID: resData[i].Children[m].StudentGradeForStudentYearID,
                                    StudentOrganizationID: resData[i].Children[m].StudentOrganizationID,
                                    children: [],
                                })
                                for (let n = 0; n < resData[i].Children[m].Children.length; n++) {
                                    this.orgData[i].children[m].children.push({
                                        id: resData[i].Children[m].Children[n].StudentOrganizationID,
                                        title: resData[i].Children[m].Children[n].Name,
                                        StudentGradeForStudentYearID: resData[i].Children[m].Children[n].StudentGradeForStudentYearID,
                                        StudentOrganizationID: resData[i].Children[m].Children[n].StudentOrganizationID,
                                        children: [],
                                    })
                                }
                            }
                        };
                        this.modalAddOrg = true;
                    } else {
                        xy.model.error(this, res.msg);
                    };
                    xy.unloading();
                });
            }, */
      // 关联学生
      async addOrg (row) {
        this.transferParent = row
        this.modalAddOrgTitle = '正在为' + row.FullName + '关联学生'
        this.xy.loading()
        let params = {
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Student/GetSchoolTree`, params, true)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
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
              IsNoGrade: resData[i].IsNoGrade,
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
                      on: {
                        click: () => {
                          this.treeChildSelect(func.data)
                        }
                      }
                    }, func.data.title)
                  ])
                ])
              }
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
                IsNoGrade: resData[i].GradeList[m].IsNoGrade,
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
                        on: {
                          click: () => {
                            this.treeChildSelect(func.data)
                          }
                        }
                      }, func.data.title)
                    ])
                  ])
                }
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
                          on: {
                            click: () => {
                              this.treeChildSelect(func.data)
                            }
                          }
                        }, func.data.title)
                      ]),
                      h('span', {
                        style: {
                          display: 'inline-block',
                          float: 'right'
                        }
                      }, [
                        h('span', {
                          style: {
                            display: 'inline-block',
                            float: 'right'
                          }
                        })
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
                          on: {
                            click: () => {
                              this.treeChildSelect(func.data)
                            }
                          }
                        }, func.data.title)
                      ]),
                      h('span', {
                        style: {
                          display: 'inline-block',
                          float: 'right'
                        }
                      }, [
                        h('span', {
                          style: {
                            display: 'inline-block',
                            float: 'right'
                          }
                        })
                      ])
                    ])
                  }
                  this.studentTree[i].children[m].children[n].children.push({
                    id: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationID,
                    title: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationName + '\xa0(' + resData[i].GradeList[m].YearList[n].OrgList[k].StuCount + '人)',
                    fullOrgName: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationName,
                    schoolDistrictID: resData[i].SchoolDistrictID,
                    studentGradeID: resData[i].GradeList[m].StudentGradeID,
                    studentGradeForStudentYearID: resData[i].GradeList[m].StudentGradeForStudentYearID,
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
          this.modalAddOrg = true
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async treeChildSelect (row) {
        this.xy.loading()
        let params = {
          SchoolDistrictID: row.schoolDistrictID,
          StudentGradeID: row.studentGradeID,
          StudentOrganizationID: row.studentOrganizationID,
          IsNoGrade: row.IsNoGrade || false,
          StudentGradeForStudentYearID: row.studentGradeForStudentYearID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/GetAllStudentByPara`, params, true)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          resData.map((item) => {
            item.Checked = false
            return item
          })
          this.transferData = resData
          // 根据右侧已选人改变渲染的初始数据
          if (this.checkData.length > 0) {
            for (let d = 0; d < this.transferData.length; d++) {
              let f = this.checkData.map((val) => {
                return val.UserID
              }).indexOf(this.transferData[d].UserID)
              if (f !== -1) {
                this.transferData[d].Checked = true
              }
            }
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async addTreeSelect (row) {
        if (row[0].StudentOrganizationID > 0 || row[0].title === '未在任何班级学生') {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/Student/GetAllStudentByOrgID?orgID=${row[0].id}`, null, true)
          this.xy.unloading()
          if (res.success) {
            let resData = res.data.data
            resData.map((item) => {
              item.Checked = false
              return item
            })
            this.transferData = resData
          } else {
            this.xy.msgError(res.msg)
          }
        }
      },
      checkAllChange (child) {
        if (child.Checked) {
          this.checkData.push(child)
        } else {
          let index = this.checkData.map((val) => {
            return val.UserID
          }).indexOf(child.UserID)
          this.checkData.splice(index, 1)
        };
      },
      handleClose (child) {
        let index = this.checkData.map((val) => {
          return val.UserID
        }).indexOf(child.UserID)
        this.checkData.splice(index, 1)
        let index1 = this.transferData.map((val) => {
          return val.UserID
        }).indexOf(child.UserID)
        this.transferData[index1].Checked = false
      },
      async submit () {
        let studentID = []
        if (this.checkData.length === 0) {
          return this.xy.msgError('请选择需要关联的学生。')
        }
        this.checkData.map(function (item) {
          studentID.push(item.UserID)
        })
        this.xy.loading()
        let params = {
          UserID: this.transferParent.UserID,
          StudentID: studentID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Family/CreateUserFamily`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || '关联成功。')
          this.getFamilySchoolTree()
          this.loadTable()
          this.cancel()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      cancel () {
        this.modalAddOrg = false
        if (this.transferData.length > 0) {
          this.transferData.map((item) => {
            item.Checked = false
          })
        }
        if (this.checkData.length > 0) {
          this.checkData = []
        }
        this.transferData.splice(0, 0)
      },
      // 新增家长
      parentCreate () {
        this.$router.push({ path: '/xyHome/parentCreate' })
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
</style>
