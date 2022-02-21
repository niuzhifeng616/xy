
<template>
  <div class="xy-content-body">
    <div class="leaveHead">
      <span class="leftHead" v-cloak>数据截止到：{{endTime}}</span>
      <div class="centerHead" v-if="showBeforeAndAfter">
        <Icon style="cursor: pointer;" v-if="isCustom" type="ios-arrow-back" @click="before" />
        <span style="margin: 0 25px;">
          <div style="display:inline-block;color: #7B7B7B; text-align:center;">
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
      <div class="no-data-box leaveBody" v-if="leftEmpty && rightEmpty" v-cloak>
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
      </div>

      <div class="leaveBody" v-if="!leftEmpty || !rightEmpty">
        <div v-if="leftEmpty" class="no-data-box" style="margin: 100px auto;"  v-cloak>
          <img class="no-data-img" src="@/assets/common/nullData.svg" />
          <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
        </div>
        <div class="summaryLeave" v-if="!leftEmpty">
          <div class="avatar">
            <img
              v-if="iconPath !== ''"
              style="width: 60px;height: 60px; margin-top:5px; border-radius: 50%; display:inline-block"
              :src="iconPath"
              alt
            />
            <div class="avator-box" v-if="!iconPath">{{xy.showName(fullName)}}</div>

            <div class="avatarDetail">
              <span
                style="font-size:15px;
                            margin-bottom: 5px;
                            font-weight:700;
                            color:rgba(51,51,51,1);"
              >{{fullName}}</span>
              <span
                style="font-size:14px;
                            color:rgba(102,102,102,1);"
              >{{userName}}</span>
              <span
                style="font-size:14px;
                            color:rgba(153,153,153,1);"
              >{{classShowName}}</span>
            </div>
          </div>
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
              <span style="margin-bottom: 17px;">请假次数</span>
            </div>
          </div>

          <div class="summaryFont">各类型请假时间占比</div>
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
          <div v-if="rightEmpty" class="no-data-box" style="margin: 100px auto;"  v-cloak>
            <img class="no-data-img" src="@/assets/common/nullData.svg" />
            <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
          </div>
          <div v-if="!isType && !rightEmpty">
            <XyAntTable
              :columns="columnsPeople"
              :dataSource="columnsPeopleData"
              :nullData="nullData"
              :tableLoading="tableLoading"
              :pagination="pagination"
              :scrollx="true"
              @change="handleTableChange"
              >
              <div slot="LeaveTypeName"  slot-scope="text, record">
                <span class="table-el-hover"  @click="showDetail(record)">
                  {{record.LeaveTypeName}}
                </span>
              </div>
              <div slot="ApplicationName"   slot-scope="text, record">
                {{record.ApplicationName}}
              </div>
              <div slot="ApplicantName"  slot-scope="text, record">
                  {{record.ApplicantName}}
              </div>
              <div slot="CreateTime"  slot-scope="text, record">
                  {{record.CreateTime}}
              </div>
              <div slot="ApplyTime"   slot-scope="text, record">
                  {{record.IsCycleLeave ? xy.moment(record.ApplyTime.split('~')[0]).format('YYYY-MM-DD') + '~' + xy.moment(record.ApplyTime.split('~')[1]).format('YYYY-MM-DD')  + '周期性请假' : record.ApplyTime.split('~')[0] + '~' + record.ApplyTime.split('~')[1]}}
              </div>
              <span slot="operation" slot-scope="text, record">
                <a @click="showDetail(record)">详情</a>
              </span>
            </XyAntTable>
            </div>
            <div v-if="isType  && !rightEmpty">
            <XyAntTable
              :columns="columnsDetail"
              :dataSource="columnsDetailData"
              :nullData="nullData"
              :tableLoading="tableLoading"
              :pagination="pagination"
              :scrollx="true"
              @change="handleTableChange"
              >
              <div slot="LeaveTypeName" slot-scope="text, record">
                <span class="table-el-hover" @click="showDetail(record)">
                  {{record.LeaveTypeName}}
                </span>
              </div>
              <div slot="ApplicationName"  slot-scope="text, record">
                {{record.ApplicationName}}
              </div>
              <div slot="ApplicantName" slot-scope="text, record">
                  {{record.ApplicantName}}
              </div>
              <div slot="CreateTime" slot-scope="text, record">
                  {{record.CreateTime}}
              </div>
              <div slot="ApplyTime" slot-scope="text, record">
                  {{record.IsCycleLeave ? xy.moment(record.ApplyTime.split('~')[0]).format('YYYY-MM-DD') + '~' + xy.moment(record.ApplyTime.split('~')[1]).format('YYYY-MM-DD')  + '周期性请假' : record.ApplyTime.split('~')[0] + '~' + record.ApplyTime.split('~')[1]}}
              </div>
              <span slot="operation" slot-scope="text, record">
                <a @click="showDetail(record)">详情</a>
              </span>
            </XyAntTable>
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
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import ApplyLook from '@/pages/attendance/components/studentLeave/ApplyLook.vue'
  export default {
    name: 'StatPeople',
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
      studentID: String,
      studentName: String,
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
        columnsPeople: [],
        columnsPeopleData: [],
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
        mInfo: false,
        changeItem: '',
        leaveRateList: [],
        iconPath: '',
        fullName: '',
        userName: '',
        classShowName: '',
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
        }
      }
    },
    watch: {
      'changeWeekBtn' (val) {
        // if (this.isType) {
        //   this.pageDetailCurrent = 1
        //   this.getType()
        // } else {
        this.pageCurrent = 1
        this.pagination.current = 1
        this.pagination.pageSize = 15
        this.pageSize = 15
        this.getSummary()
        this.getTP()
      // }
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
        // api/AttStatistics/GetStudentAttStatisticSummary?SchoolDistrictID={SchoolDistrictID}&GradeYearID={GradeYearID}&ClassID={ClassID}&ApplicationID={ApplicationID}&ApplicationSubMenu={ApplicationSubMenu}&StartTime={StartTime}&EndTime={EndTime}&AMorPM={AMorPM}&AMorPMOrder={AMorPMOrder}
        let _this = this
        // this.xy.loading()
        this.xy
          .get(
            `${this.$store.state.apiPath}/api/StudentLeaveStatistics/GetForStudent`,
            {
              StudentID: _this.studentID,
              StartTime: _this.startDate,
              EndTime: _this.endDate
            }
          )
          .then(res => {
            if (res.success) {
              this.xy.unloading()
              let result = res.data
              _this.endTime = _this.xy.moment(result.EndTime).format('YYYY-MM-DD HH:mm')
              // _this.leftEmpty = false
              // if (!result.IsHaveBaseInfo) {
              //   _this.leftEmpty = true
              //   return
              // };
              _this.fullName = result.FullName
              _this.userName = result.UserName
              _this.classShowName = result.ClassName
              _this.iconPath = result.Icon ? result.Icon : ''
              _this.totalLeaveTime = result.LeaveSummary.TotalLeaveTime
              _this.totalLeaveNum = result.LeaveSummary.TotalLeaveNum
              _this.totalTimes = result.LeaveSummary.TotalTimes
              _this.leaveRateList = []
              for (let i in result.LeaveRatioSummary) {
                _this.leaveRateList.push({
                  rate: result.LeaveRatioSummary[i].Ratio,
                  time: result.LeaveRatioSummary[i].Time,
                  id: result.LeaveRatioSummary[i].LeaveTypeId,
                  typeName: result.LeaveRatioSummary[i].LeaveTypeName
                })
              }
              for (let j in _this.leaveRateList) {
                if (_this.leaveRateList[j].typeName === '事假') {
                  _this.leaveRateList[j].ProcessColor = '#4196FF'
                } else if (_this.leaveRateList[j].typeName === '病假') {
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
        this.pagination.current = 1
        this.pagination.pageSize = 15
        this.pageSize = 15
        this.itemDetail(item)
      },
      // 点击左侧数据详情
      itemDetail (item) {
        this.tableLoading = true
        let _this = this
        this.changeItem = item
        this.leaveTypeID = item.id
        this.isType = true
        this.isActive = item
        this.xy.get(`${this.$store.state.apiPath}/api/StudentLeaveStatistics/GetPageForStudent`, {
          StudentID: _this.studentID,
          LeaveTypeID: item.id,
          StartTime: _this.startDate,
          EndTime: _this.endDate,
          PageIndex: _this.pagination.current,
          PageSize: _this.pagination.pageSize
        }).then(res => {
          if (res.success) {
            _this.total = res.data.totalRecords
            _this.pagination.total = res.data.totalRecords / 1
            _this.columnsDetail = [
              {
                title: '请假类型',
                dataIndex: 'LeaveTypeName',
                // width: 110,
                fixed: 'left',
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
            for (let i in _this.columnsDetailData) {
              _this.columnsDetailData[i].CreateTime = _this.xy.moment(_this.columnsDetailData[i].CreateTime).format('YYYY-MM-DD HH:mm:ss')
            }
          } else {
            this.xy.msgError(res.msg)
          };
          this.tableLoading = false
        })
      },
      // 获取右侧数据
      getTP () {
        this.tableLoading = true
        let _this = this
        this.isType = false
        this.isLoading = true
        _this.rightEmpty = false
        this.xy.get(
          `${this.$store.state.apiPath}/api/StudentLeaveStatistics/GetPageForStudent`,
          {
            StudentID: _this.studentID,
            LeaveTypeID: 0,
            StartTime: _this.startDate,
            EndTime: _this.endDate,
            PageIndex: _this.pagination.current,
            PageSize: _this.pagination.pageSize
          }
        ).then(res => {
          if (res.success) {
            this.isLoading = false
            _this.total = res.data.totalRecords
            _this.pagination.total = res.data.totalRecords / 1
            _this.rightEmpty = false
            _this.leftEmpty = false
            if (res.data.totalRecords === 0) {
              _this.rightEmpty = true
              _this.leftEmpty = true
              return
            };
            _this.columnsPeople = [
              {
                title: '请假类型',
                dataIndex: 'LeaveTypeName',
                // width: 110,
                fixed: 'left',
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
                scopedSlots: { customRender: 'ApplyTime' }
              }
            ]
            _this.columnsPeople.push({
              title: '操作',
              dataIndex: 'operation',
              width: 80,
              fixed: 'right',
              scopedSlots: { customRender: 'operation' }
            })
            _this.columnsPeopleData = res.data.data
            for (let i in _this.columnsPeopleData) {
              _this.columnsPeopleData[i].CreateTime = _this.xy.moment(_this.columnsPeopleData[i].CreateTime).format('YYYY-MM-DD HH:mm:ss')
            }
          } else {
            this.xy.msgError(res.msg)
          }
          this.tableLoading = false
        }
        )
      },
      backLevel () {
        this.$parent.defaultValue.pop()
        this.$parent.cascaderData = 3
        this.$parent.comName = 'StatClass'
      },
      // 点击查看详情侧边栏
      showDetail (row) {
        this.isLook = true
        this.info = row
        this.type = 1
        this.code = '1'
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
          let _this = this
          let idArr = this.$store.state.common.menuId.split(',')
          this.applicationID = idArr[1]
          this.applicationSubMenuID = idArr[2]
          if (this.isType) {
            _this.xy.downFile(
              `${_this.$store.state.apiPath}/api/StudentLeaveStatistics/ExportForStudent`,
              {
                SchoolDistrictID: _this.schoolDistrictID,
                GradeYearID: _this.gradeYearID,
                ClassID: _this.classID,
                StudentID: _this.studentID,
                LeaveTypeId: _this.leaveTypeID,
                ApplicationID: _this.applicationID,
                ApplicationSubMenuID: _this.applicationSubMenuID,
                StartTime: _this.startDate,
                EndTime: _this.endDate
              }
            )
          } else {
            _this.xy.downFile(
              `${_this.$store.state.apiPath}/api/StudentLeaveStatistics/ExportForStudent`,
              {
                SchoolDistrictID: _this.schoolDistrictID,
                GradeYearID: _this.gradeYearID,
                ClassID: _this.classID,
                StudentID: _this.studentID,
                LeaveTypeID: 0,
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
.avator-box {
  display: inline-block;
  vertical-align: center;
  width: 60px;
  height: 60px;
  line-height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #4196ff;
  text-align: center;
  margin-top: 5px;
  font-size: 16px;
  color: #fff;
}
</style>
