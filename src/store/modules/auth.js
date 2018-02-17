import firebase from 'firebase'
import {db, auth} from '@/firebase'
import moment from 'moment'
import {firebaseAction} from 'vuexfire'
import router from '@/router'

const usersRef = db.ref('users')

export default {
  namespaced: true,

  state: {
    user: null,
    data: null,
    isUserLoading: false,
    isUserLoaded: false,
  },

  getters: {
    isSignedIn: (state) => (state.user !== null && state.data !== null),

    isSiteAdmin: (state, getters) => (getters.isSignedIn && state.data.type === 'site admin'),

    currentUid: (state) => state.user && state.user.uid,
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

    setIsUserLoaded (state) {
      state.isUserLoading = false
      state.isUserLoaded = true
    },

    setIsUserLoading (state) {
      state.isUserLoading = true
    },
  },

  actions: {
    setDataRef: firebaseAction(
      ({bindFirebaseRef}, {ref, commit}) => {
        bindFirebaseRef('data', ref, {
          readyCallback: () => {
            commit('setIsUserLoaded')
          },
        })
      }
    ),

    async signInWithGoogle ({dispatch}) {
      const provider = new firebase.auth.GoogleAuthProvider()
      const result = await auth.signInWithPopup(provider)
      const token = result.credential.accessToken
      const user = result.user
      dispatch('saveUser', {user, token})
      router.push({name: 'browse'})
    },

    saveUser (context, {user, token}) {
      // Check if user already exists.
      let userExists
      usersRef.once('value', (snapshot) => {
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

    getUser ({commit, dispatch}) {
      commit('setIsUserLoading')
      auth.onAuthStateChanged((user) => {
        if (user) {
          commit('updateUser', {user})
          dispatch('setDataRef', {
            ref: usersRef.child(user.uid),
            commit,
          })
        } else {
          commit('clearUser')
          commit('setIsUserLoaded')
        }
      })
    },

    async signOut ({commit}) {
      await auth.signOut()
      commit('clearUser')
      router.push({name: 'home'})
    },
  },
}
