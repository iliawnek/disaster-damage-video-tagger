<script>
import {mapState, mapActions} from 'vuex'
import {mapGettersWithParams} from '@/utilities'
import EventHeader from '@/components/EventHeader'
import VideoList from '@/components/VideoList'
import TagList from '@/components/TagList'

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
    'event-header': EventHeader,
    'video-list': VideoList,
    'tag-list': TagList,
  },

  data () {
    return {
      event: null,
      agencies: null,
      videos: null,
      tags: null,
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
  },
}
</script>

<template lang="pug">
  .event(v-if="event")
    event-header(
    :event="event"
    :image="videos && videos[0].thumbnail"
    )
    md-tabs.md-primary(md-alignment="centered")
      md-tab(md-label="Videos")
        video-list(
        v-if="videos"
        :videos="videos"
        )
      md-tab(md-label="Tags")
        tag-list(
        v-if="tags"
        :tags="tags"
        )
</template>

<style scoped lang="sass">
  img
    width: 160px
    height: 90px
    object-fit: contain
    background-color: black
    margin-bottom: 8px
</style>
