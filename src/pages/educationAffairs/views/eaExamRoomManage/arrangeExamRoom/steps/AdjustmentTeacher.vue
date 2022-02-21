<template>
  <div id="FuncAdjustment">
    <div class="adjust-teacher-title">
      <div class="change-time">
        <div class="change-time-btn" :class="dateIndex===0?'left-null':''" @click="prevBtn">
          前一天
        </div>
        <Select v-model="time" class="change-time-block" @on-change="timeSel">
          <Option v-for="item in dateList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        <div class="change-time-btn" :class="dateIndex===dateList.length-1?'right-null':''" @click="nextBtn">
          后一天
        </div>
      </div>
    </div>
    <div class="adjust-teacher-content">
      <div v-for="(item, index) in RightList" class="adjust-teacher-content-box" :key="index">
        <div class="adjust-teacher-content-box-objtime">
          <tooltip placement="top" max-width="250">
            <div class="nowrap" style="width:230px;" v-cloak> {{item.SubjectRoomName}}</div>
            <div slot="content">
              <p v-cloak>{{item.SubjectRoomName}}</p>
            </div>
          </tooltip>
        </div>
        <div class="adjust-teacher-content-list">
          <XyAntTable
            :columns="columns"
            :isPage="false"
            :dataSource="item.ArrangeResultRoomList"
            :tableLoading="tableLoading"
            >
            <div style="min-width: 150px" class="teaList" slot="ArrangeResultTeacherList" slot-scope="text, record">
              <span class="addBtn" @click="adjustClick" v-if="!params.GenerateStatus"><Icon type="md-add" size="16" />添加</span>
              <a-tag :visible="i.visible" :closable="!params.GenerateStatus" @close="delTeacher(item,record,i)" :key="j" v-for="(i, j) in record.ArrangeResultTeacherList">
                {{i.TeacherName}}
              </a-tag>
            </div>
          </XyAntTable>
        </div>
      </div>
    </div>
    <modal
      :styles="{top:'20px',width:'1000px'}"
      class="pr"
      v-cloak
      v-model="adjustModal"
      :transfer="false"
      title="添加"
      :loading="loading"
      :mask-closable="false"
      >
      <div class="dialog-model-content">
        <!-- <div class="title-describe">选择一个考场，为此考场添加一位监考教师。</div> -->
        <Alert show-icon closable>选择一个考场，为此考场添加一位监考教师。</Alert>
        <div class="adjust-teacher-flex" v-if='adjustHaveDate'>
          <div>
            <div class="change-title">选择缺监考考场。</div>
            <ul>
              <li v-for="(item, index) in notFullRoom" class="exam-date" :key="index">
                <div>{{item.ExamDateName}}</div>
                <ul>
                  <li v-for="(child, index) in item.ArrangeResultSubjectList" :key="index" class="subject-date">
                    <div>
                      <img src="../Image/mobile-icons.png" />
                      <span>{{child.SubjectRoomName}}</span>
                    </div>
                    <ul class="room-name-flex">
                      <li v-for="(cItem,index) in child.ArrangeResultRoomList" :key="cItem.ArrangeSupervisorExamRoomID">
                        <div class="room-name" @click="changeRoom(item,child,cItem,index)">
                          <div class="room-name-check" :class="(isSubjectId===child.ArrangeSupervisorSubjectID&&isIndex===index&&isRoomId===cItem.ArrangeSupervisorExamRoomID)?'active':''">
                            <div></div>
                          </div>
                          <div class="nowrap room-names">{{cItem.ArrangeSupervisorExamRoomName}}</div>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div>
            <div class="change-title">选择未分配的教师。</div>
            <ul class="change-teacher-ul">
              <li v-for="(item,index) in teacherByRoom" :key="index" class="change-teacher-list">
                <div class="change-teacher-btn" @click="changeTeacher(item,index)">
                  <div class="change-teacher-check" :class="tIndex===index?'active':''">
                    <div></div>
                  </div>
                  <div class="nowrap null-teachers">{{item.TeacherName}}</div>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <div class="change-title">结果</div>
            <div v-if="addTime!=null&&addItem!=null&&addTName!=null&&addHouse!=null">
              <div class="add-content">
                <span class="add-text">考试日期：</span>{{addTime}}</div>
              <div class="add-content">
                <span class="add-text">考试科目：</span>{{addItem}}</div>
              <div class="add-content">
                <span class="add-text">考试场地：</span>{{addHouse}}</div>
              <div class="add-content">
                <span class="add-text">监考教师：</span>{{addTName}}</div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button class="xy-info" @click="adjustCancel">取消</Button>
        <Button class="xy-primary" @click="adjustOk">保存</Button>
        <checkbox v-model="isAdjust" style="margin-left:20px;" size="large">继续调整</checkbox>
      </div>
      <Spin fix v-if="isLoading">
        <p>加载中...</p>
      </Spin>
    </modal>
  </div>
</template>
<script>
  import XyAntTable from '@/components/table/XyAntTable'
  export default {
    components: {
      XyAntTable
    },
    name: 'AdjustmentTeacher',
    data () {
      return {
        isAdjust: false,
        loading: true,
        adjustModal: false,
        tableLoading: true,
        RightList: [],
        BgList: [
          // {
          //    Color:'#0FBC91',
          //    Imgs: '/image/ea/2.png',
          //    TitleBorderColor: '#20DFAB',
          //    Shadow:'0px 1px 6px 0px rgba(26,216,165,0.5)',
          //    BgColor:'#E7FCF6',
          // },
          {
            Color: '#FF7500',
            Imgs: '/image/ea/3.png',
            TitleBorderColor: '#FFDCC6',
            Shadow: '0px 1px 6px 0px rgba(234,111,5,0.5)',
            BgColor: '#FFF1E5'
          },
          {
            Color: '#4196FF',
            Imgs: '/image/ea/1.png',
            TitleBorderColor: '#C2D9FF',
            Shadow: '0px 1px 6px 0px rgba(61,102,230,0.5)',
            BgColor: '#ECF4FF'
          },
          {
            Color: '#4F9623',
            Imgs: '/image/ea/4.png',
            TitleBorderColor: '#D3E8CA',
            Shadow: '0px 1px 6px 0px rgba(115,175,50,0.5)',
            BgColor: '#ECFAE7'
          }
        ],
        notFullRoom: [],
        teacherByRoom: [],
        isSubjectId: -1,
        isIndex: -1,
        isRoomId: -1,
        tIndex: -1,
        addTime: null,
        addItem: null,
        addTName: null,
        addHouse: null,
        dateList: [],
        dateIndex: 0,
        isLoading: false,
        tId: '',
        adjustHaveDate: false,
        params: this.$store.state.educationAffairs.arrange,
        time: '',
        columns: [
          {
            title: '考场名称',
            dataIndex: 'ArrangeSupervisorExamRoomName',
            width: 150
          },
          {
            title: '监考教师',
            dataIndex: 'ArrangeResultTeacherList',
            scopedSlots: { customRender: 'ArrangeResultTeacherList' }

          }
        ]
      }
    },
    created () {
      // 获取考试日期
      this.getExamDateByID()
    },
    methods: {
      timeSel (val) {
        this.time = val
        this.getTeacher(val)
      },
      getImg (val) {
        if (!val) return
        return require(`@/pages/educationAffairs/views/eaExamRoomManage/arrangeExamRoom${val.replace('image', 'Image')}`)
      },
      async getExamDateByID () {
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeExamSetting/GetExamDateByID`, params)
        this.xy.unloading()
        if (res.success) {
          this.dateList = res.data
          this.time = this.dateList[0]
          // 根据考试日期获取监考教师信息
          this.getTeacher(this.dateList[0])
        }
      },
      // 获取监考教师信息
      async getTeacher (dates) {
        this.time = dates
        this.tableLoading = true
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          ExamDate: dates
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeExamSetting/GetTeacherRoomByDate`, params)
        this.tableLoading = false
        if (res.success) {
          if (res.data.length > 0) {
            this.RightList = res.data
            let i = 0
            this.RightList.forEach((item) => {
              this.$set(item, 'Color', this.BgList[i].Color)
              this.$set(item, 'Imgs', this.BgList[i].Imgs)
              this.$set(item, 'TitleBorderColor', this.BgList[i].TitleBorderColor)
              this.$set(item, 'Shadow', this.BgList[i].Shadow)
              this.$set(item, 'BgColor', this.BgList[i].BgColor)
              i = (i + 1) % this.BgList.length
              item.ArrangeResultRoomList.map((i) => {
                i.ArrangeResultTeacherList.map((tea, teaI) => {
                  this.$set(tea, 'visible', true)
                })
              })
            })
            console.log(this.RightList)
          } else {
            this.RightList = []
          };
        }
      },
      // prev day
      prevBtn () {
        if (this.dateIndex > 0) {
          this.dateIndex--
          this.getTeacher(this.dateList[this.dateIndex])
        };
      },
      // next day
      nextBtn () {
        if (this.dateIndex === this.dateList.length - 1) {
          this.dateIndex = this.dateList.length - 1
        } else {
          this.dateIndex++
          this.getTeacher(this.dateList[this.dateIndex])
        };
      },
      // 调整功能弹出框
      async adjustClick () {
        if (this.params.GenerateStatus) {
          return this.xy.msgError('请先取消发布。')
        }
        this.isLoading = true
        this.adjustModal = true
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeExamSetting/GetResltNotFullRoom`, params)
        this.xy.unloading()
        this.isLoading = false
        if (res.success) {
          this.adjustHaveDate = false
          this.notFullRoom = res.data
          this.notFullRoom.forEach((item) => {
            item.ArrangeResultSubjectList.forEach((i) => {
              if (i.ArrangeResultRoomList.length > 0) {
                this.adjustHaveDate = true
              }
            })
          })
        }
      },
      // 提交调整结果
      async adjustOk () {
        if (!this.isSubjectId) {
          return this.xy.msgError('请先选择考场。')
        };
        if (!this.tId) {
          return this.xy.msgError('请先选择监考教师。')
        };
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          ArrangeSupervisorSubjectID: this.isSubjectId,
          ArrangeSupervisorTeacherID: this.tId,
          ArrangeSupervisorExamRoomID: this.isRoomId
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ArrangeExamSetting/CreateExamRoomInTeacher`, params)
        this.xy.unloading()
        if (res.success) {
          this.adjustModal = true
          this.clearData()
          this.getTeacher(this.dateList[this.dateIndex])
          if (this.isAdjust) {
            this.adjustClick()
          } else {
            this.adjustModal = false
          };
        }
      },
      // 关闭弹框
      adjustCancel () {
        this.isAdjust = false
        this.adjustModal = false
        this.clearData()
      },
      clearData () {
        this.tIndex = -1
        this.isIndex = -1
        this.isSubjectId = ''
        this.isRoomId = ''
        this.addTime = null
        this.addItem = null
        this.addTName = null
        this.addHouse = null
        this.tId = ''
        this.teacherByRoom = []
      },
      // 选择考场
      async changeRoom (vals1, vals2, vals, i) {
        this.tIndex = -1
        this.addTName = null
        this.isRoomId = vals.ArrangeSupervisorExamRoomID// 考场ID
        this.isIndex = i
        this.isSubjectId = vals2.ArrangeSupervisorSubjectID// 考试科目ID
        this.addTime = vals1.ExamDateName
        this.addItem = vals2.SubjectRoomName
        this.addHouse = vals.ArrangeSupervisorExamRoomName
        this.isLoading = true
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          ArrangeSupervisorExamRoomID: this.isRoomId,
          ArrangeSupervisorSubjectID: this.isSubjectId
        }
        let res = await this.xy.get(`${this.$store.state.apiPath}/api/ArrangeExamSetting/GetAddibleTeacherByRoomID`, params)
        this.xy.unloading()
        this.isLoading = false
        if (res.success) {
          this.teacherByRoom = res.data
        }
      },
      // 选择监考教师
      changeTeacher (vals, i) {
        this.tIndex = i
        this.addTName = vals.TeacherName
        this.tId = vals.ArrangeSupervisorTeacherID// 监考教师ID
      },
      // 删除监考教师
      delTeacher (vals1, vals2, vals3) {
        if (this.params.GenerateStatus) {
          this.xy.msgError('请先取消发布。')
        } else {
          this.xy.confirm('删除', '您确定要删除此监考教师吗？', () => {
            this.toDele(vals1, vals2, vals3)
          })
        }
      },
      async toDele (vals1, vals2, vals3) {
        this.xy.loading()
        const params = {
          ArrangeSupervisorExamID: this.params.ArrangeSupervisorExamID,
          ArrangeSupervisorExamRoomID: vals2.ArrangeSupervisorExamRoomID,
          ArrangeSupervisorSubjectID: vals1.ArrangeSupervisorSubjectID,
          ArrangeSupervisorTeacherID: vals3.ArrangeSupervisorTeacherID
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ArrangeExamSetting/DeleteExamRoomInTeacher`, params)
        this.xy.unloading()
        if (res.success) {
          this.xy.msgSuc(res.msg || '删除成功。')
          vals3.visible = true
          this.getTeacher(this.dateList[this.dateIndex])
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../Css/ArrangeExamRoom/Adjustment.less';
  .addBtn {
    width: 64px;
    height: 26px;
    background: #ffffff;
    border: 1px dashed #ddd;
    border-radius: 4px;
    display: inline-block;
    line-height: 26px;
    text-align: center;
    cursor: pointer;
    transition: color 0.2s linear, background-color 0.2s linear, border 0.2s linear, box-shadow 0.2s linear, -webkit-box-shadow 0.2s linear;
    i {
      margin-right: 4px;
    }
  }
  .addBtn:hover {
    color: #1677ff;
    border-color: #1677ff;
  }
  .teaList span {
    margin-right: 18px;
    height: 26px;
    line-height: 26px;
  }
</style>
