
<template>
  <div class=" set-modal"
       style="overflow: auto;">
    <div class="left setClassBox"
         v-show='!modalLoading'>
      <a-tree :tree-data="newList"
              checkable
              :checked-keys='curNode'
              @check="onCheck"
              @expand="onExpand"
              :expanded-keys="expandedKeys"
              :auto-expand-parent="autoExpandParent"
              :selectable='false'
              blockNode
              v-show="newList.length">
        <!-- <template slot="title"
                  slot-scope="node">
          <span :title="node.title">
            {{ node.title.length>30?node.title.substr(0,30)+'...':node.title }}
          </span>
        </template> -->
        <template slot="teaName"
                  slot-scope="node">
          <span v-if='!node.leve'
                :title="node.title"> {{ node.title.length>30?node.title.substr(0,30)+'...':node.title }}</span>
          <span v-else
                :title="node.title">
            <span v-if='node.SubjectName'>{{node.SubjectName}}</span>
            <img v-if='node.HouseName'
                 src="@/assets/csmsTimeTable/exchange.png"
                 alt=""
                 class="exchange">
            <span v-if='node.HouseName'>{{node.HouseName}}</span>
          </span>
        </template>
      </a-tree>
      <div class="nodata"
           v-if="!newList.length && !modalLoading">没有可设置的信息。</div>
    </div>
    <div class="loading-box"
         v-if="modalLoading">
      <a-spin tip="加载中" />
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      isGetTree: {
        type: Boolean,
        required: true
      },
      initTeacherTree: {
        type: Boolean,
        required: true
      },
      //   // 已经选中的教师名称
      selectedHouseName: {
        type: String
      },
      classTableID: { // 校区id
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        newList: [],
        copyDataList: [], // 避免操作污染数据源，缓存初始化数据源
        expandedKeys: [],
        copyExpandedKeys: [],
        autoExpandParent: true,
        selectTeacher: [], // 编辑的时候传入的教师UserId（这里需要注意的是，传入的数组必须是数字类型的 [1,2,3,4]）
        modalLoading: false, // 弹窗
        curNode: [], // 左侧选中的教师唯一id
        checkAllList: [], // 右侧选中的教师
        checkedValue: [], // 缓存的左侧被选中的值
        updateTName: ''
      }
    },
    watch: {
      isGetTree (val) {
        if (val) {
          this.initData()
          this.openAddModal()
        }
      },
      initTeacherTree (val) { // 继续设置不刷新树
        if (val && !this.selectedHouseName) {
          this.initData()
          this.newList = JSON.parse(JSON.stringify(this.copyDataList))
          this.expandedKeys = JSON.parse(JSON.stringify(this.copyExpandedKeys))
        }
      },
      selectedHouseName (val) {
        if (val) {
          this.changeTitle()
        }
      }
    },
    methods: {
      initData () {
        this.checkAllList = []
        this.checkedValue = []
        this.autoExpandParent = true
        this.expandedKeys = []
        this.curNode = []
      },
      async openAddModal () {
        this.newList = []
        this.modalLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/CoursePlan/GetSettingCourse`, {
          classTableID: this.classTableID
        })
        this.modalLoading = false
        if (res.success) {
          if (res.data && !res.data.length) return
          this.curNode = []
          this.checkedValue = []
          this.newList = this.setTree(res.data)
          this.copyDataList = JSON.parse(JSON.stringify(this.newList))
          this.copyExpandedKeys = JSON.parse(JSON.stringify(this.expandedKeys))
          console.log(this.newList)
        // 根据选择的反选
        }
      },
      // 递归教师
      setTree (orglist, leve = 0, pId = -2) {
        let result = []; let obj = {}
        if (orglist.length > 0) {
          for (let i = 0; i < orglist.length; i++) {
            let sName = ''; let hName = ''
            if (leve) {
              sName = orglist[i].SubjectName
              hName = orglist[i].HouseName
              if (sName.length > 30) {
                sName = sName.slice(0, 30)
                hName = ''
              } else if (sName.length + hName.length > 30) {
                sName = sName.slice(0, sName.length)
                hName = hName.slice(0, (30 - sName.length)) + '...'
              }
            }
            obj = {
              title: !leve ? orglist[i].Name : (orglist[i].HouseName ? `${orglist[i].SubjectName}→${orglist[i].HouseName}` : orglist[i].SubjectName),
              HouseName: hName || '',
              SubjectName: sName || '',
              id: leve ? `${orglist[i].CollectionID}/${orglist[i].CoursePlanID}` : i + 2,
              key: leve ? `${orglist[i].CollectionID}/${orglist[i].CoursePlanID}` : i + 2,
              collectionID: leve ? orglist[i].CollectionID : 0,
              coursePlanID: leve ? orglist[i].CoursePlanID : '',
              subjectID: leve ? orglist[i].SubjectID : '',
              scopedSlots: { title: 'teaName' },
              leve: leve,
              children: !leve ? this.setTree(orglist[i].Childrens, leve + 1) : []
            }
            if (!obj.leve) { // 默认展开到第二级
              this.expandedKeys.push(obj.id)
            }
            result.push(obj)
          }
        }
        return result
      },
      changeTitle () {
        this.updateTName = this.selectedHouseName
        // this.newList = JSON.parse(JSON.stringify(this.copyDataList))
        this.newList.map((item, index) => {
          if (item.children.length > 0) {
            item.children.map((citem, cindex) => {
              if (this.curNode.indexOf(citem.id) !== -1) {
                let newTName = this.updateTName
                let title = citem.title.split('→')[0] + '→' + newTName
                let sName = ''
                let hName = ''
                if (citem.leve) {
                  sName = citem.SubjectName
                  hName = newTName
                  if (sName.length > 30) {
                    sName = sName.slice(0, 30) + '...'
                    hName = ''
                  } else if (sName.length + hName.length > 30) {
                    sName = sName.slice(0, sName.length)
                    hName = hName.slice(0, (30 - sName.length)) + '...'
                  }
                }
                this.$set(citem, 'title', title)
                this.$set(citem, 'HouseName', hName)
                this.$set(citem, 'SubjectName', sName)
              }
              return citem
            })
          }
          return item
        })
        this.initData()
        this.expandedKeys = JSON.parse(JSON.stringify(this.copyExpandedKeys))
        console.log(this.newList)
      },
      //   ----------设置教师的选中start ----------
      // tree 组件自带方法，选中/反选
      onCheck (checkedKeys, info) {
        let nodeData = info.node.dataRef
        this.curNode = checkedKeys
        console.log(checkedKeys, info.node)
        if (!nodeData.leve) { // 勾选父级
          for (let i = 0; i < nodeData.children.length; i++) {
            if (info.checked) {
              if (checkedKeys.indexOf(nodeData.children[i].id) !== -1) {
                this.checkAllList.push(nodeData.children[i])
              }
            } else {
              this.checkAllList = this.checkAllList.filter(item => item.id !== nodeData.children[i].id)
            }
          }
        } else { // 勾选子级
          if (info.checked) {
            if (checkedKeys.indexOf(nodeData.id) !== -1) {
              this.checkAllList.push(nodeData)
            }
          } else {
            this.checkAllList = this.checkAllList.filter(item => item.id !== nodeData.id)
          }
        }
        console.log(this.checkAllList)
      },
      onExpand (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      }
    }
  }
</script>
<style lang="less" scoped>
@import '../css/antModal.less';
</style>
