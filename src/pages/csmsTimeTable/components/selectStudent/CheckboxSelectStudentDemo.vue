<template>
  <div>
    <SelectStudent
      :schoolDistrictID="schoolDistrictID"
      :isShow="isShow"
      :selectMembers="selectMembers"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectStudent>
    <dl>
      <dt>已选学生</dt>
      <li class="item" v-for="item in selectedRooms" :key="item.key">{{item.title}}</li>
    </dl>
    <Button type="primary" @click="goSelectTeacher">选择学生</Button>
  </div>
</template>
<script>
  import SelectStudent from './CheckboxSelectStudent.vue'

  export default {
    name: 'CheckboxSelectStudent',
    components: {
      SelectStudent
    },
    data () {
      return {
        isShow: false,
        selectedRooms: [],
        selectMembers: [],
        schoolDistrictID: 0
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
        this.selectedRooms = [...data]
        this.selectMembers = this.selectedRooms
        console.log(this.selectMembers)
      }
    }
  }
</script>
<style lang="less">

</style>
