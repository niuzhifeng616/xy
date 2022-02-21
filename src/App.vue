<template>
  <a-config-provider :locale="locale">
    <div id="app" @click="clicked">
      <router-view v-if="isRouterAlive"/>
    </div>
  </a-config-provider>
</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import moment from 'moment'
  import 'moment/locale/zh-cn'
  moment.locale('zh-cn')
  export default {
    provide () {
      return {
        reload: this.reload
      }
    },
    data () {
      return {
        locale: zhCN,
        isRouterAlive: true,
        routerQuery: []
      }
    },
    // mounted () {
    // let goUrl = this.isMobile()
    // if (goUrl === 1) {
    //   location = 'http://qa.v1.xiaoyangedu.net:8900/mobile'
    // }
    // },
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick(() => {
          this.isRouterAlive = true
        })
      },
      clicked () {
        this.$store.commit('common/getClickTime', new Date().getTime())
      },
      isMobile () {
        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        localStorage.setItem('ismobile', flag ? 1 : 0)
        let goUrl = flag ? 1 : 0
        return goUrl
      }
    }
  }
</script>
<style lang="less">
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }
</style>
