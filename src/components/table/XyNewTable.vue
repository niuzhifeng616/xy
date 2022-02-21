<template>
  <div class="xy-table">
    <Table
      v-if="tableData.length>0&&!isLoading"
      ref="selection"
      :columns="tbColumns"
      :data="tableData"
      :height="xyMedia"
      @on-selection-change="changeSelect"
    />
    <Page
      v-if="isShowPage&&tableData.length>0"
      class="xy-page"
      :total="total"
      :page-size="obj.pageSize"
      :current="obj.pageIndex"
      :page-size-opts="pages"
      show-sizer
      show-total
      @on-change="changePage"
      @on-page-size-change="changePageSize"
    />
    <div v-if="tableData.length===0&&!isLoading" class="no-data-box">
      <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片">
      <span class="no-data-text">{{ nullData }}</span>
    </div>
    <div v-if="isLoading" class="no-data-box">
      <img class="no-data-img" src="@/assets/common/loading.png" alt="图片">
    </div>
  </div>
</template>
<script>
  export default {
    name: 'XyTable',
    props: {
      tableUrl: {
        type: String,
        default: ''
      },
      nullData: {
        type: String,
        default: '暂无相关数据'
      },
      tbColumns: {
        type: Array,
        required: true
      },
      tbData: {
        type: Object,
        required: true
      },
      pages: {
        type: Array,
        default: () => {
          return [15, 30, 50, 100]
        }
      },
      tableHeight: {
        type: [String, Number],
        default: -1
      }
    },
    data () {
      return {
        urls: '',
        isShowPage: true,
        tableData: [],
        total: 0,
        nullDis: '',
        isLoading: true,
        obj: {}
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
    watch: {
      tableUrl: {
        handler (val) {
          this.urls = val
        },
        immediate: true
      },
      tbData: {
        handler (val) {
          if (val) {
            this.obj = val
          }
        },
        immediate: true
      },
      obj: {
        handler (val) {
          this.getTableData(val)
        },
        immediate: true
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
          this.$store.commit('common/setXyMedia', { x: 1500, y: 660 })
        }
      },
      getTableData (datas) {
        if (this.urls.length > 0) {
          this.xy.loading()
          this.xy.get(this.urls, datas).then(res => {
            this.isLoading = false
            this.tableData = []
            if (res) {
              if (res.success) {
                if (res.data !== null) {
                  if (res.data instanceof Array) {
                    this.isShowPage = false
                    this.tableData = res.data
                  } else {
                    this.isShowPage = true
                    this.tableData = res.data.data
                    this.total = res.data.totalRecords
                  }
                } else {
                  this.tableData = []
                  this.total = 0
                }
              }
            } else {
              this.xy.unloading()
            }
            this.xy.unloading()
          })
        } else {
          this.xy.unloading()
          this.tableData = []
          this.total = 0
          this.isLoading = false
        }
        this.$emit('setTotal', this.total)
      },
      changeSelect (selection) {
        this.$emit('changeSelect', selection)
      },
      changePage (page) {
        this.$emit('changePage', page)
      },
      changePageSize (size) {
        this.$emit('changePageSize', size)
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
