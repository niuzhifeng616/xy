<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between xy-center">
      <div>
        <Button class="xy-primary"
                @click="updateBtn">导入指标</Button>
      </div>
    </div>
    <div class="xy-content-body">
      <div class="xy-flex setting-wrap">
        <div class="index-level">
          <div class="index-level-title xy-flex xy-between xy-center">
            <div><i class="iconfont">&#xe6f2;</i><span>活动类型</span></div>
          </div>
          <div class="index-level-content">
            <ul class="index-list">
              <li v-for="(item,index) in level1List"
                  :key="index"
                  :class="isId1===item.ActivityCourseTypeID?'active':''">
                <div class="box"
                     @click="level1Btn(item,false)">
                  <div class="index-point"></div>
                  <div class="index-name"
                       :title="item.ActivityCourseTypeName">{{item.ActivityCourseTypeName}}</div>
                </div>
              </li>
            </ul>
            <div v-if="isId1===-1"
                 class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
          </div>
        </div>
        <div class="index-level">
          <div class="index-level-title xy-flex xy-between xy-center">
            <div><i class="iconfont">&#xe6f2;</i><span>一级指标</span></div>
            <Icon type="md-add-circle"
                  size="24"
                  @click="addIndex(level1List,1)" />
          </div>
          <div class="index-level-content">
            <ul class="index-list">
              <li v-for="(item,index) in level2List"
                  :key="index"
                  :class="isId2===item.IndexManagementID?'active':''">
                <div class="box"
                     @click="level2Btn(item)">
                  <div class="index-point"></div>
                  <div class="index-name"
                       :title="item.IndexManagementName">{{item.IndexManagementName}}</div>
                  <div class="index-btn">
                    <i @click="editFun(item,1)"
                       class="iconfont">&#xe6f7;</i>
                    <i @click="del(item,level2List,2)"
                       class="iconfont">&#xe6e1;</i>
                  </div>
                </div>
              </li>
            </ul>
            <div v-if="isId2===-1"
                 class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
          </div>
        </div>
        <div class="index-level">
          <div class="index-level-title xy-flex xy-between xy-center">
            <div><i class="iconfont">&#xe6f2;</i><span>二级指标</span></div>
            <Icon type="md-add-circle"
                  size="24"
                  v-if="this.isId2 > 0"
                  @click="addIndex(level2List,2)" />
          </div>
          <div class="index-level-content">
            <ul class="index-list">
              <li v-for="item in level3List"
                  :key="item.IndexManagementID"
                  :class="isId3===item.IndexManagementID?'active':''">
                <div class="box"
                     @click="level3Btn(item)">
                  <div class="index-point"></div>
                  <div class="index-name"
                       :title="item.IndexManagementName">{{item.IndexManagementName}}</div>
                  <div class="index-btn">
                    <i @click="editFun(item,2)"
                       class="iconfont">&#xe6f7;</i>
                    <i @click="del(item,level3List,3)"
                       class="iconfont">&#xe6e1;</i>
                  </div>
                </div>
              </li>
            </ul>
            <div v-if="isId3===-1"
                 class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
          </div>
        </div>
        <div class="index-level">
          <div class="index-level-title xy-flex xy-between xy-center">
            <div><i class="iconfont">&#xe6f2;</i><span>三级指标</span></div>
            <Icon type="md-add-circle"
                  size="24"
                  v-if="this.isId2 > 0&&this.isId3 > 0"
                  @click="addIndex(level4List,3)" />
          </div>
          <div class="index-level-content">
            <ul class="index-list">
              <li v-for="(item,index) in level4List"
                  :key="index">
                <div class="box">
                  <div class="index-point"></div>
                  <div class="index-name"
                       :title="item.IndexManagementName">{{item.IndexManagementName}}</div>
                  <div class="index-btn">
                    <i @click="editFun(item,3)"
                       class="iconfont">&#xe6f7;</i>
                    <i @click="del(item,level4List,4)"
                       class="iconfont">&#xe6e1;</i>
                  </div>
                </div>
              </li>
            </ul>
            <div v-if="level4List.length<1"
                 class="null-index"><i class="iconfont">&#xe6e7;</i><span>暂无指标</span></div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="indexModal"
           :title="titles"
           :transfer="false"
           :loading="loading"
           :mask-closable="false"
           @on-visible-change="watchClose">
      <Form ref="formValidate"
            label-position='top'
            :model="formValidate"
            :rules="ruleValidate"
            @submit.native.prevent>
        <FormItem label="活动类型"
                  prop="formID"
                  v-if="isFirst">
          <Select v-model="formValidate.formID">
            <Option v-for="formSelect in formSelectData"
                    :value="formSelect.ActivityCourseTypeID"
                    :key="formSelect.ActivityCourseTypeID"
                    v-cloak>{{ formSelect.ActivityCourseTypeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="指标名称"
                  label-for="addName"
                  prop="standardName">
          <Input v-model.trim="formValidate.standardName"
                 element-id='addName'
                 clearable />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="cancel">取消</Button>
        <Button class="xy-modal-primary"
                @click="ok"
                shape="circle">确定</Button>
      </div>
    </Modal>
    <Modal v-model="editModal"
           :title="editTitles"
           :transfer="false"
           :loading="loading"
           :mask-closable="false"
           @on-visible-change="watchEditClose">
      <Form ref="formValidateEdit"
            :model="formValidateEdit"
            :rules="ruleValidateEdit"
            label-position='top'
            @submit.native.prevent>
        <FormItem label="活动类型"
                  prop="formID"
                  v-if="isFirst">
          <Select v-model="formValidateEdit.formID">
            <Option v-for="formSelect in formSelectData"
                    :value="formSelect.ActivityCourseTypeID"
                    :key="formSelect.ActivityCourseTypeID"
                    v-cloak>{{ formSelect.ActivityCourseTypeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="指标名称"
                  label-for="editStandardName"
                  prop="standardName">
          <Input v-model.trim="formValidateEdit.standardName"
                 element-id='editStandardName'
                 clearable />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="xy-modal-close"
                @click="editCancel">取消</Button>
        <Button class="xy-modal-primary"
                @click="editOk"
                shape="circle">确定</Button>
      </div>
    </Modal>
    <XyUpfile ref="upfile"
              :modalTitle="upload.upLoadTitle"
              :describeData="upload.tipData"
              :fileFormt="upload.formtData"
              :importPath="upload.upUrl"
              :paramsData="upload.upParams"
              :templateUrl="upload.templateUrl"
              :errorUrl="upload.errorUrl"
              @successLoad="refresh">
    </XyUpfile>
  </div>
</template>
<script>
  import XyUpfile from '@/components/upFile/XyUpfile.vue'
  export default {
    name: 'acMarkManagement',
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
        isFirst: false, // 是否创建一级指标
        titles: '创建一级指标',
        editTitles: '编辑一级指标',
        formSelectData: [],
        formValidate: {
          formID: 0,
          standardName: ''
        },
        ruleValidate: {
          formID: [{
            type: 'number',
            required: true,
            message: '请选择活动类型',
            trigger: 'change'
          }],
          standardName: [
            { required: true, message: '指标名称不能为空', trigger: 'blur' },
            { type: 'string', max: 10, message: '指标名称不能超过10字符', trigger: 'blur' }
          ]
        },
        formValidateEdit: {
          formID: 0,
          standardName: ''
        },
        ruleValidateEdit: {
          formID: [{
            type: 'number',
            required: true,
            message: '请选择活动类型',
            trigger: 'change'
          }],
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
        level4List: [],
        isId1: -1,
        isId2: -1,
        isId3: -1,
        isId4: -1,
        editVal: {},
        delId: -1,
        delList: [],
        addList: []
      }
    },
    created () {
      this.GetActivityCourseType()
    },
    methods: {
      refresh () {
        this.isId1 = this.level1List[0].ActivityCourseTypeID
        this.getLevelList()
      },
      updateBtn () {
        this.$refs['upfile'].modalImport = true
        this.upload = {
          upLoadTitle: '导入指标',
          tipData: [],
          formtData: ['xlsx', 'xls'],
          upUrl: `${this.$store.state.apiPath}/api/ActivityCourseIndexManagement/Import`,
          upParams: {},
          templateUrl: `${this.$store.state.apiPath}/api/ActivityCourseIndexManagement/DownloadTemplateImport`,
          errorUrl: `${this.$store.state.apiPath}/api/ActivityCourseIndexManagement/DownloadExceptionImport`
        }
      },
      async GetActivityCourseType () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseType/GetActivityCourseType`, null, true)
        this.xy.unloading()
        if (res.success) {
          this.formSelectData = res.data
          this.level1List = res.data
          this.isId1 = this.level1List[0].ActivityCourseTypeID
          this.getLevelList()
        }
      },
      async getLevelList () {
        this.xy.loading()
        let params = {
          activityCourseTypeID: this.isId1
        }
        this.level2List = []
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ActivityCourseIndexManagement/GetActivityCourseIndexManagement`, params)
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            this.level2List = res.data.map(item => {
              if (!item.Children) {
                item.Children = []
              } else if (item.Children.length > 0) {
                item.Children.map(citem => {
                  if (!citem.Children) {
                    citem.Children = []
                    return citem
                  }
                })
              }
              return item
            })
            this.isId2 = res.data[0].IndexManagementID
            if (this.level2List[0].Children.length > 0) {
              this.level3List = this.level2List[0].Children.concat([])
              this.isId3 = this.level3List[0].IndexManagementID
              if (this.level3List[0].Children.length > 0) {
                this.level4List = this.level3List[0].Children.concat([])
                this.isId4 = this.level4List[0].IndexManagementID
              } else {
                this.level4List = []
                this.isId4 = -1
              }
            } else {
              this.level3List = []
              this.isId3 = -1
              this.level4List = []
              this.isId4 = -1
            }
          }
        }
      },
      level1Btn (val, isAdd) { // 单击一级指标
        this.isId1 = val.ActivityCourseTypeID
        this.level2List = []
        this.isId2 = -1
        this.level3List = []
        this.isId3 = -1
        this.level4List = []
        this.isId4 = -1
        this.getLevelList()
      },
      level2Btn (val) { // 单击二级指标
        this.isId2 = val.IndexManagementID
        if (val.Children && val.Children.length > 0) {
          this.level3List = val.Children.concat([])
          this.isId3 = this.level3List[0].IndexManagementID
          if (this.level3List[0].Children.length > 0) {
            this.level4List = this.level3List[0].Children.concat([])
            this.isId4 = this.level4List[0].IndexManagementID
          } else {
            this.level4List = []
            this.isId4 = -1
          }
        } else {
          this.level3List = []
          this.isId3 = -1
          this.level4List = []
          this.isId4 = -1
        }
      },
      level3Btn (val) { // 单击三级指标
        this.isId3 = val.IndexManagementID
        if (val.Children.length > 0) {
          this.level4List = val.Children
          this.isId4 = this.level4List[0].IndexManagementID
        } else {
          this.level4List = []
          this.isId4 = -1
        }
      },
      geSetting () {
        this.$store.commit('common/getThreeMenuName', '指标设置')
        this.$router.push({
          path: '/xyHome/classRoom/indexSetting',
          query: this.$store.state.common.menuInfo
        })
      },
      // 创建指标
      addIndex (val, type) {
        this.addList = val
        this.type = type
        if (type === 1) {
          this.isFirst = true // 是否创建一级指标
        } else {
          this.isFirst = false
        }
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
            let status = false
            switch (this.type) {
              case 1:
                options = {
                  ActivityCourseTypeID: this.formValidate.formID,
                  IndexManagementName: this.formValidate.standardName,
                  Level: 1,
                  ParentID: 0,
                  Children: []
                }
                break
              case 2:
                options = {
                  ActivityCourseTypeID: this.isId1,
                  IndexManagementName: this.formValidate.standardName,
                  Level: 2,
                  ParentID: this.isId2,
                  Children: []
                }
                break
              case 3:
                options = {
                  ActivityCourseTypeID: this.isId1,
                  IndexManagementName: this.formValidate.standardName,
                  Level: 3,
                  ParentID: this.isId3,
                  Children: []
                }
                break
            }
            this[`level${this.type + 1}List`].filter(item => {
              if (item.IndexManagementName === options.IndexManagementName) {
                status = true
              }
            })
            if (!status) {
              this.createSet(options)
            } else {
              let arr = ['', '一', '二', '三']
              this.xy.msgW(`已存在当前${arr[this.type]}级指标。`)
            }
          }
        })
      },
      async createSet (options) {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ActivityCourseIndexManagement/CreateIndexManagement`, options)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('创建成功。')
          this.isId1 = this.level1List[0].ActivityCourseTypeID
          this.getLevelList()
          this.indexModal = false
          this.$refs.formValidate.resetFields()
        }
      },
      // 编辑指标
      editFun (val, type) {
        this.editValidType(type)
        this.editVal = val
        if (type === 1) {
          this.isFirst = true // 是否编辑一级指标
          this.formValidateEdit.formID = val.ActivityCourseTypeID
        } else {
          this.isFirst = false
        }
        this.formValidateEdit.standardName = val.IndexManagementName
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
              ActivityCourseTypeID: this.type > 1 ? this.isId1 : this.formValidateEdit.formID,
              IndexManagementID: this.editVal.IndexManagementID,
              IndexManagementName: this.formValidateEdit.standardName,
              Level: this.editVal.Level,
              ParentID: this.type === 1 ? 0 : this.editVal.ParentID,
              Children: []
            }
            let status = false
            this[`level${this.type + 1}List`].filter(item => {
              if (item.IndexManagementName === options.IndexManagementName && options.IndexManagementID !== item.IndexManagementID) {
                status = true
              }
            })
            if (!status) {
              this.editSet(options)
            } else {
              let arr = ['', '一', '二', '三']
              this.xy.msgW(`已存在当前${arr[this.type]}级指标。`)
            }
          }
        })
      },
      async editSet (options) {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ActivityCourseIndexManagement/EditIndexManagement`, options)
        if (res.success) {
          this.xy.msgSuc('编辑成功。')
          // if (this.type === 1) {
          //   this.isId1 = this.formValidateEdit.formID
          //   this.getLevelList()
          // }
          this.editVal.IndexManagementName = this.formValidateEdit.standardName
          this.editModal = false
          this.$refs.formValidateEdit.resetFields()
          this.isId1 = this.level1List[0].ActivityCourseTypeID
          this.getLevelList()
        }
      },
      // 删除指标
      del (val, list, type) {
        this.type = type
        this.delList = list
        this.delId = val.IndexManagementID
        this.xy.confirm('删除', '您确认要删除当前指标吗？', this.okDel)
      },
      async okDel () {
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ActivityCourseIndexManagement/DeleteIndexManagement?indexManagementID=${this.delId}`, {
          IndexManagementID: this.delId
        })
        if (res.success) {
          this.xy.msgSuc('删除成功。')
          this.level2List = []
          this.isId2 = -1
          this.level3List = []
          this.isId3 = -1
          this.level4List = []
          this.isId4 = -1
          this.isId1 = this.level1List[0].ActivityCourseTypeID
          this.getLevelList()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.xy-content-title,
.xy-content-body {
  background: none;
}
.setting-wrap {
  background: #fff;
  .index-level {
    flex: 1;
    .index-level-title {
      border-right: 1px solid #fff;
      height: 40px;
      line-height: 40px;
      background: rgba(65, 150, 255, 1);
      color: #fff;
      padding: 0 20px 0px;
      span {
        margin-left: 10px;
      }
    }
    .index-level-content {
      min-height: 540px;
      max-height: 700px;
      overflow-y: auto;
      border-right: 1px solid #f4f5f7;
      .index-list {
        li {
          cursor: pointer;
          border-bottom: 1px solid #dadada;
          .box {
            margin: 0 30px;
            display: flex;
            align-items: center;
            height: 50px;
            .index-point {
              width: 10px;
              height: 10px;
              background: rgba(213, 213, 213, 1);
              border-radius: 5px;
              margin-right: 10px;
            }
            .index-name {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 300px;
            }
            .index-btn {
              visibility: hidden;
              i:nth-child(2) {
                margin-left: 30px;
              }
            }
          }
          .box:hover {
            .index-btn {
              visibility: visible;
              i:hover {
                color: #0877ff;
              }
            }
          }
        }
        li.active {
          background: #e7f2ff;
          .box {
            border: none;
            .index-point {
              background: #4196ff;
            }
            .index-name {
              color: #4196ff;
            }
          }
        }
      }
      .null-index {
        margin-top: 150px;
        text-align: center;
        color: rgba(0, 0, 0, 0.25);
        i {
          font-size: 18px;
        }
        span {
          font-size: 16px;
          margin-left: 10px;
        }
      }
    }
    .index-level-content.shadow {
      box-shadow: 0px 2px 19px 0px rgba(147, 147, 147, 0.5);
    }
  }
}
</style>
