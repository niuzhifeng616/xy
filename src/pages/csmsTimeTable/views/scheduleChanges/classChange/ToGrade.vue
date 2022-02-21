<!-- 课表变更 -->
<template>
  <div id="ClassChange">
    <div class="grade-left-title">
      <p
         class="f18">{{$parent.titleNames}}</p>
      <!-- <tabs :animated="false" v-model="names" @on-click="changTab" style="width:100%">
        <tab-pane v-for="(item,index) in weekList" :label="item.Week" :name="item.WeekInfo" :key='index'></tab-pane>
      </tabs> -->
      <div class="week-box">
        <i class="iconfont prev "
           :class="currentPage===1?'not-allow':''"
           @click="previousPage">&#xe6f0;</i>
        <i class="iconfont next "
           :class="currentPage===pageAll?'not-allow':''"
           @click="nextPage">&#xe6f1;</i>
        <div :style="{transform: 'translateX('+move+'px)'}">
          <span v-for="(item,index) in weekList"
                :key='index'
                @click="changTab(item.WeekInfo,index)"
                :class='activeIndex===index?"active":""'>{{item.Week}}</span>
        </div>
      </div>
    </div>
    <div class="grade-content">
      <div class="grade-left">
        <div class="table-content">
          <div class="container clearfix">
            <div id="left-div">
              <div id="left-div1">
                <table>
                  <thead>
                    <tr>
                      <th>班级</th>
                    </tr>
                    <!-- <tr>
                      <th>节次</th>
                    </tr> -->
                  </thead>
                </table>
              </div>
              <div id="left-div2">
                <table id="left-table2">
                  <tbody>
                    <tr v-for="(tItem,index) in tableList.TimeTables"
                        ref="trListLeft"
                        :key='index'>
                      <td>
                        <div style="padding:4px;text-align:center;">
                          {{tItem.ClassName}}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div id="right-div">
              <div id="right-div1">
                <table id="right-table1">
                  <thead>
                    <tr>
                      <th v-for="(item,index) in 7"
                          :key='index'
                          :colspan="thLen">{{dateFun.changeChinesesWeek(item)}}</th>
                    </tr>
                    <tr>
                      <th v-for="(thItem,index) in tableList.Times"
                          :key='index'>
                        <div class="th-div">{{thItem.AMorPMOrderName}}</div>
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div id="right-div2"
                   ref="rightTable">
                <table id="right-table2">
                  <tbody>
                    <tr v-for="(tItem,index) in tableList.TimeTables"
                        ref="trListRight"
                        :key='index'>
                      <td v-for="(tdItem,kIndex) in tableList.Times"
                          :key='kIndex'>
                        <template v-for="(courseItem,cIndex) in tItem.Courses">
                          <div class="td-content"
                               :key='cIndex'
                               :class="(courseItem.isCheck||checkedIdS.indexOf(courseItem.ClassTableGenerateBaseID)!==-1)?'active':''"
                               v-if="courseItem.Day == tdItem.Day && courseItem.AMorPM == tdItem.AMorPM  && courseItem.AMorPMOrder == tdItem.AMorPMOrder"
                               @click="tdCourseBtn(courseItem,tdItem)">
                            <div class="nowrap"><b>{{courseItem.SubjectName}}</b></div>
                            <div class="nowrap">{{courseItem.TeacherName}}</div>
                          </div>
                        </template>

                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grade-right">
        <div v-if="checkList.length>0">
          <div class="checklist-title">您将把选中的<b style="color:#4196ff;">{{checkList.length}}</b>节课更换成</div>
          <div class="checklist-select">
            <span>课程</span>
            <i-select v-model="classTypeCopy"
                      @on-change="classSelectChange">
              <i-option v-for="(item,index) in subjectList"
                        :value="JSON.stringify(item)"
                        :key='index'>{{item.SubjectName}}</i-option>
            </i-select>
          </div>
          <div class="checklist-select">
            <span>教师</span>
            <i-select v-model="teacherType"
                      disabled>
              <i-option value='1'></i-option>
            </i-select>
          </div>
          <div class="text-left">
            <Button class="xy-btn-primary"
                    shape="circle"
                    :disabled="isSubmit"
                    @click="classChangeBtn">确定</Button>
          </div>
        </div>
        <div v-else
          class="no-change"
          >
          <!-- <img class="no-change-img" src="@/assets/common/nullData.svg" alt="图片 /> -->
          <div class="no-change-text" >请先从左侧选择要变更的课程。</div>
        </div>
      </div>

      <!-- 确定提交课程变更 -->
      <modal v-model="courseChange"
             :transfer="false"
             width="1000"
             :styles="{top: '20px'}"
             title="课程变更"
             :mask-closable="false"
             :closable="true"
             class='dialog-changeSubject'>
        <div class="dialog-model-content">
          <i-table ref="selection"
                   height="200"
                   :columns="columns"
                   :data="checkList"
                   class='dialog-table'></i-table>
          <i-form ref="formValidateNoticeOK"
                  :model="formValidateNoticeOK"
                  :rules="ruleValidateNoticeOK"
                  label-position="top">
            <form-item label="变更原因"
                       prop="noticeCont"
                      label-for="noticeCont">
              <Input type="textarea"
                       v-model="formValidateNoticeOK.noticeCont"
                      element-id="noticeCont"
                       :rows="3"
                       clearable />
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="cancel">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  :loading="loading"
                  @click="ok">
            <span v-if="!loading">保存</span>
            <span v-else>保存中...</span></Button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>

  export default {
    components: {},
    data () {
      return {
        move: 0,
        loading: false,
        thLen: '',
        titleName: '',
        names: '',
        classType: '',
        classTypeCopy: {},
        teacherType: '',
        sTime: '',
        eTime: '',
        studentGradeForStudentYears: '',
        weekList: [],
        tableList: {
          Times: [],
          TimeTables: []
        },
        subjectList: [],
        columns: [
          {
            title: '上课时间',
            key: 'CourseTime'
          },
          {
            title: '班级',
            key: 'CoursePlanTableFullName'
          },
          {
            title: '原课程/教师',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  attrs: {
                    title: params.row.SubjectName + ' / ' + params.row.TeacherName
                  },
                  domProps: {
                    innerHTML: '<div class="nowrap">' + params.row.SubjectName + (params.row.TeacherName == null ? '' : (' / ' + params.row.TeacherName)) + '</div>'
                  }
                })
              ])
            }
          },
          {
            title: '变更为课程/教师',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: '<div class="nowrap">' + params.row.ChangeSubjectName + '</div>'
                  }
                })
              ])
            }
          }
        ],
        checkList: [],
        checkedIdS: [],
        courseChange: false,
        formValidateNoticeOK: {
          noticeCont: ''
        },
        ruleValidateNoticeOK: {
          noticeCont: [
            { required: true, message: '请输入变更原因', trigger: 'blur' },
            { type: 'string', max: 100, message: '变更原因不能超过100个字', trigger: 'blur' }
          ]
        },
        weekName: '',
        isSubmit: false,
        CourseDate: '',
        dateFun: {},
        activeIndex: 0,
        currentPage: 1,
        pageAll: 0

      }
    },
    created () {
      this.dateFun = {
        // 日期格式化
        format: function (date, format) {
          if (typeof date === 'string') { // 如果是字符串转换为日期型
            date = new Date(date.replace(/-/g, '/'))
          }

          if (!format) { format = 'yyyy-MM-dd HH:mm:ss' }
          let obj =
            {
              'M+': date.getMonth() + 1, // 返回实际月份
              'd+': date.getDate(), // 返回当月第几天
              'H+': date.getHours(), // 返回小时
              'm+': date.getMinutes(), // 返回分钟
              's+': date.getSeconds(), // 返回秒
              'q+': Math.floor((date.getMonth() + 3) / 3), // 返回第几个季度
              'S': date.getMilliseconds(), // 返回毫秒
              'w': date.getDay(), // 返回星期几，0为星期日
              'W': '日一二三四五六'.charAt(date.getDay()) // 返回星期几的中文表示
            }

          // 年的单独处理
          if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
          // 其他格式处理
          for (let k in obj) {
            if (new RegExp('(' + k + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? obj[k] : ('00' + obj[k]).substr(('' + obj[k]).length)) }
          }
          return format
        },
        getChinesesWeekForNum: function (num) {
          if (num < 0 || num > 6) { num = 0 }
          let listU = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
          return listU[num]
        },
        changeChinesesWeek: function (num) {
          if (num < 1 || num > 6) { num = 0 }
          let listU = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
          return listU[num]
        }
      }
    },
    updated: function () {
      if (this.tableList.TimeTables.length > 0) {
        for (let i = 0; i < this.$refs.trListRight.length; i++) {
          this.$refs.trListLeft[i].style.height = this.$refs.trListRight[i].offsetHeight + 'px'
        };
        // 滚动
        $('#right-div2').on('scroll', function () {
          let top = $(this).scrollTop()
          let left = $(this).scrollLeft()
          $('#left-div2').scrollTop(top)
          $('#right-div1').scrollLeft(left)
        })
      };
    },
    destroyed () {
      this.$parent.isShowYS = true
    },
    mounted: function () {
      this.$nextTick(() => {
        // this.studentGradeForStudentYears = this.$parent.studentGradeForStudentYears
        // this.titleName = this.$parent.titleNames
        this.getWeek()
        this.getSubject()
      })
    },
    methods: {
      previousPage () {
        if (this.currentPage > 1) {
          --this.currentPage
          this.move = -464 * (this.currentPage - 1)
        }
      },
      nextPage () {
        if (this.currentPage < this.pageAll) {
          ++this.currentPage
          this.move = -464 * (this.currentPage - 1)
        }
      },
      async  getSubject () {
        let that = this
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForCourseChange/GetSubjects`, null, true)

        if (res.success) {
          if (res.data.length > 0) {
            that.subjectList = res.data
            if (that.subjectList.length > 0) {
              that.classType = that.subjectList[0]
              that.classTypeCopy = JSON.stringify(that.subjectList[0])
            }
          } else {
            that.subjectList = []
          };
        } else {
          that.subjectList = []
        };
      },
      async  getWeek () {
        let that = this
        this.weekList = []
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForCourseChange/GetWeek`)
        if (res.success) {
          if (res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].Week === '本周') {
                that.names = res.data[i].WeekInfo
                that.sTime = res.data[i].Date
                that.eTime = this.dateFun.format(new Date(new Date(res.data[i].Date).getTime() + 6 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
                that.getTable()
              };
              that.weekList.push({
                Week: res.data[i].Week === '本周' ? '本周' : '第' + res.data[i].Week + '周',
                Date: res.data[i].Date,
                WeekInfo: res.data[i].WeekInfo
              })
              if (new Date(this.dateFun.format(new Date(), 'yyyy-MM-dd 00:00:00')).getTime() - new Date(res.data[i].Date).getTime() >= 0) {
                if ((new Date(res.data[i].Date).getTime() + 6 * 24 * 60 * 60 * 1000) - new Date(this.dateFun.format(new Date(), 'yyyy-MM-dd 00:00:00')).getTime() >= 0) {
                  that.weekList[i].isDate = true
                } else {
                  that.weekList[i].isDate = false
                };
              } else {
                that.weekList[i].isDate = false
              };
            };
            this.pageAll = that.weekList.length % 7 === 0 ? that.weekList.length / 7 - 1 : Math.ceil(that.weekList.length / 7)
          } else {
          };
        }
      },
      async  getTable () {
        this.xy.loading()
        let that = this
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForCourseChange/GetStudentGradeForStudentYearTimeTable`, {
          studentGradeForStudentYears: this.$parent.studentGradeForStudentYears,
          // studentGradeForStudentYears: 20254,
          startDate: that.sTime,
          endDate: that.eTime
        })

        if (res.success) {
          that.tableList.Times = []
          if (res.data.Times.length > 0) {
            for (let i = 0; i < 7; i++) {
              for (let j = 0; j < res.data.Times.length; j++) {
                that.thLen = res.data.Times.length
                that.tableList.Times.push({
                  Day: i,
                  AMorPM: res.data.Times[j].AMorPM,
                  AMorPMOrder: res.data.Times[j].AMorPMOrder,
                  AMorPMOrderName: res.data.Times[j].AMorPMOrderName
                })
              };
            };
            if (res.data.TimeTables.length > 0) {
              that.tableList.TimeTables = res.data.TimeTables
              for (let j = 0; j < that.tableList.TimeTables.length; j++) {
                for (let k = 0; k < that.tableList.TimeTables[j].Courses.length; k++) {
                  let id = that.tableList.TimeTables[j].Courses[k].ClassTableGenerateBaseID
                  // 切换校区或年级后，把之前选中的课程保存起来
                  if (that.checkedIdS.indexOf(id) === -1) {
                    that.tableList.TimeTables[j].Courses[k].isCheck = false
                    that.tableList.TimeTables[j].Courses[k].ChangeSubjectName = ''
                  } else {
                    that.tableList.TimeTables[j].Courses[k].isCheck = true
                    that.tableList.TimeTables[j].Courses[k].ChangeSubjectName = that.classType.SubjectName
                  }
                };
              };
            } else {
              that.tableList.TimeTables = []
            };
          } else {
            that.tableList = {
              Times: [],
              TimeTables: []
            }
          };
        }
        this.xy.unloading()
      },
      changTab: function (vals, index) {
        let nowDay = ''
        this.activeIndex = index
        this.names = vals
        for (let i = 0; i < this.weekList.length; i++) {
          if (vals === this.weekList[i].WeekInfo) {
            this.weekName = this.weekList[i].Week
            nowDay = this.weekList[i].Date
          };
        };
        this.sTime = nowDay
        this.eTime = this.dateFun.format(new Date(new Date(nowDay).getTime() + 6 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
        this.getTable()
      },

      // 选择课程
      tdCourseBtn: function (vals, tItem) {
        vals.isCheck = !vals.isCheck
        if (vals.isCheck) {
          vals.ChangeSubjectName = this.classType.SubjectName
          this.CourseDate = this.dateFun.format(new Date(new Date(this.sTime).getTime() + vals.Day * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
          vals.CourseTime = this.names === '1' ? '本周' + this.dateFun.getChinesesWeekForNum(vals.Day) + tItem.AMorPMOrderName + '（' + this.CourseDate + '）' : '第' + this.names + '周' + this.dateFun.getChinesesWeekForNum(vals.Day) + tItem.AMorPMOrderName + '（' + this.CourseDate + '）'
          vals.CourseWeekIndex = this.names
          vals.CourseDateText = this.dateFun.getChinesesWeekForNum(vals.Day) + tItem.AMorPMOrderName
          this.checkList.push(vals)
          this.checkedIdS.push(vals.ClassTableGenerateBaseID)
        } else {
          vals.ChangeSubjectName = ''
          if (this.checkList.length > 0) {
            for (let i = 0; i < this.checkList.length; i++) {
              if (vals.AMorPM === this.checkList[i].AMorPM && vals.AMorPMOrder === this.checkList[i].AMorPMOrder && vals.Day === this.checkList[i].Day && vals.ClassTableGenerateBaseID === this.checkList[i].ClassTableGenerateBaseID) {
                this.checkList.splice(i, 1)
              };
            };
            if (this.checkedIdS.length > 0) {
              this.checkedIdS = this.checkedIdS.filter(item => {
                return item !== vals.ClassTableGenerateBaseID
              })
            }
          };
        };
      },

      // 选择课程
      classSelectChange: function (val) {
        this.isSubmit = false
        this.classType = JSON.parse(this.classTypeCopy)
      },

      // 确定提交
      classChangeBtn: function () {
        this.columns = []
        for (let i = 0; i < this.checkList.length; i++) {
          this.checkList[i].ChangeSubjectName = this.classType.SubjectName
        };
        this.columns = [{
                          title: '上课时间',
                          key: 'CourseTime',
                          minWidth: 150
                        },
                        {
                          title: '班级',
                          key: 'CoursePlanTableFullName',
                          minWidth: 150
                        },
                        {
                          title: '原课程/教师',
                          render: (h, params) => {
                            return h('div', [
                              h('span', {
                                domProps: {
                                  innerHTML: '<div>' + params.row.SubjectName + (params.row.TeacherName == null ? '' : (' / ' + params.row.TeacherName)) + '</div>'
                                }
                              })
                            ])
                          }
                        },
                        {
                          title: '变更为课程/教师',
                          render: (h, params) => {
                            return h('div', [
                              h('span', {
                                domProps: {
                                  innerHTML: '<div>' + params.row.ChangeSubjectName + '</div>'
                                }
                              })
                            ])
                          }
                        }]
        if (this.columns.length > 0 && this.checkList.length > 0) {
          this.courseChange = true
        };
      },

      ok () {
        let that = this
        this.$refs.formValidateNoticeOK.validate((valid) => {
          if (!valid) {
          // return that.changeLoading()
          } else {
            that.loading = true
            let postData = []
            for (let i = 0; i < that.checkList.length; i++) {
              postData.push({
                ClassTableGenerateBaseID: that.checkList[i].ClassTableGenerateBaseID,
                SubjectID: that.classType.SubjectID,
                Week: that.checkList[i].CourseWeekIndex,
                TimeInfo: that.checkList[i].CourseDateText,
                Description: $.trim(that.formValidateNoticeOK.noticeCont)
              })
            }
            this.xy.post(`${this.$store.state.apiPath}/api/ClassTableGenerateForCourseChange/Create`, postData).then(res => {
              if (res.success) {
                that.loading = false
                this.xy.msgSuc('创建成功。')
                that.courseChange = false
                that.$refs.formValidateNoticeOK.resetFields()
                that.$parent.isShowYS = true
                that.$parent.showTitle = 0
                that.$parent.isIndex = -1
                // that.$parent.$refs.list.loadTable()
                this.$store.commit('common/getThreeMenuName', '')
                this.$router.push({ path: '/xyHome/classChange/list', query: this.$store.state.common.menuInfo })
              } else {
                that.xy.msgSuc('创建失败。')
                that.loading = false
                that.courseChange = false
                that.$refs.formValidateNoticeOK.resetFields()
              };
            })
          }
        })
      },
      cancel: function () {
        this.loading = false
        this.courseChange = false
        this.$refs.formValidateNoticeOK.resetFields()
      }
    }

  }
</script>
<style lang='less' scoped>
.grade-content {
  position: relative;
}

.grade-left {
  overflow: hidden;
  border-width: 1px 0 1px 1px;
  border-style: solid;
  border-color: #dcdee2;
  width: calc(100% - 300px);
}

.grade-left-title {
  padding: 10px;
  display: flex;
  min-width: 300px;
  .week-box {
    display: flex;
    align-items: center;
    position: relative;
    width: 520px;
    overflow: hidden;
    .next {
      width: 32px;
      text-align: center;
      position: absolute;
      line-height: 32px;
      cursor: pointer;
      right: 0;
      z-index: 1;
      background-color: #fff;
    }
    .prev {
      width: 32px;
      text-align: center;
      position: absolute;
      line-height: 32px;
      cursor: pointer;
      left: 0;
      z-index: 1;
      background-color: #fff;
    }
    .not-allow {
      cursor: not-allowed;
      color: #c5c8ce;
    }
    div {
      display: flex;
      margin: 0 10px;
      position: absolute;
      left: 32px;
      span {
        font-size: 14px;
        border-radius: 4px;
        min-width: 50px;
        margin-right: 16px;
        &.active {
          color: rgba(255, 255, 255, 1);
          background: #4196ff;
        }
      }
    }
  }
  .f18 {
    margin-right: 20px;
  }
}

.grade-left-title > div {
  text-align: center;
}

.grade-right {
  width: 300px;
  padding: 10px;
  border: 1px solid #dcdee2;
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
}

.no-change {
  text-align: center;
  margin-top: 100px;
}

.no-change-img {
  width: 250px;
}

.no-change-text {
  color: #ccc;
}
.table-content {
  overflow-x: auto;
  min-height: 490px;
  margin-right: 10px;
}
.table-content table {
  width: 100%;
}
.table-content table thead tr:nth-child(1) > th {
  border-bottom: 1px solid #d8e0eb;
}
.table-content table thead tr th {
  font-size: 14px;
  font-weight: 700;
  padding: 10px 0px;
  border-right: 1px solid #d8e0eb;
  min-width: 140px;
  max-width: 140px;
}
.table-content table tbody td {
  border-top: 1px solid #d8e0eb;
  border-right: 1px solid #d8e0eb;
  background: #fff;
  min-width: 140px;
  max-width: 140px;
}
.table-content table tbody td > div {
  min-width: 139px;
  max-width: 139px;
}
.th-div {
  width: 139px;
}
.td-content {
  cursor: pointer;
  min-height: 50px;
  width: 90%;
  max-width: 139px;
  margin: 5px auto;
  text-align: left;
  padding: 4px 4px;
  z-index: 99;
  border-left: 3px solid #4196ff;
  color: rgba(65, 150, 255, 1);
  background: rgba(65, 150, 255, 0.1);
}
.td-content.active {
  color: #fff;
  background: #6392e9;
}
.checklist-title {
  padding: 10px;
  font-size: 16px;
}
.checklist-select {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  span {
    min-width: 70px;
    text-align: center;
  }
}

.container {
  width: 100%;
  max-height: 800px;
  padding: 0;
  box-sizing: border-box;
}

#left-div {
  width: 150px;
  float: left;
}

#left-div1 {
  width: 100%;
  table {
    background: #fafafa;
    th {
      padding: 31px 0;
      border-bottom: none;
      font-weight: 400;
    }
  }
}

#left-div2 {
  width: 100%;
  max-height: 600px;
  overflow: hidden;
}

#left-table2 {
  margin-bottom: 8px;
}

#left-table2 td {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  border-right: 1px solid #d8e0eb;
}

#right-div {
  float: left;
  width: calc(100% - 150px);
}

#right-div1 {
  width: 100%;
  overflow: hidden;
}

#right-div2 {
  width: 100%;
  max-height: 600px;
  overflow: auto;
}

#right-table1 {
  width: 100%;
  background: #fafafa;
}

#right-table2 {
  overflow: auto;
}

#right-table1 tr th:first-child {
  border-top-left-radius: 0;
}
.text-left {
  margin-left: 20px;
}
//弹窗样式
.dialog-changeSubject {
  /deep/.ivu-modal-body {
    padding-bottom: 0 !important;
  }
  .dialog-model-content {
    width: 100%;
    display: flex;
    margin-bottom: 0 !important;
    form {
      width: 220px;
      height: initial;
      border-left: 1px solid #e8eaec;
      padding-left: 10px;
      margin-top: 0;
    }
    .dialog-table {
      width: -moz-calc(100% - 220px);
      width: -webkit-calc(100% - 220px);
      width: calc(100% - 220px);
      /deep/ .ivu-table {
        width: 100%;
      }
    }
  }
}
</style>
