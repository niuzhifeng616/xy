<template>
  <div>
    <SelectClassRadio
      :isShow="isShow"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm"
    >
    </SelectClassRadio>
    <dl>
      <dt>已选班级</dt>
        <dd class="jiaoshi">{{selectClass.FullName}}</dd>
    </dl>
    <Button type="primary" @click="goSelectClass">选择班级</Button>
  </div>
</template>
<script>
  import SelectClassRadio from './SelectClassRadio.vue'

  export default {
    name: 'SelectClassRadioDemo',
    components: {
      SelectClassRadio
    },
    data () {
      return {
        isShow: false,
        selectClass: ''
      }
    },
    methods: {
      goSelectClass () {
        this.isShow = true
      },
      selectCancel () {
        this.isShow = false
      },
      selectConfirm (data) {
        this.isShow = false
        this.selectClass = data
      }
    }
  }
</script>
<style lang="less">

</style>
