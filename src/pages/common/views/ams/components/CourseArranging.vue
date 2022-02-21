<template>
  <i-form
    ref="courseForm"
    :model="courseForm"
    :rules="courseValidate"
    :label-width="160"
    class="Form"
    >
    <!-- TODO: 此模块疑似弃用，暂存 -->
    <form-item label="是否开启排课中枢" prop="num">
      <i-switch size="large" @on-change="courseChange">
        <span slot="open">开启</span>
        <span slot="close">隐藏</span>
      </i-switch>
    </form-item>
    <form-item label="上传地址" prop="courseAddress">
      <i-input
        v-model="courseForm.courseAddress"
        :disabled="courseInput"
        size="large"
        placeholder="请输入上传地址"
        />
    </form-item>
    <form-item label="是否开启中枢监控" prop="num" v-if="isShow">
      <i-switch size="large" @on-change="monitoringChange">
        <span slot="open">开启</span>
        <span slot="close">隐藏</span>
      </i-switch>
    </form-item>
    <form-item label="监控地址" prop="monitoringAddress" v-if="isShow">
      <i-input
        v-model="courseForm.monitoringAddress"
        :disabled="monitoringInput"
        size="large"
        placeholder="请输入监控地址"
        />
    </form-item>
    <form-item>
      <Button class="xy-btn-primary" @click="courseSubmit('courseForm')" shape="circle">保存</Button>
    </form-item>
  </i-form>
</template>

<script>
  export default {
    name: 'AMS_CourseArranging',
    data () {
      return {
        isShow: false,
        courseInput: true,
        monitoringInput: true,
        courseForm: {
          // 页脚设置
          courseAddress: 'http://192.168.1.50:8020/GetFiles',
          monitoringAddress: 'http://192.168.1.50:8019/'
        },
        courseValidate: {
          // 页脚设置
          courseAddress: '',
          monitoringAddress: ''
        }
      }
    },
    created: function () {},
    mounted: function () {},
    methods: {
      // 保存
      courseSubmit (name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.xy.msgSuc('保存成功。')
          } else {
            this.xy.msgError('保存失败。')
          }
        })
      },
      courseChange (status) {
        let Validate = [
          { required: true, message: '上传地址不能为空', trigger: 'blur' }
        ]
        if (status) {
          this.isShow = true
          this.courseInput = false
          this.courseValidate.courseAddress = Validate
        } else {
          this.isShow = false
          this.courseInput = true
          this.courseValidate.courseAddress = ''
        }
      },
      monitoringChange (status) {
        let Validate = [
          { required: true, message: '监控地址不能为空', trigger: 'blur' }
        ]
        if (status) {
          this.monitoringInput = false
          this.courseValidate.monitoringAddress = Validate
        } else {
          this.monitoringInput = true
          this.courseValidate.monitoringAddress = ''
        }
      }
    }
  }
</script>
