const ModuleFunc = () => import(/* webpackChunkName: "compactArrangement" */ '@/pages/compactArrangement/views/ModuleFunc.vue')
const AppCenter = () => import(/* webpackChunkName: "compactArrangement" */ '@/pages/compactArrangement/views/AppCenter.vue')

const common = [
  {
    path: 'moduleFunc',
    name: 'moduleFunc',
    component: ModuleFunc
  },
  {
    path: 'appCenter',
    name: 'appCenter',
    component: AppCenter
  }
]
export default common
