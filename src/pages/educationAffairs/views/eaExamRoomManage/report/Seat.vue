<template>
<!-- 座位签 -->
  <div id="StepsContent">
    <div class="exports">
      <Button  @click="exports" type="primary">导出</Button>
      <div>{{RoomAddress}}</div>
    </div>
    <div id="Seat">
      <div class="Seat_left" v-if="list.length>0">
        <ul :class="{left_fiexd:isFiexd}" ref="Des_left_ul">
          <li>
            考场名称
          </li>
          <li
            v-for="(item,index) in list"
            :key="item.ArrangeSupervisorExamRoomID"
            v-text="item.ArrangeSupervisorExamRoomName"
            :class="{isSel:item.isSelect}"
            @click="ChangeRoom(index)"
          ></li>
        </ul>
      </div>
      <!-- ---------------------------------形式一---------------------------------- -->
      <div class="Seat_right" ref="Seat_right" v-show="FixedSubjectType===1">
        <p>
          {{ArrangeSupervisorExamName}}
        </p>
        <XyAntTable
          :columns="columns"
          :dataSource="cardList"
          :tableLoading="tableLoading"
          :isPage="false"
          :scrollx="'max-content'"
          >
          <div slot="Icon" slot-scope="text, record">
            <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
              <span class="head-font">
                {{ xy.showName(record.StudentName)}}
              </span>
            </div>
            <img style="width:30px;height:30px;border-radius:50%" v-else :src="$store.state.apiPath + record.Icon + '?' + Math.random() * 15">
          </div>
          <div style="min-width: 120px" slot="StudentName" slot-scope="text, record">
            {{record.StudentName}}
          </div>
          <div style="min-width: 120px" slot="AdmissionTicketNumber" slot-scope="text, record">
            {{record.AdmissionTicketNumber}}
          </div>
        </XyAntTable>
      </div>
      <!-- ----------------------------------------------形式二-------------------------- -->
      <div
        class="Seat_right_two"
        v-show="FixedSubjectType===3 || FixedSubjectType===2"
        ref="card2"
        >
        <div class="goback" v-show="isFiexd" @click="GoBack">
          <img src="./Image/goback.png" />
        </div>
        <div v-if="sourceList2.length<1 && tableLoading === false" class="no-data-box" v-cloak>
          <img class="no-data-img" :src="require('@/assets/common/nullData.svg')" />
          <span class="no-data-text" v-cloak>您还没有对应考场的信息，请发布排考场方案。</span>
        </div>
        <div v-else v-for="(item,index) in sourceList2" :key="index" class="card_site">
          <p>
            <span class="card_site_num" v-cloak>
              <span>座位号</span>
              <b>
                <b v-if="item.SeatNumber < 10">0</b>{{item.SeatNumber}}
              </b>
            </span>
          </p>
          <XyAntTable
            :columns="columns2"
            :dataSource="item.DetailInfiList"
            :tableLoading="tableLoading"
            :isPage="false"
            :isTop="false"
            :scrollx="'max-content'"
            >
            <div slot="Icon" slot-scope="text, record">
              <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
                <span class="head-font">
                  {{ xy.showName(record.StudentName)}}
                </span>
              </div>
              <img style="width:30px;height:30px;border-radius:50%" v-else :src="$store.state.apiPath + record.Icon + '?' + Math.random() * 15">
            </div>
          </XyAntTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    name: 'Seat',
    components: {
      XyAntTable
    },
    data () {
      return {
        w: '',
        timer: '',
        isFixation: true,
        isFiexd: false,
        ArrangeSupervisorExamID: 0,
        FixedSubjectType: 0,
        ArrangeSupervisorExamName: '',
        // 每次加载更多加载的卡片数量
        addNum: 12,
        list: [],
        // 当前选择地考场
        selSit: {},
        // 样式一展示的卡片列表
        cardList: [],
        // 样式一源卡片数组
        sourceList: [],
        // 样式二源卡片数组
        sourceList2: [],
        empty: [[]],
        tableLoading: true,
        RoomAddress: '',
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            align: 'right',
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'StudentName',
            scopedSlots: { customRender: 'StudentName' }
          },
          {
            title: '准考证号',
            dataIndex: 'AdmissionTicketNumber',
            scopedSlots: { customRender: 'AdmissionTicketNumber' }
          },
          {
            title: '班级',
            dataIndex: 'StudentOrganizationName',
            width: 200
          },
          {
            title: '座位号',
            dataIndex: 'SeatNumber',
            width: 150
          }
        ],
        columns2: [
          {
            title: ' ',
            dataIndex: 'Icon',
            width: 40,
            align: 'right',
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic'
          },
          {
            title: '姓名',
            dataIndex: 'StudentName',
            scopedSlots: { customRender: 'StudentName' }
          },
          {
            title: '准考证号',
            dataIndex: 'AdmissionTicketNumber',
            scopedSlots: { customRender: 'AdmissionTicketNumber' }
          },
          {
            title: '课程',
            dataIndex: 'SubjectName',
            width: 120
          },
          {
            title: '考试时间',
            dataIndex: 'AchievementDateName',
            width: 200
          }
        ]
      }
    },
    props: ['ASExamID', 'FSType'],
    watch: {
      ASExamID (newVal, oldVal) {
        this.ArrangeSupervisorExamID = newVal
        this.GetAllArrangeExamRoom()
        this.GetExamSeatSignFixedList()
      },
      FSType (newVal, oldVal) {
        this.FixedSubjectType = newVal
      }
    },
    created () {
      // 获取考试方案和展示类型
      this.ArrangeSupervisorExamID = this.ASExamID
      this.FixedSubjectType = this.FSType
      this.GetAllArrangeExamRoom()
    },
    mounted () {
      this.w = document.getElementById('scrollWrap')
      this.w.onscroll = () => {
        this.ChangeLeft()
      }
      this.w.onresize = () => {
        this.computedAddnum()
        this.AddCard()
      }
      this.computedAddnum()
      // 获取考场信息
      this.GetAllArrangeExamRoom()
    },
    beforeDestroy () {
      this.w.onscroll = null
      this.w.onresize = null
    },
    methods: {
      // 导出
      exports () {
        if (this.FixedSubjectType === 1) {
          this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSummary/ExportExamSeatSignFixedList`, {
            ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
            FixedSubjectType: this.FixedSubjectType
          })
        } else {
          this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSummary/ExportExamSeatSignUNFixedList`, {
            ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
            FixedSubjectType: this.FixedSubjectType
          })
        }
      },

      // ------------------------------------------操作------------------------------------------

      // 获取考场
      async GetAllArrangeExamRoom () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeExamSetting/GetClassRoomsByExamId`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        })
        if (res.success) {
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              item.isSelect = false
            })
            res.data[0].isSelect = true
          }
          this.list = res.data
          this.selSit = this.list[0] // 默认选中第一考场
          this.GetExamSeatSignFixedList() // 获取座位签
        }
      },
      // 获取座位签
      async GetExamSeatSignFixedList () {
        this.tableLoading = true
        if (this.FixedSubjectType === 1) { // 固定类型
          if (this.selSit) {
            let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSummary/GetExamSeatSignFixedList`, {
              ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
              FixedSubjectType: this.FixedSubjectType,
              ArrangeSupervisorExamRoomID: this.selSit.ArrangeSupervisorExamRoomID
            })
            this.tableLoading = false
            if (res.success) {
              this.sourceList = res.data
              this.RoomAddress = res.data.length > 0 ? res.data[0].RoomAddress : ''
              this.cardList = this.addNum === 0 ? this.sourceList.slice(0) : this.sourceList.slice(0, this.addNum)
              if (res.data.length > 0) {
                this.ArrangeSupervisorExamName = res.data[0].ArrangeSupervisorExamName
              }
              this.AddCard()
            }
          } else {
            this.sourceList = []
          }
        } else {
          if (this.selSit) {
            let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSummary/GetExamSeatSignUNFixedList`, {
              ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
              FixedSubjectType: this.FixedSubjectType,
              ArrangeSupervisorExamRoomID: this.selSit.ArrangeSupervisorExamRoomID
            })
            this.tableLoading = false
            if (res.success) {
              if (res.data.length > 0) {
                this.sourceList2 = res.data
                this.RoomAddress = res.data[0].RoomAddress
                this.ArrangeSupervisorExamName = res.data[0].ArrangeSupervisorExamName
                this.AddCard()
              } else {
                this.sourceList2 = []
              }
            }
          } else {
            this.sourceList2 = []
          }
        }
      },
      // 切换考场
      ChangeRoom (index) {
        // 改变样式
        this.list = this.list.map((item) => {
          item.isSelect = false
          return item
        })
        this.list[index].isSelect = true
        this.selSit = this.list[index]
        this.GetExamSeatSignFixedList()
      },
      // 加载更多
      LoadMore () {
        var cardListLength = this.cardList.length
        var addArray = []
        addArray = this.sourceList.slice(cardListLength, cardListLength + this.addNum)
        this.cardList.push.apply(this.cardList, addArray)
        this.AddCard()
      },
      // ---------------------------------------样式控制-------------------------------------------
      // 返回顶部
      GoBack () {
        this.timer = setInterval(() => {
          var currentScroll = this.w.scrollTop
          var speed = currentScroll / 5
          if (currentScroll > 0) {
            this.w.scrollTop -= speed
          }
          if (currentScroll <= 0) {
            clearInterval(this.timer)
          }
        }, 12)
      },
      ChangeLeft () {
        // 左树位置变化
        var top = this.w.scrollTop
        var h = this.w.clientHeigh
        this.$nextTick(() => {
          if (this.$refs.Des_left_ul) {
            if (top > 280) {
              this.isFiexd = true
              this.$refs.Des_left_ul.style.maxHeight = h - 150 + 'px'
            } else {
              this.isFiexd = false
              this.$refs.Des_left_ul.style.maxHeight = '618px'
            }
          }
        })
      },
      // 最后一行添加空卡片保证左对齐
      AddCard () {
        if (!this.FixedSubjectType === 1) {
          return
        }

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
      },
      computedAddnum () {
        this.$nextTick(() => {
          var cardWidth = this.$refs.card ? this.$refs.card.offsetWidth : 0
          var cardChildrenWidth = 339
          this.addNum = Math.floor(cardWidth / (cardChildrenWidth + 20)) * 2 // 每排放置的卡片数量
        })
      }
    }
  }
</script>

<style lang="less" scoped>
#StepsContent {
  padding-bottom: 20px;
}
#Seat {
    display: flex;
    justify-content: space-between;
    border: 1px solid #e8e8e8;
    height: 641px;
    margin: 20px;
}

.exports {
  padding: 20px;
}

.no-data-box > .no-data-text {
    font-weight: 400;
    color: #7f7f7f !important;
}

.exports {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    >div {
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
}

.isSel {
    /* background-color: white; */
    background-color: #F2F2F2;
    width: 198px;
    /* color: #4196ff !important; */
}

/* 左 */
.Seat_left {
    width: 198px;
    flex-basis: 198px;
    min-height: 500px;
    border-right: 1px solid #e8e8e8;
    overflow-x: hidden;
    overflow-y: auto;
}

.Seat_left ul li:nth-child(1) {
  padding-left: 26px;
  font-weight: bold;
  line-height: 52px;
  height: 52px;
}

.left_fiexd {
    position: fixed;
    top: 50px;
}

.Seat_left>ul {
    width: 198px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 10px;
}

.Seat_left>ul>li {
    height: 40px;
    text-align: start;
    line-height: 40px;
    padding-left: 44px;
    cursor: pointer;
}

.Seat_left>ul>li:nth-child(1) {
  cursor: default;
}

/* 右 */
.Seat_right,
.Seat_right_two {
    width: 500px;
    flex-grow: 1;
    overflow-y: auto;
    padding: 0 20px;
}

.Seat_right>p {
  font-size: 16px;
  color: rgba(0,0,0,0.85);
  font-weight: bold;
  line-height: 70px;
}

.Seat_right>p,
.Seat_right_two>p {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    img {
      margin-right: 10px;
    }
}

.Seat_right span,
.Seat_right_two span {
    vertical-align: top;
    color: #333333;
    font-weight: bold;
}

.card {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

/* .card::after {
    content: "";
    width: 339px;
} */

.card_div {
    flex-grow: 0;
    width: 339px;
    height: 180px;
    border: 2px solid rgba(120, 180, 253, 1);
    border-radius: 8px;
    margin-bottom: 54px;
    padding-top: 21px;
    padding-right: 1px;
}
.Seat_right_two .card_div {
    border:0;
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
    width: 84px;
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
    padding: 28px 15px;
}

.card_bottom p {
    color: rgba(102, 102, 102, 1);
    margin-bottom: 13px;
}

.card_bottom p span {
    font-size: 14px;
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

/* 右第二种类型 */
.card_site>p {
    text-align: center;
    height: 70px;
    line-height: 60px;
    font-weight: bold;
    position: relative;
    font-size: 16px;
    color: rgba(0, 0, 0, .85);
}

.card_site_num {
    font-size: 16px;
    /*position: absolute;
    top: 0px;
    left: 30px;*/
    display: flex;
    align-items: center;
    span {
      margin-right: 5px;
    }
}

.card_site_content {
    display: flex;
    flex-wrap: wrap;
    justify-content:flex-start;
    padding: 0px 30px;
}

.card_site_content>div {
    width: 350px;
    height: 180px;
    box-shadow: 0px 0px 6px 0px rgba(67, 90, 114, 0.2);
    border-radius: 8px;
    margin-bottom: 40px;
    padding: 20px;
    padding-top: 12px;
    font-weight: bold;
    font-size: 14px;
    margin-right: 30px;
}

.card_site_sub {
    max-width: 310px;
    color: rgba(65, 150, 255, 1);
    display: inline-block;
    text-align: center;
    padding: 0 15px;
    height: 26px;
    line-height: 26px;
    background: rgba(65, 150, 255, 0.1);
    border-radius: 13px;
    margin: 10px 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.site_content_bottom {
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    background: rgba(249, 250, 255, 1);
    border: 1px solid rgba(221, 233, 251, 1);
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
}

.site_content_bottom>p>span {
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-left: 10px;
    vertical-align: baseline;
}

.site_content_bottom>p:nth-of-type(1) {
    margin-bottom: 10px;
}

.goback {
    display: inline-block;
    width: 40px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    border: 1px solid rgba(244, 244, 244, 1);
    box-shadow: 0px 2px 3px 0px rgba(207, 207, 207, 0.5);
    position: fixed;
    bottom: 100px;
    right: 5%;
    z-index: 3;
    cursor: pointer;
    border-radius: 50%;
    background: #f9f9f9;
}

.goback img {
    width: 50%;
}
</style>
