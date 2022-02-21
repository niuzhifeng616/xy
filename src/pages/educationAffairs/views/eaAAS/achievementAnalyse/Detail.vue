<!--教学质量：成绩分析-明细-->
<template>
    <div class="xy-content-module">
        <div class="title-con pr">
            <div class="title">{{row.AchievementRecordName}}</div>
            <ul class="title-tabs">
                <li v-for="(item, index) in liData" :key="index"
                    :class="item.isActive?'current':''"
                    @click="tab(item, index)">
                    {{item.name}}
                </li>
            </ul>
            <div class="pa" @click="returnClick" style="color: #1890FF; cursor:pointer;right:20px; top: 16px;">
                <i class="iconfont" style="margin-right: 5px; font-size: 14px; color: #1890FF;">&#xe6a5;</i>返回
            </div>
        </div>
        <div id="scoreAnalysis"></div>
        <component :is="currentComponent"></component>
    </div>
</template>
<script>
  // 年级分析
  import GradeAnalyse from './GradeAnalyse'
  // 行政班对比
  import ClassCompare from './ClassCompare'
  // 学科分析
  import SubjectAnalyse from './SubjectAnalyse'
  // 等级分分析
  import LevelScoreAnalyse from './LevelScoreAnalyse'
  // 学生成绩单
  import StudentScore from './StudentScore'

  export default {
    name: 'EaAASanalyseDetail',
    components: {
      GradeAnalyse,
      ClassCompare,
      SubjectAnalyse,
      LevelScoreAnalyse,
      StudentScore
    },
    data () {
      return {
        row: '', // 上一页考试信息
        curFFState: false, // 当前考试是否赋分了
        listSearch: {}, // 列表的搜索条件

        currentComponent: 'GradeAnalyse',
        liData: [
          {
            name: '年级分析',
            isActive: true,
            url: 'GradeAnalyse'
          },
          {
            name: '行政班对比',
            isActive: false,
            url: 'ClassCompare'
          },
          {
            name: '学科分析',
            isActive: false,
            url: 'SubjectAnalyse'
          },
          {
            name: '等级分分析',
            isActive: false,
            url: 'LevelScoreAnalyse'
          },
          {
            name: '学生成绩单',
            isActive: false,
            url: 'StudentScore'
          }
        ]
      }
    },
    created () {
      // 获取搜索条件
      if (this.$store.state.educationAffairs.teachingQualitySearch.listSearch !== undefined) {
        this.listSearch = this.$store.state.educationAffairs.teachingQualitySearch.listSearch
      }

      // 获取参数
      if (this.$store.state.educationAffairs.teachingQualitySearch.row !== undefined) {
        this.row = this.$store.state.educationAffairs.teachingQualitySearch.row
        this.curFFState = this.row.FFState
        // 未赋分时不展示等级分分析
        if (!this.curFFState) {
          this.liData.splice(3, 1)
        }
      }
    },
    mounted () {
    },
    methods: {
      // tab跳转
      tab (item, index) {
        if (!item.isActive) {
          this.liData.map(function (item) {
            item.isActive = false
            return item
          })
          item.isActive = true
          this.currentComponent = item.url
        }
      },
      // 返回
      returnClick () {
        this.$store.commit('educationAffairs/changeTeachingQualitySearch', {
          'listSearch': this.listSearch
        })

        this.$store.commit('common/getThreeMenuName')
        this.$store.commit('common/getParam', {})
        this.$router.push({ path: '/xyhome/EaAASanalyse', query: this.$store.state.common.menuInfo })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "./css/Detail.css";
</style>
