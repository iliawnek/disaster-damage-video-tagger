<script>
import {mapState, mapActions} from 'vuex'
import {mapGettersWithParams} from '@/utilities'
import NewTagDialog from '@/components/NewTagDialog'
import VideoTagger from '@/components/VideoTagger'
import TagList from '@/components/TagList'
import VideoInfo from '@/components/VideoInfo'

export default {
  name: 'Video',

  components: {
    NewTagDialog,
    VideoTagger,
    TagList,
    VideoInfo,
  },

  created () {
    this.loadVideos()
    this.loadVideo()
    this.loadTags()
    this.loadVideosTags()
    this.loadEvents()
  },

  data () {
    return {
      video: null,
      tags: null,
      event: null,
    }
  },

  computed: {
    ...mapState({
      areVideosLoaded: (state) => state.video.areVideosLoaded,
      areTagsLoaded: (state) => state.tag.areTagsLoaded,
      areEventsLoaded: (state) => state.event.areEventsLoaded,
    }),
    canVideosEventBeLoaded () {
      return this.video && this.video.event && this.areEventsLoaded
    },
  },

  watch: {
    areVideosLoaded (newVal, oldVal) {
      if (newVal && !oldVal) this.loadVideo()
    },
    areTagsLoaded (newVal, oldVal) {
      if (newVal && !oldVal) this.loadVideosTags()
    },
    canVideosEventBeLoaded (newVal, oldVal) {
      if (newVal && !oldVal) this.loadVideosEvent()
    },
  },

  methods: {
    ...mapActions({
      loadVideos: 'video/loadVideos',
      loadTags: 'tag/loadTags',
      loadEvents: 'event/loadEvents',
    }),
    ...mapGettersWithParams({
      getVideoById: 'video/getVideoById',
      getTagsByVideoId: 'tag/getTagsByVideoId',
      getEventById: 'event/getEventById',
    }),
    loadVideo () {
      const {videoId} = this.$route.params
      this.video = this.getVideoById(videoId)
    },
    loadVideosTags () {
      const {videoId} = this.$route.params
      this.tags = this.getTagsByVideoId(videoId)
    },
    loadVideosEvent () {
      this.event = this.getEventById(this.video.event)
    },
  },
}
</script>

<template lang="pug">
  #video
    video-tagger(:video="video")
    video-info(:video="video" :event="event")
    tag-list(:tags="tags")
    new-tag-dialog
</template>

<style scoped lang="sass">
</style>
