const stages = [
  'play',
  'crop',
  'range-start',
  'range-end',
  'dialog',
]

export default {
  namespaced: true,
  state: {
    crop: {
      position: {
        x: null,
        y: null,
        width: null,
        height: null,
      },
      time: null,
      images: {
        cropped: null,
        highlighted: null,
      },
    },
    range: {
      start: null,
      end: null,
    },
    stage: 0,
    lastStageIndex: stages.length - 1,
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
    setCrop: (state, {position: {x, y, width, height}, time, images: {cropped, highlighted}}) => {
      state.crop.position.x = x
      state.crop.position.y = y
      state.crop.position.width = width
      state.crop.position.height = height
      state.crop.time = time
      state.crop.images.cropped = cropped
      state.crop.images.highlighted = highlighted
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
  },
}
