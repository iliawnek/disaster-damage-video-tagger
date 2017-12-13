<script>
import {mapState, mapActions} from 'vuex'
import {mapBoolean} from '@/utilities'

export default {
  name: 'Video',

  created () {
    const {videoId} = this.$route.params
    this.loadVideo({videoId})
  },

  computed: {
    ...mapState({
      video: (state) => state.video.video,
      isVideoLoaded: (state) => state.video.isVideoLoaded,
    }),
    ...mapBoolean({
      namespace: 'ui',
      key: 'isNewTagButtonShown',
      setTrue: 'showNewTagButton',
      setFalse: 'hideNewTagButton',
    }),
    options () {
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
    ...mapActions({
      loadVideo: 'video/loadVideo',
    }),
    log (message) {
      console.log(message)
    },
    screenshot () {
      const player = this.$refs.videoPlayer.player
      const video = player.children_[0]
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = parseInt(video.videoWidth)
      canvas.height = parseInt(video.videoHeight)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      console.log(canvas.toDataURL('image/jpeg'))
    },
  },
}
</script>

<template lang="pug">
  #video
    video-player(
    ref="videoPlayer"
    v-if="isVideoLoaded"
    :options="options"
    @play="isNewTagButtonShown = false"
    @pause="isNewTagButtonShown = true"
    )
    md-button.md-raised(
    v-if="isNewTagButtonShown"
    @click="log('new tag')"
    ) Create tag here
    md-button.md-raised(
    @click="screenshot"
    ) Screenshot
</template>

<style scoped lang="sass">
</style>
