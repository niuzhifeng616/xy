<template>
  <div class='honor-sum'>
    <div class="title">
      <img src="./../../views/qualityReport/img/honor/title.png" alt="">
    </div>
    <ul class="honor-sum-lists">
      <li v-for="(item,index) in lists" :key="index">
        <img src="./../../views/qualityReport/img/honor/honorImage.png" alt="">
        <p class="p1">{{name}}</p>
        <p class="p2">2021</p>
        <p class="p3">2022</p>
        <p class="p4">一</p>
        <p class="p5">{{item['类型名称']}} -- {{item['等级']}}</p>
        <p class="p6">2022</p>
        <p class="p7">1</p>
        <p class="p8">27</p>
      </li>
    </ul>
    <div class="page-num">
          <div class="count">{{pageObj['.pageHonor'] + index}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: ['page', 'allData', 'pageObj', 'index', 'name'],
    data () {
      return {
        lists: []
      }
    },
    created () {
      this.showPge(this.page)
    },
    mounted () {},
    methods: {
      // 显示
      showPge (i) {
        if (i === 1) {
          this.lists = this.allData.slice(0, 8)
        } else if (i === 2) {
          this.lists = this.allData.slice(8, 16)
        } else if (i === 3) {
          this.lists = this.allData.slice(16, 24)
        } else if (i === 4) {
          this.lists = this.allData.slice(24, 32)
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.honor-sum{
  position: relative;
  width: 100%;
  height: 100%;
  background: url('./../../views/qualityReport/img/bg1.png') no-repeat;
  background-size: 100% 100%;
  padding-top: 182px;
  .title{
    width: 580px;
    height: 40px;
    margin: 0 auto 18px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .honor-sum-lists{
    padding: 0 100px;
    height: auto;
    li{
      width: 355px;
      height: 246px;
      margin: 11px 22px;
      display: inline-block;
      position: relative;
      img{
        width: 100%;
        height: 100%;
      }
      p{
        font-size: 12px;
      }
      .p1{
        position: absolute;
        top:66px;
        left: 40px;
      }
      .p2{
        position: absolute;
        top:83px;
        left: 68px;
      }
      .p3{
        position: absolute;
        top:83px;
        left: 114px;
      }
      .p4{
        position: absolute;
        top:83px;
        left: 174px;
      }
      .p5{
        font-size: 13px;
        position: absolute;
        top:102px;
        width: 100%;
        text-align: center;
        font-weight: bold;
      }
      .p6{
        position: absolute;
        transform: scale(.7);
        bottom: 41px;
        right: 90px;
      }
      .p7{
        position: absolute;
        transform: scale(.7);
        bottom: 41px;
        right: 78px;
      }
      .p8{
        position: absolute;
        transform: scale(.7);
        bottom: 41px;
        right: 59px;
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
