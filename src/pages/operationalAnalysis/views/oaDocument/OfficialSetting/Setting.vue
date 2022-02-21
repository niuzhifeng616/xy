<template>
<div class="xy-content-module" id="XyContentModuleReplace">
  <div id="xy-initialize-breadcrumb"></div>
  <div class="setting-container">
    <i-menu mode="horizontal" theme="light" active-name="1" @on-select="changeMenu">
      <menu-item name="1">
        <!-- <Icon type="ios-paper" /> -->
        公文种类
      </menu-item>
      <menu-item name="2">
        <!-- <Icon type="ios-people" /> -->
        秘密等级
      </menu-item>
      <menu-item name="3">
        <!-- <Icon type="ios-people" /> -->
        紧急程度
      </menu-item>
      <menu-item name="4">
        <!-- <Icon type="ios-construct" /> -->
        审批设置
      </menu-item>
    </i-menu>

    <div class="container" :style="notApproval === false?'padding:0':''">
      <div class="box" v-show="notApproval">
        <div class="box-type add" @click="newMould">
          <Icon type="ios-add"></Icon>
          <p>新增类型</p>
        </div>
      </div>

      <div class="box" v-show="notApproval" v-for="(item,index) in rowList"  :key='index'>
        <div class="box-type">
          <div class="box-main">
            <div v-if="!item.IsDefault" class='dot' :class="'m' + (index+1)"></div>
            <div v-if="item.IsDefault" class='dot' :class="'m'"></div>
            <div class="box-txt">
              <p v-text="item.Name"></p>
              <p v-if="item.IsDefault">系统内置</p>
              <p v-else>{{item.FullName}}添加</p>
            </div>
          </div>

          <div class="box-bt">
            <div class="bt-group">
              <div class="bt-icon" :class="item.IsDefault ? 'bg-admin': 'btn-noty bt-base'">
                <i-button :disabled="item.IsDefault ? true : false" :class="item.IsDefault ? 'is-select' : 'bt-cl'"  @click="okOpen(item)">
                  <a-icon type="edit" />
                  编辑
                </i-button>
              </div>
              <span></span>
              <div class="bt-icon" :class="item.IsDefault ? 'bg-admin': 'dele-bt bt-base'">
                <i-button :disabled="item.IsDefault ? true : false" :class="item.IsDefault ? 'is-select' : 'bt-cl'" @click="deleteData(item)">
                  <i class="iconfont">&#xe6e1;</i>
                  删除
                </i-button>
              </div>
            </div>
          </div>

          <!-- <div class="box-bt" v-if="!item.IsDefault">
            <button-group class="bt-group">
              <i-button icon="md-create" @click="okOpen(item)">编辑</i-button>
              <i-button icon="ios-trash" @click="deleteData(item)" class="dele-bt">删除</i-button>
            </button-group>
          </div>

          <div class="box-bt" v-if="item.IsDefault">
            <button-group class="bt-group">
              <i-button icon="md-create" disabled @click="okOpen(item)">编辑</i-button>
              <i-button icon="ios-trash" disabled @click="deleteData(item)" class="dele-bt">删除</i-button>
            </button-group>
          </div> -->

        </div>
      </div>

      <div v-if="!notApproval" style="width:100%">
        <OaApprovalSettings></OaApprovalSettings>
        <!-- <div id="ApprovalSettings"></div> -->
      </div>

      <Modal
        v-model="modal"
        :mask-closable="false"
        :closable="false"
        :transfer="false"
        :loading="loadingType"
        @on-ok="editType"
        :title="title"
        @on-cancel="modal = false"
        >
          <i-form ref="formRef" :model="formData" :rules="ruleValidate" :label-width="100">
            <form-item :label="tabName + '：'" prop="name" labelFor="tabName">
              <i-input v-model="formData.name" :placeholder="'请填写'+ tabName +'名称'" elementId="tabName"></i-input>
            </form-item>
          </i-form>
      </Modal>
    </div>
  </div>
  </div>
</template>
<script>
  import OaApprovalSettings from '@/pages/operationalAnalysis/views/oaDocument/OfficialSetting/ApprovalSettings.vue'
  export default {
    name: 'Setting',
    components: {
      OaApprovalSettings
    },
    data: function () {
      return {
        title: '新增',
        loadingType: true,
        modal: false, // 弹出框
        rowList: [],
        total: 0, // 总条数
        pageSize: 20, // 每页显示条数,默认10
        pageCurrent: 1, // 当前页码
        pages: 20, // 默认每页可选10/20/50/100条
        apiCach: 'OfficialDocEmergencyLevel', // 用户存储api 方便delete和 edit
        deleteId: 'officialDocEmergencyLevelID', // 用户存储api 方便delete和 edit
        formData: {
          name: '' // 提交的关键字
        },
        index: 1, // menu 下标
        ruleValidate: {
          name: [{
                   required: true,
                   message: '公文类型不能为空',
                   trigger: 'blur'
                 },
                 {
                   type: 'string',
                   max: 6,
                   message: '公文类型名称不能超过6字符',
                   trigger: 'blur'
                 },
                 {
                   validator: function (rule, value, callback, source, options) {
                     var errors = []
                     var pattern = new RegExp("[`%~!@#$^&*=|{}':;'·+,\\[\\]\\\\<>()（）《》“”/?~！@#￥……&*|{}【】‘；：”“'。.，、？\"' ']")
                     if (pattern.test(value)) {
                       errors.push('不支持特殊字符')
                     } else if (value.indexOf(' ') !== -1) {
                       errors.push('不支持特殊字符')
                     }
                     callback(errors)
                   }
                 }
          ]
        }, // 表单校验规则
        updata: null, // 新增还是修改
        notApproval: true // 是否是审批设置
      }
    },
    computed: {
      tabName: function () {
        let value = ''
        if (this.index === 1) {
          value = '公文种类'
        } else if (this.index === 2) {
          value = '秘密等级'
        } else if (this.index === 3) {
          value = '紧急程度'
        }
        return value
      }
    },
    created: function () {
      this.changeMenu(1)
    },
    methods: {
      getType: function () {
        this.xy.loading()
        var that = this
        let params = {
          pageIndex: that.pageCurrent,
          pageSize: that.pageSize
        }
        this.xy.get(`${this.$store.state.apiPath}/api/OfficialDocType/GetByPage`, params).then(res => {
          this.xy.unloading()

          if (res.success) {
            // && res.data.data.data && res.data.data.data.length > 0
            if (res.data.data) {
              // that.total = res.data.data.totalRecords
              that.rowList = res.data.data
            }
          }
        })
        // this.xy.unloading()
        // console.log(res.data)
        // if (res.success) {
        //   if (res.data.data && res.data.data.data && res.data.data.data.length > 0) {
        //     console.log(res.data)
        //     // that.total = res.data.data.totalRecords
        //     that.rowList = res.data.data.data
        //   }
        // } else {
        //   this.xy.msgError(res.msg)
        // };
        // xy.http.get(xy.string.format('{0}/api/OfficialDocType/GetByPage', xy.subMenuServiceUrl), {
        //   pageIndex: that.pageCurrent,
        //   pageSize: that.pageSize
        // }, function (res) {
        //   this.xy.unloading()
        //   if (res.data.success) {
        //     if (res.data.data && res.data.data.data && res.data.data.data.length > 0) {
        //       // that.total = res.data.data.totalRecords
        //       that.rowList = res.data.data.data
        //     }
        //   } else {
        //     xy.message.error(that, res.data.msg)
        //   };
        // })
      },
      getLevel: function () {
        this.xy.loading()
        var that = this
        let params = {
          pageIndex: that.pageCurrent,
          pageSize: that.pageSize
        }
        that.xy.get(`${that.$store.state.apiPath}/api/OfficialDocSecretLevel/GetByPage`, params).then(res => {
          that.xy.unloading()
          if (res.success) {
            // && res.data.data.data && res.data.data.data.length > 0
            if (res.data.data) {
              // that.total = res.data.data.totalRecords
              that.rowList = res.data.data
            }
          }
        })

        // xy.http.get(xy.string.format('{0}/api/OfficialDocSecretLevel/GetByPage', xy.subMenuServiceUrl), {
        //   pageIndex: that.pageCurrent,
        //   pageSize: that.pageSize
        // }, function (res) {
        //   xy.unloading()
        //   if (res.data.success) {
        //     if (res.data.data && res.data.data.data && res.data.data.data.length > 0) {
        //       // that.total = res.data.data.totalRecords
        //       that.rowList = res.data.data.data
        //     }
        //   } else {
        //     xy.message.error(that, res.data.msg)
        //   };
        // })
      },
      getDegree: function () {
        this.xy.loading()
        var that = this
        let params = {
          pageIndex: that.pageCurrent,
          pageSize: that.pageSize
        }
        this.xy.get(`${this.$store.state.apiPath}/api/OfficialDocEmergencyLevel/GetByPage`, params).then(res => {
          this.xy.unloading()
          if (res.success) {
            // && res.data.data.data && res.data.data.data.length > 0
            if (res.data.data) {
              // that.total = res.data.data.totalRecords
              that.rowList = res.data.data
            }
          }
        })
      },
      newMould: function () {
        this.modal = true
        this.title = '新建'
        this.formData.name = ''
        this.updata = ''
      },
      okOpen: function (val) {
        this.modal = true
        this.formData.name = val.Name
        this.updata = val
        this.title = '编辑'
      },
      updateTble: function () {
        switch (this.index) {
          case 1:
            this.apiCach = 'OfficialDocType'
            this.getType()
            break
          case 2:
            this.apiCach = 'OfficialDocSecretLevel'
            this.getLevel()
            break
          case 3:
            this.apiCach = 'OfficialDocEmergencyLevel'
            this.getDegree()
            break
          case 4:
            this.loadingAppro()
            break
        }
      },
      // 新增，编辑
      editType () {
        this.changeLoading()
        var that = this

        that.$refs.formRef.validate(function (valid) {
          if (valid) {
            that.xy.loading()
            if (that.updata) {
              let params = {
                ID: that.updata.ID,
                Name: that.formData.name
              }
              that.xy.post(`${that.$store.state.apiPath}/api/${that.apiCach}/Update`, params).then(res => {
                that.xy.unloading()
                if (res.success) {
                  that.xy.msgSuc(res.msg)
                  that.updateTble()
                  that.modal = false
                  that.updata = null
                }
              }).catch(res => {

              })
            } else {
              let params = {
                Name: that.formData.name
              }
              that.xy.post(`${that.$store.state.apiPath}/api/${that.apiCach}/Create`, params).then(res => {
                that.xy.unloading()
                if (res.success) {
                  that.xy.msgSuc(res.msg)
                  that.updateTble()
                  that.modal = false
                }
              })
            }
          }
        })
      },
      deleteData: function (row) {
        var that = this
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除"' + row.Name + '"吗？</p>',
          onOk: function () {
            this.xy.post(`${that.$store.state.apiPath}/api/${that.apiCach}/Delete?id=${row.ID}`).then(res => {
              if (res.success) {
                that.xy.msgSuc(res.msg)
                that.updateTble()
              }
            })
          }

        })
      },
      changeLoading: function () {
        this.loadingType = false
        this.$nextTick(function () {
          this.loadingType = true
        })
      },

      // 切换menu
      changeMenu: function (val) {
        var name = this.index = val * 1
        this.rowList = []
        name < 4 ? this.notApproval = true : this.notApproval = false
        this.updateTble()
      },
      loadingAppro: function () {
        // this.$router.push('/xyhome/ApprovalSettings')
        // xy.http.load(xy.string.format('{0}/View/oaDocument/OfficialSetting/PC/View/ApprovalSettings.html', xy.subMenuWebUrl), {
        //   targetID: 'ApprovalSettings',
        //   loadParams: {
        //   }
        // })
      }

    }

  }
</script>
<style lang="less">
.setting-container    {
  position: relative;
}
.new-btn {
  position: absolute;
  z-index: 900;
  top: 14px;
  right: 14px;
}

.container {
  display: flex;
  /* justify-content: space-between; */
  padding: 20px 0;
  flex-flow: row wrap;
}
.box {
  width: 290px;
  height: 160px;
  margin-right: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box-type {
  width: 290px;
  height: 160px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(241, 241, 241, 1);
  font-size: 14px;
}
.box .add {
  width: 290px;
  height: 160px;
  background: rgba(255, 255, 255, 1);
  border: 1px dashed #d9d9d9;
  font-size: 14px;
  display: flex;
  align-items: center;
  >p {
    font-size: 16px;
    line-height: 20px;
    height: 20px !important;
    margin: 0 !important;
    color: #8C8C8C !important;
  }
}
.box-type .dot {
  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m1 {
  background: rgba(65, 150, 255, 1);
  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m2 {
  background: rgba(234, 102, 102, 1);
  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m3 {
  background: rgba(255, 162, 71, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m4 {
  background: rgba(72, 201, 141, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m5 {
  background: rgba(251, 218, 85, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m6 {
  background: rgba(57, 172, 160, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m7 {
  background: rgba(65, 150, 255, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m8 {
  background: rgba(234, 102, 102, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m9 {
  background: rgba(255, 162, 71, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m10 {
  background: rgba(72, 201, 141, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m11 {
  background: rgba(251, 218, 85, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m12 {
  background: rgba(57, 172, 160, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m12 {
  background: rgba(65, 150, 255, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m13 {
  background: rgba(234, 102, 102, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m14 {
  background: rgba(255, 162, 71, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m15 {
  background: rgba(72, 201, 141, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m16 {
  background: rgba(251, 218, 85, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m17 {
  background: rgba(57, 172, 160, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m18 {
  background: rgba(65, 150, 255, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m19 {
  background: rgba(234, 102, 102, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-type .m20 {
  background: rgba(255, 162, 71, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}

.box-type .m {
  background: rgba(255, 183, 72, 1);

  margin: 20px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-image: url(../image/seticon.png);
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: center;
}
.box-main {
  height: 112px;
  display: flex;
  .box-txt {
    padding-top: 20px;
  }
}
.box-type p:nth-of-type(1) {
  font-size: 16px;
  color: #444444;
  margin-bottom: 4px;
}
.box-type p:nth-of-type(2) {
  font-size: 16px;
  color: #999999;
}
.is-select {
  color: rgba(153, 153, 153, 0.4) !important;
}
.box-type .ivu-icon {
  font-size: 22px;
}
.add {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.add > p:nth-of-type(2) {
  font-size: 16px;
  /* height: 140px;
  line-height: 140px; */
  justify-content: center;
}
.icon-add {
  font-size: 22px;
  cursor: pointer;
  color: #b7b6b6;
}
.box-bt {
  width: 100%;
  height: 48px;
}
.bt-group {
  width: 100%;
  height: 100%;
}
.bt-group button {
  width: 50%;
  height: 100%;
}
.box-type .ivu-btn {
  border-radius: 0 0 8px 8px;
  background: rgba(249, 250, 251, 1);
  border: 0px;
  color: #999;
  font-size: 14px;
}
/* .box-type .ivu-btn:hover {
  border: 0px;
  color: #4196FF;
}
.box-type .dele-bt:hover {
  color: #EA6666;
} */
/* .box-type .ivu-btn {
  border: 0px;
  color: #999999;
}
.box-type .dele-bt {
  color: #999999;
}
.box-type :hover {
  color: #878889;
} */
.bt-group {
  width: 100%;
  height: 100%;
  border-top: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(249, 250, 251, 1);
}
.bt-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
.bt-icon {
  /* padding */
  flex: 1;
  /*cursor: pointer*/;
}
.bt-icon button {
  /* width: 33%; */
  /* flex: 1; */
  height: 100%;
  box-shadow:none!important;
}
.bt-icon button i{
  margin-right:10px;
}
.bt-group > span {
  height: 16px;
  width: 1px;
  background-color: #e8e8e8;
}
.bt-icon .ivu-btn {
  border-radius: 0 0 2px 2px;
  background: rgba(249, 250, 251, 1);
  border: 0px;
  color: #999;
  font-size: 14px;
  padding: 0 11px;
}
.bt-group .bt-base:hover {
  transition: 200ms;
  transition-timing-function: ease-in-out;
  -webkit-transition: 200ms;
  -webkit-transition-timing-function: ease-in-out;
}
.bt-group .btn-noty:hover button {
  color: #4196ff;
}
.bt-group .dele-bt:hover button {
  color: #ea6666;
}
.bg-admin:hover {
  color: none !important;
}
</style>
