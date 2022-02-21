<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <Row :gutter="12">
        <i-col span="3">
          <radio-group v-model="tableType" type="button" @on-change="changeTableType">
            <Radio label="approval">审批</Radio>
            <Radio label="CC">抄送</Radio>
          </radio-group>
        </i-col>
        <i-col span="4" offset="8">
          <DatePicker
            :value="dataArr"
            @on-change="changeDate"
            format="yyyy/MM/dd"
            type="daterange"
            placeholder="请选择申请时间"
            style="width: 100%"
          ></DatePicker>
        </i-col>
        <i-col span="3">
          <Select v-model="leaveTypeID" @on-change="reLoadTable" placeholder="请假类型">
            <Option :value="0">所有类型</Option>
            <Option
              :value="item.LeaveTypeID"
              v-for="(item, index) in typeValue"
              :key="index"
              >
              {{item.LeaveTypeName}}
            </Option>
          </Select>
        </i-col>
        <i-col span="3">
          <Select v-model="approvalStateID" @on-change="reLoadTable">
            <Option
              :value="item.approvalID"
              v-for="(item, index) in approvalValue"
              :key="index"
              >
              {{item.approvalName}}
            </Option>
          </Select>
        </i-col>
        <i-col span="3">
          <i-input
            search
            v-model.trim="searchNames"
            @on-search="reLoadTable"
            placeholder="请输入姓名"
            class="fr xy-content-title-search"
            >
            <icon type="ios-search cursor-p" slot="suffix" />
          </i-input>
        </i-col>
      </Row>
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
            <span class="table-el-hover" @click="edit(record)">
              {{record.ApplicantName}}
            </span>
          </div>
          <div slot="ApplicationTypeNameRender" style="min-width:90px" slot-scope="text, record">
            {{record.ApplicationTypeName}}
          </div>
          <div slot="CreatedDateRender" slot-scope="text, record">
              {{xy.moment(new Date(record.CreateByDate)).format('YYYY-MM-DD HH:mm')}}
          </div>
          <div slot="txtRender" style="min-width:350px" slot-scope="text, record">
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
            <a @click="edit(record)">详情</a>
          </span>
        </XyAntTable>
    </div>
    <Drawer
      title="详情"
      v-model="mInfo"
      width="560"
      class="detailModel"
      @on-close="closeDrawer"
      :transfer="false"
      :mask-closable="false"
      >
      <div class="drawer">
        <ApprovalEdit v-if="mInfo" :infos="infos" :type="type" :code="code"></ApprovalEdit>
      </div>
    </Drawer>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import ApprovalEdit from '@/pages/attendance/views/studentLeave/studentLeaveApproval/ApprovalEdit.vue'
  export default {
    name: 'Approval',
    components: {
      XyAntTable,
      ApprovalEdit
    },
    data () {
      return {
        isLoading: false,
        mainUrl: this.xyApi + '/base',
        row: {},
        isFrom: 1,
        tableType: 'approval',
        mInfo: false,
        drawerTitle: '消息详情',
        dataArr: ['', ''],
        // apiPath: xy.string.format('{0}/api/StudentLeave/SelfApprovalGetPage', xy.subMenuServiceUrl),
        searchNames: '',
        modal_loading: false,
        loading: true,
        modalCreate: false, // 创建弹出框默认不展示
        searchName: '',
        editId: '', // 要编辑的ID
        modalEdit: false,
        ids: '',
        isCan: false,
        typeValue: [],
        startDate: '',
        endDate: '',
        dateTime: '',
        approvalValue: [
          {
            approvalID: -1,
            approvalName: '所有状态'
          },
          {
            approvalID: 0,
            approvalName: '待审批'
          },
          {
            approvalID: 1,
            approvalName: '审批中'
          },
          {
            approvalID: 2,
            approvalName: '已通过'
          },
          {
            approvalID: 3,
            approvalName: '已拒绝'
          },
          {
            approvalID: 4,
            approvalName: '已撤销'
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
        switchData: 0,
        horizontal: 'xy-primary',
        vertical: 'default',
        isApproval: true,
        pageType: 1,
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
        tableData: []
      }
    },
    created () {
      this.getTypes()
      this.isApprovalChange()
    },
    mounted () {
      this.$nextTick(function () {
        this.loadTable()
      })
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      // 开始和结束时间
      changeDate (value) {
        this.dataArr = value
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 查询
      query () {
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
      // 获取table/分页数据
      loadTable () {
        this.tableLoading = true
        let that = this
        this.columns = []
        if (this.tableType !== 'CC') {
          that.pageType = 1
        } else {
          that.pageType = 2
        }
        let arr = this.dataArr ? this.dataArr : ['', '']
        this.isLoading = true
        this.xy
          .get(
            `${this.$store.state.apiPath}/api/StudentLeave/SelfApprovalGetPage`,
            {
              pageIndex: that.pageIndex,
              pageSize: that.pageSize,
              leaveTypeID: that.leaveTypeID,
              startDate: arr[0],
              endDate: arr[1],
              studentName: that.searchNames,
              applicationState: that.approvalStateID,
              pageType: that.pageType
            }
          )
          .then(res => {
            this.tableLoading = false
            if (res.success) {
              if (!res.data.data) {
                that.tableData = []
              } else {
                that.isLoading = false
                that.tableData = res.data.data
                that.total = res.data.totalRecords
                that.pagination.total = res.data.totalRecords
                that.columns = [
                  {
                    title: ' ',
                    dataIndex: 'Icon',
                    width: 40,
                    scopedSlots: { customRender: 'IconRender' },
                    className: 'table-pic',
                    fixed: 'left'
                  }, {
                    title: '申请人',
                    dataIndex: 'ApplicantName',
                    fixed: 'left',
                    scopedSlots: { customRender: 'UserNameRender' },
                    width: 160
                  },
                  {
                    title: '申请类型',
                    dataIndex: 'ApplicationTypeName',
                    width: 110
                  },
                  {
                    title: '请假学生',
                    dataIndex: 'StudentName',
                    width: 140
                  },
                  {
                    title: '摘要',
                    dataIndex: 'txt',
                    scopedSlots: { customRender: 'txtRender' }
                  },
                  {
                    title: '请假类型',
                    dataIndex: 'LeaveTypeName',
                    width: 120
                  },
                  {
                    title: '申请时间',
                    dataIndex: 'CreatedDate',
                    scopedSlots: { customRender: 'CreatedDateRender' },
                    width: 140
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
                    width: 80,
                    scopedSlots: { customRender: 'oprateRender' }
                  }
                ]
              }
            }
          })
      },
      async getTypes () {
        let that = this
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/StudentLeaveType/GetTypeAll',
          {
            pageIndex: that.pageIndex,
            pageSize: that.pageSize
          }
        )
        if (res.success) {
          this.typeValue = res.data
        }
      },
      // 关闭创建/编辑弹框触发
      cancel (name) {
        this.editId = ''
      },
      closeDrawer () {
        this.mInfo = false
        this.loadTable()
      },
      close () {
        this.mInfo = false
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
      // 进来后判断身份 审批者和抄送者显示，isApproval，管理员不显示
      isApprovalChange () {},
      changeTypeH () {
        // 审批
        this.horizontal = 'xy-primary'
        this.vertical = 'default'
        // this.dateTime = [];
        this.startDate = this.dateTime[0]
          ? this.xy.moment(new Date(this.dateTime[0])).format('YYYY-MM-DD')
          : ''
        this.endDate = this.dateTime[1]
          ? this.xy.moment(new Date(this.dateTime[1])).format('YYYY-MM-DD')
          : ''
        this.pageType = 1
        this.loadTable()
      },
      changeTypeV () {
        // 抄送
        this.vertical = 'xy-primary'
        this.horizontal = 'default'
        // this.dateTime = [];
        this.startDate = this.dateTime[0]
          ? this.xy.moment(new Date(this.dateTime[0])).format('YYYY-MM-DD')
          : ''
        this.endDate = this.dateTime[1]
          ? this.xy.moment(new Date(this.dateTime[1])).format('YYYY-MM-DD')
          : ''
        this.pageType = 2
        this.loadTable()
      },
      // 单击表格中审批按钮触发
      edit (row) {
        this.mInfo = true
        this.infos = row
        this.type = 1
        this.code = '1'
      },
      changeTableType (value) {
        this.pageIndex = 1
        this.pagination.current = 1
        this.tableType = value
        this.loadTable()
      },
      reLoadTable () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      look (row) {
        this.$router.push({
          name: 'ApprovalLook',
          params: {
            StudentName: row.StudentName,
            StartTime: this.xy
              .moment(new Date(row.StartTime))
              .format('YYYY-MM-DD'),
            EndTime: this.xy.moment(new Date(row.EndTime)).format('YYYY-MM-DD'),
            CreatedDate: this.xy
              .moment(new Date(row.CreatedDate))
              .format('YYYY-MM-DD HH:mm'),
            LeaveTypeName: row.LeaveTypeName,
            LeavePermitSrc: row.LeavePermitSrc,
            SubstituteName: row.SubstituteName,
            editId: row.LeaveApplicationID,
            ApplicationDescription: row.ApplicationDescription,
            ApplicationState: row.ApplicationState,
            DeniedDescription: row.DeniedDescription,
            StartDay: this.xy.getChinesesWeekForNumSmall(row.StartDay),
            EndDay: this.xy.getChinesesWeekForNumSmall(row.EndDay),
            StartAMorPMOrderFullName: row.StartAMorPMOrderFullName,
            EndAMorPMOrderFullName: row.EndAMorPMOrderFullName,
            editModel: row
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
