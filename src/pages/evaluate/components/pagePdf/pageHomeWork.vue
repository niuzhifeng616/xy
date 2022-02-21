<template>
  <div class="homeWork">
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
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;遇见北区学校，遇见美好未来。</span></h2>

              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;不知不觉中，同学们在北区学校度过了一学期充实快乐的时光。你们的成长看得见，很美好：课堂上积极合作、自信展示，运动赛场上团结一心、活力四射，融合课程中勇敢挑战，乐于实践……同学们在北区学校发现自己，做更好的自己，真为你们感到高兴。</span></h2>

              <h2><span style="font-size:16px">缤纷的寒假悄然而至，为了大家过得有意义又有意思，有几点温馨提醒：</span></h2>

              <h2><span style="font-size:16px"><span style="color:#3498db"><strong style="color: #095A8B">&nbsp; &nbsp; &nbsp; &nbsp;【学习篇】：</strong></span>合理制定假期学习计划，过一个快乐、有意义的新年。寒假计划可包括:每日作息、学习安排、阅读书目、运动时间、兴趣特长、下学期的学习目标等等。</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;1.认真独立完成《觅园·缤纷寒假》，保证质量，并解决作业中存在的问题，保持良好的学习状态。</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;2.多读书、读好书，坚持课外阅读，养成良好的阅读习惯。可以和爸爸妈妈共同读书，读完后互相提问、讨论。</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;3.坚持“每日一练”，通过寒假提升自己的书写技能。</span></h2>

              <h2><span style="font-size:16px"><span style="color:#3498db"><strong style="color: #095A8B">&nbsp; &nbsp; &nbsp; &nbsp;【生活篇】：</strong></span>主动帮助爸爸妈妈、爷爷奶奶做家务，料理好个人生活，用自己的行动树立北区学子“勤劳懂礼、独立自主”的好榜样。</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;1.每天做一项家务劳动，如扫地、拖地、洗衣服、擦玻璃等。</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;2.利用春节学习包饺子、贴春联等劳动技能。</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;3.在假期中学会做一道菜，为家人做一顿饭。</span></h2>

              <h2><span style="font-size:16px"><span style="color:#3498db"><strong style="color: #095A8B">&nbsp; &nbsp; &nbsp; &nbsp;【运动篇】：</strong></span>按时作息，坚持体育锻炼，塑造健康强健的少年体魄，保证每天至少进行一个小时的体育运动。</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;1.坚持每天锻炼身体，结合本年级的体育课程，坚持跳绳、踢毽子、仰卧起坐、打篮球等运动。</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;2.在父母的陪伴下进行户外运动，亲近自然，拥抱大自然，多呼吸呼吸大自然的新鲜空气。</span></h2>

              <h2><span style="font-size:16px"><span style="color:#3498db"><strong style="color: #095A8B">&nbsp; &nbsp; &nbsp; &nbsp;【安全篇】：</strong></span>提高安全意识和自我保护意识,保护好自己和家人的健康安全。</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;1.新冠疫情防控依然严峻，要正确佩戴口罩，做好个人防护，勤洗手，少聚集，不扎堆。</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;2.遵守社会公共秩序和交通规则,不单独远行、不燃放烟花爆竹、不在马路边与河池旁玩耍。</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;3.注意饮食健康，养成良好饮食习惯，不吃“三无”食品。</span></h2>

              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;同学们，你们是了不起的北区学子，相信都能度过一个有意义又有意思的寒假！</span></h2>
              <h2><span style="font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp;祝大家幸福快乐，虎虎生威，向着明媚的春天奔赴!</span></h2>

              <h2>&nbsp;</h2>

              <h2 style="text-align:right"><span style="font-size:16px">东莞市松山湖北区学校</span></h2>

              <h2 style="text-align:right"><span style="font-size:16px">2022年1月27日&nbsp; &nbsp; &nbsp;</span></h2>
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
.homeWork{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/bg1.png') no-repeat;
  background-size: 100% 100%;
  // padding: 313px 59px 0 72px;
  padding-top: 183px;
  position: relative;
}
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
