<template>
<!-- 8.手动调整-教师课表 -->
<div class="teacher-schedule">
  <div class="clearfix">
      <div class="fl">
          <i-select v-model="selectVal" @on-change="rightSelectChange" style="width:200px">
              <i-option :value="item.TeacherID"
                          v-for="item in rightSelect"
                          :key="item.TeacherID">{{item.TeacherName}}</i-option>
          </i-select>
      </div>
      <div class="fr pr schedule-icon">
          <span class="fa-stack" style="vertical-align:top; font-size: 14px;" @click="firstSelect">
              <i class="iconfont">&#xe6f6;</i>
          </span>
              <i class="iconfont" @click="prevSelect">&#xe6a7;</i>
              <i class="iconfont"  @click="nextSelect">&#xe6a9;</i>
          <span class="fa-stack" style="vertical-align:top; font-size: 14px;" @click="lastSelect">
              <i class="iconfont">&#xe6f5;</i>
          </span>
      </div>
  </div>
  <div style="margin:20px 0;">
      <table class="table-content" v-if="rightSectionList.length > 0">
          <thead>
              <tr>
                  <th width="16%"></th>
                  <th width="12%">星期一</th>
                  <th width="12%">星期二</th>
                  <th width="12%">星期三</th>
                  <th width="12%">星期四</th>
                  <th width="12%">星期五</th>
                  <th width="12%">星期六</th>
                  <th width="12%">星期日</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="rightSection in rightSectionList" :key="rightSection.AMorPMOrderName">
                  <td>{{rightSection.AMorPMOrderName}}</td>
                  <td v-for="(item,index) in 7" :key="index">
                      <div class="crouse-class"
                            :key="i"
                            :style="{'background': rightTableCrouse.bg,'borderLeftColor':rightTableCrouse.color,'color':rightTableCrouse.color}"
                            v-for="(rightTableCrouse, i) in rightTable"
                            v-show="rightSection.AMorPM === rightTableCrouse.AMorPM && index === rightTableCrouse.Day && rightSection.AMorPMOrder === rightTableCrouse.AMorPMOrder">
                          <p class="nowrap" :title="rightTableCrouse.SubjectName">{{rightTableCrouse.SubjectName}}</p>
                          <p class="nowrap" :title="rightTableCrouse.CoursePlanTableName">{{rightTableCrouse.CoursePlanTableName}}</p>
                      </div>
                  </td>
              </tr>
          </tbody>
      </table>
      <div v-if="rightSectionList.length===0" class="no-data-box">
          <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
          <span class="no-data-text">
              该搜索条件下没有结果。
          </span>
      </div>
  </div>
</div>
</template>
<script>

  export default {
    components: {

    },
    name: 'TeacherSchedule',
    data () {
      return {
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        sloverResultCollectionID: 0,
        showScheduleName: '',

        checkbox: false,
        modalAddCrouseTable: false,
        scheduleName: '',
        rightSectionList: [],
        rightSelect: [],
        selectVal: '',
        rightTable: []
      }
    },

    created () {
      if (this.$store.state.csmstimetable.manualAdjust.sloverResultCollectionID !== 0) {
        this.sloverResultCollectionID = this.$store.state.csmstimetable.manualAdjust.sloverResultCollectionID
      }
      if (this.$store.state.csmstimetable.manualAdjust.showScheduleName !== '') {
        this.showScheduleName = this.$store.state.csmstimetable.manualAdjust.showScheduleName
      }
    },
    mounted () {
      this.getTimeTable(this.sloverResultCollectionID, 0)
    },
    methods: {
      async getTimeTable (sloverResultCollectionID, coursePlanTableID) {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: sloverResultCollectionID,
          sloverResultCollectionName: this.scheduleName,
          coursePlanTableID: coursePlanTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverResult/GetTimeTable`, params, true)
        if (res.success) {
          this.$store.commit('csmstimetable/changeManualAdjust', {
            sloverResultCollectionID: res.data.SloverResultCollectionID,
            showScheduleName: this.$store.state.csmstimetable.manualAdjust.showScheduleName
          })
          this.getTeachers()// 获取教师列表
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        }
      },
      // 获取教师列表
      async getTeachers () {
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverResult/GetTeachers`, params)
        if (res.success) {
          this.rightSelect = []
          for (let i = 0; i < res.data.TeacherIDs.length; i++) {
            this.rightSelect.push({
              TeacherID: res.data.TeacherIDs[i],
              TeacherName: res.data.TeacherNames[i]
            })
          };
          if (res.data.TeacherIDs.length > 0) {
            this.selectVal = res.data.TeacherIDs[0]
          } else {
            this.selectVal = 0
          }

          this.getTeacherTimeTable()// 获取右侧教师课表
        }
      },
      // 获取右侧教师课表
      async getTeacherTimeTable () {
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID,
          teacherID: this.selectVal
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverResult/GetTeacherTimeTable`, params)
        this.xy.unloading()
        if (res.success) {
          this.rightSectionList = res.data.Times
          let resData = res.data.TimeTables
          let array = []
          for (let i = 0; i < resData.length; i++) {
            let index = array.indexOf(`${resData[i].AID}-${resData[i].Type}`)
            if (index > -1) {
              resData[i].color = this.xy.colors(index).color
              resData[i].bg = this.xy.colors(index).bg
            } else {
              resData[i].color = this.xy.colors(array.length).color
              resData[i].bg = this.xy.colors(array.length).bg
              array.push(`${resData[i].AID}-${resData[i].Type}`)
            }
          }
          this.rightTable = resData
        }
      },
      // 右侧select
      rightSelectChange (val) {
        if (val !== undefined) {
          this.selectVal = val
          this.xy.loading()
          this.getTeacherTimeTable()// 获取右侧教师课表
        }
      },
      // 图标点击触发select
      firstSelect () {
        let index = this.rightSelect.map((item) => { return item.TeacherID }).indexOf(this.selectVal)
        if (index - 1 >= 0) {
          this.selectVal = this.rightSelect[0].TeacherID
          this.xy.loading()
          this.getTeacherTimeTable()
        } else {
          this.xy.msgError('已到第一个。')
        }
      },
      prevSelect () {
        let index = this.rightSelect.map((item) => { return item.TeacherID }).indexOf(this.selectVal)
        if (index - 1 >= 0) {
          this.selectVal = this.rightSelect[index - 1].TeacherID
          this.xy.loading()
          this.getTeacherTimeTable()
        } else {
          this.xy.msgError('已到第一个。')
        }
      },
      nextSelect () {
        let index = this.rightSelect.map((item) => { return item.TeacherID }).indexOf(this.selectVal)
        if (index + 1 !== this.rightSelect.length) {
          this.selectVal = this.rightSelect[index + 1].TeacherID
          this.xy.loading()
          this.getTeacherTimeTable()
        } else {
          this.xy.msgError('已到最后一个。')
        }
      },
      lastSelect () {
        let index = this.rightSelect.map((item) => { return item.TeacherID }).indexOf(this.selectVal)
        if (index + 1 !== this.rightSelect.length) {
          this.selectVal = this.rightSelect[this.rightSelect.length - 1].TeacherID
          this.xy.loading()
          this.getTeacherTimeTable()
        } else {
          this.xy.msgError('已到最后一个。')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/manuallyAdjust.less';
</style>
