export default {
  namespaced: true,
  state: {
    isNavigationDrawerOpen: false,
    isUserDrawerOpen: false,
    isNewAgencyDialogOpen: false,
    isNewEventDialogOpen: false,
    isNewVideoDialogOpen: false,
  },
  mutations: {
    openNavigationDrawer: (state) => {
      state.isNavigationDrawerOpen = true
    },
    closeNavigationDrawer: (state) => {
      state.isNavigationDrawerOpen = false
    },
    openUserDrawer: (state) => {
      state.isUserDrawerOpen = true
    },
    closeUserDrawer: (state) => {
      state.isUserDrawerOpen = false
    },
    openNewAgencyDialog: (state) => {
      state.isNewAgencyDialogOpen = true
    },
    closeNewAgencyDialog: (state) => {
      state.isNewAgencyDialogOpen = false
    },
    openNewEventDialog: (state) => {
      state.isNewEventDialogOpen = true
    },
    closeNewEventDialog: (state) => {
      state.isNewEventDialogOpen = false
    },
    openNewVideoDialog: (state) => {
      state.isNewVideoDialogOpen = true
    },
    closeNewVideoDialog: (state) => {
      state.isNewVideoDialogOpen = false
    },
  },
}
