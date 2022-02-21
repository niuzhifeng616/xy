<!-- 每周课表 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
        <!-- <span class="tishi">学年：</span>
        <Select v-model="year"
                  @on-change="yearChange"
                  class="xy-content-title-search"
                  placeholder="请选择学年"
                  style="width:150px">
            <Option v-for="item in yearData"
                      :value="item.ID"
                      :key="item.ID" >{{ item.Name }}</Option>
        </Select>
        <span class="tishi">学期：</span>
        <Select v-model="session"
                  @on-change="sessionChange"
                  class="xy-content-title-search"
                  placeholder="请选择学期"
                  style="width:150px">
            <Option v-for="item in sessionData"
                      :value="item.AcademicSessionID"
                      :key="item.AcademicSessionID" >{{ item.AcademicSessionName }}</Option>
        </Select> -->
        <span class="tishi">校区：</span>
        <Select v-model="school"
                  @on-change="schoolChange"
                  class="xy-content-title-search"
                  placeholder="选择校区"
                  style="width:150px">
            <Option v-for="item in schoolData" :key="item.SchoolDistrictID" :value="item.SchoolDistrictID" >{{item.SchoolDistrictName}}</Option>
        </Select>
        <span class="tishi">学年/学期：：</span>
        <cascader :data="yearSessionData"
                  style="width:150px;display: inline-block;"
                  v-model="yearSession"
                  class="xy-content-title-search"
                  @on-change="cascaderChange"
                  placeholder="请选择学年/学期">
        </cascader>
        <span class="tishi">学习阶段：</span>
        <Select v-model="grade"
                  @on-change="gradeChange"
                  class="xy-content-title-search"
                  placeholder="选择学习阶段"
                  style="width:150px">
            <Option v-for="item in gradeData" :value="item.StudentGradeID" :key="item.StudentGradeID" >{{item.StudentGradeName}}</Option>
        </Select>
    </div>

    <div class="xy-content-body">
        <!-- 周次 -->
        <div v-if="weekData.length > 0">
          <ul class="plan-list">
            <li v-for="(item,index) in weekData" :key="index" @click="dateSelect(item)" :class="item.IsCurrent?'is-checked':''">
              <i class="iconfont icon-holiday" style=" background:#FFBF00">&#xe703;</i>
              <div class="info">
                <p class="f16 class-table-name" :title="item.ClassTableName" :data-date="item.Date" v-if="item.Week=='本周'">本周</p>
                <p class="f16 class-table-name" :title="item.ClassTableName" :data-date="item.Date" v-else>{{item.Week}}周</p>
                <div>{{xy.moment(new Date(item.Date)).format('YYYY/MM/DD')}} - {{xy.moment(new Date(item.Date)).subtract('days', -6).format('YYYY/MM/DD')}}</div>

                <div :class="item.IsCurrent?'active-bg sanjiao':'sanjiao'"><i class="iconfont">&#xe6a1;</i></div>
              </div>
            </li>
          </ul>
          <div class="fix-btn">
            <Button class="xy-btn-primary" shape="circle" @click="submit">确定</Button>
          </div>
        </div>
        <div v-else class="no-data-box">
          <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" />
          <span class="no-data-text">
            该搜索条件下没有结果。
          </span>
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        year: null,
        yearData: [],
        yearSessionData: [],
        yearSession: [],
        session: null,
        sessionData: [],
        week: null,
        weekID: null,
        weekData: [],
        school: null,
        schoolData: [],
        grade: null,
        gradeID: null,
        gradeData: [],
        tableData: [],
        checkTable: [],
        isCurrentWeek: {
          currentNum: null,
          weekStartDate: null,
          weekEndDate: null
        },
        btnList: [],
        weekDataList: [],
        weekList: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
      }
    },
    created () {
      this.$store.commit('common/getThreeMenuName', '')
      this.getYear()
      this.getSchool()
      this.getSessionNodeList()
    },
    methods: {
      // 选中排课方案
      classCheck (val) {
        val.isCheck = !val.isCheck
        if (this.checkTable.length === 0) {
          this.checkTable.push(val)
        } else {
          let index = this.checkTable.map((item) => { return item.ClassTableID }).indexOf(val.ClassTableID)
          if (index === -1) {
            this.checkTable.push(val)
          } else {
            this.checkTable.splice(index, 1)
          }
        }
      },
      // 学年
      yearChange (val) {
        this.getSession(val)
      },
      // 学期
      sessionChange (val) {
        this.getWeek()
      },

      // 校区
      schoolChange (val) {
        this.gradeID = null
        this.getGradeList(val || 0)
      },
      // 学习阶段
      gradeChange (val) {
        if (val !== undefined) {
          this.gradeID = val
        }
      },
      // 学年学期
      async getSessionNodeList () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`, null, true)
        if (res.success) {
          this.yearSessionData = res.data
          this.yearSession = []
          let index = this.yearSessionData.map(function (item) {
            return item.IsCurrent
          }).indexOf(true)
          if (index !== -1) {
            this.yearSession.push(this.yearSessionData[index].value)
            let index1 = this.yearSessionData[index].children.map(function (item) {
              return item.IsCurrent
            }).indexOf(true)
            if (index1 !== -1) {
              this.yearSession.push(this.yearSessionData[index].children[index1].value)
            }
          } else {
            for (let i = 0; i < this.yearSessionData.length; i++) {
              if (this.yearSessionData[i].children.length > 0) {
                this.yearSession = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                return false
              }
            }
          }
          this.getWeek()
        } else {
          this.xy.msgError(res.msg)
        }
        this.xy.unloading()
      },
      cascaderChange (value, selectedData) {
        this.yearSession = value
        this.getWeek()
      },
      // 获取学年
      async getYear () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/YearList`)
        this.xy.unloading()
        if (res.success) {
          this.yearData = res.data
          if (res.data.length > 0) {
            let arr = res.data.filter((item) => { return item.IsCurrent === true })
            if (arr.length > 0) {
              this.year = arr[arr.length - 1].ID
              this.getSession(this.year)
            } else {
              this.year = ''
              this.getSession(0)
            }
          }
        }
      },

      // 获取学期
      async getSession (id) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SessionList`, {
          yearID: id
        })
        this.xy.unloading()
        if (res.success) {
          this.sessionData = []
          this.sessionData = res.data
          if (res.data.length > 0) {
            let arr = res.data.filter(function (item) { return item.IsCurrent === true })
            if (arr.length > 0) {
              this.session = arr[arr.length - 1].AcademicSessionID
            } else {
              this.session = ''
            }
          }
          this.getWeek()
        }
      },

      // 获取周次
      async getWeek () {
        let sessionID = 0
        if (this.yearSession.length > 1) {
          sessionID = this.yearSession[1]
        };
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MyTimeTable/GetWeek`, {
          academicSessionID: sessionID
        })
        this.xy.unloading()
        if (res.success) {
          let reswWeekData = res.data.ListWeek
          this.weekData = []

          if (reswWeekData.length > 1) {
            for (let i = 0; i < reswWeekData.length; i++) {
              let isCurrent = false
              if (reswWeekData[i].Date === this.xy.moment(res.data.WeekStartDate).format('YYYY-MM-DD')) {
                isCurrent = true
              }
              this.weekData.push({
                Week: reswWeekData[i].Week,
                Date: reswWeekData[i].Date,
                IsCurrent: isCurrent
              })
            }
          } else {
            for (let i = 0; i < reswWeekData.length; i++) {
              this.weekData.push({
                Week: reswWeekData[i].Week,
                Date: reswWeekData[i].Date,
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
            let sub = this.weekData.map((item) => { return item.IsCurrent }).indexOf(true)
            if (sub > -1) {
              this.isCurrentWeek.weekStartDate = this.weekData[sub].Date

              this.isCurrentWeek.weekEndDate = this.xy.moment(new Date(this.weekData[sub].Date)).add(6, 'days').format('YYYY-MM-DD')
              this.isCurrentWeek.currentNum = this.weekData[sub].Week

              this.weekDataList = []
              for (let i = 0; i < 7; i++) {
                let date1 = this.xy.moment(new Date(this.weekData[sub].Date)).add(i, 'days').format('MM-DD')
                this.weekDataList.push({
                  date: date1,
                  weekName: this.weekList[i]
                })
              }
            }
          };

          // 都有哪些课表
          this.btnList = []
          this.btnList = res.data.TimeTableInfo
          this.btnList.map((item) => {
            item.isActive = false
            return item
          })
          this.btnList[0].isActive = true
        }
      },

      // 获取校区
      async getSchool () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        this.xy.unloading()
        if (res.success) {
          this.schoolData = res.data
          if (this.schoolData.length > 0) {
            this.school = this.schoolData[0].SchoolDistrictID
            if (this.school) {
              this.getGradeList(this.school)
            }
          }
        }
      },
      // 获取学习阶段
      async getGradeList (schoolID) {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetStudentGradeBySchool`, {
          schoolDististrictID: schoolID
        })
        this.xy.unloading()
        if (res.success) {
          this.gradeData = res.data
          if (this.gradeData.length > 0) {
            this.grade = this.gradeData[0].StudentGradeID
          }
        }
      },

      // 点击周次
      dateSelect (val) {
        let sub = this.weekData.map((item) => { return item.Date }).indexOf(val.Date)
        this.weekData.map((item) => {
          item.IsCurrent = false
          return item
        })

        this.weekData[sub].IsCurrent = true
        this.isCurrentWeek.weekStartDate = val.Date
        this.isCurrentWeek.weekEndDate = this.xy.moment(new Date(val.Date)).add(6, 'days').format('YYYY-MM-DD')
        this.isCurrentWeek.currentNum = this.weekData[sub].Week
        this.weekDataList = []
      },

      // 确定
      submit () {
        if (!this.gradeID) {
          this.xy.msgError('请选择学习阶段。')
          return false
        };
        // let yearInfo = this.yearData.filter(item => item.ID === this.year)
        // let sessionInfo = this.sessionData.filter(item => item.AcademicSessionID === this.session)
        let yearInfo = {}
        let sessionInfo = {}
        for (let i = 0; i < this.yearSessionData.length; i++) {
          if (this.yearSessionData[i].value === this.yearSession[0]) {
            yearInfo = {
              ID: this.yearSession[0],
              Name: this.yearSessionData[i].label
            }
            this.yearSessionData[i].children.map(item => {
              if (item.value === this.yearSession[1]) {
                sessionInfo = {
                  AcademicSessionID: this.yearSession[1],
                  AcademicSessionName: item.label
                }
              }
            })
          }
        }
        let schoolInfo = this.schoolData.filter(item => item.SchoolDistrictID === this.school)
        let gradeInfo = this.gradeData.filter(item => item.StudentGradeID === this.grade)

        let datas = {
          classTable: this.checkTable,
          year: yearInfo,
          session: sessionInfo,
          school: schoolInfo[0],
          grade: gradeInfo[0],
          isCurrentWeek: this.isCurrentWeek,
          pro: 'WeekScheduleConditions'
        }
        let name = `${datas.year.Name}、${datas.session.AcademicSessionName}、${datas.school.SchoolDistrictName}、${datas.grade.StudentGradeName}`
        this.$store.commit('csmstimetable/changeScheduleQuery', datas)
        this.$store.commit('common/getThreeMenuName', name)
        this.$store.commit('common/getParam', datas)
        this.$router.push({
          path: `/xyhome/WeekScheduleHeader`,
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/QueryConditions.less';
</style>
