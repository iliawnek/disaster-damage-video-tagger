<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'browse-agencies',

  created () {
    this.loadAgencies()
  },

  computed: {
    ...mapState({
      agencies: (state) => state.agency.agencies,
      areAgenciesLoaded: (state) => state.agency.areAgenciesLoaded,
    }),
    ...mapGetters({
      doAgenciesExist: 'agency/doAgenciesExist',
    }),
  },

  methods: {
    ...mapMutations({
      openNewAgencyDialog: 'ui/openNewAgencyDialog',
    }),
    ...mapActions({
      loadAgencies: 'agency/loadAgencies',
    }),
    getEventById (eventId) {
      return this.$store.getters['event/getEventById'](eventId)
    },
    getLinkToAgency (agency) {
      return this.$store.getters['agency/getLinkToAgency'](agency)
    },
    eventListString (events) {
      return Object.keys(events)
        .map((eventId) => this.getEventById(eventId))
        .filter((event) => event)
        .map((event) => event.name)
        .join(', ')
    },
  },
}
</script>

<template lang="pug">
  #browse-agencies
    md-empty-state(
    v-if="!doAgenciesExist && areAgenciesLoaded"
    md-icon="people"
    md-label="No agencies"
    md-description="There are no agencies in the system yet."
    )
      md-button.md-raised.md-primary(@click="openNewAgencyDialog") Create new agency
    md-list.md-double-line
      md-list-item(
      v-for="agency in agencies"
      :to="getLinkToAgency(agency)"
      :key="agency['.key']"
      )
        .md-list-item-text
          span {{agency.name}}
          span(v-if="agency.events") {{eventListString(agency.events)}}
</template>

<style scoped lang="sass">

</style>
