<script>
import AgencyCard from '@/components/AgencyCard'
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'agency-list',

  components: {
    AgencyCard,
  },

  props: [
    'agencies',
  ],

  computed: {
    ...mapState({
      areAgenciesLoaded: (state) => state.agency.areAgenciesLoaded,
    }),
    doAgenciesExist () {
      return this.agencies && this.agencies.length > 0
    },
  },

  methods: {
    ...mapMutations({
      openNewAgencyDialog: 'ui/openNewAgencyDialog',
    }),
  },
}
</script>

<template lang="pug">
  .agency-list-container
    md-empty-state(
    v-if="!doAgenciesExist && areAgenciesLoaded"
    md-icon="people"
    md-label="No agencies"
    md-description="There are no agencies in the system yet."
    )
      md-button.md-raised.md-primary(@click="openNewAgencyDialog") Create new agency
    .agency-list(v-if="doAgenciesExist")
      agency-card(
      v-for="agency in agencies"
      :key="agency['.key']"
      :agency="agency"
      )
</template>

<style scoped lang="sass">
  .agency-list-container
    display: flex
    justify-content: center
  .agency-list
    display: flex
    justify-content: center
    flex-wrap: wrap
    margin: 16px
    max-width: 1200px
</style>
