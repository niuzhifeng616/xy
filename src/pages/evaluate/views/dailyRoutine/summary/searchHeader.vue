<template>
  <div>
      <div class="xy-content-title flex-flow">
        <div class="xy-flex xy-center" v-if="settingComponent!=='oneStuDetails'">
          <label>校区：</label>
          <cascader :data="schoolData" :disabled="noRes" v-model="schoolSession" :clearable="false" class="fl" @on-change="schoolChange" style="margin-right: 10px"></cascader>
        </div>
        <div class="xy-flex xy-center" v-if="settingComponent!=='oneStuDetails'">
          <label>学年/学期：</label>
          <cascader :data="yearSessionData" :disabled="noRes" v-model="yearSession" :clearable="false" class="fl" @on-change="cascaderChange"></cascader>
        </div>
        <div class="crumbs-custom" v-if="backUrl!==''&&settingComponent!=='evaStatistics'">
          <span class="back" @click="back">
            <i class="iconfont">&#xe6a5;</i>
            <span>返回</span>
          </span>
        </div>
      </div>
      <div class="right-content">
        <component :is="settingComponent" ref="childFunction" :addData="addData" :labelObj="labelObj" ></component>
      </div>
  </div>
</template>
<script>
  import classDetails from './classDetails'
  import evaStatistics from './evaStatistics'
  import oneStuDetails from './oneStuDetails'
  import stuDetails from './stuDetails'
  export default {
    name: 'searchHeader',
    components: { classDetails, evaStatistics, oneStuDetails, stuDetails },
    props: {
      applicationID: {
        type: String
      },
      applicationSubMenuID: {
        type: String
      }
    },
    data () {
      return {
        backUrl: '',
        settingComponent: '',
        schoolData: [
          {
            'label': '全部校区',
            'value': 0,
            'children': []
          }
        ],
        schoolSession: [],
        yearSessionData: [],
        yearSession: [],
        passData: {},
        labelObj: '',
        addData: {},
        CapplicationID: '',
        CapplicationSubMenuID: '',
        noRes: true
      }
    },
    computed: {
      idArr () {
        return this.$store.state.common.menuId
      }
    },
    watch: {
      idArr: {
        handler (val) {
          console.log(111, val)
          let idArr = val.split(',')
          this.CapplicationID = idArr[1]
          this.CapplicationSubMenuID = idArr[2]
          this.addData = {
            applicationID: this.CapplicationID,
            applicationSubMenuID: this.CapplicationSubMenuID,
            Dimension: 2
          }
          // this.getSchool()
        },
        immediate: true
      }
    },
    created () {
      // this.getSchool()
    },
    mounted () {
      this.getSchool()
    },
    methods: {
      getSchool () {
        this.xy.get(`${this.$store.state.apiPath}/api/MoralProgramme/GetUserRangeClassPermissionNodeListByProgramme`, {
          Dimension: 2,
          ApplicationID: this.CapplicationID,
          ApplicationSubMenuID: this.CapplicationSubMenuID
        }).then(res => {
          if (res.success) {
            this.schoolData = this.schoolData.concat(res.data)
            for (var i = 0; i < this.schoolData.length; i++) {
              this.schoolData[i].children.unshift({
                'value': 0,
                'label': '全部年级',
                'children': []
              })
              for (var j = 0; j < this.schoolData[i].children.length; j++) {
                this.schoolData[i].children[j].children.unshift({
                  'value': 0,
                  'label': '全部班级'
                })
              }
            }
            this.schoolSession = [0, 0, 0]
            this.getSessionNodeList()
          }
        })
      },
      schoolChange (val, label) {
        this.schoolSession = val
        this.$store.commit('evaluate/changeMoralObj', {
          title: label[1].label + label[2].label,
          gradeName: label[1].label,
          className: label[2].label
        })
        this.$refs.childFunction.pageIndex = 1
        this.$refs.childFunction.getQuestionnaires()
      },
      // 学年学期
      getSessionNodeList () {
        this.yearSessionData = []
        this.xy.get(`${this.xyApi}/xy/comm/GetSessionNodeList`).then(res => {
          if (res.success) {
            this.yearSessionData = res.data
            this.yearSession = []
            let index = this.yearSessionData.map((item) => {
              return item.IsCurrent
            }).indexOf(true)
            if (index !== -1) {
              this.yearSession.push(this.yearSessionData[index].value)
              let index1 = this.yearSessionData[index].children.map((item) => {
                return item.IsCurrent
              }).indexOf(true)
              if (index1 !== -1) {
                this.yearSession.push(this.yearSessionData[index].children[index1].value)
              } else {
                this.yearSession = [this.yearSessionData[index].value, 0]
              }
            } else {
              if (this.yearSessionData.length > 0) {
                if (this.yearSessionData[0].children.length > 0) {
                  this.yearSession = [this.yearSessionData[0].value, this.yearSessionData[0].children[0].value]
                } else {
                  this.yearSession = [this.yearSessionData[0].value, 0]
                }
              }
            }
            this.settingComponent = 'evaStatistics'
          }
        })
      },
      cascaderChange (value) {
        this.yearSession = value
        this.$refs.childFunction.pageIndex = 1
        this.$refs.childFunction.getQuestionnaires()
      },
      // 返回
      back () {
        if (this.settingComponent !== 'oneStuDetails') {
          this.settingComponent = this.backUrl
        } else {
          this.settingComponent = 'stuDetails'
          this.backUrl = 'evaStatistics'
        }
      }
    }
  }
  </script>
  <style lang='less' scoped>
  .flex-flow{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding:15px;
  }
  .crumbs-custom{
    flex: 1;
    text-align: right;
    .name{
      font-size: 18px;
      font-weight:700;
      color:rgba(0,0,0,0.75);
    }
    .back{
      cursor: pointer;
      i{
        margin-right:5px;
        font-size: 14px;
        color: #1890FF;
      }
      span{
        color:#1890FF;
      }

    }
  }
  </style>
