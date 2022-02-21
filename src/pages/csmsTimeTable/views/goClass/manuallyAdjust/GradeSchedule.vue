<template>
  <!-- 8.手动调整-年级课表 -->
  <div class="grade-schedule">
    <div class="top-content">
      <Button class="xy-primary storage-btn" v-if="isOperation1 === 0" @click="creatShedule">新存一张课表</Button>
      <checkbox v-model="isShowWeekend" class="cb-btn">周末课表</checkbox>
      <radio-group v-model="exchange" @on-change="radioChange" class="rg-btn">
          <radio :label="1">整块互换</radio>
          <radio :label="2">单课叠加</radio>
      </radio-group>
      <tooltip max-width="400" placement="top">
          <Icon type="md-help-circle" size="18" color="#ffad33" />
          <div slot="content">
              <p>“整块互换”指两个课位的所有课互换位置；“单课叠加”指某课位上的一门课移动到另一课位上去。</p>
          </div>
      </tooltip>
    </div>
    <row style="margin:10px 0 50px;" class="schedule-content">
        <i-col span="16" style="width: calc(100% - 426px);">
            <div style="width:100%;overflow-x:auto;">
                <table class="table-content">
                    <thead>
                        <tr>
                            <th width="44px"></th>
                            <th>星期一</th>
                            <th>星期二</th>
                            <th>星期三</th>
                            <th>星期四</th>
                            <th>星期五</th>
                            <th v-show="isShowWeekend">星期六</th>
                            <th v-show="isShowWeekend">星期日</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(schedule, i) in scheduleData" :key="i">
                            <td>{{schedule.sectionName}}</td>
                            <!-- :style="{paddingTop:(exchange!==4 && week.IsSelected)?'28px':'0px',}" -->
                            <td  @click="tdCrouse(week,n)" :key="n"
                                v-for="(week,n) in schedule.weekList" :class="[!week.IsSelected?'no-cover':'',exchange===2?'pr':'']"
                                v-show="schedule.isRest === 0 && ((n!==5&&n!==6)||isShowWeekend)">
                                <template v-for="(leftCrouse, i) in leftTable">
                                  <div class="td-class"
                                      v-if="n == leftCrouse.Day && week.AMorPM == leftCrouse.AMorPM && week.AMorPMOrder == leftCrouse.AMorPMOrder"
                                      @click.stop="tdSubjectBtn(leftCrouse,0,week,n)" :key="i"
                                      :class="[equalCurSubject === (leftCrouse.AID+leftCrouse.Type)?'select-move-crouse':'',exchange===2?'pr':'']"
                                      :style="{'z-index':selectSubjectID===leftCrouse.CoursePlanDetailID?200:99}">
                                      <h3 class="crouse-name nowrap"
                                          :title="leftCrouse.SubjectName">{{leftCrouse.SubjectName}}</h3>
                                      <p class="crouse-teacher-name nowrap" :title="leftCrouse.TeacherNames" :data-id="leftCrouse.TeacherIDs">
                                        {{leftCrouse.teacherNameStr}}
                                      </p>
                                      <div class="top-right" v-if="selectSubjectID===leftCrouse.CoursePlanDetailID">
                                        <Icon type="ios-checkmark" class="icon-check"/>
                                      </div>
                                  </div>
                                </template>
                                <div v-if="week.IsSelected && week.isCanChange" class="td-box">
                                  <span class="td-box-tip" v-if="exchange===1">点此互换</span>
                                  <span class="td-box-tip" v-if="exchange!==1">点此叠加</span>
                                </div>
                            </td>
                            <td v-show="schedule.isRest === 1 && ((item!==6&&item!==7)||isShowWeekend)" class="no-cover" data-cover="0" v-for="(item, i) in 7" :key="i + 12000">
                                <div style="background: #EBF0F6;"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </i-col>
        <i-col span="8" style="width: 426px;">
            <div class="course-frame">
              <div class="course-frame-text">课程框</div>
              <div class="course-frame-box" :class="equalCurSubject!==''?'course-frame-box-active':''" @click.stop="delOne()">
                <div v-if="rightCourseFrame.length>0">
                  <div v-for="rightCrouse in rightCourseFrame"
                    :key="rightCrouse.CoursePlanDetailID"
                    @click.stop="tdSubjectBtn(rightCrouse,1)"
                    :class="equalCurSubject === (rightCrouse.AID+rightCrouse.Type)?'select-move-crouse':''"
                    class="right-course crouse-list">
                    <h3 class="crouse-name nowrap" :title="rightCrouse.SubjectName">{{rightCrouse.SubjectName}}</h3>
                    <p class="crouse-teacher-name nowrap" :title="rightCrouse.TeacherNames">
                        {{rightCrouse.TeacherNames}}</p>
                    <div class="top-right" v-if="selectSubjectID===rightCrouse.CoursePlanDetailID">
                      <Icon type="ios-checkmark" class="icon-check"/>
                    </div>
                  </div>
                </div>
                <div v-else class="right-frame-box-tip">点击此处将课程放置课程框里</div>
              </div>
            </div>
        </i-col>
    </row>
    <div class="fix-btn">
      <p v-for='(item,index) in category' :key='index'>
        <span :style="{background:item.bg}" class="rect"></span>
        <span>{{item.text}}</span>
      </p>
    </div>
    <!-- 新存课表 -->
    <modal v-model="modalAddCrouseTable" :mask-closable="false"  title="新存课表" width="564"
        v-if="isOperation1 === 0" :transfer="false">
        <div style="font-size:14px;">
            <div style="font-size:14px;margin-bottom:6px">课表名称:</div>
            <i-input v-model="scheduleName" style="width:100%;" />
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalAddCrouseTable=false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="addCrouseSubmit">保存</Button>
        </div>
    </modal>
  </div>
</template>
<script>
  export default {
    components: {
    },
    name: 'GradeSchedule',
    data () {
      return {
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        isOperation1: this.$store.state.csmstimetable.classComValKW.base.isOperation1,
        sloverResultCollectionID: 0,
        showScheduleName: '',
        category: [{ bg: 'rgba(38, 195, 108, 0.9)', text: '可调' }, { bg: '#4196FF', text: '同课程/已选中' }],
        coursePlanTableID: 0, // 班级id
        checkbox: false,
        modalAddCrouseTable: false,
        scheduleName: '',
        sectionList: ['1节', '2节', '3节', '4节',
                      '5节', '6节', '7节', '8节',
                      '9节', '10节', '11节', '12节'],
        zaoData: ['早1', '早2'],
        wanData: ['晚1', '晚2', '晚3', '晚4'],
        scheduleData: [],
        leftTable: [],
        rightCourseFrame: '',
        isActive1: false, // 整块互换是否已选
        isActive2: false, // 单科互换/叠加是否已选
        isActive3: false, // 删除
        exchange: 0,
        data1: [],
        data2: [],
        data3: [],
        rightCurSubject: '',
        equalCurSubject: '', // 当前点击的课程
        selectSubjectID: -99, // 当前点击的课程
        leftCurSubject: '',
        isShowWeekend: false
      }
    },
    created () {
      if (this.$store.state.csmstimetable.manualAdjust.sloverResultCollectionID !== 0) { // 发布课表页面过来的课表id
        this.sloverResultCollectionID = this.$store.state.csmstimetable.manualAdjust.sloverResultCollectionID
      }
      if (this.$store.state.csmstimetable.manualAdjust.sloverResultCollectionName !== '') { // 发布课表页面过来的课表名称
        this.$parent.showScheduleName = this.$store.state.csmstimetable.manualAdjust.showScheduleName
      }

      if (this.isOperation1 === 0) {
        this.exchange = 1
      }
    },
    computed: {
      info () {
        return this.$store.state.common.menuInfo
      }
    },
    watch: {
      info: {
        handler (val) {
          this.sloverResultCollectionID = this.$store.state.csmstimetable.manualAdjust.sloverResultCollectionID
          this.$parent.showScheduleName = this.$store.state.csmstimetable.manualAdjust.showScheduleName
          this.getClassTableTime()
        },
        deep: true,
        immediate: true
      }
    },
    mounted () {
      // this.getClassTableTime()
    },
    methods: {
      // 获取节次数据
      async getClassTableTime () {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetClassTableTimeAll`, params, true)
        if (res.success) {
          let resData = res.data
          this.scheduleData = []
          for (let i = 0; i < resData.length; i++) {
            resData[i].map((item) => {
              item.isCanChange = false
              return item
            })
            if (resData[i][0].AMorPM === 'MS') {
              this.scheduleData.push({
                sectionName: this.zaoData[resData[i][0].Order],
                weekList: resData[i],
                isRest: 0
              })
              continue
            };
            if (resData[i][0].AMorPM === 'AB') {
              this.scheduleData.push({
                sectionName: '',
                // sectionName: '上午大课间',
                weekList: resData[i],
                isRest: 1
              })
              continue
            };
            if (resData[i][0].AMorPM === 'NS') {
              this.scheduleData.push({
                sectionName: '午休',
                weekList: resData[i],
                isRest: 1
              })
              continue
            };
            if (resData[i][0].AMorPM === 'PB') {
              this.scheduleData.push({
                sectionName: '',
                // sectionName: '下午大课间',
                weekList: resData[i],
                isRest: 1
              })
              continue
            };
            if (resData[i][0].AMorPM === 'ES') {
              this.scheduleData.push({
                sectionName: this.wanData[resData[i][0].Order],
                weekList: resData[i],
                isRest: 0
              })
              continue
            };
            this.scheduleData.push({
              sectionName: this.sectionList[resData[i][0].Order],
              weekList: resData[i],
              isRest: 0
            })
          }
          this.getTimeTable(this.sloverResultCollectionID)
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        }
      },
      // 获取课表数据
      async getTimeTable (sloverResultCollectionID) {
        this.selectSubjectID = -99
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: sloverResultCollectionID,
          sloverResultCollectionName: this.scheduleName,
          coursePlanTableID: this.coursePlanTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverResult/GetTimeTable`, params)
        this.xy.unloading()
        if (res.success) {
          this.leftTable = res.data.Result
          let resultData = res.data.Result
          for (let i = 0; i < resultData.length; i++) {
            let str = resultData[i].TeacherNames.join(',')
            this.leftTable[i]['teacherNameStr'] = str
          }
          this.rightCourseFrame = res.data.InvalidResult
          this.sloverResultCollectionID = res.data.SloverResultCollectionID
          this.$store.commit('csmstimetable/changeManualAdjust', {
            sloverResultCollectionID: res.data.SloverResultCollectionID,
            showScheduleName: this.$store.state.csmstimetable.manualAdjust.showScheduleName
          })
          this.equalCurSubject = ''// 重置相同课程显示背景颜色
          this.selectSubjectID = -99
          for (let m = 0; m < this.scheduleData.length; m++) { // 去掉可调课位高亮
            this.scheduleData[m].weekList.map((item) => {
              item.isCanChange = false
              return item
            })
          };
          this.coursePlanTableID = res.data.CoursePlanTable[0].CoursePlanTableID
        }
      },
      // 单课调整
      checkboxChange (val) {
        this.checkbox = val
      },
      // 整块互换、单课叠加等切换
      radioChange () { // 去除可调区域高亮
        this.leftCurSubject = ''
        this.rightCurSubject = ''
        this.data1 = []
        this.data2 = []
        this.data3 = []
        this.isActive2 = false
        this.equalCurSubject = ''
        this.selectSubjectID = -99
        for (let m = 0; m < this.scheduleData.length; m++) {
          this.scheduleData[m].weekList.map((item) => {
            item.isCanChange = false
            return item
          })
        }
      },
      // 查看相同课程
      tdSubjectBtn (crouse, leftOrRight, week, n) {
        this.selectSubjectID = crouse.CoursePlanDetailID
        let isValid = false// 是否是课程框
        let isSingle = false// 是否是单课叠加
        if (leftOrRight === 1) { // 课程矿选中课程
          isValid = true
          this.data2 = []
          if (this.rightCurSubject === crouse.CoursePlanDetailID) {
            this.rightCurSubject = ''
          } else {
            this.rightCurSubject = crouse.CoursePlanDetailID
            this.data2.push(crouse)
          }
        } else {
          if (this.exchange === 2) { // 单课叠加
            isSingle = true
            this.data3 = []
            if (this.leftCurSubject === crouse.CoursePlanDetailID) {
              this.isActive2 = false
              this.leftCurSubject = ''
            } else {
              this.isActive2 = true
              this.leftCurSubject = crouse.CoursePlanDetailID
              this.data3.push({
                SourceDetailID: crouse.CoursePlanDetailID,
                SourceDay: crouse.Day,
                SourceAMorPM: crouse.AMorPM,
                SourceAMorPMOrder: crouse.AMorPMOrder
              })
            }
          }
          if (this.exchange === 1) {
            this.data1 = []
            this.data1.push({
              ClassTableID: this.classTableID,
              SloverResultCollectionID: this.sloverResultCollectionID,
              SourceDetailID: 0,
              SourceDay: n,
              SourceAMorPM: week.AMorPM,
              SourceAMorPMOrder: week.AMorPMOrder
            })
          }
        }
        if (this.equalCurSubject === crouse.AID + crouse.Type) {
          for (let m = 0; m < this.scheduleData.length; m++) {
            this.scheduleData[m].weekList.map((item) => {
              item.isCanChange = false
              return item
            })
          };
          this.data1 = []
          this.equalCurSubject = ''
          this.selectSubjectID = -99
          return false
        }
        this.equalCurSubject = crouse.AID + crouse.Type
        let coursePlanDetailID = 0
        if (this.exchange === 2 || leftOrRight === 1) {
          coursePlanDetailID = crouse.CoursePlanDetailID
        }
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID,
          coursePlanTableID: this.coursePlanTableID,
          coursePlanDetailID: coursePlanDetailID,
          day: crouse.Day,
          amorpm: crouse.AMorPM,
          amorpmOrder: crouse.AMorPMOrder,
          isValid: isValid,
          isSingle: isSingle
        }
        this.xy.get(`${this.$store.state.apiPath}/api/SloverResult/Validation`, params).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            for (let i = 0; i < this.scheduleData.length; i++) {
              this.scheduleData[i].weekList.map((item) => {
                item.isCanChange = false
                return item
              })
              for (let j = 0; j < this.scheduleData[i].weekList.length; j++) {
                for (let k = 0; k < resData.length; k++) {
                  if (this.scheduleData[i].weekList[j].AMorPM === resData[k].AMorPM &&
                    this.scheduleData[i].weekList[j].AMorPMOrder === resData[k].AMorPMOrder &&
                    this.scheduleData[i].weekList[j].Day === resData[k].Day) {
                    this.scheduleData[i].weekList[j].isCanChange = true
                  };
                };
              };
            }
          }
        })
      },
      // table到table的(单科叠加)
      async IntegralSingleSwap (week, day) {
        if (this.data3.length > 0) {
          let data = {
            ClassTableID: this.classTableID,
            SloverResultCollectionID: this.sloverResultCollectionID,
            SourceDetailID: this.data3[0].SourceDetailID,
            SourceDay: this.data3[0].SourceDay,
            SourceAMorPM: this.data3[0].SourceAMorPM,
            SourceAMorPMOrder: this.data3[0].SourceAMorPMOrder,
            TargetDay: day,
            TargetAMorPM: week.AMorPM,
            TargetAMorPMOrder: week.AMorPMOrder
          }
          // 验证课位课程冲突信息（目标课位验证）
          let isSingle = false// 是否是单课叠加
          if (this.exchange === 2) {
            isSingle = true
          }
          let idArr = []
          idArr.push(this.data3[0].SourceDetailID)
          this.xy.loading()
          let params = {
            ClassTableID: this.classTableID,
            SloverResultCollectionID: this.sloverResultCollectionID,
            CoursePlanTableID: this.coursePlanTableID,
            SourceDetails: idArr,
            SourceDay: this.data3[0].SourceDay,
            SourceAMorPM: this.data3[0].SourceAMorPM,
            SourceAMorPMOrder: this.data3[0].SourceAMorPMOrder,
            TargetDay: day,
            TargetAMorPM: week.AMorPM,
            TargetAMorPMOrder: week.AMorPMOrder,
            IsCourseFrame: false, // 是否是课程框
            IsSingle: isSingle // 是否是单向调整
          }
          var res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/Verification`, params, true)
          this.xy.unloading()
          if (res.success) {
            this.SingleCourseSuperposition(data)
          } else {
            let that = this
            that.$Modal.confirm({
              title: '温馨提示',
              content: '<p>' + res.msg + '您确定要强制调整吗？</p>',
              onOk () {
                that.SingleCourseSuperposition(data)
              },
              onCancel () {
                that.leftCurSubject = ''
                that.rightCurSubject = ''
                that.data1 = []
                that.data2 = []
                that.data3 = []
                that.isActive2 = false
                // 去除可调区域高亮
                that.equalCurSubject = ''
                that.selectSubjectID = -99
                for (let m = 0; m < that.scheduleData.length; m++) {
                  that.scheduleData[m].weekList.map((item) => {
                    item.isCanChange = false
                    return item
                  })
                }
              }
            })
          }
        }
      },
      // 选中要调到课表的课程
      singleChange (rightCrouse) {
        this.data2 = []
        if (this.rightCurSubject === rightCrouse.CoursePlanDetailID) {
          this.rightCurSubject = ''
        } else {
          this.rightCurSubject = rightCrouse.CoursePlanDetailID
          this.data2.push(rightCrouse)
        }
      },
      // 课表点击
      tdCrouse (week, day) {
        let that = this
        if (week.IsSelected) { // 课位是否禁止放置课程
          if (this.data2.length > 0) { // 课程框到table
            let data = {
              ClassTableID: this.classTableID,
              SloverResultCollectionID: this.sloverResultCollectionID,
              SourceDetailID: this.data2[0].CoursePlanDetailID,
              TargetDay: day,
              TargetAMorPM: week.AMorPM,
              TargetAMorPMOrder: week.AMorPMOrder
            }
            // 验证课位课程冲突信息（目标课位验证）
            let idArr = []
            idArr.push(this.data2[0].CoursePlanDetailID)
            let isSingle = false// 是否是单课叠加
            if (this.exchange === 2) {
              isSingle = true
            }
            this.xy.loading()
            let params = {
              ClassTableID: this.classTableID,
              SloverResultCollectionID: this.sloverResultCollectionID,
              CoursePlanTableID: this.coursePlanTableID,
              SourceDetails: idArr,
              TargetDay: day,
              TargetAMorPM: week.AMorPM,
              TargetAMorPMOrder: week.AMorPMOrder,
              IsCourseFrame: true, // 是否是课程框
              IsSingle: isSingle // 是否是单向调整
            }
            this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/Verification`, params, true).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.CourseEffective(data)
              } else {
                that.$Modal.confirm({
                  title: '温馨提示',
                  content: '<p>' + res.msg + '您确定要强制调整吗？</p>',
                  onOk () {
                    that.CourseEffective(data)
                  },
                  onCancel () {
                    that.leftCurSubject = ''
                    that.rightCurSubject = ''
                    that.data1 = []
                    that.data2 = []
                    that.data3 = []
                    that.isActive2 = false
                    // 去除可调区域高亮
                    that.equalCurSubject = ''
                    that.selectSubjectID = -99
                    for (let m = 0; m < that.scheduleData.length; m++) {
                      that.scheduleData[m].weekList.map((item) => {
                        item.isCanChange = false
                        return item
                      })
                    }
                  }
                })
              }
            })
          }

          if (this.data3.length > 0) { // table到table的(单科叠加)
            this.IntegralSingleSwap(week, day)
          }
          if (this.data1.length > 0) { // table放table 整块互换
            this.IntegralSwap(week, day)
          }
        }
      },
      // 整块互换
      IntegralSwap (week, day) {
        let that = this
        this.isActive1 = !this.isActive1

        if (this.data1.length === 0) { // 已选
          this.data1.push({
            ClassTableID: this.classTableID,
            SloverResultCollectionID: this.sloverResultCollectionID,
            SourceDetailID: 0,
            SourceDay: day,
            SourceAMorPM: week.AMorPM,
            SourceAMorPMOrder: week.AMorPMOrder
          })
        } else { // 互换
          if (this.data1[0].SourceDay === week.Day &&
            this.data1[0].SourceAMorPM === week.AMorPM &&
            this.data1[0].SourceAMorPMOrder === week.AMorPMOrder) {
            // this.data1 = []
            return false
          } else {
            let data = {
              ClassTableID: this.classTableID,
              SloverResultCollectionID: this.sloverResultCollectionID,
              SourceDetailID: this.data1[0].SourceDetailID,
              SourceDay: this.data1[0].SourceDay,
              SourceAMorPM: this.data1[0].SourceAMorPM,
              SourceAMorPMOrder: this.data1[0].SourceAMorPMOrder,
              TargetDay: day,
              TargetAMorPM: week.AMorPM,
              TargetAMorPMOrder: week.AMorPMOrder
            }
            // 验证课位课程冲突信息（目标课位验证）
            let idArr = []
            // idArr.push(this.data1[0].SourceDetailID);
            let isSingle = false// 是否是单课叠加
            if (this.exchange === 2) {
              isSingle = true
            }
            this.xy.loading()
            let params = {
              ClassTableID: this.classTableID,
              SloverResultCollectionID: this.sloverResultCollectionID,
              CoursePlanTableID: this.coursePlanTableID,
              SourceDetails: idArr,
              SourceDay: this.data1[0].SourceDay,
              SourceAMorPM: this.data1[0].SourceAMorPM,
              SourceAMorPMOrder: this.data1[0].SourceAMorPMOrder,
              TargetDay: day,
              TargetAMorPM: week.AMorPM,
              TargetAMorPMOrder: week.AMorPMOrder,
              IsCourseFrame: false, // 是否是课程框
              IsSingle: isSingle // 是否是单向调整
            }
            this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/Verification`, params, true).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.CourseAdjustment(data)
              } else {
                that.$Modal.confirm({
                  title: '温馨提示',
                  content: '<p>' + res.msg + '您确定要强制调整吗？</p>',
                  onOk () {
                    that.CourseAdjustment(data)
                  },
                  onCancel () {
                    that.leftCurSubject = ''
                    that.rightCurSubject = ''
                    that.data1 = []
                    that.data2 = []
                    that.data3 = []
                    that.isActive2 = false
                    // 去除可调区域高亮
                    that.equalCurSubject = ''
                    that.selectSubjectID = -99
                    for (let m = 0; m < that.scheduleData.length; m++) {
                      that.scheduleData[m].weekList.map((item) => {
                        item.isCanChange = false
                        return item
                      })
                    }
                  }
                })
              }
            })
          }
        }
      },
      // 整块移除、单科移除
      delAll (week, day) {
        let SourceDetails = []
        for (let i = 0; i < this.leftTable.length; i++) {
          if (day === this.leftTable[i].Day &&
            week.AMorPM === this.leftTable[i].AMorPM &&
            week.AMorPMOrder === this.leftTable[i].AMorPMOrder) {
            SourceDetails.push(this.leftTable[i].CoursePlanDetailID)
          }
        };
        if (SourceDetails.length > 0) { // 节次下有课程
          let data = {
            ClassTableID: this.classTableID,
            SloverResultCollectionID: this.sloverResultCollectionID,
            SourceDetailID: 0,
            SourceDay: day,
            SourceAMorPM: week.AMorPM,
            SourceAMorPMOrder: week.AMorPMOrder
          }
          this.CourseInvalid(data)
        } else {
          this.xy.msgError('节次下没有课程。')
        }
      },
      delOne () {
        if (this.exchange === 2) {
          if (this.data3.length > 0) {
            let data = {
              ClassTableID: this.classTableID,
              SloverResultCollectionID: this.sloverResultCollectionID,
              SourceDetailID: this.data3[0].SourceDetailID,
              SourceDay: this.data3[0].SourceDay,
              SourceAMorPM: this.data3[0].SourceAMorPM,
              SourceAMorPMOrder: this.data3[0].SourceAMorPMOrder
            }
            this.CourseInvalid(data)
          }
        }
        if (this.exchange === 1) {
          if (this.data1.length > 0) {
            let week = {
              AMorPM: this.data1[0].SourceAMorPM,
              AMorPMOrder: this.data1[0].SourceAMorPMOrder
            }
            this.delAll(week, this.data1[0].SourceDay)
          }
        }
      },
      // table放table
      async CourseAdjustment (data) { // (整块互换)
        let postData = []
        postData.push({
          ClassTableID: this.classTableID,
          SloverResultCollectionID: data.SloverResultCollectionID,
          CoursePlanTableID: this.coursePlanTableID,
          SourceDetailID: data.SourceDetailID,
          SourceDay: data.SourceDay,
          SourceAMorPM: data.SourceAMorPM,
          SourceAMorPMOrder: data.SourceAMorPMOrder,
          TargetDay: data.TargetDay,
          TargetAMorPM: data.TargetAMorPM,
          TargetAMorPMOrder: data.TargetAMorPMOrder
        })
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/CourseAdjustment`, postData, true)
        if (res.success) {
          this.data1 = []
          this.data2 = []
          this.data3 = []
          this.isActive2 = false
          this.leftCurSubject = ''
          this.rightCurSubject = ''
          this.getTimeTable(this.sloverResultCollectionID)
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        }
      },
      async SingleCourseSuperposition (data) { // (单科叠加)
        this.xy.loading()
        let params = {
          SloverResultCollectionID: data.SloverResultCollectionID,
          SourceDetailID: data.SourceDetailID,
          SourceDay: data.SourceDay,
          SourceAMorPM: data.SourceAMorPM,
          SourceAMorPMOrder: data.SourceAMorPMOrder,
          TargetDay: data.TargetDay,
          TargetAMorPM: data.TargetAMorPM,
          TargetAMorPMOrder: data.TargetAMorPMOrder
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/SingleCourseSuperposition`, params, true)
        if (res.success) {
          this.data1 = []
          this.data2 = []
          this.data3 = []
          this.isActive2 = false
          this.leftCurSubject = ''
          this.rightCurSubject = ''
          this.getTimeTable(this.sloverResultCollectionID)
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        }
      },
      // table放课程框
      async CourseInvalid (data) {
        this.xy.loading()
        let params = {
          ClassTableID: this.classTableID,
          CoursePlanTableID: this.coursePlanTableID,
          SloverResultCollectionID: data.SloverResultCollectionID,
          SourceDetailID: data.SourceDetailID,
          SourceDay: data.SourceDay,
          SourceAMorPM: data.SourceAMorPM,
          SourceAMorPMOrder: data.SourceAMorPMOrder
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/CourseInvalid`, params, true)
        if (res.success) {
          this.data1 = []
          this.data2 = []
          this.data3 = []
          this.getTimeTable(this.sloverResultCollectionID)
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        }
      },
      // 课程框放table
      async CourseEffective (data) {
        this.xy.loading()
        let params = {
          ClassTableID: this.classTableID,
          SloverResultCollectionID: data.SloverResultCollectionID,
          CoursePlanTableID: this.coursePlanTableID,
          SourceDetailID: data.SourceDetailID,
          TargetDay: data.TargetDay,
          TargetAMorPM: data.TargetAMorPM,
          TargetAMorPMOrder: data.TargetAMorPMOrder
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/CourseEffective`, params, true)
        if (res.success) {
          this.rightCurSubject = ''
          this.data2 = []
          this.getTimeTable(this.sloverResultCollectionID)
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        }
      },
      // 新建课表
      creatShedule () {
        if (this.scheduleName === '') {
          this.scheduleName = '课表' + this.xy.timeFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
        }
        this.modalAddCrouseTable = true
      },
      // 保存新建课表
      async addCrouseSubmit () {
        if (this.scheduleName === '') {
          this.xy.msgError('保存失败,请填写课表名。')
          return false
        }
        this.xy.loading()
        let params = {
          ClassTableID: this.classTableID,
          SloverResultCollectionID: this.sloverResultCollectionID,
          SloverResultCollectionName: this.scheduleName
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/CreateTimeTable`, params)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('新建成功。')
          this.$parent.$parent.getGeneralFlows()// 成功后步骤可以点击
          this.modalAddCrouseTable = false
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/manuallyAdjust.less';
  .storage-btn {
    margin-right:60px;
  }
  .cb-btn{
    margin-right: 35px;
  }
  .rg-btn{
    label{
      margin-right: 25px;
    }
  }

  .fix-btn {
    height: 50px;
    position: fixed;
    z-index: 1000;
    line-height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    padding-left: 80px;
    p{
      margin-right:20px;
      .rect{
        display: inline-block;
        width: 20px;
        height: 12px;
        margin-right: 10px;
      }
    }
  }
</style>
