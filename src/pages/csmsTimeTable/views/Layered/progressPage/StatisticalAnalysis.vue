<!--  -->
<template>
  <div id='StepsHeader'
       class="xy-content-body">
    <div class="progress-title">
      <div class="">
        <Button class="xy-primary"
                @click="modal = true"
                v-if='selectNum!==2'>筛选班级</Button>
        <dropdown @on-click="filterFun"
                  trigger="click"
                  v-if='selectNum===2'>
          <Button class="xy-info">
            更多
            <icon type="ios-arrow-down"></icon>
          </Button>
          <dropdown-menu slot="list">
            <dropdown-item name="1">筛选课程</dropdown-item>
            <dropdown-item name="2">筛选班级</dropdown-item>
          </dropdown-menu>
        </dropdown>
        <Button class="xy-info"
                @click="exportFile"
                style="margin-left:10px">导出</Button>
      </div>
      <div class="">
        <button-group style="margin-right:15px">
          <Button :class="selectNum===0?'xy-primary':''"
                  @click="loadComplete(0)">单科统计</Button>
          <Button :class="selectNum===1?'xy-primary':''"
                  @click="loadComplete(1)">分层统计</Button>
          <Button :class="selectNum===2?'xy-primary':''"
                  @click="loadComplete(2)">组合统计</Button>
        </button-group>
        <Button class=""
                @click="goBack">返回</Button>
      </div>
    </div>
    <!-- 已选择班级 -->
    <div class='choose-class'
         v-if='showClass.length>0'>
      <Alert show-icon>
        <span> 已选择班级:</span>
        <span v-for='(i,index) in showClass'
              :key="index">{{i.StudentOrganizationFullName}}{{index===showClass.length-1?'':'、'}}</span>
      </Alert>
    </div>
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
        <CheckboxGroup v-model="classOrganizationIDs"
                       @on-change="checkAllGroupChange"
                       style="margin-top: 10px;">
          <Checkbox style="padding: 10px 0 10px 0;"
                    v-for="item in classData"
                    :label="item.StudentOrganizationID"
                    :key="item.StudentOrganizationID"> {{ item.StudentOrganizationFullName }}({{ item.StuCount }}人)</Checkbox>
        </CheckboxGroup>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="sure">保 存</Button>
      </div>
    </modal>
    <!-- 每个tab页的内容 -->
    <component :is="currentName"
               ref='childComponents'></component>

  </div>
</template>

<script>
  import SingleCountChart from './SingleCountChart'
  import LayeredStatistical from './LayeredStatistical'
  import CombinationStatistical from './CombinationStatistical'

  export default {
    components: { SingleCountChart, LayeredStatistical, CombinationStatistical },
    data () {
      return {
        currentName: 'SingleCountChart',
        selectNum: 0,
        classOrganizationIDs: [], // 已选择班级的id
        classList: [],
        // 筛选班级
        modal: false,
        showClass: [],
        classData: [],
        checkedAll: false, // 全选
        indeterminate: false,
        layeredStepsHeader: {}
      }
    },

    created: function () {
      this.layeredStepsHeader = this.$parent.$parent
      this.getClass()
    },
    mounted: function () { },
    methods: {
      // 获取所有的班级
      async  getClass () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/GetLayeredOrganizationListByID`, {
          layeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
          layeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID
        })
        if (res.success && res.data.length > 0) {
          this.classData = res.data
        }
      },
      loadComplete: function (type) {
        this.selectNum = type
        this.currentName = 'SingleCountChart'
        if (type === 1) {
          this.currentName = 'LayeredStatistical'
        } else if (type === 2) {
          this.currentName = 'CombinationStatistical'
        }
      },
      goBack: function () {
        this.$parent.ischangeTab = true
      },
      exportFile: function () {
        let ids = this.classOrganizationIDs.length > 0 ? this.classOrganizationIDs.join(',') : ''
        if (this.selectNum === 0) {
          if (this.$refs.childComponents.dataTable.length > 0) {
            this.xy.downFile(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/ExpertingleSelect`, {
              LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
              LayeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID,
              SeachText: '',
              StudentOrganizationIDS: ids,
              Type: 0
            })
          } else {
            this.xy.msgError('暂无导出数据。')
          }
        } else if (this.selectNum === 1) {
          if (this.$refs.childComponents.dataTableList.length > 0) {
            this.xy.downFile(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/ExpertGroupSelectInfo`, {
              LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
              LayeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID,
              SeachText: '',
              StudentOrganizationIDS: ids,
              Type: 0
            })
          } else {
            this.xy.msgError('暂无导出数据。')
          }
        } else if (this.selectNum === 2) {
          if (this.$refs.childComponents.dataTable.length > 0) {
            let obj = {
              LayeredSelectProgrammeID: this.layeredStepsHeader.LayeredSelectProgrammeID,
              LayeredSelectRotationID: this.layeredStepsHeader.LayeredSelectRotationID,
              StudentOrganizationIDS: ids,
              SubjectList: this.$refs.childComponents.selectedSub
            }
            let str = ''
            if (obj.SubjectList.length > 0) {
              let arr = obj.SubjectList
              arr.map(function (item, index) {
                str += item.AID + ',' + item.Type + ((index !== arr.length - 1) ? '|' : '')
              })
            }
            obj.SubjectList = str
            this.xy.downFile(`${this.$store.state.apiPath}/api/LayeredSelectPreselection/ExpertCombinationSelectInfo`, obj)
          } else {
            this.xy.msgError('暂无导出数据。')
          }
        }
      },

      // ------------------------筛选班级start------------------------------------
      filterFun: function (res) {
        if (res === '1') {
          this.$refs.childComponents.filterSubject()
        } else {
          this.modal = true
        }
      },
      sure: function () {
        this.showClass = []
        if (this.classOrganizationIDs.length > 0) {
          this.classData.map(pItem => {
            this.classOrganizationIDs.map(item => {
              if (pItem.StudentOrganizationID === item) {
                this.showClass.push(pItem)
              }
            })
          })
        }
        this.$refs.childComponents.getTable()
        // if (this.selectNum === 0) {
        //   this.$refs.childComponents.getTable()
        // } else if (this.selectNum === 1) {
        //   this.$refs.childComponents.getTable()
        // } else if (this.selectNum === 2) {
        //   this.$refs.childComponents.getTable()
        // }
        this.modal = false
      },
      cancel: function () {
        this.modal = false
        if (this.showClass.length > 0) {
          this.classOrganizationIDs = []
          this.showClass.map(pItem => {
            this.classData.map(item => {
              if (pItem.StudentOrganizationID === item.StudentOrganizationID) {
                this.classOrganizationIDs.push(pItem.StudentOrganizationID)
              }
            })
          })
          if (this.classOrganizationIDs.length === this.classData.length) { // 全部选中
            this.checkedAll = true
            this.indeterminate = false
          }
        } else {
          this.checkedAll = false
          this.indeterminate = false
        }
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
          this.classOrganizationIDs = []
          this.classData.map(item => {
            this.classOrganizationIDs.push(item.StudentOrganizationID)
          })
        } else {
          this.classOrganizationIDs = []
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
      reset: function () {
        for (let i = 0; i < this.moreClassList.length; i++) {
          this.moreClassList[i].checkAllGroup = []
          this.moreClassList[i].checked = false
        }
      }
    }

  }
</script>
<style lang='less' scoped>
.xy-primary {
  margin-right: 0;
}
.choose-class {
  display: flex;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  opacity: 0.85;
}
</style>
