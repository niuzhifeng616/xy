<template>
  <div class="xy-content-module">
      <div class="xy-content-body clearfix" style="min-height:910px !important;">
          <div class="permissiong-left-nav">
              <div class="permissiong-left-nav-title">设置<b v-cloak> {{rows.fullOrgName}} </b>的权限</div>
              <ol class="permissiong-left-list">
                  <li
                    v-for="(item,index) in navList"
                    class="clearfix"
                    :key="index"
                    @click="leftMenuBtn(item,index)"
                    :class="index===leftIndex?'active':''"
                    >
                      <div class="fl permissiong-left-nav-img">
                          <img :src="require(`@/assets/base/icons-module/${item.Icon}`)" />
                      </div>
                      <span class="permissiong-left-nav-name">{{item.Name}}</span>
                      <Icon type="md-arrow-dropright" class="permissiong-left-nav-icon" />
                  </li>
              </ol>
          </div>
          <div class="permissiong-right-nav pr">
              <ul class="clearfix permission-title-nav" v-cloak>
                  <li :class="isIndex===-1?'active':''" @click="activeHandleClick('',-1)">全部</li>
                  <li v-for="(item, index) in rightNav" :class="index===isIndex?'active':''" :key="index" @click="activeHandleClick(item,index)">{{item.Name}}</li>
              </ul>
              <div class="permission-content">
                <div v-for="(item, index) in rightNav" :key="index">
                  <div class="permission-content-box" v-if="childIndex === -1 || childIndex === index">
                      <div class="permission-content-box-title">
                          <span class="cursor-p" @click="operationOneBtn(item)">
                              <span class="permission-title-checkbox" :class="item.Primarykey>0?'active':''"><i v-if="item.Primarykey>0"></i></span>
                              <span>{{item.Name}}</span>
                          </span>
                      </div>
                      <div class="permission-content-box-content">
                          <ol>
                              <li v-for="(item2, idx) in item.subMenu" :key="idx" class="clearfix permission-child-three">
                                  <div class="permission-type-title">
                                      <span class="cursor-p" @click="operationTitleBtn(item2)">
                                          <span class="permission-type-title-checkbox" :class="item2.Primarykey>0?'active':''"><i v-if="item2.Primarykey>0"></i></span>
                                          <span>{{item2.Name}}</span>
                                      </span>
                                  </div>
                                  <div class="permission-child-four">
                                      <div v-if="item2.OperationPermissionList.length>0" class="permission-child-four-content clearfix">
                                          <div class="permission-child-four-type">操作类</div>
                                          <div style="flex:1" class="clearfix">
                                              <div
                                                v-for="(oItem, index) in item2.OperationPermissionList"
                                                :key="oItem.OperationPermissionName"
                                                class="permission-child-four-name-operation pr fl cursor-p"
                                                :title="oItem.OperationPermissionName"
                                                @click.stop="operationBtn(oItem)"
                                                >
                                                  <span class="permission-checkbox" :class="oItem.OperateDetail>0?'active':''"><i v-if="oItem.OperateDetail>0"></i></span>
                                                  <span class="nowrap">{{oItem.OperationPermissionName}}</span>
                                                  <div v-if="oItem.OperChilds.length>0" class="triangle-down">
                                                      <span @click.stop="switchBtn(oItem, index)"><Icon type="md-arrow-dropdown" color="rgba(52, 121, 205,0.6)" size="20" /></span>
                                                      <div class="operationTwo-posi" v-if="oID === oItem.ApplicationSubMenuID && oNum === index && isDown">
                                                          <div v-for="tItem in oItem.OperChilds" @click.stop="operationTwoBtn(tItem)" :key="tItem.OperateDetail">
                                                              <span class="permission-checkbox" :class="tItem.OperateDetail>0?'active':''"><i v-if="tItem.OperateDetail>0"></i></span>
                                                              {{tItem.OperationPermissionName}}
                                                          </div>
                                                      </div>
                                                  </div>

                                              </div>
                                          </div>
                                      </div>
                                      <div v-if="item2.DataPermissionList.length>0" class="permission-child-four-content clearfix">
                                          <div class="permission-child-four-type">数据范围类</div>
                                          <div style="flex:1" class="clearfix">
                                              <div
                                                v-for="dItem in item2.OperationPermissionList"
                                                class="permission-child-four-name-data fl nowrap cursor-p"
                                                :key="dItem.OperateDetail"
                                                :title="dItem.DataPermissionName"
                                                >
                                                  <span class="permission-checkbox"><i v-if="dItem.OperateDetail===1"></i></span>
                                                  <span>{{dItem.DataPermissionName}}</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </li>
                          </ol>
                      </div>
                  </div>
                </div>
              </div>
              <div class="submit-box">
                  <Button  class="xy-primary" ghost @click="cancelHandle">取消</Button>
                  <Button  class="xy-primary" @click="addPermissionHandle">保存</Button>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'PermissionSetup',
    data () {
      return {
        leftIndex: 0,
        isIndex: -1,
        childIndex: -1,
        rows: '',
        modal_loading: false,
        loading: true,
        ModulesData: [],
        navList: [],
        rightNav: [],
        options: {
          PermissionSourceID: '',
          MenuPermission: []
        },
        isDown: false,
        oID: -1,
        oNum: -1
      }
    },
    created () {
      // 获取个人权限
      this.rows = JSON.parse(this.$route.query.row)
      this.options.PermissionSourceID = this.rows.id
      // 获取一级模块信息
      this.getModules()
    },
    mounted () {
      // this.$nextTick(function () {
      //   xy.breadcrumb.create({ name: '设置权限' })
      // })
    },
    methods: {
      leftMenuBtn (row, index) {
        for (var i = 0; i < this.ModulesData.length; i++) {
          if (row.ID === this.ModulesData[i].ID) {
            this.rightNav = this.ModulesData[i].applications
          };
        };
        this.leftIndex = index
        this.activeHandleClick('', -1)
      },
      // 获取所有模块信息
      async getModules () {
        this.xy.loading()
        let params = {
          sourceID: this.rows.id,
          sourceType: this.rows.type
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AdministrationRole/GetRolePermission`, params, true)
        this.xy.unloading()
        if (res.success) {
          var tempModulesData = res.data
          this.navList = []
          for (let item of tempModulesData) {
            this.navList.push({
              ID: item.ID,
              Name: item.Name,
              active: false,
              Icon: item.Icon + '.png'
            })
          }
          this.ModulesData = tempModulesData
          this.options.MenuPermission = []
          for (var i = 0; i < this.ModulesData.length; i++) {
            for (var j = 0; j < this.ModulesData[i].applications.length; j++) {
              if (this.ModulesData[i].applications[j].Primarykey > 0) {
                if (this.ModulesData[i].applications[j].subMenu.length > 0) {
                  for (var k = 0; k < this.ModulesData[i].applications[j].subMenu.length; k++) {
                    if (this.ModulesData[i].applications[j].subMenu[k].ApplicationID === this.ModulesData[i].applications[j].ID) {
                      if (this.ModulesData[i].applications[j].subMenu[k].Primarykey > 0) {
                        if (this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList.length > 0) {
                          this.options.MenuPermission.push({
                            ParentMenuID: this.ModulesData[i].applications[j].subMenu[k].ApplicationID,
                            MenuID: this.ModulesData[i].applications[j].subMenu[k].ID,
                            OperationPermissionList: [],
                            DataPermissionList: []
                          })
                          for (var n = 0; n < this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList.length; n++) {
                            if (this.options.MenuPermission[this.options.MenuPermission.length - 1].ParentMenuID === this.ModulesData[i].applications[j].subMenu[k].ApplicationID &&
                              this.options.MenuPermission[this.options.MenuPermission.length - 1].MenuID === this.ModulesData[i].applications[j].subMenu[k].ID) {
                              if (this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[n].OperateDetail > 0) {
                                this.options.MenuPermission[this.options.MenuPermission.length - 1].OperationPermissionList.push(this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[n])
                              };
                            };
                          };
                        } else {
                          this.options.MenuPermission.push({
                            ParentMenuID: this.ModulesData[i].applications[j].subMenu[k].ApplicationID,
                            MenuID: this.ModulesData[i].applications[j].subMenu[k].ID,
                            OperationPermissionList: [],
                            DataPermissionList: []
                          })
                        }
                      }
                    }
                  }
                } else {
                  if (this.ModulesData[i].applications[j].MID === this.ModulesData[i].ID) {
                    this.options.MenuPermission.push({
                      ParentMenuID: this.ModulesData[i].applications[j].ID,
                      MenuID: 0,
                      OperationPermissionList: [],
                      DataPermissionList: []
                    })
                  }
                }
              }
            }
          }
          if (this.navList[0].ID === this.ModulesData[0].ID) {
            this.rightNav = this.ModulesData[0].applications
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // nav
      activeHandleClick (item, index) {
        this.isIndex = index
        this.childIndex = index
      },
      operationOneBtn (child1) {
        if (child1.Primarykey === 0) {
          child1.Primarykey = 1
        } else {
          child1.Primarykey = 0
        }
        for (var i = 0; i < child1.subMenu.length; i++) {
          if (child1.Primarykey > 0) {
            child1.subMenu[i].Primarykey = 1
          } else {
            child1.subMenu[i].Primarykey = 0
          }
          // 操作类权限
          if (child1.subMenu[i].OperationPermissionList.length > 0) {
            for (var j = 0; j < child1.subMenu[i].OperationPermissionList.length; j++) {
              if (child1.subMenu[i].Primarykey > 0) {
                child1.subMenu[i].OperationPermissionList[j].OperateDetail = 1
              } else {
                child1.subMenu[i].OperationPermissionList[j].OperateDetail = 0
              };
              // 二级操作类权限全选
              if (child1.subMenu[i].OperationPermissionList[j].OperChilds.length > 0) {
                for (var k = 0; k < child1.subMenu[i].OperationPermissionList[j].OperChilds.length; k++) {
                  if (child1.subMenu[i].OperationPermissionList[j].OperateDetail > 0) {
                    child1.subMenu[i].OperationPermissionList[j].OperChilds[k].OperateDetail = 1
                  } else {
                    child1.subMenu[i].OperationPermissionList[j].OperChilds[k].OperateDetail = 0
                  }
                }
              }
            }
          }
        }
      },
      operationTitleBtn (child2) {
        if (child2.Primarykey === 0) {
          child2.Primarykey = 1
        } else {
          child2.Primarykey = 0
        }
        // 调用父级权限方法
        this.parentIsCheck(child2.ApplicationID, null, null)
        // 操作类权限
        if (child2.OperationPermissionList.length > 0) {
          for (var i = 0; i < child2.OperationPermissionList.length; i++) {
            if (child2.Primarykey > 0) {
              child2.OperationPermissionList[i].OperateDetail = 1
            } else {
              child2.OperationPermissionList[i].OperateDetail = 0
            };
            // 二级操作类权限全选
            if (child2.OperationPermissionList[i].OperChilds.length > 0) {
              for (var j = 0; j < child2.OperationPermissionList[i].OperChilds.length; j++) {
                if (child2.OperationPermissionList[i].OperateDetail > 0) {
                  child2.OperationPermissionList[i].OperChilds[j].OperateDetail = 1
                } else {
                  child2.OperationPermissionList[i].OperChilds[j].OperateDetail = 0
                }
              }
            }
          }
        }
      },
      operationBtn (child3) {
        if (child3.OperateDetail === 0) {
          child3.OperateDetail = 1
        } else {
          child3.OperateDetail = 0
        };
        // 二级操作类权限全选
        if (child3.OperChilds.length > 0) {
          for (var j = 0; j < child3.OperChilds.length; j++) {
            if (child3.OperateDetail > 0) {
              child3.OperChilds[j].OperateDetail = 1
            } else {
              child3.OperChilds[j].OperateDetail = 0
            }
          }
        }
        // 调用父级权限方法
        this.parentIsCheck(null, child3.ApplicationSubMenuID, null)
      },
      // 展开收起操作类二级菜单
      switchBtn (oItem, index) {
        this.isDown = !this.isDown
        this.oID = oItem.ApplicationSubMenuID
        this.oNum = index
      },
      // 选择操作类二级菜单
      operationTwoBtn (tItem) {
        if (tItem.OperateDetail === 0) {
          tItem.OperateDetail = 1
        } else {
          tItem.OperateDetail = 0
        }
        this.parentIsCheck(null, null, tItem.ParentID)
      },
      // 父级权限按钮
      parentIsCheck (pId, oId, oChildId) {
        for (var i = 0; i < this.ModulesData.length; i++) {
          for (var j = 0; j < this.ModulesData[i].applications.length; j++) {
            if (this.ModulesData[i].applications[j].subMenu.length > 0) {
              for (var k = 0; k < this.ModulesData[i].applications[j].subMenu.length; k++) {
                // sumenu级权限判定
                if (pId != null) {
                  if (this.ModulesData[i].applications[j].subMenu[k].ApplicationID === pId) {
                    var aa = this.ModulesData[i].applications[j].subMenu.filter(function (item) {
                      return item.Primarykey > 0// 过滤二级菜单
                    })
                    if (aa.length > 0) {
                      this.ModulesData[i].applications[j].Primarykey = 1
                    } else {
                      this.ModulesData[i].applications[j].Primarykey = 0
                    }
                  }
                }
                // 操作级权限判断
                if (oId != null) {
                  if (this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList.length > 0) {
                    for (var n = 0; n < this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList.length; n++) {
                      if (oId === this.ModulesData[i].applications[j].subMenu[k].ID) {
                        var bb = this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList.filter(function (item) {
                          return item.OperateDetail === 1// 过滤一级操作
                        })
                        if (bb.length > 0) {
                          this.ModulesData[i].applications[j].Primarykey = 1
                          this.ModulesData[i].applications[j].subMenu[k].Primarykey = 1
                        } else {
                          this.ModulesData[i].applications[j].subMenu[k].Primarykey = 0
                          var cc = this.ModulesData[i].applications[j].subMenu.filter(function (item) {
                            return item.Primarykey > 0 // 过滤二级菜单
                          })
                          if (cc.length > 0) {
                            this.ModulesData[i].applications[j].Primarykey = 1
                          } else {
                            this.ModulesData[i].applications[j].Primarykey = 0
                          }
                        }
                      }
                    }
                  }
                }
                // 操作权限子级
                if (oChildId != null) {
                  for (var m = 0; m < this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList.length; m++) {
                    if (oChildId === this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[m].OperationPermissionID) {
                      var dd = this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[m].OperChilds.filter(function (item) {
                        return item.OperateDetail === 1// 过滤二级操作权限
                      })
                      if (dd.length > 0) {
                        this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[m].OperateDetail = 1
                        this.ModulesData[i].applications[j].Primarykey = 1
                        this.ModulesData[i].applications[j].subMenu[k].Primarykey = 1
                      } else {
                        this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[m].OperateDetail = 0
                        let bb = this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList.filter(function (item) {
                          return item.OperateDetail === 1// 过滤一级操作权限
                        })
                        if (bb.length > 0) {
                          this.ModulesData[i].applications[j].Primarykey = 1
                          this.ModulesData[i].applications[j].subMenu[k].Primarykey = 1
                        } else {
                          this.ModulesData[i].applications[j].subMenu[k].Primarykey = 0
                          let cc = this.ModulesData[i].applications[j].subMenu.filter(function (item) {
                            return item.Primarykey === 1 // 过滤二级菜单
                          })
                          if (cc.length > 0) {
                            this.ModulesData[i].applications[j].Primarykey = 1
                          } else {
                            this.ModulesData[i].applications[j].Primarykey = 0
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      addPermissionHandle () {
        let that = this
        this.options.MenuPermission = []
        this.MenuPermissionChild = []// 临时存储操作类 二级权限数据
        for (var i = 0; i < this.ModulesData.length; i++) {
          for (var j = 0; j < this.ModulesData[i].applications.length; j++) {
            if (this.ModulesData[i].applications[j].Primarykey > 0) {
              if (this.ModulesData[i].applications[j].subMenu.length > 0) {
                for (var k = 0; k < this.ModulesData[i].applications[j].subMenu.length; k++) {
                  if (this.ModulesData[i].applications[j].subMenu[k].ApplicationID === this.ModulesData[i].applications[j].ID) {
                    if (this.ModulesData[i].applications[j].subMenu[k].Primarykey > 0) {
                      if (this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList.length > 0) {
                        this.options.MenuPermission.push({
                          ParentMenuID: this.ModulesData[i].applications[j].subMenu[k].ApplicationID,
                          MenuID: this.ModulesData[i].applications[j].subMenu[k].ID,
                          OperationPermissionList: [],
                          DataPermissionList: []
                        })
                        for (var n = 0; n < this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList.length; n++) {
                          if (this.options.MenuPermission[this.options.MenuPermission.length - 1].ParentMenuID === this.ModulesData[i].applications[j].subMenu[k].ApplicationID &&
                            this.options.MenuPermission[this.options.MenuPermission.length - 1].MenuID === this.ModulesData[i].applications[j].subMenu[k].ID) {
                            if (this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[n].OperateDetail > 0) {
                              this.options.MenuPermission[this.options.MenuPermission.length - 1].OperationPermissionList.push(this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[n])
                            }
                          }

                          this.MenuPermissionChild.push({
                            ParentMenuID: this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[n].ApplicationID,
                            MenuID: this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[n].ID,
                            OperationPermissionList: [],
                            DataPermissionList: []
                          })
                          // 操作类二级权限
                          for (var m = 0; m < this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[n].OperChilds.length; m++) {
                            if (this.MenuPermissionChild[this.MenuPermissionChild.length - 1].ParentMenuID === this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[n].ApplicationID &&
                              this.MenuPermissionChild[this.MenuPermissionChild.length - 1].MenuID === this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[n].ID) {
                              if (this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[n].OperChilds[m].OperateDetail > 0) {
                                this.options.MenuPermission[this.options.MenuPermission.length - 1].OperationPermissionList.push(this.ModulesData[i].applications[j].subMenu[k].OperationPermissionList[n].OperChilds[m])
                              }
                            }
                          }
                        }
                      } else {
                        this.options.MenuPermission.push({
                          ParentMenuID: this.ModulesData[i].applications[j].subMenu[k].ApplicationID,
                          MenuID: this.ModulesData[i].applications[j].subMenu[k].ID,
                          OperationPermissionList: [],
                          DataPermissionList: []
                        })
                      }
                    }
                  }
                }
              } else {
                if (this.ModulesData[i].applications[j].MID === this.ModulesData[i].ID) {
                  this.options.MenuPermission.push({
                    ParentMenuID: this.ModulesData[i].applications[j].ID,
                    MenuID: 0,
                    OperationPermissionList: [],
                    DataPermissionList: []
                  })
                }
              }
            }
          }
        }
        if (that.options.MenuPermission.length < 1) {
          that.$Modal.confirm({
            title: '置空权限',
            content: '<p>您确认要把当前角色的权限置为空吗？</p>',
            async onOk () {
              that.xy.loading()
              let params = {
                PermissionSourceID: that.rows.id,
                PermissionSourceType: that.rows.type,
                MenuPermission: that.options.MenuPermission
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/AdministrationRole/SaveRolePermission`, params, true)
              that.xy.unloading()
              if (res.success) {
                that.xy.msgSuc('权限置空成功。')
              } else {
                that.xy.msgError(res.msg)
              }
            }
          })
        } else {
          that.$Modal.confirm({
            title: '设置权限',
            content: '<p>您确认要为当前角色设置所选权限吗？</p>',
            async onOk () {
              that.xy.loading()
              let params = {
                PermissionSourceID: that.rows.id,
                PermissionSourceType: that.rows.type,
                MenuPermission: that.options.MenuPermission
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/AdministrationRole/SaveRolePermission`, params, true)
              that.xy.unloading()
              if (res.success) {
                that.xy.msgSuc('权限设置成功。')
              } else {
                that.xy.msgError(res.msg)
              }
            }
          })
        };
      },
      cancelHandle () {
        this.$router.back()
      }
    }
  }
</script>
<style lang="less" scoped>
.permission-nav {
    color: #606266;
    font-weight: bold;
    margin-right: 28px;
}

.permission-title {
    padding-bottom: 16px;
}

.permission-border {
    height: 3px;
    width: 30px;
    background: #ccc;
    margin: 0 auto;
}

.permission-title-nav {
    line-height: 36px;
    margin-bottom: 10px;
}

.permission-title-nav li {
    float: left;
    font-weight: bold;
    color: #909399;
    cursor: pointer;
    margin: 0px 20px;
    border-bottom: 3px solid rgba(255,255,255,0);
}

.permission-title-nav li.active {
    border-bottom: 3px solid #4196ff;
    color: #4196ff;
}
.permission-content{
  margin-bottom: 40px;
}
.permission-content-box {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 4px 14px 0px rgba(189,189,189,0.5);
    margin-bottom: 16px;
}

.permission-content-box-title {
    font-size: 16px;
    padding: 10px 20px;
    color: #3479CD;
    background: rgba(65, 150, 255,0.1);
    border-radius: 4px 4px 0 0;
    font-weight: 700;
}

.permission-content-box-content ol > li {
    padding: 15px 0px 10px 0px;
    border-bottom: 1px dashed #DEE0E3;
}

.permission-content-box-content ol li:last-child {
    border: none;
}

.permission-type-title {
    font-size: 14px;
    font-weight: bold;
    color: #4196FF;
    padding: 0px 20px;
    width: 150px;
}

.permission-type-chid-title {
    font-size: 14px;
    color: #444;
}

.permission-split-line {
    padding: 12px 1px;
    background: #DEE0E3;
}

.permission-type-chid-title {
    padding: 0px 20px;
}

.permissiong-left-nav {
    width: 260px;
    background: #4196FF;
    float: left;
    position: absolute;
    top: 0;
    left: 0;
    bottom: -20px;
    overflow: hidden;
    z-index: 1;
}

.permissiong-right-nav {
    width: calc(100% - 260px);
    float: left;
    margin-left: 260px;
}

.permissiong-left-nav-title {
    font-size: 18px;
    text-align: center;
    padding: 20px 0px;
    color: #fff;
    border-bottom: 1px dashed #D9EAFF;
}

.permissiong-left-nav-img {
    width: 30px;
    height: 30px;
    line-height: 27px;
    text-align: center;
    border-radius: 50%;
    background: rgba(255,255,255,.1);
    margin-top: 5px;
}

    .permissiong-left-nav-img img {
        display: inline-block;
        width: 18px;
    }

.permissiong-left-nav-name {
    color: #D9EAFF;
    font-size: 16px;
    margin-left: 10px;
    line-height: 40px;
}

.permissiong-left-list {
    height: calc(100% - 68px);
    overflow-y: auto;
}

    .permissiong-left-list li {
        transition: all 0.3s;
        margin-top: 10px;
        padding: 5px 10px 5px 20px;
        cursor: pointer;
        cursor: pointer;
    }

        .permissiong-left-list li:hover {
            transition: all 0.3s;
            background: rgba(52, 121, 205,0.5);
        }

        .permissiong-left-list li.active {
            transition: all 0.3s;
            background: #3479CD;
        }

.permissiong-left-nav-icon {
    float: right;
    color: #D9EAFF;
    line-height: 40px;
    font-size: 20px;
}

.permissiong-left-list li:hover .permissiong-left-nav-name,
.permissiong-left-list li:hover .permissiong-left-nav-icon,
.permissiong-left-list li.active .permissiong-left-nav-name,
.permissiong-left-list li.active .permissiong-left-nav-icon {
    color: #fff !important;
}

.submit-box {
    position: fixed;
    bottom: 0px;
    left: 50px;
    right:0px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    margin-left: 280px;
    width: calc(100% - 300px);
    background: rgba(255,255,255,0.9);
    box-shadow: 0px -6px 12px 0px rgba(188,188,188,0.2);
}

.permission-child-three {
    display: flex;
}

.permission-child-four {
    flex: 1;
}

.permission-child-four-type {
    color: #7f7f7f;
    font-weight: 700;
    width: 100px;
}

.permission-child-four-name-operation {
    color: #666;
    width: 130px;
    padding-right: 10px;
}

.permission-child-four-name-data {
    color: #666;
    width: 130px;
    padding-right: 10px;
    margin-bottom: 10px;
}

.permission-child-four-content {
    margin-bottom: 10px;
    display: flex;
}

.permission-title-checkbox {
    display: inline-block;
    vertical-align: sub;
    width: 18px;
    height: 18px;
    margin-right: 5px;
    border: 1px solid #ccc;
    transition: all 0.3s;
}

    .permission-title-checkbox.active {
        border: 1px solid #4196ff;
        transition: all 0.3s;
    }

        .permission-title-checkbox.active > i {
            display: block;
            width: 12px;
            height: 12px;
            background: #4196ff;
            margin: 2px 2px;
            transition: all 0.3s;
        }

.permission-checkbox,
.permission-type-title-checkbox {
    display: inline-block;
    vertical-align: sub;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    border: 1px solid #ccc;
    transition: all 0.3s;
}

    .permission-checkbox.active,
    .permission-type-title-checkbox.active {
        border: 1px solid #4196ff;
        transition: all 0.3s;
    }

        .permission-checkbox.active > i,
        .permission-type-title-checkbox.active > i {
            display: block;
            width: 11px;
            height: 11px;
            background: #4196ff;
            margin: 1px 1px;
            transition: all 0.3s;
        }

.triangle-down {
    display:inline-block;
}
    .triangle-down .operationTwo-posi {
        position: absolute;
        left: 6px;
        top: 24px;
        background: #fff;
        box-shadow: 0px 8px 24px 0px rgba(195,195,195,0.5);
        border-radius: 6px;
        z-index:9;
    }
        .triangle-down .operationTwo-posi > div {
            padding: 5px 5px 5px 12px;
            width: 130px;
            font-size: 12px;
        }
  .submit-box {
    button {
      margin-right: 10px;
    }
  }
</style>
