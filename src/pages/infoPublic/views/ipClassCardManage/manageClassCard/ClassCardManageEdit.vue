<template>
  <div class="xy-content-module">
    <div class="xy-content-body clearfix">
      <i-form ref="formValidate" :model="formValidate" label-position="top" :rules="ruleValidate" style="width:540px;margin:0 auto;">
        <form-item label="班牌编号" prop="ClassTreminalNumber">
          <span
            v-cloak
            style="display:inline-block;height:32px;line-height:32px;background: #f2f3f5;color: #7f7f7f;padding-left: 10px;border-radius: 6px;width: 100%;font-size: 16px;">{{formValidate.ClassTerminalNumber}}</span>
        </form-item>
        <form-item label="班牌名称" prop="ClassTerminalName" labelFor="ClassTerminalName">
          <i-input v-model.trim="formValidate.ClassTerminalName" v-cloak maxLength="15" elementId="ClassTerminalName" clearable></i-input>
        </form-item>
        <div style="border:1px solid #dcdee2;padding: 10px;height: 400px;margin-bottom: 20px;border-radius:6px;">
          <div class="clearfix" style="border-bottom:1px solid #eee;padding-bottom: 10px;">
            <div class="fl">班牌分组</div>
            <div class="fr">
              <span v-if="groups.ClassTerminalGroupId!=0">已选分组：<b style="color:#6392E9;" v-cloak>{{groups.ClassTerminalGroupName}}</b></span>
              <span v-else>未选分组</span>
            </div>
          </div>
          <div style="height: 352px;overflow:auto;">
            <tree :data="getTreeList" @on-select-change="selectTree" v-cloak></tree>
          </div>
        </div>
        <form-item label="负责人" prop="Head">
          <Icon type="md-add-circle" size="24" color="#6392E9" @click="modalOpen" title="添加负责人" class="cursor-p fl" style="padding-top: 4px;padding-right: 34px;" />
          <div style="clear:both;"></div>
          <tag type="border" color="primary" v-for="(item,index) in formValidate.Head" :key="index" :name="item.FullName" closable @on-close="delHead(index)" v-cloak>{{item.FullName}}</tag>
          <div style="color:#ccc;">注：指定的负责人有权限管理此班牌的显示内容。可多选。</div>
        </form-item>
        <form-item label="所属校区" prop="SchoolDistrictID">
          <i-select v-model="formValidate.SchoolDistrictID" label-in-value @on-change="schoolChange" placeholder="请选择校区">
            <i-option v-for="(item, index) in schoolList" :key="index" :value="item.SchoolDistrictID" v-cloak>{{item.SchoolDistrictName}}</i-option>
          </i-select>
        </form-item>
        <form-item label="所属楼" prop="BuildingID">
          <i-select v-model="formValidate.BuildingID" label-in-value @on-change="buildingChange" placeholder="请选择楼">
            <i-option v-for="(item, index) in buildingList" :key="index" :value="item.BuildingID" v-cloak>{{item.BuildingName}}</i-option>
          </i-select>
        </form-item>
        <form-item label="所属教室" prop="HouseID">
          <i-select v-model="formValidate.HouseID" label-in-value @on-change="houseChange" placeholder="请选择教室">
            <i-option v-for="(item, index) in houseList" :key="index" :value="item.HouseID" v-cloak>{{item.HouseName}}</i-option>
          </i-select>
        </form-item>
        <radio-group v-model="assignType" style="margin-bottom:20px;">
          <radio label="0">关联行政班</radio>
          <radio label="1">其他用途</radio>
        </radio-group>
        <form-item v-show="assignType==='0'">
          <label for="yixuan">
            <span>已选行政班：</span>
            <span v-if="getClassListID.length==4" style="color:#6392E9;" v-cloak>{{getClassListID[0].label}} / {{getClassListID[1].label}} / {{getClassListID[2].label}} / {{getClassListID[3].label}}</span>
            <span v-else>未选择</span>
          </label>
          <cascader elementId="yixuan" :data="classList" change-on-select @on-change="cascaderChange"></cascader>
        </form-item>
        <form-item v-show="assignType==='1'">
          <i-input type="textarea" v-model="tareaData" maxLength="15" :autosize="{minRows: 3,maxRows: 3}" v-cloak></i-input>
          <div style="color:#ccc;">注：选择行政班，将此班牌与行政班信息相关联，若班牌属于走廊或公用区域，可以在其他用途中输入，例如：走廊、物理实验室等。</div>
        </form-item>
        <div class="text-center" style="margin-top:20px;">
          <Button class="xy-btn-close" @click="goBack">返回</Button>
          <Button class="xy-btn-primary" shape='circle' @click="add">保存</Button>
        </div>
      </i-form>
      <div>
        <SelectTeacherOrg
          :isShow="isShow"
          :teachers="[...selectedTeachers]"
          @select-cancel="selectCancel"
          @select-confirm="selectConfirm"
        ></SelectTeacherOrg>
      </div>
    </div>
</div>
</template>
<script>
  import SelectTeacherOrg from '@/components/selectTeacherOrg/SelectTeacherOrg.vue'
  export default {
    name: 'ClassCardManageEdit',
    components: {
      SelectTeacherOrg
    },
    data () {
      return {
        isShow: false, // 控制获取老师cascader
        selectedTeachers: [],
        loading: true,
        getTreeList: [
          {
            title: '全部分组',
            expand: true,
            ParentID: -1,
            ClassTerminalGroupId: 0,
            children: []
          }
        ],
        newCascader: [],
        respon: {},
        groups: {},
        getClassListID: [],
        assignType: 0,
        tareaData: '',
        classId: '',
        classList: [],
        schoolList: [],
        buildingList: [],
        houseList: [],
        SchoolDistrictName: '', // 校区名
        BuildingName: '', // 楼名
        HouseName: '', // 教室名
        StudentOrganizationName: '', // 班级名
        formValidate: {
          ClassTreminalNumber: '', // 班牌编号
          ClassTerminalName: '', // 班牌名称
          SchoolDistrictID: '', // 所属校区
          BuildingID: '', // 所属楼
          Head: [], // 指定负责人
          HouseID: ''
        },
        ruleValidate: {
          ClassTerminalNumber: [
            { required: true, message: '班牌编号不能为空', trigger: 'blur' }
          ],
          ClassTerminalName: [
            { required: true, message: '班牌名称不能为空', trigger: 'blur' },
            { max: 15, message: '班牌名称不能超过15个字符', trigger: 'blur' }
          ],
          SchoolDistrictID: [
            { required: true, type: 'number', message: '所属校区不能为空', trigger: 'change' }
          ],
          BuildingID: [
            { required: true, type: 'number', message: '所属楼不能为空', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      row () {
        return JSON.parse(this.$route.query.row)
      }
    },
    watch: {
      row: {
        handler (val) {
          this.formValidate.ClassTerminalNumber = this.row.ClassTerminalNumber// 班牌编号
          this.formValidate.ClassTerminalName = this.row.ClassTerminalName// 班牌名称
          this.formValidate.GroupID = this.row.ClassTerminalGroupId// 班牌分组
          this.groups = {
            ClassTerminalGroupId: this.row.ClassTerminalGroupId, // Id
            ClassTerminalGroupName: this.row.ClassTerminalGroupName// 分组名称
          }
          this.formValidate.SchoolDistrictID = this.row.SchoolDistrictId// 校区
          this.SchoolDistrictName = this.row.SchoolDistrictName// 校区名
          this.formValidate.BuildingID = this.row.BuildingId// 楼
          this.BuildingName = this.row.BuildingName// 楼名
          this.formValidate.HouseID = this.row.HouseId// 教室
          this.HouseName = this.row.HouseName// 教室名
          this.assignType = this.row.TypeOfUse.toString()
          if (this.assignType === '1') {
            this.tareaData = this.row.UseWords// 已填写的其他内容
          } else {
            if (this.row.StudentOrganizationId !== 0 && this.row.StudentOrganizationName != null) {
              console.log(this.row, this.row.StudentYearID)
              this.StudentOrganizationName = this.row.StudentOrganizationName// 班级名称
              this.getClassListID = [
                {
                  value: this.row.SchoolDistrictId,
                  label: this.row.SchoolDistrictName
                },
                {
                  value: this.row.StudentYearID,
                  label: this.row.StudentYearName
                },
                {
                  value: this.row.StudentGradeID,
                  label: this.row.StudentGradeName
                },
                {
                  value: this.row.StudentOrganizationId,
                  label: this.row.StudentOrganizationName
                }
              ]
            } else {
              this.getClassListID = []
            };
          };
          // 负责人
          let uArr = (this.row.UserFullNames === null || this.row.UserFullNames === '') ? [] : this.row.UserFullNames.split(',')
          if (uArr.length > 0) {
            for (let i = 0; i < uArr.length; i++) {
              this.formValidate.Head.push({
                FullName: uArr[i],
                UserId: this.row.UserIds[i]
              })
            }
          }
          this.getSchool()
        },
        immediate: true
      }
    },
    created () {

    },
    mounted () {
      this.getTree()// tree
      this.getOrganization()// 获取行政班
    },
    methods: {
      changeLoading () {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      modalOpen () {
        let tIds = []
        this.isShow = true
        if (this.formValidate.Head.length > 0) {
          this.formValidate.Head.forEach(item => {
            tIds.push(item.ID)
          })
        }
      },
      selectCancel () {
        this.isShow = false
      },
      selectConfirm (selectData) {
        this.isShow = false
        this.selectedTeachers = [...selectData]
        let checkAllList = selectData
        if (checkAllList.length > 0) {
          for (let i = 0; i < checkAllList.length; i++) {
            this.formValidate.Head.push(checkAllList[i])
          };
          // 去重
          // let obj = {}
          // this.formValidate.Head = this.formValidate.Head.reduce( (item, next) => {
          //   obj[next.ID] ? '' : obj[next.ID] = true && item.push(next)
          //   return item
          // }, [])
          this.formValidate.Head = this.formValidate.Head
        } else {
          this.xy.msgError('请先选择负责人。')
          this.changeLoading()
        };
        this.changeLoading()
      },
      goBack () {
        this.$router.back()
      },
      getTree () {
        this.isInitial = true
        this.xy.loading()

        this.xy.get(`${this.$store.state.apiPath}/api/ClassTerminalGroup/GetTree`, {
        }).then(res => {
          this.isInitial = false
          if (res.success) {
            if (res.data.length > 0) {
              this.getTreeList[0].children = res.data
            } else { };
          } else { };
        })
      },
      selectTree (val) {
        this.groups = {
          ClassTerminalGroupId: val.length === 0 ? 0 : val[0].ClassTerminalGroupID, // Id
          ClassTerminalGroupName: val.length === 0 ? '' : val[0].ClassTerminalGroupName// 分组名称
        }
      },
      // 获取校区
      getSchool () {
        this.xy.get(`${this.xyApi}/base/xy/comm/SchoolDistrictList`, {}).then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.schoolList = res.data
              this.getBuilding(this.formValidate.SchoolDistrictID)// 获取楼
            };
          } else {
          };
        })
      },
      schoolChange (val) {
        this.getNewCascader()
        this.getClassListID = []
        this.formValidate.BuildingID = 0// 楼
        this.formValidate.HouseID = 0// 教室
        this.SchoolDistrictName = val.label// 校区名
        this.getBuilding(val.value)
      },
      // 获取楼
      getBuilding (SchoolDistrictID) {
        this.buildingList = []
        this.xy.get(`${this.xyApi}/base/api/Building/GetBuildingBySchoolId`, {
          sid: SchoolDistrictID
        }).then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.buildingList = res.data
              this.getHouse(this.formValidate.BuildingID)// 获取教室
            } else {
              this.xy.unloading()
            };
          } else {
          }
        })
      },
      buildingChange (val) {
        if (this.buildingList.length > 0) {
          this.BuildingName = val.label
          this.getHouse(val.value)
        }
      },
      getHouse (BuildingID) {
        this.houseList = []
        if (BuildingID !== undefined) {
          this.xy.get(`${this.xyApi}/base/api/House/GetHouseByBuildingId`, {
            bid: BuildingID
          }).then(res => {
            if (res.success) {
              if (res.data.length > 0) {
                this.houseList = res.data
              }
            } else {
            }
            this.xy.unloading()
          })
        }
      },
      houseChange (val) {
        this.HouseName = val.label
        this.formValidate.HouseID = val.value
      },
      getOrganization () {
        this.xy.get(`${this.xyApi}/base/xy/comm/StudentOrganization`, {}).then(res => {
          if (res.success) {
            this.newCascader = res.data
            this.getNewCascader()
          }
        })
      },
      getNewCascader () {
        this.respon = null
        this.classList = []
        if (this.newCascader.length > 0) {
          for (let s = 0; s < this.newCascader.length; s++) {
            if (this.formValidate.SchoolDistrictID === this.newCascader[s].ID) {
              this.respon = this.newCascader[s]
            }
          }
          if (this.respon != null && this.respon !== undefined) {
            // 校区
            this.classList = [{
              value: this.respon.ID, // id
              label: this.respon.Name, // 展示的名称
              children: []// 子集
            }]
            // 学年
            for (let j = 0; j < this.respon.MemberList.length; j++) {
              this.classList[0].children.push({
                value: this.respon.MemberList[j].StudentYear,
                label: this.respon.MemberList[j].Name,
                children: []
              })
              // 年级
              for (let k = 0; k < this.respon.MemberList[j].MemberList.length; k++) {
                this.classList[0].children[j].children.push({
                  value: this.respon.MemberList[j].MemberList[k].ID,
                  label: this.respon.MemberList[j].MemberList[k].Name,
                  children: []
                })
                // 班级
                for (let g = 0; g < this.respon.MemberList[j].MemberList[k].MemberList.length; g++) {
                  this.classList[0].children[j].children[k].children.push({
                    value: this.respon.MemberList[j].MemberList[k].MemberList[g].ID,
                    label: this.respon.MemberList[j].MemberList[k].MemberList[g].Name,
                    children: []
                  })
                }
              }
            }
          }
        }
      },
      cascaderChange (val, data) {
        console.log(data)
        this.getClassListID = data
      },
      add () {
        if (this.groups.ClassTerminalGroupId === 0) {
          this.xy.msgError('请先选择班牌分组。')
          return false
        }
        if (this.assignType === '0') { // 行政班
          if (this.getClassListID.length < 4) {
            this.xy.msgError('请先关联行政班。')
            return false
          }
        };
        if (this.assignType === '1') { // 其他
          if (this.tareaData === '') {
            this.xy.msgError('请先填写用途。')
            return false
          }
        }

        this.$refs.formValidate.validate(valid => {
          if (!valid) {
            return this.changeLoading()
          } else {
            this.editFunc()
          }
        })
      },
      async editFunc () {
        this.xy.loading()
        let newArr = []
        for (let i = 0; i < this.formValidate.Head.length; i++) {
          let arr = Object.keys(this.formValidate.Head[i])
          let len = arr.length
          if (len === 2) {
            newArr.push(this.formValidate.Head[i].UserId)
          } else {
            newArr.push(this.formValidate.Head[i].UserID)
          }
        }
        console.log(this.formValidate.Head)
        // newArr = [...newArr, ...this.formValidate.Head]
        let options = {
          ClassTerminalID: this.row.ClassTerminalId, // 班牌ID
          ClassTerminalNumber: this.formValidate.ClassTerminalNumber, // 班牌编号
          ClassTerminalName: this.formValidate.ClassTerminalName, // 班牌名称
          ClassTerminalGroupId: this.groups.ClassTerminalGroupId, // 分组ID
          SchoolDistrictID: this.formValidate.SchoolDistrictID, // 校区
          SchoolDistrictName: this.SchoolDistrictName, // 校区名
          BuildingID: this.formValidate.BuildingID, // 楼
          BuildingName: this.BuildingName, // 楼名
          HouseID: this.formValidate.HouseID, // 场室
          HouseName: this.HouseName, // 场室名
          TypeOfUse: Number(this.assignType), // 选择类型
          UseWords: this.assignType === '0' ? this.getClassListID[3].value.toString() : this.tareaData, // 班级ID
          StudentOrganizationName: this.assignType === '0' ? this.getClassListID[1].label + '/' + this.getClassListID[2].label + '/' + this.getClassListID[3].label : '',
          UserIDS: newArr
        }
        let res = await this.xy.post(`${this.$store.state.apiPath}/api/ClassTerminal/Edit`, options, true)
        if (res.success) {
          this.changeLoading()
          this.xy.msgSuc('编辑成功。')
          this.$router.back()
        } else {
          this.xy.msgError(res.msg)
        }
        this.xy.unloading()
      },
      delHead (index) {
        this.formValidate.Head.splice(index, 1)
      }
    }
  }
</script>
