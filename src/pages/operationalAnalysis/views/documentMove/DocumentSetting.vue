<template>
  <div class="xy-content-module">
    <div class="xy-content-body">
      <div class="app-flex">
        <div class="app-flex-box cursor-p" @click="addType">
          <div><Icon type="md-add" size="20" /><span class="app-flex-text">新增类型</span></div>
        </div>
        <div v-for="(item, index) in dList" :key="index" class="app-flex-box-content">
            <div class="app-flex-box-content-top">
                <div class="app-flex-box-content-top-flex">
                    <div class="app-flex-box-content-top-flex-left" :style="{backgroundColor:'#FFB748'}" >
                        <Icon type="ios-pricetag" style="transform: rotate(-90deg)" />
                    </div>
                    <div class="app-flex-box-content-top-flex-right">
                        <div class="app-flex-box-content-top-flex-right-top" id="file-setting-name">{{ item.Name }}</div>
                    </div>
                </div>
            </div>
            <div v-if="item.IsDefault" class="app-flex-box-content-bottom default">
                <div>
                    <Icon type="md-create" class="app-flex-box-icon" />编辑
                </div>
                <div class="app-split">|</div>
                <div>
                    <Icon type="ios-trash" class="app-flex-box-icon dele" />删除
                </div>
            </div>
            <div v-else class="app-flex-box-content-bottom">
                <div class="app-flex-box-content-bottom-edit cursor-p" @click="edit(item)">
                    <Icon type="md-create" class="app-flex-box-icon" />编辑
                </div>
                <div class="app-split">|</div>
                <div class="app-flex-box-content-bottom-del cursor-p" @click="del(item.ID, item.Name)">
                    <Icon type="ios-trash" class="app-flex-box-icon dele" />删除
                </div>
            </div>
        </div>
      </div>
      <modal v-model="modalCreateType" :transfer="false" title="新增" :mask-closable="false">
        <div class="dialog-model-content">
            <i-form ref="formValidateCreate" :model="formValidateCreate" :rules="ruleValidateCreate" :label-width="120" @submit.native.prevent>
                <form-item label="公文类型" prop="typeName" labelFor="typeName">
                    <i-input v-model.trim="formValidateCreate.typeName" elementId="typeName" clearable style="width: 250px">
                    </i-input>
                </form-item>
            </i-form>
        </div>
        <div slot="footer">
          <Button class="xy-modal-close" @click="creatTypeCancel">取消</Button>
          <Button class="xy-modal-primary" shape="circle" @click="creatTypeOk">确定</Button>
        </div>
      </modal>
      <modal v-model="modalEditType" :transfer="false" title="编辑" :mask-closable="false">
          <div class="dialog-model-content">
              <i-form ref="formValidateEdit" :model="formValidateEdit" :rules="ruleValidateEdit" :label-width="120">
                  <form-item label="公文类型" prop="typeName" labelFor="typeNameE">
                      <i-input v-model.trim="formValidateEdit.typeName" elementId="typeNameE" clearable style="width: 250px"></i-input>
                  </form-item>
              </i-form>
          </div>
          <div slot="footer">
            <Button class="xy-modal-close" @click="editTypeCancel">取消</Button>
            <Button class="xy-modal-primary" shape="circle" @click="editOk">确定</Button>
          </div>
      </modal>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'DocumentSetting',
    data () {
      return {
        dList: [],
        formValidateCreate: {
          typeName: ''
        },
        ruleValidateCreate: {
          typeName: [
            { required: true, message: '公文类型不能为空', trigger: 'blur' },
            { type: 'string', min: 1, max: 6, message: '公文类型不能为空或超过6个字', trigger: 'blur' },
            { pattern: /^[A-Za-z0-9-_\u4e00-\u9fa5]{1,6}$/, message: '允许汉字、数字、英文、短横线和下划线', trigger: 'blur' }
          ]
        },
        formValidateEdit: {
          typeName: ''
        },
        ruleValidateEdit: {
          typeName: [
            { required: true, message: '公文类型不能为空', trigger: 'blur' },
            { type: 'string', min: 1, max: 6, message: '公文类型不能为空或超过6个字', trigger: 'blur' },
            { pattern: /^[A-Za-z0-9-_\u4e00-\u9fa5]{1,6}$/, message: '允许汉字、数字、英文、短横线和下划线', trigger: 'blur' }
          ]
        },
        modalCreateType: false, // 创建公文类型的弹框
        modalEditType: false, // 编辑公文类型的弹框
        editId: 0 // 要编辑的ID
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
    },
    mounted () {
      this.$nextTick(() => {
        this.getListData()
      })
    },
    methods: {
      // 获取所有公文类型
      async getListData () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/OfficialDocCirculationType/GetAll`)
        this.xy.unloading()
        if (res.success) {
          this.dList = res.data
        }
      },
      // 添加公文类型
      addType () {
        this.formValidateCreate.typeName = ''
        this.formValidateEdit.typeName = ''
        if (this.dList.length < 20) {
          this.modalCreateType = true
        } else {
          this.xy.msgError('最多创建20种公文类型。')
        }
      },
      // 取消添加
      creatTypeCancel () {
        this.modalCreateType = false
        this.formValidateCreate.typeName = ''
        this.$refs.formValidateCreate.resetFields()
      },
      // 确定添加
      creatTypeOk () {
        this.$refs.formValidateCreate.validate((valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            this.Create()
          }
        })
      },
      async Create () {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + '/api/OfficialDocCirculationType/CreateDocCirculationType', {
            Name: this.formValidateCreate.typeName
          }, true
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.getListData()
          this.modalCreateType = false
          this.$refs.formValidateCreate.resetFields()
        } else {
          this.xy.msgError('公文流转种类重复。')
        }
      },
      // 单击表格中编辑按钮触发
      edit (row) {
        this.editId = row.ID
        this.modalEditType = true
        // 名称回写
        this.formValidateEdit.typeName = row.Name
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      // 确认编辑触发
      editOk () {
        this.$refs.formValidateEdit.validate((valid) => {
          if (!valid) {
            return this.changeLoading()
          } else {
            this.editType()
          }
        })
      },
      // 编辑公文类型
      async editType (row) {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/OfficialDocCirculationType/Update`, {
            Name: this.formValidateEdit.typeName,
            id: this.editId
          }, true)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('编辑成功。')
          this.changeLoading()
          this.modalEditType = false
          this.getListData()
          this.$refs.formValidateEdit.resetFields()
        } else {
          if (Number(res.errorcode) > 0) {
            // 已存在同名的被删除类型
            this.rebootId = Number(res.errorcode)
            this.xy.confirm('重新使用', res.msg, this.enableAttendanceType)
          } else {
            this.xy.msgError(res.msg)
          }
          this.changeLoading()
        }
      },
      // 编辑取消
      editTypeCancel () {
        this.editId = ''
        this.formValidateEdit.typeName = ''
        this.modalEditType = false
        this.$refs.formValidateEdit.resetFields()
      },
      // 单击删除单个内容触发
      del (id, name) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>是否确认删除？</p>',
          onOk: () => {
            this.xy.post(
              this.apiPath + `/api/OfficialDocCirculationType/Delete?DocumentTypeID=${id}`).then(res => {
              this.xy.unloading()
              if (res.success) {
                this.xy.msgSuc('删除成功。')
                this.getListData()
              }
            })
          },
          onCancel: () => { }
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
.cursor-p{
  color: #000;
  opacity: .65;
}
.app-flex-box,
.app-flex-box-content {
    width: 290px;
    height: 160px;
    margin-right: 20px;
    margin-bottom: 20px;
    background: #fff;
}
#file-setting-name{
  font-weight:bold;
  color:#000;
  opacity:0.85;
}
.app-flex-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #d9d9d9;
}
  .app-flex-box:hover {
    color: #4196ff;
    border-color: #4196ff;
    div {
      > i, > span {
       color: #4196ff;
      }
    }
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
                background-image: url(/image/seticon.png);
                background-size: 22px;
                background-position: center;
                background-repeat: no-repeat;
            }
            .app-flex-box-content .app-flex-box-content-top .app-flex-box-content-top-flex .app-flex-box-content-top-flex-left > i {
                text-align: center;
                line-height: 48px;
                display: block;
                font-size: 22px;
                color: #fff;
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
      .dele {
        font-size: 16px;
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
</style>
