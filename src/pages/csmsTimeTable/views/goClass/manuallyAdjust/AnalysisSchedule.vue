<template>
  <!-- 8.手动调整-课表分析 -->
  <div class="analysis-schedule">
    <!-- 排课规则 -->
    <div class="class-table-analysis">
        <div class="class-table-analysis-title first clearfix">
            <div class="fl">排课规则</div>
            <dropdown trigger="click" class="fr">
                <Button  class="xy-primary">
                    导出
                    <icon type="ios-arrow-down"></icon>
                </Button>
                <dropdown-menu slot="list">
                    <dropdown-item><div @click="downLoadClassNum">各班实际班额</div></dropdown-item>
                    <dropdown-item><div @click="downLoadHouseNum">各课位教室数</div></dropdown-item>
                    <dropdown-item v-if="classTableData.ClassAverageInfo.length>0"><div @click="downLoadAverage">各班平均分</div></dropdown-item>
                </dropdown-menu>
            </dropdown>
        </div>
        <ol class="class-table-analysis-ol">
            <li class="clearfix">
                <span>课时</span>
                <span>课时分散</span>
                <div class="progress">
                  <div class="ctac-progress fl"><i-progress :percent="classTableData.DispersedPercentage" :stroke-width="10" hide-info /></div>
                  <div class="fr" style="padding:0px 16px; color:rgba(0,0,0,0.65)">{{classTableData.DispersedPercentage}}%</div>
                </div>
                <div v-if="classTableData.ProhibitPercentage!==100" class="ctac-info cursor-p" @click="detail('课时分散',1,classTableData.ClassDispersedInfo)">查看详情</div>
            </li>
            <li class="clearfix">
                <span>禁止</span>
                <span>禁止排课</span>
                <div class="progress">
                  <div class="ctac-progress fl"><i-progress :percent="classTableData.ProhibitPercentage" :stroke-width="10" hide-info /></div>
                  <div class="fr" style="padding:0px 16px; color:rgba(0,0,0,0.65)">{{classTableData.ProhibitPercentage}}%</div>
                </div>
                <div v-if="classTableData.ProhibitPercentage!==100" class="ctac-info cursor-p" @click="detail('禁止排课',2,classTableData.ClassProhibitInfo)">查看详情</div>
            </li>
            <li class="clearfix">
                <span>必须</span>
                <span>必须排课</span>
                <div class="progress">
                  <div class="ctac-progress fl"><i-progress :percent="classTableData.MustPercentage" :stroke-width="10" hide-info /></div>
                  <div class="fr" style="padding:0px 16px; color:rgba(0,0,0,0.65)">{{classTableData.MustPercentage}}%</div>
                </div>
                <div v-if="classTableData.MustPercentage!==100" class="ctac-info cursor-p" @click="detail('必须排课',3,classTableData.ClassMustInfo)">查看详情</div>
            </li>
            <li class="clearfix">
                <span>课时</span>
                <span>课时连排</span>
                <div class="progress">
                  <div class="ctac-progress fl"><i-progress :percent="classTableData.UnionPercentage" :stroke-width="10" hide-info /></div>
                  <div class="fr" style="padding:0px 16px; color:rgba(0,0,0,0.65)">{{classTableData.UnionPercentage}}%</div>
                </div>
                <div v-if="classTableData.UnionPercentage!==100" class="ctac-info cursor-p" @click="detail('课时连排',4,classTableData.ClassUnionInfo)">查看详情</div>
            </li>
        </ol>
    </div>
    <div class="line"></div>
    <!-- 平均分差值 -->
    <div v-if="classTableData.ClassAverageInfo.length>0" class="class-table-analysis">
        <div class="class-table-analysis-title clearfix">平均分差值</div>
        <div class="class-table-analysis-content">
            <div class="infor clearfix">
                <div class="fl">本班平均分与本课（层）总平均分差值</div>
                <div class="fr view-all-btn cursor-p" @click="detailAll('平均分差值',5,classTableData.ClassAverageInfo)">查看全部</div>
            </div>
            <ul class="schedule-ul">
              <li class="schedule-li" v-for="item in classTableData.GradeAverageInfo" :key="item.Name">
                  <div class="shedule-info">
                      <span class="shedule-icon"><i class="iconfont">&#xe703;</i></span>
                      <div class="shedule-right">
                          <span class="shedule-name nowrap" :title="item.Name">{{item.Name}}</span>
                          <div class="shedule-status">{{item.Count}}个班</div>
                      </div>
                  </div>
                  <div v-if="item.Count>0" class="shedule-bottom" @click="detail('平均分差值',5,item)"><i class="iconfont">&#xe6fd;</i>查看详情</div>
              </li>
            </ul>
        </div>
    </div>
    <div class="line"></div>
    <!-- 班额差值 -->
    <div v-if="classTableData.ClassQuotaInfo.length>0" class="class-table-analysis">
        <div class="class-table-analysis-title">班额差值</div>
        <div class="class-table-analysis-content">
            <div class="infor clearfix">
                <div class="fl">实际班额与所设班额差值</div>
                <div class="fr view-all-btn cursor-p" @click="detailAll('班额差值',6,classTableData.ClassQuotaInfo)">查看全部</div>
            </div>
            <ul class="schedule-ul">
              <li class="schedule-li" v-for="item in classTableData.GradeQuotaInfo" :key="item.Name">
                  <div class="shedule-info">
                      <span class="shedule-icon"><i class="iconfont">&#xe703;</i></span>
                      <div class="shedule-right">
                          <span class="shedule-name nowrap" :title="item.Name">{{item.Name}}</span>
                          <div class="shedule-status">{{item.Count}}个班</div>
                      </div>
                  </div>
                  <div v-if="item.Count>0" class="shedule-bottom" @click="detail('班额差值',6,item)"><i class="iconfont">&#xe6fd;</i>查看详情</div>
              </li>
            </ul>
        </div>
    </div>
    <div class="line"></div>
    <!-- 课位教室数 -->
    <div class="class-table-analysis">
        <div class="class-table-analysis-title">课位教室数</div>
        <div class="class-table-analysis-content" style="width:100%">
            <div class="infor">“/”后面的数字表示需要上自习且还未到自习班里的学生数。</div>
            <table class="class-position-table">
                <thead>
                    <tr><th></th><th>星期一</th><th>星期二</th><th>星期三</th><th>星期四</th><th>星期五</th><th>星期六</th><th>星期日</th></tr>
                </thead>
                <tbody>
                    <tr v-for="itemNodes in classTableData.ClassTableTimeInfo" :key="itemNodes.AMorPMOrderName">
                        <td v-if="itemNodes.AMorPM==='NS'" colspan="8"><b>{{itemNodes.AMorPMOrderName}}</b></td>
                        <td v-else style="color:#4196ff">{{itemNodes.AMorPMOrderName}}</td>
                        <td v-show="itemNodes.AMorPM!=='NS'" v-for="i in 7" :key="i">
                            <div v-for="(itemWeek,index) in classTableData.TimeInfo" :key="index">
                                <p v-if="itemNodes.AMorPM !=='NS' && itemNodes.AMorPM===itemWeek.AMorPM && itemNodes.AMorPMOrder===itemWeek.AMorPMOrder && itemWeek.Day === (i-1) ">{{itemWeek.RoomCount}}/{{itemWeek.StudentCount}}</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <Modal :styles="{top:'20px',width:nowWidth+'px'}"
          v-model="detailModal"
          :title="detailName"
          :loading="loading"
          :mask-closable="false"
          :transfer="false">
        <!-- 课时分散 -->
        <div v-if="nums===1">
            <i-table height="500" :columns="timeColumns" :data="timeTableData"></i-table>
        </div>
        <!-- 禁止排课 -->
        <div v-if="nums===2" class="modal-max">
            <div>列出已排上课的禁止排课时间</div>
            <ol>
                <li v-for="item in dataList" :key="item.ClassName">{{item.ClassName}}：{{item.ObjExplain}}</li>
            </ol>
        </div>
        <!-- 必须排课 -->
        <div v-if="nums===3" class="modal-max">
            <div>列出未排上课的必须排课时间</div>
            <ol>
                <li v-for="item in dataList" :key="item.ClassName">{{item.ClassName}}:{{item.ObjExplain}}</li>
            </ol>
        </div>
        <!-- 课时连排 -->
        <div v-if="nums===4" class="modal-max">
            <div>列出未达到所设连排次数的课</div>
            <ol>
                <li v-for="item in dataList" :key="item.ClassName">{{item.ClassName}}</li>
            </ol>
        </div>
        <!-- 平均分差值 -->
        <div v-if="nums===5">
            <i-table height="500" :columns="averageColumns" :data="averageTableData"></i-table>
        </div>
        <!-- 班额差值 -->
        <div v-if="nums===6">
            <i-table height="500" :columns="classNumsColumns" :data="classNumsTableData"></i-table>
        </div>
        <div slot="footer">
            <Button class="xy-modal-primary" shape="circle" @click="cancel">关闭</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    components: {
    },
    name: 'AnalysisSchedule',
    data () {
      return {
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        sloverResultCollectionID: 0,
        showScheduleName: '',

        nowWidth: 1000,
        detailModal: false,
        detailName: '各班平均分',
        loading: true,
        classTableData: {
          DispersedPercentage: 0, // 课时分散百分比
          ProhibitPercentage: 0, // 禁止排课百分比
          MustPercentage: 0, // 必须排课百分比
          UnionPercentage: 0, // 课时连排百分比

          ClassDispersedInfo: [], // 课时分散数据
          ClassProhibitInfo: [], // 禁止排课数据
          ClassMustInfo: [], // 必须排课数据
          ClassUnionInfo: [], // 课时连排数据

          GradeAverageInfo: [], // 平均分差值
          ClassAverageInfo: [], // 平均分差值详情：全部

          GradeQuotaInfo: [], // 班额差值
          ClassQuotaInfo: [], // 班额差值数据：全部

          ClassTableTimeInfo: [], // 课位教室数
          TimeInfo: []// 节次

        },
        nums: 0,
        detailData: {},
        dataList: [],
        // 平均分table
        averageColumns: [
          {
            title: '教学班',
            key: 'ClassName'
          },
          {
            title: '本班平均分',
            key: 'ClassObjSum'
          },
          {
            title: '课程（层）平均分',
            key: 'ObjSum'
          },
          {
            title: '差值',
            key: 'Difference',
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: params.row.Difference > 0 ? '+' + params.row.Difference : params.row.Difference
                  }
                })
              ])
            }
          }
        ],
        averageTableData: [],
        // 实际班额table
        classNumsColumns: [
          {
            title: '教学班',
            key: 'ClassName'
          },
          {
            title: '实际班额',
            key: 'ClassObjSum'
          },
          {
            title: '所设班额',
            key: 'ObjSum'
          },
          {
            title: '差值',
            key: 'Difference',
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: params.row.Difference > 0 ? '+' + params.row.Difference : params.row.Difference
                  }
                })
              ])
            }
          }
        ],
        classNumsTableData: [],
        // 课时分散table
        timeColumns: [
          {
            title: '教学班',
            key: 'ClassName'
          },
          {
            title: '哪天有多节课（连排课除外）',
            key: 'ObjExplain'
          }
        ],
        timeTableData: []
      }
    },
    created () {
      if (this.$store.state.csmstimetable.manualAdjust.sloverResultCollectionID !== 0) {
        this.sloverResultCollectionID = this.$store.state.csmstimetable.manualAdjust.sloverResultCollectionID
      }
      if (this.$store.state.csmstimetable.manualAdjust.showScheduleName !== '') {
        this.showScheduleName = this.$store.state.csmstimetable.manualAdjust.showScheduleName
      }
    },
    mounted () {
      this.getClassTableData()
    },
    methods: {
      // 课表分析
      async getClassTableData () {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverResult/GetSloverResult`, params)
        this.xy.unloading()
        if (res.success) {
          this.classTableData = res.data
        }
      },
      detail (type, num, item) {
        this.detailName = type
        this.nums = num
        if (num === 1) { // 课时分散
          this.nowWidth = 800
          this.timeTableData = item
        };
        if (num === 2) { // 禁止排课
          this.nowWidth = 500
          this.dataList = item
        };
        if (num === 3) { // 必须排课
          this.nowWidth = 500
          this.dataList = item
        };
        if (num === 4) { // 课时连排
          this.nowWidth = 500
          this.dataList = item
        };
        if (num === 5) {
          this.nowWidth = 1000
          this.detailData = item
          this.averageTableData = item.Detailed
        };
        if (num === 6) {
          this.nowWidth = 1000
          this.detailData = item
          this.classNumsTableData = item.Detailed
        };
        this.detailModal = true
      },
      detailAll (type, num, data) {
        this.nowWidth = 1000
        this.detailName = type
        this.nums = num
        if (num === 5) { // 平均分
          this.averageTableData = data
        };
        if (num === 6) { // 班额差值
          this.classNumsTableData = data
        };
        this.detailModal = true
      },
      cancel () {
        this.detailModal = false
        this.timeTableData = []
        this.dataList = []
        this.averageTableData = []
        this.classNumsTableData = []
      },
      // 导出班额
      downLoadClassNum () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/SloverResult/ExportClassQuota?classTableID=${this.classTableID}&sloverResultCollectionID=${this.sloverResultCollectionID}`)
      },
      // 导出教室数
      downLoadHouseNum () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/SloverResult/ExportTimeRoom?classTableID=${this.classTableID}&sloverResultCollectionID=${this.sloverResultCollectionID}`)
      },
      // 导出平均分
      downLoadAverage () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/SloverResult/ExportClassAverage?classTableID=${this.classTableID}&sloverResultCollectionID=${this.sloverResultCollectionID}`)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/manuallyAdjust.less';
</style>
