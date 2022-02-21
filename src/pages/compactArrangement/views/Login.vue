<template>
  <div class="login-wrap" >
    <div class="bg-main">
      <div class="left">
        <div>
          <img class="logo" src="@/assets/common/logo.png" alt="">
          <span class="logo-title">晓羊智能排课PaaS服务平台</span>
        </div>
        <div class="login_banner">
          <img src="@/pages/compactArrangement/imgs/login_banner_ele.png" alt="">
        </div>
      </div>
      <div class="right">
        <div class="right-text">欢迎登录</div>
        <div class="login-box">
          <div style="width: 100%;">
            <div style="margin-bottom: 24px;">
              <p class="input-name">用户名</p>
              <Input @keyup.enter.native="loginSubmit" v-model="loginName" placeholder="请输入用户名"/>
            </div>
            <div>
              <p class="input-name">密码</p>
              <Input @keyup.enter.native="loginSubmit" v-model="password" type="password" placeholder="请输入密码"/>
            </div>
            <div>
              <Button type="primary" @click="loginSubmit">登录</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Login',
    data () {
      return {
        loginName: '',
        password: '',
        accountModel: ''
      }
    },
    created () {
      let domainUrl = ''
      if (document.URL.indexOf('?') > -1) {
        domainUrl = document.URL.split('?')
      }
      console.log('domainUrl:' + domainUrl)
      // 区域直接登录上来后
      if (domainUrl.length > 1) {
        console.log('区域站点登录过来的')
        let third = domainUrl[1].split('&')
        let token = ''
        let webSiteTitle = ''
        for (let i = 0, len = third.length; i < len; i++) {
          let o = third[i].split('=')[0]
          if (o === 'XYTOKEN') {
            token = third[i].split('=')[1]
          }
          if (o === 'webSiteTitle') {
            webSiteTitle = third[i].split('=')[1]
          }
        }
        if (token) {
          localStorage.setItem('webSiteTitle', decodeURIComponent(webSiteTitle))
          this.$store.commit('common/getAccountName', decodeURIComponent(webSiteTitle))
          this.xy.setCookie('.XYTOKEN', token, { expires: 30 })
        }
        this.xy.msgSuc('登录成功')
        this.$router.push('/xyhome/moduleFunc')
        console.log(token)
        console.log(webSiteTitle)
      } else {
        this.getAccountInfo()
      }
    },
    methods: {
      // 获取所有校区信息
      async getAccountInfo () {
        let res = await this.xy.get(this.xyApi + '/xy/login/AccountsInfo')
        if (res.success) {
          this.accountModel = res.data[0]
        }
      },
      loginSubmit () {
        let params = {
          AccountID: this.accountModel.SYSAccountID,
          LoginId: this.loginName,
          Password: this.xy.encrypt(this.password)
        }

        this.xy.post(this.xyApi + '/xy/login/LiteLogin', params, true).then(res => {
          if (res.success) {
            let token = res.data.token
            let webSiteTitle = this.accountModel.AccountName
            localStorage.setItem('webSiteTitle', webSiteTitle)
            if (token) {
              this.xy.setCookie('.XYTOKEN', token, { expires: 30 })
              localStorage.setItem('role', res.data.role)
              this.xy.msgSuc('登录成功')
              this.$router.push('/xyhome/moduleFunc')
            } else {
              this.xy.msgError('登录失败')
            }
          } else {
            this.xy.msgError(res.msg)
          }
        })
      }
    }
  }
</script>
<style lang="less" scpoed>
.login-wrap {
  display: flex;
  height: 100%;
  align-items: center;
  background: #fafafa;
  .bg-main{
    background-image: url("../imgs/Background.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    width: 1199px;
    height:730px;
    margin:0 auto;
    display: flex;
    justify-content: flex-start;
    padding: 60px 70px;
    .left{
      flex: 1;
      border-right: 1px solid #eeeded;
      .logo{
        width: 42px;
        height: 54px;
      }
      .logo-title{
        margin-left: 20px;
        font-size: 28px;
        font-weight: bold;
        vertical-align: middle;
      }
      .login_banner{
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
    .right{
       flex: 1;
       margin-left: 49px;
       .right-text{
        font-size: 28px;
        font-weight: bold;
        margin-top: 8px;
       }
       .login-box{
        height: 100%;
        display: flex;
        align-items: center;
        .input-name{
          font-weight: 400;
          font-size: 18px;
          color: #666666;
          margin-bottom: 8px;
        }
        .ivu-input{
          width: 100%;
          height: 54px;
          font-size: 16px;
        }
        .ivu-btn{
          margin-top: 60px;
          width: 100%;
          height: 56px;
          background: linear-gradient(90deg,#215cf5, #47acfa);
          border-radius: 4px;
          font-size: 20px;
        }
       }
    }
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

}
 /* 背景图适配各屏幕 */
  @media all and (max-width: 1367px) {
    .login-wrap {
      display: flex;
      height: 100%;
      align-items: center;
      background: #fafafa;
      .bg-main{
        background-image: url("../imgs/Background.png");
        background-size: 100% auto;
        background-repeat: no-repeat;
        width: 820px;
        height:499px;
        display: flex;
        justify-content: flex-start;
        padding: 40px 50px;
        .left{
          flex: 1;
          padding-right: 10px;
          border-right: 1px solid #eeeded;
          .logo{
            width: 42px;
            height: 54px;
          }
          .logo-title{
            margin-left: 10px;
            font-size: 23px;
            font-weight: bold;
            vertical-align: middle;
          }
          .login_banner{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            img{
              width: 100%;
            }
          }
        }
        .right{
          flex: 1;
          margin-left: 20px;
          .right-text{
            font-size: 24px;
            font-weight: bold;
            margin-top: 10px;
          }
          .login-box{
            height: 100%;
            display: flex;
            align-items: center;
            .input-name{
              font-weight: 400;
              font-size: 16px;
              color: #666666;
              margin-bottom: 8px;
            }
            .ivu-input{
              width: 100%;
              height: 46px;
              font-size: 14px;
            }
            .ivu-btn{
              margin-top: 40px;
              width: 100%;
              height: 46px;
              background: linear-gradient(90deg,#215cf5, #47acfa);
              border-radius: 4px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  @media all and (min-width: 1368px) and (max-width: 1680px) {
    .login-wrap {
      display: flex;
      height: 100%;
      align-items: center;
      background: #fafafa;
      .bg-main{
        background-image: url("../imgs/Background.png");
        background-size: 100% auto;
        background-repeat: no-repeat;
        width: 874px;
        height:532px;
        display: flex;
        justify-content: flex-start;
        padding: 30px 45px;
        .left{
          flex: 1;
          padding-right: 10px;
          border-right: 1px solid #eeeded;
          .logo{
            width: 42px;
            height: 54px;
          }
          .logo-title{
            margin-left: 10px;
            font-size: 24px;
            font-weight: bold;
            vertical-align: middle;
          }
          .login_banner{
            height: 100%;
            display: flex;
            align-items: center;
            img{
              width: 100%;
            }
          }
        }
        .right{
          flex: 1;
          margin-left: 20px;
          .right-text{
            font-size: 24px;
            font-weight: bold;
            margin-top: 10px;
          }
          .login-box{
            height: 100%;
            display: flex;
            align-items: center;
            .input-name{
              font-weight: 400;
              font-size: 16px;
              color: #666666;
              margin-bottom: 8px;
            }
            .ivu-input{
              width: 100%;
              height: 46px;
              font-size: 14px;
            }
            .ivu-btn{
              margin-top: 40px;
              width: 100%;
              height: 46px;
              background: linear-gradient(90deg,#215cf5, #47acfa);
              border-radius: 4px;
              font-size: 20px;
            }
          }
        }
      }
    }
  }
</style>
