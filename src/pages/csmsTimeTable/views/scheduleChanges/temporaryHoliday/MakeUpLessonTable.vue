<!-- 补课 -->
<template>
  <div class="xy-content-module">
    <div>
      <div class="temporary-holiday-header">
        <div class="clearfix">
          <div class="fl">
            <Button class="xy-primary"
                    @click="creatHoliday">创建补课</Button>
            <Button class="xy-info"
                    @click="openModalStartClash">冲突校验</Button>
          </div>
          <Alert show-icon
                 class="fl"
                 closable
                 style="margin:0 0 0 10px;">
            设置临时性的放假或补课。设为放假的日期将删除教师和学生的课表。设为补课的日期将为教师和学生生成课表。
          </Alert>
        </div>
      </div>
      <div class="temporary-holiday-body">
        <div v-if="datatable.length>0">
          <ul class="temporary-holiday-ul">
            <li class="temporary-holiday-li"
                v-for="(item,index) in datatable"
                :key='index'
                @click="look(item)">
              <div class="top">
                <i class="iconfont icon-holiday"
                   v-if="item.BackupPeriod==1"
                   style=" background:#FFBF00">&#xe703;</i>
                <i class="iconfont icon-holiday"
                   v-if="item.BackupPeriod==2"
                   style="background:#56D36C">&#xe703;</i>
                <i class="iconfont icon-holiday"
                   v-if="item.BackupPeriod==3"
                   style="background:#4196FF">&#xe703;</i>
                <div class="content">
                  <h5>补课</h5>
                  <p>
                    <span class="tit">补课时段：</span>
                    <span >{{item.BackupPeriod==1?'全天':(item.BackupPeriod==2?'上午':(item.BackupPeriod==3?'下午':'--'))}}</span>
                  </p>
                  <p class="time-text">
                    <span class="tit">补课日期：</span>
                    <span>{{item.HolidayDate != '0001-01-01'?item.HolidayDate:'--'}}</span>
                  </p>
                  <p class="time-text">
                    <span class="tit"> 使用哪天课表：</span>
                    <span>{{item.BackupDate != '0001-01-01'?item.BackupDate:'--'}}</span>
                  </p>
                </div>
              </div>
              <div class="bottom">
                <p class="reason"

                   v-if="item.HolidayReason.length<60">原因：{{item.HolidayReason}}</p>
                <p class="reason"

                   v-else>原因：{{item.HolidayReason.substring(0,60)}}...</p>
              </div>
            </li>
          </ul>
          <div class="text-right pr"
               style="margin-top:10px;">
            <page :total="total"
                  :page-size="pageSize"
                  :current="pageCurrent"
                  :page-size-opts="pages"
                  show-sizer
                  show-total
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"></page>
          </div>
        </div>
        <!--暂无补课信息-->
        <div v-if="datatable.length==0 && !isInitial"
             class="no-data-box"
             >
          <img class="no-data-img"
               src="@/assets/common/nullData.svg" />
          <span class="no-data-text"
                >暂无补课信息。</span>
        </div>
      </div>
      <div id="Tablemix"></div>
      <!-- 冲突校验 -->
      <modal v-model="modalStartClash"
             title="上课冲突校验"
             :mask-closable="false"
             width="448"
             :transfer="false">
        <div>
          <div v-if="!isCheck">
            <div class="box-topblock-week"
                 :class="isClashDateTye == 1?'topblock-week-active':''"
                 @click="selectClashDate(1)">
              <span class="topblock-tit">本周</span>

              <div class="topblock-time">
                <span>{{clashStartDate}}</span>
                <span style="margin:0 2px;">-</span>
                <span>{{clashEndDate}}</span>
              </div>
              <Icon type="md-checkmark"
                    v-if="isClashDateTye == 1" />
            </div>

            <div class="box-topblock-week"
                 :class="isClashDateTye == 2?'topblock-week-active':''"
                 @click="selectClashDate(2)">
              <span class="topblock-tit">下周</span>

              <div class="topblock-time">
                <span>{{clashNextStartDate}}</span>
                <span style="margin:0 2px;">-</span>
                <span>{{clashNextEndDate}}</span>
              </div>
              <Icon type="md-checkmark"
                    v-if="isClashDateTye == 2" />
            </div>

            <div class="box-topblock-week"
                 :class="isClashDateTye == 3?'topblock-week-active':''"
                 @click="selectClashDate(3)">
              <span class="topblock-tit">本月</span>

              <div class="topblock-time">
                <span>{{clashStartDate}}</span>
                <span style="margin:0 2px;">-</span>
                <span>{{clsshEndMonthDate}}</span>
              </div>
              <Icon type="md-checkmark"
                    v-if="isClashDateTye == 3" />
            </div>

            <Form style="margin-top:20px;position:relative" >
              <FormItem label="校验时间段"
                        label-position='left'
                        :label-width="85"
                        @click.native="selectClashDate(4)"
                        label-for="time">
                <date-picker type="date"
                             element-id='time'
                             v-model="pickerStartDate"
                             placeholder="请选择时间"
                             style="width: 126px;display:inline-block"></date-picker>
                <span>--</span>
                <date-picker type="date"
                             v-model="pickerEndDate"
                             placeholder="请选择时间"
                             style="width: 126px;display:inline-block"></date-picker>
                <Icon type="md-checkmark"
                      v-if="isClashDateTye == 4"
                      color="#4196FF"
                      size="22" />
              </FormItem>
            </Form>
          </div>
          <div class="startCheck"
               v-if="isCheck">
            <div class="generate-course-results">
              <span class="iconfont" v-if="!isComplete" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
              <span class="results-notice"
                    v-if="!isComplete">正在进行上课冲突校验，请勿进行其他操作。</span>
              <span class="results-notice"
                    v-if="isComplete">校验完成</span>
            </div>
            <div class="result-head"
                 style="margin-top:20px;">
              <span>数据队列：</span>
              <span style="margin-left:5px;"
                    >{{curDay+1}}/{{totalDay}}</span>
            </div>
            <ul class="clearfix check-list">
              <li data-index="0"
                  class="complete-option"
                  v-for="(item,index) in enableInfo"
                  :key='index'>
                <!-- 等待 -->
                <span class="state-complete"
                      v-if="item.status == 0">
                  <span class="generate-text"
                        >正在等待，正在检查{{item.curDate}}里的上课冲突。</span>
                </span>
                <!-- 进行中 -->
                <span v-if="item.status == 1">
                  <span class="data-list-state">
                    <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                  </span>
                  <span class="generate-text"
                        >正在进行，正在检查{{item.curDate}}里的上课冲突。</span>
                  <i-progress :percent="percentVal"
                              status="active"
                              :stroke-width="16" />
                </span>
                <!-- 成功 -->
                <span v-if="item.status == 2">
                  <span class="data-list-state data-list-state-error">
                    <Icon type="ios-checkmark-circle" />
                  </span>
                  <span class="generate-text"
                        >成功，正在检查{{item.curDate}}里的上课冲突。</span>
                </span>
                <!-- 失败 -->
                <span v-if="item.status == 3">
                  <span class="data-list-state data-list-state-error">
                    <Icon type="md-close-circle"
                          color="#ed4014" />
                  </span>
                  <span class="generate-text"
                        >失败，正在检查{{item.curDate}}里的上课冲突。</span>
                  <span style="color:#2d8cf0;cursor:pointer"
                        @click="exprot(item)">导出详情</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div slot="footer">
          <div v-if="!isCheck">
            <Button class='xy-modal-close'
                    @click="modalStartClash = false">取消</Button>
            <Button class="xy-modal-primary"
                    shape="circle"
                    @click="startClash">确定</Button>
          </div>
          <div v-if="isCheck && isComplete">
            <Button class='xy-modal-close'
                    @click="modalStartClash = false">关闭</Button>
          </div>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        total: 0, // 总条数
        pageSize: 15, // 每页显示条数
        pageCurrent: 1, // 当前页码
        pageList: '', // 当前页数据条数
        pages: [15, 30, 50, 100], // 默认每页可选10/20/50/100条
        datatable: [],
        isInitial: true,
        // 冲突校验
        modalStartClash: false,
        isClashDateTye: 1,
        clashStartDate: '', // 当天日期
        clashEndDate: '', // 当周最后一天日期
        clashNextStartDate: '', // 下周第一天日期
        clashNextEndDate: '', // 下周最后一天日期
        clsshEndMonthDate: '', // 当月最后一天日期
        pickerStartDate: new Date(),
        pickerEndDate: new Date(),
        isCheck: false, //
        isComplete: false,
        enableInfo: [],
        totalDay: '',
        curDay: 0,
        percentVal: 0,
        dateFun: {}
      }
    },
    created: function () {
      this.$store.commit('common/getThreeMenuName', '')
      this.dateFun = {
        // 日期添加
        add: function (date, strInterval, Number) {
          switch (strInterval) {
            case 's': return new Date(Date.parse(date) + (1000 * Number))
            case 'n': return new Date(Date.parse(date) + (60000 * Number))
            case 'h': return new Date(Date.parse(date) + (3600000 * Number))
            case 'd': return new Date(Date.parse(date) + (86400000 * Number))
            case 'w': return new Date(Date.parse(date) + ((86400000 * 7) * Number))
            case 'q': return new Date(date.getFullYear(), (date.getMonth()) + Number * 3, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
            case 'm': return new Date(date.getFullYear(), (date.getMonth()) + Number, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
            case 'y': return new Date((date.getFullYear() + Number), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
          }
        },
        // 日期格式化
        format: function (date, format) {
          if (typeof date === 'string') { // 如果是字符串转换为日期型
            date = new Date(date.replace(/-/g, '/'))
          }

          if (!format) { format = 'yyyy-MM-dd HH:mm:ss' }
          let obj =
            {
              'M+': date.getMonth() + 1, // 返回实际月份
              'd+': date.getDate(), // 返回当月第几天
              'H+': date.getHours(), // 返回小时
              'm+': date.getMinutes(), // 返回分钟
              's+': date.getSeconds(), // 返回秒
              'q+': Math.floor((date.getMonth() + 3) / 3), // 返回第几个季度
              'S': date.getMilliseconds(), // 返回毫秒
              'w': date.getDay(), // 返回星期几，0为星期日
              'W': '日一二三四五六'.charAt(date.getDay()) // 返回星期几的中文表示
            }

          // 年的单独处理
          if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
          // 其他格式处理
          for (let k in obj) {
            if (new RegExp('(' + k + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? obj[k] : ('00' + obj[k]).substr(('' + obj[k]).length)) }
          }
          return format
        },
        diff: function (date, strInterval, dtEnd) {
          if (typeof dtEnd === 'string') { // 如果是字符串转换为日期型
            dtEnd = new Date(dtEnd.replace(/-/g, '/')) // StringToDate(dtEnd);
          }
          if (typeof date === 'string') { // 如果是字符串转换为日期型
            date = new Date(date.replace(/-/g, '/')) // StringToDate(dtEnd);
          }
          switch (strInterval) {
            case 's': return parseInt((dtEnd - date) / 1000)// 秒
            case 'n': return parseInt((dtEnd - date) / 60000)// 分钟
            case 'h': return parseInt((dtEnd - date) / 3600000)// 小时
            case 'd': return parseInt((dtEnd - date) / 86400000)// 天
            case 'w': return parseInt((dtEnd - date) / (86400000 * 7))// 周
            case 'm': return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - date.getFullYear()) * 12) - (date.getMonth() + 1)// 月
            case 'y': return dtEnd.getFullYear() - date.getFullYear()// 年
          }
        },
        // 输出当月的开始日期和结束日期
        curMonthDate: function () {
          // 获取当前月的第一天
          let start = new Date()
          start.setDate(1)

          // 获取当前月的最后一天
          let date = new Date()
          let currentMonth = date.getMonth()
          let nextMonth = ++currentMonth
          let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
          let oneDay = 1000 * 60 * 60 * 24
          let end = new Date(nextMonthFirstDay - oneDay)

          let arrdate = []
          arrdate.push(start)
          arrdate.push(end)
          return arrdate
        },
        // 输出当前周的开始日期和结束日期
        curWeekDate: function () {
          let date = new Date()
          let today = date.getDay()
          let stepSunDay = -today + 1
          if (today === 0) {
            stepSunDay = -7
          }
          let stepMonday = 7 - today
          let time = date.getTime()
          let monday = new Date(time + stepSunDay * 24 * 3600 * 1000)
          let sunday = new Date(time + stepMonday * 24 * 3600 * 1000)
          let arrdate = []
          arrdate.push(monday)
          arrdate.push(sunday)
          return arrdate
        }
      }
      this.clashStartDate = this.dateFun.format(new Date(), 'yyyy-MM-dd')
      this.clashEndDate = this.dateFun.format(this.dateFun.curWeekDate()[1], 'yyyy-MM-dd')
      this.clashNextStartDate = this.dateFun.format(this.dateFun.add(this.clashEndDate, 'd', 1), 'yyyy-MM-dd')
      this.clashNextEndDate = this.dateFun.format(this.dateFun.add(this.clashEndDate, 'd', 7), 'yyyy-MM-dd')
      this.clsshEndMonthDate = this.dateFun.format(this.dateFun.curMonthDate()[1], 'yyyy-MM-dd')
    },
    mounted: function () {
      this.getClassTable()
    },
    methods: {
      async getClassTable () {
        let that = this
        this.xy.loading()
        this.isInitial = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/TemporaryHoliday/GetPage`, {
          type: 1,
          pageIndex: that.pageCurrent,
          pageSize: that.pageSize
        })
        if (res.success) {
          res.data.data.map(item => {
            if (item.HolidayDate !== '0001-01-01T00:00:00') {
              item.HolidayDate = this.dateFun.format(new Date(item.HolidayDate), 'yyyy/MM/dd')
            } else {
              item.HolidayDate = '--'
            }
            if (item.BackupDate !== '0001-01-01T00:00:00') {
              item.BackupDate = this.dateFun.format(new Date(item.BackupDate), 'yyyy/MM/dd')
            } else {
              item.BackupDate = '--'
            }
            return item
          })
          that.datatable = res.data.data || []
          that.total = res.data.totalRecords
          that.isInitial = false
        }
        this.xy.unloading()
      },

      // 单击页码触发
      changePage: function (current) {
        this.pageCurrent = current
        this.getClassTable()
      },
      // 单击切换每页展示条数触发
      changePageSize: function (size) {
        this.pageSize = size
        this.pageCurrent = 1
        this.getClassTable()
      },
      // 创建
      creatHoliday: function () {
        this.$store.commit('common/getThreeMenuName', '创建补课')
        this.$router.push({ path: '/xyHome/creatMakeUpLesson', query: this.$store.state.common.menuInfo })
      },
      //
      look: function (row) {
        this.$store.commit('common/getThreeMenuName', '查看补课')
        this.$store.commit('common/getParam', { holidayBaseID: row.HolidayBaseID })
        this.$router.push({ path: '/xyHome/lookMakeUpLesson', query: this.$store.state.common.menuInfo })
      },
      // 冲突校验
      openModalStartClash: function () {
        this.isCheck = false
        this.isComplete = false
        this.enableInfo = []
        this.modalStartClash = true
      },
      selectClashDate: function (val) {
        this.isClashDateTye = val
      },
      startClash: function () {
        if (this.isClashDateTye === '') {
          this.xy.msgError('请选择要检验的日期。')
          return false
        };
        let start = ''
        let end = ''
        if (this.isClashDateTye === 1) {
          start = this.clashStartDate
          end = this.clashEndDate
        };
        if (this.isClashDateTye === 2) {
          start = this.clashNextStartDate
          end = this.clashNextEndDate
        };
        if (this.isClashDateTye === 3) {
          start = this.clashStartDate
          end = this.clsshEndMonthDate
        };
        if (this.isClashDateTye === 4) {
          start = this.pickerStartDate
          end = this.pickerEndDate
        };
        this.totalDay = (this.dateFun.diff(new Date(start), 'd', (new Date(end)))) + 1
        for (let i = 0; i < this.totalDay; i++) {
          this.enableInfo.push({
            curDate: this.dateFun.format(this.dateFun.add(new Date(start), 'd', i), 'yyyy-MM-dd'),
            status: 0,
            errorMsg: ''
          })
        };
        this.isCheck = true
        this.postGenerateTimeTable(0)
      },
      // 分步校验
      async postGenerateTimeTable (j) {
        let that = this
        if (j < that.enableInfo.length) {
          that.curDay = j
        }
        that.percentVal = 0
        that.enableInfo[j].status = 1
        that.percentFun()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/StartClash`, {
          startDate: that.enableInfo[j].curDate,
          endDate: that.enableInfo[j].curDate
        }, true)

        if (res.success) {
          that.enableInfo[j].status = 2
          that.percentVal = 100
          if (that.curDay + 1 < that.enableInfo.length) {
            that.curDay++
            that.postGenerateTimeTable(that.curDay)
          } else {
            that.isComplete = true
          }
        } else {
          that.percentVal = 100
          that.enableInfo[j].errorMsg = res.data
          that.enableInfo[j].status = 3
          if (that.curDay + 1 < that.enableInfo.length) {
            that.curDay++
            that.postGenerateTimeTable(that.curDay)
          } else {
            that.isComplete = true
          }
        };
      },
      // 下载错误信息
      exprot: function (item) {
        let msg = ''
        for (let i = 0; i < item.errorMsg.length; i++) {
          msg = msg + item.errorMsg[i] + '。'
        }
        this.download('错误信息.txt', msg)
      },
      // 进度条
      percentFun: function () {
        let that = this
        if (this.percentVal < 90) {
          this.percentVal += 1
          setTimeout(function () {
            that.percentFun()
          }, 200)
        }
      },
      download: function (fileName, content) {
        if (window.navigator.msSaveOrOpenBlob) {
          // if browser is IE
          let blob = new Blob([decodeURIComponent(encodeURI(content))], {
            type: 'text/csv;charset=utf-8;'
          })
          navigator.msSaveBlob(blob, fileName)
        } else {
          let urlObject = window.URL || window.webkitURL || window
          // eslint-disable-next-line camelcase
          let export_blob = new Blob([content], { type: 'text/plain' })
          // eslint-disable-next-line camelcase
          let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
          save_link.href = urlObject.createObjectURL(export_blob)
          save_link.download = fileName
          fakeClick(save_link)
        }
        function fakeClick (obj) {
          let ev = document.createEvent('MouseEvents')
          ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          obj.dispatchEvent(ev)
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.temporary-holiday-header {
  margin-bottom: 10px;
}
.temporary-holiday-body {
  min-height: 650px;
  .temporary-holiday-ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .temporary-holiday-li {
      width: 350px;
      height: 233px;
      background: rgba(255, 255, 255, 1);
      padding: 16px 30px;
      margin: 10px 20px 10px 0;
      border: 1px solid rgba(233, 233, 233, 1);
      cursor: pointer;
      &:hover {
        border: 1px solid rgba(65, 150, 255, 1);
        box-shadow: 0px 2px 6px 0px rgba(199, 199, 199, 0.5);
      }
      .top {
        display: flex;
        img {
          width: 48px;
          height: 48px;
        }
        .content {
          margin-left: 10px;
          h5 {
            font-weight: bold;
          }
          h5,
          p {
            font-size: 14px;
            color: rgba(0, 0, 0, 1);
            opacity: 0.85;
            .tit {
              // display: inline-block;
              opacity: 0.85 !important;
              // min-width: 70px;
            }
            span {
              opacity: 0.65;
            }
          }
        }
      }
      .bottom {
        border-top: 1px solid rgba(233, 233, 233, 1);
        padding: 5px;
        margin-top: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        opacity: 0.65;
      }
    }
  }
}

/*冲突校验*/
.box-topblock-week {
  width: 346px;
  height: 38px;
  line-height: 38px;
  background: rgba(244, 245, 247, 1);
  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 4px;
  padding-left: 10px;
  margin-bottom: 15px;
  position: relative;
  cursor: pointer;
}
.topblock-week-active {
  background: rgba(241, 248, 255, 1) !important;
  border-color: rgba(65, 150, 255, 1) !important;
  color: #4196ff;
}
.topblock-time {
  display: inline-block;
  margin-left: 20px;
  color: rgba(0, 0, 0, 1);
  opacity: 0.65;
}
.topblock-week-active .topblock-tit,
.topblock-week-active .topblock-time {
  color: #4196ff !important;
}
.box-topblock-week .topblock-tit {
  font-size: 16px;
  color: #333333;
  margin-bottom: 8px;
  text-align: center;
}
.box-topblock-week .i-table {
  font-size: 48px;
  position: absolute;
  left: 0px;
  bottom: -10px;
  opacity: 0.7;
}
.box-topblock-week .ivu-icon-md-checkmark {
  font-size: 22px;
  position: absolute;
  right: 7px;
  top: 7px;
  color: #4196ff;
  opacity: 1;
}
.box-topblock-week .topblock-time {
  font-size: 14px;
  font-weight: 400;
  color: #333;
  text-align: center;
}
/*校验数据样式*/
.generate-course-results {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #fff7dd;
  border-radius: 4px;
}
.generate-course-results > .fa {
  color: #df4444;
  line-height: 30px;
  margin-left: 10px;
}
.generate-course-results > .results-notice {
  color: #df4444;
  margin-left: 10px;
}
.check-list {
  width: 100%;
  min-height: 220px;
}
.check-list li {
  padding: 5px 0;
}
.check-list .generate-text {
  font-size: 14px;
}
.check-list .ivu-icon {
  font-size: 32px;
}
.check-list .ivu-icon-ios-checkmark-circle {
  color: #19be6b;
}
.check-list .ivu-icon-ios-close-circle {
  color: #ed4014;
}
.check-list .fa-spin {
  color: #5cadff;
}
.startCheck {
  max-height: 500px;
  overflow-y: scroll;
}
.icon-holiday {
  font-size: 24px;
  color: #fff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  text-align: center;
  line-height: 48px;
}
/*end*/
</style>
