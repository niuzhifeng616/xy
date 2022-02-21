<!-- 考试管理 -->
<template>
    <div class="xy-content-module">
        <div class="xy-content-title flex-flow">
            <!--按钮-->
            <div>
                <Button class="xy-primary" @click="creatAchievement">新建考试</Button>
                <!-- <span class="iconfont" style="font-size: 12px; margin: 0 5px 0 -8px;">&#xe6a2;</span> -->
                <Button class="xy-info" @click="examType">考试类型</Button>
                <Button class="xy-info" @click="AssignmentScore">赋分管理</Button>
            </div>
            <!--搜索-->
            <div class="xy-flex">
                <div style="margin-right:15px">
                    <span>校区：</span>
                    <Select v-model="schoolID"
                            placeholder="请选择校区"
                            not-found-text="暂无校区"
                            @on-change="schoolChange"
                            style="width:200px;">
                        <Option v-for="school in schoolList" :value="school.SchoolDistrictID" :key="school.SchoolDistrictID">{{ school.SchoolDistrictName }}</Option>
                    </Select>
                </div>
                <div style="margin-right:15px">
                    <span>学年学期：</span>
                    <cascader v-model="searchDefaultValue"
                            :data="defaultList"
                            not-found-text="暂无学年学期"
                            @on-change="cascaderFunDefault"
                            placeholder="请选择学年/学级"
                            style="width:200px; display:inline-block">
                    </cascader>
                </div>
                <Input search
                        v-model="searchName"
                        @on-search="FromSubmit"
                        placeholder="请输入考试名称"
                        style="width: 200px;" />
            </div>

        </div>
        <div class="xy-content-body">
          <XyAntTable
            :columns="columns"
            :dataSource="datatable"
            :nullData="noDataText"
            :tableLoading="tableLoading"
            :pagination="pagination"
            @change="handleTableChange"
            :scrollx="'max-content'"
            >
            <div slot="AchievementRecordName" style="min-width:240px" slot-scope="text, record">
              <span class="table-el-hover" @click="studentAchievement(record)">
                {{record.AchievementRecordName}}
              </span>
            </div>
            <div slot="CreateDate" slot-scope="text, record">
              <span>
                {{xy.moment(new Date(record.CreateDate)).format('YYYY-MM-DD HH:mm')}}
              </span>
            </div>
            <div slot="IsPublishedName" slot-scope="text, record">
              <a-switch checked-children="启用" un-checked-children="停用" :checked="record.IsPublished" @change="switchFun(record)" />
            </div>
            <span slot="opera" slot-scope="text, record">
              <a @click="studentAchievement(record)">成绩管理</a>
              <a-divider type="vertical" />
              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  更多 <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item @click="edit(record)" :disabled='record.IsPublished'>编辑</a-menu-item>
                  <a-menu-item @click="del(record.AchievementRecordID, record.AchievementRecordName)" :disabled='record.IsPublished'>删除</a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </XyAntTable>
        </div>
    </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'

  export default {
    name: 'AchievementRecord',
    components: {
      XyAntTable
    },
    data () {
      return {
        editId: '',
        modalEdit: false,

        ids: '',
        isPublished: '',

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
        // table
        tableLoading: true,
        datatable: [],
        noDataText: '该搜索条件下没有结果。',
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
            title: '考试名称',
            dataIndex: 'AchievementRecordName',
            fixed: 'left',
            scopedSlots: { customRender: 'AchievementRecordName' }
          },
          {
            title: '考试类型',
            dataIndex: 'AchievementRecordExamTypeName',
            width: 110
          },
          {
            title: '校区',
            dataIndex: 'SchoolDistrictName',
            width: 150
          },
          {
            title: '年级',
            dataIndex: 'YearGradeName',
            width: 160
          },
          {
            title: '考试时间',
            dataIndex: 'TimeName',
            width: 200
          },
          {
            title: '创建人',
            dataIndex: 'CreateFullName',
            width: 120
          },
          {
            title: '创建时间',
            dataIndex: 'CreateDate',
            width: 150,
            scopedSlots: { customRender: 'CreateDate' }
          },
          {
            title: '发布状态',
            dataIndex: 'IsPublishedName',
            width: 95,
            scopedSlots: { customRender: 'IsPublishedName' }
          },
          {
            title: '操作',
            dataIndex: 'opera',
            width: 160,
            scopedSlots: { customRender: 'opera' }
          }
        ]
      }
    },
    created () {
      // 从明细页或者成绩管理返回时保留筛选条件
      if (this.$store.state.educationAffairs.achievementRecordSearch.listSearch !== undefined) {
        // 返回时重置搜索或筛选条件-暂不做(跳转前存值返回后取值，取值后清空)---！！勿删2020.6.9
        // this.listSearch = this.$store.state.educationAffairs.achievementRecordSearch.listSearch
        // this.schoolID = this.listSearch.schoolID
        // this.searchDefaultValue = this.listSearch.yearSessionID
        // this.yearID = this.searchDefaultValue[0]
        // this.sessionID = this.searchDefaultValue[1]
        // this.searchName = this.listSearch.searchName
        // this.haveListSearch = true

        this.$store.commit('educationAffairs/changeAchievementRecordSearch', {}) // 清空所有筛选条件
      } else {
        this.haveListSearch = false
      }
      this.getFilterData()
    },
    methods: {
      handleTableChange () {
        this.getPage()
      },
      async getPage () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AchievementRecord/GetPage`, {
          schoolDistrictId: this.schoolID,
          academicYearId: this.yearID,
          academicSessionId: this.sessionID,
          searchText: this.searchName,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        })
        this.tableLoading = false
        if (res.success) {
          this.datatable = res.data.data
          this.pagination.total = res.data.totalRecords
        }
      },
      // 获取所有校区
      async getFilterData () {
        let res = await this.xy.get(`${this.xyApi}/base/api/SchoolDistrict/GetAll`)
        if (res.success) {
          $.each(res.data, (index, item) => {
            this.schoolList.push({
              SchoolDistrictID: item.SchoolDistrictID,
              SchoolDistrictName: item.SchoolDistrictName
            })
          })
          if (this.schoolList !== null && this.schoolList.length > 0) {
            if (!this.haveListSearch) {
              this.schoolID = this.schoolList[0].SchoolDistrictID
            }
            // 学年/学期
            let resSession = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
            if (resSession.success) {
              this.defaultList = resSession.data
              if (!this.haveListSearch) {
                $.each(resSession.data, (index, item) => {
                  // 当前学年
                  if (item.IsCurrent) {
                    this.yearID = item.value
                    this.searchDefaultValue[0] = item.value
                    this.haveCurYear = true
                    // 当前学年下的学期
                    $.each(item.children, (i, t) => {
                      if (item.IsCurrent && t.IsCurrent) {
                        this.sessionID = t.value
                        this.searchDefaultValue[1] = t.value
                        this.haveCurSession = true
                      };
                    })
                    // 【设置了当前学年但未设置当前学期时】 设置默认选择的学期
                    if (!this.haveCurSession) {
                      $.each(item.children, (i, t) => {
                        if (item.IsCurrent) {
                          this.sessionID = item.children[0].value
                          this.searchDefaultValue[1] = item.children[0].value
                        };
                      })
                    }
                  }
                })
                // 【未设置当前学年时】 设置默认选择的学年学期
                if (!this.haveCurYear) {
                  this.yearID = resSession.data[0].value
                  this.sessionID = resSession.data[0].children[0].value
                  this.searchDefaultValue[0] = this.yearID
                  this.searchDefaultValue[1] = this.sessionID
                }
              }
              this.getPage()
            }
          }
        }
      },
      // 校区改变时
      schoolChange (value) {
        this.schoolID = value
        this.pagination.current = 1
        this.getPage()
      },
      // 学年学期改变时
      cascaderFunDefault (value) {
        if (value.length === 2) {
          this.searchDefaultValue[0] = this.yearID = value[0]
          this.searchDefaultValue[1] = this.sessionID = value[1]
          this.pagination.current = 1
          this.getPage()
        }
      },
      // 搜索框
      FromSubmit () {
        this.pagination.current = 1
        this.getPage()
      },

      // 创建考试
      creatAchievement () {
        this.$store.commit('common/getThreeMenuName', '创建考试')
        this.$store.commit('educationAffairs/changeAchievementRecordSearch', {
          'listSearch': {
            'schoolID': this.schoolID,
            'yearSessionID': this.searchDefaultValue,
            'searchName': this.searchName
          }
        })
        this.$router.push({ path: '/xyhome/achievementRecordDetail', query: this.$store.state.common.menuInfo })
      },
      // 编辑考试
      edit (row) {
        this.$store.commit('common/getThreeMenuName', '编辑考试')
        this.$store.commit('educationAffairs/changeAchievementRecordSearch', {
          'arId': row.AchievementRecordID,
          'listSearch': {
            'schoolID': this.schoolID,
            'yearSessionID': this.searchDefaultValue,
            'searchName': this.searchName
          }
        })
        this.$router.push({ path: '/xyhome/achievementRecordDetail', query: this.$store.state.common.menuInfo })
      },
      // 考试类型
      examType () {
        this.$store.commit('common/getThreeMenuName', '考试类型')
        this.$store.commit('educationAffairs/changeAchievementRecordSearch', {
          'listSearch': {
            'schoolID': this.schoolID,
            'yearSessionID': this.searchDefaultValue,
            'searchName': this.searchName
          }
        })
        this.$router.push({ path: '/xyhome/achievementRecordExamType', query: this.$store.state.common.menuInfo })
      },
      // 赋分管理
      AssignmentScore () {
        this.$store.commit('common/getThreeMenuName', '赋分管理')
        this.$store.commit('educationAffairs/changeAchievementRecordSearch', {
          'listSearch': {
            'schoolID': this.schoolID,
            'yearSessionID': this.searchDefaultValue,
            'searchName': this.searchName
          }
        })
        this.$router.push({ path: '/xyhome/assignmentScoreManage', query: this.$store.state.common.menuInfo })
      },
      // 成绩管理
      studentAchievement (row) {
        this.$store.commit('common/getThreeMenuName', `成绩管理（考试名称：${row.AchievementRecordName}）`)
        this.$store.commit('educationAffairs/changeAchievementRecordSearch', {
          'arId': row.AchievementRecordID,
          'arName': row.AchievementRecordName,
          'scoreMode': row.ScoreMode,
          'isPublished': row.IsPublished,
          'listSearch': {
            'schoolID': this.schoolID,
            'yearSessionID': this.searchDefaultValue,
            'searchName': this.searchName
          }
        })
        this.$router.push({ path: '/xyhome/studentAchievement', query: this.$store.state.common.menuInfo })
      },
      // 发布、取消发布
      async switchFun (row) {
        this.isPublished = row.IsPublished
        this.isPublished = !this.isPublished

        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecord/PublishStatusChange`, {
          AchievementRecordID: row.AchievementRecordID,
          Status: this.isPublished
        })
        if (res.success) {
          this.getPage()
        }
      },
      // 删除考试
      del (id, name) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确定要删除“' + name + '”考试吗？</p>',
          onOk: () => {
            this.xy.post(`${this.$store.state.apiPath}/api/AchievementRecord/Delete?id=${id}`).then(res => {
              if (res.success) {
                if (this.datatable.length > 1) {
                  this.datatable.length = this.datatable.length - 1
                } else {
                  if (this.pagination.current > 1) {
                    this.pagination.current = this.pagination.current - 1
                  }
                }
                this.getPage()
                this.xy.msgSuc('删除成功。')
              }
            })
          }
        })
      }

    }
  }
</script>
<style lang="less" scoped>
.flex-flow{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
