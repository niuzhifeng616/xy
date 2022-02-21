<template>
  <div id="AMS_Management" class="AMS-management">
    <div class="left-ment">
      <!-- :style="{ height: Theight }" -->
      <div class="left-top" @click="loadHome">
        AMS后台管理系统
      </div>
      <ul class="menu-ul">
        <li
          v-for="(menu, index) in leftMenu"
          :key="index"
          @click="loadPage(index)"
          :class="menu.isActive ? 'left-active' : ''"
          >
          <img :src="menu.isActive ? menu.icon : menu.activeIcon" />
          <span v-cloak>{{ menu.name }}</span>
        </li>
      </ul>
      <div @click="loginOut" class="login-out">
        <img src="@/assets/common/ams/loginOut.png" />
        <span>退出</span>
      </div>
    </div>
    <div class="right-content">
      <!-- :style="{ height: Theight }" -->
      <div id="XyAMScontent">
        <!-- AMSGbVal: AMS Global Value -->
        <!-- 页脚设置 -->
        <FooterSeeting v-if="leftMenu[0].isActive" :AMSGbVal="{ accountID }" />
        <!-- 周次设置 -->
        <Weekly v-if="leftMenu[1].isActive" :AMSGbVal="{ accountID }" />
        <!-- 菜单配置 -->
        <MenuManage v-if="leftMenu[2].isActive" :AMSGbVal="{ accountID }" />
        <!-- 学习阶段配置 -->
        <LearningPhase v-if="leftMenu[3].isActive" :AMSGbVal="{ accountID }" />
        <!-- LDAP设置 -->
        <LDAPSetting v-if="leftMenu[4].isActive" :AMSGbVal="{ accountID }" />
      </div>
    </div>
  </div>
</template>

<script>
  import FooterSeeting from './components/FooterSetting.vue'
  import Weekly from './components/Weekly.vue'
  import MenuManage from './components/MenuManage.vue'
  import LearningPhase from './components/LearningPhase.vue'
  import LDAPSetting from './components/LDAPSetting.vue'
  export default {
    name: 'AMS_Framework',
    components: {
      FooterSeeting,
      Weekly,
      MenuManage,
      LearningPhase,
      LDAPSetting
    },
    data () {
      return {
        minHeight: {},
        Theight: '',
        accountID: 0,
        leftMenu: [
          {
            name: '页脚设置',
            isActive: false,
            activeIcon: require('@/assets/common/ams/ams11.png'),
            icon: require('@/assets/common/ams/ams1.png'),
            url: '/AMS/PC/View/FooterSetting.html'
          },
          {
            name: '周次设置',
            isActive: false,
            icon: require('@/assets/common/ams/ams21.png'),
            activeIcon: require('@/assets/common/ams/ams2.png'),
            url: '/AMS/PC/View/Weekly.html'
          },
          {
            name: '菜单配置',
            isActive: false,
            icon: require('@/assets/common/ams/ams31.png'),
            activeIcon: require('@/assets/common/ams/ams3.png'),
            url: '/AMS/PC/View/MenuManage.html'
          },
          {
            name: '学习阶段配置',
            isActive: false,
            icon: require('@/assets/common/ams/ams41.png'),
            activeIcon: require('@/assets/common/ams/ams4.png'),
            url: '/AMS/PC/View/LearningPhase.html'
          },
          // {
          //    name: '排课中枢配置',
          //    isActive: false,
          //    icon: require('@/assets/common/ams/ams51.png'),
          //    activeIcon: require('@/assets/common/ams/ams5.png'),
          //    url: '/AMS/PC/View/CourseArranging.html'
          // },
          {
            name: 'LDAP设置',
            isActive: false,
            icon: require('@/assets/common/ams/ams61.png'),
            activeIcon: require('@/assets/common/ams/ams6.png'),
            url: '/AMS/PC/View/LDAPSetting.html'
          }
        ]
      }
    },
    created: function () {
      const getValues = this.$route.query.ID
      if (getValues) {
        this.accountID = Number(getValues)
      }
      this.siteID = getValues
      this.windowResize()
      window.onresize = this.windowResize
    },
    destroyed () {
      window.onresize = null
    },
    mounted: function () {
      this.title = '页脚设置'
      this.loadPage(0)
    },
    methods: {
      windowResize () {
        // 屏幕高度
        this.Theight = $(window).height() + 'px'
        // 加载时获取最小高度
        var winH = $(window).height()
        var headerH = $('#XyHeader').height()
        var footerH = $('#XyFooter').height()
        var powerHeight = winH - headerH - footerH
        this.minHeight = {
          'min-height': powerHeight + 'px'
        }
      },
      // 菜单点击
      loadPage (index) {
        this.leftMenu.forEach(item => {
          item.isActive = false
        })
        this.leftMenu[index].isActive = true
        // xy.http.load(
        //   `${xy.webUrl}${this.leftMenu[index].url}`,
        //   { targetID: 'XyAMScontent' }
        // )
      },
      // 首页
      loadHome () {
        this.$router.push('ams/siteList')
        //  { targetID: 'XyAMS' }
      },
      loginOut () {
        this.$Modal.confirm({
          title: '退出',
          content: '<p>您确认要退出吗？</p>',
          onOk: () => {
            this.xy.removeCookie('.AMSXYTOKEN')
            this.$router.push({ name: 'AMS_login' })
          },
          onCancel: () => {}
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.right-content {
  margin-left: 280px;
  margin-top: 85px;
  overflow-y: auto;
}
.left-ment {
  background: url(~@/assets/common/ams/leftBG.png) left no-repeat;
  width: 260px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
}
.left-top {
  text-align: center;
  height: 67px;
  line-height: 67px;
  font-size: 22px;
  color: #fff;
  font-weight: bold;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.2);
  cursor: pointer;
}
.left-active {
  background: #fff;
}
.left-active span {
  color: #52524f;
}
.menu-ul {
  width: 260px;
  margin: 53px auto;
}
.menu-ul li {
  height: 62px;
  line-height: 62px;
  padding-left: 46px;
  color: #fff;
  cursor: pointer;
}
.menu-ul li img {
  width: 18px;
}
.menu-ul li span {
  margin-left: 26px;
  font-size: 16px;
  font-weight: 400;
}
.login-out {
  position: absolute;
  bottom: 54px;
  right: 64px;
  cursor: pointer;
}
.login-out span {
  color: #fff;
  margin-left: 5px;
  vertical-align: middle;
}
</style>
