
<template>
<div>

  <div class="details-wrap">
    <!-- <div class="xy-content-title clearfix" style="text-align: center">
        <h3 style="display: inline-block;padding-top: 8px;font-size: 16px;color: #333">{{caseTitle}}</h3>
        <i-button class="fr pr " @click="goBack">返回</i-button>
    </div> -->
    <section style="margin-bottom: 20px" v-for="(rule,ruleIndex) in rulesData" :key="ruleIndex">
      <!-- <div class="show-section" v-if="!rule.edit">
        <div class="grade-part">
          <div class="center">
            <p class="number" v-if="roleId ===3">{{ruleIndex+1}}</p>
            <p class="number" v-if="roleId ===2">教师规则</p>
            <img v-if="roleId ===3" src="../img/grade-icon.png" class="grade-img" alt="">
            <ul v-if="roleId ===3" class="grade-list" style="margin-left: 18px;">

              <li v-for="item in rule.GradeForYearID" :key="item.name">{{item.Name}}</li>
            </ul>
          </div>
        </div>
        <div class="date-part">
          <div class="top-btn">
            <Button class="xy-primary" :disabled="isEdit" @click="editRule(ruleIndex)">编辑</Button>
            <Button class="xy-danger" :disabled="isEdit" @click="delRule(ruleIndex)">删除</Button>
          </div>
          <ul class="date-list">
            <li class="date-item" v-for="(timeSec,index) in rule.ListTime" :key="index">
              <h3 class="date-title">
                <Icon type="md-calendar" class="icon"/>
                <span class="date-day" v-for="item in timeSec.Week" :key="item.Week">{{item.Name}}</span>
              </h3>
              <ul class="time-slot">
                <li class="slot-item" v-for="timeSlot in timeSec.ListSection" :key="timeSlot.SectionName">
                  <Icon type="md-time" class="icon"/>
                  <span class="slot-time">{{timeSlot.SectionName}}</span>
                  <span class="slot-time">开放时间 {{timeSlot.OpeningHours[0].slice(0,5)}} ~ {{timeSlot.OpeningHours[1].slice(0, 5)}}</span>
                  <span class="slot-time">上课时间 {{timeSlot.ClassHours[0].slice(0,5)}} ~ {{timeSlot.ClassHours[1].slice(0, 5)}}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div> -->
      <div class="edit-section" v-if="!rule.edit">
        <Button class="xy-primary" v-if="ruleIndex === 0" style="width: 100px; margin-bottom: 20px" :disabled="isEdit || isGradeSelected" @click="addRule">添加规则
        </Button>
        <div class="grade-select grade-select-edit" v-if="roleId ===3">
          <label class="label-title">年级：</label>
          <div class="grade-list">
            <span
              class="grade-li"
              v-for="(item,index) in rule.GradeForYearID"
              :key="index"
              >
              {{item.Name}}
            </span>
          </div>
        </div>
        <div class="time-select">
          <ul class="time-content" v-if="rule.ListTime.length >0">
            <li class="time-item" :key="timeIndex" v-for="(timeSec, timeIndex) in rule.ListTime">
              <div class="li-tit">
                <span class="label-title">规则：</span>
                  <span v-for="(item,index) in timeSec.Week" :key="index" class="week-li">
                    {{item.Name}}
                  </span>
              </div>
              <Row :gutter="20" v-for="(timeSlot, slotIndex) in timeSec.ListSection" :key="slotIndex">
                <i-col span="7" class="time-slot-column">
                  <label>选择区间：</label>
                  <span>
                    {{timeSlot.SectionName}}
                  </span>
                </i-col>
                <i-col span="7" class="time-slot-column">
                  <label>开放时间段：</label>
                  <span>{{timeSlot.OpeningHours[0]}} - {{timeSlot.OpeningHours[1]}}</span>
                </i-col>
                <i-col span="7" class="time-slot-column">
                  <label class="time-slot-column">上课时间段：</label>
                  <span>{{timeSlot.ClassHours[0]}} - {{timeSlot.ClassHours[1]}}</span>
                </i-col>
                <i-col span="2" offset="1">
                  <span class="undel-btn">删除</span>
                </i-col>
              </Row>
            </li>
          </ul>
        </div>
        <div class="buttons" style="border: 0">
          <div>
            <Button class="xy-primary" :disabled="isEdit" @click="editRule(ruleIndex)">编辑</Button>
            <Button class="xy-danger" :disabled="isEdit" @click="delRule(ruleIndex)">删除</Button>
          </div>
        </div>
      </div>
      <div class="edit-section" v-else>
        <div class="grade-select" v-if="roleId ===3">
          <label class="label-title">年级：</label>
          <div class="grade-list" :class="less ? 'grade-list-less' : ' '">
            <a-checkable-tag
              v-for="item in allGradeList"
              :key="item.StudentGradeForStudentYearID"
              @change="changeGrade(item, ruleIndex)"
              :disabled="item.disable && rule.GradeForYearID.indexOf(item.StudentGradeForStudentYearID) === -1"
              :checked="item.checked"
              >
              {{item.FullName}}
            </a-checkable-tag>
            <!-- <checkbox-group v-model="rule.GradeForYearID" @on-change="changeGrade">
              <Checkbox :label="item.StudentGradeForStudentYearID"
                        :disabled="item.disable && rule.GradeForYearID.indexOf(item.StudentGradeForStudentYearID) === -1"
                        style="margin-right: 20px" v-for="item in allGradeList"
                        :key="item.StudentGradeForStudentYearID">{{item.StudentGradeNameForStudentYearName}}
              </Checkbox>
            </checkbox-group> -->
          </div>
          <div v-if="true" class="grade-btns">
            <div class="more-grade grade-btn" v-show="more" @click="moreBtn">
              <span>更多</span>
              <Icon type="ios-arrow-down" />
            </div>
            <div class="less-grade grade-btn" v-show="less" @click="lessBtn">
              <span>收起</span>
              <Icon type="ios-arrow-up" />
            </div>
          </div>
        </div>
        <div class="time-select">
          <a href="javascript:;" @click="addDateItem(ruleIndex)" class="a-add-btn" style="font-size: 14px">
            <Icon type="md-add"/>
            添加时间
          </a>
          <ul class="time-content" v-if="rule.ListTime.length >0">
            <li class="time-item" :key="timeIndex" v-for="(timeSec, timeIndex) in rule.ListTime">
              <div class="li-tit">
                <span class="label-title">规则：</span>
                <checkbox-group v-model="timeSec.Week" class="week-list" @on-change="changeWeek(ruleIndex)">
                  <Checkbox :label="item.value" v-for="item in allWeekDay"
                            :disabled="item.disable &&timeSec.Week.indexOf(item.value) === -1 " :key="item.value">
                    {{item.label}}
                  </Checkbox>
                </checkbox-group>
              </div>
              <Row :gutter="20" v-for="(timeSlot, slotIndex) in timeSec.ListSection" :key="slotIndex">
                <i-col span="7" class="time-slot-column">
                  <label>选择区间：</label>
                  <i-select style="width:224px" v-model="timeSlot.SectionID" placeholder="时间段">
                    <i-option :value="item.SchoolAccessTimeSectionID"
                              :disabled="validateSecSlot(ruleIndex, timeIndex, item.SchoolAccessTimeSectionID)"
                              v-for="item in timeSlotList"
                              :key="item.SchoolAccessTimeSectionID">
                      {{item.SchoolAccessTimeSectionName}}
                    </i-option>
                  </i-select>
                </i-col>
                <i-col span="7" class="time-slot-column">
                  <label>开放时间段：</label>
                  <time-picker type="timerange"
                               format="HH:mm"
                               v-model="timeSlot.OpeningHours"
                               style="width:224px"
                               placeholder="开放时间">
                  </time-picker>
                </i-col>
                <i-col span="7" class="time-slot-column">
                  <label class="time-slot-column">上课时间段：</label>
                  <time-picker type="timerange"
                               format="HH:mm"
                               v-model="timeSlot.ClassHours"
                               style="width:224px"
                               placeholder="上课时间">
                  </time-picker>
                </i-col>
                <i-col span="2" offset="1">
                  <span class="del-btn" @click="delSlot(ruleIndex, timeIndex, slotIndex)">删除</span>
                </i-col>
              </Row>
              <div class="buttons">
                <div
                  @click="addTimeSlot(ruleIndex, timeIndex)"
                  class="add-btn"
                  >
                  <Icon type="md-add"/>
                  添加日期
                </div>
                <div>
                  <Button class="xy-info" @click="cancelEdit(ruleIndex)">
                    取消
                  </Button>
                  <Button class="xy-btn-primary" @click="saveRule(ruleIndex, timeIndex)" shape="circle">保存</Button>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- <div class="bottom-btn-wrap">
          <div class="btn-list">
            <Button class="xy-info" v-if="rule.SchoolAccessRecordSettingGroupID" @click="cancelEdit(ruleIndex)">
              取消
            </Button>
            <Button class="xy-danger" :disabled="(rulesData.length<=1)" @click="delRule(ruleIndex)">删除
            </Button>
            <Button class="xy-primary" @click="saveRule(ruleIndex)">保存</Button>
          </div>
        </div> -->
      </div>
    </section>
  </div>
  </div>
</template>
<script>
  export default {
    name: 'SetDetail',
    data () {
      return {
        more: true,
        less: false,
        isInitial: true,
        ruleId: '',
        schoolId: '',
        roleId: 0,
        allGradeList: [],
        allWeekDay: [
          {
            label: '星期一',
            value: 1,
            disable: false
          },
          {
            label: '星期二',
            value: 2,
            disable: false
          },
          {
            label: '星期三',
            value: 3,
            disable: false
          }, {
            label: '星期四',
            value: 4,
            disable: false
          },
          {
            label: '星期五',
            value: 5,
            disable: false
          },
          {
            label: '星期六',
            value: 6,
            disable: false
          },
          {
            label: '星期日',
            value: 0,
            disable: false
          }
        ],
        timeSlotList: [],
        rulesData: [],
        isEdit: false, // 是否正在编辑
        caseTitle: ''
      }
    },
    created () {
      this.apiPath = this.xyApi + '/att'
      if (this.$route.query.id) {
        this.ruleId = parseInt(this.$route.query.id)
        this.schoolId = this.$route.query.SchoolDistrictID
        this.roleId = Number(this.$route.query.roleId) // 2-- 教师 3--- 学生
        this.caseTitle = this.$route.query.caseTitle // 2-- 教师 3--- 学生
      }
      this.$store.commit('common/getThreeMenuName', this.caseTitle)
      this.getSections()
      this.getGradeList()
    },
    computed: {
      isGradeSelected () {
        return this.allGradeList.every((value) => {
          return value.disable
        })
      }
    },
    methods: {
      moreBtn () {
        this.more = false
        this.less = true
      },
      lessBtn () {
        this.more = true
        this.less = false
      },
      cancelEdit () {
        this.isEdit = false
        this.getRules()
      },
      goBack () {
        this.$router.back()
      },
      changeWeek (index) {
        this.validateCanlendar(this.rulesData[index])
      },
      changeGrade (val, idx) {
        val.checked = !val.checked
        this.rulesData[idx].GradeForYearID.push(val.StudentGradeForStudentYearID)
        this.validateGrade(this.rulesData[idx])
      },
      addRule () {
        let that = this
        this.isEdit = true
        this.rulesData.push({
          edit: true,
          SchoolAccessRecordSettingID: that.ruleId,
          SchoolAccessRecordSettingGroupID: 0,
          GradeForYearID: [],
          ListTime: [{
            Week: [],
            ListSection: [
              {
                SectionID: 1,
                SectionName: '上午',
                OpeningHours: ['06:40', '07:40'],
                ClassHours: ['07:41', '11:40']
              },
              {
                SectionID: 2,
                SectionName: '下午',
                OpeningHours: ['13:00', '14:00'],
                ClassHours: ['14:01', '17:30']
              },
              {
                SectionID: 3,
                SectionName: '晚上',
                OpeningHours: ['17:40', '19:00'],
                ClassHours: ['19:01', '21:00']
              }
            ]
          }]
        })
        this.validateCanlendar(this.rulesData.slice(-1)[0])
      },
      addDateItem (index) {
        this.validateCanlendar(this.rulesData[index])
        this.rulesData[index].ListTime.push({
          Week: [],
          ListSection: [
            {
              SectionID: 1,
              SectionName: '上午',
              OpeningHours: ['06:40', '07:40'],
              ClassHours: ['07:41', '11:40']
            },
            {
              SectionID: 2,
              SectionName: '下午',
              OpeningHours: ['13:00', '14:00'],
              ClassHours: ['14:01', '17:30']
            },
            {
              SectionID: 3,
              SectionName: '晚上',
              OpeningHours: ['17:40', '19:00'],
              ClassHours: ['19:01', '21:00']
            }
          ]
        })
      },
      addTimeSlot (ruleIndex, timeIndex) {
        this.rulesData[ruleIndex].ListTime[timeIndex].ListSection.push({
          SectionID: '',
          SectionName: '',
          OpeningHours: [],
          ClassHours: []
        })
      },
      editRule (index) {
        this.isEdit = true
        if (this.roleId === 2) {
          this.rulesData[index].GradeForYearID = this.rulesData[index].GradeForYearID.map((value) => {
            return value.Value
          })
        }
        this.rulesData[index].ListTime.forEach((value) => {
          value.Week = value.Week.map((val) => {
            return val.Value
          })
        })

        this.validateCanlendar(this.rulesData[index])
        this.rulesData[index].edit = true
      },
      // 删除时间段
      delSlot (ruleIndex, timeIndex, slotIndex) {
        this.rulesData[ruleIndex].ListTime[timeIndex].ListSection.splice(slotIndex, 1)
        if (this.rulesData[ruleIndex].ListTime[timeIndex].ListSection.length === 0) {
          this.rulesData[ruleIndex].ListTime.splice(timeIndex, 1)
        }
      },
      async delRulePost (index) {
        let params = {
          SchoolAccessRecordSettingGroupID: this.rulesData[index].SchoolAccessRecordSettingGroupID
        }
        let rs = await this.xy.post(this.apiPath + '/api/ProgrammeSetting/RuleDelete', params)
        if (rs.success) {
          this.getRules()
          this.xy.msgSuc('删除成功。')
        }
      },
      delRule (index) {
        this.$Modal.confirm({
          title: '删除规则',
          content: '<p>确定要删除该规则设置吗？</p>',
          onOk: () => {
            this.isEdit = false
            if (this.rulesData[index].SchoolAccessRecordSettingGroupID) {
              this.delRulePost(index)
            } else {
              this.rulesData[index].ListTime.splice(index, 1)
            }
          },
          onCancel: () => {
          }
        })
      },

      // 保存数据
      async saveRule (index, listTimeIdx) {
        let hasSelectWeek = []
        let params = this.rulesData[index]
        params.ListTime.forEach((value, index) => {
          for (var i = 0; i < value.Week.length; i++) {
            if (value.Week[i].Value) {
              hasSelectWeek.push(value.Week[i].Value)
            } else {
              hasSelectWeek.push(value.Week[i])
            }
          }
        })
        let hasSelectGrade = []
        this.rulesData[index].GradeForYearID.forEach((value) => {
          hasSelectGrade = hasSelectGrade.concat(value)
        })
        let hasSelectGradeIds = hasSelectGrade.map((value) => {
          if (value.Value) {
            return value.Value
          } else {
            return value
          }
        })
        params.GradeForYearID = hasSelectGradeIds
        if (!this.validateParams(params)) {
          return
        }
        if (this.roleId === 2) {
          let rs = await this.xy.post(this.apiPath + '/api/ProgrammeSetting/CreateTeacherRoule', params)
          if (rs.success) {
            this.xy.msgSuc('设置成功。')
            this.isEdit = false
            this.getRules()
          }
        } else {
          let rs = await this.xy.post(this.apiPath + '/api/ProgrammeSetting/CreateStudentRule', params)
          if (rs.success) {
            this.xy.msgSuc('设置成功。')
            this.isEdit = false
            this.getRules()
          }
        }
      },

      // 获取规则
      async getRules () {
        this.xy.loading()
        let params = {
          SchoolAccessRecordSettingID: this.ruleId,
          schoolDistrictId: this.schoolId,
          roleId: this.roleId
        }
        let rs = await this.xy.get(this.apiPath + '/api/ProgrammeSetting/GetRules', params)
        this.xy.unloading()
        if (rs.success) {
          let res = rs.data
          this.rulesData = res
          if (res && res.length) {
            if (this.roleId === 2) {
              for (var i = 0; i < res.length; i++) {
                this.validateCanlendar(this.rulesData[i])
              }
            } else {
              for (var j = 0; j < res.length; j++) {
                this.validateCanlendar(this.rulesData[j])
                this.validateGrade(this.rulesData[j])
              }
            }
          } else {
            this.rulesData.push({
              edit: true,
              GradeForYearID: [],
              SchoolAccessRecordSettingID: this.ruleId,
              SchoolAccessRecordSettingGroupID: 0,
              ListTime: [{
                Week: [],
                ListSection: [
                  {
                    SectionID: 1,
                    SectionName: '',
                    OpeningHours: ['06:40', '07:40'],
                    ClassHours: ['07:41', '11:40']
                  },
                  {
                    SectionID: 2,
                    SectionName: '',
                    OpeningHours: ['13:00', '14:00'],
                    ClassHours: ['14:01', '17:30']
                  },
                  {
                    SectionID: 3,
                    SectionName: '晚上',
                    OpeningHours: ['17:40', '19:00'],
                    ClassHours: ['19:01', '21:00']
                  }
                ]
              }]
            })
            this.validateCanlendar(this.rulesData[0])
            if (this.roleId === 2) {
              this.validateGrade(this.rulesData[0])
            }
          }
        }
      },
      // 获取时间段
      async getSections () {
        let rs = await this.xy.get(this.apiPath + '/api/ProgrammeSetting/GetAllSection')
        if (rs.success) {
          this.timeSlotList = rs.data
        }
      },
      // 获取年级
      async getGradeList () {
        let that = this
        let params = {
          schoolDistrictId: this.schoolId
        }
        await this.xy.get(this.xyApi + '/xy/comm/GetStudentGradeStudentYearBySid', params).then(res => {
          that.allGradeList = res.data
          that.allGradeList.forEach((value) => {
            value.disable = false
            that.$set(value, 'checked', false)
          })
          that.getRules()
        })
      },

      // 验证周，年级是否为空
      validateParams (params) {
        let weekValidate = params.ListTime.every((value) => {
          return value.Week.length > 0
        })
        if (this.roleId === 2) { // 教师
          if (!weekValidate) {
            this.$Message.error('请选择日期。')
            return false
          }
        } else {
          let gradeValid = params.GradeForYearID.length
          if (!gradeValid) {
            this.$Message.error('请选择年级。')
            return false
          }
          if (!weekValidate) {
            this.$Message.error('请选择日期。')
            return false
          }
        }

        return true
      },

      // 周选择验证
      validateCanlendar (rulesData) {
        let hasSelectWeek = []
        let that = this
        rulesData.ListTime.forEach((value) => {
          for (var i = 0; i < value.Week.length; i++) {
            if (value.Week[i].Value) {
              hasSelectWeek.push(value.Week[i].Value)
            } else {
              hasSelectWeek.push(value.Week[i])
            }
          }
        })
        that.allWeekDay.forEach((value, index) => {
          if (hasSelectWeek.indexOf(value.value) === -1) {
            that.allWeekDay.splice(index, 1, {
              label: value.label,
              value: value.value,
              disable: false
            })
          } else {
            that.allWeekDay.splice(index, 1, {
              label: value.label,
              value: value.value,
              disable: true
            })
          }
        })
      },
      // 年级选择验证
      validateGrade (rulesData) {
        let that = this
        let hasSelectGrade = []
        rulesData.GradeForYearID.forEach((value) => {
          hasSelectGrade = hasSelectGrade.concat(value)
        })
        let hasSelectGradeIds = hasSelectGrade.map((value) => {
          return value.Value
        })
        that.allGradeList.forEach((value, index) => {
          if (hasSelectGradeIds.indexOf(value.StudentGradeForStudentYearID) === -1) {
            that.allGradeList.splice(index, 1, {
              StudentGradeForStudentYearID: value.StudentGradeForStudentYearID,
              FullName: value.FullName ? value.FullName : value.StudentGradeNameForStudentYearName,
              disable: false,
              checked: value.checked
            })
          } else {
            that.allGradeList.splice(index, 1, {
              StudentGradeForStudentYearID: value.StudentGradeForStudentYearID,
              FullName: value.FullName ? value.FullName : value.StudentGradeNameForStudentYearName,
              disable: true,
              checked: value.checked
            })
          }
        })
      },
      // 时间段验证
      validateSecSlot (ruleIndex, timeIndex, value) {
        let currentSlot = this.rulesData[ruleIndex].ListTime[timeIndex].ListSection.map((value) => {
          return value.SectionID
        })
        if (currentSlot.indexOf(value) !== -1) {
          return true
        } else {
          return false
        }
      }
    }

  }
</script>
<style lang="less" scoped>
.buttons {
  padding: 20px 0;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .add-btn {
    color: #1890FF;
    line-height: 22px;
    cursor: pointer;
  }
  .xy-btn-primary {
    margin: 0;
  }
}
.grade-btns {
  flex-shrink: 0;
}
.grade-btn {
  font-size: 14px;
  line-height: 22px;
  color: #1890ff;
  cursor: pointer;
}
.details-wrap .edit-section .grade-select-edit {
  border-bottom: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  .grade-li {
    display: inline-block;
    margin-right: 40px;
    color: rgba(0, 0, 0, .65);
    margin-bottom: 16px;
  }
}
  .week-li {
    display: inline-block;
    margin-right: 40px;
    color: rgba(0, 0, 0, .65);
  }
  .li-tit .week-li:nth-child(2) {
    margin-left: 10px;
  }
  .grade-list {
    width: 90%;
    padding-right: 100px;
    padding-left: 10px;
    /deep/ .ant-tag {
      margin-bottom: 16px;
    }
  }
  .grade-list-less {
    height: 38px;
    overflow: hidden;
  }
  .details-wrap {
    margin: 20px;

    .show-section {
      margin-top: 10px;
      width: 100%;
      box-sizing: border-box;
      padding: 20px 15px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 4px 0px rgba(218, 218, 218, 0.5);
      border-radius: 4px;
      display: flex;

      .grade-part {
        width: 230px;
        display: flex;
        align-items: center;

        .center {
          width: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;

          .number {
            font-size: 30px;
            color: #B3BACB;
            font-weight: 500;
          }

          .grade-img {
            width: 41px;
            height: 35px;
            margin-top: 40px;
          }

          .grade-list {
            margin-top: 10px;
            font-size: 14px;
            margin-left: 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            li {
              padding: 0 10px;
            }
          }
        }
      }

      .date-part {
        padding-left: 50px;
        flex: 1;
        border-left: 1px dashed #DCDFE6;

        .top-btn {
          display: flex;
          justify-content: flex-end;

          .ivu-btn-text, .ivu-btn-text:hover {
            color: #4196FF;
            background: #fff;
            border-color: transparent;
          }

          .ivu-btn-ghost.ivu-btn-text[disabled] {
            color: #ccc;
          }

          a {
            font-size: 14px;
            color: #4196FF;
            padding: 0 15px;
          }

          a:not(:last-child) {
            border-right: 1px solid #EAEAEA;
          }
        }

        .date-list {
          .date-item {
            font-size: 14px;
            color: #333333;

            .icon {
              font-size: 16px;
              color: #4196FF;
              padding-top: 10px;
            }

            h3 {
              display: flex;
              align-items: center;

              .date-day {
                &:not(:last-child) {
                  border-right: 1px solid #EAEAEA;
                }

                padding: 0 10px;
              }
            }

            .slot-item {
              display: flex;
              align-items: center;

              .slot-time {
                &:not(:last-child) {
                  border-right: 1px solid #EAEAEA;
                }

                padding: 0 10px;
              }
            }

          }
        }
      }
    }

    .edit-section {
      width: 100%;
      box-sizing: border-box;
      background: #fff;
      box-shadow: 0px 2px 4px 0px rgba(218, 218, 218, 0.5);
      border-radius: 2px;
      padding: 20px;
      .grade-select {
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        margin-bottom: 20px;
      }
      .time-select, .grade-select {
        .li-tit {
          line-height: 68px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e8e8e8;
          >div {
            flex: 1;
            justify-content: start !important;
            label {
              margin-right: 40px;
            }
          }
        }
        .label-title {
          color: rgba(0, 0, 0, .85);
          font-size: 14px;
          flex-shrink: 0;
        }
      }

      .time-select {
        >.a-add-btn {
          border: 1px dashed #dddddd;
          border-radius: 4px;
          line-height: 32px;
          color: #666;
          width: 100%;
          display: inline-block;
          text-align: center;
          transition: all .2s ease-in-out;
        }
        >.a-add-btn:hover {
          color: #1890FF;
          border-color: #1890FF;
        }
        .time-content {
          flex: 1;

          .time-slot-column {
            display: flex;
            align-items: center;

            label {
              width: 90px;
              font-size: 14px;
            }
          }
          .time-item:nth-last-child(1) {
            .buttons {
              border: 0;
            }
          }
          .time-item {
            .ivu-row {
              padding: 10px 0;
              border-bottom: 1px solid #e8e8e8;
            }
          }

          .week-list {
            display: flex;
            justify-content: space-between;
          }

          .del-btn {
            cursor: pointer;
            margin-top: 5px;
            color: #1890FF;
          }
          .undel-btn {
            color: rgba(24,144,255,0.45);
            margin-top: 5px;
          }
        }

      }

      .bottom-btn-wrap {
        margin-left: 47px;
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }
    }
  }
</style>
