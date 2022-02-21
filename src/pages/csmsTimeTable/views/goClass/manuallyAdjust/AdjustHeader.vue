<template>
  <!-- 8.手动调整 -->
  <div class="xy-content-body">
    <div class="text-center" v-if="showScheduleName !== ''">
        <h1 style="font-size:16px;font-weight:bold">{{showScheduleName}}</h1>
    </div>
    <div class="title">
        <span v-for="(item, index) in liData" :key="index"
            class="col0-85"
            :class="item.isActive?'is-active':''"
            @click="changeTab(item, index)">
            {{item.name}}
        </span>
    </div>
    <component :is="currentComponent"></component>
  </div>
</template>
<script>
  import GradeSchedule from './GradeSchedule'
  import TeacherSchedule from './TeacherSchedule'
  import AnalysisSchedule from './AnalysisSchedule'

  export default {
    components: {
      GradeSchedule,
      TeacherSchedule,
      AnalysisSchedule
    },
    name: 'AdjustHeader',
    data () {
      return {
        currentComponent: 'GradeSchedule',
        sloverResultCollectionID: 0,
        showScheduleName: '',

        liData: [
          {
            name: '年级课表',
            isActive: true,
            url: 'GradeSchedule'
          },
          {
            name: '教师课表',
            isActive: false,
            url: 'TeacherSchedule'
          },
          {
            name: '课表分析',
            isActive: false,
            url: 'AnalysisSchedule'
          }
        ]
      }
    },
    created () {
      if (this.$store.state.csmstimetable.manualAdjust.sloverResultCollectionID !== 0) {
        this.sloverResultCollectionID = this.$store.state.csmstimetable.manualAdjust.sloverResultCollectionID
      }
      if (this.$store.state.csmstimetable.manualAdjust.showScheduleName !== '') {
        this.showScheduleName = this.$store.state.csmstimetable.manualAdjust.showScheduleName
      }
    },
    mounted () {
    },
    methods: {
      changeTab (item, index) {
        if (!item.isActive) {
          this.liData.map((item) => {
            item.isActive = false
            return item
          })
          item.isActive = true
          this.currentComponent = item.url
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/manuallyAdjust.less';
  .primary-btn-ghost {
    margin-right: 5px;
  }
</style>
