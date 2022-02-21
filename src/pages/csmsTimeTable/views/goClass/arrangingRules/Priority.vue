<template>
  <!-- 5.排课规则-优先级设置-->
  <div>
    <div class="priority-rule">
      <div class="priority-content clearfix">
        <row>
          <i-col span="12">
            <div class="priority-box fr" style="margin-right:146px">
              <div class="priority-title">调整课位优先级</div>
              <div class="clearfix" style="display:flex;justify-content:flex-end" v-show="classData.length>0">
                <div class="priority-level pr">
                  <p class="priority-level-gao">高</p>
                  <p class="priority-level-di">低</p>
                </div>
                <ul class="priority-ul" id="sortableClass">
                  <li v-for="(item,index) in classData" :key="index" v-show="item.AMorPM !== 'NS'"
                    :data-AMorPM="item.AMorPM" :data-AMorPMOrder="item.AMorPMOrder">
                    <div class="nowrap" style="width:90%">{{item.AMorPMOrderName}}</div>
                    <Icon type="md-repeat" color="#4196FF" size="24" style="transform:rotate(90deg);" />
                  </li>
                </ul>
              </div>
            </div>
          </i-col>
          <i-col span="12">
            <div class="priority-box fl" style="margin-left:146px">
              <div class="priority-title">调整课程优先级</div>
              <div class="clearfix" style="display:flex;justify-content:flex-start" v-show="subject.length>0">
                <div class="priority-level pr">
                  <p class="priority-level-gao">高</p>
                  <p class="priority-level-di">低</p>
                </div>
                <ul class="priority-ul" id="sortableSubject">
                  <li v-for="(item,index) in subject" :key="index" :index="index"
                    :data-SubjectID="item.SubjectID">
                    <div class="nowrap" style="width:90%">{{item.SubjectName}}</div>
                    <Icon type="md-repeat" color="#4196FF" size="24" style="transform:rotate(90deg);" />
                  </li>
                </ul>
              </div>
            </div>
          </i-col>
        </row>
      </div>
    </div>

  </div>
</template>
<script>
  import 'jquery-ui/ui/widgets/sortable'
  export default {
    name: 'Priority',
    data () {
      return {
        isOperation: this.$store.state.csmstimetable.classComValKW.base.isOperation,
        classTableID: this.$store.state.csmstimetable.classComValKW.new.classTableID,
        classData: [],
        subject: []
      }
    },
    created () {
    },
    mounted () {
      let that = this
      if (that.isOperation === 0) {
        $('#sortableClass').sortable()
        $('#sortableSubject').sortable()
        $('#sortableClass').sortable({// 课位优先级列表
          async update (event, ui) {
            let postData = []
            $('#sortableClass li').each((i, item) => {
              postData.push({
                ClassTableID: that.classTableID,
                AMorPM: $(item).attr('data-AMorPM'),
                AMorPMOrder: $(item).attr('data-AMorPMOrder')
              })
            })
            that.xy.loading()
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/GeneralRuleSetting/EditClassPositionPriority`, postData, true)
            if (res.success) {
              that.xy.msgSuc('调整成功。')
              that.getClassPositionPriority()
            } else {
              that.xy.unloading()
              that.xy.msgError(res.msg)
            }
          }
        })
        $('#sortableSubject').sortable({// 课程优先级
          async update (event, ui) {
            let subjects = []
            $('#sortableSubject li').each((i, item) => {
              subjects.push($(item).attr('data-SubjectID'))
            })
            let params = {
              ClassTableID: that.classTableID,
              Subjects: subjects
            }
            that.xy.loading()
            let res = await that.xy.post(`${that.$store.state.apiPath}/api/GeneralRuleSetting/EditSubjectPriority`, params, true)
            that.xy.unloading()
            if (res.success) {
              that.xy.msgSuc('调整成功。')
              that.getSubjectPriority()
            } else {
              that.xy.unloading()
              that.xy.msgError(res.msg)
            }
          }
        })
      }
      this.getClassPositionPriority()
      this.getSubjectPriority()
    },
    methods: {
      async getClassPositionPriority () { // 课位优先级列表
        this.classData = []
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetClassPositionPriority`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.classData = res.data
        }
      },
      async getSubjectPriority () { // 课程优先级
        this.subject = []
        let params = {
          classTableID: this.classTableID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetSubjectPriority`, params, true)
        this.xy.unloading()
        if (res.success) {
          this.subject = res.data
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../css/arrangingRules.less';
</style>
