import Util from './Util'

export default class BambooStatusService {
  planCount = 0
  response = {columns: [], envs: {}, results: []}

  getBambooStatuses (callBack, projectKey) {
    BambooStatusService.getBambooData(this, projectKey, BambooStatusService.plansNextAction, callBack)
  }

  getJobsForPlans (plans, callBack) {
    for (var i = 0; i < plans.length; i++) {
      BambooStatusService.getBambooData(this, plans[i].buildResultKey, BambooStatusService.jobNextAction, callBack, 'stages.stage.results.result')
    }
  }

  updateResults (envCode, appCode, label, state, link) {
    var exists = false
    var appResults
    for (var i = 0; i < this.response.results.length; i++) {
      if (this.response.results[i].overall.code === appCode) {
        appResults = this.response.results[i]
        if (state === 'Failed') {
          appResults.overall.state = 'Failed'
        }
        exists = true
      }
    }
    if (!exists) {
      appResults = {'overall': {'code': appCode, 'label': label, 'state': state}}
      this.response.results.push(appResults)
    }
    appResults[envCode] = {code: envCode + '-' + appCode, state: state, link: link}
  }

  initializeResponse () {
    this.response = {'columns': ['overall'], 'envs': {'overall': {label: '', code: 'overall'}}, 'results': []}
  }

  processEnvPlans (response) {
    var envPlans = response.result
    this.initializeResponse()
    this.planCount = envPlans.length
    for (var i = 0; i < this.planCount; i++) {
      var envPlan = envPlans[i]
      var envName = BambooStatusService.getNormalizedName(envPlan.plan.shortName)
      var envCode = BambooStatusService.getCodeFromName(envName)
      this.response.columns.push(envCode)
      this.response.envs[envCode] = {
        code: envCode,
        label: envName,
        link: process.env.BAMBOO_BROWSE_URL + envPlan.buildResultKey,
        state: envPlan.state
      }
    }
    return envPlans
  }

  processEnvJobs (responseBody, callBack) {
    var envName = BambooStatusService.getNormalizedName(responseBody.plan.shortName)
    var envCode = BambooStatusService.getCodeFromName(envName)
    for (var i = 0; i < responseBody.stages.stage[0].results.result.length; i++) {
      var appResult = responseBody.stages.stage[0].results.result[i]
      var appName = BambooStatusService.getNormalizedName(appResult.planName)
      var appCode = BambooStatusService.getCodeFromName(appName)
      this.updateResults(envCode, appCode, appName, appResult.state, process.env.BAMBOO_BROWSE_URL + appResult.buildResultKey)
    }
    this.planCount -= 1
    if (this.planCount === 0) {
      this.response.results.sort(BambooStatusService.compareApps)
      this.response.columns.sort(BambooStatusService.compareEnvs)
      this.response.state = 'ready'
      if (callBack) {
        callBack(this.response)
      }
    }
  }

  static getBambooData (service, key, nextAction, callBack, expand) {
    var uri = process.env.BAMBOO_RESULT_URL + key
    if (expand) {
      uri += '?expand=' + expand
    }
    Util.getJSON(uri, function (response) {
      nextAction(service, response, callBack)
    }, function (response) {
      Util.processError(response, 'retrieving ' + key, callBack)
    })
  }

  static plansNextAction (service, response, callBack) {
    service.processEnvPlans(response.results)
    service.getJobsForPlans(response.results.result, callBack)
  }

  static jobNextAction (service, response, callBack) {
    service.processEnvJobs(response, callBack)
  }

  static compareEnvs (a, b) {
    var order = {
      'overall': '01',
      'qa': '01',
      'sq': '02',
      'preprod': '03',
      'mdc': '04',
      'uat': '05',
      'dcmuat': '06',
      'prod': '07',
      'dcm-prod': '08'
    }
    var nameA = order[a] || a
    var nameB = order[b] || b
    return nameA.localeCompare(nameB)
  }

  static compareApps (a, b) {
    var nameA = a.overall.label || 'zzzz'
    var nameB = b.overall.label || 'zzzz'
    return nameA.localeCompare(nameB)
  }

  static getNormalizedName (planName) {
    var envName = planName
    while (envName.indexOf(' - ') >= 0) {
      envName = envName.substring(envName.indexOf(' - ') + 3)
    }
    return envName.replace(/ Environment$/g, '')
  }

  static getCodeFromName (name) {
    return name.toLowerCase().replace(/\s+/g, '-')
  }
}
