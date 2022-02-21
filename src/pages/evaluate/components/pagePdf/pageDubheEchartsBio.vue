
//天枢星
<template>
  <div class="page-three">
    <div class="main">
      <h3>
        <span>{{this.dataAll[0]['学科']}}国家课程</span>
      </h3>
      <div class="color-span">
        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="radar">
        <div class="left">
          <div class="zhibiao">习惯指标</div>
          <div ref="radar" style="width: 400px;height:400px;border:2px solid #007ABB;" v-show="false"></div>
          <div style="width: 400px;height:400px;border:2px solid #007ABB;">
            <img :src="imgSrc1" alt="">
          </div>
        </div>
        <div class="right">
          <div class="zhibiao">学科素养指标</div>
          <div ref="radar2" style="width: 400px;height:400px;border:2px solid #007ABB;" v-show="false"></div>
          <div style="width: 400px;height:400px;border:2px solid #007ABB;">
            <img :src="imgSrc2" alt="">
          </div>
        </div>
      </div>
        <div class="bar">
        <div ref="barEchart" style="width: 820px;height:430px;border:2px solid #007ABB;" v-show="false"></div>
        <div style="width: 820px;height:430px;border:2px solid #007ABB;">
          <img :src="imgSrc3" alt="">
        </div>
      </div>
       <!--<div class="chart1-box" ref="radar" style="height: 220px;width:857px" v-show="false"></div>
        <div class="chart1-box" style="height: 220px;width:857px">
          <img :src="imgSrc" alt="">
        </div>
-->
    <div class="content-text">
      <h5>学科综合评价：<span class="grade">{{this.dataAll[0]['综合评价'] ? this.dataAll[0]['综合评价'] : '--'}}</span>(等级)</h5>
      <div class="text">
        <span class="text-name">{{dataAll[0]['姓名']}}</span>同学，经过一学期的努力，在学习过程中，
         <ul class="text-lists1">
           <li>{{subjectEvaluation[0]}}</li> 、
         </ul>
          <ul class="text-lists1">
           <li>{{subjectEvaluation[1]}}</li>
         </ul>  等方面表现优异，为你点赞；
         <ul class="text-lists2">
           <li>{{subjectEvaluation[subjectEvaluation.length-2]}}</li> 、
         </ul>
          <ul class="text-lists2">
           <li>{{subjectEvaluation[subjectEvaluation.length-1]}}</li>
         </ul>
         方面还需改进，期待你的改变。
      </div>

    </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {
      dataAll: Array
    },
    data () {
      return {
        arrRadar2: [],
        arrRadar3: [],
        imgSrc1: '',
        imgSrc2: '',
        imgSrc3: '',
        subjectEvaluation: [],
        valueData1: [],
        seriessubjectValueData: []
      }
    },
    created () {

    },
    mounted () {
      let arr = Object.keys(this.dataAll[0])
      let index2 = 0
      let data3 = []
      let data4 = []
      let data5 = []
      let data6 = []
      let indexBar1 = 0
      let indexBar2 = 0
      for (let i = 0; i < arr.length; i++) {
        this.valueData1.push(Number(this.dataAll[0][arr[i]]))
        if (arr[i] === '分割') {
          index2 = i
        }
        if (arr[i] === '生物期中') {
          indexBar1 = i
        }
        if (arr[i] === '生物期末') {
          indexBar2 = i
        }
      }
      let arrBar1 = arr.slice(indexBar1 + 1, indexBar2)
      let arrBar2 = arr.slice(indexBar2 + 1)
      for (let i of arrBar1) {
        let obj = {}
        obj[i] = this.dataAll[0][i]
        // this.arrRadar2.push(obj)
        data5.push({ name: i, value: this.dataAll[0][i] })
      }
      for (let i of arrBar2) {
        let obj = {}
        obj[i] = this.dataAll[0][i]
        // this.arrRadar2.push(obj)
        data6.push({ name: i, value: this.dataAll[0][i] })
      }
      // 七年级
      this.seriessubjectValueData.push([data5[0], data6[0]], [data5[1], data6[1]], [data5[2], data5[2]], [data5[3], data5[3]])
      let arrRadar = arr.slice(5, index2)
      for (let i of arrRadar) {
        let obj = {}
        obj[i] = this.dataAll[0][i]
        this.arrRadar2.push(obj)
        data3.push({ name: i, value: this.dataAll[0][i] })
      }
      this.chart1()
      let arr2 = Object.keys(this.dataAll[1])
      let index3 = 0
      let index4 = 0
      for (let i = 0; i < arr2.length; i++) {
        if (arr2[i] === '分割') {
          index3 = i
        }
        if (arr2[i] === '总分') {
          index4 = i
        }
      }
      let arrRadar2 = arr2.slice(index3 + 1, index4)
      for (let i of arrRadar2) {
        let obj = {}
        // let obj1 = {}
        obj[i] = this.dataAll[0][i]
        this.arrRadar3.push(obj)

        data4.push({ name: i, value: this.dataAll[0][i] })
      }

      this.getData()

      let compirArr = data3.concat(data4)
      compirArr.sort((a, b) => {
        if (a.value < b.value) {
          return 1
        } else {
          return -1
        }
      })
      for (let i of compirArr) {
        this.subjectEvaluation.push(i.name)
      }
      this.chart2()
    },
    methods: {
      getData () {

      },
      chart1 () {
        const dom = this.$refs.radar
        const myChart = this.echarts.init(dom)
        let data1 = []
        let nameArr = []
        for (let item in this.arrRadar2) {
          for (var j in this.arrRadar2[item]) {
            nameArr.push({
              name: j,
              max: 40
            })
            data1.push(Number(this.arrRadar2[item][j]))
          }
        }
        const option = {
          color: ['#5B8FF9', '#5AD8A6'],
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
        setTimeout((async) => {
          var imgSrc = myChart.getDataURL()
          // 渲染到图表上面，遮住图表
          this.imgSrc1 = imgSrc
        }, 2000)
      },
      chart2 () {
        const dom = this.$refs.radar2
        const myChart = this.echarts.init(dom)
        let data1 = []
        let nameArr = []
        for (let item in this.arrRadar3) {
          for (var j in this.arrRadar3[item]) {
            nameArr.push({
              name: j,
              max: 100
            })
            data1.push(Number(this.arrRadar3[item][j]))
          }
        }
        const option = {
          color: ['#5B8FF9', '#5AD8A6'],
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
        setTimeout((async) => {
          var imgSrc = myChart.getDataURL()
          // 渲染到图表上面，遮住图表
          this.imgSrc2 = imgSrc
        }, 2000)
      }
    }
  }
</script>
<style lang='less' scoped>
.page-three{
  width: 100%;
  height: 100%;
  position: relative;
  background: url('./../../views/qualityReport/img/dubhe/bgc.png') no-repeat;
  background-size: 100% 100%;
  .main{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top:156px;
    h3{
      font-size: 42px;
      font-weight: 600;
      color: #007ABB;
      line-height: 36px;
    }
    .color-span{
      height: 6px;
      margin: 10px 0;
      span{
        width: 40px;
        height: 6px;
      }
      span:nth-child(1){
        display: inline-block;
        background: #F5C45B;
      }
      span:nth-child(2){
        display: inline-block;
        background: #F08C33;
      }
      span:nth-child(3){
        display: inline-block;
        background: #D44953;
      }
      span:nth-child(4){
        display: inline-block;
        background: #851C3C;
      }
      span:nth-child(5){
        display: inline-block;
        background: #084F7A;
      }
      span:nth-child(6){
        display: inline-block;
        background: #3AA7D3;
      }
      span:nth-child(7){
        display: inline-block;
        background: #66C3CC;
      }
      span:nth-child(8){
        display: inline-block;
        background: #72C3AD;
      }
    }
    .radar{
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top:30px;
      .left{
        padding-right: 22px;
        position: relative;
        .radarLeft{
          border:1px solid #007ABB;
        }
        .zhibiao{
          width: 178px;
          height: 27px;
          border-radius: 3px;
          color: #666;
          text-align: center;
          font-size: 17px;
          position: absolute;
          top: 15px;
          left: 106px;
        }
      }
      .right{
        position: relative;
        .zhibiao{
          width: 178px;
          height: 27px;
          border-radius: 3px;
          color: #666;
          text-align: center;
          font-size: 17px;
          position: absolute;
          top: 15px;
          left: 106px;
        }
      }
    }
    .bar{
      margin-top: 20px;
    }
    .content-text{
      width: 100%;
      margin-top:30px;
      padding: 0 50px;
      line-height: 46px;
      h5{
        color:#00A0E8;
        font-size: 20px;
        font-weight: 600;
        margin-left: 50px;
        .grade{
          display: inline-block;
          min-width: 100px;
          border-bottom: 3px solid #00A0E8;
          text-align: center;
          line-height: 20px;
        }
      }
      div{
        color: #3E3A39;
        margin-top: 5px;
        font-size: 20px;
      }
      .text{
        .text-name{
          color:#00A0E8;
          display: inline-block;
          min-width: 100px;
          text-align: center;
          border-bottom: 3px solid #00A0E8;
          line-height: 19px;
          margin-left: 50px;
        }
        .text-lists1,.text-lists2{
          display: inline-block;
          li{
            color:#00A0E8;
            display: inline-block;
            min-width: 100px;
            text-align: center;
            border-bottom: 3px solid #00A0E8;
            margin-left: 10px;
            line-height: 20px;
          }
        }
      }
    }
  }
}
</style>
