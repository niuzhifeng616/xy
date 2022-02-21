<template>
  <div id="rule">
    <div class="ruleLeft">
      <div class="adjust-flex">
        <div class="adjust-align" @click="showRule(0)" :class="showList[0].show ? 'active' : ''">分考场规则</div>
      </div>
      <div class="adjust-flex">
        <div class="adjust-align" @click="showRule(1)" :class="showList[1].show ? 'active' : ''">排监考规则</div>
      </div>
    </div>

    <div class="exam-case ruleRight" v-show="showList[0].show" style="margin-bottom: 50px;">
      <div class="exam-case-cont fen">
        <Alert show-icon closable style="margin-bottom: 28px">有排考结果后，本页面内容不可更改，若需更改，请先删除排考结果。</Alert>
        <div class="exam-student">
          <div class="exam-item clearfix">
            <div class="exam-tit">
              固定科目
              <tooltip
                word-wrap
                max-width="200"
                placement="top"
                content="同一学生的哪些科目排在同一座位号。"
                >
                <Icon type="md-help-circle" size="22" color="#ffad33" />
              </tooltip>
            </div>
            <div class="exam-box">
              <radio-group
                v-model="roomState"
                @on-change="stateChange"
                class="fl"
                size="large"
                >
                <radio :label="3">全不固定</radio>
                <radio :label="1">全固定</radio>
                <radio :label="2">语数英固定</radio>
              </radio-group>
            </div>
          </div>
          <div class="exam-item clearfix">
            <div class="exam-tit">
              <checkbox v-model="exaRoom" @on-change="exaRoomChange" size="large">
                <span>
                  按成绩分考场
                </span>
                <tooltip word-wrap max-width="200" placement="top" content="按成绩总分降序给学生分配考场。">
                  <Icon type="md-help-circle" size="22" color="#ffad33" />
                </tooltip>
              </checkbox>
            </div>
            <div class="exam-box">
              <cascader
                v-model="ExamSemester"
                :data="SemesterList"
                not-found-text="您还没有学年/学期的信息。"
                @on-change="SemesterChange"
                :clearable="false"
                placeholder="请选择学年/学期"
                :disabled="examDisabled"
                style="width:240px; margin-right:16px; display:inline-block;"
                >
              </cascader>
              <i-select
                v-model="ExamAchieve"
                @on-change="AchieveChange"
                :disabled="examDisabled"
                style="width:240px;"
                >
                <i-option
                  v-for="AchieveItem in AchieveList"
                  :value="AchieveItem.ExamID"
                  :key="AchieveItem.ExamID"
                  v-cloak
                  >
                  {{ AchieveItem.ExamName }}
                </i-option>
              </i-select>
            </div>
          </div>
          <div class="exam-item clearfix">
            <div class="exam-tit">
              <checkbox v-model="exaMutex" @on-change="exaMutexChange" size="large">
                <span>
                  同教学班互斥
                </span>
                <tooltip
                  word-wrap
                  max-width="200"
                  placement="top"
                  content="同班学生尽量前后不相邻。"
                  >
                  <Icon type="md-help-circle" size="22" color="#ffad33" />
                </tooltip>
              </checkbox>
            </div>
          </div>
          <div class="exam-foot" v-if="params.isEdit">
            <Button class="xy-btn-primary" shape="circle" @click="ExamEvaCreate">保存</Button>
          </div>
        </div>
      </div>
    </div>

    <div class="exam-teacher ruleRight "  v-show="showList[1].show">
      <Alert show-icon closable style="width:616px; margin-bottom: 20px">有排考结果后，本页面内容不可更改，若需更改，请先删除排考结果。</Alert>
      <div class="exam-case">
        <div class="exam-case-tit">
          基本规则
        </div>
        <div class="exam-case-cont">
          <div style="margin-bottom:32px;">
            <span style="width:140px;display:inline-block;color:#666;text-align: right; margin-right:25px;">每考场监考教师人数：</span>
            <i-select v-model="ExamTeacher" @on-change="TeacherChange" style="width:302px; margin-right:26px;">
              <i-option
                v-for="TeacherItem in TeacherList"
                :value="TeacherItem.ID"
                :key="TeacherItem.ID"
                v-cloak
                >
                {{ TeacherItem.Name }}
              </i-option>
            </i-select>
          </div>
          <div style="margin-bottom:32px;">
            <span style="width:140px;display:inline-block;color:#666;text-align: right; margin-right:25px;">优先监考：</span>
            <radio-group v-model="state" @on-change="stateChange" size="large">
              <radio :label="1" style="margin-right:20px;">不限</radio>
              <radio :label="2" style="margin-right:20px;">任教学科</radio>
              <radio :label="3" style="margin-right:20px;">非任教学科</radio>
            </radio-group>
          </div>
          <div style="margin-bottom:36px;padding-left: 166px">
            <checkbox v-model="afterMutex" @on-change="afterChange">
              <span style="font-size:14px;">尽量不要排在考所教学科之后</span>
            </checkbox>
          </div>
          <div v-if="params.isEdit" style="padding-left: 166px">
            <Button class="xy-btn-primary" shape="circle" @click="Create">保存</Button>
          </div>
        </div>
      </div>

      <div class="exam-case">
        <div class="exam-case-tit">
          高级规则
        </div>
        <div class="exam-case-cont">
          <div style="margin-bottom:30px;">
            <div class="addBtn" @click="AddTeacher" v-if="params.isEdit"><Icon type="md-add" />添加</div>
          </div>
          <div id='myTable'>
            <XyAntTable
            :columns="columns"
            :dataSource="datatable"
            :nullData="txt"
            :tableLoading="tableLoading"
            :pagination="pagination"
            @change="handleTableChange"
            >
            <!-- 操作 -->
            <span slot="action" slot-scope="text, record">
              <a @click="del(record.TeacherName, record.ArrangeSupervisorSubjectID, record.ArrangeSupervisorTeacherID, record.InvigilateRuleType)" :disabled='!params.isEdit'>删除</a>
            </span>
          </XyAntTable>
          </div>
        </div>
      </div>
    </div>
    <modal
      v-model="modalCreate"
      :styles="{width:'1000px'}"
      :transfer="false"
      title="添加监考规则"
      :loading="loading"
      :mask-closable="false"
      >
      <div class="dialog-model-content">
        <row>
          <i-col span="7" style="border:1px solid #dadada;">
            <div class="model-tit">监考老师</div>
            <div class="model-cont" style="padding: 0 40px; overflow: auto;">
              <checkbox-group v-model="addTeacher" @on-change="addTeacherChange">
                <checkbox
                  v-for="tacherItem in teacherList"
                  :label="tacherItem.ArrangeSupervisorTeacherID"
                  :key="tacherItem.ArrangeSupervisorTeacherID"
                  style="display:block; margin:15px 0; font-size:14px;"
                  >
                  {{tacherItem.TeacherName}}（{{tacherItem.UserName}}）
                </checkbox>
              </checkbox-group>
            </div>
          </i-col>
          <i-col span="5" style="border:1px solid #dadada; margin-left:-1px;">
            <div class="model-tit">监考规则</div>
            <div class="model-cont" style="padding: 0 30px; overflow: auto;">
              <radio-group v-model="addRule" @on-change="addRuleChange">
                <radio
                  v-for="ruleItem in ruleList"
                  :label="ruleItem.Key"
                  style="display:block; margin:15px 0; font-size:14px;"
                  :key="ruleItem.Key"
                  >
                  {{ruleItem.Value}}
                </radio>
              </radio-group>
            </div>
          </i-col>
          <i-col span="12" style="border:1px solid #dadada; margin-left:-1px;">
            <div class="model-tit">规则内容</div>
            <div class="model-cont">
              <div v-if="addRule!==''">
                <div v-if="isInputDisabled" style="height: 290px; overflow: auto; padding-left: 50px;">
                  <checkbox-group v-model="ruleCont" @on-change="addContChange">
                    <checkbox
                      v-for="ruleContItem in ruleContList"
                      :label="ruleContItem.ArrangeSupervisorSubjectID"
                      :key="ruleContItem.ArrangeSupervisorSubjectID"
                      :disabled="isRadioDisabled"
                      style="display:block; margin:15px 0; font-size:14px;"
                      >
                      {{ruleContItem.SubjectName}} {{ruleContItem.AchievementDateName}} {{ruleContItem.AchievementStartTimeName}}~{{ruleContItem.AchievementEndTimeName}}
                    </checkbox>
                  </checkbox-group>
                </div>
                <div v-else class="text-center" style="margin-top: 70px;">
                  <input-number
                    v-model="scene"
                    :min="1"
                    :max="20"
                    :disabled="isInputDisabled"
                    @on-change="sceneChange"
                    clearable
                    style="margin-right:10px;"
                    >
                  </input-number> 场
                  <p style="color:#7f7f7f;margin-top:10px;">请输入最大监考场次。</p>
                </div>
              </div>
              <div v-else class="no-data-box" style="padding: 0; margin-top: 30px">
                <img class="no-data-img" src="../Image/no-Data.png" />
                <span class="no-data-text">你还没有监考规则的信息，请先选择监考规则。</span>
              </div>
            </div>
          </i-col>
        </row>
      </div>
      <div slot="footer" class="news-details-foot">
        <Button class="xy-modal-close" @click="Cancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="Ok">保存</Button>
        <checkbox
          v-model="Continue"
          @on-change="OkContinueChange"
          size="large"
          style="margin-left:20px;"
          >
          继续添加
        </checkbox>
      </div>
    </modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'ExamRuleStudent',
    data () {
      return {
        showList: [
          {
            li: 0,
            show: true
          },
          {
            li: 1,
            show: false
          }
        ],
        tableLoading: true,
        apiPath: `${this.$store.state.apiPath}/api/ArrangeExamSetting/`,
        roomState: -1,
        exaRoom: false,
        exaMutex: false,
        examDisabled: true,
        // 学期列表
        SemesterList: [],
        ExamSemester: [],
        // 成绩列表
        AchieveList: [],
        ExamAchieve: 0,
        txt: '您还没有高级规则的信息，请设置高级规则。',
        ExamTeacher: '',
        TeacherList: [
          {
            ID: 1,
            Name: '1人'
          },
          {
            ID: 2,
            Name: '2人'
          },
          {
            ID: 3,
            Name: '3人'
          }
        ],
        state: 1,
        afterMutex: false,

        columns: [
          {
            title: '用户名',
            dataIndex: 'UserName',
            width: 150
          },
          {
            title: '姓名',
            dataIndex: 'TeacherName',
            width: 150
          },
          {
            title: '监考规则',
            dataIndex: 'InvigilateRuleTypeName',
            width: 160
          },
          {
            title: '规则内容',
            dataIndex: 'InvigilateRuleInfo',
            width: 150
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width: 80
          }
        ],
        datatable: [], // table数据
        pageList: 0, // 当前页数据条数
        isEmpty: false, // 数据是否为空
        isInitial: true, // 页面加载loading
        modalCreate: false,
        loading: true,
        modal_loading: false,
        teacherList: [],
        addTeacher: [],
        ruleCont: [],
        ruleList: [],
        addRule: '',
        scene: 0,
        ruleContList: [],
        isInputDisabled: false,
        isRadioDisabled: false,
        Continue: false,
        params: this.$store.state.educationAffairs.arrange,
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        }
      }
    },
    created () {
      // console.log(this.params)
      this.getSessionNodeList()
      this.GetExamSeniorSettingByID()
      this.GetExamSettingTeacherRule(true)
    },
    methods: {
      showRule (a) {
        this.showList.forEach((item, index) => {
          item.show = item.li === a
        })
      },
      handleTableChange () {
        this.GetExamSettingTeacherRule()
      },
      async getLIst () {
        this.xy.loading()
        let res = await this.xy.get(`${this.apiPath}GetAllExamEvaDropDownList`, null)
        this.xy.unloading()
        if (res.success) {
          this.AchieveList = res.data
          this.GetExamBaseSettingByID()
        }
      },
      // 学生分考场规则
      async getSessionNodeList () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetSessionNodeList`, null)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.SemesterList = res.data
            this.getLIst()
          }
        }
      },
      // 获取学生分考场规则
      async GetExamBaseSettingByID () {
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(this.apiPath + 'GetExamBaseSettingByID', params)
        this.xy.unloading()
        if (res.success) {
          this.roomState = res.data.FixedSubjectType
          this.exaMutex = res.data.ClassExclusion
          if (res.data.AcademicYearID > 0) {
            this.exaRoom = true
            this.examDisabled = false
            this.ExamAchieve = res.data.AchievementRecordID
            this.ExamSemester.push(res.data.AcademicYearID)
            this.ExamSemester.push(res.data.AcademicSessionID)
          }
        }
      },

      // 获取学年学期
      async getFilterData () {
        this.xy.loading()
        const params = {}
        let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetSessionNodeList`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.SemesterList = res.data
          };
        }
      },

      // 获取考试下拉 所有已经发布的考试
      async GetAllExamEvaDropDownList () {
        this.xy.loading()
        const params = {}
        this.AchieveList = []
        let res = await this.xy.get(this.apiPath + 'GetAllExamEvaDropDownList', params)
        this.xy.unloading()
        if (res.success) {
          let dataList = res.data
          for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].AcademicYearID === this.ExamSemester[0] && dataList[i].AcademicSessionID === this.ExamSemester[1]) {
              this.AchieveList.push(dataList[i])
            } else {
              // this.AchieveList = []
              this.ExamAchieve = ''
            }
          }
        }
      },

      // 按成绩分考场
      exaRoomChange () {
        if (this.exaRoom) {
          this.examDisabled = false
          this.ExamSemester = []
        } else {
          this.examDisabled = true
          // 默认选取当前选中的学年和学期
          for (const item of this.SemesterList) {
            for (const t of item.children) {
              if (item.IsCurrent && t.IsCurrent) {
                this.ExamSemester[0] = item.value
                this.ExamSemester[1] = t.value
              };
            }
          }
          this.ExamAchieve = ''
        }
      },

      // 选择学期
      SemesterChange (vals) {
        this.ExamSemester = vals
        this.GetAllExamEvaDropDownList()
      },

      // 选择成绩
      AchieveChange (item) {
        this.ExamAchieve = item
      },

      // 同教学班互斥
      exaMutexChange () {

      },

      // 保存
      async ExamEvaCreate () {
        if (this.exaRoom) {
          if ((!this.ExamAchieve > 0) || this.ExamSemester === []) {
            return this.xy.msgError('请选择依据哪次成绩进行“按成绩分考场”。')
          }
        }
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          AchievementRecordID: this.ExamAchieve,
          ClassExclusion: this.exaMutex,
          FixedSubjectType: this.roomState
        }
        let res = await this.xy.post(this.apiPath + 'SaveBaseExamSetting', params, true)
        this.xy.unloading()
        if (res.success) {
          // this.modalCreate = false
          this.xy.msgSuc(res.msg || '保存成功。')
          // this.params.lens = res.data.result.Step
          let l = res.data.result.Step + 1
          let arr = JSON.parse(this.params.StepList)
          for (let i = 0; i < l; i++) {
            if (i < l) {
              arr[i].IsDisabled = false
            } else {
              arr[i].IsDisabled = true
            }
          }
          this.$store.commit('educationAffairs/changeArrange', Object.assign(this.$store.state.educationAffairs.arrange, {
            Steps: res.data.result.Step,
            StepList: JSON.stringify(arr)
          }))
          this.$emit('change', { StepList: arr, step: res.data.result.Step })
          this.ExamSemester = []
          this.GetExamBaseSettingByID()
        } else {
          this.modal_loading = false
          this.xy.msgError(res.msg || '保存失败。')
        };
      },

      // 获取基本规则设置
      async GetExamSeniorSettingByID () {
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(this.apiPath + 'GetExamSeniorSettingByID', params)
        this.xy.unloading()
        if (res.success) {
          this.ExamTeacher = res.data.InvigilateTeacherCount
          this.state = res.data.PriorityInvigilatorType
          this.afterMutex = res.data.TeacherTeachingSubject
        }
      },

      // 每考场监考教师人数
      TeacherChange () { },

      // 优先监考
      stateChange (item) {
        this.state = item
      },

      // 尽量不要排在考所教学科之后
      afterChange (item) {
        this.afterMutex = item
      },

      // 保存
      async Create () {
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          InvigilateTeacherCount: this.ExamTeacher,
          PriorityInvigilatorType: this.state,
          TeacherTeachingSubject: this.afterMutex
        }
        let res = await this.xy.post(this.apiPath + 'SaveSeniorExamSetting', params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || '保存成功。')
          this.GetExamSeniorSettingByID()
        } else {
          this.modal_loading = false
          this.xy.msgError(res.msg || '保存失败。')
          this.modalCreate = false
        }
      },

      // 分页获取教师排考规则
      async GetExamSettingTeacherRule (val) {
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        }
        let res = await this.xy.get(this.apiPath + 'GetExamSettingTeacherRule', params)
        this.tableLoading = false
        if (res.success) {
          this.isInitial = false
          if (res.data.data != null && res.data.data.length > 0) {
            this.datatable = res.data.data
            this.pagination.total = res.data.totalRecords
            this.isEmpty = false
          } else {
            this.isEmpty = true
            this.datatable = []
            this.pagination.total = 0
          };
          if (!val) { // 控制滚动条位置在表格这
            this.$nextTick(() => {
              document.getElementById('myTable').scrollIntoView()
            })
          }
        }
      },

      // 添加教师
      AddTeacher () {
        this.modalCreate = true
        this.GetAllArrangeSupervisorTeacher()
        this.GetExamSettingRule()
        this.GetAllExamSubject()
      },

      // 获取列表数据
      async GetAllArrangeSupervisorTeacher () {
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(this.apiPath + 'GetAllArrangeSupervisorTeacher', params)
        this.xy.unloading()
        if (res.success) {
          this.teacherList = res.data
        }
      },

      // 获取监考规则
      async GetExamSettingRule () {
        this.xy.loading()
        const params = {}
        let res = await this.xy.get(this.apiPath + 'GetExamSettingRule', params)
        this.xy.unloading()
        if (res.success) {
          this.ruleList = res.data
        }
      },

      // 获取监考科目
      async GetAllExamSubject () {
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeSupervisorExam/GetAllExamSubject`, params)
        this.xy.unloading()
        if (res.success) {
          this.ruleContList = res.data
        }
      },

      Cancel () {
        this.modalCreate = false
        this.addTeacher = []
        this.addRule = ''
        this.ruleCont = []
        this.scene = 0
        this.Continue = false
        this.isInputDisabled = false
        this.isRadioDisabled = false
      },

      OkContinueChange (item) {
        this.Continue = item
      },

      async Ok () {
        if (this.addTeacher.length < 1) {
          return this.xy.msgError('请选择监考教师。')
        };

        if (!this.addRule) {
          return this.xy.msgError('请选择监考规则。')
        };

        if (this.addRule === '3') {
          if (!this.scene) {
            return this.xy.msgError('请输入场次。')
          };
          this.ruleCont = []
        } else {
          if (this.ruleCont.length < 1) {
            return this.xy.msgError('请选择规则内容。')
          };
          this.scene = 0
        };
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          ArrangeSupervisorTeacherIDs: this.addTeacher,
          InvigilateRuleType: this.addRule,
          ArrangeSupervisorSubjectIDs: this.ruleCont,
          InvigilateRoomCount: this.scene
        }
        let res = await this.xy.post(this.apiPath + 'SaveSeniorTeacherExamSetting', params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || '保存成功。')
          this.GetExamSettingTeacherRule()
          if (this.Continue) {
            this.modalCreate = true
            this.Continue = true
          } else {
            this.modalCreate = false
            this.Continue = false
          }
          this.addTeacher = []
          this.addRule = ''
          this.ruleCont = []
          this.scene = 0
          this.isInputDisabled = false
          this.isRadioDisabled = false
        } else {
          this.modal_loading = false
          this.xy.msgError(res.msg || '保存失败。')
          this.modalCreate = false
        }
      },

      // 添加老师
      addTeacherChange (item) {
        this.addTeacher = item
      },

      // 监考规则
      addRuleChange (item) {
        this.addRule = item
        if (this.addRule === '3') {
          this.isInputDisabled = false
          this.isRadioDisabled = true
        } else {
          this.isInputDisabled = true
          this.isRadioDisabled = false
        }
      },

      // 规则内容
      addContChange (item) {
        this.ruleCont = item
      },

      // 场次内容
      sceneChange (item) {
        this.scene = item
        if (!this.scene) {
          this.isRadioDisabled = false
        } else {
          this.isRadioDisabled = true
          this.addRule = '3'
        };
      },

      // 单击删除单个内容触发
      del (name, SubjectID, TeacherID, Type) {
        this.xy.confirm('删除', '您确定要删除该条规则吗？', () => {
          this.modal_loading = true
          this.toDelet(name, SubjectID, TeacherID, Type)
        })
      },
      async toDelet (name, SubjectID, TeacherID, Type) {
        // this.xy.loading()
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          ArrangeSupervisorSubjectID: SubjectID,
          InvigilateRuleType: Type,
          ArrangeSupervisorTeacherID: TeacherID
        }
        let res = await this.xy.post(this.apiPath + 'DeleteSeniorTeacherExamSetting', params)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          this.xy.msgSuc(res.msg || '删除成功。')
          // 单个删除：删除最后一页最后一条时，自动返回上一页
          if (this.datatable.length > 1) {
            this.datatable.length = this.datatable.length - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.GetExamSettingTeacherRule()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../Css/ArrangeExamRoom/ExamRule.less';
  .exam-case-cont {
    padding: 30px 30px 60px !important;
  }
</style>
