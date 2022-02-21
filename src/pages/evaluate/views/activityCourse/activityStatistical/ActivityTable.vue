<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between">
      <div class="">
      </div>
      <div class="xy-flex xy-center">
        <div class="xy-flex xy-center">
          <label>校区：</label>
            <i-select v-model="schoolDistrictID"
                  @on-change="schoolChange"
                  class="fl"
                  style="width:209px;margin-right: 10px">
          <i-option :value="0"
                    key="01">所有校区</i-option>
          <i-option v-for="item in schoolData"
                    :value="item.SchoolDistrictID"
                     :title='item.SchoolDistrictName'
                    :key="item.SchoolDistrictID">{{ item.SchoolDistrictName.length >= 8 ? `${item.SchoolDistrictName.substr(0, 7)}...` : item.SchoolDistrictName }}</i-option>
        </i-select>
        </div>
        <div class="xy-flex xy-center">
          <label>学年/学期：</label>
         <cascader :data="yearSessionData"
                  v-model="yearSession"
                  :clearable="false"
                  class="fl"
                  @on-change="cascaderChange"
                  style="margin-right: 10px"></cascader>
        </div>
        <div class="xy-flex xy-center">
          <Input suffix="ios-search" search v-model="searchText" @on-search="FromSubmit" placeholder="请输入活动名称" style="width:200px" />
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
          <div slot="ActivityCourseProjectName" style="min-width:120px" slot-scope="text,record">
            <span class="table-el-hover" @click="evaluateEntry(record)">
              {{record.ActivityCourseProjectName}}
            </span>
          </div>
          <span slot="operation" slot-scope="text, record">
            <a @click="evaluateEntry(record)" >详情</a>
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
        schoolDistrictID: 0,
        schoolData: [],
        yearSessionData: [],
        yearSession: [],
        searchText: '',
        nullData: '该搜索条件下没有结果。',
        tableLoading: true,
        ApplicationID: 0,
        ApplicationSubMenuID: 0,
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
            title: '活动名称',
            // minWidth: 120,
            dataIndex: 'ActivityCourseProjectName',
            scopedSlots: { customRender: 'ActivityCourseProjectName' }
          },
          {
            title: '活动类型',
            width: 200,
            dataIndex: 'ActivityCourseTypeName',
            scopedSlots: { customRender: 'ActivityCourseTypeName' }
          },
          {
            title: '校区',
            width: 150,
            dataIndex: 'SchoolDistrictName',
            scopedSlots: { customRender: 'SchoolDistrictName' }
          },
          {
            title: '学年/学期',
            width: 200,
            dataIndex: 'sessionYear',
            scopedSlots: { customRender: 'sessionYear' }
          },
          {
            title: '活动开始时间',
            width: 200,
            dataIndex: 'ActivityCourseStartTime',
            scopedSlots: { customRender: 'ActivityCourseStartTime' }
          },
          {
            title: '活动结束时间',
            dataIndex: 'ActivityCourseEndTime',
            width: 200,
            scopedSlots: { customRender: 'ActivityCourseEndTime' }
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
      idArr () {
        return this.$store.state.common.menuId
      }
    },
    watch: {
      idArr: {
        handler (val) {
          let idArr = val.split(',')
          this.ApplicationID = idArr[1]
          this.ApplicationSubMenuID = idArr[2]
        },
        immediate: true
      }
    },
    created () {
      this.$store.commit('common/getThreeMenuName', '')
      this.getSchool()
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      evaluateEntry (row) {
        this.$store.commit('common/getThreeMenuName', row.ActivityCourseProjectName)
        this.$store.commit('common/getParam', { id: row.ActivityCourseProjectID, schoolDistrictID: row.SchoolDistrictID })
        this.$store.commit('evaluate/changeActivityStaObj', {
          ActivityCourseProjectName: row.ActivityCourseProjectName,
          class: '',
          student: '',
          score: 0
        })
        this.$router.push({
          path: '/xyhome/statisticalYear',
          query: this.$store.state.common.menuInfo
        })
      },
      // 单击页码触发
      // changePage (current) {
      //   this.pageCurrent = current || 1
      //   this.loadTable()
      // },
      // // 单击切换每页展示条数触发
      // changePageSize (size) {
      //   this.pageCurrent = 1
      //   this.pageSize = size
      //   this.loadTable()
      // },
      // 获取校区
      getSchool: function () {
        // this.xy.loading()
        let that = this
        this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`).then(res => {
          if (res.success) {
            that.schoolData = res.data
            // that.xy.unloading()
            that.getSessionNodeList()
          } else {
            // this.xy.unloading()
            that.xy.msgError(res.msg)
          }
        })
      },
      schoolChange: function (value) {
        // this.pageCurrent = 1
        this.pagination.current = 1
        this.SchoolDistrictID = value
        this.loadTable()
      },
      // 学年学期
      getSessionNodeList: function () {
        let that = this
        that.yearSessionData = [
          {
            'label': '所有学年',
            'value': 0,
            'children': [{
              'value': 0,
              'label': '所有学期',
              'children': []
            }]
          }]
        // this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          if (res.success) {
            that.yearSessionData = that.yearSessionData.concat(res.data)
            that.yearSession = []
            let index = that.yearSessionData.map(function (item) {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              that.yearSession.push(that.yearSessionData[index].value)
              let index1 = that.yearSessionData[index].children.map(function (item) {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                that.yearSession.push(that.yearSessionData[index].children[index1].value)
              } else {
                that.yearSession = [0, 0]
              }
            } else {
              for (let i = 0; i < that.yearSessionData.length; i++) {
                if (that.yearSessionData[i].children.length > 0) {
                  that.yearSession = [that.yearSessionData[i].value, that.yearSessionData[i].children[0].value]
                  break
                }
              }
            }
            that.loadTable()
          }
          // this.xy.unloading()
        })
      },
      cascaderChange: function (value) {
        // this.pageCurrent = 1
        this.pagination.current = 1
        this.yearSession = value
        this.loadTable()
      },
      // 获取table/分页数据
      async loadTable () {
        this.tableLoading = true
        let that = this
        let obj = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          SchoolDistrictID: this.schoolDistrictID,
          AcademicYearID: this.yearSession[0],
          AcademicSessionID: this.yearSession[1],
          SearchText: this.searchText,
          ApplicationID: this.ApplicationID,
          ApplicationSubMenuID: this.ApplicationSubMenuID
        }
        // 之前的接口名是GetTeacherProjectByPage，改成GetActivityStatistics
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseProject/GetActivityStatistics`, obj)
        if (res.success) {
          that.total = res.data.totalRecords
          that.pagination.total = res.data.totalRecords
          res.data.data.map(item => {
            item.sessionYear = `${item.AcademicYearName}/${item.AcademicSessionName}`
            item.ActivityCourseStartTime = this.xy.moment(item.ActivityCourseStartTime).format('YYYY-MM-DD HH:mm')
            item.ActivityCourseEndTime = this.xy.moment(item.ActivityCourseEndTime).format('YYYY-MM-DD HH:mm')
            return item
          })
          that.datatable = res.data.data
          that.pageList = res.data.data.length
        }
        this.tableLoading = false
      },
      FromSubmit: function () {
        // this.pageCurrent = 1
        this.pagination.current = 1
        this.loadTable()
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
