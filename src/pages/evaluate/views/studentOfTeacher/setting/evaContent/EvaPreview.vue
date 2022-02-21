<!-- 评教设置：创建方案-评教内容列表-评价问卷 预览 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
      <p class="text-center">{{evaRowObj.TeachingProjectName}}</p>
      <P class="des" v-if="evaRowObj.TeachingProjectDescribe">{{evaRowObj.TeachingProjectDescribe}}</P>
      <!-- <P class="teacher-name">教师姓名：成华</P> -->
    </div>
    <div class="xy-content-body">
      <div v-if="subjectList.length===0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">您还没有题目的信息，请添加题目。</span>
      </div>
      <ul class="ques-ul" v-else>
        <li v-for="(item,index) in subjectList" :key="index" class="ques-li">
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
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'evaPreview',
    components: {},
    data () {
      return {
        letterNum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], // 字母序号
        subjectList: []
      }
    },
    computed: {
      evaQuestion () {
        return this.$store.state.evaluate.evaQuestion
      },
      evaRowObj () {
        return this.$store.state.evaluate.evaRowObj
      }
    },
    created () {
      this.getAll()
    },

    methods: {
      // 获取所有试题
      async getAll () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingQuestion/GetAll`, {
          questionnaireID: this.evaQuestion.QuestionnaireID
        })
        if (res.success) {
          this.subjectList = res.data || []
          this.subjectList.sort((a, b) => {
            return a.SortOrder - b.SortOrder
          })
          this.xy.unloading()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-module {
  .xy-content-title {
    border-bottom: 1px solid #e8e8e8;
    .text-center {
      font-weight: bold;
      font-size: 22px;
      text-align: center;
      margin-bottom: 30px;
    }
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
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
