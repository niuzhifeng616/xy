<template>
  <div>
    <!-- 学生请假-查看请假详情   // 缺少面包屑 -->
    <div class="clearfix">
        <div>
            <!-- 头部样式 -->
            <div class="approval-card">
                <div class="main-info">
                    <div class="left">
                        <!-- <span class="avatar">
                            <img v-if="photo !==''" :src="base + photo" :alt="infos.FullName" style="display:block; width: 50px; height: 50px; border-radius: 50%;">
                            <span v-else :title="infos.FullName"> {{ xy.showName(info.ApplicantName) }} </span>
                        </span> -->
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
                    <div class="stuTit">请假学生</div>
                    <div v-for="(i, j) in orgs" :key="j">
                      <div class="title" style="margin-bottom: 16px">{{i.StudentOrganizationName}}</div>
                      <div class="content stuContent">
                        <div
                          v-for="(item, index) in i.Members"
                          :key="index"
                          class="stuOne"
                          >
                          <img class="stuIconImg" v-if="item.Icon" :src="item.Icon + '?' + Math.random() * 15" />
                          <div class="stuIcon" :class="item.sex === '女' ? 'woman' : 'man' " v-else>{{ xy.showName(item.StudentName) }}</div>
                          <div v-if="item.IsLeaveSchool" class="stuType">已离校</div>
                          <p :title="item.StudentName" class="stuName">{{item.StudentName}}</p>
                        </div>
                      </div>
                    </div>
                </li>
                <li class="info-item">
                    <span class="title">请假类型</span>
                    <span class="content">{{infos.LeaveTypeName}}</span>
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
                    <modal title="查看" v-model="visible">
                        <img :src="base + imgName" v-if="visible" style="width: 100%;">
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

            <!-- 离校记录 -->
            <div class="leave-record" v-if="info.IsLeaveSchool">
                <div class="leaveTit">
                  离校记录
                </div>
                <div v-for="(item, index) in stuLeaveList" :key="index">
                  <div class="leaveTime">
                    <span>离校时间：</span>
                    <span>{{item.LastModifyByDate}}</span>
                  </div>
                  <div class="leaveList">
                    <div v-for="(i, j) in item.StudentModels" :key="j">
                      <span>
                        <img class="stuIconImg" v-if="i.Icon" :src="i.Icon + '?' + Math.random() * 15" />
                        <div class="stuIcon" :class="i.sex === '女' ? 'woman' : 'man' " v-else>{{ xy.showName(i.StudentName) }}</div>
                      </span>
                      <span :title="i.StudentName" class="stuName">{{i.StudentName}}</span>
                    </div>
                  </div>
                  <div class="recordPep">
                    <span>记录人员：</span>
                    <span>{{item.LastModifyByName}}</span>
                  </div>
                </div>
            </div>

            <div class="leaveBtn" v-if="info.IsLeaveSchool && info.ApplicationStateName === '已通过'">
              <Button class="xy-btn-primary" shape="circle" @click="stuNum">
                离校确认
              </Button>
            </div>
        </div>
    </div>
    <modal v-model="stuLeaveShow" :mask-closable="false" :transfer="false" @on-visible-change="cancelHandle">
      <div v-for="(item, index) in orgs" :key="index">
        <div>
          <div class="modalTit">{{item.StudentOrganizationName}}</div>
            <a-checkable-tag :checked="i.checked" @change="a(i, j)" :key="j" v-for="(i, j) in item.Members">
              {{i.StudentName}}
            </a-checkable-tag>
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="stuLeaveShowCancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="handleChange">保存</Button>
      </div>
    </modal>
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
        base: '',
        orgs: [],
        studentId: [],
        stuLeaveShow: false,
        stuLeaveList: []
      }
    },
    props: ['info', 'type', 'code'],
    created () {
      this.base = `${this.xyApi}/base`
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
      cancelHandle () {
        for (var i = 0; i < this.orgs.length; i++) {
          this.orgs[i].Members.map((item) => {
            item.checked = false
          })
        }
      },
      stuLeaveShowCancel () {
        for (var i = 0; i < this.orgs.length; i++) {
          this.orgs[i].Members.map((item) => {
            item.checked = false
          })
        }
        this.stuLeaveShow = false
      },
      a (i, j) {
        i.checked = !i.checked
      },
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
          this.orgs = res.data.Orgs
          this.stuLeaveList = res.data.Records
          for (var i = 0; i < this.orgs.length; i++) {
            this.orgs[i].Members.map((item) => {
              this.$set(item, 'checked', false)
            })
          }
          this.workflow = this.ApprovalFlowNodes
        } else {
          this.xy.msgError(res.msg)
        }
      },
      handleChange () {
        this.studentId = []
        for (var i = 0; i < this.orgs.length; i++) {
          this.orgs[i].Members.map((item) => {
            if (item.checked) {
              this.studentId.push(item.StudentID)
            }
          })
        }
        this.getStuByid()
      },
      // 判断学生人数
      stuNum () {
        this.studentId = []
        if (this.infos.Details.length > 1) {
          this.stuLeaveShow = true
        } else {
          this.studentId.push(this.infos.Details[0].StudentID)
          this.getStuByid()
        }
      },
      // 提交离校记录
      getStuByid () {
        this.xy.post(`${this.$store.state.apiPath}/api/StudentLeave/CreateLeaveSchoolRecord`, {
          LeaveApplicationID: this.LeaveApplicationID,
          Students: this.studentId
        }).then(res => {
          if (res.success) {
            this.stuLeaveShow = false
            this.getrows()
            this.xy.msgSuc(res.data)
          }
        })
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
.modalTit {
  font-weight: bold;
  margin-bottom: 10px;
}

.leave-record>div {
  border-bottom: 1px dashed #e8e8e8;
  padding: 10px 15px 10px 0;
  position: relative;
  left: 15px;
}
.leave-record {
  padding-bottom: 34px;
  line-height: 24px;
  .leaveTit {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 14px;
    border: 0;
  }
  .leaveTime, .recordPep {
    color: rgba(0, 0, 0, .65);
  }
  .leaveTime span:nth-child(2), .recordPep span:nth-child(2) {
    color: #595959;
  }
}

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
    border-bottom: 1px solid #eeeeee;
    width: calc(100% + 30px);
    padding: 0 15px;
    position: relative;
    left: -15px;
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
          span {
            display: inline-block;
          }
          .fullName {
            color: #333;
            font-size: 16px;
            font-weight: bold;
            line-height: 24px;
          }

          .schoolNumber {
            font-size: 14px;
            color: rgba(51,51,51,0.45);
            line-height: 24px;
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
.leaveList {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  >div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 11px 34px 4px 0;
    span:nth-child(1) {
      margin-bottom: 4px;
    }
  }
  .stuIcon, .stuIconImg {
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-radius: 50%;
    color: #fff;
    font-size: 14px;
  }
  .man {
    background: #1677ff;
  }
  .woman {
    background: #FF81AC;
  }
  .stuName {
    line-height: 22px;
    display: inline-block;
    color: #333333;
    font-size: 12px;
    max-width: 60px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
  .leave-list {
    font-size: 14px;
    padding-top: 24px;
    .info-item {
      margin-top: 10px;

      .title {
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        &-strong {
          display: block;
          margin: 20px 0;
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }
      }
.stuTit {
  color: rgba(0,0,0,0.85);
  line-height: 24px;
  height: 24px;
  margin-bottom: 16px;
}
  .stuContent {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .stuOne {
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      position: relative;
      width: calc(100% / 3);
      p {
        display:inline-block;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .stuType {
        width: 44px;
        height: 20px;
        background: #52c41a;
        text-align: center;
        border-radius: 4px;
        font-size: 12px;
        line-height: 20px;
        color: #fff;
        position: absolute;
        left: 2px;
        bottom: -9px;
      }
      .stuIconImg {
        display:inline-block;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .stuIcon {
        display:inline-block;
        width: 48px;
        height: 48px;
        text-align: center;
        line-height: 48px;
        border-radius: 50%;
        color: #fff;
        font-size: 14px;
        margin-right: 20px;
      }
      .man {
        background: #1677ff;
      }
      .woman {
        background: #FF81AC;
      }
    }
  }
      .content {
        margin-left: 10px;
        color: #000;
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

.leaveBtn {
  border-top: 1px solid #eeeeee;
  width: calc(100% + 30px);
  padding: 0 15px;
  position: relative;
  left: -15px;
  height: 60px;
  line-height: 60px;
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
