<template>
 <div class="rule-content">
  <div class='xy-content-body'>
    <div class="content">
      <div class="content-left">
          <p v-for="(item,index) in list" :key="index" @click="selectModule(index)" :class="index=== activeIndex?'active-class':''" >{{item.StarTypeName}}</p>
      </div>
      <div class="content-right">
        <!--模块来源-->
        <div class="righ-item set">
          <span class="title"  style="margin-bottom:16px">模块来源</span>
          <p class="label" v-if="formDynamic.ModuleList.length>0">权重合计100%</p>
           <template>
            <Form ref="Modules" :model="formDynamic" :label-width="10" style="margin-top:20px">
              <div v-for="(item,index) in formDynamic.ModuleList" :key="index" style="height:34px;">
               <FormItem :prop="'ModuleList.' + index + '.StarModuleTypeID'" :rules="moduleRule.moduleSelectRule">
                <Select v-model="item.StarModuleTypeID" style="width:240px" @on-change="changeModule(index)" >
                  <Option v-for="item2 in moduleSourceList" :value="item2.StarModuleTypeID" :key="item2.StarModuleTypeID">{{ item2.StarModuleTypeName }}</Option>
                </Select>
               </FormItem>
                <Form-item :prop="'ModuleList.' + index + '.StarWeight'" :rules="moduleRule.moduleWeightRule">
                  <InputNumber :max="100" :min="1"  v-model="item.StarWeight" placeholder="设置权重" style="width:110px"></InputNumber>
                </Form-item>
                 <Icon type="md-remove" class="m-l-10"  @click="reduce(index)"  style="color:#aeaeaf;border-radius: 2px;border:1px solid  rgb(214, 214, 214);font-size: 18px;margin-top:5px"/>
              </div>
            </Form>
          </template>
          <div class="addModule" @click="addModule">
           <Icon type="ios-add" color="#1677ff" size="20"/> 新增模块
          </div>
        </div>
        <!--是否关联科目-->
        <div class='righ-item' style="display:inline-block">
          <h4 class="title">是否关联科目</h4>
          <div class="radio-content">
            <RadioGroup v-model="formDynamic.IsRelationDiscipline"  @on-change="changeRelated">
              <radio label="1">是</radio>
              <radio label="2" style="margin-left:46px">否</radio>
            </RadioGroup>
          </div>
          <div class="classList" v-if="formDynamic.IsRelationDiscipline === '1'">
            <div class="addClass" @click="addClass"><Icon type="ios-add" />添加</div>
            <div class="class-item" v-for="(item,index) in formDynamic.Disciplines" :key="index">
               <span>{{item.DisciplineName}}</span>
               <Icon type="ios-close" style="margin-left:3px" size="18" @click="delClass(item)"/>
            </div>
          </div>
        </div>
        <!--计算规则-->
        <div class="righ-item">
          <h4 class="title">计算规则</h4>
          <div class="radio-content">
            <RadioGroup v-model="formDynamic.StarRuleMethod"  @on-change="changeCompute">
              <radio label="0">累计求和</radio>
              <radio label="1" style="margin-left:46px">均分</radio>
            </RadioGroup>
          </div>
        </div>
        <!--分层及折算分值-->
        <div class="righ-item set">
          <h4 class="title" style="margin-bottom:16px">分层及折算分值</h4>
          <template>
            <Form ref="LayeredList" :model="formDynamic" :label-width="10">
              <div v-for="(item,index) in formDynamic.LayeredList" :key="index" style="height:60px;">
                <span style="line-height:40px">等级{{index+1}}</span>
                <Form-item>
                  <Input  :max="10"   v-model="item.StarLayeredName" placeholder="请输入等级别名（选填）" style="width:208px"/>
                </Form-item>
                <Form-item :prop="'LayeredList.' + index + '.StartScore'"  :rules="ConversionValueRule">
                  <InputNumber :min="1"   @on-change="changeMin(index,item.StartScore)" v-model="item.StartScore" placeholder="最小区间" style="width:110px"></InputNumber>
                </Form-item>
                <span class="line"></span>
                <Form-item :prop="'LayeredList.' + index + '.EndScore'" :rules="ConversionValueRule2">
                  <InputNumber  :min="1"   v-model="item.EndScore" placeholder="最大区间" style="width:110px"></InputNumber>
                </Form-item>
              </div>
            </Form>
          </template>
        </div>
      </div>
      <a-modal
        v-model="showClassModal"
        title="选择科目"
        width='50%'>
        <a-row class="xy-flex">
          <!--<div class="modal-content">-->
            <div class="left">
              <CheckboxGroup v-model="checkModal"  @on-change="SelectQuestionType">
                <Checkbox  v-for="(item,index) in disciplineList" :label="item.DisciplineID" :key="index" ref="checkboxGroup" style="display:block">
                  <span>{{item.DisciplineName}}</span>
                </Checkbox>
              </CheckboxGroup>
            </div>
            <div class="right">
              <div class="count-room" v-show='SelectClass.length'>已选:{{SelectClass.length}}科</div>
              <div class="nodata right-tip" v-show='!SelectClass.length'>您还未选择任何科目，请选择科目。</div>
              <div class="room-overflow">
                <div v-for='item in SelectClass' :key='item.DisciplineID' class="room">
                  <div>
                    <span class="avatar">{{xy.showName(item.DisciplineName)}}</span>
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>{{ item.DisciplineName}}</span>
                      </template>
                     <span class="tag"> {{item.DisciplineName.length>20?item.DisciplineName.substr(0,20)+'...':item.DisciplineName}}</span>
                    </a-tooltip>
                  </div>
                  <i class="iconfont del-btn" @click="delFun(item)">&#xe6f3;</i>
                </div>
              </div>
            </div>

          <!--</div>-->
        </a-row>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancelDiscipline">取消</Button>
          <Button class="xy-modal-primary" @click="saveDiscipline" shape="circle">确定</Button>
      </div>
      </a-modal>
    </div>
  </div>
  <div class="text-right fix-footer">
    <Button
      class="xy-btn-primary"
      shape="circle"
      style="margin-right:0"
      :disabled="StepsHeader.rowObj.IsEnable"
      @click="submit">
        <span v-if="!loading">保存</span>
        <span v-else>保存中...</span>
      </Button>
  </div>
 </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        loading: false,
        classPlan: {},
        activeIndex: 0,
        disciplineList: [], // 学科列表
        ConversionValueRule: [
          { required: true, message: '请填写区间' },
          { pattern: /^\d+$/, trigger: 'change', message: '请填正整数' }
        ],
        ConversionValueRule2: [
          { required: true, message: '请填写区间' },
          { pattern: /^\d+$/, trigger: 'change', message: '请填正整数' },
          { type: 'number', min: 1, message: '最大分值不能为0', trigger: 'blur' }
        ],
        moduleRule: {
          moduleSelectRule: [
            { type: 'number', required: true, min: 1, message: '请选择模块来源', trigger: 'change' }
          ],
          moduleWeightRule: [
            { required: true, message: '请填写区间' },
            { type: 'number', min: 1, message: '最大分值不能为0', trigger: 'blur' },
            {
              validator (rule, value, callback) {
                value = Number(value)
                if (value <= 100 && value > 0) {
                  callback()
                } else {
                  callback(new Error('分值必须为0-100之间的整数！'))
                }
              },
              message: '请输入分值',
              trigger: 'blur'
            }
          ]
        },
        list: [],
        moduleSourceList: [], // 获取模块类别
        IsRelationDiscipline: '1',
        StarRuleMethod: '0',
        formDynamic: {
          ModuleList: [],
          LayeredList: [],
          Disciplines: []
        },
        showClassModal: false,
        checkModal: [],
        obj: {},
        StarTypeID: '',
        StepsHeader: {},
        SelectClass: []
      }
    },
    created () {
      this.StepsHeader = this.$parent
      // 获取类型列表
      this.GetStarProgrammeTypeList()
      // 获取科目列表

      this.classPlan = this.$store.state.evaluate.dipperObj
      this.StepsHeader.step = 1
    },
    mounted () {},
    methods: {
      async  GetStarProgrammeTypeList () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarProgrammeRule/GetStarProgrammeTypeList`)
        if (res.success) {
          this.list = res.data
          // 获取模块类别
          this.getModuleTypelist()
          this.StarTypeID = res.data[0].StarTypeID
          this.GetStarProgrammeRule()
        }
      },
      selectModule (index) {
        this.activeIndex = index
        this.StarTypeID = this.list[index].StarTypeID
        this.GetStarProgrammeRule()
        this.checkModal = []
      },
      // 获取模块类别
      async getModuleTypelist () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarProgrammeRule/GetStarProgrammeModuleTypeList`)
        if (res.success) {
          this.moduleSourceList = res.data
        }
      },
      // 获取方案对应类型规则
      async  GetStarProgrammeRule () {
        this.xy.loading()
        // /api/StarProgrammeRule/GetStarProgrammeRule
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarProgrammeRule/GetStarProgrammeRule?starProgrammeID=${this.classPlan.StarProgrammeID}&starTypeID=${this.StarTypeID}`)
        this.xy.unloading()
        if (res.success) {
          this.formDynamic = res.data
          if (res.data.LayeredList.length === 0) {
            this.getLayeredList()
          }
          if (this.formDynamic.IsRelationDiscipline === true) {
            this.formDynamic.IsRelationDiscipline = '1'
          } else {
            this.formDynamic.IsRelationDiscipline = '2'
          }

          if (this.formDynamic.StarRuleMethod === 0) {
            this.formDynamic.StarRuleMethod = '1'
          } else {
            this.formDynamic.StarRuleMethod = '2'
          }

          this.getDisciplineList()
        }
      },
      // 请求等级列表
      async getLayeredList () {
        await this.xy.get(`${this.$store.state.apiPath}/api/StarProgrammeRule/GetStarProgrammeColorList`).then(res => {
          this.xy.unloading()
          res.data.map((item, index) => {
            this.formDynamic.LayeredList.push({
              StarLayeredName: '',
              StartScore: 0,
              EndScore: 0
            })
          })
        })
      },
      // 添加模块
      addModule () {
        let index = this.formDynamic.ModuleList.length - 1
        let addObj = {
          StarModuleTypeID: 0,
          StarModuleTypeName: '',
          StarWeight: 0
        }
        if (this.formDynamic.ModuleList.length < 10) {
          this.formDynamic.ModuleList.splice(index + 1, 0, addObj)
        } else {
          this.$Message.error('已到达上限。')
        }
      },
      reduce (index) {
        this.formDynamic.ModuleList.splice(index, 1)
      },
      // 是否关联科目
      changeRelated (e) {
        this.formDynamic.IsRelationDiscipline = e
        console.log(this.formDynamic.IsRelationDiscipline)
      },
      // 选择计算方式
      changeCompute (e) {
        this.formDynamic.StarRuleMethod = e
      },
      // 添加科目
      addClass () {
        this.SelectClass = JSON.parse(JSON.stringify(this.formDynamic.Disciplines))
        this.getDisciplineList()
        this.showClassModal = true
      },

      async submit () {
        if (this.StepsHeader.rowObj.IsEnable) {
          return false
        }
        this.loading = true
        this.$refs['Modules'].validate((valid) => {
          if (valid) {
            let sum = this.formDynamic.ModuleList.reduce((total, item) => total + item.StarWeight, 0)
            if (sum < 100 && this.formDynamic.ModuleList.length > 0) {
              this.xy.msgError('权重合计必须为100%')
            } else {
              this.$refs['LayeredList'].validate((valid2) => {
                if (valid2) {
                  this.ok()
                } else {
                  this.loading = false
                }
              })
            }
          }
        })
      },
      async  ok () {
        this.xy.loading()
        let DisciplineIDs = []
        this.formDynamic.Disciplines.map(item => {
          DisciplineIDs.push(item.DisciplineID)
        })
        let IsRelationDiscipline = false
        if (this.formDynamic.IsRelationDiscipline === '1') {
          IsRelationDiscipline = true
        }
        if (IsRelationDiscipline && DisciplineIDs.length === 0) {
          this.xy.unloading()
          this.loading = false
          this.xy.msgError('请选择关联科目')
          return false
        }
        let params = {
          StarProgrammeID: this.classPlan.StarProgrammeID,
          StarProgrammeRuleID: this.formDynamic.StarProgrammeRuleID,
          StarTypeID: this.StarTypeID,
          ModuleList: this.formDynamic.ModuleList,
          IsRelationDiscipline: IsRelationDiscipline,
          StarRuleMethod: this.formDynamic.StarRuleMethod === '1' ? 0 : 1,
          DisciplineIDs: DisciplineIDs,
          LayeredList: this.formDynamic.LayeredList
        }
        // let res = await this.xy.post(`${this.$store.state.apiPath}/api/StarProgrammeRule/DeleteStarProgrammeType?starTypeID=${id}`)
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StarProgrammeRule/CreateStarProgrammeRule`, params)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('保存成功')
        }
        this.loading = false
      },
      // 对比选中的科目
      async getDisciplineList () {
        this.checkModal = []
        let res = await this.xy.get(
          this.xyApi + `/xy/comm/GetDisciplineList`
        )
        if (res.success) {
          this.disciplineList = res.data
          if (this.formDynamic.Disciplines.length > 0) {
            this.disciplineList.map(item => {
              this.formDynamic.Disciplines.map(i => {
                if (item.DisciplineID === i.DisciplineID) {
                  this.checkModal.push(
                    item.DisciplineID
                  )
                }
              })
            })
          }
        }
      },
      // 删除选中的科目
      delClass (item) {
        let id = item.DisciplineID
        let index = this.checkModal.findIndex(i => {
          return i.DisciplineID === id
        })
        let index2 = this.formDynamic.Disciplines.findIndex(rs => {
          return rs.DisciplineID === id
        })

        this.checkModal.splice(index, 1)
        this.formDynamic.Disciplines.splice(index2, 1)
      },
      // 选择科目的复选框
      SelectQuestionType () {
        this.SelectClass = []
        this.checkModal.map(i => {
          this.disciplineList.map(item => {
            if (i === item.DisciplineID) {
              this.SelectClass.push({
                DisciplineID: item.DisciplineID,
                DisciplineName: item.DisciplineName
              })
            }
          })
        })
      },
      cancelDiscipline () {
        this.SelectClass = []
        this.checkModal = []
        this.showClassModal = false
      },
      saveDiscipline () {
        this.formDynamic.Disciplines = JSON.parse(JSON.stringify(this.SelectClass))
        this.showClassModal = false
      },
      // 删除选中的科目
      delFun (item) {
        let id = item.DisciplineID
        let index = this.checkModal.findIndex(i => {
          return i.DisciplineID === id
        })
        let index2 = this.SelectClass.findIndex(rs => {
          return rs.DisciplineID === id
        })

        this.checkModal.splice(index, 1)
        this.SelectClass.splice(index2, 1)
      },
      changeModule (index) {
        let id = this.formDynamic.ModuleList[index].StarModuleTypeID
        let item = this.moduleSourceList.find(i => {
          return i.StarModuleTypeID === id
        })
        this.formDynamic.ModuleList[index].StarModuleTypeName = item.StarModuleTypeName
      },
      changeWeight (index, weight) {
        // console.log(index)
        // this.formDynamic.ModuleList[index].StarWeight = weight
      },
      changeMin () {},
      changeMax () {}
    }
  }
</script>
<style lang='less' scoped>
@import '../css/antModal.less';
.xy-content-body {
  padding: 0;
}
.rule-content{
  .m-r-10{
    margin-right: 10px;
  }
  .m-l-10{
    margin-left: 10px;
  }
  border-top: 1px solid #eeeeee;
  .content{
    display: flex;
    min-height: 780px;
    .content-left{
      width: 200px;
      overflow-y:auto;
      padding: 26px 0;
      border-right:1px solid rgba(0,0,0,0.1);
      margin: 0 auto;
      p{
        margin-bottom: 16px;
        margin-left: 20px;
        width: 160px;
        height: 40px;
        background: #fafafa;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        font-size: 14px;
        color: rgba(0,0,0,0.65);
        line-height: 40px;
        text-align: center;
      }
      .active-class
      {
        background: #1677ff;
        color: #fff;
      }
    }
    .content-right{
      overflow-y:auto;
      flex: 1;
      padding: 24px 25px;
      .righ-item{
        margin-bottom: 20px;
        .classList{
          height: 32px;
          background: #ffffff;
          border: 1px solid #dddddd;
          border-radius: 4px;
          margin-top: 24px;
          display:flex;
          align-items: center;
          // float: right;
          flex-wrap:wrap;

          .addClass{
            width: 56px;
            height: 22px;
            background: #ffffff;
            border: 1px dashed #1677ff;
            border-radius: 4px;
            color: #1677ff;
            font-size: 12px;
            text-align:center;
            line-height: 22px;
            margin-left: 8px;
          }
          .class-item{
            // width: 58px;
            height: 22px;
            padding: 0 5px 0 10px;
            background: #f2f2f2;
            border-radius: 4px;
            font-size: 12px;
            color:  rgba(0,0,0,0.65);
            margin: 0 7px;
            text-align:center;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
        }
      }
      .addModule{
        color: rgba(22,119,255,1);
        font-size: 14px;
        font-weight: 400;
        margin-top: 16px;
      }
      .title{
        font-size: 14px;
        font-weight: bold;
        color:rgba(0,0,0,0.85);
      }

      .radio-content{
        margin-top: 16px;
      }
      .line{
        display: inline-block;
        width: 28px;
        height: 1px;
        background: #d0cece;
        margin: 0 10px;
      }
      .set{
        .label{
          font-size: 14px;
          font-weight: 400;
          color: rgba(0,0,0,0.45);
          margin-top: 3px;
        }
        /deep/ .ivu-form-item{
          display: inline-block;
        }
      }
    }
  }
}
.modal-content{
  display:flex;
  .modal-left{
    width:49%;
    border-right: 1px solid #eee;
    height: 520px;
  overflow-y: auto;
  }
}
/deep/ .ivu-modal-body{
  height: 560px;
  overflow-y: auto;
}
.avatar{
  display: block;
  background: #4196ff;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  text-align: center;
  line-height: 35px;
  font-size: 14px;
  color: #fff;
}
.left,.right{
  height: 520px;
  overflow-y:auto ;
}
.fix-footer {
  box-shadow: 0px -1px 2px 0px rgba(0,0,0,0.1);
}
</style>
