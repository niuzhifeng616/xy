<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div class="xy-wechat-set">
        <Alert show-icon
          >请把申请微信公众号时腾讯公司返回给您的相应内容填入以下表格。</Alert
        >
        <Form
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          label-position="right"
          :label-width="150"
          class="formAll"
          style="width: 508px;margin:20px auto"
        >
          <FormItem
            label="Apple ID:"
            labelFor="weChatAppIDItem"
            class="formAll-item"
          >
            <i-input
              v-model="formValidate.weChatAppID"
              clearable
              elementId="weChatAppIDItem"
            >
            </i-input>
          </FormItem>
          <FormItem
            label="App Secret:"
            labelFor="weChatAppSecretItem"
            class="formAll-item"
          >
            <i-input
              v-model.trim="formValidate.weChatAppSecret"
              clearable
              elementId="weChatAppSecretItem"
            >
            </i-input>
          </FormItem>
          <FormItem
            label="Token:"
            labelFor="weChatTokenItem"
            class="formAll-item"
          >
            <i-input
              v-model.trim="formValidate.weChatToken"
              clearable
              elementId="weChatTokenItem"
            >
            </i-input>
          </FormItem>
          <FormItem
            label="Encoding AE Skey:"
            labelFor="weChatEncodingAESKeyItem"
            class="formAll-item"
          >
            <Input
              v-model.trim="formValidate.weChatEncodingAESKey"
              clearable
              elementId="weChatEncodingAESKeyItem"
              type="textarea"
            />
          </FormItem>
          <FormItem label="微信扫一扫：" class="formAll-item">
            <i-switch v-model="formValidate.isWebChatLogin">
              <span slot="open"></span>
              <span slot="close"></span>
            </i-switch>
          </FormItem>
          <FormItem class="formAll-item" style="margin-top:20px">
            <Button class="xy-btn-primary" shape="circle" @click="save"
              >确定</Button
            >
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        menus: [], // 面包屑
        loading: true,
        formValidate: {
          weChatAppID: '',
          weChatAppSecret: '',
          weChatToken: '',
          weChatEncodingAESKey: '',
          isWebChatLogin: false,
          weChatID: 0,
          weChatAccessToken: ''
        },
        ruleValidate: {
          weChatAppID: [
            { required: true, message: 'AppID不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 50,
              message: 'AppID不能超过50个字',
              trigger: 'blur'
            }
          ],
          weChatAppSecret: [
            { required: true, message: 'AppSecret不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 100,
              message: 'AppSecret不能超过100个字',
              trigger: 'blur'
            }
          ],
          weChatToken: [
            { required: true, message: 'Token不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 32,
              message: 'Token不能超过32个字',
              trigger: 'blur'
            }
          ],
          weChatEncodingAESKey: [
            {
              required: true,
              message: 'EncodingAESKey不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 43,
              message: 'EncodingAESKey不能超过43个字',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created () {
      // 获取微信配置信息
      this.getWeChat()
      // 获取面包屑数据
      this.getMenu()
    },
    mounted () {
      this.$Message.config({
        top: 70,
        duration: 2
      })
    },
    methods: {
      getMenu () {
        var getmenus = localStorage.getItem('menus')
        var parsemenus = JSON.parse(getmenus)
        this.menus = parsemenus
      },
      // 获取微信配置信息
      async getWeChat () {
        this.xy.loading()
        try {
          const res = await this.xy.get(
            `${this.xyApi + '/msg'}/api/WeChat/GetAll`
          )
          if (res.success) {
            this.formValidate.weChatAppID = res.data.WeChatAppID
            this.formValidate.weChatAppSecret = res.data.WeChatAppSecret
            this.formValidate.weChatToken = res.data.WeChatToken
            this.formValidate.weChatEncodingAESKey =
              res.data.WeChatEncodingAESKey
            this.formValidate.isWebChatLogin = res.data.IsWebChatLogin
            this.formValidate.weChatID = res.data.WeChatID
            this.weChatAccessToken = res.data.WeChatAccessToken
          }
        } catch (error) {
          this.xy.mError('获取微信配置信息失败', error)
        }
        this.xy.unloading()
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      save () {
        this.$refs.formValidate.validate(valid => {
          if (!valid) {
            return this.changeLoading()
          } else {
            if (this.formValidate.weChatID > 0) {
              const editParams = {
                WeChatAppID: this.formValidate.weChatAppID,
                WeChatAppSecret: this.formValidate.weChatAppSecret,
                WeChatToken: this.formValidate.weChatToken,
                WeChatEncodingAESKey: this.formValidate.weChatEncodingAESKey,
                IsWebChatLogin: this.formValidate.isWebChatLogin,
                WeChatID: this.formValidate.weChatID,
                WeChatAccessToken: this.weChatAccessToken
              }
              this.postEdit(`${this.xyApi + '/msg'}/api/WeChat/Edit`, editParams)
            } else {
              const createParams = {
                WeChatAppID: this.formValidate.weChatAppID,
                WeChatAppSecret: this.formValidate.weChatAppSecret,
                WeChatToken: this.formValidate.weChatToken,
                WeChatEncodingAESKey: this.formValidate.weChatEncodingAESKey,
                IsWebChatLogin: this.formValidate.isWebChatLogin,
                WeChatID: this.formValidate.weChatID,
                WeChatAccessToken: this.weChatAccessToken
              }
              this.postEdit(
                `${this.xyApi + '/msg'}/api/WeChat/Create`,
                createParams
              )
            }
          }
        })
      },
      async postEdit (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            this.changeLoading()
            this.xy.msgSuc('编辑成功。')
          }
        } catch (error) {
          this.xy.mError('编辑失败', error)
        }
      },
      async postCreate (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            this.getWeChat()
            this.xy.msgSuc('保存成功。')
          }
        } catch (error) {
          this.xy.mError('保存失败', error)
        }
      },
      cancelBtn () {
        this.formValidate.weChatAppID = ''
        this.formValidate.weChatAppSecret = ''
        this.formValidate.weChatToken = ''
        this.formValidate.weChatEncodingAESKey = ''
        this.formValidate.isWebChatLogin = ''
        this.formValidate.weChatID = ''
      }
    }
  }
</script>

<style lang="less" scoped>
.xy-wechat-set {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}
// .formAll {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   margin-left: -170px;
//   margin-top:20px;
//   .formAll-item {
//     width: 540px;
//   }
// }
.changewidth {
  width: 282px;
}
.ivu-form-item-label {
  height: 15px;
  font-size: 15px !important;
  font-weight: 400;
  color: rgba(51, 51, 51, 1) !important;
}
.changeinput {
  width: 605px;
}
.ivu-input {
  height: 36px !important;
}
.delateBtn {
  background-color: rgba(236, 236, 238, 1);
}
.firstform {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(235, 235, 235, 1);
  border-radius: 4px;
  padding: 25px 0px;
}
.https .ivu-form-item-content {
  margin-left: 0 !important;
}
</style>
