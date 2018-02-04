<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
import Cropper from 'cropperjs'

let createTagButton
let cropper
let canvas
let canvasContainer
let rangeNavigationButtons
let cropTimeMarker
let rangeBar
let rangeHandle
let instructionBar

export default {
  name: 'video-tagger',

  props: [
    'video',
  ],

  data () {
    return {
      url: this.video && this.video.url, // required since options on vue-video-player is not reactive
    }
  },

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
    playerOptions () {
      return {
        sources: {
          type: 'application/x-mpegURL',
          src: this.url,
        },
        muted: true,
        controlBar: {
          volumePanel: false,
        },
        playbackRates: [0.25, 0.5, 1.0, 2.0],
      }
    },
    instruction () {
      const name = this.currentStageName
      if (name === 'play') return 'When you spot something, pause the video to create a new tag.'
      if (name === 'crop') return 'Drag and resize the box to cover what you want to tag.'
      if (name === 'range-start') return 'Navigate the video to when the tag enters the frame, then pause the video to continue.'
      else return 'Navigate the video to when the tag leaves the frame, then pause the video to continue.'
    },
  },

  watch: {
    video (newVideo) {
      if (newVideo) {
        this.url = newVideo.url // required since options on vue-video-player is not reactive
      }
    },
    stage (newStage, oldStage) {
      // update instruction text
      instructionBar.innerText = this.instruction

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
    playProgress () {
      return document.getElementsByClassName('vjs-play-progress')[0]
    },
    controlBar () {
      return document.getElementsByClassName('vjs-control-bar')[0]
    },
    playbackRateControl () {
      return document.getElementsByClassName('vjs-playback-rate')[0]
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
      button.classList.add('vjs-tagger-button')
      if (className) button.classList.add(className)
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

    // instruction bar
    buildInstructionBar () {
      instructionBar = document.createElement('div')
      instructionBar.classList.add('vjs-instruction-bar')
      instructionBar.innerText = this.instruction
      this.videojs().appendChild(instructionBar)
    },

    // frame-by-frame controls
    buildFrameByFrameControls () {
      // create buttons
      const backFrame = document.createElement('button')
      const forwardFrame = document.createElement('button')
      backFrame.classList.add('vjs-button', 'vjs-control', 'vjs-frame-control')
      forwardFrame.classList.add('vjs-button', 'vjs-control', 'vjs-frame-control')
      backFrame.innerText = '-1'
      forwardFrame.innerText = '+1'
      // click listeners
      const player = this.player
      backFrame.addEventListener('click', function () {
        player().currentTime(player().currentTime() - 0.05)
      })
      forwardFrame.addEventListener('click', function () {
        player().currentTime(player().currentTime() + 0.05)
      })
      // insert buttons into control bar
      this.controlBar().insertBefore(backFrame, this.playbackRateControl())
      this.controlBar().insertBefore(forwardFrame, this.playbackRateControl())
    },

    // initialise player UI
    buildInitialUI () {
      this.buildFrameByFrameControls()
      this.buildCanvas()
      this.buildCreateTagButton()
      this.buildRangeNavigationButtons()
      this.buildRangeBar()
      this.buildRangeHandle()
      this.buildCropTimeMarker()
      this.buildInstructionBar()
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
        autoCropArea: 0.5,

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
    buildRangeHandle () {
      rangeHandle = document.createElement('div')
      rangeHandle.classList.add('vjs-progress-handle')
      rangeHandle.innerText = '↔'
      this.playProgress().appendChild(rangeHandle)
      this.hide(rangeHandle)
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
      this.show(rangeHandle)
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
      this.hide(rangeHandle)
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
  @import '../styles/theme'
  $light-blue: #B5D9F5
  $shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 5px 8px 0 rgba(0,0,0,.14), 0 1px 14px 0 rgba(0,0,0,.12)

  // big play button
  .video-js:hover .vjs-big-play-button
      background-color: white // disable default
  .vjs-has-started.vjs-paused .vjs-big-play-button
    display: block
    transform: translate(-50%, calc(-50% - 40px))

  .video-js
    width: 100%
    height: 50vh
    font-family: Roboto, sans-serif

    // control bar
    .vjs-control-bar
      height: 50px
      background-color: white
      color: black
      box-shadow: $shadow
    .vjs-control-bar:hover
      opacity: 1
    // big play button
    .vjs-big-play-button
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
      width: 60px
      height: 60px
      border-radius: 50%
      border: none
      background-color: white
      color: black
      transition: ease-in-out 0.15s !important
      box-shadow: $shadow
      .vjs-icon-placeholder::before
        font-size: 30px
        line-height: 2em
        padding-left: 3px
    .vjs-big-play-button:hover
      background-color: $md-accent
      color: white
    // control bar buttons
    .vjs-button
      width: 50px
      font-size: 14px
      transition: ease-in-out 0.15s
      .vjs-icon-placeholder::before
         line-height: 2.1em // button icon position
    .vjs-button:hover
      background-color: $md-accent
      color: white
    // progress bar
    .vjs-progress-holder
      font-size: 1.7em !important // range handle arrow font size
    .vjs-progress-holder:hover
      font-size: 1.7em !important // range handle arrow font size
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
          background-color: $md-primary
      .vjs-progress-holder
        margin: 0
    // remaining time
    .vjs-remaining-time
      display: none
    // playback rate
    .vjs-playback-rate
      .vjs-menu
        .vjs-menu-content
          bottom: 29px
          background-color: $md-dark
          color: white
          width: 50px
          font-family: Roboto, sans-serif
          font-size: 0.8em !important
          font-weight: bold
          .vjs-menu-item
            line-height: 2em
          .vjs-selected
            background-color: white
            color: black
    .vjs-playback-rate-value
      font-size: 1em
      font-weight: bold
      line-height: 50px

    // frame-by-frame control
    .vjs-frame-control
      font-weight: bold

    // instruction bar
    .vjs-instruction-bar
      position: absolute
      top: 16px
      left: 50%
      transform: translateX(-50%)
      background-color: $md-dark
      color: white
      display: flex
      justify-content: center
      align-items: center
      font-weight: bold
      font-size: 14px
      line-height: 1.2em
      transition: ease-in-out 0.15s
      box-shadow: $shadow
      text-align: center
      padding: 16px
      opacity: 0
    .vjs-instruction-bar:hover
      opacity: 1
    .vjs-instruction-bar-hide
      opacity: 0.3

    // buttons
    .vjs-tagger-button
      background: white
      color: black
      font-size: 14px
      font-weight: bold
      text-transform: uppercase
      user-select: none
      cursor: pointer
      padding: 14px 20px
      line-height: 1em
      transition: ease-in-out 0.15s
      border-radius: 2px
      box-shadow: $shadow
    .vjs-tagger-button:hover
      background-color: $md-accent
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
      transform: translate(calc(-50% - 8px), calc(-50% + 30px))

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
      background-color: $md-accent
      height: 100%
    .vjs-progress-handle
      position: absolute
      right: 0
      width: 24px
      height: 24px
      border-radius: 100%
      top: 50%
      transform: translate(50%, -50%)
      cursor: ew-resize
      background-color: white
      box-shadow: $shadow
      z-index: 1

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

  // video started and user inactive
  .vjs-has-started.vjs-user-inactive
    .vjs-instruction-bar
      opacity: 0
  // video started and paused
  .vjs-has-started.vjs-paused
    .vjs-create-tag-button, .vjs-range-navigation-buttons
      display: flex
    .vjs-instruction-bar, .vjs-control-bar
      opacity: 1
  // video started and playing
  .vjs-has-started
    .vjs-instruction-bar, .vjs-control-bar
      opacity: 0.7

  // hide elements programmatically
  .hide
    display: none !important

  // Cropper.js
  .cropper-container
    position: absolute
    .cropper-crop-box
      z-index: 1 !important
</style>
