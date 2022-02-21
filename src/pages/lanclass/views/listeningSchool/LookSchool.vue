<template>
  <div class='xy-content-module'>
    <div class='xy-content-title xy-flex xy-between xy-center'>
      <!-- 头部的显示 -->
      <div class="p-t-10">
        <Form class="xy-flex" ref="formValidateOK" :model="formValidateOK">
            <FormItem label="教师:" :label-width='60'>
                <Select
                    @on-change="loadTable"
                    v-model="formValidateOK.teachername"
                    :label="formValidateOK.teachername"
                    style="width:150px"
                    >
                    <Option v-for="item in teacherData" :value="item" :key="item" v-cloak>{{ item }}</Option>
                </Select>
            </FormItem>
            <FormItem label="状态:" :label-width='60'>
              <Select
                  @on-change="loadTable"
                  v-model="formValidateOK.state"
                  :label="formValidateOK.state"
                  style="width:150px"
                  >
                  <Option v-for="item in stateData" :value="item.ID" :key="item.Name" v-cloak>{{ item.Name }}</Option>
                </Select>
            </FormItem>
        </Form>
      </div>
    </div>
    <div class='xy-content-body'>
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        :nullData="nullData"
        :scrollx="'max-content'"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange">
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
    name: 'ListeningSchool',
    components: {
      XyAntTable
    },
    data () {
      return {
        datatable: [],
        nullData: '该搜索条件下没有结果。',
        tableLoading: true,
        pageList: '', // 当前页数据条数
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
        formValidateOK: {
          teachername: '全部',
          state: 0
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
            width: 200
          },
          {
            title: '上课教师',
            dataIndex: 'TeacherFullName',
            width: 150
          },
          {
            title: '上课班级',
            dataIndex: 'CoursePlanTableFullName',
            width: 200
          },
          {
            title: '状态',
            dataIndex: 'StateName',
            width: 100,
            scopedSlots: { customRender: 'StateNameRender' }
          }
        ],
        stateData: [],
        teacherData: [],
        menuInfo: {}
      }
    },
    created () {
      this.menuInfo = this.$store.state.common.menuInfo
      this.getStateList()
      this.getTeacherList()
      this.loadTable()
      this.getState()
      this.getTeacher()
    },
    mounted () {},
    methods: {
      getTeacher () {
        this.xy.get(`${this.xyApi}/ic/api/Listening/GetProgrammeTeacher`, {
          areaTeachingProgrammeID: this.menuInfo.areaTeachingProgrammeID
        }).then(res => {
          if (res.success) {
            this.teacherData = res.data
            this.teacherData.unshift('全部')
          }
        })
      },
      getState () {
        this.xy.get(`${this.xyApi}/ic/api/Listening/GetProgrammeStatus`).then(res => {
          if (res.success) {
            this.stateData = res.data
          }
        })
      },
      handleTableChange () {
        this.loadTable()
      },
      // 状态
      getStateList () {
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          if (res.success) {
            this.stateList = res.data
          }
        })
      },
      // 年级
      getTeacherList () {
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          if (res.success) {
            this.stateList = res.data
          }
        })
      },
      // 表格
      loadTable () {
        this.tableLoading = true
        let obj = {
          pageindex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          areaTeachingProgrammeID: this.menuInfo.areaTeachingProgrammeID,
          state: this.formValidateOK.state
        }
        if (this.formValidateOK.teachername !== '全部') {
          obj.teachername = this.formValidateOK.teachername
        }
        this.xy.get(`${this.xyApi}/ic/api/Listening/GetListeningprogrammeDetailByPage`, obj).then(res => {
          if (res.success) {
            this.pagination.total = res.data.totalRecords
            this.datatable = res.data.data
            if (res.data.data !== null && res.data.data.length > 0) {
              this.pageList = res.data.data.length
            }
          }
          this.tableLoading = false
        })
      }
    }
  }
</script>
<style lang='less' scoped>
.p-t-10{
  padding-top:10px;
}
.title>span{
  margin-right:20px;
}
.iconfont{
  vertical-align: middle;
}
.ivu-form-item{
  margin-bottom:0;
}
</style>
