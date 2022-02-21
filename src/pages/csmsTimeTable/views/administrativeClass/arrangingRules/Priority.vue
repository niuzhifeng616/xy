
<template>
  <div id="arrangingRules">
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
                                <template v-for="(item,index) in classData">
                                    <li v-if="item.AMorPM != 'NS'"
                                        :key="index"
                                        :data-AMorPM="item.AMorPM"
                                        :data-AMorPMOrder="item.AMorPMOrder">
                                        <div class="nowrap" v-cloak style="width:90%">{{item.AMorPMOrderName}}</div>
                                        <Icon type="md-repeat" color="#4196FF" size="24" style="transform:rotate(90deg);" />
                                    </li>
                                </template>
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
                                <li v-for="(item,index) in subject"
                                    :key="index"
                                    :index="index"
                                    :data-SubjectID="item.SubjectID">
                                    <div class="nowrap" v-cloak style="width:90%">{{item.SubjectName}}</div>
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
    data () {
      return {
        StepsHeader: {},
        classPlan: {},
        classData: [],
        subject: []
      }
    },
    created () {
      this.StepsHeader = this.$parent.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      this.getClassPositionPriority()
      this.getSubjectPriority()
    },
    mounted () {
      if (this.StepsHeader.isOperation === 0) {
        $('#sortableClass').sortable()
        $('#sortableSubject').sortable()
        $('#sortableClass').sortable({// 课位优先级列表
          update: (event, ui) => {
            var postData = []
            $('#sortableClass li').each((i, item) => {
              postData.push({
                ClassTableID: this.classPlan.classTableID,
                AMorPM: $(item).attr('data-AMorPM'),
                AMorPMOrder: $(item).attr('data-AMorPMOrder')
              })
            })
            this.xy.loading()
            this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/EditClassPositionPriority`, postData).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.xy.msgSuc('调整成功。')
                this.getClassPositionPriority()
              }
            })
          }
        })
        $('#sortableSubject').sortable({// 课程优先级
          update: (event, ui) => {
            var subjects = []
            $('#sortableSubject li').each((i, item) => {
              subjects.push($(item).attr('data-SubjectID'))
            })
            this.xy.loading()
            this.xy.post(`${this.$store.state.apiPath}/api/GeneralRuleSetting/EditSubjectPriority`, {
              ClassTableID: this.classPlan.classTableID,
              Subjects: subjects
            }).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.getSubjectPriority()
              }
            })
          }
        })
      }
    },
    methods: {
      getClassPositionPriority () { // 课位优先级列表
        this.classData = []
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetClassPositionPriority`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.classData = res.data
          }
        })
      },
      getSubjectPriority () { // 课程优先级
        this.subject = []
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/GeneralRuleSetting/GetSubjectPriority`, {
          classTableID: this.classPlan.classTableID
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.subject = res.data
          }
        })
      }
    }

  }
</script>
<style lang='less' scoped>
@import '../../css/arrangingRules.less';
</style>
