<template>
  <div class="xy-content-module">
    <!-- 通知管理--列表 // 缺少面包屑 -->
    <div class="xy-content-title xy-flex xy-between xy-center">
      <div>
        <i-button class="xy-primary" @click="newsNotice">创建通知</i-button>
        <!--<i-button type="danger" @click="delAll">批量删除</i-button>-->
        <i-button class="xy-info" @click="ImportClick">发布到班牌</i-button>
      </div>
      <div>
        <Select
          v-model="informTypeID"
          @on-change="informTypeChange"
          class="xy-content-title-search"
          placeholder="选择通知类型"
          style="width:150px"
        >
          <Option :value="0">所有通知类型</Option>
          <Option
            v-for="item in noticeTypeList"
            :value="item.InformTypeID"
            :key="item.InformTypeID"
            v-cloak
            >{{ item.InformTypeName }}</Option
          >
        </Select>
        <Select
          v-model="informColorID"
          @on-change="informColorChange"
          class="xy-content-title-search"
          placeholder="选择文字颜色"
          style="width:150px"
        >
          <Option :value="0">所有字体颜色</Option>
          <Option
            v-for="item in noticeColorList"
            :value="item.InformColorID"
            :key="item.InformColorID"
            v-cloak
            >{{ item.InformColorName }}</Option
          >
        </Select>
        <Input
          search
          v-model="searchText"
          @on-search="FromSubmit"
          placeholder="输入通知标题或内容"
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
        :dataSource="tableData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <span slot="Num" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="InformName" slot-scope="text, record">
          <span
            v-if="!record.Disabled"
            class="table-el-hover"
            @click="edit(record)"
          >
            {{ record.InformName == null ? "--" : record.InformName }}
          </span>
          <span v-else>{{
            record.InformName == null ? "--" : record.InformName
          }}</span>
        </span>
        <span slot="InformContent" slot-scope="text, record">
          {{ record.InformContent == null ? "--" : record.InformContent }}
        </span>
        <span slot="StartDate" slot-scope="text, record">
          {{ xy.moment(record.StartDate).format("YYYY-MM-DD HH:mm") }}
        </span>
        <span slot="EndDate" slot-scope="text, record">
          {{ xy.moment(record.EndDate).format("YYYY-MM-DD HH:mm") }}
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
                <a
                  href="javascript:;"
                  :disabled="record.Disabled"
                  @click="del(record)"
                  >删除</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </XyAntTable>
      <!-- 创建通知 -->
      <modal
        v-model="noticeCreate"
        :transfer="false"
        :styles="{ top: '20px' }"
        title="创建通知"
        :loading="loading"
        :mask-closable="false"
        :closable="true"
      >
        <div class="dialog-model-content">
          <Form
            ref="formValidateNoticeOK"
            :model="formValidateNoticeOK"
            :rules="ruleValidateNoticeOK"
          >
            <FormItem
              label="通知类型"
              prop="noticeType"
              labelFor="noticeType"
              :label-width="80"
            >
              <Select
                v-model="formValidateNoticeOK.noticeType"
                @on-change="noticeTypeChange"
                placeholder="选择通知类型"
                elementId="noticeType"
              >
                <Option
                  v-for="item in noticeTypeList"
                  :value="item.InformTypeID"
                  :key="item.InformTypeID"
                  v-cloak
                >
                  {{ item.InformTypeName }}
                </Option>
              </Select>
            </FormItem>
            <FormItem
              label="通知名称"
              prop="noticeName"
              labelFor="noticeName"
              :label-width="80"
            >
              <Input
                v-model="formValidateNoticeOK.noticeName"
                elementId="noticeName"
                clearable
              />
            </FormItem>
            <FormItem
              label="字体颜色"
              prop="noticeColor"
              labelFor="noticeColor"
              :label-width="80"
            >
              <Select
                v-model="formValidateNoticeOK.noticeColor"
                @on-change="noticeColorChange"
                placeholder="选择字体颜色"
                elementId="noticeColor"
              >
                <Option
                  v-for="item in noticeColorList"
                  :value="item.InformColorID"
                  :key="item.InformColorID"
                  v-cloak
                  >{{ item.InformColorName }}</Option
                >
              </Select>
            </FormItem>
            <FormItem
              label="发布内容"
              prop="noticeCont"
              labelFor="noticeCont"
              :label-width="80"
            >
              <Input
                type="textarea"
                v-model="formValidateNoticeOK.noticeCont"
                elementId="noticeCont"
                :rows="6"
                clearable
              />
            </FormItem>
            <FormItem
              label="发布时间"
              prop="noticeDate"
              labelFor="noticeDate"
              :label-width="80"
            >
              <DatePicker
                :value="formValidateNoticeOK.noticeDate"
                type="datetimerange"
                @on-change="noticeDateChange"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择发布日期"
                :editable="false"
                elementId="noticeDate"
              ></DatePicker>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="noticeCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="noticeOk"
            >确定</Button
          >
        </div>
      </modal>
      <!-- 编辑通知 -->
      <modal
        v-model="noticeEdit"
        :transfer="false"
        :styles="{ top: '20px' }"
        title="编辑通知"
        :loading="loading"
        :mask-closable="false"
        :closable="true"
      >
        <div class="dialog-model-content">
          <Form
            ref="formValieditNoticeOK"
            :model="formValieditNoticeOK"
            :rules="ruleValieditNoticeOK"
          >
            <FormItem
              label="通知类型"
              prop="noticeType"
              labelFor="noticeTypeedit"
              :label-width="80"
            >
              <Select
                v-model="formValieditNoticeOK.noticeType"
                @on-change="noticeEditTypeChange"
                placeholder="选择通知类型"
                elementId="noticeTypeedit"
              >
                <Option
                  v-for="item in noticeTypeList"
                  :value="item.InformTypeID"
                  :key="item.InformTypeID"
                  v-cloak
                >
                  {{ item.InformTypeName }}
                </Option>
              </Select>
            </FormItem>
            <FormItem
              label="通知名称"
              prop="noticeName"
              labelFor="noticeNameedit"
              :label-width="80"
            >
              <Input
                v-model="formValieditNoticeOK.noticeName"
                elementId="noticeNameedit"
                clearable
              />
            </FormItem>
            <FormItem
              label="字体颜色"
              prop="noticeColor"
              labelFor="noticeColoredit"
              :label-width="80"
            >
              <Select
                v-model="formValieditNoticeOK.noticeColor"
                @on-change="noticeEditColorChange"
                placeholder="选择字体颜色"
                elementId="noticeColoredit"
              >
                <Option
                  v-for="item in noticeColorList"
                  :value="item.InformColorID"
                  :key="item.InformColorID"
                  v-cloak
                >
                  {{ item.InformColorName }}
                </Option>
              </Select>
            </FormItem>
            <FormItem
              label="发布内容"
              prop="noticeCont"
              labelFor="noticeContedit"
              :label-width="80"
            >
              <Input
                type="textarea"
                v-model="formValieditNoticeOK.noticeCont"
                elementId="noticeContedit"
                :rows="6"
                clearable
              />
            </FormItem>
            <FormItem
              label="发布时间"
              prop="noticeDate"
              labelFor="noticeDateedit"
              :label-width="80"
            >
              <DatePicker
                :value="formValieditNoticeOK.noticeDate"
                type="datetimerange"
                @on-change="noticeEditDateChange"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择发布日期"
                :editable="false"
                elementId="noticeDateedit"
              >
              </DatePicker>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="noticeEditCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="noticeEditOk"
            >确定</Button
          >
        </div>
      </modal>
      <!-- 查看通知 -->
      <modal
        v-model="noticeSee"
        :transfer="false"
        :styles="{ top: '20px' }"
        title="查看通知"
        :loading="loading"
        :mask-closable="false"
        v-cloak
      >
        <div class="dialog-model-content">
          <Form>
            <FormItem label="通知类型">
              <span v-cloak>{{ showNoticeTypeName }}</span>
            </FormItem>
            <FormItem label="通知名称">
              <span v-cloak>{{ showNoticeTitle }}</span>
            </FormItem>
            <FormItem label="字体颜色">
              <span v-cloak>{{ showNoticeColorName }}</span>
            </FormItem>
            <FormItem label="发布内容">
              <span
                v-cloak
                style="display: block; line-height: 2.9; word-wrap:break-word;"
                >{{ showNoticeContent }}</span
              >
            </FormItem>
            <FormItem label="发布时间">
              <span style="font-size:14px;" v-cloak>
                {{
                  xy.moment(new Date(showStartDate)).format("YYYY-MM-DD HH:mm")
                }}
                -
                {{
                  xy.moment(new Date(showEndDate)).format("YYYY-MM-DD HH:mm")
                }}
              </span>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button
            class="xy-modal-primary"
            @click="newsSeeCancel"
            shape="circle"
            >取消</Button
          >
        </div>
      </modal>
      <!--新增发布任务-->
      <ToReleaseTask
        :taskCreate="taskCreate"
        :publicItem="publicItem"
        :taskList="taskList"
        @changeDate="changeDate"
        @closeTaskModal="closeTaskModal"
      >
      </ToReleaseTask>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import ToReleaseTask from '@/pages/infoPublic/components/ToReleaseTask.vue'
  export default {
    name: 'Notice',
    components: {
      XyAntTable,
      ToReleaseTask
    },
    data () {
      return {
        tableLoading: true,
        nullData: '该搜索条件下没有结果。',
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: current => {
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
        isEmpty: false,
        isInitial: true,
        loading: true,
        isRelease: true,
        searchText: '',
        selectionAll: [],
        columns: [
          {
            width: 100,
            title: '通知编号',
            scopedSlots: { customRender: 'Num' }
          },
          {
            title: '通知名称',
            width: 200,
            dataIndex: 'InformName',
            scopedSlots: { customRender: 'InformName' }
          },
          {
            title: '通知类型',
            width: 100,
            dataIndex: 'InformTypeName'
          },
          {
            title: '文字颜色',
            width: 100,
            dataIndex: 'InformColorName'
          },
          {
            title: '通知内容',
            dataIndex: 'InformContent',
            scopedSlots: { customRender: 'InformContent' }
          },
          {
            title: '预设发布时间',
            dataIndex: 'StartDate',
            width: 150,
            scopedSlots: { customRender: 'StartDate' }
          },
          {
            title: '结束时间',
            dataIndex: 'EndDate',
            width: 150,
            scopedSlots: { customRender: 'EndDate' }
          },
          {
            title: '操作',
            width: 150,
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        informTypeID: 0,
        informColorID: 0,
        noticeTypeList: [],
        noticeColorList: [],
        noticeCreate: false,
        formValidateNoticeOK: {
          noticeType: '',
          noticeName: '',
          noticeColor: '',
          noticeCont: '',
          noticeDate: null
        },
        ruleValidateNoticeOK: {
          noticeType: [
            {
              type: 'number',
              required: true,
              message: '通知类型不能为空',
              trigger: 'change'
            }
          ],
          noticeName: [
            { required: true, message: '通知名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 16,
              message: '通知名称不能超过16个字',
              trigger: 'blur'
            }
          ],
          noticeColor: [
            {
              type: 'number',
              required: true,
              message: '请选择字体颜色',
              trigger: 'change'
            }
          ],
          noticeCont: [
            { required: true, message: '发布内容不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 100,
              message: '发布内容不能超过100个字',
              trigger: 'blur'
            }
          ],
          noticeDate: [
            {
              type: 'array',
              required: true,
              message: '发布时间不能为空',
              trigger: 'change'
            }
          ]
        },
        // 编辑通知
        disabledSee: false,
        editNID: '',
        noticeEdit: false,
        formValieditNoticeOK: {
          noticeType: '',
          noticeName: '',
          noticeColor: '',
          noticeCont: '',
          noticeDate: null
        },
        ruleValieditNoticeOK: {
          noticeType: [
            {
              type: 'number',
              required: true,
              message: '通知类型不能为空',
              trigger: 'change'
            }
          ],
          noticeName: [
            { required: true, message: '通知名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 16,
              message: '通知名称不能超过16个字',
              trigger: 'blur'
            }
          ],
          noticeColor: [
            {
              type: 'number',
              required: true,
              message: '请选择字体颜色',
              trigger: 'change'
            }
          ],
          noticeCont: [
            { required: true, message: '发布内容不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 100,
              message: '发布内容不能超过100个字',
              trigger: 'blur'
            }
          ],
          noticeDate: [
            {
              type: 'array',
              required: true,
              message: '发布时间不能为空。',
              trigger: 'change'
            }
          ]
        },
        // 展示通知
        noticeSee: false,
        showresourceID: '',
        showNoticeTypeID: '',
        showNoticeTitle: '',
        showNoticeColor: '',
        showNoticeColorName: '',
        showStartDate: '',
        showEndDate: '',
        showNoticeContent: '',
        showNoticeTypeName: '',
        showIndex: '',
        dayNumber: '',
        daySum: 0,
        hourSum: 0,
        MinuteSum: 0,
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
            ParentID: -1,
            ClassTerminalGroupID: 0,
            children: []
          }
        ],
        tremianlArr: [],
        classTerminalIDs: [],
        publicItem: {},
        tableData: [],
        pageSize: 15,
        pageIndex: 1,
        apiPath: '',
        selectedRowKeys: []
      }
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
    created () {
      this.apiPath = this.$store.state.apiPath
      this.GetInformType()
      this.GetInformColor()
      this.getTP()
    },
    methods: {
      closeTaskModal (val) {
        this.taskCreate = false
        this.publicItem = {}
        this.taskList = []
      },
      handleTableChange () {
        this.getTP()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      //  获取table分页数据
      async getTP () {
        this.tableLoading = true
        let res = await this.xy.get(
          `${this.apiPath}/api/Resource/GetInformByPage`,
          {
            PageIndex: this.pageIndex,
            PageSize: this.pageSize,
            InformTypeID: this.informTypeID,
            InformColorID: this.informColorID,
            SearchText: this.searchText
          }
        )
        if (res.success) {
          this.tableData = res.data.data
          this.pagination.total = res.data.totalRecords
          // 如果有复选框需要赋值成空数组
          this.selectedRowKeys = []
          this.selectionAll = []
        }
        this.tableLoading = false
      },
      // 获取通知类型下拉框
      async GetInformType () {
        this.xy.loading()
        let res = await this.xy.get(this.apiPath + `/api/Resource/GetInformType`)
        this.xy.unloading()
        if (res.success) {
          this.noticeTypeList = res.data.data
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 获取字体颜色下拉框
      async GetInformColor () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/Resource/GetInformColor`
        )
        this.xy.unloading()
        if (res.success) {
          this.noticeColorList = res.data.data
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 创建通知
      newsNotice () {
        this.noticeCreate = true
        this.$refs.formValidateNoticeOK.resetFields()
      },

      // 创建
      noticeOk () {
        var _this = this
        _this.$refs.formValidateNoticeOK.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.CreateInform()
          }
        })
      },
      async CreateInform () {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/Resource/CreateInform`,
          {
            InformTypeID: Number($.trim(this.formValidateNoticeOK.noticeType)),
            InformName: $.trim(this.formValidateNoticeOK.noticeName),
            InformColorID: Number($.trim(this.formValidateNoticeOK.noticeColor)),
            InformContent: $.trim(this.formValidateNoticeOK.noticeCont),
            StartDate: this.xy.moment(this.formValidateNoticeOK.noticeDate[0]).format('YYYY-MM-DD HH:mm'),
            EndDate: this.xy.moment(this.formValidateNoticeOK.noticeDate[1]).format('YYYY-MM-DD HH:mm')
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.changeLoading()
          this.xy.msgSuc('创建成功。')
          this.$refs.formValidateNoticeOK.resetFields()
          this.formValidateNoticeOK.noticeDate = null
          this.noticeCreate = false
          this.pageIndex = 1
          this.pagination.current = 1
          this.getTP()
        } else {
          this.modal_loading = false
          this.xy.mError('创建失败', res.msg)
        }
      },

      // 取消
      noticeCancel () {
        this.noticeCreate = false
        this.$refs.formValidateNoticeOK.resetFields()
        this.formValidateNoticeOK.noticeDate = null
      },

      // 选择类型颜色
      noticeTypeChange (val) {
        this.formValidateNoticeOK.noticeType = val
      },

      // 选择字体颜色
      noticeColorChange (val) {
        this.formValidateNoticeOK.noticeColor = val
      },

      // 发布时间
      noticeDateChange (val) {
        this.formValidateNoticeOK.noticeDate = val
      },
      // 编辑新闻
      edit (val) {
        var dataArr = []
        if (this.noticeSee === true) {
          this.noticeSee = false
        }
        this.editNID = val.resourceID
        this.formValieditNoticeOK.noticeType = val.InformTypeID
        this.formValieditNoticeOK.noticeName = val.InformName
        this.formValieditNoticeOK.noticeColor = val.InformColorID
        this.formValieditNoticeOK.noticeCont = val.InformContent
        dataArr = [val.StartDate, val.EndDate]
        this.formValieditNoticeOK.noticeDate = dataArr
        this.noticeEdit = true
      },
      // 编辑
      noticeEditOk () {
        var _this = this
        _this.$refs.formValieditNoticeOK.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.EditInform()
          }
        })
      },
      async EditInform () {
        this.xy.loading()
        let res = await this.xy.post(this.apiPath + `/api/Resource/EditInform`, {
          resourceID: this.editNID,
          InformTypeID: Number($.trim(this.formValieditNoticeOK.noticeType)),
          InformName: $.trim(this.formValieditNoticeOK.noticeName),
          InformColorID: Number($.trim(this.formValieditNoticeOK.noticeColor)),
          InformContent: $.trim(this.formValieditNoticeOK.noticeCont),
          StartDate: this.xy.moment(this.formValieditNoticeOK.noticeDate[0]).format('YYYY-MM-DD HH:mm'),
          EndDate: this.xy.moment(this.formValieditNoticeOK.noticeDate[1]).format('YYYY-MM-DD HH:mm')
        })
        this.xy.unloading()
        if (res.success) {
          this.changeLoading()
          this.xy.msgSuc('编辑成功。')
          this.$refs.formValieditNoticeOK.resetFields()
          this.formValieditNoticeOK.noticeDate = null
          this.noticeEdit = false
          this.pageIndex = 1
          this.pagination.current = 1
          this.getTP()
        } else {
          this.modal_loading = false
          this.xy.mError('编辑失败', res.msg)
        }
      },
      noticeEditCancel () {
        this.noticeEdit = false
        this.$refs.formValieditNoticeOK.resetFields()
        this.formValieditNoticeOK.noticeDate = null
      },

      // 选择类型颜色
      noticeEditTypeChange (val) {
        this.formValieditNoticeOK.noticeType = val
      },

      // 选择字体颜色
      noticeEditColorChange (val) {
        this.formValieditNoticeOK.noticeColor = val
      },

      // 发布时间
      noticeEditDateChange (val) {
        if (val[0] === '' && val[1] === '') {
          this.formValieditNoticeOK.noticeDate = null
        } else {
          this.formValieditNoticeOK.noticeDate = val
        }
      },
      // 单击删除通知
      async del (val) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除"' + val.InformName + '"吗？</p>',
          onOk: () => {
            this.xy.loading()
            this.modal_loading = true
            this.xy
              .post(
                this.apiPath + `/api/Resource/DeleteInform?id=` + val.resourceID
              )
              .then(res => {
                this.xy.unloading()
                this.modal_loading = false
                if (res.success) {
                  this.xy.msgSuc('删除成功。')
                  if (this.pageList > 1) {
                    this.pageList = this.pageList - 1
                  } else {
                    if (this.pageIndex > 1) {
                      this.pageIndex = this.pageIndex - 1
                    }
                  }
                  this.pageIndex = 1
                  this.pagination.current = 1
                  this.getTP()
                } else {
                  this.xy.msgError(res.msg)
                }
              })
          }
        })
      },

      // 单击批量删除触发
      async delAll () {
        this.modal_loading = true
        var idsStr = []
        if (this.selectionAll.length < 1) {
          this.xy.msgError('请选择要删除的新闻。')
        } else {
          this.$Modal.confirm({
            title: '批量删除',
            content: '<p>您确认要删除选中的所有新闻吗？</p>',
            onOk: () => {
              this.selectionAll.forEach(item => {
                idsStr.push(item.resourceID)
              })
              this.xy.loading()
              this.modal_loading = true
              this.xy
                .post(
                  this.apiPath +
                    `/api/Resource/DeleteInform?id=` +
                    idsStr.join(',')
                )
                .then(res => {
                  if (res.success) {
                    if (
                      this.selectionAll.length === this.pageList &&
                      this.pageIndex > 1
                    ) {
                      this.pageIndex = this.pageIndex - 1
                    }
                    this.getTP()
                    this.xy.msgSuc('删除成功。')
                  } else {
                    this.xy.mError('批量删除失败', res.msg)
                    return this.changeLoading()
                  }
                  this.xy.unloading()
                  this.modal_loading = false
                })
            }
          })
        }
      },
      // 查看新闻
      see (val) {
        this.noticeSee = true
        this.showresourceID = val.resourceID
        this.showNoticeTypeID = val.InformTypeID
        this.showNoticeTitle = val.InformName
        this.showNoticeColor = val.InformColorID
        this.showNoticeColorName = val.InformColorName
        this.showStartDate = val.StartDate
        this.showEndDate = val.EndDate
        this.showNoticeContent = val.InformContent
        this.showNoticeTypeName = val.InformTypeName
        let dayNumber =
          (new Date(this.showEndDate) - new Date(this.showStartDate)) /
          (1000 * 60 * 60 * 24)
        // 一共多少分钟
        let Sum =
          (new Date(this.showEndDate) - new Date(this.showStartDate)) /
          (1000 * 60)
        // 取整天
        let daySum = Math.floor(Sum / (60 * 24))
        // 取整天后剩余的分钟
        let hourSurplus = Sum - 60 * 24 * daySum
        // 取小时
        let hourSum = Math.floor(hourSurplus / 60)
        // 取小时后剩余的分钟
        let MinuteSum = hourSurplus - hourSum * 60
        this.daySum = daySum
        this.hourSum = hourSum
        this.MinuteSum = MinuteSum
        this.dayNumber = dayNumber
        this.disabledSee = val.Disabled
      },

      // 关闭查看弹框
      newsSeeCancel () {
        this.noticeSee = false
      },
      // 搜素新闻
      FromSubmit () {
        this.SearchText = this.searchText
        this.pageIndex = 1
        this.pagination.current = 1
        this.getTP()
      },
      // 筛选新闻类型
      informTypeChange (val) {
        this.informTypeID = val
        this.InformTypeID = this.informTypeID
        this.pageIndex = 1
        this.pagination.current = 1
        this.getTP()
      },
      // 筛选新闻日期
      informColorChange (val) {
        this.informColorID = val
        this.InformColorID = this.informColorID
        this.pageIndex = 1
        this.pagination.current = 1
        this.getTP()
      },
      // 提交创建时触发
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
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
          this.xy.msgError('请勾选要发布的通知信息。')
        } else {
          var nowDate = this.xy.moment(new Date()).format('YYYY-MM-DD HH:MM')
          for (var i = 0; i < this.selectionAll.length; i++) {
            if (nowDate > this.selectionAll[i].EndDate) {
              this.taskCreate = false
              messageErrorNotice = true
            } else {
              messageErrorNotice = false
              // 调用发布组件
              // this.getTree()
              this.taskCreate = true // 开启弹框
              this.taskList.push(this.selectionAll[i].resourceID) // 所要发布的ID
              this.publicItem = this.selectionAll[0] // 所要发布的类型
            }
          }
        }
        if (messageErrorNotice) {
          this.xy.msgError('当前选择列表中存在过期通知，请确认后发布。')
        }
      },
      // 发送到班牌
      changeDate () {
        this.taskCreate = false // 开启弹框
        this.taskList = [] // 所要发布的ID
        this.publicItem = {} // 所要发布的类型
        this.pageIndex = 1
        this.pagination.current = 1
        this.getTP()
      }
    }
  }
</script>
<style lang="less" scoped></style>
