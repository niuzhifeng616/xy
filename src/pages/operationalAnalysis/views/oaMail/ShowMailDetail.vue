<!-- 消息详情 -->
<template>
  <div class="mail-main">
    <div class="mail-topbox">
      <span class="mail-tit clearfix" v-cloak>
        {{MessageTitle}}
      </span>
      <span class="mail-info" v-cloak>
        <span v-cloak>
          {{info.CreateByDate}}
        </span>
        <span v-cloak>
          发送者：{{info.SenderName}}
        </span>
      </span>
    </div>
    <div class="mail-cont" v-cloak>
      <div class="mail-list" v-for="(item,index) in mainList" :key='index'>
        <p v-if="item.Type == 1" v-cloak class="work-break-wrap">{{item.Content}}</p>
        <img v-if="item.Type == 2" :src="'http://qa.base.xiaoyangedu.net:7000'+item.Content" style="width:100%;" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        mInfo: false,
        info: '',
        mainList: [],
        type: '',
        urlPath: '',
        MessageID: 0,
        MessageTitle: ''
      }
    },
    computed: {
      params () {
        return this.$store.state.common.menuInfo
      }
    },
    created: function () {
      console.log(this.params.MessageModel, this.params.type)
      this.mInfo = true
      this.info = this.params.MessageModel
      this.type = this.params.type
      // type 0  消息列表传过来的值,
      // type 1  站内信传来的值
      if (this.type === 0) {
        this.urlPath = this.info.ServiceDoMainName
        this.MessageID = this.info.BusinessID
        this.MessageTitle = this.info.Subject
      } else {
        // this.urlPath = xy.subMenuServiceUrl
        this.urlPath = 'http://qa.api.oa.xiaoyangedu.net:37200'
        this.MessageID = this.info.MessageID
        this.MessageTitle = this.info.MessageTitle
      }
      this.GetMessageContentByID()
    },
    // watch: {
    //   mInfo: {
    //     handler: function (newValue, oldValue) {
    //       this.bus.$emit('mInfo', newValue)
    //     },
    //     deep: true
    //   }
    // },
    mounted: function () {
    },
    methods: {
      GetMessageContentByID: function () {
        this.xy.loading()
        let _this = this
        this.xy.get(`${this.urlPath}/api/OAMessage/GetMessageContentByID`, {
          MessageID: _this.MessageID
        }).then(res => {
          if (res.success) {
            _this.mainList = res.data
            this.xy.unloading()
          } else {
            this.xy.unloading()
          };
        })
      }
    }
  }
</script>
<style lang='less' scoped>
.mail-main > .mail-topbox {
    text-align: center;
    border-bottom: 1px solid #f1f1f1;
    height: 130px;
    overflow: hidden;
}

    .mail-main > .mail-topbox > .mail-tit {
        font-size: 20px;
        font-weight: bold;
        margin: 38px auto 20px;
        display: block;
        width: 700px;
        text-align: center;
    }

    .mail-main > .mail-topbox > .mail-info {
        font-size: 14px;
        font-weight: 400;
        color: rgba(129,129,129,1);
        margin-bottom: 20px;
        display: block;
    }

        .mail-main > .mail-topbox > .mail-info > span {
            margin: 0 5px;
        }
.mail-main > .mail-cont {
    margin: 50px 70px;
}
</style>
