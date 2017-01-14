import Vue from 'vue'
import ResultsHeader from 'src/components/ResultsHeader'

// helper function that mounts and returns the rendered text
function getRenderedComponent (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({propsData}).$mount()
  return vm.$el
}

describe('ResultsHeader', () => {
  it('renders correctly', () => {
    var environmentLabel = getRenderedComponent(ResultsHeader, {
      columns: ['overall', 'test_env', 'preprod_env', 'prod_env'],
      envs: {
        'overall': {label: '', code: 'overall'},
        'test_env': {label: 'Test Env', code: 'test_env', link: 'http://blah.com/test/', state: 'Successful'},
        'preprod_env': {label: 'PreProd Env', code: 'preprod_env', link: 'http://blah.com/test/', state: 'Successful'},
        'prod_env': {label: 'Prod Env', code: 'prod_env', link: 'http://blah.com/test/', state: 'Successful'}
      }
    })
    expect(environmentLabel.querySelectorAll('th').length).to.equal(4)
    expect(environmentLabel.querySelector('th:nth-child(1)').getAttribute('env')).to.equal('overall')
    expect(environmentLabel.querySelector('th:nth-child(2)').getAttribute('env')).to.equal('test_env')
    expect(environmentLabel.querySelector('th:nth-child(3)').getAttribute('env')).to.equal('preprod_env')
    expect(environmentLabel.querySelector('th:nth-child(4)').getAttribute('env')).to.equal('prod_env')
  })
})
