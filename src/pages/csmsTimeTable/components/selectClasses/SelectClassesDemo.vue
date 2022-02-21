<template>
  <div>
    <SelectClasses
      :isShow="isShow"
      :selectMembers="[...selectedRooms]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectClasses>
    <dl>
      <dt>已选教室</dt>
      <li class="item" v-for="item in selectedRooms" :key="item.UserID">{{item.FullName}}</li>
    </dl>
    <Button type="primary" @click="goSelectTeacher">选择教室</Button>
  </div>
</template>
<script>
  import SelectClasses from './SelectClasses.vue'

  export default {
    name: 'SelectClassesDemo',
    components: {
      SelectClasses
    },
    data () {
      return {
        isShow: false,
        selectedRooms: []
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
      }
    }
  }
</script>
<style lang="less">

</style>
