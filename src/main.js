import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import VueNumberInput from '@chenfengyuan/vue-number-input'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueCookies)
Vue.use(VueNumberInput)

new Vue({
  router,
  vuetify,
  axios,
  render: h => h(App)
}).$mount('#app')
