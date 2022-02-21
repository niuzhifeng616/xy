<template>
  <div class="xy-content-module">
    <Button type="primary"
            class="export-btn xy-primary"
            @click="exportType">导出</Button>
    <Row>
      <i-col span="4">
        <div class="left-options"
             style="overflow-y:auto;max-height:600px;">
          <div class="options-body">
            <RadioGroup v-model="selectSubject"
                        vertical
                        @on-change="subjectChange"
                        style="width:100%">
              <Radio label="0"
                     class="schedule-subject administrative-subject">全部行政班</Radio>
              <Menu v-for="(item,index) in subjectData"
                    :key="index"
                    style="width:100%;">
                <Submenu :name="item.StudentGradeForStudentYearID">
                  <template slot="title">
                    {{item.StudentGradeForStudentYearName}}
                  </template>
                  <MenuItem :name="item.StudentGradeForStudentYearID">
                  <Radio class="administrative-radio"
                         :label="JSON.stringify(subject)"
                         v-for="(subject,index) in item.Orgs"
                         :key="index">
                    <p v-cloak
                       class="nowrap"
                       style="width:95%;display:inline"
                       :title="subject.StudentOrganizationName">{{subject.StudentOrganizationName}}</p>
                  </Radio>
                  </MenuItem>
                </Submenu>
              </Menu>
            </RadioGroup>
          </div>
        </div>
      </i-col>
      <i-col span="20">
        <div style="overflow:auto;height:600px; border-left:1px solid #e8e8e8;padding-left:10px">
          <div class="single"
               v-if="datatable.length > 0">
            <table class="education-table">
              <thead>
                <tr>
                  <th v-cloak>用户名</th>
                  <th v-cloak>姓名</th>
                  <th v-cloak>行政班</th>
                  <th v-for="(course,index) in datath"
                      :key="index"
                      v-cloak>{{course.SubjectName}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in datatable"
                    :key="index">
                  <td v-cloak>
                    {{item.UserName}}
                  </td>
                  <td v-cloak>
                    {{item.FullName}}
                  </td>
                  <td v-cloak>
                    {{item.ClassName}}
                  </td>
                  <td v-for="(crouse,index) in item.Courses"
                      :key="index"
                      v-cloak>
                    {{crouse.Name}}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else
               class="no-data-box">
            <img class="no-data-img"
                 :src="require('@/assets/common/nullData.svg')" />
            <span class="no-data-text">
              该搜索条件下没有结果。
            </span>
          </div>
        </div>
        <div class="text-right pr"
             style="margin-top:10px;">
          <page :total="total"
                :page-size="pageSize"
                :current="pageCurrent"
                @on-change="changePage"
                @on-page-size-change="changePageSize"></page>
        </div>
      </i-col>
    </Row>

    <!-- 导出 -->
    <Modal v-model="modalExport"
           :transfer="false"
           :mask-closable="false"
           :closable="false">
      <p slot="header">导出行政班学生去向</p>
      <div class="text-center"
           style="margin:10px 0;">
        <Checkbox v-model="isContainWeekend">
          <span class="f14"
                v-cloak>导出自习</span>
        </Checkbox>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="modalExport = false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="exportFile">导出</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        scheduleHeader: {},
        selectSubject: '0',
        selectLevel: 0,
        selecLayer: 0,
        datatable: [],
        datath: [],
        weekData: [], // 星期数据
        sectionLen: 0, // 节次长度
        festList: [],
        sectionData: [], // 节次数据
        subjectData: [], // 课程名称
        classData: [], // 班级名称列表
        classChildData: [], // 班级名称列表
        classTableIDs: '', // 排课方案IDS,
        studentGradeForStudentYearID: '0', // 学年ID
        studentOrganizationID: '0', // 组织结构ID
        isShwowTeacher: true,
        isShwowHouse: false,
        isShwowTime: false,
        isHorizontal: true, // 排版
        pageCurrent: 1, // 当前页码
        pageSize: 1, // 每页显示条数
        pages: [15, 30, 50, 100], // 默认每页可选10/20/50/100条
        total: 0, // 总条数
        // 导出
        modalExport: false,
        isContainWeekend: false // 导出周六日
      }
    },
    created () {
      this.scheduleHeader = this.$store.state.csmstimetable.scheduleQuery
      for (let i = 0; i < this.scheduleHeader.classTable.length; i++) {
        this.classTableIDs = this.classTableIDs + this.scheduleHeader.classTable[i].ClassTableID
      }
      this.getSloverResultOverallTimes()
      this.getSloverResultOverallTimesDiscipline()
    },
    methods: {
      // 走班学生查询--总课表
      async getSloverResultOverallTimes () {
        if (this.selectSubject !== '0') {
          this.studentGradeForStudentYearID = JSON.parse(this.selectSubject).StudentGradeForStudentYearID
          this.studentOrganizationID = JSON.parse(this.selectSubject).StudentOrganizationID
        } else {
          this.studentGradeForStudentYearID = 0
          this.studentOrganizationID = 0
        }
        if (this.scheduleHeader.classTable[0].ClassTableTypeID !== 4) {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/GetReportMovingClassStudentForAdministrativeClass`, {
            classTableID: this.classTableIDs,
            studentGradeForStudentYearID: this.studentGradeForStudentYearID,
            studentOrganizationID: this.studentOrganizationID,
            pageIndex: this.pageCurrent,
            pageSize: this.pageSize
          })
          this.xy.unloading()
          if (res.success) {
            let resData = res.data.Result
            let courData = res.data.Courses
            this.datatable = resData
            this.datath = courData
            this.total = res.data.totalRecords
          }
        } else { // 校本课程
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/GetReportMovingClassStudentForAdministrativeClassByElective`, {
            classTableID: this.classTableIDs,
            studentGradeForStudentYearID: this.studentGradeForStudentYearID,
            studentOrganizationID: this.studentOrganizationID,
            pageIndex: this.pageCurrent,
            pageSize: this.pageSize
          })
          this.xy.unloading()
          if (res.success) {
            let resData = res.data.Result
            let courData = res.data.Courses
            this.datatable = resData
            this.datath = courData
            this.total = res.data.totalRecords
          }
        }
      },
      // 单击页码触发
      changePage (current) {
        $(window).scrollTop(0)
        this.pageCurrent = current
        this.getSloverResultOverallTimes()
      },
      // 单击切换每页展示条数触发
      changePageSize (size) {
        $(window).scrollTop(0)
        this.pageSize = size
        this.pageCurrent = 1
        this.getSloverResultOverallTimes()
      },
      // 全部班级
      async getSloverResultOverallTimesDiscipline () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/GetBaseWeekTimeTableAdministrativeClassClass`, {
          classTableID: this.classTableIDs
        })
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          for (let i = 0; i < resData.length; i++) {
            resData[i].Orgs.map((item) => {
              item.StudentGradeForStudentYearID = resData[i].StudentGradeForStudentYearID
              return item
            })
          };
          this.subjectData = resData
        }
      },

      // 切换学科
      subjectChange () {
        $(window).scrollTop(0)
        this.pageCurrent = 1
        this.getSloverResultOverallTimes()
      },
      exportType () {
        if (this.scheduleHeader.classTable[0].ClassTableTypeID !== 4) {
          this.modalExport = true
          return
        }
        // 导出校本
        if (this.selectSubject !== '0') {
          this.studentGradeForStudentYearID = JSON.parse(this.selectSubject).StudentGradeForStudentYearID
          this.studentOrganizationID = JSON.parse(this.selectSubject).StudentOrganizationID
        } else {
          this.studentGradeForStudentYearID = 0
          this.studentOrganizationID = 0
        }
        let parmas = {
          classTableID: this.classTableIDs,
          studentGradeForStudentYearID: this.studentGradeForStudentYearID,
          studentOrganizationID: this.studentOrganizationID,
          isContainSelfStudy: this.isContainWeekend
        }
        this.xy.downFile(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/ExportReportMovingClassStudentForAdministrativeClassByElective`, parmas)
      },
      // 导出
      exportFile () {
        if (this.selectSubject !== '0') {
          this.studentGradeForStudentYearID = JSON.parse(this.selectSubject).StudentGradeForStudentYearID
          this.studentOrganizationID = JSON.parse(this.selectSubject).StudentOrganizationID
        } else {
          this.studentGradeForStudentYearID = 0
          this.studentOrganizationID = 0
        }
        let parmas = {
          classTableID: this.classTableIDs,
          studentGradeForStudentYearID: this.studentGradeForStudentYearID,
          studentOrganizationID: this.studentOrganizationID,
          isContainSelfStudy: this.isContainWeekend
        }
        this.xy.downFile(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/ExportReportMovingClassStudentForAdministrativeClass`, parmas)
        this.modalExport = false
        this.isContainWeekend = false
      }
    }
  }
</script>
<style lang="less" scoped>
.query-table {
  width: 100%;
  height: 100%;
  overflow: auto;
  border-spacing: 0;
  text-align: center;
}
.horizontal-version tr:first-child th {
  background: #6392e9;
  color: #ffffff;
  font-weight: bold;
}
.query-table thead tr th {
  background: #eceef1;
  border-right: 1px solid #fff;
  color: #91a0b4;
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
  border-top-left-radius: 6px;
}
.query-table thead tr th:last-child {
  border-top-right-radius: 6px;
  border-right: 0px;
}
.table-subject {
  width: 150px;
  height: 80px;
  border: 1px solid #ddd;
}
.export-btn {
  position: absolute;
  top: 15px;
  right: 0;
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
// .plan-list li:hover{
//    box-shadow: 0px 3px 8px 0px rgba(54,54,54,0.5);
// }
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
  top: 134px;
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
.td-min {
  min-width: 140px;
  max-width: 140px;
  min-height: 58px;
}

.single {
  margin-top: 15px;
  margin-bottom: 25px;
}

.single > .single-tit {
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
// .week-ul li span:hover{
//     background:#2d8cf0;
//     color:#fff;
//     border-radius:4px;
// }
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
.xy-content-module .left-options {
  /*width:250px;*/
  margin-right: 15px;
}
.xy-content-module .left-options .options-header {
  border-radius: 4px;
  padding: 0 10px;
}
.xy-content-module .left-options .options-header .radio-list {
  padding: 10px 0;
  border-bottom: 1px solid #5685dc;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.xy-content-module .left-options .options-header .check-list {
  padding: 10px 0;
}

.xy-content-module .left-options .options-body {
  margin-top: 15px;
  border-radius: 4px;
  padding: 10px 10px;
  max-height: 600px;
  overflow-y: auto;
}
.xy-content-module .left-options .options-body .search-opt {
  border-bottom: 1px solid #5685dc;
  padding-bottom: 15px;
}
.xy-content-module .left-options .options-body .schedule-subject:first-child {
  font-size: 14px;
  font-weight: bold;
  margin-left: 0px;
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
// .education-table tr:hover{
//     background:#F5F7FA;
// }
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
#right-table1 tr th:first-child {
  border-top-left-radius: 0;
}
// 样式覆盖
/deep/.ivu-menu-vertical.ivu-menu-light:after {
  background: transparent;
}
/deep/.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu) {
  color: #515a6e;
  background: #fff;
}
/deep/.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  background: transparent;
}
</style>
