//开阳星
<template>
  <div class='ky'>
    <div class="icon"></div>
    <div class="title"></div>
    <div class="content"></div>
    <div class="desc">
       觅雅·活动课程以“立德树人”思想为宗旨，研发与校训“发现你自己”高度契合的活动课程，涵盖爱国教育、生命安全、责任担当、中西节庆等课程，在课程体验与活动实践中提升学生核心素养。同时创设学生自主申报通道，鼓励学生大胆创新，发展个性，创造无限可能！
    </div>
    <div class="page-num">
      <div class="count">{{pageObj['.pageMizar']+1}}</div>
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
.ky{
  position: relative;
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
  background: url('./../../views/qualityReport/img/mizar/icon.png') no-repeat;
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
  background: url('./../../views/qualityReport/img/mizar/title.png') no-repeat;
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
  background: url('./../../views/qualityReport/img/mizar/content.png') no-repeat;
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
