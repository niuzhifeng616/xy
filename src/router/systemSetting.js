// 账户设置
const AccountSetting = () => import(/* webpackChunkName: "systemSet" */ '@/pages/systemSetting/views/AccountSetting.vue')
// 微信设置
const GradeDisplaySettings = () => import(/* webpackChunkName: "systemSet" */ '@/pages/systemSetting/views/GradeDisplaySettings.vue')
// 年级展示方式
const WeChatSetting = () => import(/* webpackChunkName: "systemSet" */ '@/pages/systemSetting/views/WeChatSetting.vue')
// 钉钉设置
const DingDingSetting = () => import(/* webpackChunkName: "systemSet" */ '@/pages/systemSetting/views/DingDingSetting.vue')
// 年级升级
const GradeUpgrade = () => import(/* webpackChunkName: "basic" */ '@/pages/systemSetting/views/GradeUpgrade.vue')

const systemSet = [
  {
    path: 'AccountSetting',
    name: 'AccountSetting',
    component: AccountSetting
  },
  {
    path: 'GradeDisplaySettings',
    name: 'GradeDisplaySettings',
    component: GradeDisplaySettings
  },
  {
    path: 'WeChatSetting',
    name: 'WeChatSetting',
    component: WeChatSetting
  },
  {
    path: 'DingSet',
    name: 'DingDingSetting',
    component: DingDingSetting
  },
  {
    path: 'gradeUpgrade',
    name: 'gradeUpgrade',
    component: GradeUpgrade
  }
]

export default systemSet
