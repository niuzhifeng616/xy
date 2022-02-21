// 基础数据-假期管理
<template>
  <div class="xy-content-module">
      <!-- 面包屑 -->
      <div class="holiday-box">
        <div>
            <div class="clearfix holiday-header">
                <Cascader :data="yearSessionData" :clearable="false" v-model="yearSession" class="fl" @on-change="cascaderChange"></Cascader>
                <div class="fr right-circle">
                    <div class="small-circle" style="background:#FFB581"></div>
                    <div class="day-name">今日</div>
                    <div class="small-circle" style="background:#A4CBFD"></div>
                    <div class="day-name">设定假日</div>
                    <div class="small-circle" style="background:#D6D6D6"></div>
                    <div class="day-name">法定假日</div>
                </div>
            </div>
            <ul class="holiday-week">
                <li v-for="(item,index) in week" :key="index">{{item}}</li>
            </ul>
        </div>
        <template v-if="this.yearSession.length>1">
          <div v-for="(moth,index) in dateData" :key="index">
              <div class="date-time" v-cloak>{{moth.TimeName}}</div>
              <ul class="holiday-date">
                  <li
                    :class="day.ISNowMonth?'picnic':day.HolidayDay==xy.moment(new Date()).format('YYYY-MM-DD')?'is-curDay':''"
                    v-for="(day,index) in moth.Data"
                    :key="index"
                    @click="addHolidayFunc(day)"
                    >
                      <div class="li-num">
                          <span class="span-num" v-cloak>{{day.Day}}</span>
                          <span class="holiday-word" v-if="day.HolidayName!=null">假</span>
                      </div>
                      <div style="height:27px;margin-top:12px">
                          <div class="statutory-holiday nowrap" v-cloak :title="day.HolidayName"
                              v-show="day.HolidayName!=null">{{day.HolidayName}}</div>
                      </div>
                      <div class="holiday-time" v-if="day.HolidayInfo!=null">
                          <div style="width:90%">
                              <h3 class="nowrap" :title="day.HolidayInfo.HolidayName" v-cloak>{{day.HolidayInfo.HolidayName}}</h3>
                              <p v-cloak v-if="day.HolidayInfo.Type ==1">全天</p>
                              <p v-cloak v-if="day.HolidayInfo.Type ==2">上午</p>
                              <p v-cloak v-if="day.HolidayInfo.Type ==3">下午</p>
                          </div>
                          <div style="flex:1;">
                              <Icon type="ios-trash" size="18" class="del-icon" @click.stop="delHoliday(day.HolidayInfo)" />
                          </div>
                      </div>
                  </li>
              </ul>
          </div>
        </template>
        <div v-else class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片" style="width:100%"/>
          <span class="no-data-text">请先选择学期</span>
        </div>
        <!-- 添加假期 -->
        <Modal
          v-model="modalAddHoliday"
          :transfer="false"
          :mask-closable="false"
          >
            <p slot="header">添加假期</p>
            <Form
              :label-colon=true
              @submit.native.prevent
              label-position="top"
              >
                <FormItem label="假期名称" labelFor="text">
                    <i-input type="text" elementId="text" v-model.trim="addHoliday.HolidayName" clearable></i-input>
                </FormItem>
                <FormItem label="开始日期" labelFor="StarDate">
                    <div>
                        <DatePicker
                          type="date"
                          v-model="addHoliday.StarDate"
                          :options="options3"
                          placeholder="请选开始束日期"
                          style="width: 200px;display:inline-block;margin-right:15px;"
                          elementId="StarDate"
                          >
                        </DatePicker>
                        <Select v-model="addHoliday.StarType" style="width:200px">
                            <Option v-for="(item,index) in dayList" :key="index" :value="item.type">{{ item.name }}</Option>
                        </Select>
                    </div>
                </FormItem>
                <FormItem label="结束日期" labelFor="EndDate">
                    <div>
                        <DatePicker
                          type="date"
                          v-model="addHoliday.EndDate"
                          placeholder="请选择结束日期"
                          :options="options3"
                          style="width: 200px;display:inline-block;margin-right:15px;"
                          elementId="EndDate"
                          >
                        </DatePicker>
                        <Select v-model="addHoliday.EndType" style="width:200px">
                            <Option v-for="(item,index) in dayList" :key="index" :value="item.type">{{ item.name }}</Option>
                        </Select>
                    </div>
                </FormItem>
            </Form>
          <div slot="footer">
            <Button class="xy-modal-close" @click="modalAddHoliday = false">取消</Button>
            <Button class="xy-modal-primary"  @click="addHolidaySubmit" shape="circle">确定</Button>
          </div>
        </Modal>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'VacationManage',
    data () {
      return {
        yearSessionData: [],
        yearSession: [0, 0],
        week: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        dateData: [], // 日期
        // 添加假期
        modalAddHoliday: false,
        addHoliday: {
          StarDate: '',
          EndDate: '',
          AcademicSessionID: '',
          HolidayName: '',
          StarType: '2',
          EndType: '2'
        },
        dayList: [
          // {
          //    type: '1',
          //    name: '全天',
          // },
          {
            type: '2',
            name: '上午'
          },
          {
            type: '3',
            name: '下午'
          }
        ],
        disabledStartDate: '',
        disabledEndDate: '',
        options3: {

        }
      }
    },
    created () {
      this.getSessionNodeList()
    },
    mounted () {
    },
    methods: {
      async getSessionNodeList () {
        this.xy.loading()
        let res = await this.xy.get(
          this.$store.state.apiPath + '/xy/comm/GetSessionNodeList', null)
        if (res.success) {
          this.xy.unloading()
          this.yearSessionData = res.data
          this.yearSession = []
          let index = this.yearSessionData.map(item => {
            return item.IsCurrent
          }).indexOf(true)
          if (index !== -1) {
            this.yearSession.push(this.yearSessionData[index].value)
            let index1 = this.yearSessionData[index].children.map(item => { return item.IsCurrent }).indexOf(true)
            if (index1 !== -1) {
              this.yearSession.push(this.yearSessionData[index].children[index1].value)
            }
          } else {
            if (this.yearSessionData.length > 0) {
              this.yearSession.push(this.yearSessionData[0].value)
              if (this.yearSessionData[0].children.length > 0) {
                this.yearSession.push(this.yearSessionData[0].children[0].value)
              } else {
                this.yearSession.push(0)
              }
            }
            // for (let i = 0; i < this.yearSessionData.length; i++) {
            //   if (this.yearSessionData[i].children.length > 0) {
            //     this.yearSession = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
            //     return false
            //   }
            // }
          }
          if (this.yearSession[1] !== undefined) {
            this.getCalendarInfo()
          }
        }
      },
      cascaderChange (value, selectedData) {
        this.yearSession = value
        if (this.yearSession[1] !== undefined) {
          this.getCalendarInfo()
        }
      },
      // 根据学期ID查询日历信息
      async getCalendarInfo () {
        let res = await this.xy.get(
          this.$store.state.apiPath + `/api/Holiday/GetCalendarInfo?sessionid=${this.yearSession[1] !== undefined ? this.yearSession[1] : 0}`, null)
        this.xy.loading()
        if (res) {
          this.xy.unloading()
          this.dateData = res.data.Data
          this.disabledStartDate = res.data.StartDate
          this.disabledEndDate = res.data.EndDate
          let _this = this
          this.options3 = {
            disabledDate: function (date) {
              return (date.valueOf() > new Date(_this.disabledEndDate).getTime()) ||
                (date.valueOf() < new Date(_this.disabledStartDate).getTime())
            }
          }
        }
      },
      // 添加假期
      addHolidayFunc (day) {
        if (!day.ISNowMonth) {
          this.addHoliday.StarType = '2'
          this.addHoliday.EndType = '2'
          if (day.HolidayInfo === null) {
            this.addHoliday.StarDate = day.HolidayDay
            this.addHoliday.EndDate = day.HolidayDay
            if (day.HolidayName !== null) {
              this.addHoliday.HolidayName = day.HolidayName
            } else {
              this.addHoliday.HolidayName = null
            }
          } else {
            this.addHoliday.StarDate = day.HolidayInfo.HolidayDate
            this.addHoliday.EndDate = day.HolidayInfo.HolidayDate
            this.addHoliday.HolidayName = day.HolidayInfo.HolidayName
            if (day.HolidayInfo.Type === 1) {
              this.addHoliday.StarType = '2'
              this.addHoliday.EndType = '3'
            } else {
              this.addHoliday.StarType = String(day.HolidayInfo.Type)
              this.addHoliday.EndType = String(day.HolidayInfo.Type)
            }
          }
          this.modalAddHoliday = true
        }
      },
      addHolidaySubmit () {
        var that = this
        if (this.addHoliday.HolidayName === null || this.addHoliday.HolidayName === '') {
          this.xy.msgError('假期名称不能为空。')
          return false
        }
        if (this.addHoliday.HolidayName.length > 20) {
          this.xy.msgError('假期名称限制20字符。')
          return false
        }
        this.addHoliday.AcademicSessionID = this.yearSession[1]
        this.xy.loading()
        let params = {
          StarDate: this.xy.moment(this.addHoliday.StarDate).format('YYYY-MM-DD'),
          EndDate: this.xy.moment(this.addHoliday.EndDate).format('YYYY-MM-DD'),
          AcademicSessionID: this.yearSession[1],
          HolidayName: this.addHoliday.HolidayName,
          StarType: this.addHoliday.StarType,
          EndType: this.addHoliday.EndType
        }
        this.xy.post(`${that.$store.state.apiPath}/api/Holiday/Creat`, params).then(res => {
          if (res.success) {
            that.xy.unloading()
            that.xy.msgSuc('保存成功。')
            that.modalAddHoliday = false
            that.getCalendarInfo()
          }
        })
      },
      // 删除假期
      delHoliday (day) {
        var that = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除假期"' + day.HolidayName + '"吗？</p>',
          onOk: function () {
            this.xy.loading()
            this.xy.post(`${that.$store.state.apiPath}/api/Holiday/DeleteHoliday?holidayID=${day.HolidayID}`, null).then(res => {
              if (res.success) {
                that.$Modal.remove()
                that.xy.msgSuc('删除成功。')
                that.xy.unloading()
                that.getCalendarInfo()
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.ivu-modal-confirm-head-title {
    margin: 0px;
    display: block;
}
.ivu-modal-confirm-body {
    padding-left: 0px;
    margin: 20px 20px 30px;
}
.holiday-box {
    background: #fff;
    margin-bottom:20px;
}
.holiday-header{
    padding:20px;
}
.right-circle {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    color: #333333;
}
.small-circle {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: inline-block;
}
.day-name{
    margin:0 20px 0 4px;
}
.date-time {
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    color: #767676;
    background: #f9f9f9;
}
.holiday-week {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
    border-top: 1px solid #D2D9E8;
    border-bottom: 1px solid #D2D9E8;
    font-size: 14px;
    color: #333333;
}
.holiday-week li {
    width: 14.28%;
    display: inline-block;
    height: 40px;
    text-align: center;
    line-height: 40px;
}
.holiday-date {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    font-size: 14px;
    color: #333333;
}
.holiday-date li {
    height: 154px;
    width: 14.28%;
    border-top: 1px solid #D2D9E8;
    border-right: 1px solid #D2D9E8;
    padding:10px;
    cursor:pointer;
    position:relative;
}
.holiday-date li:nth-child(7n) {
    border-right: none;
}
.holiday-date li:hover {
    box-shadow:inset 0px 1px 12px 0px rgba(179,186,203,0.52);
}
.li-num{
    display:flex;
    justify-content:space-between;
}
.span-num {
    color: #8E9AB7
}
.holiday-word {
    width: 20px;
    height: 20px;
    line-height: 20px;
    background: rgba(214,214,214,1);
    border-radius: 13px;
    text-align: center;
    color: #747474;
    font-size: 12px;
}
.is-curDay {
    background:#FFDCAA;
}
.is-curDay .span-num {
    color: #fff;
}
.picnic {
    background-image: repeating-linear-gradient(45deg,#E1E1E1,#E1E1E1 1px,#fff 0,#fff 4px);
    /*background: repeating-linear-gradient(45deg,#D2D9E8,#fff 5px);*/
}
.holiday-time {
    text-align: left;
    height: 47px;
    padding: 5px;
    background: #E6F1FF;
    color: #4196FF;
    border-radius: 0px 3px 3px 0px;
    border-left: 3px solid #4196FF;
    margin-top: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.holiday-time h3{
    font-weight:bold;
}
.holiday-time p {
    font-weight: 400;
    font-size:12px;
}
.statutory-holiday {
    border-radius: 5px;
    background: #E4EAF9;
    padding: 3px;
    color: #8E9AB7;
}
.del-icon{
    display:none;
}
.holiday-time:hover .del-icon{
    display:block;
}
</style>
