<script>
import {mapState, mapActions} from 'vuex'
import VideoList from '@/components/VideoList'
import AddSpeedDial from '@/components/AddSpeedDial'
import BrowseEvents from '@/pages/BrowseEvents'
import BrowseAgencies from '@/pages/BrowseAgencies'

export default {
  name: 'Browse',

  components: {
    VideoList,
    AddSpeedDial,
    BrowseEvents,
    BrowseAgencies,
  },

  created () {
    this.loadVideos()

    // activate tab based on route
    this.activeTab = this.$route.name.toLowerCase()
  },

  data () {
    return {
      activeTab: 'videos',
    }
  },

  computed: {
    ...mapState({
      videos: (state) => state.video.videos,
    }),
  },

  methods: {
    ...mapActions({
      loadVideos: 'video/loadVideos',
    }),
    handleTabChange (tab) {
      this.activeTab = tab
    },
  },
}
</script>

<template lang="pug">
  .browse
    md-tabs.md-primary(md-sync-route md-alignment="centered" @md-changed="handleTabChange")
      md-tab(md-label="Videos" to="/browse/videos" id="videos")
      md-tab(md-label="Events" to="/browse/events" id="events")
      md-tab(md-label="Agencies" to="/browse/agencies" id="agencies")
    video-list(v-if="activeTab === 'videos'" :videos="videos")
    browse-events(v-if="activeTab === 'events'")
    browse-agencies(v-if="activeTab === 'agencies'")
    router-view
    add-speed-dial
</template>

<style scoped lang="sass">
  .browse
    margin-bottom: 100px // prevent add-speed-dial from obscuring content
</style>
