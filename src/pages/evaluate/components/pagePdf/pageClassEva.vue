<template>
  <div class='page-class-eva'>
    <div class="chart-wrap">
      <div class="chart1">
        <div class="chart1-box" ref="chart1" style="height: 220px;width:857px" ></div>
        <!-- <div class="chart1-box" style="height: 220px;width:857px">
          <img :src="imgSrc" alt="">
        </div> -->
      </div>
      <div class="charts">
        <div class="chart-small" v-for="(item, index) in charts" :key="index">
          <div class="chart2-tit" v-if="index !== 5">
            {{item.title}}
          </div>
          <div class="chart2" style="height: 180px;width:270px" ref="chart2" ></div>
          <!-- <div class="chart2" style="height: 180px;width:270px">
            <img :src="item.src" alt="">
          </div> -->
        </div>
         <div class="chart-small">
          <div class="chart-eva">
            综合评价: {{datas['等级']}}
          </div>
        </div>
      </div>
    </div>
    <div class="evalute-wrap">
      <div class="evalute-tit">
        德育成长课程评价
        <span v-show="datas['增值加分'] !== '0'">(增值加分：{{datas['增值加分']}}分)</span>
      </div>
      <div class="evaluete-txt">
        <span> {{datas.姓名}} </span>
        同学，你在北区学校德育成长课程中，表现较好的有
        <span> {{data3[0].name}} </span> 、
        <span> {{data3[1].name}} </span> 、
        <span> {{data3[2].name}} </span>
        等方面，给你点赞！
        <div v-if="isFine">
          同时，你仍需要在
           <span> {{data3[12].name}} </span>  、
           <span> {{data3[13].name}} </span>  、
           <span> {{data3[14].name}} </span>
          等内容加油提升。
        </div>
        希望你继续努力，成就更好的自己！
      </div>
    </div>
    <div class="page-num">
      <div class="count">3</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {
      studentInformationDatas: Array
    },
    data () {
      return {
        datas: [],
        data1: [],
        data2: [],
        data3: [],
        chartB: [
          {
            name: '爱国爱校重仪表',
            max: 100
            // axisLabel: { show: true }

          },
          {
            name: '科学作息爱劳动',
            max: 100
          },
          {
            name: '珍爱生命健身心',
            max: 100
          },
          {
            name: '自立自主爱学习',
            max: 100
          },
          {
            name: '尊师爱友善待人',
            max: 100
          }
        ],
        charts: [
          {
            title: '爱国爱校重仪表',
            src: '',
            datas: [
              {
                name: '升旗仪式',
                max: 100

              },
              {
                name: '着装仪表',
                max: 100
              },
              {
                name: '校园卫生',
                max: 100
              }
            ]
          },
          {
            title: '尊师爱友善待人',
            src: '',
            datas: [
              {
                name: '尊敬师长',
                max: 100

              },
              {
                name: '友爱同学',
                max: 100
              },
              {
                name: '举止文明',
                max: 100
              }
            ]
          },
          {
            title: '自立自主爱学习',
            src: '',
            datas: [
              {
                name: '用餐礼仪',
                max: 100

              },
              {
                name: '住宿礼仪',
                max: 100
              },
              {
                name: '自主学习',
                max: 100
              }
            ]
          },
          {
            title: '科学作息爱劳动',
            src: '',
            datas: [
              {
                name: '安全意识',
                max: 100

              },
              {
                name: '阳光体育',
                max: 100
              },
              {
                name: '眼保健操',
                max: 100
              }
            ]
          },
          {
            title: '珍爱生命健身心',
            src: '',
            datas: [
              {
                name: '热爱劳动',
                max: 100

              },
              {
                name: '劳逸结合',
                max: 100
              },
              {
                name: '热爱学习',
                max: 100
              }
            ]
          }
        ],
        isFine: true,
        imgSrc: '',
        evaluate: '',
        otherScore: ''
      }
    },
    created () {
      // console.log(this.studentInformationDatas)
      // 获取父组件数据
      this.datas = this.studentInformationDatas[0]
      // echarts 数据
      if (this.datas && this.datas.length !== 0) {
        this.otherScore = this.datas['增值加分']
        this.evaluate = this.datas['等级']
        this.chartB.map((item) => {
          let a = Number(this.datas[item.name])
          this.data1.push(a)
        })
        for (let i = 0; i < this.charts.length; i++) {
          let b = []
          this.charts[i].datas.map((item) => {
            let obj = {}
            let a = Number(this.datas[item.name])
            b.push(a)
            obj.name = item.name
            obj.num = a
            this.data3.push(obj)
          })
          this.data2.push(b)
        }
      }
      // 评价得分计算
      this.data3.sort((a, b) => {
        return b.num - a.num
      })
      if (this.data3[14].num === 10) {
        this.isFine = false
      } else {
        this.isFine = true
      }
    },
    mounted () {
      this.chart1()
      this.chart2()
    },
    methods: {
      chart1 () {
        const dom = this.$refs.chart1
        const myChart = this.echarts.init(dom)
        const option = {
          color: ['#5B8FF9', '#5AD8A6'],
          radar: {
            splitNumber: 4,
            center: ['50%', '60%'],
            radius: '70%',
            splitArea: {
              show: false
            },
            name: {
              textStyle: {
                color: 'rgb(0,0,0)',
                fontSize: 16
              }
            },
            indicator: this.chartB
          },
          series: [{
            type: 'radar',
            symbol: 'none',
            data: [
              {
                value: this.data1,
                areaStyle: {
                  normal: {
                    color: '#5B8FF9',
                    opacity: 0.2
                  }
                }
              }
            ]
          }]
        }
        myChart.setOption(option, true)
        setTimeout((async) => {
          var imgSrc = myChart.getDataURL()
          // 渲染到图表上面，遮住图表
          this.imgSrc = imgSrc
        }, 2000)
      },
      chart2 () {
        for (let a = 0; a < this.$refs.chart2.length; a++) {
          let dom = this.$refs.chart2[a]
          let myChart = this.echarts.init(dom)
          let option = {
            color: ['#5B8FF9', '#5AD8A6'],
            radar: {
              splitNumber: 4,
              center: ['50%', '60%'],
              radius: '70%',
              splitArea: {
                show: false
              },
              name: {
                textStyle: {
                  color: 'rgba(0,0,0,0.65)',
                  fontSize: 14
                }
              },
              indicator: this.charts[a].datas
            },
            series: [{
              type: 'radar',
              symbol: 'none',
              data: [
                {
                  value: this.data2[a],
                  areaStyle: {
                    normal: {
                      color: '#5B8FF9',
                      opacity: 0.2
                    }
                  }
                }
              ]
            }]
          }
          myChart.setOption(option, true)
          setTimeout((async) => {
            // 把echarts图片转成64编码的图片
            var imgSrc = myChart.getDataURL()
            // 渲染到图表上面，遮住图表
            this.charts[a].src = imgSrc
          }, 2000)
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.page-class-eva {
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/classEva/evaMegrezBg.png') no-repeat;
  background-size: 100% 100%;
  // padding: 313px 59px 0 72px;
  padding-top: 313px;
  position: relative;
}
.chart-wrap {
  padding: 0 59px 0 72px;
  .chart1, .chart-small {
    border: 2px solid #007abb;
    padding-top: 20px;
  }
  .chart1 {
    width: 856px;
    height: 312px;
    .chart1-tit {
      color: #595959;
      font-size: 30px;
      text-align: center;
    }
  }
  .charts {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .chart-small {
    width: 276px;
    height: 220px;
    margin-right: 13px;
    margin-top: 24px;
    align-items: center;
    .chart2-tit {
      margin-left: 13px;
      font-size: 16px;
      text-align: center;
    }
    .chart-eva {
      color: #EF8200;
      font-size: 26px;
      text-align: center;
      padding-top: 68px;
    }
  }
}
.evalute-wrap {
  margin-top: 40px;
  padding: 0 72px;
  .evalute-tit {
    font-size: 20px;
    color: #ef8200;
    font-weight: 500;
    padding-left: 34px;
    span {
      color: #000;
    font-size: 24px;
    }
  }
  .evaluete-txt {
    text-indent: 34px;
    font-size: 16px;
    line-height: 42px;
    color: #231916;
    >div {
      display: inline;
    }
  }
}
.page-num {
  position: absolute;
  bottom: 50px;
    width: 100%;
    height: 30px;
    background: url('./../../views/qualityReport/img/pageNum2.png') no-repeat;
    background-size: 100% 100%;
  .count{
    text-align: center;
    line-height: 30px;
  }
}
</style>
