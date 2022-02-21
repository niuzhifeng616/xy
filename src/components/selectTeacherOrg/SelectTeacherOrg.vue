<template>
  <Modal
    class="select-teacher-org"
    :styles="{top:'20px',width:'90%'}"
    :title="modalTitle"
    :transfer="false"
    v-model="showModal"
    :closable="false"
    :mask-closable="false">
    <Row class="cascader-content">
      <i-col span="16" class="cascader-content-left">
        <div class="cascader-content-left-search">
          <Alert show-icon>点击左侧栏组织，中间栏勾选用户，右侧栏显示已选用户。</Alert>
          <i-input
            search
            clearable
            style="width:300px"
            class="casader-search"
            placeholder="请输入用户名/工号/姓名"
            v-model="modalSearchName"
            @on-search="searchNameFun">
            <Select @on-change="changeSearchType" v-model="searchType" slot="prepend" style="width: 80px">
              <Option value="1">局部</Option>
              <Option value="2">全局</Option>
            </Select>
          </i-input>
        </div>
        <Row>
          <i-col span="8" class="cascader-content-left">
            <Tree
              class="tree-list"
              :data="newList"
              :load-data="newLoadData"
              @on-select-change="treeSelect">
            </Tree>
          </i-col>
          <i-col span="16" class="cascader-content-center">
            <div class="center-serch-wrap">
              <checkbox
                v-model="casaderIsAll"
                @on-change="checkAllBtn"
                v-if="(transferData.length>1&&modalSearchName===''&&isSearchType==='1'&&transferData[0].label!=='全选')||(isSearchType==='2'&&transferData.length>1)"
              >全选</checkbox>
            </div>
            <Alert v-if="transferData.length === 0" type="warning" show-icon style="margin:0px 0px 20px">
              未查询到相关信息
              <template slot="desc">
                当前分组下暂无信息，请切换分组后重新查找。
              </template>
            </Alert>
            <div v-else>
              <div v-for="item in transferData" :key="item.childNameStr">
                <div class="cascader-content-center-list" v-if="item.memberlist.length>0">
                  <div class="cascader-content-center-list-border">
                    <checkbox v-model="item.CheckAll"
                              v-if="modalSearchName===''||isSearchType==='2'"
                              size="large"
                              :key="item.value"
                              @on-change="handleCheckAll(item)"
                    >{{item.label}}
                    </checkbox>
                    <span v-else>{{item.label}}</span>
                  </div>
                  <template v-for="child in item.memberlist">
                    <checkbox size="large"
                      v-if="isSearchType==='2'||(isSearchType==='1'&&(child.FullName.indexOf(modalSearchName)>=0 || modalSearchName=='' || child.UserName.indexOf(modalSearchName)>=0||child.SchoolCardNumber.indexOf(modalSearchName)>=0))"
                      :key="child.UserID"
                      v-model="child.singleCheck"
                      @on-change="checkAllChange(child,item)"
                      :title="child.UserName"
                      class="check-name">
                      {{child.FullName}}
                    </checkbox>
                  </template>
                </div>
              </div>
            </div>
          </i-col>
        </Row>
      </i-col>
      <i-col span="8" class="cascader-content-right">
        <div class="title">已选<b>{{checkAllList.length}}</b>人</div>
        <div class="cascader-content-right-list">
          <Tag
            class="checked-list"
            v-for="item in checkAllList"
            :key="item.UserName"
            :name="item.UserID"
            closable
            @on-close="handleClose"
            :title="item.UserName">{{item.FullName}}
          </Tag>
        </div>
      </i-col>
    </Row>
    <!-- <Spin v-if="isLoadingShow" fix>
      <icon type="ios-loading" size=18 class="spin-icon-load"></icon>
      <div>加载中...</div>
    </Spin> -->
    <div slot="footer">
      <Button class="xy-modal-close" @click="modalCancel">取消</Button>
      <Button class="xy-modal-primary" shape="circle" @click="modalConfirm">确定</Button>
    </div>
  </Modal>
</template>
<script>
  export default {
    name: 'SelectTeacherOrg',
    props: {
      isRequiredSelect: {
        type: Boolean,
        default: true
      },
      isShowSelectAll: {
        type: Boolean,
        default: true
      },
      modalTitle: {
        type: String,
        default: '选择教师'
      },
      isShow: {
        type: Boolean,
        required: true
      },
      // 已经选中的教师
      teachers: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        searchType: '1',
        isSearchType: '1',
        showModal: false,
        modalSearchName: '',
        casaderIsAll: false, // 全选
        isLoadingShow: true,
        newList: [], // 左侧数据
        transferData: [], // 中间数据
        checkAllList: [], // 右侧数据
        checkAllGroup: [], // 多选子集合
        isDataList: false
      }
    },
    created () {
      // this.openAddModal()
    },
    watch: {
      isShow (val) {
        this.showModal = val
        if (val) {
          this.openAddModal()
          // this.checkAllList = this.teachers // 已选回显
        }
      }
    },
    methods: {
      modalCancel () {
        this.casaderIsAll = false
        this.newList = []// 左侧滞空
        this.transferData = []// 中间滞空
        this.checkAllGroup = []// 多选框滞空
        this.checkAllList = []// 右侧滞空
        this.modalSearchName = ''
        this.searchType = '1'
        this.isSearchType = '1'
        this.$emit('select-cancel')
      },
      modalConfirm () {
        if (this.isRequiredSelect) {
          if (this.checkAllList.length > 0) {
            this.modalSearchName = ''
            this.searchType = '1'
            this.isSearchType = '1'
            this.$emit('select-confirm', this.checkAllList)
          } else {
            this.xy.msgError('请先选择教师。')
          };
        } else {
          this.modalSearchName = ''
          this.$emit('select-confirm', this.checkAllList)
        }
      },
      async openAddModal () {
        this.newList = [] // 左侧滞空
        this.transferData = []// 中间滞空
        this.checkAllList = []// 右侧滞空
        this.casaderIsAll = false
        // this.checkAllList = [...this.teachers] // 回显已经选中的
        let params = {
          id: 0,
          type: ''
        }
        this.xy.loading()
        let rs = await this.xy.get(this.xyApi + '/xy/comm/GetNodeList', params)
        if (rs.success) {
          if (rs.data.length > 0) {
            for (var i = 0; i < rs.data.length; i++) {
              if (rs.data[i].value === 0) {
                this.newList.push({
                  title: rs.data[i].label,
                  id: rs.data[i].value,
                  nodetype: rs.data[i].nodetype
                })
              } else {
                this.newList.push({
                  title: rs.data[i].label,
                  loading: false,
                  children: [],
                  id: rs.data[i].value,
                  nodetype: rs.data[i].nodetype
                })
              }
            }
          }
        }
        this.xy.unloading()
        this.isLoadingShow = false
      },
      async newLoadData (item, callback) {
        this.isLoadingShow = true
        let params = {
          id: item.id,
          type: item.nodetype
        }
        let rs = await this.xy.get(this.xyApi + '/xy/comm/GetNodeList', params)
        let data = []
        if (rs.success) {
          rs.data.forEach((value) => {
            if (value.ischild) {
              data.push({
                parentId: item.id,
                parentTitle: item.title,
                parentNodetype: item.nodetype,
                id: value.value,
                title: value.label,
                loading: false,
                nodetype: value.nodetype,
                children: []
              })
            } else {
              data.push({
                parentId: item.id,
                parentTitle: item.title,
                parentNodetype: item.nodetype,
                id: value.value,
                title: value.label,
                nodetype: value.nodetype
              })
            }
          })
          callback(data)
        }
        this.isLoadingShow = false
      },
      treeSelect (data) {
        // 获取教师组织成员's'
        if (data.length > 0) {
          if (data[0].nodetype !== 'S') {
            this.getTeachers(data)
          } else {
            // 点击校区显示校区下所有的人
            this.isLoadingShow = true
            this.transferData = []
            this.getTeachers2(data)
          }
        }
      },
      async getTeachers (data) {
        this.xy.loading()
        let params = {
          orgID: data[0].id,
          teacherIDs: '',
          type: data[0].nodetype
        }
        this.isLoadingShow = true
        let rs = await this.xy.get(this.xyApi + '/xy/comm/GetNodeListHasmember', params)
        this.transferData = []
        if (rs.success) {
          if (rs.data.length > 0) {
            for (let i = 0; i < rs.data.length; i++) {
              rs.data[i].CheckAll = false // 每一组的全选按钮
              rs.data[i].checkAllGroup = [] // 每一组人集合
              if (rs.data[i].memberlist.length > 0) {
                this.isDataList = false
                for (var j = 0; j < rs.data[i].memberlist.length; j++) {
                  rs.data[i].memberlist[j].singleCheck = false
                  rs.data[i].childNameStr += rs.data[i].memberlist[j].FullName + ',' + rs.data[i].memberlist[j].UserName + ','
                }

                this.transferData.push(rs.data[i])
              }
            }
            // 根据右侧已选人改变渲染的初始数据
            if (this.checkAllList.length > 0) {
              for (var d = 0; d < this.transferData.length; d++) {
                for (var z = 0; z < this.transferData[d].memberlist.length; z++) {
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
          } else {
            this.isDataList = true
          }
        } else {
          this.isDataList = true
        }
        this.isLoadingShow = false
        this.xy.unloading()
      },
      async getTeachers2 (data) {
        this.xy.loading()
        let params = {
          orgID: 0,
          schoolID: data[0].id
        }
        this.isLoadingShow = true
        let rs = await this.xy.get(this.xyApi + '/xy/comm/GetOrganizationMember', params)
        if (rs.success) {
          if (rs.data.length > 0) {
            let dataList = rs.data
            for (var i = 0; i < dataList.length; i++) {
              dataList[i].IsCurrent = false
              dataList[i].ischild = false
              dataList[i].loading = false
              dataList[i].CheckAll = false
              dataList[i].label = dataList[i].Name
              dataList[i].memberlist = dataList[i].Members
              dataList[i].value = dataList[i].OrganizationID
              for (var j = 0; j < dataList[i].memberlist.length; j++) {
                dataList[i].memberlist[j].FullName = dataList[i].memberlist[j].Name
                dataList[i].memberlist[j].UserID = dataList[i].memberlist[j].ID
                dataList[i].memberlist[j].singleCheck = false
                dataList[i].childNameStr += dataList[i].memberlist[j].FullName + ',' + dataList[i].memberlist[j].UserName + ','
              }
            }
            this.transferData = dataList
          }
          // 反绑
          // 根据右侧已选人改变渲染的初始数据
          if (this.checkAllList.length > 0) {
            for (var d = 0; d < this.transferData.length; d++) {
              for (var z = 0; z < this.transferData[d].memberlist.length; z++) {
                var f = this.checkAllList.map(function (val) {
                  return val.UserID
                }).indexOf(this.transferData[d].memberlist[z].UserID)
                if (f !== -1) {
                  this.transferData[d].memberlist[z].singleCheck = true
                }
              }
              // 所有的全选按钮
              var all1 = this.transferData[d].memberlist.map(function (val) {
                return val.singleCheck
              }).indexOf(true)
              if (all1 === -1) { // 全没有ture
                this.transferData[d].CheckAll = false
              } else {
                // 最少有一个true
                var all2 = this.transferData[d].memberlist.map(function (val) {
                  return val.singleCheck
                }).indexOf(false)
                if (all2 === -1) {
                  this.transferData[d].CheckAll = true
                } else {
                  this.transferData[d].CheckAll = false
                }
              }
            }
          }
        }
        this.isLoadingShow = false
        this.xy.unloading()
      },
      checkAllBtn () { // 全选
        if (this.casaderIsAll) {
          for (var i = 0; i < this.transferData.length; i++) {
            this.transferData[i].CheckAll = true
            for (var j = 0; j < this.transferData[i].memberlist.length; j++) {
              this.transferData[i].memberlist[j].singleCheck = true
              // 把选中的添加至右侧
              this.checkAllList.push(this.transferData[i].memberlist[j])
            }
          }
          // 去重
          this.checkDuplicateRemoval(this.checkAllList)
        } else {
          for (var k = 0; k < this.transferData.length; k++) {
            this.transferData[k].CheckAll = false
            for (var s = 0; s < this.transferData[k].memberlist.length; s++) {
              this.transferData[k].memberlist[s].singleCheck = false
              for (var m = 0; m < this.checkAllList.length; m++) {
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
            // 某一个的全选按钮
            let isCheckAll = this.transferData[p].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (isCheckAll === -1) {
              this.transferData[p].CheckAll = true
              // this.casaderIsAll = true // 全选
            } else {
              this.transferData[p].CheckAll = false
              // this.casaderIsAll = false // 全选
            }
          }
          // 去重
          this.checkDuplicateRemoval(this.checkAllList)
        } else {
          for (var p = 0; p < this.transferData.length; p++) {
            for (var q = 0; q < this.transferData[p].memberlist.length; q++) {
              var index2 = item.memberlist.map((val) => {
                return val.UserID
              }).indexOf(this.transferData[p].memberlist[q].UserID)
              if (index2 !== -1) {
                this.transferData[p].memberlist[q].singleCheck = false
              }
            }
            // 删除右侧
            for (let k = 0; k < item.memberlist.length; k++) {
              let index3 = this.checkAllList.map((val) => {
                return val.UserID
              }).indexOf(item.memberlist[k].UserID)
              if (index3 !== -1) {
                this.checkAllList.splice(index3, 1)
              }
            }

            // 所有的全选按钮
            var isCheckAll2 = this.transferData[p].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(true)
            if (isCheckAll2 === -1) { // 全没有ture
              this.transferData[p].CheckAll = false
              this.casaderIsAll = false // 全选
            } else {
              // 最少有一个true
              var isCheckAll3 = this.transferData[p].memberlist.map((val) => {
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
        // 全部的全选
        let isCasaderIsAll = this.transferData.map((val) => {
          return val.CheckAll
        }).indexOf(false)
        if (isCasaderIsAll === -1) {
          this.casaderIsAll = true // 全选
        } else {
          this.casaderIsAll = false // 全选
        }
      },
      checkAllChange (child) { // 每个人的按钮
        if (child.singleCheck) {
          this.checkAllList.push(child)
          let curCasaderIsAll = []
          for (var i = 0; i < this.transferData.length; i++) {
            var mapIndex = this.transferData[i].memberlist.map((val) => {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex !== -1) {
              this.transferData[i].memberlist[mapIndex].singleCheck = true
            }

            // 组内全选按钮选中
            var is1 = this.transferData[i].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (is1 === -1) {
              this.transferData[i].CheckAll = true
              curCasaderIsAll.push(true)
            } else {
              curCasaderIsAll.push(false)
            }
          }
          // if (curCasaderIsAll.indexOf(false) > -1) { // 中间全部教师存在没有选中的，全选为false
          //   this.casaderIsAll = false
          // } else {
          //   this.casaderIsAll = true
          // }
        } else {
          var index1 = this.checkAllList.map((val) => {
            return val.UserID
          }).indexOf(child.UserID)
          this.checkAllList.splice(index1, 1)
          for (let i = 0; i < this.transferData.length; i++) {
            var mapIndex1 = this.transferData[i].memberlist.map((val) => {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex1 !== -1) {
              this.transferData[i].memberlist[mapIndex1].singleCheck = false
            }
            // 组内全选按钮是否选中
            var is2 = this.transferData[i].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(true)
            if (is2 === -1) { // 没有true
              this.transferData[i].CheckAll = false
              // this.casaderIsAll = false
            } else {
              // 最少有一个true
              var is3 = this.transferData[i].memberlist.map((val) => {
                return val.singleCheck
              }).indexOf(false)
              if (is3 === -1) {
                this.transferData[i].CheckAll = true
                // this.casaderIsAll = true
              } else {
                this.transferData[i].CheckAll = false
                // this.casaderIsAll = false
              }
            }
          }
        }
        // 全部的全选
        let isCasaderIsAll = this.transferData.map((val) => {
          return val.CheckAll
        }).indexOf(false)
        if (isCasaderIsAll === -1) {
          this.casaderIsAll = true // 全选
        } else {
          this.casaderIsAll = false // 全选
        }
      },
      searchNameFun (vals) {
        if (this.searchType === '1') {
          this.modalSearchName = vals
        } else {
          if (this.modalSearchName !== '') {
            this.allSearch()
          } else {
            this.xy.msgError('请输入要搜索的用户。')
          }
        }
      },
      changeSearchType (vals) {
        this.searchType = vals
        this.isSearchType = vals
      },
      allSearch () {
        this.xy.loading()
        this.xy.get(`${this.xyApi}/base/api/Users/FuzzySearch`, {
          word: this.modalSearchName,
          userRoleType: 2// 2：教师，3：学生，4：家长
        }).then(rs => {
          this.isLoadingShow = true
          this.transferData = []
          if (rs.success) {
            if (rs.data.length > 0) {
              this.isDataList = false
              this.transferData = [{
                label: '全选',
                CheckAll: false,
                checkAllGroup: [],
                memberlist: []
              }]
              for (let i = 0; i < rs.data.length; i++) {
                this.transferData[0].memberlist.push({
                  FullName: rs.data[i].FullName,
                  UserName: rs.data[i].UserName,
                  UserID: rs.data[i].UserID,
                  SchoolCardNumber: rs.data[i].SchoolCardNumber,
                  singleCheck: false,
                  childNameStr: rs.data[i].FullName + ',' + rs.data[i].UserName + ','
                })
              }
              console.log(this.transferData)
              // 根据右侧已选人改变渲染的初始数据
              if (this.checkAllList.length > 0) {
                for (var d = 0; d < this.transferData.length; d++) {
                  for (var z = 0; z < this.transferData[d].memberlist.length; z++) {
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
            } else {
              this.isDataList = true
            }
          } else {
            this.isDataList = true
          }
          this.isLoadingShow = false

          this.xy.unloading()
        })
      },
      handleClose (e, name) {
        for (let u = 0; u < this.checkAllList.length; u++) {
          if (this.checkAllList[u].UserID === name) {
            this.checkAllList.splice(u, 1)
          }
        }
        this.changeSelectValid(name)
      },
      changeSelectValid (name) {
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
      margin: 10px;

      .casader-search {
        width: 300px;
      }
    }
  }
</style>
