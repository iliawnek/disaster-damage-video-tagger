export default {
  namespaced: true,
  state: {
    isLeftDrawerShown: false,
    isRightDrawerShown: false,
    isSignInDialogShown: false,
    isRegisterDialogShown: false,
  },
  mutations: {
    showLeftDrawer: (state) => {
      state.isLeftDrawerShown = true
    },
    hideLeftDrawer: (state) => {
      state.isLeftDrawerShown = false
    },
    showRightDrawer: (state) => {
      state.isRightDrawerShown = true
    },
    hideRightDrawer: (state) => {
      state.isRightDrawerShown = false
    },
  },
}
