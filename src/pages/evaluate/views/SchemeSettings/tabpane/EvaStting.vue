<!-- 2.评价设置 -->
<template>
  <div class="eva-setting">
    <div class="xy-content-title xy-flex xy-between">
      <div>
        <Button class="xy-primary"
                @click="addMin"
                v-if="status!==2">添加评价考试</Button>
        <div class="objects-exam-info">
          <span class="objects-exam-info-name" v-if="EvaExamName">评价考试：</span>
          <em class="col0-85" style="margin-right:35px;" v-text="EvaExamName"></em>
          <span class="objects-exam-info-name" v-if="RefeExamName">参考考试：</span>
          <em class="col0-85" v-text="RefeExamName"></em>
        </div>
      </div>
      <Button class="xy-info"
              @click="exportTable">导出</Button>
    </div>
    <div class="table">
      <XyAntTable
        :columns="columns"
        :dataSource="datatable"
        nullData="还没有相关内容。"
        :scrollx="'max-content'"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange">
        <!-- 头像 -->
        <div slot="TeacherIconRender" slot-scope="text, record">
          <div v-if="!record.TeacherIcon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
            <span class="head-font">
              {{ xy.showName(record.TeacherName)}}
            </span>
          </div>
          <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.TeacherIcon + '?' + Math.random() * 15">
        </div>
        <!-- 教学班 -->
        <div slot="TeachClassNameRender" slot-scope="text, record" style="min-width:100px">
          <span class="table-el-hover" @click="watchInfo(record)">
            {{record.TeachClassName}}
          </span>
        </div>
        <!-- 评价考试 -->
        <div slot="TeachingExaminationNumberRender" slot-scope="text, record">
          <span>
            {{record.TeachingExaminationNumber !== 0 ? record.TeachingExaminationNumber + '人' : '--'}}
          </span>
        </div>
        <!-- 有效数据 -->
        <div slot="ValidExaminationNumberRender" slot-scope="text, record">
          <span>
            {{record.ValidExaminationNumber !== 0 ? record.ValidExaminationNumber + '人' : '--'}}
          </span>
        </div>
        <!-- 无效数据 -->
        <div slot="InvalidExaminationNumberRender" slot-scope="text, record">
          <span>
            {{record.InvalidExaminationNumber !== 0 ? record.InvalidExaminationNumber + '人' : '--'}}
          </span>
        </div>
        <!-- 操作 -->
        <span slot="operaRender" slot-scope="text, record">
          <a @click="watchInfo(record)">查看</a>
          <a-divider type="vertical" />
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item :disabled="status === 2" @click="editTeaInfo(record)">编辑</a-menu-item>
              <a-menu-item :disabled="status === 2" @click="deletes(record)">删除</a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </XyAntTable>
    </div>
    <!-- 选择参与评价的考试 -->
    <Modal v-model="addExaminModel"
            :styles="{top:'70px',width:'800px'}"
            :transfer="false"
            title="选择参与评价的考试"
            :mask-closable="false"
            :closable="false">
      <row>
        <i-col span="24"
                style="padding-right: 10px;">
          <div class="clearfix">
            <i-col span="24">
              <i-col span="12">
                <div style="display:block; margin-bottom: 10px;">
                  <span class="f14">评价考试：</span>
                  <i-select v-model="studentYear"
                            ref="resetSelectLeft"
                            style="width:160px;"
                            @on-change="studentYearChange">
                    <i-option v-for="item in studentYearList"
                              :key="item.Value"
                              :value="item.Value">{{item.Text}}</i-option>
                  </i-select>
                  <tooltip class="option-problem"
                            style="margin-left:10px"
                            word-wrap
                            max-width="200"
                            placement="top"
                            content="评价考试，以所选的此次考试来评价教师。">
                    <Icon type="md-help-circle"
                          size="18"
                          color="#ffad33" />
                  </tooltip>
                </div>
              </i-col>
              <i-col span="12">
                <div style="display:block; margin-bottom: 10px;">
                  <span class="f14">参考考试：</span>
                  <i-select v-model="studentGrade"
                            clearable
                            ref="resetSelectRight"
                            style="width:160px;"
                            :disabled="isStudentGrade"
                            @on-change="studentGradeChange">
                    <i-option v-for="item in studentGradeList"
                              :key="item.Value"
                              :value="item.Value">{{item.Text}}</i-option>
                  </i-select>
                  <tooltip class="option-problem"
                            style="margin-left:10px"
                            word-wrap
                            max-width="200"
                            placement="top"
                            content="参考考试，以所选的此次考试作为对比依据。">
                    <Icon type="md-help-circle"
                          size="18"
                          color="#ffad33"></Icon>
                  </tooltip>
                </div>
              </i-col>
            </i-col>

            <i-col span="24">
              <div>
                <div style="margin: 20px 0px 12px;font-size: 16px; font-weight:bold; display:inline-block;">评价课程</div>
                <div style="margin-bottom:6px; display:inline-block; margin-left:10px;">
                  <checkbox v-if="groupList.length > 0"
                            :value="checkAll"
                            @on-change="handleCheckAll">全选</checkbox>
                </div>
              </div>
              <div style="height:250px;overflow-y:auto;">
                <checkbox-group v-if="groupList.length > 0"
                                v-model="checkAllGroup"
                                @on-change="checkAllGroupChange"
                                >
                  <checkbox v-for="item in groupList"
                            :key="item.SubjectId"
                            :label="item.SubjectId"
                            style="width:100px;margin-bottom:10px;"
                            class="nowrap">{{item.SubjectName}}</checkbox>
                </checkbox-group>
                <div v-if="groupList.length === 0 && !loadingGroupList" class="modal-null">
                  <img class="img" src="@/assets/common/nullData.svg" alt="图片"/>
                  <span class="text">该搜索条件下没有评价课程。</span>
                </div>
              </div>
            </i-col>
          </div>
        </i-col>
      </row>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="ok">确定</Button>
      </div>
    </Modal>
    <!-- 编辑 -->
    <Modal v-model="isEditTeacher"
            :styles="{top:'70px',width:'820px'}"
            :transfer="false"
            :title="status!==2?'编辑':'查看'"
            :loading="loading"
            :mask-closable="false"
            :closable="false">
      <div>
        <div v-if="status!==2"
              class="title-describe">移除某位学生的考试成绩，用来变更参与本次评价的相关教学成绩。</div>
        <div class="edit-student-info-title">
          <span class="edit-student-info-title-key">教师：</span>
          <span class="edit-student-info-title-name">{{teacherName}}</span>
          <span class="edit-student-info-title-key">课程：</span>
          <span class="edit-student-info-title-name">{{subjectName}}</span>
          <span class="edit-student-info-title-key">班级：</span>
          <span class="edit-student-info-title-name">{{className}}</span>
        </div>
        <ul class="clearfix"
            style="max-height:400px;overflow-y:auto;">
          <li class="edit-student fl nowrap pr"
              v-for="(item, index) in studentList"
              :key="index">
            <div style="margin: 6px 0px;">
              <b :title="item.StudentName"
                  style="font-size:15px;">{{item.StudentName}}</b>
            </div>
            <div style="color:#7f7f7f;font-size: 12px;"
                  :title="'用户名：'+item.UserName">{{item.UserName}}</div>
            <span v-if="status!==2&&studentList.length>1"
                  class="trash-icon"
                  @click="studentDel(item)">
              <Icon type="ios-trash"
                    class="icon-trash" />
            </span>
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="EditTeacherCancel">关闭</Button>
        <checkbox v-if="status!==2"
                  class="quota-check"
                  v-model="delBtnLine"
                  style="position:absolute;right:20px;bottom:18px;">继续删除</checkbox>
      </div>
    </Modal>
    <Modal v-model="watchDesc"
            :transfer="false"
            :title="isEdit ? '编辑' : '查看'"
            :mask-closable="false"
            :closable="false"
            width="900"
            class="watch">
            <div v-if="teacherInfo" class="xy-flex tea-info">
              <p class="col0-85" v-text="teacherInfo.TeacherName"></p>
              <p class="col0-85" v-text="teacherInfo.TeachClassName"></p>
            </div>
      <XyAntTable
        :columns="studentLt"
        :dataSource="sudentData"
        nullData="暂无学生。"
        :tableLoading="tableLoadingT"
        :isPage="false"
        style="height:380px; overflow: scroll;">
        <!-- 头像 -->
        <div slot="StudentIconRender" slot-scope="text, record">
          <div v-if="!record.StudentIcon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
            <span class="head-font">
              {{ xy.showName(record.StudentName)}}
            </span>
          </div>
          <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.StudentIcon + '?' + Math.random() * 15">
        </div>
        <!-- 评价考试成绩 -->
        <div slot="TeachingExamScoreRender" slot-scope="text, record">
          <span>
            {{record.TeachingExamScore === null ? '缺考' : record.TeachingExamScore}}
          </span>
        </div>
        <!-- 参考考试成绩 -->
        <div slot="ReferenceExamScoreRender" slot-scope="text, record">
          <span>
            {{record.ReferenceExamScore === null ? '缺考' : record.ReferenceExamScore}}
          </span>
        </div>
        <!-- 是否有效数据 -->
        <div slot="IsEffictvieRender" slot-scope="text, record">
          <div v-if="isEdit && status !== 2">
            <!-- IsEffictvie：1未选状态 2选中状态 0不可编辑 -->
            <!-- default-checked 初始是否选中, checked 当前是否选中 -->
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :default-checked="record.IsEffictvie === 2"
              :disabled="record.IsEffictvie === 0"
              @change="switchChange(record)" />
          </div>
          <span v-else>
            {{record.IsEffictvie === 2 ? '是' : '否'}}
          </span>
        </div>
      </XyAntTable>
      <div v-if="!isEdit" class="desc-but" slot="footer">
        <Button class="xy-modal-primary" shape="circle" @click="closeWatchDesc">关闭</Button>
      </div>
      <div v-else class="desc-but" slot="footer">
        <Button class="xy-modal-close" @click="closeWatchDesc">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="submitSwitchChange">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    name: 'EvaStting',
    data () {
      return {
        tableLoading: true,
        pageList: 0, // 当前页数据条数
        datatable: [],
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
        },
        columns: [
          {
            title: ' ',
            dataIndex: 'TeacherIcon',
            scopedSlots: { customRender: 'TeacherIconRender' },
            className: 'table-pic',
            width: 18
          },
          {
            title: '任课教师',
            dataIndex: 'TeacherName',
            width: 160
          },
          {
            title: '课程',
            dataIndex: 'SubjectName',
            width: 150
          },
          {
            title: '教学班',
            dataIndex: 'TeachClassName',
            scopedSlots: { customRender: 'TeachClassNameRender' }
          },
          {
            title: '评价考试',
            dataIndex: 'TeachingExaminationNumber',
            scopedSlots: { customRender: 'TeachingExaminationNumberRender' },
            width: 100
          },
          {
            title: '有效数据',
            dataIndex: 'ValidExaminationNumber',
            scopedSlots: { customRender: 'ValidExaminationNumberRender' },
            width: 100
          },
          {
            title: '无效数据',
            dataIndex: 'InvalidExaminationNumber',
            scopedSlots: { customRender: 'InvalidExaminationNumberRender' },
            width: 100
          },
          {
            title: '操作',
            dataIndex: 'opera',
            scopedSlots: { customRender: 'operaRender' },
            width: 150
          }
        ],

        teacherInfo: null,
        tableUrl: '',
        tableLoadingT: false,
        sudentData: [],
        watchDesc: false,
        delBtnLine: false,
        status: this.$route.query.status * 1,
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        teachingProjectID: this.$route.query.teachingProjectID * 1 || 0,
        loading: true,
        checkAll: false,
        checkAllGroup: [],
        schoolID: this.$route.query.schoolID * 1,
        studentYear: '',
        studentYearList: [],
        isStudentGrade: true,
        studentGrade: 0,
        studentGradeList: [],
        groupList: [],
        loadingGroupList: false,
        projectId: '',
        isObject: false,
        arrs: [],
        partakeClassCount: '',
        partakeStudentCount: '',
        partakeTeacherCount: '',
        addExaminModel: false,
        isEditTeacher: false,
        studentList: [],
        AssessObjectId: '',
        teacherName: '',
        subjectName: '',
        className: '',
        EvaExamName: null,
        RefeExamName: null,
        isEdit: false,
        studentLt: [],
        changeDataList: [] // 当前编辑的学生集合
      }
    },
    created () {
      this.getExamInfo()
      this.featchTable()
    },
    methods: {
      // 查看编辑学生columns
      resetSLTcolumns () {
        this.studentLt = [
          {
            title: ' ',
            dataIndex: 'StudentIcon',
            scopedSlots: { customRender: 'StudentIconRender' },
            className: 'table-pic',
            width: 18
          },
          {
            title: '学生姓名',
            dataIndex: 'StudentName'
          },
          {
            title: '用户名',
            dataIndex: 'UserName'
          },
          {
            title: '评价考试成绩',
            dataIndex: 'TeachingExamScore',
            scopedSlots: { customRender: 'TeachingExamScoreRender' }
          },
          {
            title: '是否有效数据',
            width: 200,
            scopedSlots: { customRender: 'IsEffictvieRender' }
          }
        ]
      },
      // 导出
      async exportTable () {
        let params = {
          u: `${this.$store.state.apiPath}/api/AssessObject/ExportAssessProject`,
          d: JSON.stringify({
            assessProjectId: this.teachingProjectID
          })
        }
        let routeData = this.$router.resolve({
          path: '/downLoad',
          query: params
        })
        window.open(routeData.href, '_blank')
      },
      // 获取table/分页数据
      async featchTable () {
        this.tableLoading = true
        let obj = {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          AssessProjectID: this.teachingProjectID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssessObject/GetPagedAssessObjectsSummary`, obj)
        if (res.success) {
          this.pagination.total = res.data.totalRecords
          this.datatable = res.data.data
          if (res.data.data !== null && res.data.data.length > 0) {
            this.pageList = res.data.data.length
          }
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.featchTable()
      },
      editTeaInfo (row) {
        this.teacherInfo = row
        this.changeDataList = []// 编辑时置空编辑的学生集合
        this.sudentData = []
        this.isEdit = true
        this.resetSLTcolumns()
        this.watchDesc = true
        this.featchStuInfo(row)
      },
      // saveInfo (row) {},
      deletes (row) {
        this.xy.confirm('删除', `您确定要删除“${row.TeachClassName}”吗？`, () => {
          this.toDele(row)
        })
      },
      async toDele (row) {
        this.xy.loading()
        const params = {
          assessObjectClassId: row.AssessObjectClassID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssessObject/DeleteTeachClass`, params)
        if (res.success) {
          if (this.pageList > 1) {
            this.pageList = this.pageList - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.xy.msgSuc('删除成功。')
          this.featchTable()
        }
        this.xy.unloading()
      },
      // 详情switch切换
      switchChange (row) {
        var params = {
          AssessObjectID: row.AssessObjectID,
          AssessProjectID: row.AssessProjectID,
          AssessObjectClassID: row.AssessObjectClassID,
          StudentID: row.StudentID,
          IsEffictvie: row.IsEffictvie === 2 ? 1 : row.IsEffictvie === 1 ? 2 : ''
        }
        var hasCur = false
        if (this.changeDataList.length > 0) {
          for (var i = 0; i < this.changeDataList.length; i++) {
            if (this.changeDataList[i].StudentID === row.StudentID) {
              hasCur = true
              this.changeDataList.splice(i, 1, params)
            }
          }
          if (!hasCur) {
            this.changeDataList.push(params)
          }
        } else {
          this.changeDataList.push(params)
        }
      },
      // 保存
      async submitSwitchChange () {
        if (this.changeDataList.length === 0) {
          this.xy.msgError('您还没有修改学生的“是否有效数据”状态。')
          return false
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AssessObject/EditAssessObjectClassStudentInfo`, {
          EditAssessObjectClassStudentInfoInputs: this.changeDataList
        }, true)
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          this.watchDesc = false
          this.resetSLTcolumns()
          this.featchStuInfo(this.teacherInfo)
          this.featchTable()
          // 步骤条
          let dtList = this.$store.state.evaluate.topHeader
          for (let i = 0; i < dtList.length; i++) {
            if (i < 3) {
              dtList[i].isLoad = 1
            } else {
              dtList[i].isLoad = 0
            }
          };
          this.$store.commit('evaluate/changetopHeader', dtList)
          this.$store.commit('common/getParam', Object.assign(this.$route.query, {
            steps: 1
          }))
        } else {
          this.xy.msgError('保存失败。')
          this.resetSLTcolumns()
          this.featchStuInfo(this.teacherInfo)
        }
        this.xy.unloading()
      },
      // 取消
      closeWatchDesc () {
        this.watchDesc = false
        this.featchTable()
      },
      // 查看详情
      watchInfo (row) {
        // console.log(row)
        this.teacherInfo = row
        this.sudentData = []
        this.isEdit = false
        this.resetSLTcolumns()
        this.watchDesc = true
        this.featchStuInfo(row)
      },
      async featchStuInfo (row) {
        this.tableLoadingT = true
        const params = {
          assessObjectId: row.AssessObjectID,
          assessProjectId: row.AssessProjectID,
          assessObjectClassId: row.AssessObjectClassID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssessObject/GetAssessObjectClassStudentInfos`, params)
        if (res.success) {
          if (res.data && res.data.length) {
            this.sudentData = res.data
            if (res.data[0].IsExistedReferenceExam) {
              this.studentLt.splice(4, 0, {
                title: '参考考试成绩',
                dataIndex: 'ReferenceExamScore',
                scopedSlots: { customRender: 'ReferenceExamScoreRender' }
              })
            } else {
              if (this.studentLt[4].title === '参考考试成绩') {
                this.studentLt.splice(4, 1)
              }
            }
          }
        }
        this.tableLoadingT = false
      },
      // 根据方案ID获取评价考试和参考考试的名称
      async getExamInfo () {
        const params = {
          projectId: this.teachingProjectID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssessObject/GetExamInfo`, params)
        if (res.success) {
          this.EvaExamName = res.data.EvaExamName
          this.RefeExamName = res.data.RefeExamName
        }
      },
      // 列表样式
      upFunc (vals) {
        vals.isUp = !vals.isUp
      },
      // 添加评价考试弹框
      addMin () {
        this.addExaminModel = true
        this.GetExamEvaDropDownList()
      },

      // 获取评价考试
      async GetExamEvaDropDownList () {
        const params = {
          AssessProjectId: this.teachingProjectID
          // AchievementRecordId: this.studentYear
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssessObject/GetExamEvaDropDownList`, params)
        if (res.success) {
          if (res.data.length > 0) {
            this.studentYearList = res.data
            var index = this.studentYearList.map(function (item) {
              return item.IsSelected
            }).indexOf(true)
            if (index !== -1) {
              this.studentYear = this.studentYearList[index].Value
              this.studentYearChange()
            }
          }
        }
      },

      // 选择评价考试
      studentYearChange () {
        this.isStudentGrade = false
        this.studentGrade = 0
        this.studentGradeList = []
        this.GetStudentDropDownList()
        this.GetExamSubjectList()
      },

      // 获取考试下拉
      async GetStudentDropDownList () {
        this.xy.loading()
        if (this.studentYear) {
          const params = {
            AssessProjectId: this.teachingProjectID,
            AchievementRecordId: this.studentYear
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssessObject/GetExamEvaDropDownList`, params)
          if (res.success) {
            if (res.data.length > 0) {
              this.studentGradeList = res.data
              var index = this.studentGradeList.map(function (item) {
                return item.IsSelected
              }).indexOf(true)
              if (index !== -1) {
                this.studentGrade = this.studentGradeList[index].Value
              }
            }
          }
        } else {
          this.studentGradeList = []
        };
      },

      // 获取考试课程列表
      async GetExamSubjectList () {
        this.loadingGroupList = true
        if (this.studentYear) {
          const params = {
            assessProjectId: this.teachingProjectID,
            achievementRecordID: this.studentYear
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssessObject/GetExamSubjectList`, params)
          this.checkAllGroup = []
          this.groupList = []
          if (res.success) {
            if (res.data.length > 0) {
              this.groupList = res.data
              this.groupList.map((item) => {
                if (item.IsSelected) {
                  this.checkAllGroup.push(item.SubjectId)
                }
              })
              if (this.checkAllGroup.length === res.data.length) {
                this.checkAll = true
              } else {
                this.checkAll = false
              }
            }
            this.loadingGroupList = false
          }
        } else {
          this.groupList = []
        }
        this.xy.unloading()
      },

      // 选择参考考试
      studentGradeChange (val) {
        // console.log(val)
      },

      // 全选评价课程
      handleCheckAll (val) {
        this.checkAll = val
        if (this.checkAll) {
          this.checkAllGroup = this.groupList.map(val => val.SubjectId)
        } else {
          this.checkAllGroup = []
        };
      },

      // 选择评价课程
      checkAllGroupChange (data) {
        if (data.length === this.groupList.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        };
      },

      // 添加要评价教师
      async ok () {
        if (this.checkAllGroup.length > 0) {
          this.xy.loading()
          const params = {
            TeachingExaminationId: this.studentYear,
            ReferenceExaminationId: this.studentGrade,
            AssessProjectId: this.teachingProjectID,
            SubjectList: this.checkAllGroup
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/AssessObject/Create`, params, true)
          if (res.success) {
            this.projectId = this.teachingProjectID
            if (res.data.errcode === '0') {
              this.xy.smgError(res.msg || '未查询到相关教师，请重新选择。')
            // let lens = res.data.result.SetpuStep
            // for (let i = 0; i < lens; i++) {
            //   Details.tabList[i].steps = 1
            // };
            } else {
              this.xy.msgSuc(res.msg || '设置成功。')
              this.addExaminModel = false
              let lens = res.data.result.SetpuStep + 1
              let dtList = this.$store.state.evaluate.topHeader
              for (let i = 0; i < dtList.length; i++) {
                if (i < lens) {
                  dtList[i].isLoad = 1
                } else {
                  dtList[i].isLoad = 0
                }
              };
              this.$store.commit('evaluate/changetopHeader', dtList)
              this.$store.commit('common/getParam', Object.assign(this.$route.query, {
                steps: 1
              }))
              this.featchTable()
            }
            this.clearFunc()
            this.isObject = false
            this.addExaminModel = false
          } else {
            this.xy.msgError(res.msg || '设置失败。')
          }
          this.xy.unloading()
          this.getExamInfo()
        } else {
          this.xy.msgError('请选择要评价的课程。')
        }
      },
      cancel () {
        this.addExaminModel = false
        this.isObject = false
        this.clearFunc()
      },
      clearFunc () {
        this.checkAll = false
        this.checkAllGroup = []
        this.classList = []
        this.groupList = []
        this.$refs.resetSelectLeft.clearSingleSelect()
        this.$refs.resetSelectRight.clearSingleSelect()
      },

      // 删除学生
      async studentDel (vals) {
        this.xy.loading()
        const params = {
          assessProjectId: this.teachingProjectID,
          objectId: vals.AssessObjectID,
          studentId: vals.StudentId
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssessObject/DeleteStudent`, params, true)
        if (res.success) {
          this.xy.msgSuc(res.msg || '删除成功。')
          this.studentList = res.data
          this.isEditTeacher = true
          if (this.delBtnLine) {
            this.isEditTeacher = true
          } else {
            this.isEditTeacher = false
          };
          this.featchTable()
          for (let i = 0; i < this.studentList.length; i++) {
            if (this.studentList[i].StudentId === vals.StudentId) {
              this.studentList.splice(i, 1)
            };
          };
        } else {
          this.xy.msgError(res.msg || '删除失败。')
        }
        this.xy.unloading()
      },
      EditTeacherCancel () {
        this.delBtnLine = false
        this.isEditTeacher = false
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../Css/Objects.css';
  .eva-setting {
    padding: 10px 0 0;
    .xy-content-title {
      padding: 0;
    }
    .desc-but {
      text-align: right;
    }
    .objects-exam-info {
      padding: 10px 0;
    }
    /deep/ .watch {
      .tea-info {
        padding: 0 0 15px;
        > p:nth-of-type(1) {
          font-weight: bold;
          margin-right: 20px;
        }
      }
    }
  }
</style>
