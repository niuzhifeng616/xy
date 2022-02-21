<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="mb-10">
      <Cascader
        :data="cascader"
        v-model="defaultValue"
        change-on-select
        class="fl"
        @on-change="cascaderChange"
        :clearable="false"
        style="width:300px; margin-right: 44px;"
      ></Cascader>
      <div class="rightButton">
        <radio-group v-model="weekdata" type="button" @on-change="changeWeek">
          <radio label="1">天</radio>
          <radio label="2">周</radio>
          <radio label="3">月</radio>
          <radio label="4">学期</radio>
          <radio label="5">自定义</radio>
        </radio-group>
        <date-picker
          v-if="isDateShow"
          :value="dates"
          format="yyyy/MM/dd"
          type="daterange"
          show-week-numbers
          placeholder="开始时间-结束时间"
          @on-change="dateChange"
          style="width: 220px; margin-left: 22px;"
          :editable="false"
        ></date-picker>
        <Button class="btn-position xy-primary" @click="query" style="margin-left: 23px;">查询</Button>
      </div>
      </div>
    </div>
    <div v-if="cascader.length === 0">
        <div class="no-data-box">
          <img class="no-data-img" src="@/assets/common/nullData.svg" />
          <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
        </div>
    </div>
    <!-- <div v-if="isLoading" style="display:flex; justify-content:center; align-items: center;">
        <img src="@/assets/common/loading.png" alt="">
    </div> -->
    <div>
      <component
          :is="comName"
          :key="changeID"
          :startDate="startDate"
          :endDate="endDate"
          :startDateShowendDate="startDateShowendDate"
          :todayShow="todayShow"
          :startDateShowtoday="startDateShowtoday"
          :showBeforeAndAfter="showBeforeAndAfter"
          :applicationID="applicationID"
          :applicationSubMenuID="applicationSubMenuID"
          :schoolDistrictID="schoolDistrictID"
          :gradeYearID="gradeYearID"
          :classID="classID"
          :studentID="studentID"
          :studentName="studentName"
          :schoolName="schoolName"
          :gradeName="gradeName"
          :className="className"
          :isCustom="isCustom"
          :pageCurrent="pageCurrent"
          :pages="pages"
          :pageIndex="pageIndex"
          :pageSize="pageSize"
          :changeWeekBtn="changeWeekBtn"
        ></component>
    </div>

  </div>
</template>
<script>
  import StatSchool from '@/pages/attendance/views/studentLeave/studentLeaveStat/StatSchool.vue'
  import StatGrade from '@/pages/attendance/views/studentLeave/studentLeaveStat/StatGrade.vue'
  import StatClass from '@/pages/attendance/views/studentLeave/studentLeaveStat/StatClass.vue'
  import StatPeople from '@/pages/attendance/views/studentLeave/studentLeaveStat/StatPeople.vue'
  export default {
    name: 'Stat',
    data () {
      return {
        isLoading: false,
        changeWeekBtn: '',
        changeID: '',
        comName: '',
        defaultValue: [], // 进入时默认展示级联第一级内容
        cascaderData: 0, // 选择的校区/年级/班级
        dates: [], // 页面时间选择绑定数据
        isDateShow: false, // 选择自定义时弹出的时间选择器
        aryData: [],
        cascader: [], // 校区年级班级下拉框数据
        sectionList: [], // 节次数据
        sectionAry: [], // 节次筛选
        options: {
          // 选择自定义时间所需参数
          disabledDate (date) {
            return date && date.valueOf() > Date.now()
          }
        },
        applicationID: '',
        applicationSubMenuID: '',
        // 需要传入子页面监听的值
        todayShow: true, // 今天
        startDateShowtoday: false, // 开始时间至今天
        startDateShowendDate: false, // 开始时间至结束时间
        weekdata: '1', // 天周日学期切换
        showBeforeAndAfter: true, // 控制学期不显示前后筛选
        isCustom: true,
        schoolDistrictID: '', // 所选校区ID
        gradeYearID: '0', // 所选年级ID
        disciplineID: 0, // 所选学科ID
        classID: '0', // 所选班级ID
        startDate: this.xy.moment(new Date()).format('YYYY/MM/DD'), // 开始时间
        endDate: this.xy.moment(new Date()).format('YYYY/MM/DD'),
        schoolName: '', // 校区名字
        gradeName: '', // 年级名字
        disciplineName: '', // 学科名字
        className: '', // 班级名字
        studentName: '', // 学生名字
        studentID: '', // 学生ID
        pageCurrent: 1,
        pages: [15, 30, 50, 100],
        pageIndex: 1,
        pageSize: 15,
        idArr: []
      }
    },
    created () {
      this.getSearchCondition()
    },
    mounted () {},
    watch: {
    },
    components: {
      StatSchool,
      StatGrade,
      StatClass,
      StatPeople
    },
    methods: {
      // 左上角校区年级班级层级数据获取
      getSearchCondition () {
        // this.xy.loading()
        this.isLoading = true
        let that = this
        let idArr = this.$store.state.common.menuId.split(',')
        this.applicationID = idArr[1]
        this.applicationSubMenuID = idArr[2]
        this.xy
          .get(
            `${this.xyApi}/base/xy/comm/GetUserRangeClassPermission`,
            {
              applicationID: that.applicationID,
              ApplicationSubMenuID: that.applicationSubMenuID
            }
          )
          .then(res => {
            if (res.success) {
              // this.xy.unloading()
              this.isLoading = false
              let result = res.data
              that.cascader = result
              if (result.length !== 0) {
                that.defaultValue = [result[0].value]
                that.schoolDistrictID = result[0].value.toString()
                that.schoolName = result[0].label
                that.cascaderData = 1
                that.query()
              }
            }
          })
      },
      // 层级选择绑定校区年级班级ID及名字
      cascaderChange (val, selectedData) {
        this.cascaderData = val.length
        this.schoolDistrictID = val[0].toString()
        if (val[1]) {
          this.gradeYearID = val[1].toString()
        }
        if (val[2]) {
          this.classID = val[2].toString()
        }
        if (selectedData[0] && !selectedData[1]) {
          this.schoolName = selectedData[0].label
        } else if (!selectedData[2]) {
          this.gradeName = selectedData[1].label
        } else {
          this.className = selectedData[2].label
        }
      },
      // 查询按钮
      query () {
        if (this.schoolDistrictID === '' || this.schoolDistrictID === undefined) {
          this.xy.msgError('请选择校区。')
        } else {
          switch (this.cascaderData) {
            case 1:
              this.comName = 'StatSchool'
              break
            case 2:
              this.comName = 'StatGrade'
              break
            case 3:
              this.comName = 'StatClass'
              break
            case 4:
              this.comName = 'StatPeople'
              break
          }
          console.log(this.cascaderData)
          this.changeID = [this.schoolDistrictID, this.gradeYearID, this.classID].join('-')
        }
      },
      // 班级跳转个人
      toPerson () {
        this.comName = 'StatPeople'
      },
      toSchool () {
        this.comName = 'StatSchool'
      },
      toGrade () {
        this.comName = 'StatGrade'
      },
      toClass () {
        this.comName = 'StatClass'
      },
      // 选择天周月学期
      changeWeek (vals) {
        let _this = this
        _this.weekdata = vals
        if (_this.weekdata === '5') {
          _this.isDateShow = true
          _this.todayShow = false
          _this.startDateShowtoday = false
          _this.startDateShowendDate = true
          _this.showBeforeAndAfter = true
          _this.isCustom = false
        } else {
          _this.isDateShow = false
        }
        if (_this.weekdata === '1') {
          _this.changeWeekBtn = '1'
          _this.todayShow = true
          _this.startDateShowtoday = false
          _this.startDateShowendDate = false
          _this.showBeforeAndAfter = true
          _this.isCustom = true
          _this.startDate = _this.xy.moment(new Date()).format('YYYY/MM/DD')
          _this.endDate = _this.xy.moment(new Date()).format('YYYY/MM/DD')
        } else if (_this.weekdata === '2') {
          _this.changeWeekBtn = '2'
          let weekOfday = _this.xy.moment(new Date()).format('E')
          _this.startDate = _this.xy.moment(new Date()).subtract(weekOfday - 1, 'days').format('YYYY/MM/DD')
          _this.endDate = _this.xy.moment(new Date()).add(7 - weekOfday, 'days').format('YYYY/MM/DD')
          _this.startDateShowtoday = true
          _this.todayShow = false
          _this.startDateShowendDate = false
          _this.showBeforeAndAfter = true
          _this.isCustom = true
        } else if (_this.weekdata === '3') {
          _this.changeWeekBtn = '3'
          _this.startDate =
            this.xy
              .moment()
              .add('month', 0)
              .format('YYYY-MM') + '-01'
          _this.endDate = this.xy
            .moment(_this.startDate)
            .add('month', 1)
            .add('days', -1)
            .format('YYYY/MM/DD')
          _this.startDateShowtoday = true
          _this.todayShow = false
          _this.startDateShowendDate = false
          _this.showBeforeAndAfter = true
          _this.isCustom = true
        } else if (_this.weekdata === '4') {
          this.xy.loading()
          this.xy
            .get(`${this.xyApi}/base/api/AcademicSession/GetCurrent`, {})
            .then(res => {
              if (res) {
                _this.xy.unloading()
                _this.showBeforeAndAfter = true
                _this.isCustom = false
                // 学期的开始第一天
                _this.startDate = this.xy
                  .moment(res.data.StartDate)
                  .format('YYYY/MM/DD')
                // 学期的最后一天
                _this.endDate = this.xy
                  .moment(res.data.EndDate)
                  .format('YYYY/MM/DD')
                _this.changeWeekBtn = '4'
                this.xy.unloading()
                _this.todayShow = false
                _this.isCustom = false
              } else {
                _this.showBeforeAndAfter = false
                _this.xy.unloading()
                _this.xy.msgError('当前没有学期数据。')
              }
            })
        }
      },
      // 选择自定义时间
      dateChange (val) {
        if (val[0] !== '' && val[1] !== '') {
          this.startDate = this.xy.moment(val[0]).format('YYYY/MM/DD')
          this.endDate = this.xy.moment(val[1]).format('YYYY/MM/DD')
          switch (this.cascaderData) {
            case 1:
              this.comName = 'StatSchool'
              break
            case 2:
              this.comName = 'StatGrade'
              break
            case 3:
              this.comName = 'StatClass'
              break
            case 4:
              this.comName = 'StatPeople'
              break
          }
          this.changeWeekBtn = Math.random().toString()
        }
      },
      // 前一天/周/月
      beforeDate () {
        if (this.weekdata === '1') {
          this.startDate = this.xy
            .moment(this.startDate)
            .subtract('days', 1)
            .format('YYYY/MM/DD')
          this.endDate = this.xy
            .moment(this.endDate)
            .subtract('days', 1)
            .format('YYYY/MM/DD')
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
          if (this.endDate === this.xy.moment(new Date()).format('YYYY/MM/DD')) {
            this.todayShow = true
            this.startDateShowendDate = false
            this.startDateShowtoday = false
          }
        } else if (this.weekdata === '2') {
          this.endDate = this.xy
            .moment(this.startDate)
            .subtract('days', 1)
            .format('YYYY/MM/DD')
          this.startDate = this.xy
            .moment(this.endDate)
            .subtract('days', 6)
            .format('YYYY/MM/DD')
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
        } else if (this.weekdata === '3') {
          this.endDate = this.xy
            .moment(this.startDate)
            .subtract('days', 1)
            .format('YYYY/MM/DD')
          this.aryData = this.curMonthDate(new Date(this.endDate))
          this.startDate = this.xy.moment(this.aryData[0]).format('YYYY/MM/DD')
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
        }
        this.changeWeekBtn = Math.random().toString()
      },
      // 后一天/周/月
      afterDate () {
        if (this.weekdata === '1') {
          this.startDateShowendDate = true
          this.startDateShowtoday = false
          this.startDate = this.xy
            .moment(this.endDate)
            .add('days', 1)
            .format('YYYY/MM/DD')
          this.endDate = this.xy
            .moment(this.endDate)
            .add('days', 1)
            .format('YYYY/MM/DD')
          this.todayShow = false
          if (this.startDate === this.xy.moment(new Date()).format('YYYY/MM/DD')) {
            this.todayShow = true
            this.startDateShowendDate = false
            this.startDateShowtoday = false
          }
        } else if (this.weekdata === '2') {
          this.startDate = this.xy
            .moment(this.endDate)
            .add('days', 1)
            .format('YYYY/MM/DD')
          this.endDate = this.xy
            .moment(this.startDate)
            .add('days', 6)
            .format('YYYY/MM/DD')
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
          if (this.endDate === this.xy.moment(new Date()).format('YYYY/MM/DD')) {
            this.startDateShowendDate = false
            this.startDateShowtoday = true
          }
        } else if (this.weekdata === '3') {
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
          this.startDate = this.xy
            .moment(this.endDate)
            .add('days', 1)
            .format('YYYY/MM/DD')
          this.aryData = this.curMonthDate(new Date(this.startDate))
          this.endDate = this.xy.moment(this.aryData[1]).format('YYYY/MM/DD')
          if (this.endDate === this.xy.moment(new Date()).format('YYYY/MM/DD')) {
            this.startDateShowendDate = false
            this.startDateShowtoday = true
          }
        }
        this.changeWeekBtn = Math.random().toString()
      },

      // 获取当前周天
      curMonthDate (datetime) {
        // 获取当前月的第一天
        let start = datetime
        start.setDate(1)
        // 获取当前月的最后一天
        let date = datetime
        let currentMonth = date.getMonth()
        let nextMonth = ++currentMonth
        let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
        let oneDay = 1000 * 60 * 60 * 24
        let end = new Date(nextMonthFirstDay - oneDay)
        let arrdate = []
        arrdate.push(start)
        arrdate.push(end)
        return arrdate
      }
    }
  }
</script>
<style lang="less">
@import '../../css/stat.less';
</style>
