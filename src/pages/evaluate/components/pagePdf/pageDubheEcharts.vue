
//天枢星
<template>
  <div class="page-three">
    <div class="main">
      <h3>
        <span>{{ dataAll.name }}</span>
      </h3>
      <div class="color-span">
        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="radar">
        <div class="left">
          <div class="zhibiao">习惯指标</div>
          <div ref="radarLeft" style="width: 400px;height:400px;border:2px solid #007ABB;" ></div>
          <!-- <div style="width: 400px;height:400px;border:2px solid #007ABB;">
            <img :src="imgSrc1" alt="">
          </div> -->
        </div>
        <div class="right">
          <div class="zhibiao">学科素养指标</div>
          <div ref="radarRight" style="width: 400px;height:400px;border:2px solid #007ABB;"></div>
          <!-- <div style="width: 400px;height:400px;border:2px solid #007ABB;">
            <img :src="imgSrc2" alt="">
          </div> -->
        </div>
      </div>
      <div class="bar noClick" style="width: 820px;height:480px;border:2px solid #007ABB;"></div>
      <div class="bar" style="width: 820px;height:480px;border:2px solid #007ABB;" v-if="idArr.length">
        <div class="zwcd">
          掌握程度：
          <div>
            <span></span>
            非常好
          </div>
          <div>
            <span></span>
            较好
          </div>
          <div>
            <span></span>
            一般
          </div>
          <div>
            <span></span>
            较差
          </div>
        </div>
        <div class="piesWrap" ref="piesWrap">
          <div class="pie" ref="pie">
            <div class="pies" ref="pies" v-for="(item, index) in idArr" :key="index">
          </div>
          </div>
        </div>
        <div :style="{'transform':'scale(.7)'}" v-if="studentInformationDatas[0]['年级'] === '四年级(2018级)' && dataAll.name === '数学'">
          <js-mind :id="dataAll.name" :values="mind" :options="options" ref="jsMind" style="position: relative" height='480px'></js-mind>
        </div>
        <div :style="{'transform':'scale(.8)'}" v-else-if="studentInformationDatas[0]['年级'] === '三年级(2019级)' && dataAll.name === '数学'">
          <js-mind :id="dataAll.name" :values="mind" :options="options" ref="jsMind" style="position: relative" height='480px'></js-mind>
        </div>
        <div v-else>
          <js-mind :id="dataAll.name" :values="mind" :options="options" ref="jsMind" style="position: relative" height='480px'></js-mind>
        </div>
      </div>
      <div class="bar" style="width: 820px;height:430px;border:2px solid #007ABB;" v-else>
        <div class="zwcd">
          掌握程度：
          <div>
            <span></span>
            非常好
          </div>
          <div>
            <span></span>
            较好
          </div>
          <div>
            <span></span>
            一般
          </div>
          <div>
            <span></span>
            较差
          </div>
        </div>
        <img :src="idImg[0]['学生图片名称']" alt="">
      </div>
      <div class="content-text">
        <h5 style="color: #ef8200;">
          学科综合评价：
          <span class="grade">{{dataAll['综合等级'] ? dataAll['综合等级'] : '--'}}</span>
          (等级)
          <!-- <span class="score" v-if="dataAll[0].年级 === '2020级初中'">
            期中(平均分)：{{Math.floor(dataAll[0]['期中'])}}分({{Math.floor(dataAll[0]['期中班均分'])}}分)
            期末(平均分)：{{Math.floor(dataAll[0]['期末'])}}分({{Math.floor(dataAll[0]['期末班均分'])}}分)
          </span>
          <span class="score" v-else>
            期末(平均分)：{{Math.floor(dataAll[dataAll.学科])}}分({{Math.floor(dataAll[0][dataAll[0].学科 + '班均分'])}}分)
          </span> -->
        </h5>
        <div class="text"><span class="text-name">{{dataAll['姓名']}}</span>同学，经过一学期的努力，在学习过程中，
         <ul class="text-lists1">
           <li>{{ dataAll.dataArr[0]['指标名称'] }}</li> 、
         </ul>
          <ul class="text-lists1">
           <li>{{dataAll.dataArr[1]['指标名称']}}</li>
         </ul>等方面表现优异，为你点赞；
         <ul class="text-lists2">
           <li>{{dataAll.dataArr[dataAll.dataArr.length-1]['指标名称']}}</li> 、
         </ul>
          <ul class="text-lists2">
           <li>{{dataAll.dataArr[dataAll.dataArr.length-2]['指标名称']}}</li>
         </ul>方面还需改进，期待你的改变。
        </div>
      </div>
    </div>
    <div class="page-num">
     <div class="count">{{pageObj['.pageDubhe']+index + 1}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {
      studentInformationDatas: Array,
      dataAll: Object,
      pageObj: Object,
      index: Number,
      getKnowledge: Array
    },
    data () {
      return {
        id: null,
        radarLeft: null,
        radarRight: null,
        barEchart: null,
        // 2021-116
        valueData1: [],
        valueData11: [],
        valueData1L: '',
        valueData2: [],
        valueData22: [],
        valueData2L: '',
        subjectValue: [], // 学科最终评价
        subjectEvaluation: [], // 学科综合评级
        tempsubjectEvaluation: [],
        xAxisDataName: ['期末'], // 1-3默认只有期末
        seriessubjectValueData: [],
        radarLeftNames: [],
        radarRightNames: [],
        konwLedge: [],
        knowData: {
          topic: '',
          id: 'root',
          children: [],
          expanded: true
        },
        options: {
          container: this.dataAll.name, // [必选] 容器的ID，或者为容器的对象
          editable: true, // [可选] 是否启用编辑
          theme: 'orange',
          mode: 'full',
          support_html: true,
          view: {
            engine: 'canvas', // 思维导图各节点之间线条的绘制引擎
            hmargin: 0, // 思维导图距容器外框的最小水平距离
            vmargin: 0, // 思维导图距容器外框的最小垂直距离
            line_width: 2, // 思维导图线条的粗细
            line_color: '#aaa' // 思维导图线条的颜色
          },
          layout: {
            hspace: 30,
            vspace: 30,
            pspace: 10
          }
        },
        mind: {
          meta: {
            name: 'jsMind remote',
            author: 'hizzgdev@163.com',
            version: '0.2'
          },
          format: 'node_tree',
          data: {}
        },
        idArr: [],
        idImg: []
      }
    },
    created () {
      if (this.studentInformationDatas.length) {
        this.id = this.studentInformationDatas[0]['学号'].slice(0, 3)
      }
      // console.log(this.dataAll)
      if (this.getKnowledge.length) {
        this.konwLedge = this.getKnowledge
        this.knowDatas()
        this.mind.data = this.knowData
      } else {
        this.idImg = this.dataAll.img
      }
      // console.log(this.studentInformationDatas)
      this.setRadar()
      this.setRadar1()
    },
    mounted () {
      this.knowData.children.map((item, index) => {
        // console.log(item)
        // console.log(item)
        if (item.leave === 2) {
          this.$refs.jsMind.jm.set_node_color(item.id, '#34495e')
          // this.$refs.jsMind.jm.end_edit()
          item.children.map((citem) => {
            // this.$refs.jsMind.jm.end_edit()
            if (citem.leave === 3) {
              if (citem.score.key === 'A') {
                console.log(citem)
                this.$refs.jsMind.jm.set_node_color(citem.id, '#12b23b')
              }
              if (citem.score.key === 'B') {
                this.$refs.jsMind.jm.set_node_color(citem.id, '#0e64f4')
              }
              if (citem.score.key === 'C') {
                this.$refs.jsMind.jm.set_node_color(citem.id, '#ffc600')
              }
              if (citem.score.key === 'D') {
                this.$refs.jsMind.jm.set_node_color(citem.id, '#ff0000')
              }
            }
          })
        } else {
          if (item.leave === 3) {
            if (item.score.key === 'A') {
              this.$refs.jsMind.jm.set_node_color(item.id, '#12b23b')
            }
            if (item.score.key === 'B') {
              this.$refs.jsMind.jm.set_node_color(item.id, '#0e64f4')
            }
            if (item.score.key === 'C') {
              this.$refs.jsMind.jm.set_node_color(item.id, '#ffc600')
            }
            if (item.score.key === 'D') {
              this.$refs.jsMind.jm.set_node_color(item.id, '#ff0000')
            }
          }
        }
      })
    },
    methods: {
      // 获取数据
      getDatas (id) {
        // console.log(this.dataAll)
      },
      initData () {
        // myChart.setOption(option)
        let fromData = this.dataAll.left
        for (let i = 0; i < fromData.length / 2; i++) {
          this.radarLeft.push(fromData[i]['指标名称'])
          this.valueData1.push(fromData[i]['分数'])
        }
        for (let i = 5; i < fromData.length; i++) {
          this.valueData11.push(fromData[i]['分数'])
        }
        this.valueData1L = fromData[0]['姓名']
        this.radarLeftNames = this.dataAll.name
      },
      setRadar (myChart, option) {
        let that = this
        that.$nextTick(function () {
          that.radarLeft = this.echarts.init(this.$refs.radarLeft)
          let fromData1 = that.dataAll.left1
          let fromData2 = that.dataAll.left2
          for (let i = 0; i < fromData1.length; i++) {
            that.radarLeftNames.push({
              name: fromData1[i]['指标名称'],
              max: 100
            })
            that.valueData1.push(fromData1[i]['分数'])
          }
          for (let i = 0; i < fromData2.length; i++) {
            that.valueData11.push(fromData2[i]['分数'])
          }
          that.valueData1L = fromData1[0]['姓名']
          option = {
            color: ['#5AD8A6', '#5B8FF9'],
            // tooltip: {},
            legend: {
              data: ['平均值', `${this.valueData1L}的习惯养成`],
              top: '13%'
            },
            radar: {
              // shape: 'circle',
              center: ['50%', '62%'],
              radius: '60%',
              splitArea: {
                show: false
              },
              indicator: this.radarLeftNames,
              name: {
                textStyle: {
                  color: 'rgba(0,0,0,0.5)'
                },
                formatter: function (params, indicator) {
                  let strlength = params.length
                  if (strlength >= 6) {
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
              // areaStyle: {normal: {}},
              data: [
                {
                  value: this.valueData11,
                  name: '平均值'
                },
                {
                  value: this.valueData1,
                  name: `${this.valueData1L}的习惯养成`
                }
              ]
            }]
          }
          that.radarLeft.setOption(option)
          // setTimeout((async) => {
          //   var imgSrc1 = that.radarLeft.getDataURL()
          //   // 渲染到图表上面，遮住图表
          //   this.imgSrc1 = imgSrc1
          // }, 1000)
        })
      },
      setRadar1 (myChart, option) {
        // myChart.setOption(option)
        let that = this
        that.$nextTick(function () {
          that.radarRight = this.echarts.init(this.$refs.radarRight)
          let fromData1 = that.dataAll.right1
          let fromData2 = that.dataAll.right2
          // console.log(fromData)
          for (let i = 0; i < fromData1.length; i++) {
            that.radarRightNames.push({
              name: fromData1[i]['指标名称'],
              max: 100
            })
            that.valueData2.push(fromData1[i]['分数'])
          }
          for (let i = 0; i < fromData2.length; i++) {
            that.valueData22.push(fromData2[i]['分数'])
          }
          that.valueData2L = fromData1[0]['姓名']
          // console.log(that.radarRight, that.radarRightNames, that.valueData2, that.valueData22)
          option = {
            color: ['#5AD8A6', '#5B8FF9'],
            // tooltip: {},
            legend: {
              data: ['平均值', `${this.valueData2L}的学科素养`],
              top: '13%'
            },
            radar: {
              // shape: 'circle',
              center: ['50%', '60%'],
              radius: '60%',
              splitArea: {
                show: false
              },
              name: {
                textStyle: {
                  color: 'rgba(0,0,0,0.5)',
                  padding: [
                    -5,
                    -5,
                    -8,
                    -5
                  ]
                },
                formatter: function (params, indicator) {
                  let strlength = params.length
                  // if (strlength % 2 === 1) {
                  //   params = params.replace(/\S{6}/g, function (match) {
                  //     return match + '\n'
                  //   })
                  // } else {
                  //   params = params.replace(/\S{6}/g, function (match) {
                  //     return match + '\n'
                  //   })
                  // }

                  if (strlength >= 6) {
                    params = params.replace(/\S{4}/g, function (match) {
                      return match + '\n'
                    })
                  }
                  return params
                }
              },
              indicator: this.radarRightNames
            },
            series: [{
              type: 'radar',
              // areaStyle: {normal: {}},
              data: [
                {
                  value: this.valueData22,
                  name: '平均值'
                },
                {
                  value: this.valueData2,
                  name: `${this.valueData2L}的学科素养`
                }
              ]
            }]
          }
          // console.log(option)
          option && that.radarRight.setOption(option)
          // setTimeout((async) => {
          //   var imgSrc2 = that.radarRight.getDataURL()
          //   // 渲染到图表上面，遮住图表
          //   this.imgSrc2 = imgSrc2
          // }, 1000)
        })
      },
      // 处理数据
      knowDatas () {
        // 学科
        this.knowData.topic = '<span class="topicTit">' + this.konwLedge[0].学科 + '</span>'
        let arr = []
        if (this.konwLedge[0].二级章节 !== null) {
          // 一级章节
          for (let i = 0; i < this.konwLedge.length; i++) {
            if (arr.indexOf(this.konwLedge[i].一级章节) === -1) {
              arr.push(this.konwLedge[i].一级章节)
            }
          }
          arr.map((item, index) => {
            this.knowData.children.push({
              topic: item.length > 15 ? `${item.slice(0, 15) + '...'}` : `${item}`,
              id: item + index,
              expanded: true,
              direction: index % 2 === 1 ? 'left' : 'right',
              children: [],
              leave: 2
            })
          })
          // 二级章节
          this.konwLedge.map(item => {
            this.knowData.children.map((bItem) => {
              // console.log(bItem)
              let scoreArr = [{ key: 'A', value: item.A }, { key: 'B', value: item.B }, { key: 'C', value: item.C }, { key: 'D', value: item.D }].sort((a, b) => {
                return Number(b.value) - Number(a.value)
              })
              if (item.一级章节.indexOf(bItem.topic.slice(0, 6)) > -1) {
                bItem.children.push({
                  topic: item.二级章节.length > 20 ? item.二级章节.slice(0, 20) + '...' : item.二级章节,
                  id: item.二级章节 + '末级指标',
                  A: item.A,
                  B: item.B,
                  C: item.C,
                  D: item.D,
                  leave: 3,
                  score: scoreArr[0]
                })
                this.idArr.push(item.二级章节 + '末级指标')
              }
            })
          })
        } else {
          this.konwLedge.map((item, index) => {
            let scoreArr = [{ key: 'A', value: item.A }, { key: 'B', value: item.B }, { key: 'C', value: item.C }, { key: 'D', value: item.D }].sort((a, b) => {
              return Number(b.value) - Number(a.value)
            })
            this.knowData.children.push({
              topic: item.一级章节.length > 20 ? item.一级章节.slice(0, 20) + '...' : item.一级章节,
              id: item.一级章节 + '末级指标',
              A: item.A,
              B: item.B,
              C: item.C,
              D: item.D,
              expanded: true,
              direction: index % 2 === 1 ? 'left' : 'right',
              children: [],
              leave: 3,
              score: scoreArr[0]
            })
            this.idArr.push(item.一级章节 + '末级指标')
          })
        }
      }
    }
  }
</script>
<style lang='less' scoped>
/deep/ .jsmind-inner {
  height: 1000px;
  width: 1070px;
  position: absolute;
  left: -120px;
  top: -250px;
  overflow: hidden;
  transform: scale(.8);
}
/deep/ .theme-orange {
  margin: auto;
  // jmexpander {
  //   top: 214px !important;
  //   height: 1px;
  //   border-color: #aaa;
  // }
  jmnode {
    color: #fff;
    box-shadow: none;
    // border: 1px solid #1677ff;
    // background: #cceeff;
  }
}
/deep/ .root {
  color: #fff !important;
  // border: 1px solid #1677ff;
  background: #00aaff;
}
.piesWrap {
  position: relative;
  width: 860px;
  height: 430px;
  float: left;
  overflow: hidden;
  transform: scale(.8) translateX(-22px);
  .pie {
    position: absolute;
    left: 0;
    top: 0;
    height: 430px;
    width: 860px;
    transform: translateX(-22px);
  }
}
.pies {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: absolute;
  z-index: 3;
}
.page-three{
  width: 100%;
  height: 100%;
  position: relative;
  background: url('./../../views/qualityReport/img/dubhe/bgc.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
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
      position: relative;
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
      position: relative;
      // text-align: center;
      // line-height: 420px;
      width: 820px;
      >img{
        position: absolute;
        left: 0;
        right: 0;
        top: 30px;
        bottom: 0;
        margin: auto;
        max-height: 396px;
        max-width: 816px;
        // width: 820px;height:430px
      }
      .zwcd {
        position: absolute;
        height: 30px;
        line-height: 30px;
        right: 20px;
        top: 0;
        font-size: 12px;
        display: flex;
        align-items: center;
        div {
          margin-left: 15px;
          display: flex;
          align-items: center;
          span {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #12b23b;
            border-radius: 50%;
            margin-right: 8px;
          }
        }
        div:nth-child(2) {
          span {
            background: #0e64f4;
          }
        }
        div:nth-child(3) {
          span {
            background: #ffc600;
          }
        }
        div:nth-child(4) {
          span {
            background: #ff0000;
          }
        }
      }
    }
    .noClick{
      position: absolute;
      // background: #000;
      top: 650px;
      z-index: 9999999;
      opacity: 0;
    }
    .content-text{
      width: 100%;
      padding: 30px 50px 80px;
      line-height: 46px;
      h5{
        color:#00A0E8;
        font-size: 20px;
        font-weight: 600;
        margin-left:50px;
        .grade{
          display: inline-block;
          min-width: 100px;
          border-bottom: 3px solid #ef8200;
          text-align: center;
          line-height: 20px;
        }
        .score {
          color: rgba(0, 0, 0, .85);
          margin-left: 20px;
        }
      }
      div{
        color: #3E3A39;
        margin-top: 5px;
        font-size: 20px;
      }
      .text{
        .text-name{
          //color:#00A0E8;
          display: inline-block;
          min-width: 65px;
          text-align: center;
          line-height: 19px;
          margin-left: 50px;
        }
        .text-lists1,.text-lists2{
          display: inline-block;
          li{
            //color:#00A0E8;
            display: inline-block;
            // min-width: 60px;
            text-align: center;
            //border-bottom: 3px solid #00A0E8;
            //margin-left: 10px;
            line-height: 20px;
          }
        }
      }
    }
  }
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
