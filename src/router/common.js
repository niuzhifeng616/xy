const Login = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/login/Login.vue')// 智校的登录页面
// const Login = () => import(/* webpackChunkName: "common" */ '@/pages/compactArrangement/views/Login.vue')// 精简排课的登录页面
const LoginThird = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/login/LoginThird.vue')

const ForgetPassword = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/login/ForgetPassword.vue')
const Error401 = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/error/Error401.vue')
const Error404 = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/error/Error404.vue')
const Error500 = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/error/Error500.vue')

const AMS = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/ams/AMS.vue')
const AMSLogin = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/ams/Login.vue')
const AMSSiteList = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/ams/SiteList.vue')
const AMSManagement = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/ams/ManagementFramwork.vue')

const downLoad = () => import(/* webpackChunkName: "common" */ '@/components/downLoad/DownLoad.vue')

const common = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/loginThird',
    name: 'loginThird',
    component: LoginThird
  },
  {
    path: '/downLoad',
    name: 'downLoad',
    component: downLoad
  },
  {
    path: '/error401',
    name: 'error401',
    component: Error401
  },
  {
    path: '/error404',
    name: 'error404',
    component: Error404
  },
  {
    path: '/error500',
    name: 'error500',
    component: Error500
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    component: ForgetPassword
  },
  {
    path: '/ams/login',
    name: 'AMS_login',
    component: AMSLogin
  },
  {
    path: '/ams',
    name: 'AMS',
    component: AMS,
    children: [
      {
        path: 'siteList',
        name: 'AMS_siteList',
        component: AMSSiteList
      },
      {
        path: 'management',
        name: 'AMS_management',
        component: AMSManagement
      },
      {
        path: '*',
        redirect: '/ams/login'
      }
    ]
  }
]
export default common
