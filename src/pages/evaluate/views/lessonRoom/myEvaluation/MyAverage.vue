
<template>
  <div class="my-first-model">
    <div class="xy-content-body">
        <div class="container">
           <div v-if="lineChartData.length===0" class="no-data-box" :class="lineChartData.length!==0?'myself-nodata':''">
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
                </Spin>
                <template v-else>
                  <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                  <span class="no-data-text">该搜索条件下没有结果。</span>
                </template> -->
              </div>
              <div v-else>
                <div ref="ring" style="width:100%;height:550px;padding:10px;border-right: 0.5px dashed rgb(217, 217, 217);"></div>
              </div>
            </div>
            <div style="flex:1">
              <div v-if="lineMoreData.length===0" class="no-data-box myself-nodata">
                <!-- <Spin fix v-if="spinShow2">
                  <div>加载中...</div>
                </Spin>
                <template v-else>
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
                </Spin>
                <template v-else>
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
                </Spin>
                <template v-else>
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
                </Spin>
                <template v-else>
                  <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                  <span class="no-data-text">该搜索条件下没有结果。</span>
                </template> -->
            </div>
             <Table v-else style="margin: 0 auto;overflow:auto;" :columns="columns" :data="tbData" border :span-method="handleSpan"></Table>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    props: {
      objData: {
        type: Object
      }
    },
    name: 'AvgDesc',
    data () {
      return {
        spinShow: false,
        spinShow1: false,
        spinShow2: false,
        spinShow3: false,
        spinShow4: false,
        spinShow5: false,
        radar: {},
        radarData: [],
        subjectStatistics: [],
        lineChartData: [],
        lineChart: {},
        ring: {},
        ringData: [],
        lineMore: {},
        lineMoreData: [],
        bindingObj: {},
        disciplineID: '', // 学科
        academicSessionID: '',
        AcademicYearID: '',
        SchoolDistrictID: '',
        StudentGradeForStudentYearID: '',
        starTime: '',
        endTime: '',
        subjectData: [],
        checkArr: {},
        echartsData: {},
        columns: [],
        tbData: [],
        windowWidth: ''
      }
    },
    created () {
      // this.windowWidth = $(window).width()
      // this.getLineData()// 每日得分折线图
      // this.getRingData()// 环形图
      // this.getlineMoreData()// 多折线
      // this.getpieData()// 饼图(二级指标)
      // this.getradarData()// 雷达(三级指标)
    },
    mounted () {
      window.addEventListener('resize', () => {
        // this.lineChart.resize()
        // this.ring.resize()
        // this.lineMore.resize()
        // this.radar.resize()
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
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => {
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
        this.xy.post(`${this.$store.state.apiPath}/api/MyEvaluationStatistics/GetOneStudentEvaluationStatisticsDay`, {
          AcademicYearID: this.$parent.formValidateOK.session[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.session[1],
          DisciplineID: this.$parent.formValidateOK.disciplineID,
          CoursePlan: this.$parent.formValidateOK.checkArr,
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
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
                this.lineChart.setOption(option, true)
              })
            } else {
              if (this.lineChart._dom !== undefined) {
                this.lineChart.clear()
              }
            }
          }
        })
      },
      getRingData () {
        this.spinShow1 = true
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/MyEvaluationStatistics/GetOneStudentEvaluationStatisticsPie`, {
          AcademicYearID: this.$parent.formValidateOK.session[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.session[1],
          DisciplineID: this.$parent.formValidateOK.disciplineID,
          CoursePlan: this.$parent.formValidateOK.checkArr,
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
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
                this.ring.setOption(option, true)
              })
            } else {
              if (this.ring._dom !== undefined) {
                this.ring.clear()
              }
            }
          }
        })
      },
      getlineMoreData () {
        this.spinShow2 = true
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/MyEvaluationStatistics/GetOneStudentEvaluationStatisticsLine`, {
          AcademicYearID: this.$parent.formValidateOK.session[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.session[1],
          DisciplineID: this.$parent.formValidateOK.disciplineID,
          CoursePlan: this.$parent.formValidateOK.checkArr,
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
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
              if (this.lineMore._dom !== undefined) {
                this.lineMore.clear()
              }
            }
          }
        })
      },
      getpieData () {
        this.spinShow3 = true
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/MyEvaluationStatistics/GetTwoStudentEvaluationStatistics`, {
          AcademicYearID: this.$parent.formValidateOK.session[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.session[1],
          DisciplineID: this.$parent.formValidateOK.disciplineID,
          CoursePlan: this.$parent.formValidateOK.checkArr,
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
        }).then(res => {
          this.spinShow3 = false
          this.xy.unloading()
          if (res.success) {
            this.subjectStatistics = res.data
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
        echart.setOption(option, true)
      },
      getradarData () {
        this.spinShow4 = true
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/MyEvaluationStatistics/GetThreeStudentEvaluationStatistics`, {
          AcademicYearID: this.$parent.formValidateOK.session[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.session[1],
          DisciplineID: this.$parent.formValidateOK.disciplineID,
          CoursePlan: this.$parent.formValidateOK.checkArr,
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
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
                    barWidth: 10,
                    barGap: '-100%',
                    barCategoryGap: '40%',
                    animation: false
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
                this.radar.setOption(option, true)
              })
            } else {
              if (this.radar._dom !== undefined) {
                this.radar.clear()
              }
            }
          }
        })
      },
      // 获取总表
      async getAll (data) {
        this.spinShow5 = true
        this.xy.loading()
        const params = {
          AcademicYearID: this.$parent.formValidateOK.session[0],
          SchoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          StudentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          AcademicSessionID: this.$parent.formValidateOK.session[1],
          DisciplineID: this.$parent.formValidateOK.disciplineID,
          CoursePlan: this.$parent.formValidateOK.checkArr,
          StarTime: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          EndTime: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MyEvaluationStatistics/GetMyEvaIndexScoreDetailList`, params)
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
      // 明细
      MyDetails () {
        this.$parent.currentComponent = 'MyDetails'
      }
    }
  }
</script>
<style lang="less" scoped>
.demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
      height: 100px;
      position: relative;
      border: 1px solid #eee;
  }
  .my-first-model {
    .myself-nodata{
      padding-top: 20px;
      margin: 0 auto;
      height: 240px;
      .no-data-text{
        margin-top: 10px;
      }
    }
    //  padding: 20px;
    //  padding-bottom: 50px;
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
  .xy-content-title {
    border-radius: 4px 4px 0 0;
    border: 1px solid #d9d9d9;
    padding: 20px;
    display: flex;
    align-items: center;
    > p {
      text-align: right;
      margin-right: 12px;
      width: 94px;
    }
  }
    .xy-content-body {
      padding:0;
      border-radius: 0 0 4px 4px;
      border: 1px solid #d9d9d9;
      border-top: none;
      padding-bottom:20px;
    }
  }
</style>
