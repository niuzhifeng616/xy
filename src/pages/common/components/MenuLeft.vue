<template>
  <div class="menu-left">
    <div id="XyLeftMenu" v-if="show" @click="show=false"></div>
    <div class="leftMenu">
      <div class="left-icon-menu">
        <ul class="icon-ul">
          <li v-for="(module,moduleIndex) in moduleList"
            :class="moduleIndex === 0?'icon-active':''"
            :key="module.moduleIndex"
            @mousemove="mousemoveMenuBtn($event,module)"
            @mouseleave="isHoverModuleName=false">
            <div class="icon-img pr">
              <i v-if="module.ID===modelID" class="iconfont active-icons" :class="'icon-'+module.PCIcon+'-active'"></i>
              <i v-else class="iconfont" :class="'icon-'+module.PCIcon"></i>
              <Icon v-if="module.ID===modelID" type="md-arrow-dropleft" class="active-icon-dorpleft"></Icon>
            </div>
          </li>
        </ul>
        <div
          ref="hoverModuleName"
          v-show="isHoverModuleName"
          class="hover-module-name"
          style="position:fixed;text-align: center;width:88px;left:70px;z-index: 9999;padding: 2px 0;background: rgba(1, 8, 64,0.8);color: #fff;border-radius: 4px;"
          >{{hoverModuleName}}</div>
      </div>
      <div class="left-text-menu" ref="TopMenu" @mouseleave="show=false">
        <div style="margin: 20px;font-size: 16px;font-weight: 700;">{{modelName}}</div>
        <div class="text-menu-body pr">
          <template v-for="(rigthModel,i) in moduleList">
            <transition name='menudh' :key="i">
              <div class="module-nav-child" v-if="rigthModel.ID === modelID" :key="i" style="position:absolute;top:0;left:0;right: 0;">
                <div v-for="(application,appIndex) in rigthModel.applications" :key="appIndex">
                    <ul class="liu-category-name-ul">
                      <li
                        v-if="application.subMenu.length>0"
                        class="first-li three"
                        :class="application.ID === activeID?'first-li-active':''"
                        :id="rigthModel.ID">
                        <div class="application-two" @click="applicationBtn(application)">
                          <p v-cloak>
                            <Icon type="md-arrow-dropright" class="i-rotate" :class="application.IsShowThree?'i-active':''"></Icon>
                            <span><i class="iconfont icon-active" :class="'icon-'+application.PCIcon"></i>{{application.Name}}</span>
                          </p>
                        </div>
                          <div class="application-three" v-show="application.IsShowThree">
                            <div v-for="(menu,mi) in application.subMenu" :key="mi">
                              <div
                                :class="menu.ID === activeID?'first-li-active':''"
                                @click="loadHtml(
                                  rigthModel.ID,
                                  application.ID,
                                  menu.ID,
                                  rigthModel.Name,
                                  application.Name,
                                  menu.Name,
                                  application.ServiceDoMainName,
                                  application.WebDoMainName,
                                  menu.ApplicationSubMenuPCUrl,
                                  menu.IsExternal,rigthModel,application,menu,mi)" class="nowrap">{{menu.Name}}</div>
                            </div>
                          </div>
                      </li>
                      <li v-else class="cursor-p null-three"
                        :class="application.ID === activeID?'first-li-active':''"
                        :id="rigthModel.ID"
                        @click.stop="loadLevel2Html(
                          rigthModel.ID,
                          application.ID,
                          rigthModel.Name,
                          application.Name,
                          application.ServiceDoMainName,
                          application.WebDoMainName,
                          application.PCUrl,
                          application.IsExternal,rigthModel,application)">
                        <div class="application-two">
                          <p v-cloak>
                            <i class="iconfont icon-actives" :class="'icon-'+application.PCIcon"></i>
                            <span>{{application.Name}}</span>
                          </p>
                        </div>
                      </li>
                    </ul>
                </div>
              </div>
            </transition>
          </template>
        </div>
        <div class="text-menu-footer" v-if="isShowLogoForFooter">
          <div style="margin-right: 40px;" class="text-center">
            <span style="display:inline-block">
              <img src="/image/Login-logo.png" style="width: 116px;" />
              <!--<img :src="Icon" style="width: 100px;height: 40px;" />-->
              <!--<span style="color:#ECA572;">|</span>-->
            </span>
            <!--<span style="color:#ECA572;font-size:14px;"><img src="../Content/css/icons-module/sildeLogo1.png" style="width:100px;height:16px" /></span>-->
          </div>
          <div style="padding:0 10px;" class="menu-footer">
            <a href="http://www.xiaoyangedu.com/domain/95#am-overview" target="_blank">公司介绍</a>
            <span>|</span>
            <a href="http://www.xiaoyangedu.com/domain/92" target="_blank">产品中心</a>
            <span>|</span>
            <a href="http://www.xiaoyangedu.com/domain/137" target="_blank">典型案例</a>
            <span>|</span>
            <a href="http://www.xiaoyangedu.com/domain/116" target="_blank">服务支持</a>
            <span>|</span>
            <a href="http://www.xiaoyangedu.com/domain/95" target="_blank">关于晓羊</a>
            <span>|</span>
            <a href="http://help.xiaoyangedu.com" target="_blank">帮助中心</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'MenuLeft',
    data () {
      return {
        activeID: -1,
        IsExternal: true, // 是否是第三方站点
        show: false,
        isHoverModuleName: false,
        hoverModuleName: '',
        isShowLogoForFooter: false,
        modelID: -1,
        modelName: '',
        moduleList: []
      }
    },
    computed: {
      modules () {
        return this.$store.state.common.moduleList
      }
    },
    watch: {
      show: {
        handler (vals) {
          if (!vals) {
            let ids = this.$route.query.xy !== undefined ? this.$route.query.xy.split(',') : []
            if (ids.length > 0) {
              if (ids.length === 2) {
                this.modelID = ids[0] - 0
                this.activeID = ids[1] - 0
              } else {
                this.modelID = ids[0] - 0
                this.activeID = ids[2] - 0
              }
            } else {
              this.modelID = -1
              this.activeID = -1
            }
          }
        },
        immediate: true
      },
      modules: {
        handler (vals) {
          this.moduleList = vals
        },
        deep: true,
        immediate: true
      },
      '$route': {
        handler (routers) {
          if (this.moduleList.length > 0 && routers.query.xy) {
            let ids = routers.query.xy.split(',')
            for (let i = 0, len = this.moduleList.length; i < len; i++) {
              if (this.moduleList[i].ID === ids[0] - 0) {
                this.modelID = this.moduleList[i].ID
                this.modelName = this.moduleList[i].Name
                for (let j = 0, jen = this.moduleList[i].applications.length; j < jen; j++) {
                  if (this.moduleList[i].applications[j].subMenu.length > 0) {
                    for (let k = 0, ken = this.moduleList[i].applications[j].subMenu.length; k < ken; k++) {
                      if (this.moduleList[i].applications[j].subMenu[k].ID === ids[2] - 0) {
                        this.activeID = this.moduleList[i].applications[j].subMenu[k].ID
                      }
                    }
                  } else {
                    if (this.moduleList[i].applications[j].ID === ids[1] - 0) {
                      this.activeID = this.moduleList[i].applications[j].ID
                    }
                  }
                }
              }
            }
          } else {
            this.modelID = -1
            this.modelName = ''
            this.activeID = -1
          }
        },
        immediate: true
      }
    },
    updated: function () {
      var menuStyle = this.$refs.TopMenu
      menuStyle.style.transition = 'all 0.5s'
      if (this.show) {
        menuStyle.style.transform = 'translate(0)'
        menuStyle.style.opacity = 1
      } else {
        menuStyle.style.transform = 'translate(-440px,0)'
        menuStyle.style.opacity = 0
      }
    },
    methods: {
      applicationBtn (val) {
        val.IsShowThree = !val.IsShowThree
        this.activeID = val.ID
      },
      loadSubPage (index, e) {
        this.liIndex = index
        this.divIndex = index
        this.liIndexAfter = index
      },
      loadHtml (level1Id, level2Id, level3Id, level1Name, level2Name, level3Name, serviceDoMainName, webDoMainName, url, IsExternal, rigthModel, application, menu, index) {
        this.activeID = level3Id
        if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
          if (IsExternal) {
            let urls = `${url}${url.indexOf('?') > -1 ? '&' : '?'}`
            let tokens = this.xy.getCookie('.XYTOKEN')
            let actumber = this.$store.state.common.actnumber
            window.open(`${urls}token=${tokens}&AccountNumber=${actumber}`)
          } else {
            // this.iframeBreadcrum(level1Id, level2Id, level3Id, level1Name, level2Name, level3Name, serviceDoMainName, webDoMainName, url)
            // return
          }
        }
        this.IsExternal = true
        // let strName = [level1Name, level2Name, level3Name]
        if (url !== null) {
          this.locationFunc(url, rigthModel, application, menu, 1, index)
        } else {
          this.xy.mWarn('温馨提示', '模块正在开发中，敬请期待！')
        }
        this.show = false
      },
      loadLevel2Html (level1Id, level2MID, level1Name, level2Name, serviceDoMainName, webDoMainName, url, IsExternal, rigthModel, application) {
        this.activeID = level2MID
        if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
          if (IsExternal) {
            let urls = `${url}${url.indexOf('?') > -1 ? '&' : '?'}`
            let tokens = this.xy.getCookie('.XYTOKEN')
            let actumber = this.$store.state.common.actnumber
            window.open(`${urls}token=${tokens}&AccountNumber=${actumber}`)
            return
          }
        }
        this.IsExternal = true
        this.show = false
        if (url !== null) {
          this.locationFunc(url, rigthModel, application, {}, 0, 0)
        } else {
          this.xy.mWarn('温馨提示', '模块正在开发中，敬请期待！')
        }
      },
      locationFunc (url, rigthModel, application, menu, isThree, i) {
        this.$store.commit('changeApiPath', `${this.xyApi}/${application.GatewayCode}`)
        let mIds = [rigthModel.ID, application.ID]
        if (isThree === 1) {
          mIds.push(menu.ID)
        }
        this.$router.push({
          path: url,
          query: {
            xy: mIds.join(','),
            cd: application.GatewayCode,
            m: i > 3 ? 1 : 0
          }
        })
        window.scrollTo(0, 0)
      },
      moduleClick: function (event, val) {
        this.modelID = val.ID
        this.modelName = val.Name
        this.show = true
      },
      mousemoveMenuBtn: function (e, val) {
        this.isHoverModuleName = true
        this.$refs.hoverModuleName.style.top = e.y + 'px'
        this.hoverModuleName = val.Name
        this.modelID = val.ID
        this.modelName = val.Name
        this.show = true
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
    background: rgba(255,255,255,0);
}
.menu-left{
  width:60px;
  position:absolute;
  top:0;
  left:0;
  bottom:0;
  background: #0877ff;
  z-index: 1001;
  .leftMenu .left-icon-menu {
    background: #0877ff;
    width: 60px;
    overflow-y: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 101;
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
        transition:all 0.3s;
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
    padding: 0 0 10px;
    opacity: 0;
    overflow-y: auto;
    position: fixed;
    top: 0;
    left: 60px;
    z-index: 100;
    background: #fff;
    height: 100%;
    box-shadow: 0px 4px 8px 0px rgba(190, 190, 190, 0.5);
    transform: translate(-440px,0);
  }

  .leftMenu .text-menu-footer {
      position: absolute;
      bottom: 0;
      height: 50px;
      width: 100%;
      background: #eee;
      line-height: 50px;
      font-size: 12px;
      color: #6B6B6B;
      display: flex;
      justify-content: center;
  }
  .leftMenu .icon-ul {
      padding-top: 15px;
      padding-bottom: 10px;
  }

      .leftMenu .icon-ul li {
          margin-bottom:30px;
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
      background: #4196FF;
      height: 50px;
      padding-top: 8px;
  }

      .leftMenu .down-icon i {
          animation: myfirst 2s infinite;
          color: #fff;
          font-size: 30px;
          cursor: pointer;
      }
}
  .leftMenu .liu-category-name-ul{
    li.three {
      padding-left: 10px;
      div.application-two {
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 50px;
        line-height: 50px;
        padding-left: 6px;
        p{
          font-size: 14px;
          position: relative;
          i.i-rotate{
            font-size: 20px;
            color: #aaa;
            position: absolute;
            bottom: 14px;
            left: 0;
            font-weight: 400;
          }
          i.i-active {
            font-weight: 400;
            transform: rotate(45deg);
          }
          span {
            font-weight: bold;
            font-size: 14px;
            color: #494D5C;
            width: 100%;
            height: 40px;
            line-height: 40px;
            display: inline-block;
            cursor: pointer;
            i.icon-active{
              line-height: 1.8;
              font-size: 16px;
              color: #4196ff;
              margin-left: 16px;
              margin-right: 5px;
            }
          }
          span:hover {
            color: #4196ff;
          }
        }
      }
      div.application-three {
        cursor: pointer;
        div {
          height: 40px;
          line-height: 40px;
          div {
            margin-left: 32px;
            padding-left: 10px;
          }
          div:hover {
            background: rgba(156,156,156,0.15);
          }
          div.first-li-active,
          div.first-li-active:hover{
            color: #0877FF;
            background: rgba(65, 150, 255,.2);
            border-right: 3px solid #0877FF;
          }
        }
      }
    }
    li.null-three{
      padding-left: 25px;
      div.application-two{
        cursor: pointer;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        height: 50px;
        line-height: 50px;
        padding-left: 6px;
        p{
          font-size: 14px;
          font-weight: bold;
          position: relative;
          .icon-actives{
            font-weight: 400;
            line-height: 1.8;
            font-size: 16px;
            color: #4196ff;
            margin-right: 5px;
          }
        }
      }
    }
    li.null-three.first-li-active,
    li.null-three.first-li-active:hover{
      color: #0877FF;
      background: rgba(65, 150, 255,.2);
      border-right: 3px solid #0877FF;
    }
    li.null-three:hover {
      background: rgba(156,156,156,0.15);
    }
  }
  .menudh-enter-active{
    transition: all 0.3s ease 0s;
    transform: translate(0px);
    //opacity: 1;
    //transition: opacity .3s;
  }
  .menudh-enter{
    transition: all 0.3s ease 0s;
    transform: translate(-440px, 0px);
    //opacity: 0;
  }
  .menudh-leave-active{
    transition: all 0.3s ease 0s;
    transform: translate(0px);
    //opacity: 1;
    //transition: opacity .3s;
  }
  .menudh-leave-to{
    transition: all 0.3s ease 0s;
    transform: translate(-440px, 0px);
    //opacity: 0;
  }
</style>
