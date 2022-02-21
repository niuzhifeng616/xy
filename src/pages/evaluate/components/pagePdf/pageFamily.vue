<template>
  <div class='pageFamily'>
    <div class="title"></div>
    <div class="content"></div>
    <div class="data-box">
      <div class="chart1-box" ref="radar"></div>
      <div class="chart1-box" ref="bar"></div>
    </div>
    <div class="level">
      综合评价：{{level}}
    </div>
    <div class="page-num">
     <div class="count">{{pageObj['.pagePhecda']+3}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['familyRes', 'pageObj'],
    name: '',
    data () {
      return {
        arrRadar2: [],
        barArr2: [],
        imgArr2: [],
        level: ''
      }
    },
    created () {},
    mounted () {
      this.level = this.familyRes[0]['综评等级']

      let arr = Object.keys(this.familyRes[0])
      let index2 = 0
      let index3 = 0
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '分割') {
          index2 = i
        }
        if (arr[i] === '综评等级') {
          index3 = i
        }
      }
      let arrRadar = arr.slice(4, index2)
      let barArr = arr.slice(index2 + 1, index3)

      for (let i of arrRadar) {
        let obj = {}
        obj[i] = this.familyRes[0][i]
        this.arrRadar2.push(obj)
      }

      for (let i of barArr) {
        let obj = {}
        obj[i] = this.familyRes[0][i]
        this.barArr2.push(obj)
      }

      this.chart1()
      this.chart2()
    },
    methods: {
      chart1 () {
        const dom = this.$refs.radar
        const myChart = this.echarts.init(dom)
        let data1 = []
        let nameArr = []
        for (let item in this.arrRadar2) {
          for (var j in this.arrRadar2[item]) {
            nameArr.push({
              name: j,
              max: 20
            })
            data1.push(Number(this.arrRadar2[item][j]))
          }
        }
        nameArr[0].axisLabel = { show: true }
        nameArr[0].axisTick = { show: true }
        const option = {
          color: ['#5B8FF9', '#5AD8A6'],
          title: {
            text: '项目实践指标',
            left: '35%',
            top: '3%'
          },
          radar: {
            splitNumber: 4,
            center: ['50%', '50%'],
            radius: '50%',
            splitArea: {
              show: false
            },
            name: {
              textStyle: {
                color: 'rgb(0,0,0)',
                fontSize: 16
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
        myChart.setOption(option, true)
      },
      chart2 () {
        let data = []
        let nameArr = []
        for (let item in this.barArr2) {
          for (var j in this.barArr2[item]) {
            nameArr.push(j)
            data.push({
              value: Number(this.barArr2[item][j]),
              label: {
                show: true,
                position: 'outside'
              }
            })
          }
        }

        const dom = this.$refs.bar
        const myChart = this.echarts.init(dom)
        var option = {
          color: ['#3398DB'],
          title: {
            text: '项目成果指标',
            left: '35%',
            top: '3%'
          },
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
          xAxis: [
            {
              type: 'category',
              data: nameArr,
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                interval: 0
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
        myChart.setOption(option)
      }
    }
  }
</script>
<style lang='less' scoped>
.pageFamily{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/phecda/rootBg.png') no-repeat;
  background-size: 100% 100%;
  padding-top: 202px;
  position: relative;
}
  .title{
    width: 281px;
    height: 60px;
    background: url('./../../views/qualityReport/img/phecda/familyTitle.png') no-repeat;
    background-size: 100% 100%;
    margin: auto;
  }
  .content{
    width: 860px;
    height: 596px;
    margin: 50px 70px 0;
    background: url('./../../views/qualityReport/img/phecda/familyContent.png') no-repeat;
    background-size: 100% 100%;
  }
  .data-box{
    padding: 20px 70px 24px;
    .chart1-box{
      width: 408px;
      height: 340px;
      border: 1px solid #5b9bd5;
      background: #fff;
      display: inline-block;
    }
    .chart1-box:nth-child(1) {
      margin-right: 40px;
    }
  }
  .level{
    font-size: 22px;
    color: #095a8b;
    line-height: 30px;
    letter-spacing: 2px;
    font-weight: 500;
    width: 860px;
    padding-left: 70px;
    padding-bottom: 30px;
  }
   .chart1 {
    width: 856px;
    height: 312px;
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
