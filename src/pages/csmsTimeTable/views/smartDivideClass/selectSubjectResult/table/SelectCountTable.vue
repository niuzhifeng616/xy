<!-- 2.选课结果-table -->
<template>
  <div id="selectResult">
    <XyAntTable :rowSelection="tableRowSelection"
                :columns="columns"
                :scrollx="'max-content'"
                :dataSource="dataTable"
                nullData="该搜索条件下没有结果。"
                :tableLoading="tableLoading"
                :pagination="pagination"
                @change="handleTableChange">
      <div slot="Icon"
           slot-scope="text, record">
        <div v-if="!record.Icon"
             :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
          <span class="head-font">
            {{ xy.showName(record.FullName)}}
          </span>
        </div>
        <img style="width:30px;height:30px;border-radius:50%"
             v-else
             :src="record.Icon + '?' + Math.random() * 15">
      </div>
      <div slot="FullName"
           slot-scope="text, record">
        <div :class="smartDivideStepsHeader.isOperation === 0 ? 'table-el-hover' : ''"
             @click="adjust(record)">
          {{record.FullName}}
        </div>
      </div>
      <template v-for='(item,index) in disciplineList'>
        <div :slot="'result' + index" slot-scope="text, record" :key='index'>
          <div style="min-width:100px">{{record['result' + index]}}</div>
        </div>
      </template>
      <div slot="oprateRender"
           slot-scope="text, record">
        <a @click="adjust(record)"
           :disabled="smartDivideStepsHeader.isOperation !== 0">调整</a>
        <a-divider type="vertical" />
        <a @click="del(record)"
           :disabled="smartDivideStepsHeader.isOperation !== 0">删除</a>
      </div>
    </XyAntTable>
    <modal v-model="adjustSubmodal"
           width=550
           :transfer="false"
           title="调整选课结果"
           :mask-closable="false">
      <div v-if='disciplineList.length>0'>
        <checkbox v-model="t.checked"
                  :key='t.DisciplineID'
                  v-for='t in disciplineList'
                  >
          {{t.DisciplineName}}
        </checkbox>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="sureAdjust">确定</Button>
      </div>
    </modal>
    <XyUpfile ref="upfile"
              @successLoad='batchSubmit'
              :modalTitle="uptitle"
              :describeData="tipData"
              :fileFormt="formtData"
              :fileSize="size"
              :importPath="upUrl"
              :templateUrl="templateUrl"
              :errorUrl="errorUrl">
    </XyUpfile>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  import XyUpfile from '@/components/upFile/XyUpfile.vue'
  export default {
    components: { XyAntTable, XyUpfile },
    data () {
      return {
        // 上传
        uptitle: '导入选科结果',
        tipData: [],
        formtData: ['xls', 'xlsx'],
        size: 1024000,
        upUrl: '',
        templateUrl: '',
        errorUrl: '',
        // 已选学生
        selectionAll: [],
        SelectCount: 0,
        UnSelectCount: 0,
        selectedRowKeys: [],
        tableLoading: true,
        pagination: {
          total: 0,
          current: 1,
          pageSize: 15,
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        pageList: 0,
        dataTable: [],
        columns: [],
        // 调整
        adjustSubmodal: false,
        disciplineList: [],
        smartDivideStepsHeader: {}
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
              disabled: this.smartDivideStepsHeader.isOperation !== 0
            }
          })
        }
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent.$parent
      this.getTable()
    },
    methods: {
      // 获取选课结果（学生）
      async getTable (isdel = false) {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetPageStudentSelectCourse`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          SeachText: this.$parent.searchText,
          StudentOrganizationIDS: this.$parent.classOrganizationIDs,
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          Type: this.$parent.selectNum
        })
        if (res.success) {
          let datas = res.data
          this.SelectCount = datas.SelectCount
          this.UnSelectCount = datas.UnSelectCount
          this.pagination.total = datas.Count
          this.pageList = datas.Result.length
          this.$parent.getClass(isdel)
          this.dataTable = []
          this.columns = []
          this.columns = [
            {
              title: ' ',
              dataIndex: 'Icon',
              width: 48,
              scopedSlots: { customRender: 'Icon' },
              fixed: 'left',
              className: 'table-pic'
            },
            {
              title: '姓名',
              dataIndex: 'FullName',
              fixed: 'left',
              width: 150,
              scopedSlots: { customRender: 'FullName' }
            },
            {
              title: '用户名',
              dataIndex: 'UserName',
              fixed: 'left',
              width: 150
            },
            {
              title: '性别',
              dataIndex: 'SexName',
              width: 80
            },
            {
              title: '原行政班',
              dataIndex: 'StudentOrganizationFullName',
              width: 200
            }
          ]

          for (let i = 0; i < datas.Courses.length; i++) {
            this.columns.push({
              title: datas.Courses[i].DisciplineName,
              dataIndex: 'result' + datas.Courses[i].DisciplineID,
              scopedSlots: { customRender: 'result' + i }
            })
            datas.Courses[i].checked = false
          };
          this.disciplineList = datas.Courses
          this.$parent.getTotal()
          this.columns.push({
            title: '操作',
            dataIndex: 'oprateRender',
            width: 120,
            scopedSlots: { customRender: 'oprateRender' },
            fixed: 'right'
          })
          let resData = datas.Result

          for (let j = 0; j < resData.length; j++) {
            if (resData[j].Courses.length > 0) {
              for (let k = 0; k < resData[j].Courses.length; k++) {
                resData[j]['result' + resData[j].Courses[k].DisciplineID] = resData[j].Courses[k].DisciplineName
              }
            };
            this.$set(resData[j], 'key', j)
          }
          this.dataTable = resData
        }
        this.tableLoading = false
        this.xy.unloading()
      },
      handleTableChange () {
        this.getTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 单击删除单个内容触发
      del (row) {
        if (this.smartDivideStepsHeader.isOperation === 0) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除"' + row.UserName + '"吗？',
            onOk: () => {
              this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/DeleteCollectionStudent`, {
                DivideClassID: this.smartDivideStepsHeader.divideClassID,
                StudentIDS: [row.StudentID]
              }).then(res => {
                if (res.success) {
                  if (this.pageList > 1) {
                    this.pageList = this.pageList - 1
                  } else {
                    if (this.pagination.current > 1) {
                      this.pagination.current = this.pagination.current - 1
                    };
                  };
                  this.xy.msgSuc('删除成功。')
                  this.getTable('del')
                }
              })
            }
          })
        }
      },
      // 批量删除
      delAlls () {
        if (this.selectionAll.length < 1) {
          this.xy.msgError('请勾选要删除的学生。')
        } else {
          let studentIDs = []
          for (let i = 0; i < this.selectionAll.length; i++) {
            studentIDs.push(this.selectionAll[i].StudentID)
          }
          this.$Modal.confirm({
            title: '温馨提示',
            content: '确定删除所选的学生吗？',
            onOk: () => {
              this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/DeleteCollectionStudent`, {
                DivideClassID: this.smartDivideStepsHeader.divideClassID,
                StudentIDS: studentIDs
              }).then(res => {
                if (res.success) {
                  this.xy.msgSuc('删除成功。')
                  if (this.selectionAll.length === this.pageList && this.pagination.current > 1) {
                    this.pagination.current = this.pagination.current - 1
                  }
                  this.getTable('del')
                  this.selectionAll = []
                  this.selectedRowKeys = []
                }
              })
            }
          })
        };
      },
      // 清除全部学生
      clearSubmit () {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要清除所有学生吗?',
          onOk: () => {
            this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/DeleteAllCollectionStudent/?id=${this.smartDivideStepsHeader.divideClassID}`).then(res => {
              if (res.success) {
                this.xy.msgSuc('删除成功。')
                this.getTable('del')
                this.selectionAll = []
              }
            })
          }
        })
      },
      // 选中的调整
      adjust (row) {
        if (this.smartDivideStepsHeader.isOperation === 0) {
          this.adjustSubmodal = true
          this.StudentID = row.StudentID
          // 默认勾选
          if (row.Courses.length > 0) {
            row.Courses.map((item) => {
              this.disciplineList.map((k) => {
                if (item.DisciplineID === k.DisciplineID) {
                  k.checked = true
                }
              })
            })
          }
        }
      },
      cancel () {
        this.adjustSubmodal = false
        this.disciplineList.map((item) => {
          item.checked = false
        })
      },
      // -----------------调整选课弹窗-------------------
      // 确定调整
      async sureAdjust () {
        let arr = []
        this.disciplineList.map((item) => {
          if (item.checked) {
            arr.push(item.DisciplineID)
          }
        })
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/EditStudent`, {
          'StudentID': this.StudentID,
          'DivideClassID': this.smartDivideStepsHeader.divideClassID,
          'DisciplineIDS': arr
        })
        if (res.success) {
          this.xy.unloading()
          this.getTable()
          this.cancel()
        }
      },
      // 导入选科
      batchImport () {
        if (this.smartDivideStepsHeader.isOperation === 0) {
          this.$refs['upfile'].modalImport = true
          this.upUrl = `${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/Import?divideClassID=${this.smartDivideStepsHeader.divideClassID}`
          this.templateUrl = `${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/DownloadTemplateImport?divideClassID=${this.smartDivideStepsHeader.divideClassID}`
          this.errorUrl = `${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/DownloadExceptionImport`
        }
      },
      batchSubmit () {
        this.getTable()
      }
    }

  }
</script>
<style lang='less' scoped>
.img-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
