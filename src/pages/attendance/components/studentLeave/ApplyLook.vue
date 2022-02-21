<template>
  <div>
    <!-- 学生请假-查看请假详情   // 缺少面包屑 -->
    <div class="clearfix">
        <div>
            <!-- 头部样式 -->
            <div class="approval-card">
                <div class="main-info">
                    <div class="left">
                        <span class="avatar">
                            <img v-if="photo !==''" :src="photo" :alt="infos.FullName" style="display:block; width: 50px; height: 50px; border-radius: 50%;">
                            <span v-else :title="infos.FullName"> {{ xy.showName(info.ApplicantName) }} </span>
                        </span>
                        <p class="name-number">
                            <span class="fullName">{{info.ApplicantName}}提交的<span v-if="infos.ApplicationType==2">代</span>请假申请</span>
                            <span class="schoolNumber">{{infos.CreateByDate}}</span>
                        </p>
                    </div>
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
                    <span class="content" style="display: inline-block; vertical-align: top; width: 80%;">{{infos.ApplicationDescription}}</span>
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
                              <img :src="att + item" style="height: 100%;
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
                    <modal title="查看" v-model="visible">
                        <img :src="att + imgName" v-if="visible" style="width: 100%;">
                        <div slot="footer">
                            <Button class="xy-modal-close" @click="visible=false">关闭</Button>
                        </div>
                    </modal>
                </li>
                <li class="info-item img-list">
                    <!--审批流程-->
                    <WorkflowApproval style="margin-top:15px;" :workflow="workflow"></WorkflowApproval>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>
<script>
  import WorkflowApproval from '@/components/workflow/WorkflowApproval.vue'
  export default {
    name: 'ApplyLook',
    components: {
      WorkflowApproval
    },
    data () {
      return {
        DetailParameter: '',
        LeaveApplicationID: 0,
        ServiceDoMainName: '',
        disLook: false,
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
        apiPath: '',
        att: ''
      }
    },
    props: ['info', 'type', 'code'],
    created () {
      this.att = `${this.xyApi}/att`
      // type 0  消息列表传过来的值,
      // type 1  模块里传来的值
      if (this.type === 0) {
        this.ServiceDoMainName = this.info.ServiceDoMainName
        // 字符串转json
        this.DetailParameter = JSON.parse(this.info.DetailParameter)
        if (this.DetailParameter != null) {
          this.LeaveApplicationID = this.DetailParameter.LeaveApplicationID
        }
      } else {
        this.apiPath = this.$store.state.apiPath
        this.LeaveApplicationID = this.info.LeaveApplicationID
      }
    },
    watch: {
      mInfo: {
        handler (newValue, oldValue) {
          this.bus.$emit('mInfo', newValue)
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
          this.ApprovalFlowNodes = res.data.ApprovalFlowNodes
          this.workflow = this.ApprovalFlowNodes
        } else {
          this.xy.msgError(res.msg)
        }
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
</style>
