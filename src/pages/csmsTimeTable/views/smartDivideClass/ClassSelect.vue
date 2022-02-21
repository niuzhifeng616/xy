<!-- 筛选班级的下拉框 -->
<template>
  <div class="class-title">
    <div class="class-title-div">
      <span>班级:</span>
      <div class="class-selected" @click='showClassBox'>
        <p v-if='showClass.length==0'>请选择班级</p>
        <div v-else class="scroll-box">
          <Tag type="border"
              v-for='(i,index) in showClass'
              :key='index'
              closable
              @on-close='delClass(i)'>{{i.StudentOrganizationFullName}}</Tag>
        </div>
        <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"
          :class='isShowClass?"rotate":""'></i>
      </div>
    </div>

    <div class="class-box" v-if='isShowClass'>
      <Checkbox :value="classCheckAll"
        :indeterminate="indeterminate"
        @click.prevent.native="chooseAll"
        class="class-checkAll">
        全选
      </Checkbox>
      <checkbox-group v-model="classOrganizationIDs"
                      @on-change="checkAllGroupChange">
        <checkbox class='nowarp class-checkSingle'
                  :class='classOrganizationIDs.indexOf(i.StudentOrganizationID)!==-1?"active-lable":""'
                  :label="i.StudentOrganizationID"
                  :key='i.StudentOrganizationID'
                  v-for='i in moreClassList'
                  >
          {{i.StudentOrganizationFullName}}
        </checkbox>
      </checkbox-group>
      <Button size='small'
              @click='sure'
              class="sure-btn">查询</Button>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      moreClassList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        showClass: [],
        isShowClass: false,
        indeterminate: false,
        classCheckAll: false,
        classOrganizationIDs: [], // 已选择班级的id
        modal: false
      }
    },

    methods: {
      showClassBox () {
        this.isShowClass = !this.isShowClass
      },
      // 筛选班级-----------全选
      chooseAll (item, index) {
        if (this.indeterminate) {
          this.classCheckAll = false
        } else {
          this.classCheckAll = !this.classCheckAll
        }
        this.indeterminate = false
        if (this.classCheckAll) {
          let arr = []; let arrId = []
          this.moreClassList.map((item) => {
            arrId.push(item.StudentOrganizationID)
            arr.push(item)
          })
          this.showClass = arr
          this.classOrganizationIDs = arrId
        } else {
          this.classOrganizationIDs = []
          this.showClass = []
        }
      },
      // 单个改变
      checkAllGroupChange (data, type) {
        let that = this
        if (data.length === this.moreClassList.length && this.moreClassList.length > 0) {
          this.indeterminate = false
          this.classCheckAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.classCheckAll = false
        } else {
          this.indeterminate = false
          this.classCheckAll = false
        }

        if (!type) { // 通过勾选单个班级，控制tag
          let arr = []
          this.moreClassList.map((item) => {
            if (that.classOrganizationIDs.indexOf(item.StudentOrganizationID) !== -1) {
              arr.push(item)
            }
          })
          this.showClass = arr
        }
      },
      delClass (i) {
        let arr = []; let arrId = []
        this.showClass.map((item) => {
          if (i.StudentOrganizationID !== item.StudentOrganizationID) {
            arr.push(item)
            arrId.push(item.StudentOrganizationID)
          }
        })
        this.showClass = arr
        this.classOrganizationIDs = arrId
        this.checkAllGroupChange(arrId, true)
      },
      sure () {
        this.showClass = []
        this.moreClassList.map((item) => {
          if (this.classOrganizationIDs.length > 0) {
            this.classOrganizationIDs.map((t) => {
              if (t === item.StudentOrganizationID) {
                this.showClass.push(item)
              }
            })
          }
        })
        this.isShowClass = false
        this.$emit('sure', this.classOrganizationIDs)
      }
    }
  }
</script>
<style lang='less' scoped>
.class-title {
  display: flex;
  flex-direction: column;
}

.class-title > .class-title-div {
  display: flex;
}

.class-title-div > span {
  width: 50px;
  display: inline-block;
  line-height: 35px;
}

.class-selected {
  min-width: 200px;
  max-width: 330px;
  height: 35px;
  border: none;
  color: #515a6e;
  background-color: transparent;
  position: relative;
  cursor: pointer;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdee2;
  transition: all 0.2s ease-in-out;
  padding-left: 5px;
  padding-right: 30px;
  line-height: 32px;
}

.class-selected > .scroll-box {
  max-width: 310px;
  overflow-x: auto;
  white-space: nowrap;
}

.class-box {
  div {
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 200px;
    min-width: 144px;
  }
  position: absolute;
  z-index: 100;
  will-change: top, left;
  transform-origin: center top;
  top: 50px;
  width: 200px;
  border: 1px solid rgba(217, 217, 217, 1);
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  margin-left: 50px;
}
.rotate {
  transform: translateY(-50%) rotate(180deg);
}

/* 全选 */
.class-checkAll {
  width: 100%;
  border-bottom: 1px solid rgba(217, 217, 217, 1);
  padding: 5px;
}

.class-checkSingle {
  padding: 5px;
  margin-bottom: 5px;
  width: 100%;
  border-bottom: 1px solid rgba(217, 217, 217, 1);
}

.active-lable {
  background: rgba(230, 247, 255, 1);
}
.ivu-checkbox-group {
  margin-bottom: 30px;
}
.sure-btn {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
