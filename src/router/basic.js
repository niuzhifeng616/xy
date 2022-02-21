// 主页
const module = () => import(/* webpackChunkName: "basic" */ '@/pages/common/views/ModuleFunc.vue')
const userLoginIndex = () => import(/* webpackChunkName: "basic" */ '@/pages/common/views/UserLoginIndex.vue')

// 教师管理
// 主页面
const TeacherManagement = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/TeacherManagement/TeacherTable.vue')
// 新增教师页面
const TeacherCreate = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/TeacherManagement/TeacherCreate.vue')
// 编辑教师页面
const TeacherEdit = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/TeacherManagement/TeacherEdit.vue')
// 教师登录日志页面
const TeacherLog = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/TeacherManagement/TeacherLog.vue')
// 查看教师权限
const TeacherUserPermissionView = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/TeacherManagement/UserPermissionView.vue')

// 学生管理
// 主页面
const StudentManagement = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/studentManagement/StudentTable.vue')
// 新增学生页面
const StudentCreate = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/studentManagement/StudentCreate.vue')
// 编辑学生页面
const StudentEdit = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/studentManagement/StudentEdit.vue')
// 教师登录日志页面
const StudentLog = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/studentManagement/StudentLog.vue')
// 查看学生权限
const StudentUserPermissionView = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/studentManagement/UserPermissionView.vue')
// 毕业生
const GraduatedStudent = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/studentManagement/GraduatedStudent.vue')

// 家长管理
// 主页面
const ParentManagement = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/parentManagement/ParentTable.vue')
// 新增家长页面
const ParentCreate = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/parentManagement/ParentCreate.vue')
// 编辑家长页面
const ParentEdit = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/parentManagement/ParentEdit.vue')
// 家长登录日志页面
const ParentLog = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/parentManagement/ParentLog.vue')
// 查看家长权限
const ParentUserPermissionView = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/parentManagement/UserPermissionView.vue')

// 权限管理
// 主页面
const RoleTable = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/roleManagement/RoleTable.vue')
// 设置权限
const PermissionSetup = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/roleManagement/PermissionSetup.vue')

// 校区管理
const SchoolDistrict = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/schoolDistrict/SchoolDistrict.vue')

// 课程管理-课程设置
const CourseSet = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/schoolCourse/CourseSet.vue')
// 课程管理-学科设置
const SubjectSet = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/schoolCourse/SubjectSet.vue')
// 课程管理-校本分类
const SchoolBaseSort = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/schoolCourse/SchoolBaseSort.vue')

// 学年管理（学年）
const SchoolYearManage = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/schoolyearManage/SchoolyearManage.vue')
// 学期管理（学期）
const TermManage = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/termManage/TermManage.vue')
// 假期管理
const VacationManage = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/vacationManage/VacationManage.vue')

// 场馆管理
// 场馆管理-楼宇管理
const BuildManage = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/venueManagement/BuildManage.vue')
// 场馆管理-场室管理
const FieldManage = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/venueManagement/FieldManage.vue')
// 场馆管理-楼宇管理 楼宇类别
const BuildType = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/venueManagement/BuildType.vue')
// 场馆管理-场室管理 场室类别
const FieldType = () => import(/* webpackChunkName: "basic" */ '@/pages/basic/views/venueManagement/FieldType.vue')

// 消息
const Message = () => import(/* webpackChunkName: "basic" */ '@/pages/common/views/message/Message.vue')
const MessageDetail = () => import(/* webpackChunkName: "basic" */ '@/pages/common/views/message/MessageDetail.vue')

const basic = [
  {
    path: 'Message',
    name: 'Message',
    component: Message
  },
  {
    path: 'MessageDetail',
    name: 'MessageDetail',
    component: MessageDetail
  },
  {
    path: 'module',
    name: 'module',
    component: module
  },
  {
    path: 'userLoginIndex',
    name: 'userLoginIndex',
    component: userLoginIndex
  },
  {
    path: 'roleTable',
    name: 'roleTable',
    component: RoleTable
  },
  {
    path: 'permissionSetup',
    name: 'permissionSetup',
    component: PermissionSetup
  },
  {
    path: 'parentManagement',
    name: 'parentManagement',
    component: ParentManagement
  },
  {
    path: 'parentCreate',
    name: 'parentCreate',
    component: ParentCreate
  },
  {
    path: 'parentEdit',
    name: 'parentEdit',
    component: ParentEdit
  },
  {
    path: 'parentLog',
    name: 'parentLog',
    component: ParentLog
  },
  {
    path: 'parentUserPermissionView',
    name: 'parentUserPermissionView',
    component: ParentUserPermissionView
  },
  {
    path: 'teacherManagement',
    name: 'teacherManagement',
    component: TeacherManagement
  },
  {
    path: 'teacherCreate',
    name: 'teacherCreate',
    component: TeacherCreate
  },
  {
    path: 'teacherEdit',
    name: 'teacherEdit',
    component: TeacherEdit
  },
  {
    path: 'teacherLog',
    name: 'teacherLog',
    component: TeacherLog
  },
  {
    path: 'teacherUserPermissionView',
    name: 'teacherUserPermissionView',
    component: TeacherUserPermissionView
  },
  {
    path: 'sudentManagement',
    name: 'studentManagement',
    component: StudentManagement
  },
  {
    path: 'graduatedStudent',
    name: 'graduatedStudent',
    component: GraduatedStudent
  },
  {
    path: 'studentCreate',
    name: 'studentCreate',
    component: StudentCreate
  },
  {
    path: 'studentEdit',
    name: 'studentEdit',
    component: StudentEdit
  },
  {
    path: 'studentLog',
    name: 'studentLog',
    component: StudentLog
  },
  {
    path: 'studentUserPermissionView',
    name: 'studentUserPermissionView',
    component: StudentUserPermissionView
  },
  {
    path: 'SchoolDistrict',
    name: 'SchoolDistrict',
    component: SchoolDistrict
  },
  {
    path: 'CourseSet',
    name: 'CourseSet',
    component: CourseSet
  },
  {
    path: 'SubjectSet',
    name: 'SubjectSet',
    component: SubjectSet
  },
  {
    path: 'SchoolBaseSort',
    name: 'SchoolBaseSort',
    component: SchoolBaseSort
  },
  {
    path: 'SchoolYearManage',
    name: 'SchoolYearManage',
    component: SchoolYearManage
  },
  {
    path: 'TermManage',
    name: 'TermManage',
    component: TermManage
  },
  {
    path: 'VacationManage',
    name: 'VacationManage',
    component: VacationManage
  },
  {
    path: 'BuildManage',
    name: 'BuildManage',
    component: BuildManage
  },
  {
    path: 'FieldManage',
    name: 'FieldManage',
    component: FieldManage
  },
  {
    path: 'BuildType',
    name: 'BuildType',
    component: BuildType
  },
  {
    path: 'FieldType',
    name: 'FieldType',
    component: FieldType
  }
]
export default basic
