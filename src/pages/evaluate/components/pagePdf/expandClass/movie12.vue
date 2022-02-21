//天璇星 阅读悦美
<template>
  <div class="page-merak">
      <div class="main">
        <h3>
          <span>“心理微电影”大赛</span>
        </h3>
        <div class="color-span">
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>

          <div class="evalute">
          <!--<div class="evaHeader">拓展课程</div>-->
          <div class="evaMain">
            <div class="line" style="display:none">
              <div class="evaLeft">课程名称</div>
              <div class="evaRight" style="text-align: center;">“心理微电影”大赛</div>
            </div>
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>以“全面实施中小学素质教育”为核心，以“舞剧节”活动做为契机，展示学生活力，凸显学校舞剧特色，丰富校园文化，营造高雅艺术氛围，培养学生的自信心，陶冶学生情操，增强学生的集体荣誉感。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">3月14日-4月25</p>
                <p style="color:#59BEB7;">二、内容安排</p>
                <p style="text-indent:2em;">1.全体学生，以班级为单位上交微电影作品，每班不限制作品数量，但每班不能少于1个作品（小学主要以亲子家庭组为单位参加）。</p>
                <p style="text-indent:2em;">2.初中部可班级内生生合作参赛。</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">1.内容要求</p>
                <p style="text-indent:2em;">作品要求立德树人，内容健康向上，反映当代中小学生的生活，符合中小学生的心理发展特点，突出反映出主人翁内心转化的过程，这个心理变化过程呈现自然，符合逻辑，给人以启迪，内容力求新颖、有创意。</p>
                <p style="text-indent:2em;">2.视频格式和技术要求</p>
                <p style="text-indent:2em;">（1）微电影时间应控制3-6分钟，不宜过长。</p>
                <p style="text-indent:2em;">（2）统一上交视频格式为MP4，画质流畅清晰，无闪烁、卡顿，无黑边现象；可以参考输出分辨率（分辨率1280×720（宽高比16:9），帧频24，画面码率1280K bps；声音采样率44K Hz，声音码率 128K bps ，8分钟视频约68MB；）配音普通话标准。</p>
                <p style="text-indent:2em;">期末成绩=过程性评价成绩50%+终结性评价成绩50%</p>
                <p style="color:#59BEB7;">注：过程性评价成绩（满分50分）=个人分数/班级最高分X50</p>
                <p style="text-indent:2em;">终结性成绩（满分50分  根据班级预赛情况赋予分数）</p>
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
                <p>
                  2.主题积极
                  <span>
                    <Icon type="md-star-outline" />
                  </span>
                </p>
                <p style="border:0;">
                  3.转化科学
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
          <div class="count">{{pageObj['.pageMerak']+21}}</div>
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
