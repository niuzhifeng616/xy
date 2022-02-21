import Vue from 'vue'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import axios from 'axios'
import store from '@/store'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// eslint-disable-next-line no-unused-vars
import echarts from 'echarts'
import highcharts from 'highcharts'
import HighCharts3D from 'highcharts/highcharts-3d'
import 'normalize.css/normalize.css'
import '@/common/style/iconfont/iconfont.css'
import '@/common/style/reset.less'
import '@/common/style/index.less'
import '@/common/style/public.less'
import App from './App.vue'
import router from '@/router'
import print from '@/common/js/print'
import jm from 'vue-jsmind'
// jQuery及其$通过webpack.ProvidePlugin引入

import xyUtils from '@/common/js/utils'

Vue.directive('myTitle', {
  inserted: function (el, binding) {
    const { value } = binding
    // 方式1，直接给v-myTitle标签的 data-title 属性赋值
    if (el.dataset.title) {
      document.title = el.dataset.title
    } else if (value && value.title) {
      document.title = value.title
    }

    // 方式2，通过指令传参（{{xxx}}）
  },
  update (el, binding) {
    const { value } = binding
    if (el.dataset.title) {
      document.title = el.dataset.title
    } else if (value && value.title) {
      document.title = value.title
    }
  }
})

Vue.use(print)
Vue.prototype.print = print
Vue.use(ViewUI).use(Antd)
Vue.use(jm)
if (window.jsMind) {
  Vue.prototype.jsMind = window.jsMind
}

Vue.config.productionTip = false
Vue.prototype.xy = xyUtils
Vue.prototype.echarts = echarts
Vue.prototype.highcharts = highcharts
HighCharts3D(highcharts)

let StartApp = function () {
  axios.get('/config.json').then((res) => {
    let currentWebUrl = location.origin
    let result = ''
    res.data.url.forEach((value) => {
      if (value.webUrL === currentWebUrl) {
        result = value.apiUrl
        Vue.prototype.xyWebUrl = value.webUrL
        Vue.prototype.xyMobileUrl = value.mobileUrL
        Vue.prototype.corpId = value.corpId !== undefined ? value.corpId : '' // dingding
      }
    })
    if (result) {
      Vue.prototype.apiAMS = result + '/ams' // ams
      Vue.prototype.xyApi = result // 默认api
      Vue.prototype.xyUploadUrl = res.data.uploadData.uploadUrl// 资源上传地址
      Vue.prototype.xyUploadToken = res.data.uploadData.token// 资源上传用token
      Vue.prototype.xyViewUrl = res.data.uploadData.viewUrl// 展示资源用
    } else {
      // alert('域名配置错误')
    }
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
}
StartApp()
// Funpatch()
