<template>
<!-- 考场名单 -->
<div id="StepsContent">
    <div class="exports">
        <Button @click="exports" type="primary">导出</Button>
        <i-input search v-model.trim="searchName" placeholder="请输入用户名/姓名" @on-search="FromSubmit" @on-enter='FromSubmit'
            class="fr xy-content-title-search" style="width: auto;">
            <icon type="ios-search cursor-p" slot="suffix" />
        </i-input>
    </div>
    <div id="Roster" v-if='list.length>0'>
        <div class="Roster_left">
            <div :class="{left_fiexd:isFiexd}" class="div_parent">
                <div v-for='(item,index) in list' :key="item.id">
                    <div class="list_parent" @click='open(index)'>
                      <div class="duration sel_wrap">
                        <div class="sel"></div>
                      </div>
                        <div v-text='item.SubjectName'></div>
                    </div>
                    <ul class="list_parent_list isOpen">
                        <li
                          v-for='(t,i) in item.RoomDetail'
                          class="list_child nowrap"
                          @click='changeSelSit(t,index,i)'
                          :class="{select_style:t.isSelect}"
                          :title="t.ArrangeSupervisorExamRoomName+'('+ t.StudentCount+'人)'"
                          :key="t.ArrangeSupervisorResultID"
                          v-cloak
                          >
                          {{t.ArrangeSupervisorExamRoomName}}  ({{t.StudentCount}} 人)
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        <div class="Roster_right" ref="Roster_right">
          <XyAntTable
            :columns="columns"
            :dataSource="sourceList"
            :tableLoading="tableLoading"
            :isPage="false"
            :scrollx="'max-content'"
            :scrolly="526"
            >
            <div slot="Icon" slot-scope="text, record">
              <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
                <span class="head-font">
                  {{ xy.showName(record.StudentName)}}
                </span>
              </div>
              <img style="width:30px;height:30px;border-radius:50%" v-else :src="$store.state.apiPath + record.Icon + '?' + Math.random() * 15">
            </div>
            <div slot="StudentName" style="min-width:240px" slot-scope="text, record">
              <span>
                {{record.StudentName}}
              </span>
            </div>
            <div slot="UserName" style="min-width:240px" slot-scope="text, record">
              <span>
                {{record.UserName}}
              </span>
            </div>
            <div slot="TeachingClassName" style="min-width:240px" slot-scope="text, record">
              <span>
                {{record.TeachingClassName}}
              </span>
            </div>
          </XyAntTable>
        </div>
    </div>

</div>

</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'Roster',
    components: {
      XyAntTable
    },
    data () {
      return {
        isFiexd: false,
        // 选择的考场
        selSit: {},
        // 选择的科目
        selSub: '',
        searchName: '',
        ArrangeSupervisorResultID: '', // 考场id
        list: [],
        // 展示的卡片列表
        cardList: [],
        // 源卡片数组卡片列表
        sourceList: [],
        sourceListCopy: [],
        cardNum: 12, // 卡片数量，默认显示6个
        openMenu: { parentIndex: 0, childIndex: 0 }, // 需要展开的菜单树,
        empty: [[]],
        ArrangeSupervisorExamID: 0,
        FixedSubjectType: 0,
        pagination: {
          total: 0,
          current: 1, // 当前页
          pageSize: 15, // 每页中显示15条数据
          onChange: (current) => {
            this.pagination.current = current
          },
          onShowSizeChange: (current, pageSize) => {
            this.pagination.current = 1
            this.pagination.pageSize = pageSize
          }
        },
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'StudentName',
            scopedSlots: { customRender: 'StudentName' }
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            scopedSlots: { customRender: 'UserName' }
          },
          {
            title: '班级',
            dataIndex: 'TeachingClassName',
            scopedSlots: { customRender: 'TeachingClassName' }
          },
          {
            title: '座位号',
            dataIndex: 'SeatNumber',
            width: 120
          },
          {
            title: '准考证号',
            width: 140,
            dataIndex: 'AdmissionTicketNumber'
          }
        ],
        tableLoading: false,
        isSearchEmpty: false
      }
    },
    props: ['ASExamID', 'FSType'],
    watch: {
      ASExamID (newVal, oldVal) {
        this.ArrangeSupervisorExamID = newVal
        this.GetAllExamSubjectInRoomInfo()
      },
      FSType (newVal, oldVal) {
        this.FixedSubjectType = newVal
      }
    },
    created () {
      this.ArrangeSupervisorExamID = this.ASExamID
      this.GetAllExamSubjectInRoomInfo()
    },
    mounted () {
      window.onscroll = () => {
        this.ChangeLeft()
      }
      window.addEventListener('resize', () => {
        this.AddCard()
      }, false)
      if (this.$refs.empty) {
        this.$nextTick(() => {
          var cardWidth = this.$refs.card ? this.$refs.card.offsetWidth : 0
          var cardChildrenWidth = this.$refs.empty[0] ? this.$refs.empty[0].offsetWidth : 0
          this.cardNum = Math.floor(cardWidth / (cardChildrenWidth + 20)) * 3 // 每排放置的卡片数量
        })
      }
    },
    beforeDestroy () {
      window.removeEventListener('resize', () => {
        this.AddCard()
      }, false)
      window.onscroll = null
    },
    methods: {
      handleTableChange () {
        this.GetAllExamSubjectInRoomInfo()
      },
      // 获取菜单树
      async GetAllExamSubjectInRoomInfo () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeExamSetting/GetAllExamSubjectInRoomInfo`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        })
        this.xy.unloading()
        if (res.success) {
          this.list = res.data
          if (res.data.length > 0) {
            res.data.map((item, index) => {
              this.$set(item, 'isSelect', index === 0)
              if (item.RoomDetail.length > 0) {
                item.RoomDetail.map((i, t) => {
                  this.$set(i, 'isSelect', !!(t === 0 && index === 0))
                })
              }
            })
            this.selSit = this.list[0].RoomDetail[0]
            this.selSub = this.list[0].SubjectName
          }
          if (this.list.length > 0) {
            this.ArrangeSupervisorResultID = this.list[0].RoomDetail[0].ArrangeSupervisorResultID
            this.getStudentInfo()
          }
        }
      },
      // -----------------------------------------操作---------------------------------
      // 导出
      exports () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSummary/ExportInvigilatorExamListTableByID`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          FixedSubjectType: 2
        })
      },
      // 加载更多
      LoadMore () {
        var cardListLength = this.cardList.length
        var addArray = []
        addArray = this.sourceList.slice(cardListLength, cardListLength + this.cardNum)
        this.cardList.push.apply(this.cardList, addArray)
        this.AddCard()
      },
      // 选择具体考场
      changeSelSit (t, index, i) {
        this.selSit = t
        this.ArrangeSupervisorResultID = t.ArrangeSupervisorResultID
        this.selSub = this.list[index].SubjectName
        this.list.map((item) => {
          item.RoomDetail.forEach((item) => {
            item.isSelect = false
          })
        })
        if (this.list[index].RoomDetail.length > 0) {
          // this.list[index].RoomDetail.forEach((item) => {
          //   item.isSelect = false
          // })
          this.list[index].RoomDetail[i].isSelect = true
          this.openMenu = { parentIndex: index, childIndex: i }
        }
        this.getStudentInfo()
      },
      // 获取具体考场
      async getStudentInfo () {
        this.tableLoading = true
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeExamSetting/GetAllExamRooStudentInfo`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
          ArrangeSupervisorResultID: this.ArrangeSupervisorResultID
        })
        this.tableLoading = false
        if (res.success) {
          this.sourceList = res.data
          this.cardList = res.data.slice(0, this.cardNum)
          this.sourceListCopy = [].concat(JSON.parse(JSON.stringify(this.sourceList)))
          this.AddCard()
        }
      },
      // 搜索
      FromSubmit () {
        if (this.sourceListCopy.length === 0) {
          return
        }
        this.cardList = []
        this.sourceList = []
        if (this.searchName === '') {
          this.sourceList = this.sourceListCopy
        } else {
          this.sourceListCopy.map((item) => {
            if (item.StudentName && item.UserName) {
              if (item.StudentName.indexOf(this.searchName) >= 0 || item.UserName.indexOf(this.searchName) >= 0) {
                this.sourceList.push(item)
              }
            }
          })
        }
        // 超过12个，只展示12个
        if (this.sourceList.length > this.cardNum) {
          this.cardList = this.sourceList.slice(0, this.cardNum)
        } else {
          this.cardList = this.sourceList
        }
        this.AddCard()
      },

      // --------------------------样式控制------------------------------
      // 左侧子树展开
      open (index) {
        // this.list.forEach((item, i) => {
        //   if (index !== i) {
        //     item.isSelect = false
        //     if (item.RoomDetail.length > 0) {
        //       item.RoomDetail.map((i) => {
        //         i.isSelect = false
        //       })
        //     }
        //   }
        //   if (index === this.openMenu.parentIndex) {
        //     this.list[this.openMenu.parentIndex].RoomDetail[this.openMenu.childIndex].isSelect = true
        //   }
        // })
        // this.list[index].isSelect = !this.list[index].isSelect
      },
      // 左树位置变化
      ChangeLeft () {
        var top = document.documentElement.scrollTop || document.body.scrollTop
        if (this.cardList.length < this.cardNum + 1) {
          this.isFiexd = false
        } else {
          this.isFiexd = top > 280
        }
      },
      // 最后一行添加空卡片保证左对齐
      AddCard () {
        this.empty = []
        // 卡片内容区宽度
        // 每一排展示卡片的数量
        this.$nextTick(() => {
          if (this.$refs.card) {
            var cardWidth = this.$refs.card.offsetWidth
            var cardChildrenWidth = document.getElementsByClassName('card_div').offsetWidth
            var cardChildren = [].slice.call(document.getElementsByClassName('card_div'))
            var num1 = Math.floor(cardWidth / (cardChildrenWidth + 20)) // 每排放置的卡片数量
            if (this.cardList.length >= num1) { // 卡片数量超过一排
              this.$refs.card.style.justifyContent = 'space-between'
              cardChildren.forEach((item) => {
                item.style.marginRight = '20px'
              })
              // 需要在末尾添加的空卡片数量
              var num2 = num1 - (this.cardList.length) % num1
              if (num2 === num1) {
                num2 = 0
              }
              for (var i = 0; i < num2; i++) {
                this.empty.push([])
              }
            } else { // 卡片数量未超过一排
              this.$refs.card.style.justifyContent = 'flex-start'
              cardChildren.forEach((item) => {
                item.style.marginRight = '40px'
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
#StepsContent {
  padding-bottom: 20px;
}
#Roster {
  /* background-color: bisque; */
  display: flex;
  justify-content: space-between;
  border: 1px solid #E8E8E8;
  margin: 20px;
  height: 573px;
}

.exports {
  padding: 20px;
}

/* 左 */
.Roster_left {
  overflow-y: auto;
  width: 290px;
  flex-basis: 290px;
  background-color: #fff;
  border-right: 1px solid #E8E8E8;
}
.div_parent{
  width: 282px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 14px;
}

.list_parent {
  font-size: 16px;
  line-height: 36px;
  padding: 0 26px;
  cursor: pointer;
  display: flex;
  align-items: center;
  .sel_wrap {
    width: 12px;
    height: 6px;
    margin-right: 6px;
    overflow: hidden;
  }
  .sel {
    width:12px;
    height: 12px;
    background: #999;
    transform: rotate(45deg);
    position: relative;
    top: -8px;
  }
}

.list_parent_list {
  width: 282pxs;
  cursor: pointer;
  max-height: 0px;
  overflow: hidden;
  transition-duration: 0.5s;
}

.list_child {
  height: 40px;
  line-height: 40px;
  padding-left: 40px;
}

.select_style,.list_child:hover {
  background-color: #F2F2F2;
}

.isOpen {
  max-height: 5000px;
  overflow-y: auto;
  overflow-x: hidden;
  transition-duration: 1.5s;
}

.arrow_rotate {
  transform: rotate(180deg);
}

.duration {
  /* transform-origin: 6px 6px; */
  transition-duration: 0.5s;
}

.left_fiexd {
  width: 282px;
  position: fixed;
  top: 50px;
}

/* 右 */
.Roster_right {
  width: 500px;
  flex-grow: 1;
  /* background-color: rgb(235, 167, 167) */
}

.Roster_right_title {
  text-align: center;
  font-weight: bolder;
  margin-bottom: 20px;
}

.Roster_right_title>span {
  display: inline-block;
  margin-right: 20px;
  font-size: 16px;
}

.card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.card_div {
  flex-grow: 0;
  width: 339px;
  border: 2px solid rgba(120, 180, 253, 1);
  border-radius: 6px;
  margin-bottom: 30px;
  padding-top: 10px;
  padding-right: 1px;
}
.empty{
  width: 339px;
  margin-right: 20px;
}

.card_title {
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
  margin-bottom: 45px;
  position: relative;
}

.card_title>span:nth-of-type(1),
.card_title>span:nth-of-type(3) {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0px);
}

.card_title>span:nth-of-type(1) {
  top: 10px;
}

.card_title>span:nth-of-type(3) {
  top: 50px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}

.card .card_num {
  display: inline-block;
  width: 60px;
  height: 30px;
  text-align: center;
  background: rgba(236, 250, 231, 1);
  border-radius: 15px 0px 0px 15px;
  font-weight: bold;
  color: rgba(79, 150, 35, 1);
}

.card_bottom {
  display: flex;
  justify-content: space-between;
  padding: 16px 23px 0;
}

.card_bottom .class {
  width: 35px;
}

.card_bottom .username {
  width: 46px;
}

.card_bottom>div {
  color: rgba(102, 102, 102, 1);
  margin-bottom: 13px;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card_bottom .cardSpan {
  font-size: 14px;
  margin-left: 5px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  vertical-align: text-top;
}

.load_more {
  text-align: center;
  height: 46px;
  line-height: 46px;
  background: rgba(243, 243, 243, 1);
  border-radius: 4px;
  font-size: 14px;
  color: rgba(96, 98, 102, 1);
  cursor: pointer;
}
</style>
