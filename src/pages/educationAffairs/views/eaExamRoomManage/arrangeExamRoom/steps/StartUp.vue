<template>
    <div id="FuncInfo">
        <div class="start-box">
          <div v-if="IsEnabled === 0" class="ready-start">
              <img src="../Image/nulls.png" />
              <div>排考成功后，在手动调整中可以调整排考结果。</div>
          </div>
          <div v-if="IsEnabled === 1" class="text-center loading-center">
              <Icon type="ios-loading" color="#4196FF" size="60" />
              <div style="font-size:14px; color: rgba(0, 0, 0, .45); line-height: 60px;">排考进行中，请稍候...</div>
              <!-- <p style="font-size:14px;color:#7f7f7f;">请刷新后查看排考结果。此过程可能较慢，请耐心等待。</p> -->
          </div>
          <div v-if="IsEnabled === 2" class="ul-center">
              <div class="text-center">
                  <Icon type="ios-close-circle" color="#FF8C8C" size="60" />
                  <div style="margin-top:10px;font-size:16px;">排考失败</div>
              </div>
              <ul>
                  <li>失败原因</li>
                  <li v-for="(startItem,index) in startList" :key="index">{{index+1}}、{{startItem}}</li>
              </ul>
          </div>
          <div v-if="IsEnabled === 3" class="ul-center">
              <div class="text-center">
                  <!-- <Icon type="ios-checkmark-circle-outline" color="#69cc38" size="72" /> -->
                  <div class="icon-wrap">
                    <Icon type="md-checkmark" color="#52C41A" size="28" />
                  </div>
                  <div style="margin-top:25px;font-size:18px;font-weight: bold;">排考成功</div>
              </div>
              <ul class="clearfix">
                  <li v-for="(startItem,index) in startList" :key="index">{{index+1}}、{{startItem}}</li>
              </ul>
          </div>
          <div class="start-foot" v-if="IsEnabled === 0 || IsEnabled === 2">
              <Button class="xy-primary" @click="Create" shape="circle">{{IsEnabled===0?'启动排考':IsEnabled===2?'重新排考':''}}</Button>
          </div>
          <div class="start-foot" v-if="IsEnabled === 1">
              <Button class="xxy-info" @click="Refresh" shape="circle">刷新</Button>
          </div>
          <div class="start-foot" v-if="IsEnabled === 3">
              <Button class="xy-primary" @click="Reset" shape="circle">清除排考结果</Button>
          </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'StartUp',
    data () {
      return {
        apiPath: `${this.$store.state.apiPath}/api/ArrangeSupervisorExam/`,
        startList: [],
        dataItem: '',
        IsEnabled: 0,
        params: this.$store.state.educationAffairs.arrange
      }
    },
    created () {
      this.Refresh()
    },
    mounted () {

    },
    methods: {
      // 判断方案的启动状态 0未开始、1进行中、2失败、3完成
      async GetById () {
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeSupervisorExam/GetById`, params)
        this.xy.unloading()
        if (res.success) {
          this.dataItem = res.data
          this.IsEnabled = res.data.IsEnabled
        }
      },
      // 启动排考
      async Create () {
        this.xy.loading()
        const params = {}
        let res = await this.xy.post(this.apiPath + `ArrangeSupervisorStart?ArrangeSupervisorExamID=${this.params.ArrangeSupervisorExamID}`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.IsEnabled = 1
          // this.params.IsEnabled = 1
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            IsEnabled: 1
          }))
        } else {
          this.IsEnabled = 0
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            IsEnabled: 0
          }))
          // this.params.IsEnabled = 0
          this.xy.msgError(res.msg || '启动失败。')
        };
      },
      // 刷新 GetArrangeSupervisorResult
      async Refresh () {
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(this.apiPath + 'GetArrangeSupervisorResult', params)
        this.xy.unloading()
        if (res.success) {
          this.IsEnabled = res.data.Status
          // let IsEnabled = res.data.Status// 0未启用，1进行中，2失败，3成功
          if (res.data.Status === 2) { // 失败
            // this.params.IsEnabled = 2
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              IsEnabled: 2
            }))
            this.startList = res.data.Message
          };
          if (res.data.Status === 3) { // 成功
            this.startList = res.data.Message
            let arr = JSON.parse(this.params.StepList)
            for (let i = 0; i < 8; i++) {
              arr[i].IsDisabled = false
            }
            this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
              Steps: 7,
              StepList: JSON.stringify(arr)
            }))
            this.$emit('change', { StepList: arr, step: 7 })
          };
        }
      },
      async toClear () {
        this.xy.loading()
        let res = await this.xy.post(this.apiPath + `ArrangeSupervisorClearResult?ArrangeSupervisorExamID=${this.params.ArrangeSupervisorExamID}`, null, true)
        this.xy.unloading()
        if (res.success) {
          this.modal_loading = false
          this.xy.msgSuc(res.msg || '清除成功。')
          this.IsEnabled = 0
          let arr = JSON.parse(this.params.StepList)
          for (let i = 0; i < 6; i++) {
            if (i < 6) {
              arr[i].IsDisabled = false
            } else {
              arr[i].IsDisabled = true
            }
          };
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            IsEnabled: 0,
            Steps: 5,
            StepList: JSON.stringify(arr)
          }))
          this.$emit('change', { StepList: arr, step: 5 })
        } else {
          this.xy.msgError(res.msg || '清除失败。')
        }
      },
      // 清除排考结果
      Reset () {
        if (this.params.GenerateStatus) {
          this.xy.msgError('请先取消发布。')
        } else {
          this.xy.confirm('清除排考结果', '您确定要清除排考结果吗？', () => {
            this.toClear()
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../Css/ArrangeExamRoom/StartUp.less';
</style>
