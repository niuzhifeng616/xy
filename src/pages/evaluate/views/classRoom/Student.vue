<template>
  <div class="xy-content-module">
    <!-- 评价学生 -->
    <div class="xy-content-body">
      <div>
        <div class="week-con" id="week-con">
            <!--周次-->
            <i class="iconfont" @click="changeDtList(true)">&#xe6f0;</i>
            <ul class="week-ul" v-if="weekList.length > 0">
                <li v-for="(item, indexs) in weekList[index]" :key="indexs" @click="dateSelect(item, indexs)">
                    <span v-if="item.Week==='本周'" :data-date="item.Date" :class="item.IsCurrent ? 'is-cur-week':''">本周</span>
                    <span v-else :data-date="item.Date" :class="item.IsCurrent ? 'is-cur-week':''" >{{item.Week}}周</span>
                </li>
            </ul>
            <i class="iconfont" @click="changeDtList(false)">&#xe6f1;</i>
        </div>
        <!--本周-->
        <div class="current-week" v-if="currentWeek">
            <span >{{currentWeek.Date}}&nbsp;至&nbsp;{{currentWeek.endDate}}</span>
        </div>
      </div>
      <div>
        <div class="schedule" ref="schedule" v-show="weekList.length > 0 && tableData.length>0">
            <div class="my-schedule-con">
                <table class="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th v-for="(week, index) in weekData" :key="index">
                                <span >{{week.weekName}}</span>
                                <!-- <span >{{week.date}}</span> -->
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(time,index) in tableTimes" :key="index">
                            <td v-if="time.AMorPM==='NS'" colspan="8"  style="border-right:none;">{{time.AMorPMOrderName}}</td>
                            <td v-else >{{time.AMorPMOrderName}}</td>
                            <td v-for="(td, index) in 7" :key="index" v-show="time.AMorPM!=='NS'">
                              <div v-for="(data, index) in tableData"
                                        :key="index">
                                <div class="subject"
                                @click="goBatch(data,time.AMorPMOrderName)"
                                        v-if="data.AMorPM === time.AMorPM && data.AMorPMOrder === time.AMorPMOrder && data.Day == td-1"
                                        :class="data.IsAdjustment ? 'dis-td-bg': ''"
                                        :style="{
                                    'background': data.IsAdjustment ? '#ccc':xy.colors(data.CoursePlanAID).bg,
                                    'color':xy.colors(data.CoursePlanAID).color,
                                    'borderRadius':'0px 3px 3px 0px',
                                    'borderLeft':'3px solid'+xy.colors(data.CoursePlanAID).color,
                                    }">
                                    <h5 >{{data.SubjectName}}</h5>
                                    <p class="class-name" :title="data.CoursePlanTableFullName">{{data.CoursePlanTableFullName}}</p>
                                    <p class="class-name" :title="data.TeacherInfos">{{data.TeacherInfos}}</p>
                                    <!-- <p class="class-name" v-if="data.HouseName"  :title="data.BuildingName+'/'+data.HouseName">{{data.BuildingName}}/{{data.HouseName}}</p>
                                    <p class="class-date"
                                        v-if="data.StartTime && data.EndTime"
                                        >{{data.StartTime}}-{{data.EndTime}}</p> -->
                                </div>

                              </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!--暂无数据-->
        <div v-if="tableData.length===0" class="no-data-box">
            <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" alt="图片" style="width:100%"/>
            <span class="no-data-text">
                暂无数据
            </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Student',
    data () {
      return {
        weekStart: '',
        weekEnd: '',
        tableTimes: [],
        tableData: [],
        weekList: [],
        yearID: 0,
        yearData: [],
        sessionID: 0,
        sessionData: [],
        weekNumData: [],
        weekData: [],
        isCurrentWeek: {
          currentNum: '',
          weekStartDate: '',
          weekEndDate: ''
        },
        apiPath: '',
        allWeek: [], // 接口返回回来的周数
        currentWeek: null, // 高亮显示的数据
        index: 0 // 周数下标
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getYear()
    },
    mounted () {},
    methods: {
      goBatch (data, names) {
        console.log(data.ClassDate)
        // this.weekStart = ''
        // this.weekEnd = ''
        let nowD = this.xy.moment(new Date()).format('YYYY-MM-DD')
        let tD = this.xy.moment(data.ClassDate).format('YYYY-MM-DD')
        let datas = {
          ClassDate: data.ClassDate,
          CollectionName: data.CollectionName,
          Time: names,
          SubjectName: data.SubjectName,
          ClassTableGenerateBaseID: data.ClassTableGenerateBaseID,
          SchoolDistrictID: data.SchoolDistrictID,
          StudentGradeForStudentYearID: data.StudentGradeForStudentYearID,
          DisciplineID: data.DisciplineID,
          SubjectID: data.SubjectID
        }
        let strs = `${this.xy.moment(datas.ClassDate).format('YYYY-MM-DD')} ${datas.CollectionName}  ${datas.Time}  ${datas.SubjectName}`
        this.$store.commit('common/getThreeMenuName', `${strs}`)
        // console.log(this.xy.moment(tD).diff(this.xy.moment(this.weekEnd), 'days'))
        if (this.xy.moment(nowD).diff(this.xy.moment(tD), 'days') >= 0) {
          if (this.xy.moment(tD).diff(this.xy.moment(this.weekEnd), 'days') >= -27) { // 可编辑
            datas.isEdit = true
            this.$store.commit('common/getParam', { params: JSON.stringify(datas) })
            this.$router.push({
              name: 'EvaluationOperation',
              query: this.$store.state.common.menuInfo
            })
          } else { // 不可编辑
            datas.isEdit = false
            this.$store.commit('common/getParam', { params: JSON.stringify(datas) })
            this.$router.push({
              name: 'EvaOperDesc',
              query: this.$store.state.common.menuInfo
            })
          }
        } else {
          this.xy.msgError('未来课程不可评价')
        }
      },
      // 分页 status === true 向前，！status向后
      changeDtList (status) {
        if (status) {
          if (this.index - 1 >= 0) {
            this.index -= 1
          } else {
            return this.xy.msgError('已经是第一页了')
          }
        } else {
          if (this.index + 1 <= this.weekList.length - 1) {
            this.index += 1
          } else {
            return this.xy.msgError('已经是最后页了')
          }
        }
      },
      // 获取学年
      async getYear () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/YearList`)
        this.xy.unloading()
        if (res.success) {
          this.yearData = res.data
          if (res.data.length > 0) {
            var arr = res.data.filter(function (item) { return item.IsCurrent === true })
            if (arr.length > 0) {
              this.yearID = arr[arr.length - 1].ID
            } else {
              if (res.data.length > 0) {
                this.yearID = res.data[0].ID
              }
            }
          }
          this.getSession(this.yearID)
        }
      },
      // 获取学期
      async getSession (id) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SessionList`, { yearID: id })
        this.xy.unloading()
        if (res.success) {
          this.sessionData = []
          this.sessionID = 0
          if (res.data.length > 0) {
            this.sessionData = res.data
            var arr = res.data.filter(function (item) { return item.IsCurrent === true })
            if (arr.length > 0) {
              this.sessionID = arr[arr.length - 1].AcademicSessionID
            } else {
              if (res.data.length > 0) {
                this.sessionID = res.data[0].AcademicSessionID
              }
            }
          }
          this.getWeek(this.sessionID)
        }
      },
      // 获取周次信息
      async getWeek () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Evaluation/GetWeek`, null, true)
        if (res.success) {
          var resDataListWeek = this.group(res.data, 8)
          if (resDataListWeek.length > 1) {
            for (let i in resDataListWeek) {
              for (let val of resDataListWeek[i]) {
                if (val.Week === '本周') {
                  this.index = Number(i)
                  this.weekStart = val.Date
                  this.weekEnd = this.xy.moment(val.Date, 'YYYY-MM-DD').add(6, 'days').format('YYYY-MM-DD')
                  this.currentWeek = {
                    Week: val.Week,
                    Date: val.Date,
                    WeekInfo: val.WeekInfo,
                    IsCurrent: true,
                    // 周日日期
                    endDate: this.xy.moment(val.Date, 'YYYY-MM-DD').add(6, 'days').format('YYYY-MM-DD')
                  }
                }
                val.IsCurrent = val.Week === '本周'
              }
            }
            this.weekList = resDataListWeek
          }
          // 需求设定为只显示8周
          // if (this.weekList.length > 8) {
          //   this.weekList.length = 8
          // }
          // 如果获取来的数据没有“本周”，将把数组第一周置为开始
          if (!this.currentWeek) {
            this.weekList[0].IsCurrent = true
          }
          // console.log(this.weekList)
          // if (this.isCurrentWeek.weekStartDate === '') {
          //   let sub = this.weekNumData.map((item) => { return item.IsCurrent }).indexOf(true)
          //   this.isCurrentWeek.weekStartDate = this.weekNumData[sub].Date
          //   let weekOfday = this.xy.moment(this.weekNumData[sub].Date, 'YYYY-MM-DD').format('E')// 计算指定日期是这周第几天
          //   let lastSunday = this.xy.moment(this.weekNumData[sub].Date, 'YYYY-MM-DD').add(7 - weekOfday, 'days').format('YYYY-MM-DD')// 周日日期
          //   this.isCurrentWeek.weekEndDate = lastSunday
          //   this.isCurrentWeek.currentNum = this.weekNumData[sub].Week
          this.weekData = []
          for (let i = 0; i < 7; i++) {
            // var date1 = xy.date.format(xy.date.add(new Date(_this.weekNumData[sub].Date), 'd', i), 'MM-dd')
            // var date1 = this.xy.moment(this.weekNumData[sub].Date, 'YYYY-MM-DD').add(i - weekOfday, 'days').format('MM-DD')
            this.weekData.push({
              // date: date1,
              weekName: this.xy.getChinesesWeekForNumSmall(i)
            })
          }
          // }
          this.getWeekTimeTable(this.currentWeek.Date || this.weekList[0].Date)
        }
      },
      // 把一个数组按照一定长度分割成若干数组
      group (array, subGroupLength) {
        let index = 0
        let newArray = []
        while (index < array.length) {
          newArray.push(array.slice(index, index += subGroupLength))
        }
        return newArray
      },
      // 获取周课表
      async getWeekTimeTable (startDate) {
        this.xy.loading()
        // let weekOfday = this.xy.moment(startDate, 'YYYY-MM-DD').format('E')// 计算指定日期是这周第几天
        // let lastSunday = this.xy.moment(startDate, 'YYYY-MM-DD').add(7 - weekOfday, 'days').format('YYYY-MM-DD')// 周日日期
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Evaluation/GetClassTable`, { start: startDate })
        this.xy.unloading()
        if (res.success) {
          // this.tableData = []
          // this.tableTimes = []
          this.tableData = res.data
          if (this.tableData.length > 0) {
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].StartTime) {
                this.tableData[i].StartTime = this.tableData[i].StartTime.substr(0, 5)
              }
              if (this.tableData[i].EndTime) {
                this.tableData[i].EndTime = this.tableData[i].EndTime.substr(0, 5)
              }
            }
          }
          this.getTimes(startDate)
        }
      },
      async getTimes (startDate) {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Evaluation/GetTableTimes`, {
          start: startDate
        })
        if (res.data) {
          this.tableTimes = res.data
        }
      },
      // 点击周次
      dateSelect (val, index) {
        if (val.Date === this.currentWeek.Date) { return }
        for (const i in this.weekList) {
          for (const v of this.weekList[i]) {
            if (v.Date === val.Date) {
              v.IsCurrent = true
              this.currentWeek = {
                Week: v.Week,
                Date: v.Date,
                WeekInfo: v.WeekInfo,
                IsCurrent: true,
                // 周日日期
                endDate: this.xy.moment(v.Date, 'YYYY-MM-DD').add(6, 'days').format('YYYY-MM-DD')
              }
            } else {
              v.IsCurrent = false
            }
          }
        }
        // var cur = this.btnList.filter(function (item) { return item.isActive === true })
        this.getWeekTimeTable(val.Date)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import './css/schedule.less';
  .week-con{
      background:#fff;
      width: 600px;
      margin:0 auto;
      padding-top:15px;
  }
  .week-con .iconfont{
      cursor: pointer;
      color:#b8b8b8;
      margin: 0 20px;
      padding: 0 10px;
      display: inline-block;
      vertical-align: middle;
      transition:all 0.3s;
  }
  .week-con .iconfont:hover{
      transition:all 0.3s;
      cursor: pointer;
      color:#b8b8b8;
      opacity:0.7;
  }
  .week-ul{
      // display:flex;
      width:406px;
      display: inline-block;
      justify-content:center;
      flex-wrap:wrap;
      overflow: hidden;
      white-space: nowrap;
      vertical-align: middle;
  }
  .week-ul li{
      display: inline-block;
  }
  .week-ul li b{
      font-size:16px;
  }
  .week-ul li span{
      font-size:14px;
      color:rgba(0,0,0,0.85);
      padding:2px 7px;
      cursor:pointer;
      margin:0 4px;
  }
  .week-ul li span:hover{
      background:#2d8cf0;
      color:#fff;
      border-radius:4px;
  }
  .is-cur-week{
      background:#2d8cf0;
      color:#fff!important;
      border-radius:4px;
  }
  .current-week{
      padding:2px 0 10px 0;
      color:#adadad;
      font-size:12px;
      text-align:center;
  }
  .current-week .week-num{
      font-size:16px;
      font-weight:bold;
      margin-right:5px;
  }
</style>
