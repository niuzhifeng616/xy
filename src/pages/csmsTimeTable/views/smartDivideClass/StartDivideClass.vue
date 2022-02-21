<!--4.启动分班  -->
<template>
  <div class="xy-content-body">
    <div class="start-divide text-center">
      <i-circle :percent="percent"
                :stroke-color="percent===100?'#52C41A':'#4196FF'"
                style="margin-top:90px;">
        <span class="demo-Circle-inner"
              v-if="percent<100"
              style="font-size:24px">{{percent}}%</span>
        <Icon type="ios-checkmark"
              v-if="percent==100"
              size="60"
              style="color:#52C41A"></Icon>
      </i-circle>
      <p style="color:rgba(0,0,0,0.43);margin:16px 0 23px;">
        <span v-if="percent==0">请点击启动分班，开始进行分班。</span>
        <span v-if="0<percent&&percent<100">分班进行中，请稍后…</span>
        <span v-if="percent==100"
              style="color:rgba(0,0,0,0.85);font-size:24px;font-weight:600">分班完成。</span>
      </p>
      <div>
        <Button class="xy-primary"
                shape="circle"
                @click="startupDivideClass"
                :loading="loading"
                :disabled="smartDivideStepsHeader.isOperation !== 0"
                style="margin-right:0">启动分班</Button>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        percent: 0,
        loading: false,
        time: '',
        smartDivideStepsHeader: {}
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent
    },
    methods: {
      async startupDivideClass () {
        this.loading = true
        this.percentFun()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/StartupDivideClass`, {
          DivideClassID: this.smartDivideStepsHeader.divideClassID
        }, true)
        if (res.success) {
          this.xy.msgSuc('启动成功。')
          this.percent = 100
          this.loading = false
          this.smartDivideStepsHeader.getGeneralFlows()
        } else {
          this.percent = 0
          this.xy.msgError(res.msg)
          clearTimeout(this.time)
          this.loading = false
        }
      },
      percentFun () { // 进度条
        if (this.percent < 90) {
          this.percent += 10
          this.time = setTimeout(() => {
            this.percentFun()
          }, 200)
        }
      }
    }

  }
</script>
<style lang='less' scoped>
</style>
