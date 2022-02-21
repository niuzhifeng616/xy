// 出入校
const AccessSchool = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchool/AccessSchool.vue')
// 出入校--出入校设置-列表页
const SetList = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchool/setting/SetList.vue')
// 出入校--出入校设置-设置页
const SetDetail = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchool/setting/SetDetail.vue')
// 出入校--出入校统计
const StatisticsList = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchool/statistics/StatisticsList.vue')
// 出入校--学生记录
const StudentRecordList = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchool/studentRecords/StudentRecordList.vue')
// 出入校--教职工记录
const TeacherRecordList = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchool/teacherRecords/TeacherRecordList.vue')

// 出入校 -- go
const AccessSchoolGo = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchoolGo/AccessSchool.vue')
// 出入校--出入校设置-列表页
const SetListGo = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchoolGo/setting/SetList.vue')
// 出入校--出入校设置-设置页
const SetDetailGo = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchoolGo/setting/SetDetail.vue')
// 出入校--出入校统计
const StatisticsListGo = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchoolGo/statistics/StatisticsList.vue')
// 出入校--学生记录
const StudentRecordListGo = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchoolGo/studentRecords/StudentRecordList.vue')
// 出入校--教职工记录
const TeacherRecordListGo = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/accessSchoolGo/teacherRecords/TeacherRecordList.vue')

// 教师考勤-班组安排
const TeacherAttendanceTeam = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/teacherAttendance/TeacherAttendanceTeam.vue')
// 教师考勤-类型设置
const TeacherAttendanceType = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/teacherAttendance/TeacherAttendanceType.vue')
// 教师考勤-考勤记录
const TeacherAttendanceRecord = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/teacherAttendance/TeacherAttendanceRecord.vue')
// 教师考勤-考勤打卡
const TeacherAttendancePunchCard = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/teacherAttendance/TeacherAttendancePunchCard.vue')

// 教师请假请假类型
const TeacherLeaveSet = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/teacherLeave/TeacherLeaveSet.vue')
// 教师请假-我的请假
const TeacherLeaveSelf = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/teacherLeave/TeacherLeaveSelf.vue')
// 教师请假-请假审批
const TeacherLeaveApproval = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/teacherLeave/TeacherLeaveApproval.vue')
// 教师请假-请假记录
const TeacherLeaveRecord = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/teacherLeave/TeacherLeaveRecord.vue')
// 教师请假详情通用组件
const TeacherLeaveDetailsTem = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/components/teacherLeave/TeacherLeaveDetails.vue')
// 教师请假详情通用组件
const TeacherLeaveDetails = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/components/teacherLeave/TeacherLeaveDetailsMsg.vue')
// 教师请假-创建请假
const TeacherLeaveCreate = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/teacherLeave/TeacherLeaveCreate.vue')
// 教师请假-审批流设置
const TeacherLeaveWorkFlow = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/teacherLeave/TeacherLeaveWorkFlow.vue')

// 学生考勤-设置(主页面)
const AttendanceType = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/attendanceSetting/AttendanceType.vue')
// 学生考勤-范围设置
const AttendanceRange = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/attendanceSetting/AttendanceRange.vue')
// 学生考勤-我的考勤
const MyAttendance = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/myAttendance/MyAttendance.vue')
// 学生考勤-随堂考勤
const AttsLesson = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/attsLesson/AttsLesson.vue')
const TakeAttendance = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/attsLesson/TakeAttendance.vue')
// 学生考勤-行政班考勤统计
const AttAdminClass = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/AttAdminClass.vue')
const AttAdminClassForSchool = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/AttAdminClassForSchool.vue')
const AttAdminClassForGrade = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/AttAdminClassForGrade.vue')
const AttAdminClassForClass = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/AttAdminClassForClass.vue')
const AttAdminClassForPerson = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/AttAdminClassForPerson.vue')
// 学生考勤-教学班考勤统计
const AttTeachingClass = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/AttTeachingClass.vue')
const AttTeachingClassForSchool = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/AttTeachingClassForSchool.vue')
const AttTeachingClassForGrade = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/AttTeachingClassForGrade.vue')
const AttTeachingClassForClass = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/AttTeachingClassForClass.vue')
const AttTeachingClassForPerson = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/AttTeachingClassForPerson.vue')
// 学生考勤-考勤记录
const AttendanceRecords = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentAttendance/attendanceRecords/AttendanceRecords.vue')

// 学生请假设置
const Type = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveType/Type.vue')
// 审批流程设置
const Workflow = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveType/workflow/Workflow.vue')
// 学生请假申请---列表
const StudentApplyList = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveApply/ApplyList.vue')
// 学生请假申请---申请
const StudentApply = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveApply/Apply.vue')
// 学生请假---请假统计
const Stat = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveStat/Stat.vue')
const StatSchool = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveStat/StatSchool.vue')
const StatGrade = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveStat/StatGrade.vue')
const StatClass = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveStat/StatClass.vue')
const StatPeople = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveStat/StatPeople.vue')
// 学生请假详情通用组件
const StudentLeaveDetails = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/components/studentLeave/StudentLeaveDetailsMsg.vue')
// 学生请假审批
const Approval = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveApproval/Approval.vue')
const ApprovalEdit = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveApproval/ApprovalEdit.vue')
// 学生请假记录
const Record = () => import(/* webpackChunkName: "attendance" */ '@/pages/attendance/views/studentLeave/studentLeaveRecord/Record.vue')
const attendace = [
  {
    path: 'AccessSchool',
    name: 'AccessSchool',
    component: AccessSchool,
    children: [
      {
        path: 'SetList',
        name: 'SetList',
        component: SetList
      },
      {
        path: 'SetDetail',
        name: 'SetDetail',
        component: SetDetail
      },
      {
        path: 'StatisticsList',
        name: 'StatisticsList',
        component: StatisticsList
      },
      {
        path: 'StudentRecordList',
        name: 'StudentRecordList',
        component: StudentRecordList
      },
      {
        path: 'TeacherRecordList',
        name: 'TeacherRecordList',
        component: TeacherRecordList
      }
    ]
  },
  // 出入校-GO
  {
    path: 'AccessSchoolGo',
    name: 'AccessSchoolGo',
    component: AccessSchoolGo,
    children: [
      {
        path: 'SetListGo',
        name: 'SetListGo',
        component: SetListGo
      },
      {
        path: 'SetDetailGo',
        name: 'SetDetailGo',
        component: SetDetailGo
      },
      {
        path: 'StatisticsListGo',
        name: 'StatisticsListGo',
        component: StatisticsListGo
      },
      {
        path: 'StudentRecordListGo',
        name: 'StudentRecordListGo',
        component: StudentRecordListGo
      },
      {
        path: 'TeacherRecordListGo',
        name: 'TeacherRecordListGo',
        component: TeacherRecordListGo
      }
    ]
  },
  {
    path: 'Approval',
    name: 'Approval',
    component: Approval
  },
  {
    path: 'ApprovalEdit',
    name: 'ApprovalEdit',
    component: ApprovalEdit
  },
  {
    path: 'Record',
    name: 'Record',
    component: Record
  },
  {
    path: 'Stat',
    name: 'Stat',
    component: Stat,
    children: [
      {
        path: 'StatSchool',
        name: 'StatSchool',
        component: StatSchool
      },
      {
        path: 'StatGrade',
        name: 'StatGrade',
        component: StatGrade
      },
      {
        path: 'StatClass',
        name: 'StatClass',
        component: StatClass
      },
      {
        path: 'StatPeople',
        name: 'StatPeople',
        component: StatPeople
      }
    ]
  },
  {
    path: 'attAdminClass',
    name: 'attAdminClass',
    component: AttAdminClass,
    children: [
      {
        path: 'attAdminClassForSchool',
        name: 'attAdminClassForSchool',
        component: AttAdminClassForSchool
      },
      {
        path: 'attAdminClassForGrade',
        name: 'attAdminClassForGrade',
        component: AttAdminClassForGrade
      },
      {
        path: 'attAdminClassForClass',
        name: 'attAdminClassForClass',
        component: AttAdminClassForClass
      },
      {
        path: 'attAdminClassForPerson',
        name: 'attAdminClassForPerson',
        component: AttAdminClassForPerson
      }
    ]
  },
  {
    path: 'attTeachingClass',
    name: 'attTeachingClass',
    component: AttTeachingClass,
    children: [
      {
        path: 'attTeachingClassForSchool',
        name: 'attTeachingClassForSchool',
        component: AttTeachingClassForSchool
      },
      {
        path: 'attTeachingClassForGrade',
        name: 'attTeachingClassForGrade',
        component: AttTeachingClassForGrade
      },
      {
        path: 'attTeachingClassForClass',
        name: 'attTeachingClassForClass',
        component: AttTeachingClassForClass
      },
      {
        path: 'attTeachingClassForPerson',
        name: 'attTeachingClassForPerson',
        component: AttTeachingClassForPerson
      }
    ]
  },
  {
    path: 'TeacherAttendanceTeam',
    name: 'TeacherAttendanceTeam',
    component: TeacherAttendanceTeam
  },
  {
    path: 'TeacherAttendanceType',
    name: 'TeacherAttendanceType',
    component: TeacherAttendanceType
  },
  {
    path: 'TeacherAttendanceRecord',
    name: 'TeacherAttendanceRecord',
    component: TeacherAttendanceRecord
  },
  {
    path: 'TeacherAttendancePunchCard',
    name: 'TeacherAttendancePunchCard',
    component: TeacherAttendancePunchCard
  },
  {
    path: 'TeacherLeaveSelf',
    name: 'TeacherLeaveSelf',
    component: TeacherLeaveSelf
  },
  {
    path: 'TeacherLeaveApproval',
    name: 'TeacherLeaveApproval',
    component: TeacherLeaveApproval
  },
  {
    path: 'TeacherLeaveRecord',
    name: 'TeacherLeaveRecord',
    component: TeacherLeaveRecord
  },
  {
    path: 'TeacherLeaveDetails',
    name: 'TeacherLeaveDetails',
    component: TeacherLeaveDetails
  },
  {
    path: 'TeacherLeaveDetailsTem',
    name: 'TeacherLeaveDetailsTem',
    component: TeacherLeaveDetailsTem
  },
  {
    path: 'TeacherLeaveCreate',
    name: 'TeacherLeaveCreate',
    component: TeacherLeaveCreate
  },
  {
    path: 'TeacherLeaveSet',
    name: 'TeacherLeaveSet',
    component: TeacherLeaveSet
  },
  {
    path: 'TeacherLeaveWorkFlow',
    name: 'TeacherLeaveWorkFlow',
    component: TeacherLeaveWorkFlow
  },
  {
    path: 'Type',
    name: 'Type',
    component: Type
  },
  {
    path: 'Workflow',
    name: 'Workflow',
    component: Workflow
  },
  {
    path: 'StudentApplyList',
    name: 'StudentApplyList',
    component: StudentApplyList
  },
  {
    path: 'StudentApply',
    name: 'StudentApply',
    component: StudentApply
  },
  {
    path: 'AttendanceType',
    name: 'AttendanceType',
    component: AttendanceType
  },
  {
    path: 'StudentLeaveDetails',
    name: 'StudentLeaveDetails',
    component: StudentLeaveDetails
  },
  {
    path: 'AttendanceRange',
    name: 'AttendanceRange',
    component: AttendanceRange
  },
  {
    path: 'MyAttendance',
    name: 'MyAttendance',
    component: MyAttendance
  },
  {
    path: 'AttsLesson',
    name: 'AttsLesson',
    component: AttsLesson
  },
  {
    path: 'TakeAttendance',
    name: 'TakeAttendance',
    component: TakeAttendance
  },
  {
    path: 'AttendanceRecords',
    name: 'AttendanceRecords',
    component: AttendanceRecords
  }
]
export default attendace
