
<!-- 我的德育评价 -->
<template>
  <div class="wrapper">
    <!-- 顶部搜索框 -->
    <div class="xy-content-title flex-flow">
      <div class="title-right">
        <span class="col0-85">学期/学年：</span>
        <cascader :data="yearSessionData"
                  v-model="yearSession"
                  :clearable="false"
                  @on-change="cascaderChange"
                  style="width:250px"
                  ></cascader>
      </div>
    </div>
    <div class="xy-content-body">
      <!-- 切换 -->
      <div class="xy-title-btn">
        <div class="xy-title-btn1">
            <span :class="{active:isActive===1}" @click="onActive(1)">我的班级</span>
            <span :class="{active:isActive===2}" @click="onActive(2)">我的德育</span>
        </div>
      </div>
      <!-- 我的班级 -->
      <div class="xy-bigBox"  v-show= "this.isActive === 1">
        <div style="margin: 10px 0;">
          <span style="font-size: 16px;font-weight: 700;" v-if="this.scoreType === 1">得星数：{{TotalStar}}</span>
          <!-- <span >得星数：{{TotalStar}}</span> -->
          <span style="margin-left: 10px;font-size: 16px;font-weight: 700;">得分：{{TotalScore}} </span>
        </div>
         <XyAntTable
          :columns="columns"
          :dataSource="dataList"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="1000"
          >
          <div slot="IndexManagementName" slot-scope="text, record">
            <div style="min-width:200px">
              {{ record.IndexManagementName}}
            </div>
          </div>
        </XyAntTable>
      </div>
      <!-- 我的德育 -->
      <div class="xy-bigBox"  v-show= "this.isActive === 2">
        <div style="margin: 10px 0;">
          <span style="font-size: 16px;font-weight: 700;" v-if="this.scoreType === 1">得星数：{{TotalStar}}</span>
          <!-- <span>得星数：{{TotalStar}}</span> -->
          <span style="margin-left: 10px;font-size: 16px;font-weight: 700;">得分：{{TotalScore}} </span>
        </div>
         <XyAntTable
          :columns="columns"
          :dataSource="dataList"
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
    name: 'myEvaOfMoral',
    inject: ['reload'],
    components: {
      XyAntTable
    },
    data () {
      return {
        txt: '该搜索条件下没有结果。',
        mainUrl: this.xyApi + '/base',
        schoolData: [], // 校区数据
        schoolDistrictID: '',
        yearSessionData: [],
        yearSession: [],
        isActive: 1, // 点击切换
        scoreType: 0,
        TotalScore: 0,
        TotalStar: 0,
        dataList: [],
        startScore: 0,
        columns: [
          {
            title: '日期',
            dataIndex: 'Date',
            width: 200
          },
          {
            title: '指标项',
            dataIndex: 'IndexManagementName',
            scopedSlots: { customRender: 'IndexManagementName' }
          },
          {
            width: 100,
            title: '得分',
            dataIndex: 'Score'
          },
          {
            width: 200,
            title: '评价时间',
            dataIndex: 'EvaTime'
          }
        ],
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
    computed: {},
    created () {
      this.$store.commit('common/getThreeMenuName', '')
      this.getSessionNodeList()
    },
    mounted () {
    },
    methods: {
      handleTableChange () {
        this.getQuestionnaires()
      },
      // 学年学期
      getSessionNodeList () {
        let that = this
        that.yearSessionData = []
        this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          this.xy.unloading()
          if (res.success) {
            that.yearSessionData = that.yearSessionData.concat(res.data)
            that.yearSession = []
            let index = this.yearSessionData.map((item) => {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.yearSession.push(this.yearSessionData[index].value)
              let index1 = this.yearSessionData[index].children.map((item) => {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                this.yearSession = [this.yearSessionData[index].value, this.yearSessionData[index].children[index1].value]
              } else {
                this.yearSession = [this.yearSessionData[index].value, this.yearSessionData[index].children[0].value]
              }
            } else {
              if (this.yearSessionData.length && this.yearSessionData[0].children.length) {
                this.yearSession = [this.yearSessionData[0].value, this.yearSessionData[0].children[0].value]
              } else {
                this.yearSession = [0, 0]
              }
            }
          }
          this.getQuestionnaires()
        })
      },
      cascaderChange (value) {
        this.pagination.current = 1
        this.yearSession = value
        this.getQuestionnaires()
      },
      // 获取table数据
      async getQuestionnaires () {
        this.tableLoading = true
        if (this.isActive === 1) {
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/MoralEducationStatistics/GetMyEVAClass`, {
            pageIndex: this.pagination.current,
            pageSize: this.pagination.pageSize,
            academicSessionID: this.yearSession[1],
            academicYearID: this.yearSession[0]
          })
          this.tableLoading = false
          if (res.success) {
            let resData = res.data.data
            this.scoreType = res.data.ScoreType
            this.TotalScore = res.data.TotalScore
            this.TotalStar = res.data.TotalStar
            this.pagination.total = res.data.totalRecords
            if (resData.length) {
              // 是否显示到秒
              // resData.map(item => {
              //   item.EvaTime = item.EvaTime.substring(0, item.EvaTime.length - 3)
              // })
              // this.dataList = resData.reverse()
              this.dataList = resData
              if (res.data.ScoreType === 1) { // 1 :星星，0：打分
                this.columns.splice(2, 1, {
                  title: '得星数（星）',
                  dataIndex: 'Score',
                  width: 200
                })
              } else {
                this.columns.splice(2, 1, {
                  title: '得分',
                  dataIndex: 'Score',
                  width: 200
                })
              }
            } else {
              this.dataList = []
            }
          }
        } else {
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/MoralEducationStatistics/GetMyEVAStudent`, {
            pageIndex: this.pagination.current,
            pageSize: this.pagination.pageSize,
            academicSessionID: this.yearSession[1],
            academicYearID: this.yearSession[0]
          })
          this.tableLoading = false
          if (res.success) {
            let resData = res.data.data
            this.scoreType = res.data.ScoreType
            this.TotalScore = res.data.TotalScore
            this.TotalStar = res.data.TotalStar
            this.pagination.total = res.data.totalRecords
            if (resData.length) {
              this.dataList = resData
              // this.dataList = resData.reverse()
              if (res.data.ScoreType === 1) { // 1 :星星，0：打分
                this.columns.splice(2, 1, {
                  title: '得星数（星）',
                  dataIndex: 'Score',
                  width: 200
                })
              } else {
                this.columns.splice(2, 1, {
                  title: '得分',
                  dataIndex: 'Score',
                  width: 200
                })
              }
            } else {
              this.dataList = []
            }
          }
        }
      },
      // 表格切换
      onActive (flag) {
        this.isActive = flag
        this.pagination.current = 1
        this.searchTxt = ''
        this.getQuestionnaires()
      }
    }
  }
</script>
<style lang='less'>
.wrapper{
  padding: 0 20px;
}
#none{
  width: calc(100% + 40px);
  min-height: 580px;
  background: rgb(249, 249, 249);
  position: relative;
  left: -20px;
}
.table-border{
  // 虚线边框
  // border-right: 1px dashed #e8e8e8;
  // 实线边框
  border-right: none !important;
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
  padding: 24px 20px;
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
</style>
