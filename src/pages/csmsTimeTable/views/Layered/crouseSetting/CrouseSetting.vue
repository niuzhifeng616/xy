 <!--选课设置 -->
<template>
  <div class="xy-content-body">
    <div class="text-center left-tab">
      <p @click="loadPage"
         :class='changeTab?"active-li":"" '
         class="subjects">选课课程</p>
      <div class="subject-set">
        <p class="subject-rules"><span> 选课规则</span>
          <Icon type="ios-arrow-down" />
        </p>
        <ul class="subjects-ul"
            v-show='changeData==1'>
          <li v-for="(item,index) in liData"
              :class="item.isActive?'active-li':''"
              :key='index'>
            <span @click="ruleLi(item)">{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="right-content">
      <div v-if='changeTab'
           class="take-at-most text-center"
           style="margin-top:15px;">
        <span>本次选课最少选</span>
        <i-input style="width: 50px; margin: 0px 5px;"
                 v-model="selectCrouseData.minOptionalCourse"
                 @on-change="inputChange($event,0,0)" />
        <span>门， 最多选</span>
        <i-input style="width: 50px; margin: 0px 5px;"
                 v-model="selectCrouseData.maxOptionalCourse"
                 @on-change="inputChange($event,1,0)" />
        <span>门。</span>
      </div>
      <div v-if='changeTab'>
        <div class="take-course-subjcet"
             style="max-height:600px;overflow-y:auto">
          <div class="go-crouse-set-box set-box">
            <template v-if="selectCrouseData.models.length > 0">
              <div class="take-course-content"
                   v-for="(groupCrouse,index) in selectCrouseData.models"
                   :key='index'>
                <div class="clearfix content-header">
                  <div class="fl">
                    <i-input style="width: 100px; margin: 0px 5px;"
                             v-model="groupCrouse.SubjectGroupName"
                             @on-change="subjectGroupNameChange(groupCrouse.SubjectGroupName,index)" />
                    <span>本组应选：</span>
                    <span>最少</span>
                    <i-input style="width: 50px; margin: 0px 5px;"
                             v-model="groupCrouse.MinSubjectNum"
                             @on-change="inputChange($event,index,1,0)" />
                    <span>门，最多</span>
                    <i-input style="width: 50px; margin: 0px 5px;"
                             v-model="groupCrouse.MaxSubjectNum"
                             @on-change="inputChange($event,index,1,1)" />
                    <span>门。</span>

                  </div>
                  <div class="fr btn-color"
                       v-if="layeredStepsHeader.isOperation == 0">
                    <span v-if="groupCrouse.ChildrenModels.length>0"
                          @click="unityCreate(index)">统一创建分层</span>
                    <i v-if='groupCrouse.ChildrenModels.length>0'>|</i>
                    <span @click="delGroup(index,groupCrouse)">删除</span>
                  </div>
                </div>
                <div class="content-body"
                     v-if="groupCrouse.ChildrenModels.length>0">
                  <div class="body-tit"
                       v-for="(crouse,crouseIndex) in groupCrouse.ChildrenModels"
                       :key='crouseIndex'>
                    <div class="clearfix crouse-list">
                      <h3 class="fl">{{crouse.ThisName}}</h3>
                      <div class="fr btn-color"
                           v-if="layeredStepsHeader.isOperation == 0">
                        <span @click="creatCrouseModal(index,crouseIndex)">创建分层</span>
                        <i>|</i>
                        <span @click="delCrouse(index,crouseIndex,crouse,groupCrouse)">删除</span>
                      </div>
                    </div>
                    <ul class="crouse-children-list">
                      <li class="course-subjcet-layer"
                          v-for="(item,itemIndex) in crouse.Childrens"
                          :key='itemIndex'>
                        <span class="course-subjcet-layername">{{item.ThisName}}</span>
                        <span class="trash-span btn-color"
                              v-if="layeredStepsHeader.isOperation == 0">
                          <span @click="editorItem(index,crouseIndex,itemIndex,crouse.Childrens)">编辑</span>
                          <i>|</i>
                          <span @click="delItem(index,crouseIndex,itemIndex,item)">删除</span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="content-footer"
                     v-if="layeredStepsHeader.isOperation == 0">
                  <span @click="addCrouse(index)"
                        class="add-btn">
                    <span style="font-size:18px;">+</span>添加课程
                  </span>
                </div>
              </div>
            </template>

            <div class="take-course-footer"
                 v-if="layeredStepsHeader.isOperation == 0">
              <span class="add-btn"
                    @click="addGroup">
                <span style="font-size:18px;">+</span>添加分组
              </span>
            </div>
          </div>
        </div>

        <div class="fix-btn"
             v-if="selectCrouseData.models.length > 0"
             style="padding-top:10px;">
          <Button class="xy-btn-primary"
                  style="margin-bottom:10px;"
                  shape="circle"
                  @click="submitData"
                  :disabled="layeredStepsHeader.isOperation != 0">保存</Button>
        </div>
      </div>
      <component :is="settingComponent"
                 v-else></component>
    </div>
    <!-- 添加课程 -->
    <modal v-model="modalAddCrouse"
           title="添加课程"
           v-if="layeredStepsHeader.isOperation == 0"
           :mask-closable="false"
           width="670"
           :transfer="false">
      <div style="font-size:14px;">
        <div class="clearfix"
             style="padding-bottom:10px;">
          <i-input search
                   v-model.trim="searchCrouse"
                   @on-change='searchFun'
                   placeholder="按课程名称搜索"
                   class="fr xy-content-title-search"
                   style="width: auto;">
            <icon type="ios-search cursor-p"
                  slot="suffix" />
          </i-input>
          <i-select v-if="isSchoolCrouse"
                    v-model="schoolCrouseType"
                    @on-change="schoolCrouseTypeChange"
                    :label-in-value="true"
                    class="fr xy-content-title-search"
                    style="width:150px">
            <i-option :value="item.SubjectCategoryID"
                      :label="item.SubjectCategoryName"
                      v-for="(item,index) in subjectData.SubjectsCategoryChildren"
                      :key='index'>{{item.SubjectCategoryName}}</i-option>
          </i-select>
          <i-select v-model="crouseType"
                    @on-change="crouseTypeChange"
                    :label-in-value="true"
                    class="fr xy-content-title-search"
                    style="width:150px">
            <i-option :value="item.SubjectCategoryID"
                      :label="item.SubjectCategoryName"
                      v-for="(item,index) in subjectData.SubjectsCategory"
                      :key='index'>{{item.SubjectCategoryName}}</i-option>
          </i-select>
        </div>
        <div class="clearfix"
             v-if="isSchoolCrouse&&isHaveData">
          <checkbox v-model="checkAllSub"
                    size="large"
                    @on-change="checkAll"
                    class="fr"
                    style="padding-top:6px;">全选</checkbox>
        </div>
        <ul class="modal-crouses" v-if="forSubjectData.length>0&&isHaveData">
          <!-- :class 用于添加校本课程时的全选功能，不用于单个选择课程 -->
          <template v-for="(subject,index) in forSubjectData">
            <li :class="subject.isActive?'is-active':''"
                :title="subject.SubjectName"
                v-show="subject.SubjectName.indexOf(searchCrouse)!= -1"
                @click="crouseSelect(subject)"
                :key='index'>{{subject.SubjectName}}</li>
          </template>
        </ul>
        <div v-else-if='forSubjectData.length===0||!isHaveData' class="modal-null">
            <img class="img" src="@/assets/common/nullData.svg" alt="图片"/>
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
    </modal>

    <!-- 创建统一分层 -->
    <modal v-model="modalUnityCreate"
           :mask-closable="false"
           :transfer="false"
           v-if="layeredStepsHeader.isOperation == 0">
      <p slot="header"
         style="">统一创建分层</p>
      <div style="font-size:14px;max-height:300px;overflow-y:scroll;">
        <p style="padding-bottom: 10px;">输完一个分层名称后按回车键，再输入第二个分层名称并按回车键，依此类推。</p>
        <vue-tags-input v-model="tagAll"
                        :tags="tagsAll"
                        :validation="validation"
                        placeholder="请输入分层名称，按回车键确认。"
                        @tags-changed="newTagsAll"
                        :maxlength='maxlength' />
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancelUnityCreate">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitUnityCreate">确定</Button>
      </div>
    </modal>

    <!-- 创建分层 -->
    <modal v-model="modalCreatCrouse"
           :mask-closable="false"
           :transfer="false"
           width="535px"
           v-if="layeredStepsHeader.isOperation == 0">
      <p slot="header"
         style="">创建分层</p>
      <div style="font-size:14px;max-height:300px;overflow-y:scroll;">
        <p style="padding-bottom: 10px;">输完一个分层名称后按回车键，再输入第二个分层名称并按回车键，依此类推。</p>
        <vue-tags-input v-model="tag"
                        :tags="tags"
                        placeholder="请输入分层名称，按回车键确认。"
                        @tags-changed="newTags"
                        :maxlength='maxlength' />
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancelCreatCrouse">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submitCreatCrouse">确定</Button>
      </div>
    </modal>

    <!-- 删除课程 -->
    <modal v-model="modalDelCrouse"
           title="温馨提示"
           v-if="layeredStepsHeader.isOperation == 0"
           :mask-closable="false"
           @on-ok="delModelCreatCrouse">
      <div style="font-size:14px;max-height:300px;overflow-y:scroll;">
        <p style="margin-bottom:8px;">
          请输入“<span style="color:#ed4014;margin:0 2px;">删除</span>”来确认删除“<b style="margin:0 2px;">{{delCrouseName}}</b>”课。
        </p>
        <div>
          <i-input type="text"
                   v-model="delVal"
                   placeholder="请输入“删除”"></i-input>
        </div>
      </div>
    </modal>

    <!-- 编辑分层 -->
    <modal v-model="modalEditorName"
           :transfer="false"
           v-if="layeredStepsHeader.isOperation == 0"
           title="分层名称编辑"
           :mask-closable="false"
           :loading="loading">
      <div style="font-size:14px;">
        <div>
          <i-input type="text"
                   v-model="editorName"
                   placeholder="请输入分层名称"></i-input>
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="modalEditorName = false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="submintEditorName">确定</Button>
      </div>
    </modal>
  </div>
</template>

<script>
  import CrouseTime from './CrouseTime'
  import MutuallySetting from './MutuallySetting'
  import EvenSelected from './EvenSelected'
  import BanCroup from './BanCroup'
  import ElectivePermissions from './ElectivePermissions'
  import LimitNumber from './LimitNumber'
  import QualifiedMenWomen from './QualifiedMenWomen'
  import VueTagsInput from '@johmun/vue-tags-input'
  export default {
    components: { VueTagsInput, CrouseTime, MutuallySetting, EvenSelected, BanCroup, ElectivePermissions, LimitNumber, QualifiedMenWomen },
    data () {
      return {
        // 选课规则
        maxlength: 20,
        settingComponent: 'CrouseTime',
        liData: [
          {
            name: '选课时间',
            isActive: false,
            url: 'CrouseTime'
          },
          {
            name: '互斥设置',
            isActive: false,
            url: 'MutuallySetting'
          },
          {
            name: '连选设置',
            isActive: false,
            url: 'EvenSelected'
          },
          {
            name: '禁选组合',
            isActive: false,
            url: 'BanCroup'
          },
          {
            name: '选课权限',
            isActive: false,
            url: 'ElectivePermissions'
          },
          {
            name: '限选人数',
            isActive: false,
            url: 'LimitNumber'
          },
          {
            name: '限定男女',
            isActive: false,
            url: 'QualifiedMenWomen'
          }
        ],
        validation: [{
          classes: 'min-length',
          rule: tag => tag.text.length > 20,
          disableAdd: true
        }],
        changeTab: true,
        tag: '',
        tags: [],
        tagAll: '',
        tagsAll: [],
        selectCrouseData: {
          LayeredSelectProgrammeID: '',
          maxOptionalCourse: '',
          minOptionalCourse: '',
          models: []
        },
        collectionID: '',
        modalCreatCrouse: false,
        modalEditorName: false,
        modalUnityCreate: false,
        modalDelCrouse: false,
        UnityCrouseName: [],
        creatCrouseName: [],
        editorName: '',
        delVal: '',
        tag1: '',
        tag2: '',
        tag3: '',
        classTableName: '',
        isEqualSCID: '',
        delCrouseName: '',
        // editorItemData: {},
        courseChildrens: '', // 当前编辑的分层 所在课程下的所有分层
        loading: false,
        checkAllSub: false,
        // 添加课程
        modalAddCrouse: false,
        searchCrouse: '',
        isSchoolCrouse: false,
        schoolCrouseType: '',
        subjectData: [],
        forSubjectData: [], // 要循环显示的课程
        isHaveData: true,
        crouseType: '',
        layeredStepsHeader: {}
      }
    },
    computed: {
      changeData: function () {
        let lens = 0
        for (let i = 0; i < this.selectCrouseData.models.length; i++) {
          if (this.selectCrouseData.models[i].ChildrenModels.length > 0) {
            lens = 1
          };
        };
        return lens
      }
    },
    created: function () {
      //   this.classTableName = xy.param.getValues('classTableName')
      this.layeredStepsHeader = this.$parent
      this.getTP()
    },
    mounted: function () {
    },
    methods: {
      // 创建分层输入内容
      newTags: function (newTags) {
        this.tags = newTags
      },
      // 统一创建分层输入内容
      newTagsAll: function (newTagsAll) {
        this.tagsAll = newTagsAll
        newTagsAll.map((item) => {
          if (item.tiClasses.length > 1) {
            this.xy.msgError('分层名称限制20个字符。')
            return false
          }
        })
      },
      // 获取数据
      getTP: function () {
        let that = this
        this.xy.loading()
        this.xy.get(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/SettingList`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID
        }).then(res => {
          if (res.success) {
            let resData = res.data
            that.selectCrouseData.LayeredSelectProgrammeID = this.layeredStepsHeader.LayeredSelectProgrammeID
            that.selectCrouseData.maxOptionalCourse = resData.MaxOptionalCourse
            that.selectCrouseData.minOptionalCourse = resData.MinOptionalCourse

            if (resData.Result.length === 0) {
              that.selectCrouseData.models.push({
                LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
                SubjectGroupID: '',
                SubjectGroupName: '',
                SelectType: '0',
                MaxSubjectNum: '',
                MinSubjectNum: '',
                ChildrenModels: []
              })
              that.selectCrouseData.maxOptionalCourse = ''
              that.selectCrouseData.minOptionalCourse = ''
            } else {
              that.selectCrouseData.models = resData.Result
            }

            that.collectionID = resData.CollectionID
          } else {
            that.xy.msgError(res.msg)
          };
          this.xy.unloading()
        })
      },
      // 添加分组
      addGroup: function () {
        this.selectCrouseData.models.push({
          LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
          SubjectGroupID: '',
          SubjectGroupName: '',
          SelectType: '0',
          MaxSubjectNum: '',
          MinSubjectNum: '',
          ChildrenModels: []
        })
      },
      // 删除当前分组
      delGroup: function (index, groupCrouse) {
        let that = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '与该组内课程相关的选课结果和分班结果将一并删除。您确定要删除“' + groupCrouse.SubjectGroupName + '”吗？',
          onOk: function () {
            if (groupCrouse.SubjectGroupID) {
              that.xy.loading()
              that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/DeleteGroup`, {
                LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID,
                SubjectGroupID: groupCrouse.SubjectGroupID,
                ThisID: groupCrouse.ThisID
              }).then(res => {
                if (res.success) {
                  that.selectCrouseData.models.splice(index, 1)
                  that.getTP()
                  that.layeredStepsHeader.getGeneralFlows()// 成功后步骤可以点击
                } else {
                  that.xy.unloading()
                  that.xy.msgError(res.msg)
                };
              })
            } else {
              that.selectCrouseData.models.splice(index, 1)
            }
          }
        })
      },
      // 删除课
      delCrouse: function (index, crouseIndex, crouse, groupCrouse) {
        let that = this
        this.delCrouseName = crouse.ThisName
        // 暂时统一删除提示，取消判断。后期需求统一优化
        this.$Modal.confirm({
          title: '温馨提示',
          content: '与该课程相关的选课结果将一并删除。您确定要删除“' + crouse.ThisName + '”吗？',
          onOk: function () {
            that.selectCrouseData.models[index].ChildrenModels.splice(crouseIndex, 1)
            if (crouse.ThisID !== '') {
              // 取消判断后的删除start
              that.tag3 = ''
              that.tag3 = crouse
              let arr = []
              arr.push(that.tag3.ThisID)
              that.xy.loading()
              that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/DeleteSubject`, {
                LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID,
                SubjectGroupID: groupCrouse.SubjectGroupID || 0,
                ThisID: arr
              }).then(res => {
                if (res.success) {
                  that.xy.msgSuc('删除成功。')
                  that.layeredStepsHeader.getGeneralFlows()// 成功后步骤可以点击
                // that.getTP();
                }
                that.xy.unloading()
              })
            } else {
              that.xy.msgSuc('删除成功。')
            }

          // end
          }
        })
      },
      delModelCreatCrouse: function () {
        let that = this
        if (this.delVal === '删除') {
          let arr = []
          arr.push(that.tag3.ThisID)
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/DeleteSubject`, {
            LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
            SubjectGroupID: that.tag3.SubjectGroupID || 0,
            ThisID: arr
          }).then(res => {
            if (res.success) {
              that.modalDelCrouse = false
              that.xy.msgSuc('删除成功。')
              that.getTP()
            }
            that.xy.unloading()
          })
        } else {
          that.xy.msgError('你没有输入“删除”来确认清除。')
        }
      },
      // 删除层
      delItem: function (index, crouseIndex, itemIndex, item) {
        let that = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '与该层相关的选课结果和分班结果将一并删除。您确定要删除“' + item.ThisName + '”吗？',
          onOk: function () {
            if (item.ThisID !== '') {
              let arr = []
              arr.push(item.ThisID || 0)
              that.xy.loading()
              that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/DeleteLevel`, {
                LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID,
                SubjectGroupID: 0,
                ThisID: arr
              }).then(res => {
                if (res.success) {
                  that.xy.msgSuc('删除成功。')
                  that.selectCrouseData.models[index].ChildrenModels[crouseIndex].Childrens.splice(itemIndex, 1)
                  that.layeredStepsHeader.getGeneralFlows()// 成功后步骤可以点击
                // that.getTP();
                }
                that.xy.unloading()
              })
            // that.xy.unloading()
            } else {
              that.selectCrouseData.models[index].ChildrenModels[crouseIndex].Childrens.splice(itemIndex, 1)
            }
          }
        })
      },
      // 组名称修改
      subjectGroupNameChange: function (val, index) {
        if (val === '') {
          this.xy.msgError('组名称不能为空。')
        } else {
          this.selectCrouseData.models[index].SubjectGroupName = val
        }
      },
      // input值改变
      inputChange: function (event, a, b, c) {
        let targe = $(event.currentTarget)
        if (b === 0) {
          if (a === 0) {
            if (targe.val() > 99 || targe.val() < 0 || targe.val().indexOf('.') >= 0) {
              this.selectCrouseData.MinOptionalCourse = ''
            }
          } else {
            if (targe.val() > 99 || targe.val() < 0 || targe.val().indexOf('.') >= 0) {
              this.selectCrouseData.MaxOptionalCourse = ''
            }
          }
        } else {
          if (targe.val() > 99 || targe.val() < 0 || targe.val().indexOf('.') >= 0) {
            if (c === 0) {
              if (targe.val() > 99 || targe.val() < 0 || targe.val().indexOf('.') >= 0) {
                this.selectCrouseData.models[a].MinSubjectNum = ''
              }
            } else {
              if (targe.val() > 99 || targe.val() < 0 || targe.val().indexOf('.') >= 0) {
                this.selectCrouseData.models[a].MaxSubjectNum = ''
              }
            }
          }
        }
      },
      // 添加课程
      addCrouse: function (index) {
        this.tag1 = ''
        this.tag1 = index
        let that = this
        this.crouseType = ''
        this.searchCrouse = ''
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetCreateSubject`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID
        }).then(res => {
          if (res.success) {
            that.subjectData = res.data
            that.subjectData.SubjectsCategoryChildren.unshift({
              SubjectCategoryName: '所有子分类',
              SubjectCategoryID: 0
            })
            // 筛选出已经选过的学科  赵连东  2019/01/30 11:00
            for (let i = 0; i < that.selectCrouseData.models.length; i++) {
              for (let j = 0; j < that.selectCrouseData.models[i].ChildrenModels.length; j++) {
                let index = that.subjectData.Subjects.map(function (item) { return item.SubjectID }).indexOf(Number(that.selectCrouseData.models[i].ChildrenModels[j].SubjectID))
                if (index !== -1) {
                  that.subjectData.Subjects.splice(index, 1)
                }
              }
            }
            that.subjectData.Subjects.map(function (item) {
              that.$set(item, 'isActive', false)
              return item
            })
            if (res.data.SubjectsCategory.length > 0) {
              // that.crouseType = res.data.SubjectsCategory[0].SubjectCategoryID;
              that.crouseType = 1
              that.forSubjectData = that.subjectData.Subjects.filter(function (item) {
                if (item.SubjectCategoryID === that.crouseType) {
                  return item
                }
              })
            }
          }
          that.xy.unloading()
        })
        this.isSchoolCrouse = false
        this.schoolCrouseType = ''
        this.modalAddCrouse = true
        this.isHaveData = true
      },
      crouseSelect: function (val) { // 选课
        val.isActive = !val.isActive
      },
      searchFun () {
        if (this.forSubjectData.length > 0) {
          this.isHaveData = this.forSubjectData.some(item => {
            return item.SubjectName.indexOf(this.searchCrouse) > -1
          })
        }
      },
      crouseTypeChange: function (res) { // 选择课程方式
        if (res !== undefined) {
          let that = this
          this.searchCrouse = ''
          if (res.value !== 3) { // 不是校本课程
            this.isSchoolCrouse = false
            this.forSubjectData = []
            this.forSubjectData = this.subjectData.Subjects.filter(function (item) {
              if (item.SubjectCategoryID === that.crouseType) {
                return item
              }
            })
          } else { // 是校本课程
            this.schoolCrouseType = this.subjectData.SubjectsCategoryChildren[0].SubjectCategoryID
            this.forSubjectData = []
            this.forSubjectData = this.subjectData.Subjects.filter(function (item) {
              if (item.SubjectCategoryType === 3) {
                return item
              }
            })
            this.isSchoolCrouse = true
          }
          this.isHaveData = true
        }
      },
      schoolCrouseTypeChange: function (res) { // 校本子分类
        let that = this
        this.checkAllSub = false// 重置全选按钮
        this.searchCrouse = ''
        if (this.schoolCrouseType === 0) { // 所有子分类
          this.forSubjectData = []
          this.forSubjectData = this.subjectData.Subjects.filter(function (item) {
            if (item.SubjectCategoryType === 3) {
              return item
            }
          })
        } else {
          this.forSubjectData = []
          this.forSubjectData = this.subjectData.Subjects.filter(function (item) {
            if (item.SubjectCategoryID === that.schoolCrouseType) {
              return item
            }
          })
        }
        this.searchFun()
      },
      // 校本分类全选
      checkAll: function () {
        let that = this
        if (this.checkAllSub) {
          that.forSubjectData.map(function (item) {
            if (item.SubjectName.indexOf(that.searchCrouse) !== -1) {
              item.isActive = true
              return item
            }
          })
        } else {
          that.forSubjectData.map(function (item) {
            if (item.SubjectName.indexOf(that.searchCrouse) !== -1) {
              item.isActive = false
              return item
            }
          })
        }
      },
      addCrouseSubmit: function () { // 保存添加课程
        let isSelectCourse = false
        for (let i = 0; i < this.subjectData.Subjects.length; i++) {
          if (this.subjectData.Subjects[i].isActive) {
            isSelectCourse = true
            this.selectCrouseData.models[this.tag1].ChildrenModels.push({
              ThisName: this.subjectData.Subjects[i].SubjectName,
              SubjectID: this.subjectData.Subjects[i].SubjectID,
              ThisID: 0,
              Childrens: []
            })
          }
        }
        if (!isSelectCourse) {
          return this.xy.msgError('请选择课程。')
        }
        this.modalAddCrouse = false
      },
      addCrouseSearch: function () { // 添加课程搜索
      },
      // 全部保存
      submitData: function () {
        if (this.layeredStepsHeader.isOperation === 0) {
          let that = this
          let reg = /^([1-9]\d|\d)$/
          let maxOptionalCourse = $.trim(that.selectCrouseData.maxOptionalCourse)
          if (!reg.test(maxOptionalCourse)) {
            this.xy.msgError('本次选课最多门数只能输入0-99之间的整数。')
            return false
          }
          let minOptionalCourse = $.trim(that.selectCrouseData.minOptionalCourse)
          if (!reg.test(minOptionalCourse)) {
            this.xy.msgError('本次选课最少门数只能输入0-99之间的整数。')
            return false
          }
          if (Number(that.selectCrouseData.maxOptionalCourse) < Number(that.selectCrouseData.minOptionalCourse)) {
            this.xy.msgError('本次选课最多门数不能小于最少门数。')
            return false
          }
          let totalSubject = 0// 总共有多少门课程
          for (let i = 0; i < that.selectCrouseData.models.length; i++) {
            totalSubject += that.selectCrouseData.models[i].ChildrenModels.length
            if (that.selectCrouseData.models[i].SubjectGroupName === '') {
              this.xy.msgError('分组名称不能为空。')
              return false
            };
            let arr = that.selectCrouseData.models.filter(function (item) { return item.SubjectGroupName === that.selectCrouseData.models[i].SubjectGroupName }
            )
            if (arr.length > 1) {
              this.xy.msgError('分组名称不能相同。')
              return false
            };
            if (that.selectCrouseData.models[i].SubjectGroupName.length > 20) {
              this.xy.msgError('分组名称限制20字符。')
              return false
            };
            if (that.selectCrouseData.models[i].ChildrenModels.length === 0) {
              this.xy.msgError('请在“' + that.selectCrouseData.models[i].SubjectGroupName + '”中添加课程。')
              return false
            };
            if (that.selectCrouseData.models[i].SelectType === 0) {
              if (that.selectCrouseData.models[i].MaxSubjectNum === '' || that.selectCrouseData.models[i].MinSubjectNum === '') {
                this.xy.msgError(that.selectCrouseData.models[i].SubjectGroupName + '分组中最少（最多）门数不能为空。')
                return false
              }
              if (Number(that.selectCrouseData.models[i].MinSubjectNum) > Number(that.selectCrouseData.models[i].MaxSubjectNum)) {
                this.xy.msgError(that.selectCrouseData.models[i].SubjectGroupName + '分组中”最多门数“不能小于“最少门数”。')
                return false
              }
              // eslint-disable-next-line no-redeclare
              let reg = /^([1-9]\d|\d)$/
              let MinSubjectNum = $.trim(that.selectCrouseData.models[i].MinSubjectNum)
              if (!reg.test(MinSubjectNum)) {
                this.xy.msgError('分组选课最少门数只能输入0-99之间的整数。')
                return false
              }
              let MaxSubjectNum = $.trim(that.selectCrouseData.models[i].MaxSubjectNum)
              if (!reg.test(MaxSubjectNum)) {
                this.xy.msgError('分组选课最多门数只能输入0-99之间的整数。')
                return false
              }
              if (Number(that.selectCrouseData.models[i].MaxSubjectNum) > Number(that.selectCrouseData.models[i].ChildrenModels.length)) {
                this.xy.msgError(that.selectCrouseData.models[i].SubjectGroupName + '分组内最多选几门不能大于组内课程总数。')
                return false
              }
            }
          // if (that.selectCrouseData.models[i].SelectType == 1) {
          //    isSelectType++;
          //    if (isSelectType > 1) {
          //       this.xy.msgError( '选课课程只能有一个分组可以选择"所有课程"选项!');
          //        return false;
          //    }
          // };
          }
          if (Number(that.selectCrouseData.maxOptionalCourse) > totalSubject) {
            this.xy.msgError('本次选课最多选几门不能大于课程总数。')
            return false
          };
          that.selectCrouseData.models.map(item => {
            item.MaxSubjectNum = parseInt(item.MaxSubjectNum) || 0
            item.MinSubjectNum = parseInt(item.MinSubjectNum) || 0
            item.SelectType = parseInt(item.SelectType) || 0
            item.SubjectGroupID = parseInt(item.SubjectGroupID) || 0
            return item
          })
          that.selectCrouseData.maxOptionalCourse = parseInt(that.selectCrouseData.maxOptionalCourse)
          that.selectCrouseData.minOptionalCourse = parseInt(that.selectCrouseData.minOptionalCourse)
          this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/Create`, {
            LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
            MaxOptionalCourse: that.selectCrouseData.maxOptionalCourse,
            MinOptionalCourse: that.selectCrouseData.minOptionalCourse,
            Models: that.selectCrouseData.models
          }, true).then(res => {
            if (res.success) {
              that.xy.msgSuc('保存成功。')
              that.getTP()
              that.layeredStepsHeader.getGeneralFlows()// 成功后步骤可以点击
            } else {
              that.xy.msgError(res.msg)
            };
          })
        }
      },
      // 统一创建
      unityCreate: function (index) {
        let that = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '统一创建分层将会删除当前分组内所有课程中包含的层，您确定要统一创建分层吗？',
          onOk: function () {
            that.UnityCrouseName = []
            that.tag1 = ''
            that.tag1 = index
            that.tagAll = ''
            that.tagsAll = []
            that.modalUnityCreate = true
          }
        })
      },
      cancelUnityCreate: function () { // 取消统一创建
        this.UnityCrouseName = []
        this.tagsAll = []
        this.tagAll = ''
        this.modalUnityCreate = false
      },
      submitUnityCreate: function () {
        let that = this
        let tName = []
        for (let i = 0; i < that.tagsAll.length; i++) {
          tName.push(that.tagsAll[i].text)
        };
        let lengthArr = tName.filter(function (item) {
          if (item.length === 0 || item.length > 20) {
            return item
          }
        })
        if (lengthArr.length > 0) {
          this.xy.msgError('分层名称长度限制1-20字符。')
          return false
        }
        let arrThisID = []
        for (let j = 0; j < this.selectCrouseData.models[this.tag1].ChildrenModels.length; j++) {
          for (let m = 0; m < this.selectCrouseData.models[this.tag1].ChildrenModels[j].Childrens.length; m++) {
            arrThisID.push(this.selectCrouseData.models[this.tag1].ChildrenModels[j].Childrens[m].ThisID || 0)
          }
          this.selectCrouseData.models[this.tag1].ChildrenModels[j].Childrens = []
          for (let i = 0; i < tName.length; i++) {
            if (tName[i].length > 0 && tName[i].length <= 20) {
              this.selectCrouseData.models[this.tag1].ChildrenModels[j].Childrens.push({
                SubjectID: this.selectCrouseData.models[this.tag1].ChildrenModels[j].SubjectID,
                ThisID: 0,
                ThisName: tName[i],
                Childrens: []
              })
            }
          }
        };
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/DeleteLevel`, {
          LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
          SubjectGroupID: 0,
          ThisID: arrThisID
        }).then(res => {
          if (res.success) {
            that.xy.msgSuc('统一创建分层成功。')
            that.tagsAll = []
            that.modalUnityCreate = false
          };
          that.xy.unloading()
        })
      },
      // 创建分层
      creatCrouseModal: function (index, crouseIndex) {
        this.creatCrouseName = []
        this.tag = ''
        this.tags = []
        this.tag1 = ''
        this.tag2 = ''
        this.tag1 = index
        this.tag2 = crouseIndex
        this.modalCreatCrouse = true
      },
      cancelCreatCrouse: function () { // 取消
        this.creatCrouseName = []
        this.modalCreatCrouse = false
        this.tags = []
      },
      submitCreatCrouse: function () {
        let that = this
        let tName = []
        for (let i = 0; i < that.tags.length; i++) {
          tName.push((that.tags[i].text).trim())
        };
        let lengthArr = tName.filter(function (item) {
          if (item.length === 0 || item.length > 20) {
            return item
          }
        })
        if (lengthArr.length > 0) {
          this.xy.msgError('分层名称长度限制1-20字符。')
          return false
        }
        // eslint-disable-next-line no-redeclare
        for (let i = 0; i < tName.length; i++) {
          let isHave = this.selectCrouseData.models[this.tag1].ChildrenModels[this.tag2].Childrens.filter(function (item) {
            return item.ThisName === tName[i]
          })
          if (isHave.length > 0) {
            this.xy.msgError(this.selectCrouseData.models[this.tag1].ChildrenModels[this.tag2].ThisName + '课程下分层' + isHave[0].ThisName + '已存在。')
            return false
          }
          if (tName[i].length > 0 && tName[i].length <= 20) {
            this.selectCrouseData.models[this.tag1].ChildrenModels[this.tag2].Childrens.push({
              SubjectID: this.selectCrouseData.models[this.tag1].ChildrenModels[this.tag2].SubjectID,
              ThisID: 0,
              ThisName: tName[i],
              Childrens: []
            })
          }
        }
        this.modalCreatCrouse = false
        this.creatCrouseName = []
        this.tags = []
      },
      textEnter: function () {

      },
      // 分层名称编辑
      editorItem: function (index, crouseIndex, itemIndex, courseChildrens) {
        this.courseChildrens = courseChildrens
        this.tag1 = ''
        this.tag2 = ''
        this.tag3 = ''
        this.tag1 = index
        this.tag2 = crouseIndex
        this.tag3 = itemIndex
        this.editorName = this.selectCrouseData.models[index].ChildrenModels[crouseIndex].Childrens[itemIndex].ThisName
        this.modalEditorName = true
      },
      changeLoading: function () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      // 分层名称编辑保存
      submintEditorName: function () {
        let that = this
        if ($.trim(this.editorName).length > 20 || $.trim(this.editorName).length === 0) {
          this.xy.msgError('分层名称长度限制1-20字符。')
          return false
        }
        if (this.selectCrouseData.models[this.tag1].ChildrenModels[this.tag2].Childrens[this.tag3].ThisName !== this.editorName) {
          let haveArr = this.courseChildrens.filter(function (item) { return item.ThisName === that.editorName })
          if (haveArr.length > 0) {
            this.xy.msgError(this.selectCrouseData.models[this.tag1].ChildrenModels[this.tag2].ThisName + '课程下分层' + haveArr[0].ThisName + '已存在。')
            return false
          }
          this.selectCrouseData.models[this.tag1].ChildrenModels[this.tag2].Childrens[this.tag3].ThisName = this.editorName
        }
        this.modalEditorName = false
      },
      //
      loadPage: function () {
        this.changeTab = true
        this.liData.map(item => {
          item.isActive = false
          return item
        })
      },
      ruleLi: function (val) {
        let that = this
        this.changeTab = false
        if (!val.isActive) {
          this.liData.map(item => {
            item.isActive = false
            return item
          })
          val.isActive = true
          that.settingComponent = val.url
        }
      }
    }

  }
</script>
<style scoped lang='less'>
@import './courseSelectionSet.css';
@import '../../css/subjectRules.less';
.right-content {
  flex: 1;
  padding-left: 20px;
}
.btn-color {
  color: rgba(65, 150, 255, 1);
  span {
    cursor: pointer;
  }
  i {
    display: inline-block;
    margin: 0 10px;
    font-style: normal;
    cursor: default;
  }
}
.fix-btn {
  height: 50px;
  position: fixed;
  line-height: 50px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: right;
  button {
    margin-right: 20px;
  }
}
</style>
