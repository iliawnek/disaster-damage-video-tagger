<script>
import AddSpeedDial from '@/components/AddSpeedDial'
import BrowseVideos from '@/pages/BrowseVideos'
import BrowseEvents from '@/pages/BrowseEvents'
import BrowseAgencies from '@/pages/BrowseAgencies'

export default {
  name: 'Browse',
  components: {
    AddSpeedDial,
    BrowseVideos,
    BrowseEvents,
    BrowseAgencies,
  },
}
</script>

<template lang="pug">
  div
    md-tabs(md-sync-route md-alignment="centered")
      md-tab#tab-videos(md-label="Videos" to="/browse/videos")
        browse-videos
      md-tab#tab-events(md-label="Events" to="/browse/events")
        browse-events
      md-tab#tab-agencies(md-label="Agencies" to="/browse/agencies")
        browse-agencies
    router-view
    add-speed-dial
</template>

<style scoped lang="sass">

</style>
