
const urlSetsAll = {
  login: {
    type: 'POST',
    v3: '/api/AMS/Login',
    description: 'AMS 登录'
  },
  CreateModuleForAccount: {
    type: 'POST',
    v3: '/api/AMS/CreateModuleForAccount',
    description: '添加模块信息'
  },
  DeleteModuleForAccount: {
    type: 'POST',
    v3: '/api/AMS/DeleteModuleForAccount',
    description: '删除模块'
  },
  EditModuleName: {
    type: 'POST',
    v3: '/api/AMS/EditModuleName',
    description: '修改模块信息'
  },
  getAllNotAddList: {
    type: 'GET',
    v3: '/api/AMS/GetAllNotAddList',
    description: '获取要添加的模块'
  },
  getModule: {
    type: 'GET',
    v3: '/api/AMS/Module',
    description: '获取模块信息'
  },
  CreateModuleForApplication: {
    type: 'POST',
    v3: '/api/AMS/CreateModuleForApplication',
    description: '模块添加二级菜单'
  },
  DeleteModuleForApplication: {
    type: 'POST',
    v3: '/api/AMS/DeleteModuleForApplication',
    description: '模块删除二级菜单'
  },
  ModuleStatus: {
    type: 'POST',
    v3: '/api/AMS/ModuleStatus',
    description: '更新菜单状态'
  },
  EditApplicationForModule: {
    type: 'POST',
    v3: '/api/AMS/EditApplicationForModule',
    description: '修改模块信息'
  },
  GetAddApplications: {
    type: 'GET',
    v3: '/api/AMS/GetAddApplications',
    description: '获取要添加二级菜单信息'
  },
  getAccount: {
    type: 'GET',
    v3: '/api/AMS/Account',
    description: '获取站点列表'
  },
  AccountFooter: {
    type: 'GET',
    v3: '/api/AMS/AccountFooter',
    description: '获取底部设置'
  },
  EditFooter: {
    type: 'POST',
    v3: '/api/AMS/EditFooter',
    description: '更新站点底部信息'
  },
  getTimeTableWeekDisplayMethod: {
    type: 'GET',
    v3: '/api/AMS/TimeTableWeekDisplayMethod',
    description: '获取周次设置'
  },
  changeTimeTableWeekDisplayMethod: {
    type: 'POST',
    v3: '/api/AMS/EditTimeTableWeekDisplayMethod',
    description: '更改周次信息'
  },
  getStudentGradeStatus: {
    type: 'GET',
    v3: '/api/AMS/StudentGradeStatus',
    description: '获取学习阶段状态'
  },
  changeStudentGradeStatus: {
    type: 'POST',
    v3: '/api/AMS/EditStudentGradeStatus',
    description: '更改学习阶段状态'
  },
  GetLDAPSetting: {
    type: 'GET',
    v3: '/api/AMS/GetLDAPSetting',
    description: '获取LDAP列表'
  },
  CreateLDAPSetting: {
    type: 'POST',
    v3: '/api/AMS/CreateLDAPSetting',
    description: '创建LDAP'
  },
  EditLDAPSetting: {
    type: 'POST',
    v3: '/api/AMS/EditLDAPSetting',
    description: '编辑LDAP'
  },
  DeleteLDAPSetting: {
    type: 'POST',
    v3: '/api/AMS/DeleteLDAPSetting',
    description: '删除LDAP'
  },
  UpdateSysLDAPSetting: {
    type: 'POST',
    v3: '/api/AMS/UpdateSysLDAPSetting',
    description: '开启/取消 LDAP登录设置'
  },
  GetLDAPGroupCross: {
    type: 'GET',
    v3: '/api/AMS/GetLDAPGroupCross',
    description: '获取指定LDAP 的 groupcrossref'
  },
  CreateLDAPGroupCross: {
    type: 'POST',
    v3: '/api/AMS/CreateLDAPGroupCross',
    description: '创建LDAP GROUP'
  },
  EditLDAPGroupCross: {
    type: 'POST',
    v3: '/api/AMS/EditLDAPGroupCross',
    description: '编辑LDAP GROUP'
  },
  DeleteLDAPGroupCross: {
    type: 'POST',
    v3: '/api/AMS/DeleteLDAPGroupCross',
    description: '删除LDAP GROUP'
  },
  GetLDAPDNS: {
    type: 'GET',
    v3: '/api/AMS/GetLDAPDNS',
    description: '获取LDAP组名'
  },
  TestSignIn: {
    type: 'POST',
    v3: '/api/AMS/TestSignIn',
    description: '登录测试'
  },
  GetAdminiStrativeRegion: {
    type: 'POST',
    v3: '/api/AMS/GetAdminiStrativeRegion',
    description: '获取县区信息'
  }
}

let urlSets = {}
for (let x in urlSetsAll) {
  urlSets[x] = urlSetsAll[x]['v3']
}

export { urlSets }
