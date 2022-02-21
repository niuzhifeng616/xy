<!-- 5.优化分班：精细优化 -->
<template>
  <div class="xy-content-body pr">
    <div @click="goBack" class="back pa">
      <i class="iconfont">&#xe6a5;</i>
      <span>返回</span>
    </div>
    <div class="optimize-range">
      <div class="name">优化范围：</div>
      <div class="con optimize-box">
        <div class="area-list" v-for="(item,index) in optimizeClassData" :key='index'>
          <div class="area-name col0-85"><span class="mr-15"><i class="iconfont">&#xe703;</i></span>{{item.AreaName}}</div>
          <checkbox-group v-model="selectClassIDS" @on-change="selectClass" class="check-group">
              <checkbox v-for="data in item.Data"
                        :label="data.DivideClassGenerateCollectionID"
                        :key="data.DivideClassGenerateCollectionID"
                        :disabled="data.noChoice"
                        class="check">{{data.DivideClassGenerateCollectionName}}（{{data.DingName}}）
              </checkbox>
          </checkbox-group>
        </div>
      </div>
    </div>
    <div class="divide-cell">
      <div class="cell-left">平均分均衡：</div>
      <div class="cell-right">
        <div class="add-btn"
            @click="addRules"
            :class="smartDivideStepsHeader.isOperation !== 0?'disabled':''">
          <i class="iconfont">&#xe6a2;</i>添加规则
        </div>
        <ul class="average-ul">
          <li v-for="(item, index) in AverageDifferenceData" :key="index">
            <span @click="editRule(item, index)" style="display: inline-block;">
              {{item.DistinctName.join('、')}}的平均分相差{{item.Difference}}分
            </span>
            <Icon type="ios-close"
              size="18"
              style="cursor:pointer"
              @click="delRule(item)" />
          </li>
        </ul>
      </div>
    </div>
    <div class="divide-cell last-cell">
      <div class="cell-left">其他规则：</div>
      <div class="cell-right">
        <div class="mb-15">
          <checkbox v-model="administrative">原行政班集中</checkbox>
        </div>
        <div class="mb-15">
          <checkbox v-model="menWomen">男女均衡</checkbox>
        </div>
        <div class="mb-15">
          <checkbox v-model="mutexStudent" @change.native.stop.capture="checkMutexStudent">互斥学生</checkbox>
          <div class="add-student">
            <div v-if="mutexStudent"
                class="add-btn fl"
                :class="smartDivideStepsHeader.isOperation !== 0?'disabled':''"
                @click="addMutex">
                <i class="iconfont">&#xe6a2;</i>添加
            </div>
            <div class="student-group clearfix">
              <div class="student fl" v-for="(student,index) in mutexStudentData" :key='index'>
                <span>{{student}}</span>
                <Icon type="ios-close"
                      size="18"
                      style="cursor:pointer"
                      v-if="mutexStudent"
                      @click="delStudent(student)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fine-optimiza-fotter">
      <Button class="xy-btn-primary"
              shape="circle"
              :disabled="smartDivideStepsHeader.isOperation !== 0"
              @click="submit">保存</Button>
    </div>
    <!-- 添加规则 -->
    <Modal v-model="addRulesModal"
          :transfer="false"
          :title="ruleTitle"
          :mask-closable="false"
          width="640">
      <div>
        <div class="rule-title">根据成绩</div>
        <div class="subject-list">
          <div v-for="(item, index) in subjectData"
              :key="item.DisciplineID"
              class="subject pr"
              :class="item.isChecked?'checked':''"
              @click="clickSubject(item, index)" >
            {{item.DisciplineName}}
            <span class="sanjiao"><i class="iconfont">&#xe6a1;</i></span>
          </div>
        </div>
        <div class="rule-title">平均分相差</div>
        <input-number :min="0" v-model="averageDiff" placeholder="请输入分数" style="width:280px;margin: 10px 0 30px;"></input-number>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="addRulesCancel">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="addRulesSubmit">确定</Button>
      </div>
    </Modal>
    <!-- 添加互斥学生 -->
    <SelectStudent :isShow="addStudentModal"
                    :selectClassIDS="selectClassIDS"
                    :selectMembers="mutexStudentDataID"
                    @select-cancel="selectCancel"
                    @select-confirm="selectConfirm">
    </SelectStudent>
    <!-- 优化结果 -->
    <Modal v-model="optimizateResultModal"
          :transfer="false"
          title="优化结果"
          :mask-closable="false"
          width="920">
      <div style="height:450px;overflow:auto;">
        <p style="color:rgba(0,0,0,0.45);margin-bottom:16px;">平均分均衡</p>
        <table class="result-table">
          <thead>
            <tr>
              <th>科目</th>
              <th v-for="(item,index) in optimizateResult.Title" :key='index'>
                {{item}}
              </th>
              <th>最大差值</th>
            </tr>
          </thead>
          <tr v-for="(item,index) in optimizateResult.Data" :key='index'>
            <td>{{item.DisciplineName}}</td>
            <td v-for="(sub, i) in item.Datas" :key="i">
              <span :class="sub.IsMax?'IsMax':sub.IsMin?'IsMin':''">{{sub.ObjShow}}分</span>
            </td>
            <td>{{item.Difference}}分</td>
          </tr>
        </table>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="optimizateResultModal = false">取消</Button>
        <Button class="xy-modal-primary"
                shape="circle"
                @click="exportResult">导出</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import SelectStudent from '@/pages/csmsTimeTable/views/smartDivideClass/divideClassResult/CheckboxMutexStudent.vue'
  export default {
    name: 'FineOptimiza',
    components: { SelectStudent },
    data () {
      return {
        optimizeClassData: [],
        selectClassIDS: [],
        administrative: false, // 原行政班集中
        menWomen: false, // 男女均衡
        mutexStudent: false, // 互斥学生
        // 平均分均衡：添加规则
        addRulesModal: false,
        subjectData: [],
        subjectIds: [],
        subjectNames: [], // 用于添加规则后展示
        averageDiff: null,
        AverageDifferenceData: [],
        ruleTitle: '添加规则',
        editRuleIndex: -1, // 当前编辑规则的索引

        // 其他规则：添加互斥学生
        addStudentModal: false,
        mutexStudentList: [],
        mutexStudentData: [],
        mutexStudentDataID: [],
        // 优化结果
        optimizateResultModal: false,
        optimizateResult: [],
        smartDivideStepsHeader: {}
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent
      this.getCollectionInfo()
    },
    watch: {
      selectClassIDS (newVal, oldVal) {
        if (newVal.length < oldVal.length && this.mutexStudentDataID.length > 0) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '取消勾选将会清除互斥学生下已选择的学生，确定执行此操作吗？',
            onOk: () => {
              this.mutexStudentData = []
              this.mutexStudentDataID = []
            },
            onCancel: () => {
              this.selectClassIDS = oldVal
            }
          })
        }
      }
    },
    methods: {
      // 分区班级信息
      async getCollectionInfo () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetAreaDivideclassGenerateCcollectionInfo`, {
          divideClassID: this.smartDivideStepsHeader.divideClassID
        })
        if (res.success) {
          res.data.map((item) => {
            item.Data.map((classes) => {
              this.$set(classes, 'noChoice', false)
            })
          })
          this.optimizeClassData = res.data
        }
        this.xy.unloading()
      },
      selectClass (val) {
        // 取消所有禁选
        if (val.length === 0) {
          this.optimizeClassData.map((item) => {
            item.Data.map((classes) => {
              this.$set(classes, 'noChoice', false)
            })
          })
          return false
        }
        // 设置禁选
        for (let i = 0; i < this.optimizeClassData.length; i++) {
          let Index = this.optimizeClassData[i].Data.map((item) => { return item.DivideClassGenerateCollectionID }).indexOf(val[0])
          if (Index > -1) {
            // 禁选当前分区的不同科目
            let curClassName = this.optimizeClassData[i].Data[Index].DingName // 当前所选班级的科目名称
            this.optimizeClassData[i].Data.map((classes) => {
              if (classes.DingName !== curClassName) {
                this.$set(classes, 'noChoice', true)
              } else {
                this.$set(classes, 'noChoice', false)
              }
            })
          } else {
            // 禁选其他分区下所有班级选框
            this.optimizeClassData[i].Data.map((classes) => {
              this.$set(classes, 'noChoice', true)
            })
          }
        }
      },

      // 添加规则
      async addRules () {
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.ruleTitle = '添加规则'
        this.editRuleIndex = -1
        this.addRulesModal = true
        this.getCourse()
      },
      clickSubject (val, index) {
        this.subjectData[index].isChecked = !this.subjectData[index].isChecked
        let index2 = this.subjectIds.indexOf(val.DisciplineID)
        if (index2 === -1) {
          this.subjectIds.push(val.DisciplineID)
          this.subjectNames.push(val.DisciplineName)
        } else {
          this.subjectIds.splice(index2, 1)
          this.subjectNames.splice(index2, 1)
        }
      },
      // 编辑规则
      editRule (val, index) {
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.ruleTitle = '编辑规则'
        this.editRuleIndex = index
        this.addRulesModal = true
        this.getCourse(val)
      },
      addRulesSubmit () {
        if (this.subjectIds.length === 0) {
          this.xy.msgError('请选择科目。')
          return false
        }
        if (Number(this.averageDiff) === 0) {
          this.xy.msgError('请输入正确分数。')
          return false
        }
        if (this.editRuleIndex !== -1) { // 编辑
          this.AverageDifferenceData.splice(this.editRuleIndex, 1, {
            DistinctID: this.subjectIds,
            DistinctName: this.subjectNames,
            Difference: Number(this.averageDiff).toFixed(2)
          })
        } else { // 添加
          this.AverageDifferenceData.push({
            DistinctID: this.subjectIds,
            DistinctName: this.subjectNames,
            Difference: Number(this.averageDiff).toFixed(2)
          })
        }
        this.addRulesModal = false
      },
      addRulesCancel () {
        this.addRulesModal = false
      },
      // 删除规则
      delRule (val) {
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除这条规则吗？',
          onOk: () => {
            this.AverageDifferenceData.map((item, index) => {
              if (JSON.stringify(item.DistinctID) === JSON.stringify(val.DistinctID)) {
                this.AverageDifferenceData.splice(index, 1)
              }
            })
          }
        })
      },

      // 获取方案科目
      async getCourse (val) {
        this.subjectIds = []
        this.subjectNames = []
        this.subjectData = []
        this.averageDiff = null
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetOptimizationAllCourseplan`, {
          id: this.smartDivideStepsHeader.divideClassID
        })
        if (res.success) {
          res.data.map((item) => {
            if (item.IsSelection) {
              this.$set(item, 'isChecked', false)
              this.subjectData.push(item)
            }
          })

          // 编辑规则时 回显已选中科目、相差分数
          if (val && this.editRuleIndex !== -1) {
            this.averageDiff = Number(val.Difference)
            let editIds = val.DistinctID
            let editNames = val.DistinctName
            if (editIds.length === 0) return false
            for (let i = 0; i < editIds.length; i++) {
              let index = this.subjectData.map(item => { return item.DisciplineID }).indexOf(editIds[i])
              if (index > -1) {
                this.$set(this.subjectData[index], 'isChecked', true)
              }
              let index2 = this.subjectIds.indexOf(editIds[i])
              if (index2 === -1) {
                this.subjectIds.push(editIds[i])
                this.subjectNames.push(editNames[i])
              }
            }
          }
        }
        this.xy.unloading()
      },
      // 取消选中互斥学生
      checkMutexStudent (val) {
        // console.log(val)
        if (!this.mutexStudent) {
          this.mutexStudent = !this.mutexStudent
        } else {
          if (this.mutexStudentDataID.length > 0) {
            this.$Modal.confirm({
              title: '温馨提示',
              content: '取消勾选将会清除已选择的学生，确定执行此操作吗？',
              onOk: () => {
                this.mutexStudent = !this.mutexStudent
                // 清空已选互斥学生组
                this.mutexStudentData = []
                this.mutexStudentDataID = []
              }
            })
          } else {
            this.mutexStudent = !this.mutexStudent
          }
        }
      },
      // 添加互斥学生
      addMutex () {
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.addStudentModal = true
      },
      // 取消添加
      selectCancel () {
        this.addStudentModal = false
      },
      // 确认添加互斥学生
      selectConfirm (data) {
        this.addStudentModal = false
        let nameArr = []
        let idArr = []
        for (let i = 0; i < data.length; i++) {
          nameArr.push(data[i].name)
          idArr.push(data[i].id)
        }
        this.mutexStudentData.push(nameArr.join('、'))
        this.mutexStudentDataID.push(idArr.join(','))
      },
      // 删除互斥学生
      delStudent (val) {
        let index = this.mutexStudentData.map((item) => { return item }).indexOf(val)
        if (index !== -1) {
          this.mutexStudentData.splice(index, 1)
          this.mutexStudentDataID.splice(index, 1)
          this.xy.msgSuc('删除成功。')
        }
      },
      // 保存
      async submit () {
        if (this.selectClassIDS.length === 0) {
          this.xy.msgError('请选择班级。')
          return false
        }
        if (this.AverageDifferenceData.length === 0) {
          this.xy.msgError('请添加平均分均衡规则。')
          return false
        }
        if (this.mutexStudent && this.mutexStudentDataID.length === 0) {
          this.xy.msgError('请添加互斥学生。')
          return false
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/OptimizationAreaDivideclassGenerateCcollectionInfo`, {
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          DivideClassGenerateCollectionIDS: this.selectClassIDS,
          IsStudentOrganization: this.administrative,
          IsSex: this.menWomen,
          MutexStudent: this.mutexStudentDataID, // 格式["id,id","id,id"],
          Type: 2, // 1平均分分层，2平均分均衡，3排名段均衡，4分数段均衡
          AverageDifference: this.AverageDifferenceData
        })
        if (res.success) {
          this.optimizateResult = res.data.data
          this.optimizateResultModal = true
        }
        this.xy.unloading()
      },

      // 导出
      exportResult () {
        let params = {
          datats: JSON.stringify(this.optimizateResult.Data),
          resulttitle: this.optimizateResult.Title.join(','),
          type: 2
        }
        this.xy.downFile(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/ExportGenerateCcollection`, params)
      },
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang='less' scoped>
.back {
  color: #1890ff;
  top: 15px;
  right: 20px;
  cursor: pointer;
  .iconfont {
    margin-right: 5px;
    font-size: 14px;
  }
}
.divide-cell {
  margin: 30px 0 10px;
  display: flex;
}
.last-cell{
  padding-bottom: 50px;
}
.cell-left {
  width: 100px;
  text-align: right;
  font-weight: 700;
  color: #333;
  font-size: 16px;
  display: inline-block;
}
.cell-right {
  flex: 1;
  margin-left: 12px;
  color: #333;
}
// 优化范围
.area-list {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  padding: 0 10px;
  border-bottom: 1px solid #e9e9e9;
}
.area-name {
  padding: 15px 0 10px;
  font-weight: 700;
  display: flex;
  text-align: center;
}
.area-name span{
  width: 22px;
  height: 22px;
  background: linear-gradient(137deg,#44adff 5%, #4582ff 98%);
  border-radius: 4px;
}
.area-name span i{
  color: #fff;
  font-size: 12px;
}
.check-group {
  color: #333;
  margin:0px 0px 5px 37px;
}
.check-group .check{
  margin: 2px 10px 11px 0;
}
// 添加规则
.average-ul li{
  width: fit-content;
  padding: 0 14px;
  height: 32px;
  line-height: 32px;
  background: #f5f5f5;
  border: 1px solid #dddddd;
  border-radius: 4px;
  margin-top: 14px;
  cursor: pointer;
}
// 添加互斥学生
.add-student{
  margin: 15px 0 0 20px;
}
.student-group .student{
  padding: 0 3px 0 8px;
  margin: 0 12px 5px 0;
  height: 22px;
  background: #f5f5f5;
  border: 1px solid #dddddd;
  border-radius: 4px;
}
.optimize-range .name{
  font-weight: 700;
  color: #333;
  font-size: 16px;
  margin-top: 10px;
  margin-left: 10px;
}
.optimize-box {
  padding: 0px 10px 0 0;
}
// 添加按钮
.add-btn {
  max-width: 85px;
  height: 22px;
  line-height: 22px;
  background: #ffffff;
  border: 1px dashed #1677ff;
  border-radius: 4px;
  font-size: 12px;
  color: #1677FF;
  padding: 0 9px 0 6px;
  margin-right: 12px;
  cursor: pointer;
}
.add-btn i{
  font-size: 12px;
  margin-right: 4px;
}
.add-btn.disabled {
  color: #c5c8ce;
  background: #f7f7f7;
  border-color: #dcdee2;
  cursor: not-allowed;
}
// 优化结果
.result-table {
  width: 100%;
}
.result-table th {
  height: 54px;
  width: 100px;
  text-align: center;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.65);
}
.result-table td {
  height: 54px;
  width: 100px;
  text-align: center;
  border-bottom: 1px solid #e8e8e8;
}
.result-table .IsMax {
  color: #61cd31;
}
.result-table .IsMin {
  color: #ff2f2f;
}
// 选择科目
.rule-title{
  font-weight: 700;
  color: #333;
}
.subject-list{
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.subject-list .subject{
  margin: 4px 20px 16px 0;
  width: 112px;
  height: 40px;
  color: #333;
  border: 1px solid #dddddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.subject-list .sanjiao {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-color: transparent transparent transparent transparent;
  border-width: 12px;
  border-style: solid;
  i {
    position: absolute;
    right: -12px;
    bottom: -14px;
    color: #fff;
    font-size: 12px;
  }
}
.subject-list .checked{
  color: #1677FF;
  border: 1px solid #1677ff;
}
.subject-list .checked .sanjiao{
  border-color: transparent #1677ff #1677ff transparent !important;
}
//
.fine-optimiza-fotter {
  height: 50px;
  position: fixed;
  line-height: 50px;
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
.end-crouse-checkbox {
  margin: 10px;
}

.max-height{
  max-height: 500px;
  overflow-y: auto;
}
</style>
