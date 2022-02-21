<template>
  <div>
    <div class="titles">审批流程</div>
    <div class="content">
      <ul class="flow-wrapper">
        <li
          class="flow-item"
          v-for="(item, index) in options.workflow"
          :key="index"
        >
          <!-- 左侧直线 -->
          <div
            class="flow-item-line"
            v-if="item.ApprovalMemberList.length> 0 || item.ApprovalCCMemberList.length>0"
          ></div>
          <!-- 发起人 -->
          <div
            class="flow-item-header"
            v-if="item.ApprovalFlowNodeName === '发起人'"
          >
            <div class="flow-avatar">
              <div
                v-if="item.ApprovalMemberList[0].Icon && item.ApprovalMemberList[0].Icon !== ''"
                class="flow-avatar-imgWrapper"
              >
                <img
                  :src="item.ApprovalMemberList[0].Icon"
                  :alt="item.ApprovalMemberList[0].FullName"
                />
              </div>
              <span
                v-else
                :title="item.ApprovalMemberList[0].FullName"
              >
                {{ showName(item.ApprovalMemberList[0].FullName) }}
              </span>
            </div>
          </div>
          <div
            class="flow-item-content"
            :class="{hasCC:item.ApprovalCCMemberList.length > 0}"
            v-if="item.ApprovalFlowNodeName === '发起人'"
          >
            <div class="flow-content-header">
              <div class="flow-content-title">
                {{ item.ApprovalMemberList[0].FullName }}
              </div>
              <div class="flow-content-time">
                {{ item.ApprovalMemberList[0].ApprovalDate !== "" ? xy.moment(item.ApprovalMemberList[0].ApprovalDate).format('MM.DD HH:mm'):"" }}
              </div>
            </div>
            <div class="flow-content-body">
              <div class="flow-content-reason">发起申请</div>
            </div>
          </div>
          <!-- 只有一人 -->
          <div
            class="flow-item-header"
            v-if="item.ApprovalFlowNodeName !== '发起人' && item.ApprovalMemberList.length === 1"
          >
            <div
              class="flow-avatar flow-status-icon"
              :class="{'flow-status-icon-pass': item.Status === '已通过','flow-status-icon-processing': item.Status === '待审批' && index === options.currentAuditNodeIndex, 'flow-status-icon-reject': item.Status === '已拒绝'}"
            >
              <div
                v-if="item.ApprovalMemberList[0].Icon && item.ApprovalMemberList[0].Icon !== ''"
                class="flow-avatar-imgWrapper"
              >
                <img
                  :src="item.ApprovalMemberList[0].Icon"
                  :alt="item.ApprovalMemberList[0].FullName"
                />
              </div>
              <span
                v-else
                :title="item.ApprovalMemberList[0].FullName"
              >
                {{ showName(item.ApprovalMemberList[0].FullName) }}
              </span>
            </div>
          </div>
          <div
            class="flow-item-content"
            :class="{hasCC:item.ApprovalCCMemberList.length > 0}"
            v-if="item.ApprovalFlowNodeName !== '发起人' && item.ApprovalMemberList.length === 1"
          >
            <div class="flow-content-header">
              <div class="flow-content-title">
                {{ item.ApprovalMemberList[0].FullName }}
                <span
                  v-show="item.isFinished || (item.Status === '待审批' && index === options.currentAuditNodeIndex)"
                  >({{ item.Status }})</span
                >
              </div>
              <div class="flow-content-time">
                {{ item.ApprovalMemberList[0].ApprovalDate!==""?xy.moment(item.ApprovalMemberList[0].ApprovalDate).format('MM.DD HH:mm') :""}}
              </div>
            </div>
            <div class="flow-content-body">
              <div class="flow-content-reason work-break-wrap">
                {{ item.ApprovalMemberList[0].Option }}
              </div>
            </div>
          </div>
          <!-- 多人审批（会签、或签） -->
          <div
            class="flow-item-header"
            v-if="item.ApprovalMemberList.length > 1"
          >
            <div
              class="flow-avatar flow-status-icon"
              :class="{'flow-status-icon-pass': item.Status === '已通过','flow-status-icon-processing': item.Status === '待审批'  && index === options.currentAuditNodeIndex, 'flow-status-icon-reject': item.Status === '已拒绝'}"
            >
              {{ showName(item.ApprovalFlowNodeName) }}
            </div>
          </div>
          <div
            class="flow-item-content"
            :class="{hasCC:item.ApprovalCCMemberList.length > 0}"
            v-if="item.ApprovalMemberList.length > 1"
          >
            <div class="flow-content-header">
              <div class="flow-content-title">
                {{ item.ApprovalFlowNodeName }} {{
                item.ApprovalMemberList.length }} 人
                <span
                  v-show="item.isFinished || (item.Status === '待审批' && index === options.currentAuditNodeIndex)"
                  >({{ item.Status }})</span
                >
              </div>
              <a
                v-if="item.isOverviewMode"
                href="javascript:;"
                class="flow-content-btn--showDetail"
                @click="setStatus_isOverviewMode(item, index, 'normal', false)"
                >展开
                <span class="cssIcon-triangle cssIcon-triangle--t2b"></span
              ></a>
              <a
                v-else
                href="javascript:;"
                class="flow-content-btn--hideDetail"
                @click="setStatus_isOverviewMode(item, index, 'normal', true)"
                >收起<span
                  class="cssIcon-triangle cssIcon-triangle--b2t"
                ></span
              ></a>
            </div>
            <!-- 多人：默认的缩略预览模式 -->
            <div v-if="item.isOverviewMode" class="flow-overview-body">
              <ul class="flow-overview-list">
                <li
                  class="flow-overview-item"
                  v-for="(member,memberIndex) in item.overviewList"
                  :key="memberIndex"
                >
                  <div
                    class="flow-avatar flow-avatar--small flow-status-bgcolor"
                    :class="{'flow-status-bgcolor-pass': member.Status === '已通过','flow-status-bgcolor-processing': member.Status === '待审批'   && index === options.currentAuditNodeIndex, 'flow-status-bgcolor-reject': member.Status === '已拒绝'}">
                    <div
                      v-if="member.Icon && member.Icon !== ''"
                      class="flow-avatar-imgWrapper"
                    >
                      <img
                        :src="member.Icon"
                        :alt="member.FullName"
                      />
                    </div>
                    <span v-else :title="member.FullName">
                      {{ showName(member.FullName) }}
                    </span>
                  </div>
                  <p class="flow-overview-name">{{member.FullName}}</p>
                </li>
                <li
                  class="flow-overview-item"
                  v-if="item.ApprovalMemberList.length > 5"
                >
                  <div class="flow-avatar flow-avatar--small">
                    <span class="flow-avatar-ellipsis">...</span>
                  </div>
                </li>
              </ul>
              <!-- 发生审批结论时 -->
              <div class="flow-content-time" v-if="item.isFinished">
                {{item.lastComplete_time!=="" ? xy.moment(item.lastComplete_time).format('MM.DD HH:mm') : ""}}
              </div>
            </div>
            <!-- 多人：展开详情 -->
            <div v-else class="flow-content-body">
              <ul class="flow-detail-list">
                <li
                  class="flow-detail-item"
                  v-for="(member,memberIndex) in item.ApprovalMemberList"
                  :key="memberIndex"
                >
                  <div
                    class="flow-avatar flow-avatar--small flow-status-bgcolor"
                    :class="{'flow-status-bgcolor-pass': member.Status === '已通过','flow-status-bgcolor-processing': member.Status === '待审批'  && index === options.currentAuditNodeIndex, 'flow-status-bgcolor-reject': member.Status === '已拒绝'}">
                    <div
                      v-if="member.Icon && member.Icon !== ''"
                      class="flow-avatar-imgWrapper"
                    >
                      <img
                        :src="member.Icon"
                        :alt="member.FullName"
                      />
                    </div>
                    <span v-else :title="member.FullName">
                      {{ showName(member.FullName) }}
                    </span>
                  </div>
                  <div class="flow-detail-wrapper">
                    <div class="flow-detail-header">
                      <div class="flow-content-name">
                        {{member.FullName}}
                      </div>
                      <div class="flow-content-time">
                        {{member.ApprovalDate!=="" ? xy.moment(member.ApprovalDate).format('MM.DD HH:mm') : ""}}
                      </div>
                    </div>
                    <div class="flow-detail-body">
                      <div class="flow-content-reason work-break-wrap">
                        {{member.Option}}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- 抄送 -->
          <div
            class="flow-item-header flow-CC"
            v-if="item.ApprovalCCMemberList.length > 0"
          >
            <span class="flow-icon-radio"></span>
          </div>
          <div
            class="flow-item-content flow-CC"
            v-if="item.ApprovalCCMemberList.length > 0"
          >
            <div class="flow-content-header">
              <div class="flow-content-title">
                抄送 {{ item.ApprovalCCMemberList.length }} 人
              </div>
              <a
                v-if="item.isOverviewMode_CC"
                href="javascript:;"
                class="flow-content-btn--showDetail"
                @click="setStatus_isOverviewMode(item, index, 'CC', false)"
                >展开
                <span class="cssIcon-triangle cssIcon-triangle--t2b"></span
              ></a>
              <a
                v-else
                href="javascript:;"
                class="flow-content-btn--hideDetail"
                @click="setStatus_isOverviewMode(item, index, 'CC', true)"
                >收起<span
                  class="cssIcon-triangle cssIcon-triangle--b2t"
                ></span
              ></a>
            </div>
            <!-- 抄送：默认的缩略预览模式 -->
            <div v-if="item.isOverviewMode_CC" class="flow-overview-body">
              <ul class="flow-overview-list">
                <li
                  class="flow-overview-item"
                  v-for="(member,memberIndex) in item.overviewList_CC"
                  :key="memberIndex"
                >
                  <div class="flow-avatar flow-avatar--small">
                    <div
                      v-if="member.Icon && member.Icon !== ''"
                      class="flow-avatar-imgWrapper"
                    >
                      <img
                        :src="member.Icon"
                        :alt="member.FullName"
                      />
                    </div>
                    <span v-else :title="member.FullName">
                      {{ showName(member.FullName) }}
                    </span>
                  </div>
                  <p class="flow-overview-name">{{member.FullName}}</p>
                </li>
                <li
                  class="flow-overview-item"
                  v-if="item.ApprovalCCMemberList.length > 5"
                >
                  <div class="flow-avatar flow-avatar--small">
                    <span class="flow-avatar-ellipsis">...</span>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 抄送：展开详情 -->
            <div v-else class="flow-content-body">
              <ul class="flow-detail-list">
                <li
                  class="flow-detail-item"
                  v-for="(member,memberIndex) in item.ApprovalCCMemberList"
                  :key="memberIndex"
                >
                  <div
                    class="flow-avatar flow-avatar--small flow-status-bgcolor"
                  >
                    <div
                      v-if="member.Icon && member.Icon !== ''"
                      class="flow-avatar-imgWrapper"
                    >
                      <img
                        :src="member.Icon"
                        :alt="member.FullName"
                      />
                    </div>
                    <span v-else :title="member.FullName">
                      {{ showName(member.FullName) }}
                    </span>
                  </div>
                  <div class="flow-detail-wrapper">
                    <div class="flow-detail-header">
                      <div class="flow-content-name">
                        {{member.FullName}}
                      </div>
                    </div>
                    <div class="flow-detail-body"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'WorkflowApproval',
    props: {
      workflow: Array
    },
    data () {
      return {
        info: '',
        type: 0,
        DetailParameter: '',
        LeaveApplicationID: 0,
        ServiceDoMainName: '',
        disLook: false,
        detailInfo: {},
        dataNews: '您还没有审批流程的信息，请设置审批流程。',
        code: '',
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
        DeniedDescription: '',
        options: {
          currentAuditNodeIndex: -1, // 当前待审批节点的下标
          workflow: []
        },
        mainUrl: this.xyApi + '/base'
      }
    },
    computed: {
      worflowList () {
        return this.workflow
      },
      userID () {
        return this.$store.state.common.userBaseInfo.UserID
      }
    },
    watch: {
      worflowList: {
        handler (newArr) {
          if (newArr.length > 0) {
            this.changeWorkflow(newArr)
          }
        },
        immediate: true
      }
    },
    methods: {
      changeWorkflow (workflow) {
        // 标记最后一个 IsComplete 的节点。IsComplete：是否通过审批（而不是该节点是否结束）。故，目前需要单独判断该节点是否结束。
        let lastPassNode = 0 // 临时记载：当前遍历中，最后通过审批的节点索引下标；其中，第0个为发起人，即尚未有审批
        this.options.currentAuditNodeIndex = -1 // 当前待审批节点的下标
        workflow.map((element, index) => {
          // 【声明】该节点暂存信息 & 相关默认值
          if (element.isOverviewMode === undefined) {
            element.isOverviewMode = true
          }
          if (element.isOverviewMode_CC === undefined) {
            element.isOverviewMode_CC = true
          }
          element.overviewList = [] // 缩略预览列表(不大于5个)
          element.isFinished = false // 该节点是否审批结束，原因见上
          element.currentAuditNode = false // 该节点是否为当前待审核节点
          // 若该审批项目结束，缩略列表显示最后审批结果的时间与状态
          element.lastComplete_time = undefined
          element.lastComplete_status = undefined
          // 确定该节点的状态
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
              this.options.currentAuditNodeIndex = index
            }
          }

          let lastTimeMember // 暂存：最近的一次时间点
          element.ApprovalMemberList.map((memberItem, memberIndex) => {
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
                  } else {
                    element.lastComplete_time = lastTimeMember
                    element.lastComplete_status = memberItem.Status
                  }
                }
              }
            }
            if (!element.isFinished) {
              // 获取当前需审批的节点：第一个非完成节点
              if (
                this.approvalData.currentNode === undefined &&
                element.ApprovalFlowNodeName !== '发起人'
              ) {
                this.approvalData.currentNode = element
                this.$store.commit('common/getCurentNode', element)
                // 获取该节点中该用户的状态
                element.ApprovalMemberList.map((memberItem, memberIndex) => {
                  if (memberItem.UserID === this.userID && memberItem.Status === '待审批') {
                    // this.status.couldApproval = true
                  }
                })
              }
            }
          })
          // 抄送列表，部分逻辑大致同上
          element.overviewList_CC = []
          element.ApprovalCCMemberList.map((CCItem, CCIndex) => {
            // 缩略图列表仅显示前4个，其余显示省略号；若共5人，则不显示省略号，直接全部显示
            if (CCIndex < 4 || element.ApprovalCCMemberList.length === 5) {
              element.overviewList_CC.push(CCItem)
            }
          })
        })
        this.$set(this, 'detailInfo', workflow)
        this.options.workflow = workflow
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
      // 展开或折叠
      setStatus_isOverviewMode: function (item, index, type, value) {
        if (type === 'normal') {
          item.isOverviewMode = value
        } else if (type === 'CC') {
          item.isOverviewMode_CC = value
        } else {
          item.isOverviewMode = value
        }
        this.$set(this.worflowList, index, item)
      }
    }
  }
</script>
<style lang="less" scoped>
.titles{
  margin: 40px 0 20px;
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
    top: 12px;
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

    .flow-avatar-iconWrapper > img {
        width: 100%
    }

.flow-avatar > span {
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
    white-space: nowrap
}

.flow-icon-radio {
    display: inline-block;
    width: 19px;
    height: 15px;
    margin: 12px;
    background: url(~@/assets/common/workFlow/radio-white.svg) no-repeat;
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
    background: url(~@/assets/common/workFlow/circle-check-green.svg) no-repeat;
}

.flow-status-icon-processing::after {
    background: url(~@/assets/common/workFlow/circle-line-orange.svg) no-repeat;
}

.flow-status-icon-reject::after {
    background: url(~@/assets/common/workFlow/circle-fork-red.svg) no-repeat;
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

</style>
