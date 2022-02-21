<template>
  <div v-if="isCrumbs" class="crumbs-wrap" :style="{background: crumbsData.menuName.length>0 ? '#fff' : ''}">
    <div class="crumbs-flex">
      <i class="iconfont crumbs-icon" :class="'icon-'+crumbsData.rigthModels.PCIcon+'-active'"></i>
      <div>{{crumbsData.rigthModels.Name}}</div>
      <div class="split">&gt;</div>
      <div :class="(crumbsData.applications.subMenu.length>0&&isThreeMenu===1)?'':'split-active'">{{crumbsData.applications.Name}}</div>
      <div
        class="split"
        v-if="crumbsData.applications.subMenu.length>0&&isThreeMenu===1">&gt;</div>
      <div class="now-name" v-if="crumbsData.applications.subMenu.length>0&&isThreeMenu===1">
        <template v-for="(item, index) in crumbsData.applications.subMenu">
          <span
            :key="index"
            v-if="item.ID===crumbsData.moduleID">{{item.Name}}</span>
        </template>
      </div>
    </div>
    <div class="crumbs-custom" v-if="crumbsData.menuName.length>0">
      <div class="name">{{crumbsData.menuName}}</div>
      <div class="back" @click="back">
        <i class="iconfont">&#xe6a5;</i>
        <span>{{backUrl === '' || clearTitle ? '返回':'返回方案列表'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Crumbs',
    data () {
      return {
        isCrumbs: false,
        crumbsData: {
          rigthModels: {},
          applications: {},
          menus: {},
          moduleID: -1,
          isThreeMenu: -1,
          menuName: ''
        },
        isThreeMenu: -1,
        backUrl: '',
        moduleList: [],
        clearTitle: null
      }
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
      },
      '$route': {
        handler (routers) {
          // console.log(routers)
          if (routers.name === 'moduleFunc' ||
            routers.name === 'appCenter') {
            this.isCrumbs = false
            this.backUrl = ''
            this.crumbsData = {
              rigthModels: {},
              applications: {},
              menus: {},
              moduleID: -1,
              isThreeMenu: -1,
              menuName: ''
            }
          } else {
            this.clearTitle = routers.query.clearTitle
            this.isCrumbs = true
            let mIds = routers.query.xy.split(',')
            this.crumbsData.menuName = routers.query.menuName !== undefined ? routers.query.menuName : ''
            for (let i = 0, len = this.moduleList.length; i < len; i++) {
              if (mIds[0] - 0 === this.moduleList[i].ID) {
                this.crumbsData.rigthModels = this.moduleList[i]
                for (let j = 0, jlen = this.moduleList[i].applications.length; j < jlen; j++) {
                  if (mIds[1] - 0 === this.moduleList[i].applications[j].ID) {
                    this.crumbsData.applications = this.moduleList[i].applications[j]
                    if (mIds.length > 2 && this.moduleList[i].applications[j].subMenu.length > 0) {
                      this.isThreeMenu = 1
                      this.crumbsData.isThreeMenu = 1
                      this.crumbsData.moduleID = mIds[2] - 0
                      for (let k = 0, klen = this.moduleList[i].applications[j].subMenu.length; k < klen; k++) {
                        if (this.crumbsData.moduleID === this.moduleList[i].applications[j].subMenu[k].ID) {
                          this.crumbsData.menus = this.moduleList[i].applications[j].subMenu[k]
                        }
                      }
                    } else {
                      this.crumbsData.moduleID = -1
                      this.isThreeMenu = -1
                      this.crumbsData.isThreeMenu = -1
                    }
                  }
                }
              }
            }
            if (routers.query.pro !== undefined && routers.query.pro !== '') {
              this.backUrl = `/xyHome/${routers.query.pro}`
            } else {
              this.backUrl = ''
            }
          }
        },
        // deep: true,
        immediate: true
      }
    },
    methods: {
      back () {
        // 课堂评价需要
        this.$store.commit('evaluate/setChangeClass', false)
        // 是否清除标题
        if (!this.clearTitle) {
          this.$store.commit('common/getThreeMenuName', '')
        }
        if (this.backUrl === '') {
          this.$router.go(-1)
        } else {
          this.$router.push({
            path: this.backUrl,
            query: this.$store.state.common.menuInfo
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.crumbs-wrap{
  padding:10px 20px 0;
  margin-bottom: 10px;
  /*background: #fff;*/
  .crumbs-flex{
    display: flex;
    align-items:center;
    .split{
      margin:0 5px;
    }
    .split-active{
      color:#0877FF;
    }
    .crumbs-icon{
      color:#0877FF;
      margin-right: 5px;
    }
    .now-name{
      color:#0877FF;
    }
  }
  .crumbs-custom{
    display: flex;
    justify-content: space-between;
    padding: 12px 0 5px;
    align-items: center;
    .name{
      font-size: 18px;
      font-weight:700;
      color:rgba(0,0,0,0.75);
    }
    .back{
      cursor: pointer;
      i{
        margin-right:5px;
        font-size: 14px;
        color: #1890FF;
      }
      span{
        color:#1890FF;
      }

    }
  }
}

</style>
