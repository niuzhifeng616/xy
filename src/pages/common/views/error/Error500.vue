<template>
  <div class="error">
    <img :src="require('@/assets/common/error500.png')" alt="">
    <div class="content">
      <div class="text">哎呀，当前服务器出错了~</div>
      <div class="btn">
        <Button class="xy-btn-error-close" @click="close">返回</Button>
        <Button class="xy-btn-primary" shape="circle" v-if="isClient!==1" @click="submit">重新登录</Button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Error500',
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
      close () {
        this.$router.go(-1)
      },
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
        margin-bottom:50px;
        font-size: 16px;
        color:rgba(0,0,0,0.45);
      }
    }
  }
</style>
