<!-- 提醒设置 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div class="remind-box">
        <h1 class="remind-title">
          提醒设置
        </h1>
        <div class="remind-content">
          <div class="remind-list"
               @click="typeRadio=-1">
            <span class="remind-radio"
                  @click="typeRadio=-1"><i class="remind-radio-in"
                 v-show="typeRadio==-1"></i></span>
            <span>不需要提醒</span>
          </div>
          <div class="remind-list"
               @click="typeRadio=0">
            <span class="remind-radio"><i class="remind-radio-in"
                 v-show="typeRadio==0"></i></span>
            <span>
              <span>上课前</span>
              <i-select style="width: 112px;margin:0px 10px;"
                        v-model="twoType"
                        @on-change="twoTypeChange">
                <i-option v-for="(item,index) in hourList"
                          :value="item.hId"
                          :key='index'>{{item.hourName}}
                </i-option>
              </i-select>
              <span>提醒</span>
            </span>
          </div>
          <div class="remind-list"
               @click="typeRadio=1">
            <span class="remind-radio"><i class="remind-radio-in"
                 v-show="typeRadio==1"></i></span>
            <span>前一天</span>
            <time-picker format="HH:mm"
                         :clearable="false"
                         placeholder="选择时间"
                         style="width: 112px;margin:0px 10px;"
                         v-model="times"></time-picker>
            <span>提醒</span>
          </div>
        </div>
        <h1 class="remind-title">
          不可调课程
        </h1>
        <div class="remind-subject"
             style="max-height:660px;overflow:auto;">
          <p v-for="(item,index) in subjectData"
             :key='index'
             class="subject-name nowrap"
             :title="item.SubjectName"
             :class='item.IsUse?"select-opr-active":""'
             @click="item.IsUse=!item.IsUse">{{item.SubjectName}}
          </p>
        </div>
      </div>
      <div class="fix-btn">
        <Button class="xy-btn-primary"
                shape="circle"
                @click="submitBtn">保存</Button>
      </div>

    </div>

  </div>
</template>

<script>

  export default {
    data () {
      return {
        times: '17:30',
        typeRadio: '',
        hourList: [],
        twoType: '',
        subjectData: []
      }
    },
    created: function () {
      for (let i = 0; i < 24; i++) {
        this.hourList.push({
          hId: i + 1,
          hourName: i + 1 + '小时'
        })
      };
      this.getRemindSettingInfo()
    },
    mounted: function () {

    },
    methods: {
      // 提醒设置
      async getRemindSettingInfo () {
        this.xy.loading()
        let that = this
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/RemindSetting/GetRemindSettingInfo`)
        if (res.success) {
          that.typeRadio = res.data.Model.RemindSettingType
          that.twoType = res.data.Model.RemindSettingHour
          that.times = res.data.Model.RemindSettingDate
          that.getNoMoveCourses()
        } else {
          this.xy.unloading()
        };
      },
      // 不可调课程
      async  getNoMoveCourses () {
        this.xy.loading()
        let that = this
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/RemindSetting/GetNoMoveCourses`)
        if (res.success) {
          that.subjectData = res.data
        }
        this.xy.unloading()
      },
      async editNoMoveCourses () {
        let arr = []
        this.subjectData.map(function (item) {
          if (item.IsUse) {
            arr.push(item.SubjectID)
          }
          return item
        })
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/RemindSetting/EditNoMoveCourses`, {
          Subjects: arr
        })

        if (res.success) {
          this.xy.msgSuc('设置成功。')
        }
        this.xy.unloading()
      },
      twoTypeChange: function (val) {
        this.twoType = val
      },
      // 保存
      async  submitBtn () {
        if (this.typeRadio === 0) {
          if (this.twoType === '' || this.twoType === 0) {
            this.xy.msgError('提醒时间不能为空。')
            return false
          };
        };
        if (this.typeRadio === 1) {
          if (this.times === '') {
            this.xy.msgError('提醒时间不能为空。')
            return false
          };
          this.twoType = 0
        };
        this.xy.loading()
        let that = this
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/RemindSetting/EditRemindSetting`, {
          RemindSettingType: that.typeRadio,
          RemindSettingHour: that.twoType,
          RemindSettingDate: '2019-04-24' + ' ' + that.times + ':00'
        })

        if (res.success) {
          that.editNoMoveCourses()
        } else {
          this.xy.unloading()
        };
      }

    }

  }
</script>
<style lang='less' scoped>
.remind-box {
  // width: 1200px;
  margin-left: 10px;
}
.remind-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
}
.remind-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
}
.tip-cont {
  width: 196px;
  height: 28px;
  line-height: 28px;
  background: rgba(239, 239, 239, 1);
  border-radius: 4px;
  display: inline-block;
  margin-left: 34px;
  text-align: center;
  font-weight: 400;
  color: #777a78;
  font-size: 14px;
}
.remind-radio {
  width: 20px;
  height: 20px;
  display: inline-block;
  border-radius: 50%;
  border: 1px solid rgb(216, 218, 222);
  margin-right: 10px;
}
.remind-radio-in {
  width: 12px;
  height: 12px;
  display: block;
  border-radius: 50%;
  background: #4196ff;
  margin: 3px auto;
}
.remind-list {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 50px;
}
.remind-subject {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.subject-name {
  width: 80px;
  height: 34px;
  background: rgba(244, 245, 247, 1);
  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 4px;
  margin-right: 18px;
  margin-bottom: 22px;
  text-align: center;
  line-height: 34px;
  cursor: pointer;
}

.select-opr-active {
  width: 80px;
  height: 34px;
  border-radius: 4px;
  margin-right: 18px;
  margin-bottom: 22px;
  text-align: center;
  background: rgba(230, 247, 255, 1);
  border: 1px solid rgba(65, 150, 255, 1);
  color: rgba(65, 150, 255, 1);
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
