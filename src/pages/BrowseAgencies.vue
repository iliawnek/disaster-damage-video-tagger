<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'browse-agencies',

  created () {
    this.loadAgencies()
  },

  computed: {
    ...mapState({
      agencies: state => state.agency.agencies,
    }),
    ...mapGetters({
      agenciesExist: 'agency/agenciesExist',
    }),
  },

  methods: {
    ...mapMutations({
      openNewAgencyDialog: 'ui/openNewAgencyDialog',
    }),
    ...mapActions({
      loadAgencies: 'agency/loadAgencies',
    }),
  },
}
</script>

<template lang="pug">
  #browse-agencies
    md-empty-state(
    v-if="!agenciesExist"
    md-icon="people"
    md-label="No agencies"
    md-description="There are no agencies in the system yet."
    )
      md-button.md-raised.md-primary(@click="openNewAgencyDialog") Create new agency
    md-list
      md-list-item(
      v-for="agency in agencies"
      :to="'/agency/' + agency['.key']"
      ) {{agency.name}}
</template>

<style scoped lang="sass">

</style>
