export default {
  namespaced: true,
  state: {
    isLeftDrawerOpen: false,
    isRightDrawerOpen: false,
    isNewAgencyDialogOpen: false,
    isNewEventDialogOpen: false,
    isNewVideoDialogOpen: false,
  },
  mutations: {
    openLeftDrawer: (state) => {
      state.isLeftDrawerOpen = true
    },
    closeLeftDrawer: (state) => {
      state.isLeftDrawerOpen = false
    },
    openRightDrawer: (state) => {
      state.isRightDrawerOpen = true
    },
    closeRightDrawer: (state) => {
      state.isRightDrawerOpen = false
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
