<!-- 单科统计 -->
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
    <div style="width: 92%;margin: 0 auto;" v-if='dataTable.length>0'>
      <Table ref="selection"
               :columns="columns"
               :data="dataTable"></Table>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        total: 0,
        ResultList: [],
        xData: [],
        yData: [],
        myChart: {},
        // 表格
        dataTable: [],
        columns: []
      }
    },
    created: function () {
      this.getTable()
    },
    mounted: function () {
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => {
        this.myChart.resize()
      })
    },
    computed: {
      // 1.单科统计图
      opt1: function () {
        let that = this
        let obj = {
          title: {
            text: '单科统计',
            // subtext: '已完成选课人数' + this.total + '人',
            left: '3%'
          },
          color: ['#5B8FF9'],
          tooltip: {
            formatter: function (params, ticket) {
              let item = params.data
              let level = ''
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
            data: that.xData,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
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
            data: that.yData
          }]
        }
        return obj
      }
    },
    methods: {
      async  getTable () {
        let that = this
        this.xy.loading()
        that.xData = []
        that.yData = []
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetSingleSelectInfo`, {
          StudentOrganizationIDS: this.$parent.classOrganizationIDs,
          LayeredSelectProgrammeID: this.$parent.$parent.layeredStepsHeader.LayeredSelectProgrammeID,
          LayeredSelectRotationID: this.$parent.$parent.layeredStepsHeader.LayeredSelectRotationID
        })

        let echartsData = res.data.SubInfo
        echartsData.map(function (item) {
          that.xData.push(item.SubjectName)
          item.value = item.SCount
          that.yData.push(item)
        })
        if (that.xData.length > 0 && that.yData.length > 0) {
          that.setEchart()
        }
        if (res.success) {
          that.dataTable = []
          that.columns = [{
            title: '班级',
            key: 'SCount',
            minWidth: 200,
            fixed: 'left',
            align: 'SubjectName',
            render: (h, params) => {
              let value = params.row.StudentGradeNameForStudentYearName + params.row.StudentOrganizationName + '(' + params.row.SCount + '人)'
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: '<div>' + value + '</div>'
                  },
                  attrs: {
                    title: value
                  }
                })
              ])
            }
          }]
          if (res.data.OrgInfo.length > 0) {
            let columnsList = res.data.OrgInfo[0].Children
            for (let i = 0; i < columnsList.length; i++) {
              that.columns.push({
                title: columnsList[i].SubjectName,
                key: 'SubjectCategoryName' + i,
                minWidth: 100
              })
            }
          }
          that.dataTable = res.data.OrgInfo
          for (let i = 0; i < res.data.OrgInfo.length; i++) {
            let subjectList = []
            subjectList = res.data.OrgInfo[i].Children
            for (let j = 0; j < subjectList.length; j++) {
              that.dataTable[i]['SubjectCategoryName' + j] = subjectList[j].SCount
            }
          }
          let val = this.handleSummary(this.columns, this.dataTable)
          that.columns.map((item, index) => {
            if (item.key.indexOf('SubjectCategoryName') !== -1) {
              item.title = item.title + `(${val['SubjectCategoryName' + (index - 1)]})`
            }
          })
        } else {
          that.xy.msgError(res.msg)
        }
        this.xy.unloading()
      },
      handleSummary (columns, data) {
        const sums = {}
        columns.forEach(function (column, index) {
          const key = column.key

          const values = data.map(function (item) { return Number(item[key]) })
          if (!values.every(function (value) { return isNaN(value) })) {
            const v = values.reduce(function (prev, curr) {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[key] = v
          } else {
          // sums[key] = {
          //   key,
          //   value: 'N/A'
          // }
          }
        })
        return sums
      },
      setEchart: function () {
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
</style>
