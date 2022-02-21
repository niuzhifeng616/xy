<template>
  <div class="container">
    <div class="header">
      <i-input
        search
        v-model.trim="searchText"
        @on-search="searchChange"
        placeholder="请输入学生姓名或小组名"
        class="xy-content-title-search"
        style="width: auto;"
        >
        <icon type="ios-search cursor-p" slot="suffix" />
      </i-input>
    </div>
    <div class="boy">
        <XyAntTable
          :columns="columns"
          :dataSource="tbData"
          :nullData="'该搜索条件下没有结果。'"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
          >
          <div style="min-width:100px" slot="RecordObjectName" slot-scope="text, record">
            <span>
              {{record.RecordObjectName}}
            </span>
          </div>
          <div style="min-width:200px" slot="IndexManagementName" slot-scope="text, record">
            <span>
              {{record.IndexManagementName}}
            </span>
          </div>
          <span slot="LastModifyUserName" slot-scope="text, record">
            <span>
              {{record.LastModifyUserName}}
            </span>
          </span>
          <span slot="ScoringValue" slot-scope="text, record">
            <span>
              {{record.ScoringValue}}
              <img v-if="record.ScoringMethod===1" src="./Image/star.svg" alt="">
              <!-- <img src="./Image/star.svg" alt=""> -->
            </span>
          </span>
          <span slot="LastModifyByDate" slot-scope="text, record">
            <span>
              {{record.LastModifyByDate}}
            </span>
          </span>
        </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    name: 'evaRecording',
    data () {
      return {
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
        tableUrl: `${this.$store.state.apiPath}/api/EvaluateStudent/GetRecordLog`,
        total: 0, // 总条数
        // 表头
        columns: [
          {
            title: '评价对象',
            dataIndex: 'RecordObjectName',
            scopedSlots: { customRender: 'RecordObjectName' }
          },
          {
            title: '指标项',
            dataIndex: 'IndexManagementName',
            scopedSlots: { customRender: 'IndexManagementName' }
          },
          {
            width: 100,
            title: '得分',
            dataIndex: 'ScoringValue',
            scopedSlots: { customRender: 'ScoringValue' }
          },
          {
            width: 200,
            title: '评价人员',
            dataIndex: 'LastModifyUserName',
            scopedSlots: { customRender: 'LastModifyUserName' }
          },
          {
            title: '评价时间',
            dataIndex: 'LastModifyByDate',
            width: 150,
            scopedSlots: { customRender: 'LastModifyByDate' }
          }
        ],
        searchText: '',
        tbData: {},
        pageIndex: 1,
        pageSize: 15,
        params: JSON.parse(this.$route.query.params)
      }
    },
    created () {
      this.getTable()
    },
    methods: {
      handleTableChange () {
        this.getTable()
      },
      // 获取列表
      getTable () {
        // this.xy.loading()
        this.tableLoading = true
        this.xy.get(`${this.$store.state.apiPath}/api/EvaluateStudent/GetRecordLog`, {
          coursePlanAID: this.params.CoursePlanAID,
          coursePlanAIDType: this.params.CoursePlanAIDType,
          classTableGenerateBaseID: this.params.ClassTableGenerateBaseID,
          pageIndex: this.pagination.current,
          name: this.searchText,
          pageSize: this.pagination.pageSize
        }).then(res => {
          this.tableLoading = false
          // this.xy.unloading()
          if (res.success) {
            // if (res.data.data.length > 0) {
            //   if (res.data.data[0].ScoringMethod === 1) { // 1 :星星，0：打分
            //     this.columns.splice(2, 1, {
            //       width: 100,
            //       title: '得星数',
            //       dataIndex: 'ScoringValue',
            //       scopedSlots: { customRender: 'ScoringValue' }

            //     })
            //   } else {
            //     this.columns.splice(2, 1, {
            //       title: '得分',
            //       width: 100,
            //       dataIndex: 'ScoringValue',
            //       scopedSlots: { customRender: 'ScoringValue' }
            //     })
            //   }
            // }
            this.pagination.total = res.data.totalRecords
            // this.total = res.data.totalRecords
            this.tbData = res.data.data
          }
        })
      },
      FromSubmit () {
        this.pageIndex = 1
        this.getTable()
      },
      searchChange () {
        this.pagination.current = 1
        this.getTable()
      },
      changePage (current) {
        this.pageIndex = current
        this.getTable()
      },
      // 单击切换每页展示条数触发
      changePageSize (size) {
        this.pageIndex = 1
        this.pageSize = size
        this.getTable()
      }
    }
  }
</script>
<style lang="less" scoped>
.container {
  margin: 20px;
  padding: 20px;
  background: #fff;
  height: 100%;
  .header {
    width: 100%;
    padding-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
