<template>
  <div class="forget-wrap">
    <Steps :current="goSteps" style="margin-bottom:30px;">
      <Step title="验证身份" content=""></Step>
      <Step title="设置新密码" content=""></Step>
      <Step title="完成" content=""></Step>
    </Steps>
    <div v-if="goSteps===0" class="step-content">
      <i-form ref="formValidateCreate" :model="formValidateCreate" :rules="ruleValidateCreate"
              :label-width="120">

        <form-item label="用户名" prop="formValiName">
          <i-input v-model="formValidateCreate.formValiName" clearable style="width: 260px"></i-input>
        </form-item>

        <form-item label="手机号码" prop="formPhoneNumber">
          <i-input v-model="formValidateCreate.formPhoneNumber" clearable style="width: 260px"></i-input>
        </form-item>

        <form-item label="验证码" prop="formVerificationCode">
          <i-input v-model="formValidateCreate.formVerificationCode" clearable style="width: 260px"></i-input>
          <i-button type="primary" @click="SendVerificationCode" ghost>获取验证码</i-button>
        </form-item>
      </i-form>
      <div class="text-center" style="margin-top:20px;">
        <i-button @click="CheckVerificationCode" :loading="loadingBtn" type="primary">下一步</i-button>
      </div>
    </div>
    <div v-if="goSteps===1" class="step-content">
      <i-form ref="formValidateChangePassword" :model="formValidateChangePassword"
              :rules="ruleValidateChangePassword" :label-width="120">

        <form-item label="新密码" prop="formNewPassword">
          <i-input type="password" v-model="formValidateChangePassword.formNewPassword" style="width: 260px"></i-input>
        </form-item>

        <form-item label="确认密码" prop="formNewPasswordConfirm">
          <i-input type="password" v-model="formValidateChangePassword.formNewPasswordConfirm"
                   style="width: 260px"></i-input>
        </form-item>

      </i-form>

      <div class="text-center" style="margin-top:20px;">
        <i-button @click="ResetUsersPassword" :loading="loadingBtn" type="primary">下一步</i-button>
      </div>
    </div>
    <div v-if="goSteps===2" class="step-content">
      <Alert type="success" show-icon>
        密码重置成功！
        <span slot="desc">点击下方按钮，去登录</span>
      </Alert>
      <div class="text-center">
        <Button type="primary" @click="goBack">返回</Button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ForgetPassword',
    data () {
      const pwdCheckValidate = (rule, value, callback) => {
        if (this.formValidateChangePassword.formNewPassword !== '' && value === '') {
          callback(new Error('确认密码不能为空'))
        } else if (this.formValidateChangePassword.formNewPassword !== value) {
          callback(new Error('新密码和确认密码应相同'))
        } else {
          callback()
        }
      }
      return {
        accountID: localStorage.getItem('accountId'),
        goSteps: 2,
        // 校验验证码正确的话,返回的token值
        tokenResult: '',
        // 按钮loading
        loadingBtn: false,
        // 按钮--获取验证码
        btnVeriCodeText: '获取验证码',
        btnVeriCodeDisabled: false,

        //
        tabsEdit: '',

        // 验证身份
        formValidateCreate: {
          formValiName: '',
          formPhoneNumber: '',
          formVerificationCode: ''
        },
        ruleValidateCreate: {
          formValiName: [
            { required: true, message: '请输入您的用户名', trigger: 'blur' }
          ],
          formPhoneNumber: [
            { required: true, message: '请输入系统中预留的手机号码', trigger: 'blur' },
            {
              pattern: /^1(3[0-9]|4[57]|5[0-35-9]|66|7[0135678]|8[0-9]|9[8-9])\d{8}$/,
              message: '您输入的手机号格式错误。',
              trigger: 'blur'
            }
          ]
        },

        // 设置新密码
        formValidateChangePassword: {
          formNewPassword: '',
          formNewPasswordConfirm: ''
        },
        ruleValidateChangePassword: {
          formNewPassword: [
            { pattern: /^[\x21-\x7e]{6,20}$/, message: '请输入6~20位密码', trigger: 'blur' }
          ],
          formNewPasswordConfirm: [
            { validator: pwdCheckValidate, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 获取验证码
      SendVerificationCode () {
        this.$refs.formValidateCreate.validate(async (valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            let params = {
              UserName: this.formValidateCreate.formValiName,
              PhoneNumber: this.formValidateCreate.formPhoneNumber,
              AccountID: this.accountID
            }
            let rs = await this.xy.post(this.xyApi + '/xy/login/SendVerificationCode', params)
            if (rs.success) {
              this.xy.msgSuc('手机验证码已发送！')
              this.tokenResult = rs.data
              return this.changeLoading()
            }
          }
        })
      },

      // 校验验证码--下一步
      CheckVerificationCode () {
        if (!this.tokenResult) {
          return this.xy.msgError('身份认证已过期，请重新认证！')
        }
        this.$refs.formValidateCreate.validate(async (valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            if (!this.formValidateCreate.formVerificationCode) {
              this.xy.msgError('请输入手机验证码。')
              return this.changeLoading()
            } else {
              let params = {
                PhoneNumber: this.formValidateCreate.formPhoneNumber,
                VerificationCode: this.formValidateCreate.formVerificationCode,
                AccountID: this.accountID,
                UserName: this.formValidateCreate.formValiName,
                token: this.tokenResult
              }
              let rs = await this.xy.post(this.xyApi + '/xy/login/CheckVerificationCode', params)
              if (rs.success) {
                this.xy.msgSuc('手机验证码正确！')
                this.goSteps = 1
              }
            }
          }
        })
      },

      // 重置密码
      ResetUsersPassword () {
        this.$refs.formValidateChangePassword.validate(async (valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            let postUrl = `${this.xyApi}/api/login/ResetUsersPassword?accountID=${this.accountID}&password=${this.formValidateChangePassword.formNewPasswordConfirm}&token=${encodeURIComponent(this.tokenResult)}`
            let rs = await this.xy.post(postUrl)
            if (rs.success) {
              this.goSteps = 2
              this.xy.msgSuc('设置新密码成功！')
            }
          }
        })
      },
      // 提交创建触发
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      goBack () {
        this.$router.push('/login')
      }
    }
  }
</script>
<style lang="less" scoped>
  .forget-wrap {
    width: 1200px;
    padding: 20px;
    box-sizing: border-box;
    background: #fff;
    margin: 20px auto;

    .step-content {
      width: 600px;
      margin: 0 auto;
    }
  }
</style>
