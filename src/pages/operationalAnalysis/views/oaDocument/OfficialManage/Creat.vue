<template>
  <div class="xy-content-module">
        <div class="xy-content-body" v-cloak>
            <div style="width:600px;margin:0 auto;">
                <i-form ref="formValidateOk" :model="formValidateOk" :rules="ruleValidateOk"
                    :label-width="80">
                    <form-item label="主题" prop="theme"  labelFor="theme">
                        <i-input v-model="formValidateOk.theme" type="text" maxlength="20" placeHolder="请填写公文内容主题" elementId="theme">
                        </i-input>
                    </form-item>
                    <form-item label="公文标题" prop="title" labelFor="title">
                        <i-input v-model="formValidateOk.title" type="textarea" maxlength="100" placeHolder="请填写公文标题" elementId="title">
                        </i-input>
                    </form-item>
                    <form-item label="公文种类" prop="officeTypeId">
                        <i-select v-model="formValidateOk.officeTypeId">
                            <i-option v-cloak v-for="type in typeAll" :value="type.ID" :key="type.ID">
                                {{ type.Name }}</i-option>
                        </i-select>
                    </form-item>
                    <form-item label="秘密等级" prop="officeLevelId">
                        <i-select v-model="formValidateOk.officeLevelId" @on-change="getBarch">
                            <i-option v-cloak v-for="type in levelAll" :value="type.ID" :key="type.ID">
                                {{ type.Name }}</i-option>
                        </i-select>
                    </form-item>
                    <form-item label="紧急程度" prop="officeUrgentId">
                        <i-select v-model="formValidateOk.officeUrgentId">
                            <i-option v-cloak v-for="type in urgentAll" :value="type.ID" :key="type.ID">
                                {{ type.Name }}</i-option>
                        </i-select>
                    </form-item>
                    <form-item label="发文机关" labelFor="organ">
                        <i-input v-model="formValidateOk.sendOffice" type="textarea" maxlength="30" placeHolder="请填写发文机关" elementId="organ">
                        </i-input>
                    </form-item>
                    <form-item label="发文字号" labelFor="officeFont">
                        <i-input v-model="formValidateOk.sendNameBrand" type="textarea" maxlength="30"
                            placeHolder="请填写发文字号" elementId="officeFont"></i-input>
                    </form-item>
                    <form-item label="发文内容" prop="files">
                        <upload
                          style="display:inline-block;"
                          :format="uploadFormat"
                          ref="upload"
                          :multiple="true"
                          :show-upload-list="showUploadList"
                          :max-size="20480"
                          :on-format-error="formatErrorIcon"
                          :headers="{'Access-Control-Allow-Origin' : '*','XYTOKEN':token }"
                          :on-exceeded-size="MaxSizeIcon"
                          :before-upload="BeforeUpload"
                          :on-success="SuccessIcon"
                          :on-error="ErrorIcon"
                          :action="puthUpload"
                          :on-remove="RemoveIcon"
                          :default-file-list="defaltFileList">
                          <p slot="tip" style="color:#7f7f7f;">支持文件格式：.rar .zip .doc .docx .xls .xlsx .ppt .pptx .pdf ，单个文件不能超过20Mb，最多支持上传10个文件。</p>
                          <i-button icon="ios-cloud-upload-outline">选择文件</i-button>
                        </upload>
                        <!-- <tooltip word-wrap max-width="350" placement="right"
                            content="支持文件格式：.rar .zip .doc .docx .xls .xlsx .ppt .pptx .pdf ，单个文件不能超过20Mb，最多支持上传10个文件。">
                            <Icon type="md-help-circle" size="18" color="#ffad33" />
                        </tooltip> -->
                    </form-item>
                    <form-item label="附注" labelFor="Remarks">
                        <i-input v-model="formValidateOk.otherInfo" type="textarea" maxlength="300"
                            placeHolder="请填写公文印发传达范围等需要说明的事项" elementId="Remarks"></i-input>
                    </form-item>
                </i-form>
                <div class="proval-con" v-if="barchData.length>0">
                    <WorkflowApply :workflow="barchData" :isAddList="isAddList"></WorkflowApply>
                </div>
                <div class="foot">
                  <Button class="xy-btn-primary" shape="circle" @click="ok" :loading="isShowSpin">提交</Button>
                  <Button class="xy-btn-close" @click="ReturnClick" style="margin-right:30px;">取消</Button>
                </div>
                <!-- 查看审批人 -->
                <Modal v-model="shenpi" title="审批人" @on-ok="modalOk2">
                    <radio-group  v-model="sureId" @on-change="radioChangeSure">
                        <radio size="large" v-for="(child,index) in shenpiMore"
                            :label="child.UserID+'?'+child.FullName" class="check-name" :key="index">{{child.FullName}}
                        </radio>
                    </radio-group>
                </Modal>
                <Modal v-model="shenpi1" title="审批人" @on-ok="modalOk3">
                    <div v-for="(child ,index) in shenpiMore" :key="index">
                        <Tag>{{child.FullName}}</Tag>
                    </div>
                </Modal>
                <!-- 查看更多抄送人 -->
                <Modal v-model="chaosong" title="抄送给" @on-ok="chaosongok">
                  <div v-for="(item,index) in chaosongMore" :key="index">
                    <Tag>{{item.FullName}}</Tag>
                  </div>
                </Modal>
                <!-- 角色结构树形数据 -->
                <Modal
                  :styles="{top:'20px',width:clientWidth+'px'}"
                  v-model="coperModal"
                  title="选择人员"
                  @on-ok="modalOk"
                  >
                    <row class="cascader-content">
                        <i-col span="6" class="cascader-content-left">
                            <tree class="tree-dom" :data="coperTree" @on-select-change="treeSelect2"></tree>
                        </i-col>
                        <i-col span="18" class="cascader-content-center" style="border-right:none;">
                            <div>
                                <checkbox-group v-model="coperId" @on-change="radioChange2">
                                    <checkbox :disabled="isSelect" size="large" v-for="(child,index) in coper"
                                        :label="child.ID+'?'+child.Name" :title="child.OrganizationName"
                                        class="check-name" :key="index">{{child.Name}}
                                    </checkbox>
                                </checkbox-group>
                            </div>
                            <alert v-if="fAlert" show-icon style="margin:0px 0px 20px;">
                                温馨提示
                                <icon type="ios-bulb-outline" slot="icon"></icon>
                                <template slot="desc">
                                    点击左侧栏中的组织，右侧栏勾选人员
                                </template>
                            </alert>
                            <alert v-if="coper.length==0&&isDataList" type="warning" show-icon style="margin:0px 0px 20px">
                                未查询到相关数据
                                <template slot="desc">
                                    当前分组下暂无数据，请切换分组后重新查找
                                </template>
                            </alert>
                        </i-col>
                    </row>
                    <spin v-if="isLoadingShow" fix>
                        <icon type="ios-loading" size=18 class="spin-icon-load"></icon>
                        <div>加载中...</div>
                    </spin>
                </Modal>
            </div>
        </div>
        <!-- <script src="XYSubSiteLinkUrl/View/oaDocument/OfficialManage/PC/Scripts/Creat.js"></script> -->
    </div>

</template>
<script>
  import WorkflowApply from '@/components/workflow/WorkflowApply.vue'
  export default {
    components: {
      WorkflowApply
    },
    data: function () {
      return {
        isAddList: 0,
        token: this.xy.getCookie('.XYTOKEN'),
        isShowSpin: false,
        isEdit: false,
        pofficeId: '',
        leaveTypeID: 0,
        typeAll: [], // 全部公文种类
        levelAll: [], // 全部秘密等级
        urgentAll: [], // 全部紧急程度
        formValidateOk: {
          theme: '',
          title: '',
          officeTypeId: '',
          officeLevelId: '',
          officeUrgentId: '',
          sendOffice: '',
          sendNameBrand: '',
          files: [],
          otherInfo: ''
        },
        ruleValidateOk: {
          theme: [
            { required: true, message: '公文内容主题不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '主题不能超过20字符', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '公文标题不能为空', trigger: 'blur' },
            { type: 'string', max: 100, message: '公文标题不能超过100字符', trigger: 'blur' }
          ],
          officeTypeId: [
            { required: true, message: '公文种类不能为空', type: 'number', trigger: 'change' }
          ],
          sendOffice: [
            { type: 'string', max: 30, message: '发文机关不能超过30字符', trigger: 'blur' }
          ],
          sendNameBrand: [
            { type: 'string', max: 30, message: '发文字号不能超过30字符', trigger: 'blur' }
          ],
          officeLevelId: [
            { required: true, message: '秘密等级不能为空', type: 'number', trigger: 'change' }
          ],
          officeUrgentId: [
            { required: true, message: '紧急程度不能为空', type: 'number', trigger: 'change' }
          ],
          files: [
            { required: true, type: 'array', message: '发文内容不能为空', trigger: 'change' }
          ],
          otherInfo: [
            { type: 'string', max: 300, message: '附注不能超过300字符', trigger: 'blur' }
          ]
        },

        // 上传
        showUploadList: true,
        uploadFormat: ['rar', 'zip', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
        defaltFileList: [], // 默认已上传的文件
        puthUpload: '', // 上传文件地址

        // 审批流
        username: '',
        userId: '',
        barchData: [],

        coperModal: false,
        clientWidth: 1000,
        coperTree: [],
        coper: [],
        coperId: [],
        fAlert: true, // 首次
        isDataList: false,
        isLoadingShow: false, // modal加载动画
        coperername: [],
        copererid: [],
        curModal: '',
        curArr: '',
        chaosong: false,
        chaosongMore: [],
        shenpi: false,
        shenpiMore: [],
        isSelect: false,
        isSelect2: false,
        sureName: [],
        sureId1: [],
        sureId: '',
        shenpi1: false,
        teacherTree: []
      }
    },
    created: function () {
      this.GetUserInfo()
      this.getType()
      this.getLevel()
      this.getUrgent()
      // this.getRows();
    },
    mounted: function () {
      // 上传地址
      this.puthUpload = this.$store.state.apiPath + '/api/OfficialDocument/Upload'
    },
    methods: {
      showName: function (name) {
        // 纯中文：汉字姓名大于2个字展示最后2个字，小于等于2个字
        if (!name) {
          return ''
        } else if (/^[\u4e00-\u9fa5]+$/g.test(name)) {
          return name.length > 2 ? name.slice(-2) : name
        } else if (/^[A-Za-z]+$/g.test(name)) {
          // 纯英文名只展示两个字母
          return name.slice(0, 2)
        } else {
          // 其他
          return name.slice(0, 2)
        }
      },
      // 获取公文种类
      getType: function () {
        var _this = this
        _this.xy.get(`${_this.$store.state.apiPath}/api/OfficialDocType/GetAll`).then(res => {
          _this.typeAll = res.data
        })
        // xy.http.get(xy.string.format('{0}/api/OfficialDocType/GetAll', xy.subMenuServiceUrl), null, function (res) {
        //   _this.typeAll = res.data.data
        // })
      },
      // 获取秘密等级
      getLevel: function () {
        var _this = this
        _this.xy.get(`${_this.$store.state.apiPath}/api/OfficialDocSecretLevel/GetAll`).then(res => {
          _this.levelAll = res.data
        })
        // xy.http.get(xy.string.format('{0}/api/OfficialDocSecretLevel/GetAll', xy.subMenuServiceUrl), null, function (res) {
        //   _this.levelAll = res.data.data
        // })
      },
      // 获取紧急程度
      getUrgent: function () {
        var _this = this
        _this.xy.get(`${_this.$store.state.apiPath}/api/OfficialDocEmergencyLevel/GetAll`).then(res => {
          _this.urgentAll = res.data
        })
      },

      // 上传
      formatErrorIcon: function (file, fileList) {
        // xy.message.error(this, '文件格式不正确,只能上传.rar .zip .doc .docx .xls .xlsx .ppt .pptx .pdf格式的文件！')
        this.xy.msgError('文件格式不正确,只能上传.rar .zip .doc .docx .xls .xlsx .ppt .pptx .pdf格式的文件。')
      },
      MaxSizeIcon: function (file, fileList) {
        this.xy.msgError('文件格式大小超过20M。')
      },
      BeforeUpload: function (file) {
        let check = this.formValidateOk.files.length < 10
        if (!check) {
          this.xy.msgError('最多支持上传10个文件。')
          return false
        }
        if (file.name.length > 35) {
          this.xy.msgError('文件名称最多35个字符')
          return false
        }
      },
      SuccessIcon: function (res, file, fileList) {
        if (res.success) {
          this.xy.msgSuc('上传成功。')
          this.formValidateOk.files = fileList.map(function (item) {
            return {
              FileName: item.response.data.FileName,
              VirtualPath: item.response.data.url
            }
          })
        }
      },
      ErrorIcon: function (error, file, fileList) {
        console.log(error, file, fileList)
        this.xy.msgError(error)
      },
      RemoveIcon: function (file, fileList) {
        // fileList删除后其余已上传的文件列表（file删除文件）
        this.formValidateOk.files = fileList.map(function (item) {
          return {
            FileName: item.response.data.FileName,
            VirtualPath: item.response.data.url
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
      // 确认创建
      ok: function () {
        // var arr = []
        var _this = this
        var flowNodes = []
        this.barchData.forEach(function (item) {
          flowNodes.push({
            NodeType: item.NodeType, // 节点类型
            ApprovalFlowNodeName: item.WorkFlowNodeName, // 节点名称
            ApprovalMemberRoleID: item.ApprovalMemberRoleID, // 审批成员类型 1：职务角色 2：自定义角色
            ApprovalMemberType: item.ApprovalMemberType, // 审批成员类型 0：指定成员 1：职务角色 2：自定义角色 3：申请人选择
            ApprovalMode: item.ApprovalMode, // 审批模式  会签 = 1  或签 = 0
            IsApprovalMySelf: item.IsApprovalMySelf, // 审批人就是申请人（自己审批自己）
            IsApprovalComplete: item.IsApprovalComplete, // 审批人已经审批通过
            ApprovalUsers: [], // item.ApprovalMemberList, // 审批人
            CCUsers: [] // item.CheckedCcMemberList//抄送人
          })
        })
        for (var w = 0, wlen = this.barchData.length; w < wlen; w++) {
          // 审批人
          if (this.barchData[w].NodeType === 2) {
            if (this.barchData[w].ApprovalMemberType === 0) { // 会签/或签
              this.barchData[w].isGo = true
              this.barchData[w].ApprovalMemberList.forEach((ap) => {
                flowNodes[w].ApprovalUsers.push(ap.UserID)
              })
            } else { // 审批
              if (this.barchData[w].ApprovalMemberList.length > 0) {
                this.barchData[w].isGo = false
                this.barchData[w].CheckedApprovalMemberList.map((appItem) => {
                  if (appItem.IsShow) {
                    this.barchData[w].isGo = true
                    flowNodes[w].ApprovalUsers.push(appItem.UserID)
                  }
                })
              } else {
                this.barchData[w].isGo = false
              }
            }
          } else {
            // 抄送人
            this.barchData[w].CheckedCcMemberList.forEach(function (cc) {
              flowNodes[w].CCUsers.push(cc.UserID)
            })
          }
        }
        if (this.barchData.length === 0) {
          this.xy.msgError('请添加审批流程。')
          return false
        }
        for (let isgo = 0; isgo < this.barchData.length; isgo++) {
          if (this.barchData[isgo].isGo === false) {
            this.xy.msgError('审批人不能为空。')
            return false
          }
        }
        if (flowNodes) {
          // flowNodes = arr
          this.$refs.formValidateOk.validate(function (valid) {
            if (!valid) {
              return _this.changeLoading()
            } else {
              _this.isShowSpin = true
              let params = {
                OfficialDocTheme: _this.formValidateOk.theme,
                OfficialDocTitle: _this.formValidateOk.title,
                OfficialDocTypeID: _this.formValidateOk.officeTypeId, // 公文种类
                OfficialDocSecretLevelID: _this.formValidateOk.officeLevelId, // 秘密等级
                OfficialDocEmergencyLevelID: _this.formValidateOk.officeUrgentId, // 紧急程度
                FromOffice: _this.formValidateOk.sendOffice,
                issueNumber: _this.formValidateOk.sendNameBrand,
                remark: _this.formValidateOk.otherInfo,
                List: _this.formValidateOk.files,
                models: flowNodes
              }
              _this.xy.post(`${_this.$store.state.apiPath}/api/OfficialDocument/Create`, params).then(res => {
                _this.isShowSpin = false
                if (res.success) {
                  _this.changeLoading()

                  // xy.message.success(_this, {
                  //   content: '创建成功！'
                  // })
                  _this.xy.msgSuc('创建成功。')
                  _this.ReturnClick()
                }
              })
            }
          })
        }
      },
      // 确认编辑
      edit: function () {
        var _this = this
        this.$refs.formValidateOk.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.isShowSpin = true
            let params = {
              OfficialDocID: '', // id
              OfficialDocTheme: _this.formValidateOk.theme,
              OfficialDocTitle: _this.formValidateOk.title,
              OfficialDocTypeID: _this.formValidateOk.officeTypeId,
              OfficialDocSecretLevelID: _this.formValidateOk.officeLevelId,
              OfficialDocEmergencyLevelID: _this.formValidateOk.officeUrgentId, // 紧急程度
              FromOffice: _this.formValidateOk.sendOffice,
              issueNumber: _this.formValidateOk.sendNameBrand,
              remark: _this.formValidateOk.otherInfo,
              List: _this.formValidateOk.files
            }
            _this.xy.post(`${this.$store.state.apiPath}/api/OfficialDocument/Update`, params).then(res => {
              _this.isShowSpin = false
              if (res.data.success) {
                _this.xy.msgSuc('创建成功。')
                _this.changeLoading()

                // xy.message.success(_this, {
                //   content: '创建成功！'
                // })
                _this.ReturnClick()
              }
            })
          }
        })
      },
      // 返回
      ReturnClick: function () {
        this.$router.back()
        // xy.http.load(xy.string.format('{0}/View/oaDocument/OfficialManage/PC/View/Manage.html', xy.subMenuWebUrl))
      },
      // 用户
      GetUserInfo: function () {
        var _this = this
        this.xy.get(`${_this.xyApi}/base/api/Users/GetUserInfo`).then(res => {
          if (res.success) {
            _this.username = res.data.FullName
            _this.userId = res.data.UserID
          }
        })
      },
      async getBarch (data) {
        this.xy.loading()
        var _this = this
        let res = await _this.xy.post(_this.$store.state.apiPublic + '/api/WorkFlowSetting/ApprovalProcessByCondition', {
          ApplicantUserID: this.userId,
          OrganizationID: 0,
          WorkFlowType: 1,
          ConditionValues: [{ Type: 1, Code: 4, Value: data }]
          // ConditionValues: [{ Type: 0, Code: 1, Value: days }, { Type: 0, Code: 2, Value: 1 }]
        })
        if (res.success) {
          this.xy.unloading()
          this.barchData = []
          this.barchData = res.data
        }
      },
      addCoper: function (curIndex) {
        this.coperModal = true
        this.isLoadingShow = true
        var _this = this
        this.coper = []
        this.isSelect = false
        this.curArr = curIndex
        this.coperTree = []
        this.xy.get(`${this.xyApi}/api/OfficialDocWorkTemplate/GetTeacherTree`).then(res => {
          if (res.success) {
            _this.isLoadingShow = false
            var respon = res.data.data
            for (var i = 0; i < respon.length; i++) {
              console.log(respon[i])
              _this.coperTree.push({
                title: respon[i].Name,
                children: _this.getWorkFlowTeacherTree(respon[i].Children),
                id: respon[i].SchoolDistrictID,
                nodetype: respon[i].SchoolDistrictID,
                Users: respon[i].Users,
                mm: '3'
              })
            }
          }
        })
      },
      getWorkFlowTeacherTree: function (orglist) { // 递归指定成员和申请人选择的左侧树结果
        var that = this
        if (orglist.length > 0) {
          var result = []
          for (var i = 0; i < orglist.length; i++) {
            var users = []
            if (orglist[i].Users !== undefined) {
              users = orglist[i].Users
            }
            result.push({
              title: orglist[i].Name,
              children: that.getWorkFlowTeacherTree(orglist[i].Children),
              id: orglist[i].SchoolDistrictID,
              nodetype: orglist[i].SchoolDistrictID,
              Users: users,
              mm: '1'
            })
          }
          return result
        }
      },
      treeSelect2: function (data) {
        this.modalOk()
        console.log(data)
        this.coper = []
        this.teacherTree = []
        this.coperId = []
        this.copererid = []
        this.coperername = []
        // 设置中间值
        if (data.length > 0) {
          this.fAlert = false // 首次
          // this.isLoadingShow = true;
          this.isDataList = false
          var _this = this
          if (data) {
            this.coper = data[0].Users
            this.isDataList = true
          } else {
            _this.isDataList = true
            _this.isLoadingShow = false
          };
        };
      },
      radioChange2: function (data) {
        var _this = this
        console.log(_this.barchData[_this.curArr].CCUsers)
        var ok = 10 - _this.barchData[_this.curArr].CCUsers.length - 1
        console.log(ok, data)
        if (data.length > ok) {
          _this.isSelect = true
        } else {
          _this.coperername = data.map(function (item) {
            return item.split('?')[1]
          })
          _this.copererid = data.map(function (item) {
            return item.split('?')[0]
          })
        }
      },
      radioChangeSure: function (data) {
        this.sureName = []
        this.sureId = []
        this.sureId1 = []
        console.log(data, data.split('?')[1], data.split('?')[0])
        var _this = this
        _this.sureId = data
        _this.sureName.push(_this.sureId.split('?')[1])
        _this.sureId1.push(_this.sureId)
        console.log(_this.sureName, _this.sureId, _this.sureId1)
      },
      modalOk: function () {
        var arrId = this.coperId.map(function (item) {
          return Number(item.split('?')[0])
        })
        var arrName = this.coperId.map(function (item) {
          return item.split('?')[1]
        })
        var yuanId = this.barchData[this.curArr].CCUsers.map(function (item) {
          return item.UserID
        })
        var yuanName = this.barchData[this.curArr].CCUsers.map(function (item) {
          return item.FullName
        })
        var pinArr = []
        pinArr = this.coperId.map(function (item) {
          return {
            UserID: Number(item.split('?')[0]),
            FullName: item.split('?')[1],
            DisplayName: '抄送'
          }
        })
        console.log(pinArr)
        var endId = yuanId.concat(arrId)
        this.barchData[this.curArr].CRR = endId
        var endName = yuanName.concat(arrName)
        this.barchData[this.curArr].CCUsers = this.barchData[this.curArr].CCUsers.concat(pinArr)
        var resultaa = []
        var obj = {}
        for (var i = 0; i < this.barchData[this.curArr].CCUsers.length; i++) {
          if (!obj[this.barchData[this.curArr].CCUsers[i].UserID]) {
            resultaa.push(this.barchData[this.curArr].CCUsers[i])
            obj[this.barchData[this.curArr].CCUsers[i].UserID] = true
          }
        }
        console.log(resultaa)
        this.barchData[this.curArr].CCUsers = resultaa
        console.log(endId, endName)
      },
      showMore: function (i) {
        console.log(this.barchData[i].CCUsers)
        this.chaosong = true
        this.chaosongMore = this.barchData[i].CCUsers
      },
      chaosongok: function () {
        this.chaosong = false
      },
      showmoreshenpi: function (i) {
        this.curArr = i
        console.log(i, this.barchData[i].ApprovalUsers)
        if (this.barchData[i].ApprovalMemberType === 0) {
          this.shenpi1 = true
          this.shenpiMore = this.barchData[i].ApprovalUsers
        } else {
          this.sureId1 = []
          this.sureName = []
          this.sureId = ''
          this.shenpi = true
          this.shenpiMore = this.barchData[i].ApprovalUsers
        }
      },
      modalOk2: function () {
        console.log(this.sureId1)
        var yuanName = this.barchData[this.curArr].ApprovalUsers.map(function (item) {
          return item.DisplayName
        })
        var pinArr = this.sureId1.map(function (item) {
          return {
            UserID: Number(item.split('?')[0]),
            FullName: item.split('?')[1],
            DisplayName: yuanName[0]
          }
        })
        console.log(pinArr)
        // var endId = arrId
        this.barchData[this.curArr].sureData = pinArr
        this.barchData[this.curArr].ApprovalUsers = this.barchData[this.curArr].ApprovalUsers
        console.log(this.barchData[this.curArr].ApprovalUsers)

        this.shenpi = false
      },
      modalOk3: function () {
        this.shenpi1 = false
      }
    }
  }
</script>
<style lang="less" scoped>
  .foot {
    margin: 20px auto;
    text-align: center;
  }
</style>
