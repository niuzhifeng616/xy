<template>
  <div class="xy-content-module">
    <div class="warp">
      <div class="top" style="95%">
        <h2>访客出入校二维码</h2>
        <vue-qr class="vue-qr" ref="qrCode" :text="config.text" :logoScale="50" :size="200"></vue-qr>
        <div class="btn">
          <Button class="xy-primary" @click="downImg" style="width:80px">下载</Button>
          <Button class="xy-info" style="margin-left:10px;width:80px" @click="downPDF">打印</Button>
        </div>
      </div>
      <div class="bot"  style="95%">
        <h3 style="font-weight: 600;margin-bottom:12px">说明</h3>
        <p style="font-weight: 600">访客出入校二位码为访客进出学校使用。</p>
        <p>将二维码下载或者打印，放在学校门卫室，访客在入校或者出校时，通过登录学校智慧校园平台扫描二维码记录出入校时间等信息。</p>
      </div>
    </div>
  </div>
</template>
<script>
  import VueQr from 'vue-qr'
  export default {
    name: 'VisitCode',
    data () {
      return {
        config: {
          text: this.xyMobileUrl + '/home/VisitApplyDetails'
        }
      }
    },
    components: {
      VueQr
    },
    created () {
      console.log(this.xyMobileUrl + '/home/VisitApplyDetails')
    },
    methods: {
      getExplorer () {
        var explorer = window.navigator.userAgent

        if (explorer.indexOf('MSIE') >= 0) { // ie
          return 'IE'
        } else if (explorer.indexOf('Firefox') >= 0) { // firefox
          return 'Firefox'
        } else if (explorer.indexOf('Chrome') >= 0) { // Chrome
          return 'Chrome'
        } else if (explorer.indexOf('Opera') >= 0) { // Opera
          return 'Opera'
        } else if (explorer.indexOf('Safari') >= 0) { // Safari
          return 'Safari'
        }
      },
      downImg () {
        let Qrcode = this.$refs.qrCode
        let exportLink = Qrcode.$el.currentSrc
        console.log(exportLink)
        this.imgSrc = exportLink
        var a = document.createElement('a')
        var event = new MouseEvent('click')
        a.download = '访客二维码'
        a.href = exportLink
        a.dispatchEvent(event)
      },
      myPrint () {
        let Qrcode = this.$refs.qrCode
        let exportLink = Qrcode.$el.currentSrc
        let print = {
          imgUrl: exportLink
        }
        this.$store.commit('common/getParam', print)
        localStorage.setItem('printParams', JSON.stringify(print))
        let routeUrl = this.$router.resolve({
          path: '/xyHome/sa/VisitCodePrint',
          query: this.$store.state.menuInfo
        })
        window.open(routeUrl.href, '_blank')
      },
      downPDF () {
        if (this.getExplorer() === 'IE') {
          this.pagesetup_null()
        }
        setTimeout(() => {
          this.myPrint()
        }, 500)
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module{
  background: #fff;
  margin: 10px 20px;
  min-height: 90%;
}
.warp{
  width: 100%;
  .top{
    width: 50%;
    margin: 0 auto;
    text-align: center;
    padding: 92px 0 15px 0;
    border-bottom: 1px solid #e9e9e9;
    #qrcode {
      display: inline-block;
      img {
        width: 132px;
        height: 132px;
        background-color: #fff; //设置白色背景色
        padding: 6px; // 利用padding的特性，挤出白边
      }
    }
    h2{
      font-size: 16px;
      font-weight: 700;
      color: rgba(0,0,0,0.85);
      line-height: 22px;
      margin-bottom: 20px;
    }
    .img{
      width: 200px;
      height: 200px;
      background: #d8d8d8;
      margin: 15px auto;
    }
    .btn{
      margin: 30px 0 15px 0;
    }
  }
  .bot{
    width: 48%;
    margin: 0 auto;
    text-align: left;
    padding: 30px;
    :nth-child(1) {
      font-size: 16px;
      font-weight: SC;
      text-align: left;
      color: rgba(0,0,0,0.45);
      line-height: 22px;
    }
    :nth-child(2) {
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      color: rgba(0,0,0,0.45);
      line-height: 20px;
    }
    :nth-child(3) {
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: rgba(0,0,0,0.45);
      line-height: 20px;
    }
  }
}
</style>
