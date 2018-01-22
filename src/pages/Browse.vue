<script>
import {mapState, mapActions} from 'vuex'
import VideoList from '@/components/VideoList'
import EventList from '@/components/EventList'
import AddSpeedDial from '@/components/AddSpeedDial'
import BrowseAgencies from '@/pages/BrowseAgencies'

export default {
  name: 'Browse',

  components: {
    VideoList,
    EventList,
    AddSpeedDial,
    BrowseAgencies,
  },

  created () {
    this.loadVideos()
    this.loadEvents()
    this.activeTab = this.$route.name.toLowerCase()
  },

  data () {
    return {
      activeTab: 'videos',
    }
  },

  watch: {
    $route (newVal, oldVal) {
      if (newVal.name !== oldVal.name) {
        this.activeTab = this.$route.name.toLowerCase()
      }
    },
  },

  computed: {
    ...mapState({
      videos: (state) => state.video.videos,
      events: (state) => state.event.events,
    }),
  },

  methods: {
    ...mapActions({
      loadVideos: 'video/loadVideos',
      loadEvents: 'event/loadEvents',
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
    event-list(v-if="activeTab === 'events'" :events="events")
    browse-agencies(v-if="activeTab === 'agencies'")
    router-view
    add-speed-dial
</template>

<style scoped lang="sass">
  .browse
    margin-bottom: 100px // prevent add-speed-dial from obscuring content
</style>
