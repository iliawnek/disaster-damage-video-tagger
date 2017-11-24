import {db} from '^/firebase'
import {firebaseAction} from 'vuexfire'

const videosRef = db.ref('videos')
const eventsRef = db.ref('events')

export default {
  namespaced: true,

  state: {
    videos: [],
    videosLoaded: false,
    videosLoading: false,
  },

  getters: {
    videosExist: state => state.videos.length > 0,
  },

  mutations: {
    setVideosLoaded (state) {
      state.videosLoading = false
      state.videosLoaded = true
    },
    setVideosLoading (state) {
      state.videosLoading = true
    },
  },

  actions: {
    setVideosRef: firebaseAction(
      ({bindFirebaseRef}, {ref, commit}) => {
        bindFirebaseRef('videos', ref, {
          readyCallback: () => {
            commit('setVideosLoaded')
          },
        })
      }
    ),

    loadVideos ({dispatch, commit, state}) {
      if (!state.videosLoaded && !state.videosLoading) {
        commit('setVideosLoading')
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
