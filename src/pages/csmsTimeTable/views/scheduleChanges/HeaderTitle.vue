<template>
   <div class="step-header-title">
      <h3 >{{typeName}}</h3>
      <div @click="back" style="cursor:pointer;">
        <Icon type="ios-arrow-round-back" size="26" color="#1890FF" style="vertical-align:middle;" />
        <span style="font-weight:400;color:#1890FF">返回</span>
      </div>
    </div>
</template>

<script>
  export default {
    props: {
      typeName: {
        type: String,
        default: '创建代课'
      }
    },
    methods: {
      back () {
        this.$emit('back')
      }
    }

  }
</script>

<style>
.step-header-title {
    height: 50px;
    padding: 0 12px;
    background: #fff;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.step-header-title h3 {
    font-size: 20px;
    font-weight: 600;
    color: rgba(0,0,0,0.85);
}
</style>
