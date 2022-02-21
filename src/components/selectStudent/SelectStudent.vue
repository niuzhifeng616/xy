<template>
  <Modal
    class="select-teacher-org"
    :styles="{top:'20px',width:'90%'}"
    :title="modalTitle"
    :transfer="false"
    :value="isShow"
    :mask-closable="false"
    :closable="false">
    <Row class="cascader-content">
      <i-col span="16" class="cascader-content-left">
        <div class="cascader-content-left-search">
          <Alert show-icon>点击左侧栏组织，中间栏勾选用户，右侧栏显示已选用户。</Alert>
          <i-input
            search
            clearable
            style="width:300px"
            class="casader-search"
            placeholder="请输入用户名/学籍号/姓名"
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
                      v-if="isSearchType==='2'||(isSearchType==='1'&&(child.FullName.indexOf(modalSearchName)>=0 || modalSearchName=='' || child.UserName.indexOf(modalSearchName)>=0|| child.SchoolCardNumber.indexOf(modalSearchName)>=0))"
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
            :key="item.UserID"
            :name="item.UserID"
            closable
            @on-close="handleClose"
            :title="item.UserName"
            v-cloak>{{item.FullName}}
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
    name: 'SelectStudent',
    props: {
      isShowSelectAll: {
        type: Boolean,
        default: true
      },
      modalTitle: {
        type: String,
        default: '选择学生'
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
        modalSearchName: '',
        casaderIsAll: false, // 全选
        isLoadingShow: false,
        newList: [], // 左侧数据
        transferData: [], // 中间数据
        checkAllList: [], // 右侧数据
        checkAllGroup: [], // 多选子集合
        isDataList: false,
        schoolDistrictID: 0,
        studentGradeID: 0,
        studentGradeForStudentYearID: 0,
        studentOrganizationID: 0,
        selectClassID: ''
      }
    },
    created () {
    },
    updated () {
    },
    watch: {
      isShow (val) {
        if (val) {
          this.openAddModal()
          // this.checkAllList = this.teachers // 已选回显
        }
      },
      transferData (val) {
        if (val.length > 0) {
          // console.log(val)
          let status = val.every(item => item.CheckAll === true)
          // console.log(status)
          this.casaderIsAll = status
        } else {
          this.casaderIsAll = false
        }
      }
    },
    methods: {
      modalCancel () {
        this.casaderIsAll = false
        this.newList = [] // 左侧滞空
        this.transferData = []// 中间滞空
        this.checkAllList = []// 右侧滞空
        this.searchType = '1'
        this.isSearchType = '1'
        this.modalSearchName = ''
        this.$emit('select-cancel')
      },
      modalConfirm () {
        if (this.checkAllList.length > 0) {
          this.searchType = '1'
          this.isSearchType = '1'
          this.$emit('select-confirm', this.checkAllList)
        } else {
          this.xy.msgError('请先选择学生。')
        }
      },
      async openAddModal () {
        this.newList = [] // 左侧滞空
        this.transferData = []// 中间滞空
        this.checkAllList = []// 右侧滞空
        this.modalSearchName = ''
        // this.checkAllList = this.teachers // 回显已经选中的

        this.isLoadingShow = false
        let params = {
          id: 0,
          type: ''
        }
        let rs = await this.xy.get(this.xyApi + '/xy/Comm/StudentOrganization', params)
        if (rs.success) {
          let respon = rs.data
          for (var i = 0; i < respon.length; i++) {
            this.newList.push({
              id: respon[i].ID,
              title: respon[i].Name,
              nodetype: respon[i].Type,
              loading: false,
              index: i,
              children: []
            })
            if (respon[i].MemberList.length > 0) {
              for (var c = 0; c < respon[i].MemberList.length; c++) {
                this.newList[i].children.push({
                  id: respon[i].MemberList[c].ID,
                  title: respon[i].MemberList[c].Name,
                  nodetype: respon[i].MemberList[c].Type,
                  loading: false,
                  children: []
                })
                if (respon[i].MemberList[c].MemberList.length > 0) {
                  for (var j = 0; j < respon[i].MemberList[c].MemberList.length; j++) {
                    this.newList[i].children[c].children.push({
                      id: respon[i].MemberList[c].MemberList[j].ID,
                      title: respon[i].MemberList[c].MemberList[j].Name,
                      nodetype: respon[i].MemberList[c].MemberList[j].Type,
                      loading: false,
                      children: []
                    })
                    if (respon[i].MemberList[c].MemberList[j].MemberList.length > 0) {
                      for (var k = 0; k < respon[i].MemberList[c].MemberList[j].MemberList.length; k++) {
                        this.newList[i].children[c].children[j].children.push({
                          id: respon[i].MemberList[c].MemberList[j].MemberList[k].ID,
                          title: respon[i].MemberList[c].MemberList[j].MemberList[k].Name,
                          nodetype: respon[i].MemberList[c].MemberList[j].MemberList[k].Type
                        })
                      }
                    }
                  }
                }
              }
            }
          }
        }
        this.isLoadingShow = false
      },
      treeSelect (data) {
        this.casaderIsAll = false
        // 获取教师组织成员's'
        if (data.length > 0) {
          if (data[0].nodetype !== 'S') {
            if (data[0].nodetype === 'SD') {
              this.selectStudent(data[0].id, this.studentGradeID, this.studentGradeForStudentYearID, this.studentOrganizationID)
            } else if (data[0].nodetype === 'SY') {
              this.selectStudent(this.schoolDistrictID, data[0].id, this.studentGradeForStudentYearID, this.studentOrganizationID)
            } else if (data[0].nodetype === 'SG') {
              this.selectStudent(this.schoolDistrictID, this.studentGradeID, data[0].id, this.studentOrganizationID)
            } else if (data[0].nodetype === 'SO') {
              this.selectStudent(this.schoolDistrictID, this.studentGradeID, this.studentGradeForStudentYearID, data[0].id)
            }
          } else {
            this.isLoadingShow = false
          }
        }
        // console.log(this.transferData, this.newList)
      },
      async selectStudent (schoolID, studentID, studentGradeForID, studentOrganizationID) {
        let params = {
          schoolDistrictID: schoolID,
          studentGradeID: studentID,
          studentGradeForStudentYearID: studentGradeForID,
          studentOrganizationID: studentOrganizationID
        }
        this.isLoadingShow = true
        let rs = await this.xy.get(this.xyApi + '/xy/comm/GetStudentorganizationMemberByID', params)
        this.transferData = []
        if (rs.success) {
          this.isLoadingShow = false
          let resDataList = rs.data
          if (resDataList.length > 0) {
            for (let i = 0; i < resDataList.length; i++) {
              resDataList[i].label = resDataList[i].Name
              resDataList[i].CheckAll = false// 每一组的全选按钮
              resDataList[i].checkAllGroup = []// 每一组人集合
              for (let j = 0; j < resDataList[i].Children.length; j++) {
                resDataList[i].Children[j].singleCheck = false
                resDataList[i].childNameStr += resDataList[i].Children[j].FullName + ',' + resDataList[i].Children[j].UserName + ','
                resDataList[i].Children[j].FullName = rs.data[i].Children[j].FullName
                resDataList[i].Children[j].UserID = rs.data[i].Children[j].UserID
              }

              resDataList[i].memberlist = resDataList[i].Children
              this.transferData.push(resDataList[i])
              this.isLoadingShow = false
            }

            // 根据右侧已选人改变渲染的初始数据
            if (this.checkAllList.length > 0) {
              for (let d = 0; d < this.transferData.length; d++) {
                for (let z = 0; z < this.transferData[d].memberlist.length; z++) {
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
            this.isLoadingShow = false
          } else {
            this.isLoadingShow = false
            this.transferData = []
          }
        }
      },
      checkAllBtn () { // 全选
        if (this.casaderIsAll) {
          for (var i = 0; i < this.transferData.length; i++) {
            this.transferData[i].CheckAll = true
            for (var j = 0; j < this.transferData[i].memberlist.length; j++) {
              this.transferData[i].memberlist[j].singleCheck = true
              // 把选中的添加至右侧
              this.checkAllList.push(Object.assign({}, this.transferData[i].memberlist[j], {
                StudentOrganizationID: this.transferData[i].StudentOrganizationID,
                SchoolDistrictID: this.transferData[i].SchoolDistrictID,
                StudentGradeForStudentYearID: this.transferData[i].StudentGradeForStudentYearID,
                StudentGradeID: this.transferData[i].StudentGradeID
              }))
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
                // this.checkAllList.push(this.transferData[p].memberlist[m])
                this.checkAllList.push(Object.assign({}, this.transferData[p].memberlist[m], {
                  StudentOrganizationID: this.transferData[p].StudentOrganizationID,
                  SchoolDistrictID: this.transferData[p].SchoolDistrictID,
                  StudentGradeForStudentYearID: this.transferData[p].StudentGradeForStudentYearID,
                  StudentGradeID: this.transferData[p].StudentGradeID
                }))
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
      checkAllChange (child, item) { // 每个人的按钮
        if (child.singleCheck) {
          this.checkAllList.push(Object.assign({}, child, {
            StudentOrganizationID: item.StudentOrganizationID,
            SchoolDistrictID: item.SchoolDistrictID,
            StudentGradeForStudentYearID: item.StudentGradeForStudentYearID,
            StudentGradeID: item.StudentGradeID
          }))
          for (var i = 0; i < this.transferData.length; i++) {
            var mapIndex = this.transferData[i].memberlist.map(function (val) {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex !== -1) {
              this.transferData[i].memberlist[mapIndex].singleCheck = true
            }

            // 组内全选按钮选中
            var is1 = this.transferData[i].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (is1 === -1) {
              this.transferData[i].CheckAll = true
              this.casaderIsAll = true
            }
          }
        } else {
          var index1 = this.checkAllList.map(function (val) {
            return val.UserID
          }).indexOf(child.UserID)
          this.checkAllList.splice(index1, 1)
          for (let i = 0; i < this.transferData.length; i++) {
            var mapIndex1 = this.transferData[i].memberlist.map(function (val) {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex1 !== -1) {
              this.transferData[i].memberlist[mapIndex1].singleCheck = false
            }
            // 组内全选按钮是否选中
            var is2 = this.transferData[i].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(true)
            if (is2 === -1) { // 没有true
              this.transferData[i].CheckAll = false
              this.casaderIsAll = false
            } else {
              // 最少有一个true
              var is3 = this.transferData[i].memberlist.map(function (val) {
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
      allSearch () {
        this.xy.loading()
        this.xy.get(`${this.xyApi}/base/api/Users/FuzzySearch`, {
          word: this.modalSearchName,
          userRoleType: 3// 2：教师，3：学生，4：家长
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
      changeSearchType (vals) {
        this.searchType = vals
        this.isSearchType = vals
      },
      handleClose (e, name) {
        for (let u = 0; u < this.checkAllList.length; u++) {
          if (this.checkAllList[u].UserID === name) {
            this.checkAllList.splice(u, 1)
          }
        }

        for (var i = 0; i < this.transferData.length; i++) {
          var mapIndex = this.transferData[i].memberlist.map(function (val) {
            return val.UserID
          }).indexOf(name)
          if (mapIndex !== -1) {
            this.transferData[i].memberlist[mapIndex].singleCheck = false
          }

          // 组内全选按钮是否选中
          var is4 = this.transferData[i].memberlist.map(function (val) {
            return val.singleCheck
          }).indexOf(true)
          if (is4 === -1) { // 没有true
            this.transferData[i].CheckAll = false
            this.casaderIsAll = false
          } else {
            // 最少有一个true
            var is5 = this.transferData[i].memberlist.map(function (val) {
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
