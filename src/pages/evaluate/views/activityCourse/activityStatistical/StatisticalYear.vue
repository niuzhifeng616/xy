<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between">
      <div class="">
      </div>
      <div class="xy-flex xy-center">
        <div class="xy-flex xy-center">
          <!-- <label>年级</label> -->
          <cascader :data="list"
                    v-model="yearSession"
                    :clearable="false"
                    class="fl"
                    @on-change="cascaderChange"
                    style="margin-right: 10px;width:260px"></cascader>
        </div>

      </div>
    </div>
    <div class="xy-content-body">
      <!-- <xy-table :noDataText="'该搜索条件下没有结果。'" :tbColumns="columns"
                :tbData="datatable"
                :total="total"
                @changePage="changePage"
                @changePageSize="changePageSize"
                :pageSize="pageSize"
                :pageIndex="pageCurrent"></xy-table> -->
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
          <div slot="SchoolDistrictName" slot-scope="text,record">
            <span class="table-el-hover" @click="goClass(record)">
              {{record.SchoolDistrictName}}
            </span>
          </div>
          <div slot="MaxScore" slot-scope="text,record">
            <span>
              {{record.MaxScore ? record.MaxScore : '--'}}
            </span>
          </div>
          <div slot="MinScore" slot-scope="text,record">
            <span>
              {{record.MinScore ? record.MinScore : '--'}}
            </span>
          </div>
          <div slot="AvgScore" slot-scope="text,record">
            <span>
              {{record.AvgScore ? record.AvgScore : '--'}}
            </span>
          </div>
          <span slot="operation" slot-scope="text, record">
            <a @click="goClass(record)" >详情</a>
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
        pageSize: 15, // 每页显示条数
        pageCurrent: 1, // 当前页码
        pageList: '', // 当前页数据条数
        total: 0,
        datatable: [], // table数据
        list: [],
        ActivityCourseProjectID: 0,
        yearSession: [],
        schoolDistrictID: 0,
        gradeYearID: 0,
        classID: 0,
        nullData: '该搜索条件下没有结果。',
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
        columns: [
          {
            title: '校区',
            // minWidth: 200,
            dataIndex: 'SchoolDistrictName',
            scopedSlots: { customRender: 'SchoolDistrictName' }
          },
          {
            title: '年级',
            // minWidth: 250,
            dataIndex: 'StudentGradeNameForStudentYearName',
            scopedSlots: { customRender: 'StudentGradeNameForStudentYearName' }
          },
          {
            title: '班级',
            // minWidth: 80,
            dataIndex: 'StudentOrganizationName',
            scopedSlots: { customRender: 'StudentOrganizationName' }
          },
          {
            title: '人数',
            dataIndex: 'StudentCount',
            scopedSlots: { customRender: 'StudentCount' }
            // minWidth: 80
          },
          {
            title: '最高分',
            // minWidth: 80,
            dataIndex: 'MaxScore',
            scopedSlots: { customRender: 'MaxScore' }
            // render: (h, params) => {
            //   return h('span', params.row.MaxScore ? params.row.MaxScore : '--')
            // }
          },
          {
            title: '最低分',
            // minWidth: 80,
            dataIndex: 'MinScore',
            scopedSlots: { customRender: 'MinScore' }
            // render: (h, params) => {
            //   return h('span', params.row.MinScore ? params.row.MinScore : '--')
            // }
          },
          {
            title: '均分',
            // minWidth: 80,
            dataIndex: 'AvgScore',
            scopedSlots: { customRender: 'AvgScore' }
            // render: (h, params) => {
            //   return h('span', params.row.AvgScore ? params.row.AvgScore : '--')
            // }
          },
          {
            title: '操作',
            width: 80,
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' }
          }]
      }
    },
    created () {
      if (Object.keys(this.$store.state.common.menuInfo).length > 0) {
        this.ActivityCourseProjectID = this.$store.state.common.menuInfo.id
        this.schoolDistrictID = parseInt(this.$store.state.common.menuInfo.schoolDistrictID)
        this.getSearchCondition()
        this.loadTable()
      }
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      // 左上角校区年级班级层级数据获取
      async getSearchCondition () {
        // this.xy.loading()
        // 原来GetUserRangeClassPermission =》 GetUserRangeClassPermissionActivity
        // let res = await this.xy.get(`${this.xyApi}/base/xy/comm/GetUserRangeClassPermission`, {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseStatistics/GetUserRangeClassPermissionActivity`, {
          applicationID: this.$store.state.common.menuId.split(',')[1],
          applicationSubMenuID: this.$store.state.common.menuId.split(',')[2]
        })

        if (res.success) {
          // this.xy.unloading()
          this.list = [{
            IsCurrent: true,
            label: '年级',
            value: 0,
            children: [{
              IsCurrent: true,
              label: '班级',
              value: 0,
              children: []
            }]
          }]
          let result = res.data
          if (result.length > 0) {
            result.map(item => {
              if (item.value === this.schoolDistrictID) {
                this.list = this.list.concat(item.children)
                console.log(this.list)
              }
            })
          }
          this.yearSession = [0, 0]
        }
      },
      // 层级选择绑定校区年级班级ID及名字
      cascaderChange (val) {
        // this.schoolDistrictID = val[0].toString()
        if (val[0] || val[0] === 0) {
          this.gradeYearID = val[0].toString()
        }
        if (val[1] || val[1] === 0) {
          this.classID = val[1].toString()
        }
        // this.pageCurrent = 1
        this.pagination.current = 1
        this.loadTable()
        console.log(val)
      },
      goClass (row) {
        let obj = this.$store.state.evaluate.activityStaObj
        obj.class = row.StudentGradeNameForStudentYearName + row.StudentOrganizationName
        this.$store.commit('evaluate/changeActivityStaObj', obj)
        this.$store.commit('common/getThreeMenuName', obj.ActivityCourseProjectName)
        this.$store.commit('common/getParam', { id: row.ActivityCourseProjectID, YearID: row.StudentGradeForStudentYearID, OrgID: row.StudentOrganizationID })
        this.$router.push({
          path: '/xyhome/statisticalClass',
          query: this.$store.state.common.menuInfo
        })
      },
      // 获取table/分页数据
      async loadTable () {
        this.tableLoading = true
        let that = this
        let obj = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          ActivityCourseProjectID: this.ActivityCourseProjectID,
          StudentGradeForStudentYearID: this.gradeYearID,
          StudentOrganizationID: this.classID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseStatistics/GetStatisticsGradeByProjectID`, obj)
        if (res.success) {
          that.total = res.data.totalRecords
          that.pagination.total = res.data.totalRecords
          that.datatable = res.data.data
          that.pageList = res.data.data.length
          this.tableLoading = false
        } else {
          this.tableLoading = false
          that.xy.msgError(res.msg)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
