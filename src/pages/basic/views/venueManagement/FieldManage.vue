// 场馆管理-场室管理
<template>
  <div class="xy-content-module">
      <!-- 面包屑 -->
      <div class="xy-content-title xy-flex xy-between">
        <div>
            <Button class="xy-primary"  type="primary" @click="modalCreate = true">创建场室</Button>
            <Button class="xy-info" @click="ImportClick">批量导入</Button>
            <Button class="xy-info" @click="toType">编辑类别</Button>
            <Button class="xy-danger" @click="delAll">批量删除</Button>
        </div>
        <div class="pr">
            <div class="fl xy-content-title-search pr">
                <cascader
                  v-model="defaultValue" style="width:260px"
                  :data="schoolVenueData"
                  :load-data="loadData"
                  :clearable="false"
                  change-on-select
                  filterable
                  not-found-text="暂无数据"
                  @on-change="cascaderFun"
                  >
                </cascader>
                <spin size="small" fix v-if="svShow"></spin>
            </div>
            <Select v-model="venueChangeStr" @on-change="venueChange" class="fl xy-content-title-search" style="width:150px">
                <Option :value="0">所有类别</Option>
                <Option v-for="types in houseTypes" :value="types.HouseTypeID" :key="types.HouseTypeID" v-cloak>{{ types.HouseTypeName }}</Option>
            </Select>
            <i-input
              search
              v-model.trim="searchName"
              @on-search="FromSubmit"
              placeholder="请输入场室名称或简称"
              class="fr xy-content-title-search"
              style="width: auto"
              >
                <icon type="ios-search cursor-p" slot="suffix" />
            </i-input>
        </div>
      </div>
      <div class="xy-content-body">
        <Alert show-icon closable>对学校的场室进行管理，您不可以删除已被使用的场室。</Alert>
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
          <div slot="BuildingFullNameRender" style="min-width:190px" slot-scope="text, record">
            <span class="table-el-hover" @click="edit(record)">
              {{ text}}
            </span>
          </div>
          <div slot="BuildingNameRender" slot-scope="text, record">
            <div style="min-width:180px">
              {{ record.HouseName}}
            </div>
          </div>
          <div slot="SchoolDistrictNameRender" slot-scope="text, record">
            <div style="min-width:160px">
              {{ record.SchoolDistrictName}}
            </div>
          </div>
          <div slot="switchRender" slot-scope="text, record">
            <a-switch checked-children="启用" un-checked-children="停用" :checked="record.State" @change="switchFun(record.HouseID)" />
          </div>
          <span slot="oprateRender" slot-scope="text, record">
            <a @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="record._disabled" @click="del(record.HouseID, record.HouseName)">删除</a>
          </span>
        </XyAntTable>
        <Modal
          v-model="modalCreate"
          :transfer="false"
          width="570"
          title="创建场室"
          @on-visible-change="watchCancel"
          :loading="loading"
          :mask-closable="false"
          >
            <i-form ref="formValidateOk" label-position="top" :model="formValidateOk" :rules="ruleValidateOk">
                <form-item label="场室名称" labelFor="houseFullValue" prop="houseFullValue">
                    <i-input elementId="houseFullValue" v-model.trim="formValidateOk.houseFullValue" clearable></i-input>
                </form-item>
                <form-item label="场室简称" labelFor="houseValue" prop="houseValue">
                    <i-input elementId="houseValue" v-model.trim="formValidateOk.houseValue" clearable></i-input>
                </form-item>
                <form-item label="编号" labelFor="houseNumber" prop="houseNumber">
                    <tooltip style="float:left;margin-top:-6%;margin-left: 35px" word-wrap max-width="400" placement="right" content="限用字母和数字，同一校区的场室编号不允许重复。">
                        <Icon type="md-help-circle" size="18" color="#ffad33" />
                    </tooltip>
                    <i-input elementId="houseNumber" v-model="formValidateOk.houseNumber" clearable></i-input>
                </form-item>
                <form-item label="类别" prop="houseTypeNameID">
                    <i-select v-model="formValidateOk.houseTypeNameID" @on-change="vaildHouseTypeChangeCreate">
                        <i-option v-for="types in houseTypes" :value="types.HouseTypeID" :key="types.HouseTypeID" v-cloak>{{ types.HouseTypeName }}</i-option>
                    </i-select>
                </form-item>
                <form-item label="容纳人数" labelFor="houseNumPeople" prop="houseNumPeople">
                    <i-input elementId="houseNumPeople" v-model="formValidateOk.houseNumPeople" clearable></i-input>
                </form-item>
                <form-item label="校区/楼宇" prop="houseVenueSchool">
                    <cascader
                      v-model="formValidateOk.houseVenueSchool"
                      :data="editschoolVenueData"
                      :load-data="loadData"
                      change-on-select
                      filterable
                      not-found-text="暂无数据"
                      @on-change="validCascaderFun"
                      >
                    </cascader>
                </form-item>
                <form-item label="所在楼层" prop="houseFloor">
                    <i-select v-model="formValidateOk.houseFloor" @on-change="floorChange">
                        <i-option v-for="floorItem in floorList" :value="floorItem" :key="floorItem" v-cloak>{{ floorItem }}</i-option>
                    </i-select>
                </form-item>
            </i-form>
            <div slot="footer">
              <Button class="xy-modal-close" @click="cancel">取消</Button>
              <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
            </div>
        </Modal>
        <Modal
          v-model="modalEdit"
          width="570"
          :transfer="false"
          title="编辑场室"
          :loading="loading"
          @on-visible-change="watchEditCancel"
          :mask-closable="false"
          >
            <i-form ref="formValidate" label-position="top" :model="formValidate" :rules="ruleValidate">
                <form-item label="场室名称" labelFor="houseFullValueE" prop="houseFullValue">
                    <i-input elementId="houseFullValueE" v-model.trim="formValidate.houseFullValue" clearable></i-input>
                </form-item>
                <form-item label="场室简称" labelFor="houseValueE" prop="houseValue">
                    <i-input elementId="houseValueE" v-model.trim="formValidate.houseValue" clearable></i-input>
                </form-item>
                <form-item label="编号" labelFor="houseNumberE" prop="houseNumber">
                    <i-input elementId="houseNumberE" v-model="formValidate.houseNumber" clearable maxLength="20"></i-input>
                    <tooltip style="position: absolute;left: 6%;top: -100%;" word-wrap max-width="200" placement="top" content="限用字母和数字，同一校区的场室编号不允许重复。">
                        <Icon type="md-help-circle" size="18" color="#ffad33" />
                    </tooltip>
                </form-item>
                <form-item label="类别" prop="houseTypeNameID">
                    <i-select v-model="formValidate.houseTypeNameID" @on-change="vaildHouseTypeChange">
                        <i-option v-for="types in houseTypes" :value="types.HouseTypeID" :key="types.HouseTypeID" v-cloak>{{ types.HouseTypeName }}</i-option>
                    </i-select>
                </form-item>
                <form-item label="容纳人数" labelFor="houseNumPeopleE" prop="houseNumPeople">
                    <i-input elementId="houseNumPeopleE" v-model="formValidate.houseNumPeople" clearable></i-input>
                </form-item>
                <form-item label="校区/楼宇" prop="houseVenueSchool">
                    <cascader
                      v-model="formValidate.houseVenueSchool"
                      :label="formValidate.houseVenueSchool"
                      :data="editschoolVenueData"
                      :load-data="loadData"
                      change-on-select
                      filterable
                      not-found-text="暂无数据"
                      @on-change="validCascaderFunCreate"
                      >
                    </cascader>
                </form-item>
                <form-item label="所在楼层" prop="houseFloor">
                    <i-select v-model="formValidate.houseFloor" @on-change="floorChange">
                        <i-option v-for="floorItem in floorList" :value="floorItem" :key="floorItem" v-cloak>{{ floorItem }}</i-option>
                    </i-select>
                </form-item>
            </i-form>
            <div slot="footer">
              <Button class="xy-modal-close" @click="editCancel">取消</Button>
              <Button class="xy-modal-primary" @click="editOk" shape="circle">确定</Button>
            </div>
        </Modal>
      </div>
      <XyUpfile
        ref="upfile"
        :modalTitle="title"
        :describeData="tipData"
        :fileFormt="formtData"
        :fileSize="size"
        :importPath="upUrl"
        :paramsData="upParams"
        :templateUrl="templateUrl"
        :errorUrl="errorUrl"
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
    inject: ['reload'],
    data () {
      return {
        modal_loading: false,
        loading: true,
        modalCreate: false,
        editId: '', // 要编辑的ID
        editName: '', // 要编辑的名称
        modalEdit: false,
        svShow: false,
        searchName: '',
        schoolVenueData: [],
        defaultValue: [0, 0],
        houseTypes: [],
        venueChangeStr: 0,
        schoolChangeStr: 0,
        // 1
        buildingChangeStr: 0,
        typeChangeStr: 0,
        // 1-
        housetypeid: 0,
        // 6
        houseTypeidEidt: 0,
        houseTypeNameId: 0,
        // 6
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: '场室名称',
            dataIndex: 'HouseFullName',
            scopedSlots: { customRender: 'BuildingFullNameRender' }
          }, {
            title: '场室简称',
            dataIndex: 'HouseName',
            scopedSlots: { customRender: 'BuildingNameRender' }
          },
          {
            title: '场室类别',
            dataIndex: 'HousetypeName',
            width: 160
          },
          {
            title: '所属楼宇',
            dataIndex: 'BuildingName',
            width: 200
          },
          {
            title: '所属校区',
            dataIndex: 'SchoolDistrictName',
            scopedSlots: { customRender: 'SchoolDistrictNameRender' }
          },
          {
            title: '状态',
            width: 100,
            scopedSlots: { customRender: 'switchRender' }
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
        selectionAll: [],
        // 上传
        title: '批量导入',
        tipData: [],
        formtData: ['xls', 'xlsx'],
        size: 1024000,
        upUrl: this.$store.state.apiPath + '/api/House/ImportHouses',
        upParams: {},
        templateUrl: this.$store.state.apiPath + '/api/House/DownloadTemplate',
        errorUrl: this.$store.state.apiPath + '/api/House/DownloadException',
        // add&edit
        editschoolVenueData: [],
        floorList: [],
        formValidateOk: {
          houseFullValue: '',
          houseValue: '',
          houseNumber: '',
          houseTypeNameID: '',
          houseNumPeople: '',
          houseVenueSchool: [0, 0],
          houseFloor: ''
        },
        ruleValidateOk: {
          houseFullValue: [
            { required: true, message: '场室名称不能为空', trigger: 'blur' },
            { max: 10, message: '场室名称不能超过10字符', trigger: 'blur' }
          ],
          houseValue: [
            { required: true, message: '场室简称不能为空', trigger: 'blur' },
            { max: 10, message: '场室简称不能超过10字符', trigger: 'blur' }
          ],
          houseNumber: [
            { max: 10, message: '场室编号不能超过10字符', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z]+$/, message: '场室编号仅允许使用字母或数字', trigger: 'blur' }
          ],
          houseTypeNameID: [
            { type: 'number', required: true, message: '场室类别不能为空', trigger: 'change' }
          ],
          houseNumPeople: [
            { pattern: /^[1-9]\d*$/, message: '容纳人数必须正整数', trigger: 'blur' },
            { max: 5, message: '容纳人数不能超过99999', trigger: 'blur' }
          ],
          houseVenueSchool: [
            { type: 'array', len: 2, required: true, message: '所属楼宇不能为空', trigger: 'change' }
          ],
          houseFloor: [
            { required: true, message: '所在楼层不能为空', trigger: 'change' }
          ]
        },
        hoursePageIndex: '',
        searchValue: '',
        formValidate: {
          houseFullValue: '',
          houseValue: '',
          houseNumber: '',
          houseTypeNameID: '',
          houseNumPeople: '',
          houseVenueSchool: [0, 0],
          houseFloor: ''
        },
        ruleValidate: {
          houseFullValue: [
            { required: true, message: '场室名称不能为空', trigger: 'blur' },
            { max: 10, message: '场室名称不能超过10字符', trigger: 'blur' }
          ],
          houseValue: [
            { required: true, message: '场室简称不能为空', trigger: 'blur' },
            { max: 10, message: '场室简称不能超过10字符', trigger: 'blur' }
          ],
          houseNumber: [
            { max: 10, message: '场室编号不能超过10字符', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z]+$/, message: '场室编号仅允许使用字母或数字', trigger: 'blur' }
          ],
          houseTypeNameID: [
            { type: 'number', required: true, message: '场室类别不能为空', trigger: 'change' }
          ],
          houseNumPeople: [
            { pattern: /^\+?[1-9][0-9]*$/, message: '容纳人数请填写正整数', trigger: 'blur' }
          ],
          houseVenueSchool: [
            { type: 'array', len: 2, required: true, message: '所属楼宇不能为空', trigger: 'change' }
          ],
          houseFloor: [
            { required: true, message: '所在楼层不能为空', trigger: 'change' }
          ]
        }
      }
    },
    created: function () {
      this.getSchool()
      this.getTypes()
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
          schoolDistrictID: this.defaultValue[0],
          buildingID: this.defaultValue[1],
          houseTypeID: this.venueChangeStr,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/House/GetPage', params)
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
      async getSchool () {
        let that = this
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/SchoolDistrict/GetAll', null)
        if (res.success) {
          that.schoolVenueData.push({
            value: 0,
            label: '所有校区',
            children: [{
              value: 0,
              label: '所有楼宇'
            }],
            loading: false
          })
          that.editschoolVenueData.push({
            value: 0,
            label: '所有校区',
            children: [{
              value: 0,
              label: '所有楼宇'
            }],
            loading: false
          })
          $.each(res.data, (index, item) => {
            that.schoolVenueData.push({
              value: item.SchoolDistrictID,
              label: item.SchoolDistrictName.length >= 10 ? `${item.SchoolDistrictName.substr(0, 5)}...` : item.SchoolDistrictName,
              children: [],
              loading: false
            })
            that.editschoolVenueData.push({
              value: item.SchoolDistrictID,
              label: item.SchoolDistrictName,
              children: [],
              loading: false
            })
          })
        }
      },
      async getTypes () {
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/House/GetTypeAll', null)
        if (res.success) {
          this.houseTypes = res.data.map(item => {
            return {
              HouseTypeID: item.HouseTypeID,
              HouseTypeName: item.HouseTypeName.length >= 10 ? `${item.HouseTypeName.substr(0, 5)}...` : item.HouseTypeName
            }
          })
          this.svShow = false
          this.venueChangeStr = this.housetypeid || 0
        }
      },
      async loadData (item, callback, row) {
        this.xy.loading()
        item.loading = true
        var that = this
        let res = await this.xy.get(this.$store.state.apiPath + `/api/Building/GetBySchool?schoolid=${item.value}`, null)
        if (res.success) {
          this.xy.unloading()
          if (res.data.length < 1) {
            item.children.push({
              value: '',
              label: '暂无数据',
              disabled: true
            })
          } else {
            $.each(res.data, function (index, items) {
              if (items.State) {
                item.children.push({
                  value: items.BuildingID,
                  label: items.BuildingName
                })
              }
            })
            if (that.modalEdit && Object.keys('editModel').length !== 0) {
              console.log(item)
              that.formValidate.houseVenueSchool = [row.SchoolDistrictID, row.BuildingID]
            }
          }
          item.loading = false
          callback()
        }
      },
      validCascaderFun (values) {
        this.formValidateOk.houseVenueSchool = values
        this.floorList = []
        if (values.length === 2) {
          this.xy.loading()
          this.xy.get(`${this.$store.state.apiPath}/api/House/GetBuildingFloor?BuildingID=${values[1]}`, null).then(res => {
            if (res.success) {
              this.xy.unloading()
              this.floorList = res.data
            }
          })
        }
      },
      cascaderFun (value) {
        if (value.length === 1) {
          this.defaultValue[0] = value[0]
          this.defaultValue[1] = 0
        } else if (value.length === 2) {
          this.defaultValue[0] = value[0]
          this.defaultValue[1] = value[1]
        } else {
          return
        }
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 搜索
      venueChange (tId) {
        this.houseTypeID = tId
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      vaildHouseTypeChange (values) {
        this.formValidate.houseTypeNameID = values
      },
      validCascaderFunCreate (values) {
        this.formValidate.houseVenueSchool = values
        this.formValidate.houseFloor = ''
        this.floorList = []
        if (values.length === 2) {
          this.xy.loading()
          this.xy.get(`${this.$store.state.apiPath}/api/House/GetBuildingFloor?BuildingID=${values[1]}`, null).then(res => {
            if (res.success) {
              this.floorList = res.data
              this.xy.unloading()
            }
          })
        }
      },
      // 提交创建触发
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      async switchFun (HouseID) {
        let res = await this.xy.post(
          this.$store.state.apiPath + `/api/House/SetState?id=${HouseID}`, null)
        if (res.success) {
          this.xy.msgSuc('操作成功。')
          this.reload()
        } else {
          this.xy.msgError(res.msg)
        }
        this.loadTable()
      },
      // 单击删除单个内容触发
      del (id, name) {
        var _this = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + name + '"吗？</p>',
          loading: true,
          onOk: function () {
            _this.xy.post(`${_this.$store.state.apiPath}/api/House/Delete?id=${id}`, null).then(res => {
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
          _this.xy.msgError('请勾选要删除的场室。')
        } else {
          this.$Modal.confirm({
            title: '批量删除',
            content: '<p>您确认要删除选中的所有场室吗？</p>',
            onOk: function () {
              var selectid = _this.selectionAll.map(item => {
                return item.HouseID
              })
              _this.xy.post(`${_this.$store.state.apiPath}/api/House/DeleteByIDS?ids=${selectid.join(',')}`, null).then(res => {
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
        }
      },
      vaildHouseTypeChangeCreate (values) {
        this.formValidateOk.houseTypeNameID = values
      },
      floorChange (values) {
        this.formValidateOk.houseFloor = values
      },
      // 搜索触发
      FromSubmit () {
        this.pagination.current = 1
        this.pageIndex = 1
        this.loadTable()
      },
      toType () {
        this.$store.commit('common/getThreeMenuName', '编辑类别')
        this.$router.push({
          path: 'FieldType',
          query: this.$store.state.common.menuInfo
        })
      },
      ok () {
        var _this = this
        this.$refs.formValidateOk.validate(function (valid) {
          console.log(valid)
          if (!valid) {
            return _this.changeLoading()
          } else {
            let params = {
              HouseName: _this.formValidateOk.houseValue,
              HouseFullName: _this.formValidateOk.houseFullValue,
              Housenumber: _this.formValidateOk.houseNumber,
              HousetypeID: _this.formValidateOk.houseTypeNameID,
              Volume: _this.formValidateOk.houseNumPeople,
              SchoolDistrictID: _this.formValidateOk.houseVenueSchool[0],
              BuildingID: _this.formValidateOk.houseVenueSchool[1],
              Floor: _this.formValidateOk.houseFloor
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/House/Create`, params).then(res => {
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
      watchCancel () {
        if (!this.modalCreate) { this.$refs.formValidateOk.resetFields() }
      },
      cancel () {
        this.modalCreate = false
        this.$refs.formValidateOk.resetFields()
      },
      watchEditCancel () {
        if (!this.modalEdit) { this.$refs.formValidate.resetFields() }
      },
      editCancel () {
        this.editId = ''
        this.modalEdit = false
        this.$refs.formValidate.resetFields()
      },
      // 单击表格中编辑按钮触发
      edit (row) {
        this.formValidate.houseFullValue = row.HouseFullName
        this.formValidate.houseValue = row.HouseName
        this.formValidate.houseNumber = row.Housenumber
        this.formValidate.houseTypeNameID = row.HousetypeID
        this.formValidate.houseNumPeople = row.Volume
        this.formValidate.houseVenueSchool = [row.SchoolDistrictID, row.BuildingID]
        this.formValidate.houseFloor = row.Floor
        this.editId = row.HouseID
        this.modalEdit = true
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/House/GetBuildingFloor?BuildingID=${row.BuildingID}`, null).then(res => {
          if (res.success) {
            this.xy.unloading()
            this.floorList = res.data
          }
        })
      },
      // 确认编辑触发
      editOk () {
        var _this = this
        this.$refs.formValidate.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            // 国家课程
            let params = {
              HouseID: _this.editId,
              HouseName: _this.formValidate.houseValue,
              HouseFullName: _this.formValidate.houseFullValue,
              Housenumber: _this.formValidate.houseNumber,
              HousetypeID: _this.formValidate.houseTypeNameID,
              Volume: _this.formValidate.houseNumPeople,
              SchoolDistrictID: _this.formValidate.houseVenueSchool[0],
              BuildingID: _this.formValidate.houseVenueSchool[1],
              Floor: _this.formValidate.houseFloor
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/House/Edit`, params).then(res => {
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
      // 导入
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
