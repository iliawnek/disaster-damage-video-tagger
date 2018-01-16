<script>
import {mapGettersWithParams} from '@/utilities'

export default {
  name: 'event-header',

  props: [
    'event',
    'agencies',
    'image',
  ],

  methods: {
    ...mapGettersWithParams({
      getLinkToAgency: 'agency/getLinkToAgency',
    }),
  },
}
</script>

<template lang="pug">
  md-content.event-header.md-elevation-10
    // background
    img.image(v-if="image" :src="image")
    .overlay

    // text
    .name {{event.name}}
    .description {{event.description}}
    .agencies
      div Relief managed by:
      span.agency(v-for="(agency, index) in agencies")
        router-link.agency-link(:to="getLinkToAgency(agency)") {{agency.name}}
        span(v-if="index < agencies.length - 1") &nbsp;&nbsp;•&nbsp;&nbsp;
</template>

<style scoped lang="sass">
  .event-header
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    text-align: center
    position: relative
    width: 100%
    padding: 32px 16px

  .background
    position: absolute
    width: 100%
    height: 100%
  .image
    @extend .background
    object-fit: cover
  .overlay
    @extend .background
    background-color: rgba(0,0,0,0.6)

  .text
    color: white !important
  .content
    z-index: 1
    margin: 16px
  .name
    @extend .text, .content
    font-size: 2.5em
    line-height: 1.2em
    text-transform: uppercase
    font-weight: bold
  .description
    @extend .text, .content
    font-size: 1.1em
    max-width: 600px
    line-height: 1.5em
  .agencies
    @extend .text, .content
    font-size: 0.9em
  .agency
    font-weight: bold
  .agency-link
    @extend .text
</style>
