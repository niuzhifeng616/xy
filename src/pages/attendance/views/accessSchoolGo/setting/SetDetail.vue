<template>
<div>

  <div class="details-wrap">
    <div class="xy-content-title clearfix" style="text-align: center">
        <h3 style="display: inline-block;padding-top: 8px;font-size: 16px;color: #333">{{caseTitle}}</h3>
        <i-button class="fr pr " @click="goBack">返回</i-button>
    </div>
    <section v-for="(rule,ruleIndex) in rulesData" :key="ruleIndex">
      <div class="show-section" v-if="!rule.edit">
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
      </div>
      <div class="edit-section" v-else>
        <div class="grade-select" v-if="roleId ===3">
          <label class="label-title">年级</label>
          <div class="grade-list" style="margin-left: 18px;">
            <checkbox-group v-model="rule.GradeForYearID" @on-change="changeGrade">
              <Checkbox :label="item.StudentGradeForStudentYearID"
                        :disabled="item.disable && rule.GradeForYearID.indexOf(item.StudentGradeForStudentYearID) === -1"
                        style="margin-right: 20px" v-for="item in allGradeList"
                        :key="item.StudentGradeForStudentYearID">{{item.StudentGradeNameForStudentYearName}}
              </Checkbox>
            </checkbox-group>
          </div>
        </div>
        <div class="time-select">
          <label class="label-title">规则</label>
          <ul class="time-content" v-if="rule.ListTime.length >0">
            <li class="time-item" :key="timeIndex" v-for="(timeSec, timeIndex) in rule.ListTime">
              <checkbox-group v-model="timeSec.Week" class="week-list" @on-change="changeWeek(ruleIndex)">
                <Checkbox :label="item.value" v-for="item in allWeekDay"
                          :disabled="item.disable &&timeSec.Week.indexOf(item.value) === -1 " :key="item.value">
                  {{item.label}}
                </Checkbox>
              </checkbox-group>
              <Divider :dashed="true"/>
              <Row :gutter="20" v-for="(timeSlot, slotIndex) in timeSec.ListSection" :key="timeSlot.SectionID"
                   style="margin-top: 10px">
                <i-col span="5">
                  <i-select v-model="timeSlot.SectionID" placeholder="时间段">
                    <i-option :value="item.SchoolAccessTimeSectionID"
                              :disabled="validateSecSlot(ruleIndex, timeIndex, item.SchoolAccessTimeSectionID)"
                              v-for="item in timeSlotList"
                              :key="item.SchoolAccessTimeSectionID">
                      {{item.SchoolAccessTimeSectionName}}
                    </i-option>
                  </i-select>
                </i-col>
                <i-col span="8" class="time-slot-column">
                  <label>开放时间</label>
                  <time-picker type="timerange"
                               format="HH:mm"
                               v-model="timeSlot.OpeningHours"
                               placeholder="开放时间">
                  </time-picker>
                </i-col>
                <i-col span="8" class="time-slot-column">
                  <label class="time-slot-column">上课时间</label>
                  <time-picker type="timerange"
                               format="HH:mm"
                               v-model="timeSlot.ClassHours"
                               placeholder="上课时间">
                  </time-picker>
                </i-col>
                <i-col span="2" offset="1" class="del-btn">
                  <Icon @click="delSlot(ruleIndex, timeIndex, slotIndex)" type="ios-trash-outline"
                        style="font-size: 20px"/>
                </i-col>
              </Row>
              <i-button type="text" :disabled="timeSec.ListSection.length === timeSlotList.length"
                        @click="addTimeSlot(ruleIndex, timeIndex)" class="a-add-btn"
                        style="margin-top: 15px; font-size: 12px">
                <Icon type="md-add"/>
                添加时间
              </i-button>
            </li>
          </ul>
        </div>
        <div class="bottom-btn-wrap">
          <a href="javascript:;" @click="addDateItem(ruleIndex)" class="a-add-btn" style="font-size: 14px">
            <Icon type="md-add"/>
            添加日期</a>
          <div class="btn-list">
            <Button class="xy-info" v-if="rule.SchoolAccessRecordSettingGroupID" @click="cancelEdit(ruleIndex)">
              取消
            </Button>
            <Button class="xy-danger" :disabled="(rulesData.length<=1)" @click="delRule(ruleIndex)">删除
            </Button>
            <Button class="xy-primary" @click="saveRule(ruleIndex)">保存</Button>
          </div>
        </div>
      </div>
    </section>
    <Button class="xy-primary" style="width: 100px; margin-top: 20px" v-if="roleId === 3"
            :disabled="isEdit || isGradeSelected" @click="addRule">添加规则
    </Button>
  </div>
  </div>
</template>
<script>
  export default {
    name: 'SetDetail',
    data () {
      return {
        isInitial: true,
        ruleId: '',
        schoolId: '',
        roleId: '',
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
      // this.apiPath = this.xyApi + '/att'
      this.apiPath = this.xyApi + '/inout'
      if (this.$route.query.id) {
        this.ruleId = parseInt(this.$route.query.id)
        this.schoolId = this.$route.query.SchoolDistrictID
        this.roleId = this.$route.query.roleId // 2-- 教师 3--- 学生
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
      changeGrade () {
        this.validateGrade(this.rulesData)
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
        if (this.roleId === 3) {
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
        let rs = await this.xy.post(this.apiPath + '/api/ProgrammeSetting/DeleteRule', params)
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
              this.rulesData.splice(index, 1)
            }
          },
          onCancel: () => {
          }
        })
      },

      // 保存数据
      async saveRule (index) {
        let params = this.rulesData[index]
        if (!this.validateParams(params)) {
          return
        }
        if (this.roleId === 2) {
          let rs = await this.xy.post(this.apiPath + '/api/ProgrammeSetting/CreateTeacherRule', params)
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
          SchoolDistrictId: this.schoolId,
          RoleId: this.roleId
        }
        let rs = await this.xy.get(this.apiPath + '/api/ProgrammeSetting/GetRules', params)
        this.xy.unloading()
        if (rs.success) {
          let res = rs.data ? rs.data : []
          this.rulesData = res
          if (res && res.length) {
            if (this.roleId === 3) {
              this.validateGrade(this.rulesData)
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
            if (this.roleId === 3) {
              this.validateGrade(this.rulesData)
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
          hasSelectWeek = hasSelectWeek.concat(value.Week)
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
        rulesData.forEach((value) => {
          hasSelectGrade = hasSelectGrade.concat(value.GradeForYearID)
        })
        let hasSelectGradeIds = hasSelectGrade.map((value) => {
          return value.Value
        })
        that.allGradeList.forEach((value, index) => {
          if (hasSelectGradeIds.indexOf(value.StudentGradeForStudentYearID) === -1) {
            that.allGradeList.splice(index, 1, {
              StudentGradeForStudentYearID: value.StudentGradeForStudentYearID,
              StudentGradeNameForStudentYearName: value.FullName ? value.FullName : value.StudentGradeNameForStudentYearName,
              disable: false
            })
            // value.disable = false
          } else {
            // value.disable = true;
            that.allGradeList.splice(index, 1, {
              StudentGradeForStudentYearID: value.StudentGradeForStudentYearID,
              StudentGradeNameForStudentYearName: value.FullName ? value.FullName : value.StudentGradeNameForStudentYearName,
              disable: true
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
  .details-wrap {
    width: 900px;
    margin: 0 auto;

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
      margin-top: 10px;
      width: 100%;
      box-sizing: border-box;
      padding: 30px 90px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 4px 0px rgba(218, 218, 218, 0.5);
      border-radius: 4px;

      .time-select, .grade-select {
        display: flex;

        .label-title {
          color: rgba(144, 147, 153, 1);
          width: 50px;
        }
      }

      .time-select {
        margin-top: 15px;

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

          .time-item {
            border: 1px solid rgba(220, 223, 230, 1);
            background: rgba(246, 248, 249, 1);
            border-radius: 2px;
            padding: 10px;
            margin-top: 10px;
          }

          .week-list {
            display: flex;
            justify-content: space-between;
          }

          .ivu-row:hover {
            .del-btn {
              color: #4196FF;
            }
          }

          .del-btn {
            cursor: pointer;
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

      .a-add-btn {
        color: #4196FF;
      }
    }
  }
</style>
