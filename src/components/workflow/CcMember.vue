<template>
  <div class="node-wrap">
    <div class="node-wrap-box">
      <div>
        <div class="title" style="background:#3296fa;">
          <span>抄送人</span>
          <Icon @click="delCc(workflowList.WorkFlowNodeModels,i)" type="md-close" color="#fff" size="14" class="close" />
        </div>
        <div class="content" @click="ccUser(obj)">
          <div class="text">
            <span v-if="obj.CcMemberList.length>0">
              <span v-for="(ccItem,ccIndex) in obj.CcMemberList" :key="ccIndex" v-cloak>{{ccItem.FullName}}&nbsp;&nbsp;</span>
            </span>
            <span v-else style="color:#bfbfbf;">请设置抄送人</span>
          </div>
          <Icon type="ios-arrow-forward arrow"></Icon>
        </div>
      </div>
    </div>
    <div class="add-node-btn-box">
        <div class="add-node-btn"><button class="btn" @click="addNode(false,$event,i,i)"><Icon type="md-add" color="#fff" size="22" /></button></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'CcMember',
    props: {
      ccItem: Object,
      workflowList: Object,
      i: Number
    },
    data () {
      return {
        isAntPopover: false,
        nodeOption: {}
      }
    },
    computed: {
      obj () {
        let newObj = this.ccItem
        return newObj
      }
    },
    mounted () {},
    methods: {
      // 删除抄送人
      delCc (val, i) {
        val.splice(i, 1)
      },
      // 删除抄送弹框内的抄送人
      delCcModal (val, i) {
        val.splice(i, 1)
        // this.isAntPopover = false
      },
      // 弹出框//审批人/抄送人/条件节点
      addNode (bool, e, allIndex, index) {
        this.nodeOption = {
          bool: bool,
          eLeft: e.target.getBoundingClientRect().left,
          eTop: e.target.getBoundingClientRect().top,
          all: this.workflowList,
          allIndex: allIndex,
          val: this.workflowList.WorkFlowNodeModels,
          index: index
        }
        this.$store.commit('common/getNodeOption', this.nodeOption)
        this.$store.commit('common/changeIsAntPopover', true)
      },
      antPopover () {
        this.isAntPopover = false
      },
      // 点击抄送人节点
      ccUser (val) {
        this.$store.commit('common/getCcUser', val)
        this.$store.commit('common/changeCcUserModal', true)
      }
    }
  }
</script>
<style lang="less" scoped>
.worflow-submit{
    width:100%;
    position:fixed;
    bottom:0;
    background:#fff;
    height:60px;
    display:flex;
    justify-content:center;
    align-items:center;
}
.zoom {
    display: flex;
    position: fixed;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    height: 40px;
    width: 125px;
    right: 40px;
    z-index: 10;
}
    .zoom .zoom-in, .zoom .zoom-out {
        width: 30px;
        height: 30px;
        background: #fff;
        color: #c1c1cd;
        cursor: pointer;
        background-size: 100%;
        background-repeat: no-repeat;
        font-size: 22px;
        color:#333;
        display: flex;
        justify-content: center;
        align-items: center;
    }
        .zoom .zoom-in.disabled,
        .zoom .zoom-out.disabled {
            opacity: .5;
        }
.dingflow-design .ie-polyfill-container {
    display: -ms-grid;
    -ms-grid-columns: min-content;
}

.dingflow-design .box-scale {
    transform: scale(1);
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 54px;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    min-width: -webkit-min-content;
    min-width: -moz-min-content;
    min-width: min-content;
    background-color: #f5f5f5;
    -webkit-transform-origin: 0 0 0;
    transform-origin: 0 0 0;
}

.dingflow-design {
    width: 100%;
    background-color: #f5f5f5;
    overflow: auto;
    padding: 20px;
    margin-bottom: 40px;
}

.node-wrap-box.start-node:before {
    content: none;
}

.dingflow-design .node-wrap {
    flex-direction: column;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    /*padding: 0 50px;*/
    position: relative;
}

.dingflow-design .branch-wrap,
.dingflow-design .node-wrap {
    display: inline-flex;
    width: 100%;
}

.node-wrap-box {
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    position: relative;
    width: 220px;
    min-height: 72px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
}

    .node-wrap-box:before {
        content: "";
        position: absolute;
        top: -12px;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        width: 0;
        height: 4px;
        border-style: solid;
        border-width: 8px 6px 4px;
        border-color: #cacaca transparent transparent;
        background: #f5f5f7;
    }

    .node-wrap-box:after {
        pointer-events: none;
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2;
        border-radius: 4px;
        border: 1px solid transparent;
        transition: all .1s cubic-bezier(.645,.045,.355,1);
        box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
    }

    .node-wrap-box.active:after,
    .node-wrap-box:active:after,
    .node-wrap-box:hover:after {
        border: 1px solid #3296fa !important;
        box-shadow: 0 0 6px 0 rgba(50,150,250,.3) !important;
    }
    .node-wrap-box .title .close{
        display:none;
    }
    .node-wrap-box:hover .title .close {
        display: block;
    }
    .node-wrap-box .title {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 16px;
        padding-right: 10px;
        width: 100%;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        color: #fff;
        text-align: left;
        background: #576a95;
        border-radius: 4px 4px 0 0;
    }

    .node-wrap-box .content {
        position: relative;
        font-size: 14px;
        padding: 16px;
        padding-right: 30px;
    }

        .node-wrap-box .content .arrow {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 14px;
            font-size: 14px;
            color: #979797;
        }

        .node-wrap-box .content .text {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }

.dingflow-design .add-node-btn-box {
    width: 240px;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    position: relative;
}

    .dingflow-design .add-node-btn-box:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /*z-index: -1;*/
        margin: auto;
        width: 2px;
        height: 100%;
        background-color: #cacaca;
    }

.dingflow-design .add-node-btn {
    user-select: none;
    width: 240px;
    padding: 20px 0 32px;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    flex-shrink: 0;
    -webkit-box-flex: 1;
    flex-grow: 1;
}

    .dingflow-design .add-node-btn .btn {
        cursor: pointer;
        outline: none;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
        width: 30px;
        height: 30px;
        background: #3296fa;
        border-radius: 50%;
        position: relative;
        border: none;
        -webkit-transition: all .3s cubic-bezier(.645,.045,.355,1);
        transition: all .3s cubic-bezier(.645,.045,.355,1);
    }

        .dingflow-design .add-node-btn .btn:hover {
            transform: scale(1.3);
            box-shadow: 0 13px 27px 0 rgba(0,0,0,.1);
        }
.dingflow-design .branch-box-wrap {
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    min-height: 270px;
    width: 100%;
    -ms-flex-negative: 0;
    flex-shrink: 0;
}

.dingflow-design .branch-box {
    display: flex;
    overflow: visible;
    min-height: 180px;
    height: auto;
    border-bottom: 2px solid #ccc;
    border-top: 2px solid #ccc;
    position: relative;
    /*width: 100%;*/
    /*margin-top: 15px;*/
}

.dingflow-design .add-branch {
    border: none;
    outline: none;
    user-select: none;
    justify-content: center;
    font-size: 12px;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    color: #3296fa;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    transform-origin: center center;
    cursor: pointer;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    -webkit-transition: all .3s cubic-bezier(.645,.045,.355,1);
    transition: all .3s cubic-bezier(.645,.045,.355,1);
}

    .dingflow-design .add-branch:hover {
        transform: translateX(-50%) scale(1.1);
        box-shadow: 0 8px 16px 0 rgba(0,0,0,.1);
    }

.dingflow-design .col-box {
    display: inline-flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
}

.dingflow-design .branch-box .col-box:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    margin: auto;
    width: 2px;
    height: 100%;
    background-color: #cacaca;
}

.dingflow-design .branch-box .col-box {
    background: #f5f5f7;
}

.top-left-cover-line,
.top-right-cover-line {
    position: absolute;
    height: 3px;
    width: 50%;
    background-color: #f5f5f7;
    top: -2px;
}

.top-left-cover-line {
    left: -1px;
}

.top-right-cover-line {
    right: -1px;
}

.bottom-left-cover-line,
.bottom-right-cover-line {
    position: absolute;
    height: 3px;
    width: 50%;
    background-color: #f5f5f7;
    bottom: -2px;
}

.bottom-left-cover-line {
    left: -1px;
}

.bottom-right-cover-line {
    right: -1px;
}

.dingflow-design .condition-node {
    min-height: 170px;
}

.dingflow-design .condition-node,
.dingflow-design .condition-node-box {
    display: inline-flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-flex: 1;
}

.dingflow-design .condition-node-box {
    padding-top: 30px;
    padding-right: 50px;
    padding-left: 50px;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    /*flex-grow: 1;*/
    position: relative;
}

    .dingflow-design .condition-node-box:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 2px;
        height: 100%;
        background-color: #cacaca;
    }

.dingflow-design .auto-judge {
    position: relative;
    width: 220px;
    min-height: 72px;
    background: #fff;
    border-radius: 4px;
    padding: 14px 19px;
    cursor: pointer;
}
    .dingflow-design .auto-judge .sort-left,
    .dingflow-design .auto-judge .sort-right {
        position: absolute;
        top: 0;
        bottom: 0;
        display: none;
        z-index: 1;
    }
    .dingflow-design .auto-judge .sort-left {
        left: 0;
        border-right: 1px solid #f6f6f6;
    }
    .dingflow-design .auto-judge .sort-right {
        right: 0;
        border-left: 1px solid #f6f6f6;
    }
    .dingflow-design .auto-judge:hover .sort-left,
    .dingflow-design .auto-judge:hover .sort-right {
        display: flex;
        align-items: center;
    }
    .dingflow-design .auto-judge .sort-left:hover,
    .dingflow-design .auto-judge .sort-right:hover {
        background: #efefef;
    }
    .dingflow-design .auto-judge .title-wrapper {
        position: relative;
        font-size: 12px;
        color: #15bc83;
        text-align: left;
        line-height: 16px;
    }

.editable-title {
    line-height: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: 1px dashed transparent;
}

    .editable-title:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 40px;
    }

.anticon:before {
    display: block;
}

.dingflow-design .auto-judge:after {
    pointer-events: none;
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    border-radius: 4px;
    border: 1px solid transparent;
    transition: all .1s cubic-bezier(.645,.045,.355,1);
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
}

.dingflow-design .auto-judge.active:after,
.dingflow-design .auto-judge:active:after,
.dingflow-design .auto-judge:hover:after {
    border: 1px solid #3296fa;
    box-shadow: 0 0 6px 0 rgba(50,150,250,.3);
}

.dingflow-design .auto-judge .title-wrapper .editable-title {
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.dingflow-design .auto-judge .title-wrapper .priority-title {
    float: right;
    margin-right: 10px;
    color: rgba(25,31,37,.56);
}

.anticon {
    display: inline-block;
    font-style: normal;
    vertical-align: baseline;
    text-align: center;
    text-transform: none;
    line-height: 1;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.dingflow-design .auto-judge .close {
    display: none;
    position: absolute;
    right: 6px;
    top: 2px;
    color: rgba(0,0,0,.25);
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    z-index: 2;
}
.dingflow-design .auto-judge:hover .close{
    display:block;
}
.anticon:before {
    display: block;
}

.dingflow-design .auto-judge .content {
    font-size: 14px;
    color: #191f25;
    text-align: left;
    margin-top: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.dingflow-design .end-node {
    border-radius: 50%;
    font-size: 14px;
    color: rgba(25,31,37,.4);
    text-align: left;
}

    .dingflow-design .end-node .end-node-circle {
        width: 10px;
        height: 10px;
        margin: auto;
        border-radius: 50%;
        background: #dbdcdc;
    }

    .dingflow-design .end-node .end-node-text {
        margin-top: 5px;
        text-align: center;
    }

.ant-popover {
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    color: rgba(0,0,0,.65);
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1030;
    cursor: auto;
    user-select: text;
    white-space: normal;
    font-weight: 400;
    text-align: left;
}

.ant-popover-placement-right,
.ant-popover-placement-rightBottom,
.ant-popover-placement-rightTop {
    padding-left: 10px;
}

.ant-popover-arrow {
    background: #fff;
    width: 8.48528137px;
    height: 8.48528137px;
    transform: rotate(45deg);
    position: absolute;
    display: block;
    border-color: transparent;
    border-style: solid;
}

.ant-popover-placement-right > .ant-popover-content > .ant-popover-arrow,
.ant-popover-placement-rightBottom > .ant-popover-content > .ant-popover-arrow,
.ant-popover-placement-rightTop > .ant-popover-content > .ant-popover-arrow {
    box-shadow: -3px 3px 7px rgba(0,0,0,.07);
}

.ant-popover-placement-rightTop > .ant-popover-content > .ant-popover-arrow {
    top: 12px;
}

.ant-popover-inner {
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,.15);
}

.ant-popover-inner-content {
    width: 220px;
    height: 141px;
    padding: 5px 10px 0px;
    color: rgba(0,0,0,.65);
}

.add-node-popover {
    min-height: 126px;
}

.add-node-popover-header {
    position: relative;
    margin-bottom: 10px;
    text-align: right;
}

.add-node-popover-close {
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 5px;
    color: rgba(0,0,0,.25);
}

.add-node-popover-body {
    display: flex;
}

.add-node-popover-item {
    cursor: pointer;
    text-align: center;
    flex: none;
    color: #191f25 !important;
    margin-right: 20px;
}

    .add-node-popover-item .item-wrapper {
        user-select: none;
        display: inline-block;
        width: 50px;
        height: 50px;
        margin-bottom: 5px;
        background: #fff;
        border: 1px solid #e2e2e2;
        border-radius: 50%;
        transition: all .3s cubic-bezier(.645,.045,.355,1);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .add-node-popover-item:hover .item-wrapper {
        background: #3296fa;
        box-shadow: 0 10px 20px 0 rgba(50,150,250,.4);
    }

    .add-node-popover-item:hover .iconfont {
        color: #fff;
    }

    .add-node-popover-item.approver .item-wrapper {
        color: #ff943e;
    }

    .add-node-popover-item.notifier .item-wrapper {
        color: #3296fa;
    }

    .add-node-popover-item.condition .item-wrapper {
        color: #15bc83;
    }
.app-user-box{
    margin-bottom:28px;
}
.app-user-box-title{
    font-size:14px;
    color:#333;
    font-weight:700;
    margin-bottom:20px;
}
.app-user-list {
    display: flex;
    flex-wrap: wrap;
}
.app-user-list-style {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90px;
    height: 30px;
    color: #4196ff;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(65,150,255,1);
    border-radius: 15px;
    margin-right: 30px;
    margin-bottom: 30px;
    padding: 0 10px;
}
.app-user-list-style-dashed {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90px;
    height: 30px;
    color: #4196ff;
    background: rgba(255,255,255,1);
    border: 1px dashed rgba(65,150,255,1);
    border-radius: 15px;
    padding: 0 10px;
    cursor: pointer;
}
</style>
