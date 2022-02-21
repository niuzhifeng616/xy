<template>
  <div class="xy-content-module">
    <!-- 学生请假-请假列表   // 缺少面包屑 -->
    <div class="xy-content-title clearfix">
        <div class="fl">
            <Button class="xy-primary" @click="createLeave">创建请假</Button>
        </div>
        <div class="fr pr">
            <div class="fl xy-content-title-search">
                <span>申请时间：</span>
                <date-picker type="daterange" v-model="defaultDate" format="yyyy-MM-dd" :clearable="false" :editable="false" @on-change="datesChange" placeholder="请假时间" style="width: 250px;"></date-picker>
            </div>
            <div  class="fl xy-content-title-search">
                <span>请假类型：</span>
                <i-select
                  v-model="leaveTypeID"
                  @on-change="typeValueSearch"
                  style="width:150px;"
                  >
                    <i-option :value="0" :key="0">所有类型</i-option>
                    <i-option v-cloak v-for="types in typeValue" :value="types.LeaveTypeID" :key="types.LeaveTypeID">{{ types.LeaveTypeName }}</i-option>
                </i-select>
            </div>
            <div class="fl xy-content-title-search">
                <span>审批状态：</span>
                <i-select
                  v-model="leaveStatusID"
                  @on-change="typeStatusSearch"
                  style="width:150px;"
                  >
                    <i-option v-cloak v-for="types in typeStatus" :value="types.value" :key="types.value">{{ types.status }}</i-option>
                </i-select>
            </div>
            <Button @click="search" class="xy-primary fl xy-content-title-search">查询</Button>

        </div>
    </div>
    <div class="xy-content-body">
        <XyAntTable
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
        >
          <div slot="IconRender" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.ApplicantName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <div slot="UserNameRender" slot-scope="text, record">
            <span class="table-el-hover" @click="look(record)">
              {{record.ApplicantName}}
            </span>
          </div>
          <div style="min-width:220px" slot="CreateByDateNameRender" slot-scope="text, record">
            <span v-if="record.IsCycleLeave">
              {{xy.moment(new Date(record.StartTime)).format('YYYY-MM-DD') + '~' + xy.moment(new Date(record.EndTime)).format('YYYY-MM-DD') + (record.IsCycleLeave ? '周期性请假' : '') }}
            </span>
            <span v-else>
              {{xy.moment(new Date(record.StartTime)).format('YYYY-MM-DD HH:mm') + '~' + xy.moment(new Date(record.EndTime)).format('YYYY-MM-DD HH:mm') + (record.IsCycleLeave ? '周期性请假' : '') }}
            </span>
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
            <a :disabled="!record.IsRevoke" @click="withdraw(record)">撤销</a>
          </span>
        </XyAntTable>
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
            <ApplyLook
              v-if="isLook"
              :info="info"
              :type="type"
              :code="code"
              >
          </ApplyLook>
        </div>
    </Drawer>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import ApplyLook from '@/pages/attendance/components/studentLeave/ApplyLook.vue'
  // const poto = require('@/assets/common/yrykb.png')
  export default {
    name: 'StudentApplyList',
    components: {
      XyAntTable,
      ApplyLook
    },
    data () {
      return {
        isInitial: true, // 页面加载loading
        leaveModelList: [],
        worflowList: [],
        isLook: false,
        modal_loading: false,
        loading: true,
        editId: '', // 要编辑的ID
        modalEdit: false,
        appState: false,
        defaultDate: [this.xy.moment().startOf('week').format('YYYY-MM-DD'), this.xy.moment().endOf('week').format('YYYY-MM-DD')], // 获取当前周
        DeniedDescription: '',
        typeValue: [], // 所有请假类型
        typeStatus: [
          {
            value: -1,
            status: '全部'
          },
          {
            value: 0,
            status: '待审批'
          },
          {
            value: 1,
            status: '审批中'
          },
          {
            value: 2,
            status: '已通过'
          },
          {
            value: 3,
            status: '已拒绝'
          },
          {
            value: 4,
            status: '已撤销'
          }
        ], // 所有审批状态
        appstype: '',
        appsstart: '',
        appsend: '',
        appstext: '',
        leaveTypeID: 0,
        leaveStatusID: -1, // 请假状态id
        // startTime: this.xy.moment().subtract(parseInt(this.xy.moment().format('d')) - 1, 'days').format('YYYY-MM-DD'),
        // endTime: this.xy.moment().add(parseInt(this.xy.moment().format('d')) + 5, 'days').format('YYYY-MM-DD'),
        startTime: '',
        endTime: '',
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 18,
            scopedSlots: { customRender: 'IconRender' },
            className: 'table-pic'
          }, {
            title: '申请人',
            dataIndex: 'ApplicantName',
            width: 120,
            scopedSlots: { customRender: 'UserNameRender' }
          },
          {
            title: '请假类型',
            dataIndex: 'LeaveTypeName',
            width: 90
          },
          {
            title: '申请类型',
            dataIndex: 'ApplicationTypeName',
            width: 100
          },
          {
            title: '申请时间',
            dataIndex: 'CreateByDate',
            width: 150
          },
          {
            title: '请假时间',
            dataIndex: 'StartTime',
            scopedSlots: { customRender: 'CreateByDateNameRender' }
          }, {
            title: '状态',
            dataIndex: 'ApplicationStateNameNew',
            width: 120,
            scopedSlots: { customRender: 'StateRender' }
          },
          {
            title: '操作',
            dataIndex: 'oprate',
            width: 120,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
            // this.pageIndex = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
            // this.pageIndex = 1
            // this.pageSize = pageSize
          }
        },
        pageIndex: 1,
        pageSize: 15,
        tableData: [],
        info: '',
        type: 0,
        code: '',
        apiPath: ''
      }
    },
    created () {
      let weekOfday = this.xy.moment().format('E')
      this.startTime = this.xy.moment().subtract(weekOfday - 1, 'days').format('YYYY/MM/DD')
      this.endTime = this.xy.moment().add(7 - weekOfday, 'days').format('YYYY/MM/DD')
      this.apiPath = this.$store.state.apiPath
      this.getTypes()
    },
    mounted () {
      this.$nextTick(function () {
        this.getTP()
      })
    },
    methods: {
      handleTableChange () {
        this.getTP()
      },
      // 请假时间change
      datesChange (val) {
        this.startTime = val[0]
        this.endTime = val[1]
        this.PageIndex = 1
        this.pagination.current = 1
        this.getTP()
      },
      // 联合查询
      search () {
        this.PageIndex = 1
        this.pagination.current = 1
        this.getTP()
      },
      // 请假类型筛选
      typeValueSearch () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.leaveTypeID = this.leaveTypeID
        this.getTP()
      },
      // 请假状态筛选
      typeStatusSearch () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.applicationState = this.leaveStatusID
        this.getTP()
      },
      //  获取table分页数据
      async getTP () {
        this.tableLoading = true
        let params = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          leaveTypeID: this.leaveTypeID,
          applicationState: this.leaveStatusID,
          startDate: this.startTime,
          endDate: this.endTime
        }
        let res = await this.xy.get(
          this.apiPath + '/api/StudentLeave/SelfApplyGetPage', params
        )
        this.isInitial = false
        if (res.success) {
          if (res.data.data != null) {
            this.tableData = res.data.data
            this.pagination.total = res.data.totalRecords
          }
        } else {
          this.xy.msgError(res.msg)
        }
        this.tableLoading = false
      },
      async getTypes () {
        let res = await this.xy.get(
          this.apiPath + `/api/StudentLeaveType/GetTypeAll`, {
            PageIndex: 1,
            PageSize: 15
          }
        )
        if (res.success) {
          this.typeValue = res.data
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 创建
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      // 创建请假-跳转页面
      createLeave () {
        this.$store.commit('common/getThreeMenuName', '创建请假申请')
        this.$router.push({
          path: '/xyHome/StudentApply',
          query: this.$store.state.common.menuInfo
        })
      },
      cancelView () {
        this.modalEdit = false
      },
      // 关闭侧栏
      closeDrawer () { },
      // 单击表格中查看按钮触发
      look (row) {
        this.isLook = true
        this.info = row
        this.type = 1
        this.code = '1'
      },
      // 单击撤销单个内容触发
      async withdraw (row) {
        var _this = this
        this.$Modal.confirm({
          title: '撤销',
          content: '<p>您确认要撤销当前申请吗？</p>',
          onOk: function () {
            _this.modal_loading = true
            _this.xy.post(
              _this.apiPath + `/api/StudentLeave/EditState`, {
                ApproveStatus: 4,
                LeaveApplicationID: row.LeaveApplicationID,
                ApplicationDescription: ''
              }).then(res => {
              if (res.success) {
                _this.PageIndex = 1
                _this.xy.msgSuc('撤销成功。')
                _this.getTP()
              } else {
                _this.xy.msgError(res.msg)
              }
              _this.modal_loading = false
            })
          },
          onCancel: function () { }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
