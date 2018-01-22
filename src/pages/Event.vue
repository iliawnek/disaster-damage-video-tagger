<script>
import {mapState, mapActions} from 'vuex'
import {mapGettersWithParams} from '@/utilities'
import EventHeader from '@/components/EventHeader'
import VideoList from '@/components/VideoList'
import TagList from '@/components/TagList'
import AddSpeedDial from '@/components/AddSpeedDial'

export default {
  name: 'Event',

  created () {
    this.loadEvents()
    this.loadAgencies()
    this.loadVideos()
    this.loadTags()
  },

  components: {
    EventHeader,
    VideoList,
    TagList,
    AddSpeedDial,
  },

  data () {
    return {
      activeTab: 'videos',
    }
  },

  computed: {
    ...mapState({
      areEventsLoaded: (state) => state.event.areEventsLoaded,
      areAgenciesLoaded: (state) => state.agency.areAgenciesLoaded,
      areVideosLoaded: (state) => state.video.areVideosLoaded,
      areTagsLoaded: (state) => state.tag.areTagsLoaded,
    }),
    event () {
      if (this.areEventsLoaded && this.$route.params.eventId) {
        return this.getEventById(this.$route.params.eventId)
      }
    },
    agencies () {
      if (this.areAgenciesLoaded && this.event && this.event.agencies) {
        return this.getAgenciesByIds(Object.keys(this.event.agencies))
      }
    },
    videos () {
      if (this.areVideosLoaded && this.event && this.event.videos) {
        return this.getVideosByIds(Object.keys(this.event.videos))
      }
    },
    tags () {
      if (this.areTagsLoaded && this.event && this.event.videos) {
        return this.getTagsByVideoIds(Object.keys(this.event.videos))
      }
    },
    image () {
      if (this.event) {
        return this.getImage(this.event)
      }
    },
  },

  methods: {
    ...mapActions({
      loadEvents: 'event/loadEvents',
      loadAgencies: 'agency/loadAgencies',
      loadVideos: 'video/loadVideos',
      loadTags: 'tag/loadTags',
    }),
    ...mapGettersWithParams({
      getEventById: 'event/getEventById',
      getAgenciesByIds: 'agency/getAgenciesByIds',
      getVideosByIds: 'video/getVideosByIds',
      getTagsByVideoIds: 'tag/getTagsByVideoIds',
      getImage: 'event/getImage',
    }),
    handleTabChange (tab) {
      this.activeTab = tab
    },
  },
}
</script>

<template lang="pug">
  .event(v-if="event")
    event-header(
    :event="event"
    :agencies="agencies"
    :image="image"
    )
    md-tabs.md-primary(md-alignment="centered" @md-changed="handleTabChange")
      md-tab(id="videos" md-label="Videos")
      md-tab(id="tags" md-label="Tags")
    video-list(
    v-if="activeTab === 'videos'"
    :videos="videos"
    )
    tag-list(
    v-if="tags && (activeTab === 'tags')"
    :tags="tags"
    )
    add-speed-dial
</template>

<style scoped lang="sass">
  .event
    margin-bottom: 100px // prevent add-speed-dial from obscuring content
</style>
