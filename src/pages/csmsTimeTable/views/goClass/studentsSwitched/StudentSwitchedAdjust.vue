<template>
  <!-- 10.学生调班-调班 -->
  <div class="xy-content-body" id="StepsHeader">
    <div class="clearfix">
        <div class="fl">
            <Button class="xy-info" @click="back">返回</Button>
            <Button  class="xy-primary" @click="unity" v-if="isOperation1 === 0">统一设班级</Button>
        </div>
        <Alert show-icon class="fl" style="margin-left: 10px;">括号中数字指：“实际班额/最大班额”或“实际班额/最大班额/个人成绩/班平均分”。</Alert>
    </div>

    <div v-if="resultData.length >0">
        <h3 style="font-size:16px;font-weight:bold;margin-top:10px;">{{fullName}}的分班结果：</h3>
        <ul class="result-list">
            <li v-for="result in resultData" :key="result.Subject">
                <div class="box-header">
                    <div class="header-icon">
                        <Icon type="ios-paper-outline" size="18" color="#4196FF" />
                    </div>
                    <div class="sub-name">{{result.Subject}}</div>
                </div>
                <div class="box-body">
                    <div class=""
                        :title="result.ClassName"
                         v-if="result.CoursePlanLevelID > 0">
                        {{result.ClassName}}{{result.Info}}
                    </div>
                    <div v-else style="font-size:14px;color:#999;font-weight:normal">暂无班级。</div>
                </div>
                <div class="box-footer"  v-if="result.CoursePlanLevelID > 0">
                    <div class="group-one del-btn"
                         @click="del(result.CoursePlanLevelID)">
                        <Icon type="ios-trash-outline" />
                        <span>移除</span>
                    </div>
                    <div style="width:2px;height:18px;background:#E5E5E5"></div>
                    <div class="group-one edit-btn"
                          @click="addClass(0,result.CoursePlanLevelID,result.CoursePlanID)">
                        <Icon type="ios-create-outline" />
                        <span>调班</span>
                    </div>
                </div>
                <div class="box-footer" v-else style="justify-content:center">
                    <div class="group-one edit-btn"
                         style="width:100%"
                         v-if="isOperation1 === 0"
                         @click="addClass(1,result.CoursePlanLevelID,result.CoursePlanID)">
                        <Icon type="ios-add-circle-outline" />
                        <span>添加班级</span>
                    </div>
                </div>
            </li>
        </ul>

        <div style="margin-top:30px;" v-if="removeData.length > 0">
            <h3 style="font-size:14px;font-weight:bold">更改选课后需要删除的分班结果：</h3>
            <p style="color:#ddd">以下是已不选但仍保留的分班结果，如果不删除将生成到学生个人课表中，请点击“删除图标”删除</p>
            <ul class="result-list">
                <li v-for="remove in removeData" :key="remove.SubjectName">
                    <div class="box-header">
                        <div class="header-icon">
                            <Icon type="ios-paper-outline" size="18" color="#4196FF" />
                        </div>
                        <div class="sub-name">{{remove.SubjectName}}</div>
                    </div>
                    <div class="box-body">
                        <div>{{remove.Name}}{{remove.Info}}</div>
                    </div>
                    <div class="box-footer" v-if="isOperation1 === 0">
                        <div class="group-one del-btn" style="width:100%;"
                             @click="del(remove.CoursePlanLevelID)">
                            <Icon type="ios-trash-outline" />
                            <span>移除</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <div v-if="resultData.length === 0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">
            暂无“{{fullName}}”的生成结果。
        </span>
    </div>
    <!-- 调整班级 -->
    <modal v-model="modalAddClass"
           title="调整班级"
           v-if="isOperation1 === 0"
           :mask-closable="false"
           width="564"
           :transfer="false">
        <div style="font-size:14px;max-height:450px;overflow-y:scroll;">
            <ul class="modal-crouse" v-if="selectData.length > 0">
                <li class="crouse"
                    v-for="subject in selectData"
                    @click="modalSelect($event,subject.CoursePlanLevelID)" :key="subject.CoursePlanLevelID">
                    <h3 :title="subject.ClassName">{{subject.ClassName}}</h3>
                    <p>{{subject.Info}}</p>
                    <p :title="subject.Teachers">{{subject.Teachers}}</p>
                </li>
            </ul>
            <div v-else class="modal-null">
                <img class="img" src="@/assets/common/nullData.svg" alt="图片"/>
                <span class="text">
                    还没有调班的信息。
                </span>
            </div>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalAddClass = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="addClassSubmit">确定</Button>
        </div>
    </modal>

    <!-- 统一调整结果 @on-ok="unitySubmit"-->
    <modal v-model="modalunity"
           title="统一调整结果"
           footer-hide
           v-if="isOperation1 === 0"
           :mask-closable="false"
           :transfer="false"
           :width="1200">
        <div style="font-size:14px;height:450px;overflow-y:scroll;">
            <div v-if="groupClass.length > 0">
                <table class="query-table">
                    <thead>
                        <tr>
                            <th v-for="item in subjects" :key="item.SubjectName">{{item.SubjectName}}</th>
                            <th>选择</th>
                        </tr>
                    </thead>
                    <tbody v-if="groupClass.length > 0">
                        <tr v-for="(crouse, i) in groupClass" :key="i">
                            <td v-for="sele in crouse.ClassInfo" :key="sele.Name">
                                <div class="td-min">
                                    <b>{{sele.Name}}</b>({{sele.SelectCount}}/{{sele.StudentLimitation}}<span v-if="sele.IsSelectScore">/{{sele.Score}}/{{sele.AverageScore}}</span>)
                                </div>
                            </td>
                            <td>
                                <Button  class="xy-info" @click="unitySubmit(crouse)">选择</Button>
                            </td>
                        </tr>
                        <tr v-if="groupClass.length === 0">
                            <td :colspan="subjects.length+1">还没有调班的信息。</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="groupClass.length === 0" class="modal-null" style="margin-top: 80px;">
                <img class="img" src="@/assets/common/nullData.svg" alt="图片"/>
                <span class="text">
                    暂无相关信息。
                </span>
            </div>
        </div>
    </modal>
</div>

</template>
<script>

  export default {
    components: {

    },
    name: 'StudentSwitchedAdjust',
    data () {
      return {
        isOperation1: this.$store.state.csmstimetable.classComValKW.base.isOperation1,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,

        resultData: [],
        removeData: [],
        modalAddClass: false,
        modalSelectVal: '',
        resultVal: '',
        selectData: [],
        tag1: '',

        // 上一页列表数据
        Adjust: {},
        sloverResultCollectionID: 0,
        studentID: 0,
        fullName: '',

        // 统一调整
        modalunity: false,
        groupClass: [],
        subjects: [],
        selectSumList: []
      }
    },

    created () {
      this.Adjust = JSON.parse(this.$store.state.csmstimetable.studentAdjust).Adjust
      this.sloverResultCollectionID = JSON.parse(this.$store.state.csmstimetable.studentAdjust).Adjust.sloverResultCollectionID || 0
      this.studentID = JSON.parse(this.$store.state.csmstimetable.studentAdjust).Adjust.studentID || 0
      this.fullName = JSON.parse(this.$store.state.csmstimetable.studentAdjust).Adjust.FullName || ''
    },
    mounted () {
      this.getTP()
    },
    methods: {
      // 获取列表
      async getTP () {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID,
          studentid: this.studentID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassStudentChangeClass/GetStudentCourseResultList`, params)
        this.xy.unloading()
        if (res.success) {
          this.resultData = res.data.Result
          this.removeData = res.data.RemoveData
        }
      },
      // 添加班级
      async addClass (tag, coursePlanLevelID, coursePlanID) {
        this.tag1 = ''
        this.tag1 = tag
        this.resultVal = ''
        this.resultVal = coursePlanLevelID
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID,
          coursePlanID: coursePlanID,
          coursePlanLevelID: coursePlanLevelID,
          studentID: this.studentID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassStudentChangeClass/GetStudentSelectList`, params)
        this.xy.unloading()
        if (res.success) {
          this.selectData = res.data
          this.modalAddClass = true
        }
      },
      modalSelect (event, val) {
        let targe = $(event.currentTarget)
        targe.siblings('.crouse').removeClass('is-active')
        targe.addClass('is-active')
        this.modalSelectVal = ''
        this.modalSelectVal = val
      },
      // 保存
      async addClassSubmit () {
        if (this.modalSelectVal === '') {
          this.xy.msgError('请选择一个班级。')
          return false
        }
        if (this.tag1 === 0) {
          this.xy.loading()
          let params = {
            ClassTableID: this.classTableID,
            SloverResultCollectionID: this.sloverResultCollectionID,
            CoursePlanLevelID: this.resultVal,
            StudentID: this.studentID
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassStudentChangeClass/UnSelectClass`, params)
          this.xy.unloading()
          if (res.success) {
            this.postSelectClass()
          }
        } else {
          this.postSelectClass()
        }
      },
      // 保存选中的课
      async postSelectClass () {
        this.xy.loading()
        let params = {
          ClassTableID: this.classTableID,
          SloverResultCollectionID: this.sloverResultCollectionID,
          CoursePlanLevelID: this.modalSelectVal,
          StudentID: this.studentID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassStudentChangeClass/SelectClass`, params)
        this.xy.unloading()
        if (res.success) {
          $('.crouse').removeClass('is-active')
          this.xy.msgSuc('调整成功。')
          this.modalAddClass = false
          this.modalSelectVal = ''
          this.getTP()
        }
      },
      // 删除
      del (coursePlanLevelID) {
        let that = this
        that.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要把学生从该班移除吗？',
          async onOk () {
            that.xy.loading()
            let params = {
              ClassTableID: that.classTableID,
              SloverResultCollectionID: that.sloverResultCollectionID,
              CoursePlanLevelID: coursePlanLevelID,
              StudentID: that.Adjust.studentID
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassStudentChangeClass/UnSelectClass`, params)
            that.xy.unloading()
            if (res.success) {
              that.getTP()
            }
          }
        })
      },
      // 返回
      back () {
        this.$store.commit('common/getParam', { step: 9 })
        this.$router.push({
          path: `/xyhome/goClassStepsHeader/studentSwitchedTable`,
          query: this.$store.state.common.menuInfo
        })
      },

      // 统一调整结果
      async unity () {
        if (this.resultData.length >= 2) {
          let num = 0
          for (let i = 0; i < this.resultData.length; i++) {
            if (this.resultData[i].CoursePlanLevelID > 0) {
              num++
            }
          }
          if (num < 2) {
            this.xy.msgError('您至少需要先给2门课程分配结果，才能统一调整结果。')
            return false
          }
        } else {
          return false
        }

        // 获取当前学生可选课程班级组合
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID,
          studentID: this.studentID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassStudentChangeClass/GetStudentALLSelectList`, params)
        this.xy.unloading()
        if (res.success) {
          this.groupClass = res.data.GroupClass
          this.subjects = res.data.Subjects
          this.modalunity = true
        }
      },
      async unitySubmit (item) {
        this.selectSumList = []
        for (let i = 0; i < item.ClassInfo.length; i++) {
          if (!item.ClassInfo[i].IsSelect) {
            this.selectSumList.push({
              ClassTableID: this.classTableID,
              CoursePlanLevelID: item.ClassInfo[i].CoursePlanLevelID,
              SloverResultCollectionID: this.sloverResultCollectionID,
              StudentID: item.ClassInfo[i].StudentID
            })
          }
        }
        // 走班调班 选中多个班级
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassStudentChangeClass/SelectSumClass`, this.selectSumList)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('调整成功。')
          this.modalunity = false
          this.getTP()
        }
      }

    }
  }
</script>
<style lang="less" scoped>
  @import '../css/studentsSwitched.less';
</style>
