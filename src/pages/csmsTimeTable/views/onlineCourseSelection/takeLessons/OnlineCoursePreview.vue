<template>
  <!-- 抢课式选课:去预览/查看选课结果(简单模式、分组模式公用) -->
  <div class="xy-content-module">
    <div class="xy-content-title">
      <Button
        class="xy-primary"
        v-if="crouseList.OnLineSelectCourseRequirement != null && crouseList.OnLineSelectCourseRequirement != ''"
        @click="modalHelp = true">选课要求</Button>
      <Button class="xy-info" @click="close">返回选课首页</Button>
      <Alert show-icon closable style="margin-top: 10px;">
          选课操作说明：
          <template slot="desc">1.每组中的课程是供所有同学选择的全部课程，其中蓝色图标的课程是您已选择的课程。<br/>
            2.在查看选课结果页面，不可再更改选课结果重新提交。</template>
      </Alert>
    </div>
    <div class="xy-content-body">
      <row>
        <i-col span="24">
          <div style="display:block; text-align:center;">
            本次选课最少选<span
              class="col-mber"
              style="color:#5cadff"
              >{{ crouseList.MinOptionalCourse }}</span
            >{{ textMode }}， 最多选
            <span class="col-mber" style="color:#5cadff">{{
              crouseList.MaxOptionalCourse
            }}</span
            >{{ textMode }}。
          </div>
        </i-col>
      </row>
      <div class="select-box" v-for="(result, index) in crouseList.Results" :key="index">
        <div class="box-header">
          <row>
            <i-col span="8">
              <h1>{{ result.SubjectGroupName }}</h1>
            </i-col>
            <i-col span="16" class="text-right" v-if="selectCourseMode == 1">
              本组选课最少选<span
                class="col-mber"
                style="color:#5cadff"

                >{{ result.MinSubjectNum }}</span
              >{{ textMode }}， 最多选
              <span class="col-mber" style="color:#5cadff">{{
                result.MaxSubjectNum
              }}</span>
              {{ textMode }}, 已选
              <span class="col-mber" style="color:#5cadff">{{
                result.SelectNum
              }}</span>
              {{ textMode }}。
            </i-col>
          </row>
        </div>
        <!-- 没有子组的 -->
        <div class="box-bodys" v-if="result.Courses.length > 0">
          <ul class="first-ul">
            <li v-for="(item, index) in result.Courses" :key="index">
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
                  v-if="item.TeacherName == ''"

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
                <p class="common-info nowrap" :title="item.TimesInfo">
                  {{ item.TimesInfo }}
                </p>
                <p class="common-info nowrap">
                  <span>最大班额 </span>
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
                    >课程介绍</Button
                  >
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 有子组的 -->
        <div class="box-bodys" v-if="result.Childrens.length > 0">
          <div
            class="select-box"
            style="margin:20px;"
            v-for="children in result.Childrens"
            :key="children"
          >
            <div class="box-header">
              <row>
                <i-col span="8">
                  <h1>{{ children.SubjectGroupName }}</h1>
                </i-col>
                <i-col span="16" class="text-right">
                  本组选课最少选<span
                    class="col-mber"
                    style="color:#5cadff"

                    >{{ children.MinSubjectNum }}</span
                  >{{ textMode }}， 最多选
                  <span class="col-mber" style="color:#5cadff">{{
                    children.MaxSubjectNum
                  }}</span>
                  {{ textMode }}, 已选
                  <span class="col-mber" style="color:#5cadff">{{
                    children.SelectNum
                  }}</span>
                  {{ textMode }}。
                </i-col>
              </row>
            </div>
            <div class="box-bodys">
              <ul class="first-ul">
                <li
                  v-for="(item, index) in children.Courses"
                  :key="index"
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
                      v-if="item.TeacherName == ''"

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
                    <p class="common-info nowrap" :title="item.TimesInfo">
                      {{ item.TimesInfo }}
                    </p>
                    <p class="common-info nowrap">
                      <span>最大班额 </span>
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
                        >课程介绍</Button
                      >
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!--暂无数据-->
      <div v-if="crouseList.Results.length === 0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">您的选课数据尚未生成，请联系学校老师帮您处理。</span>
      </div>
      <div class="text-center mt-20" style="margin-top: 60px;">
        <Button class="xy-btn-primary" style="margin-right:0px" shape="circle" @click="close">关闭</Button>
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

    <!-- <script src="/View/csmsTimeTable/PC/Script/OnlineCourseSelection/TakeLessons/OnlineCoursePreview.js"></script> -->
  </div>
</template>
<script>
  export default {
    name: 'OnlineChooseCourseTLessonView',
    components: {},
    data () {
      return {
        menus: [],
        modalHelp: false,
        modalntroduce: false,
        classTableID: '',
        crouseList: '',
        lntroduceContent: '',
        selectCourseMode: 0, // 0简单、1分组
        textMode: '',
        lntroduceData: '',
        studentID: 0,
        titleName: ''
      }
    },
    created () {
      // this.classTableID = xy.param.getValues('classTableID')
      // this.selectCourseMode = xy.param.getValues('selectCourseMode')
      // if (this.selectCourseMode == 0) {
      //   this.textMode = '门'
      // } else {
      //   this.textMode = '点'
      // };
      // this.titleName = xy.param.getValues('titleName')

      this.classTableID = this.$route.query.classTableID
      this.selectCourseMode = this.$route.query.selectCourseMode
      if (this.selectCourseMode === 0) {
        this.textMode = '门'
      } else {
        this.textMode = '点'
      };
    },
    mounted () {
      this.getTP()
    },
    methods: {
      async getTP () {
        this.xy.loading()
        let res = await this.xy.get(
          `${this.$store.state.apiPath}/api/StudentOnLineSelectCourse/GetSchoolBasedGrabPreviewList`, { classTableID: this.classTableID, isShow: true, studentID: this.studentID }
        )
        this.xy.unloading()
        if (res.success) {
          this.crouseList = res.data
        }
      },
      // 关闭
      close: function () {
        this.$router.back()
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
