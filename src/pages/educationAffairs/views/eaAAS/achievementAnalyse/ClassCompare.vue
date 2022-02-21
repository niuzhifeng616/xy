<!-- 教学质量：成绩分析-行政班对比 -->
<template>
  <div class="class-compare">
    <div class="container">
      <div class="box1">
        <ul class="sele-sub">
          <li @click="butValue(index,item.code)" v-for="(item, index) in  butTab" :key="index" v-text="item.name"
            :class="item.class"></li>
        </ul>
        <div class="box-info">
          <p>平均分对比</p>
          <div v-if="!lodAvgs && avgStue" class="avger-echar">
            <div class="box-base">
              <div style="height: 243px; width: 100%;" ref="avgerEchar"></div>
            </div>
          </div>
          <div v-else class="no-dt">
            <i class="iconfont">&#xe6e7;</i>
            <p>您还没有平均分对比的信息，请添加平均分对比。</p>
          </div>
        </div>
      </div>

      <div class="box2">
        <p>优良率</p>
        <div v-if="!lodGood && goodStue" class="box-echar">
          <div class="box-base">
            <div style="width: 100%;height: 243px;" ref="echartGood"></div>
          </div>
        </div>
        <div v-else class="no-dt">
          <i class="iconfont">&#xe6e7;</i>
          <p>您还没有优良率的信息，请添加优良率。</p>
        </div>
      </div>
      <div class="box3">
        <div class="grad-exp">
          <p>年级比例分布</p>
          <div v-if="!gradeload && gradeColList.length > 0" class="box-tab">
            <Table :columns="gradeColList" :data="gradeDt"></Table>
          </div>
          <div v-if="!gradeload && gradeColList.length === 0" class="no-dt">
            <i class="iconfont">&#xe6e7;</i>
            <p>您还没有年级比例分布的信息，请添加年级比例分布。</p>
          </div>

        </div>
        <div class="grad-exp">
          <p>年级排名分布</p>
          <div v-if="!rankload && rankColList.length > 0" class="box-tab">
            <Table :columns="rankColList" :data="rankDt"></Table>
          </div>
          <div v-if="!rankload && rankColList.length === 0" class="no-dt">
            <i class="iconfont">&#xe6e7;</i>
            <p>您还没有年级排名分布的信息，请添加年级排名分布。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ClassCompare',
    components: {
    },
    data () {
      return {
        butIndex: '',
        butTab: [{
          name: '',
          class: 'checked'
        }],
        gradeColList: [],
        gradeDt: [],
        rankColList: [],
        rankDt: [],
        lodGood: true,
        lodAvgs: true,
        gradeload: true,
        rankload: true,
        rateAnalyse: null,
        avgEchar: null,
        good: null,
        avgs: null,
        avgStue: false,
        goodStue: false
      }
    },
    created () {
    },
    mounted () {
      this.getAnalysisLabel()
      this.windowResize()
      window.onresize = this.windowResize
    },
    destroyed () {
      window.onresize = null
    },
    methods: {
      tiggerFunc () {
        this.rateAnalys()
        this.rateAnal()

        this.rankingAnalyseRankTable()
        this.rankingAnalyExpseTable()
      },
      // 顶部tab
      async getAnalysisLabel () {
        var that = this
        that.xy.loading()
        let res = await that.xy.get(`${that.$store.state.apiPath}/api/AchievementAnalyse/GetAnalysisLabel`, {
          achievementRecordID: that.$parent.row.AchievementRecordID
        })
        that.xy.unloading()
        that.butTab = [{
          name: '',
          class: 'checked'
        }]
        if (res.success) {
          var dt = res.data
          if (dt && dt.length > 0) {
            that.butIndex = dt[0].Code
            that.butTab = dt.map(function (val, index) {
              return {
                name: val.Name,
                code: val.Code,
                class: index === 0 ? 'checked' : ''
              }
            })
            that.tiggerFunc()
          } else {
            that.baseLod = false
            that.gradeload = false
            that.rankload = false
          }
        }
      },
      // 平均分分析
      async rateAnalys () {
        var that = this
        let res = await that.xy.get(`${that.$store.state.apiPath}/api/AchievementAnalyse/AvgAnalyseChart`, {
          achievementRecordID: that.$parent.row.AchievementRecordID,
          disciplineCode: that.butIndex,
          isFF: false,
          isCL: false
        })
        if (res.success) {
          that.lodAvgs = false
          // return
          if (res.data) {
            var dt = res.data
            if (dt.Axis.length > 0) {
              that.avgStue = true
              that.$nextTick(function () {
                that.avgs = that.echarts.init(that.$refs.avgerEchar)
                var option = {
                  color: 'rgba(0,0,0,0.65)',
                  textStyle: {
                    color: 'rgba(0,0,0,0.65)'
                  },
                  tooltip: {
                    trigger: 'axis',
                    formatter: function (datas) {
                      var res = datas[0].name + '<br/>' + datas[0].marker + datas[0].value
                      return res
                    }
                  },
                  grid: {
                    left: '1%',
                    right: '50px',
                    top: '30px',
                    bottom: '0',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    data: dt.Axis,
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
                      data: dt.Data.Avg,
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
                            name: '年级平均分' + dt.AvgLine + '分',
                            yAxis: dt.AvgLine
                          }
                        ]
                      }
                    }
                  ]
                }
                that.avgs.setOption(option)
              })
            }
          }
        }
      },
      // "优秀率", "良好率", "合格率", "低分率"
      async rateAnal () {
        var that = this
        let res = await that.xy.get(`${that.$store.state.apiPath}/api/AchievementAnalyse/RateAnalyseChart`, {
          achievementRecordID: that.$parent.row.AchievementRecordID,
          disciplineCode: that.butIndex,
          isFF: false,
          isCL: false
        })
        if (res.success) {
          that.lodGood = false
          // return
          if (res.data) {
            var dt = res.data
            if (dt.Axis.length > 0) {
              that.goodStue = true
              that.$nextTick(function () {
                that.good = that.echarts.init(that.$refs.echartGood)
                var option = {
                  grid: {
                    top: '15%',
                    left: '1%',
                    right: '1%',
                    bottom: '1%',
                    containLabel: true
                  },
                  legend: {
                    top: '0px',
                    x: '80%',
                    data: dt.Legend
                  },
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                      type: 'line' // 指示器类型。
                    },
                    formatter: function (val) {
                      return val[0].name + '<br/>' + val.map(function (vv, index) {
                        if (index === val.length - 1) {
                          return vv.marker + vv.seriesName + '：' + vv.value
                        } else {
                          return vv.marker + vv.seriesName + '：' + vv.value + '<br/>'
                        }
                      }).join('')
                    }
                  },
                  xAxis: {
                    type: 'category',
                    axisTick: {
                      show: false
                    },
                    axisLine: {
                      show: true,
                      lineStyle: {
                        type: 'solid',
                        color: 'rgba(232,232,232,1)', // 左边线的颜色
                        width: '1'// 坐标线的宽度
                      }
                    },
                    axisLabel: {
                      show: true,
                      textStyle: {
                        color: 'rgba(0,0,0,0.65)' // 坐标值得具体的颜色

                      }
                    },
                    data: dt.Axis
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
                      show: false // 是否显示y轴
                    },
                    axisTick: {
                      show: false
                    },
                    axisLabel: {
                      show: true,
                      textStyle: {
                        color: 'rgba(0,0,0,0.65)' // 坐标值得具体的颜色
                      }
                    }
                  },
                  series: [{
                    name: dt.Legend[0],
                    data: dt.Data.Outs || [],
                    type: 'line',
                    symbol: 'circle', // 折线点设置为实心点
                    symbolSize: 4, // 折线点的大小
                    itemStyle: {
                      normal: {
                        color: '#36CFC9', // 折线点的颜色
                        lineStyle: {
                          color: '#36CFC9'// 折线的颜色
                        },
                        width: 3
                      }
                    }
                  }, {
                    name: dt.Legend[1],
                    data: dt.Data.Good || [],
                    type: 'line',
                    symbol: 'circle', // 折线点设置为实心点
                    symbolSize: 4, // 折线点的大小
                    itemStyle: {
                      normal: {
                        color: '#FACC14', // 折线点的颜色
                        lineStyle: {
                          color: '#FACC14'// 折线的颜色
                        },
                        width: 3
                      }
                    }
                  }, {
                    name: dt.Legend[2],
                    data: dt.Data.Pass || [],
                    type: 'line',
                    symbol: 'circle', // 折线点设置为实心点
                    symbolSize: 4, // 折线点的大小
                    itemStyle: {
                      normal: {
                        color: '#2FC25B', // 折线点的颜色
                        lineStyle: {
                          color: '#2FC25B'// 折线的颜色
                        },
                        width: 3
                      }
                    }
                  }, {
                    name: dt.Legend[3],
                    data: dt.Data.Low || [],
                    type: 'line',
                    symbol: 'circle', // 折线点设置为实心点
                    symbolSize: 4, // 折线点的大小
                    itemStyle: {
                      normal: {
                        color: '#1890FF', // 折线点的颜色
                        lineStyle: {
                          color: '#1890FF'// 折线的颜色
                        },
                        width: 3
                      }
                    }
                  }]
                }
                that.good.setOption(option)
              })
            }
          }
        }
      },
      // 排行分析表格
      async rankingAnalyseRankTable () {
        var that = this
        let res = await that.xy.get(`${that.$store.state.apiPath}/api/AchievementAnalyse/RankingAnalyseTable`, {
          achievementRecordID: that.$parent.row.AchievementRecordID,
          disciplineCode: that.butIndex,
          isFF: false,
          isCL: false,
          isPercentRank: false
        })
        if (res.success) {
          that.rankload = false
          that.rankColList = []
          // return
          if (res.data) {
            var dt = res.data
            if (dt.Headers && dt.Rows && dt.Headers.length > 0 && dt.Rows.length > 0) {
              that.rankColList = dt.Headers.map(function (vv, index) {
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
              that.rankDt = dt.Rows
            }
          }
        }
      },
      // 年级比例分布
      async rankingAnalyExpseTable () {
        var that = this
        let res = await that.xy.get(`${that.$store.state.apiPath}/api/AchievementAnalyse/RankingAnalyseTable`, {
          achievementRecordID: that.$parent.row.AchievementRecordID,
          disciplineCode: that.butIndex,
          isFF: false,
          isCL: false,
          isPercentRank: true
        })
        if (res.success) {
          that.gradeload = false
          that.gradeColList = []
          // return
          if (res.data) {
            var dt = res.data
            if (dt.Headers && dt.Rows && dt.Headers.length > 0 && dt.Rows.length > 0) {
              that.gradeColList = dt.Headers.map(function (vv, index) {
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
              that.gradeDt = dt.Rows
            }
          }
        }
      },
      butValue (val, code) {
        if (code === this.butIndex) return
        for (var i in this.butTab) {
          if (i * 1 === val) {
            this.butIndex = code
            this.butTab[val].class = 'checked'
            this.tiggerFunc()
          } else {
            this.butTab[i].class = ''
          }
        }
      },
      windowResize () {
        var screenHeight = document.documentElement.offsetHeight || document.body.offsetHeight // 网页可见区域高
        var screenWidth = document.documentElement.offsetWidth || document.body.offsetWidth // 网页可见区域宽
        // resize
        if (screenHeight < 645 && screenWidth < 1366) { return false }
        if (!this.lodGood && this.goodStue) {
          this.good.resize()
        }
        if (!this.lodAvgs && this.avgs) {
          this.avgs.resize()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
@import "./css/ClassCompare.css";
</style>
