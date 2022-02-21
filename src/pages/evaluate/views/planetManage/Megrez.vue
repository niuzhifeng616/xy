<template>
  <div class='planet'>
    <div class="planet-tit">
      天权星学生个人数据统计
    </div>
    <div class="planet-main">
      <div class="border-box">
        <div class="border-left"></div>
        <div class="border-right"></div>
        <div class="box-head">
          <div class="head-icon"></div>
          <div class="head-txt">
            每月德育成长
          </div>
        </div>
        <div v-if="!data1" class="null-data null-data-bar">
          <div class="null-txt">暂无数据</div>
        </div>
        <div v-else class="mychart" ref="chart1"></div>
      </div>
      <div class="border-box">
        <div class="border-left"></div>
        <div class="border-right"></div>
        <div class="box-head">
          <div class="head-icon"></div>
          <div class="head-txt">
            德育观测
          </div>
        </div>
        <div v-if="!data2" class="null-data null-data-radar">
          <div class="null-txt">暂无数据</div>
        </div>
        <div v-else class="mychart" ref="chart2"></div>
      </div>
      <div class="border-box">
        <div class="border-left"></div>
        <div class="border-right"></div>
        <div class="box-head">
          <div class="head-icon"></div>
          <div class="head-txt">
            升级进度
          </div>
        </div>
        <div v-if="!data3" class="null-data null-data-pie">
          <div class="null-txt">暂无数据</div>
        </div>
        <div v-else class="mychart" ref="chart3"></div>
      </div>
      <div class="border-box">
        <div class="border-left"></div>
        <div class="border-right"></div>
        <div class="box-head">
          <div class="head-icon"></div>
          <div class="head-txt">
            本周得分详情
          </div>
        </div>
        <div v-if="!data4" class="null-data null-data-line">
          <div class="null-txt">暂无数据</div>
        </div>
        <div v-else class="mychart" ref="chart4"></div>
      </div>
      <div class="border-box">
        <div class="border-left"></div>
        <div class="border-right"></div>
        <div class="box-head">
          <div class="head-icon"></div>
          <div class="head-txt">
            总得分详情
          </div>
        </div>
        <div v-if="!data5" class="null-data null-data-pie">
          <div class="null-txt">暂无数据</div>
        </div>
        <div v-else class="mychart" id="chart5"></div>
      </div>
      <div class="border-box">
        <div class="border-left"></div>
        <div class="border-right"></div>
        <div class="box-head">
          <div class="head-icon"></div>
          <div class="head-txt">
            指标得分详情
          </div>
        </div>
        <div class="fir-index">
          <Icon type="ios-arrow-back" @click="back" />
          <div class="index-txt">
            {{firIndex}}
          </div>
          <Icon type="ios-arrow-forward" @click="forward" />
        </div>
        <div v-if="!data6" class="null-data null-data-pie">
          <div class="null-txt">暂无数据</div>
        </div>
        <div v-else class="mychart" ref="chart6"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    name: 'Megrez',
    data () {
      return {
        firIndex: '',
        indexID: 0,
        indexList: [],
        key: 0,
        // 判断是否有数据
        data1: true,
        data2: true,
        data3: true,
        data4: true,
        data5: true,
        data6: true,
        StudentID: 0
      }
    },
    created () {
      this.StudentID = this.$route.query.StudentID ? this.$route.query.StudentID : 0
    },
    mounted () {
      this.chart1()
      this.chart2()
      this.chart3()
      this.chart4()
      this.chart5()
      this.chart6()
    },
    methods: {
      async chart1 () {
        // 获取每月德育成长图表数据
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetStudentColumnarChart?StudentID=${this.StudentID}`)
        if (res.success) {
          var yData1 = res.data.ListStudent
          var yData2 = res.data.ListClass
          var listYear = res.data.ListPartYear
          if (yData1.length === 0 && yData2.length === 0 && listYear.length === 0) {
            this.data1 = false
            return
          } else {
            this.data1 = true
          }
        }
        const dom = this.$refs.chart1
        const myChart = this.echarts.init(dom)
        var name1 = '学生情况'
        var name2 = '班级均分'
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
              label: {
              }
            },
            formatter: function (params) {
              var tipString = params[0].axisValue + '<br />'
              var key = 'value'
              params.sort(function (obj1, obj2) {
                var val1 = obj1[key]
                var val2 = obj2[key]
                if (val1 < val2) {
                  return 1
                } else if (val1 > val2) {
                  return -1
                } else {
                  return 0
                }
              })
              var indexColor
              for (var i = 0, length = params.length; i < length; i++) {
                if (params[i].componentSubType === 'bar') {
                  indexColor = params[i + 1].color
                  tipString += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background:' + indexColor + '"></span>'
                  tipString += '<span data-type ="lineTip" data-val=' + params[i].value + '>' + params[i].seriesName + '：' + params[i].value + '</span><br />'
                }
              }
              return tipString
            }
          },
          legend: {
            orient: 'horizontal',
            icon: 'squareRatio', // 图例形状
            selectedMode: false,
            left: '3%',
            itemWidth: 9, // 图例标记的图形宽度。[ default: 25 ]
            itemHeight: 8, // 图例标记的图形高度。[ default: 14 ]
            itemGap: 30, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
            textStyle: {
              fontSize: 12,
              color: 'rgba(255, 255, 255, .6)'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '20%',
            containLabel: true
          },
          animation: true,
          xAxis: {
            type: 'category',
            data: listYear,
            axisLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#fff',
                opacity: 0.15
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(255,255,255,0.85)'
              }
            }
          },
          yAxis: {
            type: 'value',
            max: '10000',
            splitNumber: 5,
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255, 255, 255, .45)'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: 'rgba(255, 255, 255, .15)'
              }
            }
          },
          series: [
            {
              name: name1,
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(50,206,232,0.13)'
              },
              itemStyle: {
                normal: {
                  opacity: 0.9
                }
              },
              barWidth: '23',
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#00A5DC'
              }, {
                offset: 1,
                color: '#5CE8FF'
              }]),
              data: yData1
            },
            {
              name: name1,
              type: 'pictorialBar',
              symbol: 'diamond',
              symbolSize: [23, 12],
              symbolOffset: [-15, 6],
              z: 12,
              color: '#35D0E9',
              data: yData1
            },
            {
              name: name1,
              type: 'pictorialBar',
              symbol: 'diamond',
              symbolSize: [23, 12],
              symbolOffset: [-15, -6],
              symbolPosition: 'end',
              z: 12,
              color: '#35D0E9',
              data: yData1
            },
            {
              name: name2,
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(85,124,255,0.2)'
              },
              itemStyle: {
                normal: {
                  opacity: 0.9
                }
              },
              barWidth: '23',
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#0D40FD'
              }, {
                offset: 1,
                color: '#577DFF'
              }]),
              data: yData2
            },
            {
              name: name2,
              type: 'pictorialBar',
              symbol: 'diamond',
              symbolSize: [23, 12],
              symbolOffset: [15, 6],
              color: '#3764FC',
              z: 12,
              data: yData2
            },
            {
              name: name2,
              type: 'pictorialBar',
              symbol: 'diamond',
              symbolSize: [23, 12],
              symbolOffset: [15, -6],
              symbolPosition: 'end',
              z: 12,
              color: '#3764FC',
              data: yData2
            }
          ]
        }
        myChart.setOption(option, true)
      },
      async chart2 () {
        // 获取学生德育数据
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetStudentRadarChart?StudentID=${this.StudentID}`)
        if (res.success) {
          var data1 = res.data.StudentScoreList
          var data2 = res.data.ClassScoreList
          var index = []
          for (var i = 0; i < res.data.IndexList.length; i++) {
            index.push({
              text: res.data.IndexList[i],
              max: 4000
            })
          }
          if (data1.length === 0 && data2.length === 0 && index.length === 0) {
            this.data2 = false
            return
          } else {
            this.data2 = true
          }
        }
        const dom = this.$refs.chart2
        const myChart = this.echarts.init(dom)
        var name1 = '学生'
        var name2 = '班级'
        const option = {
          color: [
            '#02A6DD', '#904AFD'
          ],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            orient: 'horizontal',
            icon: 'squareRatio', // 图例形状
            selectedMode: true, // 隐藏对应图表
            left: '3%',
            itemWidth: 9, // 图例标记的图形宽度。[ default: 25 ]
            itemHeight: 8, // 图例标记的图形高度。[ default: 14 ]
            itemGap: 30, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
            textStyle: {
              fontSize: 12,
              color: 'rgba(255, 255, 255, .6)'
            }
          },
          radar: [
            {
              splitNumber: 4, // 雷达图圈数设置
              indicator: index,
              center: ['50%', '50%'], // 位置
              radius: 138, // 大小
              startAngle: 90,
              shape: 'rect', // 雷达样式图
              name: {
                formatter: '{value}',
                textStyle: {
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.85)' // 文字颜色
                }
              },
              axisLine: { // 坐标轴线
                lineStyle: {
                  width: 1,
                  color: '#1F2552'// // 图表背景网格线的颜色
                }
              },
              splitLine: { // 网格线
                lineStyle: {
                  width: 1,
                  color: '#1F2552'
                }
              },
              splitArea: {
                areaStyle: {
                  color: [], // 圆环颜色
                  shadowColor: 'blue', // 圆颜色
                  shadowBlur: 50
                }
              }
            }
          ],
          series: [
            {
              type: 'radar',
              tooltip: {
                trigger: 'item'
              },
              symbol: 'none',
              areaStyle: {},
              // markPoint: {
              //   symbol: 'emptyCircle',
              //   data: [
              //     { name: '爱国爱校重仪表', value: '', x: '50%', y: '20%', symbolSize: 5 },
              //     { name: '尊师爱友善待人', value: '', x: '26.5%', y: '47.5%', symbolSize: 5 },
              //     { name: '自立自主爱学习', value: '', x: '73.5%', y: '47.5%', symbolSize: 5 },
              //     { name: '珍爱生命健身心', value: '', x: '35.5%', y: '92.5%', symbolSize: 5 },
              //     { name: '精彩表现乐家人', value: '', x: '64.5%', y: '92.5%', symbolSize: 5 }
              //   ],
              //   itemStyle: {
              //     normal: {
              //       borderColor: '#00DEFF',
              //       borderWidth: 1, // 标注边线线宽，单位px，默认为1
              //       label: {
              //         show: false
              //       }
              //     }
              //   }
              // },
              data: [
                {
                  value: data1,
                  name: name1,
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          { offset: 0, color: '#5CE8FF' },
                          { offset: 1, color: '#00A5DC' }
                        ]
                      ),
                      opacity: 0.5
                    }
                  },
                  lineStyle: {
                    color: 'rgba(0,222,255,1)' // 雷达构成的区域边框
                  }
                },
                {
                  value: data2,
                  name: name2,
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          { offset: 0, color: '#904AFD' },
                          { offset: 1, color: '#571DD8' }
                        ]
                      ),
                      opacity: 0.5
                    }
                  },
                  lineStyle: {
                    color: 'rgba(100,70,200,1)' // 雷达构成的区域边框
                  }
                }
              ]
            }
          ]
        }
        myChart.setOption(option, true)
      },
      async chart3 () {
        // 获取进度
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetStudentPercentageChart?StudentID=${this.StudentID}`)
        if (res.success) {
          var percent = res.data
          if (percent === 0) {
            this.data3 = false
            return
          } else {
            this.data3 = true
          }
        }
        const dom = this.$refs.chart3
        const myChart = this.echarts.init(dom)
        const option = {
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              radius: '120px',
              startAngle: '225',
              endAngle: '-45',
              data: [{ value: percent, name: '升级进度' }],
              min: 0,
              max: 100,
              splitNumber: 5,
              axisLine: { // 轴线配置
                lineStyle: {
                  width: 20,
                  color: [
                    [percent / 100, new echarts.graphic.LinearGradient(
                      0, 1, 1, 0,
                      [{
                        offset: 0,
                        color: '#0079DC'
                      }, {
                        offset: 1,
                        color: '#0BFFFF'
                      }]
                    )],
                    [1, 'rgba(240,242,245,0.31)']
                  ]
                }
              },
              splitLine: { // 分割线样式
                show: false
              },
              axisTick: { // 刻度样式
                show: false
              },
              pointer: {
                length: '70px',
                width: '5px'
              },
              itemStyle: { // 指针样式
                color: '#00EAFF'
              },
              markPoint: {
                symbol: 'rect',
                data: [
                  { name: '1', value: '', x: '50%', y: '23%', symbolSize: 3 },
                  { name: '1', value: '', x: '36%', y: '34%', symbolSize: 3 },
                  { name: '1', value: '', x: '64%', y: '34%', symbolSize: 3 },
                  { name: '1', value: '', x: '50%', y: '50%', symbolSize: 22, symbol: 'circle' }
                ],
                itemStyle: {
                  color: '#00EAFF',
                  label: {
                    show: false
                  }
                }
              },
              title: {
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '14',
                offsetCenter: [0, 80]
              },
              detail: {
                formatter: '{value}%',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '30',
                padding: [160, 0, 0, 0]
              }
            }
          ]
        }
        myChart.setOption(option, true)
      },
      async chart4 () {
        // 获取本周得分数据
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetStudentLineChart?StudentID=${this.StudentID}`)
        if (res.success) {
          var yData1 = res.data.ListStudent
          var yData2 = res.data.ListClass
          var listYear = res.data.ListPartDate
          if (yData1.length === 0 && yData2.length === 0 && listYear.length === 0) {
            this.data4 = false
            return
          } else {
            this.data4 = true
          }
        }
        const dom = this.$refs.chart4
        const myChart = this.echarts.init(dom)
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          color: ['rgba(2,166,221,1)', 'rgba(14,65,253,1)', 'rgba(88,30,217,1)', 'rgba(100,255,189,1)'],
          legend: { // 图例
            left: '1%',
            data: ['学生情况', '班级均分'],
            icon: 'squareRatio', // 图标：空心圆样式，
            itemWidth: 9, // 图例标记的图形宽度。[ default: 25 ]
            itemHeight: 8, // 图例标记的图形高度。[ default: 14 ]
            itemGap: 30, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
            textStyle: {
              color: '#B0CEFC' // 图例文字颜色
            }
          },
          grid: {
            x: 35,
            y: 50,
            x2: 0,
            y2: 26
          },
          xAxis: {
            type: 'category', // 类目
            data: listYear,
            axisPointer: { // 坐标指示器
              type: 'shadow' // 阴影效果
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#B0CEFC'
              }
            }
          },
          yAxis: {
            type: 'value',
            max: 1000,
            min: 0,
            splitNumber: 5,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#B0CEFC'
              }
            },
            // 网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#14364f', '#11233c', '#122b44', '#14314a', '#102c42'], // 网格线色彩
                width: 1,
                type: 'solid'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                type: 'solid',
                color: '#AFB2C4',
                opacity: 0.5
              }
            },
            axisTick: {
              show: false
            }
          },
          series: [
            {
              name: '学生情况',
              type: 'line',
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      { offset: 0, color: '#00A5DC' },
                      { offset: 1, color: '#50DFFA' }
                    ]
                  ),
                  opacity: 0.4
                }
              },
              data: yData1,
              lineStyle: {
                normal: {
                  color: 'rgba(0,165,220,1)' // 折线颜色蓝色
                }
              }
            },
            {
              name: '班级均分',
              type: 'line',
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      { offset: 0, color: '#0D40FD' },
                      { offset: 1, color: '#577DFF' }
                    ]
                  ),
                  opacity: 0.4
                }
              },
              data: yData2,
              lineStyle: {
                normal: {
                  color: 'rgba(14,65,253, 1)'
                }
              }
            }
          ]
        }
        myChart.setOption(option, true)
      },
      async chart5 () {
        // 获取学生得分详情
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetStudentRingDiagram?StudentID=${this.StudentID}`)
        if (res.success) {
          var data = []
          for (var i = 0; i < res.data.ItemList.length; i++) {
            data.push({
              name: res.data.ItemList[i].IndexManagementName,
              y: res.data.ItemList[i].RingDiagramScore
            })
          }
          if (data.length === 0) {
            this.data5 = false
            return
          } else {
            this.data5 = true
          }
        }
        this.highcharts.chart('chart5', {
          chart: {
            type: 'pie',
            options3d: {
              enabled: true,
              alpha: 45
            },
            backgroundColor: 'rgba(255, 255, 255, 0)'
          },
          title: {
            floating: true,
            verticalAlign: 'middle',
            y: 30,
            text: 100,
            style: {
              color: '#00DEFF'
            }
          },
          tooltip: {
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
          },
          // 去掉highcharts链接
          credits: {
            enabled: false
          },
          plotOptions: {
            pie: {
              innerSize: 160,
              depth: 45,
              dataLabels: {
                style: {
                  color: 'white'
                },
                enabled: true,
                format: '<font style="color:rgba(255,255,255,0.85);font-size:14px">{point.name}</font>' + '<br/>' + '<font style="font-weight: 100;color:#6099FF;font-size:18px">{point.percentage:.1f}%</font>'
              }
            }
          },
          series: [{
            data: data
          }]
        })
      },
      async chart6 () {
        // 获取指标
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetIndexInfo?StudentID=${this.StudentID}`)
        if (res.success) {
          this.indexID = res.data[this.key].IndexManagementID
          this.firIndex = res.data[this.key].IndexManagementName
          this.indexList = res.data
        }
        // 获取学生指标得分详情
        let res2 = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetStudentPieChart`, {
          indexManagementID: this.indexID
        })
        if (res2.success) {
          var data = res2.data
          if (data.length === 0) {
            if (this.$refs.chart6) {
              this.echarts.init(this.$refs.chart6).dispose()
            }
            this.data6 = false
            return
          } else {
            this.data6 = true
          }
          var map = {}
          var allIndex = []
          for (let i = 0; i < data.length; i++) {
            var ai = data[i]
            if (!map[ai.name]) {
              allIndex.push({
                name: ai.name,
                data: [ai],
                value: ai.value
              })
              map[ai.name] = ai
            } else {
              for (let j = 0; j < allIndex.length; j++) {
                var dj = allIndex[j]
                if (dj.name === ai.name) {
                  dj.data.push(ai)
                  dj.value += ai.value
                  break
                }
              }
            }
          }
          // 按 name(二级指标)  分类
          var secIndex = []
          for (let i of allIndex) {
            secIndex.push({
              name: i.name,
              value: i.value
            })
          }
          // 所有三级指标排序
          var trdIndex = []
          for (let i of allIndex) {
            trdIndex = [...trdIndex, ...i.data]
          }
        }
        this.$nextTick(() => {
          const dom = this.$refs.chart6
          const myChart = this.echarts.init(dom)
          var colorList = ['#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac']
          const option = {
            tooltip: {
              formatter: function (param) {
                if (param.data.type == null) {
                  return param.data.name + ':' + param.value
                } else {
                  return param.data.type + ':' + param.value
                }
              }
            },
            series: [
              {
                name: '二级指标',
                type: 'pie',
                radius: [0, '40%'],
                label: {
                  position: 'inner'
                },
                itemStyle: {
                  normal: {
                    borderColor: '#000',
                    borderWidth: 1,
                    color: function (params) {
                      return colorList[params.dataIndex]
                    }
                  }
                },
                selectedMode: 'single',
                data: secIndex
              },
              {
                name: '三级指标',
                type: 'pie',
                radius: ['50%', '70%'],
                itemStyle: {
                  normal: {
                    color: function (params) {
                      return colorList[params.dataIndex]
                    }
                  }
                },
                label: {
                  normal: {
                    formatter: function (params) {
                      if (params.value !== 0) { return params.data.type + ':' + params.value } else { return '' }
                    },
                    color: 'rgba(255,255,255,0.85)',
                    show: false
                  }
                },
                data: trdIndex
              }
            ]
          }
          myChart.setOption(option, true)
        })
      },
      // 上一个指标
      back () {
        if (this.key > 0) {
          this.key--
          this.chart6()
        }
      },
      // 下一个指标
      forward () {
        if (this.key < this.indexList.length) {
          this.key++
          this.chart6()
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.planet {
  width: 100%;
  background: url("./imgs/planetBg.png") no-repeat -1px -5px;
  background-size: calc(100vw + 2px) calc(100% + 20px);
  padding-top: 20px;
  .planet-tit {
    width: 100%;
    height: 66px;
    background: url('./imgs/titleBg.png') no-repeat left top;
    background-size: 100% 100%;
    text-align: center;
    line-height: 58px;
    font-size: 30px;
    color: #fff;
  }
  .planet-main {
    padding: 42px 0px 5px 2vw;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .border-box {
      width: 31.25vw;
      height: 442px;
      margin-right: 1vw;
      margin-bottom: 20px;
      border: 4px solid;
      border-image: linear-gradient(270deg, #0C63FF 0, #0C63FF 5.8%, #002f48 5.801%, #002f48, #2570ff, #002f48, #002f48 94.199%, #0C63FF 94.2%, #0C63FF 100%) 4 4;
      border-radius: 1px;
      position: relative;
      padding: 16px;
      .border-left {
        position: absolute;
        width: 4px;
        height: 372px;
        background: #002f48;
        left: -4px;
        top: 35px;
        z-index: 1;
      }
      .border-right {
        position: absolute;
        width: 4px;
        height: 372px;
        background: #002f48;
        right: -4px;
        top: 35px;
        z-index: 1;
      }
      .box-head {
        display: flex;
        align-items: center;
        .head-icon {
          width: 16px;
          height: 16px;
          background: url('./imgs/arrow.png') no-repeat left top;
          background-size: 16px 16px;
        }
        .head-txt {
          font-size: 16px;
          line-height: 22px;
          color: #fff;
          margin-left: 6px;
        }
      }
      .fir-index {
        display: flex;
        align-items: center;
        margin-top: 20px;
        color: #8C8C8C ;
        .index-txt {
          margin: 0 10px;
          cursor: default;
        }
        i {
          cursor: pointer;
        }
      }
      .mychart {
        height: 345px;
        margin-top: 36px;
      }
      .mychart:nth-child(5) {
        margin-top: 0;
      }
    }
  }
}
.border-box:nth-child(6) .null-data-pie {
  margin-top: 0;
}
// 暂无数据
.null-data {
  height: 300px;
  text-align: center;
  color: #6095F9;
  font-size: 16px;
  .null-txt {
    position: relative;
  }
}
.null-data-pie {
  background: url('./imgs/nullDataPie.png') no-repeat center;
  background-size: 268px 180px;
  margin-top: 40px;
  .null-txt{
    top: 216px;
  }
}
.null-data-bar {
  background: url('./imgs/nullDataBar.png') no-repeat center;
  background-size: 530px 218px;
  margin-top: 30px;
  .null-txt{
    top: 230px;
  }
}
.null-data-line {
  background: url('./imgs/nullDataLine.png') no-repeat center;
  background-size: 530px 212px;
  margin-top: 40px;
  .null-txt{
    top: 222px;
  }
}
.null-data-radar {
  background: url('./imgs/nullDataRadar.png') no-repeat center;
  background-size: 258px 240px;
  margin-top: 40px;
  .null-txt{
    top: 210px;
  }
}
</style>
