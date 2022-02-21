<template>
  <div>
    <!-- 屏保管理--列表 // 缺少面包屑 -->
      <div class="xy-content-title" style="padding:0">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0 25px;">
            <ul class="horizontal-vertical-ul">
                <li :class="screenModes==0?'horizontal-vertical-active':''" @click="switchTab(0)">横版</li>
                <li :class="screenModes==1?'horizontal-vertical-active':''" @click="switchTab(1)">竖版</li>
            </ul>
            <div>
                <Input search
                  v-model="searchName"
                  @on-search="FromSubmit"
                  placeholder="请输入屏保名称"
                  class="fr xy-content-title-search"
                  style="width: auto;" />
            </div>
        </div>
    </div>
    <div class="xy-content-body pr">
        <!-- 横版 -->
        <ul class="screen-saver-list" v-if="screenModes==0">
            <li class="screen-saver-li-horizontal text-center">
                <img :src="require('@/assets/common/infoPublic/creatScreen.png')" alt="" style="width:203px;height:193px;display:block;margin:28px auto;" />
                <Button type="primary" icon="ios-add" @click="addScreen">创建屏保</Button>
            </li>
            <li class="screen-saver-li-horizontal" v-for="(item,index) in dataTable" :key="index">
              <!-- :src="require('@/assets/infoPublic/pb.png')" -->
              <!-- :src="apiPath + item.ScreenThumbnail.replace(/\\/g,'/')+'?'+new Date().getTime()" -->
                <img :src="require('@/assets/infoPublic/pb.png')" alt="" style="width:290px;height:163px;display:block;" />
                <div class="screen-info">
                    <div>
                        <span>名称</span>
                        <span style="margin-left:12px;" v-cloak>{{item.ScreenSaverName}}</span>
                    </div>
                    <div>
                        <span>等待</span>
                        <span style="margin-left:12px;" v-cloak>{{item.LatencyTime}}分钟</span>
                    </div>
                    <div>
                        <span>开始时间</span>
                        <span style="margin-left:12px;" v-cloak>{{item.StartDate}}</span>
                    </div>
                    <div>
                        <span>结束时间</span>
                        <span style="margin-left:12px;" v-cloak>{{item.EndDate}}</span>
                    </div>
                </div>
                <ul class="screen-btn-list">
                    <li @click="edit(item)">
                        <Icon type="md-create" size="16"></Icon>
                        <span v-if="!item._disabled">编辑</span>
                        <span v-if="item._disabled">预览</span>
                    </li>
                    <li @click="del(item)" :class="item._disabled?'no-screen-btn':''">
                        <span style="padding: 2px 22px;border-left: 1px solid #E8E8E8;border-right: 1px solid #E8E8E8;">
                            <Icon type="ios-trash-outline" size="16"></Icon>
                            <span>删除</span>
                        </span>
                    </li>
                    <li @click="publicClassCard(item)">
                        <Icon type="md-paper-plane" size="16"></Icon>
                        <span>发布</span>
                    </li>
                </ul>
            </li>
        </ul>
        <!-- 竖版 -->
        <ul class="screen-saver-list" v-if="screenModes==1">
            <li class="screen-saver-li-vertical text-center">
                <img :src="require('@/assets/common/infoPublic/creatScreen.png')" alt="" style="width:203px;height:193px;display:block;margin:107px auto 28px;" />
                <Button type="primary" icon="ios-add" @click="addScreen">创建屏保</Button>
            </li>
            <li class="screen-saver-li-vertical" v-for="(item, index) in dataTable" :key="index">
              <!-- :src="apiPath + item.BackgroundDLink.replace(/\\/g,'/')+'?'+new Date().getTime()" -->
                <img :src="require('@/assets/infoPublic/pb1.jpg')"  alt="" style="width:288px;height:354px;display:block;" />
                <div class="screen-info">
                    <div>
                        <span>名称</span>
                        <span style="margin-left:12px;" v-cloak>{{item.ScreenSaverName}}</span>
                    </div>
                    <div>
                        <span>等待</span>
                        <span style="margin-left:12px;" v-cloak>{{item.LatencyTime}}分钟</span>
                    </div>
                    <div>
                        <span>开始时间</span>
                        <span style="margin-left:12px;" v-cloak>{{item.StartDate}}</span>
                    </div>
                    <div>
                        <span>结束时间</span>
                        <span style="margin-left:12px;" v-cloak>{{item.EndDate}}</span>
                    </div>
                </div>
                <ul class="screen-btn-list">
                    <li @click="edit(item)">
                        <Icon type="md-create" size="16"></Icon>
                        <span v-if="!item._disabled">编辑</span>
                        <span v-if="item._disabled">预览</span>
                    </li>
                    <li @click="del(item)" :class="item._disabled?'no-screen-btn':''">
                        <span style="padding: 2px 22px;border-left: 1px solid #E8E8E8;border-right: 1px solid #E8E8E8;">
                            <Icon type="ios-trash-outline" size="16"></Icon>
                            <span>删除</span>
                        </span>
                    </li>
                    <li @click="publicClassCard(item)">
                        <Icon type="md-paper-plane" size="16"></Icon>
                        <span>发布</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="text-right pr" style="margin-top:10px;">
            <page v-if="dataTable.length>0"
                  :total="total"
                  :page-size="pageSize"
                  :current="pageIndex"
                  :page-size-opts="pages"
                  show-sizer
                  show-total
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"></page>
        </div>
        <modal v-model="viewModal"
               v-cloak
               :styles="{top:'20px',width:screenModes==1?'700px':'1000px'}"
               :transfer="false"
               title="欢迎详情"
               :loading="loading"
               :mask-closable="false">
            <div style="height:500px;overflow-y:auto;">
                <div style="margin-bottom: 10px;">
                    <span>欢迎名称：</span>
                    <span>{{rowItem.WelcomeName}}</span>
                </div>
                <div style="margin-bottom: 10px;">
                    <span>应用日期：</span>
                    <span>{{rowItem.StartDate}}-{{rowItem.EndDate}}</span>
                </div>
                <row>
                    <i-col span="24">
                        <div class="welcome-preview-bg" :style="{backgroundImage:rowItem.welcomeBgExample,height:screenModes==1?'1080px':''}">
                            <div><div class="welcome-preview">{{rowItem.WelcomeTitle}}</div></div>
                            <div><div class="welcome-preview">{{rowItem.WelcomeTarge}}</div></div>
                            <div><div class="welcome-preview">{{rowItem.WelcomeContent}}</div></div>
                        </div>
                    </i-col>
                </row>
            </div>
            <div slot="footer">
                <Button class="xy-modal-close" @click="viewCancel">关闭</Button>
                <Button class="xy-modal-primary" shape="circle" :disabled="isEdit" @click="viewOk">编辑</Button>
            </div>
        </modal>
        <!--新增发布任务-->
        <ToReleaseTask :taskCreate="taskCreate"
            :publicItem="publicItem"
            :taskList="taskList"
            :screenModes="screenModes"
            @changeDate='changeDate'
            @closeTaskModal="closeTaskModal"></ToReleaseTask>
    </div>
  </div>
</template>

<script>
  import ToReleaseTask from '@/pages/infoPublic/components/ToReleaseTask.vue'
  export default {
    name: 'Welcome',
    components: {
      ToReleaseTask
    },
    data () {
      return {
        screenModes: 0, // 0横 1竖
        isEdit: false,
        formValidateTaskOK: {
          publicName: ''
        },
        ruleValidateTaskOK: {
          publicName: [
            { required: true, message: '任务名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '任务名称不能超过20个字', trigger: 'blur' }
          ]
        },
        getTreeList: [
          {
            title: '全部分组',
            expand: true,
            ParentID: -1,
            ClassTerminalGroupID: 0,
            children: [],
            TreminalS: []
          }
        ],
        tremianlArr: [],
        classTerminalIDs: [],
        taskCreate: false,
        publicItem: {},
        delId: {},
        loading: true,
        viewModal: false,
        rowItem: {},
        searchName: '',
        dataTable: [],
        pageIndex: 1,
        pageSize: 15,
        total: 0, // 总条数
        pageList: 0, // 当前页数据条数
        pages: [8, 15, 20],
        taskList: [],
        apiPath: ''
      }
    },
    computed: {},
    created () {
      this.apiPath = this.$store.state.apiPath
      this.screenModes = this.$store.state.infoPublic.types
      console.log(this.screenModes)
    },
    mounted () {
      this.$nextTick(function () {
        this.getTP()
      })
    },
    methods: {
      closeTaskModal (val) {
        this.taskCreate = false
        this.publicItem = {}
        this.taskList = []
      },
      // 列表
      async getTP () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/Resource/GetScreenSaverByPage`, {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            screenMode: this.screenModes,
            name: this.searchName
          }
        )
        this.xy.unloading()
        if (res.success) {
          var resData = res.data
          this.dataTable = resData.data
          this.pageList = resData.data.length
          if (resData.totalRecords) {
            this.total = resData.totalRecords
          };
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 单击页码触发
      changePage (current) {
        // $(window).scrollTop(0)
        this.pageIndex = current
        this.getTP()
      },
      // 单击切换每页展示条数触发
      changePageSize: function (size) {
        // $(window).scrollTop(0);
        this.pageSize = size
        if (this.pageIndex === 1) {
          this.getTP()
        } else {
          this.pageIndex = 1
        }
      },
      // 切换横版或者竖版
      switchTab (val) {
        this.screenModes = val
        this.taskCreate = false // 默认关闭弹框
        this.getTP()
      },
      // 创建屏保
      addScreen () {
        this.$store.commit('infoPublic/setapplications', this.applications)
        this.$store.commit('infoPublic/setbreadcrumbIDs', this.breadcrumbIDs)
        this.$store.commit('infoPublic/setbreadcrumbNames', this.breadcrumbNames)
        if (this.screenModes === 0) {
          // 横版
          // this.$router.push({ path: '/xyHome/CreateHorizontalWelcome' })
          this.$store.commit('infoPublic/settypes', 0)
          this.$store.commit('common/getThreeMenuName', '创建横版屏保')
          this.$router.push({
            path: '/xyHome/CreateHorizontalWelcome',
            query: this.$store.state.common.menuInfo
          })
        } else {
          // 竖版
          // this.$router.push({ path: '/xyHome/CreateVerticalWelcome' })
          this.$store.commit('infoPublic/settypes', 1)
          this.$store.commit('common/getThreeMenuName', '创建竖版屏保')
          this.$router.push({
            path: '/xyHome/CreateVerticalWelcome',
            query: this.$store.state.common.menuInfo
          })
        };
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      // 搜索
      FromSubmit () {
        this.pageIndex = 1
        this.getTP()
      },
      views (row) {
        this.screenModes = row.ScreenMode
        var strurl = row.BackgroundDLink
        strurl = strurl.replace('\\\\', '\\\\')
        strurl = strurl.replace('\\', '\\')
        strurl = strurl.replace('\\', '\\')
        strurl = strurl.replace('\\', '\\')
        row.welcomeBgExample = 'url(' + strurl + ')'
        this.rowItem = row
        this.isEdit = row._disabled
        this.viewModal = true
      },
      // 编辑/查看
      edit (item) {
        this.$store.commit('infoPublic/setapplications', this.applications)
        this.$store.commit('infoPublic/setbreadcrumbIDs', this.breadcrumbIDs)
        this.$store.commit('infoPublic/setbreadcrumbNames', this.breadcrumbNames)
        this.$store.commit('infoPublic/setitem', item)
        if (item.ScreenMode === 0) {
          // 横版
          this.$store.commit('infoPublic/settypes', 0)
          this.$store.commit('common/getThreeMenuName', '编辑横版屏保')
          this.$router.push({
            path: '/xyHome/EditHorizontalWelcome',
            query: this.$store.state.common.menuInfo
          })
          // this.$router.push({ path: '/xyHome/EditHorizontal', query: { item: item, types: 0 } })
        } else {
          // 竖版
          this.$store.commit('infoPublic/settypes', 1)
          this.$store.commit('common/getThreeMenuName', '编辑竖版屏保')
          this.$router.push({
            path: '/xyHome/EditVerticalWelcome',
            query: this.$store.state.common.menuInfo
          })
          // this.$router.push({ path: '/xyHome/EditVertical', query: { item: item, types: 1 } })
        }
      },
      // 删除
      del (vals) {
        if (!vals._disabled) {
          this.delId = vals
          this.xy.confirm('删除', '确认要删除当前屏保信息吗？', this.dels)
        }
      },
      async dels () {
        this.xy.loading()
        let res = await this.xy.post(`${this.apiPath}/api/Resource/DeleteScreenSaver?screenSaverID=` + this.delId.ScreenSaverID)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.getTP()
        }
      },
      viewOk: function () {
        this.$store.commit('infoPublic/setapplications', this.applications)
        this.$store.commit('infoPublic/setbreadcrumbIDs', this.breadcrumbIDs)
        this.$store.commit('infoPublic/setbreadcrumbNames', this.breadcrumbNames)
        this.$store.commit('infoPublic/setitem', this.rowItem)
        if (this.screenModes === 0) {
          // 横版
          this.$store.commit('infoPublic/settypes', 0)
          this.$store.commit('common/getThreeMenuName', '编辑横版屏保')
          this.$router.push({
            path: '/xyHome/EditHorizontalWelcome',
            query: this.$store.state.common.menuInfo
          })
          // this.$router.push({ path: '/xyHome/EditHorizontal', query: { item: item, types: 0 } })
        } else {
          // 竖版
          this.$store.commit('infoPublic/settypes', 1)
          this.$store.commit('common/getThreeMenuName', '编辑竖版屏保')
          this.$router.push({
            path: '/xyHome/EditVerticalWelcome',
            query: this.$store.state.common.menuInfo
          })
          // this.$router.push({ path: '/xyHome/EditVertical', query: { item: item, types: 1 } })
        }
      },
      viewCancel () {
        this.viewModal = false
      },
      // 发布
      publicClassCard (row) {
        let messageErrorNotice = ''
        let nowDate = this.xy.moment(new Date()).format('YYYY-MM-DD HH:MM')
        if (nowDate > row.EndDate) {
          messageErrorNotice = true
          this.taskCreate = false
        } else {
          messageErrorNotice = false
          // 调用发布组件
          this.screenModes = row.ScreenMode
          this.taskCreate = true // 开启弹框
          this.taskList.push(row.ScreenSaverID) // 所要发布的ID
          this.publicItem = row // 所要发布的类型
        };
        if (messageErrorNotice) {
          this.xy.msgError('当前屏保已过期，不允许发布。')
        }
      },
      changeDate () {
        this.taskCreate = false // 开启弹框
        this.taskList = [] // 所要发布的ID
        this.publicItem = {} // 所要发布的类型
      }
    }
  }
</script>
<style lang="less" scoped>
/*屏保列表start*/
.horizontal-vertical-ul{
    display:flex;
    justify-content:flex-start;
    align-items:center;
}
.horizontal-vertical-ul li {
    font-size: 14px;
    color:rgba(51,51,51,0.6);
    padding:13px 5px;
    margin-right:50px;
    cursor:pointer;
}
.horizontal-vertical-active {
    color: #4196FF!important;
    border-bottom: 2px solid #4196FF;
}
.screen-saver-list {
    display: flex;
    justify-content: flex-start;
    flex-wrap:wrap;
}
.screen-saver-li-horizontal {
    margin: 10px;
    width: 290px;
    height: 317px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(236,236,236,1);
}
.screen-saver-li-vertical {
    margin: 10px;
    width: 290px;
    height: 508px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(236,236,236,1);
}
.screen-info {
    padding: 10px 20px;
    color: rgba(0,0,0,0.4);
    font-size: 14px;
}
.screen-btn-list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 48px;
    line-height:48px;
    background: rgba(247,249,250,1);
    border-top: 1px solid rgba(236,236,236,1);
}
.screen-btn-list li {
    flex: 1;
    text-align: center;
    color: #878889;
    cursor:pointer;
}
.no-screen-btn {
    color: rgba(135,136,137,0.5) !important;
    cursor: no-drop !important;
}
/*屏保列表end*/
.welcome-bg {
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 20px;
    /*padding:20px;*/
    text-align: center;
    position: relative;
    width: 1412px;
    height: 794px;
    /*border: 1px solid rgba(0,0,0,0.4);*/
    margin-top: 10px;
    overflow:hidden;
}
.welcome-preview-bg {
    min-height: 500px;
    max-height: 1080px;
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 20px;
    text-align: center;
}
.welcome-text,
.welcome-preview {
    padding: 10px;
    text-align: center;
    font-weight: bolder;
}
.welcome-text {
    background: none;
    border: 1px dashed #ccc;
    display: inline-block;
    width: 80%;
}
.welcome-bg>div:nth-child(1) .welcome-text{
    font-size: 50px;
    margin-top: 200px;
}
.welcome-preview-bg > div:nth-child(1) .welcome-preview {
    font-size: 50px;
    padding-top: 100px;
}
.welcome-bg > div:nth-child(2) .welcome-text {
    font-size: 30px;
    margin-top: 20px;
}
.welcome-preview-bg > div:nth-child(2) .welcome-preview {
    font-size: 30px;
    padding-top: 40px;
}
.welcome-bg>div:nth-child(3) .welcome-text {
    font-size: 20px;
    margin-top: 20px;
}
.welcome-preview-bg > div:nth-child(3) .welcome-preview {
    font-size: 20px;
    padding-top: 20px;
}
.postionBox {
    min-width: 200px;
    min-height: 100px;
    width: 790px;
    position: absolute;
    top: 100px;
    left: 312px;
    /*margin: auto;*/
}

.changeBox {
    min-width: 200px;
    min-height: 100px;
    width: 100%;
    height: 100%;
    border: 2px dashed #ccc;
    outline: none;
    text-align: left;
    padding: 4px 8px;
}

.postionBox .top,
.postionBox-vertical .top {
    position: absolute;
    top: -6px;
    left: 50%;
    width: 14px;
    height: 14px;
    margin: auto;
    border: 1px solid #ccc;
    background: #fff;
    cursor: n-resize;
}

.postionBox .right,
.postionBox-vertical .right {
    position: absolute;
    top: 50%;
    right: -6px;
    width: 14px;
    height: 14px;
    margin: auto;
    border: 1px solid #ccc;
    background: #fff;
    cursor: e-resize;
}

.postionBox .bottom,
.postionBox-vertical .bottom {
    position: absolute;
    bottom: -6px;
    left: 50%;
    width: 14px;
    height: 14px;
    margin: auto;
    border: 1px solid #ccc;
    background: #fff;
    cursor: n-resize;
}

.postionBox .left,
.postionBox-vertical .left {
    position: absolute;
    top: 50%;
    left: -6px;
    width: 14px;
    height: 14px;
    margin: auto;
    border: 1px solid #ccc;
    background: #fff;
    cursor: e-resize;
}

.move-btn {
    position: absolute;
    top: 0px;
    right: -45px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(217,217,217,1);
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    color: #333;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
}

    .move-btn:active {
        background: #4196FF;
        color: #fff;
    }

.del-btn {
    position: absolute;
    bottom: 0px;
    right: -45px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(217,217,217,1);
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    color: #333;
    text-align: center;
    font-size: 22px;
    cursor: pointer;
}

.style-box {
    width: 170px;
    height: 42px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    position: absolute;
    top: -50px;
    left: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
}

.style-bold {
    font-size: 21px;
    font-weight: bold;
    margin: 0 8px;
    padding: 0px 10px;
    height: 24px;
    line-height: 24px;
    border-radius: 2px;
    cursor: pointer;
}

.style-bold-active {
    background: #ddd;
}

.font-color {
    height: 24px;
    line-height: 24px;
    display: flex;
    text-align: center;
    border-radius: 2px;
}

.font-color-sample {
    width: 22px;
    background: #CCC;
    font-size: 19px;
    font-weight: 700
}

.font-color-box {
    position: absolute;
    top: 50px;
    left: 0;
    width: 234px;
    height: 45px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(217,217,217,1);
    border-radius: 2px;
}

.color-box-header {
    height: 22px;
    line-height: 22px;
    text-align: left;
    background: rgba(245,245,245,1);
    border-radius: 2px;
    padding-left: 8px;
    font-size: 12px;
    color: rgba(0,0,0,0.4);
}

.color-box-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 22px;
    padding: 0 6px;
}

.color-box-li {
    width: 14px;
    height: 14px;
    border: 1px solid rgba(226,228,231,1);
    margin: 0 2px;
}

.submit-fix-btn {
    width: 100%;
    height: 52px;
    line-height: 52px;
    text-align: center;
    background: #fff;
    position: fixed;
    bottom: 0;
    border-top: 1px solid #ddd;
    z-index:99;
}

.img-ul {
    height: 790px;
    overflow-y: auto;
    padding: 0px 5px;
}

.img-li {
    margin-bottom: 20px;
    position: relative
}

.img-li:hover .img-del {
    display: block;
}

.img-del {
    display: none;
    position: absolute;
    top: 10px;
    right: 10px;
    color: #333;
    text-align: center;
    font-size: 22px;
    cursor: pointer;
}

.img-del:hover {
    color: #ed4014;
}

.img-select {
    position: absolute;
    top: 40%;
    right: 45%;
    font-size: 42px;
}
/*竖版*/
.welcome-bg-list-vertical {
    width: 100%;
    height: 1008px;
    text-align: center;
    border-left: 1px solid rgba(221,221,221,0.5);
    overflow-y:auto;
    margin-bottom:60px;
}
.welcome-bg-list-vertical li {
    margin-bottom: 20px;
    position:relative;
}
.welcome-bg-list-vertical li img {
    width: 144px;
    height: 256px;
    border-radius: 6px;
    cursor: pointer;
}
.welcome-bg-list-vertical:hover .img-del {
    display: block;
}

.welcome-preview-bg-vertical {
    min-height: 500px;
    max-height: 1080px;
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 20px;
    text-align: center;
}
.img-del-vertical {
    display:block;
    position: absolute;
    top: 10px;
    right: 20%;
    color: #333;
    text-align: center;
    font-size: 22px;
    cursor: pointer;
}
.welcome-bg-vertical {
    width: 567px;
    height: 1008px;
    margin: 0 auto;
    /*border: 1px solid #ddd;*/
    border-radius: 6px;
    background-repeat: no-repeat;
    background-size: cover;
    text-align: center;
    position: relative;
    margin-top: 10px;
    overflow: hidden;
}
.postionBox-vertical {
    min-width: 200px;
    min-height: 100px;
    width: 400px;
    position: absolute;
    top: 350px;
    left: 80px;
}
.welcome-text-vertical,
.welcome-preview-vertical {
    padding: 10px;
    text-align: center;
    font-weight: bolder;
}

.welcome-text-vertical {
    background: none;
    border: 1px dashed #ccc;
    display: inline-block;
    width: 80%;
}
.welcome-preview-bg-vertical > div:nth-child(3) .welcome-preview-vertical {
    font-size: 20px;
    padding-top: 20px;
}
.welcome-bg-list {
    width:280px;
    height: 900px;
    overflow-y: auto;
    padding: 0px 5px;
}
.welcome-bg-list li {
    margin-bottom: 20px;
}
.welcome-bg-list li img {
    width: 100%;
    height: 450px;
    border-radius: 6px;
    box-shadow: 0px 10px 10px -6px rgba(0,0,0,0.4);
    cursor:pointer;
}

</style>
