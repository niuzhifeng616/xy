<!--教学质量：成绩分析list-->
<template>
    <div class="xy-content-module">
        <div class="xy-content-title">
            <!--搜索-->
            <div class="xy-flex">
                <div style="margin-right:15px">
                    <span>校区：</span>
                    <Select
                      v-model="schoolID"
                      placeholder="请选择校区"
                      @on-change="schoolChange"
                      style="width:200px;">
                        <Option v-for="school in schoolList" :value="school.SchoolDistrictID" :key="school.SchoolDistrictID">{{ school.SchoolDistrictName }}</Option>
                    </Select>
                </div>
                <div style="margin-right:15px">
                    <span>学年学期：</span>
                    <cascader
                      v-model="searchDefaultValue"
                      :data="defaultList"
                      not-found-text="暂无数据"
                      @on-change="cascaderFunDefault"
                      placeholder="请选择学年/学级"
                      style="width:200px; display:inline-block">
                    </cascader>
                </div>
                <Input
                  search
                  v-model="searchName"
                  @on-search="FromSubmit"
                  placeholder="请输入考试名称"
                  style="width: 200px;" />
            </div>
        </div>
        <div class="xy-content-body">
          <XyAntTable
            :columns="columns"
            :dataSource="tableData"
            :tableLoading="tableLoading"
            :pagination="pagination"
            @change="handleTableChange"
            :scrollx="'max-content'"
            >
            <div style="min-width:220px" slot="AchievementRecordName" slot-scope="text, record">
              <span class="table-el-hover" @click="view(record)">
              {{text}}
              </span>
            </div>
            <span slot="CreateFullName" slot-scope="text, record">
              {{record.ScoreMode === 1 ? '选科前' : record.ScoreMode === 2 ? '3+1+2' : '3+3'}}
            </span>
            <span slot="CreateDate" slot-scope="text, record">
              {{record.FFState ? '已赋分' : '未赋分'}}
            </span>
            <span slot="oprateRender" slot-scope="text, record">
              <a @click="view(record)">查看</a>
            </span>
          </XyAntTable>
        </div>
    </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'

  export default {
    name: 'EaAASanalyse',
    components: {
      XyAntTable
    },
    data () {
      return {
        nullData: '该搜索条件下没有结果。',

        // 从明细页返回时筛选条件
        listSearch: {},
        haveListSearch: false,

        // 查询相关
        defaultList: [], // 学年学期列表
        searchDefaultValue: [], // 选中的学年学期
        haveCurYear: false,
        haveCurSession: false,
        yearID: 0,
        sessionID: 0,
        schoolList: [], // 校区列表
        schoolID: 0, // 选中的校区ID
        searchName: '',

        // antTable
        loadingTable: true,
        tableLoading: false,
        columns: [
          {
            title: '考试名称',
            dataIndex: 'AchievementRecordName',
            scopedSlots: { customRender: 'AchievementRecordName' }
          },
          {
            title: '考试类型',
            dataIndex: 'AchievementRecordExamTypeName',
            width: 150
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 150
          },
          {
            title: '年级',
            dataIndex: 'YearGradeName',
            width: 150
          },
          {
            title: '考试时间',
            dataIndex: 'TimeName',
            width: 200
          },
          {
            title: '考试模式',
            dataIndex: 'CreateFullName',
            width: 150,
            scopedSlots: { customRender: 'CreateFullName' }
          },
          {
            title: '是否赋分',
            dataIndex: 'CreateDate',
            width: 150,
            scopedSlots: { customRender: 'CreateDate' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            scopedSlots: { customRender: 'oprateRender' },
            width: 80
          }
        ],
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
        }
      }
    },
    created () {
      // 从明细页返回时保留筛选条件
      if (this.$store.state.educationAffairs.teachingQualitySearch.listSearch !== undefined) {
        this.$store.commit('educationAffairs/changeTeachingQualitySearch', {}) // 清空所有筛选条件
      } else {
        this.haveListSearch = false
      }
      this.getFilterData()
    },
    mounted () {
    },
    methods: {
      // 获取所有校区
      async getFilterData () {
        this.tableLoading = true
        var _this = this
        let res = await _this.xy.get(`${_this.xyApi}/base/api/SchoolDistrict/GetAll`)
        if (res.success) {
          $.each(res.data, function (index, item) {
            _this.schoolList.push({
              SchoolDistrictID: item.SchoolDistrictID,
              SchoolDistrictName: item.SchoolDistrictName
            })
          })
          if (_this.schoolList !== null && _this.schoolList.length > 0) {
            if (!_this.haveListSearch) {
              _this.schoolID = _this.schoolList[0].SchoolDistrictID
            }
            // 学年/学期
            let resSession = await _this.xy.get(`${_this.xyApi}/xy/comm/GetSessionNodeList`)
            if (resSession.success) {
              _this.defaultList = resSession.data
              if (!_this.haveListSearch) {
                $.each(resSession.data, function (index, item) {
                  if (item.IsCurrent) {
                    _this.yearID = item.value
                    _this.searchDefaultValue[0] = item.value
                    _this.haveCurYear = true
                  };
                  $.each(item.children, function (i, t) {
                    if (item.IsCurrent && t.IsCurrent) {
                      _this.sessionID = t.value
                      _this.searchDefaultValue[1] = t.value
                      _this.haveCurSession = true
                    };
                  })
                  // 【设置了当前学年但未设置当前学期时】 设置默认选择的学期
                  if (!_this.haveCurSession) {
                    $.each(item.children, function (i, t) {
                      if (item.IsCurrent) {
                        _this.sessionID = item.children[0].value
                        _this.searchDefaultValue[1] = item.children[0].value
                      };
                    })
                  }
                })

                // 【未设置当前学年时】 设置默认选择的学年学期
                if (!_this.haveCurYear) {
                  _this.yearID = resSession.data[0].value
                  _this.sessionID = resSession.data[0].children[0].value
                  _this.searchDefaultValue[0] = _this.yearID
                  _this.searchDefaultValue[1] = _this.sessionID
                }
              }
              // 设置请求tbale数据的api地址-获取成绩分析列表
              // 获取table数据需要的参数
              this.loadTable()
            }
          }
        }
      },
      handleTableChange () {
        this.loadTable()
      },
      // 校区改变时
      schoolChange (value) {
        this.pagination.current = 1
        this.loadTable()
      },
      // 获取table分页数据
      async loadTable () {
        this.tableLoading = true
        let res = await this.xy.get(
          this.$store.state.apiPath + '/api/AchievementAnalyse/GetPage', {
            schoolDistrictId: this.schoolID,
            academicYearId: this.yearID,
            academicSessionId: this.sessionID,
            searchText: this.searchName,
            pageIndex: this.pagination.current,
            pageSize: this.pagination.pageSize
          }
        )
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
        }
        this.tableData.map((item, index) => {
          this.$set(item, 'key', index)
        })
        this.tableLoading = false
      },
      // 学年学期改变时
      cascaderFunDefault (value) {
        if (value.length === 2) {
          this.searchDefaultValue[0] = this.yearID = value[0]
          this.searchDefaultValue[1] = this.sessionID = value[1]
          this.pagination.current = 1
        }
        this.loadTable()
      },
      // 搜索框
      FromSubmit () {
        this.pagination.current = 1
        this.loadTable()
      },

      // 查看
      view (row) {
        this.$store.commit('educationAffairs/changeTeachingQualitySearch', {
          'row': row,
          'listSearch': {
            'schoolID': this.schoolID,
            'yearSessionID': this.searchDefaultValue,
            'searchName': this.searchName
          }
        })
        this.$store.commit('common/getThreeMenuName')
        this.$store.commit('common/getParam', {})
        this.$router.push({ path: '/xyhome/EaAASanalyseDetail', query: this.$store.state.common.menuInfo })
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
