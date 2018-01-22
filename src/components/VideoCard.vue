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

  computed: {
    tagCount () {
      const count = this.video.tags ? Object.keys(this.video.tags).length : 0
      return `${count} ${count === 1 ? 'tag' : 'tags'} created`
    },
  },
}
</script>

<template lang="pug">
  .container
    router-link(:to="getLinkToVideo(video)")
      .video-card.md-elevation-5
        img(:src="video.thumbnail")
        .overlay
        md-icon.md-size-2x play_circle_filled
    router-link(:to="getLinkToVideo(video)")
      .title {{video.title}}
    .info {{tagCount}}
</template>

<style scoped lang="sass">
  @import '../styles/theme'

  .container
    width: 240px
    margin: 12px

  .video-card
    position: relative
    height: 135px
    cursor: pointer
  img
    width: 100%
    height: 100%
    object-fit: cover
    background-color: black
    border-radius: 4px
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

  .title
    color: #333
    font-weight: bold
    margin-top: 8px
    text-overflow: clip
    overflow: hidden
    white-space: nowrap
    font-size: 0.9em
  .info
    font-size: 0.8em

  .video-card:hover
    .overlay
      background-color: rgba(0,0,0,0.5)
</style>
