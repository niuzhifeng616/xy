const csmstimetable = {
  namespaced: true,
  state: {
    layeredRowObj: {},
    smartRowObj: {},
    admininstrativeRowObj: {}, // 行政班排课
    onlineChooseCourseLayeredItem: {}, // 在线选课列表-分层选课点击去选课按钮所传参数
    takeLessonsRowObj: {}, // 校本排课创建编辑（抢课式）
    takeLessonsLearningPeriodManage: {}, // 校本排课（抢课式）跳转到学段管理
    takeLessonsGoSelectResult: {}, // 校本排课（抢课式）跳转到（在线选课选课结果）
    roomTableGoRowRoom: {}, // 设置教室table跳转到排教室
    roomGoAutoAdjust: {}, // 排教室跳转至快速排教室
    adjustTableRow: {}, // 行政班调课数据

    goClassRowObj: {}, // 走班排课创建编辑row信息
    classScheduleKW: {}, // 走班排课：先选
    classComValKW: {}, // 走班排课：先选-步骤页公用参数
    countTable: {}, //  走班排课：选课结果
    ruleHeaderKW: {}, // 走班排课：选课规则
    selfStudyStudent: {}, // 走班排课：排自习
    lookGrade: {}, // 走班排课：学生调班-各班平均分
    studentAdjust: {}, // 走班排课：学生调班-调整
    manualAdjust: {}, // 走班排课：手动调整步骤id

    scheduleQuery: {}, // 课表汇总

    classTableID: [
      {
        id: 1,
        name: '行政班排课'
      },
      {
        id: 3,
        name: '走班排课（先选）'
      },
      {
        id: 4,
        name: '校本排课（抢课）'
      }
    ]

  },
  mutations: {
    changeAdmininstrativeRowObj (state, val) {
      state.admininstrativeRowObj = val
    },
    changeLayeredRowObj (state, val) {
      state.layeredRowObj = val
    },
    changeSmartRowObj (state, val) {
      state.smartRowObj = val
    },
    setOnlineChooseCourseLayeredItem (state, val) {
      state.onlineChooseCourseLayeredItem = val
    },
    setTakeLessonsRowObj (state, val) {
      state.takeLessonsRowObj = val
    },

    setTakeLessonsLearningPeriodManage (state, val) {
      state.takeLessonsLearningPeriodManage = val
    },
    setTakeLessonsGoSelectResult (state, val) {
      state.takeLessonsGoSelectResult = val
    },

    setRoomTableGoRowRoom (state, val) {
      state.roomTableGoRowRoom = val
    },
    setRoomGoAutoAdjust (state, val) {
      state.roomGoAutoAdjust = val
    },

    // 行政班调课数据
    changeAdjustTableRow (state, val) {
      state.adjustTableRow = val
    },

    setGoClassRowObj (state, val) {
      state.goClassRowObj = val
    },
    // 走班排课：先选
    changeClassScheduleKW (state, val) {
      state.classScheduleKW = val
    },
    // 走班排课：先选-步骤页公用参数
    changeClassComValKW (state, val) {
      state.classComValKW = val
    },
    changeClassComValKWbase (state, val) {
      state.classComValKW.base = val // .base存发布状态 isOperation1 isOperation
    },
    changeClassComValKWnew (state, val) {
      state.classComValKW.new = val // .new存创建后的方案classTableID
    },
    // 走班排课：选课结果
    changeCountKW (state, val) {
      state.countTable = val
    },
    // 走班排课：选课规则
    changeRuleKW (state, val) {
      state.ruleHeaderKW = val
    },
    changeByIndexMoreKW (state, val) {
      for (const i in state.ruleHeaderKW.moreVal) {
        if (i === val + '') {
          state.ruleHeaderKW.moreVal[i].isActive = true
        } else {
          state.ruleHeaderKW.moreVal[i].isActive = false
        }
      }
    },

    // 走班排课：排自习
    changeSelfStudyStudent (state, val) {
      state.selfStudyStudent = val
    },
    // 走班排课：学生调班-各班平均分
    changeLookGrade (state, val) {
      state.lookGrade = val
    },
    // 走班排课：学生调班-调整
    changeStudentAdjust (state, val) {
      state.studentAdjust = val
    },
    // 走班排课：手动调整步骤id
    changeManualAdjust (state, val) {
      state.manualAdjust = val
    },
    // 课表汇总
    changeScheduleQuery (state, val) {
      state.scheduleQuery = val
    }
  }
}
export default csmstimetable
