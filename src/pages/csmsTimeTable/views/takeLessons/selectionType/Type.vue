<template>
<!-- 7.选课模式 -->
<div class="xy-content-body">
  <div v-if="showModeType">
    <div class="text-center" style="margin:0 0 50px; padding-top:50px; font-size:24px;font-weight:bold;">
        <span v-if="simple">当前已选:简单模式</span>
        <span v-if="group">当前已选:分组模式</span>
    </div>
    <Row>
        <i-col span="12" style="padding-right:33px;">
            <div class="fr type-box-home pr"
                 @click="radioChange(0)"
                :class="simple?'box-select':''">
                <div class="text-center type-header">
                    <p class="row-line" style="margin-right: 10px;"></p>
                    <p class="type-name">
                        <span style="color:#4196FF">简单</span>
                        <span style="color:#333">模式</span>
                    </p>
                    <p class="row-line" style="margin-left:10px;"></p>
                </div>
                <p class="type-info">
                    如果本次选课能够通过最多选几门，最少选几门满足学生选课，请选择“简单模式”
                </p>
                <div class="img-ab">
                    <img src="@/assets/csmsTimeTable/TakeLessons1.png" />
                </div>
            </div>
        </i-col>
        <i-col span="12" style="padding-left:33px;">
            <div class="fl type-box-home pr"
                   @click="radioChange(1)"
                :class="group?'box-select':''">
                <div class="text-center type-header">
                    <p class="row-line" style="margin-right:10px;"></p>
                    <p class="type-name">
                        <span style="color:#4196FF">分组</span>
                        <span style="color:#333">模式</span>
                    </p>
                    <p class="row-line" style="margin-left:10px;"></p>
                </div>
                <p class="type-info">
                    无法满足选课时，请选择“分组模式”，如果选择分组模式，需要完成分组设置才可继续进行本次排课的后续步骤
                </p>
                <div class="text-center pr" style="margin-top:80px;z-index:99">
                    <Button class="xy-btn-primary" shape="circle" @click="loadPage" :disabled="!group">设置分组</Button>
                </div>
                <div class="img-ab">
                    <img src="@/assets/csmsTimeTable/TakeLessons2.png" />
                </div>
            </div>
        </i-col>
    </Row>
  </div>
  <grouping-pattern v-else
    @closeGroupPattern="closeGroupPatternFun"
    :isOperation="isOperation"
    :classTableID="classTableID"></grouping-pattern>
</div>
</template>
<script>
  import GroupingPattern from './GroupingPattern'
  export default {
    name: 'TLSeleType',
    components: {
      GroupingPattern
    },
    data () {
      return {
        showModeType: true, // “模式展示”和“设置分组模式”的显示切换，默认“模式展示”
        isOperation: true,
        isClassTableGenerateForSelectCourse: true,
        classTableID: 0,

        simple: false, // 简单模式
        group: false, // 分组模式
        SelectCourseMode: 0
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.isClassTableGenerateForSelectCourse = this.$parent.isClassTableGenerateForSelectCourse
      this.classTableID = this.$parent.rowObj.ClassTableID
    },
    mounted () {
      this.getModel()
    },
    methods: {
      async getModel () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/GetSchoolBasedGrabSubjectSettingGroupSelectCourseMode`, {
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.SelectCourseMode = res.data.SelectCourseMode
          if (this.SelectCourseMode > 0) {
            this.group = true
            this.simple = false
          } else {
            this.group = false
            this.simple = true
          }
        }
      },
      // 设置选课模式
      radioChange (val) {
        if (this.SelectCourseMode === val) {
          return false
        }
        if (this.isClassTableGenerateForSelectCourse === 0) { // 选课模式是否可以改变
          this.SetSelectCourseMode(val)
        } else {
          this.xy.msgError('当前已有选课结果，不能修改选课模式。')
        }
      },
      async SetSelectCourseMode (val) {
        if (this.isOperation === 0) {
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SchoolBasedGrabSelectCourseSetting/SetSelectCourseMode`, {
            classTableID: this.classTableID,
            selectCourseMode: val
          })
          if (res.success) {
            this.getModel()
            this.$parent.getGeneralFlows()
          }
        }
      },
      loadPage () {
        if (this.group) {
          this.showModeType = false
        }
      },
      closeGroupPatternFun () {
        this.showModeType = true // 关闭“设置分组”组件
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/selectionType.css';
</style>
