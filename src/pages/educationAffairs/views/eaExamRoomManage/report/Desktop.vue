<template>
<!-- 桌面贴 -->
<div id="StepsContent">
    <div class="exports">
        <i-button @click="exports" type="primary">导出</i-button>
        <p>{{selSit.BuildingName}}{{selSit.HouseName}}</p>
    </div>
    <div id="Des" v-if='list.length>0'>
        <div class="Des_left">
            <div  :class="{left_fiexd:isFiexd}">
              <p>考场名称</p>
              <ul ref="Des_left_ul">
                  <li v-for='(item,index) in list' :key="item.id" v-text='item.ArrangeSupervisorExamRoomName' :class='{isSel:item.isSelect}' @click='ChangeRoom(index)'></li>
              </ul>
            </div>

        </div>
        <div class="Des_right" ref="Des_right">
            <XyAntTable
              :columns="columns"
              :dataSource="sourceList"
              :tableLoading="tableLoading"
              :isPage="false"
              :scrollx="'max-content'"
              >
              <div style="min-width: 120px" slot="SubjectName" slot-scope="text, record">
                {{record.SubjectName}}
              </div>
              <div style="min-width: 200px" slot="AchievementDateName" slot-scope="text, record">
                {{record.AchievementDateName}}
              </div>
              <div style="min-width: 120px" slot="StudentCount" slot-scope="text, record">
                {{record.StudentCount}} 人
              </div>
              <div style="min-width: 160px" slot="TeacherName" slot-scope="text, record">
                {{record.TeacherName.replace(/[\s]+/g, ",")}}
              </div>
            </XyAntTable>
        </div>

    </div>
</div>
</template>

<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'Desltop',
    data () {
      return {
        // 左树位置变化
        isFiexd: false,
        // 每次加载更多加载的卡片数量
        addNum: 12,
        ArrangeSupervisorExamID: 0,
        list: [],
        // 当前选择地考场
        selSit: {},
        // 展示的卡片列表
        cardList: [],
        empty: [],
        // 源卡片数组
        sourceList: [],
        columns: [
          {
            title: '监考科目',
            dataIndex: 'SubjectName',
            scopedSlots: { customRender: 'SubjectName' }
          },
          {
            title: '监考时间',
            dataIndex: 'AchievementDateName',
            scopedSlots: { customRender: 'AchievementDateName' }
          },
          {
            title: '考场人数',
            dataIndex: 'StudentCount',
            scopedSlots: { customRender: 'StudentCount' }
          },
          {
            title: '监考教师',
            dataIndex: 'TeacherName',
            scopedSlots: { customRender: 'TeacherName' }
          }
        ]
      }
    },
    props: ['ASExamID'],
    watch: {
      ASExamID (newVal, oldVal) {
        this.ArrangeSupervisorExamID = newVal
        this.GetAllArrangeExamRoom()
      }
    },
    created () {
      this.ArrangeSupervisorExamID = this.ASExamID
      this.GetAllArrangeExamRoom()
      window.addEventListener('resize', () => {
        this.AddCard()
      }, false)
    },
    beforeDestroy () {
      window.onscroll = null
      window.removeEventListener('resize', () => {
        this.AddCard()
      }, true)
    },
    mounted () {
      window.onscroll = () => {
        this.ChangeLeft()
      }
    },
    methods: {
      // -------------------------------------操作-----------------------------------

      // 导出
      exports () {
        this.xy.downFile(`${this.$store.state.apiPath}/api/ReportSummary/ExportExamDesktopPasteList`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        })
      },

      // 获取考场
      async GetAllArrangeExamRoom () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeExamSetting/GetClassRoomsByExamId`, {
          ArrangeSupervisorExamID: this.ArrangeSupervisorExamID
        })
        if (res.success) {
          this.xy.unloading()
          res.data.forEach((item) => {
            item.isSelect = false
          })
          if (res.data.length > 0) {
            res.data[0].isSelect = true
          }
          this.list = res.data
          this.selSit = this.list[0] // 默认选中第一考场
          this.GetExamDesktopPasteList() // 获取桌面帖
        }
      },
      // 获取桌面帖
      async GetExamDesktopPasteList () {
        if (this.selSit) {
          this.tableLoading = true
          let res = await this.xy.get(`${this.$store.state.apiPath}/api/ReportSummary/GetExamDesktopPasteList`, {
            ArrangeSupervisorExamID: this.ArrangeSupervisorExamID,
            ArrangeSupervisorExamRoomID: this.selSit.ArrangeSupervisorExamRoomID
          })
          this.tableLoading = false
          if (res.success) {
            this.sourceList = res.data
            this.cardList = this.sourceList
            this.AddCard()
          }
        } else {
          this.sourceList = []
        }
      },
      ChangeRoom (index) {
        // 改变样式
        this.list = this.list.map((item) => {
          item.isSelect = false
          return item
        })
        this.list[index].isSelect = true
        this.selSit = this.list[index]
        this.GetExamDesktopPasteList()
      },
      // 加载更多
      LoadMore () {
        var cardListLength = this.cardList.length
        var addArray = []
        addArray = this.sourceList.slice(cardListLength, cardListLength + this.addNum)
        this.cardList.push.apply(this.cardList, addArray)
        this.AddCard()
      },
      // --------------------------------------样式控制-------------------------------

      // 左树位置变化
      ChangeLeft () {
        var top = document.documentElement.scrollTop || document.body.scrollTop
        // this.isFiexd = top > 280 ? true : false;
        var h = document.documentElement.clientHeight || document.body.clientHeight
        if (top > 280) {
          this.isFiexd = true
          this.$refs.Des_left_ul.style.maxHeight = h - 150 + 'px'
        } else {
          this.isFiexd = false
          this.$refs.Des_left_ul.style.maxHeight = '618px'
        }
      },
      // 最后一行添加空卡片保证左对齐
      AddCard () {
        this.empty = []
        // 卡片内容区宽度
        // 每一排展示卡片的数量
        this.$nextTick(() => {
          if (this.$refs.card) {
            var cardWidth = this.$refs.card ? this.$refs.card.offsetWidth : 0
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
#Des {
  /* background-color: bisque; */
  display: flex;
  justify-content: space-between;
  height: 570px;
  margin: 20px;
  border: 1px solid #e8e8e8;
}
.exports {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    font-weight: bold;
    font-size: 14px;

  }
}
.isSel {
  background-color: #F2F2F2;
  width: 198px;
}
/* 左 */
.Des_left {
  width: 198px;
  flex-basis: 198px;
  border-right: 1px solid #e8e8e8;
  padding-top: 10px;
}
.Des_left>div{
  width: 198px;
  /* overflow-x: hidden; */
}
.Des_left ul {
  width: 197px;
  // overflow-y: auto;
  // overflow-x: hidden;
  // max-height: 789px;
  overflow: hidden;
  overflow-y: auto;
  max-height: 506px;
}
.Des_left > div > p {
  font-weight: bold;
  padding-left: 26px;
  line-height: 52px;
  height: 52px;
}
.Des_left  ul > li {
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  padding-left: 44px;
}
.left_fiexd {
  width: 198px;
  position: fixed;
  top: 50px;
}
/* 右 */
.Des_right {
  width: 500px;
  flex-grow: 1;
}
.Des_right > p {
  padding: 14px 24px 0;
  font-weight: bold;
  font-size: 16px;
  line-height: 56px;
}
.Des_right span {
  vertical-align: middle;
  margin-left: 10px;
}
.card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.card_div {
  flex-grow: 0;
  width: 350px;
  height: 180px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(67, 90, 114, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 40px;
  font-weight: bold;
  font-size: 14px;
  margin-right: 20px;
}
.empty{
  width: 350px;
  margin-right: 20px;
}
.card_div_title {
  max-width: 310px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  height: 26px;
  line-height: 26px;
  padding: 0px 15px;
  margin: 10px 0;
  background: rgba(65, 150, 255, 0.1);
  border-radius: 14px;
  color: rgba(65, 150, 255, 1);
}
.card_div > div {
  height: 75px;
  background: rgba(249, 250, 255, 1);
  border: 1px solid rgba(221, 233, 251, 1);
  font-size: 14px;
  padding: 15px;
  font-weight: 400;
}
.card_div > div >p{
  margin-bottom: 5px;
  color:rgba(102,102,102,1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card_div > div span{
  vertical-align: baseline;
  color:rgba(51,51,51,1);
}
.cardP {
  display: flex;
  align-items: center;
}
.cardP >p {
  margin-bottom: 5px;
  color:rgba(102,102,102,1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 6px;
  margin-right: 10px;
}
.cardP .cardSpan {
  color:rgba(51,51,51,1);
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
