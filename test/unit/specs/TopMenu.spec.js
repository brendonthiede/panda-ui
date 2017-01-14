import Vue from 'vue'
import VueRouter from 'vue-router'
import TopMenu from 'src/components/TopMenu'

Vue.use(VueRouter)

function createRouter (routeDefinitions) {
  return new VueRouter({
    mode: 'history',
    base: 'testing',
    routes: routeDefinitions
  })
}

function getRenderedTopMenu (router) {
  return new Vue({
    el: '#app',
    router: router,
    render: h => h(TopMenu),
    propsData: {
      routeDefinitions: router.options.routes
    }
  })
}

describe('TopMenu', () => {
  it('renders correctly', () => {
    const Home = { template: '<div>home</div>' }
    const Foo = { template: '<div>foo</div>' }
    var router = createRouter([
      {path: '/', name: 'home', component: Home, meta: {label: 'Home Link', isDefault: true}},
      {path: '/foo', name: 'foo', component: Foo, meta: {label: 'Foo Link'}}
    ])
    var topMenu = getRenderedTopMenu(router)
    var menuItems = topMenu.$el.querySelectorAll('li')

    expect(menuItems.length).to.equal(2)

    expect(menuItems[0].querySelector('img').hasAttribute('src')).to.equal(true)
    expect(menuItems[0].querySelector('img').getAttribute('class')).to.equal('icon')
    expect(menuItems[0].querySelector('a').getAttribute('href')).to.equal('/testing/')
    expect(menuItems[0].querySelector('a').textContent.trim()).to.equal('Home Link')

    expect(menuItems[1].querySelectorAll('img').length).to.equal(0)
    expect(menuItems[1].querySelector('a').getAttribute('href')).to.equal('/testing/foo')
    expect(menuItems[1].querySelector('a').textContent.trim()).to.equal('Foo Link')
  })
})
