<template>
  <div class="introduction">
    <div class="text">
    <div class="title">
    <span></span>
      北区星辰评价体系简介
    <span></span>
    </div>
    <div class="desc">
      松山湖北区学校坚持立德树人，落实“5C”核心素养——文化理解与传承(CultureCompetency)、审辩思维(Critical Thinking)、创新创造力(Creativity)、沟通合作力(Communication)、终身学习力(Lifelong Learning Capacity) ， 培育未来人才。构建“觅·未来”课程体系——觅知·基础课程、觅行·拓展课程、觅思·融合课程、觅趣·社团课程、觅雅·综合活动课程、德育成长课程，促进学生德、智、体、美、劳全面发展。 学校以评价立校，依托大数据精准评价，建设学生综合素质评价系统。以北区星辰评价体系——天权星、天枢星、玉衡星、天璇星、天玑星、瑶光星、开阳星为载体，通过改进结果评价，强化过程评价，探索增值评价，健全综合评价等方式，引领学生在课程评价中学会发现自己，提升自己。通过评价激励学生成长，为学生全面而有个性的发展赋能，彰显个性风采，最终实现“身心自然完整、未来自由胜任”的育人目标。星辰评价体系坚持科学有效原则，充分利用信息技术为学生的个性化成长提供相对全面的、科学的、客观的个性化成长评价报告。
    </div>

    </div>
    <div class="main"></div>
    <div class="page-num">
      <div class="count">1</div>
    </div>
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
.introduction{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/bg1.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  padding-top: 200px;
  position: relative;
  .text{
    margin: 0 auto;
    width: 854px;
    height: 448px;
    .title{
      font-size: 48px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      color: #007abb;
      text-align: center;
      span{
        width: 68px;
        height: 2px;
        background: #007abb;
        display: inline-block;
        margin-bottom: 15px;
      }
    }
    .desc{
      text-indent: 2em;
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #008cb3;
      letter-spacing: 1px;
      margin-top: 46px;
      text-align: justify;
    }
    // background: url('./../../views/qualityReport/img/introduce/introduction.png') no-repeat;
    // background-size: 100% 100%;
  }
  .main{
    margin: 100px auto 44px;
    width: 810px;
    height: 500px;
    background: url('./../../views/qualityReport/img/introduce/resources.png') no-repeat;
    background-size: 810px auto;
  }
  .page-num {
    position: absolute;
    bottom: 50px;
      width: 100%;
      height: 30px;
      background: url('./../../views/qualityReport/img/pageNum2.png') no-repeat;
      background-size: 100% 100%;
  .count{
    text-align: center;
    line-height: 30px;
  }
  }
}
</style>
