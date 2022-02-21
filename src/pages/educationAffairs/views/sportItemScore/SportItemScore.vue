// 音体美成绩管理-体测项目评分规则管理
<template>
  <div class='xy-content-module'>
    <div class='xy-content-body'>
      <XyAntTable
        :columns="columns"
        :dataSource="tableData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
      >
        <!-- 项目名称 -->
        <div slot="SportItemName" slot-scope="text,record" style="min-width:340px">
          <span class="table-el-hover" @click="setRules(record)">
            {{record.SportItemName}}
          </span>
        </div>
        <!--权重-->
        <div slot="Weight" slot-scope="text,record" style="min-width:100px">
          <span>
            {{record.Weight}}
          </span>
        </div>
        <!--单位-->
        <div slot="Unit" slot-scope="text,record" style="min-width:80px">
          <span>
            {{record.Unit}}
          </span>
        </div>
        <!--操作-->
        <span slot="oprateRender" slot-scope="text, record">
          <a @click="setRules(record)">设置评分规则</a>
        </span>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'SportItemScore',
    components: {
      // LoadTable
      XyAntTable
    },
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
        nullData: '您还没有体侧项目的信息，请在音体美考试管理模块创建考试。',
        columns: [
          {
            title: '项目名称',
            dataIndex: 'SportItemName',
            scopedSlots: { customRender: 'SportItemName' }
          },
          {
            title: '权重(%)',
            dataIndex: 'Weight',
            scopedSlots: { customRender: 'Weight' }
          },
          {
            title: '单位',
            key: 'Unit',
            scopedSlots: { customRender: 'Unit' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 140,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        //   表格
        tableData: [{}, {}],
        total: 100,
        pageSize: 15,
        pageIndex: 1,
        Start: '',
        end: ''
      }
    },
    created () {
      this.loadTable()
    },
    mounted () {
    },
    methods: {
      changeSelect () {

      },
      // changePage (index) {
      //   this.pageIndex = index
      //   this.loadTable()
      // },
      // changePageSize (size) {
      //   this.pageSize = size
      //   this.loadTable()
      // },
      handleTableChange () {
        this.loadTable()
      },
      // 获取table分页数据
      async loadTable () {
        this.tableLoading = true
        let params = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/SportItemGradingRule/GetSportItemList',
          params
        )
        if (res.success) {
          this.tableData = res.data.data
          // this.total = res.data.totalRecords
          this.pagination.total = res.data.totalRecords
        }
        this.tableLoading = false
      },
      setRules (row) {
        this.$store.commit('common/getParam', row)
        this.$store.commit('common/getThreeMenuName', '设置评分规则')
        this.$router.push({
          path: '/xyhome/SetRules',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>

<style lang='less' scoped>
.ivu-modal-confirm-head-title {
    margin: 0px;
    display: block;
}
.ivu-modal-confirm-body {
    padding-left: 0px;
    margin: 20px 20px 30px;
}
</style>
