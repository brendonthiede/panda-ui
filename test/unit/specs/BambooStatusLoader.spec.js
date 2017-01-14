import Vue from 'vue'
import BambooStatusLoader from 'src/components/BambooStatusLoader'

// helper function that mounts and returns the rendered text
function getRenderedComponent (Component, propsData) {
  const Ctor = Vue.extend(Component)
  return new Ctor({propsData}).$mount()
}

describe('BambooStatusLoader', () => {
  var localStorage = require('localstorage').localStorage
  var agySuccessfulResult = {
    'overall': {code: 'overall', label: 'AgencyEDGE', state: 'Successful'},
    'qa': {code: 'qa-agencyedge', state: 'Successful', link: 'http://blah.com/test/agy'}
  }
  var agyFailedResult = {
    'overall': {code: 'overall', label: 'AgencyEDGE', state: 'Failed'},
    'qa': {code: 'qa-agencyedge', state: 'Failed', link: 'http://blah.com/test/agy'}
  }
  var cxSuccessfulResult = {
    'overall': {code: 'overall', label: 'Compliance Express', state: 'Successful'},
    'qa': {code: 'qa-compliance_express', state: 'Successful', link: 'http://blah.com/test/cx'}
  }
  var mockResult = {
    'columns': ['overall', 'qa'],
    'envs': {
      'overall': {label: '', code: 'overall'},
      'qa': {label: 'QA', code: 'qa'}
    },
    'results': []
  }
  var mockError = {state: 'error', errorMessage: 'bad things happened'}
  var clock

  beforeEach(function () {
    this.clock = sinon.useFakeTimers()
    clock = this.clock
    localStorage.setItem('smoke-status-filter', '')
  })

  afterEach(function () {
    this.clock = sinon.restore()
  })

  it('loads status', (done) => {
    mockResult.results = [agySuccessfulResult]
    var bambooStatusLoader = getRenderedComponent(BambooStatusLoader, {
      bambooStatusService: {
        getBambooStatuses: function (callBack) {
          callBack(mockResult)
        }
      }
    })
    expect(bambooStatusLoader.$el.querySelector('#status-table-loading').textContent).to.equal('LOADING')

    bambooStatusLoader.$nextTick(() => {
      expect(bambooStatusLoader.$el.querySelectorAll('#status-table-results tr').length).to.equal(2)
      expect(bambooStatusLoader.$el.querySelectorAll('#status-table-results tr:nth-child(1)>th').length).to.equal(2)
      expect(bambooStatusLoader.$el.querySelector('#status-table-results>tbody>tr:nth-child(1)>td:nth-child(1)').textContent.trim()).to.equal('AgencyEDGE')
      expect(bambooStatusLoader.$el.querySelector('#status-table-results>tbody>tr:nth-child(1)>td:nth-child(1) img').src).to.contain('successful')
      expect(bambooStatusLoader.$el.querySelectorAll('#status-table-loading').length).to.equal(0)
      expect(bambooStatusLoader.$el.querySelectorAll('#status-table-error').length).to.equal(0)
      done()
    })
  })

  it('gets changes on reload', (done) => {
    mockResult.results = [agySuccessfulResult]
    var bambooStatusLoader = getRenderedComponent(BambooStatusLoader, {
      bambooStatusService: {
        getBambooStatuses: function (callBack) {
          callBack(mockResult)
        }
      }
    })
    expect(bambooStatusLoader.$el.querySelector('#status-table-loading').textContent).to.equal('LOADING')

    bambooStatusLoader.$nextTick(() => {
      expect(bambooStatusLoader.$el.querySelectorAll('#status-table-results tr').length).to.equal(2)
      expect(bambooStatusLoader.$el.querySelectorAll('#status-table-results tr:nth-child(1)>th').length).to.equal(2)
      expect(bambooStatusLoader.$el.querySelector('#status-table-results>tbody>tr:nth-child(1)>td:nth-child(1)').textContent.trim()).to.equal('AgencyEDGE')
      expect(bambooStatusLoader.$el.querySelector('#status-table-results>tbody>tr:nth-child(1)>td:nth-child(1) img').src).to.contain('successful')
      expect(bambooStatusLoader.$el.querySelectorAll('#status-table-loading').length).to.equal(0)
      mockResult.results = [agyFailedResult, cxSuccessfulResult]
      bambooStatusLoader.refresh()
      clock.tick(10001)
      bambooStatusLoader.$nextTick(() => {
        expect(bambooStatusLoader.$el.querySelectorAll('#status-table-results tr').length).to.equal(3)
        expect(bambooStatusLoader.$el.querySelectorAll('#status-table-results tr:nth-child(1)>th').length).to.equal(2)
        expect(bambooStatusLoader.$el.querySelector('#status-table-results>tbody>tr:nth-child(1)>td:nth-child(1)').textContent.trim()).to.equal('AgencyEDGE')
        expect(bambooStatusLoader.$el.querySelector('#status-table-results>tbody>tr:nth-child(1)>td:nth-child(1) img').src).to.contain('failed')
        expect(bambooStatusLoader.$el.querySelector('#status-table-results>tbody>tr:nth-child(2)>td:nth-child(1)').textContent.trim()).to.equal('Compliance Express')
        expect(bambooStatusLoader.$el.querySelector('#status-table-results>tbody>tr:nth-child(2)>td:nth-child(1) img').src).to.contain('successful')
        expect(bambooStatusLoader.$el.querySelectorAll('#status-table-loading').length).to.equal(0)

        done()
      })
    })
  })

  it('shows error message', (done) => {
    var bambooStatusLoader = getRenderedComponent(BambooStatusLoader, {
      bambooStatusService: {
        getBambooStatuses: function (callBack) {
          callBack(mockError)
        }
      }
    })
    expect(bambooStatusLoader.$el.querySelector('#status-table-loading').textContent).to.equal('LOADING')

    bambooStatusLoader.$nextTick(() => {
      expect(bambooStatusLoader.$el.querySelectorAll('#status-table-results>tr>th').length).to.equal(0)
      expect(bambooStatusLoader.$el.querySelectorAll('#status-table-loading').length).to.equal(0)
      expect(bambooStatusLoader.$el.querySelector('#status-table-error').textContent.trim()).to.equal('bad things happened')
      done()
    })
  })
})
