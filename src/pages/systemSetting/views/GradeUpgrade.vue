// 学期管理
<template>
  <div class='xy-content-body'>
      <div style="width:668px;margin:auto;">
            <div class="title-describe" style="margin:88px 0 22px;display:block">
                今年已经完成学生年级升级
            </div>
            <div style="height:540px;
                background:rgba(255,255,255,1);
                padding:0 33px;
                color:#444;
                box-shadow:0px 4px 12px 0px rgba(167,167,167,0.4);
                border-radius:10px;">
                <h3 style="font-size:20px;font-weight:bold;color:#444;padding:47px 0 66px;text-align:center">自动升级时间</h3>
                <div style="margin-bottom:40px;">
                    <h6 style="margin-bottom:20px;">每年自动升级时间</h6>
                    <p>
                      <span style="color:#111;font-weight:bold;"> {{everyYear}}</span>
                      <span style="color:#4196FF;font-size:14px;margin-left:40px;cursor:pointer" @click="modalSetTime = true">
                        <Icon type="ios-create" />编辑
                      </span>
                    </p>
                </div>
                <div>
                    <h6 style="margin-bottom:20px;">允许升级的时间范围 </h6>
                    <p>
                        <span style="color:#111;font-weight:bold;">7月1日  00:00:00 - 8月31日  23:59:59</span>

                    </p>
                </div>
                <div class="text-center" style="margin-top:80px;">
                    <Button class="xy-primary" :disabled="!isManual" @click="manual">手动升级</Button>
                </div>
            </div>
        </div>
        <div style="position:absolute;bottom:35px;right:15px;">
            <img :src=" require('@/assets/base/image/GradeUpgrade1.png')" style="width:300px" />
        </div>
        <div style="position:absolute;bottom:80px;left:100px;">
            <img :src=" require('@/assets/base/image/GradeUpgrade2.png')" />
        </div>

        <Modal v-model="modalSetTime"
               :transfer="false">
            <p slot="header">修改时间</p>
            <div style="font-size:14px;">
                <div style="margin-bottom:15px">
                    <label style="line-height:40px" for="startTime">每年自动升级时间</label>
                    <DatePicker elementId="startTime"  type="date" v-model="startTime" placeholder="请选择日期"></DatePicker >
                </div>
                <!-- <div>
                    <label>结束时间</label>
                    <DatePicker  type="datetime" v-model="endTime" :options="options3" format="yyyy/MM/dd  HH:mm:ss" placeholder="请选择日期"></DatePicker >
                </div> -->
            </div>
            <div slot="footer">
                 <Button class="xy-modal-close" @click="modalSetTime = false" >取消</Button>
                <Button class="xy-modal-primary" shape="circle"  @click="editorTime">保存</Button>
            </div>
        </Modal>
        <Modal v-model="modalManual"
               :transfer="false">
            <p slot="header">手动升级操作</p>
            <div class="text-center" style="height:100px;">
                <p v-if="isBefore" style="font-weight:bold;color:#333;font-size:16px;padding-top:26px;">
                    点击确定后，本校学生将立刻统一升级，本年自动升级失效，
                    您确定要手动升级吗？
                </p>
                <!-- <div v-if="!isBefore" style="padding-top:26px;">
                    <p style="font-weight:bold;color:#444;font-size:16px;"> 手动升级成功</p>
                    <p style="color:#808080;font-size:14px;">今年的学生年级升级已完成。</p>
                </div> -->
            </div>
            <div slot="footer">
                <Button class="xy-modal-close" @click="modalManual = false" v-if="isBefore">取消</Button>
                <Button class="xy-modal-primary" shape="circle" @click="manualSubmit">保存</Button>
            </div>
        </Modal>
  </div>
</template>
<script>
  export default {
    name: 'subjectSet',
    data () {
      return {
        // 修改时间
        modalSetTime: false,
        options3: {
          disabledDate: function (date) {
            var myDate = new Date()
            var curYear = myDate.getFullYear()
            return (date.valueOf() > new Date(curYear + '-08-31 23:59:59').getTime()) || (date.valueOf() < new Date(curYear + '-07-01 00:00:00').getTime())
          }
        },
        startTime: '',
        endTime: '',
        everyYear: '',
        isManual: true,
        manualMsg: '',
        // 手动升级操作
        modalManual: false,
        isBefore: true
      }
    },
    created () {
      this.getUpgradeGradeStatus()
    },
    mounted () {
    },
    methods: {
      getUpgradeGradeStatus () {
        this.xy.loading()
        this.xy.get(`${this.xyApi}/base/api/SchoolDistrict/GetUpgradeGradeStatus`).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.everyYear = res.data.time
            this.isManual = res.data.status
            this.manualMsg = res.data.msg
          }
        })
      },
      // 修改每年升级时间
      editorTime () {
        this.xy.loading()
        this.xy.post(`${this.xyApi}/base/api/SchoolDistrict/UpdateUpgradeGradeTime`, {
          time: this.xy.moment(this.startTime).format('YYYY-MM-DD')
        }).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.modalSetTime = false
          }
        })
      },
      // 手动升级
      manual () {
        this.isBefore = true
        this.modalManual = true
      },
      manualSubmit () {
        this.xy.loading()
        this.xy.post(`${this.xyApi}/base/api/SchoolDistrict/UpgradeGrade`).then(res => {
          this.xy.unloading()
          if (res.success) {
            this.modalManual = false
            this.xy.msgSuc('手动升级成功。')
          }
        })
      }
    }
  }
</script>

<style lang='less' scoped>
.ivu-modal-confirm-head-title {
    margin: 0px;
    display: block;
}
.ivu-modal-confirm-body {
    padding-left: 0px;
    margin: 20px 20px 30px;
}
</style>
