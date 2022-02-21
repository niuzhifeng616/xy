<!-- 学生组织:已毕业 -->
<template>
<div class="xy-content-module">
    <div class="xy-content-body">
        <row>
            <i-col span="6" class="left-body">
                <div class="left-box">
                    <div class="box-header">
                        <h3 style="font-weight: bold;">
                            学生组织
                            <span style="font-weight:normal;font-size:14px;" v-if="selectOrgName!=''">({{selectOrgName}})</span>
                        </h3>
                        <!--<span style="color:#4196FF;cursor:pointer" @click="">切换为学级</span>-->
                    </div>
                    <div class="box-body">
                        <Tree class="tree-dom" :empty-text="emptyTxt" :data="studentTree" @on-select-change="treeSelect"></Tree>
                    </div>
                </div>
            </i-col>
            <i-col span="18">
                <div class="clearfix" style="margin-bottom:10px;">
                    <div class="fl">
                        <Button class="xy-primary" @click="modalScreening=true">筛选</Button>
                        <dropdown @on-click="more" trigger="click">
                            <Button class="xy-info">
                                更多操作
                                <icon type="ios-arrow-down"></icon>
                            </Button>
                            <dropdown-menu slot="list">
                                <dropdown-item name="5">批量锁定</dropdown-item>
                                <dropdown-item name="6">批量解锁</dropdown-item>
                                <dropdown-item name="7">全部导出</dropdown-item>
                            </dropdown-menu>
                        </dropdown>
                        <Button class="xy-info" @click="back">返回</Button>
                    </div>
                    <div class="fr pr">
                        <Input
                          search
                          v-model.trim="searchText"
                          @on-search="FromSubmit"
                          placeholder="请输入用户名/学籍号/姓名"
                          class="xy-content-title-search"
                          style="width: auto;"
                          />
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
                    <span v-if="record.IsWechat" class="table-el-hover" @click="wechat(record)">
                      {{record.FullName.replace(/\s/g, '&nbsp;')}}
                    </span>
                    <span v-else>
                      {{record.FullName.replace(/\s/g, '&nbsp;')}}
                    </span>
                  </div>
                  <div style="min-width:120px" slot="GradeRender" slot-scope="text, record">
                    {{record.StudentGradeNameForStudentYearName}}
                  </div>
                  <div slot="switchRender" slot-scope="text, record">
                    <a-switch checked-children="锁定" un-checked-children="未锁" :checked="record.Locked" @change="switchFun(record)" />
                  </div>
                  <span slot="oprateRender" slot-scope="text, record">
                    <a :disabled="!record.IsWechat" @click="wechat(record)">解绑微信</a>
                    <a-divider type="vertical" />
                    <a-dropdown :trigger="['click']">
                      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                        更多 <a-icon type="down" />
                      </a>
                      <a-menu slot="overlay">
                        <a-menu-item @click="resetPassword(record)">重置密码</a-menu-item>
                        <a-menu-item @click="studentMove(record)">学生留级</a-menu-item>
                        <a-menu-item @click="loginLog(record)">登录日志</a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </span>
                </XyAntTable>
            </i-col>
        </row>
    </div>
    <!-- 筛选 -->
    <Modal
      v-model="modalScreening"
      :transfer="false"
      :mask-closable="false"
      title="筛选学生"
      >
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
    </Modal>
    <!-- 重置密码 -->
    <Modal
      v-model="modalChangeUsersPassword"
      :transfer="false"
      :mask-closable="false"
      title="重置密码"
      >
        <div class="dialog-model-content">
            <i-form ref="formValidateChangeUsersPassword" @submit.native.prevent :model="formValidateChangeUsersPassword" :rules="ruleValidateChangeUsersPassword">
                <form-item label="新密码" prop="formPassword">
                    <Input type="password" v-model="formValidateChangeUsersPassword.formPassword" clearable />
                </form-item>
            </i-form>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="ChangeUsersPasswordCancel">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="ChangeUsersPasswordSubmit">保存</Button>
        </div>
    </Modal>
    <!-- 学生留级 -->
    <Modal
      v-model="modalStudentMove"
      :transfer="false"
      :mask-closable="false"
      title="学生留级"
      >
        <div style="height:150px;">
            <label style="display:block;margin-bottom:10px;font-size:14px;">年级-班级：</label>
            <cascader :data="moveYearClassData" v-model="moveSelect"></cascader>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalStudentMove=false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="moveSubmit">保存</Button>
        </div>
    </Modal>
</div>

</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'GraduatedStudent',
    components: {
      XyAntTable
    },
    data () {
      return {
        selectionAll: [],
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

        // 左侧树
        emptyTxt: '正在加载中...',
        checkData: [],
        studentTree: [],
        selectOrgName: '',
        // 搜索条件
        searchText: '',
        selectSchoolDistrictID: 0,
        selectStudentGradeID: 0,
        selectStudentOrganizationID: 0,
        selectStudentGradeForStudentYearID: 0,
        isNoGrade: false, // 是否是无效组织
        isGraduation: true, // 是否毕业
        // 筛选
        modalScreening: false,
        parent: 0,
        headPhoto: 0,
        sex: 0,
        status: 0,
        weChat: 0,
        // 重置密码
        modalChangeUsersPassword: false,
        formValidateChangeUsersPassword: {
          formPassword: ''
        },
        ruleValidateChangeUsersPassword: {
          formPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { type: 'string', max: 20, min: 6, message: '密码长度限6~20位', trigger: 'blur' },
            { pattern: /^[\x21-\x7e]{6,20}$/, message: '您输入的密码格式错误', trigger: 'blur' }
          ]
        },
        // 调整班级
        modalAdjustOrg: false,
        selectClassData: [],
        selectClassID: '',
        // 学生异动
        modalStudentMove: false,
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
      if (Object.keys(this.$store.state.base.graduatedStudentKeyWords).length > 0) {
        let res = this.$store.state.base.graduatedStudentKeyWords
        this.pagination.current = res.pageIndex
        this.pagination.pageSize = res.pageSize
        this.selectSchoolDistrictID = res.SchoolDistrictID
        this.selectStudentGradeID = res.StudentGradeID
        this.selectStudentOrganizationID = res.StudentOrganizationID
        // this.isNoGrade = res.IsNoGrade
        this.selectStudentGradeForStudentYearID = res.StudentGradeForStudentYearID
        this.Family = res.parent
        this.Icon = res.headPhoto
        this.sex = res.Sex
        this.status = res.Lock
        this.weChat = res.WeChart
        this.searchText = res.seach
      }
      this.getSchoolTree()
    },
    mounted () {
      this.loadTable()
    },
    methods: {
      // 右侧表格多选操作（批量删除）
      changeSelect (data) {
        this.selectionAll = data
      },
      getParams () {
        return {
          SchoolDistrictID: this.selectSchoolDistrictID,
          StudentGradeID: this.selectStudentGradeID,
          StudentOrganizationID: this.selectStudentOrganizationID,
          IsNoGrade: this.isNoGrade,
          ISGraduation: this.isGraduation,
          StudentGradeForStudentYearID: this.selectStudentGradeForStudentYearID,
          Family: this.parent,
          Icon: this.headPhoto,
          Sex: this.sex,
          Lock: this.status,
          WeChart: this.weChat,
          seach: this.searchText,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        }
      },
      // 左侧树
      async getSchoolTree () {
        this.emptyTxt = '正在加载中...'
        let params = {
          schoolid: 0,
          isGraduation: this.isGraduation
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Student/GetSchoolTree`, params, true)
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
        if (res.length === 0) return false
        this.selectOrgName = res[0].fullOrgName
        this.selectSchoolDistrictID = res[0].schoolDistrictID
        this.selectStudentGradeID = res[0].studentGradeID
        this.selectStudentOrganizationID = res[0].studentOrganizationID
        // this.isNoGrade = res[0].IsNoGrade
        this.selectStudentGradeForStudentYearID = res[0].studentGradeForStudentYearID
        this.pagination.current = 1
        this.resetScreening()
        this.loadTable()
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
      // 列表
      async loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        this.$store.commit('base/changeGraduatedStudentValue', this.getParams())
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/GetAllStudentPage`, this.getParams(), true)
        if (res.success) {
          this.tbData = res.data.data
          this.pagination.total = res.data.totalRecords
        } else {
          this.xy.msgError(res.msg)
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.loadTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      FromSubmit () {
        this.seach = this.searchText
        this.pagination.current = 1
        this.loadTable()
      },
      more (res) {
        switch (res) {
          case '1':// 批量删除
            let idsStr1 = []
            if (this.selectionAll.length < 1) {
              this.xy.msgError('请勾选要删除的学生。')
            } else {
              this.$Modal.confirm({
                title: '批量删除',
                content: '<p>您确定要批量删除所有选中的学生？</p>',
                onOk: () => {
                  for (let item in this.selectionAll) {
                    idsStr1.push(this.selectionAll[item].UserID)
                  }
                  this.xy.post(`${this.$store.state.apiPath}/api/Student/DeleteByIds?ids=${idsStr1.join(',')}`, null).then(res => {
                    if (!res.success) {
                      // this.xy.msgError(res.msg)
                      return false
                    } else {
                      this.xy.msgSuc('删除成功。')
                      this.selectionAll = []
                      this.selectedRowKeys = []
                      this.loadTable()
                    }
                  })
                }
              })
            };
            break
          case '5':// 批量锁定
            let idsStr5 = []
            if (this.selectionAll.length < 1) {
              this.xy.msgError('请勾选要锁定的学生。')
            } else {
              this.$Modal.confirm({
                title: '批量锁定',
                content: '<p>您确定要批量锁定所有选中的学生？</p>',
                onOk: () => {
                  for (let item in this.selectionAll) {
                    idsStr5.push(this.selectionAll[item].UserID)
                  }
                  this.xy.post(`${this.$store.state.apiPath}/api/Student/BatchEditUsersLocked`, {
                    UserIDs: idsStr5,
                    Locked: true
                  }).then(res => {
                    if (!res.success) {
                      // this.xy.msgError(res.msg)
                      return false
                    } else {
                      this.xy.msgSuc('操作成功。')
                      this.selectionAll = []
                      this.selectedRowKeys = []
                      this.loadTable()
                    }
                  })
                }
              })
            };
            break
          case '6':// 批量解锁
            let idsStr6 = []
            if (this.selectionAll.length < 1) {
              this.xy.msgError('请勾选要解锁的学生。')
            } else {
              this.$Modal.confirm({
                title: '批量解锁',
                content: '<p>您确定要批量解锁所有选中的学生？</p>',
                onOk: () => {
                  for (let item in this.selectionAll) {
                    idsStr6.push(this.selectionAll[item].UserID)
                  }
                  this.xy.post(`${this.$store.state.apiPath}/api/Student/BatchEditUsersLocked`, {
                    UserIDs: idsStr6,
                    Locked: false
                  }).then(res => {
                    if (!res.success) {
                      // this.xy.msgError(res.msg)
                      return false
                    } else {
                      this.xy.msgSuc('操作成功。')
                      this.selectionAll = []
                      this.selectedRowKeys = []
                      this.loadTable()
                    }
                  })
                }
              })
            };
            break
          case '7':// 全部导出
            if (this.tbData.length === 0) {
              this.xy.msgError('暂无要导出的学生。')
              return false
            }
            this.$Modal.confirm({
              title: '全部导出',
              content: '<p>您本次共导出' + this.pagination.total + '名学生</p>',
              onOk: () => {
                this.xy.downFile(`${this.$store.state.apiPath}/api/Student/ExportStudentOverall`, this.getParams())
              }
            })
            break
        }
      },
      // 筛选
      screeningSubmit () {
        this.pagination.current = 1
        if (this.pagination.current === 1) {
          this.loadTable()
          this.modalScreening = false
        }
      },
      // 解绑微信
      wechat (row) {
        this.$Modal.confirm({
          title: '解绑微信',
          content: '<p>您确定要解绑"' + row.FullName + '"当前所绑定的微信吗？</p>',
          onOk: () => {
            let params = {
              UserId: row.UserID
            }
            this.xy.post(`${this.xyApi}/msg/api/WeChat/RemoveWeChatOpenID`, params, true).then(res => {
              if (res.success) {
                this.loadTable()
                this.xy.msgSuc('解绑成功。')
              } else {
                this.xy.msgError(res.msg)
              }
            })
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
      ChangeUsersPasswordSubmit () {
        this.$refs.formValidateChangeUsersPassword.validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.notifyPassword()
          }
        })
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
      // 跳转用户登录日志页面
      loginLog (row) {
        this.$store.commit('common/getThreeMenuName', '登录日志')
        this.$store.commit('common/getParam', { pro: '', userID: row.UserID })
        this.$store.commit('base/changeGraduatedStudentValue', this.getParams())
        this.$router.push({ name: 'studentLog', query: this.$store.state.common.menuInfo })
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
      // 学生留级
      studentMove (row) {
        this.moveSelect = []
        this.moveStudent = row
        this.getStudentTransactionOrganization(row.StudentGradeForStudentYearID)
      },
      async getStudentTransactionOrganization (studentGradeForStudentYearID) {
        this.xy.loading()
        let params = {
          studentGradeForStudentYearID: studentGradeForStudentYearID,
          userStateID: 3
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
          this.modalStudentMove = true
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async moveSubmit () {
        let OrgID = 0
        if (this.moveSelect.length < 2) {
          this.xy.msgError('年级、班级不能为空。')
          return false
        } else {
          OrgID = this.moveSelect[1]
        }
        let params = {
          userID: this.moveStudent.UserID,
          userStateID: 3,
          UserStateName: '跳级',
          OrgID: OrgID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/EditUserState`, params, true)
        if (res.success) {
          this.xy.msgSuc('修改成功。')
          this.modalStudentMove = false
          this.getSchoolTree()
          this.loadTable()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 返回
      back () {
        this.$store.commit('base/changeGraduatedStudentValue', {})// 清空当前页筛选条件
        this.$router.push({ path: 'sudentManagement', query: this.$store.state.common.menuInfo })
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
  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
</style>
