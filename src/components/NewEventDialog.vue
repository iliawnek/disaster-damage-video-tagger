<script>
import {mapState} from 'vuex'
import {mapBoolean} from '@/utilities'

export default {
  name: 'new-event-dialog',
  computed: {
    ...mapState({
      isNewEventDialogOpen: 'ui/isNewEventDialogOpen',
    }),
    ...mapBoolean({
      namespace: 'ui',
      key: 'isNewEventDialogOpen',
      setTrue: 'openNewEventDialog',
      setFalse: 'closeNewEventDialog',
    }),
  },
}
</script>

<template lang="pug">
  md-dialog(:md-active.sync="isNewEventDialogOpen")
    md-dialog-title Create new event
</template>

<style scoped lang="sass">

</style>
