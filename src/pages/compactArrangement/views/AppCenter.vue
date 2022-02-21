<template>
  <div>
    <h3 class="app-center">应用中心</h3>
    <ul class="module-ul">
      <li v-for="(item,index) in moduleList"
          :key='index'
          class="module-li" @click="moduleClick(item)">
        <div class="module-icon-box">
          <img :src="item.img" alt="" class="img">
          <!-- <div class="module-icon"
               :style="{
                        backgroundImage: 'url(' + item.BgColor + ')'
                      }">
            <i class="iconfont"
               :class="'icon-' + item.PCIcon"></i>
          </div> -->
        </div>
        <div class="module-content">
          <div>
            <h4>{{item.Name}}</h4>
            <p class="module-describe">{{item.global.ApplicationDescription}}</p>
          </div>
          <div class="enter-button">立即进入</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'AppCenter',
    data () {
      return {
        moduleList: [
          {
            Name: '行政班排课',
            Describe: '这里是一个比较长的说明文字',
            img: require('@/pages/compactArrangement/imgs/icon1.png'),
            ID: 2,
            global: {}
          },
          {
            Name: '走班排课',
            Describe: '这里是一个比较长的说明文字',
            img: require('@/pages/compactArrangement/imgs/icon2.png'),
            ID: 2,
            global: {}
          },
          {
            Name: '排教室',
            Describe: '这里是一个比较长的说明文字',
            img: require('@/pages/compactArrangement/imgs/icon4.png'),
            ID: 2,
            global: {}
          },
          {
            Name: '学期课表',
            Describe: '这里是一个比较长的说明文字',
            img: require('@/pages/compactArrangement/imgs/icon3.png'),
            ID: 2,
            global: {}
          },
          // {
          //   Name: '互动课堂',
          //   Describe: '这里是一个比较长的说明文字',
          //   img: require('@/pages/compactArrangement/imgs/icon5.png')
          // },
          {
            Name: '学年管理',
            Describe: '这里是一个比较长的说明文字',
            img: require('@/pages/compactArrangement/imgs/icon6.png'),
            ID: 1,
            global: {}
          },
          {
            Name: '教师管理',
            Describe: '这里是一个比较长的说明文字',
            img: require('@/pages/compactArrangement/imgs/icon7.png'),
            ID: 1,
            global: {}
          },
          {
            Name: '学生管理',
            Describe: '这里是一个比较长的说明文字',
            img: require('@/pages/compactArrangement/imgs/icon8.png'),
            ID: 1,
            global: {}
          },
          {
            Name: '课程管理',
            Describe: '这里是一个比较长的说明文字',
            img: require('@/pages/compactArrangement/imgs/icon9.png'),
            ID: 1,
            global: {}
          },
          {
            Name: '场馆管理',
            Describe: '这里是一个比较长的说明文字',
            img: require('@/pages/compactArrangement/imgs/icon10.png'),
            ID: 1,
            global: {}
          },
          {
            Name: '家长管理',
            Describe: '这里是一个比较长的说明文字',
            img: require('@/pages/compactArrangement/imgs/icon11.png'),
            ID: 1,
            global: {}
          }
          // {
          //   Name: '年级升级',
          //   Describe: '这里是一个比较长的说明文字',
          //   img: require('@/pages/compactArrangement/imgs/icon12.png')
          // }
        ]
      }
    },
    created () {
      let vals = this.$store.state.common.moduleList
      this.moduleList[0].global = vals[1].applications[0]
      this.moduleList[1].global = vals[1].applications[1]
      this.moduleList[2].global = vals[1].applications[2]
      this.moduleList[3].global = vals[1].applications[3]

      this.moduleList[4].global = vals[0].applications[0]
      this.moduleList[5].global = vals[0].applications[1]
      this.moduleList[6].global = vals[0].applications[2]
      this.moduleList[7].global = vals[0].applications[3]
      this.moduleList[8].global = vals[0].applications[4]
      this.moduleList[9].global = vals[0].applications[5]
    },
    methods: {
      // 应用模块点击
      moduleClick (val) {
        // this.$store.commit(
        //   'changeApiPath',
        //   `${this.xyApi}/${parentItem.ModuleCode}`
        // )
        let application = val.global
        this.$store.commit(
          'changeApiPath',
          `${this.xyApi}/${application.GatewayCode}`
        )
        let mIds = [val.ID, application.ID]
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
.app-center {
  background: #ffffff;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 64px;
  left: 60px;
  right: 0px;
  height: 56px;
  background-color: #fff;
  // z-index: 999;
  color: rgba(0, 0, 0, 0.65);
  line-height: 56px;
  padding-left: 16px;
}
.module-ul {
  margin-top: 56px;
  .module-li {
    display: flex;
    align-items: center;
    min-height: 95px;
    background: #ffffff;
    border-radius: 2px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
    margin-bottom: 15px;
    padding:0 15px;
    .module-icon-box {
      .img{
        width: 62px;
        height: 62px;
      }
    //   .module-icon {
    //     display: flex;
    //     justify-content: center;
    //     align-items: flex-end;
    //     width: 62px;
    //     height: 62px;
    //     margin: 10px 0;
    //     background-size: 100%;
    //     .iconfont {
    //       color: #fff;
    //       font-size: 26px;
    //     }
    //   }
    }
    .module-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-left: 1px solid #eeeeee;
      margin-left: 15px;
      padding-left: 25px;
      h4 {
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        line-height: 20px;
        margin-bottom: 10px;
      }
      .module-describe {
        font-size: 12px;
        font-weight: 400;
        color: #888888;
        line-height: 17px;
        margin-right: 10px;
      }
      .enter-button {
        cursor: pointer;
        min-width: 102px;
        text-align: center;
        height: 38px;
        line-height: 38px;
        background: #ffffff;
        border: 1px solid #e6e9f2;
        border-radius: 19px;
        color: #3e3f42;
      }
      .enter-button:hover {
        color: #ffffff;
        background: linear-gradient(90deg, #215cf5, #47acfa);
      }
    }
  }
}
</style>
