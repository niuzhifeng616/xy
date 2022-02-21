<template>
  <div>
    <div style="border-top:1px solid #f5f5f5;margin-bottom:40px;">
      <h3 style="font-size:16px;color:#444;margin:20px 0;">审批流程</h3>
      <div v-if="isShowFlow && isData">
        <div v-for="(item,index) in workflow" :key="item.WorkFlowNodeID" class="work-flow">
          <!-- 1 抄送 -->
          <div v-if="item.NodeType===1" class="work-flow-flex">
            <div class="node-route">
              <div class="node-route-name">
                <div class="node-route-name-type">抄送人</div>
                <div class="node-route-name-number">{{item.CheckedCcMemberList.length>0?item.CheckedCcMemberList.length+'人':'请选择抄送人'}}</div>
              </div>
            </div>
            <div class="node-operation">
              <template v-for="(mItem,mIndex) in item.CheckedCcMemberList">
                <div v-if="mIndex<5" :title="mItem.FullName" :key="mItem.UserID+'+'+mIndex">
                  <div class="node-operation-users pr">
                    <span v-cloak>{{mItem.CcMemberName}}</span>
                    <Icon v-if="mItem.Del"
                      @click="ccDel(item.CheckedCcMemberList,mIndex)"
                      type="ios-close-circle"
                      size="22"
                      color="#fb7676"
                      class="pa cursor-p"
                      style="top:-11px;right:-6px;" />
                  </div>
                  <div class="bottom-text nowrap"><span class="nowrap">{{mItem.FullName}}</span></div>
                </div>
              </template>
              <div v-if="item.CheckedCcMemberList.length>5">
                <div class="node-operation-users cursor-p"
                  @click="moreCcMember(item.CheckedCcMemberList)">
                  <Icon type="ios-more" size="24" />
                </div>
                <div class="bottom-text">更多</div>
              </div>
              <div class="node-operation-btn cursor-p" @click="openAddModal(2,item,index)">
                <Icon type="md-add" color="#4196ff" size="22" />
              </div>
            </div>
          </div>
          <!-- 2 审批/会签/或签 -->
          <div v-if="item.NodeType===2" class="work-flow-flex">
            <div class="node-route">
              <div class="node-route-name">
                <div class="node-route-name-type" v-cloak>{{item.ApprovalMemberType===0?item.ApprovalMode===1?'会签':'或签':'审批人'}}</div>
                <div class="node-route-name-number" v-cloak>
                  <span v-if="item.ApprovalMemberType===0">{{item.ApprovalMemberList.length}}人审批</span>
                  <span v-if="item.ApprovalMemberType===1">
                    <template v-for="(childApp,chidAppIndex) in item.CheckedApprovalMemberList">
                      <span :key="chidAppIndex">
                        <span v-if="childApp.IsShow">{{childApp.FullName}}</span>
                      </span>
                    </template>
                  </span>
                </div>
              </div>
            </div>
            <div class="node-operation">
              <!-- 审批人 -->
              <template v-for="(mItem,mIndex) in item.CheckedApprovalMemberList">
                <div v-if="item.ApprovalMemberType!==0" :title="mItem.FullName" :key="mItem.UserID+'+'+mIndex">
                  <div class="node-operation-users pr" v-if="mItem.IsShow" >
                    <span v-cloak>{{mItem.AppName}}</span>
                      <Icon v-if="item.CheckedApprovalMemberList.length>1"
                        @click="appDel(item.CheckedApprovalMemberList,mIndex)"
                        type="ios-close-circle"
                        size="22"
                        color="#fb7676"
                        class="pa cursor-p"
                        style="top:-11px;right:-6px;" />
                  </div>
                  <div class="bottom-text nowrap" v-if="mItem.IsShow"><span class="nowrap">{{mItem.FullName}}</span></div>
                </div>
              </template>
              <div class="node-operation-btn cursor-p"
                @click="addApp(item.WorkFlowNodeID,item.CheckedApprovalMemberList)"
                v-if="item.ApprovalMemberType!==0&&item.CheckedApprovalMemberList.length>1">
                <Icon type="md-add" color="#4196ff" size="22" />
              </div>
              <!-- 会签/或签 -->
              <template v-for="(mItem,index) in item.CheckedApprovalMemberList">
                <div v-if="index<5&&item.ApprovalMemberType===0"
                    :key="mItem.UserID"
                    :title="mItem.FullName">
                  <div class="node-operation-users">
                    <span v-cloak>{{mItem.AppName}}</span>
                  </div>
                  <div class="bottom-text nowrap" :key="index"><span class="nowrap">{{mItem.FullName}}</span></div>
                </div>
              </template>
              <div v-if="item.CheckedApprovalMemberList.length>5&&item.ApprovalMemberType===0">
                <div class="node-operation-users cursor-p"
                  @click="moreMember(item.CheckedApprovalMemberList)">
                  <Icon type="ios-more" size="24" />
                </div>
                <div class="bottom-text">更多</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isShowFlow&& isData" style="color: red;padding-top: 12px;">审批人未设置审批权限，请联系管理员。</div>
      <div v-if="!isData" style="color: #ccc;padding-top: 12px;">您还没有审批流程的信息，请设置审批流程。</div>
    </div>
    <SelectTeacherOrg
      :isShow="isTeacher"
      :teachers="[...checkAllList]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectTeacherOrg>
    <!-- 查看更多 -->
    <Modal v-model="moreModal"
      :styles="{top:'70px',width:'650px'}"
      :transfer="false"
      :title="moreModalTitle"
      :loading="loading"
      :mask-closable="false"
      :closable="false">
        <div class="modal-flex" style="display:flex;">
          <div v-for="(item,index) in moreList" :key="index" class="modal-list" style="width:20%;">
            <div class="modal-users pr">
              <span>{{moreType===1?item.CcMemberName:item.AppName}}</span>
              <Icon v-if="item.Del&&moreType===1"
                @click="modalCcDel(index)"
                type="ios-close-circle"
                size="22"
                color="#fb7676"
                class="pa cursor-p"
                style="top:-11px;right:-6px;"/>
            </div>
            <div class="modal-name nowrap">{{item.FullName}}</div>
          </div>
        </div>
        <div slot="footer">
          <Button class="xy-modal-primary" shape="circle" @click="moreModal=false">关闭</Button>
        </div>
    </Modal>
    <!-- 添加审批人 -->
    <Modal v-model="appModal"
      :styles="{top:'70px',width:'480px'}"
      :transfer="false"
      title="添加审批人"
      :loading="loading"
      :mask-closable="false"
      :closable="false">
        <div class="app-modal">
          <div v-for="(item,index) in addAppList"
          :key="index"
            class="app-modal-box"
            :class="index==isAppIndex?'active':''"
            @click="changeAddModalBtn(addAppList,index)">
              <div class="app-modal-box-radio"><span></span></div>
              <div class="app-modal-box-left">{{item.AppName}}</div>
              <div class="app-modal-box-right nowrap">{{item.FullName}}</div>
          </div>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="appModal=false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="appModalbtn">确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
  import SelectTeacherOrg from '@/components/selectTeacherOrg/SelectTeacherOrg.vue'
  export default {
    name: 'WorkflowApply',
    props: {
      workflow: Array,
      isAddList: {
        type: Number,
        default: 0
      }
    },
    components: {
      SelectTeacherOrg
    },
    data () {
      return {
        isData: true,
        isShowFlow: false,
        loading: false,
        reg: /^[A-Za-z0-9]+$/,
        regNumber: /\d+/,
        moreModal: false,
        moreModalTitle: '',
        moreType: 1,
        moreList: [],
        appModal: false,
        addAppList: [],
        isAppIndex: -1,
        isTeacher: false,
        teachername: [],
        isAddMemberNum: [],
        checkAllList: [],
        workflowList: [],
        indx: -1,
        workFlowNodeID: -1
      }
    },
    watch: {
      workflow: {
        handler (newVal) {
          if (newVal.length > 0) {
            this.isShowFlow = true
            this.isData = true
            for (let i = 0, len = newVal.length; i < len; i++) {
              this.$set(newVal[i], 'CheckedCcMemberList', newVal[i].CcMemberList)// 抄送人另存
              if (this.isAddList === 0) {
                this.$set(newVal[i], 'CheckedApprovalMemberList', newVal[i].ApprovalMemberList)// 审批人另存
              }
              if (newVal[i].CheckedCcMemberList.length > 0) {
                newVal[i].CheckedCcMemberList.map(item => {
                  if (this.reg.test(item.FullName) || this.regNumber.test(item.FullName)) {
                    this.$set(item, 'CcMemberName', item.FullName.substring(0, 2))
                  } else {
                    if (item.FullName.length > 2) {
                      this.$set(item, 'CcMemberName', item.FullName.substring(item.FullName.length - 2))
                    } else {
                      this.$set(item, 'CcMemberName', item.FullName.substring(0, 2))
                    }
                  }
                })
              }
              if (newVal[i].CheckedApprovalMemberList.length > 0 && this.isAddList === 0) {
                newVal[i].CheckedApprovalMemberList.map(item => {
                  this.$set(item, 'IsShow', !(newVal[i].CheckedApprovalMemberList.length > 1))
                  if (this.reg.test(item.FullName) || this.regNumber.test(item.FullName)) {
                    this.$set(item, 'AppName', item.FullName.substring(0, 2))
                  } else {
                    if (item.FullName.length > 2) {
                      this.$set(item, 'AppName', item.FullName.substring(item.FullName.length - 2))
                    } else {
                      this.$set(item, 'AppName', item.FullName.substring(0, 2))
                    }
                  }
                })
              }
            }
            newVal.map(item => {
              if (item.NodeType === 2 && item.ApprovalMemberType !== 0 && item.ApprovalMemberList.length === 0) {
                this.isShowFlow = false
              }
            })
          } else {
            this.isShowFlow = false
            this.isData = false
          }
        },
        deep: true,
        immediate: true
      }
    },
    mounted () {

    },
    methods: {
      // 查看更多抄送人
      moreCcMember (val) {
        this.moreType = 1
        this.moreModalTitle = '抄送人'
        this.moreModal = true
        let newArr = val
        this.moreList = newArr
      },
      // 删除抄送人
      ccDel (val, index) {
        val.splice(index, 1)
      },
      modalCcDel (index) {
        this.moreList.splice(index, 1)
      },
      openAddModal (type, tItem, indx) {
        this.checkAllList = []
        this.isAddMemberNum = []
        this.isTeacher = true
        this.indx = indx
        if (tItem.CheckedCcMemberList.length > 0) {
          tItem.CheckedCcMemberList.forEach(item => {
            if (item.Del) {
              this.checkAllList.push(item)
            } else {
              this.isAddMemberNum.push(item)
            }
          })
        }
      },
      selectCancel () {
        this.isTeacher = false
      },
      selectConfirm (data) {
        let isDelIndex = []
        let isDelTrue = false
        this.isTeacher = false
        this.checkAllList = data
        if ((this.checkAllList.length + this.isAddMemberNum.length) > 10) {
          this.xy.msgError('最多可选 ' + (10 - this.isAddMemberNum.length) + ' 名抄送人。')
        } else {
          this.isAddList = 1
          for (let i = 0, len = this.workflow.length; i < len; i++) {
            if (this.indx === i) {
              for (let j = 0, jlen = this.workflow[i].CheckedCcMemberList.length; j < jlen; j++) {
                if (this.workflow[i].CheckedCcMemberList[j].Del) {
                  isDelIndex.push(j)
                  isDelTrue = true
                }
              }
              if (isDelTrue) {
                this.workflow[i].CheckedCcMemberList.splice(isDelIndex[0], this.workflow[i].CheckedCcMemberList.length)
              }
            }
          }
          for (let j = 0, jlen = this.workflow.length; j < jlen; j++) {
            if (this.indx === j) {
              this.checkAllList.map(item => {
                let index1 = this.workflow[j].CheckedCcMemberList.map(item1 => {
                  return item1.UserID
                }).indexOf(item.UserID)
                if (index1 === -1) {
                  this.workflow[j].CheckedCcMemberList.push({
                    UserID: item.UserID,
                    FullName: item.FullName,
                    CcMemberName: item.FullName,
                    Del: true// 可以删除
                  })
                }
              })
            }
          };
          this.workflow.map(item => {
            item.CheckedCcMemberList.map(cItem => {
              if (this.reg.test(cItem.FullName) || this.regNumber.test(cItem.FullName)) {
                cItem.CcMemberName = cItem.CcMemberName.substring(0, 2)
              } else {
                if (cItem.CcMemberName.length > 2) {
                  cItem.CcMemberName = cItem.CcMemberName.substring(cItem.CcMemberName.length - 2)
                } else {
                  cItem.CcMemberName = cItem.CcMemberName.substring(0, 2)
                }
              }
            })
          })
        }
      },
      // 添加审批人弹窗
      addApp (id, val) {
        this.workFlowNodeID = id
        this.appModal = true// 弹出框
        this.addAppList = val
        let isFalse = this.addAppList.filter(item => {
          return item.IsShow === true
        })
        if (isFalse.length < 1) {
          this.isAppIndex = -1
        }
      },
      // 选择审批人
      changeAddModalBtn (val, index) {
        this.isAppIndex = index
        for (let i = 0, len = val.length; i < len; i++) {
          if (index === i) {
            val[i].IsShow = true
          } else {
            val[i].IsShow = false
          }
        }
      },
      appModalbtn () {
        this.isAddList = 1
        for (let w = 0, wl = this.workflow.length; w < wl; w++) {
          if (this.workflow[w].NodeType === 2 && this.workflow[w].WorkFlowNodeID === this.workFlowNodeID) {
            this.$set(this.workflow[w].CheckedApprovalMemberList[this.isAppIndex], 'IsShow', true)
          }
        }
        this.appModal = false
      },
      // 查看更多审批人
      moreMember (val) {
        this.moreType = 2
        this.moreModalTitle = '审批人'
        this.moreModal = true
        this.moreList = val
      },
      // 删除审批人
      appDel (val, index) {
        val[index].IsShow = false
      }
    }
  }
</script>
<style lang="less" scoped>
.work-flow .work-flow-flex {
    display: flex;
    justify-content: space-between;
    height: 90px;
    position: relative;
}

    .work-flow .work-flow-flex::before {
        content: '';
        width: 97%;
        height: 1px;
        border-bottom: 1px dashed #e1e1e1;
        position: absolute;
        bottom: 20px;
        left: 15px;
    }

.work-flow:last-child .work-flow-flex::before {
    border-bottom: 0px;
}

.work-flow .work-flow-flex .node-route {
    position: relative;
    width: 100px;
    padding-left: 15px;
    border-left: 1px solid #D5D5D5;
}

    .work-flow .work-flow-flex .node-route::before {
        content: '';
        width: 9px;
        height: 9px;
        background: rgba(213,213,213,1);
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: -5px;
    }

.work-flow:last-child .work-flow-flex .node-route {
    border-left: 0px;
}

.work-flow .work-flow-flex .node-route .node-route-name {
    position: absolute;
    top: -5px;
}

    .work-flow .work-flow-flex .node-route .node-route-name .node-route-name-type {
        color: #333;
        font-weight: bold;
    }

    .work-flow .work-flow-flex .node-route .node-route-name .node-route-name-number {
        font-size: 13px;
        color: #666;
        margin-top: 5px;
    }

.work-flow .work-flow-flex .node-operation {
    display: flex;
}

    .work-flow .work-flow-flex .node-operation .node-operation-users {
        width: 40px;
        height: 40px;
        background: rgba(65,150,255,1);
        border-radius: 50%;
        margin-left: 20px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .work-flow .work-flow-flex .node-operation .node-operation-btn {
        width: 40px;
        height: 40px;
        border: 1px dashed #4196ff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 20px;
    }

.bottom-text {
    width: 40px;
    display: flex;
    justify-content: center;
    margin-left: 20px;
}

.modal-flex {
    display: flex;
    flex-wrap: wrap;
}

    .modal-flex .modal-list {
        width: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        margin: 10px 0;
    }

        .modal-flex .modal-list .modal-users {
            width: 40px;
            height: 40px;
            background: rgba(65,150,255,1);
            border-radius: 50%;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-flex .modal-list .modal-name {
            width: 80%;
            text-align: center;
            margin-top: 5px;
        }

.app-modal {
    display: flex;
    flex-wrap: wrap;
}

    .app-modal .app-modal-box {
        display: flex;
        align-items: center;
        width: 44%;
        margin-right: 20px;
        margin-bottom: 20px;
        cursor: pointer;
    }

        .app-modal .app-modal-box .app-modal-box-radio {
            display:flex;
            justify-content:center;
            align-items:center;
            width: 16px;
            height: 16px;
            margin-right:10px;
            border-radius: 50%;
            border: 1px solid #D9D9D9;
        }

            .app-modal .app-modal-box .app-modal-box-radio span {
                width: 8px;
                height: 8px;
                background: #fff;
                border-radius: 50%;
            }

        .app-modal .app-modal-box.active .app-modal-box-radio {
            border: 1px solid #4196ff;
        }

            .app-modal .app-modal-box.active .app-modal-box-radio span {
                background: #4196ff;
            }

        .app-modal .app-modal-box .app-modal-box-left {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            background: rgba(65,150,255,1);
            border-radius: 50%;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .app-modal .app-modal-box .app-modal-box-right {
            width: 120px;
        }
.add-student-list {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    position: relative;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    min-height:44px;
}
.add-student-btn {
    width: 21px;
    height: 21px;
    background: rgba(65, 150, 255,.1);
    border: 1px solid #4196ff;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position:absolute;
    bottom:4px;
    right:5px;
}
.form-gzsm {
    background: #f9f9f9;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    padding-left: 10px;
}

</style>
