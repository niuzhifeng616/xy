// 选择教师、教室、学生
const RadioSelectClasses = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/components/selectClasses/RadioSelectClassesDemo.vue')
const CheckboxSelectTeacher = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/components/selectTeacher/CheckboxSelectTeacherDemo.vue')
const CheckboxSelectStudent = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/components/selectStudent/CheckboxSelectStudentDemo.vue')
const CheckboxSelectClasses = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/components/selectClasses/CheckboxSelectClassesDemo.vue')
// 行政班排课方案
const Administrative = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/ClassTable.vue')
const AdministrativeStepHeader = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/StepsHeader.vue')
const AdministrativeCreateClass = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/CreateClassTable.vue')
const AdministrativeWorkTime = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/WorkTime.vue')
const AdministrativeClassList = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/arrangingClasses/ClassList.vue')
const AdministrativeStudentList = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/arrangingClasses/EditorStudent.vue')
const AdministrativeCrouseSetting = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/CrouseSetting.vue')
const AdministrativeRule = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/arrangingRules/RuleHeader.vue')
const AdministrativeArranging = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/Arranging.vue')
const AdministrativeStartProcess = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/StartProcess.vue')
const AdministrativeSchedule = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/manuallyAdjust/Schedule.vue')
const AdministrativeScheduleAnalysis = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/manuallyAdjust/ScheduleAnalysis.vue')

const AdministrativeReleaseSchedule = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeClass/ReleaseSchedule.vue')

// 行政班调课
const AdjustmentTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeAdjustment/AdjustmentTable.vue')
const CreatAdjustment = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeAdjustment/CreatAdjustment.vue')
const AcrossWeek = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeAdjustment/AcrossWeek.vue')
const AdjustmentNotice = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/administrativeAdjustment/AdjustNotice.vue')

const LayeredClassTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/Layered/ClassTable.vue')
const LayeredCreateClassTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/Layered/CreateClassTable.vue')
const LayeredStepsHeader = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/Layered/LayeredStepsHeader.vue')
// 选科分班:方案列表
const SmartClassTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/ClassTable.vue')
// 选科分班:步骤头
const SmartStepsHeader = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/SmartStepsHeader.vue')
// 选科分班:基础信息
const SmartCreateClassTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/CreateClassTable.vue')
// 选科分班：选课结果
const SmartSelectSubjectResult = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass//selectSubjectResult/table/SelectSubjectResult.vue')
// 选科分班：选课结果>选课统计
const SmartStatisticalAnalysis = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/selectSubjectResult/statistical/StatisticalAnalysis.vue')
// 选科分班：选课结果>学生成绩
const SmartStudentScore = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/selectSubjectResult/studentAchievement/StudentScore.vue')
// 选科分班：选课结果>学生分区
const Partition = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/selectSubjectResult/Partition.vue')
// 选科分班：分班设置
const DivideClassSet = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/DivideClassSet.vue')
// 选科分班：启动分班
const StartDivideClass = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/StartDivideClass.vue')
// 选科分班：优化分班
const SmartClassResult = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/divideClassResult/ClassResult.vue')
// 选科分班：优化分班>精品优化
const FineOptimiza = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/divideClassResult/FineOptimiza.vue')
// 选科分班：优化分班>班级统计
const ClassStatistical = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/divideClassResult/ClassStatistical.vue')
// 选科分班：优化分班>班级统计
const GoClassStatistical = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/divideClassResult/GoClassStatistical.vue')
// 选科分班：优化分班>班级名单
const ClassList = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/divideClassResult/ClassList.vue')
// 选科分班：优化分班>调整学生
const AdjustSudents = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/divideClassResult/AdjustSudents.vue')
// 选科分班：发布
const SmartPublish = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/smartDivideClass/Publish.vue')

// 班级学生
const MyStudents = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/myStudents/MyStudents.vue')
// 我的课表
const MySchedule = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/mySchedule/MySchedule.vue')
// 在线选课列表
const OnlineCourseList = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/onlineCourseSelection/OnlineCourseList.vue')
// 在线选课-分层选课:去选课
const OnlineChooseCourseLayered = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/onlineCourseSelection/layered/OnlineCourseSelect.vue')
// 在线选课-分层选课:去预览/查看选课结果
const OnlineChooseCourseLayeredView = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/onlineCourseSelection/layered/OnlineCoursePreview.vue')
// 在线选课-抢课式选课:去选课(简单模式)
const OnlineChooseCourseTLesson = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/onlineCourseSelection/takeLessons/OnlineCourseSelect.vue')
// 在线选课-抢课式选课:去选课(分组模式)
const OnlineChooseCourseTLessonG = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/onlineCourseSelection/takeLessons/OnlineGroupSelect.vue')
// 在线选课-抢课式选课:去预览/查看选课结果(简单和分组两种模式公用)
const OnlineChooseCourseTLessonView = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/onlineCourseSelection/takeLessons/OnlineCoursePreview.vue')
// 在线选课-抢课式选课:选课结果(简单和分组两种模式公用)
const OnlineChooseCourseTLessonResult = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/onlineCourseSelection/takeLessons/OnlineCourseResult.vue')

// 选课统计
const StatisticalAnalysis = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/statisticalAnalysis/Progress.vue')

// 校本排课（抢课式）
const TakeLessons = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/ClassTable.vue')
// 校本排课（抢课式）-学段管理
const TakeLessonsLearningPeriod = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/LearningPeriod.vue')
// 校本排课（抢课式）-header
const TakeLessonsStepsHeader = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/StepsHeader.vue')
// 校本排课（抢课式）-1.基本设置
const TLCreateClassTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/CreateClassTable.vue')
// 校本排课（抢课式）-2.作息时间
const TLWorkTime = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/WorkTime.vue')
// 校本排课（抢课式）-3.选课学生
const TLArrangingStudents = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/ArrangingStudents.vue')
// 校本排课（抢课式）-4.排课课位
const TLArranging = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/Arranging.vue')
// 校本排课（抢课式）-5.课程设置
const TLCourseSetting = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/CourseSetting.vue')
// 校本排课（抢课式）-6.查看课表
const TLLookSchedule = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/LookSchedule.vue')
// 校本排课（抢课式）-7.选课模式
const TLSelectionType = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/selectionType/Type.vue')
// 校本排课（抢课式）-8.选课规则
const TLArrangingRules = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/arrangingRules/RuleHeader.vue')
// 校本排课（抢课式）-9.生成选课数据
const TLRegistrationData = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/RegistrationData.vue')
// 校本排课（抢课式）-10.数据核查
const TLVerification = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/verification/RuleHeader.vue')
// 校本排课（抢课式）-11.选课时间
const TLCourseSelectionTime = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/CourseSelectionTime.vue')
// 校本排课（抢课式）-12.选课结果
const TLCourseSelectionResults = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/courseSelectionResults/ResultHeader.vue')
// 校本排课（抢课式）-13.发布启用
const TLReleaseSchedule = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/takeLessons/ReleaseSchedule.vue')

// 走班排课（先选）
const ClassTableOrder = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/ClassTable.vue')
// 步骤页
const GoClassStepsHeader = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/StepsHeader.vue')
// 新增排课
const AddClassTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/CreateClassTable.vue')
// 作息时间
const WorkTime = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/workTime.vue')
// 选课结果
const Progress = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/courseSelectionResults/result/Progress.vue')
// 选课结果
const StudentScore = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/courseSelectionResults/studentAchievement/StudentScore.vue')
// 课程设置
const ClassSet = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/courseSelectionResults/classSet/ClassSet.vue')
const GoStatisticalAnalysis = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/courseSelectionResults/statistical/StatisticalAnalysis.vue')
const GoSingleCountChart = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/courseSelectionResults/statistical/SingleCountChart.vue')
const GoLayeredStatistical = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/courseSelectionResults/statistical/LayeredStatistical.vue')
const GoCombinationStatistical = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/courseSelectionResults/statistical/CombinationStatistical.vue')
// 开课计划
const StartClassSet = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/startClassSet/StartClassSet.vue')
// 开课计划
const LookSet = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/startClassSet/LookSet.vue')
// 排课规则
const RuleHeader = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/arrangingRules/RuleHeader.vue')
// 排课课位
const Arranging = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/Arranging.vue')
//  启动排课
const StartProcess = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/StartProcess.vue')
//  走班排课（先选）-手动调整
const AdjustHeader = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/manuallyAdjust/AdjustHeader.vue')
//  走班排课（先选）-发布课表
const ReleaseSchedule = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/ReleaseSchedule.vue')
//  走班排课（先选）-学生调班
const LookGrade = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/studentsSwitched/LookGrade.vue')
//  走班排课（先选）-学生调班
const StudentSwitchedAdjust = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/studentsSwitched/StudentSwitchedAdjust.vue')
//  走班排课（先选）-学生调班
const StudentSwitchedTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/studentsSwitched/StudentSwitchedTable.vue')
//  走班排课（先选）-排自习
const RowSelfStudy = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/rowOfSelfStudy/RowSelfStudy.vue')
//  走班排课（先选）-排自习
const StudentTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/rowOfSelfStudy/StudentTable.vue')
//  走班排课（先选）-启用课表
const EnableSchedule = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/goClass/EnableSchedule.vue')

// 课表变动>教师代课
const SubstituteTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/substituteTeacher/SubstituteTable.vue')
// 课表变动>教师代课>代课通知
const AdjustNotice = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/substituteTeacher/AdjustNotice.vue')
// 课表变动>教师代课>继续调整未完成代课
const ContinueCreat = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/substituteTeacher/ContinueCreat.vue')
// 课表变动>教师代课>创建代课
const CreatSubstitute = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/substituteTeacher/CreatSubstitute.vue')
// 课表变动>临时假期
const HolidayTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/temporaryHoliday/HolidayTable.vue')
// 课表变动>临时假期>放假
const TemHoliday = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/temporaryHoliday/TemHoliday.vue')
// 课表变动>临时假期>补课
const MakeUpLessonTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/temporaryHoliday/MakeUpLessonTable.vue')
// 课表变动>临时假期>放假:查看放假详情
const LookHoliday = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/temporaryHoliday/LookHoliday.vue')
// 课表变动>临时假期>补课:查看补课详情
const LookMakeUpLesson = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/temporaryHoliday/LookMakeUpLesson.vue')
// 课表变动>临时假期>放假:创建假期
const CreatHoliday = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/temporaryHoliday/CreatHoliday.vue')
// 课表变动>临时假期>补课:创建补课
const CreatMakeUpLesson = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/temporaryHoliday/CreatMakeUpLesson.vue')
// 课表变动>提醒设置
const SchRemind = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/remind/Remind.vue')
// 课表变动>提醒设置:提醒设置
const RemindSet = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/remind/RemindSet.vue')
// 课表变动>提醒设置:审批流程
const ApprovalFlow = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/remind/ApprovalFlow.vue')
// 课表变动>课程变更
const ClassChange = () => import(/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/classChange/ClassChange.vue')
const List = () => import(/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/classChange/List.vue')
const ToGrade = () => import(/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/classChange/ToGrade.vue')

// 课表变动>消息:调代课申请的调课详情
const ApplyAdjustDetail = () => import(/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/adjustSubstituteMsg/ApplyAdjustDetail.vue')
// 课表变动>消息:调代课申请的代课详情
const ApplySubstitutDetail = () => import(/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/adjustSubstituteMsg/ApplySubstitutDetail.vue')
// 课表变动>消息:调代课审批的调课审批
const ApprovalAdjust = () => import(/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/adjustSubstituteMsg/ApprovalAdjust.vue')
// 课表变动>消息:调代课审批的代课审批
const ApprovalSubstitutes = () => import(/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/adjustSubstituteMsg/ApprovalSubstitutes.vue')
// 课表变动>消息:调代课审批的调课详情
const ApprovedAdjustDetail = () => import(/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/adjustSubstituteMsg/ApprovedAdjustDetail.vue')
// 课表变动>消息:调代课审批的代课详情
const ApprovedSubstitutesDetail = () => import(/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleChanges/adjustSubstituteMsg/ApprovedSubstitutesDetail.vue')

// 课表汇总
/* 学期课表 */
const SemesterQueryConditions = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/QueryConditions.vue')
const SemesterScheduleHeader = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/ScheduleHeader.vue')
const SemesterPrintAdministrative = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/print/Administrative.vue')
const SemesterRoomPrint = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/print/RoomPrint.vue')
const SemesterStudentPrint = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/print/StudentPrint.vue')
const SemesterTeacherPrint = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/print/TeacherPrint.vue')

const SemesterTotal = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/Total.vue')// 学期课表-总课表
// 学期课表-行政班课表
const SemesterAdministrative = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/Administrative.vue')
// 学期课表-走班课表
const SemesterShiftClass = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/ShiftClass.vue')
// 学期课表-教师课表
const SemesterTeacherTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/TeacherTable.vue')
// 学期课表-学生课表
const SemesterStudentTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/StudentTable.vue')
// 学期课表-教室课表
const SemesterClassRoomSchedule = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/semesterSchedule/ClassRoomTable.vue')
// 每周课表
const WeekScheduleConditions = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/QueryConditions.vue')
const WeekScheduleHeader = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/ScheduleHeader.vue')
const WeekPrintAdministrative = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/print/AdministrativePrint.vue')
const WeekRoomPrint = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/print/RoomPrint.vue')
const WeekStudentPrint = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/print/StudentPrint.vue')
const WeekTeacherPrint = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/print/TeacherPrint.vue')

// 每周课表-总课表
const WeekTotal = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/Total.vue')
// 每周课表-行政班课表
const WeekAdministrative = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/Administrative.vue')
// 每周课表-走班课表
const WeekShiftClass = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/ShiftClass.vue')
// 每周课表-教师课表
const WeekTeacherTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/TeacherTable.vue')
// 每周课表-学生课表
const WeekStudentTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/StudentTable.vue')
// 每周课表-教室课表
const WeekClassRoomSchedule = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/weekSchedule/ClassRoomTable.vue')
// 教学班学生
const ShiftScheduleConditions = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/shiftSchedule/QueryConditions.vue')
const ShiftScheduleHeader = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/shiftSchedule/ScheduleHeader.vue')
// 教学班学生-教学班学生名单
const ShiftScheduleTotal = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/shiftSchedule/Total.vue')
// 教学班学生-行政班学生去向
const ShiftScheduleAdministrative = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/shiftSchedule/Administrative.vue')
// 工作量统计
const WorkloadSchedule = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/scheduleQuery/workloadSchedule/QueryConditions.vue')

// 设置教室
const SetRoomTable = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/rowClassRoom/RowRoomTable.vue')
// 自动排教室
const RoomAutoAdjust = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/rowClassRoom/RoomAutoAdjust.vue')
// 排教室
const RowRoom = () => import (/* webpackChunkName: "csmstimetable" */ '@/pages/csmsTimeTable/views/rowClassRoom/RowRoom.vue')

const csmstimetable = [
  {
    path: 'CheckboxSelectTeacher',
    name: 'CheckboxSelectTeacher',
    component: CheckboxSelectTeacher
  },
  {
    path: 'RadioSelectClasses',
    name: 'RadioSelectClasses',
    component: RadioSelectClasses
  },
  {
    path: 'CheckboxSelectClasses',
    name: 'CheckboxSelectClasses',
    component: CheckboxSelectClasses
  },
  {
    path: 'CheckboxSelectStudent',
    name: 'CheckboxSelectStudent',
    component: CheckboxSelectStudent
  },
  // 走班排课（先选）-主页
  {
    path: 'classTableOrder',
    name: 'classTableOrder',
    component: ClassTableOrder
  },
  // 走班排课（先选）-步骤页
  {
    path: 'goClassStepsHeader',
    name: 'goClassStepsHeader',
    component: GoClassStepsHeader,
    children: [
      { // 新增走班排课
        path: 'addClassTable',
        name: 'addClassTable',
        component: AddClassTable
      },
      { // 作息时间
        path: 'workTime',
        name: 'workTime',
        component: WorkTime
      },
      // 走班排课（先选）-选课结果
      {
        path: 'progress',
        name: 'progress',
        component: Progress
      },
      // 走班排课（先选）-选课结果-学生成绩
      {
        path: 'studentScore',
        name: 'studentScore',
        component: StudentScore
      },
      // 走班排课（先选）-课程设置
      {
        path: 'classSet',
        name: 'classSet',
        component: ClassSet
      },
      // 走班排课（先选）-选课统计
      {
        path: 'goStatisticalAnalysis',
        name: 'goStatisticalAnalysis',
        component: GoStatisticalAnalysis,
        redirect: '/xyhome/goClassStepsHeader/goStatisticalAnalysis/single',
        children: [ {
          path: 'single',
          name: 'single',
          component: GoSingleCountChart
        },
        {
          path: 'layered',
          name: 'layered',
          component: GoLayeredStatistical
        },
        {
          path: 'combination',
          name: 'combination',
          component: GoCombinationStatistical
        }]
      },
      // 走班排课（先选）-开课计划
      {
        path: 'startClassSet',
        name: 'startClassSet',
        component: StartClassSet
      },
      // 走班排课（先选）-开课计划
      {
        path: 'lookSet',
        name: 'lookSet',
        component: LookSet
      },
      // 走班排课（先选）-排课课位
      {
        path: 'arranging',
        name: 'arranging',
        component: Arranging
      },
      // 走班排课（先选）-启动排课
      {
        path: 'startProcess',
        name: 'startProcess',
        component: StartProcess
      },
      // 走班排课（先选）-手动调整
      {
        path: 'adjustHeader',
        name: 'adjustHeader',
        component: AdjustHeader
      },
      // 走班排课（先选）-发布课表
      {
        path: 'releaseSchedule',
        name: 'releaseSchedule',
        component: ReleaseSchedule
      },
      // 走班排课（先选）-学生调班
      {
        path: 'studentSwitchedTable',
        name: 'studentSwitchedTable',
        component: StudentSwitchedTable
      },
      // 走班排课（先选）-学生调班
      {
        path: 'lookGrade',
        name: 'lookGrade',
        component: LookGrade
      },
      // 走班排课（先选）-学生调班
      {
        path: 'studentSwitchedAdjust',
        name: 'studentSwitchedAdjust',
        component: StudentSwitchedAdjust
      },
      // 走班排课（先选）-排自习
      {
        path: 'studentTable',
        name: 'studentTable',
        component: StudentTable
      },
      // 走班排课（先选）-排自习
      {
        path: 'rowSelfStudy',
        name: 'rowSelfStudy',
        component: RowSelfStudy
      },
      // 走班排课（先选）-启用课表
      {
        path: 'enableSchedule',
        name: 'enableSchedule',
        component: EnableSchedule
      },
      // 走班排课（先选）-RuleHeader
      {
        path: 'ruleHeader',
        name: 'ruleHeader',
        component: RuleHeader
      }
    ]
  },

  // 行政班排课方案
  {
    path: 'administrative',
    name: 'administrative',
    component: Administrative
  },
  {
    path: 'administrativeStepHeader',
    name: 'administrativeStepHeader',
    component: AdministrativeStepHeader,
    children: [
      {
        path: 'administrativeCreateClass',
        name: 'administrativeCreateClass',
        component: AdministrativeCreateClass
      },
      {
        path: 'administrativeWorkTime',
        name: 'administrativeWorkTime',
        component: AdministrativeWorkTime
      },
      {
        path: 'administrativeClassList',
        name: 'administrativeClassList',
        component: AdministrativeClassList
      },
      {
        path: 'administrativeStudentList',
        name: 'administrativeStudentList',
        component: AdministrativeStudentList
      },
      {
        path: 'administrativeCrouseSetting',
        name: 'administrativeCrouseSetting',
        component: AdministrativeCrouseSetting
      },
      {
        path: 'administrativeRule',
        name: 'administrativeRule',
        component: AdministrativeRule
      },
      {
        path: 'administrativeArranging',
        name: 'administrativeArranging',
        component: AdministrativeArranging
      },
      {
        path: 'administrativeStartProcess',
        name: 'administrativeStartProcess',
        component: AdministrativeStartProcess
      },
      {
        path: 'administrativeSchedule',
        name: 'administrativeSchedule',
        component: AdministrativeSchedule
      },
      {
        path: 'administrativeScheduleAnalysis',
        name: 'administrativeScheduleAnalysis',
        component: AdministrativeScheduleAnalysis
      },
      {
        path: 'administrativeReleaseSchedule',
        name: 'administrativeReleaseSchedule',
        component: AdministrativeReleaseSchedule
      }
    ]
  },
  // 行政班调课
  {
    path: 'adjustmentTable',
    name: 'adjustmentTable',
    component: AdjustmentTable
  },
  {
    path: 'creatAdjustment',
    name: 'creatAdjustment',
    component: CreatAdjustment
  },
  {
    path: 'acrossWeek',
    name: 'acrossWeek',
    component: AcrossWeek
  },
  {
    path: 'adjustmentNotice',
    name: 'adjustmentNotice',
    component: AdjustmentNotice
  },

  {
    path: 'layeredClassTable',
    name: 'layeredClassTable',
    component: LayeredClassTable
  },
  {
    path: 'layeredCreate',
    name: 'layeredCreateClassTable',
    component: LayeredCreateClassTable
  },
  {
    path: 'layeredStepsHeader',
    name: 'layeredStepsHeader',
    component: LayeredStepsHeader
  },
  {
    path: 'smartClassTable',
    name: 'smartClassTable',
    component: SmartClassTable
  },
  {
    path: 'smartStepsHeader',
    name: 'smartStepsHeader',
    component: SmartStepsHeader,
    children: [{
      path: 'smartCreateClassTable',
      name: 'smartCreateClassTable',
      component: SmartCreateClassTable
    },
    {
      path: 'smartSelectSubjectResult',
      name: 'smartSelectSubjectResult',
      component: SmartSelectSubjectResult
    },
    {
      path: 'smartstatisticalAnalysis',
      name: 'smartStatisticalAnalysis',
      component: SmartStatisticalAnalysis
    },
    {
      path: 'smartStudentScore',
      name: 'smartStudentScore',
      component: SmartStudentScore
    },
    {
      path: 'partition',
      name: 'partition',
      component: Partition
    },
    {
      path: 'divideClassSet',
      name: 'divideClassSet',
      component: DivideClassSet
    },
    {
      path: 'startDivideClass',
      name: 'startDivideClass',
      component: StartDivideClass
    },
    {
      path: 'smartClassResult',
      name: 'smartClassResult',
      component: SmartClassResult
    },
    {
      path: 'fineOptimiza',
      name: 'fineOptimiza',
      component: FineOptimiza
    },
    {
      path: 'classStatistical',
      name: 'classStatistical',
      component: ClassStatistical
    },
    {
      path: 'goClassStatistical',
      name: 'goClassStatistical',
      component: GoClassStatistical
    },
    {
      path: 'classList',
      name: 'classList',
      component: ClassList
    },
    {
      path: 'adjustSudents',
      name: 'adjustSudents',
      component: AdjustSudents
    },
    {
      path: 'smartPublish',
      name: 'smartPublish',
      component: SmartPublish
    }
    ]
  },
  {
    path: 'myStudents',
    name: 'myStudents',
    component: MyStudents
  },
  {
    path: 'mySchedule',
    name: 'mySchedule',
    component: MySchedule
  },
  {
    path: 'onlineCourseList',
    name: 'onlineCourseList',
    component: OnlineCourseList
  },
  {
    path: 'onlineChooseCourseLayered',
    name: 'onlineChooseCourseLayered',
    component: OnlineChooseCourseLayered
  },
  {
    path: 'onlineChooseCourseLayeredView',
    name: 'onlineChooseCourseLayeredView',
    component: OnlineChooseCourseLayeredView
  },
  {
    path: 'onlineChooseCourseTLesson',
    name: 'onlineChooseCourseTLesson',
    component: OnlineChooseCourseTLesson
  },
  {
    path: 'onlineChooseCourseTLessonG',
    name: 'onlineChooseCourseTLessonG',
    component: OnlineChooseCourseTLessonG
  },
  {
    path: 'onlineChooseCourseTLessonView',
    name: 'onlineChooseCourseTLessonView',
    component: OnlineChooseCourseTLessonView
  },
  {
    path: 'onlineChooseCourseTLessonResult',
    name: 'onlineChooseCourseTLessonResult',
    component: OnlineChooseCourseTLessonResult
  },
  {
    path: 'statisticalAnalysis',
    name: 'statisticalAnalysis',
    component: StatisticalAnalysis
  },
  // 校本排课（抢课式）
  {
    path: 'takeLessons',
    name: 'takeLessons',
    component: TakeLessons
  },
  {
    path: 'takeLessonsLearningPeriod',
    name: 'takeLessonsLearningPeriod',
    component: TakeLessonsLearningPeriod
  },
  {
    path: 'takeLessonsStepsHeader',
    name: 'takeLessonsStepsHeader',
    component: TakeLessonsStepsHeader,
    children: [
      {
        path: 'createClassTable', // 1.基本设置
        name: 'createClassTable',
        component: TLCreateClassTable
      },
      {
        path: 'workTime', // 2.作息时间
        name: 'workTime',
        component: TLWorkTime
      },
      {
        path: 'arrangingStudents', // 3.选课学生
        name: 'arrangingStudents',
        component: TLArrangingStudents
      },
      {
        path: 'arranging', // 4.排课课位
        name: 'arranging',
        component: TLArranging
      },
      {
        path: 'courseSetting', // 5.课程设置
        name: 'courseSetting',
        component: TLCourseSetting
      },
      {
        path: 'lookSchedule', // 6.查看课表
        name: 'lookSchedule',
        component: TLLookSchedule
      },
      {
        path: 'selectionType', // 7.选课模式
        name: 'selectionType',
        component: TLSelectionType
      },
      {
        path: 'arrangingRules', // 8.选课规则
        name: 'arrangingRules',
        component: TLArrangingRules
      },
      {
        path: 'registrationData', // 9.生成选课数据
        name: 'registrationData',
        component: TLRegistrationData
      },
      {
        path: 'verification', // 10.数据核查
        name: 'verification',
        component: TLVerification
      },
      {
        path: 'courseSelectionTime', // 11.选课时间
        name: 'courseSelectionTime',
        component: TLCourseSelectionTime
      },
      {
        path: 'courseSelectionResults', // 12.选课结果
        name: 'courseSelectionResults',
        component: TLCourseSelectionResults
      },
      {
        path: 'releaseSchedule', // 13.发布启用
        name: 'releaseSchedule',
        component: TLReleaseSchedule
      }
    ]
  },
  // 课表变动-教师代课
  {
    path: 'substituteTable',
    name: 'substituteTable',
    component: SubstituteTable
  },
  {
    path: 'adjustNotice',
    name: 'adjustNotice',
    component: AdjustNotice
  },
  {
    path: 'creatSubstitute',
    name: 'creatSubstitute',
    component: CreatSubstitute
  },
  {
    path: 'continueCreat',
    name: 'continueCreat',
    component: ContinueCreat
  },
  // 课表变动-临时假期
  {
    path: 'holidayTable',
    name: 'holidayTable',
    component: HolidayTable,
    redirect: '/xyHome/holidayTable/temholiday',
    children: [
      {
        path: 'temholiday',
        name: 'temholiday',
        component: TemHoliday
      },
      {
        path: 'makeUpLessonTable',
        name: 'makeUpLessonTable',
        component: MakeUpLessonTable
      }
    ]
  },
  {
    path: 'lookHoliday',
    name: 'lookHoliday',
    component: LookHoliday
  },
  {
    path: 'lookMakeUpLesson',
    name: 'lookMakeUpLesson',
    component: LookMakeUpLesson
  },
  {
    path: 'creatHoliday',
    name: 'creatHoliday',
    component: CreatHoliday
  },
  {
    path: 'creatMakeUpLesson',
    name: 'creatMakeUpLesson',
    component: CreatMakeUpLesson
  },
  // 课表变动-提醒设置
  {
    path: 'schRemind',
    name: 'schRemind',
    component: SchRemind,
    redirect: '/xyHome/schRemind/remindSet',
    children: [
      {
        path: 'remindSet',
        name: 'remindSet',
        component: RemindSet
      },
      {
        path: 'approvalFlow',
        name: 'approvalFlow',
        component: ApprovalFlow
      }
    ]
  },
  // 课程变更
  {
    path: 'classChange',
    name: 'classChange',
    component: ClassChange,
    redirect: '/xyHome/classChange/list',
    children: [{
      path: 'list',
      name: 'List',
      component: List
    },
    {
      path: 'toGrade',
      name: 'toGrade',
      component: ToGrade
    },
    {
      path: 'applyAdjustDetail',
      name: 'applyAdjustDetail',
      component: ApplyAdjustDetail
    },
    {
      path: 'applySubstitutDetail',
      name: 'applySubstitutDetail',
      component: ApplySubstitutDetail
    },
    {
      path: 'approvalAdjust',
      name: 'approvalAdjust',
      component: ApprovalAdjust
    },
    {
      path: 'approvalSubstitutes',
      name: 'approvalSubstitutes',
      component: ApprovalSubstitutes
    },
    {
      path: 'approvedAdjustDetail',
      name: 'approvedAdjustDetail',
      component: ApprovedAdjustDetail
    },
    {
      path: 'approvedSubstitutesDetail',
      name: 'approvedSubstitutesDetail',
      component: ApprovedSubstitutesDetail
    }]
  },
  // 课表汇总
  /* 学期课表 */
  {
    path: 'semesterQueryConditions',
    name: 'semesterQueryConditions',
    component: SemesterQueryConditions
  },
  {
    path: 'semesterPrintAdministrative',
    name: 'semesterPrintAdministrative',
    component: SemesterPrintAdministrative
  },
  {
    path: 'semesterRoomPrint',
    name: 'semesterRoomPrint',
    component: SemesterRoomPrint
  },
  {
    path: 'semesterStudentPrint',
    name: 'semesterStudentPrint',
    component: SemesterStudentPrint
  },
  {
    path: 'semesterTeacherPrint',
    name: 'semesterTeacherPrint',
    component: SemesterTeacherPrint
  },

  // 每周课表
  {
    path: 'WeekScheduleConditions',
    name: 'WeekScheduleConditions',
    component: WeekScheduleConditions
  },
  {
    path: 'weekPrintAdministrative',
    name: 'weekPrintAdministrative',
    component: WeekPrintAdministrative
  },
  {
    path: 'weekRoomPrint',
    name: 'weekRoomPrint',
    component: WeekRoomPrint
  },
  {
    path: 'weekStudentPrint',
    name: 'weekStudentPrint',
    component: WeekStudentPrint
  },
  {
    path: 'weekTeacherPrint',
    name: 'weekTeacherPrint',
    component: WeekTeacherPrint
  },
  // 教学班学生
  {
    path: 'ShiftScheduleConditions',
    name: 'ShiftScheduleConditions',
    component: ShiftScheduleConditions
  },
  {
    path: 'SemesterScheduleHeader',
    name: 'SemesterScheduleHeader',
    component: SemesterScheduleHeader,
    children: [
      {
        // 总课表
        path: 'SemesterTotal',
        name: 'SemesterTotal',
        component: SemesterTotal
      },
      {
        path: 'SemesterAdministrative',
        name: 'SemesterAdministrative',
        component: SemesterAdministrative
      },
      {
        path: 'SemesterShiftClass',
        name: 'SemesterShiftClass',
        component: SemesterShiftClass
      },
      {
        path: 'SemesterTeacherTable',
        name: 'SemesterTeacherTable',
        component: SemesterTeacherTable
      },
      {
        path: 'SemesterStudentTable',
        name: 'SemesterStudentTable',
        component: SemesterStudentTable
      },
      {
        path: 'SemesterClassRoomSchedule',
        name: 'SemesterClassRoomSchedule',
        component: SemesterClassRoomSchedule
      }
    ]
  },
  {
    path: 'WeekScheduleHeader',
    name: 'WeekScheduleHeader',
    component: WeekScheduleHeader,
    children: [
      {
        // 总课表
        path: 'WeekTotal',
        name: 'WeekTotal',
        component: WeekTotal
      },
      {
        path: 'WeekAdministrative',
        name: 'WeekAdministrative',
        component: WeekAdministrative
      },
      {
        path: 'WeekShiftClass',
        name: 'WeekShiftClass',
        component: WeekShiftClass
      },
      {
        path: 'WeekTeacherTable',
        name: 'WeekTeacherTable',
        component: WeekTeacherTable
      },
      {
        path: 'WeekStudentTable',
        name: 'WeekStudentTable',
        component: WeekStudentTable
      },
      {
        path: 'WeekClassRoomSchedule',
        name: 'WeekClassRoomSchedule',
        component: WeekClassRoomSchedule
      }
    ]
  },
  {
    path: 'ShiftScheduleHeader',
    name: 'ShiftScheduleHeader',
    component: ShiftScheduleHeader,
    children: [
      {
        path: 'ShiftScheduleTotal',
        name: 'ShiftScheduleTotal',
        component: ShiftScheduleTotal
      },
      {
        path: 'ShiftScheduleAdministrative',
        name: 'ShiftScheduleAdministrative',
        component: ShiftScheduleAdministrative
      }
    ]
  },
  // 工作量统计
  {
    path: 'workloadSchedule',
    name: 'workloadSchedule',
    component: WorkloadSchedule
  },
  // 设置教室
  {
    path: 'setRoomTable',
    name: 'setRoomTable',
    component: SetRoomTable
  },
  // 自动排教室
  {
    path: 'roomAutoAdjust',
    name: 'roomAutoAdjust',
    component: RoomAutoAdjust
  },
  // 排教室
  {
    path: 'rowRoom',
    name: 'rowRoom',
    component: RowRoom
  }
]
export default csmstimetable
