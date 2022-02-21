<template>
  <div>
    <SelectTeacherOrg
      :isShow="isShow"
      :teachers="[...selectedTeachers]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectTeacherOrg>
    <dl>
      <dt>已选教师</dt>
      <li class="item" v-for="item in selectedTeachers" :key="item.UserName">{{item.FullName}}</li>
    </dl>
    <Button type="primary" @click="goSelectTeacher">选择教师</Button>
  </div>
</template>
<script>
  import SelectTeacherOrg from './SelectTeacherOrg.vue'

  export default {
    name: 'SelectTeacherOrgDemo',
    components: {
      SelectTeacherOrg
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
