<template>
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
      <div>
        <div style="display: inline-block;" @click.prevent="showAbnormal">
          <Checkbox v-model="onlyUnnormal">只显示非正常考勤的结果</Checkbox>
        </div>
        <!-- on-change="showAbnormal" -->
        <span @click="backLevel" class="fontMiddle">上一级</span>
        <Button class="xy-primary" @click="exportModal">导出</Button>
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
        <div class="avatar">
          <img v-if="iconPath !== ''" style="width: 60px;height: 60px; margin-top:5px; border-radius: 50%; display:inline-block" :src="iconPath" alt="" />
          <div class="avator-box" v-if="!iconPath">
            {{xy.showName(fullName)}}
          </div>
          <div class="avatarDetail">
            <span style="font-size:15px;margin-bottom: 5px;font-weight:700;color:rgba(51,51,51,1);">{{fullName}}</span>
            <span style="font-size:14px; color:rgba(102,102,102,1);">{{userName}}</span>
            <span style="font-size:14px; color:rgba(153,153,153,1);">{{classShowName}}</span>
          </div>
        </div>
        <div>
          <div class="upRatePosition">
            <span class="upRateFont">出勤率</span>
          </div>
          <div class="circlePosition">
            <i-circle
              :percent="attendanceRate"
              :size="circleSize"
              stroke-linecap="square"
              :stroke-width="strokeWidth"
              :trail-width="trailWidth"
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
          <li v-for="item in attRateList" :key="item.id">
            <div class="details">
              <span class="rateFont">{{item.AttTypeNum}}次</span>
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
          :scrollx="true"
          @change="handleTableChange"
          >
          <!-- 日期 -->
          <div slot="ClassDate" slot-scope="text, record">
            <span :class="record.IsLeaveAfterSwipe ? 'table-el-hover' : ''" @click="record.IsLeaveAfterSwipe ? change(record) : ''">
              {{record.ClassDate}}
            </span>
          </div>
          <!-- 节次 -->
          <div slot="AMorPMName" style="min-width: 140px" slot-scope="text, record">
            {{record.AMorPMName}}
          </div>
          <!-- 教学班 -->
          <div slot="SubjectName" style="min-width: 160px" slot-scope="text, record">
            {{record.SubjectName}}
          </div>
          <!-- 考勤时间 -->
          <div slot="AttdentTime" slot-scope="text, record">
            {{record.AttdentTime}}
          </div>
          <!-- 考勤方式 -->
          <div slot="AttFromName" style="min-width: 100px" slot-scope="text, record">
            {{record.AttFromName}}
          </div>
          <!-- 考勤状态 -->
          <div slot="AttdentName" style="min-width: 100px" slot-scope="text, record">
            {{record.AttdentName}}
          </div>
          <!-- 操作 -->
          <div slot="Action" slot-scope="text, record" class="oprateList">
            <a
              @click="record.IsLeaveAfterSwipe ? change(record) : ''"
              :disabled=!record.IsLeaveAfterSwipe
              class="oprateBtn1"
              >
              查看变更
            </a>
          </div>
        </XyAntTable>
      </div>
    </div>
    <Modal
      v-model="checkChange"
      width="817"
      title="变更记录"
      class-name="modalPosition"
      :mask-closable="false"
      >
      <XyAntTable
        :columns="changeDetail"
        :dataSource="changeDetailData"
        :tableLoading="changeLoading"
        :isPage="false"
        >
        <!-- 修改时间 -->
        <div slot="LastModifyByDate" slot-scope="text, record">
          {{record.LastModifyByDate}}
        </div>
      </XyAntTable>
      <div slot="footer">
        <Button class="xy-modal-primary" shape="circle"  @click="closeModal">关闭</Button>
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
      studentID: String,
      studentName: String,
      schoolName: String,
      gradeName: String,
      className: String,
      aMorPM: String,
      aMorPMOrder: Number,
      isCustom: Boolean,
      disciplineID: Number,
      disciplineName: String,
      cascaderData: Number
    },
    data () {
      return {
        checkChange: false,
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
        tableLoading: true,
        changeLoading: true,
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
        weekdata: '',
        iconPath: '',
        fullName: '',
        userName: '',
        classShowName: '', // 后台返回回来用于左侧展示的班级名字，其实同上
        loading: true,
        changeDetail: [],
        changeDetailData: [],
        // 点击详情后显示表格数据
        onlyUnnormal: true
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
        this.xy.get(`${this.$store.state.apiPath}/api/ClassAttStatistics/GetAttStatisticForStudent`, {
          StudentID: this.studentID,
          ClassID: this.classID,
          StartTime: this.startDate,
          EndTime: this.endDate,
          AMorPM: this.aMorPM,
          AMorPMOrder: this.aMorPMOrder,
          OnlyUnnormal: this.onlyUnnormal
        }
        )
          .then(res => {
            // this.xy.unloading()
            if (res.success) {
              if (res.data.Icon) {
                this.iconPath = res.data.Icon
              } else {
                this.iconPath = ''
              }
              this.fullName = res.data.FullName
              this.userName = res.data.UserName
              this.classShowName = res.data.ClassName
              this.attendanceRate = Number(res.data.Ratio)
              this.endTime = this.xy
                .moment(res.data.EndTime)
                .format('YYYY-MM-DD HH:mm')
              this.leftEmpty = false
              if (res.data.Summary.length === 0) {
                this.leftEmpty = true
                return
              }
              this.attRateList = res.data.Summary
              for (let i in this.attRateList) {
                // 正常
                if (this.attRateList[i].AttTypeID === '正常') {
                  this.attRateList[i].ProcessColor = '#4196FF'
                } else if (this.attRateList[i].AttTypeID === '迟到') {
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
        this.xy
          .get(
            `${this.$store.state.apiPath}/api/ClassAttStatistics/GetForStudent`,
            {
              StudentID: this.studentID,
              ClassID: this.classID,
              StartTime: this.startDate,
              EndTime: this.endDate,
              PageIndex: this.pagination.current,
              PageSize: this.pagination.pageSize,
              AMorPM: this.aMorPM,
              AMorPMOrder: this.aMorPMOrder,
              OnlyUnnormal: this.onlyUnnormal
            }
          )
          .then(res => {
            this.tableLoading = false
            if (res.success) {
              this.loading = false
              this.pagination.total = res.data.totalRecords
              this.rightEmpty = false
              if (res.data.totalRecords === 0) {
                this.rightEmpty = true
                return
              }
              this.columns = [
                {
                  title: '日期',
                  dataIndex: 'ClassDate',
                  width: 110,
                  scopedSlots: { customRender: 'ClassDate' },
                  fixed: 'left' // 如果小屏幕table出现滚动条，需要固定第一列
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
                  width: 180,
                  scopedSlots: { customRender: 'AttdentTime' }
                },
                {
                  title: '考勤方式',
                  dataIndex: 'AttFromName',
                  scopedSlots: { customRender: 'AttFromName' }
                },
                {
                  title: '考勤状态',
                  dataIndex: 'AttdentName',
                  scopedSlots: { customRender: 'AttdentName' }
                },
                {
                  title: '操作',
                  dataIndex: 'Action',
                  fixed: 'right',
                  width: 110,
                  scopedSlots: { customRender: 'Action' }
                }
              ]
              this.columnsData = res.data.data
              for (let c in this.columnsData) {
                this.columnsData[c].ClassDate = this.columnsData[c].ClassDate.substr(0, 10)
              }
              for (let d in this.columnsData) {
                this.columnsData[d].AttdentTime = this.xy.moment(this.columnsData[d].AttdentTime).format('YYYY-MM-DD HH:mm:ss')
              }
              this.columnsData.map((item, index) => {
                this.$set(item, 'key', index)
              })
            }
          })
      },
      // 点击查看变更
      async change (row) {
        this.changeLoading = true
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/AttsLesson/GetAttendanceRecordByClassBaseID', {
            recordID: row.RecordID
          })
        this.changeLoading = false
        if (res.success) {
          this.changeDetail = [
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
              dataIndex: 'LastModifyByDate',
              width: 200,
              scopedSlots: { customRender: 'LastModifyByDate' }
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
          this.changeDetailData = res.data
          this.changeDetailData.map((item, index) => {
            this.$set(item, 'key', index)
          })
          this.checkChange = true
        }
      },
      closeModal () {
        this.checkChange = false
      },
      // 返回上一级按钮
      backLevel () {
        this.$parent.comName = 'AttTeachingClassForClass'
        this.$parent.cascaderData = 4
      },
      // 只显示非正常考勤的结果
      showAbnormal () {
        this.onlyUnnormal = !this.onlyUnnormal
        this.getSummary()
        this.getTP()
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
            `${this.$store.state.apiPath}/api/ClassAttStatistics/ExportForStudent`,
            {
              SchoolDistrictID: this.schoolDistrictID,
              StudentID: this.studentID,
              ClassID: this.classID,
              StartTime: this.startDate,
              EndTime: this.endDate,
              OnlyUnnormal: this.onlyUnnormal,
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
.avator-box {
  display: inline-block;
                        vertical-align: center;
                        width: 60px;
                        height: 60px;
                        line-height: 60px;
                        border-Radius: 50%;
                        overflow: hidden;
                        background-Color: #4196ff;
                        text-align: center;
                        margin-top:5px;
                        font-size: 16px;
                        color: #fff
}
</style>
