<template>
  <div class="ams-main">
    <div id="menuSetting">
      <dir>
        <Button class="xy-primary" @click="AddModule">添加模块</Button>
      </dir>
      <div
        class="menu-box"
        v-for="(item, index) in dataList"
        style="margin-bottom:30px;"
        :key="index"
        >
        <div class="box-header">
          <row>
            <i-col span="12">
              <h1 class="menu-title">{{ item.Name }}</h1>
              <Icon
                type="md-create"
                class="editor-icon"
                size="20"
                @click="editTitleClick(item)"
                />
            </i-col>
            <i-col span="12" class="clearfix" style="text-align:right">
              <Button class="xy-primary" @click="addApplications(item)">添加</Button>
              <Button class="xy-danger" @click="delModule(item)">删除</Button>
            </i-col>
          </row>
        </div>
        <ul class="tab-ul">
          <li class="tab-head">
            <row>
              <i-col span="4">菜单名称</i-col>
              <i-col span="7">Web地址</i-col>
              <i-col span="7">API地址</i-col>
              <i-col span="3">显示状态</i-col>
              <i-col span="3">操作</i-col>
            </row>
          </li>
          <li
            class="tab-body"
            v-for="(childrenItem, index) in item.Applications"
            :key="index"
            >
            <row>
              <i-col span="4">{{ childrenItem.Name }}</i-col>
              <i-col span="7">
                <div v-cloak v-if="childrenItem.WebDoMainName != null">
                  {{ childrenItem.WebDoMainName }}
                </div>
                <div v-cloak v-else>无</div>
              </i-col>
              <i-col span="7">
                <div v-cloak v-if="childrenItem.ServiceDoMainName != null">
                  {{ childrenItem.ServiceDoMainName }}
                </div>
                <div v-cloak v-else>无</div>
              </i-col>
              <i-col span="3">
                <i-switch
                  size="large"
                  @on-change="childrenEditStatus(childrenItem)"
                  v-model="childrenItem.Exists"
                  >
                  <span slot="open">开启</span>
                  <span slot="close">隐藏</span>
                </i-switch>
              </i-col>
              <i-col span="3">
                <Icon
                  type="md-create"
                  class="ams-editor"
                  @click="editChildrenName(childrenItem)"
                  v-show="childrenItem.Exists"
                  />
                <Icon
                  type="md-close"
                  class="ams-close"
                  @click="delApplications(childrenItem)"
                  />
              </i-col>
            </row>
          </li>
        </ul>
      </div>
    </div>
    <!-- 编辑名称 -->
    <modal
      v-model="modalEditTitle"
      :transfer="false"
      :mask-closable="false"
      >
      <p slot="header">编辑名称</p>
      <div>
        <i-input
          v-model="editModal.Name"
          clearable
          placeholder="请输名称"
          />
      </div>
      <div slot="footer">
        <Button class="xy-btn-close" @click="modalEditTitle = false">取消</Button>
        <Button class="xy-btn-primary" @click="submitEditTitle" shape="circle">确定</Button>
      </div>
    </modal>
    <!-- 添加一级模块 -->
    <modal
      v-model="modalAddModule"
      :transfer="false"
      :mask-closable="false"
      width="600"
      >
      <p slot="header">添加模块</p>
      <div style="max-height:400px;overflow-y:auto">
        <ul class="menu-add-ul">
          <li
            v-for="(item, index) in modalModuleAppData"
            :key="index"
            @click="modalModuleSelected(item)"
            >
            <p v-cloak>{{ item.Name }}</p>
            <div class="add-check">
              <Icon
                type="md-checkmark-circle-outline"
                size="18"
                :color="item.check ? '#4196FF' : '#eee'"
                />
            </div>
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button class="xy-btn-close" @click="modalAddModule = false">取消</Button>
        <Button class="xy-btn-primary" @click="confirmAddModule" shape="circle">确定</Button>
      </div>
    </modal>
    <!-- 添加二级菜单 -->
    <modal
      v-model="modalAddApp"
      :transfer="false"
      :mask-closable="false"
      width="600"
      >
      <p slot="header">添加菜单</p>
      <div style="max-height:400px;overflow-y:auto">
        <ul class="menu-add-ul">
          <li
            v-for="(item, index) in applicationData"
            :key="index"
            @click="selectModel(item)"
            >
            <p v-cloak>{{ item.Name }}</p>
            <div class="add-check">
              <Icon
                type="md-checkmark-circle-outline"
                size="18"
                :color="item.check ? '#4196FF' : '#eee'"
                />
            </div>
            <!--<checkbox v-model="item.check" class="add-check"></checkbox>-->
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button class="xy-btn-close" @click="modalAddApp = false">取消</Button>
        <Button class="xy-btn-primary" @click="submitAddApp" shape="circle">确定</Button>
      </div>
    </modal>
    <!-- 编辑 -->
    <modal
      v-model="modalEditName"
      :transfer="false"
      :mask-closable="false"
    >
      <p slot="header">编辑</p>
      <div>
        <i-form ref="form" :model="form" :rules="formValidate" label-position="top">
          <form-item label="菜单名称：" prop="nameDoMain" labelFor="nameDoMain">
            <i-input
              elementId="nameDoMain"
              v-model.trim="form.nameDoMain"
              clearable
              placeholder="请输入菜单名称"
              />
          </form-item>
          <form-item label="WEB地址：" prop="webDoMain" labelFor="webDoMain">
            <i-input
              elementId="webDoMain"
              v-model.trim="form.webDoMain"
              clearable
              placeholder="请输入WEB地址"
              />
          </form-item>
          <form-item label="API地址：" prop="apiDoMain" labelFor="apiDoMain">
            <i-input
              elementId="apiDoMain"
              v-model.trim="form.apiDoMain"
              clearable
              placeholder="请输入API地址"
              />
          </form-item>
        </i-form>
      </div>
      <div slot="footer">
        <Button class="xy-btn-close" @click="modalEditName = false">取消</Button>
        <Button class="xy-btn-primary" @click="submit" shape="circle">确定</Button>
      </div>
    </modal>
  </div>
</template>

<script>
  import { urlSets } from './urlSets.js'
  export default {
    name: 'AMS_MenuManage',
    props: {
      AMSGbVal: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        serviceUrl: this.apiAMS,
        dataList: [],
        modalEditName: false,
        isModule: true,
        form: {
          webDoMain: '',
          apiDoMain: '',
          nameDoMain: '',
          isModule: false,
          id: 0
        },
        formValidate: {
          webDoMain: [
            { required: true, message: 'WEB地址不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 200,
              message: 'WEB地址不能超过200个字符',
              trigger: 'blur'
            }
          ],
          apiDoMain: [
            { required: true, message: 'API地址不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 200,
              message: 'API地址不能超过200个字符',
              trigger: 'blur'
            }
          ],
          nameDoMain: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' },
            {
              type: 'string',
              max: 15,
              message: '菜单名称不能超过15个字符',
              trigger: 'blur'
            }
          ]
        },
        // 添加一级模块
        modalAddModule: false,
        modalModuleAppData: [],
        // 添加二级菜单
        modalAddApp: false,
        curApplication: '',
        applicationData: [],
        // 编辑名称
        modalEditTitle: false,
        editModal: ''
      }
    },
    created: function () {},
    mounted: function () {
      this.loadList()
    },
    methods: {
      // 修改二级菜单
      editChildrenName (item) {
        this.form.apiDoMain = item.ServiceDoMainName
        this.form.webDoMain = item.WebDoMainName
        this.form.nameDoMain = item.Name
        // this.form.id = item.ID
        this.form.ApplicationForModuleID = item.ApplicationForModuleID
        this.modalEditName = true
      },
      submit () {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return false
          } else {
            var module = {}
            module.AccountID = this.AMSGbVal.accountID
            module.ID = this.form.ApplicationForModuleID
            module.ServiceDoMainName = this.form.apiDoMain
            module.WebDoMainName = this.form.webDoMain
            module.ApplicationName = this.form.nameDoMain
            module.IsModule = this.form.isModule
            this.xy.loading()
            this.postSubmit(
              `${this.serviceUrl}${urlSets.EditApplicationForModule}`,
              module
            )
          }
        })
      },
      async postSubmit (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            this.modalEditName = false
            this.xy.msgSuc('更新成功。')
            this.loadList()
          }
        } catch (error) {
          this.xy.msgError('更新失败。')
        }
        this.xy.unloading()
      },
      loadEditor () {
        // 打开编辑器 - 弃用，暂存
        // xy.http.load(
        //   xy.webUrl + '/View/AMS/PC/View/MenuEditor.html',
        //   { targetID: 'XyAMScontent' },
        //   function () {}
        // )
      },
      // 获取列表信息
      async loadList () {
        this.xy.loading()
        try {
          const res = await this.xy.get(
            `${this.serviceUrl}${urlSets.getModule}`,
            { accountID: this.AMSGbVal.accountID }
          )
          if (res.success) {
            this.dataList = res.data
          }
        } catch (error) {
          this.xy.msgError('获取列表信息失败。')
          // eslint-disable-next-line no-console
          console.error(error)
        }
        this.xy.unloading()
      },
      // 更新菜单状态
      async childrenEditStatus (item) {
        var module = {}
        module.AccountID = this.AMSGbVal.accountID
        module.ApplicationForModuleID = item.ApplicationForModuleID
        module.Exists = item.Exists
        this.xy.loading()
        try {
          const res = await this.xy.post(
            `${this.serviceUrl}${urlSets.ModuleStatus}`,
            module
          )
          if (res.success) {
            this.xy.msgSuc('更新成功。')
            this.loadList()
          }
        } catch (error) {
          // this.xy.msgError(res.msg)
          this.xy.msgError('更新失败。')
        }
        this.xy.unloading()
      },
      // 删除
      delApplications (val) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + val.Name + '"吗？',
          onOk: () => {
            this.xy.loading()
            this.postDelApplications(
              `${this.serviceUrl}${urlSets.DeleteModuleForApplication}`,
              {
                ApplicationForModuleID: val.ApplicationForModuleID,
                AccountID: this.AMSGbVal.accountID
              }
            )
          }
        })
      },
      async postDelApplications (url, data) {
        try {
          const res = await this.xy.post(url, data)
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.loadList()
          }
        } catch (error) {
          this.xy.mError('删除失败', error)
        }
        this.xy.unloading()
      },
      // 修改一级菜单名称
      editTitleClick (val) {
        this.editModal = JSON.parse(JSON.stringify(val))
        this.modalEditTitle = true
      },
      async submitEditTitle () {
        if (this.editTitle === '') {
          this.xy.msgError('请输入名称。')
          return false
        } else {
          this.xy.loading()
          try {
            const res = await this.xy.post(
              `${this.serviceUrl}${urlSets.EditModuleName}`,
              {
                AccountID: this.AMSGbVal.accountID,
                ID: this.editModal.ID,
                ModuleName: this.editModal.Name
              }
            )
            if (res.success) {
              this.xy.msgSuc('更新成功。')
              this.modalEditTitle = false
              this.loadList()
            }
          } catch (error) {
            this.xy.msgError('更新失败。')
          }
          this.xy.unloading()
        }
      },
      // 添加二级模块
      addApplications (val) {
        this.curApplication = val
        this.applicationData = []
        this.xy.loading()
        this.getAddApplications()
      },
      async getAddApplications () {
        try {
          const res = await this.xy.get(
            `${this.serviceUrl}${urlSets.GetAddApplications}?accountID=${this.AMSGbVal.accountID}`
          )
          if (res.success) {
            res.data.forEach(item => {
              item.check = false
            })
            this.applicationData = res.data
            this.modalAddApp = true
          }
        } catch (error) {
          this.xy.mError('添加失败', error)
        }
        this.xy.unloading()
      },
      delModule (item) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + item.Name + '"吗？',
          onOk: () => {
            this.xy.loading()
            this.postDelModule(
              `${this.serviceUrl}${urlSets.DeleteModuleForAccount}`,
              {
                moduleID: item.ID,
                AccountID: this.AMSGbVal.accountID
              }
            )
          }
        })
      },
      async postDelModule (url, data) {
        try {
          const res = await this.xy.post(url, data)
          if (res.success) {
            this.xy.msgSuc('删除成功。')
            this.loadList()
          }
        } catch (error) {
          this.xy.mError('删除失败', error)
        }
        this.xy.unloading()
      },
      selectModel (item) {
        item.check = !item.check
      },
      submitAddApp () {
        var arr = this.applicationData.filter(item => {
          return !!item.check
        })
        if (arr.length === 0) {
          this.xy.msgError('请选择要添加的选项。')
          return false
        } else {
          var ApplicationIDS = []
          for (var i = 0; i < arr.length; i++) {
            ApplicationIDS.push(arr[i].ID)
          }
          this.xy.loading()
          this.postSubmitAddApp({
            ModuleID: this.curApplication.ID,
            ApplicationID: ApplicationIDS,
            AccountID: this.AMSGbVal.accountID
          })
        }
      },
      async postSubmitAddApp (data) {
        try {
          const res = await this.xy.post(
            `${this.serviceUrl}${urlSets.CreateModuleForApplication}`,
            data
          )
          if (res.success) {
            this.xy.msgSuc('添加成功。')
            this.modalAddApp = false
            this.loadList()
          }
        } catch (error) {
          this.xy.msgError('添加失败。')
          // xy.message.error(this, res.data.msg)
        }
        this.xy.unloading()
      },
      AddModule () {
        this.modalAddModule = true
        this.modalModuleAppData = []
        this.getModuleList()
      },
      async getModuleList () {
        this.xy.loading()
        try {
          const res = await this.xy.get(
            `${this.serviceUrl}${urlSets.getAllNotAddList}`,
            {
              AccountID: this.AMSGbVal.accountID
            }
          )
          if (res.success) {
            res.data.forEach(item => {
              item.check = false
            })
            this.modalModuleAppData = res.data
          }
        } catch (error) {
          this.xy.mError('获取列表时发生错误', error)
        }
        this.xy.unloading()
      },
      modalModuleSelected (item) {
        item.check = !item.check
      },
      confirmAddModule () {
        let arr = this.modalModuleAppData.filter(item => {
          return !!item.check
        })
        if (arr.length === 0) {
          this.xy.msgError('请选择要添加的选项。')
          return false
        }
        let ModuleID = []
        for (var i = 0; i < arr.length; i++) {
          ModuleID.push(arr[i].ID)
        }
        this.xy.loading()
        this.postAddModule(
          `${this.serviceUrl}${urlSets.CreateModuleForAccount}`,
          {
            ModuleID: ModuleID,
            AccountID: this.AMSGbVal.accountID
          }
        )
      },
      async postAddModule (url, params) {
        try {
          const res = await this.xy.post(url, params)
          if (res.success) {
            this.xy.msgSuc('添加成功。')
            this.loadList()
          }
        } catch (error) {
          this.xy.mError('添加失败', error)
        }
        this.modalAddModule = false
        this.xy.unloading()
      }
    }
  }
</script>
