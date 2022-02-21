//图表
<template>
  <div class="page-three">
    <div class="main">
      <h3>
        <span>1.</span>
        <span>语文学科</span>
      </h3>
      <h4>（评价量表（习惯+学科）+知识点雷达图+成绩曲线图曲线图）</h4>
      <div class="radar">
        <div class="left">
          <div ref="radarLeft" style="width: 350px;height:350px;"></div>
          <div class="zhibiao">习惯指标</div>
        </div>
        <div class="right">
          <div ref="radarRight" style="width: 350px;height:350px;"></div>
          <div class="zhibiao">学科素养指标</div>
        </div>
      </div>
      <div class="bar">
        <div ref="barEchart" style="width: 815px;height:400px;"></div>
      </div>
      <div class="content-text">
        <h5>学科个性化评语：</h5>
        <div>小明同学：在语文课堂学习中，在积极回答问题、遵守课堂纪律方面做得不错，希望再接再厉，在完成基延作业、及时 订正作业方面需要加强。</div>
        <div>在学科素养方面，自信表达是你的优势，但是在写作方面是你的劣势。</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        radarLeft: null,
        radarRight: null,
        barEchart: null,
        radarLeftNames: [
          {
            name: '',
            max: 10
          },
          {
            name: '自我总结',
            max: 10
          },
          {
            name: '资研探讨',
            max: 10
          },
          {
            name: '资研探讨',
            max: 10
          },
          {
            name: '课堂表达',
            max: 10
          },
          {
            name: '合作探究',
            max: 10
          },
          {
            name: '听讲状态',
            max: 10
          },
          {
            name: '错题搜集',
            max: 10
          },
          {
            name: '自主学习',
            max: 10
          }
        ],
        radarRightNames: [
          {
            name: '前置学习',
            max: 10,
            axisLabel: { show: true },
            axisTick: { show: true }
          },
          {
            name: '自我总结',
            max: 10
          },
          {
            name: '资研探讨',
            max: 10
          },
          {
            name: '资研探讨',
            max: 10
          },
          {
            name: '课堂表达',
            max: 10
          },
          {
            name: '合作探究',
            max: 10
          },
          {
            name: '听讲状态',
            max: 10
          },
          {
            name: '错题搜集',
            max: 10
          },
          {
            name: '自主学习',
            max: 10
          }
        ]
      }
    },
    created () {
      this.setRadar()
      this.setRadar1()
      this.setbarEchart()
      // this.setRadar(this.echarts.init(this.$refs.radarLeft), this.option)
      // this.echarts.init(this.$refs.radarLeft).setOption(this.option)
    },
    mounted () {},
    methods: {
      setRadar (myChart, option) {
        // myChart.setOption(option)
        let that = this
        that.$nextTick(function () {
          that.radarLeft = this.echarts.init(this.$refs.radarLeft)
          option = {
            color: ['#5B8FF9', '#5AD8A6'],
            tooltip: {},
            legend: {
              data: ['小明的习惯养成', '平均值']
            },
            radar: {
              // shape: 'circle',
              center: ['55%', '45%'],
              radius: '60%',
              splitArea: {
                show: false
              },
              name: {
                textStyle: {
                  color: 'rgba(0,0,0,0.45)'
                }
              },
              indicator: this.radarRightNames
            },
            series: [{
              type: 'radar',
              // areaStyle: {normal: {}},
              data: [
                {
                  value: [4, 1, 2, 3, 5, 1, 5, 6, 8],
                  name: '小明的习惯养成'
                },
                {
                  value: [6, 1, 4, 3, 5, 1, 7, 6, 9],
                  name: '平均值'
                }
              ]
            }]
          }
          that.radarLeft.setOption(option)
        })
      },
      setRadar1 (myChart, option) {
        // myChart.setOption(option)
        let that = this
        that.$nextTick(function () {
          that.radarRight = this.echarts.init(this.$refs.radarRight)
          option = {
            color: ['#5B8FF9', '#5AD8A6'],
            tooltip: {},
            legend: {
              data: ['小明的知识积累', '平均值']
            },
            radar: {
              // shape: 'circle',
              center: ['45%', '45%'],
              radius: '60%',
              splitArea: {
                show: false
              },
              name: {
                textStyle: {
                  color: 'rgba(0,0,0,0.45)'
                }
              },
              indicator: this.radarRightNames
            },
            series: [{
              type: 'radar',
              // areaStyle: {normal: {}},
              data: [
                {
                  value: [4, 1, 2, 3, 5, 1, 5, 6, 8],
                  name: '小明的知识积累'
                },
                {
                  value: [6, 1, 4, 3, 5, 1, 7, 6, 9],
                  name: '平均值'
                }
              ]
            }]
          }
          that.radarRight.setOption(option)
        })
      },
      setbarEchart (myChart, option) {
        let that = this
        that.$nextTick(function () {
          that.barEchart = this.echarts.init(this.$refs.barEchart)
          option = {
            color: ['#5B8FF9', '#EF8200', '#73DEB3'],
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['小明', '班级均分', '年级均分'],
              top: '94%',
              itemWidth: 14,
              itemHeight: 14,
              textStyle: {
                fontSize: 16
              }
            },
            calculable: true,
            xAxis: [
              {
                type: 'category',
                data: ['月考', '期中', '期末'],
                axisTick: {
                  lineStyle: {
                    width: 0
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: 'rgba(0,0,0,0.45)'
                  }
                },
                axisLabel: {
                  fontSize: 16,
                  color: 'rgba(0, 0, 0, 0.85)'
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                splitLine: {
                  show: true,
                  interval: 2,
                  lineStyle: {
                    type: 'dashed'
                  }
                }
              }
            ],
            series: [
              {
                name: '小明',
                type: 'bar',
                data: [60, 110, 100]
              },
              {
                name: '班级均分',
                type: 'bar',
                data: [100, 100, 90]
              },
              {
                name: '年级均分',
                type: 'bar',
                data: [100, 90, 110]
              }
            ]
          }
          that.barEchart.setOption(option)
        })
      }
    }
  }
</script>
<style lang='less' scoped>
.page-three{
  width: 100%;
  height: 100%;
  position: relative;
  background: url('./../../views/qualityReport/img/bg1.png') no-repeat;
  background-size: 100% 100%;
  .main{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top:186px;
    h3{
      font-size: 36px;
      font-weight: 600;
      color: #007ABB;
    }
    h4{
      font-size: 28px;
      color: #595757;
      margin-top:10px;
    }
    .radar{
      width: 100%;
      display: flex;
      justify-content: space-around;
      margin-top:75px;
      .left{
        position: relative;
        .zhibiao{
          width: 178px;
          height: 27px;
          background: #007abb;
          border-radius: 3px;
          color: #fff;
          text-align: center;
          font-size: 17px;
          position: absolute;
          bottom: -30px;
          left: 130px;
        }
      }
      .right{
        position: relative;
        .zhibiao{
          width: 178px;
          height: 27px;
          background: #007abb;
          border-radius: 3px;
          color: #fff;
          text-align: center;
          font-size: 17px;
          position: absolute;
          bottom: -30px;
          left: 100px;
        }
      }
    }
    .bar{
      margin-top: 40px;
    }
    .content-text{
      margin-top:20px;
      padding: 0 75px;
      h5{
        color:#8FB203;
        font-size: 20px;
        font-weight: 600;
      }
      div{
        color: #3E3A39;
        margin-top: 15px;
        font-size: 16px;
      }
    }
  }
}
</style>
