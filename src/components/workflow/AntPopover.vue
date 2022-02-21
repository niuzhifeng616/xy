<template>
  <div style="position: absolute;top: 0px;left: 0px;" v-show="isShow">
    <div>
        <div ref="antPopover" class="ant-popover ant-popover-placement-rightTop">
            <div class="ant-popover-content">
                <div class="ant-popover-arrow" ref="antArrow"></div>
                <div class="ant-popover-inner" role="tooltip">
                    <div>
                        <div class="ant-popover-inner-content">
                            <div class="add-node-popover">
                                <div class="add-node-popover-header">
                                    <Icon type="ios-close" size="24" class="cursor-p" @click="closeAnt"></Icon>
                                </div>
                                <div class="add-node-popover-body">
                                    <a class="add-node-popover-item approver" @click="addAppUserNode">
                                        <div class="item-wrapper">
                                            <i class="iconfont" style="font-size:28px;">&#xe61e;</i>
                                        </div>
                                        <p>审批人</p>
                                    </a>
                                    <a class="add-node-popover-item notifier" @click="addCcUserNode">
                                        <div class="item-wrapper">
                                            <i class="iconfont" style="font-size:28px;">&#xe7d5;</i>
                                        </div>
                                        <p>抄送人</p>
                                    </a>
                                    <a v-if="isAddThree&&type!==2" class="add-node-popover-item condition" @click="addCondition">
                                        <div class="item-wrapper">
                                            <i class="iconfont" style="font-size:23px;">&#xe620;</i>
                                        </div><p>条件分支</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
  export default {
    name: 'AntPopver',
    props: {
      type: Number,
      workflowList: Object
    },
    data () {
      return {
        x: '',
        y: '',
        itemAll: null,
        indexAll: '',
        newArrVal: '',
        newIndex: '',
        isOneNode: true,
        isAddThree: true,
        lastNode: false,
        recursion: 1,
        routeHierarchyNum: 0,
        aa: 0
      }
    },
    computed: {
      isShow () {
        return this.$store.state.common.isAntPopover
      }
    },
    watch: {
      isShow: {
        handler (newVal) {
          if (newVal) {
            this.addNode(this.$store.state.common.nodeOption)
          }
        },
        // deep: true,
        immediate: true
      },
      routeHierarchyNum: {
        handler (newVal) {
          if (newVal !== 0 && newVal !== '') {
            if (this.workflowList.WorkFlowNodeModels.length > 0) {
              if (newVal < 2) {
                this.addConditionRecursion(this.newArrVal, this.newIndex)
              } else {
                this.xy.msgError('当前分支条件不能大于2个')
              }
            } else {
              this.workflowList.WorkFlowNodeModels.push(this.newAddressNode())// 添加新路线节点
            }
          }
        },
        deep: true,
        immediate: true
      }
    },
    mounted () {
      this.$store.commit('common/getNodeOption', {})
      this.$store.commit('common/changeIsAntPopover', false)
    },
    methods: {
      newApprovalNode () {
        let obj = {
          WorkFlowID: 0,
          WorkFlowNodeID: (this.recursion++) * 5,
          NodeType: 2,
          ApprovalMemberRoleID: 0,
          ApprovalMemberType: 0,
          ApprovalMode: 0,
          Level: 1,
          ParentID: 0,
          IsApprovalMySelf: true,
          IsApprovalComplete: true,
          WorkFlowNodeName: '',
          ApprovalMemberList: [],
          CcMemberList: [],
          WorkFlowNodeModels: [],
          WorkFlowConditions: []
        }
        return obj
      },
      newCcUserNode () {
        let obj = {
          WorkFlowID: 0,
          WorkFlowNodeID: (this.recursion++) * 4,
          NodeType: 1,
          ApprovalMemberRoleID: 0,
          ApprovalMemberType: 0,
          ApprovalMode: 0,
          Level: 1,
          ParentID: 0,
          IsApprovalMySelf: true,
          IsApprovalComplete: true,
          WorkFlowNodeName: '',
          ApprovalMemberList: [],
          CcMemberList: [],
          WorkFlowNodeModels: [],
          WorkFlowConditions: []
        }
        return obj
      },
      newAddressNode () {
        var obj = {
          WorkFlowID: 0,
          WorkFlowNodeID: 0,
          NodeType: 3,
          ApprovalMemberRoleID: 0,
          ApprovalMemberType: 0,
          ApprovalMode: 0,
          Level: 1,
          ParentID: 0,
          IsApprovalMySelf: false,
          IsApprovalComplete: false,
          WorkFlowNodeName: '路线节点',
          ApprovalMemberList: [],
          CcMemberList: [],
          WorkFlowNodeModels: [
            {
              WorkFlowID: 0,
              WorkFlowNodeID: (this.recursion++) * Math.random(),
              NodeType: 4,
              ApprovalMemberRoleID: 0,
              ApprovalMemberType: 0,
              ApprovalMode: 0,
              Level: 1,
              ParentID: 0,
              IsApprovalMySelf: false,
              IsApprovalComplete: false,
              WorkFlowNodeName: '',
              ApprovalMemberList: [],
              CcMemberList: [],
              WorkFlowConditions: [],
              WorkFlowNodeModels: []
            },
            {
              WorkFlowID: 0,
              WorkFlowNodeID: (this.recursion++) * Math.random(),
              NodeType: 4,
              ApprovalMemberRoleID: 0,
              ApprovalMemberType: 0,
              ApprovalMode: 0,
              Level: 2,
              ParentID: 0,
              IsApprovalMySelf: false,
              IsApprovalComplete: false,
              WorkFlowNodeName: '',
              ApprovalMemberList: [],
              CcMemberList: [],
              WorkFlowConditions: [],
              WorkFlowNodeModels: []
            }
          ]
        }
        return obj
      },
      closeAnt () {
        this.$store.commit('common/changeIsAntPopover', false)
      },
      // 弹出框//审批人/抄送人/条件节点
      addNode (nodes) {
        this.lastNode = false
        if (nodes.isThree === 3) {
          this.isAddThree = false
        } else {
          this.isAddThree = true
        }
        let nowXY = this.$store.state.common.targetXY.split(',')
        let wrapXY = this.$store.state.common.wrapXY.split(',')
        if (window.innerWidth - nodes.eLeft < 220) {
          this.$refs.antArrow.style.left = 226 + 'px'
          this.$refs.antArrow.style.boxShadow = '3px -3px 7px rgba(0,0,0,.07)'
          this.$refs.antPopover.style.left = (nodes.eLeft - 324 + (Number(nowXY[0]) + Number(wrapXY[0]))) + 'px'
        } else {
          this.$refs.antArrow.style.left = 6 + 'px'
          this.$refs.antArrow.style.boxShadow = '-3px 3px 7px rgba(0,0,0,.07)'
          this.$refs.antPopover.style.left = (nodes.eLeft - 50 + (Number(nowXY[0]) + Number(wrapXY[0]))) + 'px'
        }
        if (window.innerHeight - nodes.eTop < 200) {
          this.$refs.antArrow.style.top = 112 + 'px'
          this.$refs.antPopover.style.top = (nodes.eTop - 252 + (Number(nowXY[1]) + Number(wrapXY[1]))) + 'px'
        } else {
          this.$refs.antArrow.style.top = 12 + 'px'
          this.$refs.antPopover.style.top = (nodes.eTop - 150 + (Number(nowXY[1]) + Number(wrapXY[1]))) + 'px'
        };
        this.itemAll = nodes.all// 当前选中列的所有数据
        this.indexAll = nodes.allIndex// 当前选中列的下标
        this.newArrVal = nodes.val// 点击选中的数据
        this.newIndex = nodes.index// 点击的下标
        this.isOneNode = nodes.bool// 是否是第一个节点
      },
      // 添加审批人
      addAppUserNode () {
        this.$store.commit('common/changeIsAntPopover', false)
        if (this.isOneNode) {
          if (this.workflowList.WorkFlowNodeModels.length > 0) {
            this.workflowList.WorkFlowNodeModels.splice(0, 0, this.newApprovalNode())
          } else {
            this.workflowList.WorkFlowNodeModels.push(this.newApprovalNode())
          }
        } else {
          if (this.workflowList.WorkFlowNodeModels.length > 0) {
            if (this.newArrVal.NodeType !== undefined && this.newArrVal.NodeType === 4) {
              // 当前是条件分支
              this.newArrVal.WorkFlowNodeModels.splice(0, 0, this.newApprovalNode())
            } else {
              if (this.newArrVal.length > 0) {
                this.newArrVal.splice(this.newIndex + 1, 0, this.newApprovalNode())
              }
            }
          } else {
            this.workflowList.WorkFlowNodeModels.push(this.newApprovalNode())
          }
        }
      },
      // 添加抄送人
      addCcUserNode () {
        this.$store.commit('common/changeIsAntPopover', false)
        if (this.isOneNode) {
          if (this.workflowList.WorkFlowNodeModels.length > 0) {
            this.workflowList.WorkFlowNodeModels.splice(0, 0, this.newCcUserNode())
          } else {
            this.workflowList.WorkFlowNodeModels.push(this.newCcUserNode())
          }
        } else {
          if (this.workflowList.WorkFlowNodeModels.length > 0) {
            if (this.newArrVal.NodeType !== undefined && this.newArrVal.NodeType === 4) {
              // 当前是条件分支
              this.newArrVal.WorkFlowNodeModels.splice(0, 0, this.newCcUserNode())
            } else {
              if (this.newArrVal.length > 0) {
                this.newArrVal.splice(this.newIndex + 1, 0, this.newCcUserNode())
              }
            }
          } else {
            this.workflowList.WorkFlowNodeModels.push(this.newCcUserNode())
          }
        }
      },
      // 添加分支
      addCondition () {
        this.$store.commit('common/changeIsAntPopover', false)
        this.routeHierarchyNum = 0
        this.aa = 0
        if (!this.isOneNode) {
          if (this.workflowList.WorkFlowNodeModels.length > 0) {
            if (this.itemAll.NodeType === 3) {
              // this.routeHierarchyNum++;
              this.aa++
            };
            if (this.itemAll.WorkFlowNodeModels.length > 0) {
              for (let j = 0; j < this.itemAll.WorkFlowNodeModels.length; j++) {
                if (j === this.indexAll) {
                  this.routerHierarchy(this.itemAll.WorkFlowNodeModels[j])// 递归判断
                };
              };
            };
            this.routeHierarchyNum = this.aa
          } else {
            this.routeHierarchyNum++
          };
        } else {
          let routeNum = this.allRouterHierarchy(this.workflowList.WorkFlowNodeModels)
          this.routeHierarchyNum = routeNum === 0 ? 1 : routeNum
        }
      },
      // 递归判断是否可以添加分支
      routerHierarchy (all) {
        if (all.WorkFlowNodeModels.length > 0) {
          for (let i = 0, len = all.WorkFlowNodeModels.length; i < len; i++) {
            if (all.WorkFlowNodeModels[i].NodeType === 3) {
              this.aa++
            };
          };
        } else {
          // this.addConditionRecursion(this.newArrVal, this.newIndex);
        }
      },
      // 完整递归
      allRouterHierarchy (all) {
        let masRouteHierarchy = 0
        for (let i = 0; i < all.length; i++) {
          let routeHierarchy = 0
          if (all[i].WorkFlowNodeModels.length > 0) {
            if (all[i].NodeType === 3) {
              routeHierarchy = this.allRouterHierarchy(all[i].WorkFlowNodeModels) + 1
            } else {
              routeHierarchy = this.allRouterHierarchy(all[i].WorkFlowNodeModels)
            };
          }
          if (routeHierarchy < masRouteHierarchy) {
            routeHierarchy = masRouteHierarchy
          } else {
            masRouteHierarchy = routeHierarchy
          }
        }
        return masRouteHierarchy
      },
      // 判断分支
      addConditionRecursion (val, index) {
        let newNodeArrs = null; let thArr = null
        if (!this.isOneNode) {
          if (val.NodeType !== undefined && val.NodeType === 4) {
            if (val.WorkFlowNodeModels.length > 0) {
              newNodeArrs = val.WorkFlowNodeModels// 取出当前下标之后的所有值
              thArr = this.newAddressNode()
              thArr.WorkFlowNodeModels[0]['WorkFlowNodeModels'] = newNodeArrs
              val.WorkFlowNodeModels = []
              val.WorkFlowNodeModels.push(thArr)
            } else {
              val.WorkFlowNodeModels.push(this.newAddressNode())// 添加新路线节点
            }
          } else {
            if (val.length > 0) {
              newNodeArrs = val.slice(index + 1, val.length)// 取出当前下标之后的所有值
              val.splice(index + 1, val.length)
              val.push(this.newAddressNode())
              val[val.length - 1].WorkFlowNodeModels[0]['WorkFlowNodeModels'] = newNodeArrs
            } else {
              val.WorkFlowNodeModels.push(this.newAddressNode())// 添加新路线节点
            }
          }
        } else {
          newNodeArrs = val
          this.workflowList.WorkFlowNodeModels = []
          this.workflowList.WorkFlowNodeModels.push(this.newAddressNode())
          this.workflowList.WorkFlowNodeModels[0]['WorkFlowNodeModels'][0]['WorkFlowNodeModels'] = newNodeArrs
        }
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
