<template>
<div class="print-body">
  <h1 style="font-size: 1.5em;">访客出入校二维码</h1>
  <img :src="imgUrl" alt="">
</div>

</template>
<script>
  export default {
    data () {
      return {
        imgUrl: ''
      }
    },
    created () {
      var print = JSON.parse(localStorage.getItem('printParams'))
      this.imgUrl = print.imgUrl
      if (this.imgUrl !== '') {
        this.downPDF()
      }
    },
    mounted () {
    },
    methods: {
      downPDF () {
        this.isShowDown = false
        if (this.getExplorer() === 'IE') {
          this.pagesetup_null()
        }
        setTimeout(function () {
          window.print()
        }, 500)
      },
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
      }
    }
  }
</script>
<style >
 #Wrapper{
    overflow:visible !important;
 }
 #Wrapper .menu-left{
  display: none;
}
#Wrapper #XyHeader{
  display: none;
}
.wrap-right{
  overflow:visible !important;
  left: 0 !important;
}
.wrap-right .wrap{
  padding: 0 !important;
   overflow:visible !important;
}
.print-body{
  width:794px;
  margin:0 auto;
  page-break-before: auto;
  page-break-after: always;
  text-align: center;
  position: absolute;
  top: 40%;
  left: 50%;
  margin-top: -11%;
  margin-left: -397px;
}
</style>
