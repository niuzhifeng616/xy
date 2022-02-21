// 考勤记录
<template>
  <div class="TeacherAttendanceType">
      <!-- 面包屑 -->
      <div class="xy-content-title clearfix">
        <div class="fr pr">
            <date-picker
              type="date"
              :value="SDDate"
              @on-change="changeDate"
              :clearable="false"
              :editable="false"
              :options="optionsDate"
              placeholder="当前日期"
              style="width: 200px"
              >
            </date-picker>
            <i-input
              search
              v-model="searchText"
              @on-search="FromSubmit"
              placeholder="请输入用户名/姓名"
              class="fr xy-content-title-search"
              style="width: auto;"
              >
                <icon type="ios-search cursor-p" slot="suffix" />
            </i-input>
        </div>
    </div>
      <div class="xy-content-body">
        <XyAntTable
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
        >
          <div slot="BuildingFullNameRender" style="min-width:140px" slot-scope="text, record">
              {{ record.UserName}}
          </div>
          <div slot="BuildingNameRender" style="min-width:140px"  slot-scope="text, record">
            <span class="table-el-hover" @click="edit(record)">
              {{ text}}
            </span>
          </div>
          <div slot="switchRender" slot-scope="text, record">
            <a-switch checked-children="启用" un-checked-children="停用" :checked="record.State" @change="switchFun(record)" />
          </div>
          <span slot="oprateRender" slot-scope="text, record">
            <a @click="edit(record)">处理</a>
          </span>
        </XyAntTable>
        <Modal
          v-model="modalEdit"
          :transfer="false"
          title="处理为"
          :loading="loading"
          :mask-closable="false"
          >
            <div class="dialog-model-content">
                <Form>
                    <FormItem label="上班打卡：">
                        <Select v-model="FirstEditId" @on-change="FirstChange">
                            <OptionGroup label="常规">
                                <Option v-cloak v-for="(item,index) in IsDefault" :key="index" :value="item.TeacherAttendanceTypeID">
                                  {{ item.TeacherAttendanceTypeName }}
                                </Option>
                            </OptionGroup>
                            <OptionGroup label="其他">
                                <Option v-cloak v-for="(item,index) in IsNotDefault" :key="index" :value="item.TeacherAttendanceTypeID">
                                  {{ item.TeacherAttendanceTypeName }}
                                </Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                    <FormItem label="下班打卡：">
                        <Select v-model="LastEditId" @on-change="LastChange">
                            <OptionGroup label="常规">
                                <Option v-for="(item,index) in IsDefault" :key="index" :value="item.TeacherAttendanceTypeID">
                                  {{ item.TeacherAttendanceTypeName }}
                                </Option>
                            </OptionGroup>
                            <OptionGroup label="其他">
                                <Option v-for="(item,index) in IsNotDefault" :key="index" :value="item.TeacherAttendanceTypeID">
                                  {{ item.TeacherAttendanceTypeName }}
                                </Option>
                            </OptionGroup>
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
        txt: '该搜索条件下没有结果。',
        modal_loading: false,
        loading: true,
        modalCreate: false, // 创建弹出框默认不展示
        searchText: '',
        editId: {}, // 要编辑的row
        modalEdit: false,
        ids: '',
        // 查询时间日期
        startDate: this.xy.moment(new Date()).format('YYYY-MM-DD'),
        endDate: this.xy.moment(new Date()).format('YYYY-MM-DD'),
        SDDate: this.xy.moment(new Date()).format('YYYY-MM-DD'),
        optionsDate: {
          disabledDate (date) {
            return date.valueOf() > Date.now()
          }
        },
        // 异常处理
        selectEdit: '',
        LastEdit: '',

        // 处理考勤状态
        Edit: '',
        IsDefault: [],
        IsNotDefault: [],
        Firstdisabled: '',
        Lastdisabled: '',

        // 需要上传的ID
        FirstEditID: '',
        LastEditID: '',

        // 2.0下拉框
        FirstEditId: 4004,
        LastEditId: '',

        FirstEditIdType: '',
        LastEditIdType: '',
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        columns: [
          {
            title: '姓名',
            dataIndex: 'FullName',
            scopedSlots: { customRender: 'BuildingNameRender' }
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'BuildingFullNameRender' }
          },
          {
            title: '上班打卡',
            width: 220,
            dataIndex: 'FirstTimeName'
          },
          {
            title: '下班打卡',
            width: 220,
            dataIndex: 'LastTimeName'
          },
          {
            title: '考勤时间',
            width: 200,
            dataIndex: 'TimeName'
          },
          {
            title: '异常处理',
            dataIndex: 'operation',
            width: 100,
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
      changeDate (date) {
        console.log(date)
        this.startDate = date
        this.endDate = date
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      handleTableChange () {
        this.loadTable()
      },
      FromSubmit () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      FirstChange () {
        this.FirstEditIdType = this.FirstEditId
      },
      LastChange () {
        this.LastEditIdType = this.LastEditId
      },
      // 获取table分页数据
      async loadTable () {
        this.tableLoading = true
        let params = {
          searchTxt: this.searchText,
          startDate: this.startDate,
          endDate: this.endDate,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/TeacherAttendanceRecord/GetPage', params)
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
          console.log(res.data.data)
        }
        this.tableLoading = false
      },
      // 切换table中switch
      switchFun (row) {
        var _this = this
        let params = {
          id: row.TeacherAttendanceTypeID,
          isEnable: row.IsEnable
        }
        this.xy.post(`${_this.$store.state.apiPath}/api/TeacherAttendanceRecord/EditIsEnable`, params).then(res => {
          if (res.success) {
            _this.xy.msgSuc('操作成功。')
            _this.loadTable()
          }
        })
      },
      // 关闭弹框触发
      cancel () {
        this.modalEdit = false
      },
      // 单击表格中编辑按钮触发
      edit (row) {
        this.editId = row
        this.modalEdit = true
        console.log(this.editId)
        this.GetAllType()
        // 初始获取打卡状态并绑定
        this.FirstEditId = row.FirstTeacherTypeID
        this.LastEditId = row.LastTeacherTypeID

        this.FirstEditIdType = row.FirstTeacherTypeID
        this.LastEditIdType = row.LastTeacherTypeID
        this.modalEdit = true

        // 获取所有考勤类型//(停用状态 || 本人已经使用)可以选,
      },
      // 获取下拉框中的数据
      async GetAllType () {
        this.xy.loading()
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/TeacherAttendanceType/GetAllGroupByIsDefault', null)
        if (res.success) {
          this.xy.unloading()
          this.Edit = res.data
          this.IsDefault = this.Edit.IsDefault
          this.IsNotDefault = this.Edit.IsNotDefault
        }
      },
      // 确认编辑触发
      async editOk () {
        let params = {
          TeacherID: this.editId.TeacherID,
          FirstTeacherTypeID: this.FirstEditIdType,
          LastTeacherTypeID: this.LastEditIdType,
          TeacherAttendanceRecordDate: this.startDate
        }
        this.xy.post(`${this.$store.state.apiPath}/api/TeacherAttendanceRecord/Edit`, params).then(res => {
          if (res.success) {
            this.xy.msgSuc('编辑成功。')
            this.loadTable()
            this.modalEdit = false
          }
        })
      }
    }
  }
</script>

<style lang="less">
</style>
