<template>
  <div>
    <Button type="primary" @click="view">查看</Button>
    <WorkflowApproval :workflow="workflow" />
  </div>
</template>
<script>
  import WorkflowApproval from '@/components/workflow/WorkflowApproval.vue'
  export default {
    name: 'WorkflowApprovalDemo',
    components: {
      WorkflowApproval
    },
    data () {
      return {
        workflow: []
      }
    },
    methods: {
      async view () {
        let res = await this.xy.get(`http://192.168.20.177:27095/api/TeacherLeave/GetDetailByID?id=13002`)
        if (res.success) {
          this.workflow = res.data.ApprovalFlow
        }
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
