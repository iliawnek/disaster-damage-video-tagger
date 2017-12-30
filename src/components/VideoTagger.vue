<script>
import {mapState} from 'vuex'
import Cropper from 'cropperjs'

let createTagButton
let cropper
let canvas
let canvasContainer
let rangeNavigationButtons

export default {
  name: 'video-tagger',

  data () {
    return {
      crop: null,
      stage: 0,
      stages: [
        'play',
        'crop',
        'range-start',
        'range-end',
        'type',
        'sub-type',
        'description',
        'done',
      ],
    }
  },

  computed: {
    ...mapState({
      video: (state) => state.video.video,
      isVideoLoaded: (state) => state.video.isVideoLoaded,
    }),
    playerOptions () {
      return {
        sources: {
          type: 'application/x-mpegURL',
          src: this.video.url,
        },
        muted: true,
        controlBar: {
          volumePanel: false,
        },
        fluid: true,
      }
    },
    currentStageName () {
      return this.getStageName(this.stage)
    },
    lastStageIndex () {
      return this.stages.length - 1
    },
  },

  watch: {
    stage (newStage, oldStage) {
      const newStageName = this.getStageName(newStage)
      const oldStageName = this.getStageName(oldStage)
      const restarted = newStage === 0 && oldStage === this.lastStageIndex
      const clickedNext = restarted || (oldStage < newStage)

      const entered = (stageName) => (newStageName === stageName)
      const left = (stageName) => (oldStageName === stageName)

      if (left('play')) {
        this.hide(createTagButton)
      }
      if (entered('play')) {
        this.show(createTagButton)
      }

      if (clickedNext) { // clicked 'next'
        if (entered('crop')) {
          this.startCrop()
        }
        if (left('crop')) {
          this.saveCrop()
        }
        if (entered('range-start')) {
          this.startRangeSelection()
        }
      } else { // clicked 'back'
        if (left('crop')) {
          this.endCrop()
        }
        if (entered('crop')) {
          this.resumeCrop()
        }
        if (left('range-start')) {
          this.endRangeSelection()
        }
      }
    },
  },

  methods: {
    // stages
    nextStage () {
      this.stage = (this.stage + 1) % this.stages.length
    },
    previousStage () {
      this.stage = this.stage === 0 ? this.stage : (this.stage - 1)
    },
    getStageName (stage) {
      return this.stages[stage]
    },

    // frequently-accessed elements
    videojs () {
      return document.getElementsByClassName('video-js')[0]
    },
    cropBox () {
      return document.getElementsByClassName('cropper-crop-box')[0]
    },
    videoElement () {
      return this.player().children_[0]
    },
    player () {
      return this.$refs.videoPlayer.player
    },

    // element visibility
    show (element) {
      element.classList.remove('hide')
    },
    hide (element) {
      element.classList.add('hide')
    },

    // button generators
    buildButton ({className, label, onClick}) {
      const button = document.createElement('div')
      button.className = `vjs-tagger-button ${className}`
      button.innerText = label
      button.addEventListener('click', onClick)
      return button
    },
    buildNextButton ({className, label}) {
      return this.buildButton({
        className,
        label: label || 'Next',
        onClick: (event) => {
          event.stopPropagation()
          this.nextStage()
        },
      })
    },
    buildBackButton ({className, label}) {
      return this.buildButton({
        className,
        label: label || 'Back',
        onClick: (event) => {
          event.stopPropagation()
          this.previousStage()
        },
      })
    },
    buildNavigationButtons ({className, hideBack, nextLabel}) {
      const navigationButtons = document.createElement('div')
      navigationButtons.className = `vjs-navigation-buttons ${className}`
      if (!hideBack) {
        const backButton = this.buildBackButton({})
        navigationButtons.appendChild(backButton)
      }
      const nextButton = this.buildNextButton({
        label: nextLabel,
      })
      navigationButtons.appendChild(nextButton)
      return navigationButtons
    },

    // initialise player UI
    buildInitialUI () {
      this.buildCanvas()
      this.buildCreateTagButton()
      this.buildRangeSelectionNavigationButtons()
    },

    // playback
    buildCreateTagButton () {
      createTagButton = this.buildNavigationButtons({
        className: 'vjs-center-buttons vjs-create-tag-button',
        nextLabel: 'Create a new tag',
        hideBack: true,
      })
      this.videojs().appendChild(createTagButton)
    },

    // cropping
    buildCanvas () {
      canvasContainer = document.createElement('div')
      canvasContainer.className = 'vjs-canvas-container hide'
      canvas = document.createElement('canvas')
      canvas.className = 'vjs-canvas'
      canvas.width = 0
      canvas.height = 0
      canvasContainer.appendChild(canvas)
      this.videojs().appendChild(canvasContainer)
    },
    buildCropper (crop) {
      this.show(canvasContainer)
      const cropperNavigationButtons = this.buildNavigationButtons({
        className: 'vjs-cropper-navigation-buttons',
      })
      const onReady = () => {
        this.cropBox().appendChild(cropperNavigationButtons)
      }
      cropper = new Cropper(canvas, {
        viewMode: 1,
        dragMode: 'move',
        guides: false,
        center: false,
        background: false,
        rotatable: false,
        scalable: false,
        toggleDragModeOnDblclick: false,
        data: crop, // load existing crop if it exists
        ready: onReady,
      })
    },
    takeScreenshot () {
      const context = canvas.getContext('2d')
      canvas.width = parseInt(this.videoElement().videoWidth)
      canvas.height = parseInt(this.videoElement().videoHeight)
      context.drawImage(this.videoElement(), 0, 0, canvas.width, canvas.height)
    },
    startCrop () {
      this.takeScreenshot()
      this.buildCropper()
    },
    saveCrop () {
      const cropData = cropper.getData(true)
      this.crop = {...cropData}
      this.endCrop()
    },
    endCrop () {
      cropper.destroy()
      this.hide(canvasContainer)
    },
    resumeCrop () {
      this.buildCropper(this.crop)
    },

    // range selection
    buildRangeSelectionNavigationButtons () {
      rangeNavigationButtons = this.buildNavigationButtons({
        className: 'vjs-center-buttons vjs-range-navigation-buttons',
      })
      this.videojs().appendChild(rangeNavigationButtons)
      this.hide(rangeNavigationButtons)
    },
    startRangeSelection () {
      this.show(rangeNavigationButtons)
    },
    endRangeSelection () {
      this.hide(rangeNavigationButtons)
    },
  },
}
</script>

<template lang="pug">
  video-player(
  ref="videoPlayer"
  v-if="isVideoLoaded"
  :options="playerOptions"
  @ready="buildInitialUI"
  )
</template>

<style lang="sass">
  @import '~cropperjs/dist/cropper.css'
  $blue: #2196f3
  $red: #f44336

  // big play button
  .video-js:hover .vjs-big-play-button
      background-color: white // disable default
  .vjs-has-started.vjs-paused .vjs-big-play-button
    display: block
    transform: translate(-50%, calc(-50% - 50px))

  .video-js
    // control bar
    .vjs-control-bar
      height: 50px
      background-color: white
      color: black
    // big play button
    .vjs-big-play-button
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
      width: 80px
      height: 80px
      border-radius: 50%
      border: none
      background-color: white
      color: black
      transition: ease-in-out 0.15s !important
      .vjs-icon-placeholder::before
        font-size: 40px
        line-height: 2em
        padding-left: 3px
    .vjs-big-play-button:hover
      background-color: white
    // control bar buttons
    .vjs-button
      width: 50px
      font-size: 14px
      transition: ease-in-out 0.15s
      .vjs-icon-placeholder::before
         line-height: 2.1em // button icon position
    .vjs-button:hover
      background-color: $red
      color: white
    // progress bar
    .vjs-progress-control
      .vjs-slider
        background-color: transparent
        height: 100%
        .vjs-slider-bar::before
          display: none // hide dot
        .vjs-load-progress
          display: none // hide buffering progress
        .vjs-play-progress
          background-color: $blue
      .vjs-progress-holder
        margin: 0
    // remaining time
    .vjs-remaining-time
      display: none

    // buttons
    .vjs-tagger-button
      background: white
      color: black
      font-family: Roboto, sans-serif
      font-size: 16px
      font-weight: bold
      text-transform: uppercase
      user-select: none
      cursor: pointer
      padding: 16px
      line-height: 1em
      transition: ease-in-out 0.15s
    .vjs-tagger-button:hover
      background-color: $red
      color: white
    // navigation buttons
    .vjs-navigation-buttons
      display: flex
      margin: 8px
      .vjs-tagger-button
        margin: 8px
    // centered buttons
    .vjs-center-buttons
      position: absolute
      top: 50%
      left: 50%
      transform: translate(calc(-50% - 8px), calc(-50% + 40px))

    // create tag button
    .vjs-create-tag-button
      display: none
    // cropper navigation buttons
    .vjs-cropper-navigation-buttons
      position: absolute
      bottom: 0
      left: 50%
      transform: translate(calc(-50% - 8px), calc(100% + 16px))
    // range navigation buttons
    .vjs-range-navigation-buttons
      display: none

    // canvas
    .vjs-canvas-container
      position: absolute
      top: 0
      left: 0
      height: 100%
      width: 100%
      background-color: black
      .vjs-canvas
        max-width: 100% // required for Cropper.js

  // only show when paused
  .vjs-has-started.vjs-paused
    .vjs-create-tag-button, .vjs-range-navigation-buttons
      display: flex

  // hide elements programmatically
  .hide
    display: none !important

  // Cropper.js
  .cropper-container
    position: absolute
</style>
