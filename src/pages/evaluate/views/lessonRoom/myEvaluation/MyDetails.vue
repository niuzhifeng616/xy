<template>
   <div class="my-details">
      <div class="xy-content-body">
        <div class="my-details" style="padding:20px">
          <XyAntTable
            :columns="columns"
            :dataSource="tbData"
            :nullData="'该搜索条件下没有结果。'"
            :isPage="false"
            :tableLoading="tableLoading"
            >
            <div slot="IndexManagementName" style="min-width:200px" slot-scope="text, record">
              <span>
                {{record.IndexManagementName}}
              </span>
            </div>
            <div slot="ScoringValue" slot-scope="text, record">
              <span>
                <span>{{record.ScoringValue}}</span>
                <img v-if="record.ScoringMethod===1" src="./imgs/start.svg" alt="">
              </span>
            </div>
          </XyAntTable>
      </div>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'MyDetails',
    components: {
      XyAntTable
    },
    props: {
      objData: {
        type: Object
      }
    },
    data () {
      return {
        tableLoading: true,
        tbData: [],
        subjectData: [],
        subject: {},
        coursePlanAID: 0,
        academicSessionID: '',
        starTime: '',
        endTime: '',
        columns: [
          {
            width: 200,
            title: '课程',
            dataIndex: 'CoursePlanTableFullName',
            scopedSlots: { customRender: 'CoursePlanTableFullName' }
          },
          {
            width: 200,
            title: '日期',
            dataIndex: 'ClassDateTime',
            scopedSlots: { customRender: 'ClassDateTime' }
          },
          {
            width: 100,
            title: '节次',
            dataIndex: 'Time',
            scopedSlots: { customRender: 'Time' }
          },
          {
            width: 200,
            title: '评价对象',
            dataIndex: 'RecordObjectName',
            scopedSlots: { customRender: 'RecordObjectName' }
          },
          {
            title: '指标项',
            dataIndex: 'IndexManagementName',
            scopedSlots: { customRender: 'IndexManagementName' }
          },
          {
            width: 100,
            title: '得分',
            dataIndex: 'ScoringValue',
            scopedSlots: { customRender: 'ScoringValue' }
          },
          {
            width: 200,
            title: '评价时间',
            dataIndex: 'LastModifyByDate',
            scopedSlots: { customRender: 'LastModifyByDate' }
          }
        ],
        pageIndex: 1,
        pageSize: 15

      }
    },
    created () {

    },
    methods: {
      // 获取列表
      getTable () {
        this.tableLoading = true
        this.xy.post(`${this.$store.state.apiPath}/api/MyAverageRecord/GetClassStudentRecordLogInformation`, {
          AcademicSessionID: this.$parent.formValidateOK.session[1],
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD'),
          DisciplineID: this.$parent.formValidateOK.disciplineID,
          CoursePlan: this.$parent.formValidateOK.checkArr,
          SchoolDistrictID: this.SchoolDistrictID,
          StudentGradeForStudentYearID: this.StudentGradeForStudentYearID
        }).then(res => {
          this.tableLoading = false
          if (res.success) {
            this.tbData = res.data
            // if (res.data[0].ScoringMethod === 1) { // 1 :星星，0：打分
            //   this.columns.splice(5, 1, {
            //     title: '得星数',
            //     dataIndex: 'ScoringValue',
            //     width: 100,
            //     scopedSlots: { customRender: 'ScoringValue' }
            //   })
            // } else {
            //   this.columns.splice(5, 1, {
            //     title: '得分',
            //     dataIndex: 'ScoringValue',
            //     width: 100,
            //     scopedSlots: { customRender: 'ScoringValue' }
            //   })
            // }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .my-details {
  // padding: 20px;
  .xy-content-title {
    border-radius: 4px 4px 0 0;
    border: 1px solid #d9d9d9;
    border-bottom: none;
    padding: 20px;
    display: flex;
    align-items: center;
     > p {
      text-align: right;
      margin-right: 12px;
      width: 94px;
    }

  }
    .xy-content-body {
      border-radius: 0 0 4px 4px;
      border: 1px solid #d9d9d9;
      border-top: none;
            .my-details{
              .search{
                padding-top:0 !important;
              }
              /deep/ .ivu-form-item{
                margin-bottom: 10px;
                display: inline-block;
              }

            }

    }
  }
</style>
