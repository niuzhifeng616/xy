<!-- 2.选课结果 -->
<template>
  <div class="xy-content-body"
       id="StepsHeader">
    <div id="statisticalInfo">
      <div class="progress-title"
           id='statistical'>
        <div>
          <Button class="xy-primary"
                  @click="selectSub"
                  :disabled="smartDivideStepsHeader.isOperation != 0">引用选课
          </Button>
          <Button @click="courseStatistics"
                  style="margin-right:10px">选课统计</Button>
          <Button class="xy-danger"
                  @click="moreFun('8')"
                  :disabled="smartDivideStepsHeader.isOperation != 0">批量删除</Button>
          <dropdown @on-click="moreFun"
                    trigger="click">
            <Button class="xy-info">
              更多
              <icon type="ios-arrow-down"></icon>
            </Button>
            <dropdown-menu slot="list" class="menu-height">
              <dropdown-item name="1" :disabled="smartDivideStepsHeader.isOperation != 0">添加学生</dropdown-item>
              <dropdown-item name="2" :disabled="smartDivideStepsHeader.isOperation != 0">科目设置</dropdown-item>
              <dropdown-item name="3">学生分区</dropdown-item>
              <dropdown-item name="4">学生成绩</dropdown-item>
              <dropdown-item name="5" :disabled="smartDivideStepsHeader.isOperation != 0">导入选科结果</dropdown-item>
              <dropdown-item name="6">导出选科结果</dropdown-item>
              <dropdown-item name="7" :disabled="smartDivideStepsHeader.isOperation != 0">清除全部学生</dropdown-item>
            </dropdown-menu>
          </dropdown>
        </div>
        <!-- 已选未选班级 -->
        <div>
          <ButtonGroup style="margin-right: 15px;">
            <Button :class="selectNum===0?'xy-primary':''"
                    @click="loadComplete(0)">全部</Button>
            <Button :class="selectNum===1?'xy-primary':''"
                    @click="loadComplete(1)">已选完:{{total}}人</Button>
            <Button :class="selectNum===2?'xy-primary':''"
                    @click="loadComplete(2)">未选完:{{unTotal}}人
            </Button>
          </ButtonGroup>
          <Button class="xy-info"
                  @click="filterClass">筛选班级</Button>
          <a-input-search placeholder="请输入用户名/学籍号/姓名"
                    allowClear
                    v-model.trim="searchText"
                    @search='FromSubmit'
                    style="width: auto;"/>
        </div>
      </div>
      <div style="margin-bottom:10px ;"
           v-if='showClass.length>0'>
        <Alert show-icon
               closable>
          <span>已选择班级:</span>
          <span v-for="(i, index) in showClass"
                :key='index'>{{ i.StudentOrganizationFullName}}({{i.StuCount||0}}人){{index===showClass.length-1?'':'、'}}</span>。
        </Alert>
      </div>
      <div style="margin-bottom:10px ;"
           v-if='coursesData.length>0'>
        <Alert show-icon
               closable>
          <span> 选科统计（人）：</span>
          <span v-for='(i,index) in coursesData'
                :key='index'>{{i.DisciplineName}}({{i.StuCount||0}}人){{index===coursesData.length-1?'':'、'}}</span>。
        </Alert>
      </div>
      <!-- 表格 -->
      <select-countTable ref='countTable'></select-countTable>
      <!-- 筛选班级 -->
      <modal v-model="classModal"
             :transfer="false"
             title="筛选班级"
             :mask-closable="false"
             width=645>
        <div v-if='moreClassList.length>0'
             style="margin: 10px 0">
          <Checkbox :value="classCheckAll"
                    :indeterminate="indeterminate"
                    @click.prevent.native="chooseAll">全选</Checkbox>
          <checkbox-group class='filter-class'
                          v-model="classOrganizationIDs"
                          @on-change="checkAllGroupChange">
            <checkbox class="label-width"
                      :label="i.StudentOrganizationID"
                      :key='i.StudentOrganizationID'
                      v-for='i in moreClassList'
                      :title="`${i.StudentOrganizationFullName}(${i.StuCount||0}人)`">

              <span class="span-width"> {{i.StudentOrganizationFullName}}</span>
              <span> ({{i.StuCount||0}}人)</span>
            </checkbox>
          </checkbox-group>
        </div>
        <div v-else
             class="no-data-modal">
          <img src="@/assets/common/nullData.svg"
               alt="图片" />
          <p class="no-class">
            您还没有班级的信息，请添加班级。
          </p>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="cancel">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="sureSelectedClass">确定</Button>
        </div>
      </modal>
      <SelectStudent :isShow="addPublic"
                     :apiData="apiData"
                     @select-cancel="selectCancel"
                     @select-confirm="selectConfirm">
      </SelectStudent>
      <!-- 引用选课结果 -->
      <modal v-model="modalCreate"
             :transfer="false"
             title="引用选课结果"
             :loading="loading"
             :mask-closable="false">
        <div>
          <i-form ref="formValidateOK"
                  :model="formValidateOK"
                  :rules="ruleValidateOK"
                  :label-width="100">
            <form-item label="选课方案"
                       prop="planName">
              <i-select v-model="formValidateOK.planName"
                        placeholder="请选择选课方案"
                        style="width:350px">
                <i-option v-for="item in planlData"
                          :value="item.value"
                          :key="item.value"
                          :data-id='item.tvalue'>
                  {{ item.label }}</i-option>
              </i-select>
            </form-item>
          </i-form>
          <p class="prompt">更改引用的选课结果会清空此步骤之后的所有数据。</p>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="modalCreate = false">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="save">确定</Button>
        </div>
      </modal>
      <!-- 科目设置 -->
      <modal v-model="subjectSetModal"
             :transfer="false"
             title="科目设置"
             :loading="loading"
             :mask-closable="false"
             width='400'>
        <div class="subjectSetModal ">
          <Alert show-icon
                 closable>请勾选要设置的选科范围。</Alert>
          <div class="subjectSetCheckbox">
            <checkbox v-for='(t) in subjectSetData'
                      v-model='t.IsSelection'
                      :key='t.CoursePlanID'>
              {{t.DisciplineName}}
            </checkbox>
          </div>
          <p>提示：勾选或取消勾选科目会导致已有分班结果被重置，请勿随意变更。</p>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="subjectSetModal = false">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="subjectSetSave">确定</Button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
  import SelectCountTable from './SelectCountTable'
  import SelectStudent from '@/pages/csmsTimeTable/components/selectStudent/CheckboxSelectStudent.vue'
  export default {
    components: { SelectCountTable, SelectStudent },
    data () {
      return {
        selectedStudents: [],
        schoolDistrictIDGoClass: 0,
        delType: true,
        searchText: '',
        clearText: '',
        selectNum: 0,
        total: 0,
        unTotal: 0,
        collectionID: '',
        // 筛选班级
        indeterminate: false,
        classCheckAll: false,
        classOrganizationIDs: [],
        classModal: false,
        showClass: [],
        moreClassList: [],
        // 引用选课结果
        modalCreate: false,
        schoolData: [],
        studentGradeData: [],
        planlData: [],
        formValidateOK: {
          planName: ''
        },
        ruleValidateOK: {
          planName: [{
            type: 'number',
            required: true,
            message: '方案名称不能为空',
            trigger: 'change'
          }]
        },
        //= ==多选控件 start===
        loading: true,
        addPublic: false, // modal默认false
        checkAllList: [], // 右侧数据
        apiData: {}, // 已经添加过得学生
        //= ==多选控件 end===
        // 科目设置
        subjectSetModal: false,
        subjectSetData: [],
        coursesData: [],
        smartDivideStepsHeader: {},
        schoolDistrictID: 0
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent
      // this.schoolDistrictID = this.$parent.rowObj.SchoolDistrictID
      if (!this.smartDivideStepsHeader.isShowHeader) {
        this.smartDivideStepsHeader.isShowHeader = true
      }
      this.getClass()
      this.getCollectionID()
      this.getSubjectSetData()
    },
    mounted () {
      this.SelectCountTable = this.$refs.countTable // 获取子组件
    },

    methods: {
      selectSub () {
        if (this.smartDivideStepsHeader.isOperation === 0) {
          this.modalCreate = true
        }
      },
      getTotal () {
        this.total = this.SelectCountTable.SelectCount
        this.unTotal = this.SelectCountTable.UnSelectCount
        this.coursesData = this.SelectCountTable.disciplineList
        this.smartDivideStepsHeader.getGeneralFlows()
      },
      loadComplete (type) {
        this.selectNum = type
        this.searchText = ''
        this.SelectCountTable.pagination.current = 1
        this.SelectCountTable.getTable()
      },
      async getCollectionID () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetDivideClassInfo/?id=${this.smartDivideStepsHeader.divideClassID}`)
        if (res.success) {
          let result = res.data
          this.collectionID = result.CollectionID
          this.schoolDistrictIDGoClass = result.SchoolDistrictID
          this.getPlan()
        }
      },
      async getPlan () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgramme/GetLayeredSelectProgrammeListByID?schoolID=${this.schoolDistrictIDGoClass}&sgsyID=0`)
        if (res.success) {
          this.planlData = []
          if (res.data.length > 0) {
            res.data.map(item => {
              this.planlData.push({
                value: item.LayeredSelectProgrammeID,
                tvalue: item.LayeredSelectRotationID,
                label: item.LayeredSelectProgrammeName
              })
            })
            this.formValidateOK.planName = res.data[0].LayeredSelectProgrammeID
          } else {
            this.formValidateOK.planName = ''
          }
        }
      },
      // 获取所有的班级
      async getClass (isdel) {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetIDCOrganizationListByID/?id=${this.smartDivideStepsHeader.divideClassID}`)
        if (res.success) {
          if (res.data.length > 0) {
            this.moreClassList = res.data || []
            if (isdel === 'del') {
              let arr = this.moreClassList.map(item => item.StudentOrganizationID)
              if (this.classOrganizationIDs.length > 0) {
                this.classOrganizationIDs = this.classOrganizationIDs.filter(item => {
                  return arr.indexOf(item) !== -1
                })
                this.showClass = this.showClass.filter(item => {
                  return arr.indexOf(item.StudentOrganizationID) !== -1
                })
              }
              this.checkAllGroupChange(this.classOrganizationIDs)
            }
          }
        }
      },
      // 获取方案科目设置信息
      async getSubjectSetData () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetCourseplan/?id=${this.smartDivideStepsHeader.divideClassID}`)
        if (res.success) {
          this.subjectSetData = res.data
        }
      },
      FromSubmit () {
        this.SelectCountTable.pagination.current = 1
        this.SelectCountTable.searchText = this.searchText
        this.SelectCountTable.getTable()
      },

      save () {
        this.loading = true
        this.$refs.formValidateOK.validate((valid) => {
          if (!valid) {
            this.loading = false
          } else {
            this.reference()
          }
        })
      },
      // 引用选课
      async reference () {
        let RotationID = ''
        this.planlData.map((item) => {
          if (item.value === this.formValidateOK.planName) { RotationID = item.tvalue }
        })
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/QuoteLayeredSelectProgramme`, {
          layeredSelectProgrammeID: this.formValidateOK.planName,
          layeredSelectRotationID: RotationID,
          divideClassID: this.smartDivideStepsHeader.divideClassID
        })
        this.xy.unloading()
        if (res.success) {
          this.loading = false
          this.modalCreate = false
          this.xy.msgSuc('引用成功。')
          this.classOrganizationIDs = []
          this.SelectCountTable.pagination.current = 1
          this.SelectCountTable.getTable()
          this.smartDivideStepsHeader.getGeneralFlows()
        }
        this.loading = false
      },
      // 导出
      exportFile () {
        let ids = this.classOrganizationIDs.length > 0 ? this.classOrganizationIDs.join(',') : ''
        if (this.SelectCountTable.dataTable.length > 0) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/ExportSelectCourse`, {
            pageIndex: this.SelectCountTable.pagination.current,
            pageSize: this.SelectCountTable.pagination.pageSize,
            SeachText: this.searchText,
            StudentOrganizationIDS: ids,
            DivideClassID: this.smartDivideStepsHeader.divideClassID,
            Type: this.selectNum
          })
        } else {
          this.xy.msgError('暂无导出数据。')
        }
      },
      moreFun (res) {
        switch (res) {
          case '1':
            if (this.smartDivideStepsHeader.isOperation === 0) {
              this.getcheckStudentList()
            }
            break
          case '2': this.subjectSetModal = true; break
          case '3': {
            this.smartDivideStepsHeader.isShowHeader = false
            this.$router.push({ path: '/xyHome/smartStepsHeader/partition', query: this.$store.state.common.menuInfo })
            // this.smartDivideStepsHeader.typeName = '学生分区'
            this.smartDivideStepsHeader.typeUrl = '/xyHome/smartStepsHeader/smartSelectSubjectResult'
            break
          }
          case '4': {
            this.smartDivideStepsHeader.isShowHeader = false
            // this.smartDivideStepsHeader.typeName = '学生成绩'
            // this.$store.commit('common/getThreeMenuName', '学生成绩')
            this.$router.push({ path: '/xyHome/smartStepsHeader/smartStudentScore', query: this.$store.state.common.menuInfo })
            // this.smartDivideStepsHeader.typeUrl = '/xyHome/smartStepsHeader/smartSelectSubjectResult'
            break
          }
          case '5': this.courseSet(); break
          case '6': this.exportFile(); break
          case '7':
            if (this.smartDivideStepsHeader.isOperation === 0) {
              this.SelectCountTable.clearSubmit()
            }
            break
          case '8':
            if (this.smartDivideStepsHeader.isOperation === 0) {
              this.SelectCountTable.delAlls()
            }
            break
        }
      },
      async courseSet () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetCourseplan`, { id: this.smartDivideStepsHeader.divideClassID })
        if (res.success) {
          if (res.data.length > 0) {
            let status = res.data.some(item => item.IsSelection)
            if (!status) {
              this.xy.msgError('请先进行科目设置。')
            } else {
              this.SelectCountTable.batchImport()
            }
          } else {
            this.xy.msgError('请先进行科目设置。')
          }
        }
      },
      getcheckStudentList () {
        this.apiData = {
          url: `${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetIDCStudent`,
          type: 'get',
          params: { divideClassID: this.smartDivideStepsHeader.divideClassID }
        }
        this.checkAllList = []
        this.addPublic = true
      },
      selectCancel () {
        this.checkAllList = []
        this.addPublic = false
      },
      selectConfirm (data) {
        this.addPublic = false
        this.checkAllList = [...data]
        this.modalAdd()
      },
      async modalAdd () {
        let tutorArr = {
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          StudentIDS: []
        }
        tutorArr.StudentIDS = this.checkAllList.map(item => item.id)
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/CreateCollectionStudent`, tutorArr)
        if (res.success) {
          this.xy.msgSuc('添加成功。')
          // 清空筛选班级的条件
          this.showClass = []
          this.classOrganizationIDs = []
          this.classCheckAll = false
          this.indeterminate = false
          this.SelectCountTable.getTable()
          this.smartDivideStepsHeader.getGeneralFlows()
        }
        this.xy.unloading()
      },
      //= =====多选弹出框  End ======
      // ------------------------筛选班级start------------------------------------
      filterClass () {
        this.classOrganizationIDs = []
        this.showClass.map(item => {
          this.classOrganizationIDs.push(item.StudentOrganizationID)
        })
        this.checkAllGroupChange(this.classOrganizationIDs) // 改变全选的状态
        this.classModal = true
      },
      // 筛选班级
      sureSelectedClass () {
        this.showClass = []
        this.moreClassList.map((item) => {
          if (this.classOrganizationIDs.length > 0) {
            this.classOrganizationIDs.map((t) => {
              if (t === item.StudentOrganizationID) {
                this.showClass.push(item)
              }
            })
          }
        })
        this.classModal = false
        this.searchText = ''
        this.SelectCountTable.pagination.current = 1
        this.SelectCountTable.getTable()
      },
      cancel () {
        this.classModal = false
      },
      // 筛选班级-----------全选
      chooseAll (item, index) {
        if (this.indeterminate) {
          this.classCheckAll = false
        } else {
          this.classCheckAll = !this.classCheckAll
        }
        this.indeterminate = false
        if (this.classCheckAll) {
          let arr = []
          this.moreClassList.map((item) => {
            arr.push(item.StudentOrganizationID)
          })
          this.classOrganizationIDs = arr
        } else {
          this.classOrganizationIDs = []
        }
      },
      // 单个改变
      checkAllGroupChange (data) {
        if (data.length === this.moreClassList.length && this.moreClassList.length > 0) {
          this.indeterminate = false
          this.classCheckAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.classCheckAll = false
        } else {
          this.indeterminate = false
          this.classCheckAll = false
        }
      },
      // 科目设置
      async subjectSetSave () {
        this.loading = true
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/EditCourseplan`, {
          'DivideClassID': this.smartDivideStepsHeader.divideClassID,
          'Models': this.subjectSetData
        })
        if (res.success) {
          this.subjectSetModal = false
          this.getSubjectSetData()
          this.SelectCountTable.pagination.current = 1
          this.SelectCountTable.getTable()
        }
        this.loading = false
        this.xy.unloading()
      },
      courseStatistics () {
        this.$router.push({ path: '/xyHome/smartStepsHeader/SmartstatisticalAnalysis', query: this.$store.state.common.menuInfo })
        this.smartDivideStepsHeader.isShowHeader = false
        // this.smartDivideStepsHeader.typeName = '选课统计'
        this.smartDivideStepsHeader.typeUrl = '/xyHome/smartStepsHeader/smartSelectSubjectResult'
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../filterClass.less';
.progress-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  margin-bottom: 10px;
}
.prompt {
  color: #ed4014;
  margin-left: 100px;
}
.ivu-btn-group > .xy-primary {
  margin-right: 0;
}
.subjectSetCheckbox {
  margin-bottom: 10px;
  .ivu-checkbox-wrapper {
    padding: 5px 10px;
  }
}
.no-data-modal {
  display: flex;
  flex-direction: column;
  padding: 50px;
  .no-class {
    text-align: center;
    font-size: 16px;
    color: rgb(127, 127, 127);
    margin-top: 20px;
  }
}
// .filter-class {
//   margin-top: 10px;
//   max-height: 500px;
//   overflow: auto;
//   .label-width {
//     padding: 10px 0 10px 0;
//     min-width: 190px;
//     .span-width {
//       vertical-align: middle;
//       display: inline-block;
//       max-width: 110px;
//       overflow: hidden;
//       white-space: nowrap;
//       text-overflow: ellipsis;
//     }
//   }
// }
</style>
