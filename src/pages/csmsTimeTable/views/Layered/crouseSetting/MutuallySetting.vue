<!-- 互斥设置 -->
<template>
  <div id="crouseRules">
    <div class="MutuallySetting-rule">
      <div class="">
        <div class="">
          <Button class='xy-primary'
                  @click="creatMutually"
                  :disabled="layeredStepsHeader.isOperation != 0">创建互斥课程组</Button>
          <Button class='xy-danger'
                  @click="delAll"
                  :disabled="layeredStepsHeader.isOperation != 0?true:dataTable.length>0?false:true">批量删除</Button>
        </div>
        <!-- <Alert show-icon closable style="margin-top:10px;"> 一般把同一学科下的选考课程和学考课程设为一个互斥课程组，学生登录系统选课时同一互斥组内的课程只能选一门。</Alert> -->
      </div>

      <div class="xy-content-table">
        <XyAntTable
          :rowSelection="tableRowSelection"
          :columns="columnss"
          :isPage="false"
          :dataSource="dataTable"
          :nullData="nullData"
          :tableLoading="tableLoading">
          <div slot="Name"
                slot-scope="text, record">
            <div style="min-width:200px">
              {{record.Name}}
            </div>
          </div>
          <span slot="oprateRender"
                slot-scope="text, record">
            <a :disabled="layeredStepsHeader.isOperation!==0"
                @click="delOne(record)">删除</a>
          </span>
        </XyAntTable>
        <!--创建互斥课程组-->
        <modal v-model="modalCreatMutually"
               :mask-closable="false"
               width="864"
               v-if="layeredStepsHeader.isOperation == 0"
               :transfer="false">
          <p slot="header">创建互斥课程组</p>
          <div style="font-size:14px;height:500px;overflow-y:auto">
            <row>
              <i-col span="12">
                <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
                  <template v-for="(item,index) in leftCrouseData">
                    <radio style="display:block;margin:5px 0"
                           v-model="item.isCheck"
                           @on-change="leftChange(1,item)"
                           v-show="item.isShow"
                           :key='index'>
                      <span class="f14">{{item.SubjectName}}</span>
                    </radio>
                  </template>
                  <div v-if="leftCrouseData.length===0">暂无互斥课程</div>

                </div>
              </i-col>
              <i-col span="12"
                     style="padding-left:20px;">
                <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
                  <radio style="display:block;margin:5px 0"
                         v-model="item.isCheck"
                         v-for="(item,index) in rigthCrouseData"
                         :key='index'
                         @on-change="leftChange(2,item)"
                         v-show="item.isShow">
                    <span class="f14">{{item.SubjectName}}</span>
                  </radio>
                  <div v-if="rigthCrouseData.length===0">暂无互斥课程</div>
                </div>
              </i-col>
            </row>
          </div>
          <div slot="footer">
            <Button class="xy-modal-close"
                    @click="modalCreatMutually = false">取消</Button>
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
        selectionAll: [],
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '您还没有互斥课程的信息，请添加互斥课程。',
        isSelectAll: false,
        dataTable: [],
        columnss: [
          {
            title: '互斥课程',
            scopedSlots: { customRender: 'Name' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        // 创建互斥
        modalCreatMutually: false,
        leftCrouseData: [],
        leftSelectSubjectID: '',
        rigthCrouseData: [],
        rigthSelectSubjectID: '',
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
      this.getMutex()
    },
    methods: {
      // 互斥设置列表数据
      getMutex () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetCourseplanMutexGroupList`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID
        }).then(res => {
          if (res.success) {
            this.dataTable = res.data
            for (let i = 0; i < this.dataTable.length; i++) {
              this.dataTable[i].Name = this.dataTable[i].Name.slice(0, this.dataTable[i].Name.length - 1)
              this.dataTable[i].NameArr = this.dataTable[i].Name.split(',')
            };
            this.isSelectAll = false
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
          content: '您确定要删除' + row.Name + '吗？',
          onOk: function () {
            this.xy.loading()
            this.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CourseplanMutexGroupDelete`, {
              id: row.ID,
              LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID
            }).then(res => {
              this.xy.unloading()
              if (res.success) {
                that.xy.msgSuc('删除成功。')
                that.getMutex()
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
              ids += this.selectionAll[i].ID + ','
            }
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要批量删除所有选中的互斥课程组吗？',
              onOk: function () {
                this.xy.loading()
                this.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CourseplanMutexGroupDeleteByIds`, {
                  ids: ids,
                  LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID
                }).then(res => {
                  this.xy.unloading()
                  if (res.success) {
                    that.xy.msgSuc('删除成功。')
                    that.selectionAll = []
                    that.isSelectAll = false
                    that.getMutex()
                  }
                })
              }
            })
          }
        }
      },
      // 创建互斥
      creatMutually: function () {
        if (this.layeredStepsHeader.isOperation === 0) {
          let that = this
          that.leftSelectSubjectID = ''
          that.rigthSelectSubjectID = ''
          that.leftCrouseData = []
          that.rigthCrouseData = []
          this.xy.loading()
          this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetCourseplanMutexGroupListForCreate`, {
            layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID
          }).then(res => {
            if (res.success) {
              let resData = res.data
              resData.map(function (item) {
                item.isShow = true
                item.isCheck = false
                return item
              })
              that.leftCrouseData = resData
              for (let i = 0; i < resData.length; i++) {
                that.rigthCrouseData.push({
                  SubjectID: resData[i].SubjectID,
                  SubjectName: resData[i].SubjectName,
                  isShow: true,
                  isCheck: false
                })
              }
              that.modalCreatMutually = true
            } else {
              that.xy.msgError(res.msg)
            }
            this.xy.unloading()
          })
        }
      },
      leftChange: function (val, objSubject) { // 选择互斥课程
        let that = this
        if (val === 1) {
          this.xy.loading()
          this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetCourseplanMutexGroupListForCreateNoSel`, {
            layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
            // subjectID: that.leftSelectSubjectID
            subjectID: objSubject.SubjectID
          }).then(res => {
            if (res.success) {
              that.leftCrouseData.map(function (item) {
                item.isCheck = false
                return item
              })
              objSubject.isCheck = true
              that.leftSelectSubjectID = objSubject.SubjectID

              that.rigthCrouseData = []
              that.rigthCrouseData = res.data
              that.rigthCrouseData.map(function (item) {
                if (item.SubjectID === that.leftSelectSubjectID) {
                  item.isShow = false
                } else {
                  item.isShow = true
                };
                if (item.SubjectID === that.rigthSelectSubjectID) {
                  item.isCheck = true
                } else {
                  item.isCheck = false
                }
                return item
              })
            } else {
              that.xy.msgError(res.msg)
            }
            this.xy.unloading()
          })
        } else {
          this.xy.loading()
          this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetCourseplanMutexGroupListForCreateNoSel`, {
            layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
            // subjectID: that.rigthSelectSubjectID
            subjectID: objSubject.SubjectID
          }).then(res => {
            if (res.success) {
              that.rigthCrouseData.map(function (item) {
                item.isCheck = false
                return item
              })
              objSubject.isCheck = true
              that.rigthSelectSubjectID = objSubject.SubjectID

              that.leftCrouseData = []
              that.leftCrouseData = res.data
              that.leftCrouseData.map(function (item) {
                if (item.SubjectID === that.rigthSelectSubjectID) {
                  item.isShow = false
                } else {
                  item.isShow = true
                };
                if (item.SubjectID === that.leftSelectSubjectID) {
                  item.isCheck = true
                } else {
                  item.isCheck = false
                };
                return item
              })
            } else {
              that.xy.msgError(res.msg)
            }
            this.xy.unloading()
          })
        }
      },
      submitMutually: function () { // 保存
        if (this.leftSelectSubjectID === '' || this.rigthSelectSubjectID === '') {
          this.xy.msgError('请分别从两列中各勾选一门课程组成互斥课程组。')
        } else {
          this.createCourseplanMutexGroup(false)
        }
        this.getMutex()
      },
      submitContinueMutually: function () { // 保存并继续
        if (this.leftSelectSubjectID === '' || this.rigthSelectSubjectID === '') {
          this.xy.msgError('请分别从两列中各勾选一门课程组成互斥课程组。')
        } else {
          this.createCourseplanMutexGroup(true)
        }
        this.getMutex()
      },
      createCourseplanMutexGroup: function (isContinue) {
        let that = this
        let arr = [
          {
            AID: that.leftSelectSubjectID,
            Type: 'SJ'
          },
          {
            AID: that.rigthSelectSubjectID,
            Type: 'SJ'
          }
        ]
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CreateCourseplanMutexGroup`, {
          LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
          DetailModels: arr
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            that.xy.msgSuc('保存成功。')
            if (isContinue) {
              that.creatMutually()
            } else {
              that.modalCreatMutually = false
            }
            that.getMutex()
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
