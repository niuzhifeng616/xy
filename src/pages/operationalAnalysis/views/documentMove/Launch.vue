<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div class="form-w">
        <Form ref="formValidateOk" :model="formValidateOk" :rules="ruleValidateOk" :label-width="100">
          <FormItem label="公文主题" prop="docTitle" labelFor="docTitle" class="">
            <Input v-model.trim="formValidateOk.docTitle" elementId="docTitle" />
          </FormItem>
          <FormItem label="公文等级" prop="docRating">
            <RadioGroup v-model="formValidateOk.docRating">
              <Radio :label="2">紧急</Radio>
              <Radio :label="1">普通</Radio>
          </RadioGroup>
          </FormItem>
          <FormItem label="公文种类" prop="docType" class="">
            <Select v-model="formValidateOk.docType">
              <Option v-for="item in docTypeList" :key="item.Name" :value="item.ID">
                {{item.Name}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="发文机关" class="" prop="government" labelFor="government">
            <Input v-model.trim="formValidateOk.government" elementId="government" />
          </FormItem>
          <FormItem label="发文字号" class="" prop="IssuedNum" labelFor="IssuedNum">
            <Input v-model.trim="formValidateOk.IssuedNum" elementId="IssuedNum" />
          </FormItem>
          <FormItem label="文件内容" prop="filesList" class="">
            <i-button icon="ios-cloud-upload-outline" class="pr">
            <input id="fileAll" ref="fileAll" type="file" multiple="multiple" @change="changeFunc($event)" class="pa cursor-p" style="top:0;left:0;width:100%;height:100%;opacity:0;">
            上传附件
            </i-button>
            <div style="color:#9f9f9f">支持上传文件格式：rar， zip，jpeg，png，jpg，svg，gif，doc，docx，dotx，dot，pdf，txt，xml，ppt，pptx，xls，xlsx，xlst</div>
            <div style="color:#9f9f9f">附件最大可上传：100MB。</div>
            <div>
            <template v-for="(item,index) of formValidateOk.filesList">
              <div :key="index" class="files-flex" ref="filesDom">
                <div class="files-flex-text nowrap">
                  <i class="iconfont iconimg" v-if="item.type.indexOf('image')>-1">&#xe705;</i>
                  <i class="iconfont icontext" v-else>&#xe706;</i>
                  <span>{{item.name}}</span>
                </div>
                <Icon type="md-close-circle" color="#F5222D" size="22" @click="delFiles(index)" />
              </div>
            </template>
            </div>
          </FormItem>
          <FormItem label="添加人员" prop="addPepList" class="">
            <div class="add-doc-pep">
              <div class="add-doc-pep-btn" @click="isTeacher=true">
                <Icon type="ios-add" />
                添加
              </div>
              <div v-for="(item,index) in formValidateOk.addPepList" :key="index" class="add-doc-pep-text" @click="delPep(index)">
                <span>{{item.FullName}}</span>
                <Icon type="ios-close" />
              </div>
            </div>
          </FormItem>
          <FormItem label="说明事项" prop="textarea" labelFor="textarea" class="">
            <Input v-model="textarea" elementId="textarea" :autosize="{minRows: 5,maxRows: 5}" maxlength="300" show-word-limit  type="textarea" />
          </FormItem>
        </Form>
        <div style="margin-left: 100px;">
            <Button class="xy-btn-primary" shape="circle" @click="ok">提交</Button>
            <Button class="xy-btn-close" @click="cancel" style="margin-right:20px;">取消</Button>
        </div>
      </div>
    </div>
    <SelectTeacherOrg
      :isShow="isTeacher"
      :teachers="[...formValidateOk.addPepList]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm" />
  </div>
</template>
<script>
  import SelectTeacherOrg from '@/components/selectTeacherOrg/SelectTeacherOrg.vue'
  export default {
    name: 'Launch',
    components: {
      SelectTeacherOrg
    },
    data () {
      return {
        docTypes: ['rar', 'zip', 'PNG', 'JPG', 'JPEG', 'GIF', 'SVG', 'DOC', 'DOCX', 'DOTX', 'DOT', 'PDF', 'TXT', 'XML', 'PPT', 'PPTX', 'XLS', 'XLSX', 'XLST', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'doc', 'docx', 'dotx', 'dot', 'pdf', 'txt', 'xml', 'ppt', 'pptx', 'xls', 'xlsx', 'xlst'],
        isTeacher: false,
        totalMB: 0,
        docTypeList: [],
        textarea: '',
        formValidateOk: {
          docTitle: '',
          docType: null,
          government: '',
          IssuedNum: '',
          filesList: [],
          addPepList: [],
          docRating: 1
        },
        ruleValidateOk: {
          docTitle: [
            { required: true, message: '公文主题不能为空', trigger: 'blur' },
            { type: 'string', max: 80, message: '公文主题不能超过80个字符', trigger: 'blur' }
          ],
          docType: [
            { required: true, type: 'number', message: '公文种类不能为空', trigger: 'change' }
          ],
          docRating: [
            { required: true, type: 'number', message: '公文等级必选', trigger: 'change' }
          ],
          government: [
            { required: false, message: '发文机关不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '发文机关不能超过20个字符', trigger: 'blur' }
          ],
          IssuedNum: [
            { required: false, message: '发文字号不能为空', trigger: 'blur' },
            { type: 'string', max: 50, message: '发文字号不能超过50个字符', trigger: 'blur' }
          ],
          addPepList: [
            { required: true, type: 'array', min: 1, message: '人员不能为空', trigger: 'change' }
          ]
        }
      }
    },
    watch: {
      'formValidateOk.filesList': {
        handler (vals) {
          this.$refs.formValidateOk.validateField('filesList')
        },
        deep: true
      },
      'formValidateOk.addPepList': {
        handler (vals) {
          this.$refs.formValidateOk.validateField('addPepList')
        },
        deep: true
      }
    },
    created () {
      this.getListData()
    },
    methods: {
      async getListData () { // 获取公文类型
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/OfficialDocCirculationType/GetAll`)
        this.xy.unloading()
        if (res.success) {
          this.docTypeList = res.data
        }
      },
      delFiles (itemIndex) {
        this.$set(this.formValidateOk.filesList[itemIndex], 'isDel', true)
        let isDelLen = this.formValidateOk.filesList.filter(item => {
          return !item.isDel
        })
        this.formValidateOk.filesList = isDelLen
        this.totalMB = 0
        for (let i = 0, len = this.formValidateOk.filesList.length; i < len; i++) {
          if (!this.formValidateOk.filesList[i].isDel) {
            this.totalMB += this.formValidateOk.filesList[i].size / 1024 / 1024
          }
        }
        if (isDelLen.length === 0) {
          this.$refs.fileAll.value = null
        }
      },
      changeFunc (e) {
        for (var i = 0; i < e.target.files.length; i++) {
          let splitType = e.target.files[i].name.split('.')
          if (this.docTypes.indexOf(splitType[splitType.length - 1]) < 0) {
            this.xy.msgError('上传文件格式错误。')
            return
          }
        }
        this.totalMB = 0
        this.formValidateOk.filesList = [...this.formValidateOk.filesList, ...e.target.files]
        for (let i = 0, len = this.formValidateOk.filesList.length; i < len; i++) {
          if (this.formValidateOk.filesList[i].isDel === undefined || !this.formValidateOk.filesList[i].isDel) {
            this.$set(this.formValidateOk.filesList[i], 'isDel', false)
            this.totalMB += this.formValidateOk.filesList[i].size / 1024 / 1024
          }
        }
      },
      async upLoadFile () { // 上传
        this.xy.loading()
        let formData = new FormData()
        for (let i = 0, len = this.formValidateOk.filesList.length; i < len; i++) {
          formData.append('file', this.formValidateOk.filesList[i])
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/OfficialDocCirculationDoc/Upload`, formData)
        this.xy.unloading()
        if (res.success) {
          this.submitFunc(res.data)
        }
      },
      async submitFunc (returnFilesData) { // 提交
        let pepList = []
        this.formValidateOk.addPepList.map(item => {
          pepList.push(item.UserID)
        })
        let option = {
          Title: this.formValidateOk.docTitle, // 公文主题
          TypeID: this.formValidateOk.docType, // 公文种类
          DocumentAgency: this.formValidateOk.government, // 发文机关
          DocumentNumber: this.formValidateOk.IssuedNum, // 发文字号
          Note: this.textarea, // 说明事项
          DocFileList: returnFilesData && returnFilesData.DocFileList ? returnFilesData.DocFileList : [], // 附件集合
          DocUsers: pepList, // 人员集合
          SeverityLevel: this.formValidateOk.docRating // 公文等级
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/OfficialDocCirculationDoc/Create`, option)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('公文流转发起成功。')
          this.cancel()
        }
      },
      delPep (i) {
        this.formValidateOk.addPepList.splice(i, 1)
      },
      selectCancel () {
        this.isTeacher = false
      },
      selectConfirm (data) {
        if (data.length > 0) {
          this.isTeacher = false
          this.formValidateOk.addPepList = [...data]
        } else {
          this.xy.msgError('人员不能为空。')
        }
      },
      ok () {
        this.$refs.formValidateOk.validate((valid) => {
          if (!valid) {
            return this.unLoading()
          } else {
            if (this.totalMB > 100) {
              this.xy.unloading()
              this.xy.msgError('附件总大小不能超过100M。')
              return
            }
            // 执行上传和提交操作
            if (this.totalMB) {
              this.upLoadFile()
            } else {
              this.submitFunc()
            }
          }
        })
      },
      cancel () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="less" scoped>
.form-w{
  width: 600px;
  margin: 0 auto;
  .add-doc-pep{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    min-height: 32px;
    padding: 10px 10px 0;
    .add-doc-pep-btn{
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding:0 4px;
      height:22px;
      background:rgba(255,255,255,1);
      border:1px dashed rgba(65,150,255,1);
      border-radius:4px;
      color:#4196FF;
      margin:0 8px 10px 0;
      i{
        font-size: 18px;
        margin-right:5px;
      }
    }
    .add-doc-pep-text{
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding:0 4px;
      height:22px;
      background:rgba(240,240,240,1);
      border-radius:4px;
      margin:0 8px 10px 0;
      span{
        color:rgba(0,0,0,.65);
      }
      i{
        color:rgba(0,0,0,.65);
        font-size: 18px;
        margin-left:5px;
      }
    }
  }
  .files-flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:4px 6px;
    border-radius: 4px;
    cursor: pointer;
    .files-flex-text{
      flex: 1;
      margin-right: 40px;
      i{
        margin-right:5px;
      }
      .icontext{
        color:#4196FF;
      }
      .iconimg{
        color:#F1C64E;
      }
    }
  }
  .files-flex:hover{
    background: #f9f9f9;
  }
}
</style>
