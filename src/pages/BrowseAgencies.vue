<script>
import {mapMutations} from 'vuex'

export default {
  name: 'browse-agencies',
  methods: {
    ...mapMutations({
      openNewAgencyDialog: 'ui/openNewAgencyDialog',
    }),
  },
}
</script>

<template lang="pug">
  md-empty-state(
  md-icon="people"
  md-label="No agencies"
  md-description="There are no agencies in the system yet."
  )
    md-button.md-raised.md-primary(@click="openNewAgencyDialog") Create new agency
</template>

<style scoped lang="sass">

</style>
