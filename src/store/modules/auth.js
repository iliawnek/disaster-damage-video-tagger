import {auth} from '^/firebase'

export default {
  namespaced: true,
  state: {
    user: null,
    userLoading: false,
  },
  getters: {
    signedIn: state => (!state.userLoading && state.user !== null),
  },
  mutations: {
    setUser (moduleState, {email}) {
      moduleState.user = {
        ...moduleState.user,
        email,
      }
    },
    clearUser (moduleState) {
      moduleState.user = null
    },
    userLoading (moduleState) {
      moduleState.userLoading = true
    },
    userLoaded (moduleState) {
      moduleState.userLoading = false
    },
  },
  actions: {
    async register ({commit}, {email, password}) {
      try {
        const user = await auth.createUserWithEmailAndPassword(email, password)
        commit('setUser', user)
      } catch (error) {
        console.log(error)
      }
    },
    async getUser ({commit}) {
      commit('userLoading')
      auth.onAuthStateChanged(user => {
        if (user) commit('setUser', user)
        else commit('clearUser')
        commit('userLoaded')
      })
    },
    async signOut ({commit}) {
      await auth.signOut()
      commit('clearUser')
      commit('ui/hideSidenav', null, {root: true})
    },
    async signIn ({commit}, {email, password}) {
      const user = await auth.signInWithEmailAndPassword(email, password)
      commit('setUser', user)
    },
  },
}
