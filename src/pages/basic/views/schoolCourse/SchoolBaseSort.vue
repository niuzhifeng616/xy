// 课程设置-校本分类
<template>
  <div class="xy-content-module">
      <!-- 面包屑 -->
      <div class="xy-content-title clearfix">
        <div class="fl">
            <Button class="xy-primary" @click="modalCreate = true">创建校本分类</Button>
            <Button class="xy-danger" style="margin-left: 10px;" @click="delAll">批量删除</Button>
        </div>
        <div class="fr pr" style="width:500px;">
            <i-input
              search
              v-model.trim="searchText"
              @on-search="FromSubmit"
              placeholder="分类名称"
              class="fr xy-content-title-search"
              style="width: auto;">
                <icon type="ios-search cursor-p" slot="suffix" />
            </i-input>
        </div>
    </div>
      <div class="xy-content-body">
        <Alert show-icon closable>校本分类用于对校本课程进行分类管理。您不可以删除已被使用的校本分类。</Alert>
        <XyAntTable
          :rowSelection="tableRowSelection"
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
          >
          <div style="min-width:250px" slot="NameRender" slot-scope="text, record">
            <span class="table-el-hover" @click="edit(record)">
              {{record.SubjectCategoryName}}
            </span>
          </div>
          <div style="min-width:200px" slot="DescriptionRender" slot-scope="text, record">
            <span>
              {{record.Description}}
            </span>
          </div>
          <span slot="oprateRender" slot-scope="text, record">
            <a @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="record._disabled"  @click="del(record.SubjectCategoryID, record.SubjectCategoryName)">删除</a>
          </span>
        </XyAntTable>
        <Modal
          v-model="modalCreate"
          :transfer="false"
          title="创建校本分类"
          :mask-closable="false">
            <div class="dialog-model-content">
                <Form ref="formValidateCreate" :model="formValidateCreate" label-position="top" :rules="ruleValidateCreate">
                    <FormItem label="校本分类名称" prop="formName" labelFor="formName">
                        <i-input v-model="formValidateCreate.formName" elementId="formName" clearable></i-input>
                    </FormItem>
                    <FormItem label="描述" prop="formDescription" labelFor="formDescription">
                        <i-input v-model="formValidateCreate.formDescription" elementId="formDescription" clearable></i-input>
                    </FormItem>
                </Form>
            </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="cancel">取消</Button>
            <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
          </div>
        </Modal>
        <Modal
          v-model="modalEdit"
          :transfer="false"
          title="编辑校本分类"
          :mask-closable="false"
          ok-text="保存">
            <div class="dialog-model-content">
                <Form ref="formValidateEdit" :model="formValidateEdit" label-position="top" :rules="ruleValidateEdit">
                    <FormItem label="校本分类名称" prop="formName" labelFor="formNameE">
                        <i-input v-model="formValidateEdit.formName" elementId="formNameE" clearable></i-input>
                    </FormItem>
                    <FormItem label="描述" prop="formDescription" labelFor="formDescriptionE">
                        <i-input v-model="formValidateEdit.formDescription" elementId="formDescriptionE" clearable></i-input>
                    </FormItem>
                </Form>
            </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="cancel">取消</Button>
            <Button class="xy-modal-primary" @click="editOk" shape="circle">确定</Button>
          </div>
        </Modal>
      </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'SchoolBaseSort',
    components: {
      XyAntTable
    },
    data () {
      return {
        modal_loading: false,
        loading: true,
        tableShow: false,
        modalCreate: false,
        searchText: '',
        editId: '',
        editName: '',
        editDescription: '',
        modalEdit: false,
        ids: '',
        formValidateCreate: {
          formName: '',
          formDescription: ''
        },
        ruleValidateCreate: {
          formName: [
            { required: true, message: '校本分类名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '校本分类名称不能超过20字符', trigger: 'blur' }
          ],
          formDescription: [
            { type: 'string', max: 50, message: '描述不能超过50字符', trigger: 'blur' }
          ]
        },
        formValidateEdit: {
          formName: '',
          formDescription: ''
        },
        ruleValidateEdit: {
          formName: [
            { required: true, message: '校本分类名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '校本分类名称不能超过20字符', trigger: 'blur' }
          ],
          formDescription: [
            { type: 'string', max: 50, message: '描述不能超过50字符', trigger: 'blur' }
          ]
        },
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: '校本分类名称',
            dataIndex: 'SubjectCategoryName',
            scopedSlots: { customRender: 'NameRender' }
          },
          {
            title: '校本分类说明',
            key: 'Description',
            scopedSlots: { customRender: 'DescriptionRender' }
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
      //  获取table分页数据
      async loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let params = {
          searchText: this.searchText,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/SubjectCategory/GetPage', params)
        if (res.success) {
          this.tableData = res.data.data
          this.tableData.map((item, index) => {
            this.$set(item, 'key', index)
          })
          this.total = res.data.totalRecords
          this.pagination.total = res.data.totalRecords
          if (res.data.data === [] && this.pageIndex > 1) {
            this.pageIndex = this.pageIndex - 1
            this.loadTable()
          }
          console.log(res.data.data)
        }
        this.tableLoading = false
      },
      // 提交创建触发
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      ok () {
        var _this = this
        this.$refs.formValidateCreate.validate(function (valid) {
          console.log(valid)
          if (!valid) {
            return false
          } else {
            let params = {
              SubjectCategoryName: _this.formValidateCreate.formName,
              Description: _this.formValidateCreate.formDescription
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/SubjectCategory/Create`, params).then(res => {
              if (res.success) {
                _this.xy.msgSuc('创建成功。')
                _this.loadTable()
                _this.modalCreate = false
                _this.$refs.formValidateCreate.resetFields()
              } else {
                _this.modalCreate = true
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
        this.editId = row.SubjectCategoryID
        this.formValidateEdit.formName = row.SubjectCategoryName
        this.formValidateEdit.formDescription = row.Description
        this.modalEdit = true
      },
      // 确认编辑触发
      editOk () {
        var _this = this
        this.$refs.formValidateEdit.validate(function (valid) {
          if (!valid) {
            return false
          } else {
            let params = {
              SubjectCategoryID: _this.editId,
              SubjectCategoryName: _this.formValidateEdit.formName,
              Description: _this.formValidateEdit.formDescription
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/SubjectCategory/Edit`, params).then(res => {
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
          onOk () {
            _this.xy.post(`${_this.$store.state.apiPath}/api/SubjectCategory/Delete?subjectCategoryId=${id}`, null).then(res => {
              if (res.success) {
                _this.$Modal.remove()
                _this.xy.msgSuc('删除成功。')
                _this.modal_loading = false
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
        _this.modal_loading = true
        if (this.selectionAll.length < 1) {
          _this.xy.msgError('请勾选要删除的课程。')
        } else {
          this.$Modal.confirm({
            title: '批量删除',
            content: '<p>您确认要删除选中的所有课程吗？</p>',
            onOk () {
              var selectid = _this.selectionAll.map(item => {
                return item.SubjectCategoryID
              })
              _this.xy.post(`${_this.$store.state.apiPath}/api/SubjectCategory/DeleteByIds?subjectCategoryIds=${selectid.join(',')}`, null).then(res => {
                if (res.success) {
                  _this.xy.msgSuc('删除成功。')
                  _this.modal_loading = false
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
        };
      },
      // 搜索触发
      FromSubmit () {
        this.pagination.current = 1
        this.pageIndex = 1
        this.loadTable()
      }
    }
  }
</script>

<style lang="less" scoped>
.ivu-modal-confirm-head-title {
    margin: 0px;
    display: block;
}
.ivu-modal-confirm-body {
    padding-left: 0px;
    margin: 20px 20px 30px;
}
</style>
