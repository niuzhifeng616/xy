<!-- 7.启动排课 -->
<template>
  <div class="xy-content-body" style="border-top:1px solid #E8E8E8;padding-top: 0;">
    <div class="proc-content">
      <div class="proc-left">
        <ul class="tap-ul text-center">
            <li @click="tapClick(tap)"
                :class="tap.isActive?'is-active':''"
                :style="{color:tap.colorN}"
                v-for="(tap,index) in tapData" :key="index">{{tap.name}}</li>
        </ul>
      </div>
      <div class="proc-right">
        <div v-if="tapShow">
          <div class="no-data-box" v-if="noData">
            <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
            <span class="no-data-text">请点击下方“校验数据”按钮开始校验。</span>
          </div>
          <div class="startCheck" v-if="isCheckShow">
              <div class="generate-course-results" v-if="isOnGoing">
                  <span class="iconfont" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
                  <span class="results-notice">正在校验冲突，请勿进行其他操作。</span>
              </div>
              <div class="result-head" style="margin-top:20px;">
                  <span>数据队列：</span>
                  <span style="margin-left:5px;">{{num+1}}/5</span>
              </div>
              <ul class="clearfix check-list">
                  <li data-index="0" class="complete-option" v-for="item in processData" :key="item.describe">
                      <!-- 等待 -->
                      <span class="state-complete" v-if="item.status == 0">
                          <span class="generate-text" v-cloak>正在等待，{{item.describe}}</span>
                      </span>
                      <!-- 进行中 -->
                      <span v-if="item.status == 1">
                          <span class="data-list-state">
                              <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                          </span>
                          <span class="generate-text" v-cloak>正在进行,{{item.describe}}</span>
                          <Progress :percent="percentVal" status="active" :stroke-width="16" />
                      </span>
                      <!-- 成功 -->
                      <span v-if="item.status == 2">
                          <span class="data-list-state data-list-state-error">
                              <Icon type="ios-checkmark-circle" />
                          </span>
                          <span class="generate-text" v-cloak>成功,{{item.describe}}</span>
                      </span>
                      <!-- 失败 -->
                      <span v-if="item.status == 3">
                          <span class="data-list-state data-list-state-error">
                              <Icon type="md-close-circle" color="#ed4014" />
                          </span>
                          <span class="generate-text" v-cloak>失败,{{item.describe}}</span>
                          <span @click="downErrorFile(item)" style="color:#2d8cf0;cursor:pointer;">下载错误信息</span>
                      </span>
                  </li>
              </ul>
          </div>
          <div class="text-center" v-if="!noData && !isCheckShow">
              <Icon type="ios-checkmark-circle" size="60" style="color:#42d456;margin-top:90px;" />
              <p style="font-size:16px;margin:10px;">
                  该结果共耗时{{completeTime}}，校验完成，请点击上方“启动排课”按钮启动排课。点击查看
                  <span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="logClick">日志明细</span>
              </p>
          </div>
          <div class="text-center bottom-btn" style="margin-top:50px;" v-if="StepsHeader.isOperation == 0">
              <Button class="xy-btn-primary" shape="circle" :disabled="!isShowBtn" @click="checkData" style="margin-right:0px;">
                  <span v-if="isShowBtn">校验数据</span>
                  <span v-if="!isShowBtn">正在检验数据，请稍后...</span>
              </Button>
          </div>
        </div>
        <!-- 启动排课 -->
        <div v-if="!tapShow">
          <!-- 排课方式选择 -->
          <div v-if="!modalLog && !startTip">
            <p class="check-header">请选择排课方式后启动排课</p>
            <a-radio-group class="radio-box" v-model="startType">
              <div class="start-box left" :class="startType === 1?'cur-type':''" @click="typeChange(1)">
                  <img class="start-img" src="@/assets/csmsTimeTable/online.png" alt="图片"/>
                  <a-radio :value="1" class="check-radio">线上排课</a-radio>
                  <div class="start-text">通用方式，满足大多数排课场景。</div>
                  <div class="text-center" v-if="StepsHeader.isOperation == 0">
                    <Button class="xy-primary" shape="circle" :loading="btnLoading" :disabled="startType === 2" @click="startFun(startType)" style="margin-right:0">启动排课</Button>
                  </div>
              </div>
              <div class="start-box" :class="startType === 2?'cur-type':''" @click="typeChange(2)">
                  <img class="start-img" src="@/assets/csmsTimeTable/tools.png" alt="图片"/>
                  <a-radio :value="2" class="check-radio">工具排课</a-radio>
                  <div class="start-text">支持编辑更多的排课规则，满足较复杂的排课需要。</div>
                  <div class="text-center" v-if="StepsHeader.isOperation == 0">
                    <Button class="xy-primary" shape="circle" :disabled="startType === 1" @click="startFun(startType)" style="margin-right:0">启动排课</Button>
                  </div>
              </div>
            </a-radio-group>
          </div>
          <!-- 线上排课-启动中 -->
          <div v-if="modalLog && !startTip" style="margin:20px;text-align:center">
              <div style="min-height:300px;">
                  <h1 style="font-size:24px;">排课进度信息</h1>
                  <span v-for="(item,index) in logList" :key="index" style="display:block;">
                      <span>{{xy.moment(item.LogTime).format('YYYY-MM-DD HH:mm')}}</span>
                      <span>{{item.SloverTaskLog}}</span>
                  </span>
              </div>
              <div class="text-center  bottom-btn" slot="footer" v-if="isRefresh">
                  <Button class="xy-primary" shape="circle"
                            :loading="btnLoading"
                            @click="LogRefresh(0)">刷新</Button>
                  <Button class="xy-info" shape="circle" @click="LogStop">停止</Button>
              </div>
          </div>
          <!-- 工具排课-启动提示 -->
          <div v-if="startTip" class="start-tip">
              <div class="no-data-box">
                  <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                  <span class="no-data-text" style="margin-top:50px;">
                      如果浏览器未提示任何信息，则点击<a :href="rouseUrl">此处</a>打开排课工具<br />或<a href="javascript:;" @click="openOther">下载并运行排课工具</a>。
                  </span>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        StepsHeader: {},
        classPlan: {},
        tapData: [
          {
            name: '校验数据',
            key: '1',
            isActive: true,
            colorN: '#444'
          },
          {
            name: '启动排课',
            key: '2',
            isActive: false,
            colorN: '#ddd'
          }
        ],
        tapShow: true,
        isShowBtn: true,
        noData: true,
        isCheckShow: false,
        num: 0,
        completeTime: '',
        percentVal: 0,
        isOnGoing: true,
        isComplete: false,
        processData: [// status:0等待；1进行中；2成功；3失败
          {
            url: 'GetTimeRuleRecord',
            status: 0,
            describe: '校验禁止排课时间和必须排课时间之间的冲突。',
            errorFile: ''
          },
          {
            url: 'GetTeacherTimeRuleRecord',
            status: 0,
            describe: '校验同一教师所教课程之间的必须上课时间冲突。',
            errorFile: ''
          },
          {
            url: 'GetCourseTimeRuleRecord',
            status: 0,
            describe: '校验同一班级不同课程之间的必须上课时间冲突。',
            errorFile: ''
          },
          {
            url: 'GetTeacherClassPosition',
            status: 0,
            describe: '校验教师课位区域是否足够。',
            errorFile: ''
          },
          {
            url: 'GetStudentClassPosition',
            status: 0,
            describe: '校验学生课位区域是否足够。',
            errorFile: ''
          }
        ],
        falseNum: 0, // 校验失败的条数

        startType: 1, // 启动类型
        startTip: false,
        rouseUrl: '',
        downloadUrl: '',
        // 排课方案日志
        loading: true,
        modalLog: false,
        sloverTaskID: 0,
        status: 0,
        logList: [],
        returnState: -1,
        isRefresh: false,
        refreshClassTableID: 0,
        btnLoading: false
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
    },
    mounted: function () {

    },
    methods: {
      // 切换tap
      tapClick (tap) {
        if (this.returnState === -1 || this.returnState === 3) {
          if (tap.key === '1') {
            this.tapData.map((item) => {
              item.isActive = false
              return item
            })
            tap.isActive = true
            this.tapShow = true
          };
          if (tap.key === '2') {
            if (this.isShowBtn) {
              if (!this.noData && !this.isComplete) {
                this.$Modal.confirm({
                  title: '温馨提示',
                  content: '有冲突，确认去启动吗？',
                  onOk: () => {
                    this.tapData.map((item) => {
                      item.isActive = false
                      return item
                    })
                    tap.isActive = true
                    tap.colorN = '#333'
                    this.tapShow = false
                  },
                  onClose: () => {
                    this.tapShow = true
                  }
                })
              } else if (this.isComplete) {
                this.tapData.map((item) => {
                  item.isActive = false
                  return item
                })
                tap.isActive = true
                tap.colorN = '#333'
                this.tapShow = false
              }
            }
          }
          this.startTip = false // 隐藏排课工具下载框
          this.modalLog = false
        }
      },
      // 校验数据
      checkData () {
        this.processData.map((item) => {
          item.status = 0
          return item
        })
        this.isCheckShow = true
        this.isComplete = false
        this.noData = false
        this.num = 0
        this.falseNum = 0
        this.completeTime = new Date()
        this.getFunc(this.num)
        this.isShowBtn = false
        this.isOnGoing = true
      },
      async getFunc (i) {
        this.processData[i].status = 1
        this.percentVal = 0
        this.percentFun()
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StartSlover/${this.processData[i].url}`, {
          classTableID: this.classPlan.classTableID
        }, true)
        this.xy.unloading()
        if (res.success) {
          this.processData[i].status = 2
        } else {
          this.falseNum++
          this.processData[i].status = 3
          this.processData[i].errorFile = res.msg
        };
        this.num++
        if (this.num < 5) {
          this.getFunc(this.num)
        } else {
          this.num = 4
          if (this.falseNum > 0) {
            this.isComplete = false
            this.isCheckShow = true
          } else {
            this.isComplete = true
            this.isCheckShow = false
            // 都成功之后再跳转
            this.tapShow = false// 校验数据成功后直接显示启动tap
            this.tapData.map((item) => {
              item.isActive = false
              return item
            })
            this.tapData[1].isActive = true
          }
          this.isOnGoing = false
          this.isShowBtn = true
          var nowDate = new Date()
          this.completeTime = this.formatSeconds((nowDate.getTime() - this.completeTime.getTime()) / 1000)
          this.tapData[1].colorN = '#333' // 不自动跳转但是可点击跳转
          // 自动跳转启动排课
          // this.tapData[1].colorN = '#333'
          // this.tapShow = false// 校验数据成功后直接显示启动tap
          // this.tapData.map((item) => {
          //   item.isActive = false
          //   return item
          // })
          // this.tapData[1].isActive = true
          // 自动跳转启动排课
        }
      },
      // 下载错误信息
      downErrorFile (val) {
        this.download('error.txt', val.errorFile)
      },
      download (fileName, content) {
        if (window.navigator.msSaveOrOpenBlob) {
          // if browser is IE
          var blob = new Blob([decodeURIComponent(encodeURI(content))], {
            type: 'text/csv;charset=utf-8;'
          })
          navigator.msSaveBlob(blob, fileName)
        } else {
          var urlObject = window.URL || window.webkitURL || window
          // eslint-disable-next-line camelcase
          var export_blob = new Blob([content], { type: 'text/plain' })
          // eslint-disable-next-line camelcase
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
          save_link.href = urlObject.createObjectURL(export_blob)
          save_link.download = fileName
          fakeClick(save_link)
        }
        function fakeClick (obj) {
          var ev = document.createEvent('MouseEvents')
          ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          obj.dispatchEvent(ev)
        }
      },
      // 点击日志
      logClick () {
        this.isCheckShow = true
      },
      // 进度条
      percentFun () {
        if (this.percentVal < 90) {
          this.percentVal += 1
          setTimeout(() => {
            this.percentFun()
          }, 200)
        }
      },
      // 秒转时分秒
      formatSeconds (value) {
        var secondTime = parseInt(value)// 秒
        var minuteTime = 0// 分
        var hourTime = 0// 小时
        if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
          // 获取分钟，除以60取整数，得到整数分钟
          minuteTime = parseInt(secondTime / 60)
          // 获取秒数，秒数取佘，得到整数秒数
          secondTime = parseInt(secondTime % 60)
          // 如果分钟大于60，将分钟转换成小时
          if (minuteTime > 60) {
            // 获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60)
            // 获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60)
          }
        }
        var result = '' + parseInt(secondTime) + '秒'

        if (minuteTime > 0) {
          result = '' + parseInt(minuteTime) + '分' + result
        } else {
          result = '' + 0 + '分' + result
        }
        if (hourTime > 0) {
          result = '' + parseInt(hourTime) + '小时' + result
        } else {
          result = '' + 0 + '小时' + result
        }
        return result
      },

      // 切换
      typeChange (type) {
        this.startType = type
      },
      // 启动排课
      startFun (type) {
        if (type === 1) {
          this.startCrouse() // 线上排课
        } else {
          this.startTip = true // 工具排课
          this.getLink()
        }
      },
      async startCrouse () {
        this.btnLoading = true
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverCoreSiteByPaas/StartSlover`, {
          id: this.classPlan.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.sloverTaskID = res.data
          this.LogRefresh(1)
        }
      },
      async getLink () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetSloverCoreSetting`)
        if (res.success) {
          if (res.data.SloverCoreRouseUrl !== '') {
            this.rouseUrl = res.data.SloverCoreRouseUrl
          } else {
            this.rouseUrl = 'javascript:;'
          }
        }
        this.xy.unloading()
      },
      openOther () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/SloverCoreByPaaS/DownloadTool`)
      },
      // 停止 关闭日志
      LogStop () {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要终止这个排课吗？',
          onOk: () => {
            this.LogStopHttp()
          }
        })
      },
      async LogStopHttp () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverCoreSiteByPaas/SloverStop?classTableID=${this.classPlan.classTableID}&sloverTaskID=${this.sloverTaskID}`)
        this.xy.unloading()
        if (res.success) {
          this.modalLog = false
          this.xy.msgSuc('启动排课停止成功。')
          $('.xy-tap-steps li').attr('data-auto', 'loadPage')
        }
      },
      // 刷新 不关闭日志
      async LogRefresh (val) {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetSloverTaskByClassTable`, {
          classTableID: this.classPlan.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          if (val === 1) {
            // 开启日志
            this.modalLog = true
            this.isRefresh = true
          }
          this.btnLoading = false
          this.logList = res.data.LogList
          this.returnState = res.data.Model.ReturnState

          // 完成已读
          if (this.returnState === 3) {
            this.xy.msgSuc('启动成功。')
            this.tapData[0].colorN = '#333'
            $('.xy-tap-steps li').attr('data-auto', 'loadPage')
            this.isRefresh = false
            this.StepsHeader.getGeneralFlows()// 成功后步骤可以点击
          } else {
            this.tapData[0].colorN = '#ddd'
            $('.xy-tap-steps li').attr('data-auto', '')
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.proc-content{
  display: flex;
  .proc-left{
    width: 100px;
    border-right: 1px solid #E8E8E8
  }
  .proc-right{
    flex: 1;
  }
}
.left-box {
    width: 668px;
    height: 631px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 4px 12px 0px rgba(167,167,167,0.4);
    border-radius: 10px;
    margin:50px 0;
    padding:20px 36px;
}
.bottom-btn{
    margin-top:20px;
}
.generate-course-results {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #fff7dd;
    border-radius: 4px;
}
.generate-course-results > .fa {
    color: #df4444;
    line-height: 30px;
    margin-left: 10px;
}
.generate-course-results > .results-notice {
    color: #df4444;
}
.check-list {
    width: 100%;
    min-height: 220px;
}
.check-list li{
    padding:5px 0;
}
.check-list .generate-text{
    font-size:14px;
}
.check-list .ivu-icon{
    font-size:32px;
}
.check-list .ivu-icon-ios-checkmark-circle{
    color:#19be6b;
}
.check-list .ivu-icon-ios-close-circle{
    color:#ed4014;
}
.check-list .fa-spin{
    color:#5cadff;
}
.startCheck{
    max-height:500px;
    overflow-y:scroll;
    margin: 20px;
}
.tap-ul{
    margin:15px 0 0;
}
.tap-ul li{
    height: 35px;
    line-height: 35px;
    margin-bottom: 10px;
    cursor: pointer;
    color: rgba(0,0,0,0.65);
}
.is-active {
  color: #4196FF!important;
  border-right: 2px solid #4196FF;
  font-weight: 700;
}

@media screen and (max-width: 1366px) {
    .left-box {
        width: 600px;
    }
}
// 启动排课样式
.check-header{
  font-size: 20px;
  color: rgba(0,0,0,0.85);
  font-weight: 700;
  text-align: center;
  margin: 40px 0;
}
.radio-box{
  display:flex;
  justify-content: center;
}
.start-box{
  width: 302px;
  height: 342px;
  background: #ffffff;
  border: 1px solid #dadada;
  border-radius: 10px;
  padding: 20px 45px 27px;
  text-align: center;
  cursor: pointer;
}
.cur-type{
  border-color: #1677ff;
}
.start-box.left{
  margin-right: 80px;
}
.start-box .start-img{
  margin-bottom: 25px;
  width: 100%;
}
.start-box .start-text{
  height: 45px;
  margin: 0 0 30px 0;
}
.check-radio{
  font-size: 18px;
  font-weight: 700;
  color: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}
.start-tip{
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.start-tip .no-data-box{
  padding: 50px 0;
}
</style>
