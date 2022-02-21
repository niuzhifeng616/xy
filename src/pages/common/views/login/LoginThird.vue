<template>
  <div class="login-third">
    <div v-if="isError" class="error">
      <div>
        <img :src="require('@/assets/common/loginthird.png')" alt="">
      </div>
      <div>{{errorInfo}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'LoginThird',
    data () {
      return {
        isError: false,
        errorInfo: '',
        options: {
          AccountID: '',
          UserName: '',
          Token: ''
        }
      }
    },
    created () {
      let domainUrl = ''
      if (document.URL.indexOf('?') > -1) {
        domainUrl = document.URL.split('?')
      }
      // 判断登录1
      if (domainUrl.length > 1) {
        this.isError = false
        let domianObj = domainUrl[1].split('&')
        for (let i = 0, len = domianObj.length; i < len; i++) {
          let o = domianObj[i].split('=')[0]
          if (o === 'accountid' || o === 'AccountID') {
            this.options.AccountID = domianObj[i].split('=')[1]
          }
          if (o === 'username' || o === 'UserName') {
            this.options.UserName = domianObj[i].split('=')[1]
          }
          if (o === 'token' || o === 'Token') {
            this.options.Token = domianObj[i].split('=')[1]
          }
        }
        this.getInfo()
      } else {
        this.isError = true
        this.errorInfo = '请确认网站地址是否正确'
      }
    },
    destroyed () {
    },
    methods: {
      getInfo () {
        this.xy.loading()
        this.xy.post(`${this.xyApi}/xy/login/CasLogin`, this.options).then(res => {
          if (res.success) {
            this.isError = false
            let token = res.data.token
            let webSiteTitle = this.accountModel.AccountName
            localStorage.setItem('webSiteTitle', webSiteTitle)
            if (token) {
              this.xy.setCookie('.XYTOKEN', token, { expires: 30 })
              localStorage.setItem('role', res.data.role)
              this.isParentNull = res.data.role === 4
              this.xy.msgSuc('登录成功')
              // Todo 登陆路由
              this.$router.push('/xyHome/module')
            }
          } else {
            this.errorInfo = res.msg
            this.isError = true
          }
          this.xy.unloading()
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.login-third{
  text-align:center;
  height: 100%;
  background: #fff;
  .error{
    img{
      width: 34%;
    }
    div{
      font-size: 16px;
    }
  }
}
</style>
