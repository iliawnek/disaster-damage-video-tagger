import {db, storage} from '@/firebase'
import {firebaseAction} from 'vuexfire'
import {fromPairs} from 'lodash'

const tagsRef = db.ref('tags')
const videosRef = db.ref('videos')

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
    // tagger
    crop: null,
    range: {
      start: null,
      end: null,
    },
    stage: 0,
    lastStageIndex: stages.length - 1,
    uploading: false,

    // tags
    tags: [],
    areTagsLoaded: false,
    areTagsLoading: false,
  },
  getters: {
    doTagsExist: (state) => state.tags.length > 0,
    getStageName: () => (stage) => {
      return stages[stage]
    },
    currentStageName: (state, getters) => {
      return getters.getStageName(state.stage)
    },
    getTagById: (state) => (tagId) => {
      return state.tags.find((tag) => tag['.key'] === tagId)
    },
    getTagsByVideoIds: (state, getters) => (videoIds) => {
      const unjoined = videoIds.map((videoId) => getters.getTagsByVideoId(videoId))
      const [first, ...rest] = unjoined
      return first.concat(...rest)
    },
    getTagsByVideoId: (state) => (videoId) => {
      return state.tags.filter((tag) => tag.video === videoId)
    },
  },
  mutations: {
    // tagger
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
    resetTagger: (state) => {
      state.crop = null
      state.range.start = null
      state.range.end = null
      state.stage = 0
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

    // tags
    setAreTagsLoaded (state) {
      state.areTagsLoading = false
      state.areTagsLoaded = true
    },
    setAreTagsLoading (state) {
      state.areTagsLoading = true
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

    async saveNewTag ({state, commit, dispatch, rootGetters}, {details, videoId}) {
      // get new tag ID
      const newTagRef = tagsRef.push()
      const newTagId = newTagRef.key

      // upload images
      commit('setUploading', true)
      const imageURLs = fromPairs(await dispatch('uploadImages', newTagId))
      commit('setUploading', false)

      // get tag number
      const number = rootGetters['video/countTagsInVideo'](videoId) + 1

      newTagRef.set({
        number,
        video: videoId,
        crop: {
          position: state.crop.position,
          time: state.crop.time,
          images: imageURLs,
        },
        range: state.range,
        details,
      })

      // add new tag to video's tags index
      const videoTagsIndex = videosRef.child(videoId).child('tags')
      videoTagsIndex.child(newTagId).set(number)
    },

    setTagsRef: firebaseAction(
      ({bindFirebaseRef}, {ref, commit}) => {
        bindFirebaseRef('tags', ref, {
          readyCallback: () => {
            commit('setAreTagsLoaded')
          },
        })
      }
    ),

    loadTags ({state, dispatch, commit}) {
      if (!state.areTagsLoaded && !state.areTagsLoading) {
        commit('setAreTagsLoading')
        dispatch('setTagsRef', {ref: tagsRef, commit})
      }
    },
  },
}
