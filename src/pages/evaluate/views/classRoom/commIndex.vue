<template>
    <div class="index">
      <ul v-if="evaluInfo.length>0">
        <li><i class="iconfont">&#xe6f2;</i>一级指标</li>
        <li><i class="iconfont">&#xe6f2;</i>二级指标</li>
        <li><i class="iconfont">&#xe6f2;</i>三级指标</li>
      </ul>
      <div class="list" v-if="evaluInfo.length>0">
        <ul>
          <li v-for="(item, index) in evaluInfo" :key="item.StandardID" @click="getNext(index)" class="box-list1">
            <div>
              <p v-cloak :title="item.StandardName" :class="item.show ? 'show' : ''"><span></span>{{item.StandardName}}</p>
            </div>
            <ul class="box-list2" v-if="item.show">
              <li :style="`height: ${item1.StandardLevelNext.length * 100 + 2}px`" v-for="item1 in item.StandardLevelNext" :key="item1.StandardID">
                <div>
                  <p v-cloak :title="item1.StandardName"><span></span>{{item1.StandardName}}</p>
                </div>
                <ul class="box-list3">
                  <li>
                    <div v-for="(item2, index2) in item1.StandardLevelNext" :key="item2.StandardID">
                      <p v-cloak :title="item2.StandardName"><span></span>{{item2.StandardName}}</p>
                        <Rate
                          :custom-icon="'iconfont icon-Starunselectedbeifen'"
                          :count="item2.MaxValue"
                          @on-change="rateChange"
                          v-if="item2.Type === 'SC'"
                          clearable
                          v-model="item2.Value"
                          class="rate"
                          :style="index2 === item1.StandardLevelNext.length - 1 ? 'border-bottom: none;' : ''"/>
                        <InputNumber
                          :formatter="value=>parseInt(value)"
                          @on-change="rateChange"
                          v-if="item2.Type === 'NV'"
                          v-model="item2.Value"></InputNumber>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="no-data-box" v-if="evaluInfo.length===0">
        <img class="no-data-img" src="@/assets/common/nullData.svg" alt="图片" style="width:100%"/>
        <span class="no-data-text">暂无相关数据</span>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'commIndex',
    props: {
      evaluInfo: {
        type: Array,
        required: []
      },
      isEvaluation: {
        type: Boolean,
        required: false
      }
    },
    data () {
      return {
        value: 4,
        towPoint: [],
        threePoint: [],
        index: 0, // 记住上一次选中一级指标下标
        evaList: [], // 解决单向数据流报错的问题
        isNum: 1
      }
    },
    watch: {
      evaluInfo: {
        handler (newDt) {
          if (this.isNum === 1) {
            for (let i = 0, len = newDt.length; i < len; i++) {
              for (let j = 0, jlen = newDt[i].StandardLevelNext.length; j < jlen; j++) {
                for (let k = 0, klen = newDt[i].StandardLevelNext[j].StandardLevelNext.length; k < klen; k++) {
                  if (!this.isEvaluation) {
                    newDt[i].StandardLevelNext[j].StandardLevelNext[k].Value = newDt[i].StandardLevelNext[j].StandardLevelNext[k].DefaultValue
                  }
                }
              }
            }
          }
        },
        deep: true,
        immediate: true
      }
      // isEvaluation: {
      //   handler (val) {

      //   },
      //   deep: true,
      //   immediate: true
      // }
    },
    methods: {
      rateChange () {
        this.isNum = 2
      },
      // 切换一级指标
      getNext (index) {
        this.evaluInfo[this.index].show = false
        this.evaluInfo[index].show = true
        this.index = index
      },
      backList () {
        this.$emit('listenHandle', this.evaluInfo)
      }
    }
  }
</script>
<style lang="less" scoped>
  .index {
    height: 100%;
    > ul {
      display: flex;
      align-items: center;
      >li {
        padding: 0 20px;
        width: 33.33333%;
        background-color: #5696F7;
        font-size: 14px;
        color: #FFF;
        height: 50px;
        line-height: 50px;
        i {
          color: #FFF;
          margin-right: 4px;
        }
      }
    }
   .list {
     display: flex;
    overflow-y: auto;
    overflow-x: hidden;
    height: 630px;
     >ul {
       width: 33.3333333%;
      //  border-right: 2px dashed #EAEBEC;
       >li {
          display: flex;
          justify-content: center;
          flex-flow: column nowrap;
          border-bottom: 0;
          // border-bottom: 2px solid #ECEDEE;
         >div {
            min-height: 50px;
            width: 100%;
            padding: 26px 38px 0 38px;
            display: flex;
            align-items: center;
            padding: 0 10px;
            width: 90%;
            border-bottom: 2px solid #ECEDEE;
            cursor: pointer;
            >p {
              font-size: 14px;
                  color:rgba(0,0,0,0.85);
              >span {
                background:rgba(223,224,225,1);
                margin-right: 5px;
                display: inline-block;
                width:10px;
                height:10px;
                background: #4196FF;
                border-radius:50%;
              }
            }
            > .show {
              color: #4196FF !important;
              >span {
                background: #4196FF !important;
              }
            }
          }
       }
     }
     ul {
       min-width: 300px;
        position: relative;
      //  li {
          // display: flex;
          // justify-content: center;
          // flex-flow: column nowrap;
          // border-bottom: 2px solid #ECEDEE;
            .box-list2 {
              width: 100%;
              position: absolute;
              right: -100%;
              top: 0;
              >li {
                position: relative;
                border-bottom: 2px solid #ECEDEE;
                border-right: 2px dashed #EAEBEC;
                border-left: 2px dashed #EAEBEC;
                display: flex;
                justify-content: center;
                align-items: center;
                > div {
                min-height: 50px;
                width: 100%;
                padding: 26px 38px 0 38px;
                }
                p {
                  font-size: 14px;
                  color:rgba(0,0,0,0.85);
                  span {
                    margin-right: 5px;
                    display: inline-block;
                    width:10px;
                    height:10px;
                    background: #4196FF;
                    border-radius:50%;
                  }
                }
              }
              .box-list3 {
                width: 100%;
                position: absolute;
                right: -100%;
                top: 0;
                 >li {
                border-bottom: 2px solid #ECEDEE;
                > div {
                  height: 100px !important;
                  width: 100%;
                  padding: 26px 38px 0 38px;
                  .rate {
                        width: 100%;
                        margin-left: 12px;
                        padding-bottom: 20px;
                        border-bottom: 2px dashed #ECEDEE;
                  }
                }
                p {
                  font-size: 14px;
                  color:rgba(0,0,0,0.85);
                  span {
                    margin-right: 5px;
                    display: inline-block;
                    width:10px;
                    height:10px;
                    background: #4196FF;
                    border-radius:50%;
                  }
                }
              }
              }
            }
      //  }
     }
   }
  }
  .clear-border {
    border: none !important;
  }
</style>
