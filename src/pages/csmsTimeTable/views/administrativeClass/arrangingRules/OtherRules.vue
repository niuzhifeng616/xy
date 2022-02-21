
<template>
  <div id="arrangingRules">
   <div class="other-rule">
        <div>
               <Checkbox v-model="IsJiaoAnQiTou" class="other-check" >
                    <span class="f14" >教案齐头 | 各教师教案平头对齐，方便教师备课</span>
                </Checkbox>
                <Checkbox v-model="IsKeShiFenBu" class="other-check">
                    <span class="f14">课时分布 | 各学科各教师课时分布均衡，同时周内分散，天内集中</span>
                </Checkbox>
                <Checkbox v-model="IsKeChengYouXian" class="other-check">
                    <span class="f14">课程优先 | 根据课程显示顺序优先安排重点课程</span>
                </Checkbox>
                <Checkbox v-model="IsShiDuanYouXian" class="other-check">
                    <span class="f14">时段优先 | 优先安排重点时段，比如上午前两节课</span>
                </Checkbox>
                <Checkbox v-model="IsLianTangChuLi" class="other-check">
                    <span class="f14">连堂处理 | 连堂不跨上下午，不跨课间活动</span>
                </Checkbox>
           </div>
        <div class="text-center">
            <Button class="xy-btn-primary"  shape="circle"  @click="submit"
                      :disabled="StepsHeader.isOperation != 0">保存</Button>
        </div>
        <img :src="require('@/assets/csmsTimeTable/rule2.png')" class="other-img"/>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        StepsHeader: {},
        classPlan: {},
        IsJiaoAnQiTou: false,
        IsKeShiFenBu: false,
        IsKeChengYouXian: false,
        IsShiDuanYouXian: false,
        IsLianTangChuLi: false
      }
    },
    created () {
      this.StepsHeader = this.$parent.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      this.geExtend()
    },
    mounted () {

    },
    methods: {
      // 获取列表数据
      geExtend () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GeExtend`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            this.IsJiaoAnQiTou = resData.IsJiaoAnQiTou
            this.IsKeShiFenBu = resData.IsKeShiFenBu
            this.IsKeChengYouXian = resData.IsKeChengYouXian
            this.IsShiDuanYouXian = resData.IsShiDuanYouXian
            this.IsLianTangChuLi = resData.IsLianTangChuLi
          }
        })
      },
      submit () {
        if (this.StepsHeader.isOperation === 0) {
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/EditExtend`, {
            classTableID: this.classPlan.classTableID,
            IsJiaoAnQiTou: this.IsJiaoAnQiTou,
            IsKeShiFenBu: this.IsKeShiFenBu,
            IsKeChengYouXian: this.IsKeChengYouXian,
            IsShiDuanYouXian: this.IsShiDuanYouXian,
            IsLianTangChuLi: this.IsLianTangChuLi
          }).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('保存成功。')
              this.geExtend()
            }
          })
        }
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../../css/arrangingRules.less';
</style>
