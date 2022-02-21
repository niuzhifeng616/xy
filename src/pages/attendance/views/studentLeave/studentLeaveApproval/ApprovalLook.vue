<template>
  <div>
    <div class="xy-content-title clearfix">
        <div class="fl">
            <i-button class="primary" @click="ReturnClick" ghost>返回</i-button>
        </div>
    </div>
    <div class="xy-content-body clearfix">
        <div class="dialog-model-content">
            <div class="dialog-model-content" style="width:600px;margin: 0 auto;">
                <i-form id="approvalIsPass" :label-width="100">
                    <form-item label="请假人">
                        <div class="form-item-r">{{StudentName}}</div>
                    </form-item>
                    <form-item label="请假类型">
                        <div class="form-item-r">{{LeaveTypeName}}</div>
                    </form-item>
                    <form-item label="申请时间">
                        <div class="form-item-r">{{CreatedDate}}</div>
                    </form-item>
                    <form-item label="请假时间">
                        <div class="form-item-r">
                            <p slot="right" v-cloak>
                                {{StartTime}} {{StartDay}} {{StartAMorPMOrderFullName}} 至
                            </p>
                            <p v-cloak>
                                {{EndTime}} {{EndDay}} {{EndAMorPMOrderFullName}}
                            </p>
                        </div>
                    </form-item>
                    <form-item label="请假事由">
                        <div class="form-item-r">{{ApplicationDescription}}</div>
                    </form-item>
                    <form-item label="请假图片">
                        <div v-if="LeavePermitSrc == ''" class="form-item-r">无</div>
                        <div v-else class="form-item-r">
                            <img :src="LeavePermitSrc" style="height:100px;width:100px;">
                        </div>
                    </form-item>
                    <form-item label="申请人">
                        <div class="form-item-r">{{SubstituteName}}</div>
                    </form-item>
                    <form-item label="抄送人">
                        <div style="font-size:14px;margin-left:20px;display:inline-block" v-for="(item, index) in RecordDescribes" :key="index">{{item.Describe}}</div>
                    </form-item>
                    <form-item label="审批结果" labelFor="ApplicationState">
                        <radio-group v-model="ApplicationState" elementId="ApplicationState" size="large" class="form-item-r">
                            <radio label="2" disabled>
                                <span>同意</span>
                            </radio>
                            <radio label="3" disabled>
                                <span>拒绝</span>
                            </radio>
                        </radio-group>
                    </form-item>
                    <form-item label="审核意见" labelFor="DeniedDescription">
                        <i-input type="textarea" v-model="DeniedDescription" elementId="DeniedDescription" disabled></i-input>
                    </form-item>
                </i-form>
            </div>
        </div>
    </div>
    </div>

</template>
<script>
  export default {
    data () {
      return {
        StudentName: '',
        StartTime: '',
        EndTime: '',
        SubstituteName: '',
        ApplicationDescription: '',
        ApplicationState: '',
        DeniedDescription: '',
        RecordDescribes: [],
        LeavePermitSrc: '',
        CreatedDate: '',
        LeaveTypeName: ''
      }
    },
    created () {
      this.StudentName = this.$route.params.StudentName
      this.StartTime = this.$route.params.StartTime
      this.EndTime = this.$route.params.EndTime
      this.SubstituteName = this.$route.params.SubstituteName
      this.editId = this.$route.params.editId
      this.ApplicationDescription = this.$route.params.ApplicationDescription
      this.ApplicationState = this.$route.params.ApplicationState.toString()
      this.DeniedDescription = this.$route.params.DeniedDescription
      this.LeavePermitSrc = this.$route.params.LeavePermitSrc// 图片
      this.LeaveTypeName = this.$route.params.LeaveTypeName// 请假类型
      this.CreatedDate = this.$route.params.CreatedDate// 开始时间
      this.EndDay = this.$route.params.EndDay
      this.EndAMorPMOrderFullName = this.$route.params.EndAMorPMOrderFullName
      this.StartDay = this.$route.params.StartDay
      this.StartAMorPMOrderFullName = this.$route.params.StartAMorPMOrderFullName
    },
    mounted () {
      this.RecordDescribes = this.getCC()
    },
    methods: {
      // 返回
      ReturnClick () {
        this.$router.back()
      },
      // 抄送人
      getCC () {
        let ary = []
        this.xy.get(`${this.$store.state.apiPath}/api/StudentLeaveType/GetLeaveSetting`, {}).then(res => {
          if (res.success) {
            let result = res.data
            for (let i = 0; i < result.length; i++) {
              if (result[i].LeaveSettingType === 'CC' && result[i].IsEnabled) {
                ary.push(result[i])
              }
            }
          }
        })
        return ary
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
