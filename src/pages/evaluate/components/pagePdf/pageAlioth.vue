<template>
  <div class='alioth'>
    <div class="content">
       觅知·国家基础课程是根据中共中央 国务院颁布的《关于深化教育教学改革 全面提高义务教育质量的意见》的文件精神，为实现五育并举，适应未来发展需要而学习的国家课程，旨在发展学生身心健康，增强身体素质，增进科学意识，引导学生了解自我，了解世界，提升艺术涵养。涵盖了音乐、体育与健康、美术、科学、信息技术、综合实践和心理健康等课程。教师和学生个体根据课堂表现和综合实践活动等进行综合评价。旨在促进学生身心自然完整，未来自由胜任。
    </div>
    <div class="page-num">
      <div class="count">{{pageObj['.pageAlioth']}}</div>
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
.alioth{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/alioth/alioth.png') no-repeat;
  background-size: 100% 100%;
  padding-top: 902px;
  position: relative;
}
.content{
  width: 856px;
  height: 170px;
  font-size: 18px;
  color: #008cb3;
  line-height: 33px;
  letter-spacing: 1px;
  text-indent: 2em;
  margin: 0 auto 262px;
  text-align: justify;
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
</style>
