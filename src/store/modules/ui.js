export default {
  namespaced: true,
  state: {
    isSidenavShown: false,
    isSignInDialogShown: false,
    isRegisterDialogShown: false,
  },
  mutations: {
    showSidenav: (moduleState) => {
      moduleState.isSidenavShown = true
    },
    hideSidenav: (moduleState) => {
      moduleState.isSidenavShown = false
    },
    showSignInDialog: (moduleState) => {
      moduleState.isSignInDialogShown = true
    },
    hideSignInDialog: (moduleState) => {
      moduleState.isSignInDialogShown = false
    },
    showRegisterDialog: (moduleState) => {
      moduleState.isRegisterDialogShown = true
    },
    hideRegisterDialog: (moduleState) => {
      moduleState.isRegisterDialogShown = false
    },
  },
}
