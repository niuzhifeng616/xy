<!-- 2.选课结果：选课统计-单科统计 -->
<template>
  <div id="selectResult"
       class="xy-content-body">
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
         v-if='dataTable.length>0'>
      <XyAntTable :isPage="false"
                  :columns="columns"
                  :isScroll="true"
                  :scrollx="'max-content'"
                  :bordered="true"
                  :dataSource="dataTable"
                  nullData="该搜索条件下没有结果。"
                  :tableLoading="tableLoading">
        <span slot="StudentOrganizationName"
             slot-scope="text, record">
            {{record.StudentOrganizationName + '(' + record.SCount + '人)'}}
        </span>
      </XyAntTable>
    </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: { XyAntTable },
    data () {
      return {
        xData: [],
        yData: [],
        myChart: {},
        // 表格
        DisciplineList: [],
        tableLoading: false,
        dataTable: [],
        columns: []
      }
    },

    mounted () {
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
      this.getTable()
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => {
        this.myChart.resize()
      })
    },
    computed: {
      // 1.单科统计图
      opt1 () {
        let obj = {
          title: {
            text: '单科统计',
            left: '3%'
          },
          color: ['#5B8FF9'],
          tooltip: {
            formatter: (params, ticket) => {
              let item = params.data
              let level = ''
              if (item.Children.length > 0) {
                item.Children.map((t) => {
                  level += t.DisciplineName + '：' + t.SCount + '<br />'
                })
              }
              return item.DisciplineName + '<br />' + '总计：' + item.SCount + '人' + '<br />' + level
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
              formatter: (value) => {
                let result = value ? (value.length > 5 ? value.slice(0, 5) + '...' : value) : '-'
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
        this.xy.loading()
        this.xData = []
        this.yData = []
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetSingleSelectInfo`, {
          StudentOrganizationIDS: this.$parent.classOrganizationIDs,
          DivideClassID: this.$parent.$parent.divideClassID
        })
        let echartsData = res.data.SubInfo
        echartsData.map((item) => {
          this.xData.push(item.DisciplineName)
          item.value = item.SCount
          this.yData.push(item)
        })
        if (this.xData.length > 0 && this.yData.length > 0) {
          this.setEchart()
        }
        if (res.success) {
          this.dataTable = []
          this.columns = [{
            title: '班级',
            dataIndex: 'StudentOrganizationName',
            width: 200,
            fixed: 'left',
            scopedSlots: { customRender: 'StudentOrganizationName' }
          }]
          if (res.data.OrgInfo.length > 0) {
            let columnsList = res.data.OrgInfo[0].Children
            this.DisciplineList = columnsList
            for (let i = 0; i < columnsList.length; i++) {
              this.columns.push({
                title: columnsList[i].DisciplineName,
                dataIndex: 'SubjectCategoryName' + i,
                scopedSlots: { customRender: 'SubjectCategoryName' + i }
              })
            }
          }
          this.dataTable = res.data.OrgInfo
          for (let i = 0; i < res.data.OrgInfo.length; i++) {
            let subjectList = []
            subjectList = res.data.OrgInfo[i].Children
            for (let j = 0; j < subjectList.length; j++) {
              this.dataTable[i]['SubjectCategoryName' + j] = subjectList[j].SCount
            }
          }
          let val = this.handleSummary(this.columns, this.dataTable)
          this.columns.map((item, index) => {
            if (item.dataIndex.indexOf('SubjectCategoryName') !== -1) {
              item.title = item.title + `(${val['SubjectCategoryName' + (index - 1)]})`
            }
          })
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
      setEchart () {
        let dom = this.$refs.mychart
        if (dom) {
          this.myChart = this.echarts.init(dom)
          this.myChart.setOption(this.opt1)
        }
      }
    }
  }
</script>
<style lang='less' scoped>
// /deep/.ant-table{
//   border:1px solid #ebedf0;
//   border-bottom: none;
// }
</style>
