<template>
  <div class="PublishResult xy-content-body"
       id="StepsHeader">
    <div style="margin:50px auto;"
         class="text-center">
      <img v-if='publishTxt==="未开始"'
           src="@/assets/csmsTimeTable/noStart.png"
           alt="">
      <img v-else-if='publishTxt==="进行中"'
           src="@/assets/csmsTimeTable/selecting.png"
           alt="">
      <img v-else-if='publishTxt==="已发布"'
           src="@/assets/csmsTimeTable/publishSuccess.png"
           alt="">
      <img v-else-if='publishTxt==="已结束"'
           src="@/assets/csmsTimeTable/publishEnd.png"
           alt="">
      <div class="publish-info">
        <h3>{{publishTxt}}!</h3>
        <h3>{{info.LayeredSelectRotationName}}</h3>
        <p class="info">已选/总人数：<span>{{info.SelectStuCount}}/{{info.TotalStuCount}}</span></p>
        <p class="info">起止时间：<span>{{info.FormalChoseStartDateName}}-{{info.FormalChoseEndDateName}}</span></p>
      </div>
      <div class="publish-btn">
        <Button class="xy-btn-primary"
                shape="circle"
                @click='exportFile'>导出确认单</Button>
        <span @click='cancel'
              v-if='info.IsPublished'
              class="btn">取消发布</span>
        <span @click='publish'
              v-else
              :class="publishTxt==='已结束'?'btn':'disabledBtn'">发布</span>
      </div>
    </div>

  </div>
</template>

<script>

  export default {
    data () {
      return {
        layeredStepsHeader: {},
        publishTxt: '',
        info: {
          FormalChoseEndDate: '',
          FormalChoseStartDate: '',
          IsPublished: false,
          LayeredSelectProgrammeID: 0,
          LayeredSelectRotationName: null,
          SelectStuCount: 0,
          TotalStuCount: 0
        }
      }
    },

    created: function () {
      this.layeredStepsHeader = this.$parent
      this.getIsPublish()
    },
    methods: {
      // 判断是否可以显示发布按钮
      async  getIsPublish () {
        // LayeredSelectProgrammeState 0 未开始  1 进行中 2 已结束 3  已发布
        let that = this
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetPublishInfo`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID
        })
        if (res.success) {
          that.info = res.data
          this.xy.unloading()
          if (that.info.FormalChoseStartDateName === '0001-01-01 00:00') {
            that.info.FormalChoseStartDateName = ''
          }
          if (that.info.FormalChoseEndDateName === '0001-01-01 00:00') {
            that.info.FormalChoseEndDateName = ''
            that.publishTxt = '未开始'
            return false
          }

          let now = new Date().getTime()
          let start = new Date(res.data.FormalChoseStartDateName.replace(/-/g, '/')).getTime()
          let end = new Date(res.data.FormalChoseEndDateName.replace(/-/g, '/')).getTime()
          if (res.data.IsPublished) {
            that.publishTxt = '已发布'
          } else {
            if (now > end) {
              that.publishTxt = '已结束'
              return false
            }

            if (start < now && now < end) {
              that.publishTxt = '进行中'
              return false
            }
            if (start > now) {
              that.publishTxt = '未开始'
              return false
            }
          }
        } else {
          that.xy.msgError(res.msg)
        };
        this.xy.unloading()
      },
      async publish () {
        if (this.publishTxt !== '已结束') return false
        let that = this
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/EditLayeredSelectPreselectionState`, {
          LayeredSelectRotationID: this.info.LayeredSelectRotationID,
          isPublished: true
        })

        if (res.success) {
          that.xy.msgSuc('发布成功。')
          that.getIsPublish()
          this.layeredStepsHeader.getGeneralFlows() // 成功后步骤可以点击
        } else {
          that.xy.msgError(res.msg)
        };
        this.xy.unloading()
      },
      async  cancel () {
        let that = this
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/EditLayeredSelectPreselectionState`, {
          LayeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID,
          isPublished: false
        })

        if (res.success) {
          that.getIsPublish()
          this.layeredStepsHeader.getGeneralFlows()
        } else {
          that.xy.msgError(res.msg)
        };
        this.xy.unloading()
      },
      exportFile: function () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/ExpertStuAutographList`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
          LayeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID
        })
      }
    }

  }
</script>
<style lang='less' scoped>
.publish-info {
  width: 557px;
  height: 198px;
  background: rgba(245, 245, 245, 0.5);
  border-radius: 2px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
