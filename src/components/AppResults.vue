<template>
  <tr>
    <td v-for="column in columns">
      <span v-if="result[column]">
      {{result[column].label}}
        <result-icon v-if="result[column]" :link="result[column].link" :state="result[column].state"></result-icon>
      </span>
      <span v-else><result-icon state="unknown"></result-icon></span>
    </td>
  </tr>
</template>
<style scoped>
</style>
<script>
  import ResultIcon from './ResultIcon'
  export default{
    props: ['columns', 'result'],
    components: {
      'result-icon': ResultIcon
    }
  }
</script>
