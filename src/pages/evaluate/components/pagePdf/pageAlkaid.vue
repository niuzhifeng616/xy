摇光
<template>
  <div class='page-class-eva'>
    <div class="mainImg"></div>
    <div class="text">
      社团课程是以尊重学生个性、开发学生潜能，择兴趣所在、扬个性所长为目标。学校将陆续开设数百门课程，为每个学生每周不少于3门个性化社团课程，为学生的全面发展提供强有力的保证。让学生在丰富多元的社团课程中玩出灵感，玩出创意，玩出能量，从中寻觅乐趣、体验成长、怡情养性。    </div>
    <div class="page-num">
     <div class="count">{{pageObj['.pageAlkaid'] + 1}}</div>
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
    methods: {}
  }
</script>
<style lang='less' scoped>
.page-class-eva {
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/alkaid/alkaidBg.png') no-repeat;
  background-size: 100% 100%;
  padding-top: 329px;
  position: relative;
}
.mainImg {
  width: 553px;
  height: 598px;
  background: url('./../../views/qualityReport/img/alkaid/alkaidImg.png') no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
}
.text {
  margin-top: 53px;
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
