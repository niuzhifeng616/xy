<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
        <div class="fl pr">
            <Cascader :data="cascader" v-model="defaultValue" change-on-select class="fl" @on-change="cascaderChange"
                :clearable="false" style="width:230px;"></Cascader>
        </div>
        <div class="fr pr">
            <div style="display:inline-block">
                <span>
                    请假学生：
                </span>
                <i-input clearable v-model="searchNames" placeholder="用户名/姓名" style="width: 140px;margin-right:15px">
                </i-input>
            </div>
            <span>
                申请日期：
            </span>
            <date-picker :value="dates" separator="~" format="yyyy/MM/dd" type="daterange" split-panels
                placeholder="开始时间-结束时间" @on-change="dateChange" style="width: 190px; margin-left:0px;"
                class=" xy-content-title-search" :editable="false">
            </date-picker>
            <i-select v-model="leaveTypeID" class=" xy-content-title-search" style="width:140px;"
                @on-change="leaveTypeChange">
                <i-option :value="0" :key="0">所有类型</i-option>
                <i-option v-cloak v-for="types in typeValue" :value="types.LeaveTypeID"
                    :key="types.LeaveTypeID">{{ types.LeaveTypeName }}</i-option>
            </i-select>
            <i-select v-model="leaveID" class=" xy-content-title-search" style="width:140px;"
                @on-change="leaveChange">
                <i-option :value="0" :key="0">全部</i-option>
                <i-option v-cloak v-for="types in isLeave" :value="types.value"
                    :key="types.value">{{ types.label }}</i-option>
            </i-select>
            <i-select v-model="approvalStateID" class=" xy-content-title-search" style="width:140px;"
                @on-change="approvalStateChange">
                <i-option v-cloak v-for="apps in approvalValue" :value="apps.approvalID"
                    :key="apps.approvalID">{{ apps.approvalName }}</i-option>
            </i-select>
            <div style="display:inline-block">
                <Button class="xy-primary" @click="query" style="margin-left:20px">查询</Button>
            </div>
        </div>
    </div>
    <div class="xy-content-body">
        <XyAntTable
          :columns="columns"
          :dataSource="columnsData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
        >
          <div slot="IconRender" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ showName(record.StudentName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <div slot="UserNameRender" slot-scope="text, record">
            <span class="table-el-hover" @click="look(record)">
              {{record.StudentName}}
            </span>
          </div>
          <div slot="timeRender" slot-scope="text, record">
             <span v-if="record.IsCycleLeave">
              {{xy.moment(new Date(record.StartTime)).format('YYYY-MM-DD') + '~' + xy.moment(new Date(record.EndTime)).format('YYYY-MM-DD') + (record.IsCycleLeave ? '周期性请假' : '') }}
            </span>
            <span v-else>
              {{xy.moment(new Date(record.StartTime)).format('YYYY-MM-DD HH:mm') + '~' + xy.moment(new Date(record.EndTime)).format('YYYY-MM-DD HH:mm') + (record.IsCycleLeave ? '周期性请假' : '') }}
            </span>
          </div>
          <div slot="CreatedDateRender" slot-scope="text, record">
              {{xy.moment(new Date(record.CreateByDate)).format('YYYY-MM-DD HH:mm')}}
          </div>
          <span slot="StateRender" slot-scope="text, record">
            <span v-if="record.ApplicationState===0"><i class="iconfont icon-default">&#xe719;</i>{{record.ApplicationStateName}}</span>
            <span v-if="record.ApplicationState===1"><i class="iconfont icon-info">&#xe719;</i>{{record.ApplicationStateName}}</span>
            <span v-if="record.ApplicationState===2"><i class="iconfont icon-success">&#xe719;</i>{{record.ApplicationStateName}}</span>
            <span v-if="record.ApplicationState===3"><i class="iconfont icon-error">&#xe719;</i>{{record.ApplicationStateName}}</span>
            <span v-if="record.ApplicationState===4"><i class="iconfont icon-end">&#xe719;</i>{{record.ApplicationStateName}}</span>
          </span>
          <span slot="oprateRender" slot-scope="text, record">
            <a @click="look(record)">详情</a>
            <a-divider type="vertical" />
            <a :disabled="!record.IsRevoke" @click="del(record)">撤销</a>
          </span>
        </XyAntTable>
    </div>
    <Drawer title="请假详情"
            v-model="isLook"
            width="560"
            class="detailModel"
            :transfer="false"
            :mask-closable="false">
        <div class="drawer">
        <ApplyLook v-if="isLook"
                   :info="info"
                   :type="type"
                   :code="code"></ApplyLook>
        </div>
    </Drawer>
</div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import ApplyLook from '@/pages/attendance/components/studentLeave/ApplyLook.vue'
  export default {
    components: {
      XyAntTable,
      ApplyLook
    },
    data () {
      return {
        isLoading: false,
        isLook: false,
        defaultValue: [],
        // 排课任务参数
        schoolStr: 0,
        classTableType: 0,
        schoolDistrictID: 0,
        yearID: 0,
        sessionID: 0,
        studentGradeForStudentYearID: 0,
        studentOrganizationID: 0,
        schoolData: [],
        yearData: [],
        sessionData: [],
        selectionAll: [],
        cascader: [],
        startDate: '',
        endDate: '',
        applicationId: '',
        applicationSubMenuId: '',
        currentItem: '',
        dates: [],
        searchNames: '',
        modal_loading: false,
        loading: true,
        modalCreate: false, // 创建弹出框默认不展示
        searchName: '',
        modalEdit: false,
        ids: '',
        isCan: false,
        typeValue: [],
        delId: '',
        approvalValue: [
          {
            'approvalID': -1,
            'approvalName': '所有状态'
          },
          {
            'approvalID': 0,
            'approvalName': '待审批'
          },
          {
            'approvalID': 1,
            'approvalName': '审批中'
          },
          {
            'approvalID': 2,
            'approvalName': '已通过'
          },
          {
            'approvalID': 3,
            'approvalName': '已拒绝'
          },
          {
            'approvalID': 4,
            'approvalName': '已撤销'
          }
        ],
        textareaContent: '',
        editState: '2',
        isText: false,
        history: false,
        leaveTypeID: 0,
        approvalStateID: -1,
        appstype: '',
        appsstart: '',
        appsend: '',
        appstext: '',
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [],
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
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
        pageIndex: 1,
        pageSize: 15,
        columnsData: [],
        isLeave: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 2
          }
        ],
        leaveID: 0
      }
    },
    created () {
      this.applicationId = this.$store.state.common.menuId.split(',')[1]
      this.applicationSubMenuId = this.$store.state.common.menuId.split(',')[2]
      this.isLoading = true
      this.getTypes()
      this.getSearchCondition()
    },
    methods: {
      showName (name) {
        if (name.indexOf('等') !== -1) {
          if (name != null) {
            name = name.substr(0, name.length - 1, '等')
            // 纯中文：汉字姓名大于2个字展示最后2个字，小于等于2个字
            if (/^[\u4e00-\u9fa5]+$/g.test(name)) {
              return name.length > 2 ? name.slice(-2) : name
            } else if (/^[A-Za-z]+$/g.test(name)) {
              // 纯英文名只展示两个字母
              return name.slice(0, 2)
            } else {
              // 其他
              return name.slice(0, 2)
            }
          }
        } else {
          if (name != null) {
            // 纯中文：汉字姓名大于2个字展示最后2个字，小于等于2个字
            if (/^[\u4e00-\u9fa5]+$/g.test(name)) {
              return name.length > 2 ? name.slice(-2) : name
            } else if (/^[A-Za-z]+$/g.test(name)) {
              // 纯英文名只展示两个字母
              return name.slice(0, 2)
            } else {
              // 其他
              return name.slice(0, 2)
            }
          }
        }
      },
      handleTableChange () {
        this.loadTable()
      },

      // 获取table/分页数据
      loadTable () {
        this.tableLoading = true
        let that = this
        this.xy.get(`${this.$store.state.apiPath}/api/StudentLeave/GetPage`,
                    {
                      schoolDistrictID: that.schoolDistrictID !== undefined ? that.schoolDistrictID : 0,
                      studentGradeForStudentYearID: that.studentGradeForStudentYearID !== undefined ? that.studentGradeForStudentYearID : 0,
                      studentOrganizationID: that.studentOrganizationID !== undefined ? that.studentOrganizationID : 0,
                      leaveTypeID: that.leaveTypeID,
                      startDate: that.startDate,
                      endDate: that.endDate,
                      applicationID: that.applicationId,
                      applicationSubMenuID: that.applicationSubMenuId,
                      studentName: that.searchNames,
                      pageIndex: that.pageIndex,
                      pageSize: that.pageSize,
                      applicationState: that.approvalStateID,
                      isLeaveSchool: that.leaveID
                    }).then(res => {
          this.tableLoading = false
          if (res.success) {
            that.total = res.data.totalRecords
            that.pagination.total = res.data.totalRecords
            that.isLoading = false
            that.columnsData = res.data.data
            that.columns = [
              {
                title: ' ',
                dataIndex: 'Icon',
                width: 40,
                scopedSlots: { customRender: 'IconRender' },
                className: 'table-pic'
              }, {
                title: '请假学生',
                dataIndex: 'StudentName',
                scopedSlots: { customRender: 'UserNameRender' },
                width: 140
              },
              {
                title: '请假类型',
                dataIndex: 'LeaveTypeName',
                width: 110
              },
              {
                title: '请假时间',
                dataIndex: 'time',
                scopedSlots: { customRender: 'timeRender' },
                width: 280
              },
              {
                title: '申请类型',
                dataIndex: 'ApplicationTypeName',
                width: 120
              },
              {
                title: '申请人',
                dataIndex: 'ApplicantName',
                width: 140
              },
              {
                title: '申请时间',
                dataIndex: 'CreatedDate',
                width: 140,
                scopedSlots: { customRender: 'CreatedDateRender' }
              },
              {
                title: '状态',
                dataIndex: 'ApplicationStateName',
                width: 100,
                scopedSlots: { customRender: 'StateRender' }
              },
              {
                title: '操作',
                dataIndex: 'oprate',
                width: 120,
                scopedSlots: { customRender: 'oprateRender' }
              }
            ]
            for (let i in that.columnsData) {
              that.columnsData[i].CreateByDate = that.xy.moment(that.columnsData[i].CreateByDate).format('YYYY-MM-DD HH:mm')
            }
          } else {
            that.xy.msgError(res.msg)
          }
        })
      },

      getSearchCondition () {
        let that = this
        this.xy.get(`${this.xyApi}/xy/comm/GetUserRangeClassPermission`, {
          applicationID: that.applicationId,
          ApplicationSubMenuID: that.applicationSubMenuId
        }).then(res => {
          if (res.success) {
            let result = res.data
            that.cascader = result
            if (result.length !== 0) {
              that.defaultValue = [result[0].value]
              that.schoolDistrictID = result[0].value
              that.schoolName = result[0].label
              that.cascaderData = 1
              that.query()
            } else {
              this.tableLoading = false
            }
          }
        })
      },

      cascaderChange (val) {
        this.cascaderData = val.length
        this.schoolDistrictID = val[0] || 0
        this.studentGradeForStudentYearID = val[1] || 0
        this.studentOrganizationID = val[2] || 0
      },

      // 开始和结束时间
      dateChange (val) {
        this.startDate = val[0]
        this.endDate = val[1]
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      getTypes () {
        let that = this
        this.xy.get(`${this.$store.state.apiPath}/api/StudentLeaveType/GetTypeAll`, {
          pageIndex: that.pageIndex,
          pageSize: that.pageSize
        }).then(res => {
          that.typeValue = res.data
        })
      },
      // 查询
      query () {
        console.log(1)
        this.studentName = this.searchNames
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },

      historyBtn () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      typeValueSearch () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      approvalSearch () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      approvalStateChange (value) {
        this.applicationState = value
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      leaveTypeChange (value) {
        this.leaveTypeID = value
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      leaveChange (value) {
        this.leaveID = value
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 审批结果chang事件
      radioBtn (val) {
        this.editState = val
        if (val === 3) {
          this.isText = true
        } else {
          this.isText = false
        }
      },

      look (row) {
        this.isLook = true
        this.info = row
        this.type = 1
        this.code = '1'
      },

      // 删除
      del (vals) {
        this.delId = vals
        this.xy.confirm('删除', '您确定要撤销这条请假申请吗？', this.dels)
      },
      async dels () {
        this.xy.loading()
        let currentObj = this.delId
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StudentLeave/EditState`, {
          LeaveApplicationID: currentObj.LeaveApplicationID,
          DeniedDescription: '',
          RecordRevoke: true,
          ApproveStatus: 4
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('撤销成功。')
          this.loadTable()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.attRecords-avatar-wrapper {
    display: inline-block;
    margin-right: 20px;
    vertical-align: middle;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #4196ff;
    text-align: center;
    font-size: 12px
}

.attRecords-avatar-wrapper.large {
    width: 74px;
    height: 74px
}

.attRecords-avatar-wrapper.large>.attRecords-avatar-font {
    line-height: 74px;
    font-size: 26px
}

.attRecords-avatar-img {
    width: 100%
}
</style>
