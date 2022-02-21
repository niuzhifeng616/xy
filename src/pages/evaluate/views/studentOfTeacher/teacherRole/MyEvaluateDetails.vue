<template>
  <div class="xy-content-module detail">
    <div v-if="queslArr.length===0" class="no-data-box">
      <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
      <span class="no-data-text">您还没有该方案的信息，请添加问卷。</span>
    </div>
    <div class="xy-content-body detailModel" v-else>
        <div class="approval-card">
          <div class="main-info-name">
            <div class="left">
              <span class="avatar" >
                <img class="left-img" v-if="teacherIcon" :src="teacherIcon" />
                <span  v-else  class="left fl left-span" :style="{background: teacherSex===0 ? '#FF81AC':'#4196FF'}">{{details !== null ? xy.showName(teacherFullName):''}}</span>
              </span>
              <p class="name-number" >
                <span class="fullName">{{details !== null ? teacherFullName:''}}</span>
              </p>
            </div>
          </div>
          <div class="main-info-questions">
            <div class="questions-name" >
              <span>
                问卷名称：
              </span>
              <div class="questions-name-list">
                  <div v-for="(item, index) in queslArr" :key="index" class="questions-name-item" :style="{background: item.check ? 'rgba(65,150,255,1)' : '#fff' ,color: !item.check ? '' : '#fff' }" @click="check2(index)"> <span>{{item.QuestionnaireTitle}}</span> </div>
              </div>
            </div>
            <div class="questions-class">
              <span>
                任教班级：
              </span>
              <div class="questions-class-list">
                <div v-for="(item, index) in schoolArr" :key="index" class="questions-class-item" :style="{background: item.check ? 'rgba(65,150,255,1)' : '#fff' ,color: !item.check ? '' : '#fff' }" @click="check1(index)"> <span>{{item.ClassName}}</span> </div>
              </div>
            </div>
          </div>
          <div class="main-summary" >
            <span>评教得分：</span>
            <span>{{details !== null ? details.Score:''}}分</span>
            <span>参评学生：</span>
            <span>{{details !== null ? details.JoinCount:''}}人</span>
          </div>
        </div>
        <div class="dividing-line"></div>
        <div class="approval-main">
          <div v-for="(outerItem, outerIndex) in subjectStatistics" :key="outerIndex" class="content-flex">
            <p>{{outerIndex+1}}.{{outerItem.questionName}}</p>
            <div v-show="outerItem.Type === 1"  :id="'pie' + outerItem.questionID" class="my-echart"></div>
            <div v-show="outerItem.Type === 2" :id="'histogram' + outerItem.questionID" class="my-echart"></div>
            <div v-if="outerItem.Type === 3" class="my-rate">
                <div class="score-center">
                    <div class="score-center-rate" v-for="(item,index) in outerItem.rateStart" :key="index">
                        <Rate disabled clearable v-model="item.StartCount" class="rate" :custom-icon="'iconfont icon-Starunselectedbeifen'" style="color:#FADB14" color="#FADB14" />
                        <div class="rate-text">
                          <span style="margin-left:24px" class="rate-title">{{item.Title}}</span>
                          <span style="margin-left:16px" class="rate-count">{{item.Count}}</span>
                          <span style="margin-left:8px" class="rate-rate">({{item.Rate}}%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="outerItem.Type === 4" class="my-answer">
              采集到：{{outerItem.que}} 份
              <span v-if="outerItem.que>0" class="view-details" @click="onViewDetails(outerItem,outerIndex)">查看详情</span>
              <span v-else class="view-details-noto" >查看详情</span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'detail',
    data () {
      return {
        imgUrl: this.xyApi + '/base',
        subjectStatistics: null,
        singleT: false,
        row: {},
        schoolArr: [],
        queslArr: [],
        classID: 0,
        questionnaireID: 0,
        details: null,
        teacherFullName: null,
        teacherIcon: '',
        teacherSex: 0,
        teacherID: null,
        questionID: null,
        questionIDArr: []
      }
    },
    created: function () {
      this.row = this.$store.state.evaluate.evaMyLuate
      this.getQuestion(this.row.TeachingProjectID)
    },
    watch: {
      arr (newVal) {
        // console.log(newVal)
      },
      teacherIcon (val) {
        this.teacherIcon = val
      }
    },
    mounted: function () {
    },
    methods: {
      // 获取详情
      setEchartPie (pie, echart) {
        const obj = {
          color: ['#8543E0', '#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#33EA92', '#FF9331'],
          backgroundColor: {
            type: 'linear',
            x0: 0,
            y0: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 0, color: 'rgba(0, 0, 0, .03)' // 0% 处的颜色
            }, {
              offset: 0.344, color: 'rgba(0, 0, 0, .03)'
            }, {
              offset: 0.3441, color: 'rgba(255, 255, 255, 1)'
            }, {
              offset: 1, color: 'rgba(255, 255, 255, 1)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          },
          legend: {
            orient: 'vertical',
            width: 50,
            // top: 40,
            left: 450,
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 20, // 图例间隔
            textStyle: {
              fontSize: 14,
              marginLeft: '30px',
              color: 'rgba(0, 0, 0, .65)'
            },
            data: pie.name
          },
          tooltip: {
            trigger: 'item',
            formatter (params) {
              return params.name
            }
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '71%'],
              center: ['50%', '50%'],
              width: 420,
              height: 306,
              label: {
                normal: {
                  show: false,
                  position: 'inside',
                  formatter: '{b}: {c}' + '人'
                }
              },
              data: pie.data
            }
          ]
        }
        echart.setOption(obj)
      },
      setEchartHistogram (histogram, chart) {
        const obj = {
          color: ['#1077FE'],
          legend: {},
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: histogram.x,
            axisLabel: {
              interval: 0,
              formatter (value) {
                let newParamsName = ''
                const paramsNameNumber = value.length
                const provideNumber = 4 // 一行显示几个字
                const rowNumber = Math.ceil(paramsNameNumber / provideNumber)
                if (paramsNameNumber > provideNumber) {
                  for (let p = 0; p < rowNumber; p++) {
                    let tempStr = ''
                    const start = p * provideNumber
                    const end = start + provideNumber
                    if (p === rowNumber - 1) {
                      tempStr = value.substring(start, paramsNameNumber)
                    } else {
                      tempStr = value.substring(start, end) + '\n'
                    }
                    newParamsName += tempStr
                  }
                } else {
                  newParamsName = value
                }
                return newParamsName
              }
            }
          },
          yAxis: {
            type: 'value',
            scale: true,
            max: 200,
            min: 0
          },
          series: [{
            name: histogram.z,
            data: histogram.y,
            type: 'bar',
            barWidth: 40
          }]
        }
        chart.setOption(obj)
      },
      check1 (i) {
        this.schoolArr = this.schoolArr.map(item => {
          return {
            ...item,
            check: false
          }
        })
        this.schoolArr[i].check = true
        this.classID = this.schoolArr[i].ClassID
        this.getMyQuestionaire(this.classID, this.questionnaireID)
      },
      check2 (i) {
        this.queslArr = this.queslArr.map(item => {
          return {
            ...item,
            check: false
          }
        })
        this.queslArr[i].check = true
        this.questionnaireID = this.queslArr[i].QuestionnaireID
        this.getClass()
        // this.getMyQuestionaire(this.classID, this.questionnaireID)
      },
      async getMyQuestionaire (classId, qId) {
        let params = {
          questionnaireID: qId,
          teachingProjectID: this.row.TeachingProjectID,
          classID: classId
        }
        this.xy.loading()
        let rs = await this.xy.get(this.$store.state.apiPath + '/api/StudentTeachingReport/GetMyTeachingEva', params)
        if (rs.success) {
          this.details = rs.data.ScoreSummary
          if (this.details.TeacherFullName !== null) {
            this.teacherFullName = this.details.TeacherFullName
          } else {
            this.teacherFullName = this.$store.state.common.userBaseInfo.FullName
          }
          this.teacherIcon = rs.data.Icon
          this.teacherSex = rs.data.TeacherSex
          this.teacherID = rs.data.TeacherID
          this.subjectStatistics = rs.data.Questions.map((s, index) => {
            const pie = {}
            const histogram = {}
            this.singleT = true
            s.OptionStatistics = s.QuestionOptions.map(m => {
              return {
                OptionsName: '选项' + m.Title + m.Count + '人',
                OptionsNumber: m.Count
              }
            })
            pie.name = s.QuestionOptions.map(m => {
              return {
                name: '选' + m.OptTag + '\xa0\xa0' + m.OptName + '\xa0\xa0\xa0' + m.Count + '人' + '(' + m.Rate + '%' + ')',
                icon: 'circle'
              }
            })
            pie.data = s.QuestionOptions.map(m => {
              return {
                value: m.Count,
                name: '选' + m.OptTag + '\xa0\xa0' + m.OptName + '\xa0\xa0\xa0' + m.Count + '人' + '(' + m.Rate + '%' + ')'
              }
            })
            let rateStart = s.QuestionOptions
            let que = s.GatherCount
            let questionID = s.QuestionID
            this.questionIDArr.push(questionID)
            return {
              questionName: s.QuestionName,
              Type: s.QuestionType,
              statistics: s.OptionStatistics,
              pie: pie,
              histogram: histogram,
              rateStart: rateStart,
              que: que,
              questionID: questionID
            }
          })
          const that = this
          this.$nextTick(function () {
            that.subjectStatistics.forEach((s, index) => {
              if (s.Type === 1) {
                document.getElementById('pie' + s.questionID) && that.setEchartPie(s.pie, that.echarts.init(document.getElementById('pie' + s.questionID)))
              }
              if (s.Type === 2) {
                document.getElementById('histogram' + s.questionID) && that.setEchartHistogram(s.histogram, that.echarts.init(document.getElementById('histogram' + s.questionID)))
              }
            })
          })
        }
        this.xy.unloading()
      },
      async getClass () {
        let params = {
          // teachingProjectID: this.row.TeachingProjectID
          questionnaireID: this.questionnaireID
        }
        this.xy.loading()
        let rs = await this.xy.get(this.$store.state.apiPath + '/api/StudentTeachingReport/GetMyClasses', params)
        if (rs.success) {
          this.schoolArr = rs.data.map(item => {
            return {
              ...item,
              check: false
            }
          })
          if (this.schoolArr.length > 0) {
            this.schoolArr[0].check = true
            this.classID = this.schoolArr[0].ClassID
          }
        }
        this.getMyQuestionaire(this.classID, this.questionnaireID)
        this.xy.unloading()
      },
      async getQuestion () {
        let params = {
          teachingProjectID: this.row.TeachingProjectID,
          isAll: false
        }
        this.xy.loading()
        let rs = await this.xy.get(this.$store.state.apiPath + '/api/StudentTeachingReport/GetQuestionnaires', params)
        if (rs.success) {
          this.queslArr = rs.data.map(item => {
            return {
              ...item,
              check: false
            }
          })
        }
        if (rs.data.length > 0) {
          this.queslArr[0].check = true
          this.questionnaireID = this.queslArr[0].QuestionnaireID
          this.getClass()
        }
        this.xy.unloading()
      },
      onViewDetails (row, i) {
        row.TeacherID = this.teacherID
        let params = {
          row: row,
          questionID: this.questionIDArr[i],
          classID: this.classID,
          title: row.questionName,
          index: i
        }
        this.$store.commit('evaluate/changeEvaQuestion', JSON.stringify(params))
        this.$store.commit('common/getThreeMenuName', '问答详情')
        this.$router.push({
          path: '/xyHome/MyEvaluateQuestionDetails',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.detailModel{
  margin: 20px 10px;
  padding: 0;
  .dividing-line{
    width:100%;
    height:20px;
    background:#f9f9f9;
    position:relative
  }
  .leave-list{
    font-size:14px;
   .info-item{
     margin-top:10px;
     .title{color:#999;}
     .title-strong{display:block;margin:20px 0;font-size:14px;font-weight:bold;color:#333;}
     .content{margin-left:10px;color:#333;}
   }
  }
  .ivu-drawer{
    top:0;margin:0;position:absolute;height:100%;right:0
  }
  .ivu-drawer-content{
    height:100%;
    overflow:auto;
  }
  .approval-card {
    background:rgba(255,255,255,1);
    padding:13px 20px;
    .main-info-name{
      display:-webkit-box;display:-ms-flexbox;display:flex;
      -webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;
      padding:3px 0px 15px 0px;
      border-bottom: 1px dashed #e8e8e8;
      .left{
        display:-webkit-box;
        display:-ms-flexbox;
        display:flex;
        .avatar{
          padding:0;
          padding-right:15px;
          .left-img{
            display: inline-block;
            width: 50px;
            height: 50px;
            border-radius:50%;
            line-height:42px;
            text-align:center;
            box-shadow: 0px 0px 1px 1px #dddddd;
          }
          .left-span{
            display: inline-block;
            width: 50px;
            height: 50px;
            border-radius:50%;
            line-height:50px;
            text-align:center;
            font-size:18px;
            color:#fff;
          }
        }
        .name-number{
          display:-webkit-box;
          display:-ms-flexbox;
          display:flex;
          -webkit-box-orient:vertical;
          -webkit-box-direction:normal;
          -ms-flex-direction:column;
          flex-direction:column;
          margin-top:6px;
          line-height: 40px;
          .fullName{color:#606266;
          font-size:16px}
          .schoolNumber{font-size:14px;color:#999999}
        }
      }
    }
    .main-info-questions{
      padding: 20px 0px 15px 0px;
      border-bottom: 1px dashed #e8e8e8;
      .questions-name{
        display: flex;
        >span{
        color: rgb(0, 0, 0); opacity: 0.65;
        margin-right: 10px;
        // flex: 1;
        }
        .questions-name-list{
          flex: 12;
          .questions-name-item{
            display: inline-block;
            cursor: pointer;
            margin-right: 20px;
            padding: 2px 10px;
            border-radius: 4px;
            background: rgb(255, 255, 255);
            margin-bottom: 8px;
          }
        }
      }
      .questions-class{
        display:flex;
        margin-top:15px;
        >span{
          color: rgb(0, 0, 0);
          opacity: 0.65;
          margin-right: 10px;
          // flex: 1;
        }
        .questions-class-list{
          flex: 12;
          .questions-class-item{
            display: inline-block;
            cursor: pointer;
            margin-right: 20px;
            margin-bottom: 6px;
            padding: 2px 10px;
            border-radius: 4px;
            background: rgb(65, 150, 255);
            margin-bottom: 8px;
          }
        }
      }
    }
    .main-summary{
      font-size:14px;
      font-weight:700;
      color:rgba(65,150,255,1);
      margin-top:13px;
      >span:nth-child(1){
        margin-right: 10px;
      }
      >span:nth-child(2){
        margin-right: 40px;
      }
      >span:nth-child(3){
        margin-right: 10px;
      }
    }
  }
  .approval-main {
    padding: 14px 0;
    height: auto;
    background:rgba(255,255,255,1);
    .content-flex{
      border-bottom: 1px dashed #e8e8e8;
      p{
        font-size: 14px;
        font-weight: bold;
        color: rgb(0, 0, 0);
        opacity: 0.85;
        padding: 15px 20px;
      }
      .my-echart{
        flex-shrink:0;
        display:inline-block;
        width:1240px;
        height:300px;
        margin:5px 0px 20px 20px;
      }
      .my-rate{
        margin:-10px 0px 20px 28px;
        .score-center{
          .score-center-rate{
            display: flex;
            .rate-text{
              margin-top: 10px;
              color: rgba(0, 0, 0, .65);
            }
          }
        }
      }
      .my-answer{
        margin:-4px 0px 20px 28px
      }
      .content-right {
        flex-wrap: wrap;
        padding: 20px 0;
        .content-item {
          width: 150px;
          height: 50px;
          display: flex;
          flex-direction: row;
          margin: 20px 10px;
          .dot-number {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
            width:8px;
            height:8px;
            background:#4196FF;
            border-radius:50%;

            .title-name {
              width:143px;
              height:14px;
              font-size:14px;
              font-weight:bold;
              color:rgba(0,0,0,1);
              opacity:0.85;
            }
          }
        }
      }
    }
    .content-flex:last-child{
       border-bottom: none !important;
    }
  }
 }
 .view-details{
   margin-left: 10px;
   color: #4196ff;
   cursor: pointer;
 }
 .view-details-noto{
    margin-left: 10px;
   color: #999;
 }
 .view-details:hover{
   color: #0976FF;
 }

</style>
