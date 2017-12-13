<script>
import {mapState} from 'vuex'
import {videojs} from 'vue-video-player'
import Cropper from 'cropperjs'

export default {
  name: 'video-tagger',

  data () {
    return {
      area: {
        x: null,
        y: null,
        width: null,
        height: null,
      },
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
    buildButton (Component, {componentName, className, label, onClick}) {
      const Button = videojs.extend(Component, {
        constructor (player, options) {
          Component.apply(this, arguments)
          if (options.label) {
            this.setLabel(options.label)
          }
          this.on('click', onClick)
        },
        createEl () {
          return videojs.createEl('div', {className})
        },
        setLabel (text) {
          videojs.emptyEl(this.el())
          videojs.appendContent(this.el(), text)
        },
      })
      videojs.registerComponent(componentName, Button)
      this.player.addChild(componentName, {label})
    },

    buildCreateTagButton (Component, context) {
      this.buildButton(Component, {
        componentName: 'CreateTagButton',
        className: 'vjs-create-tag-button',
        label: 'Create tag',
        onClick () {
          context.takeScreenshot(context)
        },
      })
    },

    buildCanvas (Component) {
      const Canvas = videojs.extend(Component, {
        constructor (player, options) {
          Component.apply(this, arguments)
        },
        createEl () {
          const container = document.createElement('div')
          container.id = 'vjs-canvas-container'
          const canvas = document.createElement('canvas')
          canvas.id = 'vjs-canvas'
          canvas.width = 0
          canvas.height = 0
          container.appendChild(canvas)
          return container
        },
      })
      videojs.registerComponent('Canvas', Canvas)
      this.player.addChild('Canvas')
    },

    buildPlayerUI () {
      const Component = videojs.getComponent('Component')
      this.buildCreateTagButton(Component, this)
      this.buildCanvas(Component)
    },

    takeScreenshot (context) {
      const player = this.player
      const video = player.children_[0]
      const canvas = document.getElementById('vjs-canvas')
      const ctx = canvas.getContext('2d')
      const container = document.getElementById('vjs-canvas-container')
      container.style.display = 'block'

      canvas.width = parseInt(video.videoWidth)
      canvas.height = parseInt(video.videoHeight)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const image = document.createElement('img')
      image.src = canvas.toDataURL()

      /* eslint-disable no-new */
      new Cropper(canvas, {
        viewMode: 1,
        dragMode: 'move',
        guides: false,
        center: false,
        background: false,
        rotatable: false,
        scalable: false,
        toggleDragModeOnDblclick: false,
        // events
        crop (e) {
          context.area.x = Math.round(e.detail.x)
          context.area.y = Math.round(e.detail.y)
          context.area.width = Math.round(e.detail.width)
          context.area.height = Math.round(e.detail.height)
        },
      })
      // console.log(canvas.toDataURL('image/jpeg'))
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

  .video-js
    .vjs-create-tag-button
      background: rgba(255,255,255,0.8)
      color: black

      font-family: Roboto, sans-serif
      font-size: 16px
      font-weight: bold
      text-transform: uppercase
      user-select: none
      cursor: pointer

      display: none
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      padding: 20px

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

  .vjs-paused.vjs-has-started .vjs-create-tag-button
      display: block

  .cropper-container
    position: absolute
</style>
