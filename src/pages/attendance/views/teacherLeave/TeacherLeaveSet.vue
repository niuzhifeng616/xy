// 教师请假类型
<template>
  <div>
    <div class="xy-content-title clearfix">
        <Button class="xy-primary" @click="setFlow">审批流程设置</Button>
    </div>
    <div class="xy-content-body">
        <div class="app-flex">
            <div class="app-flex-box cursor-p" @click="addType">
                <div>
                    <Icon type="md-add" size="20"></Icon><span class="app-flex-text">添加类型</span>
                </div>
            </div>
            <div v-for="(item, index) in list" :key="index" class="app-flex-box-content">
                <div class="app-flex-box-content-top">
                    <div class="app-flex-box-content-top-flex">
                        <div class="app-flex-box-content-top-flex-left" :style="{backgroundColor:item.TeacherLeaveTypeName=='事假'?'#4196FF':item.TeacherLeaveTypeName=='病假'?'#EA6666':item.TeacherLeaveTypeName=='年假'?'#FFA247':item.TeacherLeaveTypeName=='婚假'?'#48C98D':item.TeacherLeaveTypeName=='产假'?'#FBDA55':item.TeacherLeaveTypeName=='丧假'?'#39ACA0':'#FFB748'}"></div>
                        <div class="app-flex-box-content-top-flex-right" v-if="item.IsDefault===0">
                            <div class="app-flex-box-content-top-flex-right-top">{{item.TeacherLeaveTypeName}}</div>
                            <div class="app-flex-box-content-top-flex-right-bottom">{{item.FullName}}添加</div>
                        </div>
                        <div class="app-flex-box-content-top-flex-right" v-else>
                            <div class="app-flex-box-content-top-flex-right-top">{{item.TeacherLeaveTypeName}}</div>
                            <div class="app-flex-box-content-top-flex-right-bottom">系统内置</div>
                        </div>
                    </div>
                </div>
                <div v-if="item.IsDefault" class="app-flex-box-content-bottom default">
                    <div>
                        <Icon type="md-create" class="app-flex-box-icon"></Icon>编辑
                    </div>
                    <div class="app-split">|</div>
                    <div>
                        <Icon type="ios-trash-outline" size="16" class="app-flex-box-icon"></Icon>删除
                    </div>
                </div>
                <div v-else class="app-flex-box-content-bottom">
                    <div class="app-flex-box-content-bottom-edit cursor-p" @click="edit(item)">
                        <Icon type="md-create" class="app-flex-box-icon"></Icon>编辑
                    </div>
                    <div class="app-split">|</div>
                    <div class="app-flex-box-content-bottom-del cursor-p" @click="del(item.TeacherLeaveTypeID, item.TeacherLeaveTypeName, item.IsUsed)">
                        <Icon type="ios-trash-outline" size="16" class="app-flex-box-icon"></Icon>删除
                    </div>
                </div>
            </div>
        </div>
        <Modal
          v-model="modalCreate"
          :transfer="false" title="新增请假类型"
          :loading="loading"
          :mask-closable="false"
          >
            <div class="dialog-model-content">
                <i-form
                  ref="formValidateOk"
                  :model="formValidateOk"
                  :rules="ruleValidateOk"
                  :label-width="80"
                  @submit.native.prevent
                  >
                    <form-item label="请假类型" prop="typeValue"  labelFor='typeValue'>
                        <i-input v-model.trim="formValidateOk.typeValue" clearable elementId="typeValue"></i-input>
                    </form-item>
                </i-form>
            </div>
            <div slot="footer">
              <Button class="xy-modal-close" @click="cancel">取消</Button>
              <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
            </div>
        </Modal>
        <Modal
          v-model="modalEdit"
          :transfer="false"
          title="编辑请假类型"
          :loading="loading"
          :mask-closable="false"
          >
          <div class="dialog-model-content">
              <i-form
                ref="formValidateEdit"
                :model="formValidateEdit"
                :rules="ruleValidateEdit"
                :label-width="80"
                @submit.native.prevent
                >
                  <form-item label="请假类型" prop="typeValue" labelFor='typeValueAdd'>
                      <i-input v-model.trim="formValidateEdit.typeValue" clearable elementId="typeValueAdd"></i-input>
                  </form-item>
              </i-form>
          </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="cancel">取消</Button>
            <Button class="xy-modal-primary" @click="editOk" shape="circle">确定</Button>
          </div>
        </Modal>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'ToReleaseTask',
    data () {
      return {
        modal_loading: false,
        loading: true,
        modalCreate: false, // 创建弹出框默认不展示
        editId: '', // 要编辑的ID
        modalEdit: false,
        delTip: '', // 删除请假类型弹框提示语
        formValidateOk: {
          typeValue: ''
        },
        ruleValidateOk: {
          typeValue: [
            { required: true, message: '请假类型不能为空', trigger: 'blur' },
            { type: 'string', min: 2, max: 6, message: '请假名称字数不能低于2个字超过6个字', trigger: 'blur' }
          ]
        },
        formValidateEdit: {
          typeValue: ''
        },
        ruleValidateEdit: {
          typeValue: [
            { required: true, message: '请假类型不能为空', trigger: 'blur' },
            { type: 'string', min: 2, max: 6, message: '请假名称字数不能低于2个字超过6个字', trigger: 'blur' }
          ]
        },
        list: []
      }
    },
    props: [],
    created () {
    },
    mounted () {
      this.$nextTick(function () {
        this.getListData()
      })
    },
    methods: {
      addType () {
        if (this.list.length < 10) {
          this.modalCreate = true
        } else {
          this.xy.msgError('最多创建10种请假类型。')
        }
      },
      async getListData () {
        this.xy.loading()
        let res = await this.xy.get(
          this.$store.state.apiPath + `/api/TeacherLeaveType/GetPage`, {
            pageIndex: 1,
            pageSize: 15
          }
        )
        if (res.success) {
          this.xy.unloading()
          this.list = res.data.data
        } else {
          this.xy.msgError(res.msg)
        }
      },
      // 创建
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      ok () {
        var _this = this
        this.$refs.formValidateOk.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.CreateType()
          }
        })
      },
      async CreateType () {
        this.xy.loading()
        let params = {
          TeacherLeaveTypeName: this.formValidateOk.typeValue.trim()
        }
        let res = await this.xy.post(
          this.$store.state.apiPath + `/api/TeacherLeaveType/Create`, params
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.getListData()
          this.modalCreate = false
          this.$refs.formValidateOk.resetFields()
        } else if (res.errorcode !== '' && res.errorcode !== 0) {
          this.modalCreate = false
          this.changeLoading()
        } else {
          this.modalCreate = false
          this.changeLoading()
        }
      },
      // 关闭创建/编辑弹框触发
      cancel (name) {
        this.editId = ''
        this.modalCreate = false
        this.modalEdit = false
        this.$refs.formValidateOk.resetFields()
        this.$refs.formValidateEdit.resetFields()
      },
      // 单击表格中编辑按钮触发
      edit (row) {
        this.editId = row.TeacherLeaveTypeID
        this.modalEdit = true
        // 名称回写
        this.formValidateEdit.typeValue = row.TeacherLeaveTypeName
      },
      // 确认编辑触发
      editOk () {
        var _this = this
        this.$refs.formValidateEdit.validate(function (valid) {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.EditType()
          }
        })
      },
      async EditType () {
        this.xy.loading()
        let res = await this.xy.post(
          this.$store.state.apiPath + `/api/TeacherLeaveType/Edit`, {
            TeacherLeaveTypeID: this.editId,
            TeacherLeaveTypeName: this.formValidateEdit.typeValue
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('编辑成功。')
          this.changeLoading()
          this.modalEdit = false
          this.getListData()
          this.$refs.formValidateEdit.resetFields()
        } else if (res.errorcode && res.errorcode === 0) {
          this.modalEdit = false
        } else if (res.errorcode && res.errorcode > 0) {
          this.changeLoading()
          this.modalEdit = false
        }
      },
      // 单击删除单个内容触发
      del (id, name, isUsed) {
        this.delTip = '是否确认删除' + name + '吗？'
        this.$Modal.confirm({
          title: '删除',
          content: '<p>' + this.delTip + ' </p>',
          onOk: () => {
            this.modal_loading = true
            this.xy.post(
              this.$store.state.apiPath + `/api/TeacherLeaveType/Delete?id=${id}`).then(res => {
              if (res.success) {
                this.xy.msgSuc('删除成功。')
                this.modal_loading = false
                this.getListData()
              } else {
                this.modal_loading = false
                this.xy.msgError(res.msg)
              }
              this.xy.unloading()
            })
          },
          onCancel () { }
        })
      },
      setFlow () {
        this.$store.commit('common/getThreeMenuName', '流程设置')
        this.$router.push({
          path: 'TeacherLeaveWorkFlow',
          query: this.$store.state.common.menuInfo
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.app-flex {
    display: flex;
    flex-wrap: wrap;
}

.app-flex-box,
.app-flex-box-content {
    width: 290px;
    height: 160px;
    margin-right: 20px;
    margin-bottom: 20px;
    background: #fff;
}

.app-flex-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #d9d9d9;
}

.app-flex-box > div {
    color: #8c8c8c;
}

.app-flex-box-content {
    display: flex;
    flex-flow: column;
    border: 1px solid #e9e9e9;
}

.app-flex-box-content .app-flex-box-content-top {
    flex: 1;
}

.app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex {
    height: 48px;
    display: flex;
    align-items: center;
    margin: 20px 0 0 20px;
}

.app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex .app-flex-box-content-top-flex-left {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    margin-right: 18px;
    background-image: url('~@/assets/common/attendance/seticon.png');
    background-size: 22px;
    background-position: center;
    background-repeat: no-repeat;
}

.app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex .app-flex-box-content-top-flex-right {
    display: flex;
    flex-flow: column;
}

.app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex .app-flex-box-content-top-flex-right .app-flex-box-content-top-flex-right-top {
    color: #000;
    font-size: 16px;
    font-weight: 700;
}

.app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex .app-flex-box-content-top-flex-right .app-flex-box-content-top-flex-right-bottom {
    color: #999;
    font-size: 14px;
}

.app-flex-box-content .app-flex-box-content-bottom {
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(249,250,251,1);
    color: #878889;
}

.app-flex-box-content .app-flex-box-content-bottom .app-flex-box-icon {
    margin-right: 10px;
    color: #878889;
}

.app-flex-box-content .app-flex-box-content-bottom.default {
    background: rgba(249,250,251,.5);
    color: rgba(135,136,137,.45);
}

.app-flex-box-content .app-flex-box-content-bottom.default .app-flex-box-icon {
    margin-right: 10px;
    color: #E8E8E8;
}

.app-flex-box-content .app-flex-box-content-bottom > div {
    flex: 4;
    text-align: center;
}

.app-flex-box-content .app-flex-box-content-bottom > div.app-split {
    flex: 1;
    text-align: center;
    color: #e8e8e8;
}
.app-flex-box-content .app-flex-box-content-bottom .app-flex-box-content-bottom-edit:hover,
.app-flex-box-content .app-flex-box-content-bottom .app-flex-box-content-bottom-edit:hover .app-flex-box-icon {
    color: #4196ff;
}

.app-flex-box-content .app-flex-box-content-bottom .app-flex-box-content-bottom-del:hover,
.app-flex-box-content .app-flex-box-content-bottom .app-flex-box-content-bottom-del:hover .app-flex-box-icon {
    color: #f5222d;
}

.app-flex-text {
    font-size: 16px;
    margin-left: 5px;
}
.ivu-modal-header{
  border-bottom:0;
}
.ivu-modal-footer {
    border-top: 0;
    padding: 12px 18px 12px 18px;
    text-align: center;
}
.ivu-modal-confirm-head-title {
    margin: 0px;
    text-align: center;
    display: block;
}
.ivu-modal-confirm-body {
    padding-left: 0px;
    text-align: center;
    margin: 20px 20px 30px;
}
</style>
