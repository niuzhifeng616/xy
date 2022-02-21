<template>
  <div class="xy-content-body" ref= "xycHeight">
    <div class="notice-box">
      <div class="left-notice">
        <div style='margin:20px auto;'>
          <XyAntTable
            :columns="columns1"
            :scrollx="'max-content'"
            :dataSource="datatable"
            nullData="该搜索条件下没有结果。"
            :tableLoading="tableLoading"
            :isPage="false">
            <!-- 头像 -->
            <div slot="IconRender" slot-scope="text, record">
              <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
                <span class="head-font">
                  {{ xy.showName(record.SourceTeacherName)}}
                </span>
              </div>
              <img style="width:30px;height:30px;border-radius:50%" v-else :src="record.Icon + '?' + Math.random() * 15">
            </div>
            <!-- 教师姓名 -->
            <div slot="SourceTeacherNameRender" slot-scope="text, record" style="min-width:140px">
              <span>
                {{record.SourceTeacherName}}
              </span>
            </div>
            <div slot="SourceSubjectNameRender" slot-scope="text, record" style="min-width:140px">
              <span>
                {{record.SourceSubjectName}}
              </span>
            </div>
            <div slot="StudentOrganizationFullName" slot-scope="text, record" style="min-width:140px">
              <span>
                {{record.StudentOrganizationFullName}}
              </span>
            </div>
            <div slot="SourceDayRender" slot-scope="text, record" style="min-width:200px">
              <span>
                {{record.SourceDay}}
              </span>
            </div>
            <div slot="TargetDayRender" slot-scope="text, record" style="min-width:200px">
              <span>
                {{record.TargetDay}}
              </span>
            </div>
          </XyAntTable>
        </div>
          <!-- <div class="notice-list" v-for="item in datatable" :key="item">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                  <div>
                      <span style="font-size:15px;color:#2E2E2E;font-weight:bold;" v-cloak>{{item.StudentOrganizationFullName}}</span>
                      <span class="notice-subject" v-if="item.SourceTeacherName!=null&&item.SourceTeacherName !=''" v-cloak>
                          {{item.SourceTeacherName}}
                      </span>
                      <span class="notice-subject" v-if="item.SourceSubjectName!=null&&item.SourceSubjectName !=''" v-cloak>
                          {{item.SourceSubjectName}}
                      </span>
                  </div>
                  <div class="notice-week" v-cloak>有效{{notifyInfoData.EffectiveWeek}}周</div>
              </div>
              <div style="display:flex;justify-content:flex-start;">
                  <div>
                      <span class="notice-point" style="background:#89BAF7"></span>
                      <span class="notice-time" style="color:#666">原上课日期/节次</span>
                      <span style="color:#666" v-cloak>{{item.SourceDate}}</span>
                      <span style="color:#666;margin:0 10px;" v-cloak>({{item.SourceWeek}})</span>
                      <span style="color:#666" v-cloak>{{item.SourceTime}}</span>
                  </div>
                  <div style="margin-left:32px;">
                      <span class="notice-point" style="background:#E47878"></span>
                      <span class="notice-time" style="color:#333">新上课日期/节次</span>
                      <span style="color:#666" v-cloak>{{item.TargetDate}}</span>
                      <span style="color:#666;margin:0 10px;" v-cloak>({{item.TargetWeek}})</span>
                      <span style="color:#666" v-cloak>{{item.TargetTime}}</span>
                  </div>
              </div>
          </div> -->
      </div>
      <div class="xycontent" :style= "{height:xycheight}"></div>
      <div class="right-notice">
          <h3 style="font-size:18px;font-weight:bold;margin-top:20px;margin-left:20px;color:#444">调课人信息</h3>
          <div style="display:flex;align-items:center;margin-left:20px;margin-top:20px;">
              <div class="notice-ajust-person">{{notifyInfoData.substrName}}</div>
              <div style="margin-left:10px;text-align:left">
                  <div v-cloak>{{notifyInfoData.FullName}}</div>
                  <div v-cloak style="color:#666666;">调课时间：{{notifyInfoData.Date}}</div>
              </div>
          </div>
          <div>
              <Input v-model="adjustmentReason"
                        :disabled="isShowReason"
                        style="width:280px;margin-top:20px;margin-left:20px;"
                        type="textarea" :rows="7"
                        placeholder="请填写调课原因"/>
          </div>
          <div class="text-left" style="margin:20px;">
              <Checkbox v-model="isExport">导出调课单</Checkbox>
              <Checkbox style="margin-left:24px;" v-model="isOnlineNotice">在线通知</Checkbox>
          </div>
      </div>
    </div>
    <div class="text-center">
        <Button class="xy-btn-close"  @click="back">取消</Button>
        <Button class="xy-btn-primary" shape="circle" @click="addClassNotice">确定</Button>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'

  export default {
    components: { XyAntTable },
    data () {
      return {
        classTableGenerateForStudentOrganizationID: 0,
        tableLoading: true,
        columns1: [
          {
            title: ' ',
            dataIndex: 'Icon',
            scopedSlots: { customRender: 'IconRender' },
            className: 'table-pic',
            width: 18
          },
          {
            title: '教师姓名',
            dataIndex: 'SourceTeacherName',
            scopedSlots: { customRender: 'SourceTeacherNameRender' }
          },
          {
            title: '课程名称',
            dataIndex: 'SourceSubjectName',
            scopedSlots: { customRender: 'SourceSubjectNameRender' }
          },
          {
            title: '班级',
            dataIndex: 'StudentOrganizationFullName',
            scopedSlots: { customRender: 'StudentOrganizationFullName' }
          },
          {
            title: '原上课日期·节次',
            dataIndex: 'SourceDay',
            scopedSlots: { customRender: 'SourceDayRender' }
          },
          {
            title: '新上课日期·节次',
            dataIndex: 'TargetDay',
            scopedSlots: { customRender: 'TargetDayRender' }
          }
          // ,
          // {
          //   title: '有效时长',
          //   minWidth: 100,
          //
          //   tooltip: true,
          //   key: 'notifyInfoData'
          // }
        ],
        datatable: [],
        headportrait: [],
        notifyInfoData: [],
        adjustmentReason: '',
        xycheight: 0,
        isShowReason: true,
        isNotice: true,
        isExport: true, // 导出调课单
        isOnlineNotice: true // 在线通知
      }
    },
    created () {
      this.classTableGenerateForStudentOrganizationID = this.$route.query.classTableGenerateForStudentOrganizationID
      this.getNotifyInfo()
      window.addEventListener('resize', this.getHeight)
      // this.getHeight()
    },
    mounted: function () {
      this.getHeight()
    },
    methods: {
      back: function () {
        this.$store.commit('common/getThreeMenuName', '')
        this.$router.push({ path: '/xyhome/adjustmentTable', query: this.$store.state.common.menuInfo })
      },
      getNotifyInfo () {
        this.tableLoading = true
        this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/GetNotifyInfo`, {
          classTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID
        }).then(res => {
          if (res.success) {
            if (res.data.Description === null || res.data.Description === '') {
              this.isShowReason = false
            } else {
              this.adjustmentReason = res.data.Description
            }
            this.notifyInfoData = res.data
            this.$set(this.notifyInfoData, 'substrName', this.notifyInfoData.FullName.substr(0, 1))
            console.log(this.notifyInfoData.EffectiveWeek)
            var anum = 1
            for (let i = 0; i < res.data.list.length; i++) {
              res.data.list[i].notifyInfoData = res.data.EffectiveWeek
              if (anum === 1) {
                this.headportrait.push({ headportrait: true })
                anum++
              } else if (anum === 2) {
                this.headportrait.push({ headportraits: true })
                anum++
              } else if (anum === 3) {
                this.headportrait.push({ headportraites: true })
                anum = 1
              }
            }
            this.datatable = res.data.list
            console.log(this.screeHeight)
          }
          this.tableLoading = false
        })
      },
      // 调课通知
      addClassNotice () {
        if (this.isShowReason) {
          if (this.isExport) {
            this.expert()
          }
          if (this.isOnlineNotice) {
            this.notify()
          }
          this.back()
        } else {
          if (this.adjustmentReason === '') {
            this.xy.msgError('请填写调课原因。')
            return false
          };
          if (this.adjustmentReason.length > 20) {
            this.xy.msgError('调课原因限制20字符。')
            return false
          };
          this.xy.loading()
          this.xy.post(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/EditDescription`, {
            ClassTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID,
            Description: this.adjustmentReason
          }).then(res => {
            this.xy.unloading()
            if (res.success) {
              if (this.isExport) {
                this.expert()
              }
              if (this.isOnlineNotice) {
                this.notify()
              }
              this.back()
            }
          })
        }
      },
      notify () {
        this.xy.loading()
        this.xy.get(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/Notify`, {
          classTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID,
          description: this.adjustmentReason
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.xy.msgSuc('通知发送成功。')
          }
        })
      },
      expert () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/ClassTableGenerateForStudentOrganization/ExportNotity`, {
          classTableGenerateForStudentOrganizationID: this.classTableGenerateForStudentOrganizationID,
          description: this.adjustmentReason,
          sendOnline: false
        }, function (res) {})
      },
      getHeight () {
        // this.screeHeight.height = window.innerHeight - 144 + 'px'
        this.xycheight = this.$refs.xycHeight.offsetHeight + 'px'
        console.log(this.screeHeight)
      }
    }
  }
</script>
<style lang="less" scoped>
.notice-box {
    width:inherit;
    min-height:100%;
    margin: 10px 10px;
    // border: 1px solid rgba(226,226,226,1);
    border-radius: 6px;
    display:flex;
    justify-content:flex-start;
}
.left-notice {
    width:100%;
    // border-right: 1px solid #E2E2E2;
}
.notice-list {
    margin: 21px 0 13px 35px;
    width: 908px;
    height: 96px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(241,241,241,1);
    border-radius: 6px;
    padding:23px 19px 22px 28px;
}
.notice-subject {
    height: 25px;
    background: #F5F5F5;
    border-radius: 4px;
    text-align: center;
    padding: 4px 14px;
    color: #333333;
    display:inline-block;
    margin:0 10px;
}
.notice-week {
    width: 86px;
    height: 25px;
    line-height:25px;
    background: rgba(237,250,232,1);
    border-radius: 4px;
    text-align: center;
    color: #2E901A;
}
.notice-point {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display:inline-block;
}
.notice-time {
    color: #999999;
    margin-left: 8px;
    display:inline-block;
    margin-left:4px;
    margin-right:8px;
}
.xycontent{
  border:1px solid rgba(0,0,0,0.09);
}
.right-notice{
    // text-align:center;
    width:400px;
    min-height: 100%;
    // border-left: 1px solid #E2E2E2;
}
.notice-ajust-person {
    width: 42px;
    height: 42px;
    line-height: 42px;
    background: rgba(65,150,255,1);
    border-radius: 50%;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    text-align: center;
}
.text-center{
    height: 50px;
    position: fixed;
    line-height: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 4px 0px rgba(163, 173, 186, 0.4);
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: right;
}
// .xy-btn-close{
//   position: absolute;
//   top:12px;
//   right:200px;
// }
// .xy-btn-primary{
//   position: absolute;
//   top:12px;
//   right:70px;
// }

</style>
<style lang="less">
  .headportrait{
   background: rgba(77,182,172,1)!important;
}
.headportraits{
  background:rgba(65,150,255,1)!important ;
}
.headportraites{
  background:rgba(255,129,172,1)!important ;
}
</style>
