<template>
  <div id="FuncInfo">
    <div class="start-box">
          <div v-if="!GenerateStatus" class="ready-start">
            <img src="../Image/nulls.png" />
            <div>发布排考场方案后，在报表汇总中可以查看结果。</div>
          </div>
          <div v-else class="ul-center">
            <div class="text-center" v-if="circleIcon">
              <!-- <Icon type="ios-checkmark-circle" color="#69cc38" size="60" /> -->
              <div class="icon-wrap">
                <Icon type="md-checkmark" color="#52C41A" size="28" />
              </div>
              <div style="margin-top:10px;font-size:16px;">发布成功</div>
            </div>
            <div class="text-center" v-else>
              <Icon type="ios-close-circle" color="#FF8C8C" size="60" />
              <div style="margin-top:10px;font-size:16px;">发布失败</div>
            </div>
            <ul v-if="startList.length!==0">
              <li>发布结果</li>
              <li v-for="(startItem, index) in startList" :key="index">
                <p v-if="startItem.ValidateSuccess">
                  <Icon type="ios-checkmark-circle" color="#69cc38" size="18" style="margin-right:4px;" />
                  <span>{{startItem.ValidateTitle}}</span>
                </p>
                <div v-else>
                  <li>失败原因</li>
                  <p style="margin-bottom:10px;">
                    <Icon type="ios-close-circle" color="#FF8C8C" size="18" style="margin-right:4px;" />
                    <span>{{startItem.ValidateTitle}}</span>
                  </p>
                  <p>{{startItem.ErrorMessage}}</p>
                </div>
              </li>
            </ul>
            <!-- <ul v-if="params.lens===8&&startList.length===0"> -->
            <ul v-if="startList.length===0">
              <li>发布结果</li>
              <li>
                <p>
                  <!-- <Icon type="ios-checkmark-circle" color="#69cc38" size="18" style="margin-right:4px;" /> -->
                  <span>校验是否有漏排考场的学生成功。</span>
                </p>
              </li>
              <li>
                <p>
                  <!-- <Icon type="ios-checkmark-circle" color="#69cc38" size="18" style="margin-right:4px;" /> -->
                  <span>校验是否每一考场都有监考教师成功。</span>
                </p>
              </li>
              <li>
                <p>
                  <!-- <Icon type="ios-checkmark-circle" color="#69cc38" size="18" style="margin-right:4px;" /> -->
                  <span>校验是否有同一时间参加两场考试的学生成功。</span>
                </p>
              </li>
              <li>
                <p>
                  <!-- <Icon type="ios-checkmark-circle" color="#69cc38" size="18" style="margin-right:4px;" /> -->
                  <span>校验是否有同一时间有两场监考的教师成功。</span>
                </p>
              </li>
            </ul>
          </div>
          <div class="start-foot" v-if="!Isbtn">
            <Button class="xy-primary" @click="Create" shape="circle">发布</Button>
          </div>
          <div class="start-foot" v-else>
            <Button class="xy-primary" @click="Reset" shape="circle">取消发布</Button>
          </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Publish',
    data () {
      return {
        apiPath: `${this.$store.state.apiPath}/api/ArrangeSupervisorExam/`,
        startList: [],
        dataItem: '',
        GenerateStatus: '',
        circleIcon: true,
        Isbtn: false,
        params: this.$store.state.educationAffairs.arrange
      }
    },
    created () {
      this.GetById()
    },
    mounted () {

    },
    methods: {
      // 判断方案的启动状态 GenerateStatus
      async GetById () {
        this.xy.loading()
        const params = {
          id: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(this.apiPath + 'GetById', params)
        this.xy.unloading()
        if (res.success) {
          this.dataItem = res.data
          // this.params.status = res.data.GenerateStatus// 是否发布中间键
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            status: res.data.GenerateStatus,
            GenerateStatus: res.data.GenerateStatus
          }))
          this.GenerateStatus = res.data.GenerateStatus
          if (this.GenerateStatus) {
            this.Isbtn = true
          } else {
            this.Isbtn = false
          };
        }
      },

      // 发布
      async Create () {
        this.xy.loading()
        let res = await this.xy.post(this.apiPath + 'ArrangeSupervisorRelease?ArrangeSupervisorExamID=' + this.params.ArrangeSupervisorExamID, null, true)
        this.xy.unloading()
        if (res.success) {
          this.startList = res.data.result
          this.GenerateStatus = true
          let arr = []
          for (let i = 0; i < this.startList.length; i++) {
            if (this.startList[i].ValidateSuccess === false) {
              arr.push(this.startList[i].ValidateSuccess)
            }
          };
          if (arr.length === 0) {
            this.circleIcon = true
            this.Isbtn = true
            // this.params.status = true// 是否发布中间键
            let arr = JSON.parse(this.params.StepList)
            for (let i = 0; i < 8; i++) {
              if (i < 8) {
                arr[i].IsDisabled = false
              } else {
                arr[i].IsDisabled = true
              }
            }
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              Steps: 7,
              status: true,
              GenerateStatus: true,
              StepList: JSON.stringify(arr)
            }))
            this.$emit('change', { StepList: arr, step: 7 })
          } else {
            this.circleIcon = false
            this.Isbtn = false
            let arr = JSON.parse(this.params.StepList)
            for (let i = 0; i < 8; i++) {
              arr[i].IsDisabled = false
            }
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              status: false,
              Steps: 7,
              GenerateStatus: true,
              StepList: JSON.stringify(arr)
            }))
            this.$emit('change', { StepList: arr, step: 7 })
          };
        } else {
          this.xy.msgError(res.msg || '发布失败。')
        }
      },

      // 取消发布
      async Reset () {
        this.xy.loading()
        let res = await this.xy.post(this.apiPath + 'ArrangeSupervisorRelease?ArrangeSupervisorExamID=' + this.params.ArrangeSupervisorExamID, null, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || '取消发布成功。')
          this.GenerateStatus = false
          // this.params.status = false// 是否发布中间键
          this.Isbtn = false
          let arr = JSON.parse(this.params.StepList)
          for (let i = 0; i < 8; i++) {
            if (i < 8) {
              arr[i].IsDisabled = false
            } else {
              arr[i].IsDisabled = true
            }
          }
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            status: false,
            GenerateStatus: false,
            Steps: 7,
            StepList: JSON.stringify(arr)
          }))
          this.$emit('change', { StepList: arr, step: 7 })
        } else {
          this.xy.msgError(res.msg || '取消发布失败。')
          let arr = JSON.parse(this.params.StepList)
          for (let i = 0; i < 8; i++) {
            arr[i].IsDisabled = false
          }
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            status: true,
            GenerateStatus: true,
            Steps: 7,
            StepList: JSON.stringify(arr)
          }))
          this.$emit('change', { StepList: arr, step: 7 })
        };
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../../Css/ArrangeExamRoom/StartUp.less';
</style>
