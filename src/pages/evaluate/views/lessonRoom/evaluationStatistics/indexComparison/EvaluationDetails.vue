<template>
  <div class='details'>
    <div class="xy-content-body"  style="padding:0px">
        <div style="padding:20px">
          <!-- <XyTable
            :noDataText="'该搜索条件下没有结果。'"
            @changePage="changePage"
            @changePageSize="changePageSize"
            :pageSize="pageSize"
            :pageIndex="pageIndex"
            :tbColumns="columns"
            :tbData="tbData"
            :total="tbTotal"
            >
          </XyTable> -->
          <XyAntTable
            :columns="columns"
            :pagination="pagination"
            :dataSource="tbData"
            :nullData="'该搜索条件下没有结果。'"
            :tableLoading="tableLoading"
            @change="handleTableChange"
            >
            <div slot="ClassDateTime" slot-scope="text, record">
              <span>
               {{record.ClassDateTime}}
              </span>
            </div>
            <div slot="Time" slot-scope="text, record">
              <span>
               {{record.Time}}
              </span>
            </div>
            <div slot="RecordObjectName" style="min-width:200px" slot-scope="text, record">
              <span>
                {{record.RecordObjectName}}
              </span>
            </div>
            <div slot="IndexManagementName" style="min-width:200px" slot-scope="text, record">
              <span>
                {{record.IndexManagementName}}
              </span>
            </div>
            <div slot="ScoringValue" slot-scope="text, record">
              <span>
                <span>{{record.ScoringValue}}</span>
                <img v-if="record.ScoringMethod===1" src="./imgs/star.svg" alt="">
              </span>
            </div>
            <div slot="LastModifyUserName" slot-scope="text, record">
              <span>
                {{record.LastModifyUserName}}
              </span>
            </div>
            <div slot="LastModifyByDate" slot-scope="text, record">
              <span>
                {{record.LastModifyByDate}}
              </span>
            </div>
          </XyAntTable>
        </div>
    </div>
  </div>
</template>

<script>
  // import XyTable from '@/components/table/XyTable'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: '',
    components: {
      // XyTable,
      XyAntTable
    },
    data () {
      return {
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
        tableLoading: true,
        columns: [
          {
            title: '日期',
            dataIndex: 'ClassDateTime',
            width: 200,
            scopedSlots: { customRender: 'ClassDateTime' }
          },
          {
            title: '节次',
            dataIndex: 'Time',
            width: 200,
            scopedSlots: { customRender: 'Time' }
          },
          {
            title: '评价对象',
            dataIndex: 'RecordObjectName',
            scopedSlots: { customRender: 'RecordObjectName' }
          },
          {
            title: '指标项目',
            dataIndex: 'IndexManagementName',
            scopedSlots: { customRender: 'IndexManagementName' }
          },
          {
            title: '得分',
            dataIndex: 'ScoringValue',
            width: 100,
            scopedSlots: { customRender: 'ScoringValue' }
          },
          {
            width: 200,
            title: '评价人员',
            dataIndex: 'LastModifyUserName',
            scopedSlots: { customRender: 'LastModifyUserName' }
          },
          {
            width: 200,
            title: '时间',
            dataIndex: 'LastModifyByDate',
            scopedSlots: { customRender: 'LastModifyByDate' }
          }
        ],
        tbTotal: 0,
        pageSize: 15,
        pageIndex: 1,
        tbData: [],
        passData: {}
      }
    },
    created () {
      this.getTable()
    },
    methods: {
      handleTableChange () {
        this.getTable()
      },
      // 改变当前页显示的数量
      changePageSize (size) {
        if (this.pageSize !== size) {
          this.pageSize = size
          this.getTable()
        }
      },
      // 改变当前页
      changePage (index) {
        if (this.pageIndex !== index) {
          this.pageIndex = index
          this.getTable()
        }
      },
      // 获取列表
      getTable () {
        this.passData = this.$store.state.evaluate.averageObj.passData
        this.tableLoading = true
        // this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/ClassRoomScoreRecord/GetScoreRecordLog`, {
          AcademicYearID: this.$parent.formValidateOK.yearSemester[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.yearSemester[1],
          DisciplineID: this.passData.DisciplineID,
          CoursePlan: {
            CoursePlanAID: this.passData.CoursePlanAID,
            CoursePlanAIDType: this.passData.CoursePlanAIDType
          },
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD'),
          Seach: this.$parent.formValidateOK.Seach,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize

        }).then(res => {
          // this.xy.unloading()
          this.tableLoading = false
          if (res.success) {
            this.tbData = res.data.data
            this.pagination.total = res.data.totalRecords
            // if (this.tbData.length > 0) {
            //   if (this.tbData[0].ScoringMethod === 1) { // 1 :星星，0：打分
            //     this.columns.splice(4, 1, {
            //       title: '得星数',
            //       dataIndex: 'ScoringValue',
            //       width: 100,
            //       scopedSlots: { customRender: 'ScoringValue' }
            //     })
            //   } else {
            //     this.columns.splice(4, 1, {
            //       title: '得分',
            //       dataIndex: 'ScoringValue',
            //       width: 100,
            //       scopedSlots: { customRender: 'ScoringValue' }
            //     })
            //   }
            // }
          }
        })
      }
    },
    mounted () {}
  }
</script>

<style lang='less' scoped>
.xy-content-body{
  border: 1px solid #d9d9d9;
  border-radius: 0 0 4px 4px;
  border-top: none;
}
</style>
