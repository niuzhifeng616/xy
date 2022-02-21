<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <Alert style="margin-bottom:0px;" v-if="evaluInfo.length>0&&evaluInfo[0].Type==='NV'" show-icon>分值只能输入整数，如果输入小数会自动去掉小数，保留整数</Alert>
    </div>
    <div class="xy-content-body">
      <commIndex :evaluInfo="evaluInfo" :isEvaluation="isEvaluation" ref="eval" @listenHandle="getSubmitList"></commIndex>
    </div>
    <div class="box-but xy-flex xy-between xy-center" v-if="evaluInfo.length>0">
      <div style="color:#7f7f7f;">{{startNum}}</div>
      <div>
      <Button class="xy-btn-primary" shape="circle" @click="submitAlone">保存</Button>
      <Button class="xy-btn-close" @click="back">取消</Button>
      </div>
    </div>
  </div>
</template>
<script>
  import commIndex from './commIndex'
  export default {
    components: {
      commIndex
    },
    name: 'CreateEvalu',
    data () {
      return {
        // 2019-02-21  高中1班第一节  语文
        evaluInfo: [], // 单个详情
        submitList: [],
        isEvaluation: false,
        startNum: ''
      }
    },
    computed: {
      courseInfo () {
        return JSON.parse(this.$route.query.params)
      }
    },
    watch: {
      courseInfo: {
        handler (val) {
          this.isEvaluation = val.pickArr !== undefined ? false : val.IsEvaluation !== undefined ? val.IsEvaluation : Number(val.IsHaveEvaluation) === 1
        },
        deep: true,
        immediate: true
      }
    },
    created () {
      this.getStuInfo()
    },
    methods: {
      getSubmitList (val) {
        this.submitList = val
      },
      // 保存单个操作
      async submitAlone () {
        // 获取操作后的值-只需要3级指标下面的值
        let arr = {}
        let isSC = 1
        let isNX = 1
        let isType = 'SC'
        let maxRote = 0
        let minRote = 0
        let ft = this.evaluInfo
        for (const item of ft) {
          if (item.StandardLevelNext.length > 0) {
            for (const item1 of item.StandardLevelNext) {
              if (item1.StandardLevelNext.length > 0) {
                for (const item2 of item1.StandardLevelNext) {
                  isType = item2.Type
                  maxRote = item2.MaxValue
                  minRote = item2.MinimumValue
                  if (item2.Value < item2.MinimumValue) {
                    isSC = 0
                  }
                  if (item2.Value > item2.MaxValue) {
                    isNX = 0
                  }
                  arr[item2.StandardID] = item2.Value
                }
              }
            }
          }
        }
        if (isSC === 1 && isNX === 1) {
          let params = {
            StandardSubjectConfigureID: ft[0].StandardSubjectConfigureID,
            ClassTableGenerateForStudentID: this.courseInfo.ClassTableGenerateForStudentID,
            ClassTableGenerateBaseID: this.courseInfo.ClassTableGenerateBaseID,
            StandardValue: arr,
            ListStudentID: this.courseInfo.pickArr !== undefined ? this.courseInfo.pickArr : [this.courseInfo.StudentId]
          }
          this.xy.loading()
          let url = this.isEvaluation ? '/api/Evaluation/UpdateEvaluate' : '/api/Evaluation/CreateEvaluate'
          let res = await this.xy.post(`${this.$store.state.apiPath}${url}`, params, true)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc(res.msg)
            this.back()
          } else {
            this.xy.msgError(res.msg)
          }
        } else {
          if (isSC === 0) {
            this.xy.msgError(isType === 'SC' ? '评星数不能小于最小星数：' + minRote + '星' : '评分不能小于最小分：' + minRote + '分')
          }
          if (isNX === 0) {
            this.xy.msgError(isType === 'SC' ? '评星数不能大于最大星数：' + maxRote + '星' : '评分不能大于最大分：' + maxRote + '分')
          }
        }
      },
      back () {
        this.$router.go(-1)
      },
      async getStuInfo () {
        let params = {
          studentId: this.courseInfo.StudentId,
          baseId: this.courseInfo.ClassTableGenerateBaseID,
          schoolDistrictId: this.courseInfo.SchoolDistrictID,
          studentGradeForStudentYearId: this.courseInfo.StudentGradeForStudentYearID,
          disciplineId: this.courseInfo.DisciplineID,
          subjectId: this.courseInfo.SubjectID,
          classTableGenerateForStudentId: this.courseInfo.ClassTableGenerateForStudentID
        }
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Evaluation/GetEvaluate`, params, true)
        this.xy.unloading()
        if (res.success) {
          if (res.data && res.data.length > 0) {
            for (var i = 0, len = res.data.length; i < len; i++) {
              if (i === 0) {
                this.$set(res.data[i], 'show', true)
              } else {
                this.$set(res.data[i], 'show', false)
              }
            }
            this.evaluInfo = res.data
            this.startNum = this.evaluInfo[0].Type === 'SC'
              ? `注：每颗星代表${this.evaluInfo[0].Conversion}分，评价前显示的为默认值，点击确定后默认值生效`
              : '注：评价前显示的为默认值，点击确定后默认值生效'
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .box-top {
    padding: 0 20px;
    height: 47px;
    background: #FFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size:20px;
      font-weight:bold;
      color:rgba(0,0,0,1);
    }
  }
  .box-bot {
    padding: 20px;
  }
  .box-but {
    position: fixed;
    left: 60px;
    right: 0;
    bottom: 0;
    text-align: center;
    padding: 10px;
    height:56px;
    border-top: 1px solid #eee;
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 2px 0px rgba(0, 0, 0, 0.09);
  }
</style>
