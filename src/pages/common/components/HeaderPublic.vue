<template>
  <div>
    <div id="XyHeader" class="header">
      <div class="header-nav" id="HeaderNav">
        <div class="header-nav-title">
          <div class="header-nav-name">
            <span class="xy-logo cursor-p">
              <span class="school-name fl" @click="goIndex" v-cloak>{{accountName}}</span>
            </span>
          </div>
          <div class="header-bre" v-if="bre.applications.subMenu!==undefined">
            <template v-for="(item,index) in bre.applications.subMenu">
              <div
                class="header-bre-default"
                :class="bre.moduleID===item.ID?'active':''"
                :key="index"
                v-if="index<4"
                @click="loactionNav(item,index,'nomore')">
                {{item.Name}}
              </div>
            </template>
            <div class="header-bre-default pr" :class="isMore===1?'active':''" v-if="bre.applications.subMenu.length > 4"
              @mousemove="headerShowMore=true"
              @mouseleave="headerShowMore=false">
              <span class="more">
                <span>{{isMore===1?nowMenuName:'更多'}}</span>
                <i class="iconfont">&#xe6ef;</i>
              </span>
              <div class="more-box" v-show="headerShowMore">
                <template v-for="(item,index) in bre.applications.subMenu">
                  <div
                    class="header-bre-default-more"
                    :class="bre.moduleID===item.ID?'active-more':''"
                    :key="index"
                    v-if="index>3"
                    @click="loactionNav(item,index,'more')">
                    {{item.Name}}
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="header-info">
            <div class="pr">
              <!-- <Icon type="md-mail" size="22" color="#4196ff" class="cursor-p"/>
              <div class="private-tip" v-if="isChatMsg"></div> -->
            </div>
            <div class="pr cursor-p" @click="goMessage">
              <Icon type="md-notifications" size="24" color="#4196ff"/>
              <!-- {{bellNum>99?'99+':bellNum}} -->
              <div v-if="notReadMsgCount && bellNum>0" class="bell-num"></div>
            </div>
            <div v-if="isShowWechat" class="ivu-poptip">
              <div class="ivu-poptip-rel">
                <span id="QaCode" class="cursor-p" @click="showErCode">
                  <i id="MyCode" class="iconfont" style="font-size:18px; color:#4196ff;">&#xe6e4;</i>
                </span>
              </div>
              <div id="myQaCode" class="ivu-poptip-popper qacode" v-show="isCodeBox">
                <div class="ivu-poptip-content">
                  <div class="ivu-poptip-arrow"></div>
                  <div class="ivu-poptip-inner">
                    <div class="ivu-poptip-body">
                      <div class="ivu-poptip-body-content" style="overflow:hidden;">
                        <div class="ivu-poptip-body-content-inner" style="overflow:hidden;">
                          <div v-if="isWechatImg" style="color:#444;white-space: normal;text-align:left;" v-cloak>&nbsp;&nbsp;&nbsp;&nbsp; {{wechattit}}必须用自己帐号登录系统扫自己的二维码，切勿扫其他人的二维码。</div>
                          <span v-if="!isWechatImg" style="color:#444;white-space: normal;" v-cloak>&nbsp;&nbsp;&nbsp;&nbsp;本校暂未配置微信或微信配置异常</span>
                          <div v-if="isWechatImg" class="login-qrcode" v-cloak>
                            <spin v-if="isQaCode" style="display:block; margin-top:50px;">
                              <icon type="ios-loading" size=18 class="demo-spin-icon-load"></icon>
                              <div>Loading</div>
                            </spin>
                            <img v-else v-cloak :src="wechatCodeUrl" style="width:100%"/>
                          </div>
                          <div v-else class="login-qrcode" v-cloak>
                            <img :src="require('@/assets/common/weChatNoDate.jpg')" style="width:100%"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <img v-if="userBaseInfo.IconFull!==''" :src="userBaseInfo.IconFull+'?'+new Date()" class="fl user-img cursor-p" id="MyName" @click="myInfo"/>
            <div class="show-name cursor-p" v-else @click="myInfo">{{xy.showName(userBaseInfo.FullName)}}</div>
          </div>
        </div>
        <div v-cloak id="myData" class="myData" v-show="isDataShow" name="myData">
          <div class="my-data-top">
            <div class="my-data-top-img">
              <img v-if="userBaseInfo.IconFull!==''" :src="userBaseInfo.IconFull+'?'+new Date()" class="user-img"/>
              <div class="show-name-small" v-else>{{xy.showName(userBaseInfo.FullName)}}</div>
            </div>
            <div class="my-data-top-msg">
              <p v-cloak class="nowrap" :title="userBaseInfo.FullName">{{userBaseInfo.FullName}}</p>
              <p class="nowrap" :title="userBaseInfo.SchoolCardNumber" v-if="userBaseInfo.RoleType==3">
                <span>学籍号：</span><span>{{userBaseInfo.SchoolCardNumber}}</span>
              </p>
              <p class="nowrap" :title="userBaseInfo.SchoolCardNumber" v-if="userBaseInfo.RoleType==2">
                <span>工号：</span><span>{{userBaseInfo.SchoolCardNumber}}</span>
              </p>
            </div>
          </div>
          <div class="my-data-bottom">
            <ul class="clearfix">
              <li><a @click="getUserInfo" href="javascript:;">个人信息</a></li>
              <li><a @click="goUserLogin" href="javascript:;">登录日志</a></li>
              <li><a @click="changePwd" href="javascript:;">修改密码</a></li>
              <li><a @click="loginOut" href="javascript:;">退出登录</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="xy-mark" @click="markClose" v-if="xyMark"></div>
    <!--个人信息-->
    <Modal :styles="{top:'20px',width:'543px'}"
          v-model="modalUserInfo"
          :transfer="false"
          title="个人信息"
          v-cloak
          :loading="loading"
          :mask-closable="false"
          class="user-alert-bg">
      <div>
        <div id="UserInfoTop">
          <div class=""><span>姓名：</span><span>{{formValidateUserInfo.formFullName}}</span></div>
          <div class="" v-if="formValidateUserInfo.formUserRoleType==3">
            <span>学籍号：</span><span>{{formValidateUserInfo.formSchoolCardNumber}}</span>
          </div>
          <div class="" v-if="formValidateUserInfo.formUserRoleType==2">
            <span>工号：</span><span>{{formValidateUserInfo.formSchoolCardNumber}}</span>
          </div>
          <div class=""><span>用户名：</span><span>{{formValidateUserInfo.formUserName}}</span></div>
          <div class=""><span>性别：</span><span>{{formValidateUserInfo.formSex===0?'女':'男'}}</span></div>
        </div>
        <div id="UserInfoBottom">
          <Form ref="formValidateUserInfo" :model="formValidateUserInfo" :rules="ruleValidateUserInfo"
                :label-width="80">
            <FormItem label="出生日期" prop="formBirthDate" label-for="formBirthDate">
              <date-picker element-id="formBirthDate" format="yyyy-MM-dd" :options="optionsBirthDate" v-model="formValidateUserInfo.formBirthDate"
                type="date" placeholder="" style="width: 348px" :editable="false"></date-picker>
            </FormItem>
            <FormItem label="手机号码" prop="formPhoneNumber" label-for="phoneNumber">
              <Input v-model="formValidateUserInfo.formPhoneNumber" element-id="phoneNumber" clearable style="width: 348px"/>
            </FormItem>
            <FormItem label="邮箱地址" prop="formEmailAddress" label-for="emailAddress">
              <Input v-model="formValidateUserInfo.formEmailAddress" element-id="emailAddress" clearable style="width: 348px"/>
            </FormItem>
            <FormItem label="籍贯" prop="formNativePlace" label-for="nativePlace">
              <!-- <Input v-model="formValidateUserInfo.formNativePlace" clearable style="width: 348px"/> -->
              <cascader
                element-id="nativePlace"
                :data="nativePlaceData"
                v-model="formValidateUserInfo.formNativePlace"
                :clearable="false"
                style="width: 348px"
                placeholder="请选择籍贯">
              </cascader>
            </FormItem>
            <FormItem label="地址" prop="formAddress" label-for="formAddress">
              <Input v-model="formValidateUserInfo.formAddress" element-id="formAddress" clearable style="width: 348px"/>
            </FormItem>
            <Input v-model="formValidateUserInfo.formUserRoleType" style="width:348px;display:none;"/>
            <Input v-model="formValidateUserInfo.formUserNumberType" style="width:348px;display:none;"/>
            <Input v-model="formValidateUserInfo.formUserNumber" style="width:348px;display:none;"/>
            <Input v-model="formValidateUserInfo.formCardNumber" style="width:348px;display:none;"/>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="UserInfoCancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="UserInfoOk">确定</Button>
      </div>
    </Modal>
    <!-- 修改密码 -->
    <Modal width="543"
      title="修改密码"
      class="user-alert-bg"
      v-model="modalChangePassword"
      :transfer="false"
      v-cloak
      :mask-closable="false"
      :closable="false">
      <div class="mt-20">
        <Form ref="formValidateChangePassword" :model="formValidateChangePassword" :rules="ruleValidateChangePassword"
              :label-width="120">
          <FormItem label="原密码" prop="formOldPassword" label-for="formOldPassword">
            <Input type="password" element-id="formOldPassword" v-model="formValidateChangePassword.formOldPassword" style="width: 300px"/>
          </FormItem>
          <FormItem label="新密码" prop="formNewPassword" label-for="formNewPassword">
            <Input type="password" element-id="formNewPassword" v-model="formValidateChangePassword.formNewPassword" style="width: 300px"/>
          </FormItem>
          <FormItem label="确认密码" prop="formNewPasswordConfirm" label-for="formNewPasswordConfirm">
            <Input type="password" element-id="formNewPasswordConfirm" v-model="formValidateChangePassword.formNewPasswordConfirm" style="width: 300px"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="changePasswordCancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="changePasswordOk">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import $ from 'jquery'
  export default {
    name: 'HeaderPublic',
    data () {
      return {
        baseApi: this.xyApi + '/base',
        bellNum: 0,
        notReadMsgCount: false,
        headerShowMore: false,
        modalUserInfo: false,
        loading: true,
        moduleList: [],
        isChatMsg: false,
        // 微信关注
        modalWechat: false,
        wechatCodeUrl: '',
        isShowWechat: false,
        isWechatImg: false,
        wechattit: '请在5分钟内用微信扫下方二维码关注公众号， 进行微信与系统帐号的绑定。',
        isQaCode: true,
        isCodeBox: false,
        isDataShow: false,
        xyMark: false,
        // 个人信息
        userID: '',
        optionsBirthDate: {
          disabledDate: date => {
            let disabledDay = date.getFullYear()
            return disabledDay <= 1949 || date.valueOf() > Date.now()
          }
        },
        sexArr: [
          { ID: 1, Name: '男' },
          { ID: 0, Name: '女' }
        ],
        formValidateUserInfo: {
          formSchoolCardNumber: '',
          formUserName: '',
          formRoleType: '',
          formSex: '',
          formPhoneNumber: '',
          formEmailAddress: '',
          formNativePlace: [],
          formAddress: ''
        },
        ruleValidateUserInfo: {
          formSchoolCardNumber: [
            { required: true, message: '校内号不能为空。', trigger: 'blur' },
            { type: 'string', max: 30, message: '校内号不能超过30字符。', trigger: 'blur' }
          ],
          formUserName: [
            { required: true, message: '用户名不能为空。', trigger: 'blur' },
            { type: 'string', max: 30, message: '用户名不能超过30字符。', trigger: 'blur' }
          ],
          formFullName: [
            { required: true, message: '姓名不能为空。', trigger: 'blur' },
            { type: 'string', max: 30, message: '姓名不能超过30字符。', trigger: 'blur' }
          ],
          formSex: [
            { type: 'number', required: true, message: '性别不能为空。', trigger: 'blur' }
          ],
          formPhoneNumber: [
            {
              pattern: /^1(3[0-9]|4[57]|5[0-35-9]|66|7[0135678]|8[0-9]|9[8-9])\d{8}$/,
              message: '您输入的手机号格式错误。',
              trigger: 'blur'
            }
          ],
          formEmailAddress: [
            {
              pattern: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/,
              message: '您输入的邮箱格式错误。',
              trigger: 'blur'
            },
            { type: 'string', max: 100, message: '邮箱地址不能超过100字符。', trigger: 'blur' }
          ],
          formAddress: [
            { type: 'string', max: 100, message: '地址不能超过100字符。', trigger: 'blur' }
          ]
        },
        // 修改密码
        modalChangePassword: false,
        formValidateChangePassword: {
          formOldPassword: '',
          formNewPassword: '',
          formNewPasswordConfirm: ''
        },
        ruleValidateChangePassword: {
          formOldPassword: [
            { required: true, message: '原密码不能为空。', trigger: 'blur' },
            { type: 'string', max: 20, min: 6, message: '密码长度限6~20位。', trigger: 'blur' },
            { pattern: /^[\x21-\x7e]{6,20}$/, message: '您输入的密码格式错误。', trigger: 'blur' }
          ],
          formNewPassword: [
            { required: true, message: '新密码不能为空。', trigger: 'blur' },
            { type: 'string', max: 20, min: 6, message: '密码长度限6~20位。', trigger: 'blur' },
            { pattern: /^[\x21-\x7e]{6,20}$/, message: '您输入的密码格式错误。', trigger: 'blur' }
          ],
          formNewPasswordConfirm: [
            { required: true, message: '确认密码不能为空。', trigger: 'blur' },
            { type: 'string', max: 20, min: 6, message: '密码长度限6~20位。', trigger: 'blur' },
            { pattern: /^[\x21-\x7e]{6,20}$/, message: '您输入的密码格式错误。', trigger: 'blur' }
          ]
        },
        bre: {
          rigthModels: {},
          applications: {},
          menus: {},
          moduleID: -1
        },
        menuId: '',
        apiPath: this.xyApi + '/base',
        imgPath: this.xyViewUrl,
        nativePlaceData: [],
        isMore: 0,
        nowMenuName: ''
      }
    },
    computed: {
      modules () {
        return this.$store.state.common.moduleList
      },
      accountName () {
        return this.$store.state.common.accountName
      },
      userBaseInfo () {
        return this.$store.state.common.userBaseInfo
      },
      domainData () {
        return this.$store.state.common.serviceDomainList
      }
    },
    watch: {
      modules: {
        handler (vals) {
          this.moduleList = vals
        },
        deep: true,
        immediate: true
      },
      '$route': {
        handler (routers) {
          // this.getNoReadCountByUser()
          if (routers.name === 'module' ||
            routers.name === 'SelectTeacherOrgDemo' ||
            routers.name === 'SelectStudentDemo' ||
            routers.name === 'SelectDutyAndRoleDemo' ||
            routers.name === 'SelectClassRoomDemo' ||
            routers.name === 'SelectClassRadioDemo' ||
            routers.name === 'CropperDemo' ||
            routers.name === 'workflowDemo' ||
            routers.name === 'workflowApplyDemo' ||
            routers.name === 'workflowApprovalDemo' ||
            routers.name === 'Message' ||
            routers.name === 'MessageDetail' ||
            routers.name === 'userLoginIndex' ||
            routers.path.indexOf('MsgInfo') > -1) {
            this.getNoReadCountByUser()
            this.bre = {
              rigthModels: {},
              applications: {},
              menus: {},
              moduleID: -1
            }
            this.$store.commit('common/getMenuInfo', {})
            this.$store.commit('common/getMenuId', '')
          } else {
            this.$store.commit('common/getMenuInfo', routers.query)
            let mIds = routers.query.xy.split(',')
            this.menuId = mIds[0] - 0
            this.$store.commit('changeApiPath', `${this.xyApi}/${routers.query.cd}`)
            this.$store.commit('common/getMenuId', mIds.join(','))
            this.isMore = Number(routers.query.m)
            if (mIds.length > 2) {
              this.bre.moduleID = mIds[2] - 0
              for (let i = 0, len = this.moduleList.length; i < len; i++) {
                if (mIds[0] - 0 === this.moduleList[i].ID) {
                  this.bre.rigthModels = this.moduleList[i]
                  for (let j = 0, jlen = this.moduleList[i].applications.length; j < jlen; j++) {
                    if (mIds[1] - 0 === this.moduleList[i].applications[j].ID) {
                      this.bre.applications = this.moduleList[i].applications[j]
                      if (this.moduleList[i].applications[j].subMenu.length > 0) {
                        for (let k = 0, klen = this.moduleList[i].applications[j].subMenu.length; k < klen; k++) {
                          if (this.bre.moduleID === this.moduleList[i].applications[j].subMenu[k].ID) {
                            this.bre.menus = this.moduleList[i].applications[j].subMenu[k]
                            this.nowMenuName = Number(routers.query.m) === 1 ? this.moduleList[i].applications[j].subMenu[k].Name : ''
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              this.bre = {
                rigthModels: {},
                applications: {},
                menus: {},
                moduleID: -1
              }
            }
          }
        },
        immediate: true
      }
    },
    created () {
      console.log(this.xyViewUrl)
      this.getNativePlaceData()
      this.getWechatUrl()
      let body = document.querySelector('body')
      body.addEventListener('click', (e) => {
        // 监听二维码
        if (e.target.id === 'QaCode' || e.target.id === 'MyCode') {
          this.isCodeBox = !this.isCodeBox
        } else {
          this.isCodeBox = false
        }
      })
    },
    mounted () {
    },
    methods: {
      async getNativePlaceData () {
        this.xy.loading()
        let res = await this.xy.post(`${this.xyApi}/ams/api/AMS/GetAdminiStrativeRegion?level=1`, null, true)
        this.xy.unloading()
        if (res.success) {
          res.data.map((t) => {
            this.nativePlaceData.push({
              value: t.RegionID,
              label: t.RegionName,
              levelType: t.LevelType,
              children: t.Childrens,
              MergerName: t.MergerName
            })
          })
        } else {
          this.xy.msgError('获取籍贯失败！')
        }
      },
      async getNoReadCountByUser () {
        let res = await this.xy.get(`${this.xyApi}/msg/api/Message/GetNoReadCountByUser`, null, true)
        if (res.success) {
          this.notReadMsgCount = res.data.success
          if (this.notReadMsgCount) {
            this.bellNum = res.data.result
          } else {
            this.bellNum = 0
          }
        } else {}
      },
      goMessage () {
        this.$router.push('/xyHome/message')
      },
      loactionNav (val, i, isMore) {
        this.loadHtml(val, isMore)
      },
      headerShowMoremove () {
        this.headerShowMore = true
      },
      loadHtml (val, isMore) {
        this.bre.moduleID = val.ID
        let mIds = [this.bre.rigthModels.ID, this.bre.applications.ID, val.ID]
        this.$store.commit('common/getMenuId', mIds.join(','))
        this.$router.push({
          path: val.ApplicationSubMenuPCUrl,
          query: {
            xy: mIds.join(','),
            cd: this.bre.applications.GatewayCode,
            m: (isMore !== 'more' || isMore === undefined) ? 0 : 1
          }
        })
      },
      goIndex () {
        this.$router.replace('/xyHome/module')
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      UserInfoCancel () {
        this.modalUserInfo = false
        this.$refs.formValidateUserInfo.resetFields()
      },
      UserInfoOk () {
        this.loading = true
        this.$refs.formValidateUserInfo.validate(valid => {
          if (valid) {
            this.validUserInfo()
          } else {
            this.changeLoading()
          }
        })
      },
      async validUserInfo () {
        let nativePlaceName = ''
        this.nativePlaceData.map((item) => {
          if (item.value === this.formValidateUserInfo.formNativePlace[0]) {
            nativePlaceName = item.MergerName
          }
        })
        let res = await this.xy.post(`${this.xyApi}/base/api/Users/Edit`, {
          UserID: this.userID,
          SchoolCardNumber: this.formValidateUserInfo.formSchoolCardNumber,
          UserName: this.formValidateUserInfo.formUserName,
          FullName: this.formValidateUserInfo.formFullName,
          Sex: this.formValidateUserInfo.formSex,
          PhoneNumber: this.formValidateUserInfo.formPhoneNumber,
          EmailAddress: this.formValidateUserInfo.formEmailAddress,
          BirthDate: (this.formValidateUserInfo.formBirthDate === '') || (this.formValidateUserInfo.formBirthDate === null) ? '' : this.xy.moment(this.formValidateUserInfo.formBirthDate).format('yyyy-MM-DD'),
          RegionID: this.formValidateUserInfo.formNativePlace.join(','),
          NativePlace: nativePlaceName,
          Address: this.formValidateUserInfo.formAddress,
          UserNumberTypeID: this.formValidateUserInfo.formUserNumberType,
          UserNumber: this.formValidateUserInfo.formUserNumber,
          CardNumber: this.formValidateUserInfo.formCardNumber,
          RoleType: this.formValidateUserInfo.formUserRoleType
        })
        if (res.success) {
          this.modalUserInfo = false
          this.$refs.formValidateUserInfo.resetFields()
          this.xy.msgSuc('您的个人信息修改成功。')
        } else {
          this.xy.msgError(res.data.msg)
          return this.changeLoading()
        }
      },
      // 修改密码
      changePwd () {
        this.xyMark = false
        this.isDataShow = false
        this.modalChangePassword = true
      },
      changePasswordCancel () {
        this.modalChangePassword = false
        this.$refs.formValidateChangePassword.resetFields()
      },
      changePasswordOk () {
        this.loading = true
        this.$refs.formValidateChangePassword.validate(valid => {
          if (valid) {
            this.validPwd()
          } else {
            this.changeLoading()
          }
        })
      },
      async validPwd () {
        this.xy.loading()
        let res = await this.xy.post(`${this.xyApi}/base/api/Users/ChangeUsersPassword`, {
          oldPassword: this.formValidateChangePassword.formOldPassword,
          newPassword: this.formValidateChangePassword.formNewPassword,
          newConfirmPassword: this.formValidateChangePassword.formNewPasswordConfirm
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('密码修改成功')
          this.modalChangePassword = false
          this.$refs.formValidateChangePassword.resetFields()
        }
        this.changeLoading()
      },
      // 退出登录
      loginOut () {
        this.xyMark = false
        this.isDataShow = false
        this.$Modal.confirm({
          title: '退出',
          content: '<p>您确认要退出吗？</p>',
          onOk: () => {
            this.xy.removeCookie('.XYTOKEN')
            localStorage.clear()
            this.$router.push('/')
          },
          onCancel: function () {
          }
        })
      },
      // 登录日志
      async goUserLogin () {
        this.xyMark = false
        this.isDataShow = false
        this.$router.push('/xyHome/userLoginIndex')
      },
      async getUserInfo () {
        this.xyMark = false
        this.isDataShow = false
        let res = await this.xy.get(`${this.xyApi}/base/api/Users/GetUserInfo`)
        if (res.success) {
          this.modalUserInfo = true
          let row = res.data
          this.userID = row.UserID
          this.formValidateUserInfo.formFullName = row.FullName
          this.formValidateUserInfo.formSchoolCardNumber = row.SchoolCardNumber
          this.formValidateUserInfo.formUserName = row.UserName
          this.formValidateUserInfo.formSex = row.Sex
          this.formValidateUserInfo.formBirthDate = row.BirthDate
          this.formValidateUserInfo.formPhoneNumber = row.PhoneNumber
          this.formValidateUserInfo.formEmailAddress = row.EmailAddress
          this.formValidateUserInfo.formNativePlace = row.RegionID !== undefined ? [row.RegionID] : []
          this.formValidateUserInfo.formAddress = row.Address
          this.formValidateUserInfo.formUserNumberType = row.UserNumberTypeID
          this.formValidateUserInfo.formUserNumber = row.UserNumber
          this.formValidateUserInfo.formCardNumber = row.CardNumber
          this.formValidateUserInfo.formUserRoleType = row.RoleType
        }
      },
      markClose () {
        this.isDataShow = false
        this.xyMark = false
      },
      myInfo () {
        this.isDataShow = true
        this.xyMark = true
      },
      // 获取微信二维码
      async getWechatUrl () {
        this.wechatCodeUrl = ''
        let res = await this.xy.post(`${this.xyApi}/msg/api/wechat/ScanFollow`, null, true)
        if (res.success) {
          // 成功,表示已经设置了微信公众号数据,微信设置按钮就会出来,具体出来图片还是报错"",看返回的qrCodeUrl是否为空,空的话,显示报错信息,不为空的话,显示图片
          this.isShowWechat = res.data.IsShowWechat
          if (!res.data.qrCodeUrl) {
            // 提示错误信息
            this.isWechatImg = false
            // self.wechatMsg = "学校微信设置存在问题，请联系学校老师。";
          } else {
            this.isWechatImg = true
            // 显示微信图片
            this.wechatCodeUrl = res.data.qrCodeUrl
          }
        } else { // 失败,表示没有设置微信公众号数据,微信设置按钮不会出来;
          this.isShowWechat = false
        }
        this.isQaCode = false
      },
      // 点击显示二维码
      showErCode () {
        var that = this
        that.isQaCode = true
        $('#myQaCode').addClass('show-code fade-enter-active')
        that.getWechatUrl()
      }
    }
  }
</script>
<style lang="less" scoped>
  .myData {
    position: fixed;
    top: 55px;
    right: 18px;
    width: 260px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.15);
  }

  .xy-mark {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background: rgba(255, 255, 255, 0);
  }

  .header-bre {
    display: flex;

    .header-bre-default {
      height: 50px;
      line-height: 50px;
      margin: 0 28px;
      cursor: pointer;

      .more {
        span {
          margin-right: 5px
        }
      }

      .more-box {
        position: absolute;
        top: 44px;
        left: 0;
        width: 156px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.1);
        border-radius: 0px 0px 4px 4px;

        .header-bre-default-more {
          height: 40px;
          line-height: 40px;
          color: #6B6B6B;
          padding-left: 20px;
          cursor: pointer;
        }

        .header-bre-default-more:hover {
          background: #F2F2F2;
          color: #333;
        }

        .header-bre-default-more.active-more {
          background: #F2F2F2;
          color: #333;
        }
      }

    }

    .active {
      color: #4196ff;
      border-bottom: 3px solid;
    }
  }
  .header-info{
    .bell-num{
      position:absolute;
      width:8px;
      height: 8px;
      top: 0;
      right: 14px;
      background: #ff7500;
      border-radius: 50%;
      text-align: center;
    }
  }
#XyHeader {
  position: fixed;
  top: 0px;
  left: 60px;
  right:0px;
  height: 50px;
  background-color: #fff;
  z-index: 999;
  box-shadow: 0px 2px 15px 0px rgba(107,107,107,0.09);
}

#XyHeader .header-nav .header-nav-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#XyHeader .header-nav .header-nav-title > .header-nav-name {
  display: flex;
  align-items: center;
}
#XyHeader .header-nav .header-info .fa-calendar,
#XyHeader .header-nav .header-info .fa-bell {
  color: #4196FF;
  font-size: 20px;
}

#XyHeader .private-mail {
  font-size: 26px;
  color: #4196FF;
  cursor: pointer;
}

#XyHeader .private-tip {
  display: inline-block;
  position: absolute;
  top: 2px;
  font-size: 12px;
  left: 28px;
  width: 8px;
  height: 8px;
  background: #ff7500;
  border-radius: 50%;
}
#XyHeader .header-nav .header-info {
  display: flex;
  align-items: center;
}
#XyHeader .header-nav .header-info > div {
  width: 50px;
  text-align: center;
}

#XyHeader .header-nav .header-info .fa-chevron-down {
  margin-right: 15px;
  margin-left: 6px;
}

#XyHeader .header-nav .header-info .user-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin: 0 20px 0 9px;
  outline: none;
  border: 1px solid #fff;
  box-shadow: 0 2px 15px 0 rgba(107,107,107,0.09);
  transition: all 0.3s;
}

#XyHeader .header-nav .header-info .user-img:hover {
  transition: all 0.3s;
  border: 1px solid #ccc;
  box-shadow: 0 2px 15px 0 rgba(107,107,107,0.2);
}
#XyHeader .show-name{
  width: 32px !important;
  text-align: center;
  height: 32px;
  line-height: 32px;
  border-radius: 50%;
  margin: 0 20px 0 9px;
  background: #4196ff;
  color:#fff;
}
#XyHeader .show-name-small{
  width: 40px !important;
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  margin: 0 10px 0 9px;
  background: #4196ff;
  color:#fff;
}
#XyHeader .header-nav .header-info .user-name {
  font-size: 18px;
}
#myData {
  top: 55px;
  right: 18px;
  width: 260px;
  border-radius: 8px;
  overflow: hidden;
  /*box-shadow: 13px 13px 18px -5px rgba(0,0,0,0.1);*/
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.15);
}

#myData .my-data-top {
  padding: 10px;
  background: #eee;
  white-space: nowrap
}

#myData .my-data-top .my-data-top-img {
  line-height: 40px;
  vertical-align: top;
  display: inline-block;
  margin-right: 10px;
}

#myData .my-data-top .my-data-top-img img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

#myData .my-data-top .my-data-top-msg {
  margin-left: 0;
  vertical-align: top;
  display: inline-block;
}

#myData .my-data-top .my-data-top-msg p:nth-child(1) {
  font-size: 16px;
  width: 186px;
}

#myData .my-data-top .my-data-top-msg p:nth-child(2) {
  font-size: 12px;
  color: #9f9f9f;
  width: 186px;
}

#myData .my-data-bottom {
  background-color: #fff;
}

#myData .my-data-bottom ul li {
  text-align: center;
  height: 46px;
  width: 50%;
  float: left;
  line-height: 46px;
  /*border-top:2px solid #eee;*/
}

#myData .my-data-bottom ul li > a {
  display: block;
  background: #fff;
  color: #333;
  transition: all 0.3s;
}

#myData .my-data-bottom ul li > a:hover {
  transition: all 0.3s;
  background: #f5f5f5;
}

#myData .my-data-bottom ul li:nth-child(4) > a:hover {
  transition: all 0.3s;
  background: #FF8C8C;
  color: #fff;
}
</style>
