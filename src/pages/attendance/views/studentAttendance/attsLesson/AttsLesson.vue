<template>
  <div class="xy-content-module">
    <!-- 学生考勤-随堂考勤   // 缺少面包屑 -->
    <div class="xy-content-body">
        <div v-cloak class="attend-box">
            <div class="identity-page-module-left-header ">
                <div class="attend-tit">
                    <span v-cloak class="attend-week subtitle-font">第{{weekDate.currWeek}}周</span>
                    <span v-cloak class="attend-date">{{weekDate.start == ''||weekDate.start===undefined ? '' : xy.moment(new Date(weekDate.start)).format('YYYY/MM/DD')}} - {{weekDate.end == ''||weekDate.end===undefined ? '' : xy.moment(new Date(weekDate.end)).format('YYYY/MM/DD')}}</span>
                </div>
                <!-- <div class="circle-1"><div class="circle-1-1"><div class="circle-1-2"></div></div></div>
                <div class="circle-2"><div class="circle-2-1"><div class="circle-2-2"></div></div></div>
                <div class="circle-3"><div class="circle-3-1"><div class="circle-3-2"></div></div></div> -->
            </div>
            <!--初始loading-->
            <!-- <div v-if="isInitial" class="no-data-box isInitital-opacity">
                <img class="no-data-img" src="@/assets/common/loading.png" />
            </div> -->
            <!--暂无数据-->
            <div v-if="isEmpty && !isInitial" class="no-data-box">
                <img class="no-data-img" src="@/assets/common/nullData.svg" />
                <span class="no-data-text">
                    您还没有需要进行考勤的课程，请添加课程。
                </span>
            </div>
            <div style="padding: 0 20px 20px">
                <table v-if="!isEmpty && !isInitial" class="attend-table">
                    <thead>
                        <tr>
                            <th>
                            </th>
                            <th v-for="(itemWeek, index) in weekDay" :key="index">
                                <p v-cloak>{{itemWeek.d}}</p>
                                <p v-cloak>{{itemWeek.s}}</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(itemNodes, index) in nodes" :key="index">
                            <td v-cloak :colspan="itemNodes.AMorPM === 'NS' ? 8 : 1">
                                {{itemNodes.AMorPMOrderName}}
                            </td>
                            <td v-for="i in 7" :key="i"  v-show="itemNodes.AMorPM !== 'NS'">
                              <template v-for="(itemWeek,index) in dateWeek" >
                                <div
                                  :key="index"
                                  v-if="itemNodes.AMorPM==itemWeek.AMorPM && itemNodes.AMorPMOrder==itemWeek.AMorPMOrder && itemWeek.Day== (i-1) "
                                  :style="{
                                  textAlign:'left',
                                  paddingLeft:'10px',
                                  maxWidth: '200px',
                                  background:xy.colors(itemWeek.CoursePlanAID).bg,
                                  color:xy.colors(itemWeek.CoursePlanAID).color,
                                  borderRadius:'0px 3px 3px 0px',
                                  borderLeft:'3px solid'+xy.colors(itemWeek.CoursePlanAID).color,
                                  marginBottom:'2px'}"
                                  @click="modalEditAttend(itemWeek, itemNodes.AMorPMOrderName)"
                                  >
                                    <span v-cloak class="attend-cont-tit">{{itemWeek.SubjectName}}</span>
                                    <span v-cloak class="attend-cont-year">{{itemWeek.CollectionName}}</span>
                                </div>
                              </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  </div>
 </template>

<script>
  export default {
    name: 'AttsLesson',
    data () {
      return {
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        // 切换周
        weekdata: '1',
        // 获取课表节次
        nodes: '',
        dateWeek: '',
        // 获取周时间
        weekDate: '',
        weekDateStrat: '',
        weekDateEnd: '',
        // 获取周一到周日
        weekDay: [{ d: '星期一', s: '' }, { d: '星期二', s: '' }, { d: '星期三', s: '' }, { d: '星期四', s: '' }, { d: '星期五', s: '' }, { d: '星期六', s: '' }, { d: '星期日', s: '' }],
        // 设置信息
        settingInfo: {
          couldEditHistory: -1 // 考勤状态修改限制,-1 为不做限制
        },
        // apiPath: 'http://192.168.20.35:5011'
        apiPath: ''
      }
    },
    computed: {
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      // 获取考勤设置
      this.GetSetting()
    },
    mounted () {
    },

    methods: {
      // 获取考勤设置
      async GetSetting () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/AttsSetting/GetSetting`
        )
        if (res.success) {
          this.settingInfo.couldEditHistory = res.data.HistoryChange
          // 获取节次
          this.GetClassTimeList()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 获取课表节次
      async GetClassTimeList () {
        let res = await this.xy.get(
          this.apiPath + `/api/AttsLesson/GetClassTableTimes`, {
            weektype: this.weekdata
          }
        )
        if (res.success) {
          this.nodes = res.data
          // 获取课表内数据
          this.GetClassTableGenerate()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 根据时间获取教师排课信息
      async GetClassTableGenerate () {
        let res = await this.xy.get(
          this.apiPath + `/api/AttsLesson/GetClassTableGenerateBaseByTeacher`, {
            week: this.weekdata
          }
        )
        this.isInitial = false
        if (res.success) {
          if (res.data != null && res.data.length > 0) {
            this.dateWeek = res.data
            this.isEmpty = false
          } else {
            this.isEmpty = true
          };
          // 获取周时间
          this.GetCurWeek()
        } else {
          this.isEmpty = true
          this.xy.msgError(res.msg)
        }
      },
      // 获取当前周信息
      async GetCurWeek () {
        let res = await this.xy.get(
          this.apiPath + `/api/AttsLesson/GetCurWeek`, {
            week: this.weekdata
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.weekDate = res.data
          this.weekDateStrat = this.weekDate.start
          this.weekDateEnd = this.weekDate.end
          for (var i = 0; i < 7; i++) {
            this.weekDay[i].s = this.xy.moment(new Date(res.data.start)).add(i, 'days').format('MM-DD')
          };
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 去考勤
      async modalEditAttend (item, AMorPMOrderName) {
        // 考勤时间限制：不得在明天之后，并且只能修改设置范围内的日期
        var now = this.xy.moment()
        var thatDay = this.xy.moment(item.ClassDate) // 要进入的日期
        var notEarlierThan = this.xy.moment().subtract(this.settingInfo.couldEditHistory, 'day').startOf('day') // 设置中不得早于的日期
        if (now.isBefore(thatDay)) {
          this.xy.msgError('尚未达到该考勤时间。')
          return false
        } else if (thatDay.isBefore(notEarlierThan)) {
          this.xy.msgError('可修改的日期不能早于' + this.xy.moment(notEarlierThan).format('YYYY-MM-DD') + '。')
          return false
        }
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/AttsLesson/IsAttStatus?baseID=` + item.ClassTableGenerateBaseID
        )
        this.xy.unloading()
        if (res.success) {
          if (res.data) {
            this.$store.commit('attendance/setitem', JSON.stringify(item))
            this.$store.commit('attendance/setAMorPMOrderName', JSON.stringify(AMorPMOrderName))
            this.$store.commit('common/getThreeMenuName', this.xy.moment(new Date(item.ClassDate)).format('YYYY-MM-DD') + ' ' + item.CoursePlanTableFullName + ' ' + item.SubjectName + ' ' + AMorPMOrderName)
            this.$router.push({
              path: '/xyHome/TakeAttendance',
              query: this.$store.state.common.menuInfo
            })
          } else {
            this.xy.msgError('考勤时间未开始，教师不可做考勤。')
          }
        } else {
          this.xy.msgError('res.msg')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.att-title {
    align-items: center;
    justify-content: space-between;
    display: flex;
    display: -webkit-flex;
}
.att-select {
    font-size: 14px;
    color: #444;
}
.att-select span {
    padding: 0 3px;
    display: block;
    float: left;
    border-bottom: none;
    margin-right: 40px;
    line-height: 35px;
    cursor:pointer;
    border-bottom: 4px solid transparent;
}
.att-select span.currents {
    color: #4196FF;
    border-bottom: 4px solid #4196FF;
}
.attend-table {
    width: 100%;
    margin-bottom: 15px;
}
    .attend-table > thead {
      border: 1px solid #e8e8e8;
    }
    .attend-table > thead > tr > th {
        height: 62px;
        white-space: nowrap;
        overflow: hidden;
        background-color: #fafafa;
        text-align: center;
        padding: 8px 0 4px;
        p:nth-child(1) {
          font-size: 14px;
          line-height: 22px;
          color: rgba(0,0,0,0.85);
          font-weight: bold;
        }
        p:nth-child(2) {
          color: rgba(0,0,0,0.45);
          font-size: 12px;
          line-height: 22px;
        }
    }
.attend-table > tbody > tr > td:nth-child(1) {
  font-size: 14px;
  line-height: 22px;
  color: rgba(0,0,0,0.65);
  padding: 20px;
  min-width: 70px;
}
.attend-table > tbody > tr > td{
    border: 1px solid #e8eaec;
    text-align:center;
    padding-top:0;
    padding-bottom:0;
    height:58px;
    width: 166px;
}
.attend-table > tbody > tr > td > div{
    padding: 10px 10px;
    background: #eee;
    border-radius: 3px;
    cursor: pointer;
    color:#333;
    overflow: hidden;
    transition: all 0.3s;
    margin: 0 !important;
}
.attend-table > tbody > tr > td>div:hover{
    transition:all 0.3s;
    background: #ccc;
}
.attend-table > tbody > tr > td  span{
    display:inline-block;
    width:100%;
}

/* 全选复选框 */
.att-checkBox-selectAll {
    position: absolute;
    top: -10px;
    left: -5em;
}

.examina-table{
    width:100%;
    margin-bottom:15px;
}
.examina-table > thead > tr > th{
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #f8f8f9;
    border:1px solid #e8eaec;
}
.examina-table > tbody > tr > td > .sort-room{
    display:block;
}
.examina-table > tbody > tr > td > .sort-address{
    display:block;
}
.examina-table > tbody > tr > td{
    min-width: 0;
    height: 48px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    border: 1px solid #e8eaec;
    padding:0 18px;
    text-align:center;
}
.examina-table > tbody > tr > .examin-td{
    min-width: 0;
    height: 48px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    border: 1px solid #e8eaec;
}
.examina-table > tbody > tr > .examin-td > span{
    display:block;
    margin: 5px 0;
}
.examina-table > tbody > tr > .examin-td > .own-teacher > span{
    display: inline-block;
    padding: 1px 7px;
    background: #2196F3;
    color: #fff;
    border-radius: 3px;
}
.attend-box {
  padding-top: 8px;
}
.xy-content-body .attend-box .identity-page-module-left-header {
    position: relative;
    height: 60px;
    line-height: 60px;
    padding: 0px 10px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    color: #fff;
    overflow: hidden;
}
.identity-page-module-left-header .circle-1 {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: #5877C6;
    position: absolute;
    top: -90px;
    left: 100px;
}

.identity-page-module-left-header .circle-1-1 {
    width: 95px;
    height: 95px;
    border-radius: 50%;
    background: #6683CE;
    margin: 18px auto;
    text-align: center;
}

.identity-page-module-left-header .circle-1-2 {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    background: #7894DB;
    margin-top: 10px;
    display: inline-block;
}

.identity-page-module-left-header .circle-2 {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #5877C6;
    position: absolute;
    top: 32px;
    left: 300px;
    z-index: 1;
}

.identity-page-module-left-header .circle-2-1 {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #6683CE;
    margin: 8px auto;
    text-align: center;
}

.identity-page-module-left-header .circle-2-2 {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #7894DB;
    margin-top: 5px;
    display: inline-block;
}

.identity-page-module-left-header .circle-3 {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #5877C6;
    position: absolute;
    top: -56px;
    right: -20px;
}

.identity-page-module-left-header .circle-3-1 {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #6683CE;
    margin: 9px auto;
    text-align: center;
}

.identity-page-module-left-header .circle-3-2 {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #7894DB;
    margin-top: 12px;
    display: inline-block;
}
.identity-page-module-left-header .attend-tit {
  display: flex;
  flex-direction: column;
  text-align: center;
  line-height: 22px;
}
.attend-tit span:nth-child(1) {
  font-size: 18px;
  color: #262626;
  font-weight: bold;
  margin-bottom: 3px;
}
.attend-tit span:nth-child(2) {
  font-size: 14px;
  color: rgba(38,38,38,0.45);
}
/*随堂考勤详情*/
.student-item {
    position: relative;
    width: 15.6%;
    text-align: center;
    margin-right: 1.24%;
    margin-bottom:25px;
    border: 1px solid #E5E7EA;
    border-radius: 5px;
    padding-top: 20px;
    font-size: 16px;
    color: #444;
}
.student-item:hover {
    box-shadow: 0px 2px 15px 0px rgba(107,107,107,0.2);
    border: 1px solid #ECEEF1;
}
.student-item:nth-child(6n) {
    margin-right: 0%;
}
.student-item img {
    width: 110px;
    height: 110px;
    display: block;
    margin: 0 auto 10px;
    border: 1px solid rgba(0,0,0,0);
    border-radius: 50%;
    overflow: hidden;
}
.student-item .default-head {
    background: url(/image/default_head.png) no-repeat center;
}
.student-item .school-number {
    margin: 12px 0 15px;
}
.student-item .select-bg {
    background: #E6EFFB;
    position:relative;
    height:53px;
}

.student-check {
    position: absolute;
    top: 18px;
    left: 18px;
}

.select-change {
    font-size: 12px;
    border-radius: 6px;
}
.select-change.ivu-select-single .ivu-select-selection {
    border: none;
    border-radius: 0 0 6px;
    height: 53px;
    background: #E6EFFB url(/image/cheack_type.png) no-repeat 90% center;
    background-size: 4px 19px;
    transition: none;
}

.select-disableSelector.select-change.ivu-select-single .ivu-select-selection {
    background: #E6EFFB;
    transition: none;
    cursor: inherit;
}

.select-change.ivu-select-single .ivu-select-selection .ivu-select-selected-value,
.select-change.ivu-select-single .ivu-select-selection .ivu-select-placeholder {
    line-height: 53px;
    height: 53px;
    font-size: 16px;
    color: #1665D8;
}
.select-change .ivu-select-selection-focused .ivu-select-arrow,
.select-change .ivu-select-selection:hover .ivu-select-arrow,
.select-change .ivu-select-arrow {
    display: none;
}
</style>
