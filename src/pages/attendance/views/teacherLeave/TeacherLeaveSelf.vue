// 教师请假-我的请假
<template>
  <div class="xy-content-module">
      <div class="xy-content-title clearfix">
        <div class="fl">
          <Button class="xy-primary" @click="create">申请请假</Button>
        </div>
        <div class="fr pr">
            <i-col class="fl xy-content-title-search">
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
            <i-col class="fl xy-content-title-search">
              <Select v-model="leaveType" style="width: 150px;" @on-change="reLoadTable" placeholder="请假类型">
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
            <i-col class="fl xy-content-title-search">
              <Select v-model="state" style="width: 150px;" @on-change="reLoadTable" placeholder="请假状态">
                <Option
                  :value="item.ApplicationStateID"
                  v-for="(item, index) in stateList"
                  :key="index"
                  >
                  {{item.ApplicationStateName}}
                </Option>
              </Select>
            </i-col>
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
          <div style="min-width:280px" slot="FullNameRender" slot-scope="text, record">
            <span class="table-el-hover" @click="editContent(record)">
              {{record.FullName + '提交的请假申请'}}
            </span>
          </div>
          <div style="min-width:500px" slot="TeacherLeaveTypeNameRender" slot-scope="text, record">
              {{'请假类型：' + record.TeacherLeaveTypeName + '，' + '请假时间：' + record.TimeName}}
          </div>
          <span slot="StateRender" slot-scope="text, record">
            <span v-if="record.ApplicationStateNew===0"><i class="iconfont icon-default">&#xe719;</i>{{record.ApplicationStateNameNew}}</span>
            <span v-if="record.ApplicationStateNew===1"><i class="iconfont icon-info">&#xe719;</i>{{record.ApplicationStateNameNew}}</span>
            <span v-if="record.ApplicationStateNew===2"><i class="iconfont icon-success">&#xe719;</i>{{record.ApplicationStateNameNew}}</span>
            <span v-if="record.ApplicationStateNew===3"><i class="iconfont icon-error">&#xe719;</i>{{record.ApplicationStateNameNew}}</span>
            <span v-if="record.ApplicationStateNew===4"><i class="iconfont icon-end">&#xe719;</i>{{record.ApplicationStateNameNew}}</span>
          </span>
          <span slot="oprateRender" slot-scope="text, record">
            <a :disabled="record.IsDefault"  @click="editContent(record)">详情</a>
          </span>
        </XyAntTable>
      </div>
      <div v-if="showDrawer" ><Details @loadTable="loadTable" ref="drawer" :row="row" :isFrom="isFrom"></Details></div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import Details from '@/pages/attendance/components/teacherLeave/TeacherLeaveDetails.vue'
  export default {
    name: 'TeacherLeaveSelf',
    components: {
      XyAntTable,
      Details
    },
    data () {
      return {
        // 详情
        row: {},
        isFrom: 0,
        showDrawer: false,
        // 搜索
        dataArr: ['', ''],
        stateList: [],
        typeList: [],
        leaveType: 0,
        state: 99,
        // 表格
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: '标题',
            dataIndex: 'FullName',
            scopedSlots: { customRender: 'FullNameRender' },
            width: 240
          }, {
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
            width: 100,
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
        tableData: []
      }
    },
    watch: {
      row (newVal) {
        this.row = newVal
      }
    },
    created () {
      this.getTypeList()
      this.getStateList()
    },
    mounted () {
      this.$nextTick(() => {
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
        this.pagination.current = 1
        this.loadTable()
      },
      //  获取table分页数据
      async loadTable () {
        this.tableLoading = true
        this.showDrawer = false
        let arr = this.dataArr ? this.dataArr : ['', '']
        let params = {
          leaveType: this.leaveType,
          state: this.state,
          startTime: arr[0],
          endTime: arr[1],
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/TeacherLeave/GetMyLeavePageList', params)
        if (res.success) {
          this.tableData = res.data.data
          this.tableData.map((item, index) => {
            this.$set(item, 'key', index)
          })
          this.total = res.data.totalRecords
          this.pagination.total = res.data.totalRecords
        }
        this.tableLoading = false
      },
      // 类型
      async getTypeList () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/TeacherLeaveType/GetAll', null)
        if (res.success) {
          this.typeList = res.data.filter((value) => {
            return value.IsEnable
          })
        }
      },
      // 状态
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
      },
      create () {
        this.$store.commit('common/getThreeMenuName', '创建请假')
        this.$router.push({
          path: 'TeacherLeaveCreate',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>

<style lang="less">
</style>
