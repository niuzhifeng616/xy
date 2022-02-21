<template>
  <div class="xy-content-module">
    <div class="xy-content-body pr">
      <row>
        <i-col span="5">
          <div
            style="border:1px solid #eee;margin-right:15px;min-height:600px;"
            v-cloak
          >
            <div
              style="border-bottom:1px solid #eee;padding:6px;background: #f9f9f9;"
              class="clearfix"
            >
              <b class="fl f16">班牌分组</b>
              <!--<i-button class="xy-primary" size="small" @click="add" class="fr">创建分类</i-button>-->
            </div>
            <div
              :style="{ height: xyMedia.y + 110 + 'px' }"
              style="padding:5px;overflow: auto;"
            >
              <a-tree
                v-if="treeList.length > 0"
                :auto-expand-parent="autoExpandParent"
                :default-expand-all="defaultExpandAll"
                :selectable="false"
                :tree-data="treeList"
              >
                <template slot="custom" slot-scope="item">
                  <div class="custom-node">
                    <span ref="contextmenu" class="node-btn">
                      <span class="node-title" @click="onSelectChangeTree(item)"
                        >{{ item.title }}
                      </span>
                      <a-icon
                        @click="createGroup(item)"
                        class="icon-wrap"
                        type="plus-circle"
                        title="添加子组"
                      />
                      <a-icon
                        v-if="item.ParentID !== -1"
                        @click="editGroup(item)"
                        class="icon-wrap"
                        theme="filled"
                        type="edit"
                        title="编辑"
                      />
                      <a-icon
                        v-if="item.ParentID !== -1"
                        @click="remove(item)"
                        class="icon-wrap"
                        theme="filled"
                        type="delete"
                        title="删除"
                      />
                    </span>
                  </div>
                </template>
              </a-tree>
              <div v-else>未查询到分组，请联系管理员。</div>
            </div>
          </div>
        </i-col>
        <i-col span="19" class="pr">
          <div class="clearfix" style="margin-bottom:20px;">
            <div class="fl" v-cloak>
              <i-button class="xy-primary" @click="batchRestart"
                >批量重启</i-button
              >
              <!--<i-button type="xy-danger" @click="delAll">批量删除</i-button>-->
              <dropdown @on-click="more" trigger="click">
                <i-button class="xy-info">
                  更多
                  <icon type="ios-arrow-down"></icon>
                </i-button>
                <dropdown-menu slot="list">
                  <!--<dropdown-item name="0">批量改变模式</dropdown-item>-->
                  <dropdown-item :name="5">解绑</dropdown-item>
                  <dropdown-item :name="4">操作记录</dropdown-item>
                  <dropdown-item :name="2">批量分组</dropdown-item>
                  <dropdown-item :name="3">批量指定负责人</dropdown-item>
                  <dropdown-item :name="1">批量设置自动开关</dropdown-item>
                </dropdown-menu>
              </dropdown>
            </div>
            <div class="fr" v-cloak>
              <i-select
                v-model="sId"
                class="fl xy-content-title-search"
                style="width: 150px;"
                @on-change="schoolChange"
                placeholder="请选择校区"
              >
                <i-option :value="0">所有校区</i-option>
                <i-option
                  v-for="(item, index) in schoolList"
                  :key="index"
                  :value="item.SchoolDistrictID"
                  >{{ item.SchoolDistrictName }}</i-option
                >
              </i-select>
              <i-select
                v-model="bId"
                class="fl xy-content-title-search"
                style="width: 150px;"
                @on-change="buildingChange"
                placeholder="请选择楼"
              >
                <i-option :value="0">所有楼</i-option>
                <i-option
                  v-for="(item, index) in BuildingList"
                  :key="index"
                  :value="item.BuildingID"
                  >{{ item.BuildingName }}</i-option
                >
              </i-select>
              <Input
                search
                v-model="searchName"
                @on-search="FromSubmit"
                placeholder="请输入班牌名称"
                class="fr xy-content-title-search"
                style="width: auto;"
              />
            </div>
          </div>
          <XyAntTable
            :rowSelection="tableRowSelection"
            :columns="columns"
            :dataSource="columnsData"
            :nullData="nullData"
            :tableLoading="tableLoading"
            :pagination="pagination"
            :isScroll="true"
            :scrollx="1500"
            @change="handleTableChange"
          >
            <span
              slot="ClassTerminalName"
              slot-scope="text, record"
              class="table-el-hover"
              @click="edit(record)"
            >
              {{
                record.ClassTerminalName === null
                  ? "--"
                  : record.ClassTerminalName
              }}
            </span>
            <span slot="VersionNumber" slot-scope="text, record">
              {{
                record.VersionNumber === "" || record.VersionNumber === null
                  ? "--"
                  : record.VersionNumber
              }}
            </span>
            <span slot="HouseName" slot-scope="text, record">
              {{ record.SchoolDistrictName }}/{{ record.BuildingName }}/{{
                record.HouseName == null ? "--" : record.HouseName
              }}
            </span>
            <span slot="ClassTerminalGroupName" slot-scope="text, record">
              {{
                record.ClassTerminalGroupName == null
                  ? "--"
                  : record.ClassTerminalGroupName
              }}
            </span>
            <span slot="UserFullNames" slot-scope="text, record">
              {{ record.UserFullNames === "" ? "--" : record.UserFullNames }}
            </span>
            <span slot="ScreenMode" slot-scope="text, record">
              {{ record.ScreenMode === 0 ? "横版" : "竖版" }}
            </span>
            <span slot="ShowModelName" slot-scope="text, record">
              <span>{{
                record.ShowModelName === "" ? "--" : record.ShowModelName
              }}</span>
            </span>
            <span slot="IsOnlineName" slot-scope="text, record">
              <a v-if="record.IsOnline === 2" @click="register(record)"
                >去注册</a
              >
              <span v-if="record.IsOnline === 0"
                ><i class="iconfont icon-success">&#xe719;</i>在线</span
              >
              <span v-if="record.IsOnline === 1"
                ><i class="iconfont icon-default">&#xe719;</i>离线</span
              >
            </span>
            <span slot="action" slot-scope="text, record">
              <a :disabled="record === 3" @click="edit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  更多 <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a href="javascript:;" @click="screenshot(record)"
                      >当前截屏</a
                    >
                  </a-menu-item>
                  <a-menu-item>
                    <a
                      href="javascript:;"
                      :disabled="record.IsDeleted === 3"
                      @click="restart(record)"
                      >重启</a
                    >
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </XyAntTable>
        </i-col>
      </row>
      <modal
        v-model="createGroupModal"
        v-cloak
        :transfer="false"
        title="创建分组"
        :loading="loading"
        :mask-closable="false"
        @on-ok="createGroupOk"
        @on-cancel="createGroupCancel"
      >
        <div>
          <i-form
            ref="createformValidate"
            :model="createformValidate"
            :rules="createruleValidate"
            @submit.native.prevent
          >
            <form-item label="分组名称" prop="groupTitle">
              <i-input
                v-model.trim="createformValidate.groupTitle"
                clearable
                maxlength="15"
              ></i-input>
            </form-item>
          </i-form>
        </div>
      </modal>
      <modal
        v-model="editGroupModal"
        v-cloak
        :transfer="false"
        title="编辑分组名称"
        :loading="loading"
        :mask-closable="false"
      >
        <div>
          <i-form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            @submit.native.prevent
          >
            <form-item label="分组名称" prop="groupTitle">
              <i-input
                v-model.trim="formValidate.groupTitle"
                clearable
                maxlength="15"
              ></i-input>
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="editGroupCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="editGroupOk"
            >确定</Button
          >
        </div>
      </modal>
      <modal
        :styles="{ top: '20px' }"
        width="760"
        v-model="batchGroup"
        v-cloak
        :transfer="false"
        title="批量分组"
        :loading="loading"
        :mask-closable="false"
      >
        <div class="batch-group">
          <row :gutter="24">
            <i-col span="12" class="batch-group-col">
              <div class="title">已选班牌</div>
              <div>
                <Tag
                  v-for="item in selectionAll"
                  :key="item.ClassTerminalId"
                  :name="item.ClassTerminalId"
                  closable
                  @on-close="delbp"
                  :title="item.ClassTerminalName"
                  >{{ item.ClassTerminalName }}
                </Tag>
              </div>
            </i-col>
            <i-col span="12" class="batch-group-col">
              <div class="title">目标分组</div>
              <!-- <Tree :data="groupTreeList" @on-contextmenu="handleContextMenu" v-cloak>
                <template slot="contextMenu">
                  <DropdownItem @click.native="groupTreeChange">移至此组</DropdownItem>
                </template>
              </Tree> -->
              <a-tree
                :auto-expand-parent="autoExpandParent"
                :default-expand-all="defaultExpandAll"
                :selected-keys="selectedKeys"
                :tree-data="groupTreeList"
                @select="onSelectFunc"
              />
            </i-col>
          </row>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="batchGroupCancel">关闭</Button>
          <Button class="xy-modal-primary" shape="circle" @click="batchGroupOk"
            >确定</Button
          >
        </div>
      </modal>
      <modal
        v-model="modalEditClassCard"
        v-cloak
        width="630"
        :styles="{ top: '20px' }"
        :transfer="false"
        title="批量自动开关机"
        :loading="loading"
        :mask-closable="false"
      >
        <div>
          <div style="padding:10px 0px;">
            <b class="f14">是否开启自动开关机功能</b>
            <i-switch v-model="switchName" @on-change="switchChange" />
          </div>
          <div>
            <div>
              <div class="title-describe title-model">设置一</div>
              <div class="clearfix">
                <checkbox-group
                  v-model="checkAllGroup1"
                  @on-change="checkAllGroupChange1"
                  class="fl"
                  size="large"
                >
                  <checkbox
                    v-for="(item, index) in checkGroup1"
                    :key="index"
                    :label="item.id"
                    v-cloak
                    size="large"
                    style="margin-right:30px;"
                    >{{ item.names }}</checkbox
                  >
                </checkbox-group>
              </div>
              <div style="padding:10px 0px;" class="clearfix">
                <div
                  v-for="(item, index) in tiemPickerList1"
                  :key="index"
                  style="display: inline-block;vertical-align: bottom;
                            line-height: 29px;margin-right:8px"
                >
                  <time-picker
                    format="HH:mm"
                    v-model="item.times"
                    type="timerange"
                    placement="bottom-end"
                    placeholder="开机时间-关机时间"
                    :editable="false"
                    style="width: 142px;float:left;"
                  ></time-picker>
                  <Icon
                    type="ios-trash-outline"
                    custom=" xy-table-del-btn xy-table-del-hover"
                    v-if="index != 0"
                    @click="deleteGroupTime1(index)"
                    style="margin-right: 0px"
                  />
                </div>
                <i-button
                  @click="groupTime1"
                  class="xy-info"
                  :disabled="tiemPickerList1.length == 3 ? true : false"
                  >添加</i-button
                >
              </div>
            </div>
            <div>
              <div class="title-describe title-model">设置二</div>
              <div class="clearfix">
                <checkbox-group
                  v-model="checkAllGroup2"
                  @on-change="checkAllGroupChange2"
                  class="fl"
                  size="large"
                >
                  <checkbox
                    v-for="(item, index) in checkGroup2"
                    :key="index"
                    :label="item.id"
                    v-cloak
                    size="large"
                    style="margin-right:30px;"
                    >{{ item.names }}</checkbox
                  >
                </checkbox-group>
              </div>
              <div style="padding:10px 0px;" class="clearfix">
                <div
                  v-for="(item, index) in tiemPickerList2"
                  :key="index"
                  style="display: inline-block;vertical-align: bottom;
                                line-height: 29px;margin-right:8px"
                >
                  <time-picker
                    format="HH:mm"
                    v-model="item.times"
                    type="timerange"
                    placement="bottom-end"
                    placeholder="开机时间-关机时间"
                    :editable="false"
                    style="width: 142px;float:left;"
                  ></time-picker>
                  <Icon
                    type="ios-trash-outline"
                    custom=" xy-table-del-btn xy-table-del-hover"
                    v-if="index != 0"
                    @click="deleteGroupTime2(index)"
                    style="margin-right: 0px"
                  />
                </div>
                <i-button
                  @click="groupTime2"
                  class="xy-info"
                  :disabled="tiemPickerList2.length == 3 ? true : false"
                  >添加</i-button
                >
              </div>
            </div>
            <div>
              <div class="title-describe title-model">设置三</div>
              <div class="clearfix">
                <checkbox-group
                  v-model="checkAllGroup3"
                  @on-change="checkAllGroupChange3"
                  class="fl"
                  size="large"
                >
                  <checkbox
                    v-for="(item, index) in checkGroup3"
                    :key="index"
                    :label="item.id"
                    v-cloak
                    size="large"
                    style="margin-right:30px;"
                    >{{ item.names }}</checkbox
                  >
                </checkbox-group>
              </div>
              <div style="padding:10px 0px;" class="clearfix">
                <div
                  v-for="(item, index) in tiemPickerList3"
                  :key="index"
                  style="display: inline-block;vertical-align: bottom;
                                line-height: 29px;margin-right:8px"
                >
                  <time-picker
                    format="HH:mm"
                    v-model="item.times"
                    type="timerange"
                    placement="bottom-end"
                    placeholder="开机时间-关机时间"
                    :editable="false"
                    style="width: 142px;float:left;"
                  ></time-picker>
                  <Icon
                    type="ios-trash-outline"
                    custom=" xy-table-del-btn xy-table-del-hover"
                    v-if="index != 0"
                    @click="deleteGroupTime3(index)"
                    style="margin-right: 0px"
                  />
                </div>
                <i-button
                  @click="groupTime3"
                  class="xy-info"
                  :disabled="tiemPickerList3.length == 3 ? true : false"
                  >添加</i-button
                >
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="switchCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="switchOk"
            >确定</Button
          >
        </div>
      </modal>
      <SelectTeacherOrg
        :isShow="isShow"
        :teachers="[...selectedTeachers]"
        @select-cancel="selectCancel"
        @select-confirm="selectConfirm"
      ></SelectTeacherOrg>
      <modal
        v-model="seeScreenshots"
        width="700"
        :transfer="false"
        title="查看班牌截屏"
        :loading="loading"
        :mask-closable="false"
      >
        <div class="dialog-model-content">
          <!-- <div
            v-if="isCardInitial"
            class="no-data-box isInitital-opacity pa"
            style="margin: 0 auto;"
          >
            <img class="no-data-img" src="@/assets/common/loading.png" />
          </div> -->
          <div v-if="isCardEmpty" class="no-data-box" v-cloak>
            <img class="no-data-img" src="@/assets/common/nullData.svg" />
            <span class="no-data-text" v-cloak>查看班牌截屏失败</span>
          </div>
          <img
            v-if="!isCardEmpty && !isCardInitial"
            style="width:100%;"
            :src="screenshotImg"
          />
        </div>
        <div slot="footer">
          <i-button @click="okScreenshots">关闭</i-button>
        </div>
      </modal>
    </div>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable.vue'
  import SelectTeacherOrg from '@/components/selectTeacherOrg/SelectTeacherOrg.vue'
  export default {
    name: 'ClassCardManage',
    components: {
      XyAntTable,
      SelectTeacherOrg
    },
    data () {
      return {
        loading: true,
        tableLoading: true,
        nullData: '当前分组下未搜索到班牌，请先添加班牌。',
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: current => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        sorter: 0, // 1 从小到大，0从大到小
        selectedRowKeys: [],
        autoExpandParent: true,
        defaultExpandAll: true,
        selectedKeys: [],
        batchGroup: false,
        isShow: false, // 控制获取老师cascader
        selectedTeachers: [],
        valData: {},
        switchName: false,
        createGroupModal: false,
        editGroupModal: false,
        modalEditClassCard: false,
        searchName: '',
        isCreate: false,
        treeList: [
          {
            title: '全部分组',
            ParentID: -1,
            key: 0,
            scopedSlots: { title: 'custom' },
            children: []
          }
        ],
        groupTreeList: [],
        isCardInitial: true,
        isCardEmpty: false,
        ClassTerminalGroupID: 0,
        ParentID: 0,
        modelSwitch: [],
        checkGroup1: [
          {
            id: 1,
            names: '周一'
          },
          {
            id: 2,
            names: '周二'
          },
          {
            id: 3,
            names: '周三'
          },
          {
            id: 4,
            names: '周四'
          },
          {
            id: 5,
            names: '周五'
          },
          {
            id: 6,
            names: '周六'
          },
          {
            id: 7,
            names: '周日'
          }
        ],
        checkGroup2: [
          {
            id: 1,
            names: '周一'
          },
          {
            id: 2,
            names: '周二'
          },
          {
            id: 3,
            names: '周三'
          },
          {
            id: 4,
            names: '周四'
          },
          {
            id: 5,
            names: '周五'
          },
          {
            id: 6,
            names: '周六'
          },
          {
            id: 7,
            names: '周日'
          }
        ],
        checkGroup3: [
          {
            id: 1,
            names: '周一'
          },
          {
            id: 2,
            names: '周二'
          },
          {
            id: 3,
            names: '周三'
          },
          {
            id: 4,
            names: '周四'
          },
          {
            id: 5,
            names: '周五'
          },
          {
            id: 6,
            names: '周六'
          },
          {
            id: 7,
            names: '周日'
          }
        ],
        checkAllGroup1: [],
        checkAllGroup2: [],
        checkAllGroup3: [],
        tiemPickerList1: [{ times: [] }],
        tiemPickerList2: [{ times: [] }],
        tiemPickerList3: [{ times: [] }],
        schoolList: [],
        BuildingList: [],
        sId: 0,
        bId: 0,
        columnsData: [],
        columns: [
          {
            title: '班牌名称',
            width: 200,
            fixed: 'left',
            dataIndex: 'ClassTerminalName',
            scopedSlots: { customRender: 'ClassTerminalName' }
          },
          {
            title: '版本号',
            width: 100,
            sorter: true,
            dataIndex: 'VersionNumber',
            scopedSlots: { customRender: 'VersionNumber' }
          },
          {
            title: '所属组',
            width: 150,
            dataIndex: 'ClassTerminalGroupName',
            scopedSlots: { customRender: 'ClassTerminalGroupName' }
          },
          {
            title: '所属场室',
            dataIndex: 'HouseName',
            scopedSlots: { customRender: 'HouseName' },
            minWidth: 300
          },
          {
            title: '负责人',
            dataIndex: 'UserFullNames',
            width: 150,
            scopedSlots: { customRender: 'UserFullNames' }
          },
          {
            title: '屏幕模式',
            dataIndex: 'ScreenMode',
            scopedSlots: { customRender: 'ScreenMode' },
            width: 100
          },
          {
            title: '当前模式',
            dataIndex: 'ShowModelName',
            scopedSlots: { customRender: 'ShowModelName' },
            width: 120
          },
          {
            title: '在线状态',
            dataIndex: 'IsOnlineName',
            scopedSlots: { customRender: 'IsOnlineName' },
            width: 100
          },
          {
            title: '操作',
            width: 140,
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        formValidate: {
          groupTitle: ''
        },
        ruleValidate: {
          groupTitle: [
            {
              required: true,
              validator (rule, value, callback) {
                if (value === '') {
                  callback(new Error('分组名称不能为空'))
                } else {
                  // if (value.indexOf(" ") !== -1) {
                  //    callback(new Error('分组名称不能有空格'));
                  // };
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        createformValidate: {
          groupTitle: ''
        },
        createruleValidate: {
          groupTitle: [
            {
              required: true,
              validator (rule, value, callback) {
                if (value === '') {
                  callback(new Error('分组名称不能为空'))
                } else {
                  // if (value.indexOf(" ") !== -1) {
                  //    callback(new Error('分组名称不能有空格'));
                  // };
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        screenshotImg: '',
        timecount: 0,
        ClassTerminalID: 0,
        seeScreenshots: false,
        applications: '',
        selectionAll: []
      }
    },
    created () {
      this.applications = this.$store.state.applications
    },
    computed: {
      xyMedia () {
        return this.$store.state.common.xyMedia
      },
      tableRowSelection () {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onTableSelectChange
        }
      }
    },
    watch: {
      batchGroup: {
        handler (val) {
          if (val) {
            this.autoExpandParent = true
            this.defaultExpandAll = true
          }
        },
        immediate: true
      }
    },
    mounted () {
      this.getTree()
      this.getSchool()
    },
    methods: {
      handleTableChange (pagination, filters, sorter, { currentDataSource }) {
        this.sorter = sorter.order === 'ascend' ? 1 : 0
        this.loadTable()
      },
      onTableSelectChange (index, val) {
        this.selectedRowKeys = index
        this.selectionAll = val
      },
      onSelectFunc (selectedKeys, info) {
        this.selectedKeys = selectedKeys
      },
      loadTable () {
        this.tableLoading = true
        this.xy
          .get(`${this.$store.state.apiPath}/api/ClassTerminal/GetPage`, {
            PageIndex: this.pagination.current,
            PageSize: this.pagination.pageSize,
            SearchText: this.searchName,
            ClassTerminalGroupID: this.ClassTerminalGroupID,
            SchoolDistrictID: this.sId,
            BuildingID: this.bId,
            ClassterminalOrder: this.sorter
          })
          .then(res => {
            if (res.success) {
              this.columnsData = res.data.data
              this.pagination.total = res.data.totalRecords
              // 如果有复选框需要赋值成空数组
              this.selectedRowKeys = []
              this.selectionAll = []
            } else {
              this.xy.msgError(res.msg)
            }
            this.tableLoading = false
          })
      },
      tableCallBack () {
        this.columnsData.map(function (item) {
          if (item.IsDeleted === 3) {
            item._disabled = true
          }
          return item
        })
      },
      rowClassNameFun (row, index) {
        if (row.IsDeleted === 3) {
          return 'row-bg'
        }
        return ''
      },

      async getTree () {
        let res = await this.xy.get(
          `${this.$store.state.apiPath}/api/ClassTerminalGroup/GetTree`,
          {},
          true
        )
        if (res.success) {
          this.xy.unloading()
          if (res.data.length > 0) {
            this.treeList[0].children = this.createTreeData(res.data)
          } else {
            this.treeList[0].children = []
          }
        } else {
        }
        this.pagination.current = 1
        this.loadTable()
        this.xy.unloading()
      },
      createTreeData (tree) {
        const result = []
        tree.forEach(item => {
          let title = item.title // 展示的名字
          let children = item.children // 子节点
          let key = item.ClassTerminalGroupID
          let scopedSlots = { title: 'custom' }
          let parentId = item.ParentID
          // 如果有子节点，递归
          if (children) {
            children = this.createTreeData(children)
          }
          result.push({ title, children, key, scopedSlots, parentId })
        })
        return result
      },
      async getTreeGroup () {
        let res = await this.xy.get(
          `${this.$store.state.apiPath}/api/ClassTerminalGroup/GetTree`,
          {},
          true
        )
        if (res.success) {
          if (res.data.length > 0) {
            this.groupTreeList = this.handleTree(res.data)
            this.batchGroup = true
          } else {
          }
        } else {
        }
      },
      handleTree (tree) {
        const result = []
        tree.forEach(item => {
          let expand = true // 是否展开
          let title = item.title // 展示的名字
          let children = item.children // 子节点
          let contextmenu = true
          // let groupId = item.ClassTerminalGroupID
          let key = item.ClassTerminalGroupID
          // 如果有子节点，递归
          if (children) {
            children = this.handleTree(children)
          }
          result.push({ contextmenu, expand, title, children, key })
        })
        return result
      },
      batchGroupOk () {
        if (this.selectionAll.length > 0) {
          let arrs = []
          this.selectionAll.map(item => {
            arrs.push(item.ClassTerminalId)
          })
          this.xy.loading()
          this.xy
            .post(
              `${this.$store.state.apiPath}/api/ClassTerminal/EditClassTerminalGroups`,
              {
                ClassTerminalIds: arrs,
                ClassTerminalGroupId: this.selectedKeys[0]
              }
            )
            .then(res => {
              this.xy.unloading()
              if (res.success) {
                this.batchGroup = false
                this.xy.msgSuc('分组成功。')
                this.selectionAll = []
                this.selectedKeys = []
                this.selectedRowKeys = []
                this.pagination.current = 1
                this.loadTable()
              }
            })
        } else {
          this.xy.msgError('请先选择班牌。')
        }
      },
      delbp (e, name) {
        for (let u = 0; u < this.selectionAll.length; u++) {
          if (this.selectionAll[u].ClassTerminalId === name) {
            this.selectionAll.splice(u, 1)
            this.selectedRowKeys.splice(u, 1)
          }
        }
      },
      // 获取校区
      async getSchool () {
        let res = await this.xy.get(
          `${this.xyApi}/base/api/SchoolDistrict/GetAll`,
          {}
        )
        if (res.success) {
          if (res.data.length > 0) {
            this.schoolList = res.data
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      schoolChange (val) {
        this.sId = val
        this.bId = 0
        this.getBuilding(val)
      },
      // 获取楼
      async getBuilding () {
        this.BuildingList = []
        let res = await this.xy.get(
          `${this.xyApi}/base/api/Building/GetBuildingBySchoolId?sid=${this.sId}`,
          null
        )
        if (res.success) {
          if (res.data.length > 0) {
            this.BuildingList = res.data
          }
        }
        this.buildingChange(0)
        this.xy.unloading()
      },
      buildingChange (val) {
        this.bId = val
        this.pagination.current = 1
        this.loadTable()
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      del (row) {
        this.$Modal.confirm({
          title: '删除',
          content:
            '<p>班牌已关联教室，删除后教室班牌会无法正常显示。确定删除？</p>',
          onOk: () => {
            this.changeLoading()
          //  this.xy.post(`${this.$store.state.apiPath}/api/Building/DeleteByIDS?ids=${idsStr.join(',')}`, null, function (res) {
          //   if (!res.data.success) {
          //      this.modal_loading = false
          //     MainVue.$Modal.error({ title: '删除失败', content: res.data.msg })
          //     return  this.changeLoading()
          //   } else {
          //      this.changeLoading()
          //     // 如果删除的是本页全部数据 + 并且本页不是在首页
          //     if (Tablemix.selectionAll.length ==  this.pageList &&  this.pageCurrent > 1) {
          //        this.pageCurrent =  this.pageCurrent - 1
          //     };
          //      this.loadTable()
          //     xy.message.success( this, { content: '删除成功！' })
          //      this.modal_loading = false
          //     Tablemix.selectionAll = []
          //   };
          // })
          },
          onCancel () {}
        })
      },

      delAll () {
        let idsStr = []
        if (this.selectionAll.length < 1) {
          this.xy.msgError('请勾选要删除的班排。')
        } else {
          this.$Modal.confirm({
            title: '批量删除',
            content:
              '<p>班牌已关联教室，删除后教室班牌会无法正常显示。确定删除？</p>',
            onOk: () => {
              $.each(this.selectionAll, function (index, item) {
                idsStr.push(item.BuildingID)
              })
              this.changeLoading()
              this.xy
                .post(
                  `${
                    this.$store.state.apiPath
                  }/api/Building/DeleteByIDS?ids=${idsStr.join(',')}`,
                  null
                )
                .then(res => {
                  if (!res.success) {
                    this.modal_loading = false
                    this.xy.msgError(res.msg)
                    return this.changeLoading()
                  } else {
                    this.changeLoading()
                    // 如果删除的是本页全部数据 + 并且本页不是在首页
                    if (
                      this.selectionAll.length === this.pageList &&
                      this.pageCurrent > 1
                    ) {
                      this.pageCurrent = this.pageCurrent - 1
                    }
                    this.xy.msgSuc('批量删除成功。')
                    this.modal_loading = false
                    this.selectionAll = []
                    this.selectedRowKeys = []
                    this.pagination.current = 1
                    this.loadTable()
                  }
                })
            },
            onCancel () {}
          })
        }
      },
      // 搜索触发
      FromSubmit (val) {
        this.searchName = val
        this.pagination.current = 1
        this.loadTable()
      },
      batchRestart () {
        if (this.selectionAll.length > 0) {
          let newArr = []
          for (let i = 0; i < this.selectionAll.length; i++) {
            newArr.push(this.selectionAll[i].ClassTerminalId)
          }
          this.$Modal.confirm({
            title: '重启班牌',
            content: '<p>确认要重启当前班牌吗？</p>',
            onOk: () => {
              this.xy.loading()
              this.xy
                .post(
                  `${this.$store.state.apiPath}/api/Handle/BatchRestart`,
                  newArr
                )
                .then(res => {
                  if (!res.success) {
                    this.xy.msgError('重启失败。')
                  } else {
                    this.xy.msgSuc('重启成功。')
                    this.selectionAll = []
                    this.selectedRowKeys = []
                    this.pagination.current = 1
                    this.loadTable()
                  }
                  this.xy.unloading()
                })
            }
          })
        } else {
          this.xy.msgError('请先选择要批量重启的班牌。')
        }
      },
      // 重启
      restart (row) {
        this.$Modal.confirm({
          title: '重启班牌',
          content: '<p>确认要重启当前班牌吗？</p>',
          onOk: () => {
            this.xy.loading()
            this.xy
              .post(
                `${this.$store.state.apiPath}/api/Handle/Restart?id=${row.ClassTerminalId}`,
                null
              )
              .then(res => {
                if (!res.success) {
                  this.xy.msgError('重启失败。')
                } else {
                  this.xy.msgSuc('重启成功。')
                }
                this.xy.unloading()
              })
          }
        })
      },
      // 注册
      register (row) {
        this.$Modal.confirm({
          title: '注册',
          content: '<p>确认要注册当前班牌吗？</p>',
          onOk: () => {
            this.xy
              .post(`${this.$store.state.apiPath}/api/ClassTerminal/Register`, {
                ClassTerminalID: row.ClassTerminalId, // 班牌ID
                ClassTerminalNumber: row.ClassTerminalNumber, // 班牌编号
                SchoolDistrictID: row.SchoolDistrictId, // 校区
                SchoolDistrictName: row.SchoolDistrictName, // 校区名
                BuildingID: row.BuildingId, // 楼
                BuildingName: row.BuildingName, // 楼名
                HouseID: row.HouseId, // 场室
                HouseName: row.HouseName, // 场室名
                TypeOfUse: row.TypeOfUse, // 选择类型
                UseWords: row.UseWords, // 班级ID
                StudentOrganizationName: row.StudentOrganizationName
              })
              .then(res => {
                if (res.success) {
                  this.xy.msgSuc('注册成功。')
                  this.loadTable()
                } else {
                //   this.xy.msgError('注册失败')
                }
              })
          }
        })
      },
      selectCancel () {
        this.isShow = false
      },
      more (type) {
        if (type === 1) {
          if (this.selectionAll.length > 0) {
            this.modalEditClassCard = true
          } else {
            this.xy.msgError('请先选择要批量自动开关机的班牌。')
          }
        }
        if (type === 2) {
          if (this.selectionAll.length > 0) {
            this.getTreeGroup()
          } else {
            this.xy.msgError('请先选择要批量分组的班牌。')
          }
        }
        if (type === 3) {
          if (this.selectionAll.length > 0) {
            // 获取教师组织
            this.isShow = true
          } else {
            this.xy.msgError('请先选择要批量指定负责人的班牌。')
          }
        }
        if (type === 4) {
          this.$store.commit('common/getThreeMenuName', '操作记录')
          this.$router.push({
            path: '/xyHome/ClassCardManageRecord',
            query: this.$store.state.common.menuInfo
          })
        }
        if (type === 5) {
          // 解绑
          if (this.selectionAll.length > 0) {
            this.$Modal.confirm({
              title: '解绑',
              content: '<p>解绑后班牌会恢复出厂设置，是否执行解绑操作？</p>',
              onOk: () => {
                let postArrId = []
                this.selectionAll.map(function (item) {
                  postArrId.push(item.ClassTerminalId)
                  return item
                })
                this.xy
                  .post(
                    `${this.$store.state.apiPath}/api/Handle/BatchRelieve`,
                    postArrId
                  )
                  .then(res => {
                    if (res.success) {
                      //  xy.message.success( this, '操作成功，请等待解绑结果')
                      this.xy.msgSuc('操作成功，请等待解绑结果。')
                      this.selectionAll = []
                      this.selectedRowKeys = []
                      this.pagination.current = 1
                      this.loadTable()
                    } else {
                      //  xy.message.error( this, res.data.msg)
                      this.xy.msgError(res.msg)
                    }
                  })
              }
            })
          } else {
            // xy.message.error(this, '请先选择要解绑的班牌')
            this.xy.msgError('请先选择要解绑的班牌。')
          }
        }
      },
      batchGroupCancel () {
        this.batchGroup = false
      },
      selectConfirm (selectData) {
        this.isShow = false
        this.selectedTeachers = [...selectData]
        let newArrs = []
        let selecArr = []
        if (this.selectedTeachers.length > 0) {
          for (let i = 0; i < this.selectedTeachers.length; i++) {
            newArrs.push(this.selectedTeachers[i].UserID)
          }
          for (let y = 0; y < this.selectionAll.length; y++) {
            selecArr.push(this.selectionAll[y].ClassTerminalId)
          }
          this.xy
            .post(`${this.$store.state.apiPath}/api/ClassTerminalForUsers/BatchCreate`, {
              ClassTerminalID: selecArr,
              UserID: newArrs
            })
            .then(
              res => {
                if (res.success) {
                  this.xy.msgSuc('批量指定负责人成功。')
                  this.selectionAll = []
                  this.selectedRowKeys = []
                  this.pagination.current = 1
                  this.loadTable()
                } else {
                  this.xy.msgError(res.msg)
                }
              },
              res => {
                this.xy.msgError(res.msg)
              }
            )
          // ModalCascade.changeLoading()
          // ModalCascade.isShowCascader = false
          // ModalCa
          // scade.newList = [] // 左侧滞空
          // ModalCascade.transferData = [] // 中间滞空
          // ModalCascade.checkAllGroup = [] // 多选框滞空
          this.selectedTeachers = [] // 右侧滞空
        // ModalCascade.casaderIsAll = false
        // ModalCascade.searchName = ''
        } else {
          // xy.message.error(this, { content: '请先选择负责人' })
          this.xy.msgError('请先选择负责人。')
        // ModalCascade.changeLoading()
        }
      },
      // 编辑班排
      edit (row) {
        this.$store.commit('common/getThreeMenuName', '编辑班牌')
        this.$store.commit('common/getParam', { row: JSON.stringify(row) })
        this.$router.push({
          path: '/xyHome/ClassCardManageEdit',
          query: this.$store.state.common.menuInfo
        })
      },

      // 班牌截屏
      // Handle/Screenshots?id=
      // Handle/GetScreenshotsByID?id=
      screenshot (row) {
        this.screenshotImg = ''
        this.xy.loading()
        this.isCardInitial = true
        this.isCardEmpty = false
        this.ClassTerminalID = row.ClassTerminalId
        this.xy
          .get(
            `${this.$store.state.apiPath}/api/Handle/GetScreenshotsByID`,
            { id: this.ClassTerminalID },
            true
          )
          .then(res => {
            if (res.success) {
              if (res.data !== null) {
                this.xy.unloading()
                this.screenshotImg = res.data
                this.timecount = 21
                this.isCardInitial = false
                this.isCardEmpty = false
                this.seeScreenshots = true
              }
            } else {
              this.xy
                .get(`${this.$store.state.apiPath}/api/Handle/Screenshots`, {
                  id: this.ClassTerminalID
                })
                .then(res => {
                  if (res.success) {
                    this.timecount = 0
                    this.times()
                  } else {
                    this.seeScreenshots = true
                    this.xy.unloading()
                    this.xy.msgError('获取班牌截图失败。')
                  }
                })
            }
          })
      },
      times () {
        setInterval(() => {
          if (this.timecount <= 20) {
            this.GetScreenshotsByID()
          } else {
            clearInterval(this.times)
          }
        }, 2000)
      },
      // 获取班牌截屏
      GetScreenshotsByID () {
        this.timecount++
        this.screenshotImg = ''
        this.xy
          .get(
            `${this.$store.state.apiPath}/api/Handle/GetScreenshotsByID`,
            {
              id: this.ClassTerminalID
            },
            true
          )
          .then(res => {
            if (res.success) {
              if (res.data !== null) {
                this.xy.unloading()
                this.screenshotImg = res.data
                this.isCardInitial = false
                this.isCardEmpty = false
                this.timecount = 21
                this.seeScreenshots = true
              } else {
                this.isCardEmpty = true
              }
            } else {
              if (this.timecount > 20) {
                this.xy.unloading()
                this.isCardInitial = false
                this.isCardEmpty = true
                this.xy.msgError('暂无截屏')
              }
            }
          })
      },
      okScreenshots () {
        this.seeScreenshots = false
        this.timecount = 21
      },
      cancelScreenshots () {
        this.seeScreenshots = false
        this.timecount = 21
      },
      // 设置1：周
      checkAllGroupChange1 (val) {
        this.checkAllGroup1 = val // 已选周次
      },
      // 设置2：周
      checkAllGroupChange2 (val) {
        this.checkAllGroup2 = val // 已选周次
      },
      // 设置3：周
      checkAllGroupChange3 (val) {
        this.checkAllGroup3 = val // 已选周次
      },
      // 批量设置自动开关机
      switchOk () {
        this.modelSwitch = []
        if (this.checkAllGroup1.length > 0) {
          let option1 = {
            TypeNumber: 1, // 设置1
            Day: this.checkAllGroup1, // 周次
            Model: []
          }
          for (let i = 0; i < this.tiemPickerList1.length; i++) {
            option1.Model.push({
              OpenTime: this.tiemPickerList1[i].times[0],
              CloseTime: this.tiemPickerList1[i].times[1]
            })
          }
          this.modelSwitch.push(option1)
        }
        if (this.checkAllGroup2.length > 0) {
          let option2 = {
            TypeNumber: 2, // 设置2
            Day: this.checkAllGroup2, // 周次
            Model: []
          }
          for (let j = 0; j < this.tiemPickerList2.length; j++) {
            option2.Model.push({
              OpenTime: this.tiemPickerList2[j].times[0],
              CloseTime: this.tiemPickerList2[j].times[1]
            })
          }
          this.modelSwitch.push(option2)
        }
        if (this.checkAllGroup3.length > 0) {
          let option3 = {
            TypeNumber: 3, // 设置3
            Day: this.checkAllGroup3, // 周次
            Model: []
          }
          for (let k = 0; k < this.tiemPickerList3.length; k++) {
            option3.Model.push({
              OpenTime: this.tiemPickerList3[k].times[0],
              CloseTime: this.tiemPickerList3[k].times[1]
            })
          }
          this.modelSwitch.push(option3)
        }
        let selecArr = []
        for (let y = 0; y < this.selectionAll.length; y++) {
          selecArr.push(this.selectionAll[y].ClassTerminalId)
        }
        let options = {
          IsUsingSwitchingTask: this.switchName, // 是否开启自动开关机功能
          ClassTerminalIDS: selecArr, // 班牌ID
          Model: this.modelSwitch
        }
        this.xy.loading()
        this.xy
          .post(`${this.$store.state.apiPath}/api/SwitchingTask/Create`, options)
          .then(res => {
            if (res.success) {
              this.xy.msgSuc('批量设置自动开关机成功。')
              this.checkAllGroup1 = []
              this.checkAllGroup2 = []
              this.checkAllGroup3 = []
              this.tiemPickerList1 = [{ times: [] }]
              this.tiemPickerList2 = [{ times: [] }]
              this.tiemPickerList3 = [{ times: [] }]
              this.selectionAll = []
              this.loadTable()
              this.modalEditClassCard = false
            } else {
              this.xy.msgError(res.msg)
            }
            this.changeLoading()
            this.xy.unloading()
          })
      },
      switchCancel () {
        this.modalEditClassCard = false
        this.switchName = false
        this.checkAllGroup1 = []
        this.checkAllGroup2 = []
        this.checkAllGroup3 = []
        this.tiemPickerList1 = [{ times: [] }]
        this.tiemPickerList2 = [{ times: [] }]
        this.tiemPickerList3 = [{ times: [] }]
      },
      switchChange (type) {
        this.switchName = type
      },
      renderContent (h, param) {
        // 初始化参数
        const node = param.node
        const root = param.root
        // 临时变量，最终节点
        let endNode = node
        // 层级信息获取，控制最多三层
        for (let i = 0; i < 3; i++) {
          endNode = endNode && root.find(el => el.nodeKey === endNode.parent)
        }
        return h(
          'span',
          {
            class: ['ivu-tree-title'],
            style: {
              display: 'inline-block',
              width: '100%'
            }
          },
          [
            h('span', {
              style: {
                cursor: 'pointer'
              },
              domProps: {
                // innerHTML: param.data.title
                innerHTML:
                  '<span class="nowrap" style="width:70px;display:inline-block;font-size:14px;">' +
                  (param.data.title === null ? '--' : param.data.title) +
                  '</span>'
              },
              attrs: {
                title: param.data.title
              },
              on: {
                click: e => {
                  this.onSelectChangeTree(param, e) // 手动选择树节点
                }
              }
            }),
            h(
              'span',
              {
                style: {
                  display: 'inline-block',
                  float: 'right',
                  marginRight: '10px'
                }
              },
              [
                h('Icon', {
                  props: {
                    type: 'md-create',
                    custom:
                      param.data.ParentID !== -1
                        ? 'xy-tree-btn xy-tree-hover'
                        : 'xy-tree-btn xy-tree-hover xy-tree-disabled'
                  },
                  attrs: {
                    title: '编辑'
                  },
                  // props: Object.assign({}, this.buttonProps, {
                  //    size: 'small',
                  //    disabled: param.data.ParentID == -1 ? true : false
                  // }),
                  on: {
                    click: () => {
                      if (param.data.ParentID !== -1) {
                        this.editGroup(param.data)
                      }
                    }
                  }
                }),
                h('Icon', {
                  // props: Object.assign({}, this.buttonProps, {
                  //    size: 'small',
                  // }),
                  props: {
                    type: 'md-add',
                    // 如果
                    custom: endNode
                      ? 'xy-tree-btn xy-tree-hover xy-tree-disabled'
                      : 'xy-tree-btn xy-tree-hover'
                  },
                  attrs: {
                    title: '创建子组'
                  },
                  on: {
                    click: () => {
                      // 如果
                      if (!endNode) {
                        this.createGroup(param.data)
                      }
                    }
                  }
                }),
                h('Icon', {
                  props: {
                    type: 'md-close',
                    custom:
                      param.data.ParentID !== -1
                        ? 'xy-tree-btn xy-tree-hover'
                        : 'xy-tree-btn xy-tree-hover xy-tree-disabled'
                  },
                  attrs: {
                    title: '删除'
                  },
                  on: {
                    click: () => {
                      if (param.data.ParentID !== -1) {
                        this.remove(param.root, param.node, param.data)
                      }
                    }
                  }
                })
              ]
            )
          ]
        )
      },
      // 创建
      createGroup (data) {
        this.ClassTerminalGroupID = data.key
        this.createGroupModal = true
      },
      createGroupOk () {
        this.xy.loading()
        this.$refs.createformValidate.validate(valid => {
          if (!valid) {
            this.xy.unloading()
            return this.changeLoading()
          } else {
            this.xy
              .post(
                `${this.$store.state.apiPath}/api/ClassTerminalGroup/Create`,
                {
                  ClassTerminalGroupID: 0,
                  ClassTerminalGroupName: this.createformValidate.groupTitle, // 分类名称
                  ParentID: this.ClassTerminalGroupID
                }
              )
              .then(res => {
                if (res.success) {
                  this.xy.msgSuc('创建成功。')
                  this.getTree()
                } else {
                  this.xy.msgError(res.msg)
                }
                this.$refs.createformValidate.resetFields()
                this.createGroupModal = false
                this.xy.unloading()
              })
          }
        })
      },
      createGroupCancel () {
        this.createGroupModal = false
        this.$refs.createformValidate.resetFields()
      },
      // 打开编辑
      editGroup (data) {
        this.ParentID = data.ParentId // 父级ID
        this.ClassTerminalGroupID = data.key // 选中的当前维度ID
        this.formValidate.groupTitle = data.title
        this.editGroupModal = true
      },
      remove (data) {
        if (data.key === undefined || data.key === '') {
          this.xy.msgError('当前分组未保存，无需删除。')
        } else {
          this.xy.confirm('删除', '<p>确认要删除当前分组吗？</p>', () => {
            this.xy
              .post(
                `${this.$store.state.apiPath}/api/ClassTerminalGroup/Delete?id=${data.key}`,
                null
              )
              .then(res => {
                if (!res.data.success) {
                  this.xy.msgError('删除失败。')
                } else {
                  this.getTree()
                  this.xy.msgSuc('删除成功。')
                }
              })
          })
        }
      },
      // 编辑
      editGroupOk () {
        this.xy.loading()
        this.$refs.formValidate.validate(valid => {
          if (!valid) {
            this.xy.unloading()
            return this.changeLoading()
          } else {
            this.xy
              .post(`${this.$store.state.apiPath}/api/ClassTerminalGroup/Edit`, {
                ClassTerminalGroupID: this.ClassTerminalGroupID,
                ClassTerminalGroupName: this.formValidate.groupTitle, // 分类名称
                ParentID: this.ParentID
              })
              .then(res => {
                if (res.success) {
                  this.xy.msgSuc('编辑成功。')
                  this.getTree()
                } else {
                  this.xy.msgError(res.msg)
                }
                this.editGroupModal = false
                this.$refs.formValidate.resetFields()
                this.xy.unloading()
              })
          }
        })
      },
      editGroupCancel () {
        this.editGroupModal = false
        this.$refs.formValidate.resetFields()
      },
      onSelectChangeTree (val) {
        if (val.key === '' || val.key === undefined) {
        // this.xy.msgError('请先保存当前分组')
        } else {
          this.valData = val.key
          this.ClassTerminalGroupID = val.key
          this.pagination.current = 1
          this.loadTable()
        }
      },
      groupTime1 () {
        if (this.tiemPickerList1.length === 3) {
        } else {
          this.tiemPickerList1.push({
            times: []
          })
        }
      },
      groupTime2 () {
        if (this.tiemPickerList2.length === 3) {
        } else {
          this.tiemPickerList2.push({
            times: []
          })
        }
      },
      groupTime3 () {
        if (this.tiemPickerList3.length === 3) {
        } else {
          this.tiemPickerList3.push({
            times: []
          })
        }
      },
      deleteGroupTime1 (index) {
        this.tiemPickerList1.splice(index, 1)
      },
      deleteGroupTime2 (index) {
        this.tiemPickerList2.splice(index, 1)
      },
      deleteGroupTime3 (index) {
        this.tiemPickerList3.splice(index, 1)
      }
    }
  }
</script>
<style lang="less" scpoed>
.ivu-table .row-bg td {
  background-color: #f8f8f9;
}
.batch-group {
  .batch-group-col {
    height: 440px;
    overflow-y: auto;
    .title {
      font-size: 15px;
      padding: 8px 0;
      margin-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
  }
  .batch-group-col:nth-child(1) {
    border-right: 1px solid #eee;
  }
}
.custom-node {
  .node-btn {
    .node-title {
      margin-right: 20px;
    }
    .icon-wrap {
      color: #ccc;
      margin-right: 20px;
      font-size: 16px;
    }
    .icon-wrap:hover {
      color: #4196ff;
    }
  }
}
</style>
