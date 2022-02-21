// 听课评课
// 听评课计划
const Evaluate = () => import(/* webpackChunkName: "educationAffairs " */ '@/pages/educationAffairs/views/evaluate/evaluateApply/Evaluate.vue')
// 发布听评课任务
const CreateEvaluate = () => import(/* webpackChunkName: "educationAffairs " */ '@/pages/educationAffairs/views/evaluate/evaluateApply/Create.vue')
// 我的听评课
const MyEvaluate = () => import(/* webpackChunkName: "educationAffairs " */ '@/pages/educationAffairs/views/evaluate/myEvaluate/MyEvaluate.vue')
// 课程申报-申报
const MyDeclare = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaDeclare/myDeclare/MyDeclare.vue')
// 课程申报-申报
const DeclareApply = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaDeclare/declareApply/DeclareApply.vue')

// 音体美
// 音体美成绩管理 体测项目评分规则管理
const SportItemScore = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/sportItemScore/SportItemScore.vue')
// 音体美成绩管理 体测项目评分规则管理-评分规则
const SetRules = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/sportItemScore/SetRules.vue')
// 音体美成绩管理 体测项目加分规则管理
const SportItemBonusPoint = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/SportItemBonusPoint/SportItemScore.vue')
// 音体美成绩管理 体测项目加分规则管理-评分规则
const SportItemSetRules = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/SportItemBonusPoint/SetRules.vue')
// 音体美成绩管理 音体美考试管理
const ExamManagement = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/examManagementForAEM/ExamManagement.vue')
// 音体美成绩管理 音体美考试管理-创建考试
const ExamManagementCreat = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/examManagementForAEM/CreateExam.vue')
// 音体美成绩管理 音体美考试管理-编辑考试
const ExamManagementEdit = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/examManagementForAEM/EditExam.vue')
// 音体美成绩管理 音体美成绩录入主页面
const AchievementsRecorded = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/AchievementsRecordedForAEM/AchievementsRecordedForAEM.vue')
// 音体美成绩管理 音体美成绩录入查看1
const ExamListDetailFitness = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/AchievementsRecordedForAEM/ExamListDetailFitness.vue')
// 音体美成绩管理 音体美成绩录入查看1-学生详情
const ExamListStudentDetail = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/AchievementsRecordedForAEM/StudentDetail.vue')
// 音体美成绩管理 音体美成绩录入查看1-编辑
const ExamListModifyStudentScore = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/AchievementsRecordedForAEM/ModifyStudentScore.vue')
// 音体美成绩管理 音体美成绩录入查看2
const ExamListDetailNormal = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/AchievementsRecordedForAEM/ExamListDetailNormal.vue')

// 我的音体美成绩
const MyAEMScore = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/MyAEMScore/MyAEMScore.vue')

// 模块成绩：模块管理
const Achievement = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAchievement/achievementManage/achievement/Achievement.vue')
// 模块成绩：模块管理-创建模块
const AchievementCreat = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAchievement/achievementManage/achievement/AchievementCreat.vue')
// 模块成绩：模块管理-编辑模块
const AchievementEdit = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAchievement/achievementManage/achievement/AchievementEdit.vue')
// 模块成绩：成绩填报
const AchievementReport = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAchievement/achievementManage/achievementReport/AchievementReport.vue')
// 模块成绩：成绩查看
const ShowAchievement = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAchievement/achievementManage/showAchievement/ShowAchievement.vue')
// 模块成绩：成绩查看-查询学生模块成绩
const HeadmasterStudentShowAchievement = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAchievement/achievementManage/showAchievement/HeadmasterStudentShowAchievement.vue')

// 成绩档案：考试管理-列表
const AchievementRecord = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAR/achievementRecord/AchievementRecord.vue')
// 成绩档案：考试管理-创建/编辑考试
const AchievementRecordDetail = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAR/achievementRecord/Detail.vue')
// 成绩档案：考试管理-列表内操作按钮：成绩管理
const StudentAchievement = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAR/studentAchievement/StudentAchievement.vue')
// 成绩档案：考试管理-列表内操作按钮：成绩管理-头部功能：学科设置
const StudentAchievementSubject = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAR/studentAchievement/Subject.vue')
// 成绩档案：考试管理 头部功能：考试类型
const AchievementRecordExamType = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAR/achievementRecordExamType/AchievementRecordExamType.vue')
// 成绩档案：考试管理 头部功能：赋分管理
const AssignmentScoreManage = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAR/assignmentScoreManage/AssignmentScoreManage.vue')
// 成绩档案：我的成绩
const MyAchievement = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAR/myAchievement/MyAchievement.vue')

// 教学质量：分析设置
const EaAASsetting = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAAS/analyseSetting/Setting.vue')
// 教学质量：成绩分析
const EaAASanalyse = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAAS/achievementAnalyse/Analyse.vue')
// 教学质量：成绩分析-明细
const EaAASanalyseDetail = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAAS/achievementAnalyse/Detail.vue')
// 教学质量：成绩分析成绩填报
const AchievementAnalysisAndFill = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAAS/achievementAnalysisAndFill/AchievementAnalysisAndFill.vue')
// 教学质量：学科能力分析
const SubjectAbilityAnalysis = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaAAS/subjectAbilityAnalysis/SubjectAbilityAnalysis.vue')

// 排考场
const ExamGo = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/ArrangeExamRoom.vue')
// 排考场-新增/编辑排考场-公共页
const Parent = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/Parent.vue')
// 排考场-手动调整（第七步）
const Adjustment = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/Adjustment.vue')
const AdjustmentStudent = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/AdjustmentStudent.vue')
const AdjustmentTeacher = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/AdjustmentTeacher.vue')
// 排考场-基本信息（第一步）
const Basic = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/Basic.vue')
// 排考场-排考规则（第五步）
const ExamRule = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/ExamRule.vue')
const ExamRuleStudent = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/ExamRuleStudent.vue')
// 排考场-排考设置（第四步）
const ExamSetting = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/ExamSetting.vue')
const ExamSettingRoom = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/ExamSettingRoom.vue')
const ExamSettingTeacher = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/ExamSettingTeacher.vue')
// 排考场-考试学生（第三步）
const ExamStudent = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/ExamStudent.vue')
//  排考场-考试科目（第二步）
const ExamSubject = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/ExamSubject.vue')
// 排考场-发布排考（第八步）
const Publish = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/Publish.vue')
// 排考场-启动排考（第六步）
const StartUp = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom/steps/StartUp.vue')
// 考场管理-我的监考
const MyInvigilator = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/MyInvigilator.vue')
// 考场管理-我的考场
const MyExamination = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/MyExamination.vue')
// 考场管理-报表汇总
const ExamReport = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/report/Report.vue')
// 考场管理-报表汇总: 监考总表
const TotalForm = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/report/TotalForm.vue')
// 考场管理-报表汇总: 教师监考表
const TeacherForm = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/report/TeacherForm.vue')
// 考场管理-报表汇总: 考生信息表
const ExamInfoForm = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/report/ExamInfoForm.vue')
// 考场管理-报表汇总: 考场名单
const Roster = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/report/Roster.vue')
// 考场管理-报表汇总: 座位签
const Seat = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/report/Seat.vue')
// 考场管理-报表汇总: 桌面贴
const Desktop = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/report/Desktop.vue')
// 考场管理-报表汇总: 监考场次统计
const Count = () => import(/* webpackChunkName: "educationAffairs" */ '@/pages/educationAffairs/views/eaExamRoomManage/report/Count.vue')
const educationAffairs = [
  {
    path: 'ExamGo',
    name: 'ExamGo',
    component: ExamGo
  },
  {
    path: 'Parent',
    name: 'Parent',
    component: Parent,
    // redirect: 'Parent/Basic',
    children: [
      {
        path: 'Adjustment',
        name: 'Adjustment',
        component: Adjustment,
        redirect: 'Adjustment/AdjustmentStudent',
        children: [
          {
            path: 'AdjustmentStudent',
            name: 'AdjustmentStudent',
            component: AdjustmentStudent
          },
          {
            path: 'AdjustmentTeacher',
            name: 'AdjustmentTeacher',
            component: AdjustmentTeacher
          }
        ]
      },
      {
        path: 'Basic',
        name: 'Basic',
        component: Basic
      },
      {
        path: 'ExamRule',
        name: 'ExamRule',
        component: ExamRule,
        redirect: 'ExamRule/ExamRuleStudent',
        children: [
          {
            path: 'ExamRuleStudent',
            name: 'ExamRuleStudent',
            component: ExamRuleStudent
          }
        ]
      },
      {
        path: 'ExamSetting',
        name: 'ExamSetting',
        component: ExamSetting,
        redirect: 'ExamSetting/ExamSettingRoom',
        children: [
          {
            path: 'ExamSettingRoom',
            name: 'ExamSettingRoom',
            component: ExamSettingRoom
          },
          {
            path: 'ExamSettingTeacher',
            name: 'ExamSettingTeacher',
            component: ExamSettingTeacher
          }
        ]
      },
      {
        path: 'ExamStudent',
        name: 'ExamStudent',
        component: ExamStudent
      },
      {
        path: 'ExamSubject',
        name: 'ExamSubject',
        component: ExamSubject
      },
      {
        path: 'Publish',
        name: 'Publish',
        component: Publish
      },
      {
        path: 'StartUp',
        name: 'StartUp',
        component: StartUp
      }
    ]
  },
  {
    path: 'MyDeclare',
    name: 'MyDeclare',
    component: MyDeclare
  },
  {
    path: 'DeclareApply',
    name: 'DeclareApply',
    component: DeclareApply
  },
  {
    path: 'evaluate',
    name: 'evaluate',
    component: Evaluate
  },
  {
    path: 'createEvaluate',
    name: 'createEvaluate',
    component: CreateEvaluate
  },
  {
    path: 'myEvaluate',
    name: 'myEvaluate',
    component: MyEvaluate
  },
  {
    path: 'SportItemScore',
    name: 'SportItemScore',
    component: SportItemScore
  },
  {
    path: 'SetRules',
    name: 'SetRules',
    component: SetRules
  },
  {
    path: 'SportItemBonusPoint',
    name: 'SportItemBonusPoint',
    component: SportItemBonusPoint
  },
  {
    path: 'SportItemSetRules',
    name: 'SportItemSetRules',
    component: SportItemSetRules
  },
  {
    path: 'ExamManagement',
    name: 'ExamManagement',
    component: ExamManagement
  },
  {
    path: 'ExamManagementCreat',
    name: 'ExamManagementCreat',
    component: ExamManagementCreat
  },
  {
    path: 'ExamManagementEdit',
    name: 'ExamManagementEdit',
    component: ExamManagementEdit
  },
  {
    path: 'AchievementsRecorded',
    name: 'AchievementsRecorded',
    component: AchievementsRecorded
  },
  {
    path: 'ExamListDetailFitness',
    name: 'ExamListDetailFitness',
    component: ExamListDetailFitness
  },
  {
    path: 'ExamListDetailNormal',
    name: 'ExamListDetailNormal',
    component: ExamListDetailNormal
  },
  {
    path: 'ExamListStudentDetail',
    name: 'ExamListStudentDetail',
    component: ExamListStudentDetail
  },
  {
    path: 'ExamListModifyStudentScore',
    name: 'ExamListModifyStudentScore',
    component: ExamListModifyStudentScore
  },
  {
    path: 'MyAEMScore',
    name: 'MyAEMScore',
    component: MyAEMScore
  },
  {
    path: 'achievement',
    name: 'achievement',
    component: Achievement
  },
  {
    path: 'achievementCreat',
    name: 'achievementCreat',
    component: AchievementCreat
  },
  {
    path: 'achievementEdit',
    name: 'achievementEdit',
    component: AchievementEdit
  },
  {
    path: 'achievementReport',
    name: 'achievementReport',
    component: AchievementReport
  },
  {
    path: 'showAchievement',
    name: 'showAchievement',
    component: ShowAchievement
  },
  // 成绩档案
  {
    path: 'headmasterStudentShowAchievement',
    name: 'headmasterStudentShowAchievement',
    component: HeadmasterStudentShowAchievement
  },
  {
    path: 'achievementRecord',
    name: 'achievementRecord',
    component: AchievementRecord
  },
  {
    path: 'achievementRecordDetail',
    name: 'achievementRecordDetail',
    component: AchievementRecordDetail
  },
  {
    path: 'studentAchievement',
    name: 'studentAchievement',
    component: StudentAchievement
  },
  {
    path: 'studentAchievementSubject',
    name: 'studentAchievementSubject',
    component: StudentAchievementSubject
  },
  {
    path: 'achievementRecordExamType',
    name: 'achievementRecordExamType',
    component: AchievementRecordExamType
  },
  {
    path: 'assignmentScoreManage',
    name: 'assignmentScoreManage',
    component: AssignmentScoreManage
  },
  {
    path: 'myAchievement',
    name: 'myAchievement',
    component: MyAchievement
  },
  // 教学质量
  {
    path: 'eaAASsetting', // 分析设置
    name: 'eaAASsetting',
    component: EaAASsetting
  },
  {
    path: 'eaAASanalyse', // 成绩分析
    name: 'eaAASanalyse',
    component: EaAASanalyse
  },
  {
    path: 'eaAASanalyseDetail', // 成绩分析-明细
    name: 'eaAASanalyseDetail',
    component: EaAASanalyseDetail
  },
  {
    path: 'achievementAnalysisAndFill', // 成绩分析成绩填报
    name: 'achievementAnalysisAndFill',
    component: AchievementAnalysisAndFill
  },
  {
    path: 'subjectAbilityAnalysis', // 学科能力分析
    name: 'subjectAbilityAnalysis',
    component: SubjectAbilityAnalysis
  },
  {
    path: 'MyInvigilator',
    name: 'MyInvigilator',
    component: MyInvigilator
  },
  {
    path: 'MyExamination',
    name: 'MyExamination',
    component: MyExamination
  },
  {
    path: 'ExamReport',
    name: 'ExamReport',
    component: ExamReport,
    children: [
      {
        path: 'TotalForm',
        name: 'TotalForm',
        component: TotalForm
      },
      {
        path: 'TeacherForm',
        name: 'TeacherForm',
        component: TeacherForm
      },
      {
        path: 'ExamInfoForm',
        name: 'ExamInfoForm',
        component: ExamInfoForm
      },
      {
        path: 'Roster',
        name: 'Roster',
        component: Roster
      },
      {
        path: 'Seat',
        name: 'Seat',
        component: Seat
      },
      {
        path: 'Desktop',
        name: 'Desktop',
        component: Desktop
      },
      {
        path: 'Count',
        name: 'Count',
        component: Count
      }
    ]
  }
]
export default educationAffairs
