
<template>
  <div id="crouseRules">
    <div class="BanCroup-rule">
      <div style="margin-bottom:10px">
        <Button class="xy-primary"
                @click="creatBanCroup"
                :disabled="layeredStepsHeader.isOperation != 0">创建禁选组合</Button>
        <Button class='xy-danger'
                @click="delAll"
                :disabled="layeredStepsHeader.isOperation != 0?true:isHaveData?false:true">批量删除</Button>
      </div>

      <div class="xy-content-table">
        <!-- <xy-table :tbColumns="columns"
                  :tbData="dataTable"
                  :noDataText='noDataText'
                  @changeSelect="changeSelect"
                  :total='dataTable.length'
                  :isShowPage=false></xy-table> -->
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
        <!--禁选课程组合-->
        <modal v-model="modalBanCroup"
               v-if="layeredStepsHeader.isOperation == 0"
               :mask-closable="false"
               width="864"
               :transfer="false">
          <p slot="header">禁选课程组合</p>
          <div>
            <!-- <alert>学生选课时禁止同时选中禁选课程组合中的所有课程</alert> -->
            <div style="padding:10px 15px;height:500px;overflow-y:auto;border:1px solid #eaeaea">
              <h1 style="font-size:16px;margin-bottom:10px;">从下列课程中勾选多门课程组成禁选课程组</h1>
              <checkbox-group v-model="selectSubject">
                <checkbox :label="item.SubjectID"
                          v-for="item in subjectData"
                          style="display:block;margin:5px;"
                          :key='item.SubjectID'>
                  <span class="f14">{{item.SubjectName}}</span>
                </checkbox>
              </checkbox-group>
            </div>
          </div>
          <div slot="footer">
            <Button class="xy-modal-close"
                    @click="modalBanCroup = false">取消</Button>
            <Button class="xy-modal-primary"
                    shape="circle"
                    @click="submitBanCroup">保存</Button>
            <Button class="xy-modal-primary"
                    shape="circle"
                    @click="submitContinueBanCroup">保存并继续</Button>
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
        nullData: '您还没有禁选课程的信息，请添加禁选课程。',
        selectionAll: [],
        isSelectAll: false,
        isHaveData: false,
        dataTable: [],
        columnss: [
          {
            title: '禁选组合',
            scopedSlots: { customRender: 'SubjectNames' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        // 创建禁选课程组合
        modalBanCroup: false,
        subjectData: [],
        selectSubject: [],
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
      // 互斥设置列表数据
      getTP () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetCourseplanDisableGroupList`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID
        }).then(res => {
          if (res.success) {
            this.dataTable = res.data
            for (let i = 0; i < this.dataTable.length; i++) {
              this.dataTable[i].SubjectNameArr = this.dataTable[i].SubjectNames.split(',')
            };
            this.isSelectAll = false
            if (this.dataTable.length > 0) {
              this.isHaveData = true
            } else {
              this.isHaveData = false
            }
            this.columns = [
              {
                type: 'selection',
                width: 60,
                align: 'center'
              },
              {
                title: '禁选组合',
                minWidth: 120,
                key: 'SubjectNames'
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
        if (that.layeredStepsHeader.isOperation === 0) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除' + row.SubjectNames + '吗？',
            onOk: function () {
              that.xy.loading()
              that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CourseplanDisableGroupDelete/?id=` + row.CoursePlanMutexGroupID).then(res => {
                that.xy.unloading()
                if (res.success) {
                  that.xy.msgSuc('删除成功。')
                  that.getTP()
                } else {
                  that.xy.msgError(res.msg)
                }
              })
            }
          })
        }
      },

      // 批量删除
      delAll: function () {
        let that = this
        if (that.layeredStepsHeader.isOperation === 0) {
          if (that.selectionAll.length === 0) {
            that.xy.msgError('请选择删除项')
          } else {
            let ids = ''
            for (let i = 0; i < that.selectionAll.length; i++) {
              ids += that.selectionAll[i].CoursePlanMutexGroupID + ','
            }
            this.$Modal.confirm({
              title: '温馨提示',
              content: '您确定要批量删除所有选中的禁选课程组吗？',
              onOk: function () {
                that.xy.loading()
                that.xy.post(`${that.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CourseplanDisableGroupDeleteByIds?ids=` + ids).then(res => {
                  that.xy.unloading()
                  if (res.success) {
                    that.xy.msgSuc('删除成功。')
                    that.selectionAll = []
                    that.isSelectAll = false
                    that.getTP()
                  } else {
                    that.xy.msgError(res.msg)
                  }
                })
              }
            })
          }
        }
      },
      // 创建互斥
      creatBanCroup: function () {
        let that = this
        if (that.layeredStepsHeader.isOperation === 0) {
          that.selectSubject = []
          this.xy.loading()
          this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/GetCourseplanDisableGroupListForCreate`, {
            layeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID
          }).then(res => {
            if (res.success) {
              that.subjectData = []
              that.subjectData = res.data
              that.modalBanCroup = true
            } else {
              that.xy.msgError(res.msg)
            };
            that.xy.unloading()
          })
        }
      },

      submitBanCroup: function () { // 保存
        if (this.selectSubject.length === 0) {
          this.xy.msgError('请从下列课程中勾选多门课程组成禁选课程组。')
          return false
        } else if (this.selectSubject.length < 2) {
          this.xy.msgError('至少勾选2门课程组成禁选课程组。')
          return false
        }
        this.createCourseplanMutexGroup(false)
      },
      submitContinueBanCroup: function () { // 保存并继续
        if (this.selectSubject.length <= 1) {
          this.xy.msgError('请从下列课程中勾选多门课程组成禁选课程组。')
          return false
        } else if (this.selectSubject.length < 2) {
          this.xy.msgError('至少勾选2门课程组成禁选课程组。')
          return false
        }
        this.createCourseplanMutexGroup(true)
      },
      createCourseplanMutexGroup: function (isContinue) {
        let that = this
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectProgrammeSubjectSetting/CreateCourseplanDisableGroup`, {
          LayeredSelectProgrammeID: that.layeredStepsHeader.LayeredSelectProgrammeID,
          Subjects: that.selectSubject
        }).then(res => {
          that.xy.unloading()
          if (res.success) {
            that.xy.msgSuc('保存成功。')
            if (isContinue) {
              that.creatBanCroup()
            } else {
              that.modalBanCroup = false
            }
            that.getTP()
          }
        })
      }
    }

  }
</script>
<style lang='less' scoped>
</style>
