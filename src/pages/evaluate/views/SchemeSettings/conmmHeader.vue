<template>
  <div class="xy-content-module">
    <Tabs
      v-model="tabValue"
      @on-click="changeTab"
      class="step-con"
    >
      <!-- :label步骤标题， :name对应tabValue，相等则展示此TabPane项 -->
      <TabPane
        v-for="(item, n) in liData"
        :key="n"
        :disabled="item.isLoad > 0? false : true"
        :label="item.label"
        :name="item.url"
        >
      </TabPane>
    </Tabs>
    <div class="xy-content-body">
      <router-view></router-view>
    </div>
  </div>

</template>
<script>
  export default {
    name: 'ConmmHeader',
    data () {
      return {
        tabValue: 'Create', // 对应TabPane的name (当前步骤的url)
        liData: [
          {
            name: '创建方案',
            isActive: true,
            isLoad: 1,
            url: 'Create',
            index: 0
          },
          {
            name: '评价设置',
            isActive: false,
            isLoad: 0,
            url: 'EvaStting',
            index: 1
          },
          {
            name: '选择指标',
            isActive: false,
            isLoad: 0,
            url: 'Content',
            index: 2
          },
          {
            name: '指标分数',
            isActive: false,
            isLoad: 0,
            url: 'Control',
            index: 3
          },
          {
            name: '发布结果',
            isActive: false,
            isLoad: 0,
            url: 'Speed',
            index: 4
          },
          {
            name: '评价结果',
            isActive: false,
            isLoad: 0,
            url: 'Result',
            index: 5
          }
        ],
        status: this.$route.query.status * 1,
        steps: 1,
        teachingProjectID: 0,
        buttonType: '0',
        // 切换
        activeTab: 1,
        programmeID: 0
      }
    },
    created () {
      for (let i = 0; i < this.liData.length; i++) {
        this.liData[i].label = (h) => {
          return h('div', {
            class: [
              'step-item',
              this.liData[i].isActive ? 'current-step' : this.liData[i].isLoad > 0 ? '' : 'disabled' // 当前选中current-step，禁选disabled
            ]
          }, [
            h('div', {
              class: 'step-num',
              domProps: {
                innerHTML: i + 1
              }
            }),
            h('a', {
              class: 'step-name',
              domProps: {
                innerHTML: this.liData[i].name
              }
            }),
            h('div', {
              class: 'step-line',
              style: {
                display: i === this.liData.length - 1 ? 'none' : ''
              }
            })
          ])
        }
      }
      this.changeTab(this.liData[this.steps].url)
    },
    watch: {
      '$route': {
        handler (val) {
          // console.log(val)
          this.steps = this.$route.query.steps * 1
          this.teachingProjectID = this.$route.query.teachingProjectID * 1
          // console.log(this.steps)
          // console.log(this.liData)
          // console.log(this.teachingProjectID)
          if (this.teachingProjectID > 0) {
            if (this.$store.state.evaluate.topHeader.length) {
              this.liData = this.$store.state.evaluate.topHeader
            }
            // console.log(this.$store.state.evaluate.topHeader)
            this.liData.map(vv => {
              if (vv.index <= this.steps) {
                vv.isLoad = 1
              }
              if (this.steps === vv.index) {
                vv.isActive = true
              } else {
                vv.isActive = false
              }
              return vv
            })
            this.$store.commit('base/changeValue', {
              teachingProjectID: val.query.AssessProjectId,
              steps: val.query.steps,
              schoolID: val.query.SchoolDistrictId,
              yearID: val.query.AcademicYearId,
              sessionID: val.query.AcademicSessionId,
              status: val.query.ProjectStatus
            })
          }
          // console.log(this.liData)
          this.$store.commit('evaluate/changetopHeader', this.liData)
        },
        immediate: true
      }
    },
    methods: {
      // 点击步骤
      changeTab (item) {
        // console.log(item)
        let curClickStep = this.liData.filter((val) => {
          return val.url === item// 当前点击步骤信息
        })
        // console.log(curClickStep)
        if (curClickStep[0].isLoad > 0) {
          this.$store.commit('common/getParam', Object.assign(this.$store.state.common.menuInfo, { steps: curClickStep[0].index, status: this.$route.query.status }))
          this.$router.push({
            path: `/xyHome/evaluate/ConmmHeader/${item}`,
            query: this.$store.state.common.menuInfo
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module {
  .xy-content-body {
    overflow: hidden;
  }
  /deep/ .step-con {
    background: #fff;
    text-align: center;
    // border-bottom: 1px solid #e8e8e8;
    .ivu-tabs-nav{
      width: auto!important;
      margin: 0 auto;
      float: none;
    }
    .current-step .step-num {
      color: #fff;
      border-color: #1890ff;
      background: #1890ff;
    }
    .disabled .step-num {
      border-color: rgba(217, 217, 217, 1);
      color: rgba(0, 0, 0, 0.25);
    }
    .step-name {
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
    }
    .current-step .step-name {
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
    }
    .disabled .step-name {
      color: rgba(0, 0, 0, 0.25);
    }
    .step-line {
      width: 60px;
      height: 1px;
      background-color: #1890ff;
      margin: 0 5px;
    }
    .disabled .step-line {
      background: rgba(0, 0, 0, 0.15);
    }
    .step-item {
      display: flex;
      align-items: center;
    }
    .step-num {
      width: 20px;
      line-height: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #1890ff;
      border-radius: 10px;
      /* font-weight: 400; */
      font-size: 14px;
      margin-right: 5px;
      color: #cdcdcd;
      text-align: center;
      color: #1890ff;
      cursor: pointer;
    }

    /* 组件样式覆盖 */
      .ivu-tabs-bar {
        border-bottom: none;
        margin: 20px 10px;
      }
      .ivu-tabs-nav {
        width: 2000px;
        .ivu-tabs-nav-scroll {
          display: flex;
          justify-content: center;
        }
      }
      .ivu-tabs-nav .ivu-tabs-tab {
        padding: 5px 0;
        margin-right: 5px;
      }
      .ivu-tabs-ink-bar {
        display: none;
      }
  }
}
</style>
