<template>
  <modal
    class="select-modal"
    :title="modalTitle"
    :transfer="false"
    width="90%"
    :value="isShow"
    :mask-closable="false"
    :closable="false"
    @on-cancel="modalCancel"
    @on-ok="modalConfirm">
    <Row class="cascader-content">
      <i-col  span="6" class="cascader-content-left">
        <Tree
          :data="newList"
          @on-select-change="treeSelect">
        </Tree>
      </i-col>
      <i-col  span="11" class="cascader-content-center">
        <div class="title-describe title-model">温馨提示：点击左侧栏中的班级组织，从中间栏勾选班级，右侧栏显示已选中的班级</div>
        <div class="center-serch-wrap">
          <checkbox v-model="casaderIsAll" @on-change="checkAllBtn">全选</checkbox>
          <Input search enter-button
                 placeholder="请输入教室名称"
                 v-model.trim="modalSearchName"
                 class="fr casader-search"
                 @on-search="searchNameFun"/>
        </div>
        <Alert v-if="transferData.length ===0" type="warning" show-icon style="margin-bottom:20px;">
          未查询到相关数据
          <template slot="desc">
            当前分组下暂无数据，请切换分组后重新查找
          </template>
        </Alert>
        <div v-else>
          <div v-for="item in transferData" :key="item.value">
            <div class="cascader-content-center-list">
              <!-- v-if="item.childNameStr.indexOf(searchName)>=0 || searchName==''" -->
              <div class="cascader-content-center-list-border">
                <Checkbox v-model="item.CheckAll"
                          size="large"
                          :key="item.value"
                          @on-change="handleCheckAll(item)"
                >{{item.orgFullName}}
                </Checkbox>
              </div>
              <Checkbox size="large"
                        v-for="child in item.memberlist"
                        :key="child.UserID"
                        v-model="child.singleCheck"
                        @on-change="checkAllChange(child,item)"
                        :title="child.UserName"
                        class="check-name"
              >{{child.FullName}}
              </Checkbox>
            </div>
          </div>
        </div>
      </i-col>
      <i-col  span="7" class="cascader-content-right">
        <div>已选<b>{{checkAllList.length}}</b>间教室</div>
        <div class="cascader-content-right-list">
          <Tag
            v-for="item in checkAllList"
            :name="item.UserID"
            closable
            :key="item.UserID"
            @on-close="handleClose"
            :title="item.FullName">
            {{item.FullName}}
          </Tag>
        </div>
      </i-col>
      <div>
      </div>
    </Row>
    <spin v-if="isLoadingShow" fix>
      <icon type="ios-loading" size=18 class="spin-icon-load"></icon>
      <div>加载中...</div>
    </spin>
  </modal>
</template>
<script>
  export default {
    name: 'SelectClasses',
    props: {
      classTableID: {
        type: Number,
        default: 70365
      },
      isShowSelectAll: {
        type: Boolean,
        default: true
      },
      modalTitle: {
        type: String,
        default: '添加班级'
      },
      isShow: {
        type: Boolean,
        required: true
      },
      // 已经选中的教室
      selectMembers: {
        type: Array,
        required: true
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
        newArrList: [{
          ischild: true,
          label: '',
          loading: false,
          checkAll: false,
          memberlist: [],
          checkAllGroup: [],
          childNameStr: ''
        }]
      }
    },
    created () {
      this.openAddModal()
    },
    updated () {
    },
    watch: {
      isShow (val) {
        if (val) {
          this.checkAllList = this.selectMembers
          this.openAddModal()
        }
      }
    },
    methods: {
      modalCancel () {
        this.$emit('select-cancel')
      },
      modalConfirm () {
        this.$emit('select-confirm', this.checkAllList)
      },
      async openAddModal () {
        this.newList = [] // 左侧滞空
        this.transferData = []// 中间滞空
        this.checkAllList = []// 右侧滞空
        this.checkAllList = this.selectMembers
        let params = {
          classTableID: this.classTableID
        }
        let rs = await this.xy.get(this.$store.state.apiPath + '/api/Collection/GetOrg', params)
        this.isLoadingShow = false
        if (rs.success) {
          let dataList = rs.data
          if (dataList.length) {
            for (let i = 0; i < dataList.length; i++) {
              this.newList.push({
                id: dataList[i].SchoolDistrictID,
                title: dataList[i].SchoolDistrictName,
                level: 1,
                children: []
              })
              if (dataList[i].YearList != null && dataList[i].YearList.length > 0) {
                for (var j = 0; j < dataList[i].YearList.length; j++) {
                  this.newList[i].children.push({
                    id: dataList[i].YearList[j].StudentYearID,
                    title: dataList[i].YearList[j].StudentYearName,
                    schoolID: dataList[i].SchoolDistrictID,
                    level: 2,
                    children: []
                  })
                  if (dataList[i].YearList[j].GradeList != null && dataList[i].YearList[j].GradeList.length > 0) {
                    for (let k = 0; k < dataList[i].YearList[j].GradeList.length; k++) {
                      this.newList[i].children[j].children.push({
                        id: dataList[i].YearList[j].GradeList[k].StudentGradeID,
                        title: dataList[i].YearList[j].GradeList[k].StudentGradeName,
                        schoolID: dataList[i].SchoolDistrictID,
                        studentYearID: dataList[i].YearList[j].StudentYearID,
                        orgFullName: dataList[i].YearList[j].StudentYearName +
                          dataList[i].YearList[j].GradeList[k].StudentGradeName,
                        orgName: dataList[i].YearList[j].StudentYearName +
                          dataList[i].YearList[j].GradeList[k].StudentGradeName,
                        level: 3
                      })
                    }
                  }
                }
              }
            }
          }
        }
      },
      treeSelect (data) {
        if (data.length > 0) {
          this.isLoadingShow = true
          if (data[0].level === 3) {
            this.getHouseList(data)
          } else {
            this.isLoadingShow = false
            this.transferData = []
          }
        }
      },
      async getHouseList (data) {
        let params = {
          schoolID: data[0].schoolID,
          studentYearID: data[0].studentYearID,
          studentGradeID: data[0].id,
          classTableID: this.classTableID
        }
        let rs = await this.xy.get(this.$store.state.apiPath + '/api/Collection/GetStudentOrg', params)
        this.transferData = []
        this.isLoadingShow = false
        if (rs.success) {
          let resData = {}
          resData.memberlist = rs.data
          resData.checkAll = false // 每一组的全选按钮
          resData.checkAllGroup = [] // 每一组人集合
          resData.orgFullName = data[0].orgFullName
          if (resData.memberlist.length > 0) {
            for (let j = 0; j < resData.memberlist.length; j++) {
              resData.memberlist[j].singleCheck = false
              resData.memberlist[j].orgName = data[0].orgName
              resData.childNameStr += resData.memberlist[j].StudentOrganizationName
            }

            this.transferData.push(resData)
          }
          // 根据右侧已选人改变渲染的初始数据
          if (this.checkAllList.length > 0) {
            for (let d = 0; d < this.transferData.length; d++) {
              for (let z = 0; z < this.transferData[d].memberlist.length; z++) {
                var f = this.checkAllList.map(function (val) {
                  return val.StudentOrganizationID
                }).indexOf(this.transferData[d].memberlist[z].StudentOrganizationID)
                if (f !== -1) {
                  this.transferData[d].memberlist[z].singleCheck = true
                }
              }

              // 所有的全选按钮
              let all1 = this.transferData[d].memberlist.map(function (val) {
                return val.singleCheck
              }).indexOf(true)
              if (all1 === -1) { // 全没有ture
                this.transferData[d].checkAll = false
                this.casaderIsAll = false
              } else {
                // 最少有一个true
                let all2 = this.transferData[d].memberlist.map(function (val) {
                  return val.singleCheck
                }).indexOf(false)
                if (all2 === -1) {
                  this.transferData[d].checkAll = true
                  this.casaderIsAll = true
                } else {
                  this.transferData[d].checkAll = false
                  this.casaderIsAll = false
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
                if (this.checkAllList[m].ID === this.transferData[k].memberlist[s].ID) {
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
          return value.ID
        })
        idList = [...new Set(idList)]
        this.checkAllList = data.map(function (value) {
          if (idList.indexOf(value.ID) > -1) {
            return value
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
                if (this.transferData[p].memberlist[m].ID === item.memberlist[q].ID) {
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
                return val.ID
              }).indexOf(this.transferData[p].memberlist[q].ID)
              if (index2 !== -1) {
                this.transferData[p].memberlist[q].singleCheck = false
              }
            }
            // 删除右侧
            for (let k = 0; k < item.memberlist.length; k++) {
              let index3 = this.checkAllList.map(function (val) {
                return val.ID
              }).indexOf(item.memberlist[k].ID)
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
  .select-modal {
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
