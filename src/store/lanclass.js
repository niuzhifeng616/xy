const lanclass = {
  namespaced: true,
  state: {
    mainSchoolObj: {}
  },
  mutations: {
    changeMainSchoolObj (state, val) {
      state.mainSchoolObj = val
    }
  }
}
export default lanclass
