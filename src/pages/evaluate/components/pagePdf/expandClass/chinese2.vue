//天璇星 阅读悦美
<template>
  <div class="page-merak">
      <div class="main">
        <h3>
          <span>以书为舟 千里雁帛行</span>
        </h3>
        <div class="color-span">
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>

          <div class="evalute">
          <!--<div class="evaHeader">拓展课程</div>-->
          <div class="evaMain">
            <div class="line" style="display:none">
              <div class="evaLeft">课程名称</div>
              <div class="evaRight" style="text-align: center;">“以书为舟 千里雁帛行”
——东莞市松山湖北区学校与韶关市始兴县墨江中学“书信手拉手”活动</div>
            </div>
            <div class="line">
              <div class="evaLeft">课程目标</div>
              <div class="evaRight">
                <p>本课程旨在通过创设一个真实的通信情境，让学生学会给同辈写信，不仅要格式正确，还要叙事清楚，并能与他人进行思想交换与情绪沟通。</p>
              </div>
            </div>
            <div class="line">
              <div class="evaLeft">课程内容</div>
              <div class="evaRight">
                <p style="color:#59BEB7;">一、活动时间</p>
                <p style="text-indent:2em;">2021年3月5日-2021年7月1日</p>
                <p style="color:#59BEB7;">二、活动内容</p>
                <p style="text-indent:2em;">（1）第一阶段（2021年3月4日-2021年3月7日）</p>
                <p style="text-indent:2em;">a.拟定方案；</p>
                <p style="text-indent:2em;">b.开展宣传倡议活动；</p>
                <p style="text-indent:2em;">c.两校沟通确定活动具体内容；</p>
                <p style="text-indent:2em;">c.两校沟通确定活动具体内容；</p>
                <p style="text-indent:2em;">d.录制书信写作指导微课。</p>
                <p style="text-indent:2em;">（2）第二阶段（2021年3月7日-3月14日）</p>
                <p style="text-indent:2em;">a.利用微课开展书信写作指导。</p>
                <p style="text-indent:2em;">b.松山湖北区学校七年级学生每人准备一本书，并写一封信给墨江中学学生。</p>
                <p style="text-indent:2em;">c.指导修改各班学生所写的书信。</p>
                <p style="text-indent:2em;">d.松山湖北区学校准备信封和信纸。</p>
                <p style="text-indent:2em;">（3）第三阶段（2021年1月9日-22日）</p>
                <p style="text-indent:2em;">a.寄信。（学生按年级、班级、学号对应墨江中学各级学生。）</p>
                <p style="text-indent:2em;">b.送书。（每一本书扉页上盖东莞市松山湖北区学校公章，留白处给学生写上赠语。）</p>
                <p style="text-indent:2em;">c.墨江中学学生回信。</p>
                <p style="text-indent:2em;">d.开展活动总结。</p>
                <p style="color:#59BEB7;">三、考核管理</p>
                <p style="text-indent:2em;">学期末学生个人评价由过程性评价与终结性评价组成，各占50%，过程性评价由学科组长根据平时考核进行打分评价，终结性评价由各班级预赛时考核小组统一考核，按本班整体写字水平划分优（x＜40%）、良（40%≤x＜80%）、合格（80%≤x＜100%）、不合格（未能掌握基本方法）四个等次。</p>
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
                <p style="border: 0;">
                  2.态度端正
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
          <div class="count">{{pageObj['.pageMerak']+7}}</div>
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
        evaData: []
      }
    },
    created () {
      this.id = this.studentInformationDatas[0]['学号']
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
