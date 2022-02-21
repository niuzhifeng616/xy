// 班组安排
<template>
  <div class="teacherAttendanceTeam">
    <!-- 面包屑 -->
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
        <div
          slot="AttendanceTeamNameRender"
          style="min-width:320px"
          slot-scope="text, record"
          >
          <span
            v-if="record.IsDefault"
            class="table-el-hover"
            @click="edit(record)"
            >
            {{ text}}
          </span>
          <span v-else>{{ text}}</span>
        </div>
        <div slot="switchRender" slot-scope="text, record">
          <a-switch
            checked-children="启用"
            un-checked-children="停用"
            :checked="!record.IsDefault"
            :disabled="true"
            />
        </div>
        <span slot="oprateRender" slot-scope="text, record">
          <a :disabled="!record.IsDefault">编辑</a>
          <a-divider type="vertical" />
          <a :disabled="!record.IsDefault">删除</a>
        </span>
      </XyAntTable>
      <Modal
        v-model="modalEdit"
        :transfer="false"
        title="编辑班组"
        :loading="loading"
        :mask-closable="false"
        >
        <div class="dialog-model-content">
          <Form ref="formValidateEdit" :label-width="100" :model="formValidateEdit" :rules="ruleValidateEdit">
            <FormItem
              label="班组名称："
              prop="formName"
              label-for="formName"
              >
              <Input
                v-model="formValidateEdit.formName"
                disabled
                element-id="formName"
                />
            </FormItem>
            <FormItem
              label="开始日期："
              prop="formStartDate"
              label-for="formStartDate"
              >
              <date-picker
                format="yyyy-MM-dd"
                v-model="formValidateEdit.formStartDate"
                type="date"
                placeholder=""
                :editable="false"
                element-id="formStartDate"
                >
              </date-picker>
            </FormItem>
            <FormItem
              label="结束日期："
              prop="formEndDate"
              label-for="formEndDate"
              >
              <date-picker
                format="yyyy-MM-dd"
                v-model="formValidateEdit.formEndDate"
                type="date"
                placeholder=""
                :editable="false"
                element-id="formEndDate"
                >
              </date-picker>
            </FormItem>
            <FormItem
              label="开始时间："
              prop="formStartTime"
              label-for="formStartTime"
              >
              <time-picker
                type="time"
                format="HH:mm"
                placement="bottom-end"
                v-model="formValidateEdit.formStartTime"
                placeholder=""
                element-id="formStartTime"
                >
              </time-picker>
            </FormItem>
            <FormItem
              label="结束时间："
              prop="formEndTime"
              label-for="formEndTime"
              >
              <time-picker
                v-model="formValidateEdit.formEndTime"
                type="time"
                format="HH:mm"
                placement="bottom-end"
                placeholder=""
                element-id="formEndTime"
                >
              </time-picker>
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
    name: 'courseSet',
    components: {
      XyAntTable
    },
    data () {
      return {
        modal_loading: false,
        loading: true,
        editId: '', // 要编辑的ID
        editName: '', // 要编辑的名称
        modalEdit: false,
        ids: '',
        formValidateEdit: {
          formName: '',
          formStartDate: null,
          formEndDate: null,
          formStartTime: '',
          formEndTime: ''
        },
        ruleValidateEdit: {
          formStartDate: [
            { type: 'date', required: true, message: '开始日期不能为空。', trigger: 'blur' }
          ],
          formEndDate: [
            { type: 'date', required: true, message: '结束日期不能为空。', trigger: 'blur' }
          ],
          formStartTime: [
            { type: 'string', required: true, message: '上班时间不能为空。', trigger: 'blur' }
          ],
          formEndTime: [
            { type: 'string', required: true, message: '下班时间不能为空。', trigger: 'blur' }
          ]
        },
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '您还没有班组安排的信息，请先联系管理员设置。',
        columns: [
          {
            title: '班组名称',
            dataIndex: 'AttendanceTeamName',
            scopedSlots: { customRender: 'AttendanceTeamNameRender' }
          },
          {
            title: '上班时间',
            dataIndex: 'StartTime',
            width: 220
          },
          {
            title: '下班时间',
            dataIndex: 'EndTime',
            width: 220
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
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/AttendanceTeam/GetPage', params)
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
        var _this = this
        this.xy.post(`${_this.$store.state.apiPath}/api/AttendanceTeam/EditUsersLocked?id=${row.UserId}&locked=${row.Locked}`, null).then(res => {
          if (res.success) {
            _this.xy.msgSuc('操作成功。')
          }
        })
      },
      // 关闭弹框触发
      cancel () {
        this.modalEdit = false
        this.$refs.formValidateEdit.resetFields()
      },
      // 单击表格中编辑按钮触发
      edit (row) {
        console.log(row)
        this.editId = row.AttendanceTeamID
        this.formValidateEdit.formName = row.AttendanceTeamName
        this.formValidateEdit.formStartDate = new Date(row.StartDate)
        this.formValidateEdit.formEndDate = new Date(row.EndDate)

        this.formValidateEdit.formStartTime = row.StartTime
        this.formValidateEdit.formEndTime = row.EndTime
        this.modalEdit = true
      },
      // 确认编辑触发
      editOk () {
        var _this = this
        this.loading = false
        this.$refs.formValidateEdit.validate(function (valid) {
          if (!valid) {
            return false
          } else {
            let params = {
              AttendanceTeamID: _this.editId,
              AttendanceTeamName: _this.formValidateEdit.formName,
              StartDate: _this.formValidateEdit.formStartDate,
              EndDate: _this.formValidateEdit.formEndDate,
              StartTime: _this.formValidateEdit.formStartTime,
              EndTime: _this.formValidateEdit.formEndTime
            }
            _this.xy.post(`${_this.$store.state.apiPath}/api/AttendanceTeam/Edit`, params).then(res => {
              if (res.success) {
                _this.xy.msgSuc('编辑成功。')
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
            _this.xy.post(`${_this.$store.state.apiPath}/api/SchoolDistrict/Delete?schoolDistrictID=${id}`, null).then(res => {
              if (res.success) {
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
