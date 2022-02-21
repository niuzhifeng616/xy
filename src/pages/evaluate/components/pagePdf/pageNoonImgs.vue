//天璇星 午练
<template>
  <div class="page-merak">
      <div class="main">
        <div class="title">
          午练课程活动记录
        </div>
        <div class="titColors">
          <span v-for="(item, index) in colors" :key="index" :style="{background: item}"></span>
        </div>
        <div class="imgsWrap">
          <div class="imgs" v-if="evaData.length !== 0">
            <div class="firLine">
              <div><img :src="evaData[1].图片名称1" alt=""></div>
              <div><img :src="evaData[1].图片名称2" alt=""></div>
              <div class="colorBg"></div>
            </div>
            <div class="secLine">
              <div class="colorBg"></div>
              <div><img :src="evaData[1].图片名称3" alt=""></div>
              <div><img :src="evaData[1].图片名称4" alt=""></div>
            </div>
            <div class="thiLine">
              <div><img :src="evaData[1].图片名称5" alt=""></div>
              <div class="colorBg"></div>
              <div><img :src="evaData[1].图片名称6" alt=""></div>
            </div>
            <div class="fouLine">
              <div class="colorBg"></div>
              <div><img :src="evaData[1].图片名称7" alt=""></div>
              <div><img :src="evaData[1].图片名称8" alt=""></div>
            </div>
          </div>
        </div>
        <div class="page-num">
          <div class="count">{{pageObj['.pageMerak']+4}}</div>
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
        evaData: [],
        colors: [
          '#FFCA59', '#FF912B', '#E24956', '#8C103D', '#065280', '#34B2E3', '#64D1DA', '#6BDABC'
        ],
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
    width: 100%;
  }
}
.title {
  color: #44B79E;
  font-size: 40px;
  text-align: center;
}
.titColors {
  height: 5px;
  margin-top: 2px;
  text-align: center;
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
  margin: 60px 70px 0;
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
</style>
