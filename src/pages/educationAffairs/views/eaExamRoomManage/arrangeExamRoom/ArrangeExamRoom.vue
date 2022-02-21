<!-- 这里是排考场功能 -->
<template>
  <div class="xy-content-module">
    <div id="xy-initialize-breadcrumb"></div>
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary" @click="Create">创建方案</Button>
        <Button class="xy-danger" @click="delAll">批量删除</Button>
      </div>
      <div class="fr pr selTit">
        <div>
          <span>校区：</span>
          <cascader
            v-model="StudentDYGID"
            class="fl xy-content-title-search"
            style="width:300px;"
            :clearable="false"
            :data="StudentDYGList"
            not-found-text="您还没有校区/学届/学习阶段的信息。"
            placeholder="请选择校区/学届/学习阶段"
            @on-change="cascaderFun"
            >
          </cascader>
        </div>
        <!-- 学年学期 -->
        <div>
          <span>学年学期：</span>
          <cascader
            v-model="searchDefaultValue"
            class="fl xy-content-title-search"
            :data="defaultList"
            not-found-text="您还没有学年/学期的信息。"
            @on-change="cascaderFunDefault"
            :clearable="false"
            placeholder="请选择学年/学期"
            style="width:220px;"
            >
          </cascader>
        </div>
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :rowSelection="tableRowSelection"
        :columns="columns"
        :dataSource="dataTable"
        :nullData="txt"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        :scrollx="'max-content'"
        >
         <div style="min-width: 180px" slot="ArrangeSupervisorExamName" slot-scope="text, record">
            <span
              v-html="record.ArrangeSupervisorExamName"
              class="ant-table-cell table-el-hover"
              style="display: inline-block"
              @click="edit(record)"
              >
            </span>
          </div>
        <div slot="StudentGradeName" slot-scope="text, record">
          {{record.StudentYearName + record.StudentGradeName}}
        </div>
        <div slot="semester" slot-scope="text, record">
          {{record.AcademicYearName + '-' + record.AcademicSessionName}}
        </div>
        <div slot="StartTime" slot-scope="text, record">
            {{`${xy.moment(record.StartTime).format('YYYY年MM月DD日')}-${xy.moment(record.EndTime).format('MM月DD日')}`}}
          </div>
          <!-- 状态 -->
          <span slot="GenerateStatus" slot-scope="text, record">
            <span v-if="record.GenerateStatus">
              <i class="iconfont icon-success">&#xe719;</i>已发布</span>
            <span v-if="!record.GenerateStatus">
              <i class="iconfont icon-default">&#xe719;</i>未发布</span>
          </span>
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <a @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="del(record)" :disabled='record.GenerateStatus'>删除</a>
        </span>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'ArrangeExamRoom',
    data () {
      return {
        tableLoading: true,
        txt: '该搜索条件下没有结果。',
        pickedArr: [],
        dataTable: [],
        searchName: '',
        // schoolChangeStr: 0,
        modalEdit: false,
        // 选择校区ID
        SchoolDistrictID: 0,
        // 校区下拉列表
        SchoolList: [],
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
        // 选择的考试类型
        TestTypeID: 0,
        TestList: [
          { testID: 1, name: '期末考试' },
          { testID: 2, name: '期中考试' }
        ],
        // 年级
        GradeID: 0,
        GradeList: [
          { GradeID: 1, name: '2017级 高中' },
          { GradeID: 2, name: '2018级 高中' }
        ],
        // 表头
        columns: [
          {
            title: '方案名称',
            dataIndex: 'ArrangeSupervisorExamName',
            scopedSlots: { customRender: 'ArrangeSupervisorExamName' },
            fixed: 'left'
          },
          {
            title: '考试类型',
            dataIndex: 'AchievementTypeName',
            width: 100
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 150
          },
          {
            title: '年级',
            dataIndex: 'StudentGradeName',
            scopedSlots: { customRender: 'StudentGradeName' },
            width: 120
          },
          {
            title: '学期',
            dataIndex: 'semester',
            scopedSlots: { customRender: 'semester' },
            width: 200
          },
          {
            title: '考试日期',
            dataIndex: 'StartTime',
            scopedSlots: { customRender: 'StartTime' },
            width: 210
          },
          {
            title: '状态',
            dataIndex: 'GenerateStatus',
            scopedSlots: { customRender: 'GenerateStatus' },
            width: 100
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width: 130
          }
        ],
        StudentDYGID: [0, 0, 0],
        StudentDYGList: [{
          value: 0,
          label: '所有校区',
          IsCurrent: false,
          children: [{
            value: 0,
            label: '所有学届',
            IsCurrent: false,
            children: [{
              value: 0,
              label: '所有学习阶段',
              IsCurrent: false
            }]
          }]
        }], // 学习阶段
        StudentYearID: 0,
        StudentGradeID: 0,
        AcademicYearID: 0,
        AcademicSessionID: 0,
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
        selectedRowKeys: []
      }
    },
    created () {
      this.getSchool()
    },
    mounted () {
      // 控制级联下拉太宽导致的样式问题
      this.$nextTick(() => {
        $(document).on('mouseenter', '.ivu-cascader-menu .ivu-cascader-menu-item', function (e) {
          $('.ivu-cascader-menu-item').attr('title', e.target.innerText)
        })
      })
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record.GenerateStatus, // Column configuration not to be checked
              ArrangeSupervisorExamID: record.ArrangeSupervisorExamID
            }
          })
        }
      }
    },
    methods: {
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.pickedArr = val
      },
      handleTableChange () {
        this.loadTable()
      },
      async loadTable () {
        this.pickedArr = []
        this.selectedRowKeys = []
        this.tableLoading = true
        const params = {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          AcademicYearID: this.AcademicYearID,
          AcademicSessionID: this.AcademicSessionID,
          SchoolDistrictID: this.SchoolDistrictID,
          StudentYearID: this.StudentYearID,
          StudentGradeID: this.StudentGradeID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ArrangeSupervisorExam/GetArrangeSupervisorPage`, params)
        this.tableLoading = false
        if (res.success) {
          if (res.data) {
            this.dataTable = res.data.data && res.data.data.length ? res.data.data : []
            this.dataTable.map(item => {
              this.$set(item, '_disabled', item.GenerateStatus)
              return item
            })
            this.pagination.total = res.data.totalRecords
          }
        }
      },
      // 获取校区-学届-学习阶段
      async getSchool () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSchoolDistrictNodeList`)
        // this.xy.unloading()
        if (res.success) {
          this.StudentDYGList = [...this.StudentDYGList, ...res.data]
          this.getFilterData()
        }
      },
      cascaderFun (val) {
        if (val.length === 1) {
          this.StudentDYGID = [val[0], 0, 0]
        };
        if (val.length === 2) {
          this.StudentDYGID = [val[0], val[1], 0]
        };
        if (val.length === 3) {
          this.StudentDYGID = val
        };
        this.SchoolDistrictID = this.StudentDYGID[0]
        this.StudentYearID = this.StudentDYGID[1]
        this.StudentGradeID = this.StudentDYGID[2]
        this.pagination.current = 1
        this.loadTable()
      },
      // 获取学年学期
      async getFilterData () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetSessionNodeList`)
        // this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            // 生成学年学期列表
            this.defaultList = [...this.defaultList, ...res.data]
            // 默认选取当前选中的学年和学期
            for (let i = 0; i < res.data.length; i++) {
              for (let j = 0; j < res.data[i].children.length; j++) {
                if (res.data[i].IsCurrent && res.data[i].children[j].IsCurrent) {
                  this.searchDefaultValue[0] = res.data[i].value
                  this.searchDefaultValue[1] = res.data[i].children[j].value
                };
              };
            };
            this.AcademicYearID = this.searchDefaultValue[0]
            this.AcademicSessionID = this.searchDefaultValue[1]
          };
        }
        this.loadTable()
      },
      // 选择学年学期
      cascaderFunDefault (value) {
        if (value.length === 2) {
          this.searchDefaultValue = value
        } else {
          this.searchDefaultValue = [value[0], 0]
        };
        this.AcademicYearID = this.searchDefaultValue[0]
        this.AcademicSessionID = this.searchDefaultValue[1]
        this.pagination.current = 1
        this.loadTable()
      },
      // 编辑
      edit (row) {
        // console.log(row)
        // this.$store.commit('common/getThreeMenuName', '编辑排考场')
        this.$store.commit('common/getParam', null)
        this.$store.commit('educationAffairs/changeArrange', {
          GenerateStatus: row.GenerateStatus,
          IsEnabled: row.IsEnabled,
          ArrangeSupervisorExamID: row.ArrangeSupervisorExamID,
          Steps: row.ProjectStep,
          isIndex: row.ProjectStep,
          ArrangeSupervisorExamName: row.ArrangeSupervisorExamName
        })
        this.$router.push({
          name: 'Parent',
          query: this.$store.state.common.menuInfo
        })
      },
      // 删除
      del (vals) {
        this.xy.confirm('删除', '您确认要删除"' + vals.ArrangeSupervisorExamName + '"吗？', () => {
          this.toDel(vals)
        })
      },
      async toDel (val) {
        // this.xy.loading()
        this.tableLoading = true
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ArrangeSupervisorExam/DeleteByID?id=${val.ArrangeSupervisorExamID}`, null)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          this.xy.msgSuc(res.msg || '删除成功。')
          // this.pagination.current = 1
          // 单个删除：删除最后一页最后一条时，自动返回上一页
          if (this.dataTable.length > 1) {
            this.dataTable.length = this.dataTable.length - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.loadTable()
        }
      },
      // 单击批量删除触发
      delAll () {
        if (!this.pickedArr.length) {
          return this.xy.msgError('请勾选要删除的方案。')
        }
        this.xy.confirm('批量删除', '您确定要删除选中的方案吗？', () => {
          this.batchDele()
        })
      },
      async batchDele () {
        let params = this.pickedArr.map(val => {
          return val.ArrangeSupervisorExamID
        })
        // this.xy.loading()
        this.tableLoading = true
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ArrangeSupervisorExam/DeleteByIDs`, params, null)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          this.xy.msgSuc(res.msg || '删除成功。')
          // 批量删除：选中删除最后一页多条时，自动返回上一页
          if (this.pickedArr.length === this.dataTable.length && this.dataTable.length > 1) {
            this.pagination.current = this.pagination.current - 1
          }
          this.pickedArr = []
          this.loadTable()
        }
      },
      // 跳转到基本信息页
      Create () {
        // this.$store.commit('common/getThreeMenuName', '新增考场')
        this.$store.commit('common/getParam', null)
        this.$store.commit('educationAffairs/changeArrange', {
          GenerateStatus: false,
          IsEnabled: '',
          ArrangeSupervisorExamID: 0,
          Steps: 0,
          ArrangeSupervisorExamName: '',
          SchoolDistrictID: '',
          isIndex: 0
        })
        this.$router.push({
          path: '/xyHome/Parent',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .xy-content-module {
    /deep/ .ivu-cascader-menu-item{
      max-width: 209px;
      overflow-x: hidden;
      text-overflow:ellipsis;
    }
  }
  .xy-content-title {
    padding: 26px 20px;
  }
  .xy-content-body {
    padding: 0 20px;
  }
  .selTit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-left: 18px;
    }
  }
</style>
