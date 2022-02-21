<!-- 排课规则-更多设置 -->
<template>
  <div class="xy-content-body">
    <row class="rule-header">
      <i-col span="20">
        <ul class="rule-category">
          <li v-for="item in liData" :class="item.isActive?'li-active':''" :key="item.name">
            <router-link :to="item.url">
              <span >{{item.name}}</span>
            </router-link>
          </li>
        </ul>
      </i-col>
      <i-col span="4" class="text-right">
        <Button  class="xy-primary" @click="back">返回</Button>
      </i-col>
    </row>
    <router-view></router-view>
  </div>
</template>
<script>

  export default {
    name: 'MoreHeader',
    data () {
      return {
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        liData: []
      }
    },

    created () {
      this.$store.commit('csmstimetable/changeRuleKW', { moreVal: [
        {
          name: '师徒跟随',
          isActive: true,
          url: 'iusedFollow'
        },
        {
          name: '上下午课时',
          isActive: false,
          url: 'afternoonClass'
        },
        {
          name: '优先级设置',
          isActive: false,
          url: 'priority'
        },
        {
          name: '其他规则',
          isActive: false,
          url: 'otherRules'
        }
      ] })
      this.liData = this.$store.state.csmstimetable.ruleHeaderKW.moreVal
    },
    mounted () {
    },
    methods: {
      back () {
        this.$store.commit('common/getParam', { step: 4 })
        this.$router.push({
          path: `/xyhome/goClassStepsHeader/ruleHeader`,
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../css/arrangingRules.less';
</style>
