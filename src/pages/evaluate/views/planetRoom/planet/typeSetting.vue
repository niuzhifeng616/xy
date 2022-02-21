<template>
  <div class='xy-content-module'>
    <div class='xy-content-body'>
      <div class="tabs-left">
        <div class="top">
           <p>类别设置</p>
           <Button class="xy-primary" @click="modalCreate"> + 添加类型</Button>
        </div>
        <div v-for="(item, index) in ModuleTypeList" :key="index" class="left-bottom">
          <div class="items">
            <div class="item-left">
              <span class="img-bg"></span>
              <span class="name">
                {{item.StarTypeName}}
              </span>
            </div>
            <span  class="operat">
              <a @click="edit(item)">编辑</a>
              <a-divider type="vertical" />
              <a @click="del(item)">删除</a>
            </span>
          </div>
        </div>
      </div>
      <div class="tabs-right">
        <div class="top">
           <p>等级颜色设置</p>
        </div>
        <div class='levels'>
          <div class="level-itmes" v-for="(levelItem,levelIndex) in levelList" :key="levelIndex">
            <div class="level-name">{{levelItem.StarColorName}}</div>
            <div class="select-color" :style="active === levelIndex?'border:1px solid #0089ff':''" @click="showColors(levelIndex)">
              <!--<span  :style="{'background':StarColorName.color}"></span>-->
              <span>{{levelItem.StarColorTypeID}}</span>
            </div>
            <div class="colors" v-if="active === levelIndex">
              <p v-for="(item,index) in colorList" :key="index" :style="{background:item.StarColor}"  @click="checkColor(index,levelIndex)"></p>
            </div>
            <div class="increase" v-if="levelList.length - 1 === levelIndex">
               <p class="add" @click="add(levelIndex)" v-if="levelList.length !== 7"><Icon type="md-add" /></p>
               <p class="del" @click="reduce(levelItem,levelIndex)" v-if="levelIndex !== 0"><Icon type="md-remove" /></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-right fix-footer">
        <Button
          class="xy-btn-primary"
          shape="circle"
          style="margin-right:0"
          @click="submit">
            保存
        </Button>
    </div>
    <Modal
      v-model="modalShow"
      :transfer="false"
      title="添加类型"
      :loading="loading"
      :mask-closable="false"
      >
      <div class="dialog-model-content">
        <Form
          ref="formValidateCreate"
          :model="formValidateCreate"
          :rules="ruleValidateCreate"
          :label-width="100"
          @submit.native.prevent
          >
          <FormItem
            label="类型名称："
            prop="StarTypeName"
            label-for="StarTypeName"
            >
            <Input
              v-model.trim="formValidateCreate.StarTypeName"
              clearable
              element-id="StarTypeName" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="cancel">取消</Button>
        <Button class="xy-modal-primary" @click="ok" shape="circle">
          <span v-if="!loading">保存</span>
          <span v-else>保存中...</span>
        </Button>
      </div>
    </Modal>
    <!--编辑类型-->
    <Modal
      v-model="editModalShow"
      :transfer="false"
      title="编辑类型"
      :loading="loading"
      :mask-closable="false"
      >
      <div class="dialog-model-content">
        <Form
          ref="formValidateEdit"
          :model="formValidateEdit"
          :rules="ruleValidateEdit"
          :label-width="100"
          @submit.native.prevent
          >
          <FormItem
            label="类型名称："
            prop="StarTypeName"
            label-for="StarTypeName2"
            >
            <Input
              v-model.trim="formValidateEdit.StarTypeName"
              clearable
              element-id="StarTypeName2" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button class="xy-modal-close" @click="editCancel">取消</Button>
        <Button class="xy-modal-primary" @click="editOk" shape="circle">
          <span v-if="!loading">保存</span>
          <span v-else>保存中...</span>
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        loading: false,
        modalShow: false, // 创建弹出框默认不展示
        editModalShow: false, // 编辑弹窗
        formValidateCreate: {
          StarTypeName: ''
        },
        ruleValidateCreate: {
          StarTypeName: [
            { required: true, message: '类型名称不能为空。', trigger: 'blur' },
            { type: 'string', max: 10, message: '类型名称不能超过10字符。', trigger: 'blur' }
          ]
        },
        formValidateEdit: {
          StarTypeName: '',
          StarTypeID: ''
        },
        ruleValidateEdit: {
          StarTypeName: [
            { required: true, message: '类型名称不能为空。', trigger: 'blur' },
            { type: 'string', max: 10, message: '类型名称不能超过10字符。', trigger: 'blur' }
          ]
        },
        ModuleTypeList: [],
        colorList: [
          {
            type: 1,
            color: '#f14b13'
          },
          {
            type: 2,
            color: '#ff3894'
          },
          {
            type: 3,
            color: '#9566ff'
          },
          {
            type: 4,
            color: '#ffa400'
          },
          {
            type: 5,
            color: '#0089ff'
          },
          {
            type: 6,
            color: '#00b853'
          },
          {
            type: 7,
            color: '#00c7b9'
          }

        ],
        levelList: [],
        active: -1
      }
    },
    created () {
      // /api/StarProgrammeRule/GetStarProgrammeModuleTypeList
      this.getModuleList()
      // 获取颜色列表
      this.getLevelList()
      this.getColorType()
    },
    mounted () {},
    methods: {
      async getLevelList () {
        //  /api/StarProgrammeRule/GetStarProgrammeColorList
        this.xy.loading()
        await this.xy.get(`${this.$store.state.apiPath}/api/StarProgrammeRule/GetStarProgrammeColorList`).then(res => {
          this.xy.unloading()
          if (res.data.length > 0) {
            this.levelList = res.data
          } else {
            this.levelList.push({
              StarColorID: 0,
              StarColorName: '等级一',
              StarColorTypeID: 1
            })
          }
        })
      },
      async getColorType () {
        this.xy.loading()
        await this.xy.get(`${this.$store.state.apiPath}/api/StarProgrammeRule/GetStarProgrammeColorTypeList`).then(res => {
          this.xy.unloading()
          this.colorList = res.data
        })
      },
      async getModuleList () {
        this.xy.loading()
        await this.xy.get(`${this.xyApi}/eva/api/StarProgrammeRule/GetStarProgrammeTypeList`).then(res => {
          this.xy.unloading()
          this.ModuleTypeList = res.data
        })
      },
      add () {
        this.levelList.push({
          StarColorID: 0,
          StarColorName: '',
          StarColorTypeID: 1
        })
        this.levelList.map((item, index) => {
          item.StarColorName = this.getStarColorName(index)
        })
        this.active = -1
      },
      getStarColorName (index) {
        let obj = ['等级一', '等级二', '等级三', '等级四', '等级五', '等级六', '等级七']
        return obj[index]
      },
      reduce (item, index) {
        this.levelList.splice(index, 1)
        this.levelList.map((item, index) => {
          item.StarColorName = this.getStarColorName(index)
        })
      },
      del (row) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '您确定要删除"' + row.StarTypeName + '"吗？',
          onOk: () => {
            this.delObj(row.StarTypeID)
          }
        })
      },
      async  delObj (id) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StarProgrammeRule/DeleteStarProgrammeType?starTypeID=${id}`)
        // this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.getModuleList()
        }
      },
      showColors (index) {
        this.active = index
      },
      modalCreate () {
        this.modalShow = true
      },
      cancel () {
        this.modalShow = false
        this.$refs.formValidateCreate.resetFields()
      },
      // 确定添加
      ok () {
        this.$refs.formValidateCreate.validate((valid) => {
          if (!valid) {
            this.loading = false
            return false
          } else {
            this.loading = true
            this.creatOkFun()
            // this.$set(this, 'modalShow', false)
          }
        })
      },
      async creatOkFun () {
        if (this.ModuleTypeList.length === 15) {
          this.xy.msgError('类别最多15个')
          return false
        }
        let starTypeName = $.trim(this.formValidateCreate.StarTypeName)
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StarProgrammeRule/CreateStarProgrammeType?starTypeName=${starTypeName}`)
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.getModuleList()
          this.getLevelList()
          this.$set(this, 'modalShow', false)
          this.$refs.formValidateCreate.resetFields()
        }
        this.loading = false
      },
      // 设置颜色
      checkColor (index, parentIndex) {
        this.levelList[parentIndex].StarColorTypeID = this.colorList[index].StarColorTypeID
        this.active = -1
        // this.levelList[parentIndex].color = this.colorList[index].color
      },
      async submit () {
        this.xy.loading()
        // /api/StarProgrammeRule/SaveStarProgrammeColor
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StarProgrammeRule/SaveStarProgrammeColor`, {
          ColorList: this.levelList
        })
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('保存成功')
          this.getLevelList()
        } else {
          this.xy.msgError('保存失败')
        }
      },
      editOk () {
        this.$refs.formValidateEdit.validate((valid) => {
          // /api/StarProgrammeRule/UpdateStarProgrammeType
          if (!valid) {
            this.loading = false
            return false
          } else {
            this.loading = true
            this.editOkFun()
          }
        })
      },
      async editOkFun () {
        console.log(this.formValidateEdit)
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StarProgrammeRule/UpdateStarProgrammeType?starTypeID=${this.formValidateEdit.StarTypeID}&starTypeName=${$.trim(this.formValidateEdit.StarTypeName)}`)
        if (res.success) {
          this.xy.msgSuc('修改成功。')
          this.getModuleList()
          this.editModalShow = false
          this.$refs.formValidateCreate.resetFields()
        }
        this.loading = false
      },
      edit (recode) {
        this.$refs.formValidateEdit.resetFields()
        this.editModalShow = true
        // 名称回写
        this.formValidateEdit.StarTypeName = recode.StarTypeName
        this.formValidateEdit.StarTypeID = recode.StarTypeID
      },
      editCancel () {
        this.$refs.formValidateEdit.resetFields()
        this.editModalShow = false
      }
    }
  }
</script>
<style lang='less' scoped>
.fix-footer {
  box-shadow: 0px -1px 2px 0px rgba(0,0,0,0.1);
}
.xy-content-body {
  background-color: #F9F9F9;
  display: flex;
  justify-content: space-between;
}
.tabs-left{
    width: 59%;
    overflow-y: auto;
    background: #fff;
    padding: 5px 0 32px 0;
    .left-bottom{
      padding: 10px 35px 0 24px;
    }
    .items{
      height:67px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid  #e9e9e9;
    }
    .item-left{
      display:flex;
      align-items: center;
      .img-bg{
        width: 48px;
        height: 48px;
        display: inline-block;
        background: #ffbf00;
        border-radius: 24px;
      }
      .name{
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        margin-left: 22px;
      }
    }
    .operat{
      font-size: 14px;
    }
}
.top{
  display:flex;
  height: 53px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid  #e9e9e9;
  padding: 0 24px;
  .xy-primary {
    margin: 0;
  }
  p{
    font-size: 16px;
    font-weight: 500;
    color:rgba(0,0,0,0.85);
  }
}
.tabs-right{
  width: 40%;
  background: #fff;
  .levels{
    .level-itmes{
      display: flex;
      margin:25px;
      align-items: center;
      position: relative;
      width: 270px;
      .level-name{
        font-size: 14px;
        font-weight: 400;
        width: 45px;
      }
      .select-color{
        width: 130px;
        height: 44px;
        background: #ffffff;
        border: 1px solid rgba(0,0,0,0.15);
        border-radius: 4px;
        text-align: center;
        line-height: 44px;
        margin-left: 27px;
        span{
          display: inline-block;
          width: 16px;
          height: 16px;
          // background: #0089ff;
          border-radius: 50%;
        }
      }
      .colors{
        width: 170px;
        height: 84px;
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
        position: absolute;
        top: -23px;
        left: 220px;
        display:flex;
        flex-wrap: wrap;
        padding: 0 0 0 12px;
        p{
          width: 18px;
          height: 18px;
          border-radius:50%;
          display: inline-block;
          margin: 7px 10px;
        }
      }
      .colors:before,
      .colors:after {
        position: absolute;
        content: '';
        width: 8px;
        height: 8px;
        top: 40%;
        left: -5px;
        overflow: hidden;
        pointer-events: none;
        -webkit-transform: rotate(135deg);
        -mz-transform: rotate(135deg);
        transform: rotate(135deg);
      }
      .colors:before {
        background: #fff;
        box-shadow: 1px 1px 1px  rgba(0,0,0,0.2)
      }
      .colors:after {
        bottom: -7px;
        background: #fff;
      }
      .increase{
        margin-left:18px;
        display:flex;

        .add,.del{
          cursor: pointer;
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 17px;
          font-size: 16px;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 2px;
          color: rgba(0,0,0,0.65);
        }
        .del{
          margin-left:10px;
        }
      }
    }
  }
}
</style>
