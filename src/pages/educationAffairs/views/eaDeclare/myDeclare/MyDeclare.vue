<template>
  <div class="xy-content-module">
    <div class="xy-content-title clearfix">
      <div class="fl">
        <i-button class="xy-primary" @click="UpClick">申报课程</i-button>
      </div>
      <div class="fr pr">
        <i-input
          search
          v-model="searchName"
          @on-search="FromSubmit"
          placeholder="输入课程名称"
          class="fr xy-content-title-search"
          style="width: auto;"
        >
          <icon type="ios-search cursor-p" slot="suffix" />
        </i-input>
      </div>
    </div>
    <div class="xy-content-body">
      <XyTable
        @changeSelect="changeSelect"
        @changePage="changePage"
        @changePageSize="changePageSize"
        :tbColumns="columns"
        :tbData="columnsData"
        :pageSize="pageSize"
        :pageIndex="pageIndex"
        :total="total"
      ></XyTable>
      <modal
        :styles="{top:'20px'}"
        v-model="modalImport"
        :transfer="false"
        title="申报课程"
        :loading="loading"
        :mask-closable="false"
        :closable="false"
        @on-ok="ok"
        @on-cancel="cancel"
      >
        <div class="dialog-model-content">
          <i-form ref="formValidateOk" :model="formValidateOk" :rules="ruleValidateOk">
            <form-item label="课程名称" prop="DeclareSujectName">
              <i-input v-model="formValidateOk.DeclareSujectName" maxlength="20" clearable></i-input>
            </form-item>
            <form-item label="课程描述" prop="DeclareSujectDescribe">
              <i-input
                v-model="formValidateOk.DeclareSujectDescribe"
                maxlength="200"
                type="textarea"
              ></i-input>
            </form-item>
            <form-item label prop="DeclareFile">
              <!--:format="['xlsx','xls']"-->
                <div style="text-align:center">
            <upload
                    ref="uploadImport"
                    v-show="isShowUpload"
                    type="drag"
                    name="upfile" :multiple="isMultiple"
                    :show-upload-list="showUploadList"
                    :headers="{'Access-Control-Allow-Origin' : '*','XYTOKEN': XYcookie }"
                    :format="formtData"  :accept="fileAccept"
                    :max-size="fileSize"
                    :on-format-error="formatError"
                    :on-exceeded-size="sizeError"
                    :before-upload="beforeUpload"
                    :on-success="success"
                    :data="upParams"
                    :on-error="error"
                    :action="upUrl">
                <div style="padding: 20px 0">
                    <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>
                    <p>点击上传或拖拽文件上传</p>
                </div>
            </upload>
        </div>
              <!-- <div id="ImportFile"></div> -->
              <!--<div style="text-align:center;">
                                <upload multiple
                                        ref="uploadList"
                                        type="drag"
                                        name="upfile"
                                        v-if="isShowUpload"
                                        :headers="{'Access-Control-Allow-Origin' : '*','XYTOKEN':xy.getCookies('.XYTOKEN') }"
                                        :format="['xlsx','xls','png','jpg','pdf','rar','zip','doc','docx']"
                                        :on-format-error="formatError"
                                        :on-success="Success"
                                        :max-size="51200"
                                        :before-upload="BeforeUpload"
                                        :on-error="Error"
                                        :on-exceeded-size="exceededErroy"
                                        :action="uploadPath">
                                    <div style="padding: 20px 0">
                                        <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>
                                        <p>点击上传或拖拽文件上传</p>
                                    </div>
                                </upload>
              </div>-->
              <spin fix v-if="isShowSpin">上传中...</spin>
            </form-item>
          </i-form>
        </div>
      </modal>
      <modal
        :styles="{top:'20px'}"
        v-model="modalShow"
        :transfer="false"
        v-cloak
        title="查看申报课程"
        :loading="loading"
        :mask-closable="false"
        :closable="false"
        @on-cancel="cancel"
      >
        <div class="dialog-model-content">
          <i-form :label-width="100" id="applyIsPass">
            <form-item label="课程名称">
              <div class="apply-names">{{DeclareSujectName}}</div>
            </form-item>
            <form-item label="申报时间">
              <div class="apply-names">{{CreateByDate}}</div>
            </form-item>
            <form-item label="课程描述">
              <div class="apply-names">{{DeclareSujectDescribe}}</div>
            </form-item>
            <form-item label="附件">
              <span
                class="apply-names"
                style="display:inline-block;margin-right:5px;"
              >{{DeclareFileState}}</span>
              <i-button class="info" ghost v-if="isDown" size="small" @click="download">下载</i-button>
            </form-item>
            <form-item label="拒绝原因" v-if="isShow">
              <div class="apply-names">{{ApproveOpinion}}</div>
            </form-item>
            <form-item label="状态" prop="textarea">
              <div class="apply-names">{{DeclareStateName}}</div>
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <i-button class="default" size="large" @click="cancelView">关闭</i-button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
  import XyTable from '@/components/table/XyTable.vue'
  export default {
    name: 'MyDeclare',
    components: {
      XyTable
    },
    data () {
      return {
        title: '申报课程',
        fileAccept: '',
        isMultiple: true,
        XYcookie: this.xy.getCookie('.XYTOKEN'),
        modalImport: false,
        isShowSpin: false,
        isShowUpload: true,
        uploadSuccess: false, //  上传成功
        showUploadList: true, //  是否显示上传文件列表
        importResult: {},
        importResultAll: {},
        xyCookie: '',
        tipData: [''],
        formtData: [
          'xlsx',
          'xls',
          'png',
          'jpg',
          'pdf',
          'rar',
          'zip',
          'doc',
          'docx'
        ],
        fileSize: 51200,
        upUrl: `${this.$store.state.apiPath}/api/Declare/Upload`,
        upParams: {},
        templateUrl: `${this.$store.state.apiPath}/api/StudentOrganizationMember/DownloadTemplate`,
        errorUrl: `${this.$store.state.apiPath}/api/StudentOrganizationMember/DownloadErrorException`,
        total: 0,
        pageSize: 15,
        pageIndex: 1,
        columnsData: [],
        menus: [], // 面包屑
        modal_loading: false,
        loading: true,
        searchName: '',
        editId: '', // 要编辑的ID
        modalShow: false,
        isDown: false,
        DeclareSujectName: '',
        CreateByDate: '',
        DeclareSujectDescribe: '',
        DeclareFileState: '',
        ApproveOpinion: '',
        DeclareStateName: '',
        filepath: '',
        isShow: false,
        uploadFail: false,
        uploadFailSuccess: false,
        uploadPath: `${this.$store.state.apiPath}/api/Declare/Upload`,
        approvalValue: [
          {
            approvalID: 1,
            approvalName: '待审批'
          },
          {
            approvalID: 2,
            approvalName: '已通过'
          },
          {
            approvalID: 3,
            approvalName: '已拒绝'
          },
          {
            approvalID: 4,
            approvalName: '已撤回'
          }
        ],
        columns: [],
        formValidateOk: {
          DeclareSujectName: '',
          DeclareSujectDescribe: '',
          DeclareFile: ''
        },
        ruleValidateOk: {
          DeclareSujectName: [
            {
              type: 'string',
              required: true,
              message: '课程名称不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 20,
              message: '课程名称不能超过20个字',
              trigger: 'blur'
            }
          ],
          DeclareSujectDescribe: [
            {
              type: 'string',
              required: true,
              message: '课程描述不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              max: 200,
              message: '课程描述不能超过200个字',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created: function () {},
    mounted: function () {
      this.$nextTick(function () {
        this.loadTable()
      })
    },
    methods: {
      DownloadTemplate () { //  下载模板
        this.xy.downFile(this.templateUrl)
      },
      DownloadErrorInfo () {
        this.xy.downFile(`${this.errorUrl}` + '?file=' + this.importResult.efile)
      },
      modalChange (status) {
        if (status) {
          this.isShowUpload = true
          this.uploadSuccess = false
        }
      },
      beforeUpload (res) {
        this.isShowSpin = true
      },
      formatError (file, fileList) { // 文件格式验证失败时
        this.isShowSpin = false
        this.xy.msgError('文件格式不正确！')
      },
      sizeError () { // 文件超出指定大小限制时
        this.isShowSpin = false
        this.$refs.uploadImport.clearFiles()
        this.xy.msgError('文件超出' + this.fileSize + 'kb大小限制！')
      },
      success (res) {
        this.importResult = res.data
        this.importResultAll = res
        this.isShowSpin = false
        this.$refs.uploadImport.clearFiles()
        if (res.success) {
          this.isShowUpload = false // 是否展示上传控件
          this.uploadSuccess = true // 上传成功展示的样式
          this.showUploadList = true // 显示上传文件列表
          if (this.modalSubmit !== undefined) { // callback
            this.modalSubmit(res.data)
          }
          this.xy.msgSuc('成功！')
        } else if (res.errorcode === 'rowError') {
          this.isShowUpload = false // 是否展示上传控件
          this.uploadSuccess = false // 上传成功展示的样式
          this.showUploadList = false // 显示上传文件列表
        } else if (res.errorcode === 'fileError') {
          this.isShowUpload = true // 是否展示上传控件
          this.showUploadList = false // 显示上传文件列表
          this.xy.msgError(res.msg)
        } else if (res.errorcode === 'taskError' || res.errorcode === 'mscorlib' || (typeof (res.data)) === 'string') {
          // 导入异常了
          this.isShowUpload = false // 是否展示上传控件
          this.showUploadList = false // 显示上传文件列表
        } else {
          if (res.data !== null && res.data !== '') {
            if (res.data.scount > 0) {
              if (this.modalSubmit !== undefined) { // callback
                this.modalSubmit(res.data)
              }
            } else {
              this.isShowUpload = false // 是否展示上传控件
            }
          } else {
            this.isShowUpload = true // 是否展示上传控件
            this.xy.msgError(res.msg)
          }
          this.uploadSuccess = false // 上传成功展示的样式
          this.showUploadList = false // 显示上传文件列表
        }
      },
      error (file, fileList) {
        this.isShowSpin = false
        this.xy.msgError('Error！')
        this.$refs.uploadImport.clearFiles()
      },
      changeSelect (selction) {},
      changePage (index) {
        this.pageIndex = index
      },
      changePageSize (size) {
        this.pageIndex = 1
        this.pageSize = size
      },
      loadTable: function () {
        var that = this
        this.xy
          .get(`${this.$store.state.apiPath}/api/Declare/GetMyList`, {
            seachText: that.searchName,
            PageIndex: 1,
            PageSize: 15
          })
          .then(res => {
            if (res.success) {
              that.xy.unloading()
              that.total = res.data.totalRecords
              that.columns = [
                {
                  title: '课程名称',
                  key: 'DeclareSujectName',
                  width: 180,
                  render: function (h, params) {
                    return h('div', [
                      h('span', {
                        domProps: {
                          innerHTML:
                            '<div class="nowrap table-el-hover">' +
                            (params.row.DeclareSujectName == null
                              ? '--'
                              : params.row.DeclareSujectName) +
                            '</div>'
                        },
                        attrs: {
                          title: params.row.DeclareSujectName
                        },
                        on: {
                          click: function () {
                            that.show(params.row)
                          }
                        }
                      })
                    ])
                  }
                },
                {
                  title: '审批状态',
                  key: 'DeclareState',
                  align: 'center',
                  render: function (h, params) {
                    return h('div', [
                      h('span', {
                        domProps: {
                          innerHTML:
                            params.row.DeclareState === 1
                              ? '待审批'
                              : params.row.DeclareState === 2
                                ? '已通过'
                                : params.row.DeclareState === 3
                                  ? '已拒绝'
                                  : params.row.DeclareState === 4
                                    ? '已撤回'
                                    : ''
                        },
                        style: {
                          color:
                            params.row.DeclareState === 1
                              ? '#5cadff'
                              : params.row.DeclareState === 2
                                ? '#19be6b'
                                : params.row.DeclareState === 3
                                  ? '#f05a4a'
                                  : params.row.DeclareState === 4
                                    ? '#f90'
                                    : ''
                        }
                      })
                    ])
                  }
                },
                {
                  title: '附件',
                  key: 'DeclareFileState'
                },
                {
                  title: '申报时间',
                  key: 'CreateByDate'
                },
                {
                  title: '操作',
                  key: 'operation',
                  width: 180,
                  align: 'center',
                  render: function (h, params) {
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
                            that.show(params.row)
                          }
                        }
                      }, '查看'),
                      h('Dropdown', {
                        props: {
                          trigger: 'click'
                        }
                      }, [
                        h('div', {
                          'class': {
                            oprateBtn2: true
                          }
                        }, [
                          h('a', {}, '更多'),
                          h('Icon', {
                            props: {
                              type: 'ios-arrow-down'
                            },
                            style: {
                              color: '#1890FF'
                            }
                          })
                        ]),
                        h('DropdownMenu', {
                          slot: 'list'
                        }, [
                          h('DropdownItem', {
                            props: {
                              name: 'detail',
                              disabled: params.row.DeclareState !== 4
                            }
                          }, [
                            h('div', {
                              on: {
                                click: () => {
                                  if (params.row.DeclareState === 4) {
                                    that.dele(params.row)
                                  }
                                }
                              }
                            }, '删除')
                          ]),
                          h('DropdownItem', {
                            props: {
                              name: 'detail',
                              disabled: params.row.DeclareState !== 1
                            }
                          }, [
                            h('div', {
                              on: {
                                click: () => {
                                  if (params.row.DeclareState === 1) {
                                    that.dele(params.row)
                                  }
                                }
                              }
                            }, '撤销')
                          ])
                        ])
                      ])
                    ])

                    // return h('div', [
                    //   h('Icon', {
                    //     props: {
                    //       type: 'md-eye',
                    //       custom: 'xy-table-btn xy-table-hover'
                    //     },
                    //     attrs: {
                    //       title: '查看'
                    //     },
                    //     on: {
                    //       click: function () {
                    //         that.show(params.row)
                    //       }
                    //     }
                    //   }),
                    //   h('Icon', {
                    //     props: {
                    //       type: 'md-close',
                    //       custom:
                    //         params.row.DeclareState === 4
                    //           ? 'xy-table-btn xy-table-hover'
                    //           : 'xy-table-btn xy-table-hover xy-table-disabled'
                    //     },
                    //     attrs: {
                    //       title: '删除'
                    //     },
                    //     on: {
                    //       click: function () {
                    //         if (params.row.DeclareState === 4) {
                    //           that.dele(params.row)
                    //         }
                    //       }
                    //     }
                    //   }),
                    //   // 更多-撤销
                    //   h(
                    //     'Dropdown',
                    //     {
                    //       props: {
                    //         trigger: 'click'
                    //       }
                    //     },
                    //     [
                    //       h('div', [
                    //         h('Icon', {
                    //           props: {
                    //             type: 'ios-more',
                    //             custom:
                    //               params.row.DeclareState === 1
                    //                 ? 'xy-table-btn xy-table-hover'
                    //                 : 'xy-table-btn xy-table-hover xy-table-disabled'
                    //           }
                    //         })
                    //       ]),
                    //       h(
                    //         'DropdownMenu',
                    //         {
                    //           slot: 'list',
                    //           style: {
                    //             display:
                    //               params.row.DeclareState !== 1 ? 'none' : ''
                    //           }
                    //         },
                    //         [
                    //           h('DropdownItem', [
                    //             h(
                    //               'div',
                    //               {
                    //                 on: {
                    //                   click: function () {
                    //                     if (params.row.DeclareState === 1) {
                    //                       that.edit(params.row)
                    //                     }
                    //                   }
                    //                 }
                    //               },
                    //               '撤回'
                    //             )
                    //           ])
                    //         ]
                    //       )
                    //     ]
                    //   )
                    // ])
                  }
                }
              ]
              that.columnsData = res.data.data
              for (var i in that.columnsData) {
                that.columnsData[i].CreateByDate = that.xy.moment(that.columnsData[i].CreateByDate).format('YYYY-MM-DD HH:mm:ss')
              }
            }
          })
      },
      // 创建
      changeLoading: function () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      // 创建课程申请
      ok: function () {
        var _this = this
        this.$refs.formValidateOk.validate(function (valid) {
          if (!valid) {
            console.log('验证失败')
            return _this.changeLoading()
          } else {
            console.log('验证成功')
            _this.xy
              .post(`${_this.$store.state.apiPath}/api/Declare/Create`, {
                DeclareSujectName: _this.formValidateOk.DeclareSujectName,
                DeclareSujectDescribe: _this.formValidateOk.DeclareSujectDescribe,
                // DeclareFile: _this.formValidateOk.DeclareFile,
                DeclareFile: _this.importResult.efile
                // _this.$refs.upfile
              })
              .then(res => {
                if (res.success) {
                  _this.changeLoading()
                  _this.xy.msgSuc('创建成功！')
                  _this.loadTable()
                } else {
                  _this.xy.mError('创建失败', res.msg)
                }
                _this.modalImport = false
                _this.$refs.formValidateOk.resetFields()
                _this.$refs.uploadList.clearFiles()
                _this.uploadFailSuccess = false
              })
          }
        })
      },
      // 关闭创建/编辑弹框触发
      cancel: function () {
        this.$refs.formValidateOk.resetFields()
        this.uploadFail = false
        this.isShowUpload = true
        this.uploadFailSuccess = false
        this.isShow = false
      },
      cancelView: function () {
        this.modalShow = false
        this.isShow = false
        this.isDown = false
      },
      // 单击表格中查看按钮触发
      show: function (row) {
        this.modalShow = true
        if (row.DeclareState === 3) {
          this.isShow = true
        }
        if (row.DeclareFile != null && row.DeclareFile.length > 0) {
          this.isDown = true
        }
        this.DeclareSujectName = row.DeclareSujectName
        this.CreateByDate = row.CreateByDate
        this.DeclareSujectDescribe = row.DeclareSujectDescribe
        this.DeclareFileState = row.DeclareFileState
        this.ApproveOpinion = row.ApproveOpinion
        this.DeclareStateName = row.DeclareStateName
        this.filepath = row.DeclareFile
      },
      edit: function (row) {
        var _this = this
        this.xy.confirm({
          title: '撤回',
          content: '<p>您确认要撤回当前申请吗？</p>',
          onOk: function () {
            _this.xy.post(`${this.$store.state.apiPath}/api/Declare/Revoke?declareID=${row.DeclareID}`,
                          null).then(res => {
                            if (res.success) {
                              // xy.message.success(_this, { content: '撤回成功！' })
                              _this.xy.msgSuc('撤回成功！')
                            } else {
                              // xy.message.error(_this, {
                              //   title: '错误信息',
                              //   content: res.msg
                              // })
                              _this.xy.mError('错误信息', res.msg)
                            }
                            _this.loadTable()
                          }
                          )
          }
        })
      },
      download: function () {
        this.xy.downFile(
          `${this.$store.state.apiPath}/api/Declare/Download?file=${this.filepath}&subjectName=${this.DeclareSujectName}`
        )

        // xy.http.downFile(
        //   xy.string.format(
        //     '{0}/api/Declare/Download?file={1}&subjectName={2}',
        //     xy.subMenuServiceUrl,
        //     this.filepath,
        //     this.DeclareSujectName
        //   )
        // )
      },
      // 单击删除单个内容触发
      dele: function (row) {
        var _this = this
        this.xy.confirm({
          title: '删除',
          content: '<p>您确认要删除当前申请吗？</p>',
          onOk: function () {
            _this.xy.post(`${this.$store.state.apiPath}/api/Declare/Delete?declareID=${row.DeclareID}`,
                          null).then(res => {
                            if (res.success) {
                              // xy.message.success(_this, { content: '删除成功！' })
                              _this.xy.msgError('删除成功！')
                            } else {
                              // xy.message.error(_this, {
                              //   title: '错误信息',
                              //   content: res.msg
                              // })
                              _this.xy.mError('错误信息', res.msg)
                            }
                            if (_this.total > 1) {
                              _this.total = _this.total - 1
                            } else {
                              if (_this.pageIndex > 1) {
                                _this.pageIndex = _this.pageIndex - 1
                              }
                            }
                            // Tablemix.getTP()
                            _this.loadTable()
                          }
                          )
          }
        })
      },
      // 搜索触发
      FromSubmit: function () {
        this.pageIndex = 1
        // Tablemix.option.seachText = this.searchName
        this.loadTable()
      },

      /// /导入
      // BeforeUpload: function (res) {
      //    this.isShowSpin = true;
      // },
      /// /验证格式
      // formatError: function (file, fileList) {
      //    this.isShowSpin = false;
      //    xy.message.error(this, '文件格式不正确！');
      // },
      // exceededErroy: function () {
      //    this.isShowSpin = false;
      //    xy.message.error(this, '文件大小不能超过50M！');
      // },
      /// /上传
      // Success: function (res) {
      //    this.isShowSpin = false;
      //    this.formValidateOk.DeclareFile = res.efile;
      //    if (res.success) {
      //        this.uploadSuccess = true;
      //        this.uploadFail = false;
      //        this.uploadFailSuccess = true;
      //    } else {
      //        // this.isShowUpload = true;
      //        this.uploadSuccess = false;
      //        this.uploadFail = true;
      //        this.uploadFailSuccess = false;
      //        xy.message.error(this, res.msg);
      //    };
      //    if (this.$refs.uploadList.fileList.length > 1) {
      //        this.$refs.uploadList.fileList.splice(0, 1);
      //    };
      // },
      // Error: function (res) {
      //    this.isShowSpin = false;
      //    this.uploadFailSuccess = false;
      //    this.formValidateOk.DeclareFile = "";
      //    xy.message.error(this, 'Error！');
      // },

      // 导入开始---
      // 导入附件
      UpClick: function () {
        this.modalImport = true
      // _this.$refs.uploadImport.clearFiles();
      }

    // 导入结束---
    }
  }
</script>
<style lang="less" scoped>
</style>
