<template>
<div id="FuncAdjustment">
    <div class="adjust-student">
        <div class="adjust-student-left">
            <ul :class="{left_fiexd:isFiexd}">
                <li v-for="(item,index) in roomInfo" :key="index">
                    <div class="list-parent">
                      <div class="sel_wrap">
                        <div class="sel"></div>
                      </div>
                      <div>{{item.SubjectName}}</div>
                    </div>
                    <ul class="list-parent-list isOpen">
                        <li
                          v-for="(t,i) in item.RoomDetail" :key="i"
                          class="list-child"
                          @click="changeSelSit(t,index,i,item.SubjectName,t.ArrangeSupervisorExamRoomName)"
                          :class="{select_style:t.isSelect}"
                          >
                          <div class="list-child-name nowrap" :title="t.ArrangeSupervisorExamRoomName+'('+ t.StudentCount+'人)'">{{t.ArrangeSupervisorExamRoomName}}（{{t.StudentCount}}人）</div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="adjust-student-right">
            <div>
                <div style="margin-bottom:10px;display:flex;justify-content:space-between;">
                    <Button class="xy-modal-primary" @click="change" v-if="!params.GenerateStatus">调整座位</Button>
                    <div v-else></div>
                    <b class="adjust-student-right-title" v-cloak>{{checkName}}</b>
                </div>
                <!-- <i-table :columns="columns" :data="dataTable"></i-table> -->
                <XyAntTable
                  :columns="columns"
                  :isPage="false"
                  :dataSource="dataTable"
                  :nullData="txt"
                  @change="handleTableChange"
                  :tableLoading="tableLoading"
                  >
                  <div slot="Icon" slot-scope="text, record">
                    <div v-if="!record.Icon" :class="`head-con ${record.Sex === 0 ? 'woman' : 'man'}`">
                      <span class="head-font">
                        {{ xy.showName(record.StudentName)}}
                      </span>
                    </div>
                    <img style="width:30px;height:30px;border-radius:50%" v-else :src="$store.state.apiPath + record.Icon + '?' + Math.random() * 15">
                  </div>
                  <div style="min-width: 100px" slot="SeatNumber" slot-scope="text, record">
                    <!-- {{ (10 > record.SeatNumber) ? ('0' + record.SeatNumber) : record.SeatNumber}} -->
                    {{record.SeatNumber}}
                    </div>
                  <div style="min-width: 150px" slot="TeachingClassName" slot-scope="text, record" v-text="record.TeachingClassName"></div>
                </XyAntTable>
            </div>
        </div>
    </div>
    <modal
      v-model="changeSeat"
      :transfer="false"
      title="调整座位"
      :loading="loading"
      :mask-closable="false"
      width="700"
      >
      <div class="dialog-model-content">
          <!-- <div class="title-describe">选择两个座位进行互换。</div> -->
        <Alert show-icon closable style="width: 336px">选择两个座位进行互换。</Alert>
          <div class="modal-flex">
              <div>
                  <div style="font-size: 14px;margin-bottom: 10px;">当前座位</div>
                  <i-select style="width:300px;" v-model="sIDL">
                      <i-option
                        v-for="(item, index) in dataTable" :key="index"
                        :value="item.StudentID"
                        >
                        {{item.SeatNumber}}、{{item.StudentName}}（{{item.TeachingClassName}}）
                      </i-option>
                  </i-select>
              </div>
              <Icon type="md-repeat" size="20" style="margin-top: 36px" />
              <div>
                  <div style="font-size: 14px;margin-bottom: 10px;">互换座位</div>
                  <i-select style="width:300px;" v-model="sIDR">
                      <i-option
                        v-for="(item, index) in dataTable"
                        :key="index"
                        :value="item.StudentID"
                        >
                        {{item.SeatNumber}}、{{item.StudentName}}（{{item.TeachingClassName}}）
                      </i-option>
                  </i-select>
              </div>
          </div>
      </div>
      <div slot="footer">
          <Button class="xy-modal-close" @click="changeSeat = false">取消</Button>
          <Button class="xy-modal-primary" @click="ok" shape="circle">保存</Button>
        </div>
    </modal>
</div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'AdjustmentStudent',
    data () {
      return {
        tableLoading: true,
        txt: '您还没有座位调整的信息，请添加座位调整。',
        isFiexd: false,
        loading: true,
        changeSeat: false,
        columns: [
          {
            title: ' ',
            dataIndex: 'Icon',
            scopedSlots: { customRender: 'Icon' },
            className: 'table-pic',
            width: 60
          },
          {
            title: '姓名',
            dataIndex: 'StudentName',
            width: 150
          },
          {
            title: '用户名',
            dataIndex: 'UserName',
            width: 150
          },
          {
            title: '准考证号',
            dataIndex: 'AdmissionTicketNumber',
            width: 200
          },
          {
            title: '教学班',
            dataIndex: 'TeachingClassName',
            scopedSlots: { customRender: 'TeachingClassName' }
          },
          {
            title: '座位号',
            dataIndex: 'SeatNumber',
            width: 200,
            scopedSlots: { customRender: 'SeatNumber' }
          }
        ],
        dataTable: [],
        roomInfo: [],
        isIndex: 0,
        activeID: 0,
        checkName: '',
        sIDL: 0,
        sIDR: 0,
        subjectName: '',
        arrangeSupervisorResultID: '',
        roomName: '',
        openMenu: { parentIndex: 0, childIndex: 0 }, // 需要展开的菜单树,
        params: this.$store.state.educationAffairs.arrange
      }
    },
    created () {
      // 获取菜单树
      this.GetAllExamSubjectInRoomInfo()
    },
    mounted () {
      window.onscroll = this.throttle(this.ChangeLeft, 100)
    },
    methods: {
      handleTableChange () {
        this.getStudentInfo()
      },
      // 左树位置变化
      ChangeLeft () {
        let top = document.documentElement.scrollTop || document.body.scrollTop
        this.isFiexd = top > 280
      },
      // 节流
      throttle (func, wait) {
        let previous = 0
        return () => {
          let now = Date.now()
          let context = this
          let args = arguments
          if (now - previous > wait) {
            func.apply(context, args)
            previous = now
          }
        }
      },
      // 获取菜单树
      async GetAllExamSubjectInRoomInfo () {
        // this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeExamSetting/GetAllExamSubjectInRoomInfo`, params)
        // this.xy.unloading()
        if (res.success) {
          this.roomInfo = res.data
          if (res.data.length > 0) {
            res.data.map((item, index) => {
              this.$set(item, 'isSelect', index === 0)
              if (item.RoomDetail.length > 0) {
                item.RoomDetail.map((i, t) => {
                  this.$set(i, 'isSelect', !!(t === 0 && index === 0))
                })
              };
            })
          };
          this.activeID = this.roomInfo[0].SubjectID // 科目名称
          this.checkName = this.roomInfo[0].SubjectName + ' ' + this.roomInfo[0].RoomDetail[0].ArrangeSupervisorExamRoomName
          this.arrangeSupervisorResultID = this.roomInfo[0].RoomDetail[0].ArrangeSupervisorResultID
          this.getStudentInfo()
        }
      },

      subjectBtn (index, id) {
        this.isIndex = index
        this.activeID = id

        this.roomInfo.forEach((item, i) => {
          if (index !== i) {
            item.isSelect = false
            if (item.RoomDetail.length > 0) {
              item.RoomDetail.map((i) => {
                i.isSelect = false
              })
            };
          };
          if (index === this.openMenu.parentIndex) {
            this.roomInfo[this.openMenu.parentIndex].RoomDetail[this.openMenu.childIndex].isSelect = true
          }
        })
        this.roomInfo[index].isSelect = !this.roomInfo[index].isSelect
      },

      // 左侧子树展开
      open (index) {
        this.roomInfo.forEach((item, i) => {
          if (index !== i) {
            item.isSelect = false
            if (item.RoomDetail.length > 0) {
              item.RoomDetail.map((i) => {
                i.isSelect = false
              })
            };
          };
          if (index === this.openMenu.parentIndex) {
            this.roomInfo[this.openMenu.parentIndex].RoomDetail[this.openMenu.childIndex].isSelect = true
          }
        })
        this.roomInfo[index].isSelect = !this.roomInfo[index].isSelect
      },

      // 获取table数据
      changeSelSit (t, index, i, vals, vals3) {
        this.selSit = t
        this.checkName = vals + ' ' + vals3
        this.arrangeSupervisorResultID = t.ArrangeSupervisorResultID
        for (var s = 0; s < this.roomInfo.length; s++) {
          this.roomInfo[s].RoomDetail.forEach((item) => {
            item.isSelect = false
          })
        }
        if (this.roomInfo[index].RoomDetail.length > 0) {
          this.roomInfo[index].RoomDetail.forEach((item) => {
            item.isSelect = false
          })
          this.roomInfo[index].RoomDetail[i].isSelect = true
          this.openMenu = { parentIndex: index, childIndex: i }
        }
        this.getStudentInfo()
      },
      // 获取具体考场
      async getStudentInfo () {
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          ArrangeSupervisorResultID: this.arrangeSupervisorResultID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeExamSetting/GetAllExamRooStudentInfo`, params)
        this.tableLoading = false
        if (res.success) {
          this.dataTable = res.data
        }
      },
      change () {
        if (!this.params.GenerateStatus) {
          this.sIDL = 0
          this.sIDR = 0
          this.changeSeat = true
        } else {
          this.xy.msgError('请先取消发布。')
        };
      },
      async ok () {
        // this.xy.loading()
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          ArrangeSupervisorResultID: this.arrangeSupervisorResultID,
          StudentIDL: this.sIDL,
          StudentIDR: this.sIDR
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeExamSetting/ChangeArrangeExamStudentOrder`, params, true)
        // this.xy.unloading()
        this.tableLoading = false
        if (res.success) {
          this.xy.msgSuc(res.msg || '座位调整成功。')
          this.changeSeat = false
          this.sIDL = 0
          this.sIDR = 0
          this.getStudentInfo(this.subjectName, this.arrangeSupervisorResultID, this.roomName)
        } else {
          this.xy.msgError(res.msg || '座位调整失败。')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../Css/ArrangeExamRoom/Adjustment.less';
</style>
