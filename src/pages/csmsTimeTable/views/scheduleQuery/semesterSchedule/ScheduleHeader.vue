<template>
  <div class="xy-content-module">
    <div class="schedule-change-list" style="position:relative;">
      <RadioGroup v-model="clickUrl" type="button" class='radio' @on-change="scheduleChange()">
        <Radio v-for="(btn,index) in btnData" :key="index" :label="btn.url">{{btn.name}}</Radio>
      </RadioGroup>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        classTable: [],
        year: '',
        session: '',
        btnData: [
          {
            name: '总课表',
            type: 'AllSchedule',
            url: '/SemesterTotal'
          },
          {
            name: '行政班课表',
            type: 'ClassSchedule',
            url: '/SemesterAdministrative'
          },
          {
            name: '走班课表',
            type: 'WalkSchedule',
            url: '/SemesterShiftClass'
          },
          {
            name: '教师课表',
            type: 'TeacherSchedule',
            url: '/SemesterTeacherTable'
          },
          {
            name: '学生课表',
            type: 'StudentSchedule',
            url: '/SemesterStudentTable'
          },
          {
            name: '教室课表',
            type: 'ClassRoomSchedule',
            url: '/SemesterClassRoomSchedule'
          }
        ],
        isIndex: 0,
        modelIDs: [],
        clickUrl: '/SemesterTotal'
      }
    },
    created () {
      this.modelIDs = this.$store.state.common.menuId.split(',')
      this.classTable = this.$store.state.csmstimetable.scheduleQuery.classTable
      this.year = this.$store.state.csmstimetable.scheduleQuery.year
      this.session = this.$store.state.csmstimetable.scheduleQuery.session
      // this.$store.commit('csmstimetable/changeScheduleQuery', {
      //   classTable: this.$router.currentRoute.query.classTable,
      //   year: this.$router.currentRoute.query.year,
      //   session: this.$router.currentRoute.query.session
      // })
      // this.getPermissionSubsectionByID()
      this.clickUrl = this.btnData[0].url
      this.$router.push({ path: `/xyhome/semesterScheduleHeader${this.btnData[0].url}`, query: this.$store.state.common.menuInfo })
    },
    mounted: function () {
    },
    methods: {
      async getPermissionSubsectionByID () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/PermissionSubsection/GetPermissionSubsectionByID`, {
          applicationID: this.modelIDs[1],
          sunMenuID: this.modelIDs[2]
        })
        if (res.success) {
          this.xy.unloading()
          let resData = res.data
          if (resData.OpearationPermissionList.length > 0) {
            for (var i = 0; i < resData.OpearationPermissionList.length; i++) {
              if (resData.OpearationPermissionList[i].OperationPermissionCode === 'AllSchedule') {
                this.btnData.push({
                  name: '总课表',
                  type: 'AllSchedule',
                  url: '/SemesterTotal'
                })
              };
              if (resData.OpearationPermissionList[i].OperationPermissionCode === 'ClassSchedule') {
                this.btnData.push({
                  name: '行政班课表',
                  type: 'ClassSchedule',
                  url: '/SemesterAdministrative'
                })
              };
              if (resData.OpearationPermissionList[i].OperationPermissionCode === 'WalkSchedule') {
                this.btnData.push({
                  name: '走班课表',
                  type: 'WalkSchedule',
                  url: '/SemesterShiftClass'
                })
              };
              if (resData.OpearationPermissionList[i].OperationPermissionCode === 'TeacherSchedule') {
                this.btnData.push({
                  name: '教师课表',
                  type: 'TeacherSchedule',
                  url: '/SemesterTeacherTable'
                })
              };
              if (resData.OpearationPermissionList[i].OperationPermissionCode === 'StudentSchedule') {
                this.btnData.push({
                  name: '学生课表',
                  type: 'StudentSchedule',
                  url: '/SemesterStudentTable'
                })
              };
              if (resData.OpearationPermissionList[i].OperationPermissionCode === 'ClassRoomSchedule') {
                this.btnData.push({
                  name: '教室课表',
                  type: 'ClassRoomSchedule',
                  url: '/SemesterClassRoomSchedule'
                })
              };
            }
            this.clickUrl = this.btnData[0].url
            this.$router.push({ path: `/xyhome/semesterScheduleHeader${this.btnData[0].url}`, query: this.$store.state.common.menuInfo })
          } else {
            // this.getPermissionSubsectionByID()
            this.xy.msgError('您没有菜单权限。')
          }
        }
      },
      // 课表切换
      scheduleChange () {
        // this.isIndex = i
        this.$router.push({ path: `/xyhome/semesterScheduleHeader${this.clickUrl}`, query: this.$store.state.common.menuInfo })
      },
      // 返回
      back () {
        this.$router.push({
          path: '/xyhome/semesterQueryConditions',
          query: this.$store.state.common.menuInfo
        })
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
  margin-bottom: 10px;
  background: #fff;
  padding: 10px 0;
}
.schedule-change-list .radio {
  margin-left: 10px;
  margin-bottom: 10px;
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
  position: relative;
  float: right;
  top: 15px;
  right: 10px;
  z-index: 99;
}
.select-class-list {
  width: 80%;
  background: rgba(243, 243, 243, 1);
  border-radius: 4px;
  color: #8b8b8b;
  margin-bottom: 20px;
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
  margin-right: 15px;
}
.left-options .options-header {
  background: rgba(99, 146, 233, 1);
  border-radius: 4px;
  padding: 0 10px;
  color: #fff;
}
.left-options .options-header .radio-list {
  padding: 10px 0;
  border-bottom: 1px solid #5685dc;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.left-options .options-header .check-list {
  padding: 10px 0;
}
.left-options .options-header .ivu-checkbox-inner {
  /*重写iview的check*/
  border-color: #fff;
  background-color: #fff;
}
.left-options .options-header .ivu-checkbox-checked .ivu-checkbox-inner:after {
  border-color: #2d8cf0;
}

.left-options .options-body {
  margin-top: 15px;
  background: rgba(99, 146, 233, 1);
  border-radius: 4px;
  padding: 10px 10px;
  color: #fff;
  max-height: 600px;
  overflow-y: auto;
}
.left-options .options-body .search-opt {
  border-bottom: 1px solid #5685dc;
  padding-bottom: 15px;
}
.left-options .options-body .schedule-subject:first-child {
  font-size: 14px;
  font-weight: bold;
  margin-left: 0px;
}
.left-options .ivu-radio-inner:after {
  width: 4px;
  height: 4px;
  left: 4px;
  top: 4px;
}
/*总课表*/
.left-options .options-body .total-subject {
  margin-left: 20px;
}
/*行政班课表*/
.left-options .options-body .xy-menu-primary {
  background: rgba(99, 146, 233, 1);
}
.left-options .options-body .ivu-menu-vertical .ivu-menu-item,
.ivu-menu-vertical .ivu-menu-submenu-title {
  color: #fff;
  height: 30px;
  line-height: 30px;
}
.left-options .options-body .ivu-menu-vertical .ivu-menu-item:hover,
.ivu-menu-vertical .ivu-menu-submenu-title:hover {
  color: #fff;
}
.left-options .options-body .ivu-menu {
  color: #fff;
  width: 100%;
}
.left-options .options-body .ivu-menu-vertical .ivu-menu-submenu-title-icon {
  top: 8px;
}
.left-options .options-body .administrative-radio .ivu-radio-inner {
  top: -11px;
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
</style>
