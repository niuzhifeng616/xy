<template>
  <!-- 分层选课:去选课 -->
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div class="layered-header">
        <div>
          <span class="header1">{{obj.ClassTableName}}</span>
          <span v-if="subjectData.IsAllowHelpDocument">
            <Icon type="ios-help-circle-outline" color="#4196FF" size="16" />
            <span class="header2">帮助文档</span>
          </span>
        </div>
        <Button class="xy-primary" @click="clearAll">清空选课</Button>
      </div>
      <div class="layered-instruction">
        <p class="col0-65">
          <span>选课时间: {{obj.FormalChoseStartDate}} - {{obj.FormalChoseEndDate}}</span>
          <span>本次选课最少选{{subjectData.MinOptionalCourse}}门，最多选{{subjectData.MaxOptionalCourse}}门。</span>
        </p>
        <Alert show-icon closable style="margin-top: 10px;">选课说明:{{subjectData.SelectCourseExplain}}</Alert>
      </div>
      <div class="layered-body">
        <div v-if="subjectData.List.length>0">
          <div v-for="subGroup in subjectData.List"
                :key="subGroup.SubjectGroupID"
                style="margin-bottom:10px;">
            <div>
              <span style="font-weight:bold;color:#000;">{{subGroup.SubjectGroupName}}</span>
              <span class="col0-65">
                本组选课最少选{{subGroup.MinSubjectNum}}门，最多选{{subGroup.MaxSubjectNum}}门。
              </span>
            </div>
            <ul class="subject-ul">
              <li
                class="subject-box"
                @click="subClick(item)"
                :class="item.IsSelected?'subject-box-active':''"
                v-for="item in subGroup.Courses"
                :key="item.CoursePlanID">
                <div>
                  <p class="col0-85 f16" style="font-weight:bold;">
                    {{item.SubjectName}}
                  </p>
                  <p v-if="subjectData.IsAllowViewNumber" class="col0-45 mt-15">
                    已选{{item.SelectCount}}人
                  </p>
                </div>
                <div>
                  <img :src="require('@/assets/onlineCourseSelection/layered.png')"
                    style="width:39px;height:45px;" />
                </div>
                <div class="select-icon" v-if="item.IsSelected">
                  <Icon type="ios-checkmark" color="#fff" size="22" />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="subjectData.List.length==0" class="no-data-box">
          <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
          <span class="no-data-text">暂无相关课程。</span>
        </div>
      </div>
      <div class="layered-fotter">
        <Button class="xy-btn-close" @click="backResult">取消</Button>
        <Button class="xy-btn-primary" shape="circle" @click="subjectModal=true">提交</Button>
      </div>

      <Modal
        v-model="subjectModal"
        :transfer="false"
        title="确认选择课程"
        :mask-closable="false"
        width="635">
        <div>
          <div v-for="subGroup in subjectData.List" :key="subGroup.SubjectGroupID" style="margin-bottom:10px;">
            <ul class="subject-ul">
              <li class="subject-box"
                    v-for="item in subGroup.Courses"
                    :key="item.CoursePlanID"
                    v-show="item.IsSelected">
                <div>
                  <p style="font-size:16px;color:#333;font-weight:bold;">{{item.SubjectName}}</p>
                </div>
                <div>
                  <img :src="require('@/assets/onlineCourseSelection/layered.png')" style="width:40px;height:46px;" />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="subjectModal = false">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="complete">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'OnlineChooseCourseLayered',
    components: {},
    data () {
      return {
        obj: null,
        classTableID: 0,
        subjectData: {
          List: []
        },
        subjectModal: false,
        ServiceUrl: ''
      }
    },
    created () {
      this.ServiceUrl = this.$store.state.apiPath
      if (this.$store.state.common.msgParam !== '') {
        // 消息列表传过来的值
        var info = JSON.parse(this.$store.state.common.msgParam) // ?? 添加消息数据后调试
        this.obj = JSON.parse(info.DetailParameter)
        this.classTableID = this.obj.ClassTableID
        this.ServiceUrl = info.ServiceDoMainName
      } else {
        this.obj = this.$store.state.csmstimetable.onlineChooseCourseLayeredItem
        this.classTableID = this.obj.ClassTableID
      }
    },
    mounted () {
      this.getLayeredSelectCourseList()
    },
    methods: {
      // 获取课程
      async getLayeredSelectCourseList () {
        this.xy.loading()
        let res = await this.xy.get(`${this.ServiceUrl}/api/StudentOnLineSelectCourse/GetLayeredSelectCourseList`, { ClassTableID: this.classTableID, collectionID: this.obj.CollectionID })
        this.xy.unloading()
        if (res.success) {
          this.subjectData = res.data
        }
      },
      // 选课
      subClick (val) {
        if (val.IsSelected) { // 取消
          this.xy.loading()
          let params = {
            ClassTableID: this.classTableID,
            CollectionID: this.obj.CollectionID,
            CoursePlanID: val.CoursePlanID,
            SubjectID: val.SubjectID,
            AID: val.AID,
            Type: val.Type
          }
          this.xy.post(`${this.ServiceUrl}/api/StudentOnLineSelectCourse/LayeredUnSelectCourse`, params).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.getLayeredSelectCourseList()
            }
          })
        } else { // 选中
          this.xy.loading()
          let params = {
            ClassTableID: this.classTableID,
            CollectionID: this.obj.CollectionID,
            CoursePlanID: val.CoursePlanID,
            SubjectID: val.SubjectID,
            AID: val.AID,
            Type: val.Type
          }
          this.xy.post(`${this.ServiceUrl}/api/StudentOnLineSelectCourse/LayeredSelectCourse`, params).then(res => {
            this.xy.unloading()
            if (res.success) {
              this.getLayeredSelectCourseList()
            }
          })
        }
      },
      // 清空选课
      clearAll () {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '<p>您确定要清空选课吗？</p>',
          onOk: () => {
            this.xy.loading()
            let params = {
              ClassTableID: this.classTableID,
              CollectionID: this.obj.CollectionID
            }
            this.xy.post(`${this.ServiceUrl}/api/StudentOnLineSelectCourse/LayeredClearSelectCourse`, params).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.xy.msgSuc('清空成功。')
                this.getLayeredSelectCourseList()
              }
            })
          }
        })
      },
      // 完成选课
      complete () {
        this.xy.loading()
        let params = {
          ClassTableID: this.classTableID,
          CollectionID: this.obj.CollectionID
        }
        this.xy.post(`${this.ServiceUrl}/api/StudentOnLineSelectCourse/LayeredSelectCourseComplete`, params).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('选课成功。')
            this.backResult()
          }
        })
      },
      // 返回选课结果页面
      backResult () {
        this.$router.back()
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../css/layered.css';
</style>
