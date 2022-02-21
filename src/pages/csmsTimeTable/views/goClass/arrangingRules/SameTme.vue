<template>
  <!-- 5.排课规则-同时上课-->
  <div id="arrangingRules">
    <div class="sameTime-rule">
      <ul class="crouse-list">
        <li v-for="item in crouseList" :key="item.SubjectName">
          <div class="left-line"></div>
          <div class="name nowrap" :title="item.SubjectName">{{item.SubjectName}}</div>
          <div class="">
            <radio-group v-model="item.isLimit" @on-change="radioChange(item)">
              <radio :label="0">
                <span class="f14">不限</span>
              </radio>
              <radio :label="1">
                <div class="f14" style="display:inline-block">
                  <span>最多</span>
                  <i-input size="small" v-model="item.EachLessonClassUpLimit" @on-focus="item.isLimit = 1"
                    style="width:50px"></i-input>
                  <span>个班</span>
                </div>
              </radio>
            </radio-group>
          </div>
        </li>
      </ul>
      <div class="fix-footer text-right">
        <Button class="xy-btn-primary" shape="circle" style="margin-right:0" @click="submit" :disabled="isOperation !== 0">保存</Button>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    name: 'SameTme',
    data () {
      return {
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        crouseList: []
      }
    },
    mounted () {
      this.getLessonClassUpLimit()
    },
    methods: {
      // 获取列表数据
      async getLessonClassUpLimit () {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/GetLessonClassUpLimit`, params)
        this.xy.unloading()
        if (res.success) {
          this.crouseList = []
          let resData = res.data
          for (let i = 0; i < resData.length; i++) {
            if (resData[i].EachLessonClassUpLimit > 0) {
              resData[i].isLimit = 1
            } else {
              resData[i].isLimit = 0
              resData[i].EachLessonClassUpLimit = ''
            }
          }
          this.crouseList = resData
        }
      },
      radioChange (val) {
        if (val.isLimit === 0) {
          val.EachLessonClassUpLimit = ''
        };
      },
      // 保存
      async submit () {
        if (this.isOperation === 0) {
          let reg = /^[1-9][0-9]{0,2}$/
          let postData = []
          for (let i = 0; i < this.crouseList.length; i++) {
            let num = 0
            if (this.crouseList[i].isLimit === 1) {
              if (this.crouseList[i].EachLessonClassUpLimit === '') {
                this.xy.msgError('请输入' + this.crouseList[i].SubjectName + '最多同时开课班级个数。')
                return false
              };
              if (!reg.test(this.crouseList[i].EachLessonClassUpLimit)) {
                this.xy.msgError('请输入1-999整数。')
                return false
              };
              num = this.crouseList[i].EachLessonClassUpLimit
            }
            postData.push({
              ClassTableID: this.classTableID,
              SubjectID: this.crouseList[i].SubjectID,
              EachLessonClassUpLimit: num
            })
          };
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/EditLessonClassUpLimit`, postData)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.getLessonClassUpLimit()
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/arrangingRules.less';
</style>
