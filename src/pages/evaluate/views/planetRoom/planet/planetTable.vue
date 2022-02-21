<template>
  <div class='xy-content-module'>
    <div class="xy-content-title xy-flex xy-between">
      <div class="">
        <Button class="xy-primary" @click="creat">创建方案</Button>
        <Button class="xy-info" @click="target">类别设置</Button>
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="tableData"
        :nullData="'该搜索条件下没有结果。'"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
        <!-- 方案名称 -->
        <div slot="StarProgrammeName" style="min-width:200px" slot-scope="text,record">
          <span class="table-el-hover" @click="edit(record)">
            {{record.StarProgrammeName}}
          </span>
        </div>
        <!-- 状态 -->
        <div slot="IsComplete"  slot-scope="text,record">
          <a-switch checked-children="启用" un-checked-children="关闭"   :checked="record.IsEnable"  @change="swithChange(record)" />
        </div>
        <!-- 操作 -->
        <div slot="operation" slot-scope="text, record">
          <a  @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a :disabled="record.IsEnable" @click="del(record)">删除</a>
        </div>
        </XyAntTable>
    </div>>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    name: '',
    data () {
      return {
        yearSemester: [],
        yearSemesterList: [],
        schoolGrade: [],
        schoolGradeList: [],
        tableLoading: false,
        switchLoading: false,
        tableData: [],
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
            title: '方案名称',
            dataIndex: 'StarProgrammeName',
            fixed: 'left',
            scopedSlots: { customRender: 'StarProgrammeName' }
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 250,
            scopedSlots: { customRender: 'SchoolDistrictName' }
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeNameForStudentYearName',
            width: 250,
            scopedSlots: { customRender: 'StudentGradeNameForStudentYearName' }
          },
          {
            title: '状态',
            dataIndex: 'IsComplete',
            width: 100,
            scopedSlots: { customRender: 'IsComplete' }
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: 120,
            scopedSlots: { customRender: 'operation' }
          }
        ]
      }
    },
    created () {
      this.getList()
    },
    mounted () {},
    methods: {
      handleTableChange () {
        this.getList()
      },
      // 获取列表
      getList () {
        // /api/StarProgramme/GetProgrammePage
        this.tableLoading = true
        this.xy.get(`${this.$store.state.apiPath}/api/StarProgramme/GetProgrammePage`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
          // schoolDistrictID: this.schoolGrade[0],
          // studentGradeForStudentYearID: this.schoolGrade[1],
          // academicYearID: this.yearSemester[0],
          // academicSessionID: this.yearSemester[1],
          // name: this.searchName
        }).then(res => {
          if (res.success) {
            this.pagination.total = res.data.totalRecords
            this.tableData = res.data.data
          }
          this.tableLoading = false
        })
      },
      // 启用，停用
      async swithChange (row) {
        this.switchLoading = true
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarProgramme/UpdateProgrammeState?starProgrammeID=${row.StarProgrammeID}&isEnable=${row.IsEnable ? 0 : 1}`)
        // this.xy.unloading()
        this.switchLoading = false
        if (res.success) {
          if (row.IsEnable) { // 关闭
            this.xy.msgSuc('关闭成功。')
          } else {
            this.xy.msgSuc('启用成功。')
          }
          this.getList()
        }
      },
      // 创建方案
      creat () {
        this.$store.commit('common/getThreeMenuName', '创建方案')
        this.$store.commit('evaluate/changeEvaDipperObj', {
          StarProgrammeID: 0,
          StarProgrammeName: ''
        })
        this.$store.commit('common/getParam', { pro: 'planetEva', step: 0 })
        this.$router.push({
          path: '/xyhome/planetStepsHeader/planetCreate',
          query: this.$store.state.common.menuInfo
        })
        // this.$router.push({ path: '/xyhome/plantStepsHeader' })
      },
      target () {
        this.$store.commit('common/getThreeMenuName', '类别设置')
        this.$store.commit('common/getParam', { pro: 'planetEva' })
        this.$router.push({
          path: '/xyhome/planetSetting',
          query: this.$store.state.common.menuInfo
        })
      },
      changeSchool () {},
      changeYear () {},
      // 获取校区、年级
      getSchoolGrade (resObj) {
        // this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/GetSchoolDistrictForStudentGradeStudentYears`).then(res => {
          // this.xy.unloading()
          if (res.success) {
            let resData = res.data
            resData.map(item => {
              item.value = item.ID
              item.label = item.Name
              item.children = item.Childrens
              item.children.map(cItem => {
                cItem.value = cItem.StudentYearForSchoolDistrictID
                cItem.label = cItem.FullName
                return cItem
              })
              item.children.unshift({
                value: 0,
                label: '所有年级'
              })
              return item
            })
            this.schoolGradeList = res.data
            if (this.schoolGradeList.length > 0 && this.schoolGradeList[0].children.length > 0) {
              this.schoolGrade = [this.schoolGradeList[0].value, this.schoolGradeList[0].children[0].value]
            }
            this.getList()
            // this.getTableSessionNodeList()
          }
        })
      },
      // 获取学年、学期
      getTableSessionNodeList (resObj) {
        // this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          // this.xy.unloading()
          if (res.success) {
            this.yearSemesterList = res.data
            let index = this.yearSemesterList.map(item => {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.yearSemester.push(this.yearSemesterList[index].value)
              let index1 = this.yearSemesterList[index].children.map(item => {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                this.yearSemester.push(this.yearSemesterList[index].children[index1].value)
              }
            } else {
              for (let i = 0; i < this.yearSemesterList.length; i++) {
                if (this.yearSemesterList[i].children.length > 0) {
                  this.yearSemester = [this.yearSemesterList[i].value, this.yearSemesterList[i].children[0].value]
                  return false
                }
              }
            }
            this.getList()
          }
        })
      },
      // 删除
      del (row) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + row.StarProgrammeName + '"吗，确认删除后不保留历史数据？',
          onOk: () => {
            this.delObj(row.StarProgrammeID)
          }
        })
      },
      async delObj (id) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StarProgramme/DeleteProgramme?StarProgrammeID=${id}`)
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.getList()
        }
      },
      // 改变当前页显示的数量
      changePageSize (size) {
        if (this.pageSize !== size) {
          this.pageSize = size
          this.getList()
        }
      },
      // 改变当前页
      changePage (index) {
        if (this.pageIndex !== index) {
          this.pageIndex = index
          this.getList()
        }
      },
      // 编辑
      edit (row) {
        this.$store.commit('evaluate/changeEvaDipperObj', {
          StarProgrammeID: row.StarProgrammeID,
          StarProgrammeName: row.StarProgrammeName,
          IsEnable: row.IsEnable
        })
        this.$store.commit('common/getThreeMenuName', row.StarProgrammeName)
        this.$store.commit('common/getParam', { pro: 'planetEva', step: 0 })
        this.$router.push({
          path: '/xyhome/planetStepsHeader/planetCreate',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang='less' scoped>
</style>
