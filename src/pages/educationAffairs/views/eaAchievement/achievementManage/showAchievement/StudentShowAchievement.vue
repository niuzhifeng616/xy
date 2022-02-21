<template>
<!-- 学生权限 -->
  <div class="xy-content-module">
    <div class="xy-content-body">
        <XyAntTable
          :columns="columns"
          :dataSource="datatable"
          :nullData="txt"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
          >
          <div slot="key" slot-scope="text, record">
            {{ record.key + 1}}
          </div>
          <div slot="AchievementName" slot-scope="text, record">
            <div style="min-width:360px">
              {{ record.AchievementName}}
            </div>
          </div>
        </XyAntTable>
    </div>
</div>

</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'studentShowAchievement',
    components: {
      XyAntTable
    },
    data () {
      return {
        txt: '您还没有学科（相关模块）成绩的信息，请先联系教师在成绩填报页面录入。',
        modal_loading: false,
        loading: true,
        tableLoading: true,
        APIPath: this.$store.state.apiPath + '/api/Achievement',
        columns: [
          {
            title: '序号',
            width: 80,
            dataIndex: 'key',
            scopedSlots: { customRender: 'key' }
          },
          {
            title: '学科',
            dataIndex: 'AchievementDisciplineName',
            width: 120
          },
          {
            title: '模块',
            dataIndex: 'AchievementName',
            scopedSlots: { customRender: 'AchievementName' }
          },
          {
            title: '考试成绩',
            dataIndex: 'StudentScore',
            width: 160
          },
          {
            title: '学分',
            dataIndex: 'StudentCredit',
            width: 120
          }
        ],
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
        datatable: [] // table数据
      }
    },
    created () {
      this.getTP()
    },
    mounted () {
      this.$Message.config({
        top: 70,
        duration: 2
      })
    },
    methods: {
      handleTableChange () {
        this.getTP()
      },
      async getTP () {
        // 渲染table数据
        let data = {
          current: this.pagination.current,
          size: this.pagination.pageSize
        }
        this.tableLoading = true
        let res = await this.xy.get(this.APIPath + '/GetAllStudnetScore?pageIndex=' + data.current + '&pageSize=' + data.size, {
        })
        this.tableLoading = false
        if (res.success) {
          this.datatable = res.data.data
          this.datatable.map((item, index) => {
            this.$set(item, 'key', index)
          })
          this.pagination.total = res.data.totalRecords
        }
      }
    }
  }
</script>
