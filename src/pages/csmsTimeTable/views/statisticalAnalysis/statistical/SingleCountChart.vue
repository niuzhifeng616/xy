<!-- 单科统计 -->
<template>
  <div class="xy-content-body">
    <!-- 柱状图 -->
    <div id="areaChats"
         class="chats-wrap">
      <div class="chart-item"
           style="width:100%; display:block;">
        <div class="chat-img"
             id="id_GetTodayData"
             ref="mychart"
             style="width:100%;height:600px;">
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div style="width: 92%;margin: 0 auto;"
         v-if='dataTable.length > 0'>
      <XyAntTable :isPage="false"
                  :columns="columns"
                  :bordered="true"
                  :scrollx="'max-content'"
                  :dataSource="dataTable"
                  nullData="该搜索条件下没有结果。"
                  :tableLoading="tableLoading">
        <div slot="SCount"
              slot-scope="text, record">
              <span v-if='!record.isSumRow'>{{record.StudentGradeNameForStudentYearName + record.StudentOrganizationName + '(' + record.SCount + '人)'}}</span>
              <span v-else>{{`总计(${record.SCount}人)`}}</span>
        </div>
      </XyAntTable>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'statSingle',
    components: { XyAntTable },
    props: {
      LayeredSelectProgrammeID: {
        type: Number,
        required: true
      },
      LayeredSelectRotationID: {
        type: Number,
        required: true
      },
      classOrganizationIDs: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        total: 0,
        ResultList: [],
        xData: [],
        yData: [],
        myChart: {},
        // 表格
        tableLoading: false,
        DisciplineList: [],
        dataTable: [],
        columns: []
      }
    },
    created () {
      if (this.LayeredSelectProgrammeID !== 0 && this.classOrganizationIDs.length > 0) {
        this.getTable()
      }
    },
    computed: {
      // 1.单科统计图
      opt1: function () {
        var obj = {
          title: {
            text: '单科统计图',
            // subtext: '已完成选课人数' + this.total + '人',
            left: '3%'
          },
          color: ['#5B8FF9'],
          tooltip: {
            formatter: function (params, ticket) {
              var item = params.data
              var level = ''
              if (item.Children.length > 0) {
                item.Children.map(function (t) {
                  level += t.SubjectName + '：' + t.SCount + '<br />'
                })
              }
              return item.SubjectName + '<br />' + '总计：' + item.SCount + '人' + '\t占总人数' + item.Proportion + '%' + '<br />' + level
            }
          },

          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: this.xData,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              // formatter: function (value) {
              //   return this.xy.echarts.formatterEllipsis(value)
              // }
              formatter: function (value) {
                let result = value ? (value.length > 5 ? value.slice(0, 5) : value) : '-'
                return result
              }
            }
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: '单科统计',
            type: 'bar',
            barMaxWidth: 80,
            data: this.yData
          }]
        }
        return obj
      }
    },
    methods: {
      async getTable () {
        this.xData = []
        this.yData = []
        this.dataTable = []
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredStatisticalAnalysis/GetSingleSelectInfo`, {
          StudentOrganizationIDS: this.classOrganizationIDs,
          LayeredSelectProgrammeID: this.LayeredSelectProgrammeID,
          LayeredSelectRotationID: this.LayeredSelectRotationID
        })
        var echartsData = res.data.SubInfo
        echartsData.map((item) => {
          this.xData.push(item.SubjectName)
          item.value = item.SCount
          this.yData.push(item)
        })
        if (this.xData.length > 0 && this.yData.length > 0) {
          this.setEchart()
        }
        if (res.success) {
          this.columns = [{
            title: '班级',
            dataIndex: 'SCount',
            width: 200,
            fixed: 'left',
            scopedSlots: { customRender: 'SCount' }
          }]
          if (res.data.OrgInfo.length > 0) {
            let columnsList = res.data.OrgInfo[0].Children
            this.DisciplineList = columnsList
            for (let i = 0; i < columnsList.length; i++) {
              this.columns.push({
                title: columnsList[i].SubjectName,
                dataIndex: 'SubjectCategoryName' + i,
                scopedSlots: { customRender: 'SubjectCategoryName' + i }
              })
            }
          }
          this.dataTable = res.data.OrgInfo
          for (let m = 0; m < this.dataTable.length; m++) {
            this.$set(this.dataTable[m], 'isSumRow', false) // 不是最后一行
            let subjectList = []
            subjectList = this.dataTable[m].Children
            for (let n = 0; n < subjectList.length; n++) {
              this.dataTable[m]['SubjectCategoryName' + n] = subjectList[n].SCount
            }
          }
          let val = this.handleSummary(this.columns, this.dataTable)
          this.columns.map((item, index) => {
            if (item.dataIndex.indexOf('SubjectCategoryName') !== -1) {
              item.title = item.title + `(${val['SubjectCategoryName' + (index - 1)]})`
            }
            return item
          })
          // 添加最后一行---合计行
          let lastItem = JSON.parse(JSON.stringify(this.dataTable[0]))
          for (let key in lastItem) {
            if (key.indexOf('SubjectCategoryName') !== -1) {
              lastItem[key] = val[key]
            }
            lastItem.SCount = val.SCount
            lastItem.isSumRow = true
          }
          this.dataTable.push(lastItem)
        }
        this.xy.unloading()
      },
      handleSummary (columns, data) {
        const sums = {}
        columns.forEach((column, index) => {
          const key = column.dataIndex
          const values = data.map((item) => { return Number(item[key]) })
          if (!values.every((value) => { return isNaN(value) })) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[key] = v
          }
        })
        return sums
      },

      // 单科统计图
      setEchart: function () {
        var dom = this.$refs.mychart
        this.myChart = this.echarts.init(dom)
        this.myChart.setOption(this.opt1)
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
