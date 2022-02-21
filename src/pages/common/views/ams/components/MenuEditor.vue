<template>
  <div class="ams-main">
    <!-- TODO: 此模块疑似被弃用，暂存 -->
    <!--<h3>修改菜单信息</h3>-->
    <i-form
      ref="menuForm"
      :model="menuForm"
      :rules="menuValidate"
      :label-width="90"
      class="Form"
      >
      <form-item label="菜单编码" prop="bianma">
        <i-input
          v-model="menuForm.bianma"
          size="large"
          placeholder="请输入菜单编码"
          />
      </form-item>
      <form-item label="菜单名称" prop="name">
        <i-input
          v-model="menuForm.name"
          size="large"
          placeholder="请输入菜单名称"
          />
      </form-item>
      <form-item label="菜单地址" prop="address">
        <i-input
          v-model="menuForm.address"
          size="large"
          placeholder="请输入菜单地址"
          />
      </form-item>
      <form-item label="排序号" prop="num">
        <i-input
          v-model="menuForm.num"
          size="large"
          placeholder="请输入排序号"
          />
      </form-item>
      <form-item label="图标" prop="icon">
        <i-input
          v-model="menuForm.icon"
          size="large"
          placeholder="请输入图标"
          />
      </form-item>
      <form-item>
        <i-button type="primary" ghost @click="back" style="margin-right:30px">返回</i-button>
        <i-button type="primary" @click="menuSubmit('menuForm')">保存</i-button>
      </form-item>
    </i-form>
  </div>
</template>

<script>
  export default {
    name: 'AMS_MenuEditor',
    data () {
      return {
        menuForm: {
          name: '',
          num: '',
          address: '',
          bianma: '',
          icon: ''
        },
        menuValidate: {
          name: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          num: [{ required: true, message: '排序号不能为空', trigger: 'blur' }],
          address: [
            { required: true, message: '菜单地址不能为空', trigger: 'blur' }
          ],
          bianma: [
            { required: true, message: '菜单编码不能为空', trigger: 'blur' }
          ],
          icon: [{ required: true, message: '图标不能为空', trigger: 'blur' }]
        }
      }
    },
    created: function () {},
    mounted: function () {},
    methods: {
      // 保存
      menuSubmit (name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.xy.msgSuc('保存成功。')
          } else {
            this.xy.msgError('保存失败。')
          }
        })
      },
      // 返回
      back () {
        // TODO: 跳转
        // xy.http.load(xy.webUrl + '/View/AMS/PC/View/MenuManage.html', { targetID: 'XyAMScontent' })
      }
    }
  }
</script>
