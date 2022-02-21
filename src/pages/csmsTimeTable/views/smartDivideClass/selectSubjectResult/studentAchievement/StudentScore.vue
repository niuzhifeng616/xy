<!-- 2.选课结果：学生成绩 -->
<template>
  <div class="xy-content-body"
       id="StepsHeader">
    <div id="statisticalInfo">
      <!-- 筛选条件 -->
      <div class="progress-title"
           id='statistical'>
        <div>
          <Button class="xy-primary"
                  @click='batchImport'
                  :disabled="smartDivideStepsHeader.isOperation != 0"
                  style="margin: 0 5px;">导入成绩</Button>
          <Button class="ivu-btn-xy-danger"
                  :disabled="smartDivideStepsHeader.isOperation != 0"
                  @click="delAll"
                  style="margin: 0 5px;">清除成绩</Button>
        </div>
        <div class="student-class">
          <button-group style="margin-right: 10px;">
            <Button :class="!isSelectNum?'xy-primary':''"
                    @click="loadComplete(false)">全部</Button>
            <Button :class="isSelectNum?'xy-primary':''"
                    @click="loadComplete(true)">无成绩</Button>
          </button-group>
          <Button class="xy-info"
                  @click="filterClass">筛选班级</Button>
          <a-input-search placeholder="请输入用户名/学籍号/姓名"
            allowClear
            v-model.trim="searchText"
            @search='FromSubmit'
            style="width: auto;"/>
          <div @click="goBack"
               class="back">
            <i class="iconfont">&#xe6a5;</i>
            <span>返回</span>
          </div>

        </div>
      </div>
      <!-- 筛选班级 -->
      <modal v-model="classModal"
             :transfer="false"
             title="筛选班级"
             :mask-closable="false"
             width=645>
        <div v-if='moreClassList.length>0'
             style="margin: 10px 0">
          <Checkbox :value="classCheckAll"
                    :indeterminate="indeterminate"
                    @click.prevent.native="chooseAll">全选</Checkbox>
          <checkbox-group class='filter-class'
                          v-model="classOrganizationIDs"
                          @on-change="checkAllGroupChange">
            <checkbox class="label-width"
                      :label="i.StudentOrganizationID"
                      :key='i.StudentOrganizationID'
                      v-for='i in moreClassList'>
              <span class="span-width"> {{i.StudentOrganizationFullName}}</span>
              <span> ({{i.StuCount||0}}人)</span>
            </checkbox>
          </checkbox-group>
        </div>
        <div v-else
             class="no-data-modal">
          <img src="@/assets/common/nullData.svg"
               alt="图片" />
          <p class="no-class">
            您还没有班级的信息，请添加班级。
          </p>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="cancel">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="sureSelectedClass">确定</Button>
        </div>
      </modal>
      <div style="margin-bottom:10px ;"
           v-if='showClass.length>0'>
        <Alert show-icon
               closable>
          <span>已选择班级:</span>
          <span v-for="(i, index) in showClass"
                :key='index'>{{ i.StudentOrganizationFullName}}({{i.StuCount||0}}人){{index===showClass.length-1?'':'、'}}</span>。
        </Alert>
      </div>
      <score-table ref='children'></score-table>
      <XyUpfile ref="upfile"
                @successLoad='batchSubmit'
                :modalTitle="uptitle"
                :describeData="tipData"
                :fileFormt="formtData"
                :fileSize="size"
                :importPath="upUrl"
                :templateUrl="templateUrl"
                :errorUrl="errorUrl">
      </XyUpfile>
    </div>
  </div>
</template>

<script>
  import ScoreTable from './ScoreTable'
  import XyUpfile from '@/components/upFile/XyUpfile.vue'
  export default {
    components: { ScoreTable, XyUpfile },
    data () {
      return {
        // 上传
        uptitle: '导入选科结果',
        tipData: [],
        formtData: ['xls', 'xlsx'],
        size: 1024000,
        upUrl: '',
        templateUrl: '',
        errorUrl: '',
        // 搜索
        searchText: '',
        isSelectNum: false,
        // 已选学生
        SelectCount: 0,
        UnSelectCount: 0,
        total: 0,
        // 已选课程
        totalCrouse: 0,
        dataTableCourse: [],
        // 调整
        modalSelectClass: false,
        checkAll: false,
        checkAllGroup: [],
        columns: [],
        // 筛选班级
        indeterminate: false,
        classCheckAll: false,
        classOrganizationIDs: [],
        classModal: false,
        showClass: [],
        moreClassList: [],
        smartDivideStepsHeader: {},
        ScoreTable: {},
        // 引用成绩
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
          classTableName: [{
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
        isShowClass: false
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent
      this.getClass()
    },
    mounted () {
      this.ScoreTable = this.$refs.children
    },
    methods: {
      // 获取所有的班级
      async getClass () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetIDCOrganizationListByID/?id=${this.smartDivideStepsHeader.divideClassID}`)
        if (res.success) {
          if (res.data.length > 0) {
            this.moreClassList = res.data
          }
        }
      },
      filterClass () {
        this.classOrganizationIDs = []
        this.showClass.map(item => {
          this.classOrganizationIDs.push(item.StudentOrganizationID)
        })
        this.checkAllGroupChange(this.classOrganizationIDs) // 改变全选的状态
        this.classModal = true
      },
      // 筛选班级
      sureSelectedClass () {
        this.showClass = []
        this.moreClassList.map((item) => {
          if (this.classOrganizationIDs.length > 0) {
            this.classOrganizationIDs.map((t) => {
              if (t === item.StudentOrganizationID) {
                this.showClass.push(item)
              }
            })
          }
        })
        this.classModal = false
        this.searchText = ''
        this.ScoreTable.pagination.current = 1
        this.ScoreTable.getTable()
      },
      cancel () {
        this.classModal = false
      },
      // 筛选班级-----------全选
      chooseAll (item, index) {
        if (this.indeterminate) {
          this.classCheckAll = false
        } else {
          this.classCheckAll = !this.classCheckAll
        }
        this.indeterminate = false
        if (this.classCheckAll) {
          let arr = []
          this.moreClassList.map((item) => {
            arr.push(item.StudentOrganizationID)
          })
          this.classOrganizationIDs = arr
        } else {
          this.classOrganizationIDs = []
        }
      },
      // 单个改变
      checkAllGroupChange (data) {
        if (data.length === this.moreClassList.length && this.moreClassList.length > 0) {
          this.indeterminate = false
          this.classCheckAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.classCheckAll = false
        } else {
          this.indeterminate = false
          this.classCheckAll = false
        }
      },
      loadComplete (type) {
        this.isSelectNum = type
        this.searchText = ''
        this.ScoreTable.pagination.current = 1
        this.ScoreTable.getTable()
      },
      FromSubmit () {
        this.ScoreTable.pagination.current = 1
        this.ScoreTable.name = this.searchText
        this.ScoreTable.getTable()
      },
      // 批量导入
      batchImport () {
        if (this.smartDivideStepsHeader.isOperation === 0) {
          this.$refs['upfile'].modalImport = true
          this.upUrl = `${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/ImportAchievement?divideClassID=${this.smartDivideStepsHeader.divideClassID}`
          this.templateUrl = `${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/DownloadTemplateImportAchievement?divideClassID=${this.smartDivideStepsHeader.divideClassID}`
          this.errorUrl = `${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/DownloadExceptionImportAchievement`
        }
      },
      batchSubmit () {
        this.ScoreTable.pagination.current = 1
        this.ScoreTable.getTable()
      },
      // 清除成绩
      delAll () {
        if (this.smartDivideStepsHeader.isOperation === 0) {
          let that = this
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要清除成绩吗?',
            async onOk () {
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/SelectDisciplineDivideClass/DeleteAllByID?divideClassID=${that.smartDivideStepsHeader.divideClassID}`)
              if (res.success) {
                that.xy.msgSuc('清除成功。')
                that.ScoreTable.getTable()
              }
            }
          })
        }
      },
      goBack () {
        this.$router.go(-1)
      }

    }
  }
</script>
<style lang='less' scoped>
@import '../filterClass.less';
.progress-title > .class,
.student-class {
  display: flex;
}
.selected-class {
  font-size: 12px;
  color: #909399;
}
.back {
  color: #1890ff;
  margin-left: 20px;
  display: inline-block;
  cursor: pointer;
  .iconfont {
    margin-right: 5px;
    font-size: 14px;
  }
}
.progress-title {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px;
  margin-left: 0;
}

.menu-height {
  max-height: 150px;
  overflow: auto;
}

.subjectSetModal {
  padding: 10px 20px;
}

.subjectSetModal > .subjectSetCheckbox {
  margin: 10px 0;
}

.subjectSetCheckbox .ivu-checkbox-wrapper {
  width: 30%;
  margin: 10px 0;
}

.prompt {
  color: #ed4014;
  margin-left: 100px;
}
.xy-primary {
  margin-right: 0;
}
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
