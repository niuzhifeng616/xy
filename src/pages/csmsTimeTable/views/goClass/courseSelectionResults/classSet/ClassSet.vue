<!-- 3.选课结果-课程设置 -->
<template>
  <div class="xy-content-body">
    <!-- 课程 -->
    <div style='display:flex'>
      <!-- 左边 -->
      <div class="class_set_left">
        <h3 class="class_set">
          课程设置
          <tooltip placement="top"
                   content="请先设置课程与分层，再导入选课结果和进行调整"
                   max-width=150>
            <Icon type="ios-help-circle-outline"
                  style='color:#4196FF' />
          </tooltip>
        </h3>
        <ul>
          <li class="menuList">
            <div class="level1_menuList"
                 @click="leftSubSelect(0)"
                 :class="selectCourse.AID===0?'active_bg':'close_bg'">
              <p class="title nowrap"
                 style="font-size:12px;font-weight:400;color:#8C8C8C">全部</p>
              <p v-if="isOperation === 0">
                <Icon type="md-add"
                      color="#000"
                      size="13"
                      style="cursor:pointer;border:1px solid #000"
                      @click.stop="addCrouse" />
              </p>
            </div>
          </li>
          <li v-for='(item,index) in subList'
              class="menuList"
              :key="index">
            <div class="level1_menuList"
                 @click="leftSubSelect(item)"
                 :class="selectCourse.AID===item.ThisID?'active_bg':'close_bg'">
              <p class="title nowrap"
                 :title="item.ThisName">{{item.ThisName}}<span class="count">（{{item.Count}})</span> </p>
              <p class="level_btn"
                 v-if="isOperation === 0">
                <span @click.stop='addLevel(index,item)'>添加分层</span>
                <span @click.stop='delSub(item)'>删除</span>
              </p>
            </div>
            <div v-for="(cItem,cIndex) in item.Childrens"
                 @click="leftSubSelect(cItem)"
                 :key="cIndex"
                 :class="selectCourse.AID===cItem.ThisID?'active_bg':'close_bg'"
                 class="level1_menuList">
              <p class="level_title">
                <span class="name nowrap"
                      :title="cItem.ThisName">{{cItem.ThisName}}</span>
                <span class="count">（{{cItem.Count}})</span>
              </p>
              <p class="level_btn"
                 v-if="isOperation === 0">
                <span @click.stop='edit(index,cIndex)'>编辑</span>
                <span @click.stop='delLecel(cItem)'>删除</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <!-- 右边 -->
      <div class="class_set_right pr">
        <div class="xy-content-title clearfix">
          <div class="fl">
            <Button class="xy-primary"
                    @click="ImportSelectedClass"
                    :disabled="isOperation !== 0">导入选课</Button>
            <!-- <Button class="xy-info"
                    @click="exportSelectedClass">导出选课</Button> -->
            <Button class="xy-danger"
                    @click="delAll"
                    :disabled="isOperation !== 0">批量清除</Button>
            <dropdown @on-click="moreFun"
                      trigger="click">
              <Button>
                更多
                <icon type="ios-arrow-down"></icon>
              </Button>
              <dropdown-menu slot="list">
                <dropdown-item name="1">导出选课</dropdown-item>
                <dropdown-item name="2">选课统计</dropdown-item>
              </dropdown-menu>
            </dropdown>
          </div>
          <div class="fr pr">
            <Button class="xy-info"
                    @click="filterStudent">筛选学生</Button>
            <i-input search
                     v-model.trim="searchText"
                     @on-search="FromSubmit"
                     placeholder="请输入用户名/学生姓名"
                     class="xy-content-title-search"
                     style="width: auto;">
              <icon type="ios-search cursor-p"
                    slot="suffix" />
            </i-input>
            <Button @click="goback"
                    style="margin: 0 5px;">返回</Button>
          </div>
        </div>
        <!-- 表格 -->
        <XyAntTable :rowSelection="tableRowSelection"
                    :columns="columns"
                    :dataSource="datatable"
                    nullData="该搜索条件下没有结果。"
                    :scrollx="'max-content'"
                    :tableLoading="tableLoading"
                    :pagination="pagination"
                    @change="handleTableChange">
          <!-- 头像 -->
          <div slot="IconRender"
               slot-scope="text, record">
            <div v-if="!record.Icon"
                 :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.FullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%"
                 v-else
                 :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <!-- 姓名 -->
          <div slot="FullNameRender"
               slot-scope="text, record">
            <span class="table-el-hover"
                  v-if="isOperation === 0"
                  @click="adjustStudent(record)">
              {{record.FullName}}
            </span>
            <span v-else>
              {{record.FullName}}
            </span>
          </div>
          <!-- 用户名 -->
          <div slot="UserNameRender"
               slot-scope="text, record"
               style="min-width:120px">
            <span>
              {{record.UserName}}
            </span>
          </div>
          <!-- 原行政班 -->
          <div slot="ClassNameRender"
               slot-scope="text, record"
               style="min-width:150px">
            <span>
              {{record.ClassName}}
            </span>
          </div>
          <!-- 操作 -->
          <span slot="operaRender"
                slot-scope="text, record">
            <a @click="adjustStudent(record)"
               :disabled="isOperation !== 0">调整课程</a>
          </span>
        </XyAntTable>
      </div>
    </div>
    <!-- 调整课程 -->
    <modal v-model="adjustModal"
           width=550
           :transfer="false"
           title="调整课程"
           :mask-closable="false">
      <ul v-if='adjustSubData.length>0'>
        <li v-for='(item, i) in adjustSubData'
            style="margin: 10px 0"
            :key="i">
          <checkbox v-model="item.checked"
                    :disabled="item.Childrens.length!==0"
                    @on-change="adjustCheck(item,0,'')">{{item.ThisName}}</checkbox>
          <span v-for='(cItem, index) in item.Childrens'
                :key="index">
            <checkbox v-model="cItem.checked"
                      @on-change="adjustCheck(cItem,1,item)">{{cItem.ThisName}}</checkbox>
          </span>
        </li>
      </ul>
      <div v-else
           class="no-data-modal">
        <img src="@/assets/common/nullData.svg"
             alt="图片" />
        <p class="no-class">
          您还没有课程的信息，请添加课程。
        </p>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="adjustModal=false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="adjustSubmit">确定</Button>
      </div>
    </modal>
    <!-- 筛选学生 -->
    <modal v-model="filterModal"
           :transfer="false"
           title="筛选学生"
           :mask-closable="false"
           width=550>
      <!-- 班级 -->
      <div class="filterStudentContent">
        <div style="padding-bottom:6px;margin-bottom:6px;">
          <checkbox :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll">全选</checkbox>
        </div>
        <checkbox-group v-model="checkAllGroup"
                        @on-change="checkAllGroupChange">
          <checkbox v-for='(classObj, i) in classList'
                    :label='classObj.StudentOrganizationID'
                    :key="i">
            {{classObj.StudentOrganizationName}}
          </checkbox>
        </checkbox-group>
      </div>
      <!-- 排名 -->
      <div class="filterStudentContent"
           v-if="isExistAchievement">
        <radio-group v-model="ranking.ObjectID">
          <radio label='0'>总排名</radio>
          <radio v-for='(sub,i) in subList'
                 :label='sub.ThisID'
                 :key="i">
            {{sub.ThisName}}
          </radio>
        </radio-group>
        <div class="choose">
          <input-number style="width: 150px;"
                        :min="1"
                        v-model="ranking.Min"
                        placeholder="请输入范围起始值"></input-number>
          <span>-</span>
          <input-number style="width: 150px;"
                        :min="1"
                        v-model="ranking.Max"
                        placeholder="请输入范围结束值"></input-number>
        </div>
      </div>
      <!-- 分数 -->
      <div class="filterStudentContent"
           v-if="isExistAchievement">
        <radio-group v-model="achievement.ObjectID">
          <radio label='0'>总分数</radio>
          <radio v-for='(sub1,i) in subList'
                 :label='sub1.ThisID'
                 :key="i">
            {{sub1.ThisName}}
          </radio>
        </radio-group>
        <div class="choose">
          <input-number style="width: 150px;"
                        :min="1"
                        v-model="achievement.Min"
                        placeholder="请输入范围起始值"></input-number>
          <span>-</span>
          <input-number style="width: 150px;"
                        :min="1"
                        v-model="achievement.Max"
                        placeholder="请输入范围结束值"></input-number>
        </div>
      </div>

      <div slot="footer">
        <Button class="xy-modal-close"
                @click="filterModalCancle">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="filterSubmit">确定</Button>
      </div>
    </modal>
    <!-- 添加课程 -->
    <modal v-model="modalAddCrouse"
           title="添加课程"
           v-if="isOperation === 0"
           :mask-closable="false"
           width="570"
           :transfer="false"
           @on-ok="addCrouseSubmit">
      <div style="font-size:14px;">
        <div class="clearfix"
             style="padding-bottom:10px;">
          <i-input search
                   @on-change='searchFun'
                   v-model.trim="searchCrouse"
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
                    style="width:130px">
            <i-option :value="item.SubjectCategoryID"
                      :label="item.SubjectCategoryName"
                      :key="i"
                      v-for="(item, i) in subjectData.SubjectsCategoryChildren">{{item.SubjectCategoryName}}</i-option>
          </i-select>
          <i-select v-model="crouseType"
                    @on-change="crouseTypeChange"
                    :label-in-value="true"
                    class="fr xy-content-title-search"
                    style="width:130px">
            <i-option :value="item.SubjectCategoryID"
                      :key="i"
                      :label="item.SubjectCategoryName"
                      v-for="(item, i) in subjectData.SubjectsCategory">{{item.SubjectCategoryName}}</i-option>
          </i-select>
        </div>
        <div class="clearfix"
             v-if="isSchoolCrouse&&isHaveData">
          <checkbox v-model="checkAllSub"
                    size="large"
                    @on-change="checkAlls"
                    class="fr"
                    style="padding-top:6px;">全选</checkbox>
        </div>
        <ul class="modal-crouse"
            v-if="forSubjectData.length>0&&isHaveData">
          <!-- :class 用于添加校本课程时的全选功能，不用于单个选择课程 -->
          <li v-for="(subject, i) in forSubjectData"
              :class="subject.isActive?'is-active':''"
              :title="subject.SubjectName"
              :key="i"
              class="nowrap"
              v-show="subject.SubjectName.indexOf(searchCrouse)!== -1"
              @click="crouseSelect(subject)">{{subject.SubjectName}}</li>
        </ul>
        <div v-else-if='forSubjectData.length===0||!isHaveData'
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
                @click="addCrouseSubmit">保存</Button>
      </div>
    </modal>
    <!-- 添加分层 -->
    <modal v-model="modalAddOrg"
           :transfer="false"
           :title="isAddOrg?'添加分层':'编辑分层'"
           :mask-closable="false">
      <div style="margin-top:10px;"
           v-if='!isAddOrg'>
        <Input v-model.trim="addLayeredName"
               minlength="1"
               maxlength="20"
               placeholder="请输入分层名称"
               required
               clearable />
      </div>
      <div v-else>
        <p style="margin-bottom: 15px;">请输完一个分层名称后按回车键，再输入另外一个分层名称，依次类推。</p>
        <vue-tags-input v-model.trim="addLayeredName"
                        :tags="tags"
                        placeholder="请输入分层名称，按回车键确认"
                        :add-on-blur="false"
                        :avoid-adding-duplicates="false"
                        @before-adding-tag="beforeAddingTag"
                        @before-deleting-tag="boforeDeletingTag"
                        class="add-orgs" />
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="addOrgsCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                v-if='!isAddOrg'
                @click="addLayeredFun">保存</Button>
        <Button class="xy-modal-primary"
                v-else
                shape="circle"
                @click="addOrgSubmit">保存</Button>
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
  import XyUpfile from '@/components/upFile/XyUpfile'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import VueTagsInput from '@johmun/vue-tags-input'
  // const poto = require('@/assets/common/yrykb.png')

  export default {
    name: 'ClassSet',
    components: {
      XyUpfile,
      VueTagsInput,
      XyAntTable
    },
    data () {
      return {
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
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,

        selectionAll: [],
        selectedRowKeys: [],
        tableLoading: true,
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        datatable: [],

        columns: [],
        // 筛选学生
        filterModal: false,
        classList: [], // 班级数据
        indeterminate: false,
        checkAll: false,
        checkAllGroup: [],
        subList: [], // 课程数据
        ranking: {// 排名
          ObjectID: '0',
          ObjectType: '',
          Max: 0,
          Min: 0
        },
        achievement: {// 成绩
          ObjectID: '0',
          ObjectType: '',
          Max: 0,
          Min: 0
        },
        // 添加课程
        collectionID: 0,
        checkAllSub: false,
        modalAddCrouse: false,
        searchCrouse: '',
        isSchoolCrouse: false,
        schoolCrouseType: '',
        subjectData: [],
        forSubjectData: [], // 要循环显示的课程
        isHaveData: true,
        crouseType: '',
        // 新建分层
        isAddOrg: true,
        modalAddOrg: false,
        addLayeredName: '',
        addParent: [],
        tags: [],
        allLayeredName: [],
        isVali: true, // 添加时候 验证通过
        tag1: '',
        tag2: '',
        // 学生列表
        searchText: '',
        selectCourse: {
          AID: 0,
          Type: ''
        },
        isExistAchievement: false, // 是否有成绩
        // 调整课程
        adjustModal: false,
        curAdjustStudent: '',
        adjustSubData: []
      }
    },
    // watch: {
    //   addLayeredName (val) {
    //     if (val === '' && this.isAddOrg) {
    //       this.isVali = true
    //     }
    //   }
    // },
    mounted () {
      this.loadTable()
      this.gitSub()
      this.gitClass()
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: this.isOperation !== 0
            }
          })
        }
      }
    },
    methods: {
      loadComplete (type) {
        this.selectNum = type
        this.searchText = ''
        this.loadTable()
      },
      // 获取列表数据
      async loadTable () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/GetSelectResultPage`, {
          PageIndex: this.pagination.current,
          PageSize: this.pagination.pageSize,
          Searchtext: this.searchText,
          StudentOrganizationIDs: this.checkAllGroup,
          ClassTableID: this.classTableID,
          Completetype: 0,
          Ranking: this.ranking,
          Achievement: this.achievement,
          AID: this.selectCourse.AID,
          Type: this.selectCourse.Type
        })
        if (res.success) {
          let datas = res.data
          this.pagination.total = datas.TotalRecords
          this.isExistAchievement = datas.IsExistAchievement
          this.datatable = []
          this.columns = []
          this.columns = [
            {
              title: ' ',
              dataIndex: 'Icon',
              scopedSlots: { customRender: 'IconRender' },
              className: 'table-pic',
              width: 18,
              fixed: 'left'
            }, {
              title: '姓名',
              dataIndex: 'FullName',
              scopedSlots: { customRender: 'FullNameRender' },
              fixed: 'left',
              width: 150
            },
            {
              title: '用户名',
              dataIndex: 'UserName',
              scopedSlots: { customRender: 'UserNameRender' },
              fixed: 'left'
            },
            {
              title: '性别',
              dataIndex: 'SexName',
              width: 80
            }, {
              title: '原行政班',
              dataIndex: 'ClassName',
              scopedSlots: { customRender: 'ClassNameRender' }
            }
          ]
          for (let i = 0; i < datas.Courses.length; i++) {
            this.columns.push({
              title: datas.Courses[i].Name,
              dataIndex: 'result' + i,
              // scopedSlots: { customRender: 'result' + i },
              width: 130
            })
          };
          this.columns.push({
            title: '操作',
            dataIndex: 'opera',
            scopedSlots: { customRender: 'operaRender' },
            width: 100,
            fixed: 'right'
          })
          let resData = datas.Result
          for (let j = 0; j < resData.length; j++) {
            if (resData[j].Courses.length > 0) {
              for (let k = 0; k < resData[j].Courses.length; k++) {
                resData[j]['result' + k] = resData[j].Courses[k].Name
              }
            };
            this.$set(resData[j], 'key', j)
          }
          this.datatable = resData
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.loadTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      FromSubmit () {
        this.pagination.current = 1
        this.loadTable()
      },
      delAll () { // 批量删除触发
        if (this.isOperation === 0) {
          let that = this
          let idsStr = []
          if (this.selectionAll.length === 0) {
            this.xy.msgError('请勾选要清除选课结果的学生。')
          } else {
            for (let i = 0; i < this.selectionAll.length; i++) {
              idsStr.push(this.selectionAll[i].StudentID)
            }
            this.$Modal.confirm({
              title: '温馨提示',
              content: '确定清除所选学生的选课结果吗?',
              async onOk () {
                let params = {
                  id: that.classTableID,
                  ids: idsStr.join(',')
                }
                let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassStudentAchievement/ClearResult`, params)
                if (res.success) {
                  that.xy.msgSuc('清除成功。')
                  that.loadTable()
                  that.gitSub()
                  that.selectionAll = []
                  that.selectedRowKeys = []
                }
              }
            })
          };
        }
      },
      // 调整课程
      adjustStudent (ret) {
        this.curAdjustStudent = ret
        let selectCou = this.curAdjustStudent.Courses
        this.adjustSubData.map((item) => {
          item.checked = false
          item.Childrens.map((cItem) => {
            cItem.checked = false
            return cItem
          })
          return item
        })
        for (let i = 0; i < selectCou.length; i++) {
          this.adjustSubData.map((item) => {
            if (selectCou[i].AID === item.ThisID) {
              item.checked = true
            }
            item.Childrens.map((cItem) => {
              if (selectCou[i].AID === cItem.ThisID) {
                cItem.checked = true
              }
              return cItem
            })
            return item
          })
        }
        this.adjustModal = true
      },
      adjustCheck (ret, level, par) {
        if (ret.checked) {
          if (level === 0) {
            ret.Childrens.map((item) => {
              item.checked = false
              return item
            })
          } else {
            par.checked = false
            par.Childrens.map((item) => {
              if (item.ThisID !== ret.ThisID) {
                item.checked = false
              }
              return item
            })
          }
        }
      },
      async adjustSubmit () {
        let arr = []
        this.adjustSubData.map((item) => {
          if (item.checked) {
            arr.push({
              CoursePlanID: item.CoursePlanID,
              AID: item.ThisID,
              Type: item.ThisType
            })
          }
          item.Childrens.map((cItem) => {
            if (cItem.checked) {
              arr.push({
                CoursePlanID: cItem.CoursePlanID,
                AID: cItem.ThisID,
                Type: cItem.ThisType
              })
            }
            return cItem
          })
          return item
        })
        let params = {
          ClassTableID: this.classTableID,
          StudentID: this.curAdjustStudent.StudentID,
          Datas: arr
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/EditStudentSelectCourse`, params)
        if (res.success) {
          this.xy.msgSuc('调整成功。')
          this.adjustModal = false
          this.loadTable()
          this.gitSub()
        }
      },
      // 获取课程
      async gitSub () {
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/GetSettingList`, params)
        if (res.success) {
          let resData = res.data.Result
          this.collectionID = res.data.CollectionID
          this.subList = resData
          this.adjustSubData = resData
          this.adjustSubData.map((item) => {
            this.$set(item, 'checked', false)
            item.Childrens.map((cItem) => {
              this.$set(cItem, 'checked', false)
              return cItem
            })
            return item
          })
        }
      },
      // 获取班级
      async gitClass () {
        let params = {
          classTableID: this.classTableID,
          isComplete: 0
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/GetClassList`, params)
        if (res.success) {
          this.classList = res.data
        }
      },
      // 筛选学生
      handleCheckAll () {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false

        if (this.checkAll) {
          this.checkAllGroup = []
          for (let i = 0; i < this.classList.length; i++) {
            this.checkAllGroup.push(this.classList[i].StudentOrganizationID)
          }
        } else {
          this.checkAllGroup = []
        }
      },
      checkAllGroupChange (data) {
        if (data.length === this.classList.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        }
      },
      filterStudent () {
        this.filterModal = true
      },
      filterModalCancle () {
        this.filterModal = false
      },
      filterSubmit () {
        if (this.isExistAchievement) {
          if ($.trim(this.ranking.Min).length > 0 && $.trim(this.ranking.Max).length > 0) {
            if (this.ranking.Min >= this.ranking.Max) {
              this.xy.msgError('排名的结束值要大于起始值。')
              return false
            }
          }
          if ($.trim(this.achievement.Min).length > 0 && $.trim(this.achievement.Max).length > 0) {
            if (this.achievement.Min >= this.achievement.Max) {
              this.xy.msgError('分数的结束值要大于起始值。')
              return false
            }
          }
        }
        let that = this
        this.subList.map((item) => {
          if (item.ThisID === that.ranking.ObjectID) {
            that.ranking.ObjectType = item.ThisType
          }
          if (item.ThisID === that.achievement.ObjectID) {
            that.achievement.ObjectType = item.ThisType
          }
          return item
        })
        this.loadTable()
        this.filterModal = false
      },
      // 左侧课程和层的操作
      leftSubSelect (ret) {
        if (ret === 0) {
          this.selectCourse = {
            AID: 0,
            Type: ''
          }
        } else {
          this.selectCourse = {
            AID: ret.ThisID,
            Type: ret.ThisType
          }
        }
        this.loadTable()
      },
      // 课程的操作
      async addCrouse () {
        this.crouseType = ''
        this.searchCrouse = ''
        this.xy.loading()
        let params = {
          collectionID: this.collectionID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/CoursePlan/GetCreateSubject`, params)
        this.xy.unloading()
        if (res.success) {
          this.subjectData = res.data
          this.subjectData.SubjectsCategoryChildren.unshift({
            SubjectCategoryName: '所有子分类',
            SubjectCategoryID: 0
          })
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
        }
        this.isSchoolCrouse = false
        this.schoolCrouseType = ''
        this.modalAddCrouse = true
        this.isHaveData = true
      },
      crouseSelect (val) { // 选课
        val.isActive = !val.isActive
      },
      crouseTypeChange (res) { // 选择课程方式
        if (res !== undefined) {
          this.searchCrouse = ''
          if (res.value !== 3) { // 不是校本课程
            this.isSchoolCrouse = false
            this.forSubjectData = []
            this.forSubjectData = this.subjectData.Subjects.filter((item) => {
              if (item.SubjectCategoryID === this.crouseType) {
                return item
              }
            })
          } else { // 是校本课程
            this.schoolCrouseType = this.subjectData.SubjectsCategoryChildren[0].SubjectCategoryID
            this.forSubjectData = []
            this.forSubjectData = this.subjectData.Subjects.filter((item) => {
              if (item.SubjectCategoryType === 3) {
                return item
              }
            })
            this.isSchoolCrouse = true
          }
          this.isHaveData = true
        }
      },
      searchFun () {
        if (this.forSubjectData.length > 0) {
          this.isHaveData = this.forSubjectData.some(item => {
            return item.SubjectName.indexOf(this.searchCrouse) > -1
          })
        }
      },
      schoolCrouseTypeChange (res) { // 校本子分类
        this.checkAllSub = false// 重置全选按钮
        this.searchCrouse = ''
        if (this.schoolCrouseType === 0) { // 所有子分类
          this.forSubjectData = []
          this.forSubjectData = this.subjectData.Subjects.filter((item) => {
            if (item.SubjectCategoryType === 3) {
              return item
            }
          })
        } else {
          this.forSubjectData = []
          this.forSubjectData = this.subjectData.Subjects.filter((item) => {
            if (item.SubjectCategoryID === this.schoolCrouseType) {
              return item
            }
          })
        }
        this.searchFun()
      },
      checkAlls () { // 校本分类全选
        if (this.checkAllSub) {
          this.forSubjectData.map((item) => {
            if (item.SubjectName.indexOf(this.searchCrouse) !== -1) {
              item.isActive = true
              return item
            }
          })
        } else {
          this.forSubjectData.map((item) => {
            if (item.SubjectName.indexOf(this.searchCrouse) !== -1) {
              item.isActive = false
              return item
            }
          })
        }
      },
      async addCrouseSubmit () { // 保存添加课程
        let isSelectCourse = false
        for (let i = 0; i < this.subjectData.Subjects.length; i++) {
          if (this.subjectData.Subjects[i].isActive) {
            isSelectCourse = true
            this.subList.push({
              Childrens: [],
              Count: 0,
              CoursePlanID: 0,
              SubjectGroupID: 0,
              SubjectID: this.subjectData.Subjects[i].SubjectID,
              ThisID: 0,
              ThisName: this.subjectData.Subjects[i].SubjectName,
              ThisType: ''
            })
          }
        }
        if (!isSelectCourse) {
          return this.xy.msgError('请选择课程。')
        }
        this.xy.loading()
        let params = {
          ClassTableID: this.classTableID,
          Models: this.subList
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/CreateSetting`, params)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('添加成功。')
          this.modalAddCrouse = false
          this.gitSub()
        }
      },
      delSub (ret) {
        let that = this
        that.$Modal.confirm({
          title: '温馨提示',
          content: '删除此学科后，学生选课结果将不再显示此列，确定删除吗?',
          async onOk () {
            let params = {
              ClassTableID: that.classTableID,
              SubjectGroupID: ret.SubjectGroupID,
              ThisID: [ret.ThisID]
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassSubjectSetting/NewDeleteSubject`, params)
            if (res.success) {
              that.xy.msgSuc('删除成功。')
              that.gitSub()
              that.loadTable()
            }
          }
        })
      },
      // 分层的操作
      addLevel (index, item) {
        this.tag1 = index
        this.addLayeredName = ''
        this.isAddOrg = true
        this.modalAddOrg = true
        this.addParent = item.Childrens
        this.tags = []
      },
      edit (index, cIndex) {
        this.tag1 = index
        this.tag2 = cIndex
        this.addLayeredName = JSON.parse(JSON.stringify(this.subList[this.tag1].Childrens[this.tag2].ThisName))
        this.isAddOrg = false
        this.modalAddOrg = true
      },
      getallLayeredNames () {
        let addedArr = this.tags.length ? this.tags.map((item) => { return item.text }) : [] // 当前即将创建的
        let added = this.addParent.length ? this.addParent.map((item) => { return item.ThisName }) : [] // tree中已经创建完的
        this.allLayeredName = [...addedArr, ...added]
      },
      // 添加标签
      beforeAddingTag (obj) {
        // 验证是否重复
        this.getallLayeredNames()
        if (this.allLayeredName.indexOf(obj.tag.text) !== -1) {
          this.xy.msgError('同一课程下的分层名称不可重复。')
          return false
        } else if (obj.tag.text.length > 20) {
          this.xy.msgError('分层名称限制20个字符。')
          return false
        }
        this.tags.push(obj.tag)
        this.addLayeredName = ''
      },
      // 删除标签
      boforeDeletingTag (obj) {
        for (let i = 0; i < this.tags.length; i++) {
          if (this.tags[i].text === obj.tag.text) {
            this.tags.splice(i, 1)
          }
        }
      },
      addOrgSubmit () {
        this.getallLayeredNames()
        if (this.allLayeredName.indexOf(this.addLayeredName) !== -1) {
          this.xy.msgError('同一课程下的分层名称不可重复。')
          return false
        } else if (this.addLayeredName.length > 20) {
          this.xy.msgError('分层名称限制20个字符。')
          return false
        } else if (!this.addLayeredName.length && !this.tags.length) {
          this.xy.msgError('请输入分层名称。')
          return false
        } else if (this.addLayeredName.length <= 20 && this.addLayeredName.length > 0) {
          this.tags.push({
            text: this.addLayeredName,
            tiClasses: ['ti-valid']
          })
          this.addLayeredName = ''
          return false
        }
        for (let i = 0; i < this.tags.length; i++) {
          let obj = {
            Childrens: null,
            Count: 0,
            CoursePlanID: this.subList[this.tag1].CoursePlanID,
            SubjectGroupID: 0,
            SubjectID: 0,
            ThisID: 0,
            ThisName: this.tags[i].text,
            ThisType: ''
          }
          this.subList[this.tag1].Childrens.push(obj)
        }
        this.addLayeredFun()
      },
      async addLayeredFun () {
        if (!this.isAddOrg) { // 编辑
          // console.log(this.addLayeredName, this.addLayeredName.length)
          if (!this.addLayeredName && !this.addLayeredName.length) {
            this.xy.msgError('请输入分层名称。')
            return false
          }
          this.subList[this.tag1].Childrens[this.tag2].ThisName = this.addLayeredName
        }
        this.xy.loading()
        let params = {
          ClassTableID: this.classTableID,
          Models: this.subList
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassSubjectSetting/CreateSetting`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(this.isAddOrg ? '添加成功。' : '编辑成功。')
          this.modalAddOrg = false
          this.gitSub()
        } else {
          this.xy.msgError(res.msg)
          this.gitSub()
        }
      },
      // 取消添加子分层
      addOrgsCancel () {
        this.tags = []
        this.modalAddOrg = false
      },
      delLecel (cItem) { // 删除层
        let that = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '删除此层后，此学生的选课结果会作为未分层学生显示在课程下。确定删除吗?',
          async onOk () {
            that.xy.loading()
            let params = {
              ClassTableID: that.classTableID,
              SubjectGroupID: cItem.SubjectGroupID,
              ThisID: [cItem.ThisID]
            }
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassSubjectSetting/NewDeleteLevel`, params)
            that.xy.unloading()
            if (res.success) {
              that.xy.msgSuc('删除成功。')
              that.gitSub()
            }
          }
        })
      },
      // 导入选课
      ImportSelectedClass () {
        if (this.isOperation === 0) {
          this.$refs['upfile'].modalImport = true
          this.upload = {
            title: '导入选课', // 标题
            ipData: [], // 提示语句
            formtData: ['xlsx', 'xls'], // 支持的文件类型
            size: 1024, // 文件大小限制，单位 kb
            upUrl: `${this.$store.state.apiPath}/api/MovingClassStudentAchievement/Import?classTableID=${this.classTableID}`, // 上传文件url
            upParams: {}, // 上传参数
            templateUrl: `${this.$store.state.apiPath}/api/MovingClassStudentAchievement/DownloadTemplateImport?classTableID=${this.classTableID}`, // 模板下载url
            errorUrl: `${this.$store.state.apiPath}/api/MovingClassStudentAchievement/DownloadExceptionImport` // 下载错误文件url
          }
        }
      },
      modalSubmit () {
        this.loadTable()
        this.gitSub()
        this.$parent.getGeneralFlows()
      },
      moreFun (val) {
        switch (val) {
          case '1':this.exportSelectedClass(); break
          case '2':this.goStatisticalPage(); break
        }
      },
      // 导出选课
      exportSelectedClass () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/ExportSelectCourse`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          SeachText: this.searchText,
          StudentOrganizationIDS: this.checkAllGroup,
          ClassTableID: this.classTableID,
          Completetype: 0,
          AID: this.selectCourse.AID,
          Type: this.selectCourse.Type
        })
      },
      goStatisticalPage () {
        this.$store.commit('common/getParam', { pro: 'classTableOrder', step: 2 }) // 要返回的路由
        this.$router.push({
          path: 'goStatisticalAnalysis',
          query: this.$store.state.common.menuInfo
        })
      },
      goback () {
        this.$store.commit('common/getParam', { step: 2 })
        this.$router.push({
          path: `/xyhome/goClassStepsHeader/progress`,
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../../css/progress.less';
.no-data-modal {
  display: flex;
  flex-direction: column;
  padding: 50px;
  .no-class {
    text-align: center;
    font-size: 16px;
    color: rgb(127, 127, 127);
    margin-top: 20px;
  }
}
</style>
