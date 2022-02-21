<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between">
      <div class="">
        <Button class="xy-primary" @click="creatActivity">创建活动</Button>
        <Button class="xy-info" @click="target">指标管理</Button>
        <Button class="xy-info" @click="template">活动模板</Button>
        <!-- <Icon  custom="icon-icons-zhpj-active iconfont" size="16" class=" " /> -->
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
                  style="margin-right:10px"></cascader>
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
        <div slot="ActivityCourseProjectName" style="min-width:200px" slot-scope="text,record">
          <span class="table-el-hover" @click="edit(record)">
            {{record.ActivityCourseProjectName}}
          </span>
        </div>
        <div slot="ActivityCourseProjectStatus" slot-scope="text, record">
          <a-switch
            checked-children="启用"
            un-checked-children="禁用"
            :default-checked="record.ActivityCourseProjectStatus === 1"
            @change="swithChange(record)"
          />
        </div>
        <span slot="operation" slot-scope="text, record">
          <a @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="del(record)" :disabled="record.ActivityCourseProjectStatus!==0">删除</a>
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
      // xyTable
      XyAntTable
    },
    inject: ['reload'],
    name: 'activityTable',
    data () {
      return {
        pageSize: 15, // 每页显示条数
        pageCurrent: 1, // 当前页码
        pageList: '', // 当前页数据条数
        total: 0,
        selectionAll: [],
        datatable: [], // table数据
        schoolDistrictID: 0,
        schoolData: [],
        yearSessionData: [],
        yearSession: [],
        searchText: '',
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
            title: '活动名称',
            // minWidth: 200,
            dataIndex: 'ActivityCourseProjectName',
            // fixed: 'left',
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
            width: 200,
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
            title: '状态',
            width: 100,
            dataIndex: 'ActivityCourseProjectStatus',
            scopedSlots: { customRender: 'ActivityCourseProjectStatus' }
          },
          {
            title: '操作',
            width: 150,
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' }
          }]
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
      // 创建方案
      creatActivity () {
        this.$store.commit('evaluate/changeActivityObj', {
          ActivityCourseProjectID: 0,
          ActivityCourseProjectName: '',
          ActivityCourseScoreType: '0',
          ActivityCourseTemplateID: -1,
          ActivityCourseTemplateType: ''
        })
        this.$router.push({ path: '/xyhome/acStepsHeader' })
      },
      // 指标管理
      target () {
        this.$store.commit('common/getThreeMenuName', '指标管理')
        this.$store.commit('common/getParam', { pro: 'acivityTable' })
        this.$router.push({
          path: '/xyhome/acMarkManagement',
          query: this.$store.state.common.menuInfo
        })
      },
      template () {
        this.$store.commit('common/getThreeMenuName', '活动模板')
        this.$store.commit('common/getParam', { pro: 'acivityTable' })
        this.$router.push({
          path: '/xyhome/activityTemplate',
          query: this.$store.state.common.menuInfo
        })
      },
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
        this.datatable = []
        this.tableLoading = true
        let obj = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          SchoolDistrictID: this.schoolDistrictID,
          AcademicYearID: this.yearSession[0],
          AcademicSessionID: this.yearSession[1],
          SearchText: this.searchText
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseProject/GetProjectByPage`, obj)
        if (res.success) {
          this.total = res.data.totalRecords
          this.pagination.total = res.data.totalRecords
          res.data.data.map(item => {
            item.sessionYear = `${item.AcademicYearName}/${item.AcademicSessionName}`
            item.ActivityCourseStartTime = this.xy.moment(item.ActivityCourseStartTime).format('YYYY-MM-DD HH:mm')
            item.ActivityCourseEndTime = this.xy.moment(item.ActivityCourseEndTime).format('YYYY-MM-DD HH:mm')
            return item
          })
          this.datatable = res.data.data
          this.pageList = res.data.data.length
          this.tableLoading = false
        } else {
          this.tableLoading = false
        }
      },
      FromSubmit: function () {
        // this.pageCurrent = 1
        this.pagination.current = 1
        this.loadTable()
      },

      // 启用，停用
      async swithChange (row, val) {
        // this.xy.loading()
        let params = {
          ActivityCourseProjectID: row.ActivityCourseProjectID,
          ActivityCourseProjectStatus: row.ActivityCourseProjectStatus === 1 ? 0 : 1
        }
        if (val) {
          params.Disable = true
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ActivityCourseProject/ProjectEditStatus`, params, true)
        // this.xy.unloading()
        if (res.success) {
          if (val) {
            this.$Modal.remove()
          }
          this.xy.msgSuc(res.msg || (row.ActivityCourseProjectStatus === 1 ? '禁用成功。' : '启用成功。'))
          this.loadTable()
        } else {
          if (res.errorcode === '99') {
            this.forbidden(row, res.msg)
          } else {
            this.xy.msgError(res.msg)
            this.loadTable()
          }
        }
      },
      forbidden (row, msg) {
        let data = row
        this.$Modal.confirm({
          title: '温馨提示',
          content: `<p>${msg}</p>`,
          loading: true,
          onOk: () => {
            this.swithChange(data, true)
          },
          onCancel: () => {
            this.loadTable()
          }
        })
      },
      // 编辑
      edit (row) {
        this.$store.commit('evaluate/changeActivityObj', {
          ActivityCourseProjectID: row.ActivityCourseProjectID,
          ActivityCourseProjectName: row.ActivityCourseProjectName,
          ActivityCourseScoreType: row.ActivityCourseScoreType.toString(),
          ActivityCourseTemplateID: row.ActivityCourseTemplateID,
          ActivityCourseTemplateType: row.ActivityCourseTemplateType,
          IsEnable: row.ActivityCourseProjectStatus,
          SchoolDistrictID: row.SchoolDistrictID
        })
        this.$router.push({ path: '/xyhome/acStepsHeader' })
      },
      // 删除
      del (row) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + row.ActivityCourseProjectName + '"吗，确认删除后不保留历史数据？',
          onOk: () => {
            this.delObj(row.ActivityCourseProjectID)
          }
        })
      },
      async delObj (id) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ActivityCourseProject/DeleteProject?ActivityCourseProjectID=${id}`, {
          ActivityCourseProjectID: id
        })
        // this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          if (this.pageList > 1) {
            this.pageList = this.pageList - 1
          } else if (this.pagination.current > 1) {
            this.pagination.current = this.pagination.current - 1
          }
          this.loadTable()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
/deep/.btn-name{
padding: 0 10px;
color: #1890FF;
font-size: 14px;
border-left: 1px solid #D8D8D8;
margin-right: 5px;
color: #1890FF;
cursor: pointer;
}

</style>
