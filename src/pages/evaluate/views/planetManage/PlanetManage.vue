<template>
  <div class='planet'>
    <div class='planet-title'>
      北斗七星评价系统
    </div>
    <div @click="back" class="back">
      <i class="iconfont" style="margin-right:20px">&#xe6a5;</i>
      <span>返回</span>
    </div>
    <div class="content">
        <div class="line_img"></div>
        <!--瑶光星-->
        <div class="alkaid">
          <div class="alkaid_text">瑶光星</div>
        </div>
        <!--开阳星-->
        <div class="mizar">
          <div class="mizar_text">开阳星</div>
        </div>
        <!--玉衡星-->
        <div class="alioth">
           <div class="alioth_text">玉衡星</div>
        </div>

        <!---天权星-->
        <div class="megrez" @click="toMegrez">
           <div class="megrez_text">天权星</div>
        </div>
        <!--天矶星-->
        <div class="phecda">
          <div class="phecda_text">天玑星</div>
        </div>
        <!--天枢星-->
        <div class="dubhe" @click="toDubhe">
          <div class="dubhe_text">天枢星</div>
        </div>

        <!--天璇星-->
        <div class="merak">
          <div class="merak_text">天璇星</div>
        </div>

    </div>
  </div>
</template>
<script>
  export default {
    name: 'PlanetManage',
    data () {
      return {
      }
    },
    created () {},
    mounted () {},
    methods: {
      back () {
        this.$router.go(-1)
      },
      toMegrez () {
        let router = this.$router.resolve({
          path: '/Megrez'
        })
        window.open(router.href, '_blank')
      },
      async toDubhe () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarProgrammeRule/GetStarProgrammeDisciplineInfo?starTypeID=1`)
        if (res.success) {
          if (res.data.length > 0) {
            let router = this.$router.resolve({
              path: '/Dubhe'
            })
            window.open(router.href, '_blank')
          } else {
            this.xy.msgError('当前方案暂无关联学科')
          }
        } else {
          console.log(res)
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.planet {
  width: 100%;
  height: 100%;
  background: url("./imgs/starrySkey.png") no-repeat -1px -1px;
  background-size:100% 100% ;
  padding-top: 24px;
 .planet-title{
    width: 100%;
    height: 66px;
    background: url('./imgs/titleBg.png') no-repeat left top;
    background-size: 100% 100%;
    text-align: center;
    line-height: 58px;
    font-size: 30px;
    color: #fff;
 }
 .line_img{
    width: 72%;
    height: 228px;
    background: url('./imgs/line.png') no-repeat left top;
    background-size: 100% 100%;
    position: absolute;
    left: 13%;
    top: 42%;
 }
 .alkaid{
    width: 156px;
    height: 156px;
    background: url('./imgs/Alkaid.png') no-repeat left top;
    background-size: 100% 100%;
    position: absolute;
    left:8%;
    top: 57%;
 }
 .alkaid_text{
    position: absolute;
    left:18%;
    bottom: -35%;
    font-size: 28px;
    font-weight: 500;
    color: #feb640;
 }
 .mizar{
    width: 108px;
    height: 108px;
    background: url('./imgs/Mizar.png') no-repeat left top;
    background-size: 100% 100%;
    position: absolute;
    left:17%;
    top: 38%;
 }
 .mizar_text{
    position: absolute;
    left:15%;
    bottom: -40%;
    font-size: 28px;
    font-weight: 500;
    color: #03c2fe;
 }
 .alioth{
    width: 87px;
    height: 87px;
    background: url('./imgs/Alioth.png') no-repeat left top;
    background-size: 100% 100%;
    position: absolute;
    left:29%;
    top: 43%;
 }
 .alioth_text{
   position: absolute;
    left:0%;
    bottom: -46%;
    font-size: 28px;
    font-weight: 500;
    color: #df2e04;
 }

 .megrez{
    width: 263px;
    height: 391px;
    background: url('./imgs/Megrez.png') no-repeat left top;
    background-size: 100% 100%;
    position: absolute;
    left:41%;
    top: 20%;
 }
 .megrez_text{
    position: absolute;
    left:30%;
    top: 100%;
    font-size: 28px;
    font-weight: 500;
    color: #fdd775;
 }
 .phecda{
    width: 124px;
    height: 124px;
    background: url('./imgs/Phecda.png') no-repeat left top;
    background-size: 100% 100%;
    position: absolute;
    left: 60%;
    top: 59%;
 }
  .phecda_text{
    position: absolute;
    left:15%;
    top: 98%;
    font-size: 28px;
    font-weight: 500;
    color: #5be19d;
 }
 .dubhe{
    width: 142px;
    height: 142px;
    background: url('./imgs/Dubhe.png') no-repeat left top;
    background-size: 100% 100%;
    position: absolute;
    left: 72%;
    top: 39%;
 }
 .dubhe_text{
    position: absolute;
    left:20%;
    top: 100%;
    font-size: 28px;
    font-weight: 500;
    color: #fb5f00;
 }
 .merak{
    width: 124px;
    height: 124px;
    background: url('./imgs/Merak.png') no-repeat left top;
    background-size: 100% 100%;
    position: absolute;
    left: 81%;
    top: 55%;

 }
 .merak_text{
  position: absolute;
  left:16%;
  top:110%;
  font-size: 28px;
  font-weight: 500;
  color: #eb5ce8;
 }
 .back{
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    letter-spacing: 0px;
    position:absolute;
    right: 20px;
    top: 50px;
 }
}
</style>
