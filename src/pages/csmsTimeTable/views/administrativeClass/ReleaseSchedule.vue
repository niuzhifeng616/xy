<template>
  <div class="xy-content-body pr">
     <XyTable :isShowPage="isShowPage" :tbColumns="columns" :tbData="datatable" :noDataText='noDataText'></XyTable>
    <!-- 编辑名称 -->
    <Modal v-model="modalAddCrouseTable"
           :mask-closable="false"
           :loading="loading"
           :closable="false"
           title="编辑课表名称"
           width="564"
           @on-ok="addCrouseSubmit"
           :transfer="false">
        <div style="font-size:14px;">
            <Form  ref="formValidateOK" :model="formValidateOK" :rules="ruleValidateOK" label-position="top" style="width:500px;">
                <FormItem  label="课表名称" prop="scheduleName" label-for="scheduleName">
                    <Input v-model="formValidateOK.scheduleName" element-id="scheduleName" maxlength="40" clearable style="width: 100%" />
                </FormItem >
            </Form >
        </div>
    </Modal>

    <!-- 启用课表后展示 -->
    <Modal v-model="modalStart"
           title="启用课表"
           :transfer="false"
           :mask-closable="false"
           :closable="false"
           width="750px">
        <div style="font-size:14px;" id="setTimeSelect">
            <div class="startCheck" v-if="!isComplete">
                <div class="generate-course-results" v-if="!isComplete">
                    <span class="iconfont" v-if="!ieError" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
                    <span class="results-notice" v-if="!ieError">正在启用课表，请勿进行其他操作。</span>
                    <span class="results-notice" v-if="ieError">
                        完成校验冲突
                    </span>
                </div>
                <div class="result-head" style="margin-top:20px;">
                    <span>数据队列：</span>
                    <span style="margin-left:5px;" v-cloak>{{current}}/{{total}}</span>
                </div>
                <ul class="clearfix check-list">
                    <li data-index="0" class="complete-option" v-for="item in enableInfo" :key="item.dis">
                        <!-- 等待 -->
                        <span class="state-complete" v-if="item.status == 0">
                            <span class="generate-text" v-cloak>正在等待生成{{item.dis}}。</span>
                        </span>
                        <!-- 进行中 -->
                        <span v-if="item.status == 1">
                            <span class="data-list-state">
                                <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                            </span>
                            <span class="generate-text" v-cloak>正在生成{{item.dis}}。</span>
                            <Progress :percent="percentVal" status="active" :stroke-width="16" />
                        </span>
                        <!-- 成功 -->
                        <span v-if="item.status == 2">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="ios-checkmark-circle" />
                            </span>
                            <span class="generate-text" v-cloak>成功生成{{item.dis}}。</span>
                        </span>
                        <!-- 失败 -->
                        <span v-if="item.status == 3">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="md-close-circle" color="#ed4014" />
                            </span>
                            <span class="generate-text" v-cloak>生成{{item.dis}}失败。</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="isComplete" class="text-center" style="min-height:300px;">
            <Icon type="ios-checkmark-circle" size="60" style="color:#42d456;margin-top:90px;" />
            <p style="font-size:16px;margin:10px;" v-cloak>
                该结果共耗时{{completeTime}}，成功启用课表。点击查看
                <span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="isComplete = false">日志明细</span>
            </p>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close"  v-if="modalClose" @click="modalStart =false">关闭</Button>
        </div>
    </Modal>

    <!-- 停用课表后展示 -->
    <Modal v-model="modalEnd"
           title="停用课表"
           :transfer="false"
           :mask-closable="false"
           :closable="false"
           width="750px">
        <div style="font-size:14px;" id="setTimeSelect">
            <div class="startCheck" v-if="!isCompleteUn">
                <div class="generate-course-results" v-if="!isCompleteUn">
                    <span class="iconfont" v-if="!ieError1" style="color:#F5222D; margin:2px 10px 0 0">&#xe6d9;</span>
                    <span class="results-notice" v-if="!ieError1">正在停用课表，请勿进行其他操作。</span>
                    <span class="results-notice" v-if="ieError1">完成校验冲突</span>
                </div>
                <div class="result-head" style="margin-top:20px;">
                    <span>数据队列：</span>
                    <span style="margin-left:5px;" v-cloak>{{current}}/{{total}}</span>
                </div>
                <ul class="clearfix check-list">
                    <li data-index="0" class="complete-option" v-for="item in enableInfo" :key="item.dis">
                        <!-- 等待 -->
                        <span class="state-complete" v-if="item.status == 0">
                            <span class="generate-text" v-cloak>正在等待删除{{item.dis}}。</span>
                        </span>
                        <!-- 进行中 -->
                        <span v-if="item.status == 1">
                            <span class="data-list-state">
                                <span class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
                            </span>
                            <span class="generate-text" v-cloak>正在删除{{item.dis}}。</span>
                            <Progress :percent="percentVal" status="active" :stroke-width="16" />
                        </span>
                        <!-- 成功 -->
                        <span v-if="item.status == 2">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="ios-checkmark-circle" />
                            </span>
                            <span class="generate-text" v-cloak>成功删除{{item.dis}}。</span>
                        </span>
                        <!-- 失败 -->
                        <span v-if="item.status == 3">
                            <span class="data-list-state data-list-state-error">
                                <Icon type="md-close-circle" color="#ed4014" />
                            </span>
                            <span class="generate-text" v-cloak>删除{{item.dis}}失败。</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="isCompleteUn" class="text-center" style="min-height:300px;">
            <Icon type="ios-checkmark-circle" size="60" style="color:#42d456;margin-top:90px;" />
            <p style="font-size:16px;margin:10px;" v-cloak>
                该结果共耗时{{completeTimeUn}}，成功停用课表。点击查看
                <span style="margin:0 5px;color:#2d8cf0;cursor:pointer" @click="isCompleteUn = false">日志明细</span>
            </p>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close"  v-if="modalClose" @click="modalEnd =false">关闭</Button>
        </div>

    </Modal>

    <!-- 发布有冲突，是否下载 -->
    <Modal v-model="modalCheck"
           :mask-closable="false"
           :closable="false"
           title="冲突提示"
           :transfer="false">
        <div style="font-size:14px;">
            <p>是否强制发布？</p>
            <span @click="downError" style="color:#5cadff;margin-top:10px;cursor:pointer">下载冲突详情</span>
        </div>
        <div slot="footer">
            <Button class="xy-modal-close" @click="modalCheck =false">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="timeTablePublished(errorSloverResultCollectionID)">确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
  import XyTable from '@/components/table/XyTable.vue'
  export default {
    components: {
      XyTable
    },
    data () {
      return {
        noDataText: '您还没有排课课表的信息，请添加课表。',
        StepsHeader: {},
        classPlan: {},
        completeTime: '',
        completeTimeUn: '',
        loading: true,
        formValidateOK: {
          scheduleName: ''
        },
        ruleValidateOK: {
          scheduleName: [
            { required: true, message: '课表名称不能为空', trigger: 'blur' },
            { max: 40, message: '课表名称不能超过40个字', trigger: 'blur' }
          ]
        },
        editorNameRow: '',
        modalAddCrouseTable: false,
        enableInfo: [],
        total: '',
        isComplete: false,
        isCompleteUn: false,
        ieError: false,
        ieError1: false,
        modalClose: false,
        percentVal: 0,
        current: 1,
        modalStart: false,
        modalEnd: false,
        isShowPage: false,
        datatable: [],
        columns: [
          {
            title: '课表名称',
            key: 'SloverResultCollectionName',
            minwidth: 200
          },
          {
            title: '发布状态',
            key: 'IsPublished',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: params.row.IsPublished === true ? '已发布' : '未发布'
                  }
                })
              ])
            }
          },
          {
            title: '启用状态',
            key: 'IsEnabled',
            className: 'set-dot',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  'class': 'dot',
                  style: {
                    background:
                      params.row.IsEnabled === 0 ? '#666'
                      : params.row.IsEnabled === 1 ? '#52C41A'
                        : params.row.IsEnabled === 2 ? '#F5222D' : ''
                  }
                }),
                h('span', {
                  domProps: {
                    innerHTML: params.row.IsEnabled === 0 ? '未用 ' : params.row.IsEnabled === 1 ? '启用' : params.row.IsEnabled === 2 ? '停用' : ''
                  },
                  style: {
                    color:
                      params.row.IsEnabled === 0 ? '#666'
                      : params.row.IsEnabled === 1 ? '#52C41A'
                        : params.row.IsEnabled === 2 ? '#F5222D' : ''
                  }
                })
              ])
            }
          },
          {
            title: '操作',
            width: 180,
            render: (h, params) => {
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, [
                h('a', {
                  'class': {
                    disabled: params.row.IsEnabled === 1,
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      this.IsPublishedFun(params.row)
                    }
                  }
                }, params.row.IsPublished ? '取消发布' : '发布课表'),
                h('Dropdown', {
                  props: {
                    trigger: 'click'
                  }
                }, [
                  h('div', {
                    'class': {
                      disabled: false,
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
                        disabled: !params.row.IsPublished
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            this.IsEnableFun(params.row)
                          }
                        }
                      }, params.row.IsEnabled === 1 ? '停用课表' : '启用课表')
                    ]),
                    h('DropdownItem', {
                      props: {
                        name: 'detail'
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            this.adjustSchedule(params.row)
                          }
                        }
                      }, '调整课表')
                    ]),
                    h('DropdownItem', {
                      props: {
                        name: 'detail'
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            this.kbfx(params.row)
                          }
                        }
                      }, '课表分析')
                    ]),
                    h('DropdownItem', {
                      props: {
                        name: 'detail'
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            this.downSchedule(params.row)
                          }
                        }
                      }, '导出课表')
                    ]),
                    h('DropdownItem', {
                      props: {
                        name: 'detail'
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            this.editorName(params.row)
                          }
                        }
                      }, '编辑名称')
                    ]),
                    h('DropdownItem', {
                      props: {
                        name: 'detail',
                        disabled: params.row.IsPublished
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            this.delSchedule(params.row)
                          }
                        }
                      }, '删除课表')
                    ])
                  ])
                ])
              ])
            }
          }
        ],
        // 下载冲突
        errorSloverResultCollectionID: '',
        modalCheck: false,
        errorMsg: ''
      }
    },
    created () {
      this.StepsHeader = this.$parent
      this.classPlan = this.$store.state.csmstimetable.admininstrativeRowObj
      this.getTP()
    },
    mounted: function () {

    },
    methods: {
      // 获取table/分页数据
      async getTP () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/SloverResultCollection/GetSloverResultCollectionList`, {
          classTableID: this.classPlan.classTableID
        })
        this.xy.unloading()
        if (res.success) {
          this.datatable = []
          this.datatable = res.data
        }
      },
      // 发布或取消课表
      async IsPublishedFun (row) {
        if (row.IsEnabled !== 1) {
          if (row.IsPublished) { // 取消课表
            this.xy.loading()
            let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTableUnPublished`, {
              id: row.SloverResultCollectionID
            })
            this.xy.unloading()
            if (res.success) {
              this.xy.msgSuc('取消课表成功。')
              this.StepsHeader.getGeneralFlows()
              this.getTP()
            }
          } else { // 发布课表
            var index = this.datatable.map((item) => { return item.IsPublished }).indexOf(true)
            if (index > -1) {
              this.xy.msgError('已存在发布成功的课表。')
              return false
            };
            this.xy.loading()
            let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTablePublishedForCheck`, {
              ClassTableID: this.classPlan.classTableID,
              SloverResultCollectionID: row.SloverResultCollectionID
            })
            this.xy.unloading()
            if (res.success) {
              this.timeTablePublished(row.SloverResultCollectionID)
            } else {
              this.modalCheck = true
              this.errorSloverResultCollectionID = row.SloverResultCollectionID
              this.errorMsg = res.data
            };
          }
        }
      },
      // 下载冲突信息
      downError () {
        var errorMsg = ''
        for (var i = 0; i < this.errorMsg.length; i++) {
          errorMsg += this.errorMsg[i] + '\r\n'
        }
        this.download('error.txt', errorMsg)
      },
      download (fileName, content) {
        if (window.navigator.msSaveOrOpenBlob) {
          // if browser is IE
          var blob = new Blob([decodeURIComponent(encodeURI(content))], {
            type: 'text/csv;charset=utf-8;'
          })
          navigator.msSaveBlob(blob, fileName)
        } else {
          var urlObject = window.URL || window.webkitURL || window
          // eslint-disable-next-line camelcase
          var export_blob = new Blob([content], { type: 'text/plain' })
          // eslint-disable-next-line camelcase
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
          save_link.href = urlObject.createObjectURL(export_blob)
          save_link.download = fileName
          fakeClick(save_link)
        }
        function fakeClick (obj) {
          var ev = document.createEvent('MouseEvents')
          ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          obj.dispatchEvent(ev)
        }
      },
      // 发布课表
      async timeTablePublished (sloverResultCollectionID) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTablePublished`, {
          ClassTableID: this.classPlan.classTableID,
          SloverResultCollectionID: sloverResultCollectionID
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('发布课表成功。')
          this.modalCheck = false
          this.StepsHeader.getGeneralFlows()
          this.getTP()
        }
      },
      // 调整课表
      adjustSchedule (row) {
        this.$store.commit('common/getParam', {
          IDPre: row.SloverResultCollectionID,
          NamePre: row.SloverResultCollectionName
        })
        this.$router.push({
          path: '/xyhome/administrativeStepHeader/administrativeSchedule',
          query: this.$store.state.common.menuInfo
        })
      },
      // 编辑名称
      editorName (row) {
        this.formValidateOK.scheduleName = row.SloverResultCollectionName
        this.editorNameRow = row
        this.modalAddCrouseTable = true
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      // 保存编辑名称
      addCrouseSubmit () {
        this.loading = true
        this.$refs.formValidateOK.validate((valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            this.EditNameHttp()
          }
        })
      },
      async EditNameHttp () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/EditName`, {
          SloverResultCollectionID: this.editorNameRow.SloverResultCollectionID,
          SloverResultCollectionName: this.formValidateOK.scheduleName
        })
        this.xy.unloading()
        if (res.success) {
          this.changeLoading()
          this.xy.msgSuc('编辑课表名称成功。')
          this.getTP()
        }
        this.modalAddCrouseTable = false
      },
      // 导出课表
      downSchedule: function (row) {
        this.xy.downFile(`${this.$store.state.apiPath}/api/SloverResultCollection/ExportTimeTable?classTableID=${row.ClassTableID}&sloverResultCollectionID=${row.SloverResultCollectionID}&sloverResultCollectionName=${row.SloverResultCollectionName}`)
      },
      // 删除课表
      delSchedule (row) {
        if (!row.IsPublished) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '您确定要删除' + row.SloverResultCollectionName + '吗？',
            onOk: () => {
              this.delScheduleHttp(row)
            }
          })
        }
      },
      async delScheduleHttp (row) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTableDelete`, {
          id: row.SloverResultCollectionID
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.StepsHeader.getGeneralFlows()
          this.getTP()
        }
      },
      // 启用课表或停用课表
      IsEnableFun (row) {
        if (row.IsPublished) {
          this.isComplete = false
          this.isCompleteUn = false
          this.ieError = false
          this.ieError1 = false
          this.modalClose = false
          if (row.IsEnabled === 1) { // 停用课表
            this.$Modal.confirm({
              title: '温馨提示',
              content: '请确认是否停用课表吗?',
              onOk: () => {
                this.UnEnableCrouse(row.SloverResultCollectionID)
              }
            })
          } else { // 启用课表
            this.$Modal.confirm({
              title: '温馨提示',
              content: '请确认是否启用课表吗?',
              onOk: () => {
                this.enableCrouse(row.SloverResultCollectionID)
              }
            })
          }
        }
      },
      // 停用课表
      async UnEnableCrouse (SloverResultCollectionID) {
        this.completeTimeUn = new Date()
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GenerateTimeTableInfo`, {
          classTableID: this.classPlan.classTableID,
          sloverResultCollectionID: SloverResultCollectionID
        })
        if (res.success) {
          var resData = res.data
          this.enableInfo = []
          for (var i = 0; i < resData.Date.length; i++) {
            this.enableInfo.push({// status:0等待；1进行中；2成功；3失败
              startDate: this.xy.moment(resData.Date[i].StartDate).format('YYYY-MM-DD'),
              endDate: this.xy.moment(resData.Date[i].EndDate).format('YYYY-MM-DD'),
              dis: '本排课方案' + this.xy.moment(resData.Date[i].StartDate).format('YYYY-MM-DD') +
                '至' + this.xy.moment(resData.Date[i].EndDate).format('YYYY-MM-DD') + '的课表数据',
              status: 0
            })
          };
          this.enableInfo.push({
            dis: '课表结果数据',
            status: 0
          })
          this.enableInfo.push({
            dis: '排课方案',
            status: 0
          })
          this.total = this.enableInfo.length
          this.modalEnd = true
          this.postUnGenerateTimeTable(resData, 0, this.enableInfo.length)// 分步请求
        }
      },
      // 停用课表分步请求
      async postUnGenerateTimeTable (resData, j, length) {
        this.enableInfo[j].status = 1
        this.percentVal = 0
        if (j < length) {
          this.current = j + 1
        }
        if (j + 1 === length) { // 最后一次执行完成后停用课表
          // this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTableUnEnabled`, {
            id: resData.sloverResultCollectionID
          })
          // this.xy.unloading()
          if (res.success) {
            this.enableInfo[j].status = 2
            var nowDate = new Date()
            this.completeTimeUn = this.formatSeconds((nowDate.getTime() - this.completeTimeUn.getTime()) / 1000)
            this.isCompleteUn = true
            this.modalClose = true
            this.ieError1 = true
            this.getTP()
          } else {
            this.enableInfo[j].status = 3
            this.modalClose = true
          };
          return false
        };
        this.percentFun()
        if (j + 2 === length) { // 最后一次执行
          // this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/UnGenerateTimeTableResult`, {
            id: this.classPlan.classTableID
          })
          // this.xy.unloading()
          if (res.success) {
            this.enableInfo[j].status = 2
            if (j < length) {
              j++
              this.postUnGenerateTimeTable(resData, j, this.total)
            };
          } else {
            this.enableInfo[j].status = 3
            this.modalClose = true
          };
        };
        if (j + 2 < length) {
          // this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/UnGenerateTimeTable`, {
            ClassTableID: this.classPlan.classTableID,
            SloverResultCollectionID: resData.sloverResultCollectionID,
            StartDate: this.enableInfo[j].startDate,
            EndDate: this.enableInfo[j].endDate
          })
          // this.xy.unloading()
          if (res.success) {
            this.enableInfo[j].status = 2
            this.percentVal = 100
            if (j < length) {
              j++
              this.postUnGenerateTimeTable(resData, j, this.total)
            };
          } else {
            this.enableInfo[j].status = 3
            this.modalClose = true
          };
        };
      },
      // 启用课表
      async enableCrouse (SloverResultCollectionID) {
        this.completeTime = new Date()
        // this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/GenerateTimeTableInfo`, {
          classTableID: this.classPlan.classTableID,
          sloverResultCollectionID: SloverResultCollectionID
        })
        // this.xy.unloading()
        if (res.success) {
          var resData = res.data
          this.enableInfo = []
          for (var i = 0; i < resData.Date.length; i++) {
            this.enableInfo.push({// status:0等待；1进行中；2成功；3失败
              startDate: this.xy.moment(resData.Date[i].StartDate).format('YYYY-MM-DD'),
              endDate: this.xy.moment(resData.Date[i].EndDate).format('YYYY-MM-DD'),
              dis: '本排课方案' + this.xy.moment(resData.Date[i].StartDate).format('YYYY-MM-DD') +
                '至' + this.xy.moment(resData.Date[i].EndDate).format('YYYY-MM-DD') + '的课表数据',
              status: 0
            })
          };
          this.enableInfo.push({
            dis: '课表结果数据',
            status: 0
          })
          this.enableInfo.push({
            dis: '排课方案',
            status: 0
          })
          this.total = this.enableInfo.length
          this.modalStart = true
          this.postGenerateTimeTable(resData, 0, this.enableInfo.length)
        }
      },
      // 启用课表分步请求
      async postGenerateTimeTable (resData, j, length) {
        this.enableInfo[j].status = 1
        this.percentVal = 0
        if (j < length) {
          this.current = j + 1
        };
        if (j + 1 === length) { // 最后一次执行完成后启用课表
          // this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/TimeTableEnabled`, {
            id: resData.sloverResultCollectionID
          })
          // this.xy.unloading()
          if (res.success) {
            this.enableInfo[j].status = 2
            var nowDate = new Date()
            this.completeTime = this.formatSeconds((nowDate.getTime() - this.completeTime.getTime()) / 1000)
            this.isComplete = true
            this.modalClose = true
            this.ieError = true
            this.getTP()
          } else {
            this.enableInfo[j].status = 3
            this.modalClose = true
          }
        };
        this.percentFun()
        if (j + 2 === length) { // 最后一次执行
          // this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/GenerateTimeTableResult`, {
            ClassTableID: this.classPlan.classTableID,
            SloverResultCollectionID: resData.sloverResultCollectionID
          })
          // this.xy.unloading()
          if (res.success) {
            this.enableInfo[j].status = 2
            if (j < length) {
              j++
              this.postGenerateTimeTable(resData, j, this.total)
            };
          } else {
            this.enableInfo[j].status = 3
            this.modalClose = true
          };
        };
        if (j + 2 < length) {
          // this.xy.loading()
          let res = await this.xy.post(`${this.$store.state.apiPath}/api/SloverResultCollection/GenerateTimeTable`, {
            ClassTableID: this.classPlan.classTableID,
            SloverResultCollectionID: resData.sloverResultCollectionID,
            StartDate: this.enableInfo[j].startDate,
            EndDate: this.enableInfo[j].endDate
          })
          // this.xy.unloading()
          if (res.success) {
            this.enableInfo[j].status = 2
            this.percentVal = 100
            if (j < length) {
              j++
              this.postGenerateTimeTable(resData, j, this.total)
            }
          } else {
            this.enableInfo[j].status = 3
            this.modalClose = true
          }
        };
      },
      // 进度条
      percentFun () {
        if (this.percentVal < 90) {
          this.percentVal += 1
          setTimeout(() => {
            this.percentFun()
          }, 200)
        }
      },
      // 秒转时分秒
      formatSeconds (value) {
        var secondTime = parseInt(value)// 秒
        var minuteTime = 0// 分
        var hourTime = 0// 小时
        if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
          // 获取分钟，除以60取整数，得到整数分钟
          minuteTime = parseInt(secondTime / 60)
          // 获取秒数，秒数取佘，得到整数秒数
          secondTime = parseInt(secondTime % 60)
          // 如果分钟大于60，将分钟转换成小时
          if (minuteTime > 60) {
            // 获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60)
            // 获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60)
          }
        }
        var result = '' + parseInt(secondTime) + '秒'

        if (minuteTime > 0) {
          result = '' + parseInt(minuteTime) + '分' + result
        } else {
          result = '' + 0 + '分' + result
        }
        if (hourTime > 0) {
          result = '' + parseInt(hourTime) + '小时' + result
        } else {
          result = '' + 0 + '小时' + result
        }
        return result
      },
      kbfx (row) {
        this.StepsHeader.liData.map((item) => {
          item.isActive = false
          return item
        })
        this.StepsHeader.liData[7].isActive = true
        this.$store.commit('common/getParam', {
          IDPre: row.SloverResultCollectionID,
          NamePre: row.SloverResultCollectionName
        })
        this.$router.push({
          path: '/xyhome/administrativeStepHeader/administrativeScheduleAnalysis',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.schedule-li {
    width: 303px;
    height: 232px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 8px 0px rgba(183,183,183,0.5);
    border-radius: 4px;
    padding:22px 12px;
    display:inline-block;
    margin:16px 33px;
}
.shedule-info{
    margin-bottom:22px;
    display:flex;
    align-items:center;
}
.shedule-icon {
    width: 48px;
    height: 48px;
    line-height: 48px;
    background: rgba(238,245,255,1);
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
}
.schedule-footer {
    width:100%;
    height: 40px;
    background: rgba(249,250,251,1);
    position:absolute;
    bottom:0;
    left:0;
    display:flex;
    align-items:center;
}
.schedule-footer .footer-line {
    width: 1px;
    height: 15px;
    background: rgba(221,222,223,1);
    border: 1px solid rgba(229,229,229,1);
}
.schedule-footer .footer-btn {
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #999999;
    cursor: pointer;
}
.schedule-footer .footer-btn-disabled {
    color: #ddd;
    cursor: no-drop;
}
.shedule-name {
    font-weight: bold;
    color: #444;
    margin-left: 18px;
    width:200px;
}
.state-type {
    color: #999999;
}
.type-name {
    color: #666666
}
/*
   启动课表
*/
.generate-course-results {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #fff7dd;
    border-radius: 4px;
}
.generate-course-results > .fa {
    color: #df4444;
    line-height: 30px;
    margin-left: 10px;
}
.generate-course-results > .results-notice {
    color: #df4444;
}
.check-list {
    width: 100%;
    min-height: 220px;
}
.check-list li{
    padding:5px 0;
}
.check-list .generate-text{
    font-size:14px;
}
.check-list .ivu-icon{
    font-size:32px;
}
.check-list .ivu-icon-ios-checkmark-circle{
    color:#19be6b;
}
.check-list .ivu-icon-ios-close-circle{
    color:#ed4014;
}
.check-list .fa-spin{
    color:#5cadff;
}
.startCheck{
    max-height:500px;
    overflow-y:scroll;
}
.modal-section-ul{
    display:flex;
    justify-content:flex-start;
    flex-wrap: wrap;
}
.modal-section-ul li{
     cursor: pointer;
    padding: 16px 0;
    color: #4285f4;
    border: 1px solid #d4e4ff;
    overflow: hidden;
    margin: 10px;
    border-radius: 8px;
    width: 96px;
    text-align: center;
}
.modal-section-ul li:hover{
     color: #fff;
    background-image: -moz-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -webkit-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -ms-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    text-align: center;
    color: #fff;
    transition: all 0.3s;
}
.modal-section-ul .section-active{
    color: #fff;
    background-image: -moz-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -webkit-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    background-image: -ms-linear-gradient( 0deg, rgb(44,193,225) 0%, rgb(31,153,240) 49%, rgb(18,113,255) 100%);
    text-align: center;
    color: #fff;
    transition: all 0.3s;
}
/*通用*/
.danger-btn {
    padding: 4px 15px;
    color: #4196FF;
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid #4196FF;
    white-space: nowrap;
    line-height: 1.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 12px;
    border-radius: 4px;
    -webkit-transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear,-webkit-box-shadow .2s linear;
    background-color: #fff;
}

    .danger-btn:hover {
        color: #FF8C8C;
        border: 1px solid #FDBBBB;
        background: #FFECED;
        text-decoration: none;
    }

    .danger-btn:active, .danger-btn:focus {
        color: #2b85e4;
        background-color: #fff;
        border-color: #2b85e4;
        outline: 0;
    }

.primary-btn {
    padding: 4px 15px;
    color: #fff;
    border: 1px solid #4196FF;
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    white-space: nowrap;
    line-height: 1.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 12px;
    border-radius: 4px;
    -webkit-transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear,-webkit-box-shadow .2s linear;
    background: #4196FF;
}

    .primary-btn:active, .primary-btn:focus {
        outline: 0;
    }

.primary-btn-ghost {
    padding: 4px 15px;
    color: #4196FF;
    border: 1px solid #4196FF;
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    white-space: nowrap;
    line-height: 1.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 12px;
    border-radius: 4px;
    -webkit-transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
    transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear,-webkit-box-shadow .2s linear;
    background-color: #fff;
}

    .primary-btn-ghost:hover {
        background: rgba(65, 150, 255,0.1);
        text-decoration: none;
    }

    .primary-btn-ghost:active, .primary-btn-ghost:focus {
        outline: 0;
    }

.btn-disabled {
    background-color: #E9E9E9 !important;
    color: #999 !important;
    border: none;
}

    .btn-disabled:hover {
        background-color: #E9E9E9 !important;
        color: #999 !important;
        border: none;
        text-decoration: none;
    }

    .btn-disabled:active, .btn-disabled:focus {
        background-color: #E9E9E9 !important;
        color: #999 !important;
        border: none;
        outline: 0;
    }

.shape-circle {
    border-radius: 32px;
}
@media screen and (max-width: 1366px) {
    .schedule-li {
        margin: 10px;
    }
}
</style>
