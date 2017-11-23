import {db} from '^/firebase'
import {firebaseAction} from 'vuexfire'

const agenciesRef = db.ref('agencies')
const usersRef = db.ref('users')

export default {
  namespaced: true,

  state: {
    agencies: [],
    agenciesLoaded: false,
  },

  getters: {
    agenciesExist: state => state.agencies.length > 0,
  },

  mutations: {
    setAgenciesLoaded (state) {
      state.agenciesLoaded = true
    },
  },

  actions: {
    setAgenciesRef: firebaseAction(
      ({bindFirebaseRef}, {ref, commit}) => {
        bindFirebaseRef('agencies', ref, {
          readyCallback: () => {
            commit('setAgenciesLoaded')
          },
        })
      }
    ),

    loadAgencies ({dispatch, commit, state}) {
      if (!state.agenciesLoaded) {
        dispatch('setAgenciesRef', {ref: agenciesRef, commit})
      }
      commit('setAgenciesLoaded')
    },

    saveNewAgency ({rootState}, {agency, admin}) {
      // save agency
      const newAgencyRef = agenciesRef.push()
      const newAgencyId = newAgencyRef.key
      newAgencyRef.set({
        ...agency,
        admins: {
          [admin]: true,
        },
      })
      // save user
      const uid = rootState.auth.user.uid
      usersRef.child(uid).child('adminOf').update({
        [newAgencyId]: true,
      })
    },
  },
}
