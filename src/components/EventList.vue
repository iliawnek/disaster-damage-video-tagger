<script>
import {mapState, mapMutations} from 'vuex'
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
  },
}
</script>

<template lang="pug">
  div
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
  .event-list
    margin: 16px
</style>
