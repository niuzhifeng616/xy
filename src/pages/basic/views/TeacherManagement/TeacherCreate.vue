<template>
<div class="xy-content-module">
    <div class="xy-content-body">
        <div style="width: 410px;margin: 0 auto; padding-top: 10px">
            <i-form ref="formValidateCreate" label-position="top" :model="formValidateCreate" :rules="ruleValidateCreate">
                <form-item label="用户名" prop="formUserName" label-for="formUserName">
                    <i-input v-model="formValidateCreate.formUserName" element-id="formUserName" clearable></i-input>
                </form-item>
                <form-item label="工号" prop="formSchoolCardNumber" label-for="formSchoolCardNumber">
                    <i-input v-model="formValidateCreate.formSchoolCardNumber" element-id="formSchoolCardNumber" clearable></i-input>
                </form-item>
                <form-item label="姓名" prop="formFullName" label-for="formFullName">
                    <i-input v-model="formValidateCreate.formFullName" element-id="formFullName" clearable></i-input>
                </form-item>
                <form-item label="性别" prop="formSex">
                    <i-select v-model="formValidateCreate.formSex">
                        <i-option v-for="item in sexArr" :value="item.ID" :key="item.Name" v-cloak>{{ item.Name }}</i-option>
                    </i-select>
                </form-item>
                <form-item label="密码" prop="formPassword" label-for="formPassword">
                    <i-input v-model="formValidateCreate.formPassword" element-id="formPassword" clearable></i-input>
                </form-item>
                <form-item label="组织" prop="formOrgData">
                    <tag type="border" closable
                         color="primary"
                         v-for="tag in formValidateCreate.formOrgData"
                        :key="tag.title"
                         @on-close="tagClose(tag)" v-cloak>{{tag.title}}</tag>
                    <Icon type="md-add-circle" color="#4196FF" size="24" style="cursor:pointer;" @click="addOrg" />
                </form-item>
                <form-item label="手机号码" prop="formPhoneNumber" label-for="formPhoneNumber">
                    <i-input v-model="formValidateCreate.formPhoneNumber" element-id="formPhoneNumber" clearable></i-input>
                </form-item>
                <form-item label="管理员" prop="formRoleType">
                    <radio-group v-model="formValidateCreate.formRoleType">
                        <radio label="0">
                            <span>否</span>
                        </radio>
                        <radio label="1">
                            <span>是</span>
                        </radio>
                    </radio-group>
                </form-item>
                <div class="text-center">
                    <Button  class="xy-info" @click="ReturnClick">取消</Button>
                    <Button @click="CreateClick"  class="xy-primary">保存</Button>
                </div>
            </i-form>

        </div>

        <!-- 添加组织 -->
        <modal
          v-model="modalAddOrg"
          :transfer="false"
          :mask-closable="false"
          title="添加组织"
          width="600"
          >
            <div style="height:500px;">
                <row>
                    <i-col span="12" style="padding-right:20px;">
                        <div style="border-bottom:1px solid #eee;padding:10px">待选</div>
                        <div style="height:460px;overflow:auto">
                            <tree class="tree-dom" :data="orgData" multiple @on-select-change="treeSelect"></tree>
                        </div>
                    </i-col>
                    <i-col span="12" style="border-left:1px solid #eee;padding-left:20px;">
                        <div style="border-bottom:1px solid #eee;padding:10px">已选</div>
                        <div style="height:460px;overflow:auto;margin-top: 6px;">
                            <tag
                              type="border"
                              closable
                              color="primary"
                              @on-close="tagClose(item)"
                              v-for="(item,index) in checkData"
                              :key="index"
                              v-cloak
                              >
                              {{item.title}}
                            </tag>
                        </div>
                    </i-col>
                </row>
            </div>
            <div slot="footer">
                <Button class="xy-modal-close" ghost @click="cancle">取消</Button>
                <Button class="xy-modal-primary" shape="circle" @click="submit">保存</Button>
            </div>
        </modal>
    </div>

</div>

</template>
<script>
  export default {
    name: 'TeacherCreate',
    data: function () {
      return {
        roleTypeArr: [{
                        ID: 1,
                        Name: '管理员',
                        Icon: 'icons-man'
                      },
                      {
                        ID: 2,
                        Name: '教师',
                        Icon: 'icons-teacher'
                      },
                      {
                        ID: 3,
                        Name: '学生',
                        Icon: 'icons-student'
                      },
                      {
                        ID: 4,
                        Name: '家长',
                        Icon: 'icons-jiachang'
                      }
        ],
        roleTypeNoFArr: [{
                           ID: 1,
                           Name: '管理员',
                           Icon: 'icons-man'
                         },
                         {
                           ID: 2,
                           Name: '教师',
                           Icon: 'icons-teacher'
                         },
                         {
                           ID: 3,
                           Name: '学生',
                           Icon: 'icons-student'
                         }

        ],
        sexArr: [{
                   ID: 1,
                   Name: '男'
                 },
                 {
                   ID: 0,
                   Name: '女'
                 }
        ],
        UserNumberTypeArr: [{
                              ID: 1,
                              Name: '身份证'
                            },
                            {
                              ID: 2,
                              Name: '护照'
                            }
        ],
        formValidateCreate: {
          formSchoolCardNumber: '',
          formUserName: '',
          formFullName: '',
          formRoleType: '0',
          formSex: 1,
          formPassword: '',
          formPhoneNumber: '',
          formOrgData: []
        },
        ruleValidateCreate: {
          formSchoolCardNumber: [{
                                   required: true,
                                   message: '工号不能为空',
                                   trigger: 'blur'
                                 },
                                 {
                                   type: 'string',
                                   max: 30,
                                   message: '工号不能超过30字符',
                                   trigger: 'blur'
                                 }
          ],
          formUserName: [{
                           required: true,
                           message: '用户名不能为空',
                           trigger: 'blur'
                         },
                         {
                           type: 'string',
                           max: 30,
                           message: '用户名不能超过30字',
                           trigger: 'blur'
                         }
          ],
          formFullName: [{
                           required: true,
                           message: '姓名不能为空',
                           trigger: 'blur'
                         },
                         {
                           type: 'string',
                           max: 30,
                           message: '姓名不能超过30字符',
                           trigger: 'blur'
                         }
          ],
          formSex: [{
            type: 'number',
            required: true,
            message: '性别不能为空',
            trigger: 'blur'
          }],
          formPassword: [{
                           required: true,
                           message: '密码不能为空',
                           trigger: 'blur'
                         },
                         {
                           type: 'string',
                           max: 20,
                           min: 8,
                           message: '密码需要8-20字符',
                           trigger: 'blur'
                         },
                         {
                           // eslint-disable-next-line no-control-regex
                           pattern: /^[\x00-\xff]{8,20}$/,
                           message: '请在英文状态下输入密码',
                           trigger: 'blur'
                         },
                         {
                           pattern: /((?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))[A-Za-z\d#@!~%^&*]{8,20}/,
                           message: '请使用数字、字母、特殊字符中的两种组合，字母区分大小写',
                           trigger: 'blur'
                         }

          ],
          formPhoneNumber: [{
            pattern: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|191|198|199)\d{8}$/,
            message: '您输入的手机号码格式错误',
            trigger: 'blur'
          }],
          formOrgData: [{
            required: true,
            type: 'array',
            min: 1,
            message: '组织不能为空',
            trigger: 'change'
          } ]
        },
        // 添加组织
        modalAddOrg: false,
        orgData: [],
        checkData: []
      }
    },
    created () {

    },
    mounted () {

    },
    methods: {
      async GoCreate () {
        let org = []
        this.checkData.map((item) => {
          org.push(item.id)
        })
        let params = {
          SchoolCardNumber: this.formValidateCreate.formSchoolCardNumber.trim(),
          UserName: this.formValidateCreate.formUserName.trim(),
          FullName: this.formValidateCreate.formFullName.trim(),
          Sex: this.formValidateCreate.formSex === 1,
          Password: this.formValidateCreate.formPassword.trim(),
          PhoneNumber: this.formValidateCreate.formPhoneNumber.trim(),
          IsAdmin: Number(this.formValidateCreate.formRoleType),
          Organs: org
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Teacher/CreateTeacher`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.ReturnClick()
          this.$refs.formValidateCreate.resetFields()
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
            this.GoCreate()
          }
        })
      },
      // 关闭
      CancelClick () {
        this.$refs.formValidateCreate.resetFields()
        this.ReturnClick()
      },
      // 添加组织
      async addOrg () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Teacher/GetTeacherOrganizationAll`, null, true)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          this.orgData = []
          for (let i = 0; i < resData.length; i++) {
            this.orgData.push({
              id: resData[i].OrganizationID,
              title: resData[i].OrganizationName,
              children: this.getTeacherChildren(resData[i].OrganizationListItem),
              selected: false
            })
          }
          this.modalAddOrg = true
        } else {
          this.xy.msgError(res.msg)
        }
      },
      getTeacherChildren (orglist) { // 递归修改状态
        let result = []
        for (let i = 0; i < orglist.length; i++) {
          if (orglist[i].OrganizationListItem.length > 0) {
            result.push({
              id: orglist[i].OrganizationID,
              schoolId: orglist[i].SchoolDistrictID,
              title: orglist[i].OrganizationName,
              children: this.getTeacherChildren(orglist[i].OrganizationListItem),
              selected: false

            })
          } else {
            result.push({
              id: orglist[i].OrganizationID,
              schoolId: orglist[i].SchoolDistrictID,
              title: orglist[i].OrganizationName,
              children: [],
              selected: false
            })
          }
        }
        return result
      },
      treeSelect (res, data) {
        let arr = []
        res.map((item, index) => {
          if (item.id !== 0) {
            res[index].selected = true
            arr.push(item)
          } else {
            res[index].selected = false
          }
        })
        this.checkData = arr
      },
      tagClose (res) {
        let index = this.checkData.map((item) => {
          return item.title
        }).indexOf(res.title)
        this.checkData.splice(index, 1)
        this.cancleSelect(this.orgData, res)
      },
      cancleSelect (arr, closeObj) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].title === closeObj.title) {
            arr[i].selected = false
            return false
          }
          if (arr[i].children !== undefined) {
            if (arr[i].children.length > 0) {
              this.cancleSelect(arr[i].children, closeObj)
            }
          }
        }
      },
      cancle () {
        this.modalAddOrg = false
      },
      submit () {
        this.formValidateCreate.formOrgData = this.checkData
        this.modalAddOrg = false
      },
      // 返回
      ReturnClick () {
        this.$router.back()
      }

    }
  }
</script>
<style lang="less" scoped>
  button {
    margin-right: .5em;
  }
  /deep/ .ivu-form-item:nth-child(6) .ivu-form-item-label {
    float: left;
    text-align: right;
    vertical-align: middle;
    line-height: 1;
    padding: 10px 12px 10px 0;
  }
  /deep/ .ivu-form-item:nth-child(8) .ivu-form-item-label {
    float: left;
    text-align: right;
    vertical-align: middle;
    line-height: 1;
    padding: 10px 12px 10px 0;
  }
</style>
