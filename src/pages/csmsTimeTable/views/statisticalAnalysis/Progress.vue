<template>
<div class="xy-content-module">
  <div class="xy-content-title" style="display:flex;justify-content:space-between;">
    <ButtonGroup>
      <Button :class="showPage==='result'?'xy-primary':''" style="margin-right:0;"  @click="changePage('result')">选课结果</Button>
      <Button :class="showPage==='statistical'?'xy-primary':''" @click="changePage('statistical')">选课统计</Button>
    </ButtonGroup>
    <div class="xy-flex">
      <div style="margin-right:15px">
        <span>学年学期：</span>
        <cascader :data="yearSessionData" v-model="yearSession" style="width:200px; display:inline-block" @on-change="cascaderChange">
        </cascader>
      </div>
      <div>
        <span>方案：</span>
        <Select v-model="LayeredSelectProgrammeID" @on-change="programmeChange" style="width:200px" placeholder="请选择方案名称">
          <Option v-for="item in layeredSelectProgrammeData" :value="item.LayeredSelectProgrammeID"
            :key="item.LayeredSelectProgrammeID" >{{ item.LayeredSelectProgrammeName }}</Option>
        </Select>
      </div>
    </div>
  </div>
  <!-- 选课结果 -->
  <result v-if="showPage==='result'"
    ref="result"
    :LayeredSelectProgrammeID="LayeredSelectProgrammeID"
    :LayeredSelectRotationID="LayeredSelectRotationID"></result>
  <!-- 选课统计 -->
  <statistical-analysis v-if="showPage==='statistical'"
    ref="statisticalAnalysis"
    :LayeredSelectProgrammeID="LayeredSelectProgrammeID"
    :LayeredSelectRotationID="LayeredSelectRotationID"></statistical-analysis>
</div>
</template>
<script>
  import Result from './result/Result' // 选课结果
  import StatisticalAnalysis from './statistical/StatisticalAnalysis' // 选课统计

  export default {
    name: 'statProgress',
    components: {
      Result,
      StatisticalAnalysis
    },
    data () {
      return {
        showPage: 'result',
        yearSessionData: [],
        yearSession: [],
        searchText: '',
        layeredSelectProgrammeData: [],
        LayeredSelectProgrammeID: 0,
        LayeredSelectRotationID: 0,

        getAllLayered: false, // 是否获取完方案

        loadAdjust: '' // 选课结果跳转过来的
      }
    },
    created () {
      if (this.LayeredSelectProgrammeID) {
        this.LayeredSelectProgrammeID = this.$route.query.layeredSelectProgrammeID
        this.LayeredSelectRotationID = this.$route.query.layeredSelectRotationID
      }
      this.getSessionNodeList()
    },
    methods: {
      // 学年学期
      async getSessionNodeList () {
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          this.yearSessionData = res.data
          this.yearSession = []
          var index = this.yearSessionData.map((item) => { return item.IsCurrent }).indexOf(true)
          if (index !== -1) {
            this.yearSession.push(this.yearSessionData[index].value)
            var index1 = this.yearSessionData[index].children.map((item) => { return item.IsCurrent }).indexOf(true)
            if (index1 !== -1) {
              this.yearSession.push(this.yearSessionData[index].children[index1].value)
            }
          } else {
            for (var i = 0; i < this.yearSessionData.length; i++) {
              if (this.yearSessionData[i].children.length > 0) {
                this.yearSession = [this.yearSessionData[i].value, this.yearSessionData[i].children[0].value]
                return false
              }
            }
          }
          this.getLayeredSelectProgrammeList()
        }
      },
      // 切换学年学期
      cascaderChange (value, selectedData) {
        this.yearSession = value
        this.LayeredSelectProgrammeID = 0
        this.LayeredSelectRotationID = 0
        this.getLayeredSelectProgrammeList()
      },
      // 查询方案信息
      async getLayeredSelectProgrammeList () {
        this.layeredSelectProgrammeData = []
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredStatisticalAnalysis/GetLayeredSelectProgrammeListByID`, {
          academicSessionID: this.yearSession[1],
          applicationID: this.$store.state.common.menuId.split(',')[0],
          applicationSubMenuID: 0
        })
        if (res.success) {
          if (res.data.length > 0) {
            this.getAllLayered = true
            this.layeredSelectProgrammeData = res.data
            if (this.LayeredSelectProgrammeID === 0) {
              this.LayeredSelectProgrammeID = res.data[0].LayeredSelectProgrammeID
              this.LayeredSelectRotationID = res.data[0].LayeredSelectRotationID
            }
            if (this.showPage === 'result') {
              this.$nextTick(() => {
                this.$refs.result.getClass() // 选课结果数据更新
              })
            } else {
              this.$nextTick(() => {
                this.$refs.statisticalAnalysis.getClass() // 选课统计数据更新
              })
            }
          }
        }
      },
      // 切换方案信息
      programmeChange (val) {
        this.LayeredSelectProgrammeID = this.LayeredSelectProgrammeID || 0
        var id = 0
        this.layeredSelectProgrammeData.map((item) => {
          if (item.LayeredSelectProgrammeID === val) { id = item.LayeredSelectRotationID }
        })
        this.LayeredSelectRotationID = id
        if (this.showPage === 'result') {
          this.$nextTick(() => {
            this.$refs.result.getClass() // 选课结果数据更新
          })
        } else {
          this.$nextTick(() => {
            this.$refs.statisticalAnalysis.getClass() // 选课统计数据更新
          })
        }
      },
      // 加载选课结果/选课统计tab
      changePage (type) {
        this.showPage = type
        if (this.showPage === 'result') {
          this.$nextTick(() => {
            this.$refs.result.getClass() // 选课结果数据更新
          })
        } else {
          this.$nextTick(() => {
            this.$refs.statisticalAnalysis.getClass() // 选课统计数据更新
          })
        }
      }

    }
  }
</script>
<style lang="less" scoped>
.left-data {
  padding: 15px 15px;
  height: 500px;
  overflow: auto;
  border: 2px solid rgba(138, 169, 240, 1);
  border-radius: 8px;
  width: 360px;
}
.selected-class{
  font-size: 12px;
  color:#909399;
}

.right-data {
  margin-left: 20px;
  width: calc(100% - 380px);
}

.select {
  text-align: center;
  font-size: 0;
  /*margin: 10px 0 26px;*/
}

.select span:first-child {
  padding: 6px 25px;
  color: #4285f4;
  border-radius: 15px 0 0 15px;
  font-size: 12px;
  border: 1px solid #4285f4;
  cursor: pointer;
  display: inline-block;
}

.select .active {
  background: #4285f4;
  color: white !important;
}

.select span:last-child {
  padding: 6px 25px;
  color: #4285f4;
  border-radius: 0 15px 15px 0;
  font-size: 12px;
  border: 1px solid #4285f4;
  cursor: pointer;
  display: inline-block;
}

.select span:hover {
  background: #4285f4;
  color: white;
}

/*课程设置*/
// .take-course-subjcet {}

.take-course-subjcet i {
  cursor: pointer;
}

.take-course-content {
  border: 1px solid #eaeaea;
  margin-top: 16px;
}

.content-header {
  width: 100%;
  line-height: 50px;
  height: 50px;
  background: #F5F7FA;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 0 12px;
  overflow: hidden;
  display: block;
}

.content-header input[type='radio'] {
  display: none;
}

.content-header .span-radio {
  width: 14px;
  height: 14px;
  line-height: 1;
  margin-top: -2px;
  margin-right: 5px;
  background-color: #f7f7f7;
  border: 1px solid #c1c1c1;
  border-radius: 100%;
  display: inline-block;
  vertical-align: middle;
}

.content-header input:checked+span:after {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 2px 2px 3px 2px;
  background-color: #4285f4;
  border-radius: 100%;

}

// .content-body {}

.content-body .body-tit {
  padding: 0 12px;
  border-bottom: 1px solid #eaeaea;
}

.content-body .body-tit .crouse-list {
  height: 50px;
  /*line-height:50px;*/
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
}

.content-body .body-tit .crouse-list h3 {
  font-weight: bold;
  font-size: 16px;
  flex: 1;
}

.content-body .body-tit .crouse-children-list li {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eaeaea;
}

.content-body .body-tit .crouse-children-list li:last-child {
  border-bottom: none;
}

.crouse-children-list .course-subjcet-layername {
  font-size: 16px;
}

.crouse-children-list .trash-span i {
  font-size: 20px;
  margin: 0 5px;
  cursor: pointer;
  color: #6392E9;
}

.content-footer {
  height: 50px;
  line-height: 50px;
  color: #4285f4;
  font-size: 16px;
  margin-left: 14px;
}

.content-footer i {
  font-size: 20px;
  margin-right: 5px;
  vertical-align: middle
}

.content-footer span {
  cursor: pointer;
}

.take-course-footer {
  margin: 15px 0;
  /*color:#4285f4;
  cursor:pointer;*/
}

.take-course-footer .add-group {
  margin-bottom: 12px;
  width: 80px;
  margin: 10px auto;
}

.take-course-footer .add-group i {
  font-size: 20px;
}

.take-course-footer .add-group p {
  font-size: 16px;
}

.modal-crouse {
  max-height: 300px;
  overflow-y: scroll;
  padding: 10px 0;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.modal-crouse li {
  cursor: pointer;
  /*padding: 20px 0;*/
  color: #4285f4;
  border: 1px solid #d4e4ff;
  overflow: hidden;
  margin: 10px;
  border-radius: 8px;
  width: 110px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.modal-crouse li:hover {
  color: #fff;
  background-image: -moz-linear-gradient(0deg, rgb(44, 193, 225) 0%, rgb(31, 153, 240) 49%, rgb(18, 113, 255) 100%);
  background-image: -webkit-linear-gradient(0deg, rgb(44, 193, 225) 0%, rgb(31, 153, 240) 49%, rgb(18, 113, 255) 100%);
  background-image: -ms-linear-gradient(0deg, rgb(44, 193, 225) 0%, rgb(31, 153, 240) 49%, rgb(18, 113, 255) 100%);
  background-image: linear-gradient(0deg, rgb(44, 193, 225) 0%, rgb(31, 153, 240) 49%, rgb(18, 113, 255) 100%);
  text-align: center;
  color: #fff;
  transition: all 0.3s;
}

li.is-active {
  color: #fff;
  background-image: -moz-linear-gradient(0deg, rgb(44, 193, 225) 0%, rgb(31, 153, 240) 49%, rgb(18, 113, 255) 100%);
  background-image: -webkit-linear-gradient(0deg, rgb(44, 193, 225) 0%, rgb(31, 153, 240) 49%, rgb(18, 113, 255) 100%);
  background-image: -ms-linear-gradient(0deg, rgb(44, 193, 225) 0%, rgb(31, 153, 240) 49%, rgb(18, 113, 255) 100%);
  background-image: linear-gradient(0deg, rgb(44, 193, 225) 0%, rgb(31, 153, 240) 49%, rgb(18, 113, 255) 100%);
  text-align: center;
  color: #fff;
  transition: all 0.3s;
}

.take-at-most span {
  color: #000;
}

/*选课规则*/
.f14 {
  font-size: 14px;
}

.describe {
  margin: 16px 0;
  color: #8B8B8B;
}

.rule-header {
  border-bottom: 2px solid #6392E9;
  padding-bottom: 5px;
}

.rule-category {
  height: 32px;
}

.rule-category li {
  display: inline-block;
  /*padding:0 8px;*/
  cursor: pointer
}

.rule-category li span {
  color: #444444;
  cursor: pointer;
  height: 38px;
  display: inline-block;
  line-height: 38px;
  padding: 0 13px;
}

.li-active span {
  background: rgba(99, 146, 233, 1);
  border-radius: 8px 8px 0px 0px;
  color: #fff !important;
}

#crouseRules {
  margin-top: 20px;
}

/*选课时间*/
.select-time {
  width: 600px;
  margin: 30px auto 0 auto;
}

.select-time .label {
  margin-bottom: 20px;
}

.select-time .label label {
  font-size: 16px;
  margin-right: 15px;
}

.select-time .note-editor {
  display: inline-block;
}
.label>.noRequired::before{
  content: "*";
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-size: 14px;
  color:transparent;
}
.label>.required::before{
  content: "*";
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-size: 14px;
  color: #ed4014;
}

/*连选设置*/
.EvenSelected-modal {
  font-size: 14px;

}

.EvenSelected-modal .ivu-radio-group {
  height: 50px;
}

.EvenSelected-modal .ivu-radio-wrapper {
  height: auto;
  line-height: 25px;
}

/*限定男女、限定人数*/
.limit-rule .crouse-list {
  margin: 20px 0;
}

.limit-rule .crouse-list li {
  width: 284px;
  height: 96px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 6px 0px rgba(167, 167, 167, 0.4);
  border-radius: 4px;
  margin: 13px;
  padding: 12px 20px;
  display: inline-block;
  position: relative;
}

.limit-rule .crouse-list .name {
  font-size: 14px;
  color: #444;
  font-weight: bold;
  margin-bottom: 20px;
}

.limit-rule .left-line {
  width: 4px;
  height: 42px;
  background: rgba(65, 150, 255, 1);
  border-radius: 2px;
  position: absolute;
  left: 0;
  top: 27px;
}

/*互斥课程*/
.CourseMutex-ul {
  margin: 10px 20px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.CourseMutex-ul li {
  width: 303px;
  height: 144px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(241, 241, 241, 1);
  box-shadow: 0px 1px 3px 0px rgba(170, 170, 170, 0.4);
  border-radius: 12px;
  margin: 20px;
  position: relative;
}

.CourseMutex-li-active {
  border: 1px solid #4196FF!important;
}

.layere-del-icon {
  position: absolute;
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.layere-del-icon:hover {
  background: #fff;
  box-shadow: 0px 2px 8px 0px rgba(165, 165, 165, 0.5);
  border-radius: 4px;
}

.layere-del-icon:hover i {
  color: #FF7E33 !important;
}

.CourseMutex-body {
  height: 88px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

.CourseMutex-body span {
  color: #333333;
  font-weight: bold;
  margin: 0 9px;
  font-size: 14px;
}

.CourseMutex-footer {
  height: 35px;
  line-height: 35px;
  background: #F9FAFB;
  color: #999999;
  cursor: pointer;
  text-align: center;
  border-radius: 0 0 12px 12px;
}

.CourseMutex-footer:hover {
  color: #fff;
  background: #4196FF;
}

.footer-active {
  color: #fff !important;
  background: #4196FF !important;
}

/*连选设置*/
.EvenSelected-ul {
  margin: 10px 20px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.EvenSelected-ul li {
  width: 303px;
  height: 144px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(241, 241, 241, 1);
  box-shadow: 0px 1px 3px 0px rgba(170, 170, 170, 0.4);
  border-radius: 12px;
  margin: 20px;
  position: relative;
}

.EvenSelected-li-active {
    border: 1px solid #4196FF !important;
}

.EvenSelected-body {
  height: 88px;
  padding: 0 14px;
  margin-top: 20px;
}

.EvenSelected-body .body-info {
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.EvenSelected-body .sub-name {
  color: #333333;
  font-weight: bold;
  margin: 0 9px;
  font-size: 14px;
}

.EvenSelected-body .section-num {
  color: #999999;
  font-size: 14px;
}

.EvenSelected-footer {
  height: 35px;
  line-height: 35px;
  background: #F9FAFB;
  color: #999999;
  cursor: pointer;
  text-align: center;
  border-radius: 0 0 12px 12px;
}

.EvenSelected-footer:hover {
  color: #fff;
  background: #4196FF;
}

/* ----------------------------选课统计---------------------- */
/* 筛选提交 */
.progress-title {
  background-color: #fff;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* 单科统计 */
.chooseClass {
  width: 92%;
  margin: 0 auto;
}

.chooseClass .ivu-checkbox-group {
  display: inline-block;
}
/* 组合统计表头无背景色 */
// .thead-bg .ivu-table th{
//   background:transparent !important;
// }
// .ivu-table td,
// .ivu-table th {
//   border-left: 1px solid #EBEEF5;
//   border-right: 1px solid #EBEEF5;
// }

// .ivu-table th {
//   border-top: 1px solid #EBEEF5;
//   background: #f9f9f9;
// }

.selectResultModal .ivu-modal-body {
  min-height: 200px;
}
</style>
