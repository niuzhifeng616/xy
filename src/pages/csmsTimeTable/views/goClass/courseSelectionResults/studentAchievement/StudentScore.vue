<!-- 3.选课结果-学生成绩 -->
<template>
  <div class="xy-content-body">
    <div>
      <!-- 筛选条件 -->
      <div class="progress-title" id='statistical'>
        <div>
          <!-- <Button  class="xy-primary" @click="ReferenceScore">引用成绩</Button> -->
          <Button  class="xy-primary" @click='batchImport' :disabled="isOperation != 0" style="margin: 0 5px;">导入成绩</Button>
          <Button class="xy-danger" :disabled="isOperation != 0" @click="delAll" style="margin: 0 5px;">清除成绩</Button>
        </div>
        <!-- 已选未选班级 -->
        <div style="margin:0px auto ;display: flex;justify-content: center;">
          <button-group size='small'>
            <Button :type="!isSelectNum?'primary':'default'" @click="loadComplete(false)">全部</Button>
            <Button :type="isSelectNum?'primary':'default'" @click="loadComplete(true)">无成绩</Button>
          </button-group>
        </div>
        <div>
          <Button  class="xy-info" @click="filterClass">筛选班级</Button>
          <i-input search clearable v-model.trim="searchText" @on-search="FromSubmit" placeholder="请输入用户名/学籍号/姓名"
            class="xy-content-title-search" style="width: auto;">
            <icon type="ios-search cursor-p" slot="suffix" />
          </i-input>
          <Button  @click="goback" style="margin: 0 5px;">返回</Button>
        </div>
      </div>
      <div style="background: #F3F3F3;padding-left: 15px;margin-bottom:10px ;" v-if='showClass.length>0'>
        <span class="selected-class"> 已选择班级:</span>
        <span v-for='(i,index) in showClass'
        :key="index"
          class="chooseClass selected-class">{{i.StudentOrganizationName}}{{index===showClass.length-1?'':'、'}}</span>
      </div>
      <!-- 表格 -->
      <div>
        <XyAntTable
          :columns="columns"
          :dataSource="datatable"
          nullData="该搜索条件下没有结果。"
          :scrollx="'max-content'"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange">
          <!-- :rowSelection="tableRowSelection" -->
          <!-- 头像 -->
          <div slot="IconRender" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${!record.sex ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.FullName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
          </div>
          <!-- 姓名 -->
          <div slot="FullNameRender" slot-scope="text, record">
            <span class="table-el-hover" v-if="isOperation === 0" @click="adjust(record)">
              {{record.FullName}}
            </span>
            <span v-else>
              {{record.FullName}}
            </span>
          </div>
          <!-- 用户名 -->
          <div slot="UserNameRender" slot-scope="text, record" style="min-width:120px">
            <span>
              {{record.UserName}}
            </span>
          </div>
          <!-- 性别 -->
          <div slot="SexRender" slot-scope="text, record">
            <span>
              {{record.sex ? '男' : '女'}}
            </span>
          </div>
          <!-- 原行政班 -->
          <div slot="ClassNameRender" slot-scope="text, record" style="min-width:150px">
            <span>
              {{record.ClassName}}
            </span>
          </div>
          <!-- 操作 -->
          <span slot="operaRender" slot-scope="text, record">
            <a @click="adjust(record)"  :disabled="isOperation !== 0">编辑</a>
          </span>
        </XyAntTable>
      </div>
      <modal v-model="changeScoreModal" class="selectResultModal" :transfer="false" title="调整成绩"
      :mask-closable="false"  width=560>
        <h3 class="text-center studentScoreAdujstTitle">{{StudentName}}的成绩</h3>
        <ul style="margin-top: 15px">
          <li class="studentScoreAdujst">
            <div v-for='(item, i) in formSubject' :key="i">
              <span class="title nowrap" :title="item.Name.length>5?item.Name+':':''">{{item.Name}}:</span>
              <input-number class="inp-num" :min="0" v-model='item.Score' placeholder="请输入成绩">
              </input-number>
            </div>
          </li>
        </ul>

        <div slot="footer">
          <Button class="xy-modal-close" @click="changeScoreModal=false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="surechangeScore">确定</Button>
        </div>
      </modal>
      <!-- <div id='ModalImportFile'></div> -->
      <!-- 筛选班级 -->
      <modal v-model="classModal" :transfer="false" title="筛选班级" :mask-closable="false"
         width=550>
        <ul>
          <li v-for='(item, index) in moreClassList' style="margin: 10px 0" :key="index">
            <div v-if='moreClassList && moreClassList[0] && moreClassList[0].levelList && moreClassList[0].levelList[0] && moreClassList[0].levelList[0].StudentOrganizationID > 0'>
              <Checkbox v-model="item.checked" @on-change='chooseAll(item,index)'>全选</Checkbox>
              <checkbox-group style="margin-top: 10px;" v-model="item.checkAllGroup"
                @on-change="checkAllGroupChange(index)">
                <checkbox style=' padding: 10px 0 10px 0;' :label="i.StudentOrganizationID"
                  :key='i.StudentOrganizationID' v-for='i in item.levelList'>
                  {{i.StudentOrganizationName}}
                </checkbox>
              </checkbox-group>
            </div>
          </li>
        </ul>
        <div slot="footer">
          <Button class="xy-modal-close" @click="classModal = false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="sure">确定</Button>
        </div>
      </modal>
    </div>
     <XyUpfile
      ref="upfile"
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
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import XyUpfile from '@/components/upFile/XyUpfile'
  // const poto = require('@/assets/common/yrykb.png')
  export default {
    name: 'studentScore',
    components: {
      XyAntTable,
      XyUpfile
    },
    data () {
      return {
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
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

        StudentID: '',
        StudentName: '',
        // 已选课程
        totalCrouse: 0,
        dataTableCourse: [],
        // 调整成绩
        changeScoreModal: false,
        formSubject: [], // 调整成绩
        searchText: '',
        isSelectNum: false,
        // 已选学生
        SelectCount: 0,
        UnSelectCount: 0,
        total: 0,
        // 调整
        modalSelectClass: false,
        checkAll: false,
        checkAllGroup: [],

        // 筛选班级
        classOrganizationIDs: [],
        classModal: false,
        showClass: [],
        moreClassList: [{
          checkAllGroup: [], // 已选择的
          checked: false,
          levelList: [{
            StudentOrganizationName: '',
            StuCount: 0,
            StudentOrganizationID: null,
            checked: false
          }]
        }],
        // 引用成绩
        loading: true,
        modalCreate: false,
        schoolData: [],
        studentGradeData: [],
        planlData: [],
        formValidateOK: {
          school: '',
          gradeYear: '',
          classTableName: ''
        },
        ruleValidateOK: {
          school: [{
            type: 'number',
            required: true,
            message: '请选择校区',
            trigger: 'change'
          }],
          gradeYear: [{
            type: 'number',
            required: true,
            message: '请选择年级',
            trigger: 'change'
          }],
          classTableName: [
            {
              required: true,
              message: '成绩不能为空',
              trigger: 'blur'
            },
            {
              max: 15,
              message: '成绩不能超过15个字',
              trigger: 'blur'
            }
          ]
        },
        ids: ''
      }
    },
    created () {
      this.loadComplete(false)
    },
    mounted () {
    },
    methods: {
      // 获取选课结果（学生）
      async loadTable () {
        this.tableLoading = true
        this.ids = this.classOrganizationIDs
        this.ids = this.ids.length > 0 ? this.ids.join(',') : ''
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/GetPage`, {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          classTableID: this.classTableID,
          studentOrganizationIDs: this.ids,
          name: this.searchText,
          // SeachText: this.searchText,
          achievement: this.isSelectNum
        })
        if (res.success) {
          var datas = res.data
          this.pagination.total = datas.TotalRecords
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
              width: 150,
              fixed: 'left'
            }, {
              title: '用户名',
              dataIndex: 'UserName',
              scopedSlots: { customRender: 'UserNameRender' },
              fixed: 'left'
            }, {
              title: '性别',
              dataIndex: 'Sex',
              scopedSlots: { customRender: 'SexRender' },
              width: 80
            }, {
              title: '原行政班',
              dataIndex: 'ClassName',
              scopedSlots: { customRender: 'ClassNameRender' }
            }
          ]
          for (var i = 0; i < datas.Courses.length; i++) {
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
            width: 80,
            fixed: 'right'
          })
          var resData = datas.Result
          for (var j = 0; j < resData.length; j++) {
            if (resData[j].Courses.length > 0) {
              for (var k = 0; k < resData[j].Courses.length; k++) {
                resData[j]['result' + k] = resData[j].Courses[k].Score
              }
            };
            // this.$set(resData[j], 'key', j)
          }
          this.datatable = resData
          // 调整成绩，弹框显示的课程
          this.formSubject = datas.Courses
        }
        this.tableLoading = false
      },
      handleTableChange () {
        this.loadTable()
      },
      FromSubmit () {
        this.pagination.current = 1
        this.loadTable()
      },
      // 选中的调整
      adjust (row) {
        this.StudentID = row.StudentID
        this.StudentName = row.FullName
        this.changeScoreModal = true
        // 显示学生成绩
        if (row.Courses.length > 0) {
          row.Courses.map((item) => {
            this.formSubject.map((j) => {
              if (item.AID === j.CoursePlanID) {
                j.Score = item.Score === '' ? '' : item.Score * 1
              }
            })
          })
        }
      },
      async surechangeScore () {
        var arr = []
        this.formSubject.map((item) => {
          arr.push({ AID: item.CoursePlanID, Score: item.Score === '' || item.Score === null ? '' : item.Score * 1 })
        })
        let params = {
          'StudentID': this.StudentID,
          'ClassTableID': this.classTableID,
          'AchievemnetList': arr
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/EditStudentAchievement`, params)
        if (res.success) {
          this.xy.msgSuc('调整成功。')
          this.changeScoreModal = false
          this.loadTable()
        }
      },
      loadComplete (type) {
        this.isSelectNum = type
        this.searchText = ''
        this.loadTable()
      },
      goback () {
        this.$store.commit('common/getParam', { step: 2 })
        this.$router.push({
          path: `/xyhome/goClassStepsHeader/progress`,
          query: this.$store.state.common.menuInfo
        })
      },
      // 批量导入
      batchImport () {
        if (this.isOperation === 0) {
          this.$refs['upfile'].modalImport = true
          this.upload = {
            title: '导入学生成绩', // 标题
            ipData: [], // 提示语句
            formtData: ['xlsx', 'xls'], // 支持的文件类型
            size: 1024, // 文件大小限制，单位 kb
            upUrl: `${this.$store.state.apiPath}/api/MovingClassStudentAchievement/ImportAchievement?classTableID=${this.classTableID}`, // 上传文件url
            upParams: {}, // 上传参数
            templateUrl: `${this.$store.state.apiPath}/api/MovingClassStudentAchievement/DownloadTemplateImportAchievement?classTableID=${this.classTableID}`, // 模板下载url
            errorUrl: `${this.$store.state.apiPath}/api/MovingClassStudentAchievement/DownloadExceptionImportAchievement` // 下载错误文件url
          }
        }
      },
      modalSubmit () {
        this.loadTable()
      },
      // 清除成绩
      delAll () {
        let that = this
        if (that.isOperation === 0) {
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要清除成绩吗?',
            async onOk () {
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassStudentAchievement/ClearAchievement?classTableID=${that.classTableID}`, null)
              if (res.success) {
                that.xy.msgSuc('清除成功。')
                that.loadTable()
              }
            }
          })
        }
      },
      // --------------筛选班级start-----------
      filterClass () {
        this.classModal = true
        this.getClass()
      },
      sure () {
        this.showClass = []
        this.classOrganizationIDs = []
        this.moreClassList.map((item) => {
          if (item.checkAllGroup.length > 0) {
            this.classOrganizationIDs = this.classOrganizationIDs.concat(item.checkAllGroup)
            item.levelList.map((t) => {
              if (t.checked) {
                this.showClass.push(t)
              }
            })
          }
        })
        this.loadTable()
        this.classModal = false
      },
      // 获取所有的班级
      async getClass () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassStudentAchievement/GetClassList?classTableID=${this.classTableID}`, null)
        this.xy.unloading()
        if (res.success) {
          res.data.map((item) => {
            item.checked = false
          })
          this.moreClassList[0].levelList = res.data
        }
      },
      chooseAll (item, index) {
        if (this.moreClassList[index].checked) {
          var arr = []
          this.moreClassList[index].levelList.map((item) => {
            item.checked = true
            arr.push(item.StudentOrganizationID)
          })
          this.moreClassList[index].checkAllGroup = arr
        } else {
          this.moreClassList[index].checkAllGroup = []
          this.moreClassList[index].levelList.map((item) => {
            item.checked = false
          })
        }
      },
      // 单个改变
      checkAllGroupChange (index) {
        if (this.moreClassList[index].checkAllGroup.length === this.moreClassList[index].levelList.length) {
          this.moreClassList[index].checked = true
        } else {
          this.moreClassList[index].checked = false
        }
        this.moreClassList[index].levelList.map((item) => {
          item.checked = false
          this.moreClassList[index].checkAllGroup.map((t) => {
            if (item.StudentOrganizationID === t) {
              item.checked = true
            }
          })
        })
      }
      // --------------筛选班级end-----------
    }
  }
</script>
<style lang="less" scoped>
  @import '../../css/progress.less';
</style>
