<template>
  <div class="xy-content-module">
    <div class="xy-content-title xy-flex xy-between">
      <Button class="xy-primary" @click="openCreate">新建</Button>
      <div>
        <Select v-model="RecruittypeID" @on-change="typeValueSearch" style="width:200px;" class="mr-10">
          <Option v-for="item in Recruittype" :value="item.id" :key="item.name">{{ item.name }}
          </Option>
        </Select>
        <Input style="width:200px" search v-model="seachText" @on-search="FromSubmit" placeholder="请输入文件名称"/>
      </div>
    </div>
    <div class="xy-content-body">
      <div v-if="isLoading" style="display:flex; justify-content:center; align-items: center;">
        <img src="@/assets/common/loading.png" alt="">
      </div>
      <div v-else>
        <XyTable
          @changePage="changePage"
          @changePageSize="changePageSize"
          :tbColumns="columns"
          :tbData="dataList"
          :pageSize="pageSize"
          :pageIndex="pageIndex"
          :noDataText="txt"
          :total="total">
        </XyTable>
      </div>
    </div>
  </div>
</template>
<script>
  import XyTable from '@/components/table/XyTable.vue'

  export default {
    name: 'FileSignList',
    components: {
      XyTable
    },
    data () {
      return {
        txt: '该搜索条件下没有结果。',
        total: 0,
        pageSize: 15,
        pageIndex: 1,
        seachText: '',
        RecruittypeID: 0,
        isLoading: false,
        Recruittype: [
          {
            id: 0,
            name: '所有状态'

          },
          {
            id: 1,
            name: '未发布'

          },
          {
            id: 2,
            name: '已发布'
          },
          {
            id: 3,
            name: '已撤回'
          }
        ],
        columns: [
          {
            title: '文件名称',
            key: 'SignFileName',
            tooltip: true
          },
          {
            title: '校区',
            key: 'SchoolDistrictNames',
            tooltip: true
          },
          {
            title: '已签人数',
            key: 'SignedNum'
          },
          {
            title: '未签人数',
            key: 'UnSignNum'
          },
          {
            title: '状态',
            key: 'State',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: this.Recruittype[params.row.State].name
                  }

                })
              ])
            }
          },
          {
            title: '截至时间',
            render: (h, params) => {
              return h('div', [
                h('span', {}, this.xy.moment(params.row.EndTimeDesc).format('YYYY-MM-DD'))
              ])
            }
          },
          {
            title: '操作',
            key: 'operation',
            width: 180,
            render: (h, params) => {
              let status = params.row
              let renderObj1 = [
                h('a', {
                  'class': {
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      this.DelFun(params.row)
                    }
                  }
                }, '删除'),
                h('a', {
                  'class': {
                    oprateBtn3: true
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }, '编辑')
              ]
              let renderObj2 = [
                h('a', {
                  'class': {
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      this.goDetail(params.row)
                    }
                  }
                }, '详情')
              ]
              let renderObj3 = [
                h('a', {
                  'class': {
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      this.goDetail(params.row)
                    }
                  }
                }, '详情'),
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
                        name: 'edit'
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            this.edit(params.row)
                          }
                        }
                      }, '编辑')
                    ]),
                    h('DropdownItem', {
                      props: {
                        name: 'revoke'
                      }
                    }, [
                      h('div', {
                        on: {
                          click: () => {
                            this.revoke(params.row)
                          }
                        }
                      }, '撤回')
                    ])
                  ])
                ])
              ]
              let renderObj4 = [
                h('a', {
                  'class': {
                    oprateBtn1: true
                  },
                  on: {
                    click: () => {
                      this.goDetail(params.row)
                    }
                  }
                }, '详情'),
                h('a', {
                  'class': {
                    oprateBtn3: true
                  },
                  on: {
                    click: () => {
                      this.DelFun(params.row)
                    }
                  }
                }, '删除')
              ]
              let renderObj = []
              switch (status.State) {
                case 1: {
                  renderObj = renderObj1
                  break
                }
                case 2: {
                  // 截至时间到期，隐藏编辑和撤销
                  if (new Date(status.EndTimeDesc) < new Date()) {
                    renderObj = renderObj2
                  } else {
                    renderObj = renderObj3
                  }
                  break
                }
                case 3: {
                  renderObj = renderObj4
                  break
                }
              }
              return h('div', {
                'class': {
                  oprateList: true
                }
              }, renderObj)
            }
          }
        ],
        dataList: [],
        apiPath: ''
      }
    },
    created () {
      this.apiPath = this.$store.state.apiPath
      this.getTableList()
    },
    methods: {
      openCreate () {
        let datas = {
          type: 'add',
          row: undefined,
          status: 'add'
        }
        this.$store.commit('common/getThreeMenuName', '创建')
        this.$store.commit('common/getParam', datas)
        this.$router.push({
          path: '/xyHome/sa/FileSign/createFileSign',
          query: this.$store.state.common.menuInfo
        })
      },
      goDetail (row) {
        let params = {
          id: row.SignFileID,
          State: row.State
        }
        this.$store.commit('common/getThreeMenuName', row.SignFileName)
        this.$store.commit('common/getParam', params)
        this.$router.push({
          path: '/xyHome/sa/FileSign/FileSignStudentList',
          query: this.$store.state.common.menuInfo
        })
      },
      revoke (row) {
        this.$Modal.confirm({
          title: '撤回',
          content: '<p>您确认要撤回"' + row.SignFileName + '"吗？</p>',
          onOk: () => {
            this.revokePost(row)
          },
          onCancel: () => {
            // this.$Message.info('Clicked cancel')
          }
        })
      },
      async revokePost (row) {
        let rs = await this.xy.post(this.apiPath + '/api/SignFileManage/UnPublish?SignFileID=' + row.SignFileID)
        if (rs.success) {
          this.getTableList()
          this.xy.msgSuc('撤回成功。')
        }
      },
      edit (row) {
        console.log(1)
        let status = ''
        if (row.State === 1) {
          status = 'unPublish'
        } else if (row.State === 2) {
          status = 'publish'
        }
        let params = {
          type: status,
          row: row.SignFileID
        }
        this.$store.commit('common/getThreeMenuName', row.SignFileName)
        this.$store.commit('common/getParam', params)
        this.$router.push({
          path: '/xyHome/sa/FileSign/createFileSign',
          query: this.$store.state.common.menuInfo
        })
      },
      DelFun (row) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除"' + row.SignFileName + '"吗？</p>',
          onOk: async () => {
            let rs = await this.xy.post(this.apiPath + '/api/SignFileManage/DelSignFile?SignFileID=' + row.SignFileID, null)
            if (rs.success) {
              this.getTableList()
              this.xy.msgSuc('删除成功。')
            }
          }
        })
      },
      changePage (index) {
        this.pageIndex = index
        this.getTableList()
      },
      changePageSize (size) {
        this.pageSize = size
        if (this.pageSize === 1) {
          this.getTableList()
        }
      },

      async getTableList () {
        let params = {
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          State: this.RecruittypeID,
          SeachTxt: this.seachText
        }
        this.xy.loading()
        this.isLoading = true
        let rs = await this.xy.get(this.apiPath + '/api/SignFileManage/GetSignFilePage', params)
        if (rs.success) {
          this.total = rs.data.totalRecords
          this.dataList = rs.data.data
        }
        this.xy.unloading()
        this.isLoading = false
      },
      // 搜索触发
      FromSubmit: function () {
        this.pageIndex = 1
        this.getTableList()
      },
      typeValueSearch () {
        this.pageIndex = 1
        this.getTableList()
      }

    }
  }
</script>
<style lang="less" scpoed>
  .table-wrap {
    background: #ffffff;

    .table-header {
      padding: 10px 10px 0 10px;
    }
  }

</style>
