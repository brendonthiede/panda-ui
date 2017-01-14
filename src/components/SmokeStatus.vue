<template>
  <div id="smoke-status">
    <bamboo-status-loader :bamboo-status-service="bambooStatusService"/>
  </div>
</template>

<script>
  import BambooStatusLoader from './BambooStatusLoader'
  import BambooStatusService from '../services/BambooStatusService'

  export default {
    components: {
      'bamboo-status-loader': BambooStatusLoader
    },
    data: function () {
      return {
        bambooStatusService: new BambooStatusService()
      }
    }
  }
</script>

<style scoped>
  #smoke-status {
    margin: 25px;
  }
</style>
