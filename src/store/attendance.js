const attendance = {
  strict: true,
  namespaced: true,
  state: {
    types: 0,
    item: '',
    applications: '',
    breadcrumbIDs: 0,
    breadcrumbNames: '',
    AMorPMOrderName: '',
    datas: ''
  },
  mutations: {
    setdatas (state, val) {
      state.datas = val
    },
    settypes (state, types) {
      state.types = types
    },
    setitem (state, item) {
      state.item = item
    },
    setapplications (state, applications) {
      state.applications = applications
    },
    setbreadcrumbIDs (state, breadcrumbIDs) {
      state.breadcrumbIDs = breadcrumbIDs
    },
    setbreadcrumbNames (state, breadcrumbNames) {
      state.breadcrumbNames = breadcrumbNames
    },
    setAMorPMOrderName (state, AMorPMOrderName) {
      state.AMorPMOrderName = AMorPMOrderName
    }
  }
}
export default attendance
