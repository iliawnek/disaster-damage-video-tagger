import {db} from '^/firebase'
import {firebaseAction} from 'vuexfire'

const eventsRef = db.ref('events')
const agenciesRef = db.ref('agencies')

export default {
  namespaced: true,

  state: {
    events: [],
    eventsLoaded: false,
  },

  getters: {
    eventsExist: state => state.events.length > 0,
  },

  mutations: {
    setEventsLoaded (state) {
      state.eventsLoaded = true
    },
  },

  actions: {
    setEventsRef: firebaseAction(
      ({bindFirebaseRef}, {ref, commit}) => {
        bindFirebaseRef('events', ref, {
          readyCallback: () => {
            commit('setEventsLoaded')
          },
        })
      }
    ),

    loadEvents ({dispatch, commit, state}) {
      if (!state.eventsLoaded) {
        dispatch('setEventsRef', {ref: eventsRef, commit})
      }
    },

    saveNewEvent ({event}) {
      // save event
      const newEventRef = eventsRef.push()
      const newEventId = newEventRef.key
      newEventRef.set(event)
      // save agencies
      const agencyIds = Object.keys(event.agencies)
      agencyIds.forEach(agencyId => {
        agenciesRef.child(agencyId).child('events').update({
          [newEventId]: true,
        })
      })
    },
  },
}
