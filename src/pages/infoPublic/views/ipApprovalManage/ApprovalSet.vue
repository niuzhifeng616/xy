<template>
  <div class="approval-set-wrap">
    <!-- 功能列表 -->
    <row>
      <div v-for="item in dataList" class="approve-box" :key="item.SettingCode">
        <img class="approve-bg" :src="item.img"/>
        <div class="approve-name">{{item.name}}</div>
        <div class="approve-icon-box">
          <img class="approve-icon" v-bind:src="item.img"/>
        </div>
        <div class="approve-btn">
          <Button v-if="item.openBtn === '1'" class="xy-primary" @click="OpenClick(item)">已开启</Button>
          <Button v-else class="xy-info" @click="CloseClick(item)">已关闭</Button>
        </div>
      </div>
    </row>
  </div>
</template>
<script>
  export default {
    name: 'ApprovalSet',
    data () {
      return {
        apiPath: '',
        datatable: [],
        imgList: [
          {
            imgLink: require('@/assets/infoPublic/news.png')
          },
          {
            imgLink: require('@/assets/infoPublic/video.png')
          },
          {
            imgLink: require('@/assets/infoPublic/notice.png')
          },
          {
            imgLink: require('@/assets/infoPublic/photo.png')
          },
          {
            imgLink: require('@/assets/infoPublic/welcome.png')
          },
          {
            imgLink: require('@/assets/infoPublic/welcome.png')
          }
        ],
        dataList: []
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.GetApproveSetting()
    },
    methods: {
      // 获取审批设置列表
      async GetApproveSetting () {
        let rs = await this.xy.get(this.apiPath + '/api/PublicTask/GetApproveSetting')
        if (rs.success) {
          this.datatable = rs.data.data
          let arr = []
          for (let i = 0; i < this.datatable.length; i++) {
            arr.push({
              id: this.datatable[i].SettingCode,
              name: this.datatable[i].SettingName,
              img: this.imgList[i].imgLink,
              openBtn: this.datatable[i].SettingValue
            })
          }
          this.dataList = arr
        }
      },

      // 已开启
      OpenClick (val) {
        this.$Modal.confirm({
          title: '关闭',
          content: '<p>您确认要关闭"' + val.name + '"审批吗？</p>',
          onOk: async () => {
            val.openBtn = 0
            let params = {
              SettingCode: val.id,
              SettingValue: String(val.openBtn)
            }
            let rs = await this.xy.post(this.apiPath + '/api/PublicTask/EditApproveSetting', params)
            if (rs.success) {
              this.xy.msgSuc('关闭成功。')
              this.GetApproveSetting()
            }
          },
          onCancel: function () {
          }
        })
      },

      // 已关闭
      async CloseClick (val) {
        val.openBtn = 1
        let params = {
          SettingCode: val.id,
          SettingValue: String(val.openBtn)
        }
        let rs = await this.xy.post(this.apiPath + '/api/PublicTask/EditApproveSetting', params)
        if (rs.success) {
          this.xy.msgSuc('开启成功。')
          this.GetApproveSetting()
        }
      }
    }
  }
</script>
<style lang="less" scpoed>
  .approve-box {
    width: 18%;
    height: 190px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(236, 238, 241, 1);
    box-shadow: 0px 3px 8px 0px rgba(196, 196, 196, 0.63);
    border-radius: 4px;
    margin: 10px 1%;
    position: relative;
    overflow: hidden;
    display: inline-block;
    transition: all 0.3s;
  }

  .approve-box:hover {
    transition: all 0.3s;
    box-shadow: 0px 3px 8px 0px rgba(54, 54, 54, 0.63);
  }

  .approve-box > .approve-bg {
    position: absolute;
    right: -11px;
    bottom: -26px;
    opacity: 0.1;
  }

  .approve-box > .approve-name {
    font-size: 18px;
    text-align: center;
    margin: 15px 0;
  }

  .approve-box > .approve-icon-box {
    width: 100%;
    text-align: center;
  }

  .approve-box > .approve-icon-box > .approve-icon {
    width: 50px;
    text-align: center;
  }

  .approve-box > .approve-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
</style>
