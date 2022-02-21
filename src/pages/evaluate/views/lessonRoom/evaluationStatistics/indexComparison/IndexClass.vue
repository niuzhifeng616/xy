<template>
  <div class="index-class" style="background:#fff;">
      <div class="xy-content-body">
          <div class="echarts" style="padding:20px">
            <RadioGroup v-model="Exhibition" type="button" @on-change="change">
                <Radio label="echart">图表</Radio>
                <Radio label="table">列表</Radio>
            </RadioGroup>
          </div>
           <div v-if="Exhibition==='echart'">
             <div :class="lineChartData.length!==0?'pies':''">
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
             </div>
              <div v-if="classColumData.length===0" class="no-data-box myself-nodata">
                <Spin fix v-if="spinShow1">
                  <div>加载中...</div>
                </Spin>
                <!-- <template v-else>
                  <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                  <span class="no-data-text">该搜索条件下没有结果。</span>
                </template> -->
              </div>
              <div v-else>
                <div ref="classColum" style="width:100%;height:700px;padding:20px;"></div>
              </div>
              <div class="xy-flex"  :class="classColumData.length!==0?'border-style':''">
                <div :style="{'width':windowWidth<1367 ? '33.3%':'25%'}">
                  <div v-if="ringData.length===0" class="no-data-box myself-nodata">
                  </div>
                  <div v-else>
                    <div ref="ring" style="width:100%;height:550px;padding:10px;border-right: 0.5px dashed rgb(217, 217, 217);"></div>
                  </div>
                </div>
                <div style="flex:1">
                  <div v-if="lineMoreData.length===0" class="no-data-box myself-nodata">
                  </div>
                  <div  v-else>
                    <div ref="lineMore" style="width:100%;height:550px;padding:20px;"></div>
                  </div>
                </div>
              </div>
              <div class="xy-flex" style="flex-wrap: wrap;"  :class="subjectStatistics.length!==0?'pies':''">
                <div v-if="subjectStatistics.length===0" class="no-data-box myself-nodata">
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
              <div>
                <div v-if="radarData.length===0" class="no-data-box myself-nodata">
                </div>
                <div v-else>
                  <div ref="radar" style="width:100%;height:600px;padding:20px;"></div>
                </div>
              </div>
            </div>
            <div v-if="Exhibition==='table'">
              <div v-if="tbData===null||tbData.length===0" class="no-data-box">
                  <Spin fix v-if="spinShow6">
                    <div>加载中...</div>
                  </Spin>
                  <template v-else>
                    <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                    <span class="no-data-text">该搜索条件下没有结果。</span>
                  </template>
              </div>
              <div v-else>
               <table class="table-data">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>用户名</th>
                    <th>年级</th>
                    <th>班级</th>
                    <th v-for="(item,index) in IndexData" :key="index">
                      <p>{{item.IndexManagementName}}</p>
                      <p style="font-weight:500">{{item.Weight}}%</p>
                    </th>
                    <th>总得分</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody class="tBody">
                  <tr v-for="(item,index) in tbData" :key="index">
                    <td>
                      <span v-if="item.Icon&&item.Icon!==''" class="icons">
                        <img :src="item.Icon" class="icons-img" alt="">
                        <!-- <img :src="xyApi+'/base'+item.Icon" class="icons-img" alt=""> -->
                      </span>
                      <img v-else src="@/assets/common/yrykb.png" alt="" class="icons-img">
                      <span> {{item.FullName}}</span>
                    </td>
                    <td>{{item.UserName}}</td>
                    <td>{{item.GradeFullName}}</td>
                    <td>{{item.ClassName}}</td>
                    <td v-for="(item1,index1) in item.IndexList" :key="index1">
                      {{item1.Score!==null?item1.Score:"--"}}
                    </td>
                    <td>{{item.TotalScore}}</td>
                    <td v-if="isShow" style="color:#4196FF;cursor: pointer;" @click="toClass(item)">查看</td>
                    <td v-else style="color:#4196FF;cursor: pointer;"></td>
                  </tr>
                </tbody>
               </table>
                <Page
                  :total="tbTotal"
                  :page-size="pageSize"
                  :current="pageIndex"
                  :page-size-opts="pages"
                  show-sizer
                  show-total
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"
                  style="float: right;margin-top: 10px;"
                  >
                </Page>
              </div>
            </div>
      </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    name: 'IndexClass',
    data () {
      return {
        spinShow: false,
        spinShow1: false,
        spinShow2: false,
        spinShow3: false,
        spinShow4: false,
        spinShow5: false,
        spinShow6: false,
        isShow: true,
        subjectData: [],
        bindingObj: {},
        noData: false,
        myChart: {},
        myChart1: {},
        myChart2: {},
        lineChart: {},
        classColum: {},
        radar: {},
        classColumData: [],
        subjectStatistics: [],
        lineChartData: [],
        radarData: [],
        ringData: [],
        lineMoreData: [],
        ring: {},
        lineMore: {},
        pie: {},
        Exhibition: 'echart',
        tbData: [],
        IndexData: [],
        oneData: [],
        twoData: [],
        threeData: [],
        passData: {},
        allScore: [],
        tbTotal: 0,
        pageIndex: 1,
        pageSize: 15,
        pages: [15, 30, 50, 100],
        windowWidth: ''

      }
    },
    mounted () {
      this.$nextTick(() => {
        if (this.Exhibition === 'echart') {
          window.addEventListener('resize', () => {
            if (this.lineChartData.length !== 0) {
              this.lineChart.resize()
            }
            if (this.classColumData.length !== 0) {
              this.classColum.resize()
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
        }
      })
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => {
        this.lineChart.resize()
        this.classColum.resize()
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
    created () {
      this.passData = this.$store.state.evaluate.averageObj.passData
      this.getLineData()// 每日得分折线图
      this.getClassData()// 班级图表柱状图
      this.getRingData()// 环形图
      this.getlineMoreData()// 多折线
      this.getpieData()// 饼图(二级指标)
      this.getradarData()// 柱状图(三级指标)
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
      // 改变当前页显示的数量
      changePageSize (size) {
        if (this.pageSize !== size) {
          this.pageSize = size
          this.getTableData()
        }
      },
      // 改变当前页
      changePage (index) {
        if (this.pageIndex !== index) {
          this.pageIndex = index
          this.getTableData()
        }
      },
      // 每日得分折线图
      getLineData () {
        this.passData = this.$store.state.evaluate.averageObj.passData
        this.spinShow = true
        this.xy.loading()
        let params = {
          schoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          studentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          academicYearID: this.$parent.formValidateOK.yearSemester[0],
          academicSessionID: this.$parent.formValidateOK.yearSemester[1],
          CoursePlanAID: this.passData.CoursePlanAID,
          CoursePlanAIDType: this.passData.CoursePlanAIDType,
          startDate: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          endDate: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
        }
        this.xy.get(`${this.$store.state.apiPath}/api/GradeAndClassStatistics/GetClassScoreLine`, params).then(res => {
          this.spinShow = false
          this.xy.unloading()
          if (res.success) {
            this.lineChartData = res.data
            if (this.lineChartData.length === 0) {
              if (this.lineChart._dom !== undefined) {
                this.lineChart.clear()
              }
            } else {
              let xData = []; let yData = []
              res.data.forEach(item => {
                xData.push(item.Date)
                yData.push(item.Score)
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
                  axisLabel: {// 坐标轴刻度标签的相关设置。
                    formatter: function (params) {
                      var newParamsName = ''// 最终拼接成的字符串
                      var paramsNameNumber = params.length// 实际标签的个数
                      var provideNumber = 10// 每行能显示的字的个数
                      var rowNumber = Math.ceil(paramsNameNumber / provideNumber)// 换行的话，需要显示几行，向上取整
                      /**
                       * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                       */
                      // 条件等同于rowNumber>1
                      if (paramsNameNumber > provideNumber) {
                        /** 循环每一行,p表示行 */
                        for (var p = 0; p < rowNumber; p++) {
                          var tempStr = ''// 表示每一次截取的字符串
                          var start = p * provideNumber// 开始截取的位置
                          var end = start + provideNumber// 结束截取的位置
                          // 此处特殊处理最后一行的索引值
                          if (p === rowNumber - 1) {
                            // 最后一次不换行
                            tempStr = params.substring(start, paramsNameNumber)
                          } else {
                            // 每一次拼接字符串并换行
                            tempStr = params.substring(start, end) + '\n'
                          }
                          newParamsName += tempStr// 最终拼成的字符串
                        }
                      } else {
                        // 将旧标签的值赋给新标签
                        newParamsName = params
                      }
                      // 将最终的字符串返回
                      return newParamsName
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
            }
          }
        })
      },
      getClassData () {
        this.passData = this.$store.state.evaluate.averageObj.passData
        this.spinShow1 = true
        this.xy.loading()
        let params = {
          schoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          studentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          academicYearID: this.$parent.formValidateOK.yearSemester[0],
          academicSessionID: this.$parent.formValidateOK.yearSemester[1],
          CoursePlanAID: this.passData.CoursePlanAID,
          CoursePlanAIDType: this.passData.CoursePlanAIDType,
          startDate: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          endDate: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
        }
        this.xy.get(`${this.$store.state.apiPath}/api/GradeAndClassStatistics/GetStudentScoreBar`, params).then(res => {
          this.spinShow1 = false
          this.xy.unloading()
          if (res.success) {
            this.classColumData = res.data
            if (this.classColumData.length === 0) {
              if (this.classColum._dom !== undefined) {
                this.classColum.clear()
              }
            } else {
              let xData = []; let yData = []; let allNum = 0; let average = 0
              res.data.forEach(item => {
                xData.push(item.StudentName)
                yData.push(item.Score)
                allNum += item.Score
              })
              if (allNum !== 0 && res.data.length !== 0) {
                average = (allNum / res.data.length).toFixed(2)
              }
              let option = {
                title: {
                  text: '班级图表',
                  subtext: '平均值：' + average
                },
                color: ['#3398DB'],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                grid: {
                  left: '2%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
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
                dataZoom: [{
                  type: 'slider',
                  show: true,
                  xAxisIndex: [0],
                  left: '9%',
                  right: '9%',
                  bottom: -5,
                  start: 10,
                  height: 20,
                  end: 90 // 初始化滚动条
                }],
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
                    type: 'bar',
                    barWidth: 10,
                    data: yData,
                    markPoint: {
                      data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                      ]
                    }
                  }
                ]
              }

              this.$nextTick(() => {
                this.classColum = this.echarts.init(this.$refs.classColum)
                this.classColum.setOption(option)
              })
            }
          }
        })
      },
      getRingData () {
        this.passData = this.$store.state.evaluate.averageObj.passData
        this.spinShow2 = true
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GradeAndClassStatistics/GetIndexOneCell`, {
          schoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          studentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          academicYearID: this.$parent.formValidateOK.yearSemester[0],
          academicSessionID: this.$parent.formValidateOK.yearSemester[1],
          CoursePlanAID: this.passData.CoursePlanAID,
          CoursePlanAIDType: this.passData.CoursePlanAIDType,
          startDate: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          endDate: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
        }).then(res => {
          this.spinShow2 = false
          this.xy.unloading()
          if (res.success) {
            this.ringData = res.data
            if (this.ringData.length === 0) {
              if (this.ring._dom !== undefined) {
                this.ring.clear()
              }
            } else {
              let allData = []; let num = 0
              res.data.forEach(item => {
                num += item.Score
                allData.push({
                  name: item.IndexName,
                  value: item.Score
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
            }
          }
        })
      },
      getlineMoreData () {
        this.passData = this.$store.state.evaluate.averageObj.passData
        this.spinShow3 = true
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GradeAndClassStatistics/GetIndexOneLine`, {
          schoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          studentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          academicYearID: this.$parent.formValidateOK.yearSemester[0],
          academicSessionID: this.$parent.formValidateOK.yearSemester[1],
          CoursePlanAID: this.passData.CoursePlanAID,
          CoursePlanAIDType: this.passData.CoursePlanAIDType,
          startDate: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          endDate: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
        }).then(res => {
          this.spinShow3 = false
          this.xy.unloading()
          if (res.success) {
            this.lineMoreData = res.data
            if (this.lineMoreData.length === 0) {
              if (this.lineMore._dom !== undefined) {
                this.lineMore.clear()
              }
            } else {
              let beforeYdata = []; let xData = []; let yData = []
              res.data.forEach(item => {
                xData.push(item.ObjectName) // 添加数据
                item.Datas.forEach(item1 => {
                  beforeYdata.push({
                    name: item1.IndexName,
                    data: item1.Score
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
                    if (item2.IndexName === item) {
                      objectScore = item2.Score
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
            }
          }
        })
      },
      getpieData () {
        this.passData = this.$store.state.evaluate.averageObj.passData
        this.spinShow4 = true
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GradeAndClassStatistics/GetIndexTwoPie`, {
          schoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          studentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          academicYearID: this.$parent.formValidateOK.yearSemester[0],
          academicSessionID: this.$parent.formValidateOK.yearSemester[1],
          CoursePlanAID: this.passData.CoursePlanAID,
          CoursePlanAIDType: this.passData.CoursePlanAIDType,
          startDate: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          endDate: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')
        }).then(res => {
          this.spinShow4 = false
          this.xy.unloading()
          if (res.success) {
            this.subjectStatistics = res.data
            this.subjectStatistics = res.data.map((item, index) => {
              const pie = {}
              pie.data = item.Data.map((item1, index) => {
                return {
                  value: item1.Score,
                  name: item1.IndexName
                }
              })
              pie.IndexName = item.IndexOneName
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
            text: pie.IndexName
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              type: 'pie',
              radius: '50%',
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: pie.data
            }
          ]
        }
        echart.setOption(option)
      },
      getradarData () {
        this.passData = this.$store.state.evaluate.averageObj.passData
        this.spinShow5 = true
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GradeAndClassStatistics/GetIndexThreeRadar`, {
          schoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          studentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          academicYearID: this.$parent.formValidateOK.yearSemester[0],
          academicSessionID: this.$parent.formValidateOK.yearSemester[1],
          CoursePlanAID: this.passData.CoursePlanAID,
          CoursePlanAIDType: this.passData.CoursePlanAIDType,
          startDate: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          endDate: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD')

        }).then(res => {
          this.spinShow5 = false
          this.xy.unloading()
          if (res.success) {
            this.radarData = res.data
            if (this.radarData.length === 0) {
              if (this.radar._dom !== undefined) {
                this.radar.clear()
              }
            } else {
              let xData = []; let yData = []
              res.data.forEach(item => {
                xData.push(item.IndexName)
                yData.push(item.Score)
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
                  bottom: -5,
                  start: 10,
                  height: 20,
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
                this.radar.setOption(option)
              })
            }
          }
        })
      },
      // 跳转学生
      toClass (data) {
        this.passData.StudentID = data.StudentID
        this.passData.DisciplineID = ''// 清下
        this.passData.DisciplineID = data.DisciplineID
        this.$store.commit('evaluate/changeAverageObj', {
          passData: this.passData
        })
        // this.$store.commit('common/getThreeMenuName', data.UserName + '-' + data.FullName + '-' + this.passData.CoursePlanTableFullName)
        // this.$store.commit('common/getParam')
        // this.$router.push({
        //   path: '/xyhome/IndexStudent',
        //   query: this.$store.state.common.menuInfo
        // })
        this.$parent.currentComponent = 'IndexStudent'
      },
      change () {
        if (this.Exhibition === 'echart') {
          // 获取接口再绘图
          this.$nextTick(() => {
            this.getLineData()// 每日得分折线图
            this.getClassData()// 班级图表柱状图
            this.getRingData()// 环形图
            this.getlineMoreData()// 多折线
            this.getpieData()// 饼图(二级指标)
            this.getradarData()// 柱状图(三级指标)
          })
        } else {
          this.pageIndex = 1
          this.getTableData()
        }
      },
      // 获取列表数据
      async getTableData () {
        this.tbData = []
        this.passData = this.$store.state.evaluate.averageObj.passData
        this.spinShow6 = true
        this.xy.loading()
        const params = {
          schoolDistrictID: this.$parent.formValidateOK.schoolGrade[0],
          studentGradeForStudentYearID: this.$parent.formValidateOK.schoolGrade[1],
          academicYearID: this.$parent.formValidateOK.yearSemester[0],
          academicSessionID: this.$parent.formValidateOK.yearSemester[1],
          CoursePlanAID: this.passData.CoursePlanAID,
          CoursePlanAIDType: this.passData.CoursePlanAIDType,
          startDate: this.xy.moment(this.$parent.formValidateOK.date[0]).format('YYYY-MM-DD'),
          endDate: this.xy.moment(this.$parent.formValidateOK.date[1]).format('YYYY-MM-DD'),
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GradeAndClassStatistics/GetClassIndexScoreList`, params)
        this.spinShow6 = false
        this.xy.unloading()
        if (res.success) {
          this.tbData = res.data.ScoreData.data
          this.IndexData = res.data.IndexData
          this.tbTotal = res.data.ScoreData.totalRecords
          // 1.1版本算的总得分
          // if (this.tbData.length !== 0) {
          //   this.allScore = []
          //   this.tbData.forEach(item => {
          //     let num = 0
          //     item.IndexList.forEach(item1 => {
          //       num += parseInt(item1.Score !== null ? item1.Score : 0)
          //     })
          //     this.allScore.push(num)
          //   })
          // }
        }
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
          EndDate: this.passData.endTime
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/IndexContrast/GetClassCoursePlanLevelOneIndexScoreData`, params)
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
      async handleData (data, indexData) {
        let beforeYdata = []; let xData = []; let yData = []
        data.forEach(item => {
          xData.push(item.IndexManagementName) // 添加数据
          item.StudentList.forEach(item1 => {
            beforeYdata.push({
              name: item1.StudentName,
              data: item1.Score
            })
          })
        })
        const s = new Set() // 实例化对象
        beforeYdata.forEach(item => s.add(item.name))
        let newData = Array.from({ length: s.size }, () => []) // 创建指定长度数组并添值
        let newProject = [...s]
        newProject.forEach((item, index) => {
          data.forEach(item1 => {
            let score = 0
            item1.StudentList.forEach(item2 => {
              if (item2.StudentName === item) {
                score = item2.Score
              }
            })
            newData[index].push(score)
          })
        })
        newData.forEach((item, index) => {
          yData.push({
            name: Array.from(s)[index],
            type: 'bar',
            barGap: 0,
            barWidth: data.length > 1 ? '5px' : '20px',
            data: item
          })
        })
        this.$nextTick(() => {
          this.echartsOneAndTwoAndTree(xData, yData, indexData)
        })
      },
      // 绘制图表数据
      echartsOneAndTwoAndTree (xData, yData, indexData) {
        let that = this
        this.option.xAxis[0].data = xData
        this.option.series = yData
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
          this.echartsUrl = `${this.$store.state.apiPath}/api/IndexContrast/GetClassCoursePlanLevelTwoIndexScoreData`
        } else {
          this.echartsUrl = `${this.$store.state.apiPath}/api/IndexContrast/GetClassCoursePlanLevelThreeIndexScoreData`
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
          EndDate: this.passData.endTime
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
.index-class{
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
  .xy-content-title {
    border-radius: 4px 4px 0 0;
    padding: 20px;
    border: 1px solid #d9d9d9;
    display: flex;
    align-items: center;
    > p {
      text-align: right;
      margin-right: 12px;
      width: 94px;
    }
  }
  .xy-content-body {
    border: 1px solid #d9d9d9;
    border-top: none;
    border-radius: 0 0 4px 4px;
    padding:0;
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
  .icons-img{
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .table-data{
  text-align: center;
  width:100%;
  border: 1px solid #EBEEF5;
  thead{
    th{
      background: #FAFAFA;
      border-right: 1px solid #EBEEF5;
      border-bottom: 1px solid #EBEEF5;
      height: 54px;
      line-height: 54px;
      font-weight: 700;
      p{
        height:35px;
        line-height:35px;
      }
    }
  }
  .tBody{
    color: #606266;
    tr{
      td{
        span.title{
          display: inline-block;
          margin-right: 17px;
          width: 31px;
          height: 30px;
          background: #4196FF;
          border-radius: 50%;
          color: #FFFFFF;
          line-height: 30px;
          text-align: center;
        }
      }
    }
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
      }
    }
  }
  }
}
</style>
