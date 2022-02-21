<template>
  <div id="learningSetting">
    <div class="learning-title">学习阶段配置</div>
    <row>
      <i-col span="8" v-for="(item, index) in settingList" :key="index">
        <div class="learning">
          <div class="clearfix">
            <div class="fl">
              <img
                v-if="index == 0"
                class="perpson-img"
                src="@/assets/common/ams/learing3.png"
                />
              <img
                v-if="index == 1"
                class="perpson-img"
                src="@/assets/common/ams/learing4.png"
                />
              <img
                v-if="index == 2"
                class="perpson-img"
                src="@/assets/common/ams/learing5.png"
                />
            </div>
            <div class="fr pr" style="margin-right:53px;">
              <p class="learning-type" style="">{{ item.StudentGradeName }}</p>
              <i-switch
                size="large"
                @on-change="change(item)"
                v-model="item.Active"
                >
                <span slot="open">显示</span>
                <span slot="close">隐藏</span>
              </i-switch>
            </div>
          </div>
        </div>
      </i-col>
    </row>
  </div>
</template>

<script>
  import { urlSets } from './urlSets.js'
  export default {
    name: 'AMS_LearningPhase',
    props: {
      AMSGbVal: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        serviceUrl: this.apiAMS,
        settingList: []
      }
    },
    created: function () {},
    mounted: function () {
      this.loadSetting()
    },
    methods: {
      // 学习阶段显示状态更新
      async change (item) {
        // item.Active = item.Active ? false : true

        var studentGrade = {}
        studentGrade.AccountID = this.AMSGbVal.accountID
        studentGrade.StudentGradeID = item.StudentGradeID
        studentGrade.Active = !!item.Active
        this.xy.loading()
        const res = await this.xy.post(
          `${this.serviceUrl}${urlSets.changeStudentGradeStatus}`,
          studentGrade,
          true
        )
        if (res.success) {
          this.xy.msgSuc('更新成功。')
        } else {
          this.xy.msgError('更新失败。')
        }
        this.xy.unloading()
      },
      async loadSetting () {
        this.xy.loading()
        const res = await this.xy.get(
          `${this.serviceUrl}${urlSets.getStudentGradeStatus}`,
          { accountID: this.AMSGbVal.accountID }
        )
        if (res.success) {
          this.settingList = res.data
        }
        this.xy.unloading()
      }
    }
  }
</script>
