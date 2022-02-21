<!-- 互动课堂：主讲学校 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title flex-flow">
      <div class="title-right">
        <span class="col0-85">状态：</span>
        <Select
          v-model="stateId"
          @on-change="stateChange"
          class="mr-15"
          style="width:200px">
          <Option v-for="(item,index) in stateData" :value="item.ID" :key="index">{{item.Name}}</Option>
        </Select>
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        nullData="该搜索条件下没有结果。"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
        <div slot="StateNameRender" slot-scope="text, record">
          <i class="iconfont icon-info" v-if="record.StateName ==='进行中' ">&#xe719;</i>
          <i class="iconfont icon-success" v-if="record.StateName ==='已完成'" >&#xe719;</i>
          <i class="iconfont icon-end" v-if="record.StateName ==='未开始' ">&#xe719;</i>
          <span>
          {{record.StateName}}
          </span>
        </div>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'Detail',
    components: {
      XyAntTable
    },
    data () {
      return {
        rowObj: this.$store.state.lanclass.mainSchoolObj,

        stateId: 0,
        stateData: [], // 状态

        tableLoading: true,
        pageList: '', // 当前页数据条数
        datatable: [], // table数据
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
            title: '课程名称',
            dataIndex: 'SubjectName',
            width: 180
          },
          {
            title: '上课日期',
            dataIndex: 'ClassData',
            width: 150
          },
          {
            title: '上课时间',
            dataIndex: 'Time',
            width: 300
          },
          {
            title: '上课教师',
            dataIndex: 'TeacherFullName',
            width: 150
          },
          {
            title: '上课班级',
            dataIndex: 'CoursePlanTableFullName',
            width: 230
          },
          {
            title: '状态',
            dataIndex: 'StateName',
            width: 100,
            scopedSlots: { customRender: 'StateNameRender' }
          }
        ]
      }
    },
    created () {
      this.getSubject()
      this.loadTable()
    },
    mounted () {
    },
    methods: {
      // 状态
      getSubject () {
        this.xy.get(`${this.xyApi}/ic/api/Listening/GetProgrammeStatus`, null).then(res => {
          if (res.success) {
            if (res.data) {
              this.stateData = res.data
              this.stateId = this.stateData[0].ID
            }
          }
        })
      },
      stateChange (value) {
        this.pagination.current = 1
        this.loadTable()
      },
      // 获取table/分页数据
      loadTable () {
        this.tableLoading = true
        let obj = {
          pageindex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          academicSessionID: this.rowObj.sessionId,
          teachingProgrammeID: this.rowObj.teachingProgrammeID,
          state: this.stateId
        }
        this.xy.get(`${this.xyApi}/ic/api/Teaching/GetAllTeachingProgrammeDetail`, obj).then(res => {
          if (res.success) {
            this.pagination.total = res.data.totalRecords
            this.datatable = res.data.data
            if (res.data.data !== null && res.data.data.length > 0) {
              this.pageList = res.data.data.length
            }
          }
          this.tableLoading = false
        })
      },
      handleTableChange () {
        this.loadTable()
      }
    }
  }
</script>
<style lang="less" scoped>
.flex-flow{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-right {
  display: flex;
  align-items: center;
}
.iconfont{
  vertical-align: middle;
}
</style>
