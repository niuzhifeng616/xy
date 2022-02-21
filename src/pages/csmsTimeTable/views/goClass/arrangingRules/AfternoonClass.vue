<!-- 5.排课规则-上下午课时-->
<template>
  <div class="AfternoonClass-rule clearfix" style=" height: 100%;">
    <div class="left-data fl">
      <Tree :data="crouseTree" :empty-text='treeEmptyText' show-checkbox check-directly multiple @on-check-change="crouseTreeCheck"></Tree>
    </div>
    <div class="right-data fl" style="padding-left: 20px;">
      <div style="margin:20px 0;">
        <Button class="xy-danger" @click="clearSetting" :disabled="isOperation != 0">清除全部设置</Button>
      </div>
      <ul class="afternoon-ul">
        <li>
          <i class="iconfont icon-after">&#xe6eb;</i>
          <div style="margin-left:18px">
            <div class="header-name">上午</div>
            <div class="radio-group">
              <RadioGroup v-model="amRadio" vertical @on-change="radioChange(1)">
                <Radio :label="0">
                  <span class="span-radio">不限</span>
                </Radio>
                <Radio :label="1">
                  <div style="display:inline-block">
                    <span class="span-radio">最多 </span>
                    <Input v-model="amInput" @on-focus="amRadio = 1" size="small" style="width:38px" />
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
                <Radio :label="0">
                  <span class="span-radio">不限</span>
                </Radio>
                <Radio :label="1">
                  <div style="display:inline-block">
                    <span class="span-radio">最多 </span>
                    <Input v-model="pmInput" @on-focus="pmRadio = 1" size="small" style="width:38px" />
                    <span class="span-radio">课时</span>
                  </div>
                </Radio>
              </RadioGroup>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="fix-footer text-right">
      <Button class="xy-btn-primary" shape="circle" style="margin-right:0" @click="submit" :disabled="isOperation !== 0">保存</Button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AfternoonClass',
    data () {
      return {
        // 课程树
        treeEmptyText: '正在加载中...',
        crouseTree: [],
        selectCrouseTree: [],
        // 上下午
        amRadio: 0,
        amInput: '',
        pmRadio: 0,
        pmInput: '',
        sectionData: this.sectionList(),
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID
      }
    },

    created () {
    },
    mounted () {
      this.getCrouseTree()
    },
    methods: {
      sectionList () {
        var section = []
        for (var i = 1; i < 13; i++) {
          section.push({
            value: i,
            isSelect: false,
            name: i + '课时'
          })
        }
        return section
      },
      radioChange (val) {
        if (val === 1) {
          if (this.amRadio === 0) {
            this.amInput = ''
          }
        };
        if (val === 2) {
          if (this.pmRadio === 0) {
            this.pmInput = ''
          }
        };
      },
      // 清除全部设置
      clearSetting () {
        if (this.isOperation === 0) {
          let that = this
          that.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要全部清除上下午课时设置吗？',
            async onOk () {
              that.xy.loading()
              let params = {
                id: that.classTableID
              }
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/MovingClassRuleSetting/ClearClassHour`, params)
              that.xy.unloading()
              if (res.success) {
                that.xy.msgSuc('删除成功。')
                that.amRadio = 0
                that.amInput = ''
                that.pmRadio = 0
                that.pmInput = ''
                that.getCrouseTree()
              }
            }
          })
        }
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
      async getCrouseTree () { // 课程树
        this.treeEmptyText = '正在加载中...'
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/GeClassHour`, params)
        if (res.success) {
          this.crouseTree = []
          let dataList = res.data
          for (let i = 0; i < dataList.length; i++) {
            let isDisable = false
            if (dataList[i].children.length === 0) {
              isDisable = true
            }
            this.crouseTree.push({
              id: dataList[i].CoursePlanID,
              title: dataList[i].SubjectName,
              checked: false,
              expand: true,
              disableCheckbox: isDisable,
              disabled: isDisable,
              children: []
            })
            for (let j = 0; j < dataList[i].children.length; j++) {
              this.crouseTree[i].children.push({
                id: dataList[i].children[j].CoursePlanID,
                title: dataList[i].children[j].SubjectName + '(' + dataList[i].children[j].Lesson + '课时)',
                isRule: dataList[i].children[j].IsRult,
                checked: false,
                lesson: dataList[i].children[j].Lesson,
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
          }
          if (this.crouseTree.length === 0) {
            this.treeEmptyText = '课程树没有信息。'
          }
        }
      },
      async getRuleTime (func, type) { // 点击笔
        this.xy.loading()
        let params = {
          classTableID: this.classTableID,
          coursePlanLevelID: func.id
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/GeClassHourInfo`, params)
        this.xy.unloading()
        if (res.success) {
          let resData = res.data
          if (resData.AMClassHour > 0) {
            this.amRadio = 1
            this.amInput = resData.AMClassHour
          } else {
            this.amRadio = 0
            this.amInput = ''
          };
          if (resData.PMClassHour > 0) {
            this.pmRadio = 1
            this.pmInput = resData.PMClassHour
          } else {
            this.pmRadio = 0
            this.pmInput = ''
          }
        }
      },

      // 保存
      async submit () {
        if (this.isOperation === 0) {
          let postData = []
          if (this.selectCrouseTree.length === 0) {
            this.xy.msgError('请选择课程再保存。')
            return false
          };
          let regstr = /^(?:1[0-2]|[1-9])$/
          for (let i = 0; i < this.selectCrouseTree.length; i++) {
            let total = 0
            if (this.amRadio !== 0) {
              if (!regstr.test(Number(this.amInput))) {
                this.xy.msgError('请输入1-12正整数。')
                return false
              };
              total = total + Number(this.amInput)
            } else {
              this.amInput = ''
            };
            if (this.pmRadio !== 0) {
              if (!regstr.test(Number(this.pmInput))) {
                this.xy.msgError('请输入1-12正整数。')
                return false
              };
              total = total + Number(this.pmInput)
            } else {
              this.pmInput = ''
            };;
            if (this.pmRadio !== 0 && this.amRadio !== 0 && total < this.selectCrouseTree[i].lesson) {
              this.xy.msgError('上下午课时不能小于总课时。')
              return false
            }
            postData.push({
              ClassTableID: this.classTableID,
              AID: this.selectCrouseTree[i].id,
              Type: '',
              AMClassHour: this.amInput === '' ? 0 : Number(this.amInput),
              PMClassHour: this.pmInput === '' ? 0 : Number(this.pmInput)
            })
          };
          this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/MovingClassRuleSetting/EditClassHour`, postData)
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.amRadio = 0
            this.amInput = ''
            this.pmRadio = 0
            this.pmInput = ''
            this.selectCrouseTree = []
            this.getCrouseTree()
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/arrangingRules.less';
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
