<template>
  <div class='assessment'>
      <div class="title">
        <img src="./../../views/qualityReport/img/assessment.png" alt="">
        <span>学生自评</span>
      </div>
      <div class="desc">{{text[0]['学生自评']}}</div>
    <div class="page-num">
          <div class="count">{{pageObj['.pageStudentAssessment']}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        id: '',
        text: '导师寄语导师寄语导师寄语导师寄语导师寄语导师寄语',
        api: 'http://prod.dmapi.xiaoyangedu.com/openapi/output/studentReport'
      }
    },
    props: ['pageObj', 'studentInformationDatas'],
    created () {
      this.id = this.studentInformationDatas[0]['学号']
      this.getData()
    },
    mounted () {},
    methods: {
      // 获取数据
      async getData () {
        let res = await this.xy.get(`${this.api}/getStudentSelfComment3`, {
          xuehao: this.id
        }, true)
        if (res.retCode === 100000) {
          // alert(1)
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
  padding: 20px 50px;
  border:3px dashed  #3498db;
  border-radius: 10px;
  text-indent: 40px;
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
