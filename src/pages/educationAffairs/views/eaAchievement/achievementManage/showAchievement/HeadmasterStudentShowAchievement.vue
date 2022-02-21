<template>
<!-- 班主任查看 -->
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <span v-cloak>{{studentName}}的模块成绩</span>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="840"
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
    name: 'headmasterStudentShowAchievement',
    components: {
      XyAntTable
    },
    data () {
      return {
        studentOrganizationID: 0,
        studentID: 0,
        studentName: '',
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
        datatable: [],
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
        tableLoading: true
      }
    },
    created () {
      // 渲染table数据
      let row = this.$store.state.common.menuInfo
      this.studentOrganizationID = row.StudentOrganizationID
      this.studentID = row.ID
      this.studentName = row.Name
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
      async loadTable () {
        this.tableLoading = true
        let res = await this.xy.get(this.$store.state.apiPath + '/api/Achievement/GetHeadmasterScore', {
          studentOrganizationID: this.studentOrganizationID,
          studentID: this.studentID,
          pageSize: this.pagination.pageSize,
          pageIndex: this.pagination.current
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
