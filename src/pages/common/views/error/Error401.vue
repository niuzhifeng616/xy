<template>
  <div class="error">
    <img :src="require('@/assets/common/error401.png')" alt="">
    <div class="content">
      <div class="text">抱歉，您的账户已在其他设备登录或账户权限已过期，请重新登录</div>
      <Button class="xy-btn-primary" shape="circle" v-if="isClient!== 1" @click="submit">重新登录</Button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Error401',
    data () {
      return {
        isClient: 0
      }
    },
    created () {
      if (this.xy.getCookie('isClient') !== undefined) {
        this.isClient = Number(this.xy.getCookie('isClient'))
      }
      this.xy.unloading()
    },
    methods: {
      submit () {
        this.xy.removeCookie('.XYTOKEN')
        this.$router.replace({ path: '/login' })
      }
    }
  }
</script>
<style lang="less" scoped>
  .error{
    background: #fff;
    text-align: center;
    padding-top: 120px;
    height: 100%;
    img{
      width:991px;
      margin-bottom:50px;
    }
    .content{
      .text{
        margin-top:10px;
        margin-bottom:20px;
        font-size: 16px;
        color:rgba(0,0,0,0.45);
      }
    }
  }
</style>
