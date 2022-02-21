<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between">
      <div class="">
        <Button class="xy-primary" @click="exportAdministrativeClassData">导出</Button>
        <Tooltip :content="content" placement="left-start" max-width="700">
          <span class="i-alert"><Icon type="ios-information-circle"  />提示</span>
        </Tooltip>
      </div>
      <div class="xy-flex xy-center">
        <div class="xy-flex xy-center">
          <label>学年/学期：</label>
          <Cascader
            :data="yearSemesterList"
            @on-change="changeYear"
            v-model="kv.yearSemester"
            :clearable="false"
            placeholder="学年/学期"
            style="margin-right:10px;"></Cascader>
        </div>
        <div class="xy-flex xy-center">
          <label>筛选：</label>
          <Cascader
            :data="schoolInfoList"
            @on-change="change"
            v-model="kv.schoolInfo"
            :clearable="false"
            style="margin-right:10px;width: 250px;"></Cascader>
        </div>
        <div class="xy-flex xy-center">
          <label>日期：</label>
          <DatePicker
            type="daterange"
            @on-change="changeDate"
            :options="dDate"
            placement="bottom-end"
            placeholder="请选择日期"
            :clearable="false"
            :editable="false"
            v-model="kv.date"
            style="margin-right:10px;"></DatePicker>
        </div>
        <Input search @on-search="changeText" placeholder="用户名/姓名" style="width: 150px;" v-model="kv.searchText"/>
      </div>
    </div>
    <div class="xy-content-body">
      <xy-table :tbColumns="columns"
        :tbData="tbData"
        :total="tbTotal"
        @changePage="changePage"
        @changePageSize="changePageSize"
        :pageSize="pageSize"
        :pageIndex="pageIndex"
        @changeSelect="changeSelect"></xy-table>
    </div>
  </div>
</template>
<script>
  import xyTable from '@/components/table/XyTable'
  const poto = require('@/assets/common/yrykb.png')
  export default {
    components: {
      xyTable
    },
    name: 'AdminClass',
    data () {
      return {
        columns: [],
        tbData: [],
        tbTotal: 0,
        pageSize: 15,
        pageIndex: 1,
        selectionAll: [],
        kv: {
          // 搜索条件
          searchText: '',
          yearSemester: [],
          date: [],
          schoolInfo: [0, 0, 0]
        },
        dDate: {},
        yearSemesterList: [],
        schoolInfoList: [],
        content: `1. 列表显示各课程得星数。每颗星代表X分，数据四舍五入，保留1位小数。
2. 多节课，各三级指标“总得星数”=各三级指标单次“得星数”求和。各三级指标“平均得星数”=总得星数/评价次数。
3. “一级指标得星数”=某一级指标下的各三级指标的“平均得星数”求和。“课程得星数”=各一级指标得星数加权求和。“课程得分”=课程得星数*每颗星代表分数。
4. 评价分数为0代表评价得分为0。评价分数为空则代表未做评价，未参与评价的，不进行平均分计算。`
      }
    },
    created () {
      this.getYearSession()
    },
    methods: {
      change (val) {
        this.kv.schoolInfo = val
        this.loadTable()
      },
      changeText (val) {
        this.kv.searchText = val
        this.loadTable()
      },
      changeDate (val) {
        this.kv.date = val
        this.loadTable()
      },
      // 查看详情
      GoDesc (row) {
        this.$store.commit('common/getThreeMenuName', '评价详情')
        this.$store.commit('common/getParam', {
          params: JSON.stringify({
            StudentYearID: row.StudentGradeForStudentYearID,
            SessionID: this.kv.yearSemester[1],
            SchoolDistrictID: this.kv.schoolInfo[0],
            StudentOrgID: this.kv.schoolInfo[2],
            StudentID: row.StudentID,
            StartTime: this.kv.date[0],
            EndTime: this.kv.date[1]
          })
        })
        this.$router.push({
          name: 'EvaluationStatisticsDesc',
          query: this.$store.state.common.menuInfo
        })
      },
      // 导出
      exportAdministrativeClassData () {
        // Object.assign(this.getParams(), { academicYearID: 0 }
        this.xy.downFile(`${this.$store.state.apiPath}/api/ClassEvaluationStatistics/ExportAdministrativeClassData`, {
          searchText: this.kv.searchText || '',
          academicSessionID: this.kv.yearSemester[1] || 0,
          schoolDistrictID: this.kv.schoolInfo[0] || 0,
          studentYearID: this.kv.schoolInfo[1] || 0,
          studentOrganzationID: this.kv.schoolInfo[2] || 0,
          startTime: this.xy.moment(this.kv.date[0]).format('YYYY-MM-DD') || '',
          endTime: this.xy.moment(this.kv.date[1]).format('YYYY-MM-DD') || ''
        })
        // ?searchText=${this.kv.searchText || ''}&academicSessionID=${this.kv.yearSemester[1] || 0}&schoolDistrictID=${this.kv.schoolInfo[0] || 0}&studentYearID=${this.kv.schoolInfo[1] || 0}&studentOrganzationID=${this.kv.schoolInfo[2] || 0}&startTime=${this.kv.date[0] || ''}&endTime=${this.kv.date[1] || ''}
      },
      // 右侧表格多选操作（批量删除）
      changeSelect (data) {
        this.selectionAll = data
      },
      // 改变当前页显示的数量
      changePageSize (size) {
        if (this.pageSize !== size) {
          this.pageSize = size
          this.loadTable()
        }
      },
      // 改变当前页
      changePage (index) {
        if (this.pageIndex !== index) {
          this.pageIndex = index
          this.loadTable()
        }
      },
      getParams () {
        return {
          searchText: this.kv.searchText || '',
          academicSessionID: this.kv.yearSemester[1] || 0,
          schoolDistrictID: this.kv.schoolInfo[0] || 0,
          studentYearID: this.kv.schoolInfo[1] || 0,
          studentOrganzationID: this.kv.schoolInfo[2] || 0,
          startTime: this.kv.date[0] || '',
          endTime: this.kv.date[1] || ''
        }
      },
      changeYear (val, item) {
        this.kv.yearSemester = val
        this.kv.date = [item[1].StartDate, item[1].EndDate]
        // let timeRange = [this.xy.moment(item[1].StartDate).valueOf(), this.xy.moment(item[1].EndDate).valueOf()]
        this.dDate = {
          disabledDate (date) {
            return (date && date.valueOf() < new Date(item[1].StartDate)) || (date && date.valueOf() > new Date(item[1].EndDate))
          }
        }
        this.loadTable()
      },
      async loadTable () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassEvaluationStatistics/GetAdministrativeClassPageList`, {
          searchText: this.kv.searchText,
          academicSessionID: this.kv.yearSemester[1],
          schoolDistrictID: this.kv.schoolInfo[0],
          studentYearID: this.kv.schoolInfo[1],
          studentOrganzationID: this.kv.schoolInfo[2],
          startTime: this.kv.date[0],
          endTime: this.kv.date[1],
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }, true)
        if (res.success) {
          if (res.data !== null) {
            this.columns = [
              {
                title: '头像',
                key: 'Icon',
                width: 70,
                render: (h, params) => {
                  return h('div', [
                    h('img', {
                      attrs: {
                        src: !params.row.Icon ? poto : `${this.xyApi}/base${params.row.Icon}?${Math.random() * 15}`
                      },
                      style: {
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%'
                      }
                    })
                  ])
                }
              },
              {
                title: '姓名',
                key: 'FullName'
              },
              {
                title: '用户名',
                key: 'UserName'
              },
              {
                title: '年级',
                key: 'StudentGradeName'
              },
              {
                title: '班级',
                key: 'ClassName'
              }
            ]
            Object.getOwnPropertyNames(res.data.data[0].Columns).forEach((key) => {
              this.columns.push({
                title: res.data.data[0].Columns[key],
                key: key
              })
            })
            this.columns.push({
              title: '操作',
              key: '04',
              width: 100,
              render: (h, params) => {
                return h('div', {
                  'class': {
                    oprateList: true
                  }
                }, [
                  h('a', {
                    'class': {
                      oprateBtn2: true
                    },
                    on: {
                      click: () => {
                        this.GoDesc(params.row)
                      }
                    }
                  }, '详情')
                ])
              }
            })
            this.tbTotal = res.data.totalRecords
            this.tbData = res.data.data[0].StatisticsData
          } else {
            this.tbTotal = 0
            this.tbData = []
          }
          this.xy.unloading()
        } else {
          this.tbData = []
          this.xy.msgError(res.msg)
          this.xy.unloading()
        }
      },
      // 获取学年、学期
      async getYearSession () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.yearSemesterList = res.data
            for (const tt of res.data) {
              if (tt.IsCurrent) {
                this.kv.yearSemester[0] = tt.value
              }
              for (const vv of tt.children) {
                if (vv.IsCurrent) {
                  this.kv.date = [vv.StartDate, vv.EndDate]
                  let timeRange = [this.xy.moment(vv.StartDate).valueOf(), this.xy.moment(vv.EndDate).valueOf()]
                  this.dDate = {
                    disabledDate (date) {
                      return timeRange[0] > date || date > timeRange[1]
                    }
                  }
                  this.kv.yearSemester[1] = vv.value
                }
              }
            }
          }
        } else {
          this.xy.msgError(res.msg)
        }
        this.getSchoolGardTree()
      },
      // 获取学校、班级、年级
      async getSchoolGardTree () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassEvaluationStatistics/GetUserRangeClassPermissionNodeList`, null, true)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.kv.schoolInfo = [res.data[0].Value, 0, 0]
            for (let i = 0, len = res.data.length; i < len; i++) {
              this.schoolInfoList.push({
                label: res.data[i].Label.length >= 10 ? `${res.data[i].Label.substr(0, 9)}...` : res.data[i].Label,
                value: res.data[i].Value,
                children: res.data[i].Children && res.data[i].Children.length > 0 ? this.getSoGard(res.data[i].Children) : []
              })
            }
            this.loadTable()
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 递归遍历班级、年级
      getSoGard (data) {
        let arrs = [{
          value: 0,
          label: '所有年级',
          children: [
            {
              value: 0,
              label: '所有班级'
            }
          ]
        }]
        data.map(item => {
          arrs.push({
            label: item.Label.length >= 10 ? `${item.Label.substr(0, 9)}...` : item.Label,
            value: item.Value,
            children: item.Children && item.Children.length > 0 ? this.level2(item.Children) : []
          })
        })
        return arrs
      },
      level2 (data) {
        let arrs = [{
          value: 0,
          label: '所有班级'
        }]
        data.map(item => {
          arrs.push({
            label: item.Label.length >= 10 ? `${item.Label.substr(0, 9)}...` : item.Label,
            value: item.Value
          })
        })
        return arrs
      }
    }
  }
</script>
<style lang="less" scoped>
  @import './css/statComm.less';
  .i-alert{
    cursor: pointer;
    color:#D8D8D8;
    i{
      margin-right: 5px;
    }
  }
  .i-alert:hover{
    color:#4196FF;
  }
</style>
