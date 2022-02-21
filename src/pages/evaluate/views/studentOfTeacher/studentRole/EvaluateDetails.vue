<template>
  <div class="xy-content-module">
      <div class="xy-content-body">
          <row>
              <i-col span="6" class="left-body">
                  <div class="left-box">
                      <div class="box-header">
                          <h3>
                              需评价 {{teachers.length}} 位教师，已评价 {{sureTeachers.length}} 位。
                          </h3>
                      </div>
                      <div class="box-body">
                        <div v-for="(item, index) in teachers" :key="index" @click="checkTeacher(index,item)" class="teachers-show" :style="{background:item.check===true ? '#2980FE':'#fff',color: item.check===true ? '#fff': ''}">
                          <div class="teachers-show-item" :style="{borderBottom:item.check===true ? 'none' : '1px dashed #eaeaea'}">
                            <div v-if="item.TeacherSex === 0" class="iconName">
                                <img class="left-img" v-if="item.Icon" :src="item.Icon" />
                                <span class="left-span" v-else :style="{background:item.check===true ? '#fff' : '#FF81AC',color:item.check!==true ? '#fff': '#2980FE'}">{{xy.showName(item.TeacherFullName)}}</span>
                            </div>
                            <div v-if="item.TeacherSex === 0" class="content-text" >
                              <span :title="message" @mouseover="mouseOver(item.TeacherFullName)" @mouseleave="mouseLeave(item.TeacherFullName)">{{item.TeacherFullName}}</span><br/>
                              <span :style="{color:item.check===true ? '#fff' : 'rgba(0,0,0,.65)'}" :title="message"  @mouseover="mouseOver(item.ClassName)" @mouseleave="mouseLeave(item.ClassName)">{{item.ClassName}}</span>
                            </div>
                            <div v-if="item.TeacherSex === 1" class="iconName">
                              <img class="left-img" v-if="item.Icon" :src="item.Icon" />
                              <span  class="left-span" v-else  :style="{background:item.check===true ? '#fff' : '#2980FE',color:item.check!==true ? '#fff': '#2980FE'}">{{xy.showName(item.TeacherFullName)}}</span>
                            </div>
                            <div v-if="item.TeacherSex === 1" class="content-text" >
                              <span :title="message" @mouseover="mouseOver(item.TeacherFullName)" @mouseleave="mouseLeave(item.TeacherFullName)">{{item.TeacherFullName}}</span><br/>
                              <span :style="{color:item.check===true ? '#fff' : 'rgba(0,0,0,.65)'}" :title="message"  @mouseover="mouseOver(item.ClassName)" @mouseleave="mouseLeave(item.ClassName)">{{item.ClassName}}</span>
                            </div>
                            <div class="choose-teachers" v-if="item.Status === 0">
                              <Icon size="22" :type="item.check===true?'md-checkmark-circle':'ios-radio-button-off'" :color="item.check===true?'#fff':''"/>
                              <p>{{item.check ? '已选': '未评' }}</p>
                            </div>
                            <div class="choose-teachers" v-if="item.Status === 1">
                              <Icon size="22" type='md-checkmark-circle' :color="item.check===true?'#fff':'#52C41A'"/>
                              <p>{{item.check ? '': '已评' }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
              </i-col>
              <i-col span="18" class="right-body"  v-if="qusetions.length>0" >
                <div class="right-box">
                    <div class="box-header1">
                        <h3 style="text-align:center">
                            {{qTitle}}
                        </h3>
                    </div>
                    <div class="box-describe">
                        <p>{{projectDescr}}</p>
                        <p style="margin:8px 0 10px 0;"><span style="color:rgba(0,0,0,0.65)">教师姓名：</span><span>{{teacherFullName}}</span></p>
                   </div>

                    <Form label-position="top" class="box-body">
                      <div v-for="(item, index) in qusetions" :key="index" class="qusetions-show"  :class="[item.isActive ? 'activeBor' : item.isActive && qusetions[qusetions.length-1] ? 'activeBor':qusetions[qusetions.length-1] === item? 'activeLast':'']" :style="{borderBottom:qusetions.length<2 ? 'none' : '1px dashed #eaeaea'}">
                        <!-- 单选 -->
                        <div v-if="item.QuestionType===1">
                          <p class="choose-title"> <span v-if="item.IsMust">*</span> {{index+1}}. {{item.QuestionName}}</p>
                          <div class="choose-item">
                            <RadioGroup v-for="(items, indexs) in item.Options" v-model="item.AnswerText" :key="indexs" :vertical="!item.OptionStyle" :class="item.OptionStyle?'radioInline':'radioBlock'">
                                <Radio :disabled="isDisabled" style="margin-right:24px;display: inline-block;" :label="items.QuestionOptionID" :checked="items.IsChecked" @on-change="radioChange(index + '?' + item.AnswerText)">{{letterNum[indexs]}}.&nbsp;&nbsp;{{items.QuestionOptionName}}</Radio>
                            </RadioGroup>
                          </div>
                        </div>
                        <!-- 多选 -->
                        <div v-if="item.QuestionType===2">
                          <p class="choose-title"> <span v-if="item.IsMust">*</span> {{index+1}}. {{item.QuestionName}}</p>
                          <div class="choose-item">
                            <CheckboxGroup style="float:left"  v-for="(items, indexs) in item.Options" v-model="item.AnswerText" :key="indexs" >
                                <Checkbox :label="items.QuestionOptionID" :checked="items.IsChecked" @on-change="checkboxChange(index + '?' + item.AnswerText)"><span>{{items.QuestionOptionName}}</span></Checkbox>
                            </CheckboxGroup>
                          </div>
                        </div>
                        <!-- 星 -->
                        <div v-if="item.QuestionType===3">
                          <p class="choose-title"> <span v-if="item.IsMust">*</span> {{index+1}}. {{item.QuestionName}}</p>
                          <div class="rate-item">
                              <Rate
                                :custom-icon="'iconfont icon-Starunselectedbeifen'"
                                :count="5"
                                v-model="item.AnswerText"
                                class="rate"
                                :disabled="isDisabled"
                                />
                              <span  class="rate-text"  v-if="item.Options[5-item.AnswerText]">{{item.Options[5-item.AnswerText].QuestionOptionName}}</span>
                          </div>
                        </div>
                        <!-- 问答题 -->
                        <div v-if="item.QuestionType===4">
                          <span v-if="item.IsMust" style="color:#F5222D;font-size:18px">*</span>
                          <FormItem
                            :label="`${index+1}. ${item.QuestionName}`"
                            :labelFor="`${index}`"
                            class="question"
                            >
                            <i-input  :elementId="`${index}`" :disabled="isDisabled" type="textarea" class="que-item" v-model="item.AnswerText" placeholder="请输入..."></i-input>
                          </FormItem>
                        </div>
                      </div>
                    </Form>
                </div>
              </i-col>
          </row>
      </div>
    <div class="worflow-submit">
        <Button class="xy-btn-close" style="margin-left:77%;"  @click="cancle">取消</Button>
        <Button class="xy-btn-primary" :style="{background:isDisabled?'#ccc':'#1890FF'}"  @click="answer" shape="circle" >提交评价</Button>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        imgUrl: this.xyApi + '/base',
        row: null,
        teachers: [],
        sureTeachers: [],
        teachingTeacherID: 0,
        teachingStudentID: 0,
        QuestionnaireID: 0,
        qTitle: '',
        qusetions: [],
        nextAnswer: false,
        single: true,
        teacherFullName: '',
        projectDescr: '',
        isLastOne: false,
        allRate: [],
        rateText: '',
        message: '',
        letterNum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'], // 字母序号
        isDisabled: false
      }
    },
    watch: {
      teachers (newVal) {
        this.teachers = newVal
      },
      qusetions (newVal) {
        // console.log(newVal)
      }
    },
    created () {
      this.row = this.$store.state.evaluate.evaluateDetails
      if (this.row.IsPublished || this.row.StatusDescible === '已结束') {
        this.isDisabled = true
      }
      this.getMyEVATeachers(true)
    },
    methods: {
      mouseOver (val) {
        this.message = val
      },
      mouseLeave (val) {
        this.message = ''
      },
      cancle () {
        this.$router.go(-1)
      },
      async getMyEVATeachers (isDefault) {
        let params = {
          teachingProjectID: this.row.TeachingProjectID
        }
        this.xy.loading()
        let rs = await this.xy.get(this.$store.state.apiPath + '/api/StudentTeachingReport/GetMyEVATeachers', params)
        if (rs.success) {
          this.teachers = rs.data.map(item => {
            return {
              ...item,
              check: false
            }
          })
          this.sureTeachers = rs.data.filter(item => item.Status === 1)
          if (this.teachers.length > 0 && isDefault) {
            let teacherList = []
            for (var i = 0; i <= this.teachers.length; i++) {
              if (this.teachers[i]) {
                teacherList.push(this.teachers[i].Status)
              }
            }
            for (var j = 0; j <= teacherList.length; j++) {
              if (teacherList[j] === 0) {
                this.checkTeacher(j, this.teachers[j])
                break
              } else if (teacherList.indexOf(0) === -1) {
                this.checkTeacher(0, this.teachers[0])
                break
              }
            }
          }
        }
        this.xy.unloading()
      },
      checkTeacher (i, item) {
        if (item.Status === 0) {
          this.teachers = this.teachers.map(item => {
            return {
              ...item,
              check: false
            }
          })
          this.teachers[i].check = true
          this.teachingTeacherID = item.TeachingTeacherID
          this.teachingStudentID = item.TeachingStudentID
          this.QuestionnaireID = item.QuestionnaireID
          this.getMyQuestionaire(item.QuestionnaireID, item.TeachingTeacherID, item.TeachingStudentID)
        } else {
          this.teachers = this.teachers.map(item => {
            return {
              ...item,
              check: false
            }
          })
          this.teachers[i].check = true
          this.teachingTeacherID = item.TeachingTeacherID
          this.teachingStudentID = item.TeachingStudentID
          this.QuestionnaireID = item.QuestionnaireID
          this.getMyQuestionaire(item.QuestionnaireID, item.TeachingTeacherID, item.TeachingStudentID)
        }
        this.teacherFullName = item.TeacherFullName
      },
      async getMyQuestionaire (QuestionnaireID, TID, SID) {
        let params = {
          questionnaireID: QuestionnaireID,
          teachingTeacherID: TID,
          teachingStudentID: SID
        }
        this.xy.loading()
        let rs = await this.xy.get(this.$store.state.apiPath + '/api/StudentTeachingAnswer/GetMyQuestionaire', params)
        if (rs.success) {
          this.qTitle = rs.data.QuestionnaireTitle
          this.projectDescr = rs.data.ProjectDescr
          this.qusetions = rs.data.Questions.map(item => {
            return {
              ...item,
              AnswerText: item.QuestionType === 1 ? item.Options.filter(itema => {
                if (itema.IsChecked) {
                  return itema.QuestionOptionID
                }
              }).map(item => {
                return Number(item.QuestionOptionID)
              })[0] : item.QuestionType === 3 ? item.Options.filter((itema, index) => {
                itema.star = 5 - index
                if (itema.IsChecked) {
                  return true
                }
              }).map(item => {
                return item.star
              })[0] : item.QuestionType === 4 ? item.AnswerText : [],
              isActive: false
            }
          }
          )
        }
        this.xy.unloading()
      },
      radioChange (val) {
        let i = Number(val.split('?')[0])
        let value = Number(val.split('?')[1])
        this.qusetions[i].AnswerText = value
      },
      checkboxChange (val) {
        let i = Number(val.split('?')[0])
        let value = Number(val.split('?')[1])
        this.qusetions[i].AnswerText = value
      },
      async answer () {
        var _this = this
        for (let i = 0; i < _this.qusetions.length; i++) {
          if (!this.row.IsPublished || this.row.StatusDescible !== '已结束') {
            if (_this.qusetions[i].IsMust) {
              if (_this.qusetions[i].AnswerText !== null && _this.qusetions[i].AnswerText !== undefined) {
                if (typeof (_this.qusetions[i].AnswerText) === 'string') {
                  _this.qusetions[i].AnswerText = _this.qusetions[i].AnswerText.trim()
                }
              }
              if (_this.qusetions[i].AnswerText == null || _this.qusetions[i].AnswerText === '') {
                _this.xy.msgError(`请填写第${i + 1}题。`)
                _this.qusetions[i].isActive = true
                return
              } else {
                _this.qusetions[i].isActive = false
              }
            }
          }
        }
        if (_this.qusetions.length === 0) {
          _this.xy.msgError('没有问卷题目，不能提交，请给班主任反馈。')
          return
        }
        let copyqusetions = JSON.parse(JSON.stringify(this.qusetions))
        let obj = copyqusetions.map(item => {
          if (item.QuestionType === 3) {
            let startCount
            item.Options.map((i) => {
              startCount = i.star
              if (item.AnswerText === startCount) {
                item.AnswerText = i.StartCount
              }
            })
          }
          return {
            QuestionID: item.QuestionID,
            Answers: item.AnswerText ? String(item.AnswerText).split(',') : []
          }
        })
        let params = {
          TeachingStudentID: this.teachingStudentID,
          TeachingTeacherID: this.teachingTeacherID,
          teachingProjectID: this.row.TeachingProjectID,
          QuestionnaireID: this.QuestionnaireID,
          Details: obj
        }
        this.xy.loading()
        let rs = await this.xy.post(this.$store.state.apiPath + '/api/StudentTeachingAnswer/Answer', params)
        if (rs !== undefined && rs.success) {
          await this.getMyEVATeachers(false)
          if (this.sureTeachers.length === this.teachers.length) {
            this.isLastOne = true
          }
          this.xy.msgSuc('提交成功。')
          setTimeout(() => {
            this.sure()
          }, 1800)
        }
        this.xy.unloading()
      },
      sure () {
        if (this.single && !this.isLastOne) {
          for (var i = 0; i <= this.teachers.length; i++) {
            if (this.teachers[i].Status === 0) {
              this.checkTeacher(i, this.teachers[i])
              break
            }
          }
        }
        // this.nextAnswer = false
        // this.getMyQuestionaire(this.QuestionnaireID, this.teachingTeacherID, this.teachingStudentID)
      },
      //  关闭创建楼弹框触发
      cancel () {
        this.nextAnswer = false
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module{
   background: #f9f9f9;
   padding: 10px 18px;
   .xy-content-body{
     padding:0;
     .left-body{
       border-right: 18px solid #f9f9f9;
       .left-box{
          width:100%;
          margin-right:20px;
          .box-header {
            height: 58px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eaeaea;
            padding: 0 10px;
            font-size: 14px;
            font-weight:400;
          }
          .box-body{
            width:100%;
            height: 880px;
            overflow: auto;
            .teachers-show{
              width:100%;
              height:80px;
              padding:0px 0px 0px 15px;
              cursor: pointer;
              .teachers-show-item{
                width:100%;
                height:100%;
                padding-right: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .iconName{
                  flex:1;
                  float:left;
                  .left-img{
                    display: inline-block;
                    width: 42px;
                    height: 42px;
                    border-radius:50%;
                    line-height:42px;
                    text-align:center;
                    box-shadow: 0px 0px 1px 1px #dddddd;
                  }
                  .left-span{
                    display: inline-block;
                    width: 42px;
                    height: 42px;
                    border-radius:50%;
                    line-height:42px;
                    text-align:center;
                    color:#fff;
                  }
                }
                .content-text{
                  float:left;
                  margin: 0 15px;
                  flex: 6;
                  margin-bottom: 4px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                .content-text span:nth-child(1){
                  cursor:default;
                  font-size: 16px;
                }
                .content-text span:nth-child(2){
                  cursor:default;
                  font-size: 14px;
                }
                .choose-teachers{
                  float:right;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  width: 30px;
                }
              }
            }
          }
       }
     }
     .right-body{
       .right-box{
          width:100%;
          .box-header1 {
            height: 58px;
            line-height: 58px;
            // display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            font-size:20px;
            font-weight:bold;
            color:rgba(0,0,0,1);
            opacity:0.85;
         }
        .box-describe{
          border-bottom: 1px solid #eaeaea;
          padding: 15px 0 15px 25px;
          color:rgba(0,0,0,0.85);
        }
        .box-body{
          width:100%;
          height:830px;
          overflow: auto;
          margin-bottom:60px;
          .qusetions-show{
            width:100%;
            height:auto;
            padding:20px 30px 20px 4px;
            border-bottom:1px dashed #eaeaea;
            .choose-title{
              font-weight: 700;
              span{
                color:#F5222D;
              }
            }
            .choose-item{
                margin: 10px 0 10px 15px;
                color: rgba(0,0,0,0.65);
            }
            .question{
                font-size:20px;
                display: inline-block;
                width: 94%;
            }
            .rate-item{
              margin:10px 0 10px 24px;
              .rate-text{
                color: rgba(0,0,0, .65);
                vertical-align: bottom;
                display: inline-block;
                height: 23px;
              }
            }
            .que-item{
              margin-top:14px;
              margin-left: 20px;
              width:98%;
            }
          }
          .qusetions-show>div{
            margin-left: 20px;
          }
          // .qusetions-show:last-child{
          //   border-bottom:none !important;
          // }
          .activeLast{
             border-bottom:none !important;
          }
          .activeBor{
            border: 1px solid #F5222D !important;
            z-index: 9999;
            margin-left: 0 !important;
            padding-left: 15px !important;
          }
        }
       }
     }
  }
  .worflow-submit{
    width:100%;
    position:fixed;
    bottom:0;
    left: 0;
    background:#fff;
    height:60px;
    display:flex;
    justify-content:center;
    align-items:center;
    border-top: 1px solid #eaeaea;
  }
}
.radioInline{
  display: inline-block;
  margin-left: 10px;
}
.radioBlock{
  display: block;
  margin-left: 10px;
}
.question /deep/ .ivu-form-item-label{
  font-weight: 700;
  margin-left: 4px;
  color:#2c3e50;
}
</style>
