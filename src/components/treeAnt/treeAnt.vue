<template>
  <div>
    <h1>异步加载触发</h1>
    <a-tree :load-data="onLoadData" :tree-data="treeData">
      <template slot="custom" slot-scope="item">
        <span>{{ item.title }}</span>
        <a @click="()=> append(item)">&nbsp;&nbsp;新增&nbsp;&nbsp;</a>
        <a @click="()=> edit(item)">&nbsp;&nbsp;编辑&nbsp;&nbsp;</a>
        <a @click="(e)=> remove(item)">&nbsp;&nbsp;删除&nbsp;&nbsp;</a>
      </template>
    </a-tree>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        // 第一次加载页面时需要展示的组织
        treeData: [
          { title: '一级组织1',
            key: '0',
            scopedSlots: {
              title: 'custom'
            }
          },
          { title: '一级组织2', key: '1' },
          { title: '一级组织3', key: '2', isLeaf: true }
        ]
      }
    },
    methods: {
      // 异步加载触发
      onLoadData (treeNode) {
        return new Promise(resolve => {
          if (treeNode.dataRef.children) {
            resolve()
            return
          }
          setTimeout(() => {
            treeNode.dataRef.children = [
              { title: '二级组织1', key: `${treeNode.eventKey}-0` },
              { title: '二级组织2', key: `${treeNode.eventKey}-1` }
            ]
            this.treeData = [...this.treeData]
            resolve()
          }, 600)
        })
      },
      append (item) {
        console.log(item)
      },
      edit (item) {
        console.log(item)
      },
      remove (item) {
        console.log(item)
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
