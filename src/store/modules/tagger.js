import {db, storage} from '^/firebase'
import {fromPairs} from 'lodash'

const tagsRef = db.ref('tags')

const stages = [
  'play',
  'crop',
  'range-start',
  'range-end',
  'dialog',
  'done',
]

export default {
  namespaced: true,
  state: {
    crop: null,
    range: {
      start: null,
      end: null,
    },
    stage: 0,
    lastStageIndex: stages.length - 1,
    uploading: false,
  },
  getters: {
    getStageName: () => (stage) => {
      return stages[stage]
    },
    currentStageName: (state, getters) => {
      return getters.getStageName(state.stage)
    },
  },
  mutations: {
    // tag
    setCrop: (state, crop) => {
      state.crop = crop
    },
    clearCrop: (state) => {
      state.crop = null
    },
    setRangeStart: (state, rangeStart) => {
      state.range.start = rangeStart
    },
    setRangeEnd: (state, rangeEnd) => {
      state.range.end = rangeEnd
    },
    clearRangeStart: (state) => {
      state.range.start = null
    },
    clearRangeEnd: (state) => {
      state.range.end = null
    },
    // stages
    nextStage: (state) => {
      state.stage = (state.stage + 1) % stages.length
    },
    previousStage: (state) => {
      state.stage = state.stage === 0 ? state.stage : (state.stage - 1)
    },
    // images
    setUploading: (state, uploading) => {
      state.uploading = uploading
    },
  },
  actions: {
    uploadImages ({state, commit}, newTagId) {
      return Promise.all(
        Object.entries(state.crop.images).map(([imageType, dataURL]) => {
          return new Promise((resolve, reject) => {
            const path = `tags/${imageType}/${newTagId}.jpg`
            const uploadTask = storage.ref(path).putString(dataURL, 'data_url')
            uploadTask.on('state_changed', {
              error: (error) => {
                reject(error)
              },
              complete: () => {
                resolve([imageType, uploadTask.snapshot.downloadURL])
              },
            })
          })
        })
      )
    },

    async saveNewTag ({rootState, state, commit, dispatch}, details) {
      // get new tag ID
      const videoId = rootState.video.video['.key']
      const newTagRef = tagsRef.child(videoId).push()
      const newTagId = newTagRef.key

      // upload images
      commit('setUploading', true)
      const imageURLs = fromPairs(await dispatch('uploadImages', newTagId))
      commit('setUploading', false)

      newTagRef.set({
        crop: {
          position: state.crop.position,
          time: state.crop.time,
          images: imageURLs,
        },
        range: state.range,
        details,
      })
    },
  },
}
