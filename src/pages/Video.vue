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
    this.loadTags()
    this.loadEvents()
  },

  computed: {
    ...mapState({
      areVideosLoaded: (state) => state.video.areVideosLoaded,
      areTagsLoaded: (state) => state.tag.areTagsLoaded,
      areEventsLoaded: (state) => state.event.areEventsLoaded,
    }),

    video () {
      const {videoId} = this.$route.params
      if (this.areVideosLoaded && videoId) {
        return this.getVideoById(videoId)
      }
    },
    tags () {
      const {videoId} = this.$route.params
      if (this.areTagsLoaded && videoId) {
        return this.getTagsByVideoId(videoId)
      }
    },
    event () {
      if (this.areEventsLoaded && this.video && this.video.event) {
        return this.getEventById(this.video.event)
      }
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
  },
}
</script>

<template lang="pug">
  #video(v-if="video")
    video-tagger(:video="video")
    video-info(:video="video" :event="event")
    tag-list(:tags="tags")
    new-tag-dialog
</template>

<style scoped lang="sass">
</style>
