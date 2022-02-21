<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <Button class="xy-primary" @click.prevent="createClick" :disabled="isCreate">创建相册</Button>
        <Button class="xy-info" @click="importClick" :disabled="isRelease">发布到班牌</Button>
      </div>
      <div class="fr">
        <RadioGroup @on-change="radioBtn" v-model="exhibition" size="large">
          <Radio :label="0">
            <span>按相册展示</span>
          </Radio>
          <Radio :label="1">
            <span>全部照片</span>
          </Radio>
        </RadioGroup>
        <Input search
          v-model="searchText"
          @on-search="FromSubmit"
          placeholder="输入照片名称搜索"
          class="xy-content-title-search"
          style="width: auto;"
         />
      </div>
    </div>
    <div class="xy-content-body clearfix">
      <!--初始loading-->
      <div v-if="isInitial" class="no-data-box isInitital-opacity" v-cloak>
        <img class="no-data-img" src="@/assets/common/loading.png" />
      </div>
      <!--暂无数据-->
      <div v-if="isEmpty && !isInitial" class="no-data-box" v-cloak>
        <img class="no-data-img" src="@/assets/common/nullData.svg" />
        <span class="no-data-text">暂无照片</span>
      </div>
      <div v-if="!isEmpty && !isInitial" v-cloak>
        <!-- 相册列表 -->
        <div v-if="isAlbum" class="album-list clearfix" v-cloak>
          <div v-for="item in datatable" class="album-main" :key="item.id">
            <div v-if="!item.Disabled" class="a-del">
              <icon type="ios-trash-outline"
                size="30"
                @click="aDel(item.PhotoGroupID,item.PhotoGroupName)"
              ></icon>
            </div>
            <div class="a-top" @click="openAlbum(item.PhotoGroupID,item.PhotoGroupName)">
              <div v-if="item.DownloadLink == null || item.DownloadLink == ''" class="a-top-img">
                <img src="@/assets/common/nullData.svg" />
              </div>
              <div v-else class="a-top-img">
                <img :src="item.DownloadLink.replace(/\\/g, '/')" />
              </div>
            </div>
            <div class="a-btm">
              <div @click="openAlbum(item.PhotoGroupID,item.PhotoGroupName)" class="a-tit">
                <a v-cloak>{{item.PhotoGroupName}}</a>
              </div>
              <div class="a-number">
                <span
                  class="asub-tit"
                  v-cloak
                >{{item.PhotoGroupCount == null ? '0': item.PhotoGroupCount}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 照片列表 -->
        <div v-if="!isAlbum" class="photo-list" v-cloak>
          <div v-for="item in photoList"
            :key="item.id"
            class="photo-main"
            @click="addPhoto(item)"
          >
            <div v-if="item.isMask" class="mask">
              <div class="mask-box"></div>
              <div class="mask-img">
                <img :src="item.DownloadLink" />
              </div>
              <icon class="mask-icon" type="md-checkmark-circle-outline"></icon>
            </div>
            <div v-else class="p-del">
              <icon
                v-if="!item.Disabled"
                type="ios-trash-outline"
                size="30"
                @click.stop="pDel(item.id, item.tit)"
              ></icon>
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
      </div>
      <!-- 创建相册 -->
      <modal v-model="albumCreate"
        :transfer="false"
        title="创建相册"
        :loading="loading"
        :mask-closable="false"
        :closable="true"
        v-cloak
      >
        <div class="dialog-model-content">
          <Form ref="formValidateOK"
            :model="formValidateOK"
            :rules="ruleValidateOK"
            @submit.native.prevent
          >
            <FormItem label="相册名称" prop="albumName" labelFor="albumName" :label-width="80">
              <Input v-model="formValidateOK.albumName" elementId="albumName" clearable />
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="ok">保存</Button>
        </div>
      </modal>
      <ToReleaseTask :taskCreate="taskCreate"
          :publicItem="publicItem"
          :taskList="taskList"
          @changeDate='changeDate'
          @closeTaskModal="closeTaskModal"></ToReleaseTask>
    </div>
  </div>
</template>
<script>
  import ToReleaseTask from '@/pages/infoPublic/components/ToReleaseTask.vue'
  export default {
    name: 'Photo',
    components: {
      ToReleaseTask
    },
    data () {
      return {
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
        totalphoto: 0, // 总条数
        pageSizephoto: 15, // 每页显示条数
        // pagesphoto: xy.table.pages,
        pageCurrentphoto: 1, // 当前页码
        pageListphoto: 0, // 当前页数据条数
        dataphoto: [],
        // 照片
        photoList: [],
        // 是否上传
        isUpBtn: false,
        // 是否发布
        isRelease: true,
        isCreate: false,
        // 相册展示
        isAlbum: true,
        exhibition: 0,
        // 创建相册模型验证
        albumCreate: false,
        formValidateOK: {
          albumName: ''
        },
        ruleValidateOK: {
          albumName: [
            { required: true, message: '相册名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '相册名称不能超过20个字', trigger: 'blur' }
          ]
        },
        // 照片选择下的遮罩
        isMask: false,
        // 新建发布任务---开始
        taskCreate: false,
        taskList: [],
        publicItem: {},
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
            children: []
          }
        ],
        apiPath: this.$store.state.apiPath,
        tremianlArr: [],
        classTerminalIDs: [],
        resourceType: '' // 要提交的type类型
        // 新建发布任务---结束
      }
    },
    created: function () {
      this.GetPagePhotoGroup()
    },
    mounted: function () {},
    methods: {
      closeTaskModal (val) {
        this.taskCreate = false
        this.publicItem = {}
        this.taskList = []
      },
      // 获取相册列表
      GetPagePhotoGroup: function () {
        // this.xy.loading()
        let _this = this
        _this.xy.get(`${_this.apiPath}/api/Resource/GetAllPhotoGroup`, {
          SearchText: ''
        }).then(res => {
          _this.isInitial = false
          if (res.success) {
            if (res.data != null && res.data.length > 0) {
              _this.datatable = res.data
              _this.isEmpty = false
            } else {
              _this.isEmpty = true
            };
          } else {
            _this.isEmpty = true
            _this.xy.msgError(res.msg)
          };
          _this.xy.unloading()
        })
      },

      // 获取照片列表
      GetPhotoByPage () {
        let that = this
        this.xy.loading()
        that.xy.get(`${that.apiPath}/api/Resource/GetPhotoAll`, {
          SearchText: that.searchText
        }).then(res => {
          that.isInitial = false
          if (res.success) {
            that.xy.unloading()
            if (res.data != null && res.data.length > 0) {
              that.datatable = res.data
              let photoArr = []
              for (let i = 0; i < that.datatable.length; i++) {
                let strUrl = that.datatable[i].DownloadLink
                photoArr.push({
                  tit: that.datatable[i].PhotoName,
                  name: that.datatable[i].CreateByName,
                  time: that.xy.moment(new Date(that.datatable[i].CreateByDate)).format('YYYY-MM-DD'),
                  // time: that.datatable[i].CreateByDate,
                  id: that.datatable[i].resourceID,
                  DownloadLink: strUrl.replace(/\\/g, '/'),
                  MemoryAddress: that.datatable[i].MemoryAddress,
                  Disabled: that.datatable[i].Disabled,
                  resourceType: that.datatable[i].resourceType,
                  isMask: false
                })
              }
              that.photoList = photoArr
              // that.total = res.data.totalRecords;
              // that.pageList = res.data.data.length;
              that.isEmpty = false
              if (that.total < that.pageSize) {
                that.isUpBtn = false
              } else {
                that.isUpBtn = true
              }
            } else {
              that.isEmpty = true
            }
          } else {
            that.isEmpty = true
            that.xy.msgError(res.msg)
          }
        })
      },

      // 新增相册
      createClick: function () {
        this.albumCreate = true
        // this.$refs.formValidateOK.resetFields()
      },
      ok: function () {
        let _this = this
        this.$refs.formValidateOK.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.xy.post(`${_this.apiPath}/api/Resource/CreatePhotoGroup`,
                          {
                            PhotoGroupName: $.trim(_this.formValidateOK.albumName)
                          }).then(res => {
              if (res.success) {
                _this.changeLoading()
                _this.xy.msgSuc('创建成功。')
                _this.albumCreate = false
                _this.GetPagePhotoGroup()
                _this.$refs.formValidateOK.resetFields()
              } else {
                _this.modal_loading = false
                _this.xy.msgError(res.msg)
                _this.albumCreate = false
                _this.$refs.formValidateOK.resetFields()
              };
            })
          }
        })
      },
      cancel: function () {
        this.albumCreate = false
        this.$refs.formValidateOK.resetFields()
      },

      // 删除相册
      aDel: function (ids, name) {
        let _this = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除"' + name + '"吗？</p>',
          onOk: function () {
            _this.modal_loading = true
            // 删除接口  api/Resource/DeletePhotoGroup/{id}
            _this.xy.post(`${_this.apiPath}/api/Resource/DeletePhotoGroup?id=${ids}`, {}).then(res => {
              if (res.success) {
                this.xy.msgSuc('删除成功。')
                _this.GetPagePhotoGroup()
              } else {
                _this.xy.msgError(res.msg)
              }
              _this.modal_loading = false
            })
          },
          onCancel: function () {
            // this.$Message.info('Clicked cancel');
          }
        })
      },

      // 打开相册
      openAlbum: function (pID, pName) {
        let datas = { PhotoGroupID: pID, PhotoGroupName: pName }
        this.$store.commit('common/getParam', datas)
        this.$store.commit('common/getThreeMenuName', '管理相册')
        this.$router.push({
          path: '/xyHome/PhotoEdit',
          query: this.$store.state.common.menuInfo
        })
        // 相册是否为空
        // _this.newAlbum = false;
      },

      // 按相册或者照片展示
      radioBtn: function (val) {
        let _this = this
        _this.isRelease = true
        if (_this.exhibition === 0) {
          _this.isAlbum = true
          _this.isCreate = false
          _this.searchText = ''
          _this.GetPagePhotoGroup()
        } else {
          _this.isAlbum = false
          _this.isCreate = true
          _this.GetPhotoByPage()
        }
      },

      // 删除照片
      pDel: function (ids, name) {
        console.log(ids)
        let _this = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除"' + name + '"吗？</p>',
          onOk: function () {
            _this.modal_loading = true
            //   删除接口 POST api/Resource/DeletePhoto/{id}
            _this.xy.post(`${_this.apiPath}/api/Resource/DeletePhoto?id=${ids}`, {}).then(res => {
              if (res.success) {
                _this.xy.msgSuc('删除成功。')
              } else {
                _this.xy.msgError(res.msg)
              }
              _this.GetPhotoByPage()
              _this.modal_loading = false
            })
          },
          onCancel: function () {
            // this.$Message.info('Clicked cancel');
          }
        })
      },

      // 搜索
      FromSubmit: function () {
        this.exhibition = 1
        this.isAlbum = false
        this.isCreate = true
        this.pageCurrent = 1
        this.GetPhotoByPage()
      },

      // 选择照片
      addPhoto: function (val) {
        let _this = this
        _this.taskCreate = false
        _this.resourceType = val.resourceType
        if (val.isMask) {
          val.isMask = !val.isMask
          for (let i = 0; i < _this.taskList.length; i++) {
            if (val.id === _this.taskList[i]) {
              _this.taskList.splice(i, 1)
            }
          }
          if (_this.taskList.length > 0) {
            _this.isRelease = false
          } else {
            _this.isRelease = true
          }
        } else {
          if (_this.taskList.length < 20) {
            val.isMask = !val.isMask
            let taskArr = []
            for (let j = 0; j < _this.photoList.length; j++) {
              if (_this.photoList[j].isMask) {
                taskArr.push(_this.photoList[j].id)
              } else {
                taskArr.splice(j, 1)
              }
            }
            _this.taskList = taskArr
            if (_this.taskList.length > 0) {
              _this.isRelease = false
            } else {
              _this.isRelease = true
            }
          } else {
            _this.xy.msgError('所选照片不能超过20张。')
          }
        }
      },

      // 提交创建时触发
      changeLoading: function () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },

      // 发布到指定班牌---新建发布任务---开始
      // 打开发布任务框
      importClick: function () {
        this.taskCreate = false
        this.taskCreate = true // 开启弹框
        this.publicItem = this.datatable[0]
      },
      // 发送到班牌
      changeDate () {
        this.taskCreate = false // 开启弹框
        this.taskList = [] // 所要发布的ID
        this.publicItem = {} // 所要发布的类型
      },
      // 关闭发布任务
      getTP: function () {
        this.taskCreate = false
      },
      // 点击左侧班牌分组树形结构，显示中间班牌
      selectTree: function (val) {
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
            };
          };
        };
      },

      // 点击中间班牌 显示右侧已选中班牌
      changeCheckbox: function (vals) {
        if (vals.checked) {
          this.classTerminalIDs.push(vals)
        } else {
          for (let i = 0; i < this.classTerminalIDs.length; i++) {
            if (this.classTerminalIDs[i].ClassTerminalID === vals.ClassTerminalID) {
              this.classTerminalIDs.splice(i, 1)
            };
          };
        };
      },

      // 删除右侧已选中班牌
      handleClose: function (e, name) {
        for (let i = 0; i < this.classTerminalIDs.length; i++) {
          if (this.classTerminalIDs[i].ClassTerminalID === name.ClassTerminalID) {
            for (let j = 0; j < this.tremianlArr.length; j++) {
              if (this.tremianlArr[j].ClassTerminalID === name.ClassTerminalID) {
                this.tremianlArr[j].checked = false
              };
            };
            this.classTerminalIDs.splice(i, 1)
          };
        };
      },

      // 确定提交
      submitPublic: function () {
        let that = this
        let ids = []
        if (this.classTerminalIDs.length > 0) {
          for (let i = 0; i < this.classTerminalIDs.length; i++) {
            ids.push(this.classTerminalIDs[i].ClassTerminalId)
          }
          that.$refs.formValidateTaskOK.validate(function (valid) {
            if (!valid) {
              return that.changeLoading()
            } else {
              that.xy.post(`${that.apiPath}/api/PublicTask/CreatePublicTask`, {
                PublishTaskName: $.trim(that.formValidateTaskOK.publicName),
                PublishTaskType: that.resourceType, // 资源类型9
                // PublishTaskType: 0, // 资源类型9
                ClassTerminalID: ids, // 班牌ID
                ResourceID: that.taskList// 资源ID
              }).then(res => {
                if (res.success) {
                  // that.xy.mesSuc(that, '操作成功！可去发布任务记录查看发布详情。')
                  that.xy.msgSuc('操作成功，可去发布任务记录查看发布详情。')
                  that.publicName = ''
                  that.tremianlArr = []// 中间空
                  that.classTerminalIDs = []// 右侧空
                  that.taskCreate = false
                  that.isRelease = true
                  that.getTreeList[0].selected = false
                  that.taskList = []
                  that.$refs.formValidateTaskOK.resetFields()
                  that.GetPhotoByPage()
                } else {
                  that.xy.msgError(res.msg)
                };
                that.changeLoading()
              })
            }
          })
        } else {
          that.xy.msgError('请勾选班牌后再发布。')
          this.changeLoading()
        };
      }
    }
  }
</script>
<style lang="less" scoped>

    .album-list > .album-main {
        background: #fff;
        width: 280px;
        height: 300px;
        margin: 35px 11px 0px;
        float: left;
        position: relative;
        /* box-shadow: 2px 2px 5px #dadada; */
        box-shadow: 0 0 0 #fff;
        transition: all ease 0.5s;
        border: 1px solid rgba(236,238,241,1);
        border-radius: 4px;
    }
        .album-list > .album-main:hover {
            transition: all ease 0.5s;
            box-shadow: 0px 3px 12px 0px rgba(196,196,196,0.5);
        }

        .album-list > .album-main > .a-del {
            position: absolute;
            bottom: 11px;
            right: 3px;
            transition: all ease 0.5s;
            z-index: 99;
        }

            .album-list > .album-main > .a-del > i {
                cursor: pointer;
                /*transform: rotate(0deg);*/
                color: #A3A3A3;
                transition: all ease 0.3s;
            }

                .album-list > .album-main > .a-del > i:hover {
                    transition: all ease 0.3s;
                    /*transform: rotate(180deg);*/
                    color: #6392E9;
                }

        .album-list > .album-main > .a-top {
            width: 262px;
            height: 235px;
            overflow: hidden;
            cursor: pointer;
            margin: 10px 9px 0;
            transition: all 0.3s;
            border-radius: 4px;
            position: relative;
        }
            .album-list > .album-main > .a-top > .a-top-mask {
                position:absolute;
                left:0;
                top:0;
            }

            .album-list > .album-main > .a-top > .a-top-img {
                overflow: hidden;
                width: 262px;
                height: 235px;
                transition: all ease 0.3s;
            }
                .album-list > .album-main > .a-top > .a-top-img > img {
                    width: 100%;
                    height: 235px;
                    overflow: auto;
                    background: #fff;
                    /*border-left: 1px solid #eee;
                    border-bottom: 1px solid #eee;
                    border-right: 1px solid #eee;*/
                    transition: all ease 0.3s;
                }
                .album-list > .album-main > .a-top > .a-top-img > .a-icon {
                    color: #fff;
                    font-size: 84px;
                    margin: 48px auto;
                    width: 100px;
                    text-align: center;
                    transition: all ease 0.3s;
                }
                .album-list > .album-main > .a-top > .a-top-img > .folder {
                    display: block;
                    transition: all ease 0.3s;
                }
                .album-list > .album-main > .a-top > .a-top-img > .open-folder {
                    display: none;
                    transition: all ease 0.3s;
                }

                .album-list > .album-main > .a-top > .a-top-img:hover {
                    transition: all ease 0.3s;
                    background: #7673df;
                }

                    .album-list > .album-main > .a-top > .a-top-img:hover > .a-icon {
                        transition: all ease 0.3s;
                    }

                    .album-list > .album-main > .a-top > .a-top-img:hover > .folder {
                        transition: all ease 0.3s;
                        display: none;
                    }

                    .album-list > .album-main > .a-top > .a-top-img:hover > .open-folder {
                        transition: all ease 0.3s;
                        display: block;
                    }

        .album-list > .album-main > .a-btm {
            padding: 15px 12px 0;
            position:relative;
        }

            .album-list > .album-main > .a-btm > .a-tit {
                height: 40px;
                line-height: 20px;
                font-size: 16px;
                color: #444;
                overflow: hidden;
                cursor: pointer;
            }
            .album-list > .album-main > .a-btm > .a-tit > a {
                cursor: pointer;
            }

            .album-list > .album-main > .a-btm > .a-number {
                line-height: 18px;
                margin-top: 5px;
                position: absolute;
                right: 20px;
                top: -32px;
                font-size: 24px;
                color: #fff;
            }

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
            z-index:99;
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

            .photo-list .mask > .mask-img > img{
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
            z-index:100;
            animation: myfirst 0.3s;
            -moz-animation: myfirst 0.3s; /* Firefox */
            -webkit-animation: myfirst 0.3s; /* Safari and Chrome */
            -o-animation: myfirst 0.3s; /* Opera */
        }

@keyframes myfirst
{
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

</style>
