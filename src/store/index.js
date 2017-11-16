import Vue from 'vue'
import Vuex from 'vuex'
import ui from '@/store/modules/ui'
import auth from '@/store/modules/auth'
import {firebaseMutations} from 'vuexfire'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    ui,
    auth,
  },
  mutations: {
    ...firebaseMutations,
  },
})
