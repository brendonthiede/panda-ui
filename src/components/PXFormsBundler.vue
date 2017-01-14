<template>
  <div id="px-forms-bundler" class="container">
    <h1 class="title">PX Forms Bundler</h1>
    <div class="panel panel-default">
      <div class="panel-heading">
        Overview
      </div>
      <div class="panel-body">
        <p>
          The PX Forms Bundler is used to select which templates directory you would like to package for
          a deployment. The directory chosen below will be pulled from
          <code>{{ psoServer }}</code> at <code>{{ templatePath }}</code>
          by the <a :href="buildPlanPath">"PX Forms Preparation"</a> plan in Bamboo.
          Once the directories are pulled over to Bamboo the templates will be tarred up and stored as an
          artifact on the build plan.
        </p>
        <p>
          After the Bamboo build plan has created a release, you can run one of the Deploy plans to
          deploy the tar to the desired environment. Links to run deployments are on the
          <a :href="buildPlanPath + '/latest'">Summary</a> tab of a completed build, or you can go to the
          <a :href="deployPlanPath">PX Forms</a> Deployment
          project.
        </p>
        <p>
          <em>Note on Production:</em> Deployments to the production environment are handled by the
          deployment engineers (currently Brian Bevins).
          The Prod deployment artifact is created by running the PreProd deployment.
        </p>
      </div>
    </div>
    <form v-show="isLoggedIn" id="configuration" class="form-inline">
      <div class="form-group">
        <label for="templateDirectories">
          <select id="templateDirectories" data-style="btn-info" v-model="selectedDirectory">
            <option value="">Select a template directory...</option>
            <option v-for="templateDirectory in templateDirectories"
                    :value="templateDirectory">{{templateDirectory}}</option>
          </select>
        </label>
        <button id="execute-build-plan"
                title="Starts the Bamboo build plan"
                class="btn btn-default" type="button"
                v-on:click="executeBuildPlan">Initiate Bamboo Build</button>
        <button id="show-preview"
                title="See a preview of what the tar content will look like"
                class="btn" type="button"
                v-on:click="showPreview">Preview</button>
      </div>
    </form>
    <message-log :messages="messages" @messageRemoved="removeMessage" />
    <div id="preview" v-show="preview.length > 0">
      <h3>Preview:</h3>
      <pre>
{{ preview }}
      </pre>
    </div>
  </div>
</template>

<script>
  import Util from '../services/Util'
  import MessageLog from '../components/MessageLog'

  export default {
    components: {
      'message-log': MessageLog
    },
    data: function () {
      return {
        psoServer: 'devfilesrv1vm',
        templatePath: '/db_01/psodeploy/app/px/templates',
        buildPlanPath: '/browse/PSO-PXFORMS',
        deployPlanPath: '/deploy/viewDeploymentProjectEnvironments.action?id=130613250',
        templateDirectories: [],
        isLoggedIn: false,
        selectedDirectory: '',
        preview: '',
        messages: []
      }
    },
    methods: {
      showErrorMessage: function (message, link) {
        this.messages.push({header: 'Error', style: 'panel-danger', body: message, link: link})
      },
      showSuccessMessage: function (message, link) {
        this.messages.push({header: 'Success', style: 'panel-success', body: message, link: link})
      },
      removeMessage: function (index) {
        this.messages.splice(index, 1)
      },
      refreshTemplateDirectories: function () {
        var app = this
        Util.getJSON(process.env.PSO_HELPER + '?method=getSubscriberList',
          function (response) {
            app.templateDirectories = response.result.subscribers
          },
          function (response, status, url) {
            app.showErrorMessage(response)
          })
      },
      showPreview: function () {
        var app = this
        var queryParams = '?method=getPreview&templateDirectory=' + app.selectedDirectory
        Util.getJSON(process.env.PSO_HELPER + queryParams,
          function (response) {
            app.preview = response.result.preview.join('\n')
          },
          function (response) {
            console.error('Error loading preview')
            app.showErrorMessage(response)
          })
      },
      checkUserLogin: function () {
        var app = this
        Util.getJSON('/rest/api/1.0/currentUser',
          function () {
            app.isLoggedIn = true
          },
          function (msg, status) {
            var loginURL = false
            if (status === 401) {
              var location = require('location').location
              var returnURL = encodeURIComponent(location.pathname)
              loginURL = '/userlogin!default.action?os_destination=' + returnURL
              msg = 'You are not logged in to Bamboo.  Use the below link to login:'
            }
            app.showErrorMessage(msg, loginURL)
          })
      },
      executeBuildPlan: function () {
        var app = this
        var selectedDirectory = this.selectedDirectory
        var url = '/rest/api/1.0/queue/PSO-PXFORMS'
        var param = '?bamboo.template.directory=' + selectedDirectory
        Util.postJSON(url + param,
          function (response) {
            var msg = 'Bamboo build successfully initiated:'
            app.showSuccessMessage(msg, 'http://bamboo.sircon.com/browse/' + response.buildResultKey)
          },
          function (msg, status) {
            app.showErrorMessage(msg)
          })
      }
    },
    mounted () {
      this.checkUserLogin()
      this.refreshTemplateDirectories()
    }
  }
</script>

<style scoped>
  div.container {
    width: 75%;
    margin-left: auto;
    margin-right: auto;
  }

  #message-panel {
    margin-top: 20px;
  }

  #preview {
    text-align: left;
    margin-top: 20px;
  }
</style>
