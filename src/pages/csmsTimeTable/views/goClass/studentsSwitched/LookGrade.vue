<template>
  <!-- 10.学生调班-各班平均分 -->
  <div class="xy-content-body">
    <div class="xy-content-table">
        <div style="margin-bottom:10px;">
            <Button  class="xy-primary" @click="back">返回</Button>
        </div>
        <i-table border
                 :columns="averageColumns"
                 :data="averageTable"
                 :no-data-text="'暂无相关信息。'"></i-table>
    </div>
</div>
</template>
<script>
  export default {
    name: 'LookGrade',
    data () {
      return {
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        sloverResultCollectionID: JSON.parse(this.$store.state.csmstimetable.lookGrade).sloverResultCollectionID || 0,
        averageTable: [],
        averageColumns: []
      }
    },
    created () {
    },
    mounted () {
      this.geClassScore()
    },
    methods: {
      back () {
        this.$store.commit('common/getParam', { step: 9 })
        this.$router.push({
          path: `/xyhome/goClassStepsHeader/studentSwitchedTable`,
          query: this.$store.state.common.menuInfo
        })
      },
      async geClassScore () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassStudentChangeClass/GetMovingClassStudentChangeClassForClassScore?classTableID=${this.classTableID}&sloverResultCollectionID=${this.sloverResultCollectionID}`)
        this.xy.unloading()
        if (res.success) {
          this.averageColumns = res.data.columnsResult
          this.averageTable = JSON.parse(res.data.Result)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/studentsSwitched.less';
</style>
