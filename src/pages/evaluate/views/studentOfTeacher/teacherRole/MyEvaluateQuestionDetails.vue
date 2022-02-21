<template>
  <div class="xy-content-module">
      <div class="xy-content-title summary-footer">
        <div v-if="params.row.TeacherID" class="footer-bigBox">
            <div class="left-box">
              <div class="titSmall-box">
                  {{params.index+1}}. {{params.title}}
              </div>
                <span v-if="detailData.totalRecords>0">采集到<span>{{detailData.totalRecords}}</span>份</span>
            </div>
            <div class="right-box">
                <Input search v-model.trim="searchTxt" @on-search="FromSubmit" placeholder="请输入班级/内容关键字" class="xy-content-title-search" style="width: 200px;" />
            </div>
        </div>
      </div>
      <div v-if="detailData.totalRecords===0" class="no-data-box">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片"/>
        <span class="no-data-text">该搜索条件下没有结果。</span>
      </div>
      <div v-else class="xy-content-body details-box-wrap">
        <div class="details-box" v-for="(item, index) in detailData.data" :key="index">
            <div class="list-box">
              <div class="list-box-text">{{item.Text}}</div>
                <div class="listsmall">
                  <span>{{item.ClassName}}</span>
                  <span>{{item.AnswerTime}}</span>
                </div>
            </div>
        </div>
        <div class="text-right pr" style="margin-top:20px;">
          <page
            :total="total"
            :page-size="pageSize"
            :current="pageIndex"
            show-sizer
            show-total
            :page-size-opts="pages"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            >
          </page>
        </div>
      </div>
      <div class="backTop" ref="top" @click="toTop">
        <div class="top">
          <Icon type="ios-arrow-up" />
          回到顶部
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    components: {},
    data () {
      return {
        params: {}, // 上一页数据
        searchTxt: '',
        pageIndex: 1,
        pageSize: 15,
        total: 0, // 总条数
        pages: [15, 30, 50, 100], // xy.table.pages,
        detailData: []
      }
    },
    computed: {},
    watch: {},
    created () {
      if (JSON.parse(this.$store.state.evaluate.evaQuestion).questionID > 0) {
        this.params = JSON.parse(this.$store.state.evaluate.evaQuestion)
        this.detailsData()
      }
    },
    mounted () {
      // 回到顶部
      document.getElementById('scrollWrap').onscroll = () => {
        let h = document.getElementById('scrollWrap').scrollTop
        if (h > 400 && this.$refs.top !== undefined) {
          this.$refs.top.classList.add('show')
        } else {
          this.$refs.top.classList.remove('show')
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      document.getElementById('scrollWrap').onscroll = null
      next()
    },
    methods: {
      // 返回
      goBack () {
        this.$router.go(-1)
      },
      // 显示名字
      showName (name) {
        if (name != null) {
          if (/^[\u4e00-\u9fa5]+$/g.test(name)) {
            return name.length > 2 ? name.slice(-2) : name
          } else if (/^[A-Za-z]+$/g.test(name)) {
            return name.slice(0, 2)
          } else {
            return name.slice(0, 2)
          }
        }
      },
      // 详情数据
      async detailsData () {
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/StudentTeachingReport/GetSummaryTextDetailForProject`, {
          teacherID: this.params.row.TeacherID,
          questionID: this.params.questionID,
          classID: this.params.classID,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          searchTxt: this.searchTxt
        })
        if (res.success) {
          this.detailData = res.data
          this.total = res.data.totalRecords
        }
      },
      // 搜索
      FromSubmit () {
        this.pageIndex = 1
        this.searchTxt = this.searchTxt
        this.detailsData()
      },
      // 单击页码触发
      changePage (current) {
        $(window).scrollTop(0)
        this.pageIndex = current
        this.detailsData()
      },
      // 单击切换每页展示条数触发
      changePageSize (size) {
        $(window).scrollTop(0)
        this.pageSize = size
        if (this.pageIndex === 1) {
          this.detailsData()
        } else {
          this.pageIndex = 1
        }
      },
      toTop () {
        let h = document.getElementById('scrollWrap').scrollTop
        const time = setInterval(() => {
          document.getElementById('scrollWrap').scrollTop = h -= 20
          if (h <= 0) {
            clearInterval(time)
          }
        }, 10)
      }
    }
  }
</script>
<style lang="less" scoped>
.summary-footer{
    background: #ffffff;
    border-bottom:1px solid #E8E8E8;
}
.details-box-wrap{
  padding: 0 20px 20px;
  background: #ffffff;
}
.details-box{
  padding: 20px 0;
  border-bottom: 1px dashed #E8E8E8;
  .list-box-text{
    font-size: 14px;
    color: rgba(0, 0, 0, .65);
    line-height: 25px;
    padding-right: 72px;
  }
}
.listsmall{
  display: flex;
  margin-top: 15px;
    color: rgba(0, 0, 0, .45);
}
.listsmall :nth-child(1){
  margin-right: 15px;
}
.notice-ajust-person.woman{
  background-color: #FF81AC;
}
.footer-bigBox{
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
}
.left-box{
    display:flex;
    flex-direction: column;
    padding-top:1px;
    padding-bottom:2px;
}
.titSmall-box{
  font-weight: 700;
  color: rgba(0, 0, 0, .85);
}
.left-box>span{
    font-size:14px;
    color: rgba(0, 0, 0, .65);
    margin-top:19px;
    margin-left: 16px;
}
.backTop{
  display: none;
  width: 100px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.1);
  border-radius: 4px;
  position: fixed;
  bottom: 100px;
  right: 50px;
  padding: 0 10px;
  cursor: pointer;
  .top{
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    line-height: 40px;
  }
}
.show{
  display: block !important;
}
</style>
