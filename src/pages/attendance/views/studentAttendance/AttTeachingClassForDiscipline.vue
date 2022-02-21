<template>
  <!-- 教学班考勤统计——3 -->
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
      <!-- 若有上一级显示按钮 -->
      <div class="rightHead exportPosition">
        <div>
          <Button class="xy-primary" @click="exportModal">导出</Button>
        </div>
        <span @click="backLevel" class="fontMiddle">上一级</span>
      </div>
    </div>
    <div v-if="leftEmpty && rightEmpty">
      <div v-if="leftEmpty" class="no-data-box" v-cloak>
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
      </div>
    </div>
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
            <div style="width: 405px;">
              <Tooltip :content="item.AttTypeName">
                <span class="fontPos">{{item.AttTypeName}}</span>
              </Tooltip>
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
          :scrollx="'max-content'"
          @change="handleTableChange"
          >
          <!-- 班级 -->
          <div slot="StatisticsName" slot-scope="text, record">
            <span class="table-el-hover" @click="toAttStatClass(record)">
              {{record.StatisticsName}}
            </span>
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
          <div v-for="(item, index) in columns.slice(3)" :key="index" style="min-width: 100px">
            <template :slot="item.dataIndex" slot-scope="text, record">
              {{record[item.dataIndex]}}
            </template>
          </div>
          <!-- 操作 -->
          <div slot="Action" slot-scope="text, record">
            <a @click="toAttStatClass(record)"> 详情 </a>
          </div>
        </XyAntTable>
      </div>
    </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'AttTeachingClassForDiscipline',
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
      disciplineID: Number,
      disciplineName: String,
      pageCurrent: Number,
      pages: {
        type: Array,
        default: () => {
          return [15, 30, 50, 100]
        }
      },
      pageIndex: Number,
      pageSize: Number,
      cascaderData: Number
    },
    data () {
      return {
        strokeWidth: 15,
        trailWidth: 15,
        circleSize: 116,
        progressWidth: 14,
        leftEmpty: false, // 控制左侧没数据展示图片
        rightEmpty: false, // 控制右侧没数据展示图片
        // 左侧所需参数及返回数据
        attRateList: [], // 左侧占比数据
        endTime: '', // 左侧返回截止时间
        attendanceRate: 0, // 出勤率
        processColor: '#FDB539',
        // 右侧所需参数及返回数据
        getColList: [], // 用于存储返回表头信息
        columns: [], // 年级页面表格表头
        columnsData: [], // 表格数据
        // 点击详情后显示表格数据
        ownClassID: '',
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
        // this.xy.loading()
        this.xy
          .get(
            `${this.$store.state.apiPath}/api/ClassAttStatistics/GetStudentAttStatisticSummary`,
            {
              SchoolDistrictID: this.schoolDistrictID,
              GradeYearID: this.gradeYearID,
              DisciplineID: this.disciplineID,
              ClassID: this.ownClassID,
              ApplicationID: this.applicationID,
              ApplicationSubMenuID: this.applicationSubMenuID,
              StartTime: this.startDate,
              EndTime: this.endDate,
              AMorPM: this.aMorPM,
              AMorPMOrder: this.aMorPMOrder
            }
          )
          .then(res => {
            // this.xy.unloading()
            if (res.success) {
              this.attendanceRate = res.data.Ratio
              this.endTime = this.xy.moment(res.data.EndTime).format('YYYY-MM-DD HH:mm')
              this.leftEmpty = false
              if (res.data.Summary.length === 0) {
                this.leftEmpty = true
                return
              }
              this.attRateList = res.data.Summary
              for (let i in this.attRateList) {
                if (this.attRateList[i].typeName === '正常') {
                  this.processColor = '#4196FF'
                } else if (this.attRateList[i].typeName === '迟到') {
                  this.processColor = '#E74054'
                } else {
                  this.processColor = '#FDB539'
                }
              }
            }
          })
      },
      // 获取右侧数据
      getTP () {
        this.tableLoading = true
        this.xy
          .get(
            `${this.$store.state.apiPath}/api/ClassAttStatistics/GetForYear`,
            {
              SchoolDistrictID: this.schoolDistrictID,
              GradeYearID: this.gradeYearID,
              DisciplineID: this.disciplineID,
              ApplicationID: this.applicationID,
              ApplicationSubMenuID: this.applicationSubMenuID,
              StartTime: this.startDate,
              EndTime: this.endDate,
              PageIndex: this.pagination.current,
              PageSize: this.pagination.pageSize,
              AMorPM: this.aMorPM,
              AMorPMOrder: this.aMorPMOrder
            }
          )
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
                  title: '班级',
                  dataIndex: 'StatisticsName',
                  fixed: 'left',
                  width: 180,
                  scopedSlots: { customRender: 'StatisticsName' }
                },
                {
                  title: '出勤率',
                  dataIndex: 'AttendanceRate',
                  scopedSlots: { customRender: 'AttendanceRate' }
                },
                {
                  title: '应到人次',
                  dataIndex: 'AttendanceNTNum',
                  scopedSlots: { customRender: 'AttendanceNTNum' }
                },
                {
                  title: '实到人次',
                  dataIndex: 'ActualAttendanceNum',
                  scopedSlots: { customRender: 'ActualAttendanceNum' }
                }
              ]
              for (let i in this.getColList) {
                this.columns.push({
                  title: this.getColList[i].AttTypeName + '人次',
                  dataIndex: this.getColList[i].AttTypeColumnName,
                  scopedSlots: { customRender: this.getColList[i].AttTypeColumnName }
                })
              };
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
      // 点击详情跳转到班级页面
      toAttStatClass (row) {
        this.$parent.defaultValue.push(row.StatisticsID.toString())
        // AttTeachingClass.defaultValue.push(row.StatisticsID);
        this.$parent.comName = 'AttTeachingClassForClass'
        // this.$parent.disciplineID = row.DisciplineID
        this.$parent.cascaderData = 4
        this.$parent.classID = row.StatisticsID.toString()
      // this.$parent.className = row.StatisticsName
      },
      // 返回上一级按钮
      backLevel () {
        this.$parent.defaultValue.pop()
        this.$parent.cascaderData = 2
        this.$parent.comName = 'AttTeachingClassForGrade'
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
            `${this.$store.state.apiPath}/api/ClassAttStatistics/ExportForGradeYear`
            ,
            {
              SchoolDistrictID: this.schoolDistrictID,
              GradeYearID: this.gradeYearID,
              DisciplineID: this.disciplineID,
              ApplicationID: this.applicationID,
              ApplicationSubMenuID: this.applicationSubMenuID,
              StartTime: this.startDate,
              EndTime: this.endDate,
              PageIndex: this.pagination.current,
              PageSize: this.pagination.pageSize,
              AMorPM: this.aMorPM,
              AMorPMOrder: this.aMorPMOrder
            }
          )
        // }
        } else {
          this.xy.msgError('当前无数据可导出。')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
@import "../css/attTeachingClass.less";
</style>
