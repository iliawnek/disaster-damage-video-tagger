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
    const {videoId} = this.$route.params
    this.loadVideo({videoId})
  },

  computed: {
    ...mapState({
      video: (state) => state.video.video,
      isVideoLoaded: (state) => state.video.isVideoLoaded,
      tags: (state) => state.video.tags,
      areTagsLoaded: (state) => state.video.areTagsLoaded,
    }),
  },

  watch: {
    isVideoLoaded (newVal, oldVal) {
      // once video loads...
      if (newVal && !oldVal) {
        const videoId = this.video['.key']
        this.loadTags({videoId})
      }
    },
  },

  methods: {
    ...mapActions({
      loadVideo: 'video/loadVideo',
      loadTags: 'video/loadTags',
    }),
  },
}
</script>

<template lang="pug">
  #video
    video-tagger(
    :video="video"
    :isVideoLoaded="isVideoLoaded"
    )
    new-tag-dialog
    tag-list(
    :tags="tags"
    :areTagsLoaded="areTagsLoaded"
    )
</template>

<style scoped lang="sass">
</style>
