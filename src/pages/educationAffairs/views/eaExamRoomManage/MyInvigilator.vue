<template>
<div class="xy-content-module" id="XyContentModuleReplace">
    <div class="xy-content-body">
        <div class="MyInvigilate_body">
            <div class="fr pr">
                <!-- 学年学期 -->
                <cascader v-model="searchDefaultValue" :data='defaultList' class="fl xy-content-title-search" not-found-text="您还没有学年/学期的信息。" @on-change="cascaderFunDefault"
                          :clearable="false" placeholder="请选择学年/学期" style="width:220px;">
                </cascader>
                <i-select v-model="semesterID" @on-change="SemesterChange" class="fl xy-content-title-search"
                          style="width: 200px;">
                    <i-option v-for="semester in semesterList" :value="semester.ArrangeSupervisorExamID"
                              :key="semester.ArrangeSupervisorExamID" v-cloak>
                        {{ semester.ArrangeSupervisorExamName }}
                    </i-option>
                </i-select>
            </div>
            <header>我的监考</header>
            <div v-if='list.length==0' v-cloak class="no-data-box">
                <img class="no-data-img" src="./Image/no-Data.png" />
                <span class="no-data-text">该搜索条件下没有结果。</span>
            </div>
            <div class="MyInvigilate_body_content" v-else>
                <div v-for='(item,index) in list' :key="index">
                    <p v-text='item.ExamDate' class="MyInvigilate_time"></p>
                    <div class="card_div">
                        <div v-for='(t,i) in item.Subjects' :key="i" class="MyInvigilate_card">
                            <tooltip placement="top" max-width="200">
                                <div class="nowrap MyInvigilate_sub" style="width:200px;" v-cloak>{{t.SubjectName}}</div>
                                <div slot="content">
                                    <div v-cloak>{{t.SubjectName}}</div>
                                </div>
                            </tooltip>
                            <div>
                                <div class="MyInvigilate_room">
                                    <p>监考时间：</p>
                                    <span v-text='item.ExamDate'></span><span v-text='t.SubjectExamTime'></span>
                                </div>
                                <div class="MyInvigilate_room">
                                    <p>考场名称：</p>
                                    <span v-text='t.ExamRoomName'></span>
                                </div>
                                <div class="MyInvigilate_room">
                                    <span>考试地点：</span>
                                    <tooltip placement="top" max-width="200">
                                        <div class="nowrap" style="width:200px;" v-cloak>{{t.ExamRoomAddress}}</div>
                                        <div slot="content">
                                            <div v-cloak>{{t.ExamRoomAddress}}</div>
                                        </div>
                                    </tooltip>
                                </div>
                            </div>
                            <span class="MyInvigilate_num" v-cloak>
                                {{t.StudentCount}}<span>人</span>
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
    name: 'MyInvigilator',
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
        list: [],
        type: 0,
        ServiceDoMainName: '',
        info: ''
      }
    },
    created () {
      this.getFilterData()
    },
    methods: {
      // 选择考试
      SemesterChange (a) {
        this.semesterID = a
        this.GetTeacherExam()
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
            // 默认选取当前选中的学年和学期
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
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeSupervisorExam/GetArrangeSupervisorByTeacher`, {
          AcademicYearID: this.searchDefaultValue[0],
          AcademicSessionID: this.searchDefaultValue[1]
        })
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.semesterList = res.data
            this.semesterID = res.data[0].ArrangeSupervisorExamID
            this.GetTeacherExam()
          } else {
            this.semesterList = []
            this.semesterID = ''
            this.list = []
          }
        }
      },
      // 获取考场
      async GetTeacherExam () {
        if (this.semesterID) {
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/MyInvigilator/GetTeacherExamByID?ArrangeSupervisorExamID=${this.semesterID}`)
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
.MyInvigilate_body {
    margin: 0 auto;
    box-shadow: 0px 4px 12px 0px rgba(202, 202, 202, 0.5);
    padding: 25px 32px;
    font-size: 18px;
    font-weight: bold;
  }
  .MyInvigilate_body>.fr,.no-data-text{
     font-weight: normal;
  }
  .MyInvigilate_body > header {
    color: rgba(255, 255, 255, 1);
    text-align: center;
    line-height: 45px;
    background-image: url(./Image/header.png);
    margin: 80px auto;
    margin-bottom: 63px;
    width: 236px;
    height: 45px;
  }
  .MyInvigilate_body_content > div {
    padding-bottom: 45px;
  }
  .MyInvigilate_time {
    width: 227px;
    height: 38px;
    line-height: 38px;
    color: rgba(255, 255, 255, 1);
    padding-left: 40px;
  }
  .MyInvigilate_num {
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
.MyInvigilate_sub {
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: bold;
}
  .MyInvigilate_room{
    display: flex;
    justify-content:flex-start;
  }
  .MyInvigilate_num > span {
    font-size: 14px;
  }
  .MyInvigilate_body_content > div:nth-child(odd) > p {
    background-image: url(./Image/time_1.png);
  }
  .MyInvigilate_body_content > div:nth-child(odd) .MyInvigilate_card {
    border: 2px solid rgba(120, 180, 253, 1);
  }
  .MyInvigilate_body_content > div:nth-child(odd) .MyInvigilate_num {
    color: rgba(65, 150, 255, 1);
  }
  .MyInvigilate_body_content > div:nth-child(even) > p {
    background-image: url(./Image/time_2.png);
  }
  .MyInvigilate_body_content > div:nth-child(even) .MyInvigilate_card {
    border: 2px solid rgba(133, 226, 187, 1);
  }
  .MyInvigilate_body_content > div:nth-child(even) .MyInvigilate_num {
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
.MyInvigilate_card {
    width: 350px;
    min-height: 142px;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin-bottom: 30px;
    font-size: 14px;
    padding: 10px 10px 0px;
    position: relative;
}
  .MyInvigilate_card > div {
    color: rgba(102, 102, 102, 1);
    font-weight: 400;
  }
  .MyInvigilate_card > div > div {
    margin-bottom: 10px;
  }
  .MyInvigilate_card > div span {
    color: rgba(51, 51, 51, 1);
  }
  .ivu-tooltip-rel{
    margin-bottom: 0px !important;
  }

</style>
