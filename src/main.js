// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import VueFire from 'vuefire'
import VueMaterial from 'vue-material'
import Vuelidate from 'vuelidate'
import VueVideoPlayer from 'vue-video-player'
/* eslint-disable no-unused-vars */
import videojsContribHls from 'videojs-contrib-hls/dist/videojs-contrib-hls'
import AsyncComputed from 'vue-async-computed'
import VueLazyLoad from 'vue-lazyload'
import VueTouch from 'vue-touch'

Vue.use(VueFire)
Vue.use(VueMaterial)
Vue.use(Vuelidate)
Vue.use(VueVideoPlayer)
Vue.use(AsyncComputed)
Vue.use(VueLazyLoad)
Vue.use(VueTouch)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
})
