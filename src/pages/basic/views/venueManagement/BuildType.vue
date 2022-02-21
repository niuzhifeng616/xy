<template>
  <div class="xy-content-module">
      <div class="xy-content-title xy-flex xy-between xy-center">
        <div>
          <Button class="xy-primary" @click="modalCreate = true">创建楼宇类别</Button>
          <Button class="xy-danger" @click="delAll">批量删除</Button>
        </div>
        <div class="pr">
          <i-input
            search
            v-model="searchName"
            @on-search="FromSubmit"
            placeholder="请输入类别名称"
            class="xy-content-title-search"
            style="width: auto;"
            >
            <icon type="ios-search cursor-p" slot="suffix" />
          </i-input>
        </div>
      </div>
      <div class="xy-content-body">
        <Alert show-icon closable>不可删除已被使用的楼宇类别。</Alert>
        <XyAntTable
          :rowSelection="tableRowSelection"
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          >
          <div style="min-width:200px" slot="BuildingTypeNameRender" slot-scope="text, record">
            <span class="table-el-hover" @click="edit(record.BuildingTypeID, record.BuildingTypeName)">
              {{record.BuildingTypeName}}
            </span>
          </div>
          <span slot="oprateRender" slot-scope="text, record">
            <a @click="edit(record.BuildingTypeID, record.BuildingTypeName)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="record._disabled"  @click="del(record.BuildingTypeID, record.BuildingTypeName)">删除</a>
          </span>
        </XyAntTable>
      </div>
      <Modal
        v-model="modalCreate"
        :transfer="false"
        title="创建楼宇类别"
        :mask-closable="false"
        >
          <div class="dialog-model-content">
              <i-form ref="formValidate" label-position="top" :model="formValidate" :rules="ruleValidate" @submit.native.prevent>
                  <form-item label="楼宇类别名称" labelFor="venueValue" prop="venueValue">
                      <i-input v-model.trim="formValidate.venueValue" elementId="venueValue" clearable></i-input>
                  </form-item>
              </i-form>
          </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="cancel">取消</Button>
            <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
          </div>
      </Modal>
      <Modal
        v-model="modalEdit"
        :transfer="false"
        title="编辑楼宇类别"
        :mask-closable="false"
        >
          <div class="dialog-model-content">
              <i-form ref="editformValidate" label-position="top" :model="editformValidate" :rules="editruleValidate" @submit.native.prevent>
                  <form-item label="楼宇类别名称" labelFor="venueValueE" prop="venueValue">
                      <i-input elementId="venueValueE" v-model.trim="editformValidate.venueValue" clearable></i-input>
                  </form-item>
              </i-form>
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
    name: 'courseSet',
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
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: '楼宇类别',
            dataIndex: 'BuildingTypeName',
            scopedSlots: { customRender: 'BuildingTypeNameRender' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 120,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
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
        formValidate: {
          venueValue: ''
        },
        ruleValidate: {
          venueValue: [
            { required: true, message: '类别名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '类别名称不能超过20字符', trigger: 'blur' }
          ]
        },
        editformValidate: {
          venueValue: ''
        },
        editruleValidate: {
          venueValue: [
            { required: true, message: '类别名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '类别名称不能超过20字符', trigger: 'blur' }
          ]
        },
        tableData: [],
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
    created: function () {
      this.$store.commit('common/getThreeMenuName', '编辑类别')
    },
    mounted: function () {
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
        this.tableData = []
        this.tableLoading = true
        let params = {
          name: this.searchName,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/Building/GetTypePage', params)
        if (res.success) {
          this.tableData = res.data.data
          this.tableData.map((item, index) => {
            this.$set(item, 'key', index)
          })
          this.pagination.total = res.data.totalRecords
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
        this.$refs.formValidate.validate(function (valid) {
          console.log(valid)
          if (!valid) {
            return _this.changeLoading()
          } else {
            let params = {
              BuildingTypeName: _this.formValidate.venueValue
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/Building/CreateType`, params).then(res => {
              if (res.success) {
                _this.changeLoading()
                _this.xy.msgSuc('创建成功。')
                _this.loadTable()
                _this.modalCreate = false
                _this.$refs.formValidate.resetFields()
              }
            })
          }
        })
      },
      // 关闭创建/编辑弹框触发
      cancel () {
        this.modalCreate = false
        this.modalEdit = false
        this.$refs.formValidate.resetFields()
        this.$refs.editformValidate.resetFields()
      },
      // 单击表格中编辑按钮触发
      edit (id, name) {
        this.modalEdit = true
        this.editId = id
        this.editformValidate.venueValue = name
      },
      editCancel () {
        this.editId = ''
        this.editName = ''
      },
      // 确认编辑触发
      editOk () {
        var _this = this
        this.$refs.editformValidate.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            // 国家课程
            let params = {
              BuildingTypeID: _this.editId,
              BuildingTypeName: _this.editformValidate.venueValue
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/Building/EditType`, params).then(res => {
              if (res.success) {
                _this.changeLoading()
                _this.modal_loading = false
                _this.xy.msgSuc('编辑成功。')
                _this.loadTable()
                _this.modalEdit = false
                _this.$refs.editformValidate.resetFields()
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
            _this.xy.post(`${_this.$store.state.apiPath}/api/Building/DeleteType?id=${id}`, null).then(res => {
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
          _this.xy.msgError('请勾选要删除的楼宇类别。')
        } else {
          this.$Modal.confirm({
            title: '批量删除',
            content: '<p>您确认要删除选中的所有楼宇类别吗？</p>',
            onOk: function () {
              var selectid = _this.selectionAll.map(item => {
                return item.BuildingTypeID
              })
              _this.xy.post(`${_this.$store.state.apiPath}/api/Building/DeleteTypeByIDS?ids=${selectid.join(',')}`, null).then(res => {
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
      },
      back () {
        this.$router.go(-1)
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
