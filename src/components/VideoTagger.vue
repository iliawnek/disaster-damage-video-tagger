<script>
import {mapState} from 'vuex'
import Cropper from 'cropperjs'

let cropper
let canvas
let canvasContainer

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

      if (clickedNext) { // clicked 'next'
        if (entered('crop')) {
          this.startCrop()
        }
        if (left('crop')) {
          this.saveCrop()
        }
      } else { // clicked 'back'
        if (left('crop')) {
          this.endCrop()
        }
      }
    },
  },

  methods: {
    nextStage () {
      this.stage = (this.stage + 1) % this.stages.length
    },
    previousStage () {
      this.stage = this.stage === 0 ? this.stage : (this.stage - 1)
    },
    getStageName (stage) {
      return this.stages[stage]
    },

    videojs () {
      return document.getElementsByClassName('video-js')[0]
    },
    cropBox () {
      return document.getElementsByClassName('cropper-crop-box')[0]
    },
    currentTimeTooltip () {
      return document.getElementsByClassName('vjs-play-progress')[0].children[0]
    },
    videoElement () {
      return this.player().children_[0]
    },
    player () {
      return this.$refs.videoPlayer.player
    },

    showCanvas () {
      canvasContainer.style.display = 'block'
    },
    hideCanvas () {
      canvasContainer.style.display = 'none'
    },

    buildButton ({className, label, onClick}) {
      const button = document.createElement('div')
      button.className = `vjs-tagger-button ${className}`
      button.innerText = label
      button.addEventListener('click', onClick)
      return button
    },
    buildNextButton ({className, label, onClick}) {
      return this.buildButton({
        className,
        label: label || 'Next',
        onClick: onClick || (() => {
          this.nextStage()
        }),
      })
    },
    buildBackButton ({className, label, onClick}) {
      return this.buildButton({
        className,
        label: label || 'Back',
        onClick: onClick || (() => {
          this.previousStage()
        }),
      })
    },
    buildCropperButtons () {
      const backButton = this.buildBackButton({})
      const nextButton = this.buildNextButton({})
      const cropperButtons = document.createElement('div')
      cropperButtons.className = 'vjs-cropper-buttons'
      cropperButtons.appendChild(backButton)
      cropperButtons.appendChild(nextButton)
      return cropperButtons
    },
    buildCanvas () {
      canvasContainer = document.createElement('div')
      canvasContainer.id = 'vjs-canvas-container'
      canvas = document.createElement('canvas')
      canvas.id = 'vjs-canvas'
      canvas.width = 0
      canvas.height = 0
      canvasContainer.appendChild(canvas)
    },
    buildCropper (crop) {
      this.showCanvas()
      const cropperButtons = this.buildCropperButtons()
      const onReady = () => {
        this.cropBox().appendChild(cropperButtons)
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
    buildInitialUI () {
      const createTagButton = this.buildNextButton({
        className: 'vjs-create-tag-button',
        label: 'Create a new tag',
      })
      this.buildCanvas()
      this.videojs().appendChild(createTagButton)
      this.videojs().appendChild(canvasContainer)
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
      this.hideCanvas()
    },
    resumeCrop () {
      this.buildCropper(this.crop)
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
  $white: rgba(255,255,255,0.6)
  $white-on-white: rgba(255,255,255,0.5)

  .video-js:hover
    .vjs-big-play-button
      background-color: $white

  .vjs-has-started.vjs-paused .vjs-big-play-button
    display: block
    transform: translate(-50%, calc(-50% - 50px))

  .video-js
    .vjs-control-bar
      height: 50px
      background-color: $white
      color: black

    .vjs-control-bar:hover
      .vjs-button
        background-color: white

    .vjs-big-play-button
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
      width: 80px
      height: 80px
      border-radius: 50%
      border: none
      background-color: $white
      color: black
      transition: ease-in-out 0.15s !important
      .vjs-icon-placeholder::before
        font-size: 40px
        line-height: 2em
        padding-left: 3px
    .vjs-big-play-button:hover
      background-color: white

    // play, fullscreen buttons
    .vjs-button
      width: 50px
      font-size: 14px
      transition: ease-in-out 0.15s
      // button icon position
      .vjs-icon-placeholder::before
         line-height: 2.1em

    .vjs-play-control
      background-color: $white-on-white

    .vjs-progress-control
      .vjs-slider
        background-color: transparent
        height: 100%
        .vjs-slider-bar::before
          display: none
        .vjs-load-progress
          display: none
        .vjs-play-progress
          background-color: $white-on-white

      .vjs-progress-holder
        margin: 0

    .vjs-remaining-time
      display: none

    // custom buttons
    .vjs-tagger-button
      background: $white
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
      background-color: white

    .vjs-create-tag-button
      display: none
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, calc(-50% + 40px))

    #vjs-canvas-container
      position: absolute
      display: none
      top: 0
      left: 0
      height: 100%
      width: 100%
      background-color: black

      #vjs-canvas
        max-width: 100% // required for Cropper.js

    .vjs-cropper-buttons
      position: absolute
      display: flex
      bottom: 0
      left: 50%
      margin: 8px
      transform: translate(calc(-50% - 8px), calc(100% + 16px))
      .vjs-tagger-button
        margin: 8px

  .vjs-paused.vjs-has-started .vjs-create-tag-button
      display: block

  .cropper-container
    position: absolute
</style>
