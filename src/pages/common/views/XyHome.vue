<template>
  <div id="Wrapper">
    <MenuLeft/>
    <div class="wrap-right">
      <HeaderPublic/>
      <div class="wrap" id="scrollWrap" ref="wrap" :style="minHeight" @scroll="listScroll">
      <Crumbs/>
        <router-view v-show="isShowRouter"/>
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderPublic from '@/pages/common/components/HeaderPublic.vue'
  import Crumbs from '@/pages/common/components/Crumbs.vue'
  import MenuLeft from '@/pages/common/components/MenuLeft.vue'

  export default {
    name: 'XyHome',
    components: {
      HeaderPublic,
      Crumbs,
      MenuLeft
    },
    watch: {
      '$route': {
        handler (routers) {
          if (routers.name === 'module' ||
            routers.name === 'SelectTeacherOrgDemo' ||
            routers.name === 'XyTableDemo' ||
            routers.name === 'SelectStudentDemo' ||
            routers.name === 'SelectDutyAndRoleDemo' ||
            routers.name === 'SelectClassRoomDemo' ||
            routers.name === 'SelectClassesDemo' ||
            routers.name === 'SelectClassRadioDemo' ||
            routers.name === 'CropperDemo' ||
            routers.name === 'WorkflowDemo' ||
            routers.name === 'workflowApplyDemo' ||
            routers.name === 'SetDetail' ||
            routers.name === 'workflowApprovalDemo' ||
            routers.path.indexOf('MsgInfo') > -1) {
            this.getGlobal()
          }
        },
        // deep: true,
        immediate: true
      },
      '$store.state.common.clickTime': function (val) {
        this.lTime = val
      },
      tOut (val) {
        this.tOut = val
      }
    },
    data () {
      return {
        minHeight: '',
        lTime: this.$store.state.common.clickTime, // 最后一次点击的时间
        ctTime: new Date().getTime(), // 当前时间
        // tOut: 10 * 60 * 1000 // 超时时间10min
        tOut: Number(this.$store.state.common.automaticLogOutTime) * 60 * 1000, // 超时时间,
        realTimeClData: null,
        isShowRouter: true
      }
    },
    created () {
      this.windowResize()
      window.onresize = this.windowResize
      // 第三方跳转
      let RouteUrl = this.xy.getCookie('RouteUrl')
      if (RouteUrl) {
        this.isShowRouter = false
      } else {
        this.isShowRouter = true
      }
    },
    destroyed () {
      window.onresize = null
    },
    mounted () {
    },
    methods: {
      listScroll (e) {
        let str = [e.target.scrollLeft, e.target.scrollTop].join(',')
        this.$store.commit('common/setWrapXY', str)
      },
      windowResize () {
        let windowH = document.documentElement.clientHeight || document.body.clientHeight
        let powerHeight = windowH - 50
        this.minHeight = {
          'min-height': (powerHeight) + 'px'
        }
      },
      async getGlobal () {
        this.xy.loading()
        let res = await this.xy.get(this.xyApi + '/xy/comm/Global')
        if (res.success) {
          this.$store.commit('common/getUserBaseInfo', res.data.User)
          if (res.data.Modules.length > 0) {
            let modules = res.data.Modules
            modules.forEach(item => {
              for (let i = 0, len = item.applications.length; i < len; i++) {
                this.$set(item.applications[i], 'IsShowThree', true)
              }
              switch (item.ModuleCode) {
                case 'base':// 基础数据
                  this.$set(item, 'Bg', 'linear-gradient(180deg,#0273ff, #0273ff 27%, #4196ff 55%, rgba(65,150,255,0))')
                  this.$set(item, 'BgImg', 'home-base.svg')
                  this.$set(item, 'BgColor', require('@/assets/common/home/home-blue.svg'))
                  break
                case 'csms':// 一人一课表
                  this.$set(item, 'Bg', 'linear-gradient(180deg,#00ad75, #00ae76 17%, #02ce8a 49%, rgba(2,205,138,0))')
                  this.$set(item, 'BgImg', 'home-yrykb.svg')
                  this.$set(item, 'BgColor', require('@/assets/common/home/home-green.svg'))
                  break
                case 'ea':// 智慧教务
                  this.$set(item, 'Bg', 'linear-gradient(180deg,#00ad75, #00ae76 17%, #02ce8a 49%, rgba(2,205,138,0))')
                  this.$set(item, 'BgImg', 'home-zhjw.svg')
                  this.$set(item, 'BgColor', require('@/assets/common/home/home-green.svg'))
                  break
                case 'eva':// 智慧评价
                  this.$set(item, 'Bg', 'linear-gradient(180deg,#ffa324, #ffa325 22%, #feb54f 45%, rgba(254,182,80,0))')
                  this.$set(item, 'BgImg', 'home-zhpj.svg')
                  this.$set(item, 'BgColor', require('@/assets/common/home/home-yellow.svg'))
                  break
                case 'oa':// 智慧办公
                  this.$set(item, 'Bg', 'linear-gradient(180deg,#0273ff, #0273ff 27%, #4196ff 55%, rgba(65,150,255,0))')
                  this.$set(item, 'BgImg', 'home-zhbg.svg')
                  this.$set(item, 'BgColor', require('@/assets/common/home/home-blue.svg'))
                  break
                case 'sa':// 智慧校务
                  this.$set(item, 'Bg', 'linear-gradient(180deg,#00ad75, #00ae76 17%, #02ce8a 49%, rgba(2,205,138,0))')
                  this.$set(item, 'BgImg', 'home-zhxw.svg')
                  this.$set(item, 'BgColor', require('@/assets/common/home/home-green.svg'))
                  break
                case 'att':// 考勤系统
                  this.$set(item, 'Bg', 'linear-gradient(180deg,#ff852f, #ff852f 27%, rgba(255,133,47,0.75) 52%, rgba(255,133,47,0))')
                  this.$set(item, 'BgImg', 'home-kqxt.svg')
                  this.$set(item, 'BgColor', require('@/assets/common/home/home-red.svg'))
                  break
                case 'inp':// 电子班牌
                  this.$set(item, 'Bg', 'linear-gradient(180deg,#0273ff, #0273ff 27%, #4196ff 55%, rgba(65,150,255,0))')
                  this.$set(item, 'BgImg', 'home-bp.svg')
                  this.$set(item, 'BgColor', require('@/assets/common/home/home-blue.svg'))
                  break
                case 'sys':// 系统设置
                  this.$set(item, 'Bg', 'linear-gradient(180deg,#0273ff, #0273ff 27%, #4196ff 55%, rgba(65,150,255,0))')
                  this.$set(item, 'BgImg', 'home-setting.svg')
                  this.$set(item, 'BgColor', require('@/assets/common/home/home-blue.svg'))
                  break
                case '':// 第三方
                  this.$set(item, 'Bg', 'linear-gradient(180deg,#ff852f, #ff852f 27%, rgba(255,133,47,0.75) 52%, rgba(255,133,47,0))')
                  this.$set(item, 'BgImg', 'home-three.svg')
                  this.$set(item, 'BgColor', require('@/assets/common/home/home-red.svg'))
                  break
              }
            })
            this.$store.commit('common/getServiceDomainData', res.data.ServiceDomains)
            this.$store.commit('common/getAccountName', res.data.Account.AccountName)
            this.$store.commit('common/getAutomaticLogOutTime', res.data.Account.AutomaticLogOutTime)
            this.$store.commit('common/getAccountNumber', res.data.Account.AccountNumber)
            // 无操作登出
            if (this.tOut !== null) {
              this.realTimeClData = setInterval(() => {
                this.tTime()
              }, 1000)
            }
          }
          this.$store.commit('common/getModuleData', res.data.Modules)
          // 第三方跳转
          let RouteUrl = this.xy.getCookie('RouteUrl')
          if (RouteUrl) {
            // this.$router.push(`/${RouteUrl}`)
            let webSiteTitle = res.data.Account.AccountName
            localStorage.setItem('webSiteTitle', webSiteTitle)
            let parentItem = ''
            let application = ''
            let subMenu = ''
            let moduleList = res.data.Modules
            for (let i = 0; i < moduleList.length; i++) {
              for (let m = 0; m < moduleList[i].applications.length; m++) {
                if (moduleList[i].applications[m].PCUrl === RouteUrl) {
                  parentItem = moduleList[i]
                  application = moduleList[i].applications[m]
                  console.log('1')
                } else {
                  for (let n = 0; n < moduleList[i].applications[m].subMenu.length; n++) {
                    if (moduleList[i].applications[m].subMenu[n].ApplicationSubMenuPCUrl === RouteUrl) {
                      console.log('2')
                      parentItem = moduleList[i]
                      application = moduleList[i].applications[m]
                      subMenu = moduleList[i].applications[m].subMenu[n]
                    }
                  }
                }
              }
            }
            this.$store.commit('changeApiPath', `${this.xyApi}/${parentItem.ModuleCode}`)
            let mIds = [parentItem.ID, application.ID]
            if (subMenu) {
              mIds.push(subMenu.ID)
              this.$router.push({
                path: RouteUrl,
                query: {
                  xy: mIds.join(','),
                  cd: parentItem.ModuleCode,
                  m: 0
                }
              })
            } else {
              this.$router.push({
                path: RouteUrl,
                query: {
                  xy: mIds.join(','),
                  cd: parentItem.ModuleCode
                }
              })
            }
            window.scrollTo(0, 0)
            this.xy.removeCookie('RouteUrl')
            setTimeout(() => {
              this.isShowRouter = true
            }, 500)
          }
        }
        this.xy.unloading()
      },
      tTime () {
        if (this.$store.state.common.automaticLogOutTime !== 0) {
          this.tOut = Number(this.$store.state.common.automaticLogOutTime) * 60 * 1000
          this.ctTime = new Date().getTime()
          if ((this.ctTime - this.lTime) > this.tOut) {
            console.log('超时登出')
            this.$store.commit('common/getAutomaticLogOutTime', null)
            this.xy.removeCookie('.XYTOKEN')
            localStorage.clear()
            this.$router.push('/')
            clearInterval(this.realTimeClData)
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  #Wrapper {
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .wrap-right {
    position: absolute;
    top: 0;
    left: 60px;
    right: 0;
    bottom: 0;
    overflow: hidden;
    .wrap {
      padding: 50px 0 10px;
      height: 100%;
      overflow: auto;
    }
  }

</style>
