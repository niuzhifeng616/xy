<!-- 评教设置：创建方案-基础信息 -->
<template>
  <Modal
    v-model="isShow"
    :title="isEdit ? '编辑方案' : '创建方案'"
    :mask-closable="false"
    :transfer="false"
    :closable="false"
    width="600"
    >
    <Form ref="formValidateOK" :model="formValidateOK" :rules="ruleValidateOK" :label-width="100">
      <FormItem label="方案名称：" prop="classTableName" labelFor="Item1">
        <Input v-model.trim="formValidateOK.classTableName" elementId="Item1"  maxlength="30" clearable style="width: 400px" autofocus placeholder="请输入方案名称" />
      </FormItem>
      <FormItem label="方案描述：" prop="describe" labelFor="Item2">
        <Input v-model.trim="formValidateOK.describe" elementId="Item2" maxlength="500" show-word-limit type="textarea" placeholder="请输入方案描述" style="width: 400px;" :rows="4" />
      </FormItem>
      <!-- 评教内容已添加时校区学年学期禁选 -->
      <FormItem label="校区：" prop="school" >
        <i-select v-model="formValidateOK.school" :disabled="total>0" @on-change="schoolChange" placeholder="请选择校区" style="width: 400px">
          <i-option v-for="school in schoolData" :value="school.value" :key="school.label">{{ school.label }}</i-option>
        </i-select>
      </FormItem>
      <FormItem label="学年学期：" prop="session" labelFor="yearSessionData">
        <cascader :data="yearSessionData" elementId="yearSessionData" style="width: 400px" :disabled="total>0" v-model="formValidateOK.session" @on-change="cascaderChange">
        </cascader>
      </FormItem>
      <FormItem label="起止时间：" prop="date" labelFor="Item3">
        <DatePicker :clearable="false" elementId="Item3" style="width: 400px" date-picker type="datetimerange" placeholder="选择起止时间" :value="formValidateOK.date" format="yyyy-MM-dd HH:mm" :editable="false" @on-change="noticeDateChange">
        </DatePicker>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button class="xy-modal-close" @click="modalCancel">取消</Button>
      <Button class="xy-modal-primary" shape="circle" :disabled="isPublish" @click="save">保存</Button>
    </div>
  </Modal>
</template>
<script>
  export default {
    name: 'evaCreateClassTable',
    props: {},
    // watch: {
    //   isShow (val) {
    //     if (!val) {
    //       // this.$refs.formValidateOK.resetFields()
    //     }
    //   }
    // },
    data () {
      return {
        isShow: true,
        isEdit: false,
        rowObj: {},
        isPublish: false, // 当前方案是否已经发布
        teachingProjectID: 0, // 当前方案id,编辑时

        total: 0,
        loading: false,
        // 添加的验证
        formValidateOK: {
          classTableName: '',
          describe: '',
          school: '',
          session: [],
          date: []
        },
        ruleValidateOK: {
          classTableName: [
            { required: true, message: '方案名称不能为空', trigger: 'blur' },
            { max: 30, message: '方案名称限制30字以内', trigger: 'blur' }
          ],
          school: [
            { type: 'number', required: true, message: '请选择校区', trigger: 'change' }
          ],
          session: [
            { type: 'array', required: true, message: '请选择学年学期', trigger: 'change' }
          ],
          date: [
            { type: 'array', len: 2, required: true, message: '请选择起止时间', trigger: 'change' } // validator: validateDate,
          ]
        },

        schoolData: [], // 校区
        yearSessionData: [] // 学年学期
      }
    },
    created () {
      if (Object.keys(this.$store.state.evaluate.evaRowObj).length > 0) { // 编辑
        this.isEdit = true
        this.rowObj = this.$store.state.evaluate.evaRowObj
        this.isPublish = this.rowObj.IsPublished
        this.teachingProjectID = this.rowObj.TeachingProjectID

        this.formValidateOK.classTableName = this.rowObj.TeachingProjectName
        this.formValidateOK.describe = this.rowObj.TeachingProjectDescribe
        this.formValidateOK.date = [this.rowObj.StartDate, this.rowObj.EndDate]

        this.getSchool(this.rowObj)
        this.getTable()
      } else { // 创建
        this.isEdit = false
        this.getSchool()
      }
    },
    methods: {
      // 起止时间
      noticeDateChange (val) {
        this.formValidateOK.date = val
      },
      // 获取校区
      async getSchool (resObj) {
        var _this = this
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/SchoolDistrictList`)
        if (res.success) {
          _this.schoolData = []
          var resData = res.data
          $.each(resData, function (index, item) {
            _this.schoolData.push({
              value: item.SchoolDistrictID,
              label: item.SchoolDistrictName
            })
          })
          if (resObj !== '' && resObj !== undefined) { // 编辑
            _this.formValidateOK.school = this.rowObj.SchoolDistrictID
            _this.getSessionNodeList(resObj)
          } else { // 创建
            if (resData.length > 0) {
              _this.formValidateOK.school = resData[0].SchoolDistrictID
            }
            _this.getSessionNodeList()
          }
        }
        this.xy.unloading()
      },
      schoolChange (value) {
        this.formValidateOK.school = value
      },
      // 学年学期
      async getSessionNodeList (resObj) {
        var that = this
        this.xy.loading()
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`)
        if (res.success) {
          that.yearSessionData = res.data
          if (resObj !== '' && resObj !== undefined) { // 编辑
            for (var m = 0; m < that.yearSessionData.length; m++) {
              for (var n = 0; n < that.yearSessionData[m].children.length; n++) {
                if (that.yearSessionData[m].children[n].value === this.rowObj.AcademicSessionID) {
                  that.formValidateOK.session[0] = that.yearSessionData[m].value
                  that.formValidateOK.session[1] = this.rowObj.AcademicSessionID
                }
              }
            }
          } else { // 创建
            that.formValidateOK.session = []
            var index = that.yearSessionData.map(function (item) {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              that.formValidateOK.session.push(that.yearSessionData[index].value)
              var index1 = that.yearSessionData[index].children.map(function (item) {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                that.formValidateOK.session.push(that.yearSessionData[index].children[index1].value)
              } else {
                that.formValidateOK.session.push(that.yearSessionData[index].children[0].value)
              }
            } else {
              for (var i = 0; i < that.yearSessionData.length; i++) {
                if (that.yearSessionData[i].children.length > 0) {
                  that.formValidateOK.session = [that.yearSessionData[i].value, that.yearSessionData[i].children[0].value]
                  return false
                }
              }
            }
          }
        }
        this.xy.unloading()
      },
      cascaderChange (value, selectedData) {
        this.formValidateOK.session = value
      },
      // 取消编辑、创建
      modalCancel () {
        // this.$refs.formValidateOK.resetFields()
        this.$emit('select-cancel')
      },
      save () {
        this.loading = true
        this.$refs.formValidateOK.validate((valid) => {
          if (!valid) {
            this.loading = false
          } else {
            this.saveFun()
          }
        })
      },
      async saveFun (type) {
        this.xy.loading()
        let obj = {
          TeachingProjectID: this.teachingProjectID || 0,
          TeachingProjectName: this.formValidateOK.classTableName,
          SchoolDistrictID: this.formValidateOK.school,
          AcademicSessionID: this.formValidateOK.session[1],
          StartDate: this.formValidateOK.date[0],
          EndDate: this.formValidateOK.date[1],
          TeachingProjectDescribe: this.formValidateOK.describe || ''
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StudentTeachingProject/Create`, obj)
        if (res.success) {
          if (!this.isEdit) {
            // 创建
            this.$emit('select-confirm', {
              TeachingProjectID: res.data,
              TeachingProjectName: this.formValidateOK.classTableName,
              TeachingProjectDescribe: this.formValidateOK.describe,
              SchoolDistrictID: this.formValidateOK.school,
              IsPublished: false,
              IsEdit: this.isEdit
            })
          } else {
            // 编辑
            this.$emit('select-confirm', {
              TeachingProjectID: this.teachingProjectID,
              TeachingProjectName: this.formValidateOK.classTableName,
              TeachingProjectDescribe: this.formValidateOK.describe,
              SchoolDistrictID: this.formValidateOK.school,
              IsPublished: this.isPublish,
              IsEdit: this.isEdit
            })
          }
          this.xy.msgSuc(this.isEdit ? '编辑成功。' : '创建成功。')
        }
        this.xy.unloading()
        this.loading = false
      },

      async getTable () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingQuestionnaire/GetPage`, {
          pageIndex: 1,
          pageSize: 15,
          teachingProjectID: this.teachingProjectID
        })
        if (res.success) {
          this.total = res.data.Table.totalRecords
        }
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
