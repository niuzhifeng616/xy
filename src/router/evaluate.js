// 课堂评价
const classRoom = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/ClassRoom.vue')
// 课堂评价-评价设置
const Setting = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/Setting.vue')
// 课堂评价-指标设置
const IndexSetting = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/IndexSetting.vue')
// 课堂评价-评价学生
const Student = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/Student.vue')
// 课堂评价-评价统计（行政班）
const AdminClass = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/AdminClass.vue')
// 课堂评价-评价统计（教学班）
const TeachingClass = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/TeachingClass.vue')
// 课堂评价-我的课堂评价
const MyEvaluate = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/MyEvaluate.vue')
// 课堂评价-我的课堂评价-评价详情
const CreateEvalu = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/CreateEvalu.vue')
// 课堂评价-评价统计（行政班） 详情页
const EvaluationStatisticsDesc = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/EvaluationStatisticsDesc.vue')
// 课堂评价-评价统计（教学班）详情页
const TeachingClassDetails = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/TeachingClassDetails.vue')
//
const Curriculum = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/Curriculum.vue')
//
const CurriculumDesc = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/CurriculumDesc.vue')
// 课堂评价-评价学生-批量选着
const EvaluationOperation = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/EvaluationOperation.vue')
// 课堂评价-评价学生-详情页
const EvaOperDesc = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/classRoom/EvaOperDesc.vue')

// 新的
// 评价方案
/* 方案列表 */
const PlanTable = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluatePlan/PlanTable.vue')
const StepsHeader = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluatePlan/StepsHeader.vue')
/* 方案创建和编辑 */
const PlanCreat = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluatePlan/Creat.vue')
// 选择学科
const ChooseDiscipline = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluatePlan/ChooseDiscipline.vue')
// 选择指标
const ChooseMark = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluatePlan/ChooseMark.vue')
// 评分规则
const ScoringRules = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluatePlan/ScoringRules.vue')
// 设置权重
const SetWeight = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluatePlan/SetWeight.vue')
// 小组折算
const GroupConversion = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluatePlan/GroupConversion.vue')
// 指标管理
const MarkManagement = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluatePlan/MarkManagement.vue')
// 评价学生-评价小组
const evaGroup = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluateStudent/evaGroup.vue')
// 评价学生-评价记录
const evaRecording = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluateStudent/evaRecording.vue')
// 评价学生-评价小组
const evaStudent = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluateStudent/evaStudent.vue')
// 小组管理-行政班-教学班
const AdministrativeClass = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/groupManagement/AdministrativeClass.vue')
// 评价统计
const evaluationStatistics = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluationStatistics/index.vue')
// 评价统计-均分对比-年级
const AverageGrade = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluationStatistics/averageComparison/AverageGrade.vue')
// 评价统计-均分对比-班级
const AverageClass = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluationStatistics/averageComparison/AverageClass.vue')
// 评价统计-均分对比-学生
const AverageStudent = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluationStatistics/averageComparison/AverageStudent.vue')
// 评价统计
const indexComparison = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluationStatistics/index.vue')
// 评价统计-指标对比-年级
const IndexGrade = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluationStatistics/indexComparison/IndexGrade.vue')
// 评价统计-指标对比-班级
const IndexClass = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluationStatistics/indexComparison/IndexClass.vue')
// 评价统计-指标对比-学生
const IndexStudent = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluationStatistics/indexComparison/IndexStudent.vue')
// 评价统计-评价明细
const Details = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/evaluationStatistics/evaluationDetails/Details.vue')
// 我的课堂评价
const myEvaluation = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/myEvaluation/index.vue')
// 我的课堂评价-均分
const MyAverage = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/myEvaluation/MyAverage.vue')
// 我的课堂评价-明细
const MyDetails = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/myEvaluation/MyDetails.vue')
// 我的课堂评价-指标
const MyIndex = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/lessonRoom/myEvaluation/MyIndex.vue')

// 学生评教
// 评教设置：方案列表
const evaSetting = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/setting/Setting.vue')
// 评教设置：创建方案-评教内容列表
const evaContent = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/setting/EvaContent.vue')
// 评教设置：创建方案-评教内容列表-评价对象
const evaPerson = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/setting/evaContent/EvaPerson.vue')
// 评教设置：创建方案-评教内容列表-评价问卷
const evaQuestion = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/setting/evaContent/EvaQuestion.vue')
// 评教设置：创建方案-评教内容列表-评价问卷 预览
const evaPreview = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/setting/evaContent/EvaPreview.vue')

// 学生端-评价教师列表
const EvaluateteachersList = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/studentRole/EvaluateteachersList.vue')
// 学生端-评价教师列表-详情
const EvaluateDetails = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/studentRole/EvaluateDetails.vue')
// 教师端-我的评价列表
const MyEvaluateList = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/teacherRole/MyEvaluateList.vue')
// 教师端-我的评价列表-详情
const MyEvaluateDetails = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/teacherRole/MyEvaluateDetails.vue')
// 教师端-我的评价问答题-详情
const MyEvaluateQuestionDetails = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/teacherRole/MyEvaluateQuestionDetails.vue')
// 评教进度
const evaSpeedofprogress = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/speedofprogress/Speedofprogress.vue')
// 汇总统计
const evaSummary = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/summary/Summary.vue')
// 汇总统计问答详情
const evaDetails = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/studentOfTeacher/summary/evaDetails.vue')

// 教学评价
// --列表页
const ScheSetting = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/SchemeSettings/Setting.vue')
// --公共头部页
const ConmmHeader = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/SchemeSettings/conmmHeader.vue')
// --创建方案
const Create = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/SchemeSettings/tabpane/Create.vue')
// --评价设置
const EvaStting = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/SchemeSettings/tabpane/EvaStting.vue')
// --选择指标
const Content = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/SchemeSettings/tabpane/Content.vue')
// --选择指标
const Control = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/SchemeSettings/tabpane/Control.vue')
// --选择指标-详情
const ControlDesc = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/SchemeSettings/tabpane/ControlDesc.vue')
// --选择指标-发布结果
const Speed = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/SchemeSettings/tabpane/Speed.vue')
// --选择指标-评价结果
const Result = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/SchemeSettings/tabpane/Result.vue')
// --选择指标-我的报告
const MyReport = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/SchemeSettings/myReport/MyReport.vue')

// 德育一日评价
// 评价设置
const scheme = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/setting/scheme.vue')
const oneDayCreate = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/setting/oneDayCreate.vue')
const evaCreate = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/setting/evaCreate.vue')
const addGrade = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/setting/addGrade.vue')
const targetEva = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/setting/targetEva.vue')
const targetManage = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/setting/targetManage.vue')
// 评价录入
const classMoralEdu = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/evaluateInput/classMoralEdu.vue')
const studentMoralEdu = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/evaluateInput/studentMoralEdu.vue')
// 评价统计
const evaStatistics = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/summary/searchHeader.vue')
const classDetails = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/summary/classDetails.vue')
const stuDetails = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/summary/stuDetails.vue')
const oneStuDetails = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/summary/oneStuDetails.vue')
// 我的德育评价
const myEvaOfMoral = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/dailyRoutine/myEvaluate/myEvaOfMoral.vue')

// 活动课程评价
// 活动设置-活动列表
const ActivityTable = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/activitySet/ActivityTable.vue')
// 活动设置-步骤
const AcStepsHeader = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/activitySet/StepsHeader.vue')
// 活动设置-创建活动
const AcCreate = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/activitySet/Creat.vue')
// 活动设置-添加学生
const AddStudents = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/activitySet/AddStudents.vue')
// 活动设置-活动指标
const ActivityMark = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/activitySet/ActivityMark.vue')
// 活动设置-指标管理
const AcMarkManagement = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/activitySet/MarkManagement.vue')
// 活动设置-活动模板
const ActivityTemplate = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/activitySet/ActivityTemplate.vue')
// 评价录入
const EntryTable = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/evaluateEntry/ActivityTable.vue')
const EvaEntry = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/evaluateEntry/EvaEntry.vue')
// 活动统计
const StatisticalTable = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/activityStatistical/ActivityTable.vue')
const StatisticalYear = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/activityStatistical/StatisticalYear.vue')
const StatisticalClass = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/activityStatistical/StatisticalClass.vue')
const StatisticalStudent = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/activityStatistical/StatisticalStudent.vue')
// 我的活动评价
const ActivityEvaTable = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/MyActivityEvaluate/ActivityTable.vue')
const MyActivityEva = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/activityCourse/MyActivityEvaluate/MyActivityEva.vue')

// 北斗七星评价系统
// 北斗七星-列表
const PlanetEva = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetRoom/planet/planetTable.vue')
// 北斗七星-创建方案
const PlantStepsHeader = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetRoom/planet/planetStepsHeader.vue')
const PlanetCreate = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetRoom/planet/create.vue')
// 北斗七星-规则设置
const PlanetRule = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetRoom/planet/ruleSetting.vue')
// 北斗七星-类别设置
const PlanetSetting = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/planetRoom/planet/typeSetting.vue')
// 松山湖 荣誉管理
// 荣誉列表
const honorList = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/honorAdministration/honorList.vue')
// 荣誉审批
const honorApproval = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/honorAdministration/honorApproval.vue')
// 荣誉申报
const createHonor = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/honorAdministration/createHonor.vue')
// 自主申报
const SelfList = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/selfCreated/honorList.vue')
const ApprovalManger = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/selfCreated/honorApproval.vue')
const CreateSelf = () => import(/* webpackChunkName: "evaluate" */ '@/pages/evaluate/views/selfCreated/createHonor.vue')
const evaluate = [
  {
    path: 'evaluate/ConmmHeader',
    name: 'ConmmHeader',
    component: ConmmHeader,
    // redirect: 'evaluate/ConmmHeader/Create',
    children: [
      {
        path: 'Create',
        name: 'Create',
        component: Create
      },
      {
        path: 'Content',
        name: 'Content',
        component: Content
      },
      {
        path: 'EvaStting',
        name: 'EvaStting',
        component: EvaStting
      },
      {
        path: 'Control',
        name: 'Control',
        component: Control
      },
      {
        path: 'Speed',
        name: 'Speed',
        component: Speed
      },
      {
        path: 'Result',
        name: 'Result',
        component: Result
      }
    ]
  },
  {
    path: 'evaluate//MyReport',
    name: 'MyReport',
    component: MyReport
  },
  {
    path: 'evaluate//ControlDesc',
    name: 'ControlDesc',
    component: ControlDesc
  },
  {
    path: 'evaluate//ScheSetting',
    name: 'ScheSetting',
    component: ScheSetting
  },
  {
    path: 'myEvaluation',
    name: 'myEvaluation',
    component: myEvaluation
  },
  {
    path: 'indexComparison',
    name: 'indexComparison',
    component: indexComparison
  },
  {
    path: 'MyAverage',
    name: 'MyAverage',
    component: MyAverage
  },
  // {
  //   path: 'MyAverage/AvgDesc',
  //   name: 'AvgDesc',
  //   component: AvgDesc
  // },
  {
    path: 'MyDetails',
    name: 'MyDetails',
    component: MyDetails
  },
  {
    path: 'MyIndex',
    name: 'MyIndex',
    component: MyIndex
  },
  {
    path: 'Details',
    name: 'Details',
    component: Details
  },
  {
    path: 'IndexGrade',
    name: 'IndexGrade',
    component: IndexGrade
  },
  {
    path: 'IndexClass',
    name: 'IndexClass',
    component: IndexClass
  },
  {
    path: 'IndexStudent',
    name: 'IndexStudent',
    component: IndexStudent
  },
  {
    path: 'AverageGrade/AverageStudent',
    name: 'AverageStudent',
    component: AverageStudent
  },
  {
    path: 'AverageGrade',
    name: 'AverageGrade',
    component: AverageGrade
  },
  {
    path: 'AverageGrade/AverageClass',
    name: 'AverageClass',
    component: AverageClass
  },
  {
    path: 'evaluationStatistics',
    name: 'evaluationStatistics',
    component: evaluationStatistics
  },
  {
    path: 'AdministrativeClass',
    name: 'AdministrativeClass',
    component: AdministrativeClass
  },
  {
    path: 'evaStudent/evaGroup',
    name: 'evaGroup',
    component: evaGroup
  },
  {
    path: 'evaStudent/evaRecording',
    name: 'evaRecording',
    component: evaRecording
  },
  {
    path: 'evaStudent',
    name: 'evaStudent',
    component: evaStudent
  },
  {
    path: 'classRoom',
    name: 'classRoom',
    component: classRoom,
    children: [
      {
        path: 'Setting',
        name: 'Setting',
        component: Setting
      },
      {
        path: 'IndexSetting',
        name: 'IndexSetting',
        component: IndexSetting
      },
      {
        path: 'Student',
        name: 'Student',
        component: Student
      },
      {
        path: 'AdminClass',
        name: 'AdminClass',
        component: AdminClass
      },
      {
        path: 'TeachingClass',
        name: 'TeachingClass',
        component: TeachingClass
      },
      {
        path: 'TeachingClassDetails',
        name: 'TeachingClassDetails',
        component: TeachingClassDetails
      },
      {
        path: 'MyEvaluate',
        name: 'MyEvaluate',
        component: MyEvaluate
      },
      {
        path: 'CreateEvalu',
        name: 'CreateEvalu',
        component: CreateEvalu
      },
      {
        path: 'CurriculumDesc',
        name: 'CurriculumDesc',
        component: CurriculumDesc
      },
      {
        path: 'EvaluationStatisticsDesc',
        name: 'EvaluationStatisticsDesc',
        component: EvaluationStatisticsDesc
      },
      {
        path: 'Curriculum',
        name: 'Curriculum',
        component: Curriculum
      },
      {
        path: 'EvaluationOperation',
        name: 'EvaluationOperation',
        component: EvaluationOperation
      },
      {
        path: 'EvaOperDesc',
        name: 'EvaOperDesc',
        component: EvaOperDesc
      }
    ]
  },
  {
    path: 'evaPlanTable',
    name: 'evaPlanTable',
    component: PlanTable
  },
  {
    path: 'evaMarkManagement',
    name: 'evaMarkManagement',
    component: MarkManagement
  },
  {
    path: 'evaStepsHeader',
    name: 'evaStepsHeader',
    component: StepsHeader,
    children: [
      {
        path: 'PlanCreat',
        name: 'PlanCreat',
        component: PlanCreat
      },
      {
        path: 'ChooseDiscipline',
        name: 'ChooseDiscipline',
        component: ChooseDiscipline
      },
      {
        path: 'ChooseMark',
        name: 'ChooseMark',
        component: ChooseMark
      },
      {
        path: 'ScoringRules',
        name: 'ScoringRules',
        component: ScoringRules
      },
      {
        path: 'SetWeight',
        name: 'SetWeight',
        component: SetWeight
      },
      {
        path: 'GroupConversion',
        name: 'GroupConversion',
        component: GroupConversion
      }
    ]
  },
  {
    path: 'EvaluateteachersList',
    name: 'EvaluateteachersList',
    component: EvaluateteachersList
  },
  {
    path: 'EvaluateDetails',
    name: 'EvaluateDetails',
    component: EvaluateDetails
  },
  {
    path: 'MyEvaluateList',
    name: 'MyEvaluateList',
    component: MyEvaluateList
  },
  {
    path: 'MyEvaluateDetails',
    name: 'MyEvaluateDetails',
    component: MyEvaluateDetails
  },
  {
    path: 'MyEvaluateQuestionDetails',
    name: 'MyEvaluateQuestionDetails',
    component: MyEvaluateQuestionDetails
  },
  {
    path: 'evaSetting',
    name: 'evaSetting',
    component: evaSetting
  },
  {
    path: 'evaContent',
    name: 'evaContent',
    component: evaContent
  },
  {
    path: 'evaPerson',
    name: 'evaPerson',
    component: evaPerson
  },
  {
    path: 'evaQuestion',
    name: 'evaQuestion',
    component: evaQuestion
  },
  {
    path: 'evaPreview',
    name: 'evaPreview',
    component: evaPreview
  },
  {
    path: 'evaSpeedofprogress',
    name: 'evaSpeedofprogress',
    component: evaSpeedofprogress
  },
  {
    path: 'evaSummary',
    name: 'evaSummary',
    component: evaSummary
  },
  {
    path: 'evaDetails',
    name: 'evaDetails',
    component: evaDetails
  },
  // 德育一日评价
  {
    path: 'RoutineScheme',
    name: 'scheme',
    component: scheme
  },
  {
    path: 'oneDayCreate',
    name: 'oneDayCreate',
    component: oneDayCreate,
    children: [
      {
        path: 'evaCreate',
        name: 'evaCreate',
        component: evaCreate
      },
      {
        path: 'addGrade',
        name: 'addGrade',
        component: addGrade
      },
      {
        path: 'targetEva',
        name: 'targetEva',
        component: targetEva
      }
    ]
  },
  {
    path: 'RoutineClassMoralEdu',
    name: 'classMoralEdu',
    component: classMoralEdu
  },
  {
    path: 'RoutineStudentMoralEdu',
    name: 'studentMoralEdu',
    component: studentMoralEdu
  },
  {
    path: 'RoutineEvaStatistics',
    name: 'evaStatistics',
    component: evaStatistics
  },
  {
    path: 'classDetails',
    name: 'classDetails',
    component: classDetails
  },
  {
    path: 'stuDetails',
    name: 'stuDetails',
    component: stuDetails
  },
  {
    path: 'oneStuDetails',
    name: 'oneStuDetails',
    component: oneStuDetails
  },
  {
    path: 'RoutineMyEvaOfMoral',
    name: 'myEvaOfMoral',
    component: myEvaOfMoral
  },
  // 活动课程评价
  {
    path: 'acivityTable',
    name: 'activityTable',
    component: ActivityTable
  },
  {
    path: 'acStepsHeader',
    name: 'acStepsHeader',
    component: AcStepsHeader,
    children: [
      {
        path: 'acCreate',
        name: 'acCreate',
        component: AcCreate
      },
      {
        path: 'addStudents',
        name: 'addStudents',
        component: AddStudents
      },
      {
        path: 'activityMark',
        name: 'activityMark',
        component: ActivityMark
      }
    ]
  },
  {
    path: 'targetManage',
    name: 'targetManage',
    component: targetManage
  },
  {
    path: 'acMarkManagement',
    name: 'acMarkManagement',
    component: AcMarkManagement
  },
  {
    path: 'activityTemplate',
    name: 'activityTemplate',
    component: ActivityTemplate
  },
  {
    path: 'entryTable',
    name: 'entryTable',
    component: EntryTable
  },
  {
    path: 'evaEntry',
    name: 'evaEntry',
    component: EvaEntry
  },
  {
    path: 'statisticalTable',
    name: 'statisticalTable',
    component: StatisticalTable
  },
  {
    path: 'statisticalYear',
    name: 'statisticalYear',
    component: StatisticalYear
  },
  {
    path: 'statisticalClass',
    name: 'statisticalClass',
    component: StatisticalClass
  },
  {
    path: 'statisticalStudent',
    name: 'statisticalStudent',
    component: StatisticalStudent
  },
  {
    path: 'activityEvaTable',
    name: 'activityEvaTable',
    component: ActivityEvaTable
  },
  {
    path: 'myActivityEva',
    name: 'myActivityEva',
    component: MyActivityEva
  },
  // 荣誉管理
  {
    path: 'honorList',
    name: 'honorList',
    component: honorList
  },
  {
    path: 'honorApproval',
    name: 'honorApproval',
    component: honorApproval
  },
  {
    path: 'createHonor',
    name: 'createHonor',
    component: createHonor
  },
  // 北斗七星
  {
    path: 'planetEva',
    name: 'planetEva',
    component: PlanetEva
  },
  {
    path: 'planetStepsHeader',
    name: 'planetStepsHeader',
    component: PlantStepsHeader,
    children: [
      {
        path: 'planetCreate',
        name: 'planetCreate',
        component: PlanetCreate
      },
      {
        path: 'planetRule',
        name: 'planetRule',
        component: PlanetRule
      }
    ]
  },
  {
    path: 'planetSetting',
    name: 'planetSetting',
    component: PlanetSetting
  },
  {
    path: 'selfList',
    name: 'selfList',
    component: SelfList
  },
  {
    path: 'approvalManger',
    name: 'approvalManger',
    component: ApprovalManger
  },
  {
    path: 'createSelf',
    name: 'createSelf',
    component: CreateSelf
  }

]
export default evaluate
