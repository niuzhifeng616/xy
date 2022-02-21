<template>
  <div>
    <SelectTeacher
      :schoolDistrictID="schoolDistrictID"
      :isShow="isShow"
      :selectMembers="selectMembers"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectTeacher>
    <dl>
      <dt>已选教师</dt>
      <li class="item" v-for="item in selectedRooms" :key="item.key">{{item.title}}</li>
    </dl>
    <Button type="primary" @click="goSelectTeacher">选择教师</Button>
  </div>
</template>
<script>
  import SelectTeacher from './CheckboxSelectTeacher.vue'

  export default {
    name: 'CheckboxSelectTeacher',
    components: {
      SelectTeacher
    },
    data () {
      return {
        isShow: false,
        selectedRooms: [],
        selectMembers: [],
        schoolDistrictID: -99
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
        this.selectMembers = this.selectedRooms.map(v => v.UserID)
        console.log(this.selectMembers)
      }
    }
  }
</script>
<style lang="less">

</style>
