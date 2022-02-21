<template>
    <!-- 7.启动排课 -->
    <div class="areas-part">
      <div class="areas-left" >
          <ul class="tab-ul">
              <li :class="liData[0].isActive?'li-active':''"
                  @click="ruleLi(liData[0], 0)">
                  {{liData[0].name}}
              </li>
              <li :class="isClassRoomNum?'hs':liData[1].isActive?'li-active':''"
                  @click="ruleLi(liData[1], 1)">
                  {{liData[1].name}}
              </li>
              <li :class="isClassRoomNum?'hs':(!isComplete?'hs':liData[2].isActive?'li-active':'')"
                  @click="ruleLi(liData[2], 2)">
                  {{liData[2].name}}
              </li>
              <li :class="isClassRoomNum?'hs':(!isComplete?'hs':liData[3].isActive?'li-active':'')"
                  @click="ruleLi(liData[3], 3)">
                  {{liData[3].name}}
              </li>
          </ul>
      </div>
      <div class="areas-right" style="padding-bottom: 30px;">
        <div v-if="curIndex === 0">
          <div class="tab-box">
                <Alert show-icon closable style="width:620px; margin: 40px auto 0;">本次排课最少需要<b>{{classRoomTable.LeastNum}}</b>间教室，如果有更多可以使用的教室，一般情况下需要您把可用教室数设置得略大于此最少所需教室数。</Alert>
                <div>
                    <div class="text-center" style="margin:140px 0;">
                        <label>可用教室：</label>
                        <i-input v-model="classRoomNum" placeholder="请输入可用教室数" style="width: 300px"></i-input>
                    </div>
                    <div class="text-center" v-if="isOperation === 0">
                        <Button class="xy-btn-primary" shape="circle" size="large" @click="submitClassRoom">保存</Button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="curIndex === 1">
          <div class="tab-box">
              <div class="check-box">
                  <div class="no-data-box" v-if="noData">
                    <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                    <span class="no-data-text">暂无信息，请点击下方“校验数据”按钮开始校验。</span>
                  </div>
                  <div class="startCheck" v-if="isCheckShow">
                      <div class="generate-course-results" v-if="isOnGoing" style="margin-top:60px">
                          <span class="iconfont" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
                          <span class="results-notice">正在校验冲突，请勿进行其他操作。</span>
                      </div>
                      <div class="result-head" style="margin-top:20px;">
                          <span>数据队列：</span>
                          <span style="margin-left:5px;">{{num+1}}/9</span>
                      </div>
                      <ul class="clearfix check-list">
                          <li data-index="0" class="complete-option" v-for="(item, i) in processData" :key="i">
                              <!-- 等待 -->
                              <span class="state-complete" v-if="item.status === 0">
                                  <span class="generate-text">正在等待，{{item.describe}}</span>
                              </span>
                              <!-- 进行中 -->
                              <span v-if="item.status === 1">
                                  <span class="data-list-state">
                                      <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                                  </span>
                                  <span class="generate-text">正在进行,{{item.describe}}</span>
                                  <i-progress :percent="percentVal" status="active" :stroke-width="16" />
                              </span>
                              <!-- 成功 -->
                              <span v-if="item.status === 2">
                                  <span class="data-list-state data-list-state-error">
                                      <Icon type="ios-checkmark-circle" />
                                  </span>
                                  <span class="generate-text">成功,{{item.describe}}</span>
                              </span>
                              <!-- 失败 -->
                              <span v-if="item.status === 3">
                                  <span class="data-list-state data-list-state-error">
                                      <Icon type="md-close-circle" color="#ed4014" />
                                  </span>
                                  <span class="generate-text">失败,{{item.describe}}</span>
                                  <span @click="downErrorFile(item)" style="color:#2d8cf0;cursor:pointer;">下载错误信息</span>
                              </span>
                          </li>
                      </ul>
                  </div>
                  <div class="text-center" v-if="!noData &&!isCheckShow">
                      <Icon type="ios-checkmark-circle" size="60" style="color:#42d456;margin-top:90px;" />
                      <p style="font-size:16px;margin:10px;">
                          该结果共耗时{{completeTime}}，校验完成，请点击上方“启动排课”按钮启动排课。点击查看
                          <span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="logClick">日志明细</span>
                      </p>
                  </div>
                  <div class="text-center" style="margin-top:50px" v-if="isOperation === 0">
                      <Button class="xy-btn-primary" shape="circle" :disabled="!isShowBtn" @click="checkData">
                          <span v-if="isShowBtn">校验数据</span>
                          <span v-if="!isShowBtn">正在检验数据，请稍后...</span>
                      </Button>
                  </div>
              </div>
            </div>
        </div>
        <div v-if="curIndex === 2">
          <div class="resources-tab">
                <table class="table">
                    <thead>
                    <tr>
                        <th colspan="3">教室评估</th>
                    </tr>
                    <tr>
                        <th width="33%">实际所需教室精确值</th>
                        <th width="33%">实际所需教室取整数</th>
                        <th width="33%">设置的可用教室数</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="classRoomTable !== null || classRoomTable !== ''">
                        <td>{{classRoomTable.AccurateNum}}</td>
                        <td>{{classRoomTable.LeastNum}}</td>
                        <td>{{classRoomTable.EachLessonClassUpLimit}}</td>
                    </tr>
                    <tr v-else>
                        <td colspan="3" class="text-center">暂无教室评估信息。</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="resources-tab">
                <table class="table">
                    <thead>
                    <tr>
                        <th colspan="3">
                                <span class="fl" style="font-weight:normal;padding-left:10px;">
                                    可用课位数量：{{sectionTable.AvailableHours}}
                                </span>
                            <span>学生课时评估</span>
                        </th>
                    </tr>
                    <tr>
                        <th width="33%">学生上完课所需的课时数</th>
                        <th width="33%">该课时数的学生人数</th>
                        <th width="33%">该课时数学生的富余课时</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="section in sectionTable.Result" :key="section.Lesson">
                        <td v-if="sectionTable.Result && sectionTable.Result.length > 0">{{section.Lesson}}</td>
                        <td v-if="sectionTable.Result && sectionTable.Result.length > 0">{{section.StudentsCount}}</td>
                        <td v-if="sectionTable.Result && sectionTable.Result.length > 0">{{section.FreeHours}}</td>
                    </tr>
                    <tr v-if="sectionTable.Result && sectionTable.Result.length === 0">
                        <td colspan="3" class="text-center">暂无学生课时评估信息。</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="resources-tab">
                <table class="table">
                    <thead>
                    <tr>
                        <th colspan="6">
                                <span class="fl" style="font-weight:normal;padding-left:10px;">
                                    可用课位数量：{{teacherTable.AvailableHours}}
                                </span>
                            <span>教师课时评估</span>
                        </th>
                    </tr>
                    <tr>
                        <th width="16%">教师用户名</th>
                        <th width="16%">教师姓名</th>
                        <th width="16%">本方案任课课时数</th>
                        <th width="16%">本方案禁止课时数</th>
                        <th width="16%">其他方案已排课时数</th>
                        <th width="16%">富余课时</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in teacherTable.Result" :key="item.Lesson">
                        <td v-if="teacherTable.Result && teacherTable.Result.length > 0">{{item.UserName}}</td>
                        <td v-if="teacherTable.Result && teacherTable.Result.length > 0">{{item.FullName }}</td>
                        <td v-if="teacherTable.Result && teacherTable.Result.length > 0">{{item.Lesson }}</td>
                        <td v-if="teacherTable.Result && teacherTable.Result.length > 0">{{item.TeacherForbid }}</td>
                        <td v-if="teacherTable.Result && teacherTable.Result.length > 0">{{item.OtherHours }}</td>
                        <td v-if="teacherTable.Result && teacherTable.Result.length > 0">{{item.FreeHours }}</td>
                    </tr>
                    <tr v-if="teacherTable.Result && teacherTable.Result.length === 0">
                        <td colspan="6" class="text-center">暂无教师课时评估信息。</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="resources-tab">
                <h1></h1>
                <table class="table">
                    <thead>
                    <tr>
                        <th colspan="8">
                            <span>班额评估</span>
                        </th>
                    </tr>
                    <tr>
                        <th width="14%">课程</th>
                        <th width="9%">课时</th>
                        <th width="12%">任课教师</th>
                        <th width="9%">选课人数</th>
                        <th width="9%">开班数量</th>
                        <th width="9%">平均班额</th>
                        <th width="9%">允许班额</th>
                        <th width="9%">富余班额</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in classNumTable.Result" :key="item.SubjectName">
                        <td v-if="classNumTable.Result && classNumTable.Result.length > 0">{{item.SubjectName}}-{{item.LevelName}}-{{item.ClassName}}</td>
                        <td v-if="classNumTable.Result && classNumTable.Result.length > 0">{{item.Lesson}}</td>
                        <td v-if="classNumTable.Result && classNumTable.Result.length > 0">{{item.TeacherNames}}</td>
                        <td v-if="classNumTable.Result && classNumTable.Result.length > 0">{{item.SelectedStudents}}</td>
                        <td v-if="classNumTable.Result && classNumTable.Result.length > 0">{{item.ClassCount}}</td>
                        <td v-if="classNumTable.Result && classNumTable.Result.length > 0">{{item.AveNum}}</td>
                        <td v-if="classNumTable.Result && classNumTable.Result.length > 0">{{item.StudentLimitation}}</td>
                        <td v-if="classNumTable.Result && classNumTable.Result.length > 0">{{item.StudentLimitation - item.AveNum}}</td>
                    </tr>
                    <tr v-if="classNumTable.Result && classNumTable.Result.length === 0">
                        <td colspan="8" class="text-center">暂无班额评估信息。</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- 启动排课 -->
        <div v-if="curIndex === 3">
          <div class="tab-box">
              <!-- 排课方式选择 -->
              <div v-if="!modalLog && !startTip">
                <p class="check-header">请选择排课方式后启动排课</p>
                <a-radio-group class="radio-box" v-model="startType">
                  <div class="start-box left" :class="startType === 1?'cur-type':''" @click="typeChange(1)">
                      <img class="start-img" src="@/assets/csmsTimeTable/online.png" alt="图片"/>
                      <a-radio :value="1" class="check-radio">线上排课</a-radio>
                      <div class="start-text">通用方式，满足大多数排课场景。</div>
                      <div class="text-center" v-if="isOperation === 0">
                        <Button class="xy-primary" shape="circle" :loading="btnLoading" :disabled="startType === 2" @click="startFun(startType)" style="margin-right:0">启动排课</Button>
                      </div>
                  </div>
                  <div class="start-box" :class="startType === 2?'cur-type':''" @click="typeChange(2)">
                      <img class="start-img" src="@/assets/csmsTimeTable/tools.png" alt="图片"/>
                      <a-radio :value="2" class="check-radio">工具排课</a-radio>
                      <div class="start-text">支持编辑更多的排课规则，满足较复杂的排课需要。</div>
                      <div class="text-center" v-if="isOperation === 0">
                        <Button class="xy-primary" shape="circle" :disabled="startType === 1" @click="startFun(startType)" style="margin-right:0">启动排课</Button>
                      </div>
                  </div>
                </a-radio-group>
              </div>
              <!-- 线上排课-启动中 -->
              <div v-if="modalLog && !startTip" class="check-box text-center">
                  <div style="min-height:200px; margin-top: 15px;">
                      <h1 style="font-size:24px;">排课进度信息</h1>
                      <div v-for="item in logList" :key="item.SloverTaskLog">
                          <span>{{xy.moment(item.LogTime).format('YYYY-MM-DD HH:mm')}}</span>
                          <span>{{item.SloverTaskLog}}</span>
                      </div>
                  </div>
                  <div class="text-center" slot="footer" v-if="isRefresh">
                      <Button class="xy-primary" shape="circle" :loading="btnLoading" @click="LogRefresh(0)">刷新</Button>
                      <Button class="xy-danger" shape="circle" @click="LogStop">停止</Button>
                  </div>
              </div>
              <!-- 工具排课-启动提示 -->
              <div v-if="startTip" class="start-tip">
                <div class="no-data-box">
                    <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
                    <span class="no-data-text" style="margin-top:50px;">
                        如果浏览器未提示任何信息，则点击<a :href="rouseUrl">此处</a>打开排课工具<br />或<a href="javascript:;" @click="openOther">下载并运行排课工具</a>。
                    </span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    <!-- <tabs value="1" :animated="false" @on-click="tapClick">
        <tab-pane label="可用教室" name="1">
            1
        </tab-pane>
        <tab-pane label="校验数据" name="2" :disabled="isClassRoomNum">
            2
        </tab-pane>
        <tab-pane label="资源评估" name="3" :disabled="isClassRoomNum?'':(isComplete?false:true)">
            3
        </tab-pane>
        <tab-pane label="启动排课" name="4" :disabled="isClassRoomNum?'':(isComplete?false:true)">
            4
        </tab-pane>
    </tabs> -->
</template>
<script>
  export default {
    name: 'StartProcess',
    components: {
    },
    data () {
      return {
        curIndex: 0,
        liData: [
          {
            name: '可用教室',
            isActive: true
          },
          {
            name: '校验数据',
            isActive: false
          },
          {
            name: '资源评估',
            isActive: false
          },
          {
            name: '启动排课',
            isActive: false
          }
        ],
        classRoomNum: '', // 可用教室数
        isClassRoomNum: true, // 可用教室是否保存
        // 校验数据
        isComplete: false, // 数据是否校验完成
        isShowBtn: true,
        noData: true,
        isCheckShow: false,
        num: 0,
        completeTime: '',
        percentVal: 0,
        isOnGoing: true,
        isCheckComplete: false,
        falseNum: 0,
        processData: [// status:0等待；1进行中；2成功；3失败
          {
            url: 'GetMovingClassTimeRuleRecord',
            status: 0,
            describe: '校验禁止排课时间和必须排课时间之间的冲突。',
            errorFile: ''
          },
          {
            url: 'GetMovingClassTeacherTimeRuleRecord',
            status: 0,
            describe: '校验同一教师所教课程之间的必须上课时间冲突。',
            errorFile: ''
          },
          {
            url: 'GetMovingClassTeacherClassPosition',
            status: 0,
            describe: '校验教师课位区域是否足够。',
            errorFile: ''
          },
          {
            url: 'GetMovingClassStudentClassPosition',
            status: 0,
            describe: '校验学生课位区域是否足够。',
            errorFile: ''
          },
          {
            url: 'GetMovingClassTeacherRepetition',
            status: 0,
            describe: '校验教师是否重复。',
            errorFile: ''
          },
          {
            url: 'GetMovingClassHouseAbundant',
            status: 0,
            describe: '校验教室是否充足。',
            errorFile: ''
          },
          {
            url: 'GetMovingClassStudentLimitation',
            status: 0,
            describe: '校验班额是否足够。',
            errorFile: ''
          },
          {
            url: 'GetMovingClassSelectCourse',
            status: 0,
            describe: '校验是否有预选结果。',
            errorFile: ''
          },
          {
            url: 'GetMovingClassLessonStatus',
            status: 0,
            describe: '校验课时是否正确设置。',
            errorFile: ''
          }
        ],
        isStart: true,
        // 资源评估
        classRoomTable: [], // 教室评估
        sectionTable: [], // 学生富余课时
        teacherTable: [], // 教师富余课时
        classNumTable: [], // 富余班额

        startType: 1, // 启动类型
        startTip: false,
        rouseUrl: '',
        downloadUrl: '',
        // 排课方案日志
        loading: true,
        modalLog: false,
        sloverTaskID: 0,
        status: 0,
        logList: [],
        returnState: '',
        isRefresh: false,
        refreshClassTableID: 0,
        btnLoading: false,
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID
      }
    },
    watch: {
      classRoomNum () {
        if (this.classRoomNum !== '') {
          this.isClassRoomNum = false
        }
      }
    },
    created () {
    },
    mounted () {
      this.getMovingClassStartSloverResourceAssessmentForRoom('fir')
    },
    methods: {
      // 教室评估
      async getMovingClassStartSloverResourceAssessmentForRoom (type) {
        if (type === 'fir') {
          this.xy.loading()
        }
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StartSlover/GetMovingClassStartSloverResourceAssessmentForRoom`, params)
        if (type === 'fir') {
          this.xy.unloading()
        }
        if (res.success) {
          this.classRoomTable = res.data
          this.classRoomNum = res.data.EachLessonClassUpLimit
        }
      },
      checkTab (item) {
        if (!item.isActive) {
          this.liData.map((item) => {
            item.isActive = false
            return item
          })
          item.isActive = true
        }
      },
      // 切换tap
      async ruleLi (item, index) {
        if (index === 0) {
          this.curIndex = index
          this.checkTab(item)
        }
        if (index === 1) {
          if (this.isClassRoomNum) {
            return false
          } else {
            this.curIndex = index
            this.checkTab(item)
          }
        }
        if (index === 2) {
          // isClassRoomNum ? '' : (!isComplete)
          if (this.isClassRoomNum) {
            this.curIndex = index
            this.checkTab(item)
          } else {
            if (this.isComplete) {
              this.curIndex = index
              this.checkTab(item)
            } else {
              return false
            }
          }
          this.xy.loading()
          // 教室评估
          this.getMovingClassStartSloverResourceAssessmentForRoom()
          // 学生富余课时
          let params = {
            classTableID: this.classTableID
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/StartSlover/GetMovingClassStartSloverResourceAssessmentForLessonStu`, params)
          if (res.success) {
            this.sectionTable = res.data
          }
          let res1 = await this.xy.get(`${this.$store.state.apiPath}/api/StartSlover/GetMovingClassStartSloverResourceAssessmentForLessonTea`, params)
          if (res1.success) {
            this.teacherTable = res1.data
          }
          // 教师富余课时
          // 富余班额
          let res2 = await this.xy.get(`${this.$store.state.apiPath}/api/StartSlover/GetMovingClassStartSloverResourceAssessmentForClass`, params)
          if (res2.success) {
            this.classNumTable = res2.data
          }
          this.xy.unloading()
        }
        if (index === 3) {
          if (this.isClassRoomNum) {
            this.curIndex = index
            this.checkTab(item)
          } else {
            if (this.isComplete) {
              this.curIndex = index
              this.checkTab(item)
            } else {
              return false
            }
          }
        }
        this.startTip = false // 隐藏排课工具下载框
        this.modalLog = false
      },

      // 保存可用教室
      async submitClassRoom () {
        var reg = /^[1-9][0-9]{0,2}$/
        if (reg.test(this.classRoomNum)) {
          if (this.classRoomNum >= this.classRoomTable.LeastNum) {
            this.xy.loading()
            let params = {
              ClassTableID: this.classTableID,
              EachLessonClassUpLimit: this.classRoomNum
            }
            let res = await this.xy.post(`${this.$store.state.apiPath}/api/StartSlover/EditMovingClassEachLessonClassUpLimit`, params)
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('保存可用教室成功。')
              this.isClassRoomNum = false
            }
          } else {
            this.xy.msgError('可用教室数必须大于等于所需教室数的整数。')
            return false
          }
        } else {
          this.xy.msgError('请输入1-999的整数。')
        }
      },
      // 校验数据
      checkData () {
        this.processData.map((item) => {
          item.status = 0
          return item
        })
        this.isOnGoing = true
        this.isCheckShow = true
        this.noData = false
        this.num = 0
        this.falseNum = 0
        this.completeTime = new Date()
        this.getFunc(this.num)
        this.isShowBtn = false
      },
      async getFunc (i) {
        this.processData[i].status = 1
        this.percentVal = 0
        this.percentFun()
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StartSlover/${this.processData[i].url}`, params, true)
        if (res.success) {
          this.processData[i].status = 2
        } else {
          this.processData[i].status = 3
          this.falseNum++
          this.processData[i].errorFile = res.msg
        };
        this.num++
        if (this.num < 9) {
          this.getFunc(this.num)
        } else {
          this.xy.unloading()
          this.num = 8
          if (this.falseNum > 0) {
            this.isCheckShow = true
          } else {
            this.isCheckShow = false
          }
          this.isComplete = true
          this.isOnGoing = false
          this.isShowBtn = true
          let nowDate = new Date()
          this.completeTime = this.formatSeconds((nowDate.getTime() - this.completeTime.getTime()) / 1000)
        }
      },
      downErrorFile (val) { // 下载错误信息
        this.download('error.txt', val.errorFile)
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
          var exportBlob = new Blob([content], { type: 'text/plain' })
          var saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
          saveLink.href = urlObject.createObjectURL(exportBlob)
          saveLink.download = fileName
          fakeClick(saveLink)
        }
        function fakeClick (obj) {
          var ev = document.createEvent('MouseEvents')
          ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          obj.dispatchEvent(ev)
        }
      },
      logClick () { // 点击日志
        this.isCheckShow = true
      },
      percentFun () { // 进度条
        if (this.percentVal < 90) {
          this.percentVal += 1
          setTimeout(() => {
            this.percentFun()
          }, 200)
        }
      },
      formatSeconds (value) { // 秒转时分秒
        var secondTime = parseInt(value)// 秒
        var minuteTime = 0// 分
        var hourTime = 0// 小时
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
        var result = '' + parseInt(secondTime) + '秒'

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
      },
      // 切换
      typeChange (type) {
        this.startType = type
      },
      // 启动排课
      startFun (type) {
        if (type === 1) {
          this.startCrouse() // 线上排课
        } else {
          this.startTip = true // 工具排课
          this.getLink()
        }
      },
      async startCrouse () {
        this.btnLoading = true
        this.xy.loading()
        let params = {
          id: this.classTableID,
          // accountID: 2,
          IsAssignClasses: true
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverCoreSiteByPaas/StartSlover`, params)
        this.xy.unloading()
        if (res.success) {
          this.sloverTaskID = res.data
          this.LogRefresh(1)
        }
      },
      async getLink () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetSloverCoreSetting`)
        if (res.success) {
          if (res.data.SloverCoreRouseUrl !== '') {
            this.rouseUrl = res.data.SloverCoreRouseUrl
          } else {
            this.rouseUrl = 'javascript:;'
          }
        }
        this.xy.unloading()
      },
      openOther () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/SloverCoreByPaaS/DownloadTool`)
      },
      // 确定 关闭日志
      LogOk () {
        this.modalLog = false
      },

      // 取消 关闭日志
      LogCancel () {
        this.modalLog = false
      },

      // 停止 关闭日志
      LogStop () {
        var that = this
        that.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要终止这个排课吗？',
          async onOk () {
            that.xy.loading()
            let params = {
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/SloverCoreSiteByPaas/SloverStop?classTableID=${that.classTableID}&sloverTaskID=${that.sloverTaskID}`, params)
            that.xy.unloading()
            if (res.success) {
              that.xy.msgSuc(res.data)
              that.modalLog = false
              $('.xy-tap-steps li').attr('data-auto', 'loadPage')
            }
          }
        })
      },

      // 刷新 不关闭日志
      async LogRefresh (val) {
        this.btnLoading = true
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetSloverTaskByClassTable`, params)
        this.xy.unloading()
        if (res.success) {
          if (val === 1) {
            // 开启日志
            this.modalLog = true
            this.isRefresh = true
          }
          this.btnLoading = false
          this.logList = res.data.LogList
          this.returnState = res.data.Model.ReturnState

          // 完成已读
          if (this.returnState === 3) {
            this.xy.msgSuc('启动成功。')
            $('.xy-tap-steps li').attr('data-auto', 'loadPage')
            this.isRefresh = false
            this.$parent.getGeneralFlows()// 成功后步骤可以点击
          } else {
            $('.xy-tap-steps li').attr('data-auto', '')
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../takeLessons/css/takeLessonCommon.css';
.hs{
  color: #ccc;
}
.generate-course-results {
    width: 100%;
    height: 30px;
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
.check-list li{
    padding:5px 0;
}
.check-list .generate-text{
    font-size:14px;
}
.check-list .ivu-icon{
    font-size:32px;
}
.check-list .ivu-icon-ios-checkmark-circle{
    color:#19be6b;
}
.check-list .ivu-icon-ios-close-circle{
    color:#ed4014;
}
.check-list .fa-spin{
    color:#5cadff;
}
.resources-tab{
    padding: 15px 0;
}

.resources-tab>h1{
    font-size:16px;
    font-weight:bold;
    margin:6px 0;
}
.resources-tab>h3{
    margin-bottom:6px;
}
.resources-tab .table{
    border: 1px solid #ddd;
    text-align: center;
    cursor: pointer;
    margin: 0 auto;
    border-collapse: collapse;
    font-size: 14px;
    width: 100%;
}

.resources-tab .table thead th{
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
   background-color: #f8f8f9;
    box-sizing: border-box;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-bottom: 1px solid #e8eaec;
    border-right: 1px solid #e8eaec;
    font-weight:bold;
}
.resources-tab .table tbody td{
    height: 40px;
    box-sizing: border-box;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid #e8eaec;
    border-right: 1px solid #e8eaec;
}
.resources-tab .table tbody tr.yellow td{
    background:#ff9900;
    color:#fff;
}
.tab-box {
    height:550px;
    // height:738px;
}
.class-room-flex {
    width: 800px;
    height: calc(100% - 150px);
    display:flex;
    justify-content:center;
    align-items:center;
}
.ivu-tabs-bar{
    margin-bottom:0;
}
.check-box-flex {
    width: 800px;
    height:100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
// 启动排课样式
.check-header{
  font-size: 20px;
  color: rgba(0,0,0,0.85);
  font-weight: 700;
  text-align: center;
  margin: 40px 0;
}
.radio-box{
  display:flex;
  justify-content: center;
}
.start-box{
  width: 302px;
  height: 342px;
  background: #ffffff;
  border: 1px solid #dadada;
  border-radius: 10px;
  padding: 20px 45px 27px;
  text-align: center;
  cursor: pointer;
}
.cur-type{
  border-color: #1677ff;
}
.start-box.left{
  margin-right: 80px;
}
.start-box .start-img{
  margin-bottom: 25px;
  width: 100%;
}
.start-box .start-text{
  height: 45px;
  margin: 0 0 30px 0;
}
.check-radio{
  font-size: 18px;
  font-weight: 700;
  color: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}
.start-tip{
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.start-tip .no-data-box{
  padding: 50px 0;
}
</style>
