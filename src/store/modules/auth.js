import {db, auth} from '^/firebase'
import moment from 'moment'
import {firebaseAction} from 'vuexfire'

const usersRef = db.ref('users')

export default {
  namespaced: true,
  state: {
    user: null,
    data: null,
  },
  getters: {
    signedIn: state => (state.user !== null),
  },
  mutations: {
    updateUser (state, {user, from}) {
      let updates = {}
      if (from === 'auth') {
        const {email, uid} = user
        updates = {email, uid}
      } else if (from === 'db') {
        updates = user
      }
      state.user = {
        ...state.user,
        ...updates,
      }
    },
    clearUser (state) {
      state.user = null
      state.data = null
    },
  },
  actions: {
    setDataRef: firebaseAction(
      ({bindFirebaseRef}, ref) => {
        bindFirebaseRef('data', ref)
      }
    ),

    async register ({dispatch}, {email, password}) {
      try {
        const user = await auth.createUserWithEmailAndPassword(email, password)
        dispatch('saveNewUser', user)
      } catch (error) {
        console.log(error)
      }
    },
    saveNewUser (context, {uid}) {
      usersRef.child(uid).set({
        type: 'volunteer',
        createdAt: moment().toISOString(),
      })
    },
    saveExistingUser (context, {uid}) {
      usersRef.child(uid).update({
        updatedAt: moment().toISOString(),
      })
    },
    async getUser ({commit, dispatch}) {
      auth.onAuthStateChanged(user => {
        if (user) {
          commit('updateUser', {user, from: 'auth'})
          dispatch('setDataRef', usersRef.child(user.uid))
        } else commit('clearUser')
      })
    },
    async signOut ({commit}) {
      await auth.signOut()
      commit('clearUser')
      commit('ui/hideSidenav', null, {root: true})
    },
    signIn (context, {email, password}) {
      auth.signInWithEmailAndPassword(email, password)
    },
  },
}
