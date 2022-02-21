<template>
  <div>
    <div class="xy-content-body">
      <div class="clearfix"
           style="margin:10px 0;">
        <div class="fl">
          <Button class="xy-primary"
                  type="primary"
                  @click="getcheckStudentList"
                  :disabled="StepsHeader.isOperation != 0">
            <Icon type="ios-add"
                  size="20"
                  :color="StepsHeader.isOperation != 0?'#c5c8ce':'#fff'" />添加学生
          </Button>
          <Button class="xy-danger"
                  type="primary"
                  @click="delBatch"
                  :disabled="StepsHeader.isOperation != 0">批量删除</Button>
          <Button class="xy-danger"
                  type="primary"
                  @click="delAll"
                  :disabled="StepsHeader.isOperation != 0">全部删除</Button>
        </div>
        <div class="fr pr">
          <i-input search
                   clearable
                   v-model.trim="searchTopName"
                   @on-search="FromSubmit"
                   placeholder="请输入用户名/学籍号/姓名"
                   class="fr xy-content-title-search"
                   style="width: auto;">
            <icon type="ios-search cursor-p"
                  slot="suffix" />
          </i-input>
        </div>
      </div>
      <XyAntTable :rowSelection="tableRowSelection"
                  :columns="columnss"
                  :dataSource="dataTable"
                  :nullData="nullData"
                  :tableLoading="tableLoading"
                  :pagination="pagination"
                  @change="handleTableChange">
        <div slot="Icon"
             slot-scope="text, record">
          <div v-if="!record.HeadImg"
               :class="`head-con ${!record.Sex ? 'woman' : 'man'}`">
            <span class="head-font">
              {{ xy.showName(record.FullName)}}
            </span>
          </div>
          <img style="width:30px;height:30px;border-radius:50%"
               v-else
               :src="record.HeadImg + '?' + Math.random() * 15">
        </div>
        <div slot="FullName"
             slot-scope="text, record">
          <div style="min-width:220px">
            {{record.FullName}}
          </div>
        </div>
        <div slot="UserName"
             slot-scope="text, record">
          <div style="min-width:200px">
            {{record.UserName}}
          </div>
        </div>
        <div slot="StudentOrganizationName"
             slot-scope="text, record">
          <div style="min-width:200px">
            {{record.StudentOrganizationName}}
          </div>
        </div>
        <span slot="oprateRender"
              slot-scope="text, record">
          <a :disabled="StepsHeader.isOperation!==0"
             @click="delItem(record)">删除</a>
        </span>
      </XyAntTable>
    </div>
    <SelectStudent
                   :isShow="isShow"
                   :apiData="apiData"
                   @select-cancel="selectCancel"
                   @select-confirm="selectConfirm">
    </SelectStudent>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import SelectStudent from '@/pages/csmsTimeTable/components/selectStudent/CheckboxSelectStudent.vue'
  export default {
    components: {
      XyAntTable,
      SelectStudent
    },
    data () {
      return {
        noDataText: '该搜索条件下没有结果。',
        classPlan: {},
        StepsHeader: {},
        collectionID: 0,
        // 列表
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        searchTopName: '',
        pageList: 0, // 当前页数据条数
        selectionAll: [],
        dataTable: [],
        columnss: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 18,
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            scopedSlots: { customRender: 'FullName' }
          },
          {
            title: '用户名',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '行政班',
            scopedSlots: { customRender: 'StudentOrganizationName' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        // 添加班级
        isShow: false,
        apiData: {},
        schoolDistrictID: null,
        //= ==多选控件 start===
        treeEmptyText: '正在加载中...',
        clientWidth: 1600,
        loading: true,
        addPublic: false, // modal默认false
        casaderIsAll: false, // 全选
        searchName: '', // 搜索
        newList: [], // 左侧数据
        transferData: [], // 中间数据
        checkAllList: [], // 右侧数据
        checkAllList2: [],
        checkAllGroup: [], // 多选子集合
        fAlert: true, // 首次
        isShowSelectAll: true // 全选是否显示
      //= ==多选控件 end===
      }
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange
        }
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      this.collectionID = this.$store.state.common.menuInfo.collectionID
      this.StepsHeader.typeUrl = '/xyhome/administrativeStepHeader/administrativeClassList'
      this.getTP()
      this.getSchoolDistrictID() // 获取校区id
    },
    methods: {
      // 获取table/分页数据
      async getTP () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Collection/GetCollectionStudentList`, {
          collectionID: this.collectionID,
          name: this.searchTopName,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        })
        this.xy.unloading()
        if (res.success) {
          this.dataTable = res.data.data
          this.dataTable.map((item, index) => {
            this.$set(item, 'key', index)
          })
          this.pagination.total = res.data.totalRecords
          if (res.data.data.length === 0) {
            this.pageList = 0
          } else {
            this.pageList = res.data.data.length
          }
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.getTP()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      delItem (row) { // 删除
        if (this.StepsHeader.isOperation === 0) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除“' + row.FullName + '”吗？',
            onOk: () => {
              this.delItemHttp(row)
            }
          })
        }
      },
      async delItemHttp (row) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/DeleteCollectionStudent`, {
          ClassTableID: this.classPlan.classTableID,
          StudentID: row.StudentID,
          CollectionID: this.collectionID
        })
        this.xy.unloading()
        if (res.success) {
          if (this.pageList > 1) {
            this.pageList = this.pageList - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            };
          };
          this.xy.msgSuc('删除成功。')
          this.getTP()
        }
      },
      // 批量删除
      delBatch () {
        if (this.StepsHeader.isOperation === 0) {
          if (this.selectionAll.length > 0) {
            let studentIDs = ''
            for (let i = 0; i < this.selectionAll.length; i++) {
              studentIDs += this.selectionAll[i].StudentID + ','
            }
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除所有选中的学生吗？',
              onOk: () => {
                this.delBatchHttp(studentIDs)
              }
            })
          } else {
            this.xy.msgError('请选择要删除的学生。')
          }
        }
      },
      async delBatchHttp (studentIDs) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/DeleteCollectionStudentByIds`, {
          ClassTableID: this.classPlan.classTableID,
          StudentIDs: $.trim(studentIDs),
          CollectionID: this.collectionID
        })
        this.xy.unloading()
        if (res.success) {
          if (this.selectionAll.length === this.pageList && this.pagination.current > 1) {
            this.pagination.current = this.pagination.current - 1
          }
          this.selectionAll = []
          this.xy.msgSuc('删除成功。')
          this.getTP()
        }
      },
      // 全部删除
      delAll () {
        if (this.StepsHeader.isOperation === 0) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除全部学生吗？',
            onOk: () => {
              this.delAllHttp()
            }
          })
        }
      },
      async delAllHttp (studentIDs) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/DeleteAllCollectionStudent`, {
          ClassTableID: this.classPlan.classTableID,
          CollectionID: this.collectionID
        })
        this.xy.unloading()
        if (res.success) {
          this.pagination.current = 1
          this.xy.msgSuc('删除成功。')
          this.getTP()
        }
      },
      // 搜索
      FromSubmit () {
        this.selectionAll = []
        this.pagination.current = 1
        this.getTP()
      },
      async getSchoolDistrictID () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Collection/GetOrgAll`, {
          classTableID: this.classPlan.classTableID
        })
        if (res.success) {
          let dataList = res.data
          if (dataList.length > 0) {
            this.schoolDistrictID = dataList[0].SchoolDistrictID
          }
        }
      },
      // 获取已经添加过的学生
      getcheckStudentList () {
        this.apiData = {
          url: `${this.$store.state.apiPath}/api/Collection/GetAllCollectionStudent`,
          type: 'get',
          params: { classTableID: this.classPlan.classTableID }
        }
        this.checkAllList = []
        this.isShow = true
      },
      selectCancel () {
        this.checkAllList = []
        this.isShow = false
      },
      async selectConfirm (data) {
        this.xy.loading()
        this.checkAllList = [...data]
        let tutorArr = []
        for (let i = 0; i < this.checkAllList.length; i++) {
          tutorArr.push({
            ClassTableID: this.classPlan.classTableID,
            CollectionID: this.collectionID,
            StudentID: this.checkAllList[i].id,
            StudentOrganizationID: this.checkAllList[i].studentOrganizationID
          })
        };

        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Collection/CreateCollectionStudent`, tutorArr)
        if (res.success) {
          this.xy.msgSuc('添加成功。')
          this.getTP()
        }
        this.isShow = false
        this.xy.unloading()
      },
      //= =====多选弹出框 Start ======
      windowResize () {
        if ($(window).width() < 1366) {
          this.clientWidth = 1200
        } else if ($(window).width() < 1440) {
          this.clientWidth = 1300
        } else if ($(window).width() < 1688) {
          this.clientWidth = 1400
        } else {
          this.clientWidth = 1600
        };
      },
      openAddModal () {
        this.addPublic = true
        this.newList = []// 左侧滞空
        this.transferData = []// 中间滞空
        this.checkAllList = []// 右侧滞空
        this.treeEmptyText = '正在加载中...'
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/Collection/GetOrgAll`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let dataList = res.data
            if (dataList.length > 0) {
              for (let i = 0; i < dataList.length; i++) {
                this.newList.push({
                  value: dataList[i].SchoolDistrictID,
                  title: dataList[i].SchoolDistrictName,
                  level: 1,
                  children: []
                })
                if (dataList[i].YearList.length > 0) {
                  for (let j = 0; j < dataList[i].YearList.length; j++) {
                    this.newList[i].children.push({
                      value: dataList[i].YearList[j].StudentYearID,
                      title: dataList[i].YearList[j].StudentYearName,
                      schoolID: dataList[i].SchoolDistrictID,
                      level: 2,
                      children: []
                    })
                    if (dataList[i].YearList[j].GradeList.length > 0) {
                      for (let k = 0; k < dataList[i].YearList[j].GradeList.length; k++) {
                        this.newList[i].children[j].children.push({
                          value: dataList[i].YearList[j].GradeList[k].StudentGradeID,
                          title: dataList[i].YearList[j].GradeList[k].StudentGradeName,
                          level: 3,
                          children: []
                        })
                        if (dataList[i].YearList[j].GradeList[k].OrgList.length > 0) {
                          for (let m = 0; m < dataList[i].YearList[j].GradeList[k].OrgList.length; m++) {
                            this.newList[i].children[j].children[k].children.push({
                              value: dataList[i].YearList[j].GradeList[k].OrgList[m].StudentOrganizationID,
                              title: dataList[i].YearList[j].GradeList[k].OrgList[m].StudentOrganizationName,
                              schoolID: dataList[i].SchoolDistrictID,
                              studentYearID: dataList[i].YearList[j].StudentYearID,
                              studentGradeID: dataList[i].YearList[j].GradeList[k].StudentGradeID,
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
              };
            };
            if (this.newList.length === 0) {
              this.treeEmptyText = '学生树没有信息。'
            }
          }
        })
      },
      treeSelect (data) {
        if (data.length > 0) {
          this.fAlert = false// 首次

          if (data[0].level === 4) {
            let orgFullName = data[0].orgFullName
            this.xy.loading()
            this.xy.get(`${this.$store.state.apiPath}/api/Collection/GetCollectionStudent`, {
              schoolID: data[0].schoolID,
              studentYearID: data[0].studentYearID,
              studentGradeID: data[0].studentGradeID,
              studentOrganizationID: data[0].value,
              classTableID: this.classPlan.classTableID
            }).then(res => {
              this.xy.unloading()
              this.transferData = []
              if (res.success) {
                let resData = {}
                resData.memberlist = res.data
                resData.checkAll = false// 每一组的全选按钮
                resData.checkAllGroup = []// 每一组人集合
                resData.orgFullName = orgFullName
                if (resData.memberlist.length > 0) {
                  for (let j = 0; j < resData.memberlist.length; j++) {
                    resData.memberlist[j].singleCheck = false
                    resData.memberlist[j].StudentOrganizationID = data[0].value
                    resData.childNameStr += resData.memberlist[j].FullName + ',' + resData.memberlist[j].UserName + ',' + resData.memberlist[j].SchoolCardNumber + ','
                  };
                  this.transferData.push(resData)
                };
                // 根据右侧已选人改变渲染的初始数据
                if (this.checkAllList.length > 0) {
                  for (let d = 0; d < this.transferData.length; d++) {
                    for (let z = 0; z < this.transferData[d].memberlist.length; z++) {
                      let f = this.checkAllList.map((val) => {
                        return val.StudentID
                      }).indexOf(this.transferData[d].memberlist[z].StudentID)
                      if (f !== -1) {
                        this.transferData[d].memberlist[z].singleCheck = true
                      };
                    };
                    // 所有的全选按钮
                    let all1 = this.transferData[d].memberlist.map((val) => {
                      return val.singleCheck
                    }).indexOf(true)
                    if (all1 === -1) { // 全没有ture
                      this.transferData[d].checkAll = false
                      this.casaderIsAll = false
                    } else {
                      // 最少有一个true
                      let all2 = this.transferData[d].memberlist.map((val) => {
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
                };
              }
            })
          } else {
            this.transferData = []
          };
        };
      },
      checkAllBtn () { // 全选
        if (this.casaderIsAll) {
          for (let i = 0; i < this.transferData.length; i++) {
            this.transferData[i].checkAll = true
            for (let j = 0; j < this.transferData[i].memberlist.length; j++) {
              this.transferData[i].memberlist[j].singleCheck = true
              // 把选中的添加至右侧
              this.checkAllList.push(this.transferData[i].memberlist[j])
            };
          };
          // 去重
          this.checkDuplicateRemoval(this.checkAllList)
        } else {
          for (let k = 0; k < this.transferData.length; k++) {
            this.transferData[k].checkAll = false
            for (let s = 0; s < this.transferData[k].memberlist.length; s++) {
              this.transferData[k].memberlist[s].singleCheck = false
              for (let m = 0; m < this.checkAllList.length; m++) {
                if (this.checkAllList[m].StudentID === this.transferData[k].memberlist[s].StudentID) {
                  this.checkAllList.splice(m, 1)
                };
              };
            };
          };
        };
      },
      checkDuplicateRemoval (data) { // checkList去重
        this.checkAllList = this.checkAllList.reduce((pre, cur) => {
          if (!pre.includes(cur)) {
            return pre.concat(cur)
          } else {
            return pre
          }
        }, [])
      },
      handleCheckAll (item) { // 各个组内的全选按钮
        if (item.checkAll) {
          item.memberlist.map((val) => {
            val.singleCheck = true
            return val
          })
          for (let p = 0; p < this.transferData.length; p++) {
            for (let m = 0; m < this.transferData[p].memberlist.length; m++) {
              for (let q = 0; q < item.memberlist.length; q++) {
                if (this.transferData[p].memberlist[m].StudentID === item.memberlist[q].StudentID) {
                  this.transferData[p].memberlist[m].singleCheck = true
                };
              };
              // 把选中的添加至右侧
              if (this.transferData[p].memberlist[m].singleCheck) {
                this.checkAllList.push(this.transferData[p].memberlist[m])
              };
            };
            // 所有的全选按钮
            let isCheckAll = this.transferData[p].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (isCheckAll === -1) {
              this.transferData[p].checkAll = true
              this.casaderIsAll = true// 全选
            } else {
              this.transferData[p].checkAll = false
              this.casaderIsAll = false// 全选
            };
          };
          // 去重
          this.checkDuplicateRemoval(this.checkAllList)
        // let obj = {}
        // this.checkAllList = this.checkAllList.reduce((item, next) => {
        //   obj[next.StudentID] ? '' : obj[next.StudentID] = true && item.push(next)
        //   return item
        // }, [])
        } else {
          for (let p = 0; p < this.transferData.length; p++) {
            for (let q = 0; q < this.transferData[p].memberlist.length; q++) {
              let index2 = item.memberlist.map((val) => {
                return val.StudentID
              }).indexOf(this.transferData[p].memberlist[q].StudentID)
              if (index2 !== -1) {
                this.transferData[p].memberlist[q].singleCheck = false
              };
            };
            // 删除右侧
            for (let k = 0; k < item.memberlist.length; k++) {
              let index3 = this.checkAllList.map((val) => {
                return val.StudentID
              }).indexOf(item.memberlist[k].StudentID)
              if (index3 !== -1) {
                this.checkAllList.splice(index3, 1)
              };
            };
            // 所有的全选按钮
            let isCheckAll2 = this.transferData[p].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(true)
            if (isCheckAll2 === -1) { // 全没有ture
              this.transferData[p].checkAll = false
              this.casaderIsAll = false// 全选
            } else {
              // 最少有一个true
              let isCheckAll3 = this.transferData[p].memberlist.map((val) => {
                return val.singleCheck
              }).indexOf(false)
              if (isCheckAll3 === -1) {
                this.transferData[p].checkAll = true
                this.casaderIsAll = true// 全选
              } else {
                this.transferData[p].checkAll = false
                this.casaderIsAll = false// 全选
              };
            };
          };
        };
      },
      checkAllChange (child) { // 每个人的按钮
        if (child.singleCheck) {
          this.checkAllList.push(child)
          for (let i = 0; i < this.transferData.length; i++) {
            let mapIndex = this.transferData[i].memberlist.map((val) => {
              return val.StudentID
            }).indexOf(child.StudentID)
            if (mapIndex !== -1) {
              this.transferData[i].memberlist[mapIndex].singleCheck = true
            };
            // 组内全选按钮选中
            let is1 = this.transferData[i].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (is1 === -1) {
              this.transferData[i].checkAll = true
              this.casaderIsAll = true// 全选
            };
          };
        } else {
          let index1 = this.checkAllList.map((val) => {
            return val.StudentID
          }).indexOf(child.StudentID)
          this.checkAllList.splice(index1, 1)
          for (let i = 0; i < this.transferData.length; i++) {
            let mapIndex1 = this.transferData[i].memberlist.map((val) => {
              return val.StudentID
            }).indexOf(child.StudentID)
            if (mapIndex1 !== -1) {
              this.transferData[i].memberlist[mapIndex1].singleCheck = false
            };
            // 组内全选按钮是否选中
            let is2 = this.transferData[i].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(true)
            if (is2 === -1) { // 没有true
              this.transferData[i].checkAll = false
              this.casaderIsAll = false
            } else {
              // 最少有一个true
              let is3 = this.transferData[i].memberlist.map((val) => {
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
      },
      searchNameFun (vals) {
        this.searchName = vals
        if (vals !== '') {
          this.isShowSelectAll = false
        } else {
          this.isShowSelectAll = true
        }
      },
      handleClose (name) {
        for (let u = 0; u < this.checkAllList.length; u++) {
          if (this.checkAllList[u].StudentID === name.StudentID) { this.checkAllList.splice(u, 1) }
        };
        for (let i = 0; i < this.transferData.length; i++) {
          let mapIndex = this.transferData[i].memberlist.map((val) => {
            return val.StudentID
          }).indexOf(name.StudentID)
          if (mapIndex !== -1) {
            this.transferData[i].memberlist[mapIndex].singleCheck = false
          };
          // 组内全选按钮是否选中
          let is4 = this.transferData[i].memberlist.map((val) => {
            return val.singleCheck
          }).indexOf(true)
          if (is4 === -1) { // 没有true
            this.transferData[i].checkAll = false
            this.casaderIsAll = false// 全选
          } else {
            // 最少有一个true
            let is5 = this.transferData[i].memberlist.map((val) => {
              return val.singleCheck
            }).indexOf(false)
            if (is5 === -1) {
              this.transferData[i].checkAll = true
              this.casaderIsAll = true// 全选
            } else {
              this.transferData[i].checkAll = false
              this.casaderIsAll = false// 全选
            };
          };
        };
      },
      modalCancel () {
        this.checkAllGroup = []
        this.checkAllList = []// 右侧滞空
        this.newList = []// 左侧滞空
        this.transferData = []// 中间滞空
        this.fAlert = true
        this.casaderIsAll = false
        this.searchName = ''
        this.addPublic = false
      },
      modalAdd () {
        let tutorArr = []
        if (this.checkAllList.length > 0) {
          for (let i = 0; i < this.checkAllList.length; i++) {
            tutorArr.push({
              ClassTableID: this.classPlan.classTableID,
              CollectionID: this.collectionID,
              StudentID: this.checkAllList[i].StudentID,
              StudentOrganizationID: this.checkAllList[i].StudentOrganizationID
            })
          };
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/Collection/CreateCollectionStudent`, tutorArr).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('添加成功。')
              this.getTP()
            }
            this.isShowAddMember = false
          })
          this.addPublic = false
          this.newList = []// 左侧滞空
          this.transferData = []// 中间滞空
          this.checkAllGroup = []// 多选框滞空
          this.checkAllList = []// 右侧滞空
          this.fAlert = true
          this.casaderIsAll = false
          this.searchName = ''
        } else {
          this.xy.msgError('请先选择学生。')
          this.addPublic = true
        };
      }
    //= =====多选弹出框  End ======
    }
  }
</script>
<style lang="less" scoped>
.editor-student {
  padding: 0px 20px;
}

.handle-crile {
  cursor: pointer;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(237, 237, 237, 1);
  border-radius: 6px;
  display: inline-block;
}
.handle-crile:hover {
  border-color: #4196ff;
}

.handle-crile-active {
  border-color: #4196ff;
}

.edito-header {
  margin-bottom: 5px;
  margin-left: 10px;
  display: inline-block;
  cursor: pointer;
}

.edito-header > span {
  color: #c2c2c2;
  user-select: none;
}
.student-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.student-li {
  width: 20%;
  text-align: center;
}
.student-li .student-one {
  width: 94%;
  height: 210px;
  margin: 10px auto;
  text-align: left;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(242, 242, 242, 1);
  box-shadow: 0px 4px 12px 0px rgba(228, 228, 228, 0.5);
  border-radius: 4px;
  display: inline-block;
  padding: 30px 20px;
  position: relative;
  cursor: pointer;
}
/*.student-li:hover {
    border-color: #4196FF;
}*/
.student-li-active {
  border-color: #4196ff;
}

.handle-icon {
  position: absolute;
  top: 8px;
  right: 8px;
}

.student-info {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.student-li .crile {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 1);
  border-radius: 50%;
  display: inline-block;
  margin-right: 10px;
}

.first-crile {
  border: 2px solid rgba(182, 110, 248, 1);
}

.second-crile {
  border: 2px solid rgba(65, 150, 255, 1);
}

.three-crile {
  border: 2px solid rgba(253, 194, 93, 1);
}

.student-info .info1 {
  color: #999999;
  margin-right: 10px;
}

.edito-fotter {
  margin: 10px 0;
  text-align: right;
}
/*�༶*/
.class-content {
}
.class-header {
  margin-left: 25px;
  display: inline-block;
  cursor: pointer;
}
.class-header > span {
  color: #c2c2c2;
  user-select: none;
}
.class-body {
}
.class-ul {
}
.class-li {
  display: inline-block;
  width: 302px;
  height: 150px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(183, 183, 183, 0.5);
  border-radius: 4px;
  margin: 25px 32px;
  position: relative;
  padding: 36px 30px 20px;
}
.class-li .serial-number {
  width: 30px;
  height: 30px;
  line-height: 30px;
  background: rgba(238, 245, 255, 1);
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
  margin-right: 24px;
  display: inline-block;
  color: #4196ff;
  cursor: pointer;
}
.class-li .btn-group {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 43px;
  line-height: 43px;
  display: flex;
  align-items: center;
  background: #f9fafb;
  border-radius: 0 0 4px 4px;
}
.class-li .btn-group .group-one {
  width: 150px;
  text-align: center;
  color: #999999;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}
.class-li .btn-group .group-one:first-child:hover {
  color: #fda8a4;
}
.class-li .btn-group .group-one:last-child:hover {
  color: #4196ff;
}
.class-li .btn-group .group-one .ivu-icon {
  font-size: 18px;
  vertical-align: text-bottom;
}
.group-one-disabled {
  color: #ddd !important;
  cursor: no-drop !important;
}
.class-li .btn-group .group-one-disabled:first-child:hover {
  color: #ddd !important;
}

.class-li .btn-group .group-one-disabled:last-child:hover {
  color: #ddd !important;
}
.edito-ul {
  position: absolute;
  top: 32px;
  right: 10px;
  width: 72px;
  height: 69px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(183, 183, 183, 0.5);
  border-radius: 4px;
  z-index: 99;
}
.edito-ul li {
  color: rgba(102, 102, 102, 1);
  height: 34px;
  line-height: 34px;
  user-select: none;
}
.edito-ul li:hover {
  color: #4196ff;
}
/*ͨ��*/
.danger-btn {
  padding: 4px 15px;
  color: #4196ff;
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid #4196ff;
  white-space: nowrap;
  line-height: 1.5;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: 12px;
  border-radius: 4px;
  -webkit-transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, -webkit-box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, -webkit-box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear, -webkit-box-shadow 0.2s linear;
  background-color: #fff;
}

.danger-btn:hover {
  color: #ff8c8c;
  border: 1px solid #fdbbbb;
  background: #ffeced;
  text-decoration: none;
}

.danger-btn:active,
.danger-btn:focus {
  color: #2b85e4;
  background-color: #fff;
  border-color: #2b85e4;
  outline: 0;
}

.primary-btn {
  padding: 4px 15px;
  color: #fff;
  border: 1px solid #4196ff;
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  white-space: nowrap;
  line-height: 1.5;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: 12px;
  border-radius: 4px;
  -webkit-transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, -webkit-box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, -webkit-box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear, -webkit-box-shadow 0.2s linear;
  background: #4196ff;
}

.primary-btn:active,
.primary-btn:focus {
  outline: 0;
}

.primary-btn-ghost {
  padding: 4px 15px;
  color: #4196ff;
  border: 1px solid #4196ff;
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  white-space: nowrap;
  line-height: 1.5;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: 12px;
  border-radius: 4px;
  -webkit-transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, -webkit-box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, -webkit-box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear, -webkit-box-shadow 0.2s linear;
  background-color: #fff;
}

.primary-btn-ghost:hover {
  background: rgba(65, 150, 255, 0.1);
  text-decoration: none;
}

.primary-btn-ghost:active,
.primary-btn-ghost:focus {
  outline: 0;
}

.btn-disabled {
  background-color: #e9e9e9 !important;
  color: #999 !important;
  border: none;
  cursor: no-drop;
}

.btn-disabled:hover {
  background-color: #e9e9e9 !important;
  color: #999 !important;
  border: none;
  text-decoration: none;
}

.btn-disabled:active,
.btn-disabled:focus {
  background-color: #e9e9e9 !important;
  color: #999 !important;
  border: none;
  outline: 0;
}

.shape-circle {
  border-radius: 32px;
}

@media screen and (max-width: 1366px) {
  .student-li {
    /*margin: 10px 16px;*/
  }

  .class-li {
    margin: 9px;
  }
}
</style>
