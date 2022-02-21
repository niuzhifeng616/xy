<!--  步骤页面-->
<template>
  <div class="xy-content-module pr">
    <ul class="layered-step"
        v-if="isShowHeader">
      <li v-for="(item,n) in liData"
          :key='n'
          class="layered-step-tap"
          :data-url="item.isLoad > 0?item.url:''"
          data-targetID="StepsHeader"
          data-auto="loadPage"
          :data-source="'DivideClass[xy-splir-,]'+n+''"
          :class="item.isActive?'active-steps':item.isLoad > 0?'':'no-show'"
          @click='changeTab(item,n)'
          :ref="'DivideClass'+n">
        <div class="step-num">{{n+1}}</div>
        <a href="javascript:void(0);"
           class="layered-nav-btn"
           >{{item.name}}</a>
        <div class="step-line"
             v-if="n<5"></div>
      </li>
    </ul>
    <router-view></router-view>

  </div>

</template>

<script>
  export default {
    data () {
      return {
        rowObj: '',
        isShowHeader: true,
        divideClassID: '',
        typeName: '', // 头部名称
        typeUrl: '/xyhome/smartClassTable', // 头部返回url
        liData: [
          {
            name: '基本信息',
            isActive: true,
            isLoad: 1,
            url: 'smartCreateClassTable'
          },
          {
            name: '选科结果',
            isActive: false,
            isLoad: 0,
            url: 'smartSelectSubjectResult'
          },
          {
            name: '分班设置',
            isActive: false,
            isLoad: 0,
            url: 'divideClassSet'
          },
          {
            name: '启动分班',
            isActive: false,
            isLoad: 0,
            url: 'startDivideClass'
          },
          {
            name: '优化分班',
            isActive: false,
            isLoad: 0,
            url: 'smartClassResult'
          },
          {
            name: '发布',
            isActive: false,
            isLoad: 0,
            url: 'smartPublish'
          }
        ],
        isOperation: 0
      }
    },

    created () {
      if (Object.keys(this.$store.state.csmstimetable.smartRowObj).length > 0) {
        this.rowObj = this.$store.state.csmstimetable.smartRowObj
        this.divideClassID = this.rowObj.DivideClassID
      }
      if (this.divideClassID > 0) {
        this.typeName = this.rowObj.DivideClassName
      } else {
        this.typeName = '创建方案'
      }
      this.getGeneralFlows()
    },
    mounted () {
      // eslint-disable-next-line no-return-assign
      this.liData.map((item) => { return item.isActive = false })
      this.liData[0].isActive = true
      this.$store.commit('common/getThreeMenuName', this.typeName)
      this.$store.commit('common/getParam', { pro: 'smartClassTable' })
      this.$router.push({ path: '/xyhome/smartStepsHeader/smartCreateClassTable', query: this.$store.state.common.menuInfo })
    },
    methods: {
      async getGeneralFlows (val) {
        if (!this.divideClassID) {
          return
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetDivideClassGeneralFlows`, {
          divideClassID: this.divideClassID
        })
        if (res.success) {
          let resData = res.data
          // eslint-disable-next-line no-return-assign
          this.liData.map((item) => { return item.isLoad = 0 })
          this.liData[0].isLoad = 1
          this.liData[1].isLoad = resData.DivideClassID
          this.liData[2].isLoad = resData.StudentSelectCourse
          this.liData[3].isLoad = resData.DivideclassCollection
          this.liData[4].isLoad = resData.DivideClassGenerateCollection
          this.liData[5].isLoad = resData.DivideClassGenerateCollection

          this.isOperation = resData.IsPublished
        }
      },
      loadPage (index) {
        this.isShowHeader = true
        // eslint-disable-next-line no-return-assign
        this.liData.map((item) => { return item.isActive = false })
        this.liData[index].isActive = true
        this.getGeneralFlows()
      },
      changeTab (item, n) {
        let url = this.$refs[`DivideClass${n}`][0].dataset.url
        if (url) {
          // this.$store.commit('common/getParam', { pro: 'smartClassTable' })
          this.$router.push({ path: `/xyhome/smartStepsHeader/${item.url}`, query: this.$store.state.common.menuInfo })
          this.loadPage(n)
        }
      },
      // 返回
      back () {
        if (this.typeName !== '创建方案' && this.typeName !== '编辑方案') { // 二级页面，需要显示导航头部
          this.isShowHeader = true
        }
        // this.$router.push({ path: this.typeUrl })
        if (this.divideClassID > 0) {
          this.typeName = '编辑方案'
        } else {
          this.typeName = '创建方案'
        }
      // this.typeUrl = '/xyhome/smartClassTable'
      }
    }

  }
</script>
<style lang='less' scoped>
.layered-step {
  height: 73px;
  width: 100%;
  background: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  /*border-bottom: 1px solid #EAEAEA;*/
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
.step-header-title {
  height: 50px;
  padding: 0 12px;
  background: #fff;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.step-header-title h3 {
  font-size: 20px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
</style>
