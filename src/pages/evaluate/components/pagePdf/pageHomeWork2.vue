<template>
  <div class='homeWork'>
      <div class="title">
        <img src="./../../views/qualityReport/img/assessment.png" alt="">
        <span>假期实践作业</span>
      </div>
      <div v-html="text" class="desc">{{text}}</div>
    <div class="page-num">
          <div class="count">{{pageObj['.homeWork']}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        text: `<div class="123">
<h2><span style="font-size:16px">亲爱的同学们：</span></h2>
<h2><br />
<h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;大家好！</span></h2>
<h2><br />
<h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;一学期的学习结束了，大家辛苦啦！相信你们这个学期在老师的指导和自己的努力下收获满满！寒假到了，为了让大家的假期既充实又有趣，我们提出以下温馨小建议：</span></h2>

<h2><br />


<span style="font-size:16px"><span style="color: #095A8B; font-weight: bold;">&nbsp; &nbsp; &nbsp; &nbsp;一、坚持锻炼。</span>选择自己喜欢的运动项目，坚持每天运动一小时，如跳绳、篮球、跑步、仰卧起坐、引体向上等；</span></h2>

<h2>&nbsp;</h2>

<h2><span style="font-size:16px"><span style="color: #095A8B; font-weight: bold;">&nbsp; &nbsp; &nbsp; &nbsp;二、完成作业。</span>每天固定2小时左右，选择安静场合，排除数码产品等外界因素的干扰，高质量完成作业；</span></h2>

<h2>&nbsp;</h2>

<h2><span style="font-size:16px"><span style="color: #095A8B; font-weight: bold;">&nbsp; &nbsp; &nbsp; &nbsp;三、广泛阅读。</span>建议结合老师推荐的书目，每天阅读半小时以上，同时做好阅读笔记和摘抄；</span></h2>

<h2>&nbsp;</h2>

<h2><span style="font-size:16px"><span style="color: #095A8B; font-weight: bold;">&nbsp; &nbsp; &nbsp; &nbsp;四、培养能力。</span>建议每天协助家人完成力所能及的家务并学会做点家常饭菜；</span></h2>

<h2>&nbsp;</h2>

<h2><span style="font-size:16px"><span style="color: #095A8B; font-weight: bold;">&nbsp; &nbsp; &nbsp; &nbsp;五、发展兴趣。</span>利用假期做些自己感兴趣和有意义的事，如舞蹈、美术、音乐等，培养和发展一技之长；</span></h2>
<h2>&nbsp;</h2>

<h2><span style="font-size:16px"><span style="color: #095A8B; font-weight: bold;">&nbsp; &nbsp; &nbsp; &nbsp;六、参与服务。</span>建议在社区参与一两项公共服务活动，增强社会责任感，展示北区学子的风采。</span></h2>

<h2>&nbsp;</h2>

<h2>&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:16px">亲爱的同学们，祝你科学度过愉快的寒假，成长为更好的自己！</span></h2>

<h2 style="text-align:right"><br />
<span style="font-size:16px">东莞市松山湖北区学校<br />
2022年1月27日&nbsp; &nbsp; &nbsp;</span></h2>
</div>
`
      }
    },
    props: ['pageObj'],
    created () {},
    mounted () {},
    methods: {}
  }
</script>
<style lang='less' scoped>
  .title{
    width: 100%;
    height: 72px;
    text-align: center;
    margin-bottom: 43px;
    img{
      width: 121px;
      height: 72px;
      margin-right:10px ;
    }
    span{
      font-size: 40px;
      color: #095A8B;
    }
  }
.homeWork{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/bg1.png') no-repeat;
  background-size: 100% 100%;
  // padding: 313px 59px 0 72px;
  padding-top: 183px;
  position: relative;
}
.desc{
  width: 732px;
  margin: 0 auto;
  padding: 20px 50px;
  border:3px dashed  #3498db;
  border-radius: 10px;
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
