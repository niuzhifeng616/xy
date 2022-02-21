<template>
  <!-- 13.发布启用 -->
  <div class="xy-content-body">
      <ul class="schedule-ul" v-if="dataTable.length>0">
          <li class="schedule-li" v-for="(item, index) in dataTable" :key="index">
              <div class="shedule-info">
                  <span class="shedule-icon"><i class="iconfont">&#xe6f4;</i></span>
                  <div class="shedule-right">
                      <span class="shedule-name nowrap"
                            :title="item.SloverResultCollectionName" >{{item.SloverResultCollectionName}}</span>
                      <div class="shedule-status">
                          <div class="">
                            <!-- 发布状态： -->
                            <span v-if="item.IsPublished">已发布</span>
                            <span v-if="!item.IsPublished">未发布</span>
                          </div>
                          <div class="">
                              <span class="dot" :style="{background:item.IsEnabled === 0? '#f7c375': item.IsEnabled === 1 ? '#52C41A' :'#f35f58'}"></span>
                              <!-- 启用状态： -->
                              <span v-if="item.IsEnabled === 0">未用</span>
                              <span v-if="item.IsEnabled === 1">启用</span>
                              <span v-if="item.IsEnabled === 2">停用</span>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="shedule-bottom">
                  <span class=""
                          :class="item.IsEnabled === 1?'btn-disabled':''"
                          v-if="item.IsPublished"
                          @click="IsPublishedFun(item)">
                          <i class="iconfont">&#xe70d;</i>
                      取消发布
                  </span>
                  <span class=""
                          :class="item.IsEnabled === 1?'btn-disabled':''"
                          v-if="!item.IsPublished"
                          @click="IsPublishedFun(item)">
                          <i class="iconfont">&#xe70b;</i>
                      发布课表
                  </span>
                  <em class="line">|</em>
                  <span class=""
                          :class="item.IsPublished ?'':'btn-disabled'"
                          v-if="item.IsEnabled===1"
                          @click="IsEnableFun(item)">
                          <i class="iconfont">&#xe70c;</i>
                      停用课表
                  </span>
                  <span class=""
                          :class="item.IsPublished?'':'btn-disabled'"
                          v-if="item.IsEnabled!==1"
                          @click="IsEnableFun(item)">
                          <i class="iconfont">&#xe70a;</i>
                      启用课表
                  </span>
              </div>
          </li>
      </ul>
      <div v-if="dataTable.length === 0" class="no-data-box">
          <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" alt="" />
          <span class="no-data-text">暂无课表信息。</span>
      </div>
      <!-- 启用课表后展示 -->
      <Modal v-model="modalStart"
            :transfer="false"
            title="启用课表"
            :mask-closable="false"
            :closable="false"
            width="750px">
          <div style="font-size:14px;" id="setTimeSelect">
              <div class="startCheck" v-if="!isComplete">
                  <div class="generate-course-results" v-if="!isComplete">
                      <span class="iconfont" v-if="!ieError" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
                      <span class="results-notice" v-if="!ieError">正在启用课表，请勿进行其他操作。</span>
                      <span class="results-notice" v-if="ieError">
                          完成校验冲突
                          <!--<span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="">，请点击下载冲突原因</span>-->
                      </span>
                  </div>
                  <div class="result-head" style="margin-top:20px;">
                      <span>数据队列：</span>
                      <span style="margin-left:5px;" >{{current}}/{{total}}</span>
                  </div>
                  <ul class="clearfix check-list">
                      <li data-index="0" class="complete-option" v-for="(item, index) in enableInfo" :key="index">
                          <!-- 等待 -->
                          <span class="state-complete" v-if="item.status === 0">
                              <span class="generate-text" >正在等待生成{{item.dis}}。</span>
                          </span>
                          <!-- 进行中 -->
                          <span v-if="item.status === 1">
                              <span class="data-list-state">
                                  <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                              </span>
                              <span class="generate-text" >正在生成{{item.dis}}。</span>
                              <i-progress :percent="percentVal" status="active" :stroke-width="16" />
                          </span>
                          <!-- 成功 -->
                          <span v-if="item.status === 2">
                              <span class="data-list-state data-list-state-error">
                                  <Icon type="ios-checkmark-circle" />
                              </span>
                              <span class="generate-text" >成功生成{{item.dis}}。</span>
                          </span>
                          <!-- 失败 -->
                          <span v-if="item.status === 3">
                              <span class="data-list-state data-list-state-error">
                                  <Icon type="md-close-circle" color="#ed4014" />
                              </span>
                              <span class="generate-text" >生成{{item.dis}}失败。</span>
                          </span>
                      </li>
                  </ul>
              </div>
          </div>
          <div v-if="isComplete" class="text-center" style="min-height:300px;">
              <Icon type="ios-checkmark-circle" size="60" style="color:#42d456;margin-top:90px;" />
              <p style="font-size:16px;margin:10px;" >
                  该结果共耗时{{completeTime}}，成功启用课表。点击查看
                  <span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="isComplete = false">日志明细</span>
              </p>
          </div>
          <div slot="footer">
              <Button class="xy-modal-primary"  shape="circle" v-if="modalClose" @click="modalStart =false">关闭</Button>
          </div>

      </Modal>

      <!-- 停用课表后展示 -->
      <Modal v-model="modalEnd"
            :transfer="false"
            title="停用课表"
            :mask-closable="false"
            :closable="false"
            width="750px">
          <div style="font-size:14px;" id="setTimeSelect">
              <div class="startCheck" v-if="!isCompleteUn">
                  <div class="generate-course-results" v-if="!isCompleteUn">
                      <span class="iconfont" v-if="!ieError1" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
                      <span class="results-notice" v-if="!ieError1">正在停用课表，请勿进行其他操作。</span>
                      <span class="results-notice" v-if="ieError1">
                          完成校验冲突
                          <!--<span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="">冲突原因</span>-->
                      </span>
                  </div>
                  <div class="result-head" style="margin-top:20px;">
                      <span>数据队列：</span>
                      <span style="margin-left:5px;" >{{current}}/{{total}}</span>
                  </div>
                  <ul class="clearfix check-list">
                      <li data-index="0" class="complete-option" v-for="(item, index) in enableInfo" :key="index">
                          <!-- 等待 -->
                          <span class="state-complete" v-if="item.status === 0">
                              <span class="generate-text" >正在等待删除{{item.dis}}。</span>
                          </span>
                          <!-- 进行中 -->
                          <span v-if="item.status === 1">
                              <span class="data-list-state">
                                  <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                              </span>
                              <span class="generate-text" >正在删除{{item.dis}}。</span>
                              <i-progress :percent="percentVal" status="active" :stroke-width="16" />
                          </span>
                          <!-- 成功 -->
                          <span v-if="item.status === 2">
                              <span class="data-list-state data-list-state-error">
                                  <Icon type="ios-checkmark-circle" />
                              </span>
                              <span class="generate-text" >成功删除{{item.dis}}。</span>
                          </span>
                          <!-- 失败 -->
                          <span v-if="item.status === 3">
                              <span class="data-list-state data-list-state-error">
                                  <Icon type="md-close-circle" color="#ed4014" />
                              </span>
                              <span class="generate-text" >删除{{item.dis}}失败。</span>
                          </span>
                      </li>
                  </ul>
              </div>
          </div>
          <div v-if="isCompleteUn" class="text-center" style="min-height:300px;">
              <Icon type="ios-checkmark-circle" size="60" style="color:#42d456;margin-top:90px;" />
              <p style="font-size:16px;margin:10px;" >
                  该结果共耗时{{completeTimeUn}}，成功停用课表。点击查看
                  <span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="isCompleteUn = false">日志明细</span>
              </p>
          </div>
          <div slot="footer">
              <Button class="xy-modal-close" v-if="modalClose" @click="modalEnd =false">关闭</Button>
          </div>

      </Modal>

      <!-- 发布有冲突，是否下载 -->
      <Modal v-model="modalCheck"
            :mask-closable="false"
            :closable="false"
            title="冲突提示"
            :transfer="false">
          <div style="font-size:14px;">
              <p>是否强制发布？</p>
              <span @click="downError" style="color:#5cadff;margin-top:10px;cursor:pointer">下载冲突详情</span>
          </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="modalCheck = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="timeTablePublished(errorSloverResultCollectionID)">确定</Button>
          </div>
      </Modal>
  </div>
</template>
<script>
  export default {
    name: 'TLLookSchedule',
    components: {
    },
    data () {
      return {
        completeTime: '',
        completeTimeUn: '',
        enableInfo: [],
        isComplete: false,
        isCompleteUn: false,
        ieError: false,
        ieError1: false,
        modalClose: false,
        percentVal: 0,
        current: 1,
        modalStart: false,
        modalEnd: false,

        total: '',
        dataTable: [],
        // 下载冲突
        errorSloverResultCollectionID: '',
        modalCheck: false,
        errorMsg: '',

        isOperation: true,
        classTableID: 0
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.rowObj.ClassTableID
    },
    mounted () {
      this.getTP()
    },
    methods: {
      // 获取列表
      async getTP () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverResultCollection/GetSloverResultCollectionList`, {
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.dataTable = res.data
        }
      },
      // 发布或取消课表
      async IsPublishedFun (row) {
        if (row.IsEnabled !== 1) {
          if (row.IsPublished) { // 取消课表
            let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTableUnPublished`, {
              id: row.SloverResultCollectionID
            })
            if (res.success) {
              this.xy.msgSuc('取消课表成功。')
              this.$parent.getGeneralFlows()
              this.getTP()
            }
          } else { // 发布课表
            var index = this.dataTable.map((item) => { return item.IsPublished }).indexOf(true)
            if (index > -1) {
              this.xy.msgError('已存在发布成功的课表。')
              return false
            };
            let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTablePublishedForCheck`, {
              ClassTableID: this.classTableID,
              SloverResultCollectionID: row.SloverResultCollectionID
            })
            if (res.success) {
              this.timeTablePublished(row.SloverResultCollectionID)
            } else {
              this.modalCheck = true
              this.errorSloverResultCollectionID = row.SloverResultCollectionID
              this.errorMsg = res.data
            };
          }
        }
      },
      // 下载冲突信息
      downError () {
        var errorMsg = ''
        for (var i = 0; i < this.errorMsg.length; i++) {
          errorMsg += this.errorMsg[i] + '\r\n'
        }
        this.download('error.txt', errorMsg)
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
      // 发布课表
      async timeTablePublished (sloverResultCollectionID) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTablePublished`, {
          ClassTableID: this.classTableID,
          SloverResultCollectionID: sloverResultCollectionID
        })
        if (res.success) {
          this.xy.msgSuc('发布课表成功。')
          this.$parent.getGeneralFlows()
          this.modalCheck = false
          this.getTP()
        }
      },
      // 启用课表或停用课表
      IsEnableFun (row) {
        if (row.IsPublished) {
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
          } else { // 启用课表
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要启用课表吗？',
              onOk: () => {
                this.enableCrouse(row.SloverResultCollectionID)
              }
            })
          }
        }
      },
      // 停用课表
      async UnEnableCrouse (SloverResultCollectionID) {
        this.completeTimeUn = new Date()
        // 暂时隐藏loading,loading过程中弹框出现滚动条，加loading后无法滚动查看进度
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GenerateTimeTableInfo`, {
          classTableID: this.classTableID,
          sloverResultCollectionID: SloverResultCollectionID
        }, true)
        if (res.success) {
          var resData = res.data
          this.enableInfo = []
          for (var i = 0; i < resData.Date.length; i++) {
            this.enableInfo.push({// status:0等待；1进行中；2成功；3失败
              startDate: this.xy.moment(resData.Date[i].StartDate).format('YYYY-MM-DD'),
              endDate: this.xy.moment(resData.Date[i].EndDate).format('YYYY-MM-DD'),
              dis: '本排课方案' + this.xy.moment(resData.Date[i].StartDate).format('YYYY-MM-DD') +
                '至' + this.xy.moment(resData.Date[i].EndDate).format('YYYY-MM-DD') + '的课表数据',
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
          this.modalEnd = true
          this.total = this.enableInfo.length
          this.postUnGenerateTimeTable(resData, 0, this.enableInfo.length)
        } else {
          this.xy.unloading()
          this.xy.msgError(res.msg)
        }
      },
      // 停用课表分步请求
      async postUnGenerateTimeTable (resData, j, length) {
        this.enableInfo[j].status = 1
        this.percentVal = 0
        if (j < length) {
          this.current = j + 1
        };
        if (j + 1 === length) { // 最后一次执行停用课表
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTableUnEnabled`, {
            id: resData.sloverResultCollectionID
          }, true)
          this.xy.unloading()
          if (res.success) {
            this.enableInfo[j].status = 2
            var nowDate = new Date()
            this.completeTimeUn = this.formatSeconds((nowDate.getTime() - this.completeTimeUn.getTime()) / 1000)
            this.isCompleteUn = true
            this.modalClose = true
            this.ieError1 = true
            this.getTP()
          } else {
            this.xy.msgError(res.msg)
            this.enableInfo[j].status = 3
            this.modalClose = true
          };
        }
        this.percentFun()
        if (j + 2 === length) { // 倒数第二次执行
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/UnGenerateTimeTableResult`, {
            id: this.classTableID
          }, true)
          if (res.success) {
            this.enableInfo[j].status = 2
            if (j < length) {
              j++
              this.postUnGenerateTimeTable(resData, j, this.total)
            };
          } else {
            this.xy.msgError(res.msg)
            this.enableInfo[j].status = 3
            this.modalClose = true
          };
        };
        if (j + 2 < length) {
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/UnGenerateTimeTable`, {
            ClassTableID: this.classTableID,
            SloverResultCollectionID: resData.sloverResultCollectionID,
            StartDate: this.enableInfo[j].startDate,
            EndDate: this.enableInfo[j].endDate
          }, true)
          if (res.success) {
            this.enableInfo[j].status = 2
            this.percentVal = 100
            if (j < length) {
              j++
              this.postUnGenerateTimeTable(resData, j, this.total)
            };
          } else {
            this.xy.msgError(res.msg)
            this.enableInfo[j].status = 3
            this.modalClose = true
          };
        };
      },
      // 启用课表
      async enableCrouse (SloverResultCollectionID) {
        this.completeTime = new Date()
        // 暂时隐藏loading,loading过程中弹框出现滚动条，加loading后无法滚动查看进度
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GenerateTimeTableInfo`, {
          classTableID: this.classTableID,
          sloverResultCollectionID: SloverResultCollectionID
        }, true)
        if (res.success) {
          var resData = res.data
          this.enableInfo = []
          this.total = resData.Date.length
          for (var i = 0; i < resData.Date.length; i++) {
            this.enableInfo.push({// status:0等待；1进行中；2成功；3失败
              startDate: this.xy.moment(resData.Date[i].StartDate).format('YYYY-MM-DD'),
              endDate: this.xy.moment(resData.Date[i].EndDate).format('YYYY-MM-DD'),
              dis: '本排课方案' + this.xy.moment(resData.Date[i].StartDate).format('YYYY-MM-DD') +
                '至' + this.xy.moment(resData.Date[i].EndDate).format('YYYY-MM-DD') + '的课表数据',
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
      },
      // 启用课表分步请求
      async postGenerateTimeTable (resData, j, length) {
        this.enableInfo[j].status = 1
        this.percentVal = 0
        if (j < length) {
          this.current = j + 1
        };
        if (j + 1 === length) { // 最后一次执行完成后启用课表
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTableEnabled`, {
            id: resData.sloverResultCollectionID
          }, true)
          this.xy.unloading()
          if (res.success) {
            this.enableInfo[j].status = 2
            var nowDate = new Date()
            this.completeTime = this.formatSeconds((nowDate.getTime() - this.completeTime.getTime()) / 1000)
            this.isComplete = true
            this.modalClose = true
            this.ieError = true
            this.getTP()
          } else {
            this.xy.msgError(res.msg)
            this.enableInfo[j].status = 3
            this.modalClose = true
          };
        };
        this.percentFun()
        if (j + 2 === length) { // 倒数第二次执行
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/GenerateTimeTableResult`, {
            ClassTableID: this.classTableID,
            SloverResultCollectionID: resData.sloverResultCollectionID
          }, true)
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
          };
        };
        if (j + 2 < length) {
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/GenerateTimeTable`, {
            ClassTableID: this.classTableID,
            SloverResultCollectionID: resData.sloverResultCollectionID,
            StartDate: this.enableInfo[j].startDate,
            EndDate: this.enableInfo[j].endDate
          }, true)
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
          };
        };
      },
      // 进度条
      percentFun () {
        var _this = this
        if (this.percentVal < 90) {
          this.percentVal += 1
          setTimeout(() => {
            _this.percentFun()
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
      }
    }
  }
</script>
<style lang="less" scoped>
.schedule-ul{
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0 10px;
}
.schedule-li {
    width: 24%;
    min-width: 300px;
    max-width: 350px;
    height: 185px;
    border: 1px solid #E9E9E9;
    background: #fff;
    border-radius: 2px;
    padding: 23px 0 0 24px;
    margin: 15px 10px 0 0;
    position: relative;
}
.shedule-info {
    display: flex;
    align-items: center;
}
.shedule-icon {
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-radius: 50%;
    background: #FFBF00;
    margin-right: 13px;
}
.shedule-icon i{
  font-size: 22px;
  color: #fff;
}
.shedule-right{
  position: absolute;
  padding-left: 60px;
}
.shedule-right .shedule-name {
    font-weight: bold;
    color: rgba(0,0,0,0.85);
    font-size: 16px;
    width: 200px;
}
.shedule-right .shedule-status{
  color:rgba(0,0,0,0.45);
  display: flex;
}
.shedule-right .shedule-status >div{
  width: 50%;
  margin-top: 10px;
}
.shedule-right .shedule-status .dot{
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
}
.shedule-bottom{
    position: absolute;
    left: 0;
    bottom: 0;
    background: #F7F9FA;
    border-top: 1px solid #E9E9E9;
    width: 100%;
    height: 48px;
    display: flex;
}
.shedule-bottom .line{
  line-height: 48px;
    color: #E8E8E8;
}
.shedule-bottom > span{
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color:rgba(0,0,0,0.45);
  cursor: pointer;
}
.shedule-bottom > span.btn-disabled {
    color:rgba(0,0,0,0.2);
    cursor:no-drop;
}
.shedule-bottom i.iconfont{
  color: #878889;
  margin-right: 10px;
  width: 15px;
}
/*
  启动课表
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
.modal-section-ul{
    display:flex;
    justify-content:flex-start;
    flex-wrap: wrap;
}
.modal-section-ul li{
     cursor: pointer;
    padding: 16px 0;
    color: #4285f4;
    border: 1px solid #d4e4ff;
    overflow: hidden;
    margin: 10px;
    border-radius: 8px;
    width: 96px;
    text-align: center;
}
.modal-section-ul li:hover{
     color: #fff;
    background-image: -moz-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -webkit-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -ms-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    text-align: center;
    color: #fff;
    transition: all 0.3s;
}
.modal-section-ul .section-active{
    color: #fff;
    background-image: -moz-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -webkit-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -ms-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    text-align: center;
    color: #fff;
    transition: all 0.3s;
}
/*通用*/
.danger-btn {
    padding: 4px 15px;
    color: #4196FF;
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid #4196FF;
    white-space: nowrap;
    line-height: 1.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 12px;
    border-radius: 4px;
    -webkit-transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear,-webkit-box-shadow .2s linear;
    background-color: #fff;
}

    .danger-btn:hover {
        color: #FF8C8C;
        border: 1px solid #FDBBBB;
        background: #FFECED;
        text-decoration: none;
    }

    .danger-btn:active, .danger-btn:focus {
        color: #2b85e4;
        background-color: #fff;
        border-color: #2b85e4;
        outline: 0;
    }

.primary-btn {
    padding: 4px 15px;
    color: #fff;
    border: 1px solid #4196FF;
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    white-space: nowrap;
    line-height: 1.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 12px;
    border-radius: 4px;
    -webkit-transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear,-webkit-box-shadow .2s linear;
    background: #4196FF;
}

    .primary-btn:active, .primary-btn:focus {
        outline: 0;
    }

.primary-btn-ghost {
    padding: 4px 15px;
    color: #4196FF;
    border: 1px solid #4196FF;
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    white-space: nowrap;
    line-height: 1.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 12px;
    border-radius: 4px;
    -webkit-transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear,-webkit-box-shadow .2s linear;
    background-color: #fff;
}

    .primary-btn-ghost:hover {
        background: rgba(65, 150, 255,0.1);
        text-decoration: none;
    }

    .primary-btn-ghost:active, .primary-btn-ghost:focus {
        outline: 0;
    }

.shape-circle {
    border-radius: 32px;
}
@media screen and (max-width: 1366px) {
    .schedule-li {
        margin: 10px;
    }
}
</style>
