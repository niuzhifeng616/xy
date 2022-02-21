<template>
  <div class="message">
    <div class="title">
      <span></span>
      <span>

      </span>
    </div>
    <!-- <div class="day">2021年7月12日</div> -->
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        schoolYear: '2020-2021学年度第一学期',
        studentInformation: {
          class: '701',
          name: '小白',
          sno: '222333'
        }
      }
    },
    created () {},
    mounted () {},
    methods: {}
  }
</script>
<style lang='less' scoped>
.message{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/message/message.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  .title {
    font-size: 19px;
    color: #008CB3;
    position: absolute;
    top: 92px;
    padding: 0 6px;
    right: 77px;
    background: #fff;
    >span:nth-child(1) {
      color: #113675;
    }
  }
}
.day {
  font-size: 16px;
  color: #231916;
  position: absolute;
  bottom: 200px;
  left: 720px;
  font-family: PingFangSC, PingFangSC-Light;
}
.page-num {
  width: 100%;
  height: 30px;
  background: url('./../../views/qualityReport/img/pageNum2.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: 50px;
  .count{
    text-align: center;
    line-height: 30px;
  }
}
</style>
