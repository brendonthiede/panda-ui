<template>
  <div id="bamboo-status-table">
    <div class="filter">
      <label>
        <span @click="isFilterEnabled = !isFilterEnabled" class="icon-wrapper"
              :class="{ enabled: isFilterEnabled }"><img class="icon"
                                                         src="../assets/filter.png"
                                                         :title="filterHint"/></span>
        <input :class="{ enabled: isFilterEnabled }" :title="filterHint" type="text" v-model="filter"/>
      </label>
    </div>
    <table id="status-table-results">
      <thead>
      <results-header :columns="columns" :envs="envs"/>
      </thead>
      <tbody>
      <app-results v-for="result in filteredResults" :key="result.overall.code" :columns="columns" :result="result"/>
      </tbody>
    </table>
  </div>
</template>
<style>
  #bamboo-status-table .filter {
    text-align: left;
    height: 24px;
  }

  #bamboo-status-table .icon {
    height: 12px;
    margin: 2px;
  }

  #bamboo-status-table .icon-wrapper {
    height: 16px;
    width: 16px;
    display: inline-block;
    margin-top: 2px;
    background-color: #e2e2e2;
    border-radius: 8px;
  }

  #bamboo-status-table .icon-wrapper.enabled {
    background-color: #9bd9ff;
  }

  #bamboo-status-table input {
    display: none;
    vertical-align: top;
  }

  #bamboo-status-table input.enabled {
    display: inline-block;
  }

  #status-table-results {
    border-collapse: collapse;
    border-spacing: 0;
    overflow: hidden;
    z-index: 1;
  }

  #bamboo-status-table td, #bamboo-status-table th {
    border: 1px solid #CCC;
    height: 30px;
    position: relative;
    padding: 15px;
  }

  #status-table-results > thead > tr > th:nth-child(1) {
    background-color: transparent;
    border-top: none;
    border-left: none;
  }

  #bamboo-status-table th, #bamboo-status-table tr > td:nth-child(1) {
    font-weight: bold;
    background-color: #f8f8f8;
  }

  #bamboo-status-table td:nth-child(1) {
    text-align: right;
    font-weight: bold;
  }

  #bamboo-status-table td {
    text-align: center;
  }

</style>
<script>
  import ResultsHeader from './ResultsHeader'
  import AppResults from './AppResults'

  export default {
    components: {
      'results-header': ResultsHeader,
      'app-results': AppResults
    },
    props: ['columns', 'envs', 'results'],
    data: function () {
      return {
        filter: '',
        filterHint: 'Comma separated list of text for app names.  Use ! for inverse filtering.',
        isFilterEnabled: true,
        state: 'loading'
      }
    },
    computed: {
      filteredResults: function () {
        if (this.state === 'ready' && this.isFilterEnabled) {
          var localStorage = require('localstorage').localStorage
          var filterKey = this.filter.toLowerCase().trim()
          localStorage.setItem('smoke-status-filter', filterKey)
          var filters = filterKey.split(',').map(function (filter) {
            return {
              isInverse: filter.trim().substr(0, 1) === '!',
              value: filter.trim().replace(/!/g, '')
            }
          })
          return this.results.filter(function (result) {
            var match = false
            var checked = false
            filters.forEach(function (filter) {
              if (!filter.isInverse) {
                checked = true
                var label = result.overall.label.toLowerCase()
                if (label.indexOf(filter.value) > -1) {
                  match = true
                }
              }
            })
            return match || !checked
          }).filter(function (result) {
            var match = true
            filters.forEach(function (filter) {
              var label = result.overall.label.toLowerCase()
              if (filter.isInverse && label.indexOf(filter.value) > -1) {
                match = false
              }
            })
            return match
          })
        } else {
          return this.results
        }
      }
    },
    mounted () {
      var localStorage = require('localstorage').localStorage
      var savedFilter = localStorage.getItem('smoke-status-filter')
      if (savedFilter) {
        this.filter = localStorage.getItem('smoke-status-filter')
      }
      this.state = 'ready'
    }
  }
</script>
