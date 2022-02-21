<template>
  <!-- 8.选课规则-连选设置 -->
  <div>
    <div class="EvenSelected-rule">
        <div class="clearfix" style="margin:20px 0;">
            <div class="fl">
                <div class="fl">
                    <Button class="xy-primary" @click="creatMutually(true)" :disabled="isOperation !== 0">创建连选课程</Button>
                    <!-- <span class="iconfont" style="font-size: 12px; margin: 0 5px 0 -8px;">&#xe6a2;</span> -->
                    <Button class="xy-danger" @click="delAll" :disabled="isOperation !== 0?true:!isNullData?false:true">批量删除</Button>
                    <Button class="xy-info" @click="checkAll" :disabled="isOperation !== 0?true:!isNullData?false:true">
                        <span v-if="!isSelectAll">全选</span>
                        <span v-if="isSelectAll">取消全选</span>
                    </Button>
                </div>
            </div>
            <!-- <Alert show-icon closable class="fl" style="margin-left:32px;">两门课程可组成一个连选课程组，学生选了其中一门课程自动选中另一门课程。</Alert> -->
        </div>

        <div class="xy-content-table">
            <div v-if="!isNullData && !isLoading">
              <ul class="CourseMutex-ul">
                  <li v-for="(item, n) in dataTable" :key="n"
                      :class="selectionAll.indexOf(item.CoursePlanSelectiveCourseID)!==-1?'CourseMutex-li-active':''">
                      <div class="CourseMutex-header clearfix">
                          <div class="header-icon">
                              <Icon type="ios-paper-outline" color="#4196FF" size="20" />
                          </div>
                          <div class="header-title">连选设置</div>
                          <div class="header-check"
                              :class="selectionAll.indexOf(item.CoursePlanSelectiveCourseID)!==-1?'header-check-active':''"
                              @click="check(item)">
                              <i class="fa fa-check" aria-hidden="true" style="color:#FFF" v-if="selectionAll.indexOf(item.CoursePlanSelectiveCourseID)!==-1"></i>
                          </div>
                      </div>
                      <div class="CourseMutex-body nowrap">
                          <span class="nowrap"
                                :title="name"
                                v-for="(name, index) in item.SubjectNameArr" :key="index">{{name}}</span>
                      </div>
                      <div class="CourseMutex-footer" @click="delOne(item)">
                          <Icon type="ios-trash-outline" color="#999" size="18" />
                          <span>删除</span>
                      </div>
                  </li>
              </ul>
              <div class="text-right pr" style="margin-top:10px;">
                  <page :total="total"
                        :page-size="pageSize"
                        :current="pageCurrent"
                        :page-size-opts="pages"
                        show-sizer
                        show-total
                        @on-change="changePage"
                        @on-page-size-change="changePageSize"></page>
              </div>
            </div>
            <div v-if="isNullData && !isLoading" class="no-data-box">
              <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
              <span class="no-data-text">您还没有连选设置的信息，请添加设置。</span>
            </div>
            <!-- <div v-if="isLoading" class="is-loading">
              <div>
                <img :src="require('@/assets/common/loading.png')" alt="" />
              </div>
            </div> -->
            <!--创建连选课程组-->
            <Modal v-model="modalCreatMutually"
                   :mask-closable="false"
                   :closable="false"
                   width="864"
                   v-if="isOperation === 0"
                   :transfer="false">
                <p slot="header">创建连选课程组</p>
                <!-- <alert show-icon style="margin:20px 0px;">
                    分别从两列中各勾选一门课程组成连选课程组。
                </alert> -->
                <div class="EvenSelected-modal">
                    <row>
                        <i-col span="12">
                            <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                                <div style="padding-bottom:10px;" v-for="(item, index) in leftCrouseData" :key="index">
                                    <div>{{item.SubjectCategoryName}}</div>
                                    <radio-group v-model="leftSelectSubject" vertical @on-change="subjectLeftRadio(item)">
                                        <radio :label="subject" v-for="(subject, n) in item.Levels" :key="n">
                                            <span class="f14">{{subject.SubjectName}}</span>
                                        </radio>
                                    </radio-group>
                                </div>
                            </div>

                        </i-col>
                        <i-col span="12" style="padding-left:20px;">
                            <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                                <div style="padding-bottom:10px;" v-for="(item, index) in rigthCrouseData" :key="index">
                                    <div>{{item.SubjectCategoryName}}</div>
                                    <radio-group v-model="rigthSelectSubject" vertical>
                                        <radio :label="subject" v-for="(subject, n) in item.Levels" :key="n">
                                            <span class="f14">{{subject.SubjectName}}</span>
                                        </radio>
                                    </radio-group>
                                </div>
                            </div>
                        </i-col>
                    </row>
                </div>
                <div slot="footer">
                    <Button class="xy-modal-close" @click="modalCreatMutually = false">取消</Button>
                    <Button class="xy-modal-primary" shape="circle" @click="submitMutually">保存</Button>
                    <Button class="xy-modal-primary" shape="circle" @click="submitContinueMutually">保存并继续</Button>
                </div>
            </Modal>
        </div>
    </div>

</div>

</template>
<script>
  export default {
    name: 'TLArrangRuleClassPlatoon',
    components: {

    },
    data () {
      return {
        isSelectAll: false,

        isLoading: true,
        isNullData: false,
        total: 0, // 总条数
        pageCurrent: 1, // 当前页码
        pageList: '', // 当前页数据条数
        pageSize: 15, // 每页显示条数
        pages: [15, 30, 50, 100],
        dataTable: [],
        selectionAll: [],

        // 创建连选课程组
        modalCreatMutually: false,
        crouseType: 'P',
        leftCrouseData: [],
        leftSelectSubject: '',
        rigthCrouseData: [],
        rigthSelectSubject: '',
        aid: 0,

        isOperation: true,
        classTableID: 0
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.classTableID
    },
    mounted () {
      this.getTP()
    },
    methods: {
      // 列表数据
      async getTP () {
        this.xy.loading()
        this.isLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/GetCourseplanSelectiveCoursePage`, {
          pageIndex: this.pageCurrent,
          pageSize: this.pageSize,
          classTableID: this.classTableID
        })
        this.isLoading = false
        this.xy.unloading()
        if (res.success) {
          this.dataTable = res.data.data
          this.total = res.data.totalRecords
          this.isSelectAll = false

          for (var i = 0; i < this.dataTable.length; i++) {
            this.dataTable[i].SubjectNameArr = this.dataTable[i].SubjectNames.split(',')
          };

          if (this.dataTable.length > 0) {
            this.pageList = this.dataTable.length
            this.isNullData = false
          } else {
            this.pageList = 0
            this.isNullData = true
            this.selectionAll = []
          }
        }
      },
      // 全选
      checkAll () {
        if (this.isOperation === 0 && !this.isNullData) {
          var _this = this
          this.isSelectAll = !this.isSelectAll
          if (this.isSelectAll) { // 选中
            this.dataTable.map((item) => {
              _this.selectionAll.push(item.CoursePlanSelectiveCourseID)
              return item
            })
          } else { // 取消选中
            this.selectionAll = []
          }
        }
      },
      check (val) {
        var index = this.selectionAll.map((item) => { return item }).indexOf(val.CoursePlanSelectiveCourseID)
        if (index === -1) {
          this.selectionAll.push(val.CoursePlanSelectiveCourseID)
          if (this.selectionAll.length === this.dataTable.length) { // 选中最后一个，全选做选中
            this.isSelectAll = true
          }
        } else {
          this.selectionAll.splice(index, 1)
          if (this.selectionAll.length !== this.dataTable.length) { // 取消全选
            this.isSelectAll = false
          }
        }
      },
      // 单击页码触发
      changePage (current) {
        $(window).scrollTop(0)
        this.pageCurrent = current
        this.getTP()
      },
      // 单击切换每页展示条数触发
      changePageSize (size) {
        $(window).scrollTop(0)
        this.pageSize = size
        this.pageCurrent = 1
        this.getTP()
      },
      // 删除
      delOne (row) {
        var _this = this
        if (_this.isOperation === 0) {
          _this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除此连选课程组吗？',
            async onOk () {
              _this.xy.loading()
              let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/CourseplanSelectiveCourseDelete`, {
                id: row.CoursePlanSelectiveCourseID,
                ClassTableID: _this.classTableID
              })
              _this.xy.unloading()
              if (res.success) {
                _this.xy.msgSuc('删除成功。')
                _this.isSelectAll = false
                _this.selectionAll = []
                _this.getTP()
              }
            }
          })
        }
      },

      // 批量删除
      delAll () {
        if (this.selectionAll.length === 0) {
          this.xy.msgError('请勾选要删除的连选课程组。')
        } else {
          var ids = ''
          for (var i = 0; i < this.selectionAll.length; i++) {
            ids += this.selectionAll[i] + ','
          }
          var _this = this
          _this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除所有选中的连选课程组吗？',
            async onOk () {
              _this.xy.loading()
              let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/CourseplanSelectiveCourseDeleteByIds`, {
                ids: ids,
                ClassTableID: _this.classTableID
              })
              _this.xy.unloading()
              if (res.success) {
                _this.xy.msgSuc('删除成功。')
                _this.isSelectAll = false
                _this.selectionAll = []
                _this.getTP()
              }
            }
          })
        }
      },
      // 创建连选课程组
      async creatMutually (isShowModal) {
        this.leftSelectSubject = ''
        this.rigthSelectSubject = ''
        this.leftCrouseData = []
        this.rigthCrouseData = []
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/GetCourseplanSelective_ATree`, {
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          var resData = res.data
          this.leftCrouseData = resData

          this.rigthCrouseData = resData
          if (isShowModal) {
            this.crouseType = 'P'
            this.modalCreatMutually = true
          }
        }
      },
      subjectRadio (val) { // 选择互斥课程

      },
      async subjectLeftRadio () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/GetCourseplanSelective_BTree`, {
          classTableID: this.classTableID,
          aid: this.leftSelectSubject.AID
        })
        this.xy.unloading()
        if (res.success) {
          var resData = res.data
          this.rigthCrouseData = resData
          this.rigthSelectSubject = ''
        }
      },
      // 保存
      submitMutually () {
        if (this.leftSelectSubject === '' || this.rigthSelectSubject === '') {
          this.xy.msgError('请分别从两列中各勾选一门课程组成连选课程组。')
          return false
        };
        this.createCourseplanMutexGroup(false)
      },
      submitContinueMutually () { // 保存并继续
        if (this.leftSelectSubject === '' || this.rigthSelectSubject === '') {
          this.xy.msgError('请分别从两列中各勾选一门课程组成连选课程组。')
          return false
        };
        this.createCourseplanMutexGroup(true)
      },
      async createCourseplanMutexGroup (isContinue) {
        // eslint-disable-next-line no-unused-vars
        var type = ''
        if (this.crouseType === 'P') {
          type = 'Subject'
        } else {
          type = 'CoursePlan'
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/CreateCourseplanSelectiveCourse`, {
          ClassTableID: this.classTableID,
          AIDType: this.leftSelectSubject.Type,
          AID: this.leftSelectSubject.AID,
          BIDType: this.rigthSelectSubject.Type,
          BID: this.rigthSelectSubject.AID
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          if (isContinue) {
            this.creatMutually(false)
          } else {
            this.modalCreatMutually = false
          }
          this.getTP()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.EvenSelected-modal{
    font-size:14px;
}
.EvenSelected-modal .ivu-radio-wrapper{
    height:auto;
    line-height:25px;
}
.CourseMutex-ul {
    margin: 30px 40px;
}
.CourseMutex-ul li {
    width: 303px;
    /*height: 168px;*/
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 4px 0px rgba(183,183,183,0.5);
    border-radius: 4px;
    margin: 25px;
    display: inline-block;
}
.CourseMutex-li-active {
    border: 1px solid #4196FF;
}
.CourseMutex-header {
    height: 44px;
    background: rgba(238,245,255,1);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 16px;
}
.CourseMutex-header .header-icon {
    width: 32px;
    height: 32px;
    line-height: 30px;
    background: rgba(255,255,255,1);
    border-radius: 50%;
    text-align: center;
}
.CourseMutex-header .header-title {
    font-size: 14px;
    color: #4196FF;
    font-weight: bold;
    margin-left: 14px;
    width: 207px;
}
.CourseMutex-header .header-check {
    width: 18px;
    height: 18px;
    line-height: 18px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(142,195,255,1);
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
}
.CourseMutex-header .header-check-active {
    background: rgba(65,150,255,1);
}
.CourseMutex-body {
    height: 88px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}
.CourseMutex-body span {
    color: #333333;
    font-weight: bold;
    margin: 0 9px;
    font-size: 14px;
}
.CourseMutex-footer {
    height: 36px;
    background: rgba(249,250,251,1);
    color: #999999;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.CourseMutex-footer:hover {
    color: #FDA8A4;
}
.CourseMutex-footer:hover .ivu-icon {
    color: #FDA8A4 !important;
}
</style>
