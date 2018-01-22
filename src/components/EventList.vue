<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import {mapGettersWithParams} from '@/utilities'
import EventCard from '@/components/EventCard'

export default {
  name: 'event-list',

  components: {
    EventCard,
  },

  props: [
    'events',
  ],

  created () {
    this.loadTags() // required for showing tag counts
  },

  computed: {
    ...mapState({
      areEventsLoaded: (state) => state.event.areEventsLoaded,
    }),
    doEventsExist () {
      return this.events && this.events.length > 0
    },
  },

  methods: {
    ...mapGettersWithParams({
      getImage: 'event/getImage',
    }),
    ...mapMutations({
      openNewEventDialog: 'ui/openNewEventDialog',
    }),
    ...mapActions({
      loadTags: 'tag/loadTags',
    }),
  },
}
</script>

<template lang="pug">
  .container
    md-empty-state(
    v-if="!doEventsExist && areEventsLoaded"
    md-icon="event"
    md-label="No events right now"
    md-description="As soon as an event occurs, it will appear here."
    )
      md-button.md-raised.md-primary(@click="openNewEventDialog") Create new event
    .event-list(v-if="doEventsExist")
      event-card(
      v-for="event in events"
      :key="event['.key']"
      :event="event"
      :image="getImage(event)"
      )
</template>

<style scoped lang="sass">
  .container
    display: flex
    justify-content: center
  .event-list
    margin: 16px
    width: 800px
</style>
