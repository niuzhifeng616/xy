<template>
  <Modal
    class="select-teacher-org"
    width="90%"
    :title="modalTitle"
    :transfer="false"
    :value="isShow"
    :mask-closable="false"
    :closable="false">
    <Row class="cascader-content">
      <i-col span="6" class="cascader-content-left">
        <Tree
          :data="newList"
          @on-select-change="treeSelect" class="tree-list">
        </Tree>
      </i-col>
      <i-col span="11" class="cascader-content-center">
        <Alert show-icon closable>温馨提示：点击左侧栏中的学生组织，从中间栏勾选学生，右侧栏显示已选中的学生。</Alert>
        <div class="center-serch-wrap">
          <checkbox v-model="casaderIsAll" :style="{opacity:modalSearchName==='' ? 1: 0}" @on-change="checkAllBtn">全选</checkbox>
          <Input search clearable class="casader-search" placeholder="请输入用户名/学籍号/姓名" v-model="modalSearchName"
                @on-search="searchNameFun"/>
        </div>
        <Alert v-if="transferData.length === 0" type="warning" show-icon style="margin:0px 0px 20px">
          未查询到相关数据
          <template slot="desc">
            当前分组下暂无数据，请切换分组后重新查找。
          </template>
        </Alert>
        <div v-else>
          <div v-for="item in transferData" :key="item.childNameStr">
            <div class="cascader-content-center-list" style="display: flow-root;">
              <div class="cascader-content-center-list-border">
                <checkbox v-model="item.checkAll"
                          v-if="modalSearchName===''"
                          size="large"
                          :key="item.value"
                          @on-change="handlecheckAll(item)">{{item.orgFullName}}
                </checkbox>
                <span v-else>{{item.orgFullName}}</span>
                <br>
              </div>
              <div v-for="child in item.memberlist" :key="child.StudentID">
                <checkbox size="large"
                          v-if="child.FullName.indexOf(modalSearchName)>=0 || modalSearchName=='' || child.UserName.indexOf(modalSearchName)>=0||(child.SchoolCardNumber?child.SchoolCardNumber.indexOf(modalSearchName)>=0:'')"
                          v-model="child.singleCheck"
                          @on-change="checkAllChange(child,item)"
                          :title="child.UserName"
                          class="check-name fl"
                >{{child.FullName}}
                </checkbox>
              </div>
            </div>
          </div>
        </div>
      </i-col>
      <i-col span="7" class="cascader-content-right">
        <div>已选<b>{{checkAllList.length}}</b>人</div>
        <div class="cascader-content-right-list">
          <Tag v-for="item in checkAllList" :key="item.UserID" :name="item.UserID" closable
            @on-close="handleClose"
            :title="item.UserName" v-cloak>{{item.FullName}}
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
      },
      // 获取学生组织所需参数
      classTableID: {
        type: Number,
        default: 0,
        required: true
      },
      // 获取学生组织所需api
      getStudentOrgApiurl: {
        type: String,
        required: true
      },
      // 获取学生列表所需api
      getStudentApiurl: {
        type: String,
        required: true
      },
      // 获取学生列表api所需参数--选课规则：权限设置、必须设置
      courseProject: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
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
          let status = val.every(item => item.checkAll === true)
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
        this.modalSearchName = ''

        this.$emit('select-cancel')
      },
      modalConfirm () {
        if (this.checkAllList.length > 0) {
          this.$emit('select-confirm', this.checkAllList)
        } else {
          this.xy.msgError('请先选择学生。')
        };
      },
      async openAddModal () {
        this.newList = [] // 左侧滞空
        this.transferData = []// 中间滞空
        this.checkAllList = []// 右侧滞空
        this.modalSearchName = ''
        // this.checkAllList = this.teachers // 已经选中的

        this.isLoadingShow = true
        let params = {
          classTableID: this.classTableID
        }
        let rs = await this.xy.get(`${this.$store.state.apiPath}${this.getStudentOrgApiurl}`, params)
        if (rs.success) {
          var dataList = rs.data
          if (dataList.length > 0) {
            for (var i = 0; i < dataList.length; i++) {
              this.newList.push({
                value: dataList[i].SchoolDistrictID,
                title: dataList[i].SchoolDistrictName,
                level: 1,
                children: []
              })
              if (dataList[i].YearList !== null) { // ==null组织树获取失败
                if (dataList[i].YearList.length > 0) {
                  for (var j = 0; j < dataList[i].YearList.length; j++) {
                    this.newList[i].children.push({
                      value: dataList[i].YearList[j].StudentYearID,
                      title: dataList[i].YearList[j].StudentYearName,
                      schoolID: dataList[i].SchoolDistrictID,
                      level: 2,
                      children: []
                    })
                    if (dataList[i].YearList[j].GradeList.length > 0) {
                      for (var k = 0; k < dataList[i].YearList[j].GradeList.length; k++) {
                        this.newList[i].children[j].children.push({
                          value: dataList[i].YearList[j].GradeList[k].StudentGradeID,
                          title: dataList[i].YearList[j].GradeList[k].StudentGradeName,
                          level: 3,
                          children: []
                        })
                        if (dataList[i].YearList[j].GradeList[k].OrgList.length > 0) {
                          for (var m = 0; m < dataList[i].YearList[j].GradeList[k].OrgList.length; m++) {
                            // 判断不严谨，需要用标识, 待添加
                            if (dataList[i].YearList[j].GradeList[k].OrgList[m].StudentOrganizationName !== '未在班级学生') {
                              this.newList[i].children[j].children[k].children.push({
                                value: dataList[i].YearList[j].GradeList[k].OrgList[m].StudentOrganizationID, //
                                title: dataList[i].YearList[j].GradeList[k].OrgList[m].StudentOrganizationName,
                                schoolID: dataList[i].SchoolDistrictID, //
                                studentYearID: dataList[i].YearList[j].StudentYearID, //
                                studentGradeID: dataList[i].YearList[j].GradeList[k].StudentGradeID, //
                                orgFullName: dataList[i].YearList[j].StudentYearName +
                                  dataList[i].YearList[j].GradeList[k].StudentGradeName +
                                  dataList[i].YearList[j].GradeList[k].OrgList[m].StudentOrganizationName,
                                level: 4
                              })
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                // this.xy.msgError('当前校区下未获取到学届数据。')
              }
            };

            this.treeShow = false
          };
        }
        this.isLoadingShow = false
      },
      async treeSelect (data) {
        if (data.length > 0) {
          this.isLoadingShow = true
          if (data[0].level === 4) {
            var orgFullName = data[0].orgFullName
            let params = {}
            if (this.courseProject === '') {
              params = {
                schoolID: data[0].schoolID,
                studentYearID: data[0].studentYearID,
                studentGradeID: data[0].studentGradeID,
                studentOrganizationID: data[0].value,
                classTableID: this.classTableID
              }
            } else {
              params = { // 选课规则：权限设置、必须设置的参数
                aid: JSON.parse(this.courseProject).id,
                type: JSON.parse(this.courseProject).type,
                studentOrganizationID: data[0].value,
                classTableID: this.classTableID
              }
            }
            this.isLoadingShow = true
            let rs = await this.xy.get(`${this.$store.state.apiPath}${this.getStudentApiurl}`, params)
            this.transferData = []
            if (rs.success) {
              var resData = {}
              resData.memberlist = rs.data
              resData.checkAll = false// 每一组的全选按钮
              resData.checkAllGroup = []// 每一组人集合
              resData.orgFullName = orgFullName
              if (resData.memberlist.length > 0) {
                for (var j = 0; j < resData.memberlist.length; j++) {
                  resData.memberlist[j].singleCheck = false
                  resData.memberlist[j].StudentOrganizationID = data[0].value
                  resData.childNameStr += resData.memberlist[j].FullName + ',' + resData.memberlist[j].UserName + ',' + resData.memberlist[j].SchoolCardNumber + ','
                };
                this.transferData.push(resData)
                this.isLoadingShow = false
              };
              this.isLoadingShow = false
              // 根据右侧已选人改变渲染的初始数据
              if (this.checkAllList.length > 0) {
                for (var d = 0; d < this.transferData.length; d++) {
                  for (var z = 0; z < this.transferData[d].memberlist.length; z++) {
                    var f = this.checkAllList.map((val) => {
                      return val.StudentID
                    }).indexOf(this.transferData[d].memberlist[z].StudentID)
                    if (f !== -1) {
                      this.transferData[d].memberlist[z].singleCheck = true
                    }
                  }
                  // 所有的全选按钮
                  var all1 = this.transferData[d].memberlist.map((val) => {
                    return val.singleCheck
                  }).indexOf(true)
                  if (all1 === -1) { // 全没有ture
                    this.transferData[d].checkAll = false
                    this.casaderIsAll = false
                  } else {
                    // 最少有一个true
                    var all2 = this.transferData[d].memberlist.map((val) => {
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
            this.transferData[i].checkAll = true
            for (var j = 0; j < this.transferData[i].memberlist.length; j++) {
              this.transferData[i].memberlist[j].singleCheck = true
              // 把选中的添加至右侧
              this.checkAllList.push(this.transferData[i].memberlist[j])
            }
          }
          // 去重
          this.checkDuplicateRemoval(this.checkAllList)
          // var obj = {}
          // this.checkAllList = this.checkAllList.reduce(function (item, next) {
          //   // eslint-disable-next-line no-unused-expressions
          //   obj[next.StudentID] ? '' : obj[next.StudentID] = true && item.push(next)
          //   return item
          // }, [])
        } else {
          for (var k = 0; k < this.transferData.length; k++) {
            this.transferData[k].checkAll = false
            for (var s = 0; s < this.transferData[k].memberlist.length; s++) {
              this.transferData[k].memberlist[s].singleCheck = false
              for (var m = 0; m < this.checkAllList.length; m++) {
                if (this.checkAllList[m].StudentID === this.transferData[k].memberlist[s].StudentID) {
                  this.checkAllList.splice(m, 1)
                }
              }
            }
          }
        }
      },

      handlecheckAll (item) { // 各个组内的全选按钮
        if (item.checkAll) {
          item.memberlist.map((val) => {
            val.singleCheck = true
            return val
          })
          for (var p = 0; p < this.transferData.length; p++) {
            for (var m = 0; m < this.transferData[p].memberlist.length; m++) {
              for (var q = 0; q < item.memberlist.length; q++) {
                if (this.transferData[p].memberlist[m].StudentID === item.memberlist[q].StudentID) {
                  this.transferData[p].memberlist[m].singleCheck = true
                }
              }
              // 把选中的添加至右侧
              if (this.transferData[p].memberlist[m].singleCheck) {
                this.checkAllList.push(this.transferData[p].memberlist[m])
              }
            }
            // 所有的全选按钮
            var isCheckAll = this.transferData[p].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (isCheckAll === -1) {
              this.transferData[p].checkAll = true
              this.casaderIsAll = true// 全选
            } else {
              this.transferData[p].checkAll = false
              this.casaderIsAll = false// 全选
            }
          }
          // 去重
          this.checkDuplicateRemoval(this.checkAllList)
          // var obj = {}
          // this.checkAllList = this.checkAllList.reduce(function (item, next) {
          //   // eslint-disable-next-line no-unused-expressions
          //   obj[next.StudentID] ? '' : obj[next.StudentID] = true && item.push(next)
          //   return item
          // }, [])
        } else {
          for (let p = 0; p < this.transferData.length; p++) {
            for (let q = 0; q < this.transferData[p].memberlist.length; q++) {
              var index2 = item.memberlist.map((val) => {
                return val.StudentID
              }).indexOf(this.transferData[p].memberlist[q].StudentID)
              if (index2 !== -1) {
                this.transferData[p].memberlist[q].singleCheck = false
              }
            }
            // 删除右侧
            for (var k = 0; k < item.memberlist.length; k++) {
              var index3 = this.checkAllList.map((val) => {
                return val.StudentID
              }).indexOf(item.memberlist[k].StudentID)
              if (index3 !== -1) {
                this.checkAllList.splice(index3, 1)
              }
            }
            // 所有的全选按钮
            var isCheckAll2 = this.transferData[p].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(true)
            if (isCheckAll2 === -1) { // 全没有ture
              this.transferData[p].checkAll = false
              this.casaderIsAll = false// 全选
            } else {
              // 最少有一个true
              var isCheckAll3 = this.transferData[p].memberlist.map((val) => {
                return val.singleCheck
              }).indexOf(false)
              if (isCheckAll3 === -1) {
                this.transferData[p].checkAll = true
                this.casaderIsAll = true// 全选
              } else {
                this.transferData[p].checkAll = false
                this.casaderIsAll = false// 全选
              }
            }
          }
        }
      },
      checkAllChange (child, item) { // 每个人的按钮
        if (child.singleCheck) {
          this.checkAllList.push(child)
          for (var i = 0; i < this.transferData.length; i++) {
            var mapIndex = this.transferData[i].memberlist.map((val) => {
              return val.StudentID
            }).indexOf(child.StudentID)
            if (mapIndex !== -1) {
              this.transferData[i].memberlist[mapIndex].singleCheck = true
            }
            // 组内全选按钮选中
            var is1 = this.transferData[i].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (is1 === -1) {
              this.transferData[i].checkAll = true
              this.casaderIsAll = true
            }
          }
        } else {
          var index1 = this.checkAllList.map((val) => {
            return val.StudentID
          }).indexOf(child.StudentID)
          this.checkAllList.splice(index1, 1)
          for (let i = 0; i < this.transferData.length; i++) {
            var mapIndex1 = this.transferData[i].memberlist.map((val) => {
              return val.StudentID
            }).indexOf(child.StudentID)
            if (mapIndex1 !== -1) {
              this.transferData[i].memberlist[mapIndex1].singleCheck = false
            }
            // 组内全选按钮是否选中
            var is2 = this.transferData[i].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(true)
            if (is2 === -1) { // 没有true
              this.transferData[i].checkAll = false
              this.casaderIsAll = false
            } else {
              // 最少有一个true
              var is3 = this.transferData[i].memberlist.map((val) => {
                return val.singleCheck
              }).indexOf(false)
              if (is3 === -1) {
                this.transferData[i].checkAll = true
                this.casaderIsAll = true
              } else {
                this.transferData[i].checkAll = false
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

        for (var i = 0; i < this.transferData.length; i++) {
          var mapIndex = this.transferData[i].memberlist.map((val) => {
            return val.UserID
          }).indexOf(name)
          if (mapIndex !== -1) {
            this.transferData[i].memberlist[mapIndex].singleCheck = false
          }

          // 组内全选按钮是否选中
          var is4 = this.transferData[i].memberlist.map((val) => {
            return val.singleCheck
          }).indexOf(true)
          if (is4 === -1) { // 没有true
            this.transferData[i].checkAll = false
            this.casaderIsAll = false
          } else {
            // 最少有一个true
            var is5 = this.transferData[i].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (is5 === -1) {
              this.transferData[i].checkAll = true
              this.casaderIsAll = true
            } else {
              this.transferData[i].checkAll = false
              this.casaderIsAll = false
            }
          }
        }
      },
      checkDuplicateRemoval (data) { // checkList去重
        this.checkAllList = this.checkAllList.reduce((pre, cur) => {
          if (!pre.includes(cur)) {
            return pre.concat(cur)
          } else {
            return pre
          }
        }, [])
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
