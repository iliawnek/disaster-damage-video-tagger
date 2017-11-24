<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'browse-videos',

  created () {
    this.loadVideos()
  },

  computed: {
    ...mapState({
      videos: state => state.video.videos,
      videosLoaded: state => state.video.videosLoaded,
    }),
    ...mapGetters({
      videosExist: 'video/videosExist',
    }),
  },

  methods: {
    ...mapMutations({
      openNewVideoDialog: 'ui/openNewVideoDialog',
    }),
    ...mapActions({
      loadVideos: 'video/loadVideos',
    }),
  },
}
</script>

<template lang="pug">
  #browse-videos
    md-empty-state(
    v-if="!videosExist && videosLoaded"
    md-icon="video_library"
    md-label="We're out of videos!"
    md-description="You can submit a video now, or check here later."
    )
      md-button.md-raised.md-primary(@click="openNewVideoDialog") Submit video
    md-list
      md-list-item(
      v-for="video in videos"
      :to="`/video/${video['.key']}`"
      :key="video['.key']"
      ) {{video.url}}
</template>

<style scoped lang="sass">
</style>
