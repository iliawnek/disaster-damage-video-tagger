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
    newVideoId: null, // used for snackbar
  },

  getters: {
    doVideosExist: (state) => state.videos.length > 0,

    getVideoById: (state) => (videoId) => {
      return state.videos.find((video) => video['.key'] === videoId)
    },

    getVideosByIds: (state, getters) => (videoIds) => {
      const videos = videoIds.map((videoId) => getters.getVideoById(videoId))
      return videos === {} ? null : videos
    },

    getLinkToVideo: () => (video) => {
      if (typeof video === 'string') {
        return `/video/${video}`
      } else {
        return `/video/${video['.key']}`
      }
    },

    countTagsInVideo: () => (video) => {
      return (video && video.tags) ? Object.keys(video.tags).length : 0
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
    setNewVideoId (state, value) {
      state.newVideoId = value
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

    saveNewVideo ({commit}, {video}) {
      // save video
      const newVideoRef = videosRef.push()
      const newVideoId = newVideoRef.key
      commit('setNewVideoId', newVideoId)
      newVideoRef.set(video)
      // save event
      const eventId = video.event
      eventsRef.child(eventId).child('videos').update({
        [newVideoId]: true,
      })
    },
  },
}
