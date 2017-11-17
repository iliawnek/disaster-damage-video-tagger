<script>
import AddSpeedDial from '@/components/AddSpeedDial'

export default {
  name: 'Browse',
  components: {
    AddSpeedDial,
  },
}
</script>

<template lang="pug">
  div
    md-tabs(md-sync-route md-alignment="centered")
      md-tab#tab-videos(md-label="Videos" to="/browse/videos")
      md-tab#tab-events(md-label="Events" to="/browse/events")
      md-tab#tab-agencies(md-label="Agencies" to="/browse/agencies")
    router-view
    add-speed-dial
</template>

<style scoped lang="sass">

</style>
