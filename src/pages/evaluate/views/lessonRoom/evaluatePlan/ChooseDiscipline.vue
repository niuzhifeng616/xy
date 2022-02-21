<template>
  <div class="planCreat">
    <div class="xy-content-body">
       <span class="font85">参评学科</span> <Checkbox class="m-l-15 font65" v-model="allselect" @on-change="checkAll">全选</Checkbox>
      <div v-if="subjectArr.length > 0">
        <ul class="plan-list">
          <li v-for="(item,index) in subjectArr" :key="index" :class="item.checked ? 'is-checked':''" @click="check(item,index)">
            <div class="info">
              <p class="f16 class-table-name" :title="item.DisciplineName" v-cloak>{{item.DisciplineName}}</p>
              <div :class="item.checked?'active-bg sanjiao':'sanjiao'"><i class="iconfont">&#xe6a1;</i></div>
            </div>
            <img src="./imgs/ktpj.png" alt="">
          </li>
        </ul>
        <div class="fix-btn">
          <Button class="xy-btn-primary" shape="circle" :disabled="StepsHeader.rowObj.IsEnable==='1'" @click="save">保存</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ChooseDiscipline',
    data () {
      return {
        allselect: '',
        subjectArr: [],
        // 方案信息
        StepsHeader: {},
        checkArr: []
      }
    },

    watch: {
      subjectArr (newValue) {
        this.checkArr = []
        this.subjectArr = newValue
        this.subjectArr.map(item => {
          if (item.checked) {
            this.checkArr.push(item.DisciplineID)
          }
        })
        if (this.checkArr.length === this.subjectArr.length) { // 选中最后一个，全选做选中
          this.allselect = true
        } else {
          this.allselect = false
        }
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.getProgrammeDiscipline()
    },
    methods: {
      // 获取列表
      getDisciplineList () {
        this.xy.loading()
        this.xy.get(`${this.xyApi}/xy/comm/GetDisciplineList`).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            resData.map(item => {
              if (this.checkArr.indexOf(item.DisciplineID) > -1) {
                item.checked = true
              } else {
                item.checked = false
              }
              return item
            })
            this.subjectArr = res.data
          }
        })
      },
      getProgrammeDiscipline () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ProgrammeSetting/GetProgrammeDiscipline`, {
          programmeID: this.$parent.rowObj.ProgrammeID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            resData.map(item => {
              this.checkArr.push(item.DisciplineID)
            })
            this.getDisciplineList()
          }
        })
      },
      // 全选
      checkAll () {
        this.subjectArr.map(item => {
          item.checked = this.allselect
          if (this.allselect) {
            this.checkArr.push(item.DisciplineID)
          } else {
            this.checkArr = []
          }
        })
      },
      check (item, index) {
        if (item.checked) {
          item.checked = false
        } else {
          item.checked = true
        }
        const checked = item.checked
        this.updateDraft(this.subjectArr, index, { checked })
      },
      // 更新视图
      updateDraft (tableData, index, field) {
        const obj = Object.assign({}, tableData[index])
        this.$set(tableData, index, {})
        for (var key in field) {
          obj[key] = field[key]
        }
        this.$set(tableData, index, obj)
      },
      // 保存
      save () {
        if (this.StepsHeader.rowObj.IsEnable === '1') {
          return false
        }
        if (this.checkArr.length === 0) {
          this.xy.msgW('您还未选择学科。')
        } else {
          this.checkArr = [...new Set(this.checkArr)]
          // 保存
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/ProgrammeSetting/ProgrammeDiscipline`, {
            ProgrammeID: this.$parent.rowObj.ProgrammeID,
            DisciplineIDs: this.checkArr
          }).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('保存成功。')
              this.$parent.getGeneralFlows()
            }
          })
        }
      }

    }
  }
</script>
<style lang="less" scoped>
.planCreat{
  -webkit-user-select:none;
   -moz-user-select:none;
   -ms-user-select:none;
   user-select:none;
   .m-l-15{
     margin-left:15px;
   }
   .font85{
     color:rgba(0, 0, 0, 0.85);
     font-weight: 700;
   }
   .font65{
     color:rgba(0, 0, 0, 0.65);
   }
   .icon-holiday {
    display: inline-block;
    font-size: 24px;
    color: #fff;
    min-width: 48px;
    height: 48px;
    border-radius: 50%;
    text-align: center;
    line-height: 48px;
  }
  .plan-list {
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    cursor: pointer;
    margin-bottom: 50px;
  }
  .plan-list li {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px 15px;
    padding-right: 45px;
    width: 298px;
    height: 100px;
    margin: 10px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(233, 233, 233, 1);
    .info {
      flex: 1;
      color: rgba(0, 0, 0, 0.85);
      margin-left: 10px;
      div {
        display: flex;
        color:rgba(0,0,0,0.45);
        .fl {
          display: inline-block;
          padding-right: 10px;
          margin-right: 10px;
          border-right: 1px solid #e8e8e8;
        }
      }
    }
    img{
      width:40px;
      height: 46px;
    }
  }
  .plan-list  .is-checked{
    border-color: rgba(65,150,255,1) !important;
  }
  .plan-list .class-table-name {
    max-width:110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 10px;
  }

  .plan-list .plan-span {
    margin-top: 17px;
  }
  .plan-list .plan-span span {
    color: #8b8b8b;
  }
  .sanjiao {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    border-color: transparent #e9e9e9 #e9e9e9 transparent;
    border-width: 15px;
    border-style: solid;
    i {
      position: absolute;
      right: -13px;
      bottom: -17px;
      color: #fff;
    }
  }
  .active-bg {
    border-color: transparent #4196ff #4196ff transparent !important;
  }
  .fix-btn {
    height: 50px;
    position: fixed;
    line-height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    button {
      margin-right: 20px;
    }
  }
}

</style>
