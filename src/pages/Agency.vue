<script>
import {mapState, mapActions} from 'vuex'
import {mapGettersWithParams} from '@/utilities'
import AgencyHeader from '@/components/AgencyHeader'

export default {
  name: 'Agency',

  components: {
    AgencyHeader,
  },

  created () {
    this.loadAgencies()
    this.loadAgency()
  },

  data () {
    return {
      agency: null,
      activeTab: 'members',
    }
  },

  computed: {
    ...mapState({
      areAgenciesLoaded: (state) => state.agency.areAgenciesLoaded,
    }),
  },

  watch: {
    areAgenciesLoaded (newVal, oldVal) {
      if (newVal && !oldVal) this.loadAgency()
    },
  },

  methods: {
    ...mapActions({
      loadAgencies: 'agency/loadAgencies',
    }),
    ...mapGettersWithParams({
      getAgencyById: 'agency/getAgencyById',
    }),
    loadAgency () {
      const {agencyId} = this.$route.params
      this.agency = this.getAgencyById(agencyId)
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
</template>

<style scoped lang="sass">
</style>
