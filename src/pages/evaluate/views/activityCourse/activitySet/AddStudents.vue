<!-- 添加学生 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary"
                :disabled='rowObj.IsEnable===1'
                @click="openAddModal">添加学生</Button>
        <Button class='xy-danger'
                @click="delBatch"
                :disabled='rowObj.IsEnable===1'
                style="margin:0 5px">批量删除</Button>
        <Button class='xy-danger'
                :disabled='rowObj.IsEnable===1'
                @click="delAll">全部删除</Button>
      </div>
      <!-- <div class="fr pr">
        <i-input search
                 v-model.trim="searchText"
                 @on-search="FromSubmit"
                 placeholder="请输入用户名/姓名"
                 class="xy-content-title-search"
                 style="width: auto;">
          <icon type="ios-search cursor-p"
                slot="suffix" />
        </i-input>
      </div> -->
    </div>
    <div class="xy-content-body">
      <!-- <xy-table :noDataText="'您还没有学生的信息，请添加学生。'" :tbColumns="columns"
                :tbData="dataTable"
                :total="total"
                @changePage="changePage"
                @changePageSize="changePageSize"
                :pageSize="pageSize"
                :pageIndex="pageCurrent"
                @changeSelect="changeSelect"></xy-table> -->
      <XyAntTable
        :columns="columns"
        :dataSource="dataTable"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        :rowSelection="tableRowSelection"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
        <!-- <div slot="StudentIcon" slot-scope="text, record">
          <img style="width:30px;height:30px;border-radius:50%"  :src=" record.StudentIcon == null || record.StudentIcon === '' ? image :  record.StudentIcon + '?' + Math.random() * 15">
        </div> -->
        <div slot="StudentIcon" slot-scope="text, record">
          <div v-if="!record.StudentIcon" class="head-con man">
            <span class="head-font">
              {{ xy.showName(record.StudentFullName)}}
            </span>
          </div>
          <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.StudentIcon + '?' + Math.random() * 15">
        </div>
        <div slot="StudentFullName" style="min-width:100px"  slot-scope="text, record">
            {{record.StudentFullName}}
        </div>
        <div slot="StudentName" style="min-width:100px" slot-scope="text,record">
          <span>
            {{record.StudentName}}
          </span>
        </div>
        <span slot="operation" slot-scope="text, record">
          <a @click="del(record)" :disabled="rowObj.IsEnable === 1">删除</a>
        </span>
      </XyAntTable>
      <!--全部删除 -->
      <modal v-model="modalClear"
             :transfer="false"
             :mask-closable="false">
        <p slot="header">全部删除</p>
        <p style="margin-bottom:5px;font-size:14px;">
          请输入“<span style="color:#ed4014">删除</span>”二字来确认删除全部学生。
        </p>
        <div>
          <Input v-model="clearText"
                 placeholder="请输入“删除”进行确认" />
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="modalClear = false">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="clearSubmit">确定</Button>
        </div>
      </modal>
      <SelectStudent :isShow="isShow"
                     :teachers="[...selectedStudents]"
                     :showOrgID='showOrgID'
                     :ActivityCourseProjectID='rowObj.ActivityCourseProjectID'
                     @select-cancel="selectCancel"
                     @select-confirm="selectConfirm">
      </SelectStudent>
    </div>
  </div>
</template>

<script>
  // import xyTable from '@/components/table/XyTable'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import SelectStudent from '@/pages/evaluate/components/evaSelectStudent/SelectStudent.vue'
  export default {
    components: {
      // xyTable,
      XyAntTable,
      SelectStudent
    },
    data () {
      return {
        // 表格
        isShow: false,
        selectedStudents: [],
        columns: [],
        dataTable: [],
        total: 0,
        pageCurrent: 1, // 当前页码
        pageSize: 15, // 每页显示条数
        pageList: 0, // 当前页数据条数
        selectionAll: [], // 选中的学生
        haveStudent: [], // 已经添加过得学生
        searchText: '',
        // 清除选课结果
        modalClear: false,
        clearText: '',
        showOrgID: 0,
        rowObj: { IsEnable: 0, ActivityCourseProjectID: 0 },
        activityStepsHeader: {},
        image: require('@/assets/common/yrykb.png'),
        nullData: '该方案还没有学生信息，请添加学生。',
        selectedRowKeys: [],
        tableLoading: true,
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        }
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
              disabled: record._disabled
            }
          })
        }
      }
    },
    mounted: function () {
      // let that = this
      this.activityStepsHeader = this.$parent
      if (Object.keys(this.$store.state.evaluate.activityObj).length > 0) {
        this.rowObj = this.$store.state.evaluate.activityObj
        this.showOrgID = this.rowObj.SchoolDistrictID
      }
      this.columns = [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'left',
        //   dataIndex: 'ActivityCourseProjectID',
        //   scopedSlots: { customRender: 'ActivityCourseProjectID' }
        // },

        {
          title: ' ',
          dataIndex: 'Icon',
          width: 40,
          scopedSlots: { customRender: 'StudentIcon' },
          className: 'table-pic'
        },
        {
          title: '姓名',
          dataIndex: 'StudentFullName',
          // minWidth: 100,
          scopedSlots: { customRender: 'StudentFullName' }
        },
        {
          title: '用户名',
          dataIndex: 'StudentName',
          // minWidth: 100
          scopedSlots: { customRender: 'StudentName' }
        },
        {
          title: '班级',
          dataIndex: 'StudentOrganizationName',
          width: 200,
          scopedSlots: { customRender: 'StudentOrganizationName' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 100,
          scopedSlots: { customRender: 'operation' }
        }
      ]
      this.getTable()
    },
    methods: {
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      handleTableChange () {
        this.getTable()
      },
      // ------------表格start--------------
      selectCancel () {
        this.isShow = false
      },
      async selectConfirm (data) {
        this.isShow = false
        this.selectedStudents = [...data]
        let tutorArr = []
        let that = this
        if (this.selectedStudents.length === 0) {
          that.xy.msgError('请先选择学生')
          return false
        }
        for (let i = 0; i < this.selectedStudents.length; i++) {
          tutorArr.push({
            StudentGradeForStudentYearID: that.selectedStudents[i].StudentGradeForStudentYearID,
            StudentOrganizationID: that.selectedStudents[i].StudentOrganizationID,
            StudentID: that.selectedStudents[i].UserID
          })
        }
        // this.xy.loading()
        let res = await this.xy.post(`${that.$store.state.apiPath}/api/ActivityCourseStudent/CreateStudent`, {
          ActivityCourseProjectID: that.rowObj.ActivityCourseProjectID,
          StudentData: tutorArr
        })
        if (res.success) {
          that.xy.msgSuc('添加成功')
          this.getTable()
          that.activityStepsHeader.getGeneralFlows() // 成功后步骤可以点击
        }
        // this.xy.unloading()
      },
      // 获取table/分页数据
      getTable: function (val) {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let that = this
        // this.xy.loading()
        that.xy.get(`${that.$store.state.apiPath}/api/ActivityCourseStudent/GetStudentPageByProjectID`, {
          PageIndex: that.pagination.current,
          PageSize: that.pagination.pageSize,
          ActivityCourseProjectID: this.rowObj.ActivityCourseProjectID
        }, true).then(res => {
          if (res.success) {
            that.dataTable = res.data.data || []
            that.total = res.data.totalRecords || 0
            this.pagination.total = res.data.totalRecords || 0
            that.pageList = that.dataTable.length
            // that.xy.unloading()
            this.tableLoading = false
          } else {
            // that.xy.unloading()
            this.tableLoading = false
          }
        })
      },
      // 全选/取消全选触发
      changeSelect: function (selection) {
        this.selectionAll = selection
      },
      FromSubmit: function () {
        // this.pageCurrent = 1
        this.pagination.current = 1
        this.searchText = this.searchText
        this.getTable()
      },
      // 单击删除单个内容触发
      del: function (row) {
        let that = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + row.StudentFullName + '"吗？',
          onOk: function () {
            that.xy.post(`${that.$store.state.apiPath}/api/ActivityCourseStudent/DeleteStudentByIDs`, {
              ActivityCourseProjectID: that.rowObj.ActivityCourseProjectID,
              ActivityCourseStudentIDs: [row.ActivityCourseStudentID]
            }).then(res => {
              if (res.success) {
                if (that.pageList > 1) {
                  that.pageList = that.pageList - 1
                } else {
                  if (that.pagination.current > 1) {
                    that.pagination.current = that.pagination.current - 1
                  }
                }
                that.activityStepsHeader.getGeneralFlows() // 成功后步骤可以点击
                that.checkedID = []
                that.xy.msgSuc('删除成功')
                that.getTable()
              }
            })
          }
        })
      },
      // 全部删除
      delAll: function () {
        this.clearText = ''
        this.modalClear = true
      },
      // 单击批量删除触发
      delBatch: function () {
        let that = this
        if (that.selectionAll.length < 1) {
          this.$Message.warning('请勾选要删除的学生')
        } else {
          let arr = []
          that.selectionAll.map(function (item) {
            arr.push(item.ActivityCourseStudentID)
          })
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要批量删除所有选中的学生吗?',
            onOk: function () {
              that.xy.post(`${that.$store.state.apiPath}/api/ActivityCourseStudent/DeleteStudentByIDs`, {
                ActivityCourseProjectID: that.rowObj.ActivityCourseProjectID,
                ActivityCourseStudentIDs: arr
              }).then(res => {
                if (res.success) {
                  that.checkedID = []
                  that.xy.msgSuc('删除成功')
                  if (that.selectionAll.length === that.pageList && that.pagination.current > 1) {
                    that.pagination.current = that.pagination.current - 1
                  }
                  that.getTable()
                  that.activityStepsHeader.getGeneralFlows() // 成功后步骤可以点击
                  that.selectionAll = []
                }
              })
            }
          })
        }
      },
      async clearSubmit () {
        let that = this
        if (this.clearText !== '删除') {
          that.xy.msgError('请输入“删除”来确认删除全部选择。')
          return
        }
        if (this.dataTable.length === 0) {
          that.xy.msgError('没有需要删除的结果')
          return
        }
        // this.xy.loading()
        let res = await this.xy.post(`${that.$store.state.apiPath}/api/ActivityCourseStudent/DeleteAllStudentByProjectID`, {
          ActivityCourseProjectID: that.rowObj.ActivityCourseProjectID,
          ActivityCourseStudentIDs: [0]
        })
        if (res.success) {
          that.getTable()
          that.xy.msgSuc('删除成功')
          that.checkedID = []
          that.modalClear = false
          that.activityStepsHeader.getGeneralFlows() // 成功后步骤可以点击
          // that.xy.unloading()
        }
      },
      openAddModal () {
        this.isShow = true
      }
    }
  }
</script>

<style lang="less" scoped>
.choose-class {
  display: flex;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  opacity: 0.85;
}
.xy-info {
  margin-right: -10px;
}
</style>
