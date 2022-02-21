<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between">
      <div class="xy-flex xy-center">
        <div class="xy-flex xy-center">
          <label>校区：</label>
          <cascader :data="schoolData"
                    v-model="schoolSession"
                    :clearable="false"
                    class="fl"
                    @on-change="schoolChange"
                    style="margin-right: 10px"></cascader>
        </div>
        <div class="xy-flex xy-center">
          <label>学年/学期：</label>
          <cascader :data="yearSessionData"
                    v-model="yearSession"
                    :clearable="false"
                    class="fl"
                    @on-change="cascaderChange"
                    style="margin-right: 10px"></cascader>
        </div>
      </div>
    </div>
    <div class='xy-content-body'>
      <div class="left">
        <XyAntTable
          :rowSelection="tableRowSelection"
          :columns="columns"
          :dataSource="dataTable"
          :tableLoading="tableLoading"
          :isPage="false"
          :isScroll="true"
          :scrolly="true"
          :scrollx="'max-content'"
          >
          <div slot="IconRender" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${record.SexName === '女' ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.StudentName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <div slot="StudentName" slot-scope="text, record">
            <div style="min-width:100px">
              {{ record.StudentName}}
            </div>
          </div>
          <div slot="UserName" slot-scope="text, record">
            <div style="min-width:100px">
              {{ record.UserName}}
            </div>
          </div>
        </XyAntTable>
      </div>
      <div class="right">
        <div class="tree">
          <Tree v-if="isShow" :data="treeList"
                ref="treeRef"
                show-checkbox
                multiple></Tree>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="save">
      <Button class="xy-modal-primary"
              shape="circle"
              @click="save">保存</Button>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'studentMoralEdu',
    data () {
      return {
        isShow: true,
        ApplicationID: 0,
        ApplicationSubMenuID: 0,
        schoolData: [],
        schoolSession: [],
        yearSessionData: [],
        yearSession: [],
        columns: [
          {
            title: ' ',
            align: 'left',
            dataIndex: 'IconRender',
            width: 40,
            scopedSlots: { customRender: 'IconRender' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'StudentName',
            scopedSlots: { customRender: 'StudentName' }
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '得分',
            dataIndex: 'Score',
            width: 100
          }
        ],
        dataTable: [],
        scoreType: 0, // 打分方式
        defaultValue: 0,
        params: { isEdit: true },
        pickedArr: [], // 左侧选中的学生
        selectedRowKeys: [],
        tableLoading: true,
        treeList: [
          {
            title: '全选',
            expand: true,
            children: []
          }
        ],
        treeList1: [
          {
            title: '全选',
            expand: true,
            children: []
          }
        ],
        targetList: [] // 右侧选中的指标，只有最后一级
      }
    },
    created () {
      this.$nextTick(() => {
        this.getSchool()
      })
    },
    computed: {
      idArr () {
        return this.$store.state.common.menuId
      },
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record._disabled
            }
          })
        }
      }
    },
    watch: {
      idArr: {
        handler (val) {
          let idArr = val.split(',')
          this.applicationID = idArr[1]
          this.applicationSubMenuID = idArr[2]
        },
        immediate: true
      }
    },
    methods: {
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.pickedArr = val
      },
      // 获取校区
      async getSchool () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MoralProgramme/GetUserRangeClassPermissionNodeListByProgramme`, {
          Dimension: 1,
          ApplicationID: this.applicationID,
          ApplicationSubMenuID: this.applicationSubMenuID
        })
        if (res.success) {
          if (res.success) {
            this.schoolData = res.data
            if (res.data.length) {
              let index = this.schoolData.map((item) => {
                return item.IsCurrent
              }).indexOf(true)
              if (index !== -1) {
                this.schoolSession.push(this.schoolData[index].value)
                let index1 = this.schoolData[index].children.map((item) => {
                  return item.IsCurrent
                }).indexOf(true)
                if (index1 !== -1) {
                  this.schoolSession = [this.schoolData[index].value, this.schoolData[index].children[index1].value]
                } else {
                  this.schoolSession = [this.schoolData[index].value, this.schoolData[index].children[0].value]
                }
              } else {
                this.schoolSession = [
                  this.schoolData[0] ? this.schoolData[0].value : 0,
                  this.schoolData[0].children[0] ? this.schoolData[0].children[0].value : 0,
                  this.schoolData[0].children[0].children[0] ? this.schoolData[0].children[0].children[0].value : 0
                ]
              }
              this.getSessionNodeList()
            } else {
              this.tableLoading = false
              this.isShow = false
            }
          }
        }
      },
      schoolChange (value) {
        this.schoolSession = value
        this.getClass()
      },
      // 学年学期
      getSessionNodeList () {
        this.yearSessionData = []
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          if (res.success) {
            this.yearSessionData = this.yearSessionData.concat(res.data)
            this.yearSession = []
            let index = this.yearSessionData.map((item) => {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.yearSession.push(this.yearSessionData[index].value)
              let index1 = this.yearSessionData[index].children.map((item) => {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                this.yearSession = [this.yearSessionData[index].value, this.yearSessionData[index].children[index1].value]
              } else {
                this.yearSession = [this.yearSessionData[index].value, this.yearSessionData[index].children[0].value]
              }
            } else {
              if (this.yearSessionData.length && this.yearSessionData[0].children.length) {
                this.yearSession = [this.yearSessionData[0].value, this.yearSessionData[0].children[0].value]
              } else {
                this.yearSession = [0, 0]
              }
            }
            this.getClass()
          }
        })
      },
      cascaderChange (value) {
        this.yearSession = value
        this.getClass()
      },
      // 班级
      getClass () {
        let params = {
          SchoolDistrictID: this.schoolSession[0],
          StudentGradeForStudentYearID: this.schoolSession[1],
          StudentOrganizationId: this.schoolSession[2],
          AcademicYearID: this.yearSession[0],
          AcademicSessionID: this.yearSession[1]
        }
        this.tableLoading = true
        this.selectedRowKeys = []
        this.xy.get(`${this.$store.state.apiPath}/api/MoralScoreRecord/GetMoralStudentList`, params, {
          SchoolDistrictID: this.schoolSession[0],
          StudentGradeForStudentYearID: this.schoolSession[1],
          StudentOrganizationId: this.schoolSession[2],
          ApplicationID: this.applicationID,
          ApplicationSubMenuID: this.applicationSubMenuID
        }).then(res => {
          this.tableLoading = false
          if (res.success) {
            this.dataTable = res.data
            if (this.dataTable.length) {
              this.scoreType = res.data[0].ScoreType
              if (res.data[0].ScoreType === 0) {
                this.defaultValue = res.data[0].StarScore
              } else {
                this.defaultValue = res.data[0].Score
              }
              this.getClassIndex()
            } else {
              // 左侧没有学生数据，右侧指标项不展示
              this.isShow = false
            }
            if (this.scoreType === 1 && this.columns.length === 4) {
              this.columns.splice(3, 1, {
                title: '得星数',
                dataIndex: 'StarScore',
                width: 100
              }, {
                title: '得分',
                dataIndex: 'Score',
                width: 100
              })
            }
            if (this.scoreType === 0 && this.columns.length > 4) {
              this.columns.splice(3, 2, {
                title: '得分',
                dataIndex: 'Score',
                width: 100
              })
            }
          }
        })
      },
      getClassIndex () {
        this.isShow = false
        let params = {
          Dimension: 1,
          SchoolDistrictID: this.schoolSession[0],
          StudentGradeForStudentYearID: this.schoolSession[1],
          AcademicYearID: this.yearSession[0],
          AcademicSessionID: this.yearSession[1]
        }
        this.xy.get(`${this.$store.state.apiPath}/api/MoralScoreRecord/GetClassIndexManagementList`, params).then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.isShow = this.dataTable.length > 0
              this.treeList1[0].children = res.data.map(val => {
                val.title = val.label
                val.scoreType = this.scoreType
                val.defaultValue = val.scoredefault
                return {
                  title: val.label,
                  label: val.label,
                  value: val.value,
                  defaultValue: val.defaultValue,
                  scoremax: val.scoremax,
                  scoremin: val.scoremin,
                  expand: true,
                  children: val.children.length ? val.children.map(childVal => {
                    childVal.scoreType = val.scoreType
                    childVal.defaultValue = childVal.scoredefault
                    return {
                      label: childVal.label,
                      value: childVal.value,
                      scoreType: val.scoreType,
                      title: childVal.label,
                      defaultValue: childVal.defaultValue,
                      scoremax: childVal.scoremax,
                      scoremin: childVal.scoremin,
                      expand: true,
                      children: [],
                      render: this.render(childVal)
                    }
                  }) : [],
                  render: !val.children.length ? this.render(val) : (h, { root, node, data }) => {
                    return h('span', val.value)
                  }
                }
              })
              this.treeList[0].children = res.data.map(val => {
                val.title = val.label
                val.value = val.label
                val.scoreType = this.scoreType
                val.defaultValue = val.scoredefault
                return {
                  title: val.label,
                  label: val.label,
                  value: val.value,
                  defaultValue: val.defaultValue,
                  scoremax: val.scoremax,
                  scoremin: val.scoremin,
                  expand: true,
                  children: val.children.length ? val.children.map(childVal => {
                    childVal.scoreType = val.scoreType
                    childVal.defaultValue = childVal.scoredefault
                    return {
                      label: childVal.label,
                      value: childVal.value,
                      scoreType: val.scoreType,
                      title: childVal.label,
                      defaultValue: childVal.defaultValue,
                      scoremax: childVal.scoremax,
                      scoremin: childVal.scoremin,
                      expand: true,
                      children: [],
                      render: this.render(childVal)
                    }
                  }) : [],
                  render: !val.children.length ? this.render(val) : (h, { root, node, data }) => {
                    return h('span', val.value)
                  }
                }
              })
            }
          }
        })
      },
      render (vals) {
        return (h, { root, node, data }) => {
          return h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            }
          }, [
            h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '350px',
                display: 'inline-block'
              },
              domProps: {
                title: vals.label
              }
            }, `${vals.label}`),
            h('span', [
              h('Rate', {
                style: {
                  display: this.scoreType === 1 ? 'inline-block' : 'none',
                  marginRight: '8px',
                  marginLeft: '8px'
                },
                props: {
                  value: vals.defaultValue,
                  clearable: vals.scoremin === 0,
                  count: vals.scoremax
                },
                on: {
                  'on-change': (v) => {
                    data.defaultValue = v
                    data.checked = true
                  }
                }
              }),
              h('InputNumber', {
                style: {
                  display: this.scoreType === 0 ? 'inline-block' : 'none',
                  marginRight: '8px',
                  marginLeft: '8px'
                },
                props: {
                  value: vals.defaultValue,
                  min: vals.scoremin,
                  max: vals.scoremax,
                  precision: 0
                },
                on: {
                  'on-change': (v) => {
                    data.defaultValue = v
                    data.checked = true
                  }
                }
              })
            ])
          ])
        }
      },

      async save () {
        let checkTreeArr = this.$refs.treeRef.getCheckedNodes()
        this.targetList = checkTreeArr.filter(item => { return item.children.length === 0 })
        if (!this.pickedArr.length) { return this.xy.msgError('请选择需要保存的学生。') }
        if (!this.targetList.length) { return this.xy.msgError('请给选择学生的指标打分。') }
        let pickList = []
        let arr = this.pickedArr.concat([])
        for (var x = 0; x < arr.length; x++) {
          for (var y = 0; y < this.targetList.length; y++) {
            if (this.targetList[y].defaultValue === null) {
              this.xy.msgW('评价分值不可为空。')
              return
            }
            // 传入的值 解决第一级绑定值有问题
            if (isNaN(this.targetList[y].value)) {
              if (this.treeList1[0].children.length !== 0) {
                this.treeList1[0].children.forEach(item => {
                  if (item.title === this.targetList[y].value) {
                    this.targetList[y].value = item.value
                    return
                  }
                  if (item.children && item.children.length !== 0) {
                    item.children.forEach(item1 => {
                      if (item1.title === this.targetList[y].value) {
                        this.targetList[y].value = item1.value
                        return
                      }
                      if (item1.children && item1.children.length !== 0) {
                        item1.children.forEach(item2 => {
                          if (item2.title === this.targetList[y].value) {
                            this.targetList[y].value = item2.value
                          }
                        })
                      }
                    })
                  }
                })
              }
            }
            let aa = {}
            aa.IndexManagementID = this.targetList[y].value
            aa.Score = this.targetList[y].defaultValue
            aa.AcademicSessionID = arr[x].AcademicSessionID
            aa.AcademicSessionName = arr[x].AcademicSessionName
            aa.AcademicYearID = arr[x].AcademicYearID
            aa.AcademicYearName = arr[x].AcademicYearName
            aa.AccountID = arr[x].AccountID
            aa.Conversion = arr[x].Conversion
            aa.ConversionScore = arr[x].ConversionScore
            aa.IndicatorTypeID = arr[x].IndicatorTypeID
            aa.IsDelete = arr[x].IsDelete
            aa.LastDeleteByDate = arr[x].LastDeleteByDate
            aa.LastDeleteByID = arr[x].LastDeleteByID
            aa.ProgrammeID = arr[x].ProgrammeID
            aa.RecordDate = arr[x].RecordDate
            aa.RecordID = arr[x].RecordID
            aa.SchoolDistrictID = arr[x].SchoolDistrictID
            aa.SchoolDistrictName = arr[x].SchoolDistrictName
            aa.ScoreByID = arr[x].ScoreByID
            aa.ScoreDate = arr[x].ScoreDate
            aa.ScoreType = arr[x].ScoreType
            aa.StarScore = arr[x].StarScore
            aa.StudentGradeForStudentYearID = arr[x].StudentGradeForStudentYearID
            aa.StudentGradeID = arr[x].StudentGradeID
            aa.StudentGradeNameForStudentYearName = arr[x].StudentGradeNameForStudentYearName
            aa.StudentID = arr[x].StudentID
            aa.StudentName = arr[x].StudentName
            aa.StudentOrganizationId = arr[x].StudentOrganizationId
            aa.StudentOrganizationName = arr[x].StudentOrganizationName
            aa.StudentYearID = arr[x].StudentYearID
            aa.UserName = arr[x].UserName
            aa.WeekDay = arr[x].WeekDay
            pickList.push(aa)
          }
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MoralScoreRecord/SaveScoreRecodStudent`, {
          MoralEducationScoreRecordStudentList: pickList
        })
        if (res.success) {
          this.xy.msgSuc(res.msg || '保存成功。')
          this.treeList = [
            {
              title: '全选',
              expand: true,
              children: []
            }
          ]
          this.getClass()
          this.pickedArr = []
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-body {
  height: 100%;
  display: flex;
  padding-bottom: 80px;
  .left {
    width: 50%;
    /deep/ .xy-table .ivu-table th {
      height: 59px;
      border-top: 1px solid #dcdee2;
    }
  }
  .right {
    width: 50%;
    border-left: 1px solid #dcdee2;
    border-top: 1px solid #dcdee2;
    overflow-y: auto;
    .name {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      padding: 10px 10px 10px 0;
    }
    .tree {
      margin-left: 10px;
      height: 600px;
      padding-bottom: 150px;
    }
  }
}
.save {
  z-index:1;
  padding-right: 43px;
  height: 56px;
  position: fixed;
  line-height: 56px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: right;
}
</style>
