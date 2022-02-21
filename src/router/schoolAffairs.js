// 文件签字
const SchoolAffairs = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/SchoolAffairs.vue')
const FileSign = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/fileSign/FileSign.vue')
const FileSignList = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/fileSign/FileSignList.vue')
const CreateFileSign = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/fileSign/CreateFileSign.vue')
const fileSignPreview = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/fileSign/FileSignPreview.vue')
const FileSignStudentList = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/fileSign/FileSignStudentList.vue')
// 访客管理
// 访客管理-访客二维码
const VisitCode = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/visitCode/VisitCode.vue')
// 访客管理-访客打印页
const VisitCodePrint = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/visitCode/VisitCodePrint.vue')
// 访客管理-访客管理
const VisitManage = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/visitManage/VisitManage.vue')
// 访客管理-访客管理列表
const VisitManageList = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/visitManage/VisitManageList.vue')
// 访客管理-访客列表详情
const VisitManageDetails = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/components/VisitManageDetails.vue')
// 访客邀请
const VisitInvitationList = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/visitInvitation/visitInvitationList.vue')
const VisitLaunchInvitation = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/visitInvitation/visitLaunchInvitation.vue')
const VisitInvitationDetails = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/components/visitInvitationDetails.vue')
// 访客邀请汇总
const VisitInvitationSum = () => import (/* webpackChunkName: "schoolAffairs" */ '@/pages/schoolAffairs/views/visitInvitationSum/visitInvitationSum.vue')

const schoolAffairs = [
  {
    path: 'sa',
    name: 'SchoolAffairs',
    component: SchoolAffairs,
    children: [
      {
        path: 'FileSign',
        name: 'FileSign',
        component: FileSign,
        children: [
          {
            path: 'FileSignList',
            name: 'FileSignList',
            component: FileSignList
          },
          {
            path: 'createFileSign',
            name: 'CreateFileSign',
            component: CreateFileSign
          },
          {
            path: 'fileSignPreview',
            name: 'fileSignPreview',
            component: fileSignPreview
          },
          {
            path: 'fileSignStudentList',
            name: 'FileSignStudentList',
            component: FileSignStudentList
          }
        ]
      },
      {
        path: 'VisitManage',
        name: 'VisitManage',
        component: VisitManage,
        children: [
          {
            path: 'VisitManageList',
            name: 'VisitManageList',
            component: VisitManageList
          },
          {
            path: 'VisitManageDetails',
            name: 'VisitManageDetails',
            component: VisitManageDetails
          }
        ]
      },
      {
        path: 'VisitCode',
        name: 'VisitCode',
        component: VisitCode
      },
      {
        path: 'VisitCodePrint',
        name: 'VisitCodePrint',
        component: VisitCodePrint
      },
      {
        path: 'VisitInvitationList',
        name: 'VisitInvitationList',
        component: VisitInvitationList
      },
      {
        path: 'VisitLaunchInvitation',
        name: 'VisitLaunchInvitation',
        component: VisitLaunchInvitation
      },
      {
        path: 'VisitInvitationDetails',
        name: 'VisitInvitationDetails',
        component: VisitInvitationDetails
      },
      {
        path: 'VisitInvitationSum',
        name: 'VisitInvitationSum',
        component: VisitInvitationSum
      }
    ]
  }
]
export default schoolAffairs
