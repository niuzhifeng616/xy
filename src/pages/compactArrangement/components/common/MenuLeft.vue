<template>
  <div class="menu-left">
    <div class="white-logo">
      <img src="@/pages/compactArrangement/imgs/white-logo.png" alt="">
    </div>
    <ul class="module-ul">
      <li v-for="(modul,index) in moduleData" :key="index" :class="modul.isActive?'li-active':''" @click="leftMenuSelect(modul)">
        <Tooltip :content="modul.name" placement="right">
          <img :src="modul.isActive?modul.iconActive:modul.icon" alt="">
        </Tooltip>
      </li>
    </ul>
    <div class="user-info">
      <img v-if="userBaseInfo.IconFull!==''" :src="userBaseInfo.IconFull+'?'+new Date()" class="user-img" @click="myInfo"/>
      <div class="show-name" v-else @click="myInfo">{{xy.showName(userBaseInfo.FullName)}}</div>
    </div>
    <!-- 点击头像展示的 -->
    <div v-cloak id="myData" class="myData" v-show="isDataShow" name="myData">
      <div class="my-data-top">
        <div class="my-data-top-img">
          <img v-if="userBaseInfo.IconFull!==''" :src="userBaseInfo.IconFull+'?'+new Date()" class="user-img"/>
          <div class="show-name-small" v-else>{{xy.showName(userBaseInfo.FullName)}}</div>
        </div>
        <div class="my-data-top-msg">
          <p v-cloak class="nowrap" :title="userBaseInfo.FullName">{{userBaseInfo.FullName}}</p>
          <p class="nowrap" :title="userBaseInfo.SchoolCardNumber" v-if="userBaseInfo.RoleType==3">
            <span>学籍号：</span><span>{{userBaseInfo.SchoolCardNumber}}</span>
          </p>
          <p class="nowrap" :title="userBaseInfo.SchoolCardNumber" v-if="userBaseInfo.RoleType==2">
            <span>工号：</span><span>{{userBaseInfo.SchoolCardNumber}}</span>
          </p>
        </div>
      </div>
      <div class="my-data-bottom">
        <ul class="clearfix">
          <li><a @click="getUserInfo" href="javascript:;">个人信息</a></li>
          <li><a @click="goUserLogin" href="javascript:;">登录日志</a></li>
          <li><a @click="changePwd" href="javascript:;">修改密码</a></li>
          <li><a @click="loginOut" href="javascript:;">退出登录</a></li>
        </ul>
      </div>
    </div>
    <div class="xy-mark" @click="markClose" v-if="xyMark"></div>
    <!--个人信息-->
    <Modal :styles="{width:'543px'}"
          v-model="modalUserInfo"
          :transfer="false"
          title="个人信息"
          v-cloak
          :loading="loading"
          :mask-closable="false"
          class="user-alert-bg">
      <div>
        <div id="UserInfoTop">
          <div class=""><span>姓名：</span><span>{{formValidateUserInfo.formFullName}}</span></div>
          <div class="" v-if="formValidateUserInfo.formUserRoleType==3">
            <span>学籍号：</span><span>{{formValidateUserInfo.formSchoolCardNumber}}</span>
          </div>
          <div class="" v-if="formValidateUserInfo.formUserRoleType==2">
            <span>工号：</span><span>{{formValidateUserInfo.formSchoolCardNumber}}</span>
          </div>
          <div class=""><span>用户名：</span><span>{{formValidateUserInfo.formUserName}}</span></div>
          <div class=""><span>性别：</span><span>{{formValidateUserInfo.formSex===0?'女':'男'}}</span></div>
        </div>
        <div id="UserInfoBottom">
          <Form ref="formValidateUserInfo" :model="formValidateUserInfo" :rules="ruleValidateUserInfo"
                :label-width="80">
            <FormItem label="出生日期" prop="formBirthDate" label-for="formBirthDate1">
              <date-picker element-id="formBirthDate1" format="yyyy-MM-dd" :options="optionsBirthDate" v-model="formValidateUserInfo.formBirthDate"
                type="date" placeholder="" style="width: 348px" :editable="false"></date-picker>
            </FormItem>
            <FormItem label="手机号码" prop="formPhoneNumber" label-for="phoneNumber1">
              <Input v-model="formValidateUserInfo.formPhoneNumber" element-id="phoneNumber1" clearable style="width: 348px"/>
            </FormItem>
            <FormItem label="邮箱地址" prop="formEmailAddress" label-for="emailAddress1">
              <Input v-model="formValidateUserInfo.formEmailAddress" element-id="emailAddress1" clearable style="width: 348px"/>
            </FormItem>
            <FormItem label="籍贯" prop="formNativePlace" label-for="nativePlace1">
              <!-- <Input v-model="formValidateUserInfo.formNativePlace" clearable style="width: 348px"/> -->
              <cascader
                element-id="nativePlace1"
                :data="nativePlaceData"
                v-model="formValidateUserInfo.formNativePlace"
                :clearable="false"
                style="width: 348px"
                placeholder="请选择籍贯">
              </cascader>
            </FormItem>
            <FormItem label="地址" prop="formAddress" label-for="formAddress1">
              <Input v-model="formValidateUserInfo.formAddress" element-id="formAddress1" clearable style="width: 348px"/>
            </FormItem>
            <Input v-model="formValidateUserInfo.formUserRoleType" style="width:348px;display:none;"/>
            <Input v-model="formValidateUserInfo.formUserNumberType" style="width:348px;display:none;"/>
            <Input v-model="formValidateUserInfo.formUserNumber" style="width:348px;display:none;"/>
            <Input v-model="formValidateUserInfo.formCardNumber" style="width:348px;display:none;"/>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="UserInfoCancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="UserInfoOk">确定</Button>
      </div>
    </Modal>
    <!-- 修改密码 -->
    <Modal width="543"
      title="修改密码"
      class="user-alert-bg"
      v-model="modalChangePassword"
      :transfer="false"
      v-cloak
      :mask-closable="false"
      :closable="false">
      <div class="mt-20">
        <Form ref="formValidateChangePassword" :model="formValidateChangePassword" :rules="ruleValidateChangePassword"
              :label-width="120">
          <FormItem label="原密码" prop="formOldPassword" label-for="formOldPassword1">
            <Input type="password" element-id="formOldPassword1" v-model="formValidateChangePassword.formOldPassword" style="width: 300px"/>
          </FormItem>
          <FormItem label="新密码" prop="formNewPassword" label-for="formNewPassword1">
            <Input type="password" element-id="formNewPassword1" v-model="formValidateChangePassword.formNewPassword" style="width: 300px"/>
          </FormItem>
          <FormItem label="确认密码" prop="formNewPasswordConfirm" label-for="formNewPasswordConfirm1">
            <Input type="password" element-id="formNewPasswordConfirm1" v-model="formValidateChangePassword.formNewPasswordConfirm" style="width: 300px"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="changePasswordCancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="changePasswordOk">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'MenuLeft',
    data () {
      return {
        moduleData: [
          {
            name: '工作台',
            url: '/xyhome/moduleFunc',
            isActive: true,
            isModule: false,
            icon: require('@/pages/compactArrangement/imgs/home.png'),
            iconActive: require('@/pages/compactArrangement/imgs/home-active.png'),
            global: {}
          },
          {
            name: '行政班排课',
            url: '',
            isActive: false,
            isModule: true,
            icon: require('@/pages/compactArrangement/imgs/xing.png'),
            iconActive: require('@/pages/compactArrangement/imgs/xing-active.png'),
            global: {}
          },
          {
            name: '走班排课',
            url: '',
            isActive: false,
            isModule: true,
            icon: require('@/pages/compactArrangement/imgs/zou.png'),
            iconActive: require('@/pages/compactArrangement/imgs/zou-active.png'),
            global: {}
          },
          {
            name: '排教室',
            url: '',
            isActive: false,
            isModule: true,
            icon: require('@/pages/compactArrangement/imgs/setHouse.png'),
            iconActive: require('@/pages/compactArrangement/imgs/setHouse-active.png'),
            global: {}
          },
          {
            name: '学期课表',
            url: '',
            isActive: false,
            isModule: true,
            icon: require('@/pages/compactArrangement/imgs/schedule.png'),
            iconActive: require('@/pages/compactArrangement/imgs/schedule-active.png'),
            global: {}
          },
          {
            name: '应用中心',
            url: '/xyhome/appCenter',
            isActive: false,
            isModule: false,
            icon: require('@/pages/compactArrangement/imgs/center.png'),
            iconActive: require('@/pages/compactArrangement/imgs/center-active.png'),
            global: {}
          }
        ],
        isDataShow: false,
        xyMark: false,
        loading: true,
        // 个人信息
        modalUserInfo: false,
        nativePlaceData: [],
        userID: '',
        optionsBirthDate: {
          disabledDate: date => {
            let disabledDay = date.getFullYear()
            return disabledDay <= 1949 || date.valueOf() > Date.now()
          }
        },
        sexArr: [
          { ID: 1, Name: '男' },
          { ID: 0, Name: '女' }
        ],
        formValidateUserInfo: {
          formSchoolCardNumber: '',
          formUserName: '',
          formRoleType: '',
          formSex: '',
          formPhoneNumber: '',
          formEmailAddress: '',
          formNativePlace: [],
          formAddress: ''
        },
        ruleValidateUserInfo: {
          formSchoolCardNumber: [
            { required: true, message: '校内号不能为空。', trigger: 'blur' },
            { type: 'string', max: 30, message: '校内号不能超过30字符。', trigger: 'blur' }
          ],
          formUserName: [
            { required: true, message: '用户名不能为空。', trigger: 'blur' },
            { type: 'string', max: 30, message: '用户名不能超过30字符。', trigger: 'blur' }
          ],
          formFullName: [
            { required: true, message: '姓名不能为空。', trigger: 'blur' },
            { type: 'string', max: 30, message: '姓名不能超过30字符。', trigger: 'blur' }
          ],
          formSex: [
            { type: 'number', required: true, message: '性别不能为空。', trigger: 'blur' }
          ],
          formPhoneNumber: [
            {
              pattern: /^1(3[0-9]|4[57]|5[0-35-9]|66|7[0135678]|8[0-9]|9[8-9])\d{8}$/,
              message: '您输入的手机号格式错误。',
              trigger: 'blur'
            }
          ],
          formEmailAddress: [
            {
              pattern: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/,
              message: '您输入的邮箱格式错误。',
              trigger: 'blur'
            },
            { type: 'string', max: 100, message: '邮箱地址不能超过100字符。', trigger: 'blur' }
          ],
          formAddress: [
            { type: 'string', max: 100, message: '地址不能超过100字符。', trigger: 'blur' }
          ]
        },
        // 修改密码
        modalChangePassword: false,
        formValidateChangePassword: {
          formOldPassword: '',
          formNewPassword: '',
          formNewPasswordConfirm: ''
        },
        ruleValidateChangePassword: {
          formOldPassword: [
            { required: true, message: '原密码不能为空。', trigger: 'blur' },
            { type: 'string', max: 20, min: 6, message: '密码长度限6~20位。', trigger: 'blur' },
            { pattern: /^[\x21-\x7e]{6,20}$/, message: '您输入的密码格式错误。', trigger: 'blur' }
          ],
          formNewPassword: [
            { required: true, message: '新密码不能为空。', trigger: 'blur' },
            { type: 'string', max: 20, min: 6, message: '密码长度限6~20位。', trigger: 'blur' },
            { pattern: /^[\x21-\x7e]{6,20}$/, message: '您输入的密码格式错误。', trigger: 'blur' }
          ],
          formNewPasswordConfirm: [
            { required: true, message: '确认密码不能为空。', trigger: 'blur' },
            { type: 'string', max: 20, min: 6, message: '密码长度限6~20位。', trigger: 'blur' },
            { pattern: /^[\x21-\x7e]{6,20}$/, message: '您输入的密码格式错误。', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      modules () {
        return this.$store.state.common.moduleList
      },
      userBaseInfo () {
        return this.$store.state.common.userBaseInfo
      }
    },
    watch: {
      modules: {
        handler (vals) {
          this.moduleData[1].global = vals[1].applications[0]
          this.moduleData[2].global = vals[1].applications[1]
          this.moduleData[3].global = vals[1].applications[2]
          this.moduleData[4].global = vals[1].applications[3]
        },
        deep: true,
        immediate: true
      },
      '$route': {// 页面刷新时控制左侧active样式
        handler (routers) {
          let index = -1
          if (routers.name === 'moduleFunc') {
            index = 0
          } else if (routers.name === 'appCenter') {
            index = 5
          } else {
            if (this.moduleData.length > 0 && routers.query.xy) {
              let ids = routers.query.xy.split(',')
              for (let i = 0, len = this.moduleData.length; i < len; i++) {
                let applications = Object.keys(this.moduleData[i].global).length ? [this.moduleData[i].global] : []
                for (let j = 0, jen = applications.length; j < jen; j++) {
                  if (applications[j].ID === ids[1] - 0) {
                    index = i
                    break
                  }
                }
              }
            }
          }
          this.moduleData.map((item, index2) => {
            item.isActive = index2 === index
          })
        },
        immediate: true
      }
    },
    created () {
      this.getNativePlaceData()
      this.getGlobal()
    },
    mounted () {
    },
    methods: {
      async getGlobal () {
        let res = await this.xy.get(this.xyApi + '/xy/comm/Global')
        if (res.success) {
          this.$store.commit('common/getUserBaseInfo', res.data.User)
        }
      },
      // 左侧菜单点击跳转
      leftMenuSelect (val) {
        this.moduleData.map(item => {
          item.isActive = false
        })
        val.isActive = true
        if (val.isModule) {
          this.locationFunc(val.global)
        } else {
          this.$router.push(val.url)
          window.scrollTo(0, 0)
        }
      },
      locationFunc (application) {
        // this.$store.commit(
        //   'changeApiPath',
        //   `${this.xyApi}/${parentItem.ModuleCode}`
        // )
        this.$store.commit(
          'changeApiPath',
          `${this.xyApi}/${application.GatewayCode}`
        )
        let mIds = [2, application.ID]
        if (application.subMenu.length > 0) {
          mIds.push(application.subMenu[0].ID)
        }
        this.$router.push({
          path:
            application.subMenu.length > 0
              ? application.subMenu[0].ApplicationSubMenuPCUrl
              : application.PCUrl,
          query: {
            xy: mIds.join(','),
            cd: application.GatewayCode
          }
        })
        window.scrollTo(0, 0)
      },
      // 头像点击
      myInfo () {
        this.isDataShow = true
        this.xyMark = true
      },
      markClose () {
        this.isDataShow = false
        this.xyMark = false
      },
      // 个人信息
      async getUserInfo () {
        this.xyMark = false
        this.isDataShow = false
        let res = await this.xy.get(`${this.xyApi}/base/api/Users/GetUserInfo`)
        if (res.success) {
          this.modalUserInfo = true
          let row = res.data
          this.userID = row.UserID
          this.formValidateUserInfo.formFullName = row.FullName
          this.formValidateUserInfo.formSchoolCardNumber = row.SchoolCardNumber
          this.formValidateUserInfo.formUserName = row.UserName
          this.formValidateUserInfo.formSex = row.Sex
          this.formValidateUserInfo.formBirthDate = row.BirthDate
          this.formValidateUserInfo.formPhoneNumber = row.PhoneNumber
          this.formValidateUserInfo.formEmailAddress = row.EmailAddress
          this.formValidateUserInfo.formNativePlace = row.RegionID !== undefined ? [row.RegionID] : []
          this.formValidateUserInfo.formAddress = row.Address
          this.formValidateUserInfo.formUserNumberType = row.UserNumberTypeID
          this.formValidateUserInfo.formUserNumber = row.UserNumber
          this.formValidateUserInfo.formCardNumber = row.CardNumber
          this.formValidateUserInfo.formUserRoleType = row.RoleType
        }
      },
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
          this.xy.msgError('获取籍贯失败！')
        }
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      UserInfoCancel () {
        this.modalUserInfo = false
        this.$refs.formValidateUserInfo.resetFields()
      },
      UserInfoOk () {
        this.loading = true
        this.$refs.formValidateUserInfo.validate(valid => {
          if (valid) {
            this.validUserInfo()
          } else {
            this.changeLoading()
          }
        })
      },
      async validUserInfo () {
        let nativePlaceName = ''
        this.nativePlaceData.map((item) => {
          if (item.value === this.formValidateUserInfo.formNativePlace[0]) {
            nativePlaceName = item.MergerName
          }
        })
        let res = await this.xy.post(`${this.xyApi}/base/api/Users/Edit`, {
          UserID: this.userID,
          SchoolCardNumber: this.formValidateUserInfo.formSchoolCardNumber,
          UserName: this.formValidateUserInfo.formUserName,
          FullName: this.formValidateUserInfo.formFullName,
          Sex: this.formValidateUserInfo.formSex,
          PhoneNumber: this.formValidateUserInfo.formPhoneNumber,
          EmailAddress: this.formValidateUserInfo.formEmailAddress,
          BirthDate: (this.formValidateUserInfo.formBirthDate === '') || (this.formValidateUserInfo.formBirthDate === null) ? '' : this.xy.moment(this.formValidateUserInfo.formBirthDate).format('yyyy-MM-DD'),
          RegionID: this.formValidateUserInfo.formNativePlace.join(','),
          NativePlace: nativePlaceName,
          Address: this.formValidateUserInfo.formAddress,
          UserNumberTypeID: this.formValidateUserInfo.formUserNumberType,
          UserNumber: this.formValidateUserInfo.formUserNumber,
          CardNumber: this.formValidateUserInfo.formCardNumber,
          RoleType: this.formValidateUserInfo.formUserRoleType
        })
        if (res.success) {
          this.modalUserInfo = false
          this.$refs.formValidateUserInfo.resetFields()
          this.xy.msgSuc('您的个人信息修改成功。')
        } else {
          this.xy.msgError(res.data.msg)
          return this.changeLoading()
        }
      },
      // 登录日志
      async goUserLogin () {
        this.xyMark = false
        this.isDataShow = false
        this.$router.push('/xyHome/userLoginIndex')
      },
      // 修改密码
      changePwd () {
        this.xyMark = false
        this.isDataShow = false
        this.modalChangePassword = true
      },
      changePasswordCancel () {
        this.modalChangePassword = false
        this.$refs.formValidateChangePassword.resetFields()
      },
      changePasswordOk () {
        this.loading = true
        this.$refs.formValidateChangePassword.validate(valid => {
          if (valid) {
            this.validPwd()
          } else {
            this.changeLoading()
          }
        })
      },
      async validPwd () {
        this.xy.loading()
        let res = await this.xy.post(`${this.xyApi}/base/api/Users/ChangeUsersPassword`, {
          oldPassword: this.formValidateChangePassword.formOldPassword,
          newPassword: this.formValidateChangePassword.formNewPassword,
          newConfirmPassword: this.formValidateChangePassword.formNewPasswordConfirm
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('密码修改成功')
          this.modalChangePassword = false
          this.$refs.formValidateChangePassword.resetFields()
        }
        this.changeLoading()
      },
      // 退出登录
      loginOut () {
        this.xyMark = false
        this.isDataShow = false
        this.$Modal.confirm({
          title: '退出',
          content: '<p>您确认要退出吗？</p>',
          onOk: () => {
            this.xy.removeCookie('.XYTOKEN')
            localStorage.clear()
            this.$router.push('/')
          },
          onCancel: function () {
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.menu-left {
    position: absolute;
    top: 0;
    left: 0;
    background: #333333;
    height: 100%;
    width: 60px;
    z-index: 101;
    .xy-mark {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      background: rgba(255, 255, 255, 0);
    }
    .white-logo{
      margin: 20px 0 16px;
      text-align: center;
    }
    .module-ul{
      text-align: center;
      li{
        padding: 10px 0;
        margin-bottom:20px ;
        cursor: pointer;
      }
      li:hover{
        background:#292929;
      }
      .li-active{
        background: linear-gradient(90deg,#1356f4, rgba(70,171,250,0.65))!important;
      }
    }
    .user-info{
      position: absolute;
      bottom: 36px;
      left: 13px;
      .show-name{
        width: 34px;
        height: 34px;
        line-height: 34px;
        margin: auto;
        background: #1677ff;
        border-radius: 50%;
        color: #ffffff;
        text-align: center;
        cursor: pointer;
      }
      .user-img{
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        outline: none;
        border: 1px solid #fff;
        -webkit-box-shadow: 0 2px 15px 0 hsla(0,0%,42%,.09);
        box-shadow: 0 2px 15px 0 hsla(0,0%,42%,.09);
        -webkit-transition: all .3s;
        transition: all .3s;
      }
    }
    .myData {
      position: fixed;
      bottom: 36px;
      left: 64px;
      z-index: 9999;
      width: 260px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.15);
      .my-data-top {
        padding: 10px;
        background: #eee;
        white-space: nowrap;
        .my-data-top-img {
          line-height: 40px;
          vertical-align: top;
          display: inline-block;
          margin-right: 10px;
          .show-name-small{
            width: 40px !important;
            text-align: center;
            height: 40px;
            line-height: 40px;
            border-radius: 50%;
            margin: 0 10px 0 9px;
            background: #4196ff;
            color:#fff;
          }
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
        .my-data-top-msg {
          margin-left: 0;
          vertical-align: top;
          display: inline-block;
          p:nth-child(1) {
            font-size: 16px;
            width: 186px;
          }
          p:nth-child(2) {
            font-size: 12px;
            color: #9f9f9f;
            width: 186px;
          }
        }
      }
      .my-data-bottom {
        background-color: #fff;
        li {
          text-align: center;
          height: 46px;
          width: 50%;
          float: left;
          line-height: 46px;
          a {
            display: block;
            background: #fff;
            color: #333;
            transition: all 0.3s;
          }
          a:hover {
            transition: all 0.3s;
            background: #f5f5f5;
          }
        }
        li:nth-child(4){
          a:hover {
            transition: all 0.3s;
            background: #FF8C8C;
            color: #fff;
          }
        }
      }
    }
  }
</style>
