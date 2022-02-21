<template>
  <div class="wrapper">
    <div class="top-title">
      <span class="gradeName">
        {{changeMoralObj.gradeName}}
      </span>
      <span class="className">
        {{changeMoralObj.className}}
      </span>
      <span class="fullName">
        {{changeMoralObj.fullName}}
      </span>
      <span class="star" v-if="scoreType === 1">
        <span>得星数：</span>
        <span>{{totalStar}}</span>
      </span>
      <span class="score">
        <span>得分：</span>
        <span>{{totalScore}}</span>
      </span>
    </div>
    <!-- main -->
    <div class="xy-content-body">
      <div class="xy-content-box">
        <XyAntTable
          :columns="columns"
          :dataSource="datable"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="1000"
          >
          <div slot="IndexManagementName" slot-scope="text, record">
            <div style="min-width:300px">
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
    name: 'oneStuDetails',
    inject: ['reload'],
    components: {
      XyAntTable
    },
    data () {
      return {
        mainUrl: this.xyApi + '/base',
        datable: [],
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
            dataIndex: 'Date',
            scopedSlots: { customRender: 'Date' }
          },
          {
            title: '指标项',
            dataIndex: 'IndexManagementName',
            scopedSlots: { customRender: 'IndexManagementName' }
          },
          {
            title: '评价时间',
            dataIndex: 'EvaTime',
            scopedSlots: { customRender: 'EvaTime' }
          }
        ],
        totalScore: 0,
        totalStar: 0,
        scoreType: 0
      }
    },
    computed: {
      changeMoralObj () {
        return this.$store.state.evaluate.changeMoralObj
      }
    },
    created () {
      this.loadTable()
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      async loadTable () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MoralEducationStatistics/GetStudentStatistics`, {
          studentID: this.$store.state.evaluate.changeMoralObj.stuID,
          academicYearID: this.$parent.yearSession[0],
          academicSessionID: this.$parent.yearSession[1],
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        })
        this.tableLoading = false
        if (res.success) {
          this.totalScore = res.data.TotalScore
          this.totalStar = res.data.TotalStar
          this.scoreType = res.data.ScoreType
          this.datable = res.data.data
          this.pagination.total = res.data.totalRecords
          if (this.columns.length > 3) {
            this.columns.splice(2, 1)
          }
          if (this.scoreType === 1) { // 1 :星星，0：打分
            this.columns.splice(2, 0, {
              title: '得星数（星）',
              dataIndex: 'Score',
              scopedSlots: { customRender: 'Score' }
            })
          } else {
            this.columns.splice(2, 0, {
              title: '得分',
              dataIndex: 'Score',
              scopedSlots: { customRender: 'Score' }
            })
          }
        }
      }
    }

  }
</script>
<style lang='less'>
.wrapper{
  padding: 0 20px;
}
.top-title{
  font-size: 18px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.75);
  background: #ffffff;
  padding: 20px;
  .fullName{
    margin-left: 20px;
  }
  .star{
    margin-left: 30px;
  }
  .score{
    margin-left: 30px;
  }
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
  margin-top: 20px;
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
