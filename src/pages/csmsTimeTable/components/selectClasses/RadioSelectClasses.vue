<template>
  <div>
    <a-modal :title="modalTitle"
             :maskClosable="false"
             width='50%'
             :visible="isShow"
             @cancel="cancel"
             :confirm-loading="confirmLoading">
      <div class="modal-content"
           v-if='newList.length>0||isNoData'>
        <div class='input-box'>
          <a-input-search allowClear
                          :disabled="copyDataList.length===0"
                          placeholder="请输入教室名称"
                          v-model="keyWord"
                          @search="onChange" />
        </div>
        <a-tree show-icon
        v-if='!isNoData'
                :tree-data="newList"
                @select="onSelect"
                @expand="onExpand"
                :selected-keys='selectedKey'
                :expanded-keys="expandedKeys"
                :auto-expand-parent="autoExpandParent"
                blockNode>
          <template slot="title"
                    slot-scope="node">
            <span :title="node.title">
              {{ node.title.length>20?node.title.substr(0,20)+'...':node.title }}
            </span>
            <!-- v-if='checkNode.length&&checkNode[0].key===node.key&&node.level===2' -->
            <i class="iconfont icon-selected"
               v-if='node.selected'>&#xe6a1;</i>
          </template>
          <span class="icon-box"
                slot="icon">
            <i class="iconfont">&#xe6fa;</i>
          </span>
        </a-tree>
        <div v-else class="nodata">该搜索条件下没有教室。</div>
      </div>
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
      classTableID: {
        type: Number,
        default: 406
      }
    },
    data () {
      return {
        newList: [],
        copyDataList: [],
        dataList: [],
        expandedKeys: [],
        copyExpandedKeys: [],
        selectedKey: [],
        searchValue: '',
        keyWord: '',
        keyWordTrim: '', // 搜索的value，去掉首尾空格后的值
        autoExpandParent: true,
        // 弹窗
        modalLoading: false,
        confirmLoading: false,
        checkNode: [],
        isNoData: false,
        isHaveVal: false // 输入框的value是否为真
      }
    },
    watch: {
      isShow (val) {
        if (val) {
          this.keyWord = ''
          this.autoExpandParent = true
          this.expandedKeys = []
          this.selectedKey = []
          this.isNoData = false
          this.copyExpandedKeys = []
          this.checkNode = []
          this.openAddModal()
        }
      }
    },
    methods: {
      // 弹窗
      cancel () {
        this.$emit('select-cancel')
      },
      confirm () {
        if (this.checkNode.length === 0) {
          this.xy.msgError('请选择一个教室。')
          return
        }
        this.$emit('select-confirm', this.checkNode)
      },
      async openAddModal () {
        this.newList = []
        this.keyWord = ''
        let params = {
          classTableID: this.classTableID
        }
        this.modalLoading = true
        let rs = await this.xy.get(this.$store.state.apiPath + '/api/CoursePlan/GetSettingHouse', params)
        this.modalLoading = false
        if (rs.success) {
          if (rs.data.length > 0) {
            if (!rs.data[0].Name && rs.data[0].Childrens.length === 0) { // 没有教室时
              this.newList = []
              this.copyDataList = []
              this.isNoData = true
            } else {
              this.newList = this.getHouseChildren(rs.data)
              this.copyDataList = JSON.parse(JSON.stringify(this.newList))
              this.copyExpandedKeys = [...this.expandedKeys]
            }
          }
        }
      },
      // 递归教室
      getHouseChildren (orglist, level = 0, pId = 0, pTitle = '') {
        if (orglist.length > 0) {
          let result = []
          for (let i = 0; i < orglist.length; i++) {
            let obj = {
              title: orglist[i].Name,
              id: orglist[i].Value,
              pId: pId,
              pTitle: pTitle,
              key: `${orglist[i].BuildingID}/${orglist[i].HouseID}/${orglist[i].Value}`,
              level: level,
              selectable: true,
              scopedSlots: { title: 'title' },
              children: this.getHouseChildren(orglist[i].Childrens, level + 1, orglist[i].Value, orglist[i].Name)
            }
            if (level === 2) { // 最后一级加icon
              obj.slots = {
                icon: 'icon'
              }
            }
            if (level < 2) {
              this.expandedKeys.push(obj.key)
            }
            if (this.selectMembers.length > 0) {
              if (this.selectMembers[0].id === orglist[i].Value && level === 2) { // Value可能会一样，所以采用拼接id的方式
                this.selectedKey = [obj.key]
                this.checkNode = [obj]
              }
            }
            result.push(obj)
          }
          return result
        }
      },
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
        if (!this.isHaveVal) {
          this.copyExpandedKeys = [...this.expandedKeys]
        }
      },
      onSelect (selectedKeys, info) {
        let nodeData = info.node.dataRef
        if (nodeData.level === 2 && info.selected) {
          this.checkNode = [nodeData]
          this.selectedKey = [nodeData.key]
        } else {
          // this.checkNode = []
          if (this.expandedKeys.indexOf(nodeData.key) === -1) {
            this.expandedKeys.push(nodeData.key)
          } else {
            this.expandedKeys = this.expandedKeys.filter(item => item !== nodeData.key)
          }
          this.onExpand(this.expandedKeys)
        }

        // console.log(this.expandedKeys, selectedKeys, info, this.selectedKey)
      },
      onChange (e) {
        this.keyWordTrim = this.keyWord.trim()
        this.newList = JSON.parse(JSON.stringify(this.copyDataList))
        this.isNoData = false
        if (this.keyWordTrim) {
          this.isHaveVal = true
          this.expandedKeys = []
          this.newList = this.filterKW(this.newList)
          console.log(this.expandedKeys)
        } if (!this.keyWordTrim && !this.keyWord.length) { // 清空内容
          this.isHaveVal = false
          this.expandedKeys = [...this.copyExpandedKeys]
          return
        }

        if (this.expandedKeys.length === 0) { // 没有搜索到教室
          this.isNoData = true
        }
        Object.assign(this, {
          expandedKeys: [...new Set(this.expandedKeys)],
          autoExpandParent: true
        })
      },
      filterKW (val, schoolKey) {
        if (!val || !val.length) return null
        return val.map(vv => {
          if ((vv.level === 0 || vv.level === 1) && vv.children && vv.children.length) {
            vv.children = vv.children.filter(vc => {
              if ((vc.title && vc.title.indexOf(this.keyWordTrim) > -1)) {
                // this.expandedKeys.push(vc.key)
                if (this.expandedKeys.indexOf(schoolKey) === -1) { // 校区，level：0的key
                  this.expandedKeys.push(schoolKey)
                }
                if (this.expandedKeys.indexOf(vv.key) === -1) { // level：1的key
                  this.expandedKeys.push(vv.key)
                }
                return vc
              } else if (vc.children && vc.children.length) return vc
            })
          }
          vv.children = vv.children && vv.children.length ? this.filterKW(vv.children, vv.key) : []
          return (vv.level === 0 || vv.level === 1) && !vv.children.length ? null : vv
        }).filter(v => v)
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../css/antModal.less';
.modal-content {
  .input-box {
    padding-top: 15px;
  }
  /deep/.ant-tree {
    min-height: 525px;
    max-height: 525px;
    overflow: auto;
    .ant-tree-node-selected {
      background-color: #f5f5f5 !important;
    }
    .ant-tree-node-content-wrapper {
      position: relative;
      // &:hover {
      //   background-color: #f5f5f5;
      // }
    }
    .icon-selected {
      color: rgba(0, 0, 0, 0.35);
      position: absolute;
      right: 26px;
    }
  }
}
</style>
