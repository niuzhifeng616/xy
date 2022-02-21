//  学年管理
<template>
  <div class='xy-content-module'>
    <!-- 面包屑 -->
    <div class='xy-content-title'>
      <Button class="xy-primary" @click='modalCreate = true'>创建学年</Button>
    </div>
    <div class='xy-content-body'>
      <Alert show-icon closable>学年起止日期不能与其他学年重合，您不可以删除已被使用的学年。</Alert>
      <XyAntTable
        :columns="columns"
        :dataSource="tableData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
        <span slot="NameRender" slot-scope="text, record">
          <span class="table-el-hover" @click="edit(record.ID, record.Name, record.Start, record.End, record.IsUse)">
          {{text}}
          </span>
        </span>
        <span slot="StartRender" slot-scope="text, record">
          <span>
          {{xy.moment(new Date(record.Start)).format('YYYY-MM-DD')}}
          </span>
        </span>
        <span slot="EndRender" slot-scope="text, record">
          <span>
          {{xy.moment(new Date(record.End)).format('YYYY-MM-DD')}}
          </span>
        </span>
        <span slot="termRender" slot-scope="text, record">
          <div>
            <Button size="small" @click="termManage(record)">编辑</Button>
          </div>
        </span>
        <span slot="oprateRender" slot-scope="text, record">
          <a @click="edit(record.ID, record.Name, record.Start, record.End, record.IsUse)">编辑</a>
          <a-divider type="vertical" />
          <a :disabled="record.IsUse" @click="del(record.ID, record.Name)">删除</a>
        </span>
      </XyAntTable>
      <Modal
        v-model='modalCreate'
        :transfer='false'
        title='创建学年'
        :loading='loading'
        :mask-closable='false'
        @on-visible-change='clearData'
        ok-text='保存'
        >
        <div class='dialog-model-content'>
            <Form ref='formValidateOK' :model='formValidateOK' label-position="top" :rules='ruleValidateOK'>
                <FormItem label='学年名称' labelFor="academicYearName" prop='academicYearName'>
                    <i-input v-model='formValidateOK.academicYearName' elementId="academicYearName" clearable></i-input>
                </FormItem>
                <FormItem label='起始日期' labelFor="academicYearStart" prop='academicYearStart'>
                    <DatePicker v-model='formValidateOK.academicYearStart' elementId="academicYearStart" :options='options' type='date' placeholder='请选择起始时间' :editable='false'></DatePicker>
                </FormItem>
                <FormItem label='截止日期' labelFor="academicYearEnd" prop='academicYearEnd'>
                    <DatePicker v-model='formValidateOK.academicYearEnd' elementId="academicYearEnd" :options='options' type='date' placeholder='请选择截止时间' :editable='false'></DatePicker>
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
        title='编辑学年'
        :loading='loading'
        :mask-closable='false'
        ok-text='保存'
        >
        <div class='dialog-model-content'>
            <Form ref='formValidate' :model='formValidate' label-position="top" :rules='ruleValidate'>
                <FormItem label='学年名称' prop='academicYearName' labelFor="academicYearNameE">
                    <i-input v-model='formValidate.academicYearName' elementId="academicYearNameE" clearable></i-input>
                </FormItem>
                <FormItem label='起始日期' prop='academicYearStart' labelFor="academicYearStartE">
                    <DatePicker v-model='formValidate.academicYearStart' elementId="academicYearStartE" type='date'  placeholder='请选择起始时间' :editable='false'></DatePicker>
                </FormItem>
                <FormItem label='截止日期' prop='academicYearEnd' labelFor="academicYearEndE">
                    <DatePicker v-model='formValidate.academicYearEnd' elementId="academicYearEndE" type='date'  placeholder='请选择截止时间' :editable='false'></DatePicker>
                </FormItem>
            </Form>
        </div>
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
        editName: '', // 要编辑的名称
        modalEdit: false,
        // 创建模型验证
        formValidateOK: {
          academicYearName: '',
          academicYearStart: null,
          academicYearEnd: null
        },
        ruleValidateOK: {
          academicYearName: [
            { required: true, message: '学年名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '学年名称不能超过20个字', trigger: 'blur' }
          ],
          academicYearStart: [
            { type: 'date', required: true, message: '起始日期不能为空', trigger: 'change' }
          ],
          academicYearEnd: [
            { type: 'date', required: true, message: '截止日期不能为空', trigger: 'change' }
          ]
        },
        // 编辑模型验证
        formValidate: {
          academicYearName: '',
          academicYearStart: null,
          academicYearEnd: null
        },
        ruleValidate: {
          academicYearName: [
            { required: true, message: '学年名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '学年名称不能超过20个字', trigger: 'blur' }
          ],
          academicYearStart: [
            { type: 'date', required: true, message: '起始日期不能为空', trigger: 'change' }
          ],
          academicYearEnd: [
            { type: 'date', required: true, message: '截止日期不能为空', trigger: 'change' }
          ]
        },
        options: {}, // 时间禁选范围
        // antTable
        loadingTable: true,
        tableLoading: true,
        nullData: '您还没有学年的信息，请创建学年。',
        columns: [
          {
            title: '学年名称',
            dataIndex: 'Name',
            scopedSlots: { customRender: 'NameRender' }
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
            title: '学期管理',
            width: 150,
            scopedSlots: { customRender: 'termRender' },
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // 学期管理
                      this.$store.commit('common/getThreeMenuName', '学期管理')
                      this.$store.commit('common/getParam', { Name: params.row.Name, ID: params.row.ID, Start: params.row.Start, End: params.row.End })
                      this.$router.push({ path: '/xyhome/TermManage', query: this.$store.state.common.menuInfo })
                    }
                  }
                }, '编辑')
              ])
            }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
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
        pageSize: 15
      }
    },
    created () {},
    mounted () {
      this.$nextTick(() => {
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
          searchText: this.searchText,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/AcademicYear/GetPage',
          params
        )
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
        }
        this.tableLoading = false
      },
      // 学期管理
      termManage (record) {
        this.$store.commit('common/getThreeMenuName', '学期管理')
        this.$store.commit('common/getParam', { Name: record.Name, ID: record.ID, Start: record.Start, End: record.End })
        this.$router.push({ path: '/xyhome/TermManage', query: this.$store.state.common.menuInfo })
      },
      //   点击X关闭创建
      clearData () {
        this.$refs.formValidateOK.resetFields()
      },
      //   提交创建触发
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      ok () {
        this.$refs.formValidateOK.validate(valid => {
          if (!valid) {
            return false
          } else {
            let params = {
              Name: this.formValidateOK.academicYearName.trim(),
              Start: this.xy.moment(new Date(this.formValidateOK.academicYearStart)).format('YYYY-MM-DD'),
              End: this.xy.moment(new Date(this.formValidateOK.academicYearEnd)).format('YYYY-MM-DD')
            }
            this.xy.post(`${this.$store.state.apiPath}/api/AcademicYear/Create`, params).then(res => {
              if (res.success) {
                this.xy.msgSuc('创建成功。')
                this.loadTable()
                this.modalCreate = false
                this.$refs.formValidateOK.resetFields()
              }
            })
          }
        })
      },
      //  关闭创建楼弹框触发
      cancel () {
        this.modalCreate = false
        this.$refs.formValidateOK.resetFields()
      },
      //  单击表格中编辑按钮触发
      edit (id, name, start, end, isUse) {
        if (isUse) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>该学年正在使用，您确认要修改' + '吗？</p>',
            onOk: () => {
              this.editId = id
              this.formValidate.academicYearName = name
              this.formValidate.academicYearStart = start
              this.formValidate.academicYearEnd = end
              this.modalEdit = true
            }
          })
        } else {
          this.editId = id
          this.formValidate.academicYearName = name
          this.formValidate.academicYearStart = start
          this.formValidate.academicYearEnd = end
          this.modalEdit = true
        }
      },
      //  确认编辑触发
      editOk () {
        this.$refs.formValidate.validate(valid => {
          if (!valid) {
            return false
          } else {
            let params = {
              ID: this.editId,
              Name: this.formValidate.academicYearName.trim(),
              Start: this.xy.moment(new Date(this.formValidate.academicYearStart)).format('YYYY-MM-DD'),
              End: this.xy.moment(new Date(this.formValidate.academicYearEnd)).format('YYYY-MM-DD')
            }
            this.xy.post(`${this.$store.state.apiPath}/api/AcademicYear/Edit`, params).then(res => {
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
            this.xy.post(`${this.$store.state.apiPath}/api/AcademicYear/Delete?yearId=${id}`, null).then(res => {
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
