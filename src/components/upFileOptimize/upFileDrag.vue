<template>
  <!-- 上传按钮（上传图片，视频，压缩包等使用） -->
  <div class="bg-main" id="ModalImportFile">
    <a-upload-dragger
      :accept="fileAccept"
      :importPath="importPath"
      :multiple="isMultiple"
      :fileSize="fileSize"
      :show-upload-list="showUpList"
      :before-upload="beforeUpload"
      :fileList="fileList"
      :customParams="customParams"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="cloud-upload" />
      </p>
      <p class="ant-upload-text">
        {{upTxt}}
      </p>
    </a-upload-dragger>
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
      upTxt: {
        type: String,
        default: '点击上传或拖拽文件上传'
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
    created () {
    },
    mounted () {
      console.log(this.importPath)
    },
    methods: {
      // 上传文件之前的钩子
      beforeUpload (file, fileList) {
        console.log(file)
        if (file.name === fileList[0].name) {
          this.fileArr = fileList
          this.customRequest(this.fileArr)
        }
        // const isJpgOrPng = this.fileAccept.indexOf(file.type) !== -1
        // console.log(isJpgOrPng)
        // if (!isJpgOrPng) {
        //   this.$message.error('文件类型仅支持' + this.fileAccept + '。')
        // }
        const isLt2M = file.size / 1024 / 1024 < this.fileSize
        if (!isLt2M) {
          this.$message.error('文件大小不能超过' + this.fileSize + 'MB。')
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
        // 上传成功触发：list 需要提交的数据格式
        this.$emit('UploadOk', list)
      }
    }
  }
</script>
<style lang="less" scoped>
.bg-main{
  height: 100%;
}
</style>
