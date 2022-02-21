<template>
  <div id="LDAPEditor">
    <row style="margin-bottom:40px;">
      <i-col span="8">
        <button-group>
          <Button :class="{'xy-primary' : selectNum, 'xy-info': !selectNum,}" @click="selectNum = true">基本信息</Button>
          <Button :class="{'xy-info': selectNum, 'xy-primary' : !selectNum}" @click="selectNum = false">组交叉引用</Button>
        </button-group>
      </i-col>
      <i-col span="8" class="text-center">
        <div class="LDAP1" v-cloak>完全限定域名：{{ LDAPForm.DomainName }}</div>
      </i-col>
      <i-col span="8" class="text-right">
        <i-button class="ams-back-btn" @click="back">返回</i-button>
      </i-col>
    </row>

    <!--<p style="font-size:16px;color:#ea6f5a;padding-bottom:10px" v-cloak>完全限定域名：{{LDAPForm.DomainName}}</p>-->
    <!--基本信息-->
    <div v-if="selectNum">
      <i-form
        ref="LDAPForm"
        :model="LDAPForm"
        :rules="LDAPValidate"
        label-position="top"
        class="LDAPForm"
        >
        <form-item label="完全限定域名" prop="DomainName" labelFor="DomainName">
          <i-input
            v-model="LDAPForm.DomainName"
            elementId="DomainName"
            size="large"
            placeholder="请输入完全限定域名"
            />
        </form-item>
        <form-item label="目录服务" prop="DirectoryService">
          <i-select v-model="LDAPForm.DirectoryService" size="large">
            <i-option value="A">活动目录</i-option>
            <i-option value="N">Novell</i-option>
            <i-option value="O">Open LDAP</i-option>
          </i-select>
        </form-item>
        <form-item label="端口号" prop="PortNumber" labelFor="PortNumber">
          <input-number
            v-model="LDAPForm.PortNumber"
            :max="65535"
            elementId="PortNumber"
            :min="0"
            size="large"
            style="width:100%"
            >
          </input-number>
        </form-item>
        <form-item label="用户名" prop="UserName" labelFor="UserName">
          <i-input
            v-model="LDAPForm.UserName"
            elementId="UserName"
            size="large"
            placeholder="请输入用户名"
            />
        </form-item>
        <form-item label="密码" prop="Password" labelFor="Password">
          <i-input
            v-model="LDAPForm.Password"
            elementId="Password"
            type="password"
            size="large"
            placeholder="请输入密码"
            />
        </form-item>
        <form-item prop="AnonymousBindEnabled">
          <checkbox v-model="LDAPForm.AnonymousBindEnabled">启动匿名绑定</checkbox>
        </form-item>
        <form-item label="BaseDN（活动目录根节点）" prop="BaseDN" labelFor="BaseDN">
          <i-input
            v-model="LDAPForm.BaseDN"
            size="large"
            elementId="BaseDN"
            placeholder="请输入活动目录根节点"
            style="width:395px;"
            />
          <i-button
            type="primary"
            @click="getLDAPBaseDN"
            :disabled="BaseDisabled"
            >
            <span v-if="!BaseDisabled">获取BaseDN</span>
            <span v-if="BaseDisabled">获取中</span>
          </i-button>
        </form-item>
        <form-item class="text-center">
          <!--<i-button type="primary" ghost @click="back" style="margin-right:30px">返回</i-button>-->
          <!-- <i-button type="primary" @click="LDAPSubmit('LDAPForm')">保存</i-button> -->
          <Button class="xy-btn-primary" shape="circle" @click="LDAPSubmit('LDAPForm')">保存</Button>
        </form-item>
      </i-form>
    </div>
    <!--组交叉引用-->
    <div v-if="!selectNum">
      <i-button type="primary" @click="modal1 = true">创建组交叉引用</i-button>
      <div class="xy-content-body">
        <XyAntTable
          :columns="columns"
          :dataSource="datatable"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
          >
          <div slot="UserTypeName" style="min-width:200px" slot-scope="text, record">
            <span class="table-el-hover" @click="edit(record)">
              {{ record.UserTypeName}}
            </span>
          </div>
          <span slot="04" slot-scope="text, record">
            <a @click="edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="del(record)">删除</a>
          </span>
        </XyAntTable>
      </div>
    </div>

    <!--创建组交叉引用 -->
    <modal
      v-model="modal1"
      :transfer="false"
      title="创建组交叉引用"
      :loading="loading1"
      :mask-closable="false"
      @on-ok="ok1"
      @on-cancel="cancel1"
      >
      <div class="dialog-model-content">
        <i-form
          ref="form1"
          :model="form1"
          :rules="Validate1"
          :label-width="120"
          >
          <form-item label="角色" prop="juese">
            <i-select v-model="form1.juese" size="large">
              <i-option value="3">学生</i-option>
              <i-option value="2">教师</i-option>
              <i-option value="4">家长</i-option>
            </i-select>
          </form-item>
          <form-item label="LDAP组名" prop="zuming">
            <i-select v-model="form1.zuming" size="large">
              <i-option v-for="(dn, index) in ldapDNList" :key="index" :value="dn.DN">{{ dn.DN }}</i-option>
              <!--<i-option value="CN=parent">CN=parent,CN=Users,DC=xiaoyang,DC=com</i-option>
                        <i-option value="shanghai">CN=parent,CN=Users,DC=xiaoyang,DC=com</i-option>
                        <i-option value="shenzhen">CN=parent,CN=Users,DC=xiaoyang,DC=com</i-option>-->
            </i-select>
          </form-item>
        </i-form>
      </div>
    </modal>
    <!--编辑交叉引用 -->
    <modal
      v-model="modal2"
      :transfer="false"
      title="编辑交叉引用"
      :loading="loading2"
      :mask-closable="false"
      @on-ok="ok2"
      @on-cancel="cancel2"
      >
      <div class="dialog-model-content">
        <i-form
          ref="form2"
          :model="form2"
          :rules="Validate2"
          :label-width="120"
          >
          <form-item label="角色" prop="juese">
            <i-select v-model="form2.juese" size="large">
              <i-option value="3">学生</i-option>
              <i-option value="2">教师</i-option>
              <i-option value="4">家长</i-option>
            </i-select>
          </form-item>
          <form-item label="LDAP组名" prop="zuming">
            <i-select v-model="form2.zuming" size="large">
              <i-option v-for="(dn, index) in ldapDNList" :key="index" :value="dn.DN">{{ dn.DN }}</i-option>
            </i-select>
          </form-item>
        </i-form>
      </div>
    </modal>
  </div>
</template>

<script>
  import { urlSets } from './urlSets.js'
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'AMS_LDAPEditor',
    components: {
      XyAntTable
    },
    props: {
      AMSGbVal: {
        type: Object,
        required: true
      },
      editorData: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        serviceUrl: this.apiAMS,
        selectNum: true, // 基本信息或者组交叉引用
        selectionAll: [],
        pageList: 0, // 当前页数据条数
        columns: [
          {
            title: '角色',
            dataIndex: 'UserTypeName',
            scopedSlots: { customRender: 'UserTypeName' }
          },
          {
            title: '组交叉引用',
            dataIndex: 'LDAPGroupDN'
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 140,
            scopedSlots: { customRender: '04' }
          }
        ],
        datatable: [], // table数据
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        tableLoading: false,

        ldapRow: {},
        LDAPForm: {
          // 基本信息
          DomainName: '210.12.41.96',
          DirectoryService: '',
          PortNumber: '',
          UserName: '',
          Password: '',
          AnonymousBindEnabled: false,
          BaseDN: ''
        },
        LDAPValidate: {
          // 基本信息
          DomainName: [
            { required: true, message: '完全限定域名不能为空', trigger: 'blur' }
          ],
          DirectoryService: [
            { required: true, message: '目录服务不能为空', trigger: 'blur' }
          ],
          PortNumber: [
            {
              required: true,
              type: 'number',
              message: '端口号不能为空',
              trigger: 'blur'
            }
          ]
        // UserName: [
        //   { required: true, message: '用户名不能为空', trigger: 'blur' }
        // ],
        // Password: [
        //   { required: true, message: '密码不能为空', trigger: 'blur' }
        // ],
        // AnonymousBindEnabled: [
        //  { required: true, message: '图标不能为空', trigger: 'blur' }
        // ],
        // BaseDN: [
        //  { required: true, message: '图标不能为空', trigger: 'blur' }
        // ],
        },
        ldapDNList: [],
        BaseDisabled: false, // 获取BaseDN是否可以点击
        // 添加组交叉引用
        loading1: true,
        modal1: false,
        form1: {
          // 组交叉引用
          juese: '3',
          zuming: ''
        },
        Validate1: {
          // 组交叉引用
          juese: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          zuming: [{ required: true, message: '排序号不能为空', trigger: 'blur' }]
        },

        // 编辑组交叉引用
        loading2: true,
        modal2: false,
        form2: {
          // 组交叉引用
          juese: '',
          zuming: ''
        },
        Validate2: {
          // 组交叉引用
          juese: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          zuming: [{ required: true, message: '排序号不能为空', trigger: 'blur' }]
        }
      }
    },
    created: function () {
      this.getLDAPRow()
    },
    mounted: function () {
      this.$nextTick(() => {
        this.getLDAPDN()
      })
    },
    methods: {
      handleTableChange () {
        this.getTP()
      },
      // tap切换
      btnClick (val) {
      // TODO: 【暂存】 这是什么鬼？？好在这个方法没有被调用，先注释掉下面那行，放着了...
      // this.selectNum
      },

      getLDAPRow () {
        this.ldapRow = this.editorData
        this.LDAPForm = this.ldapRow
        this.LDAPForm.Password = ''
        if (
          this.LDAPForm.DirectoryService === '' ||
          this.LDAPForm.DirectoryService == null
        ) {
          this.LDAPForm.DirectoryService = 'A'
        }
        // if (this.LDAPForm.BaseDN == "" || this.LDAPForm.BaseDN == null) this.LDAPForm.BaseDN = "DC=xiaoyang,DC=com";

        this.getTP()
      },
      // 获取BaseDN
      async getLDAPBaseDN () {
        this.BaseDisabled = true
        const res = await this.xy.get(
          `${this.serviceUrl}${urlSets.GetLDAPDNS}`,
          {
            accountID: this.AMSGbVal.accountID,
            ldapID: this.ldapRow.LDAPSettingID,
            dnClass: 'B'
          }
        )
        this.BaseDisabled = false
        if (res.success) {
          var baseDNArr = res.data
          if (baseDNArr != null && baseDNArr.length > 0) {
            this.LDAPForm.BaseDN = baseDNArr[0].DN
          } else {
            this.LDAPForm.BaseDN = ''
          }
        } else {
          this.LDAPForm.BaseDN = ''
        }
      },
      async getLDAPDN () {
        if (this.ldapDNList.length < 1) {
          const res = await this.xy.get(
            `${this.serviceUrl}${urlSets.GetLDAPDNS}`,
            {
              accountID: this.AMSGbVal.accountID,
              ldapID: this.ldapRow.LDAPSettingID,
              dnClass: 'G'
            }
          )
          if (res.success) {
            if (res.data != null && res.data.length > 0) {
              this.ldapDNList = res.data
            } else {
              this.ldapDNList = []
            }
          } else {
            this.ldapDNList = []
          }
        }
      },
      // 基本信息的保存
      LDAPSubmit (name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            const params = {
              AccountID: this.AMSGbVal.accountID,
              DomainName: this.LDAPForm.DomainName,
              LDAPSettingID: this.LDAPForm.LDAPSettingID,
              DirectoryService: this.LDAPForm.DirectoryService,
              UserName: this.LDAPForm.UserName,
              Password: this.LDAPForm.Password,
              BaseDN: this.LDAPForm.BaseDN,
              AnonymousBindEnabled: this.LDAPForm.AnonymousBindEnabled,
              PortNumber: this.LDAPForm.PortNumber,
              // TODO: 以下参数不需要：
              SSLEnabled: true,
              PersonFilter: '',
              GroupFilter: '',
              BaseDNFilter: '',
              PathNameField: '',
              UserNameField: '',
              FirstNameField: '',
              LastNameField: '',
              EmailField: '',
              GroupField: '',
              GroupRefDirection: '',
              GroupUserRefField: '',
              Active: true
            }
            this.postEditLDAPSetting(
              `${this.serviceUrl}${urlSets.EditLDAPSetting}`,
              params
            )
          }
        })
      },
      async postEditLDAPSetting (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            this.xy.msgSuc('保存成功。')
            this.getLDAPDN()
          }
        } catch (error) {
          this.xy.mError('保存失败', error)
        }
      },
      // 返回列表
      back () {
        this.$emit('exitEditor')
      },

      async getTP () {
        this.tableLoading = true
        const res = await this.xy.get(
          `${this.serviceUrl}${urlSets.GetLDAPGroupCross}`,
          {
            accountID: this.AMSGbVal.accountID,
            ldapID: this.ldapRow.LDAPSettingID,
            pageIndex: this.pagination.current,
            pageSize: this.pagination.pageSize
          }
        )
        this.tableLoading = false
        if (res.success) {
          if (res.data.data != null && res.data.data.length > 0) {
            this.datatable = res.data.data
            this.pagination.total = res.data.totalRecords
            this.pageList = res.data.data.length
          } else {
            this.datatable = []
          }
        }
      },
      // 提交创建时触发
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },

      // 创建组交叉引用
      ok1 () {
        // 确定
        this.$refs.form1.validate(valid => {
          if (!valid) {
            this.loading1 = false
            this.$nextTick(() => {
              this.loading1 = true
            })
          } else {
            this.loading1 = false
            this.postCreateLDAPGroupCross(
              `${this.serviceUrl}${urlSets.CreateLDAPGroupCross}`,
              {
                AccountID: this.AMSGbVal.accountID,
                LDAPSettingID: this.LDAPForm.LDAPSettingID,
                UserTypeID: this.form1.juese,
                LDAPGroupDN: this.form1.zuming,
                // TODO: 临时方法
                UserTypeName: ''
              }
            )
          }
        })
      },
      async postCreateLDAPGroupCross (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            this.$nextTick(() => {
              this.loading1 = true
            })
            this.xy.msgSuc('创建成功。')
            this.getTP()
          }
        } catch (error) {
          this.xy.mError('创建失败', error)
        }
        this.modal1 = false
        this.$refs.form1.resetFields()
      },
      cancel1 () {
        // 取消
        this.modal1 = false
      },

      del (row) {
        this.$Modal.confirm({
          // 删除
          title: '删除',
          content: '<p>您确认要删除"' + row.LDAPGroupDN + '"吗？</p>',
          width: 600,
          onOk: () => {
            this.postDel(`${this.serviceUrl}${urlSets.DeleteLDAPGroupCross}`, {
              accountID: this.AMSGbVal.accountID,
              ldapID: row.LDAPSettingID,
              groupCrossID: row.LDAPGroupCrossRefID
            })
          },
          onCancel: () => {}
        })
      },
      async postDel (url, params) {
        const res = await this.xy.post(url, params)
        if (res.success) {
          if (this.pageList > 1) {
            this.pageList = this.pageList - 1
          } else {
            if (this.pagination.current > 1) {
              this.pagination.current = this.pagination.current - 1
            }
          }
          this.getTP()
          this.xy.msgSuc('删除成功。')
        }
      },
      // 编辑组交叉引用
      edit (row) {
        this.form2 = {
          juese: row.UserTypeID.toString(),
          zuming: row.LDAPGroupDN,
          LDAPGroupCrossRefID: row.LDAPGroupCrossRefID
        }
        this.modal2 = true
      },
      ok2 () {
        // 确定
        this.$refs.form2.validate(valid => {
          if (!valid) {
            this.loading2 = false
            this.$nextTick(() => {
              this.loading2 = true
            })
          } else {
            this.loading2 = false
            const params = {
              AccountID: this.AMSGbVal.accountID,
              LDAPSettingID: this.LDAPForm.LDAPSettingID,
              UserTypeID: this.form2.juese,
              LDAPGroupDN: this.form2.zuming,
              LDAPGroupCrossRefID: this.form2.LDAPGroupCrossRefID,
              UserTypeName: ''
            }
            this.postEditLDAPGroupCross(
              `${this.serviceUrl}${urlSets.EditLDAPGroupCross}`,
              params
            )
          }
        })
      },
      async postEditLDAPGroupCross (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            this.xy.msgSuc('编辑成功。')
            this.getLDAPRow()
          }
        } catch (error) {
          this.xy.mError('编辑失败', error)
        }
        this.loading2 = true
        this.modal2 = false
      },
      cancel2: () => {
        // 取消
        this.modal2 = false
      }
    }
  }
</script>
