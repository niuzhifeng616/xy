// 类型设置
<template>
  <div class="TeacherAttendanceType">
    <!-- 面包屑 -->
    <div class="xy-content-title clearfix">
      <Button class="xy-primary" @click="modalCreate = true">添加类型</Button>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="tableData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        :scrollx="'max-content'"
        @change="handleTableChange"
        >
        <div slot="AttendanceTeamNameRender" style="min-width:380px" slot-scope="text, record">
          <span>
            {{ record.TeacherAttendanceTypeName}}
          </span>
        </div>
        <div slot="DescriptionRender" style="min-width:260px" slot-scope="text, record">
          <span>
            {{ record.Description}}
          </span>
        </div>
        <div slot="switchRender" slot-scope="text, record">
          <a-switch
            checked-children="启用"
            un-checked-children="停用"
            :checked="record.IsEnable"
            :disabled="!!record.IsDefault"
            @change="switchFun(record)"
            />
        </div>
        <span slot="oprateRender" slot-scope="text, record">
          <a :disabled="record._disabled" @click="del(record.TeacherAttendanceTypeID, record.TeacherAttendanceTypeName)">删除</a>
        </span>
      </XyAntTable>
      <Modal
        v-model="modalCreate"
        :transfer="false"
        title="添加类型"
        :loading="loading"
        :mask-closable="false"
        >
        <div class="dialog-model-content">
          <Form
            ref="formValidateCreate"
            :model="formValidateCreate"
            :rules="ruleValidateCreate"
            :label-width="100"
            >
            <FormItem
              label="类型名称："
              prop="formName"
              label-for="formName"
              >
              <Input
                v-model.trim="formValidateCreate.formName"
                clearable
                element-id="formName" />
            </FormItem>
            <FormItem
              label="类型说明："
              prop="formDescription"
              label-for="formDescription"
              >
              <Input
                v-model.trim="formValidateCreate.formDescription"
                clearable
                element-id="formDescription" />
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel">取消</Button>
          <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
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
        tableShow: false, // table数据改变时为true，默认false
        modalCreate: false, // 创建弹出框默认不展示
        searchName: '',
        ids: '',
        formValidateCreate: {
          formName: '',
          formDescription: ''
        },
        ruleValidateCreate: {
          formName: [
            { required: true, message: '类型名称不能为空。', trigger: 'blur' },
            { type: 'string', max: 6, message: '类型名称不能超过6字符。', trigger: 'blur' }
          ],
          formDescription: [
            { type: 'string', max: 20, message: '说明不能超过20字符。', trigger: 'blur' }
          ]
        },
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '您还没有考勤类型的信息，请先添加类型。',
        columns: [
          {
            title: '类型名称',
            dataIndex: 'TeacherAttendanceTypeName',
            scopedSlots: { customRender: 'AttendanceTeamNameRender' }
          },
          {
            title: '类型说明',
            dataIndex: 'Description',
            scopedSlots: { customRender: 'DescriptionRender' }
          },
          {
            title: '状态',
            width: 120,
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
        pageSize: 15
      }
    },
    created () {
    // this.$store.state.apiPath = 'http://192.168.20.177:27095'
    },
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
          searchTxt: this.searchName.trim(),
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/TeacherAttendanceType/GetPage', params)
        if (res.success) {
          this.tableData = res.data.data
          this.total = res.data.totalRecords
          this.pagination.total = res.data.totalRecords
          console.log(res.data.data)
        }
        this.tableLoading = false
      },
      // 切换table中switch
      switchFun (row) {
        let val = null
        if (row.IsEnable) {
          val = false
        } else {
          val = true
        }
        this.xy.post(`${this.$store.state.apiPath}/api/TeacherAttendanceType/EditIsEnable?id=${row.TeacherAttendanceTypeID}&isEnable=${val}`, null).then(res => {
          if (res.success) {
            this.xy.msgSuc('操作成功。')
            this.loadTable()
          }
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
              TeacherAttendanceTypeName: _this.formValidateCreate.formName,
              Description: _this.formValidateCreate.formDescription
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/TeacherAttendanceType/Create`, params).then(res => {
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
      // 关闭弹框触发
      cancel () {
        this.modalCreate = false
        this.$refs.formValidateCreate.resetFields()
      },
      // 单击删除单个内容触发
      del (id, name) {
        var _this = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除"' + name + '"吗？</p>',
          loading: true,
          onOk: function () {
            _this.xy.post(`${_this.$store.state.apiPath}/api/TeacherAttendanceType/Delete?id=${id}`, null).then(res => {
              if (res.success) {
                _this.$Modal.remove()
                _this.xy.msgSuc('删除成功。')
                // _this.loadTable()
                // 单个删除：删除最后一页最后一条时，自动返回上一页
                if (_this.tableData.length > 1) {
                  _this.tableData.length = _this.tableData.length - 1
                } else {
                  if (_this.pagination.current > 1) {
                    _this.pagination.current = _this.pagination.current - 1
                  }
                }
                _this.loadTable()
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="less">
</style>
