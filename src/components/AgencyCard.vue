<script>
import {mapGettersWithParams} from '@/utilities'

export default {
  name: 'agency-card',

  props: [
    'agency',
  ],

  computed: {
    eventCount () {
      const count = this.agency.events ? Object.keys(this.agency.events).length : 0
      return `${count} ${count === 1 ? 'event' : 'events'}`
    },
  },

  methods: {
    ...mapGettersWithParams({
      getLinkToAgency: 'agency/getLinkToAgency',
    }),
  },
}
</script>

<template lang="pug">
  .agency-card-container
    router-link(:to="getLinkToAgency(agency)")
      .agency-card.md-elevation-5
        img(v-if="agency.logo" :src="agency.logo")
        .overlay
    router-link(:to="getLinkToAgency(agency)")
      .name {{agency.name}}
    .info {{eventCount}}
</template>

<style scoped lang="sass">
  @import '../styles/theme'

  .agency-card-container
    width: 150px
    margin: 12px

  .agency-card
    position: relative
    height: 150px
    cursor: pointer
    border-radius: 4px
  img
    width: 100%
    height: 100%
    object-fit: cover
    background-color: white
    border-radius: 4px
  .overlay
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0)
    transition: 0.2s ease-out

  .name
    color: #333
    font-weight: bold
    margin-top: 8px
    text-overflow: clip
    overflow: hidden
    white-space: nowrap
    font-size: 0.9em
  .info
    font-size: 0.8em

  .agency-card:hover
    .overlay
      background-color: rgba(0,0,0,0.15)
</style>
