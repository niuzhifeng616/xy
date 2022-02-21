<template>
  <!-- 3.选课学生 -->
  <div>
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button
          class="xy-primary"
          @click="selectStudent"
          :disabled="isOperation !== 0">添加学生</Button
        >
        <!-- <span class="iconfont" style="font-size: 12px; margin: 0 5px 0 -8px;">&#xe6a2;</span> -->
        <Button
          class="xy-danger"
          @click="delBatch"
          :disabled="isOperation !== 0"
          >批量删除</Button
        >
        <Button
          class="xy-danger"
          @click="delAll"
          :disabled="isOperation !== 0"
          >全部删除</Button
        >
      </div>
      <div class="fr pr">
        <Input
          search
          clearable
          v-model.trim="searchTopName"
          @on-search="FromSubmit"
          placeholder="请输入用户名/学籍号/姓名"
          class="fr xy-content-title-search"
          style="width: auto;"
        />
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable  :rowSelection="tableRowSelection"
          :columns="columnss"
          :dataSource="datatable"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange">
          <div slot="Icon" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${!record.Sex ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.FullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <div slot="FullName" slot-scope="text, record">
            <div style="min-width:200px">
              {{record.FullName.replace(/\s/g, '&nbsp;')}}
            </div>
          </div>
          <div slot="UserName" slot-scope="text, record">
            <div style="min-width:200px">
              {{record.UserName}}
            </div>
          </div>
          <div slot="StudentOrganizationName" slot-scope="text, record">
            <div style="min-width:300px">
              {{record.StudentOrganizationName}}
            </div>
          </div>
          <span slot="oprateRender"  slot-scope="text, record">
            <a :disabled="isOperation!==0" @click="del(record)">删除</a>
          </span>
        </XyAntTable>
    </div>
    <!-- 选择学生 -->
     <SelectStudent
                   :isShow="isShowSelectStudent"
                   :apiData="apiData"
                   :schoolDistrictID="schoolDistrictID"
                   @select-cancel="selectCancel"
                   @select-confirm="selectConfirm">
    </SelectStudent>
    <!-- <select-student
      ref="selectStudent"
      :isShow="isShowSelectStudent"
      :classTableID="classTableID"
      :getStudentOrgApiurl="'/api/Collection/GetOrgAll'"
      :getStudentApiurl="'/api/Collection/GetCollectionStudent'"
      :teachers="[...selectedStudent]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </select-student> -->
  </div>
</template>
<script>
  // import SelectStudent from './components/SelectStudent'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import SelectStudent from '@/pages/csmsTimeTable/components/selectStudent/CheckboxSelectStudent.vue'
  export default {
    name: 'TLArrgngingStudents',
    components: {
      XyAntTable,
      SelectStudent
    },
    data () {
      return {
        // 添加学生
        apiData: {},
        schoolDistrictID: null,
        isShowSelectStudent: false,
        selectedStudent: [],

        searchTopName: '',
        collectionID: '',
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
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
        },
        pageList: 0, // 当前页数据条数
        datatable: [],
        selectionAll: [],
        columnss: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 18,
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'FullName',
            width: 150,
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '原班级',
            dataIndex: 'StudentOrganizationName',
            scopedSlots: { customRender: 'StudentOrganizationName' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 140,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        isOperation: true,
        classTableID: 0
      }
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange
        }
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.rowObj.ClassTableID
      this.schoolDistrictID = this.$parent.rowObj.SchoolDistrictID
      this.getTP()
    },
    mounted () {},
    methods: {
      // 添加学生
      selectStudent () {
        this.apiData = {
          url: `${this.$store.state.apiPath}/api/Collection/GetAllCollectionStudent`,
          params: {
            classTableID: this.classTableID
          }
        }
        this.isShowSelectStudent = true
      },
      selectCancel () {
        this.isShowSelectStudent = false
      },
      selectConfirm (data) {
        this.isShowSelectStudent = false
        this.selectedStudent = [...data] // 所选学生
        if (this.selectedStudent.length > 0) {
          this.addComplate()
        } else {
          this.xy.msgError('请先选择学生。')
        };
      },
      async addComplate () {
        var tutorArr = []
        for (var i = 0; i < this.selectedStudent.length; i++) {
          tutorArr.push({
            ClassTableID: this.classTableID,
            CollectionID: this.collectionID,
            StudentID: this.selectedStudent[i].id,
            StudentOrganizationID: this.selectedStudent[i].studentOrganizationID
          })
        };
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/CreateCollectionStudent`, tutorArr)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('添加成功。')
          this.getTP()
          this.$parent.getGeneralFlows()
        }
      },

      // 获取table数据
      async getTP () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Collection/GetCollectionStudentByClassTableList`, {
          classTableID: this.classTableID,
          name: this.searchTopName,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        })
        if (res.success) {
          this.datatable = res.data.Result.data
          this.pagination.total = res.data.Result.totalRecords
          this.collectionID = res.data.CollectionID
          if (res.data.Result.data !== null && res.data.Result.data.length > 0) {
            this.pageList = res.data.Result.data.length
          }
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.getTP()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 搜索
      FromSubmit () {
        this.pagination.current = 1
        this.getTP()
      },

      // 删除
      del (row) {
        if (this.isOperation === 0) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除“' + row.FullName + '”吗？',
            onOk: () => {
              this.delObj(row)
            }
          })
        }
      },
      async delObj (row) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/DeleteCollectionStudent`, {
          ClassTableID: this.classTableID,
          StudentID: row.StudentID,
          CollectionID: this.collectionID
        })
        this.xy.unloading()
        if (res.success) {
          this.selectionAll = []
          this.xy.msgSuc('删除成功。')
          if (this.pageList > 1) {
            this.pageList = this.pageList - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.getTP()
        }
      },
      // 全部删除
      delAll () {
        if (this.isOperation === 0) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除全部学生吗？',
            onOk: () => {
              this.delAllObj()
            }
          })
        }
      },
      async delAllObj () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/DeleteAllCollectionStudent`, {
          ClassTableID: this.classTableID,
          CollectionID: this.collectionID
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.selectionAll = []
          this.getTP()
        }
      },
      // 批量删除
      delBatch () {
        if (this.isOperation === 0) {
          if (this.selectionAll.length > 0) {
            let studentIDs = ''
            if (this.selectionAll.length === 1) {
              for (let i = 0; i < this.selectionAll.length; i++) {
                studentIDs += this.selectionAll[i].StudentID
              }
            } else {
              for (let i = 0; i < this.selectionAll.length; i++) {
                studentIDs += this.selectionAll[i].StudentID + ','
              }
            }
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除所有选中的学生吗？',
              onOk: () => {
                this.delBatchObj(studentIDs)
              }
            })
          } else {
            this.xy.msgError('请选择要删除的学生。')
          }
        }
      },
      async delBatchObj (studentIDs) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/DeleteCollectionStudentByIds`, {
          ClassTableID: this.classTableID,
          StudentIDs: studentIDs,
          CollectionID: this.collectionID
        })
        this.xy.unloading()
        if (res.success) {
          if (this.selectionAll.length === this.pageList && this.pagination.current > 1) {
            this.pagination.current = this.pagination.current - 1
          }
          this.selectionAll = []
          this.xy.msgSuc('删除成功。')
          this.getTP()
        }
      }

    }
  }
</script>
<style lang="less" scoped>

</style>
