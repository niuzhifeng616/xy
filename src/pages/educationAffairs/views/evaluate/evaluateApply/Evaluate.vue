<!-- 听评课计划 -->
<template>
  <div class=''>
    <div class="xy-content-title clearfix">
        <i-button class="xy-primary" @click="createEva">发布任务</i-button>
    </div>
    <div class="xy-content-body">
        <XyTable
      @changePage="changePage"
      @changePageSize="changePageSize"
      :tbColumns="columns"
      :tbData="dataTable"
      :pageSize="pageSize"
      :pageIndex="pageCurrent"
      :total="total">
    </XyTable>
        <modal :styles="{top:'20px'}"
               v-model="modalEdit"
               :transfer="false"
               title="查看听评课任务"
               :loading="loading"
               :mask-closable="false"
               @on-cancel="cancel">
            <div class="dialog-model-content">
                <i-form :label-width="100" id="applyIsPass">
                    <form-item label="学科">
                        <div class="apply-names">{{DisciplineName}}</div>
                    </form-item>
                    <form-item label="主讲教师">
                        <div class="apply-names">{{TeacherName}}</div>
                    </form-item>
                    <form-item label="教室地点">
                        <div class="apply-names">{{HouseName}}</div>
                    </form-item>
                    <form-item label="开始时间">
                        <div class="apply-names">{{this.xy.timeFormat(new Date(StartTime), 'yyyy-MM-dd HH:mm')}}</div>
                    </form-item>
                    <form-item label="结束时间">
                        <div class="apply-names">{{this.xy.timeFormat(new Date(EndTime), 'yyyy-MM-dd HH:mm')}}</div>
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
                <i-button class="xy-modal-close"  @click="cancelView">关闭</i-button>
            </div>
        </modal>
    </div>
  </div>
</template>

<script>
  import XyTable from '@/components/table/XyTable'
  export default {
    components: {
      XyTable
    },
    data () {
      return {
        modal_loading: false,
        loading: true,
        modalCreate: false, // 创建弹出框默认不展示
        editId: '', // 要编辑的ID
        modalEdit: false,
        DisciplineName: '',
        HouseName: '',
        StartTime: '',
        EndTime: '',
        Remarks: '',
        TeacherName: '',
        TeacherNames: '',
        createDate: '',
        dataTable: [],
        total: 0,
        pageCurrent: 1, // 当前页码
        pageSize: 15, // 每页显示条数
        pages: [15, 30, 50, 100],
        pageList: 0, // 当前页数据条数
        columns: [
          {
            title: '教室',
            key: 'HouseName',
            width: 180,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: '<div class="nowrap table-el-hover">' + (params.row.HouseName === null ? '--' : params.row.HouseName) + '</div>'
                  },
                  attrs: {
                    title: params.row.HouseName
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
            title: '主讲教师',
            key: 'TeacherName'
          },
          {
            title: '学科',
            key: 'DisciplineName'
          },
          {
            title: '参加人数（人）',
            key: 'EvaluateTeachersCount'
          },
          {
            title: '操作',
            key: 'operation',
            width: 150,
            render: (h, params) => {
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, [
                h('a', {
                  'class': {
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }, '查看'),
                h('a', {
                  'class': {
                    oprateBtn2: true
                  }
                }, [
                  h('a', {
                    style: {
                      cursor: params.row.IsDeleted ? 'not-allowed ' : '',
                      color: params.row.IsDeleted ? '#ccc ' : ''
                    },
                    on: {
                      click: () => {
                        if (!params.row.IsDeleted) {
                          this.del(params.row)
                        }
                      }
                    }
                  }, '撤回')]
                )
              ])
            }
          }
        ],
        formValidateOk: {
          thisName: '',
          Explain: '',
          thisDateTime: null,
          thisProCount: '',
          ResponsibleName: '',
          ResponsiblePhone: ''
        },
        ruleValidateOk: {
          thisName: [
            { type: 'string', required: true, message: '参观项目不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '参观项目不能超过20个字', trigger: 'blur' }
          ],
          thisDateTime: [
            { type: 'date', required: true, message: '参观时间不能为空', trigger: 'change' }
          ],
          thisProCount: [
            { required: true, message: '参观人数不能为空', trigger: 'blur' },
            { pattern: /^[0-9]{1,3}$/, message: '参观人数只能输入0-999的数字', trigger: 'blur' }
          ],
          ResponsibleName: [
            { required: true, message: '负责人姓名不能为空', trigger: 'blur' },
            { max: 20, message: '负责人姓名不能超过20个字', trigger: 'blur' }
          ],
          ResponsiblePhone: [
            { required: true, message: '负责人电话不能为空', trigger: 'blur' },
            { pattern: /^1(3[0-9]|4[57]|5[0-35-9]|66|7[0135678]|8[0-9]|9[8-9])\d{8}$/, message: '负责人电话号格式错误。', trigger: 'blur' }
          ]
        }
      }
    },
    mounted: function () {
      this.getTable()
    },
    methods: {
      createEva () {
        // this.$router.push({ path: '/xyHome/evaluate', query: this.$store.state.common.menuInfo })
        this.$router.push({ path: '/xyHome/createEvaluate' })
      },
      changePage: function (current) {
        this.pageCurrent = current
        this.getTable()
      },
      // 单击切换每页展示条数触发
      changePageSize: function (size) {
        this.pageCurrent = 1
        this.pageSize = size
        this.getTable()
      },
      async getTable () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Evaluate/GetPage`, {
          PageIndex: this.pageCurrent,
          PageSize: this.pageSize })
        if (res.success) {
          this.dataTable = res.data.data || []
          this.total = res.data.totalRecords || 0
          this.pageList = this.dataTable.length
          this.xy.unloading()
        }
      },
      // 关闭创建/编辑弹框触发
      cancel: function () {
        this.$refs.formValidateOk.resetFields()
      },
      cancelView: function () {
        this.modalEdit = false
      },
      // 单击表格中查看按钮触发
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
      },
      // 单击删除单个内容触发
      del  (row) {
        var _this = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '<p>您确认要撤回当前听评课任务吗？</p>',
          onOk: function () {
            _this.xy.post(`${_this.$store.state.apiPath}/api/Evaluate/Delete?id=${row.LectureCommentClassTableID}`).then(res => {
              if (res.success) {
                if (_this.pageList > 1) {
                  _this.pageList = _this.pageList - 1
                } else {
                  if (_this.pageCurrent > 1) {
                    _this.pageCurrent = _this.pageCurrent - 1
                  }
                }
                _this.xy.msgSuc('撤回成功')
                _this.getTable()
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang='less' scoped>
</style>
