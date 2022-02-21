<template>
  <div class='tableContent'>
    <div class="title">
      <span>松山湖北区学校</span>
      <span>学生个性化成长报告</span>
    </div>
    <div class="pageNum">
      <p class="chinese">目录</p>
      <p class="english">CONTENTS</p>
    </div>
    <div class="pageNumBox">
      <div class="item" style="justify-content:flex-start">
       <p class="text3" style="margin-left:114px">校长寄语</p>
      </div>
       <!--<div class="introduce">北区星辰评价体系</div>-->
      <div class="item">
        <p class="text4" style="margin-left:-6px">北区星辰评价体系</p>
        <p class="dashed4"></p>
        <p class="num">1</p>
      </div>
      <div class="item">
        <p class="text">天权星</p>
        <p class="dashed2"></p>
        <p class="num">{{pageObj['.pageMegrez']}}</p>
      </div>
      <div class="item">
        <p class="text">天枢星</p>
        <p class="dashed2"></p>
        <p class="num">{{pageObj['.pageDubhe']}}</p>
      </div>
      <div class="item">
        <p class="text">玉衡星</p>
        <p class="dashed2"></p>
        <p class="num">{{pageObj['.pageAlioth']}}</p>
      </div>
      <div class="item">
        <p class="text">天璇星</p>
        <p class="dashed2"></p>
        <p class="num">{{pageObj['.pageMerak']}}</p>
      </div>
      <div class="item">
        <p class="text">天玑星</p>
        <p class="dashed2"></p>
        <p class="num">{{pageObj['.pagePhecda']}}</p>
      </div>
      <div class="item">
        <p class="text">瑶光星</p>
        <p class="dashed2"></p>
        <!-- <p class="num" v-if="gradeText === '初一(2021级)' || gradeText === '初二(2020级)'">{{pageObj['.pageAlkaid'] + 2}}</p> -->
        <p class="num">{{pageObj['.pageAlkaid'] + 1}}</p>
      </div>
      <div class="item">
        <p class="text">开阳星</p>
        <p class="dashed2"></p>
        <!-- <p class="num" v-if="gradeText === '初一(2021级)' || gradeText === '初二(2020级)'">{{pageObj['.pageMizar'] + 2}}</p> -->
        <p class="num">{{pageObj['.pageMizar'] + 1}}</p>
      </div>
      <div class="item">
        <p class="text3">个人荣誉</p>
        <p class="dashed"></p>
        <p class="num">{{pageObj['.pageHonor']}}</p>
      </div>
      <div class="item">
        <p class="text3">学生自评</p>
        <p class="dashed"></p>
        <p class="num">{{pageObj['.pageStudentAssessment']}}</p>
      </div>
      <div class="item">
        <p class="text3">导师寄语</p>
        <p class="dashed"></p>
        <p class="num">{{pageObj['.pageTeacherAssessment']}}</p>
      </div>
      <div class="item">
        <p class="text2">假期实践作业</p>
        <p class="dashed3"></p>
        <p class="num">{{pageObj['.homeWork']}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: ['pageObj', 'grade', 'gradeText'],
    data () {
      return {
        dd: {}
      }
    },
    watch: {
      obj (value) {
        // console.log(value)
        this.dd = value
      },
      pageObj (val) {
        // console.log(val)
      }
    },
    mounted () {},
    methods: {}
  }
</script>
<style lang='less' scoped>
.tableContent{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/tableContent/contentBg.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.title{
  font-size: 20px;
  font-weight: 300;
  span:nth-child(2) {

  color: #008cb3;
  }
  span{
    color: #113675;
  }
  position: absolute;
  top: 91px;
  right: 80px;

}
.pageNum{
  padding: 247px 141px 0 0 ;
   text-align: right;
  .chinese{
    font-size: 40px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #007abb;
  }
  .english{
    font-size: 30px;
    font-family: PingFangSC, PingFangSC-Light;
    color: #888889;
    line-height: 40px;
  }
}
.pageNumBox{
  margin-top: 109px;
  .introduce {
    color: #007abb;
    font-size: 20px;
    margin: 30px 0;
    padding-left: 114px;
  }
  .item{
     display:flex;
     justify-content: center;
     align-items: center;
     margin-top: 30px;
     .text{
        width: 72px;
     }
    .dashed{
      width: 657px;
      height: 1px;
      border: 1px dashed #3e3a39;
      margin: 0 8px;
    }
    .dashed2{
      width: 659px;
      height: 1px;
      border: 1px dashed #3e3a39;
      margin: 0 8px;
    }
    p{
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Light;
      color: #231916;
    }
    .text2{
      width: 155px;
      font-size: 20px;
      font-family: PingFangSC, PingFangSC-Medium;
      color: #007abb;
    }
    .text3 {
      font-size: 20px;
      font-family: PingFangSC, PingFangSC-Medium;
      color: #007abb;
    }
    .text4 {
      font-size: 20px;
      font-family: PingFangSC, PingFangSC-Medium;
      color: #007abb;
    }
    .dashed3{
      width: 578px;
      height: 1px;
      border: 1px dashed #3e3a39;
      margin: 0 8px;
    }
     .dashed4{
      width: 572px;
      height: 1px;
      border: 1px dashed #3e3a39;
      margin: 0 8px;
    }
    .num {
      width: 22px;
    }
  }
}
.page-num {
  width: 100%;
  height: 60px;
  background: #fff url('./../../views/qualityReport/img/pageNum2.png') no-repeat left top;
  background-size: 100% 30px;
  position: absolute;
  bottom: 20px;
  .count{
    text-align: center;
    line-height: 30px;
  }
}
</style>
