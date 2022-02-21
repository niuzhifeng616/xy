<!-- 成绩管理header按钮-学科设置 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <div class="left-bt">
        <Button class="xy-primary" @click="creatSub">添加学科</Button>
        <!-- <span class="iconfont" style="font-size: 12px; margin: 0 5px 0 -8px;">&#xe6a2;</span> -->
        <Button class="xy-danger" @click="batchDeletion">批量删除</Button>
      </div>
    </div>
    <div class="xy-content-body">
      <!-- <div>考试名称：{{arName}}</div> -->
      <div>
          <XyAntTable
            :rowSelection="tableRowSelection"
            :columns="columns"
            :dataSource="tableData"
            :nullData="noDataText"
            :tableLoading="tableLoading"
            :isPage="false"
            :scrollx="'max-content'"
            >
            <div slot="DisciplineName" style="min-width:200px" slot-scope="text, record">
              <span>
                {{ record.DisciplineName}}
              </span>
            </div>
            <div slot="TotalScore" style="min-width:100px" slot-scope="text, record">
              <span>
                {{ record.TotalScore}}
              </span>
            </div>
            <span slot="oprate" slot-scope="text, record">
              <a @click="deleteData(record)">删除</a>
            </span>
          </XyAntTable>
        </div>
    </div>
    <Modal v-model="modal" title="添加学科" :loading="loading" width="700"
      :mask-closable="false" :closable="false">
      <div class="dialog-model-content">
        <div style="width: 45%;">
          <Form ref="formRef" :model="formData" :rules="ruleValidate" @submit.native.prevent>
            <form-item label="满分" prop="TotalScore" label-for="TotalScore">
              <Input v-model.number="formData.TotalScore" element-id="TotalScore" type="number" placeholder="100" />
            </form-item>
          </Form>
        </div>
        <div class="box-sub" v-if="subList.length > 0">
          <ul>
            <li v-for="item in subList" :key="item.DisciplineID">
              <div class="box-p" :class="item.isChecked ? 'is-checked' : ''">
                <p v-text="item.DisciplineName" @click="selectSub(item)" :title="item.DisciplineName">
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="closeModal">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="okModal">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'

  export default {
    name: 'StudentAchievementSubject',
    components: {
      XyAntTable
    },
    data () {
      return {
        noDataText: '您还没有学科的信息，请添加学科。',
        tableLoading: false,
        tableData: [],
        columns: [
          {
            title: '学科',
            dataIndex: 'DisciplineName',
            scopedSlots: { customRender: 'DisciplineName' }
          },
          {
            title: '满分',
            dataIndex: 'TotalScore',
            scopedSlots: { customRender: 'TotalScore' }
          },
          {
            title: '操作',
            width: 80,
            dataIndex: 'oprate',
            scopedSlots: { customRender: 'oprate' }
          }
        ],

        modal: false,
        loading: true,
        formData: {
          TotalScore: 0 // 提交的关键字
        },
        ruleValidate: {
          TotalScore: [
            { required: true, type: 'number', message: '请输入满分分值', trigger: 'change' },
            { type: 'number', min: 0, message: '满分分值不能小于0', trigger: 'blur' },
            { type: 'number', max: 1000, message: '满分分值最大不能超过1000', trigger: 'blur' },
            {
              validator: function (rule, value, callback, source, options) {
                var errors = []
                var pattern = new RegExp('^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,1})?$')
                if (!pattern.test(value)) {
                  errors.push('只允许保留一位小数')
                }
                callback(errors)
              }
            }
          ]
        }, // 表单校验规则
        subList: [], // 提交数组
        checkedList: [], // 多选checked
        selectionAll: [], // 批量删除
        selectedRowKeys: [],

        arId: 0,
        arName: '',
        achievementRecordID: 0
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
      this.arId = this.$store.state.educationAffairs.achievementRecordSearch.arId
      this.arName = this.$store.state.educationAffairs.achievementRecordSearch.arName
      this.achievementRecordID = this.arId || 0
      this.getAll()
    },
    methods: {
      async getAll () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AchievementRecordExamSubject/GetAll`, {
          achievementRecordID: this.achievementRecordID
        })
        this.tableLoading = false
        if (res.success) {
          this.tableData = res.data
        }
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 单个删除操作
      deleteData (row) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定删除"' + row.DisciplineName + '"学科吗？删除后会清除该学科成绩。</p>',
          onOk: () => {
            this.xy.loading()
            this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecordExamSubject/Delete?id=${row.AchievementRecordExamSubjectID}&achievementRecordID=${this.achievementRecordID}`).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.xy.msgSuc('删除成功。')
                this.selectionAll = []
                this.getAll()
              }
            })
          }
        })
      },
      closeModal () {
        this.modal = false
        this.formData.TotalScore = 0
      },
      okModal () {
        this.changeLoading()
        this.$refs.formRef.validate((vali) => {
          if (vali) {
            if (this.checkedList.length === 0) {
              return this.xy.msgError('请选择至少一门学科。')
            }
            var arr = []
            for (var i in this.subList) {
              for (var it in this.checkedList) {
                if (this.subList[i].DisciplineID === this.checkedList[it]) {
                  arr.push(this.subList[i])
                }
              }
            }
            this.saveFun(arr)
          }
        })
      },
      async saveFun (arr) {
        var _this = this
        _this.xy.loading()
        let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/AchievementRecordExamSubject/Save`, {
          Options: arr.map(function (val) {
            return {
              TotalScore: _this.formData.TotalScore, // 总分,
              DisciplineID: val.DisciplineID, // 学科ID,
              DisciplineName: val.DisciplineName, // 学科名,
              GardTotalScore: 0, // 等级赋分（暂时传0）,
              XYCode: val.XYCode// 学科码
            }
          }),
          AchievementRecordID: _this.achievementRecordID
        })
        _this.xy.unloading()
        if (res.success) {
          _this.xy.msgSuc(res.msg)
          _this.modal = false
          _this.formData.TotalScore = 0
          _this.getAll()
        }
      },
      creatSub () {
        this.checkedList = []
        this.GetDisciplineInfo()
        this.modal = true
      },
      // 批量删除
      batchDeletion () {
        if (this.selectionAll.length === 0) { return this.xy.msgError('请选择至少一门学科。') };
        var arr = this.selectionAll.map(function (val) {
          return val.AchievementRecordExamSubjectID
        })
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除选中的这些学科吗？删除后，会清除这些学科的成绩。</p>',
          onOk: () => {
            this.xy.loading()
            this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecordExamSubject/Clear`, {
              IDS: arr,
              achievementRecordID: this.achievementRecordID
            }).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.selectionAll = []
                this.xy.msgSuc('删除成功。')
                this.getAll()
              }
            })
          }
        })
      },

      // 查询课程列表
      async GetDisciplineInfo () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AchievementRecordExamSubject/GetDisciplineInfo`, {
          achievementRecordID: this.achievementRecordID
        })
        this.xy.unloading()
        if (res.success) {
          if (res.data && res.data.length > 0) {
            // this.total = res.data.totalRecords
            this.subList = res.data.map(function (val) {
              return {
                DisciplineID: val.DisciplineID,
                DisciplineName: val.DisciplineName,
                XYCode: val.XYCode,
                // GardTotalScore: 0,
                isChecked: false
              }
            })
          }
        }
      },
      selectSub (val) {
        for (var i in this.subList) {
          if (val.DisciplineID === this.subList[i].DisciplineID) {
            this.subList[i].isChecked = !val.isChecked
            if (this.subList[i].isChecked && this.checkedList.indexOf(val.DisciplineID) === -1) {
              return this.checkedList.push(val.DisciplineID)
            } else {
              return this.checkedList.splice(this.checkedList.indexOf(val.DisciplineID), 1)
            }
          }
        }
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-title {
  display: flex;
  justify-content: space-between;
}
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
.ivu-table-header th .ivu-table-cell span{
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
.text-right {
  margin-top:10px;
}
.dele-hover:hover {
  color: #EA6666 !important;
  cursor: pointer;
}
.box-sub  {
  max-height:300px;
  overflow-y:scroll;
}
.box-sub ul {
  display: flex;
  flex-flow: row wrap;
}
.box-sub ul li {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 109.5px;
  height: 54px;

}
.box-sub ul li .box-p {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 94.5px;
  height: 44px;
  background:rgba(245,245,245,1);
  border-radius:4px;
  border:1px solid rgba(217,217,217,1);
  color:rgba(0,0,0,0.65);
}
.box-sub ul li .box-p > p {
  width: 75.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.box-sub ul li .box-p > p:hover {
    cursor: pointer;
}
.is-checked {
  background:rgba(230,247,255,1) !important;
  border:1px solid rgba(65,150,255,1) !important;
  color:rgba(65,150,255,1) !important;
}
.ivu-form-item {
  display: flex;
  align-items: center;
}
.ivu-form-item-label {
  flex: .2;
}
.ivu-form-item-content {
  flex: .8;
}
.ivu-input-wrapper {
  width: 50%;
}
.ivu-btn.ivu-btn-xy-primary .ivu-icon {
  font-size: 20px;
  margin-left: -10px;
}
</style>
