<template>
  <div class="xy-content-module" ref="Schedule">
    <div class="check-list">
      <Checkbox v-model="isShwowTeacher">
        <span class="" v-cloak>显示教师</span>
      </Checkbox>
      <Checkbox v-model="isShwowHouse">
        <span class="" v-cloak>显示教室</span>
      </Checkbox>
      <Checkbox v-model="isShwowTime">
        <span class="" v-cloak>显示时间</span>
      </Checkbox>
    </div>
    <Button type="primary" class="export-btn xy-primary" @click="modalExport = true">导出</Button>
    <Row>
      <i-col span="4">
        <div class="left-options">
          <div class="options-header">
            <div class="radio-list">
              <Radio v-model="isHorizontal" @on-change="radioChange(1)">横版</Radio>
              <Radio v-model="isVertical" @on-change="radioChange(2)">竖版</Radio>
            </div>
          </div>
          <div class="options-body">
            <Checkbox label="0" v-model="allSubject" class="schedule-subject administrative-subject" @on-change="changeAllTeacher" v-show='subjectData.length>0'>全部学科</Checkbox>
            <CheckboxGroup class="teacher-box" v-model="selectSubject" @on-change="subjectChange(item,index)">
              <template v-for="(subject,cindex) in subjectData">
                <Checkbox class="teacher-lable" :label="subject.DisciplineID" :key="cindex">
                  <p v-cloak class="nowrap" style="width:95%;display:inline" :title="subject.DisciplineName">{{subject.DisciplineName}}</p>
                </Checkbox>
              </template>
            </CheckboxGroup>
          </div>
        </div>
      </i-col>
      <i-col span="20" class="right-table" style="border-left: 1px solid #e8e8e8;">
        <div v-if="datatable.length>0">
          <!-- 横版 -->
          <div class="container clearfix" v-if="isHorizontal">
            <div id="left-div">
              <div id="left-div1">
                <table class="query-table horizontal-version">
                  <thead>
                    <tr>
                      <th style="border-top-right-radius:0">星期</th>
                    </tr>
                    <tr>
                      <th>节次</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div id="left-div2">
                <table id="left-table2" class="query-table horizontal-version">
                  <tbody>
                    <tr v-for="(item,index) in datatable" :key="index" ref="trListLeft">
                      <td>
                        <div v-cloak class="class-name">{{item.FullName}}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div id="right-div">
              <div id="right-div1">
                <table id="right-table1" class="query-table horizontal-version">
                  <thead>
                    <tr>
                      <th v-for="(week,index) in weekData" :key="index" :colspan="sectionLen" v-cloak>{{week.title}}</th>
                    </tr>
                    <tr>
                      <th v-for="(section,index) in sectionData" :key="index" v-cloak>{{section.AMorPMOrderName}}</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div id="right-div2" ref="rightTable">
                <table id="right-table2" class="query-table horizontal-version">
                  <tbody>
                    <tr v-for="(item,index) in datatable" :key="index" ref="trListRight">
                      <td v-cloak v-for="(sectionTd,index) in sectionData" :key="index">
                        <div class="td-min">
                          <template v-for="(crouse,index) in item.SloverResultList">
                            <div v-cloak class="attend-cont-tit" :key="index" :style="{'background': crouse.bg,'borderLeftColor':crouse.color,'color':crouse.color}" v-if="crouse.Day == sectionTd.Day && crouse.AMorPM == sectionTd.AMorPM  && crouse.AMorPMOrder == sectionTd.AMorPMOrder">
                              <p class="nowrap" :title="crouse.SubjectName"><b>{{crouse.SubjectName}}</b></p>
                              <p v-if="isShwowTeacher" class="nowrap" :title="crouse.TeacherName">{{crouse.TeacherName}}</p>
                              <p v-if="isShwowHouse" class="nowrap" :title="crouse.HouseName">{{crouse.HouseName}}</p>
                              <p v-if="isShwowTime && crouse.StartTime != null && crouse.EndTime != null" class="nowrap" :title="crouse.StartTime.substring(0,5)+'-'+crouse.EndTime.substring(0,5)">
                                {{crouse.StartTime.substring(0,5)}}-{{crouse.EndTime.substring(0,5)}}
                              </p>
                            </div>
                          </template>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- 竖版 -->
          <div style="overflow:auto;max-height:600px;">
            <table class="query-table vertical-version" v-if="!isHorizontal">
              <thead>
                <tr>
                  <th style="width:100px">
                    <div class="class-name">星期</div>
                  </th>
                  <th style="width:100px">
                    <div class="class-name">节次</div>
                  </th>
                  <th v-for="(item,index) in datatable" :key="index" v-cloak>
                    <div v-cloak class="class-name">{{item.FullName}}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(section,index) in sectionData" :key="index">
                  <td v-if="section.isNextDay" :rowspan="sectionLen">
                    <div class="class-name" v-cloak> {{weekData[section.Day].title}}</div>
                  </td>
                  <td>
                    <div class="class-name" v-cloak> {{sectionData[index].AMorPMOrderName}}</div>
                  </td>
                  <td v-cloak v-for="(item,index) in datatable" :key="index">
                    <div class="td-min">
                      <template v-for="(crouse,index) in item.SloverResultList">
                        <div v-cloak class="attend-cont-tit" :key="index" :style="{'background': crouse.bg,'borderLeftColor':crouse.color,'color':crouse.color}" v-if="crouse.Day == section.Day && crouse.AMorPM == section.AMorPM  && crouse.AMorPMOrder == section.AMorPMOrder">
                          <p class="nowrap" :title="crouse.SubjectName"><b>{{crouse.SubjectName}}</b></p>
                          <p v-if="isShwowTeacher" class="nowrap" :title="crouse.TeacherName">{{crouse.TeacherName}}</p>
                          <p v-if="isShwowHouse" class="nowrap" :title="crouse.HouseName">{{crouse.HouseName}}</p>
                          <p v-if="isShwowTime && crouse.StartTime != null && crouse.EndTime != null" class="nowrap" :title="crouse.StartTime.substring(0,5)+'-'+crouse.EndTime.substring(0,5)">
                            {{crouse.StartTime.substring(0,5)}}-{{crouse.EndTime.substring(0,5)}}
                          </p>
                        </div>
                      </template>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="no-data-box">
          <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" />
          <span class="no-data-text">
            该搜索条件下没有结果。
          </span>
        </div>
      </i-col>
    </Row>

    <!-- 导出 -->
    <Modal v-model="modalExport" :transfer="false" :mask-closable="false" :closable="false">
      <p slot="header">导出</p>
      <div class="text-center" style="margin:10px 0;">
        <Checkbox v-model="isContainWeekend">
          <span class="f14" v-cloak>导出周六日</span>
        </Checkbox>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="modalExport = false">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="exportFile">导出</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        allSubject: false,
        disciplineIDs: '',
        scheduleHeader: {},
        selectSubject: [],
        datatable: [],
        weekData: [], // 星期数据
        sectionLen: 0, // 节次长度
        sectionData: [], // 节次数据
        subjectData: [], // 课程名称
        classTableIDs: '', // 排课方案IDS
        isShwowTeacher: true,
        isShwowHouse: false,
        isShwowTime: false,
        isHorizontal: true, // 排版
        isVertical: false, // 排版
        weekList: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        // 导出
        modalExport: false,
        isContainWeekend: false // 导出周六日
      }
    },
    created () {
      this.scheduleHeader = this.$store.state.csmstimetable.scheduleQuery
      for (let i = 0; i < this.scheduleHeader.classTable.length; i++) {
        this.classTableIDs = this.classTableIDs + this.scheduleHeader.classTable[i].ClassTableID + ','
      }
      this.getClassTableTimeByClassTableList()
      this.getSloverResultOverallTimesDiscipline()
    },
    updated: function () {
      if (this.datatable.length > 0) {
        for (let i = 0; i < this.$refs.trListRight.length; i++) {
          this.$refs.trListLeft[i].style.height = this.$refs.trListRight[i].offsetHeight + 'px'
        };
        // 滚动
        $('#right-div2').on('scroll', function () {
          let top = $(this).scrollTop()
          let left = $(this).scrollLeft()
          $('#left-div2').scrollTop(top)
          $('#right-div1').scrollLeft(left)
        })
      };
    },
    mounted: function () {
    },
    methods: {
      // 根据排课方案获取作息时间
      async getClassTableTimeByClassTableList () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/GetClassTableTimeByClassTableList`, {
          classTableIDs: this.classTableIDs
        })
        if (res.success) {
          let resData = res.data.times
          this.sectionLen = resData.length
          for (let j = 0; j < 7; j++) {
            this.weekData.push({
              title: this.weekList[j],
              val: j
            })
            for (let k = 0; k < resData.length; k++) {
              let isNextDay = false
              if (k === 0) {
                isNextDay = true
              }
              this.sectionData.push({
                AMorPM: resData[k].AMorPM,
                AMorPMOrder: resData[k].AMorPMOrder,
                AMorPMOrderName: resData[k].AMorPMOrderName,
                Day: j,
                isNextDay: isNextDay
              })
            }
          };
          this.$nextTick(() => {
            $('.right-table').css('minHeight', this.$refs.Schedule.offsetHeight + 'px')
          })
        }
      },
      // 学期课表--总课表
      async getSloverResultOverallTimes (ids) {
        if (this.allSubject) {
          this.disciplineIDs = ''
        } else if (this.selectSubject.length === 0) {
          this.disciplineIDs = 0
        } else {
          this.disciplineIDs = this.selectSubject.join(',')
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/GetSloverResultOverallTimes`, {
          classTableIDs: this.classTableIDs,
          disciplineID: this.disciplineIDs
        })
        if (res.success) {
          this.xy.unloading()
          let resData = res.data
          let array = []
          for (let i = 0; i < resData.length; i++) {
            for (let j = 0; j < resData[i].SloverResultList.length; j++) {
              let index = array.indexOf(`${resData[i].SloverResultList[j].AID}-${resData[i].SloverResultList[j].Type}`)
              if (index > -1) {
                resData[i].SloverResultList[j].color = this.xy.colors(index).color
                resData[i].SloverResultList[j].bg = this.xy.colors(index).bg
              } else {
                resData[i].SloverResultList[j].color = this.xy.colors(array.length).color
                resData[i].SloverResultList[j].bg = this.xy.colors(array.length).bg
                array.push(`${resData[i].SloverResultList[j].AID}-${resData[i].SloverResultList[j].Type}`)
              }
            }
          }
          this.datatable = resData
        }
      },
      changeAllTeacher () {
        if (!this.allSubject) {
          this.selectSubject = []
        } else {
          this.subjectData.map(item => {
            if (this.selectSubject.length === 0 || this.selectSubject.indexOf(item.DisciplineID) === -1) {
              this.selectSubject.push(item.DisciplineID)
            }
          })
        }
        this.getSloverResultOverallTimes()
      },
      // 切换学科
      subjectChange () {
        let data = this.selectSubject
        if (data.length === this.subjectData.length && data.length > 0) {
          this.allSubject = true
        } else if (data.length > 0) {
          this.allSubject = false
        } else {
          this.allSubject = false
        }
        this.getSloverResultOverallTimes()
      },
      // 排版
      radioChange (val) {
        if (val === 1) {
          this.isHorizontal = true
          this.isVertical = false
        };
        if (val === 2) {
          this.isHorizontal = false
          this.isVertical = true
        };
      },
      // 全部学科
      async getSloverResultOverallTimesDiscipline () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/GetSloverResultOverallTimesDiscipline`, {
          classTableIDs: this.classTableIDs
        })
        if (res.success) {
          let resData = res.data
          for (let i = 0; i < resData.length; i++) {
            this.selectSubject.push(resData[i].DisciplineID)
          };
          // this.disciplineIDs = ids
          this.allSubject = true
          this.subjectData = res.data
          this.getSloverResultOverallTimes()
        }
      },
      // 导出
      exportFile () {
        let exNum = 0
        if (this.isShwowTeacher) {
          exNum += 4
        }
        if (this.isShwowHouse) {
          exNum += 2
        }
        if (this.isShwowTime) {
          exNum += 1
        }
        this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/ExportSloverResultOverallTimes`, {
          classTableIDs: this.classTableIDs,
          disciplineID: this.disciplineIDs,
          isHorizontal: this.isHorizontal,
          isContainWeekend: this.isContainWeekend,
          expInfo: exNum
        })
        this.modalExport = false
        this.isContainWeekend = false
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module{
  border-top: 1px solid #e8e8e8;
}
.query-table {
  width: 100%;
  height: 100%;
  overflow: auto;
  border-spacing: 0;
  text-align: center;
}
.horizontal-version tr:first-child th {
  background: #F4F5F7;
  font-weight: bold;
}
.query-table thead tr th {
  background: #F4F5F7;
  border-right: 1px solid #fff;
  font-weight: bold;
//   color: #91a0b4;
  min-width: 140px;
  max-width: 140px;
  padding: 10px 0;
}
.query-table tbody {
  border: 1px solid #eee;
}
.query-table tbody tr td:nth-child(1) {
  border-right: 1px solid #eee;
}
.query-table tbody tr td:last-child {
  border-right: 1px solid #eee;
}
.query-table td,
.query-table th {
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  /*border: 1px solid #eee;*/
  min-width: 140px;
  max-width: 140px;
}
.query-table thead tr th:nth-child(1) {
//   border-top-left-radius: 6px;
}
.query-table thead tr th:last-child {
//   border-top-right-radius: 6px;
  border-right: 0px;
}
.table-subject {
  width: 150px;
  height: 80px;
  border: 1px solid #ddd;
}
.export-btn {
  position: absolute;
  top: 11px;
  right: 0;
}
.check-list {
  position: absolute;
  top: 15px;
  right: 80px;
}
.print-btn {
  position: absolute;
  top: 15px;
  right: 146px;
}
/*初始*/
.schedule-tip {
  color: #8b8b8b;
  font-size: 12px;
  height: 32px;
  line-height: 32px;
}
.plan-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  min-height: 300px;
  cursor: pointer;
}
.plan-list li {
  padding: 20px 15px;
  width: 24%;
  height: 105px;
  margin: 10px 6px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 8px 0px rgba(196, 196, 196, 0.5);
  border-radius: 4px;
}
.plan-list li.is-checked {
  box-shadow: 0px 3px 8px 0px rgba(54, 54, 54, 0.5);
}
.plan-list li:hover {
  box-shadow: 0px 3px 8px 0px rgba(54, 54, 54, 0.5);
}
.plan-list .class-table-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
}

.plan-list .plan-span {
  margin-top: 17px;
}
.plan-list .plan-span span {
  /*width:49%;
    display:inline-block;*/
  color: #8b8b8b;
}
.schedule-change-list {
  width: 100%;
  text-align: center;
}
.schedule-change-list li {
  display: inline-block;
}
.schedule-change-list li .type-name {
  padding: 0 8px 4px 8px;
  cursor: pointer;
}
.schedule-change-list li .underline {
  width: 30px;
  height: 4px;
  background: rgba(99, 146, 233, 1);
  margin: 0 auto;
}
.back-btn {
  position: absolute;
  top: 147px;
  right: 35px;
  z-index: 99;
}
.select-class-list {
  width: 80%;
  background: rgba(243, 243, 243, 1);
  border-radius: 4px;
  color: #8b8b8b;
}
.ivu-table th {
  border-top: 1px solid #ebeef5;
  background: #f9f9f9;
}
.filter-conditions {
  margin: 15px 0;
}
.crouse-list {
  border: 1px solid #ddd;
  margin-right: 20px;
}
.attend-cont-tit {
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
.class-name > span {
  font-size: 14px;
  color: #999;
}
.subject-box {
  margin-left: 20px;
  margin-bottom: 15px;
}
.teacher-box {
  margin-left:20px;
  margin-top:15px;
}
.teacher-lable {
  display: block;
  margin-bottom: 15px;
  max-width: 100%;
}
.td-min {
  min-width: 140px;
  max-width: 140px;
  min-height: 58px;
}

.single {
  margin-bottom: 25px;
}

.single > .single-tit {
  margin-left: 10px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #444444;
  margin-bottom: 18px;
  display: block;
}
.single > .single-tit > span {
  font-size: 14px;
  color: #999;
}
.single > .row-single-tit {
  margin-top: 10px;
  font-size: 16px;
  margin-bottom: 5px;
  margin-left: 5px;
  display: inline-block;
}

.week-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 15px 0;
}
.week-ul li b {
  font-size: 16px;
}
.week-ul li span {
  font-size: 14px;
  color: #000;
  padding: 2px 7px;
  cursor: pointer;
  margin: 0 4px;
}
.week-ul li span:hover {
  background: #2d8cf0;
  color: #fff;
  border-radius: 4px;
}
.is-cur-week {
  background: #2d8cf0;
  color: #fff !important;
  border-radius: 4px;
}
.week-con {
  background: #fff;
  width: 100%;
}

/*内容页*/
#Schedule {
  margin-top: 20px;
}
.left-options {
  /*width:250px;*/
  // margin-right: 15px;
}
.left-options .options-header {
  padding: 10px 0;
  border-radius: 4px;
  border-bottom: 1px solid #e8e8e8;
}
.left-options .options-header .check-list {
  padding: 10px 0;
}

.left-options .options-body {
  border-radius: 4px;
  padding: 10px 10px 10px 0;
  max-height: 600px;
  overflow-y: auto;
}
.left-options .options-body .search-opt {
  border-bottom: 1px solid #5685dc;
  padding-bottom: 15px;
}
.left-options .options-body .schedule-subject:first-child {
  font-size: 14px;
  margin-left: 0px;
}
/*总课表*/
.left-options .options-body .total-subject {
  margin-left: 20px;
}
/*教学班学生*/
.education-table {
  width: 100%;
  height: 100%;
  overflow: auto;
  border-spacing: 0;
}
.education-table tr {
  border-bottom: 1px solid #ebeef5;
}
.education-table tr:hover {
  background: #f5f7fa;
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
.education-table td,
.education-table th {
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
//   background: #f9f9f9;
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
#right-table1 tr th:first-child {
  border-top-left-radius: 0;
}
</style>
