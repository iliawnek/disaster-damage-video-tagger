<script>
import {mapGettersWithParams} from '@/utilities'

export default {
  name: 'video-info',

  props: [
    'video',
    'event',
  ],

  methods: {
    ...mapGettersWithParams({
      getLinkToEvent: 'event/getLinkToEvent',
    }),
  },
}
</script>

<template lang="pug">
  md-content.video-info.md-elevation-5(v-if="video && event")
    .title {{video.title}}
    .event
      | in&nbsp;
      router-link.event-link(:to="getLinkToEvent(event)") {{event.name}}
</template>

<style scoped lang="sass">
  @import '../styles/theme'
  .video-info
    padding: 32px
    margin-bottom: 16px
    display: flex
    align-items: center
    flex-direction: column
    text-align: center
    background-color: #333
  .text
    margin: 4px
  .title
    @extend .text
    font-weight: bold
    font-size: 1.2em
    color: white
    line-height: 1.2em
    max-width: 600px
  .event
    @extend .text
    color: #aaa
    font-size: 1em
  .event-link
    color: inherit !important
    font-weight: bold
    text-decoration: none !important
  .event-link:hover
    color: $md-primary !important
</style>
