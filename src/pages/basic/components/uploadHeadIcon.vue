<template>
  <!-- 基础数据上传头像 -->
  <div class="bg-main" id="ModalImportFile">
    <a-upload-dragger
          ref="uploadEditIcon"
          accept="image/jpg, image/jpeg, image/png"
          :show-upload-list="false"
          :fileSize="fileSize"
          :importPath="importPath"
          :before-upload="beforeUpload"
          :customRequest="customRequest">
        <p class="ant-upload-drag-icon">
          <a-icon type="cloud-upload" />
        </p>
        <p class="ant-upload-text">点击此处更新头像</p>
    </a-upload-dragger>
  </div>
</template>
<script>
  export default {
    props: {
      //  文件大小限制，单位 M
      fileSize: {
        type: Number,
        default: 2
      },
      // 用户id
      personId: {
        type: Number,
        personId: 0
      }
    },
    name: 'UploadHeadIcon',
    data () {
      return {
        importPath: `${this.$store.state.apiPath}/api/Users/GetUserIconPutUrl`
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      // 上传文件之前的钩子
      beforeUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < this.fileSize
        if (!isLt2M) {
          this.$message.error('您上传的头像不能超过' + this.fileSize + 'M。')
        }
        return isLt2M
      },
      // 自定义上传事件--获取上传路径
      customRequest (file) {
        this.xy.get(`${this.$store.state.apiPath}/api/Users/GetUserIconPutUrl`, {
          userId: this.personId,
          fileName: file.file.name
        }).then(res => {
          if (res.success) {
            this.uploadFunc(res.data, file.file)
          }
        })
      },
      // put资源
      uploadFunc (data, files) {
        this.xy.put(data.PutUrl, files, `${files.type}`).then(res => {
          this.submitIcon(data)
        }).catch(err => {
          if (err.message.indexOf('403') !== -1) {
            this.xy.msgError('服务器出错，上传失败，请联系管理员。')
            return false
          }
        })
      },
      // 上传资源
      submitIcon (urldata) {
        this.xy.post(`${this.$store.state.apiPath}/api/Users/UpdateUserIcon`, {
          UserId: this.personId,
          PutUrl: urldata.PutUrl
        }, true).then(res => {
          if (res.success) {
            this.xy.msgSuc('文件上传成功。')
            this.$emit('uploadOk', res.data.Icon)
          } else {
            this.xy.msgError('失败。')
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.bg-main{
  height: 100%;
}
</style>
