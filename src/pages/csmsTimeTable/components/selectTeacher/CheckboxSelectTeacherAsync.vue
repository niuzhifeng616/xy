<template>
  <div>
    <a-modal :title="modalTitle"
             width='50%'
             :maskClosable="false"
             :visible="isShow"
             @cancel="cancel"
             :confirm-loading="confirmLoading">
      <a-row class="modal-content"
             v-if='newList.length>0'>
        <div class="left">
          <a-input-search style="margin-bottom: 8px"
                          placeholder="教师名称"
                          @change="onChange" />
          <a-tree show-icon
                  :load-data="newLoadData"
                  :tree-data="newList"
                  checkable
                  checkStrictly
                  :checked-keys='checkedNode'
                  @check="onCheck"
                  @expand="onExpand"
                  :expanded-keys="expandedKeys"
                  :auto-expand-parent="autoExpandParent"
                  blockNode>
            <span class="head-icon"
                  slot="icon"
                  slot-scope="node">
              {{xy.showName(node.title)}}
            </span>
            <template slot="title"
                      slot-scope="node">
              <span v-if="node.title.indexOf(searchValue) > -1&&searchValue.length>0"
                    style="color: #f50"
                    :title="node.title">
                {{ node.title.length>20?node.title.substr(0,20)+'...':node.title }}
              </span>
              <span v-else
                    :title="node.title">{{ node.title.length>20?node.title.substr(0,20)+'...':node.title }}</span>
            </template>
          </a-tree>
        </div>
        <div class="right">
          <div class="count-room"
               v-if='checkAllList.length>0'>已选:{{checkAllList.length}}人</div>
          <div class="nodata"
               v-else>暂无数据，请选择教师。</div>
          <div class="room-overflow">
            <div v-for='item in checkAllList'
                 :key='item.id'
                 class="room">
              <div>
                <span class="head-icon">{{xy.showName(item.title)}}</span>

                <span class="tag"
                      :title="item.title">{{item.title.length>20?item.title.substr(0,20)+'...':item.title}}</span>
              </div>
              <a-icon type="close"
                      style="font-size: 16px;color:#cfcfcf"
                      @click="delFun(item)" />
            </div>
          </div>
        </div>
      </a-row>
      <div class="loading-box"
           v-if="modalLoading">
        <a-spin tip="加载中" />
      </div>
      <div slot='footer'>
        <Button class='xy-modal-close'
                @click='cancel'>取消</Button>
        <Button class='xy-modal-primary'
                shape='circle'
                @click='confirm'>确定</Button>

      </div>
    </a-modal>
  </div>
</template>
<script>
  export default {
    name: 'SelectTeacher',
    props: {
      modalTitle: {
        type: String,
        default: '选择教师'
      },
      isShow: {
        type: Boolean,
        required: true
      },
      // 已经选中的教师
      selectMembers: {
        type: Array,
        required: false
      },
      classTableID: { // 校区id
        type: Number,
        default: 345
      }
    },
    data () {
      return {
        newList: [],
        dataList: [],
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        // 弹窗
        modalLoading: false,
        confirmLoading: false,
        checkNode: [],
        // 右侧选中的教师
        checkAllList: [],
        checkedNode: []
      }
    },
    watch: {
      isShow (val) {
        if (val) {
          this.checkAllList = []
          this.autoExpandParent = true
          this.expandedKeys = []
          this.checkedNode = []
          this.selectTeacher = this.selectMembers
          this.openAddModal()
        }
      }
    },
    methods: {
      cancel () {
        this.$emit('select-cancel')
      },
      confirm () {
        if (this.checkAllList.length === 0) {
          this.xy.msgError('请选择教师')
          return
        }
        this.$emit('select-confirm', this.checkAllList)
      },
      async openAddModal () {
        this.newList = []
        let params = {
          id: 0,
          type: ''
        }
        this.modalLoading = true
        let res = await this.xy.get(this.xyApi + '/xy/comm/GetNodeList', params)
        this.modalLoading = false
        if (res.success) {
          for (var i = 0; i < 1; i++) {
            let obj = {
              title: res.data[i].label,
              id: res.data[i].value,
              key: res.data[i].value,
              nodetype: res.data[i].nodetype,
              ischild: res.data[i].ischild,
              scopedSlots: { title: 'title' },
              children: [],
              checked: false
            }
            this.newList.push(obj)
          }
          this.generateList(this.newList)
          // 根据选择的反选
          if (this.selectTeacher.length > 0) {
            this.checkAllList = this.selectTeacher
          }
        }
      },
      async newLoadData (treeNode) { // 获取组织节点
        let dataRef = treeNode.dataRef
        if (!dataRef.ischild || dataRef.id === 0) {
          this.getTeachers(dataRef)
          return
        }
        let params = {
          id: dataRef.id,
          type: dataRef.nodetype
        }
        let rs = await this.xy.get(this.xyApi + '/xy/Comm/GetNodeList', params)
        let data = []
        if (rs.data.length > 0) {
          rs.data.forEach((val, index) => {
            let obj = {
              parentId: dataRef.id,
              parentTitle: dataRef.title,
              parentNodetype: dataRef.nodetype,
              id: val.value,
              title: val.label,
              nodetype: val.nodetype,
              key: val.value,
              ischild: val.ischild,
              scopedSlots: { title: 'title' },
              children: [],
              checked: false
            }
            if (dataRef.id !== val.value) {
              data.push(obj)
            }
          })
        }
        dataRef.children = data
        this.newList = [...this.newList]
        if (dataRef.checked) {
          this.onCheck('', { node: { dataRef: dataRef }, checked: dataRef.checked })
        }
        this.generateList(this.newList)
      },
      async getTeachers (dataRef) {
        let params = {
          orgID: dataRef.id,
          teacherIDs: '',
          type: dataRef.nodetype
        }
        let ids = []
        if (this.selectTeacher.length > 0) {
          ids = this.selectTeacher.map(item => item.id)
        }
        let rs = await this.xy.get(this.xyApi + '/xy/comm/GetNodeListHasmember', params)
        let data = []
        if (rs.success) {
          if (rs.data.length > 0) {
            for (let i = 0; i < rs.data.length; i++) {
              if (rs.data[i].memberlist.length > 0) {
                for (var j = 0; j < rs.data[i].memberlist.length; j++) {
                  let obj = {
                    parentId: dataRef.id,
                    parentTitle: dataRef.title,
                    parentNodetype: dataRef.nodetype,
                    id: rs.data[i].memberlist[j].UserID,
                    title: rs.data[i].memberlist[j].FullName,
                    nodetype: '',
                    key: rs.data[i].memberlist[j].UserID,
                    scopedSlots: { title: 'title', icon: 'icon' },
                    isLeaf: true,
                    children: [],
                    checked: dataRef.checked ? true : ids.indexOf(rs.data[i].memberlist[j].UserID) !== -1
                  }
                  data.push(obj)
                }
              }
            }
          }
          dataRef.children = data
          this.newList = [...this.newList]
          if (dataRef.checked) {
            this.onCheck('', { node: { dataRef: dataRef }, checked: dataRef.checked })
          } else if (this.selectTeacher.length > 0) {
            this.onCheck('', { node: { dataRef: dataRef }, checked: true }, true)
          }
          this.generateList(this.newList)
        }
      },
      //   ----------设置教师的选中start ----------
      delFun (val) {
        this.checkAllList = this.checkAllList.filter(item => {
          return item.id !== val.id
        })
        if (this.selectTeacher.length > 0) {
          this.selectTeacher = this.selectTeacher.filter(item => {
            return item.id !== val.id
          })
        }
        let ids = this.checkAllList.map(item => item.id) || []
        this.operateNodeIds = [val.id]
        this.checkedNode = []
        this.changeStatus(this.newList)
        this.chooseCheck(this.newList)
        this.checkedNodeIdFun(this.newList, true)
        this.checkedNode = [...this.checkedNode, ...ids]// 已经有选择的老师，但是老师节点还没获取到
        this.unique()
      },
      onCheck (checkedKeys, info, ischeckTeacher) {
        console.log(this.newList)
        let nodeData = ischeckTeacher ? this.selectTeacher : info.node.dataRef
        this.operateNodeIds = []
        this.checkedNode = []
        this.checkAllList = []
        this.nodeList([nodeData])// 操作的父节点id和子节点id,
        if (!info.checked) {
          if (this.selectTeacher.length > 0) { // 点击checkbox取消节点，this.selectTeacher需要删除此次操作的节点(如果是父节点，需要删除相关的子节点)
            this.selectTeacher = this.selectTeacher.filter(item => !this.operateNodeIds.some(kitem => kitem === item.id))
          }
        }
        this.operateNodeIds = [...this.operateNodeIds, ...this.selectTeacher]
        this.changeStatus(this.newList, info.checked)
        this.chooseCheck(this.newList)
        this.checkedNodeIdFun()
        let tIds = this.selectTeacher.map(item => item.id)
        this.checkedNode = [...this.checkedNode, ...tIds]
        this.checkAllList = [...this.checkAllList, ...this.selectTeacher]
        this.unique()
      },
      // 改变newList的checkbox状态
      changeStatus (data, val) {
        data.map(item => {
          if (this.operateNodeIds.indexOf(item.id) !== -1) {
            item.checked = val
          }
          if (item.nodetype && item.children.length > 0) {
            this.changeStatus(item.children, val) // 如果选中的是组织节点，设置子节点都为true
          }
        })
      },
      // 根据子节点的状态，设置父节点的状态
      chooseCheck (list) {
        let choosed = true
        list.map(item => {
          if (item.children && item.children.length > 0) {
            item.checked = this.chooseCheck(item.children)
          }
          if (!item.checked) {
            choosed = false
          }
        })
        return choosed
      },
      // check:true的节点， push到 checkedNode
      checkedNodeIdFun (data = this.newList, isDel = false) {
        data.map(item => {
          if (item.checked) {
            this.checkedNode.push(item.id)
          }
          if (item.checked && !item.nodetype && !isDel) { // 点击tree的checkbox时
            this.checkAllList.push(item)
          }
          if (item.children.length > 0) { // 如果选中的是组织节点，设置子节点都为true
            this.checkedNodeIdFun(item.children, isDel)
          }
        })
      },
      unique (data) { // checkList、checkedNode去重
        let obj = {}
        this.checkAllList = this.checkAllList.reduce((pre, next) => {
          // eslint-disable-next-line no-unused-expressions
          obj[next.id] ? '' : obj[next.id] = true && pre.push(next)
          return pre
        }, [])
        this.checkedNode = Array.from(new Set(this.checkedNode))
      },
      //   ----------设置教师的选中end ----------
      //   ----------搜索tree,Start ----------
      nodeList (data) { // 把树形结构的数据，平铺展示为普通数组，便于搜索用
        data.map(item => {
          this.operateNodeIds.push(item.id)
          if (item.children && item.children.length > 0) {
            this.nodeList(item.children)
          }
        })
      },
      generateList (data) { // 把树形结构的数据，平铺展示为普通数组，便于搜索用
        for (let i = 0; i < data.length; i++) {
          const node = data[i]
          const key = node.key
          this.dataList.push({ key, title: node.title })
          if (node.children) {
            this.generateList(node.children)
          }
        }
      },
      getParentKey (key, tree) {
        let parentKey
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i]
          if (node.children) {
            if (node.children.some(item => item.key === key)) {
              parentKey = node.key
            } else if (this.getParentKey(key, node.children)) {
              parentKey = this.getParentKey(key, node.children)
            }
          }
        }
        return parentKey
      },
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      onChange (e) {
        const value = e.target.value
        const expandedKeys = this.dataList
          .map(item => {
            if (item.title.indexOf(value) > -1) {
              return this.getParentKey(item.key, this.newList)
            }
            return null
          })
          .filter((item, i, self) => item && self.indexOf(item) === i)
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true
        })
      }
    //   ----------搜索tree,end ----------
    }
  }
</script>
<style lang="less" scoped>
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
}
/deep/.ant-modal {
  min-width: 552px;
  /deep/.ant-modal-body {
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 0;
    .left {
      width: 50%;
      border-right: 1px solid #e8e8e8;
      padding: 24px 15px;
    }
    .right {
      padding: 24px 0;
      padding-right: 0;
      width: 50%;
      .tag {
        margin-left: 10px;
      }
      .room-overflow {
        min-height: 200px;
        max-height: 500px;
        overflow: auto;
      }
      .count-room {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 32px;
        padding-left: 10px;
      }
      .room {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
}
.loading-box {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nodata {
  text-align: center;
  line-height: 200px;
}
.modal-content {
  display: flex;
  /deep/.ant-tree {
    min-height: 200px;
    max-height: 500px;
    overflow: auto;
    /deep/.ant-tree-node-content-wrapper {
      width: 29px;
      height: 29px;
      line-height: 29px;
    }
    /deep/.ant-tree-title {
      margin-left: 10px;
    }
    /deep/.ant-tree-node-selected {
      background-color: #f5f5f5;
    }
    /deep/ .ant-tree-node-content-wrapper {
      position: relative;
    }
    .icon-selected {
      color: rgba(0, 0, 0, 0.35);
      position: absolute;
      right: 0;
    }
  }
}
</style>
