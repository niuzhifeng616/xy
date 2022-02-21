<template>
  <div>
    <XyUpfile
    ref="upfile"
    :modalTitle="title"
    :describeData="tipData"
    :fileFormt="formtData"
    :fileSize="size"
    :importPath="upUrl"
    :paramsData="upParams"
    :templateUrl="templateUrl"
    :errorUrl="errorUrl"
    >
    </XyUpfile>
  </div>
</template>
<script>
  import XyUpfile from './XyUpfile.vue'
  export default {
    name: '',
    components: {
      XyUpfile
    },
    data () {
      return {
        title: '上传demo',
        tipData: ['提示语句'],
        formtData: ['txt'],
        size: 1024,
        upUrl: '//jsonplaceholder.typicode.com/posts/',
        upParams: {},
        templateUrl: '',
        errorUrl: ''
      }
    },
    methods: {
      // 显示上传组件框方法执行下一行
      // this.$refs['upfile'].modalImport = true
    }
  }
</script>
<style lang="less">

</style>
