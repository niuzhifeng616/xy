<template>
  <div>
    <SelectDutyAndRole
      :isShow="isShow"
      :teachers="[...selectedTeachers]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectDutyAndRole>
    <dl>
      <dt>已选教师</dt>
      <li class="item" v-for="item in selectedTeachers" :key="item.UserID">{{item.FullName}}</li>
    </dl>
    <Button type="primary" @click="goSelectTeacher">按角色选择</Button>
  </div>
</template>
<script>
  import SelectDutyAndRole from './SelectDutyAndRole.vue'

  export default {
    name: 'SelectDutyAndRoleDemo',
    components: {
      SelectDutyAndRole
    },
    data () {
      return {
        isShow: false,
        selectedTeachers: []
      }
    },
    methods: {
      goSelectTeacher () {
        this.isShow = true
      },
      selectCancel () {
        this.isShow = false
      },
      selectConfirm (data) {
        this.isShow = false
        this.selectedTeachers = [...data]
      }
    }
  }
</script>
<style lang="less">

</style>
