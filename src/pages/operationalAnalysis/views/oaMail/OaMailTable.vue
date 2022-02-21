<!-- 发消息列表 -->
<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <i-button class="xy-primary" @click="create">发消息</i-button>
      </div>
      <i-input search v-model="searchText" @on-search="FromSubmit" placeholder="请输入标题/发送人姓名" class="fr xy-content-title-search" style="width: auto;">
        <icon type="ios-search cursor-p" slot="suffix" />
      </i-input>
      <date-picker v-model="datePicker" type="daterange" placeholder="全部" :editable="false" @on-change="dateSelect" class="fr xy-content-title-search"></date-picker>
      <checkbox-group v-model="userRoles" @on-change="userRolesChange" class="fr xy-content-title-search" style="margin-top:10px;">
        <checkbox label="2">教师</checkbox>
        <checkbox label="3">学生</checkbox>
        <checkbox label="4">家长</checkbox>
      </checkbox-group>
    </div>
    <div class="xy-content-body">
      <!--初始loading-->
      <div v-if="isInitial" class="no-data-box isInitital-opacity">
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
      </div>
      <!--暂无数据-->
      <div v-if="isEmpty && !isInitial" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text">
          暂无数据
        </span>
      </div>
      <div v-if="!isEmpty && !isInitial">
        <XyTable @changePage="changePage" @changePageSize="changePageSize" :tbColumns="columns" :tbData="datatable" :pageSize="pageSize" :pageIndex="pageCurrent" :total="total">
        </XyTable>
      </div>
    </div>
    <Drawer title="详情" v-model="mInfo" width="720" :transfer="false" :mask-closable="false" @on-close='close'>
      <div class="drawer">
        <div id="DrawerDetails">
          <router-view></router-view>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import XyTable from '@/components/table/XyTable'
  export default {
    components: { XyTable },
    data () {
      return {
        mInfo: false,
        drawerTitle: '消息详情',
        isInitial: true, // 页面加载loading
        isEmpty: false, // 数据是否为空
        isReady: false, // 小红点相关
        apiUrl: 'http://qa.api.oa.xiaoyangedu.net:37200/api/OAMessage/',
        userRoles: ['2', '3', '4'],
        sendOuts: ['1', '2'],
        datePicker: [],

        modal_loading: false,
        loading: true,
        id: 0,
        showType: 'S',
        total: 0, // 总条数
        datatable: [], // table数据
        searchText: '',
        pageSize: 15, // 每页显示条数
        pageCurrent: 1, // 当前页码
        pageList: 0, // 当前页数据条数
        pages: [15, 30, 50, 100], // 默认每页可选10/30/50/100条
        columns: [
          {
            title: '标题',
            key: 'MessageTitle'
          }, {
            title: '发送渠道',
            key: 'MessageSendOutName'
          }, {
            title: '发送者',
            key: 'SenderName'
          }, {
            title: '发送时间',
            key: 'CreateByDate'
          }, {
            align: 'center',
            title: '接收目标人数',
            key: 'ReceiverCount'
          }, {
            title: '操作',
            key: '04',
            width: 'auto',
            minWidth: 220,
            align: 'center',
            render: (h, params) => {
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, [
                h('a', {
                  'class': {
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      this.details(params.row)
                    }
                  }
                }, '查看消息详情'),
                h('a', {
                  'class': {
                    oprateBtn2: true
                  }
                }, [
                  h('a', {
                    on: {
                      click: () => {
                        if (!params.row.IsDeleted) {
                          this.personnel(params.row)
                        }
                      }
                    }
                  }, '查看接收人员')]
                )
              ])
            }
          }
        ]
      }
    },
    created: function () {
      this.getTP()
    },
    methods: {
      async getTP () {
        this.xy.loading()
        let userRoles = ''
        let sendOuts = ''
        userRoles = this.userRoles.join(',')
        sendOuts = this.sendOuts.join(',')
        let res = await this.xy.get(this.apiUrl + 'GetMessageALL', {
          StartDate: this.xy.timeFormat(new Date(this.datePicker[0]), 'yyyy-MM-dd '),
          EndDate: this.xy.timeFormat(new Date(this.datePicker[1]), 'yyyy-MM-dd '),
          SendOuts: sendOuts,
          UserRoles: userRoles,
          SearchText: this.searchText,
          PageIndex: this.pageCurrent,
          PageSize: this.pageSize
        })
        this.isInitial = false
        if (res.success) {
          if (res.data.data != null && res.data.data.length > 0) {
            this.datatable = res.data.data
            this.total = res.data.totalRecords
            this.pageList = res.data.data.length
            this.isEmpty = false
            this.isReady = true
          } else {
            this.isEmpty = true
          };
        } else {
          this.isEmpty = true
        };
        this.xy.unloading()
      },

      // 创建站内信
      create: function () {
        if (this.$store.state.common.menuInfo.Type) {
          this.showType = this.$store.state.common.menuInfo.Type
        }
        this.$store.commit('common/getParam', { Type: this.showType })
        this.$router.push({ path: '/xyHome/createMail', query: this.$store.state.common.menuInfo })
      },
      // 查看站内信
      details: function (params) {
        this.drawerTitle = params.MessageTitle
        this.mInfo = true
        this.$store.commit('common/getParam', {
          MessageModel: params,
          type: 1
        })
        this.$router.push({ path: '/xyHome/oaMailTable/showMailDetail', query: this.$store.state.common.menuInfo })
      },
      // 查看接收人员
      personnel: function (params) {
        this.$store.commit('common/getParam', { row: params })
        this.$router.push({ path: '/xyHome/showPersonnel', query: this.$store.state.common.menuInfo })
      },
      close () {
        this.$router.push({ path: '/xyHome/oaMailTable', query: this.$store.state.common.menuInfo })
      },

      // 搜索
      FromSubmit: function () {
        this.PageIndex = 1
        this.getTP()
      },
      // 日期
      dateSelect: function () {
        this.PageIndex = 1
        this.getTP()
      },
      // 角色
      userRolesChange: function () {
        this.PageIndex = 1
        this.getTP()
      },
      // 消息类型
      sendOutsChange: function () {
        this.PageIndex = 1
        this.getTP()
      },

      // 单击页码触发
      changePage: function (current) {
        this.pageCurrent = current
        this.getTP()
      },
      // 单击切换每页展示条数触发
      changePageSize: function (size) {
        this.pageCurrent = 1
        this.pageSize = size
        this.getTP()
      },
      // 提交创建触发
      changeLoading: function () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      }
    }

  }
</script>
<style lang='less' scoped>
</style>
