
// 模式模板-模板管理
const TemplateManage = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardTemplate/TemplateManage/TemplateManage.vue')
//  模式模板-模板管理-创建横版
const CreateHorizontal = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardTemplate/TemplateManage/CreateHorizontal.vue')
//  模式模板-模板管理-创建竖版
const CreateVertical = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardTemplate/TemplateManage/CreateVertical.vue')
//  模式模板-模板管理-编辑（查看）横版
const EditHorizontal = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardTemplate/TemplateManage/EditHorizontal.vue')
//  模式模板-模板管理-编辑（查看）竖版
const EditVertical = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardTemplate/TemplateManage/EditVertical.vue')
// 模式模板-模式管理
const PatternManage = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardTemplate/patternManage/PatternManage.vue')

//  发布任务记录---列表
const PublishTake = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/publishTakeManage/PublishTake.vue')
//  通知管理---列表
const Notice = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipNotice/Notice.vue')
//  屏保管理---列表
const Welcome = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/welcomeManage/Welcome.vue')
//  屏保管理---创建横版
const CreateHorizontalWelcome = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/welcomeManage/CreateHorizontalWelcome.vue')
//  屏保管理---创建竖版
const CreateVerticalWelcome = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/welcomeManage/CreateVerticalWelcome.vue')
//  屏保管理---编辑横版
const EditHorizontalWelcome = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/welcomeManage/EditHorizontalWelcome.vue')
//  屏保管理---编辑竖版
const EditVerticalWelcome = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/welcomeManage/EditVerticalWelcome.vue')
//  视频管理
const Video = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/videoManage/Video.vue')
//  相册管理
const Photo = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/photoManage/Photo.vue')
const PhotoEdit = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/photoManage/PhotoEdit.vue')
//  新闻管理
const News = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/newsManage/News.vue')
const NewsCreate = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/newsManage/NewsCreate.vue')
const NewsEdit = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/newsManage/NewsEdit.vue')
//  班级百宝箱
const ClassBox = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/classBoxManage/ClassBox.vue')
const ClassBoxEdit = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipInfoManage/classBoxManage/ClassBoxEdit.vue')

// 审批管理
const ApprovalSet = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipApprovalManage/ApprovalSet.vue')
const IpApproval = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipApprovalManage/IpApproval.vue')
const ApprovalList = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipApprovalManage/ApprovalList.vue')
const ApprovalNews = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipApprovalManage/ApprovalNews.vue')
const ApprovalNotice = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipApprovalManage/ApprovalNotice.vue')
const ApprovalPhoto = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipApprovalManage/ApprovalPhoto.vue')
const ApprovalScreenSaver = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipApprovalManage/ApprovalScreenSaver.vue')
const ApprovalVideo = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipApprovalManage/ApprovalVideo.vue')
const ApprovalWelcome = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipApprovalManage/ApprovalWelcome.vue')

// 管理班牌 --班牌管理
const ClassCardManage = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardManage/manageClassCard/ClassCardManage.vue')
const ClassCardManageEdit = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardManage/manageClassCard/ClassCardManageEdit.vue')
const ClassCardManageRecord = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardManage/manageClassCard/ClassCardManageRecord.vue')
// 我的班牌
const MyClassCard = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardManage/myClassCard/MyClassCard.vue')

// 班牌更新管理
const UpdateManage = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardManage/updateRecords/UpdateManage.vue')
// 班牌更新管理---创建
const UpdateCreate = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardManage/updateRecords/UpdateCreate.vue')
// 班牌更新管理---更新记录
const UpdateRecords = () => import(/* webpackChunkName: "infoPublic" */ '@/pages/infoPublic/views/ipClassCardManage/updateRecords/UpdateRecords.vue')
const infoPublic = [
  {
    path: 'ClassCardManage',
    name: 'ClassCardManage',
    component: ClassCardManage
  },
  {
    path: 'ClassCardManageEdit',
    name: 'ClassCardManageEdit',
    component: ClassCardManageEdit
  },
  {
    path: 'ClassCardManageRecord',
    name: 'ClassCardManageRecord',
    component: ClassCardManageRecord
  },
  {
    path: 'TemplateManage',
    name: 'TemplateManage',
    component: TemplateManage
  },
  {
    path: 'CreateHorizontal',
    name: 'CreateHorizontal',
    component: CreateHorizontal
  },
  {
    path: 'CreateVertical',
    name: 'CreateVertical',
    component: CreateVertical
  },
  {
    path: 'EditHorizontal',
    name: 'EditHorizontal',
    component: EditHorizontal
  },
  {
    path: 'EditVertical',
    name: 'EditVertical',
    component: EditVertical
  },
  {
    path: 'PatternManage',
    name: 'PatternManage',
    component: PatternManage
  },
  {
    path: 'PublishTake',
    name: 'PublishTake',
    component: PublishTake
  },
  {
    path: 'Notice',
    name: 'Notice',
    component: Notice
  },
  {
    path: 'Welcome',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: 'CreateHorizontalWelcome',
    name: 'CreateHorizontalWelcome',
    component: CreateHorizontalWelcome
  },
  {
    path: 'CreateVerticalWelcome',
    name: 'CreateVerticalWelcome',
    component: CreateVerticalWelcome
  },
  {
    path: 'EditHorizontalWelcome',
    name: 'EditHorizontalWelcome',
    component: EditHorizontalWelcome
  },
  {
    path: 'EditVerticalWelcome',
    name: 'EditVerticalWelcome',
    component: EditVerticalWelcome
  },
  {
    path: 'Video',
    name: 'Video',
    component: Video
  },
  {
    path: 'Photo',
    name: 'Photo',
    component: Photo
  },
  {
    path: 'PhotoEdit',
    name: 'PhotoEdit',
    component: PhotoEdit
  },
  {
    path: 'News',
    name: 'News',
    component: News
  },
  {
    path: 'NewsCreate',
    name: 'NewsCreate',
    component: NewsCreate
  },
  {
    path: 'NewsEdit',
    name: 'NewsEdit',
    component: NewsEdit
  },
  {
    path: 'ClassBox',
    name: 'ClassBox',
    component: ClassBox
  },
  {
    path: 'ClassBoxEdit',
    name: 'ClassBoxEdit',
    component: ClassBoxEdit
  },
  {
    path: 'IpApproval',
    name: 'IpApproval',
    component: IpApproval,
    children: [
      {
        path: 'approvalSet',
        name: 'approvalSet',
        component: ApprovalSet
      },
      {
        path: 'approvalList',
        name: 'approvalList',
        component: ApprovalList
      },
      {
        path: 'ApprovalNews',
        name: 'ApprovalNews',
        component: ApprovalNews
      },
      {
        path: 'ApprovalNotice',
        name: 'ApprovalNotice',
        component: ApprovalNotice
      },
      {
        path: 'ApprovalPhoto',
        name: 'ApprovalPhoto',
        component: ApprovalPhoto
      },
      {
        path: 'ApprovalScreenSaver',
        name: 'ApprovalScreenSaver',
        component: ApprovalScreenSaver
      },
      {
        path: 'ApprovalVideo',
        name: 'ApprovalVideo',
        component: ApprovalVideo
      },
      {
        path: 'ApprovalWelcome',
        name: 'ApprovalWelcome',
        component: ApprovalWelcome
      }
    ]
  },

  {
    path: 'MyClassCard',
    name: 'MyClassCard',
    component: MyClassCard
  },
  {
    path: 'UpdateManage',
    name: 'UpdateManage',
    component: UpdateManage
  },
  {
    path: 'UpdateCreate',
    name: 'UpdateCreate',
    component: UpdateCreate
  },
  {
    path: 'UpdateRecords',
    name: 'UpdateRecords',
    component: UpdateRecords
  }
]

export default infoPublic
