<template>
  <div class="box xy-flex xy-center xy-just-center" style="justify-content: center">
    <img :src="require('@/assets/evaluate/no-data.png')"/><p v-text="tip"></p>
  </div>
</template>
<script>
  export default {
    name: 'noData',
    props: {
      tip: {
        type: String,
        required: false,
        default: '暂无数据'
      }
    }
  }
</script>
<style lang="less" scoped>
  .box {
    width: 100%;
    height: 60%;
    img {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
    // min-height: 300px;
    p {
      font-size: 16px;
      color: #999;
      font-weight: bold;
    }
  }
</style>
