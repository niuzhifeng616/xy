//玉衡星课程
<template>
  <div class="page-three">
    <div class="main">
      <div class="img">
        <h3>
          <span v-if="all.length !== 0">{{all[0].学科}}成果展示</span>
        </h3>
        <div class="color-span">
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="radar" v-if="dataAll.api === 'getPsychology2'">
          <div ref="radarLeft" style="width: 856px;height:800px;border:2px solid #007ABB;" ></div>
        </div>
        <img :src="all[0].成果展示" alt="" v-else-if="all.length !== 0">
      </div>
      <div class="page-num">
        <div class="count">{{pageObj['.pageAlioth']+index + 2}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {
      dataAll: Object,
      studentInformationDatas: Array,
      pageObj: Object,
      index: Number
    },
    data () {
      return {
        api: 'http://prod.dmapi.xiaoyangedu.com/openapi/output/studentReport/',
        id: 0,
        all: [],
        radarLeftNames: [],
        radar: [],
        myData1: []
      }
    },
    created () {
      if (this.studentInformationDatas.length) {
        this.id = this.studentInformationDatas[0]['学号']
        this.getData()
        this.getPsyData()
      }
    },
    methods: {
      async getData () {
        let res = await this.xy.get(`${this.api}` + this.dataAll.api, {
          xuehao: this.id
        }, true)
        if (res.retCode === 100000) {
          this.all = JSON.parse(res.retData)
        }
      },
      setRadar () {
        if (this.radarLeftNames.length !== 0) {
          const dom = this.$refs.radarLeft
          const myChart = this.echarts.init(dom)
          const option = {
            color: ['#5B8FF9', '#5AD8A6'],
            legend: {
              data: [this.radar[0]['姓名']],
              top: '13%'
            },
            radar: {
              center: ['50%', '62%'],
              radius: '60%',
              splitArea: {
                show: false
              },
              indicator: this.radarLeftNames,
              name: {
                textStyle: {
                  color: 'rgba(0,0,0,0.45)'
                },
                formatter: function (params, indicator) {
                  let strlength = params.length
                  if (strlength % 2 === 1) {
                    params = params.replace(/\S{4}/g, function (match) {
                      return match + '\n'
                    })
                  } else {
                    params = params.replace(/\S{4}/g, function (match) {
                      return match + '\n'
                    })
                  }
                  return params
                }
              }
            },
            series: [{
              type: 'radar',
              data: [
                {
                  value: this.myData1,
                  name: this.radar[0]['姓名']
                }
              ]
            }]
          }
          myChart.setOption(option, true)
        }
      },
      async getPsyData () {
        let res = await this.xy.get(`${this.api}getPsychologyChart2`, {
          xuehao: this.id
        }, true)
        if (res.retCode === 100000) {
          this.radar = JSON.parse(res.retData)
          let start = Object.keys(this.radar[0]).indexOf('学科')
          // 指标项
          let list1 = Object.keys(this.radar[0]).slice(start + 1)
          list1.map((item, index) => {
            this.myData1.push(Number(this.radar[0][item]))
            this.radarLeftNames.push({
              name: item
            })
          })
          this.setRadar()
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.page-three{
  width: 100%;
  height: 100%;
  background: url('../../views/qualityReport/img/dubhe/bgc.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  .main{
    padding-top:156px;
    background: url('../../views/qualityReport/img/alioth/aliothLogo.png') no-repeat 71px 68px;
    background-size: 72px 72px;
    h3{
      height: 36px;
      font-size: 42px;
      font-weight: 600;
      color: #027ABB;
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
    img {
      margin: 60px 70px 0;
      width: 856px;
      height: 1000px;
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
    .radar{
      width: 100%;
      padding: 30px 85px 0;
      >div {
        display: inline-block;
      }
      .left{
        padding-right: 20px;
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
</style>
