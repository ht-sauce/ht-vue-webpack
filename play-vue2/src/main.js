import './assets/base.scss'
import App from './App.vue'
import Vue from 'vue'
import router from './router'

new Vue({
  el: '#app',
  router,
  render: (h) => h(App),
}).$mount('#app')
