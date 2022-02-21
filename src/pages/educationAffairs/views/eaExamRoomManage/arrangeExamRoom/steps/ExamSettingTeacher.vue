<template>
<div id="ExamSetting">
    <div class="teacher-box-cent">
        <div>
            <Button class="xy-primary" icon="md-add" @click="Create" v-if="params.isEdit">添加教师</Button>
            <Button class="xy-danger" @click="DelAll" v-if="params.isEdit">批量删除</Button>
            <Alert style="margin-top: 16px" show-icon closable>{{direction}}</Alert>
        </div>
    </div>
    <XyAntTable
      :rowSelection="tableRowSelection"
      :columns="columns"
      :dataSource="datatable"
      :tableLoading="tableLoading"
      :scrollx="'max-content'"
      :isPage="false"
      :isScroll="true"
      >
      <div slot="Icon" slot-scope="text, record">
        <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
          <span class="head-font">
            {{ xy.showName(record.TeacherName)}}
          </span>
        </div>
        <img style="width:30px;height:30px;border-radius:50%" v-else :src="$store.state.apiPath + record.Icon + '?' + Math.random() * 15">
      </div>
      <div style="min-width: 200px" slot="TeacherName" slot-scope="text, record">
        <span>{{record.TeacherName}}</span>
      </div>
      <div slot="UserName" style="min-width: 200px" slot-scope="text, record">
        {{record.UserName}}
      </div>
      <span slot="04" slot-scope="text, record">
        <a @click="del(record.ArrangeSupervisorTeacherID,record.TeacherName)" :disabled='!params.isEdit || record.IsUsingAdvancedRules'>删除</a>
      </span>
    </XyAntTable>
    <SelectTeacherOrg
      :isShow="isTeacher"
      :modalTitle="modalTitle"
      :teachers="[...teachername]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm"
      />
</div>

</template>
<script>
  import SelectTeacherOrg from '@/components/selectTeacherOrg/SelectTeacherOrg.vue'
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      SelectTeacherOrg,
      XyAntTable
    },
    name: 'ExamSettingTeacher',
    data () {
      return {
        modalTitle: '添加教师',
        isTeacher: false,
        modal_loading: false,
        apiPath: `${this.$store.state.apiPath}/api/ArrangeExamSetting/`,
        modalCreate: false,
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        loading: true,
        datatable: [],
        selectionAll: [],
        selectedRowKeys: [],
        isAll: false,
        alreadyAddTeacher: [],
        params: this.$store.state.educationAffairs.arrange,
        teachername: [],
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            scopedSlots: { customRender: 'Icon' },
            width: 60,
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'TeacherName',
            scopedSlots: { customRender: 'TeacherName' }
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '操作',
            dataIndex: '04',
            scopedSlots: { customRender: '04' },
            width: 80
          }
        ],
        tableLoading: true,
        direction: '设置过教师排监考规则中的高级规则或有排考结果后“监考教师设置”只可添加教师不可删除教师。若需删除教师，请先删除教师排监考规则中的高级规则或排考结果。'
      }
    },
    created () {
      this.getTP()
    },
    mounted () {

    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record.IsUsingAdvancedRules
            }
          })
        }
      }
    },
    methods: {
      onTableSelectChange (index, val) {
        console.log(index, val)
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 获取列表数据
      async getTP () {
        this.selectedRowKeys = []
        this.selectionAll = []
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(this.apiPath + 'GetAllArrangeSupervisorTeacher', params)
        this.tableLoading = false
        if (res.success) {
          this.isInitial = false
          if (res.data === null || res.data.length < 1) {
            this.isEmpty = true
          } else {
            this.isEmpty = false
            this.datatable = res.data
            this.datatable.forEach((item) => {
              this.$set(item, 'model', false)
            })
            this.datatable.map((item, index) => {
              this.$set(item, 'key', index)
            })
          }
        }
      },
      // 添加教师弹出框
      Create () {
        // 已经添加教师
        this.isTeacher = true
        this.alreadyAddTeacher = []
        this.datatable.forEach((item) => {
          this.alreadyAddTeacher.push(item.TeacherID)
        })
      },
      selectCancel () {
        this.isTeacher = false
      },
      selectConfirm (data) {
        this.isTeacher = false
        this.teachername = [...data]
        this.modalAdd()
      },
      async modalAdd () {
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          TeacherIDs: this.teachername.map(val => val.UserID)
        }
        let res = await this.xy.post(this.apiPath + 'CreateArrangeSupervisorTeacher', params)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || '添加成功。')
          this.getTP()
          let l = res.data.result.Step + 1
          let arr = JSON.parse(this.params.StepList)
          for (let i = 0; i < l; i++) {
            if (i < l) {
              arr[i].IsDisabled = false
            } else {
              arr[i].IsDisabled = true
            }
          }
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            Steps: res.data.result.Step,
            StepList: JSON.stringify(arr)
          }))
          console.log(this.params)
          this.$emit('change', { StepList: arr, step: res.data.result.Step })
        }
      },

      // 单击删除单个内容触发
      del (id, name) {
        this.xy.confirm('删除', `您确定要删除"'${name}'"吗？`, () => {
          this.toDelete(id)
        })
      },
      async toDelete (id) {
        this.modal_loading = true
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          ArrangeSupervisorTeacherIDs: [id]
        }
        let res = await this.xy.post(this.apiPath + 'DeleteArrangeSupervisorTeacher', params)
        this.xy.unloading()
        if (res.success) {
          this.getTP()
          this.xy.msgSuc(res.msg || '删除成功。')
          if (res.data.result && res.data.result.Step && res.data.result.Step === 3) {
            let l = res.data.result.Step + 1
            let arr = JSON.parse(this.params.StepList)
            for (let i = 0; i < l; i++) {
              if (i < l) {
                arr[i].IsDisabled = false
              } else {
                arr[i].IsDisabled = true
              }
            }
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              Steps: res.data.result.Step,
              StepList: JSON.stringify(arr)
            }))
            this.$emit('change', { StepList: arr, step: res.data.result.Step })
          };
        }
      },
      async toBatchDt () {
        let idsStr = []
        idsStr = this.selectionAll.map(val => val.ArrangeSupervisorTeacherID)
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          ArrangeSupervisorTeacherIDs: idsStr
        }
        let res = await this.xy.post(this.apiPath + 'DeleteArrangeSupervisorTeacher', params)
        if (res.success) {
          this.getTP()
          this.xy.msgSuc(res.msg || '删除成功。')
          this.modal_loading = false
          this.selectionAll = []
          if (res.data.result && res.data.result.Step && res.data.result.Step === 3) {
            let l = res.data.result.Step + 1
            let arr = JSON.parse(this.params.StepList)
            for (let i = 0; i < l; i++) {
              if (i < l) {
                arr[i].IsDisabled = false
              } else {
                arr[i].IsDisabled = true
              }
            }
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              Steps: res.data.result.Step,
              StepList: JSON.stringify(arr)
            }))
            this.$emit('change', { StepList: arr, step: res.data.result.Step })
          };
        } else {
          this.modal_loading = false
          this.xy.msgError(res.msg || '批量删除失败。')
        }
      },
      // 全部删除
      DelAll () {
        this.modal_loading = true
        if (this.selectionAll.length < 1) {
          this.xy.msgError('请选择要删除的监考教师。')
        } else {
          this.xy.confirm('批量删除', '您确定要删除选中的所有监考教师吗？', () => {
            this.toBatchDt()
          })
        };
      },

      // 全选
      SelectAll () {
        if (this.isAll) {
          this.isAll = false
          this.selectionAll = []
          for (let i = 0; i < this.datatable.length; i++) {
            this.datatable[i].model = false
          }
        } else {
          this.isAll = true
          this.selectionAll = []
          for (let i = 0; i < this.datatable.length; i++) {
            this.selectionAll.push(this.datatable[i].ArrangeSupervisorTeacherID)
            this.datatable[i].model = true
          }
        }
      },

      // 选择老师
      checkChange (item, index) {
        this.$set(item, 'model', !item.model)
        if (!this.datatable[index].model) {
          for (let i = 0; i < this.selectionAll.length; i++) {
            if (this.selectionAll[i] === item.ArrangeSupervisorTeacherID) {
              this.selectionAll.splice(i, 1)
            }
          }
          if (this.selectionAll.length === this.datatable.length) {
            this.isAll = true
          } else {
            this.isAll = false
          }
        } else {
          this.selectionAll.push(item.ArrangeSupervisorTeacherID)
          this.isAll = true
          if (this.selectionAll.length !== this.datatable.length) {
            this.isAll = false
          } else {
            this.isAll = true
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../Css/ArrangeExamRoom/ExamSettingTeacher.less';
</style>
