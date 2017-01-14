import Vue from 'vue'
import ResultIcon from 'src/components/ResultIcon'

// helper function that mounts and returns the rendered text
function getRenderedComponent (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({propsData}).$mount()
  return vm.$el
}

describe('ResultIcon', () => {
  it('renders correctly with different props', () => {
    var resultIcon = getRenderedComponent(ResultIcon, {
      link: 'http://blah.com/',
      state: 'Successful'
    })
    expect(resultIcon.href).to.equal('http://blah.com/')
    expect(resultIcon.querySelector('img').src)
      .to.equal('http://bamboo.sircon.com/s/en_US/51120/1/_/images/iconsv4/icon-build-successful.png')

    resultIcon = getRenderedComponent(ResultIcon, {
      link: 'http://blah.com/',
      state: 'Failed'
    })
    expect(resultIcon.href).to.equal('http://blah.com/')
    expect(resultIcon.querySelector('img').src)
      .to.equal('http://bamboo.sircon.com/s/en_US/51120/1/_/images/iconsv4/icon-build-failed.png')

    resultIcon = getRenderedComponent(ResultIcon, {
      state: 'Blah'
    })
    expect(resultIcon.href).to.equal('')
    expect(resultIcon.querySelector('img').src)
      .to.equal('http://bamboo.sircon.com/s/en_US/51120/1/_/images/iconsv4/icon-build-unknown.png')

    resultIcon = getRenderedComponent(ResultIcon, {})
    expect(resultIcon.href).to.equal('')
    expect(resultIcon.querySelector('img').src)
      .to.equal('http://bamboo.sircon.com/s/en_US/51120/1/_/images/iconsv4/icon-build-unknown.png')
  })
})
