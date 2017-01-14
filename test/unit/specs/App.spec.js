import Vue from 'vue'
import VueRouter from 'vue-router'
import App from 'src/App'
import Routes from 'src/services/Routes'
import MockBambooResponse from '../../data/MockBambooResponse.json'

Vue.use(VueRouter)

function getRenderedComponent () {
  document.write('<div id="app" />')
  return new Vue({
    el: '#app',
    router: Routes.router,
    render: h => h(App)
  })
}

describe('App', () => {
  var sandbox
  var server

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    server = sandbox.useFakeServer()
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('loads', (done) => {
    var app = getRenderedComponent(App, {})
    app.$router.push({name: 'smokestatus'})

    app.$nextTick(() => {
      var dataKeys = ['SST', 'SST-SSTPPE-1960', 'SST-SSTPE-1995', 'SST-SSTQAE-1925']
      for (var i = 0; i < dataKeys.length; i++) {
        server.requests[i].respond(
          200,
          {'Content-Type': 'application/json'},
          JSON.stringify(MockBambooResponse[dataKeys[i]])
        )
      }
      app.$nextTick(() => {
        expect(app.$el.querySelectorAll('#status-table-results').length).to.equal(1)
        done()
      })
    })
  })
})
