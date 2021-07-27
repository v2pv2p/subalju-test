// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import popupManager from './popupManager'
import MIcon from '@/components/materialIcon'

import 'material-icons/iconfont/material-icons.css'

Vue.component('m-icon', MIcon)
Vue.use( popupManager )
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue( {
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
} )
