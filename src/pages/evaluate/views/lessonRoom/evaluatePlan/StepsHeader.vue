<template>
  <div class="xy-content-module" style="width:100%">
    <ul class="layered-step" v-if="isShowHeader">
      <template v-for="(item,n) in liData">
        <li :key='n' v-if="item.isShow" class="layered-step-tap" :class="item.isActive?'active-steps':item.isLoad > 0?'show':'no-show'" @click='changeTab(item,n)' v-bind:ref="'layered'+n">
          <div class="step-num">{{n+1}}</div>
          <a href="javascript:void(0);" class="layered-nav-btn">{{item.name}}</a>
          <div class="step-line" v-if="item.isShow&&(n+1)!==liLen"></div>
        </li>
      </template>
    </ul>
    <router-view></router-view>
  </div>

</template>
<script>
  export default {
    data () {
      return {
        isShowHeader: true,
        classTableName: '',
        rowObj: '',
        typeName: '创建方案', // 头部名称
        tabValue: 'PlanCreat', // 对应TabPane的name (当前步骤的url)
        liLen: 5,
        liData: [
          {
            name: '创建方案',
            isActive: false,
            isShow: true,
            isLoad: 0,
            url: 'PlanCreat',
            index: 0
          },
          {
            name: '选择学科',
            isActive: false,
            isShow: true,
            isLoad: 0,
            url: 'ChooseDiscipline',
            index: 1
          },
          {
            name: '选择指标',
            isActive: false,
            isShow: true,
            isLoad: 0,
            url: 'ChooseMark',
            index: 2
          },
          {
            name: '评分规则',
            isActive: false,
            isShow: true,
            isLoad: 0,
            url: 'ScoringRules',
            index: 3
          },
          {
            name: '设置权重',
            isActive: false,
            isShow: true,
            isLoad: 0,
            url: 'SetWeight',
            index: 4
          },
          {
            name: '小组折算',
            isActive: false,
            isShow: false,
            isLoad: 0,
            url: 'GroupConversion',
            index: 5
          }
        ]
      }
    },
    created () {
      if (Object.keys(this.$store.state.evaluate.evaPlanObj).length > 0) {
        this.rowObj = this.$store.state.evaluate.evaPlanObj
      }
      if (this.rowObj.ProgrammeID > 0) {
        this.typeName = this.rowObj.ProgrammeName
      } else {
        this.typeName = '创建方案'
      }
      this.getGeneralFlows()
    },
    mounted: function () {
      this.liData.map(function (item) {
        item.isActive = false
        return item
      })
      this.liData[0].isActive = true
      this.$store.commit('common/getThreeMenuName', this.typeName)
      this.$store.commit('common/getParam', { pro: 'evaPlanTable', step: 0 })
      this.$router.push({
        path: '/xyhome/evaStepsHeader/PlanCreat',
        query: this.$store.state.common.menuInfo
      })
    },
    methods: {
      async getGeneralFlows () {
        if (this.rowObj.ProgrammeID > 0) {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ProgrammeSetting/GetProgrammeProcess`, {
            programmeID: this.rowObj.ProgrammeID
          })
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            this.liData.map(function (item) {
              item.isLoad = 0
              return item
            })
            this.liData[0].isLoad = 1
            this.liData[1].isLoad = resData.SelectDiscipline
            this.liData[2].isLoad = resData.SelectIndex
            this.liData[3].isLoad = resData.SettingRule
            this.liData[4].isLoad = resData.SettingWeight
            this.liData[5].isLoad = resData.GroupConversion
            this.liData[5].isShow = resData.HasGroupConversion
            if (resData.HasGroupConversion) {
              this.liLen = 6
            } else {
              this.liLen = 5
            }
          }
        };
      },
      changeTab (item, n) {
        if (item.isLoad) {
          this.liData.map(function (item) {
            item.isActive = false
            return item
          })
          this.liData[n].isActive = true
          this.$router.push({
            path: `/xyhome/evaStepsHeader/${item.url}`,
            query: this.$store.state.common.menuInfo
          })
          this.getGeneralFlows()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .layered-step {
  height: 70px;
  width: 100%;
  background: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.layered-step-tap {
  display: flex;
  align-items: center;
}
.layered-nav-btn {
  color: rgba(0,0,0,.65);
  font-size: 14px;
}
.layered-step-tap .step-num {
  width: 20px;
  height: 20px;
  line-height: 18px;
  border: 1px solid #1890ff;
  border-radius: 50%;
  font-weight: 400;
  font-size: 12px;
  margin-right: 5px;
  color: #cdcdcd;
  text-align: center;
  color: #1890ff;
}
.layered-step-tap .step-line {
  width: 100px;
  height: 1px;
  // background-color: #1890ff;
  background: rgba(0, 0, 0, 0.25);
  margin: 0 5px;
}
.active-steps{
  .step-num{
    color: #fff;
    border-color: #1890ff;
    background: #1890ff;
  }
  .layered-nav-btn{
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
  }
  // 激活蓝色
  .step-line{
    border-color: #1677FF !important;
    background: #1677FF !important;
  }
}
.no-show{
  .layered-nav-btn{
    color: rgba(0,0,0,.25);
  }
  .step-num {
    border-color: rgba(217, 217, 217, 1);
    color: #cdcdcd;
  }
}
.no-show .step-line {
  background: rgba(0, 0, 0, 0.15);
}
// 激活蓝色
.show{
  .step-line{
    border-color: #1677FF !important;
    background: #1677FF !important;
  }
}
</style>
