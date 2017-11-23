import {db} from '^/firebase'
import {firebaseAction} from 'vuexfire'

const eventsRef = db.ref('events')
const agenciesRef = db.ref('agencies')

export default {
  namespaced: true,

  state: {
    events: [],
  },

  getters: {
    eventsExist: state => state.events.length > 0,
  },

  actions: {
    setEventsRef: firebaseAction(
      ({bindFirebaseRef}, ref) => {
        bindFirebaseRef('events', ref)
      }
    ),

    loadEvents ({dispatch}) {
      dispatch('setEventsRef', eventsRef)
    },

    saveNewEvent ({rootState}, {event}) {
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
