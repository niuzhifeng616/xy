<template>
  <!-- 9.发布课表 -->
  <div class="xy-content-body">
    <Alert show-icon >
      <template slot="desc">1. 新存的多张课表只能同时发布一张，发布课表时会自定校验本课表与其他已发布课表的冲突
        （校验同一教师或同一教室是否在同一课位有多门课）。<br /></template>
      <template slot="desc"> 2. 如果要对保存的课表进行调整，点击“更多设置”按钮弹出的“调整课表”菜单进行调整，对此课表的调整结果会实时记录在课表里，无需再“新存一张课表”，但是这种调整要想反映在教师和学生个人课表中，需要重新启用此课表。</template>
    </Alert>
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
              <p v-if="item.IsPublished"><span class="cire"></span>已发布</p>
              <p v-else>未发布</p>
            </div>
          </div>
        </div>
        <div class="box-but">
          <Button v-if="!item.IsPublished" type="text" @click="IsPublishedFun(item)"><i class="iconfont" style="background: none;">&#xe70b;</i>发布课表</Button>
          <Button v-else type="text" @click="IsPublishedFun(item)"><i class="iconfont" style="background: none;">&#xe70d;</i>取消发布</Button>
          <i></i>
          <div class="box-but-gp">
           <dropdown trigger="click" placement="top-start" style="width: 100px">
                    <button type="text"><i class="iconfont">&#xe674;</i>更多设置</button>
                    <dropdown-menu slot="list">
                        <dropdown-item name="1" @click.native="adjustSchedule(item)">调整课表</dropdown-item>
                        <dropdown-item name="3" @click.native="downSchedule(item)">导出课表</dropdown-item>
                        <dropdown-item name="4" @click.native="editorName(item)" :disabled="isOperation1 !== 0">编辑名称</dropdown-item>
                        <dropdown-item name="5" :disabled="item.IsPublished || isOperation1 !== 0" @click.native="delSchedule(item)">删除课表</dropdown-item>
                    </dropdown-menu>
                </dropdown>
          </div>
          <!-- <Button type="text"><i class="iconfont">&#xe674;</i>更多设置</Button> -->
        </div>
      </div>
     </div>
   </div>
    <!-- <ul class="schedule-ul" v-if="dataTable.length > 0">
        <li class="schedule-li" v-for="item in dataTable" :key="item.SloverResultCollectionName">
            <div class="shedule-info">
                <span class="shedule-icon">
                    <Icon type="ios-paper" size="24" color="#4196FF" />
                </span>
                <span class="shedule-name nowrap" :title='item.SloverResultCollectionName'>{{item.SloverResultCollectionName}}</span>
            </div>
            <div class="shedule-info">
                <label class="state-type">发布状态：</label>
                <span class="type-name" v-if="item.IsPublished">已发布</span>
                <span class="type-name" v-if="!item.IsPublished">未发布</span>
            </div>
            <div class="text-center" style="margin-top:60px;">
                <button class="primary-btn-ghost shape-circle"
                         :class="isOperation1 === 0?'':'btn-disabled'"
                        @click="IsPublishedFun(item)">
                    <span v-if="item.IsPublished">取消发布</span>
                    <span v-else>发布课表</span>
                </button>
                <dropdown trigger="click" placement="top-start">
                    <button class="primary-btn shape-circle">更多设置</button>
                    <dropdown-menu slot="list">
                        <dropdown-item name="1" @click.native="adjustSchedule(item)">调整课表</dropdown-item>
                        <dropdown-item name="3" @click.native="downSchedule(item)">导出课表</dropdown-item>
                        <dropdown-item name="4" @click.native="editorName(item)" :disabled="isOperation1 !== 0">编辑名称</dropdown-item>
                        <dropdown-item name="5" :disabled="item.IsPublished || isOperation1 !== 0" @click.native="delSchedule(item)">删除课表</dropdown-item>
                    </dropdown-menu>
                </dropdown>
            </div>
        </li>
    </ul> -->
    <div v-if="dataTable.length === 0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">
            您还没有要发布的课表，请新建课表。
        </span>
    </div>

    <!--<div id="Tablemix"></div>
    <spin size="large" fix v-if="tableShow"></spin>-->
    <!-- 编辑名称 -->
    <modal v-model="modalAddCrouseTable"
            :mask-closable="false"
            title="编辑课表名称"
            width="564"
            v-if="isOperation1 === 0"
            :transfer="false">
        <div style="font-size:14px;">
            <i-form ref="formValidateOK" :model="formValidateOK" :rules="ruleValidateOK" label-position="top" @submit.native.prevent style="width:500px;">
                <form-item label="课表名称" prop="scheduleName" label-for="scheduleName">
                    <i-input v-model="formValidateOK.scheduleName" element-id="scheduleName" clearable style="width: 100%"></i-input>
                </form-item>
            </i-form>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="addCrouseCancel">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="addCrouseSubmit">保存</Button>
        </div>
    </modal>

    <!-- 发布有冲突，是否下载 -->
    <modal v-model="modalCheck"
            :mask-closable="false"
            title="冲突提示"
            v-if="isOperation1 === 0"
            :transfer="false">
        <div style="font-size:14px;">
            <p>是否强制发布？</p>
            <span @click="downError" style="color:#5cadff;margin-top:10px;cursor:pointer">下载冲突详情</span>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalCheck =false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="timeTablePublished(errorSloverResultCollectionID)">确定</Button>
        </div>
    </modal>

</div>
</template>
<script>
  export default {
    components: {
    },
    name: 'ReleaseSchedule',
    data () {
      return {
        isOperation1: this.$store.state.csmstimetable.classComValKW.base.isOperation1,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        completeTime: '',
        loading: true,
        formValidateOK: {
          scheduleName: ''
        },
        ruleValidateOK: {
          scheduleName: [
            { required: true, message: '课表名称不能为空', trigger: 'blur' },
            { max: 40, message: '课表名称不能超过40个字', trigger: 'blur' }
          ]
        },
        editorNameRow: '',
        modalAddCrouseTable: false,
        enableInfo: [],
        total: '',
        isComplete: false,

        modalStartClose: false,
        percentVal: 0,
        current: 1,
        modalStart: false,
        dataTable: [],
        // 下载冲突
        errorSloverResultCollectionID: '',
        modalCheck: false,
        errorMsg: ''
      }
    },

    created () {
    },
    mounted () {
      this.getTP()
    },
    methods: {
      // 获取教师列表
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
      // 发布或取消课表
      async IsPublishedFun (row) {
        let that = this
        if (that.isOperation1 === 0) {
          if (row.IsPublished) { // 取消课表
            that.$Modal.confirm({
              title: '温馨提示',
              content: '确认取消发布"' + row.SloverResultCollectionName + '"吗？',
              async onOk () {
                that.xy.loading()
                let params = {
                  id: row.SloverResultCollectionID
                }
                let res = await that.xy.post(`${that.$store.state.apiPath}/api/SloverResultCollection/TimeTableUnPublished`, params)
                that.xy.unloading()
                if (res.success) {
                  that.xy.msgSuc('取消课表成功。')
                  that.$parent.getGeneralFlows()
                  that.getTP()
                }
              }
            })
          } else { // 发布课表验证
            let index = this.dataTable.map((item) => { return item.IsPublished }).indexOf(true)
            if (index > -1) {
              this.xy.msgError('已存在发布成功的课表。')
              return false
            };
            this.xy.loading()
            let params = {
              ClassTableID: this.classTableID,
              SloverResultCollectionID: row.SloverResultCollectionID
            }
            let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTablePublishedForCheck`, params, true)
            this.xy.unloading()
            if (res.success) {
              this.timeTablePublished(row.SloverResultCollectionID)
            } else {
              this.xy.msgError(res.msg)
              this.modalCheck = true
              this.errorSloverResultCollectionID = row.SloverResultCollectionID
              this.errorMsg = res.data
            }
          }
        }
      },
      // 下载冲突信息
      downError () {
        let errorMsg = ''
        for (let i = 0; i < this.errorMsg.length; i++) {
          errorMsg += this.errorMsg[i] + '\r\n'
        }
        this.download('error.txt', errorMsg)
      },
      download (fileName, content) {
        if (window.navigator.msSaveOrOpenBlob) {
          // if browser is IE
          let blob = new Blob([decodeURIComponent(encodeURI(content))], {
            type: 'text/csv;charset=utf-8;'
          })
          navigator.msSaveBlob(blob, fileName)
        } else {
          let urlObject = window.URL || window.webkitURL || window
          let exportBlob = new Blob([content], { type: 'text/plain' })
          let saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
          saveLink.href = urlObject.createObjectURL(exportBlob)
          saveLink.download = fileName
          this.fakeClick(saveLink)
        }
      },
      fakeClick (obj) {
        let ev = document.createEvent('MouseEvents')
        ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        obj.dispatchEvent(ev)
      },
      // 发布课表
      async timeTablePublished (sloverResultCollectionID) {
        this.xy.loading()
        let params = {
          ClassTableID: this.classTableID,
          SloverResultCollectionID: sloverResultCollectionID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTablePublished`, params)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('发布课表成功。')
          this.modalCheck = false
          this.$parent.getGeneralFlows()
          this.getTP()
        }
      },
      // 调整课表
      adjustSchedule (row) {
        this.$store.commit('csmstimetable/changeManualAdjust', {
          sloverResultCollectionID: row.SloverResultCollectionID,
          showScheduleName: row.SloverResultCollectionName
        })

        this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 7 }) // 要返回的路由
        this.$router.push({
          path: '/xyhome/goClassStepsHeader/adjustHeader',
          query: this.$store.state.common.menuInfo
        })
        this.$parent.tabValue = this.$parent.liData[7].url
      },
      // 导出课表
      downSchedule (row) {
        this.xy.downFile(`${this.$store.state.apiPath}/api/SloverResultCollection/ExportTimeTable?classTableID=${this.classTableID}&sloverResultCollectionID=${row.SloverResultCollectionID}&sloverResultCollectionName=${row.SloverResultCollectionName}`)
      },
      // 编辑名称
      editorName (row) {
        if (this.isOperation1 === 0) {
          this.formValidateOK.scheduleName = row.SloverResultCollectionName
          this.editorNameRow = row
          this.modalAddCrouseTable = true
        }
      },
      async editName () {
        this.xy.loading()
        let params = {
          SloverResultCollectionID: this.editorNameRow.SloverResultCollectionID,
          SloverResultCollectionName: this.formValidateOK.scheduleName
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/EditName`, params)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('编辑课表名称成功。')
          this.modalAddCrouseTable = false
          this.getTP()
        }
      },
      // 保存编辑名称
      async addCrouseSubmit () {
        if (this.isOperation1 === 0) {
          this.$refs.formValidateOK.validate((valid) => {
            if (!valid) {
              this.modalAddCrouseTable = true
            } else {
              this.editName()
            }
          })
        }
      },
      // 取消编辑名称
      addCrouseCancel () {
        this.$refs.formValidateOK.resetFields()
        this.modalAddCrouseTable = false
      },

      // 删除课表
      delSchedule (row) {
        if (this.isOperation1 === 0 && (!row.IsPublished)) {
          let that = this
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除' + row.SloverResultCollectionName + '吗？',
            async onOk () {
              that.xy.loading()
              let params = {
                id: row.SloverResultCollectionID
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/SloverResultCollection/TimeTableDelete`, params)
              that.xy.unloading()
              if (res.success) {
                that.xy.msgSuc('添加删除成功成功。')
                that.getTP()
                that.$parent.getGeneralFlows()
              }
            }
          })
        }
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
              display: flex;
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
            }
          }
        }
        .box-but {
          height: 20%;
          display: flex;
          align-items: center;
          button, .ivu-dropdown {
            width: 49.5%;
           color: rgba(0,0,0,0.45);
            i {
              font-size: 14px;
              margin-right: 5px;
            }
          }
          .ivu-dropdown button {
            border: none;
            width: 100%;
            background: rgba(247,249,250,1);
            outline: none;
          }
          .box-but-gp {
            text-align: center;
            width: 49.5%;
          }
          button:hover, .ivu-dropdown-item:hover {
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
.schedule-li {
    width: 303px;
    height: 232px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 8px 0px rgba(183,183,183,0.5);
    border-radius: 4px;
    padding:22px 12px;
    display:inline-block;
    margin:16px 33px;
}
.shedule-info {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
}
.shedule-icon {
    width: 48px;
    height: 48px;
    line-height: 48px;
    background: rgba(238,245,255,1);
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
}
.shedule-name {
    font-weight: bold;
    color: #444;
    margin-left: 18px;
    width: 200px;
}
.state-type {
    color: #999999;
}
.type-name {
    color: #666666
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
/*ͨ��*/
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

.btn-disabled {
    background-color: #E9E9E9 !important;
    color: #999 !important;
    border: none;
    cursor:no-drop;
}

    .btn-disabled:hover {
        background-color: #E9E9E9 !important;
        color: #999 !important;
        border: none;
        text-decoration: none;
    }

    .btn-disabled:active, .btn-disabled:focus {
        background-color: #E9E9E9 !important;
        color: #999 !important;
        border: none;
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
