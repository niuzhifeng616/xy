<!-- 11.排自习-->
<template>
  <div class="xy-content-body">

    <div class="row-self-study" v-if="resultData.length>0">
        <div class="self-btn-group">
            <Button class="xy-primary" @click="AutomaticallySet" :disabled="isOperation1 !== 0">自动排自习</Button>
            <Button class="xy-info" @click="setTeacher" :disabled="isOperation1 !== 0" style="margin:0 14px;">集中设教师</Button>
            <Button class="xy-danger" @click="restore" :disabled="isOperation1 !== 0">恢复已删课节</Button>
            <Alert show-icon style="margin-left:30px;">如果某节课无需排自习，请点击该节课右上角的“删除”。</Alert>
        </div>
        <div class="self-box" v-for="(result,index) in resultData" :key="result.Weeks">
            <div class="box-header">
                <div class="week-section">{{result.Weeks}} </div>
                <div class="del-icon" @click="delResult(result)" :class="isOperation1 !== 0?'del-icon-disabled':''">
                    <Icon type="ios-trash-outline" size="18" />
                    <span>删除</span>
                </div>
            </div>
            <p style="color:#999999;margin:10px 0;">待排学生:{{result.WaitStudentCount}}</p>
            <ul class="box-ul" v-if="result">
                <li v-for="student in result.Students" :key="student.ClassID" v-show="student">
                    <div>
                        <Input style="width: 200px;"
                                v-model="student.ClassName"
                                @on-focus="student.isEditor = false" />
                        <Button type="primary" ghost
                                style="margin:0 8px"
                                :disabled="isOperation1 !== 0"
                                @click="postClassName(student.ClassName,student.ClassID)">保存班名</Button>
                    </div>
                    <div>
                        <span class="span-select">
                            已排学生：{{student.StudentCount}}人
                        </span>
                        <Button type="primary" ghost
                                style="margin:0 8px"
                                @click="loadPage(student)">添加学生</Button>
                    </div>
                    <div class="pr">
                        <!-- <poptip trigger="hover" word-wrap
                                width="300"
                                :disabled="!student.TeacherName"
                                style="height:30px;line-height:30px;vertical-align:middle"
                                title="已添加的教师"
                                :content="student.TeacherName?student.TeacherName:'请先添加教师'"> -->
                            <span class="span-select" @click="collapseMustShow(student)">
                                <span v-if="student.TeacherName">
                                    {{student.TeacherName}}
                                </span>
                                <span v-if="!student.TeacherName" style="color:#999">未设置教师</span>
                            </span>
                        <!-- </poptip> -->
                        <!-- <collapse class="course-setting-collapse pa"
                                  style="top:35px;width: 200px;"
                                  value="1"
                                  v-if="student.collapse&&isOperation1 === 0">
                            <panel name="1">
                                已添加的教师
                                <div slot="content" style="line-height:22px;">
                                    <tag v-if="student.TeacherName"
                                        closable
                                        @on-close="delTeacher(student)">{{student.TeacherName}}</tag>
                                    <span v-if="!student.TeacherName" style="color:#999">请先添加教师</span>
                                </div>
                            </panel>
                        </collapse> -->
                        <Button type="primary" ghost
                                style="margin:0 8px"
                                :disabled="isOperation1 !== 0"
                                @click="openAddTeacherModal(student)">设置教师</Button>
                    </div>
                    <div class="del-icon" @click="del(student)" :class="isOperation1 !== 0?'del-icon-disabled':''">
                        <Icon type="ios-trash-outline" size="18" />
                        <span>删除</span>
                    </div>
                </li>
            </ul>
            <div class="add-icon" v-if="isOperation1 === 0">
                <span @click="addClass(index)">添加班级</span>
            </div>
        </div>
    </div>
    <div v-if="resultData.length===0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">
            该方案下没有排自习的信息。
        </span>
    </div>

    <!--添加教师 -->
    <!-- <SelectTeacherOrg
        :isShow="isShow"
        :isMustChoose="isMustChoose"
        :selectMembers="selectedTeachers"
        @select-cancel="selectCancel"
        @select-confirm="selectConfirm">
    </SelectTeacherOrg> -->
    <a-modal title="选择教师"
              width='50%'
              :maskClosable="false"
              :visible="isShow"
              @cancel="selectCancel"
              :confirm-loading="confirmLoading">

      <a-row class="xy-flex" v-show='!modalLoading'>

        <div class="left">
          <div class='input-box'>
            <a-input-search v-model.trim="keyWord1" placeholder="请输入用户名/工号/姓名" allowClear @search='searchFun1' />
          </div>
          <a-tree show-icon
                  :tree-data="newList"
                  checkable
                  :checked-keys='curNode'
                  @check="onCheck"
                  @expand="onExpand1"
                  :expanded-keys="expandedKeys1"
                  :auto-expand-parent="autoExpandParent1"
                  :selectable='false'
                  blockNode
                  v-if="newList.length && !treeLoading"><!-- :checked-keys选中复选框的树节点 --><!-- :expanded-keys展开指定的树节点 -->
            <img v-if='node.image' :src="node.image" class="head-icon" slot-scope="node" slot="icon" />
            <span v-else class="head-icon" :class="!node.sex?'woman':''" slot="icon" slot-scope="node">{{xy.showName(node.title)}}</span>
            <template slot="title" slot-scope="node">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ node.title}}</span>
                </template>
                <span>{{ node.title.length>20?node.title.substr(0,20)+'...':node.title }}</span>
              </a-tooltip>
            </template>
            <template slot="teaName" slot-scope="node">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ node.userName}}</span>
                </template>
                <span> {{ node.title.length>20?node.title.substr(0,20)+'...':node.title }}</span>
              </a-tooltip>
            </template>
          </a-tree>
          <div class="loading-tree" v-if="treeLoading">
            <a-spin tip="加载中" />
          </div>
          <div class="nodata" v-show="!newList.length && !modalLoading && !treeLoading">未搜索到相关结果。</div>
        </div>

        <div class="right">
          <div class="count-room" v-show='checkAllList.length'>已选:{{checkAllList.length}}人</div>
          <div class="nodata right-tip" v-show='!checkAllList.length && !modalLoading'>您还未选择任何教师，请选择教师。</div>
          <div class="room-overflow" v-if='checkAllList.length>0'>
            <div v-for='item in checkAllList' :key='item.id' class="room">
              <div>
                <img v-if='item.image' :src="item.image" class="head-icon">
                <span v-else class="head-icon" :class="!item.sex?'woman':''">{{xy.showName(item.title)}}</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ item.userName}}</span>
                  </template>
                  <span class="tag"> {{item.title.length>20?item.title.substr(0,20)+'...':item.title}}</span>
                </a-tooltip>
              </div>
              <i class="iconfont del-btn" @click="delFun(item)">&#xe6f3;</i>
            </div>
          </div>
        </div>

      </a-row>

      <div class="loading-box" v-if="modalLoading">
        <a-spin tip="加载中" />
      </div>

      <div slot='footer'>
        <Button class='xy-modal-close'
                @click='selectCancel'>取消</Button>
        <Button class='xy-modal-primary'
                shape='circle'
                @click='selectConfirm'>确定</Button>
      </div>
    </a-modal>
    <!--自动排自习 -->
    <modal v-model="modalAutomaticallySet"
            :transfer="false"
            :mask-closable="false"
          >
        <p slot="header">自动排自习</p>
        <div>
            <div class="f14" style="margin-bottom:5px;">请输入每班上限人数:</div>
            <i-input v-model="automaticallyNum" placeholder="请输入每班上限人数"></i-input>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalAutomaticallySet = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="startSet">确定</Button>
        </div>
    </modal>

    <!-- 集中设置教师 -->
    <a-modal :visible="modalUnifiedSetTeacher"
            :maskClosable="false"
            width="50%"
            title="集中设置教师"
            @cancel="modalUnifiedSetTeacher = false"
            :confirm-loading="confirmLoading">
        <div style="font-size:14px;position: relative;">
            <alert style="display:inline-block;">姓名后加“优先”的教师指在本排课方案中任课的教师</alert>
            <row>
                <i-col span="12">
                    <div id="tree1" style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
                      <ul v-if="lessonsData.length > 0">
                          <li v-for="lesson in lessonsData" :key="lesson.Weeks">
                              <h2 class="f14">{{lesson.Weeks}}</h2>
                              <radio v-model="item.isCheck"
                                    v-for="item in lesson.Students"
                                    :key="item.ClassName"
                                    @on-change="lessonChange(item,lesson)"
                                    class="f14"
                                    style="display:block;margin:5px 8px">
                                <Tooltip max-width="200"  placement="bottom" >
                                    <span v-if="item.TeacherName">
                                      <span v-if="item.ClassName.length+item.TeacherName.length>29">
                                        <span>{{item.ClassName}}</span>
                                        <img src="@/assets/csmsTimeTable/exchange.png" alt="" class="exchange">
                                        <span>{{item.TeacherName.slice(item.ClassName.length,30)}}...</span>
                                      </span>
                                      <span v-else>
                                        <span>{{item.ClassName}}</span>
                                        <img src="@/assets/csmsTimeTable/exchange.png" alt="" class="exchange">
                                        <span>{{item.TeacherName}}</span>
                                      </span>
                                    </span>
                                    <span v-if="!item.TeacherName">
                                      {{item.ClassName.length>29?item.ClassName.slice(0,30)+'...':item.ClassName}}
                                    </span>
                                  <div slot='content' style="white-space: normal">
                                    <span v-if="item.TeacherName">
                                      <span>{{item.ClassName}}</span>
                                      <img src="@/assets/csmsTimeTable/exchange.png" alt="" class="exchange">
                                      <span>{{item.UserName}}</span>
                                    </span>
                                    <span v-if="!item.TeacherName">
                                      {{item.ClassName}}
                                    </span>
                                  </div>
                                </Tooltip>
                              </radio>
                          </li>
                      </ul>
                    </div>
                </i-col>
                <i-col span="12">
                    <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
                      <a-input-search placeholder="请输入用户名/工号/姓名"
                        style="margin-bottom:8px"
                        allowClear
                        v-model="keyWord"
                        @search='searchFun' />
                      <a-tree show-icon
                          v-if="teacherTree.length"
                          :tree-data="teacherTree"
                          :selected-keys="defaultSelectedKeys"
                          @select="teacherSelect"
                          @expand="onExpand"
                          :expanded-keys="expandedKeys"
                          :auto-expand-parent="autoExpandParent"
                          blockNode>
                        <template slot="titleName" slot-scope="node">
                          <a-tooltip placement="top">
                            <template slot="title">
                              <span>{{node.UserName||node.title}}</span>
                            </template>
                            <span> {{ node.title.length>20?node.title.substr(0,20)+'...':node.title }}</span>
                          </a-tooltip>
                        </template>
                      </a-tree>
                      <div v-else class="nodata">{{treeEmptyText}}</div>
                      <!-- <tree :empty-text='treeEmptyText' :data="teacherTree" @on-select-change="teacherSelect" ref="teacherTreeRef"></tree> -->
                    </div>
                </i-col>
            </row>
        </div>
        <div slot="footer">
            <Checkbox v-model="isGOonSetTeacher" class="fl" style="line-height: 36px;">继续设置下一项</Checkbox>
            <Button class="xy-modal-close" @click="modalUnifiedSetTeacher = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="submitUnifiedSetTeacher">保存</Button>
        </div>
    </a-modal>

</div>
</template>
<script>
  // import SelectTeacherOrg from '@/pages/csmsTimeTable/components/selectTeacher/CheckboxSelectTeacher.vue'
  export default {
    components: {
      // SelectTeacherOrg
    },
    name: 'RowSelfStudy',
    data () {
      return {
        isOperation1: this.$store.state.csmstimetable.classComValKW.base.isOperation1,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        // 添加教师
        isShow: false,
        selectedTeachers: [],
        isMustChoose: false,
        newList: [],
        copyDataList: [], // 避免操作污染数据源，缓存初始化数据源
        expandedKeys1: [],
        copyExpandedKeys1: [],
        isHaveVal: false, // 输入框的value是否为真
        autoExpandParent1: true,
        keyWord1: '', // 搜索的关键字

        // 弹窗
        modalLoading: false,
        confirmLoading: false,
        curNode: [], // 左侧选中的教师唯一id(arr)（不包含搜索时已选中但是未展示的已选中数据）
        checkedValue: [], // 缓存的左侧被选中的教师对象（arr）（包含搜索时已选中但是未展示的已选中数据）

        // 右侧选中的教师
        selectTeacherIds: [], // 外部组件传入的教师UserId（这里需要注意的是，传入对象数组，对象中必须包含id[用户的id]）
        selectedPartIds: [], // 部分反选的id数组
        checkAllList: [], // 右侧已选显示数据, tree需要反选时需要加入外部传入的数据->selectTeacherIds。
        rightSta: false, // 是否是右侧删除（true）
        treeLoading: false, // 为了解决卡顿，添加loading动画状态控制
        include: [], // 在右侧点击教师删除时，此教师对应的左侧tree上所有不同组织的相同教师的唯一id的集合
        //= ===添加教师 end===
        ruleOutTeacher: '', // 设置教师需要去重的
        modalAddCrouse: false,
        sloverResultCollectionID: 0,
        cascaderValue: '',
        tag1: '',
        tag2: '',
        resultData: [],
        // 自动排自习
        modalAutomaticallySet: false,
        automaticallyNum: '',
        // 集中设置教师
        treeEmptyText: '请选择班级。',
        expandedKeys: [],
        copyExpandedKeys: [],
        defaultSelectedKeys: [],
        checkNode: [],
        autoExpandParent: true,
        modalUnifiedSetTeacher: false,
        lessonsData: [],
        teacherTree: [],
        selectlessons: '',
        selectDay: '',
        selectTeacherTree: '',
        sectionSpin: false,
        isGOonSetTeacher: false,
        keyWord: '',
        // 添加学生
        svShow: true,
        isShowAddMember: false,
        organizationList: [], // 获取组织
        loading: true,
        sysgroup: {},
        targetKeys: [],
        teacherIds: []// 已添加的成员
      }
    },
    created () {

    },
    destroyed () {

    },
    mounted () {
      this.getTp()
    },
    methods: {
      // 获取数据
      async getTp () {
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverSelfStudy/GetSloverSelfStudys`, params)
        this.xy.unloading()
        if (res.success) {
          this.resultData = res.data.Result
          for (let i = 0; i < this.resultData.length; i++) {
            if (this.resultData[i].Students !== null) {
              for (let m = 0; m < this.resultData[i].Students.length; m++) {
                this.$set(this.resultData[i].Students[m], 'isEditor', true)
                this.$set(this.resultData[i].Students[m], 'collapse', false)
              }
            }
          }
          this.sloverResultCollectionID = res.data.SloverResultCollectionID
        }
      },
      // 是否显示老师列表
      collapseMustShow (student) {
        if (student.TeacherName) {
          if (student.collapse) {
            student.collapse = false
          } else {
            if (student.TeacherName !== '') {
              for (let j = 0; j < this.resultData.length; j++) {
                this.resultData[j].Students.map((item) => {
                  item.collapse = false
                  return item
                })
              };
              student.collapse = true
            }
          }
        }
      },
      // 删除教师
      async delTeacher (val) {
        let params = {
          SloverResultCollectionID: val.SloverResultCollectionID,
          ClassID: val.ClassID,
          TeacherID: 0
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverSelfStudy/ChangeClassTeacher`, params)
        if (res.success) {
          this.getTp()
        }
      },
      // 添加班级
      async addClass (index) {
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverSelfStudy/GetMaxSelfstudyCoursesNumber`, params)
        if (res.success) {
          let params1 = {
            SloverResultCollectionID: this.sloverResultCollectionID,
            ClassName: (res.data + 1) + '班',
            Day: this.resultData[index].Day,
            AMorPM: this.resultData[index].AMorPM,
            AMorPMOrder: this.resultData[index].AMorPMOrder
          }
          let res1 = await this.xy.post(`${this.$store.state.apiPath}/api/SloverSelfStudy/CreateClass`, params1)
          if (res1.success) {
            this.xy.msgSuc('添加成功。')
            this.getTp()
          }
        }
      },
      // 自动排自习
      AutomaticallySet () {
        if (this.isOperation1 === 0) {
          this.automaticallyNum = ''
          this.modalAutomaticallySet = true
        }
      },
      async startSet () {
        let reg = /^[1-9][0-9]{0,2}$/
        if (reg.test(this.automaticallyNum)) {
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverSelfStudy/AutomaticClass?studentLimitation=${this.automaticallyNum}&sloverResultCollectionID=${this.sloverResultCollectionID}&classTableID=${this.classTableID}`, null)
          if (res.success) {
            this.xy.msgSuc('自动排自习成功。')
            this.modalAutomaticallySet = false
            this.getTp()
          }
        } else {
          this.xy.msgError('班额只能输入1-999的正整数。')
        }
      },
      // 集中设置教师
      setTeacher () {
        if (this.isOperation1 === 0) {
          this.treeEmptyText = '请选择班级。'
          this.getNoStudentSloverSelfStudys()
          this.selectTeacherTree = ''
          this.keyWord = ''
          this.selectDay = ''
          this.selectlessons = ''
          this.teacherTree = []
          this.expandedKeys = []
          this.copyExpandedKeys = []
          this.defaultSelectedKeys = []
          this.$nextTick(() => {
            document.getElementById('tree1').scrollTop = 0
          })
          this.modalUnifiedSetTeacher = true
          this.isGOonSetTeacher = false
        }
      },
      async getNoStudentSloverSelfStudys () { // 课节
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          sloverResultCollectionID: this.sloverResultCollectionID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverSelfStudy/GetNoStudentSloverSelfStudys`, params)
        this.xy.unloading()
        if (res.success) {
          this.lessonsData = []
          let resData = res.data.Result
          for (let i = 0; i < resData.length; i++) {
            if (resData[i].Students.length > 0) {
              resData[i].Students.map((item) => {
                item.isCheck = false
                return item
              })
            }
          }
          this.lessonsData = resData
        }
      },
      async getAssignClassListForEditTeacher (val, data, isExpand) { // 老师
        this.teacherTree = []
        this.treeEmptyText = '正在加载中...'
        let params = {
          classTableID: this.classTableID,
          classID: val.ClassID,
          aMorPM: data.AMorPM,
          aMorPMOrder: data.AMorPMOrder,
          day: data.Day,
          searchText: this.keyWord.trim(),
          teacherID: val.TeacherID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverSelfStudy/GetTreeFilter`, params)
        if (res.success) {
          this.expandedKeys = []
          let dataList = res.data.Return
          for (let i = 0; i < dataList.length; i++) {
            this.teacherTree.push({
              id: `${dataList[i].Value}/${i}`,
              key: `${dataList[i].Value}/${i}`,
              title: dataList[i].Name,
              selectable: !dataList[i].IsOrganization,
              scopedSlots: { title: 'titleName' },
              UserName: dataList[i].UserName,
              isHight: dataList[i].IsHight,
              isCanSelect: dataList[i].IsOrganization,
              children: this.getTeacherChildren(dataList[i].Childrens, isExpand)
            })
            this.expandedKeys.push(`${dataList[i].Value}/${i}`)
          }
          if (isExpand && this.keyWord.trim().length === 0) { // 搜索为空的时候，还原搜索之前打开树的状态
            this.expandedKeys = [...this.copyExpandedKeys]
          }
          if (!isExpand) { // 不是搜索
            this.copyExpandedKeys = [...this.expandedKeys]
          }
          if (this.teacherTree.length === 0) {
            this.treeEmptyText = '未搜索到相关结果。'
          }
        }
      },
      getTeacherChildren (orglist, isExpand) { // 递归教师
        if (orglist.length > 0) {
          let result = []
          for (let i = 0; i < orglist.length; i++) {
            let titleName = ''
            if (orglist[i].IsHight) {
              titleName = orglist[i].Name + '(优先)'
            } else {
              titleName = orglist[i].Name
            }
            result.push({
              id: orglist[i].Value,
              key: orglist[i].Value,
              title: titleName,
              selectable: !orglist[i].IsOrganization,
              scopedSlots: { title: 'titleName' },
              UserName: orglist[i].UserName,
              isHight: orglist[i].IsHight,
              isCanSelect: orglist[i].IsOrganization,
              children: this.getTeacherChildren(orglist[i].Childrens, isExpand)
            })
            if (isExpand && this.keyWord.length > 0) { // 搜索
              this.expandedKeys.push(orglist[i].Value)
            }
          }
          return result
        }
      },
      lessonChange (val, item) { // 课节点击
        if (this.lessonsData.length === 0) { return }
        for (let i = 0; i < this.lessonsData.length; i++) {
          this.lessonsData[i].Students.map((item) => {
            item.isCheck = false
            return item
          })
        };
        val.isCheck = true
        this.selectlessons = ''
        this.selectlessons = val
        this.selectDay = ''
        this.selectDay = item
        this.keyWord = ''
        this.getAssignClassListForEditTeacher(val, item, false)
      },
      teacherSelect (selectedKeys, info) { // 科目班级树
        let nodeData = info.node.dataRef
        if (!(nodeData.isCanSelect)) {
          this.selectTeacherTree = ''
          this.selectTeacherTree = nodeData
          this.defaultSelectedKeys = []
          this.defaultSelectedKeys = selectedKeys
        } else {
          this.defaultSelectedKeys = []
          nodeData.selected = false
        }
      },
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.copyExpandedKeys = [...this.expandedKeys]
        this.autoExpandParent = false
      },
      searchFun () {
        if (this.selectDay !== '' && this.selectlessons !== '') {
          this.getAssignClassListForEditTeacher(this.selectlessons, this.selectDay, true)
          // 为了解决卡顿，添加loading动画
          // Object.assign(this, {
          //   expandedKeys: [...new Set(this.expandedKeys)],
          //   autoExpandParent: true
          // })
        }
      },
      async submitUnifiedSetTeacher () { // 保存
        console.log(this.selectTeacherTree)
        if (this.selectlessons === '' || this.selectTeacherTree === '') {
          this.xy.msgError('请至少选择一项。')
          return false
        };
        if (this.isGOonSetTeacher) {
          this.submitContinueUnifiedSetTeacher()
          return
        }
        let params = {
          SloverResultCollectionID: this.sloverResultCollectionID,
          ClassID: this.selectlessons.ClassID,
          TeacherID: this.selectTeacherTree.id
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverSelfStudy/ChangeClassTeacher`, params)
        if (res.success) {
          this.xy.msgSuc('集中设置教师成功。')
          this.getTp()
          this.modalUnifiedSetTeacher = false
        }
      },
      async submitContinueUnifiedSetTeacher () { // 保存并继续
        // console.log(this.selectlessons, this.selectTeacherTree)
        if (this.selectlessons === '' || this.selectTeacherTree === '') {
          this.xy.msgError('请至少选择一项。')
          return false
        };
        let params = {
          SloverResultCollectionID: this.sloverResultCollectionID,
          ClassID: this.selectlessons.ClassID,
          TeacherID: this.selectTeacherTree.id
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverSelfStudy/ChangeClassTeacher`, params)
        if (res.success) {
          this.xy.msgSuc('集中设置教师成功。')
          this.getTp()
          // this.getNoStudentSloverSelfStudys()
          // 左边radio去掉选中

          for (let i = 0; i < this.lessonsData.length; i++) {
            this.lessonsData[i].Students.map((item) => {
              if (item.ClassID === this.selectlessons.ClassID) {
                item.TeacherName = this.selectTeacherTree.title
                item.UserName = this.selectTeacherTree.UserName
              }
              item.isCheck = false
              return item
            })
          };
          this.keyWord = ''
          this.selectlessons = ''
          this.selectDay = ''
          this.teacherTree = []
          this.treeEmptyText = '请选择班级。'
        }
      },
      // 班级名称点击
      className (event) {
        let targe = $(event.currentTarget)
        targe.parents('.row-one').find('.post-class-name').show()
      },
      // 班级名称提交
      async postClassName (className, classID) {
        if (this.isOperation1 === 0) {
          let num = 0
          for (let i = 0; i < this.resultData.length; i++) {
            for (let j = 0; j < this.resultData[i].Students.length; j++) {
              if (className === this.resultData[i].Students[j].ClassName) {
                num++
                if (num > 1) {
                  this.xy.msgError('班级名称不能重复。')
                  return false
                }
              }
            }
          };
          let params = {
            SloverResultCollectionID: this.sloverResultCollectionID,
            ClassID: classID,
            ClassName: className
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverSelfStudy/ChangeClassName`, params)
          if (res.success) {
            // targe.hide();
            // this.resultData[index].Students[studentIndex].isEditor = true;
            this.getTp()
            this.xy.msgSuc(res.msg || '保存成功。')
          }
        }
      },
      // 删除某节课所有班级
      delResult (result) {
        if (this.isOperation1 === 0) {
          let that = this
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定' + result.Weeks + '不需要排自习吗？',
            async onOk () {
              let params = {
                SloverResultCollectionID: that.sloverResultCollectionID,
                // ClassID: result.Students[0].ClassID,
                Day: result.Day,
                AMorPM: result.AMorPM,
                AMorPMOrder: result.AMorPMOrder
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/SloverSelfStudy/DeleteClassForDay`, params)
              if (res.success) {
                that.xy.msgSuc('删除成功。')
                that.getTp()
              }
            }
          })
        }
      },
      // 删除班级
      del (student) {
        if (this.isOperation1 === 0) {
          let that = this
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除' + student.ClassName + '吗？',
            async onOk () {
              let params = {
                SloverResultCollectionID: that.sloverResultCollectionID,
                ClassID: student.ClassID
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/SloverSelfStudy/DeleteClass`, params)
              if (res.success) {
                that.getTp()
              }
            }
          })
        }
      },
      // 恢复已删课节
      async restore () {
        if (this.isOperation1 === 0) {
          let params = {
            SloverResultCollectionID: this.sloverResultCollectionID
          }
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverSelfStudy/ResetDeleteClass`, params)
          if (res.success) {
            this.xy.msgSuc(res.msg || '恢复成功。')
            this.getTp()
          }
        }
      },

      // 已排学生
      loadPage (student) {
        this.$store.commit('csmstimetable/changeSelfStudyStudent', JSON.stringify(student))

        this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 0 }) // 要返回的路由
        this.$router.push({
          name: 'studentTable',
          query: this.$store.state.common.menuInfo
        })
      },
      //= ======多选弹出框 Start =======
      async openAddTeacherModal (student) {
        if (this.isOperation1 === 0) {
          this.tag1 = ''
          this.tag1 = student.ClassID
          this.newList = []
          this.keyWord1 = ''
          this.checkAllList = []
          this.autoExpandParent1 = true
          this.expandedKeys1 = []
          this.copyExpandedKeys1 = []
          this.curNode = []
          this.selectTeacherIds = []
          if (student.TeacherID !== 0) {
            this.selectTeacherIds.push(student.TeacherID)
          }
          this.isShow = true

          let params = {
            classTableID: this.classTableID,
            day: student.Day,
            aMOrPM: student.AMorPM,
            aMOrPMOrder: student.AMorPMOrder,
            classID: student.ClassID,
            searchText: '',
            teacherID: student.TeacherID
          }
          this.modalLoading = true
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverSelfStudy/GetTeacherTreeFilter`, params)
          this.modalLoading = false
          if (res.success) {
            if (res.data && !res.data.length) return
            this.curNode = []
            this.checkedValue = []
            this.newList = this.setTree(res.data)
            this.copyDataList = JSON.parse(JSON.stringify(this.newList))
            this.copyExpandedKeys1 = [...this.expandedKeys1]
          }
        }
      },
      // 递归教师
      setTree (orglist) {
        let result = []; let obj = {}
        if (orglist && orglist.length) {
          for (let i = 0; i < orglist.length; i++) {
            // 校区
            obj = {
              title: orglist[i].OrganizationName,
              id: `${orglist[i].SchoolDistrictID}/${orglist[i].OrganizationID}/${orglist[i].OrganizationType || ''}`,
              key: `${orglist[i].SchoolDistrictID}/${orglist[i].OrganizationID}/${orglist[i].OrganizationType || ''}`,
              leve: 0,
              children: this.setTree(orglist[i]),
              scopedSlots: { title: 'title' }
            }
            if (orglist[i].OrganizationID === 0 || orglist[i].SchoolDistrictID === 0 || orglist[i].SchoolDistrictID === -1) { // 默认展开到第二级(OrganizationID === 0正常一级组织，SchoolDistrictID === 0自定义一级组织，SchoolDistrictID: -1未在组织教师)
              this.expandedKeys1.push(obj.id)
            }
            result.push(obj)
          }
        }
        if (orglist.Members && orglist.Members.length) {
          for (let i = 0; i < orglist.Members.length; i++) {
            // 教师
            obj = {
              typeId: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.OrganizationType || ''}`,
              title: orglist.Members[i].FullName,
              userName: orglist.Members[i].UserName,
              serachStr: `${orglist.Members[i].FullName} ${orglist.Members[i].UserName} ${orglist.Members[i].SchoolCardNumber}`,
              id: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.Members[i].UserID}` || '',
              key: `${orglist.SchoolDistrictID}/${orglist.OrganizationID}/${orglist.Members[i].UserID}` || '',
              UserID: orglist.Members[i].UserID,
              scopedSlots: { title: 'teaName' },
              leve: 2,
              image: orglist.Members[i].Icon,
              sex: orglist.Members[i].Sex,
              children: []
            }
            if (orglist.Members[i].UserID > 0) {
              obj.scopedSlots.icon = 'icon'
            }
            // 右侧教师多个过滤操作，如果，有多个同一教师只显示一个
            if (this.selectTeacherIds && this.selectTeacherIds.length && ((!this.checkAllList.length && this.selectTeacherIds.includes(obj.UserID)) || (!this.checkAllList.map(v => `${v.title}_${v.sex}`).includes(`${obj.title}_${obj.sex}`) && this.selectTeacherIds.includes(obj.UserID)))) {
              this.checkAllList.push(obj)
            }
            // 编辑的时候，将之前选中过的教师在左侧tree上面选中
            if (this.selectTeacherIds.includes(obj.UserID) && !this.curNode.includes(obj.id)) {
              this.curNode.push(obj.id)
              this.checkedValue.push(obj)
            }
            result.push(obj)
          }
        }
        if (orglist.Childrens && orglist.Childrens.length) {
          for (let i = 0; i < orglist.Childrens.length; i++) {
            // 二三四...各级子组织
            obj = {
              title: orglist.Childrens[i].OrganizationName,
              id: `${orglist.Childrens[i].SchoolDistrictID}/${orglist.Childrens[i].OrganizationID}/${orglist.Childrens[i].OrganizationType || ''}`,
              key: `${orglist.Childrens[i].SchoolDistrictID}/${orglist.Childrens[i].OrganizationID}/${orglist.Childrens[i].OrganizationType || ''}`,
              leve: 1,
              children: this.setTree(orglist.Childrens[i]),
              scopedSlots: { title: 'title' }
            }
            result.push(obj)
          }
        }
        return result
      },
      clearKayWd (val = '') {
        if (val !== '') return
        this.curNode = this.checkedValue.map(v => v.id)
      },
      // 弹窗
      selectCancel () {
        this.isShow = false
      },
      async selectConfirm (data) {
        let selectConfirmTeachers = [...this.checkAllList]
        if (selectConfirmTeachers.length > 1) {
          this.xy.msgError('自习课只能安排一位教师。')
          return false
        };
        this.isShow = false
        let targetKey = -1
        for (let i = 0; i < selectConfirmTeachers.length; i++) {
          targetKey = selectConfirmTeachers[i].UserID
        };
        let params = {
          SloverResultCollectionID: this.sloverResultCollectionID,
          ClassID: this.tag1,
          TeacherID: targetKey
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverSelfStudy/ChangeClassTeacher`, params)
        if (res.success) {
          this.getTp()
        }
      },
      //   ----------设置教师的选中start ----------
      // 设置教师
      delFun (val) {
        this.rightSta = true
        this.featchEndVal(val, false)
      },
      // tree 组件自带方法，选中/反选
      onCheck (checkedKeys, info) {
        this.rightSta = false
        let nodeData = info.node.dataRef
        this.featchEndVal(nodeData, info.checked)
      },
      /**
       * val 传入要处理的对象，比如晓羊校区
       * status 这个用来确认是选中（true），还是，取消选中（false）
       */
      featchEndVal (val, status) {
        // status: true选中了 false取消选中了
        if (!val) return false
        // 这里遍历学校和年级，如果这两个children下面还有数据就继续递归
        if (val.children && val.children.length) {
          for (let item of val.children) {
            // 递归调用
            this.featchEndVal(item, status)
          }
        } else {
          if (!status) {
            // 取消选中操作（tree取消选中多选框 和右侧'X'取消）
            if (this.rightSta && this.curNode.length) {
              // 点击右侧（反选操作，这里要做的是去删除左侧多个被选中的同一个教师） --- rightSta这个用来确认是右侧删除标识
              this.include = []
              // 这里将同一UserId的id拿到，因为，相同UserId的id不一样（同一教师可能会在不同组织下面）
              for (let item of this.checkedValue) {
                if (val.UserID === item.UserID && !this.include.includes(item.id)) {
                  this.include.push(item.id)
                }
              }
              // 拿到了同一教师的唯一id之后，挨个将左侧选中状态下的不同组织下面的教师取消选中状态
              if (this.include.length) {
                for (let item of this.include) {
                  if (this.curNode.findIndex(v => v === item) > -1) {
                    this.curNode.splice(this.curNode.findIndex(v => v === item), 1)
                  }
                  if (this.checkedValue.findIndex(v => v.id === item) > -1) {
                    this.checkedValue.splice(this.checkedValue.findIndex(v => v.id === item), 1)
                  }
                }
              }
            } else {
              // if (!info.checked && !nodeData.UserID && !nodeData.children.length) return
              // 左侧取消选中（反选操作） 将被反选的唯一id传入，再去curNode中找到，再将其删除
              if (this.curNode.length && this.curNode.includes(val.id)) {
                if (this.curNode.findIndex(v => v === val.id) > -1) {
                  this.curNode.splice(this.curNode.findIndex(v => v === val.id), 1)
                }
              }
              // 先去删除缓存中的不同组织下的教师
              if (this.checkedValue.length) {
                if (this.checkedValue.findIndex(v => v.id === val.id) > -1) {
                  this.checkedValue.splice(this.checkedValue.findIndex(v => v.id === val.id), 1)
                }
              }
            }
            // 删除右侧列表中的唯一教师
            if (val.UserID && (((this.checkedValue.length && !this.checkedValue.map(v => v.UserID).includes(val.UserID)) || !this.checkedValue.length || this.rightSta))) {
              if (this.checkAllList.findIndex(v => v.UserID === val.UserID) > -1) {
                this.checkAllList.splice(this.checkAllList.findIndex(v => v.UserID === val.UserID), 1)
              }
            }
          } else {
            // 选中操作
            if (!this.checkedValue.length || (this.checkedValue.length && !this.checkedValue.map(v => v.id).includes(val.id))) {
              this.curNode.push(val.id)
              // 将左侧选中教师加入缓存数组
              this.checkedValue.push(val)
            }
            // 右侧要显示的教师去重
            if (val.UserID && !this.checkAllList.map(vv => vv.UserID).includes(val.UserID)) {
              this.checkAllList.push(val)
            }
          }
        }
      },
      //   ----------设置教师的选中end ----------
      //   ----------搜索tree,Start ----------
      onExpand1 (expandedKeys1) {
        this.expandedKeys1 = expandedKeys1
        this.autoExpandParent1 = false
        if (!this.isHaveVal) {
          this.copyExpandedKeys1 = [...this.expandedKeys1]
        }
      },
      // 执行搜索
      searchFun1 () {
        this.treeLoading = true
        this.keyWordTrim = this.keyWord1.trim()
        this.curNode = []
        this.newList = JSON.parse(JSON.stringify(this.copyDataList)) // 深拷贝所有数据
        if (this.keyWordTrim) {
          this.isHaveVal = true
          this.expandedKeys1 = []
          this.curNode = []
          this.newList = this.filterKW(this.newList)
        } else { // 清空内容 // 输入空格
          this.isHaveVal = false
          this.expandedKeys1 = [...this.copyExpandedKeys1]
          this.clearKayWd()
        }
        // 为了解决卡顿，添加loading动画
        setTimeout(() => {
          this.treeLoading = false
        }, 300)
        Object.assign(this, {
          expandedKeys1: [...new Set(this.expandedKeys1)],
          autoExpandParent1: true
        })
      },
      // 递归操作，搜索出来的数据
      filterKW (val) {
        if (!val || !val.length) return null
        return val.map(vv => {
          if (vv.children && vv.children.length && (vv.leve === 0 || vv.leve === 1)) {
            vv.children = vv.children.filter(vc => {
              if (vc.serachStr && vc.serachStr.indexOf(this.keyWord1.trim()) > -1) {
                // 检查当前筛选条件下是有有被选中的，如果有就要加入当前被选中的集合中。
                if (this.checkedValue.map(v => v.id).includes(vc.id)) {
                  this.curNode.push(vc.id)
                }
                // 将需要展开的组织的最后一级的typyId加入tree默认数组中
                this.expandedKeys1.push(vc.typeId)
                return vc
              } else if (vc.children && vc.children.length) return vc
            })
          }
          vv.children = vv.children && vv.children.length ? this.filterKW(vv.children) : []
          return (vv.leve === 0 || vv.leve === 1) && !vv.children.length ? null : vv
        }).filter(v => v)
      }
      //= ======多选弹出框  End =======
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/rowSelfStudy.less';
  @import '../../../components/css/antModal.less';
  .exchange{
    margin: -3px 5px 0 5px;
  }
</style>
