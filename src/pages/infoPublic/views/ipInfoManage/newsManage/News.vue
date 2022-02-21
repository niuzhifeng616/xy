<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between xy-center">
      <div>
        <Button class="xy-primary" @click="newsCreate">创建新闻</Button>
        <!--<Button type="xy-danger" @click="delAll">批量删除</Button>-->
        <Button class="xy-info" @click="ImportClick">发布到班牌</Button>
      </div>
      <div>
        <Select
          v-model="newType"
          @on-change="newTypeChange"
          class="xy-content-title-search"
          placeholder="选择新闻类型"
          style="width:150px"
        >
          <Option :value="0">所有类型</Option>
          <Option
            v-for="item in newTypeList"
            :value="item.NewsTypeID"
            :key="item.NewsTypeID"
            v-cloak
          >{{ item.NewsTypeName }}</Option>
        </Select>
        <DatePicker
          v-model="queryDate"
          type="daterange"
          @on-change="newDateChange"
          style="margin-left:15px;"
          placeholder="请选择显示时间"
          :editable="false"
        ></DatePicker>
        <Input
          search
          v-model="searchText"
          @on-search="FromSubmit"
          placeholder="输入新闻标题或内容"
          class="xy-content-title-search"
          style="width: auto;"
         />
      </div>
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :scrollx="'max-content'"
        :rowSelection="tableRowSelection"
        :columns="columns"
        :dataSource="columnsData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
        >
        <span slot="Num" slot-scope="text, record, index">
          {{index+1}}
        </span>
        <span slot="NewsTitle" slot-scope="text, record">
          <span v-if="!record.Disabled" class="table-el-hover" @click="edit(record)">
            {{record.NewsTitle == null ? '--' : record.NewsTitle}}
          </span>
          <span v-else>{{record.NewsTitle == null ? '--' : record.NewsTitle}}</span>
        </span>
        <span slot="StartDate" slot-scope="text, record">
          {{record.StartDate===''?'--':xy.moment(record.StartDate).format('YYYY-MM-DD HH:mm')}}
        </span>
        <span slot="EndDate" slot-scope="text, record">
          {{record.EndDate===''?'--':xy.moment(record.EndDate).format('YYYY-MM-DD HH:mm')}}
        </span>
        <span slot="action" slot-scope="text, record">
          <a :disabled="record.Disabled" @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="see(record)">查看详情</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" :disabled="record.Disabled" @click="del(record)">删除</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </XyAntTable>
      <Modal fullscreen
        v-model="newsSee"
        :transfer="false"
        :loading="loading"
        title="查看新闻"
        :mask-closable="false"
        v-cloak
        >
        <div>
          <div style="width: 410px;margin: 0 auto;">
            <Form>
              <FormItem label="新闻类型">
                <span>{{showNewsTypeName}}</span>
              </FormItem>
              <FormItem label="新闻标题">
                <span>{{showNewsTitle}}</span>
              </FormItem>
              <FormItem label="新闻图片">
                <img :src="showNewsImageLink" style="width:300px;" />
              </FormItem>
              <FormItem label="发布内容">
                <span id="showCont" v-cloak>{{showNewsContent}}</span>
              </FormItem>
              <FormItem label="发布时间">
                <span
                  style="font-size:14px;"
                >{{showStartDate}} - {{showEndDate}}</span>
                <!--<span style="font-size:14px;" v-cloak>
                                共{{dayNumber}}天
                </span>-->
              </FormItem>
            </Form>
          </div>
        </div>
        <div slot="footer">
          <Button class="xy-modal-primary" shape="circle" @click="newsSeeCancel">取消</Button>
        </div>
      </Modal>
      <!--新增发布任务-->
      <ToReleaseTask
        :taskCreate="taskCreate"
        :publicItem="publicItem"
        :taskList="taskList"
        @changeDate='changeDate'
        @closeTaskModal="closeTaskModal"
        ></ToReleaseTask>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import ToReleaseTask from '@/pages/infoPublic/components/ToReleaseTask.vue'
  export default {
    name: 'News',
    components: {
      XyAntTable,
      ToReleaseTask
    },
    data () {
      return {
        nullData: '该搜索条件下没有结果。',
        tableLoading: true,
        selectedRowKeys: [],
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
            this.pageIndex = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
            this.pageIndex = 1
            this.pageSize = pageSize
          }
        },
        loading: true,
        searchText: '',
        pageSize: 15,
        pageIndex: 1,
        columns: [
          {
            title: '序号',
            width: 70,
            scopedSlots: { customRender: 'Num' }
          },
          {
            title: '新闻标题',
            dataIndex: 'NewsTitle',
            scopedSlots: { customRender: 'NewsTitle' }
          },
          {
            title: '新闻类型',
            width: 100,
            dataIndex: 'NewsTypeName'
          },
          {
            title: '预设发布时间',
            dataIndex: 'StartDate',
            width: 160,
            scopedSlots: { customRender: 'StartDate' }
          },
          {
            title: '结束时间',
            width: 160,
            dataIndex: 'EndDate',
            scopedSlots: { customRender: 'EndDate' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 140,
            scopedSlots: { customRender: 'action' }
          }
        ],
        columnsData: [],
        pageList: 0,
        selectionAll: [],
        // 新闻类型
        newType: 0,
        // 查询日期
        queryDate: [],
        // 新闻类型
        newTypeList: [],
        // 展示新闻
        newsSee: false,
        showresourceID: '',
        showNewsTypeID: '',
        showNewsTitle: '',
        showNewsImageLink: '',
        showStartDate: '',
        showEndDate: '',
        showNewsContent: '',
        showFileName: '',
        showNewsTypeName: '',
        showIndex: '',
        dayNumber: '',
        disabledSee: false,
        // 新建发布任务---开始
        taskCreate: false,
        taskList: [],
        formValidateTaskOK: {
          publicName: ''
        },
        ruleValidateTaskOK: {
          publicName: [
            { required: true, message: '任务名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 20,
              message: '任务名称不能超过20个字',
              trigger: 'blur'
            }
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
        tremianlArr: [],
        classTerminalIDs: [],
        publicItem: {},
        apiPath: this.$store.state.apiPath
      // 新建发布任务---结束
      }
    },
    created () {
      this.GetNewsType()
      this.loadTable()
    },
    computed: {
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange
        }
      }
    },
    methods: {
      closeTaskModal (val) {
        this.taskCreate = false
        this.publicItem = {}
        this.taskList = []
      },
      handleTableChange () {
        this.loadTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      changePage (index) {
        this.pageIndex = index
        this.loadTable()
      },
      changePageSize (size) {
        this.pageIndex = 1
        this.pageSize = size
        this.loadTable()
      },
      async loadTable () {
        this.taskCreate = false
        this.tableLoading = true
        let option = {}
        if (this.queryDate[0] !== '' && this.queryDate[1] !== '') {
          option = {
            HostName: this.$store.state.apiPath,
            SearchText: this.searchText,
            NewsTypeID: this.newType,
            StartDate: this.queryDate[0],
            EndDate: this.queryDate[1],
            PageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        } else {
          option = {
            HostName: this.$store.state.apiPath,
            SearchText: this.searchText,
            NewsTypeID: this.newType,
            PageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        }
        let res = await this.xy.get(
          `${this.apiPath}/api/Resource/GetNewsByPage`,
          option
        )
        this.tableLoading = false
        if (res.success) {
          this.pageIndex = 1
          this.pagination.current = 1
          this.columnsData = res.data.data
          this.pagination.total = res.data.totalRecords
          // 如果有复选框需要赋值成空数组
          this.selectedRowKeys = []
          this.selectionAll = []
          this.pageList = res.data.data.length
        }
      },
      // 选择新闻类型下拉框
      GetNewsType () {
        this.xy.get(`${this.apiPath}/api/Resource/GetNewsType`, null)
          .then(res => {
            if (res.success) {
              this.newTypeList = res.data
            } else {
              this.xy.msgError(res.msg)
            }
            this.xy.unloading()
          })
      },
      // 创建新闻
      newsCreate () {
        this.$store.commit('common/getThreeMenuName', '创建新闻')
        this.$router.push({
          path: '/xyHome/NewsCreate',
          query: this.$store.state.common.menuInfo
        })
      // xy.http.load(xy.string.format('{0}/View/ipInfoManage/NewsManage/PC/View/NewsCreate.html', xy.subMenuWebUrl))
      },
      // 编辑新闻
      edit (val) {
        this.$store.commit('common/getThreeMenuName', '编辑新闻')
        this.$store.commit('common/getParam', { resourceID: val.resourceID })
        this.$router.push({
          name: 'NewsEdit',
          query: this.$store.state.common.menuInfo
        })
      },
      // 单击删除新闻
      del (val) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除"' + val.NewsTitle + '"吗？</p>',
          onOk: () => {
            //  xy.string.format('{0}/api/Resource/DeleteNews?id={1}', xy.subMenuServiceUrl, ids)
            this.modal_loading = true
            this.xy.post(
              `${this.apiPath}/api/Resource/DeleteNews?id=${val.resourceID}`,
              null
            )
              .then(res => {
                if (res.success) {
                  this.xy.msgSuc('删除成功。')
                  if (this.pageList > 1) {
                    this.pageList = this.pageList - 1
                  } else {
                    if (this.pageIndex > 1) {
                      this.pageIndex = this.pageIndex - 1
                    }
                  }
                  this.loadTable()
                } else {
                  this.xy.msgError(res.msg)
                }
                this.modal_loading = false
              })
          }
        })
      },
      // 全选/取消全选触发
      changeSelect (selection) {
        this.selectionAll = selection
      },
      // 单击批量删除触发
      delAll () {
        this.modal_loading = true
        let idsStr = []
        if (this.selectionAll.length < 1) {
          this.xy.msgError('请选择要删除的新闻。')
        } else {
          this.$Modal.confirm(this, {
            title: '批量删除',
            content: '<p>您确认要删除选中的所有新闻吗？</p>',
            onOk: () => {
              $.each(this.selectionAll, function (index, item) {
                idsStr.push(item.resourceID)
              })
              this.xy
                .post(
                  `${this.apiPath}/api/Resource/DeleteNews?id={1}`,
                  null
                )
                .then(res => {
                  if (!res.success) {
                    this.modal_loading = false
                    // xy.message.error(_this, { title: '批量删除失败', content: res.msg })
                    this.xy.msgError('批量删除失败。')
                    return this.changeLoading()
                  } else {
                    if (
                      this.selectionAll.length === this.pageList &&
                      this.pageIndex > 1
                    ) {
                      this.pageIndex = this.pageIndex - 1
                    }
                    this.loadTable()
                    this.xy.msgSuc('删除成功。')
                    this.modal_loading = false
                    this.selectionAll = []
                  }
                })
            }
          })
        }
      },
      // 查看新闻
      see (val) {
        this.newsSee = true
        this.showresourceID = val.resourceID
        this.showNewsTypeID = val.NewsTypeID
        this.showNewsTitle = val.NewsTitle
        this.showNewsImageLink = val.NewsImageLink
        this.showStartDate = this.xy.moment(val.StartDate).format('YYYY-MM-DD HH:mm')
        this.showEndDate = this.xy.moment(val.EndDate).format('YYYY-MM-DD HH:mm')
        this.showNewsContent = val.NewsContent
        this.showFileName = val.FileName
        this.showNewsTypeName = val.NewsTypeName
        this.showIndex = val.index
        this.disabledSee = val.Disabled
        $('#showCont').html(this.showNewsContent)
        let dayNumber = (new Date(this.showEndDate) - new Date(this.showStartDate)) / (1000 * 60 * 60 * 24)
        this.dayNumber = dayNumber
      },
      // 关闭查看弹框
      newsSeeCancel () {
        this.newsSee = false
      },
      // 搜素新闻
      FromSubmit () {
        // Tablemix.option.SearchText = this.searchText
        this.pageIndex = 1
        this.loadTable()
      },
      // 筛选新闻类型
      newTypeChange (val) {
        this.newType = val
        this.pageIndex = 1
        this.loadTable()
      },
      // 筛选新闻日期
      newDateChange (val) {
        this.queryDate = val
        this.queryDate[0] =
          this.queryDate[0] === ''
            ? ''
            : this.queryDate[0] + '\xa0' + '00:00:00'
        this.queryDate[1] =
          this.queryDate[1] === ''
            ? ''
            : this.queryDate[1] + '\xa0' + '23:59:59'
        this.pageIndex = 1
        this.loadTable()
      },
      // 提交创建时触发
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      // 发布到指定班牌---新建发布任务---开始
      // 打开发布任务框
      ImportClick () {
        let messageErrorNotice = ''
        if (this.selectionAll.length < 1) {
          this.publicItem = {}
          this.taskList = []
          this.xy.msgError('请勾选要发布的新闻。')
        } else {
          let nowDate = this.xy.moment(new Date()).format('YYYY-MM-DD HH:mm')
          for (let i = 0; i < this.selectionAll.length; i++) {
            if (nowDate > this.selectionAll[i].EndDate) {
              this.taskCreate = false
              messageErrorNotice = true
            } else {
              messageErrorNotice = false
              // this.getTree()
              this.taskCreate = true // 开启弹框
              this.taskList.push(this.selectionAll[i].resourceID) // 所要发布的ID
              this.publicItem = this.selectionAll[0] // 所要发布的类型
            }
          }
        }
        if (messageErrorNotice) {
          this.xy.msgError('当前选择列表中存在过期新闻，请确认后发布。')
        } else { };
      },
      // 发送到班牌
      changeDate () {
        // this.taskCreate = false // 开启弹框
        // this.taskList = [] // 所要发布的ID
        // this.publicItem = {} // 所要发布的类型
        this.loadTable()
      },
      // 获取班牌分组树形结构
      // getTree: function () {
      //   this.xy.loading()
      //   let that = this
      //   this.xy
      //     .get(
      //       `${that.apiPath}/api/CassTerminalGroup/GetTreminalTree`,
      //       {}
      //     )
      //     .then(res => {
      //       if (res.success) {
      //         if (res.data.length > 0) {
      //           that.getTreeList[0].children = res.data
      //           that.pushAllTraminal(res.data)
      //         } else {
      //         }
      //       } else {
      //       }
      //       that.xy.unloading()
      //     })
      // },
      // 递归向全部班牌内添加班牌
      pushAllTraminal: function (list) {
        this.getTreeList[0].TreminalS = []
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].children.length > 0) {
              for (let y = 0; y < list[i].children.length; y++) {
                if (list[i].children[y].TreminalS.length > 0) {
                  for (let j = 0; j < list[i].children[y].TreminalS.length; j++) {
                    this.getTreeList[0].TreminalS.push(
                      list[i].children[y].TreminalS[j]
                    )
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
      selectTree: function (val) {
        this.tremianlArr = []
        if (val[0].TreminalS.length > 0) {
          this.tremianlArr = val[0].TreminalS
          this.tremianlArr.map(function (val) {
            val.checked = false
            return val
          })
          for (let j = 0; j < this.classTerminalIDs.length; j++) {
            let all1 = this.tremianlArr
              .map(function (val) {
                return val.ClassTerminalID
              })
              .indexOf(this.classTerminalIDs[j].ClassTerminalID)
            if (all1 !== -1) {
              this.tremianlArr[all1].checked = true
            }
          }
        }
      },
      // 点击中间班牌 显示右侧已选中班牌
      changeCheckbox: function (vals) {
        if (vals.checked) {
          this.classTerminalIDs.push(vals)
        } else {
          for (let i = 0; i < this.classTerminalIDs.length; i++) {
            if (
              this.classTerminalIDs[i].ClassTerminalID === vals.ClassTerminalID
            ) {
              this.classTerminalIDs.splice(i, 1)
            }
          }
        }
      },
      // 删除右侧已选中班牌
      handleClose: function (e, name) {
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
      submitPublic: function () {
        let that = this
        let ids = []
        if (this.classTerminalIDs.length > 0) {
          for (let i = 0; i < this.classTerminalIDs.length; i++) {
            ids.push(this.classTerminalIDs[i].ClassTerminalID)
          }
          this.$refs.formValidateTaskOK.validate(function (valid) {
            if (!valid) {
              return that.changeLoading()
            } else {
              that.xy
                .post(
                  `${that.apiPath}/api/PublicTask/CreatePublicTask`,
                  {
                    PublishTaskName: $.trim(that.formValidateTaskOK.publicName),
                    PublishTaskType: that.publicItem.resourceType, // 资源类型10
                    ClassTerminalID: ids, // 班牌ID
                    ResourceID: that.taskList // 资源ID
                  }
                )
                .then(res => {
                  if (res.success) {
                    // xy.message.success(that, '操作成功！可去发布任务记录查看发布详情。')
                    that.xy.msgSuc('操作成功！可去发布任务记录查看发布详情。')
                    that.publicName = ''
                    that.tremianlArr = [] // 中间空
                    that.classTerminalIDs = [] // 右侧空
                    that.taskCreate = false
                    that.getTreeList[0].selected = false
                    that.taskList = []
                    that.$refs.formValidateTaskOK.resetFields()
                    // Tablemix.getTP()
                    that.loadTable()
                  } else {
                    // xy.message.error(that, res.msg)
                    that.xy.msgError(res.msg)
                  }
                  that.changeLoading()
                })
            }
          })
        } else {
          // xy.message.error(this, '请勾选班牌后再发布')
          that.xy.msgError('请勾选班牌后再发布。')
          that.changeLoading()
        }
      },
      publicCancel: function () {
        this.publicName = ''
        this.tremianlArr = [] // 中间空
        this.classTerminalIDs = [] // 右侧空
        this.taskCreate = false
        this.getTreeList[0].selected = false
        this.taskList = []
        this.$refs.formValidateTaskOK.resetFields()
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
