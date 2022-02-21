// 学生请假页面通用组件-消息
<template>
  <div class="detail">
    <div class="detailModel">
        <div class="approval-card">
          <div class="main-info">
              <div class="left">
                  <span class="avatar">
                      <img v-if="photo !==''" :src="base + photo" :alt="infos.FullName" style="display:block; width: 50px; height: 50px; border-radius: 50%;">
                      <span v-else :title="infos.FullName"> {{ xy.showName(infos.ApplicantName) }} </span>
                  </span>
                  <p class="name-number">
                      <span class="fullName">{{infos.ApplicantName}}提交的<span v-if="infos.ApplicationType==2">代</span>请假申请</span>
                      <span class="schoolNumber">{{infos.CreateByDate}}</span>
                  </p>
              </div>
              <div class="officeStatus">
                <img class="status-img" v-if="infos.ApplicationState ===2"
                      src="@/assets/common/attendance/seal-pass.png" :alt="infos.ApplicationStateName">
                <img class="status-img" v-else-if="infos.ApplicationState ===3"
                      src="@/assets/common/attendance/seal-refuse.png" :alt="infos.ApplicationStateName">
                <img class="status-img" v-else-if="infos.ApplicationState ===4"
                      src="@/assets/common/attendance/seal-undo.png" :alt="infos.ApplicationStateName">
                <img class="status-img" v-else-if="infos.ApplicationState ===5"
                      src="@/assets/common/attendance/seal-undo.png" :alt="infos.ApplicationStateName">
            </div>
          </div>

            <!-- 中间项 -->
            <ul class="leave-list" style="margin-bottom: 66px;">
                <li class="info-item">
                    <span class="title">请假类型</span>
                    <span class="content">{{infos.LeaveTypeName}}</span>
                </li>
                <li class="info-item">
                    <span class="title">请假学生</span>
                    <span class="content">
                        <span v-for="(item, index) in infos.Details"
                              :key="index"
                              style=" padding:4px 12px;
                                      background:rgba(249,249,249,1);
                                      border:1px solid rgba(217,217,217,1);
                                      border-radius:4px;
                                      margin-right:14px;
                                      margin-bottom:10px;
                                      display: inline-block;">
                            {{item.StudentName}}
                        </span>
                    </span>
                </li>
                <li class="info-item" v-if="infos.IsCycleLeave">
                    <span class="title">周期性请假</span>
                    <span class="content">是</span>
                </li>
                <li class="info-item" v-if="infos.IsCycleLeave" style="display:flex;">
                    <span class="title">请假时间</span>
                    <span>
                        <span class="content"
                              v-for="(item, index) in infos.CycleDetail"
                              :key="index"
                              style="display:block; margin-bottom: 10px;">
                            {{item}}
                        </span>
                    </span>
                </li>
                <li class="info-item" v-else>
                    <span class="title">请假时间</span>
                    <span class="content">
                        {{xy.moment(infos.StartTime).format('YYYY-MM-DD HH:mm')}}
                        -
                        {{xy.moment(infos.EndTime).format('YYYY-MM-DD HH:mm')}}
                    </span>
                </li>
                <li class="info-item">
                    <span class="title">请假原因</span>
                    <span class="content">{{infos.ApplicationDescription}}</span>
                </li>
                <li class="info-item">
                    <span class="title">是否离校</span>
                    <span class="content">
                        {{infos.IsLeaveSchool?"是":"否"}}
                    </span>
                </li>
                <li class="info-item img-list">
                  <span class="title">请假图片</span>
                   <!-- <span v-if="infos.Images.length == 0" class="content">无</span> -->
                    <div v-if="infos.Images && infos.Images.length > 0">
                      <div class="demo-upload-list"
                          v-for="(item, index) in infos.Images"
                          :key="index">
                          <template>
                              <img :src="base + item" style="width: 200px;"/>
                              <div class="demo-upload-list-cover">
                                  <Icon type="ios-eye-outline" @click="handleView(item)"></Icon>
                              </div>
                          </template>
                      </div>
                    </div>
                    <span v-else class="content">无</span>
                    <modal title="查看" v-model="visible">
                        <img :src="base + imgName" v-if="visible" style="width: 100%;">
                    </modal>
                </li>
                <li class="info-item img-list">
                    <!--审批流程-->
                    <WorkflowApproval style="margin-top:15px;" :workflow="workflow"></WorkflowApproval>
                </li>
                <li class="info-item" v-if="!disLook">
                    <span class="title">审批意见</span>
                    <i-input type="textarea" v-model="DeniedDescription" placeholder="请输入审批意见" maxlength="100"></i-input>
                </li>
            </ul>
            <div v-if="isFrom === 0 && (infos.ApplicationStateNew === 0 || infos.ApplicationStateNew === 1)"
              style="margin-top:20px;text-align: center;">
              <Button type="primary" @click="RevokedMine">撤销</Button>
            </div>
            <div v-if="isFrom === 1 && !disLook"
              style="margin-top:20px;text-align: center;">
              <Button class="xy-btn-primary" shape="circle"  @click="editOk(2)">同意</Button>
              <Button class="xy-btn-close" @click="editOk(3)">拒绝</Button>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
  import WorkflowApproval from '@/components/workflow/WorkflowApproval.vue'
  export default {
    components: {
      WorkflowApproval
    },
    props: ['info', 'type', 'code'],
    // props: {
    //   // row
    //   row: {
    //     type: Object
    //   },
    //   // isFrom
    //   isFrom: {
    //     type: Number
    //   },
    //   // tableType
    //   tableType: {
    //     type: String
    //   }
    // },
    name: 'StudentLeaveDetails',
    data () {
      return {
        DetailParameter: '',
        LeaveApplicationID: 0,
        ServiceDoMainName: '',
        disLook: true,
        DeniedDescription: '',
        dataNews: '暂无消息',
        ApprovalFlowNodes: '',
        approvalData: {
          Option: '',
          currentNode: undefined,
          TeacherApplicationID: undefined
        },
        Status: '',
        Option: '',
        imgName: '',
        mInfo: false,
        visible: false,
        ApplicationState: '',
        infos: '',
        workflow: [],
        photo: '',
        isFrom: '',
        /* 详情 */
        modalImport: true,
        // apiPath: 'http://192.168.20.35:5011'
        apiPath: '',
        base: ''
      }
    },
    watch: {
      row (newVal) {
        this.row = newVal
      },
      tableType (newVal) {
        this.tableType = newVal
      }
    },
    // watch: {
    //   mInfo: {
    //     handler (newValue, oldValue) {
    //       this.bus.$emit('mInfo', newValue)
    //     },
    //     deep: true
    //   }
    // },
    created () {
      this.base = `${this.xyApi}/base`
      this.apiPath = `${this.xyApi}/att`
      if (this.$store.state.common.msgParam !== '') {
        let row = JSON.parse(this.$store.state.common.msgParam)
        // 字符串转json
        this.Body = JSON.parse(row.Body)
        if (this.Body != null) {
          this.LeaveApplicationID = this.Body.LeaveApplicationID
        }
        // console.log(this.Body)
        // console.log(this.LeaveApplicationID)
        this.row = row
        // console.log(this.row)
        if (this.row.Subject === '学生请假申请') {
          this.isFrom = 1
          this.tableType = 'approval'
          this.getrows(this.row)
        } else if (this.row.Subject === '学生请假审批结果') {
          this.isFrom = ''
          this.getrows(this.row)
        }
      }
      // type 0  消息列表传过来的值,
      // type 1  模块里传来的值\
      // console.log(this.$store.state.common.msgParam)
      // if (this.type === 0) {
      //   this.ServiceDoMainName = this.info.ServiceDoMainName
      //   // 字符串转json
      //   this.DetailParameter = JSON.parse(this.info.DetailParameter)
      //   if (this.DetailParameter != null) {
      //     this.LeaveApplicationID = this.DetailParameter.LeaveApplicationID
      //   }
      // } else {
      //   // this.ServiceDoMainName = xy.subMenuServiceUrl
      //   this.apiPath = this.$store.state.apiPath
      //   this.LeaveApplicationID = this.info.LeaveApplicationID
      // }
    },
    mounted () {
      this.getrows()
    },
    methods: {
      // 获取上一页参数
      async getrows () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/StudentLeave/GetStudentLeaveByID`, {
            LeaveApplicationID: this.LeaveApplicationID
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.infos = res.data.LeaveModel
          this.photo = this.infos.Icon
          console.log(this.infos)
          if (this.infos.LeaveApplicationID !== 0) {
            this.ApplicationState = this.infos.ApplicationState
            if (this.ApplicationState === 0 || this.ApplicationState === 1) {
              this.disLook = false
            }
            this.DeniedDescription = this.infos.DeniedDescription
          } else {
            this.dataNews = '对不起，此信息已被删除'
          }
          // 判断是否已经撤销 审批 0 未审批    2已审批（通过，拒绝）4撤销
          if (this.ApplicationState === 4) {
            this.disLook = true
          }
          // 审批流相关
          this.ApprovalFlowNodes = res.data.ApprovalFlowNodes
          this.workflow = this.ApprovalFlowNodes
          this.ApprovalFlowNodes.forEach(function (element) {
            // 缩略预览模式开关
            element.isOverviewMode = true
            // 缩略预览列表(不大于5个)
            element.overviewList = []
            // 若该审批项目结束，缩略列表显示最后审批结果的时间与状态
            element.lastComplete_time = undefined
            element.lastComplete_status = undefined

            element.ApprovalMemberList.forEach(function (memberItem, memberIndex) {
              // 缩略图列表仅显示前4个，其余显示省略号；若共5人，则不显示省略号，直接全部显示
              if (memberIndex < 4 || element.ApprovalMemberList.length === 5) {
                element.overviewList.push(memberItem)
              }
              // 该审批流是否完成
              if (element.IsComplete === 1 || element.IsComplete === true) {
                if (element.lastCompleteTime) {
                  var lastTime = new Date(element.lastComplete_time)
                  var thisTime = new Date(memberItem.ApprovalDate)
                  if (memberItem.Status !== '0' && thisTime > lastTime) {
                    element.lastComplete_time = memberItem.ApprovalDate
                    element.lastComplete_status = memberItem.Status
                  }
                } else {
                  if (memberItem.Status !== '0') {
                    element.lastComplete_time = memberItem.ApprovalDate
                    element.lastComplete_status = memberItem.Status
                  }
                }
              }
            })

            if (element.WorkFlowNodeType === 2) {
              // element.WorkFlowNodeType === 2是审批节点
              // 获取当前需审批的节点：第一个非完成节点
              if (this.approvalData.currentNode === undefined && element.ApprovalFlowNodeName !== '发起人' && !element.IsComplete) {
                this.approvalData.currentNode = element
              }

              for (var i = 0; i < element.ApprovalMemberList.length; i++) {
                // 循环当前节点下的所有人
                if (element.ApprovalMemberList[i].UserID === this.$store.state.common.userBaseInfo.UserID) {
                  // 找到当前用户  Status = 0 待审批, 2 已通过，3 已拒绝
                  if (element.ApprovalMemberList[i].Status !== 0) {
                    // 判断当前用户的状态
                    this.Status = element.ApprovalMemberList[i].StatusName
                    this.Option = element.ApprovalMemberList[i].Option
                    this.disLook = true
                    return
                  } else {
                    if (this.approvalData.currentNode !== undefined && this.approvalData.currentNode.ApprovalFlowNodeID === element.ApprovalFlowNodeID) {
                      this.disLook = false
                      return
                    }
                  }
                }
              }
            }

            // 抄送列表，大致逻辑同上
            element.isOverviewMode_CC = true
            element.overviewList_CC = []
            element.ApprovalCCMemberList.forEach(function (CCItem, CCIndex) {
              // 缩略图列表仅显示前4个，其余显示省略号；若共5人，则不显示省略号，直接全部显示
              if (CCIndex < 4 || element.ApprovalCCMemberList.length === 5) {
                element.overviewList_CC.push(CCItem)
              }
            })
          })
        } else {
          this.xy.msgError(res.msg)
        }
      },

      // 请假审批
      approvalRequire (value) {
        this.xy.loading()
        let params = {
          ApprovalFlowID: this.$store.state.common.currentNode.ApprovalFlowID,
          ApprovalFlowNodeID: this.$store.state.common.currentNode.ApprovalFlowNodeID,
          UserID: 0, // 固定传0
          Option: this.Option,
          Status: value,
          TeacherApplicationID: this.row.TeacherLeaveApplicationID
        }
        this.xy.post(`${this.$store.state.apiPath}/api/TeacherLeave/SaveApprovalBranchStatus`, params).then(res => {
          if (!res.success) {
            this.xy.unloading()
            this.$Modal.error({
              title: '审批失败',
              content: res.msg
            })
            this.modalImport = false
            this.loadTable()
          } else {
            this.xy.unloading()
            this.xy.msgSuc('审批成功！')
            this.modalImport = false
            this.loadTable()
          }
        })
      },

      // 同意
      editOk: function (val) {
        var that = this
        if (this.DeniedDescription === '' || this.DeniedDescription === undefined) {
          // xy.message.error(this, { content: '请填写审核意见' })
          that.xy.msgError('请填写审核意见')
          return that.changeLoading()
        };
        that.ApplicationState = val
        if (val === 2) {
          that.IsAgree = true
        }
        if (val === 3) {
          that.IsAgree = false
        }
        // that.xy.loading()
        that.xy.post(`${that.$store.state.apiPath}/api/StudentLeave/Approval`, {
          IsAgree: that.IsAgree,
          ApprovalFlowID: this.$store.state.common.currentNode.ApprovalFlowID,
          ApprovalFlowNodeID: this.$store.state.common.currentNode.ApprovalFlowNodeID,
          LeaveApplicationID: that.LeaveApplicationID,
          Opinion: that.DeniedDescription,
          ApproveStatus: that.ApplicationState
        }).then(res => {
          if (res.success) {
            that.xy.unloading()
            that.xy.msgSuc(res.data)
            this.modalImport = false
            this.loadTable()
            that.xy.unloading()
            this.$router.back()
          } else {
            that.xy.mError('错误信息', res.msg)
            this.modalImport = false
            this.loadTable()
            that.xy.unloading()
            this.$router.back()
          }
        })
      },

      // 关闭抽屉
      loadTable () {
        this.$emit('loadTable')
      },
      // 请假图片查看
      handleView (name) {
        this.imgName = name
        this.visible = true
      }
    }
  }
</script>

<style lang="less" scoped>
/* 上传图片组件样式 */
.upload-image-item input[type=file],
.sub-btn.blue input[type=file] {
  margin: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
}

.pwsp-rotate {
  position: relative;
  color: #ffffff;
  margin-top: 10px;
  cursor: pointer;
  overflow: visible;
  float: right;
  width: 20px;
  height: 20px;
  z-index: 1111;
  margin-right: 150px;
}

.pswp__button--zoom {
  display: block;
}

.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  // border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
  left: 10px;
}
.demo-upload-list div{
  width: 60px;
  height: 60px;
  border-radius: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.text-center{
  bottom: 0px;
  position: initial;
  left: 50%;
  margin-left: -75px;
}
.officeStatus {
  position: absolute;
  right: 27px;
  top: 22px;
  width: 108px;
  height: 110px;
}
.officeStatus img{
  width:100%;
  height:100%;
}

.demo-upload-list{
  width: 128px;
  height: 80px;
  overflow: hidden;
  vertical-align: top;
  display: inline-block;
  margin-right: 10px;
  position: relative;
  cursor: pointer;
}
.demo-upload-list > .demo-upload-list-cover{
  width: 128px;
  height: 80px;
  background: rgba(0, 0, 0, .0);
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.3s;
}
.demo-upload-list > .demo-upload-list-cover > i{
    text-align: center;
    display: block;
    margin: 0 auto;
    line-height: 80px;
    color: rgb(39, 38, 38);
    font-size: 20px;
}

.demo-upload-list:hover{
}
.demo-upload-list:hover > .demo-upload-list-cover{
  transition: all 0.3s;
  background: rgba(0, 0, 0, .5);
}
.demo-upload-list:hover > .demo-upload-list-cover i{
  transition: all 0.3s;
  color: rgb(255, 255, 255);
  font-size: 30px;
}
.detailModel{
  width: 80%;
  margin: auto;
  padding: 50px 30px;
  background: #fff;
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
    .main-info{
      position: relative;
      display:-webkit-box;display:-ms-flexbox;display:flex;
      -webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;
      .left{
        display:-webkit-box;
        display:-ms-flexbox;
        display:flex;
        .avatar{
          padding:0;
          padding-right:15px;
          span{
            display:block;
            background:#4196ff;
            width:50px;height:50px;
            border-radius:50%;
            text-align:center;
            line-height:50px;
            font-size:18px;
            color:#fff
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
          .fullName{color:#606266;
          font-size:16px}
          .schoolNumber{font-size:14px;color:#999999}
        }
      }
      .status{
        margin-top:50px;
        width:62px;
        height:25px;
        border-radius:4px;
        border:1px solid #f99b31;
        display:-webkit-box;
        display:-ms-flexbox;
        display:flex;-webkit-box-pack:center;
        -ms-flex-pack:center;
        justify-content:center;
        -webkit-box-align:center;
        -ms-flex-align:center;
        align-items:center;
        color:#f99b31;
        font-size:14px
      }
    }
  }
 }
</style>
