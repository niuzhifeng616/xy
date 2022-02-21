// 音体美成绩管理-音体美成绩录入 管理查看页面1
<template>
  <div class="xy-content-module">
      <!-- 面包屑 -->
      <div class="xy-content-title clearfix">
        <div class="fr pr">
            <i-col class="fl xy-content-title-search">
              <Select v-model="typeID" style="width: 150px;" @on-change="reLoadTable" placeholder="全部班级">
                <Option :value="0">
                  全部班级
                </Option>
                <Option :value="item.StudentOrganizationID" v-for="(item, index) in typeList" :key="index">
                  {{item.StudentOrganizationName}}
                </Option>
              </Select>
            </i-col>
            <i-col class="fl xy-content-title-search">
              <i-input search v-model.trim="searchText" @on-search="reLoadTable" placeholder="按学生姓名或学号查找" class="fr xy-content-title-search">
                <icon type="ios-search cursor-p" slot="suffix" />
              </i-input>
            </i-col>
        </div>
      </div>
      <div class="xy-content-body">
        <XyAntTable
          :columns="columns"
          :dataSource="tableData"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
        >
          <!--姓名-->
          <div slot="FullName" slot-scope="text,record">
              <span class="table-el-hover" @click="detail(record)">
                {{record.FullName}}
              </span>
          </div>
          <!--操作-->
          <span slot="oprateRender" slot-scope="text,record">
            <a @click="detail(record)">查看</a>
            <a-divider type="vertical" />
             <a @click="edit(record)" :disabled='!record.IsCanEdit'>编辑</a>
          </span>

        </XyAntTable>
      </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'ExamListDetailFitness',
    components: {
      XyAntTable
    },
    data () {
      return {
        // 上一页数据
        ExaminationID: this.$store.state.common.menuInfo.ExaminationID,
        couldEdit: this.$store.state.common.menuInfo.couldEdit,
        // 搜索
        typeID: 0,
        typeList: [],
        searchText: '',
        // 表格
        columns: [
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            fixed: 'left',
            width: 120
          },
          {
            title: '学级',
            dataIndex: 'StudentYearName',
            fixed: 'left',
            width: 100
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeName',
            fixed: 'left',
            width: 80
          },
          {
            title: '班级',
            dataIndex: 'StudentOrganizationName',
            fixed: 'left',
            width: 80
          },
          {
            title: '姓名',
            dataIndex: 'FullName',
            fixed: 'left',
            width: 100,
            // render: (h, params) => {
            //   return h('div', [
            //     h('span', {
            //       class: 'table-el-hover',
            //       on: {
            //         click: () => {
            //           this.detail(params.row)
            //         }
            //       }
            //     }, params.row.FullName)
            //   ])
            // }
            scopedSlots: { customRender: 'FullName' }
          }
        ],
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
            this.pageIndex = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
            this.pageInde = 1
            this.pageSize = pageSize
          }
        },
        tableData: [{}],
        total: 0, // 总条数
        pageSize: 15,
        pageIndex: 1
      }
    },
    created () {
      this.getTypeList()
      this.getTableHeader()
    },
    mounted () {
      this.$nextTick(() => {
      })
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      async getTableHeader () {
        let that = this
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AchievementOfSportItem/GetSportItemDynimicCol', null)
        if (res.success) {
          res.data.forEach((item) => {
            that.columns.push({
              title: item.SportItemName + '(' + item.Unit + ')',
              dataIndex: item.ColName,
              width: 160
            })
          })
          // 设置表格操作列
          var lastCol = {
            title: '操作',
            width: 130,
            scopedSlots: { customRender: 'oprateRender' }
          }
          that.columns.push(lastCol)
          that.loadTable()
        }
      },
      //  获取table分页数据
      async loadTable () {
        this.tableLoading = true
        // this.xy.loading()
        let params = {
          ExaminationID: this.ExaminationID,
          StudentOrgID: this.typeID,
          SearchStr: this.searchText,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        }
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AchievementOfSportItem/GetSportItemExaminationStudentPageList', params)
        this.tableLoading = false
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
          // this.total = res.data.totalRecords
        }
      },
      // 所有班级
      async getTypeList () {
        let res = await this.xy.get(this.$store.state.apiPath + `/api/AemBase/GetStudentOrganization?ExaminationID=${this.ExaminationID}`, null)
        if (res.success) {
          this.typeList = res.data
        }
      },
      reLoadTable () {
        this.pageIndex = 1
        this.pagination.current = 1
        this.loadTable()
      },
      // 查看
      detail (row) {
        this.$store.commit('common/getThreeMenuName', '查看详情')
        this.$store.commit('common/getParam', {
          'ExaminationID': this.ExaminationID,
          'StudentID': row.StudentID,
          'FullName': row.FullName,
          'UserName': row.UserName,
          'Sex': row.Sex,
          'couldEdit': this.couldEdit
        })
        this.$router.push({ path: `/xyHome/ExamListStudentDetail`, query: this.$store.state.common.menuInfo })
      },
      // 编辑
      edit (row) {
        this.$store.commit('common/getThreeMenuName', '编辑')
        this.$store.commit('common/getParam', {
          'ExaminationID': this.ExaminationID,
          'StudentID': row.StudentID,
          'FullName': row.FullName,
          'UserName': row.UserName,
          'Sex': row.Sex,
          'couldEdit': this.couldEdit
        })
        this.$router.push({ path: `/xyHome/ExamListModifyStudentScore`, query: this.$store.state.common.menuInfo })
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
