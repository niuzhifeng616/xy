<template>
  <div></div>
</template>
<script>
  export default {
    name: 'downLoad',
    created () {
      let jsonData = JSON.parse(this.$route.query.d)
      this.xy.downFile(this.$route.query.u, jsonData)
    }
  }
</script>
