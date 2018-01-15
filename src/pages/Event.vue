<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'Event',

  created () {
    this.loadEvents()
  },

  data () {
    return {
      event: null,
    }
  },

  computed: {
    ...mapState({
      areEventsLoaded: (state) => state.event.areEventsLoaded,
    }),
  },

  watch: {
    areEventsLoaded (newVal, oldVal) {
      if (newVal && !oldVal) {
        const {eventId} = this.$route.params
        this.event = this.getEventById(eventId)
      }
    },
    event (newVal) {
      console.log('event', newVal)
    },
  },

  methods: {
    ...mapActions({
      loadEvents: 'event/loadEvents',
    }),
    getEventById (eventId) {
      return this.$store.getters['event/getEventById'](eventId)
    },
  },
}
</script>

<template lang="pug">
  .event(v-if="event !== null")
    | {{event}}
</template>

<style scoped lang="sass">
  .event
    width: 100%
    height: 500px
</style>
