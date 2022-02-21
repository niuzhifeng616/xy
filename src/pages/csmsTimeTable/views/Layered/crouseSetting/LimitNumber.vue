<!-- 选课人数 -->
<template>
  <div id="crouseRules">
    <div class="LimitNumber-rule">
      <div style="margin-bottom:20px;">
        <div>
          <div>
            <Button class="xy-danger"
                    @click="clearAll"
                    :disabled="layeredStepsHeader.isOperation != 0">全部清除本页设置</Button>
          </div>
        </div>
      </div>
      <div class="limits-rule">
        <ul class="crouse-list">
          <li v-for="(item,index) in subjectData"
              :key='index'>
            <img src="@/assets/csmsTimeTable/smartDivideClass1.png"
                 alt="">
            <div>
              <p class="name nowrap"
                 :title="item.Name">{{item.Name}}</p>
              <radio-group v-model="item.status"
                           @on-change="radioChange(item)">
                <radio label="0">
                  <span class="f14">不限</span>
                </radio>
                <radio label="1">
                  <div class="f14"
                       style="display:inline-block">
                    <span>限选</span>
                    <i-input size="small"
                             v-model="item.StudentLimitation"
                             @on-focus="item.status = '1'"
                             style="width:50px;margin:auto 13px;"></i-input>
                    <span>人</span>
                  </div>
                </radio>
              </radio-group>
            </div>
          </li>
        </ul>
      </div>
      <div class="fix-btn">
        <Button class="xy-btn-primary"
                shape="circle"
                @click="submit"
                :disabled="layeredStepsHeader.isOperation != 0">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        subjectData: [],
        selectSubject: [],
        isLimit: '0',
        limitNum: '',
        layeredStepsHeader: {}
      }
    },
    created () {

    },
    mounted () {
      this.layeredStepsHeader = this.$parent.$parent
      this.getTP()
    },
    methods: {
      // 列表数据
      getTP: function () {
        let that = this
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetStudentLimitationList`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID
        }).then(res => {
          if (res.success) {
            that.subjectData = res.data
            for (let i = 0; i < that.subjectData.length; i++) {
              let statusVal = '0'
              if (that.subjectData[i].StudentLimitation > 0) {
                statusVal = '1'
              } else {
                that.subjectData[i].StudentLimitation = ''
              }
              that.$set(that.subjectData[i], 'status', statusVal)
            }
          }
          that.xy.unloading()
        })
      },
      radioChange: function (val) {
        if (val.status === '0') {
          val.StudentLimitation = ''
        }
      },
      // 保存
      submit: function () {
        if (this.layeredStepsHeader.isOperation === 0) {
          let that = this
          let postData = []
          let reg = /^[1-9][0-9]{0,2}$/
          for (let m = 0; m < this.subjectData.length; m++) {
            if (this.subjectData[m].StudentLimitation === '') {
            // this.subjectData[m].StudentLimitation = 0;
            } else {
              if (!reg.test(this.subjectData[m].StudentLimitation)) {
                this.xy.msgError(this.subjectData[m].Name + '请输入1-999整数。')
                return false
              };
            };
            let coursePlanID = 0
            let coursePlanLevelID = 0
            if (this.subjectData[m].Type === 'CL') {
              coursePlanLevelID = this.subjectData[m].ID
            };
            if (this.subjectData[m].Type === 'CP') {
              coursePlanID = this.subjectData[m].ID
            };
            postData.push({
              CoursePlanID: parseInt(coursePlanID),
              CoursePlanLevelID: parseInt(coursePlanLevelID),
              StudentLimitation: parseInt(this.subjectData[m].StudentLimitation || 0)
            })
          }
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/StudentLimitationEdit`, {
            LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
            Models: postData
          }).then(res => {
            if (res.success) {
              that.xy.msgSuc('保存成功。')
              that.getTP()
            } else {
              that.xy.unloading()
            }
          })
        }
      },
      // 清除全部
      clearAll: function () {
        if (this.layeredStepsHeader.isOperation === 0) {
          let that = this
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要清除全部吗？',
            onOk: function () {
              that.xy.loading()
              that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/StudentLimitationDelete?layeredSelectProgrammeID=` + that.layeredStepsHeader.LayeredSelectProgrammeID).then(res => {
                if (res.success) {
                  that.xy.msgSuc('清除全部成功。')
                  that.getTP()
                } else {
                  that.xy.unloading()
                }
              })
            }
          })
        }
      }
    }

  }
</script>
<style lang='less' scoped>
.limits-rule .crouse-list {
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
}

.limits-rule .crouse-list li {
  width: 268px;
  height: 160px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(233, 233, 233, 1);
  margin-right: 13px;
  margin-bottom: 13px;
  padding: 12px 20px;
  display: flex;
}
.limits-rule .crouse-list img {
  width: 26px;
  height: 26px;
  margin-right: 15px;
}

.limits-rule .crouse-list .name {
  font-size: 14px;
  color: #444;
  font-weight: bold;
  margin-bottom: 20px;
}
.limits-rule .crouse-list li > div label {
  width: 100%;
  margin-bottom: 10px;
}
.fix-btn {
  height: 50px;
  position: fixed;
  line-height: 50px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: right;
  button {
    margin-right: 20px;
  }
}
</style>
