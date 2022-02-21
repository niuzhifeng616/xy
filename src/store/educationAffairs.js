const educationAffairs = {
  namespaced: true,
  state: {
    achievementRecordSearch: {}, // 成绩档案：考试管理-跳转到各个页面返回时保留搜索条件（创建/编辑考试、考试类型）
    teachingQualitySearch: {}, // 教学质量：成绩分析-跳转到明细返回时保留搜索条件
    arrange: {} // 排考场步骤一状态管理
  },
  mutations: {
    changeAchievementRecordSearch (state, val) {
      state.achievementRecordSearch = val
    },
    changeTeachingQualitySearch (state, val) {
      state.teachingQualitySearch = val
    },
    changeArrange (state, val) {
      state.arrange = val
    }
  }
}
export default educationAffairs
