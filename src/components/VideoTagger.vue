<script>
import {mapState} from 'vuex'
import Cropper from 'cropperjs'

let cropper

export default {
  name: 'video-tagger',

  data () {
    return {
      crop: null,
    }
  },

  computed: {
    ...mapState({
      video: (state) => state.video.video,
      isVideoLoaded: (state) => state.video.isVideoLoaded,
    }),

    player () {
      return this.$refs.videoPlayer.player
    },

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
  },

  methods: {
    videojs () {
      return document.getElementsByClassName('video-js')[0]
    },
    cropBox () {
      return document.getElementsByClassName('cropper-crop-box')[0]
    },
    canvas () {
      return document.getElementById('vjs-canvas')
    },
    canvasContainer () {
      return document.getElementById('vjs-canvas-container')
    },

    buildPlayerUI () {
      // create tag button
      const createTagButton = document.createElement('div')
      createTagButton.className = 'vjs-tagger-button vjs-create-tag-button'
      createTagButton.innerText = 'Create a new tag'
      createTagButton.addEventListener('click', () => {
        this.startCrop()
      })
      this.videojs().appendChild(createTagButton)

      // canvas
      const canvasContainer = document.createElement('div')
      canvasContainer.id = 'vjs-canvas-container'
      const canvas = document.createElement('canvas')
      canvas.id = 'vjs-canvas'
      canvas.width = 0
      canvas.height = 0
      canvasContainer.appendChild(canvas)
      this.videojs().appendChild(canvasContainer)
    },

    startCrop () {
      const video = this.player.children_[0]
      const ctx = this.canvas().getContext('2d')
      this.canvasContainer().style.display = 'block'

      this.canvas().width = parseInt(video.videoWidth)
      this.canvas().height = parseInt(video.videoHeight)
      ctx.drawImage(video, 0, 0, this.canvas().width, this.canvas().height)

      this.buildCropper(this.canvas(), this)
      // console.log(canvas.toDataURL('image/jpeg'))
    },

    cancelCrop () {
      cropper.destroy()
      this.canvasContainer().style.display = 'none'
    },

    saveCrop () {
      const cropData = cropper.getData(true)
      this.crop = {...cropData}
      this.cancelCrop()
    },

    buildCropper (canvas) {
      const onReady = () => {
        this.cropBox().appendChild(cropperButtons)
      }
      /* eslint-disable no-unused-vars */
      const cropperButtons = this.buildCropperButtons()
      cropper = new Cropper(canvas, {
        viewMode: 1,
        dragMode: 'move',
        guides: false,
        center: false,
        background: false,
        rotatable: false,
        scalable: false,
        toggleDragModeOnDblclick: false,
        ready: onReady,
      })
    },

    buildCropperButtons () {
      const doneButton = document.createElement('div')
      doneButton.className = 'vjs-tagger-button'
      doneButton.innerText = 'Done'
      doneButton.addEventListener('click', () => {
        this.saveCrop()
      })

      const backButton = document.createElement('div')
      backButton.className = 'vjs-tagger-button'
      backButton.innerText = 'Back'
      backButton.addEventListener('click', () => {
        this.cancelCrop()
      })

      const cropperButtons = document.createElement('div')
      cropperButtons.className = 'vjs-cropper-buttons'
      cropperButtons.appendChild(backButton)
      cropperButtons.appendChild(doneButton)
      return cropperButtons
    },
  },
}
</script>

<template lang="pug">
  video-player(
  ref="videoPlayer"
  v-if="isVideoLoaded"
  :options="playerOptions"
  @ready="buildPlayerUI"
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
      background-color: white !important
      // button icon position
      .vjs-icon-placeholder::before
         line-height: 2.1em

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
