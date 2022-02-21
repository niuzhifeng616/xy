
<template>
  <div id="arrangingRules">
    <div class="SingleDoubleWeek-rule">
        <div style="margin:20px;">
           <Button class="xy-primary" type="primary" @click="creatCrouse"
                          :disabled="StepsHeader.isOperation != 0">创建单双周课程</Button>
                <Button class="xy-danger" type="primary" @click="delAll"
                          :disabled="StepsHeader.isOperation != 0?true:datatable.length>0?false:true">批量删除</Button>
        </div>
        <div class="xy-content-table">
            <XyAntTable
              :rowSelection="tableRowSelection"
              :columns="columnss"
              :isPage="false"
              :dataSource="datatable"
              :nullData="nullData"
              :tableLoading="tableLoading">
              <div slot="CoursePlanTableName"
                    slot-scope="text, record">
                <div style="min-width:300px">
                  {{record.CoursePlanTableName}}
                </div>
              </div>
              <div slot="OddWeekName"
                    slot-scope="text, record">
                <div style="min-width:200px">
                  {{record.OddWeekName}}
                </div>
              </div>
              <div slot="DualWeekName"
                    slot-scope="text, record">
                <div style="min-width:200px">
                  {{record.DualWeekName}}
                </div>
              </div>
              <span slot="oprateRender"
                    slot-scope="text, record">
                <a :disabled="StepsHeader.isOperation!==0"
                    @click="delOne(record)">删除</a>
              </span>
            </XyAntTable>
        </div>

        <!--创建单双周课程-->
        <Modal v-model="modalCreatSingleDouble"
               v-if="StepsHeader.isOperation == 0"
               width="864"
               :transfer="false"
               :mask-closable="false">
            <p slot="header">创建单双周课程</p>
            <div style="font-size:14px;height:400px;overflow-y:auto">
                <Row>
                    <i-col  span="8">
                        <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                            <h1 style="font-size:16px;margin-bottom:10px;">班级</h1>
                            <Checkbox :indeterminate="indeterminate"
                                      :value="checkAll"
                                      @click.prevent.native="allChange"
                                      class="f14">全选</Checkbox>
                            <CheckboxGroup  v-model="checkAllGroup" @on-change="checkAllGroupChange">
                                <Checkbox :label="item" v-for="(item,index) in classCheckboxData" :key="index" style="display:block;margin:5px;">
                                    <span class="f14" v-cloak>{{item.CoursePlanTableName}}</span>
                                </Checkbox>
                            </CheckboxGroup >
                        </div>
                    </i-col>
                    <i-col  span="8" style="padding-left:20px;">
                        <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                            <h1 style="font-size:16px;margin-bottom:10px;">单周所上课程</h1>
                            <RadioGroup  v-model="singleSelectRadio" vertical @on-change="singleChange">
                                <Radio :label="single"
                                       v-show="single.isShow"
                                       v-for="(single,index) in singleData"
                                       :key="index">
                                    <span class="f14" v-cloak>{{single.SubjectName}}({{single.Lesson}}课时)</span>
                                </Radio>
                            </RadioGroup >
                        </div>
                    </i-col>
                    <i-col  span="8" style="padding-left:20px;">
                        <div style="padding:10px 15px;height:400px;overflow-y:auto;border:1px solid #eaeaea">
                            <h1 style="font-size:16px;margin-bottom:10px;">双周所上课程</h1>
                            <RadioGroup  v-model="doubleSelectRadio" vertical @on-change="doubleChange">
                                <Radio :label="double"
                                       v-show="double.isShow"
                                       v-for="(double,index) in doubleData"
                                       :key="index">
                                    <span class="f14" v-cloak>{{double.SubjectName}}({{double.Lesson}}课时)</span>
                                </Radio>
                            </RadioGroup >
                        </div>
                    </i-col>
                </Row>
            </div>
            <div slot="footer">
                <Button class="xy-modal-close"  @click="modalCreatSingleDouble = false">取消</Button>
                <Button class="xy-modal-primary" shape="circle"  @click="submitCreatCrouse">保存</Button>
                <Button class="xy-modal-primary" shape="circle"  @click="submitContinueCreatCrouse">保存并继续</Button>
            </div>
        </Modal>
    </div>
  </div>
</template>

<script>
  // import XyTable from '@/components/table/XyTable.vue'
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    components: {
      XyAntTable
    },
    data () {
      return {
        noDataText: '您还没有单双周课程的信息，请创建单双周课程。',
        StepsHeader: {},
        classPlan: {},
        isHaveData: false,
        // antTable
        selectedRowKeys: [],
        loadingTable: true,
        tableLoading: true,
        nullData: '您还没有单双周课程的信息，请创建单双周课程。',
        selectionAll: [],
        total: 0, // 总条数
        pageSize: 15, // 每页显示条数
        pageIndex: 1, // 当前页码
        pageList: '', // 当前页数据条数
        isShowPage: false,
        datatable: [],
        columnss: [
          {
            title: '班级',
            scopedSlots: { customRender: 'CoursePlanTableName' }
          },
          {
            title: '单周所上课程',
            scopedSlots: { customRender: 'OddWeekName' }
          },
          {
            title: '双周所上课程',
            scopedSlots: { customRender: 'DualWeekName' }
          },
          {
            title: '操作',
            dataIndex: 'oprateRender',
            width: 80,
            scopedSlots: { customRender: 'oprateRender' }
          }
        ],
        confirmParm: '',
        // 创建对开课程
        modalCreatSingleDouble: false,
        classCheckboxData: [],
        indeterminate: false,
        checkAll: false,
        checkAllGroup: [],
        singleData: [],
        doubleData: [],
        singleSelectRadio: '',
        doubleSelectRadio: ''
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
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetWeekList`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
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
        this.xy.confirm('温馨提示', '您确定要删除' + row.CoursePlanTableName + '吗？', this.delOneOk)
      },
      delOneOk (row) {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/DeleteWeek`, {
          id: this.confirmParm.ClassTableOddDualWeekID
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
            this.xy.confirm('温馨提示', '您确定要删除所选中的单双周课程？', this.delAllOk)
          }
        }
      },
      delAllOk () {
        let ids = ''
        for (let i = 0; i < this.selectionAll.length; i++) {
          ids += this.selectionAll[i].ClassTableOddDualWeekID + ','
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/DeleteListWeek`, {
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
      // 创建对开课程
      creatCrouse () { // 班级列表
        if (this.StepsHeader.isOperation === 0) {
          this.classCheckboxData = []
          this.singleData = []
          this.doubleData = []
          this.singleSelectRadio = ''
          this.doubleSelectRadio = ''
          this.checkAllGroup = []
          this.indeterminate = false
          this.checkAll = false
          this.xy.loading()
          this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetWeekCollectionList`, {
            classTableID: this.classPlan.classTableID
          }).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.classCheckboxData = res.data
              this.modalCreatSingleDouble = true
            }
          })
        }
      },
      allChange () { // 班级全选
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        };
        this.indeterminate = false

        if (this.checkAll) {
          this.checkAllGroup = this.classCheckboxData
        } else {
          this.checkAllGroup = []
        };
        if (this.checkAllGroup.length > 0) {
          this.getCreateWeekList()
        } else {
          this.singleData = []
          this.doubleData = []
        }
      },
      checkAllGroupChange (data) { // 班级多选
        if (data.length === this.classCheckboxData.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        };

        if (this.checkAllGroup.length > 0) {
          this.getCreateWeekList()
        } else {
          this.singleData = []
          this.doubleData = []
        }
      },
      getCreateWeekList () { // 通过班级获取课程
        let ids = []
        for (let i = 0; i < this.checkAllGroup.length; i++) {
          ids += this.checkAllGroup[i].CoursePlanTableID + ','
        };
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetCreateWeekList`, {
          classTableID: this.classPlan.classTableID,
          coursePlanTableIDs: ids
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.singleData = []
            this.singleSelectRadio = ''
            this.doubleData = []
            this.doubleSelectRadio = ''
            let resData = res.data
            resData.map((item) => {
              item.isShow = true
              return item
            })
            let arr = []
            let arr1 = []
            for (let i = 0; i < resData.length; i++) {
              arr.push({
                Lesson: resData[i].Lesson,
                SubjectID: resData[i].SubjectID,
                SubjectName: resData[i].SubjectName,
                isShow: resData[i].isShow
              })
              arr1.push({
                Lesson: resData[i].Lesson,
                SubjectID: resData[i].SubjectID,
                SubjectName: resData[i].SubjectName,
                isShow: resData[i].isShow
              })
            }
            this.singleData = arr
            this.doubleData = arr1
          }
        })
      },
      singleChange (val) { // 单周
        this.doubleData.map((item) => {
          item.isShow = true
          return item
        })
        for (let i = 0; i < this.doubleData.length; i++) {
          if (this.doubleData[i].SubjectID === val.SubjectID || this.doubleData[i].Lesson !== val.Lesson) {
            this.doubleData[i].isShow = false
          }
        }
        this.singleSelectRadio = val
      },
      doubleChange (val) { // 双周
        this.singleData.map((item) => {
          item.isShow = true
          return item
        })
        for (let i = 0; i < this.singleData.length; i++) {
          if (this.singleData[i].SubjectID === val.SubjectID || this.singleData[i].Lesson !== val.Lesson) {
            this.singleData[i].isShow = false
          }
        }
        this.doubleSelectRadio = val
      },
      submitCreatCrouse () { // 保存
        if (this.checkAllGroup.length === 0) {
          this.xy.msgError('请选择班级。')
          return false
        };
        if (this.singleSelectRadio === '' && this.doubleSelectRadio === '') {
          this.xy.msgError('请勾选单双周所上课程。')
          return false
        };
        let postData = []
        for (let i = 0; i < this.checkAllGroup.length; i++) {
          let oddWeekID = -1
          let dualWeekID = -1
          if (this.singleSelectRadio !== '') {
            oddWeekID = this.singleSelectRadio.SubjectID
          };
          if (this.doubleSelectRadio !== '') {
            dualWeekID = this.doubleSelectRadio.SubjectID
          }
          postData.push({
            ClassTableID: this.classPlan.classTableID,
            OddWeekID: oddWeekID,
            DualWeekID: dualWeekID,
            CoursePlanTableID: this.checkAllGroup[i].CoursePlanTableID
          })
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/CreateWeek`, postData).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.modalCreatSingleDouble = false
            this.getList()
          }
        })
      },
      submitContinueCreatCrouse () { // 保存并继续
        if (this.checkAllGroup.length === 0) {
          this.xy.msgError('请选择班级。')
          return false
        };
        if (this.singleSelectRadio === '' && this.doubleSelectRadio === '') {
          this.xy.msgError('请勾选单双周所上课程。')
          return false
        };

        let postData = []
        for (let i = 0; i < this.checkAllGroup.length; i++) {
          let oddWeekID = -1
          let dualWeekID = -1
          if (this.singleSelectRadio !== '') {
            oddWeekID = this.singleSelectRadio.SubjectID
          };
          if (this.doubleSelectRadio !== '') {
            dualWeekID = this.doubleSelectRadio.SubjectID
          }
          postData.push({
            ClassTableID: this.classPlan.classTableID,
            OddWeekID: oddWeekID,
            DualWeekID: dualWeekID,
            CoursePlanTableID: this.checkAllGroup[i].CoursePlanTableID
          })
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/CreateWeek`, postData).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.getList()
            this.creatCrouse()
          }
        })
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../../css/arrangingRules.less';
</style>
