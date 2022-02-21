<!-- 我的听评课 -->
<template>
  <div>
    <div class="xy-content-title clearfix">
      <div class="text-center">
        <radio-group v-model="typeID" type="button" @on-change="search" class="text-center">
          <radio label="2">我听课</radio>
          <radio label="1">我讲课</radio>
        </radio-group>
      </div>
    </div>
    <div class="xy-content-body">
      <XyTable @changePage="changePage" @changePageSize="changePageSize" :tbColumns="columns" :tbData="dataTable" :pageSize="pageSize" :pageIndex="pageCurrent" :total="total">
      </XyTable>
      <modal :styles="{top:'20px'}" v-model="modalEdit" :transfer="false" v-cloak title="查看听评课任务" :loading="loading" :mask-closable="false" :closable="false" @on-cancel="cancel">
        <div class="dialog-model-content">
          <i-form :label-width="100" id="applyIsPass">
            <form-item label="学科">
              <div class="apply-names">{{DisciplineName}}</div>
            </form-item>
            <form-item label="主讲教师">
              <div class="apply-names">{{TeacherName}}</div>
            </form-item>
            <form-item label="教室">
              <div class="apply-names">{{HouseName}}</div>
            </form-item>
            <form-item label="开始时间">
              <div class="apply-names">{{xy.timeFormat(new Date(StartTime), 'yyyy-MM-dd HH:mm')}}</div>
            </form-item>
            <form-item label="结束时间">
              <div class="apply-names">{{xy.timeFormat(new Date(EndTime), 'yyyy-MM-dd HH:mm')}}</div>
            </form-item>
            <form-item label="备注">
              <div class="apply-names">{{Remarks}}</div>
            </form-item>
            <form-item label="听讲人">
              <div class="apply-names">{{TeacherNames}}</div>
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <i-button size="large" @click="cancelView">关闭</i-button>
        </div>
      </modal>
    </div>
  </div>

</template>

<script>
  import XyTable from '@/components/table/XyTable'
  export default {
    components: { XyTable },
    data () {
      return {
        modal_loading: false,
        loading: true,
        modalEdit: false,
        DisciplineName: '',
        HouseName: '',
        StartTime: '',
        EndTime: '',
        Remarks: '',
        TeacherName: '',
        typeID: '2',
        TeacherNames: '',
        dataTable: [],
        total: 0,
        pageCurrent: 1, // 当前页码
        pageSize: 15, // 每页显示条数
        pages: [15, 30, 50, 100],
        pageList: 0, // 当前页数据条数
        columns: [
          {
            title: '学科',
            key: 'DisciplineName',
            width: 180,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: '<div class="nowrap table-el-hover">' + (params.row.DisciplineName == null ? '--' : params.row.DisciplineName) + '</div>'
                  },
                  attrs: {
                    title: params.row.DisciplineName
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                })
              ])
            }
          },
          {
            title: '主讲教师',
            key: 'TeacherName',
            width: 120
          },
          {
            title: '教室',
            key: 'HouseName',
            width: 150,
            render: function (h, params) {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: '<div class="nowrap">' + (params.row.HouseName == null ? '--' : params.row.HouseName) + '</div>'
                  },
                  attrs: {
                    title: params.row.HouseName
                  }
                })
              ])
            }
          },
          {
            title: '开始时间',
            key: 'StartTime',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: this.xy.timeFormat(new Date(params.row.StartTime), 'yyyy-MM-dd HH:mm')
                  }
                })
              ])
            }
          },
          {
            title: '结束时间',
            key: 'EndTime',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: this.xy.timeFormat(new Date(params.row.EndTime), 'yyyy-MM-dd HH:mm')
                  }
                })
              ])
            }
          },
          {
            title: '参加人数（人）',
            width: 150,
            key: 'EvaluateTeachersCount'
          },
          {
            title: '备注',
            key: 'Remarks',
            width: 150,
            render: function (h, params) {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: '<div class="nowrap">' + (params.row.Remarks == null ? '--' : params.row.Remarks) + '</div>'
                  },
                  attrs: {
                    title: params.row.Remarks
                  }
                })
              ])
            }
          },
          {
            title: '操作',
            key: 'operation',
            width: 100,
            render: (h, params) => {
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, [
                h('a', {
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }, '查看')])
            }
          }
        ]
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.getTP()
      })
    },
    methods: {
      changePage: function (current) {
        this.pageCurrent = current
        this.getTP()
      },
      // 单击切换每页展示条数触发
      changePageSize: function (size) {
        this.pageCurrent = 1
        this.pageSize = size
        this.getTP()
      },
      async  getTP () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Evaluate/GetPageMyEvaluate`, {
          PageIndex: this.pageCurrent,
          PageSize: this.pageSize,
          typeID: this.typeID
        })
        if (res.success) {
          this.dataTable = res.data.data || []
          this.total = res.data.totalRecords || 0
          this.pageList = this.dataTable.length
          this.xy.unloading()
        }
      },
      search: function (typeid) {
        this.typeID = typeid
        this.PageIndex = 1
        this.getTP()
      },
      cancel: function () {
        this.$refs.formValidate.resetFields()
      },
      cancelView: function () {
        this.modalEdit = false
      },
      edit: function (row) {
        this.modalEdit = true
        this.DisciplineName = row.DisciplineName
        this.HouseName = row.HouseName
        this.StartTime = row.StartTime
        this.EndTime = row.EndTime
        this.Remarks = row.Remarks
        this.TeacherName = row.TeacherName
        var name = ''
        row.EvaluateTeachers.forEach(function (value, index, array) {
          name += '' + value.TeacherName + '、'
        })
        this.TeacherNames = name.substring(0, name.length - 1)
      }
    }

  }
</script>
<style lang='less' scoped>
</style>
