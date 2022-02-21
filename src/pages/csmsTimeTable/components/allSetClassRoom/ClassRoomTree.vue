<!-- 集中设置教室 -->
<template>
  <div class="set-modal">
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
          <i class="iconfont icon-selected"
             v-if='node.selected'>&#xe6a1;</i>
        </template>
        <span class="icon-box"
              slot="icon">
          <i class="iconfont">&#xe6fa;</i>
        </span>
      </a-tree>
      <div v-else
           class="nodata">该搜索条件下没有教室。</div>
    </div>
    <div class="loading-box"
         v-if="modalLoading">
      <a-spin tip="加载中" />
    </div>

  </div>
</template>
<script>
  export default {
    name: 'SetTeacherOrg',
    props: {
      isGetTree: {
        type: Boolean,
        required: true
      },
      initTeacherTree: {
        type: Boolean,
        required: true
      },
      classTableID: { // 校区id
        type: Number,
        default: 0
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
      isGetTree (val) {
        if (val) {
          this.keyWord = ''
          this.autoExpandParent = true
          this.expandedKeys = []
          this.selectedKey = []
          this.checkNode = []
          this.isNoData = false
          this.copyExpandedKeys = []
          this.openAddModal()
        }
      },
      initTeacherTree (val) { // 继续设置不刷新树
        this.selectedKey = []
        if (val) {
          this.keyWord = ''
          this.autoExpandParent = true
          this.selectedKey = []
          this.isNoData = false
        }
      }
    },
    methods: {
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
              selectable: level === 2,
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
        this.selectedKey = selectedKeys
        let nodeData = info.node.dataRef
        if (nodeData.level === 2 && info.selected) {
          this.checkNode = [nodeData]
        } else {
          this.checkNode = []
        }
      },
      onChange (e) {
        this.keyWordTrim = this.keyWord.trim()
        this.newList = JSON.parse(JSON.stringify(this.copyDataList))
        this.isNoData = false
        if (this.keyWordTrim) {
          this.isHaveVal = true
          this.expandedKeys = []
          this.newList = this.filterKW(this.newList)
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
      filterKW (val) {
        if (!val || !val.length) return null
        return val.map(vv => {
          if ((vv.level === 0 || vv.level === 1) && vv.children && vv.children.length) {
            vv.children = vv.children.filter(vc => {
              if ((vc.title && vc.title.indexOf(this.keyWordTrim) > -1)) {
                this.expandedKeys.push(vc.key)
                return vc
              } else if (vc.children && vc.children.length) return vc
            })
          }
          vv.children = vv.children && vv.children.length ? this.filterKW(vv.children) : []
          return (vv.level === 0 || vv.level === 1) && !vv.children.length ? null : vv
        }).filter(v => v)
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../css/antModal.less';
.set-modal {
  padding-right: 0;
}
.modal-content {
  .input-box {
    padding-top: 15px;
  }
  /deep/.ant-tree {
    height: 435px;
    overflow: auto;
    .ant-tree-node-selected {
      background-color: #f5f5f5 !important;
    }
    .ant-tree-node-content-wrapper {
      position: relative;
    }
    // .ant-tree-switcher {
    //   text-align: left;
    // }
    .icon-selected {
      color: rgba(0, 0, 0, 0.35);
      position: absolute;
      right: 26px;
    }
  }
}
</style>
