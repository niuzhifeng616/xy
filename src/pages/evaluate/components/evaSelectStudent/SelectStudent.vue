<template>
  <Modal
    class="select-teacher-org"
    :styles="{top:'20px',width:'90%'}"
    :title="modalTitle"
    :transfer="false"
    :value="isShow"
    :mask-closable="false"
    :closable="false"
  >
    <div>
      <row class="cascader-content">
        <i-col span="6" class="cascader-content-left">
          <tree :data="newList" @on-select-change="treeSelect" class="tree-list"></tree>
        </i-col>
        <i-col span="11" class="cascader-content-center">
          <div class="cascader-content-center-title clearfix">
            <checkbox
              v-model="casaderIsAll"
              class="fl casader-is-all"
              @on-change="checkAllBtn"
              v-if="searchName===''"
            >全选</checkbox>
            <i-input
              search
              enter-button
              placeholder="请输入姓名/用户名"
              v-model.trim="searchName"
              class="fr casader-search"
              @on-search="searchNameFun"
            />
          </div>
          <alert v-if="fAlert" show-icon style="margin:0px 0px 20px;">
            温馨提示
            <icon type="ios-bulb-outline" slot="icon"></icon>
            <template slot="desc">点击左侧栏中的学生组织，从中间栏勾选学生，右侧栏显示已选中的学生</template>
          </alert>
          <alert
            v-if="transferData.length<1 && !fAlert"
            type="warning"
            show-icon
            style="margin:0px 0px 20px"
          >
            未查询到相关数据
            <template slot="desc">当前分组下暂无数据，请切换分组后重新查找</template>
          </alert>
          <div v-if="transferData.length>0">
            <div v-for="item in transferData" :key="item.Name">
              <div class="cascader-content-center-list">
                <div class="cascader-content-center-list-border">
                  <checkbox
                    v-model="item.checkAll"
                    v-if="searchName===''"
                    size="large"
                    :key="item.StudentOrganizationID"
                    @on-change="handleCheckAll(item)"
                  >{{item.Name}}</checkbox>
                  <span v-else>{{item.Name}}</span>
                </div>
                <template v-for="child in item.Children">
                  <checkbox
                    size="large"
                    :key="child.StudentID"
                    v-if="child.FullName.indexOf(searchName)>=0 || searchName=='' || child.UserName.indexOf(searchName)>=0"
                    v-model="child.singleCheck"
                    @on-change="checkAllChange(child)"
                    :title="child.UserName"
                    class="check-name"
                  >{{child.FullName}}</checkbox>
                </template>
              </div>
            </div>
          </div>
        </i-col>
        <i-col span="7" class="cascader-content-right">
          <div>
            已选
            <b>{{checkAllList.length}}</b>人
          </div>
          <div class="cascader-content-right-list">
            <tag
              v-for="item in checkAllList"
              :key="item.UserID"
              :name="item.UserID"
              closable
              @on-close="handleClose"
              :title="item.UserName"
            >{{item.FullName}}</tag>
          </div>
        </i-col>
      </row>
    </div>
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
      showOrgID: { // 创建活动是选择的校区id
        type: Number,
        default: 16305
      },
      ActivityCourseProjectID: { // 方案id
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        isLoadingShow: false, // modal加载动画
        casaderIsAll: false, // 全选
        searchName: '', // 搜索
        newList: [], // 左侧数据
        transferData: [], // 中间数据
        checkAllList: [], // 右侧数据
        checkAllList2: [],
        selectedStudentIds: [],
        checkAllGroup: [], // 多选子集合
        fAlert: true // 首次
      }
    },
    watch: {
      isShow (val) {
        if (val) {
          this.openAddModal()
        }
      },
      transferData (val) {
        if (val.length > 0) {
          let status = val.every(item => item.checkAll === true)
          this.casaderIsAll = status
        } else {
          this.casaderIsAll = false
        }
      }
    },
    methods: {
      modalCancel () {
        this.checkAllGroup = []
        this.checkAllList = [] // 右侧滞空
        this.newList = [] // 左侧滞空
        this.transferData = [] // 中间滞空
        this.fAlert = true
        this.casaderIsAll = false
        this.searchName = ''
        this.$emit('select-cancel')
      },
      modalConfirm () {
        if (this.checkAllList.length > 0) {
          this.$emit('select-confirm', this.checkAllList)
        } else {
          this.xy.msgError('请先选择学生')
        }
      },
      async openAddModal () {
        this.isLoadingShow = true
        this.newList = [] // 左侧滞空
        this.transferData = [] // 中间滞空
        this.checkAllList = [] // 右侧滞空
        this.xy.loading()
        let params = {
          isaddClass: false
        }
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetSchoolGardTree`, params, true)
        this.xy.unloading()
        if (res.success) {
          console.log(this.showOrgID, typeof (this.showOrgID), 111111)
          let dataList = res.data
          if (dataList.length > 0) {
            dataList = dataList.filter(item => {
              if (item.SchoolDistrictID === this.showOrgID) {
                return item
              }
            })
            for (let i = 0; i < dataList.length; i++) {
              this.newList.push({
                value: dataList[i].SchoolDistrictID,
                title: dataList[i].Name,
                level: 1,
                schoolDistrictID: dataList[i].SchoolDistrictID,
                studentGradeForStudentYearID: dataList[i].StudentGradeForStudentYearID,
                studentOrganizationID: dataList[i].StudentOrganizationID,
                children: []
              })
              if (dataList[i].Children.length > 0) {
                for (let j = 0; j < dataList[i].Children.length; j++) {
                  this.newList[i].children.push({
                    value: dataList[i].Children[j].StudentGradeForStudentYearID,
                    title: dataList[i].Children[j].Name,
                    level: 2,
                    schoolDistrictID: dataList[i].Children[j].SchoolDistrictID,
                    studentGradeForStudentYearID: dataList[i].Children[j].StudentGradeForStudentYearID,
                    studentOrganizationID: dataList[i].Children[j].StudentOrganizationID,
                    children: []
                  })
                  if (dataList[i].Children[j].Children.length > 0) {
                    for (let k = 0; k < dataList[i].Children[j].Children.length; k++) {
                      this.newList[i].children[j].children.push({
                        value: dataList[i].Children[j].Children[k].StudentOrganizationID,
                        title: dataList[i].Children[j].Children[k].Name,
                        schoolDistrictID: dataList[i].Children[j].SchoolDistrictID,
                        studentGradeForStudentYearID: dataList[i].Children[j].Children[k].StudentGradeForStudentYearID,
                        studentOrganizationID: dataList[i].Children[j].Children[k].StudentOrganizationID,
                        level: 3
                      })
                    }
                  }
                }
              }
            }

            this.treeShow = false
          }
          this.getcheckStudentList()
        } else {
          this.xy.msgError(res.msg)
        }
        this.isLoadingShow = false
      },
      async getcheckStudentList () {
        this.selectedStudentIds = []
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseStudent/GetStudentIDByProjectID?ActivityCourseProjectID=${this.ActivityCourseProjectID}`, null, true)
        this.xy.unloading()
        if (res.success) {
          res.data.map((item) => {
            this.selectedStudentIds.push({
              UserID: item
            })
          })
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async treeSelect (data) {
        if (data.length > 0) {
          this.fAlert = false // 首次
          this.isLoadingShow = true
          this.xy.loading()
          let params = {
            schoolDistrictID: data[0].schoolDistrictID,
            studentGradeID: 0,
            studentGradeForStudentYearID: data[0].studentGradeForStudentYearID,
            studentOrganizationID: data[0].studentOrganizationID
          }
          let res = await this.xy.get(`${this.xyApi}/xy/comm/GetStudentorganizationMemberByID`, params, true)
          this.xy.unloading()
          this.transferData = []
          if (res.success) {
            let resData = res.data
            let arr = []
            if (this.selectedStudentIds.length > 0) {
              this.selectedStudentIds.map((item) => {
                arr.push(item.UserID)
              })
            }
            if (resData.length > 0) { // 过滤已选课学生，不显示
              resData.map((item) => {
                for (let i = 0; i < item.Children.length; i++) {
                  if (arr.indexOf(item.Children[i].UserID) !== -1) {
                    item.Children.splice(i, 1)
                    i--
                  }
                }
              })
            }
            if (resData.length > 0) {
              resData.map((item) => {
                item.checkAll = false // 每一组的全选按钮
                item.checkAllGroup = [] // 每一组人集合
                item.Children.map(function (cItem) {
                  cItem.singleCheck = false
                  cItem.SchoolDistrictID = item.SchoolDistrictID
                  cItem.StudentGradeForStudentYearID = item.StudentGradeForStudentYearID
                  cItem.StudentGradeID = item.StudentGradeID
                  cItem.StudentOrganizationID = item.StudentOrganizationID
                  return cItem
                })
                return item
              })
              this.transferData = resData
              this.isLoadingShow = false
            };
            this.isLoadingShow = false
            // 根据右侧已选人改变渲染的初始数据
            if (this.checkAllList.length > 0) {
              for (let d = 0; d < this.transferData.length; d++) {
                for (let z = 0; z < this.transferData[d].Children.length; z++) {
                  let f = this.checkAllList.map((val) => {
                    return val.UserID
                  }).indexOf(this.transferData[d].Children[z].UserID)
                  if (f !== -1) {
                    this.transferData[d].Children[z].singleCheck = true
                  };
                };
                // 所有的全选按钮
                let all1 = this.transferData[d].Children.map((val) => {
                  return val.singleCheck
                }).indexOf(true)
                if (all1 === -1) { // 全没有ture
                  this.transferData[d].checkAll = false
                  this.casaderIsAll = false
                } else {
                  // 最少有一个true
                  let all2 = this.transferData[d].Children.map((val) => {
                    return val.singleCheck
                  }).indexOf(false)
                  if (all2 === -1) {
                    this.transferData[d].checkAll = true
                    this.casaderIsAll = true
                  } else {
                    this.transferData[d].checkAll = false
                    this.casaderIsAll = false
                  };
                };
              };
              this.casaderIsAll = this.transferData.every(item => item.checkAll === true)
            };
          } else {
            this.isLoadingShow = false
            this.xy.msgError(res.msg)
          }
        }
      },
      checkAllBtn () { // 全选
        if (this.casaderIsAll) {
          for (let i = 0; i < this.transferData.length; i++) {
            this.transferData[i].checkAll = true
            for (let j = 0; j < this.transferData[i].Children.length; j++) {
              this.transferData[i].Children[j].singleCheck = true
              // 把选中的添加至右侧
              this.checkAllList.push(this.transferData[i].Children[j])
            };
          };
          // 去重
          this.checkDuplicateRemoval(this.checkAllList)
        } else {
          for (let k = 0; k < this.transferData.length; k++) {
            this.transferData[k].checkAll = false
            for (let s = 0; s < this.transferData[k].Children.length; s++) {
              this.transferData[k].Children[s].singleCheck = false
              for (let m = 0; m < this.checkAllList.length; m++) {
                if (this.checkAllList[m].UserID === this.transferData[k].Children[s].UserID) {
                  this.checkAllList.splice(m, 1)
                };
              };
            };
          };
        };
      },
      handleCheckAll (item) { // 各个组内的全选按钮
        if (item.checkAll) {
          item.Children.map((val) => {
            val.singleCheck = true
            return val
          })
          for (let p = 0; p < this.transferData.length; p++) {
            for (let m = 0; m < this.transferData[p].Children.length; m++) {
              for (let q = 0; q < item.Children.length; q++) {
                if (this.transferData[p].Children[m].UserID === item.Children[q].UserID) {
                  this.transferData[p].Children[m].singleCheck = true
                };
              };
              // 把选中的添加至右侧
              if (this.transferData[p].Children[m].singleCheck) {
                this.checkAllList.push(this.transferData[p].Children[m])
              };
            };
            // 所有的全选按钮
            let isCheckAll = this.transferData[p].Children.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (isCheckAll === -1) {
              this.transferData[p].checkAll = true
              this.casaderIsAll = true // 全选
            } else {
              this.transferData[p].checkAll = false
              this.casaderIsAll = false // 全选
            };
          };
          // 去重
          this.checkDuplicateRemoval(this.checkAllList)
        } else {
          for (let p = 0; p < this.transferData.length; p++) {
            for (let q = 0; q < this.transferData[p].Children.length; q++) {
              let index2 = item.Children.map((val) => {
                return val.UserID
              }).indexOf(this.transferData[p].Children[q].UserID)
              if (index2 !== -1) {
                this.transferData[p].Children[q].singleCheck = false
              };
            };
            // 删除右侧
            for (let k = 0; k < item.Children.length; k++) {
              let index3 = this.checkAllList.map((val) => {
                return val.UserID
              }).indexOf(item.Children[k].UserID)
              if (index3 !== -1) {
                this.checkAllList.splice(index3, 1)
              };
            };
            // 所有的全选按钮
            let isCheckAll2 = this.transferData[p].Children.map((val) => {
              return val.singleCheck
            }).indexOf(true)
            if (isCheckAll2 === -1) { // 全没有ture
              this.transferData[p].checkAll = false
              this.casaderIsAll = false // 全选
            } else {
              // 最少有一个true
              let isCheckAll3 = this.transferData[p].Children.map((val) => {
                return val.singleCheck
              }).indexOf(false)
              if (isCheckAll3 === -1) {
                this.transferData[p].checkAll = true
                this.casaderIsAll = true // 全选
              } else {
                this.transferData[p].checkAll = false
                this.casaderIsAll = false // 全选
              };
            };
          };
        };
        this.casaderIsAll = this.transferData.every(item => item.checkAll === true)
      },
      checkAllChange (child) { // 每个人的按钮
        if (child.singleCheck) {
          this.checkAllList.push(child)
          for (let i = 0; i < this.transferData.length; i++) {
            let mapIndex = this.transferData[i].Children.map((val) => {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex !== -1) {
              this.transferData[i].Children[mapIndex].singleCheck = true
            };
            // 组内全选按钮选中
            let is1 = this.transferData[i].Children.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (is1 === -1) {
              this.transferData[i].checkAll = true
              // this.casaderIsAll = true // 全选
            }
          };
        } else {
          let index1 = this.checkAllList.map((val) => {
            return val.UserID
          }).indexOf(child.UserID)
          this.checkAllList.splice(index1, 1)
          for (let i = 0; i < this.transferData.length; i++) {
            let mapIndex1 = this.transferData[i].Children.map((val) => {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex1 !== -1) {
              this.transferData[i].Children[mapIndex1].singleCheck = false
            };
            // 组内全选按钮是否选中
            let is2 = this.transferData[i].Children.map((val) => {
              return val.singleCheck
            }).indexOf(true)
            if (is2 === -1) { // 没有true
              this.transferData[i].checkAll = false
              this.casaderIsAll = false
            } else {
              // 最少有一个true
              let is3 = this.transferData[i].Children.map((val) => {
                return val.singleCheck
              }).indexOf(false)
              if (is3 === -1) {
                this.transferData[i].checkAll = true
                this.casaderIsAll = true
              } else {
                this.transferData[i].checkAll = false
                this.casaderIsAll = false
              };
            };
          };
        };
        this.casaderIsAll = this.transferData.every(item => item.checkAll === true)
      },
      searchNameFun (vals) {
        this.searchName = vals
      },
      handleClose (e, name) {
        for (let u = 0; u < this.checkAllList.length; u++) {
          if (this.checkAllList[u].UserID === name) { this.checkAllList.splice(u, 1) }
        };
        for (let i = 0; i < this.transferData.length; i++) {
          let mapIndex = this.transferData[i].Children.map((val) => {
            return val.UserID
          }).indexOf(name)
          if (mapIndex !== -1) {
            this.transferData[i].Children[mapIndex].singleCheck = false
          };
          // 组内全选按钮是否选中
          let is4 = this.transferData[i].Children.map((val) => {
            return val.singleCheck
          }).indexOf(true)
          if (is4 === -1) { // 没有true
            this.transferData[i].checkAll = false
            this.casaderIsAll = false
          } else {
            // 最少有一个true
            let is5 = this.transferData[i].Children.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (is5 === -1) {
              this.transferData[i].checkAll = true
              this.casaderIsAll = true
            } else {
              this.transferData[i].checkAll = false
              this.casaderIsAll = false
            };
          };
        };
        if (this.transferData.length > 0) {
          this.casaderIsAll = this.transferData.every(item => item.checkAll === true)
        }
      },
      checkDuplicateRemoval (data) { // checkList去重
        let obj = {}
        this.checkAllList = this.checkAllList.reduce((pre, next) => {
          // eslint-disable-next-line no-unused-expressions
          obj[next.UserID] ? '' : obj[next.UserID] = true && pre.push(next)
          return pre
        }, [])
        // this.checkAllList = this.checkAllList.reduce((pre, cur) => {
        //   if (!pre.includes(cur)) {
        //     return pre.concat(cur)
        //   } else {
        //     return pre
        //   }
        // }, [])
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
