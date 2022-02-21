<template>
  <div class='assessment'>
      <div class="title">
        <img src="./../../views/qualityReport/img/assessment.png" alt="">
        <span>导师寄语</span>
      </div>
      <div class="desc">
        <div class="techer-text">{{text[0]['评语内容']}}</div>
        <div class="techer-name">
          <p>学业导师：<span class="techer-name-span">{{text[0]['学业导师']}}</span></p>
          <p>活动导师：<span class="techer-name-span">{{text[0]['活动导师']}}</span></p>
        </div>
      </div>
    <div class="page-num">
          <div class="count">{{pageObj['.pageTeacherAssessment']}}</div>
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
        text: '导师寄语导师寄语导师寄语导师寄语导师寄语导师寄语',
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
        let res = await this.xy.get(`${this.api}/getComment3`, {
          xuehao: this.id
        }, true)
        if (res.retCode === 100000) {
          this.text = JSON.parse(res.retData)
          // console.log(JSON.parse(res.retData))
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.assessment{
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/bg1.png') no-repeat;
  background-size: 100% 100%;
  // padding: 313px 59px 0 72px;
  padding-top: 183px;
  position: relative;
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
}
.desc{
  width: 732px;
  height: 928px;
  margin: 0 auto;
  padding: 40px;
  border:3px dashed  #3498db;
  border-radius: 10px;
  position: relative;
  .techer-text{
  color:#000;
  text-indent: 40px;
  line-height: 30px;
  }
  .techer-name{
    position: absolute;
    bottom: 30px;
    right: 30px;
    p{
      color: #000;
      .techer-name-span{
      display: inline-block;
      width: 100px;
      height:40px;
      border-bottom: 1px solid #000;
      text-align: center;
      padding-top: 14px;
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
