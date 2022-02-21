<template>
  <Drawer
    :title="drawerTitle"
    v-model="show"
    width="720"
    :transfer="false"
    :mask-closable="true"
    :closable="false"
    @on-close="close"
  >
    <div id="DrawerDetails" class="drawer detailModel">
      <div class="mail-main">
        <div class="mail-topbox">
          <span class="mail-tit" v-cloak>
            {{ MessageTitle }}
          </span>
          <span class="mail-info" v-cloak>
            <span v-cloak>
              {{ xy.moment(new Date(msgData.CreateByDate)).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
            <span v-cloak> 发送者：{{ msgData.SenderName }} </span>
          </span>
        </div>
        <div class="mail-cont" v-cloak>
          <div class="mail-list" v-for="(item, bItem) in infoBody" :key="bItem">
            <div class="msg-info">
              <span class="msg-key" v-cloak>{{ item.Key }}：</span>
              <span class="msg-val" v-cloak>{{ item.Value }}</span>
            </div>
            <div class="li-box" v-if="item.Childrens.length > 0">
              <div
                class="msg-info"
                v-for="(child, childIndex) in item.Childrens"
                :key="childIndex"
              >
                <span class="msg-key" v-cloak>{{ child.Key }}：</span>
                <span class="msg-val" v-cloak>{{ child.Value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script>
  export default {
    name: 'MessageDetail',
    props: {
      msgShow: {
        type: Boolean,
        required: false
      },
      msgData: {
        type: Object
      }
    },
    data () {
      return {
        drawerTitle: '消息详情',
        mainList: [],
        type: '',
        urlPath: '',
        MessageID: 0,
        MessageTitle: '',
        infoBody: [],
        show: false
      }
    },
    watch: {
      msgShow: {
        handler (newValue, oldValue) {
          if (newValue) {
            this.show = newValue
            this.urlPath = this.msgData.ServiceDoMainName
            this.MessageID = this.msgData.BusinessID
            this.MessageTitle = this.msgData.Subject
            this.infoBody = []
            if (this.msgData.Body.length > 0) {
              let obj = JSON.parse(this.msgData.Body)
              obj.map((item, index) => {
                if (index > 0) {
                  this.infoBody.push(item)
                }
              })
            }
          }
        },
        deep: true
      }
    },
    mounted: function () {
    },
    methods: {
      close () {
        this.$emit('close', false)
      }
    }
  }
</script>

<style lang="less" scoped>
  .mail-main > .mail-topbox {
    text-align: center;
    border-bottom: 1px solid #f1f1f1;
    overflow: hidden;
  }

  .mail-main > .mail-topbox > .mail-tit {
    font-size: 20px;
    font-weight: bold;
    display: block;
    text-align: center;
    margin-bottom: 10px;
  }

  .mail-main > .mail-topbox > .mail-info {
    font-size: 14px;
    font-weight: 400;
    color: rgba(129, 129, 129, 1);
    margin-bottom: 20px;
    display: block;
  }

  .mail-main > .mail-topbox > .mail-info > span {
    margin: 0 5px;
  }

  .mail-main > .mail-cont {
    margin: 26px 20px;
  }

  .mail-list {
    border-radius: 8px;
    padding: 5px 16px;
  }

  .li-box {
    background: rgba(245, 245, 245, 1);
    border-radius: 8px;
    padding: 4px 10px;
  }

  .msg-info {
    margin: 10px 0;
  }

  .msg-key {
    font-size: 14px;
    font-weight: 400;
    color: rgba(144, 144, 144, 1);
    line-height: 18px;
  }

  .msg-val {
    font-size: 14px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 18px;
  }
</style>
