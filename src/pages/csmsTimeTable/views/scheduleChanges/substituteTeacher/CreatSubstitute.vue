<!--创建代课  -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <div>
        <span>教师姓名：</span>
        <i-select v-model="searchTeacher"
                  :disabled="isConfirm"
                  placeholder="请输入用户名/工号/姓名"
                  filterable
                  remote
                  :remote-method="remoteMethod1"
                  @on-change="teacherChange"
                  style="width:250px;">
          <i-option v-for="(option) in optionList"
                    :value="option.val"
                    :key="option.UserID"
                    >{{option.FullName}}</i-option>
        </i-select>
        <span style="margin-left:10px">时间：</span>
        <i-select v-model="weekCur"
                  :disabled="isConfirm"
                  @on-change="weekChange"
                  class="xy-content-title-search"
                  style="width:250px">
          <i-option v-for="(item,index) in weekSelectData"
                    :value="item.key"

                    :key='index'>{{item.name}}</i-option>
        </i-select>
        <span style="margin-left:10px">共有效：</span>
        <i-select v-model="sectionCur"
                  :disabled="isConfirm"
                  class="xy-content-title-search"
                  style="width:250px;margin-left:0">
          <i-option v-for="(item,index) in sectionData"
                    :key='index'
                    :value="item.val"
                    >{{item.name}}</i-option>
        </i-select>
      </div>
    </div>
    <div class="xy-content-body">
      <div v-if="tableData.length > 0"
           style="padding-bottom: 50px;">
        <div class='btn-box'>
          <ButtonGroup style='margin-bottom:10px'>
            <Button :class="selectNum===0?'xy-primary':''"
                    @click="changeTab(0)">{{teacherName}}课表</Button>
            <Button :class="selectNum===1?'xy-primary':''"
                    @click="changeTab(1)">代课教师课表</Button>
          </ButtonGroup>
          <Button @click='isShowRecords=!isShowRecords'>代课记录<i class="ivu-icon ivu-icon-ios-arrow-down"></i></Button>
        </div>
        <!-- 代课记录 -->
        <ul class="substitute-record"
            v-show='isShowRecords'>
          <li>
            <div class="top">
              <p>打开课表</p>
              <Button type="text"
                      @click="clearRecord('','',0)"
                      shpi>撤销</Button>
            </div>
          </li>
          <li v-for='(item,index) in recordData'
              :key='index'>
            <div class="top">
              <p>{{item.sesstion}}</p>
              <Button type="text"
                      @click="clearRecord(item,index,1)">撤销</Button>
            </div>
            <div class="bottom">
              <p><span>{{item.from}}</span><i class="iconfont">&#xe6ee;</i><span>{{item.to}}</span></p>
              <p>{{item.date}}</p>
            </div>
          </li>
        </ul>

        <div class="substitute-title">
          <!-- 代课教师-表头 -->
          <p v-show='selectNum===0'
             class="text-center"><span style="margin-right:5px;">{{teacherName}}</span>{{weekDateName}}</p>
          <!-- 被代课教师-表头 -->
          <p class="text-center"
             v-show='selectNum===1'><span style="margin-right:5px;">{{isActiveTeacher.TeacherName}}</span>{{weekDateName}}</p>
          <div class="select-title">
            <h2>可代课教师</h2>
            <Select v-model="curTab"
                    style="width:200px"
                    @on-change='tabClick'>
              <Option v-for="item in optionData"
                      :value="item.value"
                      :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>

        <div class="tab-substitute">
          <!-- 代课教师课表 -->
          <table class="table"
                 v-show='selectNum===0'>
            <thead>
              <tr>
                <th width="16%"></th>
                <th width="12%"
                    v-for="(week,index) in weekData"
                    :key='index'>
                  <span >{{week.weekName}}</span>
                  <span >{{week.date}}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(time,fIndex) in tableTimes"
                  :key='fIndex'>
                <td >{{time.AMorPMOrderName}}</td>
                <td v-for="(td,index) in weekData"
                    :key='index'>
                  <div v-if="new Date(td.Date)>new Date()">

                    <template v-for="(data,dataIndex) in tableData">
                      <div class="subject"
                           :key='dataIndex'
                           :class="data.IsHasSubstituteTeacher? 'no-chose':''"
                           @click="subjectClick($event,data,time.AMorPMOrderName)"
                           :style="{background:data.bg,color:'#fff'}"
                           v-if="data.AMorPM == time.AMorPM && data.AMorPMOrder == time.AMorPMOrder && data.Day == index">
                        <h5 >{{data.SubjectName}}</h5>
                        <p class="class-name"
                           >{{data.CoursePlanTableFullName}}</p>
                      </div>
                    </template>

                  </div>
                  <div v-else-if="td.Date==today">
                    <template v-for="(data,dataIndex) in tableData">
                      <div class="subject"
                           :key='dataIndex'
                           :class="data.IsHasSubstituteTeacher? 'no-chose':''"
                           @click="subjectClick($event,data,time.AMorPMOrderName)"
                           :style="{background:data.bg,color:'#fff', 'cursor':new Date(data.ClassDate.split('T')[0]+' '+data.StartTime)>new Date(today+' '+'11:50')?'':'no-drop'}"
                           v-if="data.AMorPM == time.AMorPM && data.AMorPMOrder == time.AMorPMOrder && data.Day == index">
                        <h5 >{{data.SubjectName}}</h5>
                        <p class="class-name"
                           >{{data.CoursePlanTableFullName}}</p>
                      </div>
                    </template>

                  </div>
                  <div v-else>
                    <template v-for="(data,dataIndex) in tableData">
                      <div class="subject"
                           :key='dataIndex'
                           :style="{background:data.bg,color:'#fff',cursor:'no-drop'}"
                           v-if="data.AMorPM == time.AMorPM && data.AMorPMOrder == time.AMorPMOrder && data.Day == index">
                        <h5 >{{data.SubjectName}}</h5>
                        <p class="class-name"
                           >{{data.CoursePlanTableFullName}}</p>
                      </div>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 被代课教师课表 -->
          <table class="table"
                 v-show='selectNum===1'>
            <thead>
              <tr>
                <th width="16%"></th>
                <th width="12%"
                    v-for="(week,index) in weekData"
                    :key='index'>
                  <span >{{week.weekName}}</span>
                  <span >{{week.date}}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(time,index) in tableTimes"
                  :key='index'>
                <td >{{time.AMorPMOrderName}}</td>
                <td v-for="(td,cIndex) in 7"
                    :key='cIndex'>
                  <template v-for="(data,kIndex) in leftBottomData">
                    <div class="subject"
                         :key='kIndex'
                         v-if="data.AMorPM == time.AMorPM && data.AMorPMOrder == time.AMorPMOrder && data.Day == td-1">
                      <h5 >{{data.SubjectName}}</h5>
                      <p class="class-name"
                         >{{data.CoursePlanTableFullName}}</p>
                    </div>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 右边被代课的教师--选课框 -->
          <div class="right-substitute-teacher">
            <section v-show="curTab==='1'">
              <div style="margin-bottom:10px;">
                <Input search
                       enter-button
                       placeholder="查询教师"
                       v-model.trim="searchName1"
                       class="casader-search" />
              </div>
              <div class="tap-content">
                <ul class="teacher-ul"
                    v-if="rightTeacherData.length > 0">
                  <template v-for="(teacher,index) in rightTeacherData">
                    <li @click="rigthTeacher($event,teacher)"
                        :key='index'
                        :class="teacher.IsConflict?'no-chose-teacher':''"
                        v-if="teacher.UserName.indexOf(searchName1)>=0 || teacher.TeacherName.indexOf(searchName1)>=0 ">
                      <span>{{teacher.TeacherName}}</span>
                    </li>
                  </template>
                </ul>
                <div v-else
                     class="filter-state">暂无代课教师。</div>
              </div>
            </section>
            <section v-show="curTab==='2'">
              <div style="margin-bottom:10px;">
                <Input search
                       enter-button
                       placeholder="查询教师"
                       v-model.trim="searchName2"
                       class="casader-search" />
              </div>
              <div class="tap-content">
                <ul class="teacher-ul"
                    v-if="rightTeacherData.length > 0">
                  <template v-for="(teacher,index) in rightTeacherData">
                    <li @click="rigthTeacher($event,teacher)"
                        :key='index'
                        :class="teacher.IsConflict?'no-chose-teacher':''"
                        v-if="teacher.UserName.indexOf(searchName2)>=0 || teacher.TeacherName.indexOf(searchName2)>=0 ">
                      <span>{{teacher.TeacherName}}</span>
                    </li>
                  </template>

                </ul>
                <div v-else
                     class="filter-state">暂无代课教师。</div>
              </div>
            </section>
            <section v-show="curTab==='3'">
              <div style="margin-bottom:10px;">
                <Input search
                       enter-button
                       placeholder="查询教师"
                       v-model.trim="searchName3"
                       class="casader-search" />
              </div>
              <div class="tap-content">
                <ul class="teacher-ul"
                    v-if="rightTeacherData.length > 0">
                  <template v-for="(teacher,index) in rightTeacherData">
                    <li @click="rigthTeacher($event,teacher)"
                        :key='index'
                        :class="teacher.IsConflict?'no-chose-teacher':''"
                        v-if="teacher.UserName.indexOf(searchName3)>=0 || teacher.TeacherName.indexOf(searchName3)>=0 ">
                      <span>{{teacher.TeacherName}}</span>
                    </li>
                  </template>
                </ul>
                <div v-else
                     class="filter-state">暂无代课教师。</div>
              </div>
            </section>
            <section v-show="curTab==='4'">
              <div style="margin-bottom:10px;">
                <Input search
                       enter-button
                       placeholder="查询教师"
                       v-model.trim="searchName4"
                       class="casader-search" />
              </div>
              <div class="tap-content"
                   v-if="rightTeacherData.length > 0">
                <ul class="teacher-ul">
                  <template v-for="(teacher,index) in rightTeacherData">
                    <li @click="rigthTeacher($event,teacher)"
                        :key='index'
                        :class="teacher.IsConflict?'no-chose-teacher':''"
                        v-if="teacher.UserName.indexOf(searchName4)>=0 || teacher.TeacherName.indexOf(searchName4)>=0 ">
                      <span>{{teacher.TeacherName}}</span>
                    </li>
                  </template>

                </ul>
              </div>
              <div v-else
                   class="filter-state">暂无代课教师。</div>
            </section>
            <div class="text-center"
                 style="padding-bottom:15px;">
              <Button class="xy-btn-primary"
                      shape="circle"
                      @click="saveSub">确认</Button>
            </div>
          </div>
        </div>
      </div>
      <div class="filter-state"
           v-else>
        <p><i class="iconfont"
             style="font-size:32px">&#xe6e7;</i></p>
        <div style="font-size:18px">该周无课表。</div>
      </div>
      <div class="fix-btn"
           v-if="tableData.length > 0">
        <Button class="xy-btn-primary"
                shape="circle"
                @click="completeSub"
                :disabled="!isConfirm">完成代课</Button>
        <Button class="xy-btn-close"
                @click="cancel"
                :disabled="!isConfirm">取消代课</Button>
      </div>

      <!-- 调课通知 -->
      <modal v-model="modalClassNotice"
             title="代课通知"
             :mask-closable="false"
             width="764"
             :transfer="false">
        <h2 class="text-center f16"
            style="font-weight:bold;margin:15px 0">{{notifyInfoData.SourceTeacherName}}老师代课通知</h2>
        <Input clearable
               v-model="adjustmentReason"
               :disabled="isShowReason"
               style="margin-bottom:10px;"
               placeholder="请填写调课原因" />
        <div style="max-height:500px;overflow-y:auto">
          <table class="table"
                 style="color:#333;margin-bottom:10px;">
            <tr>
              <td width="20%">班级</td>
              <td width="30%">课程</td>
              <td width="20%">上课时间</td>
              <td width="30%">代课教师</td>
            </tr>
            <tr v-for="(item,index) in notifyInfoData.Details"
                :key='index'>
              <td >{{item.CoursePlanTableFullName}}</td>
              <td >{{item.SubjectName}}</td>
              <td >{{item.FullClassDate}}</td>
              <td >{{item.SubstituteTeacherName}}</td>
            </tr>
          </table>
          <div class="clearfix">
            <div class="fl">
              <checkbox v-model="isNotice">导出通知时同时在线发送通知</checkbox>
            </div>
            <div class="fr">共有效{{notifyInfoData.EffectiveWeek}}周</div>
          </div>
        </div>
        <div slot="footer"
             class="text-center"
             style="margin-top:10px;">
          <Button type="text"
                  size="large"
                  @click="modalClassNotice = false"
                  ghost>取消</Button>
          <Button class="xy-primary"
                  size="large"
                  @click="addClassNotice(1)">在线通知</Button>
          <Button class="xy-info"
                  size="large"
                  @click="addClassNotice(2)">导出通知</Button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchName1: '',
        searchName2: '',
        searchName3: '',
        searchName4: '',
        searchTeacher: '',
        teacherName: '',
        weekDateName: '',
        teacherLoading: false,
        teacherList: [],
        optionList: [],
        weekData: [],
        newWeekData: [],
        weekSelectData: [],
        weekCur: '',
        sectionData: [],
        sectionCur: 1,
        tableTimes: [],
        tableData: [],
        rightTeacherData: [],
        leftSubjectInfo: '',
        isActiveTeacher: '',
        isConfirm: false,
        leftBottomData: [],
        recordData: [],
        classTableGenerateForSubstituteTeacherID: 0,
        curTab: '1',
        // 调课通知
        modalClassNotice: false,
        adjustmentReason: '',
        isNotice: false,
        notifyInfoData: [],
        isShowReason: true,
        curClassTableGenerateForSubstituteTeacherID: 0,
        dateFun: {},
        selectNum: 0,
        isShowRecords: false,
        today: '',
        optionData: [
          { label: '同年级同学科', value: '1' },
          { label: '不同年级同学科', value: '2' },
          { label: '同年级不同学科', value: '3' },
          { label: '所有老师', value: '4' }
        ]
      }
    },
    created: function () {
      let month = (new Date().getMonth() + 1) < 9 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1
      let day = (new Date().getDate() + 1) < 9 ? `0${new Date().getDate()}` : new Date().getDate()
      this.today = `${new Date().getFullYear()}-${month}-${day}`
      this.dateFun = {
        // 日期添加
        add: function (date, strInterval, Number) {
          switch (strInterval) {
            case 's': return new Date(Date.parse(date) + (1000 * Number))
            case 'n': return new Date(Date.parse(date) + (60000 * Number))
            case 'h': return new Date(Date.parse(date) + (3600000 * Number))
            case 'd': return new Date(Date.parse(date) + (86400000 * Number))
            case 'w': return new Date(Date.parse(date) + ((86400000 * 7) * Number))
            case 'q': return new Date(date.getFullYear(), (date.getMonth()) + Number * 3, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
            case 'm': return new Date(date.getFullYear(), (date.getMonth()) + Number, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
            case 'y': return new Date((date.getFullYear() + Number), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
          }
        },
        // 日期格式化
        format: function (date, format) {
          if (typeof date === 'string') { // 如果是字符串转换为日期型
            date = new Date(date.replace(/-/g, '/'))
          }

          if (!format) { format = 'yyyy-MM-dd HH:mm:ss' }
          let obj =
            {
              'M+': date.getMonth() + 1, // 返回实际月份
              'd+': date.getDate(), // 返回当月第几天
              'H+': date.getHours(), // 返回小时
              'm+': date.getMinutes(), // 返回分钟
              's+': date.getSeconds(), // 返回秒
              'q+': Math.floor((date.getMonth() + 3) / 3), // 返回第几个季度
              'S': date.getMilliseconds(), // 返回毫秒
              'w': date.getDay(), // 返回星期几，0为星期日
              'W': '日一二三四五六'.charAt(date.getDay()) // 返回星期几的中文表示
            }

          // 年的单独处理
          if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
          // 其他格式处理
          for (let k in obj) {
            if (new RegExp('(' + k + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? obj[k] : ('00' + obj[k]).substr(('' + obj[k]).length)) }
          }
          return format
        }
      }
    },
    mounted: function () {
      this.getTeachers()
    },
    methods: {
      changeTab (val) {
        this.selectNum = val
      },
      // 调动记录
      async getSubstituteInfo () {
        let that = this
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/GetSubstituteInfo?classTableGenerateForSubstituteTeacherID=${that.classTableGenerateForSubstituteTeacherID}`)
        if (res.success) {
          let resData = res.data
          that.recordData = []
          for (let i = 0; i < resData.Details.length; i++) {
            that.recordData.push({
              date: resData.Details[i].LastModifyDateStr,
              sesstion: resData.Details[i].TimeDesc,
              from: resData.Details[i].SubstituteTeacherName,
              to: resData.SourceTeacherName,
              classDate: resData.Details[i].StartDate,
              ClassTableGenerateForSubstituteTeacherDetailID: resData.Details[i].ClassTableGenerateForSubstituteTeacherDetailID
            })
          }
        }
        this.xy.unloading()
      },
      // 老师搜索
      remoteMethod1 (query) {
        if (query !== '') {
          this.loading1 = true
          setTimeout(() => {
            this.loading1 = false
            this.optionList = this.teacherList.filter((item) => {
              let str = `${item.UserID}/${item.FullName}/${item.UserName}/${item.SchoolCardNumber}`
              item.val = str
              return (str.indexOf(query) > -1)
            })
          }, 200)
        } else {
          this.optionList = []
        }
      },
      teacherChange (val) {
        this.searchTeacher = val
        for (let i = 0; i < this.teacherList.length; i++) {
          if (this.teacherList[i].UserID === parseInt(val.split('/')[0])) {
            this.teacherName = this.teacherList[i].FullName
            break
          }
        };
        this.rightTeacherData = []
        this.getWeekTimeTable(this.weekCur, this.searchTeacher)
      },
      // 获取周次
      async getWeek () {
        let that = this
        that.newWeekData = []; that.sectionData = []
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetWeek`)

        if (res.success) {
          let resData = res.data
          for (let i = 0; i < 7; i++) {
            that.weekData.push({
              date: this.dateFun.format(this.dateFun.add(resData.ListWeek[0].Date, 'd', i), 'MM.dd'),
              weekName: this.xy.getChinesesWeekForNumSmall(i),
              Date: this.dateFun.format(this.dateFun.add(resData.ListWeek[0].Date, 'd', i), 'yyyy-MM-dd')
            })
            that.newWeekData.push(this.dateFun.format(resData.ListWeek[0].Date, 'yyyy.') + this.dateFun.format(this.dateFun.add(resData.ListWeek[0].Date, 'd', i), 'MM.dd'))
          };
          for (let k = 0; k < resData.ListWeek.length; k++) {
            that.sectionData.push({
              val: k + 1,
              name: k + 1 + '周'
            })
            that.weekSelectData.push({
              key: resData.ListWeek[k].Key,
              val: resData.ListWeek[k].Date,
              name: resData.ListWeek[k].Week + '（' +
                this.dateFun.format(resData.ListWeek[k].Date, 'MM.dd') + '-' +
                this.dateFun.format(this.dateFun.add(resData.ListWeek[k].Date, 'd', 6), 'MM.dd') +
                '）'
            })
          };
          that.weekCur = resData.ListWeek[0].Key
          that.weekDateName = that.weekSelectData[0].name
        }
        this.xy.unloading()
      },
      // 周次改变
      weekChange: function (res) {
        let index = this.weekSelectData.map(function (item) { return item.key }).indexOf(res)
        this.weekData = []
        this.newWeekData = []
        for (let i = 0; i < 7; i++) {
          this.weekData.push({
            date: this.dateFun.format(this.dateFun.add(this.weekSelectData[index].val, 'd', i), 'MM.dd'),
            weekName: this.xy.getChinesesWeekForNumSmall(i),
            Date: this.dateFun.format(this.dateFun.add(this.weekSelectData[index].val, 'd', i), 'yyyy-MM-dd')
          })
          this.newWeekData.push(this.dateFun.format(this.weekSelectData[index].val, 'yyyy.') + this.dateFun.format(this.dateFun.add(this.weekSelectData[index].val, 'd', i), 'MM.dd'))
        };
        this.weekDateName = this.weekSelectData[index].name
        $('.subject').removeClass('is-active')
        this.leftSubjectInfo = ''
        $('.teacher-ul li').removeClass('right-tacher-active')
        this.isActiveTeacher = ''
        if (this.searchTeacher !== '' && this.searchTeacher !== undefined && this.searchTeacher != null) {
          this.getWeekTimeTable(this.weekCur, this.searchTeacher)
        }
      },
      // 搜索老师
      async getTeachers () {
        let that = this
        this.isConfirm = true
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/GetTeachers`)
        if (res.success) {
          that.teacherList = res.data
          that.isConfirm = false
          that.getWeek()
        } else {
          this.xy.unloading()
        };
      },
      // 获取周课表
      async getWeekTimeTable (key, teacherID) {
        let that = this
        if (teacherID === '' || teacherID === undefined || teacherID == null) {
          this.xy.msgError('请选择教师。')
          return false
        }
        let index = that.weekSelectData.map(function (item) { return item.key }).indexOf(key.toString())
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/GetWeekTimeTable`, {
          classTableGenerateForSubstituteTeacherID: that.classTableGenerateForSubstituteTeacherID,
          startDate: that.weekSelectData[index].val,
          teacherID: teacherID.split('/')[0]
        })

        if (res.success) {
          that.tableTimes = res.data.Times
          that.tableData = res.data.TimeTables
          let array = []
          for (let i = 0; i < that.tableData.length; i++) {
            let index = array.indexOf(`${that.tableData[i].CoursePlanAID}-${this.tableData[i].CoursePlanAIDType}`)
            if (index > -1) {
              that.tableData[i].bg = this.xy.colors(index).color
            } else {
              that.tableData[i].bg = this.xy.colors(array.length).color
              array.push(`${this.tableData[i].CoursePlanAID}-${that.tableData[i].CoursePlanAIDType}`)
            }
          }
          $('.subject').removeClass('is-active')
        }
        this.xy.unloading()
      },
      // 课程点击
      subjectClick: function (event, data) {
        if (data.IsHasSubstituteTeacher) {
          this.xy.msgError('该课位已安排代课，不可重复安排。如需更改代课教师，请把原代课安排取消。')
        } else {
          let targe = $(event.currentTarget)
          $('.subject').removeClass('is-active')
          targe.addClass('is-active')
          this.leftSubjectInfo = data
          this.getTeachersByBase(data.ClassTableGenerateBaseID, this.curTab)
        }
      },
      // 可代课教师
      async getTeachersByBase (classTableGenerateBaseID, type) {
        let that = this
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/GetTeachersByBase`, {
          classTableGenerateBaseID: classTableGenerateBaseID,
          searchType: type,
          effectiveWeek: that.sectionCur,
          teacherID: that.searchTeacher.split('/')[0]
        })
        if (res.success) {
          that.rightTeacherData = res.data
          $('.teacher-ul li').removeClass('right-tacher-active')
          that.isActiveTeacher = ''
        }
        this.xy.unloading()
      },
      tabClick: function (val) {
        $('.teacher-ul li').removeClass('right-tacher-active')
        this.isActiveTeacher = ''
        if (this.leftSubjectInfo !== '') {
          this.getTeachersByBase(this.leftSubjectInfo.ClassTableGenerateBaseID, val)
        }
      },
      // 右侧老师点击
      async rigthTeacher (event, teacher) {
        if (!teacher.IsConflict) {
          let targe = $(event.currentTarget)
          $('.teacher-ul li').removeClass('right-tacher-active')
          targe.addClass('right-tacher-active')
          this.isActiveTeacher = teacher
          let that = this
          let index = that.weekSelectData.map(function (item) { return item.key }).indexOf(that.weekCur.toString())
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/GetWeekTimeTable`, {
            classTableGenerateForSubstituteTeacherID: that.classTableGenerateForSubstituteTeacherID,
            startDate: that.weekSelectData[index].val,
            teacherID: teacher.TeacherID
          })
          if (res.success) {
            that.leftBottomData = res.data.TimeTables
          }
          this.xy.unloading()
        }
      },
      // 选择代课教师
      async saveSub () {
        let that = this
        if (this.isActiveTeacher === '') {
          this.xy.msgError('请选择代课教师。')
          return false
        }
        if (this.leftSubjectInfo === '') {
          this.xy.msgError('请选择代课课程。')
          return false
        }
        let postData = {
          ClassTableGenerateForSubstituteTeacherID: that.classTableGenerateForSubstituteTeacherID,
          ClassTableGenerateBaseID: this.leftSubjectInfo.ClassTableGenerateBaseID,
          SourceTeacherID: this.searchTeacher.split('/')[0],
          Week: this.weekCur,
          EffectiveWeek: this.sectionCur,
          Detial: {
            ClassTableID: this.leftSubjectInfo.ClassTableID,
            CollectionID: this.leftSubjectInfo.CollectionID,
            CoursePlanTableFullName: this.leftSubjectInfo.CoursePlanTableFullName,
            SubjectName: this.leftSubjectInfo.SubjectName,
            CoursePlanAID: this.leftSubjectInfo.CoursePlanID,
            CoursePlanAIDType: this.leftSubjectInfo.CoursePlanAIDType,
            Week: this.weekCur,
            StartDate: this.leftSubjectInfo.ClassDate,
            AMorPM: this.leftSubjectInfo.AMorPM,
            AMorPMOrder: this.leftSubjectInfo.AMorPMOrder,
            Day: this.leftSubjectInfo.Day,
            Time: this.leftSubjectInfo.Time,
            SubstituteTeacherID: this.isActiveTeacher.TeacherID,
            LastModifyByID: 0,
            ClassTableGenerateBaseID: this.leftSubjectInfo.ClassTableGenerateBaseID
          }
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/SaveSub`, postData)
        if (res.success) {
          that.isConfirm = true
          that.classTableGenerateForSubstituteTeacherID = res.data
          that.getTeachersByBase(that.leftSubjectInfo.ClassTableGenerateBaseID, that.curTab)
          that.getWeekTimeTable(that.weekCur, that.searchTeacher)
          that.getSubstituteInfo()
          that.leftSubjectInfo = ''
        } else {
          this.xy.unloading()
        }
      },
      // 清除记录
      async clearRecord (item, index, tag) {
        let that = this
        if (tag === 1) {
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/DeleteDetail`, {
            id: item.ClassTableGenerateForSubstituteTeacherDetailID
          })
          if (res.success) {
            this.xy.msgSuc('清除成功。')
            $('.subject').removeClass('is-active')
            that.recordData.splice(index, 1)
            that.getWeekTimeTable(that.weekCur, that.searchTeacher)
          } else {
            this.xy.unloading()
          }
        } else {
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/Delete`, {
            id: that.classTableGenerateForSubstituteTeacherID
          })
          if (res.success) {
            this.xy.msgSuc('清除成功。')
            $('.subject').removeClass('is-active')
            that.classTableGenerateForSubstituteTeacherID = 0
            that.isConfirm = false
            that.recordData = []
            that.getWeekTimeTable(that.weekCur, that.searchTeacher)
          } else {
            this.xy.unloading()
          }
        }
        this.isShowRecords = false
      },
      // 取消调课
      cancel: function () {
        let that = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要取消当前代课信息吗？',
          async onOk () {
            that.xy.loading()
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/Delete`, {
              id: that.classTableGenerateForSubstituteTeacherID
            })
            if (res.success) {
              that.xy.msgSuc('取消成功。')
              that.classTableGenerateForSubstituteTeacherID = 0
              that.$store.commit('common/getThreeMenuName', '')
              that.$router.push({ path: `/xyhome/substituteTable`, query: that.$store.state.common.menuInfo })
            } else {
              that.xy.msgError(res.msg)
            };
            that.xy.unloading()
          }
        })
      },

      // 完成调课
      async completeSub () {
        let that = this
        this.xy.loading()
        let tid = that.searchTeacher.split('/')[0]
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SubstituteCourseAdjustmentCourse/CompleteSubstituteTeacher?classTableGenerateForSubstituteTeacherID=` +
          that.classTableGenerateForSubstituteTeacherID + '&effectiveWeek=' + that.sectionCur +
          '&sourceTeacherID=' + tid, null, true)

        if (res.success) {
          that.getNotifyInfo()
        } else {
          this.xy.unloading()
          this.$Modal.error({
            content: res.msg,
            onOk: function () {
              that.clearRecord()
            }
          })
          that.tableData.map(function (ele) {
            // eslint-disable-next-line no-return-assign
            return ele.IsHasSubstituteTeacher = false
          })
          // eslint-disable-next-line no-unused-expressions
          that.recordData.length < 0
        }
      },
      // 调课通知页面数据
      getNotifyInfo: function () {
        this.$store.commit('common/getThreeMenuName', '代课通知')
        this.$store.commit('common/getParam', { classTableGenerateForSubstituteTeacherID: this.classTableGenerateForSubstituteTeacherID, loadSource: 2 })
        this.$router.push({ path: `/xyhome/adjustNotice`, query: this.$store.state.common.menuInfo })
      }
    }

  }
</script>
<style  lang='less' scoped>
.table {
  border: 1px solid #ddd;
  text-align: center;
  /*cursor: pointer;*/
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 14px;
}
.table thead th {
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  background-color: #f8f8f9;
  box-sizing: border-box;
  text-align: center;
  text-overflow: ellipsis;
  vertical-align: middle;
  border-bottom: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
  font-weight: bold;
}
.table tbody td {
  height: 40px;
  box-sizing: border-box;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
  position: relative;
  padding: 12px;
  cursor: pointer;
}
.subject {
  padding: 6px 10px;
  margin: 5px auto;
  background: #f5f5f5;
  border-radius: 5px;
}
.is-active {
  background: -webkit-linear-gradient(to left, top, #66cffe, #2b7aeb) !important;
  background: -o-linear-gradient(to bottom, right, #66cffe, #2b7aeb) !important;
  background: -moz-linear-gradient(to bottom, right, #66cffe, #2b7aeb) !important;
  background: linear-gradient(to bottom right, #66cffe, #2b7aeb) !important;
  transition: all 1s;
}
.no-chose {
  background: #ddd !important;
}
.filter-state {
  width: 100%;
  // background-color: rgba(149, 181, 255, 0.24) !important;
  text-align: center;
  margin: 17px 0 22px;
  font-size: 12px;
  // color: #666;
  color: rgba(0, 0, 0, 1);
  opacity: 0.25;
  border-radius: 5px;
  overflow: hidden;
  cursor: default;
  border: none;
}

.right-substitute-teacher h2 {
  height: 40px;
  line-height: 40px;
  padding-left: 15px;
  background-color: #f8f8f9;
  border-bottom: 1px solid #e8eaec;
}
.tap-content {
  max-height: 500px;
  overflow-y: auto;
}
.teacher-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 10px 0px;
}
.teacher-ul li {
  margin: 0 8px 8px 0;
  padding: 3px 8px;
  background: #f3f3f3;
  cursor: pointer;
  border-radius: 5px;
}
.teacher-ul li:hover {
  background: #2b7aeb;
  color: #fff;
}
.no-chose-teacher {
  color: #ddd !important;
}
.no-chose-teacher:hover {
  color: #ddd !important;
  background: #f3f3f3 !important;
}
.right-tacher-active {
  background: #2b7aeb !important;
  color: #fff;
}
.teacher-ul li > span {
  margin-right: 5px;
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
  background: -webkit-linear-gradient(to left, #66cffe, #2b7aeb);
  background: -o-linear-gradient(to right, #66cffe, #2b7aeb);
  background: -ms-linear-gradient(to left, #66cffe, #2b7aeb);
  background: -moz-linear-gradient(to left, #66cffe, #2b7aeb);
  background: linear-gradient(to right, #66cffe, #2b7aeb);
  color: #fff;
}
.history-record > ul > .course-li-box > .record-top {
  display: block;
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 11px;
}
.history-record > ul > .course-li-box > .record-top > .record-class {
  display: block;
  font-weight: bold;
  font-size: 17px;
  // vertical-align: bottom;
}
.history-record > ul > .course-li-box > .record-top > .record-time {
  display: block;
  font-weight: normal;
  font-size: 14px;
  // vertical-align: bottom;
  margin-top: 5px;
}
.history-record > ul > .course-li-box > .fa {
  position: absolute;
  left: 0px;
  bottom: -10px;
  font-size: 80px;
  opacity: 0.5;
  transition: all 0.3s;
}
.history-record > ul > .course-li-box:hover .fa {
  opacity: 0.8;
}
.history-record > ul > .course-li-box > .fa:hover {
  opacity: 0.8;
}
//改动的样式
.btn-box {
  display: flex;
  justify-content: space-between;
}
.xy-primary {
  margin-right: 0;
}
// 代课记录样式
.substitute-record {
  top: 45px;
  position: absolute;
  right: 0;
  border: 1px solid;
  width: 410px;
  z-index: 3;
  background: #fff;
  border: 1px solid rgba(217, 217, 217, 1);
  box-shadow: 0px 4px 8px 0px rgba(216, 216, 216, 0.5);
  border-radius: 4px;
  min-height: 100px;
  max-height: 439px;
  overflow: auto;
  li {
    padding: 10px;
    border-bottom: 1px dashed rgba(0, 0, 0, 0.45);
    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .top {
      button {
        color: rgb(24, 144, 255);
      }
    }
    .bottom {
      color: rgba(0, 0, 0, 1);
      opacity: 0.45;
    }
  }
}
.substitute-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  p {
    margin-right: 15px;
    flex: 1;
  }
  .select-title {
    width: 400px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.tab-substitute {
  display: flex;
  .table {
    flex: 1;
    margin-right: 15px;
  }
  .right-substitute-teacher {
    width: 400px;
    border: 1px solid #e8eaec;
    section {
      padding: 10px 0 0 10px;
    }
  }
}

.fix-btn {
  height: 50px;
  position: fixed;
  line-height: 50px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: right;
  button {
    margin-right: 30px;
  }
}
</style>
