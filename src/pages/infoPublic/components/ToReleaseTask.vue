<template>
  <div>
    <!-- 发布任务选择班牌 -->
    <modal v-model="taskCreate"
          v-cloak
          :styles="{top:'20px',width:'1000px'}"
          :transfer="false"
          title="发布到班牌"
          :loading="loading"
          :mask-closable="false">
      <i-form ref="formValidateTaskOK" :model="formValidateTaskOK" :rules="ruleValidateTaskOK">
        <form-item label="任务名称" prop="publicName">
            <i-input v-model="formValidateTaskOK.publicName" clearable></i-input>
        </form-item>
        <row>
          <i-col span="6" style="height: 352px;overflow:auto;">
            <tree :data="getTreeList" @on-select-change="selectTree"></tree>
          </i-col>
          <i-col span="9" style="height: 352px;overflow:auto;padding:0px 10px;border-right: 1px solid #ccc;">
            <div>
              <checkbox v-for="(item, index) in tremianlArr" :disabled="item.disabled" :key="index" size="large" v-model="item.checked" @on-change="changeCheckbox(item)">{{item.ClassTerminalName}}</checkbox>
            </div>
          </i-col>
          <i-col span="9" style="padding:0px 10px;">
            <div style="padding-bottom:10px;margin-bottom: 5px;border-bottom:1px solid #eee;">已选<b>{{classTerminalIDs.length}}</b>个班牌</div>
            <div>
              <tag type="border" color="primary" v-for="(item, index) in classTerminalIDs" :key="index" :name="item.ClassTerminalName" closable @on-close="handleClose(item)">{{item.ClassTerminalName}}</tag>
            </div>
          </i-col>
        </row>
      </i-form>
      <div slot="footer">
        <Button class="xy-modal-close" @click="publicCancel">取消</Button>
        <Button class="xy-modal-primary" shape="circle" @click="submitPublic">发布</Button>
      </div>
    </modal>
  </div>
</template>
<script>
  export default {
    name: 'ToReleaseTask',
    data () {
      return {
        // 新建发布任务---开始
        // taskCreate: false,
        // publicItem: {},
        // taskList: [],
        loading: true,
        formValidateTaskOK: {
          publicName: ''
        },
        ruleValidateTaskOK: {
          publicName: [
            { required: true, message: '任务名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '任务名称不能超过20个字', trigger: 'blur' }
          ]
        },
        getTreeList: [
          {
            title: '全部分组',
            expand: true,
            ParentID: -1,
            ClassTerminalGroupID: 0,
            selected: true,
            TreminalS: [],
            children: []
          }
        ],
        tremianlArr: [],
        classTerminalIDs: [],
        apiPath: '',
        saveDefaultdata: []
      }
    },
    props: {
      taskCreate: {
        type: Boolean,
        default: false
      },
      publicItem: {
        type: Object
      },
      taskList: {
        type: Array
      },
      screenModes: {
        type: Number
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getTree()
    },
    watch: {
      // 设置全部分组数据
      saveDefaultdata (newValue) {
        this.tremianlArr = []
        this.getTreeList[0].TreminalS = []
        for (var i = 0; i < newValue.length; i++) {
          for (var j = 0; j < newValue[i].length; j++) {
            this.getTreeList[0].TreminalS.push(newValue[i][j])
            // 默认显示全部班牌
            // 屏保管理判断横版下竖版置灰竖版下横置灰
            if (this.screenModes !== 'undefined' && this.screenModes === 0 && newValue[i][j].ScreenMode === 1) {
              newValue[i][j].disabled = true
            } else if (this.screenModes !== 'undefined' && this.screenModes === 1 && newValue[i][j].ScreenMode === 0) {
              newValue[i][j].disabled = true
            }
            this.tremianlArr.push(newValue[i][j])
          }
        }
        for (let j = 0; j < this.classTerminalIDs.length; j++) {
          let all1 = this.tremianlArr
            .map(function (val) {
              return val.ClassTerminalId
            })
            .indexOf(this.classTerminalIDs[j].ClassTerminalId)
          if (all1 !== -1) {
            this.tremianlArr[all1].checked = true
          }
        }
      },
      // 发布到班牌模态框显示时
      taskCreate: {
        handler (newValue) {
          if (newValue) {
            this.saveDefaultdata = []
            this.getTreeList[0].selected = true
            this.getTree()
          } else {
            this.formValidateTaskOK.publicName = ''
            this.tremianlArr = [] // 中间空
            this.classTerminalIDs = [] // 右侧空
          }
        },
        immediate: true
      }
    },
    mounted () {},
    methods: {
      // this.xy.loading()
      //     let res = await this.xy.get(
      //       this.apiPath + `/api/Resource/GetPage`
      //     )
      //     this.xy.unloading()
      //     if (res.success) {
      //     } else {
      //    this.xy.msgError(res.msg)
      //     }
      // 发布到指定班牌---新建发布任务---开始
      // 打开发布任务框
      // 获取班牌分组树形结构
      async getTree () {
        this.xy.loading()
        let res = await this.xy.get(
          this.apiPath + `/api/ClassTerminalGroup/GetTreminalTree`
        )
        this.xy.unloading()
        if (res.success) {
          if (res.data.length > 0) {
            let allData = res.data
            this.getTreeList[0].children = allData
            this.setTreeData(allData)
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      setTreeData (data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].TreminalS.length > 0) {
            this.saveDefaultdata.push(data[i].TreminalS)
          }
          if (data[i].children.length > 0) {
            this.setTreeData(data[i].children)
          }
        }
      },
      // 点击左侧班牌分组树形结构，显示中间班牌
      selectTree (val) {
        this.tremianlArr = []
        if (val[0].TreminalS.length > 0) {
          this.tremianlArr = val[0].TreminalS
          this.tremianlArr.map(function (val) {
            val.checked = false
            return val
          })
          for (var j = 0; j < this.classTerminalIDs.length; j++) {
            var all1 = this.tremianlArr.map(function (val) {
              return val.ClassTerminalId
            }).indexOf(this.classTerminalIDs[j].ClassTerminalId)
            if (all1 !== -1) {
              this.tremianlArr[all1].checked = true
            };
          };
        };
      },

      // 点击中间班牌 显示右侧已选中班牌
      changeCheckbox (vals) {
        if (vals.checked) {
          this.classTerminalIDs.push(vals)
        } else {
          for (var i = 0; i < this.classTerminalIDs.length; i++) {
            if (this.classTerminalIDs[i].ClassTerminalId === vals.ClassTerminalId) {
              this.classTerminalIDs.splice(i, 1)
            };
          };
        };
      },

      // 删除右侧已选中班牌
      handleClose (item) {
        for (var i = 0; i < this.classTerminalIDs.length; i++) {
          if (this.classTerminalIDs[i].ClassTerminalId === item.ClassTerminalId) {
            for (var j = 0; j < this.tremianlArr.length; j++) {
              if (this.tremianlArr[j].ClassTerminalId === item.ClassTerminalId) {
                this.tremianlArr[j].checked = false
              };
            };
            this.classTerminalIDs.splice(i, 1)
          };
        };
      },

      // 确定提交
      async submitPublic () {
        var that = this
        var ids = []
        console.log(this.classTerminalIDs)
        console.log(this.publicItem)
        console.log(this.taskList)
        if (this.classTerminalIDs.length > 0) {
          for (var i = 0; i < this.classTerminalIDs.length; i++) {
            ids.push(this.classTerminalIDs[i].ClassTerminalId)
          };
          this.$refs.formValidateTaskOK.validate(function (valid) {
            if (!valid) {
              return that.changeLoading()
            } else {
              that.taskCreate = false
              that.CreatePublicTask(ids)
              that.changeLoading()
            }
          })
        } else {
          this.xy.msgError('请勾选班牌后再发布.')
          this.changeLoading()
        };
      },
      async CreatePublicTask (ids) {
        this.xy.loading()
        let res = await this.xy.post(
          this.apiPath + `/api/PublicTask/CreatePublicTask`, {
            PublishTaskName: $.trim(this.formValidateTaskOK.publicName),
            PublishTaskType: this.publicItem.resourceType, // 资源类型10
            ClassTerminalID: ids, // 班牌ID
            ResourceID: this.taskList // 资源ID
          }
        )
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc('操作成功,可去发布任务记录查看发布详情。')
          this.formValidateTaskOK.publicName = ''
          this.tremianlArr = [] // 中间空
          this.classTerminalIDs = [] // 右侧空
          // this.taskCreate = false
          // this.taskList = []
          // this.isRelease = true
          this.$emit('changeDate')
        } else {
          this.xy.msgError(res.msg)
        }
      },
      publicCancel () {
        this.$emit('closeTaskModal', false)
      }
      // 发布到指定班牌---新建发布任务---结束
    }
  }
</script>
<style lang="less" scoped>
</style>
