<!-- 评教设置：创建方案-评教内容列表 -->
<template>
  <div class="eva-content">
    <div class="xy-content-body">
      <div v-if="datatable.length>0" class="list-box">
        <p class="eva-title">已添评价组{{summary.QuestionnaireCount}}个，被评价教师共计{{summary.TeacherCount}}人，参评学生共计{{summary.StudentCount}}人。 </p>
        <div class="eva-list">
          <ul class="eva-ul">
            <li class="add-question eva-li" @click="addEva">
              <i class="iconfont icon-name col0-45">&#xe6a2;</i>
              <p>添加评价</p>
            </li>
            <li v-for="(item,index) in datatable" :key="index" class="question-box eva-li">
              <div class="top">
                <i class="iconfont" :style="{backgroundColor:item.ApplyToRole===1?'#FFBF00':'#5BD171'}">&#xe6f4;</i>
                <div>
                  <p class="name">{{item.QuestionnaireTitle}}</p>
                  <p class="roleName">{{item.ApplyToRole===1?'班主任':'任课教师'}}</p>
                </div>
              </div>
              <div class="bottom">
                <div class="border-r" @click="goObjectPage(item)"><i class="iconfont">&#xe714;</i>评价对象</div>
                <div class="border-r" @click="goQuePage(item)"><i class="iconfont">&#xe6f9;</i>评价问卷</div>
                <div class="more">
                  <Dropdown trigger="click" @on-click="moreFun($event,item)">
                    <a href="javascript:void(0)" style="color: rgba(0,0,0,0.45);">
                      <Icon type="ios-more" />
                      更多
                    </a>
                    <DropdownMenu slot="list">
                      <DropdownItem :disabled="isPublish" name="edit">编辑</DropdownItem>
                      <DropdownItem :disabled="isPublish" name="del">删除</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </li>

          </ul>
          <div class="text-right pr" style="margin-top:10px;">
            <page
              :total="total" :page-size="pageSize"
              :current="pageCurrent"
              :page-size-opts="pages"
              show-sizer
              show-total
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              >
            </page>
          </div>
        </div>
      </div>
      <div class="text-center nodata" v-else>
        <img src="@/assets/evaluate/no-evaluate.png" alt="">
        <p class="col0-65">还没有评价内容哦。</p>
        <Button class="xy-btn-primary" shape="circle" @click="addEva" style="margin-right:0">去添加评价</Button>
      </div>

      <!-- 是否添加评价问卷的提示 -->
      <Modal
        v-model="successModal"
        :transfer="false"
        :mask-closable="false"
        :closable="false"
        class="success-modal"
        >
        <div class="ivu-modal-confirm-head-icon ivu-modal-confirm-head-icon-success">
          <Icon type="md-checkmark-circle" />
          <span class="ivu-modal-confirm-head-title">恭喜您，保存成功！</span></div>
        <p class="ivu-modal-confirm-body" style="padding: 10px 0 20px 40px; color: rgba(0,0,0,0.65);">是否继续为该组教师添加评价问卷？</p>
        <div slot="footer">
          <Button class="xy-modal-close" @click="successModal = false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="addQuestion">确定</Button>
        </div>
      </Modal>
      <!-- 编辑问卷名称 -->
      <Modal
        v-model="editModal"
        title="编辑问卷名称"
        :transfer="false"
        :mask-closable="false"
        >
        <Form ref="formEdit" :model="formEdit" label-position="right" :label-width="100">
          <FormItem
              label="问卷组名："
              prop="questionName"
              :rules="{required: true, message:'请输入问卷组名', trigger: 'change'}"
              labelFor="Item1"
              >
              <Input v-model.trim="formEdit.questionName" elementId="Item1" placeholder="请输入问卷组名" clearable />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button class="xy-modal-close" @click="editModal = false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="sureEdit">确定</Button>
        </div>
      </Modal>
      <!-- 添加评价对象 -->
      <add-eva
          :isShow="isShowAddEva"
          :teachers="[...selectedTeachers]"
          @select-cancel="selectCancel"
          @select-confirm="selectConfirm"
          >
      </add-eva>
    </div>
  </div>
</template>

<script>
  import AddEva from '@/pages/evaluate/views/studentOfTeacher/setting/components/AddEva.vue'
  export default {
    name: 'evaContent',
    components: {
      AddEva
    },
    data () {
      return {
        isPublish: false, // 当前方案是否已经发布
        teachingProjectID: 0, //
        summary: {}, // 顶部统计数据
        total: 0, // 总条数
        pageSize: 15, // 每页显示条数
        pageCurrent: 1, // 当前页码
        pageList: '', // 当前页数据条数
        pages: [15, 30, 50, 100], // 默认每页可选10/20/50/100条
        datatable: [],
        successModal: false,
        isShowAddEva: false,
        curAddEvaId: 0, // 当前添加评价的id
        curAddEvaName: '', // 当前添加评价的名称
        curAddEvaType: '', // 当前添加评价的角色类型
        selectedTeachers: [],
        editModal: false,
        curEdit: {}, // 当前编辑的问卷信息
        rowObj: {},
        formEdit: {
          questionName: ''
        }
      }
    },
    computed: {},
    created () {
      this.$store.commit('evaluate/changeEvaQuestion', {})
      if (Object.keys(this.$store.state.evaluate.evaRowObj).length > 0) {
        this.rowObj = this.$store.state.evaluate.evaRowObj
        this.isPublish = this.rowObj.IsPublished
        this.teachingProjectID = this.rowObj.TeachingProjectID
      }
    },
    mounted () {
      this.getTable()
    },
    methods: {
      async getTable () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingQuestionnaire/GetPage`, {
          pageIndex: this.pageCurrent,
          pageSize: this.pageSize,
          teachingProjectID: this.teachingProjectID
        })
        if (res.success) {
          this.summary = res.data.Summary
          this.datatable = res.data.Table.data || []
          this.total = res.data.Table.totalRecords
          this.xy.unloading()
        }
      },
      changePage (current) {
        this.pageCurrent = current
        this.getTable()
      },
      changePageSize (size) {
        this.pageSize = size
        this.pageCurrent = 1
        this.getTable()
      },
      moreFun (name, item) {
        let that = this
        if (name === 'edit') {
          this.editModal = true
          this.curEdit = item
          this.formEdit.questionName = item.QuestionnaireTitle
        } else {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除“' + item.QuestionnaireTitle + '”吗？',
            async onOk () {
              that.xy.loading()
              let res = await that.xy.post(`${that.$store.state.apiPath}/api/StudentTeachingQuestionnaire/Delete?questionnaireID=${item.QuestionnaireID}`, {
                questionnaireID: item.QuestionnaireID
              })
              if (res.success) {
                if (that.datatable.length > 1) {
                  that.datatable.length = that.datatable.length - 1
                } else {
                  if (that.pageCurrent > 1) {
                    that.pageCurrent = that.pageCurrent - 1
                  }
                }
                that.getTable()
              }
              that.xy.unloading()
            },
            onCancel: () => {
            }
          })
        }
      },
      sureEdit () {
        this.$refs.formEdit.validate((valid) => {
          if (valid) {
            this.editSubmit()
          }
        })
      },
      async editSubmit () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StudentTeachingQuestionnaire/Update`, {
          TeachingProjectID: this.curEdit.TeachingProjectID,
          QuestionnaireTitle: this.formEdit.questionName,
          QuestionnaireID: this.curEdit.QuestionnaireID
        })
        if (res.success) {
          this.xy.msgSuc('编辑成功。')
          this.editModal = false
          this.getTable()
        }
        this.xy.unloading()
      },
      addEva () {
        if (this.isPublish) {
          this.xy.msgError('当前方案已发布，不可添加评价。')
        } else {
          this.isShowAddEva = true
        }
      },
      selectCancel () {
        this.isShowAddEva = false
      },
      selectConfirm (data) {
        this.curAddEvaId = data.id
        this.curAddEvaName = data.name
        this.curAddEvaType = data.role
        this.isShowAddEva = false
        this.successModal = true
        this.getTable()
      },
      // 评价对象
      goObjectPage (item) {
        this.$store.commit('evaluate/changeEvaQuestion', item)
        this.$store.commit('common/getParam', { pro: '' })
        this.$store.commit('common/getThreeMenuName', `${item.QuestionnaireTitle} ${item.ApplyToRole === 1 ? '班主任' : '任课教师'}`)
        this.$router.push({ path: '/xyhome/evaPerson', query: this.$store.state.common.menuInfo })
      },
      // 评价问卷
      goQuePage (item) {
        this.$store.commit('evaluate/changeEvaQuestion', item)
        this.$store.commit('common/getParam', { pro: '' })
        this.$store.commit('common/getThreeMenuName', `${item.QuestionnaireTitle} ${item.ApplyToRole === 1 ? '班主任' : '任课教师'}`)
        this.$router.push({ path: '/xyhome/evaQuestion', query: this.$store.state.common.menuInfo })
      },
      // 评价问卷（快捷跳转）
      addQuestion (data) {
        this.addQuestion = false
        this.$store.commit('evaluate/changeEvaQuestion', { QuestionnaireID: this.curAddEvaId })
        this.$store.commit('common/getParam', { pro: '' })
        this.$store.commit('common/getThreeMenuName', `${this.curAddEvaName} ${this.curAddEvaType === 1 ? '班主任' : '任课教师'}`)
        this.$router.push({ path: '/xyhome/evaQuestion', query: this.$store.state.common.menuInfo })
      }
    }
  }
</script>

<style lang="less" scoped>
.eva-content {
  .list-box {
    .eva-title {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      margin-bottom: 15px;
    }
    .eva-list {
      .eva-ul {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .eva-li {
          width: 299px;
          height: 184px;
          margin: 0 10px 20px 0;
        }
        .add-question {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #d9d9d9;
          cursor: pointer;
          .icon-name{
            font-size: 20px;
          }
          p {
            margin-left: 10px;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.45);
          }
        }
        .question-box {
          border: 1px solid #e9e9e9;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          .top {
            display: flex;
            padding: 24px 10px 0 20px;
            .name {
              font-size: 16px;
              font-weight: 550;
              color: rgba(0, 0, 0, 0.85);
            }
            .roleName {
              font-size: 14px;
              color: rgba(0, 0, 0, 0.45);
            }
            .iconfont {
              margin-right: 10px;
              font-size: 24px;
              color: #fff;
              min-width: 48px;
              height: 48px;
              border-radius: 50%;
              text-align: center;
              line-height: 48px;
              background: #ffbf00;
            }
          }
          .bottom {
            display: flex;
            align-items: center;
            position: relative;
            height: 48px;
            background: #f7f9fa;
            border-top: 1px solid #e9e9e9;
            border-radius: 0px 0px 2px 2px;
            .border-r,
            .more {
              color: rgba(0, 0, 0, 0.45);
              width: 33%;
              text-align: center;
              border-right: 1px solid #e8e8e8;
              cursor: pointer;
              .iconfont{
                margin-right: 5px;
              }
            }
            .more {
              border-right: none !important;
              /deep/.ivu-select-dropdown {
                border-radius: 0 !important;
                right: 0;
                top: 42px;
              }
            }
          }
        }
      }
    }
  }
  .nodata {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img{
      height: 180px;
      margin-top: 80px;
    }
    p {
      margin: 20px 0 15px;
    }
  }
}
.success-modal {
  /deep/ .ivu-modal-footer {
    border-top: none;
  }
}
</style>
