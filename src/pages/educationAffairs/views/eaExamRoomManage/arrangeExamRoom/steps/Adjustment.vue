<template>
<!-- 手动调整 -->
<div id="FuncInfo">
    <div class="adjust-flex">
        <div class="adjust-align" :class="isUnderlineShow ? 'active':''" @click="adjustStudent">
            <b>座位调整</b>
            <div v-if="isUnderlineShow" class="adjust-align-underline"></div>
        </div>
        <div class="adjust-align" :class="!isUnderlineShow ? 'active':''" @click="adjustTeacher">
            <b>监考调整</b>
            <div v-if="!isUnderlineShow" class="adjust-align-underline"></div>
        </div>
    </div>
    <router-view></router-view>
</div>

</template>
<script>
  export default {
    name: 'Adjustment',
    data () {
      return {
        isUnderlineShow: true
      }
    },
    methods: {
      adjustStudent () {
        this.isUnderlineShow = true
        this.$store.commit('common/getParam', null)
        this.$router.push({ name: 'AdjustmentStudent',
                            query: this.$store.state.common.menuInfo })
      },
      adjustTeacher () {
        this.isUnderlineShow = false
        this.$store.commit('common/getParam', null)
        this.$router.push({ name: 'AdjustmentTeacher',
                            query: this.$store.state.common.menuInfo })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../Css/ArrangeExamRoom/Adjustment.less';
</style>
