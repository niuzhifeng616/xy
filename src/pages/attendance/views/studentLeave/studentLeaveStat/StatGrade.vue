
<template>
  <div class="xy-content-body">
    <div class="leaveHead">
      <span class="leftHead" v-cloak>数据截止到：{{endTime}}</span>
      <div class="centerHead" v-if="showBeforeAndAfter">
        <Icon style="cursor: pointer;" v-if="isCustom" type="ios-arrow-back" @click="before" />
        <span style="margin: 0 25px;">
          <div style="display:inline-block; color: #7B7B7B; text-align:center;">
            <span v-if="todayShow">今天</span>
            <span v-if="startDateShowendDate" v-cloak>{{startDate}} - {{endDate}}</span>
            <span v-if="startDateShowtoday" v-cloak>{{startDate}} - {{endDate}}</span>
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
    <!-- <div v-if="isLoading" style="display:flex; justify-content:center; align-items: center;">
      <img src="@/assets/common/loading.png" alt />
    </div> -->
    <div>
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
        <div class="summaryTotal">
          <div class="summaryItem">
            <span class="summaryUp" v-cloak>{{totalLeaveTime}}</span>
            <span style="margin-bottom: 17px;">请假时长</span>
          </div>
          <div class="summaryItem">
            <span class="summaryUp" v-cloak>{{totalLeaveNum}}</span>
            <span style="margin-bottom: 17px;">请假人数</span>
          </div>
          <div class="summaryItem">
            <span class="summaryUp" v-cloak>{{totalTimes}}</span>
            <span style="margin-bottom: 17px;">请假人次</span>
          </div>
        </div>

        <div class="summaryFont">各类型请假时间占比：</div>
        <ul>
          <li
            v-for="item in leaveRateList"
            :class="isActive == item ? 'active-stat' : '' "
            :key="item.id"
          >
            <div class="details">
              <span class="rateFont">{{item.time}}小时</span>
              <span class="rateFont">{{item.rate}}%</span>
            </div>
            <div style="width: 405px;display:flex;">
                <div class="fontControl">
                  <Tooltip :content="item.typeName">
                    <span class="fontPos">{{item.typeName}}</span>
                  </Tooltip>
                </div>
              <div class="progress">
                <i-progress
                  :percent="item.rate"
                  :stroke-width="14"
                  :stroke-color="item.ProcessColor"
                  hide-info
                />
              </div>
              <span
                @click="getDetail(item)"
                style="margin-right: 12px; color:rgb(99, 146, 233); cursor: pointer;"
              >详情</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="tableWidthControl">
        <div v-if="rightEmpty" class="no-data-box" style="margin: 100px auto;" v-cloak>
          <img class="no-data-img" src="@/assets/common/nullData.svg" />
          <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
        </div>
        <div v-if="!isType && !rightEmpty">
            <XyAntTable
              :columns="columnsGrade"
              :dataSource="columnsGradeData"
              :nullData="nullData"
              :tableLoading="tableLoading"
              :pagination="pagination"
              :scrollx="true"
              @change="handleTableChange"
              >
              <div slot="Name" slot-scope="text, record">
                <span class="table-el-hover" @click="toStatClass(record)">
                  {{record.Name}}
                </span>
              </div>
              <div slot="Time" style="min-width:100px"  slot-scope="text, record">
                {{record.Time}}
              </div>
              <div slot="Num" style="min-width:100px" slot-scope="text, record">
                  {{record.Num}}
              </div>
              <div slot="Times" style="min-width:100px" slot-scope="text, record">
                  {{record.Times}}
              </div>
              <span slot="operation" slot-scope="text, record">
                <a @click="toStatClass(record)">详情</a>
              </span>
            </XyAntTable>
        </div>
        <div v-if="isType  && !rightEmpty">
          <XyAntTable
              :columns="columnsDetail"
              :dataSource="columnsDetailData"
              :nullData="nullData"
              :tableLoading="tableLoading"
              :pagination="pagination1"
              :scrollx="true"
              @change="handleTableChange1"
            >
              <div slot="Icon" slot-scope="text, record">
                <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
                  <span class="head-font">
                    {{ xy.showName(record.StudentName)}}
                  </span>
                </div>
                <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
              </div>
              <div slot="StudentName" slot-scope="text, record">
                <span class="table-el-hover" @click="showDetail(record)">
                  {{record.StudentName}}
                </span>
              </div>
              <div slot="UserName" style="min-width:120px" slot-scope="text, record">
                  {{record.UserName}}
              </div>
               <div slot="ClassName" style="min-width:160px" slot-scope="text, record">
                  {{record.ClassName}}
              </div>
              <div slot="LeaveTypeName" style="min-width:100px" slot-scope="text, record">
                  {{record.LeaveTypeName}}
              </div>
              <div slot="ApplicationName" style="min-width:110px" slot-scope="text, record">
                  {{record.ApplicationName}}
              </div>
              <div slot="ApplicantName" style="min-width:120px" slot-scope="text, record">
                  {{record.ApplicantName}}
              </div>
              <div slot="CreateTime" style="min-width:170px" slot-scope="text, record">
                  {{record.CreateTime}}
              </div>
              <div slot="ApplyTime"  slot-scope="text, record">
                  {{record.IsCycleLeave ? xy.moment(record.ApplyTime.split('~')[0]).format('YYYY-MM-DD') + '~' + xy.moment(record.ApplyTime.split('~')[1]).format('YYYY-MM-DD')  + '周期性请假' : record.ApplyTime.split('~')[0] + '~' + record.ApplyTime.split('~')[1]}}
              </div>
              <span slot="operation" slot-scope="text, record">
                <a @click="showDetail(record)">详情</a>
              </span>
            </XyAntTable>
        </div>
      </div>
    </div>
    </div>

    <Drawer
      title="请假详情"
      v-model="isLook"
      width="560"
      class="detailModel"
      :transfer="false"
      :mask-closable="false"
    >
      <div class="drawer">
        <ApplyLook v-if="isLook" :info="info" :type="type" :code="code"></ApplyLook>
      </div>
    </Drawer>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import ApplyLook from '@/pages/attendance/components/studentLeave/ApplyLook.vue'
  export default {
    name: 'StatGrade',
    components: {
      ApplyLook,
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
      isCustom: Boolean
    },
    data () {
      return {
        noDataText: '该搜索条件下没有结果。',
        nullData: '该搜索条件下没有结果。',
        isLoading: false,
        weekdata: '',
        leftEmpty: false,
        rightEmpty: false,
        attRateList: [],
        endTime: '',
        attendanceRate: 0,
        processColor: '#FDB539',
        isType: false,
        getColList: [],
        columnsGrade: [],
        columnsGradeData: [],
        hasPage: true,
        total: 0,
        columnsDetail: [],
        columnsDetailData: [],
        loading: true,
        isLook: false,
        info: '',
        type: 0,
        leaveTypeID: '',
        code: '',
        leaveRateList: [],
        totalLeaveTime: '',
        totalLeaveNum: '',
        totalTimes: '',
        isActive: {},
        pageCurrent: 1,
        pageDetailCurrent: 1,
        pages: [15, 30, 50, 100],
        pageIndex: 1,
        pageSize: 15,
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
        pagination1: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination1.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination1.current = 1
            this.pagination1.pageSize = pageSize
          }
        }
      }
    },
    watch: {
      'changeWeekBtn' (val) {
        this.pageCurrent = 1
        this.pagination.current = 1
        this.pagination1.current = 1
        this.pagination.pageSize = 15
        this.pagination1.pageSize = 15
        this.pageSize = 15
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
      handleTableChange1 () {
        this.itemDetail(this.changeItem)
      },
      // 获取左侧汇总数据
      getSummary () {
        var _this = this
        // this.xy.loading()
        this.xy
          .get(
            `${this.$store.state.apiPath}/api/StudentLeaveStatistics/GetLeaveStatisticsSummary`,
            {
              SchoolDistrictID: _this.schoolDistrictID,
              GradeYearID: _this.gradeYearID,
              ClassID: 0,
              ApplicationID: _this.applicationID,
              ApplicationSubMenuID: _this.applicationSubMenuID,
              StartTime: _this.startDate,
              EndTime: _this.endDate
            }
          )
          .then(res => {
            if (res.success) {
              this.xy.unloading()
              var result = res.data
              _this.totalLeaveTime = result.LeaveSummary.TotalLeaveTime
              _this.totalLeaveNum = result.LeaveSummary.TotalLeaveNum
              _this.totalTimes = result.LeaveSummary.TotalTimes
              _this.endTime = _this.xy.moment(result.EndTime).format('YYYY-MM-DD HH:mm')
              _this.leaveRateList = []
              for (var i in result.LeaveRatioSummary) {
                _this.leaveRateList.push({
                  rate: result.LeaveRatioSummary[i].Ratio,
                  time: result.LeaveRatioSummary[i].Time,
                  id: result.LeaveRatioSummary[i].LeaveTypeId,
                  typeName: result.LeaveRatioSummary[i].LeaveTypeName
                })
              };
              for (var j in _this.leaveRateList) {
                if (_this.leaveRateList[j].typeName === '事假') {
                  _this.leaveRateList[j].ProcessColor = '#4196FF'
                } else if (_this.leaveRateList[i].typeName === '病假') {
                  _this.leaveRateList[j].ProcessColor = '#E74054'
                } else {
                  _this.leaveRateList[j].ProcessColor = '#FDB539'
                }
              };
            } else {
              this.xy.unloading()
              this.xy.msgError(res.msg)
            }
          })
      },
      getDetail (item) {
        this.pageDetailCurrent = 1
        this.pagination1.current = 1
        this.pagination1.pageSize = 15
        this.pageSize = 15
        this.itemDetail(item)
      },
      // 点击左侧数据详情
      itemDetail (item) {
        this.tableLoading = true
        var _this = this
        this.changeItem = item
        this.leaveTypeID = item.id
        this.isType = true
        this.isActive = item
        this.xy.get(`${this.$store.state.apiPath}/api/StudentLeaveStatistics/GetStudentDetailByTypeSummary`, {
          SchoolDistrictID: _this.schoolDistrictID,
          GradeYearID: _this.gradeYearID,
          ClassID: 0,
          LeaveTypeID: item.id,
          ApplicationID: _this.applicationID,
          ApplicationSubMenuID: _this.applicationSubMenuID,
          StartTime: _this.startDate,
          EndTime: _this.endDate,
          PageIndex: _this.pagination1.current,
          PageSize: _this.pagination1.pageSize
        }).then(res => {
          if (res.success) {
            _this.total = res.data.totalRecords
            _this.pagination1.total = res.data.totalRecords / 1
            _this.columnsDetail = [
              {
                title: '',
                dataIndex: 'Icon',
                width: 46,
                className: 'table-pic',
                fixed: 'left',
                scopedSlots: { customRender: 'Icon' }
              },
              {
                title: '姓名',
                dataIndex: 'StudentName',
                width: 120,
                fixed: 'left',
                scopedSlots: { customRender: 'StudentName' }
              },
              {
                title: '用户名',
                dataIndex: 'UserName',
                scopedSlots: { customRender: 'UserName' }
              },
              {
                title: '班级',
                dataIndex: 'ClassName',
                scopedSlots: { customRender: 'ClassName' }
              },
              {
                title: '请假类型',
                dataIndex: 'LeaveTypeName',
                scopedSlots: { customRender: 'LeaveTypeName' }
              },
              {
                title: '申请类型',
                dataIndex: 'ApplicationName',
                scopedSlots: { customRender: 'ApplicationName' }
              },
              {
                title: '申请人',
                dataIndex: 'ApplicantName',
                scopedSlots: { customRender: 'ApplicantName' }
              },
              {
                title: '创建时间',
                dataIndex: 'CreateTime',
                scopedSlots: { customRender: 'CreateTime' }
              },
              {
                title: '请假时间',
                dataIndex: 'ApplyTime',
                width: 270,
                scopedSlots: { customRender: 'ApplyTime' }
              },
              {
                title: '操作',
                dataIndex: 'operation',
                width: 80,
                fixed: 'right',
                scopedSlots: { customRender: 'operation' }
              }
            ]
            _this.columnsDetailData = res.data.data
            for (var i in _this.columnsDetailData) {
              _this.columnsDetailData[i].CreateTime = _this.xy.moment(_this.columnsDetailData[i].CreateTime).format('YYYY-MM-DD HH:mm:ss')
            }
          } else {
            _this.xy.unloading()
            this.xy.msgError(res.msg)
          };
          this.tableLoading = false
        })
      },
      // 点击查看详情侧边栏
      showDetail (row) {
        this.isLook = true
        this.info = row
        this.type = 1
        this.code = '1'
      },
      // 获取右侧数据
      getTP () {
        this.tableLoading = true
        var _this = this
        this.isLoading = true
        this.isType = false
        this.rightEmpty = false
        this.xy.get(
          `${this.$store.state.apiPath}/api/StudentLeaveStatistics/GetPageForGradeYear`,
          {
            SchoolDistrictID: _this.schoolDistrictID,
            GradeYearID: _this.gradeYearID,
            ApplicationID: _this.applicationID,
            ApplicationSubMenuID: _this.applicationSubMenuID,
            StartTime: _this.startDate,
            EndTime: _this.endDate,
            PageIndex: _this.pagination.current,
            PageSize: _this.pagination.pageSize
          }
        ).then(res => {
          if (res.success) {
            this.isLoading = false
            _this.getColList = res.data.LeaveTypeColumns
            _this.total = res.data.TotalRecords
            _this.pagination.total = res.data.TotalRecords / 1
            _this.rightEmpty = false
            _this.leftEmpty = false
            if (res.data.TotalRecords === 0) {
              _this.rightEmpty = true
              _this.leftEmpty = true
              return
            };
            _this.columnsGrade = [
              {
                title: '班级',
                dataIndex: 'Name',
                fixed: 'left',
                width: 180,
                scopedSlots: { customRender: 'Name' }
              },
              {
                title: '请假时长',
                dataIndex: 'Time',
                scopedSlots: { customRender: 'Time' }
              },
              {
                title: '请假人数',
                dataIndex: 'Num',
                scopedSlots: { customRender: 'Num' }
              },
              {
                title: '请假人次',
                dataIndex: 'Times',
                scopedSlots: { customRender: 'Times' }
              }
            ]
            for (var i in _this.getColList) {
              _this.columnsGrade.push({
                title: _this.getColList[i].LeaveTypeName + '时长',
                dataIndex: _this.getColList[i].LeaveTypeColumnName,
                scopedSlots: { customRender: _this.getColList[i].LeaveTypeColumnName }
              })
            };
            _this.columnsGrade.push({
              title: '操作',
              dataIndex: 'operation',
              width: 80,
              fixed: 'right',
              scopedSlots: { customRender: 'operation' }
            })
            _this.columnsGradeData = res.data.LeaveSummaryDetail
          } else {
            this.xy.msgError(res.msg)
          }
          this.tableLoading = false
        }
        )
      },
      backLevel () {
        this.$parent.defaultValue.pop()
        this.$parent.cascaderData = 1
        this.$parent.comName = 'StatSchool'
      },
      // 点击详情跳转到班级页面
      toStatClass (row) {
        this.$parent.defaultValue.push(Number(row.ID))
        this.$parent.cascaderData = 3
        this.$parent.comName = 'StatClass'
        this.$parent.classID = row.ID.toString()
        this.$parent.className = row.Name
      },
      // 前一天/周/月
      before () {
        this.isType = false
        this.$parent.beforeDate()
      },
      // 后一天/周/月
      after () {
        this.isType = false
        this.$parent.afterDate()
      },
      // 导出
      exportModal () {
        if (this.total !== 0) {
          var _this = this
          let idArr = this.$store.state.common.menuId.split(',')
          this.applicationID = idArr[1]
          this.applicationSubMenuID = idArr[2]
          if (this.isType) {
            this.xy.downFile(
              `${_this.$store.state.apiPath}/api/StudentLeaveStatistics/ExportLeaveForType`,
              {
                SchoolDistrictID: _this.schoolDistrictID,
                GradeYearID: _this.gradeYearID,
                ClassID: 0,
                LeaveTypeId: _this.leaveTypeID,
                ApplicationID: _this.applicationID,
                ApplicationSubMenuID: _this.applicationSubMenuID,
                StartTime: _this.startDate,
                EndTime: _this.endDate
              }
            )
          } else {
            _this.xy.downFile(
              `${_this.$store.state.apiPath}/api/StudentLeaveStatistics/ExportForGradeYear`,
              {
                SchoolDistrictID: _this.schoolDistrictID,
                GradeYearID: _this.gradeYearID,
                ApplicationID: _this.applicationID,
                ApplicationSubMenuID: _this.applicationSubMenuID,
                StartTime: _this.startDate,
                EndTime: _this.endDate
              }
            )
          }
        // }
        } else {
          this.xy.msgError('当前无数据可导出。')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
@import "../../css/stat.less";
</style>
