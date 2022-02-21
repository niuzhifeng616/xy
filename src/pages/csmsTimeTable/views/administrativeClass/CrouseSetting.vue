<!-- 4.课程设置 -->
<template>
  <div class="xy-content-body">
    <div v-if="StepsHeader.isOperation == 0"
         style="margin-bottom:10px;">
      <Button class="xy-primary"
              type="primary"
              @click="importantTemplate=true">导入课程设置</Button>
      <Button class="xy-info"
              type="info"
              @click="unifiedAddCrouse">统一添加课程</Button>
      <Dropdown trigger="click"
                v-if="isShowMore"
                @on-click="drownClick">
        <Button class="xy-info"
                type="info">
          更多
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="1">集中设置课时</DropdownItem>
          <DropdownItem name="2">集中设置教师</DropdownItem>
          <DropdownItem name="3">集中设置教室</DropdownItem>
          <DropdownItem name="4">查看课程设置</DropdownItem>
          <DropdownItem name="5">导出课程设置</DropdownItem>
          <DropdownItem name="6">批量删除课程</DropdownItem>
          <DropdownItem name="7">批量清空教室</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>

    <div class="crouse-content crouseSetting"
         :class="StepsHeader.isOperation != 0?'is-not-operation':''"
         style="overflow-y:auto">
      <div class="class-item"
           v-for="(item,index) in classCrouse"
           :key="index">
        <div class="class-title-info">
          <h2 class="student-count">{{item.CollectionName}}</h2>
          <div class="class-add-course"
               v-if="StepsHeader.isOperation == 0">
            <p class="class-add-box"
               @click="addCrouse(index,item.CollectionID)"> <i class="iconfont add-course-icon">&#xe69f;</i>
              <span class="add-course-btn">添加课程</span>
            </p>
            <p class="copy-course-box"
               @click="copyCrouse(item,index)"
               v-if='classCrouse.length>1&& item.CoursePlans.length>0'> <i class="iconfont add-course-icon">&#xe600;</i>
              <span class="add-course-btn">复制课程</span>
            </p>
          </div>
        </div>
        <div class="class-content">
          <table>
            <thead>
              <tr>
                <th style="width:20%;min-width:150px">学科</th>
                <th style="width:25%;min-width:200px">教师</th>
                <th style="width:20%;min-width:150px">课时</th>
                <th style="width:25%;min-width:200px">教室</th>
                <th style="width:10%;min-width:150px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(crouse,tag) in item.CoursePlans"
                  :key="tag">
                <td>{{crouse.SubjectName}}</td>
                <td>
                  <span v-if="crouse.ShowTeacher"
                        :title='crouse.TeacherName'>{{crouse.TeacherFullName?(crouse.TeacherFullName.length>12?crouse.TeacherFullName.substr(0, 12) + '...':crouse.TeacherFullName):''}}</span>
                  <!-- <span v-for="(teacher,tIndex) in crouse.teacherInfos"
                          :key="tIndex"> {{teacher.name}}{{tIndex!==crouse.teacherInfos.length-1?'、':''}}</span> -->
                  <span v-else
                        class="disabled-color">
                    请到 “排课规则 &gt; 设置教师和教室” 设置教师。
                  </span>
                </td>
                <td>{{sectionList[crouse.Lesson-1].name}}</td>
                <td>
                  <span v-if="crouse.ShowHouse"> {{crouse.HouseName}}</span>
                  <span v-else
                        class="disabled-color">
                    请到 “排课规则 &gt; 设置教师和教室” 设置教室。
                  </span>
                </td>
                <td>
                  <a href="javascript:;"
                     @click="goSelectTeacher(index,tag)"
                     :disabled="StepsHeader.isOperation!=0||!crouse.ShowTeacher">设置教师</a>
                  <a-divider type="vertical" />
                  <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link"
                       :disabled="StepsHeader.isOperation!=0"
                       @click="e => e.preventDefault()">
                      更多
                      <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item :disabled="StepsHeader.isOperation!=0"
                                   @click="openSetCourseTimeModal(item,crouse,index,tag)">
                        设置课时
                      </a-menu-item>
                      <a-menu-item :disabled="StepsHeader.isOperation!=0||!crouse.ShowHouse"
                                   @click="setClassFun(item,crouse,index,tag)">
                        设置教室
                      </a-menu-item>
                      <a-menu-item :disabled="StepsHeader.isOperation!=0"
                                   @click="delOne(item.CollectionID,crouse.CoursePlanID,index,tag,item,crouse)">
                        删除
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="fix-footer  text-right"
         v-if="StepsHeader.isOperation == 0">
      <Button class="xy-btn-primary"
              shape="circle"
              style="margin-right:0"
              v-if="classCrouse.length>0"
              @click="submitBtn(true)">保存</Button>
    </div>

    <!-- 添加课程 -->
    <Modal v-model="modalAddCrouse"
           :mask-closable="false"
           title="添加课程"
           v-if="StepsHeader.isOperation == 0"
           :loading="loading"
           width="670"
           :transfer="false">
      <div style="font-size:14px;">
        <div class="clearfix"
             style="padding-bottom:10px;">
          <Input search
                 v-model.trim="searchCrouse"
                 @on-change='searchFun'
                 placeholder="按课程名称搜索"
                 class="fr xy-content-title-search"
                 style="width: auto;" />
          <Select v-if="isSchoolCrouse"
                  v-model="schoolCrouseType"
                  @on-change="schoolCrouseTypeChange"
                  :label-in-value="true"
                  class="fr xy-content-title-search"
                  style="width:150px">
            <Option :value="item.SubjectCategoryID"
                    :label="item.SubjectCategoryName"
                    v-for="(item,scIndex) in subjectData.SubjectsCategoryChildren"
                    :key="scIndex">{{item.SubjectCategoryName}}</Option>
          </Select>
          <Select v-model="crouseType"
                  @on-change="crouseTypeChange"
                  :label-in-value="true"
                  class="fr xy-content-title-search"
                  style="width:150px">
            <Option :value="item.SubjectCategoryID"
                    :label="item.SubjectCategoryName"
                    v-for="(item,ssIndex) in subjectData.SubjectsCategory"
                    :key="ssIndex">{{item.SubjectCategoryName}}</Option>
          </Select>
        </div>
        <div style="height: 400px;overflow-y: scroll;"
             v-if="forSubjectData.length>0&&isHaveData">
          <ul class="modal-crouse">
            <li class="nowrap"
                :class="subject.isActive?'is-active':''"
                :title="subject.SubjectName"
                v-for="(subject,fIndex) in forSubjectData"
                :key="fIndex"
                v-show="subject.SubjectName.indexOf(searchCrouse)!= -1&&subject.isShow!=='noShow'"
                @click="crouseSelect(subject)">{{subject.SubjectName}}</li>
          </ul>
        </div>
        <!--暂无数据-->
        <div v-else-if='forSubjectData.length===0||!isHaveData'
             class="modal-null">
          <img class="img"
               src="@/assets/common/nullData.svg" />
          <span class="text">
            该搜索条件下没有结果。
          </span>
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="modalAddCrouse=false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="addCrouseSubmit">保存</Button>
      </div>
    </Modal>
    <!-- 预览大图 -->
    <div class="ivu-modal-mask"
         v-if='showBigImg'
         style="z-index: 2000;display: flex;justify-content: center;"
         @click="hideBigImg">
      <div class="big-img">
        <img src="@/assets/csmsTimeTable/template1.png"
             class=" tem-img1"
             v-if='showImgIndex===1'>
        <img src="@/assets/csmsTimeTable/template2.png"
             class=" tem-img2"
             v-if='showImgIndex===2'>
      </div>

    </div>
    <Modal v-model="importantTemplate"
           class="template-modal"
           width="620"
           :transfer="false"
           :mask-closable="false"
           @on-cancel="closeImportantTemplate">
      <p slot="header">选择导入模板</p>

      <div class="template-box">

        <div class="template1-box">
          <img src="@/assets/csmsTimeTable/template1.png"
               class='template-img'
               @click='ImportClick(1)'>
          <div class="btn-box">
            <span>模板1</span>
            <span @click='previewFun(1)'>预览</span>
          </div>
        </div>
        <div class="template2-box">
          <img src="@/assets/csmsTimeTable/template2.png"
               @click='ImportClick(2)'
               class='template-img'>
          <div class="btn-box">
            <span>模板2</span>
            <span @click='previewFun(2)'>预览</span>
          </div>
        </div>
      </div>
    </Modal>
    <!--添加教师 -->
    <SelectTeacherOrg :isShow="isShow"
                      :isMustChoose="false"
                      :selectMembers="[...selectedTeachers]"
                      @select-cancel="selectCancel"
                      @select-confirm="selectConfirm">
    </SelectTeacherOrg>
    <!--单个设置教室 -->
    <RadioSelectClass :isShow="isShowClass"
                      modalTitle="设置教室"
                      :classTableID="classPlan.classTableID"
                      :selectMembers="[...selectedClass]"
                      @select-cancel="selectClassCancel"
                      @select-confirm="selectClassConfirm">
    </RadioSelectClass>
    <Modal v-model="copyCourseModal"
           title="复制课程到"
           :mask-closable="false"
           @on-cancel="cancleCopyCourse"
           width="550">
      <div>
        <Checkbox :value="checkedAllClass"
                  :indeterminate="halfCheck"
                  @click.prevent.native="checkedAllFun">
          全选
        </Checkbox>
        <CheckboxGroup v-model="checkedlClassId"
                       @on-change="checkAllGroupChange"
                       style="margin-top: 10px;">
          <template v-for="item in classCrouse">
            <Checkbox style="padding: 10px 0 10px 0;"
                      v-if='item.CollectionID!==curRow.CollectionID'
                      :label="item.CollectionID"
                      :key="item.CollectionID">
              {{ item.CollectionName }}
            </Checkbox>
          </template>
        </CheckboxGroup>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancleCopyCourse">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="subCopyCourse">确定</Button>
      </div>
    </Modal>
    <!-- 集中设置课时 -->
    <Modal v-model="modalUnifiedSetSection"
           v-if="StepsHeader.isOperation == 0"
           @on-cancel="cancleUnifiedSetSection"
           width="864"
           :mask-closable="false"
           :transfer="false">
      <p slot="header">集中设置课时</p>
      <div style="font-size:14px;height:500px;overflow:hidden">
        <Row>
          <i-col span="12">
            <SetClassOrg :isGetTree='isGetTree'
                         :setType=1
                         ref='sectionCrouseTree'
                         :userNames='userNames'
                         :selectTeacherFullName='selectTeacherFullName'
                         :initTeacherTree='initTeacherTree'
                         :classTableID='classPlan.classTableID'></SetClassOrg>
          </i-col>
          <i-col span="12"
                 style="padding-left:20px;">
            <setCourseTime ref='setCrouseTime'
                           pageName="administrativeClass"
                           :isGetCourseList='isGetTree'
                           :initSectionData='initTeacherTree'></setCourseTime>
          </i-col>
        </Row>
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
    </Modal>
    <!-- 单个设置课时 -->
    <Modal v-model="setCourseTime"
           width="864"
           :transfer="false"
           :mask-closable="false"
           @on-cancel="cancleSetCourseTime">
      <p slot="header">设置课时</p>
      <ul class="modal-section-ul">
        <li v-for="(item,sdIndex) in sectionList"
            :key="sdIndex+item.name"
            :class="item.isSelect?'section-active':''"
            @click="selectCourseTime(item)">{{item.name}}
          <img src="@/assets/csmsTimeTable/active.png"
               alt=""
               v-show='item.isSelect'
               class="active-img">
        </li>
      </ul>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancleSetCourseTime">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="subSetCourseTime">保存</Button>
      </div>
    </Modal>
    <!-- 集中设置教师 -->
    <Modal v-model="modalUnifiedSetTeacher"
           v-if="StepsHeader.isOperation == 0"
           @on-cancel="cancleUnifiedSetTeacher"
           width="864"
           :mask-closable="false"
           :transfer="false">
      <p slot="header">集中设置教师</p>
      <div style="font-size:14px;height:500px;overflow:hidden">
        <Row>
          <i-col span="12">
             <!-- :initTeacherTree='initTeacherTree' -->
            <SetClassOrg :isGetTree='isGetTree'
                         :setType=2
                         ref='SetClassOrg'
                         :userNames='userNames'
                         :isChangeSetTName='isChangeSetTName'
                         :selectTeacherFullName='selectTeacherFullName'
                         :classTableID='classPlan.classTableID'></SetClassOrg>
          </i-col>
          <i-col span="12"
                 style="padding-left:20px;">
            <SetTeacherOrg :isGetTree='isGetTree'
                           ref='SetTeacherOrg'
                           :isMustChoose="false"
                           :initTeacherTree='initTeacherTree'
                           :classTableID='classPlan.classTableID'></SetTeacherOrg>
          </i-col>
        </Row>
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
    </Modal>

    <!-- 集中设置教室 -->
    <Modal v-model="modalUnifiedSetHouse"
           v-if="StepsHeader.isOperation == 0"
           @on-cancel="cancleUnifiedSetHouse"
           width="864"
           :mask-closable="false"
           :transfer="false">
      <p slot="header">集中设置教室</p>
      <div style="font-size:14px;height:500px;overflow:hidden">
        <Row>
          <i-col span="12">
            <CourseTree :isGetTree='isGetClassRoomTree'
                        ref='CourseTree'
                        :selectedHouseName='selectedHouseName'
                        :initTeacherTree='initClassRoomTree'
                        :classTableID='classPlan.classTableID'></CourseTree>
          </i-col>
          <i-col span="12"
                 style="padding-left:20px;">
            <ClassRoomTree :isGetTree='isGetClassRoomTree'
                           ref='ClassRoomTree'
                           :initTeacherTree='initClassRoomTree'
                           :classTableID='classPlan.classTableID'></ClassRoomTree>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Checkbox v-model="isGOonSetHouse"
                  class="fl"
                  style="line-height: 36px;">继续设置下一项</Checkbox>
        <Button class="xy-modal-close"
                @click="cancleUnifiedSetHouse">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitModalSetHouse">保存</Button>
        <!-- <Button class="xy-modal-primary" shape="circle"  @click="submitContinueModalSetHouse">保存并继续</Button> -->
      </div>
    </Modal>

    <!--查看课程设置-->
    <Modal v-model="modalLookCrouseSet"
           v-if="StepsHeader.isOperation == 0"
           width="864"
           :mask-closable="false"
           @on-cancel="closeCrouseSet"
           :transfer="false">
      <p slot="header">查看课程设置</p>
      <div style="font-size:14px;height:500px;">
        <Tabs value="1"
              :animated="false">
          <TabPane label="教师"
                   name="1">
            <div class="text-right"
                 style="margin-bottom:15px;">
              <Button class="xy-primary"
                      type="primary"
                      @click="downFileTeacher">导出</Button>
            </div>
            <div style="width:100%;overflow:auto;max-height:400px;">
              <table class="table">
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>课程</th>
                    <th v-for="(item,tdIndex) in thData"
                        :key="tdIndex">{{item.CoursePlanTableName}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(teacherList,lcIndex) in lookCrouseOne"
                      :key="lcIndex">
                    <td v-for="(teacher,tIndex) in teacherList"
                        :key="tIndex">
                      <!-- 教师列title需要显示用户名 -->
                      <div v-if='tIndex>1'
                           :title='teacher.UserName'>{{teacher.Name}}</div>
                      <div v-else>{{teacher.Name}}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPane>
          <TabPane label="课时"
                   name="2">
            <div class="text-right"
                 style="margin-bottom:15px;">
              <Button class="xy-primary"
                      type="primary"
                      @click="downFileLesson">导出</Button>
            </div>
            <div style="width:100%;overflow:auto;max-height:400px;">
              <table class="table">
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>课程</th>
                    <th v-for="(item,thIndex) in thData"
                        :key="thIndex">{{item.CoursePlanTableName}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(lessonList,lctIndex) in lookCrouseTwo"
                      :key="lctIndex">
                    <td v-for="(lesson,llIndex) in lessonList"
                        :key="llIndex">{{lesson}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPane>
          <TabPane label="任课节数"
                   name="3">
            <div class="text-right"
                 style="margin-bottom:15px;">
              <Button class="xy-primary"
                      type="primary"
                      @click="downFileNumber">导出</Button>
            </div>
            <div style="width:100%;overflow:auto;max-height:400px;">
              <table class="table">
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>教师</th>
                    <th width="30%">任教课程</th>
                    <th>任课节数</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(numberList,lctIndex) in lookCrouseThree"
                      :key="lctIndex">
                    <td v-for="(number,nlIndex) in numberList"
                        :key="nlIndex">
                      <!-- 教师列title需要显示用户名 -->
                      <div v-if='nlIndex===1'
                           :title='number.UserName'>{{number.Name}}</div>
                      <div v-else>{{number.Name}}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer">
        <Button class="xy-modal-primary"
                shape="circle"
                @click="closeCrouseSet">关闭</Button>
      </div>
    </Modal>

    <!--导入课程设置 -->
    <XyUpfile ref="upfile"
              :modalTitle="upLoadTitle"
              :describeData="tipData"
              :fileFormt="formtData"
              :fileSize="size"
              :importPath="upUrl"
              :paramsData="upParams"
              :templateUrl="templateUrl"
              :errorUrl="errorUrl"
              @successLoad="upfileSucFun">
    </XyUpfile>

    <!--批量删除课程、清空教室 -->
    <Modal v-model="modalClear"
           :mask-closable="false"
           :transfer="false"
           @on-cancel='clearClos'
           class="del-modal">
      <p slot="header">{{drownIndex===6?'批量删除课程':'批量清空教室'}}</p>
      <div v-if='allCourses.length'
           style="margin: 10px 0">
        <Checkbox :value="courseCheckAll"
                  :indeterminate="indeterminate"
                  style="margin-left: 10px"
                  @click.prevent.native="chooseAllCourse">全选</Checkbox>
        <ul class="modal-section-ul">
          <li v-for="(item,sdIndex) in allCourses"
              :key="sdIndex"
              :title='item.SubjectName'
              :class="item.isSelect?'section-active':''"
              @click="selectOne(item)">{{item.SubjectName}}
            <img src="@/assets/csmsTimeTable/active.png"
                 alt=""
                 v-show='item.isSelect'
                 class="active-img">
          </li>
        </ul>
      </div>
      <div v-else-if='!allCourses.length&&noData'
           class="no-data-modal">
        <img src="@/assets/common/nullData.svg"
             alt="图片" />
        <p class="no-class">
          {{drownIndex===6?'没有相同的课程信息，无法进行批量删除。':'您还没有教室的信息，请添加教室。'}}
        </p>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="clearClos">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="clearSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import XyUpfile from '@/components/upFile/XyUpfile.vue'
  // 集中设置课时
  import setCourseTime from '@/pages/csmsTimeTable/components/allSetCourseTime/CourseTime.vue'
  // 集中设置教师
  import SetTeacherOrg from '@/pages/csmsTimeTable/components/allSetTeacher/SetTeacherOrg.vue'
  import SetClassOrg from '@/pages/csmsTimeTable/components/allSetTeacher/SetClassOrg.vue'
  // 集中设置教室
  import ClassRoomTree from '@/pages/csmsTimeTable/components/allSetClassRoom/ClassRoomTree.vue'
  import CourseTree from '@/pages/csmsTimeTable/components/allSetClassRoom/CourseTree.vue'
  import SelectTeacherOrg from '@/pages/csmsTimeTable/components/selectTeacher/CheckboxSelectTeacher.vue'
  import RadioSelectClass from '@/pages/csmsTimeTable/components/selectClasses/RadioSelectClasses.vue'
  export default {
    components: {
      XyUpfile,
      SelectTeacherOrg,
      RadioSelectClass,
      SetTeacherOrg,
      SetClassOrg,
      ClassRoomTree,
      CourseTree,
      setCourseTime
    },
    data () {
      return {
        drownIndex: null, // 更多点击
        treeEmptyText: '正在加载中...', // tree树的暂无数据
        treeEmptyText1: '正在加载中...', // tree树的暂无数据
        classShow: false, // 集中设置课时loading
        classShowR: false, // 集中设置课时右边loading
        teacherSpinR: false, // 集中设置教师右边loading
        classroomShow: false, // 集中设置教室loading
        classroomShowR: false, // 集中设置教室右边loading
        tag: '', // 标记添加课程是哪个班的
        classCrouse: [],
        crouseArr: [],
        floorList: [],
        sectionList: [],
        allHouseData: [],
        clickDom: [],
        postData: [],
        isShowMore: false, // 更多按钮是否显示
        modalCrouseSet: false,
        loading: true,
        uploadSuccess: false, // 上传成功
        importResult: {},
        uploadFail: false, // 上传失败
        uploadFailInfo: '', // 上传失败下载的文件
        uploadTaskError: false, // 上传严重错误,
        isShowUpload: true, // 弹出框导入
        isShowSpin: false, //
        uploadEditUsersBySnPath: '',
        uploadData: {},
        isUnified: false, // 是否是统一添加课程
        // 添加教师
        isShow: false,
        selectedTeachers: [],
        // 添加课程
        courseCout: [],
        forSubjectData: [], // 要循环显示的课程
        isHaveData: true,
        subjectData: [],
        modalAddCrouse: false,
        searchCrouse: '',
        isSchoolCrouse: false,
        schoolCrouseType: '',
        crouseType: '',
        // 集中设置教室
        modalUnifiedSetHouse: false,
        houseTree: [],
        crouseTree: [],
        selectCrouseTree: [],
        selectHouseTree: [],
        isGOonSetHouse: false,
        selectedHouseName: '',
        // 组件需要的参数
        isGetClassRoomTree: false,
        initClassRoomTree: false,
        selectClassRoomName: '',
        // 集中设置教师
        modalUnifiedSetTeacher: false,
        selectTeacherTree: [],
        teacherSpin: false,
        selectClassTree: [],
        isGOonSetTeacher: false,
        isChangeSetTName: false,
        // 组件需要的参数
        isGetTree: false,
        initTeacherTree: false,
        selectTeacherFullName: '',
        userNames: '',
        // 集中设置课时
        modalUnifiedSetSection: false,
        sectionCrouseTree: [],
        selectSectionCrouseTree: [],
        selectSectionInfo: {},
        isGOonSetCrouseTime: false,
        // 单个设置课时
        setCourseTime: false,
        curRow: {},
        curSelectCourseTime: {},
        // 单个设置教室
        isShowClass: false,
        selectedClass: [],
        // 复制课程到
        copyCourseModal: false,
        halfCheck: false,
        checkedAllClass: false,
        checkedlClassId: [],
        // 查看课程设置
        modalLookCrouseSet: false,
        thData: [],
        lookCrouseOne: [],
        lookCrouseTwo: [],
        lookCrouseThree: [],
        // 批量删除课程
        modalClear: false,
        indeterminate: false,
        courseCheckAll: false,
        selectedCourseIDs: [],
        allCourses: [],
        noData: false,
        // 选择导入模板
        importantTemplate: false,
        showBigImg: false,
        showImgIndex: 1,
        // 导入课程设置
        upLoadTitle: '',
        tipData: [],
        formtData: [],
        size: 4000,
        upUrl: '//jsonplaceholder.typicode.com/posts/',
        upParams: {},
        templateUrl: '',
        errorUrl: '',
        // 方案信息
        StepsHeader: {},
        classPlan: {}
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
      },
      modalUnifiedSetHouse (val) { // 集中设置教室
        this.initClassRoomTree = false
        this.isGetClassRoomTree = val
      }

    },

    created () {
      this.StepsHeader = this.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      this.classPlan.classTableID = parseInt(this.classPlan.classTableID)

      for (let i = 1; i < 19; i++) {
        this.sectionList.push({
          value: i,
          name: i + '课时',
          isSelect: false
        })
      }
      this.getTp()
    },
    methods: {
      closeImportantTemplate () {
        this.importantTemplate = false
      },
      hideBigImg () {
        this.showBigImg = false
      },
      previewFun (val) {
        this.showBigImg = true
        this.showImgIndex = val
      },
      // 复制课程
      copyCrouse (collection, index) {
        this.copyCourseModal = true
        this.curRow = JSON.parse(JSON.stringify({ CollectionID: collection.CollectionID, CoursePlans: collection.CoursePlans }))
      },
      checkedAllFun () {
        this.checkedAllClass = this.halfCheck ? false : !this.checkedAllClass
        this.halfCheck = false
        if (this.checkedAllClass) {
          this.checkedlClassId = this.classCrouse.map(item => {
            if (item.CollectionID !== this.curRow.CollectionID) {
              return item.CollectionID
            }
          })
        } else {
          this.checkedlClassId = []
        }
      },
      checkAllGroupChange (data) {
        if (data.length === this.classCrouse.length - 1) {
          this.halfCheck = false
          this.checkedAllClass = true
        } else {
          this.halfCheck = data.length > 0
          this.checkedAllClass = false
        }
      },
      subCopyCourse () {
        if (this.checkedlClassId.length === 0) {
          return this.xy.msgError('请选择班级。')
        }
        let copyCourse = []
        this.curRow.CoursePlans.map(item => {
          copyCourse.push({
            SubjectName: item.SubjectName,
            SubjectID: item.SubjectID,
            Lesson: item.Lesson,
            TeacherID: '',
            HouseID: '',
            BuildingID: '',
            ShowTeacher: true,
            ShowHouse: true,
            CoursePlanInfos: [],
            teacherInfos: [],
            collapse: false
          })
        })
        this.curRow.CoursePlans = copyCourse
        this.courseCout = []
        this.classCrouse.map(item => {
          if (this.checkedlClassId.indexOf(item.CollectionID) !== -1) {
            if (item.CoursePlans.length > 0) {
              let haveCourseIds = item.CoursePlans.map(kitem => kitem.SubjectID)
              copyCourse.map(qitem => {
                if (haveCourseIds.indexOf(qitem.SubjectID) === -1) {
                  item.CoursePlans.push(qitem)
                }
              })
            } else {
              item.CoursePlans = copyCourse
            }
          }
        })
        this.setCourseCout()
        this.cancleCopyCourse()// 关闭对话框清空数据
      },
      cancleCopyCourse () {
        this.curRow = {}
        this.halfCheck = false
        this.checkedAllClass = false
        this.checkedlClassId = []
        this.copyCourseModal = false
      },
      // 单个设置教室
      setClassFun (collection, coursePlan, index, tag) {
        this.curRow = {
          collection,
          coursePlan,
          index,
          tag
        }
        this.selectedClass = coursePlan.HouseID ? [{ id: coursePlan.HouseID }] : []
        this.isShowClass = true
      },
      selectClassConfirm (data) {
        this.selectedClass = [...data]
        let index = this.curRow.index
        let tag = this.curRow.tag
        this.classCrouse[index].CoursePlans[tag].BuildingID = this.selectedClass[0].pId
        this.classCrouse[index].CoursePlans[tag].BuildingName = this.selectedClass[0].pTitle
        this.classCrouse[index].CoursePlans[tag].HouseID = this.selectedClass[0].id
        this.classCrouse[index].CoursePlans[tag].HouseName = this.selectedClass[0].title
        this.isShowClass = false
      },
      selectClassCancel () {
        this.isShowClass = false
        this.curRow = {}
      },
      // 单个设置课时
      openSetCourseTimeModal (collection, coursePlan, index, tag) {
        this.setCourseTime = true
        this.curRow = {
          collection,
          coursePlan,
          index,
          tag
        }
        if (coursePlan.Lesson) {
          this.changCourseTimeStatus(coursePlan.Lesson)
        }
      },
      selectCourseTime (val) {
        this.curSelectCourseTime = val
        this.changCourseTimeStatus(val.value)
      },
      cancleSetCourseTime () {
        this.curRow = {}
        this.curSelectCourseTime = {}
        this.setCourseTime = false
        this.changCourseTimeStatus(-1)
      },
      subSetCourseTime () {
        if (Object.keys(this.curSelectCourseTime).length === 0) {
          return this.xy.msgError('请选择课时。')
        }
        let index = this.curRow.index
        let tag = this.curRow.tag
        this.classCrouse[index].CoursePlans[tag].Lesson = this.curSelectCourseTime.value
        this.setCourseTime = false
      },
      changCourseTimeStatus (val) {
        this.sectionList.map(item => {
          item.isSelect = false
          if (item.value === val) {
            item.isSelect = true
          }
        })
      },
      // 获取数据
      async getTp () {
        this.tableShow = true
        this.isShowMore = false
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/CoursePlan/GetCoursePlans`, {
          classTableID: this.classPlan.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.classCrouse = []
          let resData = res.data
          for (let i = 0; i < resData.length; i++) {
            for (let j = 0; j < resData[i].CoursePlans.length; j++) {
              let houseData = []
              for (let m = 0; m < this.allHouseData.length; m++) {
                if (this.allHouseData[m].BuildingID === resData[i].CoursePlans[j].BuildingID) {
                  houseData = this.allHouseData[m].houseArr
                }
              }
              resData[i].CoursePlans[j].houseList = houseData
              resData[i].CoursePlans[j].teacherInfos = []
              resData[i].CoursePlans[j].collapse = false
              if (resData[i].CoursePlans[j].TeacherFullName !== '' && resData[i].CoursePlans[j].TeacherFullName !== null) {
                let tID = resData[i].CoursePlans[j].TeacherID.split(',')
                let tName = resData[i].CoursePlans[j].TeacherFullName.split(',')
                for (let k = 0; k < tName.length; k++) {
                  resData[i].CoursePlans[j].teacherInfos.push({
                    id: tID[k],
                    name: tName[k]
                  })
                }
              }
              this.isShowMore = true
            }
          };
          this.classCrouse = resData
          this.setCourseCout()
          this.$nextTick(() => {
            $('.crouseSetting').height(document.body.clientHeight - 300)
          })
        }
      },
      // 计算课程出现的次数，每个班级都添加过的课程，不做显示
      setCourseCout (info) {
        this.courseCout = []
        this.classCrouse.map(item => {
          if (item.CoursePlans.length > 0) {
            item.CoursePlans.map(info => {
              let index = this.courseCout.map(kitem => kitem.SubjectID).indexOf(info.SubjectID)
              if (index === -1) {
                this.courseCout.push({
                  SubjectID: info.SubjectID,
                  SubjectName: info.SubjectName,
                  count: 1
                })
              } else {
                this.courseCout[index].count += 1
              }
            })
          }
        })
      },
      // 是否显示老师列表
      collapseMustShow (coursePlanObj, coursePlan) {
        if (coursePlan.collapse) {
          coursePlan.collapse = false
        } else {
          if (coursePlan.teacherInfos.length > 0) {
            for (let j = 0; j < coursePlanObj.CoursePlans.length; j++) {
              if (coursePlanObj.CoursePlans[j].CoursePlanID !== coursePlan.CoursePlanID) {
                coursePlanObj.CoursePlans[j].collapse = false
              }
            };
            coursePlan.collapse = !coursePlan.collapse
          }
        }
      },
      // 删除老师
      delTeacher (coursePlans, tagI) {
        coursePlans.teacherInfos.splice(tagI, 1)
        let IDs = ''
        let names = ''
        for (let i = 0, len = coursePlans.teacherInfos.length; i < len; i++) {
          if (i + 1 < len) {
            IDs = IDs + coursePlans.teacherInfos[i].id + ','
            names = names + coursePlans.teacherInfos[i].name + ','
          } else {
            IDs = IDs + coursePlans.teacherInfos[i].id
            names = names + coursePlans.teacherInfos[i].name
          }
        }
        coursePlans.TeacherID = IDs
        coursePlans.TeacherName = names
      },
      // 保存课程
      async submitBtn (isTip, isContiueSet = false) {
        this.postData = []
        for (let i = 0; i < this.classCrouse.length; i++) {
          for (let j = 0; j < this.classCrouse[i].CoursePlans.length; j++) {
            let coursePlanInfos = []
            if (this.classCrouse[i].CoursePlans[j].CoursePlanInfos.length > 0) {
              for (let k = 0; k < this.classCrouse[i].CoursePlans[j].Lesson; k++) {
                let teacherID = []
                if (this.classCrouse[i].CoursePlans[j].ShowTeacher) {
                  if (this.classCrouse[i].CoursePlans[j].TeacherID !== '' && this.classCrouse[i].CoursePlans[j].TeacherID !== null) {
                    teacherID = this.classCrouse[i].CoursePlans[j].TeacherID.split(',')
                    teacherID = teacherID.filter((item) => { return item })
                  }
                } else {
                  if (k + 1 <= this.classCrouse[i].CoursePlans[j].CoursePlanInfos.length) {
                    teacherID = this.classCrouse[i].CoursePlans[j].CoursePlanInfos[k].Teachers
                  }
                }

                let houseID = this.classCrouse[i].CoursePlans[j].HouseID
                if (!this.classCrouse[i].CoursePlans[j].ShowHouse) {
                  if (k + 1 <= this.classCrouse[i].CoursePlans[j].CoursePlanInfos.length) {
                    houseID = this.classCrouse[i].CoursePlans[j].CoursePlanInfos[k].HouseID
                  } else {
                    houseID = 0
                  }
                }

                let coursePlanDetailID = ''
                if (this.classCrouse[i].CoursePlans[j].CoursePlanInfos[k] === undefined) {
                  coursePlanDetailID = 0
                } else {
                  coursePlanDetailID = this.classCrouse[i].CoursePlans[j].CoursePlanInfos[k].CoursePlanDetailID
                }
                houseID = houseID === '' ? 0 : houseID
                coursePlanInfos.push({
                  CoursePlanDetailID: coursePlanDetailID,
                  CoursePlanID: this.classCrouse[i].CoursePlans[j].CoursePlanID,
                  Teachers: teacherID,
                  HouseID: houseID
                })
              }
            } else {
              for (let k = 0; k < this.classCrouse[i].CoursePlans[j].Lesson; k++) {
                let teacherID = []
                if (this.classCrouse[i].CoursePlans[j].ShowTeacher) {
                  if (this.classCrouse[i].CoursePlans[j].TeacherID !== '' && this.classCrouse[i].CoursePlans[j].TeacherID !== null) {
                    teacherID = this.classCrouse[i].CoursePlans[j].TeacherID.split(',')
                    teacherID = teacherID.filter((item) => { return item })
                  }
                } else {
                  if (k + 1 <= this.classCrouse[i].CoursePlans[j].CoursePlanInfos.length) {
                    teacherID = this.classCrouse[i].CoursePlans[j].CoursePlanInfos[k].Teachers
                  }
                }

                let houseID = this.classCrouse[i].CoursePlans[j].HouseID
                // if (!this.classCrouse[i].CoursePlans[j].ShowHouse) {
                //    houseID = this.classCrouse[i].CoursePlans[j].CoursePlanInfos[k].HouseID;
                // }
                houseID = houseID === '' ? 0 : houseID
                coursePlanInfos.push({
                  CoursePlanDetailID: 0,
                  CoursePlanID: 0,
                  Teachers: teacherID,
                  HouseID: houseID
                })
              }
            }
            if (this.classCrouse[i].CoursePlans[j].CoursePlanID > 0) {
              this.postData.push({
                ClassTableID: this.classPlan.classTableID,
                CollectionID: this.classCrouse[i].CollectionID,
                CoursePlanTableID: this.classCrouse[i].CoursePlanTableID,
                SubjectID: this.classCrouse[i].CoursePlans[j].SubjectID,
                CoursePlanID: this.classCrouse[i].CoursePlans[j].CoursePlanID,
                CoursePlanInfos: coursePlanInfos
              })
            } else {
              this.postData.push({
                ClassTableID: this.classPlan.classTableID,
                CollectionID: this.classCrouse[i].CollectionID,
                CoursePlanTableID: this.classCrouse[i].CoursePlanTableID,
                SubjectID: this.classCrouse[i].CoursePlans[j].SubjectID,
                CoursePlanInfos: coursePlanInfos
              })
            }
          }
        };
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/CoursePlan/Create`, this.postData)
        this.xy.unloading()
        if (res.success) {
          if (isTip) {
            this.xy.msgSuc('保存成功。')
          }
          if (isContiueSet === 'setHouse') { // 集中设置教室，保存并继续，不刷新tree
            this.initClassRoomTree = true
            this.selectedHouseName = this.selectHouseTree.title
            setTimeout(() => {
              this.initClassRoomTree = false
              this.selectedHouseName = ''
              this.selectCrouseTree = []
              this.selectHouseTree = []
            }, 2000)
          } else if (isContiueSet === 'setCrouseTime') { // 集中设置课时，保存并继续，不刷新子组件的tree
            this.initTeacherTree = true
            this.selectTeacherFullName = this.selectSectionInfo.name
            setTimeout(() => {
              this.initTeacherTree = false
              this.selectTeacherFullName = ''
              this.selectSectionInfo = {}
              this.selectSectionCrouseTree = []
            }, 2000)
          }

          this.StepsHeader.getGeneralFlows()// 成功后步骤可以点击
          this.getTp()
        }
      },
      // 添加课程
      async addCrouse (index, collectionID) {
        this.tag = index
        this.subjectData = []
        this.searchCrouse = ''
        this.crouseType = ''
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/CoursePlan/GetCreateSubject`, {
          collectionID: collectionID
        })
        this.xy.unloading()
        if (res.success) {
          this.subjectData = res.data
          for (let i = 0; i < this.classCrouse[index].CoursePlans.length; i++) {
            let tag = this.subjectData.Subjects.map((item) => { return item.SubjectID }).indexOf(Number(this.classCrouse[index].CoursePlans[i].SubjectID))
            if (tag !== -1) {
              this.subjectData.Subjects.splice(tag, 1)
            }
          }
          this.subjectData.Subjects.map((item) => {
            this.$set(item, 'isActive', false)
            return item
          })
          if (res.data.SubjectsCategory.length > 0) {
            this.crouseType = 1
            this.forSubjectData = this.subjectData.Subjects.filter((item) => {
              if (item.SubjectCategoryID === this.crouseType) {
                return item
              }
            })
          }
          this.isUnified = false// 单一添加课程
        }
        this.isSchoolCrouse = false
        this.schoolCrouseType = ''
        this.searchCrouse = ''
        this.modalAddCrouse = true
        this.isHaveData = true
      },
      searchFun () {
        if (this.forSubjectData.length > 0) {
          this.isHaveData = this.forSubjectData.some(item => {
            return item.SubjectName.indexOf(this.searchCrouse) > -1 && item.isShow !== 'noShow'
          })
        }
      },
      crouseTypeChange (res) { // 选择课程方式
        let arr = this.courseCout.map(kitem => kitem.SubjectID)
        if (res !== undefined) {
          this.searchCrouse = ''
          if (res.value !== 3) { // 不是校本课程
            this.isSchoolCrouse = false
            this.forSubjectData = []
            this.forSubjectData = this.subjectData.Subjects.filter((item) => {
              if (item.SubjectCategoryID === this.crouseType) {
                let index = arr.indexOf(item.SubjectID)
                if (index > -1) {
                  item.isShow = this.courseCout[index].count === this.classCrouse.length ? 'noShow' : ''
                }
                return item
              }
            })
          } else { // 是校本课程
            this.isSchoolCrouse = true
            this.schoolCrouseType = this.subjectData.SubjectsCategoryChildren[0].SubjectCategoryID
            this.forSubjectData = []
            this.forSubjectData = this.subjectData.Subjects.filter((item) => {
              if (item.SubjectCategoryID === this.schoolCrouseType) {
                let index = arr.indexOf(item.SubjectID)
                if (index > -1) {
                  item.isShow = this.courseCout[index].count === this.classCrouse.length ? 'noShow' : ''
                }
                return item
              }
            })
          }
          this.isHaveData = true
        }
      },
      schoolCrouseTypeChange (res) { // 校本子分类
        this.searchCrouse = ''
        this.forSubjectData = []
        let arr = this.courseCout.map(kitem => kitem.SubjectID)
        this.forSubjectData = this.subjectData.Subjects.filter((item) => {
          if (item.SubjectCategoryID === this.schoolCrouseType) {
            let index = arr.indexOf(item.SubjectID)
            if (index > -1) {
              item.isShow = this.courseCout[index].count === this.classCrouse.length ? 'noShow' : ''
            }
            return item
          }
        })
        this.searchFun()
      },
      crouseSelect (val) { // 选课
        val.isActive = !val.isActive
      },
      addCrouseSubmit () { // 保存添加课程
        let isSelectCourse = false
        if (this.isUnified) { // 统一添加课程
          for (let i = 0; i < this.subjectData.Subjects.length; i++) {
            if (this.subjectData.Subjects[i].isActive) {
              isSelectCourse = true
              for (let m = 0; m < this.classCrouse.length; m++) {
                let tag = this.classCrouse[m].CoursePlans.map((item) => {
                  return Number(item.SubjectID)
                }).indexOf(this.subjectData.Subjects[i].SubjectID)
                if (tag === -1) {
                  this.classCrouse[m].CoursePlans.push({
                    SubjectName: this.subjectData.Subjects[i].SubjectName,
                    SubjectID: this.subjectData.Subjects[i].SubjectID,
                    Lesson: '5',
                    TeacherID: '',
                    HouseID: '',
                    BuildingID: '',
                    ShowTeacher: true,
                    ShowHouse: true,
                    CoursePlanInfos: [],
                    teacherInfos: [],
                    collapse: false
                  })
                }
              }
            }
          }
        } else { // 不是统一添加课程
          for (let i = 0; i < this.subjectData.Subjects.length; i++) {
            if (this.subjectData.Subjects[i].isActive) {
              isSelectCourse = true
              this.classCrouse[this.tag].CoursePlans.push({
                SubjectName: this.subjectData.Subjects[i].SubjectName,
                SubjectID: this.subjectData.Subjects[i].SubjectID,
                Lesson: '5',
                TeacherID: '',
                HouseID: '',
                BuildingID: '',
                ShowTeacher: true,
                ShowHouse: true,
                CoursePlanInfos: [],
                teacherInfos: [],
                collapse: false
              })
            }
          }
        }
        if (!isSelectCourse) {
          return this.xy.msgError('请选择课程。')
        }
        this.isUnified = false
        this.modalAddCrouse = false
        this.isShowMore = true
        this.setCourseCout()
      },
      // 统一添加课程
      async unifiedAddCrouse () {
        this.crouseType = ''
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/CoursePlan/GetCreateSubject`, {
          collectionID: 0
        })
        this.xy.unloading()
        if (res.success) {
          this.subjectData = res.data
          this.subjectData.Subjects.map((item) => {
            this.$set(item, 'isActive', false)
            return item
          })
          if (res.data.SubjectsCategory.length > 0) {
            this.crouseType = 1
            let arr = this.courseCout.map(kitem => kitem.SubjectID)
            this.forSubjectData = this.subjectData.Subjects.filter((item) => {
              if (item.SubjectCategoryID === this.crouseType) {
                let index = arr.indexOf(item.SubjectID)
                if (index > -1) {
                  item.isShow = this.courseCout[index].count === this.classCrouse.length ? 'noShow' : ''
                }
                return item
              }
            })
          }
          this.isUnified = true
          this.isSchoolCrouse = false
          this.schoolCrouseType = ''
          this.searchCrouse = ''
          this.modalAddCrouse = true
          this.isHaveData = true
        }
      },
      // 移除课程
      delOne (collectionID, coursePlanID, index, tag, item, crouse) {
        this.$Modal.confirm({
          title: '确定删除' + item.CollectionFullName + crouse.SubjectName + '吗？',
          content: '删除数据后会刷新当前页面，如有未保存的内容，请提前保存。',
          onOk: () => {
            if (coursePlanID > 0) {
              this.delOneHttp(collectionID, coursePlanID)
            } else {
              this.courseCout.map(item => {
                if (item.SubjectID === this.classCrouse[index].CoursePlans[tag].SubjectID) {
                  item.count -= 1
                }
                return item
              })
              this.classCrouse[index].CoursePlans.splice(tag, 1)
              let isBl = true
              for (let i = 0; i < this.classCrouse.length; i++) {
                if (this.classCrouse[i].CoursePlans.length > 0) {
                  isBl = true
                  return false
                } else {
                  isBl = false
                }
              }
              this.isShowMore = isBl
            }
          }
        })
      },
      async delOneHttp (collectionID, coursePlanID) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/CoursePlan/Delete`, {
          collectionID: collectionID,
          coursePlanID: coursePlanID,
          ClassTableID: this.classPlan.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.StepsHeader.getGeneralFlows()// 成功后步骤可以点击
          this.getTp()
        }
      },
      // 更多点击
      async drownClick (item) {
        let val = Number(item)
        this.drownIndex = Number(item)
        if (val === 1) {
          // this.getSettingCollection()
          this.isGOonSetCrouseTime = false
          this.modalUnifiedSetSection = true
        };
        if (val === 2) {
          this.isGOonSetTeacher = false
          this.modalUnifiedSetTeacher = true
          this.isChangeSetTName = false
        };
        if (val === 3) {
          this.isGOonSetHouse = false
          this.modalUnifiedSetHouse = true
        };
        if (val === 4) { // 查看课程设置
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/CoursePlan/GetCourseSetting`, {
            classTableID: this.classPlan.classTableID
          })
          this.xy.unloading()
          if (res.success) {
            this.thData = res.data.Collections
            this.lookCrouseOne = res.data.Teachers
            this.lookCrouseTwo = res.data.Lessons
            this.lookCrouseThree = res.data.Numbers
          }
          this.modalLookCrouseSet = true
        };
        if (val === 5) {
          if (this.classCrouse.length > 0) {
            this.xy.downFile(`${this.$store.state.apiPath}/api/CoursePlan/ExportSetting`, { classTableID: this.classPlan.classTableID }, 'get')
          } else {
            this.xy.msgError('没有数据课导出。')
          }
        };
        if (val === 6 || val === 7) {
          this.getcommonCoures(val)
          this.modalClear = true
        };
      },
      async getcommonCoures (val) {
        this.xy.loading()
        this.noData = false
        this.allCourses = []
        let url = val === 6 ? 'api/CoursePlan/GetAllSubject' : 'api/CoursePlan/GetCoursePlanCollecttionList'
        let res = await this.xy.get(`${this.$store.state.apiPath}/${url}`, { classTableID: this.classPlan.classTableID })
        if (res.success) {
          if (val === 7 && res.data && res.data.length > 0) {
            res.data.map(item => {
              this.allCourses.push({
                SubjectName: item.CollectionName,
                SubjectID: item.CollectionID
              })
            })
          } else {
            this.allCourses = res.data || []
          }
          this.noData = this.allCourses.length === 0
        }
        this.xy.unloading()
      },

      //  批量删除课程-----------全选
      chooseAllCourse (item, index) {
        this.courseCheckAll = !this.courseCheckAll
        this.indeterminate = false
        this.selectedCourseIDs = this.courseCheckAll ? this.allCourses.map(item => item.SubjectID) : []
        if (this.allCourses.length > 0) {
          this.allCourses.map((item) => {
            this.$set(item, 'isSelect', this.courseCheckAll)
            return item
          })
        }
      },
      selectOne (val) { // 选择课时数
        this.allCourses.map((item) => {
          if (item.SubjectID === val.SubjectID) {
            this.$set(item, 'isSelect', !item.isSelect)
          }
          return item
        })
        if (val.isSelect) {
          if (this.selectedCourseIDs.indexOf(val.SubjectID) === -1) {
            this.selectedCourseIDs.push(val.SubjectID)
          }
        } else {
          this.selectedCourseIDs = this.selectedCourseIDs.filter(item => item !== val.SubjectID)
        }
        this.checkAllCourse(this.selectedCourseIDs)
      },
      // 单个改变
      checkAllCourse (data) {
        if (data.length === this.allCourses.length && this.allCourses.length > 0) {
          this.indeterminate = false
          this.courseCheckAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.courseCheckAll = false
        } else {
          this.indeterminate = false
          this.courseCheckAll = false
        }
      },
      // 批量删除课程确定按钮
      clearSubmit () {
        console.log(this.selectedCourseIDs)
        if (!this.selectedCourseIDs.length) {
          return this.xy.msgError(this.drownIndex === 6 ? '请选择需要删除的课程。' : '请选择需要清空的班级。')
        }
        let strName = ''
        this.allCourses.map((item) => {
          if (item.isSelect) {
            strName += `${item.SubjectName}、`
          }
        })
        strName = strName.slice(0, strName.length - 1)
        let str = this.drownIndex === 6 ? `确定删除${strName}吗？` : `确定清空${strName}已设置的教室吗？`
        this.$Modal.confirm({
          title: `温馨提示`,
          content: `<p style='max-height: 108px; overflow: auto;'>${str}</p>删除数据后会刷新当前页面，如有未保存的内容，请提前保存。`,
          onOk: () => {
            this.sureDel()
          }
        })
      },
      async sureDel () {
        this.xy.loading()
        let res = {}
        if (this.drownIndex === 6) { // 批量删除课程
          res = await this.xy.post(`${this.$store.state.apiPath}/api/CoursePlan/DeleteSubject`, {
            id: this.classPlan.classTableID,
            ids: this.selectedCourseIDs.join(',')
          })
        } else { // 批量清空教室
          res = await this.xy.post(`${this.$store.state.apiPath}/api/CoursePlan/ResetCoursePlanDetailInfo`, {
            ClassTableID: this.classPlan.classTableID,
            CollectionIDs: this.selectedCourseIDs,
            DetailInfoType: 'H'
          })
        }

        this.xy.unloading()
        if (res.success) {
          if (this.drownIndex === 6) {
            this.xy.msgSuc('批量删除课程成功。')
          } else if (this.drownIndex === 7) {
            this.xy.msgSuc('批量清除教室成功。')
          }
          this.StepsHeader.getGeneralFlows()// 成功后步骤可以点击
          this.getTp()
        }
        this.clearClos()
      },
      clearClos () {
        this.indeterminate = false
        this.courseCheckAll = false
        this.modalClear = false
        this.selectedCourseIDs = []
      },
      // 集中设置课时的获取数据
      async getSettingCollection () {
        // this.classShow = true
        this.treeEmptyText = '正在加载中...'
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/CoursePlan/GetSettingCollection`, {
          classTableID: this.classPlan.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.sectionCrouseTree = []
          let dataList = res.data
          for (let i = 0; i < dataList.length; i++) {
            this.sectionCrouseTree.push({
              id: dataList[i].Value,
              title: dataList[i].Name,
              expand: true,
              children: []
            })
            for (let j = 0; j < dataList[i].Childrens.length; j++) {
              this.sectionCrouseTree[i].children.push({
                id: dataList[i].Childrens[j].CollectionID,
                title: dataList[i].Childrens[j].CollectionName,
                coursePlanID: dataList[i].Childrens[j].CoursePlanID,
                children: []
              })
            };
          };
          if (this.sectionCrouseTree.length === 0) {
            this.treeEmptyText = '课时树没有信息。'
          }
          this.classShow = false
        }
      },
      renderNode (title, teacherUserName) {
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
                }, teacherUserName || title)
              ]
            )
          ])
        }
      },
      submitUnifiedSetSection () { // 保存
        this.selectSectionCrouseTree = this.$refs.sectionCrouseTree.checkAllList
        this.selectSectionInfo = this.$refs.setCrouseTime.selectSectionInfo
        // console.log(this.selectSectionCrouseTre, this.selectSectionInfo)
        if (!Object.keys(this.selectSectionInfo).length && !this.selectSectionCrouseTree.length) {
          this.xy.msgError('请选择要保存的值。')
          return false
        } else if (!this.selectSectionCrouseTree.length) {
          return this.xy.msgError('请选择班级。')
        } else if (!Object.keys(this.selectSectionInfo).length) {
          this.xy.msgError('请选择课时。')
          return false
        }
        // this.selectSectionCrouseTree = this.selectSectionCrouseTree[0]
        for (let i = 0; i < this.classCrouse.length; i++) {
          for (let j = 0; j < this.classCrouse[i].CoursePlans.length; j++) {
            for (let k = 0; k < this.selectSectionCrouseTree.length; k++) {
              if (this.selectSectionCrouseTree[k].coursePlanID === this.classCrouse[i].CoursePlans[j].CoursePlanID) {
                this.classCrouse[i].CoursePlans[j].Lesson = this.selectSectionInfo.value
              }
            }
          }
        };
        if (!this.isGOonSetCrouseTime) { // 保存
          this.resSetSectionData()
        }
        this.submitBtn(!this.isGOonSetCrouseTime, 'setCrouseTime')
      },
      cancleUnifiedSetSection () { // 取消
        this.resSetSectionData()
        this.getTp()
      },
      resSetSectionData () {
        this.modalUnifiedSetSection = false
        this.selectSectionInfo = {}
        this.selectSectionCrouseTree = []
        this.isGOonSetCrouseTime = false
      },
      // 集中设置教室   start
      crouseTreeCheck (val) { // 课程树
        this.selectCrouseTree = []
        for (let i = 0; i < val.length; i++) {
          if (val[i].id > 0) {
            this.selectCrouseTree.push(val[i])
          }
        }
      },
      houseTreeCheck: function (val) { // 场室树
        if (val[0].id > 0) {
          this.selectHouseTree = val[0]
          this.selectedHouseName = val[0].title
        } else {
          val[0].selected = false
        }
      },
      submitModalSetHouse () { // 保存
        this.selectCrouseTree = this.$refs.CourseTree.checkAllList
        this.selectHouseTree = this.$refs.ClassRoomTree.checkNode.length ? this.$refs.ClassRoomTree.checkNode : []
        if (!this.selectCrouseTree.length && !this.selectHouseTree.length) {
          this.xy.msgError('请选择要保存的值。')
          return false
        } else if (!this.selectCrouseTree.length) {
          this.xy.msgError('请选择课程。')
          return false
        } else if (!this.selectHouseTree.length) {
          this.xy.msgError('请选择教室。')
          return false
        };
        this.selectHouseTree = this.selectHouseTree[0]
        if (this.isGOonSetHouse) {
          this.submitContinueModalSetHouse()
          return
        }
        for (let i = 0; i < this.classCrouse.length; i++) {
          for (let j = 0; j < this.classCrouse[i].CoursePlans.length; j++) {
            for (let k = 0; k < this.selectCrouseTree.length; k++) {
              if (this.selectCrouseTree[k].subjectID === this.classCrouse[i].CoursePlans[j].SubjectID &&
                this.selectCrouseTree[k].collectionID === this.classCrouse[i].CoursePlans[j].CollectionID) {
                this.classCrouse[i].CoursePlans[j].HouseID = this.selectHouseTree.id
                this.classCrouse[i].CoursePlans[j].CoursePlanInfos.map((item) => {
                  item.HouseID = this.selectHouseTree.id
                  return item
                })
              }
            }
          }
        };
        this.modalUnifiedSetHouse = false
        this.submitBtn(true)
        // this.getSettingHouse()
        this.selectCrouseTree = []
        this.selectHouseTree = []
      },
      submitContinueModalSetHouse () { // 保存并继续
        for (let i = 0; i < this.classCrouse.length; i++) {
          for (let j = 0; j < this.classCrouse[i].CoursePlans.length; j++) {
            for (let k = 0; k < this.selectCrouseTree.length; k++) {
              if (this.selectCrouseTree[k].subjectID === this.classCrouse[i].CoursePlans[j].SubjectID &&
                this.selectCrouseTree[k].collectionID === this.classCrouse[i].CoursePlans[j].CollectionID) {
                this.classCrouse[i].CoursePlans[j].HouseID = this.selectHouseTree.id
                this.classCrouse[i].CoursePlans[j].CoursePlanInfos.map((item) => {
                  item.HouseID = this.selectHouseTree.id
                  return item
                })
              }
            }
          }
        };
        this.submitBtn(false, 'setHouse')
      },
      cancleUnifiedSetHouse () { // 取消
        this.modalUnifiedSetHouse = false
        this.getTp()
      },
      async submitUnifiedSetTeacher () { // 保存
        this.selectTeacherTree = this.$refs.SetTeacherOrg.checkAllList
        this.selectClassTree = this.$refs.SetClassOrg.checkAllList
        if (this.selectClassTree.length === 0) {
          this.xy.msgError('请选择班级。')
          return false
        };
        // if (this.selectTeacherTree.length === 0) {
        //   this.xy.msgError('请选择教师。')
        //   return false
        // };
        console.log(this.selectTeacherTree)
        if (this.isGOonSetTeacher) { // 保存并继续设置教师
          this.submitContinueUnifiedSetTeacher()
          return
        }
        let selectCoursePlanID = []
        let selectTeacherID = []
        for (let i = 0; i < this.classCrouse.length; i++) {
          for (let j = 0; j < this.classCrouse[i].CoursePlans.length; j++) {
            for (let k = 0; k < this.selectClassTree.length; k++) {
              selectCoursePlanID.push(this.selectClassTree[k].coursePlanID)
              if (this.selectClassTree[k].coursePlanID === this.classCrouse[i].CoursePlans[j].CoursePlanID) {
                let teacherNmaeStr = ''
                let teacherIDStr = ''
                for (let m = 0; m < this.selectTeacherTree.length; m++) {
                  if (this.selectTeacherTree[m].children === undefined || this.selectTeacherTree[m].children.length === 0) {
                    selectTeacherID.push(this.selectTeacherTree[m].UserID)
                    teacherIDStr += this.selectTeacherTree[m].UserID + ','
                    teacherNmaeStr += this.selectTeacherTree[m].title + ','
                  }
                }
                this.classCrouse[i].CoursePlans[j].TeacherID = $.trim(teacherIDStr, ',')
                this.classCrouse[i].CoursePlans[j].TeacherName = $.trim(teacherNmaeStr, ',')
                this.classCrouse[i].CoursePlans[j].CoursePlanInfos.map(function (item) {
                  item.Teachers = $.trim(teacherIDStr, ',').split(',')
                  return item
                })
              }
            }
          }
        };
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/CoursePlan/EditCoursePlanTeacher`, {
          ClassTableID: this.classPlan.classTableID,
          CoursePlanIDs: selectCoursePlanID,
          TeacherIDs: selectTeacherID
        })
        this.xy.unloading()
        if (res.success) {
          this.modalUnifiedSetTeacher = false
          // this.getSettingTeacher()
          this.getTp()
          this.isGOonSetTeacher = false
          this.selectTeacherTree = []
          this.selectClassTree = []
        }
      },
      async submitContinueUnifiedSetTeacher () { // 保存并继续
        let selectCoursePlanID = []
        let selectTeacherID = []
        let selectTeacherFullName = ''
        let userNames = ''
        for (let i = 0; i < this.classCrouse.length; i++) {
          for (let j = 0; j < this.classCrouse[i].CoursePlans.length; j++) {
            for (let k = 0; k < this.selectClassTree.length; k++) {
              selectCoursePlanID.push(this.selectClassTree[k].coursePlanID)
              if (this.selectClassTree[k].coursePlanID === this.classCrouse[i].CoursePlans[j].CoursePlanID) {
                let teacherNmaeStr = ''
                let teacherIDStr = ''
                let uNameStr = ''
                for (let m = 0; m < this.selectTeacherTree.length; m++) {
                  if (this.selectTeacherTree[m].children === undefined || this.selectTeacherTree[m].children.length === 0) {
                    selectTeacherID.push(this.selectTeacherTree[m].UserID)
                    teacherIDStr += this.selectTeacherTree[m].UserID + ','
                    teacherNmaeStr += this.selectTeacherTree[m].title + ','
                    uNameStr += this.selectTeacherTree[m].userName + ','
                  }
                }
                this.classCrouse[i].CoursePlans[j].TeacherID = $.trim(teacherIDStr, ',')
                this.classCrouse[i].CoursePlans[j].TeacherName = $.trim(teacherNmaeStr, ',')
                this.classCrouse[i].CoursePlans[j].CoursePlanInfos.map(function (item) {
                  item.Teachers = $.trim(teacherIDStr, ',').split(',')
                  return item
                })
                selectTeacherFullName = $.trim(teacherNmaeStr, ',')
                userNames = $.trim(uNameStr, ',')
              }
            }
          }
        };
        // this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/CoursePlan/EditCoursePlanTeacher`, {
          ClassTableID: this.classPlan.classTableID,
          CoursePlanIDs: selectCoursePlanID,
          TeacherIDs: selectTeacherID
        })
        // this.xy.unloading()
        if (res.success) {
          this.initTeacherTree = true
          this.isChangeSetTName = true
          this.selectTeacherFullName = selectTeacherFullName
          this.userNames = userNames
          this.selectTeacherTree = []
          this.selectClassTree = []
          this.getTp()
          setTimeout(() => {
            this.isChangeSetTName = false
            this.initTeacherTree = false
            this.selectTeacherFullName = ''
            this.userNames = ''
          }, 2000)
        }
      },
      cancleUnifiedSetTeacher () { // 取消
        this.modalUnifiedSetTeacher = false
        this.isGOonSetTeacher = false
        this.getTp()
      },
      // 查看课程设置
      downFileTeacher () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/CoursePlan/ExportCourseSettingTeacher`, { classTableID: this.classPlan.classTableID })
      },
      downFileLesson () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/CoursePlan/ExportCourseSettingLesson`, { classTableID: this.classPlan.classTableID })
      },
      downFileNumber () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/CoursePlan/ExportCourseSettingNumbers`, { classTableID: this.classPlan.classTableID })
      },
      // 导入开始
      ImportClick (val) {
        this.importantTemplate = false
        this.title = '导入课程设置'
        this.tipData = []
        this.formtData = ['xlsx', 'xls']
        this.upParams = {}
        if (val === 1) {
          this.upUrl = `${this.$store.state.apiPath}/api/CoursePlan/ImportCoursePlan?id=${this.classPlan.classTableID}`
          this.templateUrl = `${this.$store.state.apiPath}/api/CoursePlan/DownloadTemplateNew?type=1`
        } else {
          this.upUrl = `${this.$store.state.apiPath}/api/CoursePlan/ImportCoursePlan2?id=${this.classPlan.classTableID}`
          this.templateUrl = `${this.$store.state.apiPath}/api/CoursePlan/DownloadTemplateNew?type=2`
        }
        this.$refs['upfile'].modalImport = true
        this.errorUrl = `${this.$store.state.apiPath}/api/CoursePlan/DownloadException`
      },
      upfileSucFun () {
        this.getTp()
      },
      // 添加教师
      goSelectTeacher (index, tag) {
        this.clickDom = []
        this.clickDom = [index, tag]
        this.selectedTeachers = []
        // 已经添加过的老师不显示
        let teacherID = this.classCrouse[index].CoursePlans[tag].TeacherID
        if (teacherID) {
          let ids = teacherID.split(',').map(Number)
          ids.map(item => {
            this.selectedTeachers.push({
              UserID: item
            })
          })
        }
        this.isShow = true
      },
      selectCancel () {
        this.isShow = false
      },
      closeCrouseSet () {
        this.modalLookCrouseSet = false
        this.getTp()
      },
      selectConfirm (data) {
        this.selectedTeachers = [...data]
        this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].TeacherName = ''
        this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].TeacherFullName = ''
        this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].TeacherID = ''
        this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].teacherInfos = []
        for (var i = 0; i < this.selectedTeachers.length; i++) {
          let newIds = this.selectedTeachers[i].id.split('/')
          let dataId = newIds[newIds.length - 1]
          var dataName = this.selectedTeachers[i].title
          var dataUserName = this.selectedTeachers[i].userName
          if (i + 1 < this.selectedTeachers.length) {
            this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].TeacherName += dataUserName + ','
            this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].TeacherFullName += dataName + ','
            this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].TeacherID += dataId + ','
          } else {
            this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].TeacherName += dataUserName
            this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].TeacherFullName += dataName
            this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].TeacherID += dataId
          }
          this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].teacherInfos.push({
            id: dataId,
            name: this.selectedTeachers[i].title
          })
        };
        this.classCrouse[this.clickDom[0]].CoursePlans[this.clickDom[1]].collapse = false
        this.isShow = false
      }
    }
  }
</script>
<style lang="less" scoped>
// 导入课程设置
.big-img {
  margin-top: 100px;
  overflow: auto;
}
.template-modal {
  /deep/.ivu-modal-body {
    background: #fff;
    padding: 0;
  }
  /deep/.ivu-modal-footer {
    display: none;
  }
  .template-img {
    width: 100%;
    height: 181px;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 3px;
    cursor: pointer;
  }
  .template-box {
    background: #f4f4f4;
    height: 290px;
    display: flex;
    padding: 26px 41px;
    .template1-box {
      width: 48%;
      margin-right: 5%;
      background-color: #fff;
      padding: 10px;
      border-radius: 4px;
    }
    .template2-box {
       width: 48%;
      background-color: #fff;
      padding: 10px;
      border-radius: 4px;
    }
    .btn-box {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      span:first-child {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
      }
      span:last-child {
        font-size: 14px;
        font-weight: 400;
        color: #1677ff;
        cursor: pointer;
      }
    }
  }
}
// 导入课程设置

.no-data-box {
  width: 392px;
  margin: 50px auto;
  position: relative;
  .no-data-img {
    width: 100%;
  }
  .no-data-text {
    position: absolute;
    top: 230px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #ccc;
    display: inline-table;
  }
}
.del-modal {
  /deep/.ivu-modal-body {
    height: 300px;
    overflow: auto;
  }
  .no-data-modal {
    display: flex;
    flex-direction: column;
    padding: 20px 50px;
    .no-class {
      line-height: 30px;
      text-align: center;
      font-size: 16px;
      color: rgb(127, 127, 127);
      margin-top: 30px;
    }
  }
}

/*课程设置*/
.nowarp {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.set-box .add-btn {
  color: #0496ff;
  font-size: 12px;
  padding: 3px 10px;
  cursor: pointer;
  width: 88px;
  height: 30px;
  background: rgba(236, 243, 255, 1);
  border: 1px solid rgba(99, 146, 233, 1);
  border-radius: 15px;
}
.set-box .del-icon {
  color: #0496ff;
  font-size: 20px;
  cursor: pointer;
}
.course-setting-collapse {
  margin-top: 18px;
  top: 32px;
  width: 350px;
  z-index: 999;
}
.add-teacher-btn {
  width: auto;
  height: 32px;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 10px;
}
.is-not-operation {
  opacity: 0.5;
}
.not-operation-select:hover {
  border-color: #dcdee2 !important;
}
.crouseSetting .content-list .content-list-ul li span {
  display: inline-block;
  vertical-align: middle;
}
.crouseSetting .content-list {
  width: 1000px;
  margin: 0 auto 20px;
  padding-bottom: 15px;
  border-bottom: 10px solid #f5f5f5;
}
.crouseSetting .content-list h1 {
  font-size: 16px;
  font-weight: bold;
  /*border-bottom:1px solid #ddd;*/
}
.crouseSetting .content-list i {
  cursor: pointer;
  color: #2db7f5;
}
.crouseSetting .content-list i:hover {
  /*color:#ed4014;*/
}
.crouseSetting .content-list-ul li {
  margin: 10px 0;
  /*margin-bottom:10px;*/
}
.crouseSetting .subject-name {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  margin-right: 5px;
}
.crouseSetting .select {
  height: 32px;
  width: 150px;
  padding-top: -3px;
  border: 1px solid #dcdee2;
  border-radius: 5px;
  color: #515a6e;
  cursor: pointer;
  outline: 0;
}
// .crouseSetting .houseSelect{
// }
.crouseSetting .select:hover,
.crouseSetting .select:focus {
  border-color: #57a3f3;
  border-radius: 5px;
  outline: 0;
}
.crouseSetting .selectTeacher {
  width: 150px;
  height: 32px;
  line-height: 32px;
  padding: 0 5px;
  border: 1px solid #dcdee2;
  border-radius: 5px;
  color: #515a6e;
  cursor: pointer;
  display: inline-block;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  margin-top: -5px;
}
.crouseSetting .selectTeacher i {
  margin-top: 8px;
}
.crouseSetting .section-set-text {
  padding-top: 1px;
  margin-right: 15px;
  font-size: 12px;
  color: #888;
}
.crouseSetting .add-class {
  color: #5cadff;
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
}
.modal-crouse {
  /*height:400px;
    overflow-y:scroll;*/
  padding: 10px 0;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.modal-crouse li {
  cursor: pointer;
  color: #4285f4;
  border: 1px solid #d4e4ff;
  overflow: hidden;
  margin: 10px;
  border-radius: 8px;
  width: 110px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.modal-crouse li:hover {
  color: #fff;
  background: #4285f4;

  transition: all 0.3s;
}
.modal-crouse .is-active {
  color: #fff;
  background: #4285f4;
  color: #fff;
  transition: all 0.3s;
}
/*行政班课程设置*/
.adm-setting-box {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  padding-bottom: 20px;
}
.adm-setting-box .set-header {
  height: 60px;
  line-height: 60px;
  background: #f5f7fa;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 0 18px;
}
.adm-setting-box .set-header .name {
  font-size: 16px;
  font-weight: bold;
  color: #444444;
}
.adm-setting-box .set-body > li {
  /*height: 60px;*/
  line-height: 60px;
  padding: 0 18px;
  border-bottom: 1px solid #ebeef5;
  /*display: inline-block;*/
  width: 100%;
}
// .adm-setting-box .set-body > li:nth-child(2n) {
//     background: rgba(250,250,250,1);
// }
.adm-setting-box .set-body > li .crouse-name {
  font-size: 14px;
  /*font-weight:bold;*/
  color: #444444;
  margin-right: 12px;
  width: 80px;
}
.adm-setting-box .set-body > li .mlr {
  margin: 0 14px;
}
.adm-setting-box .set-body > li .del-icon {
  color: #0496ff;
  font-size: 20px;
  cursor: pointer;
}
.adm-setting-box .set-footer {
  margin-top: 18px;
  padding-left: 18px;
}
.generate-course-results {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #fff7dd;
  border-radius: 4px;
}
.generate-course-results > .fa {
  color: #df4444;
  line-height: 30px;
  margin-left: 10px;
}
.generate-course-results > .results-notice {
  color: #df4444;
}
.check-list {
  width: 100%;
  min-height: 220px;
}
.check-list li {
  padding: 5px 0;
}
.check-list .generate-text {
  font-size: 14px;
}
.check-list .ivu-icon {
  font-size: 32px;
}
.check-list .ivu-icon-ios-checkmark-circle {
  color: #19be6b;
}
.check-list .ivu-icon-ios-close-circle {
  color: #ed4014;
}
.check-list .fa-spin {
  color: #5cadff;
}
.startCheck {
  max-height: 500px;
  overflow-y: scroll;
}
.modal-section-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.modal-section-ul li {
  cursor: pointer;
  min-width: 112px;
  height: 40px;
  line-height: 40px;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 4px;
  color: #333333;
  position: relative;
  margin: 10px;
  text-align: center;
  max-width: 164px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  padding: 0 10px;
  .active-img {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
// .modal-section-ul li:hover {
//   border: 1px solid #1677ff;
//   border-radius: 4px;
//   color: #1677ff;
//   transition: all 0.3s;
//   .sanjiao {
//     border-color: transparent #1677ff #1677ff transparent !important;
//   }
// }
.modal-section-ul .section-active {
  border: 1px solid #1677ff;
  color: #1677ff;
}
// .sanjiao {
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   width: 0;
//   height: 0;
//   border-color: transparent transparent transparent transparent;
//   border-width: 12px;
//   border-style: solid;
//   i {
//     position: absolute;
//     right: -12px;
//     bottom: -26px;
//     color: #fff;
//     font-size: 12px;
//   }
// }
// .active-bg {
//   border-color: transparent #1677ff #1677ff transparent !important;
// }
.table {
  border: 1px solid #ddd;
  cursor: pointer;
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 14px;
  width: 100%;
}
.table tr {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
}
.table tr th {
  height: 40px;
  min-width: 100px;
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  background-color: #f8f8f9;
  text-align: center;
  border: 1px solid #ddd;
}
.table tr td {
  height: 40px;
  border: 1px solid #ddd;
  text-align: center;
  font-weight: initial;
  padding: 10px 0;
}
.no-class {
  text-align: center;
  font-size: 16px;
  color: rgb(127, 127, 127);
  line-height: 200px;
}
// 新样式
.class-item {
  .class-title-info {
    margin-top: 25px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .student-count {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: bold;
    }
    .class-add-course {
      display: flex;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      .class-add-box {
        margin-right: 10px;
        cursor: pointer;
      }
      .copy-course-box {
        cursor: pointer;
      }
      .add-course-icon {
        margin-right: 5px;
      }
    }
  }
  // 内容
  .class-content {
    table {
      width: 100%;
      color: rgba(0, 0, 0, 0.65);
      thead {
        border-bottom: 1px solid #e8e8e8;
        background: #fafafa;
        border-radius: 4px 4px 0px 0px;
        th {
          font-size: 14px;
          height: 54px;
          font-weight: 600;
          padding: 0 10px;
        }
      }
      tbody {
        tr {
          border-bottom: 1px solid #e8e8e8;
          td {
            padding: 0 10px;
            height: 54px;
          }
        }
      }
    }
  }
}
.disabled-color {
  color: #ccc;
}
</style>
