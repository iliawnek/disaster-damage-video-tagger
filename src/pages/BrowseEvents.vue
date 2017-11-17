<script>
import {mapMutations} from 'vuex'

export default {
  name: 'browse-events',
  methods: {
    ...mapMutations({
      openNewEventDialog: 'ui/openNewEventDialog',
    }),
  },
}
</script>

<template lang="pug">
  md-empty-state(
  md-icon="event"
  md-label="No events right now"
  md-description="As soon as an event occurs, it will appear here."
  )
    md-button.md-raised.md-primary(@click="openNewEventDialog") Create new event
</template>

<style scoped lang="sass">

</style>
