import VueRouter from 'vue-router'
import Home from '../components/Home'
import SmokeStatus from '../components/SmokeStatus'
import PXFormsBundler from '../components/PXFormsBundler'

export default class Routes {
  static routeDefinitions = [
    {path: '/', name: 'home', component: Home, meta: {label: 'Bamboo Tools', isDefault: true}},
    {path: '/smokestatus', name: 'smokestatus', component: SmokeStatus, meta: {label: 'Smoke Tests Status'}},
    {path: '/pxformsbundler', name: 'pxformsbundler', component: PXFormsBundler, meta: {label: 'PX Forms Bundler'}}
  ]

  static base = process.env.NODE_ENV === 'production' ? 'bamboo-tools' : ''

  static router = new VueRouter({
    mode: 'history',
    base: Routes.base,
    routes: Routes.routeDefinitions
  })
}
