<template>
  <div>
    <div class="" id="SysAccountContent">
      <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="top">
        <div class="sysAccount-box">
          <div class="sysAccount-box-title">基本信息和用户登录设置</div>
          <div class="sysAccount-box-content">
            <div class="xy-flex">
              <form-item label="学校编号" prop="AccountNumber" labelFor="AccountNumber" class="input-width">
                <Input
                  elementId="AccountNumber"
                  v-model="formValidate.AccountNumber"
                  disabled="disabled"
                  style="margin-top: 15px"
                  placeholder="请输入学校编号"
                  />
              </form-item>
              <form-item label="学校名称" prop="AccountName" labelFor="AccountName" class="input-width">
                <Input style="margin-top: 15px" v-model="formValidate.AccountName" elementId="AccountName" placeholder="请输入学校名称" clearable/>
              </form-item>
            </div>
            <div class="xy-flex">
            <form-item label="锁定账户前可重试登录次数" prop="FailedLoginCount" labelFor="FailedLoginCount" class="input-width">
              <div class="des-font">0代表不锁定</div>
              <Input
                elementId="FailedLoginCount"
                placeholder="请输入"
                v-model="formValidate.FailedLoginCount"
                @input="formValidate.FailedLoginCount = Number(formValidate.FailedLoginCount.replace(/\D+/, ''))"
                clearable
                />
            </form-item>
            <form-item label="锁定账户几小时后自动解锁" prop="UserLockHours" labelFor="UserLockHours" class="input-width">
              <div class="des-font">0代表不解锁</div>
              <i-input
                elementId="UserLockHours"
                placeholder="请输入"
                v-model="formValidate.UserLockHours"
                @input="formValidate.UserLockHours = Number(formValidate.UserLockHours.replace(/\D+/, ''))"
                clearable
                />
            </form-item>
            <form-item label="用户无操作多少分钟后自动退出" prop="AutomaticLogOutTime" labelFor="AutomaticLogOutTime" class="input-width">
              <div class="des-font">0代表不退出</div>
              <i-input
                elementId="AutomaticLogOutTime"
                placeholder="请输入"
                v-model="formValidate.AutomaticLogOutTime"
                @input="formValidate.AutomaticLogOutTime = Number(formValidate.AutomaticLogOutTime.replace(/\D+/, ''))"
                clearable
                />
            </form-item>
            </div>
            <!--<form-item label="学校地址" prop="Address">
                        <i-input v-model="formValidate.Address" clearable />
                    </form-item>-->
          </div>
        </div>
        <div class="sysAccount-box">
          <div class="sysAccount-box-title">学校Logo</div>
          <div class="sysAccount-box-content">
            <Alert show-icon closable>可以选择系统默认Logo，也可以自定义上传学校Logo，默认只能上传一张。</Alert>
            <div class="clearfix">
              <form-item prop="Icon" class="clearboth" style="width:1000px;">
                <ul id="BackgroundAll" class="upload-logo-ul clearfix">
                  <li class="fl">
                    <div style="text-align:center;width:100px;height:100px;float:left;">
                      <a-upload-dragger
                            ref="uploadEditIcon"
                            accept="image/jpg, image/jpeg, image/png"
                            :show-upload-list="false"
                            :fileSize="fileSize"
                            :importPath="importPath"
                            :before-upload="beforeUpload"
                            :customRequest="customRequest">
                          <p class="ant-upload-drag-icon" style="margin-bottom:5px;">
                            <a-icon type="cloud-upload" />
                          </p>
                          <p class="ant-upload-text" style="font-size:14px;">上传学校Logo</p>
                      </a-upload-dragger>
                    </div>
                    <!-- <div style="margin:10px 0 20px;">
                      <Button @click="open2">
                        <i class="iconfont" style="font-size: 12px;font-weight: 700;margin-right:5px;">&#xe6c7;</i>
                        上传
                      </Button>
                      <cropper
                        title="上传背景图"
                        :modalValue="cropperModal2"
                        ref="vueCropper"
                        :url="importPathBg"
                        :size="3"
                        :tips="tips"
                        :img="logo"
                        :labelFor="'uploadLogo'"
                        :file="file"
                        :autoCropWidth="autoCropWidth"
                        :autoCropHeight="autoCropHeight"
                        :centerBox="centerBox"
                        :isOpenRadio="isOpenRadio"
                        @resImgUrl="getImgUrl"
                        @closeCropper="closeCropper"
                        />
                    </div> -->
                  </li>
                  <li class="fl pr" @click="isUseUploadLogo = false">
                    <img src="@/assets/common/Login-logo.png" />
                    <div class="pa background-lay" :style="{opacity:isUseUploadLogo ? 0 : 1}">
                      <i class="iconfont">&#xe6d4;</i>
                    </div>
                  </li>
                  <li
                    class="fl pr"
                    @click="isUseUploadLogo = true"
                    v-if="formValidate.Icon != 'null' && formValidate.Icon != ''"
                    >
                    <img :src="formValidate.Icon" />
                    <div class="pa background-lay" :style="{opacity:isUseUploadLogo ? 1 : 0}">
                      <i class="iconfont">&#xe6d4;</i>
                    </div>
                  </li>
                </ul>
              </form-item>
            </div>
          </div>
        </div>
        <div class="sysAccount-box">
          <div class="sysAccount-box-title">登录页设置</div>
          <div class="sysAccount-box-content">
            <Alert show-icon closable>可以选择系统默认登录背景，也可以自定义上传，默认最多只能上传三张。</Alert>
            <div class="clearfix">
              <div style="margin:10px 0 20px;">
                <Button @click="open">
                  <i class="iconfont" style="font-size: 12px;font-weight: 700;margin-right:5px;">&#xe6c7;</i>
                  上传
                </Button>
                <cropper
                  title="上传背景图"
                  :modalValue="cropperModal"
                  ref="vueCropper"
                  :url="importPathBg"
                  :size="3"
                  :tips="tips"
                  :img="img"
                  :file="file"
                  :labelFor="'uploadImg'"
                  :autoCropWidth="autoCropWidth"
                  :autoCropHeight="autoCropHeight"
                  :centerBox="centerBox"
                  :isOpenRadio="isOpenRadio"
                  @resImgUrl="getImgUrl"
                  @closeCropper="closeCropper"
                  />
              </div>
              <form-item
                prop="BackgroundImages"
                class="clearboth"
                style="width:1000px;"
                >
                <row>
                  <ul id="BackgroundAll" class="clearfix">
                    <li class="fl pr" @click="CheckedBackGround('imgNull', 0)">
                      <div style="position: absolute; width: 100px;text-align: center;top: 32px;color: #fff;font-size: 14px;">
                        系统默认
                      </div>
                      <img src="@/assets/systemSetting/page-bg-airplane.jpg" />
                      <Icon type="ios-close-circle" @click.stop="DeleteBackGround('imgNull')" />
                      <div class="pa background-lay" :style="{opacity:thisIndex == 0 ? 1 : 0}">
                        <i class="iconfont">&#xe6d4;</i>
                      </div>
                    </li>
                    <li
                      v-for="(item, index) of formValidate.BackgroundImages"
                      :key="index + 1"
                      class="fl pr"
                      @click="CheckedBackGround(item.imgUrl, index + 1)"
                      >
                      <img :src="item.imgUrl" />
                      <div class="pa background-lay" :style="{opacity:index + 1 == thisIndex ? 1 : 0}">
                        <i class="iconfont">&#xe6d4;</i>
                      </div>
                      <Icon type="ios-close-circle" @click.stop="DeleteBackGround(item.imgUrl)" />
                    </li>
                  </ul>
                </row>
              </form-item>
              <div style="font-weight: 700;color: #444;margin-bottom: 10px;">
                显示设置:
              </div>
              <form-item>
                <!--<form-item prop="IsShowAccountName" class="clearboth" style="margin-left:0px;">
                  <Checkbox v-model="formValidate.IsShowAccountName" size="large">登录页显示学校名称</Checkbox>
                </form-item>-->
                <form-item
                  prop="IsShowIcon"
                  class="clearboth"
                  style="margin-left:0px;"
                  >
                  <Checkbox v-model="formValidate.IsShowIcon">
                    登录页显示学校Logo
                  </Checkbox>
                </form-item>
              </form-item>
            </div>
          </div>
        </div>
        <form ref="clear">
          <input style="display: none" type="file" id="uploadImg" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event)">
          <input style="display: none" type="file" id="uploadLogo" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadLogo($event)">
        </form>
        <div class="bottom-save-btn">
          <Button @click="save" class="xy-btn-primary" shape="circle">保存</Button>
        </div>
      </i-form>
    </div>
  </div>
</template>

<script>
  import cropper from '@/components/pictureCropping/Cropper1.vue'
  export default {
    name: 'sysSetting',
    components: {
      cropper
    },
    data () {
      return {
        // 截取背景图
        cropperModal: false,
        cropperModal2: false,
        isOpenRadio: false,
        centerBox: true,
        tips: '',
        autoCropWidth: null,
        autoCropHeight: null,
        isShowBorder: false,
        imgUrl: '',
        // 上传背景图
        fileSizeBg: 3,
        importPathBg: this.xyApi + '/base/api/Settings/GetBgImgUrl',
        img: '', // 传给cropper的img
        file: [], // 传给cropper的file
        logo: '',
        // 上传logo
        fileSize: 2, // Logo文件大小限制 单位：M
        importPath: `${this.xyApi + '/base'}/api/Settings/GetLogoUploadUrl`,

        isUseUploadLogo: '', // 是否使用上传的logo
        imgList: [],

        // TODO:
        loading: true,
        apiPath: this.xyApi + '/base',

        // ----------
        thisIndex: 0,
        formValidate: {
          AccountNumber: '',
          AccountName: '',
          IconType: '',
          Address: '',
          Icon: '',
          ImgBase: '',
          IsShowAccountName: false,
          IsShowIcon: false,
          BackgroundImage: '',
          BackgroundImages: [],
          FailedLoginCount: 0,
          UserLockHours: 0,
          AutomaticLogOutTime: 0,
          SYSAccountID: 0
        },
        ruleValidate: {
          AccountName: [
            {
              type: 'string',
              required: true,
              message: '学校名称不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 20,
              message: '学校名称不能超过20个字',
              trigger: 'blur'
            }
          ],
          Address: [
            {
              type: 'string',
              max: 50,
              message: '学校地址不能超过50个字',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created () {
      // 获取微信配置信息
      this.getSetting()
    },
    mounted () {},
    methods: {
      // 获取账户设置信息
      async getSetting () {
        this.xy.loading()
        try {
          const res = await this.xy.get(
            `${this.apiPath}/api/Settings/GetSYSAccount`
          )
          if (res.success) {
            this.formValidate.BackgroundImages = []
            if (res.data.BackgroundImages != null) {
              var imgarr = res.data.BackgroundImages.split(',')
              for (var i = 0; i < imgarr.length; i++) {
                this.formValidate.BackgroundImages.push({
                  imgUrl: decodeURI(imgarr[i]),
                  checked: true
                })
                if (decodeURI(imgarr[i]) === res.data.BackgroundImage) {
                  this.thisIndex = i + 1
                }
              }
            }
            if (res.data.IsShowIcon) {
              this.isShowBorder = true
            }
            this.imgList = imgarr
            this.formValidate.SYSAccountID = res.data.SYSAccountID
            this.formValidate.AccountNumber = res.data.AccountNumber
            this.formValidate.AccountName = res.data.AccountName
            this.formValidate.IconType = res.data.IconType
            this.formValidate.Address = res.data.Address
            if (!res.data.Icon) {
              this.isUseUploadLogo = false
            } else {
              this.isUseUploadLogo = true
            }
            this.formValidate.Icon = decodeURI(res.data.Icon)

            this.formValidate.ImgBase = res.data.ImgBase
            this.formValidate.IsShowAccountName = res.data.IsShowAccountName
            this.formValidate.IsShowIcon = res.data.IsShowIcon

            this.formValidate.BackgroundImage = res.data.BackgroundImage
            this.formValidate.FailedLoginCount = res.data.FailedLoginCount

            this.formValidate.UserLockHours = res.data.UserLockHours
            this.formValidate.AutomaticLogOutTime = res.data.AutomaticLogOutTime
          }
        } catch (error) {
          this.xy.mError('获取信息失败', error)
        }
        this.xy.unloading()
      },

      // ---------------上传logo start---------------
      // 上传文件之前的钩子
      beforeUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < this.fileSize
        if (!isLt2M) {
          this.$message.error('您上传的学校Logo不能超过' + this.fileSize + 'M。')
        }
        return isLt2M
      },
      // 自定义上传事件--获取logo上传路径
      customRequest (file) {
        this.xy.get(`${this.apiPath}/api/Settings/GetLogoUploadUrl`, {
          fileName: file.file.name
        }).then(res => {
          if (res.success) {
            this.uploadFunc(res.data, file.file)
          }
        })
      },
      // put资源
      uploadFunc (data, files) {
        this.xy.put(data.PutUrl, files, `${files.type}`).then(res => {
          this.submitIcon(data)
        }).catch(err => {
          if (err.message.indexOf('403') !== -1) {
            this.xy.msgError('服务器出错，上传失败，请联系管理员。')
            return false
          }
        })
      },
      // 上传资源
      submitIcon (urldata) {
        this.xy.post(`${this.apiPath}/api/Settings/UpdateLogo`, {
          PutUrl: urldata.PutUrl
        }, true).then(res => {
          if (res.success) {
            this.xy.msgSuc('文件上传成功。')
            this.isShowBorder = true
            this.isUseUploadLogo = true // 使用上传的logo
            this.getSetting()
          } else {
            this.xy.msgError('失败。')
          }
        })
      },
      //  ---------------上传logo end---------------

      // ---------------上传背景图 start---------------
      open () {
        this.cropperModal = true
        this.isOpenRadio = false
        this.centerBox = false
        this.autoCropWidth = 350
        this.autoCropHeight = 157
        this.tips = '为了登录页背景图展示为最佳效果，建议上传的图片尺寸为1920*1080，图片格式只支持jpg/jpeg/png，并且大小不超过3MB。'
      },
      open2 () {
        this.cropperModal2 = true
        this.isOpenRadio = false
        this.centerBox = false
        this.autoCropWidth = 200
        this.autoCropHeight = 200
        this.tips = '为了Logo展示为最佳效果，建议上传的图片尺寸为1920*1080，图片格式只支持jpg/jpeg/png，并且大小不超过3MB。'
      },
      // 点击确定图片时
      uploadImg (e) {
        console.log(e.target.files)
        // 上传图片
        this.file = e.target.files
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          return this.xy.msgError('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        }
        let reader = new FileReader()
        reader.onload = ev => {
          let data = ''
          if (typeof ev.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([ev.target.result]))
          } else {
            data = ev.target.result
          }
          this.img = data
        }
        reader.readAsDataURL(this.file[0])
      },
      // 点击确定图片时
      uploadLogo (e) {
        // 上传图片
        this.file = e.target.files
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          return this.xy.msgError('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        }
        let reader = new FileReader()
        reader.onload = ev => {
          let data = ''
          if (typeof ev.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([ev.target.result]))
          } else {
            data = ev.target.result
          }
          this.logo = data
        }
        reader.readAsDataURL(this.file[0])
      },
      // 监听子组件的上传成功后返回被截取图片在本地的地址
      getImgUrl (url) {
        this.imgUrl = url.resDt.data
        this.formValidate.BackgroundImages.push({
          imgUrl: url.resDt.data,
          checked: true
        })
        this.getSetting()
      },
      // 取消选择
      closeCropper (val) {
        this.$refs.clear.reset()
        this.cropperModal = val
        this.cropperModal2 = val
        this.img = ''
      },
      // ---------------上传背景图 end---------------

      // 切换背景图
      CheckedBackGround (url, index) {
        this.thisIndex = index
        if (url === 'imgNull') {
          this.formValidate.BackgroundImage = ''
        } else {
          this.formValidate.BackgroundImage = url
        }
      },
      // 删除背景图
      DeleteBackGround (url) {
        if (url === 'imgNull') {
          this.$Modal.error({
            title: '错误信息',
            content: '系统默认背景图不可删除。'
          })
        } else {
          this.$Modal.confirm({
            title: '删除',
            content: '<p>您确认要删除此背景图吗？</p>',
            onOk: () => {
              this.postDeleteBackground(
                `${this.apiPath}/api/Settings/DelteBgImg?url=${url}`
              )
            },
            onCancel: () => {}
          })
        }
      },
      async postDeleteBackground (url) {
        try {
          const res = await this.xy.post(url)
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.getSetting()
          }
        } catch (error) {
          this.xy.mError('删除失败', error)
        }
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      save () {
        this.$refs.formValidate.validate(valid => {
          if (!valid) {
            return this.changeLoading()
          } else {
            var saveIcon = ''
            if (this.isUseUploadLogo) {
              // 是否使用上传的logo
              saveIcon = this.formValidate.Icon
            }
            if (this.formValidate.SYSAccountID > 0) {
              const editParams = {
                AccountNumber: this.formValidate.AccountNumber,
                AccountName: this.formValidate.AccountName,
                Address: this.formValidate.Address,
                Icon: saveIcon,
                FailedLoginCount: this.formValidate.FailedLoginCount === '' ? 0 : this.formValidate.FailedLoginCount,
                UserLockHours: this.formValidate.UserLockHours === '' ? 0 : this.formValidate.UserLockHours,
                AutomaticLogOutTime: this.formValidate.AutomaticLogOutTime === '' ? 0 : this.formValidate.AutomaticLogOutTime,
                SYSAccountID: this.formValidate.SYSAccountID,
                IsShowAccountName: this.formValidate.IsShowAccountName,
                IsShowIcon: this.formValidate.IsShowIcon,
                BackgroundImage: this.formValidate.BackgroundImage
              }
              this.postEdit(
                `${this.apiPath}/api/Settings/EditSYSAccount`,
                editParams
              )
            } else {
              const createParams = {
                AccountNumber: this.formValidate.AccountNumber,
                AccountName: this.formValidate.AccountName,
                Address: this.formValidate.Address,
                Icon: saveIcon,
                FailedLoginCount: this.formValidate.FailedLoginCount,
                UserLockHours: this.formValidate.UserLockHours,
                AutomaticLogOutTime: this.formValidate.AutomaticLogOutTime,
                SYSAccountID: this.formValidate.SYSAccountID,
                IsShowAccountName: this.formValidate.IsShowAccountName,
                IsShowIcon: this.formValidate.IsShowIcon,
                BackgroundImage: this.formValidate.BackgroundImage
              }
              this.postCreate(
                `${this.apiPath}/api/Settings/CreateSYSAccount`,
                createParams
              )
            }
          }
        })
      },
      async postEdit (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            this.xy.msgSuc('修改成功。')
            this.getSetting()
            this.changeLoading()
          }
        } catch (error) {
          this.xy.mError('保存失败', error)
        }
      },
      async postCreate (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            this.xy.msgSuc('修改成功。')
            this.getSetting()
          }
        } catch (error) {
          this.xy.mError('保存失败', error)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
/deep/.ivu-form-item-label{
  padding: 0;
}
#BackgroundAll{
  li{
    width: 100px;
    height:100px;
    margin-right: 20px;
    cursor: pointer;
    border: 2px solid #fff;
    margin-bottom: 14px;
    border-radius: 4px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }
}
#BackgroundAll > li > div.background-lay {
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  top: 0px;
  opacity: 0;
  transition: all 0.3s;
  line-height: 100px;
  text-align: center;
  border-radius: 4px;
  i{
    color:#fff;
    font-size: 20px;
  }
}
#BackgroundAll > li > i {
    color: #666;
    font-size: 18px;
    position: absolute;
    top: -9px;
    right: -8px;
}
.sys-account-title {
  padding: 10px;
  background: #fff;
  font-size: 22px;
  font-weight: bold;
  color: #444;
  margin-bottom: 5px;
  padding-left: 0;
}
.bgg {
  border: 2px solid #4196ff !important;
}
.w100 {
  width: 100% !important;
}
.sysAccount-box {
  width: 1266px;
  min-height: 200px;
  margin: 0 auto 20px;
  background: #fff;
  .sysAccount-box-title {
    color: #444;
    font-size: 16px;
    font-weight: bold;
    padding: 20px 0 20px 32px;
    border-bottom: 1px solid #e9e9e9;
  }
  .sysAccount-box-content{
    padding: 20px 20px 20px 32px;
    .input-width{
      width: 300px;
      margin-right:70px;
      margin-bottom: 32px;
      label{
        padding: 0;
      }
      .des-font{
        line-height: normal;
        color: #9ea7b4;
        font-size: 13px;
        padding: 7px 0 8px;
      }
    }
  }
}

.addColor {
  color: #3399ff;
}
.default-log:hover .background-log {
  background: rgba(0, 0, 0, 0.3);
  opacity: 1;
  transition: all 0.3s;
}
.default-logs {
  border: 2px solid #3399ff;
}
.default-font {
  opacity: 0.5;
}
.upload-logo-ul {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.upload-logo-ul > li > img {
  width: 100% !important;
  height: 100% !important;
  padding: 20px 0;
}
.upload-logo-ul > li > div.add-logo-btn{
  background:#f2f2f2;
  border-radius:4px;
  height:100%;
  line-height: 100px;
  text-align: center;
}
.upload-logo-ul > li > div.add-logo-btn>i{
  font-size: 34px;
  color: #dfdfdf;
}
.upload-logo-ul > li > div.background-lay {
  line-height: 100px !important;
  text-align: center;
}
.upload-logo-ul > li > div.background-lay > span {
  margin-left: 0 !important;
}
#SysAccountContent{
  margin-bottom: 66px;
  .bottom-save-btn{
    width: 100%;
    height: 56px;
    text-align: center;
    background: #fff;
    line-height: 56px;
    position: absolute;
    bottom: 0;
    width: 100%;
    box-shadow: 0px 1px 2px 0px rgba(0,0,0,.3);
  }
}
</style>
