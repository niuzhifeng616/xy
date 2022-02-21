<template>
<div class="xy-content-module">
    <div class="xy-content-body" style="margin-bottom:55px;">
        <div class="adjust-box">
            <div class="left-box">
                <div class="clearfix box-top">
                    <div class="fl">
                        <Button class="xy-primary" @click="choseClass" v-if="Object.keys(selectClass).length > 0">选择班级</Button>
                        <Button class="xy-primary" @click="choseTeacherModal" v-if="Object.keys(selectTeacherSub).length > 0">选择教师</Button>
                        <span style="margin:0 10px">有效</span>
                        <Select v-model="sectionCur"
                                  :disabled="isDisabled"
                                  class="xy-content-title-search"
                                  style="width:100px;margin-left:0">
                            <Option v-for="item in sectionData" :value="item.val" :key="item.val">{{item.name}}</Option>
                        </Select>
                        <Select v-model="weekCur"
                                  @on-change="weekChange"
                                  :disabled="isDisabled"
                                  class="xy-content-title-search"
                                  style="width:250px">
                            <Option v-for="item in weekSelectData" :value="item.val"  :key="item.val">{{item.name}}</Option>
                        </Select>
                    </div>
                    <div class="fr">
                        <Checkbox  v-model="isShowWeekend">周末课表</Checkbox >
                        <Checkbox  v-model="isSmallTable">小课表</Checkbox >
                    </div>
                </div>
                <table class="schedule-table" id="sortableClass" v-if="tableTimes.length>0">
                    <thead>
                        <tr>
                            <th colspan="8">
                                <div style="font-size:15px;font-weight:bold"
                                     v-if="Object.keys(selectClass).length > 0" >
                                    {{StudentOrganizationFullName}}
                                </div>
                                <div style="font-size:15px;font-weight:bold"
                                     v-if="Object.keys(selectTeacherSub).length > 0" >
                                    {{StudentOrganizationFullName}}
                                </div>
                            </th>
                        </tr>
                        <tr>
                            <th></th>
                            <th class="th-width"
                                v-for="(week,index) in weekData"
                                :key="index"
                                v-show="(index!=5&&index!=6)||isShowWeekend">
                                <span >{{week.weekName}}</span>
                                <span >{{week.date}}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(time,tIndex) in tableTimes" :key="tIndex">
                            <td  :style="{'height':time.AMorPM == 'NS'?'32px':'','border':time.AMorPM == 'NS'?'none':''}">
                                <span v-if="time.AMorPM != 'NS'"> {{time.AMorPMOrderName}}</span>
                            </td>
                            <td v-for="(week,wIndex) in weekData"
                                :key="wIndex"
                                v-show="(wIndex!=5&&wIndex!=6)||isShowWeekend"
                                :style="{'background': time.AMorPM == 'NS'|| xy.moment(new Date()).diff(xy.moment(week.Date),'days')>0||(time.IsProhibitTime != null&&!time.IsProhibitTime[wIndex]) ?'#f9f9f9' : '','height':time.AMorPM == 'NS'?'32px':'','border':time.AMorPM == 'NS'?'none':''}"
                                :data-AMorPM="time.AMorPM"
                                :data-AMorPMOrder="time.AMorPMOrder"
                                :data-day="wIndex"
                                :data-date="week.Date"
                                :data-isCover="(time.AMorPM == 'NS' ||xy.moment(new Date()).diff(xy.moment(week.Date),'days')>0?'1':'0' )">
                                <template v-for="(data,dataIndex) in tableData">
                                    <div class="adjust-subject pr"
                                       @click.stop="subjectClick(data)"
                                        :style="{'background': data.IsAvailable ? '' : '#F0F0F0' }"
                                        :key="dataIndex"
                                        :data-classTableGenerateBaseID="data.ClassTableGenerateBaseID"
                                        :data-index="dataIndex"
                                        :data-date="week.Date"
                                        :data-IsAvailable="data.IsAvailable?1:0"
                                        v-if="data.AMorPM == time.AMorPM && data.AMorPMOrder == time.AMorPMOrder && data.Day == wIndex"
                                        :class="data.ClassTableGenerateBaseID===oneSubject.ClassTableGenerateBaseID? 'cur-subject':(data.CoursePlanAID===oneSubject.CoursePlanAID&&data.CoursePlanAIDType===oneSubject.CoursePlanAIDType?'select-equal-crouse':'')">
                                        <h5 class="crouse-name"
                                            :data-IsAvailable="data.IsAvailable?1:0"
                                            :data-index="dataIndex">
                                            {{data.SubjectName}}
                                        </h5>
                                        <p class="teacher-name" @click.stop="teacherSunject(data)" >{{data.TeacherInfos}}</p>
                                        <div class="small-triangle" v-if="data.IsAdjustment"></div>
                                    </div>
                                </template>
                                <div v-if="time.IsProhibitTime != null&&time.IsProhibitTime[wIndex]&&oneSubject!=''" class="bg-noadjust"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="rigth-box">
                <div class="box-top text-right pr">
                    <Button class="xy-info" :disabled="isDisabled" @click="acrossWeek">跨周调课</Button>
                    <Button class="xy-info"  @click="isShowRecord=!isShowRecord">
                        调课记录
                        <!-- <Icon type="ios-arrow-down" /> -->
                    </Button>
                    <div class="record-body" v-if="isShowRecord">
                        <h3 class="record-h3" v-if="recordData.length>0">调课记录</h3>
                        <ul class="record-ul" v-if="recordData.length>0">
                            <li class="record-ul-li" v-for="(item,index) in recordData" :key="index">
                                <Icon type="ios-repeat" size="18" class="swap-icon" />
                                <div class="week-subject-teacher">
                                    <div >{{item.StudentOrganizationFullName}}</div>
                                    <div >{{item.SourceInfo}}</div>
                                    <div >{{item.TargetInfo}}</div>
                                </div>
                                <div style="flex:1;text-align:right">
                                    <Icon type="ios-trash" size="18" class="del-icon" @click="clearRecord(item,index)" />
                                </div>
                            </li>
                        </ul>
                        <!--暂无数据-->
                        <div v-if="recordData.length==0" class="no-data-box" >
                            <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" alt=""/>
                            <span class="no-data-text" >暂无调课记录。</span>
                        </div>
                    </div>
                </div>
                <div style="width:540px;overflow:auto;" v-if="teacherData.length>0">
                    <table class="schedule-table">
                        <thead>
                            <tr>
                                <th colspan="8">{{teacherName}}</th>
                            </tr>
                            <tr>
                                <th></th>
                                <th v-for="(week,index) in weekData" :key="index" v-show="(index!=5&&index!=6)||isShowWeekend">
                                    <span >{{week.weekName}}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="time in tableTimes" :key="time">
                                <td  :style="{'height':time.AMorPM == 'NS'?'32px':'','border':time.AMorPM == 'NS'?'none':''}">
                                    <div v-if="time.AMorPM != 'NS'">{{time.AMorPMOrderName}}</div>
                                </td>
                                <td v-for="td in 7" :key="td"
                                    :style="{'background': time.AMorPM == 'NS'? '#f9f9f9' : '','height':time.AMorPM == 'NS'?'32px':'','border':time.AMorPM == 'NS'?'none':''}"
                                    v-show="(td!=6&&td!=7)||isShowWeekend">
                                    <template v-for="(data,dataIndex) in teacherData">
                                       <div class="right-subject"
                                         :class="time.AMorPM == oneSubject.AMorPM && time.AMorPMOrder == oneSubject.AMorPMOrder && td-1 == oneSubject.Day ? 'cur-subject':
                                         data.CoursePlanAID==oneSubject.CoursePlanAID&&data.CoursePlanAIDType==oneSubject.CoursePlanAIDType?'select-equal-crouse':''"
                                          :key="dataIndex"
                                         v-if="data.AMorPM == time.AMorPM && data.AMorPMOrder == time.AMorPMOrder && data.Day == td-1">
                                        <h5  class="crouse-name nowrap" :title="data.SubjectName">{{data.SubjectName}}</h5>
                                        <p class="crouse-name nowrap" :title="data.CoursePlanTableFullName" >{{data.CoursePlanTableFullName}}</p>
                                    </div>
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="teacherData.length==0" class="no-data-box">
                    <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" />
                    <span class="no-data-text">
                        请点击左侧课表中的教师姓名加载被点击教师的课表。
                    </span>
                </div>
            </div>
        </div>
        <!--小课表 -->
        <div class="class-table-name" v-if="isSmallTable">
            <div class="class-tit-name">
                <img :src="require('@/assets/csmsTimeTable/StepsHeaderTit.png')" style="margin-right:10px"/>当前班级本周老师课表
            </div>
            <div class="class-table-box">
                <div v-for="(itemTable,index) in teacherTables" :key="index">
                    <div class="class-table-teacher">
                        {{itemTable.FullName}}
                    </div>
                    <div style="width:424px;height:360px;padding:0 1%;overflow:auto;margin-bottom:20px;">
                        <table class="teacher-small-table" style="height:100%">
                            <thead>
                                <tr>
                                    <th width="12.5%"></th>
                                    <th width="12%" v-for="(week,index) in weekTop" :key="index">{{week.data}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(time,i) in tableTimes"
                                    :key="i"
                                    :style="{'background':time.AMorPM == 'NS' ? '#f3f3f3': ''}">
                                    <td :style="{'padding':time.AMorPM == 'NS' ? '0': ''}"
                                        >
                                        {{ time.AMorPM != 'NS'  ? time.AMorPMOrderName: '' }}
                                    </td>
                                    <td v-for="(week,wIndex) in weekData"
                                        :key="wIndex"
                                        class="pr"
                                        :style="{'background':time.AMorPM == 'NS'? '#f3f3f3': '', 'padding':time.AMorPM == 'NS' ? '0': ''}"
                                        :class="time.AMorPM == oneSubject.AMorPM && time.AMorPMOrder == oneSubject.AMorPMOrder && wIndex == oneSubject.Day ? 'cur-subject': ''">
                                        <template v-for="(data,dataIndex) in itemTable.Data">
                                           <div :key="dataIndex"
                                              :title="data.CourseName"
                                              class="crouse-name nowrap"
                                              v-if="data.AMorPM == time.AMorPM && data.AMorPMOrder == time.AMorPMOrder && data.Day == wIndex">
                                              {{data.CoursePlanTableFullName}}
                                              <div class="small-triangle" v-if="data.IsAdjustment"></div>
                                          </div>
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- 按班级调课 -->
        <Modal v-model="selectClassModal"
               :transfer="false"
               width=600
               :mask-closable="false"
               :closable="false">
            <p slot="header">选择班级</p>
            <Tabs :animated="false">
                <TabPane v-for="item in classData" :key="item" :label="item.SchoolDistrictName">
                    <div class="select-school">
                        <div class="select-grade" v-for="gradeItem in item.YearList" :key="gradeItem">
                            <div class="select-grade-name">{{gradeItem.name}}</div>
                            <span class="select-class"
                                @click="modalSelectClass(item, gradeItem,childclass)"
                                :class="childclass.StudentOrganizationID==selectClass.StudentOrganizationID?'active-class':''"
                                v-for="childclass in gradeItem.classList"
                                :key="childclass">
                                {{childclass.StudentOrganizationName}}
                            </span>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
            <div slot="footer">
                  <Button class="xy-modal-close" @click="selectClassModal = false">取消</Button>
                <Button class="xy-modal-primary" shape="circle" @click="selectClassSubmit">确定</Button>
            </div>
        </Modal>
        <!-- 按教师调课 -->
        <Modal v-model="modalChoseTeacher"
               :mask-closable="false"
               :closable="false"
               width="864"
               :transfer="false">
            <p slot="header">教师课表</p>
            <div style="max-height:600px;min-height:300px;overflow-y:auto">
                <Select v-model="searchTeacher"
                          placeholder="查找教师姓名"
                          filterable
                          remote
                          :remote-method="remoteMethod1"
                          @on-change="teacherChange"
                          style="width:30%;">
                    <Option v-for="(option, index) in optionList" :value="option.UserID" :key="index" >{{option.FullName}}</Option>
                </Select>
                <div v-if="teacherCPTable !=''" style="margin-top:10px;">
                    <table class="table class-table" style="height:100%">
                        <thead>
                            <tr>
                                <th style="width:30px;"></th>
                                <th v-for="week in weekTop" :key="week">
                                    <span >{{week.data}}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(time,i) in teacherCPTable.Times"
                                :key="i"
                                :style="{'background':time.AMorPM == 'NS' ? '#f3f3f3': ''}">
                                <td :style="{'padding':time.AMorPM == 'NS' ? '0': ''}"
                                    >
                                    {{ time.AMorPM != 'NS'  ? i + 1: '' }}
                                </td>
                                <td v-for="(week,wIndex) in weekTop" :key="wIndex">
                                  <template v-for="(subject,dataIndex) in teacherCPTable.TimeTables">
                                    <div class="td-subject"
                                        :class="subject.ClassTableGenerateBaseID==selectTeacherSub.ClassTableGenerateBaseID?'table-sub-active':''"
                                        :key="dataIndex"
                                        @click="modalSelectTeacherSub(subject)"
                                        v-if="subject.AMorPM == time.AMorPM &&subject.AMorPMOrder == time.AMorPMOrder &&subject.Day == wIndex">
                                        <p class="nowrap" :title="subject.SubjectName" >{{subject.SubjectName}}</p>
                                        <p class="nowrap" :title="subject.CoursePlanTableFullName" >{{subject.CoursePlanTableFullName}}</p>
                                    </div>
                                  </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="teacherCPTable ==''" class="modal-null">
                    <img class="img" :src="require('@/assets/common/nullData.svg')" />
                    <span class="text">
                        暂无结果,请选择教师。
                    </span>
                </div>
            </div>
            <div slot="footer">
                <Button class="xy-modal-close" @click="modalChoseTeacher = false">取消</Button>
                <Button class="xy-modal-primary" shape="circle" @click="choseTeacherSubmit">确定</Button>
            </div>
        </Modal>
    </div>
    <div class="adjust-footer" v-if="tableData.length > 0">
        <div style="display:flex;align-items:center;justify-content:flex-start">
            <div style="flex:0.8">
                <span class="color-block" style="background: #F0F0F0;"></span>
                <span class="block-name">不可调</span>
                <span class="color-block" style="background: #64E217;"></span>
                <span class="block-name">可调</span>
                <span class="color-block" style="background:rgba(65,150,255,0.4);"></span>
                <span class="block-name">同课程</span>
                <span class="color-block" style="background: #4196FF;"></span>
                <span class="block-name">选中课程</span>
                <span class="block-name-two"></span>
                <span class="block-name">已调/代课程</span>
            </div>
            <div style="flex:1">
                <Button class="xy-info" @click="cancel" :disabled="!isDisabled">取消调课</Button>
                <Button class="xy-primary" @click="completeSub" :disabled="!isDisabled">完成调课</Button>
            </div>
        </div>
    </div>
</div>
</template>
<script>
  import 'jquery-ui/ui/widgets/draggable'
  import 'jquery-ui/ui/widgets/droppable'
  export default {
    data () {
      return {
        isShowWeekend: false, // 是否显示周六日
        StudentOrganizationFullName: '',
        weekDateName: '',
        weekData: [],
        weekSelectData: [],
        weekCur: '',
        sectionData: [],
        sectionCur: 1,
        tableTimes: [],
        tableData: [],
        recordData: [],
        treeData: [],
        selectTreeNode: '',
        oneSubject: '',
        classTableGenerateForStudentOrganizationID: 0,
        rightFrameData: [],
        isDisabled: false,
        teacherName: '',
        teacherData: [],
        modalClassNotice: false,
        adjustmentReason: '',
        isNotice: false,
        notifyInfoData: [],
        isShowReason: true,
        organizationID: 0,
        isShowRecord: false, // 是否展示调课记录
        // 列表页过来的班级或者教师
        selectClass: {},
        selectTeacherSub: {},
        selectStudentOrganizationID: 0, // 选中的班级id
        SchoolDistrictID: 0,
        zIndex: 10, // 拖动课程的z-index值
        weekCurKey: '', // 周次key
        teacherTables: [],
        isSmallTable: true, // 是否显示小课表
        classTableBaseID: '',
        isGetWeek: true,
        isSelection: false,
        dataDay: '',
        dataAMorPM: '',
        dataAMorPMOrder: '',
        equalCurSubject: null,
        activeTab: '2',
        // 按班级调课
        selectClassModal: false,
        classData: [],
        // 按教师调课
        weekTop: [
          { data: '一' },
          { data: '二' },
          { data: '三' },
          { data: '四' },
          { data: '五' },
          { data: '六' },
          { data: '日' }
        ],
        modalChoseTeacher: false,
        teacherList: [],
        optionList: [],
        searchTeacher: '',
        teacherCPTable: ''
      }
    },
    created () {
      let loadParams = this.$store.state.csmstimetable.adjustTableRow
      console.log(loadParams)
      let isContinue = loadParams.isContinue
      if (isContinue) { // 继续调课
        this.classTableGenerateForStudentOrganizationID = loadParams.classTableGenerateForStudentOrganizationID
        this.selectStudentOrganizationID = loadParams.studentOrganizationID
        this.sectionCur = loadParams.effectiveWeek
        this.weekCurKey = loadParams.sourceWeek
        this.selectClass = loadParams.selectClass
        this.SchoolDistrictID = this.selectClass.SchoolDistrictID
        this.StudentOrganizationFullName = this.selectClass.FullName
        this.isDisabled = true
      } else {
        this.selectClass = loadParams.selectClass
        this.selectTeacherSub = loadParams.selectTeacherSub
        if (Object.keys(this.selectClass).length > 0) { // 按班级
          this.selectStudentOrganizationID = this.selectClass.StudentOrganizationID
          this.SchoolDistrictID = this.selectClass.SchoolDistrictID
          this.StudentOrganizationFullName = this.selectClass.FullName
        }
        if (Object.keys(this.selectTeacherSub).length > 0) { // 按教师
          this.selectStudentOrganizationID = this.selectTeacherSub.StudentOrganizationID
          this.weekCurKey = loadParams.sourceWeek
          this.SchoolDistrictID = this.selectTeacherSub.SchoolDistrictID
          this.SchoolDistrictID = this.selectTeacherSub.SchoolDistrictID
          this.StudentOrganizationFullName = this.selectTeacherSub.CoursePlanTableFullName
        }
      }
      this.getWeek()
    },
    watch: {
      tableData () {
        let that = this
        this.$nextTick(() => {
          let IsAvailable = true// 是否可以调整的课
          // table拖动
          $('#sortableClass tr td div.adjust-subject').draggable({
            scroll: false,
            revert: true,
            start: function (event, ui) {
              that.zIndex++
              $(this).css('z-index', that.zIndex)
              // $(this).css('background', '#fff');
              let index = Number($(this).attr('data-index'))
              IsAvailable = Number($(this).attr('data-IsAvailable'))
              that.oneSubject = ''
              that.oneSubject = that.tableData[index]
              event.stopPropagation()
            },
            stop: function (event, ui) {
              // $(this).css('background', 'transparent');
              event.stopPropagation()
            }
          })
          // 放置再table
          $('#sortableClass tr td').droppable({
            drop: function (event, ui) {
              let newDom = $(event.target)
              let AMorPM = newDom.attr('data-AMorPM')
              let AMorPMOrder = newDom.attr('data-AMorPMOrder')
              let day = newDom.attr('data-day')
              let date = newDom.attr('data-date')
              let isCover = newDom.attr('data-isCover')
              let isPull = 1// 是否有可对调的课程
              if (newDom.find('.adjust-subject').length > 0) {
                isPull = Number(newDom.find('.adjust-subject').attr('data-IsAvailable'))
              }
              if (IsAvailable && isPull) {
                if (that.oneSubject.AMorPM !== AMorPM ||
                  that.oneSubject.AMorPMOrder !== AMorPMOrder ||
                  that.oneSubject.Day !== day) {
                  that.adjustClass(newDom, AMorPM, AMorPMOrder, day, date, isCover === 1)
                }
              }
            }
          })
          // table的th宽度
          let leftWidth = $('.left-box').width()
          let thNum = 4
          if (that.isShowWeekend) {
            thNum = 6
          }
          $('#sortableClass .th-width').css('width', (leftWidth / thNum) + 'px')
        })
      },
      // table的th宽度
      isShowWeekend () {
        let that = this
        this.$nextTick(() => {
          let leftWidth = $('.left-box').width()
          let thNum = 4
          if (that.isShowWeekend) {
            thNum = 6
          }
          $('#sortableClass .th-width').css('width', (leftWidth / thNum) + 'px')
        })
      }
    },
    mounted: function () {
    },
    methods: {
      // 获取周次
      async getWeek () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetWeek`)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          if (resData.ListWeek.length > 0) {
            let obj1 = resData.ListWeek.filter((item) => { return item.Key === this.weekCurKey.toString() })
            if (obj1.length > 0) {
              for (let i = 0; i < 7; i++) {
                this.weekData.push({
                  date: this.xy.moment(this.xy.moment(obj1[0].Date).add(i, 'd')).format('MM.DD'),
                  weekName: this.xy.getChinesesWeekForNumSmall(i),
                  Date: this.xy.moment(this.xy.moment(obj1[0].Date).add(i, 'd')).format('YYYY-MM-DD')
                })
              };
            } else {
              for (let i = 0; i < 7; i++) {
                this.weekData.push({
                  date: this.xy.moment(this.xy.moment(resData.ListWeek[0].Date).add(i, 'd')).format('MM.DD'),
                  weekName: this.xy.getChinesesWeekForNumSmall(i),
                  Date: this.xy.moment(this.xy.moment(resData.ListWeek[0].Date).add(i, 'd')).format('YYYY-MM-DD')
                })
              };
            }
            for (let k = 0; k < resData.ListWeek.length; k++) {
              this.sectionData.push({
                val: k + 1,
                name: k + 1 + '周'
              })
              this.weekSelectData.push({
                key: resData.ListWeek[k].Key,
                val: resData.ListWeek[k].Date,
                name: resData.ListWeek[k].Week + '（' +
                  this.xy.moment(resData.ListWeek[k].Date).format('MM.DD') + '-' +
                  this.xy.moment(this.xy.moment(resData.ListWeek[k].Date).add(6, 'd')).format('MM.DD') +
                  '）'
              })
            };
            let obj2 = this.weekSelectData.filter((item) => { return item.key === this.weekCurKey.toString() })
            if (obj2.length > 0) {
              this.weekCur = obj2[0].val
              this.weekDateName = obj2[0].name
            } else {
              this.weekCur = resData.ListWeek[0].Date
              this.weekDateName = this.weekSelectData[0].name
            }
          }
          this.getWeekTimeTable(this.selectStudentOrganizationID, this.weekCur)
        }
      },
      // 周次改变
      weekChange (val) {
        this.equalCurSubject = null
        let index = this.weekSelectData.map(function (item) { return item.val }).indexOf(val)
        this.weekDateName = this.weekSelectData[index].name
        this.weekData = []
        for (let i = 0; i < 7; i++) {
          this.weekData.push({
            date: this.xy.moment(this.xy.moment(val).add(i, 'd')).format('MM.DD'),
            weekName: this.xy.getChinesesWeekForNumSmall(i),
            Date: this.xy.moment(this.xy.moment(val).add(i, 'd')).format('YYYY-MM-DD')
          })
        };
        if (this.selectStudentOrganizationID > 0) {
          this.oneSubject = ''
          this.getWeekTimeTable(this.selectStudentOrganizationID, this.weekCur)
        }
      },
      // 获取周课表
      async getWeekTimeTable (studentOrganizationID, date) {
        let getWeekValue = {}
        if (this.isGetWeek) {
          getWeekValue = {
            studentOrganizationID: studentOrganizationID,
            startDate: date,
            classTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID
          }
        } else {
          getWeekValue = {
            studentOrganizationID: studentOrganizationID,
            startDate: date,
            classTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID,
            iSSelection: this.isSelection,
            day: this.dataDay,
            aMorPM: this.dataAMorPM,
            aMorPMOrder: this.dataAMorPMOrder,
            effectiveWeek: this.sectionCur
          }
        }
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/GetDetail`, getWeekValue)
        this.xy.unloading()
        if (res.success) {
          this.teacherTables = res.data.TeacherTables
          this.tableTimes = res.data.Times
          this.recordData = res.data.Details
          this.tableData = res.data.TimeTables
          this.rightFrameData = res.data.IsValidTimeTables
          this.isSelection = false
        }
        this.isGetWeek = true
      },
      // 课程点击
      subjectClick: function (data) {
        if (data.IsAvailable) {
          this.oneSubject = ''
          this.oneSubject = data
          this.classTableBaseID = data.ClassTableGenerateBaseID
          this.dataDay = data.Day
          this.dataAMorPM = data.AMorPM
          this.dataAMorPMOrder = data.AMorPMOrder
          this.isGetWeek = false
          this.isSelection = true
          let weekTime = data.Day + data.AMorPM + data.AMorPMOrder
          if (this.equalCurSubject === weekTime) {
            this.equalCurSubject = null
            this.oneSubject = ''
            this.tableTimes.map((item) => {
              item.IsProhibitTime = null
              return item
            })
          } else {
            this.equalCurSubject = weekTime
            this.getWeekTimeTable(this.selectStudentOrganizationID, this.weekCur)
          }
        }
      },
      // 调课tabale
      async adjustClass (event, AMorPM, AMorPMOrder, day, targetClassDate, isCover) {
        if (!isCover) {
          if (this.oneSubject !== '') {
            if (this.xy.moment(new Date()).diff(this.xy.moment(new Date(targetClassDate)), 'days') <= 0) {
              let index = this.weekSelectData.map(function (item) { return item.val }).indexOf(this.weekCur)
              let week = this.weekSelectData[index].key
              let curDate = this.weekSelectData[index].val
              let targetClassTableGenerateBaseID = 0
              let dataDirection = 0
              if ($(event).find('.adjust-subject').length > 0) {
                targetClassTableGenerateBaseID = $(event).find('.adjust-subject').attr('data-classTableGenerateBaseID')
              }
              let postData = {
                ClassTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID,
                SchoolDistrictID: this.SchoolDistrictID,
                AcademicSessionID: this.oneSubject.AcademicSessionID,
                IsCrossWeeks: false,
                EffectiveWeek: this.sectionCur,
                Detail: {
                  StudentOrganizationID: this.selectStudentOrganizationID,
                  StudentOrganizationFullName: this.StudentOrganizationFullName,
                  SourceClassDate: this.oneSubject.ClassDate,
                  SourceDay: this.oneSubject.Day,
                  SourceAMorPM: this.oneSubject.AMorPM,
                  SourceAMorPMOrder: this.oneSubject.AMorPMOrder,
                  SourceWeek: week,
                  SourceClassTableGenerateBaseID: this.oneSubject.ClassTableGenerateBaseID,
                  TargetClassDate: targetClassDate,
                  TargetDay: day,
                  TargetAMorPM: AMorPM,
                  TargetAMorPMOrder: AMorPMOrder,
                  TargetWeek: week,
                  TargetClassTableGenerateBaseID: targetClassTableGenerateBaseID,
                  DataDirection: dataDirection
                }
              }
              dataDirection = 0
              this.xy.loading()
              let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/GetCollision`, {
                applyid: this.classTableGenerateForStudentOrganizationID,
                weekStartDate: curDate, //
                isCrossWeeks: false, //
                effectiveWeek: this.sectionCur, //
                studentOrganizationID: this.selectStudentOrganizationID,
                sourceClassDate: this.oneSubject.ClassDate, //
                sourceDay: this.oneSubject.Day, //
                sourceAMorPM: this.oneSubject.AMorPM, //
                sourceAMorPMOrder: this.oneSubject.AMorPMOrder, //
                sourceClassTableGenerateBaseID: this.oneSubject.ClassTableGenerateBaseID, //
                targetClassDate: targetClassDate, //
                targetDay: day, //
                targetAMorPM: AMorPM, //
                targetAMorPMOrder: AMorPMOrder, //
                targetClassTableGenerateBaseID: targetClassTableGenerateBaseID //
              }, true)
              this.xy.unloading()
              if (res.success) {
                this.adjustmentOrganization(postData)
              } else {
                let errorMsg = ''
                for (let i = 0; i < res.data.length; i++) {
                  errorMsg = errorMsg + res.data[i]
                }
                this.xy.msgError(errorMsg)
              }
            }
          }
        }
      },
      // 行政班调课接口
      async adjustmentOrganization (postData) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/AdjustmentOrganization`, postData)
        this.xy.unloading()
        if (res.success) {
          this.classTableGenerateForStudentOrganizationID = res.data
          this.xy.msgSuc('调整成功。')
          this.isDisabled = true
          this.isGetWeek = true
          this.equalCurSubject = null
          this.getWeekTimeTable(this.selectStudentOrganizationID, this.weekCur)
        }
        this.oneSubject = ''
      },
      // 获取老师所教的课
      async teacherSunject (data) {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/GetTeacherWeekTimeTable`, {
          teacherID: data.TeacherID,
          classTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID,
          startDate: this.weekCur
        })
        this.xy.unloading()
        if (res.success) {
          this.teacherData = res.data.TimeTables
          this.teacherName = data.TeacherInfos
          this.activeTab = '1'
        }
      },
      // 清除记录
      async clearRecord (item, index) {
        if (index === 0) {
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/Clear`, {
            ClassTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID,
            ClassTableGenerateForStudentOrganizationDetailID: -1
          })
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('清除成功。')
            this.oneSubject = ''
            this.equalCurSubject = null
            this.isDisabled = false
            this.classTableGenerateForStudentOrganizationID = 0
            this.getWeekTimeTable(this.selectStudentOrganizationID, this.weekCur)
          }
        } else {
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/Delete`, {
            ClassTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID,
            ClassTableGenerateForStudentOrganizationDetailID: item.ClassTableGenerateForStudentOrganizationDetailID
          })
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('清除成功。')
            this.oneSubject = ''
            this.equalCurSubject = null
            this.getWeekTimeTable(this.selectStudentOrganizationID, this.weekCur)
          }
        }
      },
      // 取消调课
      cancel: function () {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要取消本次调课操作吗?',
          onOk: () => {
            this.cancelhttp()
          }
        })
      },
      async cancelhttp () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/Clear`, {
          ClassTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID,
          ClassTableGenerateForStudentOrganizationDetailID: -1
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('取消成功。')
          this.isDisabled = false
          this.oneSubject = ''
          this.equalCurSubject = null
          this.classTableGenerateForStudentOrganizationID = 0
          this.getWeekTimeTable(this.selectStudentOrganizationID, this.weekCur)
        }
      },
      async completeSub () {
        if (this.recordData.length > 0) {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/SaveForCheck`, {
            classTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID
          })
          this.xy.unloading()
          if (res.success) {
            this.completeSubSave()
          }
        }
      },
      async completeSubSave () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/Save`, {
          id: this.classTableGenerateForStudentOrganizationID,
          ids: ''
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('完成调课成功。')
          this.getNotifyInfo()
        }
      },
      // 调课通知页面数据
      getNotifyInfo: function () {
        this.$router.push({
          path: '/xyhome/adjustmentNotice',
          query: { classTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID }
        })
      },
      // 跨周调课
      acrossWeek: function () {
        let loadParams = {
          selectClass: this.selectClass,
          selectTeacherSub: this.selectTeacherSub,
          sourceWeek: this.weekCurKey,
          isContinue: false
        }
        this.$store.commit('csmstimetable/changeAdjustTableRow', loadParams)
        this.$store.commit('common/getThreeMenuName', '跨周调课')
        this.$store.commit('common/getParam', { pro: 'adjustmentTable' })
        this.$router.push({
          path: '/xyhome/acrossWeek',
          query: this.$store.state.common.menuInfo
        })
      },
      // 按班级调课
      choseClass () {
        if (this.classData.length === 0) {
          this.getClassTree()
        } else {
          this.selectClassModal = true
        }
      },
      async getClassTree () { // 获取班级树
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/base/api/StudentOrganizationMember/GetTree`, {
          isShowAll: false,
          curNodeInfo: '',
          isSetCount: true
        })
        this.xy.unloading()
        if (res.success) {
          let dataList = res.data
          this.classData = []
          for (let i = 0; i < dataList.length; i++) {
            this.classData.push({
              SchoolDistrictID: dataList[i].SchoolDistrictID,
              SchoolDistrictName: dataList[i].SchoolDistrictName,
              YearList: []
            })
            if (dataList[i].YearList.length > 0) {
              for (let j = 0; j < dataList[i].YearList.length; j++) {
                if (dataList[i].YearList[j].GradeList.length > 0) {
                  for (let k = 0; k < dataList[i].YearList[j].GradeList.length; k++) {
                    if (this.classData[i].SchoolDistrictID === dataList[i].YearList[j].SchoolDistrictID) {
                      this.classData[i].YearList.push({
                        name: dataList[i].YearList[j].StudentYearName + dataList[i].YearList[j].GradeList[k].StudentGradeName,
                        StudentYearID: dataList[i].YearList[j].GradeList[k].StudentYearID,
                        classList: dataList[i].YearList[j].GradeList[k].OrgList
                      })
                    };
                  };
                };
              };
            };
          };
          this.selectClassModal = true
        }
      },
      modalSelectClass: function (item, gradeItem, childclass) {
        this.selectClass = childclass
        this.StudentOrganizationFullName = childclass.FullName
        this.selectStudentOrganizationID = childclass.StudentOrganizationID
        this.SchoolDistrictID = childclass.SchoolDistrictID
      },
      selectClassSubmit: function () {
        if (this.selectClass === '') {
          this.xy.msgError('请选择班级。')
        } else {
          this.selectClassModal = false
          this.getWeekTimeTable(this.selectStudentOrganizationID, this.weekCur)
        }
      },
      // 按教师调课
      choseTeacherModal: function () {
        if (this.teacherList.length === 0) {
          this.getTeachers()
        } else {
          this.modalChoseTeacher = true
        }
      },
      async getTeachers () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/GetTeachers`)
        this.xy.unloading()
        if (res.success) {
          this.teacherList = res.data
          this.modalChoseTeacher = true
        }
      },
      async getTeachersWeekTime () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/GetTeacherWeekTimeCPTable`, {
          teacherID: this.searchTeacher
        })
        this.xy.unloading()
        if (res.success) {
          this.teacherCPTable = res.data
        }
      },
      remoteMethod1 (query) {
        if (query !== '') {
          this.loading1 = true
          setTimeout(() => {
            this.loading1 = false
            this.optionList = this.teacherList.filter((item) => { return item.FullName.indexOf(query) > -1 })
          }, 200)
        } else {
          this.optionList = []
        }
      },
      teacherChange (val) {
        this.searchTeacher = val
        if (this.searchTeacher !== '' && this.searchTeacher !== undefined) {
          this.getTeachersWeekTime()
        }
      },
      modalSelectTeacherSub: function (res) {
        this.selectTeacherSub = res
        this.StudentOrganizationFullName = res.CoursePlanTableFullName
        this.selectStudentOrganizationID = res.StudentOrganizationID
        this.SchoolDistrictID = res.SchoolDistrictID
      },
      choseTeacherSubmit: function () {
        if (this.selectTeacherSub === '') {
          this.xy.msgError('请选择课程。')
        } else {
          this.modalChoseTeacher = false
          this.getWeekTimeTable(this.selectStudentOrganizationID, this.weekCur)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.table{
    border: 1px solid #ddd;
    text-align: center;
    /*cursor: pointer;*/
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 14px;
    width: 100%;
    color: rgb(145, 160, 180);
}
.table thead th{
    height: 35px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #f2f3f5;
    box-sizing: border-box;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-bottom: 1px solid #e8eaec;
    border-right: 1px solid #e8eaec;
    font-weight:bolder;
}
.table tbody td{
    height: 35px;
    box-sizing: border-box;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid #e8eaec;
    border-right: 1px solid #e8eaec;
    position:relative;
    padding:4px;
    cursor:pointer;
}
.table tbody tr td {
    min-width: 30px;
    max-width: 30px;
}

/*按班级调课 */
.select-school {
    padding: 0 40px;
    overflow: auto;
    height: 309px;
    margin-top: -16px;
    background:#fff;
}
.select-grade > .select-grade-name {
    display: block;
    font-weight: bold;
    margin: 20px 0 10px;
}

.select-grade > .select-class {
    display: inline-block;
    margin: 4px 6px;
    padding:4px;
    border:1px solid #ddd;
    border-radius:5px;
    text-align:center;
    min-width: 60px;
}
.select-grade > .select-class:hover {
    border-color: #2d8cf0;
    color: #2d8cf0
}
.active-class {
    border-color: #2d8cf0;
    background: #2d8cf0;
    color: #fff;
}
.active-class:hover {
    color: #fff!important;
}

.class-table {
}
.class-table thead th {
    height: 28px;
    background: rgba(65,150,255,0.2);
    border-radius: 4px 4px 0px 0px;
    color: rgba(65,150,255,1);
}

.class-table tbody td {
    height: 15px;
    cursor: default;
}
.class-table tbody td:first-child {
    background: rgba(65,150,255,0.2);
    border-radius: 4px 4px 0px 0px;
    color: rgba(65,150,255,1);
}
.class-table tbody td > div {

}
.td-subject {
    max-width:134px;
    min-width:60px;
    text-align:left;
    padding-left:5px;
    border-radius:4px;
}
.table-subject-line {
    width: 4px;
    height: 24px;
    background: rgba(65,150,255,0.8);
    margin-left:4px;
    margin-right:8px;
}
.table-sub-active {
    background: rgba(65,150,255,0.1);
    color: #4196FF;
}

/**
    单周调课
**/
.adjust-box{
    display:flex;
    justify-content:flex-start;
}
.box-top{
    height:40px;
    line-height:40px;
    margin-bottom:10px;
}
.left-box {
    width: 100%;
}
.rigth-box{
    width:600px;
    margin-left:10px;
}
.schedule-table {
    border: 1px solid #E8E8E8;
    text-align: center;
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 14px;
    color: #333;
    width:100%;
}
.schedule-table tr {
    border-right: 1px solid #E8E8E8;
}
.schedule-table th {
    background: #f9f9f9;
    height: 34px;
}
.schedule-table tr th:first-child {
    width: 46px;
}
.schedule-table td {
    border: 1px solid #E8E8E8;
    height: 50px;
    padding:2px;
    position:relative;
    max-width:100px;
    min-width:50px;
}
.schedule-table tr td:first-child {
    background: #f9f9f9;
    border: none;
    width: 46px;
}
.adjust-subject {
    height: 48px;
    border-radius: 4px;
    text-align: left;
    padding: 4px 8px;
    background:transparent;
    position:relative;
    z-index:2;
    cursor: pointer;
}
.adjust-subject .crouse-name {
    font-weight: 400;
    color: #111;
    opacity: 0.8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.adjust-subject .teacher-name {
    font-size: 12px;
    font-weight: 400;
    color: #999;
    opacity: 0.8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor:pointer;
}
.adjust-subject .teacher-name:hover {
    color: #4196FF;
}
.right-subject {
    height: 48px;
    border-radius: 4px;
    text-align: left;
    padding: 4px 8px;
    max-width:100px;
    min-width:80px;
}
.bg-noadjust {
    position: absolute;
    top: 2%;
    left: 1%;
    width: 98%;
    height: 96%;
    cursor: pointer;
    border: 1px dashed #36931B;
    border-radius: 5px;
    z-index: 1;
    background: rgba(218,249,199,0.2) !important;
}
.cur-subject {
    background: #4196FF !important;
    color: #fff;
}
.cur-subject .crouse-name {
    color: #fff;
}
.cur-subject .teacher-name {
    color: #fff;
}
.cur-subject .teacher-name:hover {
    color: #fff;
}
.select-equal-crouse {
    background: rgba(65,150,255,0.1)!important;
}
.select-equal-crouse .crouse-name {
    color: #4196FF !important;
}

.select-equal-crouse .teacher-name {
    color: #4196FF !important;
}

.adjust-footer {
    height: 50px;
    line-height: 50px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 4px 0px rgba(207,207,207,0.5);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    padding-left: 70px;
}
.color-block {
    width: 20px;
    height: 12px;
    border-radius: 2px;
    display:inline-block;
}
.block-name {
    font-weight: 400;
    color: #111;
    opacity: 0.8;
}
.block-name-two {
    width: 0px;
    height: 0px;
    border-left: 9px;
    border-top: 7px;
    border-bottom: 5px;
    border-right: 10px;
    border-style: solid;
    border-color: #d0d0d0 #d0d0d0 #FF7500 #FF7500;
    border-radius: 3px;
    display: inline-block;
}
/*小课表*/
.class-table-name {
    margin: 20px 0;
}
.class-tit-name {
    font-size: 16px;
    font-weight: bold;
    color: #444;
    margin:30px 0 20px;
}
.class-table-box{
    display:flex;
    justify-content:flex-start;
    flex-wrap:wrap;
}
.class-table-teacher {
    font-size: 16px;
    font-weight: bold;
    color: #444
}
.teacher-small-table {
    border: 2px solid #F7F7F7;
    background: #fff;
    text-align: center;
    border-collapse: collapse;
    font-size: 14px;
    width: 100%;
}
.teacher-small-table th {
    background: #F7F7F7;
    color: #333;
    font-size: 12px;
    border: none;
    height: 30px;
}
.teacher-small-table td {
    border: 2px solid #F7F7F7;
    color: #666666;
    font-size: 12px;
    height: 30px;
    width: 53px;
}
.teacher-small-table td:first-child {
    background: #F7F7F7;
    color: #333;
    font-size: 12px;
    border: none;
}
.teacher-small-table td .crouse-name {
    height: 30px;
    line-height:30px;
    width: 53px;
}
.first-teacher {
    box-shadow: 0px 4px 8px 0px rgba(163,163,163,0.5);
}
.first-teacher th {
    background: rgba(65,150,255,0.05);
    color: #4196FF;
}
.first-teacher td:first-child {
    background: rgba(65,150,255,0.05);
    color: #4196FF;
}
.small-triangle {
    position:absolute;
    top: -10px;
    right: -10px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent #FF7500 transparent;
    transform: rotate(45deg);
}
/*调课记录*/
.record-body {
    background: #F9F9F9;
    position: absolute;
    top: 49px;
    right: -10px;
    width: 460px;
    height: 510px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 4px 8px 0px rgba(163,163,163,0.5);
    border-radius: 4px;
    line-height: normal;
    text-align: left;
    overflow: auto;
    z-index: 200;
}
.record-h3 {
    font-size: 16px;
    font-weight: bold;
    color: #444;
    margin-top:20px;
    margin-left:24px;
}
.record-ul {
}

.record-ul-li {
    background: rgba(255,255,255,1);
    padding: 8px 21px;
    height: 64px;
    display: flex;
    justify-content: flex-start;
    align-items: center
}
.record-ul-li:nth-child(2n) {
    background: #F8FBFF;
}

.record-ul-li .li-title {
    font-size: 14px;
    font-weight: bold;
    color: #444444;
    margin-bottom: 8px;
}

.record-ul-li .week-subject-teacher {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(102,102,102,1);
}

.record-ul-li .swap-icon {
    width: 22px;
    height: 22px;
    line-height: 22px;
    color: #4196FF;
    border: 1px solid #4196FF;
    border-radius: 50%;
    text-align: center;
    transform: rotate(90deg);
}

.record-ul-li .del-icon {
    color: #FE7437;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
}

.record-ul-li .del-icon:hover {
    background: rgba(255,229,214,1);
}

/**
    详情
**/
.notice-box {
    width: 1300px;
    min-height:600px;
    margin: 10px auto;
    border: 1px solid rgba(226,226,226,1);
    border-radius: 6px;
    display:flex;
    justify-content:flex-start;
}
.left-notice {
    width: 960px;
    border-right: 1px solid #E2E2E2;
}
.notice-list {
    margin: 21px 0 13px 35px;
    width: 908px;
    height: 96px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(241,241,241,1);
    border-radius: 6px;
    padding:23px 19px 22px 28px;
}
.notice-subject {
    height: 25px;
    background: #F5F5F5;
    border-radius: 4px;
    text-align: center;
    padding: 4px 14px;
    color: #333333;
    display:inline-block;
    margin:0 10px;
}
.notice-week {
    width: 86px;
    height: 25px;
    line-height:25px;
    background: rgba(237,250,232,1);
    border-radius: 4px;
    text-align: center;
    color: #2E901A;
}
.notice-point {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display:inline-block;
}
.notice-time {
    color: #999999;
    margin-left: 8px;
    display:inline-block;
    margin-left:4px;
    margin-right:8px;
}
.right-notice{
    text-align:center;
    width:335px;
}
.notice-ajust-person {
    width: 42px;
    height: 42px;
    line-height: 42px;
    background: rgba(65,150,255,1);
    border-radius: 50%;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
}

</style>
