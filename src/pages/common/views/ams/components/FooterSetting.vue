<template>
  <div id="footerSetting">
    <i-form
      ref="footerForm"
      label-position="top"
      :model="footerForm"
      :rules="footerValidate"
      :label-width="90"
      class="Form"
      >
      <form-item>
        <h1 class="footer-title">页脚设置</h1>
      </form-item>
      <form-item prop="address">
        <!-- <i-input
          v-model="footerForm.address"
          type="textarea"
          :rows="8"
          placeholder="请输入页脚文字"
          :autosize="{ maxRows: 8, minRows: 8 }"
          />
        <span class="" style="position: absolute;top:150px; right:10px">已输入{{ txtVal }}/150</span> -->
        <Input v-model="footerForm.address" :rows="8" maxlength="150" :autosize="{ maxRows: 8, minRows: 8 }" show-word-limit type="textarea" placeholder="请输入页脚文字" />
      </form-item>
      <form-item>
        <p class="menu-title" style="font-size: 16px;font-weight: bold;">
          显示页脚文字
        </p>
      </form-item>
      <form-item>
        <radio-group v-model="footerTextShow">
          <radio label="1">显示</radio>
          <radio label="0">隐藏</radio>
        </radio-group>
      </form-item>
      <!-- <form-item>
        <p class="menu-title" style="font-size: 16px;font-weight: bold;">
          菜单底部信息
        </p>
      </form-item>
      <form-item>
        <radio-group v-model="footerMenuShow">
          <radio label="1">显示</radio>
          <radio label="0">隐藏</radio>
        </radio-group>
      </form-item> -->
      <form-item class="text-center" style="margin-top: 10px;">
        <Button class="xy-btn-primary" @click="footerSubmit('footerForm')" shape="circle">保存</Button>
      </form-item>
    </i-form>
  </div>
</template>

<script>
  import { urlSets } from './urlSets.js'
  export default {
    name: 'AMS_m_footer',
    props: {
      AMSGbVal: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        serviceUrl: this.apiAMS,
        txtVal: 0,
        footerMenuShow: '1', // 菜单底部信息
        footerTextShow: '1', // 显示页脚文字
        footerForm: {
          // 页脚设置
          address: ''
        },
        footerValidate: {
          address: [
            {
              type: 'string',
              max: 150,
              message: '页脚文字不能超过150字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created: function () {},
    mounted: function () {
      this.loadSetting()
    },
    watch: {
      footerForm: {
        handler (newName, oldName) {
          this.txtVal = newName.address.length
        },
        deep: true
      }
    },
    methods: {
      // 页脚设置保存
      footerSubmit (name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            var footer = {}
            footer.AccountID = this.AMSGbVal.accountID
            if (this.footerTextShow === '1') {
              // 显示页脚文字
              footer.IsShowFooterInfo = true
            } else {
              footer.IsShowFooterInfo = false
            }
            if (this.footerMenuShow === '1') {
              // 菜单底部信息
              footer.IsShowLogoForFooter = true
            } else {
              footer.IsShowLogoForFooter = false
            }

            footer.FooterInfo = this.footerForm.address
            this.xy.loading()
            this.postSubmit(footer)
          } else {
            this.xy.msgError('更新失败。')
          }
        })
      },
      async postSubmit (footer) {
        try {
          const res = await this.xy.post(
            `${this.serviceUrl}${urlSets.EditFooter}`,
            footer
          )
          if (res.success) {
            this.xy.msgSuc('更新成功。')
            this.loadSetting()
          }
        } catch (error) {
          this.xy.mError('更新失败', error)
        }
      },
      async loadSetting () {
        this.xy.loading()
        try {
          const res = await this.xy.get(
            `${this.serviceUrl}${urlSets.AccountFooter}`,
            { accountID: this.AMSGbVal.accountID }
          )
          if (res.success) {
            var result = res.data
            this.footerForm.address = result.FooterInfo
            if (result.FooterInfo != null) {
              this.txtVal = result.FooterInfo.length
            }
            if (result.IsShowFooterInfo) {
              this.footerTextShow = '1'
            } else {
              this.footerTextShow = '0'
            }
            if (result.IsShowLogoForFooter) {
              this.footerMenuShow = '1'
            } else {
              this.footerMenuShow = '0'
            }
          }
        } catch (error) {
          this.xy.msgError('获取数据时发生错误。')
          // eslint-disable-next-line no-console
          console.error(error)
        }
        this.xy.unloading()
      }
    }
  }
</script>
