// 教师请假-请假审批
<template>
  <div class="xy-content-module">
      <!-- 面包屑 -->
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
              >
            </DatePicker>
          </i-col>
          <i-col span="3">
            <Select v-model="leaveType" @on-change="reLoadTable" placeholder="请假类型">
              <Option :value="0">
                所有类型
              </Option>
              <Option
                :value="item.TeacherLeaveTypeID"
                v-for="(item, index) in typeList"
                :key="index"
                >
                {{item.TeacherLeaveTypeName}}
              </Option>
            </Select>
          </i-col>
          <i-col span="3">
            <Select v-model="state" @on-change="reLoadTable" placeholder="请假状态">
              <Option
                :value="item.ApplicationStateID"
                v-for="(item, index) in stateList"
                :key="index"
                >
                {{item.ApplicationStateName}}
              </Option>
            </Select>
          </i-col>
          <i-col span="3">
            <i-input search v-model.trim="searchText" @on-search="reLoadTable" placeholder="请输入姓名" class="fr xy-content-title-search">
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
                {{ xy.showName(record.FullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <div slot="UserNameRender" slot-scope="text, record">
              {{record.FullName.replace(/\s/g, '&nbsp;')}}
          </div>
          <div style="min-width:500px" slot="TeacherLeaveTypeNameRender" slot-scope="text, record">
              <span class="table-el-hover" @click="editContent(record)">
                {{'请假类型：' + record.TeacherLeaveTypeName + '，' + '请假时间：' + record.TimeName}}
              </span>
          </div>
          <span slot="StateRender" slot-scope="text, record">
            <span v-if="record.ApplicationStateNew===0"><i class="iconfont icon-default">&#xe719;</i>{{record.ApplicationStateNameNew}}</span>
            <span v-if="record.ApplicationStateNew===1"><i class="iconfont icon-info">&#xe719;</i>{{record.ApplicationStateNameNew}}</span>
            <span v-if="record.ApplicationStateNew===2"><i class="iconfont icon-success">&#xe719;</i>{{record.ApplicationStateNameNew}}</span>
            <span v-if="record.ApplicationStateNew===3"><i class="iconfont icon-error">&#xe719;</i>{{record.ApplicationStateNameNew}}</span>
            <span v-if="record.ApplicationStateNew===4"><i class="iconfont icon-end">&#xe719;</i>{{record.ApplicationStateNameNew}}</span>
          </span>
          <span slot="oprateRender" slot-scope="text, record">
            <a @click="editContent(record)">详情</a>
          </span>
        </XyAntTable>
      </div>
      <div v-if="showDrawer" ><Details @loadTable="loadTable" ref="drawer" :row="row" :isFrom="isFrom" :tableType="tableType"></Details></div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import Details from '@/pages/attendance/components/teacherLeave/TeacherLeaveDetails.vue'
  export default {
    name: 'TeacherLeaveAppr',
    components: {
      XyAntTable,
      Details
    },
    data () {
      return {
        // 详情
        mainUrl: this.xyApi + '/base',
        row: {},
        isFrom: 1,
        showDrawer: false,
        // 搜索
        dataArr: ['', ''],
        leaveType: 0,
        state: 99,
        searchText: '',
        // 表格
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            scopedSlots: { customRender: 'IconRender' },
            className: 'table-pic'
          }, {
            title: '申请人',
            dataIndex: 'FullName',
            width: 120,
            scopedSlots: { customRender: 'UserNameRender' }
          },
          {
            title: '审批类型',
            dataIndex: 'ApprovalTypeName',
            width: 120
          },
          {
            title: '摘要',
            dataIndex: 'TeacherLeaveTypeName',
            scopedSlots: { customRender: 'TeacherLeaveTypeNameRender' }
          }, {
            title: '申请时间',
            dataIndex: 'CreateByDateName',
            width: 150
          }, {
            title: '审批状态',
            dataIndex: 'ApplicationStateNameNew',
            width: 120,
            scopedSlots: { customRender: 'StateRender' }
          },
          {
            title: '操作',
            dataIndex: 'oprate',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
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
        tableData: [],
        tableType: 'approval',
        stateList: [],
        typeList: []
      }
    },
    watch: {
      row (newVal) {
        this.row = newVal
      }
    },
    created: function () {
      this.getTypeList()
      this.getStateList()
    },
    mounted: function () {
      this.$nextTick(function () {
        this.loadTable()
      })
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      editContent (record) {
        this.showDrawer = true
        this.row = record
      },
      changeDate (value) {
        this.dataArr = value
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      changeTableType (value) {
        this.loadTable()
      },
      //  获取table分页数据
      async loadTable () {
        this.tableLoading = true
        this.showDrawer = false
        if (this.tableType !== 'CC') {
          let arr = this.dataArr ? this.dataArr : ['', '']
          let params = {
            searchText: this.searchText,
            leaveType: this.leaveType,
            state: this.state,
            startTime: arr[0],
            endTime: arr[1],
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
          let res = await this.xy.get(
            this.$store.state.apiPath + '/api/TeacherLeave/GetApprovalPageList', params)
          if (res.success) {
            this.tableData = res.data.data
            this.total = res.data.totalRecords
            this.pagination.total = res.data.totalRecords
          }
          this.tableLoading = false
        } else {
          this.showDrawer = false
          let arr = this.dataArr ? this.dataArr : ['', '']
          let params = {
            searchText: this.searchText,
            leaveType: this.leaveType,
            state: this.state,
            startTime: arr[0],
            endTime: arr[1],
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
          let res = await this.xy.get(
            this.$store.state.apiPath + '/api/TeacherLeave/GetCCPageList', params)
          if (res.success) {
            this.tableData = res.data.data
            this.total = res.data.totalRecords
            this.pagination.total = res.data.totalRecords
          }
          this.tableLoading = false
        }
      },
      async getTypeList () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/TeacherLeaveType/GetAll', null)
        if (res.success) {
          this.typeList = res.data.filter(function (value) {
            return value.IsEnable
          })
        }
      },
      async getStateList () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/TeacherLeave/GetLeaveApplicationTypeList', null)
        if (res.success) {
          this.stateList = res.data
        }
      },
      reLoadTable () {
        this.pagination.current = 1
        this.pageIndex = 1
        this.loadTable()
      }
    }
  }
</script>

<style lang="less">
</style>
