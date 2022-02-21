<!-- 11.排自习-添加学生-->
<template>
  <div>
    <div class="xy-content-title">
        <div class="clearfix">
            <div class="fl">
                <Button class="xy-primary" @click="addClass" :disabled="isOperation1 !== 0">添加学生</Button>
                <Button class="xy-danger" @click="delBatch" :disabled="isOperation1 !== 0">批量删除</Button>
                <Button class="xy-danger" @click="delAll" :disabled="isOperation1 !== 0">全部删除</Button>
                <Button class="xy-info" @click="back">返回</Button>
            </div>
            <div class="fr pr">
                <Input search
                    clearable
                    v-model.trim="searchName"
                    @on-search="FromSubmit"
                    placeholder="请输入用户名/学籍号/姓名"
                    class="xy-content-title-search"
                    style="width: auto;" />
            </div>
        </div>
        <Alert show-icon style="margin-top:8px;">为“{{student.ClassName}}”添加和删除学生。</Alert>
    </div>
    <div class="xy-content-body">
        <div class="editor-student" v-if="datatable.length>0">
            <div class="edito-header" @click="checkAllCheck">
                <span class="handle-crile"
                      :class="isSelectAll?'handle-crile-active':''"
                      style="vertical-align: middle;">
                    <Icon type="md-checkmark" style="color:#4196FF" v-if="isSelectAll" />
                </span>
                <span class="ml-15">全选</span>
            </div>
            <div class="editor-body">
                <ul class="student-ul">
                    <li class="student-li"
                        v-for="item in datatable"
                        :key="item.StudentID"
                        :class="selectionAll.indexOf(item.StudentID)!==-1?'student-li-active':''">
                        <div class="handle-icon handle-crile"
                              @click="check(item)"
                              :class="selectionAll.indexOf(item.StudentID)!==-1?'handle-crile-active':''">
                            <Icon type="md-checkmark" style="color:#4196FF" v-if="selectionAll.indexOf(item.StudentID)!==-1" />
                        </div>
                        <div class="student-info">
                            <span class="crile first-crile"></span>
                            <span class="info1">用户名:</span>
                            <span v-if="item.UserName.length>10" :title="item.UserName">{{item.UserName.substr(0,10)}}...</span>
                            <span v-else>{{item.UserName}}</span>
                        </div>
                        <div class="student-info">
                            <span class="crile second-crile"></span>
                            <span class="info1">姓名:</span>
                            <span v-if="item.UserName.length>10" :title="item.FullName">{{item.FullName.substr(0,10)}}...</span>
                            <span v-else>{{item.FullName}}</span>
                        </div>
                        <div class="student-info">
                            <span class="crile three-crile"></span>
                            <span class="info1">原班级:</span>
                            <span>{{item.ClassName}}</span>
                        </div>
                        <div class="text-center">
                            <button class="danger-btn shape-circle"
                                    :class="isOperation1 === 0?'':'btn-disabled'"
                                    @click="del(item)">
                                删除
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="edito-fotter">
                <page :total="total"
                      :page-size="pageSize"
                      :current="pageCurrent"
                      :page-size-opts="pages"
                      show-sizer
                      show-total
                      @on-change="changePage"
                      @on-page-size-change="changePageSize">
                </page>
            </div>
        </div>
        <div v-if="datatable.length===0" class="no-data-box">
            <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
            <span class="no-data-text">
                该搜索条件下没有结果。
            </span>
        </div>
    </div>

    <!--添加学生 -->
    <modal v-model="modalAddStudent"
            v-if="isOperation1 === 0"
            :title="'为'+student.ClassName+'添加学生'"
            :transfer="false"
            :mask-closable="false">
        <div class="clearfix">
            <div class="fl">
                <checkbox v-model="checkAll"
                          @on-change="handleCheckAll"
                          style="margin-bottom:10px;">
                    <span>全选</span>
                    <span style="margin-left:10px">共选择(<b>{{checkAllGroup.length}}</b>)人</span>
                </checkbox>
            </div>
            <div class="fr pr">
                <i-input search
                         clearable
                          v-model.trim="searchStuden"
                          @on-search="addStudentSearch"
                          placeholder="请输入用户名/学籍号/姓名"
                          class="fr xy-content-title-search"
                          style="width: auto;">
                    <icon type="ios-search cursor-p" slot="suffix" />
                </i-input>
            </div>
        </div>
        <div v-if="studentList.length > 0" class="select-student">
            <checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange" class="check-list">
                <checkbox :label="item.StudentID" class="student-one"
                          v-for="item in studentList"
                          :key="item.StudentID"
                          :data-id="item.StudentID"
                          :data-searchName="item.FullName+item.UserName">
                    <div>
                        <h3>{{item.FullName}}</h3>
                        <p>{{item.UserName}}</p>
                        <p>{{item.ClassName}}</p>
                    </div>
                </checkbox>
            </checkbox-group>
        </div>
        <div v-else class="modal-null">
            <img class="img" src="@/assets/common/nullData.svg" />
            <span class="text">
                该搜索条件下没有结果。
            </span>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalAddStudent = false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="addStudenSubmit">确定</Button>
        </div>
    </modal>
</div>
</template>
<script>
  export default {
    components: {
    },
    name: 'StudentTable',
    data () {
      return {
        isOperation1: this.$store.state.csmstimetable.classComValKW.base.isOperation1,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        searchStuden: '',
        tableSelectData: [],
        modalAddStudent: false,
        checkAll: false,
        checkAllGroup: [],
        checkAllGroupData: [],
        studentList: [],
        student: JSON.parse(this.$store.state.csmstimetable.selfStudyStudent),
        searchName: '',
        total: 0, // 总条数
        pageCurrent: 1, // 当前页码
        pageList: '', // 当前页数据条数
        pageSize: 15, // 每页显示条数
        pages: [15, 30, 50, 100], // 默认每页可选10/20/50/100条
        datatable: [],
        selectionAll: [],
        isSelectAll: false
      }
    },

    created () {
    },
    mounted () {
      this.getTP()
    },
    methods: {
      // 获取列表
      async getTP () {
        this.xy.loading()
        let params = {
          classID: this.student.ClassID,
          pageIndex: this.pageCurrent,
          pageSize: this.pageSize,
          sloverResultCollectionID: this.student.SloverResultCollectionID,
          name: this.searchName
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverSelfStudy/GetSloverSelfStudyStudent`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.data.length > 0) {
            this.datatable = res.data.data
            this.total = res.data.totalRecords
            if (res.data.data.length === 0) {
              this.pageList = 0
            } else {
              this.pageList = res.data.data.length
            };
          } else {
            this.datatable = []
          }
        }
      },
      // 全选
      checkAllCheck () {
        this.isSelectAll = !this.isSelectAll
        if (this.isSelectAll) { // 选中
          this.datatable.map((item) => {
            this.selectionAll.push(item.StudentID)
            this.tableSelectData.push(item)
            return item
          })
        } else { // 取消选中
          this.selectionAll = []
          this.tableSelectData = []
        }
      },
      check (val) {
        let index = this.selectionAll.map((item) => { return item }).indexOf(val.StudentID)
        if (index === -1) {
          this.selectionAll.push(val.StudentID)
          this.tableSelectData.push(val)
          if (this.selectionAll.length === this.datatable.length) { // 选中最后一个，全选做选中
            this.isSelectAll = true
          }
        } else {
          this.selectionAll.splice(index, 1)
          this.tableSelectData.splice(index, 1)
          if (this.selectionAll.length !== this.datatable.length) { // 取消全选
            this.isSelectAll = false
          }
        }
      },
      // 删除
      del (row) {
        if (this.isOperation1 === 0) {
          let that = this
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除' + row.FullName + '吗？',
            async onOk () {
              let params = {
                SloverResultCollectionID: row.SloverResultCollectionID,
                ClassID: row.ClassID,
                StudentID: row.StudentID
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/SloverSelfStudy/DeleteClassStudent`, params)
              if (res.success) {
                if (that.pageList > 1) {
                  that.pageList = that.pageList - 1
                } else {
                  if (that.pageCurrent > 1) {
                    that.pageCurrent = that.pageCurrent - 1
                  };
                };
                that.getTP()
                that.selectionAll = []
                that.tableSelectData = []
                that.isSelectAll = false
              }
            }
          })
        }
      },
      // 批量删除
      delBatch () {
        if (this.isOperation1 === 0) {
          let that = this
          if (that.tableSelectData.length === 0) {
            that.xy.msgError('请选择要删除的学生。')
          } else {
            let postData = []
            for (let i = 0; i < that.tableSelectData.length; i++) {
              postData.push({
                SloverResultCollectionID: that.tableSelectData[i].SloverResultCollectionID,
                ClassID: that.tableSelectData[i].ClassID,
                StudentID: that.tableSelectData[i].StudentID
              })
            };
            that.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除选中的学生吗？',
              async onOk () {
                let res = await that.xy.post(`${that.$store.state.apiPath}/api/SloverSelfStudy/DeleteClassStudentList`, postData)
                if (res.success) {
                  if (that.selectionAll.length === that.pageList && that.pageCurrent > 1) {
                    that.pageCurrent = that.pageCurrent - 1
                  }
                  that.getTP()
                  that.selectionAll = []
                  that.tableSelectData = []
                  that.isSelectAll = false
                }
              }
            })
          }
        }
      },
      // 全部删除
      delAll () {
        if (this.isOperation1 === 0) {
          let that = this
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除全部学生吗？',
            async onOk () {
              let params = {
                ClassID: that.student.ClassID,
                SloverResultCollectionID: that.student.SloverResultCollectionID
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/SloverSelfStudy/DeleteClassStudents`, params)
              if (res.success) {
                that.getTP()
                that.selectionAll = []
                that.tableSelectData = []
                that.isSelectAll = false
              }
            }
          })
        }
      },
      // 搜索
      FromSubmit () {
        this.pageCurrent = 1
        this.getTP()
      },
      // 单击页码触发
      changePage (current) {
        this.pageCurrent = current
        this.getTP()
      },
      // 单击切换每页展示条数触发
      changePageSize (size) {
        this.pageSize = size
        this.pageCurrent = 1
        this.getTP()
      },
      // 获取添加学生列表
      async addClass () {
        if (this.isOperation1 === 0) {
          this.checkAll = false
          this.checkAllGroup = []
          this.xy.loading()
          let params = {
            classID: this.student.ClassID,
            sloverResultCollectionID: this.student.SloverResultCollectionID
          }
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverSelfStudy/GetSloverSelfStudyAppendStudentList`, params)
          this.xy.unloading()
          if (res.success) {
            this.studentList = []
            this.checkAllGroupData = []
            this.studentList = res.data
            let arr = []
            arr = res.data
            for (let i = 0; i < arr.length; i++) {
              this.checkAllGroupData[i] = arr[i]
            }
            this.modalAddStudent = true
            this.searchStuden = ''
          }
        }
      },
      // 全选
      handleCheckAll (val) {
        if (val) {
          this.studentList.map((item) => {
            this.checkAllGroup.push(item.StudentID)
          })
          this.checkAll = true
        } else {
          this.checkAllGroup = []
          this.checkAll = false
        }
      },
      checkAllGroupChange (data) {
        if (data.length === this.studentList.length) {
          this.checkAll = true
        } else {
          this.checkAll = false
        }
      },
      // 添加学生搜索
      addStudentSearch () {
        let arr = []
        arr = this.checkAllGroupData
        this.studentList = []
        for (let i = 0; i < arr.length; i++) {
          this.studentList.push(arr[i])
        }
        this.checkAll = false
        this.checkAllGroup = []

        if (this.searchStuden !== '') {
          this.studentList = this.studentList.filter((item) => {
            if (item.FullName.indexOf(this.searchStuden) !== -1 || item.UserName.indexOf(this.searchStuden) !== -1 || item.SchoolCardNumber.indexOf(this.searchStuden) !== -1) {
              return item
            }
          })
        }
      },
      // 添加学生保存
      async addStudenSubmit () {
        if (this.checkAllGroup.length === 0) {
          this.xy.msgError('请选择要添加的学生。')
          return false
        }
        let postData = []
        if (this.checkAllGroup.length > 0) {
          for (let item of this.checkAllGroup) {
            for (const iterator of this.studentList) {
              if (item === iterator.StudentID) {
                postData.push({
                  SloverResultCollectionID: iterator.SloverResultCollectionID,
                  ClassID: iterator.ClassID,
                  StudentID: iterator.StudentID
                })
              }
            }
          }
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverSelfStudy/AppendClassStudent`, postData)
        if (res.success) {
          this.modalAddStudent = false
          this.getTP()
          this.xy.msgSuc(res.msg || '保存成功。')
        }
      },
      // 返回
      back () {
        this.$store.commit('common/getParam', { step: 10 })
        this.$router.push({
          path: `/xyhome/goClassStepsHeader/rowSelfStudy`,
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/rowSelfStudy.less';
</style>
