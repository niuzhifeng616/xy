<template>
  <div class='tj'>
    <div class="icon"></div>
    <div class="title"></div>
    <div class="content"></div>
    <div class="desc">
       融合性主题课程尝试打破学科壁垒，通过多学科知识互动，培养学生的综合能力和实践能力。课程以各学科知识为基础，以跨学科意识为导向，以问题研究与解决为依托，以动手实践为学习方式，围绕一个主题展开探究。学校根据学生年龄特点，设计出“莞城小世界、湾区大视野、世界大舞台”三大主题九个年级的融合课程，学生以PBL项目式学习的方式，在“寻”自然、“寻”社会、“寻”自我的探索活动中,培养实践创新等综合能力。
    </div>
    <div class="page-num">
      <div class="count">{{pageObj['.pagePhecda']}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['pageObj'],
    name: '',
    data () {
      return {
      }
    },
    created () {},
    mounted () {},
    methods: {

    }
  }
</script>
<style lang='less' scoped>
.tj{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/bg1.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
  position: relative;
}
.icon{
  width: 125px;
  height: 125px;
  background: url('./../../views/qualityReport/img/phecda/icon.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
  position: absolute;
   left:68px;
  top: 123px;
}
.title{
  width: 146px;
  height: 49px;
  background: url('./../../views/qualityReport/img/phecda/title.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
  position: absolute;
  left:432px;
  top: 202px;
}
.content{
  width: 500px;
  height: 508px;
  background: url('./../../views/qualityReport/img/phecda/content.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
  position: absolute;
  left:250px;
  top: 324px;
}
.desc{
  width: 856px;
  height: 170px;
  overflow: hidden;
  position: absolute;
  left:72px;
  bottom: 348px;
  font-size: 18px;
  color: #008cb3;
  line-height: 33px;
  letter-spacing: 1px;
  text-indent: 2em;
  text-align: justify;
}
.page-num{
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
