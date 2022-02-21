<template>
  <div class="creat-site">
    <!--  TODO: 【暂存】 此功能已被放弃，暂存 -->
    <i-form
      ref="domainForm"
      :model="domainForm"
      :rules="domainValidate"
      :label-width="120"
      style="width: 800px;margin: auto;padding-top: 50px;"
      >
      <form-item label="站点编号" prop="domainNumber" labelFor="domainNumber">
        <i-input v-model="domainForm.domainNumber" elementId="domainNumber" clearable></i-input>
      </form-item>
      <form-item label="站点名称" prop="accountName" labelFor="accountName">
        <i-input v-model="domainForm.accountName" elementId="accountName" clearable></i-input>
      </form-item>
      <form-item label="数据库名称" prop="dbName" labelFor="dbName">
        <i-input v-model="domainForm.dbName" elementId="dbName" clearable></i-input>
      </form-item>
      <form-item label="读库" prop="readDB" labelFor="readDB">
        <i-input v-model="domainForm.readDB" elementId="readDB" clearable></i-input>
      </form-item>
      <form-item label="写库" prop="writeDB" labelFor="writeDB">
        <i-input v-model="domainForm.writeDB" elementId="writeDB" clearable></i-input>
      </form-item>
    </i-form>
    <div class="text-center">
      <i-button type="text" size="large" @click="cancle">取消</i-button>
      <i-button class="xy-primary" size="large" @click="submit">确认</i-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AMS_CreateSite',
    data () {
      return {
        apiPath: this.apiAMS,
        domainForm: {
          domainNumber: '',
          accountName: '',
          dbName: '',
          readDB: '',
          writeDB: ''
        },
        domainValidate: {
          domainNumber: [
            { required: true, message: '站点编号不能为空', trigger: 'blur' },
            { max: 20, message: '站点编号长度不能大于20个字符', trigger: 'blur' }
          ],
          accountName: [
            { required: true, message: '站点名称不能为空', trigger: 'blur' },
            { max: 20, message: '站点名称长度不能大于20个字符', trigger: 'blur' }
          ],
          dbName: [
            { required: true, message: '数据库名称不能为空', trigger: 'blur' }
          ],
          readDB: [{ required: true, message: '读库不能为空', trigger: 'blur' }],
          writeDB: [{ required: true, message: '写库不能为空', trigger: 'blur' }]
        },
        loading: false
      }
    },
    methods: {
      // cancle
      cancle () {
        this.$emit('exit')
      // { targetID: 'XyAMS' }
      },
      // submit
      submit () {
        this.$refs.domainForm.validate(valid => {
          if (valid) {
            // this.loading = true;
            var account = {}
            account.Number = this.domainForm.domainNumber
            account.Name = this.domainForm.accountName
            account.DbName = this.domainForm.dbName
            account.Write = this.domainForm.writeDB
            account.Read = this.domainForm.readDB
            this.xy.loading()
            this.postSubmit(account)
          } else {
            return false
          }
        })
      },
      async postSubmit (account) {
        try {
          const res = await this.xy.post(
            `${this.apiPath}/api/ams/SiteInitialization`,
            account
          )
          if (res.success) {
            this.xy.msgSuc('创建成功。')
            this.cancle()
          }
        } catch (error) {
          this.xy.mError('创建失败。', error)
        }
        this.xy.unloading()
      }
    }
  }
</script>
