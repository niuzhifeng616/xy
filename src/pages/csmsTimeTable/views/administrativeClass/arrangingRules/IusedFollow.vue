
<template>
  <div id="arrangingRules">
     <div class="IusedFollow-rule">
        <div style="margin:20px;">
           <Button class="xy-primary" type="primary" @click="creatGroup"
                          :disabled="StepsHeader.isOperation != 0">创建师徒组</Button>
                <Button class="xy-danger" type="primary" @click="delAll"
                          :disabled="StepsHeader.isOperation != 0?true:isHaveData?false:true">批量删除</Button>
                <Button class="xy-info" type="info" @click="checkAll" :disabled="StepsHeader.isOperation != 0?true:isHaveData?false:true">
                    <span v-if="!isSelectAll">全选</span>
                    <span v-if="isSelectAll">取消全选</span>
                </Button>
        </div>
        <div class="xy-content-table">
            <ul class="IusedFollow-ul" v-if="dataTable.length>0">
                <li v-for="(item,index) in dataTable" :key="index">
                    <div class="IusedFollow-header clearfix">
                        <div class="header-title nowrap" :title="item.SubjectName" v-cloak>{{item.SubjectName}}</div>
                        <div class="header-check"
                             :class="selectionAll.indexOf(item.CoursePlanTeacherForMentorFollowID)!=-1?'header-check-active':''"
                             @click="check(item)">
                            <Icon type="ios-checkmark" color="#FFF"
                            style="position: relative;top: -2px;left: -1px;"
                            size="19" v-if="selectionAll.indexOf(item.CoursePlanTeacherForMentorFollowID)!=-1"/>

                            <!-- <i class="fa fa-check" aria-hidden="true" style="color:#FFF" v-if="selectionAll.indexOf(item.CoursePlanTeacherForMentorFollowID)!=-1"></i> -->
                        </div>
                    </div>
                    <div class="IusedFollow-body nowrap">
                        <div class="IusedFollow-body-top pr">
                            <div class="IusedFollow-master">师</div>
                            <div class="IusedFollow-teacher-name nowrap" :title="item.MasterName">{{item.MasterName}}</div>
                        </div>
                        <div class="IusedFollow-line">
                            <div class="IusedFollow-sooner" v-if="item.Type == '早于'" v-cloak>{{item.Type}}</div>
                            <div class="IusedFollow-later" v-if="item.Type == '晚于'" v-cloak>{{item.Type}}</div>
                        </div>
                        <div class="IusedFollow-body-bottom pr" :title="item.ApprenticeDetail">
                            <div class="IusedFollow-disciple">徒</div>
                            <div v-for="(name,index) in item.ApprenticeDetailsArr" :key="index">
                                <p class="IusedFollow-teacher-name" v-if="index<7">{{name}}</p>
                                <p class="IusedFollow-teacher-name" v-if="index == 7">...</p>
                            </div>
                        </div>
                    </div>
                    <div class="IusedFollow-footer" :class="StepsHeader.isOperation != 0?'no-drop':''" @click="delOne(item)">
                        <Icon type="ios-trash-outline" color="#999" size="18" />
                        <span>删除</span>
                    </div>
                </li>
            </ul>
            <div v-if="dataTable.length===0" class="no-data-box">
              <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
              <span class="no-data-text">您还没有师徒组的信息，请添加师徒组。</span>
            </div>
        </div>

        <!--创建师徒组-->
        <Modal v-model="modalCreatGroup"
               v-if="StepsHeader.isOperation == 0"
               width="864"
               :mask-closable="false"
               :transfer="false">
            <p slot="header">创建师徒组</p>
            <div style="font-size:14px;height:400px;overflow-y:auto">
                <div style="margin-bottom:10px;">
                    <span>师傅的课</span>
                    <Select v-model="soonerLater" style="width:80px">
                        <Option v-for="item in soonerOrLater" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                    <span>徒弟的课</span>
                </div>
                <row>
                    <i-col span="8">
                        <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                            <h1 style="font-size:16px;margin-bottom:10px;">选择课程</h1>
                            <RadioGroup v-model="crouseRadio" vertical @on-change="crouseChange">
                                <Radio :label="crouse"
                                       v-for="(crouse,index) in crouseRadioData"
                                       :key="index">
                                    <span class="f14" v-cloak>{{crouse.SubjectName}}</span>
                                </Radio>
                            </RadioGroup>
                        </div>
                    </i-col>
                    <i-col span="8" style="padding-left:20px;">
                        <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                            <h1 style="font-size:16px;margin-bottom:10px;">选择师傅</h1>
                            <RadioGroup v-model="masterRadio" vertical @on-change="masterChange">
                                <Radio :label="master"
                                       v-for="(master,index) in masterData"
                                       :key="index">
                                    <span class="f14" v-cloak>{{master.TeacherName}}</span>
                                </Radio>
                            </RadioGroup>
                        </div>
                    </i-col>
                    <i-col span="8" style="padding-left:20px;">
                        <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                            <h1 style="font-size:16px;margin-bottom:10px;">选择徒弟</h1>

                            <CheckboxGroup v-model="discipleSelect">
                                <Checkbox :label="item.TeacherID" v-for="(item,index) in discipleData" :key="index" style="display:block;margin:5px;">
                                    <span class="f14" v-cloak>{{item.TeacherName}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                    </i-col>
                </row>
            </div>
            <div slot="footer">
                <Button class="xy-modal-close" @click="modalCreatGroup = false">取消</Button>
                <Button class="xy-modal-primary" shape="circle" @click="submitCreatGroup">保存</Button>
                <Button class="xy-modal-primary" shape="circle"  @click="submitContinueCreatGroup">保存并继续</Button>
            </div>
        </Modal>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        StepsHeader: {},
        classPlan: {},
        isHaveData: false,
        dataTable: [],
        isSelectAll: false,
        selectionAll: [],
        // 创建
        modalCreatGroup: false,
        crouseRadioData: [],
        crouseRadio: '',
        masterData: [],
        masterRadio: '',
        discipleData: [],
        discipleSelect: [],
        soonerOrLater: [
          {
            value: '1',
            name: '早于'
          },
          {
            value: '2',
            name: '晚于'
          }
        ],
        soonerLater: '1'
      }
    },
    created () {
      this.StepsHeader = this.$parent.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      this.getMentorFollow()
    },
    mounted () {

    },
    methods: {
      // 获取table/分页数据
      getMentorFollow () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetMentorFollow`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.dataTable = res.data
            for (var i = 0; i < this.dataTable.length; i++) {
              this.dataTable[i].ApprenticeDetailsArr = this.dataTable[i].ApprenticeDetails.split(',')
            };
            this.isSelectAll = false
            if (this.dataTable.length > 0) {
              this.isHaveData = true
            } else {
              this.isHaveData = false
            }
          }
        })
      },
      // 全选
      checkAll () {
        if (this.StepsHeader.isOperation === 0 && this.isHaveData) {
          this.isSelectAll = !this.isSelectAll
          if (this.isSelectAll) { // 选中
            this.selectionAll = []
            this.dataTable.map((item) => {
              this.selectionAll.push(item.CoursePlanTeacherForMentorFollowID)
              return item
            })
          } else { // 取消选中
            this.selectionAll = []
          }
        }
      },
      check (val) {
        var index = this.selectionAll.map((item) => { return item }).indexOf(val.CoursePlanTeacherForMentorFollowID)
        if (index === -1) {
          this.selectionAll.push(val.CoursePlanTeacherForMentorFollowID)
          if (this.selectionAll.length === this.dataTable.length) { // 选中最后一个，全选做选中
            this.isSelectAll = true
          }
        } else {
          this.selectionAll.splice(index, 1)
          if (this.selectionAll.length !== this.dataTable.length) { // 取消全选
            this.isSelectAll = false
          }
        }
      },
      // 删除
      delOne (row) {
        if (this.StepsHeader.isOperation === 0) {
          this.confirmParm = row
          this.xy.confirm('温馨提示', '您确定要删除此师徒组吗？', this.delOneOk)
        }
      },
      delOneOk (row) {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/DeleteMentorFollow`, {
          id: this.confirmParm.CoursePlanTeacherForMentorFollowID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.getMentorFollow()
          }
        })
      },

      // 批量删除
      delAll () {
        if (this.StepsHeader.isOperation === 0) {
          if (this.selectionAll.length === 0) {
            this.xy.msgError('请选择删除项。')
          } else {
            this.xy.confirm('温馨提示', '您确定要删除所选中的师徒跟随组？', this.delAllOk)
          }
        }
      },
      delAllOk () {
        var ids = ''
        for (var i = 0; i < this.selectionAll.length; i++) {
          ids += this.selectionAll[i] + ','
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/DeleteListMentorFollow`, {
          ids: ids
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.selectionAll = []
            this.isSelectAll = false
            this.getMentorFollow()
          }
        })
      },
      // 创建师徒组
      creatGroup () { // 班级列表
        if (this.StepsHeader.isOperation === 0) {
          this.crouseRadioData = []
          this.crouseRadio = ''
          this.masterData = []
          this.masterRadio = ''
          this.discipleData = []
          this.discipleSelect = []
          this.xy.loading()
          this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetMentorFollowSubject`, {
            classTableID: this.classPlan.classTableID
          }).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.crouseRadioData = res.data
              this.modalCreatGroup = true
            }
          })
        }
      },
      crouseChange (val) { // 选择课程，获取师傅数据
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetMentorFollowSubjectMentor`, {
          classTableID: this.classPlan.classTableID,
          subjectID: val.SubjectID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.masterData = res.data
            this.discipleData = []// 选择课程，徒弟为空
            this.discipleSelect = []
            this.masterRadio = ''
          }
        })
      },
      masterChange (val) { // 选择师傅，获取徒弟数据
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetMentorFollowSubjectApprentice`, {
          classTableID: this.classPlan.classTableID,
          subjectID: this.crouseRadio.SubjectID,
          teacherID: val.TeacherID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.discipleData = []// 选择课程，徒弟为空
            this.discipleSelect = []
            this.discipleData = res.data
          }
        })
      },
      submitCreatGroup () { // 保存
        if (this.crouseRadio === '') {
          this.xy.msgError('请勾选课程。')
          return false
        };
        if (this.masterRadio === '') {
          this.xy.msgError('请勾选师傅。')
          return false
        };
        if (this.discipleSelect.length === 0) {
          this.xy.msgError('请勾选徒弟。')
          return false
        };
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/CreateMentorFollow`, {
          ClassTableID: this.classPlan.classTableID,
          SubjectID: this.crouseRadio.SubjectID,
          Type: this.soonerLater,
          MasterID: this.masterRadio.TeacherID,
          Apprentices: this.discipleSelect
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.modalCreatGroup = false
            this.getMentorFollow()
          }
        })
      },
      submitContinueCreatGroup () { // 保存并继续
        if (this.crouseRadio === '') {
          this.xy.msgError('请勾选课程。')
          return false
        };
        if (this.masterRadio === '') {
          this.xy.msgError('请勾选师傅。')
          return false
        };
        if (this.discipleSelect.length === 0) {
          this.xy.msgError('请勾选徒弟。')
          return false
        };
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/CreateMentorFollow`, {
          ClassTableID: this.classPlan.classTableID,
          SubjectID: this.crouseRadio.SubjectID,
          Type: this.soonerLater,
          MasterID: this.masterRadio.TeacherID,
          Apprentices: this.discipleSelect
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.getMentorFollow()
            this.creatGroup()
          }
        })
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../../css/arrangingRules.less';
.no-drop {
    cursor: no-drop;
    color: #999999;
}
.no-drop:hover {
    color: #999999!important;
    .ivu-icon {
    color: #999999 !important;
}
}
</style>
