<!-- 提醒设置 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <!-- 左边 -->
      <div class="text-center top-select">
        <p @click="loadPage(1)" :class='typePage===1?"active-bg":"" '>提醒设置</p>
        <p @click="loadPage(2)" :class='typePage===2?"active-bg":"" '>审批流程</p>
      </div>
      <!-- 右边 -->
      <router-view class="right-content"></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        typePage: 1
      }
    },
    mounted: function () {
      if (this.$router.currentRoute.fullPath.indexOf('/xyHome/schRemind/remindSet') !== -1) {
        this.typePage = 1
      } else {
        this.typePage = 2
      }
    },
    methods: {
      back () {

      },
      loadPage: function (val) {
        this.typePage = val
        let path = val === 1 ? '/xyHome/schRemind/remindSet' : '/xyHome/schRemind/approvalFlow'
        this.$router.push({ path: path, query: this.$store.state.common.menuInfo })
      }
    }

  }
</script>
<style lang='less' scoped>
.xy-content-body {
  display: flex;
  .top-select {
    border-right: 1px solid #d8d8d8;
    min-width: 100px;
    p {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      height: 50px;
      line-height: 50px;
      border-right: 2px solid transparent;
      cursor: pointer;
    }
    .active-bg {
      border-right: 2px solid #4196ff;
      color: #4196ff !important;
      font-weight: 700;
    }
  }

  .right-content {
    width: 100%;
    padding: 10px;
  }
}
</style>
