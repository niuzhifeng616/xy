<template>
  <div class='xy-content-module'>
    <div class='xy-content-title xy-flex xy-between xy-center'>
      <div class="xy-flex xy-center">
        <div class="xy-flex xy-center">
          <label>审批状态：</label>
          <Select v-model="ApprovalState"
                @on-change="approvalChange"
                class="mr-15"
                style="width:200px">
          <Option :value="0" key="01">全部</Option>
          <Option v-for="(item,index) in approvalData" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
        </div>
      </div>
    </div>
    <div class='xy-content-body'>
      <XyAntTable
        :columns="columns"
        :scrollx="'max-content'"
        :data-source="datatable"
        :null-data="nullData"
        :table-loading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <div slot="StudentIcon" slot-scope="text, record">
          <div v-if="!record.Icon" :class="`head-con ${record.SexName === '女' ? 'woman' : 'man'}`">
            <span class="head-font">
              {{ xy.showName(record.FullName)}}
            </span>
          </div>
          <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
        </div>
        <div slot="FullName" style="min-width:200px" slot-scope="text, record">
          <span class="table-el-hover" @click="details(record)">
            {{ record.FullName}}
          </span>
        </div>
        <div slot="DateRender"  slot-scope="text, record">
          <span class="table-el-hover">
            {{xy.moment(record.AwardsDate).format('YYYY-MM-DD') }}
          </span>
        </div>
         <div slot="LastDateRender"  slot-scope="text, record">
          <span class="table-el-hover">
            {{record.LastModifyByDate}}
          </span>
        </div>
        <div slot="ApprovalRender" style="width:120px" slot-scope="text, record">
          <span v-if="record.ApprovalState === 1">
            <i class="iconfont icon-success">&#xe719;</i>
            已通过
          </span>
          <span v-if="record.ApprovalState === 2">
            <i class="iconfont icon-error">&#xe719;</i>
            已拒绝
          </span>
          <span v-if="record.ApprovalState === 3">
            <i class="iconfont icon-info">&#xe719;</i>
            待审批
          </span>
        </div>
        <span
          slot="oprate"
          slot-scope="text, record"
        >
          <a @click="details(record)">详情</a>
          <a-divider type="vertical" />
          <a :disabled="record.ApprovalState !==3" @click="edit(record)">审批</a>
        </span>
      </XyAntTable>
    </div>
    <!-- 右侧详情 -->
    <DrawerDetail
      :show="showDetail"
      :row="row"
      :from="from"
      @loadTable="loadTable"
    />
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import DrawerDetail from './honorDetail'
  export default {
    name: 'honorApproval',
    components: {
      XyAntTable,
      DrawerDetail
    },
    data () {
      return {
        approvalData: [
          {
            label: '已通过',
            value: 1
          },
          {
            label: '已拒绝',
            value: 2
          },
          {
            label: '待审批',
            value: 3
          }
        ],
        ApprovalState: 0,
        searchTxt: '',
        // table
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: ' ',
            dataIndex: 'StudentIcon',
            width: 60,
            scopedSlots: { customRender: 'StudentIcon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'StudentName',
            scopedSlots: { customRender: 'StudentName' }
          },
          {
            title: '学号',
            dataIndex: 'SchoolCardNumber',
            width: 120
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeName',
            width: 120
          },
          {
            title: '班级',
            dataIndex: 'StudentOrganizationName',
            width: 80
          },
          {
            title: '项目名称',
            dataIndex: 'HonorManagementName',
            width: 120
          },
          {
            title: '荣誉类型',
            dataIndex: 'HonorTypeName',
            width: 120
          },
          {
            title: '级别',
            dataIndex: 'LevelName',
            width: 120
          },
          {
            title: '获奖等级',
            dataIndex: 'AwardsLevelName',
            width: 120
          },
          {
            title: '获奖时间',
            dataIndex: 'AwardsDate',
            width: 120,
            scopedSlots: { customRender: 'DateRender' }
          },
          {
            title: '创建时间',
            dataIndex: 'LastModifyByDate',
            width: 220,
            scopedSlots: { customRender: 'LastDateRender' }
          },
          {
            title: '审批状态',
            dataIndex: 'ApprovalStateName',
            width: 100,
            scopedSlots: { customRender: 'ApprovalRender' }
          },
          {
            title: '操作',
            width: 120,
            dataIndex: 'oprate',
            scopedSlots: { customRender: 'oprate' }
          }
        ],
        datatable: [],
        tableLoading: false,
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: current => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        // props
        row: {},
        showDetail: false,
        from: 2
      }
    },
    created () {
      this.getData()
    },
    mounted () {},
    methods: {
      // 获取数据
      async getData () {
        this.tableLoading = true
        let params = {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          type: 0,
          approvallist: true, // 教师审批
          approvalstate: this.ApprovalState // 审批状态
        }
        await this.xy.get(`${this.$store.state.apiPath}/api/HonorDeclare/GetAllHonorList`, params).then(res => {
          if (res.success) {
            this.pagination.total = res.data.totalRecords
            this.datatable = res.data.data
          }
          this.tableLoading = false
        })
      },
      handleTableChange () {
        this.getData()
      },
      // 操作
      // 详情
      async details (row) {
        this.xy.loading()
        await this.xy.get(`${this.$store.state.apiPath}/api/HonorDeclare/GetTeacherHonorDeclareDetail?honormanagementID=${row.HonorManagementID}`).then(res => {
          this.showDetail = true
          this.row = res.data
        })
        this.xy.unloading()
      },
      loadTable () {
        this.showDetail = false
      },
      // 撤回
      cancel () {

      },
      // 编辑
      edit (row) {
        this.$store.commit('common/getThreeMenuName', row.HonorManagementName)
        this.$store.commit('common/getParam', { pro: 'honorApproval' })
        this.$store.commit('evaluate/changeHonorObj', {
          HonorManagementID: row.HonorManagementID,
          HonorManagementName: '',
          isApproal: true
        })
        this.$router.push({
          path: '/xyHome/createHonor',
          query: this.$store.state.common.menuInfo
        })
      },
      // 删除
      del () {

      },
      // 审批状态
      approvalChange () {
        this.getData()
      },
      // 改变当前页显示的数量
      changePageSize (size) {
        if (this.pageSize !== size) {
          this.pageSize = size
          this.getData()
        }
      },
      // 改变当前页
      changePage (index) {
        if (this.pageIndex !== index) {
          this.pageIndex = index
          this.getData()
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.xy-content-module{
  background: #fff;
}
.xy-content-title {
  padding: 20px;
}
.xy-content-body {
  padding: 0 20px;
}
.createBtn {
  margin-bottom: 15px;
}
</style>
