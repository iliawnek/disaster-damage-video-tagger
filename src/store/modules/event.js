import {db} from '@/firebase'
import {firebaseAction} from 'vuexfire'

const eventsRef = db.ref('events')
const agenciesRef = db.ref('agencies')

export default {
  namespaced: true,

  state: {
    events: [],
    areEventsLoaded: false,
    areEventsLoading: false,
    newEventId: null, // used for snackbar
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

    getEventsByIds: (state, getters) => (eventIds) => {
      const events = eventIds.map((eventId) => getters.getEventById(eventId))
      return events === {} ? null : events
    },

    getLinkToEvent: () => (event) => {
      if (typeof event === 'string') {
        return `/event/${event}`
      } else {
        return `/event/${event['.key']}`
      }
    },

    getImage: (state, getters, rootState, rootGetters) => (event) => {
      if (event && event.videos) {
        const videos = rootGetters['video/getVideosByIds'](Object.keys(event.videos))
        const randomVideo = videos[Math.floor(Math.random() * videos.length)]
        return randomVideo && randomVideo.thumbnail
      }
    },

    countVideosInEvent: () => (event) => {
      return (event && event.videos) ? Object.keys(event.videos).length : 0
    },

    countTagsInEvent: (state, getters, rootState, rootGetters) => (event) => {
      if (event.videos) {
        const videoIds = Object.keys(event.videos)
        const tags = rootGetters['tag/getTagsByVideoIds'](videoIds)
        return tags.length
      }
      return 0
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

    setNewEventId (state, value) {
      state.newEventId = value
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

    saveNewEvent ({commit}, {event}) {
      // save event
      const newEventRef = eventsRef.push()
      const newEventId = newEventRef.key
      commit('setNewEventId', newEventId)
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
