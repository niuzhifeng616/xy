<template>
  <!-- 4.开班计划 -->
  <div class="xy-content-body">
    <div style="padding-bottom:5px;">
      <Button class="xy-primary"
              @click="ImportClick"
              :disabled="isOperation !== 0">导入设置</Button>
      <Button class="xy-info"
              @click="automaticallySet"
              :disabled="isOperation !== 0">自动设班</Button>
      <Dropdown @on-click="dropdownClick"
                trigger="click"
                v-if="startClassData.length>0">
        <Button class="xy-info">
          更多
          <icon type="ios-arrow-down"></icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem :name="0" :disabled="isOperation !== 0">集中设置课时</DropdownItem>
          <DropdownItem :name="1" :disabled="isOperation !== 0">集中设置教师</DropdownItem>
          <!--<DropdownItem :name="2">统一修改班额</DropdownItem>-->
          <DropdownItem :name="3">查看开班设置</DropdownItem>
          <!--<DropdownItem :name="4">导出开班设置</DropdownItem>-->
          <DropdownItem :name="5" :disabled="isOperation !== 0">清除全部设置</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="xy-content-table crouseSetting"
          style="overflow-y:auto; margin-bottom: 35px;">
      <!-- ------------------------------ -->
      <div class="go-class-set-box set-box"
            v-for="(startClass,index) in startClassData"
            :key="index">
        <!-- 顶部信息 -->
        <div class="set-header">
          <row>
            <i-col span="12">
              <span><b class="col0-85 f16">{{startClass.SubjectName}} - {{startClass.SelectCount}}人</b></span>
              <select class="span-style"
                      v-model="startClass.Lesson">
                <option v-for="item in sectionList"
                        :value="item.value"
                        :key="item.value">{{item.name}}</option>
              </select>
            </i-col>
            <i-col span="12"
                    class="text-right">
              <a v-if="isOperation === 0"
                  class="header-btn mr-20"
                  @click="addClassModal(index, startClass.Class)"><i class="iconfont" style="margin-right:5px;">&#xe69f;</i>添加班级</a>
              <a v-if="isOperation === 0"
                  class="header-btn"
                  @click="setClassNumModal(index)"><i class="iconfont" style="margin-right:5px;">&#xe6c9;</i>统一设置班额</a>
            </i-col>
          </row>
        </div>
        <!-- table -->
        <table class="go-class-set">
          <thead>
            <tr>
              <th>班级名称</th>
              <th>最大班额</th>
              <th>教师</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(classOne,classIndex) in startClass.Class"
                :key="classIndex">
              <td>
                <Input style="width:260px;"
                          maxlength="20"
                          placeholder="请输入班级名称"
                          v-model="classOne.ClassName"
                          @on-blur="classNameChange(index,classIndex)" />
              </td>
              <td>
                <InputNumber :max="999"
                              :min="1"
                              placeholder="请输入最大班额"
                              style="width:260px;"
                              v-model="classOne.StudentLimitation"
                              @on-blur="classNumChange(index,classIndex)" />
              </td>
              <td>
                <div class="block-nature">
                  <!-- 教师 -->
                  <span class="teacher-name"
                        style="width:260px;"
                        :title="classOne.TeacherNames.replace(/^(\s|,)+|(\s|,)+$/g,'')"
                        @click="openAddTeacherModal(index,classIndex)">
                    <span v-for="teacher in classOne.teacherInfos"
                          :key="teacher.name">
                      {{classOne.teacherInfos.length > 0 ? teacher.name : ''}}
                    </span>
                    <span v-if="classOne.teacherInfos.length===0"
                          style="color:#999">设置教师</span>
                  </span>
                </div>
              </td>
              <td>
                <a href="javascript:;"
                    @click="delClass(index,classIndex,startClass)"
                    :disabled="isOperation !== 0">删除</a>
              </td>
            </tr>
        </tbody>
        </table>

        <!-- <div class="set-body">
          <div class="go-body-block"
                v-for="(classOne,classIndex) in startClass.Class"
                :key="classIndex">
            <div class="clearfix">
              <div class="fl block-nature">
                <span>班名</span>
                <i-input style="width:160px;"
                         maxlength="20"
                         v-model="classOne.ClassName"
                         @on-blur="classNameChange(index,classIndex)" />
              </div>
              <div class="fl block-nature">
                <span>最大班额</span>
                <input-number :max="999"
                              :min="1"
                              style="width:160px;"
                              v-model="classOne.StudentLimitation"
                              @on-blur="classNumChange(index,classIndex)"></input-number>
              </div>
              <div class="fl pr block-nature">
                <span>教师</span>
                <span class="teacher-name"
                      :title="classOne.TeacherNames.replace(/^(\s|,)+|(\s|,)+$/g,'')"
                      @click="collapseMustShow(startClass,classOne)">
                  <span v-for="teacher in classOne.teacherInfos"
                        :key="teacher.name">
                    {{classOne.teacherInfos.length > 0 ? teacher.name : ''}}
                  </span>
                  <span v-if="classOne.teacherInfos.length===0"
                        style="color:#999">未设置教师</span>
                </span>
                <collapse class="course-setting-collapse pa"
                          value="1"
                          v-if="classOne.collapse && (isOperation === 0)">
                  <panel name="1">
                    已添加的教师
                    <div slot="content"
                         style="line-height:22px;">
                      <tag v-for="(teacherTag,tagI) in classOne.teacherInfos"
                           :key="teacherTag.name "
                           closable
                           @on-close="delTeacher(classOne,tagI)">{{classOne.teacherInfos.length > 0 ? teacherTag.name : ''}}</tag>
                      <span v-if="classOne.teacherInfos.length === 0"
                            style="color:#999">请先添加教师</span>
                    </div>
                  </panel>
                </collapse>
                <Button size="small"
                        class="add-teacher-btn xy-info"
                        style="margin-top:0"
                        @click="openAddTeacherModal(index,classIndex)"
                        v-if="isOperation === 0">设置教师</Button>
              </div>
              <div class="fr block-nature">
                <Icon type="md-close-circle"
                      size="26"
                      class="del-icon"
                      style="line-height:60px;"
                      @click="delClass(index,classIndex,startClass)"
                      v-if="isOperation === 0" />
              </div>

            </div>
          </div>
          <div style="margin:14px 32px;">
            <span @click="addClassModal(index, startClass.Class)"
                  v-if="isOperation === 0"
                  class="add-btn">
              <span style="font-size:18px;">+</span>添加班级
            </span>
          </div>
        </div> -->
      </div>
      <!-- ------------ -->
    </div>
    <div class="fix-footer text-center"
         v-if="startClassData.length>0">
      <Button class="xy-btn-primary"
              shape="circle"
              style="margin-right:0"
              :disabled="isOperation !== 0"
              @click="startClassSubmit">保存</Button>
    </div>

    <!-- 导入设置 -->
    <!-- <div id="ModalImportFile"></div> -->

    <!-- 统一设置班额 -->
    <modal v-model="modalSetClassNum"
           title="统一设班额"
           v-if="isOperation === 0"
           :transfer="false"
           :loading="loading"
           @on-ok="setClassSubmit"
           :mask-closable="false">
      <div style="font-size:14px;text-align:center">
        <input-number v-model="classNumber"
                      placeholder="请输入班额"
                      style="width:100%;"></input-number>
      </div>
    </modal>

    <!-- 添加班级 -->
    <modal v-model="modalAddClass"
           :transfer="false"
           :mask-closable="false">
      <p slot="header">添加班级</p>
      <div style="font-size:14px;max-height:300px;overflow-y:scroll;">
        <h1 style="padding-bottom:10px;">请输完一个班级名称后按回车键, 再输入另一个班级名称，依此类推。</h1>
        <vue-tags-input v-model="tag"
                        :tags="tags"
                        placeholder="请输入班级名称，按回车键确认"
                        @tags-changed="newTags" />
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="addClassCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="addClassSubmit">保存</Button>
      </div>
    </modal>

    <!-- 添加班级 当前无班级 -->
    <modal v-model="creatClassNum"
           title="添加班级"
           :mask-closable="false"
           :closable="true"
           :transfer="false">
      <div class="dialog-model-content">
        <i-form ref="formOrgCount"
                :model="formOrgCount"
                :rules="orgCountValidate"
                label-position="top"
                @submit.native.prevent>
          <form-item label="添加班级数量"
                     prop="orgCount"
                     label-for="orgCount">
            <i-input placeholder="输入班级数量"
                     v-model="formOrgCount.orgCount"
                     element-id="orgCount" />
          </form-item>
        </i-form>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="classNumCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="classNumSubmit">保存</Button>
      </div>
    </modal>

    <!--添加教师 -->
    <!-- <select-teacher-org
        :isShow="isShowSelectTeacher"
        :teachers="[...selectedTeachers]"
        @select-cancel="selectTeacherCancel"
        @select-confirm="selectTeacherConfirm">
      </select-teacher-org> -->
    <SelectTeacherOrg :isShow="isShow"
                      :selectMembers="[...selectedTeacherIDS]"
                      @select-cancel="selectCancel"
                      @select-confirm="selectConfirm">
    </SelectTeacherOrg>

    <!--自动设班 -->
    <modal v-model="modalAutomaticallySet"
           :transfer="false"
           v-if="isOperation === 0"
           :mask-closable="false">
      <p slot="header">自动设班</p>
      <alert closable>注意：自动设班将清除原设置的班级及排课规则和排课结果。</alert>
      <div>
        <i-input v-model="automaticallyNum"
                 placeholder="请输入最大班额"></i-input>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="modalAutomaticallySet = false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="startSet">开始设班</Button>
      </div>
    </modal>

    <!-- 集中设置课时 -->
    <modal v-model="modalUnifiedSetSection"
           v-if="isOperation === 0"
           width="864"
           :transfer="false"
           @on-cancel='cancleUnifiedSetSection'
           :mask-closable="false">
      <p slot="header">集中设置课时</p>
      <div style="font-size:14px;height:500px;overflow-y:auto">
        <row>
          <i-col span="12">
            <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
              <checkbox-group v-model="unifiedSetSubject">
                <checkbox :label="item.SubjectName"
                          :key="i"
                          v-for="(item, i) in sectionSubject"
                          style="display:block;margin:7px 5px;"
                          :title="item.LessonName?`${item.SubjectName}→${item.LessonName}`:item.SubjectName">
                  <span class="f14" style="margin-left:4px">{{ item.SubjectName.length>18?item.SubjectName.substr(0,18)+'...':item.SubjectName }}</span>
                  <img v-if='item.LessonName'
                       src="@/assets/csmsTimeTable/exchange.png"
                       alt=""
                       class="exchange">
                  <span v-if='item.LessonName'>{{item.LessonName}}</span>
                </checkbox>
              </checkbox-group>
            </div>
          </i-col>
          <i-col span="12"
                 style="padding-left:20px;">
            <setCourseTime ref='setCrouseTime'
                           :isGetCourseList='isGetTree'
                           :initSectionData='initTeacherTree'></setCourseTime>
          </i-col>
        </row>
      </div>
      <div slot="footer">
        <Checkbox v-model="isGOonSetCrouseTime"
                  class="fl"
                  style="line-height: 36px;">继续设置下一项</Checkbox>
        <Button class="xy-modal-close"
                @click="cancleUnifiedSetSection">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitUnifiedSetSection">保存</Button>
      </div>
    </modal>

    <!-- 集中设置教师 -->
    <modal v-model="modalUnifiedSetTeacher"
           :mask-closable="false"
           width="864"
           v-if="isOperation === 0"
           :transfer="false">
      <p slot="header">集中设置教师</p>
      <div style="font-size:14px;height:500px;overflow:hidden">
        <row>
          <i-col span="12">
            <SetSubjectOrg :isGetTree='isGetTree'
                           ref='SetSubjectOrg'
                           :selectTeacherFullName='selectTeacherFullName'
                           :selectTeacherIDs='selectTeacherIDs'
                           :initTeacherTree='initTeacherTree'
                           :UserNames='UserNames'
                           :classTableID='classTableID'></SetSubjectOrg>
          </i-col>
          <i-col span="12"
                 style="padding-left:20px;">
            <SetTeacherOrg :isGetTree='isGetTree'
                           ref='SetTeacherOrg'
                           :initTeacherTree='initTeacherTree'
                           :classTableID='classTableID'></SetTeacherOrg>
            <!-- <Button class="xy-danger" @click="delBatchTeacher" style="margin-bottom:10px;">批量删除教师</Button>-->
          </i-col>
        </row>
      </div>
      <div slot="footer">
        <Checkbox v-model="isGOonSetTeacher"
                  class="fl"
                  style="line-height: 36px;">继续设置下一项</Checkbox>
        <Button class="xy-modal-close"
                @click="cancleUnifiedSetTeacher">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitUnifiedSetTeacher">保存</Button>
      </div>
    </modal>

    <!--清除全部设置 -->
    <modal v-model="modalClear"
           :transfer="false"
           v-if="isOperation === 0"
           :mask-closable="false">
      <p slot="header">清除全部设置</p>
      <p style="margin-bottom:5px;font-size:14px;">请输入“<span style="color:#ed4014">清除</span>”来确认清除全部设置。</p>
      <div>
        <i-input v-model="clearText"
                 placeholder="请输入“清除”进行确认"></i-input>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="modalClear = false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="clearSubmit">确定</Button>
      </div>
    </modal>

    <XyUpfile ref="upfile"
              :modalTitle="upload.title"
              :describeData="upload.tipData"
              :fileFormt="upload.formtData"
              :fileSize="upload.size"
              :importPath="upload.upUrl"
              :paramsData="upload.upParams"
              :templateUrl="upload.templateUrl"
              :errorUrl="upload.errorUrl"
              @successLoad="modalSubmit">
    </XyUpfile>
  </div>
</template>
<script>
  import setCourseTime from '@/pages/csmsTimeTable/components/allSetCourseTime/CourseTime.vue'
  // 引入上传模版
  import XyUpfile from '@/components/upFile/XyUpfile'
  import VueTagsInput from '@johmun/vue-tags-input'
  import SelectTeacherOrg from '@/pages/csmsTimeTable/components/selectTeacher/CheckboxSelectTeacher.vue'
  import SetTeacherOrg from '@/pages/csmsTimeTable/components/allSetTeacher/SetTeacherOrg.vue' // 集中设置教师tree
  import SetSubjectOrg from '@/pages/csmsTimeTable/components/allSetTeacher/SetSubjectOrg.vue' // 集中设置教师,学科tree
  export default {
    name: 'StartClassSet',
    components: {
      VueTagsInput,
      SelectTeacherOrg,
      XyUpfile,
      SetTeacherOrg,
      setCourseTime,
      SetSubjectOrg
    },
    data () {
      return {
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: parseInt(this.$store.state.csmstimetable.classComValKW.new.classTableID),

        loading: true,
        treeEmptyText: '正在加载中...',
        treeEmptyText1: '正在加载中...',
        // 选择教师
        isShow: false,
        selectedTeachers: [],
        selectedTeacherIDS: [],
        upload: {
          title: '上传demo',
          tipData: [],
          formtData: ['txt'],
          size: 1024,
          upUrl: '//jsonplaceholder.typicode.com/posts/',
          upParams: {},
          templateUrl: '',
          errorUrl: ''
        },
        // 添加班级
        importPath: `${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/Import?classTableID=${this.classTableID}`,
        tag: '',
        tags: [],

        startClassData: [],
        sectionList: this.sectionLists(),
        modalSetClassNum: false,
        classNumber: 1,
        modalAddClass: false,
        creatClassName: [],
        tag1: '',
        tag2: '',
        isUnified: false,
        // 自动设班
        modalAutomaticallySet: false,
        automaticallyNum: '',
        // 集中设置课时
        modalUnifiedSetSection: false,
        sectionSubject: [],
        unifiedSetSubject: [],
        unifiedSetSection: {},
        isGOonSetCrouseTime: false,
        // 集中设置教师
        modalUnifiedSetTeacher: false,
        teacherTree: [],
        classTree: [],
        selectTeacherTree: [],
        selectClassTree: [],
        teacherSpin: false,
        isGOonSetTeacher: false,
        // 组件需要的参数
        isGetTree: false,
        initTeacherTree: false,
        selectTeacherFullName: [],
        selectTeacherIDs: [],
        UserNames: [],
        // 清除全部设置
        modalClear: false,
        clearText: '',
        // 输入数字添加班级
        creatClassNum: false,
        orgCountValidate: {
          orgCount: [
            { required: true, message: '请输入创建班级数量，限1-100之间的整数', trigger: 'blur' },
            { pattern: /^([1-9][0-9]{0,1}|100)$/, message: '请输入1-100的正整数', trigger: 'blur' }
          ]
        },
        formOrgCount: {
          orgCount: ''
        }
      }
    },
    watch: {
      modalUnifiedSetTeacher (val) { // 集中设置教师
        this.initTeacherTree = false
        this.isGetTree = val
      },
      modalUnifiedSetSection (val) { // 集中设置课时
        this.initTeacherTree = false
        this.isGetTree = val
      }
    },
    created () {
    // 导入设置
    // this.importPath = xy.string.format('{0}/api/MovingClassAssignClassSetting/Import?classTableID={1}', xy.subMenuServiceUrl, this.classTableID)
    },
    mounted () {
      this.getTP()
    },
    methods: {
      sectionLists () {
        var section = []
        for (var i = 1; i < 13; i++) {
          section.push({
            value: i,
            isSelect: false,
            name: i + '课时'
          })
        }
        return section
      },
      // 添加班级
      newTags (newTags) {
        this.tags = newTags
      },
      // 获取数据
      async getTP () {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/GetAssignClassList`, params)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          for (let i = 0; i < resData.length; i++) {
            if (resData[i].Lesson === 0) {
              if (resData[i].SubjectType === 0) {
                resData[i].Lesson = 5
              } else if (resData[i].SubjectType === 1) {
                resData[i].Lesson = 2
              } else if (resData[i].SubjectType === 2) {
                resData[i].Lesson = 5
              }
            }
            for (let j = 0; j < resData[i].Class.length; j++) {
              resData[i].Class[j].teacherInfos = []
              resData[i].Class[j].collapse = false
              if (resData[i].Class[j].TeacherIDs.length > 0) {
                let tName = resData[i].Class[j].TeacherNames.split(',')
                for (let k = 0; k < tName.length; k++) {
                  resData[i].Class[j].teacherInfos.push({
                    id: resData[i].Class[j].TeacherIDs[k],
                    name: tName[k]
                  })
                }
              }
            }
          }
          this.startClassData = res.data
          this.$nextTick(() => {
            $('.crouseSetting').height(document.body.clientHeight - 300)
          })
        }
      },
      // 是否显示老师列表
      // collapseMustShow (startClass, classOne) {
      //   if (classOne.collapse) {
      //     classOne.collapse = false
      //   } else {
      //     if (classOne.teacherInfos.length > 0) {
      //       for (let j = 0; j < startClass.Class.length; j++) {
      //         if (startClass.Class[j].ClassID !== classOne.ClassID) {
      //           startClass.Class[j].collapse = false
      //         }
      //       };
      //       classOne.collapse = !classOne.collapse
      //     }
      //   }
      // },
      // 删除老师
      // delTeacher (classOne, tagI) {
      //   classOne.teacherInfos.splice(tagI, 1)
      //   let names = ''
      //   classOne.TeacherIDs = []
      //   for (let i = 0; i < classOne.teacherInfos.length; i++) {
      //     classOne.TeacherIDs.push(classOne.teacherInfos[i].id)
      //     names = names + classOne.teacherInfos[i].name + ','
      //   }
      //   classOne.TeacherNames = this.trim(names, ',')
      // },
      //= =======导入 start===
      // 导入选课
      ImportClick () {
        if (this.isOperation === 0) {
          this.$refs['upfile'].modalImport = true
          this.upload = {
            title: '导入设置', // 标题
            ipData: [], // 提示语句
            formtData: ['xlsx', 'xls'], // 支持的文件类型
            size: 1024, // 文件大小限制，单位 kb
            upUrl: `${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/Import?classTableID=${this.classTableID}`, // 上传文件url
            upParams: {}, // 上传参数
            templateUrl: `${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/DownloadTemplateImport`, // 模板下载url
            errorUrl: `${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/DownloadExceptionImport` // 下载错误文件url
          }
        }
      },
      modalSubmit () {
        this.getTP()
        this.$parent.getGeneralFlows()
      },
      //= =======导入 end===
      // 自动设班
      automaticallySet () {
        if (this.isOperation === 0) {
          this.modalAutomaticallySet = true
        }
      },
      startSet () {
        let that = this
        let reg = /^[1-9][0-9]{0,2}$/
        if (reg.test(that.automaticallyNum)) {
          let arr = []
          for (let i = 0; i < that.startClassData.length; i++) {
            if (that.startClassData[i].ParentType === 'CL') {
              arr.push({
                AID: that.startClassData[i].ParentID,
                Type: that.startClassData[i].ParentType,
                Lesson: that.startClassData[i].Lesson,
                CoursePlanID: that.startClassData[i].CoursePlanID
              })
            } else if (that.startClassData[i].ParentType === 'CP') {
              arr.push({
                AID: that.startClassData[i].CoursePlanID,
                Type: that.startClassData[i].ParentType,
                Lesson: that.startClassData[i].Lesson,
                CoursePlanID: that.startClassData[i].CoursePlanID
              })
            }
          }
          that.$Modal.confirm({
            title: '温馨提示',
            content: '自动设班将清除原设置的班级及排课规则和排课结果，您确定要开始设班吗？',
            async onOk () {
              let params = {
                ClassTableID: that.classTableID,
                StudentLimitation: that.automaticallyNum * 1,
                Models: arr
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassAssignClassSetting/AssignClassAuto`, params)
              if (res.success) {
                that.xy.msgSuc('自动设置成功。')
                that.modalAutomaticallySet = false
                that.getTP()
              }
            }
          })
        } else {
          that.xy.msgError('班额只能输入1-999的正整数。')
        }
      },
      // 更多
      dropdownClick (val) {
        if (val === 0) { // 集中设置课时
          if (this.isOperation === 0) {
            this.getAssignClassListForEditLesson()
            this.isGOonSetCrouseTime = false
            this.modalUnifiedSetSection = true
          }
        };
        if (val === 1) { // 集中设置教师
          if (this.isOperation === 0) {
            this.selectClassTree = []
            this.selectTeacherTree = []
            // this.getSettingTeacher()
            // this.getAssignClassListForEditTeacher()
            this.isGOonSetTeacher = false
            this.modalUnifiedSetTeacher = true
          }
        };
        if (val === 2) { // 统一修改班额
          this.isUnified = true
          this.modalSetClassNum = true
        };
        if (val === 3) { // 查看班级设置
          this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 3 })
          this.$router.push({
            path: '/xyhome/goClassStepsHeader/lookSet',
            query: this.$store.state.common.menuInfo
          })
          this.$parent.tabValue = this.$parent.liData[3].url
        };
        if (val === 4) { // 导出开班设置

        };
        if (val === 5) { // 清除全部设置
          if (this.isOperation === 0) {
            this.modalClear = true
            this.clearText = ''
          }
        };
      },
      // 统一设置(修改)班额
      setClassNumModal (index) {
        this.classNumber = 1
        this.tag1 = ''
        this.tag1 = index
        this.modalSetClassNum = true
      },
      setClassSubmit () {
        let reg = /^[1-9][0-9]{0,2}$/
        this.loading = true
        if (reg.test(this.classNumber)) {
          if (this.isUnified) { // 统一修改班额
            for (let i = 0; i < this.startClassData.length; i++) {
              for (let j = 0; j < this.startClassData[i].Class.length; j++) {
                this.startClassData[i].Class[j].StudentLimitation = this.classNumber * 1
              }
            }
            this.isUnified = false
          } else { // 统一设置班额
            for (let i = 0; i < this.startClassData[this.tag1].Class.length; i++) {
              this.startClassData[this.tag1].Class[i].StudentLimitation = this.classNumber * 1
            }
          }
          this.modalSetClassNum = false
        } else {
          this.xy.msgError('班额只能输入1-999的正整数。')
          return this.changeLoading()
        }
      },
      // 集中设置课时
      async getAssignClassListForEditLesson () { // 集中设置课时数据
        this.xy.loading()
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/GetAssignClassListForEditLesson`, params)
        this.xy.unloading()
        if (res.success) {
          this.sectionSubject = res.data || []
        }
      },
      async submitUnifiedSetSection () { // 保存
        let arr = []
        this.unifiedSetSection = this.$refs.setCrouseTime.selectSectionInfo
        if (!Object.keys(this.unifiedSetSection).length && !this.unifiedSetSubject.length) {
          return this.xy.msgError('请选择要保存的值。')
        } else if (!this.unifiedSetSubject.length) {
          return this.xy.msgError('请选择班级。')
        } else if (!Object.keys(this.unifiedSetSection).length) {
          return this.xy.msgError('请选择课时。')
        }
        this.xy.loading()
        for (let item of this.unifiedSetSubject) {
          for (let k of this.sectionSubject) {
            if (item === k.SubjectName) {
              arr.push({
                AID: k.ParentID,
                Type: k.ParentType,
                Lesson: this.unifiedSetSection.value
              })
              k.updateLessonName = this.unifiedSetSection.name
            }
          }
        }
        let params = {
          ClassTableID: this.classTableID,
          Models: arr
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/EditMovingClassAssignClassLessonByAIDList`, params)
        if (res.success) {
          if (this.isGOonSetCrouseTime) { // 保存并继续
            for (let k of this.sectionSubject) {
              if (k.updateLessonName) {
                k.LessonName = k.updateLessonName
                k.updateLessonName = ''
              }
            }
            this.initTeacherTree = true
            this.unifiedSetSection = {}
            this.unifiedSetSubject = []
            setTimeout(() => {
              this.initTeacherTree = false
            }, 2000)
            this.getTP()
          } else {
            this.xy.msgSuc('集中设置课时成功。')
            this.cancleUnifiedSetSection()
          }
        }
        this.xy.unloading()
      },
      cancleUnifiedSetSection () {
        this.getTP()
        this.modalUnifiedSetSection = false
        this.unifiedSetSection = {}
        this.unifiedSetSubject = []
        this.isGOonSetCrouseTime = false
      },

      /** delBatchTeacher () { // 批量删除教师
  if (this.selectClassTree.length === 0) {
    this.xy.msgError('请选择删除项。')
    return false
  };
  let that = this
  let aIDList = []
  let isHavrTeacher = false
  for (let i = 0; i < that.selectClassTree.length; i++) {
    aIDList[i] = that.selectClassTree[i].id
    if (that.selectClassTree[i].teacherIDs.length > 0) {
      isHavrTeacher = true
    }
  };
  if (isHavrTeacher) {
    that.$Modal.confirm({
      title: '温馨提示',
      content: '您确定要批量删除教师？',
      async onOk () {
        let params = {
          ClassTableID: that.classTableID,
          AIDList: aIDList
        }
        let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassAssignClassSetting/DeleteMovingClassAssignClassClassTeacherList`, params)
        if (res.success) {
          that.xy.msgSuc('删除教师成功。')
          that.classTree.map((item, index) => {
            if (item.children.length > 0 && item.checked) {
              item.children.map((citem, cindex) => {
                if (aIDList.indexOf(citem.id) !== -1) {
                  // let title = citem.title.split('-')[0]
                  that.$set(citem, 'TeacherName', '')
                  that.$set(citem, 'teacherIDs', [])
                  that.$set(citem, 'render', that.renderNode(citem.SubjectName, citem.ClassName, ''))
                }
              })
            }
            return item
          })
          // console.log(that.classTree)
          let classTreeCheck = that.$refs.classTreeRef.getCheckedAndIndeterminateNodes()
          for (let i = 0, len = classTreeCheck.length; i < len; i++) {
            classTreeCheck[i].checked = false
            classTreeCheck[i].indeterminate = false
          }
          // that.getAssignClassListForEditTeacher()
          that.getTP()
        }
      }
    })
  } else {
    that.xy.msgError('选择项的课程下没有教师。')
  }
},**/
      async submitUnifiedSetTeacher () { // 保存
        this.selectTeacherTree = this.$refs.SetTeacherOrg.checkAllList
        this.selectClassTree = this.$refs.SetSubjectOrg.checkAllList
        // console.log(this.selectTeacherTree, this.selectClassTree)
        if (this.selectClassTree.length === 0) {
          this.xy.msgError('请选择班级。')
          return false
        };
        if (this.selectTeacherTree.length === 0) {
          this.xy.msgError('请选择教师。')
          return false
        };
        let aIDList = []
        let teachers = []
        let tNameList = []
        let userNameList = []
        for (let i = 0; i < this.selectClassTree.length; i++) {
          aIDList[i] = this.selectClassTree[i].id
        };
        for (let j = 0; j < this.selectTeacherTree.length; j++) {
          if (this.selectTeacherTree[j].UserID) {
            teachers.push(this.selectTeacherTree[j].UserID)
            tNameList.push(this.selectTeacherTree[j].title)
            userNameList.push(this.selectTeacherTree[j].userName)
          }
        };
        if (this.isGOonSetTeacher) { // 保存并继续设置教师
          this.submitContinueUnifiedSetTeacher(aIDList, teachers, tNameList, userNameList)
          return
        }
        let params = {
          ClassTableID: this.classTableID,
          AIDList: aIDList,
          Teachers: teachers
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/EditMovingClassAssignClassClassTeacherByAIDList`, params)
        if (res.success) {
          this.xy.msgSuc('集中设置教师成功。')
          this.getTP()
          this.modalUnifiedSetTeacher = false
          this.isGOonSetTeacher = false
        }
      },
      async submitContinueUnifiedSetTeacher (aIDList, teachers, tNameList, userNameList) { // 保存并继续
        this.xy.loading()
        let params = {
          ClassTableID: this.classTableID,
          AIDList: aIDList,
          Teachers: teachers
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/EditMovingClassAssignClassClassTeacherByAIDList`, params)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('集中设置教师成功。')
          this.initTeacherTree = true
          this.selectTeacherFullName = tNameList
          this.UserNames = userNameList
          this.selectTeacherIDs = teachers
          this.selectClassTree = []
          this.selectTeacherTree = []
          this.getTP()
          setTimeout(() => {
            this.initTeacherTree = false
            this.selectTeacherFullName = []
            this.UserNames = []
            this.selectTeacherIDs = []
          }, 2000)
        }
      },
      renderNode (SubjectName, ClassName, name) {
        let title = SubjectName + (ClassName ? '-' + ClassName : '') + (name ? '-' + name : '')
        let str = title.length > 30 ? title.slice(0, 30) + '...' : title
        return (h, { root, node, data }) => {
          return h('div', {}, [
            h('Tooltip', { props: { placement: 'top', transfer: true } },
              [
                h('span', {}, str),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-all',
                    maxHeight: '150px',
                    'overflow-y': 'auto'
                  }
                }, title)
              ]
            )
          ])
        }
      },
      cancleUnifiedSetTeacher () {
        this.getTP()
        this.modalUnifiedSetTeacher = false
        this.isGOonSetTeacher = false
      },
      // 查看课程设置的导出
      downFileCrouseSet (type) {
        this.xy.downFile(`${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/ExportAssignClassCourseSetting?classTableID=${this.classTableID}&type=${type}`)
      },

      clearSubmit () {
        let that = this
        if (that.clearText === '清除') {
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要清除全部设置吗？',
            async onOk () {
              let params = {
                id: that.classTableID
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassAssignClassSetting/ClearSetting`, params)
              if (res.success) {
                that.xy.msgSuc('清除全部设置成功。')
                that.$parent.getGeneralFlows()
                that.modalClear = false
                that.getTP()
              }
            }
          })
        } else {
          that.xy.msgError('请输入“清除”来确认清除全部选择。')
        }
      },

      // 添加班级
      addClassModal (index, Class) {
        this.creatClassName = []
        this.tag1 = ''
        this.tag1 = index
        if (Class !== undefined && Class.length > 0) {
          this.modalAddClass = true
        } else {
          this.$refs.formOrgCount.resetFields()
          this.creatClassNum = true
        }
      },
      // 确认添加班级-根据数字添加
      classNumSubmit () {
        this.$refs.formOrgCount.validate((valid) => {
          if (!valid) {
          } else {
            for (let k = 0; k < Number(this.formOrgCount.orgCount); k++) {
              this.startClassData[this.tag1].Class.push({
                ClassID: '',
                ClassName: k + 1 + '班',
                StudentLimitation: 1,
                TeacherIDs: [],
                TeacherNames: '',
                Detail: [],
                collapse: false,
                teacherInfos: []
              })
            }
            this.creatClassNum = false
          }
        })
      },
      // 取消添加班级-根据数字添加
      classNumCancel () {
        this.$refs.formOrgCount.resetFields()
        this.creatClassNum = false
      },
      // 确认添加班级
      addClassSubmit () {
        let tName = []
        for (let i = 0; i < this.tags.length; i++) {
          tName.push(this.tags[i].text)
        };
        let isOk = true
        for (let i = 0; i < tName.length; i++) {
          if (tName[i].length > 20) {
            this.xy.msgError('教学班名限制20字符。')
            return false
          } else {
            for (let j = 0; j < this.startClassData[this.tag1].Class.length; j++) {
              if (this.startClassData[this.tag1].Class[j].ClassName === tName[i]) {
                this.xy.msgError('教学班' + tName[i] + '已存在。')
                isOk = false
                return false
              }
            }
          }
        }
        if (isOk) {
          for (let k = 0; k < tName.length; k++) {
            this.startClassData[this.tag1].Class.push({
              ClassID: '',
              ClassName: tName[k],
              StudentLimitation: 1,
              TeacherIDs: [],
              TeacherNames: '',
              Detail: [],
              collapse: false,
              teacherInfos: []
            })
          }
          this.tags = []
          this.modalAddClass = false
        }
        this.creatClassName = []
      },
      // 取消添加班级
      addClassCancel () {
        this.modalAddClass = false
        this.creatClassName = []
        this.tags = []
      },
      // 删除班级
      delClass (index, classIndex, startClass) {
        let that = this
        that.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除该条数据吗？',
          async onOk () {
            if (startClass.Class[classIndex].ClassID !== '') {
              that.xy.loading()
              let params = {
                ClassTableID: that.classTableID,
                ParentID: startClass.ParentID,
                ParentType: startClass.ParentType,
                ClassID: startClass.Class[classIndex].ClassID
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassAssignClassSetting/Delete`, params)
              that.xy.unloading()
              if (res.success) {
                that.xy.msgSuc('删除成功。')
                that.startClassData[index].Class.splice(classIndex, 1)
                that.$parent.getGeneralFlows()
              }
            } else {
              that.startClassData[index].Class.splice(classIndex, 1)
            }
          }
        })
      },
      // 班名验证
      classNameChange (index, classIndex) {
        let className = this.startClassData[index].Class[classIndex].ClassName
        let num = 0
        for (let i = 0; i < this.startClassData[index].Class.length; i++) {
          if (this.startClassData[index].Class[i].ClassName === className) {
            num++
          }
        }
        if (num > 1) {
          this.startClassData[index].Class[classIndex].ClassName = ''
          this.xy.msgError('教学班名不能重复。')
        }
      },
      // 班额正整数验证
      classNumChange (index, classIndex) {
        let str = /^(1|([1-9]\d{0,2}))$/
        let num = this.startClassData[index].Class[classIndex].StudentLimitation * 1
        if (!str.test(num)) {
          this.startClassData[index].Class[classIndex].StudentLimitation = 1
          this.xy.msgError('请输入1-999正整数。')
        }
      },
      // 保存
      async startClassSubmit () {
        if (this.isOperation === 0) {
          let postData = []
          for (let i = 0; i < this.startClassData.length; i++) {
            if (this.startClassData[i].Class.length > 0) {
              let classNum = 0
              for (let j = 0; j < this.startClassData[i].Class.length; j++) {
                if (this.startClassData[i].Class[j].ClassName === '' || this.startClassData[i].Class[j].ClassName === null) {
                  this.xy.msgError(this.startClassData[i].SubjectName + '下的教学班不能为空。')
                  return false
                };
                if (!this.startClassData[i].Class[j].StudentLimitation) {
                  this.xy.msgError(this.startClassData[i].SubjectName + '下的班额不能为空。')
                  return false
                };

                classNum = classNum + Number(this.startClassData[i].Class[j].StudentLimitation)// 判断班额
                let detailsArr = []
                for (let k = 0; k < this.startClassData[i].Lesson; k++) {
                  let coursePlanDetailID = 0
                  if (this.startClassData[i].Class[j].Detail.length > k) {
                    coursePlanDetailID = this.startClassData[i].Class[j].Detail[k].CoursePlanDetailID
                  }
                  detailsArr.push({
                    Teachers: this.startClassData[i].Class[j].TeacherIDs,
                    CoursePlanDetailID: coursePlanDetailID
                  })
                }
                postData.push({
                  ClassTableID: this.classTableID,
                  CoursePlanID: this.startClassData[i].CoursePlanID,
                  ParentID: this.startClassData[i].ParentID,
                  ParentType: this.startClassData[i].ParentType,
                  Lesson: this.startClassData[i].Lesson,
                  ClassID: this.startClassData[i].Class[j].ClassID || 0,
                  ClassName: this.startClassData[i].Class[j].ClassName,
                  StudentLimitation: this.startClassData[i].Class[j].StudentLimitation * 1,
                  Details: detailsArr
                })
              }
              if (classNum < this.startClassData[i].SelectCount) {
                this.xy.msgError(this.startClassData[i].SubjectName + '的班额过小。')
                return false
              }
            } else {
              if (this.startClassData[i].SelectCount > 0) {
                this.xy.msgError('请为' + this.startClassData[i].SubjectName + '添加班级。')
                return false
              }
            }
          };
          this.xy.loading()
          let params = {
            ClassTableID: this.classTableID,
            Models: postData
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassAssignClassSetting/Create`, params)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.$parent.getGeneralFlows()// 成功后步骤可以点击
            this.getTP()
          }
        }
      },

      // ======选择教师组件 Start ======
      openAddTeacherModal (groupIndex, classIndex) {
        if (this.isOperation === 0) {
          this.tag1 = groupIndex
          this.tag2 = classIndex
          this.isShow = true
          this.selectedTeacherIDS = []
          let teacherIDS = this.startClassData[this.tag1].Class[this.tag2].TeacherIDs.map(Number)
          if (teacherIDS) {
            teacherIDS.map(item => {
              this.selectedTeacherIDS.push({
                UserID: item
              })
            })
          }
        }
      },
      selectCancel () {
        this.isShow = false
      },
      selectConfirm (data) {
        this.isShow = false
        this.selectedTeachers = [...data]
        if (this.selectedTeachers.length > 0) {
          this.addComplate()
        } else {
          this.xy.msgError('请先选择导师。')
        };
      },
      addComplate () {
        let nameStr = ''
        this.startClassData[this.tag1].Class[this.tag2].TeacherIDs = [] // 不保留上次所选项
        this.startClassData[this.tag1].Class[this.tag2].teacherInfos = [] // 不保留上次所选项

        for (let i = 0; i < this.selectedTeachers.length; i++) {
          let dataId = this.selectedTeachers[i].UserID
          let dataName = this.selectedTeachers[i].title
          nameStr += dataName + ','

          this.startClassData[this.tag1].Class[this.tag2].TeacherIDs.push(dataId)
          this.startClassData[this.tag1].Class[this.tag2].teacherInfos.push({
            id: this.selectedTeachers[i].UserID,
            name: this.selectedTeachers[i].title
          })
        };

        if (nameStr !== '') {
          this.startClassData[this.tag1].Class[this.tag2].TeacherNames = nameStr
        }

        this.startClassData[this.tag1].Class[this.tag2].collapse = false
        this.xy.msgSuc('添加教师成功。')
      },
      // ======选择教师组件 End ======

      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },

      trim (str, char) {
        if (!str) { return '' }
        char = (char || '\\s')
        char = ('(' + char + ')')
        let reg = new RegExp('(^' + char + '*)|(' + char + '*$)', 'g')
        return str.replace(reg, '')
      }

    }
  }
</script>
<style lang="less" scoped>
@import '../css/startClassSet.less';
@import '../../css/public.less';
</style>
