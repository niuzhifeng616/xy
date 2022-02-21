//摇光星 社团课程
<template>
  <div class="page-merak">
      <div class="main">
        <div class="title">
          {{alkaidClass['选修课程']}}活动记录
        </div>
        <div class="titColors">
          <span v-for="(item, index) in colors" :key="index" :style="{background: item}"></span>
        </div>
        <div class="imgsWrap">
          <div class="imgs">
            <div v-for="(img, index) in alkaidClass.imgs" :key="img['社团图片']" v-show="img['图片类型'] === '2' && index < 4">
              <img :src="img['社团图片']" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="page-num">
          <div class="count">{{pageObj['.pageAlkaid']+index + 1}}</div>
      </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: ['alkaidClass', 'pageObj', 'index'],
    data () {
      return {
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
  background: url('./../../views/qualityReport/img/alkaid/alkaidBg2.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  .main{
    position: absolute;
    top: 205px;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    .title {
      color: #A5CB0D;
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
        width: 69px;
        height: 5px;
      }
    }
  }
}
.imgsWrap {
  margin-top: 52px;
  height: 622px;
  margin-bottom: 416px;
  .imgs {
    // display: flex;
    // align-items: center;
    // flex-wrap: wrap;
    padding: 0 60px 0 72px;
    >div {
      float: left;
      width: 420px;
      height: 281px;
      margin-right: 13px;
      margin-bottom: 30px;
      img {
        width: 100%;
        height: 100%;
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
