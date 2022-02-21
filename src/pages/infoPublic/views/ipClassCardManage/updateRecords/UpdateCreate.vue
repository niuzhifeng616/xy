<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div style="width: 500px; margin: 30px auto 0;">
        <i-form
          ref="formValidateCreate"
          :model="formValidateCreate"
          :rules="ruleValidateCreate"
        >
          <div style="position: relative; margin-bottom:24px;">
            <span class="xx">*</span>
            <form-item
              label="安装包"
              :label-width="100"
            >
              <!-- <upload
                ref="uploadImport"
                name="file"
                :format="['apk']"
                :headers="{
                  'Access-Control-Allow-Origin': '*',
                  XYTOKEN: this.xy.getCookie('.XYTOKEN')
                }"
                :on-format-error="formatError"
                :before-upload="BeforeUpload"
                :on-success="Success"
                :on-error="Error"
                :on-remove="Remove"
                :default-file-list="UploadList"
                :action="importPath"
              >
                <i-button
                  icon="ios-cloud-upload-outline"
                  @click="UpClick"
                  v-cloak
                  >{{ uploadBtn }}</i-button
                >
              </upload> -->
              <XyUpfile
                  ref="upfile"
                  :fileAccept="fileAccept"
                  :fileSize="size"
                  :showUpList="true"
                  :importPath="upUrl"
                  @UploadOk="UploadOk"
                  :upTxt="'上传安装包'"
                  >
                </XyUpfile>
            </form-item>
            <form-item label="版本号" label-for="bbh" :label-width="100" prop="noticeName">
              <i-input
                element-id="bbh"
                v-model="formValidateCreate.noticeName"
                style="ime-mode:disabled"
                clearable
              ></i-input>
            </form-item>
            <form-item label="说明" label-for="sm" :label-width="100" prop="noticeCont">
              <i-input
                element-id="sm"
                type="textarea"
                v-model="formValidateCreate.noticeCont"
                :rows="6"
                clearable
              ></i-input>
            </form-item>
          </div>
          <form-item label="" :label-width="100">
            <Button
              @click="CreateClick"
              :loading="loadingBtn"
              class="xy-btn-primary"
              shape="circle"
              >保存</Button
            >
            </form-item>
        </i-form>
      </div>
    </div>
  </div>
</template>

<script>
  import XyUpfile from '@/components/upFileOptimize/upFile.vue'
  export default {
    name: 'UpdateCreate',
    components: {
      XyUpfile
    },
    data () {
      return {
        editor: '',
        // 默认数据
        isEmpty: false, // 数据是否为空
        isInitial: true,
        loading: true,
        formValidateCreate: {
          noticeName: '',
          noticeCont: ''
        },
        ruleValidateCreate: {
          noticeName: [
            { required: true, message: '版本号不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 20,
              message: '版本号不能超过20个字',
              trigger: 'blur'
            }
          ],
          noticeCont: [
            { required: true, message: '说明不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 200,
              message: '说明不能超过1000个字',
              trigger: 'blur'
            }
          ]
        },
        // [取消/保存]按钮
        loadingBtn: false,
        // 导入设置
        modalImport: false,
        isShowSpin: false,
        importResult: {},
        typeBtn: true,
        // 上传照片
        file: null,
        fileName: '',
        fname: '',
        UploadList: [],
        PackageAddress: '',
        PackageName: '',
        importPath: '',
        uploadBtn: '上传安装包',
        apiPath: '',
        // 上传资源优化
        fileAccept: 'application/vnd.android.package-archive',
        size: 500,
        upUrl: this.$store.state.apiPath + '/api/AppVersion/UploadAppVersion ',
        imgList: []
      }
    },
    computed: {},
    created () {
      this.apiPath = this.$store.state.apiPath
      this.importPath = this.apiPath + '/api/AppVersion/UploadAppVersion'
    },
    mounted () {},
    methods: {
      UploadOk (list) {
        // 获取最终生成的需要提交的数据格式
        console.log(list)
        this.imgList = list
        this.fileName = list[0].FileName
      },
      // getViewImg (url) {
      //   this.xy.get(`${this.apiPath}/api/Resource/GetUploadNewsImageUrl?FileName=${url}`, null).then(res => {
      //     if (res.success) {
      //       this.fileName = res.data.result
      //       console.log(res)
      //     }
      //   })
      // },
      // async
      // this.xy.loading()
      //       let res = await this.xy.get(
      //         this.apiPath + `/api/Template/GetPage`
      //       )
      //       this.xy.unloading()
      //       if (res.success) {
      //       } else {
      //       this.xy.msgError(res.msg)
      //       }
      // 返回
      goBack () {
        // xy.http.load(xy.subMenuWebUrl + "/View/ipClassCardManage/UpdateRecords/PC/View/UpdateManage.html");
        this.$router.push({ path: '/xyHome/UpdateManage' })
      },
      // 确定创建
      CreateClick () {
        var _this = this
        // 验证安装包
        if (_this.fileName === '') {
          _this.xy.msgError('请上传安装包。')
          _this.changeLoading()
          return false
        }
        // 验证版本号
        if (/[\u4E00-\u9FA5]/i.test(_this.formValidateCreate.noticeName)) {
          _this.xy.msgError('版本号只允许字母、字符和数字。')
          _this.changeLoading()
          return false
        }
        _this.$refs.formValidateCreate.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.Create()
          }
        })
      },
      async Create () {
        this.xy.loading()
        let res = await this.xy.post(this.apiPath + `/api/AppVersion/Create`, {
          VersionNumber: $.trim(this.formValidateCreate.noticeName),
          VersionExplain: $.trim(this.formValidateCreate.noticeCont),
          ApplicationPackage: this.fileName
        })
        this.xy.unloading()
        if (res.success) {
          this.changeLoading()
          this.xy.msgSuc('创建成功。')
          this.$refs.formValidateCreate.resetFields()
          this.UploadList = []
          this.$router.push({ path: '/xyHome/UpdateManage' })
        // xy.http.load(xy.subMenuWebUrl + "/View/ipClassCardManage/UpdateRecords/PC/View/UpdateManage.html")
        } else {
          this.modal_loading = false
          this.xy.mError('创建失败', res.msg)
        }
      },
      // 提交创建时触发
      changeLoading () {
        var _this = this
        _this.loading = false
        _this.$nextTick(function () {
          _this.loading = true
        })
      },
      // =======导入 start===
      // 上传图片
      UpClick () {
        this.$refs.uploadImport.clearFiles()
      },
      BeforeUpload (res) {
        this.isShowSpin = false
      },
      formatError (file, fileList) {
        this.isShowSpin = false
        this.xy.msgError('文件格式不正确。')
      },
      Success (res) {
        this.isShowSpin = false
        if (res.success) {
          if (res.data == null) {
            this.xy.msgError(res.msg)
            this.UploadList = []
          } else {
            this.fileName = res.data.result
            this.PackageAddress = this.fileName.PackageAddress
            this.PackageName = this.fileName.PackageName
            this.xy.msgSuc('上传成功。')
            this.uploadBtn = '重新上传'
          }
        } else {
          this.xy.msgError(res.msg)
          this.UploadList = []
        }
        this.importResult = res.data
      },
      Error () {
        this.isShowSpin = false
        this.xy.msgError('Error！！')
      },
      // Error (error, file, fileList) {
      //   this.isShowSpin = false
      //   this.xy.msgError('Error！！')
      // },
      Remove (file, fileList) {
        this.fileName = ''
        this.PackageAddress = ''
        this.PackageName = ''
        this.uploadBtn = '上传安装包'
      }
    }
  }
</script>
<style lang="less" scoped>
.xx{
  content: "*";
  display: inline-block;
  margin-top: 4px;
  vertical-align: middle;
  color: rgb(237, 64, 20);
  position: absolute;
  left: 35px;
  font-size: 20px;
}
</style>
