<template>
  <div>
    <div class="clearfix">
        <div>
            <!-- 头部样式 -->
            <div class="approval-card">
                <div class="main-info">
                    <div class="left">
                        <span class="avatar">
                            <img v-if="info.Icon" :src="info.Icon" :alt="info.FullName" style="display:block; width: 50px; height: 50px; border-radius: 50%;">
                            <span v-else :title="info.FullName"> {{ showName(infos.ApplicantName) }} </span>
                        </span>
                        <p class="name-number">
                            <span class="fullName">{{info.ApplicantName}}提交的<span v-if="info.ApplicationType==2">代</span>请假申请</span>
                            <span class="schoolNumber">{{xy.moment(info.CreateByDate).format('YYYY-MM-DD HH:mm')}}</span>
                        </p>
                    </div>
                    <img class="status-img" v-if="info.ApplicationState ===2"
                         src="@/assets/common/attendance/seal-pass.png" :alt="info.ApplicationStateName">
                    <img class="status-img" v-else-if="info.ApplicationState ===3"
                         src="@/assets/common/attendance/seal-refuse.png" :alt="info.ApplicationStateName">
                    <img class="status-img" v-else-if="info.ApplicationState ===4"
                         src="@/assets/common/attendance/seal-undo.png" :alt="info.ApplicationStateName">
                    <img class="status-img" v-else-if="info.ApplicationState ===5"
                         src="@/assets/common/attendance/seal-undo.png" :alt="info.ApplicationStateName">
                </div>
            </div>

            <!-- 中间项 -->
            <ul class="leave-list" style="margin-bottom: 66px;">
                <li class="info-item">
                    <span class="title">请假类型</span>
                    <span class="content">{{info.LeaveTypeName}}</span>
                </li>
                <li class="info-item">
                    <span class="title">请假学生</span>
                    <span class="content">
                        <span v-for="(item, index) in info.Details"
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
                <li class="info-item" v-if="info.IsCycleLeave">
                    <span class="title">周期性请假</span>
                    <span class="content">是</span>
                </li>
                <li class="info-item" v-if="info.IsCycleLeave" style="display:flex;">
                    <span class="title">请假时间</span>
                    <span>
                        <span class="content"
                              v-for="(item, index) in info.CycleDetail"
                              :key="index"
                              style="display:block; margin-bottom: 10px;">
                            {{item}}
                        </span>
                    </span>
                </li>
                <li class="info-item" v-else>
                    <span class="title">请假时间</span>
                    <span class="content">
                        {{xy.moment(info.StartTime).format('YYYY-MM-DD HH:mm')}}
                        -
                        {{xy.moment(info.EndTime).format('YYYY-MM-DD HH:mm')}}
                    </span>
                </li>
                <li class="info-item">
                    <span class="title">请假原因</span>
                    <span class="content">{{info.ApplicationDescription}}</span>
                </li>
                <li class="info-item">
                    <span class="title">是否离校</span>
                    <span class="content">
                        {{info.IsLeaveSchool?"是":"否"}}
                    </span>
                </li>
                <li class="info-item img-list">
                    <span class="title">请假图片</span>
                    <div style="display:flex;" v-if="info.Images && info.Images.length > 0">
                      <div class="demo-upload-list"
                          v-for="(item, index) in info.Images"
                          :key="index">
                          <template>
                              <img :src="base + item" style="height: 100%;
                                                              text-align: center;
                                                              display: block;
                                                              margin: 0 auto;"/>
                              <div class="demo-upload-list-cover">
                                  <Icon type="ios-eye-outline" @click="handleView(item)"></Icon>
                              </div>
                          </template>
                      </div>
                    </div>
                    <span v-else class="content">无</span>
                    <Modal title="查看" v-model="visible">
                        <img :src="base + imgName" v-if="visible" style="width: 100%;">
                        <div slot="footer">
                            <Button class="xy-modal-close" @click="visible=false">关闭</Button>
                        </div>
                    </Modal>
                </li>
                <li class="info-item img-list">
                    <!--审批流程-->
                    <WorkflowApproval style="margin-top:15px;" :workflow="workflow"></WorkflowApproval>
                </li>
                <li class="info-item" v-if="!disLook">
                <Form ref="caseForm"  label-position="top" class="edit-form">
                    <FormItem label="审批意见" prop="caseName" labelFor="DeniedDescription">
                      <i-input v-model="DeniedDescription" elementId="DeniedDescription" type="textarea" maxlength="100"></i-input>
                    </FormItem>
                </Form>
                </li>
            </ul>
            <div v-if="!disLook" style="
                text-align: center;">
                <div style="display:inline-block; margin-right: 18px;">
                    <!-- <Button type="success" @click="editOk(2)" shape="circle" style="width:96px;">同意</Button> -->
                    <Button class="xy-btn-primary" shape="circle"  @click="editOk(2)">同意</Button>
                </div>
                <div style="display:inline-block">
                    <!-- <Button type="error" @click="editOk(3)" shape="circle" style="width:96px;">拒绝</Button> -->
                    <Button class="xy-btn-close" @click="editOk(3)">拒绝</Button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
  import WorkflowApproval from '@/components/workflow/WorkflowApproval.vue'
  export default {
    name: 'ApprovalEdit',
    components: {
      WorkflowApproval
    },
    data () {
      return {
        DetailParameter: '',
        LeaveApplicationID: 0,
        ServiceDoMainName: '',
        disLook: true,
        dataNews: '暂无消息',
        ApplicationState: 0,
        DeniedDescription: '',
        StartDay: '',
        EndDay: '',
        ApprovalFlowNodes: '',
        approvalData: {
          Option: '',
          currentNode: undefined,
          TeacherApplicationID: undefined
        },
        Status: '',
        Option: '',
        imgName: '',
        visible: false,
        IsAgree: true,
        // mInfo: false,
        isRevoke: true,
        info: '',
        workflow: [],
        apiPath: ''
      }
    },
    props: ['infos', 'type', 'code', 'mInfo'],
    created () {
      this.base = `${this.xyApi}/base`
      // type 0  消息列表传过来的值,
      // type 1  模块里传来的值
      this.info = this.infos
      if (this.type === 0) {
        this.ServiceDoMainName = this.info.ServiceDoMainName
        // 字符串转json
        this.DetailParameter = JSON.parse(this.info.DetailParameter)
        if (this.DetailParameter != null) {
          this.LeaveApplicationID = this.DetailParameter.LeaveApplicationID
        }
      } else {
        // this.ServiceDoMainName = xy.subMenuServiceUrl
        // this.apiPath = this.$store.state.apiPath
        this.apiPath = this.$store.state.apiPath
        this.LeaveApplicationID = this.info.LeaveApplicationID
      }
    },
    watch: {
      'mInfo': {
        handler (newValue, oldValue) {
          this.$emit('mInfo', newValue)
        },
        deep: true
      }
    },
    mounted () {
      this.getrows()
    },
    methods: {
      // 获取上一页参数
      async getrows () {
        let _this = this
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/StudentLeave/GetStudentLeaveByID`, {
            LeaveApplicationID: this.LeaveApplicationID
          }
        )
        if (res.success) {
          this.xy.unloading()
          _this.info = res.data.LeaveModel
          console.log(_this.info)
          if (this.infos.LeaveApplicationID !== 0) {
            this.ApplicationState = this.infos.ApplicationState
            if (this.ApplicationState === 0 || this.ApplicationState === 1) {
              this.disLook = false
            }
            this.DeniedDescription = this.infos.DeniedDescription
          } else {
            this.dataNews = '对不起，此信息已被删除。'
          }
          _this.ApprovalFlowNodes = res.data.ApprovalFlowNodes
          _this.workflow = _this.ApprovalFlowNodes
          this.ApprovalFlowNodes.forEach((element) => {
            // 缩略预览模式开关
            element.isOverviewMode = true
            // 缩略预览列表(不大于5个)
            element.overviewList = []
            // 若该审批项目结束，缩略列表显示最后审批结果的时间与状态
            element.lastComplete_time = undefined
            element.lastComplete_status = undefined
            element.ApprovalMemberList.forEach((memberItem, memberIndex) => {
              // 缩略图列表仅显示前4个，其余显示省略号；若共5人，则不显示省略号，直接全部显示
              if (memberIndex < 4 || element.ApprovalMemberList.length === 5) {
                element.overviewList.push(memberItem)
              }
              // 该审批流是否完成
              if (element.IsComplete === 1 || element.IsComplete === true) {
                if (element.lastCompleteTime) {
                  let lastTime = new Date(element.lastComplete_time)
                  let thisTime = new Date(memberItem.ApprovalDate)
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
            if (element.Status === '待审批') {
              if (element.ApprovalFlowNodeName === '会签') {
                // element.WorkFlowNodeType === 2是审批节点
                // 获取当前需审批的节点：第一个非完成节点
                if (this.approvalData.currentNode === undefined && element.ApprovalFlowNodeName !== '发起人' && !element.IsComplete) {
                  this.approvalData.currentNode = element
                }
                for (let i = 0; i < element.ApprovalMemberList.length; i++) {
                  // 循环当前节点下的所有人
                  if (element.ApprovalMemberList[i].UserID === this.$store.state.common.userBaseInfo.UserID) {
                    // 找到当前用户  Status = 0 待审批, 2 已通过，3 已拒绝
                    if (element.ApprovalMemberList[i].Status !== '待审批') {
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
              if (element.ApprovalFlowNodeName === '或签') {
                // element.WorkFlowNodeType === 2是审批节点
                // 获取当前需审批的节点：第一个非完成节点
                if (this.approvalData.currentNode === undefined && element.ApprovalFlowNodeName !== '发起人' && !element.IsComplete) {
                  this.approvalData.currentNode = element
                }
                for (let c = 0; c < element.ApprovalMemberList.length; c++) {
                  // 循环当前节点下的所有人
                  if (element.ApprovalMemberList[c].UserID === this.$store.state.common.userBaseInfo.UserID) {
                    // 找到当前用户  Status = 0 待审批, 2 已通过，3 已拒绝
                    if (element.ApprovalMemberList[c].Status !== '待审批') {
                      // 判断当前用户的状态
                      this.Status = element.ApprovalMemberList[c].StatusName
                      this.Option = element.ApprovalMemberList[c].Option
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
            } else {
              if (element.ApprovalFlowNodeName === '会签') {
                // element.WorkFlowNodeType === 2是审批节点
                // 获取当前需审批的节点：第一个非完成节点
                if (this.approvalData.currentNode === undefined && element.ApprovalFlowNodeName !== '发起人' && !element.IsComplete) {
                  this.approvalData.currentNode = element
                }
                for (let a = 0; a < element.ApprovalMemberList.length; a++) {
                  // 循环当前节点下的所有人
                  if (element.ApprovalMemberList[a].UserID === this.$store.state.common.userBaseInfo.UserID) {
                    // 找到当前用户  Status = 0 待审批, 2 已通过，3 已拒绝
                    if (element.ApprovalMemberList[a].Status !== '待审批') {
                      // 判断当前用户的状态
                      this.Status = element.ApprovalMemberList[a].StatusName
                      this.Option = element.ApprovalMemberList[a].Option
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
              if (element.ApprovalFlowNodeName === '或签') {
                // element.WorkFlowNodeType === 2是审批节点
                // 获取当前需审批的节点：第一个非完成节点
                if (this.approvalData.currentNode === undefined && element.ApprovalFlowNodeName !== '发起人' && !element.IsComplete) {
                  this.approvalData.currentNode = element
                }
                for (let s = 0; s < element.ApprovalMemberList.length; s++) {
                  // 循环当前节点下的所有人
                  console.log(element.ApprovalMemberList[s].Status)
                  // 找到当前用户  Status = 0 待审批, 2 已通过，3 已拒绝
                  if (element.ApprovalMemberList[s].Status !== '待审批') {
                    // 判断当前用户的状态
                    this.Status = element.ApprovalMemberList[s].StatusName
                    this.Option = element.ApprovalMemberList[s].Option
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
            element.ApprovalCCMemberList.forEach((CCItem, CCIndex) => {
              // 缩略图列表仅显示前4个，其余显示省略号；若共5人，则不显示省略号，直接全部显示
              if (CCIndex < 4 || element.ApprovalCCMemberList.length === 5) {
                element.overviewList_CC.push(CCItem)
              }
            })
          })
          // 判断是否已经撤销 审批 0 未审批    2已审批（通过，拒绝）4撤销
          console.log(this.ApplicationState)
          if (this.ApplicationState === 4 || this.ApplicationState === 3) {
            this.disLook = true
          }
        }
      },
      // 审批流列表：若无图标，展示文字
      showName (name) {
        if (name != null) {
          // 纯中文：汉字姓名大于2个字展示最后2个字，小于等于2个字
          if (/^[\u4e00-\u9fa5]+$/g.test(name)) {
            return name.length > 2 ? name.slice(-2) : name
          } else if (/^[A-Za-z]+$/g.test(name)) {
            // 纯英文名只展示两个字母
            return name.slice(0, 2)
          } else {
            // 其他
            return name.slice(0, 2)
          }
        }
      },
      // 请假图片查看
      handleView (name) {
        this.imgName = name
        this.visible = true
      },
      // 展开或折叠
      setStatus_isOverviewMode (item, index, type, value) {
        if (type === 'normal') {
          item.isOverviewMode = value
        } else if (type === 'CC') {
          item.isOverviewMode_CC = value
        } else {
          item.isOverviewMode = value
        }
        this.$set(this.ApprovalFlowNodes, index, item)
      },
      // 同意
      editOk (val) {
        let that = this
        if (this.DeniedDescription === '' || this.DeniedDescription === undefined) {
          that.xy.msgError('请填写审核意见。')
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
          ApprovalFlowID: that.$store.state.common.currentNode.ApprovalFlowID,
          ApprovalFlowNodeID: that.$store.state.common.currentNode.ApprovalFlowNodeID,
          LeaveApplicationID: that.LeaveApplicationID,
          Opinion: that.DeniedDescription,
          ApproveStatus: that.ApplicationState
        }).then(res => {
          if (res.success) {
            that.xy.unloading()
            that.xy.msgSuc(res.data)
            // 关闭侧边栏
            that.$parent.close()
          } else {
            that.xy.mError('错误信息。', res.msg)
            that.xy.unloading()
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.detailModel {
  .ivu-drawer {
    top: 0;
    margin: 0;
    position: absolute;
    height: 100%;
    right: 0;
  }
  .ivu-drawer-content {
    height: 100%;
    overflow: auto;
  }

  .approval-card {
    .main-info {
      display: flex;
      justify-content: space-between;

      .left {
        display: flex;

        .avatar {
          padding: 0;
          padding-right: 15px;
          span {
            display: block;
            background: #4196ff;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            text-align: center;
            line-height: 50px;
            font-size: 18px;
            color: #fff;
          }
        }

        .name-number {
          display: flex;
          flex-direction: column;
          margin-top: 6px;

          .fullName {
            color: #606266;
            font-size: 16px;
          }

          .schoolNumber {
            font-size: 14px;
            color: #999999;
          }
        }
      }

      .status {
        margin-top: 50px;
        width: 62px;
        height: 25px;
        border-radius: 4px;
        border: 1px solid rgba(249, 155, 49, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #f99b31;
        font-size: 14px;
      }

      & > img {
        position: absolute;
        right: 30px;
      }
    }
  }

  .leave-list {
    font-size: 14px;

    .info-item {
      margin-top: 10px;

      .title {
        color: #999;

        &-strong {
          display: block;
          margin: 20px 0;
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }
      }

      .content {
        margin-left: 10px;
        color: #333;
      }
    }
  }

  .img-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    img {
      &:nth-child(2n) {
        margin-left: 20px;
      }

      width: 40%;
      height: 150px;
    }
  }
  .manager-part {
    padding: 0 20px;

    .approal-title {
      font-size: 16px;
      font-weight: bold;
    }

    .approval-group {
      display: flex;
      margin: 20px 0;

      .ivu-radio-wrapper:after,
      .ivu-radio-wrapper:before {
        width: 0;
      }

      .ivu-radio-wrapper {
        padding: 0;
        width: 96px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;

        &:first-child {
          color: #5bbb7e;
          border-color: #5bbb7e;
        }

        &:last-child {
          color: #dc6e6e;
          margin-left: 30px;
          border-color: #dc6e6e;
          border-left: 1px solid;
        }
      }

      .ivu-radio-wrapper.ivu-radio-wrapper-checked {
        &:first-child {
          background: #5bbb7e;
          color: #fff;
        }
      }

      .ivu-radio-wrapper.ivu-radio-wrapper-checked {
        &:last-child {
          background: #e85555;
          color: #fff;
        }
      }
    }

    label {
      color: #999;
      font-size: 14px;
    }
  }

  .user-part {
    padding-left: 20px;
    font-size: 14px;

    h4 {
      color: #999;
    }
  }

  .ivu-drawer-footer {
    padding-left: 40px;
    text-align: left;
  }
}

.cssIcon-triangle {
  display: inline-block;
  width: 5px;
  height: 5px;
  &--t2b {
    margin: 5px;
    border-left: 1px solid #888;
    border-bottom: 1px solid #888;
    transform: rotate(-45deg);
  }
  &--b2t {
    margin: 2px 7px;
    border-left: 1px solid #4196ff;
    border-bottom: 1px solid #4196ff;
    transform: rotate(135deg);
  }
}

.approval {
  &-btn {
    &-confirm {
      width: 96px;
      line-height: 32px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(91, 187, 126, 1);
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: rgba(91, 187, 126, 1);
      &:hover {
        background: rgba(91, 187, 126, 1);
        border: 1px solid rgba(91, 187, 126, 1);
        color: #fff;
      }
    }
    &-refuse {
      width: 96px;
      line-height: 32px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(220, 110, 110, 1);
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: rgba(220, 110, 110, 1);
      &:hover {
        background: #dc6e6e;
        border: 1px solid rgba(220, 110, 110, 1);
        color: #fff;
      }
    }
  }
}
.demo-upload-list{
  width: 128px;
  height: 80px;
  overflow: hidden;
  vertical-align: top;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
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
.demo-upload-list:hover > .demo-upload-list-cover{
  transition: all 0.3s;
  background: rgba(0, 0, 0, .5);
}
.demo-upload-list:hover > .demo-upload-list-cover i{
  transition: all 0.3s;
  color: rgb(255, 255, 255);
  font-size: 30px;
}
</style>
