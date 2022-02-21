// 主页
// const Lanclass = () => import(/* webpackChunkName: "lanclass" */ '')

const lanclass = [
  // 主页
  {
    path: 'Lanclass',
    name: 'Lanclass',
    component: () => import('@/pages/lanclass/views/Index.vue')
  },
  // 主讲学校
  {
    path: 'MainSchool',
    name: 'MainSchool',
    component: () => import('@/pages/lanclass/views/mainSchool/MainSchool.vue')
  },
  // 主讲学校-详情
  {
    path: 'MainSchoolDetail',
    name: 'MainSchoolDetail',
    component: () => import('@/pages/lanclass/views/mainSchool/Detail.vue')
  },
  // 主讲学校-发布课程
  {
    path: 'MainSchoolPublish',
    name: 'MainSchoolPublish',
    component: () => import('@/pages/lanclass/views/mainSchool/Publish.vue')
  },
  // 听课学校
  {
    path: 'ListeningSchool',
    name: 'ListeningSchool',
    component: () => import('@/pages/lanclass/views/listeningSchool/ListeningSchool.vue')
  },
  // 查看听课学校
  {
    path: 'LookSchool',
    name: 'LookSchool',
    component: () => import('@/pages/lanclass/views/listeningSchool/LookSchool.vue')
  },
  // 添加听课学校
  {
    path: 'AddSchool',
    name: 'AddSchool',
    component: () => import('@/pages/lanclass/views/listeningSchool/AddSchool.vue')
  }
]
export default lanclass
