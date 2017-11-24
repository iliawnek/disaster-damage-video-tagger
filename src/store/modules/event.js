import {db} from '^/firebase'
import {firebaseAction} from 'vuexfire'

const eventsRef = db.ref('events')
const agenciesRef = db.ref('agencies')

export default {
  namespaced: true,

  state: {
    events: [],
    areEventsLoaded: false,
    areEventsLoading: false,
  },

  getters: {
    doEventsExist: (state) => state.events.length > 0,

    eventIdsByName: (state) => {
      const eventIdsByName = {}
      state.events.forEach((event) => {
        eventIdsByName[event.name] = event['.key']
      })
      return eventIdsByName
    },

    getEventById: (state) => (eventId) => {
      return state.events.find((event) => event['.key'] === eventId)
    },

    getLinkToEvent: () => (event) => {
      return `/event/${event['.key']}`
    },
  },

  mutations: {
    setAreEventsLoaded (state) {
      state.areEventsLoading = false
      state.areEventsLoaded = true
    },

    setAreEventsLoading (state) {
      state.areEventsLoading = true
    },
  },

  actions: {
    setEventsRef: firebaseAction(
      ({bindFirebaseRef}, {ref, commit}) => {
        bindFirebaseRef('events', ref, {
          readyCallback: () => {
            commit('setAreEventsLoaded')
          },
        })
      }
    ),

    loadEvents ({dispatch, commit, state}) {
      if (!state.areEventsLoaded && !state.areEventsLoading) {
        commit('setAreEventsLoading')
        dispatch('setEventsRef', {ref: eventsRef, commit})
      }
    },

    saveNewEvent (context, {event}) {
      // save event
      const newEventRef = eventsRef.push()
      const newEventId = newEventRef.key
      newEventRef.set(event)
      // save agencies
      const eventIds = Object.keys(event.agencies)
      eventIds.forEach((agencyId) => {
        agenciesRef.child(agencyId).child('events').update({
          [newEventId]: true,
        })
      })
    },
  },
}
