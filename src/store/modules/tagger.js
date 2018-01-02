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
    crop: null,
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
    setCrop: (state, {width, height, x, y, time}) => {
      state.crop = {width, height, x, y, time}
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
