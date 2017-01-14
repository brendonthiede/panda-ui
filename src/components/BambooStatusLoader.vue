<template>
  <div id="loader">
    <bamboo-status-table :columns="columns" :envs="envs" :results="results"/>
    <div v-if="state === 'initializing'" id="status-table-loading"><em>LOADING</em></div>
    <div v-if="state === 'error'" id="status-table-error">{{ errorMessage }}</div>
  </div>
</template>

<script>
  import BambooStatusTable from './BambooStatusTable'

  export default {
    components: {
      'bamboo-status-table': BambooStatusTable
    },
    data: function () {
      return {
        state: 'initializing',
        columns: [],
        envs: {},
        results: [],
        errorMessage: '',
        buildProjectKey: process.env.BAMBOO_PROJECT_KEY
      }
    },
    props: ['bambooStatusService'],
    methods: {
      updateData (result) {
        if (result.state === 'error') {
          this.errorMessage = result.errorMessage
        } else {
          this.columns = result.columns
          this.envs = result.envs
          this.results = result.results
        }
        this.state = result.state
      },
      refresh () {
        if (this.state !== 'loading') {
          if (this.state !== 'initializing') {
            this.state = 'loading'
          }
          this.bambooStatusService.getBambooStatuses(this.updateData, this.buildProjectKey)
        }
      }
    },
    mounted () {
      this.refresh()
      setInterval(function () {
        this.refresh()
      }.bind(this), 10000)
    }
  }
</script>
