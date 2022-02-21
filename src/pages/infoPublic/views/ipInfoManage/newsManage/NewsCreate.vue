<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
      </div>
    </div>
    <div class="xy-content-body clearfix">
      <div style="width: 410px;margin: 0 auto;">
        <Form ref="formValidateCreate"
          :model="formValidateCreate"
          :rules="ruleValidateCreate"
        >
          <FormItem label="新闻类型" prop="newType" labelFor="newType" :label-width="80">
            <Select v-model="formValidateCreate.newType"
              placeholder="请选择新闻类型"
              @on-change="newTypeChange"
              elementId="newType">
              <Option v-for="item in newTypeList"
                :value="item.NewsTypeID"
                :key="item.NewsTypeID"
                v-cloak
              >{{ item.NewsTypeName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="新闻标题" prop="newTit" labelFor="newTit" :label-width="80">
            <Input v-model="formValidateCreate.newTit" elementId="newTit" clearable />
          </FormItem>
          <div style="position: relative; margin-bottom:24px;">
            <span style=" content: '*';
                display: inline-block;
                margin-top: 8px;
                vertical-align: middle;
                color: rgb(249 102 64);
                font-size: 18px;
                margin-right: 4px;">*</span>
            <FormItem label="新闻图片" style="margin:0; display: inline-block; vertical-align: top;">
              <!-- <upload
                ref="uploadImport"
                name="upfile"
                style="margin-left: 74px; position: relative; width: 323px;"
                :format="['jpg','jpeg','png','bmp']"
                :headers="{'Access-Control-Allow-Origin' : '*','XYTOKEN':this.xy.getCookie('.XYTOKEN') }"
                :on-format-error="formatError"
                :before-upload="BeforeUpload"
                :on-success="Success"
                :on-remove="Remove"
                :max-size="10240"
                :on-exceeded-size="exceededSize"
                :default-file-list="UploadList"
                :action="importPath"
              > -->
                <!-- <Button icon="ios-cloud-upload-outline" @click="UpClick">上传新闻图片</Button>
                <tooltip
                  :max-width="200"
                  placement="right-start"
                  content="注意：为了保证展示效果，建议您上传长宽比例为16:9的图片，图片最大不能超过10M。"
                >
                  <icon type="md-alert" color="#6489d4" size="20"></icon>
                </tooltip>
              </upload> -->
                <XyUpfile
                  ref="upfile"
                  :fileAccept="fileAccept"
                  :fileSize="size"
                  :importPath="upUrl"
                  @UploadOk="UploadOk"
                  :upTxt="'上传新闻图片'"
                  :showTip="true"
                  :tipTxt="'注意：为了保证展示效果，建议您上传长宽比例为16:9的图片，图片最大不能超过10M。'"
                  :tipIconStyle="{ fontSize: '20px', color: '#6489d4' }"
                  >
                </XyUpfile>

              <div style="overflow:hidden; margin-left: 74px;">
                <img
                  :src="fileName"
                  style=" width: 200px; max-height: 150px; border:1px solid #eaeaea; margin:10px 0;"
                />
              </div>
            </FormItem>
          </div>
          <div style="position: relative; margin-bottom:24px;">
            <span style=" content: '*';
                display: inline-block;
                margin-top: 8px;
                vertical-align: middle;
                color: rgb(249 102 64);
                font-size: 18px;
                margin-right: 4px;">*</span>
            <FormItem
              label="发布内容"
              style="margin:0; display: inline-block; vertical-align: middle;"
            ></FormItem>
            <div style="width:510px; left:0;">
              <div>
                <Editor ref="editor" v-model="msg" :uploadHandler="sendFile" :isCustomUplod="true" :disabled="disabled" :isUpload="true" :apiPath="apiPath" :url="importPath"/>
                <div style="margin-top:20px;">
                  <Button class="xy-primary" @click="clear">清空内容</Button>
                  <Button class="xy-danger" @click="disabled = !disabled">禁用/启用</Button>
                </div>
              </div>
            </div>
          </div>
          <FormItem label="发布时间" prop="newDate" labelFor="newDate" :label-width="80">
            <DatePicker :value="formValidateCreate.newDate"
              style="width:100%;"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择发布日期"
              @on-change="newDateChange"
              elementId="newDate"
              :editable="false"
            ></DatePicker>
          </FormItem>
          <div class="text-center">
            <Button @click="CreateClick" :loading="loadingBtn" shape="circle" class="xy-btn-primary">保存</Button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
  import XyUpfile from '@/components/upFileOptimize/upFile.vue'
  import Editor from '@/components/editor/Editor.vue'
  export default {
    name: 'NewsCreat',
    components: {
      Editor, XyUpfile
    },
    data () {
      return {
        disabled: false,
        msg: '',
        editor: '',
        // 默认数据
        isEmpty: false, // 数据是否为空
        isInitial: true,
        loading: true,

        // 新闻类型
        newTypeList: [],
        formValidateCreate: {
          newType: '',
          newTit: '',
          newDate: null
        },

        ruleValidateCreate: {
          newType: [
            {
              type: 'number',
              required: true,
              message: '类型不能为空。',
              trigger: 'change'
            }
          ],
          newTit: [
            { required: true, message: '新闻标题不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 30,
              message: '新闻标题不能超过30字符',
              trigger: 'blur'
            }
          ],
          newDate: [
            {
              type: 'array',
              required: true,
              message: '发布时间不能为空',
              trigger: 'change'
            }
          ]
        },

        // [取消/保存]按钮
        loadingBtn: false,

        // 导入设置
        modalImport: false,
        isShowSpin: false,
        // importPath: `${this.$store.state.apiPath}/api/Resource/UploadNewsImage`,
        importPath: '',
        importResult: {},
        typeBtn: true,
        // 上传照片
        file: null,
        fileName: '',
        fname: '',
        UploadList: [],
        apiPath: this.$store.state.apiPath,
        // 上传资源优化
        fileAccept: 'image/jpg, image/jpeg, image/png, image/bmp',
        size: 10,
        upUrl: this.$store.state.apiPath + '/api/Resource/UploadNewsImage',
        imgList: []
      }
    },
    created () {
      this.importPath = `${this.apiPath}/api/Resource/UploadNewsImage`
      this.GetNewsType()
    },
    mounted () {
    },
    methods: {
      UploadOk (list) {
        // 获取最终生成的需要提交的数据格式
        console.log(list)
        this.imgList = list
        this.getViewImg(list[0].FileName)
      },
      getViewImg (url) {
        this.xy.get(`${this.apiPath}/api/Resource/GetUploadNewsImageUrl?FileName=${url}`, null).then(res => {
          if (res.success) {
            this.fileName = res.data.result
            console.log(res)
          }
        })
      },
      // 富文本编辑器
      clear () {
        this.$refs.editor.clear()
      },
      sendFile (blobInfo, success, failure) {
        console.log(success)
        let upData = [{
          UploadFile: blobInfo.filename(),
          UploadFileSize: blobInfo.blob().size
        }]
        let params = {}
        params = {
          Data: upData,
          BussinessStr: ''
        }
        if (this.customParams !== null) {
          for (let key in this.customParams) {
            params[key] = this.customParams[key]
          }
        }
        this.xy.post(this.importPath, params).then(res => {
          if (res.success) {
            let file = []
            file.push(blobInfo.blob())
            this.uploadFunc(file, res.data.result.Data, success)
          }
        })
      },
      uploadFunc (filesUrls, callbackData, success) {
        let forNum = 0
        for (let i = 0, len = filesUrls.length; i < len; i++) {
          forNum++
          console.log('1111')
          console.log(filesUrls[i])
          console.log(filesUrls[i].type)
          // put中的三个参数url，data，header中的type
          this.xy.put(callbackData[i].UpLoadAddress, filesUrls[i], 'image/jpeg').then().catch(err => {
            if (err.message.indexOf('403') !== -1) {
              this.xy.msgError('服务器出错，上传失败，请联系管理员。')
              return false
            }
          })
        }
        if (forNum === filesUrls.length) {
          let dataList = []
          for (let i = 0, len = callbackData.length; i < len; i++) {
            dataList.push({
              FileName: callbackData[i].UploadFileNames,
              FileAddress: '',
              ResourceSize: filesUrls[i].size
            })
          }
          console.log(dataList)
          this.xy.get(`${this.apiPath}/api/Resource/GetUploadNewsImageUrl?FileName=${dataList[0].FileName}`, null).then(res => {
            if (res.success) {
              // this.fileName = res.data.result
              success(res.data.result)
              console.log(this.msg)
            }
          })
        }
      },
      // 返回
      ReturnBtn: function () {
        this.$router.back()
      },

      // 选择新闻类型下拉框
      GetNewsType: function () {
        // this.xy.loading()
        let _this = this
        this.xy
          .get(`${this.apiPath}/api/Resource/GetNewsType`, null)
          .then(res => {
            if (res.success) {
              _this.newTypeList = res.data
            } else {
              // xy.message.error(_this, { content: res.data.msg })
              // _this.xy.mError(_this, { content: res.msg })
              _this.xy.msgError(res.msg)
            }
            _this.xy.unloading()
          })
      },

      // 确定创建
      CreateClick () {
        let str = this.fileName
        let index = str.lastIndexOf('/')
        this.fname = str.substring(index + 1, str.length)
        if (this.fname === '') {
          // xy.message.error(_this, '请上传新闻照片')
          this.xy.msgError('请上传新闻照片。')
          this.changeLoading()
          return false
        }
        if (this.msg === '') {
          this.xy.msgError('请填写发布内容。')
          this.changeLoading()
          return false
        }
        // let cont = $($('#summernote').val()).html()
        // console.log(cont)
        // var contHtml = cont.replace(/<[^>]+>/g, '') // 截取Html标签
        // var contNbsp = contHtml.replace(/&nbsp;/gi, '') // 截取空格等特殊标签
        if (this.msg.length > 2000) {
          // xy.message.error(_this, '发布内容不允许超过2000字')
          this.xy.msgError('发布内容不允许超过2000字。')
          this.changeLoading()
          return false
        }

        this.$refs.formValidateCreate.validate(valid => {
          if (!valid) {
            return this.changeLoading()
          } else {
            this.xy.post(`${this.apiPath}/api/Resource/CreateNews`, {
              HostName: this.$store.state.apiPath,
              NewsTypeID: Number($.trim(this.formValidateCreate.newType)),
              NewsTitle: $.trim(this.formValidateCreate.newTit),
              FileName: this.fname,
              NewsContent: this.msg,
              StartDate: this.formValidateCreate.newDate[0],
              EndDate: this.formValidateCreate.newDate[1]
            })
              .then(res => {
                if (res.success) {
                  this.changeLoading()
                  this.xy.msgSuc('创建成功。')
                  this.$refs.formValidateCreate.resetFields()
                  this.UploadList = []
                  this.msg = ''
                  this.$router.back()
                } else {
                  this.modal_loading = false
                  this.xy.mError(res.msg)
                }
              })
          }
        })
      },

      // 修改新闻类型
      newTypeChange: function (val) {
        let _this = this
        _this.formValidateCreate.newType = val
      },

      // 获取发布时间
      newDateChange: function (val) {
        let _this = this
        _this.formValidateCreate.newDate = val
      },

      // 提交创建时触发
      changeLoading: function () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },

      //= ======导入 start===
      // 上传图片
      UpClick: function () {
        let _this = this
        _this.$refs.uploadImport.clearFiles()
      },
      BeforeUpload: function (res) {
        let _this = this
        _this.isShowSpin = false
      },
      formatError: function (file, fileList) {
        this.isShowSpin = false
        // xy.message.error(this, '文件格式不正确！')
        this.xy.msgError('文件格式不正确。')
      },
      Success: function (res) {
        let _this = this
        this.isShowSpin = false
        if (res.success) {
          if (res.data == null) {
            // xy.message.error(_this, { content: res.msg })
            _this.xy.msgError(res.msg)
            _this.UploadList = []
          } else {
            _this.fileName = this.$store.state.apiPath + res.data.result
          // xy.message.success(_this, '上传成功！');
          }
        } else {
          // xy.message.error(_this, { content: res.msg })
          _this.xy.msgError(res.msg)
          _this.UploadList = []
        }
        _this.importResult = res.data
      },
      // Error: function (error, file, fileList) {
      //   this.isShowSpin = false
      //   xy.message.error(this, 'Error！')
      // },
      Remove: function (file, fileList) {
        let _this = this
        _this.fileName = ''
      },
      exceededSize: function (file) {
        let _this = this
        _this.isShowSpin = false
        _this.modal_loading = false
        // MainVue.$Modal.error({ title: '文件大小超限', content: '文件  ' + file.name + ' 太大，上传文件大小不能超过10M。' })
        _this.xy.msgError(
          '文件大小超限',
          '文件  ' + file.name + ' 太大，上传文件大小不能超过10M。'
        )
      }
    }
  }
</script>
<style lang="less" scoped>
.NewsImg p img {
  display: block;
}
</style>
