<template>
  <!-- 5.排课规则 -->
  <div class="xy-content-body box">
    <div class="box-left">
      <ul>
        <li v-for="(item,index) in liData" :class="item.isActive?'checked':''" :key="index">
            <span @click="ruleLi(item)">{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="box-right">
      <component :is="settingComponent"></component>
    </div>
</div>
</template>
<script>
  import Ban from './Ban'
  import Must from './Must'
  import ClassPlatoon from './ClassPlatoon'
  import SameTme from './SameTme'
  import IusedFollow from './IusedFollow'
  import AfternoonClass from './AfternoonClass'
  import Priority from './Priority'
  import OtherRules from './OtherRules'

  export default {
    name: 'RuleHeader',
    components: {
      Ban,
      Must,
      ClassPlatoon,
      SameTme,
      IusedFollow,
      AfternoonClass,
      Priority,
      OtherRules
    },
    data () {
      return {
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
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
            name: '同时上课',
            isActive: false,
            url: 'SameTme'
          },
          {
            name: '师徒跟随',
            isActive: false,
            url: 'IusedFollow'
          },
          {
            name: '上下午课时',
            isActive: false,
            url: 'AfternoonClass'
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
    },
    mounted () {
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
  @import '../css/arrangingRules.less';
  .box {
    padding-bottom: 60px;
    border-top: 1px solid #E8E8E8;
    display: flex;
    padding-top: 0;
    .box-left {
      width: 10%;
      border-right: 1px solid rgba(0,0,0,0.09);
      padding-top: 5px;
      ul{
        color: rgba(0,0,0,0.65);
        li {
          display: flex;
          justify-content: center;
          align-items: center;
          margin:10px 0;
          height: 35px;
          cursor: pointer;
        }
        li.checked {
          color:#4196FF;
          border-right: 2px solid #4196ff;
          font-weight: 700;
        }
      }
    }
    .box-right {
      width: 90%;
      .ivu-tree-title-selected { //不生效
        background-color: #fff;
      }
    }
  }

</style>
