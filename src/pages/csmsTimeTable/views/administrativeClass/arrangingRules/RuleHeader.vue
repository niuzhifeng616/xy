<template>
  <div class="xy-content-body">
    <div class="text-center left-tab">
      <div class="subject-set">
        <!-- <p class="subject-rules"><span> 选课规则</span>
          <Icon type="ios-arrow-down" />
        </p> -->
        <ul class="subjects-ul">
          <li v-for="(item,index) in liData" :class="item.isActive?'active-li':''" :key='index'>
            <span @click="ruleLi(item)">{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="right-content">
        <component :is="settingComponent"></component>
    </div>
  </div>
</template>
<script>
  import Ban from './Ban'
  import ClassPlatoon from './ClassPlatoon'
  import AfternoonClass from './AfternoonClass'
  import CourseMutex from './CourseMutex'
  import InClass from './InClass'
  import IusedFollow from './IusedFollow'
  import Must from './Must'
  import OtherRules from './OtherRules'
  import Priority from './Priority'
  import SameTme from './SameTme'
  import SingleDoubleWeek from './SingleDoubleWeek'
  import TeachersClassRoom from './TeachersClassRoom'
  export default {
    components: { Ban, ClassPlatoon, AfternoonClass, CourseMutex, InClass, Must, IusedFollow, OtherRules, Priority, SameTme, SingleDoubleWeek, TeachersClassRoom },
    data () {
      return {
        StepsHeader: {},
        classPlan: {},
        // 选课规则
        settingComponent: 'Ban',
        liData: [
          {
            name: '禁止排课',
            isActive: true,
            url: 'Ban'
          },
          {
            name: '必须排课',
            isActive: false,
            url: 'Must'
          },
          {
            name: '连排课程',
            isActive: false,
            url: 'ClassPlatoon'
          },
          {
            name: '合班上课',
            isActive: false,
            url: 'InClass'
          },
          {
            name: '同时上课',
            isActive: false,
            url: 'SameTme'
          },
          {
            name: '单双周',
            isActive: false,
            url: 'SingleDoubleWeek'
          },
          {
            name: '师徒跟随',
            isActive: false,
            url: 'IusedFollow'
          },
          {
            name: '课程互斥',
            isActive: false,
            url: 'CourseMutex'
          },
          {
            name: '上下午课时',
            isActive: false,
            url: 'AfternoonClass'
          },
          {
            name: '设置教师和教室',
            isActive: false,
            url: 'TeachersClassRoom'
          },
          {
            name: '优先级设置',
            isActive: false,
            url: 'Priority'
          },
          {
            name: '其他规则',
            isActive: false,
            url: 'OtherRules'
          }
        ]
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
    },
    mounted: function () {

    },
    methods: {
      ruleLi (val) {
        if (!val.isActive) {
          this.liData.map(item => {
            item.isActive = false
            return item
          })
          val.isActive = true
          this.settingComponent = val.url
        }
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../../css/subjectRules.less';
.xy-content-body{
  padding: 0;
}
</style>
