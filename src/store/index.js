import Vue from 'vue'
import Vuex from 'vuex'
import base from './base'
import attendance from './attendance'
import csmstimetable from './csmstimetable'
import infoPublic from './infoPublic'
import common from './common'
import evaluate from './evaluate'
import educationAffairs from './educationAffairs'
import lanclass from './lanclass'
import createPersistedState from 'vuex-persistedstate'
// import API_CONFIG from '../../public/config.json'
// import xyUtils from '@/common/js/utils'
// const HOST = xyUtils.setHOST(API_CONFIG.url)

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    // apiBase: HOST.apiUrl,
    apiPath: '',
    // apiAMS: HOST.apiUrl + '/ams',
    messageInfo: '',
    apiPublic: ''
  },
  mutations: {
    changeApiPath (state, path) {
      state.apiPath = path
    },
    changeApiPublic (state, path) {
      state.apiPublic = path
    }
  },
  modules: {
    base,
    common,
    attendance,
    csmstimetable,
    infoPublic,
    evaluate,
    educationAffairs,
    lanclass
  },
  plugins: [createPersistedState()]
})
export default store
