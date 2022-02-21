<template>
  <!-- 8.选课规则-互斥设置 -->
 <div>
    <div class="MutuallySetting-rule">
        <div class="clearfix" style="margin:20px 0;">
            <div class="fl">
                <div class="fl">
                    <Button class="xy-primary" @click="creatMutually(0)" :disabled="isOperation !== 0">创建互斥课程组</Button>
                    <!-- <span class="iconfont" style="font-size: 12px; margin: 0 5px 0 -8px;">&#xe6a2;</span> -->
                    <Button class="xy-danger" @click="delAll" :disabled="isOperation !== 0?true:!isNullData?false:true">批量删除</Button>
                    <Button class="xy-info" @click="checkAll" :disabled="isOperation !== 0?true:!isNullData?false:true">
                        <span v-if="!isSelectAll">全选</span>
                        <span v-if="isSelectAll">取消全选</span>
                    </Button>
                </div>
            </div>
            <!-- <Alert show-icon closable class="fl" style="margin-left:32px;">多门课程可组成一个互斥课程组，学生选了其中一门课程不能再选同一互斥组内的其他课程。</Alert> -->
        </div>

        <div class="xy-content-table">
            <div v-if="!isNullData && !isLoading">
              <ul class="CourseMutex-ul">
                  <li v-for="(item, index) in dataTable" :key="index"
                      :class="selectionAll.indexOf(item.CoursePlanMutexGroupID)!==-1?'CourseMutex-li-active':''">
                      <div class="CourseMutex-header clearfix">
                          <div class="header-icon">
                              <Icon type="ios-paper-outline" color="#4196FF" size="20" />
                          </div>
                          <div class="header-title">互斥设置</div>
                          <div class="header-check"
                              :class="isOperation === 1?'no-del':selectionAll.indexOf(item.CoursePlanMutexGroupID)!==-1?'header-check-active':''"
                              @click="check(item)">
                              <i class="fa fa-check" aria-hidden="true" style="color:#FFF" v-if="selectionAll.indexOf(item.CoursePlanMutexGroupID)!==-1"></i>
                          </div>
                      </div>
                      <div class="CourseMutex-body nowrap">
                          <span class="nowrap"
                                :title="item.Levels"
                                >{{item.Levels}}</span>
                      </div>
                      <div class="CourseMutex-footer" :class="isOperation === 1?'no-del':''" @click="delOne(item)">
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
              <span class="no-data-text">您还没有互斥设置的信息，请添加设置。</span>
            </div>
            <!-- <div v-if="isLoading" class="is-loading">
              <div>
                <img :src="require('@/assets/common/loading.png')" alt="" />
              </div>
            </div> -->

            <!--创建互斥课程组-->
            <Modal v-model="modalCreatMutually"
                   :mask-closable="false"
                   :closable="false"
                   width="664"
                   v-if="isOperation===0"
                   :transfer="false">
                <p slot="header">创建互斥课程组</p>
                <!-- <alert show-icon style="margin:20px 0px;">
                    可把多门课程设为一个互斥课程组。在同一互斥组内学生只能选择一门课程。同一上课时间的课已自动互斥，无需设置。
                </alert> -->
                <div style="font-size:14px;height:350px;overflow-y:auto">
                    <row>
                        <i-col span="24">
                            <div style="padding:10px 15px;overflow-y:auto;border:1px solid #eaeaea">
                                <div style="padding:20px;" v-for="(item, index) in subjectData" :key="index">
                                    <div>{{item.SubjectCategoryName}}</div>
                                    <checkbox v-for="(subject, n) in item.Levels"
                                              :key="n"
                                              v-model="subject.IsSelect"
                                              :value="subject.AID"
                                              :label="subject"
                                              @on-change="leftChange(subject)">
                                        <span class="f14">{{subject.SubjectName}}</span>
                                    </checkbox>
                                </div>
                            </div>
                        </i-col>
                    </row>
                </div>
                <div slot="footer">
                    <Button class="xy-modal-close" @click="modalCreatMutually = false">取消</Button>
                    <Button class="xy-modal-primary" shape="circle" :disabled="disabledBtn" @click="submitMutually">保存</Button>
                    <Button class="xy-modal-primary" shape="circle" :disabled="disabledBtn" @click="submitContinueMutually">保存并继续</Button>
                </div>
            </Modal>
        </div>
    </div>
</div>

</template>
<script>
  export default {
    name: 'TLArrangRuleSameTime',
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

        // 创建互斥
        modalCreatMutually: false,
        leftCrouseData: [],
        leftSelectSubjectID: '',
        rigthCrouseData: [],
        rigthSelectSubjectID: '',
        aid: 0,

        crouseTree: [],
        courseProject: '',
        subjectRadio: [],
        subjectList: [],
        AIDList: [],
        crouseTreeCopy: [],
        disabledBtn: false,
        subjectData: [],
        valList: [],
        single: false,
        aids: '',

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
      // 互斥设置列表数据
      async getTP () {
        this.xy.loading()
        this.isLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/GetMutexPage`, {
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
            this.dataTable[i].SubjectNameArr = this.dataTable[i].Levels.split(',')
          };

          if (this.dataTable.length > 0) {
            this.pageList = res.data.data.length
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
              _this.selectionAll.push(item.CoursePlanMutexGroupID)
              return item
            })
          } else { // 取消选中
            this.selectionAll = []
          }
        }
      },
      check (val) {
        if (this.isOperation === 1) { return false }
        var index = this.selectionAll.map((item) => { return item }).indexOf(val.CoursePlanMutexGroupID)
        if (index === -1) {
          this.selectionAll.push(val.CoursePlanMutexGroupID)
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
        if (_this.isOperation !== 1) {
          _this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除此互斥课程组吗？',
            async onOk () {
              _this.xy.loading()
              let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/DeleteMutex`, {
                id: row.CoursePlanMutexGroupID,
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
        if (this.isOperation === 0 && !this.isNullData) {
          if (this.selectionAll.length === 0) {
            this.xy.msgError('请勾选要删除的互斥课程组。')
          } else {
            var ids = ''
            for (var i = 0; i < this.selectionAll.length; i++) {
              ids += this.selectionAll[i] + ','
            }
            var _this = this
            _this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要删除所有选中的互斥课程组吗？',
              async onOk () {
                _this.xy.loading()
                let res = await _this.xy.post(`${_this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/DeleteListMutex`, {
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
        }
      },

      // 点击展开弹框
      async creatMutually (val) {
        if (this.isOperation === 0) {
          this.aids = ''
          this.single = false
          this.AIDList = []
          this.xy.loading()
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/SelectMutex`, {
            classTableID: this.classTableID,
            aids: this.aids
          })
          this.xy.unloading()
          if (res.success) {
            var dataList = res.data
            this.subjectData = []
            for (var i = 0; i < dataList.length; i++) {
              this.subjectData.push({
                SubjectCategoryID: dataList[i].SubjectCategoryID,
                SubjectCategoryName: dataList[i].SubjectCategoryName,
                Levels: []
              })
              for (var j = 0; j < dataList[i].Levels.length; j++) {
                this.subjectData[i].Levels.push({
                  Type: dataList[i].Levels[j].Type,
                  AID: dataList[i].Levels[j].AID,
                  SubjectName: dataList[i].Levels[j].SubjectName,
                  IsSelect: dataList[i].Levels[j].IsSelect
                })
              };
            }
            this.disabledBtn = true
            this.modalCreatMutually = true
          }
        }
      },

      // 选择互斥课程
      async leftChange (val) {
        var index = this.AIDList.map((item) => { return item }).indexOf(val.AID)
        if (index === -1) {
          this.AIDList.push(val.AID)
        } else {
          this.AIDList.splice(index, 1)
        }

        if (this.AIDList.length < 2) {
          this.disabledBtn = true
        } else {
          this.disabledBtn = false
        }

        this.aids = ''
        for (var i = 0; i < this.AIDList.length; i++) {
          this.aids += this.AIDList[i] + ','
        }

        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/SelectMutex`, {
          classTableID: this.classTableID,
          aids: this.aids
        })
        this.xy.unloading()
        if (res.success) {
          var dataList = res.data
          this.subjectData = []
          for (let i = 0; i < dataList.length; i++) {
            this.subjectData.push({
              SubjectCategoryID: dataList[i].SubjectCategoryID,
              SubjectCategoryName: dataList[i].SubjectCategoryName,
              Levels: []
            })
            for (var j = 0; j < dataList[i].Levels.length; j++) {
              this.subjectData[i].Levels.push({
                Type: dataList[i].Levels[j].Type,
                AID: dataList[i].Levels[j].AID,
                SubjectName: dataList[i].Levels[j].SubjectName,
                IsSelect: dataList[i].Levels[j].IsSelect
              })
            };
          }
        }
      },

      submitMutually () { // 保存
        this.createCourseplanMutexGroup(false)
      },
      submitContinueMutually () { // 保存并继续
        this.createCourseplanMutexGroup(true)
      },
      async createCourseplanMutexGroup (isContinue) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectSchoolBasedRuleSetting/CreateMutex`, {
          ClassTableID: this.classTableID,
          Type: 'CL',
          Subjects: this.AIDList
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          if (isContinue) {
            this.creatMutually()
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
.CourseMutex-header .header-check.no-del{
    border: 1px solid #dedede;
    cursor: no-drop;
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
.CourseMutex-footer.no-del,
.CourseMutex-footer.no-del:hover,
.CourseMutex-footer.no-del .ivu-icon,
.CourseMutex-footer.no-del:hover .ivu-icon{
  color: #ccc !important;
  cursor: no-drop;
}
</style>
