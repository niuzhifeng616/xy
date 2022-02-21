<template>
  <!-- 5.课程设置 -->
  <div class="xy-content-body course-content">
    <!--初始loading-->
    <div v-if="isInitial"
         class="no-data-box isInitital-opacity">
      <!-- <img :src="require('@/assets/common/loading.png')" alt="" /> -->
    </div>
    <div v-if="!isInitial">
      <div class="pr text-right"
           style="margin-bottom:10px;">
        <div class="text-center">
          <span>
            本次选课最少选<Input style="width:50px;margin:0 5px;"
                   v-model="minOptionalCourse"
                   number />门，
            最多选<Input style="width:50px;margin:0 5px;"
                   v-model="maxOptionalCourse"
                   number />门。
          </span>
        </div>
        <div style="position:absolute;top:0;left:0;">
          <Button class="xy-primary"
                  @click="ImportClick"
                  :disabled="isOperation !== 0">导入课程设置</Button>
          <Dropdown @on-click="dropdownClick"
                    trigger="click"
                    v-if="isShowMore">
            <Button class="xy-info">
              集中设置
              <icon type="ios-arrow-down"></icon>
            </Button>
            <Dropdown-menu slot="list">
              <Dropdown-item :name="0"
                             :disabled="isOperation !== 0">集中设最大班额</Dropdown-item>
              <Dropdown-item :name="1"
                             :disabled="isOperation !== 0">集中设开课学段</Dropdown-item>
              <Dropdown-item :name="2"
                             :disabled="isOperation !== 0">集中设上课时间</Dropdown-item>
              <Dropdown-item :name="3"
                             :disabled="isOperation !== 0">集中设任课教师</Dropdown-item>
              <Dropdown-item :name="4"
                             :disabled="isOperation !== 0">集中设上课教室</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </div>
      </div>
      <div class="set-box area-part"
           style="height:590px;overflow:auto;">
        <div class="take-set-box area-item"
             v-for="(group,groupIndex) in groupData"
             :key="groupIndex">
          <div class="area-left">
            <span class="dot"></span>
            <div class="top"
                 :title="group.SubjectName">{{group.SubjectName}}</div>
            <div class="bottom">
              校本分类：
              <span class="nowrap"
                    v-if="group.SubjectCategoryName&&group.SubjectCategoryName.length < 5"
                    style="width: 100%; "> {{group.SubjectCategoryName}}</span>
              <span v-else
                    :title="group.SubjectCategoryName"
                    style="width: 100%; ">{{group.SubjectCategoryName?group.SubjectCategoryName.substr(0,4)+'...':''}}</span>
            </div>
            <div class="buttons">
              <!-- 删除课程 -->
              <i class="iconfont del"
                 :class="isOperation !== 0 ?'disable':''"
                 @click="delCrouse(group.CoursePlanID,groupIndex, 'delCourse')">&#xe6e1;</i>
              <!-- 添加班级 -->
              <i class="iconfont add"
                 :class="isOperation !== 0 ?'disable':''"
                 @click="addClass(groupIndex)">&#xe6d1;</i>
            </div>
          </div>
          <div class="area-right"
               style="min-width: 1380px;">
            <div class="set-body"
                 style="margin:0 10px;">
              <table class="take-table">
                <thead>
                  <tr>
                    <th>班名</th>
                    <th>最大班额</th>
                    <th>开课学段</th>
                    <th>上课教室</th>
                    <th>上课时间</th>
                    <th>任课教师</th>
                    <th>课程介绍</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,classIndex) in group.Classs"
                      :key="classIndex">
                    <td><Input class="take-input"
                             v-model="item.ClassName" /></td>
                    <td><Input class="take-input"
                             v-model="item.StudentLimitation" /></td>
                    <td>
                      <div class=" take-input">
                        <select class="span-style"
                                v-model="item.ClassSectionSettingAndOddWeek">
                          <option v-for="(semester, index0) in classSection"
                                  :key="index0"
                                  :value="semester.Value">
                            {{semester.Name}}
                          </option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <span class="span-td select-span"
                            v-if="item.HouseName === null || item.HouseName === ''"
                            title=""
                            @click.stop="addRoom(groupIndex,classIndex,'')">
                        选择教室
                        <Icon type="ios-arrow-forward"
                              class="fr" />
                      </span>
                      <span class="span-td select-span"
                            v-else
                            :title="item.HouseName"
                            @click.stop="addRoom(groupIndex,classIndex,item)">
                        {{item.HouseName}}
                        <Icon type="ios-arrow-forward"
                              class="fr" />
                      </span>
                    </td>
                    <td>
                      <span class="span-style"
                            :title="item.timeInfos.replace(/^(\s|,)+|(\s|,)+$/g,'')">
                        <span v-show="item.Details.length>0"
                              v-for="(detail,detailIndex) in item.Details"
                              :key="detailIndex">
                          {{detail.TimeInfo}}
                        </span>
                        <span v-if="item.Details.length===0"
                              style="color:#999">请添加上课时间</span>
                      </span>
                      <Button class="xy-primary"
                              :disabled="isOperation !== 0"
                              @click="addWeek(groupIndex,classIndex,item)">编辑时间</Button>

                    </td>
                    <td>
                      <div class="pr">
                        <span class="span-style"
                              :title="item.TeacherNames"
                              @click="collapseMustShow(group,item)">
                          <span v-show="item.teacherInfos.length>0"
                                v-for="(teacher, index) in item.teacherInfos"
                                :key="index">
                            {{teacher.name}}
                          </span>
                          <span v-if="item.teacherInfos.length===0"
                                style="color:#999">请先添加教师</span>
                        </span>
                        <collapse class="course-setting-collapse pa"
                                  value="1"
                                  v-if="item.collapse&&isOperation === 0">
                          <panel name="1">
                            已添加的教师
                            <div slot="content"
                                 style="line-height:22px;">
                              <tag v-for="(teacherTag,tagI) in item.teacherInfos"
                                   :key="tagI"
                                   v-show="item.teacherInfos.length>0"
                                   closable
                                   @on-close="delTeacher(item,tagI)">{{teacherTag.name}}</tag>
                              <span v-if="item.teacherInfos.length===0"
                                    style="color:#999">请先添加教师</span>
                            </div>
                          </panel>
                        </collapse>
                        <Button class="xy-primary"
                                :disabled="isOperation !== 0"
                                @click="openAddTeacherModal(groupIndex,classIndex)">设置教师</Button>
                      </div>
                    </td>
                    <td>
                      <!-- 添加 -->
                      <span class="span-td"
                            v-if="item.Url === '' && item.Description === ''">
                        <i class="iconfont add"
                           v-if="isOperation===0"
                           @click="addCrouseInfo(item,groupIndex,classIndex)">&#xe6d7;</i>
                      </span>
                      <!-- 查看 -->
                      <span class="span-td"
                            v-else>
                        <i class="iconfont view"
                           @click="addCrouseInfo(item,groupIndex,classIndex)">&#xe6e8;</i>
                      </span>
                    </td>
                    <td>
                      <!-- 删除 -->
                      <i class="iconfont del"
                         v-if="isOperation === 0"
                         @click="delClass(item.ClassID,group.CoursePlanID,groupIndex,classIndex)">&#xe6e1;</i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="text-center"
             style="margin:20px;"
             v-if="isOperation === 0">
          <span @click="addCrouse"
                class="add-btn">
            <span style="font-size:18px;">+</span>添加课程
          </span>
        </div>

      </div>
      <div style="margin-top:16px;text-align:center"
           v-if="groupData.length>0">
        <Button class="xy-btn-primary"
                shape="circle"
                @click="submitBtn"
                :disabled="isOperation !== 0">保存</Button>
      </div>
    </div>

    <!-- 上课时间 -->
    <Modal v-model="modalCrouseTime"
           :mask-closable="false"
           :closable="false"
           width="864"
           title="上课时间"
           v-if="isOperation===0"
           :transfer="false">
      <div style="font-size:14px;height:500px;overflow:auto">
        <table class="table-time">
          <thead>
            <tr>
              <th></th>
              <th v-for="(week, index) in weekData"
                  :key="index">{{week.name}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(schedule,i) in scheduleData"
                :key="i">
              <td>{{schedule.sectionName}}</td>
              <td v-for="(week,n) in schedule.weekList"
                  :key="n"
                  :data-dd="week.Day"
                  @click="scheduleClick(week,week.IsSelected)"
                  :class="!(week.IsSelected)?'schedule-not-select':week.scheduleSelect?'schedule-select':''"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancleCrouseTime">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="crouseTimeSubmit">确定</Button>
      </div>
    </Modal>

    <!-- 添加课程 -->
    <Modal v-model="modalAddCrouse"
           :mask-closable="false"
           :closable="false"
           width="600"
           v-if="isOperation===0"
           title="添加课程"
           :transfer="false">
      <div style="font-size:14px;">
        <div class="clearfix"
             style="padding-bottom:10px;">
          <Input search
                 @on-change='searchFun'
                 v-model.trim="searchCrouse"
                 placeholder="按课程名称搜索"
                 class="fr xy-content-title-search"
                 style="width: auto;" />
          <Select v-model="schoolCrouseType"
                  @on-change="schoolCrouseTypeChange"
                  label-in-value
                  class="fr xy-content-title-search"
                  style="width:150px">
            <Option :value="item.SubjectCategoryID"
                    :label="item.SubjectCategoryName"
                    v-for="(item, i) in subjectData.SubjectsCategoryChildren"
                    :key="i">{{item.SubjectCategoryName}}</Option>
          </Select>
          <Select v-model="crouseType"
                  disabled
                  label-in-value
                  class="fr xy-content-title-search"
                  style="width:150px">
            <Option :value="item.SubjectCategoryID"
                    :label="item.SubjectCategoryName"
                    v-for="(item, j) in subjectData.SubjectsCategory"
                    :key="j">{{item.SubjectCategoryName}}</Option>
          </Select>
        </div>
        <ul class="modal-crouse"
            v-if="subjectData.Subjects.length>0&&isHaveData">
          <li v-for="(subject, m) in subjectData.Subjects"
              class="nowrap"
              :key="m"
              v-show="subject.ChildSubjectCategoryID === schoolCrouseType && subject.SubjectName.indexOf(searchCrouse)!== -1"
              :data-id="subject.SubjectID"
              :data-name="subject.SubjectName"
              :title="subject.SubjectName"
              :data-scid="subject.ChildSubjectCategoryID"
              :data-scname="subject.ChildSubjectCategoryName"
              @click="crouseSelect($event)">{{subject.SubjectName}}</li>
        </ul>
        <div v-if="subjectData.Subjects.length===0||!isHaveData"
             class="modal-null">
          <img class="img"
               src="@/assets/common/nullData.svg"
               alt="图片" />
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
                @click="addCrouseSubmit">确定</Button>
      </div>
    </Modal>

    <!--添加教师 -->
    <SelectTeacherOrg :isShow="isShowSelectTeacher"
                      :selectMembers="[...selectedTeacherIDS]"
                      @select-cancel="selectTeacherCancel"
                      @select-confirm="selectTeacherConfirm">
    </SelectTeacherOrg>
    <!-- <select-teacher-org
      :isShow="isShowSelectTeacher"
      :teachers="[...selectedTeachers]"
      @select-cancel="selectTeacherCancel"
      @select-confirm="selectTeacherConfirm">
    </select-teacher-org> -->

    <!-- 上课教室 -->
    <Modal v-model="modalAddRoom"
           :mask-closable="false"
           :closable="false"
           title="上课教室"
           v-if="isOperation===0"
           width="564"
           @on-ok="addRoomSubmit"
           :transfer="false">
      <div style="font-size:14px;">
        <div style="margin-bottom:10px">
          <div style="margin-bottom:5px;">场馆楼</div>
          <Select v-model="buildID"
                  @on-change="getClassHouseList"
                  style="width:80%">
            <Option v-for="build in classBuildingData"
                    :value="build.BuildingID"
                    :key="build.BuildingID">{{build.BuildingName}}</Option>
          </Select>
        </div>
        <div>
          <div style="margin-bottom:5px;">场室</div>
          <Select v-model="selectHouse"
                  :disabled="houseSelect"
                  style="width:80%">
            <!--<Option v-for="house in houseData" :value="[house.HouseID,house.HouseName]" :key="house.HouseID">{{house.HouseName}}</Option>-->

            <Option v-for="house in houseData"
                    :value="house.HouseID"
                    :key="house.HouseID">{{house.HouseName}}</Option>
          </Select>
        </div>
      </div>
    </Modal>

    <!-- 课程介绍 -->
    <Modal v-model="modalCrouseInfo"
           :mask-closable="false"
           :closable="false"
           :z-index="300"
           width="564"
           title="课程介绍"
           :loading="loading"
           v-if="isOperation===0"
           :transfer="false">
      <div style="font-size:14px;min-height:200px;">
        <div style="margin-bottom:15px;">
          <radio v-model="crouseInfo"
                 style="height:100%;margin-bottom:5px;"
                 @on-change="radioChange(true)">
            <span>录入课程介绍</span>
          </radio>
          <editor ref="editor"
                  v-model="editorContent"
                  :disabled="editorDisabled" />
          <div v-if="false"
               style="margin-top:20px;">
            <Button class="xy-primary"
                    @click="clear">清空内容</Button>
            <Button class="xy-danger"
                    @click="disabled = !editorDisabled">禁用/启用</Button>
          </div>
          <!-- <div id="summernote" @click="radioChange(true)"></div> -->
        </div>
        <div>
          <radio v-model="crouseInfo1"
                 style="height:100%;margin-bottom:5px;"
                 @on-change="radioChange(false)">
            <span>设置课程介绍链接地址</span>
          </radio>
          <div>
            <Input style="width:100%;"
                   v-model="infoUrl"
                   @on-focus="radioChange(false)" />
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="modalCrouseInfo = false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="crouseInfoSubmit">确定</Button>
      </div>
    </Modal>

    <!-- 集中设最大班额 -->
    <Modal v-model="modalUnifiedSetClass"
           title="集中设最大班额"
           :mask-closable="false"
           @on-cancel="classCancel"
           width="864"
           v-if="isOperation===0"
           :transfer="false">
      <div style="font-size:14px;height:500px;overflow-y:auto">
        <Row>
          <i-col span="12">
            <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
              <Tree :data="countClassTree"
                    :empty-text="treeEmptyText"
                    show-checkbox
                    check-directly
                    multiple
                    @on-check-change="countClassTreeCheck"></Tree>
            </div>
          </i-col>
          <i-col span="12"
                 style="padding-left:20px;">
            <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
              <Alert show-icon
                     closable>只能输入1-999的整数。</Alert>
              <span style="margin-right:10px">最大班额</span>
              <InputNumber v-model="countClassNum"
                           :min="1"
                           :max="999" />
            </div>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="classCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitUnifiedSetClass">保存</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitContinueUnifiedSetClass">保存并继续</Button>
      </div>
    </Modal>

    <!-- 集中设开课学段 -->
    <Modal v-model="modalUnifiedSetSection"
           title="集中设开课学段"
           :mask-closable="false"
           @on-cancel="sectionCancel"
           width="864"
           v-if="isOperation===0"
           :transfer="false">
      <div style="font-size:14px;height:500px;overflow-y:auto">
        <Row>
          <i-col span="12">
            <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
              <Tree :data="countClassTree"
                    :empty-text="treeEmptyText"
                    show-checkbox
                    check-directly
                    multiple
                    @on-check-change="countClassTreeCheck"></Tree>
            </div>
          </i-col>
          <i-col span="12"
                 style="padding-left:20px;">
            <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
              <radio-group v-model="selectSection"
                           vertical>
                <radio :label="section.Value"
                       v-for="(section, index) in classSection"
                       :key="index">
                  <span class="f14">{{section.Name}}</span>
                </radio>
              </radio-group>
            </div>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="sectionCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitUnifiedSetSection">保存</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitContinueUnifiedSetSection">保存并继续</Button>
      </div>
    </Modal>

    <!-- 集中设上课时间 -->
    <Modal v-model="modalUnifiedSetTime"
           title="集中设上课时间"
           :mask-closable="false"
           @on-cancel="timeCancel"
           width="864"
           v-if="isOperation===0"
           :transfer="false">
      <div style="font-size:14px;height:500px;overflow-y:auto">
        <Row>
          <i-col span="8">
            <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
              <Tree :data="countClassTree"
                    :empty-text="treeEmptyText"
                    show-checkbox
                    check-directly
                    multiple
                    @on-check-change="countClassTreeCheck"></Tree>
            </div>
          </i-col>
          <i-col span="16"
                 style="padding-left:20px;">
            <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
              <table class="table-time">
                <thead>
                  <tr>
                    <th></th>
                    <th v-for="(week, index) in weekData"
                        :key="index">{{week.name}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(schedule, i) in scheduleData"
                      :key="i">
                    <td>{{schedule.sectionName}}</td>
                    <td v-for="(week,n) in schedule.weekList"
                        :key="n"
                        :data-dd="week.Day"
                        @click="modalScheduleClick($event,week,week.IsSelected)"
                        :class="week.IsSelected?'':'schedule-not-select'"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="timeCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitUnifiedSetTime">保存</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitContinueUnifiedSetTime">保存并继续</Button>
      </div>
    </Modal>

    <!-- 集中设任课教师 -->
    <Modal v-model="modalUnifiedSetTeacher"
           title="集中设任课教师"
           :mask-closable="false"
           @on-cancel="teacherCancel"
           width="864"
           v-if="isOperation===0"
           :transfer="false">
      <div style="font-size:14px;height:500px;overflow:hidden">
        <Row>
          <i-col span="12">
            <SetTeacherLeftTree :isGetTree='isGetTree'
                                :setType=3
                                ref='SetTeacherLeftTree'
                                :selectTeacherFullName='selectTeacherFullName'
                                :initTeacherTree='initTeacherTree'
                                :userNames='userNames'
                                :classTableID='classTableID'></SetTeacherLeftTree>
          </i-col>
          <i-col span="12"
                 style="padding-left:20px;">
            <SetTeacherOrg :isGetTree='isGetTree'
                           ref='SetTeacherOrg'
                           :initTeacherTree='initTeacherTree'
                           :classTableID='classTableID'></SetTeacherOrg>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Checkbox v-model="isGOonSetTeacher"
                  class="fl"
                  style="line-height: 36px;">继续设置下一项</Checkbox>
        <Button class="xy-modal-close"
                @click="teacherCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitUnifiedSetTeacher">保存</Button>
      </div>
    </Modal>

    <!-- 集中设上课教室 -->
    <Modal v-model="modalUnifiedSetRoom"
           title="集中设上课教室"
           :mask-closable="false"
           @on-cancel="roomCancel"
           width="864"
           v-if="isOperation===0"
           :transfer="false">
      <div style="font-size:14px;height:500px;overflow:hidden">
        <Row>
          <i-col span="12">
            <SetTeacherLeftTree :isGetTree='isGetClassRoomTree'
                                :setType=4
                                ref='SetClassRoomLeftTree'
                                :selectTeacherFullName='selectTeacherFullName'
                                :initTeacherTree='initClassRoomTree'
                                :classTableID='classTableID'></SetTeacherLeftTree>
          </i-col>
          <i-col span="12"
                 style="padding-left:20px;">
            <ClassRoomTree :isGetTree='isGetClassRoomTree'
                           ref='ClassRoomTree'
                           :initTeacherTree='initClassRoomTree'
                           :classTableID='classTableID'></ClassRoomTree>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
        <Checkbox v-model="isGOonSetHouse"
                  class="fl"
                  style="line-height: 36px;">继续设置下一项</Checkbox>
        <Button class="xy-modal-close"
                @click="roomCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitUnifiedSetRoom">保存</Button>
        <!-- <Button class="xy-modal-primary" shape="circle" @click="submitContinueUnifiedSetRoom">保存并继续</Button> -->
      </div>
    </Modal>

    <!-- 导入设置 -->
    <xy-upfile ref="courseSetUpfile"
               :modalTitle="uploadCourseSet.title"
               :describeData="uploadCourseSet.tipData"
               :fileFormt="uploadCourseSet.formtData"
               :fileSize="uploadCourseSet.size"
               :importPath="uploadCourseSet.upUrl"
               :paramsData="uploadCourseSet.upParams"
               :templateUrl="uploadCourseSet.templateUrl"
               :errorUrl="uploadCourseSet.errorUrl"
               @successLoad="modalSubmit">
    </xy-upfile>

  </div>
</template>
<script>
  import XyUpfile from '@/components/upFile/XyUpfile.vue'
  // 集中设置教师
  import SetTeacherOrg from '@/pages/csmsTimeTable/components/allSetTeacher/SetTeacherOrg.vue'
  import SetTeacherLeftTree from '@/pages/csmsTimeTable/components/allSetTeacher/takeLessonSetTLeftTree.vue'

  import SelectTeacherOrg from '@/pages/csmsTimeTable/components/selectTeacher/CheckboxSelectTeacher.vue'
  import Editor from '@/components/editor/Editor.vue'
  import ClassRoomTree from '@/pages/csmsTimeTable/components/allSetClassRoom/ClassRoomTree.vue'

  export default {
    name: 'TLCourseSetting',
    components: {
      XyUpfile,
      SelectTeacherOrg,
      ClassRoomTree,
      Editor,
      SetTeacherOrg,
      SetTeacherLeftTree
    },
    data () {
      return {
        loading: true,

        // 富文本编辑器
        editorDisabled: false,
        editorContent: '',

        // 导入课程设置
        uploadCourseSet: {
          title: '',
          tipData: [],
          formtData: [],
          size: 0,
          upParams: {},
          upUrl: '', // 上传文件url
          templateUrl: '', // 模板下载url
          errorUrl: '' // 下载错误文件url
        },

        isShowMore: true, // 是否显示集中设置
        modalAddCrouse: false,
        searchCrouse: '',
        crouseType: '',
        cascaderValue: '',
        isSchoolCrouse: false,
        schoolCrouseType: '',
        tag: '', // 标记添加课程是哪个班的
        classCrouse: [],
        crouseArr: [],
        floorList: [],
        buildingData: [],
        classBuildingData: [],
        onceHouseData: [],
        clickDom: [],
        groupData: [],
        isInitial: true, // 是否展示等在加载图片
        subjectData: {
          Subjects: []
        },
        isHaveData: true,
        minOptionalCourse: 0,
        maxOptionalCourse: 0,
        classSection: [],
        collectionID: 0,
        weekData: [],
        scheduleData: [],
        houseSelect: true,
        modalAddRoom: false,
        buildID: 0,
        selectHouse: '',
        selectHouse1: '',
        houseData: [],
        modalCrouseInfo: false,
        // crouseInfo: '1',
        crouseInfo: true,
        crouseInfo1: false,
        infoUrl: '',
        infoAre: '',
        tag1: '',
        tag2: '',
        // 上课时间
        modalCrouseTime: false,
        sectionList: ['第一节', '第二节', '第三节', '第四节',
                      '第五节', '第六节', '第七节', '第八节',
                      '第九节', '第十节', '第十一节', '第十二节'],
        zaoData: ['早自习一', '早自习二'],
        wanData: ['晚自习一', '晚自习二', '晚自习三', '晚自习四'],
        selectSchedule: [],
        classNameList: [],
        isEqualSCID: 0,

        // 添加教师
        isShowSelectTeacher: false,
        selectedTeachers: [],
        selectedTeacherIDS: [],

        // 集中设最大班额
        countClassNum: null,
        modalUnifiedSetClass: false,
        countClassTree: [],
        treeEmptyText: '',
        countSelectClassTree: [],
        // 集中设开课学段
        selectSection: -1, // 接口返回全学期为0，不可设置为0
        modalUnifiedSetSection: false,
        // 集中设上课时间
        selectTime: [],
        modalUnifiedSetTime: false,
        // 集中设上课教室
        isGetClassRoomTree: false,
        initClassRoomTree: false,
        selectClassRoomName: '',

        modalUnifiedSetRoom: false,
        roomBuildID: 0,
        roomSelectHouse: null,
        isGOonSetHouse: false,
        buildTree: [],
        buildTreeEmptyText: '正在加载中...',
        selectBuildTree: [],
        // 集中设上课教师
        modalUnifiedSetTeacher: false,
        teacherTreeEmptyText: '',
        teacherTree: [],
        selectTeacherTree: [],
        isGOonSetTeacher: false,
        // 组件需要的参数
        isGetTree: false,
        initTeacherTree: false,
        selectTeacherFullName: '',
        userNames: '',
        // 导入设置
        modalImport: false,
        isShowSpin: false,
        isShowUpload: true,
        uploadSuccess: false, // 上传成功
        uploadTaskError: false, // 上传严重错误,
        importResult: {},
        typeBtn: true,

        isOperation: true,
        classTableID: 0
      }
    },
    watch: {
      modalUnifiedSetTeacher (val) {
        this.initTeacherTree = false
        this.isGetTree = val
      },
      modalUnifiedSetRoom (val) {
        this.initClassRoomTree = false
        this.isGetClassRoomTree = val
        // this.initTeacherTree = false
        // this.isGetTree = val
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.rowObj.ClassTableID

      for (var i = 0; i < 7; i++) {
        this.weekData.push({
          value: i,
          name: this.xy.getChinesesWeekForNumSmall(i)
        })
      };
    },
    mounted () {
      this.getTp()
      this.getBuildingList()
      this.getTimes()
    },
    methods: {
      // 获取数据
      async getTp () {
        this.isInitial = true
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/GetSubjectSettingList`, {
          classTableID: this.classTableID
        })
        if (res.success) {
          this.classSection = res.data.ClassSection
          this.collectionID = res.data.CollectionID.CollectionID
          this.maxOptionalCourse = res.data.MaxOptionalCourse
          this.minOptionalCourse = res.data.MinOptionalCourse
          var resGroup = res.data.Group
          this.groupData = []
          if (resGroup.length === 0) { // 隐藏集中设置
            this.isShowMore = false
          } else {
            this.isShowMore = true
          }
          for (var i = 0; i < resGroup.length; i++) {
            for (var j = 0; j < resGroup[i].Courses.length; j++) {
              var classArr = []
              for (var k = 0; k < resGroup[i].Courses[j].Classs.length; k++) {
                resGroup[i].Courses[j].Classs[k].teacherInfos = []
                resGroup[i].Courses[j].Classs[k].collapse = false
                if (resGroup[i].Courses[j].Classs[k].TeacherIDs.length > 0) {
                  var tName = resGroup[i].Courses[j].Classs[k].TeacherNames.split(',')
                  for (var m = 0; m < tName.length; m++) {
                    resGroup[i].Courses[j].Classs[k].teacherInfos.push({
                      id: resGroup[i].Courses[j].Classs[k].TeacherIDs[m],
                      name: tName[m]
                    })
                  }
                };
                var timeInfos = ''
                resGroup[i].Courses[j].Classs[k].Details.map((item) => {
                  timeInfos += item.TimeInfo + ','
                  return item
                })
                classArr.push({
                  ClassID: resGroup[i].Courses[j].Classs[k].ClassID,
                  ClassName: resGroup[i].Courses[j].Classs[k].ClassName,
                  StudentLimitation: resGroup[i].Courses[j].Classs[k].StudentLimitation,
                  ClassSectionSettingAndOddWeek: resGroup[i].Courses[j].Classs[k].ClassSectionSettingAndOddWeek,
                  ClassSectionSettingName: resGroup[i].Courses[j].Classs[k].ClassSectionSettingName,
                  IsUrl: resGroup[i].Courses[j].Classs[k].IsUrl,
                  Url: resGroup[i].Courses[j].Classs[k].Url,
                  Description: resGroup[i].Courses[j].Classs[k].Description,
                  BuildingID: resGroup[i].Courses[j].Classs[k].BuildingID,
                  HouseID: resGroup[i].Courses[j].Classs[k].HouseID,
                  TeacherIDs: resGroup[i].Courses[j].Classs[k].TeacherIDs,
                  TeacherNames: $.trim(resGroup[i].Courses[j].Classs[k].TeacherNames, ','),
                  HouseName: $.trim(resGroup[i].Courses[j].Classs[k].HouseName, ','),
                  Details: resGroup[i].Courses[j].Classs[k].Details,
                  timeInfos: $.trim(timeInfos, ','),
                  teacherInfos: resGroup[i].Courses[j].Classs[k].teacherInfos,
                  collapse: resGroup[i].Courses[j].Classs[k].collapse
                })
              }
              this.groupData.push({
                ClassTableID: this.classTableID,
                CoursePlanID: resGroup[i].Courses[j].CoursePlanID,
                SubjectID: resGroup[i].Courses[j].SubjectID,
                SubjectName: resGroup[i].Courses[j].SubjectName,
                SubjectCategoryID: resGroup[i].SubjectCategoryID,
                SubjectCategoryName: resGroup[i].SubjectCategoryName,
                Classs: classArr
              })
            }
          }
          this.isInitial = false
        }
        this.xy.unloading()
      },

      // ===导入===
      ImportClick () {
        this.$refs['courseSetUpfile'].modalImport = true
        this.uploadCourseSet = {
          title: '导入课程',
          tipData: [''],
          formtData: ['xlsx', 'xls'],
          size: 10240,
          upParams: {},
          upUrl: `${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/Import?classTableID=${this.classTableID}`, // 上传文件url
          templateUrl: `${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/DownloadTemplateImport`, // 模板下载url
          errorUrl: `${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/DownloadExceptionImport` // 下载错误文件url
        }
      },
      async modalSubmit () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StartSlover/StartSchoolBasedGrab`, {
          ClassTableID: this.classTableID
        })
        if (res.success) {
          // this.xy.msgSuc('保存成功。')
          this.getTp()
          this.$parent.getGeneralFlows()
        }
      },

      // 获取上课时间
      async getTimes () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/GetTimes`, {
          classTableID: this.classTableID
        })
        if (res.success) {
          var resData = res.data
          this.scheduleData = []
          for (var i = 0; i < resData.length; i++) {
            resData[i].map((item) => {
              item.scheduleSelect = false
              return item
            })
            if (resData[i][0].AMorPM === 'MS') {
              this.scheduleData.push({
                sectionName: this.zaoData[resData[i][0].Order],
                weekList: resData[i]
              })
              continue
            };
            if (resData[i][0].AMorPM === 'AB') {
              this.scheduleData.push({
                sectionName: '上午大课间',
                weekList: resData[i]
              })
              continue
            };
            if (resData[i][0].AMorPM === 'NS') {
              this.scheduleData.push({
                sectionName: '午休',
                weekList: resData[i]
              })
              continue
            };
            if (resData[i][0].AMorPM === 'PB') {
              this.scheduleData.push({
                sectionName: '下午大课间',
                weekList: resData[i]
              })
              continue
            };
            if (resData[i][0].AMorPM === 'ES') {
              this.scheduleData.push({
                sectionName: this.wanData[resData[i][0].Order],
                weekList: resData[i]
              })
              continue
            };
            this.scheduleData.push({
              sectionName: this.sectionList[resData[i][0].Order],
              weekList: resData[i]
            })
          }
        }
      },
      // 添加上课时间
      addWeek (groupIndex, classIndex, item) {
        if (this.isOperation === 0) {
          this.tag1 = ''
          this.tag2 = ''
          this.tag1 = groupIndex
          this.tag2 = classIndex
          this.selectSchedule = []
          for (var i = 0; i < this.scheduleData.length; i++) {
            this.scheduleData[i].weekList.map((item) => {
              item.scheduleSelect = false
              return item
            })
            for (var j = 0; j < this.scheduleData[i].weekList.length; j++) {
              for (var k = 0; k < item.Details.length; k++) {
                if (this.scheduleData[i].weekList[j].Day === item.Details[k].Day &&
                  this.scheduleData[i].weekList[j].AMorPM === item.Details[k].AMorPM &&
                  this.scheduleData[i].weekList[j].AMorPMOrder === item.Details[k].AMorPMOrder) {
                  this.scheduleData[i].weekList[j].scheduleSelect = true
                  this.selectSchedule.push(this.scheduleData[i].weekList[j])
                }
              }
            }
          }
          this.modalCrouseTime = true
        }
      },
      // 选择上课时间
      scheduleClick (week, IsSelected) {
        if (IsSelected) {
          week.scheduleSelect = !week.scheduleSelect
          if (!week.scheduleSelect) {
            var index = this.selectSchedule.map((item) => { return item.ClassTableTimeID }).indexOf(week.ClassTableTimeID)
            this.selectSchedule.splice(index, 1)
          } else {
            this.selectSchedule.push(week)
          }
        }
      },
      // 取消上课时间
      cancleCrouseTime () {
        this.modalCrouseTime = false
      },
      // 保存上课时间
      crouseTimeSubmit () {
        if (this.selectSchedule.length > 0) {
          this.groupData[this.tag1].Classs[this.tag2].Details = []
          var timeInfos = ''
          for (var i = 0; i < this.selectSchedule.length; i++) {
            var sectionName = ''
            if (this.selectSchedule[i].AMorPM === 'MS') {
              sectionName = this.zaoData[this.selectSchedule[i].Order]
            };
            if (this.selectSchedule[i].AMorPM === 'ES') {
              sectionName = this.wanData[this.selectSchedule[i].Order]
            };
            if (this.selectSchedule[i].AMorPM === 'AM' || this.selectSchedule[i].AMorPM === 'PM') {
              sectionName = this.sectionList[this.selectSchedule[i].Order]
            };

            timeInfos += this.xy.getChinesesWeekForNumSmall(this.selectSchedule[i].Day) + sectionName + ','
            var curClass = this.groupData[this.tag1].Classs[this.tag2]
            curClass.Details.push({
              CoursePlanDetailID: 0,
              Teachers: curClass.TeacherIDs,
              TeacherIDs: curClass.TeacherIDs.join(','),
              TeacherNames: curClass.TeacherNames,
              BuildingID: curClass.BuildingID,
              HouseID: curClass.HouseID,
              HouseName: curClass.HouseName,
              Day: this.selectSchedule[i].Day,
              AMorPM: this.selectSchedule[i].AMorPM,
              AMorPMOrder: this.selectSchedule[i].AMorPMOrder,
              Time: this.selectSchedule[i].Time,
              AMCount: 0,
              TimeInfo: this.xy.getChinesesWeekForNumSmall(this.selectSchedule[i].Day) + sectionName
            })
          // curClass.Details.sort(sortTime) // ????待修改
          // curClass.Details.sort(sortDay)// ????待修改
          }
          this.groupData[this.tag1].Classs[this.tag2].timeInfos = $.trim(timeInfos, ',')

          this.modalCrouseTime = false
        } else {
          this.xy.msgError('至少选中一个课位。')
        }
      },
      // 删除上课时间
      delWeek (groupIndex, classIndex, detailIndex) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除吗？',
          onOk: () => {
            this.groupData[groupIndex].Classs[classIndex].Details.splice(detailIndex, 1)
          }
        })
      },
      // 获取场馆
      async getBuildingList () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ClassTable/GetBuildingListByClassId`, {
          classTableID: this.classTableID
        })
        if (res.success) {
          this.buildingData = res.data
          this.classBuildingData = res.data
        }
      },
      // 选择教室
      async getHouseList (buildingID) {
        if (buildingID !== undefined) {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetHouseList`, {
            buildingID: buildingID,
            type: '1'
          })
          this.xy.unloading()
          if (res.success) {
            this.houseData = res.data
            this.houseSelect = false
          }
        }
      },
      // 获取教室
      async getClassHouseList (buildingID) {
        if (buildingID !== undefined) {
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/GetHouseList`, {
            buildingID: buildingID,
            type: 'n'
          })
          this.xy.unloading()
          if (res.success) {
            this.houseData = res.data
            if (this.houseData.length > 0) {
              this.selectHouse = this.selectHouse1
            } else {
              this.selectHouse = ''
            }
            this.houseSelect = false
          }
        }
      },
      // 添加教室
      addRoom (groupIndex, classIndex, item) {
        this.tag1 = ''
        this.tag2 = ''
        this.tag1 = groupIndex
        this.tag2 = classIndex
        this.selectHouse = ''
        this.selectHouse1 = ''
        this.buildID = 0
        if (item !== '') {
          if (item.Details[0].BuildingID !== null && item.Details[0].BuildingID !== '') {
            this.houseSelect = true
            this.buildID = item.Details[0].BuildingID
            this.getClassHouseList(item.Details[0].BuildingID)
            this.selectHouse1 = item.Details[0].HouseID
          // this.selectHouse.push(item.Details[0].HouseID);
          // this.selectHouse.push(item.Details[0].HouseName);
          }
        } else {
          this.houseSelect = true
        }
        this.modalAddRoom = true
      },
      // 保存教室
      addRoomSubmit () {
        var houseObj = this.houseData.filter((item) => { return item.HouseID === this.selectHouse })
        this.groupData[this.tag1].HouseID = houseObj[0].HouseID
        this.groupData[this.tag1].HouseName = houseObj[0].HouseName
        this.groupData[this.tag1].Classs[this.tag2].HouseID = houseObj[0].HouseID
        this.groupData[this.tag1].Classs[this.tag2].HouseName = houseObj[0].HouseName
        // this.groupData[this.tag1].Classs[this.tag2].HouseID = this.houseData[0];
        this.groupData[this.tag1].Classs[this.tag2].BuildingID = this.buildID
        var detailData = this.groupData[this.tag1].Classs[this.tag2].Details
        for (var i = 0; i < detailData.length; i++) {
          detailData[i].BuildingID = this.buildID
          detailData[i].HouseID = houseObj[0].HouseID
          detailData[i].HouseName = houseObj[0].HouseName
        }
        this.modalAddRoom = false
      },
      // 是否显示老师列表
      collapseMustShow (group, classOne) {
        if (classOne.collapse) {
          classOne.collapse = false
        } else {
          if (classOne.teacherInfos.length > 0) {
            for (var j = 0; j < group.Classs.length; j++) {
              if (group.Classs[j].ClassID !== classOne.ClassID) {
                group.Classs[j].collapse = false
              }
            };
            classOne.collapse = !classOne.collapse
          }
        }
      },
      // 删除老师
      delTeacher (classOne, tagI) {
        classOne.teacherInfos.splice(tagI, 1)
        var names = ''
        classOne.TeacherIDs = []
        for (var i = 0; i < classOne.teacherInfos.length; i++) {
          classOne.TeacherIDs.push(classOne.teacherInfos[i].id)
          names = names + classOne.teacherInfos[i].name + ','
        }
        classOne.TeacherNames = $.trim(names, ',')
        classOne.Details.map((item) => {
          item.TeacherIDs = $.trim(classOne.TeacherIDs.join(','), ',')
          item.TeacherNames = classOne.TeacherNames
          return item
        })
      },
      // 校本子分类
      schoolCrouseTypeChange (res) {
        this.searchCrouse = ''
        this.isEqualSCID = 0
        this.isEqualSCID = res.value
        this.searchFun()
      },
      searchFun () {
        if (this.subjectData.Subjects.length > 0) {
          this.isHaveData = this.subjectData.Subjects.some(item => {
            return item.ChildSubjectCategoryID === this.schoolCrouseType && item.SubjectName.indexOf(this.searchCrouse) !== -1
          })
        }
      },
      // 添加课程
      async addCrouse () {
        this.searchCrouse = ''
        this.isEqualSCID = 0
        $('.modal-crouse li').each(function () {
          $(this).removeClass('is-active')
        })
        // this.tag = index;
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/CoursePlan/GetCreateSchoolBasedSubject`, {
          collectionID: this.collectionID
        })
        this.xy.unloading()
        if (res.success) {
          var resData = res.data
          if (resData.SubjectsCategory.length > 0) {
            this.crouseType = res.data.SubjectsCategory[0].SubjectCategoryID
          }
          if (resData.SubjectsCategoryChildren.length > 0) {
            this.schoolCrouseType = res.data.SubjectsCategoryChildren[0].SubjectCategoryID
          }
          for (var i = 0; i < this.groupData.length; i++) {
            var index = resData.Subjects.map((item) => { return item.SubjectID }).indexOf(Number(this.groupData[i].SubjectID))
            if (index !== -1) {
              resData.Subjects.splice(index, 1)
            }
          };
          this.subjectData = resData
        }
        this.modalAddCrouse = true
        this.isHaveData = true
      },
      // 添加课程搜索
      addCrouseSearch () {
        var _this = this
        if (_this.searchCrouse !== '') {
          $.each($('.modal-crouse li'), function (index, item) {
            if ($(item).attr('data-name').indexOf(_this.searchCrouse) !== -1 &&
              $(item).attr('data-scid') === _this.isEqualSCID) {
              $(item).show()
            } else {
              $(item).hide()
            }
          })
        } else {
          $.each($('.modal-crouse li'), function (index, item) {
            if ($(item).attr('data-scid') === _this.isEqualSCID) {
              $(item).show()
            } else {
              $(item).hide()
            }
          })
        }
      },
      // 选课
      crouseSelect (event) {
        var targe = $(event.currentTarget)
        var isActive = targe.hasClass('is-active')
        if (isActive) {
          targe.removeClass('is-active')
        } else {
          targe.addClass('is-active')
        }
        var subjectName = targe.attr('data-name')
        var subjectID = targe.attr('data-id')
        var subjectCategoryID = targe.attr('data-scid')
        var subjectCategoryName = targe.attr('data-scname')
        console.log('课名字subjectCategoryName：' + subjectCategoryName)
        console.log('课subjectCategoryID：' + subjectCategoryID)
        console.log('subjectID:' + subjectID)
        console.log('课subjectName：' + subjectName)
      },
      // 保存添加课程
      addCrouseSubmit () {
        var Day = ''; var AMorPM = ''; var AMorPMOrder = ''; var TimeInfo = ''; var oneStatus = true
        for (var i = 0; i < this.scheduleData.length; i++) {
          if (oneStatus) {
            for (var j = 0; j < this.scheduleData[i].weekList.length; j++) {
              if (this.scheduleData[i].weekList[j].IsSelected) {
                Day = this.scheduleData[i].weekList[j].Day
                AMorPM = this.scheduleData[i].weekList[j].AMorPM
                AMorPMOrder = this.scheduleData[i].weekList[j].AMorPMOrder
                TimeInfo = this.xy.getChinesesWeekForNumSmall(this.scheduleData[i].weekList[j].Day) + this.scheduleData[i].sectionName
                oneStatus = false
                break
              }
            }
          }
        }
        var _this = this
        let isSelectCourse = false
        console.log('选中的课')
        $.each($('.modal-crouse li'), function (index, item) {
          if ($(item).hasClass('is-active')) {
            isSelectCourse = true
            var subjectName = $(item).attr('data-name')
            var subjectID = $(item).attr('data-id')
            var subjectCategoryID = $(item).attr('data-scid')
            var subjectCategoryName = $(item).attr('data-scname')
            console.log('课名字subjectCategoryName：' + subjectCategoryName)
            console.log('课subjectCategoryID：' + subjectCategoryID)
            console.log('subjectID:' + subjectID)
            console.log('课subjectName：' + subjectName)
            _this.groupData.push({
              ClassTableID: _this.classTableID,
              CoursePlanID: 0,
              SubjectID: Number(subjectID),
              SubjectName: subjectName,
              SubjectCategoryID: Number(subjectCategoryID),
              SubjectCategoryName: subjectCategoryName,
              HouseID: 0,
              HouseName: '',
              Classs: [{
                ClassID: 0,
                ClassName: '1班',
                StudentLimitation: 40,
                ClassSectionSettingAndOddWeek: 0,
                ClassSectionSettingName: '',
                IsUrl: false,
                Url: '',
                Description: '',
                BuildingID: 0,
                HouseID: 0,
                TeacherIDs: [],
                TeacherNames: '',
                HouseName: '',
                timeInfos: TimeInfo,
                teacherInfos: [],
                collapse: false,
                Details: [{
                  CoursePlanDetailID: 0,
                  Teachers: [],
                  TeacherIDs: '',
                  TeacherNames: '',
                  BuildingID: 0,
                  HouseID: 0,
                  HouseName: '',
                  Day: Day,
                  AMorPM: AMorPM,
                  AMorPMOrder: AMorPMOrder,
                  TimeInfo: TimeInfo,
                  AMCount: 0
                }]
              }]
            })
          }
        })
        if (this.groupData.length === 0) { // 隐藏集中设置
          this.isShowMore = false
        } else {
          this.isShowMore = true
        };
        if (!isSelectCourse) {
          return this.xy.msgError('请选择课程。')
        }
        this.modalAddCrouse = false
      },
      // 删除课程
      delCrouse (coursePlanID, groupIndex, type) {
        if (this.isOperation === 0) {
          // this.groupData[groupIndex].Classs = [];
          if (type === 'delCourse') {
            // 页面内点击按钮删除课程
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除吗？',
              onOk: () => {
                if (coursePlanID > 0) {
                  this.delCourseFun(coursePlanID, groupIndex)
                } else {
                  this.groupData.splice(groupIndex, 1)
                  this.xy.msgSuc('课程删除成功。')
                  this.setBtnVisi()
                }
              }
            })
          } else if (type === 'delAllClass') {
            // 删除了课程下的所有班级后删除课程
            if (coursePlanID > 0) {
              this.delCourseFun(coursePlanID, groupIndex)
            } else {
              this.groupData.splice(groupIndex, 1)
              this.xy.msgSuc('课程删除成功。')
              this.setBtnVisi()
            }
          }
        }
      },
      async delCourseFun (coursePlanID, groupIndex) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/DeleteCourse`, {
          CoursePlanID: coursePlanID,
          ClassTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('课程删除成功。')
          this.groupData.splice(groupIndex, 1)
          // this.getTp();
          this.setBtnVisi()
        }
      },
      // 是否展示‘集中设置’按钮
      setBtnVisi () {
        if (this.groupData.length === 0) {
          this.isShowMore = false
        } else {
          this.isShowMore = true
        };
      },
      // 清空内容
      clear () {
        this.$refs.editor.clear()
      },
      // 课程介绍
      radioChange (val) {
        if (val) {
          this.crouseInfo = true
          this.crouseInfo1 = false
          this.infoUrl = ''
        } else {
          this.crouseInfo = false
          this.crouseInfo1 = true
          this.clear()
        }
      },
      addCrouseInfo (item, groupIndex, classIndex) {
        this.tag1 = ''
        this.tag2 = ''
        this.tag1 = groupIndex
        this.tag2 = classIndex
        this.infoUrl = ''
        this.infoAre = ''

        if (item.IsUrl) {
          this.crouseInfo = false
          this.crouseInfo1 = true
          this.infoUrl = item.Url
          this.clear()
        } else {
          this.crouseInfo1 = false
          this.crouseInfo = true
          this.infoUrl = ''
          this.editorContent = item.Description
        }
        this.modalCrouseInfo = true
      },
      // 保存课程介绍
      crouseInfoSubmit () {
        // eslint-disable-next-line no-useless-escape
        var reg = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/
        if (this.crouseInfo) {
          if (this.editorContent.length === 0) {
            this.xy.msgError('请输入课程介绍。')
            return false
          }
          // else if (this.editorContent.length > 1000 + 7) { // 7 p标签字符
          //   this.xy.msgError('课程介绍最多可输入1000字符。')
          //   return false
          // };
          this.groupData[this.tag1].Classs[this.tag2].IsUrl = 0
          this.groupData[this.tag1].Classs[this.tag2].Description = this.editorContent
          this.groupData[this.tag1].Classs[this.tag2].Url = ''
        };
        if (this.crouseInfo1) {
          if (!reg.test(this.infoUrl)) {
            this.xy.msgError('请输入正确的链接。')
            return false
          }
          this.groupData[this.tag1].Classs[this.tag2].IsUrl = 1
          this.groupData[this.tag1].Classs[this.tag2].Url = this.infoUrl
          this.groupData[this.tag1].Classs[this.tag2].Description = ''
        }
        this.modalCrouseInfo = false
      },
      // 添加一行班级
      addClass (groupIndex) {
        if (this.isOperation === 0) {
          var Day = ''; var AMorPM = ''; var AMorPMOrder = ''; var TimeInfo = ''; var oneStatus = true
          for (var i = 0; i < this.scheduleData.length; i++) {
            if (oneStatus) {
              for (var j = 0; j < this.scheduleData[i].weekList.length; j++) {
                if (this.scheduleData[i].weekList[j].IsSelected) {
                  Day = this.scheduleData[i].weekList[j].Day
                  AMorPM = this.scheduleData[i].weekList[j].AMorPM
                  AMorPMOrder = this.scheduleData[i].weekList[j].AMorPMOrder
                  TimeInfo = this.xy.getChinesesWeekForNumSmall(this.scheduleData[i].weekList[j].Day) + this.scheduleData[i].sectionName
                  oneStatus = false
                  break
                }
              }
            }
          }
          this.groupData[groupIndex].Classs.push({
            ClassID: 0,
            ClassName: '1班',
            StudentLimitation: 40,
            ClassSectionSettingAndOddWeek: 0,
            ClassSectionSettingName: '',
            IsUrl: false,
            Url: '',
            Description: '',
            BuildingID: 0,
            HouseID: 0,
            TeacherIDs: [],
            TeacherNames: '',
            HouseName: '',
            timeInfos: TimeInfo,
            teacherInfos: [],
            collapse: false,
            Details: [{
              CoursePlanDetailID: 0,
              Teachers: [],
              TeacherIDs: '',
              TeacherNames: '',
              BuildingID: 0,
              HouseID: 0,
              HouseName: '',
              Day: Day,
              AMorPM: AMorPM,
              AMorPMOrder: AMorPMOrder,
              TimeInfo: TimeInfo,
              AMCount: 0
            }]
          })
        }
      },
      // 删除一行班级
      delClass (classID, coursePlanID, groupIndex, classIndex) {
        if (classID !== 0) {
          // 已保存的班级
          this.$Modal.confirm({
            title: '温馨提示',
            content: this.groupData[groupIndex].Classs.length === 1 ? '删除最后一个班级后，该课程也会被删除，您确定要删除吗？' : '您确定要删除吗？',
            onOk: () => {
              this.delClassOk(classID, coursePlanID, groupIndex, classIndex)
            }
          })
        } else {
          // 未保存的班级
          if (this.groupData[groupIndex].Classs.length === 1) {
            // 只剩一个班级时才提示
            this.$Modal.confirm({
              title: '温馨提示',
              content: '删除最后一个班级后，该课程也会被删除，您确定要删除吗？',
              onOk: () => {
                this.groupData[groupIndex].Classs.splice(classIndex, 1)
                this.xy.msgSuc('班级删除成功。')
                // 删除最后一个班级后，当前课程也要删除
                this.delCrouse(coursePlanID, groupIndex, 'delAllClass')
              }
            })
          } else {
            this.groupData[groupIndex].Classs.splice(classIndex, 1)
            this.xy.msgSuc('班级删除成功。')
          }
        }
      },
      async delClassOk (classID, coursePlanID, groupIndex, classIndex) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/DeleteClass`, {
          ClassID: classID,
          CoursePlanID: coursePlanID,
          ClassTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.groupData[groupIndex].Classs.splice(classIndex, 1)
          this.xy.msgSuc('班级删除成功。')
          // 删除最后一个班级后，当前课程也要删除
          if (this.groupData[groupIndex].Classs.length === 0) {
            this.delCrouse(coursePlanID, groupIndex, 'delAllClass')
          }
        }
      },
      // 保存课程
      submitBtn () {
        if (this.isOperation === 0) {
          var reg1 = /^(0|([1-9]\d{0,2}))$/// 0-999
          var reg2 = /^(1|([1-9]\d{0,2}))$/// 1-999
          if (!reg1.test(this.minOptionalCourse)) {
            this.xy.msgError('本次最少选课门数限0-999整数。')
            return false
          };
          if (!reg1.test(this.maxOptionalCourse)) {
            this.xy.msgError('本次最多选课门数限0-999整数。')
            return false
          };
          if (this.maxOptionalCourse < this.minOptionalCourse) {
            this.xy.msgError('本次选课最多几门要大于等于最少几门。')
            return false
          };
          for (var i = 0; i < this.groupData.length; i++) {
            if (this.groupData[i].Classs.length === 0) {
              this.xy.msgError(this.groupData[i].SubjectName + '下没有班级，请先添加班级。')
              return false
            };
            for (var j = 0; j < this.groupData[i].Classs.length; j++) {
              if (this.groupData[i].Classs[j].ClassName.length === 0) {
                this.xy.msgError('班级名称不能为空。')
                return false
              };
              if (this.groupData[i].Classs[j].ClassName.length > 20) {
                this.xy.msgError('班级名称限20字符。')
                return false
              };
              var ClassNameHave = this.groupData[i].Classs.filter((item) => {
                return item.ClassName === this.groupData[i].Classs[j].ClassName
              })
              if (ClassNameHave.length > 1) {
                this.xy.msgError(this.groupData[i].SubjectName + '下的班级名称不能重复。')
                return false
              };
              if (!reg2.test(this.groupData[i].Classs[j].StudentLimitation)) {
                this.xy.msgError(this.groupData[i].SubjectName + '下的最大班额限1-999的整数。')
                return false
              };
              if (this.groupData[i].Classs[j].Details.length > 0) {
                for (var k = 0; k < this.groupData[i].Classs[j].Details.length; k++) {
                  if (this.groupData[i].Classs[j].Details[k].AMorPM === '') {
                    this.xy.msgError('上课时间不能为空。')
                    return false
                  }
                  if (this.groupData[i].Classs[j].Details[k].TeacherIDs !== '') {
                    this.groupData[i].Classs[j].Details[k].Teachers = this.groupData[i].Classs[j].Details[k].TeacherIDs.split(',')
                  } else {
                    this.groupData[i].Classs[j].Details[k].Teachers = []
                  }
                }
              } else {
                this.xy.msgSuc('上课时间不能为空。')
                return false
              }
            }
          }
          this.creatSS()
        }
      },
      async creatSS () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/Create`, {
          ClassTableID: this.classTableID,
          MinOptionalCourse: this.minOptionalCourse,
          MaxOptionalCourse: this.maxOptionalCourse,
          models: this.groupData
        })
        if (res.success) {
          this.startSchoolBasedGrabFun()
        }
      },
      async startSchoolBasedGrabFun () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StartSlover/StartSchoolBasedGrab`, {
          ClassTableID: this.classTableID
        })
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          this.getTp()
          this.$parent.getGeneralFlows()
        }
      },

      // ======选择教师组件 Start ======
      openAddTeacherModal (groupIndex, classIndex) {
        this.tag1 = groupIndex
        this.tag2 = classIndex
        this.isShowSelectTeacher = true
        // 已经添加过的老师不显示
        this.selectedTeacherIDS = []
        let teacherID = this.groupData[this.tag1].Classs[this.tag2].TeacherIDs
        if (teacherID) {
          teacherID.map(item => {
            this.selectedTeacherIDS.push({
              UserID: Number(item)
            })
          })
        }
      },
      selectTeacherCancel () {
        this.isShowSelectTeacher = false
      },
      selectTeacherConfirm (data) {
        this.isShowSelectTeacher = false
        this.selectedTeachers = [...data]
        if (this.selectedTeachers.length > 0) {
          this.addComplate()
        } else {
          this.xy.msgError('请先选择教师。')
        };
      },
      addComplate () {
        let tData = this.groupData[this.tag1].Classs[this.tag2]
        tData.TeacherNames = ''
        tData.TeacherIDs = []
        tData.teacherInfos = []
        for (var i = 0; i < this.selectedTeachers.length; i++) {
          var dataId = this.selectedTeachers[i].UserID
          var dataName = this.selectedTeachers[i].title
          if (i + 1 < this.selectedTeachers.length) {
            this.groupData[this.tag1].Classs[this.tag2].TeacherNames += dataName + ','
          } else {
            this.groupData[this.tag1].Classs[this.tag2].TeacherNames += dataName
          }
          this.groupData[this.tag1].Classs[this.tag2].TeacherIDs.push(dataId)
          this.groupData[this.tag1].Classs[this.tag2].teacherInfos.push({
            id: this.selectedTeachers[i].UserID,
            name: this.selectedTeachers[i].title
          })
          // if (tData.TeacherNames) {
          //   if (tData.TeacherNames.indexOf(dataName) === -1) {
          //     this.groupData[this.tag1].Classs[this.tag2].TeacherNames += ',' + dataName
          //   }
          // } else {
          //   this.groupData[this.tag1].Classs[this.tag2].TeacherNames += ',' + dataName
          // }
          // if (tData.TeacherIDs.length > 0) {
          //   if (tData.TeacherIDs.indexOf(String(dataId)) === -1 && tData.TeacherIDs.indexOf(parseInt(dataId)) === -1) {
          //     this.groupData[this.tag1].Classs[this.tag2].TeacherIDs.push(dataId)
          //     this.groupData[this.tag1].Classs[this.tag2].teacherInfos.push({
          //       id: this.selectedTeachers[i].UserID,
          //       name: this.selectedTeachers[i].title
          //     })
          //   }
          // } else {
          //   this.groupData[this.tag1].Classs[this.tag2].TeacherIDs.push(dataId)
          //   this.groupData[this.tag1].Classs[this.tag2].teacherInfos.push({
          //     id: this.selectedTeachers[i].UserID,
          //     name: this.selectedTeachers[i].title
          //   })
          // }
        };
        this.groupData[this.tag1].Classs[this.tag2].collapse = false

        this.groupData[this.tag1].Classs[this.tag2].TeacherNames = $.trim(this.groupData[this.tag1].Classs[this.tag2].TeacherNames, ',')
        var detailData = this.groupData[this.tag1].Classs[this.tag2].Details
        for (var j = 0; j < detailData.length; j++) {
          detailData[j].TeacherNames = this.groupData[this.tag1].Classs[this.tag2].TeacherNames
          detailData[j].TeacherIDs = this.groupData[this.tag1].Classs[this.tag2].TeacherIDs.join(',')
          detailData[j].Teachers = this.groupData[this.tag1].Classs[this.tag2].TeacherIDs
        }
      },
      // ======选择教师组件 End ======

      // 更多
      dropdownClick (val) {
        if (this.isOperation === 0) {
          if (val === 3) { // 任课教师
            this.isGOonSetTeacher = false
            this.modalUnifiedSetTeacher = true
            return
          };
          if (val === 4) { // 上课教室
            this.isGOonSetHouse = false
            this.modalUnifiedSetRoom = true
            return
          };
          this.getSettingClass(val)
          if (val === 0) { // 最大班额
            this.modalUnifiedSetClass = true
          };
          if (val === 1) { // 开课学段
            this.modalUnifiedSetSection = true
          };
          if (val === 2) { // 上课时间
            $.each($('.table-time td'), function (i, item) {
              $(item).removeClass('schedule-select')
            })
            this.modalUnifiedSetTime = true
          };
        }
      },
      async startSchoolBasedGrab () { // 生成课表
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StartSlover/StartSchoolBasedGrab`, {
          ClassTableID: this.classTableID
        })
        if (res.success) {
          this.$parent.getGeneralFlows()
          this.getTp()
        }
      },
      // 最大班额
      async getSettingClass (val) {
        this.treeEmptyText = '正在加载中...'
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/GetSchoolBasedGrabCourseSettingListForEditStudentLimitation`, {
          ClassTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.countClassTree = []
          var dataList = res.data
          for (var i = 0; i < dataList.length; i++) {
            this.countClassTree.push({
              id: 0,
              title: dataList[i].SubjectCategoryName,
              expand: true,
              children: []
            })
            for (var j = 0; j < dataList[i].Courses.length; j++) {
              for (var k = 0; k < dataList[i].Courses[j].Classs.length; k++) {
                let SubjectName = dataList[i].Courses[j].SubjectName
                let ClassName = dataList[i].Courses[j].Classs[k].ClassName
                let TeacherName = dataList[i].Courses[j].Classs[k].TeacherName
                let HouseName = dataList[i].Courses[j].Classs[k].HouseName
                let obj = {
                  id: dataList[i].Courses[j].Classs[k].ClassID,
                  SubjectName: SubjectName,
                  ClassName: ClassName,
                  TeacherName: TeacherName,
                  HouseName: HouseName,
                  title: SubjectName + '-' + ClassName,
                  // render: this.renderNode(SubjectName, ClassName, TeacherName),
                  children: []
                }
                if (val === 3) {
                  obj.render = this.renderNode(SubjectName, ClassName, TeacherName)
                } else if (val === 4) {
                  obj.render = this.renderNode(SubjectName, ClassName, HouseName)
                }
                this.countClassTree[i].children.push(obj)
              }
            };
          };
          if (this.countClassTree.length === 0) {
            this.treeEmptyText = '班级树没有信息。'
          }
        }
      },
      renderNode (SubjectName, ClassName, name) {
        let title = SubjectName + (ClassName ? '-' + ClassName : '') + (name ? '→' + name : '')
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
      countClassTreeCheck (val) { // 科目班级树
        this.countSelectClassTree = []
        for (var i = 0; i < val.length; i++) {
          if (val[i].id > 0) {
            this.countSelectClassTree.push(val[i])
          }
        }
      },
      buildTreeCheck (val) {
        if (val[0].id > 0) {
          this.selectBuildTree = val[0]
        } else {
          val[0].selected = false
        }
      },
      // 递归教室
      getHouseChildren (orglist, level = 1) {
        if (orglist.length > 0) {
          let result = []
          for (let i = 0; i < orglist.length; i++) {
            result.push({
              id: orglist[i].Value,
              title: orglist[i].Name,
              level: level,
              disabled: level !== 2,
              expand: false,
              children: this.getHouseChildren(orglist[i].Childrens, level + 1)
            })
          }
          return result
        }
      },
      submitUnifiedSetClass () { // 保存
        var cIdArr = []
        // 班级Id
        for (var i = 0; i < this.countSelectClassTree.length; i++) {
          cIdArr.push(this.countSelectClassTree[i].id)
        };
        this.addTotalClass(cIdArr, true)
      },
      submitContinueUnifiedSetClass () { // 保存并继续
        var cIdArr = []
        // 班级Id
        for (var i = 0; i < this.countSelectClassTree.length; i++) {
          cIdArr.push(this.countSelectClassTree[i].id)
        };
        this.addTotalClass(cIdArr, false)
      },
      async addTotalClass (cIdArr, close) {
        if (cIdArr.length === 0) {
          this.xy.msgError('请选择左侧班级。')
          return false
        };
        var reg = /^(1|([1-9]\d{0,2}))$/
        if (!reg.test(this.countClassNum)) {
          this.xy.msgError('班额只能填写“1-999”的整数。')
          return false
        };
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/EditSchoolBasedGrabSubjectSettingStudentLimitationByIDList`, {
          ClassTableID: this.classTableID,
          CoursePlanLevelIdList: cIdArr,
          StudentLimitation: this.countClassNum
        })
        if (res.success) {
          this.xy.msgSuc('集中设置最大班额成功。')
          this.countClassNum = 1
          this.countSelectClassTree = []
          if (close) {
            this.modalUnifiedSetClass = false
          } else {
            this.getSettingClass()
          }
          this.startSchoolBasedGrab()// 生成课表
        }
      },
      classCancel () { // 取消
        this.modalUnifiedSetClass = false
        this.countClassNum = null
      },
      //= ======集中设置班额 End=======

      // 集中设开课学段
      submitUnifiedSetSection () { // 保存
        var cIdArr = []
        // 班级Id
        for (var i = 0; i < this.countSelectClassTree.length; i++) {
          cIdArr.push(this.countSelectClassTree[i].id)
        };
        this.addSection(cIdArr, true)
      },
      submitContinueUnifiedSetSection () { // 保存并继续
        var cIdArr = []
        // 班级Id
        for (var i = 0; i < this.countSelectClassTree.length; i++) {
          cIdArr.push(this.countSelectClassTree[i].id)
        };
        this.addSection(cIdArr, false)
      },
      sectionCancel () { // 取消
        this.modalUnifiedSetSection = false
        this.selectSection = -1
      },
      async addSection (cIdArr, close) {
        if (cIdArr.length === 0) {
          this.xy.msgError('请选择左侧班级。')
          return false
        };
        if (this.selectSection === -1) {
          this.xy.msgError('请选择开课学段。')
          return false
        };
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/EditSchoolBasedGrabSubjectSettingClassSectionSettingByIDList`, {
          ClassTableID: this.classTableID,
          CoursePlanLevelIdList: cIdArr,
          ClassSectionSettingAndOddWeek: this.selectSection
        })
        if (res.success) {
          this.xy.msgSuc('集中设开课学段成功。')
          this.selectSection = -1
          this.countSelectClassTree = []
          if (close) {
            this.modalUnifiedSetSection = false
          } else {
            this.getSettingClass()
          }
          this.startSchoolBasedGrab()// 生成课表
        }
      },

      // 集中设上课时间
      modalScheduleClick (event, week, IsSelected) {
        if (IsSelected) {
          var targe = $(event.currentTarget)
          if (targe.hasClass('schedule-select')) {
            targe.removeClass('schedule-select')
            var index = this.selectTime.map((item) => { return item.ClassTableTimeID }).indexOf(week.ClassTableTimeID)
            this.selectTime.splice(index, 1)
          } else {
            targe.addClass('schedule-select')
            this.selectTime.push(week)
          }
        }
      },
      submitUnifiedSetTime () { // 保存
        var cIdArr = []
        // 班级Id
        for (var i = 0; i < this.countSelectClassTree.length; i++) {
          cIdArr.push(this.countSelectClassTree[i].id)
        };
        this.addTime(cIdArr, true)
      },
      submitContinueUnifiedSetTime () { // 保存并继续
        var cIdArr = []
        // 班级Id
        for (var i = 0; i < this.countSelectClassTree.length; i++) {
          cIdArr.push(this.countSelectClassTree[i].id)
        };
        this.addTime(cIdArr, false)
      },
      timeCancel () { // 取消
        this.modalUnifiedSetTime = false
        this.selectTime = []
        $.each($('.table-time td'), function (i, item) {
          $(item).removeClass('schedule-select')
        })
      },
      async addTime (cIdArr, close) {
        if (cIdArr.length === 0) {
          this.xy.msgError('请选择左侧班级。')
          return false
        };
        if (this.selectTime.length === 0) {
          this.xy.msgError('请选择上课时间。')
          return false
        };
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/EditSchoolBasedGrabSubjectSettingLevelInfoByIDList`, {
          ClassTableID: this.classTableID,
          CoursePlanLevelIdList: cIdArr,
          list: this.selectTime
        })
        if (res.success) {
          this.xy.msgSuc('集中设上课时间成功。')
          this.selectTime = []
          this.countSelectClassTree = []
          $.each($('.table-time td'), function (i, item) {
            $(item).removeClass('schedule-select')
          })
          if (close) {
            this.modalUnifiedSetTime = false
          } else {
            this.getSettingClass()
          }
          this.startSchoolBasedGrab()// 生成课表
        }
      },

      // 集中设上课教室
      submitUnifiedSetRoom () { // 保存
        this.countSelectClassTree = this.$refs.SetClassRoomLeftTree.checkAllList
        var cIdArr = []
        // 班级Id
        for (var i = 0; i < this.countSelectClassTree.length; i++) {
          cIdArr.push(this.countSelectClassTree[i].id)
        };
        this.addModalRoom(cIdArr, !this.isGOonSetHouse) // true:继续设置
      },
      async addModalRoom (cIdArr, close) {
        this.selectBuildTree = this.$refs.ClassRoomTree.checkNode.length ? this.$refs.ClassRoomTree.checkNode[0] : []
        if (cIdArr.length === 0) {
          this.xy.msgError('请选择左侧班级。')
          return false
        };
        if (this.selectBuildTree.length === 0) {
          this.xy.msgError('请选择上课教室。')
          return false
        };
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/EditSchoolBasedGrabSubjectSettingHouseByIDList`, {
          ClassTableID: this.classTableID,
          CoursePlanLevelIdList: cIdArr,
          HouseID: this.selectBuildTree.id
        })
        if (res.success) {
          this.xy.msgSuc('集中设上课教室成功。')
          if (close) {
            this.modalUnifiedSetRoom = false
          } else {
            this.initClassRoomTree = true
            this.selectTeacherFullName = this.selectBuildTree.title
            setTimeout(() => {
              this.initClassRoomTree = false
              this.selectTeacherFullName = ''
            }, 2000)
          }
          this.selectBuildTree = []
          this.countSelectClassTree = []
          this.houseSelect = true
          this.startSchoolBasedGrab()// 生成课表
        }
      },
      roomCancel () { // 取消
        this.countSelectClassTree = []
        this.selectBuildTree = []
        this.modalUnifiedSetRoom = false
      },
      submitUnifiedSetTeacher () { // 保存
        this.countSelectClassTree = this.$refs.SetTeacherLeftTree.checkAllList
        this.selectTeacherTree = this.$refs.SetTeacherOrg.checkAllList
        var cIdArr = []
        // 班级Id
        for (var i = 0; i < this.countSelectClassTree.length; i++) {
          cIdArr.push(this.countSelectClassTree[i].id)
        };
        this.addModalTeacher(cIdArr, !this.isGOonSetTeacher)
      },
      teacherCancel () { // 取消
        this.isGOonSetTeacher = false
        this.modalUnifiedSetTeacher = false
        this.selectTeacherTree = []
      },
      async addModalTeacher (cIdArr, close) {
        if (cIdArr.length === 0) {
          this.xy.msgError('请选择左侧班级。')
          return false
        };
        if (this.selectTeacherTree.length === 0) {
          this.xy.msgError('请选择右侧任课教师。')
          return false
        };

        var tIDList = []
        let tNameList = []
        let uNameList = []
        for (var i = 0; i < this.selectTeacherTree.length; i++) {
          tIDList.push(this.selectTeacherTree[i].UserID)
          tNameList.push(this.selectTeacherTree[i].title)
          uNameList.push(this.selectTeacherTree[i].userName)
        };
        console.log(tIDList, tNameList, uNameList)
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/EditSchoolBasedGrabSubjectSettingTeacherByIDList`, {
          ClassTableID: this.classTableID,
          CoursePlanLevelIdList: cIdArr,
          TeacherIDList: tIDList
        })
        if (res.success) {
          this.xy.msgSuc('集中设置任课教师成功。')
          if (close) {
            this.modalUnifiedSetTeacher = false
            this.isGOonSetTeacher = false
          } else { // 继续设置
            // this.getSettingClass()
            this.initTeacherTree = true
            this.selectTeacherFullName = tNameList.join(',')
            this.userNames = uNameList.join(',')
            setTimeout(() => {
              this.initTeacherTree = false
              this.selectTeacherFullName = ''
              this.userNames = ''
            }, 2000)
          }
          this.selectTeacherTree = []
          this.countSelectClassTree = []
          this.startSchoolBasedGrab()// 生成课表
        }
      },

      // 星期和节次排序
      sortDay (a, b) {
        return a.Day - b.Day
      },
      sortTime (a, b) {
        return a.Time - b.Time
      }

    }
  }
</script>
<style lang="less" scoped>
@import './css/takeLessonCommon.css';

.set-box .add-btn {
  color: #6392e9;
  font-size: 12px;
  padding: 3px 10px;
  cursor: pointer;
  width: 88px;
  height: 30px;
  background: rgba(236, 243, 255, 1);
  border: 1px solid rgba(99, 146, 233, 1);
  border-radius: 15px;
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
  background: rgba(236, 243, 255, 1);
  border: 1px solid rgba(99, 146, 233, 1);
  border-radius: 4px;
  font-size: 14px;
  color: rgba(99, 146, 233, 1);
}

.take-set-box .subject-name {
  font-size: 16px;
  font-weight: bold;
  color: #444;
}
.take-set-box .add-icon {
  color: #6392e9;
  font-size: 20px;
  cursor: pointer;
}
.take-set-box .block-nature {
  margin: 0 8px;
}
.take-set-box .block-name {
  margin-right: 4px;
}
.take-set-box .span-style {
  width: 160px;
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
}
.take-set-box .top {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.take-table {
  text-align: left;
  cursor: pointer;
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 14px;
  width: 100%;
  margin-bottom: 20px;
}

.take-table thead tr {
  border: 1px solid #e9e9e9;
  height: 40px;
  line-height: 40px;
}
.take-table thead th {
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
  padding-left: 10px;
  background: #fafafa;
}
.take-table tbody tr {
  border: 1px solid #e9e9e9;
  height: 58px;
  line-height: 58px;
}
.take-table tbody td {
  box-sizing: border-box;
  vertical-align: middle;
  padding-left: 10px;
}
.take-table .take-input {
  width: 160px;
}
// ------------------------------------
// 本页面
.set-box .left-tab {
  padding-top: 10px;
  border-right: 1px solid #d8d8d8;
  border-top: 1px solid #d8d8d8;
  min-width: 100px;
  margin: 0;
}
.set-box .right-content {
  padding-top: 10px;
  border-top: 1px solid #d8d8d8;
  width: calc(100% - 100px);
  padding-left: 10px;
}
.table {
  /*border: 1px solid #ddd;*/
  border: 1px solid rgba(245, 247, 250, 1);
  text-align: left;
  cursor: pointer;
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 14px;
  width: 100%;
}
.table thead th {
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  background-color: #f8f8f9;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-weight: normal;
  color: #606266;
  padding-left: 10px;
}
.table tbody td {
  height: 40px;
  box-sizing: border-box;
  vertical-align: middle;
  padding-left: 10px;
}

.table-time {
  border: 1px solid #ddd;
  text-align: center;
  cursor: pointer;
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 14px;
  width: 100%;
}
.table-time thead th {
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  background-color: #f8f8f9;
  font-weight: normal;
  color: #606266;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.table-time tbody td {
  height: 40px;
  box-sizing: border-box;
  vertical-align: middle;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

.filter-state {
  width: 100%;
  height: 28px;
  line-height: 28px;
  background-color: rgba(149, 181, 255, 0.24) !important;
  text-align: center;
  margin: 17px 0 22px;
  font-size: 12px;
  color: #666;
  border-radius: 5px;
  overflow: hidden;
  cursor: default;
  border: none;
}
.w-2 {
  width: 20%;
  border-bottom: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
}
.w-8 {
  width: 80%;
  border-left: 1px solid #e8eaec;
}
.crouse-ul {
  border: 1px solid #ddd;
  text-align: center;
  margin: 15px auto;
  border-collapse: collapse;
  font-size: 14px;
  width: 100%;
}
.crouse-ul i {
  font-size: 17px;
  color: #2d8cf0;
  cursor: pointer;
}
.crouse-ul > li {
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  text-align: center;
  text-overflow: ellipsis;
  vertical-align: middle;
  border-bottom: 1px solid #e8eaec;
  line-height: 40px;
}
.crouse-ul > li:last-child {
  height: 50px;
  line-height: 50px;
}
.crouse-ul .header-title {
  height: 40px;
  line-height: 40px;
  /*white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;*/
  background-color: #f8f8f9;
  box-sizing: border-box;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #e8eaec;
  font-weight: bold;
}
.w-5 {
  width: 5%;
}
.w-10 {
  width: 10%;
}
.crouse-ul li .span-td {
  width: 9%;
  display: inline-block;
  /*vertical-align: top;*/
}
.crouse-ul .time-span-td {
  width: 15%;
  display: inline-block;
  vertical-align: top;
}
.add-class {
  font-size: 16px;
  color: #2d8cf0;
  cursor: pointer;
}
.modal-crouse {
  max-height: 300px;
  overflow-y: scroll;
  padding: 10px 0;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.modal-crouse li {
  cursor: pointer;
  padding: 20px 0;
  color: #4285f4;
  border: 1px solid #d4e4ff;
  overflow: hidden;
  margin: 10px;
  border-radius: 8px;
  width: 110px;
  text-align: center;
}
.modal-crouse li:hover {
  color: #fff;
  background: #4285f4;
  text-align: center;
  color: #fff;
  transition: all 0.3s;
}
li.is-active {
  color: #fff;
  background: #4285f4;
  text-align: center;
  color: #fff;
  transition: all 0.3s;
}
.select-span {
  width: 160px;
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
}
.select-span i {
  margin-top: 8px;
}
.schedule-not-select {
  background: #eee;
}
.schedule-select {
  background: #2db7f5;
}
.iconfont.del {
  font-size: 22px;
  color: #1890ff;
  cursor: pointer;
  margin-right: 15px;
}
.iconfont.add {
  font-size: 24px;
  color: #1890ff;
  cursor: pointer;
}
.iconfont.view {
  font-size: 18px;
  color: #1890ff;
}
.iconfont.disable {
  color: #ccc;
  cursor: no-drop;
}
</style>
