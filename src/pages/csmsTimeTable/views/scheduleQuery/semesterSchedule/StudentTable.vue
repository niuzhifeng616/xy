<template>
  <div class="xy-content-module" ref="Schedule">
    <div class="check-list">
      <Checkbox v-model="isShwowTeacher">
        <span class="" v-cloak>显示教师</span>
      </Checkbox>
      <Checkbox v-model="isShwowHouse">
        <span class="" v-cloak>显示教室</span>
      </Checkbox>
      <Checkbox v-model="isShwowTime">
        <span class="" v-cloak>显示时间</span>
      </Checkbox>
    </div>
    <Button type="primary" class="export-btn xy-primary" @click="modalExport = true">导出</Button>
    <Button class="print-btn xy-primary" @click="printLoad">打印</Button>
    <Row>
      <i-col span="4">
        <div class="left-options">
          <div class="options-header">
            <div class="radio-list">
              <Radio v-model="isVertical" @on-change="radioChange(2)">分表</Radio>
              <Radio v-model="isHorizontal" @on-change="radioChange(1)">总表</Radio>
              <Checkbox v-model="isContainWeekend">
                <span v-cloak>周末课表</span>
              </Checkbox>
            </div>
          </div>
          <div class="options-body">
            <div class="search-opt">
              <Input search placeholder="请输入班级名称" v-model.trim="leftSearchName" @on-change="changeTree"/>
            </div>
            <Checkbox label="0" v-model="allTeacher" :disabled="leftSearchName?true:false" class="schedule-subject administrative-subject" @on-change="changeAllTeacher" v-show='subjectData.length>0'>全部班级</Checkbox>
            <div v-for="(item,index) in subjectData" :key='index' style="margin-top:15px;">
              <div class="subject-box">
                <Checkbox :indeterminate="item.indeterminate" :disabled="leftSearchName?true:false" :value="item.checkAll" @click.prevent.native="handleCheckAll(item,index)">{{item.StudentGradeForStudentYearName}}</Checkbox>
              </div>
              <CheckboxGroup class="teacher-box" v-model="item.selectSubject" @on-change="subjectChange(item,index)">
                <template v-for="(subject,cindex) in item.Orgs">
                  <Checkbox class="teacher-lable" :label="subject.StudentOrganizationID" :key="cindex"  v-if="subject.StudentOrganizationName.indexOf(leftSearchName) >= 0">
                    <p v-cloak class="nowrap" style="width:95%;display:inline" :title="subject.StudentOrganizationName">{{subject.StudentOrganizationName}}</p>
                  </Checkbox>
                </template>
              </CheckboxGroup>
            </div>
          </div>
        </div>
      </i-col>
       <i-col span="20" class="right-table" style="border-left: 1px solid #e8e8e8;">
        <div v-if="datatable.length>0">
          <!-- 总表 -->
          <div class="container clearfix" v-if="isHorizontal">
            <div id="left-div">
              <div id="left-div1">
                <table class="query-table horizontal-version">
                  <thead>
                    <tr>
                      <th style="border-top-right-radius:0">星期</th>
                    </tr>
                    <tr>
                      <th>节次</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div id="left-div2">
                <table id="left-table2" class="query-table horizontal-version">
                  <tbody>
                    <tr v-for="(item,index) in datatable" :key="index" ref="trListLeft">
                      <td>
                        <div v-cloak class="class-name">
                          {{item.FullName}}
                          <span>
                            （{{item.UserName}}）
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div id="right-div">
              <div id="right-div1">
                <table id="right-table1" class="query-table horizontal-version">
                  <thead>
                    <tr>
                      <template v-for="(week,index) in weekData">
                        <th :key="index" v-if="(week.val!=5&&week.val!=6)||isContainWeekend" :colspan="sectionLen" v-cloak>
                          {{week.title}}
                        </th>
                      </template>
                    </tr>
                    <tr>
                      <th v-for="(section,index) in sectionData" :key="index" v-cloak>{{section.AMorPMOrderName}}</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div id="right-div2" ref="rightTable">
                <table id="right-table2" class="query-table horizontal-version">
                  <tbody>
                    <tr v-for="(item,index) in datatable" :key="index" ref="trListRight">
                      <template v-for="(sectionTd,cindex) in sectionData">
                        <td v-cloak :key="cindex" v-if="(sectionTd.Day!=5&&sectionTd.Day!=6)||isContainWeekend">
                          <div class="td-min">
                            <template v-for="(crouse,kindex) in item.ElectiveList">
                              <div v-cloak class="attend-cont-tit" :key="kindex" :style="{'background': crouse.bg,'borderLeftColor':crouse.color,'color':crouse.color}" v-if="crouse.Day == sectionTd.Day && crouse.AMorPM == sectionTd.AMorPM  && crouse.AMorPMOrder == sectionTd.AMorPMOrder">
                                <p class="nowrap" :title="crouse.SubjectName"><b>{{crouse.SubjectName}}</b></p>
                                <p v-if="isShwowTeacher" class="nowrap" :title="crouse.TeacherName">{{crouse.TeacherName}}</p>
                                <p v-if="isShwowHouse" class="nowrap" :title="crouse.HouseName">{{crouse.HouseName}}</p>
                                <p v-if="isShwowTime && crouse.StartTime != null && crouse.EndTime != null" class="nowrap" :title="crouse.StartTime.substring(0,5)+'-'+crouse.EndTime.substring(0,5)">
                                  {{crouse.StartTime.substring(0,5)}}-{{crouse.EndTime.substring(0,5)}}
                                </p>
                              </div>
                            </template>
                          </div>
                        </td>
                      </template>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- 分表 -->
          <div v-if="!isHorizontal" style="overflow:auto;height:600px;">
            <div class="single" v-for="(item,index) in datatable" :key="index">
              <span class="single-tit">
                {{item.FullName}}
                <span>
                  （{{item.UserName}}）{{item.OrgName}}
                </span>
              </span>

              <table class="query-table">
                <thead>
                  <tr>
                    <th rowspan="2"></th>
                    <template v-for="(week,index) in weekData">
                      <th :key="index" v-if="(week.val!=5&&week.val!=6)||isContainWeekend" v-cloak>{{week.title}}</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sectionTd,index) in festList" :key="index">
                    <td>
                      <div class="class-name" v-cloak>{{sectionTd.AMorPMOrderName}}</div>
                    </td>
                    <template v-for="(week,cindex) in weekData">
                      <td v-cloak :key="cindex" v-if="(week.val!=5&&week.val!=6)||isContainWeekend">
                        <div class="td-min">
                          <template v-for="(crouse,kindex) in item.ElectiveList">
                            <div v-cloak class="attend-cont-tit" :key="kindex" :style="{'background': crouse.bg,'borderLeftColor':crouse.color,'color':crouse.color}" v-if="crouse.Day == week.val  && crouse.AMorPM == sectionTd.AMorPM && crouse.AMorPMOrder == sectionTd.AMorPMOrder">
                              <p class="nowrap" :title="crouse.SubjectName"><b>{{crouse.SubjectName}}</b></p>
                              <p v-if="isShwowTeacher" class="nowrap" :title="crouse.TeacherName">{{crouse.TeacherName}}</p>
                              <p v-if="isShwowHouse" class="nowrap" :title="crouse.HouseName">{{crouse.HouseName}}</p>
                              <p v-if="isShwowTime && crouse.StartTime != null && crouse.EndTime != null" class="nowrap" :title="crouse.StartTime.substring(0,5)+'-'+crouse.EndTime.substring(0,5)">
                                {{crouse.StartTime.substring(0,5)}}-{{crouse.EndTime.substring(0,5)}}
                              </p>
                            </div>
                          </template>
                        </div>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else class="no-data-box">
          <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" />
          <span class="no-data-text">
         该搜索条件下没有结果。
          </span>
        </div>
        <div class="text-right pr" style="margin-top:10px;" v-if="datatable.length>0">
          <page :total="total" :page-size="pageSize" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize"></page>
        </div>
      </i-col>
    </Row>

    <!-- 导出 -->
    <Modal v-model="modalExport" :transfer="false" :mask-closable="false" :closable="false">
      <p slot="header" v-if="isHorizontal">导出学生课表总表</p>
      <p slot="header" v-else>导出学生课表分表</p>
      <div class="text-center" style="margin:10px 0;">
        <div v-if="!isHorizontal" style="margin-top:20px;">
          <span style="vertical-align:top;">请选择导出样式：</span>
          <RadioGroup v-model="subExport">
            <Radio label="export" style="display:block; margin-bottom:10px;">
              <span>导出版</span>
            </Radio>
            <Radio label="print" style="display:block;">
              <span>打印版</span>
            </Radio>
          </RadioGroup>
        </div>
        <div v-else>
          是否要导出总表
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="modalExport = false">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="exportFile">导出</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        allTeacher: false,
        scheduleHeader: {},
        selectLevel: 0,
        selecLayer: 0,
        datatable: [],
        weekData: [], // 星期数据
        sectionLen: 0, // 节次长度
        festList: [],
        sectionData: [], // 节次数据
        subjectData: [], // 课程名称
        selectSubject: '0',
        classData: [], // 班级名称列表
        classChildData: [], // 班级名称列表
        classTableIDs: '', // 排课方案IDS
        studentGradeForStudentYearID: '0', // 学年ID
        studentOrganizationID: '0', // 组织结构ID
        disciplineID: '0', // 学科ID
        teacherID: '0', // 教师ID
        searchName: '', // 搜索的名字
        subdatatable: [], // 分表结构
        isShwowTeacher: true,
        isShwowHouse: false,
        isShwowTime: false,
        isHorizontal: false, // 排版
        isVertical: true, // 排版
        leftSearchName: '', // 搜索
        openNames: [],
        isInitial: true,
        pageCurrent: 1, // 当前页码
        pageSize: 1, // 每页显示条数
        pages: [15, 30, 50, 100], // 默认每页可选10/20/50/100条
        total: 0, // 总条数
        weekList: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        // 导出
        modalExport: false,
        isContainWeekend: false, // 导出周六日
        subExport: 'export' // 默认选中导出版
      }
    },
    created () {
      this.scheduleHeader = this.$store.state.csmstimetable.scheduleQuery
      for (let i = 0; i < this.scheduleHeader.classTable.length; i++) {
        this.classTableIDs = this.classTableIDs + this.scheduleHeader.classTable[i].ClassTableID + ','
      }
      this.getClassTableTimeByClassTableList()
      //   this.getSloverResultOverallTimes()
      this.getSloverResultOverallTimesDiscipline()
    },
    updated: function () {
      if (this.datatable.length > 0 && this.isHorizontal) {
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
    mounted: function () {
    },
    methods: {
      // 根据排课方案获取作息时间
      async getClassTableTimeByClassTableList () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/GetByClassTableList`, {
          strClassTableIDs: this.classTableIDs
        })
        if (res.success) {
          let resData = res.data.Return
          this.sectionLen = resData.length
          this.festList = res.data.Return
          this.weekData = []
          this.sectionData = []
          for (let j = 0; j < 7; j++) {
            this.weekData.push({
              title: this.weekList[j],
              val: j
            })
            for (let k = 0; k < resData.length; k++) {
              let isNextDay = false
              if (k === 0) {
                isNextDay = true
              }
              this.sectionData.push({
                AMorPM: resData[k].AMorPM,
                AMorPMOrder: resData[k].AMorPMOrder,
                AMorPMOrderName: resData[k].AMorPMOrderName,
                Day: j,
                isNextDay: isNextDay
              })
            }
          };
          this.$nextTick(() => {
            $('.right-table').css('minHeight', this.$refs.Schedule.offsetHeight + 'px')
          })
        }
      },
      setOrgId () {

      },
      // 学生课表
      async getSloverResultOverallTimes () {
        this.xy.loading()
        // 选择全部的话，班级ID(studentOrganizationID)就传空串。选中个别班级就传个别的班级Id，都没选中就传0
        if (this.allTeacher) {
          this.studentOrganizationID = ''
          this.leftSearchName = ''
        } else {
          let studentOrganizationID = ''
          this.subjectData.map((item) => {
            if (item.selectSubject.length > 0) {
              studentOrganizationID += item.selectSubject.join(',') + ','
            }
          })
          if (studentOrganizationID.length === 0) {
            this.studentOrganizationID = 0
          } else {
            this.studentOrganizationID = studentOrganizationID
          }
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/GetElectiveForClassTableList`, {
          strClassTableIDs: this.classTableIDs,
          searchName: this.searchName,
          //   studentGradeForStudentYearID: this.studentGradeForStudentYearID,
          studentOrganizationID: this.studentOrganizationID,
          pageIndex: this.pageCurrent,
          pageSize: this.pageSize
        })
        if (res.success) {
          let resData = res.data.Return
          let array = []
          for (let i = 0; i < resData.length; i++) {
            for (let j = 0; j < resData[i].ElectiveList.length; j++) {
              let index = array.indexOf(`${resData[i].ElectiveList[j].AID}-${resData[i].ElectiveList[j].Type}`)
              if (index > -1) {
                resData[i].ElectiveList[j].color = this.xy.colors(index).color
                resData[i].ElectiveList[j].bg = this.xy.colors(index).bg
              } else {
                resData[i].ElectiveList[j].color = this.xy.colors(array.length).color
                resData[i].ElectiveList[j].bg = this.xy.colors(array.length).bg
                array.push(`${resData[i].ElectiveList[j].AID}-${resData[i].ElectiveList[j].Type}`)
              }
            }
          }
          this.total = res.data.totalRecords
          this.datatable = resData
          this.xy.unloading()
        }
      },
      // 单击页码触发
      changePage (current) {
        $(window).scrollTop(0)
        this.pageCurrent = current
        this.getSloverResultOverallTimes()
      },
      // 单击切换每页展示条数触发
      changePageSize (size) {
        $(window).scrollTop(0)
        this.pageSize = size
        this.pageCurrent = 1
        this.getSloverResultOverallTimes()
      },
      // 搜索
      changeTree () {
        if (!$.trim(this.leftSearchName) && $.trim(this.leftSearchName) !== '0') { // 输入为空，把组织树都勾选上
          this.getSloverResultOverallTimesDiscipline()
        } else {
          // 搜索的时候，把组织树勾选状态都取消
          this.allTeacher = false
          for (let i = 0; i < this.subjectData.length; i++) {
            this.subjectData[i].selectSubject = []
            this.subjectData[i].checkAll = false
            this.subjectData[i].indeterminate = false
          };
          this.datatable = []
        }
      },
      // 全部班级
      async getSloverResultOverallTimesDiscipline () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/GetAllStudentOrg`, {
          strClassTableIDs: this.classTableIDs
        })
        if (res.success) {
          let resData = res.data.Return
          for (let i = 0; i < resData.length; i++) {
            resData[i].selectSubject = []
            resData[i].checkAll = true
            resData[i].indeterminate = false
            resData[i].Orgs.map((item, index) => {
              resData[i].selectSubject.push(item.StudentOrganizationID)
            })
          };
          this.allTeacher = true
          this.subjectData = resData
          this.getSloverResultOverallTimes()
        }
      },
      handleCheckAll (item, index) {
        if (item.indeterminate) {
          item.checkAll = false
        } else {
          item.checkAll = !item.checkAll
        }
        item.indeterminate = false
        if (item.checkAll) {
          let arr = []
          item.selectSubject = []
          item.Orgs.map(citem => {
            item.selectSubject.push(citem.StudentOrganizationID)
            arr.push({
              disciplineID: item.DisciplineID,
              StudentOrganizationID: citem.StudentOrganizationID
            })
          })
        } else {
          item.selectSubject = []
        }
        this.subjectData[index].checkAll = item.checkAll
        this.subjectData[index].selectSubject = item.selectSubject
        this.subjectData[index].indeterminate = item.indeterminate
        this.isSelectedAll()
      },
      subjectChange (item, index) {
        if (item.selectSubject.length === item.Orgs.length) {
          item.indeterminate = false
          item.checkAll = true
        } else if (item.selectSubject.length > 0) {
          item.indeterminate = true
          item.checkAll = false
        } else {
          item.indeterminate = false
          item.checkAll = false
        }
        this.subjectData[index].checkAll = item.checkAll
        this.subjectData[index].selectSubject = item.selectSubject
        this.subjectData[index].indeterminate = item.indeterminate
        this.isSelectedAll()
      },
      isSelectedAll () {
        let index = this.subjectData.map(item => {
          return item.checkAll
        }).indexOf(false)
        this.allTeacher = index === -1
        $(window).scrollTop(0)
        this.pageCurrent = 1
        this.getSloverResultOverallTimes()
      },
      changeAllTeacher () {
        if (!this.allTeacher) {
          this.subjectData = this.subjectData.map(item => {
            item.selectSubject = []
            item.checkAll = false
            item.indeterminate = false
            return item
          })
        } else {
          this.subjectData = this.subjectData.map(item => {
            item.checkAll = true
            item.indeterminate = false
            item.Orgs.map(citem => {
              if (item.selectSubject.length === 0 || item.selectSubject.indexOf(citem.StudentOrganizationID) === -1) {
                item.selectSubject.push(citem.StudentOrganizationID)
              }
            })
            return item
          })
        }
        $(window).scrollTop(0)
        this.pageCurrent = 1
        this.getSloverResultOverallTimes()
      },
      // 排版
      radioChange (val) {
        if (val === 1) {
          this.isHorizontal = true
          this.isVertical = false
        };
        if (val === 2) {
          this.isHorizontal = false
          this.isVertical = true
        };
      },
      // 导出
      exportFile () {
        // 导出总表
        if (this.isHorizontal) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/ExportTotalStudentClassTimes`, {
            strClassTableIDs: this.classTableIDs,
            searchName: this.searchName,
            isContainWeekend: this.isContainWeekend,
            showTeacher: this.isShwowTeacher,
            showHouse: this.isShwowHouse,
            showTime: this.isShwowTime,
            // studentGradeForStudentYearID: this.studentGradeForStudentYearID,
            studentOrganizationID: this.studentOrganizationID
          })
        } else {
          if (this.subExport === 'export') {
            // 导出分表
            this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/ExporPartStudentClassTimes`, {
              strClassTableIDs: this.classTableIDs,
              searchName: this.searchName,
              isContainWeekend: this.isContainWeekend,
              showTeacher: this.isShwowTeacher,
              showHouse: this.isShwowHouse,
              showTime: this.isShwowTime,
              //   studentGradeForStudentYearID: this.studentGradeForStudentYearID,
              studentOrganizationID: this.studentOrganizationID
            })
          } else {
            // 打印分表
            this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSessionTimeTable/ExporPrintingPartStudentClassTimes`, {
              strClassTableIDs: this.classTableIDs,
              searchName: this.searchName,
              isContainWeekend: this.isContainWeekend,
              showTeacher: this.isShwowTeacher,
              showHouse: this.isShwowHouse,
              showTime: this.isShwowTime,
              //   studentGradeForStudentYearID: this.studentGradeForStudentYearID,
              studentOrganizationID: this.studentOrganizationID
            })
          }
        }
        this.modalExport = false
      },
      // 打印
      printLoad () {
        let print = {
          datatable: this.datatable,
          festList: this.festList,
          weekData: this.weekData,
          isContainWeekend: this.isContainWeekend,
          isShwowTeacher: this.isShwowTeacher,
          isShwowHouse: this.isShwowHouse
        }
        this.$store.commit('common/getParam', print)
        localStorage.setItem('printParams', JSON.stringify(print))
        let routeUrl = this.$router.resolve({
          path: '/xyHome/SemesterStudentPrint',
          query: this.$store.state.menuInfo
        })
        window.open(routeUrl.href, '_blank')
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module{
  border-top: 1px solid #e8e8e8;
}
.query-table {
  width: 100%;
  height: 100%;
  overflow: auto;
  border-spacing: 0;
  text-align: center;
}
.horizontal-version tr:first-child th {
  background: #F4F5F7;
  font-weight: bold;
}
.query-table thead tr th {
  background: #F4F5F7;
  border-right: 1px solid #fff;
  min-width: 140px;
  max-width: 140px;
  padding: 10px 0;
}
.query-table tbody {
  border: 1px solid #eee;
}
.query-table tbody tr td:nth-child(1) {
  border-right: 1px solid #eee;
}
.query-table tbody tr td:last-child {
  border-right: 1px solid #eee;
}
.query-table td,
.query-table th {
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  /*border: 1px solid #eee;*/
  min-width: 140px;
  max-width: 140px;
}
.query-table thead tr th:nth-child(1) {
//   border-top-left-radius: 6px;
}
.query-table thead tr th:last-child {
//   border-top-right-radius: 6px;
  border-right: 0px;
}
.table-subject {
  width: 150px;
  height: 80px;
  border: 1px solid #ddd;
}
.export-btn {
  position: absolute;
  top: 11px;
  right: 0;
}
.check-list {
  position: absolute;
  top: 15px;
  right: 160px;
}
.print-btn {
  position: absolute;
  top: 11px;
  right: 80px;
}
/*初始*/
.schedule-tip {
  color: #8b8b8b;
  font-size: 12px;
  height: 32px;
  line-height: 32px;
}
.plan-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  min-height: 300px;
  cursor: pointer;
}
.plan-list li {
  padding: 20px 15px;
  width: 24%;
  height: 105px;
  margin: 10px 6px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 8px 0px rgba(196, 196, 196, 0.5);
  border-radius: 4px;
}
.plan-list li.is-checked {
  box-shadow: 0px 3px 8px 0px rgba(54, 54, 54, 0.5);
}
.plan-list li:hover {
  box-shadow: 0px 3px 8px 0px rgba(54, 54, 54, 0.5);
}
.plan-list .class-table-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
}

.plan-list .plan-span {
  margin-top: 17px;
}
.plan-list .plan-span span {
  /*width:49%;
    display:inline-block;*/
  color: #8b8b8b;
}
.schedule-change-list {
  width: 100%;
  text-align: center;
}
.schedule-change-list li {
  display: inline-block;
}
.schedule-change-list li .type-name {
  padding: 0 8px 4px 8px;
  cursor: pointer;
}
.schedule-change-list li .underline {
  width: 30px;
  height: 4px;
  background: rgba(99, 146, 233, 1);
  margin: 0 auto;
}
.back-btn {
  position: absolute;
  top: 147px;
  right: 35px;
  z-index: 99;
}
.select-class-list {
  width: 80%;
  background: rgba(243, 243, 243, 1);
  border-radius: 4px;
  color: #8b8b8b;
}
.ivu-table th {
  border-top: 1px solid #ebeef5;
  background: #f9f9f9;
}
.filter-conditions {
  margin: 15px 0;
}
.crouse-list {
  border: 1px solid #ddd;
  margin-right: 20px;
}
.attend-cont-tit {
  text-align: left;
  padding: 6px 10px;
  max-width: 200px;
  background: rgba(59, 134, 254, 0.1);
  color: rgb(59, 134, 254);
  border-radius: 0px 3px 3px 0px;
  border-left: 3px solid rgb(59, 134, 254);
  margin-bottom: 5px;
}
.class-name {
  min-width: 140px;
  max-width: 140px;
}
.class-name > span {
  font-size: 14px;
  color: #999;
}
.subject-box {
  margin-left: 20px;
  margin-bottom: 15px;
}
.teacher-box {
  margin-left: 40px;
}
.teacher-lable {
  display: block;
  margin-bottom: 15px;
  max-width: 100%;
}
.td-min {
  min-width: 140px;
  max-width: 140px;
  min-height: 58px;
}

.single {
  margin-bottom: 25px;
}

.single > .single-tit {
  margin-left: 10px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #444444;
  margin-bottom: 18px;
  display: block;
}
.single > .single-tit > span {
  font-size: 14px;
  color: #999;
}
.single > .row-single-tit {
  margin-top: 10px;
  font-size: 16px;
  margin-bottom: 5px;
  margin-left: 5px;
  display: inline-block;
}

.week-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 15px 0;
}
.week-ul li b {
  font-size: 16px;
}
.week-ul li span {
  font-size: 14px;
  color: #000;
  padding: 2px 7px;
  cursor: pointer;
  margin: 0 4px;
}
.week-ul li span:hover {
  background: #2d8cf0;
  color: #fff;
  border-radius: 4px;
}
.is-cur-week {
  background: #2d8cf0;
  color: #fff !important;
  border-radius: 4px;
}
.week-con {
  background: #fff;
  width: 100%;
}

/*内容页*/
#Schedule {
  margin-top: 20px;
}
.left-options .options-header {
  padding: 10px 0;
  border-radius: 4px;
  border-bottom: 1px solid #e8e8e8;
}
.left-options .options-header .radio-list{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.left-options .options-header .check-list {
  padding: 10px 0;
}

.left-options .options-body {
  border-radius: 4px;
  padding: 10px 10px 10px 0;
  max-height: 600px;
  overflow-y: auto;
}
.left-options .options-body .search-opt {
  // border-bottom: 1px solid #5685DC;
  padding-bottom: 15px;
}
.left-options .options-body .schedule-subject:first-child {
  font-size: 14px;
  font-weight: bold;
  margin-left: 0px;
}
/*总课表*/
.left-options .options-body .total-subject {
  margin-left: 20px;
}
/*教学班学生*/
.education-table {
  width: 100%;
  height: 100%;
  overflow: auto;
  border-spacing: 0;
}
.education-table tr {
  border-bottom: 1px solid #ebeef5;
}
.education-table tr:hover {
  background: #f5f7fa;
}
.education-table thead tr th {
  color: #909399;
  min-width: 140px;
  text-align: left;
}
.education-table tbody tr td {
  color: #606266;
  min-width: 140px;
}
.education-table td,
.education-table th {
  padding: 14px 10px;
}
.row-single-tit {
  font-size: 16px;
  font-weight: bold;
  color: #444444;
  margin-right: 15px;
}

.dis-td-bg {
  background: rgb(198, 198, 198) !important;
  border-left-color: rgb(135, 135, 135) !important;
  color: rgb(135, 135, 135) !important;
}

.container {
  width: 100%;
  max-height: 800px;
  padding: 0;
  box-sizing: border-box;
}

#left-div {
  width: 140px;
  float: left;
}

#left-div1 {
  width: 100%;
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
  background: #f9f9f9;
}
#right-div {
  float: left;
  width: calc(100% - 140px);
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
}

#right-table2 {
  overflow: auto;
}
#right-table1 tr th:first-child {
  border-top-left-radius: 0;
}
</style>
