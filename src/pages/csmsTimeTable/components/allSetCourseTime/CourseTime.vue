<template>
  <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
    <ul class="modal-section-ul">
      <li v-for="(item,sdIndex) in sectionData"
          :key="sdIndex"
          :class="item.isSelect?'section-active':''"
          @click="selectSection(item)">{{item.name}}
        <img src="@/assets/csmsTimeTable/active.png"
             alt=""
             v-show='item.isSelect'
             class="active-img">
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      isGetCourseList: {
        type: Boolean,
        required: true
      },
      initSectionData: {
        type: Boolean,
        required: true
      },
      pageName: {
        type: String,
        default: 'goClass'
      }
    },
    name: '',
    data () {
      return {
        selectSectionInfo: {},
        sectionData: []
      }
    },
    watch: {
      isGetCourseList (val) {
        if (val) {
          this.sectionData = []
          this.selectSectionInfo = {}
          let maxLesson = 13
          if (this.pageName === 'administrativeClass') {
            maxLesson = 19
          }
          for (let i = 1; i < maxLesson; i++) {
            this.sectionData.push({
              value: i,
              name: i + '课时',
              isSelect: false
            })
          }
        }
      },
      initSectionData (val) { // 保存并继续初始化数据
        if (!val) return false
        this.selectSectionInfo = {}
        this.sectionData.map((item) => {
          item.isSelect = false
          return item
        })
      }
    },
    methods: {
      selectSection (val) { // 选择课时数
        this.sectionData.map((item) => {
          if (item.value === val.value) {
            item.isSelect = !item.isSelect
          } else {
            item.isSelect = false
          }
          return item
        })
        this.selectSectionInfo = val.isSelect ? val : { }
      }
    }
  }
</script>
<style lang='less' scoped>
@import '../css/courseTime.less';
</style>
