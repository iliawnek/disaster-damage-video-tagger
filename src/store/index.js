import Vue from 'vue'
import Vuex from 'vuex'
import ui from '@/store/modules/ui'
import auth from '@/store/modules/auth'
import agency from '@/store/modules/agency'
import event from '@/store/modules/event'
import video from '@/store/modules/video'
import {firebaseMutations} from 'vuexfire'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    ui,
    auth,
    agency,
    event,
    video,
  },
  mutations: {
    ...firebaseMutations,
  },
})
