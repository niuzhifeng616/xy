<template>
  <div>
    <a-modal title="选择互斥学生"
              width="800px"
              :maskClosable="false"
              :visible="isShow"
              @cancel="cancelFun"
              :confirm-loading="modalLoading">
      <a-spin :spinning="spinLoading"
              tip="加载中">
        <a-row class="xy-flex">
          <div class="left">
            <div class='input-box'>
              <a-input-search v-model.trim="keyWord" placeholder="请输入用户名/学籍号/姓名" allowClear @search='searchFun' />
            </div>
            <a-tree show-icon
                v-if='!isSearching && newList.length > 0'
                v-model="checkedKeys"
                checkable
                :disabled="treeDisabled"
                :expanded-keys="expandedKeys"
                :auto-expand-parent="autoExpandParent"
                :tree-data="newList"
                :checked-keys='checkedKeys'
                @check="onCheck"
                @expand="onExpand"
                blockNode>
              <img v-if='node.image' :src="node.image" class="head-icon" slot-scope="node" slot="iconRender" />
              <span v-else class="head-icon" :class="!node.sex?'woman':''" slot="iconRender" slot-scope="node">
                {{xy.showName(node.title)}}
              </span>
              <template slot="titleRender" slot-scope="node">
                <span>{{node.title}}</span>
              </template>
            </a-tree>
            <div class="nodata" v-if='newList.length == 0 && !isSearching'>未搜索到相关结果。</div>
          </div>
          <div class="right">
            <div class="count-room" v-if='checkAllList.length>0'>已选:{{checkAllList.length}}人</div>
            <div class="nodata" style="margin-top:46px" v-else>您还未选择任何学生，请选择学生。</div>
            <div class="room-overflow" v-if='checkAllList.length>0'>
              <div v-for='item in checkAllList' :key='item.id' class="room">
                <div>
                  <img v-if='item.image' :src="item.image" class="head-icon">
                  <span v-else class="head-icon" :class="!item.sex?'woman':''">{{xy.showName(item.title)}}</span>
                  <span class="tag" :title="item.title">{{item.title}}</span>
                </div>
                <i class="iconfont del-btn" @click="delFun(item)">&#xe6f3;</i>
              </div>
            </div>
          </div>
        </a-row>
      </a-spin>
      <div slot='footer'>
        <Button class='xy-modal-close' @click='cancelFun'>取消</Button>
        <Button class='xy-modal-primary' shape='circle' @click='confirm'>确定</Button>
      </div>
    </a-modal>
  </div>
</template>
<script>
  export default {
    name: 'SelectStudent',
    props: {
      isShow: {
        type: Boolean,
        required: true
      },
      // 已经选中的班级
      selectClassIDS: {
        type: Array,
        required: true
      },
      // 已经选中的学生
      selectMembers: {
        type: Array,
        required: false
      }
    },
    data () {
      return {
        smartDivideStepsHeader: {},
        modalLoading: false,
        spinLoading: false,

        isSearching: false,
        newList: [], // tree数据
        checkedKeys: [], // 选中节点
        expandedKeys: [], // 展开的树节点 节点id组合
        autoExpandParent: true, // 是否自动展开父节点
        keyWord: '',
        selectStudent: [],
        treeDisabled: false,

        // 右侧选中的学生
        checkAllList: []
      }
    },
    watch: {
      isShow (val) {
        if (val) {
          this.isSearching = false
          this.expandedKeys = []
          this.autoExpandParent = true
          this.checkedKeys = []
          this.keyWord = ''
          this.checkAllList = []
          if (this.selectMembers.length > 0) {
            let arrID = []
            this.selectMembers.forEach((item, index) => {
              let arr = item.split('、')
              arr.forEach((item1, index1) => {
                arrID.push(item1)
              })
            })
            this.selectStudent = arrID.map(Number)
          } else {
            this.selectStudent = []
          }
          this.addMutex() // tree数据
        }
      },
      checkAllList (newVal) {
        if (newVal.length >= 2) {
          this.treeDisabled = true
        } else {
          this.treeDisabled = false
        }
      }
    },
    created () {
      this.smartDivideStepsHeader = this.$parent.$parent
    },
    methods: {
      // 添加互斥学生（查询已添加学生）
      async addMutex () {
        if (this.smartDivideStepsHeader.isOperation !== 0) {
          return false
        }
        this.newList = []
        // this.selectStudent = []
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/SelectDisciplineDivideClass/GetCcollectionStudentInfo`, {
          DivideClassID: this.smartDivideStepsHeader.divideClassID,
          DivideClassGenerateCollectionIDS: this.selectClassIDS,
          Search: this.keyWord
        })
        if (res.success) {
          let respon = res.data
          for (var i = 0; i < respon.length; i++) {
            if (this.keyWord !== '') {
              this.expandedKeys.push(i)
            }
            this.newList.push({
              key: i,
              title: respon[i].ClassName,
              level: 0,
              checkable: false,
              children: []
            })
            if (respon[i].StudentLimitation.length > 0) {
              for (var c = 0; c < respon[i].StudentLimitation.length; c++) {
                if (this.selectStudent.indexOf(respon[i].StudentLimitation[c].StudentID) === -1) { // 已经添加过的学生过滤不显示
                  this.newList[i].children.push({
                    key: respon[i].StudentLimitation[c].StudentID,
                    title: respon[i].StudentLimitation[c].FullName,
                    image: respon[i].StudentLimitation[c].Icon,
                    sex: respon[i].StudentLimitation[c].Sex,
                    IsComplete: respon[i].StudentLimitation[c].IsComplete,
                    CollectionStudentID: respon[i].StudentLimitation[c].CollectionStudentID,
                    level: 1,
                    // disabled: true,
                    // disableCheckbox: true,
                    scopedSlots: { title: 'titleRender', icon: 'iconRender' }
                  })
                }
              }
            }
          }
        }
        this.xy.unloading()
      },
      // 搜索
      searchFun (val) {
        this.keyWord = val
        this.addMutex()
      },
      // 删除右侧学生
      delFun (val) {
        let index = this.checkAllList.map(item => { return item.key }).indexOf(val.key)
        if (index !== -1) {
          this.checkAllList.splice(index, 1)
        }
        let index1 = this.checkedKeys.map(item => { return item }).indexOf(val.key)
        if (index1 !== -1) {
          this.checkedKeys.splice(index1, 1)
        }
      },
      // 展开收起
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      // 选中的节点
      onCheck (checkedKeys, info) {
        // console.log(checkedKeys)
        // console.log(info)
        this.checkedKeys = checkedKeys
        // this.checkAllList //右侧展示 传值到上一组件
        if (info.checked) { // 选中的是学生
          this.checkAllList.push(info.node.dataRef)
        } else {
          let index = this.checkAllList.map(item => { return item.key }).indexOf(info.node.dataRef.key)
          if (index !== -1) {
            this.checkAllList.splice(index, 1)
          }
        }
      },
      // 弹窗
      cancelFun () {
        this.$emit('select-cancel')
      },
      confirm () {
        let arr = []
        for (let i = 0; i < this.checkAllList.length; i++) {
          arr.push({
            name: this.checkAllList[i].title,
            id: this.checkAllList[i].key
          })
        }
        if (arr.length === 0) {
          this.xy.msgError('请选择互斥的学生。')
          return
        }
        if (arr.length === 1) {
          this.xy.msgError('至少选择两个学生。')
          return
        }
        this.$emit('select-confirm', arr)
      }
    }
  }
</script>
<style lang="less" scoped>
// 选择学生/教师
.head-icon {
  display: inline-block;
  vertical-align: middle;
  width: 29px;
  height: 29px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #4196ff;
  text-align: center;
  font-size: 12px;
  line-height: 29px;
  color: #fff;
  margin-right: 5px;
  min-width: 29px;
}

.woman {
  background-color: #FF81AC !important;
}

 // 选择教室的icon
.icon-box {
  display: inline-block;
  color: #fff;
  width: 25px;
  height: 25px;
  background: #4db6ac;
  border-radius: 50%;
  text-align: center;
  line-height: 25px;
  .iconfont {
    font-size: 12px;
  }
}
.input-box {
  padding-bottom: 15px;
  width: calc(100% - 24px);
}
/deep/.ant-modal {
    min-width: 500px;
    .ant-modal-body {
        padding-top: 0;
        padding-bottom: 0;
        padding-right: 0;
        .left {
            width: 50%;
            border-right: 1px solid #e8e8e8;
            padding-top: 15px;
          .ant-tree {
              min-height: 525px;
              max-height: 525px;
              overflow: auto;
              .ant-tree-node-content-wrapper {
                  // width: 29px;
                  height: 29px;
                  line-height: 29px;
                  &:hover {
                    background-color: #f5f5f5;
                  }
              }
              .ant-tree-title {
                  margin-left: 10px;
              }
              .ant-tree-switcher {
                  text-align: left;
              }
          }
          .loading-tree {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .right {
            padding-top: 15px;
            padding-right: 0;
            width: 50%;
            .tag {
                margin-left: 10px;
                max-width: 80%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                display: inline-block;
            }
            .room-overflow {
                min-height: 525px;
                max-height: 525px;
                overflow: auto;
            }
            .count-room {
                font-size: 14px;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.45);
                line-height: 32px;
                padding-left: 24px;
                padding-bottom: 15px;
            }
            .right-tip {
                margin-top: 46px;
            }
            .room {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 7.5px 0 7.5px 24px;
                &:hover {
                    background: #f5f5f5;
                }
                div {
                    display: flex;
                    align-items: center;
                    width: 80%;
                }
                .del-btn {
                    width: 34px;
                    color: #CFCFCF;
                    cursor: pointer;
                }
            }
        }
        .nodata {
            text-align: center;
            line-height: 525px;
            height: 525px
        }
        .loading-box {
            height: 525px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>
