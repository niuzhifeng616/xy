<template>
  <!-- 7.选课模式-分组模式 -->
  <div class="xy-content-body group-pattern">
    <Row class="">
        <i-col span="8">
            <Button class="xy-primary" @click="back">返回</Button>
        </i-col>
        <i-col span="8" class="text-center">
            <span>本次选课最少选</span>
            <Input size="small" v-model="MinOptionalCourse" number style="width: 50px" />
            <span>点， 最多选</span>
            <Input size="small" v-model="MaxOptionalCourse" number style="width: 50px"/>
            <span>点。</span>
        </i-col>
        <i-col span="8" class="text-right">
            <span>已放入组内{{ClassInGroupCount}}/{{ClassTotalCount}}个班</span>
        </i-col>
    </Row>
    <!-- 无子分类 -->
    <div v-for="(noGroup, noIndex) in ChildSubjectList" :key="noGroup.SubjectGroupID">
        <div class="top-group-header">
            <Row>
                <i-col span="12">
                    <label>组名</label>
                    <Input size="small" v-model="noGroup.SubjectGroupName" style="width: 100px"/>
                    <span>本组选课最少选</span>
                    <Input size="small" v-model="noGroup.MinSubjectNum" number style="width: 50px"/>
                    <span>点， 最多选</span>
                    <Input size="small" v-model="noGroup.MaxSubjectNum" number style="width: 50px"/>
                    <span>点</span>
                    <span>(共{{noGroup.SubjectList.length}}个班)。</span>
                </i-col>

                <i-col span="12" class="text-right" v-if="isOperation===0">
                    <Button type="primary" size="small" shape="circle" @click="setPoints(noGroup)" style="margin-right:5px;">统一设点数</Button>
                    <Button type="primary" size="small" shape="circle" ghost @click="groupToDelete(noGroup)"><Icon type="md-trash" />从组内删除</Button>
                </i-col>
            </Row>
            <i class="iconfont fr" v-if="isOperation===0" @click="delGroup(0,noIndex,noGroup)">&#xe6e1;</i>
        </div>
        <div class="group-box">
            <div class="group-body">
                <ul class="subject-ul" v-if="noGroup.SubjectList.length > 0">
                    <li>
                        <checkbox v-model="noGroup.checkAll" @on-change="checkAllChange(noGroup)">
                            <span class="f14">全选</span>
                        </checkbox>
                    </li>
                    <li v-for="subject in noGroup.SubjectList" :key="subject.SubjectID">
                        <checkbox v-model="subject.checkSubject" @on-change="checkOneChange(noGroup)">
                            <span class="f14 subject-name">{{subject.SubjectName}}</span>
                        </checkbox>
                        <div class="li-right">
                            <div class="nowrap" style="margin-right:20px;max-width:500px;">{{subject.TeacherNames}}</div>
                            <div>本门课</div>
                            <Input size="small" v-model="subject.SubjectScore" number style="width: 100px"/>
                            <div>点</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="group-footer" style="margin-top:10px;">
                <span @click="addCourse(noGroup)" class="add-btn" v-if="isOperation===0">
                    <span style="font-size:18px;">+</span>添加课程
                </span>
            </div>
        </div>
    </div>

    <div class="group-footer text-center" style="margin-top:15px;" v-if="isOperation===0">
        <span @click="addNoSubgroup" class="add-btn">
            <span style="font-size:18px;">+</span>添加无子组分组
        </span>
    </div>

    <!-- 分割线 -->
    <div class="divider-line"></div>

    <!-- 有子分类 -->
    <div class="have-group" v-for="(groupList,index) in ChildGroupList" :key="groupList.SubjectGroupID">
        <div class="group-header">
            <Row>
                <i-col span="18">
                    <label>组名</label>
                    <Input size="small" v-model="groupList.SubjectGroupName" style="width: 100px"/>
                    <span>本组选课最少选</span>
                    <Input size="small" v-model="groupList.MinSubjectNum" number style="width: 50px"/>
                    <span>点， 最多选</span>
                    <Input size="small" v-model="groupList.MaxSubjectNum" number style="width: 50px"/>
                    <span>点。</span>
                </i-col>
                <i-col span="6" class="text-center">

                    <!--<span>(共个班)</span>-->
                </i-col>
            </Row>
            <i class="iconfont fr" v-if="isOperation===0" @click="delGroup(1,index,groupList)">&#xe6e1;</i>
        </div>
        <div class="group-body" v-for="(group,childIndex) in groupList.ChildGroupList" :key="group.SubjectGroupID">
            <div class="group-header">
                <Row>
                    <i-col span="18">
                        <label>组名</label>
                        <Input size="small" v-model="group.SubjectGroupName" style="width: 100px"/>
                        <span>本子组选课最少选</span>
                        <Input size="small" v-model="group.MinSubjectNum" number style="width: 50px"/>
                        <span>点， 最多选</span>
                        <Input size="small" v-model="group.MaxSubjectNum" number style="width: 50px"/>
                        <span>点</span>
                        <span>(共{{group.SubjectList.length}}个班)。</span>
                    </i-col>
                    <i-col span="6" class="text-right" v-if="isOperation===0">
                        <Button type="primary" size="small" shape="circle" @click="setPoints(group)" style="margin-right:5px;">统一设点数</Button>
                        <Button type="primary" size="small" shape="circle" ghost @click="groupToDelete(group)"><Icon type="md-trash" />从组内删除</Button>
                    </i-col>
                </Row>
                <i class="iconfont fr" v-if="isOperation===0" @click="delChildGroup(index,childIndex,group)">&#xe6e1;</i>
            </div>
            <div style="padding:15px;" v-if="group.SubjectList.length > 0">
                <ul class="subject-ul">
                    <li>
                        <checkbox v-model="group.checkAll" @on-change="checkAllChange(group)">
                            <span class="f14">全选</span>
                        </checkbox>
                    </li>
                    <li v-for="subject in group.SubjectList" :key="subject.SubjectID">
                        <checkbox v-model="subject.checkSubject" @on-change="checkOneChange(group)">
                            <span class="f14 subject-name">{{subject.SubjectName}}</span>
                        </checkbox>
                        <div class="li-right">
                            <div class="nowrap" style="margin-right:20px;max-width:500px;">{{subject.TeacherNames}}</div>
                            <div>本门课</div>
                            <Input size="small" v-model="subject.SubjectScore" number style="width: 100px"/>
                            <div>点</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="group-footer" v-if="isOperation===0">
                <span @click="addCourse(group)" class="add-btn">
                    <span style="font-size:18px;">+</span>添加课程
                </span>
            </div>
        </div>
        <div class="group-footer" v-if="isOperation===0">
            <span @click="addChildGroup(groupList)" class="add-btn">
                <span style="font-size:18px;">+</span>添加子组
            </span>
        </div>
    </div>
    <div class="group-footer text-center" style="margin-top:15px;" v-if="isOperation===0">
        <span @click="addSubgroup" class="add-btn">
            <span style="font-size:18px;">+</span>添加有子组分组
        </span>
    </div>

    <div class="text-center" style="margin-top:20px;" v-if="isOperation===0">
        <Button class="xy-btn-primary" shape="circle" @click="submit">保存</Button>
    </div>

    <!--统一设点数 -->
    <Modal v-model="modalPoints"
           title="统一设点数"
           v-if="isOperation===0"
           :mask-closable="false"
           :closable="false"
           width="564"
           :transfer="false">
        <div style="font-size:14px;">
            <Input v-model="unifiedPoints" number/>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalPoints = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="submitPoints">保存</Button>
        </div>
    </Modal>
    <!--添加课程 -->
    <Modal v-model="modalCourse"
           title="添加课程"
           :mask-closable="false"
           :closable="false"
           width="1064"
           v-if="isOperation===0"
           :transfer="false">
        <div style="font-size:14px;height:500px;">
            <div class="clearfix" style="margin-bottom:10px;">
                <div class="fr pr">
                    <Select @on-change="getSubject"
                              v-model="selectSubjectCategoryID"
                              class="fl xy-content-title-search"
                              style="width:150px">
                        <Option :value="0" key="01">所有校本分类</Option>
                        <Option v-for="item in subjectCategoryData" :key="item.SubjectCategoryID" :value="item.SubjectCategoryID">{{ item.SubjectCategoryName }}</Option>
                    </Select>
                </div>
            </div>
            <div id="scrollTop" style="height:480px;overflow:auto;">
                <i-table :tooltip="true"
                         ref="selection"
                         :columns="columns"
                         :data="datatable"
                         @on-selection-change="changeSelect"
                         :no-data-text="'该搜索条件下没有结果。'"></i-table>
            </div>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalCourse = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="submitCourse">保存</Button>
        </div>
    </Modal>
</div>
</template>
<script>
  export default {
    name: 'TLSeleGroupingPattern',
    props: {
      isOperation: {
        type: Number,
        default: 0
      },
      classTableID: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        MaxOptionalCourse: 0,
        MinOptionalCourse: 0,
        ClassTotalCount: '', // 班级总数
        ClassInGroupCount: '', // 已放入组内班级数量
        ChildGroupList: [], // 有子分类
        ChildSubjectList: [], // 无子分类
        // 组内删除
        checkAllData: [],
        // 添加课程
        modalCourse: false,
        columns: [
          {
            type: 'selection', // 与标签<i-table>中属性ref值对应
            width: 60,
            align: 'center',
            key: 'ClassID'
          },
          {
            title: '校本分类',
            key: 'SubjectCategoryName'
          },
          {
            title: '课程名称',
            key: 'SubjectName'

          },
          {
            title: '班名',
            key: 'ClassName'

          },
          {
            title: '最大班额',
            key: 'StudentLimitation'

          },
          {
            title: '开课学段',
            key: 'ClassSectionSettingName'

          },
          {
            title: '上课时间',
            key: 'dayAmPmStr',
            width: 200
          },
          {
            title: '任课教师',
            key: 'TeacherNames',
            width: 200
          },
          {
            title: '上课教室',
            key: 'HouseName'
          }
        ],
        datatable: [], // table数据
        selectionAll: [],
        existSubject: [], // 当前页面已存在的课程
        selectGroup: '', // 添加的组
        selectSubjectCategoryID: 0,
        subjectCategoryData: [],
        // 统一设置点数
        modalPoints: false,
        unifiedPoints: '',
        pointsGroup: []
      }
    },
    created () {
    },
    mounted () {
      this.packageOnLineResultList()
    },
    methods: {
      // 获取列表数据
      async packageOnLineResultList () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/GetSchoolBasedGrabSubjectSettingGroupList`, {
          classTableID: this.classTableID
        })
        if (res.success) {
          var resData = res.data
          this.MaxOptionalCourse = resData.MaxOptionalCourse
          this.MinOptionalCourse = resData.MinOptionalCourse
          this.ClassTotalCount = resData.ClassTotalCount
          this.ClassInGroupCount = resData.ClassInGroupCount
          if (resData.list.ChildSubjectList.length === 0 && resData.list.ChildGroupList.length === 0) {
            this.ChildSubjectList.push({
              ClassTableID: this.classTableID,
              SubjectGroupID: 0,
              SubjectGroupName: '',
              MaxSubjectNum: 0,
              MinSubjectNum: 0,
              SubjectList: []
            })
            this.ChildGroupList.push({
              ClassTableID: this.classTableID,
              SubjectGroupID: 0,
              SubjectGroupName: '',
              MaxSubjectNum: 0,
              MinSubjectNum: 0,
              ChildGroupList: [{
                ClassTableID: this.classTableID,
                SubjectGroupID: 0,
                SubjectGroupName: '',
                MaxSubjectNum: 0,
                MinSubjectNum: 0,
                SubjectList: []
              }]
            })
          } else {
            this.ChildSubjectList = resData.list.ChildSubjectList
            this.ChildGroupList = resData.list.ChildGroupList
          }
        }
      },
      // 统一设置点数
      setPoints (Group) {
        this.pointsGroup = Group
        this.unifiedPoints = ''
        this.modalPoints = true
      },
      submitPoints () {
        // var reg1 = /^(0?\.[1-9]|[1-9][0-9]?)(\.[0-9]{1})?$/; //0.1-99.9
        var reg1 = /^[1-9][0-9]{0,1}$/ // 1-99
        if (!reg1.test(this.unifiedPoints)) {
          this.xy.msgError('本次选课最少选限1-99。')
          return false
        };
        for (var i = 0; i < this.pointsGroup.SubjectList.length; i++) {
          this.pointsGroup.SubjectList[i].SubjectScore = this.unifiedPoints
        };
        this.modalPoints = false
      },
      /* =======无子分类======== */
      // 添加课程
      addCourse (Group) {
        this.selectSubjectCategoryID = 0
        this.selectGroup = Group
        this.getGroupScList()
      },
      // 已经添加的校本分类
      async getGroupScList () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/GetSchoolBasedGrabSubjectSettingGroupCreateScList`, {
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.subjectCategoryData = res.data
          this.getSubject()
        }
      },
      // 分组添加课程数据
      async getSubject () {
        var _this = this
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/GetSchoolBasedGrabSubjectSettingGroupCreateList`, {
          classTableID: this.classTableID,
          subjectGroupID: _this.selectGroup.SubjectGroupID,
          subjectCategoryID: _this.selectSubjectCategoryID
        })
        this.xy.unloading()
        if (res.success) {
          _this.datatable = []
          var resData = res.data
          for (var i = 0; i < resData.length; i++) {
            var index = _this.existSubject.map((item) => { return item.CoursePlanLevelID }).indexOf(resData[i].CoursePlanLevelID)
            if (index === -1) {
              resData[i].ClassTableID = this.classTableID
              resData[i].SubjectScore = 0
              // resData[i].SubjectName = resData[i].SubjectName // + '-' + resData[i].ClassName;
              resData[i].TeacherNames = resData[i].TeacherNames.join(',')
              resData[i].dayAmPmStr = resData[i].dayAmPm.join(',')
              _this.datatable.push(resData[i])
            }
          }
          _this.modalCourse = true
          _this.$nextTick(() => {
            $('#scrollTop').scrollTop(0)
          })
        }
      },
      // 添加课程全选
      changeSelect (val) {
        this.selectionAll = val
      },
      // 保存添加的课程
      submitCourse () {
        if (this.selectionAll.length === 0) {
          this.xy.msgError('请选择课程。')
          return false
        }
        if (this.selectGroup.SubjectList.length > 0) {
          for (var i = 0; i < this.selectionAll.length; i++) {
            if (this.selectionAll[i].ClassSectionSettingAndOddWeek !== this.selectGroup.SubjectList[0].ClassSectionSettingAndOddWeek) { // 上课时间长度要一样
              this.xy.msgError('上课学段必须相同。')
              return false
            };
            if (Number(this.selectionAll[i].DayAmPmList.length) !== Number(this.selectGroup.SubjectList[0].DayAmPmList.length)) { // 上课时间长度要一样
              this.xy.msgError('上课时间必须相同。')
              return false
            };
            for (var j = 0; j < this.selectionAll[i].DayAmPmList.length; j++) {
              if (this.selectionAll[i].DayAmPmList[j].AMorPM !== this.selectGroup.SubjectList[0].DayAmPmList[j].AMorPM ||
                this.selectionAll[i].DayAmPmList[j].AMorPMOrder !== this.selectGroup.SubjectList[0].DayAmPmList[j].AMorPMOrder ||
                this.selectionAll[i].DayAmPmList[j].Day !== this.selectGroup.SubjectList[0].DayAmPmList[j].Day) {
                this.xy.msgError('上课时间必须相同。')
                return false
              }
            };
          };

          for (let i = 0; i < this.selectionAll.length; i++) {
            this.existSubject.push(this.selectionAll[i])// 添加当前已存在的课程
            this.selectionAll[i].SubjectName = this.selectionAll[i].SubjectName + '-' + this.selectionAll[i].ClassName
            this.selectionAll[i].checkSubject = false// 只是页面添加课程
            this.selectionAll[i].ClassID = 0
            this.selectGroup.SubjectList.push(this.selectionAll[i])
          };
        } else {
          for (var k = 0; k < this.selectionAll.length; k++) {
            if (this.selectionAll[k].ClassSectionSettingAndOddWeek !== this.selectionAll[0].ClassSectionSettingAndOddWeek) { // 上课时间长度要一样
              this.xy.msgError('上课学段必须相同。')
              return false
            };
            if (Number(this.selectionAll[k].DayAmPmList.length) !== Number(this.selectionAll[0].DayAmPmList.length)) { // 上课时间长度要一样
              this.xy.msgError('上课时间必须相同。')
              return false
            };
            for (var m = 0; m < this.selectionAll[k].DayAmPmList.length; m++) {
              if (this.selectionAll[k].DayAmPmList[m].AMorPM !== this.selectionAll[0].DayAmPmList[m].AMorPM ||
                this.selectionAll[k].DayAmPmList[m].AMorPMOrder !== this.selectionAll[0].DayAmPmList[m].AMorPMOrder ||
                this.selectionAll[k].DayAmPmList[m].Day !== this.selectionAll[0].DayAmPmList[m].Day) {
                this.xy.msgError('上课时间必须相同。')

                return false
              }
            }
          };
          for (let k = 0; k < this.selectionAll.length; k++) {
            this.existSubject.push(this.selectionAll[k])// 添加当前已存在的课程
            this.selectionAll[k].SubjectName = this.selectionAll[k].SubjectName + '-' + this.selectionAll[k].ClassName
            this.selectionAll[k].checkSubject = false// 只是页面添加课程
            this.selectionAll[k].ClassID = 0
            this.selectGroup.SubjectList.push(this.selectionAll[k])
          };
        }
        this.selectionAll = []// 勾选添加的课程置空
        this.modalCourse = false
      },
      // 添加无子组分组
      addNoSubgroup () {
        this.ChildSubjectList.push({
          ClassTableID: this.classTableID,
          SubjectGroupID: 0,
          SubjectGroupName: '',
          MaxSubjectNum: 0,
          MinSubjectNum: 0,
          SubjectList: []
        })
      },
      // 从组内删除
      groupToDelete (val) {
        var _this = this
        var delArrAll = []// 选择要删除的
        var delArrID = []// 数据库存在的
        for (var i = 0; i < val.SubjectList.length; i++) {
          if (val.SubjectList[i].checkSubject) {
            delArrAll.push(val.SubjectList[i])
            if (val.SubjectList[i].ClassID > 0) {
              delArrID.push(val.SubjectList[i].CoursePlanLevelID)
            }
          }
        };
        if (delArrAll.length > 0) {
          if (delArrID.length > 0) { // 数据库存在的
            _this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除所选的课程吗？',
              async onOk () {
                _this.xy.loading()
                let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/DeleteSchoolBasedGrabSubjectSettingGroupCourse`, {
                  ClassTableID: _this.classTableID,
                  SubjectGroupID: val.SubjectGroupID,
                  CoursePlanLevelIDList: delArrID
                })
                _this.xy.unloading()
                if (res.success) {
                  for (var i = 0; i < delArrAll.length; i++) {
                    var index = val.SubjectList.map((item) => { return item.CoursePlanLevelID })
                      .indexOf(delArrAll[i].CoursePlanLevelID)
                    if (index !== -1) {
                      val.SubjectList.splice(index, 1)
                    };
                    var index1 = _this.existSubject.map((item) => { return item.CoursePlanLevelID })
                      .indexOf(delArrAll[i].CoursePlanLevelID)
                    if (index1 !== -1) {
                      _this.existSubject.splice(index1, 1)
                    }
                  }
                  val.checkAll = false
                  _this.xy.msgSuc('删除成功。')
                }
              }
            })
          } else { // 数据库不存在的
            _this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除所选的课程吗？',
              onOk () {
                for (var i = 0; i < delArrAll.length; i++) {
                  var index = val.SubjectList.map((item) => { return item.CoursePlanLevelID })
                    .indexOf(delArrAll[i].CoursePlanLevelID)
                  if (index !== -1) {
                    val.SubjectList.splice(index, 1)
                  };
                  var index1 = _this.existSubject.map((item) => { return item.CoursePlanLevelID })
                    .indexOf(delArrAll[i].CoursePlanLevelID)
                  if (index1 !== -1) {
                    _this.existSubject.splice(index1, 1)
                  }
                }
                val.checkAll = false
                _this.xy.msgSuc('删除成功。')
              }
            })
          }
        } else {
          _this.xy.msgError('请勾选要从组内删除的课程。')
        }
      },
      // 删除分组
      delGroup (type, tag1, group) {
        var _this = this
        if (type === 0) { // 删除无子分类
          if (group.SubjectGroupID > 0) {
            _this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除吗？',
              async onOk () {
                _this.xy.loading()
                let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/DeleteSchoolBasedGrabSubjectSettingGroup`, {
                  ClassTableID: _this.classTableID,
                  SubjectGroupID: group.SubjectGroupID
                })
                _this.xy.unloading()
                if (res.success) {
                  _this.xy.msgSuc('删除成功。')
                  _this.$parent.$parent.getGeneralFlows()//
                  for (var i = 0; i < _this.ChildSubjectList[tag1].SubjectList.length; i++) { // 删除的时候把课程释放出去
                    var index = _this.existSubject.map((item) => { return item.CoursePlanLevelID })
                      .indexOf(_this.ChildSubjectList[tag1].SubjectList[i].CoursePlanLevelID)
                    if (index !== -1) {
                      _this.existSubject.splice(index, 1)
                    }
                  }
                  _this.ChildSubjectList.splice(tag1, 1)
                }
              }
            })
          } else {
            _this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除吗？',
              onOk () {
                for (var i = 0; i < _this.ChildSubjectList[tag1].SubjectList.length; i++) { // 删除的时候把课程释放出去
                  var index = _this.existSubject.map((item) => { return item.CoursePlanLevelID })
                    .indexOf(_this.ChildSubjectList[tag1].SubjectList[i].CoursePlanLevelID)
                  if (index !== -1) {
                    _this.existSubject.splice(index, 1)
                  };
                }
                _this.ChildSubjectList.splice(tag1, 1)
                _this.xy.msgSuc('删除成功。')
              }
            })
          }
        };
        if (type === 1) { // 删除有子分类
          if (group.SubjectGroupID > 0) {
            _this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除吗？',
              async onOk () {
                _this.xy.loading()
                let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/DeleteSchoolBasedGrabSubjectSettingGroup`, {
                  ClassTableID: _this.classTableID,
                  SubjectGroupID: group.SubjectGroupID
                })
                _this.xy.unloading()
                if (res.success) {
                  _this.xy.msgSuc('删除成功。')
                  _this.$parent.$parent.getGeneralFlows()//
                  for (var i = 0; i < _this.ChildGroupList[tag1].ChildGroupList.length; i++) { // 删除的时候把课程释放出去
                    for (var j = 0; j < _this.ChildGroupList[tag1].ChildGroupList[i].SubjectList.length; j++) {
                      var index = _this.existSubject.map((item) => { return item.CoursePlanLevelID })
                        .indexOf(_this.ChildGroupList[tag1].ChildGroupList[i].SubjectList[j].CoursePlanLevelID)
                      if (index !== -1) {
                        _this.existSubject.splice(index, 1)
                      }
                    }
                  };
                  _this.ChildGroupList.splice(tag1, 1)
                }
              }
            })
          } else {
            _this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除吗？',
              onOk () {
                for (var i = 0; i < _this.ChildGroupList[tag1].ChildGroupList.length; i++) { // 删除的时候把课程释放出去
                  for (var j = 0; j < _this.ChildGroupList[tag1].ChildGroupList[i].SubjectList.length; j++) {
                    var index = _this.existSubject.map((item) => { return item.CoursePlanLevelID })
                      .indexOf(_this.ChildGroupList[tag1].ChildGroupList[i].SubjectList[j].CoursePlanLevelID)
                    if (index !== -1) {
                      _this.existSubject.splice(index, 1)
                    }
                  }
                };
                _this.ChildGroupList.splice(tag1, 1)
                _this.xy.msgSuc('删除成功。')
              }
            })
          }
        };
      },
      // 选中或取消组内课程
      checkAllChange (val) {
        if (val.checkAll) {
          val.SubjectList.map((item) => {
            item.checkSubject = true
            return item
          })
        } else {
          val.SubjectList.map((item) => {
            item.checkSubject = false
            return item
          })
        }
      },
      checkOneChange (group) {
        var index = group.SubjectList.map((item) => { return item.checkSubject }).indexOf(false)
        if (index === -1) {
          group.checkAll = true
        } else {
          group.checkAll = false
        }
      },
      /* =======有子分类======== */
      // 删除子分组
      delChildGroup (tag1, tag2, group) {
        var _this = this
        if (group.SubjectGroupID > 0) {
          _this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除吗？',
            async onOk () {
              _this.xy.loading()
              let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/DeleteSchoolBasedGrabSubjectSettingGroup`, {
                ClassTableID: _this.classTableID,
                SubjectGroupID: group.SubjectGroupID
              })
              _this.xy.unloading()
              if (res.success) {
                _this.xy.msgSuc('删除成功。')
                _this.$parent.$parent.getGeneralFlows()//
                for (var i = 0; i < _this.ChildGroupList[tag1].ChildGroupList[tag2].SubjectList.length; i++) { // 删除的时候把课程释放出去
                  var index = _this.existSubject.map((item) => { return item.CoursePlanLevelID })
                    .indexOf(_this.ChildGroupList[tag1].ChildGroupList[tag2].SubjectList[i].CoursePlanLevelID)
                  if (index !== -1) {
                    _this.existSubject.splice(index, 1)
                  }
                }
                _this.ChildGroupList[tag1].ChildGroupList.splice(tag2, 1)
              }
            }
          })
        } else {
          _this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除吗？',
            onOk () {
              for (var i = 0; i < _this.ChildGroupList[tag1].ChildGroupList[tag2].SubjectList.length; i++) { // 删除的时候把课程释放出去
                var index = _this.existSubject.map((item) => { return item.CoursePlanLevelID })
                  .indexOf(_this.ChildGroupList[tag1].ChildGroupList[tag2].SubjectList[i].CoursePlanLevelID)
                if (index !== -1) {
                  _this.existSubject.splice(index, 1)
                }
              }
              _this.ChildGroupList[tag1].ChildGroupList.splice(tag2, 1)
              _this.xy.msgSuc('删除成功。')
            }
          })
        }
      },
      // 添加有子分组
      addSubgroup () {
        this.ChildGroupList.push({
          ClassTableID: this.classTableID,
          SubjectGroupID: 0,
          SubjectGroupName: '',
          MaxSubjectNum: 0,
          MinSubjectNum: 0,
          ChildGroupList: [{
            ClassTableID: this.classTableID,
            SubjectGroupID: 0,
            SubjectGroupName: '',
            MaxSubjectNum: 0,
            MinSubjectNum: 0,
            SubjectList: []
          }]
        })
      },
      // 添加子分组的子分组
      addChildGroup (groupList) {
        groupList.ChildGroupList.push({
          ClassTableID: this.classTableID,
          SubjectGroupID: 0,
          SubjectGroupName: '',
          MaxSubjectNum: 0,
          MinSubjectNum: 0,
          SubjectList: []
        })
      },

      // 保存
      async submit () {
        var reg = /^([1-9]\d|\d)$/ // 0-99
        var reg1 = /^[1-9][0-9]{0,1}$/ // 1-99
        if (this.ChildSubjectList.length === 0 && this.ChildGroupList.length === 0) {
          this.xy.msgError('请添加组。')
          return false
        };
        if (!reg.test(this.MinOptionalCourse)) {
          this.xy.msgError('本次选课最少选限0-99之间的整数。')
          return false
        };
        if (!reg.test(this.MaxOptionalCourse)) {
          this.xy.msgError('本次选课最多选限0-99之间的整数。')
          return false
        };
        if (this.MaxOptionalCourse < this.MinOptionalCourse) {
          this.xy.msgError('本次选课最多点数不能小于最少点数。')
          return false
        };
        var max = 0
        var min = 0
        for (var i = 0; i < this.ChildSubjectList.length; i++) { // 无子组
          if (!reg.test(this.ChildSubjectList[i].MinSubjectNum)) {
            this.xy.msgError(this.ChildSubjectList[i].SubjectGroupName + '组选课最少选限0-99之间的整数。')
            return false
          };
          if (!reg.test(this.ChildSubjectList[i].MaxSubjectNum)) {
            this.xy.msgError(this.ChildSubjectList[i].SubjectGroupName + '组选课最多选限0-99之间的整数。')
            return false
          };
          if (this.ChildSubjectList[i].SubjectGroupName === '' || this.ChildSubjectList[i].SubjectGroupName === null) {
            this.xy.msgError('组名称不能为空。')
            return false
          };
          if (this.ChildSubjectList[i].SubjectGroupName.length > 20) {
            this.xy.msgError('组名称最多允许输入20个字符长度。')
            return false
          };
          if (this.ChildSubjectList[i].MaxSubjectNum < this.ChildSubjectList[i].MinSubjectNum) {
            this.xy.msgError(this.ChildSubjectList[i].SubjectGroupName + '的最大点数不能小于最少点数。')
            return false
          };
          max = max + this.ChildSubjectList[i].MaxSubjectNum
          min = min + this.ChildSubjectList[i].MinSubjectNum
          // var hasArr = this.ChildSubjectList.filter((item) => { return item.SubjectGroupName === _this.ChildSubjectList[i].SubjectGroupName });
          // if (hasArr.length > 1) {
          //    this.xy.msgError(this, this.ChildSubjectList[i].SubjectGroupName + '组名称重复。');
          //    return false;
          // };
          if (this.ChildSubjectList[i].SubjectList.length === 0) {
            this.xy.msgError('请给组添加课程。')
            return false
          };
          for (var m = 0; m < this.ChildSubjectList[i].SubjectList.length; m++) {
            if (!reg1.test(this.ChildSubjectList[i].SubjectList[m].SubjectScore)) {
              this.xy.msgError(this.ChildSubjectList[i].SubjectList[m].SubjectName + '的点数限1-99之间的整数。')
              return false
            }
          };
        };
        for (var j = 0; j < this.ChildGroupList.length; j++) { // 有子组
          var maxNum = 0
          var minNum = 0
          if (this.ChildGroupList[j].SubjectGroupName === '' || this.ChildGroupList[j].SubjectGroupName === null) {
            this.xy.msgError('组名称不能为空。')
            return false
          };
          if (this.ChildGroupList[j].SubjectGroupName.length > 20) {
            this.xy.msgError(this.ChildGroupList[j].SubjectGroupName + '组名称最多允许输入20个字符长度。')
            return false
          };
          if (!reg.test(this.ChildGroupList[j].MinSubjectNum)) {
            this.xy.msgError(this.ChildGroupList[j].SubjectGroupName + '组选课最少选限0-99之间的整数。')
            return false
          };
          if (!reg.test(this.ChildGroupList[j].MaxSubjectNum)) {
            this.xy.msgError(this.ChildGroupList[j].SubjectGroupName + '组选课最多选限0-99之间的整数。')
            return false
          };
          if (this.ChildGroupList[j].MaxSubjectNum < this.ChildGroupList[j].MinSubjectNum) {
            this.xy.msgError(this.ChildGroupList[j].SubjectGroupName + '的最大点数不能小于最少点数。')
            return false
          };
          max = max + this.ChildGroupList[j].MaxSubjectNum
          min = min + this.ChildGroupList[j].MinSubjectNum
          if (this.ChildGroupList[j].ChildGroupList.length === 0) {
            this.xy.msgError('请给组添加子组以及子组添加课程。')
            return false
          };
          for (var k = 0; k < this.ChildGroupList[j].ChildGroupList.length; k++) {
            if (this.ChildGroupList[j].ChildGroupList[k].SubjectGroupName === '' ||
              this.ChildGroupList[j].ChildGroupList[k].SubjectGroupName === null) {
              this.xy.msgError('组名称不能为空。')
              return false
            };
            if (this.ChildGroupList[j].ChildGroupList[k].SubjectGroupName.length > 20) {
              this.xy.msgError(this.ChildGroupList[j].ChildGroupList[k].SubjectGroupName + '组名称最多允许输入20个字符长度。')
              return false
            };
            if (!reg.test(this.ChildGroupList[j].ChildGroupList[k].MinSubjectNum)) {
              this.xy.msgError(this.ChildGroupList[j].ChildGroupList[k].SubjectGroupName + '组选课最少选限0-99之间的整数。')
              return false
            };
            if (!reg.test(this.ChildGroupList[j].ChildGroupList[k].MaxSubjectNum)) {
              this.xy.msgError(this.ChildGroupList[j].ChildGroupList[k].SubjectGroupName + '组选课最多选限0-99之间的整数。')
              return false
            };
            if (this.ChildGroupList[j].ChildGroupList[k].MinSubjectNum > this.ChildGroupList[j].ChildGroupList[k].MaxSubjectNum) {
              this.xy.msgError(this.ChildGroupList[j].ChildGroupList[k].SubjectGroupName + '的最少点数不能大于最多点数。')
              return false
            };
            if (this.ChildGroupList[j].ChildGroupList[k].SubjectList.length === 0) {
              this.xy.msgError('请给子组添加课程。')
              return false
            };
            for (var n = 0; n < this.ChildGroupList[j].ChildGroupList[k].SubjectList.length; n++) {
              if (!reg1.test(this.ChildGroupList[j].ChildGroupList[k].SubjectList[n].SubjectScore)) {
                this.xy.msgError(this.ChildGroupList[j].ChildGroupList[k].SubjectList[n].SubjectName + '的点数限1-99之间的整数。')
                return false
              }
            };
            maxNum = maxNum + this.ChildGroupList[j].ChildGroupList[k].MaxSubjectNum
            minNum = minNum + this.ChildGroupList[j].ChildGroupList[k].MinSubjectNum
            if (k + 1 === this.ChildGroupList[j].ChildGroupList.length) { // 有子组的最后一次子组循环
              if (this.ChildGroupList[j].MinSubjectNum > maxNum) {
                this.xy.msgError(this.ChildGroupList[j].SubjectGroupName + '组的最少点数不能大于该组下所有子组最多点数的和。')
                return false
              };
              if (this.ChildGroupList[j].MaxSubjectNum < minNum) {
                this.xy.msgError(this.ChildGroupList[j].SubjectGroupName + '组的最多点数不能小于该组下所有子组最少点数的和。')
                return false
              };
            }
          };
        };
        if (this.MinOptionalCourse > max) {
          this.xy.msgError('本次选课最少点数不能大于所有子组最多点数的和。')
          return false
        };
        if (this.MaxOptionalCourse < min) {
          this.xy.msgError('本次选课最多点数不能小于所有子组最少点数的和。')
          return false
        };
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SchoolBasedGrabSubjectSetting/CreateGroup`, {
          ClassTableID: this.classTableID,
          MinOptionalCourse: this.MinOptionalCourse,
          MaxOptionalCourse: this.MaxOptionalCourse,
          ChildGroupList: this.ChildGroupList,
          ChildSubjectList: this.ChildSubjectList
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          this.$parent.$parent.getGeneralFlows()//
          this.packageOnLineResultList()
        }
      },
      back () {
        this.$emit('closeGroupPattern')
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/selectionType.css';
  .group-pattern .iconfont{
    color: #4196ff;
    position: absolute;
    right: 10px;
    top: 0;
    cursor: pointer;
  }
  .group-pattern .ivu-input-wrapper{
    margin: 0 5px;
  }
</style>
