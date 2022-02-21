<template>
<div>
  <div class="crumbs-wrap">
      <div class="crumbs-flex">
        <div>首页</div>
        <!-- &#xe6a9; -->
        <div class="split">&gt;</div>
        <div>消息</div>
        <div class="split">&gt;</div>
        <div class="now-name">
          <span>{{titles}}</span>
        </div>
      </div>
      <div class="crumbs-custom">
        <div class="name">{{menuName}}</div>
        <div class="back" @click="back">
          <i class="iconfont">&#xe6a5;</i>
          <span>返回消息列表</span>
        </div>
      </div>
    </div>
    <div class="xy-content-module">
      <div class="xy-content-body">
        <div class="msg-detail">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'MsgInfo',
    data () {
      return {
        titles: '',
        menuName: ''
      }
    },
    computed: {
      row () {
        return this.$store.state.common.msgParam !== '' ? JSON.parse(this.$store.state.common.msgParam) : {}
      }
    },
    watch: {
      row: {
        handler (newVal) {
          this.titles = newVal.MessageTypeName
          this.menuName = newVal.Subject
        },
        immediate: true
      }
    },
    methods: {
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="less" scoped>
.crumbs-wrap{
  padding:10px 20px 0;
  margin-bottom: 10px;
  background: #fff;
  .crumbs-flex{
    display: flex;
    align-items:center;
    .split{
      margin:0 5px;
    }
    .split-active{
      color:#0877FF;
    }
    .crumbs-icon{
      color:#0877FF;
      margin-right: 5px;
    }
    .now-name{
      color:#0877FF;
    }
  }
  .crumbs-custom{
    display: flex;
    justify-content: space-between;
    padding: 18px 0 5px;
    align-items: center;
    .name{
      font-size: 18px;
      font-weight:700;
      color:rgba(0,0,0,0.75);
    }
    .back{
      cursor: pointer;
      i{
        margin-right:5px;
        font-size: 14px;
        color: #1890FF;
      }
      span{
        color:#1890FF;
      }
    }
  }
}
.msg-detail{
  width: 50%;
  margin:20px auto;
  padding:20px;
}
</style>
