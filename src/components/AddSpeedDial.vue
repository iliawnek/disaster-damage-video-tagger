<script>
import {mapMutations} from 'vuex'

export default {
  name: 'add-speed-dial',
  methods: {
    ...mapMutations({
      openNewAgencyDialog: 'ui/openNewAgencyDialog',
      openNewEventDialog: 'ui/openNewEventDialog',
      openNewVideoDialog: 'ui/openNewVideoDialog',
    }),
  },
}
</script>

<template lang="pug">
  md-speed-dial.md-bottom-right(md-direction="top")
    md-speed-dial-target(@click="openNewVideoDialog")
      md-icon add
    md-speed-dial-content
      // new agency
      md-button.md-icon-button.md-transparent(@click="openNewAgencyDialog")
        md-icon people
      // new event
      md-button.md-icon-button.md-transparent(@click="openNewEventDialog")
        md-icon event
</template>

<style scoped lang="sass">
  .md-speed-dial
    position: fixed
</style>
