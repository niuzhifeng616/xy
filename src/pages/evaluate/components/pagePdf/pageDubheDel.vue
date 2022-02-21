<template>
  <div class="page-dubhe">
    <div class="dubhe-star">
      <img src="./../../views/qualityReport/img/dubhe/dubhestar.png" alt="">
    </div>
    <div class="dubhe-main">
      <h3>天枢星</h3>
      <div class="dubhe-curriculum">
        <img src="./../../views/qualityReport/img/dubhe/dubhecurriculum.png" alt="">
      </div>
      <div class="dubhe-subject">
        <img src="./../../views/qualityReport/img/dubhe/dubhesubject.png" alt="">
      </div>
    </div>
    <div class="page-num">
      <img src="./../../views/qualityReport/img/pageNum2.png" alt="">
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
      }
    },
    created () {},
    mounted () {},
    methods: {}
  }
</script>
<style lang='less' scoped>
.page-dubhe{
  width: 100%;
  height: 100%;
  position: relative;
  background: url('./../../views/qualityReport/img/dubhe/bg.png') no-repeat;
  background-size: 100% 100%;
  .dubhe-star{
    width: 220px;
    height: 220px;
    position: absolute;
    top:94px;
    left: 28px;
  }
  .dubhe-main{
    padding-top:240px;
    h3{
      width: 100%;
      text-align: center;
      color: #007ABB;
      font-size: 40px;
    }
    .dubhe-curriculum{
      margin-top:117px;
      margin-left: 86px;
    }
    .dubhe-subject{
      margin-top:117px;
      margin-left: 86px;
    }
  }
  .page-num{
    width: 100%;
    height: 31px;
    position: absolute;
    bottom: 39px;
    left: 0;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
