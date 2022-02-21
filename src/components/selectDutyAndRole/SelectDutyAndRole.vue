<template>
  <Modal
    class="select-teacher-org"
    :styles="{top:'20px',width:'90%'}"
    :title="modalTitle"
    :transfer="false"
    :value="isShow"
    :closable="false"
    :mask-closable="false"
  >
    <Row class="cascader-content">
      <i-col span="6" class="cascader-content-left">
        <Tree
          :data="newList"
          @on-select-change="treeSelect">
        </Tree>
      </i-col>
      <i-col  span="11" class="cascader-content-center">
        <Alert show-icon closable>温馨提示：点击左侧栏中的教师组织，从中间栏勾选教师，右侧栏显示已选中的教师。</Alert>
        <div class="center-serch-wrap">
          <checkbox
            v-model="casaderIsAll"
            @on-change="checkAllBtn"
            :disabled="modalSearchName!==''?true:transferData.length>0?transferData[0].memberlist[0].isDisabled:false">全选
          </checkbox>
          <Input search enter-button class="casader-search" placeholder="请输入用户名" v-model="modalSearchName"
                @on-search="searchNameFun"/>
        </div>
        <Alert v-if="transferData.length === 0" type="warning" show-icon style="margin:0px 0px 20px">
          未查询到相关信息
          <template slot="desc">
            当前分组下暂无信息，请切换分组后重新查找。
          </template>
        </Alert>
        <div v-else>
          <div v-for="item in transferData" :key="item.childNameStr">
            <div class="cascader-content-center-list">
              <div class="cascader-content-center-list-border">
                <checkbox v-model="item.CheckAll"
                          v-if="modalSearchName===''"
                          size="large"
                          :key="item.value"
                          :disabled="item.memberlist[0].isDisabled"
                          @on-change="handleCheckAll(item)"
                >{{item.label}}
                </checkbox>
                <span v-else>{{item.label}}</span>
              </div>
              <template v-for="child in item.memberlist">
                <checkbox size="large"
                  v-if="child.FullName.indexOf(modalSearchName)>=0 || modalSearchName=='' || child.UserName.indexOf(modalSearchName)>=0"
                  :key="child.UserID"
                  v-model="child.singleCheck"
                  @on-change="checkAllChange(child,item)"
                  :title="child.UserName"
                  :disabled="child.isDisabled"
                  class="check-name"
                >{{child.FullName}}
                </checkbox>
              </template>
            </div>
          </div>
        </div>
      </i-col>
      <i-col  span="7" class="cascader-content-right">
        <div>已选<b>{{checkAllList.length}}</b>人</div>
        <div class="cascader-content-right-list">
          <Tag v-for="item in checkAllList" :key="item.UserID" :name="item.UserID" closable
            @on-close="handleClose"
            :title="item.UserName">{{item.FullName}}
          </Tag>
        </div>
      </i-col>
    </Row>
    <Spin v-if="isLoadingShow" fix>
      <icon type="ios-loading" size=18 class="spin-icon-load"></icon>
      <div>加载中...</div>
    </Spin>
    <div slot="footer">
      <Button class="xy-modal-close" @click="modalCancel">取消</Button>
      <Button class="xy-modal-primary" shape="circle" @click="modalConfirm">确定</Button>
    </div>
  </Modal>
</template>
<script>
  export default {
    name: 'SelectDutyAndRole',
    props: {
      isShowSelectAll: {
        type: Boolean,
        default: true
      },
      modalTitle: {
        type: String,
        default: '根据角色选择'
      },
      isShow: {
        type: Boolean,
        required: true
      },
      // 已经选中的教师
      teachers: {
        type: Array,
        required: true
      },
      typeId: {
        default: ''
      },
      roleId: {
        default: ''
      }
    },
    data () {
      return {
        modalSearchName: '',
        casaderIsAll: false, // 全选
        isLoadingShow: true,
        newList: [], // 左侧数据
        transferData: [], // 中间数据
        checkAllList: [], // 右侧数据
        checkAllGroup: [], // 多选子集合
        nums: 0,
        selfRoleId: '',
        nodetype: ''
      }
    },
    created () {
      this.openAddModal()
    },
    watch: {
      isShow (val) {
        if (val) {
          this.openAddModal()
        }
      },
      roleId (val) {
        if (val) {
          this.selfRoleId = val
          this.nums = 2
        } else {
          this.nums = 0
        }
      },
      typeId (val) {
        if (val) {
          this.nodetype = val === 1 ? 'D' : 'A'
          this.nums = 2
        } else {
          this.nums = 0
        }
      }
    },
    methods: {
      modalCancel () {
        this.$emit('select-cancel')
      },
      modalConfirm () {
        this.$emit('select-confirm', this.checkAllList, this.nodetype, this.selfRoleId)
      },
      async openAddModal () {
        this.newList = [] // 左侧滞空
        this.transferData = []// 中间滞空
        // this.checkAllList = []// 右侧滞空
        this.checkAllList = [...this.teachers]
        let rs = await this.xy.get(this.xyApi + '/xy/comm/GetAllRoleTree', null)
        if (rs.success) {
          this.isLoadingShow = false
          let respon = rs.data
          if (respon.length > 0) {
            for (let i = 0; i < respon.length; i++) {
              this.newList.push({
                title: respon[i].label,
                value: respon[i].value,
                type: respon[i].nodetype,
                nodetype: respon[i].nodetype,
                children: this.getAllJson(respon[i].children)
              })
            }
          }
        }
      },
      // 递归
      getAllJson (Clist) {
        if (Clist.length > 0) {
          let newClist = []
          for (let i = 0; i < Clist.length; i++) {
            if (Clist[i].children.length > 0) {
              newClist.push({
                title: Clist[i].label,
                value: Clist[i].value,
                nodetype: Clist[i].nodetype,
                children: this.getAllJson(Clist[i].children)
              })
            } else {
              newClist.push({
                title: Clist[i].label,
                value: Clist[i].value,
                nodetype: Clist[i].nodetype,
                children: []
              })
            }
          }
          return newClist
        }
      },
      treeSelect: function (data) {
        if (this.checkAllList.length > 0) {
          this.nums++
        } else {
          this.nums = 1
        }
        if (this.nums === 1) {
          this.nodetype = data[0].nodetype // 职务还是自定义
          this.selfRoleId = data[0].value // 组ID
        }
        if (data.length) {
          this.selectPeople(data)
        }
      },
      async selectPeople (data) {
        let params = {
          sourceID: data[0].value,
          sourceType: data[0].nodetype
        }
        this.isLoadingShow = true
        let rs = await this.xy.get(this.xyApi + '/xy/comm/GetUser', params)
        let options = {
          value: data[0].value,
          label: data[0].title,
          nodetype: data[0].nodetype,
          CheckAll: false, // 每一组的全选按钮
          checkAllGroup: [], // 每一组人集合
          memberlist: []
        }
        this.transferData = []
        if (rs.success) {
          this.isLoadingShow = false
          options.memberlist = rs.data
          if (options.memberlist.length > 0) {
            for (let i = 0; i < options.memberlist.length; i++) {
              this.isDataList = false
              options.memberlist[i].singleCheck = false
              options.memberlist[i].isDisabled = false
              options.childNameStr += options.memberlist[i].FullName + ',' + options.memberlist[i].UserName + ','
            }
            this.transferData.push(options)
            this.isLoadingShow = false
            // 根据右侧已选人改变渲染的初始数据
            if (this.checkAllList.length > 0) {
              for (let d = 0; d < this.transferData.length; d++) {
                for (let z = 0; z < this.transferData[d].memberlist.length; z++) {
                  if (this.nodetype === data[0].nodetype && this.selfRoleId === data[0].value) {
                    this.transferData[d].memberlist[z].isDisabled = false
                  } else {
                    this.transferData[d].memberlist[z].isDisabled = true
                  }
                  let f = this.checkAllList.map(function (val) {
                    return val.UserID
                  }).indexOf(this.transferData[d].memberlist[z].UserID)
                  if (f !== -1) {
                    this.transferData[d].memberlist[z].singleCheck = true
                  }
                }
                // 所有的全选按钮
                let all1 = this.transferData[d].memberlist.map(function (val) {
                  return val.singleCheck
                }).indexOf(true)
                if (all1 === -1) { // 全没有ture
                  this.transferData[d].CheckAll = false
                  this.casaderIsAll = false
                } else {
                  // 最少有一个true
                  let all2 = this.transferData[d].memberlist.map(function (val) {
                    return val.singleCheck
                  }).indexOf(false)
                  if (all2 === -1) {
                    this.transferData[d].CheckAll = true
                    this.casaderIsAll = true
                  } else {
                    this.transferData[d].CheckAll = false
                    this.casaderIsAll = false
                  }
                }
              }
            }
          }
        }
      },
      checkAllBtn () { // 全选
        if (this.casaderIsAll) {
          for (let i = 0; i < this.transferData.length; i++) {
            this.transferData[i].CheckAll = true
            for (let j = 0; j < this.transferData[i].memberlist.length; j++) {
              this.transferData[i].memberlist[j].singleCheck = true
              // 把选中的添加至右侧
              this.checkAllList.push(this.transferData[i].memberlist[j])
            }
          }
          // 去重
          this.checkDuplicateRemoval(this.checkAllList)
        } else {
          for (let k = 0; k < this.transferData.length; k++) {
            this.transferData[k].CheckAll = false
            for (let s = 0; s < this.transferData[k].memberlist.length; s++) {
              this.transferData[k].memberlist[s].singleCheck = false
              for (let m = 0; m < this.checkAllList.length; m++) {
                if (this.checkAllList[m].UserID === this.transferData[k].memberlist[s].UserID) {
                  this.checkAllList.splice(m, 1)
                }
              }
            }
          }
        }
      },
      // checkList去重
      checkDuplicateRemoval (data) {
        let idList = data.map(function (value) {
          return value.UserID
        })
        idList = [...new Set(idList)]
        this.checkAllList = []
        data.forEach((value) => {
          if (idList.indexOf(value.UserID) > -1) {
            idList.splice(idList.indexOf(value.UserID), 1)
            this.checkAllList.push(value)
          }
        })
      },

      handleCheckAll (item) { // 各个组内的全选按钮
        if (item.CheckAll) {
          item.memberlist.map((val) => {
            return (val.singleCheck = true)
          })
          for (let p = 0; p < this.transferData.length; p++) {
            for (let m = 0; m < this.transferData[p].memberlist.length; m++) {
              for (let q = 0; q < item.memberlist.length; q++) {
                if (this.transferData[p].memberlist[m].UserID === item.memberlist[q].UserID) {
                  this.transferData[p].memberlist[m].singleCheck = true
                }
              }
              // 把选中的添加至右侧
              if (this.transferData[p].memberlist[m].singleCheck) {
                this.checkAllList.push(this.transferData[p].memberlist[m])
              }
            }
            // 所有的全选按钮
            let isCheckAll = this.transferData[p].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (isCheckAll === -1) {
              this.transferData[p].CheckAll = true
              this.casaderIsAll = true // 全选
            } else {
              this.transferData[p].CheckAll = false
              this.casaderIsAll = false // 全选
            }
          }

          // 去重
          this.checkDuplicateRemoval(this.checkAllList)
        } else {
          for (let p = 0; p < this.transferData.length; p++) {
            for (let q = 0; q < this.transferData[p].memberlist.length; q++) {
              let index2 = item.memberlist.map(function (val) {
                return val.UserID
              }).indexOf(this.transferData[p].memberlist[q].UserID)
              if (index2 !== -1) {
                this.transferData[p].memberlist[q].singleCheck = false
              }
            }
            // 删除右侧
            for (let k = 0; k < item.memberlist.length; k++) {
              let index3 = this.checkAllList.map(function (val) {
                return val.UserID
              }).indexOf(item.memberlist[k].UserID)
              if (index3 !== -1) {
                this.checkAllList.splice(index3, 1)
              }
            }

            // 所有的全选按钮
            let isCheckAll2 = this.transferData[p].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(true)
            if (isCheckAll2 === -1) { // 全没有ture
              this.transferData[p].CheckAll = false
              this.casaderIsAll = false // 全选
            } else {
              // 最少有一个true
              let isCheckAll3 = this.transferData[p].memberlist.map(function (val) {
                return val.singleCheck
              }).indexOf(false)
              if (isCheckAll3 === -1) {
                this.transferData[p].CheckAll = true
                this.casaderIsAll = true // 全选
              } else {
                this.transferData[p].CheckAll = false
                this.casaderIsAll = false // 全选
              }
            }
          }
        }
      },
      checkAllChange (child) { // 每个人的按钮
        if (child.singleCheck) {
          this.checkAllList.push(child)
          for (let i = 0; i < this.transferData.length; i++) {
            let mapIndex = this.transferData[i].memberlist.map(function (val) {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex !== -1) {
              this.transferData[i].memberlist[mapIndex].singleCheck = true
            }

            // 组内全选按钮选中
            let is1 = this.transferData[i].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (is1 === -1) {
              this.transferData[i].CheckAll = true
              this.casaderIsAll = true
            }
          }
        } else {
          let index1 = this.checkAllList.map(function (val) {
            return val.UserID
          }).indexOf(child.UserID)
          this.checkAllList.splice(index1, 1)
          for (let i = 0; i < this.transferData.length; i++) {
            let mapIndex1 = this.transferData[i].memberlist.map(function (val) {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex1 !== -1) {
              this.transferData[i].memberlist[mapIndex1].singleCheck = false
            }
            // 组内全选按钮是否选中
            let is2 = this.transferData[i].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(true)
            if (is2 === -1) { // 没有true
              this.transferData[i].CheckAll = false
              this.casaderIsAll = false
            } else {
              // 最少有一个true
              let is3 = this.transferData[i].memberlist.map(function (val) {
                return val.singleCheck
              }).indexOf(false)
              if (is3 === -1) {
                this.transferData[i].CheckAll = true
                this.casaderIsAll = true
              } else {
                this.transferData[i].CheckAll = false
                this.casaderIsAll = false
              }
            }
          }
        }
      },
      searchNameFun (vals) {
        this.modalSearchName = vals
      },
      handleClose (e, name) {
        for (let u = 0; u < this.checkAllList.length; u++) {
          if (this.checkAllList[u].UserID === name) {
            this.checkAllList.splice(u, 1)
          }
        }

        for (let i = 0; i < this.transferData.length; i++) {
          let mapIndex = this.transferData[i].memberlist.map(function (val) {
            return val.UserID
          }).indexOf(name)
          if (mapIndex !== -1) {
            this.transferData[i].memberlist[mapIndex].singleCheck = false
          }

          // 组内全选按钮是否选中
          let is4 = this.transferData[i].memberlist.map(function (val) {
            return val.singleCheck
          }).indexOf(true)
          if (is4 === -1) { // 没有true
            this.transferData[i].CheckAll = false
            this.casaderIsAll = false
          } else {
            // 最少有一个true
            let is5 = this.transferData[i].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (is5 === -1) {
              this.transferData[i].CheckAll = true
              this.casaderIsAll = true
            } else {
              this.transferData[i].CheckAll = false
              this.casaderIsAll = false
            }
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .select-teacher-org {
    position: relative;
    top: 20px;
    bottom: 20px;

    .center-serch-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .casader-search {
        width: 300px;
      }
    }

    /*.ivu-modal-footer {*/
    /*text-align: center;*/
    /*}*/

    /*.ivu-modal-header, .ivu-modal-footer {*/
    /*border: 0;*/
    /*}*/
  }
</style>
