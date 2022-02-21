
<template>
  <div id="crouseRules">
    <div class="EvenSelected-rule">
      <div class="clearfix">
        <div style="margin-bottom:10px">
          <Button class="xy-primary"
                  @click="creatMutually(true)"
                  :disabled="layeredStepsHeader.isOperation != 0">创建连选课程组</Button>
          <Button class='xy-danger'
                  @click="delAll"
                  :disabled="layeredStepsHeader.isOperation != 0?true:dataTable.length>0?false:true">批量删除</Button>
        </div>
        <!-- <Alert show-icon closable> 两门课程可组成一个连选课程组，学生选了其中一门课程自动选中另一门课程。</Alert> -->
      </div>

      <div class="xy-content-table">
        <XyAntTable
          :rowSelection="tableRowSelection"
          :columns="columnss"
          :isPage="false"
          :dataSource="dataTable"
          :nullData="nullData"
          :tableLoading="tableLoading">
          <div slot="SubjectNames"
                slot-scope="text, record">
            <div style="min-width:200px">
              {{record.SubjectNames}}
            </div>
          </div>
          <span slot="oprateRender"
                slot-scope="text, record">
            <a :disabled="layeredStepsHeader.isOperation!==0"
                @click="delOne(record)">删除</a>
          </span>
        </XyAntTable>
        <!--创建连选课程组-->
        <modal v-model="modalCreatMutually"
               :mask-closable="false"
               width="864"
               v-if="layeredStepsHeader.isOperation == 0"
               :transfer="false">
          <p slot="header">连选课程组</p>
          <div class="EvenSelected-modal">
            <row>
              <i-col span="12">
                <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                  <div v-if="leftCrouseData.length===0">暂无连选课程</div>
                  <radio-group v-model="leftSelectSubject"
                               vertical
                               @on-change="subjectRadio(1)">
                    <template v-for="(leftData, index) in leftCrouseData">
                      <radio :label="JSON.stringify(leftData)"
                             v-show="leftData.isShow"
                             :key="index">
                        <span class="f14"
                              v-if="crouseType == 'P'">{{leftData.SubjectName}}</span>
                        <span class="f14"
                              v-if="crouseType == 'L'">{{leftData.SubjectName}}{{leftData.CoursePlanLevelName}}</span>
                      </radio>
                    </template>

                  </radio-group>
                </div>
              </i-col>
              <i-col span="12"
                     style="padding-left:20px;">
                <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                  <div v-if="rigthCrouseData.length===0">暂无连选课程</div>
                  <radio-group v-model="rigthSelectSubject"
                               vertical
                               @on-change="subjectRadio(2)">
                    <template v-for="(rightData,index) in rigthCrouseData">
                      <radio :label="JSON.stringify(rightData)"
                             v-show="rightData.isShow"
                             :key="index">
                        <span class="f14"
                              v-if="crouseType == 'P'">{{rightData.SubjectName}}</span>
                        <span class="f14"
                              v-if="crouseType == 'L'">{{rightData.SubjectName}}{{rightData.CoursePlanLevelName}}</span>
                      </radio>
                    </template>
                  </radio-group>
                </div>
              </i-col>
            </row>

          </div>
          <div slot="footer">
            <Button class="xy-modal-close"
                    @click="cancleMutually">取消</Button>
            <Button class="xy-modal-primary"
                    shape="circle"
                    @click="submitMutually">保存</Button>
            <Button class="xy-modal-primary"
                    shape="circle"
                    @click="submitContinueMutually">保存并继续</Button>
          </div>
        </modal>
      </div>
    </div>

  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    data () {
      return {
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '您还没有连选课程的信息，请添加连选课程。',
        selectionAll: [],
        columnss: [
          {
            title: '连续课程',
            scopedSlots: { customRender: 'SubjectNames' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        isSelectAll: false,
        isHaveData: false,
        dataTable: [],
        columns: [],
        // 创建连选课程组
        modalCreatMutually: false,
        numSubject: '0',
        crouseType: 'L',
        leftCrouseData: [],
        leftSelectSubject: '',
        rigthCrouseData: [],
        rigthSelectSubject: '',
        layeredStepsHeader: {}
      }
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange
        }
      }
    },
    mounted () {
      this.layeredStepsHeader = this.$parent.$parent
      this.getTP()
    },
    methods: {
      getTP () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetCourseplanSelectiveCourseList`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID
        }).then(res => {
          if (res.success) {
            this.dataTable = res.data
            for (let i = 0; i < this.dataTable.length; i++) {
              this.dataTable[i].SubjectNamesArr = this.dataTable[i].SubjectNames.split(',')
            };
            this.isSelectAll = false
            this.columns = [
              {
                type: 'selection',
                width: 60,
                align: 'center'
              },
              {
                title: '连续课程',
                key: 'SubjectNames',
                minWidth: 120
              },
              {
                title: '操作',
                key: '04',
                width: 80,
                render: (h, params) => {
                  return h('div', { 'class': { oprateList: true } }, [h('a', {
                    'class': {
                      disabled: this.layeredStepsHeader.isOperation !== 0
                    },
                    on: {
                      click: () => {
                        if (this.layeredStepsHeader.isOperation === 0) {
                          this.delOne(params.row)
                        }
                      }
                    }
                  }, '删除')
                  ])
                }
              }
            ]
          }
          this.tableLoading = false
        })
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 删除
      delOne: function (row) {
        let that = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除' + row.SubjectNames + '吗？',
          onOk: function () {
            this.xy.loading()
            this.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CourseplanSelectiveCourseDelete`, {
              id: row.CoursePlanMutexGroupID,
              LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID
            }).then(res => {
              this.xy.unloading()
              if (res.success) {
                that.xy.msgSuc('删除成功。')
                that.getTP()
              }
            })
          }
        })
      },

      // 批量删除
      delAll: function () {
        if (this.layeredStepsHeader.isOperation === 0) {
          let that = this
          if (this.selectionAll.length === 0) {
            this.xy.msgError('请选择删除项。')
          } else {
            let ids = ''
            for (let i = 0; i < this.selectionAll.length; i++) {
              ids += this.selectionAll[i].CoursePlanMutexGroupID + ','
            }
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要批量删除所有选中的连选课程组吗？',
              onOk: function () {
                this.xy.loading()
                this.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CourseplanSelectiveCourseDeleteByIds`, {
                  ids: ids,
                  LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID
                }).then(res => {
                  this.xy.unloading()
                  if (res.success) {
                    that.xy.msgSuc('删除成功。')
                    that.getTP()
                    that.selectionAll = []
                  }
                })
              }
            })
          }
        }
      },
      // 创建连选课程组
      creatMutually: function (isShowModal) {
        if (this.layeredStepsHeader.isOperation === 0) {
          let that = this
          that.leftSelectSubject = ''
          that.rigthSelectSubject = ''
          that.leftCrouseData = []
          that.rigthCrouseData = []
          this.xy.loading()
          this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetCourseplanSelectiveCourseListForCreate`, {
            layeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID,
            type: that.crouseType
          }).then(res => {
            if (res.success) {
              this.xy.unloading()
              let resData = res.data || []
              resData.map(function (item) { item.isShow = true })
              that.leftCrouseData = resData
              for (let i = 0; i < resData.length; i++) {
                that.rigthCrouseData.push({
                  AID: resData[i].AID,
                  AIDType: resData[i].AIDType,
                  CoursePlanID: resData[i].CoursePlanID,
                  CoursePlanLevelID: resData[i].CoursePlanLevelID,
                  CoursePlanLevelName: resData[i].CoursePlanLevelName,
                  OperatorID: resData[i].OperatorID,
                  SubjectGroupID: resData[i].SubjectGroupID,
                  SubjectGroupName: resData[i].SubjectGroupName,
                  SubjectID: resData[i].SubjectID,
                  SubjectName: resData[i].SubjectName,
                  isShow: true
                })
              }
              if (isShowModal) {
                // that.numSubject = '0';
                // that.crouseType = 'P';
                that.modalCreatMutually = true
              }
            } else {
              that.xy.msgError(res.msg)
            };
            this.xy.unloading()
          })
        }
      },
      subjectRadio: function (val) { // 选择互斥课程
        if (val === 1) {
          if (this.leftSelectSubject !== '') {
            let leftVal = JSON.parse(this.leftSelectSubject)
            this.rigthCrouseData.map(function (item) {
              item.isShow = true
              return item
            })
            for (let i = 0; i < this.rigthCrouseData.length; i++) {
              if (this.rigthCrouseData[i].SubjectGroupID !== leftVal.SubjectGroupID) {
                this.rigthCrouseData[i].isShow = false
              } else {
                if (this.rigthCrouseData[i].SubjectID === leftVal.SubjectID) {
                  this.rigthCrouseData[i].isShow = false
                }
              }
            }
          };
        } else {
          if (this.rigthSelectSubject !== '') {
            let rigthVal = JSON.parse(this.rigthSelectSubject)
            this.leftCrouseData.map(function (item) {
              item.isShow = true
              return item
            })
            // eslint-disable-next-line no-redeclare
            for (let i = 0; i < this.rigthCrouseData.length; i++) {
              if (this.leftCrouseData[i].SubjectGroupID !== rigthVal.SubjectGroupID) {
                this.leftCrouseData[i].isShow = false
              } else {
                if (this.leftCrouseData[i].SubjectID === rigthVal.SubjectID) {
                  this.leftCrouseData[i].isShow = false
                }
              }
            }
          };
        }
      },
      cancleMutually: function () { // 取消
        // this.crouseType = 'P';
        this.modalCreatMutually = false
      },
      submitMutually: function () { // 保存
        if (this.leftSelectSubject === '' || this.rigthSelectSubject === '') {
          this.xy.msgError('请分别从两列中各勾选一门课程组成连选课程组。')
          return false
        };
        this.createCourseplanMutexGroup(false)
      },
      submitContinueMutually: function () { // 保存并继续
        if (this.leftSelectSubject === '' || this.rigthSelectSubject === '') {
          this.xy.msgError('请分别从两列中各勾选一门课程组成连选课程组。')
          return false
        };
        this.createCourseplanMutexGroup(true)
      },
      createCourseplanMutexGroup: function (isContinue) {
        let that = this
        // eslint-disable-next-line no-unused-lets
        // eslint-disable-next-line no-unused-vars
        let type = ''
        if (this.crouseType === 'P') {
          type = 'Subject'
        } else {
          type = 'CoursePlan'
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CreateCourseplanSelectiveCourse`, {
          LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID,
          AIDType: JSON.parse(that.leftSelectSubject).AIDType,
          AID: JSON.parse(that.leftSelectSubject).AID,
          BIDType: JSON.parse(that.rigthSelectSubject).AIDType,
          BID: JSON.parse(that.rigthSelectSubject).AID,
          StatisticalCount: that.numSubject,
          Type: 'CoursePlan'
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            that.xy.msgSuc('保存成功。')
            // that.crouseType = 'P';
            if (isContinue) {
              that.creatMutually(false)
            } else {
              that.modalCreatMutually = false
            }
            that.getTP()
          } else {
            that.xy.msgError(res.msg)
          }
        })
      }
    }
  }
</script>
<style lang='less' scoped>
</style>
