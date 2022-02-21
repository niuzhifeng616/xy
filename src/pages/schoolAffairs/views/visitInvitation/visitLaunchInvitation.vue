<template>
  <div class='xy-content-module'>
    <div class='xy-content-body' style="margin-top:8px">
          <row>
              <i-col :sm="{span: 10}" :md="{ span: 10}" :lg="{span:7}" class="left-body">
                  <div class="left-box">
                      <div class="box-header">
                          <h3 style="font-weight:600">邀请人员名单</h3>
                          <p style="font-weight:500;font-size:14px;color:#1677FF;margin-bottom: 5px;">总数：{{vInformation.length}}人</p>
                      </div>
                      <div style="margin:20px 0 10px 15px">
                        <Button class="xy-primary" @click="add"><span style="font-size: 20px;">+</span> <span style="vertical-align: text-bottom;">添加</span></Button>
                        <Button class="xy-info" @click="importAll">批量导入</Button>
                        <Button class="xy-info" @click="empty">清空名单</Button>
                      </div>
                      <div class="box-body" v-if="vInformation.length>0">
                        <div v-for="(item, index) in vInformation" :key="index" @mouseover="mouseOver(index)" @mouseleave="mouseLeave(index)" class="teachers-show" >
                          <div class="teachers-show-item">
                            <div class="iconName">
                                <!-- <img class="left-img" v-if="item.Icon" :src="imgUrl + item.Icon" /> -->
                                <span class="left-span" :style="{background:'#1677FF',color:'#fff'}">{{xy.showName(item.name.toString())}}</span>
                            </div>
                            <div class="content-text" >
                              <span>{{item.name}}</span><br/>
                              <span :style="{color:item.check===true ? 'red':'#000'}">手机号：{{item.phone}}</span>
                            </div>
                            <i class="iconfont hoverImage" v-show="activeHover===index" @click="edit(item,index)">&#xe6f7;</i>
                            <i class="iconfont hoverImage" v-show="activeHover===index"  style="margin-left:20px;" @click="ondelete(item,index)">&#xe6e1;</i>
                          </div>
                        </div>
                      </div>
                      <div v-else class="box-body " style="display: flex;justify-content: center;font-size: 15px;padding-top: 200px;color: rgba(0,0,0,0.4)">
                        <span>暂无人员名单，请先添加邀请人员。</span>
                      </div>
                  </div>
              </i-col>
              <i-col :sm="{ span: 14}"  :md="{ span: 14}" :lg="{span:17}" class="right-body"  >
                <div class="right-box">
                    <div class="box-describe">
                       <h3 style="font-weight:600">邀请信息</h3>
                   </div>
                     <Form
                      class="box-body"
                      ref="formValidateCreate"
                      :rules="ruleValidateCreate"
                      :model="formValidateCreate"
                      :label-width="80"
                      style="width: 97%;margin-left: 1%;margin-top: 28px;"
                      >
                      <FormItem label="邀请主题" prop="visitTheme" labelFor='visitTheme'>
                        <Input v-model="formValidateCreate.visitTheme" placeholder="请输入主题" @input="inputEmoji()"  maxlength="50" show-word-limit  elementId="visitTheme" />
                      </FormItem>
                      <FormItem label="邀请内容" prop="visiContent" labelFor='visiContent'>
                        <Input v-model="formValidateCreate.visiContent" placeholder="请输入内容" @input="inputEmoji()"  maxlength="200" show-word-limit type="textarea" elementId="visiContent" />
                      </FormItem>
                       <FormItem label="到访时间">
                        <Row>
                            <i-col span="12" style="padding-right: 18px;">
                                <FormItem prop="visitData">
                                    <DatePicker
                                    style="width:100%;"
                                    format="yyyy-MM-dd"
                                    :options="options"
                                    type="date"
                                    placeholder="请选择日期"
                                    v-model="formValidateCreate.visitData"
                                    :value="currentDate"
                                    show-word-limit
                                    :editable="false"
                                    >
                                    </DatePicker>
                                </FormItem>
                            </i-col>
                            <i-col span="12" >
                                <FormItem prop="time">
                                    <TimePicker style="width:100%" :editable="false" type="time"  format="HH:mm" placeholder="请选择时间" v-model="formValidateCreate.time"></TimePicker>
                                </FormItem>
                            </i-col>
                        </Row>
                    </FormItem>
                      <FormItem label="地址" prop="visitAddress" labelFor='visitAddress'>
                        <Input v-model="formValidateCreate.visitAddress" placeholder="请输入地址" @input="inputEmoji()"  maxlength="100" show-word-limit type="textarea" elementId="visitAddress" />
                      </FormItem>
                    </Form>
                </div>
              </i-col>
          </row>
    </div>
    <div class="worflow-submit">
        <Button class="xy-btn-primary"  @click="answer('formValidateCreate')" shape="circle" >发布</Button>
    </div>
    <Modal
      v-model='screenModelAdd'
      :transfer='false'
      :mask-closable="false"
      :closable="false"
      title='添加邀请人员'
      >
      <div class='dialog-model-content'>
          <div class="option-title">
            <p class="option-left">姓名：</p>
            <p class="option-left">手机号：</p>
          </div>
          <template>
            <div>
              <div style="display:flex; margin-bottom:15px;" v-for="(item, index) in formInvitation" :key="index" >
                <div class="input-title" :class="[item.isCheckName===true?'ivu-form-item-error':'']">
                  <Input type="text" v-model.trim="item.name" @input="checkoutInputName(item.name,index)" placeholder="请输入姓名"  style="border-radius: 4px;"/>
                </div>
                <div class="input-title1" :class="[item.isCheckPhone===true?'ivu-form-item-error':'']">
                  <Input type="text" @input.native="checkoutInputPhone(item.phone,index)"  style="border-radius: 4px;" v-model.trim="item.phone" placeholder="请输入手机号" />
                  <!-- <span v-show="item.isCheckPhone" style="font-size:12px;color:red;display: block;">手机号不正确，请填写正确手机号。</span> -->
                </div>
                <div class="input-item" style="display:flex;margin-left: 8px;">
                  <Icon type="ios-add" class="icon-btn" @click="addOption" />
                  <Icon type="ios-remove" class="icon-btn" @click="delOption(index)" />
                </div>
              </div>
            </div>
          </template>
      </div>
      <div slot='footer'>
        <Button class='xy-modal-close' @click='cancel'>取消</Button>
        <Button class='xy-modal-primary' shape='circle' @click='addok'>确定</Button>
      </div>
    </Modal>
    <Modal
      v-model='screenModel'
      :transfer='false'
      :mask-closable="false"
      :closable="false"
      title='修改信息'
      >
      <div class='dialog-model-content'>
        <Form
          :model="formValidateCreate"
          :label-width="80"
          style="width: 97%;margin-left: 1%;margin-top: 28px;"
          >
            <FormItem label="姓名" prop="vname" labelFor='vname'>
              <Input v-model="vname" @input="inputEmoji()" type="text" elementId="vname" />
            </FormItem>
            <FormItem label="手机号" prop="vphone" labelFor='vphone'>
              <Input v-model="vphone" @input="inputEmoji()" type="text" elementId="vphone" />
            </FormItem>
        </Form>
      </div>
      <div slot='footer'>
        <Button class='xy-modal-close' @click='cancel'>取消</Button>
        <Button class='xy-modal-primary' shape='circle' @click='ok'>确定</Button>
      </div>
    </Modal>
    <fileSelect
      ref="upfile"
      :modalTitle="upload.title"
      :describeData="upload.tipData"
      :fileFormt="upload.formtData"
      :fileSize="upload.size"
      :importPath="upload.upUrl"
      :paramsData="upload.upParams"
      :templateUrl="upload.templateUrl"
      :errorUrl="upload.errorUrl"
      :isShowUpload="upload.isShowUpload"
      @fileChange="fileChange"
      >
    </fileSelect>
  </div>
</template>
<script>
      // 引入上传模版
  import fileSelect from '../../components/fileSelect'
  import XLSX from 'xlsx'
  export default {
    name: 'visitLaunchInvitation',
    components: {
      fileSelect
    },
    data () {
      return {
        formInvitation: [
          {
            name: '',
            phone: null,
            isCheckPhone: false,
            isCheckName: false
          }
        ],
        upload: {
          title: '上传demo',
          tipData: [],
          formtData: ['txt'],
          size: 1024,
          upUrl: '//jsonplaceholder.typicode.com/posts/',
          upParams: {},
          templateUrl: '',
          errorUrl: '',
          isShowUpload: false
        },
        vInformation: [],
        // 验证规则
        ruleValidateCreate: {
          visitTheme: [{
            required: true,
            message: '邀请主题不能为空',
            trigger: 'blur'
          }],
          visiContent: [{
            required: true,
            message: '邀请内容不能为空',
            trigger: 'blur'
          }],
          visitData: [{
            required: true,
            type: 'date',
            message: '请选择日期',
            trigger: 'change'
          }],
          time: [{
            required: true,
            type: 'string',
            message: '请选择时间',
            trigger: 'change'
          }
          ],
          visitAddress: [
            {
              required: true,
              message: '地址不能为空',
              trigger: 'blur'
            }
          ]
        },
        formValidateCreate: {
          visitTheme: null,
          visiContent: null,
          visitData: null,
          time: null,
          visitAddress: null
        },
        currentDate: '',
        options: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000
          }
        },
        options1: {
          disableHours (hours) {
            return hours && hours.valueOf() < new Date().getHours()
          }
        },
        activeHover: -1,
        screenModelAdd: false,
        screenModel: false,
        isShowtip: false,
        vphone: '',
        vname: '',
        vcheck: false,
        tableAll: [],
        errCheck: false, // 手机号正确否提示
        editIndex: -1,
        vforom: [],
        newarr: [],
        redarr: []
      }
    },
    watch: {
      formValidateCreate: {
        handler (newName, oldName) {
          this.formValidateCreate.time = newName.time
          // console.log(this.formValidateCreate.time)
        },
        deep: true
      }
    },
    created () {
      console.log(this.xy.moment().format('YYYY-MM-DD'))
      this.xy.moment(new Date()).format('YYYY-MM-DD')
    },
    mounted () {},
    methods: {
      inputEmoji () {
        var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\uA9|\uAE]\u3030|\uA9|\uAE|\u3030/ig
        if (regStr.test(this.formValidateCreate.visitTheme)) {
          this.$nextTick(() => {
            this.formValidateCreate.visitTheme = this.formValidateCreate.visitTheme.replace(regStr, '')
          })
        } else if (regStr.test(this.formValidateCreate.visiContent)) {
          this.$nextTick(() => {
            this.formValidateCreate.visiContent = this.formValidateCreate.visiContent.replace(regStr, '')
          })
        } else if (regStr.test(this.formValidateCreate.visitAddress)) {
          this.$nextTick(() => {
            this.formValidateCreate.visitAddress = this.formValidateCreate.visitAddress.replace(regStr, '')
          })
        } else if (regStr.test(this.vname)) {
          this.$nextTick(() => {
            this.vname = this.vname.replace(regStr, '')
          })
        }
      },
      // 鼠标滑动
      mouseOver (index) {
        this.activeHover = index
      },
      mouseLeave (index) {
        this.activeHover = -1
      },
      // 点击图片进行姓名/手机号修改
      edit (row, index) {
        this.screenModel = true
        this.vname = row.name
        this.vphone = row.phone
        this.editIndex = index
      },
      // 清空所以数据
      empty () {
        if (this.vInformation.length > 0) {
          this.xy.confirm('删除', `您确认要删除所有邀请人吗？`, () => {
            this.vInformation.splice(0, this.vInformation.length)
          })
        } else {
          this.xy.msgError('暂无人员名单，请先添加邀请人员。')
        }
      },
      // 删除当前项
      ondelete (row, index) {
        this.xy.confirm('删除', `您确认要删除当前邀请人吗？`, () => {
          this.vInformation.splice(index, 1)
          this.checkPhone()
        })
      },
      // Model取消
      cancel () {
        this.screenModelAdd = false
        this.screenModel = false
        this.isShowtip = false
      },
      // 检验input框姓名存在
      checkoutInputName (name, i) {
        // this.inputEmoji(i)
        var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\uA9|\uAE]\u3030|\uA9|\uAE|\u3030/ig
        if (regStr.test(this.formInvitation[i].name)) {
          this.$nextTick(() => {
            this.formInvitation[i].name = this.formInvitation[i].name.replace(regStr, '')
          })
        }
        if (name) {
          this.formInvitation[i].isCheckName = false
        }
      },
      // 检验input框手机号是否正确
      checkoutInputPhone (phone, i) {
        if (phone.length === 11 && (/^1[3456789]\d{9}$/.test(phone))) {
          this.formInvitation[i].isCheckPhone = false
        }
      },
      // 确认添加判断
      checkaddok (formInArr) {
        var inWrong = false
        var inWrongName = false
        var inWrongPhone = false
        for (var i = 0; i < formInArr.length; i++) {
          if (!formInArr[i]['name']) {
            formInArr[i].isCheckName = true
            inWrong = true
            inWrongName = true
          }
          if (!(/^1[3456789]\d{9}$/.test(formInArr[i]['phone']))) {
            formInArr[i].isCheckPhone = true
            inWrong = true
            inWrongPhone = true
          }
        }
        if (inWrongName && inWrongPhone) {
          this.xy.msgError('姓名和手机号不正确。')
        } else if (inWrongName && !inWrongPhone) {
          this.xy.msgError('姓名不能为空。')
        } else if (inWrongPhone && !inWrongName) {
          this.xy.msgError('手机号不正确。')
        }
        return inWrong
      },
      // 确认添加
      addok () {
        if (!this.checkaddok(this.formInvitation)) {
          for (var i = 0; i < this.formInvitation.length; i++) {
            var exist = false
            for (var j = 0; j < this.vInformation.length; j++) {
              // if (this.formInvitation[i].phone.toString() === this.vInformation[j].phone.toString()) {
              if (Number(this.formInvitation[i].phone) === Number(this.vInformation[j].phone)) {
                this.vInformation[j].name = this.formInvitation[i].name
                exist = true
              }
            }
            if (!exist) {
              this.vInformation.push(JSON.parse(JSON.stringify(this.formInvitation[i])))
            }
          }
          this.screenModelAdd = false
        }
        console.log(this.vInformation)
      },
      //
      counterArray (arr) {
        var obj = {}
        arr.forEach(function (v, k) {
          if (obj[v]) {
            obj[v]++
          } else {
            obj[v] = 1
          }
        })
        return obj
      },
      ok () {
        // this.deleteArr = []
        let numberPhone = []
        for (var h = 0; h < this.vInformation.length; h++) {
          numberPhone.push(Number(this.vInformation[h].phone))
        }
        var counterNumberPhone = this.counterArray(numberPhone)
        let nameString = this.vname + ''
        if (!nameString.trim()) {
          this.xy.msgError('姓名不能为空。')
          return false
        }
        if (!(/^1[3456789]\d{9}$/.test(this.vphone))) {
          this.xy.msgError('手机号不正确，请填写正确手机号。')
        } else if (this.vInformation[this.editIndex].check && this.vphone === this.vInformation[this.editIndex].phone && counterNumberPhone[this.vphone] > 1) {
          this.xy.msgError('手机号已存在，请填写正确手机号。')
        } else {
          let iphoneArr = []
          for (var i = 0; i < this.vInformation.length; i++) {
            iphoneArr.push(Number(this.vInformation[i].phone))
          }
          console.log(iphoneArr)
          console.log(this.vphone)
          if (iphoneArr.includes(Number(this.vphone)) && Number(this.vphone) !== iphoneArr[this.editIndex]) {
            this.xy.msgError('手机号已存在，请填写正确手机号。')
            return false
          } else {
            this.screenModel = false
          }
          this.vInformation[this.editIndex].name = nameString.trim()
          this.vInformation[this.editIndex].phone = this.vphone
          this.vInformation[this.editIndex].check = false
          this.checkPhone()
        }
      },
      // add添加
      add () {
        this.screenModelAdd = true
        // 每次点击添加初始化添加框
        this.formInvitation = [{ name: '', phone: null, isCheckPhone: false, isCheckName: false }]
      },
      p (s) {
        return s < 10 ? '0' + s : s
      },
      async answer (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.vInformation.length > 0) {
              for (var i = 0; i < this.vInformation.length; i++) {
                if (this.vInformation[i]['check']) {
                  this.xy.msgError('邀请人员名单错误，无法发送。')
                  return false
                }
              }
            } else {
              this.xy.msgError('邀请人员不能为空，请添加邀请人员。')
              return false
            }
            // 判断时间是否有效
            let timeHours = Number(this.formValidateCreate.time.slice(0, 2))
            let timeMinutes = Number(this.formValidateCreate.time.slice(3, 5))
            let timeHoursMinutes = [timeHours, timeMinutes]
            let nowHours = Number(new Date().getHours())
            let nowMinutes = Number(new Date().getMinutes())
            let nowHoursMinutes = [nowHours, nowMinutes]
            console.log(timeHoursMinutes)
            const resDate = this.xy.moment(this.formValidateCreate.visitData).format('YYYY-MM-DD')
            const resDate1 = this.xy.moment().format('YYYY-MM-DD')
            console.log(nowHoursMinutes)
            if (resDate === resDate1 && this.formValidateCreate.time && nowHoursMinutes[0] >= timeHoursMinutes[0]) {
              if (nowHoursMinutes[1] >= timeHoursMinutes[1]) {
                this.xy.msgError('到访时间需要大于当前时间。')
                return false
              }
            }
            this.xy.confirm('温馨提示', `您确定发送邀请信息吗？`, () => {
              this.postAnswer()
            })
          }
        })
      },
      async postAnswer () {
        this.vforom = this.vInformation.map((item, i) => {
          return {
            'InvatationFullName': item.name.toString(),
            'InvatationPhoneNumber': item.phone.toString()
          }
        })
        const resDate = this.xy.moment(this.formValidateCreate.visitData).format('YYYY-MM-DD') + ' ' + this.formValidateCreate.time
        const webSiteTitle = localStorage.getItem('webSiteTitle')
        const LinkUrl = this.xyMobileUrl + '/homeSchool/InvitationLink'
        let params = {
          InvatationTitle: this.formValidateCreate.visitTheme, // 邀请主题
          InvatationContent: this.formValidateCreate.visiContent, // 邀请内容
          InvatationArriveTime: resDate, // 邀请到访时间
          InvatationArriveAddress: this.formValidateCreate.visitAddress, // 邀请到访地址
          InvatationUsers: this.vforom, // 邀请人员信息（手机号和姓名数组
          InvatationSchoolName: webSiteTitle, // 学校名称
          LinkUrl: LinkUrl,
          ApiUrl: this.xyApi
        }
        let res = await this.xy.post(
          this.xyApi + '/vst' + '/invatation/InsertInvatationInfo', params
          // 'http://devpczx.xiaoyangedu.net:9092' + '/vst/invatation/InsertInvatationInfo', params
        )
        if (res !== undefined && res.success) {
          // this.xy.msgSuc('邀请成功！')
          this.$router.push({
            path: '/xyHome/sa/visitInvitationList',
            query: this.$store.state.common.menuInfo
          })
        }
      },
      // 添加邀请人员
      addOption () {
        this.formInvitation.push({ name: '', phone: null, isCheckPhone: false, isCheckName: false })
      },
      // 删除邀请人员
      delOption (index) {
        if (this.formInvitation.length > 1) {
          for (var i = 0; i < this.vInformation.length; i++) {
            if (this.vInformation[i].phone === this.formInvitation[index].phone) {
              this.vInformation.splice(i, 1)
            }
          }
          this.formInvitation.splice(index, 1)
        } else {
          this.xy.msgError('邀请人员不能少于1项。')
        }
      },
      // 导入后刷新
      fileChange (res) {
        console.log(res)
        var fileExt = res.name.split('.')[1]
        if (fileExt !== 'xls' && fileExt !== 'xlsx') {
          this.xy.msgError('文件格式不正确！')
          return
        }
        if (res.size > 1024 * 1024) {
          this.xy.msgError('文件超出1024kb大小限制！')
          return
        }
        // 解析execl
        this.getUploadFile(res)
      },
      getUploadFile (e) {
        var that = this
        console.log('第一次选择这个文件')
        // 拿到所导入文件的名字
        console.log(e)
        let fileName = e
        console.log(fileName)
        // 定义reader，存放文件读取方法
        let reader = new FileReader()
        // 启动函数
        reader.readAsBinaryString(fileName)
        // onload在文件被读取时自动触发
        reader.onload = function (e) {
          console.log(e)
          // workbook存放excel的所有基本信息
          let workbook = XLSX.read(e.target.result, { type: 'binary' })
          // 定义sheetList中存放excel表格的sheet表，就是最下方的tab
          let sheetList = workbook.SheetNames
          // 存放json数组格式的表格数据
          let resultJson = []
          // 存放字符串数组格式的表格数据
          let resultFormulae = []
          sheetList.forEach(function (y) {
            let json = XLSX.utils.sheet_to_json(workbook.Sheets[y])
            let formulae = XLSX.utils.sheet_to_formulae(workbook.Sheets[y])
            if (json.length > 0) {
              // 数据处理与存放
              resultJson.push(json)
              resultFormulae.push(formulae)
            }
            let tableHeader = Object.keys(json[0]) // 获取表格手机列
            console.log(tableHeader)
            // 判断表格标题是否与模板一致
            // if (tableHeader[0] !== '邀请函') {
            //   that.xy.msgError('表格标题不正确，请下载模板。')
            //   return false
            // }
            console.log(json)
            let tableaa = []
            tableHeader.map((i) => {
              let jsonItem = json.map((item, index) => {
                return item[i]
              })
              tableaa.push(jsonItem)
            })
            that.tableAll = []
            for (var i = 0; i < tableaa[0].length; i++) {
              console.log(i)
              if (i === 0) {
                continue
              }
              let item = {
                name: tableaa[1][i],
                phone: tableaa[2][i]
              }
              if (item.name === undefined) {
                that.xy.msgError('存在姓名为空，请检查表格。')
                that.tableAll = []
                return false
              }
              if (item.phone === undefined) {
                that.xy.msgError('存在手机号为空，请检查表格。')
                that.tableAll = []
                return false
              }
              if (isNaN(item.phone)) {
                that.xy.msgError('存在手机号不为数字，请检查表格。')
                that.tableAll = []
                return false
              }
              console.log(that.tableAll)
              that.tableAll.push(item)
            }
            console.log(that.tableAll)
            // 判断表头字段是否与模板一致
            if (tableaa[1][0] !== '受邀人姓名（必填）' || tableaa[2][0] !== '手机号码（必填）') {
              that.xy.msgError('表头字段不正确，请下载模板。')
              return false
            } else if (that.tableAll.length === 0) {
              that.xy.msgError('邀请人员名单不能为空。')
              return false
            } else {
              console.log(tableaa[1][1])
              console.log(tableaa[2][1])
              that.$refs['upfile'].modalImport = false
              that.xy.msgSuc('成功。')
            }
          })
          for (var i = 0; i < that.tableAll.length; i++) {
            // if (!this.InImport(formArr[i], this.firstvInformation)) {
            that.vInformation.push(JSON.parse(JSON.stringify(that.tableAll[i])))
          // }
          }
          console.log(that.vInformation)
          that.checkPhone()
        }
      },
      // 去重
      filterRepeat (arr, prop) {
        let farr = []
        let tarr = []
        let that = this
        return arr.filter(function (element, index, self) {
          let a = self.findIndex(el => el[prop] === element[prop]) === index
          if (a) {
            tarr.push(arr[index])
            console.log(tarr)
            that.newarr = tarr
            console.log(that.newarr)
          } else {
            arr[index].check = true
            farr.push(arr[index])
            that.redarr.push(...farr)
          }
        })
      },
      // 检测导入重复
      // InImport (item, arr) {
      //   for (var i = 0; i < arr.length; i++) {
      //     if (item.phone === arr[i].phone) {
      //       return true
      //     }
      //   }
      //   return false
      // },
      checkPhone () {
        var temp = {}
        for (var h = 0; h < this.vInformation.length; h++) {
          var phone = this.vInformation[h].phone
          if (temp[phone] === undefined) {
            temp[phone] = h
            this.vInformation[h].check = false
          } else {
            this.vInformation[h].check = true
            this.vInformation[temp[phone]].check = true
          }
          if (!(/^1[3456789]\d{9}$/.test(this.vInformation[h]['phone']))) {
            this.vInformation[h].check = true
          }
        }
        this.vInformation.sort(function (a, b) {
          var num1 = a.check ? 1 : 0
          var num2 = b.check ? 1 : 0
          if (num1 > num2) {
            return -1
          }
          if (num1 < num2) {
            return 1
          }
          // if (a.check && !b.check) {
          //   return -1
          // }
          // if (!a.check && b.check) {
          //   return 1
          // }
          return 0
        })
        this.repeatSort(this.vInformation)
      },
      // 重复数据重新排序
      repeatSort (data) {
        let cache = {}
        let indices = []
        data.forEach((item, i) => {
          let pid = item.phone
          let index = cache[pid]
          if (index !== undefined) {
            indices[index].push(i)
          } else {
            cache[pid] = indices.length
            indices.push([i])
          }
        })
        let result = []
        indices.forEach(item => {
          item.forEach(index => {
            result.push(data[index])
          })
        })
        this.vInformation = result
      },
      // 批量导入
      importAll () {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          title: '批量导入邀请名单', // 标题
          ipData: [], // 提示语句
          formtData: ['xlsx', 'xls'], // 支持的文件类型
          size: 1024, // 文件大小限制，单位 kb
          upUrl: '//jsonplaceholder.typicode.com/posts/', // 上传文件url
          upParams: {}, // 上传参数
          templateUrl: this.xyApi + '/vst' + '/invatation/DownloadFile', // 模板下载url
          //  templateUrl: 'http://devpczx.xiaoyangedu.net:9092' + '/vst/invatation/DownloadFile', // 模板下载url
          errorUrl: '//jsonplaceholder.typicode.com/posts/' // 下载错误文件url
        }
      }
    }
  }
</script>
<style lang='less' scoped>
.xy-content-module{
   background: #f9f9f9;
   padding: 6px 18px;
   .xy-content-body{
     padding:0;
     .left-body{
       border-right: 18px solid #f9f9f9;
       .left-box{
          width:100%;
          margin-right:20px;
          .box-header {
            height: 58px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
            padding: 0 15px;
            font-size: 16px;
            font-weight:600;
          }
          .box-body{
            width:100%;
            height: 880px;
            overflow: auto;
            padding-bottom: 60px;
            .teachers-show{
              width:100%;
              height:70px;
              padding:0px 0px 0px 15px;
              // cursor: pointer;
              .teachers-show-item{
                width:100%;
                height:100%;
                padding-right: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .iconName{
                  // flex:1;
                  float:left;
                  .left-img{
                    display: inline-block;
                    width: 42px;
                    height: 42px;
                    border-radius:50%;
                    line-height:42px;
                    text-align:center;
                    box-shadow: 0px 0px 1px 1px #dddddd;
                  }
                  .left-span{
                    display: inline-block;
                    width: 42px;
                    height: 42px;
                    border-radius:50%;
                    line-height:42px;
                    text-align:center;
                    color:#fff;
                  }
                }
                .content-text{
                  float:left;
                  margin: 0 15px;
                  flex: 6;
                  margin-bottom: 4px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                .content-text span:nth-child(1){
                  cursor:default;
                  font-size: 14px;
                }
                .content-text span:nth-child(2){
                  cursor:default;
                  font-size: 13px;
                }
                .choose-teachers{
                  float:right;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  width: 30px;
                }
              }
            }
          }
       }
     }
     .right-body{
       .right-box{
          width:100%;
          .box-header1 {
            height: 58px;
            line-height: 58px;
            // display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            font-size:20px;
            font-weight:bold;
            color:rgba(0,0,0,1);
            opacity:0.85;
         }
        .box-describe{
          border-bottom: 1px solid #eee;
          padding: 16px 0 16px 25px;
          color:rgba(0,0,0,0.85);
          font-size:16px;
          font-weight: 600;
        }
        .box-body{
          width:100%;
          height:830px;
          overflow: auto;
          margin-bottom:60px;
          .qusetions-show{
            width:100%;
            height:auto;
            padding:20px 30px 20px 4px;
            border-bottom:1px dashed #eee;
            .choose-title{
              font-weight: 700;
              span{
                color:#F5222D;
              }
            }
            .choose-item{
                margin: 10px 0 10px 15px;
                color: rgba(0,0,0,0.65);
            }
            .question{
                font-size:20px;
                display: inline-block;
                width: 94%;
            }
            .rate-item{
              margin:10px 0 10px 24px;
              .rate-text{
                color: rgba(0,0,0, .65);
                vertical-align: bottom;
                display: inline-block;
                height: 23px;
              }
            }
            .que-item{
              margin-top:14px;
              margin-left: 20px;
              width:98%;
            }
          }
          .qusetions-show>div{
            margin-left: 20px;
          }
          // .qusetions-show:last-child{
          //   border-bottom:none !important;
          // }
          .activeLast{
             border-bottom:none !important;
          }
          .activeBor{
            border: 1px solid #F5222D !important;
            z-index: 9999;
            margin-left: 0 !important;
            padding-left: 15px !important;
          }
        }
       }
     }
  }
  .worflow-submit{
    width:100%;
    position:fixed;
    bottom:0;
    left: 0;
    background:#fff;
    height:60px;
    display:flex;
    justify-content:center;
    align-items:center;
    border-top: 1px solid #eee;
  }
}
.radioInline{
  display: inline-block;
  margin-left: 10px;
}
.radioBlock{
  display: block;
  margin-left: 10px;
}
.question /deep/ .ivu-form-item-label{
  font-weight: 700;
  margin-left: 4px;
  color:#2c3e50;
}
.option-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #212121;
  margin-top: 15px;
  margin-bottom: 5px;
  .option-left {
    width: 192px;
    margin-right: 10px;
  }
}
.input-title {
  width: 192px;
  margin-right: 10px;
}
.input-title1 {
  width: 192px;
}

  .icon-btn {
    width: 32px;
    height: 32px;
    font-size: 20px;
    margin-left: 10px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    line-height: 32px;
    cursor: pointer;
    &:hover {
      color: #3e8ff2;
      background-color: white;
      border-color: #3e8ff2;
    }
  }
  .hoverImage{
    font-size: 16px;
    margin-top: 12px;
    color:#AEAEAE;
    // color: #0877FF;
    cursor: pointer;
  }
  .hoverImage:hover{
    color: #1677FF;
  }
   /deep/ .ivu-form-item-required .ivu-form-item-label:before{
   display: none;
 }
</style>
