<template>
  <div class='page-megrez'>
    <div class="title"></div>
    <div class="chart"></div>
    <div class="text">
      德育成长课程以《中小学生守则》为指导，以社会主义核心价值观为依托，全面覆盖学生一日在校与周末在家表现，内容包括仪容仪表、尊师爱友、自主学习、强身健体、劳动成长等内容。评价主体由导师、生活老师、学生个体、家长多方组成，依托大数据精准评价，客观实时记录学生不同维度表现，同时创设增值加分通道，最大限度最全面发现每一个孩子的闪光点，进而形成个性化德育成长评价，引导学生发现自己，张扬个性，遇见更美好的自己。
    </div>
    <div class="page-num">
     <div class="count">2</div>
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
.page-megrez {
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/megrez/megrezBg.png') no-repeat;
  background-size: 100% 100%;
  padding-top: 202px;
  position: relative;
}
.title {
  width: 143px;
  height: 50px;
  margin: 0 auto 72px;
  background: url('./../../views/qualityReport/img/megrez/megrezTit.png') no-repeat;
  background-size: 100% 100%;
}
.chart {
  width: 862px;
  height: 520px;
  margin: 0 auto 140px;
  background: url('./../../views/qualityReport/img/megrez/megrezChart.png') no-repeat;
  background-size: 100% 100%;
}
.text {
  width: 856px;
  height: 120px;
  margin: 0 auto 234px;
  text-indent: 40px;
  color: #008cb3;
  line-height: 34px;
  text-align: justify;
  //background: url('./../../views/qualityReport/img/megrez/megrezText.png') no-repeat;
  //background-size: 100% 100%;
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
