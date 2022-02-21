<template>
  <div class="xy-content-module" style="width:100%">
    <ul class="layered-step"  v-if="isShowHeader">
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
        step: 0,
        classTableName: '',
        rowObj: '',
        typeName: '方案信息', // 头部名称
        tabValue: 'planCreat', // 对应TabPane的name (当前步骤的url)
        liLen: 2,
        liData: [
          {
            name: '方案信息',
            isActive: false,
            isShow: true,
            isLoad: 0,
            url: 'planetCreate',
            index: 0
          },
          {
            name: '规则设置',
            isActive: false,
            isShow: true,
            ç: 0,
            url: 'planetRule',
            index: 1
          }
        ]
      }
    },
    created () {
      this.getGeneralFlows()
    },
    mounted: function () {
      this.liData.map(function (item) {
        item.isActive = false
        return item
      })
      this.liData[this.step].isActive = true
    },
    methods: {
      async getGeneralFlows () {
        this.isShowHeader = false
        if (Object.keys(this.$store.state.evaluate.dipperObj).length > 0) {
          this.rowObj = this.$store.state.evaluate.dipperObj
        }
        this.isShowHeader = true
        if (this.rowObj.StarProgrammeID > 0) {
          this.typeName = this.rowObj.StarProgrammeName
          this.isShowHeader = true
          this.xy.loading()

          this.liData.map((item, index) => {
            item.isLoad = index + 1
          })
          // this.$nextTick(() => {
          //   this.$set(this, 'liData', datas)
          // })
          this.xy.unloading()
        } else {
          this.typeName = '创建方案'
        }
      },
      changeTab (item, n) {
        console.log(item)
        if (item.isLoad) {
          this.liData.map(function (item) {
            item.isActive = false
            return item
          })
          this.liData[n].isActive = true
          this.$router.push({
            path: `/xyhome/planetStepsHeader/${item.url}`,
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
  padding: 0 10px;
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
