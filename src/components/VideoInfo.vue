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
  md-content.video-info(v-if="video && event")
    .title {{video.title}}
    .event
      | in&nbsp;
      router-link.event-link(:to="getLinkToEvent(event)") {{event.name}}
</template>

<style scoped lang="sass">
  @import '../styles/theme'
  .video-info
    margin: 16px
    display: flex
    align-items: center
    flex-direction: column
    text-align: center
    background-color: transparent
  .text
    margin: 4px
  .title
    @extend .text
    font-weight: bold
    font-size: 1.2em
    line-height: 1.2em
  .event
    @extend .text
    color: #666
    font-size: 1em
  .event-link
    color: inherit !important
    font-weight: bold
    text-decoration: none !important
  .event-link:hover
    color: $md-primary !important
</style>
