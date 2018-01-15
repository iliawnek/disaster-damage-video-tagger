<script>
import {mapState, mapActions} from 'vuex'
import {mapGettersWithParams} from '@/utilities'

export default {
  name: 'Agency',

  created () {
    this.loadAgencies()
    this.loadAgency()
  },

  data () {
    return {
      agency: null,
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
  },
}
</script>

<template lang="pug">
  .agency(v-if="agency")
    h1 agency
    ul
      li name → {{agency.name}}

    h1 admins
    ul
      li(v-for="(val, key) in agency.admins") {{key}}

    h1 events
    ul
      li(v-for="(val, key) in agency.events") {{key}}
</template>

<style scoped lang="sass">
</style>
