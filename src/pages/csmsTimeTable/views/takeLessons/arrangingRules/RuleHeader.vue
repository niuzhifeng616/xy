<template>
  <!-- 8.选课规则 -->
  <div class="areas-part xy-content-body">
    <div class="areas-left" >
        <ul class="tab-ul">
            <li v-for="(item, index) in liData" :key="index"
                :class="item.isActive?'li-active':''"
                @click="ruleLi(item, index)">
                {{item.name}}
            </li>
        </ul>
    </div>
    <div class="areas-right">
      <component :is="currentComponent"></component>
    </div>
  </div>

</template>
<script>
  // 0权限设置
  import Ban from './Ban'
  // 1必须设置
  import Must from './Must'
  // 2连选设置
  import ClassPlatoon from './ClassPlatoon'
  // 3互斥设置
  import SameTme from './SameTme'
  // 4名额设置
  import Quota from './Quota'
  // 5男女设置
  import Gender from './Gender'

  export default {
    name: 'TLArrangRuleHeader',
    components: {
      Ban,
      Must,
      ClassPlatoon,
      SameTme,
      Quota,
      Gender
    },
    data () {
      return {
        currentComponent: 'Ban',

        liData: [
          {
            name: '权限设置',
            isActive: true,
            url: 'Ban'
          },
          {
            name: '必须设置',
            isActive: false,
            url: 'Must'
          },
          {
            name: '连选设置',
            isActive: false,
            url: 'ClassPlatoon'
          },
          {
            name: '互斥设置',
            isActive: false,
            url: 'SameTme'
          },
          {
            name: '名额设置',
            isActive: false,
            url: 'Quota'
          },
          {
            name: '男女设置',
            isActive: false,
            url: 'Gender'
          }
        ],

        isOperation: true,
        classTableID: 0
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.rowObj.ClassTableID
    },
    mounted () {
    },
    methods: {
      ruleLi (item, index) {
        if (!item.isActive) {
          this.liData.map((item) => {
            item.isActive = false
            return item
          })
          item.isActive = true
          this.currentComponent = item.url
        }
      }

    }
  }
</script>
<style lang="less" scoped>
  @import '../css/takeLessonCommon.css';
  .areas-part{
    padding-top: 0;
  }
</style>
