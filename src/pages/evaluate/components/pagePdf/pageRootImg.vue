<template>
  <div class='rootImg'>
    <div class="top">
      <h3>
        <span v-if="phecdaResImg">{{phecdaResImg.活动名称}}活动记录</span>
      </h3>
      <div class="color-span">
        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
     </div>
    <div class="content">
         <div class="imgsWrap">
          <div class="imgs" v-if="phecdaResImg">
            <div class="firLine">
              <div><img :src="phecdaResImg.图片名称1" alt=""></div>
              <div><img :src="phecdaResImg.图片名称2" alt=""></div>
              <div class="colorBg"></div>
            </div>
            <div class="secLine">
              <div class="colorBg"></div>
              <div><img :src="phecdaResImg.图片名称3" alt=""></div>
              <div><img :src="phecdaResImg.图片名称4" alt=""></div>
            </div>
            <div class="thiLine">
              <div><img :src="phecdaResImg.图片名称5" alt=""></div>
              <div class="colorBg"></div>
              <div><img :src="phecdaResImg.图片名称6" alt=""></div>
            </div>
            <div class="fouLine">
              <div class="colorBg"></div>
              <div><img :src="phecdaResImg.图片名称7" alt=""></div>
              <div><img :src="phecdaResImg.图片名称8" alt=""></div>
            </div>
          </div>
        </div>
        <!-- <div class="imgsWrap" v-else>
          <div class="imgs">
            <div class="firLine">
              <div><img :src="imgArr2[0]" alt=""></div>
              <div><img :src="imgArr2[1]" alt=""></div>
              <div class="colorBg"></div>
            </div>
            <div class="secLine">
              <div class="colorBg"></div>
              <div><img :src="imgArr2[2]" alt=""></div>
              <div><img :src="imgArr2[3]" alt=""></div>
            </div>
          </div>
        </div> -->
    </div>
    <div class="page-num">
      <div class="count">{{pageObj['.pagePhecda']+2*(index + 1)}}</div>
      <!-- <div class="count"  v-if="type === 'familyRes'">{{pageObj['.pagePhecda']+4}}</div>
      <div class="count"  v-if="type === 'migrateRes'">{{pageObj['.pagePhecda']+6}}</div> -->
    </div>
  </div>
</template>
<script>
  export default {
    props: ['phecdaResImg', 'index', 'pageObj'],
    name: '',
    data () {
      return {
        imgArr2: []
      }
    },
    created () {
    },
    mounted () {
      // let arr = Object.keys(this.phecdaRes[0])
      // let index3 = 0
      // for (let i = 0; i < arr.length; i++) {
      //   if (arr[i] === '综评等级') {
      //     index3 = i
      //   }
      // }
      // let imgArr = arr.slice(index3 + 1)
      // for (let i of imgArr) {
      //   this.imgArr2.push(this.phecdaRes[0][i])
      // }
      // console.log(this.imgArr2, '????#@!3123123123213??#?@#?!@?#@!?#?!@#?!@?#!@?')
    },
    methods: {}
  }
</script>
<style lang='less' scoped>
.rootImg{
    width: 100%;
    height: 100%;
    background: url('./../../views/qualityReport/img/phecda/rootBg.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;
    position: relative;
    padding-top:185px;
}

.title{
  width: 281px;
  height: 60px;
  background: url('./../../views/qualityReport/img/phecda/rootTitle.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  overflow: hidden;
  top:203px;
  left: 358px;
}
.title1{
  width: 281px;
  height: 60px;
  background: url('./../../views/qualityReport/img/phecda/familyTitle.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  overflow: hidden;
  top:203px;
  left: 358px;
}
.title2{
  width: 281px;
  height: 60px;
  background: url('./../../views/qualityReport/img/phecda/migrateTitle.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  overflow: hidden;
  top:203px;
  left: 358px;
}
.content{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.img{
  width: 50%;
  img{
    width: 100%;
    height: 100%;
  }
}
.imgsWrap {
  margin:0 auto 40px;
  height: 1060px;
  //margin-bottom: 40px;
}
.imgs {
  margin-top: 60px;
  >div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 856px;
    margin-bottom: 12px;
  }
  >div>div {
    width: 358px;
    height: 238px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .colorBg {
    width: 117px;
    height: 238px;
  }
  .firLine .colorBg, .thiLine .colorBg {
    background: #59BEB7;
  }
  .secLine .colorBg {
    background: #B4DFE8;
  }
  .fouLine .colorBg {
    background: #EAA700;
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
</style>
