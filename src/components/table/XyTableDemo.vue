<template>
  <div>
    <XyTable
      @changeSelect="changeSelect"
      @changePage="changePage"
      @changePageSize="changePageSize"
      :tbColumns="columns"
      :tbData="data"
      :pageSize="pageSize"
      :pageIndex="pageIndex"
      :total="total"
      @tableMenu="tableMenu">
      <template>
        <DropdownItem @click.native="editMenu">编辑</DropdownItem>
      </template>
    </XyTable>
  </div>
</template>
<script>
  import XyTable from './XyTable.vue'

  export default {
    name: 'XyTableDemo',
    components: {
      XyTable
    },
    data () {
      return {
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '年龄',
            key: 'age'
          },
          {
            title: '出生日期',
            key: 'birthday'
          },
          {
            title: '地址',
            key: 'address'
          },
          {
            title: '操作',
            width: 200,
            render: (h, params) => {
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, [
                h('a', {
                  'class': {
                    disabled: true,
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      // this.edit(params.row)
                    }
                  }
                }, '编辑'),
                h('Dropdown', {
                  props: {
                    trigger: 'click'
                  }
                }, [
                  h('div', {
                    'class': {
                      oprateBtn2: true
                    }
                  }, [
                    h('a', {}, '更多'),
                    h('Icon', {
                      props: {
                        type: 'ios-arrow-down'
                      },
                      style: {
                        color: '#1890FF'
                      }
                    })
                  ]),
                  h('DropdownMenu', {
                    slot: 'list'
                  }, [
                    h('DropdownItem', {
                      props: {
                        name: 'detail'
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            this.showDetail(params.row)
                          }
                        }
                      }, '查看详情')
                    ]),
                    h('DropdownItem', {
                      props: {
                        name: 'detail',
                        disabled: true
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            this.showDetail(params.row)
                          }
                        }
                      }, '禁用按钮')
                    ])
                  ])
                ])
              ])
            }
          }
        ],
        data: [
          {
            name: '王小明',
            age: 18,
            birthday: '919526400000',
            address: '北京市朝阳区芍药居'
          },
          {
            name: '张小刚',
            age: 25,
            birthday: '696096000000',
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            birthday: '563472000000',
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            birthday: '687024000000',
            address: '深圳市南山区深南大道'
          }
        ],
        total: 100,
        pageSize: 15,
        pageIndex: 1
      }
    },
    methods: {
      tableMenu (row) {
        console.log(row)
      },
      editMenu () {},
      edit (row) {
        alert(row)
      },
      showDetail (row) {
        alert(JSON.stringify(row))
      },
      delItem (row) {
        alert(JSON.stringify(row))
      },
      changeSelect (selction) {
        console.log(selction)
      },
      changePage (index) {
        this.pageIndex = index
      },
      changePageSize (size) {
        this.pageSize = size
      },
      getSpanMethod () {

      }
    }
  }
</script>
