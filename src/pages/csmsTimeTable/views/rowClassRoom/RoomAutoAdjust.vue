<template>
  <div class="xy-content-module">
    <div>
        <div class="autoAdj-box">
            <div class="autoAdj-tit">
              选择排教室模式
              <div class="fr">
                  <Button class="xy-primary" @click="back">返回</Button>
              </div>
            </div>
            <radio-group v-model="selectClassRoom" @on-change="selectChange" class="autoAdj-radiobox">
                <radio :label="1">
                    <span>同一教学班尽量使用同一教室</span>
                </radio>
                <radio :label="2">
                    <span>同一教师尽量使用同一教室</span>
                </radio>
                <radio :label="3">
                    <span>同一学科下不同教学班尽量在不同教室</span>
                </radio>
            </radio-group>
        </div>
        <div class="autoAdj-box" style="min-height:700px;">
            <div class="autoAdj-tit">
              选择要使用的教室
              <div class="autoAdj-text">
                  您至少要选择&nbsp;{{ leastNumber === null ? 0 : leastNumber  }}&nbsp;间教室，已选定&nbsp;{{ roomAllList.length }}&nbsp;间。
              </div>
            </div>
            <div class="autoAdj-boxselect">
              <ul class="choose-ul">
                <li class="choose-li first" @click="selectRoom">
                  <div>
                    <span class="iconfont" style="font-size: 14px; font-weight:bold; margin: 0 5px 0 -8px;">&#xe6a2;</span>
                    <span>选择教室</span>
                  </div>
                </li>
                <li class="choose-li" v-for="(item, index) in roomAllList" :key="index">
                  <div class="choose-info">
                      <span class="choose-icon">
                        <i class="iconfont icon-after">&#xe6eb;</i>
                      </span>
                      <div class="choose-right">
                          <span class="choose-name nowrap" :title="item.title">{{item.title}}</span>
                          <div class="choose-status">{{item.schooleName}}-{{item.buildName}}</div>
                      </div>
                  </div>
                  <div class="choose-bottom text-center" @click="delclass(item)">
                      <i class="iconfont del" style="color:rgba(0,0,0,0.45); margin-right:10px">&#xe6e1;</i>
                      <span>删除</span>
                  </div>
                </li>
              </ul>
            </div>
       </div>
        <div class="fix-footer xy-flex">
            <checkbox v-model="merge">合班的课使用同一教室</checkbox>
            <Button class="xy-btn-primary" shape="circle" style="margin-right:0" @click="startUp" :disabled="disStart">开始排教室</Button>
        </div>

        <!-- 选择教室 -->
        <!-- <select-class-room
          :isShow="isShowClassRoom"
          :selectMembers="[...selectedRooms]"
          @select-cancel="selectCancel"
          @select-confirm="selectConfirm">
        </select-class-room> -->
        <CheckboxSelectClasses :isShow="isShowClass"
                      modalTitle="选择教室"
                      :selectMembers="[...checkAllListID]"
                      @select-cancel="selectCancel"
                      @select-confirm="selectConfirm">
        </CheckboxSelectClasses>
    </div>
</div>
</template>
<script>
  // import SelectClassRoom from '@/components/selectClassRoom/SelectClassRoom'
  import CheckboxSelectClasses from '@/pages/csmsTimeTable/components/selectClasses/CheckboxSelectClasses.vue'
  export default {
    name: 'SetRoomAutoAdjust',
    components: {
      // SelectClassRoom,
      CheckboxSelectClasses
    },
    data () {
      return {
        classTableIDs: [],
        schoolID: 0,
        schoolIDCur: 0,

        // 选择教室
        isShowClassRoom: false,
        isShowClass: false,
        selectedRooms: [],

        selectClassRoom: 1,
        // identicalClassRoom:'',
        // identicalTeacher: '',
        leastNumber: 0,
        alreadyNumber: 0,
        roomAllList: [],
        merge: true,
        disStart: true,
        checkAllListID: [],
        newArrList: [{
          ischild: true,
          label: '',
          loading: false,
          checkAll: false,
          memberlist: [],
          checkAllGroup: [],
          childNameStr: ''
        }]
      }
    },
    created () {
      // 上一页参数（排教室）
      if (Object.keys(this.$store.state.csmstimetable.roomGoAutoAdjust).length > 0) {
        let rowObj = this.$store.state.csmstimetable.roomGoAutoAdjust
        this.classTableIDs = rowObj.classTableIDs
        this.schoolID = rowObj.schoolID
        this.schoolIDCur = rowObj.schoolIDCur
      }
    },
    mounted () {
      this.getMaxHouse()
    },
    methods: {
      // 选择教室
      selectRoom () {
        this.isShowClass = true
      },
      selectCancel () {
        this.isShowClass = false
      },
      selectConfirm (data) {
        this.isShowClass = false
        this.roomAllList = [...data] // 所选教室
        if (this.roomAllList.length > 0) {
          this.addComplate()
        } else {
          this.xy.msgError('请先选择教室。')
        };
      },
      addComplate () {
        this.checkAllListID = []
        for (let i = 0; i < this.roomAllList.length; i++) {
          this.checkAllListID.push(this.roomAllList[i].HouseID)
        };
        let obj1 = {}
        this.checkAllListID = this.checkAllListID.reduce(function (item, next) {
          // eslint-disable-next-line no-unused-expressions
          obj1[next] ? '' : obj1[next] = true && item.push(next)
          return item
        }, [])

        let obj = {}
        this.roomAllList = this.roomAllList.reduce(function (item, next) {
          // eslint-disable-next-line no-unused-expressions
          obj[next.id] ? '' : obj[next.id] = true && item.push(next)
          return item
        }, [])

        if (this.roomAllList.length < this.leastNumber) {
          this.disStart = true
        } else {
          this.disStart = false
        }
      },

      // 返回
      back () {
        this.$store.commit('common/getThreeMenuName', this.$store.state.csmstimetable.roomGoAutoAdjust.menuName.menuName)
        this.$store.commit('common/getParam', { pro: 'setRoomTable' }) // 设置“排教室页”顶部返回至“设置教室table页”
        // 跳转至排教室
        this.$router.push({
          path: '/xyhome/rowRoom',
          query: this.$store.state.csmstimetable.roomGoAutoAdjust.menuName
        })
      },

      // 选择教室教师
      selectChange () {

      },

      // 合并班级
      mergeChange () {

      },

      // 获取最大班级数
      async getMaxHouse () {
        this.xy.loading()
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/AssignedClassRoom/GetMaxHouseCount?classTableIDs=${this.classTableIDs} `)
        if (res.success) {
          if (res.data === '') {
            this.leastNumber = res.data
          } else {
            this.leastNumber = res.data
          }
        }
        this.xy.unloading()
      },
      delclass (item) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>您确认要删除"' + item.title + '"吗？</p>',
          onOk: () => {
            this.modal_loading = true
            // 更新checkAllListID
            let checkAllListIDIndex = this.checkAllListID.map(function (item) { return item }).indexOf(item.id)
            if (checkAllListIDIndex !== -1) {
              this.checkAllListID.splice(checkAllListIDIndex, 1)
            }

            // 更新roomAllList
            let index = this.roomAllList.map(function (item) { return item.id }).indexOf(item.id)
            if (index !== -1) {
              this.roomAllList.splice(index, 1)
              this.xy.msgSuc('删除成功。')
              if (this.roomAllList.length < this.leastNumber) {
                this.disStart = true
              } else {
                this.disStart = false
              }
            }
          }
        })
      },

      // 开始排教室
      // POST api/AssignedClassRoom/ArrangeClassRoomAuto
      async startUp () {
        this.xy.loading()
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/AssignedClassRoom/ArrangeClassRoomAuto`, {
          ClassTableIDs: this.classTableIDs,
          HouseIDs: this.checkAllListID,
          ClassOrTeacherUseSame: this.selectClassRoom,
          IsUnion: this.merge
        })
        if (res.success) {
          this.xy.msgSuc('自动排教室成功。')
          // 自动跳转至上一页：排教室
          this.back()
        }
        this.xy.unloading()
      }
    }
  }
</script>
<style lang="less" scoped>
.fix-footer {
  align-items: center;
  justify-content: space-between;
}
.autoAdj-box{
    width:100%;
    margin-bottom: 20px;
    background: #fff;
}
.autoAdj-box > .autoAdj-tit{
    height: 54px;
    line-height: 54px;
    padding-left: 25px;
    color: rgba(0, 0, 0, 0.85);
    border-bottom: 1px solid #E9E9E9;
    font-size: 16px;
    font-weight: bold;
}
.autoAdj-box > .autoAdj-tit > .autoAdj-text{
    display: inline-block;
    padding-left: 20px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-weight: normal;
}
.autoAdj-box > .autoAdj-radiobox{
    margin-bottom: 25px;
    margin-top: 25px;
    margin-left: 25px;
    color: rgba(0, 0, 0, 0.85);

}
.autoAdj-box > .autoAdj-radiobox > label{
    margin-right: 50px;
}
.autoAdj-radiobox{
    margin-bottom: 25px;
    margin-top: 25px;
    margin-left: 100px;
}
.autoAdj-box > .autoAdj-boxselect{
    padding:10px;
}
.choose-ul{
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0 10px;
}
.choose-li {
    width: 24%;
    min-width: 300px;
    max-width: 350px;
    height: 170px;
    border: 1px solid #E9E9E9;
    background: #fff;
    border-radius: 2px;
    padding: 23px 0 0 24px;
    margin: 15px 10px 0 0;
    position: relative;
}
.choose-li.first{
  border-style: dashed;
  color: rgba(0,0,0,0.45);
  font-size: 16px;
  padding: 65px 0 0 105px;
  cursor: pointer;
}
.choose-info {
    display: flex;
    align-items: center;
}
.choose-icon {
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-radius: 50%;
    background: #FFBF00;
    margin-right: 13px;
}
.choose-icon i{
  font-size: 22px;
  color: #fff;
}
.choose-right{
  position: absolute;
  padding-left: 60px;
}
.choose-right .choose-name {
    font-weight: bold;
    color: rgba(0,0,0,0.85);
    font-size: 16px;
    width: 200px;
}
.choose-right .choose-status{
  color:rgba(0,0,0,0.85);
}
.choose-bottom{
    cursor: pointer;
    position: absolute;
    left: 0;
    bottom: 0;
    background: #F7F9FA;
    border-top: 1px solid #E9E9E9;
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.choose-bottom span{
    color: rgba(0,0,0,0.45);
}
</style>
