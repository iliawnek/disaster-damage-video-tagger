<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'browse-events',

  created () {
    this.loadEvents()
  },

  computed: {
    ...mapState({
      events: (state) => state.event.events,
      areEventsLoaded: (state) => state.event.areEventsLoaded,
    }),
    ...mapGetters({
      doEventsExist: 'event/doEventsExist',
    }),
  },

  methods: {
    ...mapMutations({
      openNewEventDialog: 'ui/openNewEventDialog',
    }),
    ...mapActions({
      loadEvents: 'event/loadEvents',
    }),
    getAgencyById (agencyId) {
      return this.$store.getters['agency/getAgencyById'](agencyId)
    },
    getLinkToEvent (event) {
      return this.$store.getters['event/getLinkToEvent'](event)
    },
    agencyListString (agencies) {
      return Object.keys(agencies)
        .map((agencyId) => this.getAgencyById(agencyId).name)
        .join(', ')
    },
  },
}
</script>

<template lang="pug">
  #browse-events
    md-empty-state(
    v-if="!doEventsExist && areEventsLoaded"
    md-icon="event"
    md-label="No events right now"
    md-description="As soon as an event occurs, it will appear here."
    )
      md-button.md-raised.md-primary(@click="openNewEventDialog") Create new event
    md-list.md-double-line
      md-list-item(
      v-for="event in events"
      :to="getLinkToEvent(event)"
      :key="event['.key']"
      )
        .md-list-item-text
          span {{event.name}}
          span {{agencyListString(event.agencies)}}
</template>

<style scoped lang="sass">

</style>
