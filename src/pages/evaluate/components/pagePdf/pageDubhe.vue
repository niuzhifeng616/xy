<template>
  <div class='page-class-eva'>
    <div class="page-wrap-bg">
      <div class="page-bg"></div>
    </div>
    <div class="text">
      觅知·国家基础课程是根据中共中央 国务院颁布的《关于深化教育教学改革 全面提高义务教育质量的意见》的文件精神，适应未来发展需要而学习的国家课程，涵盖了语文、数学、英语、地理、生物、历史、道德与法治、物理，化学等课程。通过学习国家基础课程，让孩子们夯实学科知识、从中寻觅智慧，让每一个孩子在对接成长需要的滋养中、与各类丰富课程的对话中，得到来自根源的滋润，从而在萌芽、抽枝、蓄叶、绽放、撷取、领悟中不断完成生命的拔节。
    </div>
    <div class="page-num">
      <div class="count">{{pageObj['.pageDubhe']}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {
      pageObj: Object
    },
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
.page-class-eva {
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/classEva/bg.png') no-repeat;
  background-size: 100% 100%;
  padding-top: 320px;
  position: relative;
}
.text {
  margin-top: 580px;
  padding: 0 72px;
  text-indent: 36px;
  color: #008CB3;
  font-size: 18px;
  line-height: 34px;
  margin-bottom: 260px;
  text-align: justify;
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
