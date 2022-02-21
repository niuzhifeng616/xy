
<template>
  <div id="arrangingRules">
    <div class="sameTime-rule">
        <ul class="crouse-list">
            <li v-for="(item,index) in crouseList" :key="index">
                <div class="left-line"></div>
                <Tooltip word-wrap placement="top" :content="item.SubjectName" style="width:100%">
                    <div class="name nowrap" :title="item.SubjectName" v-cloak>{{item.SubjectName}}</div>
                </Tooltip>
                <div class="">
                    <RadioGroup v-model="item.isLimit" @on-change="radioChange(item)">
                        <Radio label="0">
                            <span class="f14">不限</span>
                        </Radio>
                        <Radio label="1">
                            <div class="f14" style="display:inline-block">
                                <span>最多</span>
                                <Input size="small" v-model="item.EachLessonClassUpLimit" @on-focus="item.isLimit = '1'" style="width:50px" />
                                <span>个班</span>
                            </div>
                        </Radio>
                    </RadioGroup>
                </div>
            </li>
        </ul>
        <div class="text-right fix-footer">
            <Button class="xy-btn-primary" shape="circle" style="margin-right:0" @click="submit" :disabled="StepsHeader.isOperation != 0">保存</Button>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        StepsHeader: {},
        classPlan: {},
        crouseList: []
      }
    },
    created () {
      this.StepsHeader = this.$parent.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      this.getLessonClassUpLimit()
    },
    mounted () {

    },
    methods: {
      // 获取列表数据
      getLessonClassUpLimit () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetLessonClassUpLimit`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.crouseList = []
            let resData = res.data
            for (let i = 0; i < resData.length; i++) {
              if (resData[i].EachLessonClassUpLimit > 0) {
                resData[i].isLimit = '1'
              } else {
                resData[i].isLimit = '0'
                resData[i].EachLessonClassUpLimit = ''
              }
            }
            this.crouseList = resData
          }
        })
      },
      //
      radioChange (val) {
        if (val.isLimit === '0') {
          val.EachLessonClassUpLimit = ''
        };
      },
      // 保存
      submit () {
        if (this.StepsHeader.isOperation === 0) {
          let reg = /^[1-9][0-9]{0,2}$/
          let postData = []
          for (let i = 0; i < this.crouseList.length; i++) {
            let num = 0
            if (this.crouseList[i].isLimit === '1') {
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
              ClassTableID: this.crouseList[i].ClassTableID,
              SubjectID: this.crouseList[i].SubjectID,
              EachLessonClassUpLimit: num
            })
          };
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/EditLessonClassUpLimit`, postData).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('保存成功。')
              this.getLessonClassUpLimit()
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
