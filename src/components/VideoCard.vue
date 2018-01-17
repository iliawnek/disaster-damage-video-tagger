<script>
import {mapGettersWithParams} from '@/utilities'

export default {
  name: 'video-card',

  props: [
    'video',
  ],

  methods: {
    ...mapGettersWithParams({
      getLinkToVideo: 'video/getLinkToVideo',
    }),
  },
}
</script>

<template lang="pug">
  router-link(:to="getLinkToVideo(video)")
    md-content.video-card.md-elevation-5
      img(:src="video.thumbnail")
      .overlay
      md-icon.md-size-2x play_circle_filled
</template>

<style scoped lang="sass">
  @import '../styles/theme'
  .video-card
    position: relative
    margin: 8px
    width: 200px
    height: 200px
    cursor: pointer
  img
    width: 100%
    height: 100%
    object-fit: cover
    background-color: black
  .overlay
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0)
    transition: 0.2s ease-out
  .md-icon
    position: absolute
    z-index: 1
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    color: white !important

  .video-card:hover
    .overlay
      background-color: rgba(0,0,0,0.5)
</style>
