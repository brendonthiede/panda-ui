<template>
  <tr>
    <th v-for="column in columns" :key="envs[column].code" :env="envs[column].code">
      <a :href="envs[column].link">{{envs[column].label}}</a>
      <result-icon v-if="column !== 'overall'" :link="envs[column].link" :state="envs[column].state"></result-icon>
    </th>
  </tr>
</template>
<style scoped>
  th:nth-child(1) {
    border-top: none;
    border-left: none;
    background-color: #FFFFFF;
  }

  a {
    color: #42b983;
    text-decoration: none;
  }
</style>
<script>
  import ResultIcon from './ResultIcon'
  export default{
    props: ['columns', 'envs'],
    components: {
      'result-icon': ResultIcon
    }
  }
</script>
