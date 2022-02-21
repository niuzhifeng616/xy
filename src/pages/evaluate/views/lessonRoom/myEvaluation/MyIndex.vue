<template>
  <div class="my-index">
    <div class="xy-content-body" style="background:#f9f9f9;padding:0;">
      <div class="container xy-flex">
        <div class="container-left">
           <div ref="echartGeography" style="width:100%;height:500px;"></div>
        </div>
        <div class="container-right" style="overflow: auto;">
           <table class="table-data" v-if="arrData.length!==0">
            <thead>
              <tr>
                <th>学科</th>
                <th>课程</th>
                <th>得分数</th>
                <th>满分</th>
                <th>得分率</th>
                <th v-if="algorithm">合计</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody class="tBody">
              <tr v-for="(item,index) in arrData" :key="index">
                <td>{{item.DisciplineName}}</td>
                <td>{{item.SubjectName}}</td>
                <td>{{item.Score}}</td>
                <td>{{item.Max}}</td>
                <td>{{item.ScoreRate}}</td>
                <td v-if="item.num||item.num===0" :rowspan="item.rowSpan">{{item.num}}</td>
                <td style="color:#4196FF;cursor: pointer;" @click="toClass(item)">查看</td>
              </tr>
            </tbody>
           </table>
          <p style="text-align: center;color: #999;margin-top: 100px;" v-else>该搜索条件下没有结果。</p>
           <div ref="subAvg"
             style="height: 500px; width: 100%;text-align:center"></div>
            <!-- 查看弹出的表格 -->
            <Table  :columns="columns" :data="tbData" border :span-method="handleSpan"></Table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // import XyTable from '@/components/table/XyNewTable'
  // import noData from '../../../components/noData'
  export default {
    name: 'MyIndex',
    // components: {
    //   noData
    // },
    props: {
      objData: {
        type: Object
      }
    },
    data () {
      return {
        algorithm: false,
        myChart: {},
        myChart1: {},
        radarData: [],
        columns: [],
        tbData: [],
        pageIndex: 1,
        pageSize: 15,
        formValidateCreate: {
          project: ''
        },
        AcademicYearID: '',
        academicSessionID: '',
        starTime: '',
        endTime: '',
        option: {
          tooltip: {
          },
          calculable: true,
          polar: [
            {
              nameGap: 5,
              center: ['50%', '50%'], // 图的位置
              name: {
                show: true,
                formatter: null,
                textStyle: {
                  color: '#a3a5b6'
                }
              },
              indicator: [],
              axisLine: { // 坐标轴线
                show: true,
                lineStyle: {
                  color: '#ddd'
                } // 默认显示，属性show控制显示与否
              },
              axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
                show: false,
                textStyle: {
                  color: '#247bd7' // 坐标轴刻度文字的样式
                }
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: ['#fff'] // 图表背景网格的颜色
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  width: 1,
                  color: '#ddd' // 图表背景网格线的颜色
                }
              }
            }
          ],
          series: [
            {
              name: '',
              type: 'radar',
              data: []
            }
          ]
        },
        option1: {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            triggerEvent: true,
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value',
            boundaryGap: false,
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLine: {
              show: false
            }
          },
          series: [{
            data: [],
            type: 'bar',
            color: '#3AA0FF',
            barWidth: '20%',
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }]
        },
        arrData: [],
        barData: []
      }
    },
    mounted () {
    },
    created () {
    },
    watch: {
      objData: {
        handler (newVal) {
          this.AcademicYearID = newVal.session[0]// 学年
          this.academicSessionID = newVal.session[1]// 学期
          this.starTime = this.xy.moment(newVal.date[0]).format('YYYY-MM-DD')
          this.endTime = this.xy.moment(newVal.date[1]).format('YYYY-MM-DD')
          if (this.academicSessionID) {
            this.fetchSubject()
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      // 获取总表
      async getAll (data) {
        this.xy.loading()
        const params = {
          StartDate: this.starTime,
          EndDate: this.endTime,
          AcademicYearID: this.AcademicYearID,
          AcademicSessionID: this.academicSessionID,
          SubjectName: data.SubjectName

        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/IndexContrast/GetMyEvaIndexScoreDetailList`, params)
        this.xy.unloading()
        if (res.success) {
          this.columns = res.data.Columns
          this.columns.map(item => {
            if (item.title === '三级指标') {
              item.width = '400px'
            } else {
              item.width = '150px'
            }
          })
          this.tbData = res.data.Datas
          this.rules = res.data.Rules
        }
      },
      handleSpan ({ row, column, rowIndex, columnIndex }) {
        let arr = this.rules.filter(item => { return rowIndex === item.RowIndex && columnIndex === item.ColumnIndex })
        if (arr.length) {
          return {
            rowspan: arr[0].RowSpan,
            colspan: arr[0].ColSpan
          }
        }
      },
      async toClass (data) {
        this.getAll(data)
        this.xy.loading()
        const params = {
          StartDate: this.starTime,
          EndDate: this.endTime,
          AcademicYearID: this.AcademicYearID,
          AcademicSessionID: this.academicSessionID,
          SubjectName: data.SubjectName

        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/IndexContrast/GetMyEvaIndexScoreData`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length) {
            let xData = []; let yData = []
            res.data.forEach(item => {
              xData.push(item.IndexManagementName)
              yData.push(item.Score)
            })
            this.option1.xAxis.data = xData
            this.option1.series[0].data = yData
            if (this.barData.length !== 0) {
              this.myChart1.clear()
            }
            this.barData = []
            this.barData = res.data
            this.$nextTick(() => {
              this.myChart1 = this.echarts.init(this.$refs.subAvg)
              this.myChart1.setOption(this.option1)
            })
          } else {
            this.$Message.info('暂无结果。')
          }
        }
      },
      // 获取列表和雷达图
      async fetchSubject () {
        this.xy.loading()
        const params = {
          StartDate: this.starTime,
          EndDate: this.endTime,
          AcademicYearID: this.AcademicYearID,
          AcademicSessionID: this.academicSessionID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/IndexContrast/GetMyEvaIndexScoreList`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length) {
            if (this.radarData.length !== 0) {
              this.myChart.clear()
            }
            this.radarData = res.data
            // 表格
            this.algorithm = true
            const s = new Set() // 实例化对象
            this.radarData.forEach(item => s.add(item.DisciplineName)) // 添加值（Set可以去掉重复数据
            let newData = Array.from({ length: s.size }, () => []) // 创建指定长度数组并添值
            this.radarData.forEach(item => {
              let index = [...s].indexOf(item.DisciplineName) // 找到指定下标
              newData[index].push(item) // 添加数据
            })

            for (var i = 0; i < newData.length; i++) {
              let Score = 0; let Max = 0; let total = 0
              newData[i].forEach(item => {
                Score += parseInt(item.Score)
                Max += parseInt(item.Max)
              })
              if (Max !== 0) {
                total = Math.ceil((Score / Max) * 100)
              } else {
                total = 0
              }
              if (newData[i].length > 0) {
                newData[i][0].num = total
                newData[i][0].rowSpan = newData[i].length
              }
            }
            this.arrData = []
            newData.forEach(item => {
              item.forEach(item1 => {
                this.arrData.push(item1)
              })
            })
            // 雷达图开始
            let OuterLayer = []; let ScoreRate = []; let specificData = []
            this.radarData.forEach(item => {
              OuterLayer.push(
                {
                  text: item.DisciplineName,
                  max: item.Max
                }
              )
              ScoreRate.push(item.ScoreRate)
              specificData.push(
                {
                  name: item.DisciplineName,
                  value: ScoreRate
                }
              )
            })
            let that = this
            this.option.tooltip.formatter = function (params) {
              let tip = ''
              for (let i = 0; i < that.radarData.length; i++) {
                tip += that.radarData[i].DisciplineName + ' : ' + that.radarData[i].ScoreRate + '<br>'
              }
              return tip
            }

            this.option.polar[0].indicator = OuterLayer
            this.option.series[0].data = specificData
            this.$nextTick(() => {
              this.myChart = this.echarts.init(this.$refs.echartGeography)
              this.myChart.setOption(this.option)
            })
          } else {
            this.myChart.clear()
            this.arrData = []
            this.algorithm = false
          }
          if (this.barData.length !== 0) {
            this.myChart1.clear()
          }
          this.tbData = []
        }
      },
      // 均分图
      average () {
        this.$nextTick(() => {
          let subAvgEc = this.echarts.init(this.$refs.subAvg)
          let option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
              type: 'value',
              boundaryGap: false,
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              },
              axisLine: {
                show: false
              }
            },
            series: [{
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar',
              color: '#3AA0FF'
            }]
          }
          subAvgEc.setOption(option)
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.my-index{
 .container{
   .container-left{
     width: 508px;
     background: #fff;
     margin-right:20px;
     padding: 20px;
   }
   .container-right{
     flex: 1;
     padding: 20px;
     background: #fff;
   }
  .table-data{
    width:100%;
    border: 1px solid #EBEEF5;
    margin-bottom:60px;
    th{
        background: #FAFAFA;
        border-right: 1px solid #EBEEF5;
        border-bottom: 1px solid #EBEEF5;
        height: 54px;
        line-height: 54px;
    }
    .tBody{
      color: #606266;
       tr{
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
         td{
          text-align: center;
          border:1px solid #EBEEF5;
          // border-right: 1px solid #EBEEF5;
          // border-bottom: 1px solid #EBEEF5;
          min-width: 0;
          height: 48px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          text-align: center;
          text-overflow: ellipsis;
          vertical-align: middle;
          background-color: #fff;
          -webkit-transition: background-color 0.2s ease-in-out;
          transition: background-color 0.2s ease-in-out;
          width: 150px;
        }
      }
      /deep/tr:hover{
        /deep/td{
          background-color: #ebf7ff;
        }
      }
    }
  }

 }
}
</style>
