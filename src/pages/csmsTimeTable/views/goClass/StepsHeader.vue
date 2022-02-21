<template>
  <div class="xy-content-module">
    <Tabs v-model="tabValue" @on-click="changeTab" class="step-con">
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
    name: 'StepsHeader',
    data () {
      return {
        classTableType: this.$store.state.csmstimetable.classTableID[1].id,

        rowObj: '',
        classTableID: 0,
        classTableName: '',

        tabValue: 'CreateClassTable', // 对应TabPane的name (当前步骤的url)
        liData: [
          {
            name: '基本信息',
            isActive: false,
            isLoad: 1,
            url: 'addClassTable',
            index: 0
          },
          {
            name: '作息时间',
            isActive: false,
            isLoad: 1,
            url: 'workTime',
            index: 1
          },
          {
            name: '选课结果',
            isActive: false,
            isLoad: 1,
            url: 'progress',
            index: 2
          },
          {
            name: '开班计划',
            isActive: false,
            isLoad: 1,
            url: 'startClassSet',
            index: 3
          },
          {
            name: '排课规则',
            isActive: false,
            isLoad: 1,
            url: 'ruleHeader',
            index: 4
          },
          {
            name: '排课课位',
            isActive: false,
            isLoad: 1,
            url: 'arranging',
            index: 5
          },
          {
            name: '启动排课',
            isActive: false,
            isLoad: 1,
            url: 'startProcess',
            index: 6
          },
          {
            name: '手动调整',
            isActive: false,
            isLoad: 1,
            url: 'adjustHeader',
            index: 7
          },
          {
            name: '发布课表',
            isActive: false,
            isLoad: 1,
            url: 'releaseSchedule',
            index: 8
          },
          {
            name: '学生调班',
            isActive: false,
            isLoad: 1,
            url: 'studentSwitchedTable',
            index: 9
          },
          {
            name: '排自习',
            isActive: false,
            isLoad: 1,
            url: 'rowSelfStudy',
            index: 10
          },
          {
            name: '启用课表',
            isActive: false,
            isLoad: 1,
            url: 'enableSchedule',
            index: 11
          }
        ],

        typeName: '', // 头部名称

        isStepChange: false,

        isOperation: 0,
        isOperation1: 0,
        // 选课页面跳转过来的
        loadAdjust: ''
      }
    },
    watch: {
      '$route': {
        handler (newVal) {
          // console.log(newVal)
          this.isStepChange = false
          for (let i = 0, len = this.liData.length; i < len; i++) {
            if (newVal.fullPath.indexOf(this.liData[i].url) !== -1) {
              this.isStepChange = true
            }
          }
          if (!this.isStepChange) return // 判断当前路由变化是否为步骤条触发

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

      if (Object.keys(this.$store.state.csmstimetable.goClassRowObj).length > 0) {
        this.rowObj = this.$store.state.csmstimetable.goClassRowObj
        this.classTableID = this.rowObj.ClassTableID
        this.classTableName = this.rowObj.ClassTableName
        if (this.classTableID > 0) {
          this.typeName = this.classTableName // '编辑方案'
        }
      } else {
        this.typeName = '创建方案'
      }
      this.getGeneralFlows()

      // // 选课页面跳转过来的
      // if (xy.param.getValues('loadAdjust') != undefined) {
      //   this.loadAdjust = xy.param.getValues('loadAdjust')
      // };
      // if (this.loadAdjust != '') {
      //   this.backResult()
      // };

      this.defaultChangeTab(0)
    },
    mounted () {
    },
    methods: {
      // 更新状态
      async getGeneralFlows () {
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetMovingClassFlows`, params)
        if (res.success) {
          let resData = res.data
          for (const iterator of this.liData) {
            iterator.isLoad = 0
          }
          this.liData[0].isLoad = 1
          this.liData[1].isLoad = resData.ClassTables
          this.liData[2].isLoad = resData.ClassTableTimes
          this.liData[3].isLoad = resData.Courses
          this.liData[4].isLoad = resData.Class
          this.liData[5].isLoad = resData.Class
          this.liData[6].isLoad = resData.SelectedClassTableTimes
          if (resData.EachLessonClassUpLimit > 0 && resData.Results > 0) {
            this.liData[7].isLoad = 1
          }
          if (resData.ResultCollections > 0 && resData.Results > 0) {
            this.liData[8].isLoad = 1
          }
          if (resData.PublishCollections > 0 && resData.Results > 0) {
            this.liData[9].isLoad = 1
            this.liData[10].isLoad = 1
            this.liData[11].isLoad = 1
          }
          this.isOperation = resData.PublishCollections
          this.isOperation1 = resData.EnableCollections

          this.$store.commit('csmstimetable/changeClassComValKW', {
            new: { classTableID: this.classTableID || 0 }
          })
          this.$store.commit('csmstimetable/changeClassComValKWbase', {
            isOperation: resData.PublishCollections,
            isOperation1: resData.EnableCollections,
            classTableID: this.classTableID,
            classTableType: this.$store.state.csmstimetable.classTableID[1].id
          })
        }
      },
      // 默认跳转步骤
      defaultChangeTab (val) {
        this.liData.map((item) => {
          item.isActive = false
          return item
        })
        this.liData[val].isActive = true
        this.$store.commit('common/getThreeMenuName', this.typeName)
        // 默认跳转页面
        this.$store.commit('common/getParam', { pro: 'classTableOrder', step: val }) // 要返回的路由
        this.$router.push({
          path: `/xyhome/goClassStepsHeader/${this.liData[val].url}`,
          query: this.$store.state.common.menuInfo
        })
      },
      // 点击步骤
      changeTab (item, n) {
        let curClickStep = this.liData.filter((item) => {
          if (item.url === this.tabValue) {
            return item // 当前点击步骤信息
          }
        })
        if (curClickStep[0].isLoad > 0) {
          this.$store.commit('csmstimetable/changeManualAdjust', {// 清空（发布课表跳转至手动调整的参数）
            sloverResultCollectionID: 0,
            showScheduleName: ''
          })
          this.$store.commit('common/getParam', { step: curClickStep[0].index })
          this.$router.push({
            path: `/xyhome/goClassStepsHeader/${curClickStep[0].url}`,
            query: this.$store.state.common.menuInfo
          })
          this.getGeneralFlows()
        }
      },

      // 选课页面跳转过来的
      backResult () {
        //   this.changeLiDt(4)
        // this.liData[4].isActive = true
        // xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/GoClass/CourseSelectionResults/ResultHeader.html', xy.subMenuWebUrl),
        //              {
        //                targetID: 'StepsHeader',
        //                loadParams: {
        //                  classTableID: this.classTableID,
        //                  loadAdjust: this.loadAdjust
        //                }
        //              })
      }
    }
  }
</script>
<style lang="less" scoped>

  @import '../css/stepsHeader.css';
  .step-con .ivu-tabs-nav{
    width: 1800px;
  }

  @import './css/classTable.less';
  @import './css/publice.less';
</style>
