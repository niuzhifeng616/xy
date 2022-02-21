<template>
  <div class='planet'>
    <div class="planet-tit">
      天枢星学生个人数据统计
    </div>
    <div class='' style="margin: 0  20px">
      <Select v-model="DisciplineID" style="width:200px" @on-change="changeClassList">
        <Option v-for="item in classlist" :value="item.DisciplineID" :key="item.DisciplineID">{{ item.DisciplineName }}</Option>
      </Select>
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
                  习惯养成
                </div>
              </div>
              <div class="mychart m-t" ref="chart1" v-show="!chartShow1"></div>
              <div v-show="chartShow1" class="null-data null-data-radar">
                <div class="null-txt">暂无数据</div>
              </div>
            </div>
          </i-col>
          <i-col  :span="8">
            <div class="border-box">
              <div class="border-left"></div>
              <div class="border-right"></div>
              <div class="box-head">
                <div class="head-icon"></div>
                <div class="head-txt">
                    学科素养
                </div>
              </div>
              <div class="mychart m-t" ref="chart2" v-show="!chartShow2"></div>
              <div v-show="chartShow2" class="null-data null-data-radar">
                <div class="null-txt">暂无数据</div>
              </div>
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
               <div class="mychart m-t" ref="chart3" v-show="!chartShow3"></div>
               <div v-show="chartShow3" class="null-data null-data-pie">
                 <div class="null-txt">暂无数据</div>
               </div>
            </div>
          </i-col>
          <i-col  :span="8">
            <div class="border-box">
              <div class="border-left"></div>
              <div class="border-right"></div>
              <div class="box-head">
                <div class="head-icon"></div>
                <div class="head-txt">
                  小组得分详情
                </div>
              </div>
              <div class="dateContnet">
                <DatePicker type="daterange" show-week-numbers placement="bottom-end" @on-change="changeDate1" placeholder="Select date" style="width: 200px;opcity:0" v-model="dateArrChart4"></DatePicker>
              </div>
              <div class="mychart" ref="chart4" v-show="!chartShow4"></div>
              <div v-show="chartShow4" class="null-data null-data-line">
                <div class="null-txt">暂无数据</div>
              </div>
            </div>
          </i-col>
          <i-col  :span="8">
            <div class="border-box">
              <div class="border-left"></div>
              <div class="border-right"></div>
              <div class="box-head">
                <div class="head-icon"></div>
                <div class="head-txt">
                  每日得分详情
                </div>
              </div>
              <div class="dateContnet">
                <DatePicker type="daterange" show-week-numbers placement="bottom-end" @on-change="changeDate2" placeholder="Select date" style="width: 200px;opcity:0" v-model="dateArrChart5"></DatePicker>
              </div>
             <div class="mychart" ref="chart5" v-show="!chartShow5"></div>
             <div v-show="chartShow5" class="null-data null-data-line">
              <div class="null-txt">暂无数据</div>
             </div>
            </div>
          </i-col>
          <i-col  :span="8">
            <div class="border-box">
              <div class="border-left"></div>
              <div class="border-right"></div>
              <div class="box-head">
                <div class="head-icon"></div>
                <div class="head-txt">
                  课堂评价月度分析
                </div>
              </div>
              <div class="dateContnet">
                <DatePicker
                  type="month"
                  placement="bottom-start"
                  placeholder="请选择开始月份"
                  @on-change="handleChangeBeginMonth"
                  :clearable="false"
                  :editable="false"
                  v-model="beginMonth"
                  style="width:150px"
                ></DatePicker>~~
                <DatePicker
                  type="month"
                  placement="bottom-start"
                  v-model="endMonth"
                  placeholder="请选择结束月份"
                  @on-change="handleChangeEndMonth"
                  :clearable="false"
                  style="width:150px"
                  :editable="false"
                ></DatePicker>
                  <!-- <DatePicker type="month" placeholder="Select year" style="width: 200px"></DatePicker> -->

                <!-- <DatePicker type="daterange" show-week-numbers placement="bottom-end" @on-change="changeDate3"    placeholder="Select date" style="width: 200px;opcity:0" v-model="dateArrChart6"></DatePicker> -->
              </div>
             <div class="mychart" ref="chart6" v-show="!chartShow6"></div>
             <div v-show="chartShow6" class="null-data null-data-bar">
              <div class="null-txt">暂无数据</div>
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
    name: 'Dubhe',
    data () {
      return {
        colorList: ['rgba(247,64,106,1)', 'rgba(92,232,255,1)'],
        chartPie: {},
        chartDom1: {},
        chartDom2: {},
        chartDom3: {},
        chartDom4: {},
        chartDom5: {},
        chartDom6: {},
        classlist: [],
        DisciplineID: -1,
        dateArrChart4: [],
        dateArrChart5: [],
        beginMonth: '',
        endMonth: '',
        chartShow1: false,
        chartShow2: false,
        chartShow3: false,
        chartShow4: false,
        chartShow5: false,
        chartShow6: false
      }
    },
    created () {

    },
    mounted () {
      this.$nextTick(() => {
        this.getClass()
        this.getDate()
        window.addEventListener('resize', () => {
          this.chartDom1.resize()
          this.chartDom2.resize()
          this.chartDom3.resize()
          this.chartDom4.resize()
          this.chartDom5.resize()
          this.chartDom6.resize()
        }, false)
      })
    },
    methods: {
      getDate () {
        let weekOfday = this.xy.moment().format('E')
        // 计算今天是这周第几天
        let lastMonday = this.xy.moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')// 周一日期
        let lastSunday = this.xy.moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD')// 周日日期
        this.dateArrChart4 = [lastMonday, lastSunday]
        this.dateArrChart5 = [lastMonday, lastSunday]
        console.log(this.xy.moment().startOf('month').format('YYYY-MM-DD'))
        // this.dateArrChart6 = [lastMonday, lastSunday]
        this.beginMonth = this.xy.moment().startOf('month').format('YYYY-MM-DD')
        this.endMonth = this.xy.moment(this.beginMonth, 'YYYY-MM-DD').add(1, 'months').startOf('month').format('YYYY-MM-DD')
      },
      changeDate1 (e) {
        this.dateArrChart4 = e
        this.chart4()
      },
      changeDate2 (e) {
        this.dateArrChart5 = e
        this.chart5()
      },
      changeDate3 (e) {
        console.log(e)
        // this.dateArrChart6 = e
        // this.chart6()
      },
      // 获取开始月份
      handleChangeBeginMonth (month) {
        this.beginMonth = month
        this.chart6()
      },
      // 获取结束月份
      handleChangeEndMonth (month) {
        this.endMonth = month
        this.chart6()
      },
      changeClassList (e) {
        this.DisciplineID = e
        this.getData()
      },
      getData () {
        this.GetCommonIndexStatisticInfo()
        this.GetDisciplineIndexStatisticInfo()
        this.chart3()// 饼图
        this.chart4()// 小组得分详情
        this.chart5()// 每日得分详情
        this.chart6() // 评价月度分析
      },
      async getClass () {
        // /api/StarProgrammeRule/GetStarProgrammeDisciplineInfo
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarProgrammeRule/GetStarProgrammeDisciplineInfo?starTypeID=1`)
        if (res.success) {
          this.classlist = res.data
          this.DisciplineID = res.data[0].DisciplineID
          this.getData()
        }
      },
      getSource () {
        // this.chartPie = this.echarts.init(document.getElementById('group_score'))
        // this.chartPie.setOption(this.groupSource, true)
      },
      // 习惯养成
      async GetCommonIndexStatisticInfo () {
        // /api/EvaluateStatisticForChart/GetCommonIndexStatisticInfo
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/EvaluateStatisticForChart/GetCommonIndexStatisticInfo?DisciplineID=${this.DisciplineID}`)
        // console.log(res)
        if (res.success) {
          if (res.data.Datas.length === 0 || res.data.Indicators.length === 0) {
            this.chartShow1 = true
            return false
          } else {
            this.chartShow1 = false
          }
          this.chartDom1 = this.echarts.init(this.$refs.chart1)
          let indicatorData = res.data.Indicators
          let nameDatas = []
          let seriesArr = []
          let colorList = ['rgba(87,29,216,1)', 'rgba(0,165,220,1)']
          let color1 = [
            { offset1: '#904AFD', offset2: '#571DD8', lineColor: 'rgba(100,70,200,1)' },
            { offset1: '#5CE8FF', offset2: '#00A5DC', lineColor: 'rgba(0,222,255,1)' }
          ]

          res.data.Datas.map((item, i) => {
            item.value = item.data
            nameDatas.push(item.name)
            let obj = {
              name: res.data.Datas[i].name,
              type: 'radar',
              symbol: 'none',
              symbolSize: 10,
              areaStyle: {
                normal: {
                  color: colorList[i]
                }
              },
              itemStyle: {
                color: colorList[i],
                borderColor: colorList[i],
                borderWidth: 10
              },
              lineStyle: {
                normal: {
                  type: 'dashed',

                  color: colorList[i],
                  width: 2
                }
              },
              data: [
                {
                  value: res.data.Datas[i].value,
                  name: res.data.Datas[i].name,
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          { offset: 0, color: color1[i].offset1 },
                          { offset: 1, color: color1[i].offset2 }
                        ]
                      ),
                      opacity: 0.5
                    }
                  },
                  lineStyle: {
                    color: color1[i].lineColor // 雷达构成的区域边框
                  }
                }
              ]
            }
            seriesArr.push(obj)
          })

          const option = {
            color: ['rgba(87,29,216,1)', 'rgba(0,222,255,1)'],
            tooltip: {
              show: true,
              trigger: 'item',
              position: [20, 0]

            },
            legend: {
              show: true,
              icon: 'circle',
              left: '10%',
              top: '0%',
              orient: 'horizontal',
              textStyle: {
                fontSize: 14,
                color: '#fff'
              },
              data: nameDatas
            },
            radar: {
              center: ['50%', '50%'],
              radius: '70%',
              startAngle: 90,
              splitNumber: 4,
              shape: 'polygon',
              splitArea: {
                areaStyle: {
                  color: ['transparent']
                }
              },
              axisLabel: {
                show: false,
                fontSize: 18,
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal'
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'white' //
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'white' //
                }
              },
              name: {
                formatter: function (params, index) {
                  let strlength = params.length
                  // if (strlength === 1) {
                  //   params = function (match) {
                  //     return match
                  //   }
                  //   return false
                  // }
                  if (strlength % 2 === 1) {
                    params = params.replace(/\S{4}/g, function (match) {
                      return match + '\n'
                    })
                  } else {
                    params = params.replace(/\S{4}/g, function (match) {
                      return match + '\n'
                    })
                    // strlength = params.length
                    // params = params.substring(0, strlength - 1)
                  }
                  return params
                },
                textStyle: {
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.85)' // 文字颜色
                }
              },
              // name: {
              //   // 切割文字
              //   formatter: function (params, index) {
              //     console.log(params)
              //     // 超出省略
              //     params = params.toString()
              //     var maxlength = 4
              //     if (params.length > maxlength) {
              //       return params.substring(0, maxlength - 1) + '...'
              //     } else {
              //       return params
              //     }
              //   }
              // },
              indicator: indicatorData
            },
            series: seriesArr
          }
          this.chartDom1.setOption(option, true)
        }
      },
      // 学科素养
      // /api/EvaluateStatisticForChart/GetDisciplineIndexStatisticInfo
      async  GetDisciplineIndexStatisticInfo () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/EvaluateStatisticForChart/GetDisciplineIndexStatisticInfo?DisciplineID=${this.DisciplineID}`)
        if (res.success) {
          if (res.data.Datas.length === 0 || res.data.Indicators.length === 0) {
            this.chartShow2 = true
            return false
          } else {
            this.chartShow2 = false
          }
          this.chartDom2 = this.echarts.init(this.$refs.chart2)
          let indicatorData = res.data.Indicators
          let nameDatas = []
          let colorList = ['rgba(87,29,216,1)', 'rgba(0,165,220,1)']
          let color1 = [
            { offset1: '#904AFD', offset2: '#571DD8', lineColor: 'rgba(100,70,200,1)' },
            { offset1: '#5CE8FF', offset2: '#00A5DC', lineColor: 'rgba(0,222,255,1)' }
          ]

          let seriesArr = []
          res.data.Datas.map((item, i) => {
            item.value = item.data
            nameDatas.push(item.name)
            let obj = {
              name: res.data.Datas[i].name,
              type: 'radar',
              symbol: 'none',
              symbolSize: 10,
              areaStyle: {
                normal: {
                  color: colorList[i]
                }
              },
              itemStyle: {
                color: colorList[i],
                borderColor: colorList[i],
                borderWidth: 10
              },
              lineStyle: {
                normal: {
                  type: 'dashed',
                  color: colorList[i],
                  width: 2
                }
              },
              data: [
                {
                  value: res.data.Datas[i].value,
                  name: res.data.Datas[i].name,
                  areaStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          { offset: 0, color: color1[i].offset1 },
                          { offset: 1, color: color1[i].offset2 }
                        ]
                      ),
                      opacity: 0.5
                    }
                  },
                  lineStyle: {
                    color: color1[i].lineColor // 雷达构成的区域边框
                  }
                }
              ]
            }
            seriesArr.push(obj)
          })

          // let
          const option = {
            color: ['rgba(87,29,216,1)', 'rgba(0,222,255,1)'],
            tooltip: {
              show: true,
              trigger: 'item',
              position: [20, 0]
            },
            legend: {
              show: true,
              icon: 'circle',
              left: '10%',
              top: '0%',
              orient: 'horizontal',
              textStyle: {
                fontSize: 14,
                color: '#fff'
              },
              data: nameDatas
            },
            radar: {
              center: ['50%', '50%'],
              radius: '70%',
              startAngle: 90,
              splitNumber: 4,
              shape: 'polygon',
              splitArea: {
                areaStyle: {
                  color: ['transparent']
                }
              },
              axisLabel: {
                show: false,
                fontSize: 18,
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal'
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'white' //
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'white' //
                }
              },
              indicator: indicatorData,
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
                    // strlength = params.length
                    // params = params.substring(0, strlength - 1)
                  }
                  return params
                },
                textStyle: {
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.85)' // 文字颜色
                }
              }

            },
            series: seriesArr
          }
          this.chartDom2.setOption(option, true)
        }
      },
      async chart3 () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/EvaluateStatisticForChart/GetDisciplineIndexEvaScoreDetailInfo?DisciplineID=${this.DisciplineID}`)
        console.log(res)
        if (res.success) {
          if (res.data.InsidePieData === null || res.data.OutSidePieData === null) {
            this.chartShow3 = true
            return false
          } else {
            this.chartShow3 = false
          }
          const dom = this.$refs.chart3
          this.chartDom3 = this.echarts.init(dom)
          let InsidePieData = res.data.InsidePieData
          // let InsidePieData = [
          //   {
          //     value: 234,
          //     name: '二级指标名称',
          //     type: ''
          //   },
          //   {
          //     value: 234,
          //     name: 'asgf',
          //     type: ''
          //   }
          // ]
          // let OutSidePieData = [
          //   {
          //     value: 234,
          //     name: '二级指标名称',
          //     type: '三级指标名称'
          //   },
          //   {
          //     value: 234,
          //     name: '二级指标名称',
          //     type: '三级指标名称'
          //   }
          // ]
          let OutSidePieData = res.data.OutSidePieData

          var colorList = ['#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac']
          const option = {
            tooltip: {
              formatter: function (param) {
                if (param.data.type === null || param.data.type === '') {
                  return param.data.name + ':' + param.value + '个'
                } else {
                  return param.data.type + ':' + param.value + '个'
                }
              }
            },
            series: [
              {
                name: '二级指标',
                type: 'pie',
                radius: [0, '30%'],
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
                data: InsidePieData
              },
              {
                name: '三级指标',
                type: 'pie',
                radius: ['40%', '55%'],
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
                      if (params.value !== 0) { return params.value + '个' } else { return '' }
                    },
                    show: false
                  }
                },
                data: OutSidePieData
              }
            ]
          }
          this.chartDom3.setOption(option, true)
        }
      },
      // 小组得分详情
      async chart4 () {
        const dom = this.$refs.chart4
        this.chartDom4 = this.echarts.init(dom)
        let params = {
          DisciplineID: this.DisciplineID,
          BeginDate: this.dateArrChart4[0],
          EndDate: this.dateArrChart4[1]
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/EvaluateStatisticForChart/GetGroupScoreAmountPerDayStatisticInfo`, params)
        if (res.success) {
          let arr = []
          let name = []
          let colorlist = [
            {
              offset: 'rgba(13,64,253,1)',
              offset1: 'rgba(87,125,255,0)',
              color: 'rgba(0,165,220,1)'
            },
            {
              offset: 'rgba(0,165,220,0.9)',
              offset1: 'rgba(80,223,250,0)',
              color: 'rgba(247,123,102,0.9)'
            }
          ]
          res.data.yAxisData.map((item, i) => {
            name.push(res.data.yAxisData[i].name)
            let obj = {
              name: res.data.yAxisData[i].name,
              type: 'line',
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      { offset: 0, color: colorlist[i].offset },
                      { offset: 1, color: colorlist[i].offset1 }
                    ]
                  ),
                  opacity: 0.4
                }
              },
              data: res.data.yAxisData[i].data,
              lineStyle: {
                normal: {
                  color: colorlist[i].color // 折线颜色
                }
              }
            }
            arr.push(obj)
          })
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
              data: name,
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
            dataZoom: [],
            xAxis: {
              type: 'category', // 类目
              data: res.data.xAxisData,
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
              max: 100,
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
            series: arr
            // series: [
            //   {
            //     name: res.data.yAxisData[0].name,
            //     type: 'line',
            //     areaStyle: {
            //       normal: {
            //         color: new echarts.graphic.LinearGradient(
            //           0, 0, 0, 1,
            //           [
            //             { offset: 0, color: '#00A5DC' },
            //             { offset: 1, color: '#50DFFA' }
            //           ]
            //         ),
            //         opacity: 0.4
            //       }
            //     },
            //     data: res.data.yAxisData[0].data,
            //     lineStyle: {
            //       normal: {
            //         color: 'rgba(0,165,220,1)' // 折线颜色蓝色
            //       }
            //     }
            //   }
            // ]
          }
          if (res.data.xAxisData.length > 7) {
            option.dataZoom.push(
              {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                left: '9%',
                right: '9%',
                bottom: -0,
                start: 0,
                height: 15,
                end: 50 // 初始化滚动条
              }
            )
          } else {
            option.dataZoom.splice(0, 1)
          }
          this.chartDom4.setOption(option, true)
        }
      },
      // 每日得分详情
      async chart5 () {
        const dom = this.$refs.chart5
        this.chartDom5 = this.echarts.init(dom)
        let params = {
          DisciplineID: this.DisciplineID,
          BeginDate: this.dateArrChart5[0],
          EndDate: this.dateArrChart5[1]
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/EvaluateStatisticForChart/GetScoreAmountPerDayOfStuStatisticInfo`, params)
        if (res.success) {
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
            color: ['rgba(252,188,111,1)'],
            legend: { // 图例
              left: '1%',
              data: ['学生情况'],
              icon: 'squareRatio', // 图标：空心圆样式，
              itemWidth: 9, // 图例标记的图形宽度。[ default: 25 ]
              itemHeight: 8, // 图例标记的图形高度。[ default: 14 ]
              itemGap: 30, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
              textStyle: {
                color: '#8c8c8c' // 图例文字颜色
              }
            },
            grid: {
              x: 35,
              y: 50,
              x2: 0,
              y2: 26
            },
            dataZoom: [],
            xAxis: {
              type: 'category', // 类目
              data: res.data.xAxisData,
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
              max: 100,
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
                name: res.data.yAxisData[0].name,
                type: 'line',
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        { offset: 0, color: 'rgba(247,123,102,0.9)' },
                        { offset: 1, color: 'rgba(254,218,116,0)' }
                      ]
                    ),
                    opacity: 0.4
                  }
                },
                data: res.data.yAxisData[0].data,
                lineStyle: {
                  normal: {
                    color: 'rgba(247,123,102,0.9)' // 折线颜色
                  }
                }
              }
            ]
          }
          console.log(this.dateArrChart5[1] - this.dateArrChart5[0])
          if (res.data.xAxisData.length > 7) {
            option.dataZoom.push(
              {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                left: '9%',
                right: '9%',
                bottom: -0,
                start: 0,
                height: 15,
                end: 50 // 初始化滚动条
              }
            )
          } else {
            option.dataZoom.splice(0, 1)
          }
          this.chartDom5.setOption(option, true)
        }
      },
      async chart6 () {
        if (!this.xy.moment(this.beginMonth).isBefore(this.endMonth)) {
          this.xy.msgError('开始月份不能大于结束月份')
          return false
        }
        let params = {
          DisciplineID: this.DisciplineID,
          BeginDate: this.beginMonth,
          EndDate: this.endMonth
          // BeginDate: '2020-12-01',
          // EndDate: '2020-12-30'
        }

        let res = await this.xy.get(`${this.$store.state.apiPath}/api/EvaluateStatisticForChart/GetScoreAmountPerMonthOfStuStatisticInfo`, params)
        if (res.success) {
          const dom = this.$refs.chart6
          this.chartDom6 = this.echarts.init(dom)
          var yData1 = res.data.yAxisData[0].data
          var yData2 = res.data.yAxisData[1] ? res.data.yAxisData[1].data : []
          // var yData2 = [5, 40, 40, 20, 65, 40, 40]
          var name1 = res.data.yAxisData[0].name
          var name2 = res.data.yAxisData[1] ? res.data.yAxisData[1].name : ''
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
            dataZoom: [],
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
              data: res.data.xAxisData,
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
              max: '100',
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
          if (res.data.xAxisData.length > 7) {
            option.dataZoom.push(
              {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                left: '9%',
                right: '9%',
                bottom: -0,
                start: 0,
                height: 15,
                end: 50 // 初始化滚动条
              }
            )
          } else {
            option.dataZoom.splice(0, 1)
          }
          this.chartDom6.setOption(option, true)
        }
      }
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => {
        this.chartDom1.resize()
        this.chartDom2.resize()
        this.chartDom3.resize()
        this.chartDom4.resize()
        this.chartDom5.resize()
        this.chartDom6.resize()
      })
    }
  }
</script>
<style lang='less' scoped>
.planet {
  width: 100%;
  // height: 100%;
  background: url("./imgs/planetBg.png") no-repeat -1px -1px;
 //background-size: calc(100vw + 2px) calc(100vh + 2px);
 background-size:cover;
  padding-top: 20px;
  overflow: hidden;
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
    padding: 42px 20px 25px 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .border-box {
      width: 100%;
      height: 442px;
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
      .mychart {
        height: 345px;
      }
      .m-t{
        margin-top:36px
      }
    }
  }
}
/deep/ .ivu-input{
  border:none;
  background: #031746;
}
/deep/ .ivu-input:focus{
  border: none;
  outline: 0;
  -webkit-box-shadow:none;
}
/deep/ .ivu-select-single .ivu-select-selection{
  background: #030c31;
  border: none;
  color: rgba(255,255,255,0.65);

}
.dateContnet{
  text-align:right;
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
