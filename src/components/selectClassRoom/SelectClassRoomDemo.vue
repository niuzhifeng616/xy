<template>
  <div>
    <SelectClassRoom
      :isShow="isShow"
      :selectMembers="[...selectedRooms]"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectClassRoom>
    <dl>
      <dt>已选场室</dt>
      <li class="item" v-for="item in selectedRooms" :key="item.UserID">{{item.FullName}}</li>
    </dl>
    <Button type="primary" @click="goSelectTeacher">选择场室</Button>
  </div>
</template>
<script>
  import SelectClassRoom from './SelectClassRoom.vue'

  export default {
    name: 'SelectClassRoomDemo',
    components: {
      SelectClassRoom
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
