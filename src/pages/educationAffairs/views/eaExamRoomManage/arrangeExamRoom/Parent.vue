<template>
    <div class="xy-content-module" ref="parentRef">
    <div class="xy-content-title">
        <ul class="parent-nav-content">
            <li
              v-for="(item,index) in StepList"
              class="parent-nav-list"
              :class="!item.IsDisabled&&index!=isIndex&&item.IsIndex!==steps?'success':
                !item.IsDisabled&&index!==isIndex&&item.IsIndex===steps?'arrive':
                (!item.IsDisabled&&index===isIndex) || item.IsIndex===steps?'now':
                item.IsDisabled&&index!==isIndex?'null':''"
              @click="stepChange(item,index, true)" :key="index"
              >
              <div class="parent-nav">
                <!-- 已设置 未选中 -->
                  <span v-show="!item.IsDisabled&&index!==isIndex&&item.IsIndex!==steps" class="parent-nav-icon">
                    {{index + 1}}
                  </span>
                <!-- 选中时 -->
                  <span v-show="(!item.IsDisabled&&index===isIndex) || item.IsIndex===steps" class="parent-nav-icon">
                    {{index + 1}}
                  </span>
                <!-- 未设置 禁用 -->
                  <span v-show="item.IsDisabled&&index!==isIndex" class="parent-nav-icon">
                    {{index + 1}}
                  </span>
              <span class="parent-nav-name" :class="!item.IsDisabled&&index===isIndex?'active':''">{{item.Name}}</span>
              </div>
            </li>
        </ul>
    </div>
    <div class="xy-content-body clearfix">
        <router-view @change="changeSpList"></router-view>
    </div>
</div>
</template>
<script>
  export default {
    name: 'Parent',
    data () {
      return {
        isIndex: this.$store.state.educationAffairs.arrange.isIndex * 1,
        ArrangeSupervisorExamID: this.$store.state.educationAffairs.arrange.ArrangeSupervisorExamID * 1 || 0,
        status: null,
        clickStep: 1,
        StepList: [
          {
            Name: '基本信息',
            Step: 1,
            IsDisabled: true,
            IsIndex: 0,
            urls: 'Basic'
          },
          {
            Name: '考试科目',
            Step: 2,
            IsDisabled: true,
            IsIndex: 1,
            urls: 'ExamSubject'
          },
          {
            Name: '考试学生',
            Step: 3,
            IsDisabled: true,
            IsIndex: 2,
            urls: 'ExamStudent'
          },
          {
            Name: '排考设置',
            Step: 4,
            IsDisabled: true,
            IsIndex: 3,
            urls: 'ExamSetting'
          },
          {
            Name: '排考规则',
            Step: 5,
            IsDisabled: true,
            IsIndex: 4,
            urls: 'ExamRule'
          },
          {
            Name: '启动排考',
            Step: 6,
            IsDisabled: true,
            IsIndex: 5,
            urls: 'StartUp'
          },
          {
            Name: '手动调整',
            Step: 7,
            IsDisabled: true,
            IsIndex: 6,
            urls: 'Adjustment'
          },
          {
            Name: '发布排考',
            Step: 8,
            IsDisabled: true,
            IsIndex: 7,
            urls: 'Publish'
          }
        ],
        ArrangeSupervisorExamName: this.$store.state.educationAffairs.arrange.ArrangeSupervisorExamName,
        SchoolDistrictID: this.$store.state.educationAffairs.arrange.SchoolDistrictID * 1,
        IsEnabled: this.$store.state.educationAffairs.arrange.IsEnabled,
        isEdit: true,
        GenerateStatus: this.$store.state.educationAffairs.arrange.GenerateStatus,
        steps: this.$store.state.educationAffairs.arrange.Steps * 1,
        params: this.$store.state.educationAffairs.arrange
      }
    },
    watch: {
      steps: {
        handler (val) {
          let count = val === 8 ? 7 : val
          if (!this.$store.state.educationAffairs.arrange.StepList) {
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              StepList: JSON.stringify(this.StepList)
            }))
          } else {
            this.StepList = JSON.parse(this.$store.state.educationAffairs.arrange.StepList)
          }
          if (this.ArrangeSupervisorExamID === 0) {
            this.StepList[0].IsDisabled = false
          } else {
            for (let i = 0; i < 8; i++) {
              if (i <= count) {
                this.StepList[i].IsDisabled = false
              } else {
                this.StepList[i].IsDisabled = true
              }
            }
          }
          // 解决第四部添加教师成功后页面不刷新问题
          if (val !== 5) {
            this.stepChange(this.StepList[count], this.params.isIndex)
          }
        },
        immediate: true
      },
      '$route': {
        handler (val) {
          for (const arr of this.StepList) {
            if (arr.urls === val.name) {
              this.isIndex = arr.IsIndex
              this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
                StepList: JSON.stringify(this.StepList),
                isIndex: arr.IsIndex,
                isEdit: this.isEdit
              }))
              return
            }
          }
        }
      }
    },
    created () {
      // 按钮显示控制
      if (this.IsEnabled === 1) {
        this.isEdit = false
      } else {
        if (this.steps < 6) {
          this.isEdit = true
        } else {
          this.isEdit = false
        }
      }
      this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
        Steps: this.steps,
        isEdit: this.isEdit,
        StepList: JSON.stringify(this.StepList)
      }))
    },
    mounted () {
      if (this.steps === 5) {
        this.stepChange(this.StepList[5], this.params.isIndex)
      }
    },
    updated () {
      // 是否发布
      this.GenerateStatus = this.status
      // 控制步骤
      if (this.IsEnabled === 1) {
        this.isEdit = false
      } else {
        if (this.steps < 6) {
          this.isEdit = true
        } else {
          this.isEdit = false
        };
      };
    },
    methods: {
      changeSpList (val) {
        this.StepList = val.StepList
        this.steps = val.step
      },
      stepChange (val, i, status) {
        if (status && this.isIndex === i) {
          return
        }
        console.log(val)
        let ai = i === 8 ? 7 : i
        if (!val.IsDisabled) {
          this.isIndex = ai
          this.cureentPage = this.StepList[ai].urls
          this.$store.commit('common/getParam', null)
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            isIndex: ai,
            Steps: this.steps,
            isEdit: this.isEdit,
            StepList: JSON.stringify(this.StepList)
          }))
          this.$router.push({ name: this.StepList[ai].urls,
                              query: this.$store.state.common.menuInfo })
        };
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../Css/ArrangeExamRoom/Parent.less';
</style>
