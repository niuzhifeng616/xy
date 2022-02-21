<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between">
      <div>
        <Button class="xy-info" @click="setAll">全部标为已读</Button>
        <Button class="xy-danger" @click="delAll">清空消息</Button>
      </div>
      <div>
        <Input
          search
          v-model.trim="searchText"
          @on-search="FromSubmit"
          placeholder="请输入要查询的内容"
          class="fr"
          style="width: auto;"
        />
      </div>
    </div>
    <div class="xy-content-body">
      <div class="message-title text-center clearfix">
        <ButtonGroup>
          <Button style="margin-right:0px" :class="status === -1?'xy-primary':'xy-info'" @click="messageType(-1)">全部消息</Button>
          <Button style="margin-right:0px" :class="status === 0?'xy-primary':'xy-info'" @click="messageType(0)">
            <span class="pr">
              未读消息
              <span class="message-nums">{{notRead > 99 ? '99+' : notRead}}</span>
            </span>
          </Button>
        </ButtonGroup>
      </div>
      <!--初始loading-->
      <div v-if="isInitial" class="no-data-box isInitital-opacity">
        <img class="no-data-img" src="@/assets/common/loading.png" />
      </div>
      <!--暂无数据-->
      <div v-if="isEmpty" class="no-data-box" v-cloak>
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text" v-cloak>您还没有消息相关的信息。</span>
      </div>
      <div v-if="!isEmpty && !isInitial" class="message-content">
        <ul>
          <li
            v-for="(item, index) in messageList"
            :key="index"
            class="clearfix message-hover"
          >
            <div class="message-left" @click="dealMsg(item)">
              <div class="fl pr" style="margin-right:5px;">
                <div class="message-pointer" v-if="item.Status === 0"></div>
                <i
                  class="iconfont icons-p-message message-icon"
                  :style="{
                    color:
                      item.Status == 0
                        ? 'rgb(65, 150, 255)'
                        : 'rgba(65, 150, 255,0.7)'
                  }"
                ></i>
              </div>
              <div class="fl" style="width: calc(100% - 30px);">
                <div
                  style="height:21px;"
                  :style="{
                    'font-weight': item.Status === 0 ? 'bold' : '',
                    'margin-bottom': '5px'
                  }"
                >
                  {{ item.Subject }}
                </div>
                <div style="margin-bottom:12px;color:#666;" v-html="item.MessageDescribe">
                </div>
                <div style="color:#999;font-size:12px;">
                  <span style="padding-right:10px;"
                    >接收时间：{{ xy.moment(new Date(item.CreateByDate)).format('YYYY-MM-DD HH:mm:ss') }}</span
                  >
                  <span style="padding-left:10px;"
                    >发送者：{{ item.SenderName }}</span
                  >
                  <span style="padding-left:10px;"
                    >模块：{{ item.MessageTypeName }}</span
                  >
                </div>
              </div>
            </div>
            <!--<div class="message-right">
                     type="ios-mail-open"
                    <icon type="ios-mail" class="xy-table-btn xy-table-hover message-del" title="标记已读" @click=open(item)></icon>
                </div> -->
            <div class="message-right">
              <icon
                type="ios-trash"
                class="xy-table-del-btn xy-table-del-hover message-del"
                title="删除"
                @click="del(item)"
              ></icon>
            </div>
          </li>
        </ul>
        <div class="text-right pr" style="margin-top:10px;">
          <a-pagination
            show-size-changer
            :page-size.sync="PageSize"
            :current="PageIndex"
            :show-total="total => '共' + total + '条'"
            :total="total"
            :pageSizeOptions="pages"
            @change="changePageSize"
            @showSizeChange="changeSize"
          />
          <!-- <page
            :total="total"
            :page-size="PageSize"
            :current="PageIndex"
            :page-size-opts="pages"
            show-sizer
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></page> -->
        </div>
      </div>
      <MessageDetail :msgData="msgData" :msgShow="msgShow" @close="closeBtn" />
    </div>
  </div>
</template>

<script>
  import MessageDetail from './MessageDetail.vue'
  export default {
    name: 'Message',
    components: {
      MessageDetail
    },
    data () {
      return {
        msgData: {},
        msgShow: false,
        apiBase: this.xyApi + '/msg',
        searchText: '',
        status: -1,
        PageIndex: 1,
        // TODO: 之后封装
        PageSize: 15, // xy.table.pageSize,
        pages: ['15', '30', '50', '100'], // xy.table.pages,
        total: 0, // 总条数
        pageList: 0, // 当前页数据条数
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        editId: '',
        editName: '',
        modalRemove: false,
        modalRemoveAll: false,
        schoolDistrictName: '',
        ids: '',
        notRead: '',
        // 编辑模型验证
        formValidate: {
          schoolDistrictName: ''
        },
        ruleValidate: {
          schoolDistrictName: [
            {
              required: true,
              message: '校区/学部名称不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 50,
              message: '校区/学部名称不能超过50个字',
              trigger: 'blur'
            }
          ]
        },
        messageList: []
      }
    },
    computed: {
      modules () {
        return this.$store.state.common.moduleList
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        this.getList()
        this.getNotRead() // 获取未读数
      })
    },
    methods: {
      closeBtn (val) {
        this.msgShow = val
      },
      async getList () {
        this.xy.loading()
        try {
          const res = await this.xy.get(
            `${this.apiBase}/api/Message/GetPageSelf`,
            {
              PageIndex: this.PageIndex,
              PageSize: this.PageSize,
              status: this.status,
              beginDate: '',
              endDate: '',
              query: this.searchText
            }
          )
          this.isInitial = false
          if (res.success) {
            if (res.data.data != null && res.data.data.length > 0) {
              this.total = res.data.totalRecords
              this.messageList = res.data.data
              this.pageList = res.data.data.length
              this.isEmpty = false
            } else {
              this.isEmpty = true
            }
          } else {
            this.isEmpty = true
          }
        } catch (error) {
          this.isEmpty = true
          this.xy.mError('获取消息列表失败', error)
        }
        this.xy.unloading()
      },
      // 获取未读
      async getNotRead () {
        try {
          const res = await this.xy.get(
            `${this.apiBase}/api/Message/GetTotalNotRead`
          )
          if (res.success) {
            this.notRead = res.data
          }
        } catch (error) {
          this.xy.mError('获取未读失败', error)
        }
      },
      // 搜索触发
      FromSubmit () {
        this.PageIndex = 1
        this.getList()
      },
      // 单击页码触发
      changePage (current) {
        document.querySelector('#scrollWrap').scrollTop = 0
        this.PageIndex = current
        this.getList()
      },
      // 单击切换每页展示条数触发
      changePageSize (current, pageSize) {
        console.log(current, pageSize)
        document.querySelector('#scrollWrap').scrollTop = 0
        this.PageSize = pageSize
        this.PageIndex = current
        this.getList()
      },
      changeSize (current, pageSize) {
        console.log(current, pageSize)
        document.querySelector('#scrollWrap').scrollTop = 0
        this.PageSize = pageSize
        this.PageIndex = 1
        this.getList()
      },
      messageType (type) {
        this.PageIndex = 1
        this.status = type
        this.getList()
        this.getNotRead()
      },
      // 处理消息的跳转
      dealMsg (msgRow) {
        let domain = this.modules
        for (let i = 0, len = domain.length; i < len; i++) {
          if (msgRow.ModuleID === domain[i].ID) {
            this.$store.commit('changeApiPath', `${this.xyApi}/${domain[i].ModuleCode}`)
          }
        }
        // 先标记已读
        this.SetStatus(msgRow)
        // 根据是否有地址来处理消息
        if (msgRow.DetailPageUrl === '/xyHome/messageDetail') {
          // 右侧划出
          this.msgShow = true
          this.msgData = msgRow
        } else {
          this.msgShow = false
          this.$store.commit('common/setMsgParam', msgRow)
          this.$router.push({
            path: msgRow.DetailPageUrl
          })
        }
      },
      async SetStatus (val) {
        let res = await this.xy.post(`${this.apiBase}/api/message/SetStatus?messageID=${val.MessageID}&status=1`, null, true)
        if (!res.success) {
          this.xy.msgError('消息设置已读失败。')
        } else {
          this.getNotRead()
          this.getList()
        }
      },
      // 单击删除单个内容触发
      del (item) {
        this.ids = item.MessageID
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除当前消息吗？</p>',
          onOk: () => {
            this.postDel(
              `${this.apiBase}/api/message/Delete?messageID=` + this.ids
            )
          }
        })
      },
      async postDel (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            if (this.pageList > 1) {
              this.pageList = this.pageList - 1
            } else {
              if (this.PageIndex > 1) {
                this.PageIndex = this.PageIndex - 1
              }
            }
            this.getNotRead()
            this.getList()
            this.xy.msgSuc('删除成功。')
          }
        } catch (error) {
          this.xy.msgError('删除失败', error)
        }
      },
      // 单击已读单个内容触发
      open (item) {
        // console.log(item)
      },

      // 清空消息
      delAll () {
        this.$Modal.confirm({
          title: '清空消息',
          content:
            this.notRead > 0
              ? '<p>还有未读消息，确定要清空所有消息吗？</p>'
              : '<p>确定要清空所有消息吗？</p>',
          onOk: () => {
            this.postClearAll(`${this.apiBase}/api/message/ClearMessage`)
          }
        })
      },
      async postClearAll (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            if (this.pageList > 1) {
              this.pageList = this.pageList - 1
            } else {
              if (this.PageIndex > 1) {
                this.PageIndex = this.PageIndex - 1
              }
            }
            this.getNotRead()
            this.getList()
            this.xy.msgSuc('清空成功。')
          }
        } catch (error) {
          this.xy.mError('清空失败', error)
        }
      },
      // 全部标记为已读
      setAll () {
        if (this.notRead === 0) {
          this.xy.msgSuc('暂无未读消息。')
          return false
        }
        this.$Modal.confirm({
          title: '批量标注已读',
          content: '<p>您确认要将所有消息标注为已读吗？</p>',
          onOk: () => {
            this.postReadAll(
              `${this.apiBase}/api/Message/SetStatusAllByUserID?status=1`
            )
          }
        })
      },
      async postReadAll (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            this.getList()
            this.getNotRead()
            this.xy.msgSuc('设置成功。')
          }
        } catch (error) {
          this.xy.mError('操作失败', error)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.xy-content-module {
  /deep/ .xy-content-body {
    .comm-title {
      display: inline;
      padding: 10px;
      > span:nth-of-type(1) {
        text-align: center;
        margin-right: 10px;
        display: inline-block;
        min-width: 54px;
        height: 24px;
        border-radius: 4px;
      }
      > span:nth-of-type(2) {
        text-align: left;
      }
    }
    .jj {
      > span:nth-of-type(1) {
        background: #fff1f0;
      border: 1px solid #ffa39e;
      color: #F5222D;
      }
    }
    .pt {
       > span:nth-of-type(1) {
        background: #f6ffed;
      border: 1px solid #b7eb8f;
      color: #52c41a;
      }
    }
    .ant-pagination-total-text{
      float: left;
    }
  }
}
  .message-content {
    margin: 0 auto;
    width: 1000px;
  }
  .message-title {
    margin-bottom: 20px;
  }
  .message-nums {
    position: absolute;
    top: -14px;
    right: -26px;
    display: inline-block;
    padding: 0px 5px;
    height: 18px;
    line-height: 18px;
    border-radius: 28px;
    font-size: 12px;
    background: #ff7500;
    color: #fff;
  }
  .message-hover {
    display: flex;
    padding: 10px;
    border-radius: 4px;
    background: #fff;
    margin-bottom: 15px;
    box-shadow: 0px 1px 4px 0px rgba(170, 170, 170, 0.4);
    transition: all 0.3s;
  }
  .message-hover:hover {
    background: rgba(65, 150, 255, 0.1);
    transition: all 0.3s;
  }
  .message-left {
    flex: 1;
    cursor: pointer;
  }
  .message-right {
    width: 50px;
    position: relative;
  }
  .message-del {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -14px;
    margin-left: -14px;
  }
  .message-icon {
    font-size: 18px;
  }
  .message-pointer {
    position: absolute;
    top: -5px;
    font-size: 12px;
    right: -2px;
    width: 8px;
    height: 8px;
    background: #ff7500;
    border-radius: 50%;
  }
</style>
