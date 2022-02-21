<template>
  <div class="wrapper">
    <div class="gradeTit">
      <span class="gradeName">
        {{changeMoralObj.title}}
      </span>
      <span class="star" v-if="ScoreType === 1">得星数：{{TotalStar}}</span>
      <span class="score">得分：{{TotalScore}}</span>
    </div>
    <!-- main -->
    <div class="xy-content-body">
      <div class="xy-content-box" style="margin-top:0;">
         <XyAntTable
          :columns="columns"
          :dataSource="datable"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="1000"
          >
          <div slot="IndexManagementName" slot-scope="text, record">
            <div v-show="ScoreType === 1" style="min-width:300px">
              {{ record.IndexManagementName}}
            </div>
            <div v-show="ScoreType !== 1" style="min-width:250px">
              {{ record.IndexManagementName}}
            </div>
          </div>
        </XyAntTable>
      </div>
    </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'classDetails',
    inject: ['reload'],
    components: {
      XyAntTable
    },
    data () {
      return {
        mainUrl: this.xyApi + '/base',
        tbData: [],
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
        TotalScore: 0,
        TotalStar: 0,
        ScoreType: 0,
        columns: [],
        columns1: [
          {
            title: '日期',
            dataIndex: 'Date',
            width: 150
          },
          {
            title: '指标项',
            dataIndex: 'IndexManagementName',
            scopedSlots: { customRender: 'IndexManagementName' }
          },
          {
            title: '得星数（星）',
            dataIndex: 'Score',
            width: 150
          },
          {
            title: '评价时间',
            dataIndex: 'EvaTime',
            width: 200
          }
        ],
        columns2: [
          {
            title: '日期',
            dataIndex: 'Date',
            width: 150
          },
          {
            title: '指标项',
            dataIndex: 'IndexManagementName',
            scopedSlots: { customRender: 'IndexManagementName' }
          },
          {
            title: '得分',
            dataIndex: 'Score',
            width: 150
          },
          {
            title: '评价时间',
            dataIndex: 'EvaTime',
            width: 200
          }
        ],
        passData: {},
        flag: false,
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
        tableLoading: true
      }
    },
    computed: {
      idArr () {
        return this.$store.state.common.menuId
      },
      changeMoralObj () {
        return this.$store.state.evaluate.changeMoralObj
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
      this.passData = this.$store.state.evaluate.changeMoralObj.passData
    },
    mounted () {
      setTimeout(() => {
        this.getQuestionnaires()
      }, 1000)
    },
    methods: {
      handleTableChange () {
        this.getQuestionnaires()
      },
      // 获取table数据
      async getQuestionnaires () {
        let params = {
          schoolDistrictID: this.$parent.schoolSession[0],
          academicYearID: this.$parent.yearSession[0],
          academicSessionID: this.$parent.yearSession[1],
          studentGradeForStudentYearID: this.$parent.schoolSession[1],
          studentOrganizationId: this.$parent.schoolSession[2],
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        }
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MoralEducationStatistics/GetClassStatistics`, params)
        this.tableLoading = false
        if (res.success) {
          this.ScoreType = res.data.ScoreType
          this.TotalScore = res.data.TotalScore
          this.TotalStar = res.data.TotalStar
          this.pagination.total = res.data.totalRecords
          this.datable = res.data.data !== null ? res.data.data : []
          if (this.ScoreType === 1) {
            this.columns = this.columns1
          } else {
            this.columns = this.columns2
          }
          this.flag = true
        }
      }
    }

  }
</script>
<style lang='less'>
.wrapper{
  padding: 0 20px;
}
.programme{
  padding-bottom: 20px;
}
.gradeTit{
  background: #ffffff;
  padding: 0 20px 20px;
  font-size: 18px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.75);
}
.score{
  margin-left: 20px;
}
.star{
  margin-left: 20px;
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
.flex-flow{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
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
