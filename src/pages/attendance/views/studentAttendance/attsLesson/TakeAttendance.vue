<template>
  <div class="xy-content-module">
    <!-- 学生考勤-随堂考勤   // 缺少面包屑 -->
    <div class="xy-content-title clearfix">
        <div class="att-title">
            <div>
              <div style="position: relative;">
                  <Checkbox v-if="status.batchModel"  v-model="checkAll" :indeterminate="checkAll_indeterminate" class="att-checkBox-selectAll" v-on:on-change="change_checkAll">全选</Checkbox>
                  <Button v-if="!status.batchModel" type="primary" class="xy-primary" @click="totalTypeChange">批量操作</Button>
              </div>
                <div class="peopleNum">
                    <span v-cloak>本节课应到 {{shouldArriveNum}} 人，</span>
                    <span v-cloak>正常 {{normal}} 人。</span>
                </div>
            </div>
            <!-- <div class="att-select clearfix">
                <span v-for="(item, index) in attStatus" :key="index" :class="{currents:curStatus == item.StudentAttendanceTypeID}" @click="selectStatus(item.StudentAttendanceTypeID)">{{item.StudentAttendanceTypeName}}</span>
            </div> -->
            <div class="changeStyle">
              <span>考勤类型：</span>
              <Select
                v-model="curStatus"
                @on-change="selectStatus"
                style="width:200px"
                >
                <Option
                  v-for="(item, index) in attStatus"
                  :value="item.StudentAttendanceTypeID"
                  :key="index"
                  >
                  {{ item.StudentAttendanceTypeName }}
                </Option>
              </Select>
            </div>
        </div>
    </div>
    <div class="xy-content-body">
        <div class="clearfix" id="AttsLessonSelect">
            <!--初始loading-->
            <!-- <div v-if="isInitial" class="no-data-box isInitital-opacity">
                <img class="no-data-img" src="@/assets/common/loading.png" />
            </div> -->
            <div v-if="!isInitial && isEmpty" class="no-data-box" v-cloak>
                <img class="no-data-img" src="@/assets/common/nullData.svg" />
                <span class="no-data-text" v-cloak>该搜索条件下没有结果。</span>
            </div>
            <ul v-if="!isEmpty && !isInitial" class="clearfix">
                <li v-for="(item,index) in datatable" :key="index" :class="item.checked ? 'onSel' :  canSel === true ? 'canSel' : ''" class="student-item fl" v-on:click="studentCheckBtn_click(item)">
                    <!-- <Checkbox v-show="status.batchModel" v-model="item.checked" class="student-check" v-on:on-change="studentCheckBtn_click"></Checkbox> -->
                    <div class="one table-pic">
                      <div v-if="!item.Icon" :class="`head-con ${item.Sex === 0 ? 'woman' : 'man'}`">
                        <span class="head-font">
                          {{ xy.showName(item.FullName)}}
                        </span>
                      </div>
                      <img style="width:48px;height:48px;border-radius:50%" v-else :src="item.Icon + '?' + Math.random() * 15">
                      <div class="oneDetails">
                        <div v-cloak>{{item.FullName}}</div>
                        <div v-cloak class="school-number">{{item.UserName}}</div>
                      </div>
                    </div>
                    <i-select
                      class="select-change"
                      :class="{'select-disableSelector': status.batchModel}" :disabled="status.batchModel"
                      v-model="item.TypeID"
                      @on-change="editAttendType($event, item, index)"
                      :placeholder="item.TypeName"
                      v-cloak
                      >
                        <i-option
                          v-for="items in attType_one"
                          :key="items.StudentAttendanceTypeID"
                          v-model="items.StudentAttendanceTypeID"
                          v-cloak
                          >
                          {{ items.StudentAttendanceTypeName }}
                        </i-option>
                    </i-select>
                    <!-- <select class="select-change">
                      <option  v-for="items in attType_list" :key="items.StudentAttendanceTypeID">
                        {{ items.StudentAttendanceTypeName }}
                      </option>
                    </select> -->
                </li>
            </ul>
        </div>
        <div style="position: absolute; left: 0; right: 0; bottom: 20px;" v-if="status.batchModel && !isEmpty">
            <!-- 将考勤状态批量修改为：
            <i-Select style="width:200px" v-on:click="change_batchList" v-model="aatType_value">
                <i-Option v-for="item in attType_list" :value="item.StudentAttendanceTypeID" :key="item.StudentAttendanceTypeID">
                    {{ item.StudentAttendanceTypeName }}
                </i-Option>
            </i-Select> -->
            <div style="text-align: center;">
                <Button class="xy-btn-close"  v-on:click="batchModel_exit">取消</Button>
                <Button class="xy-btn-primary" shape="circle" v-on:click="save_batchList">去修改</Button>
            </div>
        </div>
        <modal width="480" v-model="batchSave" :mask-closable="false" :transfer="false" :title="classNode.CoursePlanTableFullName" v-cloak>
            <div style="min-height: 224px; padding: 44px 28px">
                <label for="">考勤类型：</label>
                <i-select v-model="aatType_value" style="width: 272px;" @click="change_batchList">
                    <i-option
                      v-for="item in attType_list"
                      :value="item.StudentAttendanceTypeID"
                      :key="item.StudentAttendanceTypeID"
                      >
                      {{ item.StudentAttendanceTypeName }}
                    </i-option>
                </i-select>
            </div>
            <div slot="footer">
                <Button class="xy-modal-close" @click="exit_batchExit">取消</Button>
                <Button class="xy-modal-primary" shape="circle" @click="save_batchSave">保存</Button>
            </div>
        </modal>
    </div>
  </div>
 </template>

<script>
  export default {
    name: 'TakeAttendance',
    data () {
      return {
        batchSave: false,
        canSel: false,
        students: [],
        isTypeName: '暂未考勤',
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        classNode: '',
        AMorPMOrderName: '',
        weekdata: '1', // 本周
        completedStatus: false,
        completedText: '',
        btnDisabled: false, // 按钮是否可点击
        datatable: [], // 学生列表
        datatableAll: [], // 学生列表-全部
        normArr: [], // 正常考勤学生
        normal: '', // 正常考勤学生人数
        shouldArriveNum: '', // 应到人数
        curStatus: -2, // 状态筛选默认为全部
        listStyle: 1,
        attStatus: [ // 考勤类型列表：用于展示选项卡
          {
            StudentAttendanceTypeID: -2,
            StudentAttendanceTypeName: '全部'
          }
        ],
        isChange: true,
        status: {
          batchModel: false // 批量修改模式
        },
        checkAll: false, // 全选复选框
        checkAll_indeterminate: false, // 部分选中
        attType_one: [],
        attType_list: [], // 考勤类型列表：用于批量设置
        aatType_value: 1, // 正常
        // apiPath: 'http://192.168.20.35:5011'
        apiPath: ''
      }
    },
    computed: {
    },
    created () {
      this.classNode = JSON.parse(this.$store.state.attendance.item)
      this.AMorPMOrderName = JSON.parse(this.$store.state.attendance.AMorPMOrderName)
      this.apiPath = this.$store.state.apiPath
      this.getType()
    },
    methods: {
      // 获取当前考勤状态
      async getAttStatus () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/AttsLesson/GetAttFinishStatus`, {
            baseID: this.classNode.ClassTableGenerateBaseID
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.completedStatus = res.data
          if (this.completedStatus) {
            this.completedText = '已完成考勤'
            this.btnDisabled = true
          } else {
            this.completedText = '完成考勤'
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 筛选
      selectStatus (value) {
        this.curStatus = value
        this.datatable = []
        this.modalEditAttend()
        // 重置
        this.checkAll = false
        this.checkAll_indeterminate = false
      },
      // 获取课程下学生集合
      async modalEditAttend () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/AttsLesson/GetStudent`, {
            baseID: this.classNode.ClassTableGenerateBaseID,
            type: this.curStatus
          }
        )
        this.isInitial = false
        this.xy.unloading()
        if (res.success) {
          if (res.data !== null && res.data !== undefined && res.data.length > 0) {
            this.isEmpty = false
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].list = []
              // 用于选中
              res.data[i].checked = false
              res.data[i].TypeName = res.data[i].TypeName === '' ? '暂未考勤' : res.data[i].TypeName
            };
            this.datatable = res.data
            if (this.curStatus === -2) {
              this.datatableAll = res.data
              this.shouldArriveNum = this.datatableAll.length
              this.StatisticsInfo() // 获取应到和正常人数
            }

            // for (let i = 0, len = res.data.length; i < len; i++) {
            //   for (let j = 0, jlen = this.attType_list.length; j < jlen; j++) {
            //     if (res.data[i].TypeID !== '' && res.data[i].TypeID !== null && res.data[i].TypeID !== 0 && res.data[i].TypeID !== this.attType_list[j].StudentAttendanceTypeID) {
            //       this.isTypeName = res.data[i].TypeName === '' ? '暂未考勤' : res.data[i].TypeName
            //       this.typeId = res.data[i].TypeID
            //       return
            //     } else {
            //       if (res.data[i].isTypeName === '') {
            //         res.data[i].isTypeName = '暂未考勤'
            //       }
            //     }
            //   }
            // }
          } else {
            this.isEmpty = true
          }
        } else {
          this.isEmpty = true
          this.xy.msgError(res.msg)
        }
      },
      // 获取应到和正常人数
      StatisticsInfo () {
        this.normArr.length = 0 // 重置
        for (var y = 0; y < this.datatableAll.length; y++) {
          if (this.datatableAll[y].TypeID === 1) {
            this.normArr.push(this.datatableAll[y].TypeID)
          }
        }
        this.normal = this.normArr.length
      },
      // 获取考勤类型
      async getType () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/AttsSetting/GetType`, {
            week: this.weekdata
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.attStatus = [ // 重置为默认；考勤类型列表：用于展示选项卡
            {
              StudentAttendanceTypeID: -2,
              StudentAttendanceTypeName: '全部'
            }
          ]
          res.data.forEach((item) => {
            if (item.XYCode !== 'Notyet') {
              this.attType_list.push(item)
              this.attType_one.push(item)
            }
            this.attStatus.push(item)
          })
          for (var k = 0; k < this.datatable.length; k++) {
            this.datatable[k].list = res.data
          }
          this.modalEditAttend()
        } else {
          this.xy.msgError(res.msg)
        }
        this.isChange = true
      },
      // 改变单个学生的考勤状态
      async editAttendType (value, item, index) {
        this.typeId = value
        if (this.status.batchModel || typeof item !== 'object') {
          return
        }
        if (this.isChange) {
          var students = []
          students.push(item.StudentID)
          var params = {
            baseID: this.classNode.ClassTableGenerateBaseID,
            typeID: this.typeId,
            studentIDs: students
          }
          this.xy.loading()
          let res = await this.xy.post(
            this.apiPath + `/api/AttsLesson/SetStudentAttendanceState`, params
          )
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('修改成功。')
            if (this.curStatus !== -2 && value !== this.curStatus) {
              this.datatable.splice(index, 1)
            }
            this.GetStudent()
            this.getAttStatus()
          } else {
            this.xy.msgError(res.msg)
          }
        }
      },
      async GetStudent () {
        let res = await this.xy.get(
          this.apiPath + `/api/AttsLesson/GetStudent`, {
            baseID: this.classNode.ClassTableGenerateBaseID,
            type: -2 // -2代表查询全部状态
          }
        )
        if (res.success) {
          this.datatableAll = res.data
          this.shouldArriveNum = this.datatableAll.length
          this.StatisticsInfo()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 批量修改状态
      totalTypeChange () {
        this.status.batchModel = true
        this.canSel = true
      },
      // 完成考勤
      async attendCompleted () {
        var date = this.xy.moment(this.classNode.ClassDate).format('YYYY-MM-DD')
        var classEndDate = date + this.classNode.EndTime
        if (new Date().getTime() < new Date(classEndDate).getTime()) {
          this.xy.msgError('为保证所有学生数据都已同步，请于下课后再点击此按钮。')
          return false
        }
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/AttsLesson/Completed`, {
            baseID: this.classNode.ClassTableGenerateBaseID
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('已完成本节课考勤工作。')
          this.completedText = '已完成考勤'
          this.btnDisabled = true
          this.modalEditAttend()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 全选 复选框发生变更后
      change_checkAll () {
        var _this = this
        this.checkAll_indeterminate = false
        this.datatable.forEach(function (item) {
          item.checked = _this.checkAll
        })
      },
      // 批量设置状态
      change_batchList (val) {
        this.datatable.forEach(function (item) {
          item.checked = val
        })
      },
      // 退出批量模式
      batchModel_exit (allClear) {
        this.status.batchModel = false
        this.canSel = false
        this.onSel = false
        this.datatable.map((item) => {
          item.checked = false
        })
        // 重置全选状态
        if (allClear) {
          this.checkAll = false
          this.checkAll_indeterminate = false
        }
      },
      // 提交批量修改
      save_batchList () {
        this.students = []
        this.datatable.forEach((item) => {
          if (item.checked) {
            this.students.push(item.StudentID)
          }
        })
        if (this.students.length === 0) {
          this.xy.msgError('尚未选择学生。')
          return
        }
        this.batchSave = true
      },
      exit_batchExit () {
        this.onSel = false
        this.canSel = false
        this.batchSave = false
      },
      save_batchSave () {
        console.log(this.listStyle)
        let a = this.students
        this.batchSave = false
        this.onSel = false
        this.canSel = false
        this.submit_attList(a)
      },
      // 提交修改
      async submit_attList (students) {
        var _this = this
        var params = {
          baseID: this.classNode.ClassTableGenerateBaseID,
          typeID: this.aatType_value,
          studentIDs: students
        }
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/AttsLesson/SetStudentAttendanceState`, params
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('考勤成功。')
          _this.batchModel_exit(true)
          // 刷新当前状态列表
          _this.modalEditAttend()
          // 刷新所有学生的状态来更新应到和正常人数，与modalEditAttend不重叠
          let res = await this.xy.get(
            this.apiPath + `/api/AttsLesson/GetStudent`, {
              baseID: _this.classNode.ClassTableGenerateBaseID,
              type: -2 // -2代表查询全部状态
            }
          )
          this.xy.unloading()
          if (res.success) {
            _this.datatableAll = res.data
            _this.shouldArriveNum = _this.datatableAll.length
            _this.StatisticsInfo()
          } else {
            this.xy.msgError(res.msg)
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 学生选择
      studentCheckBtn_click (item) {
        if (!this.status.batchModel) {
          return false
        }
        if (item) {
          item.checked = !item.checked
        }
        var selected = 0
        var notSelected = 0
        var l = this.datatable.length
        this.datatable.forEach(function (item) {
          if (item.checked) { selected++ } else { notSelected++ }
        })
        if (l === selected) {
          this.checkAll = true
          this.checkAll_indeterminate = false
        } else if (l === notSelected) {
          this.checkAll = false
          this.checkAll_indeterminate = false
        } else {
          this.checkAll_indeterminate = true
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.selected {
  cursor: pointer;
}
.canSel {
  background: url(../img/canSel.png) no-repeat top right;
  cursor: pointer;
}
.onSel {
  background: url(../img/onSel.png) no-repeat top right;
  cursor: pointer;
}
.att-title {
    align-items: flex-start;
    justify-content: space-between;
    display: flex;
    display: -webkit-flex;
}
.peopleNum {
  margin: 14px 0;
  line-height: 20px;
  color: rgba(0,0,0,0.45);
  font-size: 14px;
}
.changeStyle {
  display: flex;
  align-items: center;
  margin-right: 4px;
  color: rgba(0,0,0,0.85);
  span {
    font-size: 14px;
    width: 70px;
    line-height: 22px;
    display: inline-block;
  }
}
.att-select {
    font-size: 14px;
    color: #444;
}
.att-select span {
    padding: 0 3px;
    display: block;
    float: left;
    border-bottom: none;
    margin-right: 40px;
    line-height: 35px;
    cursor:pointer;
    border-bottom: 4px solid transparent;
}
.att-select span.currents {
    color: #4196FF;
    border-bottom: 4px solid #4196FF;
}
.attend-table {
    width: 100%;
    margin-bottom: 15px;
}
    .attend-table > thead > tr > th {
        height: 62px;
        white-space: nowrap;
        overflow: hidden;
        background-color: #f2f3f5;
        border: 1px solid #fff;
    }
.attend-table > tbody > tr > td{
    border: 1px solid #e8eaec;
    text-align:center;
    padding-top:0;
    padding-bottom:0;
    height:58px;
}
.attend-table > tbody > tr > td>div{
    padding: 10px 10px;
    background: #eee;
    border-radius: 3px;
    cursor: pointer;
    color:#333;
    overflow: hidden;
    transition: all 0.3s;
}
.attend-table > tbody > tr > td>div:hover{
    transition:all 0.3s;
    background: #ccc;
}
.attend-table > tbody > tr > td  span{
    display:inline-block;
    width:100%;
}

/* 全选复选框 */
.att-checkBox-selectAll {
    position: absolute;
    top: -10px;
    left: -5em;
}

.examina-table{
    width:100%;
    margin-bottom:15px;
}
.examina-table > thead > tr > th{
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #f8f8f9;
    border:1px solid #e8eaec;
}
.examina-table > tbody > tr > td > .sort-room{
    display:block;
}
.examina-table > tbody > tr > td > .sort-address{
    display:block;
}
.examina-table > tbody > tr > td{
    min-width: 0;
    height: 48px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    border: 1px solid #e8eaec;
    padding:0 18px;
    text-align:center;
}
.examina-table > tbody > tr > .examin-td{
    min-width: 0;
    height: 48px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    border: 1px solid #e8eaec;
}
.examina-table > tbody > tr > .examin-td > span{
    display:block;
    margin: 5px 0;
}
.examina-table > tbody > tr > .examin-td > .own-teacher > span{
    display: inline-block;
    padding: 1px 7px;
    background: #2196F3;
    color: #fff;
    border-radius: 3px;
}
.xy-content-body .attend-box .identity-page-module-left-header {
    position: relative;
    height: 60px;
    line-height: 60px;
    padding: 0px 10px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    background-color: #6E8AD0;
    color: #fff;
    overflow: hidden;
}
.identity-page-module-left-header .circle-1 {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: #5877C6;
    position: absolute;
    top: -90px;
    left: 100px;
}

.identity-page-module-left-header .circle-1-1 {
    width: 95px;
    height: 95px;
    border-radius: 50%;
    background: #6683CE;
    margin: 18px auto;
    text-align: center;
}

.identity-page-module-left-header .circle-1-2 {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    background: #7894DB;
    margin-top: 10px;
    display: inline-block;
}

.identity-page-module-left-header .circle-2 {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #5877C6;
    position: absolute;
    top: 32px;
    left: 300px;
    z-index: 1;
}

.identity-page-module-left-header .circle-2-1 {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #6683CE;
    margin: 8px auto;
    text-align: center;
}

.identity-page-module-left-header .circle-2-2 {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #7894DB;
    margin-top: 5px;
    display: inline-block;
}

.identity-page-module-left-header .circle-3 {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #5877C6;
    position: absolute;
    top: -56px;
    right: -20px;
}

.identity-page-module-left-header .circle-3-1 {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #6683CE;
    margin: 9px auto;
    text-align: center;
}

.identity-page-module-left-header .circle-3-2 {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #7894DB;
    margin-top: 12px;
    display: inline-block;
}
/*随堂考勤详情*/
.student-item {
    position: relative;
    width: 300px;
    height: 160px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #e9e9e9;
    border-radius: 2px;
}
.student-item .one {
  padding: 24px 0 0 20px;
  display: flex;
  align-items: center;
}
.student-item .table-pic .head-con {
  width: 48px;
  height: 48px;
  font-size: 14px;
  line-height: 48px;
}
.student-item .oneDetails {
  margin-left: 14px;
}
.oneDetails div:nth-child(1) {
  color: rgba(0,0,0,0.85);
  line-height: 24px;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}
.oneDetails div:nth-child(2) {
  color: rgba(0,0,0,0.45);
  font-size: 14px;
  line-height: 22px;
}
.student-item .select-bg {
    background: #E6EFFB;
    position:relative;
    height:53px;
}

.student-check {
    position: absolute;
    top: 18px;
    left: 18px;
}

/deep/ .select-change .ivu-select-selection {
    font-size: 14px;
    height: 48px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0;
    border: 0;
    border-top: 1px solid #e9e9e9;
    border-radius: 0px 0px 2px 2px;
    background: #f7f9fa;
    transition: none !important;
    box-shadow: 0 0 black;
}
/deep/ .select-change .ivu-select-selection .ivu-select-selected-value {
  text-align: center;
  line-height: 48px;
}
/deep/ .select-change .ivu-select-selection .ivu-select-placeholder {
  text-align: center;
  line-height: 48px;
}
/deep/ .select-change .ivu-select-dropdown-list {
  width: 130px;
  background: #ffffff;
  border-radius: 0px 0px 4px 4px;
  box-shadow: 0px 4px 6px 0px rgba(0,0,0,0.1);
  height: 100%;
}
/deep/ .select-change .ivu-select-dropdown {
  min-width: 0 !important;
  width: 130px !important;
  left: 168px !important;
  overflow-x: hidden;
  overflow-y: auto;
}
/deep/ .select-change .ivu-select-dropdown-list .ivu-select-item {
  text-align: center;
}
/deep/ .select-change .ivu-icon-ios-arrow-down:before {
  content: "\f3e7";
}
/deep/ .select-change .ivu-select-arrow {
  transition: none !important;
}
</style>
