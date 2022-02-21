// 访客邀请详情通用组件
<template>
  <div class="detail">
    <Drawer :mask-closable="false" :title="'邀请详情'" @on-close="loadTable" width="560" v-model="modalImport">
      <div class="detailModel">
        <ul class="leave-list">
          <li class="info-item">
            <span class="title">主题</span>
            <span class="content">{{detailInfo.invatationInfo?detailInfo.invatationInfo.InvatationTitle:''}}</span>
          </li>
          <li class="info-item">
            <span class="title">邀请详情</span>
            <span class="content">{{detailInfo.invatationInfo?detailInfo.invatationInfo.InvatationContent:''}}</span>
          </li>
          <li class="info-item">
            <span class="title">到访时间</span>
            <span class="content">{{detailInfo.invatationInfo?detailInfo.invatationInfo.InvatationArriveTime:''}}</span>
          </li>
          <li class="info-item">
            <span class="title">邀约人</span>
            <span class="content">{{detailInfo.invatationInfo?detailInfo.invatationInfo.InvatationUser:''}}</span>
          </li>
          <li class="info-item">
            <span class="title">地址</span>
            <span class="content">{{detailInfo.invatationInfo?detailInfo.invatationInfo.InvatationArriveAddress:''}}</span>
          </li>
          <li class="info-item">
            <span class="title">邀约日期</span>
            <span class="content">{{detailInfo.invatationInfo?xy.moment(detailInfo.invatationInfo.CreateByDate).format('YYYY-MM-DD'):''}}</span>
          </li>
        </ul>
        <!-- 展示邀请名单 -->
        <p class="visitNameList-title">
          <span class="visitNameList-span1">邀请名单</span>
          <span class="visitNameList-span2">总数：{{detailListAll.length}}人</span>
        </p>
        <div class="visitNameList">
          <div class="visitNameListAll">
            <div v-for="(detailList,index) in detailListAll" :key="index" class="visitNameListAll-list">
              <span class="avatar">
                <span  :title="detailList.InvatationFullName" class="left fl" v-if="!detailList.Icon">{{xy.showName(detailList.InvatationFullName)}}</span>
                <img v-if="detailList.Icon" style="width: 50px;height: 50px;border-radius: 50%;float:left;" :src="detailList.Icon" alt="">
              </span>
              <span class="namephone">
                <span style="font-size:16px">{{detailList.InvatationFullName}}</span>
                <span >手机号：{{detailList.InvatationPhoneNumber}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>
<script>
  export default {
    props: {
      // row
      row: {
        type: Object
      },
      // isFrom
      isFrom: {
        type: Number
      },
      // tableType
      tableType: {
        type: String
      }
    },
    name: 'detail',
    data () {
      return {
        mainUrl: this.xyApi + '/base',
        modalImport: true,
        detailInfo: {},
        detailListAll: []
      }
    },
    watch: {
      row: {
        handler (newVal) {
          this.row = newVal
          this.getDetailInfo(newVal)
        },
        immediate: true
      },
      tableType (newVal) {
        this.tableType = newVal
      }
    },
    methods: {
      // 获取详情
      // 详情
      async getDetailInfo (row) {
        let res = await this.xy.get(
          this.xyApi + '/vst' + '/invatation/GetInvatationDetailInfo', { invatationInfoID: row.InvatationInfoID }
          // 'http://devpczx.xiaoyangedu.net:9092' + '/vst/invatation/GetInvatationDetailInfo', { invatationInfoID: row.InvatationInfoID }
        )
        if (res.success) {
          if (res.data !== null) {
            this.detailInfo = res.data
            this.detailListAll = this.detailInfo.invatationDetailInfo ? this.detailInfo.invatationDetailInfo : []
          }
        } else {
          this.xy.msgError(res.msg)
        }
      },
      showName (name) {
        return this.xy.showName(name)
      },
      xyFormatDate (date, format) {
        format = format || 'MM.dd HH:mm'
        return date ? this.xy.moment(date).format(format) : ''
      },
      // 关闭抽屉
      loadTable () {
        this.$emit('loadTable')
      }
    }
  }
</script>

<style lang="less" scoped>
.detailModel{
  .leave-list{
    font-size:14px;
   .info-item{
     margin-top:14px;
     .title{color:#999;display:inline-block;width: 70px;}
     .content{margin-left:10px;color:#333;display: inline-block;vertical-align: top;width: 80%;}
   }
  }
 }
 .visitNameList-title{
  margin: 30px 0 10px 0;
  display: flex;
  justify-content: space-between;
  .visitNameList-span1{
    color: #000;
    font-size: 16px;
  }
  .visitNameList-span2{
    color: #1677FF;
  }
 }
.visitNameListAll{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .visitNameListAll-list{
      height: 50px;
      margin: 14px;
      display: flex;
      align-items: center;
      .namephone{
        display: flex;
        flex-direction: column;
      }
    }
}
.avatar{
  padding:0;
  padding-right:15px;
  span{
    display:block;
    background:#4196ff;
    width:50px;height:50px;
    border-radius:50%;
    text-align:center;
    line-height:50px;
    font-size:18px;
    color:#fff
  }
}
</style>
