<template>
  <div class="choose-mark">
    <div class="xy-content-body" style="border-top:1px solid rgba(0,0,0,0.1);padding-top:0;">
      <div class="content">
        <div class="content-left">
          <h5>选择学科</h5>
          <ul>
            <li v-for="(item,index) in leftData" :key="index"
              :class="activeId === item.DisciplineID?'active':''"
              @click="chooseItem(item,index)">
              {{item.DisciplineName}}
              <span v-if="item.SetIndex">已设置</span>
            </li>
          </ul>
        </div>
        <div class="content-right">
          <div class="top">
            <div class="flex">
              <h5>选择指标</h5>
              <Input suffix="ios-search" search  v-model.trim="searchName" placeholder="搜索指标" style="width: auto" class="input"  @on-search="searchNameFun" />
            </div>
            <Tree :data="treeData" show-checkbox check-directly ref="treeDom"></Tree>
          </div>
            <div class="fix-btn">
              <Button class="xy-btn-primary" shape="circle" :disabled="StepsHeader.rowObj.IsEnable==='1'" @click="save">保存</Button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ChooseMark',
    data () {
      return {
        leftData: [],
        treeData: [],
        activeId: '', // 当前科目id
        activeIndex: '', // 当前科目index
        searchName: '',
        StepsHeader: {}// 方案信息
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.getProgrammeDiscipline()
    },
    methods: {
      // 获取学科
      getProgrammeDiscipline () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ProgrammeSetting/GetProgrammeDiscipline`, {
          programmeID: this.$parent.rowObj.ProgrammeID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.leftData = res.data
            if (this.activeId === '') {
              this.activeId = this.leftData[0].DisciplineID
            }
            this.getProgrammeIndex()
          }
        })
      },
      // 获取学科指标列表
      getProgrammeIndex () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ProgrammeSetting/GetProgrammeIndex`, {
          programmeID: this.$parent.rowObj.ProgrammeID,
          disciplineID: this.activeId,
          name: this.searchName
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            this.treeData = []
            let childrenData = []
            this.treeData = [
              {
                title: '全选',
                expand: true,
                children: childrenData
              }
            ]
            for (let i = 0, len = resData.length; i < len; i++) {
              childrenData.push({
                title: resData[i].IndexManagementName,
                IndexManagementID: resData[i].IndexManagementID,
                Level: resData[i].Level,
                expand: true,
                children: this.treeRecursive(resData[i].Childrens)
              })
            }
          }
        })
      },
      treeRecursive (arr) {
        if (arr.length > 0) {
          let result = []
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].Level === 3) {
              result.push({
                title: arr[i].IndexManagementName,
                IndexManagementID: arr[i].IndexManagementID,
                Level: arr[i].Level,
                checked: arr[i].Checked,
                expand: true,
                children: []
              })
            } else {
              result.push({
                checked: arr[i].Checked,
                title: arr[i].IndexManagementName,
                IndexManagementID: arr[i].IndexManagementID,
                Level: arr[i].Level,
                expand: true,
                children: arr[i].Childrens.length > 0 ? this.treeRecursive(arr[i].Childrens) : []
              })
            }
          }
          return result
        }
      },
      // 选择学科
      chooseItem (item, index) {
        this.activeId = item.DisciplineID
        this.activeIndex = index
        this.getProgrammeIndex()
      },
      // 保存
      save () {
        if (this.StepsHeader.rowObj.IsEnable === '1') {
          return false
        }
        let indexManagementIDs = this.$refs.treeDom.getCheckedAndIndeterminateNodes()
        if (indexManagementIDs.length === 0) {
          this.xy.msgError('请选择学科指标。')
          return false
        }
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/ProgrammeSetting/UpdateProgrammeIndex`, {
          ProgrammeID: this.$parent.rowObj.ProgrammeID,
          DisciplineID: this.activeId,
          IndexManagementIDs: indexManagementIDs
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.$parent.getGeneralFlows()
            // 保存当前左侧顺延到下一科目
            if (this.activeIndex === this.leftData.length - 1) {
              this.activeIndex = 0
              this.activeId = this.leftData[0].DisciplineID
            } else {
              if (this.leftData.length > 1) {
                this.activeId = this.leftData[parseInt(this.activeIndex + 1)].DisciplineID
                this.activeIndex = parseInt(this.activeIndex + 1)
              }
            }
            this.getProgrammeDiscipline()
          }
        })
      },
      // 搜索
      searchNameFun () {
        this.getProgrammeDiscipline()
      }
    }

  }
</script>
<style lang="less" scoped>
.choose-mark{
  .content{
    display: flex;
    // border-top:1px solid rgba(0,0,0,0.1);
    .content-left{
      width: 317px;
      height: 637px;
      overflow-y:auto;
      padding: 23px 0 32px 0;
      border-right:1px solid rgba(0,0,0,0.1);
      h5{
        color:rgba(0,0,0,0.85);
        font-weight: 700;
        margin-left:33px;
        margin-bottom: 10px;
      }
      li{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 52px;
        line-height: 52px;
        color:rgba(0,0,0,0.85);
        border-bottom:1px dashed #E5E5E5;
        padding-left:32px;
        padding-right: 17px;
        span{
          width:60px;
          height:20px;
          line-height: 20px;
          background: rgba(82,196,26,1);
          border-radius: 4px;
          color:#fff;
          padding:1px 9px;
        }
      }
      li.active{
        background: rgba(65,150,255,0.2);
        color:rgba(65,150,255,1);
      }
    }
    .content-right{
       position: relative;
       flex:1;
       height: 637px;
       overflow-y:auto;
       div.top{
         padding: 23px 0 50px 32px;
         .flex{
           display: flex;
           justify-content: space-between;
           .input{
             margin-right:19px;
           }
         }
       }
       h5{
        color:rgba(0,0,0,0.85);
        font-weight: 700;
        margin-bottom: 10px;
      }
      .fix-btn {
        z-index:1;
        padding-right: 43px;
        height: 56px;
        position: fixed;
        line-height: 56px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: right;
        button {
          margin-right: 20px;
        }
      }
    }
  }
}

</style>
