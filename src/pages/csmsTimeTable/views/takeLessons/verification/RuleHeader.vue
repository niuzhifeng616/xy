<template>
  <!-- 10.数据核查 -->
  <div class="areas-part">
    <div class="areas-left" >
        <ul class="tab-ul">
            <li v-for="(item, index) in liData" :key="index"
                :class="item.isActive?'li-active':''"
                @click="ruleLi(item)">
                {{item.name}}
            </li>
        </ul>
    </div>
    <div class="areas-right">
      <ban v-show="showBan" :isOperation="isOperation" :classTableID="classTableID"></ban>
      <must v-show="!showBan" :isOperation="isOperation" :classTableID="classTableID"></must>
    </div>
  </div>
</template>
<script>
  import Ban from './Ban'
  import Must from './Must'
  export default {
    name: 'TLVerRuleHeader',
    components: {
      Ban,
      Must
    },
    data () {
      return {
        liData: [
          {
            name: '可选课程',
            isActive: true,
            url: 'ban'
          },
          {
            name: '课时冲突',
            isActive: false,
            url: 'must'
          }
        ],
        showBan: true,

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
      ruleLi (val) {
        if (!val.isActive) {
          this.liData.map((item) => {
            item.isActive = false
            return item
          })
          val.isActive = true
          if (val.url === 'ban') {
            this.showBan = true
          } else {
            this.showBan = false
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
    @import '../css/takeLessonCommon.css';
</style>
