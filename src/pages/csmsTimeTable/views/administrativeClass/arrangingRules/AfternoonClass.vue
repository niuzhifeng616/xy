
<template>
  <div style="height: 100%;">
      <div class="clearfix" style="height: 100%;">
          <div class="left-data fl">
              <Tree :data="crouseTree" show-checkbox check-directly multiple @on-check-change="crouseTreeCheck" :empty-text='treeEmptyText'></Tree>
          </div>
          <div class="right-data fl">
            <div style="margin:20px 0;">
              <Button class="xy-danger" @click="clearSetting" :disabled="StepsHeader.isOperation != 0">清除全部设置</Button>
            </div>
            <ul class="afternoon-ul">
              <li>
                  <i class="iconfont icon-after">&#xe6eb;</i>
                  <div style="margin-left:18px">
                    <div class="header-name">上午</div>
                    <div class="radio-group">
                        <RadioGroup v-model="amRadio" vertical @on-change="radioChange(1)">
                            <Radio label="0">
                                <span class="span-radio">不限</span>
                            </Radio>
                            <Radio label="1">
                                <div style="display:inline-block">
                                    <span class="span-radio">最多 </span>
                                    <Input v-model="amInput" @on-focus="amRadio = '1'" size="small" style="width:38px" />
                                    <span class="span-radio">课时</span>
                                </div>
                            </Radio>
                        </RadioGroup>
                    </div>
                  </div>
              </li>
                  <li>
                  <i class="iconfont icon-after">&#xe6eb;</i>
                  <div style="margin-left:18px">
                    <div class="header-name">下午</div>
                    <div class="radio-group">
                      <RadioGroup v-model="pmRadio" vertical @on-change="radioChange(2)">
                          <Radio label="0">
                              <span class="span-radio">不限</span>
                          </Radio>
                          <Radio label="1">
                              <div style="display:inline-block">
                                  <span class="span-radio">最多 </span>
                                  <Input v-model="pmInput" @on-focus="pmRadio = '1'" size="small" style="width:38px" />
                                  <span class="span-radio">课时</span>
                              </div>
                          </Radio>
                      </RadioGroup>
                    </div>
                  </div>
              </li>
            </ul>
          </div>
      </div>
      <div class="text-right fix-footer">
          <Button
            class="xy-btn-primary"
            shape="circle"
            style="margin-right:0"
            @click="submit"
            :disabled="StepsHeader.isOperation != 0">保存</Button>
      </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        StepsHeader: {},
        classPlan: {},
        // 课程树
        treeEmptyText: '正在加载中...',
        crouseTree: [],
        selectCrouseTree: [],
        // 上下午
        amRadio: '0',
        amInput: '',
        pmRadio: '0',
        pmInput: '',
        sectionData: []
      }
    },
    created () {
      this.StepsHeader = this.$parent.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      for (let i = 1; i < 13; i++) {
        this.sectionData.push({
          value: i,
          isSelect: false,
          name: i + '课时'
        })
      }
      this.getCrouseTree()
    },
    mounted () {

    },
    methods: {
      radioChange (val) {
        if (val === 1) {
          if (this.amRadio === '0') {
            this.amInput = ''
          }
        };
        if (val === 2) {
          if (this.pmRadio === '0') {
            this.pmInput = ''
          }
        };
      },
      // 清除全部设置
      clearSetting () {
        if (this.StepsHeader.isOperation === 0) {
          this.xy.confirm('温馨提示', '您确定要全部清除上下午课时设置吗？', this.clearSettingOk)
        }
      },
      clearSettingOk () {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/ClearClassHour`, {
          id: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('清除设置成功。')
            this.amRadio = '0'
            this.amInput = ''
            this.pmRadio = '0'
            this.pmInput = ''
            this.getCrouseTree()
          }
        })
      },
      // 左侧操作
      crouseTreeCheck (val) { // 课程树点击
        this.selectCrouseTree = []
        for (let i = 0; i < val.length; i++) {
          if (val[i].id > 0) {
            this.selectCrouseTree.push({
              id: val[i].id,
              lesson: val[i].lesson
            })
          }
        }
      },
      getCrouseTree () { // 课程树
        this.treeEmptyText = '正在加载中...'
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GeClassHour`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.crouseTree = []
            let dataList = res.data
            for (let i = 0; i < dataList.length; i++) {
              let isDisable = false
              if (dataList[i].Childrens.length === 0) {
                isDisable = true
              }
              this.crouseTree.push({
                id: dataList[i].Value,
                title: dataList[i].Name,
                checked: false,
                expand: true,
                disableCheckbox: isDisable,
                children: []
              })
              for (let j = 0; j < dataList[i].Childrens.length; j++) {
                this.crouseTree[i].children.push({
                  id: dataList[i].Childrens[j].CoursePlanID,
                  title: dataList[i].Childrens[j].CollectionName + '(' + dataList[i].Childrens[j].Lesson + '课时)',
                  collectionID: dataList[i].Childrens[j].CollectionID,
                  isRule: dataList[i].Childrens[j].IsRule,
                  checked: false,
                  lesson: dataList[i].Childrens[j].Lesson,
                  children: [],
                  render: (h, func) => {
                    return h('span', {
                      style: {
                        display: 'inline-block'
                      }
                    }, [
                      h('span', [
                        h('span', {
                          style: {
                            fontSize: '14px',
                            color: '#515a6e'
                          }
                        }, func.data.title)
                      ]),
                      h('span', {
                        style: {
                          display: func.data.isRule ? 'inline-block' : 'none',
                          marginLeft: '6px'
                        }
                      }, [
                        h('Icon', {
                          props: {
                            type: 'md-create',
                            size: '16'
                          },
                          style: {
                            cursor: 'pointer'
                          },
                          on: {
                            click: () => {
                              if (func.data.isRule) {
                                for (let i = 0; i < this.crouseTree.length; i++) {
                                  this.crouseTree[i].checked = false
                                  for (let j = 0; j < this.crouseTree[i].children.length; j++) {
                                    this.crouseTree[i].children[j].checked = false
                                  }
                                }
                                // func.data.checked = true
                                this.selectCrouseTree = []
                                this.selectCrouseTree.push({
                                  id: func.data.id,
                                  lesson: func.data.lesson
                                })
                                this.getRuleTime(func.data)
                              }
                            }
                          }
                        })
                      ])
                    ])
                  }
                })
              };
            };
            if (this.crouseTree.length === 0) {
              this.treeEmptyText = '课程树没有信息。'
            }
          }
        })
      },
      getRuleTime (func, type) { // 点击笔
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GeClassHourInfo`, {
          classTableID: this.classPlan.classTableID,
          coursePlanID: func.id
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            let resData = res.data
            if (resData.AMClassHour > 0) {
              this.amRadio = '1'
              this.amInput = resData.AMClassHour
            } else {
              this.amInput = ''
              this.amRadio = '0'
            };
            if (resData.PMClassHour > 0) {
              this.pmRadio = '1'
              this.pmInput = resData.PMClassHour
            } else {
              this.pmInput = ''
              this.pmRadio = '0'
            };
          }
        })
      },

      // 保存
      submit () {
        if (this.StepsHeader.isOperation === 0) {
          let postData = []
          if (this.selectCrouseTree.length === 0) {
            this.xy.msgError('请选择课程再保存。')
            return false
          };
          let regstr = /^1[0-8]$|^[1-9]$/
          for (let i = 0; i < this.selectCrouseTree.length; i++) {
            let total = 0
            if (this.amRadio !== '0') {
              if (!regstr.test((this.amInput))) {
                this.xy.msgError('请输入1-18正整数。')
                return false
              };
              total = total + Number(this.amInput)
            } else {
              this.amInput = 0
            };
            if (this.pmRadio !== '0') {
              if (!regstr.test((this.pmInput))) {
                this.xy.msgError('请输入1-18正整数。')
                return false
              };
              total = total + Number(this.pmInput)
            } else {
              this.pmInput = 0
            };;
            if (this.pmRadio !== '0' && this.amRadio !== '0' && total < this.selectCrouseTree[i].lesson) {
              this.xy.msgError('上下午课时不能小于总课时。')
              return false
            }
            postData.push({
              ClassTableID: this.classPlan.classTableID,
              AID: this.selectCrouseTree[i].id,
              Type: '',
              AMClassHour: this.amInput,
              PMClassHour: this.pmInput
            })
          };
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/EditClassHour`, postData).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('保存成功。')
              this.selectCrouseTree = []
              this.amRadio = '0'
              this.amInput = ''
              this.pmRadio = '0'
              this.pmInput = ''
              this.getCrouseTree()
            }
          })
        }
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../../css/arrangingRules.less';
.afternoon-ul{
  display: flex;
  li{
    width:330px;
    height:164px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(233,233,233,1);
    margin-right: 39px;
    padding: 23px;
    display: flex;
    .icon-after{
      width: 49px;
      height: 48px;
      line-height: 48px;
      background: #ffbf00;
      border-radius: 50%;
      display: block;
      text-align: center;
      color: #fff;
      font-size: 26px;
    }
    .header-name{
      color:rgba(0,0,0,0.85);
      font-size:16px;
      font-weight:bold;
    }
    .radio-group{
      margin-top: 30px;
    }
    .span-radio{
      color:rgba(0,0,0,0.6);
      margin: 0 4px;
    }
  }
}
</style>
