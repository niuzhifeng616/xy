<template>
  <div>
    <XyUpfile
      ref="upfile"
      :fileAccept="fileAccept"
      :fileSize="size"
      :importPath="upUrl"
      @UploadOk="UploadOk"
      >
    </XyUpfile>
  </div>
</template>
<script>
  import XyUpfile from './upFile.vue'
  export default {
    name: '',
    components: {
      XyUpfile
    },
    data () {
      return {
        fileAccept: 'image/jpg, image/jpeg, image/png',
        size: 2,
        upUrl: this.$store.state.apiPath + '/api/Resource/UploadPhoto',
        upParams: {},
        templateUrl: '',
        errorUrl: ''
      }
    },
    created () {
      // 展示上传按钮
      // this.$refs['upfile'].showBtn = true
    },
    mounted () {
    },
    methods: {
      UploadOk (list) {
        // 获取最终生成的需要提交的数据格式
        console.log(list)
      }
    }
  }
</script>
<style lang="less">

</style>
