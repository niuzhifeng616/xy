<!-- 互动课堂：主讲学校-发布 -->
<template>
  <div class="xy-content-module">
    <!-- 选择教师 -->
    <div class="xy-content-body choose-search" v-if="!isChoosed">
      <div class="choose">
        <div>
          <div class="title">查询课表</div>
          <cascader
              v-model="yearSession"
              :data="yearSessionData"
              :clearable="false"
              @on-change="cascaderChange"
              class="mr-15 fl"
              style="width:250px; margin-right:0;"
              size="large"></cascader>
          <!-- 请输入用户名/工号/姓名 -->
          <a-input-search
            placeholder="请输入教师姓名/用户名/工号"
            enter-button="搜索"
            size="large"
            v-model.trim="searchText"
            @search="FromSubmit('befor')"
            style="width: 600px;" />
        </div>
      </div>
    </div>
    <!-- 选择教师后 -->
    <div v-else>
      <div class="xy-content-title flex-flow">
        <div class="title-right">
          <span class="col0-85">学年学期：</span>
          <cascader
            v-model="yearSession"
            :data="yearSessionData"
            :clearable="false"
            @on-change="cascaderChange"
            class="mr-15"
            style="width:200px"></cascader>
          <!-- 请输入用户名/工号/姓名 -->
          <a-input-search placeholder="请输入教师姓名/用户名/工号" v-model.trim="searchText" @search="FromSubmit('after')" style="width: 250px;" />
        </div>
      </div>
      <div class="xy-content-body schedule-content">
          <div class="my-schedule-content" id="my-schedule-content">
              <!--课表-->
              <div class="schedule" ref="schedule" v-show="tableData.length>0">
                  <div class="my-schedule-con" id="my-schedule-con">
                      <table class="table">
                          <thead>
                              <tr>
                                  <th></th>
                                  <th v-for="(week, index) in weekData" :key="index">
                                      <span >{{week.weekName}}</span>
                                      <span >{{week.date}}</span>
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(time,index) in tableTimes" :key="index">
                                  <td v-if="time.AMorPM==='NS'" colspan="8">{{time.AMorPMOrderName}}</td>
                                  <td v-else >{{time.AMorPMOrderName}}</td>
                                  <td v-for="(td, index) in 5" :key="index" v-show="time.AMorPM!=='NS'">
                                      <div v-for="(data, index) in tableData"
                                          :key="index"
                                          v-show="data.AMorPM === time.AMorPM && data.AMorPMOrder === time.AMorPMOrder && data.Day == td-1"
                                          @click="checkCourse(data)"
                                          class="subject pr"
                                          :class="data.IsPublished ? 'is-published' : data.checked ? 'checked-bg': ''">
                                          <h5 style="">{{data.SubjectName}}</h5>
                                          <p class="class" v-if="data.CoursePlanTableFullName!==''" :title="data.CoursePlanTableFullName">{{data.CoursePlanTableFullName}}</p>
                                          <p class="" v-if="data.StartTime !== null && data.EndTime!== null">{{data.StartTime.substr(0, 5)}}-{{data.EndTime.substr(0, 5)}}</p>
                                          <img class="publish-icon pa" v-if="data.IsPublished" src="@/assets/lanclass/yfb.png" />
                                          <div v-if="data.checked" class="active-bg sanjiao"><i class="iconfont">&#xe6a1;</i></div>
                                      </div>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
              <!--暂无数据-->
              <div v-if="tableData.length===0" class="no-data-box">
                <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                <span class="no-data-text">该搜索条件下没有结果。</span>
              </div>
          </div>
      </div>
      <div class="fix-footer text-center" v-show="tableData.length>0">
          <Checkbox class="fl" style="line-height: 56px;" v-model="continueAdd">继续添加课程</Checkbox>
          <Button class="xy-btn-primary" shape="circle" @click="submit">发布</Button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'MainSchoolPublish',
    components: {
    },
    data () {
      return {
        isChoosed: false,

        teacherInfo: [], // 所有教师
        curTeacher: null, // 当前教师
        curTeacherId: 0,
        curTeacherName: '',

        yearSession: [],
        yearSessionData: [], // 学年学期
        curSessionStart: '',
        curSessionEnd: '',

        weekData: [], // 星期
        tableTimes: [], // 节次信息
        tableData: [], // 课表科目数据

        continueAdd: true,
        searchText: '',
        coursePlanDetailIds: []
      }
    },
    created () {
      this.getSessionNodeList()
      this.weeKData()
    },
    mounted () {
    },
    watch: {
      isChoosed (newValue) {
        if (newValue) {
          console.log(newValue)
        }
      }
    },
    methods: {
      // 学年学期
      async getSessionNodeList () {
        // this.yearSessionData = [{
        //   'label': '所有学年',
        //   'value': 0,
        //   'children': [{
        //     'value': 0,
        //     'label': '所有学期',
        //     'children': []
        //   }]
        // }]
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          this.yearSessionData = this.yearSessionData.concat(res.data)
          var index = this.yearSessionData.map(function (item) {
            return item.IsCurrent
          }).indexOf(true)
          if (index !== -1) {
            this.yearSession.push(this.yearSessionData[index].value)
            var index1 = this.yearSessionData[index].children.map(function (item) {
              return item.IsCurrent
            }).indexOf(true)
            if (index1 !== -1) {
              this.yearSession.push(this.yearSessionData[index].children[index1].value)
              this.curSessionStart = this.yearSessionData[index].children[index1].StartDate
              this.curSessionEnd = this.yearSessionData[index].children[index1].EndDate
            } else {
              this.yearSession = [0, 0]
              this.curSessionStart = ''
              this.curSessionEnd = ''
            }
          } else {
            for (var i = 0; i < this.yearSessionData.length; i++) {
              if (this.yearSessionData[i].children.length > 0) {
                this.yearSession = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                this.curSessionStart = this.yearSessionData[i].children[0].StartDate
                this.curSessionEnd = this.yearSessionData[i].children[0].EndDate
                return false
              }
            }
          }
          this.getAllTeacher()
        }
      },
      cascaderChange (value) {
        this.yearSession = value
        let checkedY = this.yearSessionData.filter(year => {
          return year.value === this.yearSession[0]
        })[0]
        if (checkedY && checkedY.children) {
          let checkedS = checkedY.children.filter(session => {
            return session.value === this.yearSession[1]
          })[0]
          if (checkedS) {
            this.curSessionStart = checkedS.StartDate
            this.curSessionEnd = checkedS.EndDate
          }
        }
        this.getAllTeacher()
      },
      async getAllTeacher () {
        let res = await this.xy.get(`${this.xyApi}/csms/api/Teaching/GetTeachers`, {
          academicSessionID: this.yearSession[1]
        })
        if (res.success) {
          this.teacherInfo = res.data
          if (this.isChoosed) {
            // 重置教师
            this.searchText = ''
            this.curTeacher = null // 当前教师
            this.curTeacherId = 0
            this.curTeacherName = ''
            // 重置课表
            this.tableTimes = [] // 节次信息
            this.tableData = [] // 课表科目数据
          }
        }
      },
      // 搜索教师
      FromSubmit (type) {
        this.curTeacher = this.teacherInfo.filter((value) => {
          return value.FullName === this.searchText || value.UserName === this.searchText || value.SchoolCardNumber === this.searchText
        })[0]
        if (this.curTeacher) {
          this.curTeacherId = this.curTeacher.TeacherID
          this.curTeacherName = this.curTeacher.FullName
        }
        if (type === 'befor') {
          if (this.curTeacher) {
            this.isChoosed = true
            this.getTeacherTimeTable()
          } else {
            if (this.searchText === '') {
              this.xy.msgError('请输入教师姓名/用户名/工号。')
            } else {
              this.xy.msgError('找不到教师课表。')
            }
          }
        } else {
          if (this.curTeacher) {
            this.getTeacherTimeTable()
          } else {
            if (this.searchText === '') {
              this.xy.msgError('请输入教师姓名/用户名/工号。')
            } else {
              this.xy.msgError('找不到教师课表。')
            }
            // 重置教师
            this.curTeacher = null // 当前教师
            this.curTeacherId = 0
            this.curTeacherName = ''
            // 重置课表
            this.tableTimes = [] // 节次信息
            this.tableData = [] // 课表科目数据
          }
        }
      },
      // 周信息
      weeKData: function () {
        this.weekData = []
        for (var j = 0; j < 5; j++) {
          this.weekData.push({
            weekName: this.xy.getChinesesWeekForNumSmall(j)
          })
        }
      },
      // 获取教师课表
      async getTeacherTimeTable (startDate, curScheduleUrl) {
        let obj = {
          startDate: this.curSessionStart,
          endDate: this.curSessionEnd,
          teacherID: this.curTeacherId,
          academicSessionID: this.yearSession[1]
        }
        this.xy.get(`${this.xyApi}/ic/api/Teaching/GetTeacherWeekTimeTable`, obj).then(res => {
          if (res.success) {
            this.tableTimes = res.data.Times
            this.tableData = res.data.TimeTables
            for (let i = 0; i < this.tableData.length; i++) {
              this.$set(this.tableData[i], 'checked', false)
            }
            this.coursePlanDetailIds = []
          }
        })
      },
      // 选中、取消选中课程
      checkCourse (data) {
        if (data.IsPublished) return false
        this.$set(data, 'checked', !data.checked)
        let index = this.coursePlanDetailIds.indexOf(data.CoursePlanDetailID)
        if (data.checked) {
          if (index === -1) {
            this.coursePlanDetailIds.push(data.CoursePlanDetailID)
          }
        } else {
          if (index !== -1) {
            this.coursePlanDetailIds.splice(index, 1)
          }
        }
      },
      async submit () {
        if (this.coursePlanDetailIds.length === 0) {
          this.xy.msgError('请选择课程。')
          return false
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.xyApi}/ic/api/Teaching/InsertTeachingProgramme`, {
          academicSessionID: this.yearSession[1],
          teacherID: this.curTeacherId,
          coursePlanDetailIDS: this.coursePlanDetailIds
        })
        if (res.success) {
          this.xy.msgSuc('发布成功。')
          this.getTeacherTimeTable()
          if (!this.continueAdd) {
            this.$store.commit('common/getThreeMenuName', '主讲学校')
            this.$router.push({ path: '/xyhome/MainSchool', query: this.$store.state.common.menuInfo })
          }
        }
        this.xy.unloading()
      }
    }
  }
</script>
<style lang="less" scoped>
.flex-flow{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-right {
  display: flex;
  align-items: center;
}
// 选择学年学期/教师样式
.choose-search{
  padding: 50px 35px 20px;
}
.choose{
  min-height: 610px;
  background: url(~@/assets/lanclass/choose_bg.png) no-repeat;
  display: flex;
  justify-content: center;
}
.choose .title{
  text-align: center;
  font-size: 20px;
  color: rgba(0,0,0,0.85);
  font-weight: 700;
  margin: 45px 0 35px;
}
.choose /deep/ .ivu-cascader .ivu-input{
  border-radius: 4px 0 0 4px;
}
.choose /deep/ .ant-input-group .ant-input{
  border-radius: 0;
  border-left:0;
}

// 课表样式
.schedule-content.xy-content-body{
    padding-bottom:70px;
}
.my-schedule-con{
  // height: 700px;
  // overflow-y: auto;
}
.my-schedule-content .schedule{
    position:relative;
}
.schedule .table{
    // border: 1px solid #dcdcdc;

    text-align: center;
    /*cursor: pointer;*/
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 14px;
    width: 100%;
}
.schedule .table thead th{
    background: #F4F5F7;
    width:12.5%;
    height: 50px;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: middle;
    font-weight:700;
    color:rgba(0,0,0,0.65);
    border-right: 1px solid #dcdcdc;
}
.schedule .table thead th:first-child{
    width: 2.5%;
}
.schedule .table tbody td{
    height: 75px;
    box-sizing: border-box;
    text-align: center;
    vertical-align: middle;
    position:relative;
    // padding:1px 1px 0 1px;
    cursor:pointer;
    border: 1px solid #d8d8d8;
    border-left: 0 none;
}
.schedule table tbody tr td:first-child{
    color:rgba(0,0,0,0.65);
}

.subject{
    padding:6px 0 6px 13px;
    text-align:left;
    min-height:55px;
    margin-bottom: 1px;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0);
}
.subject.checked-bg {
    border: 1px solid #1677ff;
}
.subject h5{
  font-weight: 700;
  font-size: 14px;
  color: rgba(0,0,0,0.85);
}
.subject p{
  font-size: 12px;
  color: rgba(0,0,0,0.65);
}
.subject p.class{
  margin: 2px 0;
}
.subject.checked-bg h5, .subject.checked-bg p{
  color:  #1677ff;
}
.subject.is-published{

}
.subject.is-published h5{
    color: rgba(0,0,0,0.4);
}
.subject.is-published p{
    color: rgba(0,0,0,0.3);
}
.publish-icon{
  width: 44px;
  height: 44px;
  right: 13px;
  top: 16px;
}
.active-bg {
  border-color: transparent #1677ff #1677ff transparent !important;
}
.sanjiao {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-width: 13px;
  border-style: solid;
  i {
    position: absolute;
    right: -12px;
    bottom: -14px;
    color: #fff;
    font-size: 12px;
  }
}
//底部按钮
.fix-footer{
  height: 56px;
  line-height: 56px;
}
</style>
