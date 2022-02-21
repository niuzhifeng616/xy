<template>
<div class="xy-content-module">
    <div class="xy-content-body">
            <div style="width: 410px;margin: 0 auto;">
                <i-form ref="formValidateCreate" label-position="top" :model="formValidateCreate" :rules="ruleValidateCreate">
                    <form-item label="用户名" prop="formUserName" labelFor="formUserName">
                        <i-input v-model.trim="formValidateCreate.formUserName" elementId="formUserName" clearable></i-input>
                    </form-item>
                    <form-item label="学籍号" prop="formSchoolCardNumber" labelFor="formSchoolCardNumber">
                        <i-input v-model.trim="formValidateCreate.formSchoolCardNumber" elementId="formSchoolCardNumber" clearable></i-input>
                    </form-item>
                    <form-item label="姓名" prop="formFullName" labelFor="formFullName">
                        <i-input v-model.trim="formValidateCreate.formFullName" elementId="formFullName" clearable></i-input>
                    </form-item>
                    <form-item label="性别" prop="formSex">
                        <i-select v-model="formValidateCreate.formSex">
                            <i-option v-for="item in sexArr" :value="item.ID" :key="item.Name" v-cloak>{{ item.Name }}</i-option>
                        </i-select>
                    </form-item>
                    <form-item label="密码" prop="formPassword" labelFor="formPassword">
                        <i-input v-model.trim="formValidateCreate.formPassword" elementId="formPassword" clearable></i-input>
                    </form-item>
                    <form-item label="入学年份" prop="formEnrollmentYear">
                        <i-select v-model="formValidateCreate.formEnrollmentYear" @on-change="yearChange">
                            <i-option v-for="item in enrollmentYear" :value="item" :key="item" v-cloak>{{item}}</i-option>
                        </i-select>
                    </form-item>
                    <form-item label="校区" prop="schoolID">
                        <i-select v-model="formValidateCreate.schoolID" @on-change="schoolChange">
                            <i-option
                              v-for="item in schoolData"
                              :value="item.SchoolDistrictID"
                              :key="item.SchoolDistrictName"
                              v-cloak
                              >
                              {{ item.SchoolDistrictName }}
                            </i-option>
                        </i-select>
                    </form-item>
                    <form-item label="教育阶段" prop="studentGradeID">
                        <i-select v-model="formValidateCreate.studentGradeID" @on-change="studentGradeChange">
                            <i-option
                              v-for="item in studentGradeData"
                              :value="item.StudentGradeID"
                              :key="item.StudentGradeID"
                              v-cloak
                              >
                              {{ item.StudentGradeName }}
                            </i-option>
                        </i-select>
                    </form-item>
                    <form-item label="班级" prop="studentOrgID">
                        <i-select v-model="formValidateCreate.studentOrgID">
                            <i-option
                              v-for="item in studentOrgData"
                              :value="item.StudentOrganizationID"
                              :key="item.StudentOrganizationID"
                              v-cloak
                              >
                              {{ item.StudentOrganizationName }}
                            </i-option>
                        </i-select>
                    </form-item>
                    <form-item label="手机号码" prop="formPhoneNumber" labelFor="formPhoneNumber">
                        <i-input v-model.trim="formValidateCreate.formPhoneNumber" elementId="formPhoneNumber" clearable></i-input>
                    </form-item>
                    <div class="text-center">
                        <Button  class="xy-info" @click="ReturnClick">取消</Button>
                        <Button @click="CreateClick"  class="xy-primary">保存</Button>
                    </div>
                </i-form>

            </div>
        </div>
</div>

</template>
<script>
  export default {
    name: 'StudentCreate',
    data () {
      return {
        sexArr: [
          { ID: 1, Name: '男' },
          { ID: 0, Name: '女' }
        ],
        enrollmentYear: [], // 入学年份Data
        schoolData: [], // 校区Data
        studentGradeData: [], // 教育阶段Data
        studentOrgData: [], // 班级Data
        formValidateCreate: {
          formSchoolCardNumber: '',
          formUserName: '',
          formFullName: '',
          formSex: 1,
          formPassword: '',
          formPhoneNumber: '',
          formEnrollmentYear: '', // 入学年份
          schoolID: '', // 校区
          studentGradeID: '', // 教育阶段
          studentOrgID: ''// 班级
        },
        ruleValidateCreate: {
          formSchoolCardNumber: [
            { required: true, message: '学籍号不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '学籍号不能超过30字符', trigger: 'blur' }
          ],
          formUserName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { type: 'string', max: 28, message: '用户名不能超过28字符', trigger: 'blur' }
          ],
          formFullName: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '姓名不能超过30字符', trigger: 'blur' }
          ],
          formSex: [
            { type: 'number', required: true, message: '性别不能为空', trigger: 'blur' }
          ],
          formPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { type: 'string', max: 20, min: 8, message: '密码需要8-20字符', trigger: 'blur' },
            // eslint-disable-next-line no-control-regex
            { pattern: /^[\x00-\xff]{8,20}$/, message: '请在英文状态下输入密码', trigger: 'blur' },
            { pattern: /((?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))[A-Za-z\d#@!~%^&*]{8,20}/, message: '请使用数字、字母、特殊字符中的两种组合，字母区分大小写', trigger: 'blur' }

          ],
          formPhoneNumber: [
            { pattern: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|191|198|199)\d{8}$/, message: '您输入的手机号码格式错误', trigger: 'blur' }
          ],
          formEnrollmentYear: [
            { type: 'number', required: true, message: '入学年份不能为空', trigger: 'change' }
          ],
          schoolID: [
            { type: 'number', required: true, message: '校区不能为空', trigger: 'change' }
          ],
          studentGradeID: [
            { type: 'number', required: true, message: '教育阶段不能为空', trigger: 'change' }
          ]
        },
        modalCreate: true
      }
    },
    created () {
      this.getEnrollmentYear()
    },
    mounted () {
      // this.$refs.formValidateCreate.resetFields()
    },
    methods: {
      // 入学年份
      async getEnrollmentYear () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Student/GetEnrollmentYear`, null, true)
        // this.xy.unloading()
        if (res.success) {
          this.enrollmentYear = res.data
          this.getSchool()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      yearChange (val) {
        this.formValidateCreate.formEnrollmentYear = val
        if (this.formValidateCreate.formEnrollmentYear !== '' &&
          this.formValidateCreate.schoolID !== '' &&
          this.formValidateCreate.studentGradeID !== '') {
          this.formValidateCreate.studentOrgID = ''
          this.getStudentOrganizations()
        }
      },
      // 校区
      async getSchool () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`, null, true)
        // this.xy.unloading()
        if (res.success) {
          this.schoolData = res.data
        } else {
          this.xy.msgError(res.msg)
        }
      },
      schoolChange (val) {
        this.formValidateCreate.schoolID = val
        if (this.formValidateCreate.schoolID !== '') {
          this.formValidateCreate.studentGradeID = ''
          this.studentOrgData = []
          this.formValidateCreate.studentOrgID = ''
          this.getStudentGrade()
        }
      },
      // 教育阶段
      async getStudentGrade () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetStudentGradeBySchool`, {
          schoolDististrictID: this.formValidateCreate.schoolID
        }, true)
        // this.xy.unloading()
        if (res.success) {
          this.studentGradeData = res.data
        } else {
          this.xy.msgError(res.msg)
        }
      },
      studentGradeChange (val) {
        if (val !== undefined) {
          this.formValidateCreate.studentGradeID = val
          if (this.formValidateCreate.formEnrollmentYear !== '' &&
            this.formValidateCreate.schoolID !== '' &&
            this.formValidateCreate.studentGradeID !== '') {
            this.formValidateCreate.studentOrgID = ''
            this.getStudentOrganizations()
          }
        }
      },
      // 班级列表
      async getStudentOrganizations () {
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Student/GetStudentOrganizations`, {
          schoolid: this.formValidateCreate.schoolID,
          studentYear: this.formValidateCreate.formEnrollmentYear,
          studentGradeID: this.formValidateCreate.studentGradeID
        }, true)
        // this.xy.unloading()
        if (res.success) {
          this.studentOrgData = res.data
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async CreateStudent () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/CreateStudent`, {
          UserName: this.formValidateCreate.formUserName,
          SchoolCardNumber: this.formValidateCreate.formSchoolCardNumber,
          FullName: this.formValidateCreate.formFullName,
          Sex: this.formValidateCreate.formSex,
          Password: this.formValidateCreate.formPassword,
          PhoneNumber: this.formValidateCreate.formPhoneNumber,
          EnrollmentYear: this.formValidateCreate.formEnrollmentYear,
          SchoolDistrictID: this.formValidateCreate.schoolID,
          StudentGradeID: this.formValidateCreate.studentGradeID,
          StudentOrganizationID: this.formValidateCreate.studentOrgID || 0
        }, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.ReturnClick()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 创建
      CreateClick () {
        this.$refs.formValidateCreate.validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.CreateStudent()
          }
        })
      },
      // 关闭
      CancelClick () {
        this.$refs.formValidateCreate.resetFields()
        this.ReturnClick()
      },
      // 返回
      ReturnClick () {
        this.$router.back()
      }

    }
  }
</script>
<style lang="less" scoped>
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
  }
  .text-center {
    button {
      margin-right: .5em;
    }
}
</style>
