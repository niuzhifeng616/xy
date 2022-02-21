//封面
<template>
  <div class="page-one">
      <div class="logo">
        <img src="./../../views/qualityReport/img/logo.png" alt="">
      </div>
      <div class="main">
        <div class="title">
          <img src="./../../views/qualityReport/img/title.png" alt="">
        </div>
        <div class="school-year">{{schoolYear}}</div>
        <div class="student-information">
          <div>
            <span>班级：</span>
            <span class="sis">{{studentInformationDatas[0]['展示班级']}}班</span>
          </div>
          <div>
            <span>姓名：</span>
            <span  class="sis">{{studentInformationDatas[0]['姓名']}}</span>
          </div>
          <div>
            <span>学号：</span>
            <span  class="sis">{{studentInformationDatas[0]['学号']}}</span>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {
      i: String,
      studentInformationDatas: Array
    },
    data () {
      return {
        schoolYear: '2021-2022学年度第一学期'
      }
    },
    created () {
    },
    mounted () {

    },
    methods: {}
  }
</script>
<style lang='less' scoped>
.page-one{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/bg.png') no-repeat;
  background-size: 100% 100%;
  .logo{
    width: 244px;
    height: 53px;
    margin-left:80px;
    padding-top:68px;
    img{
      width: 100%;
      height: auto;
    }
  }
  .main{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top:273px;
    .title{
      width: 504px;
      height: 156px;
      margin:0 auto;
      img{
        width: 504px;
        height: 156px;
      }
    }
    .school-year{
      color: #ffffff;
      font-size: 33px;
      padding-top:30px;
    }
    .student-information{
      color: #ffffff;
      font-size: 20px;
      margin-top: 146px;
      span{
        margin-top: 13px;
        display: inline-block;
      }
      .sis{
        width: 300px;
        line-height: 22px;
        border-bottom: 2px solid rgba(255,255,255,0.45);
        text-align: center;
      }
    }
  }
}
</style>
