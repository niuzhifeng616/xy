const infoPublic = {
  namespaced: true,
  state: {
    types: 0,
    applications: '',
    breadcrumbIDs: 0,
    breadcrumbNames: '',
    item: ''
  },
  mutations: {
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
    }

  }
}
export default infoPublic
