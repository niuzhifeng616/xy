<template>
<!-- 12.选课结果-查看剩余班额 -->
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
                <th>
                    <span>剩余班额</span>
                    <i class="fa fa-long-arrow-up downUp" :class="downUp === 'NoSelAsc'?'i-active':''"  @click="downOrUp('NoSelAsc')"></i>
                    <i class="fa fa-long-arrow-down downUp" :class="downUp === 'NoSelDesc'?'i-active':''"  @click="downOrUp('NoSelDesc')"></i>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(course, index) in dataTable" :key="index">
                <td >{{course.SubjectCategoryName}}</td>
                <td >{{course.SubjectName}}</td>
                <td >{{course.TeacherNames}}</td>
                <td >{{course.StudentLimitation}}</td>
                <td >{{course.SelEndStudentCount}}</td>
                <td >{{course.NoSelEndStudentCount}}</td>
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
  </div>
</template>
<script>
  export default {
    name: 'TLcourseSeleResultRC',
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
        downUp: ''
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
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
