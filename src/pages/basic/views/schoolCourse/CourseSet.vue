 //  课程管理-课程设置
<template>
  <div class="xy-content-module">
      <!-- 面包屑 -->
      <div class="xy-content-title clearfix">
        <div class="fl">
            <Button class="xy-primary" @click="modalCreate = true">创建课程</Button>
            <Button class="xy-info" style="margin-left:10px;" @click="ImportClick">导入校本课程</Button>
            <Button class="xy-danger" style="margin-left:10px;" @click="delAll">批量删除</Button>
        </div>
        <div style="float: right;" class="fr pr">
          <span class="fl pr" style="line-height:30px;">类别:</span>
            <Select
              v-model="subjectCategoryID"
              @on-change="subjectCategoryTypeChange"
              class="fl xy-content-title-search"
              style="width:150px"
              >
                <Option :value="0">所有类别</Option>
                <Option v-for="item in subjectCategoryArr" :value="item.SubjectCategoryID" :key="item.SubjectCategoryName" v-cloak>{{ item.SubjectCategoryName }}</Option>
            </Select>
            <Select
              v-model="childSubCategoryID"
              v-if="subjectCategoryID == 3"
              @on-change="childSubCategoryTypeChange"
              class="fl xy-content-title-search"
              style="width:150px"
              >
                <Option :value="0">所有分类</Option>
                <Option v-for="item in childSubCategoryArr" :value="item.SubjectCategoryID" :key="item.SubjectCategoryName" v-cloak>{{ item.SubjectCategoryName }}</Option>
            </Select>
            <i-input
              search
              v-model.trim="searchText"
              @on-search="FromSubmit"
              placeholder="按课程名称或简称查找"
              class="fr xy-content-title-search"
              style="width: auto;"
              >
                <icon type="ios-search cursor-p" slot="suffix" />
            </i-input>
        </div>
      </div>
      <div class="xy-content-body">
        <Alert show-icon closable>对学校的课程进行管理，您不可以删除已被使用的课程。</Alert>
        <XyAntTable
          :rowSelection="tableRowSelection"
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="800"
          >
          <div style="min-width:250px" slot="NameRender" slot-scope="text, record">
            <span v-if="!record.IsDefault" class="table-el-hover" @click="edit(record)">
              {{text}}
            </span>
            <span v-else>
              {{text}}
            </span>
          </div>
          <div style="min-width:200px" slot="SubjectNameRender" slot-scope="text, record">
              {{record.SubjectName}}
          </div>
          <div style="min-width:150px" slot="DisciplineNameRender" slot-scope="text, record">
              {{record.DisciplineName}}
          </div>
          <div style="min-width:150px" slot="ChildSubjectCategoryNameRender" slot-scope="text, record">
              {{record.ChildSubjectCategoryName}}
          </div>
          <span slot="oprateRender" slot-scope="text, record">
            <a :disabled="record.IsDefault"  @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="record._disabled"  @click="del(record.SubjectID, record.SubjectName)">删除</a>
          </span>
        </XyAntTable>
        <Modal
          v-model="modalCreate"
          :transfer="false"
          title="创建课程"
          :mask-closable="false"
          ok-text="保存"
          >
            <div class="dialog-model-content">
                <Form ref="formValidateCreate" :model="formValidateCreate" label-position="top" :rules="ruleValidateCreate" @submit.native.prevent>
                    <FormItem label="课程名称" prop="formValiFullName" labelFor="formValiFullName">
                        <i-input v-model="formValidateCreate.formValiFullName" elementId="formValiFullName" clearable></i-input>
                    </FormItem>
                    <FormItem label="课程简称" prop="formValiName" labelFor="formValiName">
                        <i-input v-model="formValidateCreate.formValiName" elementId="formValiName" clearable></i-input>
                    </FormItem>
                    <FormItem label="所属学科" prop="disciplineID">
                        <Select v-model="formValidateCreate.disciplineID">
                            <Option v-for="item in disciplineArr" :value="item.DisciplineID" :key="item.DisciplineName">{{ item.DisciplineName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="课程类别" prop="subjectCategoryIDAdd">
                        <Select v-model="formValidateCreate.subjectCategoryIDAdd" @on-change="subjectChange">
                            <Option v-for="item in subjectCategoryArr" :value="item.SubjectCategoryID" :key="item.SubjectCategoryName">{{ item.SubjectCategoryName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="选考学考" prop="subjectType" v-if="formValidateCreate.subjectCategoryIDAdd == 1">
                        <Select v-model="formValidateCreate.subjectType">
                            <Option v-for="item in subjectTypeArr" :value="item.ID" :key="item.Name">{{ item.Name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="校本分类" prop="childSubCategoryID" v-if="formValidateCreate.subjectCategoryIDAdd == 3">
                        <Select v-model="formValidateCreate.childSubCategoryID">
                            <Option v-for="item in childSubCategoryArr" :value="item.SubjectCategoryID" :key="item.SubjectCategoryName">{{ item.SubjectCategoryName }}</Option>
                        </Select>
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
          title="编辑课程"
          :mask-closable="false"
          ok-text="保存"
          >
            <div class="dialog-model-content">
                <Form ref="formValidateEdit" :model="formValidateEdit" label-position="top" :rules="ruleValidateEdit">
                    <FormItem label="课程名称" prop="formValiFullName" labelFor="formValiFullNameE">
                        <i-input v-model="formValidateEdit.formValiFullName" elementId="formValiFullNameE" clearable></i-input>
                    </FormItem>
                    <FormItem label="课程简称" prop="formValiName" labelFor="formValiNameE">
                        <i-input v-model="formValidateEdit.formValiName" elementId="formValiNameE" clearable></i-input>
                    </FormItem>
                    <FormItem label="所属学科" prop="disciplineID">
                        <Select v-model="formValidateEdit.disciplineID">
                            <Option v-for="item in disciplineArr" :value="item.DisciplineID" :key="item.DisciplineName" v-cloak>{{ item.DisciplineName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="课程类别" prop="subjectCategoryIDAdd">
                        <Select v-model="formValidateEdit.subjectCategoryIDAdd">
                            <Option v-for="item in subjectCategoryArr" :value="item.SubjectCategoryID" :key="item.SubjectCategoryName" v-cloak>{{ item.SubjectCategoryName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="选考学考" prop="subjectType" v-if="formValidateEdit.subjectCategoryIDAdd == 1">
                        <Select v-model="formValidateEdit.subjectType">
                            <Option v-for="item in subjectTypeArr" :value="item.ID" :key="item.Name" v-cloak>{{ item.Name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="校本分类" prop="childSubCategoryID" v-if="formValidateEdit.subjectCategoryIDAdd == 3">
                        <Select v-model="formValidateEdit.childSubCategoryID">
                            <Option v-for="item in childSubCategoryArr" :value="item.SubjectCategoryID" :key="item.SubjectCategoryName" v-cloak>{{ item.SubjectCategoryName }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="cancel">取消</Button>
            <Button class="xy-modal-primary" @click="editOk" shape="circle">确定</Button>
          </div>
        </Modal>
      </div>
      <XyUpfile ref="upfile"
        :modalTitle="title"
        :describeData="tipData"
        :fileFormt="formtData"
        :fileSize="size"
        :importPath="upUrl"
        :paramsData="upParams"
        :templateUrl="templateUrl"
        :errorUrl="errorUrl"
        @successLoad="loadTable"
        >
      </XyUpfile>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import XyUpfile from '@/components/upFile/XyUpfile.vue'
  export default {
    name: 'courseSet',
    components: {
      XyAntTable,
      XyUpfile
    },
    data () {
      return {
        modal_loading: false,
        loading: true,
        modalCreate: false, // 创建弹出框默认不展示
        modalImport: false, // 创建弹出框默认不展示
        isShowSpin: false,
        searchText: '',
        editId: '', // 要编辑的ID
        editName: '', // 要编辑的名称
        modalEdit: false,
        ids: '',
        subjectCategoryArr: [], // 获取
        childSubCategoryArr: [], // 获取
        subjectCategoryID: 0, // 切换头部
        childSubCategoryID: 0, // 切换头部
        // 导入
        uploadSuccess: false, // 上传成功
        uploadFail: false, // 上传失败
        uploadFailInfo: '', // 上传失败下载的文件
        isShowUpload: true, // 弹出框导入
        importResult: {},
        disciplineArr: [],
        subjectTypeArr: [
          { 'ID': 0, 'Name': '不设置' },
          { 'ID': 1, 'Name': '学考课程' },
          { 'ID': 2, 'Name': '选考课程' }
        ],
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: '课程名称',
            dataIndex: 'SubjectFullName',
            scopedSlots: { customRender: 'NameRender' }
          }, {
            title: '课程简称',
            dataIndex: 'SubjectName',
            minWidth: 200,
            scopedSlots: { customRender: 'SubjectNameRender' }
          }, {
            title: '所属学科',
            dataIndex: 'DisciplineName',
            minWidth: 150,
            scopedSlots: { customRender: 'DisciplineNameRender' }
          }, {
            title: '选考学考',
            dataIndex: 'SubjectTypeName',
            width: 100
          }, {
            title: '课程类别',
            dataIndex: 'SubjectCategoryName',
            width: 100
          }, {
            title: '校本分类',
            dataIndex: 'ChildSubjectCategoryName',
            minWidth: 150,
            scopedSlots: { customRender: 'ChildSubjectCategoryNameRender' }
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
        // 验证规则
        formValidateCreate: {
          formValiFullName: '',
          formValiName: '',
          disciplineID: '',
          subjectCategoryIDAdd: '',
          childSubCategoryID: '',
          subjectType: ''
        },
        ruleValidateCreate: {
          formValiFullName: [
            { required: true, message: '课程名称不能为空', trigger: 'blur' },
            { type: 'string', max: 100, message: '课程名称不能超过100字符', trigger: 'blur' }
          ],
          formValiName: [
            { required: true, message: '课程简称不能为空', trigger: 'blur' },
            { type: 'string', max: 100, message: '课程简称不能超过100字符', trigger: 'blur' }
          ],
          disciplineID: [
            { type: 'number', required: true, message: '所属学科不能为空', trigger: 'change' }
          ],
          subjectCategoryIDAdd: [
            { type: 'number', required: true, message: '课程类别不能为空', trigger: 'change' }
          ],
          childSubCategoryID: [
            { type: 'number', required: true, message: '校本分类不能为空', trigger: 'change' }
          ],
          subjectType: [
            { type: 'number', required: true, message: '选考学考不能为空', trigger: 'change' }
          ]
        },
        formValidateEdit: {
          formValiFullName: '',
          formValiName: '',
          disciplineID: '',
          subjectCategoryIDAdd: '',
          childSubCategoryID: '',
          subjectType: ''
        },
        ruleValidateEdit: {
          formValiFullName: [
            { required: true, message: '课程名称不能为空', trigger: 'blur' },
            { type: 'string', max: 100, message: '课程名称不能超过100字符', trigger: 'blur' }
          ],
          formValiName: [
            { required: true, message: '课程简称不能为空', trigger: 'blur' },
            { type: 'string', max: 100, message: '课程简称不能超过100字符', trigger: 'blur' }
          ],
          disciplineID: [
            { type: 'number', required: true, message: '所属学科不能为空', trigger: 'change' }
          ],
          subjectCategoryIDAdd: [
            { type: 'number', required: true, message: '课程类别不能为空', trigger: 'change' }
          ],
          childSubCategoryID: [
            { type: 'number', required: true, message: '校本分类不能为空', trigger: 'change' }
          ],
          subjectType: [
            { type: 'number', required: true, message: '选考学考不能为空', trigger: 'change' }
          ]
        },
        selectionAll: [],
        // 上传
        title: '批量导入',
        tipData: [],
        formtData: ['xls', 'xlsx'],
        size: 1024000,
        upUrl: this.$store.state.apiPath + '/api/Subject/Import',
        upParams: {},
        templateUrl: this.$store.state.apiPath + '/api/Subject/DownloadTemplate',
        errorUrl: this.$store.state.apiPath + '/api/Subject/DownloadException'
      }
    },
    created: function () {
      // 获取课程类别
      this.getSubjectCategoryType()
      // 获取所有校本分类
      this.getChildSubCategoryType()
      // 获取所有学科
      this.getAllDiscipline()
    },
    mounted: function () {
      this.$nextTick(function () {
        this.loadTable()
      })
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
          subjectCategoryID: this.subjectCategoryID,
          childSubCategoryID: this.childSubCategoryID,
          searchText: this.searchText,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/Subject/GetPage', params)
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
          console.log(res.data.data)
        }
        this.tableLoading = false
      },
      // 国家课程时---选考学考默认显示不设置
      subjectChange () {
        this.formValidateCreate.subjectType = this.subjectTypeArr[0].ID
      },
      // 获取下拉框中的数据
      async getSubjectCategoryType () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/SubjectCategory/GetSubjectCategoryType', null)
        if (res.success) {
          this.subjectCategoryArr = res.data
        }
      },
      async getChildSubCategoryType () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/SubjectCategory/GetAll', null)
        if (res.success) {
          this.childSubCategoryArr = res.data
        }
      },
      async getAllDiscipline () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/Discipline/GetAllDiscipline', null)
        if (res.success) {
          this.disciplineArr = res.data
        }
      },
      // 搜索
      subjectCategoryTypeChange: function (tId) {
        this.subjectCategoryID = tId
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 搜索
      childSubCategoryTypeChange: function (sId) {
        this.childSubCategoryID = sId
        this.pagination.current = 1
        this.pageIndex = 1
        this.loadTable()
      },
      // 提交创建触发
      changeLoading: function () {
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
              SubjectName: _this.formValidateCreate.formValiName.trim(),
              SubjectFullName: _this.formValidateCreate.formValiFullName.trim(),
              DisciplineID: _this.formValidateCreate.disciplineID,
              SubjectCategoryID: _this.formValidateCreate.subjectCategoryIDAdd,
              SubjectType: _this.formValidateCreate.subjectType || 0,
              ChildSubjectCategoryID: _this.formValidateCreate.childSubCategoryID || 0
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/Subject/Create`, params).then(res => {
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
        this.editId = row.SubjectID
        // 回写数据
        this.formValidateEdit.formValiName = row.SubjectName
        this.formValidateEdit.formValiFullName = row.SubjectFullName
        this.formValidateEdit.disciplineID = row.DisciplineID
        this.formValidateEdit.subjectCategoryIDAdd = row.SubjectCategoryType
        this.formValidateEdit.subjectType = row.SubjectType
        this.formValidateEdit.childSubCategoryID = row.ChildSubjectCategoryID
        this.modalEdit = true
      },
      // 确认编辑触发
      editOk () {
        var _this = this
        this.$refs.formValidateEdit.validate(function (valid) {
          if (!valid) {
            return false
          } else {
            // 国家课程
            if (_this.formValidateEdit.subjectCategoryIDAdd === 1) {
              _this.formValidateEdit.childSubCategoryID = 0
            } else if (_this.formValidateEdit.subjectCategoryIDAdd === 2) {
              _this.formValidateEdit.subjectType = 0
              _this.formValidateEdit.childSubCategoryID = 0
            } else if (_this.formValidateEdit.subjectCategoryIDAdd === 3) {
              _this.formValidateEdit.subjectType = 0
            }
            let params = {
              SubjectID: _this.editId,
              SubjectName: _this.formValidateEdit.formValiName.trim(),
              SubjectFullName: _this.formValidateEdit.formValiFullName.trim(),
              DisciplineID: _this.formValidateEdit.disciplineID,
              SubjectCategoryID: _this.formValidateEdit.subjectCategoryIDAdd,
              SubjectType: _this.formValidateEdit.subjectType || 0,
              ChildSubjectCategoryID: _this.formValidateEdit.childSubCategoryID || 0
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/Subject/Edit`, params).then(res => {
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
            _this.xy.post(`${_this.$store.state.apiPath}/api/Subject/Delete?subjectId=${id}`, null).then(res => {
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
            onOk: function () {
              var selectid = _this.selectionAll.map(item => {
                return item.SubjectID
              })
              _this.xy.post(`${_this.$store.state.apiPath}/api/Subject/DeleteByIds?subjectIds=${selectid.join(',')}`, null).then(res => {
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
        this.searchText = this.searchText
        this.loadTable()
      },
      // 导入校本课程
      ImportClick () {
        this.$refs['upfile'].modalImport = true
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
