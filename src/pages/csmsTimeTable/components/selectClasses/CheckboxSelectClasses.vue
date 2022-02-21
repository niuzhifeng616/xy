<template>
  <div>
    <a-modal :title="modalTitle"
             width='50%'
             :maskClosable="false"
             :visible="isShow"
             @cancel="cancel"
             :confirm-loading="confirmLoading">
      <a-row class="xy-flex"
             v-show='!modalLoading'>
        <div class="left">
          <div class='input-box'>
            <a-input-search placeholder="请输入教室名称"
                            allowClear
                            v-model.trim="keyWord"
                            @search='searchFun' />
          </div>
          <a-tree show-icon
                  :tree-data="newList"
                  checkable
                  :checked-keys='curNode'
                  @check="onCheck"
                  @expand="onExpand"
                  :expanded-keys="expandedKeys"
                  :auto-expand-parent="autoExpandParent"
                  :selectable='false'
                  blockNode
                  v-show="newList.length && !treeLoading">
            <template slot="title"
                      slot-scope="node">
              <span :title="node.title">
                {{ node.title.length>20?node.title.substr(0,20)+'...':node.title }}
              </span>
            </template>
            <span class="icon-box"
                  slot="icon">
              <i class="iconfont">&#xe6fa;</i>
            </span>
            <template slot="teaName"
                      slot-scope="node">
              <span :title="node.userName">
                {{ node.title.length>20?node.title.substr(0,20)+'...':node.title }}
              </span>
            </template>
          </a-tree>
          <div class="loading-tree"
               v-if="treeLoading">
            <a-spin tip="加载中" />
          </div>
          <div class="nodata"
               v-show="!newList.length && !modalLoading && !treeLoading">未搜索到相关结果。</div>
        </div>
        <div class="right">
          <div class="count-room"
               v-show='checkAllList.length'>已选:{{checkAllList.length}}个教室</div>
          <div class="nodata right-tip"
               v-show='!checkAllList.length && !modalLoading'>您还未选择任何教室，请选择教室。</div>
          <div class="room-overflow"
               v-if='checkAllList.length>0'>
            <div v-for='item in checkAllList'
                 :key='item.id'
                 class="room">
              <div>
                <span class="icon-box"
                      slot="icon">
                  <i class="iconfont">&#xe6fa;</i>
                </span>
                <span class="tag"
                      :title="item.title">{{item.title.length>20?item.title.substr(0,20)+'...':item.title}}</span>
              </div>
              <i class="iconfont del-btn"
                 @click="delFun(item)">&#xe6f3;</i>
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
    name: 'SelectClassRoom',
    props: {
      modalTitle: {
        type: String,
        default: '选择教室'
      },
      isShow: {
        type: Boolean,
        required: true
      },
      // 已经选中的教室
      selectMembers: {
        type: Array,
        required: false
      },
      classTableID: { // 校区id
        type: Number,
        default: -99
      }
    },
    data () {
      return {
        newList: [],
        copyDataList: [], // 避免操作污染数据源，缓存初始化数据源
        expandedKeys: [],
        copyExpandedKeys: [],
        autoExpandParent: true,
        keyWord: '', // 搜索的关键字
        isHaveVal: false, // 输入框的value是否为真
        selectClassRoom: [], // 编辑的时候传入的教室UserId（这里需要注意的是，传入的数组必须是数字类型的 [1,2,3,4]）
        modalLoading: false, // 弹窗
        confirmLoading: false,
        curNode: [], // 左侧选中的教室唯一id
        checkAllList: [], // 右侧选中的教室
        checkedValue: [], // 缓存的左侧被选中的值
        rightSta: false, // 是否是右侧删除（true）
        treeLoading: false // 为了解决卡顿，添加loading动画状态控制
      }
    },
    watch: {
      isShow (val) {
        if (val) {
          this.keyWord = ''
          this.checkAllList = []
          this.autoExpandParent = true
          this.expandedKeys = []
          this.copyExpandedKeys = []
          this.selectClassRoom = this.selectMembers
          this.curNode = []
          this.openAddModal()
        }
      },
      // expandedKeys (val) {
      //   console.log(val)
      // },
      keyWord: {
        handler: 'clearKayWd'
      }
    },
    methods: {
      // 清空搜索条件时还原被选中，或者进行一些其他操作
      clearKayWd (val = '') {
        if (val !== '') return
        this.curNode = this.checkedValue.map(v => v.id)
      },
      // 弹窗
      cancel () {
        this.$emit('select-cancel')
      },
      confirm () {
        if (this.checkAllList.length === 0) {
          this.xy.msgError('请选择教室。')
          return
        }
        this.$emit('select-confirm', this.checkAllList)
      },
      async openAddModal () {
        this.newList = []
        // let params = {
        //   classTableID: this.classTableID
        // }
        this.modalLoading = true
        let res = await this.xy.get(this.$store.state.apiPath + '/api/CoursePlan/GetAllSettingHouse')
        this.modalLoading = false
        if (res.success) {
          if (res.data && !res.data.length) return
          this.curNode = []
          this.checkedValue = []
          this.expandedKeys = []
          this.newList = this.setTree(res.data, 0)
          this.copyDataList = JSON.parse(JSON.stringify(this.newList))
          this.copyExpandedKeys = [...this.expandedKeys]
        // 根据选择的反选
        }
      },
      // 递归教室
      setTree (orglist, leve, schooleName = '', buildName = '') {
        let result = []
        if (orglist.length > 0) {
          for (let i = 0; i < orglist.length; i++) {
            let obj = {
              title: orglist[i].Name,
              leve: leve,
              schooleName: leve === 0 ? orglist[i].Name : schooleName,
              buildName: leve === 1 ? orglist[i].Name : buildName,
              // disabled: leve !== 2 && orglist[i].Childrens.length === 0,
              id: `${orglist[i].SchoolDistrictID}/${orglist[i].BuildingID}/${orglist[i].HouseID}`,
              key: `${orglist[i].SchoolDistrictID}/${orglist[i].BuildingID}/${orglist[i].HouseID}`,
              SchoolDistrictID: orglist[i].SchoolDistrictID,
              BuildingID: orglist[i].BuildingID,
              HouseID: orglist[i].HouseID,
              scopedSlots: { title: 'title' },
              children: this.setTree(orglist[i].Childrens, leve + 1, leve === 0 ? orglist[i].Name : schooleName, leve === 1 ? orglist[i].Name : '')
            }

            // if (obj.leve === 0) {
            //   this.expandedKeys.push(obj.id)
            // }
            // 设置教室需要默认展开所有教室
            this.expandedKeys.push(obj.id)

            if (obj.leve === 2) {
              obj.slots = {
                icon: 'icon'
              }
            }
            result.push(obj)
            // 右侧教室多个过滤操作，如果，有多个同一教室只显示一个
            if (this.selectClassRoom && this.selectClassRoom.length && ((!this.checkAllList.length && this.selectClassRoom.includes(obj.id)) || (!this.checkAllList.map(v => v.title).includes(obj.title) && this.selectClassRoom.includes(obj.id)))) {
              this.checkAllList.push(obj)
            }
            // 编辑的时候，将之前选中过的教室在左侧tree上面选中
            if (this.selectClassRoom.includes(obj.id) && !this.curNode.includes(obj.id)) {
              this.curNode.push(obj.id)
              this.checkedValue.push(obj)
            }
          }
        }
        return result
      },
      //   ----------设置教室的选中start ----------
      // 设置教室
      delFun (val) {
        this.rightSta = true
        this.featchEndVal(val, false)
      },
      // tree 组件自带方法，选中/反选
      onCheck (checkedKeys, info) {
        this.rightSta = false
        let nodeData = info.node.dataRef
        this.featchEndVal(nodeData, info.checked)
        console.log(this.curNode)
      },
      /**
       * val 传入要处理的对象，比如晓羊校区
       * status 这个用来确认是选中（true），还是，取消选中（false）
       */
      featchEndVal (val, status) {
        // console.log(val)
        if (!val) return false
        // 这里遍历学校和年级，如果这两个children下面还有数据就继续递归
        if (val.children && val.children.length) {
          console.log(val.title)
          for (let item of val.children) {
            // 递归调用
            this.featchEndVal(item, status)
          }
        } else {
          if (!status) {
            // 点击右侧（反选操作，这里要做的是去删除左侧多个被选中的同一个教室） --- rightSta这个用来确认是右侧删除标识
            if (this.rightSta && this.curNode.length) {
              let include = []
              // 这里将同一UserId的id拿到，因为，相同UserId的id不一样（同一教室可能会在不同组织下面）
              for (let item of this.checkedValue) {
                if (item.id === val.id && !include.includes(item.id)) {
                  include.push(item.id)
                }
              }
              // console.log(this.curNode)
              // console.log(include)
              // 拿到了同一教室的唯一id之后，挨个将左侧选中状态下的不同组织下面的教室取消选中状态
              if (include.length) {
                for (let item of include) {
                  this.curNode.splice(this.curNode.findIndex(v => v === val.id), 1)
                  this.checkedValue.splice(this.checkedValue.findIndex(v => v.id === item), 1)
                }
              }
            } else {
              // if (!info.checked && !nodeData.id && !nodeData.children.length) return
              // 左侧取消选中（反选操作） 将被反选的唯一id传入，再去curNode中找到，再将其删除
              if (this.curNode.length && this.curNode.includes(val.id)) {
                this.curNode.splice(this.curNode.findIndex(v => v === val.id), 1)
              }
              // 先去删除缓存中的不同组织下的教室
              if (this.checkedValue.length) {
                this.checkedValue.splice(this.checkedValue.findIndex(v => v.id === val.id), 1)
              }
            }
            // 删除右侧列表中的唯一教室
            if (val.id && (((this.checkedValue.length && !this.checkedValue.map(v => v.id).includes(val.id)) || !this.checkedValue.length || this.rightSta))) {
              this.checkAllList.splice(this.checkAllList.findIndex(v => v.id === val.id), 1)
            }
          } else {
            // 选中操作
            if (!this.checkedValue.length || (this.checkedValue.length && !this.checkedValue.map(v => v.id).includes(val.id))) {
              if (!val.disabled) {
                this.curNode.push(val.id)
                // 将左侧选中教室加入缓存数组
                this.checkedValue.push(val)
              }
            }
            // 右侧要显示的教室去重
            if (val.leve === 2 && val.id && !this.checkAllList.map(vv => vv.id).includes(val.id)) {
              this.checkAllList.push(val)
            }
          }
        }
      },
      //   ----------设置教室的选中end ----------
      //   ----------搜索tree,Start ----------
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
        if (!this.isHaveVal) {
          this.copyExpandedKeys = [...this.expandedKeys]
        }
      },
      // 执行搜索
      searchFun () {
        let keyWordTrim = this.keyWord.trim()
        this.treeLoading = true
        this.curNode = []
        this.newList = JSON.parse(JSON.stringify(this.copyDataList)) // 深拷贝所有数据
        if (keyWordTrim) {
          this.isHaveVal = true
          this.expandedKeys = []
          this.newList = this.filterKW(this.newList)
        } if (!keyWordTrim && !this.keyWord.length) { // 清空内容
          this.isHaveVal = false
          this.expandedKeys = [...this.copyExpandedKeys]
          this.clearKayWd()
        }
        // 为了解决卡顿，添加loading动画
        setTimeout(() => {
          this.treeLoading = false
        }, 300)
        Object.assign(this, {
          expandedKeys: [...new Set(this.expandedKeys)],
          autoExpandParent: true
        })
      },
      filterKW (val) {
        if (!val || !val.length) return null
        return val.map(vv => {
          if (vv.children && vv.children.length && (vv.leve === 0 || vv.leve === 1)) {
            vv.children = vv.children.filter(vc => {
              if (vc.title && vc.title.indexOf(this.keyWord.trim()) > -1) {
                // 检查当前筛选条件下是有有被选中的，如果有就要加入当前被选中的集合中。
                if (this.checkedValue.map(v => v.id).includes(vc.id)) {
                  this.curNode.push(vc.id)
                }
                // 将需要展开的组织的最后一级的typyId加入tree默认数组中
                this.expandedKeys.push(vc.id)
                return vc
              } else if (vc.children && vc.children.length) return vc
            })
          }
          vv.children = vv.children && vv.children.length ? this.filterKW(vv.children) : []
          return (vv.leve === 0 || vv.leve === 1) && !vv.children.length ? null : vv
        }).filter(v => v)
      }
    //   ----------搜索tree,end ----------
    }
  }
</script>
<style lang="less" scoped>
@import '../css/antModal.less';
</style>
