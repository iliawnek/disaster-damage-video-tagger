import {db} from '^/firebase'
import {firebaseAction} from 'vuexfire'

const agenciesRef = db.ref('agencies')
const usersRef = db.ref('users')

export default {
  namespaced: true,

  state: {
    agencies: [],
  },

  getters: {
    agenciesExist: state => state.agencies.length > 0,
  },

  actions: {
    setAgenciesRef: firebaseAction(
      ({bindFirebaseRef}, ref) => {
        bindFirebaseRef('agencies', ref)
      }
    ),

    loadAgencies ({dispatch}) {
      dispatch('setAgenciesRef', agenciesRef)
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
