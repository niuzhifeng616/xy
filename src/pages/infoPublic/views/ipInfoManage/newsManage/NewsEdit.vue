<template>
  <div class="xy-content-module">
    <div class="xy-content-body clearfix">
      <div v-if="isInitial" class="no-data-box isInitital-opacity" v-cloak>
        <img class="no-data-img" src="@/assets/common/loading.png" />
      </div>
      <div v-else style="width: 410px;margin: 0 auto;" v-cloak>
        <Form ref="formValidateCreate"
          :model="formValidateCreate"
          :rules="ruleValidateCreate"
        >
          <FormItem label="新闻类型" prop="newType" labelFor="newType" :label-width="80">
            <Select v-model="formValidateCreate.newType" @on-change="newTypeChange" elementId="newType">
              <Option v-for="item in newTypeList"
                :value="item.NewsTypeID"
                :key="item.NewsTypeID"
                v-cloak
              >{{ item.NewsTypeName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="新闻标题" prop="newTit" labelFor="newTit" :label-width="80">
            <Input v-model="formValidateCreate.newTit" clearable elementId="newTit" />
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
              <!-- <upload ref="uploadImport"
                name="upfile"
                style="margin-left: 74px; position: relative; width: 323px;"
                :format="['jpg','jpeg','png','bmp']"
                :headers="{'Access-Control-Allow-Origin' : '*','XYTOKEN':xy.getCookie('.XYTOKEN') }"
                :on-format-error="formatError"
                :before-upload="BeforeUpload"
                :on-success="Success"
                :on-remove="Remove"
                :max-size="10240"
                :on-exceeded-size="exceededSize"
                :default-file-list="UploadList"
                :action="importPath"
              >
                <Button icon="ios-cloud-upload-outline" @click="UpClick">上传新闻图片</Button>
                <tooltip :max-width="200"
                  placement="right-start"
                  content="注意：为了保证展示效果，建议您上传长款比例为16:9的图片，图片最大不能超过10M之间。"
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
                <img :src="newsImageLink?newsImageLink:''"
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
            <FormItem label="发布内容"
              style="margin:0; display: inline-block; vertical-align: middle;"
            ></FormItem>
            <div style="width:510px; left:0;">
              <div>
                <Editor ref="editor" v-model="msg" :uploadHandler="sendFile" :isCustomUplod="true" :disabled="disabled" :isUpload="true" :apiPath="apiPath" :url="importPath"/>
                <!-- <Editor ref="editor" v-model="msg" :disabled="disabled" :isUpload="true" :apiPath="apiPath" :url="importPath" /> -->
                <div style="margin-top:20px;">
                  <Button class="xy-primary" @click="clear">清空内容</Button>
                  <Button class="xy-danger" @click="disabled = !disabled">禁用/启用</Button>
                </div>
              </div>
            </div>
          </div>
          <FormItem label="发布时间" prop="newDate" labelFor="newDate" :label-width="80">
            <DatePicker
              :value="formValidateCreate.newDate"
              style="width:100%;"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择发布日期"
              @on-change="newDateChange"
              :editable="false"
              elementId="newDate"
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
    name: 'NewsEdit',
    components: {
      Editor, XyUpfile
    },
    data () {
      return {
        // 默认数据
        isEmpty: false, // 数据是否为空
        isInitial: false,
        loading: true,
        disabled: false,
        msg: '',
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
              message: '类型不能为空',
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
        newsImageLink: '',
        StartDate: '',
        EndDate: '',
        NewsContent: '',
        resourceID: '',
        // [取消/保存]按钮
        loadingBtn: false,
        // 导入设置
        modalImport: false,
        isShowSpin: false,
        importPath: '',
        importResult: {},
        typeBtn: true,
        // 上传照片
        file: null,
        fileName: '',
        fname: '',
        UploadList: [],
        // 上传资源优化
        fileAccept: 'image/jpg, image/jpeg, image/png, image/bmp',
        size: 10,
        upUrl: this.$store.state.apiPath + '/api/Resource/UploadNewsImage',
        imgList: []
      }
    },
    computed: {
      apiPath () {
        return this.$store.state.apiPath
      }
    },
    created () {
      this.GetNewsType()
    },
    mounted () {},
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
            this.newsImageLink = res.data.result
            console.log(res)
          }
        })
      },
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
      // 选择新闻类型下拉框
      GetNewsType () {
        this.importPath = `${this.$store.state.apiPath}/api/Resource/UploadNewsImage`
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/Resource/GetNewsType`, null).then(res => {
          if (res.success) {
            this.newTypeList = res.data
            this.getNewsByID()
          } else {
            this.xy.msgError(res.msg)
          }
          this.xy.unloading()
        })
      },
      getNewsByID () {
        this.xy.get(`${this.$store.state.apiPath}/api/Resource/GetNewsByID`, {
          ID: this.$route.query.resourceID,
          HostName: this.$store.state.apiPath
        }).then(res => {
          if (res.success) {
            this.resourceID = res.data.resourceID
            this.formValidateCreate.newType = res.data.NewsTypeID
            this.formValidateCreate.newTit = res.data.NewsTitle
            this.newsImageLink = res.data.NewsImageLink
            this.StartDate = res.data.StartDate
            this.EndDate = res.data.EndDate
            this.formValidateCreate.newDate = [this.StartDate, this.EndDate]
            this.NewsContent = res.data.NewsContent
            this.msg = res.data.NewsContent
            this.fileName = res.data.FileName
          } else {
            this.xy.msgError(res.msg)
          }
          this.xy.unloading()
        })
      },
      // 确定编辑
      CreateClick () {
        let str = this.newsImageLink
        let index = str.lastIndexOf('/')
        this.fname = str.substring(index + 1, str.length)
        if (this.fname === '') {
          this.xy.msgError('请上传新闻照片。')
          this.changeLoading()
          return false
        }
        if (this.msg === '') {
          this.xy.msgError('请填写发布内容。')
          this.changeLoading()
          return false
        }
        if (this.msg.length > 2000) {
          this.xy.msgError('发布内容不允许超过2000字。')
          this.changeLoading()
          return false
        }
        this.$refs.formValidateCreate.validate((valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            this.xy
              .post(`${this.$store.state.apiPath}/api/Resource/EditNews`, {
                HostName: this.$store.state.apiPath,
                NewsTypeID: Number($.trim(this.formValidateCreate.newType)),
                NewsTitle: $.trim(this.formValidateCreate.newTit),
                FileName: this.fname,
                NewsContent: this.msg,
                StartDate: this.formValidateCreate.newDate[0],
                EndDate: this.formValidateCreate.newDate[1],
                resourceID: this.resourceID
              })
              .then(res => {
                if (res.success) {
                  this.xy.msgSuc('编辑成功。')
                  this.$refs.formValidateCreate.resetFields()
                  this.UploadList = []
                  this.$router.back()
                } else {
                  this.modal_loading = false
                  this.xy.msgError(res.msg)
                }
              })
          }
        })
      },
      // 修改新闻类型
      newTypeChange (val) {
        this.formValidateCreate.newType = val
      },

      // 获取发布时间
      newDateChange (val) {
        if (val[0] === '' && val[1] === '') {
          this.formValidateCreate.newDate = null
        } else {
          this.formValidateCreate.newDate = val
        }
        console.log(this.formValidateCreate.newDate)
      },

      // 提交创建时触发
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },

      //= ======导入 start===
      // 上传图片
      UpClick () {
        this.$refs.uploadImport.clearFiles()
      },
      BeforeUpload (res) {
        this.isShowSpin = true
      },
      formatError (file, fileList) {
        this.isShowSpin = false
        this.xy.msgError(this, '文件格式不正确。')
      },
      Success (res) {
        this.isShowSpin = false
        if (res.success) {
          if (res.data == null) {
            this.xy.msgError(res.msg)
            this.UploadList = []
          } else {
            this.newsImageLink = res.data.result
          }
        } else {
          this.xy.msgError(res.msg)
          this.UploadList = []
        }
        this.importResult = res.data
      },
      Remove (file, fileList) {
        this.fileName = ''
        this.newsImageLink = ''
      },
      exceededSize (file) {
        this.isShowSpin = false
        this.modal_loading = false
        this.xy.msgError('文件  ' + file.name + ' 太大，上传文件大小不能超过10M。')
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
