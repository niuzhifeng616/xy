
<script>
  export default {
    name: 'XyAntTable',
    props: {
      rowSelection: {// table前面复选框，不需要不用传入
        type: Object
      },
      dataSource: {// table要展示的数据
        type: Array
      },
      columns: {// 表头数据
        type: Array
      },
      nullData: {// 暂无数据显示内容
        type: String,
        default: '该搜索条件下没有结果。'
      },
      pagination: {// 如果不需要分页，此值也不需要传
        type: Object
      },
      tableLoading: {// 加载动画，必须传
        type: Boolean,
        default: true
      },
      tableTip: {// 可自定义加载中提示语句
        type: String,
        default: '努力加载中...'
      },
      isPage: {// 是否需要分页
        type: Boolean,
        default: true
      },
      isBorder: {// 是否需要外边框
        type: Boolean,
        default: false
      },
      tableStyle: {
        type: Object,
        default: () => {
          return {
            marginTop: ''
          }
        }
      },
      isScroll: {// true：同时固定表头和某列，并且同时需要传入scrollx值
        type: Boolean,
        default: false
      },
      scrollx: {// 只显示x轴滚动条,并且不固定表头
        type: [Number, String, Boolean]// 字符串可传值：'max-content'，'min-content'，不建议传boolean值
      },
      scrolly: {// 只固定表头,x轴不需要滚动条
        type: [Number, Boolean]
      },
      // skeleton: { // 骨架屏，暂不需要
      //   type: Boolean,
      //   default: true
      // }
      isTop: { // 表格数据改变滚动条是否置顶（页面有多表格时，这个功能得禁用，不然滚动条一直处于0位置，出现页面卡死现象）
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        imgs: require('@/assets/common/nullData.svg'),
        scrollText: {},
        spinStyle: {}
      }
    },
    computed: {
      xyMedia () {
        return this.$store.state.common.xyMedia
      }
    },
    watch: {
      xyMedia: {
        handler (val) {
          if (val) {
            this.scrollText = val
            this.spinStyle = {
              position: 'absolute',
              paddingTop: (val.y / 2) + 'px',
              height: '100%',
              zIndex: 200,
              width: '100%',
              background: 'rgba(255,255,255,.5)'
            }
          }
        },
        immediate: true
      },
      isScroll: {
        handler (val) {
          if (val) {
            this.windowResize()
            window.addEventListener('resize', () => { this.windowResize() }, false)
          }
        },
        immediate: true
      },
      dataSource: {
        handler (val) {
          if (!this.isTop) return
          $('#scrollWrap').animate({ scrollTop: 0 }, 600)
        },
        immediate: true
      }
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => { this.windowResize() }, false)
    },
    render () {
      const on = {
        ...this.$listeners
      }
      const rowKey = (record, index) => {
        return (record.key && record.key !== undefined && record.key !== null) ? record.key : index
      }
      const props = {
        ...this.$attrs,
        ...this.$props,
        ...{
          pagination: this.isPage ? {
            ...this.pagination,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`, // 分页中显示总的数据
            pageSizeOptions: ['15', '30', '50', '100'] // 每页中显示的数据
            // buildOptionText: pageSizeOptions => `${pageSizeOptions.value}条/页`
          } : false,
          rowKey: rowKey,
          scroll: (this.isScroll && this.scrollx) ? this.scrollText // 需要固定表头和某列
          : this.scrolly ? { x: null, y: this.scrolly } // 只需要固定表头，y轴出现滚动条
          : (!this.isScroll && this.scrollx) ? { x: this.scrollx, y: null } // 只需要出现x轴滚动条
          : { x: null, y: null } // 默认值：x轴和y轴滚动都不出现
        },
        bordered: this.isBorder
      }
      // slots循环
      const slots = Object.keys(this.$slots).map(slot => {
        return (
          <template slot={slot}>{ this.$slots[slot] }</template>
        )
      })
      const table = (
        <a-config-provider>
          <a-table props={props} size="middle" scopedSlots={ this.$scopedSlots } on={on}>
            {slots}
          </a-table>
        </a-config-provider>
      )
      const imgs = (
        // <template slot="renderEmpty"></template>
        <div class="table-null" style={ this.tableStyle }>
          <img class="imgs" src={ this.imgs } alt="图片"/>
          <div class="text">{ this.nullData }</div>
        </div>
      )
      return (
        // <a-skeleton loading={ this.skeleton }></a-skeleton>
        <div style="position:relative">
          <a-spin spinning={ this.tableLoading } tip={ this.tableTip } style={ this.spinStyle }></a-spin>
          { !this.tableLoading && this.dataSource.length === 0 ? imgs : null}
          {this.dataSource.length > 0 ? table : null }
        </div>
      )
    },
    methods: {
      windowResize () {
        // console.log($(window).height(), $('.xy-content-title').height())
        if ($(window).width() < 1367) {
          this.$store.commit('common/setXyMedia', { x: this.scrollx, y: 500 })
        } else if ($(window).width() < 1441) {
          this.$store.commit('common/setXyMedia', { x: this.scrollx, y: 500 })
        } else if ($(window).width() < 1689) {
          this.$store.commit('common/setXyMedia', { x: this.scrollx, y: 540 })
        } else {
          this.$store.commit('common/setXyMedia', { x: this.scrollx, y: 640 })
        }
      }
    }
  }
</script>
