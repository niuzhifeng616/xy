<!-- 考试管理header按钮-考试类型 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl" style="margin-right: 10px;">
        <Button class="xy-primary" @click="details">新建考试类型</Button>
        <!-- <span class="iconfont" style="font-size: 12px; margin: 0 5px 0 -8px;">&#xe6a2;</span> -->
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="tableData"
        :nullData="noDataText"
        :tableLoading="tableLoading"
        :isPage="false"
        :scrollx="'max-content'"
        >
        <div slot="AchievementRecordExamTypeName" style="min-width:200px" slot-scope="text, record">
          <span :class="!record.IsDefault ? 'table-el-hover' : ''" @click="!record.IsDefault ? edit(record) : ''">
            {{ record.AchievementRecordExamTypeName}}
          </span>
        </div>
        <span slot="04" slot-scope="text, record">
          <a :disabled="record.IsDefault" @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a :disabled="record.IsDefault||record.IsDeleted" @click="del(record.AchievementRecordExamTypeID, record.AchievementRecordExamTypeName)">删除</a>
        </span>
      </XyAntTable>
    </div>
    <!-- 新建考试类型 -->
    <Modal v-model="modalCreate" title="新建考试类型" :transfer="false" :loading="loading"
      :mask-closable="false" :closable="false">
      <div class="dialog-model-content">
        <Form ref="formValidateCreate" :model="formValidateCreate" :rules="ruleValidateCreate" label-position="top" @submit.native.prevent>
          <form-item label="考试类型名称" prop="formName" label-for="formName">
            <Input v-model="formValidateCreate.formName" element-id="formName" />
          </form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="cancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="ok">确定</Button>
      </div>
    </Modal>

    <!-- 编辑考试类型 -->
    <Modal v-model="modalEdit" title="编辑考试类型" :transfer="false" :loading="loading"
      :mask-closable="false" :closable="false">
      <div class="dialog-model-content">
        <Form ref="formValidateEdit" :model="formValidateEdit" :rules="ruleValidateEdit" label-position="top" @submit.native.prevent>
          <form-item label="考试类型名称" prop="formName" label-for="eformName">
            <Input v-model="formValidateEdit.formName" element-id="eformName"/>
          </form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="editcancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="editOk">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'

  export default {
    name: 'AchievementRecordExamType',
    components: {
      XyAntTable
    },
    data () {
      return {
        noDataText: '您还没有考试类型的信息，请添加考试类型。',
        loading: true,
        editId: '',
        editName: '',
        ids: '',

        tableLoading: false,
        tableData: [],

        columns: [
          {
            title: '考试类型名称',
            dataIndex: 'AchievementRecordExamTypeName',
            scopedSlots: { customRender: 'AchievementRecordExamTypeName' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 120,
            scopedSlots: { customRender: '04' }
          }
        ],

        modalCreate: false,
        formValidateCreate: {
          formName: ''
        },
        ruleValidateCreate: {
          formName: [
            { required: true, message: '类型名称不能为空', trigger: 'blurformDescription' },
            { type: 'string', max: 20, message: '类型名称不能超过20字符', trigger: 'blur' }
          ]
        },

        modalEdit: false,
        formValidateEdit: {
          formName: ''
        },
        ruleValidateEdit: {
          formName: [
            { required: true, message: '类型名称不能为空', trigger: 'blurformDescription' },
            { type: 'string', max: 20, message: '类型名称不能超过20字符', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.getAllExam()
    },
    methods: {
      async getAllExam () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AchievementRecord/GetAllExamType`)
        this.tableLoading = false
        if (res.success) {
          this.tableData = res.data
        }
      },
      // 新建类型
      details () {
        this.modalCreate = true
      },
      // 提交创建触发
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      ok () {
        this.$refs.formValidateCreate.validate((valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            // Description: $.trim(this.formValidateCreate.formDescription),
            this.creatOkFun()
          }
        })
      },
      async creatOkFun () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecord/CreateType`, {
          TypeName: $.trim(this.formValidateCreate.formName)
        })
        if (res.success) {
          this.changeLoading()
          this.xy.msgSuc('创建成功。')
          this.getAllExam()
          this.modalCreate = false
          this.$refs.formValidateCreate.resetFields()
        } else {
          this.changeLoading()
        };
      },
      // 关闭创建楼弹框触发
      cancel () {
        this.modalCreate = false
        this.$refs.formValidateCreate.resetFields()
      },
      // 单击表格中编辑按钮触发
      edit (row) {
        this.formValidateEdit.formName = row.AchievementRecordExamTypeName
        this.editId = row.AchievementRecordExamTypeID
        this.modalEdit = true
      },
      // 确认编辑触发
      editOk () {
        this.loading = false
        this.$refs.formValidateEdit.validate((valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            this.editOkFun()
          }
        })
      },
      async editOkFun () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecord/EditType`, {
          TypeName: this.formValidateEdit.formName,
          SourceID: this.editId
        })
        if (res.success) {
          this.changeLoading()
          this.getAllExam()
          this.xy.msgSuc('编辑成功。')
          this.searchName = ''
          this.modalEdit = false
          this.$refs.formValidateEdit.resetFields()
        } else {
          this.changeLoading()
        };
      },
      // 关闭编辑楼弹框触发
      editcancel () {
        this.modalEdit = false
        this.$refs.formValidateEdit.resetFields()
      },

      // 单击删除单个内容触发
      del (id, name) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除“' + name + '”吗？</p>',
          onOk: () => {
            this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecord/DeleteType?id=${id}`).then(res => {
              if (!res.success) {
                this.xy.msgError('删除失败。')
                return this.changeLoading()
              } else {
                this.getAllExam() // 刷新数据
                this.xy.msgSuc('删除成功。')
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
/*table*/
.ivu-table-fixed-header thead tr th {
    background: #FAFAFA;
}
.ivu-table-header thead tr th {
    background: #FAFAFA;
    height: 54px;
}
th .ivu-table-cell {
    font-weight: bold;
    color: rgba(0,0,0,0.65);
}
.ivu-table-header th .ivu-table-cell {
    font-weight: bold;
    color: rgba(0,0,0,0.65);
}
.ivu-table-header th .ivu-table-cell span {
    color: rgba(0,0,0,0.65);
}

.ivu-table .ivu-btn,
.ivu-table .ivu-btn.active,
.ivu-table .ivu-btn:active,
.ivu-table .ivu-btn:hover {
    color: #1890FF;
    background: rgba(255,255,255,0);
    border: none;
}
.ivu-btn-ghost.ivu-btn-warning {
    color: #1890FF;
    background: rgba(255,255,255,0);
    border: none;
    box-shadow: none;
}
</style>
