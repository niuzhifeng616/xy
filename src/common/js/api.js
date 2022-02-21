import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'
import { Message } from 'view-design'

axios.interceptors.request.use(
  config => {
    let token = Cookies.get('.XYTOKEN')
    if (token !== undefined) {
      config.headers['AppToken'] = token
    }
    return config
  },
  _error => {
    return Promise.reject(_error)
  }
)

const xyapi = {
  // noMsgWin ---Boolean 错误返回是否要特殊处理，不需要时不用传
  async $get (url, data, noMsgWin) {
    data = Object.assign({}, data, { _: +new Date() })
    try {
      let res = await axios.get(url, { params: data })
      return new Promise((resolve, reject) => {
        if ((res.status >= 200 && res.status < 300) || (res.status === 304)) {
          resolve(res.data)
          if (!res.data.success && !noMsgWin) {
            Message.error({
              top: 50,
              content: res.data.msg,
              duration: 2,
              background: false
            })
          }
        } else {
          reject(res)
        }
      })
    } catch (err) {
      // console.log(err.message)
      if (err.message.indexOf('401') !== -1) {
        router.replace({ path: '/error401' })
      }
      if (err.message.indexOf('404') !== -1) {
        router.replace({ path: '/error404' })
      }
      if (err.message.indexOf('500') !== -1) {
        router.replace({ path: '/error500' })
      }
    }
  },
  // noMsgWin ---Boolean 错误返回是否要特殊处理，不需要时不用传
  // config 是否需要修改headers请求头
  async $post (url, data, noMsgWin, config = {}) {
    try {
      let res = await axios.post(url, data, config)
      return new Promise((resolve, reject) => {
        if ((res.status >= 200 && res.status < 300) || (res.status === 304)) {
          resolve(res.data)
          if (!res.data.success && !noMsgWin) {
            Message.error({
              top: 50,
              content: res.data.msg,
              duration: 2,
              background: false
            })
          }
        } else {
          reject(res)
        }
      })
    } catch (err) {
      // console.log(err.message)
      if (err.message.indexOf('401') !== -1) {
        router.replace({ path: '/error401' })
      }
      if (err.message.indexOf('404') !== -1) {
        router.replace({ path: '/error404' })
      }
      if (err.message.indexOf('500') !== -1) {
        router.replace({ path: '/error500' })
      }
    }
  },
  $put (url, data, config) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url: url,
        data: data,
        header: {
          'Content-Type': config
        }
      }).then(res => {
        if (res.status && ((res.status >= 200 && res.status < 300) || (res.status === 304))) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}
export default xyapi
