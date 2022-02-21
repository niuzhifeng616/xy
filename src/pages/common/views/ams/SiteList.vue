<template>
  <div id="AMS_siteList" class="AMS-siteList">
    <div id="XyMain" class="clearfix" style="margin-top:70px;">
      <div v-if="!model_createSchool" class="main-host">
        <div id="LDAPSetting" class="clearfix">
          <div style="margin-top:20px">
            <!-- <i-button type="primary" @click="createSite">创建站点</i-button> -->
          </div>
          <div>
            <XyAntTable
              :columns="columns"
              :dataSource="datatable"
              :tableLoading="tableLoading"
              :isPage="false"
              :scrollx="'max-content'"
              >
              <div slot="Name" style="min-width:200px" slot-scope="text, record">
                <span class="table-el-hover" @click="edit(record)">
                  {{ record.Name}}
                </span>
              </div>
              <span slot="04" slot-scope="text, record">
                <a @click="edit(record)">进入</a>
              </span>
            </XyAntTable>
          </div>

          <!--创建站点 —— TODO: 1.被其他模块代替；2.且，本功能被取消。 此处代码仅为暂存 -->
          <!-- <modal
            v-model="createAccount"
            :transfer="false"
            title="创建站点"
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
                <form-item label="站点编号" prop="domainName">
                  <i-input
                    v-model="domainForm.accountNumber"
                    clearable
                    style="width: 200px"
                  ></i-input>
                </form-item>
                <form-item label="站点名称" prop="domainName">
                  <i-input
                    v-model="domainForm.accountName"
                    clearable
                    style="width: 200px"
                  ></i-input>
                </form-item>
                <form-item label="数据库名称" prop="domainName">
                  <i-input
                    v-model="domainForm.dbName"
                    clearable
                    style="width: 200px"
                  ></i-input>
                </form-item>
                <form-item label="读库" prop="domainName">
                  <i-input
                    v-model="domainForm.readDB"
                    clearable
                    style="width: 200px"
                  ></i-input>
                </form-item>
                <form-item label="写库" prop="domainName">
                  <i-input
                    v-model="domainForm.writeDB"
                    clearable
                    style="width: 200px"
                  ></i-input>
                </form-item>
              </i-form>
            </div>
          </modal> -->
        </div>
      </div>
      <div v-else class="createSchool">
        <CreateSite @exit="exitSite" />
      </div>
    </div>
  </div>
</template>

<script>
  import { urlSets } from './components/urlSets.js'
  import CreateSite from './components/CreateSite'
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'SiteList',
    components: {
      CreateSite,
      XyAntTable
    },
    data () {
      return {
        serviceUrl: this.apiAMS,
        model_createSchool: false,
        isDataShow: false,
        createAccount: false,
        loadingDomain: true,
        domainForm: {
          domainName: ''
        },
        domainValidate: {
          domainName: [
            {
              required: true,
              message: '完全限定域名不能为空',
              trigger: 'blur'
            }
          ]
        },
        editAccount: false,
        columns: [
          {
            title: '站点名称',
            dataIndex: 'Name',
            scopedSlots: { customRender: 'Name' }
          },
          {
            title: '操作',
            dataIndex: '04',
            width: 120,
            scopedSlots: { customRender: '04' }
          }
        ],
        tableLoading: false,
        datatable: [] // table数据
      }
    },
    created: function () {
      this.loadAccount()
    },
    mounted: function () {},
    methods: {
      // 加载页面
      async loadAccount () {
        this.tableLoading = true
        try {
          const rs = await this.xy.get(
            `${this.serviceUrl}${urlSets.getAccount}`
          )
          this.tableLoading = false
          if (rs.success) {
            this.$set(this, 'datatable', rs.data)
          }
        } catch (error) {
          this.xy.msgError('获取列表失败。')
          // eslint-disable-next-line no-console
          console.error(error)
        }
      },
      // 编辑
      edit (item) {
        this.$router.push({ name: 'AMS_management', query: { ID: item.ID } })
      },
      // ----- 以下方法均被废弃，暂存 -----
      createDomain: () => {
        // 此部分被废弃，暂存
        // =>确定
        this.$refs.domainForm.validate(valid => {
          if (!valid) {
            this.loadingDomain = false
            this.$nextTick(() => {
              this.loadingDomain = true
            })
          } else {
            this.loadingDomain = false
            this.$nextTick(() => {
              this.loadingDomain = true
            })
            this.modal1 = false
            this.domainForm.domainName = ''
            this.$Notice.success({
              title: '提示',
              desc: '创建成功 '
              // TODO: 迁移时，nodesc尚不明确，且当前部分似乎作废，暂时注释处理
              // desc: nodesc ? '' : '创建成功 '
            })
            this.postCreateType(`${this.serviceUrl}/api/Building/CreateType`, {
              BuildingTypeName: this.formValidate.venueValue
            })
          }
        })
      },
      async postCreateType (url, params) {
        // 调用部分被放弃，暂存
        const res = await this.xy.post(url, params)
        if (res.success) {
          this.changeLoading()
          this.xy.msgSuc('创建成功。')
          var _data = {
            searchName: this.searchName,
            current: this.pageCurrent ? this.pageCurrent : 1,
            size: this.pageSize
          }
          this.getTP(_data)
          this.modal1 = false
          this.formValidate.venueValue = ''
        } else {
          this.xy.msgError('创建失败。')
          this.modal1 = false
          this.formValidate.venueValue = ''
        }
      },
      // 创建域名 - 废弃，暂存
      changeLoading: loading => {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      cancelDomain () {
        // 此部分被废弃，暂存
        // 取消
        this.modal1 = false
      },
      // 创建站点 - 废弃，暂存
      createSite () {
        this.model_createSchool = true
      },
      exitSite () {
        // 废弃，暂存
        this.model_createSchool = false
      }
    }
  }
</script>
