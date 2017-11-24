import {db} from '^/firebase'
import {firebaseAction} from 'vuexfire'

const eventsRef = db.ref('events')
const agenciesRef = db.ref('agencies')

export default {
  namespaced: true,

  state: {
    events: [],
    eventsLoaded: false,
    eventsLoading: false,
  },

  getters: {
    eventsExist: state => state.events.length > 0,
    eventIdsByName: state => {
      const eventIdsByName = {}
      state.events.forEach(event => {
        eventIdsByName[event.name] = event['.key']
      })
      return eventIdsByName
    },
  },

  mutations: {
    setEventsLoaded (state) {
      state.eventsLoading = false
      state.eventsLoaded = true
    },
    setEventsLoading (state) {
      state.eventsLoading = true
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
      if (!state.eventsLoaded && !state.eventsLoading) {
        commit('setEventsLoading')
        dispatch('setEventsRef', {ref: eventsRef, commit})
      }
    },

    saveNewEvent (context, {event}) {
      // save event
      const newEventRef = eventsRef.push()
      const newEventId = newEventRef.key
      newEventRef.set(event)
      // save agencies
      event.agencies.forEach(agencyId => {
        agenciesRef.child(agencyId).child('events').update({
          [newEventId]: true,
        })
      })
    },
  },
}
