import Vue from 'vue'
import Router from 'vue-router'
import common from './common' // 公共模块
import third from './third' // 公共模块
import message from './message' // 消息
import basic from './basic' // 基础数据
import attendance from './attendance' // 考勤
import csmstimetable from './csmstimetable' // 一人一课表
import systemSetting from './systemSetting' // 系统设置
import infoPublic from './infoPublic' // 班牌信发
import demo from './demo' // 公用组件demo
import schoolAffairs from './schoolAffairs' // 智慧校务
import xyUtils from '@/common/js/utils'
import evaluate from './evaluate' // 智慧评价
import educationAffairs from './educationAffairs' // 智慧教务
import operationalAnalysis from './operationalAnalysis' // 智慧办公
import lanclass from './lanclass' // 互动课堂
import compactArrangement from './compactArrangement' // 精简排课

// 解决重复点击按钮router.push报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// 解决重复点击按钮router.replace报错
const VueRouterReplace = Router.prototype.replace
Router.prototype.replace = function replace (to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}

const XyHome = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/XyHome.vue')// 智校首页
// const XyHome = () => import(/* webpackChunkName: "common" */ '@/pages/compactArrangement/views/common/XyHome.vue')// 精简排课的首页

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      redirect: '/qualityReport'
    },
    {
      path: '/ams',
      redirect: '/ams/login'
    },
    ...common,
    ...third,
    {
      path: '/xyHome',
      name: 'xyHome',
      component: XyHome,
      children: [
        ...demo,
        ...basic,
        ...attendance,
        ...csmstimetable,
        ...compactArrangement,
        ...systemSetting,
        ...infoPublic,
        ...schoolAffairs,
        ...evaluate,
        ...educationAffairs,
        ...operationalAnalysis,
        ...message,
        ...lanclass
      ]
    }
  ],
  scrollBehavior (to, from, savesavedPosition) {
    if (document.querySelector('#scrollWrap')) {
      document.querySelector('#scrollWrap').scrollTop = 0
    }
    return { x: 0, y: 0 }
  }
})
/* 路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 */
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const istoken = error.message.match(/Uncaught SyntaxError: Unexpected token </g)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed || istoken) {
    // location.reload()
    router.replace(targetPath)
  }
})
router.beforeEach((to, from, next) => {
  if (to.name === 'qualityReport') {
    xyUtils.setCookie('.XYTOKEN', '99e66581-0c79-4273-b9af-bf2393bbc89f', { expires: 30 })
    document.title = localStorage.getItem('webSiteTitle') ? localStorage.getItem('webSiteTitle') : localStorage.setItem('webSiteTitle', '学生成长报告册')
    next()
    return false
  }
  document.title = localStorage.getItem('webSiteTitle') ? localStorage.getItem('webSiteTitle') : '登录'
  const fullPath = to.fullPath.split('/')
  if (fullPath[1].indexOf('loginThird') > -1 || fullPath[1].indexOf('evaStudentClient') > -1) {
    next()
  } else {
    const parmUrl = to.fullPath.split('?')
    for (let i = 0, len = parmUrl.length; i < len; i++) {
      let o = parmUrl[i].split('=')[0]
      if (o.toLowerCase() === 'token' || o.toLowerCase() === 'Token') {
        let Token1 = parmUrl[i].split('=')[1]
        xyUtils.removeCookie('.XYTOKEN')
        xyUtils.setCookie('.XYTOKEN', Token1, { expires: 30 })
      }
      if (o === 'RouteUrl') {
        let RouteUrl = decodeURIComponent(third[i].split('=')[1])
        localStorage.setItem('RouteUrl', RouteUrl)
      }
    }

    if (fullPath[1].toLowerCase() !== 'ams') { // 鉴于特殊性，不适用matched
      // let token = xyUtils.getCookie('.XYTOKEN') ? xyUtils.getCookie('.XYTOKEN') : 0
      // 松山湖固定token
      let token = xyUtils.setCookie('.XYTOKEN', '99e66581-0c79-4273-b9af-bf2393bbc89f', { expires: 30 })
      let role = localStorage.getItem('role') !== null ? localStorage.getItem('role') : -1
      document.title = localStorage.getItem('webSiteTitle') ? localStorage.getItem('webSiteTitle') : '登录'
      if ((token && to.name === 'login') || (token && to.name === '')) {
        switch (Number(role)) {
          case 4:
            // next('xyParent')
            console.log('家长账户')
            break
          default: {
            next('/xyHome/module')// 智校刷新默认跳转的首页
            // next('/xyhome/moduleFunc')// 精简排课刷新默认跳转的首页
          }
        }
      } else {
        next()
      }
      if (!token) {
        if (to.name === 'login' || to.name === 'forgetPassword') {
          next()
        } else {
          next('/login')
        }
      }
    } else {
      const AMSToken = xyUtils.getCookie('.AMSXYTOKEN')
      if (!AMSToken || AMSToken === 'undefined') {
        if (to.name === 'AMS_login') {
          next()
        } else {
          next('/ams/login')
        }
      }
      next()
    }
  }
})
export default router
