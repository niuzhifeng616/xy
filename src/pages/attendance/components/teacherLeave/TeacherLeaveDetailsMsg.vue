// 教师请假页面通用组件-消息
<template>
  <div class="detail">
    <div class="detailModel">
        <div class="approval-card">
          <div class="main-info">
            <div class="left">
              <span class="avatar">
                <span  :title="detailInfo.FullName" class="left fl" v-if="detailInfo.Icon===''">{{xy.showName(detailInfo.FullName)}}</span>
                <img v-else style="width: 50px;height: 50px;border-radius: 50%;float:left;" :src="detailInfo.Icon" alt="">
              </span>
              <p class="name-number">
                <span class="fullName">{{detailInfo.FullName}}</span>
                <span class="schoolNumber">{{detailInfo.ApplicationStateNameNew}}</span>
              </p>
            </div>
            <div class="officeStatus">
              <img
                class="status-img"
                v-if="detailInfo.ApplicationStateNew ===2"
                :src="require('@/assets/common/attendance/seal-pass.png')"
                alt="审批通过"
              />
              <img
                class="status-img"
                v-else-if="detailInfo.ApplicationStateNew ===3"
                :src="require('@/assets/common/attendance/seal-refuse.png')"
                alt="审批拒绝"
              />
              <img
                class="status-img"
                v-else-if="detailInfo.ApplicationStateNew ===4"
                :src="require('@/assets/common/attendance/seal-undo.png')"
                alt="审批撤销"
              />
            </div>
          </div>
        </div>
        <ul class="leave-list">
          <li class="info-item">
            <span class="title">请假类型</span>
            <span class="content">{{detailInfo.TeacherLeaveTypeName}}</span>
          </li>
          <li class="info-item">
            <span class="title">请假教师</span>
            <span class="content">{{detailInfo.FullName}}</span>
          </li>
          <li class="info-item">
            <span class="title">请假时间</span>
            <span class="content">{{detailInfo.TimeName}}</span>
          </li>
          <li class="info-item">
            <span class="title">请假原因</span>
            <span class="content">{{detailInfo.ApplicationDescription}}</span>
          </li>
          <li
            class="info-item img-list"
            v-if="detailInfo.LeavePictrueList && detailInfo.LeavePictrueList.length > 0"
           >
            <span class="title">请假图片</span>
            <div
              class="demo-upload-list"
              v-for="(item, index) in detailInfo.LeavePictrueList"
              :key="index"
              >
              <template>
                <div>
                  <img :src="mainUrl + item" />
                  <div class="demo-upload-list-cover">
                    <Icon
                      type="ios-eye-outline"
                      @click.native="handleView(item)"
                      >
                    </Icon>
                  </div>
                </div>
              </template>
            </div>
            <div v-if="!detailInfo.LeavePictrueList">无</div>
            <modal title="查看" v-model="visible" :footer-hide="true">
              <img :src="mainUrl + imgName" v-if="visible" style="width: 100%" />
            </modal>
          </li>
          <WorkflowApproval style="margin-top:15px;" :workflow="workflow"></WorkflowApproval>
          <li
            class="info-item"
            v-if="tableType==='approval' && detailInfo.JudgeCanOperation===true && isFrom === 1"
            >
              <Form ref="caseForm"  label-position="top" class="edit-form">
                  <FormItem label="审批意见" prop="caseName" labelFor="Option">
                    <i-input v-model="Option" elementId="Option" type="textarea" :autosize="{minRows: 5,maxRows: 5}" maxlength="100"></i-input>
                  </FormItem>
              </Form>
          </li>
        </ul>
        <div
          v-if="isFrom === 0 && (detailInfo.ApplicationStateNew === 0 || detailInfo.ApplicationStateNew === 1)"
          style="margin-top:20px;text-align: left;"
          >
          <Button type="primary" @click="RevokedMine">撤销</Button>
        </div>
        <div
          v-if="isFrom === 1 && tableType==='approval' && detailInfo.JudgeCanOperation===true"
          style="margin-top:20px;text-align: left;"
          >
          <Button class="xy-btn-primary" shape="circle"  @click="approvalRequire(2)">同意</Button>
          <Button class="xy-btn-close" @click="approvalRequire(3)">拒绝</Button>
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
    props: {
      // isFrom
      isFrom: {
        type: Number
      }
    },
    name: 'detail',
    data () {
      return {
        mainUrl: this.xyApi + '/base',
        /* 详情 */
        modalImport: true,
        detailInfo: {},
        // 查看请假图片
        imgName: '',
        visible: false,
        Option: '',
        workflow: [],
        tableType: 'approval'
      }
    },
    computed: {
      row () {
        return this.$store.state.common.msgParam !== '' ? JSON.parse(this.$store.state.common.msgParam) : {}
      }
    },
    watch: {
      row (newVal) {
        console.log(newVal)
        let rows = newVal
        rows.TeacherLeaveApplicationID = rows.BusinessID
        if (this.row.Subject === '教师请假申请') {
          this.isFrom = 1
          this.tableType = 'approval'
          this.getDetailInfo(rows)
        } else if (rows.Subject === '教师请假审批结果') {
          this.isFrom = ''
          this.getDetailInfo(rows)
        }
      }
    },
    methods: {
      async getDetailInfo (row) {
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + `/api/TeacherLeave/GetDetailByID?id=${row.TeacherLeaveApplicationID}`, null)
        if (res.success) {
          // 详情区域上发显示
          this.detailInfo = res.data
          this.workflow = this.detailInfo.ApprovalFlow
        }
        this.xy.unloading()
      },
      // 审批流列表：若无图标，展示文字
      showName (name) {
        return this.xy.showName(name)
      },
      xyFormatDate (date, format) {
        format = format || 'MM.dd HH:mm'
        return date ? this.xy.moment(date).format(format) : ''
      },
      // 请假图片查看
      handleView (name) {
        console.log(name, this.visible)
        this.imgName = name
        this.visible = true
      },
      // 关闭抽屉
      loadTable () {
        this.$emit('loadTable')
      },
      // 我的请假-撤销请假
      RevokedMine () {
        this.$Modal.confirm({
          title: '撤销',
          content: '<p>您确认要撤销吗？</p>',
          onOk: () => {
            let params = {
              ApprovalFlowID: this.row.ApprovalFlowID,
              ApprovalFlowNodeID: 0,
              UserID: 0,
              Option: '',
              Status: this.row.ApplicationStateNew,
              TeacherApplicationID: this.row.TeacherLeaveApplicationID
            }
            this.xy.post(`${this.$store.state.apiPath}/api/TeacherLeave/RevocationLeaveApplication`, params).then(res => {
              if (!res.success) {
                this.$Modal.error({
                  title: '撤销失败',
                  content: res.msg
                })
                this.modalImport = false
                this.loadTable()
              } else {
                this.xy.msgSuc('撤销成功。')
                this.modalImport = false
                this.loadTable()
              }
            })
          }
        })
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
            this.xy.msgSuc('审批成功。')
            this.modalImport = false
            this.loadTable()
          }
        })
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
