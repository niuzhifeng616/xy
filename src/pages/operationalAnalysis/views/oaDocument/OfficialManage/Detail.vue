<template>
<div id="DrawerDetails">
  <!-- <link href="XYSubSiteLinkUrl/View/oaDocument/OfficialManage/PC/Css/Detail.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="XYSubSiteLinkUrl/View/oaDocument/OfficialApproval/PC/Css/Aooroval.css"> -->
  <div class="detail">
    <div class="detail-top">
      <div class="person clearfix">
        <span class="left fl" v-if="detail.Icon===''">{{xy.showName(detail.FullName)}}</span>
        <img v-else style="width: 50px;height: 50px;border-radius: 50%;float:left;" :src="detail.Icon" alt="">
        <div>
          <div class="name">{{detail.FullName}}</div>
          <div v-cloak>{{detail.StatusDescible}}</div>
        </div>
      </div>
      <div class="officeStatus">
        <!--0未审批、1审批中、2已通过、3已拒绝、4已收回-->
       <img v-if="detail.Status === 2" class="no-data-img" src="@/assets/common/attendance/adopt.png" />
       <img v-else-if="detail.Status === 3" class="no-data-img" src="@/assets/common/attendance/refuse.png" />
       <img v-else-if="detail.Status === 4" class="no-data-img" src="@/assets/common/attendance/takeBack.png" />
       <!-- <img v-else-if="detail.Status === 5" class="no-data-img" src="@/assets/common/attendance/seal-undo.png" /> -->
      </div>
    </div>
    <div class="detail-con">
      <div>
        <span>主题：</span>
        <div>{{detail.OfficialDocTheme}}</div>
      </div>
      <div>
        <span>公文标题：</span>
        <div>{{detail.OfficialDocTitle}}</div>
      </div>
      <div>
        <span>公文种类：</span>
        <div>{{detail.OfficialDocTypeName}}</div>
      </div>
      <div>
        <span>秘密等级：</span>
        <div>{{detail.OfficialDocSecretLevelName}}</div>
      </div>
      <div>
        <span>紧急程度：</span>
        <div>{{detail.OfficialDocEmergencyLevelName}}</div>
      </div>
      <div>
        <span>发文机关：</span>
        <div>{{detail.FromOffice}}</div>
      </div>
      <div>
        <span>发文字号：</span>
        <div>{{detail.IssueNumber}}</div>
      </div>
      <div>
        <span>发文内容：</span>
        <div>
          <div class="office-info" v-for="(item,index) in detail.List" :key="index">
            <span class="nowrap">{{item.FileName}}</span>
            <i-button type="primary" size="small" @click="downLoad(item)" ghost>下载</i-button>
          </div>
        </div>
      </div>
      <div>
        <span>附注：</span>
        <div>{{detail.Remark}}</div>
      </div>
      <!--已归档展示归档日期-->
      <div v-if="detail.IsArchive">
        <span>归档日期：</span>
        <!-- <div v-cloak>{{this.xy.moment.format(new Date(detail.LastModifyByDate), 'yyyy-MM-dd HH:mm')}}</div> -->
         <div v-cloak>{{this.xy.moment(detail.LastModifyByDate).format('YYYY-MM-DD HH:mm:ss')}}</div>
         <!-- this.xy.moment(value).format('YYYY-MM-DD') -->
      </div>
    </div>
    <!-- <span class="title" style="color: #999;">审批流程</span> -->
    <WorkflowApproval  :workflow="workflow"></WorkflowApproval>

   <div class="detail-con">
      <div>
        <span>审批结果：</span>
        <div>
          {{detail.StatusDescible}}
        </div>
      </div>
   </div>
    <div class="bottom-btn">
      <!--未审批、审批中显示收回按钮-->
      <Button
        class="xy-btn-primary"
        shape="circle"
        @click="takeBack"
        :loading="isShowSpin"
        v-if="detail.Status === 0 || detail.Status === 1"
        style="margin-right:30px;"
      >
       收回
      </Button>
    </div>
  </div>
  <!-- <script src="XYSubSiteLinkUrl/View/oaDocument/OfficialManage/PC/Scripts/Detail.js"></script> -->
</div>
</template>
<script>
  import WorkflowApproval from '@/components/workflow/WorkflowApproval.vue'
  export default {
    components: {
      WorkflowApproval
    },
    props: ['row'],
    data: function () {
      return {
        detailInfo: {},
        isShowSpin: false,
        officeId: -1,
        detail: [],
        workflow: [],
        approvalData: {
          ApprovalFlowNodeID: undefined
        }
      }
    },
    created: function () {
      this.getRows()
    },
    mounted: function () {},
    methods: {
      // 获取id
      getRows: function () {
        // var _this = this
        // if (xy.param.getValues('row')) {
        //   _this.row = xy.param.getValues('row')
        this.getDetail()
        // }
      },
      // 明细
      getDetail: function () {
        this.xy.loading()
        var _this = this
        let params = {
          ID: _this.row.OfficialDocID
        }
        _this.xy.get(`${_this.$store.state.apiPath}/api/OfficialDocument/GetByID`, params).then(res => {
          this.xy.unloading()
          if (res.success) {
            var data = res.data
            this.workflow = data.ApprovalFlow
            console.log(data)
            var lastPassNode = 0 // 临时记载：当前遍历中，最后通过审批的节点索引下标；其中，第0个为发起人，即尚未有审批
            data.currentAuditNodeIndex = -1 // 当前待审批节点的下标
            data.ApprovalFlow.forEach(function (element, index) {
              console.log(element)
              // 缩略预览模式开关
              element.isOverviewMode = true
              // 缩略预览列表(不大于5个)
              element.overviewList = [] // 缩略预览列表(不大于5个)
              element.isFinished = false // 该节点是否审批结束，原因见上
              element.currentAuditNode = false // 该节点是否为当前待审核节点
              // 若该审批项目结束，缩略列表显示最后审批结果的时间与状态
              element.lastComplete_time = undefined
              element.lastComplete_status = undefined
              if (element.IsComplete) {
                // 该节点已经通过了审批，相当于 element.Status === '已通过'
                lastPassNode = index
                element.isFinished = true
              } else if (element.Status === '已拒绝') {
                element.isFinished = true
              } else if (element.Status === '待审批') {
                // 判断是否为当前节点
                if (lastPassNode + 1 === index) {
                  // 该节点为当前待审核节点
                  element.currentAuditNode = true
                  data.currentAuditNodeIndex = index
                }
              }

              var lastTimeMember = '' // 暂存：最近的一次时间点
              element.ApprovalMemberList.forEach(function (memberItem, memberIndex) {
                // 缩略图列表仅显示前4个，其余显示省略号；若共5人，则不显示省略号，直接全部显示
                if (memberIndex < 4 || element.ApprovalMemberList.length === 5) {
                  element.overviewList.push(memberItem)
                }
                // 若该节点完成，显示时间、结果
                if (element.isFinished && memberItem.Status !== '待审批') {
                  if (element.ApprovalFlowNodeName === '或签') {
                    // 记录唯一一次审批时间
                    element.lastComplete_time = memberItem.ApprovalDate
                    element.lastComplete_status = memberItem.Status
                  } else if (element.ApprovalFlowNodeName === '会签') {
                    // 记录最后一次会签时间
                    if (lastTimeMember === undefined) {
                      // 记载首次审批的时间
                      lastTimeMember = memberItem.ApprovalDate
                    } else {
                      var lastTime = new Date(lastTimeMember)
                      var thisTime = new Date(memberItem.ApprovalDate)
                      if (thisTime > lastTime) {
                        element.lastComplete_time = memberItem.ApprovalDate
                        element.lastComplete_status = memberItem.Status
                      }
                    }
                  }
                }
                if (!element.isFinished) {
                  // 获取当前需审批的节点：第一个非完成节点
                  // if (
                  //     _this.approvalData.currentNode === undefined &&
                  //     element.ApprovalFlowNodeName !== '发起人'
                  // ) {
                  //     _this.approvalData.ApprovalFlowNodeID = element.ApprovalFlowNodeID;
                  // }
                }
              })
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
            _this.detail = data
          }
        })
      },
      // 审批流列表：若无图标，展示文字
      showName: function (name) {
        // 纯中文：汉字姓名大于2个字展示最后2个字，小于等于2个字
        if (/^[\u4e00-\u9fa5]+$/g.test(name)) {
          return name.length > 3 ? name.slice(-2) : name
        } else if (/^[A-Za-z]+$/g.test(name)) {
          // 纯英文名只展示两个字母
          return name.slice(0, 2)
        } else {
          // 其他
          return name.slice(0, 2)
        }
      },
      xyFormatDate: function (date, format) {
        format = format || 'MM.dd HH:mm'
        return date ? this.xy.moment(date).format('MM.DD HH:mm') : ''
      },
      // 展开或折叠
      setStatus_isOverviewMode: function (item, index, type, value) {
        if (type === 'normal') {
          item.isOverviewMode = value
        } else if (type === 'CC') {
          item.isOverviewMode_CC = value
        } else {
          item.isOverviewMode = value
        }
        this.$set(this.detailInfo.ApprovalFlow, index, item)
      },
      // 下载
      downLoad: function (file) {
        var _this = this
        console.log(file)
        var str = file.VirtualPath
        var pr = str.split('.')
        str = str.split('.')[0].slice(-14)
        str = pr[0].slice(-14) + '.' + pr[1]
        console.log(str)
        _this.xy.downFile(`${_this.$store.state.apiPath}/api/OfficialDocument/DownLoadFile"`,
                          {
                            FileName: file.FileName,
                            file: str
                          }
        )
      },
      // 收回
      takeBack: function () {
        var _this = this
        this.$Modal.confirm({
          title: '收回',
          content: '<p>您确定要收回此公文吗？</p>',
          onOk: () => {
            let params = {
              OfficialDocID: _this.row.OfficialDocID,
              ApprovalFlowID: _this.row.ApprovalFlowID
            }
            _this.isShowSpin = true
            _this.xy.post(`${_this.$store.state.apiPath}/api/OfficialDocument/RecoverOperation`, params).then(res => {
              _this.isShowSpin = false
              if (res.success) {
                _this.xy.msgSuc('收回成功。')
                // xy.message.success(_this, '收回成功')
                _this.ReturnClick()
              }
            })
          }
        })
      },
      // 返回
      ReturnClick: function () {
        this.$emit('loadTable')
      }
    }
  }
</script>
<style lang="less" scoped>
#DrawerDetails .detail {
  padding-bottom: 60px;
}

.ivu-drawer {
  top: 0;
  margin: 0;
  position: absolute;
  height: 100%;
  right: 0
}

.ivu-drawer .ivu-drawer-content {
  height: 100%;
  overflow: auto
}

.ivu-drawer .approval-card .main-info {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between
}

.ivu-drawer .approval-card .main-info .left {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex
}

.ivu-drawer .approval-card .main-info .left .avatar {
  padding: 0;
  padding-right: 15px
}

.ivu-drawer .approval-card .main-info .left .avatar span {
  display: block;
  background: #4196ff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  font-size: 18px;
  color: #fff
}

.ivu-drawer .approval-card .main-info .left .name-number {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  margin-top: 6px
}

.ivu-drawer .approval-card .main-info .left .name-number .fullName {
  color: #606266;
  font-size: 16px
}

.ivu-drawer .approval-card .main-info .left .name-number .schoolNumber {
  font-size: 14px;
  color: #999999
}

.ivu-drawer .approval-card .main-info .status {
  margin-top: 50px;
  width: 62px;
  height: 25px;
  border-radius: 4px;
  border: 1px solid #f99b31;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #f99b31;
  font-size: 14px
}

.ivu-drawer .approval-card .main-info>img {
  position: absolute;
  right: 30px
}

.ivu-drawer .leave-list {
  font-size: 14px
}

.ivu-drawer .leave-list .info-item {
  margin-top: 10px
}

.ivu-drawer .leave-list .info-item .title {
  color: #999
}

.ivu-drawer .leave-list .info-item .title-strong {
  display: block;
  margin: 20px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333
}

.ivu-drawer .leave-list .info-item .content {
  margin-left: 10px;
  color: #333
}

.ivu-drawer .img-wrap {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center
}

.ivu-drawer .img-wrap img {
  width: 40%;
  height: 150px
}

.ivu-drawer .img-wrap img:nth-child(2n) {
  margin-left: 20px
}

.manager-part {
  padding: 0 20px
}

.manager-part .approal-title {
  font-size: 16px;
  font-weight: bold
}

.manager-part .approval-group {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin: 20px 0
}

.manager-part .approval-group .ivu-radio-wrapper:after,
.manager-part .approval-group .ivu-radio-wrapper:before {
  width: 0
}

.manager-part .approval-group .ivu-radio-wrapper {
  padding: 0;
  width: 96px;
  height: 40px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 14px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box
}

.manager-part .approval-group .ivu-radio-wrapper:first-child {
  color: #5bbb7e;
  border-color: #5bbb7e
}

.manager-part .approval-group .ivu-radio-wrapper:last-child {
  color: #dc6e6e;
  margin-left: 30px;
  border-color: #dc6e6e;
  border-left: 1px solid
}

.manager-part .approval-group .ivu-radio-wrapper.ivu-radio-wrapper-checked:first-child {
  background: #5bbb7e;
  color: #fff
}

.manager-part .approval-group .ivu-radio-wrapper.ivu-radio-wrapper-checked:last-child {
  background: #e85555;
  color: #fff
}

.manager-part label {
  color: #999;
  font-size: 14px
}

.user-part {
  padding-left: 20px;
  font-size: 14px
}

.user-part h4 {
  color: #999
}

.ivu-drawer-footer {
  padding-left: 40px;
  text-align: left
}

.flow-wrapper {
  position: relative
}

.flow-item {
  position: relative;
  margin: 0;
  padding: 0 0 12px
}

.flow-item-line {
  height: 100%;
  border-left: 2px solid #c6c6c6;
  position: absolute;
  left: 18px;
  top: 0
}

.flow-item-header {
  width: 40px;
  height: 40px;
  background-color: #4196ff;
  border-radius: 50%;
  position: absolute;
  z-index: 1;
  color: #fff
}

.flow-item-content {
  min-height: 60px;
  padding: 1px 1px 10px 50px;
  font-size: 14px;
  position: relative;
  top: -3px
}

.flow-item-content.hasCC:not(.flow-CC)::after {
  content: "";
  height: 100%;
  border-left: 2px solid #c6c6c6;
  position: absolute;
  z-index: 0;
  left: 18px;
  top: 3px
}

.flow-item:last-child .flow-item-line {
  display: none
}

.flow-avatar {
  -ms-flex-negative: 0;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  line-height: 40px;
  background: #4196ff;
  border-radius: 50%;
  font-size: 14px;
  text-align: center;
  color: #fff
}

.flow-avatar-imgWrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%
}

.flow-avatar img {
  width: 100%;
  min-height: 100%
}

.flow-avatar--small {
  position: relative;
  width: 30px;
  height: 30px;
  margin: 0 auto;
  line-height: 30px;
  font-size: 12px
}

.flow-avatar-ellipsis {
  position: absolute;
  top: -16%;
  left: 16%;
  font-size: 20px
}

.flow-avatar-iconWrapper {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden
}

.flow-avatar-iconWrapper>img {
  width: 100%
}

.flow-avatar>span {
  display: inline-block;
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
  letter-spacing: 1px
}

.flow-content-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  color: #666
}

.flow-content-btn--hideDetail {
  color: #4196ff;
  font-size: 14px
}

.flow-content-btn--showDetail {
  color: #666;
  font-size: 14px
}

.flow-content-body {
  min-height: 1em
}

.flow-content-name {
  color: #161616
}

.flow-content-reason {
  color: #999
}

.flow-content-title {
  font-size: 14px;
  color: #161616
}

.flow-content-time {
  color: #999;
  font-size: 12px
}

.flow-detail-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-top: 10px
}

.flow-detail-wrapper {
  width: 100%;
  margin-left: 10px
}

.flow-detail-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between
}

.flow-overview-list {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex
}

.flow-overview-item {
  margin-top: 6px;
  margin-right: 10px
}

.flow-overview-body {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between
}

.flow-overview-name {
  margin-top: 3px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.flow-icon-radio {
  display: inline-block;
  width: 19px;
  height: 15px;
  margin: 12px;
  background: url(/image/radio-white.svg) no-repeat;
  -webkit-transform: scale(1.3);
  transform: scale(1.3)
}

.flow-status-icon {
  position: relative
}

.flow-status-icon::after {
  content: "";
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 16px;
  height: 16px;
  -webkit-transform: translate(-3px, -3px) scale(1.3);
  transform: translate(-3px, -3px) scale(1.3)
}

.flow-status-icon-pass::after {
  background: url(/image/circle-check-green.svg) no-repeat
}

.flow-status-icon-processing::after {
  background: url(/image/circle-line-orange.svg) no-repeat
}

.flow-status-icon-reject::after {
  background: url(/image/circle-fork-red.svg) no-repeat
}

.flow-status-bgcolor {
  position: relative
}

.flow-status-bgcolor::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%
}

.flow-status-bgcolor-pass::after {
  background: #47ba32
}

.flow-status-bgcolor-processing::after {
  background: #ffa23f
}

.flow-status-bgcolor-reject::after {
  background: #ff5c39
}

.flow-CC .flow-overview-item {
  max-width: 4em;
  font-size: 14px;
  color: #666
}

.cssIcon-triangle {
  display: inline-block;
  width: 5px;
  height: 5px
}

.cssIcon-triangle--t2b {
  margin: 5px;
  border-left: 1px solid #888;
  border-bottom: 1px solid #888;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg)
}

.cssIcon-triangle--b2t {
  margin: 2px 7px;
  border-left: 1px solid #4196ff;
  border-bottom: 1px solid #4196ff;
  -webkit-transform: rotate(135deg);
  transform: rotate(135deg)
}

.approval-btn-confirm {
  width: 96px;
  line-height: 32px;
  background: #fff;
  border: 1px solid #5bbb7e;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #5bbb7e
}

.approval-btn-confirm:hover {
  background: #5bbb7e;
  border: 1px solid #5bbb7e;
  color: #fff
}

.approval-btn-refuse {
  width: 96px;
  line-height: 32px;
  background: #fff;
  border: 1px solid #dc6e6e;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #dc6e6e
}

.approval-btn-refuse:hover {
  background: #dc6e6e;
  border: 1px solid #dc6e6e;
  color: #fff
}

/*# sourceMappingURL=attTeacherLeave.css.map */
.detail{
  padding-bottom: 20px;
  position: relative;
}
.detail-top {
    position:relative;
}
.top-line{
 border-bottom: 1px solid #e8eaec;
    padding: 14px 16px;
    line-height: 1;
}
.detail-top > p{
    font-size:16px;
    color:#333;
    font-weight:bold;
    margin-bottom:20px;
}
.detail-top .person {
    margin-bottom:20px;
}
.detail-top .person .left {
    width: 50px;
    height: 50px;
    line-height:50px;
    text-align:center;
    border-radius: 50%;
    background: #4196FF;
    font-size:18px;
    color:#fff;
    font-weight:bold;
    display: inline-block;
}
.detail-top .person > div {
    height:50px;
    color: #999;
    padding-left: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.detail-top .person > div .name{
    font-size:16px;
    color:#333;
    margin:2px 0;
}
.detail-top .officeStatus {
    position: absolute;
    right: 27px;
    top: 22px;
    width: 108px;
    height: 110px;
}
.detail-top .officeStatus img{
    width:100%;
    height:100%;
}
.detail-con > div {
    display: flex;
    margin-bottom:15px;
}
.detail-con > div > span {
    text-align: right;
    color: #999;
}
.detail-con > div > div {
    flex:0.9;
    max-width: 80%;
}
.detail-con > div > div .office-info {
    display: flex;
    margin-bottom: 5px;
    height: 21px;
}
.detail-con > div > div .office-info span{
    flex: 1;
    max-width: 85%;
}
.detail-con .ivu-btn-primary {
    width:55px;
    height:25px;
    position: absolute;
    right: 15px;
}
.bottom-btn {
  position: fixed;
  bottom: 0;
  background: #fff;
  z-index: 9999;
  border-top: 1px solid #f0f0f0;
  width: 560px;
  transform: translateX(-16px);
  height: 56px;
  padding: 10px 0 10px 26px;
}
.bottom-btn .ivu-btn-primary {
    width: 96px;
    height: 32px;
}

.detail .proval-con {
    border: none;
    margin-bottom: 10px;
}
.proval-con.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
    padding: 0px;
    position: relative;
    background: #fff;
    border: none;
    color: #333;
    font-weight: bold;
}
.proval-con.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header > i {
    position: absolute;
    top: 12px;
    right: -13px;
}
.proval-con .ivu-collapse-simple {
    border: none;
}
.proval-con .ivu-collapse-content {
    padding: 0px;
}
.proval-con .ivu-collapse-content > .ivu-collapse-content-box {
    padding:0px;
}
.proval-con .proval-list{

}
.proval-con .proval-li {
    display: flex;
    margin-bottom: 15px;
    color:#666;
}
.proval-con .proval-li .left {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    background: #4196FF;
    color: #fff;
    display: inline-block;
    margin: 5px 10px 0 0;
    position: relative;
}
.proval-con .proval-li .left::after {
    content: "";
    width: 2px;
    height: 23px;
    position: absolute;
    top: 32px;
    left: 14px;
    background: #C6C6C6;
}
.proval-con .proval-li:last-child .left::after {
    display: none;
}
.proval-con .proval-li .left .status{
    width:16px;
    height:16px;
    bottom:-2px;
    right:-4px;
}
.proval-con .proval-li .center {
    flex: 1;
}
.proval-con .proval-li .center > div:nth-child(1) {
    color: #666;
}
.proval-con .proval-li:first-child .center div:nth-child(1) {
    color: #161616;
}
.proval-con .proval-li .center div:nth-child(2) {
    color:#999;
}
.copy ul {
    display: flex;
    padding-top: 8px;
}
.copy li {
    width: 45px;
    margin-right:10px;
    justify-content: center;
    display: flex;
    align-items: center;
    flex-direction: column;
}
.copy li > div{
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    background: #4196FF;
    color: #fff;
    font-size:12px;
}
.copy li > p {
    color: #666;
}
.detail-approval{
    margin-top:25px;
}
.detail-approval > span{
    color:#999;
}
.detail-approval .approval {
    margin: 13px 0 25px;
}
/*销毁*/
.bottom-btn .ivu-btn.destruction {

}
/*同意*/
.bottom-btn .ivu-btn.agree {
    color: #5BBB7E;
    border-color: #5BBB7E;
}
.bottom-btn .ivu-btn.agree:hover {
    background-color: #5BBB7E;
    border-color: #5BBB7E;
    color:#fff;
}
/*拒绝*/
.bottom-btn .ivu-btn.refuse {
    color: #DC6E6E;
    border-color: #DC6E6E;
}
.bottom-btn .ivu-btn.refuse:hover {
    background-color: #DC6E6E;
    border-color: #DC6E6E;
    color: #fff;
}
</style>
