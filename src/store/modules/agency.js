import {db, storage} from '^/firebase'
import {firebaseAction} from 'vuexfire'

const agenciesRef = db.ref('agencies')
const usersRef = db.ref('users')

export default {
  namespaced: true,

  state: {
    agencies: [],
    areAgenciesLoaded: false,
    areAgenciesLoading: false,
    uploading: false,
    newAgencyId: null, // used for snackbar
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
      if (typeof agency === 'string') {
        return `/agency/${agency}`
      } else {
        return `/agency/${agency['.key']}`
      }
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
    setUploading: (state, uploading) => {
      state.uploading = uploading
    },
    setNewAgencyId (state, value) {
      state.newAgencyId = value
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

    uploadLogo (context, {dataURL, newAgencyId}) {
      return new Promise((resolve, reject) => {
        const path = `agency/${newAgencyId}.jpg`
        const uploadTask = storage.ref(path).putString(dataURL, 'data_url')
        uploadTask.on('state_changed', {
          error: (error) => reject(error),
          complete: () => resolve(uploadTask.snapshot.downloadURL),
        })
      })
    },

    async saveNewAgency ({rootState, commit, dispatch}, {agency, logo}) {
      const agencyObject = {...agency}

      // get new agency ID
      const newAgencyRef = agenciesRef.push()
      const newAgencyId = newAgencyRef.key
      commit('setNewAgencyId', newAgencyId)

      // upload logo
      let logoURL
      if (logo) {
        commit('setUploading', true)
        logoURL = await dispatch('uploadLogo', {
          dataURL: logo,
          newAgencyId,
        })
        commit('setUploading', false)
      }

      // save agency
      const uid = rootState.auth.user.uid
      agencyObject.admins = {[uid]: true}
      if (logoURL) agencyObject.logo = logoURL
      newAgencyRef.set(agencyObject)

      // save user
      usersRef.child(uid).child('adminOf').update({
        [newAgencyId]: true,
      })
    },
  },
}
