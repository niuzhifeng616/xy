<template>
  <div class="group-conversion">
    <div class="xy-content-body" style="border-top:1px solid rgba(0,0,0,0.1);padding-top:0;" @click.stop="isShowtree=false">
      <div class="content">
        <div class="content-left">
          <h5>选择学科</h5>
          <div class="more-check">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll">全选</Checkbox>
            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                <Checkbox :label='item.DisciplineID'  v-for="(item,index) in leftData" :key="index">{{item.DisciplineName}}</Checkbox>
            </CheckboxGroup>
          </div>
        </div>
        <div class="content-right">
          <div class="top">
            <div>
              <!-- <h5>指标指定</h5> -->
              <div class="top-gounp">
                <div style="color: rgba(0,0,0,0.85);font-weight: bold;margin-bottom: 5px;">指标指定</div>
                <i-form  ref="searchForm" :model="searchForm" :rules="searchFormRule">
                  <i-col span="4" style="padding-right:10px;margin-right:120px">
                    <div style="width: 200px" @click.stop="isShowtree=true" >
                      <Form-item prop="searchVal">
                        <Input v-model="searchForm.searchVal" placeholder="请选择" readonly clearable style="width: 200px" class="appoint" />
                      </Form-item>
                      <div class="appointDiv" v-show="isShowtree">
                        <Input suffix="ios-search" v-model.trim="name" size="small" style="width:200px" @on-change="getTree" />
                        <div class="tree">
                          <Tree :data="data1" @on-select-change="selectChange"></Tree>
                        </div>
                      </div>
                    </div>
                  </i-col>
                  <Form-item  prop="ConversionRatio">
                      <label style="color: rgba(0,0,0,0.65);">指标折算比例：</label>
                      <InputNumber :min="1" :max="100" disabled v-model="searchForm.ConversionRatio" placeholder="百分比"  style="width:300px"></InputNumber>
                  </Form-item>
                </i-form>
              </div>
              <div class="set">
                <h5>分层及折算分值</h5>
                <template>
                  <Form ref="formDynamic" :model="formDynamic" :label-width="10">
                      <div v-for="(item,index) in formDynamic.Setting" :key="index" style="height:60px;">
                          <InputNumber  :max="100" disabled  v-model="item.MinValue" placeholder="百分比"></InputNumber> %
                            <Select v-model="item.MinValueAttribute" disabled style="width:100px" class="m-r-10">
                                <Option v-for="item in isHave" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          <span class="line"></span>
                          <Form-item :prop="'Setting.' + index + '.MaxValue'" :rules="{required: true, message: '请填写百分比'}">
                            <InputNumber :max="100" :min="1" :disabled="item.Disabled && formDynamic.Setting.length===1 || index===formDynamic.Setting.length-1"  @on-change="changeNum(index,item.MaxValue)" v-model="item.MaxValue" placeholder="百分比"></InputNumber> %
                          </Form-item>
                          <Select v-model="item.MaxValueAttribute" :disabled="item.Disabled || formDynamic.Setting.length===1" @on-change="changeValue(index,item.MaxValueAttribute)" style="width:100px" class="m-r-10">
                              <Option v-for="item in isHave" :value="item.value" :key="item.value">{{ item.label }}</Option>
                          </Select>
                          <Form-item :prop="'Setting.' + index + '.ConversionValue'" :rules="ConversionValueRule">
                            <InputNumber  :min="1"  v-model="item.ConversionValue"></InputNumber> 分
                          </Form-item>
                          <Icon type="md-add" @click="add(index)" class="m-l-20" style="border-radius: 2px;color:#aeaeaf;border:1px solid  rgb(214, 214, 214);font-size: 18px;" />
                          <Icon type="md-remove" v-if="index!==0" @click="reduce(index)" class="m-l-10" style="color:#aeaeaf;border-radius: 2px;border:1px solid  rgb(214, 214, 214);font-size: 18px;"/>
                      </div>
                    </Form>
                  </template>
              </div>
            </div>
          </div>
          <div class="fix-btn">
            <Button class="xy-btn-primary" shape="circle" :disabled="StepsHeader.rowObj.IsEnable==='1'" @click="save">保存</Button>
          </div>
        </div>
      </div>
    </div>
     <Modal
        v-model="dialog"
        title="温馨提示"
        @on-ok="ok"
        @on-cancel="cancel">
        <p v-if="single">您确定要重新设置吗？<br/>保存后，该学科内设置过的分层和指标认定规则都不保留。</p>
        <p v-else>您确定要批量设置吗？<br/>保存后，单个学科内分层和指标认定规则都不保留。</p>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'GroupConversion',
    data () {
      return {
        single: false,
        dialog: false,
        data1: [],
        ConversionValueRule: [
          { required: true, message: '请填写分值' },
          { pattern: /^\d+$/, trigger: 'change', message: '请填正整数' }
        ],
        index: 1,
        formDynamic: {
          Setting: []
        },
        indeterminate: true,
        checkAll: false,
        checkAllGroup: [],
        isHave: [
          {
            value: '1',
            label: '包含'
          }, {

            value: '0',
            label: '不包含'

          }
        ],
        leftData: [],
        isShowtree: false,
        name: '',
        searchForm: {
          searchVal: '',
          ConversionRatio: 100
        },
        searchFormRule: {
          searchVal: [
            { required: true, type: 'string', message: '请选择指标', trigger: 'change' }
          ],
          ConversionRatio: [
            { required: true, type: 'number', message: '请设置百分比', trigger: 'change' }
          ]
        },
        IndexManagementID: '', // 树id
        checkId: '',
        flag: false,
        StepsHeader: {}// 方案信息
      }
    },
    created () {
      this.StepsHeader = this.$parent
      // 点击左侧列表获取右侧数据
      this.getProgrammeDiscipline()
    },
    methods: {
      // 选择树节点
      selectChange (val) {
        if (val[0].Level === 1) {
          if (val[0].children) {
            val[0].selected = false
          } else {
            this.searchForm.searchVal = val[0].title
            this.IndexManagementID = val[0].IndexManagementID
          }
        }
        if (val[0].Level === 2) {
          if (val[0].children) {
            val[0].selected = false
          } else {
            this.searchForm.searchVal = val[0].title
            this.IndexManagementID = val[0].IndexManagementID
          }
        }
        if (val[0].Level === 3) {
          this.searchForm.searchVal = val[0].title
          this.IndexManagementID = val[0].IndexManagementID
        }
      },
      // 获取树节点数据
      getTree (id) {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/ProgrammeSetting/GetProgrammeRuleDetailIndex`, {
          programmeID: this.$parent.rowObj.ProgrammeID,
          disciplineIDs: this.checkAllGroup,
          name: this.name
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.data1 = []
            if (id) {
              this.findId(res.data, id)
            }
            for (let i = 0, len = res.data.length; i < len; i++) {
              this.data1.push({
                title: res.data[i].IndexManagementName,
                IndexManagementID: res.data[i].IndexManagementID,
                checked: res.data[i].Checked,
                Level: res.data[i].Level,
                expand: true,
                children: this.treeRecursive(res.data[i].Childrens, id)
              })
            }
          }
        })
      },
      // 递归
      findId (data, id) {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].IndexManagementID === id) {
              this.searchForm.searchVal = data[i].IndexManagementName
              this.IndexManagementID = data[i].IndexManagementID
            } else {
              this.findId(data[i].Childrens, id)
            }
          }
        }
      },
      treeRecursive (arr, id) {
        if (arr.length > 0) {
          let result = []
          for (let i = 0; i < arr.length; i++) {
            result.push({
              title: arr[i].IndexManagementName,
              IndexManagementID: arr[i].IndexManagementID,
              checked: arr[i].Checked,
              Level: arr[i].Level,
              expand: true,
              children: this.treeRecursive(arr[i].Childrens, id)
            })
          }
          return result
        }
      },
      // 获取学科
      getProgrammeDiscipline () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ProgrammeSetting/GetProgrammeDiscipline`, {
          programmeID: this.$parent.rowObj.ProgrammeID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.leftData = res.data
            if (this.checkAllGroup.length === 0) {
              this.checkAllGroup.push(this.leftData[0].DisciplineID)
              this.getProgrammeIndex(this.checkAllGroup[0])
            }
          }
        })
      },
      // 获取小组折算数据
      getProgrammeIndex (id) {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ProgrammeSetting/GetProgrammeRuleDetail`, {
          programmeID: this.$parent.rowObj.ProgrammeID, // 暂时获取不到
          disciplineID: id// 多选显示第一个
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.formDynamic = res.data
            this.formDynamic.Setting.forEach(item => {
              item.MinValueAttribute = item.MinValueAttribute.toString()
              item.MaxValueAttribute = item.MaxValueAttribute.toString()
            })
            this.searchForm.ConversionRatio = this.formDynamic.ConversionRatio
            this.IndexManagementID = this.formDynamic.IndexManagementID
            this.getTree(this.IndexManagementID)// 获取树结构
          }
        })
      },
      changeNum (index, value) {
        if (this.formDynamic.Setting[index + 1]) {
          this.formDynamic.Setting[index + 1].MinValue = value
        }
      },
      changeValue (index, value) {
        if (value === '0') {
          this.formDynamic.Setting[index + 1].MinValueAttribute = '1'
        } else {
          this.formDynamic.Setting[index + 1].MinValueAttribute = '0'
        }
      },
      set () {
        this.formDynamic.Setting.forEach((item, index) => {
          this.$set(this.formDynamic.Setting[index], 'MaxValue', null)
          this.$set(this.formDynamic.Setting[index], 'MinValue', null)
          this.$set(this.formDynamic.Setting[index], 'value', null)
          if (index === 0) {
            item.Disabled = false
            this.$set(this.formDynamic.Setting[index], 'MinValue', 0)
          } else if (index === this.formDynamic.Setting.length - 1) {
            item.Disabled = true
            this.$set(this.formDynamic.Setting[index], 'MaxValue', 100)
          } else {
            item.Disabled = false
          }
          if (this.formDynamic.Setting.length === 1) {
            this.$set(this.formDynamic.Setting[index], 'MaxValue', 100)
          }
        })
      },
      add (index) {
        if (this.formDynamic.Setting.length < 5) {
          let addObj = {}
          if (this.formDynamic.Setting.length === (index + 1)) { // 最后一个
            this.formDynamic.Setting[index].MaxValue = null
            this.formDynamic.Setting[index].Disabled = false
            addObj = {
              MinValue: null,
              MinValueAttribute: this.formDynamic.Setting[index].MaxValueAttribute === '0' ? '1' : '0',
              MaxValueAttribute: '1',
              MaxValue: 100,
              value: null,
              Disabled: true,
              ConversionValue: null
            }
          } else { // 中间
            this.formDynamic.Setting[index + 1].MinValue = null
            addObj = {
              MinValue: this.formDynamic.Setting[index].MaxValue,
              MinValueAttribute: this.formDynamic.Setting[index].MaxValueAttribute === '0' ? '1' : '0',
              MaxValueAttribute: this.formDynamic.Setting[index + 1].MinValueAttribute === '0' ? '1' : '0',
              MaxValue: null,
              value: null,
              Disabled: false,
              ConversionValue: null
            }
          }
          this.formDynamic.Setting.splice(index + 1, 0, addObj)
          // this.set()
        } else {
          this.$Message.error('已到达上限。')
        }
      },
      reduce (index) {
        if (this.formDynamic.Setting.length === (index + 1)) { // 删除最后一个
          this.formDynamic.Setting[index - 1].Disabled = false
          this.formDynamic.Setting[index - 1].MaxValue = 100
        } else { // 删除中间
          this.formDynamic.Setting[index - 1].Disabled = false
          this.formDynamic.Setting[index + 1].MinValue = this.formDynamic.Setting[index - 1].MaxValue
        }
        this.formDynamic.Setting.splice(index, 1)
        // this.set(index)
      },
      handleCheckAll () {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false

        if (this.checkAll) {
          this.flag = false
          this.leftData.forEach(item => {
            this.checkAllGroup.push(item.DisciplineID)
          })
          this.leftData.map(item => {
            if (item.SetLevel) {
              this.flag = true
            }
          })
          this.checkId = this.leftData[this.leftData.length - 1].DisciplineID
          if (this.leftData[this.leftData.length - 1].SetLevel) { // 最后一个设置过要获取
            this.flag = false
          }
        } else {
          this.checkAllGroup = []
          this.checkId = ''
        }
        if (this.checkId && !this.flag) { // 有选中并且都没有设置过
          this.getProgrammeIndex(this.checkId)
        }
      },
      checkAllGroupChange (data) {
        this.name = ''
        this.searchForm.searchVal = ''
        this.searchForm.ConversionRatio = 100

        this.checkId = ''
        if (data.length === this.leftData.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        }
        this.checkId = data[data.length - 1]
        this.flag = false
        if (data.length > 0) {
          // 选中的是否设置过
          this.leftData.map(item => {
            data.forEach((item1) => {
              if (item.DisciplineID === item1 && item.SetLevel) {
                this.flag = true
              }
            })
          })
          this.leftData.map(item => {
            if (this.checkId === item.DisciplineID && item.SetLevel) {
              this.flag = false
            }
          })
        }
        if (this.checkId && !this.flag) {
          this.getProgrammeIndex(this.checkId)
        }
      },
      save () {
        if (this.StepsHeader.rowObj.IsEnable === '1') {
          return false
        }
        this.$refs['formDynamic'].validate((valid) => {
          if (valid) {
            this.$refs['searchForm'].validate((valid) => {
              if (valid) {
                this.flag = false
                this.leftData.map(item => {
                  this.checkAllGroup.forEach(item1 => {
                    if (item.DisciplineID === item1 && item.SetLevel) {
                      this.flag = true
                      if (item.SetLevel && this.checkAllGroup.length === 1) {
                        this.single = true
                      } else {
                        this.single = true
                      }
                    }
                  })
                })
                if (this.flag) {
                  this.dialog = true
                } else {
                  this.ok()
                }
              }
            })
          }
        })
      },
      ok () {
        this.xy.loading()
        this.xy.post(`${this.$store.state.apiPath}/api/ProgrammeSetting/UpdateProgrammeRuleDetail`, {
          ProgrammeID: this.$parent.rowObj.ProgrammeID,
          Models: this.formDynamic.Setting,
          DisciplineIDs: this.checkAllGroup, // 学科
          IndexManagementID: this.IndexManagementID, /// 树节点
          // ConversionRatio: this.searchForm.ConversionRatio,
          ConversionRatio: 100,
          Level: this.formDynamic.Setting.length
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.getProgrammeDiscipline()
          }
        })
      },
      cancel () {
        this.dialog = false
      }
    }

  }
</script>
<style lang="less" scoped>
.group-conversion{
  /deep/ .ivu-checkbox-group-item{
    margin-bottom: 15px;
  }
  /deep/ .ivu-form-item{
   display: inline-block;
  }
  .top-gounp{
    /deep/ .ivu-form-item{
     margin-bottom: 10px;
    }
    margin-bottom: 15px;
  }
  .content{
    display: flex;
    // border-top:1px solid rgba(0,0,0,0.1);
    .content-left{
      width: 230px;
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
      .more-check{
        padding-left:30px;
        /deep/ .ivu-checkbox-wrapper{
          display: flex;
          height: 40px;
          line-height: 40px;
        }
        /deep/ .ivu-checkbox{
          height: 46px;
          line-height: 46px;
          margin-right: 10px;
        }
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
         .line{
            display: inline-block;
            width: 28px;
            height: 1px;
            background: #d0cece;
            margin: 0 10px;
         }
         .m-l-10{
           margin-left:10px;
         }
         .m-l-20{
           margin-left:20px;
         }
         .m-r-10{
           margin-left:10px;
         }
         .appoint{
           position: relative;
         }
         .appointDiv{
           left:110px;
           background: #fff;
           position: absolute;
           z-index:1;
            border:1px solid  #eee;
            padding:8px 8px 10px 8px;
            box-shadow: 1px 1px 10px #ece9e9;
            border-radius: 10px;
           div.tree{
             border-top:1px solid #eee ;
             margin-top:10px;
             height: 200px;
             overflow: auto;
           }
         }
       }
       .set{
           /deep/ .ivu-form-item{
            display: inline-block;
        }
       }
       h5{
        color:rgba(0,0,0,0.85);
        font-weight: 700;
        margin-bottom: 10px;
      }
      .fix-btn {
        // z-index:1;
        // padding-right: 43px;
        // height: 56px;
        // position: fixed;
        // line-height: 56px;
        // background: rgba(255, 255, 255, 1);
        // box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
        // bottom: 0;
        // left: 0;
        // width: 100%;
        // text-align: right;
        button {
          margin-left: 40px;
        }
      }
    }
 }
}

</style>
