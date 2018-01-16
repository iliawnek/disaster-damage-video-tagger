export default {
  namespaced: true,
  state: {
    isDrawerOpen: false,
    isNewAgencyDialogOpen: false,
    isNewEventDialogOpen: false,
    isNewVideoDialogOpen: false,
  },
  mutations: {
    openDrawer: (state) => {
      state.isDrawerOpen = true
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false
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
