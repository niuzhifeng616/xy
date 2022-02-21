
<template>
  <div class="xy-content-body">
      <div class="xy-content-box" style="margin-top:0;">
        <XyAntTable
          :columns="columns"
          :dataSource="tableData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="1150"
          >
          <div slot="SchoolDistrictName" style="min-width:150px" slot-scope="text, record">
            <span :class="record.Dimension !== 1 ? 'table-el-hover' : ''" @click="toClass(record)">
              {{ record.SchoolDistrictName}}
            </span>
          </div>
          <div slot="GradeName" slot-scope="text, record">
            <div style="min-width:150px">
              {{ record.GradeName}}
            </div>
          </div>
          <div slot="ClassName" slot-scope="text, record">
            <div style="min-width:150px">
              {{ record.ClassName}}
            </div>
          </div>
          <span slot="oprate" slot-scope="text, record">
            <a :disabled="record.Dimension === 1" @click="toClass(record)">班级详情</a>
            <a-divider type="vertical" />
            <a :disabled="record.Dimension === 0" @click="toStudent(record)">学生详情</a>
          </span>
        </XyAntTable>
      </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'evaStatistics',
    inject: ['reload'],
    components: {
      XyAntTable
    },
    props: {
      addData: {
        type: Object || String
      }
    },
    data () {
      return {
        parentObj: {},
        mainUrl: this.xyApi + '/base',
        ApplicationID: 0,
        ApplicationSubMenuID: 0,
        schoolSession: [],
        yearSessionData: [],
        yearSession: [],
        datable: [],
        schoolDistrictID: 0,
        academicYearID: 0,
        academicSessionID: 0,
        studentGradeID: 0,
        studentYearID: 0,
        studentGradeForStudentYearID: 0,
        studentOrganizationId: 0,
        tableData: [],
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
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            scopedSlots: { customRender: 'SchoolDistrictName' }
          },
          {
            title: '年级',
            dataIndex: 'GradeName',
            scopedSlots: { customRender: 'GradeName' }
          },
          {
            title: '班级',
            dataIndex: 'ClassName',
            scopedSlots: { customRender: 'ClassName' }
          },
          {
            title: '人数',
            dataIndex: 'StudentCount',
            width: 80
          },
          {
            title: '班级德育',
            dataIndex: 'ClassScore',
            width: 100
          },
          {
            title: '最高分',
            dataIndex: 'StudentMaxScore',
            width: 100
          },
          {
            title: '最低分',
            dataIndex: 'StudentMinScore',
            width: 100
          },
          {
            title: '均分',
            dataIndex: 'StudentAvgScore',
            width: 100
          },
          {
            title: '操作',
            dataIndex: 'oprate',
            width: 200,
            scopedSlots: { customRender: 'oprate' }
          }],
        passData: {}
      }
    },
    computed: {
      idArr () {
        return this.$store.state.common.menuId
      }
    },
    watch: {
      idArr: {
        handler (val) {
          let idArr = val.split(',')
          this.applicationID = idArr[1]
          this.applicationSubMenuID = idArr[2]
        },
        immediate: true
      }
    },
    created () {
      this.getQuestionnaires()
    },
    mounted () {

    },
    methods: {
      handleTableChange () {
        this.getQuestionnaires()
      },
      // 获取table数据
      async getQuestionnaires () {
        let params = {
          schoolDistrictID: this.$parent.schoolSession[0] ? this.$parent.schoolSession[0] : 0,
          academicYearID: this.$parent.yearSession === undefined ? 0 : this.$parent.yearSession[0],
          academicSessionID: this.$parent.yearSession === undefined ? 0 : this.$parent.yearSession[1],
          studentGradeForStudentYearID: this.$parent.schoolSession[1] ? this.$parent.schoolSession[1] : 0,
          studentOrganizationId: this.$parent.schoolSession[2] ? this.$parent.schoolSession[2] : 0,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ApplicationID: this.addData.applicationID,
          ApplicationSubMenuID: this.addData.applicationSubMenuID,
          Dimension: this.addData.Dimension
        }
        this.tableLoading = true
        this.$parent.noRes = true
        let res = await this.xy.get(this.$store.state.apiPath + '/api/MoralEducationStatistics/GetGradeStatistics', params)
        this.tableLoading = false
        this.$parent.noRes = false
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
        }
      },
      // 班级详情
      toClass (row) {
        if (row.Dimension !== 1) {
          this.$parent.schoolSession = [row.SchoolDistrictID, row.StudentGradeForStudentYearID, row.StudentOrganizationID]
          this.$parent.settingComponent = 'classDetails'
          this.$parent.backUrl = 'evaStatistics'
          this.$store.commit('evaluate/changeMoralObj', {
            passData: this.passData,
            title: row.GradeName + row.ClassName
          })
        }
      },
      // 学生详情
      toStudent (row) {
        if (row.Dimension !== 0) {
          this.$parent.schoolSession = [row.SchoolDistrictID, row.StudentGradeForStudentYearID, row.StudentOrganizationID]
          this.$parent.settingComponent = 'stuDetails'
          this.$parent.backUrl = 'evaStatistics'

          this.$store.commit('evaluate/changeMoralObj', {
            passData: this.passData,
            gradeName: row.GradeName,
            className: row.ClassName
          })
        }
      }
    }

  }
</script>
<style lang='less' scoped>
.wrapper{
  padding: 0 20px;
}
.programme{
  padding-bottom: 20px;
}
.bgColor{
  width: calc(100% + 40px);
  height: 20px;
  background: rgb(249, 249, 249);
  position: relative;
  left: -20px;
}
.xy-content-box{
  .title-title{
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    font-weight: bold;
    color: #000;
    line-height: 15px;
    margin-bottom: 20px;
  }
}

.title-right {
  display: flex;
  align-items: center;
}
.xy-content-body{
  padding: 10px 20px 0;
  .xy-title-btn{
    display: flex;
    justify-content: space-between;
    .xy-title-btn1{
      span{
        display: inline-block;
        width: 110px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      .active{
        color: #4196FF;
        border-bottom: 2px solid #4196FF;
      }
    }
    .xy-title-btn2{
      position: relative;
      top: -12px;
    }
  }
  .xy-bigBox{
    .cell-left{
      color: rgba(0, 0, 0, .65);
      font-size: 14px;
      line-height: 32px;
    }
    .name-box{
      border-bottom: 1px dashed #E8E8E8;
      padding: 20px 72px 0 0;
      display: flex;
      ul{
        width: calc(100% - 70px);
      }
      .name-box-teacher{
        display: flex;
      }
    }
    .summary-subobject{
        display:flex;
        justify-content: space-between;
        width:300px;
        font-weight: bold;
      color: rgba(0, 0, 0, .85);
        font-size: 14px;
        padding: 23px 0;
    }
    .active {
      background: #1890ff;
      border-radius: 4px;
      color: #fff !important;
      opacity: 1 !important;
    }
    .cell-right-li{
        display:inline-block;
        margin-left:16px;
        line-height: 24px;
    }
    .class-strategy {
      margin: 0 16px 20px;
      padding: 4px 10px;
      cursor: pointer;
    }
    .choice-box{
        display: flex;
        flex-direction: row;
        padding-top: 26px;
        padding-right: 72px;
        .cell-right-li{
          color: rgba(0, 0, 0, .85);
        }
    }
  }
}
.xy-content-box{
    .approval-main{
        margin-bottom: 20px;
        .score-footer{
            color: rgba(0, 0, 0, .65);
            display: flex;
            width: 438px;
            font-size: 14px;
            line-height: 14px;
            justify-content: space-between;
            position: relative;
            left: 444px;
            bottom: 20px;
        }
        .score-footer2{
            color: rgba(0, 0, 0, .65);
            display: flex;
            width: 438px;
            font-size: 14px;
            line-height: 14px;
            justify-content: space-between;
            margin: 23px 0 26px 180px;
        }
        .numOfText{
          color: rgba(0, 0, 0, .65);
          margin-left: 24px;
        }
    }
    .ivu-page{
      text-align: right;
      margin-top: 20px;
    }
}
.score-center{
  .rate-title{
    margin-left: 60px;
    line-height: 36px;
    .opttag{
      margin-right: 10px;
    }
    .optname{
      margin-right: 27px;
    }
    .count{
      color: rgba(0, 0, 0, .65);
      span{
        margin-left: 10px;
      }
    }
  }
}
</style>
