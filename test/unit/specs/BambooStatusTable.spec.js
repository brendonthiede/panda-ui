import Vue from 'vue'
import BambooStatusTable from 'src/components/BambooStatusTable'

function getRenderedComponent (Component, propsData) {
  const Ctor = Vue.extend(Component)
  return new Ctor({propsData}).$mount()
}

describe('BambooStatusTable', () => {
  var localStorage = require('localstorage').localStorage
  var bambooStatusTable

  beforeEach(function () {
    localStorage.setItem('smoke-status-filter', 'Prod, Man')
    bambooStatusTable = getRenderedComponent(BambooStatusTable, {
      columns: ['overall', 'preprod_env', 'prod_env'],
      envs: {
        'overall': {label: '', code: 'overall'},
        'preprod_env': {label: 'PreProd Env', code: 'preprod_env', link: 'http://blah.com/test/', state: 'Successful'},
        'prod_env': {label: 'Prod Env', code: 'prod_env', link: 'http://blah.com/test/', state: 'Successful'}
      },
      results: [
        {
          'overall': {code: 'cx', 'label': 'Compliance Express', state: 'Successful'},
          'preprod_env': {code: 'cx-preprod_env', state: 'Successful', link: 'http://blah.com/preprod/cx'},
          'prod_env': {code: 'cx-prod_env', state: 'unknown', link: 'http://blah.com/prod/cx'}
        },
        {
          'overall': {code: 'pm', 'label': 'Producer Manager', state: 'Successful'},
          'preprod_env': {code: 'pm-preprod_env', state: 'Failed', link: 'http://blah.com/preprod/pm'}
        },
        {
          'overall': {code: 'px', 'label': 'Producer Express', state: 'Successful'},
          'preprod_env': {code: 'px-preprod_env', state: 'Successful', link: 'http://blah.com/preprod/px'},
          'prod_env': {code: 'px-prod_env', state: 'unknown'}
        }
      ]
    })
  })

  it('renders correctly', () => {
    bambooStatusTable.$data.filter = ''
    expect(bambooStatusTable.$el.querySelectorAll('tr').length).to.equal(4)
    expect(bambooStatusTable.$el.querySelectorAll('thead>tr>th').length).to.equal(3)
    expect(bambooStatusTable.$el.querySelectorAll('tbody>tr:nth-child(2)>td').length).to.equal(3)
  })

  it('filters correctly', (done) => {
    bambooStatusTable.$nextTick(() => {
      expect(bambooStatusTable.$el.querySelectorAll('tr').length).to.equal(3)
      expect(bambooStatusTable.$el.querySelectorAll('thead>tr>th').length).to.equal(3)
      expect(bambooStatusTable.$el.querySelectorAll('tbody>tr:nth-child(2)>td').length).to.equal(3)
      done()
    })
  })

  it('inverse filters correctly', (done) => {
    bambooStatusTable.$data.filter = '!Express'
    bambooStatusTable.$nextTick(() => {
      expect(bambooStatusTable.$el.querySelectorAll('tr').length).to.equal(2)
      expect(bambooStatusTable.$el.querySelectorAll('thead>tr>th').length).to.equal(3)
      expect(bambooStatusTable.$el.querySelectorAll('tbody>tr>td').length).to.equal(3)
      done()
    })
  })

  it('complex filters correctly', (done) => {
    bambooStatusTable.$data.filter = 'Express, !Pro'
    bambooStatusTable.$nextTick(() => {
      bambooStatusTable.$nextTick(() => {
        expect(bambooStatusTable.$el.querySelectorAll('tr').length).to.equal(2)
        expect(bambooStatusTable.$el.querySelectorAll('thead>tr>th').length).to.equal(3)
        expect(bambooStatusTable.$el.querySelectorAll('tbody>tr>td').length).to.equal(3)
        done()
      })
    })
  })
})
