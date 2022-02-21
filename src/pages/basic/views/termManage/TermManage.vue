// 学期管理
<template>
  <div class='xy-content-module'>
    <div class='xy-content-title xy-flex xy-between'>
      <Button class="xy-primary"  @click="modalCreate = true">创建学期</Button>
      <div>
        <span style="margin-right:5px;">所属学年：{{curAcademicYear ? curAcademicYearName : ''}}</span>
        <span style="margin-left:20px;">学年日期：{{this.xy.moment(new Date(Start)).format('YYYY-MM-DD')}} 至 {{this.xy.moment(new Date(End)).format('YYYY-MM-DD')}}</span>
      </div>
    </div>
    <div class='xy-content-body'>
      <XyAntTable
        :columns="columns"
        :dataSource="tableData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="900"
        >
        <span slot="AcademicSessionNameRender" slot-scope="text, record">
          <span class="table-el-hover" @click="edit(record)">
          {{text}}
          </span>
        </span>
        <span slot="StartRender" slot-scope="text, record">
          <span>
          {{xy.moment(new Date(record.StartDate)).format('YYYY-MM-DD')}}
          </span>
        </span>
        <span slot="EndRender" slot-scope="text, record">
          <span>
          {{xy.moment(new Date(record.EndDate)).format('YYYY-MM-DD')}}
          </span>
        </span>
        <span slot="termRender" slot-scope="text, record">
          <div>
            <Button size="small" @click="termManage(record)">编辑</Button>
          </div>
        </span>
        <span slot="oprateRender" slot-scope="text, record">
          <a @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a :disabled="record._disabled" @click="del(record.AcademicSessionID, record.AcademicSessionName)">删除</a>
        </span>
      </XyAntTable>
      <Modal
        v-model="modalCreate"
        :transfer="false"
        title="创建学期"
        :styles="{top: '150px'}"
        :mask-closable="false"
        @on-visible-change="cancelHandle"
        >
          <div class="dialog-model-content">
              <Form ref="formValidateOK" :model="formValidateOK" label-position="top" :rules="ruleValidateOK">
                  <FormItem label="学期名称" prop="academicSessionName" labelFor="academicSessionName">
                      <i-input v-model="formValidateOK.academicSessionName" elementId="academicSessionName" clearable :autofocus="true"></i-input>
                  </FormItem>
                  <FormItem label='起始日期' prop='academicSessionStart' labelFor="academicSessionStart">
                      <DatePicker v-model='formValidateOK.academicSessionStart' elementId="academicSessionStart" :options='options3' type='date' placeholder='请选择起始时间' :editable='false'></DatePicker>
                  </FormItem>
                  <FormItem label='截止日期' prop='academicSessionEnd' labelFor="academicSessionEnd">
                      <DatePicker v-model='formValidateOK.academicSessionEnd' elementId="academicSessionEnd" :options='options3' type='date' placeholder='请选择截止时间' :editable='false'></DatePicker>
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
        title="编辑学期"
        :mask-closable="false"
        @on-visible-change="cancelHandle"
        ok-text="保存"
        >
          <div class="dialog-model-content">
            <Form ref="formValidate" :model="formValidate" label-position="top" :rules="ruleValidate">
            <FormItem label="学期名称" prop="academicSessionName" labelFor="academicSessionNameE">
              <i-input v-model="formValidate.academicSessionName" elementId="academicSessionNameE" clearable></i-input>
            </FormItem>
            <FormItem label="起始日期" prop="academicSessionStart" labelFor="academicSessionStartE">
              <DatePicker v-model="formValidate.academicSessionStart" elementId="academicSessionStartE" type="date" placeholder="请选择起始时间" :editable="false" :options="options3"></DatePicker>
            </FormItem>
            <FormItem label="截止日期" prop="academicSessionEnd" labelFor="academicSessionEndE">
              <DatePicker v-model="formValidate.academicSessionEnd" elementId="academicSessionEndE" type="date" placeholder="请选择截止时间" :editable="false" :options="options3"></DatePicker>
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
    name: 'subjectSet',
    components: {
      XyAntTable
    },
    data () {
      return {
        modal_loading: false,
        loading: true,
        modalCreate: false, // 创建弹出框默认不展示
        editId: '', // 要编辑的ID
        modalEdit: false,
        isAdd: false,
        // antTable
        loadingTable: true,
        tableLoading: true,
        nullData: '您还没有学期的信息，请创建学期。',
        columns: [
          {
            title: '学期名称',
            dataIndex: 'AcademicSessionName',
            scopedSlots: { customRender: 'AcademicSessionNameRender' }
          },
          {
            title: '所属学年',
            width: 320,
            dataIndex: 'AcademicYearName'
          },
          {
            title: '起始日期',
            width: 150,
            scopedSlots: { customRender: 'StartRender' }
          },
          {
            title: '截止日期',
            width: 150,
            scopedSlots: { customRender: 'EndRender' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            scopedSlots: { customRender: 'oprateRender' },
            width: 120
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
        curAcademicYear: '',
        formValidateOK: {
          academicYearId: '',
          academicSessionName: '',
          academicSessionStart: null,
          academicSessionEnd: null
        },
        ruleValidateOK: {
          academicYearId: [
            { type: 'number', required: true, message: '请选择学年', trigger: 'change' }
          ],
          academicSessionName: [
            { required: true, message: '学期名称不能为空', trigger: 'blur' },
            { max: 20, message: '学期名称不能超过20个字', trigger: 'blur' }
          ],
          academicSessionStart: [
            { type: 'date', required: true, message: '起始日期不能为空', trigger: 'change' }
          ],
          academicSessionEnd: [
            { type: 'date', required: true, message: '截止日期不能为空', trigger: 'change' }
          ]
        },
        // 编辑的验证
        formValidate: {
          academicYearId: '',
          academicSessionName: '',
          academicSessionStart: '',
          academicSessionEnd: ''
        },
        options3: {},
        ruleValidate: {
          academicYearId: [
            { type: 'number', required: true, message: '请选择学年', trigger: 'change' }
          ],
          academicSessionName: [
            { required: true, message: '学期名称不能为空', trigger: 'blur' },
            { max: 20, message: '学期名称不能超过20个字', trigger: 'blur' }
          ],
          academicSessionStart: [
            { type: 'date', required: true, message: '起始日期不能为空', trigger: 'change' }
          ],
          academicSessionEnd: [
            { type: 'date', required: true, message: '截止日期不能为空', trigger: 'change' }
          ]
        },
        Start: '',
        End: '',
        curAcademicYearName: ''
      }
    },
    mounted () {
      this.curAcademicYearName = this.$route.query.Name
      this.curAcademicYear = this.$route.query.ID
      this.Start = this.$route.query.Start
      this.End = this.$route.query.End
      this.$nextTick(() => {
        this.options3 = {
          disabledDate: (date) => {
            return (date && date.valueOf() < new Date(this.Start)) || (date && date.valueOf() > new Date(this.End))
          }
        }
        this.loadTable()
      })
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      // 获取table分页数据
      async loadTable () {
        this.tableLoading = true
        let params = {
          yearID: this.curAcademicYear,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/AcademicSession/GetPage',
          params
        )
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
        }
        this.tableLoading = false
      },
      //  提交创建触发
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      ok () {
        this.$refs.formValidateOK.validate(valid => {
          if (!valid) {
            return this.changeLoading()
          } else {
            var m1 = this.xy.moment(new Date(this.formValidateOK.academicSessionStart)).format('YYYY-MM-DD')
            var m2 = this.xy.moment(new Date(this.formValidateOK.academicSessionEnd)).format('YYYY-MM-DD')
            var tempDays = this.xy.moment(m2).diff(this.xy.moment(m1), 'days')
            if (tempDays < 6) {
              this.xy.msgError('开始日期与结束日期间隔应大于7天。')
              return false
            } else {
              let params = {
                AcademicYearID: this.curAcademicYear,
                AcademicSessionName: this.formValidateOK.academicSessionName.trim(),
                StartDate: this.xy.moment(new Date(this.formValidateOK.academicSessionStart)).format('YYYY-MM-DD'),
                EndDate: this.xy.moment(new Date(this.formValidateOK.academicSessionEnd)).format('YYYY-MM-DD')
              }
              this.xy.post(`${this.$store.state.apiPath}/api/AcademicSession/Create`, params).then(res => {
                if (res.success) {
                  this.xy.msgSuc('创建成功。')
                  this.loadTable()
                  this.modalCreate = false
                  this.$refs.formValidateOK.resetFields()
                } else {
                  this.modalCreate = true
                }
              })
            }
          }
        })
      },
      //  关闭创建弹框触发
      cancelHandle () {
        if (!this.modalCreate) {
          this.$refs.formValidateOK.resetFields()
        }
        if (!this.modalEdit) {
          this.editId = ''
          this.$refs.formValidate.resetFields()
        }
      },
      cancel () {
        this.editId = ''
        this.modalCreate = false
        this.modalEdit = false
        this.$refs.formValidate.resetFields()
        this.$refs.formValidateOK.resetFields()
      },
      //  单击表格中编辑按钮触发
      edit (row) {
        // 状态判断  如果正在使用弹框提示  否则不用弹框可直接修改
        if (row._disabled) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>该学期正在使用，您确认要修改' + '吗？</p>',
            onOk: () => {
              this.editId = row.AcademicSessionID
              this.modalEdit = true
              this.formValidate.academicSessionName = row.AcademicSessionName
              this.formValidate.academicSessionStart = row.StartDate
              this.formValidate.academicSessionEnd = row.EndDate
              this.formValidate.academicYearId = row.AcademicYearID
            }
          })
        } else {
          this.editId = row.AcademicSessionID
          this.modalEdit = true
          this.formValidate.academicSessionName = row.AcademicSessionName
          this.formValidate.academicSessionStart = row.StartDate
          this.formValidate.academicSessionEnd = row.EndDate
          this.formValidate.academicYearId = row.AcademicYearID
        }
      },
      //  确认编辑触发
      editOk () {
        this.$refs.formValidate.validate(valid => {
          if (!valid) {
            return false
          } else {
            let params = {
              AcademicSessionID: this.editId,
              AcademicSessionName: this.formValidate.academicSessionName.trim(),
              AcademicYearID: this.formValidate.academicYearId,
              StartDate: this.xy.moment(new Date(this.formValidate.academicSessionStart)).format('YYYY-MM-DD'),
              EndDate: this.xy.moment(new Date(this.formValidate.academicSessionEnd)).format('YYYY-MM-DD')
            }
            this.xy.post(`${this.$store.state.apiPath}/api/AcademicSession/Edit`, params).then(res => {
              if (res.success) {
                this.xy.msgSuc('编辑成功。')
                this.loadTable()
                this.modalEdit = false
                this.$refs.formValidate.resetFields()
              }
            })
          }
        })
      },
      editCancel () {
        this.editId = ''
        this.modalEdit = false
        this.$refs.formValidate.resetFields()
      },
      //  单击删除单个内容触发
      del (id, name) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + name + '"吗？</p>',
          loading: true,
          onOk: () => {
            this.xy.post(`${this.$store.state.apiPath}/api/AcademicSession/Delete?sessionID=${id}`, null).then(res => {
              if (res.success) {
                this.$Modal.remove()
                this.xy.msgSuc('删除成功。')
                this.modal_loading = false
                if (this.tableData.length > 1) {
                  this.tableData.length = this.tableData.length - 1
                } else {
                  if (this.pageIndex > 1) {
                    this.pageIndex = this.pageIndex - 1
                    this.pagination.current = this.pageIndex
                  }
                }
                this.loadTable()
              }
            })
          }
        })
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
