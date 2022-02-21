// 消息-消息列表
const Msg = () => import(/* webpackChunkName: "common" */ '@/pages/common/views/message/Message.vue')
// 消息-详情
const MsgInfo = () => import(/* webpackChunkName: "common" */ '@/pages/message/MsgInfo.vue')
// 消息-教师请假
const TeacherLeaveMsg = () => import(/* webpackChunkName: "common" */ '@/pages/message/TeacherLeaveDetailsMsg.vue')
// 消息-学生请假
const StudentLeaveDetails = () => import(/* webpackChunkName: "common" */ '@/pages/message/StudentLeaveDetailsMsg.vue')
// 消息-公文审批
const OaOfficialDetails = () => import(/* webpackChunkName: "common" */ '@/pages/message/OaOfficialDetailssMsg.vue')
// 消息-公文流转
const DocMove = () => import(/* webpackChunkName: "common" */ '@/pages/message/DocMove.vue')
// 消息-排考场
const ExamRoom = () => import(/* webpackChunkName: "common" */ '@/pages/message/ExamRoomMsg.vue')
// 消息-访客审批
const VisitMsg = () => import(/* webpackChunkName: "common" */ '@/pages/message/VisitManageDetails.vue')
const message = [
  {
    path: 'Message',
    name: 'Message',
    component: Msg
  },
  {
    path: 'MsgInfo',
    name: 'MsgInfo',
    component: MsgInfo,
    children: [
      {
        path: 'TeacherLeaveMsg',
        name: 'TeacherLeaveMsg',
        component: TeacherLeaveMsg
      },
      {
        path: 'StudentLeaveDetails',
        name: 'StudentLeaveMsg',
        component: StudentLeaveDetails
      },
      {
        path: 'OaOfficialDetails',
        name: 'OaOfficiaMsg',
        component: OaOfficialDetails
      },
      {
        path: 'DocMove',
        name: 'DocMove',
        component: DocMove
      },
      {
        path: 'VisitMsg',
        name: 'VisitMsg',
        component: VisitMsg
      },
      {
        path: 'ExamRoom',
        name: 'ExamRoom',
        component: ExamRoom
      }
    ]
  }
]
export default message
