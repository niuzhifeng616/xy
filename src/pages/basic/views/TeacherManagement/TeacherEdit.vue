<template>
  <div class="xy-content-module">
    <div class="xy-content-body clearfix">
      <div style="width:1200px;margin:0 auto;">
        <div class="clearfix">
          <Alert show-icon class="fl">
            同一用户的用户名和工号可相同，但不可与其他用户的用户名和工号重复，用户名和工号都可用于登录系统。
          </Alert>
        </div>
        <div class="user-info-box">
          <div class="f18 user-info-title">基本信息</div>
          <i-form
            ref="formValidateEdit"
            :model="formValidateEdit"
            :rules="ruleValidateEdit"
            :label-width="120"
            >
            <row>
              <i-col span="12"
                     style="padding-left:30px;">
                <form-item label="用户名" prop="formUserName" labelFor="formUserName">
                  <i-input v-model.trim="formValidateEdit.formUserName" elementId="formUserName" clearable style="width: 260px">
                  </i-input>
                </form-item>
                <form-item label="姓名" prop="formFullName" labelFor="formFullName">
                  <i-input v-model.trim="formValidateEdit.formFullName" elementId="formFullName" clearable style="width: 260px">
                  </i-input>
                </form-item>
                <form-item label="工号" prop="formSchoolCardNumber" labelFor="formSchoolCardNumber">
                  <i-input v-model.trim="formValidateEdit.formSchoolCardNumber" elementId="formSchoolCardNumber" clearable style="width: 260px">
                  </i-input>
                </form-item>
                <form-item label="性别" prop="formSex">
                  <radio-group v-model="formValidateEdit.formSex">
                    <radio :label="1">男</radio>
                    <radio :label="0">女</radio>
                  </radio-group>
                </form-item>
                <form-item label="管理员" prop="IsAdmin">
                  <radio-group v-model="formValidateEdit.IsAdmin">
                    <radio :label="0">否</radio>
                    <radio :label="1">是</radio>
                  </radio-group>
                </form-item>
                <form-item label="证件类型" prop="formUserNumberTypeID">
                  <i-select v-model="formValidateEdit.formUserNumberTypeID" clearable placeholder="请选择证件类型" style="width:260px">
                    <i-option
                      v-for="item in UserNumberTypeArr"
                      :value="item.ID"
                      :key="item.Name"
                      v-cloak
                      >
                      {{ item.Name }}
                    </i-option>
                  </i-select>
                </form-item>
                <form-item label="证件号码" prop="formUserNumber" labelFor="formUserNumber">
                  <i-input v-model.trim="formValidateEdit.formUserNumber" elementId="formUserNumber" clearable style="width: 260px">
                  </i-input>
                </form-item>
                <form-item
                  label="所在组织"
                  prop="formStudentOrganizationFullName"
                  v-if="formValidateEdit.formStudentOrganizationFullName.length>0"
                  >
                  <tag
                    color="primary"
                    style="height:auto"
                    v-cloak
                    :key="orgName"
                    v-for="orgName in formValidateEdit.formStudentOrganizationFullName"
                    >
                    {{orgName}}
                  </tag>
                </form-item>
              </i-col>
              <i-col span="12">
                <form-item label="出生日期" prop="formBirthDate" labelFor="formBirthDateT">
                  <date-picker
                    :editable="false"
                    elementId="formBirthDateT"
                    format="yyyy-MM-dd"
                    :options="optionsBirthDate"
                    v-model="formValidateEdit.formBirthDate"
                    type="date"
                    placeholder=""
                    style="width: 260px"
                    >
                  </date-picker>
                </form-item>
                <form-item label="手机号码" prop="formPhoneNumber" labelFor="formPhoneNumber">
                  <i-input elementId="formPhoneNumber"  v-model.trim="formValidateEdit.formPhoneNumber" clearable style="width: 260px">
                  </i-input>
                </form-item>
                <form-item label="邮箱地址" prop="formEmailAddress" labelFor="formEmailAddress">
                  <i-input  elementId="formEmailAddress" v-model.trim="formValidateEdit.formEmailAddress" clearable style="width: 260px">
                  </i-input>
                </form-item>
                <form-item label="一卡通账号" prop="formCardNumber" labelFor="formCardNumber">
                  <i-input elementId="formCardNumber"  v-model.trim="formValidateEdit.formCardNumber" clearable style="width: 260px">
                  </i-input>
                </form-item>
                <form-item label="籍贯">
                  <cascader
                    :data="nativePlaceData"
                    v-model="formValidateEdit.formNativePlace"
                    style="width: 260px"
                    :class='nativePlaceData.length==0?"cascader-nodata":""'
                    placeholder="请选择籍贯"
                    clearable
                    >
                  </cascader>
                  <!-- <i-input v-model.trim="formValidateEdit.formNativePlace" clearable style="width: 260px">
                                </i-input> -->
                </form-item>
                <form-item label="地址" prop="formAddress" labelFor="formAddressT">
                  <i-input v-model.trim="formValidateEdit.formAddress" elementId="formAddressT" clearable style="width: 260px">
                  </i-input>
                </form-item>
                       <!-- v-if="formValidateEdit.DutyList.length > 0" -->
                <form-item label="职务" prop="DutyList">
                  <tag
                    color="primary"
                    v-cloak
                    :key="dutyName"
                    v-for="dutyName in formValidateEdit.DutyList"
                    >
                    {{dutyName}}
                  </tag>
                  <tag v-if='formValidateEdit.DutyList.length==0'>暂无</tag>
                </form-item>
              </i-col>
            </row>
          </i-form>
        </div>
        <div class="user-info-box">
          <div class="f18 user-info-title">头像</div>
          <div class="clearfix" style="width:355px;margin:0 auto;">
            <div class="fl" style="margin-right:50px;">
              <img :src="uploadIconResult" style="width:145px;height:145px;border-radius:4px;" v-cloak />
            </div>
            <div class="fl" style="width:145px;height:145px;box-shadow:0px 2px 8px 0px rgba(12,30,59,0.15);border-radius:4px;">
              <uploadHeadIcon
                :fileSize="1"
                :personId="usersModel.userId"
                @uploadOk="uploadOk" />
            </div>
          </div>
          <div style="color:#939FB7;font-size:12px;margin-top:20px;text-align: center;">
            温馨提示：您上传的头像最大不能超过1M,图片格式仅支持：jpg，png，jpeg。</div>
        </div>
        <div class="text-center" style="margin:30px 0 10px;">
          <Button @click="EditSubmit" :loading="loadingBtn" class="xy-btn-primary" shape="circle">保存</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import uploadHeadIcon from '../../components/uploadHeadIcon.vue'

  const poto = require('@/assets/common/yrykb.png')
  export default {
    name: 'TeacherEdit',
    components: {
      uploadHeadIcon
    },
    data: function () {
      return {
        token: this.xy.getCookie('.XYTOKEN'),
        apiPath: `${this.$store.state.apiPath}/api/Users/`,
        roleTypeNoFArr: [
          { ID: 1, Name: '管理员', Icon: 'user-gly' },
          { ID: 2, Name: '教师', Icon: 'user-js' },
          { ID: 3, Name: '学生', Icon: 'user-xs' }

        ],
        UserNumberTypeArr: [
          { ID: 1, Name: '身份证' },
          { ID: 2, Name: '护照' }
        ],
        WeChatStatusArr: [
          { ID: 1, Name: '已关注学校微信公众号' },
          { ID: 0, Name: '未关注学校微信公众号' }
        ],
        thisIndex: -1,
        // 编辑用户
        changeRoles: ['1', '2', '3', '4'],
        optionsBirthDate: {
          disabledDate (date) {
            var disabledDay = date.getFullYear()
            return disabledDay <= 1949 || date.valueOf() > Date.now()
          }
        },
        tabsEdit: '',
        // 编辑用户--头像
        uploadIconResult: '',

        nativePlaceData: [],
        formValidateEdit: {
          formSchoolCardNumber: '',
          formUserName: '',
          formFullName: '',
          formRoleType: '',
          formSex: 1,
          IsAdmin: 0,
          formUserNumberTypeID: '',
          formUserNumber: '',
          formPhoneNumber: '',
          formEmailAddress: '',
          formCardNumber: '',
          formNativePlace: [],
          formAddress: '',
          formStudentOrganizationFullName: '',
          DutyList: [],
          formBirthDate: ''
        },
        ruleValidateEdit: {
          formSchoolCardNumber: [
            { required: true, message: '工号不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '工号不能超过30字符', trigger: 'blur' }
          ],
          formUserName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '用户名不能超过30字符', trigger: 'blur' }
          ],
          formFullName: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { type: 'string', max: 30, message: '姓名不能超过30字符', trigger: 'blur' }
          ],
          formRoleType: [
            { type: 'number', required: true, message: '角色不能为空', trigger: 'blur' }
          ],
          formSex: [
            { required: true, type: 'number', message: '性别不能为空', trigger: 'change' }
          ],
          formUserNumber: [
            // { validator: UserNumber, trigger: 'blur' }
            // { type: 'string', required: true, message: '证件号码不能为空。', trigger: 'blur' },
            // { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, max: 18,  message: '身份证号格式不正确', trigger: 'blur' }
          ],
          formEmailAddress: [
            { pattern: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/, message: '您输入的邮箱地址格式错误', trigger: 'blur' },
            { type: 'string', max: 100, message: '邮箱地址不能超过100字符。', trigger: 'blur' }
          ],
          formPhoneNumber: [
            { pattern: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|191|198|199)\d{8}$/, message: '您输入的手机号码格式错误', trigger: 'blur' }
          ],
          formCardNumber: [
            { type: 'string', max: 30, message: '一卡通账号不能超过30字符', trigger: 'blur' }
          ],
          formNativePlace: [
            { type: 'string', max: 20, message: '籍贯不能超过20字符', trigger: 'blur' }
          ],
          formAddress: [
            { type: 'string', max: 50, message: '地址不能超过50字符', trigger: 'blur' }
          ]
        },
        loadingBtn: false,
        // 传参.
        usersModel: { 'userId': 0, 'fullName': '' },
        // 搜索条件,[返回/编辑成功]之后要传给用户列表的数据
        conditionParame: {}
      }
    },
    created () {
      this.getNativePlaceData()
      if (this.$route.query.userID) {
        this.usersModel.userId = this.$route.query.userID
        this.GetById(this.$route.query.userID)
      }
    },
    mounted () {
    // this.$nextTick(() => {
    //   xy.breadcrumb.create({ name: '编辑信息' });
    // });
    },
    methods: {
      // 获取籍贯
      async getNativePlaceData () {
        this.xy.loading()
        let res = await this.xy.post(`${this.xyApi}/ams/api/AMS/GetAdminiStrativeRegion?level=1`, null, true)
        this.xy.unloading()
        if (res.success) {
          res.data.map((t) => {
            this.nativePlaceData.push({
              value: t.RegionID,
              label: t.RegionName,
              levelType: t.LevelType,
              children: t.Childrens,
              MergerName: t.MergerName
            })
          })
        } else {
          this.xy.msgError('获取籍贯失败。')
        };
      },
      async GetById (UserID) {
        this.xy.loading()
        let params = {
          userId: UserID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/Teacher/GetTeacherDetail`, params, true)
        this.xy.unloading()
        if (res.success) {
          var row = res.result
          this.editId = row.UserId
          this.formValidateEdit.formSchoolCardNumber = row.SchoolCardNumber
          this.formValidateEdit.formUserName = row.UserName
          this.formValidateEdit.formFullName = row.FullName
          this.formValidateEdit.formSex = row.Sex ? 1 : 0
          this.formValidateEdit.IsAdmin = row.IsAdmin

          this.formValidateEdit.formUserNumberTypeID = row.UserNumberTypeID || 0
          this.formValidateEdit.formUserNumber = row.UserNumber
          this.formValidateEdit.formPhoneNumber = row.PhoneNumber
          this.formValidateEdit.formEmailAddress = row.EmailAddress
          this.formValidateEdit.formCardNumber = row.CardNumber
          this.formValidateEdit.formBirthDate = row.BirthDate
          this.formValidateEdit.formNativePlace = [row.RegionID]
          this.formValidateEdit.formAddress = row.Address
          this.formValidateEdit.formStudentOrganizationFullName = row.OrganList
          this.formValidateEdit.DutyList = row.DutyList
          // 头像
          if (row.Icon) {
            this.uploadIconResult = `${row.Icon}?t=${Date.parse(new Date())}`
          } else {
            this.uploadIconResult = poto
          }

          this.tabsEdit = 'name1'
          // this.$refs.uploadEditIcon.clearFiles()
        } else {
          this.xy.msgError('获取信息失败。')
        }
      },

      EditCancel () {
        this.$refs.formValidateEdit.resetFields()
      },
      async EditTeacher () {
        this.xy.loading()
        var nativePlaceName = ''
        this.nativePlaceData.map((item) => {
          if (item.value === this.formValidateEdit.formNativePlace[0]) {
            nativePlaceName = item.label
          }
        })
        let params = {
          UserId: this.editId,
          FullName: this.formValidateEdit.formFullName || '',
          SchoolCardNumber: this.formValidateEdit.formSchoolCardNumber || '',
          UserName: this.formValidateEdit.formUserName || '',
          Sex: this.formValidateEdit.formSex !== 0,
          IsAdmin: this.formValidateEdit.IsAdmin ? 1 : 0,
          PhoneNumber: this.formValidateEdit.formPhoneNumber || '',
          EmailAddress: this.formValidateEdit.formEmailAddress || '',
          UserNumberTypeID: this.formValidateEdit.formUserNumberTypeID || 0,
          UserNumber: this.formValidateEdit.formUserNumber || '',
          BirthDate: (this.formValidateEdit.formBirthDate === '' || this.formValidateEdit.formBirthDate == null) ? '' : this.xy.timeFormat(this.formValidateEdit.formBirthDate, 'yyyy-MM-dd'),
          CardNumber: this.formValidateEdit.formCardNumber || '',
          NativePlace: nativePlaceName || '',
          Address: this.formValidateEdit.formAddress || '',
          RegionID: this.formValidateEdit.formNativePlace.join(',') || '0'
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/Teacher/EditTeacher`, params, true)
        this.xy.unloading()

        if (res.success) {
          this.xy.msgSuc('编辑成功。')
          this.ReturnClick()
        } else {
          this.xy.msgError(res.msg)
        }
      },
      EditSubmit () {
        if (!this.formValidateEdit.formUserNumberTypeID ^ !this.formValidateEdit.formUserNumber) {
          this.xy.msgError('证件类型和证件号码必须同时填写。')
          return false
        } else {
          if (this.formValidateEdit.formUserNumberTypeID === 1) {
            var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
            if (this.formValidateEdit.formUserNumber.length > 21) {
              this.xy.msgError('证件号码不能超过21位。')
              this.loadingBtn = false
              return
            }
            if (reg.test(this.formValidateEdit.formUserNumber) === false) {
              this.xy.msgError('您输入的证件号码格式错误。')
              return false
            }
          }
        }
        this.$refs.formValidateEdit.validate((valid) => {
          if (!valid) {
            this.tabsEdit = 'name1'
            return false
          } else {
            this.EditTeacher()
          }
        })
      },
      // 角色
      changeRoleType (id) {

      },
      // 头像
      uploadOk (icon) {
        this.uploadIconResult = `${icon}?t=${Date.parse(new Date())}`
      },
      // 返回
      ReturnClick () {
        this.$router.back()
      }
    }
  }
</script>
<style lang="less" scoped>
.role-type-style {
  margin-left: 50px;
}
.role-type-style li {
  float: left;
  width: 200px;
  height: 210px;
  background: rgba(242, 246, 255, 1);
  border-radius: 4px;
  box-shadow: 0px 2px 8px 0px rgba(12, 30, 59, 0.15);
  margin-right: 70px;
  text-align: center;
  transition: all 0.3s;
}

.role-type-style li .users-icon {
  width: 72px;
  height: 72px;
  box-shadow: 0px 8px 35px 0px rgba(48, 126, 244, 0.3);
  line-height: 72px;
  border-radius: 50%;
  background: #fff;
  text-align: center;
  margin: 30px auto 50px;
}

.role-type-style li .users-icon i {
  font-size: 50px !important;
}

.role-type-style li .users-name {
  font-size: 16px;
  transition: all 0.3s;
  color: #001f5a;
  font-weight: bold;
}

.user-info-box {
  padding: 20px 20px 40px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 14px 0px rgba(9, 48, 91, 0.1);
}

.user-info-title {
  padding-bottom: 30px;
  font-weight: bold;
}
.urser-info-radio {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
}
.role-bg {
  transition: all 0.3s;
  color: #387fd6;
}
.users-fff {
  color: #fff !important;
}
.role-blue {
  background: rgba(65, 150, 255, 0.8) !important;
}
.cascader-nodata ul {
  width: 260px;
}
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
