<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <div class="xy-flex">
        <div style="margin:0 15px 0 10px;">
          <span>学年：</span>
          <Select v-model="yearStr"
            @on-change="yearChange"
            style="width:200px">
            <Option :value="0" key="02">所有学年</Option>
            <Option
              v-for="item in yearData"
              :value="item.value"
              :key="item.label">{{ item.label }}</Option>
          </Select>
        </div>
        <div style="margin-right:15px">
          <span>学期：</span>
          <Select
            v-model="sessionStr"
            @on-change="sessionChange"
            style="width:200px">
            <Option :value="0" key="03">所有学期</Option>
            <Option
              v-for="item in sessionData"
              :value="item.value"
              :key="item.label">
              {{ item.label }}</Option>
          </Select>
        </div>
      </div>
    </div>
    <div class="xy-content-body">
      <ul class="online-select" v-if="crouseList.length > 0">
        <li class="pr card-info xy-flex" v-for="item in crouseList" :key="item.ClassTableID">
          <span class="icon">
            <span class="iconfont">&#xe703;</span>
          </span>
          <div class="info">
            <!-- 抢课式 分层 Status=>  99：未开始  ，9 预览中 ，1 选课中， 0 已结束 -->
            <div class="title">
              {{item.ClassTableName}}
              <div class="status">
                <i class="dot" :style="{'background-color':item.Status === 99 ? 'rgba(0,0,0,0.25)':
                    item.Status === 9 ? '#18B256':
                    item.Status === 1 ? '#4196FF':
                    item.Status === 0 ? '#01216B':''}"></i>
                {{item.StatusText}}
              </div>
            </div>
            <div class="type-a-name">{{item.ClassTableTypeName}}<span>|</span>已选：{{item.SelectCount}}&nbsp;人</div>
            <div class="times">
              <div>
                <span>选课时间</span>
                <div class="notime" v-if="item.FormalChoseStartDate === '' || item.FormalChoseEndDate === ''">未设置</div>
                <div class="time" v-else>{{xy.moment(item.FormalChoseStartDate).format('YYYY/MM/DD HH:mm')}}&nbsp;-&nbsp;{{xy.moment(item.FormalChoseEndDate).format('YYYY/MM/DD HH:mm')}}</div>
              </div>
              <div>
                <span>预览时间</span>
                <div class="notime" v-if="item.SubjectDescriptionStartDate === '' || item.SubjectDescriptionEndDate === ''">未设置</div>
                <div class="time" v-else>{{xy.moment(item.SubjectDescriptionStartDate).format('YYYY/MM/DD HH:mm')}}&nbsp;-&nbsp;{{xy.moment(item.SubjectDescriptionEndDate).format('YYYY/MM/DD HH:mm')}}</div>
              </div>
            </div>
          </div>
          <div class="card-btns pa">
              <div @click="loadSelectCourse(item)" v-if="item.Status == 1 && item.IsComplete == false"><i class="iconfont">&#xe710;</i>去选课</div>
              <div @click="loadSelectCourse(item)" v-if="item.Status == 1 && item.IsComplete == true"><i class="iconfont">&#xe70e;</i>去重选</div>
              <div @click="loadResult(item)" v-if="item.Status == 0"><i class="iconfont">&#xe6e8;</i>查看选课结果</div>
              <div class="select-result-btn" @click="loadSelectResult(item)" v-if="item.Status == 1 && item.IsComplete == true &&item.ClassTableTypeID==4"><i class="iconfont">&#xe6e8;</i>选课结果</div>
              <div @click="loadPreview(item)" v-if="item.Status == 9"><i class="iconfont">&#xe711;</i>去预览</div>
              <div @click="expertStuAutographList(item)" v-if="item.IsComplete&&item.ClassTableTypeID == 10" style="margin-left:10px;"><i class="iconfont">&#xe6f9;</i>确认单</div>
          </div>
        </li>
      </ul>
      <!--暂无数据-->
      <div v-if="crouseList.length == 0 && !isInitial" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">暂无需要选课的排课任务。</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'OnlineCourseList',
    components: {},
    data () {
      return {
        isInitial: true, // 初始loading
        searchName: '',
        year: 0,
        yearID: 0,
        yearStr: 0,
        yearData: [],

        session: 0,
        sessionID: 0,
        sessionStr: 0,
        sessionData: [],
        crouseList: [] // 课程数据
      }
    },
    created () {
      this.getYear()
    },
    methods: {
      // 获取学年
      async getYear () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/YearList`)
        if (res.success) {
          this.yearData = []
          res.data.forEach((item, index) => {
            if (index === 0 || item.IsCurrent) {
              this.yearID = item.ID
              this.yearStr = item.ID
            }
            this.yearData.push({
              value: item.ID,
              label: item.Name
            })
          })
          this.getSession(this.yearID)
        }
      },
      //
      yearChange (value) {
        if (value !== undefined) {
          this.yearID = value
          this.getSession()
        }
      },
      // 获取学期
      async getSession () {
        this.sessionID = 0
        this.sessionStr = 0
        var year = this.xy.getCookie('onlineCourseYear')
        var sessionID = this.xy.getCookie('onlineCourseSessionID')
        if (year !== '' && year !== undefined) {
          this.yearStr = Number(year)
          this.yearID = Number(year)
        }
        if (sessionID !== '' && sessionID !== undefined) {
          this.sessionID = Number(sessionID)
          this.sessionStr = Number(sessionID)
        }

        let res = await this.xy.get(`${this.xyApi}/xy/comm/SessionList`, { yearID: this.yearID })
        if (res.success) {
          this.sessionData = []
          res.data.forEach((item, index) => {
            if (index === 0 || item.IsCurrent) {
              this.sessionID = item.AcademicSessionID
              this.sessionStr = item.AcademicSessionID
            }
            this.sessionData.push({
              value: item.AcademicSessionID,
              label: item.AcademicSessionName
            })
          })
          this.xy.removeCookie('onlineCourseYear')
          this.xy.removeCookie('onlineCourseSessionID')
          this.getTP()
        }
      },
      //
      sessionChange (value) {
        if (value !== undefined) {
          this.sessionID = value
          this.getTP()
        }
      },
      // list
      async getTP () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentOnLineSelectCourse/GetStudentSelectCourse`, {
          yearId: this.yearStr,
          academicSessionID: this.sessionID
        })
        this.isInitial = false
        this.xy.unloading()
        if (res.success) {
          var resData = res.data
          for (var i = 0; i < resData.length; i++) {
            if (resData[i].FormalChoseEndDate !== '' && resData[i].FormalChoseStartDate !== '') {
              resData[i].FormalChoseEndDate = this.xy.moment(resData[i].FormalChoseEndDate).format('YYYY-MM-DD HH:mm')
              resData[i].FormalChoseStartDate = this.xy.moment(resData[i].FormalChoseStartDate).format('YYYY-MM-DD HH:mm')
            }
            if (resData[i].SubjectDescriptionStartDate !== '' && resData[i].SubjectDescriptionEndDate !== '') {
              resData[i].SubjectDescriptionStartDate = this.xy.moment(resData[i].SubjectDescriptionStartDate).format('YYYY-MM-DD HH:mm')
              resData[i].SubjectDescriptionEndDate = this.xy.moment(resData[i].SubjectDescriptionEndDate).format('YYYY-MM-DD HH:mm')
            }
          };
          this.crouseList = resData
        }
      },
      // 确认单
      async expertStuAutographList (item) {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetLayeredSelectProgrammeFlows`, {
          layeredSelectProgrammeID: item.ClassTableID
        })
        if (res.success) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/ExpertStuAutograph?layeredSelectProgrammeID=${item.ClassTableID}&layeredSelectRotationID=${res.data.LayeredSelectRotationID}`)
        }
      },
      // 去选课
      loadSelectCourse: function (item) {
        this.xy.setCookie('onlineCourseYear', this.yearStr)
        this.xy.setCookie('onlineCourseSessionID', this.sessionID)

        if (item.ClassTableTypeID === -1) { // 智能分班
        } else if (item.ClassTableTypeID === 2) { // 套餐
        } else if (item.ClassTableTypeID === 3) { // 走班
        } else if (item.ClassTableTypeID === 4) { // 抢课式
          if (item.SelectCourseMode === 0) { // 简单模式
            this.$router.push({
              path: '/xyhome/onlineChooseCourseTLesson',
              query: {
                classTableID: item.ClassTableID,
                collectionID: item.CollectionID,
                selectCourseMode: item.SelectCourseMode
              }
            })
          }
          if (item.SelectCourseMode === 1) { // 分组模式
            this.$router.push({
              path: '/xyhome/onlineChooseCourseTLessonG',
              query: {
                classTableID: item.ClassTableID,
                collectionID: item.CollectionID,
                selectCourseMode: item.SelectCourseMode
              }
            })
          }
        } else if (item.ClassTableTypeID === 10) { // 分层选课
          this.$store.commit('csmstimetable/setOnlineChooseCourseLayeredItem', item)
          this.$router.push('/xyhome/onlineChooseCourseLayered')
          // this.$router.push('/xyhome/onlineCourseList/layered')
        } else if (item.ClassTableTypeID === 5) {
        }

        // -------------------------------------------------------------------------------
        // if (item.ClassTableTypeID == -1) { // 智能分班
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/SmartDivideClass/OnlineCourseSelect.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID
        //                  }
        //                }
        //   )
        // } else if (item.ClassTableTypeID == 2) { // 套餐
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/RowToChoose/OnlineCourseSelect.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID
        //                  }
        //                }
        //   )
        // } else if (item.ClassTableTypeID == 3) { // 走班
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/GoClass/OnlineCourseSelect.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID
        //                  }
        //                }
        //   )
        // } else if (item.ClassTableTypeID == 4) { // 抢课式
        //   if (item.SelectCourseMode == 0) { // 简单
        //     xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/TakeLessons/OnlineCourseSelect.html', xy.subMenuWebUrl),
        //                  {
        //                    loadParams: {
        //                      classTableID: item.ClassTableID,
        //                      collectionID: item.CollectionID,
        //                      selectCourseMode: item.SelectCourseMode
        //                    }
        //                  })
        //   };
        //   if (item.SelectCourseMode == 1) { // 分组
        //     xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/TakeLessons/OnlineGroupSelect.html', xy.subMenuWebUrl),
        //                  {
        //                    loadParams: {
        //                      classTableID: item.ClassTableID,
        //                      collectionID: item.CollectionID,
        //                      selectCourseMode: item.SelectCourseMode
        //                    }
        //                  })
        //   };
        // } else if (item.ClassTableTypeID == 10) { // 分层选课
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/Layered/OnlineCourseSelect.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    obj: item
        //                  }
        //                }
        //   )
        // } else if (item.ClassTableTypeID == 5) {
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/Volunteer/OnlineCourseSelect.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID
        //                  }
        //                }
        //   )
        // }
      },
      // 去预览
      loadPreview: function (item) {
        this.xy.setCookie('onlineCourseYear', this.yearStr)
        this.xy.setCookie('onlineCourseSessionID', this.sessionID)

        if (item.ClassTableTypeID === 4) { // 抢课式
          this.$router.push({
            path: '/xyhome/onlineChooseCourseTLessonView',
            query: {
              classTableID: item.ClassTableID,
              collectionID: item.CollectionID,
              selectCourseMode: item.SelectCourseMode
            }
          })
        } else if (item.ClassTableTypeID === 5) {
        } else if (item.ClassTableTypeID === 10) { // 分层选课
          this.$store.commit('csmstimetable/setOnlineChooseCourseLayeredItem', item)
          this.$router.push('/xyhome/onlineChooseCourseLayeredView')
          // this.$router.push('/xyhome/onlineCourseList/layeredView')
        }

        // -------------------------------------------------------------------------------
        // if (item.ClassTableTypeID == 4) {
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/TakeLessons/OnlineCoursePreview.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID,

        //                    selectCourseMode: item.SelectCourseMode,
        //                    titleName: '课程预览'
        //                  }
        //                })
        // } else if (item.ClassTableTypeID == 5) {
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/Volunteer/OnlineCoursePreview.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID,
        //                    titleName: '课程预览'
        //                  }
        //                })
        // } else if (item.ClassTableTypeID == 10) { // 分层选课
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/Layered/OnlineCoursePreview.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    obj: item
        //                  }
        //                })
        // }
      },
      // 选课结果
      loadSelectResult: function (item) {
        this.xy.setCookie('onlineCourseYear', this.yearStr)
        this.xy.setCookie('onlineCourseSessionID', this.sessionID)
        if (item.ClassTableTypeID === 2) { // 套餐
        } else if (item.ClassTableTypeID === 4) { // 抢课式
          this.$router.push({
            path: '/xyhome/onlineChooseCourseTLessonResult',
            query: {
              classTableID: item.ClassTableID,
              collectionID: item.CollectionID
            }
          })
        }

        // if (item.ClassTableTypeID == 2) { // 套餐
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/RowToChoose/OnlineCoursePreview.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID,
        //                    titleName: '选课结果'
        //                  }
        //                }
        //   )
        // } else if (item.ClassTableTypeID == 4) { // 抢课式
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/TakeLessons/OnlineCourseResult.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID
        //                  }
        //                }
        //   )
        // }
      },
      // 查看选课结果
      loadResult: function (item) {
        this.xy.setCookie('onlineCourseYear', this.yearStr)
        this.xy.setCookie('onlineCourseSessionID', this.sessionID)
        if (item.ClassTableTypeID === -1) { // 智能分班
        } else if (item.ClassTableTypeID === 2) { // 套餐
        } else if (item.ClassTableTypeID === 3) { // 走班
        } else if (item.ClassTableTypeID === 4) { // 抢课式
          this.$router.push({
            path: '/xyhome/onlineChooseCourseTLessonView',
            query: {
              classTableID: item.ClassTableID,
              collectionID: item.CollectionID,
              selectCourseMode: item.SelectCourseMode
            }
          })
        } else if (item.ClassTableTypeID === 5) {
        } else if (item.ClassTableTypeID === 10) { // 分层选课
          this.$store.commit('csmstimetable/setOnlineChooseCourseLayeredItem', item)
          this.$router.push('/xyhome/onlineChooseCourseLayeredView')
          // this.$router.push('/xyhome/onlineCourseList/layeredView')
        }

        // -------------------------------------------------------------------------------
        // if (item.ClassTableTypeID == -1) { // 智能分班
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/SmartDivideClass/OnlineCoursePreview.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID,
        //                    titleName: '查看选课结果'
        //                  }
        //                }
        //   )
        // } else if (item.ClassTableTypeID == 2) {
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/RowToChoose/OnlineCoursePreview.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID,
        //                    titleName: '查看选课结果'
        //                  }
        //                }
        //   )
        // } else if (item.ClassTableTypeID == 3) {
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/GoClass/OnlineCoursePreview.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID,
        //                    titleName: '查看选课结果'
        //                  }
        //                }
        //   )
        // } else if (item.ClassTableTypeID == 4) {
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/TakeLessons/OnlineCoursePreview.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID,
        //                    selectCourseMode: item.SelectCourseMode,
        //                    titleName: '查看选课结果'
        //                  }
        //                }
        //   )
        // } else if (item.ClassTableTypeID == 5) {
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/Volunteer/OnlineCoursePreview.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    classTableID: item.ClassTableID,
        //                    collectionID: item.CollectionID,
        //                    titleName: '查看选课结果'
        //                  }
        //                }
        //   )
        // } else if (item.ClassTableTypeID == 10) { // 分层选课
        //   xy.http.load(xy.string.format('{0}/View/csmsTimeTable/PC/View/OnlineCourseSelection/Layered/OnlineCoursePreview.html', xy.subMenuWebUrl),
        //                {
        //                  loadParams: {
        //                    obj: item
        //                  }
        //                })
        // }
      }
    }
  }
</script>
<style lang="less" scoped>
  .online-select{
    width: 100%;
    border: none;
    margin-left: 10px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    li.card-info {
      width: 380px;
      margin: 0 20px 20px 0;
      padding: 20px 20px 55px;
      border: 1px solid #E9E9E9;
      .icon{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        margin-right: 6px;
        background: #FFBF00;
        .iconfont{
          font-size: 14px;
          color: #fff;
        }
      }
      .info{
        flex: 1;
        color: rgba(0,0,0,0.65);
        .title{
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: rgba(0,0,0,0.85);
          font-weight: 700;
          .status{
            font-weight: normal;
            color: rgba(0,0,0,0.65);
            .dot{
              display: inline-block;
              width:6px;
              height:6px;
              border-radius:50%;
              margin:0 5px 2px 0;
            }
          }
        }
        .type-a-name{
          margin: 6px 0 15px;
          span{
            color: #E8E8E8;
            margin: 0 10px;
          }
        }
        .times{
          .time{
            color: rgba(0,0,0,0.85);
            margin: 2px 0;
          }
          .notime{
            color: rgba(0,0,0,0.35);
            margin: 2px 0;
          }
        }
      }
      .card-btns{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
        height: 48px;
        background: #F7F9FA;
        border-top: 1px solid #E9E9E9;
        bottom: 0;
        left: 0;
        color: rgba(0,0,0,0.45);
        >div{
          cursor: pointer;
          .iconfont{
            margin-right: 7px;
          }
        }
      }
    }
  }
</style>
