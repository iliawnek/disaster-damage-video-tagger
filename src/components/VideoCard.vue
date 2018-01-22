<script>
import {mapGettersWithParams} from '@/utilities'
import Label from '@/components/Label'

export default {
  name: 'video-card',

  components: {
    'kl-label': Label,
  },

  props: [
    'video',
    'event',
  ],

  methods: {
    ...mapGettersWithParams({
      getLinkToVideo: 'video/getLinkToVideo',
      getLinkToEvent: 'event/getLinkToEvent',
      countTagsInVideo: 'video/countTagsInVideo',
    }),
  },

  computed: {
    tagCount () {
      const count = this.countTagsInVideo(this.video)
      return `${count} ${count === 1 ? 'tag' : 'tags'}`
    },
  },
}
</script>

<template lang="pug">
  .video-card-container
    router-link(:to="getLinkToVideo(video)")
      .video-card.md-elevation-5
        img(:src="video.thumbnail")
        .overlay
        .black-filler.md-elevation-5
        md-icon.md-size-2x play_circle_filled
        kl-label.label(:text="tagCount")
    router-link.title(:to="getLinkToVideo(video)") {{video.title}}
    .event(v-if="event") in&nbsp;
      router-link.event-link(:to="getLinkToEvent(event)") {{event.name}}
</template>

<style scoped lang="sass">
  @import '../styles/theme'

  .video-card-container
    width: 240px
    margin: 12px 12px 24px
    display: flex
    flex-direction: column

  .video-card
    position: relative
    height: 135px
    cursor: pointer
    border-radius: 4px
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
  .label
    position: absolute
    top: 8px
    left: 8px
  .black-filler
    position: absolute
    z-index: 1
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    border-radius: 50%
    background-color: rgba(0,0,0,0.5)
    width: 39px
    height: 39px
  .md-icon
    position: absolute
    z-index: 2
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    color: white !important

  .title
    color: #222 !important
    font-weight: bold
    margin-top: 1em
    overflow: hidden
    line-height: 1.3em
    height: 2.6em
  .event
    margin-top: 0.5em
    font-size: 0.8em
    color: #666
  .event-link
    font-weight: bold
    color: #666 !important

  .video-card:hover
    .overlay
      background-color: rgba(0,0,0,0.5)
</style>
