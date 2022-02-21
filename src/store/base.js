const base = {
  strict: true,
  namespaced: true,
  state: {
    teacherKeyWords: {},
    graduatedStudentKeyWords: {},
    studentKeyWords: {},
    parentKeyWords: {},
    roleKeyWords: {}
  },
  mutations: {
    changeValue (state, value) {
      state.teacherKeyWords = value
    },
    changeGraduatedStudentValue (state, value) {
      state.graduatedStudentKeyWords = value
    },
    changeStudentKeyValue (state, value) {
      state.studentKeyWords = value
    },
    changeParentKeyValue (state, value) {
      state.parentKeyWords = value
    },
    changeRoleValue (state, value) {
      state.roleKeyWords = value
    }
  }
}
export default base
