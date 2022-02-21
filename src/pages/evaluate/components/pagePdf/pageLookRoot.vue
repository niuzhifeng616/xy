<template>
  <div class='lookRoot'>
    <div class="top">
      <h3>
        <span v-if="phecdaRes">{{phecdaRes.name}}</span>
      </h3>
      <div class="color-span">
        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
     </div>
    <div class="content">
      <img v-if="phecdaResImg" :src="phecdaResImg.课程介绍图片" alt="">
    </div>
    <div class="data-box">
      <div class="chart1-box" ref="radar"></div>
      <div class="chart1-box" ref="bar">
        <span class="level">
          综合评价：{{phecdaRes.level}}
        </span>
      </div>
    </div>
    <div class="page-num">
     <div class="count" v-if="index === 0">{{pageObj['.pagePhecda']+1}}</div>
     <div class="count" v-else>{{pageObj['.pagePhecda']+1*(index + 1) + index}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['phecdaRes', 'pageObj', 'index', 'phecdaResImg'],
    name: '',
    data () {
      return {
        arrRadar2: [],
        barArr2: [],
        imgArr2: [],
        level: ''
      }
    },
    created () {

    },
    mounted () {
      // this.$nextTick((async) => {
      //   this.getData()
      // }
      this.chart1()
    },
    methods: {
      chart1 () {
        this.$nextTick(function () {
          const dom = this.$refs.radar
          const myChart = this.echarts.init(dom)
          let data1 = []
          let nameArr = []
          for (let i = 0; i < this.phecdaRes.arr.length; i++) {
            nameArr.push({
              name: this.phecdaRes.arr[i].指标名称,
              max: 100
            })
            data1.push(Number(this.phecdaRes.arr[i].折算分))
          }
          // console.log(nameArr)
          const option = {
            color: ['#5B8FF9', '#5AD8A6'],
            title: {
              text: '项目实践指标',
              left: '35%',
              top: '3%'
            },
            radar: {
              splitNumber: 4,
              center: ['50%', '55%'],
              radius: '50%',
              splitArea: {
                show: false
              },
              name: {
                textStyle: {
                  color: 'rgb(0,0,0)',
                  fontSize: 16
                },
                formatter: function (value) {
                  var str = ''
                  var num = 6
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
        })
      }
    }
  }
</script>
<style lang='less' scoped>
  .lookRoot{
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
    background: url('./../../views/qualityReport/img/phecda/rootTitle.png') no-repeat;
    background-size: 100% 100%;
    margin: auto;
  }
  .content{
    width: 860px;
    height: 596px;
    margin: 50px 70px 0;
    position: relative;
    img {
      max-width: 100%;
      max-height: 596px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .data-box{
    padding: 20px 70px 24px;
    display: flex;
    align-items: center;
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
    .chart1-box:nth-child(2) {
      text-align: center;
    }
  }
  .level{
    font-size: 22px;
    color: #095a8b;
    line-height: 30px;
    font-weight: 500;
    display: inline-block;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
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
  h3{
    font-size: 42px;
    font-weight: 600;
    color: #FA4655;
    line-height: 36px;
    text-align: center;

  }
  .color-span{
    height: 6px;
    margin: 10px 0;
    text-align: center;
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
</style>
