<template>
  <div class="xy-content-module">
    <div class="xy-content-title flex-flow">
      <div>
        <Button class="xy-primary" @click="createClassTable">创建排课</Button>
        <Button class="xy-danger" @click="delAll">批量删除</Button>
      </div>
      <div class="xy-flex">
        <div class="mr-15">
          <span>校区：</span>
          <i-select v-model="schoolStr" @on-change="schoolChange" style="width:200px">
            <i-option :value="0" :key="9876443">所有校区</i-option>
            <i-option v-for="item in schoolData" :value="item.value" :key="item.SchoolDistrictID">{{ item.label }}
            </i-option>
          </i-select>
        </div>
        <div class="mr-15">
          <span>学年：</span>
          <i-select v-model="yearID" @on-change="yearChange" style="width:200px">
            <i-option :value="0" :key="20923232458">所有学年</i-option>
            <i-option v-for="item in yearData" :value="item.value" :key="item.ID">{{ item.label }}
            </i-option>
          </i-select>
        </div>
        <div class="mr-15">
          <span>学期：</span>
          <i-select v-model="sessionID" @on-change="sessionChange" style="width:200px">
            <i-option :value="0" :key="387232356443">所有学期</i-option>
            <i-option v-for="item in sessionData" :value="item.value" :key="item.AcademicSessionID">{{ item.label }}
            </i-option>
          </i-select>
        </div>
        <div>
          <i-input search v-model.trim="searchText" @on-search="FromSubmit" placeholder="请输入方案名称"
            style="width: 200px;">
            <icon type="ios-search cursor-p" slot="suffix" />
          </i-input>
        </div>
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :rowSelection="tableRowSelection"
        :columns="columns"
        :dataSource="datatable"
        :nullData="nullData"
        :scrollx="'max-content'"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange">
        <div slot="ClassTableName" slot-scope="text, record">
          <div style="min-width:220px" class="table-el-hover" @click="edit(record)">
            {{record.ClassTableName}}
          </div>
        </div>
        <div slot="SchoolDistrictName" slot-scope="text, record">
          <div style="min-width:120px" >
            {{record.SchoolDistrictName}}
          </div>
        </div>
        <div slot="StudentGradeNameForStudentYearName" slot-scope="text, record">
          <div style="min-width:100px" >
            {{record.StudentGradeNameForStudentYearName}}
          </div>
        </div>
        <div slot="yearAndSession" slot-scope="text, record">
          <div style="min-width:150px" >
            {{record.yearAndSession}}
          </div>
        </div>
        <div slot="CreateByFullName" slot-scope="text, record">
          <div style="min-width:80px" >
            {{record.CreateByFullName}}
          </div>
        </div>
        <div slot="SloverTaskStatusName" slot-scope="text, record">
         <i class="iconfont icon-info" v-if="record.SloverTaskStatusName ==='进行中'">&#xe719;</i>
         <i class="iconfont icon-success" v-if="record.SloverTaskStatusName ==='已发布'">&#xe719;</i>
         <i class="iconfont icon-use" v-if="record.SloverTaskStatusName ==='已启用' ">&#xe719;</i>
         <span>
          {{record.SloverTaskStatusName}}
         </span>
            <!-- <span>
              {{record.IsPublished === true ? '已发布' : '未发布'}}
            </span>
            <i class="iconfont icon-default" v-if="record.IsEnabled === 0 ">&#xe719;</i>
            <i class="iconfont icon-success" v-if="record.IsEnabled === 1 ">&#xe719;</i>
            <i class="iconfont icon-end" v-if="record.IsEnabled === 2 ">&#xe719;</i>
            <span>
                {{record.IsEnabled === 0 ? '未用'
                      : record.IsEnabled === 1 ? '启用'
                        : record.IsEnabled === 2 ? '停用' : ''}}
            </span> -->
          </div>
        <div slot="oprateRender"  slot-scope="text, record">
          <a @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item :disabled="record._disabled" @click="del(record)">删除</a-menu-item>
              <a-menu-item @click="copyClassTable(record)">复制</a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </XyAntTable>

      <modal v-model="modalCopy" :transfer="false" :mask-closable="false">
        <p slot="header">复制排课方案</p>
        <div class="dialog-model-content">
          <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="top">
            <form-item label="排课名称" prop="copyClassTableName" label-for="copyClassTableName">
              <i-input v-model="formValidate.copyClassTableName" element-id="copyClassTableName" clearable></i-input>
            </form-item>
            <form-item label="所属学年" prop="copyClassTableYear" label-for="copyClassTableYear">
              <i-select v-model="formValidate.copyClassTableYear" :value="formValidate.copyClassTableYear" element-id="copyClassTableYear"
                @on-change="yearCopy" :label="formValidate.copyClassTableYear" placeholder="请选择学年">
                <i-option v-for="year in yearDataCopy" :value="year.value" :key="year.label">
                  {{ year.label }}</i-option>
              </i-select>
            </form-item>
            <form-item label="所属学期" prop="copyClassTableSession">
              <i-select v-model="formValidate.copyClassTableSession" :value="formValidate.copyClassTableSession"
                @on-change="sessionCopy" :label="formValidate.copyClassTableSession" placeholder="请选择学期">
                <i-option v-for="session in sessionDataCopy" :value="session.value" :key="session.label">{{ session.label }}</i-option>
              </i-select>
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="copyCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" :loading="copyOkLoading" @click="copyOk">保存</Button>
        </div>
      </modal>
      <modal v-model="modalLog" :transfer="false" :title="`“${logName}”排课方案日志`" :loading="loading"
        :mask-closable="false">
        <div class="dialog-model-content">
          <span v-for="item in logList" :key="item.SloverTaskLog" style="display:block;">
            <span>{{xy.moment(item.LogTime).format('YYYY-MM-DD HH:mm')}}&nbsp;&nbsp;</span>
            <span>{{item.SloverTaskLog}}</span>
          </span>
        </div>
        <div slot="footer" v-if="isRefresh">
          <Button class="xy-modal-close" @click="LogCancel">取消</Button>
          <Button class="xy-modal-close" @click="LogStop">停止</Button>
          <Button class="xy-modal-primary" shape="circle" @click="LogRefresh">刷新</Button>
        </div>
        <div slot="footer" v-if="!isRefresh">
          <Button class="xy-modal-close" @click="LogCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="LogOk">确定</Button>
        </div>
      </modal>
    </div>
  </div>
</template>
<script>
// 引入表格
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'classTable',
    components: {
      XyAntTable
    },
    data () {
      return {
        // antTable
        selectedRowKeys: [],
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
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
        columns: [
          {
            title: '排课名称',
            dataIndex: 'ClassTableName',
            scopedSlots: { customRender: 'ClassTableName' }
          },
          {
            title: '校区',
            scopedSlots: { customRender: 'SchoolDistrictName' }
          },
          {
            title: '年级',
            scopedSlots: { customRender: 'StudentGradeNameForStudentYearName' }
          },
          {
            title: '学期',
            scopedSlots: { customRender: 'yearAndSession' }
          },
          {
            title: '创建人',
            scopedSlots: { customRender: 'CreateByFullName' }
          },
          {
            title: '状态',
            width: 150,
            scopedSlots: { customRender: 'SloverTaskStatusName' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 140,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        selectionAll: [],
        datatable: [],
        pageList: '', // 当前页数据条数
        modal_loading: false,
        tableNoData: '当前没有排课方案。您可以点击左上角“创建排课”按钮新建一次排课，或者更改右上角校区等查询条件查询其他排课方案',
        loading: true,
        svShow: true, // 获取联级菜单的loading动画,默认true
        modalCreate: false, // 创建弹出框默认不展示
        isShowSpin: false, //
        ids: '',
        // 复制排课方案
        modalCopy: false,
        copyOkLoading: false,
        yearDataCopy: [],
        sessionDataCopy: [],
        formValidate: {
          copyClassTableName: '',
          copyClassTableYear: '',
          copyClassTableSession: ''
        },
        ruleValidate: {
          copyClassTableName: [
            { required: true, message: '排课任务名称不能为空', trigger: 'blur' },
            { max: 15, message: '排课任务名称不能超过15个字', trigger: 'blur' }
          ],
          copyClassTableYear: [
            { type: 'number', required: true, message: '请选择学年', trigger: 'change' }
          ],
          copyClassTableSession: [
            { type: 'number', required: true, message: '请选择学期', trigger: 'change' }
          ]
        },

        // 排课方案日志
        modalLog: false,
        sloverTaskID: 0,
        status: 0,
        logList: [],
        logName: '',
        returnState: 0,
        ClassTableID: '',
        isRefresh: false,
        refreshClassTableID: 0,
        // 排课任务参数
        schoolStr: 0,
        ClassTableType: this.$store.state.csmstimetable.classTableID[1].id,
        schoolDistrictID: 0,
        yearID: 0,
        sessionID: 0,
        schoolData: [],
        yearData: [],
        sessionData: [],
        searchText: '',
        applicationSubMenuID: 0,
        applicationID: 0

      }
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record._disabled
            }
          })
        }
      }
    },
    created () {
    },
    mounted () {
      this.getSchool()
      this.getYear()
    },
    methods: {
      getParams () {
        return {
          applicationID: this.$store.state.common.menuId.substr(this.$store.state.common.menuId.lastIndexOf(',') + 1, this.$store.state.common.menuId.length - 1),
          applicationSubMenuID: this.applicationSubMenuID,
          ClassTableType: this.ClassTableType,
          SeachText: this.searchText,
          schoolDistrictID: this.schoolDistrictID,
          academicSessionID: this.sessionID,
          academicYearID: this.yearID,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }
      },
      async loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        this.$store.commit('csmstimetable/changeClassScheduleKW', this.getParams())
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/GetPageByName`, this.getParams())
        if (res.success) {
          this.pagination.total = res.data.totalRecords
          res.data.data.map(item => {
            item.yearAndSession = `${item.AcademicYearName}/${item.AcademicSessionName}`
            item.CreateByDate = this.xy.moment(item.CreateByDate).format('YYYY-MM-DD HH:mm')
            return item
          })
          this.datatable = res.data.data
          this.datatable.map((item, index) => {
            this.$set(item, 'key', index)
          })
          if (res.data.data.length === 0) {
            this.pageList = 0
          } else {
            this.pageList = res.data.data.length
          }
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
        this.pagination.current = 1
        this.SeachText = this.searchText
        this.loadTable()
      },
      async getSchool () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`, null)
        if (res.success) {
          this.schoolData = []
          for (const iterator of res.data) {
            this.schoolData.push({
              value: iterator.SchoolDistrictID,
              label: iterator.SchoolDistrictName,
              loading: false
            })
          }
        }
      },
      async getYear () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/YearList`, null)
        if (res.success) {
          this.yearData = []
          for (const iterator of res.data) {
            if (iterator.IsCurrent) {
              this.yearID = iterator.ID
            }

            this.yearData.push({
              value: iterator.ID,
              label: iterator.Name
            })
          }

          this.getSession(0)
        }
      },
      async getSession (val) {
        this.sessionID = 0
        let params = {
          yearID: this.yearID
        }
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SessionList`, params)
        if (res.success) {
          this.sessionData = []
          for (const iterator of res.data) {
            if (val === 0) {
              if (iterator.IsCurrent) {
                this.sessionID = iterator.AcademicSessionID
              }
            }
            this.sessionData.push({
              value: iterator.AcademicSessionID,
              label: iterator.AcademicSessionName
            })
          }
          this.loadTable()
        }
      },
      schoolChange (value) {
        this.schoolDistrictID = value
        this.pagination.current = 1
        this.loadTable()
      },
      sessionChange (value) {
        this.sessionID = value
        this.academicSessionID = value
        this.pagination.current = 1
        this.loadTable()
      },
      yearChange (value) {
        this.yearID = value
        this.pagination.current = 1
        this.getSession(1)
      },
      // 创建方案
      createClassTable () {
        this.$store.commit('csmstimetable/setGoClassRowObj', {})
        this.$router.push({ path: '/xyhome/goClassStepsHeader', query: this.$store.state.common.menuInfo })
      },
      // 单击表格中编辑按钮触发
      async edit (row) {
        let that = this
        this.refreshClassTableID = row.ClassTableID
        if (row.SloverTaskID !== 0) {
          // 通过ClassTableID获取排课任务
          this.xy.loading()
          let params = {
            classTableID: row.ClassTableID
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetSloverTaskByClassTable`, params)
          this.xy.unloading()
          if (res.success) {
            if (res.data.Model.SloverTaskID === '0') {
              this.$store.commit('csmstimetable/setGoClassRowObj', row)
              this.$router.push({ path: '/xyhome/goClassStepsHeader', query: this.$store.state.common.menuInfo })
            } else {
              // this.sloverTaskID = res.data.Model.SloverTaskID;
              this.sloverTaskID = res.data.Model.SloverTaskIDStr
              this.status = res.data.Model.Status
              this.returnState = res.data.Model.ReturnState
              this.logList = res.data.LogList
              this.logName = res.data.Name
              // 队列中
              if (this.returnState === 1) {
                this.$Modal.confirm({
                  title: '温馨提示',
                  content: '您确定要终止这个排课吗？',
                  async onOk () {
                    let res = await that.xy.post(`${that.$store.state.apiPath}/api/SloverCoreSiteByPaas/SloverStop?ClassTableID=${row.ClassTableID}&sloverTaskID=${that.sloverTaskID}`, null)
                    if (res.success) {
                      that.xy.msgSuc(res.data)
                      that.loadTable()
                    }
                  }
                })
              }

              // 进行中
              if (this.returnState === 2) {
                // 开启日志
                this.modalLog = true
                this.isRefresh = true
              }

              // 完成未读
              if (this.returnState === 3) {
                // 开启日志
                this.modalLog = true
              }
              // 完成已读
              if (this.returnState === 4) {
                this.$store.commit('csmstimetable/setGoClassRowObj', row)
                this.$router.push({ path: '/xyhome/goClassStepsHeader', query: this.$store.state.common.menuInfo })
              }
            }
          }
        } else {
          this.$store.commit('csmstimetable/setGoClassRowObj', row)
          this.$router.push({ path: '/xyhome/goClassStepsHeader', query: this.$store.state.common.menuInfo })
        }
      },

      // 单击删除单个内容触发
      del (row) {
        let that = this
        that.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + row.ClassTableName + '"吗？',
          async onOk () {
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/ClassTable/Delete?ClassTableID=${row.ClassTableID}`, null)
            if (res.success) {
              if (that.pageList > 1) {
                that.pageList = that.pageList - 1
              } else {
                if (that.pagination.current > 1) {
                  that.pagination.current = that.pagination.current - 1
                  this.pagination.current = that.pagination.current - 1
                }
              }
              that.xy.msgSuc('删除成功。')
              that.loadTable()
            }
          }
        })
      },
      // 单击批量删除触发
      delAll () {
        let that = this
        that.modal_loading = true
        let idsStr = ''
        if (that.selectionAll.length < 1) {
          that.xy.msgError('请选择要删除的排课方案。')
        } else {
          for (let i = 0; i < that.selectionAll.length; i++) {
            idsStr += that.selectionAll[i].ClassTableID + ','
          }
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除所有选中的排课方案吗？',
            async onOk () {
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/ClassTable/DeleteByIDs?ClassTableIDs=${idsStr}`, null)
              if (res.success) {
                if (that.selectionAll.length === that.pageList && that.pagination.current > 1) {
                  that.pagination.current = that.pagination.current - 1
                }
                that.xy.msgSuc('删除成功。')
                that.loadTable()
                that.selectionAll = []
              }
            }
          })
        }
      },

      // 复制排课方案
      copyClassTable (row) {
        this.modalCopy = true
        this.copyOkLoading = false
        this.ClassTableID = row.ClassTableID
        this.formValidate.copyClassTableName = row.ClassTableName + '（1）'
        this.formValidate.copyClassTableYear = row.AcademicYearID
        this.formValidate.copyClassTableSession = row.AcademicSessionID
        this.copyGetYear()
      },
      async copyGetYear () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/YearList`, null)
        if (res.success) {
          this.yearDataCopy = []
          for (const iterator of res.data) {
            this.yearDataCopy.push({
              value: iterator.ID,
              label: iterator.Name
            })
          }
          this.copyGetSession()
        }
      },
      async copyGetSession () {
        this.sessionID = 0
        this.xy.loading()
        let params = {
          yearID: this.formValidate.copyClassTableYear
        }
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SessionList`, params)
        this.xy.unloading()
        if (res.success) {
          this.sessionDataCopy = []
          for (const iterator of res.data) {
            this.sessionDataCopy.push({
              value: iterator.AcademicSessionID,
              label: iterator.AcademicSessionName
            })
          }
        }
      },
      yearCopy (value) {
        this.formValidate.copyClassTableYear = value
        this.formValidate.copyClassTableSession = ''
        this.sessionDataCopy = []
        this.copyGetSession()
      },

      sessionCopy (value) {
        this.formValidate.copyClassTableSession = value
      },
      async CustomizeTimeTableCopy () {
        let params = {
          ClassTableID: this.ClassTableID,
          ClassTableName: this.formValidate.copyClassTableName,
          AdemicSessionID: this.formValidate.copyClassTableSession
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/CustomizeTimeTableCopy`, params)
        this.copyOkLoading = false
        if (res.success) {
          this.modalCopy = false
          this.xy.msgSuc('复制成功。')
          this.loadTable()
        }
      },
      copyOk () {
        this.copyOkLoading = true
        this.$refs.formValidate.validate((valid) => {
          if (!valid) {
            this.copyOkLoading = false
            return false
          } else {
            this.CustomizeTimeTableCopy()
          }
        })
      },
      copyCancel () {
        // this.$refs.formValidate.resetFields();
        this.modalCopy = false
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      // 确定 关闭日志
      async LogOk () {
        let params = {
          SloverTaskID: this.sloverTaskID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/EditIsRead`, params)
        if (res.success) {
          this.modalLog = false
          this.loadTable()
        }
      },

      // 取消 关闭日志
      LogCancel () {
        this.modalLog = false
      },

      // 停止 关闭日志
      LogStop () {
        let that = this
        that.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要终止这个排课吗？',
          async onOk () {
            let params = {
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/SloverCoreSiteByPaas/SloverStop?ClassTableID=${that.refreshClassTableID}&sloverTaskID=${that.sloverTaskID}`, params)
            if (res.success) {
              that.modalLog = false
              that.xy.msgSuc(res.data)
              that.loadTable()
            }
          }
        })
      },

      // 刷新 不关闭日志
      async LogRefresh () {
        this.xy.loading()
        let params = {
          ClassTableID: this.refreshClassTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetSloverTaskByClassTable`, params)
        this.xy.unloading()
        if (res.success) {
          this.logList = res.data.LogList
        }
      }

    }
  }
</script>
<style lang="less" scoped>
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
  .flex-flow {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.iconfont{
  vertical-align: middle;
}
</style>
