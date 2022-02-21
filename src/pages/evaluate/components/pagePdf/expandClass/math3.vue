//天璇星 阅读悦美
<template>
  <div class="page-merak">
      <div class="main">
        <h3>
          <span>当扑克遇上数学</span>
        </h3>
        <div class="color-span">
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>

          <div class="evalute">
          <!--<div class="evaHeader">拓展课程</div>-->
          <div class="evaMain">
            <div class="line" style="display:none">
              <div class="evaLeft">课程名称</div>
              <div class="evaRight" style="text-align: center;">当扑克遇上数学</div>
            </div>
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight" v-show="grade === 201">
                <p>1.提高小学生运算能力；</p>
                <p>2.转变学生的学习方式；</p>
                <p>3.提高学生数学学习能力；</p>
                <p>4.激发学生的学习兴趣。</p>
              </div>
              <div class="evaRight" v-show="grade === 202">
                <p>1.“用扑克牌玩乘法口诀”数学活动提高小学生运算能力；</p>
                <p>2.“用扑克牌玩乘法口诀”数学活动转变学生的学习方式；</p>
                <p>3.“用扑克牌玩乘法口诀”数学活动提高学生数学学习能力 ；</p>
                <p>4.“用扑克牌玩乘法口诀”数学活动激发学生的学习兴趣。</p>
              </div>
              <div class="evaRight" v-show="grade === 203">
                <p>1.算“24点”数学活动提高小学生运算能力；</p>
                <p>2.算“24点”数学活动转变学生的学习方式；</p>
                <p>3.算“24点”数学活动提高学生数学学习能力；</p>
                <p>4.算“24点”数学活动激发学生的学习兴趣。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">4月16日</p>
                <p style="color:#59BEB7;">二、活动内容</p>
                <p style="text-indent:2em;" v-show="grade === 201">用扑克牌做加法口算。（分为初赛与决赛）</p>
                <p style="text-indent:2em;" v-show="grade === 202">两人一组进行比赛，开局时每人20张扑克牌（不含J、Q、K和鬼牌），两人同时翻开一张，并迅速说出两张牌的数字之和，答案正确且速度快者可以拿走桌面上的两张牌。游戏限时3分钟，游戏结束时，手里扑克牌数量多者获胜。</p>
                <p style="text-indent:2em;" v-show="grade === 203">两人一组进行比赛，开局时每人20张扑克牌（不含J、Q、K和鬼牌），每人翻开一张，并迅速说出两张牌的数字相乘的得数，答案正确且速度快者可以拿走桌面上的两张牌。游戏限时3分钟，游戏结束时，手里扑克牌数量多者获胜。数学是思维的体操，一个人思维的发展，离不开数学的学习。为了营造浓厚的数学学习氛围，促进学生学习兴趣，本次数学节以“当扑克牌遇上数学”为主题，开展一系列数学活动，为学生搭建展示数学智慧的平台，启迪学生的数学思维。通过数学节活动，让学生真正走进数学、感受数学、喜欢数学，从而提升数学学科素养，获得积极的数学学习情感体验。</p>
                <p style="text-indent:2em;" v-show="grade === 207">算“24点”，又称“24点”游戏，通常用扑克牌来玩，即从一副扑克牌中去掉大小王(52张牌)后(如果是初入门，可以选用1～10这40张牌)，任意抽取4张，每张牌必须用并且只能用一次，用加、减、乘、除(可运用括号)把牌面上的点数算成是24，其中A、J、Q、K分别表示1、11、12、13。根据心理学的理论，小学生的认知规律是“感知、动作——表象——概念、符号”，以“24点”游戏为计算能力提升载体，学生在感知大量事例的过程中能建立牢固而清晰的表象，逐步认识到运算规律的存在。并且让学生在具有浓厚兴趣的游戏氛围中遭遇运算问题，进而运用运算知识解决问题，能理解和升华对运算知识的认识，培养学生的运算能力和抽象思维。</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p :style="{borderBottom: grade !== 201 ? 0 : '1px solid #59BEB7'}">
                  2.思维敏捷
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p v-show="grade === 201" style="border: 0;">
                  3.遵守规则
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片（8张）、综合成绩（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight" v-if="evaData.length !== 0">{{evaData[1].等级评价}}</div>
            </div>
          </div>
        </div>

        <div class="page-num">
          <div class="count">{{pageObj['.pageMerak']+9}}</div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: ['studentInformationDatas', 'pageObj'],
    data () {
      return {
        id: '',
        grade: '',
        evaData: []
      }
    },
    created () {
      this.id = this.studentInformationDatas[0]['学号']
      this.grade = Number(this.id.slice(0, 3))
      // this.getData()
    },
    mounted () {},
    methods: {
      // 获取数据
      async getData () {
        let res = await this.xy.get(`http://sshbqxxzxztapi.xiaoyangedu.com:27055/output/studentReport/getExpandsubject`, {
          xuehao: this.id
        }, true)
        if (res.retCode === 100000) {
          this.evaData = JSON.parse(res.retData)
          // console.log(this.evaData)
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.page-merak{
  width: 100%;
  height: 100%;
  background: url('./../../../views/qualityReport/img/merak/merakbg2.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  .main{
    padding-top:155px;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    .title{
      width: 856px;
    }
        h3{
      font-size: 42px;
      font-weight: 600;
      color: #FA4655;
      line-height: 36px;
      text-align: center;
    }
    .color-span{
      height: 6px;
      margin: 10px 0;
      text-align: center;
      span{
        width: 40px;
        height: 6px;
      }
      span:nth-child(1){
        display: inline-block;
        background: #F5C45B;
      }
      span:nth-child(2){
        display: inline-block;
        background: #F08C33;
      }
      span:nth-child(3){
        display: inline-block;
        background: #D44953;
      }
      span:nth-child(4){
        display: inline-block;
        background: #851C3C;
      }
      span:nth-child(5){
        display: inline-block;
        background: #084F7A;
      }
      span:nth-child(6){
        display: inline-block;
        background: #3AA7D3;
      }
      span:nth-child(7){
        display: inline-block;
        background: #66C3CC;
      }
      span:nth-child(8){
        display: inline-block;
        background: #72C3AD;
      }
    }
      .evalute {
      border: 1px solid #59BEB7;

      font-size: 14px;
      line-height: 26px;
      width: 856px;
      transform: translateY(-2px);
      margin: 35px 0 32px;
      .evaHeader {
        height: 46px;
        background: #59BEB7;
        color: #fefefe;
        font-size: 24px;
        text-align: center;
        line-height: 46px;
      }
    }
    // .evalute {
    //   display: flex;
    //   align-items: center;
    //   border: 1px solid #59beb7;
    //   border-top: 1px solid transparent;
    //   font-size: 14px;
    //   line-height: 26px;
    //   width: 856px;
    //   transform: translateY(-2px);
    //   margin-bottom: 32px;
    //   color: rgba(0, 0, 0, .85);
    //   .evaTitle {
    //     width: 94px;
    //     height: 26px;
    //     border-right: 1px solid #59beb7;
    //     text-align: center;
    //   }
    //   .evaMain {
    //     padding: 0 16px;
    //   }
    // }
  }
}
.page-num {
  width: 100%;
  height: 30px;
  background: url('./../../../views/qualityReport/img/pageNum2.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    bottom: 50px;
    .count{
    text-align: center;
    line-height: 30px;
    }
}

.evaMain {
  font-size: 14px;
  color: #231916;
  >div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #59BEB7;
    .evaLeft {
      width: 94px;
      text-align: center;
    }
    .evaRight {
      width: 100%;
      border-left: 1px solid #59BEB7;
      padding: 8px 0 8px 20px;
    }
  }
  .line:nth-child(3) .evaRight {
    height: 810px;
  }
  .line2 {
    .evaRight {
      padding: 0 0 0 16px;
    }
  }
  .lineS {
    .evaRight {
      padding: 0;
      p {
        padding-left: 16px;
        border-bottom: 1px solid #59BEB7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          display: inline-block;
          width: 190px;
          border-left: 1px solid #59BEB7;
          text-align: center;
        }
      }
    }
  }
}
</style>
