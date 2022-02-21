<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary" @click="toUpdateClassCard">将班级信息更新到班牌</Button>
      </div>
    </div>
    <div class="xy-content-body clearfix">
      <!--初始loading-->
      <div v-if="isInitial" class="no-data-box isInitital-opacity" v-cloak>
        <img class="no-data-img" src="@/assets/common/loading.png" />
      </div>
      <!--暂无数据-->
      <div v-if="isEmpty && !isInitial" class="no-data-box" v-cloak>
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text">暂无校区</span>
      </div>
      <!-- 班级列表 -->
      <div v-if="!isEmpty && !isInitial" class="clearfix" v-cloak>
        <h1 class="class-tit" v-cloak>{{ClassTerminalName}}</h1>
        <div class="class-box-edit-content">
          <!-- 班级LOGO -->
          <div class="class-box-edit-box">
            <div class="class-box-edit-box-title">班级LOGO</div>
            <div class="clearfix" style="margin-bottom:20px;">
              <div class="fl" style="margin-right:20px;" v-if="imgUrl !==''">
                <img :src="imgUrl" style="width:145px;height:145px;border-radius:4px;" v-cloak />
              </div>
              <div class="fl"
                style="width:145px;height:145px;box-shadow:0px 2px 8px 0px rgba(12,30,59,0.15);border-radius:4px;"
              >
                <!-- <upload v-cloak
                  ref="uploadImport"
                  v-show="isShowUpload"
                  name="upfile"
                  type="drag"
                  :show-upload-list="false"
                  :format="['jpeg','png','jpg','bmp']"
                  :headers="{'Access-Control-Allow-Origin' : '*','XYTOKEN':xy.getCookie('.XYTOKEN') }"
                  :on-format-error="formatError"
                  :before-upload="BeforeUpload"
                  :on-success="Success"
                  :action="importPath"
                >
                  <div style="padding: 35px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击此处上传Logo</p>
                  </div>
                </upload> -->
                <!-- <XyUpfile
                  ref="upfile"
                  :fileAccept="fileAccept"
                  :fileSize="size"
                  :importPath="upUrl"
                  @UploadOk="UploadOk"
                  :tipIconStyle="{ fontSize: '20px', color: '#6489d4' }"
                  >
                </XyUpfile> -->
                <XyUpfile
                  ref="upfile"
                  :fileAccept="fileAccept"
                  :fileSize="size"
                  :importPath="upUrl"
                  @UploadOk="UploadOk"
                  :upTxt="'点击上传Logo'"
                  >
                </XyUpfile>
              </div>
            </div>
            <div style="color:#939FB7;font-size:12px;margin-bottom:10px">
              注意：为了保证展示效果，建议您上传长宽比例为1：1，大小不超过10M的图片。上传成功后请单击保存按钮。
             </div>
            <Button class="xy-info" @click="UpClick">保存</Button>
          </div>
          <!-- 班级格言 -->
          <div class="class-box-edit-box">
            <div class="class-box-edit-box-title">班级格言</div>
            <div>
              <!-- <div>喊出你们的口号！</div> -->
              <label for="motto" style="line-height:30px">喊出你们的口号！</label>
              <br>
              <div style="margin:20px 0px;">
                <Input clearable
                elementId="motto"
                  v-cloak
                  v-model="motto"
                  size="large"
                  maxlength="40"
                  placeholder="输入班级格言"
                  style="width: 400px;"
                />
              </div>
              <Button class="xy-info" @click="mottoEnsure">保存</Button>
            </div>
          </div>
          <!-- 值日生 -->
          <div class="class-box-edit-box">
            <div class="class-box-edit-box-title">值日生</div>
            <div style="min-height: 200px;max-height: 400px;overflow-y: auto;overflow-x: hidden;">
              <table class="query-table">
                <thead>
                  <tr>
                    <th style="width:70px;"></th>
                    <th style="width:888px;">全天</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-cloak v-for="(week, index) in weekData" :key="index">
                    <td v-cloak>{{week.title}}</td>
                    <td class="pr" style="padding: 4px;text-align:left">
                      <div class="pa cursor-p"
                        title="添加值日生"
                        style="top:50%;left:5px;margin-top: -15px;font-size:20px;color: #6392E9;"
                        @click="modalOpen(week)"
                      >
                        <icon class="add-icon" type="md-add-circle"></icon>
                      </div>
                      <div style="margin-left:25px;">
                        <Tag v-for="(item,index) in week.names"
                          :key="index"
                          type="border"
                          closable
                          color="primary"
                          :name="item.FullName"
                          @on-close="studentDel(week,index)"
                          v-cloak
                        >{{item.FullName}}</Tag>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-20">
              <Button class="xy-info" @click="submitDuty">保存</Button>
            </div>
          </div>
          <!-- 光荣榜(可编辑榜名) -->
          <div class="class-box-edit-box">
            <div class="class-box-edit-box-title">
              {{ honorTitleName }}
              <Icon type="md-create" title="编辑" @click="aHonorTitleClick" class="edit-honor-title" />
            </div>
            <!-- 设置光荣榜 -->
            <ul class="clearfix" style="margin-left:35px;">
              <li v-for="(item, index) in honorList" :key="index" class="fl honor-style" v-cloak>
                <div class="text-center" style="margin: 40px auto 0px;">
                  <span
                    class="honor-title"
                    :title="item.honorTitle"
                    style="max-width:100px;"
                  >{{item.honorTitle}}</span>
                  <Icon
                    type="md-create"
                    title="编辑"
                    @click="aHonorClick(item)"
                    class="edit-honor-title"
                  />
                </div>
                <div class="honor-student nowrap" :title="item.name">{{item.name}}</div>
                <div @click="addStudent(item)" class="honor-set-student">设置学生</div>
                <div @click="addTeacher(item)" class="honor-set-teacher">设置教师</div>
              </li>
            </ul>
            <div class="mt-20">
              <Button class="xy-info" @click="submitHonor">保存</Button>
            </div>
          </div>

          <!-- 倒计时 -->
          <div class="class-box-edit-box">
            <div class="class-box-edit-box-title">倒计时</div>
            <div>
              <label for="countdown" style="line-height:40px">倒计时名称</label>
              <br>
              <Input clearable
                elementId="countdown"
                v-cloak
                v-model="countdown"
                placeholder="倒计时名称"
                maxlength="8"
                style="width:550px;"
              />
              <br>
              <label for="countdownDate" style="line-height:40px">倒计时日期</label>
              <br>
              <DatePicker v-model="countdownDate"
                v-cloak
                elementId="countdownDate"
                type="date"
                :options="isDisabledDate"
                placeholder="选择倒计时日期"
                @on-change="countdownChange"
                style="width:550px;"
                :editable="false"
              ></DatePicker>
              <!--<div v-cloak>{{countdown}}{{dayNumber}}<span v-if="day">天</span></div>-->
              <div class="mt-20">
                <Button @click="countdownClick" class="xy-info">保存</Button>
              </div>
            </div>
          </div>
        </div>

        <!-- 编辑学生榜名字 -->
        <modal v-model="modalHonorPage"
          v-cloak
          :transfer="false"
          title="编辑榜名"
          :loading="loading"
          :mask-closable="false"
          :closable="false"
          @on-ok="honorNameOk"
          ok-text="保存"
          @on-cancel="honorCancel"
        >
          <div class="dialog-model-content">
            <Form ref="formNameValidateOk"
              :model="formNameValidateOk"
              :rules="ruleNameValidateOk"
              @submit.native.prevent
            >
              <FormItem label="编辑名称" prop="aHonorPageName" labelFor="aHonorPageName" :label-width="80">
                <Input v-model="formNameValidateOk.aHonorPageName" elementId="aHonorPageName" clearable />
              </FormItem>
            </Form>
          </div>
        </modal>

        <!-- 编辑学生榜名 -->
        <modal v-model="modalHonor"
          v-cloak
          :transfer="false"
          title="编辑光荣榜名称"
          :loading="loading"
          :mask-closable="false"
          :closable="false"
          @on-ok="honorOk"
          ok-text="保存"
          @on-cancel="honorCancel"
        >
          <div class="dialog-model-content">
            <Form ref="formValidateOk"
              :model="formValidateOk"
              :rules="ruleValidateOk"
              @submit.native.prevent
            >
              <FormItem label="编辑名称" prop="aHonorName" labelFor="aHonorName" :label-width="80">
                <i-input v-model="formValidateOk.aHonorName" elementId="aHonorName" clearable></i-input>
              </FormItem>
            </Form>
          </div>
        </modal>
          <SelectStudent :isShow="isStudentShow"
            :teachers="[...selectedStudents]"
            @select-cancel="selectCancel"
            @select-confirm="selectConfirm"
          ></SelectStudent>

        <!-- <div id="StudentCascader"></div> -->
        <!-- <div v-if="isDutyStudent"> -->
          <SelectStudent :isShow="isDutyStudent"
            :teachers="[...selectedDutyStudents]"
            @select-cancel="selectDutyStudentCancel"
            @select-confirm="selectDutyStudentConfirm"
          ></SelectStudent>

        <!-- </div> -->
        <!-- <div id="Cascader"></div> -->
        <SelectTeacherOrg :isShow="isTeacherShow"
          :teachers="[...selectedTeachers]"
          @select-cancel="selectTeacherCancel"
          @select-confirm="selectTeacherConfirm"
        ></SelectTeacherOrg>
      </div>
    </div>
  </div>
</template>

<script>
  import SelectStudent from '@/components/selectStudent/SelectStudent.vue'
  import SelectTeacherOrg from '@/components/selectTeacherOrg/SelectTeacherOrg.vue'
  import XyUpfile from '@/components/upFileOptimize/upFileDrag.vue'
  export default {
    name: 'ClassBoxEdit',
    components: {
      SelectStudent,
      SelectTeacherOrg,
      XyUpfile
    },
    data () {
      return {
        isStudentShow: false,
        selectedStudents: [],
        apiPath: '',
        isTeacherShow: false,
        isDutyStudent: false,
        selectedTeachers: [],
        selectedDutyStudents: [],
        isDisabledDate: {
          disabledDate: function (date) {
            return date && date.valueOf() < Date.now() - 86400000
          }
        },
        // 默认数据
        classInfoId: '',
        datas: {},
        classId: '',
        isEmpty: false, // 数据是否为空
        isInitial: false,
        loading: true,
        ClassTerminalName: '',
        ClassTerminalID: '',
        // 口号
        motto: '',
        // 值日生
        nowWeek: {},
        weekData: [], // 星期数据
        studentName: '学生姓名',
        // 学生光荣榜
        honorTitleName: '',
        modalHonorPage: false,
        honorItem: {},
        modalHonor: false,
        honorStudentName: '',
        honorTeacherName: '',
        clickObj: {},
        honorList: [
          {
            honorTitle: '综合最优',
            name: '',
            id: '',
            type: 1
          },
          {
            honorTitle: '综合最优',
            name: '',
            id: '',
            type: 2
          },
          {
            honorTitle: '综合最优',
            name: '',
            id: '',
            type: 3
          }
        ],

        // 编辑榜名认证
        formNameValidateOk: {
          aHonorPageName: ''
        },
        ruleNameValidateOk: {
          aHonorPageName: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 6,
              message: '名称不能超过6个字',
              trigger: 'blur'
            }
          ]
        },
        // 编辑光荣榜模型验证
        formValidateOk: {
          aHonorName: ''
        },
        ruleValidateOk: {
          aHonorName: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 4,
              message: '名称不能超过4个字',
              trigger: 'blur'
            }
          ]
        },
        aHonorStudent: '学生姓名',
        // 倒计时
        countdownDate: '',
        dayNumber: '',
        day: false,
        countdown: '',
        // 导入设置
        modalImport: false,
        isShowSpin: false,
        isShowUpload: true,
        uploadSuccess: false, // 上传成功
        uploadFailInfo: '', // 上传失败下载的文件
        uploadTaskError: false, // 上传严重错误,
        // importPath: xy.string.format('{0}/api/ClassInfo/UploadClassLogo', xy.subMenuServiceUrl),
        importPath: `${this.$store.state.apiPath}/api/ClassInfo/UploadClassLogo`,
        importResult: {},
        typeBtn: true,
        imgUrl: '',
        uploadImg: '',
        row: {},
        // 上传资源优化
        fileAccept: 'image/jpg, image/jpeg, image/png, image/bmp',
        size: 10,
        upUrl: this.$store.state.apiPath + '/api/ClassInfo/UploadClassLogo',
        imgList: []
      }
    },
    created: function () {
      this.apiPath = this.$store.state.apiPath
      this.row = this.$store.state.common.menuInfo
      this.weeKData()
    },
    methods: {
      UploadOk (list) {
        // 获取最终生成的需要提交的数据格式
        console.log(list)
        this.uploadImg = list[0].FileName
        this.UpClick()
      },
      selectCancel () {
        this.isStudentShow = false
      },
      selectConfirm (data) {
        this.isStudentShow = false
        this.selectedStudents = [...data]
        this.honorItem.name = this.selectedStudents[0].FullName
        this.honorItem.id = this.selectedStudents[0].UserID
      },
      selectTeacherCancel () {
        this.isTeacherShow = false
      },
      selectDutyStudentCancel () {
        this.isDutyStudent = false
      },
      selectTeacherConfirm (data) {
        this.isTeacherShow = false
        this.selectedTeachers = [...data]
        this.honorItem.name = this.selectedTeachers[0].FullName
        this.honorItem.id = this.selectedTeachers[0].UserID
      },
      selectDutyStudentConfirm (data) {
        this.isDutyStudent = false
        this.selectedDutyStudents = [...data]
        for (let i = 0; i < data.length; i++) {
          this.nowWeek.names.push(data[i])
        }
      },
      // 返回
      ReturnBtn: function () {
        this.$router.back()
      },
      // 获取所有数据
      // GET api/ClassInfo/GetClassInfo/{id}
      GetClassInfo: function () {
        // this.xy.loading()
        let _this = this
        this.xy
          .get(
            `${_this.apiPath}/api/ClassInfo/GetClassInfo?id=${_this.row.ClassTerminalID}`,
            null
          )
          .then(res => {
            _this.isInitial = false
            if (res.success) {
              _this.datas = res.data
              if (res.data) {
                _this.classInfoId = res.data.ClassInfoID
                if (
                  res.data.ClassInfoLogo != null &&
                  res.data.ClassInfoLogo !== ''
                ) {
                  _this.imgUrl = res.data.ClassInfoLogo // 展示的图片
                  _this.uploadImg = res.data.ClassInfoLogo // 保存的图片路径
                }
                _this.motto = res.data.ClassInfoMotto // 班级格言
                _this.countdown = res.data.ClassInfoCountDownTitle // 倒计时名称
                _this.countdownDate =
                  res.data.ClassInfoCountDown == null
                    ? null
                    : _this.xy
                      .moment(res.data.ClassInfoCountDown)
                      .format('YYYY-MM-DD') // 倒计时
                // 值日生
                for (let i = 0; i < _this.weekData.length; i++) {
                  if (res.data.DutyStudent.length > 0) {
                    for (let j = 0; j < res.data.DutyStudent.length; j++) {
                      if (i === res.data.DutyStudent[j].WeekType) {
                        _this.weekData[i].names.push({
                          Checked: true,
                          UserID: res.data.DutyStudent[j].StudentID,
                          FullName: res.data.DutyStudent[j].StudentName
                        })
                      }
                    }
                  }
                }
                // 光荣榜
                // 获取光荣榜名字
                _this.honorTitleName = res.data.HonorTitleName
                for (let k = 0; k < _this.honorList.length; k++) {
                  if (res.data.HonorStudent.length > 0) {
                    for (let y = 0; y < res.data.HonorStudent.length; y++) {
                      if (
                        _this.honorList[k].type === res.data.HonorStudent[y].Type
                      ) {
                        _this.honorList[k].honorTitle =
                          res.data.HonorStudent[y].Title
                        _this.honorList[k].name =
                          res.data.HonorStudent[y].StudentName
                        _this.honorList[k].id =
                          res.data.HonorStudent[y].StudentID
                      }
                    }
                  }
                }
              }
            } else {
              // xy.message.error(_this, { content: res.msg })
              this.xy.msgError(res.msg)
            }
            this.xy.unloading()
          })
      },
      // 班级格言
      mottoEnsure: function () {
        if (this.motto === '') {
          // xy.message.error(this, '请输入班级格言')
          this.xy.msgError('请输入班级格言。')
          return false
        }
        this.xy.loading()
        let that = this
        this.xy
          .post(`${that.apiPath}/api/ClassInfo/EditBaseInfo`, {
            ClassInfoID: that.datas.ClassInfoID,
            ClassInfoMotto: that.motto,
            ClassInfoCountDownTitle: that.countdown,
            ClassInfoCountDown: that.countdownDate === null ? null : that.xy.moment(that.countdownDate).format('YYYY-MM-DD HH:mm:ss')
          })
          .then(res => {
            if (res.success) {
              // xy.message.success(that, '班级格言保存成功')
              this.xy.msgSuc('班级格言保存成功。')
            } else {
              // xy.message.error(that, { content: res.msg })
              this.xy.msgError(res.msg)
            }
            this.xy.unloading()
          })
      },
      // 值日生
      weeKData: function () {
        for (let j = 0; j < 7; j++) {
          this.weekData.push({
            title: this.xy.getChinesesWeekForNumSmall(j),
            val: j,
            names: []
          })
        }
        this.GetClassInfo()
      },
      modalOpen: function (week) {
        this.isDutyStudent = true
        this.nowWeek = week
      // if (this.datas.ClassInfoID !== 0) {
      //   let that = this

      //   xy.http.load(xy.webUrl + '/View/components/View/StudentCascader.html', {
      //     targetID: 'StudentCascader',
      //     loadParams: {
      //       'isShowCascader': true, // 打开modal
      //       'modalTitle': '添加值日生', // modal title
      //       'modalSubmit': that.modalAdd, // 保存,
      //       'urlType': 's', // 班级成员
      //       'isGlobalSearch': true, // 是否全局搜索
      //       'urlPath': xy.string.format('{0}/xy/comm/StudentOrganization', xy.serviceUrl),
      //       'memberUrlPath': xy.string.format('{0}/api/BaseInfo/GetStudentOrganizationMember', xy.subMenuServiceUrl),
      //       'allSearchUrl': xy.string.format('{0}/api/BaseInfo/GetStudentOrganizationMemberSearch', xy.subMenuServiceUrl)
      //     }
      //   })
      // } else {
      //   xy.message.error(this, '系统异常，无法添加值日生')
      // };
      },
      submitDuty: function () {
        let options = {
          ClassInfoID: this.datas.ClassInfoID,
          DutyStudent: []
        }
        for (let i = 0; i < this.weekData.length; i++) {
          if (this.weekData[i].names.length > 0) {
            for (let j = 0; j < this.weekData[i].names.length; j++) {
              options.DutyStudent.push({
                ClassInfoID: this.datas.ClassInfoID,
                Type: 0,
                WeekType: this.weekData[i].val,
                StudentID: this.weekData[i].names[j].UserID
              })
            }
          }
        }
        let that = this
        this.xy.loading()
        this.xy
          .post(`${this.apiPath}/api/ClassInfo/EditDutyInfo`, options)
          .then(res => {
            if (res.success) {
              that.xy.msgSuc('值日生添加成功。')
            // xy.message.success(that, '值日生添加成功')
            } else {
              // xy.message.success(that, '值日生添加失败')
              that.xy.msgError('值日生添加失败。')
            }
            that.xy.unloading()
          })
      },
      // 删除已添加学生
      studentDel: function (week, index) {
        week.names.splice(index, 1)
      },
      // 光荣榜
      aHonorTitleClick: function () {
        this.modalHonorPage = true
        this.formNameValidateOk.aHonorPageName = this.honorTitleName
      },
      aHonorClick: function (item) {
        this.honorItem = item
        this.formValidateOk.aHonorName = item.honorTitle
        this.modalHonor = true
      },

      honorNameOk: function () {
        let _this = this
        this.$refs.formNameValidateOk.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.modalHonorPage = false
            _this.honorTitleName = _this.formNameValidateOk.aHonorPageName
            _this.changeLoading()
          }
        })
      },

      honorOk: function () {
        let _this = this
        this.$refs.formValidateOk.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.modalHonor = false
            _this.honorItem.honorTitle = _this.formValidateOk.aHonorName
            _this.changeLoading()
          }
        })
      },
      honorCancel: function () {
        this.modalHonor = false
        this.formValidateOk.aHonorName = ''
      },
      changeLoading: function () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      // 光荣榜添加学生
      addStudent: function (item) {
        this.honorItem = item
        if (this.datas.ClassInfoID !== 0) {
          this.isStudentShow = true
        } else {
          // xy.message.error(this, '系统异常，无法设置学生')
          this.xy.msgError('系统异常，无法设置学生。')
        }
      },

      // 光荣榜添加老师
      addTeacher: function (item) {
        this.clickObj.type = 'teacher'
        this.clickObj.id = item.id
        this.honorItem = item
        let that = this
        this.addTeacherList = []
        this.honorList.forEach(function (item) {
          that.addTeacherList.push(item.id)
        })
        this.isTeacherShow = true
      },
      addModalStudent: function () {
      // if (StudentCascader.checkAllList.length == 1) {
      //   this.honorItem.name = StudentCascader.checkAllList[0].Name
      //   this.honorItem.id = StudentCascader.checkAllList[0].ID
      //   StudentCascader.isShowCascader = false
      //   StudentCascader.newList = []// 左侧滞空
      //   StudentCascader.transferData = []// 中间滞空
      //   StudentCascader.checkAllGroup = []// 多选框滞空
      //   StudentCascader.checkAllList = []// 右侧滞空
      //   StudentCascader.casaderIsAll = false
      //   StudentCascader.modalSearchName = ''
      // } else {
      //   xy.message.error(this, '请选择一位要添加到榜内的学生')
      // };
      // StudentCascader.changeLoading()
      },

      addModalTeacher: function () {
      // if (ModalCascade.checkAllList.length == 1) {
      //   if (this.clickObj.type === 'teacher') {
      //     for (let i = 0; i < ModalCascade.checkAllList.length; i++) {
      //       this.honorItem.name = ModalCascade.checkAllList[0].Name
      //       this.honorItem.id = ModalCascade.checkAllList[0].ID
      //       ModalCascade.isShowCascader = false
      //       ModalCascade.newList = []// 左侧滞空
      //       ModalCascade.transferData = []// 中间滞空
      //       ModalCascade.checkAllGroup = []// 多选框滞空
      //       ModalCascade.checkAllList = []// 右侧滞空
      //       ModalCascade.casaderIsAll = false
      //       ModalCascade.modalSearchName = ''
      //     }
      //   }
      //   this.clickObj = {}
      //   // console.log(this.honorItem.name,1111111)
      // } else {
      //   xy.message.error(this, '请选择一位要添加到榜内的老师')
      // };
      // ModalCascade.changeLoading()
      },

      submitHonor: function () {
        // {0}/api/ClassInfo/EditHonorTitleName?HonorTitleName={HonorTitleName}&ClassInfoID={ClassInfoID}
        let params = ''
        this.xy
          .post(
            this.apiPath +
              `/api/ClassInfo/EditHonorTitleName?HonorTitleName=` +
              this.honorTitleName +
              '&ClassInfoID=' +
              this.classInfoId,
            params
          )
          .then(res => {
            if (res.success) {
              // xy.message.success(that, '设置成功')
              this.xy.msgSuc('设置成功。')
            } else {
              // xy.message.error(that, { content: res.msg })
              this.xy.msgError(res.msg)
            }
            this.xy.unloading()
          })
        let options = {
          ClassInfoID: this.datas.ClassInfoID,
          HonorStudent: []
        }
        for (let i = 0; i < this.honorList.length; i++) {
          if (this.honorList[i].id !== '') {
            options.HonorStudent.push({
              ClassInfoID: this.datas.ClassInfoID,
              Type: this.honorList[i].type,
              StudentID: this.honorList[i].id,
              Title: this.honorList[i].honorTitle,
              StudentName: this.honorList[i].name
            })
          }
        }
        let that = this
        this.xy.loading()
        this.xy
          .post(`${this.apiPath}/api/ClassInfo/EditHonorInfo`, options)
          .then(res => {
            if (!res.success) {
              // xy.message.error(that, { content: res.msg })
              that.xy.msgError(res.msg)
            } else {
            }
            that.xy.unloading()
          })
      },
      // 倒计时
      countdownChange: function (val) {
        this.countdownDate = val // 日期
        let _this = this
        // let toDay = new Date(xy.date.format(new Date(), 'yyyy-MM-dd'))
        let toDay = this.xy.moment(new Date()).format('yyyy-MM-dd')
        let selectDay = new Date(val)
        let dayNumber = (selectDay - toDay) / (1000 * 60 * 60 * 24)
        _this.dayNumber = dayNumber
        if (isNaN(_this.dayNumber)) {
          _this.dayNumber = ''
          _this.day = false
        } else if (_this.dayNumber !== '' || _this.dayNumber === 0) {
          _this.day = true
        } else {
          _this.day = false
        }
      },
      countdownClick: function () {
        if (this.countdown === '') {
          // xy.message.error(this, '请输入倒计时名称')
          this.xy.msgError('请输入倒计时名称。')
          return false
        }
        if (this.countdownDate === '') {
          this.xy.msgError('请输入倒计时名称。')
          return false
        }
        this.xy.loading()
        let that = this
        this.xy
          .post(`${this.apiPath}/api/ClassInfo/EditBaseInfo`, {
            ClassInfoID: that.datas.ClassInfoID,
            ClassInfoMotto: that.motto,
            ClassInfoCountDownTitle: that.countdown,
            ClassInfoCountDown: that.countdownDate
          })
          .then(res => {
            if (res.success) {
              // xy.message.success(that, '倒计时保存成功')
              this.xy.msgSuc('倒计时保存成功。')
            } else {
              // xy.message.error(that, { content: res.msg })
              this.xy.msgError(res.msg)
            }
            this.xy.unloading()
          })
      },
      //= ======导入 start===
      // 上传图片
      UpClick: function () {
        if (this.uploadImg === '') {
          // xy.message.error(this, '请先上传图片')
          this.xy.msgError('请先上传图片。')
          return false
        }
        let that = this
        this.xy
          .post(`${that.apiPath}/api/ClassInfo/EditLogoInfo`, {
            ClassInfoID: that.datas.ClassInfoID,
            FileName: that.uploadImg
          })
          .then(res => {
            if (res.success) {
              this.imgUrl = res.data.result
              // xy.message.success(that, '保存班级Logo成功！')
              this.xy.msgSuc('保存班级Logo成功。')
            } else {
              // xy.message.error(that, res.msg)
              that.xy.msgError(res.msg)
            }
          })
      // this.$refs.uploadImport.clearFiles();
      },
      DownloadTemplate: function () {
        this.xy.downFile(
          `${this.apiPath}/api/ClassInfo/MovingClassAssignClassSetting/DownloadTemplateImport`
        )
      },
      DownloadErrorInfo: function (type) {
        // 下载错误信息
        this.xy.downFile(
          this.apiPath +
            `/api/ClassInfo/MovingClassAssignClassSetting/DownloadExceptionImport?file=` +
            this.importResult.efile
        )
      // this.xy.downFile(xy.string.format('{0}/api/MovingClassAssignClassSetting/DownloadExceptionImport?file=' + this.importResult.efile, xy.subMenuServiceUrl))
      },
      modalChange: function (status) {
        if (status) {
          this.isShowUpload = true
          this.uploadSuccess = false
        }
      },
      // 本来就不要的
      BeforeUpload: function () {
      // return new Promise(function (resolve, reject) {
      //    this.xy.loading();
      //    resolve(true);
      // }).then(function (res) {
      //    if (res) {
      //        this.xy.unloading();
      //    };
      // }).catch(function (reason) {
      //    this.xy.unloading();
      // });
      },
      formatError: function (file, fileList) {
        this.isShowSpin = false
        // xy.message.error(this, '文件格式不正确！')
        this.xy.msgError('文件格式不正确。')
      },
      Success: function (res) {
        let _this = this
        this.isShowSpin = false
        if (res.success) {
          // xy.message.success(this, '成功！')
          this.xy.msgSuc('上传成功。')
          this.uploadImg = res.data.result // 获取的图片路径
          // this.imgUrl = xy.webUrl + res.result
          this.imgUrl = this.$store.state.apiPath + res.data.result
        } else if (res.errorcode === 'rowError') {
        } else if (res.errorcode === 'fileError') {
          _this.xy.msgError(res.msg)
        } else if (
          res.errorcode === 'taskError' ||
          res.errorcode === 'mscorlib' ||
          typeof res === 'string'
        ) {
        // 导入异常了
        } else {
          // xy.message.error(this, '失败！')
          this.xy.msgError('失败。')
        }
        this.xy.unloading()
        _this.importResult = res
      },
      // Error: function (error, file, fileList) {
      //   xy.message.error(this, 'Error！')
      // },
      //= ======导入 end===
      toUpdateClassCard: function () {
        let that = this
        this.xy
          .get(`${that.apiPath}/api/ClassInfo/PublishClassInfo`, {
            id: that.datas.ClassInfoID
          })
          .then(res => {
            if (res.success) {
              this.xy.msgSuc('更新到班牌成功。')
              this.getAllScreenSaverImage(false)
            } else {
              this.xy.msgError('更新到班牌失败。')
            }
          })
      }
    }
  }
</script>
<style lang="less" scoped>
.class-tit {
  font-size: 24px;
  margin-bottom: 10px;
}
.class-box-edit-content {
  width: 1000px;
  margin: 0 auto;
}
.class-box-edit-content .class-box-edit-box {
  margin-bottom: 30px;
  box-shadow: 0px 3px 15px 0px rgba(131, 131, 131, 0.26);
  border-radius: 4px;
  padding: 20px;
}

.class-box-edit-content .class-box-edit-box .class-box-edit-box-title {
  font-size: 22px;
  color: #444;
  font-weight: 700;
  margin-bottom: 20px;
}
.honor-style {
  width: 220px;
  height: 200px;
  box-shadow: 0px 7px 13px 0px rgba(96, 96, 96, 0.26);
  border-radius: 4px;
  margin-right: 70px;
  text-align: center;
}
/* 班级LOGO */
/* 班级格言 */
/* 值日生 */
.query-table {
  height: 100%;
  border-spacing: 0;
  text-align: center;
}

.horizontal-version tr:first-child th {
  background: #6392e9;
  color: #ffffff;
  font-weight: 700;
}

.query-table thead tr th {
  background: #eceef1;
  border-right: 1px solid #fff;
  color: #91a0b4;
  padding: 10px 18px;
}

.query-table tbody {
  border: 1px solid #eee;
}
.query-table tbody tr > td {
  height: 50px;
}
.query-table tbody tr td:nth-child(1) {
  border-right: 1px solid #eee;
}

.query-table tbody tr td:last-child {
  border-right: 1px solid #eee;
}
.query-table tbody tr > td > .td-min > .add-icon {
  font-size: 28px;
  cursor: pointer;
  background: #ccc;
  transition: all 0.3s;
}
.query-table tbody tr > td > .td-min > .add-icon:hover {
  transition: all 0.3s;
  background: #eee;
}

.query-table td,
.query-table th {
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  /*border: 1px solid #eee;*/
}

.query-table thead tr th:nth-child(1) {
  border-top-left-radius: 6px;
}

.query-table thead tr th:last-child {
  border-top-right-radius: 6px;
  border-right: 0px;
}
/* 光荣榜 */
.edit-honor-title {
  color: #fff;
  background: #6392e9;
  font-size: 12px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  margin-bottom: 4px;
}
.honor-title {
  font-size: 18px;
  margin-right: 10px;
}
.honor-set-student {
  margin: 0 auto;
  width: 89px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #6392e9;
  color: #fff;
  transition: all 0.3s;
  cursor: pointer;
  border-radius: 18px;
}
.honor-set-student:hover {
  transition: all 0.3s;
  background: #4c9ced;
}
.honor-set-teacher {
  margin-top: 3px;
  margin-left: 65px;
  width: 89px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #6392e9;
  color: #fff;
  transition: all 0.3s;
  cursor: pointer;
  border-radius: 18px;
}
.honor-set-teacher:hover {
  transition: all 0.3s;
  background: #4c9ced;
}
.honor-student {
  padding: 0px 20px;
  font-size: 16px;
  font-weight: 700;
  height: 54px;
  line-height: 54px;
}

/* 倒计时 */
</style>
