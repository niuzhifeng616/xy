//开阳星 照片
<template>
  <div class="page-merak">
      <div class="main">
        <div class="title">
          {{evaData[0]['活动名称']}}
        </div>
        <div class="titColors">
          <span v-for="(item, index) in colors" :key="index" :style="{background: item}"></span>
        </div>
        <div class="imgsWrap">
          <div class="imgs" v-if="evaData.length !== 0">
            <div class="firLine">
              <div><img :src="evaData[0].图片地址" alt=""></div>
              <div><img :src="evaData[1].图片地址" alt=""></div>
              <div class="colorBg"></div>
            </div>
            <div class="secLine">
              <div class="colorBg"></div>
              <div><img :src="evaData[2].图片地址" alt=""></div>
              <div><img :src="evaData[3].图片地址" alt=""></div>
            </div>
            <div class="thiLine">
              <div><img :src="evaData[4].图片地址" alt=""></div>
              <div class="colorBg"></div>
              <div><img :src="evaData[5].图片地址" alt=""></div>
            </div>
            <div class="fouLine">
              <div><img :src="evaData[6].图片地址" alt=""></div>
              <div><img :src="evaData[7].图片地址" alt=""></div>
              <div class="colorBg"></div>
            </div>
          </div>
        </div>
        <div class="page-num">
         <div class="count">{{pageObj['.pageMizar'] + (index+1) * 2 + 1}}</div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: ['studentInformationDatas', 'evaData', 'pageObj', 'index'],
    data () {
      return {
        id: '',
        colors: [
          '#FFCA59', '#FF912B', '#E24956', '#8C103D', '#065280', '#34B2E3', '#64D1DA', '#6BDABC'
        ]
      }
    },
    created () {

    },
    mounted () {},
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
    padding-top:204px;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
  }
}
.title {
  color: #786BAE;
  font-size: 40px;
}
.titColors {
  height: 5px;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    display: inline-block;
    width: 54px;
    height: 5px;
  }
}
.imgsWrap {
  height: 1060px;
  margin-bottom: 40px;
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
    width: 334px;
    height: 238px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .colorBg {
    width: 164px;
    height: 238px;
  }
  .firLine .colorBg, .thiLine .colorBg {
    background: #D1CCE5;
  }
  .secLine .colorBg {
    background: #D1CCE5;
  }
  .fouLine .colorBg {
    background: #D1CCE5;
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
