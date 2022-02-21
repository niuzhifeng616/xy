// 考勤打卡
<template>
  <div class="TeacherAttendancePunchCard">
    <div class="xy-content-body">
        <div v-if="isInitial" class="no-data-box isInitital-opacity" style="background:#fff" v-cloak>
            <img class="no-data-img" :src="require('@/assets/common/loading.png')"/>
        </div>
        <div v-else class="xy-content-body-in">
            <img :src="require('@/assets/common/newTeacherBg.png')" />
            <div class="todaybox">
                <div class="title-font" v-cloak>{{todayTime.AttendanceTeamName}}</div>
                <div class="todaybox-day">
                    <!-- <div class="todaybox-day-fl">
                        <span class="ban">班&nbsp;</span>
                        <div class="ban-time" v-cloak>班次：正（{{todayTime.StartTimeName}} ~ {{todayTime.EndTimeName}}）</div>
                    </div> -->
                    <div class="todaybox-day-fr">
                        <span v-cloak>{{todayDate}}</span><span style="margin-left:8px" v-cloak>{{todayWeek}}</span>
                    </div>
                </div>
                <div class="clearfix todaybox-tab">
                    <div class="todaybox-tab-l clearfix">
                        <div class="todaybox-tab-list" :class="todayTime.FirstTeacherTypeID === 0 ? 'todaybox-tab-list2' : ''">
                            <span>
                                <span class="todaybox-tab-name">上班</span>
                                <span class="todaybox-tab-cont" v-cloak>{{todayTime.StartTimeName}}</span>
                            </span>
                            <span class="todaybox-tab-time">
                                <span v-if="todayTime.FirstTeacherTypeID === 0" class="todaybox-tab-name">未打卡</span>
                                <span v-else class="todaybox-tab-cont" v-cloak><Icon style="margin-right: 6px" color="#1677FF" size="18" type="ios-checkmark-circle" />{{todayTime.FirstTimeName}}已打卡</span>
                            </span>
                            <!-- <span v-if="isfState" class="todaybox-tab-state" v-cloak>
                                <span v-if="todayTime.FirstTeacherTypeName == '正常'" style="color:#19be6b; background:rgba(25, 190, 107, 0.2);padding: 4px 10px;border-radius: 5px;">{{todayTime.FirstTeacherTypeName}}</span>
                                <span v-else-if="todayTime.FirstTeacherTypeName == '迟到'" style="color:#f05a4a; background:rgba(240, 90, 74, 0.2);padding: 4px 10px; border-radius: 5px;">{{todayTime.FirstTeacherTypeName}}</span>
                                <span v-else-if="todayTime.FirstTeacherTypeName == '早退'" style="color:#f05a4a; background:rgba(240, 90, 74, 0.2);padding: 4px 10px; border-radius: 5px;">{{todayTime.FirstTeacherTypeName}}</span>
                                <span v-else-if="todayTime.FirstTeacherTypeName == '缺卡'" style="color:#f90; background:rgba(255, 153, 0, 0.2);padding: 4px 10px; border-radius: 5px;">{{todayTime.FirstTeacherTypeName}}</span>
                                <span v-else-if="todayTime.FirstTeacherTypeName == '外出'" style="color:#19be6b; background:rgba(25, 190, 107, 0.2);padding: 4px 10px; border-radius: 5px;">{{todayTime.FirstTeacherTypeName}}</span>
                                <span v-else style="color:#666; background:rgba(102, 102, 102, 0.2);padding: 4px 10px; border-radius: 5px;">{{todayTime.FirstTeacherTypeName}}</span>
                            </span> -->
                        </div>
                        <div class="todaybox-tab-list" :class="todayTime.LastTeacherTypeID === 0 ? 'todaybox-tab-list2' : ''">
                            <span>
                                <span class="todaybox-tab-name">下班</span>
                                <span class="todaybox-tab-cont" v-cloak>{{todayTime.EndTimeName}}</span>
                            </span>
                            <span class="todaybox-tab-time">
                                <span v-if="todayTime.LastTeacherTypeID === 0" class="todaybox-tab-name">未打卡</span>
                                <span v-else class="todaybox-tab-cont" v-cloak><Icon style="margin-right: 6px" color="#1677FF" size="18" type="ios-checkmark-circle" />{{todayTime.LastTimeName}}已打卡</span>
                            </span>
                            <!-- <span v-if="islState" class="todaybox-tab-state" v-cloak>
                                <span v-if="todayTime.LastTeacherTypeName == '正常'" style="color:#19be6b; background:rgba(25, 190, 107, 0.2);padding: 4px 10px; border-radius: 5px;">{{todayTime.LastTeacherTypeName}}</span>
                                <span v-else-if="todayTime.LastTeacherTypeName == '迟到'" style="color:#f05a4a; background:rgba(240, 90, 74, 0.2);padding: 4px 10px; border-radius: 5px;">{{todayTime.LastTeacherTypeName}}</span>
                                <span v-else-if="todayTime.LastTeacherTypeName == '早退'" style="color:#f05a4a; background:rgba(240, 90, 74, 0.2);padding: 4px 10px; border-radius: 5px;">{{todayTime.LastTeacherTypeName}}</span>
                                <span v-else-if="todayTime.LastTeacherTypeName == '缺卡'" style="color:#f90; background:rgba(255, 153, 0, 0.2);padding: 4px 10px; border-radius: 5px;">{{todayTime.LastTeacherTypeName}}</span>
                                <span v-else-if="todayTime.LastTeacherTypeName == '外出'" style="color:#19be6b; background:rgba(25, 190, 107, 0.2);padding: 4px 10px; border-radius: 5px;">{{todayTime.LastTeacherTypeName}}</span>
                                <span v-else style="color:#666; background:rgba(102, 102, 102, 0.2);padding: 4px 10px; border-radius: 5px;">{{todayTime.LastTeacherTypeName}}</span>
                            </span> -->
                        </div>
                    </div>
                    <div v-if="shiftBtn" class="todaybox-tab-r">
                        <button @click="SubmitAtt" :class="{'late':isLate }">
                            <span v-cloak>{{shiftName}}</span>
                            <span v-cloak>{{todaytime}}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
 </div>
</template>
<script>
  export default {
    name: 'courseSet',
    data () {
      return {
        modal_loading: false,
        isInitial: true,
        isfState: false,
        islState: false,
        isLate: false,
        loading: true,
        todayTime: '',
        todayDate: '',
        todayWeek: '',
        todaytime: '',
        shift: false,
        shiftName: '上班打卡',
        shiftBtn: ''
      }
    },
    created () {
      // 获取考勤时间
      this.GetByTodayTeacherId()
    },
    mounted () {},
    methods: {
      //  获取table分页数据
      async GetByTodayTeacherId () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/TeacherAttendanceRecord/GetByTodayTeacherId', null)
        if (res.success) {
          this.todayTime = res.data
          if (this.todayTime.FirstTeacherTypeName == null) {
            this.isfState = false
          } else {
            this.isfState = true
          }
          if (this.todayTime.LastTeacherTypeName == null) {
            this.islState = false
          } else {
            this.islState = true
          }
          // 获取当前时间日期
          var weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
          var dateTime = new Date(this.todayTime.ServerNowTime)
          var year = dateTime.getFullYear()
          var month = dateTime.getMonth() + 1
          var date = dateTime.getDate()
          var week = dateTime.getDay()

          if (month < 10) {
            month = '0' + month
          }
          if (date < 10) {
            date = '0' + date
          }
          this.todayDate = year + '-' + month + '-' + date
          this.todayWeek = weekDay[week]
          // 判断是否上班已经打过卡
          if (this.todayTime.FirstTeacherTypeID === 0) {
            this.shift = true
            this.shiftBtn = true
            console.log('需要上班打卡')
          } else {
            this.shift = false
            this.shiftBtn = true
            this.shiftName = '下班打卡'
          }
          // 判断是否下班已经打过卡
          if (this.todayTime.LastTeacherTypeID === 0) {
            this.shiftBtn = true
            console.log('还没下班')
          } else {
            this.shift = false
            this.shiftBtn = false
            this.shiftName = '下班打卡'
            console.log('已经下班')
            console.log(this.shiftBtn)
          }
          // 时间动态
          this.getData()
          this.isInitial = false
        }
      },
      // 打卡考勤
      SubmitAtt () {
        var that = this
        // 当前
        var currentTime = this.xy.moment(new Date()).format('HH:mm:ss')
        // 下班
        var EndTime = that.todayTime.EndTime
        console.log(this.shift)
        if (that.shift === true) {
          // 上班
          that.xy.post(`${that.$store.state.apiPath}/api/TeacherAttendanceRecord/CreateFirstTime`, null).then(res => {
            if (res.success) {
              that.GetByTodayTeacherId()
              that.xy.msgSuc('上班打卡成功。')
              that.shiftName = '下班打卡'
              that.isLate = false
            }
          })
        } else {
          // 如果当前时间 < 下班时间
          if (currentTime < EndTime) {
            // 早退
            this.$Modal.confirm({
              title: '早退打卡',
              content: '<p>您确认要早退打卡吗？</p>',
              onOk () {
                console.log('早退')
                that.xy.post(`${that.$store.state.apiPath}/api/TeacherAttendanceRecord/CreateLastTime`, null).then(res => {
                  if (res.success) {
                    that.GetByTodayTeacherId()
                    that.xy.msgSuc('下班打卡成功。') // 早退打卡成功！
                    that.shiftBtn = false
                  }
                })
              }
            })
          } else {
            // 正常下班
            console.log('下班')
            // 下班
            that.xy.post(`${that.$store.state.apiPath}/api/TeacherAttendanceRecord/CreateLastTime`, null).then(res => {
              if (res.success) {
                that.GetByTodayTeacherId()
                that.xy.msgSuc('下班打卡成功。') // 早退打卡成功！
                that.shiftBtn = false
              }
            })
          }
        }
      },
      getData () {
        var t = new Date()
        var h = t.getHours()
        var m = t.getMinutes()
        var s = t.getSeconds()
        this.todaytime = h + ':' + this.extra(m) + ':' + this.extra(s)
        setTimeout(() => {
          this.getData()
          if (this.todaytime > this.todayTime.StartTimeName) {
            if (this.todayTime.FirstTimeName !== '') {
              this.isLate = false
            } else {
              this.isLate = true
            }
          } else {
            this.isLate = false
          }
        }, 1000)
      },
      extra (x) {
        // 如果传入数字小于10，数字前补一位0。
        if (x < 10) {
          return '0' + x
        } else {
          return x
        }
      }
    }
  }
</script>
<style style="less" scoped>
.no-data-box {
  width: 392px;
  margin: 50px auto;
  position: relative;
}

.no-data-box > .no-data-img {
  width: 100%;
}

.no-data-box > .no-data-text {
  position: absolute;
  top: 207px;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 18px;
  color: #ccc;
  display: inline-table;
}
.todaydate{
    font-size:20px;
}
.todaydate > span{
    display:inline-block;
    margin-right:15px;
}
.xy-content-body {
    padding: 0;
    overflow: hidden;
    position: relative;
    margin: 20px;
}
.xy-content-body-in>img {
  width: calc(100% + 34px);
  position: absolute;
  bottom: -26px;
}

.todaybox {
  width: 580px;
  height: 404px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.15);
  overflow: hidden;
  margin: auto;
  position: absolute;
  top: 80px;
  right: 0;
  left: 0;
  padding: 28px 40px 58px;
}
.title-font {
  line-height: 24px;
  color: #333;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
}
    .todaybox > .todaybox-tit {
        display: block;
        height: 54px;
        line-height: 54px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        background: #4798FF;
    }

    .todaybox > .todaybox-day {
        display: block;
        height: 38px;
        text-align: center;
    }
        .todaybox > .todaybox-day > .todaybox-day-fl {
            display: inline-block;
            line-height: 38px;
        }
            .todaybox > .todaybox-day > .todaybox-day-fl > .ban {
                color: #4798FF;
                border: 1px solid #4798FF;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                display: inline-block;
                text-align: center;
                line-height: 22px;
            }

            .todaybox > .todaybox-day > .todaybox-day-fl > .ban-time {
                display:inline-block;
            }

        .todaybox > .todaybox-day > .todaybox-day-fr {
            display: inline-block;
            line-height: 38px;
            color: #999;
        }

.todaybox > .todaybox-tab > .todaybox-tab-l{
    vertical-align:middle;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

    .todaybox > .todaybox-tab > .todaybox-tab-l > .todaybox-tab-list {
        width: 237px;
        height: 78px;
        background: #ffffff;
        border: 1px solid #1677ff;
        border-radius: 4px;
        position:relative;
        margin-bottom: 48px;
        padding: 12px 22px;
    }
    .todaybox > .todaybox-tab > .todaybox-tab-l > .todaybox-tab-list2 {
      background: #f7f8f9;
      border: 1px solid #c7c7c8;
    }
    .todaybox > .todaybox-tab > .todaybox-tab-l > .todaybox-tab-list > span {
        color: #333333;
        line-height: 22px;
        display: block;
    }

        .todaybox > .todaybox-tab > .todaybox-tab-l > .todaybox-tab-list > .todaybox-tab-time {
            color: rgba(51,51,51,0.65);
            line-height: 22px;
            position: relative;
        }
        .todaybox-tab-time .todaybox-tab-cont {
            color: rgba(51,51,51,0.65);
            line-height: 22px;
        }
.todaybox-tab-name {
    margin-right: 5px;
}
.todaybox-tab-time {
    margin-top: 8px;

}
.todaybox-tab-time .todaybox-tab-name {
    display: inline-block;
    color: rgba(51,51,51,0.65);
    line-height: 22px;
    font-size: 14px;
}
 .todaybox > .todaybox-tab > .todaybox-tab-l > .todaybox-tab-list >.todaybox-tab-state {
  display: inline-block;
}
    .todaybox > .todaybox-tab > .todaybox-tab-l > .todaybox-tab-list > .todaybox-tab-state > span {
        font-size:12px;
    }

.todaybox > .todaybox-tab > .todaybox-tab-r{
    vertical-align:middle;
}

.todaybox > .todaybox-tab > .todaybox-tab-r > button{
    display:block;
    outline:none;
    border:none;
    border-radius:50%;
    width: 116px;
    height: 116px;
    cursor:pointer;
    text-align:center;
    background:-webkit-linear-gradient(to left,#66cffe,#2b7aeb);
    background:-o-linear-gradient(to right,#66cffe,#2b7aeb);
    background:-ms-linear-gradient(to left,#66cffe,#2b7aeb);
    background:-moz-linear-gradient(to left,#66cffe,#2b7aeb);
    background:linear-gradient(to right,#66cffe,#2b7aeb);
    overflow:hidden;
    box-shadow: 0px 0px 24px 0px #8d9bb5;
    transition: all 0.3s;
    margin-left:200px;
}

    .todaybox > .todaybox-tab > .todaybox-tab-r > .late {
        background: -webkit-linear-gradient(to left,#fecc66,#eb9a2b);
        background: -o-linear-gradient(to right,#fecc66,#eb9a2b);
        background: -ms-linear-gradient(to left,#fecc66,#eb9a2b);
        background: -moz-linear-gradient(to left,#fecc66,#eb9a2b);
        background: linear-gradient(to right,#fecc66,#eb9a2b);
        box-shadow: 0px 0px 24px 0px #b5a48d;
    }
.todaybox > .todaybox-tab > .todaybox-tab-r > button:hover{
    transition: all 0.3s;
    opacity:0.8;
    box-shadow: 0px 0px 15px 0px #8d9bb5;
}
.todaybox > .todaybox-tab > .todaybox-tab-r > button > span{
    display:block;
    color:#fff;
    text-align:center;
    margin-top:5px;
}

.todaybox > .todaybox-tab > .todaybox-tab-r > button > span:first-child{
    font-size:16px;
    font-weight:bold;
}
.todaybox > .todaybox-tab > .todaybox-tab-r > button > span:last-child{
    font-size:14px;
}
</style>
