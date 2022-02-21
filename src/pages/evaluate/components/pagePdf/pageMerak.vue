//天璇星
<template>
  <div class="page-merak">
      <div class="main">
        <div class="title">
          <img src="./../../views/qualityReport/img/merak/merakstar.png" alt="">
        </div>
        <div class="text">
         拓展性课程，即“学科+”课程，是面向每一个学生的提高性课程，是国家课程和地方课程的校本化、个性化。课程旨在进一步培养学生的学科兴趣，让思维流动、认知顿悟、智慧启发。拓宽学生的学科视野，开发学生的学习潜能，促进学生学科素养的全面形成。目前，我校开展拓展性课程主要有晨诵、午练、阳光体育等。
        </div>
        <div class="page-num">
        <div class="count">{{pageObj['.pageMerak']}}</div>

        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: ['i', 'pageObj'],
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
.page-merak{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/merak/merakbg.png') no-repeat;
  background-size: 100% 100%;
  // border-bottom: 1px solid #000;
  position: relative;
  .main{
    padding-top:323px;
    // display: flex;
    // align-items: center;
    // flex-direction: column;
    width: 100%;
    .title{
      width: 826px;
      height: 598px;
      margin-left: 82px;
      img{
        width: 100%;
        height: auto;
      }
    }
    .text{
      padding:69px 72px 215px 72px;
      text-indent: 40px;
      color: #008cb3;
      line-height: 34px;
      text-align: justify;
    }
  }
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
