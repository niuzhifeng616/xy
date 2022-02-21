
<template>
  <div class="xy-content-module">
    <div class="table-header clearfix xy-content-title ">
        <div class='fl'>
          <Button class="xy-primary" @click="openCreateCase">创建方案</Button>
        </div>
        <div style="float: right;" class="fr pr">
          <Select v-model="schoolId" @on-change="reLoadTable" placeholder="请选择校区"  style="display: inline-block;width:180px;"  class="fl xy-content-title-search">
            <Option :value="item.SchoolDistrictID" v-for="item in schoolList"
                    :key="item.SchoolDistrictID ">
              {{item.SchoolDistrictName}}
            </Option>
          </Select>
          <Select v-model="state" @on-change="reLoadTable" placeholder="请选择方案状态"  style="display: inline-block;width:180px;"  class="fl xy-content-title-search">
            <Option :value="0">全部</Option>
            <Option :value="item.ProgrammeState" v-for="item in stateList"
                    :key="item.ProgrammeState">
              {{item.ProgrammeStateName}}
            </Option>
          </Select>
        <i-col class="fr fl xy-content-title-search">
          <Input search
                 v-model.trim="searchText"
                 @on-search="reLoadTable"
                 placeholder="方案名称"
                 class="fr xy-content-title-search"/>
        </i-col>
      </div>
    </div>
    <div class="xy-content-body">
          <XyAntTable
            :columns="columns"
            :dataSource="data"
            :nullData="nullData"
            :tableLoading="tableLoading"
            :pagination="pagination"
            @change="handleTableChange"
            :scrollx="'max-content'"
            >
            <div style="min-width:200px" slot="SchoolAccessRecordRender" slot-scope="text, record">
              <span class="table-el-hover" @click="editContent(record.SchoolAccessRecordSettingID)">
                {{text}}
              </span>
            </div>
            <div style="min-width:150px" slot="SchoolDistrictNameRender" slot-scope="text, record">
                {{record.SchoolDistrictName}}
            </div>
            <div slot="CreateByDateRender" slot-scope="text, record">
                {{record.CreateByDate.slice(0, 16)}}
            </div>
            <span slot="StateRender" slot-scope="text, record">
              <span v-if="record.ProgrammeState===1"><i class="iconfont icon-success">&#xe719;</i>{{record.ProgrammeStateName}}</span>
              <span v-if="record.ProgrammeState===2"><i class="iconfont icon-wran">&#xe719;</i>{{record.ProgrammeStateName}}</span>
              <span v-if="record.ProgrammeState===3"><i class="iconfont icon-default">&#xe719;</i>{{record.ProgrammeStateName}}</span>
            </span>
            <span slot="oprateRender" slot-scope="text, record">
              <a :disabled="record.IsDefault"  @click="editContent(record.SchoolAccessRecordSettingID)">编辑</a>
              <a-divider type="vertical" />
              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  更多 <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="setDetail(record)">设置</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="delItem(record.SchoolAccessRecordSettingID)">删除</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </XyAntTable>
    </div>
    <Modal v-model="screenModel" class="screenModel" :title="createStatus ==='create' ? '创建方案' : '编辑方案'" width="500" :mask-closable="false" @on-visible-change="cancelHandle">
      <Form ref="caseForm" :model="caseForm" label-position="top" class="edit-form" :rules="caseRules">
        <FormItem label="方案名称" prop="caseName" labelFor="programName">
          <i-input v-model="caseForm.caseName" elementId="programName"></i-input>
        </FormItem>
        <FormItem label="校区" prop="school">
          <Select v-model="caseForm.school" placeholder="请选择校区"  :disabled="createStatus ==='create'? false : true">
            <Option :value="item.SchoolDistrictID" v-for="item in schoolList"
                    :key="item.SchoolDistrictID ">
              {{item.SchoolDistrictName}}
            </Option>
          </Select>
        </FormItem>

        <FormItem label="适用人群" prop="type">
          <RadioGroup v-model="caseForm.peopleType">
            <Radio :label="3">学生</Radio>
            <Radio :label="2">教职工</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="起止日期" prop="dateList" labelFor="time">
          <DatePicker type="daterange"
                      ref="formDate"
                      format="yyyy-MM-dd"
                      placeholder="开放时间"
                      separator=" ~ "
                      @on-change="handleChange"
                      @on-clear="handleClear"
                      v-model="caseForm.dateList"
                      :clearable="clearableTrue"
                      elementId="time"
                      >
          </DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
       <Button class="xy-modal-close" @click="cancel">取 消</Button>
       <Button class="xy-modal-primary" @click="saveCreate"  shape="circle">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'

  export default {
    name: 'SetList',
    components: {
      XyAntTable
    },
    data () {
      return {
        clearableTrue: true,
        schoolId: '',
        state: 0,
        searchText: '',
        // antTable
        selectedRowKeys: [],
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: '方案名称',
            dataIndex: 'SchoolAccessRecordSettingName',
            scopedSlots: { customRender: 'SchoolAccessRecordRender' }
          }, {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            scopedSlots: { customRender: 'SchoolDistrictNameRender' }
          }, {
            title: '适用人群',
            dataIndex: 'RoleName',
            width: 100
          }, {
            title: '创建人员',
            dataIndex: 'FullName',
            width: 100
          }, {
            title: '创建日期',
            dataIndex: 'CreateByDate',
            width: 160,
            scopedSlots: { customRender: 'CreateByDateRender' }
          }, {
            title: '起止日期',
            dataIndex: 'StartToEndDate',
            width: 190
          }, {
            title: '状态',
            dataIndex: 'ProgrammeStateName',
            width: 100,
            scopedSlots: { customRender: 'StateRender' }
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
        data: [],
        schoolList: [],
        stateList: [],
        createStatus: 'create',
        screenModel: false,
        caseForm: {
          caseId: '',
          caseName: '',
          peopleType: 3,
          school: '',
          dateList: []
        },
        caseRules: {
          caseName: [
            { required: true, message: '请填写名称', trigger: 'blur' },
            { max: 30, type: 'string', message: '最多30个字符', trigger: 'blur' }
          ],
          school: [
            { required: true, type: 'number', message: '请选择校区', trigger: 'change' }
          ],
          dateList: [ {
            required: true,
            type: 'array',
            message: '请选择日期',
            fields: {}
          }]
        },
        dotColorList: {
          1: '#52C41A',
          2: '#FAAD14',
          3: 'rgba(0,0,0, .25)'
        }
      }
    },
    created () {
      this.apiPath = this.xyApi + '/att'
      this.getSchoolDistrict()
      this.getCaseState()
    },
    methods: {
      handleTableChange () {
        this.getTableList()
      },
      async getTableList () {
        this.tableLoading = true
        let params = {
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          programmeName: this.searchText,
          schoolDistrictId: this.schoolId,
          programmeState: this.state
        }
        let rs = await this.xy.get(this.apiPath + '/api/ProgrammeSetting/GetProgrammePage', params)
        this.tableLoading = false
        if (rs.success) {
          this.total = rs.data.totalRecords
          this.pageList = rs.data.data.length
          this.data = rs.data.data
          this.pagination.total = rs.data.totalRecords
        }
      },
      // 搜索触发
      FromSubmit () {
        this.pageIndex = 1
        this.getTableList()
      },
      typeValueSearch () {
        this.pageIndex = 1
        this.getTableList()
      },
      openCreateCase (value) {
        this.screenModel = true
        this.createStatus = 'create'
        this.caseRules['dateList'][0].fields = {
          0: { trigger: 'blur', type: 'string', required: true, message: '请选择日期' },
          1: { trigger: 'blur', type: 'string', required: true, message: '请选择日期' }
        }
        this.caseForm = {
          caseId: '',
          caseName: '',
          peopleType: 3,
          school: this.schoolList[0].SchoolDistrictID,
          dateList: []
        }
      },
      editContent (id) {
        this.screenModel = true
        this.createStatus = 'edit'
        this.getCaseDetail(id)
      },
      delItem (id) {
        let params = {
          schoolAccessRecordSettingID: id
        }
        this.$Modal.confirm({
          title: '删除方案',
          content: '确定要删除所选中的出入校方案吗？',
          onOk: async () => {
            let rs = await this.xy.post(this.apiPath + '/api/ProgrammeSetting/ProgrammeDelete', params)
            if (rs.success) {
              if (this.pageList > 1) {
                this.pageList = this.pageList - 1
              } else {
                if (this.pageIndex > 1) {
                  this.pageIndex = this.pageIndex - 1
                  this.pagination.current = this.pagination.current - 1
                };
              };
              this.getTableList()
              this.xy.msgSuc('删除成功。')
            }
          },
          onCancel: function () {
          }
        })
      },
      setDetail (row) {
        let params = {
          id: row.SchoolAccessRecordSettingID,
          SchoolDistrictID: row.SchoolDistrictID,
          roleId: row.RoleID,
          caseTitle: row.SchoolAccessRecordSettingName
        }
        this.$store.commit('common/getThreeMenuName', row.SchoolAccessRecordSettingName)
        this.$store.commit('common/getParam', params)
        this.$router.push({
          path: '/xyHome/AccessSchool/SetDetail',
          query: this.$store.state.common.menuInfo
        })
      },
      cancel () {
        this.screenModel = false
        this.$refs.caseForm.resetFields()
      },
      handleChange (date) {
        this.caseRules['dateList'][0].fields = {
          0: { trigger: 'blur', type: 'string', required: true, message: '请选择日期' },
          1: { trigger: 'blur', type: 'string', required: true, message: '请选择日期' }
        }
        this.caseForm.dateList = date
      },
      handleClear () {
        this.$set(this.caseForm, 'dateList', [])
      },
      saveCreate () {
        this.$refs['caseForm'].validate((valid) => {
          if (valid) {
            if (this.createStatus === 'create') {
              this.createCase()
            } else {
              this.editCase()
            }
          }
        })
      },
      reLoadTable () {
        this.pagination.current = 1
        this.pageIndex = 1
        this.getTableList()
      },
      async createCase () {
        let params = {
          SchoolAccessRecordSettingName: this.caseForm.caseName,
          schoolDistrictId: this.caseForm.school,
          RoleID: this.caseForm.peopleType,
          StartDate: this.caseForm.dateList[0],
          EndDate: this.caseForm.dateList[1]
        }
        let rs = await this.xy.post(this.apiPath + '/api/ProgrammeSetting/CreateProgramme', params)
        if (rs.success) {
          this.xy.msgSuc('创建成功。')
          this.screenModel = false
          this.getTableList()
        }
      },
      async editCase () {
        let params = {
          SchoolAccessRecordSettingID: this.caseForm.caseId,
          SchoolAccessRecordSettingName: this.caseForm.caseName,
          schoolDistrictId: this.caseForm.school,
          RoleID: this.caseForm.peopleType,
          StartDate: this.caseForm.dateList[0],
          EndDate: this.caseForm.dateList[1]
        }
        let rs = await this.xy.post(this.apiPath + '/api/ProgrammeSetting/EditProgramme', params)
        if (rs.success) {
          this.xy.msgSuc('修改成功。')
          this.screenModel = false
          this.getTableList()
        }
      },
      async getCaseDetail (id) {
        this.caseRules['dateList'][0].fields = {
          0: { trigger: 'change', type: 'date', required: true, message: '请选择日期' },
          1: { trigger: 'change', type: 'date', required: true, message: '请选择日期' }
        }
        let params = {
          SchoolAccessRecordSettingID: id
        }
        let rs = await this.xy.get(this.apiPath + '/api/ProgrammeSetting/GetProgrammePageDetail', params)
        if (rs.success) {
          let res = rs.data
          this.caseForm = {
            caseId: res.SchoolAccessRecordSettingID,
            caseName: res.SchoolAccessRecordSettingName,
            peopleType: res.RoleID,
            school: res.SchoolDistrictID,
            dateList: [this.xy.moment(new Date(res.StartDate)).format('YYYY-MM-DD'), this.xy.moment(new Date(res.EndDate)).format('YYYY-MM-DD')]
          }
        }
      },
      // 获取校区
      async getSchoolDistrict () {
        let rs = await this.xy.get(this.xyApi + '/xy/comm/SchoolDistrictList')
        if (rs.success) {
          this.schoolList = rs.data
          this.schoolId = rs.data[0].SchoolDistrictID
          this.getTableList()
        }
      },
      async getCaseState () {
        let rs = await this.xy.get(this.apiPath + '/api/ProgrammeSetting/GetProgrammeState')
        if (rs.success) {
          this.stateList = rs.data
        }
      },
      cancelHandle () {
        if (!this.screenModel) {
          this.$refs.caseForm.resetFields()
        }
      }
    }
  }
</script>
<style lang="less">
  .table-wrap {
    .table-header {
      padding: 10px;
    }
    background: #fff;
    .case-state-dot {
      position: relative;
      width: 100%;
      padding-left: 10px;

      .dot {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #52C41A;
        position: absolute;
        left: 0;
        top: 5px;
      }
    }
  }

</style>
