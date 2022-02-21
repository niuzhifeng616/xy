<!-- 新建消息 -->
<template>
  <div>
    <div class="xy-content-body">
      <div class="xy-content-title clearfix" style="border-bottom: 1px solid #f1f1f1;">
        <div class="fl">
          <i-button @click="back">返回</i-button>
        </div>
        <div style="text-align: center; font-size: 16px; font-weight: bold;">
          新建消息
        </div>
      </div>

      <div class="news-details">
        <div style="width:1000px;margin:0 auto;">
          <i-form ref="createDataOK" :model="createDataOK" :rules="ruleCreateDataOK" :label-width="100">
            <form-item label="发送渠道" prop="type">
              <checkbox-group v-model="createDataOK.type">
                <checkbox label="1" style="font-size:16px;" disabled>消息中心</checkbox>
                <checkbox label="2" style="font-size:16px;" :disabled="isWeChat">微信</checkbox>
              </checkbox-group>
            </form-item>

            <form-item label="消息标题" prop="title">
              <i-input v-model="createDataOK.title" placeholder="请填写消息标题" style="width:376px;" clearable></i-input>
            </form-item>

            <form-item label="内容摘要" prop="theme">
              <i-input type="textarea" v-model="createDataOK.theme" :autosize="{minRows: 5,maxRows: 5}" placeholder="请填写内容摘要" clearable></i-input>
            </form-item>

            <form-item label="接收对象">
              <span style="position: absolute;
                                    left: -78px;
                                    z-index: 99;
                                    content: '*';
                                    display: inline-block;
                                    color: #ed4014;">*</span>
              <div class="select-number">
                <span class="number" v-if="teacherNames.length > 0">已选择{{teacherNames.length}}人</span>
                <span class="select" v-else>请选择</span>
                <i-button size="small" @click="openAddModal(1)">选择教师</i-button>
              </div>
              <div class="select-number">
                <span class="number" v-if="studentNames.length > 0">已选择{{studentNames.length}}人</span>
                <span class="select" v-else>请选择</span>
                <i-button size="small" @click="openAddModal(2)">选择学生/家长</i-button>
              </div>
            </form-item>

            <form-item label="图文详情">
              <span style="position: absolute;
                                    left: -78px;
                                    z-index: 99;
                                    content: '*';
                                    display: inline-block;
                                    color: #ed4014;">*</span>
              <div class="details" @click="textBtn">
                <img src="@/assets/operationalAnalysis/wenzi.png" />
                <span>点击插入一段文字</span>
              </div>
              <div class="details" :class="isdis ? 'disdetails' : '' " @click="imgBtn">
                <img src="@/assets/operationalAnalysis/tupian.png" />
                <span>点击插入一张图片</span>
              </div>
            </form-item>

            <div class="preview" v-if="previewCont.length > 0">
              <div class="preview-div" v-for="(item,index) in previewCont" :key='index'>
                <p v-if="item.Type ==1">{{item.Content}}</p>
                <img v-if="item.Type == 2" :src="'http://qa.base.xiaoyangedu.net:7000/'+item.Content" />
                <div class="fun-box">
                  <poptip width="20" content="content" placement="bottom">
                    <img src="@/assets/operationalAnalysis/text.png" />
                    <div class="api" slot="content">
                      <i-button type="text" style="display:block;margin-bottom:10px;" @click="insertTextUp(item)">向上插入文字</i-button>
                      <i-button type="text" style="display:block;" @click="insertTextDown(item)">向下插入文字</i-button>
                    </div>
                  </poptip>
                  <poptip width="20" content="content" placement="bottom">
                    <img src="@/assets/operationalAnalysis/img.png" />
                    <div class="api" slot="content">
                      <i-button type="text" style="display:block;margin-bottom:10px;" :disabled="isdis" @click="insertImg(item,2)">向上插入图片</i-button>
                      <i-button type="text" style="display:block;" :disabled="isdis" @click="insertImg(item,3)">向下插入图片</i-button>
                    </div>
                  </poptip>
                  <img src="@/assets/operationalAnalysis/edit.png" @click="edit(item)" />
                  <img src="@/assets/operationalAnalysis/delect.png" @click="del(item)" />
                </div>
              </div>
            </div>
          </i-form>
          <div slot="footer" class='text-center'>
            <Button class="xy-modal-close" @click="back">取消</Button>
            <Button class="xy-modal-primary" shape="circle" :loading="isBtnLoading" @click="createMail">发布</Button>
          </div>
        </div>
      </div>

      <!-- 添加收件人 -->
      <modal width='90%' title="添加收件人" :transfer="false" v-model="addPublic" :loading="loading" :mask-closable="false">
        <row class="cascader-content">
          <i-col span="6" class="cascader-content-left">
            <tree :data="newList" :load-data="newLoadData" @on-select-change="treeSelect"></tree>
          </i-col>
          <i-col span="11" class="cascader-content-center">
            <div v-if="selectState == 2" style="margin-bottom:10px;">
              <checkbox-group v-model="selectStateType">
                <checkbox label="3" style="margin-right: 15px;">发送给选中的学生</checkbox>
                <checkbox label="4">发送给选中的学生家长</checkbox>
              </checkbox-group>
            </div>
            <div v-if="selectState == 1" class="title-describe title-model">温馨提示：点击左侧栏中的教师组织，从中间栏勾选教师，右侧栏显示已选中的教师</div>
            <div v-else class="title-describe title-model">温馨提示：点击左侧栏中的学生组织，从中间栏勾选学生，右侧栏显示已选中的学生</div>

            <div class="cascader-content-center-title clearfix">
              <checkbox v-model="casaderIsAll" class="fl casader-is-all" @on-change="checkAllBtn" v-if="isShowSelectAll&&searchName===''">全选</checkbox>
              <i-input search enter-button placeholder="请输入用户名" v-model="searchName" class="fr casader-search" @on-search="searchNameFun" />
            </div>
            <alert v-if="transferData.length == 0" type="warning" show-icon style="margin:0px 0px 20px">
              未查询到相关数据
              <template slot="desc">
                当前分组下暂无数据，请切换分组后重新查找
              </template>
            </alert>
            <div v-else>
              <div v-for="(item,index) in transferData" :key='index'>
                <div class="cascader-content-center-list">
                  <div class="cascader-content-center-list-border">
                    <checkbox v-model="item.checkAll" v-if="searchName==''" size="large" :key="item.value" @on-change="handleCheckAll(item)" v-cloak>{{item.label}}</checkbox>
                    <span v-else v-cloak>{{item.label}}</span>
                  </div>
                  <checkbox size="large" v-for="child in item.memberlist" :key="child.UserID" v-model="child.singleCheck" @on-change="checkAllChange(child)" :title="child.UserName" class="check-name" v-cloak>{{child.FullName}}</checkbox>
                </div>
              </div>
            </div>

          </i-col>
          <i-col span="7" class="cascader-content-right">
            <div>已选<b>{{checkAllList.length}}</b>人</div>
            <div class="cascader-content-right-list">
              <tag v-for="(item,index) in checkAllList" :key='index' :name="item.FullName" closable @on-close="handleClose" :title="item.UserName" v-cloak>{{item.FullName}}</tag>
            </div>
          </i-col>
        </row>
        <spin v-if="isLoadingShow" fix>
          <icon type="ios-loading" size=18 class="spin-icon-load"></icon>
          <div>加载中...</div>
        </spin>
        <div slot="footer">
          <Button class="xy-modal-close" @click="modalCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="modalAdd">确定</Button>
        </div>
      </modal>

      <!-- 插入文字 -->
      <modal v-model="modalCreate" width="1000" :transfer="false" title="添加文字" :loading="loading" :mask-closable="false" v-cloak>
        <div class="dialog-model-content">
          <i-form ref="formValidateOK" :model="formValidateOK" :rules="ruleValidateOK" @submit.native.prevent>
            <form-item label="" prop="cont">
              <i-input type="textarea" :autosize="{minRows: 10,maxRows: 15}" v-model="formValidateOK.cont" placeholder="请输入要添加的内容"></i-input>
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel(1)">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="ok(1)">保存</Button>
        </div>
      </modal>

      <!-- 插入文字-编辑 -->
      <modal v-model="modalEdit" :transfer="false" width="1000" title="编辑文字" :loading="loading" :mask-closable="false">
        <div class="dialog-model-content">
          <i-form ref="formValidateEditOK" :model="formValidateEditOK" :rules="ruleValidateEditOK" @submit.native.prevent>
            <form-item label="" prop="cont">
              <i-input type="textarea" :autosize="{minRows: 10,maxRows: 15}" v-model="formValidateEditOK.cont" placeholder="请输入要添加的内容"></i-input>
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel(2)">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="ok(2)">保存</Button>
        </div>
      </modal>

      <!-- 插入文字-向上 -->
      <modal v-model="modalInsertUp" :transfer="false" width="1000" title="向上插入文字" :loading="loading" :mask-closable="false">
        <div class="dialog-model-content">
          <i-form ref="formValidateUpOK" :model="formValidateUpOK" :rules="ruleValidateUpOK" @submit.native.prevent>
            <form-item label="" prop="cont">
              <i-input type="textarea" :autosize="{minRows: 10,maxRows: 15}" v-model="formValidateUpOK.cont" placeholder="请输入要添加的内容"></i-input>
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel(3)">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="ok(3)">保存</Button>
        </div>
      </modal>

      <!-- 插入文字-向下 -->
      <modal v-model="modalInsertDown" :transfer="false" width="1000" title="向下插入文字" :loading="loading" :mask-closable="false">
        <div class="dialog-model-content">
          <i-form ref="formValidateDownOK" :model="formValidateDownOK" :rules="ruleValidateDownOK" @submit.native.prevent>
            <form-item label="" prop="cont">
              <i-input type="textarea" :autosize="{minRows: 10,maxRows: 15}" v-model="formValidateDownOK.cont" placeholder="请输入要添加的内容"></i-input>
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel(4)">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="ok(4)">保存</Button>
        </div>
      </modal>

      <!-- 插入图片 -->
      <modal v-model="modalImport" :transfer="false" title="插入图片" :loading="loading" :mask-closable="false" v-if='modalImport'>
        <div>
          <import-file :importPath='upUrl' ref="upImg"></import-file>
          <spin fix v-if="isShowSpin">上传中...</spin>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="UpPhotoCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="UpPhotoOk">确定</Button>
        </div>
      </modal>

    </div>
  </div>
</template>

<script>
  import ImportFile from './ImportFile.vue'
  export default {
    components: { ImportFile },
    data () {
      return {
        // 导入
        upUrl: '',
        httpPath: 'http://qa.api.oa.xiaoyangedu.net:37200',
        //= ===多选控件 start====
        clientWidth: 1600,
        addPublic: false, // modal默认false
        isLoadingShow: false, // modal加载动画
        casaderIsAll: false, // 全选
        loading: true, // 默认
        searchName: '', // 搜索
        newList: [], // 左侧数据
        transferData: [], // 中间数据
        checkAllList: [], // 右侧数据
        checkAllGroup: [], // 多选子集合
        isShowSelectAll: true, // 全选是否显示
        //= ===多选控件 end====
        selectState: '', // 1 老师， 2学生/家长
        // selectStateType: [],

        apiPath: `${this.$store.state.apiPath}/api/MailInfo/`,
        modal_loading: false,

        thisRows: {},
        createTutor: false,
        teacherNames: [],
        studentNames: [],
        // mailTitle: '',
        messageCenter: true,
        Type: '',
        isdis: false,

        // cont: [{ Type: 1, Content: "fdsaf", Sort: 1 }, { Type: 2, Content: "1.jpg", Sort: 2 }],

        previewCont: [], // 图文详情

        selectStateType: ['3'],

        // 创建模型验证
        createDataOK: {
          type: ['1', '2'],
          title: '',
          theme: ''
        },
        ruleCreateDataOK: {
          type: [
            { required: true, type: 'array', min: 1, message: '此项为必填', trigger: 'change' }
          ],
          title: [
            { required: true, message: '此项为必填', trigger: 'blur' },
            { type: 'string', max: 50, message: '消息标题不能超过50个字', trigger: 'blur' }
          ],
          theme: [
            { required: true, message: '此项为必填', trigger: 'blur' },
            { type: 'string', max: 100, message: '内容摘要不能超过100个字', trigger: 'blur' }
          ]
        },

        modalCreate: false, // 创建弹出框默认不展示
        formValidateOK: {
          cont: ''
        },
        ruleValidateOK: {
          cont: [
            { required: true, message: '此项为必填', trigger: 'blur' },
            { type: 'string', max: 2000, message: '所输内容不能超过2000个字', trigger: 'blur' }
          ]
        },

        editVal: '',
        modalEdit: false,
        formValidateEditOK: {
          cont: ''
        },
        ruleValidateEditOK: {
          cont: [
            { required: true, message: '此项为必填', trigger: 'blur' },
            { type: 'string', max: 2000, message: '所输内容不能超过2000个字', trigger: 'blur' }
          ]
        },

        insertVal: '',
        modalInsertUp: false,
        formValidateUpOK: {
          cont: ''
        },
        ruleValidateUpOK: {
          cont: [
            { required: true, message: '此项为必填', trigger: 'blur' },
            { type: 'string', max: 2000, message: '所输内容不能超过2000个字', trigger: 'blur' }
          ]
        },

        modalInsertDown: false,
        formValidateDownOK: {
          cont: ''
        },
        ruleValidateDownOK: {
          cont: [
            { required: true, message: '此项为必填', trigger: 'blur' },
            { type: 'string', max: 2000, message: '所输内容不能超过2000个字', trigger: 'blur' }
          ]
        },
        sumCont: 0,
        sumNumber: 5,
        isWeChat: false,
        // 导入设置
        modalImport: false,
        modalUpImport: false,
        modalDownImport: false,
        insertImgVal: '',
        insertImgType: '',
        isShowSpin: false,
        importPath: `${this.$store.state.apiPath}/api/Resource/UploadPhoto`,
        importResult: {},
        typeBtn: true,
        // 上传照片
        file: null,
        fileName: '',
        UploadList: [],
        orgID: 0,
        isBtnLoading: false,
        schoolDistrictID: 0,
        studentGradeID: 0,
        studentGradeForStudentYearID: 0,
        studentOrganizationID: 0

      }
    },
    computed: {
      params () {
        return this.$store.state.common.menuInfo
      }
    },
    created: function () {
      this.Type = this.params.Type
      this.getWeChat()
    },
    mounted: function () {
      this.$Message.config({
        top: 70,
        duration: 2
      })
      // 从右侧删除已选成员
      $('.group-users-checkmark').off('span i')
      $('.group-users-checkmark').on('click', 'span i', function () {
        $('.group-level3').find('input:checked[data-id="' + $(this).parent('span').attr('data-id') + '"]').prop('checked', false)
        $('.group-level3').find('input[data-id="' + $(this).parent('span').attr('data-id') + '"]').parents('ul.group-level3').siblings('div.checkmark-checkbox-all').find('input').prop('checked', false)
        $(this).parent().remove()
      })
    },
    methods: {
      //= ======多选弹出框 Start========
      changeLoading: function () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      async  openAddModal (val) {
        this.xy.loading()
        this.addPublic = true
        this.isLoadingShow = true
        this.newList = []// 左侧滞空
        this.transferData = []// 中间滞空
        this.checkAllList = []// 右侧滞空
        let _this = this
        _this.selectState = val
        // 判断 selectState 为1 是选择老师，为2 选择学生/家长
        if (_this.selectState === 1) {
          _this.checkAllList = _this.teacherNames
          let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetNodeList`, {
            id: 0,
            type: ''
          })
          if (res.success) {
            let respon = res.data
            for (let i = 0; i < respon.length; i++) {
              _this.newList.push({
                title: respon[i].label,
                loading: false,
                children: [],
                id: respon[i].value,
                nodetype: respon[i].nodetype
              })
            }
            this.xy.unloading()
          } else {
            this.xy.unloading()
          };
        } else {
          _this.checkAllList = _this.studentNames
          let res = await this.xy.get(`${this.xyApi}/xy/Comm/StudentOrganization`, {
            id: 0,
            type: ''
          })
          if (res.success) {
            let respon = res.data
            for (let i = 0; i < respon.length; i++) {
              _this.newList.push({
                id: respon[i].ID,
                title: respon[i].Name,
                nodetype: respon[i].Type,
                loading: false,
                children: []
              })
              if (respon[i].MemberList.length > 0) {
                for (let c = 0; c < respon[i].MemberList.length; c++) {
                  _this.newList[i].children.push({
                    id: respon[i].MemberList[c].ID,
                    title: respon[i].MemberList[c].Name,
                    nodetype: respon[i].MemberList[c].Type,
                    loading: false,
                    children: []
                  })
                  if (respon[i].MemberList[c].MemberList.length > 0) {
                    for (let j = 0; j < respon[i].MemberList[c].MemberList.length; j++) {
                      _this.newList[i].children[c].children.push({
                        id: respon[i].MemberList[c].MemberList[j].ID,
                        title: respon[i].MemberList[c].MemberList[j].Name,
                        nodetype: respon[i].MemberList[c].MemberList[j].Type,
                        loading: false,
                        children: []
                      })
                      if (respon[i].MemberList[c].MemberList[j].MemberList.length > 0) {
                        for (let k = 0; k < respon[i].MemberList[c].MemberList[j].MemberList.length; k++) {
                          _this.newList[i].children[c].children[j].children.push({
                            id: respon[i].MemberList[c].MemberList[j].MemberList[k].ID,
                            title: respon[i].MemberList[c].MemberList[j].MemberList[k].Name,
                            nodetype: respon[i].MemberList[c].MemberList[j].MemberList[k].Type
                          })
                        }
                      }
                    }
                  }
                }
              }
            }
            this.xy.unloading()
          } else {
            this.xy.unloading()
          };
        }
        _this.isLoadingShow = false
      },
      async  newLoadData (item, callback) {
        this.isLoadingShow = true
        let _this = this
        // 判断 val 为1 是选择老师，为2 选择学生/家长
        if (_this.selectState === 1) {
          let res = await this.xy.get(`${this.$store.state.apiPath}/xy/Comm/GetNodeList`, {
            id: item.id,
            type: item.nodetype
          })
          let data = []
          if (res.data.length > 0) {
            $.each(res.data, function (index, items) {
              if (items.ischild) {
                data.push({
                  parentId: item.id,
                  parentTitle: item.title,
                  parentNodetype: item.nodetype,
                  id: items.value,
                  title: items.label,
                  loading: false,
                  nodetype: items.nodetype,
                  children: []
                })
              } else {
                data.push({
                  parentId: item.id,
                  parentTitle: item.title,
                  parentNodetype: item.nodetype,
                  id: items.value,
                  title: items.label,
                  nodetype: items.nodetype
                })
              };
            })
          };
          callback(data)
        } else {
          this.xy.unloading()
        }
        _this.isLoadingShow = false
      },
      // 选择左侧列
      async  treeSelect (data) {
        let _this = this
        if (data.length > 0) {
          _this.isLoadingShow = true
          if (_this.selectState === 1) {
            if (data[0].nodetype !== 'S') {
              let tIds = []
              if (_this.teacherNames.length > 0) {
                for (let i = 0; i < _this.teacherNames.length; i++) {
                  tIds.push(_this.teacherNames[i].UserID)
                };
              };
              let res = await this.xy.get(`${this.$store.state.apiPath}/xy/Comm/GetNodeListHasmember`, {
                orgID: data[0].id,
                teacherIDs: '',
                type: data[0].nodetype
              })
              _this.transferData = []
              if (res.success) {
                if (res.data.length > 0) {
                  for (let i = 0; i < res.data.length; i++) {
                    res.data[i].checkAll = false// 每一组的全选按钮
                    res.data[i].checkAllGroup = []// 每一组人集合
                    if (res.data[i].memberlist.length > 0) {
                      for (let j = 0; j < res.data[i].memberlist.length; j++) {
                        res.data[i].memberlist[j].singleCheck = false
                        res.data[i].childNameStr += res.data[i].memberlist[j].FullName + ',' + res.data[i].memberlist[j].UserName + ','
                      };
                      _this.transferData.push(res.data[i])
                      console.log(_this.transferData)
                      _this.isLoadingShow = false
                    };
                  };
                  _this.isLoadingShow = false
                  // 根据右侧已选人改变渲染的初始数据
                  if (_this.checkAllList.length > 0) {
                    for (let d = 0; d < _this.transferData.length; d++) {
                      for (let z = 0; z < _this.transferData[d].memberlist.length; z++) {
                        let f = _this.checkAllList.map(function (val) {
                          return val.UserID
                        }).indexOf(_this.transferData[d].memberlist[z].UserID)
                        if (f !== -1) {
                          _this.transferData[d].memberlist[z].singleCheck = true
                        };
                      };
                      // 所有的全选按钮
                      let all1 = _this.transferData[d].memberlist.map(function (val) {
                        return val.singleCheck
                      }).indexOf(true)
                      if (all1 === -1) { // 全没有ture
                        _this.transferData[d].checkAll = false
                      } else {
                        // 最少有一个true
                        let all2 = _this.transferData[d].memberlist.map(function (val) {
                          return val.singleCheck
                        }).indexOf(false)
                        if (all2 === -1) {
                          _this.transferData[d].checkAll = true
                        } else {
                          _this.transferData[d].checkAll = false
                        };
                      };
                    };
                  };
                };
              } else {
                this.xy.unloading()
              };
            } else {
              // 点击校区显示校区下所有的人
              _this.isLoadingShow = true
              _this.transferData = []
              let res = await this.xy.get(`${this.xyApi}/xy/Comm/GetOrganizationMember`, {
                orgID: _this.orgID,
                schoolID: data[0].id
              })
              if (res.success) {
                if (res.data.length > 0) {
                  let dataList = res.data
                  for (let i = 0; i < dataList.length; i++) {
                    dataList[i].IsCurrent = false
                    dataList[i].ischild = false
                    dataList[i].loading = false
                    dataList[i].checkAll = false
                    dataList[i].label = dataList[i].Name
                    dataList[i].memberlist = dataList[i].Members
                    dataList[i].value = dataList[i].OrganizationID

                    for (let j = 0; j < dataList[i].memberlist.length; j++) {
                      dataList[i].memberlist[j].FullName = dataList[i].memberlist[j].Name
                      dataList[i].memberlist[j].UserID = dataList[i].memberlist[j].ID
                      dataList[i].memberlist[j].singleCheck = false
                    }
                  };
                  _this.transferData = dataList
                  _this.isLoadingShow = false
                };
                // 反绑
                // -----------------------
                // 根据右侧已选人改变渲染的初始数据
                if (_this.checkAllList.length > 0) {
                  for (let d = 0; d < _this.transferData.length; d++) {
                    for (let z = 0; z < _this.transferData[d].memberlist.length; z++) {
                      let f = _this.checkAllList.map(function (val) {
                        return val.UserID
                      }).indexOf(_this.transferData[d].memberlist[z].UserID)
                      if (f !== -1) {
                        _this.transferData[d].memberlist[z].singleCheck = true
                      };
                    };
                    // 所有的全选按钮
                    let all1 = _this.transferData[d].memberlist.map(function (val) {
                      return val.singleCheck
                    }).indexOf(true)
                    if (all1 === -1) { // 全没有ture
                      _this.transferData[d].checkAll = false
                    } else {
                      // 最少有一个true
                      let all2 = _this.transferData[d].memberlist.map(function (val) {
                        return val.singleCheck
                      }).indexOf(false)
                      if (all2 === -1) {
                        _this.transferData[d].checkAll = true
                      } else {
                        _this.transferData[d].checkAll = false
                      };
                    };
                  };
                };
              } else {
                this.xy.unloading()
              };
            };
          } else {
            if (data[0].nodetype !== 'S') {
              if (data[0].nodetype === 'SD') {
                _this.selectStudent(data[0].id, _this.studentGradeID, _this.studentGradeForStudentYearID, _this.studentOrganizationID)
              } else if (data[0].nodetype === 'SY') {
                _this.selectStudent(_this.schoolDistrictID, data[0].id, _this.studentGradeForStudentYearID, _this.studentOrganizationID)
              } else if (data[0].nodetype === 'SG') {
                _this.selectStudent(_this.schoolDistrictID, _this.studentGradeID, data[0].id, _this.studentOrganizationID)
              } else if (data[0].nodetype === 'SO') {
                _this.selectStudent(_this.schoolDistrictID, _this.studentGradeID, _this.studentGradeForStudentYearID, data[0].id)
              }
            } else {
              _this.isLoadingShow = false
            };
          }
        };
      },

      // 添加收件人--选择学生及反选
      async selectStudent (schoolID, studentID, studentGradeForID, studentOrganizationID) {
        let _this = this
        let res = await this.xy.get(`${this.xyApi}/xy/comm/GetStudentorganizationMemberByID`, {
          schoolDistrictID: schoolID,
          studentGradeID: studentID,
          studentGradeForStudentYearID: studentGradeForID,
          studentOrganizationID: studentOrganizationID
        })
        _this.transferData = []
        if (res.success) {
          let resDataList = res.data
          if (resDataList.length > 0) {
            for (let i = 0; i < resDataList.length; i++) {
              resDataList[i].label = resDataList[i].Name
              resDataList[i].checkAll = false// 每一组的全选按钮
              resDataList[i].checkAllGroup = []// 每一组人集合
              for (let j = 0; j < resDataList[i].Children.length; j++) {
                resDataList[i].Children[j].singleCheck = false
                resDataList[i].childNameStr += resDataList[i].Children[j].FullName + ',' + resDataList[i].Children[j].UserName + ','
                resDataList[i].Children[j].FullName = res.data[i].Children[j].FullName
                resDataList[i].Children[j].UserID = res.data[i].Children[j].UserID
              };
              resDataList[i].memberlist = resDataList[i].Children
              _this.transferData.push(resDataList[i])
              _this.isLoadingShow = false
            };

            // 根据右侧已选人改变渲染的初始数据
            if (_this.checkAllList.length > 0) {
              for (let d = 0; d < _this.transferData.length; d++) {
                for (let z = 0; z < _this.transferData[d].memberlist.length; z++) {
                  let f = _this.checkAllList.map(function (val) {
                    return val.UserID
                  }).indexOf(_this.transferData[d].memberlist[z].UserID)
                  if (f !== -1) {
                    _this.transferData[d].memberlist[z].singleCheck = true
                  };
                };
                // 所有的全选按钮
                let all1 = _this.transferData[d].memberlist.map(function (val) {
                  return val.singleCheck
                }).indexOf(true)
                if (all1 === -1) { // 全没有ture
                  _this.transferData[d].checkAll = false
                } else {
                  // 最少有一个true
                  let all2 = _this.transferData[d].memberlist.map(function (val) {
                    return val.singleCheck
                  }).indexOf(false)
                  if (all2 === -1) {
                    _this.transferData[d].checkAll = true
                  } else {
                    _this.transferData[d].checkAll = false
                  };
                };
              };
            };
          } else {
            _this.isLoadingShow = false
          };
        } else {
          _this.isLoadingShow = false
          this.xy.msgError(res.msg)
          this.xy.unloading()
        };
      },
      // 全选
      checkAllBtn: function () {
        if (this.casaderIsAll) {
          for (let i = 0; i < this.transferData.length; i++) {
            this.transferData[i].checkAll = true
            for (let j = 0; j < this.transferData[i].memberlist.length; j++) {
              this.transferData[i].memberlist[j].singleCheck = true
              // 把选中的添加至右侧
              this.checkAllList.push(this.transferData[i].memberlist[j])
            };
          };
          // 去重
          let obj = {}
          this.checkAllList = this.checkAllList.reduce(function (item, next) {
            // eslint-disable-next-line no-unused-expressions
            obj[next.UserID] ? '' : obj[next.UserID] = true && item.push(next)
            return item
          }, [])
        } else {
          for (let k = 0; k < this.transferData.length; k++) {
            this.transferData[k].checkAll = false
            for (let s = 0; s < this.transferData[k].memberlist.length; s++) {
              this.transferData[k].memberlist[s].singleCheck = false
            };
          };
          this.checkAllList = []
        };
      },
      // 各个组内的全选按钮
      handleCheckAll: function (item) {
        if (item.checkAll) {
          item.memberlist.map(function (val) {
            // eslint-disable-next-line no-return-assign
            return val.singleCheck = true
          })
          // this.checkAllList = [];
          for (let p = 0; p < this.transferData.length; p++) {
            for (let m = 0; m < this.transferData[p].memberlist.length; m++) {
              for (let q = 0; q < item.memberlist.length; q++) {
                // 判断 selectState 为1 是选择老师，为2 选择学生/家长
                if (this.selectState === 1) {
                  if (this.transferData[p].memberlist[m].UserID === item.memberlist[q].UserID) {
                    this.transferData[p].memberlist[m].singleCheck = true
                  };
                } else {
                  if (this.transferData[p].memberlist[m].UserID === item.memberlist[q].UserID) {
                    this.transferData[p].memberlist[m].singleCheck = true
                  };
                }
              };
              // 把选中的添加至右侧
              if (this.transferData[p].memberlist[m].singleCheck) {
                this.checkAllList.push(this.transferData[p].memberlist[m])
              };
            };
            // 所有的全选按钮
            let isCheckAll = this.transferData[p].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (isCheckAll === -1) {
              this.transferData[p].checkAll = true
              this.casaderIsAll = true// 全选
            } else {
              this.transferData[p].checkAll = false
              this.casaderIsAll = false// 全选
            };
          };
          // 去重
          let obj = {}
          this.checkAllList = this.checkAllList.reduce(function (item, next) {
            // eslint-disable-next-line no-unused-expressions
            obj[next.UserID] ? '' : obj[next.UserID] = true && item.push(next)
            return item
          }, [])
        } else {
          for (let p = 0; p < this.transferData.length; p++) {
            for (let q = 0; q < this.transferData[p].memberlist.length; q++) {
              let index2 = item.memberlist.map(function (val) {
                return val.UserID
              }).indexOf(this.transferData[p].memberlist[q].UserID)
              if (index2 !== -1) {
                this.transferData[p].memberlist[q].singleCheck = false
              };
            };
            // 删除右侧
            for (let k = 0; k < item.memberlist.length; k++) {
              let index3 = this.checkAllList.map(function (val) {
                return val.UserID
              }).indexOf(item.memberlist[k].UserID)
              if (index3 !== -1) {
                this.checkAllList.splice(index3, 1)
              };
            }
            // 所有的全选按钮
            let isCheckAll2 = this.transferData[p].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(true)
            if (isCheckAll2 === -1) { // 全没有ture
              this.transferData[p].checkAll = false
              this.casaderIsAll = false// 全选
            } else {
              // 最少有一个true
              let isCheckAll3 = this.transferData[p].memberlist.map(function (val) {
                return val.singleCheck
              }).indexOf(false)
              if (isCheckAll3 === -1) {
                this.transferData[p].checkAll = true
                this.casaderIsAll = true// 全选
              } else {
                this.transferData[p].checkAll = false
                this.casaderIsAll = false// 全选
              };
            };
          };
        };
      },
      // 每个人的按钮
      checkAllChange: function (child) {
        // this.teacherNames = [];
        // this.studentNames = [];

        if (child.singleCheck) {
          this.checkAllList.push(child)
          for (let i = 0; i < this.transferData.length; i++) {
            let mapIndex = this.transferData[i].memberlist.map(function (val) {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex !== -1) {
              this.transferData[i].memberlist[mapIndex].singleCheck = true
            };
            // 组内全选按钮选中
            let is1 = this.transferData[i].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (is1 === -1) {
              this.transferData[i].checkAll = true
            };
          };
        } else {
          let index1 = this.checkAllList.map(function (val) {
            return val.UserID
          }).indexOf(child.UserID)
          this.checkAllList.splice(index1, 1)
          for (let i = 0; i < this.transferData.length; i++) {
            let mapIndex1 = this.transferData[i].memberlist.map(function (val) {
              return val.UserID
            }).indexOf(child.UserID)
            if (mapIndex1 !== -1) {
              this.transferData[i].memberlist[mapIndex1].singleCheck = false
            };
            // 组内全选按钮是否选中
            let is2 = this.transferData[i].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(true)
            if (is2 === -1) { // 没有true
              this.transferData[i].checkAll = false
              this.casaderIsAll = false
            } else {
              // 最少有一个true
              let is3 = this.transferData[i].memberlist.map(function (val) {
                return val.singleCheck
              }).indexOf(false)
              if (is3 === -1) {
                this.transferData[i].checkAll = true
                this.casaderIsAll = true
              } else {
                this.transferData[i].checkAll = false
                this.casaderIsAll = false
              };
            };
          };
        };
        console.log(this.checkAllList)
        console.log(this.teacherNames)
        console.log(this.studentNames)
      },
      searchNameFun: function (vals) {
        this.searchName = vals
        if (vals !== '') {
          this.isShowSelectAll = false
        } else {
          this.isShowSelectAll = true
        }
      },
      handleClose: function (e, name) {
        for (let u = 0; u < this.checkAllList.length; u++) {
          if (this.checkAllList[u].UserID === name.UserID) { this.checkAllList.splice(u, 1) }
        };
        for (let i = 0; i < this.transferData.length; i++) {
          let mapIndex = this.transferData[i].memberlist.map(function (val) {
            return val.UserID
          }).indexOf(name.UserID)
          if (mapIndex !== -1) {
            this.transferData[i].memberlist[mapIndex].singleCheck = false
          };
          // 组内全选按钮是否选中
          let is4 = this.transferData[i].memberlist.map(function (val) {
            return val.singleCheck
          }).indexOf(true)
          if (is4 === -1) { // 没有true
            this.transferData[i].checkAll = false
          } else {
            // 最少有一个true
            let is5 = this.transferData[i].memberlist.map(function (val) {
              return val.singleCheck
            }).indexOf(false)
            if (is5 === -1) {
              this.transferData[i].checkAll = true
            } else {
              this.transferData[i].checkAll = false
            };
          };
        };
      },
      modalCancel: function () {
        this.checkAllGroup = []
        this.selectStateType = ['3']
        // this.teacherNames = []; // 教师置空
        // this.studentNames = []; // 学生置空
        this.addPublic = false
        this.checkAllList = []// 右侧滞空
        this.newList = []// 左侧滞空
        this.transferData = []// 中间滞空
        this.casaderIsAll = false
        this.searchName = ''
      },
      modalAdd: function () {
        if (this.checkAllList.length > 0) {
          // 判断 selectState 为1 是选择老师，为2 选择学生/家长
          if (this.selectState === 1) {
            this.teacherNames = this.checkAllList
          } else {
            // 是否选择了学生/家长
            if (this.selectStateType.length > 0) {
              this.studentNames = this.checkAllList
            } else {
              this.xy.msgError('请选择发送给学生还是家长')
              this.changeLoading()
              return
            }
          }

          this.addPublic = false
          this.newList = []// 左侧滞空
          this.transferData = []// 中间滞空
          this.checkAllGroup = []// 多选框滞空
          this.checkAllList = []// 右侧滞空
          this.casaderIsAll = false
          this.searchName = ''

          console.log(this.teacherNames)
          console.log(this.studentNames)
        // this.teacherNames = []; // 教师置空
        // this.studentNames = []; // 学生置空
        } else {
          this.xy.msgError('请先选择收件人')
          this.changeLoading()
        };
      },
      delPerson: function (index) {
        this.teacherNames.splice(index, 1)
      },
      //= ======多选弹出框 End========

      // 获取微信状态
      async  getWeChat () {
        this.xy.loading()
        let _this = this
        let res = await this.xy.get(`${this.xyApi}/api/WeChat/GetAll`)
        if (res.success) {
          let WeChatData = ''
          WeChatData = res.data
          if (WeChatData === null || WeChatData.WeChatAppID === '' || WeChatData.WeChatAppID === null) {
            _this.isWeChat = true
          // _this.createDataOK.type['1']
          }
          this.xy.unloading()
        } else {
          this.xy.unloading()
          this.xy.msgError('获取微信状态失败！')
          return false
        }
      },

      // 添加文字
      textBtn: function () {
        this.modalCreate = true
      },

      // 添加文字触发
      ok: function (val) {
        let _this = this

        if (val === 1) {
          this.$refs.formValidateOK.validate(function (valid) {
            if (!valid) {
              return _this.changeLoading()
            } else {
              let cont = {
                Type: 1,
                Content: $.trim(_this.formValidateOK.cont),
                Sort: ''
              }
              _this.previewCont.push(cont)
              _this.sort()
              _this.modalCreate = false
              _this.$refs.formValidateOK.resetFields()
            }
          })
        } else if (val === 2) {
          this.$refs.formValidateEditOK.validate(function (valid) {
            if (!valid) {
              return _this.changeLoading()
            } else {
              for (let i = 0; i < _this.previewCont.length; i++) {
                if (_this.editVal.Sort === _this.previewCont[i].Sort) {
                  _this.previewCont[i].Content = _this.formValidateEditOK.cont
                  _this.editVal.Type = _this.previewCont[i].Type
                }
              }
              _this.sort()
              _this.modalEdit = false
              _this.$refs.formValidateEditOK.resetFields()
            }
          })
        } else if (val === 3) {
          // 向上
          this.$refs.formValidateUpOK.validate(function (valid) {
            if (!valid) {
              return _this.changeLoading()
            } else {
              let a = ''
              let cont = {}
              for (let i = 0; i < _this.previewCont.length; i++) {
                if (_this.insertVal.Sort === _this.previewCont[i].Sort) {
                  a = i
                  cont = {
                    Type: 1,
                    Content: $.trim(_this.formValidateUpOK.cont),
                    Sort: ''
                  }
                }
              }
              _this.previewCont.splice(a, 0, cont)
              _this.sort()
              _this.modalInsertUp = false
              _this.$refs.formValidateUpOK.resetFields()
            }
          })
        } else if (val === 4) {
          // 向下
          this.$refs.formValidateDownOK.validate(function (valid) {
            if (!valid) {
              return _this.changeLoading()
            } else {
              let a = ''
              let cont = {}
              for (let i = 0; i < _this.previewCont.length; i++) {
                if (_this.insertVal.Sort === _this.previewCont[i].Sort) {
                  a = i
                  cont = {
                    Type: 1,
                    Content: $.trim(_this.formValidateDownOK.cont),
                    Sort: ''
                  }
                }
              }
              _this.previewCont.splice(a + 1, 0, cont)
              _this.sort()
              _this.modalInsertDown = false
              _this.$refs.formValidateDownOK.resetFields()
            }
          })
        }
      },

      // 关闭创建楼弹框触发
      cancel: function (val) {
        if (val === 1) {
          this.modalCreate = false
          this.$refs.formValidateOK.resetFields()
        } else if (val === 2) {
          this.modalEdit = false
          this.$refs.formValidateEditOK.resetFields()
        } else if (val === 3) {
          this.modalInsertUp = false
          this.$refs.formValidateUpOK.resetFields()
        } else if (val === 4) {
          this.modalInsertDown = false
          this.$refs.formValidateDownOK.resetFields()
        }
      },

      // 插入文字上
      insertTextUp: function (val) {
        this.modalInsertUp = true
        this.insertVal = val
      },

      // 插入文字下
      insertTextDown: function (val) {
        this.modalInsertDown = true
        this.insertVal = val
      },

      // 导入开始---

      // 导入照片
      imgBtn: function () {
        if (this.isdis) {
          this.xy.msgError('最多只能上传5张图片')
          return
        }
        this.modalImport = true
        this.insertImgVal = ''
        this.insertImgType = 1
        this.UpVideoClick()
      },

      // 插入图片上下
      insertImg: function (val, type) {
        let _this = this
        _this.modalImport = true
        _this.insertImgVal = val
        _this.insertImgType = type
        _this.UpVideoClick()
      },
      // 导入控件
      UpVideoClick: function () {
        this.upUrl = `${this.httpPath}/api/OAMessage/UploadContentPicture`
      },
      // 保存图片
      UpPhotoOk: function () {
        let _this = this
        if (_this.insertImgType === 1) {
          // 插入图片
          let cont = {
            Type: 2,
            Content: this.$refs.upImg.importResult.result,
            Sort: ''
          }
          if (this.$refs.upImg.importResult.result !== undefined) {
            _this.previewCont.push(cont)
            _this.sort()
            _this.UploadList = []
            _this.modalImport = false
          } else {
            this.xy.msgError('请上传图片')
            return false
          }
        } else if (_this.insertImgType === 2) {
          // 向上插入
          let a = ''
          let cont = {}
          for (let i = 0; i < _this.previewCont.length; i++) {
            if (_this.insertImgVal.Sort === _this.previewCont[i].Sort) {
              a = i
              cont = {
                Type: 2,
                Content: this.$refs.upImg.importResult.result,
                Sort: ''
              }
            }
          }

          if (this.$refs.upImg.importResult.result !== undefined) {
            _this.previewCont.splice(a, 0, cont)
            _this.sort()
            _this.UploadList = []
            _this.modalImport = false
          } else {
            this.xy.msgError('请上传图片')
            return false
          }
        } else if (_this.insertImgType === 3) {
          // 向下插入
          let a = ''
          let cont = {}
          for (let i = 0; i < _this.previewCont.length; i++) {
            if (_this.insertImgVal.Sort === _this.previewCont[i].Sort) {
              a = i
              cont = {
                Type: 2,
                Content: this.$refs.upImg.importResult.result,
                Sort: ''
              }
            }
          }

          if (this.$refs.upImg.importResult.result !== undefined) {
            _this.previewCont.splice(a + 1, 0, cont)
            _this.sort()
            _this.UploadList = []
            _this.modalImport = false
          } else {
            this.xy.msgError('请上传图片')
            return false
          }
        }
      },

      // 点击取消
      UpPhotoCancel: function () {
        this.UploadList = []
        this.modalImport = false
      },

      // 导入结束---

      // 编辑
      edit: function (val) {
        if (val.Type === 1) {
          this.modalEdit = true
          this.formValidateEditOK.cont = val.Content
          this.editVal = val
        } else {
          this.imgBtn()
        }
      },

      // 删除
      del: function (val) {
        let _this = this
        for (let i = 0; i < _this.previewCont.length; i++) {
          if (val.Sort === _this.previewCont[i].Sort) {
            _this.previewCont.splice(i, 1)
          }
        }

        this.sort()
      },

      // 排序
      sort: function () {
        let type = []
        for (let i = 0; i < this.previewCont.length; i++) {
          this.previewCont[i].Sort = i + 1
          if (this.previewCont[i].Type === 2) {
            type.push(this.previewCont[i])
          }
        }
        if (type.length > 4) {
          this.isdis = true
        } else {
          this.isdis = false
        }

        console.log(this.previewCont)
      },

      // 发送消息
      createMail: function () {
        let _this = this
        // 消息类型
        let type = ''
        if (_this.createDataOK.type.length === 2) {
          type = '3'
        } else {
          type = _this.createDataOK.type.join()
        }

        // previewCont
        // 文字内容字数限制 2000
        let num = ''
        if (_this.previewCont.length > 0) {
          for (let i = 0; i < _this.previewCont.length; i++) {
            if (_this.previewCont[i].Type === 1) {
              num = num + _this.previewCont[i].Content
            }
          };
        }
        if (num.length > 2000) {
          this.xy.msgError('内容字数不能超过2000！')
          return
        }

        // 接收人角色
        let roles = []
        if (_this.teacherNames.length > 0) {
          roles.push('2')
        };
        if (_this.studentNames.length > 0 && _this.selectStateType.length > 0) {
          roles = roles.concat(_this.selectStateType)
        }

        // 教师 teacherNames
        let receive = []
        let receiveTeacher = []
        let receiveStudent = []
        let receiveParents = []
        if (_this.teacherNames.length > 0) {
          for (let t = 0; t < _this.teacherNames.length; t++) {
            receiveTeacher.push({
              UserRole: '2',
              UserID: _this.teacherNames[t].UserID
            })
          }
        };
        // 学生/家长 studentNames
        if (_this.selectStateType.length > 0) {
          if (_this.studentNames.length > 0) {
            console.log(_this.studentNames)
            for (let s = 0; s < _this.studentNames.length; s++) {
              receiveStudent.push({
                UserRole: _this.selectStateType[0],
                UserID: _this.studentNames[s].UserID
              })
            }
            if (_this.selectStateType.length === 2) {
              for (let p = 0; p < _this.studentNames.length; p++) {
                receiveParents.push({
                  UserRole: _this.selectStateType[1],
                  UserID: _this.studentNames[p].UserID
                })
              }
            }
          }
        };
        receive = receiveTeacher.concat(receiveStudent)
        receive = receive.concat(receiveParents)

        this.$refs.createDataOK.validate((valid) => {
          if (!valid) {
            _this.isBtnLoading = false
            return _this.changeLoading()
          } else {
            _this.isBtnLoading = true
            this.xy.loading()
            this.xy.post(`${this.httpPath}/api/OAMessage/Create`, {
              MessageTitle: $.trim(_this.createDataOK.title),
              MessageDescribe: $.trim(_this.createDataOK.theme),
              MessageSendOut: type,
              ReceiverRoles: roles,
              MessageReceive: receive,
              MessageContent: _this.previewCont
            }, true).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.xy.msgSuc('发送成功！')
                this.$router.push({ path: '/xyHome/oaMailTable', query: this.$store.state.common.menuInfo })
                this.$store.commit('common/getParam', {
                  type: 'F'
                })
                _this.isBtnLoading = false
              } else {
                this.xy.mError('发送失败', res.msg)
                _this.isBtnLoading = false
              };
            })
          }
        })
      },
      // 返回列表
      back: function () {
        this.$Modal.confirm({
          title: '取消',
          content: '<p>您是否确定放弃本次编辑？</p>',
          onOk: () => {
            this.$store.commit('common/getParam', { Type: this.Type })
            this.$router.push({ path: '/xyHome/oaMailTable', query: this.$store.state.common.menuInfo })
          }
        })
      }
    }

  }
</script>
<style lang='less' scoped>
.details {
  text-align: center;
  width: 176px;
  height: 50px;
  line-height: 50px;
  background: rgba(251, 251, 251, 1);
  border: 1px solid rgba(232, 232, 232, 1);
  border-radius: 4px;
  display: inline-block;
  margin-right: 24px;
  cursor: pointer;
  transition: all 0.3s;
}
.details:hover {
  transition: all 0.3s;
  border: 1px solid #2d8cf0;
}

.details > img {
  margin-right: 14px;
}
.details > span {
  font-weight: 400;
  color: #999;
}

.disdetails {
  cursor: no-drop;
  transition: all 0.3s;
}

.disdetails:hover {
  transition: all 0.3s;
  cursor: no-drop;
  border: 1px solid rgba(232, 232, 232, 1);
}

.preview {
  border-radius: 4px;
  border: 1px solid rgba(232, 232, 232, 1);
  width: 900px;
  min-height: 300px;
  overflow: auto;
  margin-left: 100px;
  padding: 20px;
  margin-bottom: 24px;
}

.preview > .preview-div {
  display: block;
  margin-bottom: 13px;
  background: #fff;
  transition: all 0.3s;
  padding: 13px 9px;
  cursor: default;
  position: relative;
}

.preview > .preview-div:hover {
  transition: all 0.3s;
  background: rgba(0, 0, 0, 0.2);
  color: rgba(51, 51, 51, 0.4);
}
.preview > .preview-div > .fun-box {
  position: absolute;
  right: 0;
  top: 10px;
  display: none;
  transition: all 0.3s;
}
.preview > .preview-div:hover > .fun-box {
  transition: all 0.3s;
  display: block;
}

.preview > .preview-div > .fun-box img {
  cursor: pointer;
  margin-right: 15px;
}
.select-number {
  display: inline-block;
  margin-right: 46px;
}
.select-number > span {
  border-bottom: 1px solid #e9e9e9;
  height: 24px;
  display: inline-block;
  line-height: 24px;
  width: 120px;
  margin-right: 5px;
}
.select-number > .select {
  color: #999;
}
.select-number > .number {
  color: #333;
}
.select-number .icon {
  font-size: 18px;
  margin-left: 3px;
  color: #2196f3;
  cursor: pointer;
  line-height: 30px;
  transition: all 0.3s;
}
.select-number .icon:hover {
  transition: all 0.3s;
  color: #177ccc;
}
</style>
