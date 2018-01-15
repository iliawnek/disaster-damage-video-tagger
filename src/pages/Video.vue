<script>
import {mapState, mapActions} from 'vuex'
import NewTagDialog from '@/components/NewTagDialog'
import VideoTagger from '@/components/VideoTagger'
import TagList from '@/components/TagList'

export default {
  name: 'Video',

  components: {
    'new-tag-dialog': NewTagDialog,
    'video-tagger': VideoTagger,
    'tag-list': TagList,
  },

  created () {
    // get video and tags if already loaded
    const {videoId} = this.$route.params
    this.video = this.getVideoById(videoId)
    this.tags = this.getTagsByVideoId(videoId)

    // load videos and tags if not already loaded
    this.loadVideos()
    this.loadTags()
  },

  data () {
    return {
      video: null,
      tags: null,
    }
  },

  computed: {
    ...mapState({
      areVideosLoaded: (state) => state.video.areVideosLoaded,
      areTagsLoaded: (state) => state.tag.areTagsLoaded,
    }),
  },

  watch: {
    areVideosLoaded (newVal, oldVal) {
      if (newVal && !oldVal) {
        const {videoId} = this.$route.params
        this.video = this.getVideoById(videoId)
      }
    },
    areTagsLoaded (newVal, oldVal) {
      if (newVal && !oldVal) {
        const {videoId} = this.$route.params
        this.tags = this.getTagsByVideoId(videoId)
      }
    },
  },

  methods: {
    ...mapActions({
      loadVideos: 'video/loadVideos',
      loadTags: 'tag/loadTags',
    }),
    getVideoById (videoId) {
      return this.$store.getters['video/getVideoById'](videoId)
    },
    getTagsByVideoId (videoId) {
      return this.$store.getters['tag/getTagsByVideoId'](videoId)
    },
  },
}
</script>

<template lang="pug">
  #video
    video-tagger(
    :video="video"
    )
    new-tag-dialog
    tag-list(
    :tags="tags"
    )
</template>

<style scoped lang="sass">
</style>
