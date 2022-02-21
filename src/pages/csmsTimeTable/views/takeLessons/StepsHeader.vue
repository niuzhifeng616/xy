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
    name: 'TLStepsHeader',
    data () {
      return {
        rowObj: '',
        classTableID: 0,
        classTableName: '',

        tabValue: 'CreateClassTable', // 对应TabPane的name (当前步骤的url)
        liData: [
          {
            name: '基本信息',
            isActive: false,
            isLoad: 0,
            url: 'CreateClassTable',
            index: 0
          },
          {
            name: '作息时间',
            isActive: false,
            isLoad: 0,
            url: 'WorkTime',
            index: 1
          },
          {
            name: '选课学生',
            isActive: false,
            isLoad: 0,
            url: 'ArrangingStudents',
            index: 2
          },
          {
            name: '排课课位',
            isActive: false,
            isLoad: 0,
            url: 'Arranging',
            index: 3
          },
          {
            name: '课程设置',
            isActive: false,
            isLoad: 0,
            url: 'CourseSetting',
            index: 4
          },
          {
            name: '查看课表',
            isActive: false,
            isLoad: 0,
            url: 'LookSchedule',
            index: 5
          },
          {
            name: '选课模式',
            isActive: false,
            isLoad: 0,
            url: 'SelectionType',
            index: 6
          },
          {
            name: '选课规则',
            isActive: false,
            isLoad: 0,
            url: 'ArrangingRules',
            index: 7
          },
          {
            name: '生成选课数据',
            isActive: false,
            isLoad: 0,
            url: 'RegistrationData',
            index: 8
          },
          {
            name: '数据核查',
            isActive: false,
            isLoad: 0,
            url: 'Verification',
            index: 9
          },
          {
            name: '选课时间',
            isActive: false,
            isLoad: 0,
            url: 'CourseSelectionTime',
            index: 10
          },
          {
            name: '选课结果',
            isActive: false,
            isLoad: 0,
            url: 'CourseSelectionResults',
            index: 11
          },
          {
            name: '发布启用',
            isActive: false,
            isLoad: 0,
            url: 'ReleaseSchedule',
            index: 12
          }
        ],

        typeName: '', // 头部名称

        isOperation: 0, // 是否可以启动
        isClassTableGenerateForSelectCourse: true, // 选课模式是否可以改变
        // 选课页面跳转过来的
        loadAdjust: ''
      }
    },
    watch: {
      '$route': {
        handler (newVal) {
          // console.log(newVal)
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

      if (Object.keys(this.$store.state.csmstimetable.takeLessonsRowObj).length > 0) {
        this.rowObj = this.$store.state.csmstimetable.takeLessonsRowObj
        this.classTableID = this.rowObj.ClassTableID
        this.classTableName = this.rowObj.ClassTableName
        if (this.classTableID > 0) {
          this.typeName = this.classTableName // '编辑方案'
        }
      } else {
        this.typeName = '创建方案'
      }
      this.getGeneralFlows()

      if (this.$store.state.csmstimetable.takeLessonsGoSelectResult.classTableID > 0) {
        // 选课页面跳转过来的，跳转至选课结果页面
        this.tabValue = this.liData[11].url
        this.defaultChangeTab(11)
      } else {
        this.defaultChangeTab(0)
      }
    },
    mounted () {
    },
    methods: {
      // 更新状态
      async getGeneralFlows () {
        if (this.classTableID > 0) {
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetSchoolBasedGrabClassTableFlows`, {
            classTableID: this.classTableID
          })
          if (res.success) {
            var resData = res.data
            this.Elevtives = resData.Elevtives
            this.ClassTableGenerateForSelectCourse = resData.ClassTableGenerateForSelectCourse
            this.liData.map((item) => {
              item.isLoad = 0
              return item
            })
            this.liData[0].isLoad = 1
            this.liData[1].isLoad = resData.ClassTables
            this.liData[2].isLoad = resData.ClassTableTimes
            this.liData[3].isLoad = resData.CollectionStudents
            this.liData[4].isLoad = resData.SelectedClassTableTimes
            this.liData[5].isLoad = resData.Results
            this.liData[6].isLoad = resData.Results
            this.liData[7].isLoad = resData.SelectCourseMode
            this.liData[8].isLoad = resData.SelectCourseMode
            this.liData[9].isLoad = resData.SelectCourseDatas
            this.liData[10].isLoad = resData.SelectCourseDatas
            this.liData[11].isLoad = resData.SelectCourseDatas
            this.liData[12].isLoad = resData.SelectCourseDatas
            this.isOperation = resData.PublishCollections
            this.isClassTableGenerateForSelectCourse = resData.ClassTableGenerateForSelectCourse
          }
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
        this.$store.commit('common/getParam', { pro: 'takeLessons', step: val }) // 校本排课（抢课）。takeLessons要返回的路由
        this.$router.push({
          path: `/xyhome/TakeLessonsStepsHeader/${this.liData[val].url}`,
          query: this.$store.state.common.menuInfo
        })
      },
      // 点击步骤
      changeTab () {
        let _this = this
        let curClickStep = this.liData.filter((item) => {
          if (item.url === _this.tabValue) {
            return item // 当前点击步骤信息
          }
        })
        if (curClickStep[0].isLoad > 0) {
          this.$store.commit('common/getParam', { pro: 'takeLessons', step: curClickStep[0].index })// 校本排课
          this.$router.push({
            path: `/xyhome/TakeLessonsStepsHeader/${curClickStep[0].url}`,
            query: this.$store.state.common.menuInfo
          })
          this.getGeneralFlows()
        }
      }
    }
  }
</script>
<style lang="less">
  @import '../css/stepsHeader.css';
</style>
