import {db} from '^/firebase'
import {firebaseAction} from 'vuexfire'

const videosRef = db.ref('videos')
const eventsRef = db.ref('events')

export default {
  namespaced: true,

  state: {
    videos: [],
    areVideosLoaded: false,
    areVideosLoading: false,
  },

  getters: {
    doVideosExist: (state) => state.videos.length > 0,

    getLinkToVideo: () => (video) => {
      return `/video/${video['.key']}`
    },
  },

  mutations: {
    setAreVideosLoaded (state) {
      state.areVideosLoading = false
      state.areVideosLoaded = true
    },

    setAreVideosLoading (state) {
      state.areVideosLoading = true
    },
  },

  actions: {
    setVideosRef: firebaseAction(
      ({bindFirebaseRef}, {ref, commit}) => {
        bindFirebaseRef('videos', ref, {
          readyCallback: () => {
            commit('setAreVideosLoaded')
          },
        })
      }
    ),

    loadVideos ({dispatch, commit, state}) {
      if (!state.areVideosLoaded && !state.areVideosLoading) {
        commit('setAreVideosLoading')
        dispatch('setVideosRef', {ref: videosRef, commit})
      }
    },

    saveNewVideo (context, {video}) {
      // save video
      const newVideoRef = videosRef.push()
      const newVideoId = newVideoRef.key
      newVideoRef.set(video)
      // save event
      const eventId = video.event
      eventsRef.child(eventId).child('videos').update({
        [newVideoId]: true,
      })
    },
  },
}
