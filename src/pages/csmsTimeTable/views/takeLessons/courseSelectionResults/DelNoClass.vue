<template>
<!-- 12.选课结果-删除不开班课程 -->
<div id="selectResult">
    <table class="result-table" v-if="!isNullData && !isLoading">
        <thead>
            <tr>
                <th>校本分类</th>
                <th>
                    <span>课程</span>
                    <i class="fa fa-long-arrow-up downUp" :class="downUp === 'SubjectDesc'?'i-active':''" @click="downOrUp('SubjectDesc')"></i>
                </th>
                <th>教师</th>
                <th>班额</th>
                <th>
                    <span>选课人数</span>
                    <i class="fa fa-long-arrow-up downUp" :class="downUp === 'SelAsc'?'i-active':''" @click="downOrUp('SelAsc')"></i>
                    <i class="fa fa-long-arrow-down downUp" :class="downUp === 'SelDesc'?'i-active':''" @click="downOrUp('SelDesc')"></i>
                </th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(course, index) in dataTable" :key="index">
                <td >{{course.SubjectCategoryName}}</td>
                <td >{{course.SubjectName}}</td>
                <td >{{course.TeacherNames}}</td>
                <td >{{course.StudentLimitation}}</td>
                <td >{{course.SelEndStudentCount}}</td>
                <td ><span @click="del(course)" v-if="isOperation===0">删除</span></td>
            </tr>
        </tbody>
    </table>
    <div v-if="isNullData && !isLoading" class="no-data-box">
      <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
      <span class="no-data-text">该搜索条件下没有结果。</span>
    </div>
    <div v-if="isLoading" class="is-loading">
      <div>
        <!-- <img :src="require('@/assets/common/loading.png')" alt="" /> -->
      </div>
    </div>

    <!--删除判断 -->
    <Modal v-model="modalDelClass"
           title="删除"
           v-if="isOperation===0"
           :transfer="false"
           :mask-closable="false"
           :closable="false">
        <div >
            <Alert type="warning" style="display:inline-block;margin-bottom:15px">
                <span>删除“<span >{{delClass.SubjectName}}</span>”将一并删除课程的选课结果，</span>
                <span v-if="huntingSubject">且将一并删除与之连选的课程“<span >{{delClass.SelectiveName}}</span>”及其选课结果，</span>
                <span>请输入“删除”确认。</span>
            </Alert>
            <Input v-model="delText"  placeholder="请输入“删除”"/>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancelDelClass">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="submitDelClass">保存</Button>
        </div>
    </Modal>
</div>
</template>
<script>
  export default {
    name: 'TLcourseSeleResultDNC',
    props: {
      isOperation: {
        type: Number,
        default: 0
      },
      classTableID: {
        type: Number,
        default: 0
      },
      searchName: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        isLoading: true,
        isNullData: false,
        dataTable: [],
        downUp: '',
        modalDelClass: false,
        delClass: '',
        delText: '',
        huntingSubject: false
      }
    },
    created () {
    },
    mounted () {
      this.getAllSelectList('')
    },
    methods: {
      async getAllSelectList (orderStr) {
        this.xy.loading()
        this.isLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SelectSchoolBasedSelectSubject/GetAllSelectList`, {
          classTableID: this.classTableID,
          searchName: this.searchName,
          orderStr: orderStr
        })
        this.isLoading = false
        this.xy.unloading()
        if (res.success) {
          this.dataTable = res.data
          if (res.data.length === 0) {
            this.isNullData = true
          } else {
            this.isNullData = false
          }
        }
      },
      downOrUp (val) {
        this.downUp = val
        this.getAllSelectList(val)
      },
      del (val) {
        if (val.SelectiveName !== null && val.SelectiveName !== '') {
          this.huntingSubject = true
        };
        this.delText = ''
        this.delClass = val
        this.modalDelClass = true
      },
      cancelDelClass () {
        this.modalDelClass = false
        this.huntingSubject = false
      },
      async submitDelClass () {
        if (this.delText === '删除') {
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectSchoolBasedSelectSubject/DeleteClass`, {
            ClassTableID: this.classTableID,
            CoursePlanID: this.delClass.CoursePlanID,
            ClassID: this.delClass.CoursePlanLevelID
          })
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.modalDelClass = false
            this.huntingSubject = false
            this.getAllSelectList('')
          }
        } else {
          this.xy.msgError('请输入"删除"。')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
