
<template>
  <div class='xy-content-module'>
    <div class='xy-content-title'>
      <div>
        <Button class="xy-primary" @click='modalCreate = true'>创建学科</Button>
        <Button class="xy-danger" @click='delAll'>批量删除</Button>
      </div>
    </div>
    <div class='xy-content-body'>
      <Alert show-icon closable>系统已内置常用学科。系统内置学科和已被使用的自建学科都不可以删除。</Alert>
      <XyAntTable
        :rowSelection="tableRowSelection"
        :columns="columns"
        :dataSource="tableData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        >
        <div style="min-width:200px" slot="NameRender" slot-scope="text, record">
          <span class="table-el-hover" @click="edit(record)">
            {{record.DisciplineName}}
          </span>
        </div>
        <span slot="oprateRender" slot-scope="text, record">
          <a :disabled="record.IsDefault"  @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a :disabled="record._disabled"  @click="del(record.DisciplineID, record.DisciplineName)">删除</a>
        </span>
      </XyAntTable>
    </div>
    <Modal
      v-model='modalCreate'
      :transfer='false'
      title='创建学科'
      :mask-closable='false'
      >
        <div class='dialog-model-content'>
          <Form
            ref='formValidateCreate'
            :model='formValidateCreate'
            :rules='ruleValidateCreate'
            @submit.native.prevent
            label-position="top"
            >
            <FormItem label='学科名称' labelFor="formName" prop='formName'>
              <i-input v-model='formValidateCreate.formName' elementId="formName" clearable></i-input>
            </FormItem>
          </Form>
        </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="cancel">取消</Button>
            <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
          </div>
      </Modal>
      <Modal
        v-model='modalEdit'
        :transfer='false'
        title='编辑学科'
        :mask-closable='false'
        >
        <div class='dialog-model-content'>
          <Form
            ref='formValidateEdit'
            :model='formValidateEdit'
            :rules='ruleValidateEdit'
            @submit.native.prevent
            label-position="top"
            >
            <FormItem label='学科名称' labelFor="formNameE" prop='formName'>
              <i-input v-model='formValidateEdit.formName' elementId="formNameE" clearable></i-input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel">取消</Button>
          <Button class="xy-modal-primary" @click="editOk" shape="circle">确定</Button>
        </div>
      </Modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'subjectSet',
    components: {
      XyAntTable
    },
    data () {
      return {
        modal_loading: false,
        loading: true,
        modalCreate: false,
        searchName: '',
        editId: '',
        editName: '',
        modalEdit: false,
        ids: '',
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '您还没有学科的信息，请创建学科。',
        columns: [
          {
            title: '学科名称',
            dataIndex: 'DisciplineName',
            scopedSlots: { customRender: 'NameRender' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 120,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        tableData: [],
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
            this.pageIndex = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
            this.pageIndex = 1
            this.pageSize = pageSize
          }
        },
        pageIndex: 1,
        pageSize: 15,
        formValidateCreate: {
          formName: ''
        },
        ruleValidateCreate: {
          formName: [
            { required: true, message: '学科名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 20,
              message: '学科名称不能超过20字符',
              trigger: 'blur'
            }
          ]
        },
        formValidateEdit: {
          formName: ''
        },
        ruleValidateEdit: {
          formName: [
            { required: true, message: '学科名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 20,
              message: '学科名称不能超过20字符',
              trigger: 'blur'
            }
          ]
        },
        //  表格
        selectionAll: []
      }
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record._disabled
            }
          })
        }
      }
    },
    created () {},
    mounted () {
      this.$nextTick(function () {
        this.loadTable()
      })
    },
    methods: {
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      handleTableChange () {
        this.loadTable()
      },
      //   获取table分页数据
      async loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let params = {
          searchText: this.searchText,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          name: this.searchName
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/Discipline/GetPage',
          params
        )
        if (res.success) {
          this.tableData = res.data.data
          this.tableData.map((item, index) => {
            this.$set(item, 'key', index)
          })
          this.pagination.total = res.data.totalRecords
          if (res.data.data === [] && this.pageIndex > 1) {
            this.pageIndex = this.pageIndex - 1
            this.loadTable()
          }
          this.tableLoading = false
          console.log(res.data.data)
        }
      },
      //  提交创建触发
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      ok () {
        var _this = this
        this.$refs.formValidateCreate.validate(function (valid) {
          if (!valid) {
            return false
          } else {
            let params = {
              DisciplineName: _this.formValidateCreate.formName.trim()
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/Discipline/Create`, params).then(res => {
              if (res.success) {
                _this.xy.msgSuc('创建成功。')
                _this.loadTable()
                _this.modalCreate = false
                _this.$refs.formValidateCreate.resetFields()
              }
            })
          }
        })
      },
      // 关闭创建楼弹框触发
      cancel () {
        this.modalCreate = false
        this.modalEdit = false
        this.$refs.formValidateCreate.resetFields()
        this.$refs.formValidateEdit.resetFields()
      },
      // 单击表格中编辑按钮触发
      edit (row) {
        this.editId = row.DisciplineID
        this.formValidateEdit.formName = row.DisciplineName
        this.modalEdit = true
      },
      // 确认编辑触发
      editOk () {
        var _this = this
        this.$refs.formValidateEdit.validate(function (valid) {
          console.log(valid)
          if (!valid) {
            return false
          } else {
            let params = {
              DisciplineID: _this.editId,
              DisciplineName: _this.formValidateEdit.formName.trim()
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/Discipline/Edit`, params).then(res => {
              if (res.success) {
                _this.xy.msgSuc('编辑成功。')
                _this.loadTable()
                _this.modalEdit = false
                _this.$refs.formValidateEdit.resetFields()
              }
            })
          }
        })
      },
      // 单击删除单个内容触发
      del (id, name) {
        var _this = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + name + '"吗？</p>',
          loading: true,
          onOk: function () {
            _this.xy.post(`${_this.$store.state.apiPath}/api/Discipline/Delete?disciplineId=${id}`, null).then(res => {
              if (res.success) {
                _this.$Modal.remove()
                _this.xy.msgSuc('删除成功。')
                if (_this.tableData.length > 1) {
                  _this.tableData.length = _this.tableData.length - 1
                } else {
                  if (_this.pageIndex > 1) {
                    _this.pageIndex = _this.pageIndex - 1
                    _this.pagination.current = _this.pageIndex
                  }
                }
                _this.loadTable()
              }
            })
          }
        })
      },
      // 单击批量删除触发
      delAll () {
        var _this = this
        if (this.selectionAll.length < 1) {
          _this.xy.msgError('请勾选要删除的学科。')
        } else {
          this.$Modal.confirm({
            title: '批量删除',
            content: '<p>您确认要删除选中的所有学科吗？</p>',
            onOk: function () {
              var selectid = _this.selectionAll.map(item => {
                return item.DisciplineID
              })
              _this.xy.post(`${_this.$store.state.apiPath}/api/Discipline/DeleteByIds?disciplineIds=${selectid.join(',')}`, null).then(res => {
                if (res.success) {
                  _this.xy.msgSuc('删除成功。')
                  if (_this.selectionAll.length === _this.tableData.length && _this.tableData.length > 0) {
                    _this.pageIndex = _this.pageIndex - 1
                    _this.pagination.current = _this.pageIndex
                  }
                  _this.selectionAll = []
                  _this.loadTable()
                }
              })
            }
          })
        }
      },
      // 搜索触发
      FromSubmit () {
        this.pagination.current = 1
        this.pageIndex = 1
      }
    }
  }
</script>

<style lang='less' scoped>
.ivu-modal-confirm-head-title {
    margin: 0px;
    display: block;
}
.ivu-modal-confirm-body {
    padding-left: 0px;
    margin: 20px 20px 30px;
}
</style>
