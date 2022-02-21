<template>
  <div>
    <WorkFlow :type="type" :workflowList="workflowList" @listenWorkflow="submitWorkflow" @listenClose="closeWorkflow"/>
</div>
</template>
<script>
  import WorkFlow from '@/components/workflow/Workflow.vue'
  export default {
    name: 'ApprovalSettings',
    components: {
      WorkFlow
    },
    data () {
      return {
        type: 1,
        workflowList: {}
      }
    },
    created () {
      this.getWorkflowData()
    },
    methods: {
      async getWorkflowData () { // 获取审批流数据，目前教师请假，学生请假，代调课的获取审批流api就用下面的
        this.xy.loading()
        let res = await this.xy.get(
          this.$store.state.apiPublic + `/api/WorkFlowSetting/GetStudentLeaveGroupFlow`, {
            workFlowType: 1 // 0：教师请假  1：公文设置  2：代调课  3：学生请假
          })
        if (res.success) {
          this.workflowList = res.data
        }
        this.xy.unloading()
      },
      submitWorkflow (val) { // 点击 发布按钮调用的方法
        if (val) {
          this.publishFunc()// 调用发布api
        }
      },
      async publishFunc () {
        this.xy.loading()
        let res = await this.xy.post(
          this.$store.state.apiPublic + `/api/WorkFlowSetting/CreateApprovalTemplate`, this.workflowList)
        if (res.success) {
          this.xy.msgSuc('审批流发布成功。')
        }
        this.xy.unloading()
      },
      closeWorkflow (val) {
        if (val) {
          this.$router.go(-1)
        }
      }
    }
  }
</script>
<style lang="less">

</style>
