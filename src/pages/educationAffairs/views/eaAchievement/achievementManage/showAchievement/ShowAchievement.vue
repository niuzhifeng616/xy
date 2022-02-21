<template>
  <div>
    <!-- 成绩查看 -->
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
  import StudentShowAchievement from './StudentShowAchievement.vue'
  import AdminShowAchievement from './AdminShowAchievement.vue'
  import HeadmasterShowAchievement from './HeadmasterShowAchievement.vue'
  export default {
    name: 'showAchievement',
    components: {
      StudentShowAchievement,
      AdminShowAchievement,
      HeadmasterShowAchievement
    },
    data () {
      return {
        APIPath: this.$store.state.apiPath + '/api/Achievement',
        type: 1,
        currentComponent: ''
      }
    },
    created () {
      // 重定向页面
      this.xy.get(this.APIPath + '/GeUserType', null).then(res => {
        this.type = res.data
        if (this.type === 1) {
          // 学生
          this.currentComponent = StudentShowAchievement
        } else if (this.type === 2 || this.type === 4) {
          // 管理员
          this.currentComponent = AdminShowAchievement
        } else if (this.type === 3) {
          // 班主任
          this.currentComponent = HeadmasterShowAchievement
        }
      })
    },
    mounted () {
      this.$Message.config({
        top: 70,
        duration: 2
      })
    },
    methods: {

    }
  }
</script>
