//玉衡星课程
<template>
  <div class="page-three">
    <div class="main">
      <h3>
        <span>{{dataAll.name}}</span>
      </h3>
      <div class="color-span">
        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="radar">
        <div class="left">
          <div class="zhibiao">习惯养成指标</div>
          <div ref="radarLeft" style="width: 400px;height:400px;border:2px solid #007ABB;" ></div>
        </div>
        <div class="right">
          <div class="zhibiao">学科素养指标</div>
          <div ref="radarRight" style="width: 400px;height:400px;border:2px solid #007ABB;"></div>
        </div>
      </div>
      <div class="bar">
        <!-- <div ref="bar" v-if="dataAll.api === 'getPsychology2'"></div> -->
        <div v-if="dataAll.img.length" class="imgs">
          <img :src="dataAll.img[0]['图片地址']" alt="">
        </div>
        <div v-else-if="dataAll['学科'] === '心理' && dataAll['成绩'] !== null" class="imgs">
          <img src="@/pages/evaluate/views/qualityReport/img/xinlibg.png" alt="">
        </div>
        <div v-else-if="dataAll['学科'] === '体育'">
          <div class="tiyu-top">
            <div>
              <div>
                <img src="@/pages/evaluate/views/qualityReport/img/shengao.svg" alt="">
              </div>
              <div>
                <p>身高</p>
                <span>{{ dataAll.sport['身高'] }}cm</span>
              </div>
            </div>
            <div>
              <div>
                <img src="@/pages/evaluate/views/qualityReport/img/tizhong.svg" alt="">
              </div>
              <div>
                <p>体重</p>
                <span>{{ dataAll.sport['体重'] }}kg</span>
              </div>
            </div>
            <div>
              <div>
                <img src="@/pages/evaluate/views/qualityReport/img/bmi.svg" alt="">
              </div>
              <div>
                <p>BMI <span>(13.5 ≤ 正常 ≤ 18.2)</span></p>
                <span>{{ dataAll.sport['体重指数（BMI）'] }}kg/m²|正常</span>
              </div>
            </div>
          </div>
          <div class="tiyu-bottom" ref="tiyuRadar" style="width: 800px; height:380px;"></div>
        </div>
        <!-- <div v-else-if="dataAll['学科'] === '心理' && dataAll['成绩'] !== null" ref="barEchart">小学</div> -->
        <div v-else-if="dataAll['学科'] === '心理' && dataAll['成绩'] === null" ref="barEchart">初中</div>
      </div>
      <div class="content-text">
        <h5 style="color: #ef8200;">学科综合评价：<span class="grade">{{dataAll['等级']}}</span>(等级)</h5>
        <div class="text"><span class="text-name">{{dataAll['姓名']}}</span>同学，经过一学期的努力，在学习过程中，
         <ul class="text-lists1">
           <li>{{ dataAll.dataArr[0]['指标名称'] }}</li> 、
           <li>{{ dataAll.dataArr[1]['指标名称'] }}</li>
         </ul>
         等方面表现优异，为你点赞；
         <ul class="text-lists2">
           <li>{{ dataAll.dataArr[dataAll.dataArr.length-1]['指标名称'] }}</li> 、
           <li>{{ dataAll.dataArr[dataAll.dataArr.length-2]['指标名称'] }}</li>
         </ul>
         方面还需改进，期待你的改变。
        </div>
      </div>
      <div class="page-num">
        <div class="count">{{pageObj['.pageAlioth']+index + 1}}</div>
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
        evaluate: {},
        radarLeftNames: [],
        radarRightNames: [],
        barNames: [],
        all: [],
        myData1: [],
        myData2: [],
        myData3: [],
        allData1: [],
        allData2: [],
        subject: [],
        evaList: [],
        radar: [],
        // echarts pdf
        id: 0,
        api: 'http://prod.dmapi.xiaoyangedu.com/openapi/output/studentReport/'
      }
    },
    created () {
      // if (this.studentInformationDatas.length) {
      //   this.id = this.studentInformationDatas[0]['学号']
      //   this.getData()
      //   if (this.id.slice(0, 3) === 207) {
      //     this.getPsyData()
      //   }
      // }
    },
    watch: {
      // all () {
      //   this.setRadar()
      //   this.setRadar1()
      //   // this.setbarEchart()
      // }
    },
    mounted () {
      this.setRadar()
      this.setRadar1()
      this.setTiyu()
      this.dataAll['成绩'] ? this.setbarEchart() : this.setRadar3()
      // console.log(this.dataAll, this.dataAll['学科'])
    },
    methods: {
      async getData () {
        let res = await this.xy.get(`${this.api}` + this.dataAll.api, {
          xuehao: this.id
        }, true)
        if (res.retCode === 100000) {
          this.all = JSON.parse(res.retData)
          // 截取数组
          let start
          if (this.dataAll.api === 'getArt2') {
            start = Object.keys(this.all[0]).indexOf('准备物品') - 1
          } else {
            start = Object.keys(this.all[0]).indexOf('学科')
          }
          let division = Object.keys(this.all[0]).indexOf('分割')
          let end = Object.keys(this.all[0]).indexOf('期末成绩')
          // 指标项
          let list1 = Object.keys(this.all[0]).slice(start + 1, division)
          let list2 = Object.keys(this.all[0]).slice(division + 1, end)
          let list3 = Object.keys(this.all[0]).slice(-6, -1)
          list1.map((item, index) => {
            this.myData1.push(Number(this.all[0][item]))
            if (this.all.length > 1) {
              this.allData1.push(Number(this.all[1][item]))
            }
            this.evaList.push({
              name: item,
              score: Number(this.all[0][item])
            })
            if (index === 0) {
              this.radarLeftNames.push({
                name: item
                // max: this.dataAll.left,
                // axisLabel: { show: true },
                // axisTick: { show: true }
              })
            } else {
              this.radarLeftNames.push({
                name: item
                // max: this.dataAll.left
              })
            }
          })
          list2.map((item, index) => {
            this.myData2.push(Number(this.all[0][item]))
            if (this.all.length > 1) {
              this.allData2.push(Number(this.all[1][item]))
            }
            if (index === 0) {
              this.radarRightNames.push({
                name: item
                // max: this.dataAll.right,
                // axisLabel: { show: true },
                // axisTick: { show: true }
              })
            } else {
              this.radarRightNames.push({
                name: item
                // max: this.dataAll.right
              })
            }
          })
          list3.map((item, index) => {
            this.subject.push(Number(this.all[0][item]))
          })
          for (var i = 0; i < this.evaList.length - 1; i++) {
            for (var j = 0; j < this.evaList.length - i - 1; j++) {
              if (this.evaList[j].score < this.evaList[j + 1].score) {
                var temp = this.evaList[j]
                this.evaList[j] = this.evaList[j + 1]
                this.evaList[j + 1] = temp
              }
            }
          }
        }
      },
      setRadar () {
        // console.log(this.dataAll, this.dataAll['学科'])
        this.$nextTick(function () {
          let myChart = this.echarts.init(this.$refs.radarLeft)
          let fromData1 = this.dataAll.left1
          let fromData2 = this.dataAll.left2
          for (let i = 0; i < fromData1.length; i++) {
            this.radarLeftNames.push({
              name: fromData1[i]['指标名称'],
              max: 100
            })
            this.myData1.push(fromData1[i]['分数'])
          }
          for (let i = 0; i < fromData2.length; i++) {
            this.allData1.push(fromData2[i]['分数'])
          }
          // console.log(this.radarLeftNames, this.myData1, this.allData1)
          const option = {
            color: ['#5AD8A6', '#5B8FF9'],
            legend: {
              data: ['平均值', this.dataAll['姓名']],
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
                  value: this.allData1,
                  name: '平均值'
                },
                {
                  value: this.myData1,
                  name: this.dataAll['姓名']
                }
              ]
            }]
          }
          myChart.setOption(option, true)
        })
      },
      setRadar1 () {
        this.$nextTick(function () {
          let myChart = this.echarts.init(this.$refs.radarRight)
          let fromData1 = this.dataAll.right1
          let fromData2 = this.dataAll.right2
          for (let i = 0; i < fromData1.length; i++) {
            this.radarRightNames.push({
              name: fromData1[i]['指标名称'],
              max: 100
            })
            this.myData2.push(fromData1[i]['分数'])
          }
          for (let i = 0; i < fromData2.length; i++) {
            this.allData2.push(fromData2[i]['分数'])
          }
          const option = {
            color: ['#5AD8A6', '#5B8FF9'],
            // tooltip: {},
            legend: {
              data: ['平均值', this.dataAll['姓名']],
              top: '13%'
            },
            radar: {
              center: ['50%', '62%'],
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
              data: [
                {
                  value: this.allData2,
                  name: '平均值'
                },
                {
                  value: this.myData2,
                  name: this.dataAll['姓名']
                }
              ]
            }]
          }
          myChart.setOption(option, true)
        })
      },
      // 体育图
      setTiyu () {
        this.$nextTick(function () {
          let myChart = this.echarts.init(this.$refs.tiyuRadar)
          let dataX = []
          dataX = this.dataAll.sportData.map((item) => {
            return {
              name: `${item['项目名称']}\n${item['合格标准']}\n等级:${item['等级']}`,
              max: 100
            }
          })
          let dataY1 = []
          dataY1 = this.dataAll.sportData.map((item) => {
            return item['分数']
          })
          const option = {
            color: ['#5B8FF9', '#5AD8A6'],
            // tooltip: {},
            // legend: {
            //   data: [this.dataAll['姓名']],
            //   top: '13%'
            // },
            radar: {
              center: ['50%', '52%'],
              radius: '50%',
              splitArea: {
                show: false
              },
              name: {
                textStyle: {
                  color: '#333',
                  fontWeight: 'bold'
                }
              },
              indicator: dataX
            },
            series: [{
              type: 'radar',
              data: [
                {
                  value: dataY1,
                  name: this.dataAll['姓名']
                }
              ]
            }]
          }
          myChart.setOption(option, true)
        })
      },
      setbarEchart () {
        const dom = this.$refs.barEchart
        const myChart = this.echarts.init(dom)
        const option = {
          title: {
            text: '学科终结性评价',
            left: '40%',
            top: '3%'
          },
          color: ['#5B8FF9', '#EF8200', '#73DEB3', '#3AA7D3', '#D44953'],
          // tooltip: {
          //   trigger: 'axis'
          // },
          legend: {
            data: ['个人得分', '班级平均分', '班级最高分', '年级平均分', '年级最高分'],
            top: '90%',
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
              name: '个人得分',
              type: 'bar',
              barWidth: 40,
              data: [{
                value: this.dataAll['成绩'],
                label: {
                  show: false,
                  position: 'outside'
                }
              }]
            },
            {
              name: '班级平均分',
              type: 'bar',
              barWidth: 40,
              data: [{
                value: this.dataAll['班均分'],
                label: {
                  show: false,
                  position: 'outside'
                }
              }]
            },
            {
              name: '班级最高分',
              type: 'bar',
              barWidth: 40,
              data: [{
                value: this.dataAll['班最高'],
                label: {
                  show: false,
                  position: 'outside'
                }
              }]
            },
            {
              name: '年级平均分',
              type: 'bar',
              barWidth: 40,
              data: [{
                value: this.dataAll['年平均'],
                label: {
                  show: false,
                  position: 'outside'
                }
              }]
            },
            {
              name: '年级最高分',
              type: 'bar',
              barWidth: 40,
              data: [{
                value: this.dataAll['年最高'],
                label: {
                  show: false,
                  position: 'outside'
                }
              }]
            }
          ]
        }
        myChart.setOption(option, true)
      },
      setRadar3 () {
        this.$nextTick(function () {
          const dom = this.$refs.barEchart
          const myChart = this.echarts.init(dom)
          let barNames = []
          if (this.studentInformationDatas[0]['年级'] === '初二(2020级)') {
            barNames = [{
              name: '元认知学习策略',
              max: 100
            }, {
              name: '学习习惯',
              max: 100
            }, {
              name: '学习内容组织策略',
              max: 100
            }, {
              name: '学习坚毅力',
              max: 100
            }, {
              name: '学习资源求助',
              max: 100
            }, {
              name: '成长型学习思维',
              max: 100
            }, {
              name: '精加工学习策略',
              max: 100
            }, {
              name: '记忆学习策略',
              max: 100
            }]
          } else if (this.studentInformationDatas[0]['年级'] === '初一(2021级)') {
            barNames = [{
              name: '人际智能',
              max: 100
            }, {
              name: '空间智能',
              max: 100
            }, {
              name: '自我认知智能',
              max: 100
            }, {
              name: '自然观察智能',
              max: 100
            }, {
              name: '言语智能',
              max: 100
            }, {
              name: '身体—运动智能',
              max: 100
            }, {
              name: '逻辑—数学智能',
              max: 100
            }, {
              name: '音乐智能',
              max: 100
            }]
          }
          let myData3 = []
          barNames.map((item) => {
            item.name in this.dataAll.xinliData && myData3.push(this.dataAll.xinliData[item.name])
          })
          const option = {
            color: ['#5B8FF9', '#5AD8A6'],
            legend: {
              data: [this.dataAll['姓名']],
              top: '5%'
            },
            radar: {
              center: ['50%', '57%'],
              radius: '60%',
              splitArea: {
                show: false
              },
              indicator: barNames,
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
                  value: myData3,
                  name: this.dataAll['姓名']
                }
              ]
            }]
          }
          myChart.setOption(option, true)
        })
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
            this.myData3.push(Number(this.radar[0][item]))
            this.barNames.push({
              name: item
            })
          })
          this.setRadar3()
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
    .bar{
      padding: 20px 85px 0;
      >div {
        width: 820px;
        height: 480px;
        border:2px solid #007ABB;
        position: relative;
      }
      .imgs>img {
        max-width: 810px;
          max-height: 470px;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto;
      }
    }
    .content-text{
      width: 100%;
      padding: 30px 50px 80px;
      line-height: 46px;
      h5{
        color:#FA4655;
        font-size: 20px;
        font-weight: 600;
        margin-left: 2em;
        .grade{
          display: inline-block;
          min-width: 100px;
          border-bottom: 2px solid  #ef8200;;
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
          //color:#FA4655;
          display: inline-block;
          text-align: center;
          //border-bottom: 1px solid #FA4655;
          line-height: 19px;
          margin-left: 2em;
        }
        .text-lists1,.text-lists2{
          display: inline-block;
            //color:#FA4655;
          li{
            display: inline-block;
            // min-width: 100px;
            text-align: center;
            //border-bottom: 1px solid #FA4655;
            //margin-left: 10px;
            line-height: 20px;
          }
        }
        .text-red{
          color:#FA4655;
        }
      }
    }
  }
}
.tiyu-top{
  width: 100%;
  text-align: center;
  margin-top: 40px;
  height: 60px;
  >div{
    zoom: 1;
    // width: 33%;
    float: left;
    margin-left: 65px;
    margin-right: 70px;
    text-align: left;
    >div:first-of-type{
      float: left;
      width: 58px;
      height: 58px;
      >img{
        width: 58px !important;
        height: 58px !important;
      }
    }
    >div:last-of-type{
      float: left;
      height: 58px;
      margin-left: 10px;
      >p{
        font-size: 14px;
        color: #333;
        >span{
          color: #999;
          font-size: 10px;
        }
      }
      >span{
        font-weight: 600;
        color: #0060EC;
        font-size: 14px;
      }
    }
  }
  >div:last-of-type{
    margin-right: 0;
  }
}
.tiyu-bottom{
  // margin-top: -100px;
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
