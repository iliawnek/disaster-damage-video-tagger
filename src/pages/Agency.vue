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
    this.loadAgency()
    this.loadEvents()
  },

  data () {
    return {
      agency: null,
      events: null,
      activeTab: 'members',
    }
  },

  computed: {
    ...mapState({
      areAgenciesLoaded: (state) => state.agency.areAgenciesLoaded,
      areEventsLoaded: (state) => state.event.areEventsLoaded,
    }),
    canAgencysEventsBeLoaded () {
      return this.agency && this.agency.events && this.areEventsLoaded
    },
  },

  watch: {
    // load new agency on route param change
    $route (newVal, oldVal) {
      const {agencyId: oldAgencyId} = oldVal.params
      const {agencyId: newAgencyId} = newVal.params
      if (newAgencyId !== oldAgencyId) this.loadAgency()
    },
    areAgenciesLoaded (newVal, oldVal) {
      if (newVal && !oldVal) this.loadAgency()
    },
    canAgencysEventsBeLoaded (newVal, oldVal) {
      if (newVal && !oldVal) this.loadAgencysEvents()
    },
  },

  methods: {
    ...mapActions({
      loadAgencies: 'agency/loadAgencies',
      loadEvents: 'event/loadEvents',
    }),
    ...mapGettersWithParams({
      getAgencyById: 'agency/getAgencyById',
      getEventsByIds: 'event/getEventsByIds',
    }),
    loadAgency () {
      const {agencyId} = this.$route.params
      this.agency = this.getAgencyById(agencyId)
    },
    loadAgencysEvents () {
      this.events = this.getEventsByIds(Object.keys(this.agency.events))
    },
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
      md-tab(id="members" md-label="Members")
      md-tab(id="events" md-label="Events")
    event-list(v-if="activeTab === 'events'" :events="events")
    add-speed-dial
</template>

<style scoped lang="sass">
  .agency
    margin-bottom: 100px // prevent add-speed-dial from obscuring content
</style>
