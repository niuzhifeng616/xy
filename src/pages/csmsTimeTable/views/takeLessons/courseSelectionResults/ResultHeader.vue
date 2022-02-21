<template>
  <!-- 12.选课结果 -->
  <div class="xy-content-body">
      <row>
          <i-col span="8">
              <Button class="xy-primary" @click="exportResult" v-if="isShwoExport">导出</Button>
              <dropdown @on-click="dropdownChange" trigger="click">
                  <Button class="xy-info">
                      更多
                      <icon type="ios-arrow-down"></icon>
                  </Button>
                  <dropdown-menu slot="list">
                      <dropdown-item :name="0">查看剩余班额</dropdown-item>
                      <dropdown-item :name="1" :disabled="isOperation !== 0">删除不开班课程</dropdown-item>
                      <dropdown-item :name="2" :disabled="isOperation !== 0">清除选课结果</dropdown-item>
                  </dropdown-menu>
              </dropdown>
          </i-col>
          <i-col span="8" class="text-center result-header">
              <button-group>
                  <Button :class="selectNum === 0?'xy-primary':''" :ghost="selectNum === 0" @click="loadComplete" style="margin-right:0">
                      已选完:<span >{{selectedPerson}}</span>人
                  </Button>
                  <Button :class="selectNum === 1?'xy-primary':''" :ghost="selectNum === 1" @click="loadUnComplete" style="margin-right:0">
                      未选完:<span >{{notPersonNum}}</span>人
                  </Button>
              </button-group>
          </i-col>
          <i-col span="8" class="text-right">
              <span class="xy-searchSelect" v-if="selectClassShow" @click="openClassModal" >{{classNameList}}</span>
              <Input search
              clearable
                      v-model.trim="searchName"
                      @on-search="FromSubmit"
                      :placeholder="placeholderStr"
                      class="fr xy-content-title-search"
                      style="width: auto;" />
          </i-col>
      </row>
      <!-- 单选框 -->
      <div style="margin:15px 0;">
          <radio-group v-model="radioVal" v-if="selectNum === 0" @on-change="radioChange">
              <radio label="1"><span>按学生</span></radio>
              <radio label="2"><span>按课程</span></radio>
          </radio-group>
      </div>

      <!--选择班级 -->
      <Modal v-model="modalSelectClass"
            title="筛选班级"
            :transfer="false"
            :mask-closable="false"
            :closable="false">
          <div style="max-height:500px;overflow:auto;">
              <div class="selectClassModal" v-if="checkAllGroupData.length > 0">
                  <checkbox v-model="checkAll"
                            @on-change="handleCheckAll"
                            style="margin-bottom:10px;">全选</checkbox>
                  <checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange">
                      <checkbox :label="item.StudentOrganizationID" style="display:block;margin-bottom:10px;"
                                v-for="item in checkAllGroupData"
                                :key="item.StudentOrganizationID" >{{item.StudentOrganizationName}}</checkbox>
                  </checkbox-group>
              </div>
              <div v-else class="modal-null">
                  <img class="img" :src="require('@/assets/common/nullData.svg')" alt="" />
                  <span class="text">
                      暂无班级信息。
                  </span>
              </div>
          </div>
          <div slot="footer">
            <Button v-if="checkAllGroupData.length > 0" class="xy-modal-close" @click="modalSelectClass = false">取消</Button>
            <Button v-else class="xy-modal-primary" shape="circle" @click="modalSelectClass = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" v-if="checkAllGroupData.length > 0" @click="selectClassSubmit">确定</Button>
          </div>
      </Modal>
      <!--清除选课结果 -->
      <Modal v-model="modalClearAll"
            title="清除选课结果"
            :transfer="false"
            :mask-closable="false"
            :closable="false">
          <div>
              <!-- <Alert show-icon closable>如果不保留必选课程结果，请务必重新生成选课数据，否则不保证必选课正确。</Alert> -->
              <div style="margin-bottom:15px">
                  <!-- 0 false 1 true -->
                  <radio-group v-model="subjectBoxRadio">
                      <radio :label="1">
                          <span class="f14">保留必选课程结果</span>
                      </radio>
                      <radio :label="0">
                          <span class="f14">不保留必选课程结果</span>
                      </radio>
                  </radio-group>
              </div>
              <Input v-model="delTopText" placeholder="请输入“删除”" />
          </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="modalClearAll = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="submitClearAll">确定</Button>
          </div>
      </Modal>

      <!-- 选课结果-删除不开班课程 -->
      <del-no-class v-if="curPage === 'DNC'"
        ref="delNoClass"
        :isOperation="isOperation"
        :classTableID="classTableID"
        :searchName="searchName"></del-no-class>

      <!-- 选课结果-查看剩余班额 -->
      <remaining-classes v-if="curPage === 'RC'"
        ref="remainingClasses"
        :isOperation="isOperation"
        :classTableID="classTableID"
        :searchName="searchName"></remaining-classes>

      <!-- 选课结果-未选 -->
      <un-select-student v-if="curPage === 'UnSelect'"
        ref="unSelectStudent"
        :isOperation="isOperation"
        :classTableID="classTableID"
        :searchName="searchName"
        :selectNum="selectNum"
        :loadAdjust="loadAdjust"
        :studentOrganizationIDs="studentOrganizationIDs"
        :groupOrSimple="groupOrSimple"
        @unSelectStudentChange = "unSelectStudentChange"></un-select-student>

      <!-- 选课结果-已选 -->
      <select-student v-if="curPage === 'Select'"
        ref="selectStudent"
        :isOperation="isOperation"
        :classTableID="classTableID"
        :radioVal="radioVal"
        :searchName="searchName"
        :selectNum="selectNum"
        :loadAdjust="loadAdjust"
        :studentOrganizationIDs="studentOrganizationIDs"
        :groupOrSimple="groupOrSimple"
        @selectStudentChange = "selectStudentChange"></select-student>
  </div>
</template>
<script>
  import DelNoClass from './DelNoClass'
  import RemainingClasses from './RemainingClasses'
  import UnSelectStudent from './UnSelectStudent'
  import SelectStudent from './SelectStudent'

  export default {
    name: 'TLcourseSeleResultHeader',
    components: {
      DelNoClass,
      RemainingClasses,
      UnSelectStudent,
      SelectStudent
    },
    data () {
      return {
        curPage: 'RC', // 当前页面

        modalSelectClass: false,
        groupOrSimple: true, // 分组模式true，简单模式false
        radioVal: '1',
        searchName: '',
        isShwoExport: true, // 是否显示导出
        selectedPerson: 0, // 已选人数
        notPersonNum: 0, // 未选人数
        gradeList: [],
        checkAllGroup: [],
        checkAllGroupData: [],
        classNameList: '所有班级',
        studentOrganizationIDs: '',
        checkAll: true,
        selectNum: 0, // 是否已选和未选
        selectClassShow: true, // 是否显示选择班级
        placeholderStr: '请输入用户名/学籍号/姓名',
        // 清除选课结果
        modalClearAll: false,
        subjectBoxRadio: 1,
        delTopText: '',
        // 选课结果跳转过来的
        loadAdjust: '',

        isOperation: true,
        classTableID: 0
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.rowObj.ClassTableID
      this.isShowHeader = true

      // 在线选课选课结果返回时，返回至第一步骤，再次跳转至此处
      if (this.$store.state.csmstimetable.takeLessonsGoSelectResult.classTableID > 0) {
        this.classTableID = this.$store.state.csmstimetable.takeLessonsGoSelectResult.classTableID
        this.loadAdjust = JSON.parse(this.$store.state.csmstimetable.takeLessonsGoSelectResult.loadAdjust)
        this.selectNum = this.loadAdjust.selectNum
        this.radioVal = this.loadAdjust.radioVal
        // this.searchName = this.loadAdjust.searchName
        // this.studentOrganizationIDs = this.loadAdjust.studentOrganizationIDs
        // this.groupOrSimple = this.loadAdjust.groupOrSimple

        this.$store.commit('csmstimetable/setTakeLessonsGoSelectResult', {}) // 置空
      }

      if (this.selectNum === 0) {
        this.loadComplete()
      } else if (this.selectNum === 1) {
        this.loadUnComplete()
      }
    },
    mounted () {
      // this.getClass()
      this.getModel()
    },
    methods: {
      // 选课模式
      async getModel () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/GetSchoolBasedGrabSubjectSettingGroupSelectCourseMode`, {
          classTableID: this.classTableID
        })
        if (res.success) {
          let resData = res.data.SelectCourseMode
          if (resData > 0) {
            this.groupOrSimple = true
          } else {
            this.groupOrSimple = false
          }
        }
      },
      // 获取班级List数据
      async getClass () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetStudentOrganization`, {
          classTableID: this.classTableID
        })
        if (res.success) {
          this.gradeList = res.data
          this.checkAllGroupData = res.data
          this.checkAllGroup = []
          for (let i = 0; i < res.data.length; i++) {
            this.checkAllGroup.push(res.data[i].StudentOrganizationID)
          }
          if (this.loadAdjust !== '') { // 调整页面过来
            if (this.studentOrganizationIDs !== '') {
              this.checkAllGroup = this.studentOrganizationIDs.split(',')
            }
            if (this.checkAllGroup.length === this.checkAllGroupData.length) {
              this.checkAll = true
              this.classNameList = '所有班级'
            } else {
              this.classNameList = ''
              this.checkAll = false
              for (let i = 0; i < this.checkAllGroup.length; i++) {
                this.checkAllGroup[i] = Number(this.checkAllGroup[i])
                for (let j = 0; j < this.checkAllGroupData.length; j++) {
                  if (this.checkAllGroup[i] === this.checkAllGroupData[j].StudentOrganizationID) {
                    if (this.checkAllGroup.length === 1) {
                      this.classNameList += this.checkAllGroupData[j].StudentOrganizationName
                    } else {
                      this.classNameList += this.checkAllGroupData[j].StudentOrganizationName + ','
                    }
                  }
                }
              }
            }
            this.loadAdjust = ''
          }
        }
      },
      openClassModal () {
        if (this.studentOrganizationIDs === 0 || this.studentOrganizationIDs === '') {
          this.checkAllGroup = []
          for (let i = 0; i < this.checkAllGroupData.length; i++) {
            this.checkAllGroup.push(this.checkAllGroupData[i].StudentOrganizationID)
          };
          this.checkAll = true
          this.classNameList = '所有班级'
        } else {
          this.checkAllGroup = this.studentOrganizationIDs.split(',')
          for (let i = 0; i < this.checkAllGroup.length; i++) {
            this.checkAllGroup[i] = Number(this.checkAllGroup[i])
          }
        }

        this.modalSelectClass = true
      },
      // 全选
      handleCheckAll (val) {
        if (val) {
          this.checkAllGroup = []
          for (let k = 0; k < this.checkAllGroupData.length; k++) {
            this.checkAllGroup.push(this.checkAllGroupData[k].StudentOrganizationID)
          };
          this.checkAll = true
          this.classNameList = '所有班级'
        } else {
          this.checkAllGroup = []
          this.checkAll = false
        }
        this.studentOrganizationIDs = this.checkAllGroup.join(',')
      },
      checkAllGroupChange (data) {
        if (data.length === this.checkAllGroupData.length) {
          this.checkAll = true
        } else {
          this.checkAll = false
        }
      },
      selectClassSubmit () {
        if (this.checkAllGroup.length > 0) {
          if (this.checkAllGroup.length === this.checkAllGroupData.length) {
            this.checkAll = true
            this.classNameList = '所有班级'
          } else {
            this.classNameList = ''
            for (let i = 0; i < this.checkAllGroup.length; i++) {
              for (let j = 0; j < this.checkAllGroupData.length; j++) {
                if (this.checkAllGroup[i] === this.checkAllGroupData[j].StudentOrganizationID) {
                  if (this.checkAllGroup.length === 1) {
                    this.classNameList += this.checkAllGroupData[j].StudentOrganizationName
                  } else {
                    this.classNameList += this.checkAllGroupData[j].StudentOrganizationName + ','
                  }
                }
              }
            };
          }
          // this.classNameList = xy.string.trim(this.classNameList, ',')
          this.classNameList = $.trim(this.classNameList, ',')
          this.studentOrganizationIDs = this.checkAllGroup.join(',')
          if (this.selectNum === 0) {
            if (this.radioVal === '1') {
              this.$nextTick(() => {
                this.$refs.selectStudent.pagination.current = 1
                this.$refs.selectStudent.getStudent()
              })
            }
          }
          if (this.selectNum === 1) {
            this.$nextTick(() => {
              this.$refs.unSelectStudent.pagination.current = 1
              this.$refs.unSelectStudent.getTP()
            })
          }
          this.modalSelectClass = false
        } else {
          this.xy.msgError('请选择您要筛选的班级。')
        }
      },
      // 用户名、姓名搜索
      FromSubmit () {
        if (this.selectNum === 0) {
          if (this.radioVal === '1') {
            this.$refs.selectStudent.pagination.current = 1
            this.$refs.selectStudent.getStudent()
          } else {
            this.$refs.selectStudent.pageCurrentCourse = 1
            this.$refs.selectStudent.getCourse()
          }
        };
        if (this.selectNum === 1) {
          this.$refs.unSelectStudent.pagination.current = 1
          this.$refs.unSelectStudent.getTP()
        };
        if (this.selectNum === 2) {
          this.$refs.remainingClasses.getAllSelectList('')
        };
        if (this.selectNum === 3) {
          this.$refs.delNoClass.getAllSelectList('')
        };
      },
      // 更多
      dropdownChange (val) {
        if (val === 0) { // 查看剩余班额
          this.placeholderStr = '课程名称'
          this.selectNum = 2
          this.searchName = ''
          this.isShwoExport = true
          this.selectClassShow = false

          // 展示RemainingClasses页面
          this.curPage = 'RC'
        };
        if (val === 1) { // 删除不开班课程
          if (this.isOperation === 0) {
            this.placeholderStr = '课程名称'
            this.selectNum = 3
            this.searchName = ''
            this.isShwoExport = false
            this.selectClassShow = false

            // 展示DelNoClass页面
            this.curPage = 'DNC'
          }
        };
        if (val === 2) { // 清除选课结果
          if (this.isOperation === 0) {
            this.modalClearAll = true
          }
        };
      },
      // 清除选课结果
      async submitClearAll () {
        if (this.delTopText === '删除') {
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectSchoolBasedSelectSubject/ClearStudentElective`, {
            ClassTableID: this.classTableID,
            IsRetainMustClass: this.subjectBoxRadio
          })
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.modalClearAll = false
            if (this.selectNum === 0) {
              this.$refs.selectStudent.getStudent()
              this.$refs.SelectStudent.getTP()
            };
            if (this.selectNum === 1) {
              this.$refs.selectStudent.getStudent()
              this.$refs.unSelectStudent.getTP()
            };
            if (this.selectNum === 2) {
              this.$refs.remainingClasses.getAllSelectList('')
            };
            if (this.selectNum === 3) {
              this.$refs.delNoClass.getAllSelectList('')
            };
          }
        } else {
          this.xy.msgError('请输入"删除"。')
        };
      },
      // 已选
      loadComplete () {
        if (this.loadAdjust === '') {
          this.searchName = ''
          // 班级信息置空
          this.classNameList = '所有班级'
          this.checkAll = false
          this.checkAllGroup = []
          this.checkAllGroupData = []
          this.studentOrganizationIDs = ''
        }
        this.placeholderStr = '请输入用户名/学籍号/姓名'
        this.selectNum = 0
        this.radioVal = '1'
        this.isShwoExport = true

        // 展示SelectStudent页面  pageCurrent: this.loadAdjust.pageCurrent, total: this.loadAdjust.total
        this.curPage = 'Select'
      },
      // 未选
      loadUnComplete () {
        this.selectNum = 1
        if (this.loadAdjust === '') {
          this.searchName = ''
          // 班级信息置空
          this.classNameList = '所有班级'
          this.checkAll = false
          this.checkAllGroup = []
          this.checkAllGroupData = []
          this.studentOrganizationIDs = ''
        }
        this.placeholderStr = '请输入用户名/学籍号/姓名'
        this.selectClassShow = true
        this.isShwoExport = true

        // 展示UnSelectStudent页面  pageCurrent: this.loadAdjust.pageCurrent, total: this.loadAdjust.total
        this.curPage = 'UnSelect'
      },
      // radio选择
      radioChange (num) {
        if (this.radioVal === '1') { // 按学生
          this.placeholderStr = '请输入用户名/学籍号/姓名'
          this.selectClassShow = true
          this.$refs.selectStudent.pagination.current = 1
          this.$refs.selectStudent.getStudent() // 可以修改为子组件监听radioVal的变化，值为1/2时刷新当前子组件页面
        } else { // 安课程
          this.placeholderStr = '课程名称'
          this.selectClassShow = false
          this.$refs.selectStudent.pageCurrentCourse = 1
          this.$refs.selectStudent.getCourse()
        }
      },
      // 导出
      exportResult () {
        // selectNum 0:已选完
        if (this.selectNum === 0) {
          if (this.radioVal === '1') {
            // radioVal 1:按学生
            this.xy.downFile(`${this.$store.state.apiPath}/api/SchoolBasedGrabStudentSelectCourse/ExportStudentSelectCourse`, {
              classTableID: this.classTableID,
              pageIndex: this.$refs.selectStudent.pagination.current,
              pageSize: this.$refs.selectStudent.pagination.pageSize,
              isComplete: true,
              organizationIDs: this.studentOrganizationIDs,
              searchText: this.searchName
            })
          } else if (this.radioVal === '2') {
            // radioVal 2:按课程
            this.xy.downFile(`${this.$store.state.apiPath}/api/SchoolBasedGrabStudentSelectCourse/ExportReportMovingClassStudent`, {
              classTableID: this.classTableID,
              searchText: this.searchName
            })
          }
        };
        // selectNum 1:未选完
        if (this.selectNum === 1) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/SchoolBasedGrabStudentSelectCourse/ExportStudentSelectCourse`, {
            classTableID: this.classTableID,
            pageIndex: this.$refs.unSelectStudent.pagination.current,
            pageSize: this.$refs.unSelectStudent.pagination.pageSize,
            isComplete: false,
            organizationIDs: this.studentOrganizationIDs,
            searchText: this.searchName
          })
        };
        // selectNum 2:查看剩余班额
        if (this.selectNum === 2) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/SelectSchoolBasedSelectSubject/ExporAllSelectList`, {
            classTableID: this.classTableID,
            orderStr: this.$refs.remainingClasses.downUp,
            searchName: this.searchName
          })
        };
      },
      unSelectStudentChange (data) {
        this.selectedPerson = data.SelectCount
        this.notPersonNum = data.UnSelectCount
      },
      selectStudentChange (data) {
        this.selectedPerson = data.SelectCount
        this.notPersonNum = data.UnSelectCount
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../css/courseSelectionResults.css';
</style>
