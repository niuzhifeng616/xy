<template>
  <div>
    <div class="titles">公文流转</div>
    <div class="content">
      <ul class="flow-wrapper" v-if="this.list">
        <li class="flow-item" v-for="(item, index) in this.list" :key="index" style="padding: 0">
          <!-- 左侧直线 -->
          <div class="flow-item-line" v-if="index === 'DocumentInfo'"></div>
          <!-- 发起人 -->
          <div class="flow-item-header" v-if="index === 'DocumentInfo'">
              <span>发起</span>
              <!-- <Icon type="ios-checkmark-circle" color='#18bd84' size='14' style="position:absolute; top: 25px; left: 26px; border-radius: 50%; background: #fff" /> -->
              <img :src="trueImg" alt="" style="position: absolute; top: 25px; left: 26px; border-radius: 50%; width: 16px; height: 16px">
          </div>
          <div class="flow-item-content" v-if="index === 'DocumentInfo'">
            <div class="flow-content-header">
              <div class="flow-content-title" style="align-self: flex-end">{{ item.CreatedByName }}</div>
              <div class="flow-content-time" style="align-self: flex-start">{{ xy.moment(item.CreatedTime).format('MM-DD HH:mm') }}</div>
            </div>
            <div class="flow-content-body" style="opacity: .65">
              <span class="flow-content-reason work-break-wrap">{{ item.Note }}</span>
            </div>
          </div>
          <!-- 流转 -->
          <!-- 左侧 -->
          <div v-if="index === 'NodeList'">
            <div v-for="(x,y) in item" :key="Math.floor(Math.random()*10000+y)">
              <div v-if="x.OrderName === '申请结束'">
                <div class="flow-item-header2">
                  <div class="flow-avatar2">
                    <div>
                      <span>
                        申请
                      </span>
                      <span>
                        结束
                      </span>
                    </div>
                  </div>
                      <img v-if=" x.UserList[0].ApplyEndStatus !== 4" :src="trueImg" alt="" style="position: absolute; right: 0; bottom: 0; border-radius: 50%; width: 16px; height: 16px; transform: translate(25%, 25%)">
                      <img v-else :src="falseImg" alt="" style="position: absolute; right: 0; bottom: 0; border-radius: 50%; width: 16px; height: 16px; transform: translate(25%, 25%)">
                </div>
                <!-- 右侧 -->
                <div class="flow-item-content2">
                    <div class="flow-item-line" v-if="x.CommentList.length !== 0 || item.length !== y+1 || (item.length === y+1 && x.UserList[0].ApplyEndStatus === 2)"></div>
                  <!-- 主体 -->
                  <div class="maincirculation">
                    <div class="circulation" v-for="(i,j) in x.UserList.slice(0, displayNum)" :key="j">
                      <div class="flow-content-title dtdd">
                        <span class="flow-avatar3" style="display: inline-block; opacity: 1">
                          <span v-if="i.Icon === ''" style="font-size: 10px">{{ showName(i.FullName ) }}</span>
                          <img v-else style="width: 25px;height: 25px;border-radius: 50%;float:left;" :src="i.Icon + '?time =' + new Date().getTime()" alt="">
                        </span>
                        <span class="circulationName">{{i.FullName }}</span>
                      </div>
                    </div>
                    <p v-if=" x.UserList[0].ApplyEndStatus === 4">({{list.DocumentInfo.CreatedByName}}驳回了您的申请。)</p>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="flow-item-header3">
                    <span>
                      {{x.OrderName}}
                    </span>
                </div>
                <!-- 右侧 -->
                <div class="flow-item-content">
                  <div class="flow-item-line" style="display:block" v-if="x.CommentList.length !== 0 || list.DocumentInfo.DocumentStatus  === 4 || list.DocumentInfo.DocumentStatus  === 2 || item.length !== y+1"></div>
                  <!-- 上半 -->
                  <div class="flow-content-header" v-if="x.UserList">
                    <div class="flow-content-title circulation-number">
                      <span>流转{{x.TotalUserCount}}人</span>
                      <span class="alreadySignIn">{{x.SignedCount}}人已签收。</span>
                    </div>
                    <div class="flow-content-time">{{xy.moment(x.SendTime).format('MM.DD HH:mm')}}</div>
                  </div>
                  <!-- 主体 -->
                  <div class="maincirculation" v-if="x.TotalUserCount > 6">
                    <div class="circulation" v-for="(i,j) in x.UserList.slice(0, displayNum)" :key="j">
                      <div class="flow-content-title dtdd">
                        <span class="flow-avatar3" style="display: inline-block; opacity: 1">
                          <span v-if="i.Icon === ''" style="font-size: 10px">{{ showName(i.FullName ) }}</span>
                          <img v-else style="width: 25px;height: 25px;border-radius: 50%;float:left;" :src="i.Icon + '?time =' + new Date().getTime()" alt="">
                          <img v-if="i.IsSign" :src="trueImg" alt="" style="position: absolute; width: 13px; height: 13px; left: 17px; top: -4px; border-radius: 50%">
                        </span>
                        <div class="circulationName" :title="i.FullName">{{i.FullName }}</div>
                      </div>
                    </div>
                    <div class="circulation" v-show="more" @click="moreUser(x.TotalUserCount)">
                      <div class="flow-content-title dtdd">
                        <div class="moreCirWrap">
                          <div class="moreCir"></div>
                          <Icon type="ios-arrow-down" />
                        </div>
                        <span class="circulationName">更多</span>
                      </div>
                    </div>
                    <div class="circulation" v-show='less' @click="lessUser">
                      <div class="flow-content-title dtdd">
                        <div class="moreCirWrap">
                          <div class="moreCir"></div>
                          <Icon type="ios-arrow-up" />
                        </div>
                        <span class="circulationName">收起</span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="maincirculation">
                    <div class="circulation" v-for="(i,j) in x.UserList" :key="j">
                      <div class="flow-content-title dtdd">
                        <span class="flow-avatar3" style="display: inline-block; opacity: 1">
                          <span v-if="i.Icon === ''" style="font-size: 10px">{{ showName(i.FullName ) }}</span>
                          <img v-else style="width: 25px;height: 25px;border-radius: 50%;float:left;" :src="i.Icon + '?time =' + new Date().getTime()" alt="">
                          <!-- <Icon v-if="i.IsSign" type="ios-checkmark-circle" color='#fff' size='10' style="position:absolute; top: -2px; left: 18px; border-radius: 50%; background: green" /> -->
                          <img v-if="i.IsSign" :src="trueImg" alt="" style="position: absolute; width: 13px; height: 13px; left: 17px; top: -4px; border-radius: 50%">
                        </span>
                        <div class="circulationName" :title="i.FullName">{{i.FullName }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 评论 -->
              <div class="plList">
                <div class="flow-item-content" v-for="(i, j) in x.CommentList.slice(0, plList[y].num)" :key="j">
                  <div class="openBtn">
                    <div class="flow-item-spot"></div>
                    <div class="flow-content-header">
                      <span class="flow-content-title talk">
                        <span style="color: #4196FF">{{i.FullName}}</span> 添加了评论
                      </span>
                      <span class="flow-content-time openOrback" v-if="j===0 && x.CommentList.length > 2">
                        <a
                          v-show="plList[y].open"
                          href="javascript:;"
                          class="flow-content-btn--showDetail"
                          @click="isOpenClose(y)"
                          >
                          展开
                          <span class="cssIcon-triangle cssIcon-triangle--t2b"></span>
                        </a>
                        <a
                          v-show="plList[y].close"
                          href="javascript:;"
                          class="flow-content-btn--hideDetail"
                          @click="isOpenClose(y)"
                          >
                          收起
                          <span class="cssIcon-triangle cssIcon-triangle--b2t"></span>
                        </a>
                        <span>{{xy.moment(i.AddCommentTime).format('MM.DD HH:mm')}}</span>
                      </span>
                      <span class="flow-content-time openOrback" v-else>
                        <span>{{xy.moment(i.AddCommentTime).format('MM.DD HH:mm')}}</span>
                      </span>
                    </div>
                    <div class="flow-content-body">
                      <p class="flow-content-reason work-break-wrap">{{i.Comment}}</p>
                      <div class="fileWrap">
                        <div class="content" v-for="(a, b) in i.FileList" :key="b">
                          <div>
                            <i class="iconfont iconimg" v-if="a.FileType === 'SVG' || a.FileType === 'svg' || a.FileType === 'BMP' || a.FileType === 'JPG' || a.FileType === 'JPEG' || a.FileType === 'PNG' || a.FileType === 'GIF' || a.FileType === 'bmp' || a.FileType === 'jpg' || a.FileType === 'jpeg' || a.FileType === 'png' || a.FileType === 'gif'">&#xe705;</i>
                            <i class="iconfont icontext" v-else>&#xe706;</i>
                          </div>
                          <div class="fileL">
                            <div class="fileName" :title="a.FileName">
                              {{a.FileName}}
                            </div>
                            <div class="fileSize">
                              {{a.FileLength / 1024 / 1024 >=1?(a.FileLength /1024/1024).toFixed(2)+'MB':(a.FileLength /1024).toFixed(2)+'KB'}}
                            </div>
                          </div>
                          <div class="fileR">
                            <Button  shape="circle" @click="downLoad(a)">下载</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 左侧直线 -->
                    <div class="flow-item-line" v-if="y+1 !== item.length || x.UserList[0].ApplyEndStatus === 2 || (y+1 === item.length && ((j+1 !== x.CommentList.length && j!== 1) || (j===1 && plList[y].close && x.CommentList.length>2)))"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
          <!-- 结束审批 -->
        <li class="flow-item" v-if="list.DocumentInfo.DocumentStatus === 4">
          <div class="flow-item-header2">
            <div class="flow-avatar2">
              <div>
                <span>流程</span>
                <span>结束</span>
              </div>
            </div>
              <img :src="trueImg" alt="" style="position: absolute; bottom: 0; right: 0; transform: translate(25%, 25%); border-radius: 50%; width: 16px; height: 16px">
          </div>
          <div class="flow-item-content">
            <div class="flow-content-header">
              <div class="flow-content-title" style="align-self: flex-end">{{ list.DocumentInfo.CreatedByName }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  const falseImg = require('@/assets/operationalAnalysis/false.png')
  const trueImg = require('@/assets/operationalAnalysis/true.png')
  export default {
    name: 'WorkflowApproval',
    props: ['workflow'],
    inject: ['reload'],
    data () {
      return {
        trueImg: trueImg,
        falseImg: falseImg,
        mainUrl: this.xyApi + '/base',
        list: [],
        signList: [],
        more: true,
        less: false,
        displayNum: 5,
        isOpen: false,
        isClose: false,
        commentNum: 0,
        docTypeList: [],
        statusNow: 0,
        plList: []
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getList()
      })
    },
    watch: {
      workflow: {
        handler () {
          this.getList()
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      // 获取参数
      getList () {
        this.list = this.workflow
        this.signList = this.list.NodeList
        this.$forceUpdate()
        this.statusNow = this.list.DocumentInfo.DocumentStatus
        if (this.signList.length !== 0) {
          for (let i = 0; i < this.signList.length; i++) {
            if (this.signList[i].CommentList.length > 2) {
              this.plList.push({
                close: false,
                open: true,
                num: 2
              })
            } else {
              this.plList.push({
                close: false,
                open: false,
                num: this.signList[i].CommentList.length
              })
            }
          }
          this.$set(this.plList[this.signList.length - 1], 'num', this.signList[this.signList.length - 1].CommentList.length)
        }
        for (let i = 0; i < 2; i++) {
          for (let i = 0; i < this.signList.length; i++) {
            this.isOpenClose(i)
          }
        }
      },
      // 审批流列表：若无图标，展示文字
      showName (name) {
        if (name != null) {
          // 纯中文：汉字姓名大于2个字展示最后2个字，小于等于2个字
          if (/^[\u4e00-\u9fa5]+$/g.test(name)) {
            return name.length > 2 ? name.slice(-2) : name
          } else if (/^[A-Za-z]+$/g.test(name)) {
            // 纯英文名只展示两个字母
            return name.slice(0, 2)
          } else {
            // 其他
            return name.slice(0, 2)
          }
        }
      },
      // 展开或
      isOpenClose (id) {
        if (this.plList[id].open) {
          this.plList[id].close = true
          this.plList[id].open = false
          this.plList[id].num = this.signList[id].CommentList.length
        } else {
          this.plList[id].close = false
          this.plList[id].open = true
          this.plList[id].num = 2
        }
      },
      // 更多
      moreUser (all) {
        this.more = false
        this.less = true
        this.displayNum = all
      },
      lessUser () {
        this.more = true
        this.less = false
        this.displayNum = 5
      },
      // 下载
      downLoad (file) {
        let path = file.FilePath.match(/\/([^/]*)$/)[1]
        let params = {
          u: `${this.$store.state.apiPath}/api/DocCirculation/DownLoadFile`,
          d: JSON.stringify({
            file: path,
            uploadFileName: file.FileName
          })
        }
        let routeData = this.$router.resolve({
          path: '/downLoad',
          query: params
        })
        window.open(routeData.href, '_blank')
      }
    }
  }
</script>
<style lang="less" scoped>
.fileWrap{
  width: 425px;
  overflow: hidden;
  flex-grow: 1;
  line-height: 14px;
  margin-top: 8px;
  .icontext{
    color: #4196FF !important;
  }
  .iconimg{
    color:#F1C64E !important;
  }
}
  .fileWrap>.content{
    height: 44px;
    background:rgba(248,248,248,1);
    border-radius:4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    margin-bottom: 8px;
  }
    .fileR>button{
      width:62px;
      height:28px;
      background:rgba(248,248,248,1);
      border:1px solid rgba(65,150,255,1);
      border-radius:14px;
      font-size:14px;
      font-weight:400;
      color:rgba(65,150,255,1);
    }
    .pic{
      width: 18px;
      height: 21px;
    }
    .fileName{
      width: 293px;
      font-size:14px;
      line-height: 16px;
      font-weight:400;
      color:rgba(0,0,0,1);
      opacity:0.85;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .fileSize{
      font-size:12px;
      font-weight:400;
      color:rgba(0,0,0,1);
      opacity:0.45;
    }
    .file-content{
      display: flex;
      justify-content: space-between;
    }
.openOrback {
  display: flex;
  flex-direction: column;
  align-content: center;
  opacity: 1 !important;
  a{
    text-align: right;
    color: #666;
  }
  span{
    color: #000;
    opacity: .45;
  }
}

.titles {
  margin: 40px 0 20px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
}
.flow-wrapper {
  position: relative;
}

.flow-item {
  position: relative;
  margin: 0;
  padding: 0 0 12px;
}

.flow-item-line {
  height: 100%;
  border-left: 4px solid #E3E3E4;
  position: absolute;
  left: 20px;
  top: 12px;
}

.flow-item-spot {
  width: 20px;
  height: 20px;
  background: rgba(191, 191, 191, 1);
  border: 4px solid rgba(255, 255, 255, 1);
  border-radius: 50%;
  position: absolute;
  left: 12px;
  z-index: 2;
}

.flow-item-header {
  width: 44px;
  height: 44px;
  background-color: #4196ff;
  border-radius: 50%;
  position: absolute;
  z-index: 1;
  color: #fff;
  border:4px solid rgba(255,255,255,1);
  text-align: center;
  line-height: 36px;
}

.flow-item-header3 {
  width:34px;
  height:34px;
  background:rgba(65,150,255,1);
  border:4px solid rgba(255,255,255,1);
  border-radius:50%;
  position: absolute;
  z-index: 1;
  left: 5px;
  text-align: center;
  color: #fff;
  line-height: 26px;
}
.flow-item-header2 {
  width:48px;
  height:48px;
  background:rgba(65,150,255,1);
  border:4px solid rgba(255,255,255,1);
  border-radius:50%;
  font-size:12px;
  font-weight:400;
  color:rgba(255,255,255,1);
  line-height:13px;
  position: absolute;
  z-index: 1;
  color: #fff;
  left: -2px;
  div{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}

.flow-item-content {
  min-height: 60px;
  padding: 1px 1px 10px 65px;
  font-size: 14px;
  position: relative;
  top: -3px;
}
.flow-item-content2{
  min-height: 60px;
  padding: 1px 1px 10px 65px;
  font-size: 14px;
  position: relative;
  top: -3px;
}

.flow-item-content.hasCC:not(.flow-CC)::after {
  content: "";
  height: 100%;
  border-left: 2px solid #c6c6c6;
  position: absolute;
  z-index: 0;
  left: 18px;
  top: 3px;
}
.showline {
  display: block !important;
}

.flow-avatar {
  overflow: hidden;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  line-height: 40px;
  background: #4196ff;
  border-radius: 50%;
  font-size: 14px;
  text-align: center;
  color: #fff;
  border:4px solid rgba(255,255,255,1);
}

.flow-avatar2 {
  width:25px;
  height:25px;
  font-size:12px;
  font-weight:400;
  color:rgba(255,255,255,1);
  line-height:13px;
  position: relative;
  >span{
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    line-height: 25px;
    text-align: center;
  }
}

.flow-avatar3 {
  width:25px;
  height:25px;
  font-size:12px;
  font-weight:400;
  color:rgba(255,255,255,1);
  line-height:13px;
  background: #4196ff;
  border-radius: 50%;
  text-align: center;
  position: relative;
  span{
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    line-height: 25px;
  }
}

.flow-avatar-imgWrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
}

.flow-avatar img {
  width: 100%;
  min-height: 100%;
}

.flow-avatar--small {
  position: relative;
  width: 30px;
  height: 30px;
  margin: 0 auto;
  line-height: 30px;
  font-size: 12px;
}

.flow-avatar-ellipsis {
  position: absolute;
  top: -16%;
  left: 16%;
  font-size: 20px;
}

.flow-avatar-iconWrapper {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.flow-avatar-iconWrapper > img {
  width: 100%;
}

.flow-avatar > span {
  display: inline-block;
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
  letter-spacing: 1px;
}

.flow-content-header {
  color: #666;
  display: flex;
  justify-content: space-between;
  height: 26px;
  align-items: center;
}

.flow-content-btn--hideDetail {
  color: #666666;
  font-size: 14px;
}

.flow-content-btn--showDetail {
  color: #666;
  font-size: 14px;
}

.flow-content-body {
  width: 399px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 23px;
  margin: 12px 0;
}
.spot {
  width: 6px;
  height: 6px;
  background: rgba(0, 0, 0, 1);
  opacity: 0.25;
  border-radius: 50%;
  display: inline-block;
  margin-right: 7px;
}

.flow-content-name {
  color: #161616;
}

.flow-content-reason {
  color: #333;
}

.flow-content-title {
  font-size: 16px;
  color: rgba(51, 51, 51, 1);
  opacity: 0.85;
  line-height: 16px;
}
 .flow-content-header .talk {
  font-size: 14px;
}
.maincirculation {
  margin-top: 14px;
  width: 420px;
}
.circulation {
  display: inline-block;
  width: 55px;
  margin-right: 15px;
}
.circulationName {
  max-height: 30px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  opacity: 0.45;
  line-height: 26px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  width: 56px;
  text-align: center !important;
}
.moreCir {
  width: 26px;
  height: 26px;
  background: rgba(0, 0, 0, 1);
  opacity: 0.09;
  border-radius: 50%;
}
.moreCirWrap{
  position: relative;
  cursor: pointer;
  i{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.dtdd {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flow-content-time {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  opacity: 0.45;
  line-height: 26px;
}

.flow-detail-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-top: 10px;
}

.flow-detail-wrapper {
  width: 100%;
  margin-left: 10px;
}

.flow-detail-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.flow-overview-list {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.flow-overview-item {
  margin-top: 6px;
  margin-right: 10px;
}

.flow-overview-body {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.flow-overview-name {
  margin-top: 3px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flow-icon-radio {
  display: inline-block;
  width: 19px;
  height: 15px;
  margin: 12px;
  background: url(~@/assets/common/workFlow/radio-white.svg) no-repeat;
  -webkit-transform: scale(1.3);
  transform: scale(1.3);
}

.flow-status-icon {
  position: relative;
}

.flow-status-icon::after {
  content: "";
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 16px;
  height: 16px;
  -webkit-transform: translate(-3px, -3px) scale(1.3);
  transform: translate(-3px, -3px) scale(1.3);
}

.flow-status-icon-pass::after {
  background: url(~@/assets/common/workFlow/circle-check-green.svg) no-repeat;
}

.flow-status-icon-processing::after {
  background: url(~@/assets/common/workFlow/circle-line-orange.svg) no-repeat;
}

.flow-status-icon-reject::after {
  background: url(~@/assets/common/workFlow/circle-fork-red.svg) no-repeat;
}

.flow-status-bgcolor {
  position: relative;
}

.flow-status-bgcolor::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.flow-status-bgcolor-pass::after {
  background: #47ba32;
}

.flow-status-bgcolor-processing::after {
  background: #ffa23f;
}

.flow-status-bgcolor-reject::after {
  background: #ff5c39;
}

.flow-CC .flow-overview-item {
  max-width: 4em;
  font-size: 14px;
  color: #666;
}

.cssIcon-triangle {
  display: inline-block;
  width: 5px;
  height: 5px;
}

.cssIcon-triangle--t2b {
  margin: 5px;
  border-left: 1px solid #666;
  border-bottom: 1px solid #666;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.cssIcon-triangle--b2t {
  margin: 2px 7px;
  border-left: 1px solid #666;
  border-bottom: 1px solid #666;
  -webkit-transform: rotate(135deg);
  transform: rotate(135deg);
}

.approval-btn-confirm {
  width: 96px;
  line-height: 32px;
  background: #fff;
  border: 1px solid #5bbb7e;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #5bbb7e;
}

.approval-btn-confirm:hover {
  background: #5bbb7e;
  border: 1px solid #5bbb7e;
  color: #fff;
}

.approval-btn-refuse {
  width: 96px;
  line-height: 32px;
  background: #fff;
  border: 1px solid #dc6e6e;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #dc6e6e;
}

.approval-btn-refuse:hover {
  background: #dc6e6e;
  border: 1px solid #dc6e6e;
  color: #fff;
}
.alreadySignIn {
  font-size: 14px;
  font-weight: 400;
  color: rgba(65, 150, 255, 1);
  margin-left: 21px;
}
.circulation-number {
  display: flex;
  align-items: center;
}
</style>
