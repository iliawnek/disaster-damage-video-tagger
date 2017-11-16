import firebase from 'firebase'
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
    signedIn: state => (state.user !== null && state.data !== null),
    isSiteAdmin: (state, getters) => (getters.signedIn && state.data.type === 'site admin'),
  },
  mutations: {
    updateUser (state, {user}) {
      state.user = {
        ...state.user,
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
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

    async signInWithGoogle ({dispatch}) {
      const provider = new firebase.auth.GoogleAuthProvider()
      const result = await auth.signInWithPopup(provider)
      const token = result.credential.accessToken
      const user = result.user
      dispatch('saveUser', {user, token})
    },

    saveUser (context, {user, token}) {
      // Check if user already exists.
      let userExists
      usersRef.once('value', snapshot => {
        userExists = snapshot.hasChild(user.uid)
      })
      if (!userExists) {
        usersRef.child(user.uid).set({
          type: 'volunteer',
          token,
          createdAt: moment().toISOString(),
        })
      }
    },

    async getUser ({commit, dispatch}) {
      auth.onAuthStateChanged(user => {
        if (user) {
          commit('updateUser', {user})
          dispatch('setDataRef', usersRef.child(user.uid))
        } else commit('clearUser')
      })
    },

    async signOut ({commit}) {
      await auth.signOut()
      commit('clearUser')
      commit('ui/hideRightDrawer', null, {root: true})
    },
  },
}
