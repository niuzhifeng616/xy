
<template>
  <!-- 行政班考勤统计——3 -->
  <div class="xy-content-body">
    <div class="leaveHead">
      <span class="leftHead" v-cloak>数据截止到：{{endTime}}</span>
      <div class="centerHead" v-show="showBeforeAndAfter">
        <Icon style="cursor: pointer;" v-if="isCustom" type="ios-arrow-back" @click="before" />
        <span style="margin: 0 25px;">
          <div style="display:inline-block;color: #7B7B7B; text-align:center;">
            <span v-if="todayShow">今天</span>
            <span v-if="startDateShowendDate" v-cloak>{{startDate}} - {{endDate}}</span>
            <span v-if="startDateShowtoday" v-cloak>{{startDate}} - 今天</span>
          </div>
        </span>
        <Icon style="cursor: pointer;" v-if="isCustom" type="ios-arrow-forward" @click="after" />
      </div>
      <div class="rightHead exportPosition">
        <div>
          <Button class="xy-primary" @click="exportModal">导出</Button>
        </div>
        <span @click="backLevel" class="fontMiddle">上一级</span>
      </div>
    </div>
    <div>
        <div class="leaveBody" v-if="!leftEmpty || !rightEmpty">
          <div v-if="leftEmpty" class="no-data-box" style="margin: 100px auto;" v-cloak>
            <img class="no-data-img" src="@/assets/common/nullData.svg" />
            <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
          </div>
          <div class="summaryLeave" v-if="!leftEmpty">
            <div>
              <div class="upRatePosition">
                <span class="upRateFont">出勤率</span>
              </div>
              <div class="circlePosition">
                <i-circle
                  :percent="attendanceRate"
                  :size="circleSize"
                  stroke-linecap="square"
                  :stroke-width= "strokeWidth"
                  :trail-width= "trailWidth"
                  trail-color="#00DA98"
                  stroke-color="#438DF2"
                  >
                  <span class="demo-Circle-inner" style="font-size:24px">{{ attendanceRate }}%</span>
                </i-circle>
              </div>
              <div class="rateFontPos">
                <div class="leftSmallCircle"></div>
                <span class="fontDetail">出勤</span>
                <div class="rightSmallCircle"></div>
                <span class="fontDetail">缺勤</span>
              </div>
            </div>
            <div class="summaryFont">各考勤状态占比</div>
            <ul>
              <li v-for="(item) in attRateList" :key="item.id">
                <div class="details">
                  <span class="rateFont">{{item.AttTypeNum}}人次</span>
                  <span class="rateFont">{{item.Ratio}}%</span>
                </div>
                <div style="width: 405px;display:flex;">
                  <div class="fontControl">
                    <Tooltip :content="item.AttTypeName">
                    <span class="fontPos">{{item.AttTypeName}}</span>
                  </Tooltip>
                  </div>
                  <div class="progress">
                    <i-progress
                      :percent="item.Ratio"
                      :stroke-width="progressWidth"
                      :stroke-color="item.ProcessColor"
                      hide-info
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="tableWidthControl">
            <XyAntTable
              :columns="columns"
              :dataSource="columnsData"
              :tableLoading="tableLoading"
              :pagination="pagination"
              @change="handleTableChange"
              :scrollx="true"
              >
              <!-- 头像 -->
              <div slot="Headicon" slot-scope="text, record" class='set-head-icon'>
                <div v-if="!record.Icon" :class="`head-con ${record.TeacherSex === 0 ? 'woman' : 'man'}`" style="padding: 0">
                  <div :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
                    <span class="head-font">
                      {{ xy.showName(record.StatisticsName)}}
                    </span>
                  </div>
                </div>
                <img v-else style="width:32px;height:32px;border-radius:50%" :src="record.Icon + '?' + Math.random() * 15"/>
              </div>
              <!-- 姓名 -->
              <div slot="StatisticsName" slot-scope="text, record">
                <span class="table-el-hover" @click="toAttStatPerson(record)">
                  {{record.StatisticsName}}
                </span>
              </div>
              <!-- 用户名 -->
              <div slot="UserName" style="min-width: 140px" slot-scope="text, record">
                {{record.UserName}}
              </div>
              <!-- 出勤率 -->
              <div slot="AttendanceRate" style="min-width: 100px" slot-scope="text, record">
                {{record.AttendanceRate}}
              </div>
              <!-- 应到人次 -->
              <div slot="AttendanceNTNum" style="min-width: 100px" slot-scope="text, record">
                {{record.AttendanceNTNum}}
              </div>
              <!-- 实到人次 -->
              <div slot="ActualAttendanceNum" style="min-width: 100px" slot-scope="text, record">
                {{record.ActualAttendanceNum}}
              </div>
              <div v-for="(item, index) in columns.slice(5)" :key="index" style="min-width: 100px">
                <template :slot="item.dataIndex" slot-scope="text, record">
                  {{record[item.dataIndex]}}
                </template>
              </div>
              <!-- 操作 -->
              <div slot="Action" slot-scope="text, record">
                <a @click="toAttStatPerson(record)">详情</a>
              </div>
            </XyAntTable>
          </div>
        </div>
        <div v-if="leftEmpty && rightEmpty" v-cloak>
          <div v-if="leftEmpty" class="no-data-box" v-cloak>
            <img class="no-data-img" src="@/assets/common/nullData.svg" />
            <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
          </div>
        </div>
      </div>

  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'AttAdminClassForClass',
    components: {
      XyAntTable
    },
    props: {
      changeWeekBtn: String,
      startDate: String,
      endDate: String,
      startDateShowendDate: Boolean,
      todayShow: Boolean,
      startDateShowtoday: Boolean,
      showBeforeAndAfter: Boolean,
      applicationID: String,
      applicationSubMenuID: String,
      schoolDistrictID: String,
      gradeYearID: String,
      classID: String,
      schoolName: String,
      gradeName: String,
      className: String,
      aMorPM: String,
      aMorPMOrder: Number,
      isCustom: Boolean,
      disciplineName: String
    },
    data () {
      return {
        strokeWidth: 15,
        trailWidth: 15,
        circleSize: 116,
        progressWidth: 14,
        weekdata: '',
        leftEmpty: false,
        rightEmpty: false,
        attRateList: [],
        endTime: '',
        attendanceRate: 0,
        processColor: '#FDB539',
        getColList: [],
        columns: [],
        columnsData: [],
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
        }
      }
    },
    watch: {
      'changeWeekBtn' (val) {
        this.pagination.current = 1
        this.pagination.pageSize = 15
        this.getSummary()
        this.getTP()
      }
    },
    created () {
    },
    mounted () {
      this.getSummary()
      this.getTP()
    },
    methods: {
      handleTableChange () {
        this.getTP()
      },
      // 获取左侧汇总数据
      getSummary () {
        // api/AttStatistics/GetStudentAttStatisticSummary?SchoolDistrictID={SchoolDistrictID}&GradeYearID={GradeYearID}&ClassID={ClassID}&ApplicationID={ApplicationID}&ApplicationSubMenu={ApplicationSubMenu}&StartTime={StartTime}&EndTime={EndTime}&AMorPM={AMorPM}&AMorPMOrder={AMorPMOrder}

        // this.xy.loading()
        // this.xy.loading()
        this.schoolDistrictID =
          this.schoolDistrictID !== undefined ? this.schoolDistrictID : 0
        this.gradeYearID = this.gradeYearID !== undefined ? this.gradeYearID : 0
        this.classID = this.classID !== undefined ? this.classID : ''
        this.xy
          .get(
            `${this.$store.state.apiPath}/api/AttStatistics/GetStudentAttStatisticSummary`,
            {
              SchoolDistrictID: this.schoolDistrictID,
              GradeYearID: this.gradeYearID,
              ClassID: this.classID,
              ApplicationID: this.applicationID,
              ApplicationSubMenuID: this.applicationSubMenuID,
              StartTime: this.startDate,
              EndTime: this.endDate,
              AMorPM: this.aMorPM,
              AMorPMOrder: this.aMorPMOrder
            }
          )
          .then(res => {
            if (res.success) {
              // this.xy.unloading()
              this.attendanceRate = res.data.Ratio
              this.endTime = this.xy.moment(res.data.EndTime).format('YYYY-MM-DD HH:mm')
              this.leftEmpty = false
              if (res.data.Summary.length === 0) {
                this.leftEmpty = true
                return
              }
              this.attRateList = res.data.Summary
              for (let i in this.attRateList) {
                // 正常
                if (this.attRateList[i].AttTypeName === '正常') {
                  this.attRateList[i].ProcessColor = '#4196FF'
                } else if (this.attRateList[i].AttTypeName === '迟到') {
                  // 迟到
                  this.attRateList[i].ProcessColor = '#E74054'
                } else {
                  this.attRateList[i].ProcessColor = '#FDB539'
                }
              }
            }
          })
      },
      // 获取右侧数据
      getTP () {
        this.tableLoading = true
        this.rightEmpty = false
        this.xy
          .get(`${this.$store.state.apiPath}/api/AttStatistics/GetForClass`, {
            SchoolDistrictID: this.schoolDistrictID,
            GradeYearID: this.gradeYearID,
            ClassID: this.classID,
            ApplicationID: this.applicationID,
            ApplicationSubMenuID: this.applicationSubMenuID,
            StartTime: this.startDate,
            EndTime: this.endDate,
            PageIndex: this.pagination.current,
            PageSize: this.pagination.pageSize,
            AMorPM: this.aMorPM,
            AMorPMOrder: this.aMorPMOrder
          })
          .then(res => {
            this.tableLoading = false
            if (res.success) {
              this.pagination.total = res.data.TotalRecords
              this.rightEmpty = false
              if (res.data.TotalRecords === 0) {
                this.rightEmpty = true
                return
              }
              this.getColList = res.data.Summary // 临时存储返回表头信息
              this.columns = [
                {
                  title: ' ',
                  width: 44,
                  dataIndex: 'Headicon',
                  scopedSlots: { customRender: 'Headicon' },
                  fixed: 'left' // 如果小屏幕table出现滚动条，需要固定第一列
                },
                {
                  title: '姓名',
                  dataIndex: 'StatisticsName',
                  width: 140,
                  fixed: 'left',
                  scopedSlots: { customRender: 'StatisticsName' }
                },
                {
                  title: '用户名',
                  dataIndex: 'UserName',
                  scopedSlots: { customRender: 'UserName' }
                },
                {
                  title: '出勤率',
                  dataIndex: 'AttendanceRate',
                  scopedSlots: { customRender: 'AttendanceRate' }
                },
                {
                  title: '应到次数',
                  dataIndex: 'AttendanceNTNum',
                  scopedSlots: { customRender: 'AttendanceNTNum' }
                },
                {
                  title: '实到次数',
                  dataIndex: 'ActualAttendanceNum',
                  scopedSlots: { customRender: 'ActualAttendanceNum' }
                }
              ]
              for (let i in this.getColList) {
                this.columns.push({
                  title: this.getColList[i].AttTypeName + '次数',
                  dataIndex: this.getColList[i].AttTypeColumnName,
                  scopedSlots: { customRender: this.getColList[i].AttTypeColumnName }
                })
              }
              this.columns.push({
                title: '操作',
                width: 80,
                dataIndex: 'Action',
                fixed: 'right',
                scopedSlots: { customRender: 'Action' }
              })
              this.columnsData = res.data.DetailList
              this.columnsData.map((item, index) => {
                this.$set(item, 'key', index)
              })
            }
          })
      },
      // 点击详情跳转到年级页面
      toAttStatPerson (row) {
        // this.$parent.defaultValue.push(row.StatisticsID.toString())
        this.$parent.cascaderData = 4
        this.$parent.toPerson(row)
        this.$parent.studentID = row.StatisticsID.toString()
        this.$parent.studentName = row.StatisticsName
      },
      // 返回上一级按钮
      backLevel () {
        this.$parent.cascaderData = 2
        this.$parent.defaultValue.pop()
        this.$parent.toGrade()
      },
      // 前一天/周/月
      before () {
        this.$parent.beforeDate()
      },
      // 后一天/周/月
      after () {
        this.$parent.afterDate()
      },
      // 导出
      exportModal () {
        if (this.pagination.total !== 0) {
          let idArr = this.$store.state.common.menuId.split(',')
          this.applicationID = idArr[1]
          this.applicationSubMenuID = idArr[2]
          this.xy.downFile(
            `${this.$store.state.apiPath}/api/AttStatistics/ExportForClass`,
            {
              SchoolDistrictID: this.schoolDistrictID,
              ApplicationID: this.applicationID,
              ApplicationSubMenuID: this.applicationSubMenuID,
              StartTime: this.startDate,
              EndTime: this.endDate,
              GradeYearID: this.gradeYearID,
              ClassID: this.classID,
              AMorPM: this.aMorPM,
              AMorPMOrder: this.aMorPMOrder
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
@import '../css/attAdminClass.less';
/deep/ .ant-table-row-cell-break-word:nth-child(1) {
  padding-right: 0 !important;
}
</style>
