<!-- 课程变更 -->
<template>
  <div class=''>
    <XyAntTable
      :columns="columns"
      :dataSource="datatable"
      nullData="该搜索条件下没有结果。"
      :tableLoading="tableLoading"
      :pagination="pagination"
      @change="handleTableChange">
      <!-- 变更课表 -->
      <div slot="ChangeCoursesRender" slot-scope="text, record" style="min-width:400px">
        <span class="table-el-hover" @click="seeClick(record.ClassTableGenerateForCourseChangeID)">
          {{record.ChangeCourses}}
        </span>
      </div>
      <!-- 变更时间 -->
      <div slot="LastDateRender" slot-scope="text, record">
        <span>
          {{xy.moment(record.LastDate).format('YYYY-MM-DD HH:mm')}}
        </span>
      </div>
      <!-- 操作 -->
      <span slot="operaRender" slot-scope="text, record">
        <a @click="seeClick(record.ClassTableGenerateForCourseChangeID)">查看</a>
        <a-divider type="vertical" />
        <a @click="exportFile(record.ClassTableGenerateForCourseChangeID)">导出通知详情</a>
      </span>
    </XyAntTable>
    <!-- 确定提交课程变更 -->
    <modal v-model="courseChange"
           :transfer="false"
           width="920"
           title="课程变更详情"
           :loading="loading"
           :mask-closable="false"
           :closable="true"
           @on-cancel="cancel"
           footer-hide
           cancel-text="关闭"
          >
      <div class="dialog-model-content">
        <i-table ref="selection"
                 height="300"
                 :columns="columnsTable"
                 :data="checkList"></i-table>
      </div>
    </modal>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: { XyAntTable },
    data () {
      return {
        loading: true,
        schoolDistrictID: 0,
        academicYearID: 0,
        academicSessionID: 0,

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
        datatable: [], // table数据
        columns: [
          {
            title: '变更课表',
            dataIndex: 'ChangeCourses',
            scopedSlots: { customRender: 'ChangeCoursesRender' }
          },
          {
            title: '变更操作人',
            dataIndex: 'LastFullName',
            width: 150
          },
          {
            title: '变更时间',
            dataIndex: 'LastDate',
            scopedSlots: { customRender: 'LastDateRender' },
            width: 150
          },
          {
            title: '操作',
            dataIndex: 'opera',
            scopedSlots: { customRender: 'operaRender' },
            width: 200
          }
        ],

        courseChange: false,
        columnsTable: [
          {
            title: '上课时间',
            key: 'ChangeCourses',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: '<div>' + '第' + params.row.Week + '周' + params.row.TimeInfo + '（' + params.row.ChangeDate + '）' + '</div>'
                  },
                  attrs: {
                    title: '第' + params.row.Week + '周' + params.row.TimeInfo + '（' + params.row.ChangeDate + '）'
                  }
                })
              ])
            }
          },
          {
            title: '班级',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: '<div>' + params.row.SchoolDistrictName + params.row.ClassName + '</div>'
                  },
                  attrs: {
                    title: params.row.SchoolDistrictName + params.row.ClassName
                  }
                })
              ])
            }
          },
          {
            title: '原课程/教师',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  attrs: {
                    title: params.row.SubjectName + ' / ' + params.row.TeacherName
                  },
                  domProps: {
                    innerHTML: '<div>' + params.row.SubjectName + (params.row.TeacherName == null ? '' : (' / ' + params.row.TeacherName)) + '</div>'
                  }
                })
              ])
            }
          },
          {
            title: '变更为课程/教师',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: '<div>' + params.row.ReplaceSubjectName + '</div>'
                  }
                })
              ])
            }
          }

        ],
        checkList: [],
        row: '',
        ClassTableGenerateForCourseChangeID: ''
      }
    },
    created: function () {

    },
    mounted: function () {
      this.$parent.showTitle = 0
      this.$parent.isIndex = -1
      this.$nextTick(function () {
        this.loadTable()
      })
    },
    methods: {
      // 获取table表格
      async loadTable () {
        this.tableLoading = true
        let obj = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          schoolDistrictID: this.$parent.sId,
          academicYearID: this.$parent.yearSession[0],
          academicSessionID: this.$parent.yearSession[1]
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForCourseChange/GetChanges`, obj)
        if (res.success) {
          this.pagination.total = res.data.totalRecords
          this.datatable = res.data.data
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.loadTable()
      },
      // 查看详情
      async seeClick (id) {
        let that = this
        that.courseChange = true
        that.ClassTableGenerateForCourseChangeID = id
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForCourseChange/GetChangeDetail`, {
          classTableGenerateForCourseChangeID: that.ClassTableGenerateForCourseChangeID
        })
        if (res.success) {
          if (res.data.length > 0) {
            that.checkList = res.data
          }
        }
      },

      cancel: function () { },

      // 导出通知详情
      exportFile: function (id) {
        let that = this
        that.ClassTableGenerateForCourseChangeID = id
        this.xy.downFile(`${this.$store.state.apiPath}/api/ClassTableGenerateForCourseChange/ExportCircular?classTableGenerateForCourseChangeID=${that.ClassTableGenerateForCourseChangeID}`)
        that.isContainWeekend = false
      }

    }

  }
</script>
<style lang='less' scoped>
</style>
