// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store'

import 'reset-css'
import './styles/css/material-design-iconic-font.min.css'

import 'font-awesome/css/font-awesome.min.css'

import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
import './styles/element-variables.scss'
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, {
  locale
})

import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

import VueDragDrop from 'vue-drag-drop'
Vue.use(VueDragDrop)

import './styles/main.styl'
import './styles/ui-fixes.styl'

Vue.filter('noInfinityAndFixed',  function(value) {
  if (value === Infinity) return ''
  return value.toFixed(2)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
