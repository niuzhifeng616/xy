// 音体美成绩管理-音体美成绩录入 管理查看页面1-编辑
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div style="width:600px;min-height:750px;margin:0 auto;position: relative;">
        <Form :label-width="140" ref="FormData">
          <FormItem label="学生姓名">
            <i-input disabled :value="FullName"></i-input>
          </FormItem>
          <FormItem label="学号">
            <i-input disabled :value="UserName"></i-input>
          </FormItem>
          <FormItem
            v-for="(item, index) in FormData"
            :labelFor="item.SportItemName"
            :key="index"
            :label="item.SportItemName + '(' + item.Unit + ')'"
            :prop="index + '.Value'"
            :rules="FormRules"
            >
            <Input-Number :elementId="item.SportItemName" v-model="item.Value" placeholder="" style="width:460px"></Input-Number>
          </FormItem>
        </Form>
        <div class="text-center">
          <Button class="xy-btn-primary" shape="circle" @click="edit">提交</Button>
          <!-- <Button class="xy-btn-close" @click="cancle">返回</Button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ModifyStudentScore',
    data () {
      return {
        ExaminationID: this.$store.state.common.menuInfo.ExaminationID,
        FullName: this.$store.state.common.menuInfo.FullName,
        UserName: this.$store.state.common.menuInfo.UserName,
        StudentID: this.$store.state.common.menuInfo.StudentID,
        Sex: this.$store.state.common.menuInfo.Sex,
        ColList: [],
        FormData: [],
        FormRules: [{
          required: false
          // transform(value) {
          // return Number(value)
          // },
          // message: '此项不能为空'
        }
        ]
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
        let res = await this.xy.get(this.$store.state.apiPath + '/api/AchievementOfSportItem/GetSportItemDynimicCol', { isEdit: true })
        this.xy.unloading()
        if (res.success) {
          this.ColList = res.data
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
              let id = Number(ColItem.ColName.replace('SportItem', ''))
              this.FormData.push(this.extendJSON(ColItem, { Value: null, SportItemID: id }))
            })
          } else {
            this.ColList.forEach((ColItem) => {
              let id = Number(ColItem.ColName.replace('SportItem', ''))
              // 是否填写过某字段
              let hasTyped = false
              res.data.forEach((dItem) => {
                if (dItem.SportItemID === id) {
                  this.FormData.push(this.extendJSON(ColItem, dItem))
                  hasTyped = true
                }
              })
              // 此项未填写
              if (!hasTyped) {
                this.FormData.push(this.extendJSON(ColItem, { Value: null, SportItemID: id }))
              }
            })
          }
        }
      },
      cancle () {
        this.$router.go(-1)
      },
      edit () {
        this.$refs.FormData.validate((valid) => {
          if (valid) {
            this.xy.loading()
            let params = {
              ExaminationID: this.ExaminationID,
              StudentID: this.StudentID,
              Sex: this.Sex,
              InsertStr: ''
            }
            this.FormData.forEach((item) => {
              if (item.Value) {
                params.InsertStr += '&SportItemID_' + item.SportItemID + '=' + item.Value
              }
            })
            params.InsertStr = params.InsertStr.substr(1)
            this.xy.post(`${this.$store.state.apiPath}/api/AchievementOfSportItem/AchievementOfSportItemSave`, params).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.xy.msgSuc('设置成功。')
                this.$router.go(-1)
              }
            })
          } else {
            this.xy.msgError('请检查填写内容。')
          }
        })
      }
    }
  }
</script>

<style lang="less" scpoed>
</style>
