<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div class="xy-dding">
        <Alert show-icon
          >请把申请钉钉时钉钉公司返回给您的相应内容填入以下表格。</Alert
        >
        <i-form
          ref="formValidate"
          label-position="left"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="100"
          style="width: 470px;margin:20px auto"
        >
          <form-item
            label="AgentCode"
            label-for="AgentCode"
            prop="DingDingAgentCode"
          >
            <i-input
              v-model.trim="formValidate.DingDingAgentCode"
              element-id="AgentCode"
              clearable
            >
            </i-input>
          </form-item>
          <form-item label="AgentID" label-for="AgentID" prop="DingDingAgentID">
            <i-input
              v-model.trim="formValidate.DingDingAgentID"
              element-id="AgentID"
              clearable
            >
            </i-input>
          </form-item>
          <form-item label="CorpID" label-for="CorpID" prop="DingDingCorpID">
            <i-input
              v-model.trim="formValidate.DingDingCorpID"
              element-id="CorpID"
              clearable
            >
            </i-input>
          </form-item>
          <form-item
            label="SSOsecret"
            label-for="SSOsecret"
            prop="DingDingSSOsecret"
          >
            <i-input
              v-model.trim="formValidate.DingDingSSOsecret"
              element-id="SSOsecret"
              clearable
            >
            </i-input>
          </form-item>
          <form-item>
            <i-button
              class="xy-btn-primary"
              shape="circle"
              :loading="loading"
              @click="save"
            >
              保存
            </i-button>
          </form-item>
        </i-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DingDingSetting',
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('AgentCode不能为空'))
        } else {
          let reg = /^-?[1-9]\d{0,1}$|^0$|^100$|^-100$/
          if (value.length > 100) {
            callback(new Error('AgentCode不能超过100个字'))
          } else if (reg.test(value)) {
            return true
          } else {
            callback(new Error('请输入-100~100之间（包含-100跟100）的整数'))
          }
        }
      }
      return {
        menus: [], // 面包屑
        loading: false,
        formValidate: {
          DingDingAgentCode: '',
          DingDingAgentID: '',
          DingDingCorpID: '',
          DingDingSSOsecret: '',
          DingDingID: 0
        },
        ruleValidate: {
          DingDingAgentCode: [{ validator: validatePass, trigger: 'blur' }],
          DingDingAgentID: [
            { required: true, message: 'AgentID不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 50,
              message: 'AgentID不能超过50个字',
              trigger: 'blur'
            }
          ],
          DingDingCorpID: [
            { required: true, message: 'CorpID不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 100,
              message: 'CorpID不能超过100个字',
              trigger: 'blur'
            }
          ],
          DingDingSSOsecret: [
            {
              required: true,
              message: 'SSOsecret不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 100,
              message: 'SSOsecret不能超过100个字',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created () {
      this.getDingDingChat()
    },
    mounted () {
      this.$Message.config({
        top: 70,
        duration: 2
      })
    },
    methods: {
      // 获取钉钉配置信息
      async getDingDingChat () {
        this.xy.loading()
        try {
          const res = await this.xy.get(
            `${this.xyApi + '/base'}/api/Settings/GetDingDing`
          )
          if (res.success && res.data) {
            if (res.data && res.data.length > 0) {
              this.formValidate.DingDingAgentCode = String(
                res.data[0].DingDingAgentCode
              )
              this.formValidate.DingDingAgentID = res.data[0].DingDingAgentID
              this.formValidate.DingDingCorpID = res.data[0].DingDingCorpID
              this.formValidate.DingDingSSOsecret = res.data[0].DingDingSSOsecret
              this.formValidate.DingDingID = res.data[0].DingDingID
            }
          }
        } catch (error) {
          this.xy.mError('获取钉钉配置信息失败', error)
        }
        this.xy.unloading()
      },
      save () {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.loading = true
            if (this.formValidate.DingDingID > 0) {
              const editParams = {
                DingDingAgentCode: parseInt(this.formValidate.DingDingAgentCode),
                DingDingAgentID: this.formValidate.DingDingAgentID,
                DingDingCorpID: this.formValidate.DingDingCorpID,
                DingDingSSOsecret: this.formValidate.DingDingSSOsecret,
                DingDingID: this.formValidate.DingDingID
              }
              this.postEdit(
                `${this.xyApi + '/base'}/api/Settings/UpdateDingDing`,
                editParams
              )
            } else {
              const createParams = {
                DingDingAgentCode: parseInt(this.formValidate.DingDingAgentCode),
                DingDingCorpID: this.formValidate.DingDingAgentID,
                DingDingSSOsecret: this.formValidate.DingDingCorpID,
                DingDingAgentID: this.formValidate.DingDingSSOsecret,
                DingDingID: this.formValidate.DingDingID
              }
              this.postCreate(
                `${this.xyApi + '/base'}/api/Settings/AddDingDing`,
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
            this.xy.msgSuc('编辑成功。')
          }
        } catch (error) {
          this.xy.mError('编辑失败', error)
        }
        this.loading = false
      },
      async postCreate (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            this.getDingDingChat()
            this.xy.msgSuc('保存成功。')
          }
        } catch (error) {
          this.xy.mError('保存失败', error)
        }
        this.loading = false
      }
    }
  }
</script>

<style lang="less" scoped>
.xy-dding {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}
</style>
