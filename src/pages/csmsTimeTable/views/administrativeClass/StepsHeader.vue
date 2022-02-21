<template>
  <div class="xy-content-module pr">
    <Tabs v-model="tabValue" @on-click="changeTab" class="step-con" v-if="isShowHeader">
        <!-- :label步骤标题， :name对应tabValue，相等则展示此TabPane项-->
        <TabPane v-for="(item, n) in liData"
          :key="n"
          :disabled="item.isLoad > 0? false : true"
          :label="item.label"
          :name="item.url">
        </TabPane>
    </Tabs>
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
        typeName: '', // 头部名称
        typeUrl: '/xyhome/administrative', // 头部返回url

        tabValue: 'CreateClassTable', // 对应TabPane的name (当前步骤的url)
        liData: [
          {
            name: '基本信息',
            isActive: false,
            isLoad: 0,
            url: 'administrativeCreateClass',
            index: 0
          },
          {
            name: '作息时间',
            isActive: false,
            isLoad: 0,
            url: 'administrativeWorkTime',
            index: 1
          },
          {
            name: '排课班级',
            isActive: false,
            isLoad: 0,
            url: 'administrativeClassList',
            index: 2
          },
          {
            name: '课程设置',
            isActive: false,
            isLoad: 0,
            url: 'administrativeCrouseSetting',
            index: 3
          },
          {
            name: '排课规则',
            isActive: false,
            isLoad: 0,
            url: 'administrativeRule',
            index: 4
          },
          {
            name: '排课课位',
            isActive: false,
            isLoad: 0,
            url: 'administrativeArranging',
            index: 5
          },
          {
            name: '启动排课',
            isActive: false,
            isLoad: 0,
            url: 'administrativeStartProcess',
            index: 6
          },
          {
            name: '手动调整',
            isActive: false,
            isLoad: 0,
            url: 'administrativeSchedule',
            index: 7
          },
          {
            name: '发布启用',
            isActive: false,
            isLoad: 0,
            url: 'administrativeReleaseSchedule',
            index: 8
          }
        ],
        isOperation: 0, // 是否可以启动
        enableCollections: 0 // 是否可以调整课表
      }
    },
    watch: {
      '$route': {
        handler (newVal) {
          for (let i = 0, len = this.liData.length; i < len; i++) {
            if (Number(newVal.query.step) === i) {
              this.liData[i].isActive = true
            } else {
              this.liData[i].isActive = false
            }
          }
        },
        deep: true
      }
    },
    created () {
      // 步骤条
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

      if (Object.keys(this.$store.state.csmstimetable.admininstrativeRowObj).length > 0) {
        this.rowObj = this.$store.state.csmstimetable.admininstrativeRowObj
      }
      if (this.rowObj.classTableID > 0) {
        this.typeName = this.rowObj.classTableName
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
      this.$store.commit('common/getParam', { pro: 'administrative', step: 0 })// 行政班排课
      this.$router.push({
        path: '/xyhome/administrativeStepHeader/administrativeCreateClass',
        query: this.$store.state.common.menuInfo
      })
      // console.log(this.liData)
    },
    methods: {
      async getGeneralFlows () {
        if (this.rowObj.classTableID > 0) {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetGeneralFlows`, {
            classTableID: this.rowObj.classTableID
          })
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            this.liData.map(function (item) {
              item.isLoad = 0
              return item
            })
            this.liData[0].isLoad = 1
            this.liData[1].isLoad = resData.ClassTables
            this.liData[2].isLoad = resData.ClassTableTimes
            this.liData[3].isLoad = resData.Collections
            this.liData[4].isLoad = resData.Courses
            this.liData[5].isLoad = resData.Courses
            this.liData[6].isLoad = resData.SelectedClassTableTimes
            this.liData[7].isLoad = resData.Results
            this.liData[8].isLoad = resData.ResultCollections
            this.isOperation = resData.PublishCollections
            this.enableCollections = resData.EnableCollections
          }
        };
      },
      changeTab () {
        let _this = this
        let curClickStep = this.liData.filter(function (item) {
          if (item.url === _this.tabValue) {
            return item // 当前点击步骤信息
          }
        })
        if (curClickStep[0].isLoad > 0) {
          // this.$router.push({ path: `/xyhome/administrativeStepHeader/${item.url}` })'
          this.$store.commit('common/getParam', {
            step: curClickStep[0].index,
            IDPre: 0,
            NamePre: ''
          })// 行政班排课
          this.$router.push({
            path: `/xyhome/administrativeStepHeader/${curClickStep[0].url}`,
            query: this.$store.state.common.menuInfo
          })
          this.getGeneralFlows()
        }
      }
      // 返回
      // back: function () {
      //   if (this.typeName !== '创建方案' && this.typeName !== '编辑方案') { // 二级页面，需要显示导航头部
      //     this.isShowHeader = true
      //   }
      //   this.$router.push({ path: this.typeUrl })
      //   if (this.rowObj.classTableID > 0) {
      //     this.typeName = '编辑方案'
      //   } else {
      //     this.typeName = '创建方案'
      //   }
      //   this.typeUrl = '/xyhome/administrative'
      // }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/stepsHeader.css';
  .step-con .ivu-tabs-nav {
    width: 1360px;
}
</style>
