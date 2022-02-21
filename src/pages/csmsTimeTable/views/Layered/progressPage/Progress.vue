
<template>
  <div class="xy-content-body"
       id="StepsHeader">
    <div id="statisticalInfo"
         v-show='ischangeTab'>
      <!-- 筛选条件 -->
      <div class="progress-title"
           id='statistical'>
        <div>
          <Button class="xy-primary"
                  @click="exportFile">导出</Button>
          <Button class="xy-info"
                  @click="statisticalAnalysis">统计分析</Button>
          <dropdown @on-click="more"
                    trigger="click">
            <Button class="xy-info">
              更多
              <icon type="ios-arrow-down"></icon>
            </Button>
            <dropdown-menu slot="list">
              <dropdown-item name="1"
                             :disabled='layeredStepsHeader.isOperation === 1'>未选课提醒</dropdown-item>
              <dropdown-item name="2"
                             :disabled='layeredStepsHeader.isOperation === 1'>清除选课结果</dropdown-item>
            </dropdown-menu>
          </dropdown>
        </div>
        <div>
          <ButtonGroup style="margin-right:15px">
            <Button :class="selectNum===0?'xy-primary':''"
                    @click="loadComplete(0)">全部</Button>
            <Button :class="selectNum===1?'xy-primary':''"
                    @click="loadComplete(1)">已选完:{{total}}人</Button>
            <Button :class="selectNum===2?'xy-primary':''"
                    @click="loadComplete(2)">未选完:{{unTotal}}人
            </Button>
          </ButtonGroup>
          <Button class="xy-info"
                  @click="filterClass">筛选班级</Button>
          <i-input search
                   clearable
                   v-model.trim="searchText"
                   @on-search="FromSubmit"
                   placeholder="请输入用户名/学籍号/姓名"
                   style="width: auto;">
            <icon type="ios-search cursor-p"
                  slot="suffix" />
          </i-input>
        </div>
      </div>
      <div class='choose-class'
           v-if='showClass.length>0'>
        <Alert show-icon><span> 已选择班级:</span> <span v-for='(i,index) in showClass'
                :key='index'>{{i.StudentOrganizationFullName}}{{index===showClass.length-1?'':'、'}}</span> 。</Alert>
      </div>
      <!-- 表格 -->
      <select-countTable ref='countTable'></select-countTable>
      <!-- 筛选班级 -->
      <modal v-model="modal"
             :transfer="false"
             title="筛选班级"
             :mask-closable="false"
             width=550>
        <div v-if='classData.length>0'>
          <Checkbox :indeterminate="indeterminate"
                    :value="checkedAll"
                    @click.prevent.native="handleCheckAll">全选</Checkbox>
          <CheckboxGroup v-model="checkedID"
                         @on-change="checkAllGroupChange"
                         style="margin-top: 10px;">
            <Checkbox style="padding: 10px 0 10px 0;"
                      v-for="item in classData"
                      :label="item.StudentOrganizationID"
                      :key="item.StudentOrganizationID"> {{ item.StudentOrganizationFullName }}({{ item.StuCount }}人)</Checkbox>
          </CheckboxGroup>
        </div>
         <div v-else class="no-class">
          您还没有班级的信息，请添加班级。
       </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="cancel">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="sure">保 存</Button>
        </div>
      </modal>
      <!--清除选课结果 -->
      <modal v-model="modalClear"
             :transfer="false"
             :mask-closable="false">
        <p slot="header">清除选课结果</p>
        <p style="margin-bottom:5px;font-size:14px;">请输入“<span style="color:#ed4014">清除选课结果</span>”六个字，点击确定按钮，进行全部删除的操作。
        </p>
        <div>
          <i-input v-model="clearText"
                   placeholder="请输入“清除选课结果”进行确认"></i-input>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close"
                  @click="modalClear = false">取消</Button>
          <Button class="xy-modal-primary"
                  shape="circle"
                  @click="clearSubmit">确定</Button>
        </div>
      </modal>

    </div>
    <statistical-analysis v-if='!ischangeTab'>
    </statistical-analysis>

  </div>
</template>

<script>

  import SelectCountTable from './SelectCountTable'
  import StatisticalAnalysis from './StatisticalAnalysis'
  export default {
    components: {
      SelectCountTable,
      StatisticalAnalysis
    },
    data () {
      return {
        ischangeTab: true,
        searchText: '',
        // 清除选课结果
        modalClear: false,
        clearText: '',
        selectNum: 0,
        total: 0,
        unTotal: 0,
        // 选课结果跳转过来的
        loadAdjust: '',
        // 筛选班级
        checkedID: [], // 已选择的id
        modal: false,
        showClass: [],
        classData: [],
        checkedAll: false, // 全选
        indeterminate: false,
        layeredStepsHeader: {}
      }
    },
    created: function () {
      this.layeredStepsHeader = this.$parent // 获取父组件layeredStepsHeader
      this.getClass()
    },
    mounted () {
      this.SelectCountTable = this.$refs.countTable // 获取子组件
    },
    methods: {
      getTotal: function (val) {
        this.total = val.SelectCount
        this.unTotal = val.UnSelectCount
        this.layeredStepsHeader.getGeneralFlows()
      },
      // 获取所有的班级
      async getClass () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetLayeredOrganizationListByID`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
          layeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID
        })
        if (res.success && res.data.length > 0) {
          this.checkedID = []
          this.showClass = []
          this.classData = res.data
          if (res.success && res.data.length > 0) {
            res.data.map((item) => {
              this.checkedID.push(item.StudentOrganizationID)
              this.showClass.push(item)
            })
            this.classData = res.data
          }
        }
      },
      FromSubmit: function () {
        this.SelectCountTable.pageCurrent = 1
        this.SelectCountTable.searchText = this.searchText
        this.SelectCountTable.getTable()
      },
      // 导出
      exportFile: function () {
        let that = this
        let ids = this.checkedID.length > 0 ? this.checkedID.join(',') : ''
        if (this.SelectCountTable.dataTable.length > 0) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/ExportSelectCourse`, {
            LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
            LayeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID,
            SeachText: that.searchText,
            StudentOrganizationIDS: ids,
            PageIndex: that.SelectCountTable.pageCurrent,
            PageSize: that.SelectCountTable.pageSize,
            Type: that.selectNum
          })
        } else {
          this.xy.msgError('暂无导出数据。')
        }
      },
      more: function (res) {
        if (res === '1') {
          this.noChooseClassRemind()
        } else if (res === '2') {
          this.clearAll()
        }
      },
      // 未选课提醒
      async  noChooseClassRemind () {
        let that = this
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/SenUnselectedMessage/?id=${this.layeredStepsHeader.LayeredSelectProgrammeID}&rotationID=${this.layeredStepsHeader.LayeredSelectRotationID}`)
        if (res.success) {
          that.xy.msgSuc('提醒成功。')
          this.xy.unloading()
        } else {
          this.xy.unloading()
        }
      },
      loadComplete: function (type) {
        this.selectNum = type
        this.SelectCountTable.pageCurrent = 1
        this.SelectCountTable.getTable()
      },
      // 清除选课结果
      clearAll: function () {
        this.clearText = ''
        this.modalClear = true
      },
      async  clearSubmit () {
        let that = this
        if (this.clearText === '清除选课结果') {
          if (this.SelectCountTable.dataTable.length > 0) {
            this.xy.loading()
            let res = await this.xy.post(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/Deletes/?id=${this.layeredStepsHeader.LayeredSelectProgrammeID}&rotationID=${this.layeredStepsHeader.LayeredSelectRotationID}`)
            this.xy.unloading()
            if (res.success) {
              that.xy.msgSuc('清除成功。')
              this.SelectCountTable.getTable()
            }

            that.modalClear = false
          } else {
            this.xy.msgW('没有需要清除的结果。')
          }
        } else {
          this.xy.msgError('请输入“清除选课结果”来确认删除全部选择。')
        }
      },
      // ------------------------筛选班级start------------------------------------
      filterClass: function () {
        this.modal = true
        this.checkedID = []
        if (this.classData.length > 0) {
          this.showClass.map((item) => {
            this.checkedID.push(item.StudentOrganizationID)
          })
          if (this.classData.length === 0 || this.checkedID.length === 0) {
            this.checkedAll = false
            this.indeterminate = false
          } else if (this.checkedID.length === this.classData.length) { // 全选
            this.checkedAll = true
            this.indeterminate = false
          } else if (this.checkedID.length > 0) { // 选中其中某一个
            this.checkedAll = false
            this.indeterminate = true
          }
        }
      },
      cancel: function () {
        this.modal = false
      },
      sure: function () {
        this.showClass = []
        if (this.checkedID.length > 0) {
          this.classData.map(pItem => {
            this.checkedID.map(item => {
              if (pItem.StudentOrganizationID === item) {
                this.showClass.push(pItem)
              }
            })
          })
        }
        this.SelectCountTable.pageCurrent = 1
        this.SelectCountTable.getTable()
        this.modal = false
      },

      // 筛选班级-----------全选
      handleCheckAll () {
        if (this.indeterminate) {
          this.checkedAll = false
        } else {
          this.checkedAll = !this.checkedAll
        }
        this.indeterminate = false

        if (this.checkedAll) {
          this.checkedID = []
          this.classData.map(item => {
            this.checkedID.push(item.StudentOrganizationID)
          })
        } else {
          this.checkedID = []
        }
      },
      checkAllGroupChange (data) {
        if (data.length === this.classData.length) {
          this.indeterminate = false
          this.checkedAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkedAll = false
        } else {
          this.indeterminate = false
          this.checkedAll = false
        }
      },
      // 统计分析
      statisticalAnalysis: function () {
        this.ischangeTab = false
      }
    }

  }
</script>
  <style lang='less' scoped>
.ivu-btn-group >.xy-primary {
  margin-right: 0;
}
.choose-class {
  display: flex;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  opacity: 0.85;
}
.no-class{
  text-align: center;
  font-size: 16px;
  color: rgb(127, 127, 127);
  line-height: 200px;
}
</style>
