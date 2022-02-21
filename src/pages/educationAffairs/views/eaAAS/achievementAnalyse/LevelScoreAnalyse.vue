<!-- 教学质量：成绩分析-等级分分析 -->
<template>
    <div>
        <div class="level-analysis">
            <!--3+1+2模式下显示物理历史tab切换-->
            <ul class="tab-title" v-if="$parent.row.ScoreMode == 2">
                <li v-for="(sub, index) in subjectTab" :key="index"
                    :class="tabChecked === index?'checked':''"
                    @click="checkSubject(sub, index)">{{sub.name}}</li>
            </ul>
            <div class="con-model mod1">
                <p class="item-title">分数段</p>
                <div v-if="!noDataStage" class="item-con">
                    <div style="height:100%;" id="StageScoreChart"></div>
                </div>
                <div v-else class="no-dt">
                  <i class="iconfont">&#xe6e7;</i>
                  <p>您还没有分数段的信息，请添加分数段。</p>
                </div>
            </div>
            <div class="con-model mod2">
                <p class="item-title">分数</p>
                <ul v-if="!baseScoreNoData" class="score-base">
                    <li>
                        <span><i class="iconfont">&#xe6dd;</i></span>
                        <div>
                            <span>平均分</span>
                            <strong>{{baseScore.AvgScore}}分</strong>
                        </div>
                    </li>
                    <li>
                        <span><i class="iconfont">&#xe6dd;</i></span>
                        <div>
                            <span>最高分</span>
                            <strong>{{baseScore.MaxScore}}分</strong>
                        </div>
                    </li>
                    <li>
                        <span><i class="iconfont">&#xe6dd;</i></span>
                        <div>
                            <span>中位数</span>
                            <strong>{{baseScore.MedianScore}}分</strong>
                        </div>
                    </li>
                    <li>
                        <span><i class="iconfont">&#xe6dd;</i></span>
                        <div>
                            <span>最低分</span>
                            <strong>{{baseScore.MinScore}}分</strong>
                        </div>
                    </li>
                </ul>
                <div v-else class="no-dt">
                  <i class="iconfont">&#xe6e7;</i>
                  <p>您还没有分数的信息，请添加分数。</p>
                </div>
            </div>
            <div class="con-model mod3">
                <p class="item-title">平均分</p>
                <div v-if="!noDataAverage" class="item-con">
                    <div style="height:100%;" id="StageAverageChart"></div>
                </div>
                <div v-else class="no-dt">
                  <i class="iconfont">&#xe6e7;</i>
                  <p>您还没有平均分的信息，请添加平均分。</p>
                </div>
            </div>
            <div class="con-model mod4">
                <p class="item-title no-border">年级占比分布</p>
                <div v-if="!zbNoData" class="item-con">
                    <Table :columns="zbColumns" :data="zbTableData"></Table>
                </div>
                <div v-else class="no-dt">
                  <i class="iconfont">&#xe6e7;</i>
                  <p>您还没有年级占比分布的信息，请添加年级占比分布。</p>
                </div>
            </div>
            <div class="con-model mod5">
                <p class="item-title no-border">年级排名分布</p>
                <div v-if="!pmNoData" class="item-con">
                    <Table :columns="pmColumns" :data="pmTableData"></Table>
                </div>
                <div v-else class="no-dt">
                  <i class="iconfont">&#xe6e7;</i>
                  <p>您还没有年级排名分布的信息，请添加年级排名分布。</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'LevelScoreAnalyse',
    components: {
    },
    data () {
      return {
        tabChecked: 0, // 科目切换
        tabCheckedVal: '',
        subjectTab: [
          {
            name: '物理',
            value: 'AllP'
          },
          {
            name: '历史',
            value: 'AllH'
          }
        ],

        chartStage: {}, // 分数段
        dataStage: [],
        loadingStage: true,
        noDataStage: false,

        chartAverage: {}, // 平均分
        dataAverage: [],
        loadingAverage: true,
        noDataAverage: false,

        baseScore: '', // 等级分分数信息
        baseScoreNoData: false,

        zbColumns: [], // 年级占比分布
        zbTableData: [],
        zbNoData: false,

        pmColumns: [], // 年级排名分布
        pmTableData: [],
        pmNoData: false
      }
    },
    created () {
      // 判断赋分模式 1：未选科、2：3+1+2、3:3+3
      if (this.$parent.row.ScoreMode !== 2) {
        this.tabCheckedVal = 'All'// 0、2
      } else {
        this.tabCheckedVal = 'AllP'// 1
      }

      this.getScore()// 等级分分析-分数
      this.getTableZB() // 年级占比分布
      this.getTablePM()// 年级排名分布
    },
    mounted () {
      this.getStageScore()// 分数段
      this.getAverageScore()// 平均分

      this.windowResize()
      window.onresize = this.windowResize
    },
    destroyed () {
      window.onresize = null
    },
    methods: {
      // 科目tab切换
      checkSubject (sub, index) {
        this.tabChecked = index
        this.tabCheckedVal = sub.value

        this.getScore()// 等级分分析-分数
        this.getTableZB() // 年级占比分布
        this.getTablePM()// 年级排名分布
        this.getStageScore()// 分数段
        this.getAverageScore()// 平均分
      },

      // 分数段
      async getStageScore () {
        var _this = this
        _this.xy.loading()
        _this.dataStage = []

        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementAnalyse/ScoreSegmentAnalyseChart`, {
          achievementRecordID: _this.$parent.row.AchievementRecordID,
          disciplineCode: _this.tabCheckedVal,
          isFF: true
        })
        _this.xy.unloading()
        if (res.success) {
          _this.loadingStage = false
          if (res.data) {
            _this.dataStage = res.data
            if (_this.dataStage.Data.ScoreSegment.length > 0) {
              _this.noDataStage = false
              _this.getChartStageScore(_this.dataStage)
            } else {
              _this.noDataStage = true
            }
          }
        }
      },
      getChartStageScore (data) {
        var xAxisData = data.Axis
        var echartsSeries = data.Data.ScoreSegment

        this.chartStage = this.echarts.init(document.getElementById('StageScoreChart'))
        var option = {
          color: 'rgba(0,0,0,0.65)',
          textStyle: {
            color: 'rgba(0,0,0,0.65)'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (datas) {
              var res = datas[0].name + '<br/>' + datas[0].marker + '人数：' + datas[0].value
              return res
            }
          },
          grid: {
            left: '10px',
            right: '50px',
            top: '30px',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            axisLine: {
              lineStyle: {
                color: '#D9D9D9' // x轴颜色
              }
            },
            axisTick: {
              show: false// 不显示轴刻度
            }
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed', // 内容部分的线改为虚线
                color: '#E8E8E8'
              }
            },
            axisLine: {
              show: false// 不显示轴
            },
            axisTick: {
              show: false// 不显示轴刻度
            }
          },
          // 底部轴
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              start: 0,
              end: 100,
              left: '10%',
              right: '10%',
              bottom: '0',
              handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            }
          ],
          series: [
            {
              name: '分数段人数',
              type: 'line',
              smooth: true,
              symbol: 'none',
              sampling: 'average',
              itemStyle: {
                color: '#1890FF'// 曲线颜色
              },
              areaStyle: {
                color: new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#1890FF'
                }, {
                  offset: 1,
                  color: '#FFF'
                }])
              },
              data: echartsSeries
            }
          ]
        }
        this.chartStage.setOption(option)
      },

      // 平均分
      async getAverageScore () {
        var _this = this
        _this.dataAverage = []
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementAnalyse/AvgAnalyseChart`, {
          achievementRecordID: _this.$parent.row.AchievementRecordID,
          disciplineCode: _this.tabCheckedVal,
          isFF: true,
          isCL: false
        })
        if (res.success) {
          _this.loadingAverage = false
          if (res.data) {
            _this.dataAverage = res.data
            if (_this.dataAverage.Data.Avg.length > 0) {
              _this.noDataAverage = false
              _this.getChartAverageScore(_this.dataAverage)
            } else {
              _this.noDataAverage = true
            }
          }
        }
      },
      getChartAverageScore (data) {
        var xAxisData = data.Axis
        var echartsSeries = data.Data.Avg
        var avgLine = data.AvgLine

        this.chartAverage = this.echarts.init(document.getElementById('StageAverageChart'))
        var option = {
          color: 'rgba(0,0,0,0.65)',
          textStyle: {
            color: 'rgba(0,0,0,0.65)'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (datas) {
              var res = datas[0].name + '<br/>' + datas[0].marker + datas[0].value
              return res
            }
          },
          grid: {
            left: '0',
            right: '50px',
            top: '30px',
            bottom: '0',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: xAxisData,
            axisLine: {
              lineStyle: {
                color: '#D9D9D9' // x轴颜色
              }
            },
            axisTick: {
              show: false// 不显示轴刻度
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed', // 内容部分的线改为虚线
                color: '#E8E8E8'
              }
            },
            axisLine: {
              show: false// 不显示轴
            },
            axisTick: {
              show: false// 不显示轴刻度
            }
          },
          series: [
            {
              name: '',
              type: 'bar',
              barMaxWidth: 25, // 最大宽度
              data: echartsSeries,
              itemStyle: {
                color: '#1890FF'
              },
              markLine: {// 标识线
                symbol: 'none', // 去掉箭头
                itemStyle: {
                  normal: {
                    lineStyle: {
                      type: 'solid',
                      color: '#2FC25B'
                    },
                    label: {
                      show: true,
                      position: 'end'
                    }
                  }
                },
                data: [
                  {
                    name: '年级平均分' + avgLine + '分',
                    yAxis: avgLine
                  }
                ]
              }
            }
          ]
        }
        this.chartAverage.setOption(option)
      },

      // 等级分分析-分数
      async getScore () {
        var _this = this
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementAnalyse/GetAchievementAnalyseBase`, {
          achievementRecordID: _this.$parent.row.AchievementRecordID,
          code: _this.tabCheckedVal,
          isFF: true
        })
        if (res.success) {
          if (res.data) {
            _this.baseScore = res.data
            _this.baseScoreNoData = false
          } else {
            _this.baseScoreNoData = true
          }
        }
      },
      // 年级占比分布
      async getTableZB () {
        var _this = this
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementAnalyse/RankingAnalyseTable`, {
          achievementRecordID: _this.$parent.row.AchievementRecordID,
          disciplineCode: _this.tabCheckedVal,
          isCL: false,
          isFF: true,
          isPercentRank: true // 百分比排名:true, 名次排名:false
        })
        if (res.success) {
          if (res.data) {
            if (res.data.Rows.length > 0) {
              res.data.Headers = res.data.Headers.map(function (vv, index) {
                let v = {
                  key: vv.key,
                  title: vv.title
                }
                if (index === 0) {
                  v.minWidth = 150
                } else {
                  v.width = 100
                }
                return v
              })
              _this.zbColumns = res.data.Headers
              _this.zbTableData = res.data.Rows
              _this.zbNoData = false
            } else {
              _this.zbNoData = true
            }
          }
        }
      },
      // 年级排名分布
      async getTablePM () {
        var _this = this
        let res = await _this.xy.get(`${_this.$store.state.apiPath}/api/AchievementAnalyse/RankingAnalyseTable`, {
          achievementRecordID: _this.$parent.row.AchievementRecordID,
          disciplineCode: _this.tabCheckedVal,
          isCL: false,
          isFF: true,
          isPercentRank: false // 百分比排名:true, 名次排名:false
        })
        if (res.success) {
          if (res.data) {
            if (res.data.Rows.length > 0) {
              res.data.Headers = res.data.Headers.map(function (vv, index) {
                let v = {
                  key: vv.key,
                  title: vv.title
                }
                if (index === 0) {
                  v.minWidth = 150
                } else {
                  v.width = 100
                }
                return v
              })
              _this.pmColumns = res.data.Headers
              _this.pmTableData = res.data.Rows
              _this.pmNoData = false
            } else {
              _this.pmNoData = true
            }
          }
        }
      },

      windowResize () {
        var _this = this
        var screenHeight = document.documentElement.offsetHeight || document.body.offsetHeight // 网页可见区域高
        var screenWidth = document.documentElement.offsetWidth || document.body.offsetWidth // 网页可见区域宽
        // resize
        if (screenHeight < 645 && screenWidth < 1366) { return false }
        if (!_this.noDataStage && !_this.loadingStage) {
          _this.chartStage.resize()
        }
        if (!_this.noDataAverage && !_this.loadingAverage) {
          _this.chartAverage.resize()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "./css/LevelScoreAnalyse.css";
</style>
