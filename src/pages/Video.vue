<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'Video',

  created () {
    const {videoId} = this.$route.params
    this.loadVideo({videoId})
  },

  computed: {
    ...mapState({
      video: (state) => state.video.video,
      isVideoLoaded: (state) => state.video.isVideoLoaded,
    }),
    options () {
      return {
        techOrder: [
          'youtube',
        ],
        sources: {
          type: 'video/youtube',
          src: `https://youtu.be/${this.video.sourceId}`,
        },
      }
    },
  },

  methods: {
    ...mapActions({
      loadVideo: 'video/loadVideo',
    }),
  },
}
</script>

<template lang="pug">
  video-player(
  v-if="isVideoLoaded"
  :options="options"
  )
</template>

<style scoped lang="sass">
</style>
