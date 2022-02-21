<!--选课时间 -->
<template>
  <div id="crouseRules">
    <!-- <Alert show-icon closable>在选课起止时间之内学生用自己帐号登录系统可以进行选课或重选。</Alert> -->
    <div class="select-time">
      <div class="label">
        <label class="required">预览时间</label>
        <date-picker type="datetimerange"
                     v-model="timeRule.previewTime"
                     @on-change='previewTimeFun'
                     :value='timeRule.previewTime'
                     format="yyyy-MM-dd HH:mm"
                     placeholder="请选择预览时间"
                     style="width: 300px"
                     :editable="false"></date-picker>
      </div>
      <div class="label">
        <label class="required">选课时间</label>
        <date-picker type="datetimerange"
                     v-model="timeRule.selectedSubTime"
                     @on-change='selectedSubTimeFun'
                     :value='timeRule.previewTime'
                     format="yyyy-MM-dd HH:mm"
                     placeholder="请选择选课时间"
                     style="width: 300px"
                     :editable="false"></date-picker>
      </div>
      <div class="label">
        <label style="vertical-align:top"
               class="noRequired">选课说明</label>
        <i-input v-model="requirement"
                 maxlength="200"
                 show-word-limit
                 type="textarea"
                 placeholder="请输入描述文字"
                 style='width:300px'
                 :rows="4" />
      </div>

      <div class="label">
        <checkbox v-model="timeRule.single"
                  style="font-size:14px; margin-left:90px;">允许重选（勾选后学生在选课时间内可重复提交选课结果）</checkbox>
      </div>
      <div class="label">
        <checkbox v-model="timeRule.helpTxt"
                  style="font-size:14px; margin-left:90px;">是否允许查看帮助文档</checkbox>
        <!-- <span style="color: #1890FF;">查看文档</span> -->
      </div>
      <div class="label">
        <checkbox v-model="timeRule.selectedStudents"
                  style="font-size:14px; margin-left:90px;"> 允许查看已选人数</checkbox>
      </div>
    </div>
    <div class="select-time"
         style="padding-left: 90px;">
      <Button class="xy-btn-primary"
              shape="circle"
              @click="timeRuleSubmit"
              :disabled="layeredStepsHeader.isOperation != 0">保存</Button>
    </div>
  </div>

</template>

<script>

  export default {
    data () {
      return {
        timeRule: { // 选课时间
          selectedSubTime: '', // 选课时间
          previewTime: '', // 预览时间
          single: false,
          helpTxt: true,
          selectedStudents: false
        },
        requirement: '',
        layeredSelectRotationID: 0,
        layeredStepsHeader: {}
      }
    },

    mounted () {
      this.layeredStepsHeader = this.$parent.$parent
      this.getTP()
    },
    methods: {
      previewTimeFun (e) {
        this.timeRule.previewTime = e
      },
      selectedSubTimeFun (e) {
        this.timeRule.selectedSubTime = e
      },
      // 获取选课时间
      getTP: function () {
        let that = this
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetSelectCourseSettingList`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID
        }).then(res => {
          if (res.success) {
            if (res.data.FormalChoseStartDate !== '0001-01-01 00:00:00') {
              that.timeRule.selectedSubTime = [res.data.FormalChoseStartDate, res.data.FormalChoseEndDate]
            }
            if (res.data.PreviewStartDate !== '0001-01-01 00:00:00') {
              that.timeRule.previewTime = [res.data.PreviewStartDate, res.data.PreviewEndDate]
            }
            // $('#summernote').summernote('code', res.data.OnLineSelectCourseRequirement)
            that.requirement = res.data.SelectCourseExplain
            that.timeRule.single = res.data.IsAllowReselection
            that.timeRule.selectedStudents = res.data.IsAllowViewNumber
            that.timeRule.helpTxt = res.data.IsAllowHelpDocument
            that.layeredSelectRotationID = res.data.layeredSelectRotationID
          }
          this.xy.unloading()
        })
      },
      // 选课时间保存
      timeRuleSubmit: function () {
        if (this.layeredStepsHeader.isOperation === 0) {
          let that = this
          if (that.timeRule.previewTime[0] === '') {
            this.xy.msgError('预览时间不能为空。')
            return false
          } else if (that.timeRule.selectedSubTime[0] === '') {
            this.xy.msgError('选课时间不能为空。')
            return false
          } else if (that.timeRule.selectedSubTime[0] <= that.timeRule.previewTime[0]) {
            this.xy.msgError('选课时间必须大于预览时间。')
            return false
          }
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/EditLayeredSelectProgrammeSelectCourseSetting`, {
            // LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
            LayeredSelectRotationID: that.layeredSelectRotationID,
            FormalChoseStartDate: that.timeRule.selectedSubTime[0],
            FormalChoseEndDate: that.timeRule.selectedSubTime[1],
            PreviewStartDate: that.timeRule.previewTime[0],
            PreviewEndDate: that.timeRule.previewTime[1],
            IsAllowReselection: that.timeRule.single,
            SelectCourseExplain: that.requirement,
            IsAllowHelpDocument: that.timeRule.helpTxt,
            IsAllowViewNumber: that.timeRule.selectedStudents
          }).then(res => {
            if (res.success) {
              that.xy.msgSuc('保存成功。')
            }
            this.xy.unloading()
          })
        }
      }
    }

  }
</script>
<style lang='less' scoped>
.ivu-btn[disabled] {
  color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.04);
}
</style>
