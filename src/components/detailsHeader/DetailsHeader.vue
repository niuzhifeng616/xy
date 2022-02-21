<template>
  <div class="header-back">
    <h3 class="title">{{title}}</h3>
    <Button @click="handleBack" type="text">
      <Icon type="md-arrow-back"/>
      返回
    </Button>
  </div>
</template>
<script>
  export default {
    name: 'DetailsHeader',
    props: {
      title: {
        required: true,
        type: String
      }
    },
    methods: {
      handleBack () {
        this.$emit('handle-back')
      }
    }
  }
</script>
<style lang="less" scoped>
  .header-back {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 20px;
    background: #fff;
    width: calc(100% + 20px);
    margin-left: -10px;
    margin-bottom: 20px;
    h3 {
      font-size:20px;
      font-weight:500;
      color:rgba(0,0,0,0.85);
    }
    .ivu-btn:focus {
      box-shadow: 0 0 0 0;
    }
    .ivu-btn-text {
      color: #3e8ff2;
      outline: none;
    }
  }
</style>
