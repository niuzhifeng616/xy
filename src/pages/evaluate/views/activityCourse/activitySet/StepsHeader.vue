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
        typeName: '创建活动', // 头部名称
        tabValue: 'AcCreate', // 对应TabPane的name (当前步骤的url)
        liLen: 3,
        liData: [
          {
            name: '创建活动',
            isActive: false,
            isShow: true,
            isLoad: 0,
            url: 'acCreate',
            index: 0
          },
          {
            name: '添加学生',
            isActive: false,
            isShow: true,
            isLoad: 0,
            url: 'addStudents',
            index: 1
          },
          {
            name: '活动指标',
            isActive: false,
            isShow: true,
            isLoad: 0,
            url: 'activityMark',
            index: 2
          }
        ]
      }
    },
    created () {
      if (Object.keys(this.$store.state.evaluate.activityObj).length > 0) {
        this.rowObj = this.$store.state.evaluate.activityObj
      }
      if (this.rowObj.ActivityCourseProjectID > 0) {
        this.typeName = this.rowObj.ActivityCourseProjectName
      } else {
        this.typeName = '创建活动'
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
      this.$store.commit('common/getParam', { pro: 'acivityTable' })
      this.$router.push({
        path: '/xyhome/acStepsHeader/acCreate',
        query: this.$store.state.common.menuInfo
      })
    },
    methods: {
      async getGeneralFlows () {
        if (this.rowObj.ActivityCourseProjectID > 0) {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseProject/GetProjectStep`, {
            ActivityCourseProjectID: this.rowObj.ActivityCourseProjectID
          })
          this.xy.unloading()
          if (res.success) {
            let resData = res.data.result
            this.liData.map(function (item) {
              item.isLoad = 0
              return item
            })
            this.liData[0].isLoad = 1
            if (resData === 1) { // 表示步骤1 2可以用
              this.liData[1].isLoad = 1
              // this.liData[1].isActive = true
            } else if (resData === 2) { // 表示步骤123都可用
              this.liData[1].isLoad = 1
              this.liData[2].isLoad = 1
              // this.liData[1].isActive = true
              // this.liData[2].isActive = true
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
            path: `/xyhome/acStepsHeader/${item.url}`,
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
  background-color: #1890ff;
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
    // font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
  }
  .step-line{
    border-color: #1677FF !important;
    background: #1677FF !important;
  }
}
.no-show{
  .step-line {
    background: rgba(0, 0, 0, 0.15);
  }
  .layered-nav-btn{
    color: rgba(0,0,0,.25);
  }
  .step-num {
    border-color: rgba(217, 217, 217, 1);
    color: #cdcdcd;
  }
}
.show{
  .step-line{
    border-color: #1677FF !important;
    background: #1677FF !important;
  }
}
</style>
