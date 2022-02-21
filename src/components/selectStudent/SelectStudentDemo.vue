<template>
  <div>
    <SelectStudent
      :isShow="isShow"
      :teachers="[...selectedTeachers]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectStudent>
    <dl>
      <dt>已选学生</dt>
      <li class="item" v-for="item in selectedTeachers" :key="item.UserID">{{item.FullName}}</li>
    </dl>
    <Button type="primary" @click="goSelectTeacher">选择学生</Button>
  </div>
</template>
<script>
  import SelectStudent from './SelectStudent.vue'

  export default {
    name: 'SelectStudentDemo',
    components: {
      SelectStudent
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
        console.log(data)
        this.selectedTeachers = [...data]
      }
    }
  }
</script>
<style lang="less">

</style>
