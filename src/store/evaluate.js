const evaluate = {
  namespaced: true,
  state: {
    evaluate: {
      adminClass: {}, // 评价统计-行政班
      myEvaluate: {}, // 评价统计-我的课堂评价
      teachingClass: {} // 评价统计-教学班
    },
    evaRowObj: {}, // 学生评教>评教方案row
    evaQuestion: {}, // 学生评教>评教问卷
    evaMyLuate: {}, // 学生评教>我的评价
    evaluateDetails: {}, // 学生评教>评价教师
    evaSumDetail: {}, // 学生评教>汇总统计，问答题明细
    evaPlanObj: {}, // 课堂评价方案
    activityObj: {}, // 活动课程评价方案
    activityStaObj: {}, // 活动课程统计数据
    averageObj: {}, // 课堂评价统计
    changeMoralObj: {},
    topHeader: [], // 教学评价-头部导航
    moralEducationObj: {}, // 德育统计
    scoringType: '', // 德育统计评价设置类型,
    evaClass: '', // 评价维度
    isChangeClass: true,
    DisciplineID: 0,
    dipperObj: {}, // 北斗七星方案
    honorObj: {}, // 荣誉管理
    selfObj: {} // 自主申报
  },
  mutations: {
    // 教学评价-头部导航
    changetopHeader (state, val) {
      state.topHeader = val
    },
    // 评价统计-行政班
    changeAdminClass (state, val) {
      state.evaluate.adminClass = val
    },
    // 评价统计-我的课堂评价
    changeMyEvaluate (state, val) {
      state.evaluate.myEvaluate = val
    },
    // 评价统计-教学班
    changeTeachingClass (state, val) {
      state.evaluate.teachingClass = val
    },
    // 学生评教>评教方案row
    changeEvaRowObj (state, val) {
      state.evaRowObj = val
    },
    // 学生评教>评教问卷
    changeEvaQuestion (state, val) {
      state.evaQuestion = val
    },

    // 学生评教>我的评价
    changeEvaMyLuate (state, val) {
      state.evaMyLuate = val
    },
    // 学生评教>评价教师
    changeEvaluateDetails (state, val) {
      state.evaluateDetails = val
    },
    // 学生评教>汇总统计
    ChangeEvaSumDetail (state, val) {
      state.evaSumDetail = val
    },
    // 课堂评价方案
    changeEvaPlanObj (state, val) {
      state.evaPlanObj = val
    },
    // 评价统计
    changeAverageObj (state, val) {
      state.averageObj = val
    },
    // 活动课程评价
    changeActivityObj (state, val) {
      state.activityObj = val
    },
    changeActivityStaObj (state, val) {
      state.activityStaObj = val
    },
    // 德育一日评价
    changeMoralObj (state, val) {
      state.changeMoralObj = val
    },
    // 德育统计
    changeMoralEducationObj (state, val) {
      state.moralEducationObj = val
    },
    // 德育一日评价评价指标
    changeScoreType (state, val) {
      state.scoringType = val
    },
    setChangeClass (state, val) {
      state.isChangeClass = val
    },
    setDisciplineID (state, val) {
      state.DisciplineID = val
    },
    // 北斗七星
    changeEvaDipperObj (state, val) {
      state.dipperObj = val
    },
    // 荣誉申报
    changeHonorObj (state, val) {
      state.honorObj = val
    },
    changeSelfObj (state, val) {
      state.selfObj = val
    }

  }
}
export default evaluate
