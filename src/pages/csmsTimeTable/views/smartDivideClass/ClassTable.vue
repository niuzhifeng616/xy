<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary"
                @click="createClassTable"
                style="margin-right:10px">创建方案</Button>
        <Button class="xy-danger"
                @click="delAll">批量删除</Button>
      </div>
      <div class="fr pr">
        <i-select v-model="schoolDistrictID"
                  @on-change="schoolChange"
                  class="fl xy-content-title-search"
                  style="width:150px">
          <i-option :value="0"
                    key="01">所有校区</i-option>
          <i-option v-for="item in schoolData"
                    :value="item.SchoolDistrictID"
                    :key="item.SchoolDistrictID"
                    >{{ item.SchoolDistrictName }}</i-option>
        </i-select>
        <cascader :data="yearSessionData"
                  v-model="yearSession"
                  :clearable="false"
                  class="fl"
                  @on-change="cascaderChange"
                  style="margin-left: 15px;"></cascader>
        <a-input-search v-model.trim="searchText" placeholder="请输入方案名称" allowClear @search='FromSubmit' class="xy-content-title-search" style="width: auto;" />
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable :rowSelection="tableRowSelection"
                  :columns="columnss"
                  :dataSource="datatable"
                  nullData="该搜索条件下没有结果。"
                  :tableLoading="tableLoading"
                  :pagination="pagination"
                  @change="handleTableChange">
        <div slot="DivideClassName" slot-scope="text, record">
          <div style="min-width:250px" class="table-el-hover" @click="edit(record)">
            {{record.DivideClassName}}
          </div>
        </div>
        <div slot="SchoolDistrictName" slot-scope="text, record">
          <div style="min-width:100px">
            {{record.SchoolDistrictName}}
          </div>
        </div>
        <div slot="CreateByDate" slot-scope="text, record">
          <div>
            {{xy.moment(record.CreateByDate).format('YYYY-MM-DD')}}
          </div>
        </div>
        <div slot="IsPublished" slot-scope="text, record">
          <i class="iconfont icon-info" v-if="!record.IsPublished ">&#xe719;</i>
          <i class="iconfont icon-success" v-else>&#xe719;</i>
          <span> {{!record.IsPublished ? '进行中 ' : '已发布'}}</span>
        </div>
        <div slot="oprateRender" slot-scope="text, record">
          <a @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item :disabled="record.IsPublished" @click="del(record)">删除</a-menu-item>
              <a-menu-item  @click="copyClassTable(record)">复制</a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </XyAntTable>
      <modal v-model="modalCopy"
             :transfer="false"
             :mask-closable="false">
        <p slot="header">复制排课方案</p>
        <div class="dialog-model-content">
          <i-form ref="formValidate"
                  label-position="top"
                  :model="formValidate"
                  :rules="ruleValidate">
            <form-item label="排课名称"
                       prop="copyClassTableName"
                       label-for='copyClassTableName'>
              <i-input v-model="formValidate.copyClassTableName"
                       element-id='copyClassTableName'
                       clearable></i-input>
            </form-item>
            <form-item label="所属学年"
                       prop="copyClassTableYear">
              <i-select v-model="formValidate.copyClassTableYear"
                        :value="formValidate.copyClassTableYear"
                        @on-change="yearCopy"
                        :label="formValidate.copyClassTableYear"
                        placeholder="请选择学年">
                <i-option v-for="year in yearDataCopy"
                          :value="year.value"
                          :key="year.label"
                          >
                  {{ year.label }}
                </i-option>
              </i-select>
            </form-item>
            <form-item label="所属学期"
                       prop="copyClassTableSession">
              <i-select v-model="formValidate.copyClassTableSession"
                        :value="formValidate.copyClassTableSession"
                        @on-change="sessionCopy"
                        :label="formValidate.copyClassTableSession"
                        placeholder="请选择学期">
                <i-option v-for="session in sessionDataCopy"
                          :value="session.value"
                          :key="session.label"
                          >{{ session.label }}</i-option>
              </i-select>
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="copyCancel">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="copyOk">保存</Button>
        </div>
      </modal>

    </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: { XyAntTable },
    data () {
      return {
        selectedRowKeys: [],
        tableLoading: true,
        pagination: {
          total: 0,
          current: 1,
          pageSize: 15,
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        pageList: 0,
        selectionAll: [],
        datatable: [], // table数据
        columnss: [
          {
            title: '方案名称',
            dataIndex: 'DivideClassName',
            scopedSlots: { customRender: 'DivideClassName' }
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            scopedSlots: { customRender: 'SchoolDistrictName' }
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeNameForStudentYearName',
            width: 200
          },
          {
            title: '创建人',
            dataIndex: 'CreateByFullName',
            width: 200
          },
          {
            title: '创建时间',
            width: 120,
            dataIndex: 'CreateByDate',
            scopedSlots: { customRender: 'CreateByDate' }
          },
          {
            title: '状态',
            width: 120,
            scopedSlots: { customRender: 'IsPublished' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 140,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        // 复制排课方案
        modalCopy: false,
        copyObj: null,
        yearDataCopy: [],
        sessionDataCopy: [],
        formValidate: {
          copyClassTableName: '',
          copyClassTableYear: '',
          copyClassTableSession: ''
        },
        ruleValidate: {
          copyClassTableName: [
            {
              required: true,
              message: '排课任务名称不能为空',
              trigger: 'blur'
            },
            {
              max: 15,
              message: '排课任务名称不能超过15个字',
              trigger: 'blur'
            }
          ],
          copyClassTableYear: [{
            type: 'number',
            required: true,
            message: '请选择学年',
            trigger: 'change'
          }],
          copyClassTableSession: [{
            type: 'number',
            required: true,
            message: '请选择学期',
            trigger: 'change'
          }]
        },
        schoolDistrictID: 0,
        schoolData: [],
        yearSessionData: [],
        yearSession: [],
        searchText: '',
        loading: true,
        modalLog: false,
        logList: [],
        isRefresh: false
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
              disabled: record.IsPublished
            }
          })
        }
      }
    },
    created () {
      this.yearSessionData = [{
        value: '0',
        label: '所有学年',
        children: [{
          value: '0',
          label: '所有学期'
        }]
      }]
    },
    mounted () {
      this.getSchool()
    },
    methods: {
      handleTableChange () {
        this.getList()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 获取校区
      async getSchool () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        if (res.success) {
          this.schoolData = res.data
          this.getSessionNodeList()
        }
      },
      schoolChange (value) {
        this.pagination.current = 1
        this.SchoolDistrictID = value
        this.getList()
      },
      // 学年学期
      async getSessionNodeList () {
        this.yearSessionData = [{
          'label': '所有学年',
          'value': 0,
          'children': [{
            'value': 0,
            'label': '所有学期',
            'children': []
          }]
        }]
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          this.yearSessionData = this.yearSessionData.concat(res.data)
          this.yearSession = []
          let index = this.yearSessionData.map((item) => {
            return item.IsCurrent
          }).indexOf(true)
          if (index !== -1) {
            this.yearSession.push(this.yearSessionData[index].value)
            let index1 = this.yearSessionData[index].children.map((item) => {
              return item.IsCurrent
            }).indexOf(true)
            if (index1 !== -1) {
              this.yearSession.push(this.yearSessionData[index].children[index1].value)
            } else {
              this.yearSession = [0, 0]
            }
          } else {
            this.yearSession = [0, 0]
          }
          this.getList()
        }
      },
      cascaderChange (value) {
        this.pagination.current = 1
        this.yearSession = value
        this.getList()
      },
      // 获取table/分页数据
      async getList () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let obj = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          SchoolDistrictID: this.schoolDistrictID,
          AcademicSessionID: this.yearSession[1],
          SeachText: this.searchText,
          applicationID: this.$store.state.common.menuId.split(',')[0],
          applicationSubMenuID: this.$store.state.common.menuId.split(',')[1]
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetPage`, obj)
        if (res.success) {
          this.pagination.total = res.data.totalRecords
          this.datatable = res.data.data || []
          this.pageList = res.data.data.length
          this.datatable.map((item, index) => {
            this.$set(item, 'key', index)
          })
        }
        this.tableLoading = false
      },
      FromSubmit () {
        this.pagination.current = 1
        this.getList()
      },
      // 创建
      createClassTable () {
        this.$store.commit('csmstimetable/changeSmartRowObj', {})
        this.$router.push({ path: '/xyhome/smartStepsHeader', query: this.$store.state.common.menuInfo })
      },
      // 单击表格中编辑按钮触发
      edit (row) {
        this.$store.commit('csmstimetable/changeSmartRowObj', row)
        this.$router.push({ path: '/xyhome/smartStepsHeader', query: this.$store.state.common.menuInfo })
      },
      // 单击删除单个内容触发
      del (row) {
        if (!row.IsPublished) {
          let that = this
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除"' + row.DivideClassName + '"吗？',
            async onOk () {
              let idArr = row.DivideClassID
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/SelectDisciplineDivideClass/DeleteDivideClass`, { ids: idArr })
              if (res.success) {
                if (that.pageList > 1) {
                  that.pageList = that.pageList - 1
                } else {
                  if (that.pagination.current > 1) {
                    that.pagination.current = that.pagination.current - 1
                  }
                }
                that.xy.msgSuc('删除成功。')
                that.getList()
              }
            }
          })
        }
      },
      // 单击批量删除触发
      delAll () {
        let that = this
        let idsStr = []
        if (this.selectionAll.length < 1) {
          this.xy.msgError('请勾选要删除的选科方案。')
        } else {
          for (let i = 0; i < this.selectionAll.length; i++) {
            idsStr.push(this.selectionAll[i].DivideClassID)
          }
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除所选中的选科方案吗?',
            async onOk () {
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/SelectDisciplineDivideClass/DeleteDivideClass`, { ids: idsStr.join(',') })
              if (res.success) {
                that.xy.msgSuc('删除成功。')
                if (that.selectionAll.length === that.pageList && that.pagination.current > 1) {
                  that.pagination.current = that.pagination.current - 1
                }
                that.getList()
                that.selectionAll = []
                that.selectedRowKeys = []
              }
            }
          })
        };
      },

      // -------------------复制排课方案----------------------------
      copyClassTable (row) {
        this.modalCopy = true
        this.copyObj = row
        this.classTableID = row.DivideClassID
        this.formValidate.copyClassTableName = row.DivideClassName + '（1）'
        this.formValidate.copyClassTableYear = row.AcademicYearID
        this.formValidate.copyClassTableSession = row.AcademicSessionID
        this.copyGetYear()
      },
      async copyGetYear () {
        let that = this
        let res = await this.xy.get(`${this.xyApi}/xy/comm/YearList`)
        if (res.success) {
          that.yearDataCopy = []
          res.data.map(item => {
            that.yearDataCopy.push({
              value: item.ID,
              label: item.Name
            })
          })
          that.copyGetSession()
        }
      },
      async copyGetSession () {
        let that = this
        that.sessionID = 0
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SessionList`, {
          yearID: that.formValidate.copyClassTableYear
        })
        if (res.success) {
          that.sessionDataCopy = []
          res.data.map(item => {
            that.sessionDataCopy.push({
              value: item.AcademicSessionID,
              label: item.AcademicSessionName
            })
          })
        }
      },
      yearCopy (value) {
        this.formValidate.copyClassTableYear = value
        this.formValidate.copyClassTableSession = ''
        this.sessionDataCopy = []
        this.copyGetSession()
      },

      sessionCopy (value) {
        this.formValidate.copyClassTableSession = value
      },
      copyOk () {
        this.$refs.formValidate.validate((valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            this.copyHttp()
          }
        })
      },
      async copyHttp () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/CopyDivideClass`, {
          DivideClassID: this.classTableID,
          DivideClassName: this.formValidate.copyClassTableName,
          AcademicSessionID: this.formValidate.copyClassTableSession
        })
        if (res.success) {
          this.modalCopy = false
          this.xy.msgSuc('复制成功。')
          this.getList()
        }
        this.xy.unloading()
      },
      copyCancel () {
        let that = this
        that.modalCopy = false
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      }
    // ------------------复制排课方案完-----------------------
    }

  }
</script>
<style lang='less' scoped>
.iconfont{
  vertical-align: middle;
}
</style>
