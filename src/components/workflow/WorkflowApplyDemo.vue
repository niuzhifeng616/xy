<template>
  <div>
    <Button type="primary" @click="getWorkflow">审批流选择</Button>
    <Button type="primary" @click="getWorkflowInfo">查询审批流数据</Button>
    <WorkflowApply :workflow=workflow />
  </div>
</template>
<script>
  import WorkflowApply from '@/components/workflow/WorkflowApply.vue'
  export default {
    name: 'WorkflowApplyDemo',
    components: {
      WorkflowApply
    },
    data () {
      return {
        workflow: []
      }
    },
    methods: {
      async getWorkflow () {
        this.xy.loading()
        let res = await this.xy.post(`http://192.168.20.177:27097/api/WorkFlowSetting/ApprovalProcessByCondition`, {
          'ApplicantUserID': 65285,
          'OrganizationID': 0,
          'WorkFlowType': 0,
          'ConditionValues': [{ 'Type': 0, 'Code': 1, 'Value': 2 }, { 'Type': 0, 'Code': 2, 'Value': 1 }] })
        if (res.success) {
          this.workflow = res.data
        }
        this.xy.unloading()
      },
      getWorkflowInfo () {
        console.log(this.workflow)
      }
    }
  }
</script>
