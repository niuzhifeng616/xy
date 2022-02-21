<template>
  <div class="xy-content-module">
    <Button type="primary" class="export-btn xy-primary" @click="modalExport = true">导出</Button>
    <Row>
        <i-col  span="4">
            <div class="left-options" style="max-height:600px;">
                <div class="options-body">
                    <RadioGroup v-model="selectSubject" vertical @on-change="subjectChange" style="width:100%">
                        <Radio label="0" class="schedule-subject administrative-subject">全部班级</Radio>
                        <Menu   v-for="item in subjectData" :key="item.DisciplineID" style="width:100%;">
                            <Submenu :name="item.DisciplineID">
                                <template slot="title">
                                    {{item.DisciplineName}}
                                </template>
                                <MenuItem :name="item.DisciplineID">
                                    <Radio class="administrative-radio" :label="JSON.stringify(subject)" v-for="subject in item.list" :key="subject.CoursePlanLevelID">
                                        <p v-cloak
                                        class="nowrap"
                                        style="width:95%;display:inline"
                                        :title="subject.CoursePlanLevelName">{{subject.CoursePlanLevelName}}</p>
                                    </Radio>
                                </MenuItem>
                            </Submenu>
                        </Menu>
                    </RadioGroup>
                </div>
            </div>
        </i-col>
        <i-col  span="20">
            <div style="overflow:auto;height:600px; border-left:1px solid #e8e8e8;padding-left:10px">
                <!-- 分表 -->
                <div v-if="datatable.length>0">
                    <div class="single" v-for="(item,index) in datatable" :key="index">
                        <Row style="margin-right:15px;">
                            <i-col  span="12">
                                <span class="row-single-leftit">{{item.CoursePlanLevelName}}</span>
                            </i-col>
                            <i-col  span="12" class="text-right">
                                <span class="row-single-tit" v-if="item.StudentCount !=  ''">学生人数：{{item.StudentCount}}</span>
                                <span class="row-single-tit" v-if="item.TeacherNames  !=  ''">任课教师：{{item.TeacherNames}}</span>
                                <span class="row-single-tit" v-if="item.HouseNames  != ''">上课教室：{{item.HouseNames}}</span>
                            </i-col>
                        </Row>

                        <table class="education-table">
                            <thead>
                                <tr>
                                    <th v-cloak>教学班名称</th>
                                    <th v-cloak>用户名</th>
                                    <th v-cloak>姓名</th>
                                    <th v-cloak>原行政班</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(crouse,index) in item.list" :key="index">
                                    <td v-cloak>
                                        {{crouse.CoursePlanLevelName}}
                                    </td>
                                    <td v-cloak>
                                        {{crouse.UserName}}
                                    </td>
                                    <td v-cloak>
                                        {{crouse.FullName}}
                                    </td>
                                    <td v-cloak>
                                        {{crouse.StudentOrganizationFullName}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-else class="no-data-box">
                   <img class="no-data-img" :src="require('@/assets/common/nullData.svg')"/>
                    <span class="no-data-text">
                        该搜索条件下没有结果。
                    </span>
                </div>
            </div>
            <div class="text-right pr" style="margin-top:10px;">
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
           :mask-closable="false"
           :transfer="false"
           :closable="false">
        <p slot="header">导出教学班学生名单</p>
        <div class="text-center" style="margin:10px 0;">
            <div style="margin-top:20px;">
                <span style="vertical-align:top;">请选择导出样式：</span>
                <RadioGroup v-model="subExport">
                    <Radio label="export" style="display:block; margin-bottom:10px;">
                        <span>导出版</span>
                    </Radio>
                    <Radio label="print" style="display:block;">
                        <span>打印版</span>
                    </Radio>
                </RadioGroup>
            </div>
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
        scheduleHeader: {},
        selectLevel: 0,
        selecLayer: 0,
        datatable: [],
        weekData: [], // 星期数据
        sectionLen: 0, // 节次长度
        festList: [],
        sectionData: [], // 节次数据
        subjectData: [], // 课程名称
        selectSubject: '0',
        classData: [], // 班级名称列表
        classChildData: [], // 班级名称列表
        classTableIDs: '', // 排课方案IDS
        disciplineID: '0', //
        coursePlanLevelID: '0', //
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
        isContainWeekend: false, // 导出周六日
        subExport: 'export' // 默认选中导出版
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
    mounted: function () {
    },
    methods: {
      // 行政班课表--总课表
      async getSloverResultOverallTimes () {
        if (this.selectSubject !== '0') {
          this.disciplineID = JSON.parse(this.selectSubject).DisciplineID
          this.coursePlanLevelID = JSON.parse(this.selectSubject).CoursePlanLevelID
        } else {
          this.disciplineID = 0
          this.coursePlanLevelID = 0
        }
        if (this.scheduleHeader.classTable[0].ClassTableTypeID !== 4) {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/GetReportMovingClassStudent`, {
            classTableID: this.classTableIDs,
            disciplineID: this.disciplineID,
            coursePlanLevelID: this.coursePlanLevelID,
            pageIndex: this.pageCurrent,
            pageSize: this.pageSize
          })
          this.xy.unloading()
          if (res.success) {
            this.total = res.data.totalRecords
            this.datatable = res.data.Return
          }
        } else {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/GetReportMovingClassStudentByElective`, {
            classTableID: this.classTableIDs,
            disciplineID: this.disciplineID,
            coursePlanLevelID: this.coursePlanLevelID,
            pageIndex: this.pageCurrent,
            pageSize: this.pageSize
          })
          this.xy.unloading()
          if (res.success) {
            this.total = res.data.totalRecords
            this.datatable = res.data.Return
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
        if (this.scheduleHeader.classTable[0].ClassTableTypeID !== 4) {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/GetReportMovingClassStudentClass`, {
            classTableID: this.classTableIDs
          })
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            for (let i = 0; i < resData.length; i++) {
              resData[i].list.map((item) => {
                item.DisciplineID = resData[i].DisciplineID
                return item
              })
            };
            this.subjectData = resData
          }
        } else { // 校本课程
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/GetReportMovingClassStudentClassByElective`, {
            classTableID: this.classTableIDs
          })
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            for (let i = 0; i < resData.length; i++) {
              resData[i].list.map((item) => {
                item.DisciplineID = resData[i].DisciplineID
                return item
              })
            };
            this.subjectData = resData
          }
        }
      },

      // 切换学科
      subjectChange () {
        $(window).scrollTop(0)
        this.pageCurrent = 1
        this.getSloverResultOverallTimes()
      },

      // 导出
      exportFile: function () {
        if (this.selectSubject !== '0') {
          this.disciplineID = JSON.parse(this.selectSubject).DisciplineID
          this.coursePlanLevelID = JSON.parse(this.selectSubject).CoursePlanLevelID
        } else {
          this.disciplineID = 0
          this.coursePlanLevelID = 0
        }
        if (this.subExport === 'export') {
          // 导出
          if (this.scheduleHeader.classTable[0].ClassTableTypeID !== 4) {
            this.xy.downFile(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/ExportReportMovingClassStudent?classTableID=
            ${this.classTableIDs}&disciplineID=${this.disciplineID}&coursePlanLevelID=${this.coursePlanLevelID}`)
          } else {
            this.xy.downFile(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/ExportReportMovingClassStudentByElective?classTableID=
            ${this.classTableIDs}&disciplineID=${this.disciplineID}&coursePlanLevelID=${this.coursePlanLevelID}`)
          }
        } else {
          // 打印版
          if (this.scheduleHeader.classTable[0].ClassTableTypeID !== 4) {
            this.xy.downFile(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/ExportPrintReportMovingClassStudent?classTableID=
            ${this.classTableIDs}&disciplineID=${this.disciplineID}&coursePlanLevelID=${this.coursePlanLevelID}`)
          } else {
            this.xy.downFile(`${this.$store.state.apiPath}/api/ReportMovingClassStudent/ExportPrintReportMovingClassStudentByElective?classTableID=
            ${this.classTableIDs}&disciplineID=${this.disciplineID}&coursePlanLevelID=${this.coursePlanLevelID}`)
          }
        }
        this.modalExport = false
        this.isContainWeekend = false
      }
    }
  }
</script>
<style lang="less" scoped>
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
    right:0;
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
    margin-top: 15px;
    margin-bottom: 25px;
}

.row-single-leftit{
font-size:14px;
font-weight:700;
color:rgba(0,0,0,1);
opacity:0.85;
margin-top: 10px;
margin-bottom: 5px;
margin-left: 5px;
display: inline-block;
}
.row-single-tit{
  font-size:14px;
  font-weight:400;
  color:rgba(0, 0, 0, 0.65);
  margin-left: 20px
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
// 样式覆盖
/deep/.ivu-menu-vertical.ivu-menu-light:after{
    background: transparent;
}
/deep/.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    color: #515a6e ;
    background: #fff;
}
/deep/.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after{
    background: transparent;
}

</style>
