<template>
    <div id="FuncInfo">
        <!-- <div class="title-describe" v-text='direction'></div> -->
        <div class="setting-main">
          <div class="adjust-flex">
            <div class="adjust-align" :class="isUnderlineShow ? 'active':''" @click="ExamSettingRoom">
                <span>考场设置</span>
            </div>
            <div class="adjust-align" :class="!isUnderlineShow ? 'active':''" @click="ExamSettingTeacher">
                <span>监考设置</span>
            </div>
          </div>
          <div class="main-body">
            <router-view @change="change"></router-view>
          </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'ExamSetting',
    data () {
      return {
        comName: 'ExamSettingRoom',
        isUnderlineShow: true
      }
    },
    created () {
    },
    watch: {
      '$route': {
        handler (val) {
          // console.log(val)
          if (val.name === 'ExamSettingTeacher') {
            this.isUnderlineShow = false
          } else {
            this.isUnderlineShow = true
          }
        },
        immediate: true
      }
    },
    methods: {
      change (val) {
        this.$emit('change', val)
      },
      ExamSettingRoom () {
        this.isUnderlineShow = true
        this.$store.commit('common/getParam', null)
        this.$router.push({ name: 'ExamSettingRoom',
                            query: this.$store.state.common.menuInfo })
      },
      ExamSettingTeacher () {
        this.isUnderlineShow = false
        this.$store.commit('common/getParam', null)
        this.$router.push({ name: 'ExamSettingTeacher',
                            query: this.$store.state.common.menuInfo })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../Css/ArrangeExamRoom/ExamSetting.less';
</style>
