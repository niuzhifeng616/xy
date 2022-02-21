<template>
  <!-- 5.排课规则-师徒跟随-->
  <div>
    <div class="IusedFollow-rule">
      <div class="clearfix" style="margin:20px">
        <div class="fl">
          <div class="fl">
            <Button  class="xy-primary" @click="creatGroup" :disabled="isOperation !== 0">创建师徒组
            </Button>
            <Button  class="xy-danger" @click="delAll"
              :disabled="isOperation !== 0?true:isHaveData?false:true">批量删除</Button>
            <Button  @click="checkAll"
              :disabled="isOperation !== 0?true:isHaveData?false:true">
              <span v-if="!isSelectAll">全选</span>
              <span v-if="isSelectAll">取消全选</span>
            </Button>
          </div>
        </div>
        <!-- <Alert show-icon class="fl" style="margin-left:32px;">创建师徒关系并可设置师傅的课早于还是晚于徒弟的课。</Alert> -->
      </div>

      <div class="xy-content-table">
        <ul class="IusedFollow-ul" v-if="dataTable.length>0">
          <li v-for="item in dataTable" :key="item.SubjectName">
            <div class="IusedFollow-header clearfix">
              <div class="header-title nowrap" :title="item.SubjectName">{{item.SubjectName}}</div>
              <div class="header-check"
                :class="selectionAll.indexOf(item.CoursePlanTeacherForMentorFollowID)!==-1?'header-check-active':''"
                @click="check(item)">
                <Icon type="ios-checkmark" color="#FFF"
                            style="position: relative;top: -2px;left: -1px;"
                            size="19" v-if="selectionAll.indexOf(item.CoursePlanTeacherForMentorFollowID)!==-1"></Icon>
              </div>
            </div>
            <div class="IusedFollow-body nowrap">
              <div class="IusedFollow-body-top pr">
                <div class="IusedFollow-master">师</div>
                <div class="IusedFollow-teacher-name nowrap" :title="item.MasterName">{{item.MasterName}}</div>
              </div>
              <div class="IusedFollow-line">
                <div class="IusedFollow-sooner" v-if="item.Type === '早于'">{{item.Type}}</div>
                <div class="IusedFollow-later" v-if="item.Type === '晚于'">{{item.Type}}</div>
              </div>
              <div class="IusedFollow-body-bottom pr" :title="item.ApprenticeDetail">
                <div class="IusedFollow-disciple">徒</div>
                <div v-for="(name,index) in item.ApprenticeDetailsArr" :key="name">
                  <p class="IusedFollow-teacher-name" v-if="index<7">{{name}}</p>
                  <p class="IusedFollow-teacher-name" v-if="index === 7">...</p>
                </div>
              </div>
            </div>
            <div class="IusedFollow-footer" @click="delOne(item)">
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
      <modal v-model="modalCreatGroup" v-if="isOperation === 0" :mask-closable="false" width="864" :transfer="false">
        <p slot="header">创建师徒组</p>
        <div style="font-size:14px;height:500px;overflow-y:auto">
          <div style="margin-bottom:10px;">
            <span>师傅的课</span>
            <i-select v-model="soonerLater" style="width:80px">
              <i-option v-for="item in soonerOrLater" :value="item.value" :key="item.value">{{ item.name }}
              </i-option>
            </i-select>
            <span>徒弟的课</span>
          </div>
          <row>
            <i-col span="8">
              <div style="padding:10px 15px;height:450px;overflow-y:auto;border:1px solid #eaeaea">
                <h1 style="font-size:16px;margin-bottom:10px;">选择课程</h1>
                <radio-group v-model="crouseRadio" vertical @on-change="crouseChange">
                  <radio :label="crouse.SubjectID" v-for="crouse in crouseRadioData" :key="crouse.SubjectID">
                    <span class="f14">{{crouse.SubjectName}}</span>
                  </radio>
                </radio-group>
              </div>
            </i-col>
            <i-col span="8" style="padding-left:20px;">
              <div style="padding:10px 15px;height:450px;overflow-y:auto;border:1px solid #eaeaea">
                <h1 style="font-size:16px;margin-bottom:10px;">选择师傅</h1>
                <radio-group v-model="masterRadio" vertical @on-change="masterChange">
                  <radio :label="master.TeacherID" v-for="master in masterData" :key="master.TeacherID">
                    <span class="f14">{{master.TeacherName}}</span>
                  </radio>
                </radio-group>
              </div>
            </i-col>
            <i-col span="8" style="padding-left:20px;">
              <div style="padding:10px 15px;height:450px;overflow-y:auto;border:1px solid #eaeaea">
                <h1 style="font-size:16px;margin-bottom:10px;">选择徒弟</h1>

                <checkbox-group v-model="discipleSelect">
                  <checkbox :label="item.TeacherID" v-for="item in discipleData" style="display:block;margin:5px;" :key="item.TeacherName">
                    <span class="f14">{{item.TeacherName}}</span>
                  </checkbox>
                </checkbox-group>
              </div>
            </i-col>
          </row>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="modalCreatGroup = false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="submitCreatGroup">保存</Button>
          <Button class="xy-modal-primary" shape="circle" @click="submitContinueCreatGroup">保存并继续</Button>
        </div>
      </modal>
    </div>

  </div>
</template>
<script>
  export default {
    name: 'IusedFollow',
    data () {
      return {
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        isHaveData: false,
        dataTable: [],
        isSelectAll: false,
        selectionAll: [],
        // 创建
        modalCreatGroup: false,
        crouseRadioData: [],
        crouseRadio: -1,
        masterData: [],
        masterRadio: -1,
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
    },
    mounted () {
      this.getMentorFollow()
    },
    methods: {
      // 获取列表数据
      async getMentorFollow () {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/GetMentorFollow`, params)
        this.xy.unloading()
        if (res.success) {
          this.dataTable = res.data
          for (let i = 0; i < this.dataTable.length; i++) {
            this.dataTable[i].ApprenticeDetailsArr = this.dataTable[i].ApprenticeDetails.split(',')
          };
          this.isSelectAll = false
          if (this.dataTable.length > 0) {
            this.isHaveData = true
          } else {
            this.isHaveData = false
          }
        }
      },
      // 全选
      checkAll () {
        if (this.isOperation === 0 && this.isHaveData) {
          this.isSelectAll = !this.isSelectAll
          this.selectionAll = []
          if (this.isSelectAll) { // 选中
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
        let index = this.selectionAll.map((item) => { return item }).indexOf(val.CoursePlanTeacherForMentorFollowID)
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
        let that = this
        that.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除' + row.SubjectName + '吗？',
          async onOk () {
            let params = {
              id: row.CoursePlanTeacherForMentorFollowID
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassRuleSetting/DeleteMentorFollow`, params)
            if (res.success) {
              that.xy.msgSuc('删除成功。')
              that.getMentorFollow()
            }
          }
        })
      },

      // 批量删除
      delAll () {
        if (this.isOperation === 0) {
          let that = this
          if (that.selectionAll.length === 0) {
            that.xy.msgError('请选择删除项。')
          } else {
            let ids = ''
            for (let i = 0; i < that.selectionAll.length; i++) {
              ids += that.selectionAll[i] + ','
            }
            that.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除所选的师徒组吗？',
              async onOk () {
                let params = {
                  ids: ids
                }
                let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassRuleSetting/DeleteListMentorFollow`, params)
                if (res.success) {
                  that.xy.msgSuc('删除成功。')
                  that.selectionAll = []
                  that.isSelectAll = false
                  that.getMentorFollow()
                }
              }
            })
          }
        }
      },
      // 创建师徒组
      async creatGroup () { // 班级列表
        if (this.isOperation === 0) {
          this.crouseRadioData = []
          this.crouseRadio = -1
          this.masterData = []
          this.masterRadio = -1
          this.discipleData = []
          this.discipleSelect = []
          this.xy.loading()
          let params = {
            classTableID: this.classTableID
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/GetMentorFollowSubject`, params)
          this.xy.unloading()
          if (res.success) {
            this.crouseRadioData = res.data
            this.modalCreatGroup = true
          }
        }
      },
      async crouseChange (val) { // 选择课程，获取师傅数据
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          subjectID: val
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/GetMentorFollowSubjectMentor`, params)
        this.xy.unloading()
        if (res.success) {
          this.masterRadio = -1
          this.discipleSelect = []
          this.masterData = res.data
          this.discipleData = []// 选择课程，徒弟为空
        }
      },
      async masterChange (val) { // 选择师傅，获取徒弟数据
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          subjectID: this.crouseRadio,
          teacherID: val
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/GetMentorFollowSubjectApprentice`, params)
        this.xy.unloading()
        if (res.success) {
          this.discipleData = res.data
        }
      },
      async submitCreatGroup () { // 保存
        if (this.crouseRadio === -1) {
          this.xy.msgError('请选择数据后再保存。')
          return false
        };
        if (this.masterRadio === -1) {
          this.xy.msgError('请选择数据后再保存。')
          return false
        };
        if (this.discipleSelect.length === 0) {
          this.xy.msgError('请选择数据后再保存。')
          return false
        };
        let params = {
          ClassTableID: this.classTableID,
          SubjectID: this.crouseRadio,
          Type: this.soonerLater,
          MasterID: this.masterRadio,
          Apprentices: this.discipleSelect
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/CreateMentorFollow`, params)
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          this.modalCreatGroup = false
          this.getMentorFollow()
        }
      },
      async submitContinueCreatGroup () { // 保存并继续
        if (this.crouseRadio === -1) {
          this.xy.msgError('请选择数据后再保存。')
          return false
        };
        if (this.masterRadio === -1) {
          this.xy.msgError('请选择数据后再保存。')
          return false
        };
        if (this.discipleSelect.length === 0) {
          this.xy.msgError('请选择数据后再保存。')
          return false
        };
        let params = {
          ClassTableID: this.classTableID,
          SubjectID: this.crouseRadio,
          Type: this.soonerLater,
          MasterID: this.masterRadio,
          Apprentices: this.discipleSelect
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/CreateMentorFollow`, params)
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          this.getMentorFollow()
          this.creatGroup()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../css/arrangingRules.less';
   .fl {
    float: left;
    button {
      margin-right: .5em;
    }
  }
  .fr {
    float: right;
  }
  .pr {
    position: relative;
  }
  .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }
</style>
