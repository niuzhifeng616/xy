<template>
  <!-- 分层选课:去预览/查看选课结果 -->
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div class="layered-header">
        <div>
          <span class="header1">{{obj.ClassTableName}}</span>
          <span v-if="subjectData.IsAllowHelpDocument">
            <Icon type="ios-help-circle-outline" color="#4196FF" size="16" />
            <span class="header2">帮助文档</span>
          </span>
        </div>
      </div>
      <div class="layered-instruction">
        <p class="col0-65">
          <span>选课时间: {{obj.FormalChoseStartDate}} - {{obj.FormalChoseEndDate}}</span>
          <span>本次选课最少选{{subjectData.MinOptionalCourse}}门，最多选{{subjectData.MaxOptionalCourse}}门。</span>
        </p>
        <Alert show-icon closable style="margin-top: 10px;">选课说明:{{subjectData.SelectCourseExplain}}</Alert>
      </div>
      <div class="layered-body">
        <div v-if="subjectData.List.length>0">
          <div v-for="subGroup in subjectData.List"
                :key="subGroup.SubjectGroupID"
                style="margin-bottom:10px;">
            <div>
              <span style="font-weight:bold;color:#000;">{{subGroup.SubjectGroupName}}</span>
              <span class="col0-65">
                本组选课最少选{{subGroup.MinSubjectNum}}门，最多选{{subGroup.MaxSubjectNum}}门。
              </span>
            </div>
            <ul class="subject-ul">
              <li
                class="subject-box"
                :class="item.IsSelected?'subject-box-active':''"
                v-for="item in subGroup.Courses"
                :key="item.CoursePlanID">
                <div>
                  <p class="col0-85 f16" style="font-weight:bold;">
                    {{item.SubjectName}}
                  </p>
                  <p v-if="subjectData.IsAllowViewNumber" class="col0-45 mt-15">
                    已选{{item.SelectCount}}人
                  </p>
                </div>
                <div>
                  <img :src="require('@/assets/onlineCourseSelection/layered.png')"
                    style="width:39px;height:45px;" />
                </div>
                <div class="select-icon" v-if="item.IsSelected">
                  <Icon type="ios-checkmark" color="#fff" size="22" />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="subjectData.List.length==0" class="no-data-box">
          <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
          <span class="no-data-text">暂无相关课程。</span>
        </div>
      </div>
      <div class="layered-fotter">
        <Button class="xy-btn-primary" shape="circle" @click="backResult">关闭</Button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'OnlineChooseCourseLayeredView',
    components: {},
    data () {
      return {
        obj: null,
        classTableID: 0,
        subjectData: {
          List: []
        }
      }
    },
    created () {
      //   if (xy.param.getValues('obj', 1) != undefined) {
      //     this.obj = xy.param.getValues('obj', 1)
      //     this.classTableID = this.obj.ClassTableID
      //   } else {
      //     this.obj = xy.param.getValues('obj')
      //     this.classTableID = this.obj.ClassTableID
      //   }

      this.obj = this.$store.state.csmstimetable.onlineChooseCourseLayeredItem
      this.classTableID = this.obj.ClassTableID
    },
    mounted () {
      this.getLayeredSelectCourseList()
    },
    methods: {
      // 获取课程
      async getLayeredSelectCourseList () {
        this.xy.loading()
        let res = await this.xy.get(
          `${this.$store.state.apiPath}/api/StudentOnLineSelectCourse/GetLayeredSelectCourseResultList`,
          { ClassTableID: this.classTableID, collectionID: this.obj.CollectionID }
        )
        this.xy.unloading()
        if (res.success) {
          this.subjectData = res.data
        }
      },
      // 返回选课结果页面
      backResult () {
        this.$router.back()
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/layered.css';
</style>
