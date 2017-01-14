import Vue from 'vue'
import AppResults from 'src/components/AppResults'

// helper function that mounts and returns the rendered text
function getRenderedComponent (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({propsData}).$mount()
  return vm.$el
}

describe('AppResults', () => {
  it('renders correctly', () => {
    var appResults = getRenderedComponent(AppResults, {
      columns: ['overall', 'test_env', 'preprod_env', 'prod_env'],
      result: {
        'overall': {code: 'overall-cx', label: 'Compliance Express', state: 'Successful'},
        'test_env': {code: 'test_env-cx', state: 'Successful', link: 'http://blah.com/test/cx'},
        'preprod_env': {code: 'preprod_env-cx', state: 'Successful', link: 'http://blah.com/preprod/cx'}
      }
    })
    expect(appResults.querySelectorAll('td').length).to.equal(4)
    expect(appResults.querySelector('td:nth-child(1)').textContent.trim()).to.equal('Compliance Express')
    expect(appResults.querySelector('td:nth-child(1) img').src)
      .to.equal('http://bamboo.sircon.com/s/en_US/51120/1/_/images/iconsv4/icon-build-successful.png')
    expect(appResults.querySelector('td:nth-child(2)').textContent.trim()).to.equal('')
    expect(appResults.querySelector('td:nth-child(2) img').src)
      .to.equal('http://bamboo.sircon.com/s/en_US/51120/1/_/images/iconsv4/icon-build-successful.png')
    expect(appResults.querySelector('td:nth-child(3)').textContent.trim()).to.equal('')
    expect(appResults.querySelector('td:nth-child(3) img').src)
      .to.equal('http://bamboo.sircon.com/s/en_US/51120/1/_/images/iconsv4/icon-build-successful.png')
    expect(appResults.querySelector('td:nth-child(4)').textContent.trim()).to.equal('')
    expect(appResults.querySelector('td:nth-child(4) img').src)
      .to.equal('http://bamboo.sircon.com/s/en_US/51120/1/_/images/iconsv4/icon-build-unknown.png')
  })
})
