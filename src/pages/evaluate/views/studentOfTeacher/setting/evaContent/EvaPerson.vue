<!-- 评教设置：创建方案-评教内容列表-评价对象 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary" style="margin-right:10px" @click="addEva" :disabled="isPublish">添加教师</Button>
      </div>
      <div class="fr pr">
        <Input search v-model.trim="searchText" @on-search="FromSubmit" placeholder="请输入教师用户名或姓名" style="width: 220px;" />
      </div>
    </div>
    <div class="xy-content-body">
      <p class="eva-title">已添加教师{{joinPelope.TeacherCount}}人，班级{{joinPelope.ClassCount}}个。 </p>
        <XyAntTable
          :columns="columns"
          :dataSource="datatable"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
        >
          <div slot="Icon" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.TeacherFullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon">
          </div>
          <div slot="TeacherFullName" style="min-width:80px" slot-scope="text, record">
            <span v-if="!isPublish" class="table-el-hover" @click="edit(record)">
              {{record.TeacherFullName}}
            </span>
            <span v-else>
              {{record.TeacherFullName}}
            </span>
          </div>
          <div slot="TeacherName" slot-scope="text, record" style="min-width:90px">
              {{record.TeacherName}}
          </div>
          <div slot="DisciplineName" slot-scope="text, record" style="min-width:80px">
            {{record.DisciplineName}}
          </div>
          <div slot="ClassName" slot-scope="text, record" style="min-width:80px">
            {{record.ClassName}}
          </div>
          <div slot="StudentCount" slot-scope="text, record" style="min-width:40px">
            {{record.StudentCount}}
          </div>
          <span slot="operation" slot-scope="text, record">
            <a :disabled="isPublish" @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="isPublish" @click="delFun(record)">删除</a>
          </span>
        </XyAntTable>
    </div>
    <!-- 添加评价对象 -->
    <add-eva
      :isShow="isShow"
      :teachers="[...selectedTeachers]"
      :teacherTotal="total"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm"
      >
    </add-eva>
    <Modal
      v-model="editTeacher"
      :title="editTeacherObj.ClassName"
      :transfer="false"
      :mask-closable="false"
      width="570"
      footer-hide
      >
      <div class="dialog-model-content">
        <p class="title">{{evaQuestion.ApplyToRole===1?"班主任：":"任课教师："}}<span class="roleName">{{editTeacherObj.TeacherFullName}}</span></p>
        <div class="xy-flex" v-if="editTeacherObj.Children">
          <Tag v-for="item in editTeacherObj.Children" :key="item" :name="item" closable @on-close="handleClose(item)" class="tag">
            <p :title="item.StudentFullName.length>4?item.StudentFullName:''">{{item.StudentFullName}}</p>
            <p :title="item.StudentName.length>4?item.StudentName:''">{{item.StudentName}}</p><!-- 用户名 -->
          </Tag>
        </div>
      </div>
      <!-- <div slot="footer">
        <Button class="xy-modal-close" @click="editTeacher=false">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="save">确定</Button>
      </div> -->
    </Modal>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import AddEva from '@/pages/evaluate/views/studentOfTeacher/setting/components/AddEva.vue'
  export default {
    name: 'evaPerson',
    components: {
      XyAntTable,
      AddEva
    },
    data () {
      return {
        isPublish: false, // 当前方案是否已经发布

        searchText: '',
        pageSize: 15, // 每页显示条数
        pageCurrent: 1, // 当前页码
        pageList: '', // 当前页数据条数
        total: 0,
        isShow: false,
        selectedTeachers: [],
        editTeacherObj: {},
        nullData: '您还没有评价对象的信息，请添加教师。',
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
        },
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '教师姓名',
            dataIndex: 'TeacherFullName',
            scopedSlots: { customRender: 'TeacherFullName' }
          },
          {
            title: '用户名',
            dataIndex: 'TeacherName',
            scopedSlots: { customRender: 'TeacherName' }
            // minWidth: 80
          },
          // 任课教师展示学科项 evaQuestion.ApplyToRole===2
          {
            title: '班级',
            dataIndex: 'ClassName',
            scopedSlots: { customRender: 'ClassName' }
            // minWidth: 90
          },
          {
            title: '参评学生数',
            dataIndex: 'StudentCount',
            scopedSlots: { customRender: 'StudentCount' }
            // minWidth: 40
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: 140,
            scopedSlots: { customRender: 'operation' }
          }
        ],
        datatable: [], // table数据
        joinPelope: {
          ClassCount: 0,
          TeacherCount: 0
        },
        editTeacher: false
      }
    },
    computed: {
      evaQuestion () {
        return this.$store.state.evaluate.evaQuestion
      },
      evaRowObj () {
        return this.$store.state.evaluate.evaRowObj
      }
    },
    created () {
      this.loadTable()
      // 任课教师展示学科项
      if (this.evaQuestion.ApplyToRole === 2) {
        this.columns.splice(3, 0, {
          title: '学科',
          dataIndex: 'DisciplineName',
          scopedSlots: { customRender: 'DisciplineName' },
          // minWidth: 70,
          show: false
        })
      }
      if (Object.keys(this.$store.state.evaluate.evaRowObj).length > 0) {
        this.isPublish = this.$store.state.evaluate.evaRowObj.IsPublished
      }
    },
    mounted () {

    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      addEva () {
        this.isShow = true
      },
      selectCancel () {
        this.isShow = false
      },
      selectConfirm () {
        this.isShow = false
        // this.pageCurrent = 1
        this.pagination.current = 1
        this.loadTable()
      },
      FromSubmit () {
        // this.pageCurrent = 1
        this.pagination.current = 1
        this.nullData = '该搜索条件下没有结果。'
        this.loadTable()
      },
      async loadTable () {
        this.tableLoading = true
        let obj = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          projectID: this.evaRowObj.TeachingProjectID,
          questionnaireID: this.evaQuestion.QuestionnaireID,
          searchText: this.searchText
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingTeacher/GetPage`, obj)
        if (res.success) {
          if (res.data.PageResult !== null) {
            this.total = res.data.PageResult.totalRecords
            this.pagination.total = res.data.PageResult.totalRecords
            this.datatable = res.data.PageResult.data
            this.pageList = this.datatable.length
          } else {
            this.total = 0
            this.datatable = []
            this.pageList = 0
          }
          this.joinPelope = {
            ClassCount: res.data.ClassCount,
            TeacherCount: res.data.TeacherCount
          }
        }
        this.tableLoading = false
      },
      edit (row) {
        this.editTeacherObj = row
        this.editTeacher = true
      },
      delFun (row) {
        var _this = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + row.TeacherFullName + '"吗？',
          async  onOk () {
            let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/StudentTeachingTeacher/Delete?techingTeacherID=${row.TeachingTeacherID}`)
            if (res.success) {
              if (_this.pageList > 1) {
                _this.pageList = _this.pageList - 1
              } else {
                if (_this.pagination.current > 1) {
                  _this.pagination.current = _this.pagination.current - 1
                }
              }
              _this.xy.msgSuc('删除成功。')
              _this.loadTable()
            }
          }
        })
      },
      save () {

      },
      handleClose (row) {
        // 删除评价学生
        var _this = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + row.StudentFullName + '"吗？',
          async onOk () {
            let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/StudentTeachingTeacher/DeleteStudent?techingStudentID=${row.TeachingStudentID}`)
            if (res.success) {
              _this.xy.msgSuc('删除成功。')
              _this.editTeacherObj.Children.map((item, index) => {
                if (item.TeachingStudentID === row.TeachingStudentID) {
                  _this.editTeacherObj.Children.splice(index, 1)
                }
              })
              _this.loadTable()
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.eva-title {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 10px;
}
.dialog-model-content {
  .title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    .roleName {
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .xy-flex {
    flex-wrap: wrap;
    margin-top: 10px;
    max-height: 400px;
    overflow-y: auto;
    .tag {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 22px !important;
      height: auto !important;
      width: 97px;
      margin: 0 8px 8px 0;
      .ivu-tag-text {
        display: inline-block !important;
        max-width: 70px !important;
        p {
          max-width: 70px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
// table添加头像列样式
// .ivu-table td.set-head-icon .ivu-table-cell {
//   padding: 0;
// }
// .ivu-table td.set-head-icon .ivu-table-cell img{
//   width: 30px;
//   height: 30px;
//   border-radius: 50%;
//   float: right;
// }
</style>
