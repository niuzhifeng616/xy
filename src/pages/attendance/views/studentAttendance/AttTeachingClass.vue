<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="mb-10">
        <div style="display: inline-block">
          <Cascader
            :data="cascader"
            v-model="defaultValue"
            change-on-select
            @on-change="cascaderChange"
            :clearable="false"
            style="width:400px; margin-right: 44px"
            placeholder="请选择校区/年级/学科/班级"
            loading
            >
          </Cascader>
        </div>
        <div style="display: inline-block">
          <RadioGroup v-model="weekdata" type="button" @on-change="changeWeek">
            <radio label="1">天</radio>
            <radio label="2">周</radio>
            <radio label="3">月</radio>
            <radio label="4">学期</radio>
            <radio label="5">自定义</radio>
          </RadioGroup>
          <date-picker
            v-if="isDateShow"
            format="yyyy/MM/dd"
            :value="dates"
            type="daterange"
            split-panels
            :options="options"
            placeholder="开始时间-结束时间"
            @on-change="dateChange"
            style="width: 200px; margin-left: 22px"
            :editable="false"
            >
          </date-picker>
          <!-- <cascader
            v-model="sectionAry"
            style="width:150px; display:inline-block; margin-left: 22px"
            :data="sectionList"
            @on-change="selectSection"
            not-found-text="请先选择校区"
            placeholder="请选择节次"
          ></cascader> -->
          <div class="buttonPosition">
            <Button type="primary" @click="query">查询</Button>
          </div>
        </div>
      </div>
      <!-- <div v-if="cascader.length === 0" class="no-data-box" v-cloak >
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
      </div> -->
      <component
        :is="comName"
        :key="changeID"
        :changeWeekBtn = "changeWeekBtn"
        :startDate = "startDate"
        :endDate = "endDate"
        :startDateShowendDate = "startDateShowendDate"
        :todayShow = "todayShow"
        :startDateShowtoday = "startDateShowtoday"
        :showBeforeAndAfter = "showBeforeAndAfter"
        :applicationID = "applicationID"
        :applicationSubMenuID = "applicationSubMenuID"
        :schoolDistrictID = "schoolDistrictID"
        :gradeYearID = "gradeYearID"
        :classID = "classID"
        :studentID = "studentID"
        :studentName = "studentName"
        :schoolName = "schoolName"
        :gradeName = "gradeName"
        :className = "className"
        :aMorPM = "aMorPM"
        :aMorPMOrder = "aMorPMOrder"
        :isCustom = "isCustom"
        :disciplineID = "disciplineID"
        :disciplineName = "disciplineName"
        :pageCurrent = "pageCurrent"
        :pages = "pages"
        :pageIndex = "pageIndex"
        :pageSize = "pageSize"
        :cascaderData = "cascaderData"
        >
      </component>
    </div>
  </div>
</template>
<script>
  import AttTeachingClassForSchool from '@/pages/attendance/views/studentAttendance/AttTeachingClassForSchool.vue'
  import AttTeachingClassForGrade from '@/pages/attendance/views/studentAttendance/AttTeachingClassForGrade.vue'
  import AttTeachingClassForDiscipline from '@/pages/attendance/views/studentAttendance/AttTeachingClassForDiscipline.vue'
  import AttTeachingClassForClass from '@/pages/attendance/views/studentAttendance/AttTeachingClassForClass.vue'
  import AttTeachingClassForPerson from '@/pages/attendance/views/studentAttendance/AttTeachingClassForPerson.vue'
  export default {
    name: 'attTeachingClass',
    data () {
      return {
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
        gradeYearID: '', // 所选年级ID
        disciplineID: 0, // 所选学科ID
        classID: '', // 所选班级ID
        startDate: this.xy.moment(new Date()).format('YYYY/MM/DD'), // 开始时间
        endDate: this.xy.moment(new Date()).format('YYYY/MM/DD'),
        aMorPM: '', // 节次早或者晚
        aMorPMOrder: -1, // 节次信息
        schoolName: '', // 校区名字
        gradeName: '', // 年级名字
        disciplineName: '', // 学科名字
        className: '', // 班级名字
        studentName: '', // 学生名字
        studentID: '', // 学生ID
        pageCurrent: 1,
        pages: [15, 30, 50, 100],
        pageIndex: 1,
        pageSize: 15
      }
    },
    created () {

    },
    mounted () {
    },
    components: {
      AttTeachingClassForSchool,
      AttTeachingClassForGrade,
      AttTeachingClassForDiscipline,
      AttTeachingClassForClass,
      AttTeachingClassForPerson
    },
    computed: {
      idArr () {
        return this.$store.state.common.menuId
      }
    },
    watch: {
      idArr: {
        handler (newVal) {
          let idArr = newVal.split(',')
          this.applicationID = idArr[1]
          this.applicationSubMenuID = idArr[2]
          this.getSearchCondition()
        },
        immediate: true
      }
    },
    methods: {
      // 左上角校区年级班级层级数据获取
      getSearchCondition () {
        // this.xy.loading()
        this.xy.get(
          `${this.$store.state.apiPath}/xy/comm/GetUserRangeDisciplineAndClassPermission`, {
            applicationID: this.applicationID,
            ApplicationSubMenuID: this.applicationSubMenuID,
            IsContainsLogin: true
          }
        ).then(res => {
          if (res.success) {
            // this.xy.unloading()
            let result = res.data
            if (result.length > 0) {
              this.cascader = result
              this.defaultValue = [result[0].value]
              this.schoolDistrictID = result[0].value
              this.schoolName = result[0].label
              this.cascaderData = 1
              this.query()
            }
          }
        }
        )
      },
      // 层级选择绑定校区年级班级ID及名字
      cascaderChange (val, selectedData) {
        this.cascaderData = val.length
        this.schoolDistrictID = val[0]
        this.gradeYearID = val[1]
        this.disciplineID = Number(val[2])
        if (val[3] && val[3] !== 0) {
          this.classID = val[3]
        } else if (val[3] === 0) {
          this.classID = ''
        }
        if (selectedData[0] && !selectedData[1]) {
          this.schoolName = selectedData[0].label
        } else if (selectedData[1] && !selectedData[2]) {
          this.gradeName = selectedData[1].label
        } else if (selectedData[2] && !selectedData[3]) {
          this.disciplineName = selectedData[2].label
        } else {
          this.className = selectedData[3].label.substr(7, 2)
        }
      },
      // 获取节次
      getSection () {
        // api/AttStatistics/GetClassTableSession?SchoolDistrictID={SchoolDistrictID}&StudentGradeForStudentYearID={StudentGradeForStudentYearID}&StudentorganizationID={StudentorganizationID}
        // this.xy.loading()
        this.xy.get(
          `${this.$store.state.apiPath}/xy/comm/GetAllClassTableStructure`,
          {
            SchoolDistrictID: this.schoolDistrictID || 0
          }
        ).then(res => {
          if (res.success) {
            // this.xy.unloading()
            this.sectionList = [
              {
                value: '所有节次',
                label: '所有节次',
                aMorPM: '',
                aMorPMOrder: '-1'
              }
            ]
            for (let i in res.data) {
              this.sectionList.push({
                value: res.data[i].Name,
                label: res.data[i].Name,
                aMorPM: res.data[i].AMorPM,
                aMorPMOrder: res.data[i].Order
              })
            }
            this.sectionAry = ['所有节次']
          }
        })
      },
      // 选择节次绑定节次
      selectSection (value, selectedData) {
        if (selectedData.length === 0) {
          this.aMorPM = ''
          this.aMorPMOrder = -1
        } else {
          this.aMorPM = selectedData[0].aMorPM
          this.aMorPMOrder = Number(selectedData[0].aMorPMOrder)
        }
        this.changeWeekBtn = Math.random().toString()
      },
      // 查询按钮
      query () {
        if (this.schoolDistrictID === '' || this.schoolDistrictID === undefined) {
          this.xy.msgError('请选择校区。')
        } else {
          switch (this.cascaderData) {
            case 1:
              this.comName = 'AttTeachingClassForSchool'
              break
            case 2:
              this.comName = 'AttTeachingClassForGrade'
              break
            case 3:
              this.comName = 'AttTeachingClassForDiscipline'
              break
            case 4:
              this.comName = 'AttTeachingClassForClass'
              break
          }
          this.changeID = [this.schoolDistrictID, this.gradeYearID, this.disciplineID, this.classID].join('-')
        }
      },
      // 班级跳转个人
      toPerson () {
        this.comName = 'AttTeachingClassForPerson'
      },
      // 选择天周月学期
      changeWeek (vals) {
        this.weekdata = vals
        if (this.weekdata === '5') {
          this.isDateShow = true
          this.todayShow = false
          this.startDateShowtoday = false
          this.startDateShowendDate = true
          this.showBeforeAndAfter = true
          this.isCustom = false
        } else {
          this.isDateShow = false
        }
        if (this.weekdata === '1') {
          this.startDate = this.xy.moment(new Date()).format('YYYY/MM/DD')
          this.endDate = this.xy.moment(new Date()).format('YYYY/MM/DD')
          this.changeWeekBtn = '1'
          this.todayShow = true
          this.startDateShowtoday = false
          this.startDateShowendDate = false
          this.showBeforeAndAfter = true
          this.isCustom = true
        } else if (this.weekdata === '2') {
          this.startDate = this.xy.moment().subtract(parseInt(this.xy.moment().format('d')) === 0 ? 6 : parseInt(this.xy.moment().format('d')) - 1, 'days').format('YYYY/MM/DD')
          this.endDate = this.xy.moment().add(7 - parseInt(this.xy.moment().format('d')), 'days').format('YYYY/MM/DD')
          let nowDate = this.xy.moment(new Date()).format('YYYY/MM/DD')
          if (this.xy.moment(nowDate).isBefore(this.endDate)) {
            this.endDate = nowDate
          }
          this.changeWeekBtn = '2'
          this.startDateShowtoday = true
          this.todayShow = false
          this.startDateShowendDate = false
          this.showBeforeAndAfter = true
          this.isCustom = true
        } else if (this.weekdata === '3') {
          this.startDate = this.xy.moment().startOf('month').format('YYYY-MM') + '-01'
          this.endDate = this.xy.moment(this.startDate).add('month', 1).add('days', -1).format('YYYY/MM/DD')
          let nowDate = this.xy.moment(new Date()).format('YYYY/MM/DD')
          if (this.xy.moment(nowDate).isBefore(this.endDate)) {
            this.endDate = nowDate
          }
          this.changeWeekBtn = '3'
          this.startDateShowtoday = true
          this.todayShow = false
          this.startDateShowendDate = false
          this.showBeforeAndAfter = true
          this.isCustom = true
        } else if (this.weekdata === '4') {
          // this.xy.loading()
          this.xy.get(
            `${this.$store.state.apiPath}/api/AcademicSession/GetCurrent`, {}).then(res => {
            if (res) {
              // // this.xy.unloading()
              // this.showBeforeAndAfter = true
              // this.startDateShowtoday = false
              // this.startDateShowendDate = true
              // this.isCustom = false
              // // 学期的开始第一天
              // this.startDate = this.xy.moment(res.data.StartDate).format('YYYY/MM/DD')
              // // 学期的最后一天
              // this.endDate = this.xy.moment(res.data.EndDate).format('YYYY/MM/DD')
              // this.changeWeekBtn = '4'
              // // this.xy.unloading()
              // this.todayShow = false
              this.showBeforeAndAfter = true
              this.isCustom = false
              // 学期的开始第一天
              this.startDate = this.xy
                .moment(res.data.StartDate)
                .format('YYYY/MM/DD')
              // 学期的最后一天
              this.endDate = this.xy
                .moment(res.data.EndDate)
                .format('YYYY/MM/DD')
              let todayDate = new Date()
              this.startDateShowtoday = false
              let showTodayDate = this.xy.moment(todayDate).isBefore(this.endDate)
              if (showTodayDate) {
                this.endDate = this.xy
                  .moment(new Date())
                  .format('YYYY/MM/DD')
                this.startDateShowtoday = true
                this.startDateShowendDate = false
              }
              this.changeWeekBtn = '4'
              // this.xy.unloading()
              // this.startDateShowtoday = false
              this.todayShow = false
            } else {
              this.showBeforeAndAfter = false
              // this.xy.unloading()
              this.xy.msgError('当前没有学期信息。')
            }
          })
        }
      },
      // 选择自定义时间
      dateChange (val) {
        if (val[0] !== '' && val[1] !== '') {
          this.startDate = this.xy.moment(val[0]).format('YYYY/MM/DD')
          this.endDate = this.xy.moment(val[1]).format('YYYY/MM/DD')
          this.changeWeekBtn = Math.random().toString()
        }
      },
      // 前一天/周/月
      beforeDate () {
        if (this.weekdata === '1') {
          this.startDate = this.xy.moment(this.startDate).subtract('days', 1).format('YYYY/MM/DD')
          this.endDate = this.xy.moment(this.endDate).subtract('days', 1).format('YYYY/MM/DD')
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
          if (
            this.endDate ===
            this.xy.moment(new Date()).format('YYYY/MM/DD')
          ) {
            this.todayShow = true
            this.startDateShowendDate = false
            this.startDateShowtoday = false
          }
        } else if (this.weekdata === '2') {
          this.endDate = this.xy.moment(this.startDate).subtract('days', 1).format('YYYY/MM/DD')
          this.startDate = this.xy.moment(this.endDate).subtract('days', 6).format('YYYY/MM/DD')
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
        } else if (this.weekdata === '3') {
          this.endDate = this.xy.moment(this.startDate).subtract('days', 1).format('YYYY/MM/DD')
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
        if (
          this.endDate ===
          this.xy.moment(new Date()).format('YYYY/MM/DD')
        ) {
          return
        }
        if (this.weekdata === '1') {
          if (this.todayShow === true) {
            return
          } else {
            this.startDateShowendDate = true
            this.startDateShowtoday = false
            this.startDate = this.xy.moment(this.endDate).add('days', 1).format('YYYY/MM/DD')
            this.endDate = this.xy.moment(this.endDate).add('days', 1).format('YYYY/MM/DD')
          }
          if (
            this.startDate ===
            this.xy.moment(new Date()).format('YYYY/MM/DD')
          ) {
            this.todayShow = true
            this.startDateShowendDate = false
            this.startDateShowtoday = false
          }
        } else if (this.weekdata === '2') {
          if (this.startDateShowtoday === true) {
            return
          } else {
            this.startDate = this.xy.moment(this.endDate).add('days', 1).format('YYYY/MM/DD')
            this.endDate = this.xy.moment(this.startDate).add('days', 6).format('YYYY/MM/DD')
            this.startDateShowendDate = true
            this.todayShow = false
          }
          if (new Date().getTime() < new Date(this.endDate).getTime()) {
            this.endDate = this.xy.moment(new Date()).format('YYYY/MM/DD')
          }
          if (
            this.endDate ===
            this.xy.moment(new Date()).format('YYYY/MM/DD')
          ) {
            this.startDateShowendDate = false
            this.startDateShowtoday = true
          }
        } else if (this.weekdata === '3') {
          if (this.startDateShowtoday === true) {
            return
          } else {
            this.startDateShowendDate = true
            this.todayShow = false
            this.startDate = this.xy.moment(this.endDate).add('days', 1).format('YYYY/MM/DD')
            this.aryData = this.curMonthDate(new Date(this.startDate))
            this.endDate = this.xy.moment(this.aryData[1]).format('YYYY/MM/DD')
          }
          if (new Date().getTime() < new Date(this.endDate).getTime()) {
            this.endDate = this.xy.moment(new Date()).format('YYYY/MM/DD')
          }
          if (
            this.endDate ===
            this.xy.moment(new Date()).format('YYYY/MM/DD')
          ) {
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

<style lang='less' scoped>
.buttonPosition {
  margin-left: 23px;
  margin-right: 10px;
  display: inline-block
}
.mb-10 {
  margin-bottom: 10px
}
</style>
