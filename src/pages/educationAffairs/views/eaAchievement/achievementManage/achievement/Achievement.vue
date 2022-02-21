// 模块管理
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
            <Button class="xy-primary" @click="CreateMod">创建模块</Button>
            <Button class="xy-info" @click="delall">批量删除</Button>
        </div>
        <div class="fr pr">
            <i-select v-model="disciplineID"
                      @on-change="typeValueSearch"
                      class="fl xy-content-title-search"
                      style="width:150px;">
                <i-option :value="0" :key="0">所有学科</i-option>
                <i-option v-for="item in Discipline" :value="item.DisciplineID" :key="item.DisciplineName" v-cloak>{{ item.DisciplineName }}</i-option>
            </i-select>
            <!-- i-input search v-model.trim="searchText" @on-search="reLoadTable" -->
            <i-input search
                     v-model="seachText"
                     @on-search="fromSubmit"
                     placeholder="输入模块名称"
                     class="fr xy-content-title-search"
                     style="width: auto;">
                <icon type="ios-search cursor-p" slot="suffix" />
            </i-input>
        </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :rowSelection="tableRowSelection"
        :columns="columns"
        :dataSource="datatable"
        :nullData="txt"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
        <div slot="AchievementName" slot-scope="text, record">
          <span style="min-width:180px" class="table-el-hover" @click="edit(record)">
            {{ record.AchievementName}}
          </span>
        </div>
        <div slot="AchievementTypeName" slot-scope="text, record">
          <div style="min-width:180px">
            {{ record.AchievementTypeName}}
          </div>
        </div>
        <div slot="oprate" slot-scope="text, record">
          <a @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a :disabled="record._disabled" @click="dele(record)">删除</a>
        </div>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'achievement',
    components: {
      XyAntTable
    },
    data () {
      return {
        txt: '该搜索条件下没有结果。',
        modal_loading: false,
        loading: true,
        modalCreate: false,
        seachText: '',
        editId: '',
        modalEdit: false,
        disciplineID: 0,
        Discipline: [],
        APIPath: this.$store.state.apiPath + '/api/Achievement',
        columns: [],
        datatable: [], // table数据
        formValidateOk: {
          DisciplineID: '',
          AchievementName: '',
          AchievementNumber: '',
          AchievementShort: '',
          AchievementType: '1',
          AchievementHours: '',
          AchievementScore: '',
          AchievementExplain: ''
        },
        delRow: {},
        idsStr: [],
        formValidateEdit: {
          DisciplineID: '',
          AchievementName: '',
          AchievementNumber: '',
          AchievementShort: '',
          AchievementType: '',
          AchievementHours: '',
          AchievementScore: '',
          AchievementExplain: ''
        },
        ruleValidateEdit: {
          DisciplineID: [
            { type: 'number', required: true, message: '请选择学科', trigger: 'change' }
          ],
          AchievementName: [
            { type: 'string', required: true, message: '模块名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '模块名称不能超过20个字', trigger: 'blur' }
          ],
          AchievementNumber: [
            { type: 'string', required: true, message: '模块编号不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '模块编号不能超过20个字', trigger: 'blur' }
          ],
          AchievementShort: [
            { type: 'string', max: 20, message: '模块简称不能超过20个字', trigger: 'blur' }
          ],
          AchievementType: [
            { type: 'string', required: true, message: '请选择模块类别', trigger: 'change' }
          ],
          AchievementHours: [
            { type: 'number', required: true, message: '学时不能为空', trigger: 'change' }
          ],
          AchievementScore: [
            { type: 'number', required: true, message: '学分不能为空', trigger: 'change' }
          ],
          AchievementExplain: [
            { type: 'string', max: 50, message: '说明只能输入50个字符', trigger: 'blur' }
          ]
        },
        tableLoading: true,
        selectionAll: [],
        selectedRowKeys: [],
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
    created () {
      this.getAllDiscipline()
      this.loadTable()
    },
    watch: {

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
    mounted () {
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 加载学科
      async getAllDiscipline () {
        let res = await this.xy.get(this.xyApi + '/base/api/Discipline/GetAllDiscipline', null)
        if (res.success) {
          this.Discipline = res.data
        }
      },
      async loadTable () {
        this.selectedRowKeys = []
        this.selectionAll = []
        this.tableLoading = true
        let res = await this.xy.get(this.$store.state.apiPath + '/api/Achievement/GetAllList', {
          seachText: this.seachText,
          disciplineID: this.disciplineID,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        })
        this.tableLoading = false
        if (res.success) {
          this.columns = [
            {
              title: '学科',
              dataIndex: 'AchievementDisciplineName',
              width: 160
            },
            {
              title: '模块编号',
              dataIndex: 'AchievementNumber',
              width: 200
            },
            {
              title: '模块名称',
              dataIndex: 'AchievementName',
              minWidth: 180,
              scopedSlots: { customRender: 'AchievementName' }
            },
            {
              title: '模块类别',
              dataIndex: 'AchievementTypeName',
              minWidth: 180,
              scopedSlots: { customRender: 'AchievementTypeName' }
            },
            {
              title: '模块学分',
              dataIndex: 'AchievementScore',
              width: 100
            },
            {
              title: '操作',
              dataIndex: 'operation',
              width: 120,
              scopedSlots: { customRender: 'oprate' }
            }
          ]
          this.datatable = res.data.data
          this.datatable.map((item, index) => {
            this.$set(item, 'key', index)
          })
          this.pagination.total = res.data.totalRecords
        }
      },
      typeValueSearch (val) {
        this.pagination.current = 1
        this.disciplineID = val
        this.loadTable()
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      cancelView () {
        this.$refs.formValidateEdit.resetFields()
        this.modalEdit = false
      },
      // 编辑
      edit (row) {
        this.$store.commit('common/getThreeMenuName', '编辑')
        this.$store.commit('common/getParam', row)
        this.$router.push({ path: `/xyHome/AchievementEdit`, query: this.$store.state.common.menuInfo })
      },
      // 编辑保存
      editok () {
        this.$refs.formValidateEdit.validate((valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            this.xy.post(this.APIPath + 'Edit', {
              AchievementID: this.editId,
              AchievementName: this.formValidateEdit.AchievementName,
              AchievementNumber: this.formValidateEdit.AchievementNumber,
              AchievementShort: this.formValidateEdit.AchievementShort,
              AchievementDisciplineID: this.formValidateEdit.DisciplineID,
              AchievementType: this.formValidateEdit.AchievementType,
              AchievementHours: this.formValidateEdit.AchievementHours,
              AchievementScore: this.formValidateEdit.AchievementScore,
              AchievementExplain: this.formValidateEdit.AchievementExplain
            }).then(res => {
              if (res.success) {
                this.changeLoading()
                this.xy.msgSuc('编辑成功。')
                this.loadTable()
                this.modalEdit = false
                this.$refs.FormData.resetFields()
              } else {
                this.xy.msgError('编辑失败。')
                this.changeLoading()
              }
            })
          }
        })
      },
      delall () {
        if (this.selectionAll.length < 1) {
          this.xy.msgError('请选择要删除的模块。')
        } else {
          $.each(this.selectionAll, (index, item) => {
            this.idsStr.push(item.AchievementID)
          })
          this.xy.confirm(
            '批量删除',
            '<p>您确认要删除选中的模块信息吗？</p>',
            this.onDelAllOk
          )
        }
      },
      async onDelAllOk () {
        let res = await this.xy.post(this.APIPath + '/Deletes?ids=' + this.idsStr.join(','), null)
        if (res.success) {
          if (this.selectionAll.length === this.datatable.length && this.datatable.length >= 1) {
            this.pagination.current = this.pagination.current - 1
          }
          this.selectionAll = []
          this.xy.msgSuc('批量删除成功。')
        } else {
          this.xy.msgError(res.msg)
        }
        this.loadTable()
      },
      // 单击删除单个内容触发
      dele (row) {
        this.delRow = row
        this.xy.confirm(
          '删除',
          '<p>您确认要删除"' + row.AchievementName + '"模块吗？</p>',
          this.onDelOneOk
        )
      },
      async onDelOneOk () {
        let res = await this.xy.post(this.APIPath + '/Delete?id=' + this.delRow.AchievementID, null)
        if (res.success) {
          if (this.datatable.length > 1) {
            this.datatable.length = this.datatable.length - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.xy.msgSuc('删除成功。')
        } else {
          this.xy.msgError(res.msg)
        };
        this.loadTable()
      },
      // 搜索触发
      fromSubmit () {
        this.seachText = this.seachText
        this.pagination.current = 1
        this.loadTable()
      },
      // 创建
      CreateMod () {
        this.$store.commit('common/getThreeMenuName', '创建模块')
        this.$router.push({ path: `/xyHome/AchievementCreat`, query: this.$store.state.common.menuInfo })
      // xy.http.load(xy.string.format('{0}/View/eaAchievement/AchievementManage/PC/View/AchievementCreat.html', xy.subMenuWebUrl))
      }
    }

  }

</script>

<style lang="less" scpoed>
</style>
