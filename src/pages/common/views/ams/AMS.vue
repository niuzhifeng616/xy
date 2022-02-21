<template>
  <div id="AMS" class="AMS">
    <div class="AMS-common-header">
      <div class="header-nav">
        <div class="clearfix header-title">
          <div
            class="fl"
            @click="loadHome"
            style="height:65px;line-height:65px;"
            >
            <span class="xy-logo cursor-p">
              <img
                src="@/assets/common/logo.png"
                style="margin-left:10px;margin-top:-20px;"
                />
              <span class="school-name" style="margin-left:8px;">AMS后台管理系统</span>
            </span>
          </div>
          <div class="fr header-info">
            <img src="@/assets/common/yrykb.png" class="fl user-img" />
            <span class="cursor-p fl" id="MyName">
              <span class="user-name" id="MyName1">
                {{this.xy.getCookie('.userName')}}
              </span>
              <!--<i class="fa fa-chevron-down" id="MyName2"></i>-->
            </span>
          </div>
        </div>

        <!--<transition name="loginOut">
                <div id="loginOut" class="pfxed" v-show="isDataShow" >
                    <span @click="loginOut">退出登录</span>
                </div>
            </transition>-->
      </div>
    </div>

    <div id="XyMain" class="clearfix">
      <router-view />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SiteList',
    data () {
      return {
        isDataShow: false
      }
    },
    created: function () {
      // 是否已经登录
      const token = this.xy.getCookie('.AMSXYTOKEN')
      console.log(token)
      if (!token || token === 'undefined') {
        this.$router.push('/ams/login')
      }
      // TODO: 原包含的内容：监听个人信息 ？？？
      var body = document.querySelector('body')
      body.addEventListener('click', e => {
        if (
          e.target.id === 'MyName' ||
          e.target.id === 'MyName1' ||
          e.target.id === 'MyName2'
        ) {
          this.isDataShow = !this.isDataShow
        } else {
          this.isDataShow = false
        }
      })
    },
    methods: {
      loadHome () {
        this.$router.push('/ams/siteList')
      },
      // 退出登录
      loginOut () {
        this.$Modal.confirm({
          title: '退出',
          content: '<p>您确认要退出吗？</p>',
          onOk: () => {
            this.xy.removeCookie('.AMSXYTOKEN')
            this.$router.push('/ams/login')
          },
          onCancel: () => {}
        })
      }
    }
  }
</script>

<style lang="less" scpoed>
html,
body {
  background-color: #fff !important;
  height: 100%;
}
</style>

<style lang="less" scpoed>
// TODO: 临时全局存放（之前就是这样的），有待进一步拆解
.AMS {
  .no-data-box {
    width: 392px;
    margin: 13% auto;
    position: relative;
  }

  .no-data-box > .no-data-img {
    width: 100%;
  }

  .no-data-box > .no-data-text {
    position: absolute;
    top: 110%;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: #ccc;
    display: inline-table;
  }
  &-common {
    &-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0px;
      height: 65px;
      background-color: #fff;
      z-index: 999;
      box-shadow: 0px 2px 15px 0px rgba(107, 107, 107, 0.09);
      .header-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .header-info {
        display: flex;
        align-items: center;
        justify-items: center;
      }
      .user-img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin: 0 20px 0 9px;
        outline: none;
        border: 1px solid #fff;
        box-shadow: 0 2px 15px 0 rgba(107, 107, 107, 0.09);
        transition: all 0.3s;
      }
      .user-name {
        font-size: 18px;
      }
    }
  }
  .xy-logo img {
    width: 36px;
    padding-top: 8px;
  }
  /*AMS通用*/
  #XyContentModule {
    min-height: inherit;
    padding: 15px 0;
  }
  #XyContentAccount {
    min-height: inherit;
    background-color: white;
  }
  #XyContentAccount > .row {
    min-height: inherit;
  }
  #XyContentAccount .leftList {
    width: auto !important;
  }
  #XyContentAccount .leftList > li:first-child {
    margin-top: 0;
  }
  #XyContentAccount .leftList > li {
    margin-top: 15px;
    font-size: 16px;
    cursor: pointer;
    border-left: 4px solid #4285f4;
    height: 36px;
    line-height: 36px;
  }
  #XyContentAccount .leftList:after {
    width: 0;
  }
  #XyContentAccount .leftList > .activeLi {
    background-color: #eef4ff;
  }

  #XyContentAccount .leftList > li > .ivu-icon {
    font-size: 26px;
    padding: 0 10px;
    color: #4285f4;
  }

  #XyContentAccount .rightContent {
    min-height: inherit;
    border-left: 1px solid #dcdee2;
  }
  #XyContentAccount .breadcrumb {
    height: 36px;
    line-height: 36px;
    color: white;
    background-color: #4d94f7;
    padding: 0 15px;
  }
  #XyContentAccount .breadcrumb .ivu-icon {
    margin-right: 10px;
    font-size: 20px;
  }
  #XyContentAccount .rightContent > .tabs {
    padding: 20px;
    text-align: center;
  }
  .Form {
    width: 600px;
    margin: 20px auto;
  }
  .Form label {
    font-size: 16px !important;
  }
  #loginOut {
    top: 51px;
    right: 0px;
    width: 100px;
    border: 1px solid #eee;
    background-color: white;
    box-shadow: 13px 13px 18px -5px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  #loginOut span {
    display: inline-block;
    font-size: 14px;
    padding: 10px;
    cursor: default;
    width: 100%;
  }
  #loginOut span:hover {
    color: #2d8cf0;
  }
  #XyAMSContent {
    background: #fff;
    height: 100%;
    margin-bottom: 20px;
  }

  /*学习阶段配置*/
  #learningSetting .table {
    width: 500px;
    margin: 50px auto;
    font-size: 16px;
    border: 1px solid #eaeaea;
    text-align: center;
  }
  #learningSetting .table td {
    font-size: 16px;
    padding: 10px 0;
  }
  #learningSetting .learning {
    background: url(~@/assets/common/ams/learing1.png) bottom no-repeat;
    width: 340px;
    padding-top: 60px;
    box-shadow: 0px 2px 13px 0px rgba(100, 116, 147, 0.3);
    border-radius: 4px;
  }
  #learningSetting .perpson-img {
    margin-left: 40px;
    margin-bottom: 24px;
  }
  .learning-type {
    height: 120px;
    line-height: 120px;
    font-size: 16px;
    font-weight: bold;
  }
  .learning-title {
    font-size: 16px;
    font-weight: bold;
    margin: 30px 0 100px;
    text-align: center;
  }
  /*周次设置*/
  #weeklySetting {
    padding: 20px 30px;
  }
  #weeklySetting .weeklyUl {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  #weeklySetting .weeklyUl label {
    font-size: 14px;
  }
  #weeklySetting .weeklyUl > li {
    display: inline-block;
    width: 700px;
    /*margin-right:30px;*/
    margin: 30px auto;
  }
  #weeklySetting .weeklyUl .date:last-child {
    border-bottom: 1px solid #ddd;
  }
  #weeklySetting .weeklyUl .date {
    border-top: 1px solid #ddd;
  }
  #weeklySetting .weeklyUl .date li {
    display: inline-block;
    padding: 8px 12px;
    font-size: 14px;
    width: 84px;
    text-align: center;
  }
  #weeklySetting .weeklyUl .sample h3 {
    /*font-weight:bold;*/
    font-size: 16px;
    color: #333;
    padding: 10px 0;
  }
  #weeklySetting .weeklyUl .sample p {
    padding-bottom: 10px;
    color: #999;
  }

  /*LDAP设置及修改*/
  #LDAPSetting {
    /*margin:30px 80px;*/
  }
  #LDAPSetting .tip {
    font-size: 16px;
    color: #ea6f5a;
    padding-bottom: 10px;
  }
  #LDAPSetting .isOpen {
    font-size: 16px;
  }
  #LDAPSetting .isOpen label {
    margin-right: 15px;
  }

  #LDAPEditor {
    margin: 30px 80px;
  }
  #LDAPEditor .LDAPForm {
    width: 500px;
    margin: auto;
  }
  .LDAP1 {
    font-size: 16px;
    font-weight: bold;
    color: rgba(68, 68, 68, 1);
  }
  .ivu-btn-ams-back-btn {
    color: #5277ff;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(82, 119, 255, 1);
  }
  .ivu-btn-ams-back-btn:hover {
    background: rgba(217, 234, 255, 1);
    color: #3861e9;
  }
  /*上传成功和失败样式*/
  #uploadSuccess {
    font-size: 14px;
  }
  #uploadSuccess .ivu-icon {
    font-size: 26px;
    color: #19be6b;
  }
  #uploadFail {
    font-size: 14px;
  }
  #uploadFail .ivu-icon {
    font-size: 26px;
    color: #ed4014;
  }
  #uploadFail a {
    color: #2d8cf0;
  }

  /* 登录后首页 */
  .main-host {
    background: #fff;
    padding: 20px;
  }

  .ams-main {
    padding: 0 12px 10px;
  }

  /* 页脚设置 */
  .footer-title {
    font-size: 16px;
    font-weight: bold;
    color: rgba(15, 29, 88, 1);
  }
  /* 菜单配置 */
  /*菜单配置*/
  #menuSetting {
    margin: 15px 0;
  }
  .menu-box {
    margin: 32px 0;
    background: rgba(255, 255, 255, 0.99);
    border: 1px solid rgba(214, 219, 223, 1);
    border-radius: 4px;
  }
  .menu-box .box-header {
    height: 42px;
    line-height: 42px;
    background: rgba(48, 125, 255, 0.1);
    border-radius: 4px;
    padding: 0 32px;
  }
  .menu-box .box-header .menu-title {
    font-size: 16px;
    /*font-weight: bold;*/
    color: rgba(65, 150, 255, 1);
    display: inline-block;
  }
  .menu-box .box-header .add-btn {
    display: inline-block;
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background: rgba(65, 150, 255, 1);
    border: 1px solid rgba(99, 146, 233, 1);
    border-radius: 15px;
    color: #fff;
    margin-top: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .menu-box .box-header .editor-icon {
    cursor: pointer;
    color: #95989b;
    margin-top: -4px;
    margin-left: 5px;
  }

  .menu-box .box-header .editor-icon:hover {
    color: #2d8cf0;
  }
  .tab-ul {
    text-align: center;
    margin: 28px 20px;
    border: 1px solid rgba(214, 219, 223, 1);
    border-radius: 4px;
  }

  .tab-ul .tab-head {
    padding: 8px 0;
    background: #f3f3f3;
    font-size: 16px;
    color: rgba(68, 68, 68, 1);
  }

  .tab-ul .tab-body {
    background: #eff3f6;
    line-height: 45px;
    font-size: 14px;
  }
  .tab-ul .tab-body:nth-child(2n) {
    background: #fff;
  }
  .tab-ul .tab-body .ivu-switch-checked {
    border-color: #51bb58;
    background-color: #51bb58;
  }
  .tab-ul .ams-editor {
    font-size: 16px;
    margin-right: 5px;
    border-radius: 50%;
    padding: 5px;
    background: #d5e7ff;
    color: #4196ff;
    cursor: pointer;
    transition: all 0.3s;
  }
  .tab-ul .ams-editor:hover {
    background: #4196ff;
    color: #fff;
  }
  .tab-ul .ams-close {
    font-size: 16px;
    margin-right: 0;
    border-radius: 50%;
    padding: 5px;
    background: #d5e7ff;
    color: #4196ff;
    cursor: pointer;
    transition: all 0.3s;
  }

  .tab-ul .ams-close:hover {
    background: #4196ff;
    color: #fff;
  }
  .menu-add-ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .menu-add-ul li {
    width: 120px;
    height: 68px;
    margin: 10px 8px;
    box-shadow: 0px 3px 8px 0px rgba(196, 196, 196, 0.5);
    border-radius: 4px;
    position: relative;
    cursor: pointer;
  }
  .menu-add-ul li:hover {
    box-shadow: 0px 3px 8px 0px rgba(54, 54, 54, 0.5);
  }
  .menu-add-ul li > p {
    line-height: 68px;
    text-align: center;
    font-size: 14px;
    font-weight: normal;
    color: rgba(68, 68, 68, 1);
  }
  .menu-add-ul li .add-check {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
</style>

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
