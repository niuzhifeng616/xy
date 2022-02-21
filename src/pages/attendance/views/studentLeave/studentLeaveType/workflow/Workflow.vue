<template>
  <div>
    <!-- 调用审批流组件 -->
    <!--
      type：必须传值  （0：教师请假  1：公文流转  2：代调课  3：学生请假）
      workflowList：必须传值  （审批流数据）
      submitWorkflow：点击发布按钮调用的方法
     -->
    <WorkFlow :type="type" :workflowList="workflowList" @listenWorkflow="submitWorkflow" @listenClose="closeWorkflow"/>
  </div>
</template>
<script>
  import WorkFlow from '@/components/workflow/Workflow.vue'
  export default {
    name: 'Workflow',
    data () {
      return {
        type: 3, // 0：教师请假  1：公文流转  2：代调课  3：学生请假
        workflowList: {}
      }
    },
    components: {
      WorkFlow
    },
    props: [],
    created () {
      this.getWorkflowData()
    },
    methods: {
      async getWorkflowData () { // 获取审批流数据，目前教师请假，学生请假，代调课的获取审批流api就用下面的
        this.xy.loading()
        let res = await this.xy.get(
          this.$store.state.apiPublic + `/api/WorkFlowSetting/GetStudentLeaveGroupFlow`, {
            workFlowType: 3 // 0：教师请假  1：公文流转  2：代调课  3：学生请假
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
        } else {
          this.xy.msgError(res.data.msg)
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
<style lang="less" scoped>
</style>
