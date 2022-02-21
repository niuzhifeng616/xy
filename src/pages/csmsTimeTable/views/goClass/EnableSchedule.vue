<template>
  <!-- 12.启用课表 -->
  <div class="xy-content-body">
    <div class="box" v-if="dataTable.length > 0">
      <div class="box1" v-for="item in dataTable" :key="item.SloverResultCollectionName">
      <div class="box2">
        <div class="box-top">
          <div class="box-icon">
            <div class="icon-bg">
              <i class="iconfont">&#xe6f4;</i>
            </div>
          </div>
          <div class="box-text">
            <div class="box-tit" :title='item.SloverResultCollectionName' v-text='item.SloverResultCollectionName'></div>
            <div class="box-sta">
              <div class="box-sta-release">
                <p>发布状态：</p>
                <p v-if="item.IsPublished"><span class="cire"></span>已发布</p>
                <p v-else>未发布</p>
              </div>
              <div class="box-sta-start">
                <p>启用状态：</p>
                <p style="color:#5cadff" v-if="item.IsEnabled === 0">未用</p>
                <p style="color:#19be6b" v-if="item.IsEnabled === 1">启用</p>
                <p style="color:#f90" v-if="item.IsEnabled === 2">停用</p>
              </div>
            </div>
          </div>
        </div>
        <div class="box-but">
          <Button type="text" :class="item.IsEnabled === 1 ? 'disabled' : ''" @click="IsEnableFun(item)"><i class="iconfont">&#xe6f4;</i>启用课表</Button>
          <i></i>
          <Button type="text" :class="item.IsEnabled === 1 ? '' : 'disabled'" @click="isDisableFun(item)"><i class="iconfont">&#xe674;</i>停用课表</Button>
        </div>
      </div>
      </div>
    </div>
    <div v-if="dataTable.length === 0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">
            您还没有要启用的课表，请新建课表。
        </span>
    </div>

    <!--<div id="Tablemix"></div>-->
    <!-- 启用课表后展示 -->
    <modal v-model="modalStart"
           title="启用课表"
           :transfer="false"
           :mask-closable="false"
           width="750px">
        <div style="font-size:14px;" id="setTimeSelect">
            <div class="startCheck" v-if="!isComplete">
                <div class="generate-course-results" v-if="!isComplete">
                    <span class="iconfont" v-if="!ieError" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
                    <span class="results-notice" v-if="!ieError">正在启用课表，请勿进行其他操作。</span>
                    <span class="results-notice" v-if="ieError" style="padding-left:5px;">
                        完成校验冲突
                        <!--<span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="">，请点击下载冲突原因</span>-->
                    </span>
                </div>
                <div class="result-head" style="margin-top:20px;">
                    <span>数据队列：</span>
                    <span style="margin-left:5px;">{{current}}/{{total}}</span>
                </div>
                <ul class="clearfix check-list">
                    <li data-index="0" class="complete-option" v-for="item in enableInfo" :key="item.dis">
                        <!-- 等待 -->
                        <span class="state-complete" v-if="item.status === 0">
                            <span class="generate-text">正在等待生成{{item.dis}}。</span>
                        </span>
                        <!-- 进行中 -->
                        <span v-if="item.status === 1">
                            <span class="data-list-state">
                                <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                            </span>
                            <span class="generate-text">正在生成{{item.dis}}。</span>
                            <i-progress :percent="percentVal" status="active" :stroke-width="16" />
                        </span>
                        <!-- 成功 -->
                        <span v-if="item.status === 2">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="ios-checkmark-circle" />
                            </span>
                            <span class="generate-text">成功生成{{item.dis}}。</span>
                        </span>
                        <!-- 失败 -->
                        <span v-if="item.status === 3">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="md-close-circle" color="#ed4014" />
                            </span>
                            <span class="generate-text">生成{{item.dis}}失败。</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="isComplete" class="text-center" style="min-height:300px;">
            <Icon type="ios-checkmark-circle" size="60" style="color:#42d456;margin-top:90px;" />
            <p style="font-size:16px;margin:10px;">
                该结果共耗时{{completeTime}}，成功启用课表。点击查看
                <span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="isComplete = false">日志明细</span>
            </p>
        </div>
        <div slot="footer">
            <Button class="xy-modal-primary" shape="circle" v-if="modalClose" @click="modalStart =false">关闭</Button>
        </div>

    </modal>

    <!-- 停用课表后展示 -->
    <modal v-model="modalEnd"
            :transfer="false"
            title="停用课表"
            :mask-closable="false"
            width="750px">
        <div style="font-size:14px;" id="setTimeSelect">
            <div class="startCheck" v-if="!isCompleteUn">
                <div class="generate-course-results" v-if="!isCompleteUn">
                    <span class="iconfont" v-if="!ieError1" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
                    <span class="results-notice" v-if="!ieError1">正在停用课表，请勿进行其他操作。</span>
                    <span class="results-notice" v-if="ieError1" style="padding-left:5px;">
                        完成校验冲突
                        <!--<span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="">冲突原因</span>-->
                    </span>
                </div>
                <div class="result-head" style="margin-top:20px;">
                    <span>数据队列：</span>
                    <span style="margin-left:5px;">{{current}}/{{total}}</span>
                </div>
                <ul class="clearfix check-list">
                    <li data-index="0" class="complete-option" v-for="item in enableInfo" :key="item.dis">
                        <!-- 等待 -->
                        <span class="state-complete" v-if="item.status === 0">
                            <span class="generate-text">正在等待删除{{item.dis}}。</span>
                        </span>
                        <!-- 进行中 -->
                        <span v-if="item.status === 1">
                            <span class="data-list-state">
                                <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                            </span>
                            <span class="generate-text">正在删除{{item.dis}}。</span>
                            <i-progress :percent="percentVal" status="active" :stroke-width="16" />
                        </span>
                        <!-- 成功 -->
                        <span v-if="item.status === 2">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="ios-checkmark-circle" />
                            </span>
                            <span class="generate-text">成功删除{{item.dis}}。</span>
                        </span>
                        <!-- 失败 -->
                        <span v-if="item.status === 3">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="md-close-circle" color="#ed4014" />
                            </span>
                            <span class="generate-text">删除{{item.dis}}失败。</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="isCompleteUn" class="text-center" style="min-height:300px;">
            <Icon type="ios-checkmark-circle" size="60" style="color:#42d456;margin-top:90px;" />
            <p style="font-size:16px;margin:10px;">
                该结果共耗时{{completeTimeUn}}，成功停用课表。点击查看
                <span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="isCompleteUn = false">日志明细</span>
            </p>
        </div>
        <div slot="footer">
            <Button class="xy-modal-primary" shape="circle" v-if="modalClose" @click="modalEnd =false">关闭</Button>
        </div>
    </modal>
</div>
</template>
<script>

  export default {
    components: {

    },
    name: 'EnableSchedule',
    data () {
      return {
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        completeTime: '',
        completeTimeUn: '',
        scheduleName: '',
        editorNameRow: '',
        modalAddCrouseTable: false,
        enableInfo: [],
        total: '',
        isComplete: false,
        isCompleteUn: false,
        ieError: false,
        ieError1: false,
        modalClose: false,
        percentVal: 0,
        current: 1,
        modalStart: false,
        modalEnd: false,
        dataTable: []
      }
    },

    created () {
    },
    mounted () {
      this.getTP()
    },
    methods: {
      // 获取列表
      async getTP () {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverResultCollection/GetSloverResultCollectionList`, params)
        this.xy.unloading()
        if (res.success) {
          this.dataTable = res.data
        }
      },
      // 启用课表或停用课表
      IsEnableFun (row) { // 启用课表
        if (row.IsUse) {
          this.isComplete = false
          this.isCompleteUn = false
          this.ieError = false
          this.ieError1 = false
          this.modalClose = false
          if (row.IsEnabled !== 1) { // 停用课表
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要启用课表吗？',
              onOk: () => {
                this.enableCrouse(row.SloverResultCollectionID)
              }
            })
          }
        } else {
          this.xy.msgError('课表未生成。')
        }
      },
      isDisableFun (row) { // 停用课表
        if (row.IsUse) {
          this.isComplete = false
          this.isCompleteUn = false
          this.ieError = false
          this.ieError1 = false
          this.modalClose = false
          if (row.IsEnabled === 1) { // 停用课表
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要停用课表吗？',
              onOk: () => {
                this.UnEnableCrouse(row.SloverResultCollectionID)
              }
            })
          }
        } else {
          this.xy.msgError('课表未生成。')
        }
      },
      // 停用课表
      async UnEnableCrouse (SloverResultCollectionID) {
        this.completeTimeUn = new Date()
        // 暂时隐藏loading,loading过程中弹框出现滚动条，加loading后无法滚动查看进度
        // this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: SloverResultCollectionID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GenerateTimeTableInfo`, params, true)
        if (res.success) {
          let resData = res.data
          this.enableInfo = []
          for (let i = 0; i < resData.Date.length; i++) {
            this.enableInfo.push({// status:0等待；1进行中；2成功；3失败
              startDate: resData.Date[i].StartDate,
              endDate: resData.Date[i].EndDate,
              dis: '本排课方案' + resData.Date[i].StartDate + '至' + resData.Date[i].EndDate + '的课表数据',
              status: 0
            })
          };
          this.enableInfo.push({
            dis: '课表结果数据',
            status: 0
          })
          this.enableInfo.push({
            dis: '排课方案',
            status: 0
          })
          this.total = this.enableInfo.length
          this.modalEnd = true
          this.postUnGenerateTimeTable(resData, 0, this.enableInfo.length)
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        }
      },
      // 停用课表分步请求
      async postUnGenerateTimeTable (resData, j, length) {
        this.percentVal = 0
        this.enableInfo[j].status = 1
        this.isCompleteUn = false
        if (j < length) {
          this.current = j + 1
        };
        if (j + 1 === length) { // 最后一次执行停用课表
          let params = {
            id: resData.sloverResultCollectionID
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTableUnEnabled`, params, true)
          this.xy.unloading()
          if (res.success) {
            this.enableInfo[j].status = 2
            let nowDate = new Date()
            this.completeTimeUn = this.formatSeconds((nowDate.getTime() - this.completeTimeUn.getTime()) / 1000)
            this.isCompleteUn = true
            this.modalClose = true
            this.ieError1 = true
            this.$parent.getGeneralFlows() // 停用成功
            this.getTP()
          } else {
            this.xy.msgError(res.msg)
            this.enableInfo[j].status = 3
            this.modalClose = true
          }
          return false
        }
        this.percentFun()
        if (j + 2 === length) { // 倒数第二次执行
          let params = {
            id: this.classTableID
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/UnGenerateTimeTableResult`, params, true)
          if (res.success) {
            this.enableInfo[j].status = 2
            if (j < length) {
              j++
              this.postUnGenerateTimeTable(resData, j, this.total)
            }
          } else {
            this.xy.msgError(res.msg)
            this.enableInfo[j].status = 3
            this.modalClose = true
          }
        };
        if (j + 2 < length) {
          let params = {
            ClassTableID: this.classTableID,
            SloverResultCollectionID: resData.sloverResultCollectionID,
            StartDate: this.enableInfo[j].startDate,
            EndDate: this.enableInfo[j].endDate
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/UnGenerateTimeTable`, params, true)
          if (res.success) {
            this.enableInfo[j].status = 2
            this.percentVal = 100
            if (j < length) {
              j++
              this.postUnGenerateTimeTable(resData, j, this.total)
            }
          } else {
            this.xy.msgError(res.msg)
            this.enableInfo[j].status = 3
            this.modalClose = true
          }
        };
      },

      // 启用课表
      async enableCrouse (SloverResultCollectionID) {
        this.completeTime = new Date()
        // 暂时隐藏loading,loading过程中弹框出现滚动条，加loading后无法滚动查看进度
        // this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: SloverResultCollectionID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GenerateTimeTableInfo`, params, true)
        if (res.success) {
          let resData = res.data
          this.enableInfo = []
          for (let i = 0; i < resData.Date.length; i++) {
            this.enableInfo.push({// status:0等待；1进行中；2成功；3失败
              startDate: resData.Date[i].StartDate,
              endDate: resData.Date[i].EndDate,
              dis: '本排课方案' + resData.Date[i].StartDate + '至' + resData.Date[i].EndDate + '的课表数据',
              status: 0
            })
          };
          this.enableInfo.push({
            dis: '课表结果数据',
            status: 0
          })
          this.enableInfo.push({
            dis: '排课方案',
            status: 0
          })
          this.total = this.enableInfo.length
          this.modalStart = true
          this.postGenerateTimeTable(resData, 0, this.enableInfo.length)
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        }
        // console.log(this.enableInfo)
      },
      // 启用课表分步请求
      async postGenerateTimeTable (resData, j, length) {
        this.percentVal = 0
        this.enableInfo[j].status = 1
        this.isComplete = false
        if (j < length) {
          this.current = j + 1
        }
        if (j + 1 === length) { // 最后一次执行完成后启用课表
          let params = {
            id: resData.sloverResultCollectionID
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTableEnabled`, params, true)
          this.xy.unloading()
          if (res.success) {
            this.enableInfo[j].status = 2
            let nowDate = new Date()
            this.completeTime = this.formatSeconds((nowDate.getTime() - this.completeTime.getTime()) / 1000)
            this.isComplete = true
            this.modalClose = true
            this.ieError = true
            this.$parent.getGeneralFlows() // 启用成功
            this.getTP()
          } else {
            this.xy.msgError(res.msg)
            this.enableInfo[j].status = 3
            this.modalClose = true
          }
          return false
        }
        this.percentFun()
        if (j + 2 === length) { // 倒数第二次执行
          let params = {
            ClassTableID: this.classTableID,
            SloverResultCollectionID: resData.sloverResultCollectionID
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/GenerateTimeTableResult`, params, true)
          if (res.success) {
            this.enableInfo[j].status = 2
            if (j < length) {
              j++
              this.postGenerateTimeTable(resData, j, this.total)
            };
          } else {
            this.xy.msgError(res.msg)
            this.enableInfo[j].status = 3
            this.modalClose = true
          }
        };
        if (j + 2 < length) {
          let params = {
            ClassTableID: this.classTableID,
            SloverResultCollectionID: resData.sloverResultCollectionID,
            StartDate: this.enableInfo[j].startDate,
            EndDate: this.enableInfo[j].endDate
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/GenerateTimeTable`, params, true)
          if (res.success) {
            this.enableInfo[j].status = 2
            this.percentVal = 100
            if (j < length) {
              j++
              this.postGenerateTimeTable(resData, j, this.total)
            }
          } else {
            this.xy.msgError(res.msg)
            this.enableInfo[j].status = 3
            this.modalClose = true
          }
        };
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
        let secondTime = parseInt(value)// 秒
        let minuteTime = 0// 分
        let hourTime = 0// 小时
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
        let result = '' + parseInt(secondTime) + '秒'

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
      }
    }
  }
</script>
<style lang="less" scoped>
.box {
    display: flex;
    flex-flow: row wrap;
    .box1 {
      width: 299px;
      height: 184px;
      margin-top: 20px;
      .box2 {
        width: 95%;
        height: 100%;
        border-radius:2px;
        border:1px solid rgba(233,233,233,1);
        .box-top {
          height: 80%;
          display: flex;
          .box-icon {
            display: flex;
            justify-content: center;
            width: 30%;
            .icon-bg {
              display: flex;
              justify-content: center;
              align-items: center;
              background: #FFBF00;
              width:48px;
              height:48px;
              border-radius: 50%;
              margin-top: 24px;
              i {
                color: #FFF;
              }
            }
          }
          .box-text {
            margin-top: 24px;
            width: 60%;
            display: flex;
            flex-flow: column nowrap;
            .box-tit {
              height: 30%;
              // display: flex;
              // justify-content: center;
              // align-items: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color:rgba(0,0,0,0.85);
              font-size: 16px;
            }
            .box-sta {
              // display: flex;
              // justify-content: center;
              color: rgba(0,0,0,0.45);
              font-size: 14px;
              .cire {
                display: inline-block;
                width:6px;
                height:6px;
                background:rgba(82,196,26,1);
                border-radius: 50%;
                margin-right: 5px;
              }
              .box-sta-release, .box-sta-start {
                display: flex;
                width: 100%;
                height: 70%;
              }
            }
          }
        }
        .box-but {
          height: 20%;
          display: flex;
          align-items: center;
          button {
            width: 49.5%;
           color: rgba(0,0,0,0.45);
            i {
              font-size: 12px;
              margin-right: 5px;
              color: #878889;
            }
          }
          .box-but-gp {
            text-align: center;
            width: 49.5%;
          }
          button:hover {
            background: rgba(247,249,250,1) !important;
            color: #1890FF;
            i {
              color: #1890FF;
            }
          }
          background:rgba(247,249,250,1);
          > i {
            width: 1px;
            height:16px;
            background:rgba(232,232,232,1);
          }
        }
      }
    }
  }
.disabled {
    color: #c5c8ce !important;
    background-color: #f7f7f7 !important;
    cursor: not-allowed !important;
    i {
      color: #c5c8ce !important;
    }
  }
/*
   �����α�
*/
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
}
</style>
