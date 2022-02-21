<template>
  <div class="xy-table">
    <Table ref="selection"
      :row-key="rowKey"
      :loading="loading"
      :context-menu="isOpenMenu"
      :show-context-menu="isMenu"
      v-if="tableData.length>0"
      :columns="tbColumns"
      :max-height="maxHeight1"
      :height="xyMedia"
      :data="tableData"
      :load-data="handleLoadData"
      @on-selection-change="changeSelect"
      @on-contextmenu="tableMenu"
      @on-sort-change="onSortChange"
      @on-filter-change="filterChange">
        <slot slot="contextMenu"></slot>
    </Table>
    <Page class="xy-page"
      v-if="isShowPage&&tableData.length>0"
      :total="total"
      :page-size="pageSize"
      :current="pageIndex"
      :page-size-opts="pages"
      show-sizer
      show-total
      @on-change="changePage"
      @on-page-size-change="changePageSize"/>
      <div v-if="tableData.length===0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">{{noDataText}}</span>
      </div>
  </div>
</template>
<script>
  export default {
    props: {
      rowKey: {
        type: String,
        default: 'id'
      },
      loading: {
        type: Boolean,
        default: false
      },
      isOpenMenu: {
        type: Boolean,
        default: true
      },
      isMenu: {
        type: Boolean,
        default: false
      },
      tbColumns: {
        type: Array,
        required: true
      },
      tbData: {
        type: [Array, Object],
        required: true
      },
      maxHeight1: {
        type: [String, Number]
      },
      tableHeight: {
        type: [String, Number],
        default: -1
      },
      // 是否展示分页
      isShowPage: {
        type: Boolean,
        default: true
      },
      noDataText: {
        type: String,
        default: '暂无相关数据'
      },
      pageIndex: {
        type: Number,
        default: 1
      },
      total: {
        type: Number,
        default: 0
      },
      // 每页条数默认15
      pageSize: {
        type: Number,
        default: 15
      },
      pages: {
        type: Array,
        default: () => {
          return [15, 30, 50, 100]
        }
      }
    },
    name: 'XyTable',
    data () {
      return {
        tableData: [],
        totals: 0,
        sort: 'ASC',
        isResetScroll: true
      }
    },
    watch: {
      tbData: {
        handler (val) {
          if (!val) return
          if (document.querySelector('#scrollWrap') && this.isResetScroll) {
            document.querySelector('#scrollWrap').scrollTop = 0
          }
          if (val instanceof Array) {
            this.tableData = val
          } else {
            this.totals = val.totalRecords
            this.tableData = val.data
          }
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      xyMedia () {
        let hei = ''
        if (this.tableHeight > -1 &&
          this.tableHeight !== '' &&
          this.tableHeight !== null &&
          this.tableHeight !== undefined) {
          hei = this.tableHeight + this.$store.state.common.xyMedia.y
        } else {
          hei = '' // this.tableHeight + this.$store.state.common.xyMedia.y
        }
        return hei
      }
    },
    created () {
      window.addEventListener('resize', () => { this.windowResize() }, false)
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => { this.windowResize() }, false)
    },
    methods: {
      windowResize () {
        if ($(window).width() < 1366) {
          this.$store.commit('common/setXyMedia', { x: 1500, y: 500 })
        } else if ($(window).width() < 1440) {
          this.$store.commit('common/setXyMedia', { x: 1500, y: 500 })
        } else if ($(window).width() < 1688) {
          this.$store.commit('common/setXyMedia', { x: 1500, y: 540 })
        } else {
          this.$store.commit('common/setXyMedia', { x: 1500, y: 640 })
        }
      },
      tableMenu (row) {
        this.$emit('tableMenu', row)
      },
      changeSelect (selection) {
        this.$emit('changeSelect', selection)
      },
      changePage (page) {
        this.$emit('changePage', page)
      },
      changePageSize (size) {
        this.$emit('changePageSize', size)
      },
      filterChange (val) {
        this.$emit('filterChangeHandle', val)
      },
      // 远程排序
      onSortChange (val) {
        this.$emit('onSortChange', val)
      },
      // table tree 懒加载
      handleLoadData (item, callback) {
        // console.log(item, callback)
        this.$emit('handleLoadData', {
          item,
          callback
        })
      }
    }
  }
</script>
<style lang="less" scpoed>
  .xy-table {
    background: #fff;
    .ivu-table th {
      background: #FAFAFA;
    }
    .oprateList {
      a.disabled {
        cursor: not-allowed;
        color: rgba(24, 144, 255,.4);
      }
      a {
        color: #1890FF;
      }
      .oprateBtn1 {
        color: #1890FF;
        padding-right: 10px;
        font-size: 14px;
      }
      .oprateBtn2 {
        a {
          padding-left: 10px;
          color: #1890FF;
          font-size: 14px;
          border-left: 1px solid #D8D8D8;
          margin-right: 5px;
        }
      }
      .oprateBtn3 {
        // 只有两个按钮时右边按钮没有嵌套 a标签，需要左边框
        position: relative;
        padding-left: 10px;
        color: #1890FF;
        font-size: 14px;
        // border-left: 1px solid #D8D8D8;
        margin-right: 5px;
      }
      .oprateBtn3::before{
        content:'';
        position: absolute;
        left: 0px;
        top: 3px;
        width: 1px;
        height: 14px;
        background: #D8D8D8;
      }
    }
    .xy-page {
      margin-top: 10px;
      text-align: right;
      position: relative;
      padding-bottom: 10px;

      .ivu-page-total {
        position: absolute;
        left: 10px;
        font-weight: 700;
      }
    }
  }
</style>
