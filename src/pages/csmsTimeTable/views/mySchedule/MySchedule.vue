<template>
  <div class="xy-content-module">
    <div class="schedule-content">
        <!--顶部按钮-->
        <div class="xy-schedule-title clearfix">
            <div class="fl xy-flex">
                <div style="margin-right:15px">
                  <span>学年学期：</span>
                  <cascader :data="yearSessionData" v-model="yearSession" style="width:200px; display:inline-block" @on-change="cascaderChange">
                  </cascader>
                </div>
            </div>
            <div class="fr xy-flex" style="padding-top:5px">
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" class="check-list">
                    <Checkbox label="1" v-if="role !== 3">显示班级</Checkbox>
                    <Checkbox label="1" v-if="role === 3">显示教师</Checkbox> <!--学生-->
                    <Checkbox label="2">显示教室</Checkbox>
                    <Checkbox label="3">显示时间</Checkbox>
                </CheckboxGroup>
                <!-- <Tooltip content="下载" placement="top-end"> -->
                  <i class="iconfont" @click="Export" title="下载" style="width: 19px; height: 19px; margin:-2px 0 0 15px; cursor:pointer">&#xe6c7;</i>
                <!-- </Tooltip> -->
            </div>
        </div>
        <div class="xy-content-body" id="xy-content-body">
            <div class="my-schedule-content" id="my-schedule-content">
                <div class="week-con pr" id="week-con">
                    <!--周次-->
                    <ul class="week-ul" v-if="weekNumData.length > 0">
                        <li v-for="(item, index) in weekNumData" :key="index" @click="dateSelect(item.Date)">
                            <span v-if="item.Week==='本周'" :data-date="item.Date" :class="item.IsCurrent?'is-cur-week':''">本周</span>
                            <span v-else :data-date="item.Date" :class="item.IsCurrent?'is-cur-week':''" >{{item.Week}}周</span>
                        </li>
                    </ul>
                    <!--本周-->
                    <div class="current-week pa" v-if="weekNumData.length > 0 && isCurrentWeek.weekStartDate !== ''">
                        <span >{{isCurrentWeek.weekStartDate}}&nbsp;至&nbsp;{{isCurrentWeek.weekEndDate}}</span>
                    </div>
                </div>
                <!--我的课表、行政班课表-->
                <div class="schedule" ref="schedule" v-show="weekNumData.length > 0 && tableData.length>0">
                    <div class="my-schedule-con" id="my-schedule-con">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th v-for="(week, index) in weekData" :key="index">
                                        <span >{{week.weekName}}</span>
                                        <span >{{week.date}}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(time,index) in tableTimes" :key="index">
                                    <td v-if="time.AMorPM==='NS'" colspan="8">{{time.AMorPMOrderName}}</td>
                                    <td v-else >{{time.AMorPMOrderName}}</td>
                                    <td v-for="(td, index) in 7" :key="index" v-show="time.AMorPM!=='NS'">
                                        <!-- :style="{
                                          'background': data.IsAdjustment ? '#ccc':xy.colors(data.CoursePlanAID).bg,
                                          'color':xy.colors(data.CoursePlanAID).color,
                                          'borderRadius':'0px 3px 3px 0px',
                                          'borderLeft':'3px solid'+xy.colors(data.CoursePlanAID).color,
                                        }" -->
                                        <div class="subject"
                                                v-for="(data, index) in tableData"
                                                :key="index"
                                                v-show="data.AMorPM === time.AMorPM && data.AMorPMOrder === time.AMorPMOrder && data.Day == td-1"
                                                :class="data.IsAdjustment ? 'dis-td-bg': ''"
                                                :style="{
                                                  'background': data.IsAdjustment ? '#ccc':xy.colors(data.CoursePlanAID).color,
                                                  'color':'#fff',
                                                }">
                                            <h5 style="color:#fff;">{{data.SubjectName}}</h5>
                                            <p class="class-name" v-if="isShowClass && role!==3 && data.CoursePlanTableFullName!==''"  :title="data.CoursePlanTableFullName">{{data.CoursePlanTableFullName}}</p>
                                            <p class="class-name" v-if="isShowClass && role===3 && data.TeacherInfos!==''"  :title="data.TeacherInfos">{{data.TeacherInfos}}</p>
                                            <p class="class-name" v-if="isShowHouse && data.HouseName !== null  && (data.BuildingName!=='' || data.HouseName!=='')"  :title="data.BuildingName+'/'+data.HouseName">{{data.BuildingName}}/{{data.HouseName}}</p>
                                            <p class="class-date"
                                                v-if="isShowDate && data.StartTime !== null && data.EndTime!== null"
                                                >{{data.StartTime}}-{{data.EndTime}}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!--暂无数据-->
                <div v-if="tableData.length===0" class="no-data-box">
                  <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                  <span class="no-data-text">您在本周暂时无课。</span>
                </div>
            </div>
        </div>
    </div>
</div>

</template>
<script>
  export default {
    name: 'MySchedule',
    components: {},
    data () {
      return {
        role: 0, // 角色
        isShowClass: true,
        isShowHouse: true,
        isShowDate: false,
        yearSessionData: [],
        yearSession: [],
        checkAllGroup: ['1', '2'],
        weekData: [],
        isCurrentWeek: {
          currentNum: '',
          weekStartDate: '',
          weekEndDate: ''
        },
        weekNumData: [],
        tableData: [],
        tableTimes: [],
        btnList: [],
        curScheduleName: '我的课表', // 当前课表名称
        curScheduleCode: 0 // 默认为 我的课表
      }
    },
    created () {
      this.role = this.$store.state.common.userBaseInfo.RoleType
    },
    mounted () {
      this.getSessionNodeList()
    },
    methods: {
      // 获取周课表
      async getWeekTimeTable (startDate, curScheduleUrl) {
        this.xy.loading()
        let weekOfday = this.xy.moment(startDate, 'YYYY-MM-DD').format('E')// 计算指定日期是这周第几天
        let lastSunday = this.xy.moment(startDate, 'YYYY-MM-DD').add(7 - weekOfday, 'days').format('YYYY-MM-DD')// 周日日期
        let res = await this.xy.get(`${this.$store.state.apiPath}${curScheduleUrl}`, { startDate: startDate, endDate: lastSunday })
        this.xy.unloading()
        if (res.success) {
          this.tableData = []
          this.tableTimes = []
          this.tableData = res.data.TimeTables
          if (this.tableData.length > 0) {
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].StartTime !== null) {
                this.tableData[i].StartTime = this.tableData[i].StartTime.substr(0, 5)
              }
              if (this.tableData[i].EndTime !== null) {
                this.tableData[i].EndTime = this.tableData[i].EndTime.substr(0, 5)
              }
            }
          }
          this.tableTimes = res.data.Times
        }
      },
      // 获取周次信息
      async getWeek (id) {
        if (id !== undefined) {
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/MyTimeTable/GetWeek`, { academicSessionID: id })
          if (res.success) {
            var resDataListWeek = res.data.ListWeek
            this.weekNumData = []
            if (resDataListWeek.length > 1) {
              for (var i = 0; i < resDataListWeek.length; i++) {
                var isCurrent = false
                if (resDataListWeek[i].Date === this.xy.moment(res.data.WeekStartDate).format('YYYY-MM-DD')) {
                  isCurrent = true
                }
                this.weekNumData.push({
                  Week: resDataListWeek[i].Week,
                  Date: resDataListWeek[i].Date,
                  IsCurrent: isCurrent
                })
              }
            } else {
              for (let i = 0; i < resDataListWeek.length; i++) {
                this.weekNumData.push({
                  Week: resDataListWeek[i].Week,
                  Date: resDataListWeek[i].Date,
                  IsCurrent: true
                })
              }
            }

            this.isCurrentWeek = {
              currentNum: '',
              weekStartDate: '',
              weekEndDate: ''
            }
            if (this.isCurrentWeek.weekStartDate === '') {
              let sub = this.weekNumData.map(function (item) { return item.IsCurrent }).indexOf(true)
              this.isCurrentWeek.weekStartDate = this.weekNumData[sub].Date
              let weekOfday = this.xy.moment(this.weekNumData[sub].Date, 'YYYY-MM-DD').format('E')// 计算指定日期是这周第几天
              let lastSunday = this.xy.moment(this.weekNumData[sub].Date, 'YYYY-MM-DD').add(7 - weekOfday, 'days').format('YYYY-MM-DD')// 周日日期
              this.isCurrentWeek.weekEndDate = lastSunday
              this.isCurrentWeek.currentNum = this.weekNumData[sub].Week
              this.weekData = []
              for (var j = 0; j < 7; j++) {
                // var date1 = xy.date.format(xy.date.add(new Date(this.weekNumData[sub].Date), 'd', i), 'MM-dd')
                var date1 = this.xy.moment(this.weekNumData[sub].Date, 'YYYY-MM-DD').add(j - weekOfday + 1, 'days').format('MM-DD')
                this.weekData.push({
                  date: date1,
                  weekName: this.xy.getChinesesWeekForNumSmall(j)
                })
              }
            }
            // 都有哪些课表
            this.btnList = []
            this.btnList = res.data.TimeTableInfo
            this.curScheduleName = this.btnList[0].Name
            this.curScheduleCode = this.btnList[0].Code
            this.getWeekTimeTable(res.data.WeekStartDate, this.btnList[0].Url)
          }
        }
      },

      // 学年学期
      async getSessionNodeList () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          this.yearSessionData = res.data
          this.yearSession = []
          var index = this.yearSessionData.map((item) => { return item.IsCurrent }).indexOf(true)
          if (index !== -1) {
            this.yearSession.push(this.yearSessionData[index].value)
            var index1 = this.yearSessionData[index].children.map((item) => { return item.IsCurrent }).indexOf(true)
            if (index1 !== -1) {
              this.yearSession.push(this.yearSessionData[index].children[index1].value)
            }
          } else {
            for (var i = 0; i < this.yearSessionData.length; i++) {
              if (this.yearSessionData[i].children.length > 0) {
                this.yearSession = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                return false
              }
            }
          }
          this.getWeek(this.yearSession[1])
        }
        this.xy.unloading()
      },
      // 切换学年学期
      cascaderChange (value, selectedData) {
        this.yearSession = value
        this.getWeek(value[1])
      },

      // 复选框选择
      checkAllGroupChange () {
        if (this.checkAllGroup.indexOf('1') !== -1) {
          this.isShowClass = true
        } else {
          this.isShowClass = false
        }
        if (this.checkAllGroup.indexOf('2') !== -1) {
          this.isShowHouse = true
        } else {
          this.isShowHouse = false
        }
        if (this.checkAllGroup.indexOf('3') !== -1) {
          this.isShowDate = true
        } else {
          this.isShowDate = false
        }
      },
      // 点击周次
      dateSelect (val) {
        var sub = this.weekNumData.map((item) => { return item.Date }).indexOf(val)
        this.weekNumData.map((item) => {
          item.IsCurrent = false
          return item.IsCurrent
        })
        this.weekNumData[sub].IsCurrent = true
        this.isCurrentWeek.weekStartDate = val

        let weekOfday = this.xy.moment(val, 'YYYY-MM-DD').format('E')// 计算指定日期是这周第几天
        let lastSunday = this.xy.moment(val, 'YYYY-MM-DD').add(7 - weekOfday, 'days').format('YYYY-MM-DD')// 周日日期
        this.isCurrentWeek.weekEndDate = lastSunday
        this.isCurrentWeek.currentNum = this.weekNumData[sub].Week
        this.weekData = []
        for (var j = 0; j < 7; j++) {
          // var date1 = xy.date.format(xy.date.add(new Date(val), 'd', i), 'MM-dd')
          var date1 = this.xy.moment(val, 'YYYY-MM-DD').add(j - weekOfday + 1, 'days').format('MM-DD')
          this.weekData.push({
            date: date1,
            weekName: this.xy.getChinesesWeekForNumSmall(j)
          })
        }
        this.getWeekTimeTable(val, this.btnList[0].Url)
      },
      // 导出课表
      Export () {
        var num = 0
        if (this.isShowClass) {
          num = num + 4
        };
        if (this.isShowHouse) {
          num = num + 2
        };
        if (this.isShowDate) {
          num = num + 1
        };
        this.xy.downFile(`${this.$store.state.apiPath}${this.btnList[0].ExportUrl}?startDate=${this.isCurrentWeek.weekStartDate}&expInfo=${num}&code=${this.curScheduleCode}`)
      }
    }
  }
</script>
<style lang="less" scoped>
.schedule-content{
    width:100%;
    background:#fff;
    background-size: 100% 100%;
}
.schedule-content .xy-schedule-title{
    padding: 20px 20px 0;
}
.xy-schedule-title .schedule-title-search{
    margin-left:10px;
    padding: 20px 20px 0;
}
.schedule-content .xy-content-body{
    padding:0;
}
.my-schedule-con{
  // height: 700px;
  // overflow-y: auto;
}
.week-ul{
    display:flex;
    // justify-content:center;
    flex-wrap:wrap;
}
.week-ul li b{
    font-size:16px;
}
.week-ul li span{
    font-size:14px;
    color:#000;
    padding:2px 7px;
    cursor:pointer;
    margin:0 4px;
    color: rgba(0,0,0,0.85);

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
.week-con{
  padding: 16px 205px 14px 15px;
  line-height: 28px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.current-week{
  right:20px;
  top:17px;
  color:#adadad;
}
.current-week .week-num{
    font-size:16px;
    font-weight:bold;
    margin-right:5px;
}
.my-schedule-content .schedule{
    position:relative;
}
.schedule .table{
    border: 1px solid #D8D8D8;
    background: #F4F5F7;
    text-align: center;
    /*cursor: pointer;*/
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 14px;
    width: 100%;
}
.schedule .table thead th{
    width:12.5%;
    height: 50px;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: middle;
    font-weight:700;
    color:rgba(0,0,0,0.85);
    border: 1px solid #d8d8d8;
}
.schedule .table tbody td{
    height: 60px;
    box-sizing: border-box;
    text-align: center;
    vertical-align: middle;
    position:relative;
    padding:1px 1px 0 1px;
    cursor:pointer;
    color:rgba(0,0,0,0.85);
    border: 1px solid #d8d8d8;
}
.schedule table tbody tr td:first-child{
}

.subject{
    padding:6px 0 6px 10px;
    background:#f5f5f5;
    text-align:left;
    min-height:55px;
    margin-bottom: 1px;
}
.subject>h5{
    font-weight:bold;
}
.subject>p{
    font-weight:normal;
}
.dis-td-bg {
    background: rgb(198, 198, 198) !important;
    border-left-color: rgb(135, 135, 135) !important;
    color: rgb(135, 135, 135) !important;
}
</style>
