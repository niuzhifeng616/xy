<template>
  <div id="Wrapper">
    <MenuLeft/>
    <div class="wrap-right">
      <HeaderPublic/>
      <div class="wrap" id="scrollWrap" :style="minHeight" @scroll="listScroll">
        <Crumbs/>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderPublic from '@/pages/compactArrangement/components/common/HeaderPublic.vue'
  import MenuLeft from '@/pages/compactArrangement/components/common/MenuLeft.vue'
  import Crumbs from '@/pages/compactArrangement/components/common/Crumbs.vue'
  import moduleJson from '@/pages/compactArrangement/json/module.json'
  export default {
    name: 'XyHome',
    components: {
      HeaderPublic,
      Crumbs,
      MenuLeft
    },
    data () {
      return {
        minHeight: ''

      }
    },
    created () {
      this.windowResize()
      window.onresize = this.windowResize
      console.log(moduleJson)
      this.$store.commit('common/getModuleData', moduleJson)
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
      padding: 84px 20px 20px;
      height: 100%;
      overflow: auto;
    }
  }

</style>
