<!-- 教师统计情况 -->
<template>
<div>
  <div class="programme" v-if="questionnaireId !== 0 && SchoolDistrictID !== 0">
      <div class="bgColor"></div>
      <div class="name-box" style="flex-direction:column">
          <div class="name-box-teacher">
            <span class="cell-left">问卷名称：</span>
            <ul class="cell-right">
                <li v-for="(item,index) in this.$parent.dataList" :key="index" class="class-strategy" :class="{active: index == num}" @click="changeindex(index)">
                    <span>{{item.QuestionnaireTitle}}</span>
                </li>
            </ul>
            </div>
            <div class="name-box-teacher">
              <span class="cell-left" v-if="TeachersType === 1">班级名称：</span>
              <span class="cell-left" v-if="TeachersType === 2">学科名称：</span>
              <ul class="cell-right">
                  <li v-for="(item,index) in DisciplineList" :key="index" class="class-strategy" :class="{active: index == num2}" @click="changeindex1(index)">
                    <span>{{TeachersType === 1?item.ClassName:TeachersType === 2?item.DisciplineName:''}}</span>
                  </li>
              </ul>
            </div>
          </div>
          <div class="summary-subobject-wrap">
            <div class="summary-subobject">
                <div>参评学生：<span>{{StudentCount}}</span>人</div>
                <div>被评价教师：<span>{{TeacherCount}}</span>人</div>
            </div>
            <div>
            <Input search v-model="searchTxt" @on-search="FromSubmit" placeholder="用户名/姓名" style="width: 200px;" />
          </div>
      </div>
      <div class="bgColor"></div>
      <div class="xy-content-box">
        <!-- 班主任 -->
        <div v-if="TeachersType === 1" class="xy-table">
          <XyAntTable
            :columns="columns"
            :dataSource="datable"
            :tableLoading="tableLoading"
            :nullData="nullData"
            :pagination="pagination"
            @change="handleTableChange"
            :scrollx="'max-content'"
            :isBorder="true"
            >
          </XyAntTable>
        </div>
        <!-- 任课教师 -->
        <div v-else-if="TeachersType === 2" class="xy-table">
          <XyAntTable
            :columns="columns"
            :dataSource="datable"
            :tableLoading="tableLoading"
            :nullData="nullData"
            :pagination="pagination"
            @change="handleTableChange"
            :scrollx="'max-content'"
            :isBorder="true"
            >
          </XyAntTable>
        </div>
      </div>
  </div>
  <div v-else id="none"></div>
</div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'Teacher',
    components: {
      XyAntTable
    },
    props: {
      SchoolDistrictID: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        searchTxt: '',
        datable: [],
        columns: [],
        num: 0, // 当前问卷索引
        num2: 0, // 当前学科或班级索引
        DisciplineList: [], // 学科名称
        TeachersType: 0, // 教师类型
        StudentCount: 0, // 参评学生
        TeacherCount: 0, // 被评价教师
        questionnaireId: 0,
        disciplineID: 0,
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
            if (this.datable.length > this.pagination.pageSize) {
              this.pagination.pageSize = this.datable.length
            } else {
              this.pagination.pageSize = pageSize
            }
            this.$nextTick(() => {
              let a = document.getElementsByClassName('ant-select-selection-selected-value')
              if (a.length !== 0) {
                a[0].innerHTML = pageSize + '条/页'
              }
            })
          }
        },
        merge: {}, // 合并单元格
        mergeORnot: false, //  是否有合并单元格
        sortField: 'SchoolRank' // 学校排名 OR 年级班级排名
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      handleTableChange (pagination, filters, sorter) {
        let order = sorter.order === undefined ? sorter.order : sorter.order.substring(0, sorter.order.length - 3)
        if (order === 'asc') {
          if (sorter.columnKey === 'SchoolRank') {
            this.sortField = 'SchoolRank'
            this.$emit('rankFun', true, order, 'normal')
          } else if (sorter.columnKey === 'GroupRank') {
            this.sortField = 'GroupRank'
            this.$emit('rankFun', true, 'normal', order)
          }
        }
        if (order === 'desc' || order === 'normal') {
          if (sorter.columnKey === 'SchoolRank') {
            this.sortField = 'SchoolRank'
            this.$emit('rankFun', false, order, 'normal')
          } else if (sorter.columnKey === 'GroupRank') {
            this.sortField = 'GroupRank'
            this.$emit('rankFun', false, 'normal', order)
          }
        }
        this.getTeacherSummary()
      },
      // 切换问卷查学科
      changeindex (i) {
        this.num = i
        if (this.$parent.dataList.length !== 0) {
          this.questionnaireId = this.$parent.dataList[this.num].QuestionnaireID
          this.TeachersType = this.$parent.dataList[this.num].ApplyToRole
          if (this.questionnaireId > 0) {
            this.getSummaryPep()
            if (this.TeachersType === 1) {
              this.getGrade()
            }
            if (this.TeachersType === 2) {
              this.getDiscipline()
            }
          }
        }
        // 重置：按全校排名 正序
        this.sortField = 'SchoolRank'
        this.$emit('rankFun', true, 'asc', 'normal') // 后俩个参数：全校排名 年级排名
      },
      // 方案人数
      async getSummaryPep () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetSummaryJoinCountForProject`, {
          questionnaireID: this.questionnaireId
        })
        if (res.success) {
          this.StudentCount = res.data.StudentCount
          this.TeacherCount = res.data.TeacherCount
        }
      },
      // 获取班级
      async getGrade () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetClassesForTeacherSummary`, {
          QuestionnaireID: this.questionnaireId
        })
        if (res.success) {
          this.DisciplineList = res.data
          this.DisciplineList.unshift({
            ClassID: '',
            ClassName: '所有班级'
          })
          this.changeindex1(0)
        }
      },
      // 获取学科
      async getDiscipline () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetDisciplines`, {
          questionnaireID: this.questionnaireId
        })
        if (res.success) {
          this.DisciplineList = res.data
          this.DisciplineList.unshift({
            DisciplineID: 0,
            DisciplineName: '所有学科'
          })
          this.changeindex1(0)
        }
      },
      // 获取统计汇总，教师统计情况
      async getTeacherSummary () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetSummaryTableForTeacher`, {
          questionnaireID: this.questionnaireId,
          sortField: this.sortField,
          isRankAsc: this.$parent.newRank2,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          disciplineIDOrClassID: this.disciplineID,
          tableType: 1,
          searchTxt: this.searchTxt
        })
        this.tableLoading = false
        if (res.success) {
          this.pagination.total = res.data.TotalRecords
          this.merge = res.data.Table.MergeMap
          // 排名加排序
          let newClumns = res.data.Table.Columns
          newClumns.map((item, index) => {
            this.$set(item, 'dataIndex', item.key)
            item.dataIndex = item.key
            if (item.key === 'SchoolRank') {
              item.sortType = this.$parent.Stype
              item.sorter = (a, b) => a.Rank > b.Rank
              item.sortDirections = ['ascend', 'descend']
              item.width = 120
            }
            if (item.key === 'GroupRank') {
              item.sortType = this.$parent.Gtype
              item.sorter = (a, b) => a.Rank > b.Rank
              item.sortDirections = ['ascend', 'descend']
              item.width = 120
            }
          })
          this.columns = newClumns
          // 添加头像
          this.columns.unshift({
            title: ' ',
            width: 44,
            dataIndex: 'Icon'
          })
          this.columns.map((item, i) => {
            if (i < 2) {
              this.$set(item, 'fixed', 'left')
            }
            item.customRender = (value, row, index) => {
              const obj = this.merge[index] ? {
                children: i === 0 ? !row.Icon
                  ? <div class="table-pic">
                    <div class={row.TeacherSex === 0 ? 'head-con woman' : 'head-con man'}>
                      <span class="head-font">
                        { this.xy.showName(row.TeacherFullName)}
                      </span>
                    </div>
                  </div>
                  : <img style="width:30px;height:30px;border-radius:50%" src={this.$store.state.apiPath + row.Icon + '?' + Math.random() * 15} />
                  : value,
                attrs: {
                  colSpan: this.merge[index][i] ? this.merge[index][i].ColSpan : '',
                  rowSpan: this.merge[index][i] ? this.merge[index][i].RowSpan : ''
                }
              } : {
                children: i === 0 ? !row.Icon
                  ? <div class="table-pic">
                    <div class={row.TeacherSex === 0 ? 'head-con woman' : 'head-con man'}>
                      <span class="head-font">
                        { this.xy.showName(row.TeacherFullName)}
                      </span>
                    </div>
                  </div>
                  : <img style="width:30px;height:30px;border-radius:50%" src={this.$store.state.apiPath + row.Icon + '?' + Math.random() * 15} />
                  : value,
                attrs: {}
              }
              return obj
            }
          })
          let s = this.pagination.pageSize
          this.datable = res.data.Table.Datas
          if (this.datable.length > this.pagination.pageSize) {
            this.pagination.pageSize = this.datable.length
            this.$nextTick(() => {
              let a = document.getElementsByClassName('ant-select-selection-selected-value')
              if (a.length !== 0) {
                a[0].innerHTML = s + '条/页'
              }
            })
          }
          // 判断是否有合并单元格
          if (Object.keys(this.merge).length === 0) {
            this.mergeORnot = false
          } else {
            this.mergeORnot = true
          }
        }
      },

      // 根据学科查数据
      changeindex1 (i) {
        this.num2 = i
        if (this.TeachersType === 1) {
          this.disciplineID = this.DisciplineList[this.num2].ClassID
        }
        if (this.TeachersType === 2) {
          this.disciplineID = this.DisciplineList[this.num2].DisciplineID
        }
        this.pagination.current = 1
        this.getTeacherSummary()
      },
      // 搜索
      FromSubmit () {
        this.pagination.current = 1
        this.searchTxt = this.searchTxt
        this.getTeacherSummary()
      }
    }
  }
</script>
<style lang='less' scoped>
/deep/ .ant-table-fixed-left .ant-table-row-level-0 td {
  border-right: 0 !important;
}
/deep/ .ant-table-fixed-left th {
  border-right: 0 !important;
}
// table部分
.xy-content-box{
  .ivu-page{
      text-align: right;
      margin-top: 20px;
    }
}
.summary-subobject-wrap{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
