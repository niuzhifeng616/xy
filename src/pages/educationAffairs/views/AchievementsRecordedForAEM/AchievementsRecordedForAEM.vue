// 音体美成绩管理-音体美成绩录入 管理页面
<template>
  <div class="xy-content-module">
      <!-- 面包屑 -->
      <div class="xy-content-title clearfix">
        <div class="fr pr">
            <i-col class="fl xy-content-title-search">
              <Select v-model="schoolDistrictID" style="width: 150px;" @on-change="reLoadTable" placeholder="全部校区">
                <Option :value="0">
                  全部校区
                </Option>
                <Option :value="item.SchoolDistrictID" v-for="(item, index) in schoolDistrict" :key="index">
                  {{item.SchoolDistrictName}}
                </Option>
              </Select>
            </i-col>
            <i-col class="fl xy-content-title-search">
              <Select v-model="typeID" style="width: 150px;" @on-change="reLoadTable" placeholder="全部学年">
                <Option :value="0">
                  全部学年
                </Option>
                <Option :value="item.ID" v-for="(item, index) in typeList"
                  :key="index">
                  {{item.Name}}
                </Option>
              </Select>
            </i-col>
            <i-col class="fl xy-content-title-search">
              <i-input search v-model.trim="searchText" @on-search="reLoadTable" placeholder="按考试名称查找" class="fr xy-content-title-search">
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
          <!--考试名称-->
          <div slot="ExaminationName" slot-scope="text,record" style="min-width:220px">
            <span class="table-el-hover" @click="detail(record)">
              {{record.ExaminationName}}
            </span>
          </div>
          <!--状态值-->
          <span slot="PublishStatus" slot-scope="text,record">
            <span v-if="!record.IsPublished"><i class="iconfont icon-default">&#xe719;</i>{{record.PublishStatus}}</span>
            <span v-if="record.IsPublished"><i class="iconfont icon-success">&#xe719;</i>{{record.PublishStatus}}</span>
          </span>
          <!--操作-->
          <span slot="oprateRender" slot-scope="text,record">
            <a @click="detail(record)">查看</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item :disabled="!(inTime(record) && !record.IsPublished)"   @click="importFile(record)">
                  导入
                </a-menu-item>
                <a-menu-item @click="exportFile(record)">
                  导出
                </a-menu-item>
              </a-menu>
              <a> 更多 <a-icon type="down" /></a>
            </a-dropdown>
          </span>
       </XyAntTable>
      </div>
      <XyUpfile ref="upfile"
        :modalTitle="title"
        :describeData="tipData"
        :fileFormt="formtData"
        :fileSize="size"
        :importPath="upUrl"
        :paramsData="upParams"
        :templateUrl="templateUrl"
        :errorUrl="errorUrl"
        >
      </XyUpfile>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import XyUpfile from '@/components/upFile/XyUpfile.vue'
  export default {
    name: 'AchievementsRecordedForAEM',
    components: {
      XyAntTable,
      XyUpfile
    },
    data () {
      return {
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
        // 搜索
        typeID: 0,
        schoolDistrict: [],
        schoolDistrictID: 0,
        typeList: [],
        searchText: '',
        // 表格
        columns: [
          {
            title: '考试名称',
            width: 140,
            dataIndex: 'ExaminationName',
            fixed: 'left',
            scopedSlots: { customRender: 'ExaminationName' }
          },
          {
            title: '考试类型',
            dataIndex: 'ExaminationTypeName',
            width: 100
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 140
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeName',
            width: 120
          },
          {
            title: '学级',
            dataIndex: 'StudentYearName',
            width: 120
          },
          {
            title: '学年',
            dataIndex: 'AcademicYearName',
            width: 140
          },
          {
            title: '学期',
            dataIndex: 'AcademicSessionName',
            width: 100
          },
          {
            title: '成绩录入开始日期',
            dataIndex: 'StartDate',
            width: 150
          },
          {
            title: '成绩录入结束日期',
            dataIndex: 'EndDate',
            width: 150
          },
          {
            title: '状态',
            dataIndex: 'PublishStatus',
            width: 100,
            scopedSlots: { customRender: 'PublishStatus' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 140,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        tableData: [{}],
        total: 0, // 总条数
        pageSize: 15,
        pageIndex: 1,
        // 上传
        title: '批量导入',
        tipData: [],
        formtData: ['xls', 'xlsx'],
        size: 1024000,
        upUrl: '',
        upParams: {},
        templateUrl: '',
        errorUrl: ''
      }
    },
    created () {
      this.getSchoolDistrict()
      this.getTypeList()
    },
    mounted () {
      this.$nextTick(() => {
        this.loadTable()
      })
    },
    methods: {
      handleTableChange () {
        this.loadTable()
      },
      inTime (data) {
        let s = new Date(data.StartDate + 'T00:00:00')
        let e = new Date(data.EndDate + 'T23:59:59')
        let n = new Date()
        if (n >= s && n <= e) {
          return true
        } else {
          return false
        }
      },
      //  获取table分页数据
      async loadTable () {
        this.tableLoading = true
        let params = {
          SchoolDistrictID: this.schoolDistrictID,
          AcademicYearID: this.typeID,
          AcademicSessionID: 0,
          ExaminationName: this.searchText,
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize
        }
        let res = await this.xy.get(this.$store.state.apiPath + '/api/Examination/GetExaminationPageList', params)
        this.tableLoading = false
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
          // this.total = res.data.totalRecords
        }
      },
      // 获取：校区
      async getSchoolDistrict () {
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetSchoolDistrict', null)
        if (res.success) {
          this.schoolDistrict = res.data
        }
      },
      // 所有学年
      async getTypeList () {
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AemBase/GetAcademicYear', null)
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
        if (row.ExaminationType === 1) {
          this.$store.commit('common/getThreeMenuName', '录入查看')
          this.$store.commit('common/getParam', {
            'ExaminationID': row.ID,
            'couldEdit': this.inTime(row) && !row.IsPublished
          })
          this.$router.push({ path: `/xyHome/ExamListDetailFitness`, query: this.$store.state.common.menuInfo })
        } else {
          this.$store.commit('common/getThreeMenuName', '录入查看')
          this.$store.commit('common/getParam', {
            'ExaminationID': row.ID,
            'couldEdit': this.inTime(row) && !row.IsPublished
          })
          this.$router.push({ path: `/xyHome/ExamListDetailNormal`, query: this.$store.state.common.menuInfo })
        }
      },
      // 导入
      importFile (row) {
        if (row.ExaminationType === 1) {
          this.upUrl = this.$store.state.apiPath + `/api/AchievementOfSportItem/ImportAchievementOfSportItem?examinationID=${row.ID}`
          this.templateUrl = this.$store.state.apiPath + '/api/AchievementOfSportItem/ImportTemplateDownload'
          this.errorUrl = this.$store.state.apiPath + '/api/AchievementOfSportItem/DownloadExceptionImport'
          this.$refs['upfile'].modalImport = true
        } else {
          this.upUrl = this.$store.state.apiPath + `/api/AchievementOfArtAndSport/ImportAchievementOfArtAndSport?examinationID=${row.ID}`
          this.templateUrl = this.$store.state.apiPath + `/api/AchievementOfArtAndSport/ImportTemplateDownload?ExaminationID=${row.ID}`
          this.errorUrl = this.$store.state.apiPath + '/api/AchievementOfArtAndSport/DownloadExceptionImport'
          this.$refs['upfile'].modalImport = true
        }
      },
      // 导出
      async exportFile (row) {
        if (row.ExaminationType === 1) {
          let strParams = `${this.$store.state.apiPath}/api/AchievementOfSportItem/ExportSportItemAchievementOfExamination?ExaminationID=${row.ID}`
          this.xy.downFile(strParams)
        } else {
          let strParams = `${this.$store.state.apiPath}/api/AchievementOfArtAndSport/ExportArtAndSportAchievementOfExamination?ExaminationID=${row.ID}`
          this.xy.downFile(strParams)
        }
      }
    }
  }
</script>

<style lang="less">
</style>
