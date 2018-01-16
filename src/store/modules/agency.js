import {db} from '^/firebase'
import {firebaseAction} from 'vuexfire'

const agenciesRef = db.ref('agencies')
const usersRef = db.ref('users')

export default {
  namespaced: true,

  state: {
    agencies: [],
    areAgenciesLoaded: false,
    areAgenciesLoading: false,
  },

  getters: {
    doAgenciesExist: (state) => state.agencies.length > 0,

    currentUsersAgencies: (state, getters, rootState, rootGetters) => {
      const currentUid = rootGetters['auth/currentUid']
      return state.agencies.filter((agency) => agency.admins[currentUid])
    },

    agencyIdsByName: (state) => {
      const agencyIdsByName = {}
      state.agencies.forEach((agency) => {
        agencyIdsByName[agency.name] = agency['.key']
      })
      return agencyIdsByName
    },

    getAgencyById: (state) => (agencyId) => {
      return state.agencies.find((agency) => agency['.key'] === agencyId)
    },

    getAgenciesByIds: (state, getters) => (agencyIds) => {
      const agencies = agencyIds.map((agencyId) => getters.getAgencyById(agencyId))
      return agencies === {} ? null : agencies
    },

    getAgencyAdmins: () => (agency) => {
      return Object.keys(agency.admins)
    },

    getLinkToAgency: () => (agency) => {
      return `/agency/${agency['.key']}`
    },

    isCurrentUserAnAgencyAdmin: (state, getters, rootState, rootGetters) => (agency) => {
      const currentUid = rootGetters['auth/currentUid']
      const agencyAdmins = getters.getAgencyAdmins(agency)
      return agencyAdmins.includes(currentUid)
    },
  },

  mutations: {
    setAreAgenciesLoading (state) {
      state.areAgenciesLoading = true
    },
    setAreAgenciesLoaded (state) {
      state.areAgenciesLoading = false
      state.areAgenciesLoaded = true
    },
  },

  actions: {
    setAgenciesRef: firebaseAction(
      ({bindFirebaseRef}, {ref, commit}) => {
        bindFirebaseRef('agencies', ref, {
          readyCallback: () => {
            commit('setAreAgenciesLoaded')
          },
        })
      },
    ),

    loadAgencies ({dispatch, commit, state}) {
      if (!state.areAgenciesLoaded && !state.areAgenciesLoading) {
        commit('setAreAgenciesLoading')
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
