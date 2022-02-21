
<template>
  <div class="average-student"  style="background:#fff;">
      <div class="xy-content-body">
        <div v-if="lineChartData.length===0" class="no-data-box"  :class="lineChartData.length!==0?'myself-nodata':''">
          <Spin fix v-if="spinShow">
            <div>加载中...</div>
          </Spin>
          <template v-else>
            <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
            <span class="no-data-text">该搜索条件下没有结果。</span>
          </template>
        </div>
        <div v-else>
          <div ref="lineChart" style="width:100%;height:550px;padding:20px;"></div>
        </div>
        <div class="xy-flex" :class="ringData.length!==0?'border-style':''">
          <div :style="{'width':windowWidth<1367 ? '33.3%':'25%'}">
            <div v-if="ringData.length===0" class="no-data-box myself-nodata">
                 <!-- <Spin fix v-if="spinShow1">
                  <div>加载中...</div>
                </Spin> -->
                <!-- <template v-else>
                  <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                  <span class="no-data-text">该搜索条件下没有结果。</span>
                </template> -->
            </div>
            <div v-else>
              <div ref="ring" style="flex:1;width:100%;height:550px;padding:10px;border-right: 0.5px dashed rgb(217, 217, 217);"></div>
            </div>
          </div>
          <div style="flex:1">
            <div v-if="lineMoreData.length===0" class="no-data-box myself-nodata">
                 <!-- <Spin fix v-if="spinShow2">
                  <div>加载中...</div>
                </Spin> -->
                <!-- <template v-else>
                  <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                  <span class="no-data-text">该搜索条件下没有结果。</span>
                </template> -->
            </div>
            <div v-else>
             <div ref="lineMore" style="width:100%;height:550px;padding:20px;"></div>
            </div>
          </div>
        </div>
        <div class="xy-flex" :class="subjectStatistics.length!==0?'pies':''">
          <div v-if="subjectStatistics.length===0" class="no-data-box myself-nodata">
            <!-- <Spin fix v-if="spinShow3">
              <div>加载中...</div>
            </Spin> -->
            <!-- <template v-else>
              <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
              <span class="no-data-text">该搜索条件下没有结果。</span>
            </template> -->
          </div>
          <template v-else v-for="(item, index) in subjectStatistics" >
            <template v-if="subjectStatistics.length>=3">
              <div
                :key="index"
                :id="'pie' + index"
                :style="[{'border-right':setBorder(index)},
                {'width':windowWidth<1367 ? '33.3%':'25%'}]"
                style="height:450px;padding:20px;"
                >
              </div>
            </template>
            <template v-if="subjectStatistics.length<3" style="display:flex;">
              <div
                :key="index"
                :id="'pie' + index"
                style="flex:1;height:450px;padding:20px;"
                >
              </div>
            </template>
          </template>
        </div>
        <div class="xy-flex" :class="radarData.length!==0?'pies':''">
           <div style="flex:1">
            <div v-if="radarData.length===0" class="no-data-box myself-nodata">
                <!-- <Spin fix v-if="spinShow4">
                  <div>加载中...</div>
                </Spin> -->
                <!-- <template v-else>
                  <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                  <span class="no-data-text">该搜索条件下没有结果。</span>
                </template> -->
            </div>
            <div v-else>
              <div ref="radar" style="width:100%;height:600px;padding:20px;"></div>
            </div>
           </div>
        </div>
        <div class="xy-flex" style="padding:20px 0">
          <div v-if="tbData.length===0" class="no-data-box myself-nodata">
             <!-- <Spin fix v-if="spinShow5">
                <div>加载中...</div>
              </Spin> -->
              <!-- <template v-else>
                <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                <span class="no-data-text">该搜索条件下没有结果。</span>
              </template> -->
          </div>
          <Table v-else style="margin: 0 auto;overflow:auto;" :columns="columns" :data="tbData" border :span-method="handleSpan"></Table>
        </div>
      </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    name: 'AverageStudent',
    data () {
      return {
        spinShow: false,
        spinShow1: false,
        spinShow2: false,
        spinShow3: false,
        spinShow4: false,
        spinShow5: false,
        columns: [],
        tbData: [],
        radar: {},
        radarData: [],
        subjectStatistics: [],
        lineChartData: [],
        ringData: [],
        lineMoreData: [],
        lineChart: {},
        ring: {},
        lineMore: {},
        pie: {},
        pie1: {},
        pie2: {},
        noData: false,
        myChart: {},
        myChart1: {},
        myChart2: {},
        oneData: [],
        twoData: [],
        threeData: [],
        passData: {},
        leftTableData: [],
        columns14: [],
        data5: [],
        rules: [],
        windowWidth: ''
      }
    },
    created () {
      this.windowWidth = $(window).width()
      this.passData = this.$store.state.evaluate.averageObj.passData
      // this.loadTable()
      // this.getData()
      this.getLineData()// 每日得分折线图
      this.getRingData()// 环形图
      this.getlineMoreData()// 多折线
      this.getpieData()// 饼图(二级指标)
      this.getradarData()// 雷达(三级指标)
      this.getAll()// 图表
    },
    mounted () {
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          if (this.lineChartData.length !== 0) {
            this.lineChart.resize()
          }
          if (this.ringData.length !== 0) {
            this.ring.resize()
          }
          if (this.lineMoreData.length !== 0) {
            this.lineMore.resize()
          }
          if (this.radarData.length !== 0) {
            this.radar.resize()
          }
          // 多个二级饼图
          this.windowWidth = $(window).width()
          if (this.subjectStatistics.length !== 0) {
            this.subjectStatistics.forEach((item, index) => {
              this.echarts.init(document.getElementById('pie' + index)).resize()
            })
          }
        }, false)
      })
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => {
        this.lineChart.resize()
        this.ring.resize()
        this.lineMore.resize()
        this.radar.resize()
        if (this.subjectStatistics.length !== 0) {
          this.subjectStatistics.forEach((item, index) => {
            this.echarts.init(document.getElementById('pie' + index)).resize()
          })
        }
      }, false)
    },
    methods: {
      setBorder (index) {
        if (this.windowWidth < 1367) {
          if ((index + 1) % 3 !== 0) {
            return '0.5px dashed rgb(217, 217, 217)'
          }
        } else {
          if ((index + 1) % 4 !== 0) {
            return '0.5px dashed rgb(217, 217, 217)'
          }
        }
      },
      // 每日得分折线图
      getLineData () {
        this.spinShow = true
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/StudentEvaluationStatistics/GetOneStudentEvaluationStatisticsDay`, {
          AcademicYearID: this.$parent.formValidateOK.yearSemester[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.yearSemester[1],
          DisciplineID: this.passData.DisciplineID,
          CoursePlan: {
            CoursePlanAID: this.passData.CoursePlanAID,
            CoursePlanAIDType: this.passData.CoursePlanAIDType
          },
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD'),
          UserID: this.passData.StudentID
        }).then(res => {
          this.spinShow = false
          this.xy.unloading()
          if (res.success) {
            this.lineChartData = res.data
            if (res.data.length) {
              let xData = []; let yData = []
              res.data.forEach(item => {
                xData.push(item.ObjectName)
                yData.push(item.ObjectScore)
              })
              let option = {
                title: {
                  text: '每日得分'
                },
                tooltip: {
                  trigger: 'axis'
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '10%',
                  containLabel: false
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(0,0,0,0.65)' // 左边线的颜色
                    }
                  },
                  data: xData
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
                series: [
                  {
                    type: 'line',
                    stack: '总量',
                    areaStyle: {
                      normal: {
                        color: new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0, color: '#2FC25B' // 0% 处的颜色
                        }, {
                          offset: 0.4, color: '#2FC25B' // 100% 处的颜色
                        }, {
                          offset: 1, color: '#fff' // 100% 处的颜色
                        }]
                        )// 改变区域颜色
                      }
                    },
                    itemStyle: {
                      normal: {
                        color: '#2FC25B', // 改变折线点的颜色
                        lineStyle: {
                          color: '#2FC25B' // 改变折线颜色
                        }
                      }
                    },
                    data: yData
                  }
                ]
              }
              this.$nextTick(() => {
                this.lineChart = this.echarts.init(this.$refs.lineChart)
                this.lineChart.setOption(option)
              })
            } else {
              this.lineChart.clear()
            }
          }
        })
      },
      getRingData () {
        this.spinShow1 = true
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/StudentEvaluationStatistics/GetOneStudentEvaluationStatisticsPie`, {
          AcademicYearID: this.$parent.formValidateOK.yearSemester[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.yearSemester[1],
          DisciplineID: this.passData.DisciplineID,
          CoursePlan: {
            CoursePlanAID: this.passData.CoursePlanAID,
            CoursePlanAIDType: this.passData.CoursePlanAIDType
          },
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD'),
          UserID: this.passData.StudentID
        }).then(res => {
          this.spinShow1 = false
          this.xy.unloading()
          if (res.success) {
            this.ringData = res.data
            if (res.data.length) {
              let allData = []; let num = 0
              res.data.forEach(item => {
                num += item.ObjectScore
                allData.push({
                  name: item.ObjectName,
                  value: item.ObjectScore
                })
              })
              let option = {
                title: {
                  text: '指标分析'
                },
                tooltip: {
                  trigger: 'item',
                  formatter: '{b}: {c} ({d}%)'
                },
                graphic: [{ // 环形图中间添加文字
                  type: 'text', // 通过不同top值可以设置上下显示
                  left: 'center',
                  top: '48%',
                  style: {
                    text: num.toFixed(2) + '\n' + '总得分',
                    textAlign: 'center',
                    fill: '#000', // 文字的颜色
                    width: 30,
                    height: 30,
                    fontSize: 14
                  }
                }],
                series: [
                  {
                    type: 'pie',
                    radius: ['30%', '50%'],
                    data: allData
                  }
                ]
              }
              this.$nextTick(() => {
                this.ring = this.echarts.init(this.$refs.ring)
                this.ring.setOption(option)
              })
            } else {
              this.ring.clear()
            }
          }
        })
      },
      getlineMoreData () {
        this.spinShow2 = true
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/StudentEvaluationStatistics/GetOneStudentEvaluationStatisticsLine`, {
          AcademicYearID: this.$parent.formValidateOK.yearSemester[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.yearSemester[1],
          DisciplineID: this.passData.DisciplineID,
          CoursePlan: {
            CoursePlanAID: this.passData.CoursePlanAID,
            CoursePlanAIDType: this.passData.CoursePlanAIDType
          },
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD'),
          UserID: this.passData.StudentID
        }).then(res => {
          this.spinShow2 = false
          this.xy.unloading()
          if (res.success) {
            this.lineMoreData = res.data
            if (res.data.length) {
              let beforeYdata = []; let xData = []; let yData = []
              res.data.forEach(item => {
                xData.push(item.ObjectName) // 添加数据
                item.Datas.forEach(item1 => {
                  beforeYdata.push({
                    name: item1.ObjectName,
                    data: item1.ObjectScore
                  })
                })
              })
              const s = new Set() // 实例化对象
              beforeYdata.forEach(item => s.add(item.name))
              let newData = Array.from({ length: s.size }, () => []) // 创建指定长度数组并添值
              let newProject = [...s]
              newProject.forEach((item, index) => {
                res.data.forEach(item1 => {
                  let objectScore = 0
                  item1.Datas.forEach(item2 => {
                    if (item2.ObjectName === item) {
                      objectScore = item2.ObjectScore
                    }
                  })
                  newData[index].push(objectScore)
                })
              })
              newData.forEach((item, index) => {
                yData.push({
                  name: Array.from(s)[index],
                  type: 'line',
                  data: item
                })
              })
              let option = {
                title: {
                  text: '一级指标折线图'
                },
                tooltip: {
                  trigger: 'axis'
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  axisLine: {
                    lineStyle: {
                      color: 'rgba(0,0,0,0.65)' // 左边线的颜色
                    }
                  },
                  boundaryGap: false,
                  data: xData
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
                series: yData
              }
              this.$nextTick(() => {
                this.lineMore = this.echarts.init(this.$refs.lineMore)
                this.lineMore.setOption(option, true)
              })
            } else {
              this.lineMore.clear()
            }
          }
        })
      },
      getpieData () {
        this.spinShow3 = true
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/StudentEvaluationStatistics/GetTwoStudentEvaluationStatistics`, {
          AcademicYearID: this.$parent.formValidateOK.yearSemester[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.yearSemester[1],
          DisciplineID: this.passData.DisciplineID,
          CoursePlan: {
            CoursePlanAID: this.passData.CoursePlanAID,
            CoursePlanAIDType: this.passData.CoursePlanAIDType
          },
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD'),
          UserID: this.passData.StudentID
        }).then(res => {
          this.spinShow3 = false
          this.xy.unloading()
          if (res.success) {
            this.subjectStatistics = res.data
            if (res.data.length) {
              this.subjectStatistics = res.data.map((item, index) => {
                const pie = {}
                pie.data = item.Datas.map(item1 => {
                  return {
                    value: item1.ObjectScore,
                    name: item1.ObjectName
                  }
                })
                pie.ObjectName = item.ObjectName
                return {
                  pie: pie
                }
              })
              const that = this
              this.$nextTick(function () {
                that.subjectStatistics.forEach((s, index) => {
                  document.getElementById('pie' + index) && that.setEchartPie(s.pie, that.echarts.init(document.getElementById('pie' + index)))
                  that.echarts.init(document.getElementById('pie' + index)).resize()
                })
              })
            }
          }
        })
      },
      // 多个二级饼图
      setEchartPie (pie, echart) {
        let option = {
          title: {
            text: pie.ObjectName
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              type: 'pie',
              radius: '50%',
              data: pie.data
            }
          ]
        }
        echart.setOption(option)
      },
      getradarData () {
        this.spinShow4 = true
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/StudentEvaluationStatistics/GetThreeStudentEvaluationStatistics`, {
          AcademicYearID: this.$parent.formValidateOK.yearSemester[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.yearSemester[1],
          DisciplineID: this.passData.DisciplineID,
          CoursePlan: {
            CoursePlanAID: this.passData.CoursePlanAID,
            CoursePlanAIDType: this.passData.CoursePlanAIDType
          },
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD'),
          UserID: this.passData.StudentID
        }).then(res => {
          this.spinShow4 = false
          this.xy.unloading()
          if (res.success) {
            this.radarData = res.data
            if (res.data.length) {
              let xData = []; let yData = []
              res.data.forEach(item => {
                xData.push(item.ObjectName)
                yData.push(item.ObjectScore)
              })
              var data = yData
              let option = {
                title: {
                  text: '三级指标柱状图'
                },
                dataZoom: [{
                  type: 'slider',
                  show: true,
                  xAxisIndex: [0],
                  left: '9%',
                  right: '9%',
                  bottom: -8,
                  start: 10,
                  height: 25,
                  end: 90 // 初始化滚动条
                }],
                legend: {
                  data: xData,
                  right: 10
                },
                color: ['#3398DB'],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
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
                xAxis: [
                  {
                    type: 'category',
                    data: xData,
                    axisTick: {
                      alignWithLabel: true
                    },
                    axisLine: {
                      lineStyle: {
                        color: 'rgba(0,0,0,0.65)' // 左边线的颜色
                      }
                    }
                  }
                ],
                series: [
                  {
                    type: 'bar',
                    itemStyle: {
                      color: 'rgba(0,0,0,0.05)'
                    },
                    barGap: '-100%',
                    barCategoryGap: '40%',
                    animation: false,
                    barWidth: 10
                  },
                  {
                    type: 'bar',
                    itemStyle: {
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          { offset: 0, color: '#83bff6' },
                          { offset: 0.5, color: '#188df0' },
                          { offset: 1, color: '#188df0' }
                        ]
                      )
                    },
                    emphasis: {
                      itemStyle: {
                        color: new echarts.graphic.LinearGradient(
                          0, 0, 0, 1,
                          [
                            { offset: 0, color: '#2378f7' },
                            { offset: 0.7, color: '#2378f7' },
                            { offset: 1, color: '#83bff6' }
                          ]
                        )
                      }
                    },
                    data: data
                  }
                ]
              }
              this.$nextTick(() => {
                this.radar = this.echarts.init(this.$refs.radar)
                this.radar.setOption(option)
              })
            } else {
              this.radar.clear()
            }
          }
        })
      },
      // 获取总表
      async getAll (data) {
        this.spinShow5 = true
        this.xy.loading()
        const params = {
          AcademicYearID: this.$parent.formValidateOK.yearSemester[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.yearSemester[1],
          DisciplineID: this.passData.DisciplineID,
          CoursePlan: {
            CoursePlanAID: this.passData.CoursePlanAID,
            CoursePlanAIDType: this.passData.CoursePlanAIDType
          },
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD'),
          UserID: this.passData.StudentID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StudentEvaluationStatistics/GetMyEvaIndexScoreDetailList`, params)
        this.spinShow5 = false
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
      async loadTable () {
        this.xy.loading()
        const params = {
          AcademicYearID: this.passData.AcademicYearID,
          AcademicSessionID: this.passData.academicSessionID,
          SchoolDistrictID: this.passData.schoolDistrictID,
          StudentGradeForStudentYearID: this.passData.studentGradeForStudentYearID,
          DisciplineID: this.passData.DisciplineID,
          CoursePlanAID: this.passData.CoursePlanAID,
          StartDate: this.passData.starTime,
          EndDate: this.passData.endTime,
          StudentID: this.passData.StudentID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/IndexContrast/GetStudentCoursePlanLevelIndexScoreList`, params)
        if (res.success) {
          this.columns14 = res.data.Columns
          this.data5 = res.data.Datas
          this.rules = res.data.Rules
        }
        this.xy.unloading()
      },
      // 获取班级的一级指标数据
      async getData () {
        this.xy.loading()
        const params = {
          AcademicYearID: this.passData.AcademicYearID,
          AcademicSessionID: this.passData.academicSessionID,
          SchoolDistrictID: this.passData.schoolDistrictID,
          StudentGradeForStudentYearID: this.passData.studentGradeForStudentYearID,
          DisciplineID: this.passData.DisciplineID,
          CoursePlanAID: this.passData.CoursePlanAID,
          StartDate: this.passData.starTime,
          EndDate: this.passData.endTime,
          StudentID: this.passData.StudentID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/IndexContrast/GetStudentCoursePlanOneLevelIndexScoreData`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length) {
            this.handleData(res.data, 'one')
            // 清空上一次得图表
            if (this.oneData.length !== 0) {
              this.myChart.clear()
            }
            if (this.twoData.length !== 0) {
              this.myChart1.clear()
            }
            if (this.threeData.length !== 0) {
              this.myChart2.clear()
            }
          } else {
            this.noData = true
          }
          this.oneData = res.data
        }
      },
      // 处理数据
      async handleData (data, indexData) {
        let xData = []; let yData = []
        data.forEach(item => {
          xData.push(item.IndexManagementName)
          yData.push(item.Score)
        })
        this.$nextTick(() => {
          this.echartsOneAndTwoAndTree(xData, yData, indexData)
        })
      },
      // 绘制图表数据
      echartsOneAndTwoAndTree (xData, yData, indexData) {
        let that = this
        this.option.xAxis.data = xData
        this.option.series[0].data = yData

        if (indexData === 'one') {
          this.myChart = this.echarts.init(this.$refs.echartGeography)
          this.option.title.text = '一级指标'
          this.myChart.setOption(this.option)
          that.myChart.on('click', function (params) {
            let obj = {}
            obj = that.oneData.find(item => item.IndexManagementName === (params.name ? params.name : params.value))
            // 点击获取数据再绘制图表
            that.$nextTick(() => {
              if (that.twoData.length !== 0) {
                that.myChart1.clear()
              }
              if (that.threeData.length !== 0) {
                that.myChart2.clear()
              }
              that.getEchartsData('two', obj.IndexManagementID)
              that.$refs.echartGeography1.scrollIntoView({ block: 'start', behavior: 'smooth' })
            })
          })
        } else if (indexData === 'two') {
          this.myChart1 = this.echarts.init(this.$refs.echartGeography1)
          this.option.title.text = '二级指标'
          this.myChart1.setOption(this.option)
          that.myChart1.on('click', function (params) {
            that.$nextTick(() => {
              let obj = {}
              obj = that.twoData.find(item => item.IndexManagementName === (params.name ? params.name : params.value))
              that.getEchartsData('tree', obj.IndexManagementID)
              that.$refs.echartGeography2.scrollIntoView({ block: 'start', behavior: 'smooth' })
            })
          })
        } else {
          this.myChart2 = this.echarts.init(this.$refs.echartGeography2)
          this.option.title.text = '三级指标'
          this.myChart2.setOption(this.option)
        }
      },
      // 获取二，三级指标数据
      async getEchartsData (data, IndexManagementID) {
        if (data === 'two') {
          this.echartsUrl = `${this.$store.state.apiPath}/api/IndexContrast/GetStudentCoursePlanTwoLevelIndexScoreData`
        } else {
          this.echartsUrl = `${this.$store.state.apiPath}/api/IndexContrast/GetStudentCoursePlanThreeLevelIndexScoreData`
        }
        this.xy.loading()
        const params = {
          IndexManagementID: IndexManagementID,
          AcademicYearID: this.passData.AcademicYearID,
          AcademicSessionID: this.passData.academicSessionID,
          SchoolDistrictID: this.passData.schoolDistrictID,
          StudentGradeForStudentYearID: this.passData.studentGradeForStudentYearID,
          DisciplineID: this.passData.DisciplineID,
          CoursePlanAID: this.passData.CoursePlanAID,
          StartDate: this.passData.starTime,
          EndDate: this.passData.endTime,
          StudentID: this.passData.StudentID
        }
        let res = await this.xy.post(this.echartsUrl, params)
        this.xy.unloading()
        if (res.success) {
          if (data === 'two') {
            this.twoData = res.data
            if (this.twoData.length === 0) {
              this.noData = true
              this.$refs.echartGeography1.style.height = '0'
            } else {
              this.$refs.echartGeography1.style.height = '650px'
            }
          } else {
            this.threeData = res.data
            if (this.threeData.length === 0) {
              this.noData = true
              this.$refs.echartGeography2.style.height = '0'
            } else {
              this.$refs.echartGeography2.style.height = '650px'
            }
          }
          if (res.data.length) {
            this.handleData(res.data, data)
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.average-student{
  .xy-content-body{
    border: 1px solid #d9d9d9;
    border-radius:4px 4px;
    padding:0;
  }
  .myself-nodata{
    padding-top: 20px;
    margin: 0 auto;
    height: 240px;
    .no-data-text{
      margin-top: 10px;
    }
  }
  .border-style{
    border-top:0.5px solid rgb(217, 217, 217);
    border-bottom:0.5px solid rgb(217, 217, 217);
  }
  .pies{
      flex-wrap: wrap;
      border-bottom:0.5px solid rgb(217, 217, 217);
  }
  .line{
    background:rgb(217, 217, 217);
    height: 0.5px;
    width: 100%;
    display: inline-block;
  }
  // .container{
  //   // margin: 30px 50px;
  //   &>div{
  //     // border-bottom: 1px solid rgba(233,233,233,1);
  //     // margin-bottom:30px;
  //     // padding-bottom:30px;
  //   }
  // }
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
      /deep/tr{
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
        /deep/td{
          border-right: 1px solid #EBEEF5;
          border-bottom: 1px solid #EBEEF5;
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
          /deep/div{
            padding:5px 18px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            text-align: center;
          }
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
</style>
