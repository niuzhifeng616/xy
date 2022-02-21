// 客户端-课堂评价-评价学生
const EvaStudentClient = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluateStudentClient/evaStudent.vue')
const EvaGroupClient = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluateStudentClient/evaGroup.vue')
const EvaRecordingClient = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluateStudentClient/evaRecording.vue')

// 北斗七星
// 北斗七星评价系统
const PlanetManage = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetManage/PlanetManage.vue')
// 天权星
const Megrez = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetManage/Megrez.vue')
const MegrezClass = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetManage/megrez/class.vue')
const MegrezGraden = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetManage/megrez/graden.vue')

// 天枢星
const Dubhe = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetManage/Dubhe.vue')
// 玉衡星
const Alioth = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetManage/Alioth.vue')
// 摇光星
const Alkaid = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetManage/Alkaid.vue')
// 天璇星
const Merak = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetManage/Merak.vue')
// 开阳星
const Mizar = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetManage/Mizar.vue')
// 天玑星
const Phecda = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetManage/Phecda.vue')

// 学生素质报告
const qualityReport = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/qualityReport/index.vue')

const third = [
  {
    path: '/evaStudentClient',
    name: 'evaStudentClient',
    component: EvaStudentClient
  },
  {
    path: '/evaGroupClient',
    name: 'evaGroupClient',
    component: EvaGroupClient
  },
  {
    path: '/evaRecordingClient',
    name: 'evaRecordingClient',
    component: EvaRecordingClient
  },
  // 北斗七星
  {
    path: '/PlanetManage',
    name: 'PlanetManage',
    component: PlanetManage
  },
  {
    path: '/Megrez',
    name: 'Megrez',
    component: Megrez
  },
  {
    path: '/MegrezClass',
    name: 'MegrezClass',
    component: MegrezClass
  },
  {
    path: '/MegrezGraden',
    name: 'MegrezGraden',
    component: MegrezGraden
  },
  {
    path: '/Dubhe',
    name: 'Dubhe',
    component: Dubhe
  },
  {
    path: '/Alioth',
    name: 'Alioth',
    component: Alioth
  },
  {
    path: '/Alkaid',
    name: 'Alkaid',
    component: Alkaid
  },
  {
    path: '/Merak',
    name: 'Merak',
    component: Merak
  },
  {
    path: '/Mizar',
    name: 'Mizar',
    component: Mizar
  },
  {
    path: '/Phecda',
    name: 'Phecda',
    component: Phecda
  },
  {
    path: '/qualityReport',
    name: 'qualityReport',
    component: qualityReport,
    meta: {
      title: '学生成长报告册'
    }
  }
]
export default third
