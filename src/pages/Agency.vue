<script>
import {mapState, mapActions} from 'vuex'
import {mapGettersWithParams} from '@/utilities'
import AgencyHeader from '@/components/AgencyHeader'
import EventList from '@/components/EventList'
import AddSpeedDial from '@/components/AddSpeedDial'

export default {
  name: 'Agency',

  components: {
    AgencyHeader,
    EventList,
    AddSpeedDial,
  },

  created () {
    this.loadAgencies()
    this.loadEvents()
    this.loadVideos() // for event card backgrounds
  },

  data () {
    return {
      activeTab: 'events',
    }
  },

  computed: {
    ...mapState({
      areAgenciesLoaded: (state) => state.agency.areAgenciesLoaded,
      areEventsLoaded: (state) => state.event.areEventsLoaded,
    }),
    agency () {
      if (this.areAgenciesLoaded && this.$route.params.agencyId) {
        return this.getAgencyById(this.$route.params.agencyId)
      }
    },
    events () {
      if (this.areEventsLoaded && this.agency && this.agency.events) {
        return this.getEventsByIds(Object.keys(this.agency.events))
      }
    },
  },

  methods: {
    ...mapActions({
      loadAgencies: 'agency/loadAgencies',
      loadEvents: 'event/loadEvents',
      loadVideos: 'video/loadVideos',
    }),
    ...mapGettersWithParams({
      getAgencyById: 'agency/getAgencyById',
      getEventsByIds: 'event/getEventsByIds',
    }),
    handleTabChange (tab) {
      this.activeTab = tab
    },
  },
}
</script>

<template lang="pug">
  .agency(v-if="agency")
    agency-header(:agency="agency")
    md-tabs.md-primary(md-alignment="centered" @md-changed="handleTabChange")
      md-tab(id="events" md-label="Events")
      md-tab(id="members" md-label="Members")
    event-list(v-if="activeTab === 'events'" :events="events")
    add-speed-dial
</template>

<style scoped lang="sass">
  .agency
    margin-bottom: 100px // prevent add-speed-dial from obscuring content
</style>
