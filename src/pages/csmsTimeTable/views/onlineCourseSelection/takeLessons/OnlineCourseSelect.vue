<template>
  <!-- 抢课式选课:去选课(简单模式) -->
  <div class="xy-content-module">
    <div class="xy-content-title">
      <Button
        class="xy-primary"
        v-if="crouseList.OnLineSelectCourseRequirement != null && crouseList.OnLineSelectCourseRequirement != ''"
        @click="modalHelp = true">选课要求</Button>
      <Button class="xy-info" @click="backResult" v-if="loadAdjust !== ''">返回</Button>
      <Button class="xy-info" @click="back" v-if="loadAdjust === ''">返回选课首页</Button>
      <Alert show-icon closable style="margin-top: 10px;">
          选课操作说明：
          <template slot="desc">1.请点击课程图标选择课程（被选中课程的图标将变成蓝色）。再次点击被选中课程的图标将取消对该课程的选择。<br/>
            2.选中一门课程后，与这门课程上课相冲突的课程将自动从界面上消失。如果想让自动消失的课程出现，请点击被选中课程的图标取消对这门课程的选择（注意：老师设置了您必须选这门课的无法取消）。</template>
      </Alert>
    </div>
    <div class="xy-content-body">
      <row>
        <!-- <i-col span="8">
          <Button class="xy-danger" @click="modalOnline = true"
            >取消全部选择</Button
          >
        </i-col> -->
        <i-col span="21">
          <div style="display:block; text-align:center;">
            本次选课最少选择<span
              class="col-mber"
              style="color:#5cadff"

              >{{ crouseList.MinOptionalCourse }}</span
            >门，最多选
            <span class="col-mber" style="color:#5cadff">{{
              crouseList.MaxOptionalCourse
            }}</span>
            门。 已选
            <span class="col-mber" style="color:#5cadff">{{
              crouseList.SelfSelectCount
            }}</span>
            门。
          </div>
        </i-col>
        <i-col span="3" class="text-right">
          <checkbox v-model="isShowAll" @on-change="getTP">
            <span class="f14">显示全部课程</span>
          </checkbox>
        </i-col>
      </row>
      <div
        class="select-box"
        v-for="(result, index) in crouseList.Results"
        :key="index"
        v-show="crouseList.Results.length > 0"
      >
        <div class="box-header">
          <h1>{{ result.SubjectGroupName }}</h1>
        </div>
        <div class="box-bodys">
          <ul class="first-ul">
            <li
              v-for="(item, index) in result.Courses"
              :key="index"
              @click="selectLi($event, item)"
              :class="item.IsChoice ? '' : 'is-no-chose'"
              :data-isFull="
                item.SelectCount === item.StudentLimitation ? true : false
              "
            >
              <div
                class="body-header"
                :class="item.IsSelected ? 'is-select-sub' : ''"
              >
                <h2
                  class="subject-name nowrap"

                  :title="item.SubjectName"
                >
                  {{ item.SubjectName }}
                </h2>
                <img
                  class="select-img"
                  :src="
                    item.IsSelected
                      ? require('@/assets/onlineCourseSelection/select-true.png')
                      : require('@/assets/onlineCourseSelection/select-false.png')
                  "
                />
              </div>
              <div class="select-content detail-content">
                <p
                  class="teacher-name nowrap"
                  v-if="item.TeacherName === ''"

                >
                  教师名称：无
                </p>
                <p
                  class="teacher-name nowrap"
                  :title="item.TeacherName"
                  v-if="item.TeacherName != ''"
                >
                  教师名称：{{ item.TeacherName }}
                </p>
                <p
                  class="common-info nowrap"
                  :title="item.TimesInfo"
                >
                  {{ item.TimesInfo }}
                </p>
                <p class="common-info nowrap">
                  <span>当前已选</span>
                  <span class="col-mber">{{ item.SelectCount }}</span>
                  <span>/</span>
                  <span class="col-mber">{{
                    item.StudentLimitation
                  }}</span>
                  <span>人</span>
                </p>
                <div class="introduce-btn">
                  <Button
                    class="xy-primary"
                    @click.stop="lntroduce(item)"
                    :disabled="!item.IsExistsCourseIntroduction"
                    size="small"
                    shape="circle"
                    >课程介绍</Button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--暂无数据-->
      <div v-if="crouseList.Results.length === 0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">您的选课数据尚未生成，请联系学校老师帮您处理。</span>
      </div>
      <div class="text-center mt-20" style="margin-top: 60px;" v-if="crouseList.Results.length > 0">
        <Button class="xy-btn-primary" shape="circle" style="margin-right:0px" @click="nextBtn">完成</Button>
      </div>

      <!-- 帮助展示 -->
      <Modal
        v-model="modalHelp"
        title="选课要求"
        :transfer="false"
        :mask-closable="false"
      >
        <div style="font-size:14px;height:600px;overflow:auto;">
          <div v-html="crouseList.OnLineSelectCourseRequirement"></div>
        </div>
      </Modal>

      <!-- 取消全部 -->
      <Modal
        v-model="modalOnline"
        title="确认取消选择"
        :transfer="false"
        @on-ok="canleSelect"
        :mask-closable="false"
      >
        <div style="font-size:14px;">
          <h1>
            请输入“<span style="color:orangered">取消</span
            >”确认取消所有选中的课程。
          </h1>
          <div>
            <i-input
              type="text"
              v-model="canleVal"
              placeholder="请输入“取消”"
            ></i-input>
          </div>
        </div>
      </Modal>

      <!-- 课程介绍 -->
      <Modal
        v-model="modalntroduce"
        :title="lntroduceData.IsUrl ? '课程介绍链接' : '课程介绍'"
        :transfer="false"
        :mask-closable="false"
      >
        <a
          v-if="lntroduceData.IsUrl"
          style="font-size:14px;max-height:200px;color: #2d8cf0;"
          @click="loadIntroduce(lntroduceData.Description)"

          >{{ lntroduceData.Description }}</a
        >
        <div
          v-if="!lntroduceData.IsUrl"
          style="font-size:14px;height:300px;overflow:auto;"
          v-html="lntroduceData.Description"
        ></div>
      </Modal>
    </div>

    <!-- <script src="/View/csmsTimeTable/PC/Script/OnlineCourseSelection/TakeLessons/OnlineCourseSelect.js"></script> -->
  </div>
</template>
<script>
  export default {
    name: 'OnlineChooseCourseTLesson',
    components: {},
    data () {
      return {
        isShowAll: false,
        modalHelp: false,
        modalOnline: false,
        canleVal: '',
        modalntroduce: false,
        classTableID: '',
        collectionID: '',
        crouseList: { Results: [] },
        lntroduceData: '',
        isUrl: true,
        maxOptionalCourse: '',
        minOptionalCourse: '',
        studentID: 0,
        accountID: 0,
        ticket: '',
        // 校本排课下‘选课结果’步骤，点击‘调整’跳转过来的
        loadAdjust: ''
      }
    },
    created () {
      if (this.$store.state.csmstimetable.takeLessonsGoSelectResult.classTableID > 0) {
        // 从校本排课‘调整’跳转至本页面
        this.classTableID = this.$store.state.csmstimetable.takeLessonsGoSelectResult.classTableID

        this.loadAdjust = JSON.parse(this.$store.state.csmstimetable.takeLessonsGoSelectResult.loadAdjust)
        this.studentID = this.loadAdjust.studentID
        this.collectionID = this.loadAdjust.collectionID
      } else {
        // 在线选课列表跳转至当前页面
        this.classTableID = this.$route.query.classTableID
        this.collectionID = this.$route.query.collectionID
      }
    },
    mounted () {
      this.getTP()
    },
    methods: {
      async getTP () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentOnLineSelectCourse/GetSchoolBasedGrabOnLineList`, {
          ClassTableID: this.classTableID,
          isShow: this.isShowAll,
          studentID: this.studentID
        })
        if (res.success) {
          this.crouseList = res.data
          this.minOptionalCourse = res.data.MinOptionalCourse
          this.maxOptionalCourse = res.data.MaxOptionalCourse
          this.accountID = res.data.AccountID
        }
        this.xy.unloading()
      },
      // 返回选课结果页面
      back () {
        this.$router.back()
      },
      // 返回校本排课选课结果页面
      backResult () {
        this.$store.commit('csmstimetable/setTakeLessonsGoSelectResult', {
          classTableID: this.$store.state.csmstimetable.takeLessonsGoSelectResult.classTableID,
          loadAdjust: this.$store.state.csmstimetable.takeLessonsGoSelectResult.loadAdjust
        })
        this.$router.push({ path: '/xyhome/takeLessonsStepsHeader', query: this.$store.state.common.menuInfo })
      },
      // 选中
      selectLi (event, item) {
        if (!item.IsReadOnly) { // 不是仅读
          if (item.IsChoice) { // 可以选择的
            if (item.IsSelected) { // 取消
              // this.xy.unSelectLoading()
              this.xy.loading()
              this.xy.get(`${this.xyApi}/generate/api/Generate/Remove`, {
                accountID: this.accountID,
                classTableID: this.classTableID,
                aid: item.SelectCourseAID,
                studentID: this.studentID,
                studentOrganizationID: item.StudentOrganizationID
              }).then(resTick => {
                if (resTick.success) {
                  this.ticket = resTick.data
                  let params = {
                    ClassTableID: this.classTableID,
                    CoursePlanID: item.CoursePlanID,
                    AID: item.AID,
                    Type: item.Type,
                    StudentID: this.studentID,
                    SelectAID: item.SelectiveAID,
                    SelectType: item.SelectiveType,
                    ticket: this.ticket
                  }
                  this.xy.post(`${this.$store.state.apiPath}/api/StudentOnLineSelectCourse/SchoolBasedGrabUnSelect`, params).then(res => {
                    this.xy.unloading()
                    if (res.success) {
                      this.getTP()
                    }
                  })
                } else {
                  this.xy.unloading()
                }
              })
            } else { // 选中
              // this.xy.selectLoading()
              this.xy.loading()
              this.xy.get(`${this.xyApi}/generate/api/Generate/Generate`, {
                accountID: this.accountID,
                classTableID: this.classTableID,
                aid: item.SelectCourseAID,
                studentID: this.studentID,
                studentOrganizationID: item.StudentOrganizationID
              }).then(resTick => {
                if (resTick.success) {
                  this.ticket = resTick.data
                  let params = {
                    ClassTableID: this.classTableID,
                    CoursePlanID: item.CoursePlanID,
                    AID: item.AID,
                    Type: item.Type,
                    StudentID: this.studentID,
                    SelectAID: item.SelectiveAID,
                    SelectType: item.SelectiveType,
                    ticket: this.ticket
                  }
                  this.xy.post(`${this.$store.state.apiPath}/api/StudentOnLineSelectCourse/SchoolBasedGrabSelect`, params).then(res => {
                    this.xy.unloading()
                    if (res.success) {
                      this.getTP()
                    } else {
                      // 选择失败后释放名额
                      this.xy.get(`${this.xyApi}/generate/api/Generate/Remove`, {
                        accountID: this.accountID,
                        classTableID: this.classTableID,
                        aid: item.SelectCourseAID,
                        studentID: this.studentID,
                        studentOrganizationID: item.StudentOrganizationID
                      }).then(resRemove => {

                      })
                    }
                  })
                } else {
                  this.xy.unloading()
                }
              })
            }
          }
        }
      },
      // 取消全部选中
      canleSelect () {
        if (this.canleVal === '取消') {
          this.xy.loading()
          let params = {
            ClassTableID: this.classTableID,
            StudentID: this.studentID
          }
          this.xy.post(`${this.$store.state.apiPath}/api/StudentOnLineSelectCourse/SchoolBasedGrabClear`, params).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('取消成功。')
              this.canleVal = ''
              this.modalOnline = false
              this.getTP()
            }
          })
        } else {
          this.canleVal = ''
          this.xy.msgError('请输入“取消”来确认取消全部选择。')
        }
      },
      // 完成
      nextBtn () {
        if (this.crouseList.SelfSelectCount > this.crouseList.MaxOptionalCourse) {
          this.xy.msgError('最多选择' + this.crouseList.MaxOptionalCourse + '门。')
          return false
        };
        if (this.crouseList.SelfSelectCount < this.crouseList.MinOptionalCourse) {
          this.xy.msgError('请至少选择' + this.crouseList.MinOptionalCourse + '门。')
          return false
        };

        this.xy.loading()
        let params = {
          ClassTableID: this.classTableID,
          CollectionID: this.collectionID,
          StudentID: this.studentID
        }
        this.xy.post(`${this.$store.state.apiPath}/api/StudentOnLineSelectCourse/SchoolBasedGrabCompleteSelectCourse`, params).then(res => {
          this.xy.unloading()
          if (res.success) {
            if (this.loadAdjust === '') {
              this.xy.msgSuc('选课完成。')
              this.back()
            } else {
              this.xy.msgSuc('调整完成。')
              this.backResult()
            }
          }
        })
      },
      // 课程介绍
      async lntroduce (itme) {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentOnLineSelectCourse/GetCourseIntroduction`, { classTableID: this.classTableID, aid: itme.AID, type: itme.Type })
        this.xy.unloading()
        if (res.success) {
          this.lntroduceData = res.data
          this.modalntroduce = true
        }
      },

      // 课程介绍的链接
      loadIntroduce (url) {
        window.open(url)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/takeLessons.css';
</style>
