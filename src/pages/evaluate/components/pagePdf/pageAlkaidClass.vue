//摇光星 社团课程
<template>
  <div class="page-merak">
      <div class="main">
        <div class="title">
          {{alkaidClass['选修课程']}}课程
        </div>
        <div class="titColors">
          <span v-for="(item, index) in colors" :key="index" :style="{background: item}"></span>
        </div>
        <div class="content">
          <div class="synopsis">
            <img v-for="img in alkaidClass.imgs" :key="img['社团图片']" v-show="img['图片类型'] === '1'" :src="img['社团图片']" alt="">
          </div>
          <div class="chart-tit">{{alkaidClass['选修课程']}}课程数据分析</div>
          <div class="charts">
            <div class="chart1" ref="chart1"></div>
            <div class="chart2" ref="chart2"></div>
          </div>
        </div>
        <div class="content-eva">
          综合评价：{{alkaidClass['综合等级']}}
        </div>
        <div class="page-num">
          <div class="count">{{pageObj['.pageAlkaid'] + index + 1}}</div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: ['studentInformationDatas', 'alkaidClass', 'pageObj', 'index'],
    data () {
      return {
        id: '',
        colors: [
          '#FFCA59', '#FF912B', '#E24956', '#8C103D', '#065280', '#34B2E3', '#64D1DA', '#6BDABC'
        ],
        currencyData: [],
        styleData: [],
        api: 'http://prod.dmapi.xiaoyangedu.com/openapi/output/studentReport'
      }
    },
    created () {
      if (this.studentInformationDatas.length) {
        this.id = this.studentInformationDatas[0]['学号']
      }
      // this.chart1()
      // this.chart2()
    },
    mounted () {
      // console.log(this.alkaidClass)
      this.getCurrencyData()
      this.getStyleData()
    },
    methods: {
      // 获取数据
      async getCurrencyData () {
        let res = await this.xy.get(`${this.api}/getAssociationCommon2`, {
          xuehao: this.id,
          kecheng: this.alkaidClass['选修课程']
        }, true)
        if (res.retCode === 100000) {
          this.currencyData = JSON.parse(res.retData)
          this.chart1()
        }
      },
      async getStyleData () {
        let res = await this.xy.get(`${this.api}/getAssociationPersonality2`, {
          xuehao: this.id,
          kecheng: this.alkaidClass['选修课程']
        }, true)
        if (res.retCode === 100000) {
          this.styleData = JSON.parse(res.retData)
          this.chart2()
        }
      },
      async chart1 () {
        this.$nextTick(function () {
          const dom = this.$refs.chart1
          const myChart = this.echarts.init(dom)
          // let names = this.currencyData
          // names.pop()
          let nameArr = []
          let data1 = []
          for (let i = 0; i < this.alkaidClass.left.length; i++) {
            nameArr.push({
              name: this.alkaidClass.left[i]['指标名称'],
              max: 100
            })
            data1.push(Number(this.alkaidClass.left[i]['分数']))
          }
          const option = {
            color: ['#5B8FF9'],
            title: {
              text: '项目实践指标',
              left: '35%',
              top: '3%'
            },
            radar: {
              splitNumber: 4,
              center: ['50%', '60%'],
              radius: '50%',
              splitArea: {
                show: false
              },
              name: {
                textStyle: {
                  color: 'rgb(0,0,0)',
                  fontSize: 14
                }
              },
              axisLine: {
                show: false
              },
              indicator: nameArr
            },
            series: [{
              type: 'radar',
              symbol: 'none',
              data: [
                {
                  value: data1,
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
          // console.log(option)
          myChart.setOption(option, true)
        })
      },
      async chart2 () {
        this.$nextTick(function () {
          let data = []
          let nameArr = []
          this.alkaidClass.right.map((item, index) => {
            nameArr.push(item['指标名称'])
            data.push({
              value: Math.floor(item['分数']),
              label: {
                show: false,
                position: 'outside'
              }
            })
          })
          const dom = this.$refs.chart2
          const myChart = this.echarts.init(dom)
          var option = {
            color: ['#3398DB'],
            title: {
              text: '项目成果指标',
              left: '35%',
              top: '3%'
            },
            // tooltip: {
            //   trigger: 'axis',
            //   axisPointer: { // 坐标轴指示器，坐标轴触发有效
            //     type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            //   }
            // },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: nameArr,
                axisLabel: {
                  interval: 0,
                  rotate: 45,
                  textStyle: {
                    fontSize: 12
                  },
                  formatter: function (value) {
                    var str = ''
                    var num = 10
                    var valLength = value.length
                    var rowNum = Math.ceil(valLength / num)
                    if (rowNum > 1) {
                      for (var i = 0; i < rowNum; i++) {
                        var temp = ''
                        var start = i * num
                        var end = start + num
                        temp = value.substring(start, end) + '\n'
                        str += temp
                      }
                      return str
                    } else {
                      return value
                    }
                  }
                }
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '直接访问',
                type: 'bar',
                barWidth: '20%',
                data: data
              }
            ]
          }
          // console.log(option)
          myChart.setOption(option)
        })
      }
    }
  }
</script>
<style lang='less' scoped>
.page-merak{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/alkaid/alkaidBg2.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  .main{
    padding-top: 202px;
    width: 100%;
    .title {
      text-align: center;
      color: #A5CB0D;
      font-size: 40px;
    }
    .titColors {
      height: 5px;
      text-align: center;
      span {
        line-height: 100%;
        display: inline-block;
        width: 54px;
        height: 5px;
      }
    }
  }
}
.content {
  padding-top: 52px;
  .synopsis {
    height: 600px;
    // padding: 0 135px;
    position: relative;
    // width: 860px;
    img {
      max-width: 860px;
      max-height: 600px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .chart-tit {
    margin: 10px 135px 22px;
    color: #fff;
    background: #095A8B;
    font-size: 32px;
    text-align: center;
  }
  .charts {
    padding: 0 135px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div {
      width: 362px;
      height: 277px;
      border: 1px solid #5b9bd5;
    }
    .chart1 {
      width: 343px;
    }
  }
}
.content-eva {
  width: 858px;
  color: #095A8B;
  font-size: 22px;
  margin: 16px auto 30px;
}
.page-num {
  width: 100%;
  height: 30px;
  background: url('./../../views/qualityReport/img/pageNum2.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: 50px;
  .count{
    text-align: center;
    line-height: 30px;
  }
}
</style>
