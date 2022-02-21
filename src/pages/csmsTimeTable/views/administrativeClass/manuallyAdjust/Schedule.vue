<!-- 8.手动调整 -->
<template>
  <div class="xy-content-body">
    <div class="schedule-content" >
        <div class="left-schedule">
          <div style="min-width: 830px;">
            <div class="text-center" v-if="showScheduleName !== ''">
                <h1 style="font-size:16px;font-weight:bold" v-cloak>{{showScheduleName}}</h1>
            </div>
            <div class="clearfix" style="padding:0 20px;">
                <div class="fl pr">
                    <Button class="xy-primary"  @click="loadPage">课表分析</Button>
                    <Button class="xy-info"  @click="creatShedule" :disabled="StepsHeader.enableCollections != 0">新存一张课表</Button>
                    <Button class="xy-info"  @click="CheckSetting" :disabled="StepsHeader.enableCollections != 0">校验设置</Button>
                </div>
                <div style="float:left;height:32px;line-height: 32px;margin-left: 20px">
                    <Checkbox v-model="isShowWeekend">周末课表</Checkbox>
                </div>
                <div class="fr pr schedule-icon">
                    <span class="fa-stack" @click="firstSelect('left')">
                        <i class="iconfont">&#xe6f0;</i>
                    </span>
                    <span class="fa-stack" @click="prevSelect('left')">
                        <i class="iconfont">&#xe6a7;</i>
                    </span>
                    <Select v-model="leftSelectVal" class="text-left" @on-change="leftSelectChange" style="width:200px">
                        <Option :value="item.CoursePlanTableID"
                                  v-for="(item,index) in leftSelect"
                                  :key="index" v-cloak>{{item.CoursePlanTableName}}</Option>
                    </Select>
                    <span class="fa-stack" @click="nextSelect('left')">
                        <i class="iconfont">&#xe6a9;</i>
                    </span>
                    <span class="fa-stack" @click="lastSelect('left')">
                        <i class="iconfont">&#xe6f1;</i>
                    </span>
                </div>
            </div>
            <div style="width:100%;margin-top: 10px;">
                <table class="table-content" id="sortableClass" ref="leftSchedule">
                    <thead>
                        <tr>
                            <th width="44px"></th>
                            <th>周一</th>
                            <th>周二</th>
                            <th>周三</th>
                            <th>周四</th>
                            <th>周五</th>
                            <th v-if="isShowWeekend">周六</th>
                            <th v-if="isShowWeekend">周日</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(schedule,i) in scheduleData" :key="i">
                            <td v-cloak>
                                <span v-if="schedule.isRest == 0">{{schedule.sectionName}}</span>
                            </td>
                            <template v-for="(week,n) in schedule.weekList">
                                <td v-if="schedule.isRest == 0"
                                    :key="n"
                                    :data-week-AMorPM="week.AMorPM"
                                    :data-week-AMorPMOrder="week.AMorPMOrder"
                                    :data-week-IsSelected="week.IsSelected"
                                    :data-day="n"
                                    :data-schedule-sectionName="schedule.sectionName"
                                    v-show="(n!=5&&n!=6)||(isShowWeekend)"
                                    class="pr put-td"
                                    :class="!week.IsSelected?'no-cover':''">
                                    <div v-if="week.IsSelected && !week.isCanChange &&(data1.length>0 ||data2.length>0)"
                                      :data-week-AMorPM="week.AMorPM"
                                      :data-week-AMorPMOrder="week.AMorPMOrder"
                                      :data-week-IsSelected="week.IsSelected"
                                      :data-day="n"
                                      :data-schedule-sectionName="schedule.sectionName"
                                      class="td-box-no put-td 1"></div>
                                    <div v-if="week.IsSelected && week.isCanChange"
                                      :data-week-AMorPM="week.AMorPM"
                                      :data-week-AMorPMOrder="week.AMorPMOrder"
                                      :data-week-IsSelected="week.IsSelected"
                                      :data-day="n"
                                      :data-schedule-sectionName="schedule.sectionName"
                                      class="td-box put-td 2"></div>
                                    <template v-for="(leftCrouse,lIndex) in leftTable">
                                      <div class="td-class adjust-subject"
                                          v-if="n == leftCrouse.Day && week.AMorPM == leftCrouse.AMorPM && week.AMorPMOrder == leftCrouse.AMorPMOrder"
                                          :key="lIndex"
                                          :data-week-AMorPM="week.AMorPM"
                                          :data-week-AMorPMOrder="week.AMorPMOrder"
                                          :data-day="n"
                                          :data-schedule-sectionName="schedule.sectionName"
                                          :style="{'z-index':100-week.AMorPMOrder}"
                                          @click.stop="leftSchedul(leftCrouse,week,n,schedule)"
                                          :class="curSubjectID.indexOf(leftCrouse.CoursePlanDetailID) != -1?'select-move-crouse':(equalCurSubject.indexOf(leftCrouse.AID+leftCrouse.Type) != -1?'select-equal-crouse':'')">
                                          <!-- <div class="left-line"></div> -->
                                          <div class="left-sub" :class="week.IsSelected && week.isCanChange?'font-white':''">
                                              <h5 class="nowrap"
                                                  :title="leftCrouse.SubjectName"
                                                  v-cloak>
                                                  {{leftCrouse.SubjectName}}
                                              </h5>
                                              <p class="crouse-teacher-name nowrap"
                                              v-if="leftCrouse.TeacherNames.length ==1"
                                              :title="leftCrouse.showTeacher"
                                              @click.stop="tableTeacherChange(leftCrouse,0)" v-cloak>{{leftCrouse.showTeacher}}</p>
                                              <div class="pr teacher-list"
                                                  @click.stop="leftShowTeacher(leftCrouse)"
                                                  v-if="leftCrouse.TeacherNames.length > 1">
                                                  <div class="nowrap teac-name" v-cloak style="width:77px;"
                                                      :title="leftCrouse.showTeacher">{{leftCrouse.showTeacher}}</div>
                                                  <Icon type="ios-arrow-down" class="teacher-icon" v-if="!leftCrouse.isShowMore" />
                                                  <Icon type="ios-arrow-up" class="teacher-icon" v-if="leftCrouse.isShowMore" />
                                                  <ul class="left-teacher-ul" v-if="leftCrouse.isShowMore">
                                                      <li v-for="(teacherName,teacherIndex) in leftCrouse.TeacherNames"
                                                          :key="teacherIndex"
                                                          @click.stop="tableTeacherChange(leftCrouse,teacherIndex)">
                                                          <label v-cloak>{{teacherName}}</label>
                                                      </li>
                                                  </ul>
                                              </div>
                                          </div>
                                          <!-- <Icon type="md-close" class="td-del-btn" @click.stop="delAll(week,n,schedule)" /> -->
                                      </div>
                                    </template>
                                </td>
                            </template>
                            <td class="f14" colspan="7" v-if="schedule.isRest == 1" style="font-weight:normal;vertical-align:middle">
                                {{schedule.sectionName}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </div>
        </div>
        <div class="right-content" style="background:#fff;">
          <div class="right-top">
            <RadioGroup v-model="rightType" type="button">
              <Radio label="1">教师课表</Radio>
              <Radio label="2">课程框</Radio>
              <Radio label="3">调课记录</Radio>
            </RadioGroup>
            <div style="text-align: right;flex:1" v-show="rightType == 1">
              <div v-if="rightSelect.length>0">
                <span class="fa-stack" @click="firstSelect('right')">
                    <i class="iconfont">&#xe6f0;</i>
                </span>
                <span class="fa-stack" @click="prevSelect('right')">
                    <i class="iconfont">&#xe6a7;</i>
                </span>
                <AutoComplete class="text-left"
                                style="width:200px"
                                v-model="rightSelectName"
                                icon="ios-arrow-down"
                                @on-focus="autoFocus"
                                @on-change="rightSelectChange"
                                placeholder="请选择老师">
                    <div class="demo-auto-complete-item">
                        <Input v-model="searchTeacherName"
                                icon="ios-search"
                                  @on-change="searchChange(searchTeacherName)"
                                  style="width:96%;display:block;margin:auto" />
                        <div style="height:200px;overflow:auto">
                            <Option v-for="(option,oIndex) in rightOptionList" :key="oIndex" :value="option.TeacherID">
                                <span class="demo-auto-complete-title">{{option.TeacherName}}</span>
                            </Option>
                        </div>

                    </div>
                </AutoComplete>
                <span class="fa-stack" @click="nextSelect('right')">
                    <i class="iconfont">&#xe6a9;</i>
                </span>
                <span class="fa-stack" @click="lastSelect('right')">
                    <i class="iconfont">&#xe6f1;</i>
                </span>
              </div>
            </div>
          </div>
          <!-- <div class="teacher-type">
              <span @click="rightType=1" :class="rightType == 1?'teacher-type-active':''">教师课表</span>
              <span @click="rightType=2" :class="rightType == 2?'teacher-type-active':''">课程框</span>
              <span @click="rightType=3" :class="rightType == 3?'teacher-type-active':''">调课记录</span>
          </div> -->
          <!-- 教师课表 -->
          <div class="teacher-schedule" v-show="rightType == 1" s>
              <table class="teacher-table" v-if="rightSectionList.length>0">
                  <thead>
                      <tr>
                          <th width="28px"></th>
                          <th>周一</th>
                          <th>周二</th>
                          <th>周三</th>
                          <th>周四</th>
                          <th>周五</th>
                          <th v-if="isShowWeekend">周六</th>
                          <th v-if="isShowWeekend">周日</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(rightSection,rlIndex) in rightSectionList" :key="rlIndex">
                          <td>
                            <span v-if="rightSection.AMorPM != 'AB'&&rightSection.AMorPM != 'PB'&&rightSection.AMorPM != 'NS'">
                              {{rightSection.AMorPMOrderName}}
                            </span>
                          </td>
                          <template v-for="(item,index) in rightSection.IsProhibitTime">
                            <td :key="index" v-if="rightSection.AMorPM != 'AB'&&rightSection.AMorPM != 'PB'&&rightSection.AMorPM != 'NS'"
                              v-show="(index!=5&&index!=6)||(isShowWeekend)"
                              :style="{'background':item?'rgba(207, 82, 0,0.1)':''}">
                              <template  v-for="(rightTableCrouse,rIndex) in rightTable">
                                  <div class="crouse-class"
                                      v-if="rightSection.AMorPM == rightTableCrouse.AMorPM && index == rightTableCrouse.Day && rightSection.AMorPMOrder == rightTableCrouse.AMorPMOrder"
                                      :key="rIndex">
                                      <p class="nowrap" :title="rightTableCrouse.SubjectName" v-cloak>{{rightTableCrouse.SubjectName}}</p>
                                      <p class="rightClassTabel" @click="clickRightClass(rightTableCrouse)" :title="rightTableCrouse.CoursePlanTableName" v-cloak >{{rightTableCrouse.CoursePlanTableName}}</p>
                                  </div>
                              </template>
                            </td>
                          </template>
                          <td colspan="7" v-if="rightSection.AMorPM == 'AB'||rightSection.AMorPM == 'PB'||rightSection.AMorPM == 'NS'" style="font-weight:normal;vertical-align:middle">
                              {{rightSection.AMorPMOrderName}}
                          </td>
                      </tr>
                  </tbody>
              </table>
              <!--暂无数据-->
              <div v-if="rightSectionList.length==0" class="no-data-box" >
                  <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" />
                  <span class="no-data-text">
                      暂无教师课表。
                  </span>
              </div>
          </div>
          <!-- 课程框 -->
          <div class="box-schedule" v-show="rightType == 2">
              <ul class="box-ul" v-if="rightCourseFrame.length>0">
                  <li v-for="(rightCrouse,n) in rightCourseFrame"
                      :key="n"
                      :data-CoursePlanDetailID="rightCrouse.CoursePlanDetailID"
                      :data-CoursePlanTableName="rightCrouse.CoursePlanTableName"
                      :data-SubjectName="rightCrouse.SubjectName"
                      :data-Day="rightCrouse.Day"
                      :data-AMorPM="rightCrouse.AMorPM"
                      :data-AMorPMOrder="rightCrouse.AMorPMOrder"
                      @click="singleChange(rightCrouse)"
                      class="right-subject box-ul-li"
                      :class="curSubjectID.indexOf(rightCrouse.CoursePlanDetailID) != -1 ?'select-move-crouse':(equalCurSubject.indexOf(rightCrouse.AID+rightCrouse.Type) != -1?'select-equal-crouse':'')">
                      <div class="box-li-line"></div>
                      <div style="width: calc(100% - 24px)">
                          <p class="nowrap" v-cloak>{{rightCrouse.SubjectName}}</p>
                          <p class="nowrap" :title="rightCrouse.TeacherNames" v-cloak>{{rightCrouse.TeacherNames}}</p>
                      </div>
                  </li>
              </ul>
              <!--暂无数据-->
              <div v-if="rightCourseFrame.length==0" class="no-data-box" >
                  <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" />
                  <span class="no-data-text">
                      暂无课程。
                  </span>
              </div>
          </div>
          <!-- 调课记录 -->
          <div class="box-record" v-show="rightType == 3">
              <ul class="record-ul" v-if="recordData.length>0">
                  <li v-for="(item,index) in recordData" :key="index">
                      <Icon type="ios-repeat" size="18" class="swap-icon" />
                      <div class="week-subject-teacher">
                          <div class="record-class" v-cloak>
                              <span>{{item.className}}</span>
                              <tooltip max-width="300" placement="top" theme="light"
                                        v-show="item.UnionCoursePlanTableName.length>0">
                                  <Icon type="ios-alert-outline" size="20" color="#4196ff"/>
                                  <div slot="content">
                                      <div v-for="(unionCourse,uIndex) in item.UnionCoursePlanTableName"
                                          :key="uIndex"
                                            style="margin-bottom:10px;line-height:1;">
                                          <h3>{{unionCourse.className}}</h3>
                                          <div style="display:flex;align-items:center">
                                              <span class="" style="display:inline-block">{{unionCourse.from}}</span>
                                              <Icon type="md-repeat" size="18" color="#4196ff" style="vertical-align: initial;" />
                                              <span class="" style="display:inline-block">{{unionCourse.to}}</span>
                                          </div>
                                      </div>
                                  </div>
                              </tooltip>
                          </div>
                          <p v-cloak>
                              <span class="nowrap" style="max-width:40%;display:inline-block" :title="item.from">{{item.from}}</span>

                              <Icon type="md-repeat" size="18" color="#4196ff" style="vertical-align: initial;" />
                              <span class="nowrap" style="max-width:40%;display:inline-block" :title="item.to">{{item.to}}</span>
                          </p>
                      </div>
                      <Icon type="ios-trash" size="18" class="del-icon" @click="clearRecord(index)" />
                  </li>
              </ul>
              <!--暂无数据-->
              <div v-if="recordData.length==0" class="no-data-box">
                  <img class="no-data-img" :src="require('@/assets/common/nullData.svg')"/>
                  <span class="no-data-text">
                      暂无调课记录。
                  </span>
              </div>
          </div>
        </div>
    </div>
   <div class="fix-btn">
     <p v-for='(item,index) in category' :key='index'>
       <span :style="{background:item.bg}" class="rect"></span>
      <span>{{item.text}}</span>
     </p>
    </div>
    <!-- 新存课表 -->
    <Modal v-model="modalAddCrouseTable"
      :closable="false"
      title="新存课表"
      width="564"
      :transfer="false">
      <div style="font-size:14px;">
          <div style="font-size:14px;margin-bottom:6px">课表名称:</div>
          <Input v-model="scheduleName" maxlength="40" style="width:100%;" />
      </div>
      <div slot="footer">
          <Button class="xy-modal-close" @click="modalAddCrouseTable = false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="addCrouseSubmit">确定</Button>
      </div>
    </Modal>
    <!-- 校验设置 -->
  <Modal  v-model="checkSetModal"
          :closable="false"
          width="564"
          :transfer="false">
      <div slot="header">
        <div class="Check-setting">
          <div class="setting-header">
            <span>校验设置</span>
            <span>离开手动调整页面清除已设置的校验规则</span>
          </div>
        </div>
      </div>
      <div class="Check-setting">
        <div class="setting-body">
            <div class="lable-line">
              <label>校验：</label>
              <Checkbox class="lable-select" v-model="IsBidirectionalVerification">双向校验</Checkbox>
            </div>
            <div class="lable-line">
              <label>课程：</label>
              <div class="lable-select">
                <Checkbox v-model="IsCourseMutex">课程互斥</Checkbox>
                <Checkbox v-model="IsRepeatCourse">重复课程</Checkbox>
                <Checkbox v-model="IsCourseMust">课程必须</Checkbox>
                <Checkbox v-model="IsCourseProhibit">课程禁止</Checkbox>
              </div>
            </div>
            <div class="lable-line">
              <label>教师：</label>
              <div class="lable-select">
                <Checkbox v-model="IsTeacherMutex">教师必须</Checkbox>
                <Checkbox v-model="IsTeacherProhibit">教师禁止</Checkbox>
                <Checkbox v-model="IsTeacherVerif">教师冲突</Checkbox>
              </div>
            </div>
            <div class="lable-line">
              <label>教室：</label>
              <div class="lable-select">
                <Checkbox v-model="IsHouseVerif">教室冲突</Checkbox>
              </div>
            </div>
            <div class="lable-line">
              <label>其他：</label>
              <div class="lable-select">
                <Checkbox v-model="IsUnion">合班规则</Checkbox>
              </div>
            </div>
        </div>
      </div>
      <div slot="footer">
          <Button class="xy-modal-close" @click="checkSetModal = false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="checkSetModal = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import 'jquery-ui/ui/widgets/draggable'
  import 'jquery-ui/ui/widgets/droppable'

  export default {
    data () {
      return {
        category: [{ bg: '#F7F7F7', text: '不可调' }, { bg: 'rgba(38, 195, 108, 0.9)', text: '可调' }, { bg: '#4196FF', text: '同课程/已选中' }],
        StepsHeader: {},
        classPlan: {},
        weekList: [
          { text: '星期一' },
          { text: '星期二' },
          { text: '星期三' },
          { text: '星期四' },
          { text: '星期五' },
          { text: '星期六' },
          { text: '星期日' }
        ],
        leftSelect: [],
        leftSelectVal: '',
        leftTable: [],
        rightSelect: [],
        rightOptionList: [],
        rightSelectID: 0,
        rightSelectName: '',
        searchTeacherName: '', // 下拉中模糊搜索
        rightCourseFrame: '',
        rightTable: [],
        GetTimeTable: [],
        sloverResultCollectionID: 0,
        scheduleName: '',
        showScheduleName: '', // 发布启用页面过来的课表名称
        modalAddCrouseTable: false,
        rightSectionList: [],
        sectionList: ['1节', '2节', '3节', '4节',
                      '5节', '6节', '7节', '8节',
                      '9节', '10节', '11节', '12节'],
        zaoData: ['早1', '早2'],
        wanData: ['晚1', '晚2', '晚3', '晚4'],
        scheduleData: [],
        recordData: [], // 调动记录
        curDate: this.xy.moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        exchange: '1',
        data1: [],
        equalCurSubject: [], // 当前点击的课程
        curSubjectID: '', // 当前点击的课程的ID
        index1: -1,
        isActive1: false, // 整块互换是否已选
        isActive2: false, // 删除
        data2: [],
        rightCurSubject: '', // 课程框选中的课程
        rightType: '1', // 1教师课表、2课程框、3调课记录;
        isShowWeekend: false,
        zIndex: 10,
        // 移除到课程框的课程
        delSubject: {},
        // 校验设置
        checkSetModal: false,
        IsBidirectionalVerification: true,
        IsCourseMutex: true,
        IsRepeatCourse: true,
        IsCourseMust: true,
        IsCourseProhibit: true,
        IsTeacherMutex: true,
        IsTeacherProhibit: true,
        IsTeacherVerif: true,
        IsHouseVerif: true,
        IsUnion: true
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.StepsHeader.liData.map((item) => {
        item.isActive = false
        return item
      })
      this.StepsHeader.liData[7].isActive = true
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      if (this.$route.query.IDPre > 0) {
        this.sloverResultCollectionID = Number(this.$route.query.IDPre)
      };
      if (this.$route.query.NamePre !== '') {
        this.showScheduleName = this.$route.query.NamePre
      };
      // this.getClassTableTime()
      // if (this.sloverResultCollectionID > 0) {
      //   this.getTeachers()
      // }
    },
    computed: {
      info () {
        return this.$store.state.common.menuInfo
      }
    },
    watch: {
      leftTable () {
        this.$nextTick(() => {
          // table拖动
          $('.xy-content-module .adjust-subject').draggable({
            scroll: false,
            revert: true,
            appendTo: '.table-content',
            helper: 'clone',
            start: (event, ui) => {
              let Dom = $(event.target)
              this.zIndex++
              // Dom.css('z-index', this.zIndex)
              let week = {
                Day: Number(Dom.attr('data-day')),
                AMorPM: Dom.attr('data-week-AMorPM'),
                AMorPMOrder: Number(Dom.attr('data-week-AMorPMOrder'))
              }
              let day = Number(Dom.attr('data-day'))
              let scheduleSectionName = Dom.attr('data-schedule-sectionName')
              if (this.StepsHeader.enableCollections === 0) {
                let className = ''
                let from1 = ''
                let from2 = ''
                let SourceDetails = []
                for (let i = 0; i < this.leftTable.length; i++) {
                  if (day === this.leftTable[i].Day &&
                    week.AMorPM === this.leftTable[i].AMorPM &&
                    week.AMorPMOrder === this.leftTable[i].AMorPMOrder) {
                    SourceDetails.push(this.leftTable[i].CoursePlanDetailID)
                    className = this.leftTable[i].CoursePlanTableName
                    from1 = this.weekList[this.leftTable[i].Day].text + scheduleSectionName
                    if (from2 === '') {
                      from2 = this.leftTable[i].SubjectName
                    } else {
                      from2 = from2 + ',' + this.leftTable[i].SubjectName
                    }
                  }
                };
                this.data1 = []
                this.data2 = []
                this.rightCurSubject = ''
                this.data1.push({
                  className: className,
                  from: from1 + from2,
                  to: '',
                  SourceDetailID: SourceDetails,
                  SourceDay: day,
                  SourceAMorPM: week.AMorPM,
                  SourceAMorPMOrder: week.AMorPMOrder
                })
              }
              // 移除到课程框的课程
              this.delSubject = {
                week: week,
                day: day,
                schedule: {
                  sectionName: scheduleSectionName
                }
              }
              // event.stopPropagation()
            },
            stop: function (event, ui) {
              // $(this).css('background', 'transparent');
              // event.stopPropagation()
            }
          })
          // 课程框拖动
          $('.xy-content-module .right-subject').draggable({
            scroll: false,
            revert: true,
            appendTo: 'body',
            helper: 'clone',
            start: (event, ui) => {
              let Dom = $(event.target)
              this.zIndex++
              // Dom.css('z-index', 100)
              let rightCrouse = {
                CoursePlanDetailID: Number(Dom.attr('data-CoursePlanDetailID')),
                CoursePlanTableName: Dom.attr('data-CoursePlanTableName'),
                SubjectName: Dom.attr('data-SubjectName'),
                Day: Number(Dom.attr('data-Day')),
                AMorPM: Dom.attr('data-week-AMorPM'),
                AMorPMOrder: Number(Dom.attr('data-week-AMorPMOrder'))

              }
              if (this.rightCurSubject === rightCrouse.CoursePlanDetailID) {
                this.rightCurSubject = ''
                this.data2 = []
              } else {
                this.rightCurSubject = rightCrouse.CoursePlanDetailID
                let className = rightCrouse.CoursePlanTableName
                let from = '课程框' + rightCrouse.SubjectName
                this.data2 = []
                this.data1 = []
                this.data2.push({
                  className: className,
                  from: from,
                  to: '',
                  SourceDetailID: rightCrouse.CoursePlanDetailID,
                  SourceDay: rightCrouse.Day,
                  SourceAMorPM: rightCrouse.AMorPM,
                  SourceAMorPMOrder: rightCrouse.AMorPMOrder
                })
              };
            },
            stop: function (event, ui) {
              // event.stopPropagation()
            }
          })
          // 放置再table
          $('.xy-content-module .put-td').droppable({
            drop: (event, ui) => {
              let Dom = $(event.target)
              let week = {
                AMorPM: Dom.attr('data-week-AMorPM'),
                AMorPMOrder: Number(Dom.attr('data-week-AMorPMOrder')),
                IsSelected: Dom.attr('data-week-IsSelected')
              }
              let day = Number(Dom.attr('data-day'))
              let schedule = {
                sectionName: Dom.attr('data-schedule-sectionName')
              }
              this.tdCrouse(week, day, schedule)
            }
          })
          // 放置课程框
          $('.xy-content-module .box-schedule').droppable({
            drop: (event, ui) => {
              console.log('放置课程框')
              this.delAll(this.delSubject.week, this.delSubject.day, this.delSubject.schedule)
            }
          })
        })
      },
      info: {
        handler (val) {
          this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
          this.sloverResultCollectionID = Number(this.$route.query.IDPre)
          this.showScheduleName = this.$route.query.NamePre
          this.getClassTableTime()
          if (this.sloverResultCollectionID > 0) {
            this.getTeachers()
          }
        },
        deep: true,
        immediate: true
      }
    },
    mounted: function () {
    },
    methods: {
      // 获取节次数据
      async getClassTableTime () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableTime/GetClassTableTimeAll`, {
          classTableID: this.classPlan.classTableID
        })
        this.xy.unloading()
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
                type: resData[i][0].AMorPM,
                isRest: 0
              })

              continue
            };
            if (resData[i][0].AMorPM === 'AB') {
              this.scheduleData.push({
                sectionName: '上午大课间',
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
                sectionName: '下午大课间',
                weekList: resData[i],
                isRest: 1
              })
              continue
            };
            if (resData[i][0].AMorPM === 'ES') {
              this.scheduleData.push({
                sectionName: this.wanData[resData[i][0].Order],
                weekList: resData[i],
                type: resData[i][0].AMorPM,
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
          this.getTimeTable(this.sloverResultCollectionID, 0)// 获取课表数据
        }
      },
      // 获取课表数据
      async getTimeTable (sloverResultCollectionID, coursePlanTableID) {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverResult/GetTimeTable`, {
          classTableID: this.classPlan.classTableID,
          sloverResultCollectionID: sloverResultCollectionID,
          sloverResultCollectionName: this.scheduleName,
          coursePlanTableID: coursePlanTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.GetTimeTable = res.data
          if (this.leftSelect.length === 0) {
            this.leftSelect = res.data.CoursePlanTable
          }
          if (this.leftSelectVal === '') {
            if (coursePlanTableID === 0) {
              this.leftSelectVal = res.data.CoursePlanTable[0].CoursePlanTableID
            } else {
              this.leftSelectVal = coursePlanTableID
            }
          };
          res.data.Result.map((item) => {
            if (item.TeacherIDs.length > 1) {
              item.selectTeacherID = item.TeacherIDs[0]
            } else {
              item.selectTeacherID = 0
            }
            return item
          })
          for (let m = 0; m < res.data.Result.length; m++) {
            this.$set(res.data.Result[m], 'isShowMore', false)
            this.$set(res.data.Result[m], 'showTeacher', res.data.Result[m].TeacherNames[0])
          }
          this.leftTable = res.data.Result

          this.rightCourseFrame = res.data.InvalidResult
          if (this.sloverResultCollectionID === 0) {
            this.getTeachers()// 获取教师列表
          }
          this.sloverResultCollectionID = res.data.SloverResultCollectionID

          this.equalCurSubject = []// 重置相同课程显示背景颜色
          this.curSubjectID = []// 去掉课程高亮选中的效果
          for (let i = 0; i < this.scheduleData.length; i++) { // 去掉可调课位高亮
            this.scheduleData[i].weekList.map((item) => {
              item.isCanChange = false
              return item
            })
          };
          this.$nextTick(() => {
            if (this.leftTable.length > 0) {
              $('.teacher-schedule').css('height', this.$refs.leftSchedule.offsetHeight + 'px')
              $('.box-schedule').css('height', (this.$refs.leftSchedule.offsetHeight - 50) + 'px')
              $('.box-record').css('height', (this.$refs.leftSchedule.offsetHeight - 50) + 'px')
            };
          })
        }
      },
      // 获取教师列表
      async getTeachers () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverResult/GetTeachers`, {
          classTableID: this.classPlan.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID
        })
        this.xy.unloading()
        if (res.success) {
          this.rightSelect = []
          for (let i = 0; i < res.data.TeacherIDs.length; i++) {
            this.rightSelect.push({
              TeacherID: res.data.TeacherIDs[i],
              TeacherName: res.data.TeacherNames[i]
            })
            this.rightOptionList.push({
              TeacherID: res.data.TeacherIDs[i],
              TeacherName: res.data.TeacherNames[i]
            })
          };
          if (this.rightSelect.length > 0) {
            this.rightSelectID = this.rightSelect[0].TeacherID
            this.rightSelectName = this.rightSelect[0].TeacherName
          }

          this.getTeacherTimeTable()// 获取右侧教师课表
        }
      },
      // 获取右侧教师课表
      async getTeacherTimeTable () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverResult/GetTeacherTimeTable`, {
          classTableID: this.classPlan.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID,
          teacherID: this.rightSelectID
        })
        this.xy.unloading()
        if (res.success) {
          this.rightSectionList = res.data.Times
          this.rightSectionList.map((item, index) => {
            if (item.AMorPM === 'MS') {
              item.AMorPMOrderName = this.zaoData[item.Order]
            };
            if (item.AMorPM === 'AM' || item.AMorPM === 'PM') {
              item.AMorPMOrderName = this.sectionList[item.Order]
            };
            if (item.AMorPM === 'ES') {
              item.AMorPMOrderName = this.wanData[item.Order]
            };
            return item
          })
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
      // 左侧select
      leftSelectChange (val) {
        this.isActive1 = false
        this.data1 = []
        this.data2 = []
        this.rightCurSubject = ''
        this.getTimeTable(this.sloverResultCollectionID, val)
      },

      // 左侧课表中老师点击
      leftShowTeacher (val) {
        val.isShowMore = !val.isShowMore
      },
      tableTeacherChange (leftCrouse, teacherIndex) {
        leftCrouse.showTeacher = leftCrouse.TeacherNames[teacherIndex]
        leftCrouse.isShowMore = false
        this.rightType = '1'
        console.log(leftCrouse.TeacherIDs)
        console.log(leftCrouse.TeacherIDs[teacherIndex])
        this.rightSelectChange(Number(leftCrouse.TeacherIDs[teacherIndex]))
      },
      // 右侧select
      rightSelectChange (val) {
        if (val !== undefined) {
          let name = ''
          this.rightSelect.map((item) => {
            if (item.TeacherID === val) {
              name = item.TeacherName
            }
          })
          this.rightSelectID = val
          this.searchTeacherName = ''
          this.getTeacherTimeTable()// 获取右侧教师课表
          setTimeout(() => {
            this.rightSelectName = name
          })
          // this.rightSelectName = name
        }
      },
      autoFocus () {
        this.rightOptionList = this.rightSelect
      },
      searchChange (val) {
        this.rightOptionList = this.rightSelect.filter((item) => {
          if (item.TeacherName.indexOf($.trim(val)) !== -1) {
            return item
          }
        })
      },
      filterMethod (value, option) {
        return option.indexOf(value) !== -1
      },
      // 教师课表 点击班级
      clickRightClass (val) {
        var index = this.leftSelect.map((item) => { return item.CoursePlanTableID }).indexOf(val.CoursePlanTableID)
        if (index > -1) {
          this.leftSelectVal = val.CoursePlanTableID
          this.leftSelectChange(val.CoursePlanTableID)
        } else {
          this.xy.msgError('暂无数据，所选班级未添加到当前方案中。')
        }
      },
      // 图标点击触发select
      firstSelect (leftOrRight) {
        if (leftOrRight === 'left') {
          let index = this.leftSelect.map((item) => { return item.CoursePlanTableID }).indexOf(this.leftSelectVal)
          if (index - 1 >= 0) {
            this.getTimeTable(this.sloverResultCollectionID, this.leftSelect[0].CoursePlanTableID)
            this.leftSelectVal = this.leftSelect[0].CoursePlanTableID
          } else {
            this.xy.msgError('已到第一个。')
          }
        } else {
          let index = this.rightSelect.map((item) => { return item.TeacherID }).indexOf(this.rightSelectID)
          if (index - 1 >= 0) {
            this.rightSelectID = this.rightSelect[0].TeacherID

            this.rightSelectName = this.rightSelect[0].TeacherName
            this.getTeacherTimeTable()
          } else {
            this.xy.msgError('已到第一个。')
          }
        }
      },
      prevSelect (leftOrRight) {
        if (leftOrRight === 'left') {
          let index = this.leftSelect.map((item) => { return item.CoursePlanTableID }).indexOf(this.leftSelectVal)
          if (index - 1 >= 0) {
            this.getTimeTable(this.sloverResultCollectionID, this.leftSelect[index - 1].CoursePlanTableID)
            this.leftSelectVal = this.leftSelect[index - 1].CoursePlanTableID
          } else {
            this.xy.msgError('已到第一个。')
          }
        } else {
          let index = this.rightSelect.map((item) => { return item.TeacherID }).indexOf(this.rightSelectID)
          if (index - 1 >= 0) {
            this.rightSelectID = this.rightSelect[index - 1].TeacherID

            this.rightSelectName = this.rightSelect[index - 1].TeacherName
            this.getTeacherTimeTable()
          } else {
            this.xy.msgError('已到第一个。')
          }
        }
      },
      nextSelect (leftOrRight) {
        if (leftOrRight === 'left') {
          let index = this.leftSelect.map((item) => { return item.CoursePlanTableID }).indexOf(this.leftSelectVal)
          if (index + 1 !== this.leftSelect.length) {
            this.getTimeTable(this.sloverResultCollectionID, this.leftSelect[index + 1].CoursePlanTableID)
            this.leftSelectVal = this.leftSelect[index + 1].CoursePlanTableID
          } else {
            this.xy.msgError('已到最后一个。')
          }
        } else {
          let index = this.rightSelect.map((item) => { return item.TeacherID }).indexOf(this.rightSelectID)
          if (index + 1 !== this.rightSelect.length) {
            this.rightSelectID = this.rightSelect[index + 1].TeacherID

            this.rightSelectName = this.rightSelect[index + 1].TeacherName
            this.getTeacherTimeTable()
          } else {
            this.xy.msgError('已到最后一个。')
          }
        }
      },
      lastSelect (leftOrRight) {
        if (leftOrRight === 'left') {
          let index = this.leftSelect.map((item) => { return item.CoursePlanTableID }).indexOf(this.leftSelectVal)
          if (index + 1 < this.leftSelect.length) {
            this.getTimeTable(this.sloverResultCollectionID, this.leftSelect[this.leftSelect.length - 1].CoursePlanTableID)
            this.leftSelectVal = this.leftSelect[this.leftSelect.length - 1].CoursePlanTableID
          } else {
            this.xy.msgError('已到最后一个。')
          }
        } else {
          let index = this.rightSelect.map((item) => { return item.TeacherID }).indexOf(this.rightSelectID)
          if (index + 1 !== this.rightSelect.length) {
            this.rightSelectID = this.rightSelect[this.rightSelect.length - 1].TeacherID
            this.rightSelectName = this.rightSelect[this.rightSelect.length - 1].TeacherName
            this.getTeacherTimeTable()
          } else {
            this.xy.msgError('已到最后一个。')
          }
        }
      },
      // 新建课表
      creatShedule: function () {
        if (this.StepsHeader.enableCollections === 0) {
          if (this.scheduleName === '') {
            this.scheduleName = '课表' + this.xy.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          }
          this.modalAddCrouseTable = true
        }
      },
      // 保存新建课表
      async addCrouseSubmit () {
        if (this.scheduleName === '') {
          this.xy.msgError('保存失败,请填写课表名。')
          return false
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/CreateTimeTable`, {
          ClassTableID: this.classPlan.classTableID,
          SloverResultCollectionID: this.sloverResultCollectionID,
          SloverResultCollectionName: this.scheduleName
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('新建成功。')
          this.scheduleName = ''
          this.StepsHeader.getGeneralFlows()// 成功后步骤可以点击
          this.modalAddCrouseTable = false
        } else {
          this.scheduleName = '课表' + this.xy.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };
      },

      // 课表分析
      loadPage () {
        this.$store.commit('common/getParam', {
          IDPre: this.sloverResultCollectionID,
          NamePre: this.showScheduleName
        })
        this.$router.push({
          path: '/xyhome/administrativeStepHeader/administrativeScheduleAnalysis',
          query: this.$store.state.common.menuInfo
        })
        console.log(this.$store.state.common.menuInfo)
      },

      // adjustSchedule (row) {
      //   this.$store.commit('common/getParam', {
      //     IDPre: row.SloverResultCollectionID,
      //     NamePre: row.SloverResultCollectionName
      //   })
      //   this.$router.push({
      //     path: '/xyhome/administrativeStepHeader/administrativeSchedule',
      //     query: this.$store.state.common.menuInfo
      //   })
      // },

      // 清除记录
      clearRecord (index) {
        if (this.StepsHeader.enableCollections === 0) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要撤销吗',
            onOk: () => {
              let resData = this.recordData
              let clearData = []
              for (let m = resData.length - 1; m >= index; m--) {
                clearData.push({
                  ClassTableID: this.classPlan.classTableID,
                  SloverResultCollectionID: resData[m].SloverResultCollectionID,
                  CoursePlanTableID: resData[m].CoursePlanTableID,
                  SourceDetails: resData[m].SourceDetailID,
                  SourceDay: resData[m].TargetDay,
                  SourceAMorPM: resData[m].TargetAMorPM,
                  SourceAMorPMOrder: resData[m].TargetAMorPMOrder,
                  TargetDay: resData[m].SourceDay,
                  TargetAMorPM: resData[m].SourceAMorPM,
                  TargetAMorPMOrder: resData[m].SourceAMorPMOrder,
                  Status: resData[m].toWhere
                })
              }
              this.clearRecordHttp(clearData, index)
            }
          })
        }
      },
      async clearRecordHttp (clearData, index) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/RevokeCourse`, clearData)
        this.xy.unloading()
        if (res.success) {
          let num = this.recordData.length - index
          this.recordData.splice(index, num)
          this.data1 = []
          this.data2 = []
          this.rightCurSubject = ''
          this.getTimeTable(this.sloverResultCollectionID, this.leftSelectVal)
        }
      },
      // 课程框点击
      singleChange (rightCrouse) {
        if (this.StepsHeader.enableCollections === 0) {
          // if (this.rightCurSubject === rightCrouse.CoursePlanDetailID) {
          //   this.rightCurSubject = ''
          //   this.data2 = []
          // } else {
          //   this.rightCurSubject = rightCrouse.CoursePlanDetailID
          //   let className = rightCrouse.CoursePlanTableName
          //   let from = '课程框' + rightCrouse.SubjectName
          //   this.data2 = []
          //   this.data1 = []
          //   this.data2.push({
          //     className: className,
          //     from: from,
          //     to: '',
          //     SourceDetailID: rightCrouse.CoursePlanDetailID,
          //     SourceDay: rightCrouse.Day,
          //     SourceAMorPM: rightCrouse.AMorPM,
          //     SourceAMorPMOrder: rightCrouse.AMorPMOrder
          //   })
          // };
          this.equalSubjectBtn(rightCrouse, 'right', '', '')
        }
      },
      // 课表点击
      leftSchedul (leftCrouse, week, day, schedule) {
        if (this.StepsHeader.enableCollections === 0) {
          // let className = ''
          // let from1 = ''
          // let from2 = ''
          // let SourceDetails = []
          // for (let i = 0; i < this.leftTable.length; i++) {
          //   if (day === this.leftTable[i].Day &&
          //     week.AMorPM === this.leftTable[i].AMorPM &&
          //     week.AMorPMOrder === this.leftTable[i].AMorPMOrder) {
          //     SourceDetails.push(this.leftTable[i].CoursePlanDetailID)
          //     className = this.leftTable[i].CoursePlanTableName
          //     from1 = this.weekList[this.leftTable[i].Day] + schedule.sectionName
          //     if (from2 === '') {
          //       from2 = this.leftTable[i].SubjectName
          //     } else {
          //       from2 = from2 + ',' + this.leftTable[i].SubjectName
          //     }
          //   }
          // };
          // this.data1 = []
          // this.data2 = []
          // this.rightCurSubject = ''
          // this.data1.push({
          //   className: className,
          //   from: from1 + from2,
          //   to: '',
          //   SourceDetailID: SourceDetails,
          //   SourceDay: day,
          //   SourceAMorPM: week.AMorPM,
          //   SourceAMorPMOrder: week.AMorPMOrder
          // })
          console.log(this.data1)
          this.equalSubjectBtn(leftCrouse, 'left', week, day)
        }
      },
      // 查看相同课程
      async equalSubjectBtn (crouse, leftOrRight, week, day) {
        if (this.equalCurSubject.indexOf(crouse.AID + crouse.Type) !== -1) { // 取消
          for (let m = 0; m < this.scheduleData.length; m++) {
            this.scheduleData[m].weekList.map((item) => {
              item.isCanChange = false
              return item
            })
          };
          this.equalCurSubject = []
          this.curSubjectID = []
          this.data1 = []
          this.data2 = []
          this.rightCurSubject = ''
          return false
        }
        let coursePlanDetailID = 0// 课程id
        let AMorPM = ''
        let isValid = false// 是否是课程框
        if (leftOrRight === 'left') { // 选中
          this.equalCurSubject = []
          this.curSubjectID = []
          for (let i = 0; i < this.leftTable.length; i++) {
            if (day === this.leftTable[i].Day &&
              week.AMorPM === this.leftTable[i].AMorPM &&
              week.AMorPMOrder === this.leftTable[i].AMorPMOrder) {
              this.equalCurSubject.push(this.leftTable[i].AID + this.leftTable[i].Type)
              this.curSubjectID.push(this.leftTable[i].CoursePlanDetailID)
              AMorPM = this.leftTable[i].AMorPM
            }
          };
        }
        if (leftOrRight === 'right') { // 选中
          this.equalCurSubject = []
          this.curSubjectID = []
          isValid = true
          coursePlanDetailID = crouse.CoursePlanDetailID
          this.equalCurSubject.push(crouse.AID + crouse.Type)
          this.curSubjectID.push(crouse.CoursePlanDetailID)
        }

        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/ValidationNew20191227`, {
          ClassTableID: this.classPlan.classTableID,
          SloverResultCollectionID: this.sloverResultCollectionID,
          CoursePlanTableID: this.leftSelectVal,
          CoursePlanDetailID: coursePlanDetailID,
          Day: crouse.Day,
          Amorpm: AMorPM,
          AmorpmOrder: crouse.AMorPMOrder,
          IsValid: isValid,
          IsSingle: false, // 是否是单课叠加
          IsBidirectionalVerification: this.IsBidirectionalVerification,
          IsCourseMutex: this.IsCourseMutex,
          IsRepeatCourse: this.IsRepeatCourse,
          IsCourseMust: this.IsCourseMust,
          IsCourseProhibit: this.IsCourseProhibit,
          IsTeacherMutex: this.IsTeacherMutex,
          IsTeacherProhibit: this.IsTeacherProhibit,
          IsTeacherVerif: this.IsTeacherVerif,
          IsHouseVerif: this.IsHouseVerif,
          IsUnion: this.IsUnion
        })
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          for (let i = 0; i < this.scheduleData.length; i++) {
            this.scheduleData[i].weekList.map(function (item) {
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
          };
        }
      },
      // to课表
      async tdCrouse (week, day, schedule) {
        if (this.StepsHeader.enableCollections === 0) {
          if (week.IsSelected) { // 课位是否禁止放置课程
            if (this.data2.length > 0) { // 课程框--课表
              let SourceDetails = []
              SourceDetails.push(this.data2[0].SourceDetailID)
              let TargetDetails = []
              for (let i = 0; i < this.leftTable.length; i++) {
                if (day === this.leftTable[i].Day &&
                  week.AMorPM === this.leftTable[i].AMorPM &&
                  week.AMorPMOrder === this.leftTable[i].AMorPMOrder) {
                  TargetDetails.push(this.leftTable[i].CoursePlanDetailID)
                }
              };
              let data = {
                className: this.data2[0].className,
                from: this.data2[0].from,
                to: this.weekList[day].text + '第' + schedule.sectionName,
                ClassTableID: this.classPlan.classTableID,
                SloverResultCollectionID: this.sloverResultCollectionID,
                SourceDetailID: SourceDetails,
                TargetDay: day,
                TargetAMorPM: week.AMorPM,
                TargetAMorPMOrder: week.AMorPMOrder
              }
              // 验证课位课程冲突信息（目标课位验证）
              this.xy.loading()
              let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/CPVerification`, {
                ClassTableID: this.classPlan.classTableID,
                CoursePlanTableID: this.leftSelectVal,
                SloverResultCollectionID: this.sloverResultCollectionID,
                SourceDetails: SourceDetails,
                SourceDay: -1,
                SourceAMorPM: -1,
                SourceAMorPMOrder: -1,
                TargetDetails: TargetDetails,
                TargetDay: day,
                TargetAMorPM: week.AMorPM,
                TargetAMorPMOrder: week.AMorPMOrder,
                IsCourseFrame: true
              }, true)
              // this.xy.unloading()
              if (res.success) {
                this.CourseEffective(data)
              } else {
                this.xy.unloading()
                this.$Modal.confirm({
                  title: '温馨提示',
                  content: '<p>' + res.msg + '</p>',
                  onOk: () => {
                    this.data2 = []
                    this.rightCurSubject = ''
                    this.equalCurSubject = []// 重置相同课程显示背景颜色
                    this.curSubjectID = []// 去掉课程高亮选中的效果
                    for (let i = 0; i < this.scheduleData.length; i++) { // 去掉可调课位高亮
                      this.scheduleData[i].weekList.map((item) => {
                        item.isCanChange = false
                        return item
                      })
                    };
                    this.xy.loading()
                    this.CourseEffective(data, 1)
                  }
                })
              };
            };
            if (this.data1.length > 0) { // 课表--课表
              let to1 = ''
              let to2 = ''
              let TargetDetails = []
              for (let i = 0; i < this.leftTable.length; i++) {
                if (day === this.leftTable[i].Day &&
                  week.AMorPM === this.leftTable[i].AMorPM &&
                  week.AMorPMOrder === this.leftTable[i].AMorPMOrder) {
                  TargetDetails.push(this.leftTable[i].CoursePlanDetailID)
                  to1 = this.weekList[day].text + schedule.sectionName
                  if (to2 === '') {
                    to2 = this.leftTable[i].SubjectName
                  } else {
                    to2 = to2 + ',' + this.leftTable[i].SubjectName
                  }
                }
              };
              if (to1 === '' && to2 === '') {
                to1 = this.weekList[day].text + schedule.sectionName
              };
              let data = {
                className: this.data1[0].className,
                from: this.data1[0].from,
                to: to1 + to2,
                ClassTableID: this.classPlan.classTableID,
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
              this.xy.loading()
              let res1 = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/CPVerification`, {
                ClassTableID: this.classPlan.classTableID,
                CoursePlanTableID: this.leftSelectVal,
                SloverResultCollectionID: this.sloverResultCollectionID,
                SourceDetailID: this.data1[0].SourceDetailID, // id已经是数组了
                SourceDay: this.data1[0].SourceDay,
                SourceAMorPM: this.data1[0].SourceAMorPM,
                SourceAMorPMOrder: this.data1[0].SourceAMorPMOrder,
                TargetDetails: TargetDetails,
                TargetDay: day,
                TargetAMorPM: week.AMorPM,
                TargetAMorPMOrder: week.AMorPMOrder,
                IsCourseFrame: false
              }, true)
              // this.xy.unloading()
              if (res1.success) {
                this.CourseAdjustment(data, 1)
              } else {
                this.xy.unloading()
                this.$Modal.confirm({
                  title: '温馨提示',
                  content: '<p>' + res1.msg + '</p>',
                  onOk: () => {
                    this.data1 = []
                    this.equalCurSubject = []// 重置相同课程显示背景颜色
                    this.curSubjectID = []// 去掉课程高亮选中的效果
                    for (let i = 0; i < this.scheduleData.length; i++) { // 去掉可调课位高亮
                      this.scheduleData[i].weekList.map((item) => {
                        item.isCanChange = false
                        return item
                      })
                    };
                    this.xy.loading()
                    this.CourseAdjustment(data, 1)
                  }
                })
              };
            }
          }
        }
      },
      // 课表--框
      delAll (week, day, schedule) {
        if (this.StepsHeader.enableCollections === 0) {
          let className = ''
          let from1 = ''
          let from2 = ''
          let SourceDetails = []
          for (let i = 0; i < this.leftTable.length; i++) {
            if (day === this.leftTable[i].Day &&
              week.AMorPM === this.leftTable[i].AMorPM &&
              week.AMorPMOrder === this.leftTable[i].AMorPMOrder) {
              SourceDetails.push(this.leftTable[i].CoursePlanDetailID)
              className = this.leftTable[i].CoursePlanTableName
              from1 = this.weekList[this.leftTable[i].Day].text + schedule.sectionName
              if (from2 === '') {
                from2 = this.leftTable[i].SubjectName
              } else {
                from2 = from2 + ',' + this.leftTable[i].SubjectName
              }
            }
          };
          if (SourceDetails.length > 0) { // 节次下有课程
            if (from1 === '' && from2 === '') {
              from1 = this.weekList[day].text + schedule.sectionName
            };
            let data = {
              className: className,
              from: from1 + from2,
              to: '课程框',
              ClassTableID: this.classPlan.classTableID,
              SloverResultCollectionID: this.sloverResultCollectionID,
              SourceDetailID: SourceDetails,
              SourceDay: week.Day,
              SourceAMorPM: week.AMorPM,
              SourceAMorPMOrder: week.AMorPMOrder
            }
            this.delSubject = {}
            this.CourseInvalid(data, 1)
          }
        }
      },
      // table放table
      async CourseAdjustment (data, type) {
        let postData = []
        postData.push({
          CoursePlanTableID: this.leftSelectVal,
          ClassTableID: data.ClassTableID,
          SloverResultCollectionID: data.SloverResultCollectionID,
          SourceDay: data.SourceDay,
          SourceAMorPM: data.SourceAMorPM,
          SourceAMorPMOrder: data.SourceAMorPMOrder,
          TargetDay: data.TargetDay,
          TargetAMorPM: data.TargetAMorPM,
          TargetAMorPMOrder: data.TargetAMorPMOrder
        })
        // this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/CourseAdjustment`, postData)
        // this.xy.unloading()
        if (res.success) {
          let resData = res.data
          if (type !== 0) {
            let UnionCoursePlanTableName = []
            let obj = {}
            if (resData.SourceList.length >= resData.TargetList.length) {
              for (let j = 0; j < resData.SourceList.length; j++) {
                let Target = resData.TargetList.filter((item) => {
                  if (item.CoursePlanTableID === resData.SourceList[j].CoursePlanTableID) {
                    return item
                  }
                })
                let fromInfo = resData.SourceName
                resData.SourceList[j].Data.map((item) => {
                  fromInfo += item.SubjectName
                  return item
                })
                let toInfo = resData.TargetName
                if (Target.length > 0) {
                  Target[0].Data.map((item) => {
                    toInfo += item.SubjectName
                    return item
                  })
                  if (resData.SourceList[j].Adjustment) { // 当前班级
                    obj = {
                      className: resData.SourceList[j].CoursePlanTableName,
                      from: fromInfo,
                      to: toInfo
                    }
                  } else { // 合班班级
                    UnionCoursePlanTableName.push({
                      className: resData.SourceList[j].CoursePlanTableName,
                      from: fromInfo,
                      to: toInfo
                    })
                  }
                } else {
                  if (resData.SourceList[j].Adjustment) { // 当前班级
                    obj = {
                      className: resData.SourceList[j].CoursePlanTableName,
                      from: fromInfo,
                      to: toInfo
                    }
                  } else { // 合班班级
                    UnionCoursePlanTableName.push({
                      className: resData.SourceList[j].CoursePlanTableName,
                      from: fromInfo,
                      to: toInfo
                    })
                  }
                }
              }
            } else {
              for (let j = 0; j < resData.TargetList.length; j++) {
                let Source = resData.SourceList.filter((item) => {
                  if (item.CoursePlanTableID === resData.TargetList[j].CoursePlanTableID) {
                    return item
                  }
                })
                let fromInfo = resData.SourceName

                let toInfo = resData.TargetName
                resData.TargetList[j].Data.map((item) => {
                  toInfo += item.SubjectName
                  return item
                })
                if (Source.length > 0) {
                  Source[0].Data.map((item) => {
                    fromInfo += item.SubjectName
                    return item
                  })
                  if (resData.TargetList[j].Adjustment) { // 当前班级
                    obj = {
                      className: resData.TargetList[j].CoursePlanTableName,
                      from: fromInfo,
                      to: toInfo
                    }
                  } else { // 合班班级
                    UnionCoursePlanTableName.push({
                      className: resData.TargetList[j].CoursePlanTableName,
                      from: fromInfo,
                      to: toInfo
                    })
                  }
                } else {
                  if (resData.TargetList[j].Adjustment) { // 当前班级
                    obj = {
                      className: resData.TargetList[j].CoursePlanTableName,
                      from: fromInfo,
                      to: toInfo
                    }
                  } else { // 合班班级
                    UnionCoursePlanTableName.push({
                      className: resData.TargetList[j].CoursePlanTableName,
                      from: fromInfo,
                      to: toInfo
                    })
                  }
                }
              }
            }
            this.recordData.push({
              curDate: this.xy.moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              className: obj.className,
              from: obj.from,
              to: obj.to,
              toWhere: 1,
              CoursePlanTableID: this.leftSelectVal,
              ClassTableID: this.classPlan.classTableID,
              SloverResultCollectionID: this.sloverResultCollectionID,
              SourceDetailID: data.SourceDetailID,
              SourceDay: data.SourceDay,
              SourceAMorPM: data.SourceAMorPM,
              SourceAMorPMOrder: data.SourceAMorPMOrder,
              TargetDay: data.TargetDay,
              TargetAMorPM: data.TargetAMorPM,
              TargetAMorPMOrder: data.TargetAMorPMOrder,
              UnionCoursePlanTableName: UnionCoursePlanTableName
            })
          }
          this.data1 = []
          this.getTimeTable(this.sloverResultCollectionID, this.leftSelectVal)
        }
      },
      // table放课程框
      async CourseInvalid (data, type) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/CourseInvalid`, {
          CoursePlanTableID: this.leftSelectVal,
          ClassTableID: data.ClassTableID,
          SloverResultCollectionID: data.SloverResultCollectionID,
          SourceDay: data.SourceDay,
          SourceAMorPM: data.SourceAMorPM,
          SourceAMorPMOrder: data.SourceAMorPMOrder
        })
        // this.xy.unloading()
        if (res.success) {
          if (type !== 0) {
            this.recordData.push({
              curDate: this.xy.moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              className: data.className,
              from: data.from,
              to: data.to,
              toWhere: 2,
              CoursePlanTableID: this.leftSelectVal,
              ClassTableID: this.classPlan.classTableID,
              SloverResultCollectionID: this.sloverResultCollectionID,
              SourceDetailID: data.SourceDetailID,
              SourceDay: data.SourceDay,
              SourceAMorPM: data.SourceAMorPM,
              SourceAMorPMOrder: data.SourceAMorPMOrder,
              UnionCoursePlanTableName: []
            })
          }
          this.leftTable = []
          this.getTimeTable(this.sloverResultCollectionID, this.leftSelectVal)
        }
      },
      // 课程框放table
      async CourseEffective (data, type) {
        // this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResult/CourseEffectiveList`, {
          CoursePlanTableID: this.leftSelectVal,
          ClassTableID: data.ClassTableID,
          SloverResultCollectionID: data.SloverResultCollectionID,
          SourceDetails: data.SourceDetailID,
          SourceDay: -1,
          SourceAMorPM: -1,
          SourceAMorPMOrder: -1,
          TargetDay: data.TargetDay,
          TargetAMorPM: data.TargetAMorPM,
          TargetAMorPMOrder: data.TargetAMorPMOrder
        })
        // this.xy.unloading()
        if (res.success) {
          if (type !== 0) {
            this.recordData.push({
              curDate: this.xy.moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              className: data.className,
              from: data.from,
              to: data.to,
              toWhere: 3,
              CoursePlanTableID: this.leftSelectVal,
              ClassTableID: this.classPlan.classTableID,
              SloverResultCollectionID: this.sloverResultCollectionID,
              SourceDetailID: data.SourceDetailID,
              TargetDay: data.TargetDay,
              TargetAMorPM: data.TargetAMorPM,
              TargetAMorPMOrder: data.TargetAMorPMOrder,
              UnionCoursePlanTableName: []
            })
          }
          this.rightCurSubject = ''
          this.data2 = []
          this.getTimeTable(this.sloverResultCollectionID, this.leftSelectVal)
        }
      },
      // 校验设置
      CheckSetting () {
        this.checkSetModal = !this.checkSetModal
      }
    }
  }
</script>
<style lang="less" scoped>
.schedule-content{
    display:flex;
    justify-content:space-around;
}
.left-schedule {
    /*width: calc(100% - 500px);*/
    overflow: auto;
    background: #fff;
    padding: 13px 0 100px;
    // border: 1px solid #E5E5E5;
    border-radius: 6px;
    flex:1;
    margin-bottom: 40px;
}
.left-schedule .teacher-list .teac-name{
    cursor: pointer;
    font-size:12px;
}
.select-move-crouse {
  .teac-name,.teacher-icon{
    color: #fff!important;
  }
}
.right-content {
    width: 600px;
    margin-left: 12px;
    // border: 1px solid rgba(229,229,229,1);
    border-radius: 6px;
    // overflow:auto;
    .right-top{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 55px;
    }
}
.teacher-schedule {
    width:100%;
    /*border: 1px solid rgba(229,229,229,1);*/
    border-radius: 6px 6px 0px 0px;
    background:#fff;
    overflow: auto;
}
.teacher-type {
    padding-left: 28px;
    height: 38px;
    line-height: 38px;
    border-bottom: 1px solid #ddd;
}

.teacher-type span {
    margin-right: 30px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(65,150,255,1);
    padding-bottom: 8px;
    cursor: pointer;
}

.teacher-type-active {
    border-bottom: 2px solid #4196FF;
}
.teacher-select {
    height: 33px;
    /*border-top: 1px solid #E5E5E5;*/
    display:flex;
    align-items:center;
    padding-left:16px;
    position:relative;
}
.teacher-select p {
    color: #333333;
    width:90%;
}
.right-title {
    height: 42px;
    line-height: 42px;
    color: #333;
    font-size: 14px;
    font-weight: 400;
    padding-left: 16px;
}
.right-teacher-ul {
    width: 100%;
    position: absolute;
    top: 28px;
    left: 0;
    max-height: 200px;
    overflow: auto;
    margin: 5px 0;
    padding: 5px 0;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    z-index: 900;
}

.right-teacher-ul li {
    margin: 0;
    line-height: normal;
    padding: 7px 16px;
    clear: both;
    color: #515a6e;
    font-size: 12px !important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
}

.right-teacher-ul li:hover {
    background: #f3f3f3;
}
.teacher-table {
    width: 100%;
    height: 100%;
    text-align: center;
    border-bottom: 1px solid #E5E5E5;
}
.teacher-table th {
    height: 48px;
    border-bottom: 1px solid #D8E0EB;
    border-right: 1px solid #D8E0EB;
    background: #F4F5F7;
    text-align: center;
    color: #333;
    font-weight: bold;
}
.teacher-table tbody tr td {
    // height: 48px;
    max-width: 100px;
    min-width: 50px;
    border:1px solid #ddd;
}
.teacher-table tbody tr td:first-child {
    max-width: 30px;
    min-width: 30px;
    color: #444;
    border: none;
    border-right: 1px solid #D8D8D8;
    border-bottom: 1px solid #D8D8D8;
    vertical-align: middle;
    background: #F4F5F7;
}
.teacher-table .crouse-class {
    text-align: left;
    max-width: 100px;
    min-width: 100px;
    padding: 2px;
}
.crouse-class{
.nowrap{
font-weight: bold;
font-size: 14px;
color: rgba(0, 0, 0, 0.9);

}
.rightClassTabel{
  font-weight: bold;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
}
}
.teacher-sub {
    width: 100%;
}
.box-schedule {
    background: #fff;
    /*border: 1px solid rgba(229,229,229,1);*/
    border-radius: 6px 6px 0px 0px;
    margin-top: 10px;
    overflow: auto;
}
.box-ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 8px;
    cursor: pointer;
}
.box-ul-li {
    width:168px;
    padding: 5px;
    height: 44px;
    display: flex;
    align-items: center;
    border: 1px solid rgba(235,235,235,1);
    margin:7px;
}
.box-li-line {
    width: 4px;
    height: 24px;
    background: rgba(65,150,255,0.8);
    margin-right:14px;
}
.box-record {
    background: #fff;
    /*border: 1px solid rgba(229,229,229,1);*/
    border-radius: 6px 6px 0px 0px;
    margin-top: 10px;
    overflow: auto;
}
.record-ul {
    padding: 0 8px;
}
.record-ul li {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    height: 55px;
}
.record-ul li .week-subject-teacher {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(102,102,102,1);
    width:85%;
}

.record-ul li .week-subject-teacher p {
    display:flex;
    align-items:center;
}

.record-ul li .swap-icon {
    width: 22px;
    height: 22px;
    line-height: 22px;
    color: #4196FF;
    border: 1px solid #4196FF;
    border-radius: 50%;
    text-align: center;
    transform: rotate(90deg);
}
.record-ul li .del-icon {
    color: #FE7437;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
}

.record-ul li .del-icon:hover {
    background: rgba(255,229,214,1);
}

.no-cover {
    background: #F6F6F6;
}
.schedule-content .fa-stack {
   line-height: 24px;
    cursor: pointer;
    border-radius: 50%;
    text-align: center;
    // background: #4196FF;
    opacity: 0.3;
    // color: #fff;
    // margin: 0 5px;
    padding: 5px 6px;
}
.fa-stack>.iconfont{
  font-size: 10px;
}
.schedule-content .fa-stack:hover {
    // opacity: 1;
    // color:#fff;
}
.schedule-content i {
    cursor: pointer;
}
.table-content {
    /*border: 1px solid #ddd;*/
    text-align: center;
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 14px;
    width: 100%;
    margin-top: 5px;
}

.table-content tr {
    width: 100%;
    height: 48px;
    text-align: center;
}

.table-content tr th {
    height: 48px;
    border-bottom: 1px solid #D8E0EB;
    // border-left: 1px solid #D8E0EB;
    border-right: 1px solid #D8E0EB;
    background: #F4F5F7;
    text-align: center;
    color: #333;
    font-weight: bold;
}
.table-content tr td {
    text-align: center;
    border-bottom: 1px solid #D8D8D8;
    max-width: 195px;
    min-width: 100px;
    border: 1px solid #D8D8D8;
    vertical-align: top;
}
.table-content tr td:first-child {
    max-width: 44px;
    width: 44px;
    min-width: 44px;
    color: #444;
    border: none;
    border-right: 1px solid #D8D8D8;
    border-bottom: 1px solid #D8D8D8;
    vertical-align: middle;
    background: #F4F5F7;
}
.td-box {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    cursor: pointer;
    // border: 1px dashed #36931B;
    // z-index: 100;
    // background: rgba(218,249,199,0.2);
    background:rgba(38,195,108,0.9);
}
.td-box-no {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    cursor: pointer;
    // z-index: 100;
    background: none;
}
.td-del-btn {
    visibility:hidden;
    color: #B3B3B3;
    font-size: 14px;
    text-align: center;
    margin-right: 3px;
    width: 20px;
    height: 20px;
    line-height: 20px;
}
.td-del-btn:hover {
    background: rgba(255,229,214,1);
    border-radius: 50%;
    color: #FE7C43;
    margin-right: 3px;
}
.td-class {
    text-align: left;
    color: rgba(49,117,202,1);
    min-height: 50px;
    width: 100%;
    height: 52px;
    /*max-width: 220px;*/
    min-width: 100px;
    display: flex;
    align-items: center;
    // border-bottom: 1px solid rgba(232,232,232,0.4);
    position:relative;
    padding: 2px 0;
    // z-index:1;
    max-width: 240px;
    .teac-name,.teacher-icon{
      color:rgba(0,0,0,0.45);
    }
}
.td-class:hover .td-del-btn {
    visibility: visible;
}
.td-class .left-line {
    width: 4px;
    height: 24px;
    background: rgba(65,150,255,0.8);
    margin-left: 4px;
    margin-right: 14px;
}
.td-class h5 {
    font-size: 14px;
    font-weight: 400;
    color:rgba(0,0,0,0.9);
    cursor:pointer;
}
.td-class p {
    font-size: 12px;
    font-weight: 400;
    color:rgba(0,0,0,0.45);
    cursor: pointer;
}
.left-teacher-ul {
    width: 100%;
    position: absolute;
    top: 21px;
    left: -4px;
    max-height: 200px;
    overflow: auto;
    margin: 5px 0;
    padding: 5px 0;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    z-index: 900;
}
.left-teacher-ul li{
    margin: 0;
    line-height: normal;
    padding: 7px 16px;
    clear: both;
    color: #515a6e;
    font-size: 12px !important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    transition: background .2s ease-in-out;
}
.left-teacher-ul li:hover {
    background: #f3f3f3;
}
.right-class {
    background: rgba(49,117,202,0.1);
    color: rgba(49,117,202,1);
    height: 55px;
    width: 140px;
    margin: 5px;
    border: 1px solid #eee;
    border-radius: 4px;
    text-align: left;
    padding-left: 8px;
    padding-top: 4px;
    display: inline-block;
    position: relative !important;
    z-index: 1;
}
.subject-btn {
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background: rgba(54, 115, 255,0.5);
    color: #fff;
    width: 30px;
    cursor: pointer;
    font-size: 12px;
    text-align: center;
    line-height: 26px;
}
.subject-btn.active {
    color: #fff;
    background: rgba(54, 115, 255,0.7);
}
.mr-30 {
    margin-right: 30px;
}
.tdBg{
    background: #edf6ff!important;
    border: 1px solid #b8c9e6 !important;
}
.crouse-table .move-crouse{
    width: 100px;
    height: 70px;
    text-align: center;
    background: #fff;
    border: 1px solid #ececec;
    /*display: inline-block;*/
    border-radius: 4px;
    margin: 3px auto;
    box-shadow: 1px 3px 9px 0px #cfdde6;
    padding: 5px;
}
.move-crouse p{
    margin:5px 0 ;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.right-schedule{
    margin-left:20px;
}
.right-schedule .course-frame{
    min-height: 290px;
    border: 2px dashed #ccc;
    background: #fff;
    width: 100%;
}
.right-schedule .course-frame-text{
    font-size: 24px;
    font-weight: bold;
    color: #eaeaea;
    position: absolute;
    top: 150px;
    left: 50%;
    margin: -17px 0 0 -36px;
    z-index: 0;
}
.right-schedule .move-crouse{
    width: 100px;
    min-height: 64px;
    cursor: pointer;
    text-align: center;
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 4px;
    margin: 3px;
    display: inline-block;
    box-shadow: 1px 3px 9px 0px #cfdde6;
    position:relative !important;
    padding:5px;
    z-index: 1;
}
.select-move-crouse {
    color: #fff;
    background: rgba(73,154,255,1);
    position: relative;
    z-index: 500;
    min-width: 50px;
    .left-sub{
      border: none;
    }
}
.select-move-crouse h5 {
    color: #fff;
}

.select-move-crouse p {
    color: #fff;
}
.select-equal-crouse {
    // background: rgba(231,242,255,1);
    border:1px solid rgba(255,255,255,1);
    background:#4196FF;
    position: relative;
    z-index: 2;
    .teac-name,.teacher-icon{
      color: #fff;
    }
    // .teacher-list:hover{
    //   .teac-name,.teacher-icon{
    //     color: #fff;
    //   }
    // }
}
.select-equal-crouse h5 {
    // color: #357BE8;
    color: #fff;
}

.select-equal-crouse p {
    // color: #357BE8;
    color: #fff;
}
.left-sub{
  width: 98%;
  height: 98%;
  min-width: 50px;
  border: 1px dashed #ffffff;
  margin: 2px auto;
  padding: 2px 8px;
  h5,p{
    font-weight: bold;
  }
  .teac-name{
    font-weight: bold;
  }
}
.font-white{
  position: relative;
  z-index: 1;
  h5,p{
    color: #fff;
  }
}
.schedule-icon .upDown-icon {
    vertical-align: top;
    margin-right: 3px;
    font-size: 28px;
}
.history-record {
    width: 100%;
    margin-top: 8px;
    overflow: auto;
    background: #f9f9f9;
}
.history-record > ul {
    border-bottom: 1px solid #d0d0d0;
}
.history-record > ul > .course-li-box {
    display: block;
    min-height: 80px;
    cursor: pointer;
    border-top: 1px solid #d0d0d0;
    border-bottom: 1px solid #fff;
    padding: 10px 20px 10px 90px;
    position: relative;
    /* background: -webkit-linear-gradient(left,#afd2f1,#4989e3); */
    background: -webkit-linear-gradient(to left,#66cffe,#2b7aeb);
    background: -o-linear-gradient(to right,#66cffe,#2b7aeb);
    background: -ms-linear-gradient(to left,#66cffe,#2b7aeb);
    background: -moz-linear-gradient(to left,#66cffe,#2b7aeb);
    background: linear-gradient(to right,#66cffe,#2b7aeb);
    color: #fff;
}
.history-record > ul > .course-li-box > .record-top {
    display: block;
    font-weight: bold;
    font-size: 17px;
    margin-bottom: 11px;
}
.record-class {
    display: flex;
    align-items:center;
}
.history-record > ul > .course-li-box > .record-top > .record-time {
    display: block;
    font-weight: normal;
    font-size: 14px;
    vertical-align: bottom;
    margin-top: 5px;
}
.history-record > ul > .course-li-box > .fa {
    position: absolute;
    left:0px;
    bottom: -10px;
    font-size: 80px;
    opacity: 0.5;
    transition: all 0.3s;
}
.history-record > ul > .course-li-box:hover .fa{
    opacity: 0.8;
}
.history-record > ul > .course-li-box > .fa:hover{
     opacity: 0.8;
}
.analysis-table{
    width:100%;
    border:1px solid #e8eaec;
    text-align: center;
    cursor: pointer;
    margin: 0 auto;
    border-collapse: collapse;

}
.analysis-table tr th{
    background-color: #f8f8f9;
    border:1px solid #e8eaec;
    padding:10px 10px;
}
.analysis-table tr td{
    border:1px solid #e8eaec;
    padding:10px 10px;
}
.schedule-analysis-content .rule-box{
   border:1px solid #eaeaea;
   min-height:200px;
   margin-left:10px;
}
.schedule-analysis-content .rule-box:first-child{
   margin-left:0;
}
.schedule-analysis-content .rule-box h2{
    background-color: #f8f8f9;
    padding:10px 14px;
    font-size:14px;
}
.schedule-analysis-content .rule-box h2 span{
    font-size: 12px;
    color: #808080;
}
.schedule-analysis-content .rule-box .no-data-time{
    margin: 30px auto 0;
}
.schedule-analysis-content .rule-box .no-data-time i{
    display: block;
    text-align: center;
    font-size: 38px;
    color: #42d456;
}
.schedule-analysis-content .rule-box .no-data-time span{
     display: block;
    text-align: center;
    margin-top: 6px;
    font-size: 14px;
}
.schedule-analysis-content .cms-view-title{
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}
.crouse-name{
    position:relative;
    z-index:99;
    font-weight:bold;
    cursor:pointer;
}
.crouse-teacher-name {
    position: relative;
    z-index: 99;
    height: 21px;
    cursor: pointer;
    width:77px;
}
.teacher-icon {
    position: absolute;
    right: 5px;
    bottom: 3px
}

/*�ֶ�����*/
.vertical-divider{
    width:10px;
    height:100%;
    background:#f5f5f5;
}

/*�α�����*/
.class-table-analysis {
    margin-bottom: 180px;
}

.class-table-analysis-title {
    margin: 20px 0 30px;
}

.class-table-analysis-title > div:nth-child(1) {
    font-size: 20px;
    font-weight: 700;
}

.class-table-analysis-content {
}

.class-table-analysis-ol li {
    width: 688px;
    height: 68px;
    background: rgba(65,150,255,0.1);
    border-radius: 4px;
    margin-bottom:20px;
    padding:10px 18px;
}
.class-table-analysis-ol li .ivu-progress-inner {
    background: #fff;
}

    .class-table-analysis-ol li span {
        margin-right: 10px;
        font-weight: 700;
    }
.ctac-progress {
    width: 560px;
    float: left;
}

.ctac-average li,
.ctac-class-size li {
    float: left;
    width: 140px;
    height: 170px;
    margin: 0px 20px 20px 0px;
}

    .ctac-average li .mark,
    .ctac-class-size li .mark {
        height: 48px;
        line-height: 48px;
        border-radius: 7px 7px 0px 0px;
        color: #fff;
        font-weight: bold;
        text-align: center;
    }

    .ctac-average li .mark {
        background: linear-gradient(90deg,rgba(57,201,197,1) 0%,rgba(21,114,238,1) 100%);
    }

    .ctac-class-size li .mark {
        background: linear-gradient(136deg,rgba(63,43,177,1) 0%,rgba(5,109,217,1) 100%);
    }

    .ctac-average li .class-nums,
    .ctac-class-size li .class-nums {
        height: 122px;
        border-radius: 0px 0px 7px 7px;
        border: 1px solid #eee;
        text-align: center;
    }

        .ctac-average li .class-nums > div:nth-child(1),
        .ctac-class-size li .class-nums > div:nth-child(1) {
            margin: 20px 0px;
        }

            .ctac-average li .class-nums > div:nth-child(1) > b,
            .ctac-class-size li .class-nums > div:nth-child(1) > b {
                font-size: 26px;
                color: #DB4A13;
            }

.ctac-average-btn,
.ctac-class-size-btn {
    width: 100px;
    height: 30px;
    line-height: 30px;
    background: linear-gradient(90deg,rgba(61,50,175,1) 0%,rgba(24,108,212,1) 100%);
    border-radius: 15px;
    color: #fff;
    margin: 0 auto;
}

.class-position-table {
    width: 100%;
}

.class-position-table thead {
    height: 60px;
    line-height: 60px;
    background: linear-gradient(90deg,rgba(57,201,197,1) 0%,rgba(21,114,238,1) 100%);
    color: #fff;
    font-weight: 700;
}

.class-position-table thead tr th {
    border-right: 1px solid #D7DDE2;
}

.class-position-table thead tr th:nth-child(1) {
    border-top-left-radius: 7px;
}

.class-position-table thead tr th:last-child {
    border-top-right-radius: 7px;
    border-right: 0px;
}

.class-position-table tbody tr td {
    border: 1px solid #D8D8D8;
    text-align: center;
    padding: 10px 0px;
}

.analsis-schedule-modal-table {
    width: 100%;
}

    .analsis-schedule-modal-table thead tr th,
    .analsis-schedule-modal-table tbody tr td {
        border: 1px solid #eee;
        text-align: center;
    }
.analysis-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 41px;
    height: 68px;
    line-height: 68px;
    background: rgba(65,150,255,0.1);
    border-radius: 0px 4px 4px 0px;
    cursor: pointer;
    text-align: center;
}
.analysis-icon:hover {
    background: #4196FF;
    color:#fff;
}
.analysis-icon:hover .icons-xiangqing {
    color: #fff!important;
}
.analysis-icon-disable, .analysis-icon-disable:hover {
    background: rgba(154,154,154,0.1);
}
.analysis-icon-disable:hover .icons-xiangqing {
    color: #9A9A9A !important;
}
.view-all-btn {
    width: 77px;
    height: 30px;
    line-height: 30px;
    background: linear-gradient(90deg,rgba(57,201,197,1) 0%,rgba(21,114,238,1) 100%);
    border-radius: 15px;
    text-align: center;
    color: #fff;
}
.modal-max{
    max-height:400px;
    overflow-y:auto;
}
.modal-max ol li{
    line-height:30px;
    font-size:14px;
}
.rightClassTabel {
    word-wrap: break-word;
    word-break: normal;
}
//校验设置1
.Check-setting{
  .setting-header{
    padding:0 20px;
    span:first-child{
      font-size:14px;
      font-weight:bold;
      color:rgba(0,0,0,0.85);
      margin-left: 0;
    }
    span{
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,0.45);
      margin-left: 24px;
    }
  }
  .setting-body{
     padding:20px;
     .lable-line{
       margin-bottom: 20px;
       label{
        margin-right: 10px;
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.85);
       }
       .lable-select{
         display: inline;
         font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.65);
       }
     }
  }
  .setting-footer{
    padding:0 20px;
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
  padding-left: 150px;
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
@media screen and (max-width: 1366px) {
    .td-class {
        max-width: 160px;
    }
}
@media screen and (min-width:1400px) and (max-width:1688px) {
    .td-class {
        max-width: 180px;
    }
}
@media screen and (min-width:1689px) {
    .td-class {
        max-width: 240px;
    }
}
</style>
