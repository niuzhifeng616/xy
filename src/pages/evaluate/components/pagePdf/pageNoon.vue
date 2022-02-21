//天璇星 午练
<template>
  <div class="page-merak">
    <div class="main">
      <h3>
        <span>午练</span>
      </h3>
      <div class="color-span">
        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
        <div class="evalute">
          <!--<div class="evaHeader">拓展课程</div>-->
          <div class="evaMain">
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>1.掌握汉字的基本笔画和常用的偏旁部首，能按笔顺规则用硬笔写字，注意间架结构。初步感受汉字的形体美。</p>
                <p>2.养成正确的写字姿势和良好的写字习惯，书写规范、端正、整洁。</p>
                <p>3.能正确工整地书写汉字，并有一定的速度。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、时间安排</p>
                <p style="text-indent:2em;">14：20-14：35</p>
                <p style="color:#59BEB7;">二、内容安排</p>
                <p style="text-indent:2em;">各班根据午练课程教学视频或教师示范进行午练，一练坐姿，二练握笔，三练间架，四练速度。确保午练课程按既定流程组织实施；确保学生坐姿端正、执笔规范与静心习字。</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">学期末通过对学生进行卷面的考核，来评定学生个人及班级午练成绩。学生个人成绩按本年级整体写字水平划分优、良、合格、不合格四个等次，班级整体成绩按班级午练成绩的优秀率和合格率来划分，其中：</p>
                <p style="margin-top: 12px;">优秀（计50分）：合格率90%以上，优秀率30%以上；</p>
                <p>良好（计45分）：合格率90%以上，优秀率20%以上；</p>
                <p>合格（计40分）：合格率90%以上，优秀率20%以下；</p>
                <p>不合格（计30分）：合格率90%以下。</p>
              </div>
            </div>
            <div class="line2 lineS">
              <div class="evaLeft">课程评价</div>
              <div class="evaRight">
                <p>
                  1.积极参与午练
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  2.在期末测评中表现优异
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p>
                  3.在一年一度的学校活动中表现突出，获得奖项
                  <span>
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border:0;">
                  4.参与校内外相关活动
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
              <!-- <div class="evaRight" v-if="evaData.length !== 0">{{evaData[1].等级评价}}</div> -->
            </div>
          </div>
        </div>
        <div class="page-num">
          <div class="count">{{pageObj['.pageMerak']+3}}</div>
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
        // evaData: [],
        api: 'http://prod.dmapi.xiaoyangedu.com/openapi/output/studentReport'
      }
    },
    created () {
      this.id = this.studentInformationDatas[0]['学号']
      this.getData()
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
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.page-merak{
  position: relative;
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/merak/merakbg2.png') no-repeat;
  background-size: 100% 100%;
  .main{
    padding-top:185px;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    .title{
      width: 263px;
      height: 57px;
      background: url('./../../views/qualityReport/img/merak/noonTit.png') no-repeat;
      background-size: 100% 100%;
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
