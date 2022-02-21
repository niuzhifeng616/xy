<template>
  <div class="xy-content-module">
    <div class="xy-content-title flex-flow">
        <div>
            <Button class="xy-primary"  @click="creatSubstitute(true)">按班级调课</Button>
            <Button class="xy-info"  @click="creatSubstitute(false)">按教师调课</Button>
            <Button class="xy-info"  @click="startClashModal">冲突校验</Button>
        </div>
        <div>
            <Select
                v-model="schoolID"
                @on-change="schoolChange"
                class="xy-content-title-search"
                style="width:150px;margin-right:10px">
                <Option :value="0">所有校区</Option>
                <Option v-for="item in schoolData"
                :value="item.SchoolDistrictID"
                :key="item.SchoolDistrictID" v-cloak>{{ item.SchoolDistrictName }}</Option>
            </Select>
            <Cascader :data="yearSessionData" v-model="yearSession" @on-change="cascaderChange" style="width:200px;display:inline-block"></Cascader>
        </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        nullData="该搜索条件下没有结果。"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange">
        <!-- 调课班级 -->
        <div slot="StudentOrganizationFullNameRender" slot-scope="text, record" style="min-width:200px">
          <span class="table-el-hover" v-if="record.Status === 0" @click="conteinueCreat(record)">
            {{record.StudentOrganizationFullName}}
          </span>
          <span v-else style="min-width:200px">
            {{record.StudentOrganizationFullName}}
          </span>
        </div>
        <!-- 状态 0未完成，1完成，2已撤销 -->
        <div slot="StatusNameRender" slot-scope="text, record">
          <i class="iconfont icon-info" v-if="record.Status === 0">&#xe719;</i>
          <i class="iconfont icon-success" v-if="record.Status === 1">&#xe719;</i>
          <i class="iconfont icon-default" v-if="record.Status === 2">&#xe719;</i>
          <span>
            {{record.StatusName}}
          </span>
        </div>
        <!-- 操作 -->
        <span slot="operaRender" slot-scope="text, record">
          <a @click="conteinueCreat(record)" :disabled="record.Status !== 0">继续调课</a>
          <a-divider type="vertical" />
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item :disabled="record.Status !== 1" @click="getNotifyInfo(record)">详情</a-menu-item>
              <a-menu-item :disabled="record.Status !== 1" @click="getCancel(record)">撤销</a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </XyAntTable>
    </div>
    <!-- 按班级调课 -->
    <Modal v-model="selectClassModal" :transfer="false" :mask-closable="false" :closable="false">
        <p slot="header">按班级调课</p>
        <div class="dialog-model-content">
            <Tabs :animated="false">
                <TabPane v-for="(item,index) in classData" :label="item.SchoolDistrictName" :key="index">
                    <div class="select-school">
                        <div class="select-grade" v-for="(gradeItem,gIndex) in item.YearList" :key="gIndex">
                            <div class="select-grade-name">{{gradeItem.name}}</div>
                            <span class="select-class" v-cloak
                                @click="selectClass = childclass"
                                :class="childclass.StudentOrganizationID==selectClass.StudentOrganizationID?'active-class':''"
                                v-for="(childclass,iIndex) in gradeItem.classList" :key="iIndex">
                                {{childclass.StudentOrganizationName}}
                            </span>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="selectClassModal = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="selectClassSubmit">保存</Button>
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
            <Select v-model="searchTeacher"          ref="teacherRef"
                      placeholder="请输入用户名/工号/姓名"
                      filterable
                      remote
                      :loading='loading1'
                      :remote-method="remoteMethod1"
                      @on-change="teacherChange"
                      style="width:30%;">
                 <Option v-for="(option) in optionList" :value="option.val" :key="option.UserID" >
                   {{option.FullName}}
                  </Option>
            </Select>
            <Select v-model="weekCur"
                      @on-change="weekChange"
                      class="xy-content-title-search"
                      style="width:250px">
                <Option v-for="item in weekSelectData" :value="item.key" :key="item.key">{{item.name}}</Option>
            </Select>
            <div v-if="teacherCPTable !=''" style="margin-top:10px;">
                <table class="table class-table" style="height:100%">
                    <thead>
                        <tr>
                            <th style="width:30px;"></th>
                            <th v-for="(week,i) in weekTop" :key="i">
                                <span v-cloak>{{week.data}}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(time,i) in teacherCPTable.Times"
                            :key="i"
                            :style="{'background':time.AMorPM == 'NS' ? '#f3f3f3': ''}">
                            <td :style="{'padding':time.AMorPM == 'NS' ? '0': ''}">
                                {{ time.AMorPM != 'NS'  ? time.AMorPMOrderName: '' }}
                            </td>
                            <td v-for="(week,wIndex) in weekTop" :key="wIndex">
                                <div class="td-subject"
                                     :class="subject.ClassTableGenerateBaseID==selectTeacherSub.ClassTableGenerateBaseID?'table-sub-active':''"
                                     v-for="(subject,dataIndex) in teacherCPTable.TimeTables"
                                     :key="dataIndex"
                                     @click="selectTeacherSub=subject">
                                     <div v-if="subject.AMorPM === time.AMorPM &&subject.AMorPMOrder === time.AMorPMOrder &&subject.Day === wIndex">
                                        <p class="nowrap" :title="subject.SubjectName" v-cloak>{{subject.SubjectName}}</p>
                                        <p class="nowrap" :title="subject.CoursePlanTableFullName" v-cloak>{{subject.CoursePlanTableFullName}}</p>
                                     </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="teacherCPTable ===''" class="modal-null">
                 <img class="img" :src="require('@/assets/common/nullData.svg')"/>
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
    <!-- 冲突校验 -->
    <Modal v-model="modalStartClash"
          :closable="false"
          :mask-closable="false"
          width="448"
          :transfer="false">
        <p slot="header" style="color:rgba(0,0,0,1);font-size:16px;">上课冲突校验</p>
        <div>
            <div v-if="!isCheck">
                <Row>
                        <div :class="isClashDateTye === 1?'active-load':'box-topblock-week'" name="dateblock" @click="selectClashDate(1)">
                            <div class="topblock-tit">本周</div>
                            <div class="topblock-time">
                                <span>{{clashStartDate}}</span>
                                <span>~</span>
                                <span>{{clashEndDate}}</span>
                            </div>
                        </div>
                </Row>
                <Row style="margin-top:20px;">
                        <div :class="isClashDateTye === 2?'active-load':'box-topblock-week'" name="dateblock" @click="selectClashDate(2)">
                            <div class="topblock-tit">下周</div>
                            <div class="topblock-time">
                                <span>{{clashNextStartDate}}</span>
                                <span>~</span>
                                <span>{{clashNextEndDate}}</span>
                            </div>
                        </div>
                </Row>
               <Row style="margin-top:20px;">
                  <!-- <i-col  span="8"> -->
                        <div :class="isClashDateTye === 3?'active-load':'box-topblock-week'" name="dateblock" @click="selectClashDate(3)">
                            <div class="topblock-tit">本月</div>
                            <div class="topblock-time">
                                <span>{{clashStartDate}}</span>
                                  <span>~</span>
                                <span>{{clsshEndMonthDate}}</span>
                            </div>
                        </div>
                </Row>
                <Form style="margin-top:20px;position:relative">
                  <FormItem label="校验时间段" label-position='left'   :label-width="85"
                      @click.native="selectClashDate(4)"
                      label-for="time">
                    <DatePicker type="date" element-id='time' v-model="pickerStartDate" placeholder="请选择时间" style="width: 126px;display:inline-block"></DatePicker>
                    <span>&nbsp;-&nbsp;</span>
                    <DatePicker type="date" v-model="pickerEndDate" placeholder="请选择时间" style="width: 126px;display:inline-block"></DatePicker>
                  </FormItem>
                </Form>
            </div>
            <div class="startCheck" v-if="isCheck">
                <div class="generate-course-results">
                    <span class="iconfont" v-if="!isComplete" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
                    <span class="results-notice" v-if="!isComplete"> 正在进行上课冲突校验，请勿进行其他操作。</span>
                    <span class="results-notice" v-if="isComplete">校验完成</span>
                </div>
                <div class="result-head" style="margin-top:20px;">
                    <span>数据队列：</span>
                    <span style="margin-left:5px;" v-cloak>{{curDay+1}}/{{totalDay}}</span>
                </div>
                <ul class="clearfix check-list">
                    <li data-index="0" class="complete-option" v-for="(item,i) in enableInfo" :key="i">
                        <!-- 等待 -->
                        <span class="state-complete" v-if="item.status === 0">
                            <span class="generate-text" v-cloak>正在等待，正在检查{{item.curDate}}里的上课冲突。</span>
                        </span>
                        <!-- 进行中 -->
                        <span v-if="item.status == 1">
                            <span class="data-list-state">
                                <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                            </span>
                            <span class="generate-text" v-cloak>正在进行，正在检查{{item.curDate}}里的上课冲突。</span>
                            <i-progress :percent="percentVal" status="active" :stroke-width="16" />
                        </span>
                        <!-- 成功 -->
                        <span v-if="item.status == 2">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="ios-checkmark-circle" />
                            </span>
                            <span class="generate-text" v-cloak>成功，正在检查{{item.curDate}}里的上课冲突。</span>
                        </span>
                        <!-- 失败 -->
                        <span v-if="item.status == 3">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="md-close-circle" color="#ed4014" />
                            </span>
                            <span class="generate-text" v-cloak>失败，正在检查{{item.curDate}}里的上课冲突。</span>
                            <span style="color:#2d8cf0;cursor:pointer" @click="exprot(item)">导出详情</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div slot="footer">
            <div v-if="!isCheck">
                <Button class="xy-modal-close" @click="modalStartClash = false">取消</Button>
                <Button  class="xy-modal-primary"  shape="circle" @click="startClash">确定</Button>
            </div>
            <div v-if="isCheck && isComplete">
                <Button class="xy-modal-primary"  shape="circle" @click="modalStartClash = false">关闭</Button>
            </div>
        </div>
    </Modal>
    <!-- 撤销 -->
    <Modal v-model="modalCancel"
           :transfer="false"
           :mask-closable="false"
           :closable="false">
        <p slot="header">撤销</p>
        <p style="margin-bottom:5px;font-size:14px;">您确定要撤销吗？请输入“<span style="color:#ed4014">撤销</span>”确认。</p>
        <div>
            <Input v-model="cancelText" placeholder="请输入“撤销”进行确认"/>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="canceldb">取消</Button>
            <Button class="xy-modal-primary"  shape="circle" @click="cancelBtn">确定</Button>
        </div>
    </Modal>
    <!-- 确认撤销后的弹框 -->
    <Modal v-model="modalError"
           :transfer="false"
           :mask-closable="false"
           :closable="false">
        <p slot="header">错误信息</p>
        <p style="margin-bottom:5px;font-size:14px;">请点击下载错误信息查看</p>
        <div slot="footer">
            <Button class="xy-modal-close"  @click="modalError=false">关闭</Button>
            <Button class="xy-modal-primary"  shape="circle" @click="errorBtn">下载错误信息</Button>
        </div>
    </Modal>
</div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    data () {
      return {
        loading1: false,
        tableLoading: true,
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        datatable: [],
        columns: [
          {
            title: '调课班级',
            dataIndex: 'StudentOrganizationFullName',
            scopedSlots: { customRender: 'StudentOrganizationFullNameRender' }
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 200
          },
          {
            title: '调课人',
            dataIndex: 'TeacherName',
            width: 120
          },
          {
            title: '创建时间',
            dataIndex: 'CreateByDateName',
            width: 150
          },
          {
            title: '有效',
            dataIndex: 'EffectiveWeek',
            width: 100
          },
          {
            title: '状态',
            dataIndex: 'StatusName',
            scopedSlots: { customRender: 'StatusNameRender' },
            width: 120
          },
          {
            title: '操作',
            dataIndex: 'opera',
            scopedSlots: { customRender: 'operaRender' },
            width: 180
          }
        ],
        schoolID: 0, // 校区
        schoolData: [], // 校区
        yearSessionData: [], // 学年学期
        yearSession: [0, 0], // 学年学期
        isCreat: false, // 是否是创建还是继续
        // 撤销错误信息
        modalCancel: false,
        modalError: false,
        cancelText: '',
        textError: [],
        // 按班级调课
        selectClassModal: false,
        classData: [],
        selectClass: {},
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
        teacherCPTable: '',
        selectTeacherSub: {},
        weekSelectData: [],
        weekCur: '',
        // 冲突校验
        modalStartClash: false, // 冲突校验
        isClashDateTye: 1,
        clashStartDate: new Date(), // 当天日期
        clashEndDate: '', // 当周最后一天日期
        clashNextStartDate: '', // 下周第一天日期
        clashNextEndDate: '', // 下周最后一天日期
        clsshEndMonthDate: '', // 当月最后一天日期
        pickerStartDate: new Date(),
        pickerEndDate: new Date(),
        isCheck: false, //
        isComplete: false,
        enableInfo: [],
        totalDay: '',
        curDay: 0,
        percentVal: 0,
        // 调课通知
        modalClassNotice: false,
        curAID: '',
        adjustmentReason: '',
        isNotice: false,
        notifyInfoData: [],
        isShowReason: true,
        rowItem: ''
      }
    },
    created () {
      this.clashStartDate = this.xy.moment(new Date()).format('YYYY-MM-DD')
      this.clashEndDate = this.xy.moment().week(this.xy.moment().week()).endOf('week').format('YYYY-MM-DD')
      this.clashNextStartDate = this.xy.moment(this.clashEndDate).add(1, 'd').format('YYYY-MM-DD')
      this.clashNextEndDate = this.xy.moment(this.clashEndDate).add(7, 'd').format('YYYY-MM-DD')
      this.clsshEndMonthDate = this.xy.moment().week(this.xy.moment().week()).endOf('month').format('YYYY-MM-DD')
      this.getSchool()
    },
    mounted: function () {

    },
    methods: {
      // 获取校区
      async getSchool () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        if (res.success) {
          this.schoolData = res.data
          this.getSessionNodeList()
        }
      },
      schoolChange (val) {
        this.pagination.current = 1
        this.schoolID = val
        this.getList()
      },
      // 获取学年获取学期
      async getSessionNodeList () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          this.yearSessionData = res.data
          this.yearSession = []
          var index = this.yearSessionData.map((item) => { return item.IsCurrent }).indexOf(true)
          if (index !== -1) {
            this.yearSession.push(this.yearSessionData[index].value)
            var index1 = this.yearSessionData[index].children.map((item) => { return item.IsCurrent }).indexOf(true)
            if (index1 !== -1) {
              this.yearSession.push(this.yearSessionData[index].children[index1].value)
            }
          } else {
            for (var i = 0; i < this.yearSessionData.length; i++) {
              if (this.yearSessionData[i].children.length > 0) {
                this.yearSession = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                return false
              }
            }
          }
          this.getList()
        }
      },
      cascaderChange (value, selectedData) {
        if (value.length === 2) {
          this.yearSession = value
          this.pagination.current = 1
          this.academicSessionID = value[1]
          this.getList()
        }
      },
      // 获取列表数据
      async getList () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/GetList`, {
          schoolDistrictID: this.schoolID,
          academicSessionID: this.yearSession[1],
          pageIndex: this.pagination.current ? this.pagination.current : 1,
          pageSize: this.pagination.pageSize
        })
        this.xy.unloading()
        if (res.success) {
          this.datatable = res.data.data
          this.pagination.total = res.data.totalRecords
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.getList()
      },
      // 按班级调课
      async getClassTree () { // 获取班级树
        this.selectClass = {}
        let res = await this.xy.get(`${this.xyApi}/base/api/StudentOrganizationMember/GetTree`, {
          isShowAll: false,
          curNodeInfo: '',
          isSetCount: true
        })
        if (res.success) {
          var dataList = res.data
          this.classData = []
          for (var i = 0; i < dataList.length; i++) {
            this.classData.push({
              SchoolDistrictID: dataList[i].SchoolDistrictID,
              SchoolDistrictName: dataList[i].SchoolDistrictName,
              YearList: []
            })
            if (dataList[i].YearList.length > 0) {
              for (var j = 0; j < dataList[i].YearList.length; j++) {
                if (dataList[i].YearList[j].GradeList.length > 0) {
                  for (var k = 0; k < dataList[i].YearList[j].GradeList.length; k++) {
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
        this.xy.unloading()
      },
      selectClassSubmit: function () {
        if (this.selectClass === {}) {
          this.xy.msgError('请选择班级。')
        } else {
          this.selectTeacherSub = {}
          let loadParams = {
            selectClass: this.selectClass,
            selectTeacherSub: this.selectTeacherSub,
            sourceWeek: this.weekCur,
            isContinue: false
          }
          this.$store.commit('csmstimetable/changeAdjustTableRow', loadParams)
          this.$store.commit('common/getThreeMenuName', '单周调课')
          this.$store.commit('common/getParam', { pro: 'adjustmentTable' })
          this.$router.push({
            path: '/xyhome/creatAdjustment',
            query: this.$store.state.common.menuInfo
          })
        }
      },
      // 按教师调课
      async getTeachers () {
        this.teacherCPTable = []
        this.searchTeacher = ''
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/GetTeachers`)
        if (res.success) {
          this.teacherList = res.data
          this.getWeek()
        }
        this.xy.unloading()
      },
      async getWeek () { // 获取周次
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetWeek`)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          this.weekSelectData = []
          for (var k = 0; k < resData.ListWeek.length; k++) {
            this.weekSelectData.push(
              {
                key: resData.ListWeek[k].Key,
                val: resData.ListWeek[k].Date,
                name: resData.ListWeek[k].Week + '（' +
                  this.xy.moment(this.xy.moment(resData.ListWeek[k].Date)).format('MM.DD') + '-' +
                  this.xy.moment(this.xy.moment(resData.ListWeek[k].Date).add(6, 'd')).format('MM.DD') +
                  '）'
              }
            )
          };
          if (resData.ListWeek.length > 0) {
            this.weekCur = resData.ListWeek[0].Key
          }
          this.modalChoseTeacher = true
        }
      },
      weekChange (val) { // 周次change
        this.weekCur = val
        if (this.searchTeacher !== '') {
          this.getTeachersWeekTime()
        }
      },
      async getTeachersWeekTime () {
        var index = this.weekSelectData.map((item) => { return item.key }).indexOf(this.weekCur)
        var dateVal = ''
        if (index !== -1) {
          dateVal = this.weekSelectData[index].val
        }
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/GetTeacherWeekTimeCPTable`, {
          teacherID: this.searchTeacher.split('/')[0],
          date: dateVal
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
            this.optionList = this.teacherList.filter((item) => {
              let str = `${item.UserID}/${item.FullName}/${item.UserName}/${item.SchoolCardNumber}`
              item.val = str
              return (str.indexOf(query) > -1)
            })
            this.loading1 = false
          }, 200)
        } else {
          this.optionList = []
        }
      },
      teacherChange (val) {
        this.searchTeacher = val
        // console.log(val, this.searchTeacher)
        if (this.searchTeacher !== '' && this.searchTeacher !== undefined) {
          this.getTeachersWeekTime()
        }
      },
      choseTeacherSubmit () {
        if (this.selectTeacherSub === '') {
          this.xy.msgError('请选择课程。')
        } else {
          this.selectClass = {}
          let loadParams = {
            selectClass: this.selectClass,
            selectTeacherSub: this.selectTeacherSub,
            sourceWeek: this.weekCur,
            isContinue: false
          }
          this.$store.commit('csmstimetable/changeAdjustTableRow', loadParams)
          this.$store.commit('common/getThreeMenuName', '单周调课')
          this.$store.commit('common/getParam', { pro: 'adjustmentTable' })
          this.$router.push({
            path: '/xyhome/creatAdjustment',
            query: this.$store.state.common.menuInfo
          })
        }
      },
      // 创建 单周调课
      async creatSubstitute (classOrTeacher) {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/GetModel`)
        if (res.success) {
          let resData = res.data
          if (resData.ClassTableGenerateForStudentOrganizationID > 0) {
            this.greatTip(resData)
          } else {
            if (classOrTeacher) { // 按班级调课
              this.getClassTree()
            } else { // 按教师调课
              this.getTeachers()
            }
          }
        }
      },
      greatTip (resData) {
        this.xy.unloading()
        this.$Modal.confirm({
          title: '温馨提示',
          content: '你有尚未完成的调课任务，请先完成再新建，点击“确认”去完成调课任务。',
          onOk: () => {
            resData.FullName = resData.StudentOrganizationName
            if (resData.IsCrossWeeks) {
              let loadParams = {
                classTableGenerateForStudentOrganizationID: resData.ClassTableGenerateForStudentOrganizationID,
                studentOrganizationFullName: resData.StudentOrganizationName,
                studentOrganizationID: resData.StudentOrganizationID,
                sourceWeek: resData.SourceWeek,
                effectiveWeek: resData.EffectiveWeek,
                schoolDistrictID: resData.SchoolDistrictID,
                selectClass: resData,
                selectTeacherSub: '',
                isContinue: true
              }
              this.$store.commit('csmstimetable/changeAdjustTableRow', loadParams)
              this.$store.commit('common/getThreeMenuName', '跨周调课')
              this.$store.commit('common/getParam', { pro: 'adjustmentTable' })
              this.$router.push({
                path: '/xyhome/acrossWeek',
                query: this.$store.state.common.menuInfo
              })
            } else {
              let loadParams = {
                classTableGenerateForStudentOrganizationID: resData.ClassTableGenerateForStudentOrganizationID,
                studentOrganizationFullName: resData.StudentOrganizationName,
                studentOrganizationID: resData.StudentOrganizationID,
                effectiveWeek: resData.EffectiveWeek,
                sourceWeek: resData.SourceWeek,
                selectClass: resData,
                selectTeacherSub: '',
                isContinue: true
              }
              this.$store.commit('csmstimetable/changeAdjustTableRow', loadParams)
              this.$store.commit('common/getThreeMenuName', '单周调课')
              this.$store.commit('common/getParam', { pro: 'adjustmentTable' })
              this.$router.push({
                path: '/xyhome/creatAdjustment',
                query: this.$store.state.common.menuInfo
              })
            }
          }
        })
      },
      // 继续
      conteinueCreat (row) {
        if (row.Status === 0) {
          row.FullName = row.StudentOrganizationName
          if (row.IsCrossWeeks) {
            let loadParams = {
              classTableGenerateForStudentOrganizationID: row.ClassTableGenerateForStudentOrganizationID,
              studentOrganizationFullName: row.StudentOrganizationName,
              studentOrganizationID: row.StudentOrganizationID,
              sourceWeek: row.SourceWeek,
              effectiveWeek: row.EffectiveWeek,
              schoolDistrictID: row.SchoolDistrictID,
              selectClass: row,
              selectTeacherSub: '',
              isContinue: true
            }
            this.$store.commit('csmstimetable/changeAdjustTableRow', loadParams)
            this.$store.commit('common/getThreeMenuName', '跨周调课')
            this.$store.commit('common/getParam', { pro: 'adjustmentTable' })
            this.$router.push({
              path: '/xyhome/acrossWeek',
              query: this.$store.state.common.menuInfo
            })
          } else {
            let loadParams = {
              classTableGenerateForStudentOrganizationID: row.ClassTableGenerateForStudentOrganizationID,
              studentOrganizationFullName: row.StudentOrganizationName,
              studentOrganizationID: row.StudentOrganizationID,
              effectiveWeek: row.EffectiveWeek,
              sourceWeek: row.SourceWeek,
              selectClass: row,
              selectTeacherSub: '',
              isContinue: true
            }
            this.$store.commit('csmstimetable/changeAdjustTableRow', loadParams)
            this.$store.commit('common/getThreeMenuName', '单周调课')
            this.$store.commit('common/getParam', { pro: 'adjustmentTable' })
            this.$router.push({
              path: '/xyhome/creatAdjustment',
              query: this.$store.state.common.menuInfo
            })
          }
        }
      },

      // 调课通知页面数据
      getNotifyInfo (row) {
        this.$store.commit('common/getThreeMenuName', '详情')
        this.$store.commit('common/getParam', { pro: 'adjustmentTable', classTableGenerateForStudentOrganizationID: row.ClassTableGenerateForStudentOrganizationID })
        this.$router.push({
          path: '/xyhome/adjustmentNotice',
          query: this.$store.state.common.menuInfo
        })
      },
      // 撤销
      getCancel: function (row) {
        this.modalCancel = true
        this.rowItem = row
      },
      canceldb: function () {
        this.modalCancel = false
        this.cancelText = ''
      },
      // 撤销
      async cancelBtn () {
        if (this.cancelText === '撤销') {
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/Revoke`, {
            ClassTableGenerateForStudentOrganizationID: this.rowItem.ClassTableGenerateForStudentOrganizationID
          }, true)
          if (res.success) {
            this.modalCancel = false
            this.cancelText = ''
            this.xy.msgSuc('撤销成功。')
            this.getList()
          } else {
            this.xy.msgError('撤销失败。')
            this.cancelText = ''
            this.modalCancel = false
            this.modalError = true
            this.textError = res.data
          }
        } else {
          this.xy.msgError('请输入撤销。')
        };
      },

      // 下载错误信息
      errorBtn: function () {
        let errorMsg = ''
        for (var i = 0; i < this.textError.length; i++) {
          errorMsg += this.textError[i] + '\r\n'
        }
        this.download('error.txt', errorMsg)
        this.modalError = false
      },
      download (fileName, content) {
        if (window.navigator.msSaveOrOpenBlob) {
          // if browser is IE
          var blob = new Blob([decodeURIComponent(encodeURI(content))], {
            type: 'text/csv;charset=utf-8;'
          })
          navigator.msSaveBlob(blob, fileName)
        } else {
          var urlObject = window.URL || window.webkitURL || window
          // eslint-disable-next-line camelcase
          var export_blob = new Blob([content], { type: 'text/plain' })
          // eslint-disable-next-line camelcase
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
          save_link.href = urlObject.createObjectURL(export_blob)
          save_link.download = fileName
          fakeClick(save_link)
        }
        function fakeClick (obj) {
          var ev = document.createEvent('MouseEvents')
          ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          obj.dispatchEvent(ev)
        }
      },

      // 冲突校验
      startClashModal () {
        this.isClashDateTye = 1
        this.pickerStartDate = new Date()
        this.pickerEndDate = new Date()
        this.isCheck = false
        this.isComplete = false
        this.enableInfo = []
        this.totalDay = ''
        this.curDay = 0
        this.percentVal = 0
        this.modalStartClash = true
      },
      selectClashDate (val) {
        console.log(val, 666)
        this.isClashDateTye = Number(val)
      },
      startClash () {
        this.isClashDateTye = Number(this.isClashDateTye)
        if (this.isClashDateTye === '') {
          this.xy.msgError(this, '请选择要检验的日期。')
          return false
        };
        var start = ''
        var end = ''
        if (this.isClashDateTye === 1) {
          start = this.clashStartDate
          end = this.clashEndDate
        };
        if (this.isClashDateTye === 2) {
          start = this.clashNextStartDate
          end = this.clashNextEndDate
        };
        if (this.isClashDateTye === 3) {
          start = this.clashStartDate
          end = this.clsshEndMonthDate
        };
        if (this.isClashDateTye === 4) {
          start = this.xy.moment(this.pickerStartDate).format('YYYY-MM-DD')
          end = this.xy.moment(this.pickerEndDate).format('YYYY-MM-DD')
        };
        if (new Date(start) > new Date(end)) {
          this.xy.msgError(this, '开始时间不能大于结束时间。')
          return false
        }
        this.totalDay = this.xy.moment(new Date(end)).diff(this.xy.moment(new Date(start)), 'days') + 1

        for (var i = 0; i < this.totalDay; i++) {
          this.enableInfo.push({
            curDate: this.xy.moment(this.xy.moment(new Date(start)).add(i, 'd')).format('YYYY-MM-DD'),
            status: 0,
            errorMsg: ''
          })
        };
        this.isCheck = true
        this.postGenerateTimeTable(0)
      },
      // 分步校验
      async postGenerateTimeTable (j) {
        if (j < this.enableInfo.length) {
          this.curDay = j
        }
        this.percentVal = 0
        this.enableInfo[j].status = 1
        this.percentFun()
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/StartClash`, {
          startDate: this.enableInfo[j].curDate,
          endDate: this.enableInfo[j].curDate
        }, true)
        this.xy.unloading()
        if (res.success) {
          this.enableInfo[j].status = 2
          this.percentVal = 100
          if (this.curDay + 1 < this.enableInfo.length) {
            this.curDay++
            this.postGenerateTimeTable(this.curDay)
          } else {
            this.isComplete = true
          }
        } else {
          this.percentVal = 100
          this.enableInfo[j].errorMsg = res.data
          this.enableInfo[j].status = 3
          if (this.curDay + 1 < this.enableInfo.length) {
            this.curDay++
            this.postGenerateTimeTable(this.curDay)
          } else {
            this.isComplete = true
          }
        }
      },
      // 下载错误信息
      exprot (item) {
        let msg = ''
        for (var i = 0; i < item.errorMsg.length; i++) {
          msg = msg + item.errorMsg[i]
        }
        this.download('error.txt', msg)
      },
      // 进度条
      percentFun: function () {
        if (this.percentVal < 90) {
          this.percentVal += 1
          setTimeout(() => {
            this.percentFun()
          }, 200)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.table{
  background: #fff;
}
.flex-flow{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
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
.box-topblock-week{
  display: flex;
  flex-direction:row ;
  width:346px;
  height:38px;
  line-height: 38px;
  border:1px solid rgba(217,217,217,1);
  border-radius: 4px;
}
.active-load{
  display: flex;
  flex-direction:row ;
  width:346px;
  height:38px;
  line-height: 38px;
  color:#4196FF;
  border:1px solid #4196FF;
  border-radius: 4px;
}
.active-load .topblock-time{
  color:#4196FF;
}
.topblock-tit{
  margin-left:23px;
}
.topblock-time{
  margin-left:26px;
}
/*冲突校验*/
// .box-topblock-week {
//   width: 100%;
//   height: 38px;
//   line-height: 38px;
//   background: rgba(244, 245, 247, 1);
//   border: 1px solid rgba(217, 217, 217, 1);
//   border-radius: 4px;
//   padding-left: 10px;
//   margin-bottom: 15px;
//   position: relative;
//   cursor: pointer;
// }
.topblock-week-active {
  background: rgba(255, 255, 255, 1);
  border-color:  rgba(65, 150, 255, 1) !important;
  color: #4196ff;
}
.topblock-time {
  display: inline-block;
  margin-left: 20px;
  color: rgba(0, 0, 0, 1);
  opacity: 0.65;
}
.topblock-week-active .topblock-tit,
.topblock-week-active .topblock-time {
  color: #4196ff !important;
}
.box-topblock-week .topblock-tit {
  font-size: 14px;
  color: rgba(0,0,0,1);
  margin-bottom: 8px;
  text-align: center;
}
.box-topblock-week .i-table {
  font-size: 48px;
  position: absolute;
  left: 0px;
  bottom: -10px;
  opacity: 0.7;
}
.box-topblock-week .ivu-icon-md-checkmark {
  font-size: 22px;
  position: absolute;
  right: 7px;
  top: 7px;
  color: #4196ff;
  opacity: 1;
}
.box-topblock-week .topblock-time {
  font-size: 14px;
  font-weight: 400;
  color:rgba(0,0,0,1) ;
  text-align: center;
}
.check-list {
  width: 100%;
  min-height: 220px;
}
.check-list li {
  padding: 5px 0;
}
.check-list .generate-text {
  font-size: 14px;
}
.check-list .ivu-icon {
  font-size: 32px;
}
.check-list .ivu-icon-ios-checkmark-circle {
  color: #19be6b;
}
.check-list .ivu-icon-ios-close-circle {
  color: #ed4014;
}
.check-list .fa-spin {
  color: #5cadff;
}
.startCheck {
  max-height: 500px;
  overflow-y: scroll;
}
</style>
