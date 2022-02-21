<template>
  <div id="weeklySetting">
    <ul class="weeklyUl">
      <li>
        <!--<form-item  prop="icon">
                <radio v-model="sessionWeek" @on-change="sessionWeekChange">当前学期周</radio>
            </form-item>-->
        <p style="margin-top:-31px;font-size:16px;color:#ea6f5a;padding-bottom:10px">
          提示：请选择按学期周或年份自然周设置周显示样式。
        </p>
        <radio v-model="sessionWeek" @on-change="sessionWeekChange">当前学期周</radio>

        <div class="sample">
          <h3>示例：</h3>
          <p>
            每学期的第一个星期为第1周，假如学期是从9月1日开始，那么9月1日所在的周是第1周。
          </p>
          <ul class="date">
            <li>第1周</li>
            <li>9月1日</li>
            <li>9月2日</li>
            <li>9月3日</li>
            <li>9月4日</li>
            <li>9月5日</li>
            <li>9月6日</li>
            <li>9月7日</li>
          </ul>
          <ul class="date">
            <li>第2周</li>
            <li>9月8日</li>
            <li>9月9日</li>
            <li>9月10日</li>
            <li>9月11日</li>
            <li>9月12日</li>
            <li>9月13日</li>
            <li>9月14日</li>
          </ul>
          <div style="padding:8px 0;text-align:center;border-top:1px solid #ddd;">
            ......
          </div>
          <ul class="date">
            <li>第20周</li>
            <li>1月1日</li>
            <li>1月2日</li>
            <li>1月3日</li>
            <li>1月4日</li>
            <li>1月5日</li>
            <li>1月6日</li>
            <li>1月7日</li>
          </ul>
          <ul class="date">
            <li>第21周</li>
            <li>1月8日</li>
            <li>1月9日</li>
            <li>1月10日</li>
            <li>1月11日</li>
            <li>1月12日</li>
            <li>1月13日</li>
            <li>1月14日</li>
          </ul>
        </div>
      </li>
      <li>
        <radio v-model="yearWeek" label="123" @on-change="yearWeekChange">年份自然周</radio>
        <div class="sample">
          <h3>示例：</h3>
          <p>
            每年的第一个星期为第1周，1月1日所在的周是第1周，12月31日所在的周是最后一周。
          </p>
          <ul class="date">
            <li>第1周</li>
            <li>1月1日</li>
            <li>1月2日</li>
            <li>1月3日</li>
            <li>1月4日</li>
            <li>1月5日</li>
            <li>1月6日</li>
            <li>1月7日</li>
          </ul>
          <ul class="date">
            <li>第2周</li>
            <li>1月8日</li>
            <li>1月9日</li>
            <li>1月10日</li>
            <li>1月11日</li>
            <li>1月12日</li>
            <li>1月13日</li>
            <li>1月14日</li>
          </ul>
          <div style="padding:8px 0;text-align:center;border-top:1px solid #ddd;">
            ......
          </div>
          <ul class="date">
            <li>第53周</li>
            <li>12月18日</li>
            <li>12月19日</li>
            <li>12月20日</li>
            <li>12月21日</li>
            <li>12月22日</li>
            <li>12月23日</li>
            <li>12月24日</li>
          </ul>
          <ul class="date">
            <li>第54周</li>
            <li>12月25日</li>
            <li>12月26日</li>
            <li>12月27日</li>
            <li>12月28日</li>
            <li>12月29日</li>
            <li>12月30日</li>
            <li>12月31日</li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="text-center">
      <Button class="xy-btn-primary" @click="weekSubmit()" shape="circle">保存</Button>
    </div>
  </div>
</template>

<script>
  import { urlSets } from './urlSets.js'
  export default {
    name: 'AMS_Weekly',
    props: {
      AMSGbVal: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        serviceUrl: this.apiAMS,
        sessionWeek: true,
        yearWeek: false
      }
    },
    created: function () {},
    mounted: function () {
      this.loadSetting()
    },
    methods: {
      // 选择学期周
      sessionWeekChange () {
        this.yearWeek = false
      },
      // 选择年份自然周
      yearWeekChange () {
        this.sessionWeek = false
      },
      async weekSubmit () {
        var _this = this

        var timeTableWeekDisplayMethod = {}
        timeTableWeekDisplayMethod.AccountID = this.AMSGbVal.accountID
        timeTableWeekDisplayMethod.TimeTableWeekDisplayMethod = _this.sessionWeek
          ? 1
          : 2
        this.xy.loading()
        try {
          const res = await this.xy.post(
            `${this.serviceUrl}${urlSets.changeTimeTableWeekDisplayMethod}`,
            timeTableWeekDisplayMethod
          )
          if (res.success) {
            this.xy.msgSuc('更新成功。')
          }
        } catch (error) {
          this.xy.mError('更新失败', error)
        }
        this.xy.unloading()
      },
      async loadSetting () {
        this.xy.loading()
        try {
          const result = await this.xy.get(
            `${this.serviceUrl}${urlSets.getTimeTableWeekDisplayMethod}`,
            { accountID: this.AMSGbVal.accountID }
          )
          if (result.success) {
            this.yearWeek = result.data.TimeTableWeekDisplayMethod === 2
            this.sessionWeek = result.data.TimeTableWeekDisplayMethod === 1
          }
        } catch (error) {
          this.xy.mError('读取失败', error)
        }
        this.xy.unloading()
      }
    }
  }
</script>
