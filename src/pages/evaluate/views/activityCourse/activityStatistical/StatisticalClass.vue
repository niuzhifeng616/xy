<template>
  <div class="xy-content-module">
     <p class="title">{{activityStaObj.class}}</p>
    <div class="xy-content-body">
      <!-- <xy-table :noDataText="'该搜索条件下没有结果。'" :tbColumns="columns"
                :tbData="datatable"
                :isShowPage='false'></xy-table> -->
        <XyAntTable
          :columns="columns"
          :dataSource="datatable"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :isPage="false"
          :scrollx="'max-content'"
          >
            <div slot="StudentIcon" slot-scope="text, record">
              <img style="width:30px;height:30px;border-radius:50%"  :src=" record.StudentIcon == null || record.StudentIcon === '' ? image :  record.StudentIcon + '?' + Math.random() * 15">
            </div>
            <div slot="StudentFullName" style="min-width:100px"  slot-scope="text, record">
              <span  class="table-el-hover" @click="goStudent(record)">
                  {{record.StudentFullName}}
              </span>
            </div>
            <div slot="Score" style="min-width:100px"  slot-scope="text, record">
              <span>
                  {{record.Score ? record.Score : '--'}}
              </span>
            </div>
            <span slot="operation" slot-scope="text, record">
              <a @click="goStudent(record)" >详情</a>
            </span>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  // import xyTable from '@/components/table/XyTable'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    name: 'entryTable',
    data () {
      return {
        datatable: [], // table数据
        params: {
          ActivityCourseProjectID: 0,
          StudentGradeForStudentYearID: 0,
          StudentOrganizationID: 0
        },
        image: require('@/assets/common/yrykb.png'),
        nullData: '该搜索条件下没有结果。',
        tableLoading: true,
        columns: [
          {
            title: ' ',
            dataIndex: 'StudentIcon',
            width: 40,
            scopedSlots: { customRender: 'StudentIcon' }
          },
          {
            title: '姓名',
            dataIndex: 'StudentFullName',
            // minWidth: 100,
            scopedSlots: { customRender: 'StudentFullName' }
          },
          {
            title: '用户名',
            // minWidth: 100,
            dataIndex: 'StudentName',
            scopedSlots: { customRender: 'StudentName' }
          },
          {
            title: '得分',
            dataIndex: 'Score',
            // minWidth: 150,
            scopedSlots: { customRender: 'Score' }
          },
          {
            title: '操作',
            width: 80,
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' }
          }]
      }
    },
    computed: {
      activityStaObj () {
        return this.$store.state.evaluate.activityStaObj
      }
    },
    created () {
      if (Object.keys(this.$store.state.common.menuInfo).length > 0) {
        let row = this.$store.state.common.menuInfo
        this.params = {
          ActivityCourseProjectID: row.id,
          StudentGradeForStudentYearID: row.YearID,
          StudentOrganizationID: row.OrgID
        }
        this.loadTable()
      }
    },
    methods: {
      goStudent (row) {
        let obj = this.$store.state.evaluate.activityStaObj
        obj.student = row.StudentFullName
        obj.score = row.Score
        this.$store.commit('evaluate/changeActivityStaObj', obj)
        this.$store.commit('common/getThreeMenuName', obj.ActivityCourseProjectName)
        this.$store.commit('common/getParam', { id: row.ActivityCourseProjectID, studentID: row.ActivityCourseStudentID })
        this.$router.push({
          path: '/xyhome/statisticalStudent',
          query: this.$store.state.common.menuInfo
        })
      },
      async loadTable () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseStatistics/GetStatisticsClassByProjectID`, this.params)
        if (res.success) {
          this.datatable = res.data
        }
        this.tableLoading = false
      }
    }
  }
</script>
<style lang="less" scoped>
.title {
  font-size: 16px;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
  padding: 10px 0;
}
</style>
