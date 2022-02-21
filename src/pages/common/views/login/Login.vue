<template>
  <div class="bg-main login-wrap" v-show="isFS&&isShowLogin">
    <div class="bg-cont-blur"></div>
    <div
      class="login-wrapper-custom"
      v-if="accountModel.BackgroundImage && accountModel.BackgroundImage.length > 0"
      >
      <div class="login-box-custom">
        <a
          class="login-qrcode-entry"
          v-if="!isqrcode && scanModel.isShowWechat"
          @click="ercodeLogin"
        >
          <img src="./img/qrcode-entry.png" alt="扫码登录" />
        </a>
        <a
          class="login-qrcode-entry"
          v-if="isqrcode && scanModel.isShowWechat"
          @click="textLogin"
        >
          <img src="./img/PC-entry.png" alt="账号登录" />
        </a>
        <div
          class="login-box-logo"
          :style="{ height: !accountModel.IsShowIcon ? '30px' : '60px' }"
        >
          <img
            v-if="accountModel.IconNull && accountModel.IsShowIcon"
            src="./img/Login-logo.png"
          />
          <img
            v-else-if="accountModel.IsShowIcon"
            :src="accountModel.Icon"
            class="school-logo"
          />
        </div>
        <div
          class="login-box-content"
          :style="{ marginTop: accountModel.IsShowIcon ? '' : '20px' }"
        >
          <div class="login-box-top pr" v-show="!isqrcode">
            <!--只有在多个学校且账号登录界面才显示更多按钮，在扫一扫登录界面切换学校可能会造成二维码是切换前学校的信息-->
            <div
              v-if="accountModels.length && islogin"
              class="school-tit"
              v-cloak
              :class="!accountModel.IconNull ? 'icon-null-school-name' : ''"
            >
              <span>{{ accountModel.AccountName }}</span>
            </div>
            <div
              v-else
              class="school-tit"
              v-cloak
              :class="!accountModel.IconNull ? 'icon-null-school-name' : ''"
            >
              {{ accountModel.AccountName }}
            </div>
            <a
              v-cloak
              href="javascript:;"
              v-if="accountNumber && islogin"
              class="btn-switch"
              @click="moreSchool"
              >切换学校</a
            >
            <div
              v-cloak
              v-if="schoolBox"
              class="change-school-mark"
              @click="markBtn"
            ></div>
            <div v-cloak v-if="schoolBox" class="change-school-mark-confirm">
              <div class="school-list-search">
                <input
                  type="text"
                  v-model="searchText"
                  placeholder="请输入学校名称"
                />
                <Icon type="ios-search-outline" />
              </div>
              <div class="school-list">
                <template v-for="aModel in accountModels">
                  <div
                    class="school-list-box"
                    v-if="
                      aModel.AccountName.indexOf(searchText) >= 0 ||
                        searchText == ''
                    "
                    :key="aModel.SYSAccountID"
                    :class="{
                      'school-list-active':
                        accountModel.SYSAccountID === aModel.SYSAccountID
                    }"
                    @click="changeAccount(aModel)"
                  >
                    <div
                      class="school-list-box-tit"
                      v-cloak
                      :class="IconNull ? 'icon-null-school-name' : ''"
                    >
                      <span>{{ aModel.AccountName }}</span>
                      <Icon
                        v-if="accountModel.SYSAccountID === aModel.SYSAccountID"
                        type="md-checkmark"
                      />
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="login-ibox">
            <div
              id="loginBoxMain"
              class="login-box-main"
              v-if="islogin"
              style="margin-top:20px;"
            >
              <Form ref="formInline" :model="formInline" :rules="ruleInline">
                <!-- <div class="username input-name"
                  :class="{'input-show': isInputNameShow }">用户名</div> -->
                <FormItem prop="user" class="input-list">
                  <div
                    class="input-wrapper"
                    :class="{ focused: inputFocusStatus[0] }"
                  >
                    <Input
                      id="UserName"
                      @on-focus="inputFocus('user')"
                      @on-blur="inputBlur('user')"
                      type="text"
                      v-model="formInline.user"
                      @keyup.enter.native="handleSubmit"
                      placeholder="用户名"
                    />
                    <div class="input-line"></div>
                  </div>
                </FormItem>
                <!-- <div class="password input-name"
                  :class="{'input-show': isInputPasswordShow }">密码</div> -->
                <FormItem prop="password" class="input-list pass">
                  <div
                    class="input-wrapper"
                    :class="{ focused: inputFocusStatus[1] }"
                  >
                    <Input
                      type="password"
                      @on-focus="inputFocus('pw')"
                      @on-blur="inputBlur('pw')"
                      v-model="formInline.password"
                      maxLength="20"
                      @keyup.enter.native="handleSubmit"
                      placeholder="密码"
                    />
                    <div class="input-line"></div>
                  </div>
                </FormItem>
                <!-- <div class="login-text">
                    <a href="javascript:;" @click="goForgetPassword">忘记密码？</a>
                  </div> -->
                <div style="width:100%; margin-top:40px;" v-cloak>
                  <Button
                    type="primary"
                    class="login-btn xy-primary"
                    :loading="loading"
                    @click="handleSubmit"
                  >
                    <span v-show="initializing">{{ initializingText }}</span>
                    <span v-show="!initializing && !loading">登录</span>
                    <span v-show="!initializing && loading">登录中...</span>
                  </Button>
                </div>
              </Form>
              <div class="verify-wrap" v-show="vError">
                <slide-verify
                  :l="42"
                  :r="10"
                  :w="310"
                  :h="145"
                  ref="slideV"
                  :imgs="[]"
                  slider-text="向右滑动"
                  @success="onSuccess"
                  @fail="onFail"
                  @refresh="onRefresh"
                ></slide-verify>
              </div>
            </div>
            <div
              class="login-qrcode"
              v-cloak
              v-if="isqrcode"
              style="padding-bottom:20px;"
            >
              <img :src="scanModel.codeUrl" />
              <span id="scanDesc">{{ scanModel.wechatLoginDesc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="login-wrapper" v-else v-cloak>
      <img v-cloak src="./img/sheep-paw.png" class="sheep-paw" alt="paw" />
      <div v-cloak class="login-animation-wrapper">
        <img src="./img/sheep-body.png" class="sheep-body" alt="body" />
      </div>
      <div class="bg-cont">
        <div class="login-school-bg">
          <div class="school-bg">
            <div
              v-show="
                accountModel.BackgroundImage != null &&
                  accountModel.BackgroundImage.length > 0
              "
              class="bg-cont-blur-in"
            ></div>
            <div
              v-show=" accountModel.BackgroundImage == null || accountModel.BackgroundImage.length === 0"
              class="default-bg"
            ></div>
          </div>
        </div>
        <div class="login-box">
          <a
            class="login-qrcode-entry"
            v-if="!isqrcode && scanModel.isShowWechat"
            @click="ercodeLogin"
          >
            <img src="./img/qrcode-entry.png" alt="扫码登录" />
          </a>
          <a
            class="login-qrcode-entry"
            v-if="isqrcode && scanModel.isShowWechat"
            @click="textLogin"
          >
            <img src="./img/PC-entry.png" alt="账号登录" />
          </a>
          <div
            class="login-box-logo"
            :style="{ height: !accountModel.IsShowIcon ? '30px' : '60px' }"
          >
            <img
              v-if="accountModel.IconNull && accountModel.IsShowIcon"
              src="./img/Login-logo.png"
            />
            <img
              v-else-if="accountModel.IsShowIcon"
              :src="accountModel.Icon"
              class="school-logo"
            />
          </div>
          <div
            class="login-box-content"
            :style="{ marginTop: accountModel.IsShowIcon ? '' : '20px' }"
          >
            <div class="login-box-top pr" v-show="!isqrcode">
              <!--只有在多个学校且账号登录界面才显示更多按钮，在扫一扫登录界面切换学校可能会造成二维码是切换前学校的信息-->
              <div
                v-if="accountModels.length && islogin"
                class="school-tit"
                v-cloak
                :class="!accountModel.IconNull ? 'icon-null-school-name' : ''"
              >
                <span>{{ accountModel.AccountName }}</span>
              </div>
              <div
                v-else
                class="school-tit"
                v-cloak
                :class="!accountModel.IconNull ? 'icon-null-school-name' : ''"
              >
                {{ accountModel.AccountName }}
              </div>
              <a
                v-cloak
                href="javascript:;"
                v-if="accountNumber && islogin"
                class="btn-switch"
                @click="moreSchool"
                >切换学校</a
              >
              <div
                v-cloak
                v-if="schoolBox"
                class="change-school-mark"
                @click="markBtn"
              ></div>
              <div v-cloak v-if="schoolBox" class="change-school-mark-confirm">
                <div class="school-list-search">
                  <input
                    type="text"
                    v-model="searchText"
                    placeholder="请输入学校名称"
                  />
                  <Icon type="ios-search-outline" />
                </div>
                <div class="school-list">
                  <template v-for="aModel in accountModels">
                    <div
                      class="school-list-box"
                      v-if="
                        aModel.AccountName.indexOf(searchText) >= 0 ||
                          searchText == ''
                      "
                      :key="aModel.SYSAccountID"
                      :class="{
                        'school-list-active':
                          accountModel.SYSAccountID === aModel.SYSAccountID
                      }"
                      @click="changeAccount(aModel)"
                    >
                      <div
                        class="school-list-box-tit"
                        v-cloak
                        :class="IconNull ? 'icon-null-school-name' : ''"
                      >
                        <span>{{ aModel.AccountName }}</span>
                        <Icon
                          v-if="
                            accountModel.SYSAccountID === aModel.SYSAccountID
                          "
                          type="md-checkmark"
                        />
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="login-ibox">
              <div
                id="loginBoxMain"
                class="login-box-main"
                v-if="islogin"
                style="margin-top:20px;"
              >
                <Form ref="formInline" :model="formInline" :rules="ruleInline">
                  <!-- <div class="username input-name"
                  :class="{'input-show': isInputNameShow }">用户名</div> -->
                  <FormItem prop="user" class="input-list">
                    <div
                      class="input-wrapper"
                      :class="{ focused: inputFocusStatus[0] }"
                    >
                      <Input
                        id="UserName"
                        @on-focus="inputFocus('user')"
                        @on-blur="inputBlur('user')"
                        type="text"
                        v-model="formInline.user"
                        @keyup.enter.native="handleSubmit"
                        placeholder="用户名"
                      />
                      <div class="input-line"></div>
                    </div>
                  </FormItem>
                  <!-- <div class="password input-name"
                  :class="{'input-show': isInputPasswordShow }">密码</div> -->
                  <FormItem prop="password" class="input-list pass">
                    <div
                      class="input-wrapper"
                      :class="{ focused: inputFocusStatus[1] }"
                    >
                      <Input
                        type="password"
                        @on-focus="inputFocus('pw')"
                        @on-blur="inputBlur('pw')"
                        v-model="formInline.password"
                        maxLength="20"
                        @keyup.enter.native="handleSubmit"
                        placeholder="密码"
                      />
                      <div class="input-line"></div>
                    </div>
                  </FormItem>
                  <!-- <div class="login-text">
                    <a href="javascript:;" @click="goForgetPassword">忘记密码？</a>
                  </div> -->
                  <div style="width:100%; margin-top:40px;" v-cloak>
                    <Button
                      type="primary"
                      class="login-btn xy-primary"
                      :loading="loading"
                      @click="handleSubmit"
                    >
                      <span v-show="initializing">{{ initializingText }}</span>
                      <span v-show="!initializing && !loading">登录</span>
                      <span v-show="!initializing && loading">登录中...</span>
                    </Button>
                  </div>
                </Form>
                <div class="verify-wrap" v-show="vError">
                  <slide-verify
                    :l="42"
                    :r="10"
                    :w="310"
                    :h="145"
                    ref="slideV"
                    :imgs="[]"
                    slider-text="向右滑动"
                    @success="onSuccess"
                    @fail="onFail"
                    @refresh="onRefresh"
                  ></slide-verify>
                </div>
              </div>
              <div
                class="login-qrcode"
                v-cloak
                v-if="isqrcode"
                style="padding-bottom:20px;"
              >
                <img :src="scanModel.codeUrl" />
                <span id="scanDesc">{{ scanModel.wechatLoginDesc }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="content-nav-box" v-if="isShowFooterInfo">
        <p v-cloak v-if="footerInfo">{{footerInfo}}</p>
        <p v-cloak v-else>Copyright © 2016-{{enddate}} 晓羊教育 <a @click="toXYIndex">www.xiaoyangedu.com</a> 版权所有</p>
      </div>
    </div>
    <div class="parent-null-bg" v-if="isParentNull || isFKNull"></div>
    <div
      class="parent-null"
      v-if="isParentNull || isFKNull"
      style="padding:20px"
    >
      <div>
        <img
          src="./img/parent-null.png"
          style="width: 200px;"
          v-if="isParentNull"
        />
      </div>
      <div>
        <img src="./img/fk-null.png" style="width: 200px;" v-if="isFKNull" />
      </div>
      <div style="margin: 20px 0 20px 0;font-size:16px;">
        暂未开通PC端功能，请去移动端登录查看
      </div>
      <Button
        class="xy-btn-primary"
        style="margin: 0px 0 20px 0;"
        shape="circle"
        @click="closenull"
        >我知道了</Button
      >
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import SlideVerify from 'vue-monoplasty-slide-verify'
  import * as dd from 'dingtalk-jsapi'
  import anime from 'animejs'
  // import { corpId } from '../../../../common/js/config'
  import * as $ from 'jquery'

  Vue.use(SlideVerify)
  export default {
    name: 'Login',
    data () {
      return {
        isShowLogin: false,
        searchText: '',
        isFS: false,
        footerInfo: '',
        isShowFooterInfo: true,
        sliderWidth: 320,
        IconNull: false,
        isValidatable: false,
        errorMsg: '',
        loading: false,
        initializing: true,
        initializingText: '初始化中...',
        enddate: new Date().getFullYear(),
        callbackAccountID: 0,
        callbackUrl: '',
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              type: 'string',
              min: 6,
              message: '密码必须为6位数',
              trigger: 'blur'
            }
          ]
        },
        scanModel: {
          loginGuid: '',
          codeUrl: '',
          isShowWechat: false,
          wechatLoginDesc: '请使用微信“扫一扫”登录'
        },
        schoolBox: false,
        accountModels: [],
        accountNumber: false,
        accountModel: {
          Icon: '',
          name: '',
          IconNull: false,
          SYSAccountID: 0
        },
        isInputNameShow: false,
        isInputPasswordShow: false,
        isInputShow: false,
        vError: false,
        isIconShow: false,
        islogin: true,
        isqrcode: false,
        setTimeoutID: 0,
        inputFocusStatus: [false, false],
        isParentNull: false,
        isFKNull: false,
        code: {},
        dinguseId: '',
        notInDingTalk: true
      }
    },
    created () {
      let domainUrl = ''
      if (document.URL.indexOf('?') > -1) {
        domainUrl = document.URL.split('?')
      }
      // 判断登录1
      if (domainUrl.length > 1) {
        let third = domainUrl[1].split('&')
        let loginThird = 0
        let evaStudentClient = 0
        let options = {
          AccountID: '',
          UserName: '',
          Token: '',
          startTime: '',
          eva: ''
        }
        let RouteUrl = ''
        let modelType = ''
        for (let i = 0, len = third.length; i < len; i++) {
          let o = third[i].split('=')[0]
          if (o === 'accountid' || o === 'AccountID') {
            options.AccountID = Number(third[i].split('=')[1])
          }
          if (o === 'username' || o === 'UserName') {
            options.UserName = third[i].split('=')[1]
          }
          if (o === 'token' || o === 'Token') {
            options.Token = third[i].split('=')[1]
          }
          if (o === 'loginThird' || o === 'LoginThird') {
            loginThird = Number(third[i].split('=')[1])
          }
          // 客户端
          if (o === 'evaStudentClient') {
            evaStudentClient = Number(third[i].split('=')[1])
          }
          if (o === 'startTime') {
            options.startTime = third[i].split('=')[1]
          }
          if (o === 'eva') {
            options.eva = third[i].split('=')[1]
          }
          // 直接跳转某个模块
          if (o === 'RouteUrl') {
            RouteUrl = decodeURIComponent(third[i].split('=')[1])
          }
          if (o === 'ModelType') {
            modelType = decodeURIComponent(third[i].split('=')[1])
          }
        }
        if (loginThird === 1) {
          this.getInfo(options, RouteUrl, modelType)
        } else {
          if (evaStudentClient === 1) { // 客户端
            this.xy.removeCookie('.XYTOKEN')
            this.xy.setCookie('.XYTOKEN', options.Token, { expires: 30 })
            this.xy.setCookie('startTime', decodeURIComponent(options.startTime))
            this.xy.setCookie('eva', decodeURIComponent(options.eva))
            this.xy.setCookie('isClient', '1')
            this.$router.push('/evaStudentClient')
          } else {
            if (RouteUrl) { // 直接跳某个模块
              this.xy.setCookie('.XYTOKEN', options.Token, { expires: 30 })
              this.$store.commit('changeApiPath', `${this.xyApi}/${modelType}`)
              // this.$router.push(`${RouteUrl}`)
              this.xy.setCookie('RouteUrl', RouteUrl)
              this.$router.push('/xyHome/module')
            } else {
              let domianObj = domainUrl[1].split('=')
              this.xy.setCookie('.XYTOKEN', domianObj[1], { expires: 30 })
              this.xy.msgSuc('登录成功')
              this.$router.push('/xyHome/qualityReport')
            }
          }
        }
      } else {
        if (this.xy.getIsPC()) {
          this.pcLoginFunc()
        } else {
          alert(this.xyMobileUrl)
          if (this.xyMobileUrl) {
            window.location.href = this.xyMobileUrl
          } else {
            this.pcLoginFunc()
          }
        }
      }
    },
    destroyed () {
      window.clearTimeout(this.setTimeoutID)
      this.setTimeoutID = null
    },
    methods: {
      toXYIndex () {
        window.open('http://www.xiaoyangedu.com')
      },
      closenull () {
        this.isParentNull = false
        this.isFKNull = false
      },
      async getInfo (val, RouteUrl, modelType) {
        this.xy.loading()
        let res = await this.xy.post(
          `${this.xyApi}/xy/login/CasLogin`,
          val,
          true
        )
        if (res.success) {
          this.isFS = false
          this.isShowLogin = false
          let token = res.data.token
          let webSiteTitle = localStorage.getItem('webSiteTitle')
          localStorage.setItem('webSiteTitle', webSiteTitle)
          if (token) {
            this.xy.removeCookie('.XYTOKEN')
            this.xy.setCookie('.XYTOKEN', token, { expires: 30 })
            localStorage.setItem('role', res.data.role)
            this.$store.commit('changeApiPath', `${this.xyApi}/${modelType}`)
            this.xy.setCookie('RouteUrl', RouteUrl)
            // this.isParentNull = res.data.role === 4
            this.xy.msgSuc('登录成功')
            // Todo 登陆路由
            this.$router.push('/xyHome/module')
          }
        } else {
          if (res.data !== null && res.data.type !== undefined) {
            this.isParentNull = res.data.type === 4
            this.isFKNull = res.data.type === 6
          } else {
            this.xy.msgError(res.msg)
          }
          this.isFS = true
          this.isShowLogin = true
        }
        this.xy.unloading()
      },
      pcLoginFunc () {
        this.isFS = true
        this.isShowLogin = true
        let params = this.xy.parseQueryString()
        if (params) {
          let paramsKeys = Object.keys(params)
          paramsKeys.forEach(function (value) {
            if (value.toLowerCase() === 'accountid') {
              this.callbackAccountID = params[value]
            }
            if (value.toLowerCase() === 'callbackurl') {
              this.callbackUrl = decodeURIComponent(params[value])
            }
            if (value.toLowerCase() === 'xytoken') {
              let tempToken = decodeURIComponent(params[value])
              this.xy.setCookie('.XYTOKEN', tempToken, { expires: 30 })
            }
          })
        }
        // 判断是否为钉钉环境
        this.notInDingTalk = dd.env.platform === 'notInDingTalk'
        if (!this.notInDingTalk && this.corpId !== '') {
          // this.dingdingSeting()
          this.getAccountInfo()
        } else {
          this.getAccountInfo()
          this.textLogin()
        }
      },
      goForgetPassword () {
        this.$router.push('/ForgetPassword')
      },
      onSuccess () {
        this.vError = false
        this.$refs.slideV.reset()
      },
      onFail () {
        this.msg = ''
      },
      onRefresh () {
        this.msg = ''
      },
      dingdingSeting () {
        dd.ready(() => {
          dd.runtime.permission.requestAuthCode({
            // TODO: 发布正式站时需要调整，详见 README.md 以进行修改
            corpId: this.corpId,
            onSuccess: result => {
              this.getUserMsg(result)
            },
            onFail: err => {
              console.log(err)
            }
          })
        })
      },
      async getUserMsg (DDResult) {
        this.xy.loading()
        let res = await this.xy.get(
          // this.xyApi + '/api/DingTalk/GetDDUserInfoByCode', {
          this.xyApi + '/msg/api/WeiXin/GetDDUserInfoByCode', {
            code: DDResult.code.toString(),
            accountID: this.accountModel.AccountID
          }
        )
        if (res.success) {
          this.dingUseId = res.data.userid
          this.dingTalkLogin()
        }
      },
      // 获取所有校区信息
      async getAccountInfo () {
        this.isShowLogin = false
        let res = await this.xy.get(this.xyApi + '/xy/login/AccountsInfo')
        if (res.success) {
          this.accountModels = res.data
          this.accountNumber = this.accountModels.length > 1
          this.accountModel = res.data[0]
          localStorage.setItem('accountId', res.data[0].SYSAccountID)
          this.initializing = false
          this.setAccountInfo()
          if (!this.notInDingTalk) {
            this.dingdingSeting()
          }
        }
        this.isShowLogin = true
      },

      async dingTalkLogin () {
        let params = {
          // AccountID: this.accountList[0].value,
          AccountID: this.accountModel.AccountID,
          DtUserID: this.dingUseId
        }
        let res = await this.xy.post(
          this.xyApi + '/xy/login/DingTalkLogin',
          params
        )
        this.xy.unloading()
        if (res.success) {
          window.localStorage.setItem('webSiteTitle', this.accountModel.AccountName)
          this.xy.setCookie('.XYTOKEN', res.data.token, { expires: 30 })
          // TODO 路由跳转
          this.$router.push('/xyHome/module')
        } else {
          this.xy.msgError('登录失败')
        }
      },

      // 获取登录二维码
      async getScanLoginInfo () {
        if (this.accountModel === null || this.accountModel.SYSAccountID === 0) {
          this.xy.msgError('账户配置信息错误')
          this.vError = true // 滑块显示
          this.errorMsg = '账户配置信息错误'
          return false
        }
        let res = await this.xy.post(
          this.xyApi +
            '/msg/api/wechat/ScanLoginFollow?accountID=' +
            this.accountModel.SYSAccountID,
          null,
          true
        )
        if (res.success) {
          this.scanModel.loginGuid = res.data.WebSignInGuid
          this.scanModel.codeUrl = res.data.qrCodeUrl
          this.scanModel.isShowWechat = res.data.IsShowWechat
        } else {
          this.scanModel.loginGuid = ''
          this.scanModel.codeUrl = ''
          this.scanModel.isShowWechat = false
        }
      },

      setAccountInfo () {
        this.accountModels.forEach(value => {
          if (value.Icon != null && value.Icon.length > 0) {
            value.IconNull = false
          } else {
            value.Icon = ''
            value.IconNull = true
          }
          if (
            value.BackgroundImage !== null &&
            value.BackgroundImage.length > 0
          ) {
          } else {
            value.BackgroundImage = ''
          }
        })
        if (this.accountModels.length > 0) {
          if (
            this.accountModel.BackgroundImage !== null &&
            this.accountModel.BackgroundImage.length > 0
          ) {
            $('.bg-cont-blur-in').css({
              'background-image':
                'url(' +
                this.accountModel.BackgroundImage +
                '?' +
                new Date().getTime() +
                ')'
            })
            $('.bg-cont-blur').css({
              'background-image':
                'url(' +
                this.accountModel.BackgroundImage +
                '?' +
                new Date().getTime() +
                ')'
            })
          } else {
          // $('.bg-cont-blur').css({ 'background-image': 'url(\'./img/page-bg-airplane.jpg?' + new Date().getTime() + '\')' })
          }

          this.footerInfo = this.accountModel.FooterInfo
          this.isShowFooterInfo = this.accountModel.IsShowFooterInfo
          this.getScanLoginInfo()
        }
      },

      // 点击获取学校信息
      moreSchool: function () {
        this.schoolBox = true
      },

      // 登录
      handleSubmit: function () {
        if (this.initializing) {
          this.vError = true // 滑块显示
          this.errorMsg = '系统初始化未完成'
          this.xy.msgError('系统初始化未完成')
          return false
        }

        if (this.accountModel == null || this.accountModel.SYSAccountID === 0) {
          this.vError = true // 滑块显示
          this.xy.msgError('账户配置信息错误')
          this.errorMsg = '账户配置信息错误'
          return false
        }

        this.$refs.formInline.validate(valid => {
          if (valid) {
            this.loginWeb()
          } else {
            this.vError = true
            this.xy.msgError('用户名或密码错误')
          }
        })
      },

      async loginWeb () {
        let params = {
          AccountID: this.accountModel.SYSAccountID,
          LoginId: this.formInline.user,
          Password: this.xy.encrypt(this.formInline.password)
        }

        let res = await this.xy.post(this.xyApi + '/xy/login', params, true)
        if (res.success) {
          let token = res.data.token
          let webSiteTitle = this.accountModel.AccountName
          localStorage.setItem('webSiteTitle', webSiteTitle)
          if (token) {
            // this.xy.setCookie('.XYTOKEN', token, { expires: 30 })
            this.xy.setCookie('.XYTOKEN', '99e66581-0c79-4273-b9af-bf2393bbc89f', { expires: 30 })
            localStorage.setItem('role', res.data.role)
            // this.isParentNull = res.data.role === 4
            this.xy.msgSuc('登录成功')
            // Todo 登陆路由
            this.$router.push('/qualityReport')
          } else {
            this.xy.msgError('登录失败')
          }
        } else {
          if (res.data !== null && res.data.type !== undefined) {
            this.isParentNull = res.data.type === 4
            this.isFKNull = res.data.type === 6
          } else {
            this.xy.msgError(res.msg)
          }
        }
      },
      changeAccount (model) {
        this.accountModel = model
        localStorage.setItem('accountId', this.accountModel.SYSAccountID)
        this.footerInfo = this.accountModel.FooterInfo
        this.isShowFooterInfo = model.IsShowFooterInfo
        this.schoolBox = false
        // 设置背景图
        if (this.accountModel.BackgroundImage != null && this.accountModel.BackgroundImage.length > 0) {
          $('.bg-cont-blur').css({
            'background-image':
              'url(' +
              this.accountModel.BackgroundImage +
              '?' +
              new Date().getTime() +
              ')'
          })
        } else {
          $('.bg-cont-blur').css({
            'background-image': '',
            '-webkit-filter': 'none',
            '-moz-filter': 'none',
            '-0-filter': 'none',
            '-ms-filter': 'none',
            filter: 'none'
          })
        }
        this.getScanLoginInfo()
      },
      markBtn () {
        this.schoolBox = false
      },
      // 扫码登录
      async scanLogin () {
        let params = {
          AccountID: this.accountModel.SYSAccountID,
          LoginId: this.scanModel.loginGuid.trim()
        }
        let res = await this.xy.post(
          this.xyApi + '/xy/login/ScanLogin',
          params,
          true
        )

        if (res.success) {
          this.scanModel.wechatLoginDesc = '扫码成功，登录中...'
          if (res.data.role !== 4) {
            this.xy.setCookie('.XYTOKEN', res.data.token, { expires: 30 })
            this.xy.msgSuc('登录成功')
            this.$router.push('/xyHome/module')
          } else {
            this.isParentNull = true
          }
        } else {
          this.scanModel.wechatLoginDesc = '请使用微信“扫一扫”登录'
          this.setTimeoutID = window.setTimeout(this.scanLogin, 2000)
        }
      },
      // 切换到账号登录
      textLogin: function () {
        var that = this
        that.islogin = true
        that.isqrcode = false
        that.scanModel.wechatLoginDesc = '请使用微信“扫一扫”登录'
        window.clearTimeout(that.setTimeoutID)
        this.hideSheep()
      },
      // 切换到扫一扫登录
      ercodeLogin: function () {
        var that = this
        that.islogin = false
        that.isqrcode = true
        that.setTimeoutID = window.setTimeout(that.scanLogin, 2000)
        this.showSheep()
      },
      handleClick () {
        window.open('http://www.xiaoyangedu.com')
      },
      inputFocus (data) {
        let index = data === 'user' ? 0 : 1
        this.$set(this.inputFocusStatus, index, true)
        this.showSheep()
      },
      inputBlur (data) {
        var index = data === 'user' ? 0 : 1
        this.$set(this.inputFocusStatus, index, false)
        // 延时关闭 羊博士
        var that = this
        setTimeout(function () {
          var empty = that.inputFocusStatus.filter(function (item) {
            return item
          })
          if (empty.length === 0 && !that.isqrcode) {
            that.hideSheep()
          }
        }, 500)
      },
      showSheep () {
        if (!this.SheepEmerged) {
          anime({
            targets: '.sheep-body',
            top: [
              { value: 0, duration: 0 },
              { value: -58, duration: 320 },
              { value: -52, duration: 70 },
              { value: -58, duration: 60 }
            ],
            easing: 'linear'
          })
          this.SheepEmerged = true
        }
      },
      hideSheep () {
        if (this.SheepEmerged) {
          anime({
            targets: '.sheep-body',
            top: [{ value: -0, duration: 200 }],
            easing: 'linear'
          })
          this.SheepEmerged = false
        }
      }
    }
  }
</script>
<style lang="less" scpoed>
.login-wrap {
  .cont-main {
    margin: 0 auto;
  }

  .ivu-form .ivu-form-item-error .ivu-input {
    border-left: 0;
    border-right: 0;
    border-top: 0;
  }

  .ivu-form .ivu-form-item-error .ivu-input:focus {
    box-shadow: 0 0 0 0;
  }

  .bg-main {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .bg-cont-blur {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-image: url("./img/page-bg-airplane.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  /*css hack */
  /* 解决input框背景变黄色问题 */
  input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px white inset !important;
  }

  input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px white inset !important;
  }

  /*在IE上input的兼容问题*/
  input::-ms-clear {
    display: none;
  }

  /* 子模块图标的展示 */
  .show-box {
    width: 790px;
    height: 97px;
    margin-bottom: 50px;
    position: absolute;
    bottom: 0px;
    z-index: 2;
    overflow: hidden;
  }

  .show-box > ul {
    position: absolute;
    left: 0;
    /*width: 1800px;*/
  }

  .show-box > ul > li {
    display: inline-block;
    margin-right: 20px !important;
  }

  .show-box > ul > li a {
    cursor: default;
  }

  .show-box > ul > li a .box-icon {
    display: block;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    margin-left: 7px;
    font-size: 40px;
    color: #fefefe;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transition: all 0.3s;
  }

  .show-box > ul > li a .box-icon > .icon {
    display: block;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    margin-left: 1px;
    font-size: 32px;
    color: #cacaca;
    opacity: 1;
    transition: all 0.3s;
  }

  .show-box > ul > li a .box-name {
    display: block;
    width: 75px;
    text-align: center;
    font-size: 12px;
    opacity: 0.6;
    transition: all 0.3s;
    color: #fefefe;
    overflow: hidden;
  }

  .show-box > ul > li a:hover {
    text-decoration: none;
  }

  .show-box > ul > li a:hover .box-icon > .icon {
    transition: all 0.3s;
    font-size: 40px;
    color: #fff;
    opacity: 1;
  }

  .show-box > ul > li a:hover .box-name {
    transition: all 0.3s;
    color: #fff;
    opacity: 1;
  }

  .login-wrapper {
    position: absolute;
    top: 50%;
    margin-top: -285px;
    left: 50%;
    margin-left: -550px;
    width: 1100px;
    height: 570px;
  }

  /* 背景图适配各屏幕 */
  @media all and (max-width: 1367px) {
    .show-box {
      width: 790px;
      height: 97px;
      margin-bottom: 11px;
    }

    .show-box > ul > li a .box-icon {
      display: block;
      width: 40px;
      height: 40px;
      line-height: 40px;
    }

    .show-box > ul > li a .box-icon > .icon {
      display: block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
    }

    .show-box > ul > li a:hover .box-icon > .icon {
      font-size: 22px;
    }

    .show-box > ul > li a .box-icon {
      margin-left: 15px;
    }
  }

  @media all and (min-width: 1368px) and (max-width: 1680px) {
    .show-box {
      width: 790px;
      height: 97px;
      margin-bottom: 11px;
    }

    .show-box > ul > li a .box-icon {
      display: block;
      width: 45px;
      height: 45px;
      line-height: 45px;
    }

    .show-box > ul > li a .box-icon > .icon {
      display: block;
      width: 45px;
      height: 45px;
      line-height: 45px;
      font-size: 28px;
    }

    .show-box > ul > li a:hover .box-icon > .icon {
      font-size: 34px;
    }

    .show-box > ul > li a .box-icon {
      margin-left: 15px;
    }
  }

  /* 羊博士 */

  .sheep-paw {
    position: absolute;
    z-index: 1000;
    transform: scale(0.4);
    top: -20px;
    left: 50%;
    margin-left: -110px;
  }

  .login-animation-wrapper {
    position: absolute;
    z-index: 8;
    left: 50%;
    top: -130px;
    margin-left: -55px;
    width: 110px;
    height: 126px;
  }

  .sheep-body {
    position: absolute;
    transform: scale(0.4);
    top: 0;
    left: -88px;
  }

  /* 登录页内容 */
  .bg-cont {
    display: flex;
    width: 1250px;
    height: 728px;
    position: absolute;
    top: 50px;
    left: -85px;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 9;
    background-image: url("./img/module-bg-zhi.png");
    background-repeat: no-repeat;
    background-size: contain;
    box-sizing: border-box;
    padding: 33px 64px 110px 75px;
  }

  bg-cont-blur .login-school-bg,
  .login-box {
    position: relative;
  }

  .login-school-bg .school-bg > div.default-bg {
    width: 71%;
    height: 74%;
    margin: 76px auto 0;
  }

  .login-school-bg .school-bg > div.bg-cont-blur-in {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 4px;
  }

  .login-box-logo {
    position: relative;
    margin: 17px 0 14px;
    height: 60px;
    text-align: center;
  }

  .login-box {
    position: absolute;
    top: 90px;
    right: 8.69%;
    width: 460px;
    height: 480px;
    /* min-height: 420px; */
    background: #fff;
    border-radius: 10px;
    z-index: 11;
  }

  .login-box-content {
    padding: 0px 60px;
  }

  .login-box img {
    height: 100%;
  }

  .login-box > .login-box-logo > .login-logo {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    display: block;
  }

  .login-box .login-box-top {
    margin: auto;
    text-align: center;
  }

  .ivu-modal-mask {
    display: none;
  }

  .ivu-modal-header,
  .ivu-modal-body,
  .ivu-modal-footer {
    padding: 0;
    list-style: none;
  }

  .ivu-modal-content {
    width: 60%;
    margin-left: 4%;
    background: #fff;
    box-shadow: 0px 2px 4px 0px rgba(47, 47, 47, 0.2);
    border-radius: 4px;
    position: absolute;
    top: 80px;
    z-index: 9999;
    overflow: auto;
    padding: 10px 0;
  }

  .school-list-box {
    text-align: left;
    cursor: pointer;
    padding: 10px 20px;
    background: #fff;
  }

  .school-list-active i {
    color: #4196ff;
  }

  .school-list .school-list-box:last-child {
    border-bottom: none;
  }

  .school-list-box-logo {
    width: 50%;
    padding: 0 10px 10px;
  }

  .school-list-box .school-list-box-tit {
    display: flex;
    justify-content: space-between;
    color: #292929;
    transition: all 0.3s;
  }
  .school-list-box .school-list-box-tit span {
    font-size: 15px;
  }
  .school-list-box .school-list-box-tit i {
    font-size: 20px;
    font-weight: 700;
  }
  .school-list-box:hover {
    background: rgba(156, 156, 156, 0.15);
  }
  .school-list-box:hover .school-list-box-tit {
    transition: all 0.3s;
  }

  .login-box > .login-box-top > .school-logo {
    width: 34.6%;
    margin-top: 7.75%;
  }

  .school-tit {
    text-align: center;
    font-size: 20px;
    color: #444;
    font-weight: bold;
  }

  .icon-null-school-name {
    font-size: 20px !important;
    font-weight: bold;
    padding: 0 0 10px;
  }

  .login-box > .login-box-top > .errorschool-tit {
    font-size: 18px;
    color: #292929;
    letter-spacing: 0.7px;
    margin-top: 10px;
  }

  .input-name {
    margin-bottom: 10px;
  }

  .login-box-main {
    position: relative;

    .verify-wrap {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #ffffff;
      z-index: 1111;
    }
  }

  .login-box .login-box-main input {
    height: 40px;
    margin: 10px 0 0 0;
    padding: 0;
    list-style: none;
    outline: none;
    font-size: 16px;
  }

  .input-list {
    width: 100%;
  }

  .ivu-input {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #dedede;
  }

  .ivu-input:hover {
    border-color: #dedede;
  }

  .ivu-input:focus {
    -webkit-box-shadow: none;
    box-shadow: none;
    border-color: #57a3f3;
  }

  .input-wrapper.focused .input-line {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }

  .input-line {
    margin: 0;
    height: 2px;
    border: none;
    background-color: #0083ff;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transition: -webkit-transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
    transition: -webkit-transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
    transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
    transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
      -webkit-transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .login-text {
    margin: 15px 0px 10px;
    width: 100%;
    text-align: right;
  }

  .login-text > a {
    font-size: 12px;
    color: #9b9b9b;
  }

  .login-error {
    margin-top: 10px;
    margin-bottom: 10px;
    height: 20px;
    line-height: 20px;
    padding-left: 10px;
    width: 100%;
    background: rgba(247, 140, 140, 0.9);
    color: #fff;
    letter-spacing: 0.7px;
    border-radius: 4px;
  }

  .login-error span {
    color: #fff;
    font-size: 12px;
  }

  .login-box-main > .login-list {
    width: 320px;
    height: 40px;
    margin: 0 auto 23px;
    position: relative;
  }

  .login-box-main > .login-list > label {
    display: inline-block;
    width: 26px;
    text-align: center;
    vertical-align: bottom;
    position: absolute;
    top: 7px;
    left: 5px;
  }

  .login-box-main > .login-list > label > i {
    font-size: 26px;
    color: #7fdc87;
  }

  .login-box-main > .login-list > input {
    display: inline-block;
    height: 40px;
    width: 320px;
    margin: 0;
    padding: 0;
    padding-left: 35px;
    list-style: none;
    outline: none;
    border: none;
    border-bottom: 1px solid #eaeaea;
    font-size: 14px;
  }

  .login-btn {
    width: 100%;
    height: 44px;
    color: #fff !important;
    font-size: 16px;
    letter-spacing: 6px;
    border-color: #4196ff !important;
    background: #4196ff;
    border-radius: 4px;
    box-shadow: none;
  }

  .login-btn:focus {
    -webkit-box-shadow: 0 0 0 2px rgba(240, 109, 45, 0.2) !important;
    box-shadow: 0 0 0 2px rgba(240, 109, 45, 0.2) !important;
  }

  .login-ibox > .active-ibox {
    display: block;
  }

  .login-ibox > .active-qrcode {
    display: block;
  }

  .login-qrcode-entry {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  /*用户名登录错误信息*/
  .danger-tit {
    margin: 6px 5px 10px;
  }

  .danger-tit span {
    width: 100%;
    height: 32px;
    line-height: 32px;
    display: block;
    background: #ef8e8e;
    color: #fff;
    border-radius: 4px;
    margin: 0;
  }

  .danger-tit > span > label {
    font-weight: normal;
  }

  .danger-tit i {
    margin: 0 0 0 6px;
  }

  /* 底部样式 */
  .footer {
    height: 50px;
    width: 100%;
    overflow: hidden;
    color: #b3bacb;
    position: absolute;
    bottom: 0;
    z-index: 1;
  }

  .content-nav-box {
    width: 100%;
    margin: 10px auto;
    text-align: center;
     a {
      color: #444;
    }
     a:hover {
      color: #2d8cf0;
    }
  }

  .content-nav-box ul {
    height: 50px;
    line-height: 50px;
    padding: 0;
    padding-top: 20px;
    text-align: center;
    width: 462px;
    margin: 0 auto;
  }

  .content-nav-box li {
    float: left;
    height: 22px;
    line-height: 22px;
    float: left;
    padding: 0 5px;
    color: #666;
  }

  .content-nav-box li a {
    color: #76756f;
    transition: all 0.3s;
  }

  .content-nav-box .content-nav-box-text .dt a:hover {
    transition: all 0.3s;
    color: #4c4c49;
  }

  .content-nav-box .content-nav-box-text {
    float: left;
    height: 22px;
    padding: 0 2px;
  }

  .spacer {
    width: 1px;
    height: 12px;
    margin-top: 5px;
    padding: 0;
    background: #76756f;
    overflow: hidden;
  }

  .foot-table-fr > div {
    height: 22px;
    line-height: 22px;
  }

  /* 登录框二维码显示 */
  .corner-toggle-box {
    position: absolute;
    width: 100%;
    bottom: 20px;
    text-align: center;
  }

  .corner-toggle-box-v {
    display: inline-block;
    width: 2px;
    height: 18px;
    vertical-align: middle;
    background: #b8b8b8;
  }

  .corner-toggle-box > span {
    display: inline-block;
    cursor: pointer;
    margin: 0 30px;
    height: 25px;
    line-height: 25px;
    letter-spacing: 0.8px;
    color: #444;
    font-size: 18px;
  }

  .corner-toggle-box > span:hover {
    transition: all 0.3s;
    opacity: 0.8;
  }

  .corner-toggle-box > button {
    box-shadow: none;
    border: none;
    background: #fff;
    transition: all 0.3s;
  }

  .corner-toggle-box > button:hover,
  .corner-toggle-box > button:focus {
    transition: all 0.3s;
    color: #57a3f3;
    background: #fff;
    box-shadow: none;
    border: none;
  }

  .corner-toggle-box > .active-i {
    color: #6392e9;
  }

  .login-qrcode {
    margin-top: 16px;
    margin-bottom: 47px;
    width: 80%;
    display: block;
    margin: 15px auto;
    border: 1px solid #eaeaea;
    padding: 5px;
  }

  .login-qrcode > img {
    width: 100%;
    display: block;
    margin: 0 auto;
  }

  .login-qrcode > span {
    display: block;
    text-align: center;
    margin-top: 15px;
    color: #888;
    font-size: 14px;
    transition: all 0.3s;
    cursor: default;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(180deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .demo-spin-col {
    height: 230px;
    position: relative;
    border: 1px solid #eee;
  }

  .white-bg-section {
    width: 500px;
    position: absolute;
    bottom: 0px;
    left: 50%;
    z-index: 10;
    margin-left: -250px;
    overflow: hidden;
  }

  .change-school-mark {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9998;
    background: rgba(255, 255, 255, 0);
  }

  .change-school-mark-confirm {
    position: absolute;
    top: 80px;
    left: -30px;
    box-shadow: 0px 6px 14px 0px rgba(0, 0, 0, 0.3);
    margin: auto;
    width: 400px;
    height: 360px;
    overflow-y: auto;
    z-index: 9999;
    background: #fff;
    border-radius: 6px;
    .school-list {
      height: 280px;
      overflow-y: auto;
    }
  }
  .change-school-mark-confirm .school-list-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    position: relative;
    margin: 20px;
    height: 36px;
    background: #ffffff;
    input {
      flex: 1;
      height: 34px;
      padding: 0 50px 0 20px;
      line-height: 34px;
      color: rgba(0, 0, 0, 0.85);
      border: 1px solid #c2c2c2;
      border-radius: 18px;
    }
    input::placeholder {
      color: rgba(0, 0, 0, 0.45);
    }
    input:hover {
      border: 1px solid #4196ff;
    }
    input:focus {
      border: 1px solid #4196ff;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(65, 150, 255, 0.2);
    }
    i {
      position: absolute;
      right: 17px;
      top: 8px;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .btn-switch {
    display: inline-block;
    padding: 3px 8px;
    background: #f2f2f2;
    color: rgba(0, 0, 0, 0.85);
    border-radius: 13px;
    margin-top: 5px;
  }
  .btn-switch:hover {
    background: #e7f4ff;
    color: #1890ff;
  }
  .parent-null-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
  }

  .parent-null {
    position: absolute;
    top: 40%;
    left: 50%;
    width: 500px;
    height: 320px;
    margin-top: -270px;
    margin-left: -300px;
    background: rgba(255, 255, 255, 1);
    border-radius: 33px;
    z-index: 1001;
    text-align: center;
    padding: 40px;
  }
  .login-wrapper-custom {
    .login-box-custom {
      position: absolute;
      top:50%;
      left: 50%;
      width: 460px;
      height: 480px;
      margin-left:-230px;
      margin-top:-240px;
      background: #fff;
      border-radius: 8px;
      z-index: 11;
      box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.24);
      img {
        height: 100%;
      }
      .login-box-logo {
        .login-logo {
          width: 100%;
          margin: 0 auto;
          text-align: center;
          display: block;
        }
      }
      .login-box-top {
        margin: auto;
        text-align: center;
        .school-logo {
          width: 34.6%;
          margin-top: 7.75%;
        }
        .errorschool-tit {
          font-size: 18px;
          color: #292929;
          letter-spacing: 0.7px;
          margin-top: 10px;
        }
      }
      .login-box-main {
        position: relative;
        .verify-wrap {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: #ffffff;
          z-index: 1111;
        }
        .login-list {
          width: 320px;
          height: 40px;
          margin: 0 auto 23px;
          position: relative;
          label {
            display: inline-block;
            width: 26px;
            text-align: center;
            vertical-align: bottom;
            position: absolute;
            top: 7px;
            left: 5px;
            i {
              font-size: 26px;
              color: #7fdc87;
            }
          }
          input {
            display: inline-block;
            height: 40px;
            width: 320px;
            margin: 0;
            padding: 0;
            padding-left: 35px;
            list-style: none;
            outline: none;
            border: none;
            border-bottom: 1px solid #eaeaea;
            font-size: 14px;
          }
        }
        input {
          height: 40px;
          margin: 10px 0 0 0;
          padding: 0;
          list-style: none;
          outline: none;
          font-size: 16px;
        }
      }
    }
  }
  /* 适配各屏幕 */
  @media all and (max-width: 1367px) {
    .bg-cont {
      top: 30%;
      width: 970px;
      height: 645px;
    }

    .sheep-paw {
      top: 70px;
    }
    .login-wrapper-custom .login-box-custom{
      margin-left:-150px;
      margin-top:-205px;
      width: 330px;
      height: 410px;
    }
    .login-box {
      top: 8.5%;
      right: 6.69%;
      width: 330px;
      height: 410px;
    }
    .change-school-mark-confirm {
      left: 0px;
      width: 290px;
      height: 300px;
      .school-list {
        height: 218px;
      }
    }
    .login-animation-wrapper {
      top: -40px;
    }

    .login-box-content {
      padding: 0px 20px;
    }

    .ivu-form-item {
      margin-bottom: 10px;
    }
    .corner-toggle-box {
      margin-top: 45px;
      text-align: center;
    }

    .corner-toggle-box > span {
      font-size: 14px;
    }
  }

  @media all and (min-width: 1368px) and (max-width: 1660px) {
    .login-box-content {
      padding: 20px 50px;
    }
    .ivu-form-item {
      margin-bottom: 10px;
    }
  }

  @media all and (min-width: 1681px) and (max-width: 1919px) {
    .ivu-form-item {
      margin-bottom: 16px;
    }
  }

  @media all and (min-width: 1368px) and (max-width: 1680px) {
    .corner-toggle-box > span {
      font-size: 16px;
    }
  }

  @media all and (min-width: 1681px) and (max-width: 1920px) {
    .corner-toggle-box > span {
      font-size: 18px;
    }
  }

  @media all and (min-width: 1921px) {
    .corner-toggle-box > span {
      font-size: 20px;
    }
  }
}
</style>
