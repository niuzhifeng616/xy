// 音体美成绩管理-音体美成绩录入 管理查看页面1-学生详情
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div style="width:600px;min-height:750px;margin:0 auto;position: relative;">
        <Form :label-width="140">
          <FormItem label="学生姓名">
            <i-input disabled :value="FullName"></i-input>
          </FormItem>
          <FormItem label="学号">
            <i-input disabled :value="UserName"></i-input>
          </FormItem>
          <FormItem v-for="item in formData" :key="item.SportItemID" :label="item.Unit ? item.SportItemName + '(' + item.Unit + ')' : item.SportItemName">
            <i-input disabled :value="item.Value"></i-input>
          </FormItem>
        </Form>
        <div class="text-center">
          <!-- <Button class="xy-btn-primary" @click="cancle">返回</Button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'StudentDetail',
    data () {
      return {
        ExaminationID: this.$store.state.common.menuInfo.ExaminationID,
        FullName: this.$store.state.common.menuInfo.FullName,
        UserName: this.$store.state.common.menuInfo.UserName,
        StudentID: this.$store.state.common.menuInfo.StudentID,
        Sex: this.$store.state.common.menuInfo.Sex,
        ColList: [],
        formData: []
      }
    },
    created () {
      this.getCol()
    },
    methods: {
      // 为ES5或更低版本提供JSON合并
      extendJSON (target, source) {
        let targetNew = JSON.parse(JSON.stringify(target))
        let sourceNew = JSON.parse(JSON.stringify(source))
        for (let obj in sourceNew) {
          targetNew[obj] = sourceNew[obj]
        }
        return targetNew
      },
      async getCol () {
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AchievementOfSportItem/GetSportItemDynimicCol?IsAll=true', { isEdit: true })
        this.xy.unloading()
        if (res.success) {
          if (res.data) {
            res.data.forEach((item) => {
              this.ColList.push(item)
            })
          }
          this.getDetail()
        }
      },
      // 详情
      async getDetail () {
        let params = {
          ExaminationID: this.ExaminationID,
          StudentID: this.StudentID
        }
        this.xy.loading()
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AchievementOfSportItem/GetStudentAchievementOfSportItem', params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length === 0) {
            this.ColList.forEach((ColItem) => {
              // let id = ColItem.SportItemID
              ColItem.Value = '暂无成绩'
              // this.$set(this.formData, 'SportItemID_' + id, ColItem)
              this.formData.push(ColItem)
              this.createScoreAndLevel(ColItem)
              // if (ColItem.HasGradingRule) {
              //   this.$set(this.formData, 'SportItemID_' + ColItem.SportItemID + '_Score', {
              //     SportItemName: ColItem.SportItemName + '得分',
              //     Unit: undefined,
              //     Value: '暂无数据'
              //   })
              // }
            })
          } else {
            this.ColList.forEach((ColItem) => {
              let id = ColItem.SportItemID
              // 是否填写过某字段
              let hasTyped = false
              res.data.forEach((dItem) => {
                if (dItem.SportItemID === id) {
                  let newData = this.extendJSON(ColItem, dItem)

                  // this.$set(this.formData, 'SportItemID_' + id, newData)
                  this.formData.push(newData)
                  this.createScoreAndLevel(newData, true)
                  hasTyped = true
                }
              })
              // 此项未填写
              if (!hasTyped) {
                ColItem.Value = '暂无成绩'
                // this.$set(this.formData, 'SportItemID_' + id, ColItem)
                this.formData.push(ColItem)
                this.createScoreAndLevel(ColItem)
              }
            })
          }
          // this.formData = res.data
        }
      },
      cancle () {
        this.$router.go(-1)
      },
      createScoreAndLevel (ColItem, hasValue) {
        // 是否有评分规则: 得分、等级
        if (ColItem.HasGradingRule) {
          // this.$set(this.formData, 'SportItemID_' + ColItem.SportItemID + '_Score', {
          //   SportItemName: ColItem.SportItemName + '得分',
          //   Unit: undefined,
          //   Value: hasValue ? ColItem.Score : '暂无数据'
          // })
          this.formData.push({
            SportItemName: ColItem.SportItemName + '得分',
            Unit: undefined,
            Value: hasValue ? ColItem.Score : '暂无数据'
          })
          // this.$set(this.formData, 'SportItemID_' + ColItem.SportItemID + '_Level', {
          //   SportItemName: ColItem.SportItemName + '等级',
          //   Unit: undefined,
          //   Value: hasValue ? ColItem.Level : '暂无数据'
          // })
          this.formData.push({
            SportItemName: ColItem.SportItemName + '等级',
            Unit: undefined,
            Value: hasValue ? ColItem.Level : '暂无数据'
          })
        }
        // 是否有加分规则
        if (ColItem.HasBonusRule) {
          // this.$set(this.formData, 'SportItemID_' + ColItem.SportItemID + '_BonusPoints', {
          //   SportItemName: ColItem.SportItemName + '加分',
          //   Unit: undefined,
          //   Value: hasValue ? ColItem.BonusPoints : '暂无数据'
          // })
          this.formData.push({
            SportItemName: ColItem.SportItemName + '加分',
            Unit: undefined,
            Value: hasValue ? ColItem.BonusPoints : '暂无数据'
          })
        }
      }
    }
  }
</script>

<style lang="less" scpoed>
</style>
