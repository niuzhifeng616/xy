<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between xy-center">
        <div class="xy-center xy-flex">
          <span>任教年级：</span>
          <!--校区-->
          <Select v-model="school"
                    @on-change="schoolChange"
                    placeholder="请选择校区"
                    class="xy-content-title-search"
                    style="width:150px">
              <Option v-for="(item,index) in schoolData" :key="index" :value="item.SchoolDistrictID" v-cloak>{{item.SchoolDistrictName}}</Option>
          </Select>
          <!--学届-->
          <Select v-model="session"
                    @on-change="sessionChange"
                    class="xy-content-title-search"
                    placeholder="请选择学届"
                    style="width:150px">
              <Option :value="0" >所有学届</Option>
              <Option v-for="(item,index) in sessionData"
                        :value="item.StudentYearID"
                        :key="index" v-cloak>{{ item.StudentYearName }}</Option>
          </Select>
          <!--学习阶段-->
          <Select v-model="grade"
                    @on-change="gradeChange"
                    class="xy-content-title-search"
                    placeholder="请选择学习阶段"
                    style="width:150px">
              <Option :value="0"  v-if="session==0">所有学习阶段</Option>
              <Option v-for="(item,index) in gradeData"
                        :value="item.StudentGradeForStudentYearID"
                        :key="index" v-cloak>{{item.StudentGradeName}}</Option>
          </Select>
          <Form  label-position="right"  :label-width="100">
            <FormItem label="统计时段:"
                      label-for="time"
                      style="margin-bottom:0">
              <DatePicker element-id='time'
                          v-model="dataList"
                          type="daterange"
                          placement="bottom-end"
                          style="width: 200px;"
                          @on-change="timeChange"></DatePicker >
            </FormItem>
          </Form>
        </div>
        <Button class="xy-primary" @click="screen">查询</Button>
    </div>
    <div class="xy-content-body" style="position:relative;">
        <div id="Schedule" v-if="datatable.length>0">
            <div style="right:300px; position: absolute; top: 21px;color:#333">
              生成报表时间：{{dataTime}}
            </div>
            <div v-if="isStatistics" style="right: 60px; position: absolute; top: 0px;">
                <Tooltip  :max-width="200"
                         placement="top"
                         class="export-btn"
                         style="width:110px;"
                         content="统计上述时段教师替别人代课和别人替自己代课的节数。">
                    <Button class="xy-info" @click="subStat">代课统计</Button>
                    <!--<icon type="md-alert" color="#6489d4" size="20"></icon>-->
                </Tooltip>
            </div>
            <Button v-else class="xy-info" type="text" style="right: 150px; position: absolute; top: 15px;" @click="backStat">返回工作量统计</Button>

            <Button v-if="isStatistics" class="export-btn xy-primary" @click="exportFile">导出</Button>
            <Button v-else class="export-btn xy-primary" @click="backexportFile">导出</Button>
            <Row style="margin-top:40px;" v-if="subjectData.length>0">
                <i-col  span="4">
                    <div class="left-options">
                        <div class="options-body">
                            <div class="search-opt">
                                <Input search placeholder="请输入用户名/工号/姓名" v-model.trim="leftSearchName" clearable />
                            </div>
                            <RadioGroup  v-model="selectSubject" vertical @on-change="subjectChange" style="width:100%">
                                <Radio label="0" class="schedule-subject administrative-subject">全部教师</Radio>
                                <Menu theme="xy-menu-primary" class="menu-con" v-for="(item,index) in subjectData" :key="index" style="width:100%;">
                                    <Submenu name="1">
                                        <template slot="title">
                                            {{item.DisciplineName}}
                                        </template>
                                        <MenuItem>
                                          <template v-for="(subject,index) in item.child">
                                              <Radio class="administrative-radio"
                                                  :label="subject"
                                                  :key="index"
                                                  v-if="subject.TeacherName.indexOf(leftSearchName) >= 0||subject.UserName.indexOf(leftSearchName) >= 0||subject.SchoolCardNumber.indexOf(leftSearchName) >= 0">
                                                  <p v-cloak
                                                  class="nowrap"
                                                  style="width:95%;display:inline"
                                                  :title="subject.TeacherName">{{subject.TeacherName}}</p>
                                              </Radio>
                                          </template>
                                        </MenuItem>
                                    </Submenu>
                                </Menu>
                            </RadioGroup >
                        </div>
                    </div>
                </i-col>
                <i-col  span="20">
                    <!-- 工作量统计 -->
                    <div style="overflow:auto;max-height:600px;height:600px" v-if="isStatistics">
                        <div class="single" v-if="datatable.length>0">
                            <table class="education-table">
                                <thead>
                                    <tr>
                                        <th v-cloak>用户名</th>
                                        <th v-cloak>教师</th>
                                        <th style="width:110px;" v-cloak>上课总节数</th>
                                        <th v-cloak>详情</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(crouse,index) in datatable" :key="index">
                                        <td v-cloak>
                                            {{crouse.UserName}}
                                        </td>
                                        <td v-cloak>
                                            {{crouse.TeacherName}}
                                        </td>
                                        <td v-cloak>
                                            {{crouse.BaseCount}}
                                        </td>
                                        <td v-cloak>
                                            {{crouse.Detil}}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="no-data-box">
                           <img class="no-data-img" :src="require('@/assets/common/nullData.svg')"/>
                            <span class="no-data-text">
                                该搜索条件下没有结果。
                            </span>
                        </div>
                    </div>
                    <!-- 代课统计 -->
                    <div style="overflow:auto;max-height:600px;height:600px" v-if="!isStatistics">
                        <div class="single" v-if="sticstable.length>0">
                            <table class="education-table">
                                <thead>
                                    <tr>
                                        <th v-cloak>用户名</th>
                                        <th v-cloak>姓名</th>
                                        <th v-cloak>代课节数</th>
                                        <th v-cloak>被代节数（负数表示）</th>
                                        <th v-cloak>合计</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(crouse,index) in sticstable" :key="index">
                                        <td v-cloak>
                                            {{crouse.UserName}}
                                        </td>
                                        <td v-cloak>
                                            {{crouse.TeacherName}}
                                        </td>
                                        <td v-cloak @click="substituteCountFun(crouse,true)">
                                            {{crouse.SubstituteCount}}
                                        </td>
                                        <td v-cloak @click="substituteCountFun(crouse,false)">
                                            {{crouse.BSubstituteCount}}
                                        </td>
                                        <td v-cloak>
                                            {{crouse.TotalCout}}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="no-data-box">
                            <img class="no-data-img" :src="require('@/assets/common/nullData.svg')"/>
                            <span class="no-data-text">
                                该搜索条件下没有结果。
                            </span>
                        </div>
                    </div>
                </i-col>
            </Row>
        </div>
        <div v-else class="no-data-box">
            <img class="no-data-img" :src="require('@/assets/common/nullData.svg')"/>
            <span class="no-data-text">
                 该搜索条件下没有结果，请更改其他上课时段。
            </span>
        </div>
        <!-- 代课详情 -->
        <Modal v-model="modalSubstitute"
               :transfer="false"
               width="900"
               title="代课详情"
               :closable="true">
            <div style="overflow:auto;max-height:600px;height:600px;">
                <table class="education-table">
                    <thead>
                        <tr>
                            <th v-cloak>班级</th>
                            <th v-cloak>课程</th>
                            <th v-cloak>上课时间</th>
                            <th v-cloak>原任课教师</th>
                            <th v-cloak>新代课教师</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(sub,index) in substituteData">
                            <tr :key="index" v-if="substituteData.length>0">
                                <td v-cloak>
                                    {{sub.CoursePlanTableFullName}}
                                </td>
                                <td v-cloak>
                                    {{sub.SubjectName}}
                                </td>
                                <td v-cloak>
                                    {{sub.ClassDate}}
                                </td>
                                <td v-cloak>
                                    {{sub.SourceTeacherName}}
                                </td>
                                <td v-cloak>
                                    {{sub.SubstituteTeacherName}}
                                </td>
                            </tr>
                        </template>
                        <tr v-if="substituteData.length==0">
                            <td colspan="5" class="text-center">该搜索条件下没有结果。</td>
                        </tr>
                    </tbody>
                </table>
                <div class="text-right" style="margin-top:10px;margin-right:63px;" v-if="substituteData.length>0">共{{substituteData.length}}节</div>
            </div>
            <div slot="footer">
                <Button type="text" class="xy-modal-close" @click="modalSubstitute = false">关闭</Button>
            </div>
        </Modal>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        school: '',
        schoolID: '',
        schoolData: [],

        session: '',
        sessionID: '',
        sessionData: [],

        grade: '',
        gradeID: '',
        gradeData: [],

        tableData: [],
        checkTable: [],
        dataList: [],
        dataStart: '',
        dataEnd: '',

        btnData: [
          {
            name: '工作量统计',
            type: 'xy-primary',
            url: '/View/csmsTimeTable/PC/View/ScheduleQuery/WorkloadSchedule/Schedule/Total.html'
          }
        ],
        selectSubject: '0',
        selectLevel: 0,
        selecLayer: 0,
        datatable: [],
        dataTime: '', // 生成报表时间
        weekData: [], // 星期数据
        sectionLen: 0, // 节次长度
        festList: [],
        searchName: '',
        sectionData: [], // 节次数据
        subjectData: [], // 课程名称
        classData: [], // 班级名称列表
        classChildData: [], // 班级名称列表
        classTableIDs: '', // 排课方案IDS
        studentGradeForStudentYearID: '', // 学年ID
        disciplineID: '',
        studentOrganizationID: '', // 组织结构ID
        isShwowTeacher: true,
        isShwowHouse: false,
        isShwowTime: false,
        isHorizontal: true, // 排版
        leftSearchName: '', // 搜索
        isStatistics: true,
        sticstable: [],
        // 代课详情
        modalSubstitute: false,
        substituteData: []
      }
    },
    created () {
      this.getSchool()
      this.getTimes()
    },
    mounted: function () {

    },
    methods: {
      // 校区
      schoolChange (val) {
        if (val !== undefined) {
          this.schoolID = val
          this.getSession(this.schoolID)
        }
      },
      // 学届
      sessionChange (val) {
        if (val !== undefined) {
          if (val === 0) {
            this.sessionID = 0
            this.gradeData = []
            this.grade = 0
            this.gradeID = 0
          } else {
            this.sessionID = val
            this.getGradeList(this.sessionID)
          }
        }
      },
      // 学级阶段
      gradeChange (val) {
        if (val !== undefined) {
          if (val === 0) {
            this.gradeID = 0
          } else {
            this.gradeID = val
          }
        }
      },
      // 获取校区
      async getSchool () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi + '/base'}/xy/comm/SchoolDistrictList`)
        this.xy.unloading()
        if (res.success) {
          this.schoolData = res.data
        }
      },
      // 获取学届
      async getSession (id) {
        this.schoolID = id
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi + '/base'}/xy/comm/FilterStudentYearList`, {
          schoolID: this.schoolID
        })
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.sessionData = res.data
            this.grade = ''
            this.gradeID = ''
            this.gradeData = []
          } else {
            this.session = ''
            this.sessionID = ''
            this.sessionData = []
            this.grade = ''
            this.gradeID = ''
            this.gradeData = []
            this.xy.msgError('该校区下无学届。')
          }
        }
      },
      // 获取学习阶段
      async getGradeList (id) {
        this.StudentYearID = id
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi + '/base'}/xy/comm/FilterStudentGradeList`, {
          schoolID: this.schoolID,
          studentYearID: this.StudentYearID
        })
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.gradeData = res.data
          } else {
            this.grade = ''
            this.gradeID = ''
            this.gradeData = []
            this.xy.msgError('该学届下无学习阶段。')
          }
        }
      },
      // 获取时间段
      async getTimes () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StatisticsWorking/GetSloverResultOverallTimes`)
        this.xy.unloading()
        if (res.success) {
          this.dataList = []
          this.dataStart = res.data.start
          this.dataEnd = res.data.end
          this.dataList.push(
            this.xy.moment(new Date(this.dataStart)).format('YYYY-MM-DD'),
            this.xy.moment(new Date(this.dataEnd)).format('YYYY-MM-DD')
          )
        }
      },
      // 选择时间日期
      timeChange (val) {
        val[0] = this.xy.moment(new Date(val[0])).format('YYYY-MM-DD')
        val[1] = this.xy.moment(new Date(val[1])).format('YYYY-MM-DD')
        this.dataList = val
      },
      // 确定查询
      async screen () {
        if (this.dataList[0] === '' || this.dataList[1] === '') {
          this.xy.msgError('请选择统计时段。')
          return false
        };
        if (this.school === '') {
          this.xy.msgError('请选择校区。')
          return false
        };
        if (this.session === '' && this.session !== 0) {
          this.xy.msgError('请选择学届。')
          return false
        };
        if ((this.grade === '' && this.grade !== 0) || this.grade === undefined) {
          this.xy.msgError('请选择学习阶段。')
          return false
        };
        let startDate = this.xy.moment(new Date(this.dataList[0])).format('YYYY-MM-DD')
        let endDate = this.xy.moment(new Date(this.dataList[1])).format('YYYY-MM-DD')
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StatisticsWorking/HasBase?start=${startDate}&end=${endDate}`)
        if (res.success) {
          this.selectSubject = '0'
          this.first()
        }
      },

      // 获取排课方案
      async getClassTables () {
        let schoolID = 0
        let yearID = 0
        let sessionID = 0
        if (this.school !== 0) {
          schoolID = this.school.SchoolDistrictID
        };
        if (this.grade !== '') {
          yearID = this.session.StudentYearID
        };
        if (this.session !== '' && this.session !== undefined) {
          sessionID = this.grade.StudentGradeID
        };
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/ClassTables`, {
          schoolDistrictID: schoolID,
          academicYearID: yearID,
          academicSessionID: sessionID
        })
        this.xy.unloading()
        if (res.success) {
          this.tableData = []
          this.checkTable = []// 清空选中的排课方案
          let resData = res.data
          resData.map((item) => {
            item.isCheck = false
            return item
          })
          this.tableData = resData
        }
      },

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

      // 课表切换
      scheduleChange (val) {
        if (val.type === '') {
          this.btnData.map((item) => {
            item.type = ''
            return item
          })
          val.type = 'xy-primary'
        }
      },
      // 行政班课表--总课表
      async getTeacherWorkingTable () {
        let startDate = this.xy.moment(new Date(this.dataList[0])).format('YYYY-MM-DD')
        let endDate = this.xy.moment(new Date(this.dataList[1])).format('YYYY-MM-DD')
        if (this.selectSubject !== '0') {
          this.disciplineID = this.selectSubject.DisciplineID
          this.studentOrganizationID = this.selectSubject.TeacherID
        } else {
          this.disciplineID = 0
          this.studentOrganizationID = '0'
        }
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StatisticsWorking/GetTeacherWorkingTable`, {
          end: endDate,
          start: startDate,
          searchName: this.searchName,
          disciplineID: this.disciplineID,
          teacherID: this.studentOrganizationID,
          schoolID: this.schoolID,
          studentGradeForStudentYearID: this.gradeID
        })
        this.xy.unloading()
        if (res.success) {
          if (res.data !== '') {
            this.datatable = res.data.Return
            this.dataTime = this.xy.moment(new Date()).format('YYYY-MM-DD HH:mm')
          }
        }
      },

      async first () {
        let startDate = this.xy.moment(new Date(this.dataList[0])).format('YYYY-MM-DD')
        let endDate = this.xy.moment(new Date(this.dataList[1])).format('YYYY-MM-DD')
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StatisticsWorking/GetTeacherTree`, {
          start: startDate,
          end: endDate,
          schoolID: this.schoolID,
          studentGradeForStudentYearID: this.gradeID
        })
        if (res.success) {
          let resData = res.data.Return
          for (let i = 0; i < resData.length; i++) {
            resData[i].child.map(function (item) {
              item.DisciplineID = resData[i].DisciplineID
              return item
            })
          };
          this.subjectData = resData
          if (this.isStatistics) { // 工作量统计
            this.getTeacherWorkingTable()
          } else { // 代课统计
            this.getTeacherSubstituteTable()
          }
        }
      },

      // 获取课程
      async getSloverResultOverallTimesDiscipline () {
        let startDate = this.xy.moment(new Date(this.dataList[0])).format('YYYY-MM-DD')
        let endDate = this.xy.moment(new Date(this.dataList[1])).format('YYYY-MM-DD')
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StatisticsWorking/GetTeacherTree`, {
          start: startDate,
          end: endDate,
          studentGradeForStudentYearID: this.gradeID
        })
        this.xy.unloading()
        if (res.success) {
          this.subjectData = res.data.Return
          this.disciplineID = this.subjectData[0].DisciplineID
          this.classData = []
          this.classChildData = []
          for (let i = 0; i < this.subjectData.length; i++) {
            this.classData.push({
              DisciplineID: this.subjectData[i].DisciplineID,
              DisciplineName: this.subjectData[i].DisciplineName,
              child: []
            })
          };
          for (let j = 0; j < this.subjectData.length; j++) {
            if (this.subjectData[j].DisciplineID === this.selectLevel) {
              for (let m = 0; m < this.subjectData[j].child.length; m++) {
                this.classChildData.push({
                  TeacherID: this.subjectData[j].child[m].TeacherID,
                  TeacherName: this.subjectData[j].child[m].TeacherName
                })
              };
            }
          };
        }
      },

      // 切换学科
      subjectChange () {
        if (this.isStatistics) {
          this.getTeacherWorkingTable()
        } else {
          this.getTeacherSubstituteTable()
        };
      },

      // 导出
      exportFile () {
        let startDate = this.xy.moment(new Date(this.dataList[0])).format('YYYY-MM-DD')
        let endDate = this.xy.moment(new Date(this.dataList[1])).format('YYYY-MM-DD')
        if (this.selectSubject !== '0') {
          this.disciplineID = this.selectSubject.DisciplineID
          this.studentOrganizationID = this.selectSubject.TeacherID
        } else {
          this.disciplineID = 0
          this.studentOrganizationID = '0'
        };
        // 导出
        this.xy.downFile(`${this.$store.state.apiPath}/api/StatisticsWorking/ExportTeacherWorkingTable?start=
        ${startDate}&end=${endDate}&searchName=${this.searchName}
        &disciplineID=${this.disciplineID}&schoolID=${this.schoolID}
        &teacherID=${this.studentOrganizationID}&studentGradeForStudentYearID=${this.gradeID}`)
        this.isContainWeekend = false
      },

      // 代课统计导出
      backexportFile () {
        let startDate = this.xy.moment(new Date(this.dataList[0])).format('YYYY-MM-DD')
        let endDate = this.xy.moment(new Date(this.dataList[1])).format('YYYY-MM-DD')
        if (this.selectSubject !== '0') {
          this.disciplineID = this.selectSubject.DisciplineID
          this.studentOrganizationID = this.selectSubject.TeacherID
        } else {
          this.disciplineID = 0
          this.studentOrganizationID = '0'
        };
        // 导出
        this.xy.downFile(`${this.$store.state.apiPath}/api/StatisticsWorking/ExportTeacherSubstituteTable?start=
        ${startDate}&end=${endDate}&searchName=${this.searchName}
        &disciplineID=${this.disciplineID}&schoolID=${this.schoolID}
        &teacherID=${this.studentOrganizationID}&studentGradeForStudentYearID=${this.gradeID}`)
        this.isContainWeekend = false
      },

      // 代课统计
      subStat () {
        this.isStatistics = false
        this.btnData[0].name = '代课统计'
        this.getTeacherSubstituteTable()
      },

      // 返回工作量统计
      backStat () {
        this.isStatistics = true
        this.btnData[0].name = '工作量统计'
        this.getTeacherWorkingTable()
      },

      // 代课统计
      async getTeacherSubstituteTable () {
        let startDate = this.xy.moment(new Date(this.dataList[0])).format('YYYY-MM-DD')
        let endDate = this.xy.moment(new Date(this.dataList[1])).format('YYYY-MM-DD')
        if (this.selectSubject !== '0') {
          this.disciplineID = this.selectSubject.DisciplineID
          this.studentOrganizationID = this.selectSubject.TeacherID
        } else {
          this.disciplineID = 0
          this.studentOrganizationID = '0'
        }
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StatisticsWorking/GetTeacherSubstituteTable`, {
          end: endDate,
          start: startDate,
          searchName: this.searchName,
          disciplineID: this.disciplineID,
          teacherID: this.studentOrganizationID,
          schoolID: this.schoolID,
          studentGradeForStudentYearID: this.gradeID
        })
        this.xy.unloading()
        if (res.success) {
          if (res.data !== '') {
            this.sticstable = res.data.Return
            this.dataTime = this.xy.moment(new Date()).format('YYYY-MM-DD HH:mm')
          }
        }
      },

      // 代课详情
      substituteCountFun (val, status) {
        if (status) {
          this.substituteData = val.SubstituteInfo
        } else {
          this.substituteData = val.BSubstituteInfo
        }
        this.modalSubstitute = true
      }
    }
  }
</script>
<style lang="less" scoped>
.date-picker {
  .ivu-select-dropdown{
left:0
  }

}
.query-table{
    width:100%;
    height:100%;
    overflow:auto;
    border-spacing: 0;
    text-align: center;
}
.horizontal-version tr:first-child th{
    background:#6392E9;
    color:#ffffff;
    font-weight:bold;
}
.query-table thead tr th {
    background: #ECEEF1;
    border-right: 1px solid #fff;
    color: #91A0B4;
    min-width: 140px;
    max-width: 140px;
    padding: 10px 0;
}
.query-table tbody{
    border: 1px solid #eee;
}
.query-table tbody tr td:nth-child(1){
    border-right: 1px solid #eee;
}
.query-table tbody tr td:last-child{
    border-right: 1px solid #eee;
}
.query-table td, .query-table th {
    border-bottom: 1px solid #eee;
    border-right: 1px solid #eee;
    /*border: 1px solid #eee;*/
    min-width: 140px;
    max-width: 140px;
}
.query-table thead tr th:nth-child(1){
    border-top-left-radius:6px;
}
.query-table thead tr th:last-child{
    border-top-right-radius:6px;
    border-right:0px;
}
.table-subject{
    width:150px;
    height:80px;
    border:1px solid #ddd;
}
.export-btn{
    position:absolute;
    top:15px;
    right:80px;
}
.print-btn {
    position: absolute;
    top: 15px;
    right: 146px;
}
/*初始*/
.schedule-tip{
    color:#8B8B8B;
    font-size:12px;
    height:32px;
    line-height:32px;
}
.plan-list{
    display:flex;
    justify-content:flex-start;
    flex-wrap:wrap;
    min-height:300px;
    cursor:pointer;
}
.plan-list li{
    padding: 20px 15px;
    width:24%;
    height: 105px;
    margin:10px 6px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 3px 8px 0px rgba(196,196,196,0.5);
    border-radius: 4px;
}
.plan-list li.is-checked{
    box-shadow: 0px 3px 8px 0px rgba(54,54,54,0.5);
}
.plan-list li:hover{
   box-shadow: 0px 3px 8px 0px rgba(54,54,54,0.5);
}
.plan-list .class-table-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
}

.plan-list .plan-span{
    margin-top: 17px;
}
.plan-list .plan-span span{
    /*width:49%;
    display:inline-block;*/
    color:#8B8B8B;
}
.schedule-change-list{
    width:100%;
    text-align:center;
}
.schedule-change-list li{
    display:inline-block;
}
.schedule-change-list li .type-name{
    padding: 0 8px 4px 8px;
    cursor:pointer;
}
.schedule-change-list li .underline{
    width:30px;
    height:4px;
    background:rgba(99,146,233,1);
    margin:0 auto;
}
.back-btn{
    position: absolute;
    top: 134px;
    right: 35px;
    z-index: 99;
}
.select-class-list{
    width:80%;
    background:rgba(243,243,243,1);
    border-radius:4px;
    color:#8B8B8B;
}
.ivu-table th {
    border-top: 1px solid #EBEEF5;
    background:#f9f9f9;
}
.filter-conditions{
    margin:15px 0;
}
.crouse-list{
    border:1px solid #ddd;
    margin-right:20px;
}
.attend-cont-tit{
    text-align: left;
    padding: 6px 10px;
    max-width: 200px;
    background: rgba(59, 134, 254, 0.1);
    color: rgb(59, 134, 254);
    border-radius: 0px 3px 3px 0px;
    border-left: 3px solid rgb(59, 134, 254);
    margin-bottom: 5px;
}
.class-name {
    min-width: 140px;
    max-width: 140px;
}
.class-name > span{
    font-size: 14px;
    color: #999;
}
.td-min {
    min-width: 140px;
    max-width: 140px;
    min-height: 58px;
}

.single{
    margin-bottom: 25px;
}

.single > .single-tit{
    margin-top: 10px;
    font-size: 16px;
    font-weight:bold;
    color:#444444;
    margin-bottom:18px;
    display: block;
}
.single > .single-tit > span{
    font-size: 14px;
    color: #999;
}
.single > .row-single-tit{
    margin-top: 10px;
    font-size: 16px;
    margin-bottom: 5px;
    margin-left: 5px;
    display: inline-block;
}

.week-ul{
    display:flex;
    justify-content:flex-start;
    flex-wrap:wrap;
    padding:15px 0;
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
    background:#fff;
    width: 100%;
}

/*内容页*/
#Schedule{
    margin-top:20px;
}
.left-options{
    /*width:250px;*/
    margin-right:15px;
}
.left-options .options-header{
    border-radius:4px;
    padding:0 10px;
}
.left-options .options-header .radio-list {
    padding: 10px 0;
    border-bottom: 1px solid #5685DC;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.left-options .options-header .check-list{
     padding:10px 0;
}

.left-options .options-body {
    margin-top: 15px;
    border-radius: 4px;
    padding: 10px 10px;
    max-height: 600px;
    overflow-y: auto;
}
.left-options .options-body .search-opt {
    border-bottom: 1px solid #5685DC;
    padding-bottom: 15px;
}
.left-options .options-body .schedule-subject:first-child{
    font-size:14px;
    font-weight:bold;
     margin-left:0px;
}
/*总课表*/
.left-options .options-body .total-subject {
    margin-left: 20px;
}
/*教学班学生*/
.education-table{
    width:100%;
    height:100%;
    overflow:auto;
    border-spacing: 0;
}
.education-table tr{
    border-bottom:1px solid #EBEEF5;
}
.education-table tr:hover{
    background:#F5F7FA;
}
.education-table thead tr th {
    color: #909399;
    min-width: 140px;
    text-align: left;
}
.education-table tbody tr td {
    color: #606266;
    min-width: 140px;
}
.education-table td,.education-table th{
    padding: 14px 10px;
}
.row-single-tit {
    font-size: 16px;
    font-weight: bold;
    color: #444444;
    margin-right: 15px;
}

.dis-td-bg {
    background: rgb(198, 198, 198) !important;
    border-left-color: rgb(135, 135, 135) !important;
    color: rgb(135, 135, 135) !important;
}

.container {
    width: 100%;
    max-height: 800px;
    padding: 0;
    box-sizing: border-box;
}

#left-div {
    width: 140px;
    float: left;
}

#left-div1 {
    width: 100%;
}

#left-div2 {
    width: 100%;
    max-height: 600px;
    overflow: hidden;
}

#left-table2 {
    margin-bottom: 8px;
}
#left-table2 td {
    background: #f9f9f9;
}
#right-div {
    float: left;
    width: calc(100% - 140px);
}

#right-div1 {
    width: 100%;
    overflow: hidden;
}

#right-div2 {
    width: 100%;
    max-height: 600px;
    overflow: auto;
}

#right-table1 {
    width: 100%;
}

#right-table2 {
    overflow: auto;
}
#right-table1 tr th:first-child{
    border-top-left-radius:0;
}
.menu-con.ivu-menu-vertical .ivu-menu-item:hover{
  color: #515a6e;
}
.menu-con.ivu-menu-vertical .ivu-menu-item label:hover{
  color: #4196ff;
}
</style>
