<!-- 2.选课结果：选课统计 -->
<template>
  <div id='StepsHeader'
       class="xy-content-body">
    <div class="progress-title">
      <Button class="xy-info"
              @click="filterClass">筛选班级</Button>
      <div class="right">
        <ButtonGroup style="margin:0  15px;">
          <Button :class="selectNum===0?'xy-primary':''"
                  @click="loadComplete(0)">单科统计</Button>
          <Button :class="selectNum===1?'xy-primary':''"
                  @click="loadComplete(1)">组合统计</Button>
        </ButtonGroup>
        <i class="iconfont"
           title='导出'
           @click="exportFile">&#xe6c0;</i>
        <div @click="goBack"
             class="back">
          <i class="iconfont">&#xe6a5;</i>
          <span>返回</span>
        </div>
      </div>
    </div>
    <div style="margin-bottom:10px ;"
         v-if='showClass.length>0'>
      <Alert show-icon
             closable>
        <span>已选择班级:</span>
        <span v-for="(i, index) in showClass"
              :key='index'>{{ i.StudentOrganizationFullName}}({{i.StuCount||0}}人){{index===showClass.length-1?'':'、'}}</span>。
      </Alert>
    </div>
    <!-- 筛选班级 -->
    <modal v-model="classModal"
           :transfer="false"
           title="筛选班级"
           :mask-closable="false"
           width=645>
      <div v-if='moreClassList.length>0'
           style="margin: 10px 0">
        <Checkbox :value="classCheckAll"
                  :indeterminate="indeterminate"
                  @click.prevent.native="chooseAll">全选</Checkbox>
        <checkbox-group class="filter-class"
                        v-model="classOrganizationIDs"
                        @on-change="checkAllGroupChange">
          <checkbox class="label-width"
                    :label="i.StudentOrganizationID"
                    :key='i.StudentOrganizationID'
                    v-for='i in moreClassList'>
            <span class="span-width"> {{i.StudentOrganizationFullName}}</span>
            <span> ({{i.StuCount||0}}人)</span>
          </checkbox>
        </checkbox-group>
      </div>
      <div v-else
           class="no-data-modal">
        <img src="@/assets/common/nullData.svg"
             alt="图片" />
        <p class="no-class">
          您还没有班级的信息，请添加班级。
        </p>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="sureSelectedClass">确定</Button>
      </div>
    </modal>
    <component :is="currentComponent"
               ref='childComponents'></component>

  </div>

</template>

<script>
  import SingleCountChart from './SingleCountChart'
  import CombinationStatistical from './CombinationStatistical'
  export default {
    components: { SingleCountChart, CombinationStatistical },
    data () {
      return {
        currentComponent: 'SingleCountChart',
        selectNum: 0,
        classOrganizationIDs: [], // 已选择班级的id
        // 筛选班级
        indeterminate: false,
        classCheckAll: false,
        classModal: false,
        showClass: [],
        moreClassList: [],
        isShowClass: false,
        smartDivideStepsHeader: {},
        SingleCountChart: {},
        CombinationStatistical: {}
      }
    },

    created () {
      this.smartDivideStepsHeader = this.$parent
      this.getClass()
    },
    methods: {
      showClassBox () {
        this.isShowClass = !this.isShowClass
      },
      // 获取所有的班级
      async getClass () {
        let that = this
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetIDCOrganizationListByID/?id=${this.smartDivideStepsHeader.divideClassID}`)
        if (res.success) {
          if (res.data.length > 0) {
            that.moreClassList = res.data
          }
        }
      },
      filterClass () {
        this.classOrganizationIDs = []
        this.showClass.map(item => {
          this.classOrganizationIDs.push(item.StudentOrganizationID)
        })
        this.checkAllGroupChange(this.classOrganizationIDs) // 改变全选的状态
        this.classModal = true
      },
      // 筛选班级
      sureSelectedClass () {
        this.showClass = []
        this.moreClassList.map((item) => {
          if (this.classOrganizationIDs.length > 0) {
            this.classOrganizationIDs.map((t) => {
              if (t === item.StudentOrganizationID) {
                this.showClass.push(item)
              }
            })
          }
        })
        this.classModal = false
        this.$refs.childComponents.getTable()
      },
      cancel () {
        this.classModal = false
      },
      // 筛选班级-----------全选
      chooseAll (item, index) {
        if (this.indeterminate) {
          this.classCheckAll = false
        } else {
          this.classCheckAll = !this.classCheckAll
        }
        this.indeterminate = false
        if (this.classCheckAll) {
          let arr = []
          this.moreClassList.map((item) => {
            arr.push(item.StudentOrganizationID)
          })
          this.classOrganizationIDs = arr
        } else {
          this.classOrganizationIDs = []
        }
      },
      // 单个改变
      checkAllGroupChange (data) {
        if (data.length === this.moreClassList.length && this.moreClassList.length > 0) {
          this.indeterminate = false
          this.classCheckAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.classCheckAll = false
        } else {
          this.indeterminate = false
          this.classCheckAll = false
        }
      },
      loadComplete (type) {
        this.selectNum = type
        if (type === 1) {
          this.currentComponent = 'CombinationStatistical'
        } else {
          this.currentComponent = 'SingleCountChart'
        }
      },
      exportFile () {
        let ids = this.classOrganizationIDs
        ids = ids.length > 0 ? ids.join(',') : ''
        if (this.selectNum === 0) {
          if (this.$refs.childComponents.dataTable.length > 0) {
            this.xy.downFile(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/ExpertingleSelect`, {
              DivideClassID: this.smartDivideStepsHeader.divideClassID,
              StudentOrganizationIDS: ids
            })
          } else {
            this.xy.msgError('暂无导出数据。')
          }
        } else if (this.selectNum === 1) {
          if (this.$refs.childComponents.dataTable.length > 0) {
            this.xy.downFile(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/ExpertCombinationSelectInfo`, {
              DivideClassID: this.smartDivideStepsHeader.divideClassID,
              StudentOrganizationIDS: ids,
              DisciplineIDS: ''
            })
          } else {
            this.xy.msgError('暂无导出数据。')
          }
        }
      },
      delClass (i) {
        let arr = []; let arrId = []
        this.showClass.map((item) => {
          if (i.StudentOrganizationID !== item.StudentOrganizationID) {
            arr.push(item)
            arrId.push(item.StudentOrganizationID)
          }
        })
        this.showClass = arr
        this.classOrganizationIDs = arrId
        this.checkAllGroupChange(arrId, true)
      },
      goBack () {
        this.$router.go(-1)
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../filterClass.less';
.progress-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  margin-bottom: 10px;
  .right {
    display: flex;
    align-items: center;
  }
  .iconfont {
    cursor: pointer;
  }
}
.student-class {
  display: flex;
}
.ivu-btn-group > .xy-primary {
  margin-right: 0;
}
.back {
  color: #1890ff;
  margin-left: 20px;
  cursor: pointer;
  .iconfont {
    margin-right: 5px;
    font-size: 14px;
  }
}
</style>
