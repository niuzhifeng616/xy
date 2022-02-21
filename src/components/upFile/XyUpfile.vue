<template>
  <div class="bg-main" id="ModalImportFile">
    <modal
      v-model="modalImport"
      :title="modalTitle!==''?modalTitle:'上传文件'"
      :transfer="false"
      :closable="true"
      :mask-closable="false"
      @on-visible-change="modalChange">
        <div v-if="describeData" style="margin-bottom:10px">
          <p v-for="(describe,index) in describeData" :key="index" v-cloak>{{describe}}</p>
        </div>
        <div v-show="!isShowUpload">
          <div id="uploadSuccess" v-if="uploadSuccess">
            <i class="ivu-icon ivu-icon-ios-checkmark-circle-outline" style=""></i>上传成功
            <span v-if="importResult !== null && importResult !==''" v-cloak>成功：{{importResult.scount}}，失败：{{importResult.ecount}}</span>
          </div>
          <div id="uploadFail" v-if="!uploadSuccess">
            <i class="ivu-icon ivu-icon-ios-close-circle-outline"></i>
            上传失败,<a @click="DownloadErrorInfo" v-if="importResult !== null && importResult !==''">请点击下载错误信息</a>
            <span v-if="importResult !== null && importResult !==''" v-cloak>成功：{{importResult.scount}}，失败：{{importResult.ecount}}</span>
          </div>
        </div>
        <div style="text-align:center">
          <upload
            ref="uploadImport"
            v-show="isShowUpload && !isShowSpin"
            type="drag"
            name="upfile" :multiple="isMultiple"
            :show-upload-list="showUploadList"
            :headers="{'Access-Control-Allow-Origin' : '*','XYTOKEN': XYcookie }"
            :format="fileFormt"  :accept="fileAccept"
            :max-size="fileSize"
            :on-format-error="formatError"
            :on-exceeded-size="sizeError"
            :before-upload="beforeUpload"
            :on-success="success"
            :data="paramsData"
            :on-error="error"
            :action="importPath">
            <div style="padding: 20px 0">
              <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>
              <p>点击上传或拖拽文件上传</p>
            </div>
          </upload>
        </div>
        <div slot="footer" v-show="isShowUpload">
          <Button class="xy-modal-primary" shape="circle" @click="DownloadTemplate">下载模板</Button>
        </div>
        <div v-if="isShowSpin" style="min-height:115px;">
          <spin fix>上传中...</spin>
        </div>
    </modal>
  </div>
</template>
<script>
  export default {
    props: {
      // 上传弹框名称
      modalTitle: {
        type: String,
        default: ''
      },
      // 是否多选
      isMultiple: {
        type: Boolean,
        default: true
        // true：不支持多选文件，false：支持多选文件
      },
      //  上传地址
      importPath: {
        type: String,
        default: '//jsonplaceholder.typicode.com/posts/'
      },
      //  下载错误文件url
      errorUrl: {
        type: String,
        default: '//jsonplaceholder.typicode.com/posts/'
      },
      //  模板下载url
      templateUrl: {
        type: String,
        default: ' //jsonplaceholder.typicode.com/posts/'
      },
      //  支持的文件类型格式
      fileFormt: {
        type: Array
      },
      fileAccept: {
        type: String,
        default: ''
      },
      //  文件大小限制，单位 kb
      fileSize: {
        type: Number,
        default: 4000
      },
      //  接受上传的文件类型
      filfileAccepteFormt: {
        type: String,
        default: ''
      },
      //  描述语句
      describeData: {
        type: Array,
        default: null
      },
      // 上传参数
      paramsData: {
        type: Object,
        default: null
      }
    },
    name: 'XyUpfile',
    data () {
      return {
        XYcookie: this.xy.getCookie('.XYTOKEN'),
        modalImport: false,
        isShowSpin: false,
        isShowUpload: true,
        uploadSuccess: false, //  上传成功
        showUploadList: true, //  是否显示上传文件列表
        importResult: {},
        importResultAll: {},
        xyCookie: ''
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      DownloadTemplate () { //  下载模板
        this.xy.downFile(this.templateUrl)
      },
      DownloadErrorInfo () {
        this.xy.downFile(`${this.errorUrl}` + '?file=' + this.importResult.efile)
      },
      modalChange (status) {
        if (status) {
          this.isShowUpload = true
          this.uploadSuccess = false
        }
      },
      beforeUpload (res) {
        this.isShowSpin = true
      },
      formatError (file, fileList) { // 文件格式验证失败时
        this.isShowSpin = false
        this.xy.msgError('文件格式不正确！')
      },
      sizeError () { // 文件超出指定大小限制时
        this.isShowSpin = false
        this.$refs.uploadImport.clearFiles()
        this.xy.msgError('文件超出' + this.fileSize + 'kb大小限制！')
      },
      success (res) {
        this.importResult = res.data
        this.importResultAll = res
        this.isShowSpin = false
        this.$refs.uploadImport.clearFiles()
        if (res.success) {
          this.isShowUpload = false // 是否展示上传控件
          this.uploadSuccess = true // 上传成功展示的样式
          this.showUploadList = true // 显示上传文件列表
          this.$emit('successLoad')
          this.xy.msgSuc('成功！')
          this.modalImport = false
          this.isShowUpload = true
        } else if (res.errorcode === 'rowError') {
          if (res.data !== null && res.data !== '') {
            if (res.data.scount > 0) {
              this.$emit('successLoad')
            }
          }
          this.isShowUpload = false // 是否展示上传控件
          this.uploadSuccess = false // 上传成功展示的样式
          this.showUploadList = false // 显示上传文件列表
        } else if (res.errorcode === 'fileError') {
          this.isShowUpload = true // 是否展示上传控件
          this.showUploadList = false // 显示上传文件列表
          this.xy.msgError(res.msg)
        } else if (res.errorcode === 'taskError' || res.errorcode === 'mscorlib' || (typeof (res.data)) === 'string') {
          // 导入异常了
          this.isShowUpload = false // 是否展示上传控件
          this.showUploadList = false // 显示上传文件列表
        } else {
          this.uploadSuccess = false // 上传成功展示的样式
          this.showUploadList = false // 显示上传文件列表
        }
      },
      error (file, fileList) {
        this.isShowSpin = false
        this.xy.msgError('Error！')
        this.$refs.uploadImport.clearFiles()
      }
    }
  }
</script>
<style lang="less" scoped>
.ivu-modal-header{
  border-bottom:0;
}
.ivu-modal-footer {
    border-top: 0;
    padding: 12px 18px 12px 18px;
    text-align: center;
}
</style>
