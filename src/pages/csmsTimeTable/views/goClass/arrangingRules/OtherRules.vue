<template>
  <!-- 5.排课规则-其他规则-->
  <div>
    <div class="other-rule">
      <!-- <Alert show-icon style="margin-bottom:50px;">以下是系统默认自动执行的全局规则（无需修改）：</Alert> -->
      <div>
        <checkbox v-model="IsJiaoAnQiTou" class="other-check">
          <span class="f14">教案齐头 | 各教师教案平头对齐，方便教师备课</span>
        </checkbox>
        <checkbox v-model="IsKeShiFenBu" class="other-check">
          <span class="f14">课时分布 | 各学科各教师课时分布均衡，同时周内分散，天内集中</span>
        </checkbox>
        <checkbox v-model="IsKeChengYouXian" class="other-check">
          <span class="f14">课程优先 | 根据课程显示顺序优先安排重点课程</span>
        </checkbox>
        <checkbox v-model="IsShiDuanYouXian" class="other-check">
          <span class="f14">时段优先 | 优先安排重点时段，比如上午前两节课</span>
        </checkbox>
        <checkbox v-model="IsLianTangChuLi" class="other-check">
          <span class="f14">连堂处理 | 连堂不跨上下午，不跨课间活动</span>
        </checkbox>
      </div>
      <div class="text-center">
        <Button class="xy-btn-primary" shape="circle" @click="submit" :disabled="isOperation !== 0">保存</Button>
      </div>
      <img :src="require(`@/assets/csmsTimeTable/rule2.png`)" class="other-img" />
    </div>

  </div>
</template>
<script>
  export default {
    name: 'OtherRules',
    data () {
      return {
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        IsJiaoAnQiTou: false,
        IsKeShiFenBu: false,
        IsKeChengYouXian: false,
        IsShiDuanYouXian: false,
        IsLianTangChuLi: false
      }
    },

    created () {
    },
    mounted () {
      this.geExtend()
    },
    methods: {
      // 获取列表数据
      async geExtend () {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GeExtend`, params)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          this.IsJiaoAnQiTou = resData.IsJiaoAnQiTou
          this.IsKeShiFenBu = resData.IsKeShiFenBu
          this.IsKeChengYouXian = resData.IsKeChengYouXian
          this.IsShiDuanYouXian = resData.IsShiDuanYouXian
          this.IsLianTangChuLi = resData.IsLianTangChuLi
        }
      },
      async submit () {
        if (this.isOperation === 0) {
          this.xy.loading()
          let params = {
            classTableID: this.classTableID,
            IsJiaoAnQiTou: this.IsJiaoAnQiTou,
            IsKeShiFenBu: this.IsKeShiFenBu,
            IsKeChengYouXian: this.IsKeChengYouXian,
            IsShiDuanYouXian: this.IsShiDuanYouXian,
            IsLianTangChuLi: this.IsLianTangChuLi
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/EditExtend`, params)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.geExtend()
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../css/arrangingRules.less';
</style>
