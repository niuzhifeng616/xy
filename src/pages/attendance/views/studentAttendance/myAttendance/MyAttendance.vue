<template>
  <div class="xy-content-module">
    <!-- 学生考勤-我的考勤   // 缺少面包屑 -->
    <div class=" xy-content-title">
    </div>
    <div class="xy-content-body" id="showDetail">
            <div class="leaveHead">
              <div class=" mb-10">
                  <div class="fl pr" style="margin-right:10px;">
                      <RadioGroup v-model="weekdata" type="button" @on-change="changeWeek" class="fl">
                          <radio label="1">天</radio>
                          <radio label="2">周</radio>
                          <radio label="3">月</radio>
                          <radio label="4">学期</radio>
                          <radio label="5">自定义</radio>
                      </RadioGroup>
                      <date-picker
                        v-if="isDateShow"
                        :value="dates"
                        format="yyyy/MM/dd"
                        type="daterange"
                        split-panels
                        :options="options"
                        placeholder="开始时间-结束时间"
                        @on-change="dateChange"
                        style="width: 200px; margin-left: 22px;"
                        :editable="false"
                        >
                      </date-picker>
                  </div>
                  <div style="margin-right: 10px; display: inline-block;">
                      <Button type="primary" class="xy-primary" @click="query" style="margin-left:23px;">查询</Button>
                  </div>
              </div>

                <div class="centerHead" v-show="showBeforeAndAfter">
                    <Icon style="cursor: pointer;" v-if="isCustom" type="ios-arrow-back" @click="before" />
                    <span style="margin: 0 25px;">
                        <div style="display:inline-block;color: #7B7B7B; text-align:center;">
                            <span v-if="todayShow">
                                今天
                            </span>
                            <span v-if="startDateShowendDate" v-cloak>
                                {{startDate}} - {{endDate}}
                            </span>
                            <span v-if="startDateShowtoday" v-cloak>
                                {{startDate}} - {{endDate}}
                            </span>
                        </div>
                    </span>
                    <Icon style="cursor: pointer;" v-if="isCustom" type="ios-arrow-forward" @click="after" />
                </div>
                <!-- 若有上一级显示按钮 -->
                <div>
                    <div style="display: inline-block;margin-right: 15px;" @click.prevent="showAbnormal">
                        <Checkbox v-model="onlyUnnormal">只显示非正常考勤的结果</Checkbox>
                    </div>
                    <Button  @click="exportModal" class="xy-primary">导出</Button>
                </div>
            </div>
            <div v-if="leftEmpty && rightEmpty">
                <div class="no-data-box" style="text-align: center;" v-cloak>
                    <img class="no-data-img" src="@/assets/common/nullData.svg" />
                    <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
                </div>
            </div>
            <div class="leaveBody" v-if="!leftEmpty || !rightEmpty">
                <div class="summaryLeave" v-if="!leftEmpty">
                    <div class="avatar table-pic">
                        <div class="showname" v-if="!iconPath && tableLoading === false" :class="`head-con ${sex === 0 ? 'woman' : 'man'}`">
                          <span class="head-font">
                            {{ xy.showName(fullName)}}
                          </span>
                        </div>
                        <img v-else style="width: 74px;height: 74px; border-radius: 50%; display:inline-block" :src="iconPath + '?' + Math.random() * 15" alt="">
                        <div class="avatarDetail">
                            <span>{{fullName}}</span>
                            <span>{{userName}}</span>
                            <!-- <span style="font-size:14px;font-weight:normal;color:rgba(153,153,153,1);">{{classShowName}}</span> -->
                        </div>
                    </div>
                    <div>
                        <div class="upRatePosition">
                            <span class="upRateFont">出勤率</span>
                            <span class="upRateFontTip">出勤率=实际人出勤人次/应出勤人次</span>
                        </div>
                        <div class="circlePosition">
                            <!-- <i-circle
                              :percent="attendanceRate ? attendanceRate : 0"
                              :size="116"
                              stroke-linecap="square"
                              :stroke-width="15"
                              :trail-width="15"
                              trail-color="#00DA98"
                              stroke-color="#438DF2"
                              >
                              <span class="demo-Circle-inner" style="font-size:24px">{{ attendanceRate }}%</span>
                            </i-circle> -->
                            <Progress :percent="100" :success-percent="attendanceRate" stroke-color="#FFBF00" :hide-info="true" />
                        </div>
                        <div class="rateFontPos">
                            <div class="leftSmallCircle"></div>
                            <span class="fontDetail">出勤{{ attendanceRate }}%</span>
                            <div class="rightSmallCircle"></div>
                            <span class="fontDetail">缺勤{{ 100 - attendanceRate }}%</span>
                        </div>
                    </div>
                    <div class="summaryFont">各考勤状态占比</div>
                    <div class="summaryFontTip">考勤状态占比=该考勤状态人次/应出勤人次</div>
                    <ul>
                        <li v-for="item in attRateList" :key="item.id">
                            <!-- <div class="details">
                                <span class="rateFont">{{item.AttTypeNum}}人次</span>
                                <span class="rateFont">{{item.Ratio}}%</span>
                            </div>
                            <div style="width: 405px;">
                                <Tooltip :content="item.AttTypeName">
                                    <span class="fontPos">{{item.AttTypeName}}</span>
                                </Tooltip>
                                <div class="progress">
                                    <i-progress :percent="item.Ratio ? item.Ratio : 0" :stroke-width="14" :stroke-color="item.ProcessColor" hide-info />
                                </div>
                            </div> -->
                            <div class="details">
                              <div class="fontPos">
                                {{item.AttTypeName}}人次：
                                <div class="times">
                                  <span class="rateFont">{{item.Ratio}}%</span>
                                  <span class="rateFont">{{item.AttTypeNum}}次</span>
                                </div>
                              </div>
                              <div class="detailsFoot">
                                <div class="detailsFootL" :class="item.AttTypeID === 1 ? 'success' : item.AttTypeID === 2 ? 'late' : item.AttTypeID === 3 ? 'truancy' : item.AttTypeID === 4 ? 'late' : item.AttTypeID === 5 ? 'truancy' : item.AttTypeID === 6 ? 'none' : 'custom' ">
                                  <img src="../img/mine_small.png" alt="">
                                </div>
                                <div class="detailsFootR">
                                  <Slider v-model="item.Ratio" :disabled="true" />
                                </div>
                              </div>
                            </div>
                        </li>
                    </ul>
                  <span class="leftHead">
                      数据截止到：{{endTime}}
                  </span>
                </div>
                <div class="tableWidthControl">
                  <XyAntTable
                    :columns="columnsPerson"
                    :dataSource="columnsPersonData"
                    :nullData="noDataText"
                    :tableLoading="tableLoading"
                    :pagination="pagination"
                    @change="handleTableChange"
                    :scrollx="880"
                    >
                    <div slot="ClassDate" slot-scope="text, record">
                      <span v-if="record.IsLeaveAfterSwipe" class="table-el-hover" @click="change(record)">
                      {{text}}
                      </span>
                      <span v-else>
                      {{text}}
                      </span>
                    </div>
                    <div style="min-width:120px" slot="AMorPMName" slot-scope="text, record">
                      {{record.AMorPMName}}
                    </div>
                    <div style="min-width:160px" slot="SubjectName" slot-scope="text, record">
                      {{record.SubjectName}}
                    </div>
                    <span slot="oprateRender" slot-scope="text, record">
                      <a :disabled="!record.IsLeaveAfterSwipe" @click="change(record)">查看变更</a>
                    </span>
                  </XyAntTable>
                </div>
            </div>
        </div>
        <Modal
          v-model="checkChange"
          width="817"
          title="查看变更"
          class-name="modalPosition"
          :mask-closable="false"
          >
          <XyAntTable
            :columns="changeDetail"
            :dataSource="changeDetailData"
            :tableLoading="changeLoading"
            :isPage="false"
            >
          </XyAntTable>
          <div slot="footer">
              <Button  class="xy-modal-primary" shape="circle" @click="closeModal">关闭</Button>
          </div>
      </Modal>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  const photos = require('@/assets/common/yrykb.png')
  export default {
    name: 'MyAttendance',
    components: {
      XyAntTable
    },
    data () {
      return {
        leftEmpty: '', // 控制左侧没数据展示图片
        rightEmpty: '', // 控制右侧没数据展示图片
        dates: [], // 页面时间选择绑定数据
        isDateShow: false, // 选择自定义时弹出的时间选择器
        aryData: [],
        isCustom: true,
        photo: '',

        sectionList: [], // 节次数据
        sectionAry: [], // 节次筛选
        options: {// 选择自定义时间所需参数
          disabledDate: (date) => {
            return date && date.valueOf() > Date.now()
          }
        },
        applicationID: '',
        applicationSubMenuID: '',
        todayShow: true, // 今天
        startDateShowtoday: false, // 开始时间至今天
        startDateShowendDate: false, // 开始时间至结束时间
        weekdata: '1', // 天周日学期切换
        showBeforeAndAfter: true, // 控制学期不显示前后筛选
        startDate: this.xy.moment(new Date()).format('YYYY-MM-DD'), // 开始时间
        endDate: this.xy.moment(new Date()).format('YYYY-MM-DD'),
        aMorPM: '', // 节次早或者晚
        aMorPMOrder: -1, // 节次信息
        studentName: '',
        studentID: '',
        onlyUnnormal: true, // 点击只显示非正常考勤的结果
        // 左侧所需参数及返回数据
        attRateList: [], // 左侧占比数据
        endTime: '', // 左侧返   回截止时间
        attendanceRate: 0, // 出勤率
        processColor: '',
        // 右侧所需参数及返回数据
        getColList: [], // 用于存储返回表头信息
        columnsPerson: [], // 年级页面表格表头
        columnsPersonData: [], // 表格数据
        hasPage: true, // 是否展示分页
        total: 0,
        pageCurrent: 1, // 当前页码
        pages: 15,
        pageIndex: 1,
        pageIndexRecord: 1,
        pageSize: 15,
        // antTable
        changeLoading: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        pagination: {
          isInitial: false,
          isEmpty: false,
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          PageIndex: 1,
          PageSize: 15,
          onChange: (current) => {
            this.pagination.current = current
            this.pageIndex = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
            this.pageIndex = 1
            this.pageSize = pageSize
          }
        },
        iconPath: '',
        fullName: '',
        userName: '',
        sex: 0,
        className: '',
        classShowName: '', // 后台返回回来用于左侧展示的班级名字，其实同上
        checkChange: false, // 查看变更
        changeDetail: [], // 变更记录表头
        changeDetailData: [], // 变更记录表格数据
        // 点击详情后显示表格数据
        columnsDetail: [],
        columnsDetailData: [],
        noDataText: '该搜索条件下没有结果。',
        endDateDay: this.xy.moment(new Date()).format('YYYY-MM-DD'),
        rowID: 0,
        apiPath: ''
      }
    },
    computed: {
    },
    created () {
      this.photo = photos
      this.apiPath = this.$store.state.apiPath
      this.getSummary()
      this.getTP()
      // this.getSection()
    },
    mounted () {
    },

    methods: {
      handleTableChange () {
        this.getTP()
      },
      // 获取节次
      async getSection () {
        // this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/MyAtt/GetMyClassTableStructure`
        )
        // this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.sectionList = []
            for (var i in res.data) {
              this.sectionList.push(
                {
                  value: res.data[i].Name,
                  label: res.data[i].Name,
                  aMorPM: res.data[i].AMorPM,
                  aMorPMOrder: res.data[i].Order
                }
              )
            }
          }
        }
      },
      // 选择节次绑定节次
      selectSection (value, selectedData) {
        if (selectedData.length === 0) {
          this.aMorPM = ''
          this.aMorPMOrder = -1
        } else {
          this.aMorPM = selectedData[0].aMorPM
          this.aMorPMOrder = selectedData[0].aMorPMOrder
        }
      },
      // 获取左侧汇总数据
      async getSummary () {
        // this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/MyAtt/GetMyAttSummary`, {
            StartTime: this.startDate,
            EndTime: this.endDate,
            AMorPM: this.aMorPM,
            AMorPMOrder: this.aMorPMOrder,
            OnlyUnnormal: this.onlyUnnormal
          }, true
        )
        if (res.success) {
          // this.xy.unloading()
          if (res.data.Icon) {
            this.iconPath = res.data.Icon
          } else {
            this.iconPath = ''
          }
          this.fullName = res.data.FullName
          this.userName = res.data.UserName
          this.classShowName = res.data.ClassName
          this.attendanceRate = res.data.Ratio
          this.endTime = res.data.EndTime.substr(0, 16)
          this.endDateDay = this.xy.moment(new Date(res.data.EndTime)).format('YYYY-MM-DD')
          this.leftEmpty = false
          if (res.data.Summary.length === 0) {
            this.leftEmpty = true
            return
          }
          this.attRateList = res.data.Summary
          for (var i in this.attRateList) {
            if (this.attRateList[i].AttTypeName === '正常') {
              this.attRateList[i].ProcessColor = '#438DF2'
            } else if (this.attRateList[i].AttTypeName === '迟到') {
              this.attRateList[i].ProcessColor = '#E74054'
            } else {
              this.attRateList[i].ProcessColor = '#FDB539'
            }
          }
        } else {
          this.leftEmpty = true
        }
      },
      // 获取右侧数据
      async getTP () {
        this.tableLoading = true
        var _this = this
        let res = await this.xy.get(
          this.apiPath + `/api/MyAtt/GetForStudent`, {
            StartTime: _this.startDate,
            EndTime: _this.endDate,
            PageIndex: _this.pageIndex,
            PageSize: _this.pageSize,
            AMorPM: _this.aMorPM,
            AMorPMOrder: _this.aMorPMOrder,
            OnlyUnnormal: _this.onlyUnnormal
          }
        )
        if (res.success) {
          _this.total = res.data.totalRecords
          _this.pagination.total = res.data.totalRecords
          _this.rightEmpty = false
          if (res.data.totalRecords === 0) {
            _this.rightEmpty = true
            return
          };
          _this.columnsPerson = [
            {
              title: '日期',
              dataIndex: 'ClassDate',
              width: 100,
              fixed: 'left', // 如果小屏幕table出现滚动条，需要固定第一列
              scopedSlots: { customRender: 'ClassDate' }
            },
            {
              title: '节次',
              dataIndex: 'AMorPMName',
              scopedSlots: { customRender: 'AMorPMName' }
            },
            {
              title: '教学班',
              dataIndex: 'SubjectName',
              scopedSlots: { customRender: 'SubjectName' }
            },
            {
              title: '考勤时间',
              dataIndex: 'AttdentTime',
              width: 160
            },
            {
              title: '考勤方式',
              dataIndex: 'AttFromName',
              width: 100
            },
            {
              title: '考勤状态',
              dataIndex: 'AttdentName',
              width: 100
            },
            {
              title: '操作',
              width: 80,
              scopedSlots: { customRender: 'oprateRender' }
            }
          ]
          _this.columnsPersonData = res.data.data
          for (var c in _this.columnsPersonData) {
            _this.columnsPersonData[c].ClassDate = _this.columnsPersonData[c].ClassDate.substr(0, 10)
          };
        }
        this.tableLoading = false
      },
      closeModal () {
        this.checkChange = false
      },
      changeSelect (selction) {
        this.selectionAll = selction
      },
      // 查询按钮
      query () {
        this.getSummary()
        this.pagination.current = 1
        this.getTP()
      },
      // 点击查看变更
      change (row) {
        this.checkChange = true
        this.rowID = row.RecordID
        this.getRecord()
      },
      async getRecord () {
        this.changeLoading = true
        var _this = this
        let res = await this.xy.get(
          this.apiPath + `/api/AttsLesson/GetAttendanceRecordByClassBaseID`, {
            recordID: this.rowID
          }
        )
        this.changeLoading = false
        if (res.success) {
          _this.changeDetail = [
            {
              title: '操作者',
              dataIndex: 'UserName'
            },
            {
              title: '原状态',
              dataIndex: 'SourceTypeName'
            },
            {
              title: '修改时间',
              dataIndex: 'LastModifyByDate'
            },
            {
              title: '考勤方式',
              dataIndex: 'AttFromName'
            },
            {
              title: '修改后状态',
              dataIndex: 'TargetTypeName'
            }
          ]
          _this.changeDetailData = res.data
          for (var i in _this.changeDetailData) {
            _this.changeDetailData[i].LastModifyByDate = _this.changeDetailData[i].LastModifyByDate.substr(0, 16)
          }
          this.changeDetailData.map((item, index) => {
            this.$set(item, 'key', index)
          })
        }
      },
      // 选择天周月学期
      async changeWeek (vals) {
        this.pagination.current = 1
        this.pagination.pageSize = 15
        this.pageCurrent = 1
        this.pageSize = 15
        this.weekdata = vals
        this.startDate = ''
        this.endDate = ''
        if (this.weekdata === '5') {
          this.isDateShow = true
          this.todayShow = false
          this.startDateShowtoday = false
          this.startDateShowendDate = true
          this.showBeforeAndAfter = true
          this.isCustom = false
        } else {
          this.isDateShow = false
        }
        if (this.weekdata === '1') {
          this.startDate = this.xy.moment(new Date()).format('YYYY-MM-DD')
          this.endDate = this.xy.moment(new Date()).format('YYYY-MM-DD')
          console.log(this.startDate, this.endDate)
          this.todayShow = true
          this.startDateShowtoday = false
          this.startDateShowendDate = false
          this.showBeforeAndAfter = true
          this.isCustom = true
          this.query()
        } else if (this.weekdata === '2') {
          console.log(this.xy.moment().format('d'))
          this.startDate = this.xy.moment().subtract(parseInt(this.xy.moment().format('d')) === 0 ? 6 : parseInt(this.xy.moment().format('d')) - 1, 'days').format('YYYY-MM-DD')
          // this.startDate = this.xy.moment().weekday(1).format('YYYY-MM-DD')
          this.endDate = this.xy.moment().add(7 - parseInt(this.xy.moment().format('d')), 'days').format('YYYY-MM-DD')
          this.newDateTime(this.endDate, this.endDateDay)
          console.log(this.startDate, this.endDate)
          this.startDateShowtoday = true
          this.todayShow = false
          this.startDateShowendDate = false
          this.showBeforeAndAfter = true
          this.isCustom = true
          this.query()
        } else if (this.weekdata === '3') {
          this.startDate = this.xy.moment().startOf('months').format('YYYY-MM-DD')
          this.endDate = this.xy.moment().endOf('months').format('YYYY-MM-DD')
          this.newDateTime(this.endDate, this.endDateDay)
          console.log(this.startDate, this.endDate)
          this.startDateShowtoday = true
          this.todayShow = false
          this.startDateShowendDate = false
          this.showBeforeAndAfter = true
          this.isCustom = true
          this.query()
        } else if (this.weekdata === '4') {
          // this.xy.loading()
          let res = await this.xy.get(
            this.xyApi + `/base/api/AcademicSession/GetCurrent`
          )
          // this.xy.unloading()
          if (res.success) {
            // 学期的开始第一天
            this.startDate = this.xy.moment(new Date(res.data.StartDate)).format('YYYY-MM-DD')
            // 学期的最后一天
            var endDateTime = res.data.EndDate
            // 今天
            var newDateTime = this.xy.moment(new Date()).format('YYYY-MM-DD')
            var oDate1 = new Date(newDateTime)
            var oDate2 = new Date(endDateTime)
            if (oDate1.getTime() > oDate2.getTime()) {
              this.endDate = this.xy.moment(new Date(oDate2)).format('YYYY-MM-DD')
              this.startDateShowtoday = false
              this.startDateShowendDate = true
            } else {
              this.endDate = this.xy.moment(new Date(oDate1)).format('YYYY-MM-DD')
              this.startDateShowendDate = false
              this.startDateShowtoday = true
            }
            console.log(this.startDate, this.endDate)
            this.todayShow = false
            this.isCustom = false
            this.query()
          }
        }
      },
      // 判断今天是否大于结束日期
      newDateTime (endDate, endDateDay) {
        var oDate1 = new Date(endDate)
        var oDate2 = new Date(endDateDay)
        if (oDate1.getTime() > oDate2.getTime()) {
          this.endDate = this.xy.moment(new Date(oDate2)).format('YYYY-MM-DD')
        } else {
          this.endDate = this.xy.moment(new Date(oDate1)).format('YYYY-MM-DD')
        }
      },
      // 选择自定义时间
      dateChange (val) {
        if (val[0] !== '' && val[1] !== '') {
          this.startDate = this.xy.moment(new Date(val[0])).format('YYYY-MM-DD')
          this.endDate = this.xy.moment(new Date(val[1])).format('YYYY-MM-DD')
        }
      },
      // 前一天/周/月
      before () {
        this.pagination.current = 1
        this.pagination.pageSize = 15
        this.pageCurrent = 1
        this.pageSize = 15
        if (this.weekdata === '1') {
          this.startDate = this.xy.moment(this.endDate).subtract(1, 'days').format('YYYY-MM-DD')
          this.endDate = this.xy.moment(this.endDate).subtract(1, 'days').format('YYYY-MM-DD')
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
          this.query()
        } else if (this.weekdata === '2') {
          this.endDate = this.xy.moment(this.startDate).subtract(1, 'days').format('YYYY-MM-DD')
          this.startDate = this.xy.moment(this.endDate).subtract(6, 'days').format('YYYY-MM-DD')
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
          this.query()
        } else if (this.weekdata === '3') {
          this.endDate = this.xy.moment(this.startDate).subtract(1, 'days').format('YYYY-MM-DD')
          this.aryData = this.curMonthDate(new Date(this.endDate))
          this.startDate = this.xy.moment(this.aryData[0]).format('YYYY-MM-DD')
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
          this.query()
        }
      },
      // 后一天/周/月
      after () {
        this.pagination.current = 1
        this.pagination.pageSize = 15
        this.pageCurrent = 1
        this.pageSize = 15
        if (this.endDate === this.xy.moment(new Date()).format('YYYY-MM-DD')) {
          return
        }
        if (this.weekdata === '1') {
          this.startDate = this.xy.moment(this.endDate).add(1, 'days').format('YYYY-MM-DD')
          this.endDate = this.xy.moment(this.endDate).add(1, 'days').format('YYYY-MM-DD')
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
          if (this.endDate === this.xy.moment(new Date()).format('YYYY-MM-DD')) {
            this.todayShow = true
            this.startDateShowendDate = false
          };
          this.query()
        } else if (this.weekdata === '2') {
          // this.startDate = this.xy.date.format(this.xy.date.add(this.endDate, 'd', +1), 'yyyy/MM/dd')
          // this.endDate = this.xy.date.format(this.xy.date.add(this.startDate, 'd', +6), 'yyyy/MM/dd')
          this.startDate = this.xy.moment(this.endDate).add(1, 'days').format('YYYY-MM-DD')
          this.endDate = this.xy.moment(this.startDate).add(6, 'days').format('YYYY-MM-DD')
          if (new Date().getTime() < new Date(this.endDate).getTime()) {
            this.endDate = this.xy.moment(new Date()).format('YYYY-MM-DD')
          }
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
          if (this.endDate === this.xy.moment(new Date()).format('YYYY-MM-DD')) {
            this.startDateShowendDate = false
            this.startDateShowtoday = true
          };
          this.query()
        } else if (this.weekdata === '3') {
          this.startDate = this.xy.moment(this.endDate).add(1, 'days').format('YYYY-MM-DD')
          this.aryData = this.curMonthDate(new Date(this.startDate))
          this.endDate = this.xy.moment(this.aryData[1]).format('YYYY-MM-DD')
          if (new Date().getTime() < new Date(this.endDate).getTime()) {
            this.endDate = this.xy.moment(new Date()).format('YYYY-MM-DD')
          }
          this.startDateShowendDate = true
          this.todayShow = false
          this.startDateShowtoday = false
          if (this.endDate === this.xy.moment(new Date()).format('YYYY-MM-DD')) {
            this.startDateShowendDate = false
            this.startDateShowtoday = true
          };
          this.query()
        }
      },
      // 获取当前周天
      curMonthDate (datetime) {
        // 获取当前月的第一天
        var start = datetime
        start.setDate(1)
        // 获取当前月的最后一天
        var date = datetime
        var currentMonth = date.getMonth()
        var nextMonth = ++currentMonth
        var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
        var oneDay = 1000 * 60 * 60 * 24
        var end = new Date(nextMonthFirstDay - oneDay)
        var arrdate = []
        arrdate.push(start)
        arrdate.push(end)
        return arrdate
      },
      // 只显示非正常考勤的结果
      showAbnormal () {
        this.onlyUnnormal = !this.onlyUnnormal
        this.getSummary()
        this.pagination.current = 1
        this.getTP()
      },
      // 导出
      exportModal () {
        if (this.total !== 0) {
          this.aMorPMOrder = (this.aMorPMOrder || Number(this.aMorPMOrder) === 0) ? this.aMorPMOrder : -1
          this.startDate = this.startDate ? this.startDate : 0
          this.endDate = this.endDate ? this.endDate : 0
          this.xy.downFile(
            this.apiPath + `/api/MyAtt/ExportForStudent/`,
            {
              StartTime: this.startDate,
              EndTime: this.endDate,
              AMorPM: this.aMorPM,
              AMorPMOrder: this.aMorPMOrder,
              OnlyUnnormal: this.onlyUnnormal
            }
          )
        } else {
          this.xy.msgError('当前无数据可导出。')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
/deep/ .ivu-progress-success-bg {
  background: #1890FF;
}
/deep/ .ivu-slider-disabled .ivu-slider-button {
  border-color: #46a6ff;
  cursor: default;
}
/deep/ .ivu-slider-disabled .ivu-slider-bar {
  background: #46a6ff;
}
/deep/ .ivu-slider-disabled .ivu-slider-wrap {
  cursor: default;
  background-color: #f5f5f5 !important;
}
.title-bg {
    width: 100%;
    height: 124px;
    background: #fff url('/image/admin_headBg.png') no-repeat center top;
    position: relative
}
.title-bg .title-bg2 {
    position: absolute;
    display: block;
    width: 42%;
    height: 100%;
    max-height: 100px;
    background: url('/image/admin_head.png') no-repeat center;
    background-size: contain;
    left: calc(50% - 21%);
    top: 14px;
}
// .active {
//     background:rgb(65,150,255);
//     border-radius:4px;
// }
.leaveHead {
    display: flex;
    justify-content: space-between;
    padding: 6px 15px;
    border-bottom: 1px solid #EBEEF5;
}
.leftHead {
    margin-top: 15px;
    display: inline-block;
    height:32px;
    line-height:32px;
    font-size:14px;
    font-weight:normal;
    color:rgba(153,153,153,1);
}
 /* 增加 */
.exportPosition {
    width: 400px;
    display: flex;
    flex-direction: row-reverse;
}
.centerHead {
    height: 32px;
    line-height: 32px;
}
.rightHead {
    width: 300px;
    display: flex;
    padding-left: 146px;
}
.leaveBody {
    display: flex;
    border-bottom: 1px solid #EBEEF5;
}
.summaryLeave {
    width: 422px;
    // height: 100%;
    min-height: 460px;
    padding: 0 10px;
    border-left: 1px solid #EBEEF5;
}
.circle {
    margin-left: 140px;
    margin-top: 8px;
}
.circleDetail {
    margin-top: 10px;
    margin-left: 120px;
}
.markerOne {
    display: inline-block;
    width:8px;
    height:8px;
    background:rgba(67,141,242,1);
    border-radius:50%;
    margin-right: 10px
}
.markerTwo {
    display: inline-block;
    width:8px;
    height:8px;
    background:rgba(0,218,152,1);
    border-radius:50%;
    margin-right: 10px;
    margin-left: 35px
}
.details {
  width: 100%;
  padding-right: 45px;
  margin-bottom: 22px;
  .detailsFoot {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .success {
      background: #7BCE7B;
    }
    .late {
      background: #1890FF;
    }
    .truancy {
      background: rgb(234, 102, 102);
    }
    .none {
      background: #4F5950;
    }
    .custom {
      background: #FFBF00;
    }
    .detailsFootL {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      text-align: center;
      line-height: 36px;
      img {
        width: 20px;
        height: 20px;
      }
    }
    .detailsFootR {
      width: 85%;
    }
  }
}
/* 增加 */
.summaryFont{
    margin-top: 25px;
    color:rgba(51,51,51,1);
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
}
.summaryFontTip{
  line-height: 22px;
  color: rgba(0,0,0,0.45);
  margin-bottom: 16px;
}
.progress {
    width: 258px;
    display: inline-block;
    margin-bottom: 12px;
    margin-right: 14px;
    padding: 0
}
.upRatePosition{
    margin: 20px 0 6px 0;
    display: flex;
    flex-direction: column;
}
.upRateFont{
    height:22px;
    line-height: 22px;
    font-size:14px;
    font-weight:bold;
    color:rgba(51,51,51,1);
}
.upRateFontTip{
  font-size: 13px;
  line-height: 22px;
  color: rgba(0,0,0,0.45);
}
.circlePosition{
  width: 100%;
  padding-right: 40px;
  margin-bottom: 12px;
}
.rateFontPos{
  width: 100%;
}
.leftSmallCircle {
    display: inline-block;
    margin: 0 4px 2px 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #438DF2;
}
.rightSmallCircle{
    display: inline-block;
    margin: 0 4px 2px 20px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ffbf00;
}
.fontDetail{
    font-size:14px;
    font-weight:400;
    color:rgba(51,51,51,1);
}
.fontPos {
  font-size: 14px;
  line-height: 22px;
  position: relative;
  .times {
    position: absolute;
    right: 0;
    .rateFont {
      font-size: 14px;
      line-height: 22px;
      color: rgba(0,0,0,0.85);
      display: inline-block;
    }
    .rateFont:nth-child(1) {
      margin-right: 16px;
    }
  }
}
.ivu-progress-outer{
    margin: 0;
    padding: 0;
}
.ivu-progress-inner {
    margin: 0;
    padding: 0;
}
.summaryTotal {
    width: 395px;
    height: 90px;
    margin-top: 17px;
    display: flex;
    justify-content: space-around;
    background:rgba(245,245,245,1);
    border-radius:15px;
}
.summaryItem {
    display: flex;
    flex-direction: column;
}
.summaryUp {
    font-size:28px;
    font-weight:normal;
    color:rgba(51,51,51,1);
    margin-top:15px;
    margin: 15 auto;
    text-align: center;
    line-height: 42px;
}
.fontMiddle {
    margin-right: 10px;
    height:32px;
    line-height:32px;
    font-size:14px;
    font-weight:400;
    color:rgba(65,150,255,1);
    cursor: pointer;
}
.detailLeaveForm {
    padding: 10px;
}

.leaveSummary {
    padding: 10px;
}
.avatar {
    display: flex;
    flex-direction: column ;
    justify-content: space-between;
    position: relative;
    >.showname {
      width: 74px;
      height: 74px;
      border-radius: 50%;
      line-height: 74px;
      text-align: center;
      margin: 24px auto 10px;
    }
}
.avatar img {
  margin: 24px auto 10px;
}
.avatarDetail {
    width: 150px;
    padding-top: 5px;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    text-align: center;
}
.avatarDetail span:nth-child(1) {
  font-size: 16px;
  line-height: 22px;
  color: rgba(0, 0, 0, .85);
  font-weight: bold;
}
.avatarDetail span:nth-child(2) {
  font-size: 14px;
  line-height: 22px;
  color: #595959;
}
.tableWidthControl {
    width: calc(100% - 425px);
    border-left: 1px solid #EBEEF5;
}
.ivu-page-total {
    margin-left: 395px;
}
.modalPosition {
    margin: 200px -420px 0 0;
}
</style>
