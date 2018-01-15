<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
import {mapBoolean} from '@/utilities'
import Cropper from 'cropperjs'

let createTagButton
let cropper
let canvas
let canvasContainer
let rangeNavigationButtons
let cropTimeMarker
let rangeBar

export default {
  name: 'video-tagger',

  props: [
    'video',
    'isVideoLoaded',
  ],

  computed: {
    ...mapState({
      stage: (state) => state.tag.stage,
      crop: (state) => state.tag.crop,
      range: (state) => state.tag.range,
      lastStageIndex: (state) => state.tag.lastStageIndex,
    }),
    ...mapGetters({
      currentStageName: 'tag/currentStageName',
    }),
    ...mapBoolean({
      namespace: 'ui',
      key: 'isVideoTaggerDialogOpen',
      setTrue: 'openVideoTaggerDialog',
      setFalse: 'closeVideoTaggerDialog',
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
      }
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
          this.startRangeStart()
        }
        if (left('range-start')) {
          this.saveRangeStart()
        }
        if (entered('range-end')) {
          this.startRangeEnd()
        }
        if (left('range-end')) {
          this.saveRangeEnd()
        }
        if (entered('dialog')) {
          this.player().exitFullscreen()
        }
        if (entered('play')) {
          this.resetTagger()
          this.endRange()
        }
      } else { // clicked 'back'
        if (left('crop')) {
          this.cancelCrop()
        }
        if (entered('crop')) {
          this.resumeCrop()
        }
        if (left('range-start')) {
          this.cancelRangeStart()
        }
        if (entered('range-start')) {
          this.resumeRangeStart()
        }
        if (left('range-end')) {
          this.cancelRangeEnd()
        }
        if (entered('range-end')) {
          this.resumeRangeEnd()
        }
      }
    },
  },

  methods: {
    ...mapMutations({
      nextStage: 'tag/nextStage',
      previousStage: 'tag/previousStage',
      setCrop: 'tag/setCrop',
      clearCrop: 'tag/clearCrop',
      setRangeStart: 'tag/setRangeStart',
      setRangeEnd: 'tag/setRangeEnd',
      clearRangeStart: 'tag/clearRangeStart',
      clearRangeEnd: 'tag/clearRangeEnd',
      resetTagger: 'tag/resetTagger',
    }),

    getStageName (stage) {
      return this.$store.getters['tag/getStageName'](stage)
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
    slider () {
      return document.getElementsByClassName('vjs-slider')[0]
    },
    player () {
      return this.$refs.videoPlayer.player
    },

    // slider bar percentages
    currentTimePercentage () {
      return this.player().currentTime() / this.player().duration()
    },
    cropTimePercentage () {
      if (this.crop && this.crop.time) {
        return this.crop.time / this.player().duration()
      } else {
        return 0
      }
    },
    startTimePercentage () {
      if (this.range && this.range.start) {
        return this.range.start / this.player().duration()
      } else {
        return 0
      }
    },
    percentageAsString (percentage) {
      return `${percentage * 100}%`
    },

    // player listeners
    playerTimeUpdated () {
      // update range bar
      if (this.currentStageName === 'range-start') {
        this.updateRangeBarOnNewStart()
      }
      if (this.currentStageName === 'range-end') {
        this.updateRangeBarOnNewEnd()
      }
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
      this.buildRangeNavigationButtons()
      this.buildRangeBar()
      this.buildCropTimeMarker()
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
    captureFullFrame () {
      const context = canvas.getContext('2d')
      canvas.width = parseInt(this.videoElement().videoWidth)
      canvas.height = parseInt(this.videoElement().videoHeight)
      context.drawImage(this.videoElement(), 0, 0, canvas.width, canvas.height)
    },
    captureCroppedImage ({x, y, width, height}) {
      const cropCanvas = document.createElement('canvas') // not rendered
      const context = cropCanvas.getContext('2d')
      cropCanvas.width = width
      cropCanvas.height = height
      context.drawImage(canvas, -x, -y, canvas.width, canvas.height)
      return cropCanvas.toDataURL('image/jpeg')
    },
    captureHighlightedImage ({x, y, width, height}) {
      // copy full frame into new canvas
      const highlightCanvas = document.createElement('canvas') // not rendered
      const context = highlightCanvas.getContext('2d')
      highlightCanvas.width = canvas.width
      highlightCanvas.height = canvas.height
      context.drawImage(canvas, 0, 0, canvas.width, canvas.height)

      // draw dark overlay
      context.globalAlpha = 0.5
      context.fillStyle = 'black'
      context.fillRect(0, 0, x, canvas.height) // left bar
      context.fillRect(x + width, 0, canvas.width - x + width, canvas.height) // right bar
      context.fillRect(x, 0, width, y) // top bar
      context.fillRect(x, y + height, width, canvas.height - y - height) // bottom bar

      // draw lines
      context.strokeStyle = 'white'
      context.lineWidth = 2
      context.strokeRect(x, 0, 0, canvas.height)
      context.strokeRect(x + width, 0, 0, canvas.height)
      context.strokeRect(0, y, canvas.width, 0)
      context.strokeRect(0, y + height, canvas.width, 0)

      return highlightCanvas.toDataURL('image/jpeg')
    },
    startCrop () {
      this.captureFullFrame()
      this.buildCropper()
    },
    saveCrop () {
      const cropData = cropper.getData(true)
      this.setCrop({
        position: cropData,
        time: this.player().currentTime(),
        images: {
          cropped: this.captureCroppedImage(cropData),
          highlighted: this.captureHighlightedImage(cropData),
        },
      })
      this.endCrop()
    },
    cancelCrop () {
      this.endCrop()
      this.clearCrop()
    },
    resumeCrop () {
      this.buildCropper(this.crop.position)
      this.player().currentTime(this.crop.time)
    },
    endCrop () {
      cropper.destroy()
      this.hide(canvasContainer)
    },

    // range selection
    buildRangeNavigationButtons () {
      rangeNavigationButtons = this.buildNavigationButtons({
        className: 'vjs-center-buttons vjs-range-navigation-buttons',
      })
      this.videojs().appendChild(rangeNavigationButtons)
      this.hide(rangeNavigationButtons)
    },
    buildCropTimeMarker () {
      cropTimeMarker = document.createElement('div')
      cropTimeMarker.classList.add('vjs-crop-time-marker')
      this.slider().appendChild(cropTimeMarker)
      this.hide(cropTimeMarker)
    },
    buildRangeBar () {
      rangeBar = document.createElement('div')
      rangeBar.classList.add('vjs-range-bar')
      this.slider().appendChild(rangeBar)
      this.hide(rangeBar)
    },
    updateRangeBarOnNewStart () {
      // don't allow times beyond crop time to be selected
      if (this.player().currentTime() > this.crop.time) {
        this.player().currentTime(this.crop.time)
      }
      rangeBar.style.left = this.percentageAsString(this.currentTimePercentage())
      rangeBar.style.width = this.percentageAsString(this.cropTimePercentage() - this.currentTimePercentage())
    },
    updateRangeBarOnNewEnd () {
      // don't allow times before crop time to be selected
      if (this.player().currentTime() < this.crop.time) {
        this.player().currentTime(this.crop.time)
      }
      rangeBar.style.width = this.percentageAsString(this.currentTimePercentage() - this.startTimePercentage())
    },
    resetRangeBar () {
      rangeBar.style.width = 0
    },

    startRangeStart () {
      this.show(rangeNavigationButtons)
      this.show(cropTimeMarker)
      this.show(rangeBar)
      cropTimeMarker.style.left = this.percentageAsString(this.cropTimePercentage())
    },
    startRangeEnd () {
      this.player().currentTime(this.crop.time)
    },
    saveRangeStart () {
      this.setRangeStart(this.player().currentTime())
    },
    saveRangeEnd () {
      this.setRangeEnd(this.player().currentTime())
    },
    cancelRangeStart () {
      this.endRange()
      this.clearRangeStart()
    },
    cancelRangeEnd () {
      this.clearRangeEnd()
    },
    resumeRangeStart () {
      this.player().currentTime(this.range.start)
    },
    resumeRangeEnd () {
      this.player().currentTime(this.range.end)
    },
    endRange () {
      this.hide(rangeNavigationButtons)
      this.hide(cropTimeMarker)
      this.hide(rangeBar)
      this.resetRangeBar()
    },
  },
}
</script>

<template lang="pug">
  video-player(
  ref="videoPlayer"
  v-if="video"
  :options="playerOptions"
  @ready="buildInitialUI"
  @timeupdate="playerTimeUpdated"
  )
</template>

<style lang="sass">
  @import '~cropperjs/dist/cropper.css'
  $blue: #2196f3
  $light-blue: #B5D9F5
  $red: #f44336

  // big play button
  .video-js:hover .vjs-big-play-button
      background-color: white // disable default
  .vjs-has-started.vjs-paused .vjs-big-play-button
    display: block
    transform: translate(-50%, calc(-50% - 50px))

  .video-js
    width: 100%
    height: 50vh

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
      background-color: $red
      color: white
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
        // buffered bar
        .vjs-load-progress
          div
            background-color: $light-blue
        // played bar
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

    // crop time marker
    .vjs-crop-time-marker
      position: absolute
      top: 25%
      height: 50%
      width: 3px
      transform: translateX(-50%)
      background-color: black
    // range bar
    .vjs-range-bar
      position: absolute
      background-color: $red
      height: 100%

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
