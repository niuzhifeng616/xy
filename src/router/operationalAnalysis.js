// 发消息
// 列表
const OaMailTable = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/oaMail/OaMailTable.vue')
// 新建消息
const CreateMail = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/oaMail/CreateMail.vue')
// 消息详情
const ShowMailDetail = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/oaMail/ShowMailDetail.vue')
// 消息:接收人员
const ShowPersonnel = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/oaMail/ShowPersonnel.vue')

// 公文流转-公文设置
const DSet = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/documentMove/DocumentSetting.vue')
// 公文流转-我的发起
const MLaunch = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/documentMove/MyLaunch.vue')
// 公文流转-发起公文
const Launch = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/documentMove/Launch.vue')
// 公文流转-我的签收
const MRecord = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/documentMove/MyRecord.vue')
// 公文流转-公文汇总
const DSummary = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/documentMove/DocumentSummary.vue')

// 公文设置
const OaSetting = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/oaDocument/OfficialSetting/Setting.vue')
// 公文审批流程
const OaApprovalSettings = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/oaDocument/OfficialSetting/ApprovalSettings.vue')
// 公文审批
const OaOfficialApproval = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/oaDocument/OfficialApproval/Approval.vue')
// 公文归档
const OaArchive = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/oaDocument/OfficialArchive/Archive.vue')
// 公文发起
const OaManage = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/oaDocument/OfficialManage/Manage.vue')
// 发起公文页
const OaCreatManage = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/oaDocument/OfficialManage/Creat.vue')
// 公文记录
const OaRecording = () => import(/* webpackChunkName: "operationalAnalysis " */ '@/pages/operationalAnalysis/views/oaDocument/OfficialRecording/Recording.vue')
const operationalAnalysis = [
  {
    path: 'oaMailTable',
    name: 'OaMailTable',
    component: OaMailTable,
    children: [{
      path: 'showMailDetail',
      name: 'ShowMailDetail',
      component: ShowMailDetail
    }]
  },
  {
    path: 'OaOfficialApproval',
    name: 'OaOfficialApproval',
    component: OaOfficialApproval
  },
  {
    path: 'OaSetting',
    name: 'OaSetting',
    component: OaSetting
  },
  {
    path: 'OaApprovalSettings',
    name: 'OaApprovalSettings',
    component: OaApprovalSettings
  },
  {
    path: 'OaRecording',
    name: 'OaRecording',
    component: OaRecording
  },
  {
    path: 'OaCreatManage',
    name: 'OaCreatManage',
    component: OaCreatManage
  },
  {
    path: 'OaManage',
    name: 'OaManage',
    component: OaManage
  },
  {
    path: 'OaArchive',
    name: 'OaArchive',
    component: OaArchive
  },
  {
    path: 'createMail',
    name: 'CreateMail',
    component: CreateMail
  },
  {
    path: 'showPersonnel',
    name: 'ShowPersonnel',
    component: ShowPersonnel
  },
  {
    path: 'DSet',
    name: 'DocumentSetting',
    component: DSet
  },
  {
    path: 'MLaunch',
    name: 'MyLaunch',
    component: MLaunch
  },
  {
    path: 'Launch',
    name: 'Launch',
    component: Launch
  },
  {
    path: 'MRecord',
    name: 'MyRecord',
    component: MRecord
  },
  {
    path: 'DSummary',
    name: 'DocumentSummary',
    component: DSummary
  }
]
export default operationalAnalysis
