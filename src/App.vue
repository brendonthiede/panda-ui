<template>
  <div id="app">
    <top-menu/>
    <router-view class="view"/>
  </div>
</template>

<script>
  import TopMenu from './components/TopMenu'

  export default {
    components: {
      'top-menu': TopMenu
    },
    created () {
      var location = require('location').location
      var routePattern = /routeName=([^&]+)/i
      var routeParamMatch = routePattern.exec(location.search)
      if (routeParamMatch && routeParamMatch.length === 2) {
        this.$router.push({name: routeParamMatch[1]})
      }
    }
  }
</script>

<style>
  html {
    height: 100%;
    width: 100%;
    margin: 0;
  }

  body {
    height: 100%;
    width: 100%;
    margin: 0;
  }

  #app {
    color: #2c3e50;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    text-align: center;
  }
</style>
