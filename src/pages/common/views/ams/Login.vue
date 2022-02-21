<template>
  <div id="AMS_login" class="AMS-login">
    <div class="loginForm">
      <div class="login-title" style>AMS系统登录</div>
      <p class="tip" v-if="isTipShow" style="margin:10px 0;color:#ed4014;">
        用户名或密码不正确
      </p>
      <i-form
        ref="formInline"
        :model="formInline"
        label-position="top"
        :rules="ruleInline"
        style="margin:0 60px;"
        >
        <form-item label="用户名" prop="user" labelFor="user">
          <i-input
            elementId="user"
            v-model="formInline.user"
            placeholder="用户名"
            @keyup.enter.native="loginSubmit"
            >
          </i-input>
        </form-item>
        <form-item label="密码" prop="password" labelFor="password">
          <i-input
            elementId="password"
            v-model="formInline.password"
            type="password"
            placeholder="密码"
            @keyup.enter.native="loginSubmit"
            />
        </form-item>
        <form-item style="width:100%; margin-right:0; margin-bottom:10px;">
          <i-button
            type="primary"
            style="width:100%;height:38px; background:linear-gradient(90deg,rgba(66,151,255,1) 0%,rgba(42,117,255,1) 100%);border-radius: 25px"
            :loading="loading"
            @click="loginSubmit('formInline')"
            >
            <span v-show="!loading">登录</span>
            <span v-show="loading">登录中...</span>
          </i-button>
        </form-item>
      </i-form>
    </div>
  </div>
</template>

<script>
  import { urlSets } from './components/urlSets.js'
  export default {
    name: 'AMS-login',
    data () {
      return {
        serviceUrl: this.apiAMS,
        isTipShow: false,
        loading: false,
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: '',
          password: ''
        },
        userName: ''
      }
    },
    methods: {
      async loginSubmit (name) {
        this.loading = true
        const AMSSettingModel = {
          UserName: this.formInline.user,
          Password: this.formInline.password
        }
        try {
          const res = await this.xy.post(
            `${this.serviceUrl}${urlSets.login}`,
            AMSSettingModel,
            true
          )
          if (res.success) {
            this.xy.setCookie('.AMSXYTOKEN', res.data.Token)
            this.xy.setCookie('.userName', res.data.UserName)
            this.userName = res.data.UserName
            this.gotoList()
            document.title = 'AMS'
          } else {
            this.xy.msgError('用户名或密码有误。')
          }
        } catch (error) {
          this.xy.msgError('登录失败。')
          // eslint-disable-next-line no-console
          console.error(error)
        }
        this.loading = false
      },
      gotoList () {
        const token = this.xy.getCookie('.AMSXYTOKEN')
        if (token && token !== 'undefined') {
          this.$router.push('/ams/siteList')
        }
      }
    },
    created: function () {
      this.gotoList()
    }
  }
</script>

<style lang="less" scoped>
  .AMS-login {
    background: url(~@/assets/common/ams/loginBg.png) no-repeat;
    background-size: cover;
    height: 100%;
  }
  .loginForm {
    position: absolute;
    top: 0px;
    right: 20%;
    bottom: 0px;
    margin: auto;
    width: 450px;
    height: 510px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 14px 0px rgba(55, 123, 245, 0.5);
    border-radius: 10px;
  }
  input {
    font-size: 14px;
    margin-bottom: 15px;
    border: none;
    height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 6px 0px rgba(206, 195, 198, 0.35);
    border-radius: 25px;
  }
  input:focus {
    background: rgba(239, 240, 244, 1);
    box-shadow: none;
    border: none;
  }
  .ivu-icon {
    color: #fff;
    font-size: 24px;
  }
  button:focus {
    box-shadow: none;
  }
  .login-title {
    font-size: 22px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    text-align: center;
    margin: 53px 0;
  }
  .ivu-form .ivu-form-item-label {
    font-size: 14px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
</style>
