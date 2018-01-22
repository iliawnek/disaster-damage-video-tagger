<script>
import {mapGettersWithParams} from '@/utilities'

export default {
  name: 'event-card',

  props: [
    'event',
    'image',
  ],

  computed: {
    videoCount () {
      const count = this.countVideosInEvent(this.event)
      return `${count} ${count === 1 ? 'video' : 'videos'}`
    },
    tagCount () {
      const count = this.countTagsInEvent(this.event)
      return `${count} ${count === 1 ? 'tag' : 'tags'}`
    },
  },

  methods: {
    ...mapGettersWithParams({
      getLinkToEvent: 'event/getLinkToEvent',
      countVideosInEvent: 'event/countVideosInEvent',
      countTagsInEvent: 'event/countTagsInEvent',
    }),
  },
}
</script>

<template lang="pug">
  router-link.link(:to="getLinkToEvent(event)")
    .event-card.md-elevation-5
      img.image(v-if="image" :src="image")
      .overlay(:class="{'overlay-no-image': !image}")
      .name(:class="{'text-no-image': !image}") {{event.name}}
      .statistics(:class="{'text-no-image': !image}")
        | {{videoCount}}
        | &nbsp;•&nbsp;
        | {{tagCount}}
</template>

<style scoped lang="sass">
  .link
    text-decoration: none !important
  .event-card
    margin-top: 12px
    margin-bottom: 24px
    padding: 48px
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    text-align: center
    position: relative
    overflow: hidden
    border-radius: 4px

  .background
    position: absolute
    width: 100%
    height: 100%
  .image
    @extend .background
    object-fit: cover
  .overlay
    @extend .background
    background-color: rgba(0,0,0,0.4)
    transition: 0.2s ease-out
  .overlay-no-image
    background-color: transparent

  .text
    z-index: 1
    color: white
    transition: 0.2s ease-out
  .text-no-image
    color: black
  .name
    @extend .text
    font-size: 1.5em
    line-height: 1.2em
    text-transform: uppercase
    font-weight: bold
  .statistics
    @extend .text
    margin-top: 0.5em

  .event-card:hover
    .overlay
      background-color: rgba(0,0,0,0.6)
    .overlay-no-image
      background-color: rgba(0,0,0,0.15)
</style>
