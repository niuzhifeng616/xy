<!--添加评价对象：班主任/任课教师  -->
<template>
  <div>
    <Modal
      :value="isShow"
      :title="modalTitle"
      :mask-closable="false"
      :transfer="false"
      :closable="false"
      width="600"
      class="eva"
      v-if="isShow"
      >
      <div class="dialog-model-content">
        <Form class="class-form" ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right" :label-width="100">
          <FormItem label="问卷组名：" prop="QuestionnaireTitle" labelFor="item1">
            <Input
              v-model.trim="formValidate.QuestionnaireTitle"
              maxlength="15"
              placeholder="请输入问卷组名"
              elementId="item1"
              clearable
              :disabled="evaQuestion.QuestionnaireID>0"
              style="width:300px"
              />
          </FormItem>
          <FormItem label="被评角色：" prop="ApplyToRole">
            <RadioGroup v-model="formValidate.ApplyToRole" @on-change="changeRole">
              <Radio :label="1" :disabled="evaQuestion.QuestionnaireID>0">班主任</Radio>
              <Radio :label="2" :disabled="evaQuestion.QuestionnaireID>0">任课教师</Radio>
            </RadioGroup>
          </FormItem>
          <!-- 选择任课教师时显示年级 -->
          <FormItem label="年级：" prop="gradeYearId" v-if="formValidate.ApplyToRole===2">
            <Select v-model="formValidate.gradeYearId"
                    style="width:200px"
                    placeholder="请选择年级"
                    @on-change="getTeacClass">
              <Option v-for="(item,index) in gradeYearList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="class-box">
          <!-- 左侧选择 -->
          <div class="class-left" v-if="classTree.length > 0">
            <tree ref="Tree" :data="classTree" show-checkbox check-directly multiple @on-check-change="crouseTreeCheck"></tree>
          </div>
          <div class="class-left no-data" v-else>您还没有教师的信息，请添加教师。</div>
          <!-- 右侧展示 -->
          <div class="class-right" v-if="classTree.length > 0">
            <div v-for="item in classTree[0].children" :key="item.id"><!-- 年级/科目 -->
              <!-- item.indeterminate 子级部分选中、item.checked 子级全选 -->
              <p class="class-tree" v-if="item.indeterminate || item.checked">{{item.title}}</p>
              <template v-for="citem in item.children"><!-- 班 -->
                <span class="tag" v-if="citem.checked" :key="citem.id">
                  <Tag
                    :name="citem.title"
                    :closable="!citem.state"
                    @on-close="handleClose(item, citem)"
                    >
                    {{citem.title}}
                  </Tag>
                </span>
              </template>
            </div>
          </div>
        </div>
        <div class="line"></div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="modalCancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="modalConfirm">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>

  export default {
    props: {
      modalTitle: {
        type: String,
        default: '评价对象'
      },
      isShow: {
        type: Boolean,
        required: true
      },
      teacherTotal: {
        type: Number,
        default: 0
      },
      // 已经选中的教师
      teachers: {
        type: Array,
        required: true
      }
    },
    watch: {
      isShow (val) {
        if (val) {
          this.changeRole()
        } else {
          this.$refs.formValidate.resetFields()
        }
      }
    },
    computed: {
      evaQuestion () {
        return this.$store.state.evaluate.evaQuestion
      },
      evaRowObj () {
        return this.$store.state.evaluate.evaRowObj
      }
    },
    data () {
      return {
        formValidate: {
          QuestionnaireTitle: '',
          ApplyToRole: 1,
          gradeYearId: 0
        },
        gradeYearList: [],
        ruleValidate: {
          QuestionnaireTitle: [
            { required: true, message: '问卷组名不能为空', trigger: 'blur' },
            { max: 15, message: '问卷组名不能超过15个字', trigger: 'blur' }
          ],
          ApplyToRole: [
            { required: true, type: 'number', message: '请选择评价角色', trigger: 'change' }
          ]
        },

        classTree: [] // 组织数据
      }
    },
    created () {
      if (Object.keys(this.evaQuestion).length > 0) {
        this.formValidate.QuestionnaireTitle = this.evaQuestion.QuestionnaireTitle
        this.formValidate.ApplyToRole = this.evaQuestion.ApplyToRole
      }
    },
    mounted () {
    },
    methods: {
      // 切换角色
      changeRole () {
        if (this.formValidate.ApplyToRole === 1) {
          // 班主任
          this.classTree = []
          this.getHeadmasterClass()
        } else {
          // 任课教师
          this.classTree = []
          this.getStudentGrade() // 获取年级
        }
      },
      // 班主任-行政班
      async getHeadmasterClass () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingTeacher/GetHeadmasterGradeForYear`, {
          schoolDistrictId: this.evaRowObj.SchoolDistrictID,
          questionnaireID: this.evaQuestion.QuestionnaireID || 0,
          projectID: this.evaRowObj.TeachingProjectID
        })
        if (res.success) {
          if (res.data.length > 0) {
            let dataList = res.data
            let trees = []
            for (let i = 0; i < dataList.length; i++) {
              trees.push({
                index: i,
                id: dataList[i].StudentGradeForStudentYearID,
                title: dataList[i].StudentGradeForStudentYearName,
                expand: true,
                disableCheckbox: this.evaQuestion.QuestionnaireID > 0 && dataList[i].State, // (dataList[i].State：子级节点是否有选中的)
                disabled: this.evaQuestion.QuestionnaireID > 0 && dataList[i].State,
                children: []
              })
              for (let j = 0; j < dataList[i].List.length; j++) {
                trees[i].children.push({
                  index: j,
                  id: dataList[i].List[j].StudentOrganizationID,
                  title: dataList[i].List[j].StudentOrganizationName,
                  checked: dataList[i].List[j].State, // 初始默认为提交后的选中状态。(dataList[i].List[j].State：当前节点的选中状态)
                  disableCheckbox: dataList[i].List[j].State,
                  disabled: dataList[i].List[j].State,
                  state: dataList[i].List[j].State, // 提交后的选中状态
                  // 提交时传参使用
                  teacherID: dataList[i].List[j].TeacherID,
                  teacherName: dataList[i].List[j].TeacherName,
                  teacherFullName: dataList[i].List[j].TeacherFullName
                })
              };
            };
            this.classTree.push({
              id: 0,
              title: '全部',
              checked: false,
              expand: true,
              disableCheckbox: this.evaQuestion.QuestionnaireID > 0 && this.teacherTotal > 0, // 教师列表总数为0时
              disabled: this.evaQuestion.QuestionnaireID > 0 && this.teacherTotal > 0,
              children: trees
            })
          }
        }
        this.xy.unloading()
      },
      // 获取年级（任课教师）
      async getStudentGrade () {
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetStudentGradeStudentYearBySid`, {
          schoolDistrictID: this.evaRowObj.SchoolDistrictID
        })
        if (res.success) {
          this.gradeYearList = []
          this.gradeYearList.push({
            value: 0,
            tvalue: this.evaRowObj.SchoolDistrictID,
            label: '全部年级'
          })
          res.data.map(item => {
            this.gradeYearList.push({
              value: item.StudentGradeForStudentYearID,
              tvalue: item.StudentGradeID,
              label: item.FullName
            })
          })
          this.formValidate.gradeYearId = this.gradeYearList[0].value
          this.getTeacClass()
        }
        this.xy.unloading()
      },
      // 任课教师- 切换年级 获取班级
      async getTeacClass () {
        this.classTree = []
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingTeacher/GetTeacClassGradeForYear`, {
          SchoolDistrictId: this.evaRowObj.SchoolDistrictID,
          StudentGradeForStudentYearID: this.formValidate.gradeYearId,
          QuestionnaireID: this.evaQuestion.QuestionnaireID || 0,
          ProjectID: this.evaRowObj.TeachingProjectID
        })
        if (res.success) {
          if (res.data.length > 0) {
            let dataList = res.data
            let trees = []
            for (let i = 0; i < dataList.length; i++) {
              trees.push({
                id: dataList[i].DisciplineID,
                title: dataList[i].DisciplineName,
                expand: true,
                disableCheckbox: this.evaQuestion.QuestionnaireID > 0 && dataList[i].State, // (dataList[i].State：子级节点是否有选中的)
                disabled: this.evaQuestion.QuestionnaireID > 0 && dataList[i].State,
                children: []
              })
              for (let j = 0; j < dataList[i].List.length; j++) {
                trees[i].children.push({
                  id: dataList[i].List[j].StudentOrganizationID,
                  title: dataList[i].List[j].StudentOrganizationName,
                  checked: dataList[i].List[j].State, // 初始默认为提交后的选中状态。(dataList[i].List[j].State：当前节点的选中状态)
                  disableCheckbox: dataList[i].List[j].State,
                  disabled: dataList[i].List[j].State,
                  state: dataList[i].List[j].State, // 提交后的选中状态
                  // 提交时传参使用
                  studentGradeForStudentYearID: dataList[i].List[j].StudentGradeForStudentYearID,
                  teacherID: dataList[i].List[j].TeacherID,
                  teacherName: dataList[i].List[j].TeacherName,
                  teacherFullName: dataList[i].List[j].TeacherFullName,
                  classType: dataList[i].List[j].ClassType,
                  subjectName: dataList[i].List[j].SubjectName
                })
              };
            };
            this.classTree.push({
              id: 0,
              title: '全部',
              checked: false,
              expand: true,
              disableCheckbox: this.evaQuestion.QuestionnaireID > 0 && this.teacherTotal > 0, // 教师列表总数为0时
              disabled: this.evaQuestion.QuestionnaireID > 0 && this.teacherTotal > 0,
              children: trees
            })
          }
        }
        this.xy.unloading()
      },
      // tree点击
      crouseTreeCheck (val) { // tree点击
      },
      // 取消选择
      handleClose (item, citem) {
        this.classTree[0].indeterminate = false
        this.classTree[0].checked = false // 当前节点checked是true时，外部无法改变其子级的checked值，故手动设置
        let tree = this.classTree[0].children
        // 二级组织
        for (let i = 0; i < tree.length; i++) {
          if (tree[i].id === item.id) {
            tree[i].indeterminate = false
            tree[i].checked = false
            // 一级组织
            for (let j = 0; j < tree[i].children.length; j++) {
              // 当前班级
              if (tree[i].children[j].id === citem.id) {
                tree[i].children[j].checked = false // 当前节点checked是true时，外部无法改变其子级的checked值，故手动设置
                return false
              }
            }
          }
        }
      },
      // 取消添加评价
      modalCancel () {
        this.$emit('select-cancel')
      },
      // 保存评价
      modalConfirm () {
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            this.submit()
          }
        })
      },
      async submit () {
        if (this.classTree.length === 0) {
          this.xy.msgError('请选择班级') // 无数据时
          return
        }
        let arr = []
        this.classTree[0].children.map(item => {
          if (item.indeterminate === true || item.checked === true) {
            item.children.map(citem => {
              if (citem.checked) {
                arr.push({
                  'TeacherID': citem.teacherID,
                  'TeacherName': citem.teacherName,
                  'TeacherFullName': citem.teacherFullName,
                  'TeacherRole': this.formValidate.ApplyToRole,
                  'ClassType': this.formValidate.ApplyToRole, // 1.行政班(班主任)、2.教学班(任课教师)
                  'ClassName': this.formValidate.ApplyToRole === 1 ? `${item.title}${citem.title}` : `${citem.title}${citem.classType === 2 ? citem.subjectName : ''}`, // 班主任1: 学届+班；任课教师2: 班(type===2 拼学科)
                  'ClassID': citem.id,
                  'StudentGradeForStudentYearID': this.formValidate.ApplyToRole === 1 ? item.id : citem.studentGradeForStudentYearID, // 行政班传父级相应的ID，教学班传当前相应的ID
                  'DisciplineID': this.formValidate.ApplyToRole === 1 ? 0 : item.id, // 行政班传0，教学班传相应的ID
                  'TeachingTeacherID': 0, // 没用
                  'TeachingProjectID': this.evaRowObj.TeachingProjectID
                })
              }
            })
          }
        })
        if (arr.length === 0) {
          this.xy.msgError('请选择班级。')
          return
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StudentTeachingQuestionnaire/Create`, {
          'TeachingProjectID': this.evaRowObj.TeachingProjectID,
          'QuestionnaireTitle': this.evaQuestion.QuestionnaireID > 0 ? '' : this.formValidate.QuestionnaireTitle,
          'QuestionnaireID': this.evaQuestion.QuestionnaireID || 0,
          'ApplyToRole': this.formValidate.ApplyToRole,
          'ProjectTeacherList': arr
        })
        if (res.success) {
          this.xy.msgSuc('添加成功。')
          this.$emit('select-confirm', {
            name: this.formValidate.QuestionnaireTitle,
            id: res.data,
            role: this.formValidate.ApplyToRole
          })
        }
        this.xy.unloading()
      }
    }
  }
</script>
<style>
.eva .ivu-modal-body {
  padding: 0px !important;
}
</style>
<style lang="less" scoped>
.dialog-model-content {
  margin-bottom: 0;
  position: relative;
  .class-form {
    padding: 16px 16px 0 16px;
  }
  .class-box {
    min-height: 300px;
    padding: 0 16px;
    border-top: 1px solid #e8eaec;
    display: flex;
    max-height: 300px;
    .class-left {
      color: rgba(0,0,0,0.65);
      width: 50%;
      overflow-y: auto;
    }
    .class-left.no-data{
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ccc;
    }
    .class-right {
      width: 50%;
      padding: 15px 0 0 20px;
      overflow-y: auto;
      .class-tree{
        margin-bottom: 7px;
      }
      .tag{
          display: inline-block;
          >div{
            margin: 0 10px 10px 0;
            height: auto;
          }
        }
    }
  }
  .line {
    height: 300px;
    position: absolute;
    bottom: 0;
    width: 1px;
    left: 50%;
    border-right: 1px solid #e8eaec;
  }
}
</style>
