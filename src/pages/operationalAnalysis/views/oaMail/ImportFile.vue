<!-- 上传图片 -->
<template>
  <div class="">
   <upload
      ref="uploadImport"
      type="drag"
      name="upfile"
      :show-upload-list="showUploadList"
      :headers="{
        'Access-Control-Allow-Origin': '*',
        XYTOKEN: xy.getCookie('.XYTOKEN')
      }"
      :format="fileFormt"
      :accept="fileAccept"
      :max-size="fileSize"
      :on-format-error="formatError"
      :on-exceeded-size="sizeError"
      :before-upload="beforeUpload"
      :on-success="success"
      :on-error="error"
      :multiple="multiple"
      :action="importPath"
    >
      <div style="padding: 20px 0">
        <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>
        <p>点击上传或拖拽文件上传</p>
      </div>
    </upload>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        uploadList: [],
        isShowSpin: false,
        showUploadList: true, // 是否显示上传文件列表
        // importPath: '', // 上传文件url
        // errorUrl: '', // 下载错误文件url
        // templateUrl: '', // 模板下载url
        // fileFormt: [], // 支持的文件类型
        // fileAccept: '', // 接受上传的文件类型
        // fileSize: '', // 文件大小限制，单位 kb
        importResult: {}
        // photoList: [],
        // multiple: false
      }
    },
    props: {
      photoList: {
        type: Array,
        default: () => [],
        required: false
      },
      importPath: {
        type: String,
        default: ''
      },
      errorUrl: {
        type: String,
        default: ''
      },
      templateUrl: {
        type: String,
        default: ''
      },
      fileFormt: {
        type: Array,
        default: () => []
      },
      fileAccept: {
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      fileSize: {
        type: Number,
        default: 1024
      },
      // callback
      modalSubmit: {
        default: undefined
      }
    },
    mounted: function () {
      var that = this
      this.uploadList = this.$refs.uploadImport.fileList
      that.$nextTick(function () {
        // that.photoList = this.params.photoList || []
        // that.importPath = this.param.importPath// 上传文件url
        // that.errorUrl = this.params.errorUrl// 下载错误文件url
        // that.templateUrl = this.params.templateUrl// 模板下载url
        // that.fileFormt = this.params.fileFormt// 支持的文件类型
        // if (this.params.fileAccept !== undefined && this.params.fileAccept !== '') {
        //   that.fileAccept = this.params.fileAccept// 接受上传的文件类型
        // }
        // if (this.params.multiple !== undefined && this.params.multiple !== '') {
        //   that.multiple = this.params.multiple// 是否支持多图上传
        // }
        if (this.fileSize !== undefined && this.fileSize !== '') {
          that.fileSize = this.fileSize// 文件大小限制，单位 kb
        } else {
          if (that.fileFormt.indexOf('image') !== -1 ||
            that.fileFormt.indexOf('jpeg') !== -1 ||
            that.fileFormt.indexOf('jpg') !== -1 ||
            that.fileFormt.indexOf('png') !== -1) { // 图片
            that.fileSize = 1024
          };
          if (that.fileFormt.indexOf('mp4') !== -1 ||
            that.fileFormt.indexOf('ogg') !== -1) { // 视频、音频
            that.fileSize = 1024
          };
          if (that.fileFormt.indexOf('xls') !== -1 ||
            that.fileFormt.indexOf('xlsx') !== -1 ||
            that.fileFormt.indexOf('xml') !== -1 ||
            that.fileFormt.indexOf('xlc') !== -1 ||
            that.fileFormt.indexOf('doc') !== -1 ||
            that.fileFormt.indexOf('dot') !== -1 ||
            that.fileFormt.indexOf('ppt') !== -1 ||
            that.fileFormt.indexOf('wps') !== -1) { // 文档
            that.fileSize = 1024
          };
        }

        that.ImportClick()
      })
    },
    methods: {
      ImportClick: function () {
        this.$refs.uploadImport.clearFiles()
      },

      DownloadTemplate: function () { // 下载模板
        this.xy.downFile(this.templateUrl)
      },
      DownloadErrorInfo: function () { // 下载错误信息
        this.xy.downFile(this.errorUrl + '?file=' + this.importResult.efile)
      },
      beforeUpload: function (res) {
        this.isShowSpin = true
      },

      formatError: function (file, fileList) { // 文件格式验证失败时
        this.isShowSpin = false
        this.xy.msgError('文件格式不正确！')
      },
      sizeError: function () { // 文件超出指定大小限制时
        this.isShowSpin = false

        this.xy.msgError('文件超出' + (this.fileSize / 1024) + 'M大小限制！')
      },
      success: function (res) {
        var _this = this
        this.isShowSpin = false
        _this.importResult = res.data
        if (res.success) {
          _this.photoList = _this.photoList.concat(_this.importResult.result)
          _this.showUploadList = true// 显示上传文件列表
          if (_this.modalSubmit !== undefined) { // callback
            _this.modalSubmit()
          }
          this.xy.msgSuc('成功！')
        } else if (res.errorcode === 'rowError') {
          _this.showUploadList = false// 显示上传文件列表
        } else if (res.errorcode === 'fileError') {
          _this.showUploadList = false// 显示上传文件列表
          this.xy.msgError(res.msg)
        } else if (res.errorcode === 'taskError' || res.errorcode === 'mscorlib' || (typeof (res.data)) === 'string') {
          // 导入异常了
          _this.showUploadList = false// 显示上传文件列表
          this.xy.msgError(res.msg)
        } else {
          if (res.data != null && res.data !== '') {
            _this.isShowUpload = false// 是否展示上传控件
          } else {
            _this.isShowUpload = true// 是否展示上传控件
            this.xy.msgError(res.msg)
          }
          _this.uploadSuccess = false// 上传成功展示的样式
          _this.showUploadList = false// 显示上传文件列表
        }
      },
      error: function () {
        this.isShowSpin = false
        this.xy.msgError('Error！')
      }
    }
  }
</script>
<style lang="less" scoped></style>
