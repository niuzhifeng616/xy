<template>
<div class="xy-content-module">
    <div class="xy-content-body">
        <div style="width: 410px;margin: 0 auto;">
            <i-form ref="formValidateCreate" label-position="top" :model="formValidateCreate" :rules="ruleValidateCreate">
                <form-item label="用户名" prop="formUserName" labelFor="formUserName">
                    <i-input v-model.trim="formValidateCreate.formUserName" elementId="formUserName" clearable></i-input>
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
                <form-item label="关联学生" prop="formOrgData">
                    <tag type="border" closable
                        color="primary"
                        :key="tag.FullName"
                        v-for="tag in formValidateCreate.formOrgData"
                        @on-close="tagClose(tag)" v-cloak>{{tag.FullName}}</tag>
                    <Icon type="md-add-circle" color="#4196FF" size="24" style="cursor:pointer;" @click="addOrg" />
                </form-item>
                <form-item label="手机号码" prop="formPhoneNumber" labelFor="formPhoneNumber">
                    <i-input v-model.trim="formValidateCreate.formPhoneNumber" elementId="formPhoneNumber" clearable></i-input>
                </form-item>
                <div class="text-center">
                    <Button  class="xy-info" @click="back">取消</Button>
                    <Button @click="add"  class="xy-primary">保存</Button>
                </div>
            </i-form>

        </div>
        <!-- 关联学生 -->
        <modal
          v-model="modalAddOrg"
          :transfer="false"
          title="关联学生"
          width="80%"
          class="student"
          :mask-closable="false"
          >
            <div>
                <row class="cascader-content">
                    <i-col span="8" class="cascader-content-left">
                        <tree :data="studentTree"></tree>
                    </i-col>
                    <i-col span="9" class="cascader-content-center">
                        <div class="title-describe title-model">温馨提示：点击左侧栏中的学生组织，从中间栏勾选学生，右侧栏显示已选中的学生。</div>
                        <!--<div class="cascader-content-center-title clearfix">
                            <checkbox v-model="casaderIsAll" class="fl casader-is-all" @on-change="checkAllBtn">全选</checkbox>
                        </div>-->
                        <alert v-if="transferData.length==0" type="warning" show-icon style="margin:0px 0px 20px">
                            未查询到相关数据。
                            <template slot="desc">
                                当前分组下暂无数据，请切换分组后重新查找。
                            </template>
                        </alert>
                        <div v-if="transferData.length>0">
                            <div class="cascader-content-center-list">
                                <checkbox
                                  size="large"
                                  v-for="child in transferData"
                                  :key="child.UserID"
                                  v-model="child.Checked"
                                  @on-change="checkAllChange(child)"
                                  :title="child.FullName"
                                  class="check-name"
                                  >
                                  {{child.FullName}}
                                </checkbox>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="7" class="cascader-content-right">
                        <div>已选<b>{{checkData.length}}</b>人</div>
                        <div class="cascader-content-right-list">
                            <tag
                              v-for="item in checkData"
                              :name="item.FullName"
                              closable
                              :key="item.FullName"
                              @on-close="handleClose(item)"
                              :title="item.FullName"
                              >
                              {{item.FullName}}
                            </tag>
                        </div>
                    </i-col>
                </row>
            </div>
            <div slot="footer">
                <Button class="xy-modal-close" @click="modalAddOrg = false">取消</Button>
                <Button class="xy-modal-primary" shape="circle" @click="submit">保存</Button>
            </div>
        </modal>
    </div>
</div>
</template>
<script>
  export default {
    name: 'ParentCreate',
    data () {
      return {
        sexArr: [
          { ID: 1, Name: '男' },
          { ID: 0, Name: '女' }
        ],
        formValidateCreate: {
          formUserName: '',
          formFullName: '',
          formSex: 1,
          formPassword: '',
          formPhoneNumber: '',
          formOrgData: []
        },
        ruleValidateCreate: {
          formUserName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '用户名不能超过30字符', trigger: 'blur' }
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
          formOrgData: [
            { required: true, type: 'array', min: 1, message: '关联学生不能为空', trigger: 'change' }
          ]
        },
        // 添加组织
        modalAddOrg: false,
        orgData: [],
        studentTree: [],
        checkData: [], // 选中的学生
        transferData: []// 待选的学生
      }
    },
    methods: {
      // 创建
      add () {
        let StudentInfo = []
        if (this.formValidateCreate.formOrgData.length > 0) {
          this.formValidateCreate.formOrgData.map((item) => {
            StudentInfo.push({ UserID: item.UserID })
          })
        }
        this.$refs.formValidateCreate.validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.CreateFamily(StudentInfo)
          }
        })
      },
      async CreateFamily (StudentInfo) {
        this.xy.loading()
        let params = {
          UserName: this.formValidateCreate.formUserName,
          FullName: this.formValidateCreate.formFullName,
          Sex: this.formValidateCreate.formSex,
          Password: this.formValidateCreate.formPassword,
          PhoneNumber: this.formValidateCreate.formPhoneNumber,
          StudentInfo: StudentInfo
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Family/CreateFamily`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.back()
          this.$refs.formValidateCreate.resetFields()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 关闭
      Cancelclick () {
        this.$refs.formValidateCreate.resetFields()
        this.back()
      },
      // 返回
      back () {
        this.$router.back()
      },
      // 删除关联学生
      tagClose (child) {
        let index = this.checkData.map((val) => {
          return val.UserID
        }).indexOf(child.UserID)
        this.checkData.splice(index, 1)

        let index1 = this.transferData.map((val) => {
          return val.UserID
        }).indexOf(child.UserID)
        this.transferData[index1].Checked = false

        this.formValidateCreate.formOrgData = this.formValidateCreate.formOrgData.filter((val) => {
          return val.UserID !== child.UserID
        })
      },
      /*  //关联学生
        addOrg () {
            ;
            this.xy.loading();
            xy.http.get(xy.string.format('{0}/api/Comm/GetSchoolGardTree', xy.subMenuServiceUrl), {
                isaddClass: true,
            }, function (res) {
                if (res.data.success) {
                    let resData = res.data.data;
                    this.orgData = [];
                    for (let i = 0; i < resData.length; i++) {
                        this.orgData.push({
                            id: resData[i].SchoolDistrictID,
                            title: resData[i].Name,
                            StudentGradeForStudentYearID: resData[i].StudentGradeForStudentYearID,
                            StudentOrganizationID: resData[i].StudentOrganizationID,
                            children: [],
                        });
                        for (let m = 0; m < resData[i].Children.length; m++) {
                            this.orgData[i].children.push({
                                id: resData[i].Children[m].StudentGradeForStudentYearID,
                                title: resData[i].Children[m].Name,
                                StudentGradeForStudentYearID: resData[i].Children[m].StudentGradeForStudentYearID,
                                StudentOrganizationID: resData[i].Children[m].StudentOrganizationID,
                                children: [],
                            })
                            for (let n = 0; n < resData[i].Children[m].Children.length; n++) {
                                this.orgData[i].children[m].children.push({
                                    id: resData[i].Children[m].Children[n].StudentOrganizationID,
                                    title: resData[i].Children[m].Children[n].Name,
                                    StudentGradeForStudentYearID: resData[i].Children[m].Children[n].StudentGradeForStudentYearID,
                                    StudentOrganizationID: resData[i].Children[m].Children[n].StudentOrganizationID,
                                    children: [],
                                })
                            }
                        }
                    };
                    this.modalAddOrg = true;
                } else {
                    this.xy.msgError(res.msg);
                };
                xy.unloading();
            });
        }, */
      async addOrg (row) {
        this.transferParent = row
        this.modalAddOrgTitle = '正在为' + row.FullName + '关联学生'
        this.xy.loading()
        let params = {
          schoolid: 0,
          isGraduation: false
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Student/GetSchoolTree`, params, true)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          this.studentTree = []
          for (let i = 0; i < resData.length; i++) {
            this.studentTree.push({
              id: resData[i].SchoolDistrictID,
              title: resData[i].SchoolDistrictName + '\xa0(' + resData[i].StuCount + '人)',
              fullOrgName: resData[i].SchoolDistrictName,
              schoolDistrictID: resData[i].SchoolDistrictID,
              studentGradeID: 0,
              studentGradeForStudentYearID: 0,
              studentYearID: 0,
              studentOrganizationID: 0,
              expand: true,
              children: [],
              IsNoGrade: resData[i].IsNoGrade,
              render: (h, func) => {
                return h('span', {
                  class: ['tree-li']
                }, [
                  h('span', {
                    class: ['ivu-tree-title'],
                    style: {
                      fontSize: '14px'
                    }
                  }, [
                    h('span', {
                      on: {
                        click: () => {
                          this.treeSelect(func.data)
                        }
                      }
                    }, func.data.title)
                  ])
                ])
              }
            })
            for (let m = 0; m < resData[i].GradeList.length; m++) {
              this.studentTree[i].children.push({
                id: resData[i].GradeList[m].StudentGradeID,
                title: resData[i].GradeList[m].StudentGradeName + '\xa0(' + resData[i].GradeList[m].StuCount + '人)',
                fullOrgName: resData[i].GradeList[m].StudentGradeName,
                schoolDistrictID: resData[i].SchoolDistrictID,
                studentGradeID: resData[i].GradeList[m].StudentGradeID,
                studentGradeForStudentYearID: resData[i].GradeList[m].StudentGradeForStudentYearID,
                studentYearID: 0,
                studentOrganizationID: 0,
                children: [],
                IsNoGrade: resData[i].GradeList[m].IsNoGrade,
                render: (h, func) => {
                  return h('span', {
                    class: ['tree-li']
                  }, [
                    h('span', {
                      class: ['ivu-tree-title'],
                      style: {
                        fontSize: '14px'
                      }
                    }, [
                      h('span', {
                        on: {
                          click: () => {
                            this.treeSelect(func.data)
                          }
                        }
                      }, func.data.title)
                    ])
                  ])
                }
              })
              for (let n = 0; n < resData[i].GradeList[m].YearList.length; n++) {
                this.studentTree[i].children[m].children.push({
                  id: resData[i].GradeList[m].YearList[n].StudentYearID,
                  title: resData[i].GradeList[m].YearList[n].StudentYearFullName + '\xa0(' + resData[i].GradeList[m].YearList[n].StuCount + '人)',
                  fullOrgName: resData[i].GradeList[m].YearList[n].StudentYearFullName,
                  children: [],
                  schoolDistrictID: resData[i].SchoolDistrictID,
                  studentGradeID: resData[i].GradeList[m].StudentGradeID,
                  studentGradeForStudentYearID: resData[i].GradeList[m].YearList[n].StudentGradeForStudentYearID,
                  studentYearID: resData[i].GradeList[m].YearList[n].StudentYearID,
                  studentOrganizationID: 0,
                  IsNoGrade: resData[i].GradeList[m].YearList[n].IsNoGrade,
                  render: (h, func) => {
                    return h('span', {
                      class: ['tree-li']
                    }, [
                      h('span', {
                        class: ['ivu-tree-title'],
                        style: {
                          fontSize: '14px'
                        }
                      }, [
                        h('span', {
                          on: {
                            click: () => {
                              this.treeSelect(func.data)
                            }
                          }
                        }, func.data.title)
                      ]),
                      h('span', {
                        style: {
                          display: 'inline-block',
                          float: 'right'
                        }
                      }, [
                        h('span', {
                          style: {
                            display: 'inline-block',
                            float: 'right'
                          }
                        })
                      ])
                    ])
                  }
                })
                for (let k = 0; k < resData[i].GradeList[m].YearList[n].OrgList.length; k++) {
                  let render = (h, func) => {
                    return h('span', {
                      class: ['tree-li']
                    }, [
                      h('span', {
                        class: ['ivu-tree-title'],
                        style: {
                          fontSize: '14px'
                        }
                      }, [
                        h('span', {
                          on: {
                            click: () => {
                              this.treeSelect(func.data)
                            }
                          }
                        }, func.data.title)
                      ]),
                      h('span', {
                        style: {
                          display: 'inline-block',
                          float: 'right'
                        }
                      }, [
                        h('span', {
                          style: {
                            display: 'inline-block',
                            float: 'right'
                          }
                        })
                      ])
                    ])
                  }
                  this.studentTree[i].children[m].children[n].children.push({
                    id: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationID,
                    title: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationName + '\xa0(' + resData[i].GradeList[m].YearList[n].OrgList[k].StuCount + '人)',
                    fullOrgName: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationName,
                    schoolDistrictID: resData[i].SchoolDistrictID,
                    studentGradeID: resData[i].GradeList[m].StudentGradeID,
                    studentGradeForStudentYearID: resData[i].GradeList[m].StudentGradeForStudentYearID,
                    studentYearID: resData[i].GradeList[m].YearList[n].StudentYearID,
                    studentOrganizationID: resData[i].GradeList[m].YearList[n].OrgList[k].StudentOrganizationID,
                    children: [],
                    IsNoGrade: resData[i].GradeList[m].YearList[n].OrgList[k].IsNoGrade,
                    render: render
                  })
                }
              }
            }
          }
          this.modalAddOrg = true
        } else {
          this.xy.msgError(res.msg)
        }
      },
      async treeSelect (row) {
        this.xy.loading()
        let params = {
          SchoolDistrictID: row.schoolDistrictID,
          StudentGradeID: row.studentGradeID,
          StudentOrganizationID: row.studentOrganizationID,
          IsNoGrade: row.IsNoGrade || false,
          StudentGradeForStudentYearID: row.studentGradeForStudentYearID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Student/GetAllStudentByPara`, params, true)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          resData.map((item) => {
            item.Checked = false
            return item
          })
          this.transferData = resData
          // 根据右侧已选人改变渲染的初始数据
          if (this.checkData.length > 0) {
            for (let d = 0; d < this.transferData.length; d++) {
              let f = this.checkData.map((val) => {
                return val.UserID
              }).indexOf(this.transferData[d].UserID)
              if (f !== -1) {
                this.transferData[d].Checked = true
              }
            }
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      /*   treeSelect (res) {
            if (res[0].StudentOrganizationID > 0|| res[0].title == "未在任何班级学生") {
                let this = this;
                this.xy.loading();
                xy.http.get(xy.string.format('{0}/api/Student/GetAllStudentByOrgID?orgID=' + res[0].id, xy.subMenuServiceUrl), null, function (res) {
                    if (res.data.success) {
                        let resData = res.data.data;
                        resData.map(function (item) {
                            item.Checked = false;
                            return item;
                        })
                        this.transferData = resData;
                    } else {
                        this.xy.msgError(res.msg);
                    };
                    xy.unloading();
                });
            }
        }, */
      checkAllChange (child) {
        if (child.Checked) {
          this.checkData.push(child)
        } else {
          let index = this.checkData.map((val) => {
            return val.UserID
          }).indexOf(child.UserID)
          this.checkData.splice(index, 1)
        };
      },
      handleClose (child) {
        let index = this.checkData.map((val) => {
          return val.UserID
        }).indexOf(child.UserID)
        this.checkData.splice(index, 1)

        for (let i = 0; i < this.transferData.length; i++) {
          if (this.transferData[i].UserID === child.UserID) {
            this.transferData[i].Checked = false
          }
        }
      },
      submit () {
        this.formValidateCreate.formOrgData = this.checkData
        this.modalAddOrg = false
      }
    }
  }
</script>
<style lang="less" scoped>
  .student .ivu-modal{
    top: 50px !important;
  }
  .text-center {
    button {
      margin-right: .5em;
    }
  }
  /deep/ .ivu-form-item:nth-child(5) .ivu-form-item-label {
    float: left;
    text-align: right;
    vertical-align: middle;
    line-height: 1;
    padding: 10px 12px 10px 0;
  }
  .cascader-content .cascader-content-left,
    .cascader-content .cascader-content-center,
    .cascader-content .cascader-content-right {
        height: 640px;
        overflow: auto;
    }
</style>
