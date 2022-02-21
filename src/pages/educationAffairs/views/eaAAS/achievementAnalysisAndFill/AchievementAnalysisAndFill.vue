<template>
    <!-- 教学质量：成绩分析成绩填报 -->
    <div class="xy-content-module">
        <div class="xy-content-title clearfix">
            <!--搜索-->
            <div class="xy-flex">
                <div style="margin-right:15px">
                    <span>学年学期：</span>
                    <cascader v-model="searchDefaultValue"
                            :data="defaultList"
                            not-found-text="暂无数据"
                            @on-change="cascaderFunDefault"
                            placeholder="请选择学年/学级"
                            style="width:200px; display:inline-block">
                    </cascader>
                </div>
                <Input search
                        v-model.trim="searchName"
                        @on-search="FromSubmit"
                        placeholder="请输入考试名称"
                        style="width: 200px;" />
            </div>
        </div>
        <div class="xy-content-body">
          <XyAntTable
          :columns="columns"
          :dataSource="datatable"
          :nullData="nullData"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
          >
          <div slot="ArrangeSupervisorExamName" style="min-width:200px" slot-scope="text, record">
            <span :class="record.IsImport === '已导入' ? '' : 'table-el-hover'" @click="record.IsImport === '已导入' ? '' : exportExel(record.ArrangeSupervisorExamID)">
              {{ record.ArrangeSupervisorExamName}}
            </span>
          </div>
          <span slot="operation" slot-scope="text, record">
            <a :disabled="record.IsImport === '已导入'" @click="exportExel(record.ArrangeSupervisorExamID)">导入</a>
            <a-divider type="vertical" />
            <a :disabled="record.IsImport !== '已导入'" @click="del(record.ArrangeSupervisorExamID)">删除</a>
          </span>
        </XyAntTable>
        </div>

        <!-- 导入必选 -->
        <xy-upfile ref="upfile"
          :modalTitle="upload.title"
          :describeData="upload.tipData"
          :fileFormt="upload.formtData"
          :fileSize="upload.size"
          :importPath="upload.upUrl"
          :paramsData="upload.upParams"
          :templateUrl="upload.templateUrl"
          :errorUrl="upload.errorUrl"
          @successLoad="modalSubmit">
        </xy-upfile>
    </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  import XyUpfile from '@/components/upFile/XyUpfile.vue'

  export default {
    name: 'AchievementAnalysisAndFill',
    components: {
      XyAntTable,
      XyUpfile
    },
    data () {
      return {
        nullData: '该搜索条件下没有结果。',
        datatable: [],
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
        searchName: '',
        // 选择的学年学期
        searchDefaultValue: [0, 0],
        // 学年学期下拉列表
        defaultList: [
          {
            value: 0,
            label: '所有学年',
            children: [
              {
                value: 0,
                label: '所有学期'
              }
            ]
          }
        ],
        columns: [
          {
            title: '考试名称',
            dataIndex: 'ArrangeSupervisorExamName',
            scopedSlots: { customRender: 'ArrangeSupervisorExamName' }
          },
          {
            title: '考试类型',
            dataIndex: 'AchievementTypeName',
            width: 140
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 200
          },
          {
            title: '学期',
            dataIndex: 'AcademicSessionName',
            width: 120
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
            title: '状态',
            dataIndex: 'IsImport',
            width: 100
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: 120,
            scopedSlots: { customRender: 'operation' }
          }
        ],
        // 下拉框集合
        yearData: [],
        sessionData: [],
        // 导入
        upload: {
          title: '',
          tipData: [],
          formtData: [],
          size: 0,
          upParams: {},
          upUrl: '', // 上传文件url
          templateUrl: '', // 模板下载url
          errorUrl: '' // 下载错误文件url
        }
      }
    },
    created () {
      this.getFilterData()
    },
    mounted () {
    },
    methods: {
      handleTableChange () {
        this.getAll()
      },
      // 搜索触发
      FromSubmit () {
        this.pagination.current = 1
        this.getAll()
      },
      async del (id, name) {
        this.$Modal.confirm({
          title: '删除',
          content: '您确认要删除吗？',
          onOk: () => {
            this.delObj(id)
          }
        })
      },
      async delObj (id) {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AnalyseRule/EditScoreByExaminationId?ExaminationId=${id}`)
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          if (this.datatable.length > 1) {
            this.datatable.length = this.datatable.length - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.getAll()
        }
      },
      // 导入考试成绩
      exportExel (id) {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '导入考试成绩',
          tipData: [''],
          formtData: ['xlsx', 'xls'],
          size: 10240,
          upParams: {},
          upUrl: `${this.$store.state.apiPath}/api/AnalyseRule/Import?examiontionid=${id}`, // 上传文件url
          templateUrl: `${this.$store.state.apiPath}/api/AnalyseRule/DownloadTemplate`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/AnalyseRule/DownloadErrorException` // 下载错误文件url
        }
      },
      modalSubmit () {
        this.pagination.current = 1
        this.getAll()
      },
      // 获取学年学期
      async getFilterData () {
        var that = this
        let res = await that.xy.get(`${that.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          if (res.data.length > 0) {
            // 生成学年学期列表
            res.data.forEach(function (item) {
              that.defaultList.push(item)
            })
            // 默认选取当前选中的学年和学期
            for (var i = 0; i < res.data.length; i++) {
              for (var j = 0; j < res.data[i].children.length; j++) {
                if (res.data[i].IsCurrent && res.data[i].children[j].IsCurrent) {
                  that.searchDefaultValue[0] = res.data[i].value
                  that.searchDefaultValue[1] = res.data[i].children[j].value
                }
              }
            }
          }
          // 获取table数据需要的参数
          this.getAll()
        }
      },
      // 选择学年学期
      cascaderFunDefault (value) {
        if (value.length === 2) {
          this.searchDefaultValue[0] = this.yearID = value[0]
          this.searchDefaultValue[1] = this.sessionID = value[1]
          this.pagination.current = 1
          this.getAll()
        }
      },
      async getAll () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AnalyseRule/GetExaminationInfo`, {
          academicYearID: this.searchDefaultValue[0],
          academicSessionID: this.searchDefaultValue[1],
          examinationName: this.searchName,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        })
        this.tableLoading = false
        if (res.success) {
          this.pagination.total = res.data.totalRecords
          this.datatable = res.data.data
        }
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
