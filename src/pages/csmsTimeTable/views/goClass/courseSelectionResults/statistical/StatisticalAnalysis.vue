<!-- 选课统计 -->
<template>
  <div class="xy-content-body">
    <div class="progress-title">
      <Button class="xy-info"
              @click="exportFile">导出</Button>
      <!-- 已选未选班级 -->
      <div style="margin:0 auto ;display: flex;justify-content: center;">
        <button-group size='small'>
          <Button :class="selectNum===0?'xy-primary':''"
                  @click="loadComplete(0)"
                  style="margin-right:0">单科统计</Button>
          <Button :class="selectNum===1?'xy-primary':''"
                  @click="loadComplete(1)"
                  style="margin-right:0">分层统计</Button>
          <Button :class="selectNum===2?'xy-primary':''"
                  @click="loadComplete(2)">组合统计</Button>
        </button-group>
      </div>
      <div>
        <dropdown @on-click="filterFun"
                  trigger="click"
                  v-if='selectNum===2'>
          <Button class="xy-info">
            更多
            <icon type="ios-arrow-down"></icon>
          </Button>
          <dropdown-menu slot="list">
            <dropdown-item name="1">筛选课程</dropdown-item>
            <dropdown-item name="2">筛选班级</dropdown-item>
          </dropdown-menu>
        </dropdown>
        <Button class="xy-primary"
                @click="modalShow"
                v-else>筛选班级</Button>
        <Button @click="goback"
                style="margin: 0 5px;">返回</Button>
      </div>
    </div>
    <!-- 已选择班级 -->
    <div style="margin-bottom:10px ;"
         v-if='showClass.length>0'>
      <Alert show-icon
             closable> <span> 已选择班级：</span><span v-for="(i, index) in showClass"
              :key='index'>{{ i.StudentOrganizationFullName
          }}{{ index === showClass.length - 1 ? "" : "、" }}</span>。</Alert>
    </div>
    <router-view :classOrganizationIDs='StudentOrganizationIDS'
                 @isExportFun='isExportFun'
                 :filterSubjectModal='filterSubjectModal'
                 @filterSubjectFun='filterSubjectFun'></router-view>
    <!-- 筛选班级 -->
    <Modal v-model="modal"
           :transfer="false"
           title="筛选班级"
           :mask-closable="false"
           :closable="false"
           width=550>
      <div v-if='classData.length'
           class="class-filter">
        <Checkbox :indeterminate="indeterminate"
                  :value="checkedAll"
                  @click.prevent.native="handleCheckAll">全选</Checkbox>
        <CheckboxGroup v-model="classOrganizationIDs"
                       @on-change="checkAllGroupChange"
                       style="margin-top: 10px;">
          <Checkbox style="padding: 10px 0 10px 0;"
                    v-for="item in classData"
                    :label="item.StudentOrganizationID"
                    :key="item.StudentOrganizationID"> {{ item.StudentOrganizationFullName }}({{ item.StuCount }}人)</Checkbox>
        </CheckboxGroup>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="sure">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'statStatisical',
    props: {
      LayeredSelectProgrammeID: {
        type: Number
      // required: true
      },
      LayeredSelectRotationID: {
        type: Number
      // required: true
      }
    },
    data () {
      return {
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        isHaveData: false, // 是否有数据可以导出
        selectNum: 0,
        classOrganizationIDs: [], // 已选择班级的id
        StudentOrganizationIDS: [], // 组件需要的参数
        filterSubjectModal: false, // 筛选课程
        SubjectList: [], // 组合统计-筛选的课程
        // 筛选班级
        modal: false,
        showClass: [],
        classData: [],
        checkedAll: false, // 全选
        indeterminate: false
      }
    },
    created () {
      this.getClass()
    },
    methods: {
      // 获取所有的班级
      async getClass () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/GetMovingClassListByID`, {
          classTableID: this.classTableID
        })
        if (res.success) {
          if (res.data.length > 0) {
            res.data.map((item) => {
              this.classOrganizationIDs.push(item.StudentOrganizationID)
              this.StudentOrganizationIDS.push(item.StudentOrganizationID)
              this.showClass.push(item)
            })
            this.checkedAll = true
            this.classData = res.data
          }
        }
        this.xy.unloading()
      },
      // 选课统计下tab的三个页面切换
      loadComplete (type) {
        this.selectNum = type // type变化后切换页面
        this.$store.commit('common/getParam', { step: 2 })
        let url = ['single', 'layered', 'combination']
        this.$router.push({
          path: `/xyhome/goClassStepsHeader/goStatisticalAnalysis/${url[type]}`,
          query: this.$store.state.common.menuInfo
        })
      },
      isExportFun (val) {
        this.isHaveData = val
      },
      exportFile () {
        if (!this.isHaveData) {
          return this.xy.msgError('暂无导出结果。')
        }
        let params = {
          classTableID: this.classTableID,
          studentOrganizationIDS: this.classOrganizationIDs
        }
        if (this.selectNum === 0) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/ExpertMovingClasssingleSelect`, params)
        } else if (this.selectNum === 1) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/ExpertMovingClassGroupSelectInfo`, params)
        } else if (this.selectNum === 2) {
          var obj = Object.assign(params, {
            SubjectList: this.SubjectList
          })
          var str = ''
          if (obj.SubjectList.length > 0) {
            var arr = obj.SubjectList
            arr.map(function (item, index) {
              str += item.AID + ',' + item.Type + ((index !== arr.length - 1) ? '|' : '')
            })
          }
          obj.SubjectList = str
          this.xy.downFile(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/ExpertMovingClassGroupCombinationSelectInfo`, obj)
        }
      },
      modalShow () {
        this.modal = true
      },
      // ------------------------筛选班级start------------------------------------
      filterFun (res) {
        if (res === '1') {
          this.filterSubjectModal = true
        } else {
          this.modal = true
        }
      },
      filterSubjectFun (val, arr) {
        this.filterSubjectModal = val
        this.SubjectList = arr || []
      },
      sure () {
        if (!this.classData.length) {
          this.modal = false
          return false
        }
        if (!this.classOrganizationIDs.length) {
          this.xy.msgError('请选择班级。')
          return false
        }
        this.StudentOrganizationIDS = [...this.classOrganizationIDs]
        this.showClass = []
        if (this.classOrganizationIDs.length > 0) {
          this.classData.map(pItem => {
            this.classOrganizationIDs.map(item => {
              if (pItem.StudentOrganizationID === item) {
                this.showClass.push(pItem)
              }
            })
          })
        }
        this.modal = false
      },
      cancel: function () {
        this.modal = false
        if (!this.classData.length) {
          return false
        }
        if (this.showClass.length > 0) {
          this.classOrganizationIDs = []
          this.showClass.map(pItem => {
            this.classData.map(item => {
              if (pItem.StudentOrganizationID === item.StudentOrganizationID) {
                this.classOrganizationIDs.push(pItem.StudentOrganizationID)
              }
            })
          })
          if (this.classOrganizationIDs.length === this.classData.length && this.classData.length) { // 全部选中
            this.checkedAll = true
            this.indeterminate = false
          } else if (this.classOrganizationIDs.length > 0 && this.classOrganizationIDs.length < this.classData.length) { // 选中一些
            this.indeterminate = true
            this.checkedAll = false
          }
        } else {
          this.checkedAll = false
          this.indeterminate = false
        }
      // this.StudentOrganizationIDS = [...this.classOrganizationIDs]
      },
      // 筛选班级-----------全选
      handleCheckAll () {
        if (this.indeterminate) {
          this.checkedAll = false
        } else {
          this.checkedAll = !this.checkedAll
        }
        this.indeterminate = false
        if (this.checkedAll) {
          this.classOrganizationIDs = []
          this.classData.map(item => {
            this.classOrganizationIDs.push(item.StudentOrganizationID)
          })
        } else {
          this.classOrganizationIDs = []
        }
      },
      checkAllGroupChange (data) {
        if (data.length === this.classData.length) {
          this.indeterminate = false
          this.checkedAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkedAll = false
        } else {
          this.indeterminate = false
          this.checkedAll = false
        }
      },
      goback () {
        this.$store.commit('common/getParam', { step: 2 })
        this.$router.push({
          path: `/xyhome/goClassStepsHeader/classSet`,
          query: this.$store.state.common.menuInfo
        })
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
.selected-class {
  font-size: 12px;
  color: #909399;
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
  background: #f5f7fa;
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

.content-header input:checked + span:after {
  content: '';
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
  color: #6392e9;
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
  vertical-align: middle;
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
  background-image: -moz-linear-gradient(
    0deg,
    rgb(44, 193, 225) 0%,
    rgb(31, 153, 240) 49%,
    rgb(18, 113, 255) 100%
  );
  background-image: -webkit-linear-gradient(
    0deg,
    rgb(44, 193, 225) 0%,
    rgb(31, 153, 240) 49%,
    rgb(18, 113, 255) 100%
  );
  background-image: -ms-linear-gradient(
    0deg,
    rgb(44, 193, 225) 0%,
    rgb(31, 153, 240) 49%,
    rgb(18, 113, 255) 100%
  );
  background-image: linear-gradient(
    0deg,
    rgb(44, 193, 225) 0%,
    rgb(31, 153, 240) 49%,
    rgb(18, 113, 255) 100%
  );
  text-align: center;
  color: #fff;
  transition: all 0.3s;
}

li.is-active {
  color: #fff;
  background-image: -moz-linear-gradient(
    0deg,
    rgb(44, 193, 225) 0%,
    rgb(31, 153, 240) 49%,
    rgb(18, 113, 255) 100%
  );
  background-image: -webkit-linear-gradient(
    0deg,
    rgb(44, 193, 225) 0%,
    rgb(31, 153, 240) 49%,
    rgb(18, 113, 255) 100%
  );
  background-image: -ms-linear-gradient(
    0deg,
    rgb(44, 193, 225) 0%,
    rgb(31, 153, 240) 49%,
    rgb(18, 113, 255) 100%
  );
  background-image: linear-gradient(
    0deg,
    rgb(44, 193, 225) 0%,
    rgb(31, 153, 240) 49%,
    rgb(18, 113, 255) 100%
  );
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
  color: #8b8b8b;
}

.rule-header {
  border-bottom: 2px solid #6392e9;
  padding-bottom: 5px;
}

.rule-category {
  height: 32px;
}

.rule-category li {
  display: inline-block;
  /*padding:0 8px;*/
  cursor: pointer;
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
.label > .noRequired::before {
  content: '*';
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-size: 14px;
  color: transparent;
}
.label > .required::before {
  content: '*';
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
  border: 1px solid #4196ff !important;
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
  color: #ff7e33 !important;
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
  background: #f9fafb;
  color: #999999;
  cursor: pointer;
  text-align: center;
  border-radius: 0 0 12px 12px;
}

.CourseMutex-footer:hover {
  color: #fff;
  background: #4196ff;
}

.footer-active {
  color: #fff !important;
  background: #4196ff !important;
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
  border: 1px solid #4196ff !important;
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
  background: #f9fafb;
  color: #999999;
  cursor: pointer;
  text-align: center;
  border-radius: 0 0 12px 12px;
}

.EvenSelected-footer:hover {
  color: #fff;
  background: #4196ff;
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
.class-filter {
  min-height: 200px;
  max-height: 500px;
  overflow: auto;
}
</style>
