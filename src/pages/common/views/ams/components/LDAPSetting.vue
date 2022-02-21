<template>
  <div class="ams-LDAP">
    <div v-if="!LDAPEditorSets.show" class="ams-LDAPSetting">
      <div class="xy-content-title clearfix">
        <div class="fl">
          <Button class="xy-primary" @click="modal1 = true">创建域名</Button>
          <Button class="xy-info" @click="modal2 = true">登录测试</Button>
        </div>
        <div class="fr pr" style="width:500px;"></div>
      </div>
      <div class="xy-content-body">
        <div class="title-describe">
          管理您的LDAP设置。您可以创建一个或多个域名，也可以编辑域名，完善域名信息，做组交叉引用等。
        </div>
        <XyAntTable
          :columns="columns"
          :dataSource="datatable"
          :tableLoading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :scrollx="'max-content'"
          >
          <div slot="DomainName" style="min-width:200px" slot-scope="text, record">
            <span class="table-el-hover" @click="edit(record)">
              {{ record.DomainName}}
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
    <LDAPEditor
      v-else
      :editorData="LDAPEditorSets.data"
      :AMSGbVal="AMSGbVal"
      @exitEditor="exitEditor"
      />
    <!--创建域名 -->
    <modal
      v-model="modal1"
      :transfer="false"
      title="创建域名"
      :loading="loadingDomain"
      :mask-closable="false"
      @on-ok="createDomain"
      @on-cancel="cancelDomain"
      >
      <div class="dialog-model-content">
        <i-form
          ref="domainForm"
          :model="domainForm"
          :rules="domainValidate"
          :label-width="120"
          >
          <form-item label="完全限定域名" prop="domainName" labelFor="domainForm">
            <i-input
              elementId="domainForm"
              v-model="domainForm.domainName"
              clearable
              style="width: 200px"
              />
          </form-item>
        </i-form>
      </div>
    </modal>

    <!--登录测试 -->
    <modal
      v-model="modal2"
      :transfer="false"
      title="登录测试"
      :loading="loadingLogin"
      :mask-closable="false"
      >
      <div class="dialog-model-content">
        <i-form
          ref="LoginForm"
          :model="LoginForm"
          label-position="top"
          :rules="LoginValidate"
          >
          <form-item label="用户名：" prop="loginName" labelFor="loginName">
            <i-input v-model="LoginForm.loginName" elementId="loginName" clearable  />
          </form-item>
          <form-item label="密码：" prop="loginPassword" labelFor="loginPassword">
            <i-input
              v-model="LoginForm.loginPassword"
              elementId="loginPassword"
              type="password"
              clearable
              />
          </form-item>
        </i-form>
      </div>
      <div slot="footer">
        <Button class="xy-btn-close" @click="modal2 = false">取消</Button>
        <Button class="xy-btn-primary" shape="circle" @click="createLogin">确认</Button>
      </div>
    </modal>
  </div>
</template>

<script>
  import { urlSets } from './urlSets.js'
  import LDAPEditor from './LDAPEditor.vue'
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'AMS_LDAPSetting',
    components: {
      LDAPEditor,
      XyAntTable
    },
    props: {
      AMSGbVal: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        serviceUrl: this.apiAMS,
        modal1: false,
        loadingDomain: true,
        selectionAll: [],
        pageList: 0, // 当前页数据条数
        columns: [
          // {
          //    type: 'selection',
          //    width: 50,
          //    align: 'center',
          //    key: 'LDAPSettingID'
          // },
          {
            title: '完全限定域名',
            key: 'DomainName',
            scopedSlots: { customRender: 'DomainName' }
          },
          {
            title: '操作',
            key: '04',
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
        domainForm: {
          domainName: ''
        },
        domainValidate: {
          domainName: [
            {
              required: true,
              message: '完全限定域名不能为空',
              trigger: 'change'
            }
          ]
        },
        modal2: false,
        loadingLogin: true,
        LoginForm: {
          loginName: '',
          loginPassword: ''
        },
        LoginValidate: {
          loginName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          loginPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        },
        LDAPEditorSets: {
          show: false,
          data: {}
        }
      }
    },
    created: function () {
      this.getTP()
    },
    mounted: function () {},
    methods: {
      handleTableChange () {
        this.getTP()
      },
      async getTP () {
        this.tableLoading = true
        try {
          const res = await this.xy.get(`${this.serviceUrl}${urlSets.GetLDAPSetting}`, {
            accountID: this.AMSGbVal.accountID,
            pageIndex: this.pagination.current,
            pageSize: this.pagination.pageSize
          })
          this.tableLoading = false
          if (res.success) {
            this.datatable = res.data.data
            this.pagination.total = res.data.totalRecords
            this.pageList = res.data.data.length
          }
        } catch (error) {
          this.xy.mError('获取数据失败', error)
        }
      },
      // 提交创建时触发
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      // 全选/取消全选触发
      changeSelect (selection) {
        if (selection.length > 0) {
          this.selectionAll = selection
        } else {
          this.selectionAll = []
        }
      },

      createDomain () {
        // 确定
        this.$refs.domainForm.validate(valid => {
          if (!valid) {
            this.loadingDomain = false
            this.$nextTick(() => {
              this.loadingDomain = true
            })
          } else {
            this.loadingDomain = false
            this.postCreateLDAPSetting(
              `${this.serviceUrl}${urlSets.CreateLDAPSetting}`,
              {
                AccountID: this.AMSGbVal.accountID,
                DomainName: this.domainForm.domainName,
                // TODO: 以下参数并不需要，临时解决用
                LDAPSettingID: 0,
                DirectoryService: '',
                UserName: '',
                Password: '',
                BaseDN: '',
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
                AnonymousBindEnabled: false,
                PortNumber: 0,
                Active: true
              }
            )
          }
        })
      },
      async postCreateLDAPSetting (url, params) {
        try {
          const res = await this.xy.post(url, params, true)
          if (res.success) {
            this.$nextTick(() => {
              this.loadingDomain = true
            })
            this.xy.msgSuc('创建成功。')
            this.getTP()
            this.modal1 = false
            this.$refs.domainForm.resetFields()
          } else {
            this.xy.mError('创建失败', res.msg)
            this.modal1 = false
            this.$refs.domainForm.resetFields()
          }
        } catch (error) {
          this.xy.mError('创建失败', error)
          this.modal1 = false
          this.$refs.domainForm.resetFields()
        }
      },
      cancelDomain () {
        // 取消
        this.modal1 = false
        this.$refs.domainForm.resetFields()
      },
      // 登录测试
      createLogin () {
        // 确定
        this.$refs.LoginForm.validate(valid => {
          if (!valid) {
            this.loadingLogin = false
            this.$nextTick(() => {
              this.loadingLogin = true
            })
          } else {
            this.loadingLogin = false
            this.postTestSignIn(`${this.serviceUrl}${urlSets.TestSignIn}`, {
              accountID: this.AMSGbVal.accountID,
              userName: this.LoginForm.loginName,
              password: this.LoginForm.loginPassword
            })
          }
        })
      },
      async postTestSignIn (url, params) {
        const res = await this.xy.post(url, params, true)
        if (res.success) {
          this.$nextTick(() => {
            this.loadingLogin = true
          })
          this.xy.mSuc('测试登录', '测试登录成功。')
          this.modal2 = false
          // this.$refs.LoginForm.resetFields();
        } else {
          this.xy.mError('测试登录', res.msg)
          // this.modal2 = false;
          // this.$refs.LoginForm.resetFields();
        }
      },
      // 删除
      del (row) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除"' + row.DomainName + '"吗？</p>',
          onOk: nodesc => {
            this.postDeleteLDAPSetting(
              `${this.serviceUrl}${urlSets.DeleteLDAPSetting}`,
              {
                accountID: this.AMSGbVal.accountID,
                ldapID: row.LDAPSettingID
              }
            )
          },
          onCancel () {}
        })
      },
      async postDeleteLDAPSetting (url, params) {
        const res = await this.xy.post(url, params)
        if (!res.success) {
          return
        }
        if (this.pageList > 1) {
          this.pageList = this.pageList - 1
        } else {
          if (this.pagination.current > 1) {
            this.pagination.current = this.pagination.current - 1
          }
        }
        this.getTP()
        this.xy.msgSuc('删除成功。')
      },
      // 编辑
      edit (row) {
        this.LDAPEditorSets = {
          show: true,
          data: row
        }
      },
      exitEditor () {
        this.LDAPEditorSets = {
          show: false,
          data: {}
        }
        this.getTP()
      }
    }
  }
</script>
