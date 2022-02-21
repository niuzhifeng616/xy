<template>
  <div class='xy-content-module'>
    <div class='xy-content-body lanclass'>
      <!-- 选择类型 -->
      <div>
        <p class="check-header">请选择互动课堂方式</p>
        <div class="radio-box">
          <div class="start-box left">
              <img class="start-img" style="width:194px;height:130px;" src="@/assets/lanclass/type_1.png" alt="图片"/>
              <div class="start-text col0-85">我是主讲学校</div>
              <div class="text-center">
                <Button class="xy-primary" shape="circle" @click="startFun(1)" style="margin-right:0">进入主界面</Button>
              </div>
          </div>
          <div class="start-box">
              <img class="start-img" style="width:157px;height:130px;" src="@/assets/lanclass/type_2.png" alt="图片"/>
              <div class="start-text col0-85">我是听讲学校</div>
              <div class="text-center">
                <Button class="xy-primary" shape="circle" @click="startFun(2)" style="margin-right:0">进入主界面</Button>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
      }
    },
    created () {},
    mounted () {},
    methods: {
      startFun (type) {
        if (type === 1) {
          // 主讲学校
          this.$store.commit('common/getThreeMenuName', '')
          this.$router.push({ path: '/xyhome/MainSchool', query: this.$store.state.common.menuInfo })
        } else {
          // 听课学校
          this.$store.commit('common/getThreeMenuName', '')
          this.$router.push({ path: '/xyhome/ListeningSchool', query: this.$store.state.common.menuInfo })
        }
      }
    }
  }
</script>
<style lang='less' scoped>
@media all and (max-width:1367px) {
  .xy-content-body.lanclass{
    min-height: 670px;
  }
}
@media all and (min-width:1368px) and (max-width:1680px) {
  .xy-content-body.lanclass{
    min-height: 730px;
  }
}
@media all and (min-width:1681px) and (max-width:1920px) {
  .xy-content-body.lanclass{
    min-height: 800px;
  }
}
@media all and (min-width:1921px) {
  .xy-content-body.lanclass{
    min-height: 820px;
  }
}
.check-header{
  font-size: 20px;
  color: rgba(0,0,0,0.85);
  font-weight: 700;
  text-align: center;
  margin: 95px 0 50px;
}
.radio-box{
  display:flex;
  justify-content: center;
}
.start-box{
  width: 302px;
  height: 342px;
  background: #ffffff;
  border: 1px solid #dadada;
  border-radius: 10px;
  padding: 40px 45px 0;
  text-align: center;
  // cursor: pointer;
}
.start-box:hover{
  border-color: #1677ff;
}
.start-box.left{
  margin-right: 80px;
}
.start-box .start-img{
  margin-bottom: 25px;
  width: 100%;
  height: 130px;
}
.start-box .start-text{
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 50px 0;
}
.check-radio{
  font-size: 18px;
  font-weight: 700;
  color: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
