<template>
  <!-- 11.选课时间 -->
  <div class="xy-content-body">
      <div class="data-content">
          <div style="width:600px;margin:0 auto;">
              <h1 class="time-text">选课时间</h1>
              <Form ref="formValidate" :label-width="100">
                  <FormItem label="开始时间" label-for="FormalChoseStartDate">
                      <date-picker type="datetime"
                                  format="yyyy-MM-dd HH:mm"
                                  @on-change = "startDate"
                                  v-model="dataTable.FormalChoseStartDate"
                                  element-id="FormalChoseStartDate"
                                  placeholder="请选择开始时间"
                                  style="width: 300px" :editable="false"></date-picker>
                  </FormItem>
                  <FormItem label="结束时间" label-for="FormalChoseEndDate">
                      <date-picker type="datetime"
                                  format="yyyy-MM-dd HH:mm"
                                  @on-change = "endDate"
                                  v-model="dataTable.FormalChoseEndDate"
                                  element-id="FormalChoseEndDate"
                                  placeholder="请选择结束时间" style="width: 300px" :editable="false"></date-picker>
                  </FormItem>
                  <FormItem label="">
                      <checkbox v-model="dataTable.IsAllowReselection" style="font-size:14px">不允许重选（选课时间内提交选课后，不可重选再次提交。）</checkbox>
                  </FormItem>
                  <FormItem label="">
                      <checkbox v-model="dataTable.IsSubjectDescription" style="font-size:14px">选课期间允许查看课程介绍</checkbox>
                  </FormItem>
                  <FormItem label="">
                      <checkbox v-model="dataTable.IsOnlyShowCourseName" style="font-size:14px">只开一个班的课也要显示班名</checkbox>
                  </FormItem>
              </Form>
              <h1 class="time-text">预览时间</h1>
              <Form ref="formValidate" :label-width="100">
                  <FormItem label="开始时间" label-for="SubjectDescriptionStartDate">
                      <date-picker type="datetime"
                                  format="yyyy-MM-dd HH:mm"
                                  @on-change = "startDateV"
                                  v-model="dataTable.SubjectDescriptionStartDate"
                                  element-id="SubjectDescriptionStartDate"
                                  placeholder="请选择开始时间" style="width: 300px" :editable="false"></date-picker>
                  </FormItem>
                  <FormItem label="结束时间" label-for="SubjectDescriptionEndDate">
                      <date-picker type="datetime"
                                  format="yyyy-MM-dd HH:mm"
                                  @on-change = "endDateV"
                                  v-model="dataTable.SubjectDescriptionEndDate"
                                  element-id="SubjectDescriptionEndDate"
                                  placeholder="请选择结束时间" style="width: 300px" :editable="false"></date-picker>
                  </FormItem>
                  <!--<FormItem label="选课模式">
                      <radio-group v-model="dataTable.SelectCourseMode" @on-change="radioChange">
                          <radio label="0">
                              <span>列表模式</span>
                          </radio>
                          <radio label="1">
                              <span>分组模式</span>
                          </radio>
                      </radio-group>
                  </FormItem>-->
                  <FormItem label="选课要求" id="requirements">
                    <editor ref="editor" v-model="editorContent" :disabled="editorDisabled" />
                    <div v-if="false" style="margin-top:20px;">
                        <Button class="xy-primary" @click="clear">清空内容</Button>
                        <Button class="xy-danger" @click="disabled = !editorDisabled">禁用/启用</Button>
                    </div>
                  </FormItem>
              </Form>
          </div>
          <div style="width: 600px; margin: 20px auto 0; padding-left: 100px;">
              <Button class="xy-btn-primary" shape="circle" @click="submintData" :disabled="isOperation !== 0">保存</Button>
          </div>
      </div>
  </div>
</template>
<script>
  import Editor from '@/components/editor/Editor.vue'

  export default {
    name: 'TLCourseSelectionTime',
    components: {
      Editor
    },
    data () {
      return {
        editorDisabled: false,
        editorContent: '',

        dataTable: [],

        isOperation: true,
        classTableID: 0
      }
    },
    created () {
      this.isOperation = this.$parent.isOperation
      this.classTableID = this.$parent.rowObj.ClassTableID
    },
    mounted () {
      this.getTp()
    },
    methods: {
      // 清空内容
      clear () {
        this.$refs.editor.clear()
      },
      // 获取数据
      async getTp () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SchoolBasedGrabSelectCourseSetting/GetSetting`, {
          classTableID: this.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          var resData = res.data
          this.dataTable = resData
          this.editorContent = this.dataTable.OnLineSelectCourseRequirement

          this.$nextTick(() => {
            this.dataTable.FormalChoseStartDate = (this.dataTable.FormalChoseStartDate === null || this.dataTable.FormalChoseStartDate === '') ? '0001/1/1' : this.xy.moment(this.dataTable.FormalChoseStartDate).format('YYYY-MM-DD HH:mm')
            this.dataTable.FormalChoseEndDate = (this.dataTable.FormalChoseEndDate === null || this.dataTable.FormalChoseEndDate === '') ? '0001/1/1' : this.xy.moment(this.dataTable.FormalChoseEndDate).format('YYYY-MM-DD HH:mm')
            this.dataTable.SubjectDescriptionStartDate = (this.dataTable.SubjectDescriptionStartDate === null || this.dataTable.SubjectDescriptionStartDate === '') ? '0001/1/1' : this.xy.moment(this.dataTable.SubjectDescriptionStartDate).format('YYYY-MM-DD HH:mm')
            this.dataTable.SubjectDescriptionEndDate = (this.dataTable.SubjectDescriptionEndDate === null || this.dataTable.SubjectDescriptionEndDate === '') ? '0001/1/1' : this.xy.moment(this.dataTable.SubjectDescriptionEndDate).format('YYYY-MM-DD HH:mm')
          })
        }
      },

      startDate (val) {
        if (val !== '') {
          this.dataTable.FormalChoseStartDate = this.xy.moment(val).format('YYYY-MM-DD HH:mm')
        } else {
          this.dataTable.FormalChoseStartDate = '0001/1/1' // 接口暂不修改，时间为空临时传'0001/1/1'
        }
      },
      endDate (val) {
        if (val !== '') {
          this.dataTable.FormalChoseEndDate = this.xy.moment(val).format('YYYY-MM-DD HH:mm')
        } else {
          this.dataTable.FormalChoseEndDate = '0001/1/1'
        }
      },
      startDateV (val) {
        if (val !== '') {
          this.dataTable.SubjectDescriptionStartDate = this.xy.moment(val).format('YYYY-MM-DD HH:mm')
        } else {
          this.dataTable.SubjectDescriptionStartDate = '0001/1/1'
        }
      },
      endDateV (val) {
        if (val !== '') {
          this.dataTable.SubjectDescriptionEndDate = this.xy.moment(val).format('YYYY-MM-DD HH:mm')
        } else {
          this.dataTable.SubjectDescriptionEndDate = '0001/1/1'
        }
      },
      //
      submintData () {
        if (this.dataTable.FormalChoseEndDate instanceof Date) {
          this.dataTable.FormalChoseEndDate = this.xy.moment(this.dataTable.FormalChoseEndDate).format('YYYY-MM-DD HH:mm')
        }
        if (this.dataTable.FormalChoseStartDate instanceof Date) {
          this.dataTable.FormalChoseStartDate = this.xy.moment(this.dataTable.FormalChoseStartDate).format('YYYY-MM-DD HH:mm')
        }
        if (this.dataTable.SubjectDescriptionEndDate instanceof Date) {
          this.dataTable.SubjectDescriptionEndDate = this.xy.moment(this.dataTable.SubjectDescriptionEndDate).format('YYYY-MM-DD HH:mm')
        }
        if (this.dataTable.SubjectDescriptionStartDate instanceof Date) {
          this.dataTable.SubjectDescriptionStartDate = this.xy.moment(this.dataTable.SubjectDescriptionStartDate).format('YYYY-MM-DD HH:mm')
        }
        if (this.isOperation === 0) {
          if (this.dataTable.FormalChoseEndDate !== '0001/1/1' && this.dataTable.FormalChoseStartDate === '0001/1/1') { // 选课时间
            this.xy.msgError('请选择选课开始时间。')
            return false
          } else if (this.dataTable.FormalChoseStartDate !== '0001/1/1' && this.dataTable.FormalChoseEndDate === '0001/1/1') {
            this.xy.msgError('请选择选课结束时间。')
            return false
          } else if (
            this.dataTable.FormalChoseStartDate !== '0001/1/1' && this.dataTable.FormalChoseEndDate !== '0001/1/1' &&
            this.dataTable.FormalChoseEndDate < this.dataTable.FormalChoseStartDate) {
            this.xy.msgError('选课结束时间不能小于选课开始时间。')
            return false
          } else if (
            this.dataTable.SubjectDescriptionEndDate !== '0001/1/1' && this.dataTable.SubjectDescriptionStartDate === '0001/1/1') { // 预览时间
            this.xy.msgError('请选择预览开始时间。')
            return false
          } else if (
            this.dataTable.SubjectDescriptionStartDate !== '0001/1/1' && this.dataTable.SubjectDescriptionEndDate === '0001/1/1') {
            this.xy.msgError('请选择预览结束时间。')
            return false
          } else if (
            this.dataTable.SubjectDescriptionStartDate !== '0001/1/1' &&
            this.dataTable.SubjectDescriptionEndDate !== '0001/1/1' &&
            this.dataTable.SubjectDescriptionEndDate < this.dataTable.SubjectDescriptionStartDate) {
            this.xy.msgError('预览结束时间不能小于预览开始时间。')
            return false
          } else if (
            this.dataTable.SubjectDescriptionEndDate !== '0001/1/1' &&
            this.dataTable.FormalChoseStartDate !== '0001/1/1' &&
            this.dataTable.SubjectDescriptionEndDate > this.dataTable.FormalChoseStartDate) {
            this.xy.msgError('预览结束时间不能大于选课开始时间。')
            return false
          } else {
            this.dataTable.OnLineSelectCourseRequirement = this.editorContent === null ? '' : this.editorContent
            this.dataTable.ClassTableID = this.classTableID
            this.undateFun()
          }
        }
      },
      async undateFun () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SchoolBasedGrabSelectCourseSetting/Update`, this.dataTable)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('保存成功。')
          this.$parent.getGeneralFlows()
        }
      },
      //
      radioChange () {
      }
    }
  }
</script>
<style lang="less" scoped>
.ivu-form-item{
    margin-bottom: 10px !important;
}
.time-text{
    font-weight:bold;
    font-size:16px;
    margin-bottom:15px;
    margin-left: 25px;
}
#requirements label{
    font-size: 16px;
    font-weight: bolder;
    text-align: left;
    color: black
}
</style>
