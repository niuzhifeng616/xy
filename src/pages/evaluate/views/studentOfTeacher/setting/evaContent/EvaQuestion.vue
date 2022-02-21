<!-- 评教设置：创建方案-评教内容列表-评价问卷 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary" @click="creat" :disabled="isPublish">添加问卷题</Button>
        <Button class="xy-info" @click="preview">预览</Button>
      </div>
      <div class="fr pr">
        <p class="title-count col0-65">已添加{{questionInfo.count}}题，满分{{questionInfo.score||0}}分。</p>
      </div>
    </div>
    <div class="xy-content-body">
      <div v-if="subjectList.length === 0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">您还没有题目的信息，请添加题目。</span>
      </div>
      <ul class="ques-ul" v-else>
        <li v-for="(item,index) in subjectList" :key="index" class="ques-li pr">
          <div class="col0-85 xy-flex" :class="item.IsMust?'isRequire title':'title'">
            <span>{{index+1}}.</span>
            <span>{{item.QuestionName}}</span>
          </div>
          <div class="choose-item">
            <!-- 单选题 -->
            <RadioGroup v-if="item.QuestionType===1 && item.list!==undefined && item.list.length>0">
              <Radio
                v-for="(citem,cindex) in item.list"
                :key="cindex"
                disabled
                class="col0-65 radio-item"
                :class="!item.OptionStyle?'isCloumn':''"
                >
                {{letterNum[cindex]}}.&nbsp;&nbsp;{{citem.QuestionOptionName}}
              </Radio>
            </RadioGroup>
            <!-- 打分题 -->
            <div v-if="item.QuestionType===3 && item.list!==undefined && item.list.length>0" class="rate">
              <Rate
                :custom-icon="'iconfont icon-Starunselectedbeifen'"
                disabled
                show-text
                :value="4"
                clearable
                >
                <span style="color: rgba(0,0,0,0.65)">{{ item.list[1].QuestionOptionName }}</span>
              </Rate>
            </div>
            <!-- 问答题 -->
            <Input
              v-if="item.QuestionType===4"
              disabled
              placeholder=""
              style="width: 100%;margin-top:10px"
              maxlength="500"
              type="textarea"
              :rows="3"
              />
          </div>
          <div class="subject-list-term-foot pa" v-if="!isPublish">
            <div class="subject-list-term-foot-btn" @click="subjectEdit(item, index)">编辑</div>
            <div class="subject-list-term-foot-btn" @click="subjectCopy(item, index)">复制</div>
            <div class="subject-list-term-foot-btn" @click="subjectMoveUp(item, index)" :class="index+1 === 1?'no-move':''">上移</div>
            <div class="subject-list-term-foot-btn" @click="subjectMoveDown(item, index)" :class="index+1 === subjectList.length?'no-move':''">下移</div>
            <div class="subject-list-term-foot-btn" @click="subjectUp(item, index)" :class="index+1 === 1?'no-move':''">置顶</div>
            <div class="subject-list-term-foot-btn" @click="subjectDown(item, index)" :class="index+1 === subjectList.length?'no-move':''">置底</div>
            <div class="subject-list-term-foot-btn" @click="subjectDelete(item)">删除</div>
          </div>
        </li>
      </ul>
    </div>
    <Modal
      v-model="showQuestion"
      :title="isEdit?'编辑问卷题':'添加问卷题'"
      :transfer="false"
      :mask-closable="false"
      :closable="false"
      width="570"
      >
          <!-- @on-visible-change="closeModal" -->
      <div class="add-question" style="max-height: 545px; overflow-y:auto;">
        <div style="padding:0 0 10px" v-if="!isEdit">
          <Button class="xy-info" :class="titleType===1?'activeBtn':''" @click="tabChange(1)">
            <Icon type="md-add" />添加单选题
          </Button>
          <Button class="xy-info" :class="titleType===3?'activeBtn':''" @click="tabChange(3)">
            <Icon type="md-add" />添加打分题
          </Button>
          <Button class="xy-info" :class="titleType===4?'activeBtn':''" @click="tabChange(4)">
            <Icon type="md-add" />添加问答题
          </Button>
        </div>
        <div ref="formOption" :model="formOption" style="width: 100%">
          <div style="margin-bottom:15px">
            <Input placeholder="题目名称" v-model="formOption.QuestionName" :formatter="value=>(value).trim()" maxlength="500" type="textarea" :rows="3" />
          </div>
          <div class="option-title" v-if="titleType===3">
            <span>示例：</span>
            <Rate class="rate" :custom-icon="'iconfont icon-Starunselectedbeifen'"
                  v-model="star"
                  clearable
                  style="margin-top:-9px;">
            </Rate>
          </div>
          <div class="option-title" v-if="titleType<4">
            <p class="option-left">选项</p>
            <p>分值</p>
          </div>
          <!-- 单选题 -->
          <template v-if="titleType===1">
            <div>
              <div style="display:flex; margin-bottom:15px;" v-for="(item, index) in formOption.items" :key="index">
                <div class="input-title">
                  <Input type="text" v-model.trim="item.QuestionOptionName" placeholder="选项内容" maxlength="30" />
                </div>
                <div class="input-item" style="display:flex; justify-content:center; align-items:center;">
                  <InputNumber v-model="item.Score" :formatter="value=>parseInt(value)" :min="0" :max="100" placeholder="分值" />
                  <Icon type="ios-add" class="icon-btn" @click="addOption" />
                  <Icon type="ios-remove" class="icon-btn" @click="delOption(index)" />
                </div>
              </div>
            </div>
            <div style="margin-bottom:10px;">
              <div class="row">
                <p>选项布局：</p>
                <RadioGroup v-model="formOption.OptionStyle">
                  <Radio :label="1"> 横向 </Radio>
                  <Radio :label="0"> 纵向 </Radio>
                </RadioGroup>
              </div>
            </div>
          </template>
          <!-- 打分题 -->
          <template v-if="titleType===3">
            <div style="display:flex; margin-bottom:15px;" v-for="(item, index) in formOption.starData" :key="index">
              <div class="input-title">
                <Input type="text" v-model.trim="item.QuestionOptionName" placeholder="选项内容" maxlength="30" />
              </div>
              <div class="input-item">
                <InputNumber v-model="item.Score" :formatter="value=>parseInt(value)" :min="0" :max="100" placeholder="分值" />
              </div>
            </div>
          </template>
          <div style="margin-bottom:0px;">
            <div class="row">
              <p>是否必填：</p>
              <i-switch v-model="formOption.IsMust" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="clearfix">
        <Checkbox v-model="isGOon" class="fl" style="line-height: 36px;" v-if="!isEdit">继续，添加下一题</Checkbox>
        <Button class="xy-modal-primary fr" shape="circle" @click="handleSubmit()">确定</Button>
        <Button class="xy-modal-close fr" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'evaQuestion',
    components: {},
    data () {
      return {
        isPublish: false, // 当前方案是否已经发布

        letterNum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], // 字母序号
        titleType: 1, // 1：单选 ，3：打分， 4：问答
        star: 5,
        starText: ['', '很不满意', '不满意', '一般', '满意', '很满意'],
        valueCustomText: 0,
        subjectList: [],
        isGOon: false,
        isRequire: true,
        type: '',
        switch: false,
        showQuestion: false,
        isEdit: false,
        editQuestionID: 0, // 当前编辑问题id
        editQuestionSort: 0, // 当前编辑问题题号
        isCopy: false,
        formOption: {
          OptionStyle: 1, // 布局方式
          QuestionName: '',
          IsMust: false,
          items: [
            {
              Score: null,
              QuestionOptionName: ''
            },
            {
              Score: null,
              QuestionOptionName: ''
            },
            {
              Score: null,
              QuestionOptionName: ''
            },
            {
              Score: null,
              QuestionOptionName: ''
            }
          ],
          starData: [
            { QuestionOptionName: '很满意', Score: 5 },
            { QuestionOptionName: '满意', Score: 4 },
            { QuestionOptionName: '一般', Score: 3 },
            { QuestionOptionName: '不满意', Score: 2 },
            { QuestionOptionName: '很不满意', Score: 1 }
          ]
        },
        questionInfo: { count: 0, score: 0 }
      }
    },
    computed: {
      evaRowObj () {
        return this.$store.state.evaluate.evaRowObj // 评教方案信息
      },
      evaQuestion () {
        return this.$store.state.evaluate.evaQuestion // 评教问卷信息
      }
    },
    created () {
      if (Object.keys(this.$store.state.evaluate.evaRowObj).length > 0) {
        this.isPublish = this.$store.state.evaluate.evaRowObj.IsPublished
      }
      this.getAll()
    },
    mounted () {

    },
    methods: {
      // 获取所有试题
      async getAll () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingQuestion/GetAll`, {
          questionnaireID: this.evaQuestion.QuestionnaireID
        })
        if (res.success) {
          this.subjectList = []
          this.subjectList = res.data || []
          let allScore = 0
          this.subjectList.map(item => {
            if (item.list.length > 0) {
              let scores = item.list.map(citem => { return citem.Score })
              let scoreItem = scores.sort(function (a, b) { return b - a })[0]
              allScore += scoreItem
            }
          })
          this.subjectList.sort((a, b) => {
            return a.SortOrder - b.SortOrder
          })
          this.questionInfo = { count: this.subjectList.length, score: allScore }
          this.xy.unloading()
        }
      },
      preview () {
        this.$router.push({ path: '/xyhome/evaPreview', query: this.$store.state.common.menuInfo })
      },
      tabChange (val) {
        this.titleType = val
        this.resetFormOption()
      },
      addOption () {
        if (this.formOption.items.length < 8) {
          this.formOption.items.push({ QuestionOptionName: '', Score: null })
          this.$forceUpdate()
        } else {
          this.xy.msgError('选项不能多于8项。')
        }
      },
      delOption (index) {
        if (this.formOption.items.length > 2) {
          this.formOption.items.splice(index, 1)
          this.$forceUpdate()
        } else {
          this.xy.msgError('选项不能少于2项。')
        }
      },
      // 重置默认值
      resetFormOption () {
        this.formOption.items = [
          {
            Score: null,
            QuestionOptionName: ''
          },
          {
            Score: null,
            QuestionOptionName: ''
          },
          {
            Score: null,
            QuestionOptionName: ''
          },
          {
            Score: null,
            QuestionOptionName: ''
          }
        ]
        this.formOption.starData = [
          { QuestionOptionName: '很满意', Score: 5 },
          { QuestionOptionName: '满意', Score: 4 },
          { QuestionOptionName: '一般', Score: 3 },
          { QuestionOptionName: '不满意', Score: 2 },
          { QuestionOptionName: '很不满意', Score: 1 }
        ]
        this.formOption.QuestionName = '' // 题目重置
        this.formOption.OptionStyle = 1 // 单选题选项布局重置
        this.formOption.IsMust = false
      },
      // ---------------------------------题目操作----------------------------------------
      // 验证
      validation () {
        if (this.formOption.QuestionName.trim() === '') {
          this.xy.msgError('请填写题目名称。')
          return false
        }
        if (this.titleType === 1) { // 单选题
          for (let i = 0; i < this.formOption.items.length; i++) {
            if (this.formOption.items[i].QuestionOptionName === '') {
              this.xy.msgError('请填写选项内容。')
              return false
            }
            if (this.formOption.items[i].Score === null) {
              this.xy.msgError('请填写分值。')
              return false
            }
          }
        } else if (this.titleType === 3) { // 打分题
          for (let i = 0; i < this.formOption.starData.length; i++) {
            if (this.formOption.starData[i].QuestionOptionName === '') {
              this.xy.msgError('请填写选项内容。')
              return false
            }
            if (this.formOption.starData[i].Score === null) {
              this.xy.msgError('请填写分值。')
              return false
            }
          }
        }
        return true
      },
      // 提交 创建、编辑、复制题目
      handleSubmit () {
        if (!this.isCopy && !this.validation()) {
          return
        }
        this.xy.loading()
        let arr = []
        if (this.titleType === 1 || this.titleType === 3) {
          this.formOption[this.titleType === 1 ? 'items' : 'starData'].map((item, index) => {
            arr.push({
              'QuestionID': this.isEdit ? this.editQuestionID : 0,
              'QuestionOptionName': item.QuestionOptionName,
              'QuestionOptionID': this.isEdit ? item.QuestionOptionID : 0,
              'SortOrder': index + 1,
              'Score': parseInt(item.Score)
            })
          })
        }
        let obj = {
          'QuestionID': this.isEdit ? this.editQuestionID : 0, // 复制/创建：0，编辑：id
          'QuestionnaireID': this.evaQuestion.QuestionnaireID,
          'TeachingProjectID': this.evaRowObj.TeachingProjectID,
          'QuestionName': this.formOption.QuestionName,
          'QuestionType': this.titleType,
          'SortOrder': this.isEdit ? this.editQuestionSort : 0, // 创建复制题号传0，编辑传相应值
          'OptionStyle': this.formOption.OptionStyle > 0,
          'IsMust': this.formOption.IsMust,
          'List': arr,
          'IsCopy': this.isCopy ? 1 : 0 // 添加 编辑：0，复制：1
        }
        // console.log(obj)
        this.xy.post(`${this.$store.state.apiPath}/api/StudentTeachingQuestion/Save`, obj).then(res => {
          if (res.success) {
            if (this.editQuestionID === 0) {
              if (this.isCopy) {
                this.xy.msgSuc('复制成功。')
              } else {
                this.xy.msgSuc('添加成功。')
              }
            } else {
              this.xy.msgSuc('编辑成功。')
            }
            if (this.isGOon) {
              this.resetFormOption()
              this.getAll()
            } else {
              this.showQuestion = false
              this.titleType = 1
              this.getAll()
            }
          }
          this.xy.unloading()
        })
      },
      // 创建
      creat () {
        this.resetFormOption()
        this.showQuestion = true
        this.isEdit = false
        this.isCopy = false
        this.editQuestionID = 0
      },
      // 取消创建
      cancel () {
        this.showQuestion = false
        this.titleType = 1
        this.isGOon = false
      },
      // 右上角关闭创建按钮
      closeModal () {
        if (!this.showQuestion) {
          this.titleType = 1
        }
      },
      // 编辑
      subjectEdit (val, index) {
        this.showQuestion = true
        this.titleType = val.QuestionType
        this.formOption = JSON.parse(JSON.stringify(val))
        if (val.QuestionType === 1 || val.QuestionType === 3) {
          this.formOption[val.QuestionType === 1 ? 'items' : 'starData'] = JSON.parse(JSON.stringify(val.list))
          this.formOption.OptionStyle = !val.OptionStyle ? 0 : 1
        }
        this.editQuestionID = val.QuestionID
        this.editQuestionSort = val.SortOrder
        this.isEdit = true
        this.isCopy = false
      },
      // 复制
      async subjectCopy (val, index) {
        // this.showQuestion = true
        this.titleType = val.QuestionType
        this.formOption = JSON.parse(JSON.stringify(val))

        if (val.QuestionType === 1 || val.QuestionType === 3) {
          this.formOption[val.QuestionType === 1 ? 'items' : 'starData'] = JSON.parse(JSON.stringify(val.list))
          this.formOption.OptionStyle = !val.OptionStyle ? 0 : 1
        }

        this.isCopy = true
        this.editQuestionID = 0
        this.isEdit = false
        this.handleSubmit()
      },
      // 上移
      subjectMoveUp (val, i) {
        if (i + 1 === 1) return
        for (var j = 0; j < this.subjectList.length; j++) {
          if (this.subjectList[j].QuestionID === val.QuestionID) {
            this.subjectList.splice(i, 1)
          }
        }
        this.subjectList.splice(i - 1, 0, val)
        this.SaveOrder()
      },
      // 下移
      subjectMoveDown (val, i) {
        if (i + 1 === this.subjectList.length) return
        for (var j = 0; j < this.subjectList.length; j++) {
          if (this.subjectList[j].QuestionID === val.QuestionID) {
            this.subjectList.splice(i, 1)
          }
        }
        this.subjectList.splice(i + 1, 0, val)
        this.SaveOrder()
      },
      // 置顶
      subjectUp (val, i) {
        if (i + 1 === 1) return
        for (var j = 0; j < this.subjectList.length; j++) {
          if (this.subjectList[j].QuestionID === val.QuestionID) {
            this.subjectList.splice(i, 1)
          }
        }
        this.subjectList.unshift(val)
        this.SaveOrder()
      },
      // 置底
      subjectDown (val, i) {
        if (i + 1 === this.subjectList.length) return
        for (var j = 0; j < this.subjectList.length; j++) {
          if (this.subjectList[j].QuestionID === val.QuestionID) {
            this.subjectList.splice(i, 1)
          }
        }
        this.subjectList.push(val)
        this.SaveOrder()
      },
      // (上移，下移，置顶，置底)
      async SaveOrder () {
        var OptionList = []
        for (var i = 0; i < this.subjectList.length; i++) {
          OptionList.push({
            QuestionID: this.subjectList[i].QuestionID,
            SortOrder: i + 1
          })
        }
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StudentTeachingQuestion/UpdateSortOrder`, OptionList)
        if (res.success) {
          this.getAll()
          this.xy.unloading()
        }
      },
      // 删除
      subjectDelete (val) {
        let that = this
        this.$Modal.confirm({
          title: '删除',
          content: `<p>您确认要删除“${val.QuestionName}”吗？</p>`,
          async onOk () {
            that.xy.loading()
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/StudentTeachingQuestion/Delete?questionID=${val.QuestionID}`)
            if (res.success) {
              that.xy.msgSuc('删除成功。')
              that.xy.unloading()
              that.getAll()
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module {
  .xy-content-title {
    border-bottom: 1px solid #e8e8e8;
  }
  .xy-content-body {
    .ques-ul {
      .ques-li {
        padding: 10px 10px 30px;
        border-bottom: 1px dashed #e8e8e8;
        .title {
          font-weight: 700;
          &::before {
            content: '*';
            display: inline-block;
            margin-right: 4px;
            line-height: 1;
            font-size: 14px;
            color: transparent;
          }
          > span:nth-child(1){
            display: block;
            margin-right: 5px;
          }
        }
        .isRequire::before {
          color: #ed4014;
        }
        .choose-item{
          padding: 10px 0 10px 28px;
          .radio-item{
            margin-right: 30px;
          }
          .isCloumn {
            display: block;
            margin-top: 15px;
          }
          .rate {
            display: flex;
            flex-direction: column;
          }
        }
        .subject-list-term-foot {
          bottom:15px;
          right:0;
          color: rgba(0,0,0,0.85);
          display: none;
          justify-content: flex-end;
          .subject-list-term-foot-btn.no-move{
            color: #ccc;
            cursor: no-drop;
            &:hover {
              transition: all 0.3s;
              color: #ccc;
            }
          }
          .subject-list-term-foot-btn {
            display: inline-block;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
            &::after {
              content: '|';
              color: #ccc;
              margin: 0 10px;
            }
            &:hover {
              transition: all 0.3s;
              color: #4196ff;
            }
            &:last-child {
              border-right: none;
              &:hover {
                border-right: none;
                color: #ee6b6b;
              }
              &::after {
                content: '';
              }
            }
          }
        }
        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background: #fcfdff;
        }
      }
      .ques-li:hover{
        .subject-list-term-foot{
          display: flex;
        }
      }
    }
  }
}

.xy-info,
.xy-primary {
  margin-right: 10px;
}
.add-question {
  .input-item{
    .icon-btn {
      width: 32px;
      height: 32px;
      font-size: 20px;
      margin-left: 20px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      line-height: 32px;
      cursor: pointer;
      &:hover {
        color: #3e8ff2;
        background-color: white;
        border-color: #3e8ff2;
      }
    }
  }
  .input-title {
    width: 300px;
    margin-right: 30px;
  }
  .activeBtn {
    color: #3e8ff2;
    background-color: white;
    border-color: #3e8ff2;
  }
  .xy-content-title {
    padding-left: 0;
  }
  .option-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #212121;
    margin-top: 15px;
    margin-bottom: 5px;
    .option-left {
      width: 300px;
      margin-right: 30px;
    }
  }
  .every-option {
    margin-bottom: 13px;
    display: flex;
    align-items: center;
  }
  .row {
    display: flex;
    align-items: center;
  }
}
.title-count {
  line-height: 32px;
}
</style>
