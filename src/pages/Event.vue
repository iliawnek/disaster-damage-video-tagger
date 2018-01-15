<script>
import {mapState, mapActions} from 'vuex'
import {mapGettersWithParams} from '@/utilities'

export default {
  name: 'Event',

  created () {
    this.loadEvents()
    this.loadEvent()
    this.loadAgencies()
    this.loadVideos()
    this.loadTags()
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
    h1 event
    ul
      li name → {{event.name}}
      li id → {{event['.key']}}

    h1 agencies
    ul
      li(v-for="agency in agencies") {{agency.name}}

    h1 videos
    ul
      li(v-for="video in videos")
        img(:src="video.thumbnail")

    h1 tags
    ul
      li(v-for="tag in tags")
        img(:src="tag.crop.images.highlighted")
</template>

<style scoped lang="sass">
  img
    width: 160px
    height: 90px
    object-fit: contain
    background-color: black
    margin-bottom: 8px
</style>
