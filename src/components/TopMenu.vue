<template>
  <ul id="navbar" class="topnav">
    <li v-for="route in routeDefinitions">
      <router-link :to="{ name: route.name }">
        <img class="icon" v-if="route.name === 'home'" src="../assets/wrench.png">{{route.meta.label}}
      </router-link>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      routeDefinitions: {
        type: Array,
        default: function () {
          return this.$router.options.routes
        }
      }
    }
  }
</script>

<style scoped>
  ul.topnav {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #205081;
    margin-bottom: 25px;
  }

  /* Float the list items side by side */
  ul.topnav li {float: left;}

  /* Style the links inside the list items */
  ul.topnav li a {
    display: inline-block;
    color: #fff;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    transition: 0.3s;
    font-size: 14px;
    line-height: 1;
  }

  /* Change background color of links on hover */
  ul.topnav li a:hover {
    background-color: #3572b0;
  }

  /* Hide the list item that contains the link that should open and close the topnav on small screens */
  img.icon {
    margin: 0;
    padding: 0;
    margin-right: 2px;
    height: 12px;
  }
</style>
