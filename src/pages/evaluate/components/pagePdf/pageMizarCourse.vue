//开阳星 体育艺术节活动课程
<template>
  <div class="page-merak">
      <div class="main">
        <div class="title">
          2021北区学校艺体节
        </div>
        <div class="evalute">
          <div class="evaMain">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>1. 增强学生体质</p>
                <p>2. 掌握运动技能</p>
                <p>3. 凝聚班级力量</p>
                <p>4. 展现北区风采</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight" style="height:700px;">
                <p style="color:#59BEB7;">一.活动时间：</p>
                <p style="text-indent:2em;">11月29日-11月30日</p>
                <p style="color:#59BEB7;">二.活动内容：</p>
                <p style="text-indent:2em;">全员运动，全员参与，秉承“每一个孩子都重要，每一门课程都育人”的理念。我们要让场上的每一个孩子动起来、跑起来，让他们不再是运动场边的看客，不再是跑道边默默无闻的旁观者，我们要让每一个孩子都成为运动场上的主角，去享受运动的快乐。通过活动增强学生体质，陶冶情操，发展个性，培养团结协作精神；创设文明、健康、活泼、和谐的校园文化生活，从而进一步推动我校素质教育的发展。</p>
                <p style="text-indent:2em;">享受运动、享受健康、享受快乐！</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.遵守艺体节纪律
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.积极参加比赛
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  3.比赛获得名次
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
              </div>
            </div>
            <div class="line2">
              <div class="evaLeft">资料上传</div>
              <div class="evaRight">上传照片、文件、证书（添加备注）</div>
            </div>
            <div class="line2" style="border: 0;">
              <div class="evaLeft">综合评价</div>
              <div class="evaRight">{{evaData[0]['等级']}}</div>
            </div>
          </div>
        </div>
        <div class="page-num">
          <div class="count">{{pageObj['.pageMizar'] + (index+1) * 2}}</div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: ['studentInformationDatas', 'pageObj', 'evaData', 'index'],
    data () {
      return {
        id: '',
        grade: ''
      }
    },
    created () {
      this.id = this.studentInformationDatas[0]['学号']
      this.grade = Number(this.id.slice(0, 3))
    },
    mounted () {
      // console.log(this.evaData)
    },
    methods: {

    }
  }
</script>
<style lang='less' scoped>
.page-merak{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/mizar/bg.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  .main{
    padding-top:205px;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    .title{
      width: 100%;
      height: 57px;
      text-align: center;
      font-size: 36px;
      font-weight: 600;
      color: #786BAE;
    }
    .evalute {
      border: 1px solid #786BAE;
      //border-top: 1px solid transparent;
      font-size: 14px;
      line-height: 26px;
      width: 856px;
      transform: translateY(-2px);
      margin: 35px 0 32px;
      .evaHeader {
        height: 46px;
        background: #786BAE;
        color: #fefefe;
        font-size: 24px;
        text-align: center;
        line-height: 46px;
      }
    }
  }
}
.evaMain {
  font-size: 14px;
  color: #231916;
  >div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #786BAE;
    .evaLeft {
      width: 94px;
      text-align: center;
    }
    .evaRight {
      width: 100%;
      border-left: 1px solid #786BAE;
      padding: 8px 20px 8px 20px;
    }
  }
  .line:nth-child(3) .evaRight {
    height: 650px;
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
        border-bottom: 1px solid #786BAE;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          display: inline-block;
          width: 190px;
          border-left: 1px solid #786BAE;
          text-align: center;
        }
      }
      p:nth-last-child(1) {
        border: 0;
      }
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
