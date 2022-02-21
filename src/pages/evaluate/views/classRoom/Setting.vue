<template>
  <div class="xy-content-module">
      <div class="xy-content-title xy-flex xy-between xy-center">
        <div>
            <Button class="xy-primary" @click="updateBtn">导入指标</Button>
            <Button class="xy-info" @click="valid">指标设置</Button>
        </div>
        <div>
          <Alert show-icon closable>指标体系，请全部统一设置为二级指标或三级指标</Alert>
        </div>
      </div>
      <div class="xy-content-body">
        <div class="xy-flex setting-wrap">
          <!-- <div v-for="(item,index) in level1List" :key="index">
            <div>{{item.StandardName}}</div>
            <div v-for="(child,index) in item.StandardLevelNext" :key="index">
              {{child.StandardName}}
              <div v-for="(childs,index) in child.StandardLevelNext" :key="index">{{childs.StandardName}}</div>
            </div>
          </div> -->
          <div class="index-level">
            <div class="index-level-title xy-flex xy-between xy-center">
              <div><i class="iconfont">&#xe6f2;</i><span>一级指标</span></div>
              <Icon type="md-add-circle" size="24" @click="addIndex(level1List,1)" />
            </div>
            <div class="index-level-content">
              <ul class="index-list">
                <li v-for="(item,index) in level1List" :key="index" :class="isId===item.StandardID?'active':''">
                  <div class="box" @click="level1Btn(item)">
                    <div class="index-point"></div>
                    <div class="index-name">{{item.StandardName}}</div>
                    <div class="index-btn">
                      <i @click="edit(item,1)" class="iconfont">&#xe6f7;</i>
                      <i @click="del(item,level1List,1)" class="iconfont">&#xe6e1;</i>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="isId===-1" class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
            </div>
          </div>
          <div class="index-level">
            <div class="index-level-title xy-flex xy-between xy-center">
              <div><i class="iconfont">&#xe6f2;</i><span>二级指标</span></div>
              <Icon type="md-add-circle" size="24" v-if="level1List.length>0" @click="addIndex(level2List,2)" />
            </div>
            <div class="index-level-content">
              <ul class="index-list">
                <li v-for="item in level2List" :key="item.StandardID" :class="isId2===item.StandardID?'active':''">
                  <div class="box" @click="level2Btn(item)">
                    <div class="index-point"></div>
                    <div class="index-name">{{item.StandardName}}</div>
                    <div class="index-btn">
                      <i @click="edit(item,2)" class="iconfont">&#xe6f7;</i>
                      <i @click="del(item,level2List,2)" class="iconfont">&#xe6e1;</i>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="isId2===-1" class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
            </div>
          </div>
          <div class="index-level">
            <div class="index-level-title xy-flex xy-between xy-center">
              <div><i class="iconfont">&#xe6f2;</i><span>三级指标</span></div>
              <Icon type="md-add-circle" size="24" v-if="level2List.length>0" @click="addIndex(level3List,3)" />
            </div>
            <div class="index-level-content">
              <ul class="index-list">
                <li v-for="(item,index) in level3List" :key="index">
                  <div class="box" @click="level3Btn(item)">
                    <div class="index-point"></div>
                    <div class="index-name">{{item.StandardName}}</div>
                    <div class="index-btn">
                      <i @click="edit(item,3)" class="iconfont">&#xe6f7;</i>
                      <i @click="del(item,level3List,3)" class="iconfont">&#xe6e1;</i>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="level3List.length<1" class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
            </div>
          </div>
        </div>
      </div>
      <Modal v-model="indexModal"
        :title="titles"
        :transfer="false"
        :loading="loading"
        :mask-closable="false"
        @on-visible-change="watchClose"
      >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" @submit.native.prevent>
        <FormItem label="指标名称" prop="standardName">
          <i-input v-model.trim="formValidate.standardName" clearable></i-input>
        </FormItem>
      </Form>
        <div slot="footer">
          <Button class="xy-modal-close" @click="cancel">取消</Button>
          <Button class="xy-modal-primary" @click="ok" shape="circle">确定</Button>
        </div>
      </Modal>
      <Modal v-model="editModal"
        :title="editTitles"
        :transfer="false"
        :loading="loading"
        :mask-closable="false"
        @on-visible-change="watchEditClose"
      >
      <Form ref="formValidateEdit" :model="formValidateEdit" :rules="ruleValidateEdit" @submit.native.prevent>
        <FormItem label="指标名称" prop="standardName">
          <i-input v-model.trim="formValidateEdit.standardName" clearable></i-input>
        </FormItem>
      </Form>
        <div slot="footer">
          <Button class="xy-modal-close" @click="editCancel">取消</Button>
          <Button class="xy-modal-primary" @click="editOk" shape="circle">确定</Button>
        </div>
      </Modal>
      <XyUpfile
        ref="upfile"
        :modalTitle="upload.upLoadTitle"
        :describeData="upload.tipData"
        :fileFormt="upload.formtData"
        :importPath="upload.upUrl"
        :paramsData="upload.upParams"
        :templateUrl="upload.templateUrl"
        :errorUrl="upload.errorUrl"
        @successLoad="getLevelList"
        >
        </XyUpfile>
  </div>
</template>
<script>
  import XyUpfile from '@/components/upFile/XyUpfile.vue'
  export default {
    name: 'Setting',
    components: {
      XyUpfile
    },
    data () {
      return {
        upload: {
          upLoadTitle: '',
          tipData: [],
          formtData: [],
          upUrl: '',
          upParams: {},
          templateUrl: '',
          errorUrl: ''
        },
        loading: true,
        indexModal: false,
        editModal: false,
        titles: '创建一级指标',
        editTitles: '编辑一级指标',
        formValidate: {
          standardName: ''
        },
        ruleValidate: {
          standardName: [
            { required: true, message: '指标名称不能为空', trigger: 'blur' },
            { type: 'string', max: 10, message: '指标名称不能超过10字符', trigger: 'blur' }
          ]
        },
        formValidateEdit: {
          standardName: ''
        },
        ruleValidateEdit: {
          standardName: [
            { required: true, message: '指标名称不能为空', trigger: 'blur' },
            { type: 'string', max: 10, message: '指标名称不能超过10字符', trigger: 'blur' }
          ]
        },
        type: 1,
        standardId: 0,
        level1: 0,
        parentId1: 0,
        level2: 0,
        parentId2: 0,
        level3: 0,
        parentId3: 0,
        level1List: [],
        level2List: [],
        level3List: [],
        isId: -1,
        isId2: -1,
        isId3: -1,
        editVal: {},
        delId: -1,
        delList: [],
        addList: []
      }
    },
    created () {
      this.getLevelList()
    },
    methods: {
      updateBtn () {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          upLoadTitle: '导入指标',
          tipData: [],
          formtData: ['xlsx', 'xls'],
          upUrl: `${this.$store.state.apiPath}/api/StandardManage/Import`,
          upParams: {},
          templateUrl: `${this.$store.state.apiPath}/api/StandardManage/DownloadTemplateImport`,
          errorUrl: `${this.$store.state.apiPath}/api/StandardManage/DownloadExceptionImport`
        }
      },
      async getLevelList () {
        this.level1List = []
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StandardManage/GetStandardPage`)
        if (res.success) {
          if (res.data.length > 0) {
            this.level1List = res.data
            this.isId = this.level1List[0].StandardID
            this.level2List = this.level1List[0].StandardLevelNext.length > 0 ? this.level1List[0].StandardLevelNext : []
            this.isId2 = this.level2List.length > 0 ? this.level2List[0].StandardID : -1
            this.level1 = 1
            this.parentId1 = this.level1List[0].StandardID
            this.level2 = this.level2List.length > 0 ? this.level2List[0].Level + 1 : 0
            this.parentId2 = this.level2List.length > 0 ? this.level2List[0].StandardID : 0
            this.level3List = this.level2List.length > 0 ? this.level2List[0].StandardLevelNext.length > 0 ? this.level2List[0].StandardLevelNext : [] : []
          }
        }
        this.xy.unloading()
      },
      level1Btn (val) { // 单击一级指标
        this.isId = val.StandardID
        this.level1 = val.Level + 1
        this.parentId1 = val.StandardID
        this.level2List = val.StandardLevelNext
        this.isId2 = this.level2List.length > 0 ? this.level2List[0].StandardID : -1
        this.level2 = this.level2List.length > 0 ? this.level2List[0].Level + 1 : 0
        this.parentId2 = this.level2List.length > 0 ? this.level2List[0].StandardID : 0
        if (this.level2List.length > 0 && this.level2List[0].StandardLevelNext) {
          this.level3List = this.level2List[0].StandardLevelNext
        } else {
          this.level3List = []
        }
        this.isId3 = -1
      },
      level2Btn (val) { // 单击二级指标
        this.isId2 = val.StandardID
        this.level2 = val.Level + 1
        this.parentId2 = val.StandardID
        this.level3List = val.StandardLevelNext
      },
      level3Btn (val) { // 单击三级指标
        this.isId3 = val.StandardID
        this.level3 = val.Level
        this.parentId3 = val.ParentID
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      async valid () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StandardManage/ValidateStandard`)
        if (res.success) {
          this.geSetting()
        }
        this.xy.unloading()
      },
      geSetting () {
        this.$store.commit('common/getThreeMenuName', '指标设置')
        this.$router.push({
          path: '/xyHome/classRoom/indexSetting',
          query: this.$store.state.common.menuInfo
        })
      },
      addIndex (val, type) {
        this.addList = val
        this.createValidType(type)
        this.indexModal = true
      },
      createValidType (type) {
        this.type = type
        switch (type) {
          case 1:
            this.titles = '创建一级指标'
            this.ruleValidate.standardName[1].max = 10
            this.ruleValidate.standardName[1].message = '指标名称不能超过10字符'
            break
          case 2:
            this.titles = '创建二级指标'
            this.ruleValidate.standardName[1].max = 10
            this.ruleValidate.standardName[1].message = '指标名称不能超过10字符'
            break
          case 3:
            this.titles = '创建三级指标'
            this.ruleValidate.standardName[1].max = 40
            this.ruleValidate.standardName[1].message = '指标名称不能超过40字符'
            break
        }
      },
      watchClose (val) {
        if (!val) { this.$refs.formValidate.resetFields() }
      },
      cancel () {
        this.indexModal = false
        this.$refs.formValidate.resetFields()
      },
      ok () {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            let options = {}
            switch (this.type) {
              case 1:
                options = {
                  StandardID: 0,
                  StandardName: this.formValidate.standardName,
                  Level: 0,
                  ParentID: 0
                }
                break
              case 2:
                options = {
                  StandardID: 0,
                  StandardName: this.formValidate.standardName,
                  Level: this.level1,
                  ParentID: this.parentId1
                }
                break
              case 3:
                options = {
                  StandardID: 0,
                  StandardName: this.formValidate.standardName,
                  Level: this.level2,
                  ParentID: this.parentId2
                }
                break
            }
            this.createSet(options)
          }
        })
      },
      async createSet (options) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StandardManage/CreateStandard`, options)
        if (res.success) {
          this.xy.msgSuc('创建成功')
          switch (this.type) {
            case 1:
              this.level1List.push({
                StandardID: res.data.StandardID,
                StandardName: res.data.StandardName,
                ParentID: options.ParentID,
                Level: options.Level,
                StandardLevelNext: this.type === 3 ? null : []
              })
              break
            case 2:
              this.level2List.push({
                StandardID: res.data.StandardID,
                StandardName: res.data.StandardName,
                ParentID: options.ParentID,
                Level: options.Level,
                StandardLevelNext: this.type === 3 ? null : []
              })
              break
            case 3:
              this.level3List.push({
                StandardID: res.data.StandardID,
                StandardName: res.data.StandardName,
                ParentID: options.ParentID,
                Level: options.Level,
                StandardLevelNext: this.type === 3 ? null : []
              })
              break
          }
          this.indexModal = false
          this.$refs.formValidate.resetFields()
        }
        this.xy.unloading()
      },
      edit (val, type) {
        this.editValidType(type)
        this.editVal = val
        this.formValidateEdit.standardName = val.StandardName
        this.editModal = true
      },
      editValidType (type) {
        this.type = type
        switch (type) {
          case 1:
            this.editTitles = '编辑一级指标'
            this.ruleValidateEdit.standardName[1].max = 10
            this.ruleValidateEdit.standardName[1].message = '指标名称不能超过10字符'
            break
          case 2:
            this.editTitles = '编辑二级指标'
            this.ruleValidateEdit.standardName[1].max = 10
            this.ruleValidateEdit.standardName[1].message = '指标名称不能超过10字符'
            break
          case 3:
            this.editTitles = '编辑三级指标'
            this.ruleValidateEdit.standardName[1].max = 40
            this.ruleValidateEdit.standardName[1].message = '指标名称不能超过40字符'
            break
        }
      },
      watchEditClose (val) {
        if (!val) { this.$refs.formValidateEdit.resetFields() }
      },
      editCancel () {
        this.editModal = false
        this.$refs.formValidateEdit.resetFields()
      },
      editOk () {
        this.$refs.formValidateEdit.validate(valid => {
          if (valid) {
            let options = {
              StandardID: this.editVal.StandardID,
              StandardName: this.formValidateEdit.standardName,
              Level: this.editVal.Level,
              ParentID: this.editVal.ParentID
            }
            this.editSet(options)
          } else {

          }
        })
      },
      async editSet (options) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/StandardManage/UpdateStandard`, options)
        if (res.success) {
          this.xy.msgSuc('修改成功')
          this.editVal.StandardName = this.formValidateEdit.standardName
          this.editModal = false
          this.$refs.formValidateEdit.resetFields()
        }
      },
      del (val, list, type) {
        this.type = type
        this.delList = list
        this.delId = val.StandardID
        this.xy.confirm('删除', '您确认要删除当前指标吗？', this.okDel)
      },
      async okDel () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StandardManage/DeleteStandard?standardId=${this.delId}`)
        if (res.success) {
          this.xy.msgSuc('删除成功')
          for (var i = 0, len = this.delList.length; i < len; i++) {
            if (this.delList[i].StandardID === this.delId) {
              this.delList.splice(i, 1)
              switch (this.type) {
                case 1:
                  this.isId = -1
                  this.isId2 = -1
                  this.isId3 = -1
                  this.level2List = []
                  this.level3List = []
                  break
                case 2:
                  this.isId2 = -1
                  this.isId3 = -1
                  this.level3List = []
                  break
                case 3:
                  this.isId3 = -1
                  break
              }
              return false
            }
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-title, .xy-content-body{
  background: none;
}
.setting-wrap{
  background: #fff;
  .index-level{
    flex:1;
    .index-level-title{
      border-right: 1px solid #fff;
      height:40px;
      line-height: 40px;
      background:rgba(65,150,255,1);
      color:#fff;
      padding:0 20px 0px;
      span{
        margin-left: 10px;
      }
    }
    .index-level-content{
      min-height: 540px;
      max-height: 700px;
      overflow-y: auto;
      border-right: 1px solid #F4F5F7;
      .index-list{
        li{
          cursor: pointer;
          border-bottom: 1px solid #dadada;
          .box{
            margin: 0 30px;
            display: flex;
            align-items: center;
            height: 50px;
            .index-point{
              width:10px;
              height:10px;
              background:rgba(213,213,213,1);
              border-radius:5px;
              margin-right: 10px;
            }
            .index-name{
              flex:1;
            }
            .index-btn{
              visibility: hidden;
              i:nth-child(2){
                margin-left: 30px;
              }
            }

          }
          .box:hover{
            .index-btn{
              visibility: visible;
              i:hover{
                color:#0877FF;
              }
            }
          }
        }
        li.active{
          background:#E7F2FF;
          .box{
            border:none;
            .index-point{
              background:#4196ff;
            }
            .index-name{
              color:#4196ff;
            }
          }

        }
      }
      .null-index{
        margin-top: 150px;
        text-align: center;
        color:rgba(0,0,0,0.25);
        i{
          font-size: 18px;
        }
        span{
          font-size: 16px;
          margin-left: 10px;
        }
      }
    }
    .index-level-content.shadow{
      box-shadow:0px 2px 19px 0px rgba(147,147,147,0.5);
    }
  }
}
</style>
