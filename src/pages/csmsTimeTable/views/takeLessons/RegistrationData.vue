<template>
  <!-- 9.生成选课数据 -->
  <div class="xy-content-body">
    <Row>
        <i-col span="12" class="clearfix">
            <div class="left-box fr pr">
                <tabs v-model="tabVal" :animated="false" @on-click="tabChange">
                    <tab-pane label="数据校验" name="1">
                        <div style="min-height:200px" v-if="noData">
                            <h1 style="font-size:24px;">数据校验信息</h1>
                            <p>暂无信息，请点击下方“校验数据”按钮开始校验。</p>
                        </div>
                        <div v-if="isCheckDataList.length > 0 && !noData">
                            <div v-for="(item, index) in isCheckDataList" :key="index">
                                <Icon type="ios-checkmark-circle" size="32" color="#19be6b" v-if="item.success" />
                                <Icon type="md-close-circle" size="32" color="#ed4014" v-else />
                                <span style="font-size:14px;">{{item.ruleName}}</span>
                                <span v-if="!item.success" style="color: rgb(45, 140, 240);cursor: pointer;" @click="downErrorFile(item)">下载错误信息</span>
                            </div>
                        </div>
                        <div v-if="isCheckDataList.length === 0 && !noData" class="isInitital-opacity">
                            <!-- <img class="no-data-img" src="@/assets/common/loading.png" /> -->
                            <span style="width: 100%; display:inline-block; text-align: center; color:#888; margin:80px 0">
                                正在检验数据，请稍后...
                            </span>
                        </div>
                        <div class="text-center" style="margin-top:20px" v-if="isOperation===0">
                            <Button class="xy-btn-primary" shape="circle" :disabled="!isShowBtn" @click="checkData">
                                <span v-if="isShowBtn">校验数据</span>
                                <span v-if="!isShowBtn">正在检验数据，请稍后...</span>
                            </Button>
                        </div>
                    </tab-pane>
                    <tab-pane label="生成选课数据" name="2" :disabled="isSuccess">
                        <div class="data-content">
                            <p>请先选择生成选课数据的模式，再点击"生成选课数据"按钮。</p>
                            <radio-group v-model="selectTtype" vertical @on-change="radioChange">
                                <radio label="1">
                                    <span>为所有学生生成所有课程的选课数据</span>
                                    <div>
                                        <checkbox v-model="oneVal" :disabled="one">同时清除已有选课结果</checkbox>
                                    </div>
                                </radio>
                                <radio label="2">
                                    <span>为指定学生生成所有课程的选课数据</span>
                                    <div>
                                        <checkbox v-model="twoVal" :disabled="two">同时清除所指定学生的已有选课结果</checkbox>
                                        <Button type="primary" size="small" v-if="twoBtn" @click="studentBtn">指定学生</Button>
                                    </div>
                                </radio>
                                <radio label="3">
                                    <span>为所有学生生成指定课程的选课数据</span>
                                    <div>
                                        <checkbox v-model="threeVal" :disabled="three">同时清除所指定课程的已有选课结果</checkbox>
                                        <Button type="primary" size="small" v-if="threeBtn" @click="courseBtn">指定课程</Button>
                                    </div>
                                </radio>
                            </radio-group>
                            <p>请先选择生成选课数据的模式，再点击"生成选课数据"按钮。</p>
                            <div class="text-center" style="margin-top:20px;" v-if="isOperation===0">
                                <Button class="xy-btn-primary" shape="circle" @click="submitData">生成选课数据</Button>
                            </div>
                        </div>
                    </tab-pane>
                </tabs>
            </div>

        </i-col>
        <i-col span="12">
            <div>
                <img src="@/assets/csmsTimeTable/startProcess.png" style="width:100%" />
            </div>
        </i-col>
    </Row>

    <!-- 指定学生-->
    <Modal v-model="modalStudent"
           title="指定学生"
           v-if="isOperation===0"
           :mask-closable="false"
           :closable="false"
           width="564"
           :transfer="false">
        <div style="font-size:14px;">
            <div class="clearfix">
                <div class="fl">
                    <checkbox v-model="studentAll" @on-change="studentAllChange">
                        <span class="f14">全选</span>
                    </checkbox>
                </div>
                <Input search
                        enter-button
                        placeholder="姓名/用户名"
                        style="width:220px;"
                        @on-search="studentSearch"
                        v-model.trim="searchStudentName"
                        class="fr casader-search" />
            </div>
            <div v-if="isStudentAllShow" style="max-height: 500px;overflow-y: auto;">
                <div class="modal-check-list" v-for="(studentList, index) in studentData" :key="index" v-show="studentList.isSearch">
                    <div class="check-all" v-if="searchStudentName===''">
                        <checkbox v-model="studentList.checkAll" @on-change="studentListChange(studentList)">
                            <span class="f14" >{{studentList.SubjectCategoryName}}</span>
                        </checkbox>
                    </div>
                    <ul class="check-ul" style="margin-left:15px;">
                        <li v-for="(student, n) in studentList.Levels"
                            v-show="student.isSearchShow" :key="n">
                            <checkbox v-model="student.checkedCur" @on-change="studentChange(student,studentList)">
                                <span class="f14" >{{student.FullName}} （{{student.UserName}}）</span>
                            </checkbox>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else class="modal-null">
                <img class="img" src="@/assets/common/nullData.svg" alt="图片">
                <span class="text">暂无班级信息。</span>
            </div>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="canleStudent">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="modalStudent = false">保存</Button>
        </div>
    </Modal>
    <!-- 指定课程-->
    <Modal v-model="modalCourse"
           title="指定课程"
           :mask-closable="false"
           :closable="false"
           width="564"
           v-if="isOperation===0"
           :transfer="false">
        <div style="font-size:14px;">
            <div class="clearfix">
                <div class="fl">
                    <checkbox v-model="courseAll" @on-change="courseAllChange">
                        <span class="f14">全选</span>
                    </checkbox>
                </div>
                <Input search enter-button placeholder="课程名称"
                         style="width:220px;"
                         @on-search="courseSearch"
                         v-model.trim="searchCourseName"
                         class="fr casader-search" />
            </div>
            <div v-if="isCourseAllShow" style="max-height: 500px;overflow-y: auto;">
                <div class="modal-check-list" v-for="(courseList, index) in courseData" :key="index" v-show="courseList.isSearch">
                    <div class="check-all" v-if="searchCourseName===''">
                        <checkbox v-model="courseList.checkAll" @on-change="courseListChange(courseList)">
                            <span class="f14" >{{courseList.SubjectCategoryName}}</span>
                        </checkbox>
                    </div>
                    <ul class="check-ul" style="margin-left:15px;">
                        <li v-for="(course, n) in courseList.Levels" :key="n"
                            v-show="course.isSearchShow">
                            <checkbox v-model="course.checkedCur" @on-change="courseChange(course,courseList)">
                                <span class="f14" >{{course.SubjectName}}</span>
                            </checkbox>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else class="modal-null">
                <img class="img" src="@/assets/common/nullData.svg" alt="图片">
                <span class="text">暂无课程信息。</span>
            </div>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="canleCourse">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="modalCourse = false">保存</Button>
        </div>
    </Modal>

    <!-- 确认生成选课数据-->
    <Modal v-model="modalConfirm"
           title="确认生成选课数据"
           :mask-closable="false"
           :closable="false"
           width="564"
           v-if="isOperation===0"
           :transfer="false">
        <div style="font-size:14px;">
            <h2 style="margin-bottom:10px;font-size:16px;">
                请输入“<span style="color:#ed4014">确认</span>”来确认生成“<span>{{classTableName}}</span>”的选课数据。
            </h2>
            <Input v-model="confirmVal" clearable placeholder="请输入“确认”" autofocus />
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalConfirm = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="submitConfirm">保存</Button>
        </div>
    </Modal>
    <!-- 确认清除选课数据-->
    <Modal v-model="modalClear"
           title="确认清除选课数据"
           :mask-closable="false"
           :closable="false"
           width="564"
           v-if="isOperation===0"
           :transfer="false">
        <div style="font-size:14px;">
            <h2 style="margin-bottom:10px;font-size:16px;">
                请输入"<span style="color:#ed4014">清除</span>"来确认生成"。
                <span >{{classTableName}}</span>"的选课数据
            </h2>
            <Input v-model="clearVal" clearable placeholder="请输入“清除”" autofocus />
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalClear = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="submitClear">保存</Button>
        </div>
    </Modal>
    <!-- 启用课表后展示 -->
    <Modal v-model="modalStart"
           title="生成选课数据"
           :transfer="false"
           :mask-closable="false"
           :closable="false"
           width="750px">
        <div style="font-size:14px;" id="setTimeSelect">
            <div class="startCheck" v-if="!isComplete">
                <div class="generate-course-results" v-if="!isComplete">
                    <span class="iconfont" v-if="!ieError" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
                    <span class="results-notice" v-if="!ieError">正在生成选课数据，请勿进行其他操作。</span>
                    <span class="results-notice" v-if="ieError">生成选课数据完成</span>
                </div>
                <div class="result-head" style="margin-top:20px;">
                    <span>数据队列：</span>
                    <span style="margin-left:5px;" >{{current}}/{{total}}</span>
                </div>
                <ul class="clearfix check-list">
                    <li data-index="0" class="complete-option" v-for="(item, index) in enableInfo" :key="index">
                        <!-- 等待 -->
                        <span class="state-complete" v-if="item.status === 0">
                            <span class="generate-text" >正在等待生成{{item.dis}}。</span>
                        </span>
                        <!-- 进行中 -->
                        <span v-if="item.status === 1">
                            <span class="data-list-state">
                                <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                            </span>
                            <span class="generate-text" >正在生成{{item.dis}}。</span>
                            <i-progress :percent="percentVal" status="active" :stroke-width="16" />
                        </span>
                        <!-- 成功 -->
                        <span v-if="item.status === 2">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="ios-checkmark-circle" />
                            </span>
                            <span class="generate-text" >成功生成{{item.dis}}。</span>
                        </span>
                        <!-- 失败 -->
                        <span v-if="item.status === 3">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="md-close-circle" color="#ed4014" />
                            </span>
                            <span class="generate-text" >生成{{item.dis}}失败。</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="isComplete" class="text-center" style="min-height:300px;">
            <Icon type="ios-checkmark-circle" size="60" style="color:#42d456;margin-top:90px;" />
            <p style="font-size:16px;margin:10px;" >
                该结果共耗时{{completeTime}}，成功生成选课数据。点击查看
                <span style="margin:0 5px;color:#2d8cf0;cursor:pointer" shape="circle" @click="isComplete = false">日志明细</span>
            </p>
        </div>
        <div slot="footer">
            <Button class="xy-modal-primary" shape="circle" v-if="modalClose" @click="modalStart =false">关闭</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'TLRegistrationData',
    components: {

    },
    data () {
      return {
        selectTtype: '1',
        twoBtn: false,
        threeBtn: false,
        one: false,
        two: true,
        three: true,
        oneVal: false,
        twoVal: false,
        threeVal: false,
        tabVal: '1',
        // 校验数据
        noData: true,
        isCheckDataList: [],
        isShowBtn: true,
        errorMsg: [],
        isSuccess: true,
        // 指定学生
        searchStudentName: '',
        isStudentAllShow: true,
        studentIdList: [],
        modalStudent: false,
        studentAll: false,
        studentData: [],
        // 指定课程
        searchCourseName: '',
        isCourseAllShow: true,
        classIdList: [],
        modalCourse: false,
        courseAll: false,
        courseData: [],
        // 确认弹框
        modalConfirm: false,
        confirmVal: '',
        // 清除弹框、
        modalClear: false,
        clearVal: '',
        // 生成分步清求
        modalStart: false,
        isComplete: false,
        ieError: false,
        enableInfo: [],
        modalClose: false,
        current: 1,
        total: 1,
        completeTime: new Date(),
        percentVal: 0,

        isOperation: true,
        classTableID: 0,
        classTableName: ''
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.rowObj.ClassTableID
      this.classTableName = this.$parent.rowObj.ClassTableName
    },
    mounted () {
    },
    methods: {
      // 校验数据
      async checkData () {
        this.isCheckDataList = []
        this.noData = false
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GenerateSelectCourseData/GenerateSelectCourseDataCheck`, {
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.isCheckDataList = res.data
          let indexs = res.data.map((val) => {
            return val.success
          }).indexOf(false)
          if (indexs !== -1) {
            this.isSuccess = true
          } else {
            this.isSuccess = false
          };
        } else {
          this.errorMsg = res.data
        }
      },
      downErrorFile (item) {
        let errorMsg = ''
        for (let i = 0; i < item.data.length; i++) {
          errorMsg += item.data[i] + '\r\n'
        };
        this.download('error.txt', errorMsg)
      },
      download (fileName, content) {
        if (window.navigator.msSaveOrOpenBlob) {
          // if browser is IE
          var blob = new Blob([decodeURIComponent(encodeURI(content))], {
            type: 'text/csv;charset=utf-8;'
          })
          navigator.msSaveBlob(blob, fileName)
        } else {
          var urlObject = window.URL || window.webkitURL || window
          // eslint-disable-next-line camelcase
          var export_blob = new Blob([content], { type: 'text/plain' })
          // eslint-disable-next-line camelcase
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
          save_link.href = urlObject.createObjectURL(export_blob)
          save_link.download = fileName
          fakeClick(save_link)
        }
        function fakeClick (obj) {
          var ev = document.createEvent('MouseEvents')
          ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          obj.dispatchEvent(ev)
        }
      },
      //
      tabChange (val) {
        // if (val === 2) {
        //    if (!this.isSuccess) {
        //        this.tabVal = '1';
        //    }
        // }
      },
      // 指定学生
      studentBtn () {
        this.modalStudent = true
        this.searchStudentName = ''
        this.isStudentAllShow = true
        this.getStudents()
      },
      studentSearch () { // 学生搜索
        for (let i = 0; i < this.studentData.length; i++) {
          for (let j = 0; j < this.studentData[i].Levels.length; j++) {
            if (this.studentData[i].Levels[j].FullName.indexOf(this.searchStudentName) >= 0 ||
              this.studentData[i].Levels[j].UserName.indexOf(this.searchStudentName) >= 0) {
              this.studentData[i].Levels[j].isSearchShow = true// 搜索后显示的
            } else {
              this.studentData[i].Levels[j].isSearchShow = false// 搜索后显示的
            }
          }
          if (this.searchStudentName === '') {
            this.studentData[i].Levels.map((item) => {
              item.isSearchShow = true
              return item
            })// 搜索后显示的
            this.isStudentAllShow = true
          }
          let index = this.studentData[i].Levels.map((item) => { return item.isSearchShow }).indexOf(true)
          if (index === -1) {
            this.studentData[i].isSearch = false
          } else {
            this.studentData[i].isSearch = true
          }
        };
        let index1 = this.studentData.map((item) => { return item.isSearch }).indexOf(true)
        if (index1 === -1) {
          this.isStudentAllShow = false
        } else {
          this.isStudentAllShow = true
        }
      },
      async getStudents () { // 学生列表数据
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GenerateSelectCourseData/GenerateSelectCourseDataStudent`, {
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.studentData = []
          let dataList = res.data
          for (let i = 0; i < dataList.length; i++) {
            for (let j = 0; j < dataList[i].Levels.length; j++) {
              dataList[i].Levels[j].isSearchShow = true// 搜索后显示的
              dataList[i].isSearch = true// 搜索后显示的
              let index = this.studentIdList.map((item) => { return item }).indexOf(dataList[i].Levels[j].StudentID)
              if (index === -1) {
                dataList[i].Levels[j].checkedCur = false
              } else {
                dataList[i].Levels[j].checkedCur = true
              }
            }
            let index1 = dataList[i].Levels.map((item) => { return item.checkedCur }).indexOf(false)
            if (index1 === -1) {
              dataList[i].checkAll = true
            } else {
              dataList[i].checkAll = false
            }
          };
          this.studentData = dataList
        }
      },
      studentAllChange () { // 全选
        if (this.studentAll) {
          this.studentIdList = []
          for (let i = 0; i < this.studentData.length; i++) {
            this.studentData[i].checkAll = true
            for (let j = 0; j < this.studentData[i].Levels.length; j++) {
              this.studentData[i].Levels[j].checkedCur = true
              this.studentIdList.push(this.studentData[i].Levels[j].StudentID)
            }
          };
        } else {
          for (let i = 0; i < this.studentData.length; i++) {
            this.studentData[i].checkAll = false
            for (let j = 0; j < this.studentData[i].Levels.length; j++) {
              this.studentData[i].Levels[j].checkedCur = false
            }
          };
          this.studentIdList = []
        }
      },
      studentListChange (studentList) { // 分类全选
        if (studentList.checkAll) {
          // this.studentIdList = [];
          for (let i = 0; i < studentList.Levels.length; i++) {
            studentList.Levels[i].checkedCur = true
            this.studentIdList.push(studentList.Levels[i].StudentID)
          }

          let parIndex = this.studentData.map((item) => { return item.checkAll }).indexOf(false)
          if (parIndex === -1) {
            this.studentAll = true // 所有班级已被选中
          }
        } else {
          for (let j = 0; j < studentList.Levels.length; j++) {
            studentList.Levels[j].checkedCur = false
            let index = this.studentIdList.map((item) => { return item }).indexOf(studentList.Levels[j].StudentID)
            this.studentIdList.splice(index, 1)
          }
          this.studentAll = false
        }
      },
      studentChange (student, studentList) { // 当前一个选
        if (student.checkedCur) {
          let index = studentList.Levels.map((item) => { return item.checkedCur }).indexOf(false)
          if (index === -1) {
            studentList.checkAll = true // 某班级已被全部选中

            let parIndex = this.studentData.map((item) => { return item.checkAll }).indexOf(false)
            if (parIndex === -1) {
              this.studentAll = true // 所有班级已被选中
            }
          }
          this.studentIdList.push(student.StudentID)
        } else {
          studentList.checkAll = false
          let index = this.studentIdList.map((item) => { return item }).indexOf(student.StudentID)
          this.studentIdList.splice(index, 1)

          this.studentAll = false
        }
      },
      canleStudent () {
        this.studentIdList = []
        this.studentAll = false
        this.modalStudent = false
      },
      // 指定课程
      courseBtn () {
        this.modalCourse = true
        this.searchCourseName = ''
        this.isCourseAllShow = true
        this.getSubjects()
      },
      courseSearch () { // 课程搜索
        for (let i = 0; i < this.courseData.length; i++) {
          for (let j = 0; j < this.courseData[i].Levels.length; j++) {
            if (this.courseData[i].Levels[j].SubjectName.indexOf(this.searchCourseName) >= 0) {
              this.courseData[i].Levels[j].isSearchShow = true// 搜索后显示的
            } else {
              this.courseData[i].Levels[j].isSearchShow = false// 搜索后显示的
            }
          }
          let index = this.courseData[i].Levels.map((item) => { return item.isSearchShow }).indexOf(true)
          if (index === -1) {
            this.courseData[i].isSearch = false
          } else {
            this.courseData[i].isSearch = true
          }
          if (this.searchCourseName === '') {
            this.courseData[i].Levels.map((item) => {
              item.isSearchShow = true
              return item
            })// 搜索后显示的
            this.isCourseAllShow = true
          }
        };
        let index1 = this.courseData.map((item) => { return item.isSearch }).indexOf(true)
        if (index1 === -1) {
          this.isCourseAllShow = false
        } else {
          this.isCourseAllShow = true
        }
      },
      async getSubjects () { // 学科列表数据
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/SelectCategoryTree`, {
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.courseData = []
          let dataList = res.data
          for (let i = 0; i < dataList.length; i++) {
            for (let j = 0; j < dataList[i].Levels.length; j++) {
              dataList[i].Levels[j].isSearchShow = true// 搜索后显示的
              dataList[i].isSearch = true// 搜索后显示的
              let index = this.classIdList.map((item) => { return item }).indexOf(dataList[i].Levels[j].AID)
              if (index === -1) {
                dataList[i].Levels[j].checkedCur = false
              } else {
                dataList[i].Levels[j].checkedCur = true
              }
            }
            let index1 = dataList[i].Levels.map((item) => { return item.checkedCur }).indexOf(false)
            if (index1 === -1) {
              dataList[i].checkAll = true
            } else {
              dataList[i].checkAll = false
            }
          };
          this.courseData = dataList
        }
      },
      courseAllChange () { // 全选
        if (this.courseAll) {
          this.classIdList = []
          for (let i = 0; i < this.courseData.length; i++) {
            this.courseData[i].checkAll = true
            for (let j = 0; j < this.courseData[i].Levels.length; j++) {
              this.courseData[i].Levels[j].checkedCur = true
              this.classIdList.push(this.courseData[i].Levels[j].AID)
            }
          };
        } else {
          for (let i = 0; i < this.courseData.length; i++) {
            this.courseData[i].checkAll = false
            for (let j = 0; j < this.courseData[i].Levels.length; j++) {
              this.courseData[i].Levels[j].checkedCur = false
            }
          };
          this.classIdList = []
        }
      },
      courseListChange (courseList) { // 分类全选
        if (courseList.checkAll) {
          for (let i = 0; i < courseList.Levels.length; i++) {
            courseList.Levels[i].checkedCur = true
            this.classIdList.push(courseList.Levels[i].AID)
          }

          let parIndex = this.courseData.map((item) => { return item.checkAll }).indexOf(false)
          if (parIndex === -1) {
            this.courseAll = true // 所有班级已被选中
          }
        } else {
          for (let j = 0; j < courseList.Levels.length; j++) {
            courseList.Levels[j].checkedCur = false
            let index = this.classIdList.map((item) => { return item }).indexOf(courseList.Levels[j].AID)
            this.classIdList.splice(index, 1)
          }
          this.courseAll = false
        }
      },
      courseChange (course, courseList) { // 当前一个选
        if (course.checkedCur) {
          let index = courseList.Levels.map((item) => { return item.checkedCur }).indexOf(false)
          if (index === -1) {
            courseList.checkAll = true // 某班级已被全部选中

            let parIndex = this.courseData.map((item) => { return item.checkAll }).indexOf(false)
            if (parIndex === -1) {
              this.courseAll = true // 所有班级已被选中
            }
          }
          this.classIdList.push(course.AID)
        } else {
          courseList.checkAll = false
          let index = this.classIdList.map((item) => { return item }).indexOf(course.AID)
          this.classIdList.splice(index, 1)

          this.courseAll = false
        }
      },
      canleCourse () {
        this.classIdList = []
        this.courseAll = false
        this.modalCourse = false
      },
      // 生成选课数据
      submitData () {
        if (this.selectTtype === '1') {
          if (this.oneVal) {
            this.clearVal = ''
            this.modalClear = true
          } else {
            this.confirmVal = ''
            this.modalConfirm = true
          }
        };
        if (this.selectTtype === '2') {
          if (this.studentIdList.length === 0) {
            this.xy.msgError('请点击“指定学生”指定为哪些学生生成选课数据。')
            return false
          };
          if (this.twoVal) {
            this.clearVal = ''
            this.modalClear = true
          } else {
            this.confirmVal = ''
            this.modalConfirm = true
          }
        };
        if (this.selectTtype === '3') {
          if (this.classIdList.length === 0) {
            this.xy.msgError('请点击“指定课程”指定生成哪些课程的选课数据。')
            return false
          };
          if (this.threeVal) {
            this.clearVal = ''
            this.modalClear = true
          } else {
            this.confirmVal = ''
            this.modalConfirm = true
          }
        };
      },
      // 确认、清除modal
      submitConfirm () {
        if (this.confirmVal === '确认') {
          if (this.selectTtype === '1') {
            this.modalConfirm = false
            this.generateSelectCourseDataPage()
          };
          if (this.selectTtype === '2') {
            this.modalConfirm = false
            this.generateSelectCourseDataPage(this.studentIdList)
          };
          if (this.selectTtype === '3') {
            this.modalConfirm = false
            this.generateSelectCourseDataPage()
          };
        } else {
          this.xy.msgError('请输入"确认"。')
        }
      },
      submitClear () {
        if (this.clearVal === '清除') {
          if (this.selectTtype === '1') {
            this.modalClear = false
            this.generateSelectCourseDataPage()
          };
          if (this.selectTtype === '2') {
            this.modalClear = false
            this.generateSelectCourseDataPage(this.studentIdList)
          };
          if (this.selectTtype === '3') {
            this.modalClear = false
            this.generateSelectCourseDataPage()
          };
        } else {
          this.xy.msgError('请输入"清除"。')
        }
      },
      async forAllStudent (start, end) { // 为所有学生生成
        this.percentFun()
        this.enableInfo[start].status = 1
        this.current = start + 1
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/GenerateSelectCourseData/GenerateSelectCourseData`, {
          ClassTableID: this.classTableID,
          IsDelete: this.oneVal,
          Students: this.enableInfo[start].postData
        })
        this.xy.unloading()
        if (res.success) {
          this.enableInfo[start].status = 2
          if (start + 1 < end) { //
            this.forAllStudent(start + 1, end)
          }
          if (start + 1 === end) { // 最后一次
            let nowDate = new Date()
            this.completeTime = this.formatSeconds((nowDate.getTime() - this.completeTime.getTime()) / 1000)
            this.isComplete = true
            this.modalClose = true
            this.ieError = true
            this.xy.msgSuc('生成成功。')
            this.$parent.getGeneralFlows()//
            let resCaChe = await this.xy.post(`${this.$store.state.apiPath}/api/GenerateSelectCourseData/GenerateSelectCourseDataCache`, {
              ClassTableID: this.classTableID
            })
            if (resCaChe.success) {}
          }
        } else {
          this.modalClose = true
          this.enableInfo[start].status = 3
        };
      },
      async forStudent (start, end) { // 指定学生生成
        this.percentFun()
        this.enableInfo[start].status = 1
        this.current = start + 1
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/GenerateSelectCourseData/GenerateSelectCourseDataForStudent`, {
          ClassTableID: this.classTableID,
          StudentIdList: this.studentIdList,
          IsDelete: this.twoVal,
          Students: this.enableInfo[start].postData
        })
        this.xy.unloading()
        if (res.success) {
          this.enableInfo[start].status = 2
          if (start + 1 < end) { //
            this.forAllStudent(start + 1, end)
          }
          if (start + 1 === end) { // 最后一次
            let nowDate = new Date()
            this.completeTime = this.formatSeconds((nowDate.getTime() - this.completeTime.getTime()) / 1000)
            this.isComplete = true
            this.modalClose = true
            this.ieError = true
            this.xy.msgSuc('生成成功。')
            this.$parent.getGeneralFlows()//
            let resCaChe = await this.xy.post(`${this.$store.state.apiPath}/api/GenerateSelectCourseData/GenerateSelectCourseDataCache`, {
              ClassTableID: this.classTableID
            })
            if (resCaChe.success) {}
          }
        } else {
          this.modalClose = true
          this.enableInfo[start].status = 3
        };
      },
      async forCourse (start, end) { // 指定课程生成
        this.percentFun()
        this.enableInfo[start].status = 1
        this.current = start + 1
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/GenerateSelectCourseData/GenerateSelectCourseDataForCourse`, {
          ClassTableID: this.classTableID,
          ClassIdList: this.classIdList,
          IsDelete: this.threeVal,
          Students: this.enableInfo[start].postData
        })
        this.xy.unloading()
        if (res.success) {
          this.enableInfo[start].status = 2
          if (start + 1 < end) { //
            this.forAllStudent(start + 1, end)
          }
          if (start + 1 === end) { // 最后一次
            let nowDate = new Date()
            this.completeTime = this.formatSeconds((nowDate.getTime() - this.completeTime.getTime()) / 1000)
            this.isComplete = true
            this.modalClose = true
            this.ieError = true
            this.xy.msgSuc('生成成功。')
            this.$parent.getGeneralFlows()//
            let resCaChe = await this.xy.post(`${this.$store.state.apiPath}/api/GenerateSelectCourseData/GenerateSelectCourseDataCache`, {
              ClassTableID: this.classTableID
            })
            if (resCaChe.success) {}
          }
        } else {
          this.modalClose = true
          this.enableInfo[start].status = 3
        };
      },
      radioChange (val) {
        if (val === '1') {
          this.twoBtn = false
          this.threeBtn = false
          this.one = false
          this.two = true
          this.three = true
          this.twoVal = false
          this.threeVal = false
        } else if (val === '2') {
          this.twoBtn = true
          this.threeBtn = false
          this.one = true
          this.two = false
          this.three = true
          this.oneVal = false
          this.threeVal = false
        } else if (val === '3') {
          this.twoBtn = false
          this.threeBtn = true
          this.one = true
          this.two = true
          this.three = false
          this.twoVal = false
          this.oneVal = false
        }
      },

      // 生成选课数据分批校验数据
      async generateSelectCourseDataPage (studentIdList) { // 获取生成选课数据中，学生列表
        if (studentIdList === undefined) {
          studentIdList = ''
        } else {
          studentIdList = studentIdList.join(',')
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/GenerateSelectCourseData/GenerateSelectCourseDataPage`, {
          ClassTableID: this.classTableID,
          ids: studentIdList
        })
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          this.enableInfo = []
          let num = 1
          for (let i = 0; i < resData.Students.length; i++) {
            let endText = ''
            if (i === 0) {
              endText = '至第' + resData.Students[i].length + '学生的数据'
            } else {
              endText = '至第' + (resData.Students[i].length + num - 1) + '学生的数据'
            }
            this.enableInfo.push({// status:0等待；1进行中；2成功；3失败
              dis: '第' + num + '位' + endText,
              status: 0,
              postData: resData.Students[i]
            })
            num += resData.Students[i].length
          };
          this.total = resData.TotalRecords
          this.postStep(0, this.enableInfo.length)// 分步清求
        }
      },
      postStep (start, end) {
        this.modalStart = true
        this.isComplete = false
        this.modalClose = false
        this.ieError = false
        this.current = 1
        this.percentVal = 0
        this.completeTime = new Date()
        if (this.selectTtype === '1') {
          this.forAllStudent(start, end)
        };
        if (this.selectTtype === '2') {
          this.forStudent(start, end)
        };
        if (this.selectTtype === '3') {
          this.forCourse(start, end)
        };
      },
      // 进度条
      percentFun () {
        if (this.percentVal < 90) {
          this.percentVal += 1
          setTimeout(() => {
            this.percentFun()
          }, 200)
        }
      },
      // 毫秒转时分秒
      formatSeconds (value) {
        let secondTime = parseInt(value)// 秒
        let minuteTime = 0// 分
        let hourTime = 0// 小时
        if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
          // 获取分钟，除以60取整数，得到整数分钟
          minuteTime = parseInt(secondTime / 60)
          // 获取秒数，秒数取佘，得到整数秒数
          secondTime = parseInt(secondTime % 60)
          // 如果分钟大于60，将分钟转换成小时
          if (minuteTime > 60) {
            // 获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60)
            // 获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60)
          }
        }
        let result = '' + parseInt(secondTime) + '秒'

        if (minuteTime > 0) {
          result = '' + parseInt(minuteTime) + '分' + result
        } else {
          result = '' + 0 + '分' + result
        }
        if (hourTime > 0) {
          result = '' + parseInt(hourTime) + '小时' + result
        } else {
          result = '' + 0 + '小时' + result
        }
        return result
      }
    }
  }
</script>
<style lang="less" scoped>
.data-content{
    width:500px;
    margin:20px auto;
}
.data-content p{
    font-size:14px;
}
.ivu-radio-group-item{
    height:100% !important;
    margin:10px 0;
    font-size:14px;
}
.ivu-checkbox-wrapper{
    margin-left:20px;
    font-size:14px;
}
.modal-check-list{
    padding:10px 10px;
    background:#f8f8f9;
    margin:15px 0;
}
.check-all{
    padding-bottom:10px;
    border-bottom:1px solid #eee
}
.check-ul{
    margin-left:15px;
}
.check-ul li{
    margin:5px 0;
}

.left-box {
    width: 668px;
    height: 631px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 4px 12px 0px rgba(167,167,167,0.4);
    border-radius: 10px;
    margin: 50px 0;
    padding: 20px 36px;
}

.bottom-btn {
    margin-top: 20px;
}

.generate-course-results {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #fff7dd;
    border-radius: 4px;
}

    .generate-course-results > .fa {
        color: #df4444;
        line-height: 30px;
        margin-left: 10px;
    }

    .generate-course-results > .results-notice {
        color: #df4444;
    }

.check-list {
    width: 100%;
    min-height: 220px;
}

    .check-list li {
        padding: 5px 0;
    }

    .check-list .generate-text {
        font-size: 14px;
    }

    .check-list .ivu-icon {
        font-size: 32px;
    }

    .check-list .ivu-icon-ios-checkmark-circle {
        color: #19be6b;
    }

    .check-list .ivu-icon-ios-close-circle {
        color: #ed4014;
    }

    .check-list .fa-spin {
        color: #5cadff;
    }

.startCheck {
    max-height: 500px;
    overflow-y: scroll;
}

.tap-ul {
    margin: 20px 0;
}

    .tap-ul li {
        display: inline-block;
        font-size: 16px;
        margin: 0 10px;
        padding: 10px;
        cursor: pointer;
        font-weight: 400;
    }

.is-active {
    color: #4196FF !important;
    border-bottom: 3px solid #4196FF;
}

@media screen and (max-width: 1366px) {
    .left-box {
        width: 600px;
    }
}
</style>
