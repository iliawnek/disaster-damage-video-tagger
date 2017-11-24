import {db} from '^/firebase'
import {firebaseAction} from 'vuexfire'

const agenciesRef = db.ref('agencies')
const usersRef = db.ref('users')

export default {
  namespaced: true,

  state: {
    agencies: [],
    agenciesLoaded: false,
    agenciesLoading: false,
  },

  getters: {
    agenciesExist: state => state.agencies.length > 0,

    currentUsersAgencies: (state, getters, rootState, rootGetters) => {
      const currentUid = rootGetters['auth/currentUid']
      return state.agencies.filter(agency => agency.admins[currentUid])
    },

    agencyNames: state => state.agencies.map(agency => agency.name),

    agencyIdsByName: state => {
      const agencyIdsByName = {}
      state.agencies.forEach(agency => {
        agencyIdsByName[agency.name] = agency['.key']
      })
      return agencyIdsByName
    },

    getAgencyById: state => agencyId => {
      return state.agencies.find(agency => agency['.key'] === agencyId)
    },

    getAgencyAdmins: state => agency => {
      return Object.keys(agency.admins)
    },

    getLinkToAgency: () => agency => {
      return `/agency/${agency['.key']}`
    },

    isCurrentUserAnAgencyAdmin: (state, getters, rootState, rootGetters) => agency => {
      const currentUid = rootGetters['auth/currentUid']
      const agencyAdmins = getters.getAgencyAdmins(agency)
      return agencyAdmins.includes(currentUid)
    },
  },

  mutations: {
    setAgenciesLoading (state) {
      state.agenciesLoading = true
    },
    setAgenciesLoaded (state) {
      state.agenciesLoading = false
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
      },
    ),

    loadAgencies ({dispatch, commit, state}) {
      if (!state.agenciesLoaded && !state.agenciesLoading) {
        commit('setAgenciesLoading')
        dispatch('setAgenciesRef', {ref: agenciesRef, commit})
      }
    },

    saveNewAgency ({rootState}, {agency}) {
      // save agency
      const newAgencyRef = agenciesRef.push()
      const newAgencyId = newAgencyRef.key
      const uid = rootState.auth.user.uid
      newAgencyRef.set({
        ...agency,
        admins: {
          [uid]: true,
        },
      })
      // save user
      usersRef.child(uid).child('adminOf').update({
        [newAgencyId]: true,
      })
    },
  },
}
