<!--教学质量：成绩分析-年级分析-->
<template>
  <div class="subject-grade">
    <div class="container">
      <div class="box1">
        <ul class="sele-sub">
          <li @click="butValue(item.code,index)" v-for="(item, index) in  butTab" :key="index" v-text="item.name"
            :class="item.class"></li>
        </ul>
        <div class="box-info">
          <div v-if="!baseLod" class="box-base">
            <ul v-if="subList.length > 0">
              <li v-for="(item, index) in subList" :key="index">
                <div class="box-bott" :class="index === 5 ? 'no-bd-ri' : ''">
                  <p v-text="item.name"></p>
                  <p>{{item.num}}<span v-if="item.unit" v-text="item.unit"></span></p>
                </div>
              </li>
            </ul>
            <div class="no-dt" v-if="subList.length === 0">
              <i class="iconfont">&#xe6e7;</i>
              <p>您还没有学科组合的信息，请添加学科组合。</p>
            </div>
          </div>
        </div>
      </div>

      <div class="box2">
        <div class="box-sore">
          <p>高低分</p>
          <div class="no-dt" v-show="!baseLod && maxMinList.length > 0">
            <div class="box-black">
              <div class="box-aver" v-for="(item, index) in maxMinList" :key="index">
                <div class="box-icon" :class="item.class">
                  <i class="iconfont">&#xe6dd;</i>
                </div>
                <div class="text-inf">
                  <p v-text="item.name"></p>
                  <p>{{item.num}}分</p>
                </div>
              </div>
            </div>
          </div>
          <div v-show="!baseLod  && maxMinList.length === 0" class="no-dt">
            <i class="iconfont">&#xe6e7;</i>
            <p>您还没有高低分的信息，请添加高低分。</p>
          </div>
        </div>
        <div class="box-sore">
          <p>优良率</p>
          <div class="echar-group" v-show="!baseLod && !isEnpty">
            <div class="pin-ech">
              <div class="ech-sty">
                <div style="width: 120px;height: 120px;" ref="echart1"></div>
              </div>
              <p v-if="peopleNumber">{{peopleNumber.OutsNum}}<span>人</span></p>
            </div>
            <div class="pin-ech">
              <div class="ech-sty">
                <div style="width: 120px;height: 120px;" ref="echart2"></div>
              </div>
              <p v-if="peopleNumber">{{peopleNumber.GoodNum}}<span>人</span></p>
            </div>
            <div class="pin-ech">
              <div class="ech-sty">
                <div style="width: 120px;height: 120px;" ref="echart3"></div>
              </div>
              <p v-if="peopleNumber">{{peopleNumber.PassNum}}<span>人</span></p>
            </div>
            <div class="pin-ech">
              <div class="ech-sty">
                <div style="width: 120px;height: 120px;" ref="echart4"></div>
              </div>
              <p v-if="peopleNumber">{{peopleNumber.LowNum}}<span>人</span></p>
            </div>
          </div>
          <div v-show="!baseLod && isEnpty" class="no-dt">
            <i class="iconfont">&#xe6e7;</i>
            <p>您还没有优良率的信息，请添加优良率。</p>
          </div>
        </div>
      </div>

      <div class="box3">
        <p>分数段</p>
        <div v-if="!lodSore && soreStue" class="sore-echar">
          <div class="box-base">
            <div style="width: 100%;height: 285px;" ref="echartSore"></div>
          </div>
        </div>
        <div v-else class="no-dt">
          <i class="iconfont">&#xe6e7;</i>
          <p>您还没有分数段的信息，请添加分数段。</p>
        </div>
      </div>

      <div class="box4">
        <div class="box-sore">
          <p>得分率</p>
          <div v-if="!lodDiff && giveStue" class="echart-give">
            <div ref="echartGive" style="width: 100%;height: 276px;"></div>
          </div>
          <div v-else class="no-dt">
            <i class="iconfont">&#xe6e7;</i>
            <p>您还没有得分率的信息，请添加得分率。</p>
          </div>
        </div>
        <div class="box-sore">
          <p>区分度</p>
          <div v-if="!lodDiff && giveStue" class="echart-give">
            <div style="width: 100%;height: 276px;" ref="echartDiff"></div>
          </div>
          <div v-else class="no-dt">
            <i class="iconfont">&#xe6e7;</i>
            <p>您还没有区分度的信息，请添加区分度。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'GradeAnalyse',
    components: {
    },
    data () {
      return {
        subList: [],
        butTab: [{
          name: '',
          class: 'checked'
        }],
        butIndex: '',
        maxMinList: [],
        lodDiff: true,
        diff: null,
        give: null,
        lodSore: true,
        sore: null,
        peopleNumber: null,
        baseLod: true,
        isEnpty: true,
        soreStue: false,
        giveStue: false
      }
    },
    created () {
      this.getAnalysisLabel() // 顶部tab
    },
    mounted () {
      // this.getStageScore(); //分数段
      this.getObtainRateAndDistinctionRate() // 获取得分率/区分度图表
      this.windowResize()
      window.onresize = this.windowResize
    },
    destroyed () {
      window.onresize = null
    },
    methods: {
      tiggerFunc () {
        this.getAchievementAnalyseBase()
        this.getStageScore()
      },
      // 顶部tab
      async getAnalysisLabel () {
        var that = this
        let res = await that.xy.get(`${that.$store.state.apiPath}/api/AchievementAnalyse/GetAnalysisLabel`, {
          achievementRecordID: that.$parent.row.AchievementRecordID
        })
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
          }
        }
      },
      // 成绩分析-基本信息
      async getAchievementAnalyseBase () {
        var that = this
        that.xy.loading()
        let res = await that.xy.get(`${that.$store.state.apiPath}/api/AchievementAnalyse/GetAchievementAnalyseBase`, {
          achievementRecordID: that.$parent.row.AchievementRecordID,
          isFF: false,
          code: that.butIndex
        })
        that.xy.unloading()
        that.baseLod = false
        that.subList = []
        that.maxMinList = []
        if (res.success) {
          var dt = res.data
          if (dt) {
            that.peopleNumber = dt
            that.isEnpty = false
            that.echartPin(dt)
            that.subList = [
              {
                name: '学生人数',
                num: dt.TotalNum,
                unit: '人'
              },
              {
                name: '有效成绩',
                num: dt.EffectiveNum,
                unit: '人'
              },
              {
                name: '无效成绩',
                num: dt.InvalidNum,
                unit: '人'
              },
              {
                name: '满分',
                num: dt.TotalScore,
                unit: '分'
              },
              {
                name: '得分率',
                num: dt.ObtainRate,
                unit: ''
              },
              {
                name: '区分度',
                num: dt.DistinctionRate,
                unit: ''
              }
            ]
            that.maxMinList = [
              {
                name: '平均分',
                num: dt.AvgScore,
                class: 'bg0'
              },
              {
                name: '最高分',
                num: dt.MaxScore,
                class: 'bg1'
              },
              {
                name: '中位数',
                num: dt.MedianScore,
                class: 'bg2'
              },
              {
                name: '最低分',
                num: dt.MinScore,
                class: 'bg3'
              }
            ]
          }
        }
      },
      // 分数段
      async getStageScore () {
        var that = this
        let res = await that.xy.get(`${that.$store.state.apiPath}/api/AchievementAnalyse/ScoreSegmentAnalyseChart`, {
          achievementRecordID: that.$parent.row.AchievementRecordID,
          disciplineCode: that.butIndex,
          isFF: false
        })
        if (res.success) {
          that.lodSore = false
          // return
          if (res.data) {
            var dt = res.data
            if (dt.Axis.length > 0) {
              that.soreStue = true
              that.$nextTick(function () {
                that.sore = that.echarts.init(that.$refs.echartSore)
                var option = {
                  grid: {
                    top: '15%',
                    left: '1%',
                    right: '50px',
                    bottom: '15%',
                    containLabel: true
                  },
                  tooltip: {
                    trigger: 'axis',
                    formatter: function (pt) {
                      return pt[0].axisValue + '<br/>' + pt[0].marker + '人数：' + pt[0].data
                    }
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
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
                  dataZoom: [{
                    type: 'inside',
                    start: 0
                  }, {
                    start: 0,
                    end: 10,
                    left: '10%',
                    right: '10%',
                    bottom: '0%',
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                      color: '#fff',
                      shadowBlur: 3,
                      shadowColor: 'rgba(0, 0, 0, 0.6)',
                      shadowOffsetX: 2,
                      shadowOffsetY: 2
                    }
                  }],
                  series: [
                    {
                      // name: '模拟数据',
                      type: 'line',
                      smooth: true,
                      symbol: 'none',
                      sampling: 'average',
                      // itemStyle: {
                      //   color: '#1890FF'
                      // },
                      itemStyle: {
                        normal: {
                          color: '#1890FF', // 折线点的颜色
                          lineStyle: {
                            color: '#1890FF'// 折线的颜色
                          },
                          width: 3
                        }
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
                      data: dt.Data.ScoreSegment
                    }
                  ]
                }
                that.sore.setOption(option)
              })
            }
          }
        }
      },
      // 获取得分率/区分度图表
      async getObtainRateAndDistinctionRate () {
        var that = this
        let res = await that.xy.get(`${that.$store.state.apiPath}/api/AchievementAnalyse/GetObtainRateAndDistinctionRate`, {
          achievementRecordID: that.$parent.row.AchievementRecordID
        })
        that.lodDiff = false
        if (res.success) {
          // return
          if (res.data) {
            var dt = res.data
            if (dt.XData.length > 0) {
              that.giveStue = true
              that.rateAndDistinctionRate(dt)
            }
          }
        }
      },
      // 4饼图
      echartPin (val) {
        // 优秀率
        var obj1 = {
          color: ['#F0F2F5', '#1890FF'],
          grid: {
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            containLabel: true
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  // color: 'red',
                  formatter: '{total|优秀率}' + '\n\r' + '{active|' + val.OutsRate + '%}',
                  rich: {
                    total: {
                      fontSize: 12,
                      color: 'rgba(0,0,0,0.3)'
                    },
                    active: {
                      fontSize: 14,
                      color: 'rgba(0,0,0,0.85)',
                      lineHeight: 20
                    }
                  },
                  emphasis: {// 中间文字显示
                    show: true
                  }
                },
                emphasis: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: [
                {
                  value: val.OutsRate * 1,
                  name: '1',
                  itemStyle: {
                    normal: {
                      color: new this.echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: '#1890FF'
                      }, {
                        offset: 1,
                        color: '#1890FF'
                      }])
                    }
                  }
                }, {
                  value: 100 - val.OutsRate * 1,
                  name: '2',
                  itemStyle: {
                    normal: {
                      color: new this.echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: '#F0F2F5'
                      }, {
                        offset: 1,
                        color: '#F0F2F5'
                      }])
                    }
                  }
                }
              ]
            // this.opt1SeriesData,
            }
          ]
        }
        // 良好率
        var obj2 = {
          color: ['#F0F2F5', '#1890FF'],
          grid: {
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            containLabel: true
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  color: 'rgba(0,0,0,0.3)',
                  formatter: '{total|良好率}' + '\n\r' + '{active|' + val.GoodRate + '%}',
                  rich: {
                    total: {
                      fontSize: 12,
                      color: 'rgba(0,0,0,0.3)'
                    },
                    active: {
                      fontSize: 14,
                      color: 'rgba(0,0,0,0.85)',
                      lineHeight: 20
                    }
                  },
                  emphasis: {// 中间文字显示
                    show: true
                  }
                },
                emphasis: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: [
                {
                  value: val.GoodRate * 1,
                  name: '1',
                  itemStyle: {
                    normal: {
                      color: new this.echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: '#2FC25B'
                      }, {
                        offset: 1,
                        color: '#2FC25B'
                      }])
                    }
                  }
                }, {
                  value: 100 - val.GoodRate * 1,
                  name: '2',
                  itemStyle: {
                    normal: {
                      color: new this.echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: '#F0F2F5'
                      }, {
                        offset: 1,
                        color: '#F0F2F5'
                      }])
                    }
                  }
                }
              ]
            // this.opt1SeriesData,
            }
          ]
        }
        // 合格率
        var obj3 = {
          color: ['#F0F2F5', '#1890FF'],
          grid: {
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            containLabel: true
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  color: 'rgba(0,0,0,0.3)',
                  formatter: '{total|合格率}' + '\n\r' + '{active|' + val.PassRate + '%}',
                  rich: {
                    total: {
                      fontSize: 12,
                      color: 'rgba(0,0,0,0.3)'
                    },
                    active: {
                      fontSize: 14,
                      color: 'rgba(0,0,0,0.85)',
                      lineHeight: 20
                    }
                  },
                  emphasis: {// 中间文字显示
                    show: true
                  }
                },
                emphasis: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: [
                {
                  value: val.PassRate * 1,
                  name: '1',
                  itemStyle: {
                    normal: {
                      color: new this.echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: '#FAD337'
                      }, {
                        offset: 1,
                        color: '#FAD337'
                      }])
                    }
                  }
                }, {
                  value: 100 - val.PassRate * 1,
                  name: '2',
                  itemStyle: {
                    normal: {
                      color: new this.echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: '#F0F2F5'
                      }, {
                        offset: 1,
                        color: '#F0F2F5'
                      }])
                    }
                  }
                }
              ]
            // this.opt1SeriesData,
            }
          ]
        }
        // 低分率
        var obj4 = {
          color: ['#F0F2F5', '#1890FF'],
          grid: {
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            containLabel: true
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  color: 'rgba(0,0,0,0.3)',
                  formatter: '{total|低分率}' + '\n\r' + '{active|' + val.LowRate + '%}',
                  rich: {
                    total: {
                      fontSize: 12,
                      color: 'rgba(0,0,0,0.3)'
                    },
                    active: {
                      fontSize: 14,
                      color: 'rgba(0,0,0,0.85)',
                      lineHeight: 20
                    }
                  },
                  emphasis: {// 中间文字显示
                    show: true
                  }
                },
                emphasis: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: [
                {
                  value: val.LowRate * 1,
                  name: '1',
                  itemStyle: {
                    normal: {
                      color: new this.echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: '#36CFC9'
                      }, {
                        offset: 1,
                        color: '#36CFC9'
                      }])
                    }
                  }
                }, {
                  value: 100 - val.LowRate * 1,
                  name: '2',
                  itemStyle: {
                    normal: {
                      color: new this.echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: '#F0F2F5'
                      }, {
                        offset: 1,
                        color: '#F0F2F5'
                      }])
                    }
                  }
                }
              ]
            // this.opt1SeriesData,
            }
          ]
        }
        // that.$nextTick(function () {
        this.echarts.init(this.$refs.echart1).setOption(obj1)
        this.echarts.init(this.$refs.echart2).setOption(obj2)
        this.echarts.init(this.$refs.echart3).setOption(obj3)
        this.echarts.init(this.$refs.echart4).setOption(obj4)
      // })
      },
      // 区分度-得分率
      rateAndDistinctionRate (val) {
        var that = this
        this.$nextTick(() => {
          // 得分率
          var obj6 = {
            tooltip: {
              trigger: 'axis',
              formatter: (pt) => {
                return pt[0].axisValue + '<br/>' + pt[0].marker + pt[0].data
              }
            },
            grid: {
              left: '0',
              right: '0',
              top: '5%',
              bottom: '0',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#D9D9D9' // x轴颜色
                }
              },
              axisTick: {
                show: false// 不显示轴刻度
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: 'rgba(0,0,0,0.65)' // 坐标值得具体的颜色

                }
              },
              data: val.XData
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
              data: val.ObtainRate,
              type: 'bar',
              barMaxWidth: 25, // 最大宽度
              itemStyle: {
                normal: {
                  color: '#1890FF'
                }
              }
            }]
          }
          // 区分度
          var obj7 = {
            tooltip: {
              trigger: 'axis',
              formatter: (pt) => {
                return pt[0].axisValue + '<br/>' + pt[0].marker + pt[0].data
              }
            },
            grid: {
              left: '0',
              right: '0',
              top: '5%',
              bottom: '0',
              containLabel: true
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
              data: val.XData
            },
            yAxis: {
              type: 'value',
              splitLine: {
                show: true
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
              data: val.DistinctionRate,
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
            }]
          }

          that.give = that.echarts.init(that.$refs.echartGive)
          that.give.setOption(obj6)
          that.diff = that.echarts.init(that.$refs.echartDiff)
          that.diff.setOption(obj7)
        })
      },
      butValue (code, val) {
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
        if (!this.lodSore && this.soreStue) {
          this.sore.resize()
        }
        if (!this.lodDiff && this.giveStue) {
          this.give.resize()
          this.diff.resize()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "./css/GradeAnalyse.css";
</style>
