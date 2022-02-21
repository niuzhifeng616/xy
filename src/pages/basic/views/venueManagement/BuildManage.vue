<template>
  <div class="xy-content-module">
      <div class="xy-content-title xy-flex xy-between">
        <div>
            <Button class="xy-primary" @click="modalCreate = true">创建楼宇</Button>
            <Button class="xy-danger" @click="delAll">批量删除</Button>
            <Button class="xy-info" @click="toType">编辑类别</Button>
        </div>
        <div class="xy-flex">
            <Select
              v-model="schoolChangeStr"
              @on-change="SchoolChange"
              class="xy-content-title-search"
              style="width:150px;"
              >
                <Option :value=0 >所有校区</Option>
                <Option v-for="school in venueSchool" :value="school.SchoolDistrictID" :key="school.SchoolDistrictName" v-cloak>{{ school.SchoolDistrictName }}</Option>
            </Select>
            <Select
              v-model="venueChangeStr"
              @on-change="venueChange"
              class="xy-content-title-search"
              style="width:150px;"
              >
                <Option :value=0>所有类别</Option>
                <Option v-for="types in venueTypes" :value="types.BuildingTypeID" :key="types.BuildingTypeName" v-cloak>{{ types.BuildingTypeName }}</Option>
            </Select>
            <i-input
              search
              v-model.trim="searchName"
              @on-search="FromSubmit"
              placeholder="请输入楼宇名称/简称"
              class="xy-content-title-search"
              style="width: 180px;"
              >
                <icon type="ios-search cursor-p" slot="suffix" />
            </i-input>
        </div>
      </div>
      <div class="xy-content-body">
        <Alert show-icon closable>启用楼宇，则其下的场室也会一并启用；停用楼宇，则其下的场室也会一并停用。</Alert>
        <XyAntTable
          :rowSelection="tableRowSelection"
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="1000"
          >
          <div slot="BuildingFullName" style="min-width:180px" slot-scope="text, record">
            <span class="table-el-hover" @click="edit(record)">
              {{ record.BuildingFullName}}
            </span>
          </div>
          <div slot="BuildingName" slot-scope="text, record">
            <div style="min-width:180px">
              {{ record.BuildingName}}
            </div>
          </div>
          <div slot="SchoolDistrictName" slot-scope="text, record">
            <div style="min-width:150px">
              {{ record.SchoolDistrictName}}
            </div>
          </div>
          <div slot="switch" slot-scope="text, record">
            <a-switch checked-children="启用" un-checked-children="停用" :checked="record.State" @change="switchFun(record)" />
          </div>
          <span slot="oprate" slot-scope="text, record">
            <a @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="record._disabled" @click="del(record)">删除</a>
          </span>
        </XyAntTable>
        <Modal
          v-model="modalCreate"
          :transfer="false"
          title="创建楼宇"
          :loading="loading"
          @on-visible-change="cancelHandle"
          :mask-closable="false"
          >
            <Form ref="formValidateOk" :model="formValidateOk" :rules="ruleValidateOk">
                <FormItem label="楼宇名称" labelFor="venueFullValue" prop="venueFullValue">
                    <i-input elementId="venueFullValue" v-model.trim="formValidateOk.venueFullValue" clearable></i-input>
                </FormItem>
                <FormItem label="楼宇简称" labelFor="venueValue" prop="venueValue">
                    <i-input elementId="venueValue" v-model.trim="formValidateOk.venueValue" clearable></i-input>
                </FormItem>
                <FormItem label="楼宇类别" prop="venueType">
                    <Select v-model="formValidateOk.venueType" @on-change="AddVenueTypeChangeID" multiple>
                        <Option v-for="types in venueTypes" :value="types.BuildingTypeID" :key="types.BuildingTypeName" v-cloak>{{ types.BuildingTypeName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="所属校区" prop="school">
                    <Select v-model="formValidateOk.school" @on-change="AddSchoolChangeID">
                        <Option v-for="school in venueSchool" :value="school.SchoolDistrictID" :key="school.SchoolDistrictName" v-cloak>{{ school.SchoolDistrictName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="地上楼层" style="display: flex" prop="upFloor">
                    共<input-number v-model="formValidateOk.upFloor" :min="0" style="margin:0px 8px;"></input-number>层
                </FormItem>
                <FormItem label="地下楼层" style="display: flex" prop="downFloor">
                    共<input-number v-model="formValidateOk.downFloor" :min="0" style="margin:0px 8px;"></input-number>层
                </FormItem>
                <div class="f12" style="color:#ccc;">注:如果是操场等平面场地，请输入地上共1层，地下共0层</div>
            </Form>
            <div slot="footer">
              <Button class="xy-modal-close" @click="cancel">取消</Button>
              <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
            </div>
        </Modal>
        <Modal
          v-model="modalEdit"
          :transfer="false"
          title="编辑楼宇"
          :loading="loading"
          @on-visible-change="cancelHandle"
          :mask-closable="false"
          >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                <FormItem label="楼宇名称" labelFor="venueFullValueE" prop="venueFullValue">
                    <i-input elementId="venueFullValueE" v-model.trim="formValidate.venueFullValue" clearable></i-input>
                </FormItem>
                <FormItem label="楼宇简称" labelFor="venueValueE" prop="venueValue">
                    <i-input elementId="venueValueE" v-model.trim="formValidate.venueValue" clearable></i-input>
                </FormItem>
                <FormItem label="楼宇类别" prop="venueType">
                    <Select
                      v-model="formValidate.venueType"
                      :label="formValidate.venueType"
                      @on-change="AddVenueTypeChangeID"
                      multiple
                      >
                        <Option v-for="types in venueTypes" :value="types.BuildingTypeID" :key="types.BuildingTypeName" v-cloak>{{ types.BuildingTypeName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="所属校区" prop="school">
                    <Select v-model="SchoolDistrictID" :label="formValidate.school" @on-change="AddSchoolChangeID">
                        <Option v-for="school in venueSchool" :value="school.SchoolDistrictID" :key="school.SchoolDistrictName" v-cloak>{{ school.SchoolDistrictName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="地上楼层" style="display: flex" prop="upFloor">
                    共<input-number v-model="formValidate.upFloor" :min="0" style="margin:0px 8px;"></input-number>层
                </FormItem>
                <FormItem label="地下楼层" style="display: flex" prop="downFloor">
                    共<input-number v-model="formValidate.downFloor" :min="0" style="margin:0px 8px;"></input-number>层
                </FormItem>
                <div class="f12" style="color:#ccc;">注:如果是操场等平面场地，请输入地上共1层，地下共0层</div>
            </Form>
            <div slot="footer">
              <Button class="xy-modal-close" @click="editCancel">取消</Button>
              <Button class="xy-modal-primary" @click="editOk" shape="circle">确定</Button>
            </div>
        </Modal>
      </div>
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
        schoolChangeStr: 0,
        venueChangeStr: 0,
        editId: '', // 要编辑的ID
        editName: '', // 要编辑的名称
        modalEdit: false,
        ids: '',
        IsUsed: true,
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: '楼宇名称',
            dataIndex: 'BuildingFullName',
            scopedSlots: { customRender: 'BuildingFullName' }
          }, {
            title: '楼宇简称',
            dataIndex: 'BuildingName',
            scopedSlots: { customRender: 'BuildingName' }
          },
          {
            title: '楼宇类别',
            dataIndex: 'BuildingTypeNames',
            width: 150
          },
          {
            title: '所属校区',
            key: 'SchoolDistrictName',
            dataIndex: 'SchoolDistrictName',
            scopedSlots: { customRender: 'SchoolDistrictName' }
          },
          {
            title: '状态',
            width: 100,
            dataIndex: 'switch',
            scopedSlots: { customRender: 'switch' }
          },
          {
            title: '操作',
            dataIndex: 'oprate',
            width: 120,
            scopedSlots: { customRender: 'oprate' }
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
        BuildingTypeIDs: [], // 获取的场馆类型数据
        SchoolDistrictID: '', // 校区ID
        venueTypes: [], // 获取到的所有场馆类别
        venueSchool: [], // 获取到所有校区
        formValidateOk: {
          venueFullValue: '',
          venueValue: '',
          venueType: [],
          school: '',
          upFloor: null,
          downFloor: null
        },
        ruleValidateOk: {
          venueFullValue: [
            { required: true, message: '楼宇名称不能为空', trigger: 'blur' },
            { type: 'string', max: 10, message: '楼宇名称不能超过10字符', trigger: 'blur' }
          ],
          venueValue: [
            { required: true, message: '楼宇简称不能为空', trigger: 'blur' },
            { type: 'string', max: 10, message: '楼宇简称不能超过10字符', trigger: 'blur' }
          ],
          venueType: [
            { type: 'array', required: true, message: '楼宇类别不能为空', trigger: 'change' }
          ],
          school: [
            { type: 'number', required: true, message: '所属校区不能为空', trigger: 'change' }
          ],
          upFloor: [
            { type: 'number', required: true, message: '地上层楼不能为空', trigger: 'change' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '地上层楼只能为整数', trigger: 'change' }

          ],
          downFloor: [
            { type: 'number', required: true, message: '地下层楼不能为空', trigger: 'change' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '地下层楼只能为整数', trigger: 'change' }

          ]
        },
        formValidate: {
          venueFullValue: '',
          venueValue: '',
          venueType: [],
          school: '',
          upFloor: null,
          downFloor: null
        },
        ruleValidate: {
          venueFullValue: [
            { required: true, message: '楼宇名称不能为空', trigger: 'blur' },
            { type: 'string', max: 10, message: '楼宇名称不能超过10字符', trigger: 'blur' }
          ],
          venueValue: [
            { required: true, message: '楼宇简称不能为空', trigger: 'blur' },
            { type: 'string', max: 10, message: '楼宇简称不能超过10字符', trigger: 'blur' }
          ],
          venueType: [
            { type: 'array', required: true, message: '楼宇类别不能为空', trigger: 'change' }
          ],
          school: [
            { type: 'string', required: true, message: '所属校区不能为空', trigger: 'change' }
          ],
          upFloor: [
            { type: 'number', required: true, message: '地上层楼不能为空', trigger: 'change' }
          ],
          downFloor: [
            { type: 'number', required: true, message: '地下层楼不能为空', trigger: 'change' }
          ]
        },
        selectionAll: []
      }
    },
    created: function () {
      // 获取所有楼宇类别
      this.getVenueTypes()
      // 获取所有校区
      this.getSchool()
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
    mounted: function () {
      this.$nextTick(function () {
        this.loadTable()
      })
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      //  获取table分页数据
      async loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let params = {
          name: this.searchName,
          schoolDistrictID: this.schoolChangeStr,
          buildingTypeID: this.venueChangeStr,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/Building/GetPage', params)
        if (res.success) {
          this.tableData = res.data.data
          this.tableData.map((item, index) => {
            this.$set(item, 'key', index)
          })
          this.pagination.total = res.data.totalRecords
        }
        this.tableLoading = false
      },
      // 获取下拉框中的数据
      async getVenueTypes () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/Building/GetTypeAll', null)
        if (res.success) {
          this.venueTypes = res.data
        }
      },
      async getSchool () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/SchoolDistrict/GetAll', null)
        if (res.success) {
          this.venueSchool = res.data.map(item => {
            return {
              SchoolDistrictID: item.SchoolDistrictID,
              SchoolDistrictName: item.SchoolDistrictName.length >= 10 ? `${item.SchoolDistrictName.substr(0, 9)}...` : item.SchoolDistrictName
            }
          })
        }
      },
      // 添加场馆：所选场馆类型ID
      AddVenueTypeChangeID (tId) {
        this.BuildingTypeIDs = tId
      },
      // 添加场馆：所选校区ID
      AddSchoolChangeID (sId) {
        this.SchoolDistrictID = sId
      },
      // 搜索
      venueChange (tId) {
        this.buildingTypeID = tId
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 搜索
      SchoolChange (sId) {
        this.schoolDistrictID = sId
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 提交创建触发
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      async switchFun (row) {
        let status = row.State
        let res = await this.xy.post(
          this.$store.state.apiPath + `/api/Building/SetState?id=${row.BuildingID}`, null)
        if (res.success) {
          if (status) {
            this.xy.msgSuc('已停用。')
          } else {
            this.xy.msgSuc('已启用。')
          }
          this.loadTable()
        } else {
          this.$Modal.error({ title: '错误信息', content: '该数据存在异常，无法操作。' })
        }
      },
      ok () {
        if (this.formValidateOk.upFloor === 0 && this.formValidateOk.downFloor === 0) {
          this.xy.msgError('地上楼层于地下楼层不能同时为0层。')
          this.changeLoading()
          return false
        }
        var _this = this
        this.$refs.formValidateOk.validate(function (valid) {
          console.log(valid)
          if (!valid) {
            return _this.changeLoading()
          } else {
            let params = {
              BuildingName: _this.formValidateOk.venueValue,
              BuildingFullName: _this.formValidateOk.venueFullValue,
              BuildingTypeIDs: _this.BuildingTypeIDs,
              SchoolDistrictID: _this.SchoolDistrictID,
              AboveGroundCount: _this.formValidateOk.upFloor,
              UnderGroundCount: _this.formValidateOk.downFloor
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/Building/Create`, params).then(res => {
              if (res.success) {
                _this.changeLoading()
                _this.xy.msgSuc('创建成功。')
                _this.loadTable()
                _this.modalCreate = false
                _this.$refs.formValidateOk.resetFields()
              }
            })
          }
        })
      },
      // 关闭创建/编辑弹框触发
      cancelHandle () {
        if (!this.modalCreate) {
          this.$refs.formValidateOk.resetFields()
        }
        if (!this.modalEdit) {
          this.$refs.formValidate.resetFields()
        }
      },
      cancel () {
        this.modalCreate = false
        this.$refs.formValidateOk.resetFields()
      },
      editCancel () {
        this.editId = ''
        this.modalEdit = false
        this.$refs.formValidate.resetFields()
      },
      // 单击表格中编辑按钮触发
      edit (row) {
        this.editId = row.BuildingID
        this.modalEdit = true
        // 场馆名称回写
        this.formValidate.venueFullValue = row.BuildingFullName
        this.formValidate.venueValue = row.BuildingName
        // 场馆类别回写
        this.formValidate.venueType = row.BuildingTypeIDs
        this.BuildingTypeIDs = row.BuildingTypeIDs
        // 校区回写
        this.formValidate.school = row.SchoolDistrictName
        this.SchoolDistrictID = row.SchoolDistrictID
        // 楼层回写
        this.formValidate.upFloor = row.AboveGroundCount
        this.formValidate.downFloor = row.UnderGroundCount
      },
      // 确认编辑触发
      editOk () {
        if (this.formValidate.upFloor === 0 && this.formValidate.downFloor === 0) {
          this.xy.msgError('地上楼层于地下楼层不能同时为0层。')
          this.changeLoading()
          return false
        }
        var _this = this
        this.$refs.formValidate.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            // 国家课程
            let params = {
              BuildingID: _this.editId,
              BuildingName: _this.formValidate.venueValue,
              BuildingFullName: _this.formValidate.venueFullValue,
              BuildingTypeIDs: _this.formValidate.venueType,
              SchoolDistrictID: _this.SchoolDistrictID,
              AboveGroundCount: _this.formValidate.upFloor,
              UnderGroundCount: _this.formValidate.downFloor
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/Building/Edit`, params).then(res => {
              if (res.success) {
                _this.changeLoading()
                _this.modal_loading = false
                _this.xy.msgSuc('编辑成功。')
                _this.loadTable()
                _this.modalEdit = false
                _this.$refs.formValidate.resetFields()
              }
            })
          }
        })
      },
      // 单击删除单个内容触发
      del (row) {
        console.log(row)
        var _this = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + row.BuildingName + '"吗？</p>',
          loading: true,
          onOk: function () {
            _this.xy.post(`${_this.$store.state.apiPath}/api/Building/Delete?id=${row.BuildingID}`, null).then(res => {
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
          _this.xy.msgError('请勾选要删除的楼宇。')
        } else {
          this.$Modal.confirm({
            title: '批量删除',
            content: '<p>您确定要删除选中的所有楼宇吗？</p>',
            onOk: function () {
              var selectid = _this.selectionAll.map(item => {
                return item.BuildingID
              })
              _this.xy.post(`${_this.$store.state.apiPath}/api/Building/DeleteByIDS?ids=${selectid.join(',')}`, null).then(res => {
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
        this.pageIndex = 1
        this.pagination.current = 1
        this.pageIndex = 1
        this.loadTable()
      },
      toType () {
        this.$store.commit('common/getThreeMenuName', '编辑类别')
        this.$router.push({
          path: 'BuildType',
          query: this.$store.state.common.menuInfo
        })
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
