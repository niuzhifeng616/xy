<template>
    <div id="FuncInfo">
        <div class=" head-tit">
            <Button class="xy-primary" icon="md-add" @click='addSub'>添加科目</Button>
            <!-- 还没有这个功能 -->
            <!-- <Button class="xy-info">批量删除</Button> -->
        </div>
        <Alert style="width:616px" show-icon closable>{{direction}}</Alert>
        <XyAntTable
          :rowSelection="tableRowSelection"
          :columns="columns"
          :dataSource="dataList"
          :tableLoading="tableLoading"
          @change="handleTableChange"
          :scrollx="'max-content'"
          :isScroll="true"
          :pagination="pagination"
          >
          <div style="min-width: 100px" slot="SubjectName" slot-scope="text, record">
            <span
              v-html="record.SubjectName"
              class="table-el-hover"
              @click="Edit(record.key)"
              >
            </span>
          </div>
          <div slot="Time" slot-scope="text, record">
            <span>{{record.AchievementStartTimeName}} - {{record.AchievementEndTimeName}}</span>
          </div>
          <!-- 操作 -->
          <span slot="action" slot-scope="text, record">
            <a @click="Edit(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a @click="Delete(record.key)">删除</a>
          </span>
        </XyAntTable>
        <!-- 编辑框 -->
        <modal v-model="modalEdit" :transfer="false" title="编辑考试时间" :mask-closable="false">
            <div class="dialog-model-content">
                <div class="edit_title">
                  <span>考试课程</span>
                  <span>{{editForm.sub}}</span>
                </div>
                <i-form ref="editForm" :label-width="100" :model="editForm" :rules="editFormRules" label-position="left">
                    <form-item label="考试日期：" prop="date" labelFor="data">
                        <date-picker type="date" style="width:270px;" v-model="editForm.date" :options='options' elementId="data">
                        </date-picker>
                    </form-item>
                    <form-item label="开考时间：" prop="time" labelFor="time">
                        <time-picker type="time" style="width:270px;" format="HH:mm" v-model="editForm.time" :editable="false" elementId="time">
                        </time-picker>
                    </form-item>
                    <form-item label="考试时长：" prop="duration" labelFor="duration">
                        <input-number style="width:270px;" v-model="editForm.duration" elementId="duration"></input-number>
                        <span style="margin-left: 10px; line-height: 24px; color: rgba(51,51,51,0.65);">分钟</span>
                    </form-item>
                </i-form>
            </div>
            <div slot="footer">
              <Button class="xy-modal-close" @click="EditCancel">取消</Button>
              <Button class="xy-modal-primary" shape="circle" @click="EditOk" :loading="editLoading">保存</Button>
            </div>
        </modal>
        <!-- 添加框 -->
        <modal
          :styles="{width:'700px'}"
          v-model="modalAdd"
          :transfer="false"
          title="添加考试课程"
          :mask-closable="false"
          :closable="true"
          :loading="addLoading"
          v-cloak
          >
            <div>
                <div class="modal_add">
                    <div class="modal_add_time">
                        <p>考试时间</p>
                        <div class="time_sel">
                            <i-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top">
                                <form-item label="考试日期" prop="date" labelFor="addData" style="width: 100%; text-align: left">
                                    <date-picker type="date" v-model="addForm.date" :options='options' elementId="addData">
                                    </date-picker>
                                </form-item>
                                <form-item label="开考时间" prop="time" labelFor="addTime" style="width: 100%; text-align: left">
                                    <time-picker type="time" format="HH:mm" v-model="addForm.time" :editable="false" elementId="addTime">
                                    </time-picker>
                                </form-item>
                                <form-item label="考试时长" prop="duration" labelFor="addDuration" style="width: 100%; text-align: left">
                                    <input-number v-model="addForm.duration" style="width:178px;" elementId="addDuration">
                                    </input-number>
                                    <span style="display: inline-block; padding-left: 10px;width: 40px;box-sizing: border-box;font-size: 14px">分钟</span>
                                </form-item>
                            </i-form>
                        </div>
                    </div>
                    <div class="modal_add_sub">
                        <div class="sub_sel">
                            <!-- 课程类别一 -->
                            <i-select v-model="addSubject" style="width:384px; text-align: left;" @on-change='ChangeCategory'>
                                <i-option v-for="item in subList" :value="item.id" :key="item.id" v-cloak>
                                    {{ item.name }}
                                </i-option>
                            </i-select>
                            <!-- 课程类别二 -->
                            <i-select v-show='addSubject===3' @on-change='ChangeLocalSubject' v-model="localSubject" style="width:384px; text-align: left;">
                                <i-option v-for="item in localSubList" :value="item.SubjectCategoryID" v-cloak :key="item.SubjectCategoryID">{{ item.SubjectCategoryName }}</i-option>
                            </i-select>
                        </div>
                        <div class="sub_div">
                            <div v-if='subjects.length===0' v-cloak class="no-data-box" style="padding: 0;">
                                <img class="no-data-img" src="../Image/no-Data.png" />
                                <span class="no-data-text">您还没有课程的信息，请添加科目。</span>
                            </div>
                            <div
                              v-for='(item,index) in subjects'
                              :key="index"
                              class="nowrap sub_div_child"
                              :class='{sel_sub:item.isSel}'
                              v-cloak @click='SelSubject(index)'
                              :title="item.SubjectName"
                              >
                              <span v-text='item.SubjectName'></span>
                              <i></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <checkbox v-model="addIsContinue" style="margin-left: 20px; float: left; line-height: 36px;">保存并继续</checkbox>
                <Button class="xy-modal-close" @click='AddCancel'>
                    <span>取消</span>
                </Button>
                <Button class="xy-modal-primary" shape="circle" @click='AddOk'>保存</Button>
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
    name: 'ExamSubject',
    data () {
      let validateDuration = (rule, value, callback) => {
        let arrminutes = this.modalEdit === true ? this.editForm.time.split(':') : this.addForm.time.split(':')
        let minutes = parseInt(arrminutes[0]) * 60 + parseInt(arrminutes[1])
        if ((value - 0 > 180) || (value - 0 <= 0)) {
          return callback(new Error('考试时间在1-180分钟'))
        } else if (value + minutes >= 24 * 60) {
          return callback(new Error('考试时间不能跨天'))
        } else {
          return callback()
        }
      }
      return {
        apiPath: `${this.$store.state.apiPath}/api/ArrangeSupervisorExam/`,
        direction: '设置过考试学生后本页内容不可更改。若需更改，请先删除考试学生。',
        // 当前方案的信息
        ExamInf: {},
        ArrangeSupervisorExamID: 0,
        // 已经选择的科目
        dataList: [],
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
            title: '科目名称',
            dataIndex: 'SubjectName',
            scopedSlots: { customRender: 'SubjectName' }
          },
          {
            title: '考试日期',
            dataIndex: 'AchievementDateWeekName',
            width: 200
          },
          {
            title: '考试时间',
            dataIndex: 'Time',
            width: 160,
            scopedSlots: { customRender: 'Time' }
          },
          {
            title: '考试时长',
            dataIndex: 'AchievementTime',
            width: 120,
            scopedSlots: { customRender: 'AchievementTime' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 120,
            scopedSlots: { customRender: 'action' }
          }
        ],
        tableLoading: false,
        selectedRowKeys: [],
        selectionAll: [],
        // 空卡片数组
        empty: [],
        // ------------------------------编辑模态框
        modalEdit: false,
        editLoading: false,
        editForm: {
          sub: '语文',
          date: '',
          time: '',
          duration: 0
        },
        editFormRules: {
          date: [
            { required: true, type: 'date', message: '考试日期不能为空', trigger: 'change' }
          ],
          time: [
            { required: true, type: 'string', message: '开考时间不能为空', trigger: 'change' }
          ],
          duration: [
            { required: true, type: 'number', message: '考试时间不能为空', trigger: 'blur' },
            { validator: validateDuration, trigger: 'change' }
          ]
        },
        // --------------------------------添加科目模态框
        modalAdd: false,
        addLoading: true,
        addForm: {
          date: '',
          time: '',
          duration: 0
        },
        // 临时保存添加框的时间
        copyAddFormDate: '',
        addFormRules: {
          date: [
            { required: true, type: 'date', message: '考试日期不能为空', trigger: 'change' }
          ],
          time: [
            { required: true, type: 'string', message: '开考时间不能为空', trigger: 'change' }
          ],
          duration: [
            { required: true, type: 'number', message: '考试时长不能为空', trigger: 'blur' },
            { validator: validateDuration, trigger: 'change' }
          ]
        },
        // 设置不可选日期
        options: {
          disabledDate (date) {
            // console.log(date)
            return true
          }
        },
        // 是否保存并继续
        addIsContinue: false,
        // 选择的课程分类
        addSubject: 0,
        subList: [
        ],
        // 选择的本校课程分类
        localSubject: 0,
        localSubList: [
        ],
        // 校本课的所有课程
        localSubjectList: [],
        subjects: [],
        params: this.$store.state.educationAffairs.arrange
      }
    },
    created () {
      // 获取方案ID
      if (this.params.ArrangeSupervisorExamID > 0) {
        this.ArrangeSupervisorExamID = this.params.ArrangeSupervisorExamID
      }
      // 获取方案信息
      this.GetArrangeSupervisorExam()
      // 获取当前方案已经选择科目
      this.GetAllExamSubject()
      // 获取课程类别
      this.GetSubjectCategory()
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange
        }
      }
    },
    methods: {
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      handleTableChange () {
        this.GetAllExamSubject()
      },
      // -----------------------------------------------获取初始数据----------------------------------------
      // 获取方案信息
      async GetArrangeSupervisorExam () {
        const params = {
          id: this.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(this.apiPath + 'GetById', params)

        if (res.success) {
          this.ExamInf = res.data
          this.addForm.date = new Date(this.ExamInf.StartTime)
          // 设置不可选日期
          this.options = {
            disabledDate (date) {
              // console.log(date.valueOf())
              return (date.valueOf() < new Date(res.data.StartTime.replace(/-/g, '/')).getTime()) || (date.valueOf() > new Date(res.data.EndTime.replace(/-/g, '/')).getTime())
            }
          }
        }
      },
      // 获取当前方案已经选择科目
      async GetAllExamSubject () {
        this.selectedRowKeys = []
        this.selectionAll = []
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(this.apiPath + 'GetAllExamSubject', params)
        this.tableLoading = false
        if (res.success) {
          this.dataList = res.data
          this.dataList.map((item, index) => {
            this.$set(item, 'key', index)
          })
        }
      },
      // 获取课程类别
      async GetSubjectCategory () {
        let res = await this.xy.get(this.apiPath + 'GetAchievementSubjectResult', null)

        if (res.success) {
          this.subList = res.data
          this.addSubject = this.subList[0].id
        }
      },
      // 根据课程分类获取课程
      async GetSubjectByTypeList (SubjectCategory) {
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          SubjectCategory: SubjectCategory
        }
        let res = await this.xy.get(this.apiPath + 'GetSubjectByTypeList', params)

        if (res.success) {
          // 非校本课程
          if (!res.data.SubjectCategoryModel) {
            this.subjects = res.data.SubjectDataList.map((item) => {
              item.isSel = false
              return item
            })
          } else {
            // 默认选择第一个类型
            this.localSubList = res.data.SubjectCategoryModel
            this.localSubject = this.localSubList[0].SubjectCategoryID
            // 筛选当前校本分类下的课程
            res.data.SubjectDataList = res.data.SubjectDataList.map((item) => {
              item.isSel = false
              return item
            })
            this.localSubjectList = res.data.SubjectDataList
            this.subjects = this.localSubjectList.filter((item) => {
              return item.SubjectCategoryID === this.localSubject
            })
          };
        }
      },
      // ----------------------------------------------------操作------------------------------------------------

      // -------------------------------------------编辑
      Edit (index) {
        if (this.params.Steps > 2) {
          if (this.params.IsEnabled === 1) {
            this.xy.msgError('正在排考中，无法添加考试科目。')
          } else {
            this.xy.msgError('请先清除考试学生数据。')
          };
        } else {
          this.$refs.editForm.resetFields()
          this.modalEdit = true
          this.editForm.sub = this.dataList[index].SubjectName
          this.editForm.date = new Date(this.dataList[index].AchievementDateName.replace(/-/g, '/'))
          this.editForm.time = this.dataList[index].AchievementStartTimeName
          this.editForm.duration = this.dataList[index].AchievementTime - 0
          this.editForm.ArrangeSupervisorSubjectID = this.dataList[index].ArrangeSupervisorSubjectID
          this.editForm.SubjectID = this.dataList[index].SubjectID
        };
      },
      // 编辑点击保存
      EditOk () {
        let option = {}
        option.ArrangeSupervisorExamID = this.ArrangeSupervisorExamID
        option.ArrangeSupervisorSubjectID = this.editForm.ArrangeSupervisorSubjectID
        option.SubjectIDs = [this.editForm.SubjectID]
        option.AchievementDate = this.xy.moment(new Date(this.editForm.date)).format('YYYY-MM-DD')
        option.AchievementStartTime = this.editForm.time
        option.AchievementTime = this.editForm.duration - 0
        option.SubjectType = 0

        this.$refs.editForm.validate((val) => {
          if (val) {
            this.toEdit(option)
            this.editLoading = true
          } else {
            this.editLoading = false
          }
        })
      },
      async toEdit (option) {
        let res = await this.xy.post(this.apiPath + 'EditExamSubject', option)

        if (res.success) {
          this.modalEdit = false
          this.xy.msgSuc(res.msg || '修改成功。')
          this.GetAllExamSubject() // 刷新列表
        }
        this.editLoading = false
      },
      EditCancel () {
        this.modalEdit = false
        this.$refs.editForm.resetFields()
      },
      // ---------------------------------------------删除
      Delete (index) {
        if (this.params.Steps > 2) {
          if (this.params.IsEnabled === 1) {
            this.xy.msgError('正在排考中，无法添加考试科目。')
          } else {
            this.xy.msgError('请先清除考试学生数据。')
          };
        } else {
          this.xy.confirm('删除', `您确定要删除'${this.dataList[index].SubjectName}'考试吗？`, () => {
            this.toDelete(index)
          })
        };
      },
      async toDelete (index) {
        const params = {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          ArrangeSupervisorSubjectID: this.dataList[index].ArrangeSupervisorSubjectID,
          SubjectID: this.dataList[index].SubjectID
        }
        let res = await this.xy.post(this.apiPath + 'DeleteExamSubject', params)

        if (res.success) {
          this.xy.msgSuc('删除成功。')
          if (res.data.result.Step === 1) {
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
          };
          this.GetAllExamSubject() // 刷新列表
        }
      },
      // ---------------------------------------------添加
      addSub () {
        if (this.params.Steps > 2) {
          if (this.params.IsEnabled === 1) {
            this.xy.msgError('正在排考中，无法添加考试科目。')
          } else {
            this.xy.msgError('请先清除考试学生数据。')
          };
        } else {
          this.$refs.addFormRef.resetFields() // 清空表单
          this.addForm.date = new Date(this.ExamInf.StartTime)
          this.modalAdd = true
          // 默认获取课程
          this.GetSubjectByTypeList(this.addSubject)
        };
      },
      // 选择课程类别改变
      ChangeCategory (SubjectCategory) {
        this.GetSubjectByTypeList(SubjectCategory)
      },
      // 选择的校本分类改变
      ChangeLocalSubject (locaSubject) {
        this.subjects = []

        this.localSubjectList.forEach((item) => {
          if (item.SubjectCategoryID === this.localSubject) {
            this.subjects.push(item)
          }
        })
      },
      // 选择科目
      SelSubject (index) {
        this.subjects[index].isSel = !this.subjects[index].isSel
      },

      // 添加点击保存
      AddOk () {
        this.$refs.addFormRef.validate(valid => {
          if (valid) {
            // if (!this.addIsContinue) {
            //   this.modalAdd = false
            // };
            let option = {}
            option.ArrangeSupervisorExamID = this.ArrangeSupervisorExamID
            option.ArrangeSupervisorSubjectID = 0
            option.AchievementDate = this.xy.moment(new Date(this.addForm.date)).format('YYYY-MM-DD')
            option.AchievementStartTime = this.addForm.time
            option.AchievementTime = this.addForm.duration - 0
            option.SubjectType = this.addSubject
            let SubjectIDs = []
            this.subjects.forEach((item) => {
              if (item.isSel) {
                SubjectIDs.push(item.SubjectID)
              }
            })
            option.SubjectIDs = SubjectIDs
            // 要添加的科目和已经添加科目的总数不能超过20
            if (option.SubjectIDs.length + this.dataList.length <= 20) {
              this.toAdd(option)
            } else {
              this.modalAdd = true
              this.xy.msgError('最多添加20门课程，当前还能添加' + (20 - this.dataList.length) + '门课程。')
            }
          }
        })
      },
      async toAdd (option) {
        let res = await this.xy.post(this.apiPath + 'CreateExamSubject', option, true)

        if (res.success) {
          this.xy.msgSuc('添加成功。')
          this.GetAllExamSubject() // 刷新列表
          this.GetSubjectByTypeList(this.addSubject) // 刷新课程
          this.copyAddFormDate = this.addForm.date
          this.$refs.addFormRef.resetFields()
          // 保存并继续
          if (this.addIsContinue) {
            this.addForm.date = this.copyAddFormDate
            this.modalAdd = true
          } else {
            this.modalAdd = false
          };
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
        } else {
          this.modalAdd = true
          this.xy.msgError(res.msg)
        };
      },
      AddCancel () {
        this.modalAdd = false
        this.addIsContinue = false
        this.addForm.date = ''
        this.addForm.time = ''
        this.addForm.duration = 0
        this.$refs.addFormRef.resetFields()
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../Css/ArrangeExamRoom/ExamSubject.less';
  #FuncInfo {
    padding: 20px;
  }
  .head-tit {
    padding: 20px 0;
  }
</style>
