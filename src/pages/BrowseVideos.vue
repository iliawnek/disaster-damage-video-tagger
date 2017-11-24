<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'browse-videos',

  created () {
    this.loadVideos()
  },

  computed: {
    ...mapState({
      videos: (state) => state.video.videos,
      areVideosLoaded: (state) => state.video.areVideosLoaded,
    }),
    ...mapGetters({
      doVideosExist: 'video/doVideosExist',
    }),
  },

  methods: {
    ...mapMutations({
      openNewVideoDialog: 'ui/openNewVideoDialog',
    }),
    ...mapActions({
      loadVideos: 'video/loadVideos',
    }),
    getEventById (eventId) {
      return this.$store.getters['event/getEventById'](eventId)
    },
    getLinkToVideo (video) {
      return this.$store.getters['video/getLinkToVideo'](video)
    },
  },
}
</script>

<template lang="pug">
  #browse-videos
    md-empty-state(
    v-if="!doVideosExist && areVideosLoaded"
    md-icon="video_library"
    md-label="We're out of videos!"
    md-description="You can submit a video now, or check here later."
    )
      md-button.md-raised.md-primary(@click="openNewVideoDialog") Submit video
    md-list.md-double-line
      md-list-item(
      v-for="video in videos"
      :to="getLinkToVideo(video)"
      :key="video['.key']"
      )
        .md-list-item-text
          span {{video.url}}
          span {{getEventById(video.event).name}}
</template>

<style scoped lang="sass">
</style>
