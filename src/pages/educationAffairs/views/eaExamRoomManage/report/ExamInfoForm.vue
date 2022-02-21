<template>
<!-- 考生信息表 -->
<div id="StepsContent">
    <div class="xy-flex xy-justy-default">
        <Button @click="exportBtn" type="primary">导出</Button>
        <div>
          <Input  v-if='ClassList.length>0' search v-model.trim="searchText" placeholder="请输入用户名/姓名" @on-search="FromSubmit" class="fr xy-content-title-search" style="width: auto;" />
        </div>
    </div>
    <div class="exam-info-form">
        <div class="exam-info-form-left">
            <div class="exam-info-form-left-parent" :class="{left_fiexd:isFiexd}">
                <div
                  class="exam-info-form-class-list all-cla"
                  :class="isIndex==-1?'active':''"
                  @click="classChange({StudentOrganizationID:0},-1)"
                  >
                  全部行政班
                </div>
                  <div
                    v-for="(item,index) in ClassList"
                    class="exam-info-form-class-list nowrap"
                    :key="index"
                    :class="index==isIndex?'active':''"
                    :title="item.StudentOrganizationName"
                    @click="classChange(item,index)"
                    >
                    {{item.StudentOrganizationName}}
                  </div>
            </div>
        </div>
        <div class="exam-info-form-right">
            <div id="Tablemix">
              <div class="xy-content-table pr">
                <XyAntTable
                  :columns="columns"
                  :dataSource="dataTable"
                  :nullData="txt"
                  :tableLoading="tableLoading"
                  :pagination="pagination"
                  @change="handleTableChange"
                  :scrollx="'max-content'"
                  :isBorder="true"
                  :isScroll="true"
                  >
                  <div slot="SeatNumber" slot-scope="text, record">
                    {{`${ 10 > record.SeatNumber ? '0' + record.SeatNumber : record.SeatNumber}`}}
                  </div>
                </XyAntTable>
              </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'ExamInfoForm',
    data () {
      return {
        tableLoading: true,
        txt: '该搜索条件下没有结果。',
        isFiexd: false,
        searchName: '',
        types: 1,
        ClassList: [],
        columns: [],
        columnsUD: [
          {
            title: '用户名',
            dataIndex: 'UserName',
            width: 100,
            fixed: 'left'
          },
          {
            title: '姓名',
            width: 100,
            dataIndex: 'StudentName',
            fixed: 'left'
          },
          {
            title: '准考证号',
            width: 140,
            dataIndex: 'AdmissionTicketNumber',
            fixed: 'left'
          },
          {
            title: '行政班',
            width: 150,
            dataIndex: 'StudentOrganizationName',
            fixed: 'left'
          },
          {
            title: '班主任',
            width: 100,
            dataIndex: 'TeacherName',
            fixed: 'left'
          },
          {
            title: '考场号',
            dataIndex: 'ArrangeSupervisorExamRoomName'
          },
          {
            title: '考场地址',
            dataIndex: 'ExamAddress'
          },
          {
            title: '座位号',
            dataIndex: 'SeatNumber',
            scopedSlots: { customRender: 'SeatNumber' }
          }
        ],
        dataTable: [],
        dataList: [],
        classId: 0,
        searchText: '',
        isIndex: -1,
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        isSearchEmpty: false,
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
        }
      }
    },
    props: ['ASExamID', 'FSType'],
    watch: {
      ASExamID (newVal, oldVal) {
        this.ArrangeSupervisorExamID = newVal
        this.getClass()
      },
      FSType (newVal, oldVal) {
        this.FixedSubjectType = newVal
      }
    },
    created () {
      this.ArrangeSupervisorExamID = this.ASExamID
      this.FixedSubjectType = this.FSType
      this.getClass()
    },
    mounted () {
      window.onscroll = () => {
        this.ChangeLeft()
      }
    },
    destroyed () {
      window.onscroll = null
    },
    methods: {
      handleTableChange () {
        if (this.FixedSubjectType === 1) {
          // 全固定
          this.loadTable()
        } else {
          this.getTable()
        }
      },
      ChangeLeft () {
        let top = document.documentElement.scrollTop || document.body.scrollTop
        this.isFiexd = top > 280
      },
      async getClass () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSummary/GetOrganizationByExamID`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        }, true)
        if (res.success) {
          this.ClassList = res.data
          if (this.FixedSubjectType === 1) {
            // 全固定
            this.loadTable()
          } else {
            this.getTable()
          }
        }
      },
      classChange (item, i) {
        this.isIndex = i
        this.classId = item.StudentOrganizationID
        if (this.FixedSubjectType === 1) {
          // 全固定
          this.loadTable()
        } else {
          this.getTable()
        }
      },
      FromSubmit () {
        if (this.FixedSubjectType === 1) {
          // 全固定
          this.pagination.current = 1
          this.loadTable()
        } else {
          this.pagination.current = 1
          this.getTable()
        }
      },
      async loadTable () {
        this.columns = this.columnsUD
        // 全都固定
        this.tableLoading = true
        const params = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          SearchText: this.searchText,
          StudentOrganizationID: this.classId,
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          FixedSubjectType: this.FixedSubjectType
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSummary/GetExamStudentFixedByPage`, params)
        this.tableLoading = false
        this.isInitial = false
        if (res.success) {
          if (res.data) {
            this.dataTable = res.data.data
            this.pagination.total = res.data.totalRecords
          }
        }
      },
      async getTable () {
        // 部分/不固定
        this.columns = [
          {
            title: '准考证号',
            dataIndex: 'AdmissionTicketNumber',
            width: 200,
            fixed: 'left'
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            width: 200,
            fixed: 'left'
          },
          {
            title: '姓名',
            dataIndex: 'StudentName',
            width: 200,
            fixed: 'left'
          },
          {
            title: '行政班',
            dataIndex: 'StudentOrganizationName',
            width: 150,
            fixed: 'left'
          },
          {
            title: '班主任',
            width: 100,
            dataIndex: 'TeacherName'
          }
        ]
        // console.log(this.columns)
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSummary/GetExamStudentUNFixedByPage`, {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          SearchText: this.searchText,
          StudentOrganizationID: this.classId,
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          FixedSubjectType: this.FixedSubjectType
        })
        this.tableLoading = false
        this.isInitial = false
        if (res.success) {
          if (res.data !== null) {
            this.isEmpty = false
            this.isSearchEmpty = this.searchText !== ''
            this.pagination.total = res.data.TotalRecords
            if (res.data.DataBody.length > 0) {
              for (let i = 5; i < res.data.DataHeader.length; i++) {
                this.columns.push({
                  title: res.data.DataHeader[i].ColumName,
                  // align: 'center',
                  children: []
                })
              }
              for (let j = 5; j < res.data.DataHeader.length; j++) {
                for (let k = 0; k < res.data.DataHeader[j].ChildrenList.length; k++) {
                  this.columns[j].children.push({
                    title: res.data.DataHeader[j].ChildrenList[k].ColumName,
                    key: res.data.DataHeader[j].ChildrenList[k].ColumCode,
                    dataIndex: res.data.DataHeader[j].ChildrenList[k].ColumCode,
                    // align: 'center',
                    width: 150
                  })
                }
              }
              console.log(this.columns)
              this.dataTable = res.data.DataBody
            } else {
              this.isEmpty = true
              this.isSearchEmpty = this.searchText !== ''
              this.dataTable = []
            }
          } else {
            this.isEmpty = true
            this.isSearchEmpty = this.searchText !== ''
          }
        }
      },
      // 导出
      exportBtn () {
        if (this.FixedSubjectType === 1) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSummary/ExportInvigilatorExamStudentFixedTableByID`, {
            ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
            FixedSubjectType: this.FixedSubjectType
          })
        } else {
          this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSummary/ExportInvigilatorExamStudentUNFixedTableByID`, {
            ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
            FixedSubjectType: this.FixedSubjectType
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
#StepsContent {
  height: 900px;
}
.xy-justy-default {
  padding: 20px;
}

/*考生信息表*/
.exam-info-form {
  display: flex;
  justify-content: space-between;
  border: 1px solid #e8e8e8;
  margin: 20px;
  height: 728px;
}

.exam-info-form-left {
  max-height: 850px;
  overflow: hidden;
  overflow-y: auto;
  width: 242px;
  flex-basis: 242px;
  border-right: 1px solid #e8e8e8;
}

.exam-info-form-left-parent {
  width: 250px;
  .active {
    background: #F2F2F2;
  }
}

.left_fiexd {
  width: 240px;
  position: fixed;
  top: 50px;
}

.exam-info-form-right {
  width: 500px;
  flex-grow: 1;
}

.exam-info-form-class-all {
  margin-bottom: 20px;
  font-size: 16px;
  cursor: pointer;
}

.exam-info-form-class-list {
  cursor: pointer;
  font-size: 14px;
  line-height: 40px;
  height: 40px;
  padding-left: 38px;
}

.all-cla {
  font-weight: bold;
  font-size: 18px;
  line-height: 60px;
  height: 60px;
  padding-left: 20px;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.ivu-table-border th {
  background-color: #f8f8f9 !important;
}
</style>
