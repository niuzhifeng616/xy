<template>
  <div>
    <div class="clearfix">
      <div v-if="info">
        <!-- 头部样式 -->
        <div class="approval-card">
          <div class="main-info">
            <div class="left">
              <span class="avatar">
                <span v-if="info && info.DocumentInfo && info.DocumentInfo.CreateIcon === ''"> {{ showName(info.DocumentInfo.CreatedByName) }} </span>
                <img
                  v-if="info && info.DocumentInfo && info.DocumentInfo.CreateIcon"
                  style="width: 50px;height: 50px;border-radius: 50%;float:left;"
                  :src="info.DocumentInfo.CreateIcon + '?time =' + new Date().getTime()"
                  alt="">
              </span>
              <p class="name-number">
                <span class="CreatedByName" v-text="info && info.DocumentInfo && info.DocumentInfo.CreatedByName || ''"></span>
                <span class="schoolNumber" v-text="info && info.DocumentInfo && info.DocumentInfo.DocumentStatusName || ''"></span>
              </p>
            </div>
            <div class="right" v-if="info && info.DocumentInfo && info.DocumentInfo.DocumentStatus">
              <!--0待审批、1审批中、2已通过、3已拒绝、4已收回、16已撤销-->
              <!-- <img v-if="info.DocumentInfo.DocumentStatus === 2"
                   class="no-data-img"
                   src="@/assets/common/attendance/adopt.png" /> -->
              <!-- <img v-if="info.DocumentInfo.DocumentStatus === 3"
                   class="no-data-img"
                   src="@/assets/common/attendance/refuse.png" />
              <img v-else-if="info.DocumentInfo.DocumentStatus === 4"
                   class="no-data-img"
                   src="@/assets/common/attendance/takeBack.png" /> -->
              <img v-if="info.DocumentInfo.DocumentStatus === 16" class="no-data-img" src="@/assets/common/attendance/seal-undo.png" />
            </div>
          </div>
        </div>

        <!-- 中间项 -->
        <ul class="leave-list" style="margin-bottom: 66px;" v-if="info && info.DocumentInfo">
          <li class="info-item">
            <span class="title">主题：</span>
            <span class="content" v-html="info.DocumentInfo.Title"></span>
          </li>
          <li class="info-item">
            <span class="title">公文种类：</span>
            <span class="content">{{info.DocumentInfo.TypeName}}</span>
          </li>
          <li class="info-item">
            <span class="title">发文机关：</span>
            <span class="content">{{info.DocumentInfo.DocumentAgency}}</span>
          </li>
          <li class="info-item">
            <span class="title">发文字号：</span>
            <span class="content">{{info.DocumentInfo.DocumentNumber}}</span>
          </li>
          <li class="info-item file-content">
            <span class="title">文件内容：</span>
            <div class="fileWrap" v-if="info.DocumentInfo.DocFileList && info.DocumentInfo.DocFileList.length">
              <div class="content" v-for="(item, index) in info.DocumentInfo.DocFileList" :key="index">
                <div>
                  <i class="iconfont iconimg" v-if="item.FileType === 'SVG' || item.FileType === 'svg' || item.FileType === 'BMP' || item.FileType === 'JPG' || item.FileType === 'JPEG' || item.FileType === 'PNG' || item.FileType === 'GIF' || item.FileType === 'bmp' || item.FileType === 'jpg' || item.FileType === 'jpeg' || item.FileType === 'png' || item.FileType === 'gif'">&#xe705;</i>
                  <i class="iconfont icontext" v-else>&#xe706;</i>
                </div>
                <div class="fileL">
                  <div class="fileName" :title="item.FileName">
                    {{item.FileName}}
                  </div>
                  <div class="fileSize">
                    {{item.FileLength / 1024 / 1024 >=1?(item.FileLength /1024/1024).toFixed(2)+'MB':(item.FileLength /1024).toFixed(2)+'KB'}}
                  </div>
                </div>
                <div class="fileR">
                  <Button shape="circle" @click="downLoad(item)">下载</Button>
                </div>
              </div>
            </div>
          </li>
          <li class="info-item img-list">
            <!--审批流程-->
            <DocCirculation style="margin-top:15px;" :workflow="workflow">
            </DocCirculation>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import DocCirculation from '@/pages/operationalAnalysis/components/DocCirculation.vue'
  export default {
    name: 'DetailsLook',
    components: {
      DocCirculation
    },
    injece: ['reload'],
    data () {
      return {
        imgTypeList: ['BMP', 'JPG', 'JPEG', 'PNG', 'GIF'],
        mainUrl: this.xyApi + '/base',
        disLook: false,
        workflow: [],
        filesMaxNumKB: 0,
        filesMaxNumMB: 0,
        filesMaxNumKBFixed: 0,
        filesMaxNumMBFixed: 0
      }
    },
    props: ['info'],
    mounted () {
      this.$nextTick(() => {
        this.getrows()
      })
    },
    watch: {
      info: {
        handler (val) {
          this.getrows()
        }
      },
      deep: true
    },
    methods: {
      // 获取上一页参数
      getrows () {
        this.workflow = this.info
        if (this.info && this.info.DocumentInfo && this.info.DocumentInfo.DocFileList && this.info.DocumentInfo.DocFileList.length) {
          for (let i = 0, len = this.info.DocumentInfo.DocFileList.length; i < len; i++) {
            this.filesMaxNumKB += this.info.DocumentInfo.DocFileList[i].FileLength / 1024
            this.filesMaxNumKB += this.info.DocumentInfo.DocFileList[i].FileLength / 1024 / 1024
          }
          this.filesMaxNumKBFixed = this.filesMaxNumKB.toFixed(2)
          this.filesMaxNumMBFixed = this.filesMaxNumMB.toFixed(2)
        }
        this.$forceUpdate()
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
.clearfix {
  /deep/ .leave-list {
    .comm-title {
      > span:nth-of-type(1) {
        text-align: center;
        margin-right: 4px;
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
        color: #f5222d;
      }
    }
    .pt {
      > span:nth-of-type(1) {
        background: #f6ffed;
        border: 1px solid #b7eb8f;
        color: #52c41a;
      }
    }
  }
}
.details-head {
  margin-bottom: 19px;
  font-size: 16px;
  font-weight: bold;
  color: rgba(68, 68, 68, 1);
}
.detailModel {
  .ivu-drawer {
    top: 0;
    margin: 0;
    position: absolute;
    height: 100%;
    right: 0;
  }
  .ivu-drawer-content {
    height: 100%;
    overflow: auto;
  }

  .approval-card {
    .main-info {
      display: flex;
      .left {
        width: 50%;
        display: flex;
        align-items: center;
        .avatar {
          padding: 0;
          padding-right: 15px;
          span {
            display: block;
            background: #4196ff;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            text-align: center;
            line-height: 50px;
            font-size: 18px;
            color: #fff;
          }
        }
        .right {
          width: 50%;
          img {
            width: 107px;
            height: 110px;
          }
        }

        .name-number {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .CreatedByName {
            font-size: 16px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }

          .schoolNumber {
            font-size: 16px;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
        }
      }

      .DocumentStatusName {
        margin-top: 50px;
        width: 62px;
        height: 25px;
        border-radius: 4px;
        border: 1px solid rgba(249, 155, 49, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #f99b31;
        font-size: 14px;
      }

      & > img {
        position: absolute;
        right: 30px;
      }
    }
  }

  .leave-list {
    font-size: 14px;
    .info-item:nth-child(1) {
      .title {
        width: 70px;
        flex-basis: 70px;
        display: flex;
        align-items: center;
      }
      .content {
        width: 463px;
      }
    }
    .info-item {
      margin-top: 10px;
      display: flex;
      .title {
        color: #999;
        width: 70px;
        flex-basis: 70px;
        flex-shrink: 0;
        &-strong {
          display: block;
          margin: 20px 0;
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }
      }

      .content {
        margin-left: 10px;
        word-wrap: break-word;
        word-break: normal;
        color: #333;
        width: 438px;
      }
      .icontext {
        color: #4196ff;
      }
      .iconimg {
        color: #f1c64e;
      }
    }
  }

  .img-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    img {
      &:nth-child(2n) {
        margin-left: 20px;
      }

      width: 40%;
      height: 150px;
    }
  }
  .manager-part {
    padding: 0 20px;

    .approal-title {
      font-size: 16px;
      font-weight: bold;
    }

    .approval-group {
      display: flex;
      margin: 20px 0;

      .ivu-radio-wrapper:after,
      .ivu-radio-wrapper:before {
        width: 0;
      }

      .ivu-radio-wrapper {
        padding: 0;
        width: 96px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;

        &:first-child {
          color: #5bbb7e;
          border-color: #5bbb7e;
        }

        &:last-child {
          color: #dc6e6e;
          margin-left: 30px;
          border-color: #dc6e6e;
          border-left: 1px solid;
        }
      }

      .ivu-radio-wrapper.ivu-radio-wrapper-checked {
        &:first-child {
          background: #5bbb7e;
          color: #fff;
        }
      }

      .ivu-radio-wrapper.ivu-radio-wrapper-checked {
        &:last-child {
          background: #e85555;
          color: #fff;
        }
      }
    }

    label {
      color: #999;
      font-size: 14px;
    }
  }

  .user-part {
    padding-left: 20px;
    font-size: 14px;

    h4 {
      color: #999;
    }
  }

  .ivu-drawer-footer {
    padding-left: 40px;
    text-align: left;
  }
}

.cssIcon-triangle {
  display: inline-block;
  width: 5px;
  height: 5px;
  &--t2b {
    margin: 5px;
    border-left: 1px solid #888;
    border-bottom: 1px solid #888;
    transform: rotate(-45deg);
  }
  &--b2t {
    margin: 2px 7px;
    border-left: 1px solid #4196ff;
    border-bottom: 1px solid #4196ff;
    transform: rotate(135deg);
  }
}

.approval {
  &-btn {
    &-confirm {
      width: 96px;
      line-height: 32px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(91, 187, 126, 1);
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: rgba(91, 187, 126, 1);
      &:hover {
        background: rgba(91, 187, 126, 1);
        border: 1px solid rgba(91, 187, 126, 1);
        color: #fff;
      }
    }
    &-refuse {
      width: 96px;
      line-height: 32px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(220, 110, 110, 1);
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: rgba(220, 110, 110, 1);
      &:hover {
        background: #dc6e6e;
        border: 1px solid rgba(220, 110, 110, 1);
        color: #fff;
      }
    }
  }
}
.demo-upload-list {
  width: 128px;
  height: 80px;
  overflow: hidden;
  vertical-align: top;
  display: inline-block;
  margin-right: 10px;
  position: relative;
  cursor: pointer;
}
.demo-upload-list > .demo-upload-list-cover {
  width: 128px;
  height: 80px;
  background: rgba(0, 0, 0, 0);
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.3s;
}
.demo-upload-list > .demo-upload-list-cover > i {
  text-align: center;
  display: block;
  margin: 0 auto;
  line-height: 80px;
  color: rgb(39, 38, 38);
  font-size: 20px;
}

.demo-upload-list:hover > .demo-upload-list-cover {
  transition: all 0.3s;
  background: rgba(0, 0, 0, 0.5);
}
.demo-upload-list:hover > .demo-upload-list-cover i {
  transition: all 0.3s;
  color: rgb(255, 255, 255);
  font-size: 30px;
}
.fileWrap {
  width: 425px;
  overflow: hidden;
  flex-grow: 1;
}
.fileWrap > .content {
  height: 46px;
  background: rgba(248, 248, 248, 1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 4px;
  margin-bottom: 8px;
}
.fileR > button {
  width: 62px;
  height: 28px;
  background: rgba(248, 248, 248, 1);
  border: 1px solid rgba(65, 150, 255, 1);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(65, 150, 255, 1);
}
.pic {
  width: 18px;
  height: 21px;
}
.fileName {
  width: 293px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fileSize {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
.file-content {
  display: flex;
  justify-content: space-between;
}
</style>
