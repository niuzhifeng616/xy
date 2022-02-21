<template>
  <!-- 上传按钮（上传图片，视频，压缩包等使用） -->
  <div class="bg-main" id="ModalImportFile">
    <a-upload
      :accept="fileAccept"
      :importPath="importPath"
      :multiple="isMultiple"
      :fileSize="fileSize"
      :show-upload-list="showUpList"
      :before-upload="beforeUpload"
      :fileList="fileList"
      :customParams="customParams"
    >
      <!-- 上传按钮样式配置参照Ant Design Vue: Button使用方法。 -->
      <a-button v-if="!showTxt" :type="btnType"><a-icon type="cloud-upload" />{{upTxt}}</a-button>
      <a v-if="showTxt"><a-icon type="plus" style="margin-right:5px" />{{upTxt}}</a>
    </a-upload>
     <a-tooltip v-if="showTip" style="margin-left:10px" :placement="placement">
        <template slot="title">
          <span>{{tipTxt}}</span>
        </template>
        <a-icon :style="tipIconStyle" type="exclamation-circle" />
      </a-tooltip>
  </div>
</template>
<script>
  export default {
    props: {
      // 是否多选
      isMultiple: {
        type: Boolean,
        default: true
      },
      //  上传地址
      importPath: {
        type: String
      },
      fileAccept: {
        type: String,
        default: ''
      },
      //  文件大小限制，单位 m
      fileSize: {
        type: Number,
        default: 2
      },
      // 上传按钮样式
      btnType: {
        type: String,
        default: ''
      },
      // 是否显示已上传文件列表
      showUpList: {
        type: Boolean,
        default: false
      },
      // 提示语前缀
      msgErr: {
        type: String,
        default: '图片'
      },
      // 上传按钮的文字描述
      upTxt: {
        type: String,
        default: '上传'
      },
      // 提示语是否展示
      showTip: {
        type: Boolean,
        default: false
      },
      // 提示语出现方向
      placement: {
        type: String,
        default: 'rightTop'
      },
      // 提示语文字
      tipTxt: {
        type: String,
        default: 'prompt text'
      },
      // 提示语的提示图标样式
      tipIconStyle: {
        type: Object
      },
      // 文字按钮
      showTxt: {
        type: Boolean,
        default: false
      },
      customParams: {
        type: Object,
        defalut: null
      }
    },
    name: 'XyUpfile',
    data () {
      return {
        fileList: [],
        fileArr: []
      }
    },
    created () {
    },
    mounted () {
      console.log(this.importPath)
    },
    watch: {
      customParams (newVal) {
        console.log(newVal)
        this.customParams = newVal
      },
      fileList (newVal) {
        console.log(newVal)
        this.fileList = newVal
      }
    },
    methods: {
      // 上传文件之前的钩子
      beforeUpload (file, fileList) {
        console.log(file, fileList)
        if (file.name === fileList[0].name) {
          this.fileArr = fileList
          this.customRequest(this.fileArr)
        }
        const isJpgOrPng = this.fileAccept.indexOf(file.type) !== -1
        console.log(isJpgOrPng)
        if (!isJpgOrPng) {
          this.$message.error('文件类型仅支持' + this.fileAccept + '。')
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < this.fileSize
        if (!isLt2M) {
          this.$message.error('文件大小不能超过' + this.fileSize + 'MB。')
          return false
        }
        return isLt2M
      },
      // 自定义上传事件
      customRequest (files) {
        let upData = []
        for (let item of files) {
          upData.push({
            UploadFile: item.name,
            UploadFileSize: item.size
          })
        }
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
        this.fileList = []
        let that = this
        for (let item of files) {
          that.fileList.push({
            name: item.name,
            status: 'done',
            uid: '',
            url: 'http://www.baidu.com/yyy.png'
          })
        }
        console.log(this.fileList)
        this.xy.post(this.importPath, params).then(res => {
          if (res.success) {
            this.uploadFunc(files, res.data.result.Data)
          }
        })
      },
      uploadFunc (filesUrls, callbackData) {
        console.log(filesUrls, callbackData)
        let forNum = 0
        for (let i = 0, len = filesUrls.length; i < len; i++) {
          // put中的三个参数url，data，header中的type
          this.xy.put(callbackData[i].UpLoadAddress, filesUrls[i], `${filesUrls[i].type}`).then(res => {
            forNum++
            if (forNum === filesUrls.length) {
              let dataList = []
              for (let i = 0, len = callbackData.length; i < len; i++) {
                dataList.push({
                  FileName: callbackData[i].UploadFileNames,
                  FileAddress: '',
                  ResourceSize: filesUrls[i].size
                })
              }
              this.UploadOk(dataList)// 保存数据(最终生成的需要提交的数据格式)
            }
          }).catch(err => {
            if (err.message.indexOf('403') !== -1) {
              this.xy.msgError('服务器出错，上传失败，请联系管理员。')
              return false
            }
          })
        }
      },
      UploadOk (list) {
        // list 需要提交的数据格式
        this.$emit('UploadOk', list)
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
