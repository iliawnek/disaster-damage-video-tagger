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
    this.loadEvent()
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
      event: null,
      agencies: null,
      videos: null,
      tags: null,
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
    canEventsAgenciesBeLoaded () {
      return this.event && this.event.agencies && this.areAgenciesLoaded
    },
    canEventsVideosBeLoaded () {
      return this.event && this.event.videos && this.areVideosLoaded
    },
    canEventsTagsBeLoaded () {
      return this.event && this.event.videos && this.areTagsLoaded
    },
  },

  watch: {
    areEventsLoaded (newVal, oldVal) {
      if (newVal && !oldVal) this.loadEvent()
    },
    canEventsAgenciesBeLoaded (newVal, oldVal) {
      if (newVal && !oldVal) this.loadEventsAgencies()
    },
    canEventsVideosBeLoaded (newVal, oldVal) {
      if (newVal && !oldVal) this.loadEventsVideos()
    },
    canEventsTagsBeLoaded (newVal, oldVal) {
      if (newVal && !oldVal) this.loadEventsTags()
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
    }),
    loadEvent () {
      const {eventId} = this.$route.params
      this.event = this.getEventById(eventId)
    },
    loadEventsAgencies () {
      this.agencies = this.getAgenciesByIds(Object.keys(this.event.agencies))
    },
    loadEventsVideos () {
      this.videos = this.getVideosByIds(Object.keys(this.event.videos))
    },
    loadEventsTags () {
      this.tags = this.getTagsByVideoIds(Object.keys(this.event.videos))
    },
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
    :image="videos && videos[0].thumbnail"
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
