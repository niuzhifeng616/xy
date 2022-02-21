<template>
  <!-- 4.开班计划-查看开班设置 -->
  <div class="xy-content-body">
    <div class="xy-content-table pr">
        <div style="font-size:14px;">
          <tabs value="1" :animated="false">
              <tab-pane label="教师" name="1">
                  <div style="margin-bottom:10px;"
                      v-if="isOperation === 0 && teacherDatatable.length>0">
                      <Button  class="xy-primary" @click="downFileCrouseSet('Teachers')"
                                >导出</Button>
                  </div>
                  <i-table border
                          :no-data-text="'暂无相关教师信息。'"
                          ref="selection"
                          :columns="teacherColumns"
                          :data="teacherDatatable"></i-table>
              </tab-pane>
              <tab-pane label="课时" name="2">
                  <div style="margin-bottom:10px;"
                      v-if="isOperation === 0 && lessonDatatable.length>0">
                      <Button  class="xy-primary" @click="downFileCrouseSet('Lesson')">导出</Button>
                  </div>
                  <i-table border
                          :no-data-text="'暂无相关课时信息。'"
                          ref="selection"
                          :columns="lessonColumns"
                          :data="lessonDatatable"></i-table>

              </tab-pane>
              <tab-pane label="富裕班额" name="3">
                  <div style="margin-bottom:10px;"
                      v-if="isOperation === 0 && limitationDatatable.length>0">
                      <Button  class="xy-primary" @click="downFileCrouseSet('StudentLimitation')">导出</Button>
                  </div>
                  <div style="overflow-x:auto">
                      <i-table border
                              :no-data-text="'暂无相关富裕班额信息。'"
                              ref="selection"
                              :columns="limitationColumns"
                              :data="limitationDatatable"></i-table>
                  </div>

              </tab-pane>
              <tab-pane label="任课节数" name="4">
                  <div style="margin-bottom:10px;"
                      v-if="isOperation === 0 && teacherLessionsDatatable.length>0">
                      <Button  class="xy-primary" @click="downFileCrouseSet('TeacherLesson')">导出</Button>
                  </div>
                  <i-table border
                          :no-data-text="'暂无相关任课节数信息。'"
                          ref="selection"
                          :columns="teacherLessionsColumns"
                          :data="teacherLessionsDatatable"></i-table>
              </tab-pane>
          </tabs>
        </div>
        <Button class="xy-info pa" @click="ReturnClick" style="right: 0; top: 0;">返回</Button>
    </div>
  </div>
</template>
<script>

  export default {
    name: 'LookSet',
    components: {
    },
    data () {
      return {
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        lessonColumns: [],
        lessonDatatable: [],
        limitationColumns: [],
        limitationDatatable: [],
        teacherColumns: [],
        teacherDatatable: [],
        teacherLessionsColumns: [],
        teacherLessionsDatatable: []
      }
    },
    created () {
    },
    mounted () {
      this.getAssignClassCourseSetting()
    },
    methods: {
      async getAssignClassCourseSetting () {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/GetAssignClassCourseSetting`, params)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          resData.lessonColList.map((item) => {
            item.minWidth = 150
            return item
          })
          resData.studentLimitationColList.map((item) => {
            item.minWidth = 150
            return item
          })
          resData.teacherColList.map((item) => {
            item.minWidth = 150
            return item
          })
          // 教师
          this.teacherColumns = resData.teacherColList
          this.teacherDatatable = JSON.parse(resData.TeacherDt)

          // 课时
          this.lessonColumns = resData.lessonColList
          this.lessonDatatable = JSON.parse(resData.LessonDt)

          // 富裕班额
          this.limitationColumns = resData.studentLimitationColList
          this.limitationDatatable = JSON.parse(resData.StudentLimitationDt)

          // 任课节数
          this.teacherLessionsColumns = resData.teacherLessonColList
          this.teacherLessionsDatatable = JSON.parse(resData.TeacherLessionsDt)
        }
      },
      // 查看课程设置的导出
      downFileCrouseSet (type) {
        this.xy.downFile(`${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/ExportAssignClassCourseSetting?classTableID=${this.classTableID}&type=${type}`)
      },
      // 返回
      ReturnClick: function () {
        this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 3 })
        this.$router.push({
          path: '/xyhome/goClassStepsHeader/startClassSet',
          query: this.$store.state.common.menuInfo
        })
        this.$parent.tabValue = this.$parent.liData[3].url
      }
    }
  }
</script>
<style lang="less" scoped>
    @import '../css/startClassSet.less';
</style>
