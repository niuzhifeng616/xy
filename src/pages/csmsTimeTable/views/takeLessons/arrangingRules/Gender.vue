<template>
  <!-- 8.选课规则-男女设置 -->
  <div>
    <div class="LimitNumber-rule">
        <!--<div class="title-describe" style="margin:20px 0;">
            所有课程默认不限男女，设为仅限男生或仅限女生的课程将在课程名称后面出现“笔”，点击“笔”可查看设置。
        </div>-->
        <div class="limit-rule">
            <div v-for="(item, index) in subjectData" :key="index">
                <h3  style="font-size:16px;font-weight:bold;margin-top:20px;">{{item.SubjectCategoryName}}</h3>
                <ul class="crouse-list">
                    <li v-for="(subject, n) in item.Levels" :key="n">
                        <div class="left-line"></div>
                        <div class="name nowrap" :title="item.SubjectName" >{{subject.SubjectName}}</div>
                        <div class="">
                            <radio-group v-model="subject.Sex">
                                <radio label="0">
                                    <span class="f14">不限</span>
                                </radio>
                                <radio label="1">
                                    <span class="f14">仅限男生</span>
                                </radio>
                                <radio label="2">
                                    <span class="f14">仅限女生</span>
                                </radio>
                            </radio-group>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="fix-footer text-right" v-if="subjectData.length>0">
            <Button class="xy-btn-primary" shape="circle" style="margin-right:0" @click="submit" :disabled="isOperation !== 0">保存</Button>
        </div>
    </div>
</div>

</template>
<script>
  export default {
    name: 'TLArrangRuleGender',
    components: {

    },
    data () {
      return {
        subjectData: [],
        selectSubject: [],
        isLimit: '0',
        crouseTree: [],
        AIDs: [],
        coursePlanLevelIDs: '',

        isOperation: true,
        classTableID: 0
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.classTableID
    },
    mounted () {
      this.getTP()
    },
    methods: {
      // 列表数据
      async getTP () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/SelectCategoryTree`, {
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          var dataList = res.data
          this.subjectData = []
          for (var i = 0; i < dataList.length; i++) {
            this.subjectData.push({
              SubjectCategoryID: dataList[i].SubjectCategoryID,
              SubjectCategoryName: dataList[i].SubjectCategoryName,
              Levels: []
            })
            for (var j = 0; j < dataList[i].Levels.length; j++) {
              this.subjectData[i].Levels.push({
                AID: dataList[i].Levels[j].AID,
                Sex: (dataList[i].Levels[j].Sex).toString(),
                StudentLimitation: dataList[i].Levels[j].StudentLimitation,
                StudntCount: dataList[i].Levels[j].StudntCount,
                SubjectName: dataList[i].Levels[j].SubjectName,
                Type: dataList[i].Levels[j].Type,
                checked: false
              })
            };
          }
        }
      },

      // 保存
      async submit () {
        if (this.isOperation === 0) {
          var modelArr = []
          for (var i = 0; i < this.subjectData.length; i++) {
            for (var j = 0; j < this.subjectData[i].Levels.length; j++) {
              modelArr.push({
                CoursePlanLevelID: this.subjectData[i].Levels[j].AID,
                Sex: this.subjectData[i].Levels[j].Sex
              })
            };
          }
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/SetSex`, {
            ClassTableID: this.classTableID,
            Models: modelArr
          })
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.getTP()
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.limit-rule .crouse-list {
    margin: 10px 0;
}
.limit-rule .crouse-list li {
    width: 282px;
    height: 96px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 6px 0px rgba(167,167,167,0.4);
    border-radius: 4px;
    margin: 13px;
    padding: 12px 18px;
    display: inline-block;
    position: relative;
}
.limit-rule .crouse-list .name {
    font-size: 14px;
    color: #444;
    font-weight: bold;
    margin-bottom: 20px;
}
.limit-rule .left-line {
    width: 4px;
    height: 42px;
    background: rgba(65,150,255,1);
    border-radius: 2px;
    position: absolute;
    left: 0;
    top: 27px;
}
</style>
