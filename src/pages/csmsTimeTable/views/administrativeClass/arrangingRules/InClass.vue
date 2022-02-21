
<template>
  <div id="arrangingRules">
     <div class="InClass-rule">
        <div style="margin:20px;">
            <div >
                <Button class="xy-primary" type="primary"
                          @click="creatClass"
                          :disabled="StepsHeader.isOperation != 0">创建合班</Button>
                <Button class="xy-danger" type="primary"
                          @click="delAll"
                          :disabled="StepsHeader.isOperation != 0?true:datatable.length>0?false:true">批量删除</Button>
            </div>
            <!-- <h1 class="title-describe fl" style="margin-left:22px;">
                指定哪些班的某门课合班上课，合班上课的课程会排在相同的课位。
            </h1> -->
        </div>

        <div class="xy-content-table">
          <XyAntTable
            :rowSelection="tableRowSelection"
            :columns="columnss"
            :isPage="false"
            :dataSource="datatable"
            :nullData="nullData"
            :tableLoading="tableLoading">
            <div slot="SubjectName"
                  slot-scope="text, record">
              <div style="min-width:300px">
                {{record.SubjectName}}
              </div>
            </div>
            <div slot="CoursePlanTableName"
                  slot-scope="text, record">
              <div style="min-width:200px">
                {{record.CoursePlanTableName}}
              </div>
            </div>
            <span slot="oprateRender"
                  slot-scope="text, record">
              <a :disabled="StepsHeader.isOperation!==0"
                  @click="delOne(record)">删除</a>
            </span>
          </XyAntTable>
          <!--创建合班-->
          <Modal v-model="modalCreatClass"
                  v-if="StepsHeader.isOperation == 0"
                  :closable="false"
                  width="864"
                  :transfer="false"
                  :mask-closable="false">
              <p slot="header">创建合班</p>
              <div style="font-size:14px;height:400px;overflow-y:auto">
                  <Row>
                      <i-col  span="12">
                          <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                              <h1 style="font-weight:bold;font-size:16px;">选择合班课程</h1>
                              <RadioGroup v-model="selectSubjectID"
                                            vertical
                                            @on-change="radioChange">
                                  <Radio :label="item.SubjectID" v-for="(item,index) in crouseList" :key="index">
                                      <span class="f14" v-cloak>{{item.SubjectName}}</span>
                                  </Radio>
                              </RadioGroup>
                          </div>
                      </i-col>
                      <i-col  span="12" style="padding-left:20px;">
                          <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                              <h1 style="font-weight:bold;font-size:16px;">选择合班班级</h1>
                              <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                                  <Checkbox :label="item" v-show="item.isShow" v-for="(item,index) in classData" :key="index" style="display:block;margin:5px;">
                                      <span class="f14" v-cloak>{{item.CoursePlanTableName}}</span>
                                  </Checkbox>
                              </CheckboxGroup>
                          </div>
                      </i-col>
                  </Row>
              </div>
              <div slot="footer">
                  <Button class="xy-modal-close" @click="CreatClassClose">取消</Button>
                  <Button class="xy-modal-primary" shape="circle" @click="submitCreatClass">保存</Button>
                  <Button class="xy-modal-primary" shape="circle" @click="submitContinueCreatClass">保存并继续</Button>
              </div>
          </Modal>
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
        StepsHeader: {},
        classPlan: {},
        isHaveData: false,
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '您还没有合班的信息，请创建合班。',
        selectionAll: [],
        isShowPage: false,
        datatable: [],
        columnss: [
          {
            title: '合班上课课程',
            scopedSlots: { customRender: 'SubjectName' }
          },
          {
            title: '合班上课班级',
            scopedSlots: { customRender: 'CoursePlanTableName' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        weekData: [],
        confirmParm: {},
        // 创建合班
        modalCreatClass: false,
        crouseList: [],
        selectSubjectID: '',
        classData: [],
        checkAllGroup: []
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
    created () {
      this.StepsHeader = this.$parent.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      for (let i = 0; i < 7; i++) {
        this.weekData.push({
          day: i,
          isSelect: false,
          name: this.xy.getChinesesWeekForNumSmall(i)
        })
      }
      this.getList()
    },
    mounted () {

    },
    methods: {
      // 获取列表数据
      getList () {
        this.selectionAll = []
        this.selectedRowKeys = []
        this.tableLoading = true
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetUnion`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          if (res.success) {
            this.datatable = res.data
          }
          this.tableLoading = false
        })
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      // 删除
      delOne (row) {
        this.confirmParm = row
        this.xy.confirm('温馨提示', '您确定要删除此条合班上课设置吗？', this.delOneOk)
      },
      delOneOk (row) {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/DeleteUnion`, {
          id: this.confirmParm.CoursePlanUnionID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.getList()
          }
        })
      },

      // 批量删除
      delAll () {
        if (this.StepsHeader.isOperation === 0) {
          if (this.selectionAll.length === 0) {
            this.xy.msgError('请选择删除项。')
          } else {
            this.xy.confirm('温馨提示', '您确定要删除所有选中的合班上课设置吗？', this.delAllOk)
          }
        }
      },
      delAllOk () {
        let ids = ''
        for (let i = 0; i < this.selectionAll.length; i++) {
          ids += this.selectionAll[i].CoursePlanUnionID + ','
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/DeleteListUnion`, {
          ids: ids
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.getList()
          }
        })
        this.selectionAll = []
      },

      // 创建合班
      creatClass () { // 获取数据
        if (this.StepsHeader.isOperation === 0) {
          this.getCreateUnion()
          this.modalCreatClass = true
        }
      },
      getCreateUnion () { // 获取课程
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetCreateSubject`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.crouseList = res.data
          }
        })
      },
      radioChange () { // 点击课程
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetCreateCollection`, {
          classTableID: this.classPlan.classTableID,
          subjectID: this.selectSubjectID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.classData = []
            this.checkAllGroup = []
            let resData = res.data
            resData.map((item) => {
              item.isShow = true
              return item
            })
            this.classData = resData
          }
        })
      },
      checkAllGroupChange () {
        for (let i = 0; i < this.classData.length; i++) {
          if (this.checkAllGroup.length > 0) {
            for (let j = 0; j < this.checkAllGroup.length; j++) {
              if (this.classData[i].Lesson !== this.checkAllGroup[j].Lesson) {
                this.classData[i].isShow = false
              } else {
                this.classData[i].isShow = true
              }
            }
          } else {
            this.classData[i].isShow = true
          }
        }
      },

      submitCreatClass () { // 保存
        if (this.selectSubjectID === '') {
          this.xy.msgError('请选择数据后再保存。')
          return false
        };
        if (this.checkAllGroup.length < 2) {
          this.xy.msgError('合班的班级必须为两个及以上。')
          return false
        };
        let ids = []
        for (let j = 0; j < this.checkAllGroup.length; j++) {
          ids.push(this.checkAllGroup[j].CoursePlanTableID)
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/CreateUnion`, {
          ClassTableID: this.classPlan.classTableID,
          SubjectID: this.selectSubjectID,
          Lesson: this.checkAllGroup[0].Lesson,
          CoursePlanTables: ids
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.modalCreatClass = false
            this.selectSubjectID = ''
            this.checkAllGroup = []
            this.getList()
          }
        })
      },
      // 创建合班的取消
      CreatClassClose () {
        this.checkAllGroup = []
        this.selectSubjectID = ''
        this.modalCreatClass = false
      },
      submitContinueCreatClass () { // 保存并继续
        if (this.selectSubjectID === '') {
          this.xy.msgError('请选择数据后再保存。')
          return false
        };
        if (this.checkAllGroup.length < 2) {
          this.xy.msgError('合班的班级必须为两个及以上。')
          return false
        };
        let ids = []
        for (let j = 0; j < this.checkAllGroup.length; j++) {
          ids.push(this.checkAllGroup[j].CoursePlanTableID)
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/CreateUnion`, {
          ClassTableID: this.classPlan.classTableID,
          SubjectID: this.selectSubjectID,
          Lesson: this.checkAllGroup[0].Lesson,
          CoursePlanTables: ids
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.checkAllGroup = []
            this.selectSubjectID = ''
            this.getCreateUnion()
            this.getList()
          }
        })
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../../css/arrangingRules.less';
</style>
