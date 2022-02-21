<template>
 <div class="xy-content-module">
    <div class="xy-content-title flex-flow">
        <div>
            <Button class="xy-primary"  @click="createClassTable">创建排课</Button>
            <Button class="xy-danger"  @click="delAll">批量删除</Button>
        </div>
        <div>
            <Select
                v-model="schoolDistrictID"
                @on-change="schoolChange"
                class="xy-content-title-search"
                style="width:150px">
                <Option :value="0">所有校区</Option>
                <Option v-for="item in schoolData"
                :value="item.SchoolDistrictID"
                :key="item.SchoolDistrictID" v-cloak>{{ item.SchoolDistrictName }}</Option>
            </Select>
            <Select
                v-model="yearID"
                @on-change="yearChange"
                class="xy-content-title-search"
                style="width:150px">
                <Option :value="0">所有学年</Option>
                <Option v-for="item in yearData"
                :value="item.ID"
                :key="item.ID" v-cloak>{{ item.Name }}</Option>
            </Select>
            <Select
                v-model="sessionID"
                @on-change="sessionChange"
                class="xy-content-title-search"
                style="width:150px">
                <Option :value="0">所有学期</Option>
                <Option v-for="item in sessionData"
                :value="item.AcademicSessionID"

                :key="item.AcademicSessionID" v-cloak>{{ item.AcademicSessionName }}</Option>
            </Select>
        </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :rowSelection="tableRowSelection"
        :columns="columnss"
        :dataSource="datatable"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        :isScrollx="true"
        :scrollx="'max-content'"
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
        <div slot="IsEnabled" slot-scope="text, record">
          <i class="iconfont icon-info" v-if="record.SloverTaskStatusName ==='进行中' ">&#xe719;</i>
          <i class="iconfont icon-success" v-if="record.SloverTaskStatusName ==='已发布'" >&#xe719;</i>
          <i class="iconfont icon-use" v-if="record.SloverTaskStatusName ==='已启用' ">&#xe719;</i>
          <span>
          {{record.SloverTaskStatusName}}
          </span>
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
    </div>
    <!-- 复制排课方案 -->
    <Modal v-model="modalCopy" :transfer="false" :mask-closable="false" :closable="false">
        <p slot="header">复制排课方案</p>
       <div class="dialog-model-content">
            <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="top">
                <FormItem  label="排课名称" prop="copyClassTableName" label-for="copyClassTableName">
                    <Input v-model.trim="formValidate.copyClassTableName" element-id="copyClassTableName" clearable />
                </FormItem >
                <FormItem  label="所属学年" prop="copyClassTableYear">
                    <Select v-model="formValidate.copyClassTableYear"
                              :value="formValidate.copyClassTableYear"
                              @on-change="yearCopy"
                              :label="formValidate.copyClassTableYear"
                              placeholder="请选择学年">
                        <Option v-for="year in yearDataCopy" :value="year.ID" :key="year.ID" v-cloak>{{ year.Name }}</Option>
                    </Select>
                </FormItem >
                <FormItem  label="所属学期" prop="copyClassTableSession">
                    <Select v-model="formValidate.copyClassTableSession"
                              :value="formValidate.copyClassTableSession"
                              @on-change="sessionCopy"
                              :label="formValidate.copyClassTableSession"
                              placeholder="请选择学期">
                        <Option v-for="session in sessionDataCopy"
                        :value="session.AcademicSessionID"
                        :key="session.AcademicSessionID" v-cloak>{{ session.AcademicSessionName }}</Option>
                    </Select>
                </FormItem >
            </Form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"  @click="copyCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" :loading="copyOkLoading" @click="copyOk">保存</Button>
        </div>
    </Modal>
    <!-- 排课方案日志 -->
    <Modal v-model="modalLog"
           :transfer="false"
           :title="logTitle"
           :mask-closable="false"
           :closable="false"
           @on-ok="LogOk"
           ok-text="确定"
           @on-cancel="LogCancel">
        <div class="dialog-model-content">
            <span v-for="(item,index) in logList" :key="index" style="display:block;">
                <span>{{item.LogTime}}</span>
                <span>{{item.SloverTaskLog}}</span>
            </span>
        </div>
        <div slot="footer" v-if="isRefresh">
          <Button class="xy-modal-close"  @click="LogCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle"  @click="LogRefresh">刷新</Button>
          <Button class="xy-modal-primary" shape="circle"  @click="LogStop">停止</Button>
        </div>
    </Modal>
</div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    data () {
      return {
        // antTable
        scrollx: 'max-content',
        selectedRowKeys: [],
        loadingTable: true,
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
        isPages: true,
        isLoading: true,
        pageList: '', // 当前页数据条数
        columnss: [
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
            scopedSlots: { customRender: 'IsEnabled' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 140,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        datatable: [],
        //  排课任务参数
        classTableType: 1,
        schoolDistrictID: 0,
        yearID: 0,
        sessionID: 0,
        schoolData: [],
        yearData: [],
        sessionData: [],
        selectionAll: [],
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
        logTitle: '',
        status: 0,
        logList: [],
        returnState: '',
        classTableID: '',
        isRefresh: false,
        refreshClassTableID: 0,
        rowObj: ''
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
      this.getSchool()
      this.getYear()
    },
    methods: {
      // 获取校区、学年、学期
      async getSchool () {
        this.isLoading = true
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        this.isLoading = false
        if (res.success) {
          this.schoolData = res.data
        }
      },
      schoolChange (value) {
        this.schoolDistrictID = value
        this.pagination.current = 1
        this.getList()
      },
      async getYear () {
        this.isLoading = true
        let res = await this.xy.get(`${this.xyApi}/xy/comm/YearList`)
        this.isLoading = false
        if (res.success) {
          this.yearData = res.data
          for (let i = 0, len = this.yearData.length; i < len; i++) {
            if (this.yearData[i].IsCurrent) {
              this.yearID = this.yearData[i].ID
            }
          }
          // if (this.rowObj.yearID !== undefined) { // 详情返回，搜索条件默认选择
          //   this.yearID = this.rowObj.yearID
          // }
          this.getSession(0)
        }
      },
      yearChange (value) {
        this.yearID = value
        this.pagination.current = 1
        this.pageCurrent = 1
        this.getSession(1)
      },
      async getSession (val) {
        this.isLoading = true
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SessionList`, { yearID: this.yearID })
        this.isLoading = false
        if (res.success) {
          this.sessionData = res.data
          for (let i = 0, len = this.sessionData.length; i < len; i++) {
            if (i === 0 || this.sessionData[i].IsCurrent) {
              this.sessionID = this.sessionData[i].AcademicSessionID
            }
          }
          // if (this.rowObj.sessionID !== undefined) { // 详情返回，搜索条件默认选择
          //   this.sessionID = this.rowObj.sessionID
          // }
          if (val === 0) {
            this.getList()
          } else {
            this.pagination.current = 1
            this.getList()
          }
        }
      },
      sessionChange (value) {
        this.sessionID = value
        this.pagination.current = 1
        this.getList()
      },
      // 获取列表数据
      async getList () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetPage`, {
          schoolDistrictID: this.schoolDistrictID,
          academicSessionID: this.sessionID,
          academicYearID: this.yearID,
          classTableType: this.classTableType,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        })
        if (res.success) {
          this.pagination.total = res.data.totalRecords
          if (res.data.data.length === 0) {
            this.pageList = 0
          } else {
            this.pageList = res.data.data.length
            res.data.data.map(item => {
              item.yearAndSession = `${item.AcademicYearName}/${item.AcademicSessionName}`
              item.CreateByDate = this.xy.moment(item.CreateByDate).format('YYYY-MM-DD HH:mm')
              return item
            })
          }
          this.datatable = res.data.data
          this.datatable.map((item, index) => {
            this.$set(item, 'key', index)
          })
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.getList()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 单击删除单个内容触发
      async del (row) {
        if (!row._disabled) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除"' + row.ClassTableName + '"吗？',
            onOk: () => {
              this.delObj(row.ClassTableID)
            }
          })
        }
      },
      async delObj (id) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/Delete?classTableID=${id}`)
        this.xy.unloading()
        if (res.success) {
          if (this.pageList > 1) {
            this.pageList = this.pageList - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            };
          };
          this.xy.msgSuc('删除成功。')
          this.getList()
        }
      },
      // 批量删除
      delAll () {
        let idsStr = ''
        if (this.selectionAll.length < 1) {
          this.xy.msgError('请选择要删除的排课任务。')
        } else {
          for (let i = 0; i < this.selectionAll.length; i++) {
            idsStr += this.selectionAll[i].ClassTableID + ','
          }
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除所有选中的排课方案吗？',
            onOk: () => {
              this.delAllObj(idsStr)
            }
          })
        };
      },
      async delAllObj (idsStr) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/DeleteByIDs?classTableIDs=${idsStr}`)
        this.xy.unloading()
        if (res.success) {
          if (this.selectionAll.length === this.pageList && this.pagination.current > 1) {
            this.pagination.current = this.pagination.current - 1
          }
          this.selectionAll = []
          this.xy.msgSuc('批量删除成功。')
          this.getList()
        }
      },
      // 创建方案
      createClassTable () {
        this.$store.commit('csmstimetable/changeAdmininstrativeRowObj', {
          classTableID: 0,
          classTableType: '',
          classTableName: '',
          schoolDistrictID: this.schoolDistrictID,
          yearID: this.yearID,
          sessionID: this.sessionID
        })
        this.$router.push({ path: '/xyhome/administrativeStepHeader' })
      },
      // 复制排课方案
      copyClassTable (row) {
        this.modalCopy = true
        this.copyOkLoading = false
        this.classTableID = row.ClassTableID
        this.formValidate.copyClassTableName = row.ClassTableName + '（1）'
        this.formValidate.copyClassTableYear = row.AcademicYearID
        this.formValidate.copyClassTableSession = row.AcademicSessionID
        this.copyGetYear()
      },
      async copyGetYear () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/YearList`)
        this.xy.unloading()
        if (res.success) {
          this.yearDataCopy = res.data
          this.copyGetSession()
        }
      },
      async copyGetSession () {
        this.sessionID = 0
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SessionList`, { yearID: this.formValidate.copyClassTableYear })
        this.xy.unloading()
        if (res.success) {
          this.sessionDataCopy = res.data
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
      async copyOk () {
        this.copyOkLoading = true
        this.$refs.formValidate.validate((valid) => {
          if (!valid) {
            this.copyOkLoading = false
            return false
          } else {
            this.copyHttp()
          }
        })
      },
      async copyHttp () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/GenerateTimeTableCopy`, {
          ClassTableID: this.classTableID,
          ClassTableName: this.formValidate.copyClassTableName,
          AdemicSessionID: this.formValidate.copyClassTableSession
        })
        this.xy.unloading()
        this.copyOkLoading = false
        if (res.success) {
          this.modalCopy = false
          this.xy.msgSuc('复制成功。')
          this.getList()
        }
      },
      copyCancel () {
        this.modalCopy = false
      },
      // 单击表格中进入按钮触发
      async edit (row) {
        this.refreshClassTableID = row.ClassTableID
        if (row.SloverTaskID !== '0') {
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetSloverTaskByClassTable`, {
            classTableID: row.ClassTableID
          })
          this.xy.unloading()
          if (res.success) {
            if (Number(res.data.Model.SloverTaskID) === 0) {
              this.$store.commit('csmstimetable/changeAdmininstrativeRowObj', {
                classTableID: row.ClassTableID,
                classTableType: row.ClassTableType,
                classTableName: row.ClassTableName,
                schoolDistrictID: this.schoolDistrictID,
                yearID: this.yearID,
                sessionID: this.sessionID
              })
              this.$router.push({ path: '/xyhome/administrativeStepHeader' })
            } else {
              this.sloverTaskID = res.data.Model.SloverTaskID
              this.status = res.data.Model.Status
              this.returnState = res.data.Model.ReturnState
              this.logList = res.data.LogList
              for (let i = 0, len = this.logList.length; i < len; i++) {
                this.logList[i].LogTime = this.xy.moment(this.logList[i].LogTime).format('YYYY-MM-DD HH:mm')
              }

              // 队列中
              if (Number(this.returnState) === 1) {
                this.LogStop()
              }

              // 进行中
              if (Number(this.returnState) === 2) {
                // 开启日志
                this.modalLog = true
                this.logTitle = row.ClassTableName + '排课方案日志'
                this.isRefresh = true
              }

              // 完成未读
              if (Number(this.returnState) === 3) {
                // 开启日志
                this.modalLog = true
                this.logTitle = row.ClassTableName + '排课方案日志'
              }

              //  完成已读
              if (Number(this.returnState) === 4) {
                this.$store.commit('csmstimetable/changeAdmininstrativeRowObj', {
                  classTableID: row.ClassTableID,
                  classTableType: row.ClassTableType,
                  classTableName: row.ClassTableName,
                  schoolDistrictID: this.schoolDistrictID,
                  yearID: this.yearID,
                  sessionID: this.sessionID
                })
                this.$router.push({ path: '/xyhome/administrativeStepHeader' })
              }
            }
          }
        } else {
          this.$store.commit('csmstimetable/changeAdmininstrativeRowObj', {
            classTableID: row.ClassTableID,
            classTableType: row.ClassTableType,
            classTableName: row.ClassTableName,
            schoolDistrictID: this.schoolDistrictID,
            yearID: this.yearID,
            sessionID: this.sessionID
          })
          this.$router.push({ path: '/xyhome/administrativeStepHeader' })
        }
      },
      // 确定 关闭日志
      async LogOk () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTable/EditIsRead`, {
          SloverTaskID: this.sloverTaskID
        })
        this.xy.unloading()
        if (res.success) {
          this.modalLog = false
          this.getList()
        }
      },

      // 取消 关闭日志
      LogCancel () {
        this.modalLog = false
      },

      // 停止 关闭日志
      LogStop () {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要终止当前排课吗？',
          onOk: () => {
            this.LogStopHttp()
          }
        })
      },
      async LogStopHttp () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverCoreSiteByPaas/SloverStop?classTableID=${this.refreshClassTableID}&sloverTaskID=${this.sloverTaskID}`)
        this.xy.unloading()
        if (res.success) {
          this.modalLog = false
          this.xy.msgSuc('进度更新成功。')
          this.getList()
        }
      },
      // 刷新 不关闭日志
      async LogRefresh () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetSloverTaskByClassTable`, {
          SloverTaskID: this.sloverTaskID
        })
        this.xy.unloading()
        if (res.success) {
          this.logList = res.data.data.LogList
          for (let i = 0, len = this.logList.length; i < len; i++) {
            this.logList[i].LogTime = this.xy.moment(this.logList[i].LogTime).format('YYYY-MM-DD HH:mm')
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.table{
  background: #fff;
}
.iconfont{
  vertical-align: middle;
}
.pages{
  text-align: right;
  padding:10px 0;
}
.flex-flow{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
