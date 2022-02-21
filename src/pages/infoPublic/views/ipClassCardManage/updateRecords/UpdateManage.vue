<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between xy-center">
      <div>
        <!--<i-button type="xy-primary" @click="modalCreate = true">新增</i-button>-->
        <Button class="xy-primary" @click="Create">新增</Button>
        <Button class="xy-info" @click="Update">更新记录</Button>
      </div>
      <Input
        search
        v-model="searchText"
        @on-search="FromSubmit"
        placeholder=""
        class="xy-content-title-search"
        style="width: auto;"
      />
    </div>
    <div class="xy-content-body">
      <XyAntTable
        :columns="columns"
        :dataSource="columnsData"
        :nullData="nullData"
        :tableLoading="tableLoading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <span
          slot="VersionNumber"
          slot-scope="text, record"
          class="table-el-hover"
          @click="Record(record.VersionId, record.VersionNumber)"
        >
          {{ record.VersionNumber }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="Record(record.VersionId, record.VersionNumber)"
            >更新到班牌</a
          >
        </span>
      </XyAntTable>
    </div>
    <!--应用到指定班牌-->
    <modal
      v-model="taskCreate"
      v-cloak
      :styles="{ top: '20px', width: '1000px' }"
      :transfer="false"
      title="应用到指定班牌"
      :loading="loading"
      :mask-closable="false"
    >
      <i-form
        ref="formValidateTaskOK"
        :model="formValidateTaskOK"
        :rules="ruleValidateTaskOK"
      >
        <row>
          <i-col span="6" style="height: 352px;overflow:auto;">
            <tree :data="getTreeList" @on-select-change="selectTree"></tree>
          </i-col>
          <i-col
            span="9"
            style="height: 352px;overflow:auto;padding:0px 10px;border-right: 1px solid #ccc;"
          >
            <div>
              <checkbox
                v-for="(item, index) in tremianlArr"
                :key="index"
                size="large"
                v-model="item.checked"
                @on-change="changeCheckbox(item)"
                >{{ item.ClassTerminalName }}</checkbox
              >
            </div>
          </i-col>
          <i-col span="9" style="padding:0px 10px;">
            <div
              style="padding-bottom:10px;margin-bottom: 5px;border-bottom:1px solid #eee;"
            >
              已选<b>{{ classTerminalIDs.length }}</b
              >个班牌
            </div>
            <div>
              <tag
                type="border"
                color="primary"
                v-for="(item, index) in classTerminalIDs"
                :key="index"
                :name="item"
                closable
                @on-close="handleClose"
                >{{ item.ClassTerminalName }}</tag
              >
            </div>
          </i-col>
        </row>
      </i-form>
      <div slot="footer">
        <Button class="xy-modal-close" @click="publicCancel">关闭</Button>
        <Button class="xy-modal-primary" shape="circle" @click="submitPublic"
          >发布</Button
        >
      </div>
    </modal>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  export default {
    name: 'UpdateManage',
    components: {
      XyAntTable
    },
    data () {
      return {
        modal_loading: false,
        loading: true,
        modalCreate: false, // 创建弹出框默认不展示
        searchName: '',
        editId: '', // 要编辑的ID
        editName: '', // 要编辑的名称
        modalEdit: false,
        modalRemove: false, // 删除单个数据弹出框默认不展示
        modalRemoveAll: false, // 批量删除数据弹出框默认不展示
        pageSize: 15,
        pageIndex: 1, // 当前页码
        ids: '',
        columns: [
          {
            title: '版本号',
            dataIndex: 'VersionNumber',
            scopedSlots: { customRender: 'VersionNumber' }
          },
          {
            title: '说明',
            dataIndex: 'VersionExplain'
          },
          {
            title: '上传时间',
            dataIndex: 'CreateTime'
          },
          {
            title: '上传者',
            dataIndex: 'CreateName',
            width: 140
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width: 120
          }
        ],
        columnsData: [], // table数据
        searchText: '',
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
        // buildOptionText: pageSizeOptions => `${pageSizeOptions.value}条/页`
        },
        VersionId: '',
        VersionNumber: '',
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
        // apiPath: xy.string.format("{0}/api/AppVersion/", xy.subMenuServiceUrl),
        apiPath: ''
      }
    },
    computed: {},
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getTP()
    },
    methods: {
      handleTableChange () {
        this.getTP()
      },
      async getTP () {
        this.tableLoading = true
        let res = await this.xy.get(this.apiPath + `/api/AppVersion/GetPage`, {
          keyword: $.trim(this.searchText),
          PageIndex: this.pageIndex,
          PageSize: this.pageSize
        })
        this.tableLoading = false
        if (res.success) {
          if (res.data.data.length > 0) {
            this.columnsData = res.data.data
            this.pagination.total = res.data.totalRecords
            this.isEmpty = false
          } else {
            this.columnsData = res.data.data
            this.pagination.total = res.data.totalRecords
            this.isEmpty = true
          }
        } else {
          this.xy.msgError(res.msg)
          this.isEmpty = true
        }
      },
      // 搜索触发
      FromSubmit () {
        this.searchTxt = this.searchText
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
      // 单击删除单个内容触发
      async del (id, name) {
        var _this = this
        _this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除此安装包吗？</p>',
          onOk: function () {
            _this.xy.loading()
            _this.modal_loading = true
            _this.xy
              .post(_this.apiPath + `/api/AppVersion/Delete?yearId=` + id)
              .then(res => {
                if (res.success) {
                  _this.xy.msgSuc('删除成功！')
                  if (this.pageList > 1) {
                    this.pageList = this.pageList - 1
                  } else {
                    if (this.PageIndex > 1) {
                      this.PageIndex = this.PageIndex - 1
                    }
                  }
                  this.getTP()
                } else {
                  _this.xy.msgError(res.msg)
                }
                _this.xy.unloading()
                _this.modal_loading = false
              })
          },
          onCancel: function () {
          // this.$Message.info('Clicked cancel');
          }
        })
      },
      // 新增页跳转
      Create () {
        // xy.http.load(xy.subMenuWebUrl + "/View/ipClassCardManage/UpdateRecords/PC/View/UpdateCreate.html");
        // this.$router.push({ path: '/xyHome/UpdateCreate' })
        this.$store.commit('common/getThreeMenuName', '新增班牌')
        this.$router.push({
          path: '/xyHome/UpdateCreate',
          query: this.$store.state.common.menuInfo
        })
      },

      // 更新记录
      Update () {
        // xy.http.load(xy.subMenuWebUrl + "/View/ipClassCardManage/UpdateRecords/PC/View/UpdateRecord.html");
        // this.$router.push({ path: '/xyHome/UpdateRecords' })
        this.$store.commit('common/getThreeMenuName', '更新记录')
        this.$router.push({
          path: '/xyHome/UpdateRecords',
          query: this.$store.state.common.menuInfo
        })
      },
      // 发布到指定班牌---新建发布任务---开始
      // 打开发布任务框
      Record (id, name) {
        this.getTree()
        this.taskCreate = true
        this.VersionId = id
      },
      // 获取班牌分组树形结构
      async getTree () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/ClassTerminalGroup/GetTreminalTree`
        )
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.getTreeList[0].children = res.data
            this.pushAllTraminal(res.data)
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 递归向全部班牌内添加班牌
      pushAllTraminal (list) {
        this.getTreeList[0].TreminalS = []
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            if (list[i].children.length > 0) {
              for (var y = 0; y < list[i].children.length; y++) {
                if (list[i].children[y].TreminalS.length > 0) {
                  for (var j = 0; j < list[i].children[y].TreminalS.length; j++) {
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
              for (var k = 0; k < list[i].TreminalS.length; k++) {
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
          for (var j = 0; j < this.classTerminalIDs.length; j++) {
            var all1 = this.tremianlArr
              .map(function (val) {
                return val.ClassTerminalId
              })
              .indexOf(this.classTerminalIDs[j].ClassTerminalId)
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
          for (var i = 0; i < this.classTerminalIDs.length; i++) {
            if (
              this.classTerminalIDs[i].ClassTerminalId === vals.ClassTerminalId
            ) {
              this.classTerminalIDs.splice(i, 1)
            }
          }
        }
      },
      // 删除右侧已选中班牌
      handleClose (e, name) {
        for (var i = 0; i < this.classTerminalIDs.length; i++) {
          if (this.classTerminalIDs[i].ClassTerminalId === name.ClassTerminalId) {
            for (var j = 0; j < this.tremianlArr.length; j++) {
              if (this.tremianlArr[j].ClassTerminalId === name.ClassTerminalId) {
                this.tremianlArr[j].checked = false
              }
            }
            this.classTerminalIDs.splice(i, 1)
          }
        }
      },
      // 确定提交
      // POST api/AppVersion/UpdateToClassTerminal
      // VersionId
      // ClassTerminalList
      async submitPublic () {
        var that = this
        var ids = []
        if (this.classTerminalIDs.length > 0) {
          for (var i = 0; i < this.classTerminalIDs.length; i++) {
            ids.push(this.classTerminalIDs[i].ClassTerminalId)
          }
          this.xy.loading()
          let res = await this.xy.post(
            this.apiPath + `/api/AppVersion/UpdateToClassTerminal`,
            {
              VersionId: that.VersionId,
              ClassTerminalList: ids // 班牌ID
            }
          )
          this.xy.unloading()
          if (res.success) {
            that.xy.msgSuc('发布到班牌成功')
            that.tremianlArr = [] // 中间空
            that.classTerminalIDs = [] // 右侧空
            that.taskCreate = false
            that.getTreeList[0].selected = false
            that.isRelease = true
            that.getTP()
          } else {
            that.xy.msgError(res.msg)
          }
        } else {
          this.xy.msgError('请勾选班牌后再发布')
          this.changeLoading()
        }
      },
      publicCancel () {
        this.formValidateTaskOK.publicName = ''
        this.tremianlArr = [] // 中间空
        this.classTerminalIDs = [] // 右侧空
        this.taskCreate = false
        this.taskList = []
        this.getTreeList[0].selected = false
      }
    // 发布到指定班牌---新建发布任务---结束
    }
  }
</script>
<style lang="less" scoped></style>
