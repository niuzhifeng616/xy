<template>
  <div style="padding:10px;">
    <div class="banner">
      <img :src="require('@/assets/common/home/home-banner.svg')" alt="" />
    </div>
    <div
      v-cloak
      ref="moduleClassify"
      class="module-classify"
      v-for="item of moduleList"
      :key="item.ID"
    >
      <div class="module-classify-title">
        <div v-cloak class="module-name">
          <div class="module-title">
            <div class="title">{{ item.Name }}</div>
            <div class="text">{{ item.Description }}</div>
          </div>
          <div class="bg" :style="{ background: item.Bg }"></div>
          <img
            :style="{
              left:
                item.ModuleCode === 'ea' || item.ModuleCode === 'sa'
                  ? '10px'
                  : ''
            }"
            :src="require('@/assets/common/home/' + item.BgImg)"
          />
        </div>
        <ul class="module-ul">
          <li v-for="childItem of item.applications" :key="childItem.ID">
            <a class="menu-click-level" @click="loadHtml(item, childItem)"></a>
            <div class="li-box">
              <div class="module-info">
                <div>
                  <div class="module-icon-box">
                    <div
                      class="module-icon"
                      :style="{
                        backgroundImage: 'url(' + item.BgColor + ')',
                        'background-size': '100% 100%'
                      }"
                    >
                      <i
                        class="iconfont"
                        :class="'icon-' + childItem.PCIcon"
                      ></i>
                    </div>
                  </div>
                  <div class="module-icon-text">
                    <div class="module-title">{{ childItem.Name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ModuleFunc',
    data () {
      return {
        IsExternal: false,
        isHoverModuleName: false,
        hoverModuleName: '',
        show: false,
        moduleList: [],
        isShowLogoForFooter: false
      }
    },
    created () {
      this.$store.commit('changeApiPublic', `${this.xyApi}/approve`)
      var body = document.querySelector('body')
      var that = this
      body.addEventListener('click', function (e) {
        // 监听二维码
        if (e.target.id === 'QaCode' || e.target.id === 'MyCode') {
          that.isCodeBox = !that.isCodeBox
        } else {
          that.isCodeBox = false
        }
        // 监听个人信息
        if (e.target.id === 'MyName') {
          that.isDataShow = !that.isDataShow
        } else {
          that.isDataShow = false
        }
      })
    },
    computed: {
      modules () {
        return this.$store.state.common.moduleList
      }
    },
    watch: {
      modules: {
        handler (vals) {
          this.moduleList = vals
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      applicationBtn (val) {
        val.IsShowThree = !val.IsShowThree
      },
      loadHtml (parentItem, application) {
        if (
          application.PCUrl.indexOf('http://') > -1 ||
          application.PCUrl.indexOf('https://') > -1
        ) {
          if (application.IsExternal) {
            let urls = `${application.PCUrl}${
              application.PCUrl.indexOf('?') > -1 ? '&' : '?'
            }`
            let tokens = this.xy.getCookie('.XYTOKEN')
            let actumber = this.$store.state.common.actnumber
            window.open(`${urls}token=${tokens}&AccountNumber=${actumber}`)
            return
          }
        }
        this.IsExternal = true
        this.show = false
        this.locationFunc(parentItem, application)
      },
      locationFunc (parentItem, application) {
        // this.$store.commit(
        //   'changeApiPath',
        //   `${this.xyApi}/${parentItem.ModuleCode}`
        // )
        this.$store.commit(
          'changeApiPath',
          `${this.xyApi}/${application.GatewayCode}`
        )
        let mIds = [parentItem.ID, application.ID]
        if (application.subMenu.length > 0) {
          mIds.push(application.subMenu[0].ID)
        }
        this.$router.push({
          path:
            application.subMenu.length > 0
              ? application.subMenu[0].ApplicationSubMenuPCUrl
              : application.PCUrl,
          query: {
            xy: mIds.join(','),
            cd: application.GatewayCode
          }
        })
        window.scrollTo(0, 0)
      }
    }
  }
</script>
<style lang="less" scoped>
#XyLeftMenu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0);
}
.leftMenu {
  background: rgba(65, 150, 255, 0.1);
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: #fff;
  box-shadow: 0px 4px 8px 0px rgba(190, 190, 190, 0.5);
  z-index: 1001;
  display: flex;
  .left-icon-menu {
    background: #0877ff;
    width: 60px;
    overflow-y: auto;
  }
}
.leftMenu .left-icon-menu i {
  color: #fff;
  padding-top: 10px;
  cursor: pointer;
  /*width: 80px;*/
  font-size: 20px;
  cursor: pointer;
  position: relative;
  z-index: 999;
  transition: all 0.3s;
  /*background: #4196FF;*/
}
.leftMenu .left-icon-menu i:hover,
.leftMenu .left-icon-menu i.active-icons {
  font-size: 30px;
  transition: all 0.3s;
}
.leftMenu .left-icon-menu .back-img {
  padding-top: 10px;
  cursor: pointer;
  width: 80px;
  cursor: pointer;
  position: relative;
  z-index: 999;
  background: rgb(99, 146, 233);
}

.leftMenu .left-text-menu {
  width: 206px;
  overflow-y: auto;
}

.leftMenu .text-menu-footer {
  position: absolute;
  bottom: 0;
  height: 50px;
  width: 100%;
  background: #eee;
  line-height: 50px;
  font-size: 12px;
  color: #6b6b6b;
  display: flex;
  justify-content: center;
}
.leftMenu .liu-category-name-ul li {
  padding-left: 20px;
  /*padding: 10px;
        border-bottom: 1px dashed #eee;
        transition: all .3s;
        height: 50px;
        line-height: 50px;
        padding-left: 10px;*/
}
.leftMenu .liu-category-name-ul li.null-three:hover {
  color: #0877ff;
  background: rgba(65, 150, 255, 0.2);
  border-right: 3px solid #0877ff;
  /*color: #fff;*/
  /*transition: all .3s;*/
}
.leftMenu .liu-category-name-ul li > div.application-two {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
}
.leftMenu .liu-category-name-ul li > div.application-three {
  cursor: pointer;
}
.leftMenu .liu-category-name-ul li > div.application-three > div {
  /*width:50%;
                text-align:center;*/
  height: 50px;
  line-height: 50px;
  /*padding-left: 10px;*/
}
.leftMenu .liu-category-name-ul li > div.application-three > div > div {
  margin-left: 14px;
  padding-left: 10px;
  /*width: 90%;
                    margin: 10px;
                    line-height: 34px;
                    border-radius: 34px;
                    background: rgba(65, 150, 255,.1);
                    color: #4878E3;
                    padding: 0 10px;*/
}
.leftMenu .liu-category-name-ul li > div.application-three > div > div:hover {
  /*transition: all .3s;*/
  color: #0877ff;
  background: rgba(65, 150, 255, 0.2);
  border-right: 3px solid #0877ff;
}
.leftMenu .liu-category-name-ul li div.icons {
  width: 64px;
}
.leftMenu .liu-category-name-ul li div.icons > img {
  width: 100%;
}
.leftMenu .liu-category-name-ul li i {
  font-size: 20px;
  color: #aaa;
  position: absolute;
  bottom: 14px;
  left: -16px;
}
.leftMenu .liu-category-name-ul li i.i-active {
  transform: rotate(45deg);
}
.leftMenu .liu-category-name-ul li p {
  font-size: 14px;
  font-weight: bold;
  position: relative;
}
.leftMenu .liu-category-name-ul li span {
  font-size: 14px;
  color: #494d5c;
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: inline-block;
  cursor: pointer;
}

.leftMenu .liu-category-name-ul li span:hover {
  color: #4196ff;
}

.leftMenu .liu-category-name-ul li span label {
  cursor: pointer;
}

.leftMenu .icon-ul {
  padding-top: 15px;
  padding-bottom: 10px;
}

.leftMenu .icon-ul li {
  margin-bottom: 30px;
  text-align: center;
  cursor: pointer;
}

.leftMenu .icon-ul li .icon-img {
  /*width: 40px;
                height: 40px;
                line-height: 40px;*/
  text-align: center;
  /*background: #fff;*/
  border-radius: 8px;
  margin: 0 auto 5px;
  overflow: hidden;
  /*box-shadow: 0px 4px 4px 0px rgba(190,190,190,0.2)*/
}
.leftMenu .icon-ul li .icon-img .active-icon-dorpleft {
  font-size: 20px;
  color: rgb(255, 255, 255);
  top: 0;
  position: absolute;
  right: -8px;
}
.leftMenu .icon-ul li .icon-name > span {
  font-size: 15px;
  color: #666;
}

.leftMenu .icon-active .icon-name {
  font-size: 15px;
  color: #4196ff !important;
}

.leftMenu .down-icon {
  position: absolute;
  z-index: 999;
  bottom: 0;
  text-align: center;
  width: 80px;
  background: #4196ff;
  height: 50px;
  padding-top: 8px;
}

.leftMenu .down-icon i {
  animation: myfirst 2s infinite;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
}
.banner {
  width: 100%;
  margin-bottom: 10px;
  img {
    width: 100%;
  }
}
.menu-btn {
  position: fixed;
  left: 0;
  top: 50%;
  cursor: pointer;
  z-index: 1000;
  animation-timing-function: ease-in-out;
  animation-name: breathe;
  animation-duration: 1500ms;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
@keyframes breathe {
  0% {
    opacity: 1;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.module-ul .module-info-nodesc {
  width: 72%;
  border-width: 1px;
  border-style: solid;
  border-color: #9f9f9f;
  border-radius: 4px;
  margin: 0 auto;
  transition: all 0.3s;
}

.module-ul .module-info {
  width: 72%;
  height: 166px;
  border-width: 1px;
  border-style: solid;
  border-color: #9f9f9f;
  border-radius: 4px;
  margin: 0 auto;
  transition: all 0.3s;
}
.clor-rad {
  color: #ff0000;
}

/* 20181030首页改版 */
.top-img-box {
  position: relative;
  display: block;
  opacity: 1;
  transition: all 0.5s;
}

.top-img-bg {
  transition: all 0.5s;
  opacity: 0;
}

.imgshow {
  transition: all 3s;
  opacity: 0;
  display: none;
}

.top-img-box > .top-img-close {
  position: absolute;
  top: 15px;
  right: 15px;
  color: #d5d5f1;
  cursor: pointer;
  width: 80px;
  height: 36px;
  line-height: 36px;
  border-radius: 8px;
  background: RGBA(77, 172, 255, 0.2254);
  text-align: center;
  transition: all 0.3s;
}

.top-img-box > .top-img-close:hover {
  transition: all 0.3s;
  background: RGBA(77, 172, 255, 0.4);
  color: #fff;
}

.top-img-box > .top-img-main {
  width: 100%;
  opacity: 1;
}

.menu-click-level {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.module-classify {
  background-color: #fff;
  padding: 10px;
  .module-classify-title {
    display: flex;
    min-height: 250px;
    border: 1px solid #eee;
  }
}

.module-classify:nth-child(2n) {
  background-color: #fff;
}

.module-classify {
  .module-classify-title {
    .module-name {
      position: relative;
      width: 119px;
      font-size: 16px;
      color: #fff;
      letter-spacing: 1px;
      padding-bottom: 5px;
      .module-title {
        position: absolute;
        top: 20px;
        padding: 0 10px;
        z-index: 10;
        width: 100%;
        .title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .text {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
        }
      }
      .bg {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 9;
      }
      img {
        position: absolute;
        bottom: 0;
        z-index: 2;
      }
    }
  }
}
.module-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex: 1;
}

.module-ul.margin-bottom100 {
  margin-bottom: 100px;
}

.module-ul.margin-bottom170 {
  margin-bottom: 170px;
}

.module-ul.margin-bottom230 {
  margin-bottom: 230px;
}

.module-ul > li {
  width: 136px;
  height: 116px;
  margin: 10px;
  position: relative;
  background: #fff;
  text-align: center;
  transition: all 0.5s;
  border-radius: 4px;
}

.module-ul > li:hover {
  transition: all 0.5s;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.module-ul > .libox-hidden {
  transition: all 0.5s;
  margin-top: 63px;
  height: 0px;
  overflow: auto;
}
.module-ul > .libox-hidden .module-icon-text {
  transition: all 0.3s;
  margin-top: -63px;
}

.module-ul > .libox-hidden .module-icon-box {
  transition: all 0.3s;
  margin-top: -63px;
}

.module-ul > .libox-hidden-after {
  overflow: inherit;
}

.module-ul > .libox-hidden-after > div {
  transition: all 0.5s;
}

.module-ul .module-info-nodesc {
  width: 100%;
  height: auto;
  border-width: 1px;
  border-style: solid;
  border-color: #9f9f9f;
  border: none !important;
  border-radius: 4px;
  margin: 0;
  transition: all 0.5s;
}

.module-ul .module-info {
  width: 100%;
  height: auto;
  border-width: 1px;
  border-style: solid;
  border-color: #9f9f9f;
  border: none !important;
  border-radius: 4px;
  margin: 0;
  box-shadow: none;
  transition: all 0.3s;
}

.module-ul > li .module-icon-box {
  transition: 0.5s;
}
.module-ul > li .module-icon-text {
  transition: 0.5s;
}
.module-ul > .libox-hidden .module-icon-text {
  transition: 0.5s;
  margin-top: -63px;
}
.module-ul .module-info-top-nodesc {
  height: auto;
  margin-bottom: 10px;
}

.module-ul .module-info-top {
  height: auto;
  transition: all 0.5s;
}
.module-ul .module-info-title {
  padding: 10px;
}
.module-ul .module-icon {
  display: inline-block;
  width: 62px;
  height: 62px;
  line-height: 62px;
  margin: 10px 0;
}
.module-ul .module-icon .iconfont {
  color: #fff;
  font-size: 26px;
}
.module-ul .module-icon > img {
  text-align: center;
  transition: all 0.5s;
  width: 138px;
}

.module-ul .module-title {
  float: initial;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
  margin-bottom: 20px;
  width: 100%;
  transition: all 0.5s;
}

.module-ul .module-info-describe {
  color: #7f7f7f;
  padding: 0px 12px;
}

.module-ul .module-info-msg {
  padding: 0px 12px;
  color: #9f9f9f;
  border: none !important;
  padding: 0;
  margin-top: 11px;
  height: 20px;
  line-height: 20px;
  transition: all 0.3s;
}

.module-info-msg {
  border-top-width: 1px;
  border-top-style: solid;
  margin-top: 8px;
  height: 34px;
  line-height: 34px;
}

.module-ul .module-info-msg-left {
  float: inherit;
  width: auto;
}

.module-ul .module-info-msg-right {
  float: inherit;
}

.module-ul .firstchildbox-show .module-info-top {
  height: auto;
  transition: all 0.5s;
  opacity: 0;
}
.module-box > .module-box-icon {
  width: 25px;
  height: 25px;
  float: left;
}

.module-box > .module-box-icon > .m-module-icon {
  display: inline-block;
  width: 25px;
  height: 25px;
  line-height: 25px;
  border-radius: 50%;
  text-align: center;
  color: #fff;
  opacity: 0.8;
}

.module-box > .module-box-icon > .m-module-icon > img {
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 50%;
  text-align: center;
  margin: 0 auto;
  color: #fff;
}
.module-box > .module-box-tit {
  float: left;
}

.module-box > .module-box-tit > .module-box-text {
  height: 24px;
  font-size: 18px;
  font-weight: bold;
  color: #444;
  line-height: 24px;
  margin-left: 10px;
}
.module-cont {
  padding: 10px;
  text-align: left;
  color: #444;
}

.module-cont > span {
  color: #7f7f7f;
}

.module-ul > .module-ul-btn {
  width: 46%;
  margin: 8px 2%;
}

.module-btn {
  width: 100%;
  height: 38px;
  line-height: 38px;
  vertical-align: middle;
  background: rgba(65, 150, 255, 0.2);
  border: 1px solid #e1ecff;
  text-align: center;
  color: #4196ff;
  font-size: 14px;
  padding: 0;
  border-radius: 4px;
  transition: all 0.3s;
  padding-left: 10px;
  padding-right: 10px;
  border: none;
}

.module-btn:hover {
  transition: all 0.3s;
  background: #4196ff;
  color: #fff;
}

ul > li > .childbox-show {
  transition: all 0.3s;
  margin-top: -50%;
  height: auto;
  padding: 30px;
}
.module-ul .childbox-show .module-info-top {
  transition: all 0.3s;
  margin-top: 0;
}

.index-nav {
  height: 60px;
  background: rgba(255, 255, 255, 0.8);
}

.index-nav > div {
  width: 94%;
  height: 60px;
  background: #fff;
  box-shadow: 0px 2px 8px 0px rgba(141, 150, 161, 0.2);
  border-radius: 4px;
  margin: 0 auto;
  position: absolute;
  top: 0px;
  left: 50%;
  margin-left: -47%;
  display: flex;
  transform: translate(0px, -30px);
  transition: all 0.5s;
}

.index-nav-name {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}
.index-nav-name .nav-name-color {
  color: #7f7f7f;
}
.index-nav-name-underline.active {
  width: 40px;
  height: 2px;
  background: #4196ff;
  margin: 0 auto;
  position: absolute;
  bottom: 0px;
  left: 50%;
  margin-left: -20px;
}

.isInitital-opacity {
  opacity: 0.5;
}
</style>
