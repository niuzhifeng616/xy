
const common = {
  namespaced: true,
  state: {
    accountName: '',
    userBaseInfo: {},
    nodeOption: {},
    isAntPopover: false,
    appUserOption: {},
    appUserModal: false,
    ccUserOption: {},
    ccUserModal: false,
    conditionOption: {},
    conditionModal: false,
    menuInfo: {
      xy: '',
      menuName: ''
    },
    targetXY: '0,0',
    wrapXY: '0,0',
    menuId: '',
    moduleList: [],
    serviceDomainList: [],
    currentNodeId: {},
    msgParam: '',
    automaticLogOutTime: null,
    clickTime: null,
    actnumber: '',
    xyMedia: { x: 1500, y: 640 }// 默认是1920分辨率下的宽高
  },
  mutations: {
    getAccountName (state, val) {
      state.accountName = val
    },
    getUserBaseInfo (state, val) {
      state.userBaseInfo = val
    },
    getNodeOption (state, val) {
      state.nodeOption = val
    },
    setTargetXY (state, val) {
      state.targetXY = val
    },
    setWrapXY (state, val) {
      state.wrapXY = val
    },
    changeIsAntPopover (state, val) {
      state.isAntPopover = val
    },
    getAppUser (state, val) {
      state.appUserOption = val
    },
    changeAppUserModal (state, val) {
      state.appUserModal = val
    },
    getCcUser (state, val) {
      state.ccUserOption = val
    },
    changeCcUserModal (state, val) {
      state.ccUserModal = val
    },
    getCondition (state, val) {
      state.conditionOption = val
    },
    changeConditionModal (state, val) {
      state.conditionModal = val
    },
    getMenuInfo (state, val) {
      state.menuInfo = val
    },
    getMenuId (state, val) {
      state.menuId = val
    },
    getModuleData (state, val) {
      state.moduleList = val
    },
    getServiceDomainData (state, val) {
      state.serviceDomainList = val
    },
    getCurentNode (state, val) {
      // 当前审批节点
      state.currentNode = val
    },
    getThreeMenuName (state, val) {
      state.menuInfo.menuName = val
    },
    getParam (state, val) {
      state.menuInfo = Object.assign(state.menuInfo, val)
    },
    setMsgParam (state, val) {
      state.msgParam = JSON.stringify(val)
    },
    getAutomaticLogOutTime (state, val) {
      state.automaticLogOutTime = val
    },
    getClickTime (state, val) {
      state.clickTime = val
    },
    getAccountNumber (state, val) {
      state.actnumber = val
    },
    setXyMedia (state, val) {
      state.xyMedia = val
    }
  }
}
export default common
