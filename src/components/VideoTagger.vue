<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
import {mapGettersWithParams} from '@/utilities'
import Cropper from 'cropperjs'

let createTagButton
let cropper
let canvas
let canvasContainer
let rangeNavigationButtons
let cropTimeMarker
let rangeBar
let rangeHandle
let infoBar
let infoBarContent
let closeTagButton
let rangeTooltip

export default {
  name: 'video-tagger',

  props: [
    'video',
  ],

  data () {
    return {
      url: this.video && this.video.url, // required since options on vue-video-player is not reactive
      tagId: null, // if not null, tag playback is enabled
    }
  },

  computed: {
    ...mapState({
      stage: (state) => state.tag.stage,
      crop: (state) => state.tag.crop,
      range: (state) => state.tag.range,
      lastStageIndex: (state) => state.tag.lastStageIndex,
      areTagsLoaded: (state) => state.tag.areTagsLoaded,
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
    infoText () {
      if (this.tag) return `Currently playing Tag #${this.tag.number}.`
      const name = this.currentStageName
      if (name === 'play') return 'When you spot something, pause the video to create a new tag.'
      if (name === 'crop') return 'Drag and resize the box to cover what you want to tag.'
      if (name === 'range-start') return 'Navigate the video to when the tag enters the frame.'
      else return 'Navigate the video to when the tag leaves the frame.'
    },
    // tag to be played
    tag () {
      if (this.tagId && this.areTagsLoaded) {
        return this.getTagById(this.tagId)
      }
    },
  },

  destroyed () {
    this.resetTagger()
  },

  watch: {
    video (newVideo) {
      if (newVideo) {
        this.url = newVideo.url // required since options on vue-video-player is not reactive
      }
    },
    $route ($route) {
      const {tag} = $route.query
      if (tag) {
        this.checkTagQuery()
      } else {
        this.tagId = null
      }
    },
    tag (tag) {
      if (tag) {
        this.player().currentTime(this.tag.range.start)
        this.player().play()
        this.show(rangeBar)
        this.setRangeBarToTag(tag)
        this.show(cropTimeMarker)
        this.setCropTimeMarkerToTag(tag)
        this.show(rangeTooltip)
        this.setRangeTooltipToTag(tag)
        this.hide(this.playProgress())
        this.show(closeTagButton)
        window.scroll(0, 0)
      } else {
        this.hide(rangeBar)
        this.resetRangeBar()
        this.hide(cropTimeMarker)
        this.show(this.playProgress())
        this.hide(closeTagButton)
      }
    },
    infoText (infoText) {
      infoBarContent.innerText = infoText
    },
    stage (newStage, oldStage) {
      const newStageName = this.getStageName(newStage)
      const oldStageName = this.getStageName(oldStage)
      const restarted = newStage === 0 && oldStage === this.lastStageIndex
      const clickedNext = restarted || (oldStage < newStage)

      const entered = (stageName) => (newStageName === stageName)
      const left = (stageName) => (oldStageName === stageName)

      if (left('play')) {
        this.hide(createTagButton)
        if (this.tag) this.$router.push(this.$route.path) // stop tag playback
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

    ...mapGettersWithParams({
      getTagIdInVideo: 'video/getTagIdInVideo',
      getTagById: 'tag/getTagById',
      getStageName: 'tag/getStageName',
    }),

    // player event listeners
    playerReady () {
      this.buildInitialUI()
    },
    playerTimeUpdated (player) {
      // update range bar
      if (this.currentStageName === 'range-start') {
        this.updateRangeBarOnNewStart()
      }
      if (this.currentStageName === 'range-end') {
        this.updateRangeBarOnNewEnd()
      }
      // restart tag range
      if (this.tag) {
        const time = player.currentTime()
        const {start, end} = this.tag.range
        if (time < start || end < time) {
          player.currentTime(start)
          player.pause()
        }
      }
    },
    playerLoadedData () {
      this.checkTagQuery()
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
      return this.timeAsPercentage(this.player().currentTime())
    },
    cropTimePercentage () {
      if (this.crop && this.crop.time) {
        return this.timeAsPercentage(this.crop.time)
      } else {
        return 0
      }
    },
    startTimePercentage () {
      if (this.range && this.range.start) {
        return this.timeAsPercentage(this.range.start)
      } else {
        return 0
      }
    },
    timeAsPercentage (time) {
      return time / this.player().duration()
    },
    percentageAsString (percentage) {
      return `${percentage * 100}%`
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

    // info bar
    buildInfoBar () {
      // info bar container
      infoBar = document.createElement('div')
      infoBar.classList.add('vjs-info-bar')
      // info bar content
      infoBarContent = document.createElement('span')
      infoBarContent.innerText = this.infoText
      infoBar.appendChild(infoBarContent)
      // close tag button
      closeTagButton = document.createElement('span')
      closeTagButton.classList.add('vjs-close-tag-button')
      closeTagButton.innerText = 'Stop'
      const context = this
      closeTagButton.addEventListener('click', function () {
        context.$router.push(context.$route.path)
      })
      infoBar.appendChild(closeTagButton)
      this.hide(closeTagButton)
      // add to video player
      this.videojs().appendChild(infoBar)
    },
    // tag playback
    checkTagQuery () {
      const tagNumber = parseInt(this.$route.query.tag, 10)
      const tagId = this.getTagIdInVideo(this.video, tagNumber)
      if (tagId && this.currentStageName === 'play') {
        this.tagId = tagId
      } else {
        this.$router.replace(this.$route.path)
      }
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
    buildPlayProgressMarker () {
      // marker
      const marker = document.createElement('div')
      marker.classList.add('vjs-play-progress-marker')
      // add to player
      this.playProgress().appendChild(marker)
    },

    // initialise player UI
    buildInitialUI () {
      this.buildPlayProgressMarker()
      this.buildFrameByFrameControls()
      this.buildCanvas()
      this.buildCreateTagButton()
      this.buildRangeNavigationButtons()
      this.buildRangeBar()
      this.buildRangeHandle()
      this.buildCropTimeMarker()
      this.buildInfoBar()
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
      this.hide(this.controlBar())
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
      this.show(this.controlBar())
    },
    cancelCrop () {
      this.endCrop()
      this.clearCrop()
      this.show(this.controlBar())
    },
    resumeCrop () {
      this.buildCropper(this.crop.position)
      this.player().currentTime(this.crop.time)
      this.hide(this.controlBar())
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
      // range bar
      rangeBar = document.createElement('div')
      rangeBar.classList.add('vjs-range-bar')
      // range tooltip
      rangeTooltip = document.createElement('div')
      rangeTooltip.classList.add('vjs-range-tooltip')
      rangeBar.appendChild(rangeTooltip)
      // add bar to player
      this.hide(rangeBar)
      this.slider().appendChild(rangeBar)
    },
    buildRangeHandle () {
      // handle
      rangeHandle = document.createElement('div')
      rangeHandle.classList.add('vjs-progress-handle')
      // icon
      rangeHandle.innerText = '↔'
      // add to player
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
      this.hide(this.playProgress())
      const leftPercentage = this.percentageAsString(this.cropTimePercentage())
      rangeBar.style.left = leftPercentage
      cropTimeMarker.style.left = leftPercentage
      rangeTooltip.innerText = 'Select range'
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
      this.show(this.playProgress())
      this.resetRangeBar()
    },

    // range bar when tagging
    setRangeBarToTag (tag) {
      const leftPercentage = this.timeAsPercentage(tag.range.start)
      const widthPercentage = this.timeAsPercentage(tag.range.end) - leftPercentage
      rangeBar.style.left = this.percentageAsString(leftPercentage)
      rangeBar.style.width = this.percentageAsString(widthPercentage)
    },
    setCropTimeMarkerToTag (tag) {
      cropTimeMarker.style.left = this.percentageAsString(this.timeAsPercentage(tag.crop.time))
    },
    setRangeTooltipToTag (tag) {
      rangeTooltip.innerText = `Tag #${tag.number}`
    },
  },
}
</script>

<template lang="pug">
  video-player(
  ref="videoPlayer"
  v-if="video"
  :options="playerOptions"
  @ready="playerReady"
  @loadeddata="playerLoadedData"
  @timeupdate="playerTimeUpdated"
  )
</template>

<style lang="sass">
  @import '~cropperjs/dist/cropper.css'
  @import '../styles/theme'
  $grey: #555
  $shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 5px 8px 0 rgba(0,0,0,.14), 0 1px 14px 0 rgba(0,0,0,.12)
  $font: Roboto, sans-serif

  // big play button
  .video-js:hover .vjs-big-play-button
      background-color: white // disable default
  .vjs-has-started.vjs-paused .vjs-big-play-button
    display: block
    transform: translate(-50%, calc(-50% - 40px))

  .video-js
    width: 100%
    height: 50vh
    font-family: $font

    // control bar
    .vjs-control-bar
      height: 50px
      background-color: $md-dark
      color: white
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
      font-size: 2em !important // range handle arrow font size
    .vjs-progress-holder:hover
      font-size: 2em !important // range handle arrow font size
    .vjs-progress-control
      .vjs-slider
        background-color: #444
        height: 100%
        .vjs-slider-bar::before
          display: none // hide dot
        // load progress
        .vjs-load-progress
          div
            background-color: $grey
        // play progress
        .vjs-play-progress
          background-color: $md-primary
          transition: 0.15s ease-in-out
        .vjs-play-progress.hide
          display: block !important // override default .hide behaviour
          background-color: transparent
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
          font-family: $font
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

    // play progress marker
    .vjs-play-progress-marker
      position: absolute
      right: 0
      height: 100%
      width: 3px
      background-color: white !important
      transform: translateX(50%)
      z-index: 1
    // frame-by-frame control
    .vjs-frame-control
      font-weight: bold

    // info bar
    .vjs-info-bar
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
      padding: 16px
      opacity: 0
    .vjs-info-bar:hover
      opacity: 1
    .vjs-info-bar-hide
      opacity: 0.3
    // close tag button
    .vjs-close-tag-button
      text-transform: uppercase
      cursor: pointer
      color: $md-primary
      margin-left: 24px
      margin-right: 4px
      transition: 0.15s ease-in-out
    .vjs-close-tag-button:hover
      color: white

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


    // range bar
    .vjs-range-bar
      position: absolute
      background-color: $md-primary
      height: 60%
      top: 20%
      box-sizing: border-box !important
      box-shadow: $shadow
      transition: 0.15s ease-in-out
    // range tooltip
    .vjs-range-tooltip
      position: absolute
      white-space: nowrap
      top: -50px
      left: 50%
      transform: translateX(-50%)
      background-color: $md-primary
      color: white
      border-radius: 2px
      box-shadow: $shadow
      font-size: 0.6em
      font-weight: bold
      text-transform: uppercase
      padding: 8px
    // crop time marker
    .vjs-crop-time-marker
      position: absolute
      top: 30%
      height: 40%
      width: 3px
      transform: translateX(-50%)
      background-color: $md-dark
    // range handle
    .vjs-progress-handle
      position: absolute
      right: 0
      width: 28px
      height: 28px
      border-radius: 100%
      top: 50%
      transform: translate(50%, -50%)
      cursor: ew-resize
      background-color: white
      box-shadow: $shadow
      z-index: 2
      color: black
      font-weight: bold

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
    .vjs-info-bar
      opacity: 0
  // video started and paused
  .vjs-has-started.vjs-paused
    .vjs-create-tag-button, .vjs-range-navigation-buttons
      display: flex
    .vjs-info-bar, .vjs-control-bar
      opacity: 1
  // video started and playing
  .vjs-has-started
    .vjs-info-bar, .vjs-control-bar
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
