
<!--  -->
<template>
  <div class="">
    <span style="position:absolute;right:20px;top:0;font-size:14px;color:#B3BACB">{{classTableName}}</span>
    <ul class="layered-step"
        v-if="isShowHeader">
      <li v-for="(item,n) in liData"
          :key='n'
          class="layered-step-tap"
          :data-url="item.isLoad > 0?item.url:''"
          data-targetID="StepsHeader"
          data-auto="loadPage"
          :data-source="'Layered[xy-splir-,]'+n+''"
          :class="item.isActive?'active-steps':item.isLoad > 0?'':'no-show'"
          @click='changeTab(item,n)'
          :ref="'layered'+n">
        <div class="step-num">{{n+1}}</div>
        <a href="javascript:void(0);"
           class="layered-nav-btn">{{item.name}}</a>
        <div class="step-line"
             v-if="n<4"></div>
      </li>
    </ul>
    <component :is="currentComponent"
               :rowObj='rowObj'></component>
  </div>
</template>

<script>
/* eslint-disable no-return-assign */
  import CreateClassTable from './CreateClassTable'
  import ChooseClassStudent from './ChooseClassStudent'
  import CrouseSetting from './crouseSetting/CrouseSetting'
  import ProgressPage from './progressPage/Progress'
  import PublishResult from './PublishResult'

  export default {
    components: { CreateClassTable, ChooseClassStudent, CrouseSetting, ProgressPage, PublishResult },
    data () {
      return {
        currentComponent: 'CreateClassTable',
        rowObj: '',
        isShowHeader: true,
        LayeredSelectProgrammeID: 0,
        LayeredSelectRotationID: 0,
        LayeredSelectProgrammeState: null,
        classTableName: '',
        liData: [
          {
            name: '基本信息',
            isActive: true,
            isLoad: 0,
            url: 'CreateClassTable'
          },
          {
            name: '选课学生',
            isActive: false,
            isLoad: 0,
            url: 'ChooseClassStudent'
          },
          {
            name: '选课设置',
            isActive: false,
            isLoad: 0,
            url: 'CrouseSetting'
          },
          {
            name: '选课进度',
            isActive: false,
            isLoad: 0,
            url: 'ProgressPage'
          },
          {
            name: '发布结果',
            isActive: false,
            isLoad: 0,
            url: 'PublishResult'
          }
        ],
        isOperation: 0
      }
    },
    created () {
      if (Object.keys(this.$store.state.csmstimetable.layeredRowObj).length > 0) { // 编辑
        this.rowObj = this.$store.state.csmstimetable.layeredRowObj
        this.LayeredSelectProgrammeID = this.rowObj.LayeredSelectProgrammeID
        this.LayeredSelectRotationID = this.rowObj.LayeredSelectRotationID
        this.LayeredSelectProgrammeState = this.rowObj.LayeredSelectProgrammeState
      }
      this.getGeneralFlows()
    },
    mounted () {
      this.liData.map((item) => { return item.isActive = false })
      this.liData[0].isActive = true
    // this.currentComponent = 'CreateClassTable'
    },
    methods: {
      getGeneralFlows (val) {
        this.xy.get(`${this.$store.state.apiPath}/api/GetLayeredSelectProgrammeFlows`, {
          layeredSelectProgrammeID: this.LayeredSelectProgrammeID
        }).then(res => {
          if (res.success) {
            let resData = res.data
            this.liData.map((item) => { return item.isLoad = 0 })
            this.liData[0].isLoad = 1
            this.liData[1].isLoad = resData.Students
            this.liData[2].isLoad = resData.Courses
            this.liData[3].isLoad = resData.Preselection
            this.liData[4].isLoad = resData.Results
            this.isOperation = resData.IsPublished
            this.LayeredSelectRotationID = resData.LayeredSelectRotationID
          }
        })
      },
      loadPage: function (index) {
        this.isShowHeader = true
        this.liData.map(function (item) { return item.isActive = false })
        this.liData[index].isActive = true
        this.getGeneralFlows()
      },
      changeTab (item, n) {
        let that = this
        let url = this.$refs[`layered${n}`][0].dataset.url
        if (url) {
          that.currentComponent = item.url
          that.loadPage(n)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.layered-step {
  height: 70px;
  width: 100%;
  background: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.layered-step-tap {
  display: flex;
  align-items: center;
}
.layered-nav-btn {
  color: #909399;
  font-size: 14px;
}
.layered-step-tap .step-num {
  width: 20px;
  height: 20px;
  line-height: 20px;
  border: 1px solid #1890ff;
  border-radius: 50%;
  font-weight: 400;
  font-size: 12px;
  margin-right: 5px;
  color: #cdcdcd;
  text-align: center;
  color: #1890ff;
}
.layered-step-tap .step-line {
  width: 100px;
  height: 1px;
  background-color: #1890ff;
  margin: 0 5px;
}
.active-steps .step-num {
  color: #fff;
  border-color: #1890ff;
  background: #1890ff;
}
.no-show .step-num {
  border-color: rgba(217, 217, 217, 1);
  color: #cdcdcd;
}
.no-show .step-line {
  background: rgba(0, 0, 0, 0.15);
}
</style>
