<template>
  <div>
    <SelectClassRoom
      :classTableID="classTableID"
      :isShow="isShow"
      :selectMembers="selectMembers"
      @select-cancel="selectCancel"
      @select-confirm="selectConfirm">
    </SelectClassRoom>
    <dl>
      <dt>已选场室</dt>
      <li class="item" v-for="item in selectedRooms" :key="item.key">{{item.title}}</li>
    </dl>
    <Button type="primary" @click="goSelectTeacher">选择场室</Button>
  </div>
</template>
<script>
  import SelectClassRoom from './CheckboxSelectClasses.vue'

  export default {
    name: 'CheckboxSelectClasses',
    components: {
      SelectClassRoom
    },
    data () {
      return {
        isShow: false,
        selectedRooms: [],
        selectMembers: [],
        classTableID: 304
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
        this.selectMembers = []
        this.selectedRooms.map(item => {
          this.selectMembers.push(item.id)
        })
        // console.log(this.selectMembers)
      }
    }
  }
</script>
<style lang="less">

</style>
