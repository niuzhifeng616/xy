<template>
  <div class='xy-content-module'>
    <div class='xy-content-body'>
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        label-position="top"
      >
        <div class="fromIptTop">
          <FormItem
            label="项目名称"
            prop="EntryName"
            label-for="EntryName"
          >
            <Input
              v-model="formValidate.EntryName"
              style="width:288px"
              placeholder="请输入项目名称"
              element-id="EntryName"
            />
          </FormItem>
          <FormItem label="学科" prop="Subject">
            <Select
              v-model="formValidate.Subject"
              style="width:288px"
              placeholder="请选择学科"
            >
              <Option
                v-for="item in SubjectList"
                :key="item.DisciplineID"
                :value="item.DisciplineID"
              >
                {{ item.DisciplineName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="荣誉类型" prop="HonorType">
            <Select
              v-model="formValidate.HonorType"
              style="width:288px"
              placeholder="请选择荣誉类型"
            >
              <Option
                v-for="item in HonorTypeList"
                :key="item.TypeID"
                :value="item.TypeID"
              >
                {{ item.RoleName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="荣誉级别" prop="Level">
            <Select
              v-model="formValidate.Level"
              style="width:288px"
              placeholder="请选择荣誉级别"
            >
              <Option
                v-for="item in LevelList"
                :key="item.TypeID"
                :value="item.TypeID"
              >
                {{ item.RoleName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="获奖等级" prop="Ranking">
            <Select
              v-model="formValidate.Ranking"
              style="width:288px"
              placeholder="请选择获奖等级"
            >
              <Option
                v-for="item in RankList"
                :key="item.TypeID"
                :value="item.TypeID"
              >
                {{ item.RoleName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="获奖时间" prop="formDate" label-for="formDate">
            <date-picker
              format="yyyy-MM-dd"
              v-model="formValidate.formDate"
              type="date"
              placeholder="请选择获奖日期"
              :editable="false"
              element-id="formDate"
              style="width:288px"
            ></date-picker>
          </FormItem>
        </div>
        <FormItem
          label="项目概述"
          prop="Description"
          label-for="Description"
        >
          <Input
            v-model="formValidate.Description"
            style="width:645px"
            placeholder="请输入备注说明"
            element-id="Description"
            :maxlength="200"
            show-word-limit
            type="textarea"
            :rows="4"
          />
        </FormItem>
        <FormItem
          label="上传证书"
          prop="Screenshot"
        >
          <div class="uploadImgBox"  v-if="!rowObj.isApproal">
            <a-upload-dragger
              accept="image/jpg, image/jpeg, image/png"
              :show-upload-list="false"
              :file-size="fileSize"
              :before-upload="beforeUpload"
              :custom-request="customRequest"
            >
              <a-button class="uploadImgBtn">
                <img
                  class="uploadImg"
                  src="./img/upload.png"
                />
                上传
              </a-button>
            </a-upload-dragger>
            <p class="uploadImgTip">
              温馨提示：您上传的文件最大不能超过5M，图片格式仅支持：jpg，png，jpeg，最多上传3张。
            </p>
            <ul>
              <li
                v-for="(item, index) in formValidate.Screenshot"
                :key="index"
                class="imgsLi"
              >
                <img :src="host + item" />
                <img
                  src="./img/delCircle.png"
                  alt=""
                  @click="delOne(item, index)"
                />
              </li>
            </ul>
          </div>
          <div class="uploadImgBox"  v-else>
            <ul>
              <li
                v-for="(item, index) in formValidate.Screenshot"
                :key="index"
                class="imgsLi"
                @click="preview(index)"
              >
                <img :src="host + item" />
                 <Modal title="查看" v-model="visible">
                  <img :src="host + formValidate.Screenshot[imgIndex]" v-if="visible" style="width: 100%;">
                  <div slot="footer">
                      <Button class="xy-modal-close" @click="visible=false">关闭</Button>
                  </div>
                </Modal>
              </li>
          </ul>
          </div>
        </FormItem>
        <FormItem prop="AppResults" label="审批结果" v-if="rowObj.isApproal">
          <RadioGroup v-model="formValidate.AppResults">
              <Radio label="1">通过</Radio>
              <Radio label="2">拒绝</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="审批说明"
          prop="AppInstructions"
          label-for="AppInstructions"
          v-if="rowObj.isApproal"
        >
          <Input
            v-model="formValidate.AppInstructions"
            style="width:645px"
            placeholder="请输入备注说明"
            element-id="AppInstructions"
            :maxlength="200"
            show-word-limit
            type="textarea"
            :rows="4"
          />
        </FormItem>
      </Form>
      <div class="footBtn">
        <Button
          class="xy-btn-primary"
          shape="circle"
          @click="save"
        >
          <span v-if="!loading">保存</span>
          <span v-else>保存中...</span>
        </Button>
        <Button
          class="xy-btn-close"
          style="margin-right:20px;"
          @click="cancel"
        >
          取消
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'createHonor',
    data () {
      return {
        loading: false,
        host: '',
        formValidate: {
          EntryName: '',
          Subject: '',
          HonorType: '',
          Level: '',
          Ranking: '',
          formDate: null,
          Description: '',
          Screenshot: [],
          AppResults: '',
          AppInstructions: ''
        },
        ruleValidate: {
          EntryName: [
            { required: true, message: '项目名称不能为空', trigger: 'blur' },
            { trigger: 'blur', max: 10, message: '项目名称不得超过十个字' }
          ],
          Subject: [
            { required: true, message: '请选择学科', trigger: 'change', type: 'number' }
          ],
          HonorType: [
            { required: true, message: '请选择荣誉类型', trigger: 'change', type: 'number' }
          ],
          Level: [
            { required: true, message: '请选择荣誉级别', trigger: 'change', type: 'number' }
          ],
          Ranking: [
            { required: true, message: '请选择获奖等级', trigger: 'change', type: 'number' }
          ],
          formDate: [
            { required: true, message: '请选择获奖时间', trigger: 'blur', type: 'date' }
          ],
          Description: [
            { required: true, message: '项目概述不能为空', trigger: 'blur' }
          ]
        },
        SubjectList: [], // 学科列表
        HonorTypeList: [], // 荣誉类型列表
        LevelList: [], // 荣誉级别列表
        RankList: [], // 获奖等级列表
        isEdit: false,
        fileSize: 5, // 文件大小
        rowObj: {},
        visible: false,
        imgIndex: -1
      }
    },
    created () {
      // 获取科目
      this.getGetDisciplineList()
      // 获取类型
      this.getType()
      this.host = `${this.xyApi}/eva`
      this.rowObj = this.$store.state.evaluate.selfObj
      if (this.rowObj.HonorManagementID > 0) {
        this.isEdit = true
        this.getHonorDeclareDetail()
        if (this.rowObj.isApproal) {
          this.ruleValidate.AppResults = [ { required: true, message: '请选择审批结果', trigger: 'blur' } ]
        }
      } else {
        this.isEdit = false
      }
    },
    mounted () {},
    methods: {
      preview (index) {
        this.visible = true
        this.imgIndex = index
      },
      getType () {
        this.xy.get(`${this.$store.state.apiPath}/api/HonorDeclare/GetHonorDeclareDic`).then(res => {
          console.log(res)
          res.data.map(res => {
            // 获奖等级
            if (res.RoleType === 3) {
              this.RankList.push(res)
            }
            // 荣誉级别
            if (res.RoleType === 2) {
              this.LevelList.push(res)
            }
            // 荣誉类型
            if (res.RoleType === 1) {
              this.HonorTypeList.push(res)
            }
          })
        })
      },
      async getGetDisciplineList () {
        let res = await this.xy.get(
          this.xyApi + `/xy/comm/GetDisciplineList`
        )
        if (res.success) {
          this.SubjectList = res.data
        }
      },
      // ---------------上传图标 start---------------
      // 上传图标之前的钩子
      beforeUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < this.fileSize
        if (!isLt2M) {
          this.$message.error('您上传的证书不能超过' + this.fileSize + 'M。')
        }
        return isLt2M
      },
      // 自定义上传
      customRequest (file) {
        if (this.formValidate.Screenshot.length < 3) {
          this.xy.loading()
          var formData = new FormData()
          var filesUrls = file.file
          console.log(filesUrls.length)
          formData.append('name', filesUrls.name)
          formData.append('type', filesUrls.type)
          formData.append('size', filesUrls.size)
          formData.append('lastModifiedDate', filesUrls.lastModifiedDate)
          formData.append('File', filesUrls, 'photo.jpg')
          this.xy.post(`${this.$store.state.apiPath}/api/HonorDeclare/UploadImageByStudent`, formData).then(res => {
            this.formValidate.Screenshot.push(res.data[0])
            this.xy.msgSuc('图片上传成功')
          })
          this.xy.unloading()
        } else {
          this.xy.msgError('最多上传3张截图')
        }
      },
      uploadFunc (data, files) {

      },
      // 编辑
      async edit () {
        // 班主任审批
        if (this.rowObj.isApproal) {
          this.xy.loading()
          let params = {
            HonorManagementID: this.rowObj.HonorManagementID,
            HonorManagementName: this.formValidate.EntryName, // 荣誉名称
            SubjectID: this.formValidate.Subject, // 学科id，
            HonorManagementContent: this.formValidate.Description, // 项目概述,
            HonorTypeID: this.formValidate.HonorType, // 荣誉类型
            Level: this.formValidate.Level, // 获奖等级
            AwardsLevel: this.formValidate.Ranking, // 荣誉级别
            AwardsDate: this.xy.moment(this.formValidate.formDate).format('YYYY-MM-DD'), // 获奖时间
            ImgURL: this.formValidate.Screenshot, // 证书链接
            ApprovalContent: this.formValidate.AppInstructions,
            ApprovalState: this.formValidate.AppResults,
            type: 1
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/HonorDeclare/HonorApproval`, params)
          if (res.success) {
            this.xy.unloading()
            this.xy.msgSuc('保存成功')
            this.$router.go(-1)
          }
          this.loading = false
        } else {
          // 学生编辑
          this.xy.loading()
          let params = {
            HonorManagementID: this.rowObj.HonorManagementID,
            HonorManagementName: this.formValidate.EntryName, // 荣誉名称
            SubjectID: this.formValidate.Subject, // 学科id，
            HonorManagementContent: this.formValidate.Description, // 项目概述,
            HonorTypeID: this.formValidate.HonorType, // 荣誉类型
            Level: this.formValidate.Level, // 获奖等级
            AwardsLevel: this.formValidate.Ranking, // 荣誉级别
            AwardsDate: this.xy.moment(this.formValidate.formDate).format('YYYY-MM-DD'), // 获奖时间
            ImgURL: this.formValidate.Screenshot, // 证书链接
            type: 1
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/HonorDeclare/EditStudentHonorDeclare`, params)
          if (res.success) {
            this.xy.unloading()
            this.xy.msgSuc('保存成功')
            this.$router.go(-1)
          }
          this.loading = false
        }
      },
      // 创建
      async   create () {
        this.xy.loading()
        let params = {
          HonorManagementName: this.formValidate.EntryName, // 荣誉名称
          SubjectID: this.formValidate.Subject, // 学科id，
          HonorManagementContent: this.formValidate.Description, // 项目概述,
          HonorTypeID: this.formValidate.HonorType, // 荣誉类型
          Level: this.formValidate.Level, // 获奖等级
          AwardsLevel: this.formValidate.Ranking, // 荣誉级别
          AwardsDate: this.xy.moment(this.formValidate.formDate).format('YYYY-MM-DD'), // 获奖时间
          ImgURL: this.formValidate.Screenshot, // 证书链接
          type: 1
        }
        // /api/HonorDeclare/CreateStudentHonorDeclare
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/HonorDeclare/CreateStudentHonorDeclare`, params)
        if (res.success) {
          this.xy.unloading()
          this.xy.msgSuc('保存成功')
          this.$router.go(-1)
        }
        this.loading = false
      },
      // 日期变化
      timeChange (t) {
        // console.log(typeof new Date(t))
        this.formValidate.formDate = this.xy.moment(t).format('YYYY-MM-DD')
      },
      // 保存
      save () {
        this.loading = true
        console.log(this.formValidate.Screenshot)
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            if (this.formValidate.Screenshot.length === 0) {
              this.xy.msgError('必须上传证书')
              this.loading = false
              return false
            }
            if (this.isEdit) {
              this.edit()
            } else {
              this.create()
            }
          } else {
            this.loading = false
            // 校验表单前几项是否成功 如果校验失败，上传证书暂不提示
            this.$refs.formValidate.validateField('EntryName', valid1 => {
              this.$refs.formValidate.validateField('Subject', valid2 => {
                this.$refs.formValidate.validateField('HonorType', valid3 => {
                  this.$refs.formValidate.validateField('Level', valid4 => {
                    this.$refs.formValidate.validateField('Ranking', valid5 => {
                      this.$refs.formValidate.validateField('formDate', valid6 => {
                        this.$refs.formValidate.validateField('Description', valid7 => {
                          if (!valid1 && !valid2 && !valid3 && !valid4 && !valid5 && !valid6 && !valid7) {

                          }
                        })
                      })
                    })
                  })
                })
              })
            })
          }
        })
      },
      // 取消
      cancel () {
        // this.$refs.formValidate.resetFields()
        this.$router.go(-1)
      },
      // 获取编辑详情
      async getHonorDeclareDetail () {
        await this.xy.get(`${this.$store.state.apiPath}/api/HonorDeclare/GetHonorDeclareDetail?honormanagementID=${this.rowObj.HonorManagementID}`).then(res => {
          console.log(res)
          // this.formValidate
          this.formValidate.EntryName = res.data.HonorManagementName // 荣誉名称
          this.formValidate.Subject = res.data.SubjectID // 学科id，
          this.formValidate.Description = res.data.HonorManagementContent // 项目概述,
          this.formValidate.HonorType = res.data.HonorTypeID // 荣誉类型
          this.formValidate.Level = res.data.Level // 获奖等级
          this.formValidate.Ranking = res.data.AwardsLevel // 荣誉级别
          this.formValidate.formDate = this.xy.moment(res.data.AwardsDate).format('YYYY-MM-DD') // 获奖时间
          console.log(typeof this.formValidate.formDate)
          this.formValidate.Screenshot = res.data.ImgUrl === null ? [] : res.data.ImgUrl // 证书链接
          console.log(this.formValidate.Screenshot)
        })
      },
      delOne (item, index) {
        this.formValidate.Screenshot.splice(index, 1)
      }
    }
  }
</script>
<style lang='less' scoped>
/deep/ .ivu-form-item-error-tip {
  font-size: 12px;
}
/deep/ .ivu-form-item {
  margin-bottom: 32px;
}

.fromIptTop {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  >div {
    margin-right: 70px;
  }
}
.xy-content-body {
  padding: 20px 30px 50px;
}
.uploadImg {
  width: 14px;
  height: 14px;
  margin-right: 8px;
}
/deep/ .uploadImgBox>span {
  width: 84px;
  height: 32px;
  padding: 0;
  display: inline-block;
  >div {
    padding: 0 !important;
    border: none;
    >span {
      padding: 0 !important;
    }
  }
}
.uploadImgBox {
  position: relative;
  left: 80px;
  top: -26px;
  display: flex;
  flex-wrap: wrap;
  width: 570px;
  height: 128px;
  .uploadImgBtn {
    width: 84px;
    height: 32px;
    background: #fafafa;
    border: 1px solid #dddddd;
    border-radius: 4px;
    display: inline-block;
  }
  .uploadImgTip {
    color: #999;
    font-size: 14px;
    margin-left: 18px;
    display: inline-block;
    margin-bottom: 0;
  }
  ul {
    display: flex;
    align-items: center;
  }
  .imgsLi {
    width: 80px;
    height: 80px;
    margin-right: 16px;
    margin-top: 16px;
    overflow: visible;
    position: relative;
    img:nth-child(1) {
      width: 80px;
      height: 80px;
    }
    img:nth-child(2) {
      position: absolute;
      left: 72px;
      top: -8px;
      width: 16px;
      height: 16px;
      z-index: 1;
      cursor: pointer;
    }
  }
}
.footBtn {
  height: 60px;
  text-align: center;
  line-height: 60px;
  z-index: 199;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.5);
}
</style>
