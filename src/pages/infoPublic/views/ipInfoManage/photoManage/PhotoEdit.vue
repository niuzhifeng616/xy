<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
        <div class="fl">
            <!-- <Button v-if="!isEmpty && !isInitial"
                :disabled="isUpBtn"
                class="xy-primary pr"
                icon="ios-cloud-upload-outline">
                <input type="file" multiple="multiple" @change="testUpload($event)" class="pa cursor-p" style="top:0;left:0;width:100%;height:100%;opacity:0;">
                上传图片
            </Button> -->
            <XyUpfile v-if="!isEmpty && !isInitial" style="float:left;margin-right:15px"
              ref="upfile"
              :fileAccept="fileAccept"
              :fileList="fileList"
              :fileSize="size"
              :importPath="upUrl"
              @UploadOk="UploadOk"
              :btnType="'primary'"
              :upTxt="'上传图片'"
              :showTxt="false"
              >
            </XyUpfile>
            <Button class="xy-info" @click="ImportClick" :disabled="isRelease">发布到班牌</Button>
        </div>
        <div class="fr">
            <Input search
              v-model="searchText"
              @on-search="FromSubmit"
              placeholder="输入照片名称搜索"
              class="xy-content-title-search"
              style="width: auto;" />
        </div>
    </div>
    <div class="xy-content-body clearfix">
        <!-- 相册名称 -->
        <h1 style="font-size:24px; margin-bottom:10px;" v-cloak>{{PhotoGroupName}}</h1>
        <!--初始loading-->
        <div v-if="isInitial" class="no-data-box isInitital-opacity" v-cloak>
            <img class="no-data-img" src="@/assets/common/loading.png" />
        </div>
        <!--暂无数据-->
        <div v-if="isEmpty && !isInitial" class="no-photo" v-cloak>
            <div class="no-photo-bg">
                <img class="no-photo-img"
                    src="@/assets/common/nullData.svg" />
                <XyUpfile style="text-align:center;margin-top:18px"
                  ref="upfile"
                  :fileAccept="fileAccept"
                  :fileList="fileList"
                  :fileSize="size"
                  :importPath="upUrl"
                  @UploadOk="UploadOk"
                  :btnType="'primary'"
                  :upTxt="'上传图片'"
                  :showTxt="false"
                  >
                </XyUpfile>
            </div>
        </div>

        <!-- 照片列表 -->
        <div v-if="!isEmpty && !isInitial" class="photo-list clearfix" v-cloak>
            <div v-for="(item, index) in photoList" :key="index" class="photo-main" @click="addPhoto(item)">
                <div v-if="item.isMask" class="mask">
                    <div class="mask-box"></div>
                    <div class="mask-img">
                        <img :src="item.DownloadLink" />
                    </div>
                    <icon class="mask-icon" type="md-checkmark-circle-outline"></icon>
                </div>
                <div v-else class="p-del">
                    <icon v-if="!item.Disabled" type="ios-trash-outline" size="30" @click.stop="pDel(item.id,item.tit)">
                    </icon>
                </div>
                <div v-if="!item.isMask" class="p-top">
                    <img :src="item.DownloadLink" />
                    <div class="p-date">上传时间：{{item.time}}</div>
                </div>
                <div class="p-btm">
                    <div class="p-tit">
                        <p v-cloak style="width:250px" class="nowrap">{{item.tit}}</p>
                        <a v-cloak style=" color: #999; font-size: 14px;">{{item.name}}</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- 导入设置 -->
        <modal v-model="modalImport" title="上传照片" :transfer="false" :closable="true"
            :mask-closable="false" :loading="loading" @on-ok="UpPhotoOk" ok-text="确定"
            @on-cancel="UpPhotoCancel" v-cloak>
                <div id="ImportFile"></div>
                <spin fix v-if="isShowSpin">上传中...</spin>
        </modal>
        <ToReleaseTask :taskCreate="taskCreateEdit"
          :publicItem="publicItem"
          :taskList="taskListEdit"
          @closeTaskModal="closeTaskModal"
></ToReleaseTask>
    </div>
</div>
</template>
<script>
  import XyUpfile from '@/components/upFileOptimize/upFile.vue'
  import ToReleaseTask from '@/pages/infoPublic/components/ToReleaseTask.vue'
  export default {
    name: 'PhotoEdit',
    components: {
      ToReleaseTask, XyUpfile
    },
    data () {
      return {
        publicItemEdit: [],
        publicItem: {},
        // 默认数据
        isEmpty: false, // 数据是否为空
        isInitial: true,
        loading: true,
        // 搜索
        searchText: '',
        total: 0, // 总条数
        pageSize: 100, // 每页显示条数
        // pages: xy.table.pages,
        pageCurrent: 1, // 当前页码
        pageList: 0, // 当前页数据条数
        datatable: [],
        // 是否发布
        isRelease: true,
        // 是否上传
        isUpBtn: false,
        // 照片选择下的遮罩
        isMask: false,
        // 照片
        photoList: [],

        // 导入设置
        modalImport: false,
        isShowSpin: false,
        // importPath: xy.string.format('{0}/api/Resource/UploadPhoto', xy.subMenuServiceUrl),
        importResult: {},
        typeBtn: true,
        // 上传照片
        file: null,
        fileName: '',
        UploadList: [],
        formUpPhotoOK: {
          photoName: ''
        },
        ruleUpPhotoOK: {
          photoName: [
            { required: true, message: '照片名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '照片名称不能超过20个字', trigger: 'blur' }
          ]
        },

        // 新建发布任务---开始
        taskCreateEdit: false,
        taskListEdit: [],
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
            selected: false,
            ParentID: -1,
            ClassTerminalGroupID: 0,
            children: [],
            TreminalS: []
          }
        ],
        PhotoGroupID: 0,
        PhotoGroupName: '',
        tremianlArr: [],
        classTerminalIDs: [],
        apiPath: this.$store.state.apiPath,
        resourceType: '', // 要提交的type类型
        // 上传资源优化
        fileAccept: 'image/jpg, image/jpeg, image/png, image/bmp',
        size: 10,
        upUrl: this.$store.state.apiPath + '/api/Resource/UploadPhoto',
        imgList: [],
        fileList: []
      }
    },
    created () {
      this.PhotoGroupID = Number(this.$route.query.PhotoGroupID)
      this.PhotoGroupName = this.$route.query.PhotoGroupName
      this.GetPhotoByPage()
    },
    methods: {
      UploadOk (list) {
        // 获取最终生成的需要提交的数据格式
        console.log(list)
        this.UpPhotoOk(list)
      },
      closeTaskModal (val) {
        this.taskCreateEdit = false
        this.publicItem = {}
        this.taskList = []
      },
      // 返回
      ReturnBtn () {
        this.$router.back()
      },
      // 获取相册内照片列表
      GetPhotoByPage () {
        // this.xy.loading()
        this.taskListEdit = []
        this.xy.get(`${this.apiPath}/api/Resource/GetPhotoByPage`, {
          SearchText: this.searchText,
          PageIndex: this.pageCurrent,
          PageSize: this.pageSize,
          PhotoGroupID: Number(this.PhotoGroupID)
        }).then(res => {
          this.isInitial = false
          if (res.success) {
            if (res.data.data != null && res.data.data.length > 0) {
              this.datatable = res.data.data
              let photoArr = []
              for (let i = 0; i < this.datatable.length; i++) {
                let strurl = this.datatable[i].DownloadLink
                let formatTime = this.datatable[i].CreateByDate
                photoArr.push({
                  tit: this.datatable[i].PhotoName,
                  name: this.datatable[i].CreateByName,
                  time: this.xy.moment(formatTime).format('YYYY-MM-DD'),
                  id: this.datatable[i].resourceID,
                  DownloadLink: strurl.replace(/\\/g, '/'),
                  MemoryAddress: this.datatable[i].MemoryAddress,
                  Disabled: this.datatable[i].Disabled,
                  resourceType: this.datatable[i].resourceType,
                  isMask: false
                })
              }
              this.photoList = photoArr
              this.total = res.data.totalRecords
              this.pageList = res.data.data.length
              this.isEmpty = false
              if (this.total < this.pageSize) {
                this.isUpBtn = false
              } else {
                this.isUpBtn = true
              }
            } else {
              this.isEmpty = true
            }
          } else {
            this.isEmpty = true
            this.xy.msgError(res.msg)
          }
          this.xy.unloading()
        })
      },
      // 搜索
      FromSubmit () {
        this.pageCurrent = 1
        this.GetPhotoByPage()
      },
      // 上传图片
      changeFunc (e) {
        this.xy.loading()
        let filesUrls = e.target.files
        let imgMasSize = 1024 * 1024 * 10 // 10MB
        // if (filesUrls.length > 10) {
        //   this.xy.unloading()
        //   this.xy.msgError('最多只能上传10张图片')
        //   return
        // }
        for (let i = 0; i < filesUrls.length; i++) {
          console.log(filesUrls[i].type)
          if (['image/jpeg', 'image/png', 'image/bmp', 'image/jpg'].indexOf(filesUrls[i].type.split('/')[1]) < 0) {
            this.xy.unloading()
            this.xy.msgError('文件类型仅支持 jpeg，png，jpg，bmp。')
            return
          };
          if (filesUrls[i].size > imgMasSize) {
            this.xy.unloading()
            this.xy.msgError('单张图片不能超过10M。')
            return
          }
        }
        let formData = new FormData()
        for (let j = 0; j < filesUrls.length; j++) {
          // name
          formData.append('name', filesUrls[j].name)
          // type
          formData.append('type', filesUrls[j].type)
          // size
          formData.append('size', filesUrls[j].size)
          // lastModifiedDate
          formData.append('lastModifiedDate', filesUrls[j].lastModifiedDate)
          // append 文件
          formData.append('File', filesUrls[j])
        }
        this.xy.post(`${this.apiPath}/api/Resource/UploadPhoto`, formData).then(res => {
          if (res.success) {
            this.UpPhotoOk(res.data.result)
          } else {
            this.xy.msgError('图片上传失败。')
          }
          this.xy.unloading()
        })
      },
      // 选择照片
      addPhoto (val) {
        this.taskCreateEdit = false
        this.resourceType = val.resourceType
        if (val.isMask) {
          val.isMask = !val.isMask
          for (let i = 0; i < this.taskListEdit.length; i++) {
            if (val.id === this.taskListEdit[i]) {
              this.taskListEdit.splice(i, 1)
            }
          }
          if (this.taskListEdit.length > 0) {
            this.isRelease = false
          } else {
            this.isRelease = true
          }
        } else {
          if (this.taskListEdit.length < 20) {
            val.isMask = !val.isMask
            let taskArr = []
            for (let j = 0; j < this.photoList.length; j++) {
              if (this.photoList[j].isMask) {
                taskArr.push(this.photoList[j].id)
              } else {
                taskArr.splice(j, 1)
              }
            }
            this.taskListEdit = taskArr
            if (this.taskListEdit.length > 0) {
              this.isRelease = false
            } else {
              this.isRelease = true
            }
          } else {
            this.xy.msgError('所选照片不能超过20张。')
          }
        }
      },

      // 删除照片
      pDel (ids, name) {
        let _this = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除"' + name + '"吗？</p>',
          onOk: function () {
            _this.modal_loading = true
            this.xy.post(`${_this.apiPath}/api/Resource/DeletePhoto?id=${ids}`, null).then(res => {
              if (res.success) {
                _this.xy.msgSuc('删除成功。')
              } else {
                _this.xy.msgError(res.msg)
              }
              _this.GetPhotoByPage()
              _this.modal_loading = false
            })
          },
          onCancel () {
            // _this.$Message.info('Clicked cancel')
          }
        })
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      // 保存图片名称
      UpPhotoOk (list) {
        this.xy.post(`${this.apiPath}/api/Resource/CreatePhoto`, {
          FileInfo: list,
          // FileName: list,
          PhotoGroupID: Number(this.PhotoGroupID)
        }).then(res => {
          if (res.success) {
            this.file = null
            this.changeLoading()
            this.GetPhotoByPage()
            this.xy.msgSuc('上传成功。')
            this.taskCreateEdit = false
            this.modalImport = false
            this.fileName = ''
            this.UploadList = []
            this.fileList = []
            // this.$refs.formUpPhotoOK.resetFields()
          } else {
            this.modal_loading = false
            this.xy.msgError('上传失败。')
            this.modalImport = false
            // this.$refs.formUpPhotoOK.resetFields()
          }
        })
      },
      // 点击取消
      UpPhotoCancel () {
        this.UploadList = []
        this.modalImport = false
        // this.$refs.formUpPhotoOK.resetFields()
      },
      // 导入结束---

      // 发布到指定班牌---新建发布任务---开始
      // 打开发布任务框
      ImportClick () {
        this.taskCreateEdit = false
        this.taskCreateEdit = true
        this.publicItem = this.datatable[0]
      },
      // 关闭发布任务
      getTP () {
        // console.log(this.photoList)
        this.taskCreateEdit = false
      },
      // 获取班牌分组树形结构
      getTree () {
        this.xy.loading()
        this.xy.get(`${this.apiPath}/api/CassTerminalGroup/GetTreminalTree`, {
        }).then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.getTreeList[0].children = res.data
              this.pushAllTraminal(res.data)
            } else { }
          } else { }
          this.xy.unloading()
        })
      },
      // 递归向全部班牌内添加班牌
      pushAllTraminal (list) {
        this.getTreeList[0].TreminalS = []
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].children.length > 0) {
              for (let y = 0; y < list[i].children.length; y++) {
                if (list[i].children[y].TreminalS.length > 0) {
                  for (let j = 0; j < list[i].children[y].TreminalS.length; j++) {
                    this.getTreeList[0].TreminalS.push(list[i].children[y].TreminalS[j])
                  }
                }
                if (list[i].children[y].children.length > 0) {
                  this.pushAllTraminal(list[i].children[y].children)
                }
              }
            }
            if (list[i].TreminalS.length > 0) {
              for (let k = 0; k < list[i].TreminalS.length; k++) {
                this.getTreeList[0].TreminalS.push(list[i].TreminalS[k])
              }
            }
          }
        }
      },
      // 点击左侧班牌分组树形结构，显示中间班牌
      selectTree (val) {
        this.tremianlArr = []
        if (val[0].TreminalS.length > 0) {
          this.tremianlArr = val[0].TreminalS
          this.tremianlArr.map(function (val) {
            val.checked = false
            return val
          })
          for (let j = 0; j < this.classTerminalIDs.length; j++) {
            let all1 = this.tremianlArr.map(function (val) {
              return val.ClassTerminalID
            }).indexOf(this.classTerminalIDs[j].ClassTerminalID)
            if (all1 !== -1) {
              this.tremianlArr[all1].checked = true
            }
          }
        }
      },
      // 点击中间班牌 显示右侧已选中班牌
      changeCheckbox (vals) {
        if (vals.checked) {
          this.classTerminalIDs.push(vals)
        } else {
          for (let i = 0; i < this.classTerminalIDs.length; i++) {
            if (this.classTerminalIDs[i].ClassTerminalID === vals.ClassTerminalID) {
              this.classTerminalIDs.splice(i, 1)
            }
          }
        }
      },

      // 删除右侧已选中班牌
      handleClose (e, name) {
        for (let i = 0; i < this.classTerminalIDs.length; i++) {
          if (this.classTerminalIDs[i].ClassTerminalID === name.ClassTerminalID) {
            for (let j = 0; j < this.tremianlArr.length; j++) {
              if (this.tremianlArr[j].ClassTerminalID === name.ClassTerminalID) {
                this.tremianlArr[j].checked = false
              }
            }
            this.classTerminalIDs.splice(i, 1)
          }
        }
      },

      // 确定提交
      // submitPublic: function () {
      //   let that = this
      //   let ids = []
      //   if (this.classTerminalIDs.length > 0) {
      //     for (let i = 0; i < this.classTerminalIDs.length; i++) {
      //       ids.push(this.classTerminalIDs[i].ClassTerminalID)
      //     };
      //     this.$refs.formValidateTaskOK.validate(function (valid) {
      //       if (!valid) {
      //         return that.changeLoading()
      //       } else {
      //         this.xy.post(`${this.apiPath}/api/PublicTask/CreatePublicTask`, {
      //           PublishTaskName: $.trim(that.formValidateTaskOK.publicName),
      //           PublishTaskType: that.resourceType, // 资源类型9
      //           ClassTerminalID: ids, // 班牌ID
      //           ResourceID: that.taskListEdit// 资源ID
      //         }, function (res) {
      //           if (res.success) {
      //             this.xy.message.success(that, '操作成功！可去发布任务记录查看发布详情。')
      //             that.publicName = ''
      //             that.tremianlArr = []// 中间空
      //             that.classTerminalIDs = []// 右侧空
      //             that.taskCreateEdit = false
      //             that.isRelease = true
      //             that.getTreeList[0].selected = false
      //             that.taskListEdit = []
      //             that.$refs.formValidateTaskOK.resetFields()
      //             that.GetPhotoByPage()
      //           } else {
      //             this.xy.mError(that, res.msg)
      //           };
      //           that.changeLoading()
      //         })
      //       }
      //     })
      //   } else {
      //     this.xy.mError(this, '请勾选班牌后再发布')
      //     this.changeLoading()
      //   };
      // },
      publicCancel: function () {
        this.publicName = ''
        this.tremianlArr = []// 中间空
        this.classTerminalIDs = []// 右侧空
        this.taskCreateEdit = false
        this.getTreeList[0].selected = false
        // this.taskListEdit = [];
        this.$refs.formValidateTaskOK.resetFields()
      }
    }
  }
</script>
<style lang="less" scpoed>
    .photo-list .photo-main {
        background: #fff;
        width: 280px;
        height: 300px;
        margin: 35px 11px 0px;
        border: 1px solid rgba(236,238,241,1);
        box-shadow: 0 0 0 #fff;
        border-radius: 4px;
        float: left;
        position: relative;
        transition: all ease 0.3s;
    }
        .photo-list .photo-main:hover {
            transition: all ease 0.3s;
            box-shadow: 0px 3px 12px 0px rgba(196,196,196,0.5);
        }
        .photo-list .photo-main > .p-del {
            position: absolute;
            bottom: 11px;
            right: 3px;
            transition: all ease 0.5s;
            z-index: 99;
        }

            .photo-list .photo-main > .p-del > i {
                cursor: pointer;
                /*transform: rotate(0deg);*/
                color: #A3A3A3;
                transition: all ease 0.3s;
            }

                .photo-list .photo-main > .p-del > i:hover {
                    transition: all ease 0.3s;
                    /*transform: rotate(180deg);*/
                    color: #6392E9;
                }

        .photo-list .photo-main > .p-top {
            width: 262px;
            height: 235px;
            overflow: hidden;
            cursor: pointer;
            margin: 10px 9px 0;
            transition: all 0.3s;
            border-radius: 4px;
            position: relative;
            text-align: center;
            vertical-align: middle;
            border: 1px solid rgba(236,238,241,1);
        }

            .photo-list .photo-main > .p-top > img {
                display: inline-block;
                overflow: hidden;
                max-width: 100%;
                max-height: 235px;
                transition: all ease 0.3s;
                text-align: center;
                vertical-align: middle;
            }

            .photo-list .photo-main > .p-top > .p-date {
                width: 100%;
                height: 44px;
                background: rgba(0,0,0,0.45);
                position: absolute;
                z-index: 99;
                bottom: -44px;
                color: #fff;
                padding: 12px 13px;
                text-align: left;
                font-size: 16px;
                transition: all ease 0.3s;
            }
        .photo-list .photo-main:hover > .p-top > .p-date {
            transition: all ease 0.3s;
            bottom: 0;
        }

        .photo-list .photo-main > .p-btm {
            padding: 15px 12px 0;
            position: relative;
        }

            .photo-list .photo-main > .p-btm > .p-tit {
                height: 40px;
                line-height: 20px;
                font-size: 16px;
                color: #333;
                overflow: hidden;
                cursor: pointer;
            }

            .photo-list .photo-main > .p-btm > .psub {
                line-height: 18px;
                color: #666;
                margin-top: 5px;
            }

    .photo-list .mask {
        color: #0fe369;
        width: 100%;
        height: 300px;
        float: left;
        cursor: pointer;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 0 0 0 #fff;
        transition: all ease 0.5s;
    }
        .photo-list .mask:hover {
            transition: all ease 0.3s;
            box-shadow: 0px 3px 12px 0px rgba(196,196,196,0.5);
        }

        .photo-list .mask > .mask-box {
            transition: all ease 0.5s;
            width: 100%;
            height: 300px;
            position: absolute;
            background: rgba(32, 32, 32, 0.73);
            z-index: 99;
        }

        .photo-list .mask > .mask-img {
            width: 262px;
            height: 235px;
            overflow: hidden;
            cursor: pointer;
            margin: 10px 9px 0;
            transition: all 0.3s;
            border-radius: 4px;
            position: relative;
            text-align: center;
            vertical-align: middle;
            border: 1px solid rgba(236,238,241,1);
        }

            .photo-list .mask > .mask-img > img {
                display: inline-block;
                overflow: hidden;
                max-width: 100%;
                max-height: 235px;
                transition: all ease 0.3s;
                text-align: center;
                vertical-align: middle;
            }

        .photo-list .mask > .mask-icon {
            color: #24d834;
            font-size: 52px;
            position: absolute;
            bottom: 6px;
            right: 6px;
            z-index: 100;
            animation: myfirst 0.3s;
            -moz-animation: myfirst 0.3s; /* Firefox */
            -webkit-animation: myfirst 0.3s; /* Safari and Chrome */
            -o-animation: myfirst 0.3s; /* Opera */
        }

@keyframes myfirst {
    0% {
        font-size: 52px;
    }

    50% {
        font-size: 62px;
    }

    100% {
        font-size: 52px;
    }
}

@-moz-keyframes myfirst {
    0% {
        font-size: 52px;
    }

    50% {
        font-size: 62px;
    }

    100% {
        font-size: 52px;
    }
}

@-webkit-keyframes myfirst {
    0% {
        font-size: 52px;
    }

    50% {
        font-size: 62px;
    }

    100% {
        font-size: 52px;
    }
}

@-o-keyframes myfirst {
    0% {
        font-size: 52px;
    }

    50% {
        font-size: 62px;
    }

    100% {
        font-size: 52px;
    }
}

/* 暂无照片样式 */
.no-photo {
    width: 100%;
}
    .no-photo > .no-photo-bg {
        width: 100%;
        height: 600px;
        padding-top:30px;
        // background: url('Images/photo-bg-no.png') no-repeat center top;
    }

        .no-photo > .no-photo-bg > .no-photo-img {
            display: block;
            margin: 0 auto;
        }

        .no-photo > .no-photo-bg > .no-photo-btn {
            display: block;
            margin: 30px auto 0;
        }
</style>
