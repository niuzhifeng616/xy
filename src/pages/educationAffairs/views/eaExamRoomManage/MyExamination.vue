<template>
<div class="xy-content-module" id="XyContentModuleReplace">
    <div id="xy-initialize-breadcrumb"></div>
    <!-- <div class="xy-content-title"></div> -->
    <div class="xy-content-body">
        <div class="MyExamRoom_body">
            <div class="fr pr">
                <!-- 学年学期 -->
                <Cascader v-model="searchDefaultValue" :data='defaultList' class="fl xy-content-title-search"
                    not-found-text="您还没有学年/学期的信息。" @on-change="cascaderFunDefault"
                    :clearable="false" placeholder="请选择学年/学期" style="width:220px;">
                </Cascader>
                <Select v-model="semesterID" @on-change="SemesterChange" class="fl xy-content-title-search"
                    style="width: 200px;">
                    <!-- <Option :value="0" :key="01">所有校区</Option> -->
                    <Option v-for="semester in semesterList" :value="semester.ArrangeSupervisorExamID"
                        :key="semester.ArrangeSupervisorExamID" v-cloak>{{ semester.ArrangeSupervisorExamName }}
                    </Option>
                </Select>
            </div>
            <header>我的考场</header>
            <p v-if='list.length>0' class="AdmissionTicketNumber">
                <span v-cloak>准考证号：{{list[0].AdmissionTicketNumber}}</span>
            </p>
            <div v-if='list.length==0' v-cloak class="no-data-box">
                <img class="no-data-img" src="./Image/no-Data.png" />
                <span class="no-data-text">该搜索条件下没有结果。</span>
            </div>
            <div class="MyExamRoom_body_content" v-else>
                <div v-for='(item,index) in list' :key="index">
                    <p v-text='item.ExamDate' class="MyExamRoom_time"></p>
                    <div class="card_div">
                        <div v-for='(t,i) in item.Subjects' class="MyExamRoom_card" :key="i">
                            <tooltip placement="top" max-width="200">
                                <div class="nowrap MyExamRoom_sub" style="width:200px;" v-cloak>{{t.SubjectName}}</div>
                                <div slot="content">
                                    <div v-cloak>{{t.SubjectName}}</div>
                                </div>
                            </tooltip>
                            <div>
                                <div class="MyExamRoom_room">
                                    <p>考试时间：</p>
                                    <span v-text='item.ExamDate'></span><span v-text='t.SubjectExamTime'></span>
                                </div>
                                <div class="MyExamRoom_room">
                                    <p>考场名称：</p>
                                    <span v-text='t.ExamRoomName'></span>
                                </div>
                                <div class="MyExamRoom_room">
                                    <span>考试地点：</span>
                                    <tooltip placement="top" max-width="200">
                                        <div class="nowrap" style="width:200px;" v-cloak>{{t.ExamRoomAddress}}</div>
                                        <div slot="content">
                                            <div v-cloak>{{t.ExamRoomAddress}}</div>
                                        </div>
                                    </tooltip>
                                </div>
                            </div>
                            <span class="MyExamRoom_num" v-cloak>
                                <span style="font-size: 20px;" v-if="t.SeatNumber < 10">0</span>{{t.SeatNumber}}<span>号</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
  export default {
    name: 'MyExamination',
    data () {
      return {
        // 选择的学年学期
        searchDefaultValue: [0, 0],
        // 学年学期下拉列表
        defaultList: [
          {
            value: 0,
            label: '所有学年',
            children: [
              {
                value: 0,
                label: '所有学期'
              }
            ]
          }
        ],
        semesterID: '',
        semesterList: [],
        ielts: '20190010101',
        list: []
      }
    },
    created () {
      this.getFilterData()
    },
    methods: {
      // 选择考试
      SemesterChange (a) {
        this.semesterID = a
        this.GetStudentExamRoom() // 获取考场
      },
      // 获取学年学期
      async getFilterData () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetSessionNodeList`)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            // 生成学年学期列表
            this.defaultList = [...this.defaultList, ...res.data]
            // 选取当前选中的学年和学期
            $.each(res.data, (index, item) => {
              $.each(item.children, (i, t) => {
                if (item.IsCurrent && t.IsCurrent) {
                  this.searchDefaultValue[0] = item.value
                  this.searchDefaultValue[1] = t.value
                }
              })
            })
            if (this.searchDefaultValue[0] !== '' && this.searchDefaultValue[1] !== '') {
              this.GetArrangeSupervisor() // 获取方案
            } else {
              res.data.map(item => {
                if (item.ischild) {
                  this.searchDefaultValue = [item.value, item.children[0].value]
                } else {
                  this.searchDefaultValue = [0, 0]
                }
              })
              this.GetArrangeSupervisor() // 获取方案
            }
          }
        }
      },
      // 选择学年学期
      cascaderFunDefault (value) {
        if (value.length === 2) {
          this.searchDefaultValue = value
        } else {
          this.searchDefaultValue = [value[0], 0]
        }
        this.GetArrangeSupervisor()
      },
      // 根据当前的学年内学期，获取方案
      async GetArrangeSupervisor () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeSupervisorExam/GetArrangeSupervisorByStudent`, {
          AcademicYearID: this.searchDefaultValue[0],
          AcademicSessionID: this.searchDefaultValue[1]
        })
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.semesterList = res.data
            this.semesterID = res.data[0].ArrangeSupervisorExamID
            this.GetStudentExamRoom() // 获取考场
          } else {
            this.semesterList = []
            this.semesterID = ''
            this.list = []
          }
        }
      },
      // 获取考场
      async GetStudentExamRoom () {
        if (this.semesterID) {
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/MyExaminationRoom/GetStudentExamRoomByID?ArrangeSupervisorExamID=${this.semesterID}`)
          this.xy.unloading()
          if (res.success) {
            this.list = res.data
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.MyExamRoom_body {
  margin: 0 auto;
  box-shadow: 0px 4px 12px 0px rgba(202, 202, 202, 0.5);
  padding: 25px 32px;
  font-size: 18px;
  font-weight: bold;
}
.MyExamRoom_body>.fr,.no-data-text{
  font-weight: normal;
}
.MyExamRoom_body>header {
  color: rgba(255, 255, 255, 1);
  text-align: center;
  line-height: 45px;
  background-image: url(./Image/header.png);
  margin: 80px auto;
  margin-bottom: 63px;
  width: 236px;
  height: 45px;
}

.MyExamRoom_body_content>div {
  padding-bottom: 45px;
}

.MyExamRoom_time {
  width: 227px;
  height: 38px;
  line-height: 38px;
  color: rgba(255, 255, 255, 1);
  padding-left: 40px;
}

.AdmissionTicketNumber {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  height: 18px;
  font-size: 18px;
  font-weight: bold;
  color: rgba(102, 102, 102, 1);
}

.MyExamRoom_num {
  display: inline-block;
  width: 84px;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  background: #ecf4ff;
  border-radius: 15px 0px 0px 15px;
  position: absolute;
  top: 10px;
  right: 0px;
  text-align: center;
}

.MyExamRoom_sub {
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 16px;
}
 .MyExamRoom_room {
  display: flex;
  justify-content: flex-start;
}
.MyExamRoom_num>span {
  font-size: 14px;
}

.MyExamRoom_body_content>div:nth-child(odd)>p {
  background-image: url(./Image/time_1.png);
}

.MyExamRoom_body_content>div:nth-child(odd) .MyExamRoom_card {
  border: 2px solid rgba(120, 180, 253, 1);
}

.MyExamRoom_body_content>div:nth-child(odd) .MyExamRoom_num {
  color: rgba(65, 150, 255, 1);
}

.MyExamRoom_body_content>div:nth-child(even)>p {
  background-image: url(./Image/time_2.png);
}

.MyExamRoom_body_content>div:nth-child(even) .MyExamRoom_card {
  border: 2px solid rgba(133, 226, 187, 1);
}

.MyExamRoom_body_content>div:nth-child(even) .MyExamRoom_num {
  color: rgba(79, 150, 35, 1);
}

.card_div {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 50px;
  padding: 0 20px;
}

.card_div:after {
  content: "";
  width: 350px;
}

.MyExamRoom_card {
  width: 350px;
  min-height: 142px;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  margin-bottom: 50px;
  font-size: 14px;
  padding: 22px;
  position: relative;
}

.MyExamRoom_card>div {
  color: rgba(102, 102, 102, 1);
  font-weight: 400;
}

.MyExamRoom_card>div>div {
  margin-bottom: 10px;
}

.MyExamRoom_card>div span {
  color: rgba(51, 51, 51, 1);
}
.ivu-tooltip-rel{
  margin-bottom: 0px !important;
}
</style>
