<template>
  <div class='planet'>
    <div class="planet-tit">
      课程管理平台
    </div>
    <Row :gutter="20">
      <div class="planet-main">
        <i-col  :span="8">
          <div class="border-box">
            <div class="border-left"></div>
            <div class="border-right"></div>
            <div class="box-head">
              <div class="head-icon"></div>
              <div class="head-txt">
                升级进度
              </div>
            </div>
            <div class="mychart" ref="chart1" v-show="showchart1" ></div>
            <div  class="null-data null-data-radar" v-show="!showchart1">
             <div class="null-txt">暂无数据</div>
            </div>
            <Spin fix v-if="spinShow" size="large"></Spin>
          </div>
        </i-col>
         <i-col  :span="8">
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
                {{indexItem.IndexManagementName}}
              </div>
              <Icon type="ios-arrow-forward" @click="forward" />
            </div>
            <div  class="null-data null-data-pie" v-show="!showchart2">
              <div class="null-txt">暂无数据</div>
            </div>
            <div class="mychart " ref="chart2" style="height:210px" v-show="showchart2" ></div>
            <Spin fix v-if="spinShow2" size="large"></Spin>
          </div>
        </i-col>
        <i-col  :span="8">
          <div class="ranking">
             <div class="rank-item">
               <div class="border-left"></div>
               <div class="border-right"></div>
               <div class="box-head">
                <div class="head-icon"></div>
                <div class="head-txt">
                  总分TOP3
                </div>
              </div>
              <div class="grade-top">
                <div class="top-icon">
                  <img src="../imgs/gold.png" alt="">
                </div>
                <div class="person-content">
                  <div class="person" v-for="(item,index) in topData" :key="index">
                    <img src="https://pics4.baidu.com/feed/aa18972bd40735fad892e9f7dab7c1b40e24080f.jpeg?token=0694ca4dc1502d2e801e371304922213&s=97365C84C2A00B0DE2316CD10300C0AA" alt="">
                    <div class="p-right">
                      <p>{{item.FullName}}</p>
                      <p style="margin-top:5px">TOP{{index+1}}</p>
                    </div>
                  </div>
                </div>
              </div>
             </div>
             <div class="rank-item">
               <div class="border-left"></div>
               <div class="border-right"></div>
               <div class="box-head">
                <div class="head-icon"></div>
                <div class="head-txt">
                  仍需努力
                </div>
              </div>
              <div class="grade-top">
                <div class="top-icon">
                  <img src="../imgs/gold.png" alt="">
                </div>
                <div class="person-content">
                  <div class="person" v-for="(item,index) in lastData" :key="index">
                    <img src="https://pics4.baidu.com/feed/aa18972bd40735fad892e9f7dab7c1b40e24080f.jpeg?token=0694ca4dc1502d2e801e371304922213&s=97365C84C2A00B0DE2316CD10300C0AA" alt="">
                    <div class="p-right">
                      <p>{{item.FullName}}</p>
                      <p style="margin-top:5px">TOP{{index+1}}</p>
                    </div>
                  </div>
                </div>
              </div>
             </div>
          </div>
        </i-col>
        <i-col  :span="16">
          <div class="border-box">
            <div class="border-left"></div>
            <div class="border-right"></div>
            <div class="box-head">
              <div class="head-icon"></div>
              <div class="head-txt">
                每月德育成长
              </div>
            </div>
            <div class="mychart" ref="chart3"  v-show='!showchart3'></div>
            <div  class="null-data null-data-bar" v-show="showchart3">
              <div class="null-txt">暂无数据</div>
            </div>
            <Spin fix v-if="spinShow3" size="large"></Spin>
          </div>

           <div class="border-box">
            <div class="border-left"></div>
            <div class="border-right"></div>
            <div class="box-head">
              <div class="head-icon"></div>
              <div class="head-txt">
                学生得分情况详情
              </div>
            </div>
            <div class="mychart"  ref="chart4" v-show="showchart4"></div>
            <div  class="null-data null-data-bar" v-show="!showchart4">
              <div class="null-txt">暂无数据</div>
            </div>
            <Spin fix v-if="spinShow4" size="large"></Spin>
          </div>
        </i-col>
        <i-col  :span="8">
          <div class="border-box2">
            <div class="border-left2"></div>
            <div class="border-right2"></div>
            <div class="index-list">
              <div class="box-head">
                <div class="head-icon"></div>
                <div class="head-txt">
                  均分最高指标TOP5
                </div>
              </div>
              <template v-if="scoreData.length>0">
                <div class="index-item" v-for="(item,index) in scoreData" :key="index">
                  <div class="item-left">
                    <img src="../imgs/no1.png" alt="">
                    <span>{{item.name}}</span>
                  </div>
                  <div class="item-right">
                    分值{{item.value}}
                  </div>
                </div>
              </template>
              <div  class="null-data null-data-bar" v-else>
                <div class="null-txt">暂无数据</div>
              </div>
            </div>
            <div class="index-list" style="margin-top:25px">
              <div class="box-head">
                <div class="head-icon"></div>
                <div class="head-txt">
                  失分最高指标TOP5
                </div>
              </div>
              <template v-if="loseData.length>0">
                <div class="index-item" v-for="(item,index) in loseData" :key="index">
                  <div class="item-left">
                    <img src="../imgs/no1.png" alt="">
                    <span>{{item.name}}</span>
                  </div>
                  <div class="item-right">
                    分值{{item.value}}
                  </div>
                </div>
              </template>
              <div  class="null-data null-data-bar" v-else>
                <div class="null-txt">暂无数据</div>
              </div>
            </div>
          </div>
        </i-col>
      </div>
    </Row>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    name: '',
    data () {
      return {
        spinShow: false,
        spinShow2: false,
        spinShow3: false,
        spinShow4: false,
        studentGradeForStudentYearID: '',
        studentOrganizationID: '',
        showchart1: true,
        showchart2: true,
        showchart3: true,
        showchart4: true,
        scoreData: [],
        loseData: [], //
        topData: [], // 前三名
        lastData: [], // 后三名,
        indexList: [], // 一级指标
        indexItem: {}, // 选中的指标
        key: 0,
        list: [
          {
            name: '窦尔敦'
          },
          {
            name: '司马土登'
          },
          {
            name: '窦尔敦'
          }
        ]

      }
    },
    created () {
      this.studentGradeForStudentYearID = this.$route.query.studentGradeForStudentYearID
      this.studentOrganizationID = this.$route.query.studentOrganizationID
      this.getIndex()
      this.GetGradeRadarChart()
      this.GetClassEveryMonthChart()
      this.GetClassEveryStudentScoreInfo()
      this.GetGradeIndexRankingInfo(0)
      this.GetGradeIndexRankingInfo(1)
      this.GetGradeRankingInfo(0)
      this.GetGradeRankingInfo(1)
    },
    mounted () {},
    methods: {
      async  getIndex () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetIndexInfo`)
        console.log(res)
        if (res.success) {
          this.indexList = res.data
          this.indexItem = res.data[0]
          this.GetGradeRingDiagram()
        }
      },
      // 获取班级升级进度数据
      async GetGradeRadarChart () {
        this.spinShow = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetClassRadarChart?studentGradeForStudentYearID=${this.studentGradeForStudentYearID}&studentOrganizationID=${this.studentOrganizationID}`)
        if (res.success) {
          this.spinShow = false
          this.chartDom1 = this.echarts.init(this.$refs.chart1)
          if (res.data.GradeData.length === 0) {
            this.showchart1 = false
            return false
          } else {
            this.showchart1 = true
          }
          var index = []
          for (var i = 0; i < res.data.IndexData.length; i++) {
            index.push({
              text: res.data.IndexData[i],
              max: 4000
            })
          }
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
              },
              data: res.data.IndexData
            },
            radar: [
              {
                splitNumber: 4, // 雷达图圈数设置
                indicator: index,
                center: ['50%', '65%'], // 位置
                radius: '90%', // 大小
                startAngle: 90,
                shape: 'rect', // 雷达样式图
                nameGap: 5,
                name: {
                  formatter: function (params, index) {
                    let strlength = params.length
                    if (strlength % 2 === 1) {
                      params = params.replace(/\S{4}/g, function (match) {
                        return match + '\n'
                      })
                    } else {
                      params = params.replace(/\S{4}/g, function (match) {
                        return match + '\n'
                      })
                    }
                    return params
                  },
                  textStyle: {
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.85)' // 文字颜色
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
                data: [
                  {
                    value: res.data.GradeData,
                    name: '年级均分',
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
                  }
                ]
              }
            ]
          }
          this.chartDom1.setOption(option, true)
        }
      },
      // 获取年级指标得分详情
      async GetGradeRingDiagram () {
        this.spinShow2 = true
        let params = {
          studentGradeForStudentYearID: this.studentGradeForStudentYearID,
          studentOrganizationID: this.studentOrganizationID,
          indexManagementID: this.indexItem.IndexManagementID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetClassRingDiagram`, params)
        if (res.success) {
          this.spinShow2 = false
          var map = {}
          var allIndex = []
          var data = res.data
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
          console.log(secIndex)
          // 所有三级指标排序
          var trdIndex = []
          for (let i of allIndex) {
            trdIndex = [...trdIndex, ...i.data]
          }
          this.$nextTick(() => {
            const dom = this.$refs.chart2
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
        }
      },
      // 获取每月德育成长数据
      async GetClassEveryMonthChart () {
        this.spinShow3 = true
        let params = {
          studentGradeForStudentYearID: this.studentGradeForStudentYearID,
          studentOrganizationID: this.studentOrganizationID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetClassEveryMonthChart`, params)
        if (res.success) {
          this.spinShow3 = false
          if (res.data.ListClass.length === 0 && res.data.ListGrade.length === 0) {
            this.showchart3 = false
            return false
          } else {
            this.showchart3 = true
          }
          var yData1 = res.data.ListClass
          var yData2 = res.data.ListClass
          var listYear = res.data.ListPartYear
          const dom = this.$refs.chart3
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
        }
      },
      // 获取学生得分情况详情
      async GetClassEveryStudentScoreInfo () {
        this.spinShow4 = true
        let params = {
          studentOrganizationID: this.studentOrganizationID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetClassEveryStudentScoreInfo`, params)
        if (res.success) {
          this.spinShow4 = false
          if (res.data.length === 0) {
            this.showchart4 = false
            return false
          } else {
            this.showchart4 = true
          }
          const dom = this.$refs.chart4
          const myChart = this.echarts.init(dom)
          //  let xData =
          let xData = []
          let yData = []
          let yData2 = []
          for (let i of res.data) {
            xData.push({ value: i.FullName, name: i.StudentID })
            yData.push({ value: i.Score, id: i.StudentID })
            yData2.push({ value: 1, id: i.StudentID })
          }
          const option = {
            color: ['rgba(87,125,255,1)', 'rgba(13,64,253,1)'],
            dataZoom: {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              left: '9%',
              right: '9%',
              bottom: -0,
              start: 0,
              height: 15,
              end: 15 // 初始化滚动条
            },
            xAxis: {
              axisLabel: {
                color: 'rgba(133,134,163,1)',
                fontSize: 12,
                interval: 0
              },
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(87,125,255,1)',
                  width: 1,
                  type: 'dashed'
                },
                show: true
              },
              data: xData,
              type: 'category'
            },
            yAxis: {
              axisLabel: {
                color: 'rgba(133,134,163,1)',
                fontSize: 12
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(255,255,255,0.15)',
                  type: 'solid'
                }
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(255,255,255,0.15)',
                  width: 1,
                  type: 'dashed'
                },
                show: true
              },
              name: ''
            },

            series: [{
                       data: yData,
                       type: 'bar',
                       barWidth: 20,
                       itemStyle: {
                         color: {
                           x: 0,
                           y: 0,
                           x2: 0,
                           y2: 1,
                           type: 'linear',
                           global: false,
                           'colorStops': [{
                             'offset': 0,
                             'color': 'rgba(13,64,253,1)'
                           }, {
                             'offset': 1,
                             'color': 'rgba(87,125,255,1)'
                           }]
                         }
                       },
                       label: {
                         show: true,
                         position: 'top',
                         distance: 10,
                         color: '#fff'
                       }
                     },
                     {
                       data: yData2,
                       type: 'pictorialBar',
                       barMaxWidth: '20',
                       symbol: 'diamond',
                       symbolOffset: [0, '50%'],
                       symbolSize: [20, 15]
                     },
                     {
                       data: yData,
                       type: 'pictorialBar',
                       barMaxWidth: '20',
                       symbolPosition: 'end',
                       symbol: 'diamond',
                       symbolOffset: [0, '-50%'],
                       symbolSize: [20, 12],
                       zlevel: 2
                     }

            ],
            tooltip: {
              trigger: 'item',
              show: true
            }
          }
          myChart.setOption(option, true)

          myChart.on('click', (param) => {
            let params = { StudentID: param.data.id }
            let router = this.$router.resolve({
              path: '/Megrez',
              query: params
            })
            window.open(router.href, '_blank')
            // this.$router.push({
            //   path: '/Megrez',
            //   query: params
            // })
          })
        }
      },
      // 获取年级学生 排名详情
      async GetGradeRankingInfo (isPositive) {
        let params = {
          studentOrganizationID: this.studentOrganizationID,
          isPositive: isPositive // 0 失分，1 得分
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetGradeRankingInfo`, params)
        if (res.success) {
          isPositive === 1 ? this.topData = res.data : this.lastData = res.data
        }
      },
      // 获取年级均分最高指标TOP5
      async GetGradeIndexRankingInfo (isPositive) {
        let params = {
          studentOrganizationID: this.studentOrganizationID,
          isPositive: isPositive // 0 失分，1 得分
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarDisplay/GetClassIndexRankingInfo`, params)
        if (res.success) {
          isPositive === 1 ? this.scoreData = res.data : this.loseData = res.data
        }
      },
      // 上一个指标
      back () {
        if (this.key > 0) {
          this.key--
        } else if (this.key === 0) {
          this.key = this.indexList.length - 1
        }
        this.indexItem = this.indexList[this.key]
        this.GetGradeRingDiagram()
      },
      // 下一个指标
      forward () {
        if (this.key < this.indexList.length) {
          this.key++
        } else {
          this.key = 0
        }
        this.indexItem = this.indexList[this.key]
        this.GetGradeRingDiagram()
      }

    }
  }
</script>
<style lang='less' scoped>
.planet {
  width: 100%;
  // height: 100%;
  background: url("../imgs/planetBg.png") no-repeat -1px -1px;
 //background-size: calc(100vw + 2px) calc(100vh + 2px);
 background-size:cover;
  padding-top: 20px;
  overflow: hidden;
  .planet-tit {
    width: 100%;
    height: 66px;
    background: url('../imgs/titleBg.png') no-repeat left top;
    background-size: 100% 100%;
    text-align: center;
    line-height: 58px;
    font-size: 30px;
    color: #fff;
  }
  .planet-main {
    padding: 42px 20px 25px 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .border-box {
      width: 100%;
      height: 292px;
      margin-right: 20px;
      margin-bottom: 20px;
      border: 4px solid;
      border-image: linear-gradient(270deg, #0C63FF 0, #0C63FF 5.8%, #002f48 5.801%, #002f48, #2570ff, #002f48, #002f48 94.199%, #0C63FF 94.2%, #0C63FF 100%) 4 4;
      border-radius: 1px;
      position: relative;
      padding: 16px;
      .border-left {
        position: absolute;
        width: 4px;
        height: 246px;
        background: #002f48;
        left: -4px;
        top: 35px;
        z-index: 1;
      }
      .border-right {
        position: absolute;
        width: 4px;
        height: 246px;
        background: #002f48;
        right: -4px;
        top: 35px;
        z-index: 1;
      }
      .mychart {
        height: 236px;
      }
      .m-t{
        margin-top:36px
      }
    }
     .box-head {
        display: flex;
        align-items: center;
        .head-icon {
          width: 16px;
          height: 16px;
          background: url('../imgs/arrow.png') no-repeat left top;
          background-size: 16px 16px;
        }
        .head-txt {
          font-size: 16px;
          line-height: 22px;
          color: #fff;
          margin-left: 6px;
        }
      }
    .rank-item{
      width: 100%;
      height: 137px;
      margin-right: 20px;
      margin-bottom: 20px;
      border: 4px solid;
      border-image: linear-gradient(270deg, #0C63FF 0, #0C63FF 5.8%, #002f48 5.801%, #002f48, #2570ff, #002f48, #002f48 94.199%, #0C63FF 94.2%, #0C63FF 100%) 4 4;
      border-radius: 1px;
      position: relative;
      padding:  16px;
      .grade-top{
        margin-top: 14px;
        display: flex;
        height: 66px;
        align-items: center;
        .top-icon{
          width: 47px;
          height: 53px;
          margin-left: 10px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .person-content{
          flex:1;
          padding-left:10px;
          display: flex;
          justify-content: space-between;
        }
        .person{
          display: flex;
          align-items: center;

          img{
            width: 66px;
            height: 66px;
            border-radius: 50%;
          }
         .p-right{
           margin-left: 9px;
           p{
             font-size: 16px;
             color: rgba(255,255,255,0.85);
           }
         }
        }
      }
    }
    .border-box2{
      width: 100%;
      height: 602px;
      margin-right: 20px;
      margin-bottom: 20px;
      border: 4px solid;
      border-image: linear-gradient(270deg, #0C63FF 0, #0C63FF 5.8%, #002f48 5.801%, #002f48, #2570ff, #002f48, #002f48 94.199%, #0C63FF 94.2%, #0C63FF 100%) 4 4;
      border-radius: 1px;
      position: relative;
      padding: 12px 16px;
      .border-left2 {
        position: absolute;
        width: 4px;
        height: 556px;
        background: #002f48;
        left: -4px;
        top: 35px;
        z-index: 1;
      }
      .border-right2 {
        position: absolute;
        width: 4px;
        height: 556px;
        background: #002f48;
        right: -4px;
        top: 35px;
        z-index: 1;
      }
    }
    .index-list{
      .index-item{
        display: flex;
        padding: 23px 35px 0 27px;
        justify-content: space-between;
        align-items: center;
        .item-left{
          img{
            width: 27px;
            height: 22px;
          }
          span{
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            color: #e5e5e5;
            margin-left: 9px;
          }
        }
        .item-right{
          font-size: 14px;
          color: #e5e5e5;
        }
      }

    }
  }
}
.fir-index {
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: #8C8C8C ;
  .index-txt {
    margin: 0 10px;
    cursor: default;
  }
  i {
    cursor: pointer;
  }
}
// 暂无数据
.null-data {
  width: 100%;
  height: 190px;
  text-align: center;
  color: #6095F9;
  font-size: 16px;
  .null-txt {
    position: relative;
  }
}
.null-data-bar {
  background: url('../imgs/nullDataBar.png') no-repeat center;
  background-size: 430px 168px;
  margin-top: 10px;
  .null-txt{
    top: 140px;
  }
}
.null-data-pie {
  background: url('../imgs/nullDataPie.png') no-repeat center;
  background-size: 187.6px 126.7px;
  .null-txt{
    top:116px;
  }
}
</style>
