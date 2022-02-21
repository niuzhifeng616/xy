<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <div class="search-group xy-flex">
        <div class="xy-flex xy-center xy-between">
          <p>校区：</p>
          <i-select v-model="schoolID"
                    class="fl"
                    placeholder="请选择校区"
                    @on-change="schoolChange"
                    style="width:200px;margin-right:10px;">
            <i-option :value="0"
                      :key="0"
                      >所有校区</i-option>
            <i-option v-for="item in schoolList"
                      :value="item.SchoolDistrictID"
                      :key="item.SchoolDistrictID">{{item.SchoolDistrictName}}</i-option>
          </i-select>
        </div>
        <div class="xy-flex xy-center xy-between">
          <p>状态：</p>
          <i-select v-model="stateID"
                    class="fl"
                    placeholder="请选择状态"
                    @on-change="stateChange"
                    style="width:200px;margin-right:10px;">
            <i-option v-for="state in stateList"
                      :value="state.id"
                      :key="state.id">{{ state.name }}</i-option>
          </i-select>

        </div>
        <div class="xy-flex xy-center xy-between">
          <p>学年学期：</p>
          <cascader v-model="searchDefaultValue"
                    class="fl"
                    :clearable="false"
                    :data="defaultList"
                    not-found-text="暂无学年学期"
                    @on-change="cascaderFunDefault"
                    placeholder="请选择学年/学期"
                    style="width:200px;margin-right:10px;">
          </cascader>
        </div>
        <Input search
                  v-model="searchText"
                  @on-search="FromSubmit"
                  placeholder="请输入方案名称"
                  style="width: auto;" />

      </div>
      <div class="create">
        <Button class="xy-primary"
                @click="CreateClick">创建方案</Button>
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        nullData="该搜索条件下没有方案。"
        :scrollx="'max-content'"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange">
        <!-- 方案名称 -->
        <div slot="AssessProjectNameRender" slot-scope="text, record" style="min-width:300px">
          <span class="table-el-hover" @click="stateIn(record)">
            {{record.AssessProjectName}}
          </span>
        </div>
        <!-- 学年学期 -->
        <div slot="AcademicYearNameRender" slot-scope="text, record">
          <span>
            {{record.AcademicYearName}}/{{record.AcademicSessionName}}
          </span>
        </div>
        <!-- 发布状态 -->
        <div slot="ProjectStatusNameRender" slot-scope="text, record">
          <span v-if="record.ProjectStatus===1"><i class="iconfont icon-default">&#xe719;</i>{{record.ProjectStatusName}}</span>
          <span v-if="record.ProjectStatus===2"><i class="iconfont icon-success">&#xe719;</i>{{record.ProjectStatusName}}</span>
        </div>
        <!-- 创建时间 -->
        <div slot="CreateByDateRender" slot-scope="text, record">
          <span>
            {{record.CreateByDate !== null && record.CreateByDate !== '' ? xy.moment(record.CreateByDate).format('YYYY/MM/DD HH:mm') : ''}}
          </span>
        </div>
        <!-- 操作 -->
        <span slot="operaRender" slot-scope="text, record">
          <a @click="stateIn(record)">进入方案</a>
          <a-divider type="vertical" />
          <a :disabled="record.ProjectStatus !== 1" @click="stateDel(record)">删除</a>
        </span>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    name: 'ScheSetting',
    data () {
      return {
        tableLoading: true,
        pageList: 0, // 当前页数据条数
        datatable: [],
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
            dataIndex: 'AssessProjectName',
            scopedSlots: { customRender: 'AssessProjectNameRender' },
            fixed: 'left'
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 200
          },
          {
            title: '学年学期',
            dataIndex: 'AcademicYearName',
            scopedSlots: { customRender: 'AcademicYearNameRender' },
            width: 200
          },
          {
            title: '发布状态',
            dataIndex: 'ProjectStatusName',
            scopedSlots: { customRender: 'ProjectStatusNameRender' },
            width: 150
          },
          {
            title: '创建时间',
            dataIndex: 'CreateByDate',
            scopedSlots: { customRender: 'CreateByDateRender' },
            width: 200
          },
          {
            title: '操作',
            dataIndex: 'opera',
            width: 150,
            scopedSlots: { customRender: 'operaRender' }
          }
        ],

        projectList: [],
        apiPath: `${this.xyApi}/eva`,
        loading: true,
        schoolID: 0,
        schoolList: [],

        // 获取学期学年
        searchDefaultValue: [0, 0],
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
        // 获取状态
        stateID: 0,
        stateList: [
          {
            id: 0,
            name: '所有状态'
          },
          {
            id: 1,
            name: '未发布'
          },
          {
            id: 2,
            name: '已发布'
          }
        ],
        // 搜索内容
        searchText: ''
      }
    },
    created () {
      this.getSchool()
    },
    methods: {
      // 获取table/分页数据
      async getProject () {
        this.tableLoading = true
        let obj = {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          SchoolDistrictId: this.schoolID,
          AcademicYearId: this.searchDefaultValue[0],
          AcademicSessionId: this.searchDefaultValue[1],
          ProjectStatus: this.stateID,
          KeyWords: this.searchText
        }
        let res = await this.xy.get(`${this.apiPath}/api/AssessProject/GetProjectPage`, obj)
        if (res.success) {
          this.pagination.total = res.data.totalRecords
          this.datatable = res.data.data
          if (res.data.data !== null && res.data.data.length > 0) {
            this.pageList = res.data.data.length
          }
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.getProject()
      },
      FromSubmit () {
        this.pagination.current = 1
        this.getProject()
      },
      // 获取所有校区
      async getSchool () {
        let res = await this.xy.get(`${this.xyApi}/base/xy/Comm/SchoolDistrictList`, null)
        if (res.success) {
          this.schoolList = res.data
          this.getFilterData()
        }
      },
      schoolChange () {
        this.pagination.current = 1
        this.getProject()
      },
      // 学年学期
      async getFilterData () {
        let res = await this.xy.get(`${this.xyApi}/base/xy/Comm/GetSessionNodeList`, null)
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            this.defaultList.push(res.data[i])
          }
          this.getProject()
        }
      },
      // 学期改变时
      cascaderFunDefault (value) {
        if (value.length === 2) {
          this.searchDefaultValue = value
          this.pagination.current = 1
          this.getProject()
        };
      },
      // 状态改变时
      stateChange (val) {
        this.pagination.current = 1
        this.getProject()
      },

      // 创建
      CreateClick () {
        this.$store.commit('common/getThreeMenuName', '创建方案')
        this.$store.commit('evaluate/changetopHeader', [])
        this.$store.commit('common/getParam', { teachingProjectID: 0, steps: 0, pro: 'evaluate/ScheSetting', status: 1 })
        this.$router.push({ name: 'ConmmHeader', query: this.$store.state.common.menuInfo })
      // xy.http.load(xy.string.format('{0}/View/evaAluate/SchemeSettings/PC/View/Details.html', xy.subMenuWebUrl), {
      //   loadParams: { 'teachingProjectID': 0 }
      // })
      },
      // 进入方案
      stateIn (vals) {
        // console.log(vals)
        this.$store.commit('evaluate/changetopHeader', [])
        this.$store.commit('common/getThreeMenuName', vals.AssessProjectName)
        // this.$store.commit('common/getParam', { userID: row.UserID })
        this.$store.commit('common/getParam', {
          teachingProjectID: vals.AssessProjectId,
          steps: vals.SetpuStep,
          pro: 'evaluate/ScheSetting',
          // schoolID: vals.SchoolDistrictId,
          // yearID: vals.AcademicYearId,
          // sessionID: vals.AcademicSessionId,
          status: vals.ProjectStatus
        })
        this.$router.push({ name: 'ConmmHeader', query: this.$store.state.common.menuInfo })
      },
      // 删除方案
      stateDel (vals) {
        if (vals.ProjectStatus !== 2) {
          this.xy.confirm('删除', '您确定要删除“' + vals.AssessProjectName + '”吗？', () => this.toDelete(vals))
        } else {
          this.xy.msgError('当前方案已经发布，不允许删除。')
        };
      },
      async toDelete (vals) {
        this.xy.loading()
        let res = await this.xy.get(`${this.apiPath}/api/AssessProject/DeleteProject?projectId=${vals.AssessProjectId}`)
        if (res.success) {
          if (this.pageList > 1) {
            this.pageList = this.pageList - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.xy.msgSuc('删除成功。')
          this.getProject()
        }
        this.xy.unloading()
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module {
  .search-group {
    padding-bottom: 15px;
  }
}
</style>
