<template>
  <div class="xy-content-module">
    <div class="xy-content-title">
    </div>
    <div class="xy-content-body">
        <div style="width: 410px;margin: 0 auto;">
            <i-form ref="formValidateOk" :model="formValidateOk" :rules="ruleValidateOk" label-position="top">
                <form-item label="所属学科" prop="DisciplineID">
                    <i-select v-model="formValidateOk.DisciplineID">
                        <i-option v-for="item in Discipline" :value="item.DisciplineID" :key="item.DisciplineName">{{ item.DisciplineName }}</i-option>
                    </i-select>
                </form-item>
                <form-item label="模块名称" prop="AchievementName" label-for="AchievementName">
                    <i-input v-model="formValidateOk.AchievementName" element-id="AchievementName"></i-input>
                </form-item>
                <form-item label="模块编号" prop="AchievementNumber" label-for="AchievementNumber">
                    <i-input v-model="formValidateOk.AchievementNumber" element-id="AchievementNumber"></i-input>
                </form-item>
                <form-item label="模块简称" prop="AchievementShort" label-for="AchievementShort">
                    <i-input v-model="formValidateOk.AchievementShort" element-id="AchievementShort"></i-input>
                </form-item>
                <form-item label="模块类别" prop="AchievementType">
                    <radio-group v-model="formValidateOk.AchievementType">
                        <radio label="1">
                            <span>必修</span>
                        </radio>
                        <radio label="2">
                            <span>选择性必修</span>
                        </radio>
                        <radio label="3">
                            <span>选修</span>
                        </radio>
                    </radio-group>
                </form-item>
                <row>
                    <i-col span="12">
                        <form-item label="学时" prop="AchievementHours" label-for="AchievementHours">
                            <input-number v-model="formValidateOk.AchievementHours" :max="100" style="width: 190px;" :min="1" element-id="AchievementHours"></input-number>
                        </form-item>
                    </i-col>
                    <i-col span="12">
                        <form-item label="学分" prop="AchievementScore" label-for="AchievementScore">
                            <input-number v-model="formValidateOk.AchievementScore" :max="100" style="width: 190px;" :min="1" element-id="AchievementScore"></input-number>
                        </form-item>
                    </i-col>
                </row>
                <form-item label="说明" prop="AchievementExplain" label-for="AchievementExplain">
                    <i-input v-model="formValidateOk.AchievementExplain" type="textarea" element-id="AchievementExplain"></i-input>
                </form-item>
                <div class="text-center">
                    <i-button @click="ok" class="xy-btn-primary" shape="circle">保存</i-button>
                    <i-button @click="cancel" class="xy-btn-close">取消</i-button>
                </div>
            </i-form>
        </div>
    </div>
</div>
</template>

<script>
  export default {
    name: 'AchievementEdit',
    data () {
      return {
        Discipline: [],
        ruleValidateOk: {
          DisciplineID: [
            { type: 'number', required: true, message: '请选择学科', trigger: 'change' }
          ],
          AchievementName: [
            { type: 'string', required: true, message: '模块名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '模块名称不能超过20个字', trigger: 'blur' }
          ],
          AchievementNumber: [
            { type: 'string', required: true, message: '模块编号不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '模块编号不能超过20个字', trigger: 'blur' }
          ],
          AchievementShort: [
            { type: 'string', max: 20, message: '模块简称不能超过20个字', trigger: 'blur' }
          ],
          AchievementType: [
            { type: 'string', required: true, message: '请选择模块类别', trigger: 'change' }
          ],
          AchievementHours: [
            { type: 'number', required: true, message: '学时不能为空', trigger: 'change' }
          ],
          AchievementScore: [
            { type: 'number', required: true, message: '学分不能为空', trigger: 'change' }
          ],
          AchievementExplain: [
            { type: 'string', max: 50, message: '说明只能输入50个字符', trigger: 'blur' }
          ]
        },
        formValidateOk: {
          DisciplineID: '',
          AchievementName: '',
          AchievementNumber: '',
          AchievementShort: '',
          AchievementType: '1',
          AchievementHours: 0,
          AchievementScore: 0,
          AchievementExplain: ''
        },
        APIPath: this.$store.state.apiPath + '/api/Achievement'
      }
    },
    created () {
      // 获取上一页参数
      this.getRows()
      this.getAllDiscipline()
    },
    mounted () {

    },
    methods: {
      // 获取上一页参数
      getRows () {
        let row = ''
        row = this.$store.state.common.menuInfo
        this.editId = row.AchievementID
        this.formValidateOk.DisciplineID = row.AchievementDisciplineID
        this.formValidateOk.AchievementName = row.AchievementName
        this.formValidateOk.AchievementNumber = row.AchievementNumber
        this.formValidateOk.AchievementShort = row.AchievementShort
        this.formValidateOk.AchievementType = row.AchievementType.toString()
        this.formValidateOk.AchievementHours = Number(row.AchievementHours)
        this.formValidateOk.AchievementScore = Number(row.AchievementScore)
        this.formValidateOk.AchievementExplain = row.AchievementExplain
      },
      // 加载学科
      async getAllDiscipline () {
        let res = await this.xy.get(this.xyApi + '/base/api/Discipline/GetAllDiscipline', null)
        if (res.success) {
          this.Discipline = res.data
        }
      },
      ok () {
        let _this = this
        this.$refs.formValidateOk.validate((valid) => {
          if (!valid) {
            return _this.changeLoading()
          } else {
            _this.xy.post(_this.APIPath + '/Edit', {
              AchievementID: _this.editId,
              AchievementName: _this.formValidateOk.AchievementName,
              AchievementNumber: _this.formValidateOk.AchievementNumber,
              AchievementShort: _this.formValidateOk.AchievementShort,
              AchievementDisciplineID: _this.formValidateOk.DisciplineID,
              AchievementType: _this.formValidateOk.AchievementType,
              AchievementHours: _this.formValidateOk.AchievementHours,
              AchievementScore: _this.formValidateOk.AchievementScore,
              AchievementExplain: _this.formValidateOk.AchievementExplain
            }).then(res => {
              if (res.success) {
                _this.changeLoading()
                _this.xy.msgSuc('编辑成功。')
                _this.ReturnClick()
                _this.$refs.formValidateOk.resetFields()
              } else {
                _this.changeLoading()
              };
            })
          }
        })
      },
      cancel () {
        let _this = this
        _this.ReturnClick()
      },
      changeLoading () {
        this.loading = false
        this.$nextTick(function () {
          this.loading = true
        })
      },
      // 返回
      ReturnClick () {
        this.$router.go(-1)
      }
    }
  }
</script>
